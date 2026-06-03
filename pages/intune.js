import { go } from '../app.js'
import { showToast } from '../components/toast.js'
import {
  INTUNE_SUMMARY, PLATFORM_DISTRIBUTION, DEVICE_COMPLIANCE_POLICIES, DEVICE_INVENTORY,
  ENDPOINT_SECURITY_ASSESSMENT, PATCH_MANAGEMENT, APPLICATION_INVENTORY,
  DEVICE_RISK_ASSESSMENT, CONDITIONAL_ACCESS_POLICIES, CONFIGURATION_POLICIES,
  SECURITY_BASELINE_COMPARISON, DEVICE_HEALTH_CALCULATION, INTUNE_RECOMMENDATIONS,
  INTUNE_COPILOT_KB
} from '../data/intune-data.js'

let activeSection = 'executive'
let copilotMessages = []
let copilotInit = false

const INTUNE_TABS = [
  { id: 'executive',      label: 'Executive',           icon: 'ti-layout-dashboard' },
  { id: 'health',         label: 'Device Health',       icon: 'ti-heartbeat' },
  { id: 'compliance',     label: 'Compliance',          icon: 'ti-check-circle' },
  { id: 'inventory',      label: 'Device Inventory',    icon: 'ti-device-laptop' },
  { id: 'security',       label: 'Endpoint Security',   icon: 'ti-shield-check' },
  { id: 'patches',        label: 'Patch Management',    icon: 'ti-refresh' },
  { id: 'apps',           label: 'Applications',        icon: 'ti-app-window' },
  { id: 'risk',           label: 'Risk Assessment',     icon: 'ti-alert-triangle' },
  { id: 'policies',       label: 'Policies',            icon: 'ti-settings-2' },
  { id: 'recommendations',label: 'Recommendations',     icon: 'ti-checklist' },
  { id: 'copilot',        label: 'Intune Copilot',      icon: 'ti-robot' },
]

export function initIntune() {
  const el = document.getElementById('page-intune')
  if (!el) return
  render(el)
}

function render(el) {
  const s = INTUNE_SUMMARY
  const criticalRisks = DEVICE_RISK_ASSESSMENT.filter(d => d.severity === 'critical').length
  const highRisks = DEVICE_RISK_ASSESSMENT.filter(d => d.severity === 'high').length

  el.innerHTML = `
    <div class="page-header">
      <div>
        <div class="page-title"><i class="ti ti-device-laptop"></i> Microsoft Intune Insights</div>
        <div class="page-subtitle">Device Management & Security Assessment · ${s.totalManagedDevices} devices managed · Last sync: Today 08:45</div>
      </div>
      <div class="page-actions">
        <button class="btn" id="intune-refresh"><i class="ti ti-refresh"></i> Refresh</button>
        <button class="btn btn-primary" id="intune-remediate"><i class="ti ti-send"></i> Remediate critical</button>
      </div>
    </div>

    <!-- Top-5 KPI strip -->
    <div class="kpi-row mb-3">
      <div class="kpi-tile">
        <div class="kpi-value info">${s.totalManagedDevices}</div>
        <div class="kpi-label">Managed Devices</div>
        <div style="font-size:10px;margin-top:3px;color:var(--color-text-tertiary)">${s.activeDevices} active</div>
      </div>
      <div class="kpi-tile">
        <div class="kpi-value ${s.compliancePercentage >= 95 ? 'success' : 'warning'}">${s.compliancePercentage}%</div>
        <div class="kpi-label">Compliance</div>
        <div style="font-size:10px;margin-top:3px;color:var(--color-text-tertiary)">${s.nonCompliant} non-compliant</div>
      </div>
      <div class="kpi-tile">
        <div class="kpi-value warning">${s.patchCompliance}%</div>
        <div class="kpi-label">Patch Status</div>
        <div style="font-size:10px;margin-top:3px;color:var(--color-text-tertiary)">${PATCH_MANAGEMENT.criticalUpdatesMissing} critical</div>
      </div>
      <div class="kpi-tile">
        <div class="kpi-value ${s.encryptionCoverage >= 95 ? 'success' : 'warning'}">${s.encryptionCoverage}%</div>
        <div class="kpi-label">Encryption</div>
      </div>
      <div class="kpi-tile">
        <div class="kpi-value ${criticalRisks > 0 ? 'danger' : 'warning'}">${criticalRisks + highRisks}</div>
        <div class="kpi-label">At-Risk Devices</div>
        <div style="font-size:10px;margin-top:3px;color:var(--color-text-tertiary)">${criticalRisks} critical</div>
      </div>
      <div class="kpi-tile">
        <div class="kpi-value ${s.deviceHealthScore >= 75 ? 'success' : 'warning'}">${s.deviceHealthScore}</div>
        <div class="kpi-label">Health Score</div>
        <div style="font-size:10px;margin-top:3px;color:var(--color-text-tertiary)">0-100 scale</div>
      </div>
    </div>

    <!-- Sub-navigation -->
    <div class="intune-subnav" id="intune-subnav">
      ${INTUNE_TABS.map(t => `
        <button class="intune-tab-btn ${activeSection === t.id ? 'active' : ''}" data-intune-section="${t.id}">
          <i class="ti ${t.icon}"></i><span>${t.label}</span>
          ${t.id === 'risk' && criticalRisks > 0 ? `<span class="intune-tab-badge red">${criticalRisks}</span>` : ''}
          ${t.id === 'compliance' && s.nonCompliant > 0 ? `<span class="intune-tab-badge red">${s.nonCompliant}</span>` : ''}
          ${t.id === 'patches' && PATCH_MANAGEMENT.criticalUpdatesMissing > 0 ? `<span class="intune-tab-badge red">${PATCH_MANAGEMENT.criticalUpdatesMissing}</span>` : ''}
          ${t.id === 'recommendations' ? `<span class="intune-tab-badge amber">${INTUNE_RECOMMENDATIONS.length}</span>` : ''}
        </button>
      `).join('')}
    </div>

    <!-- Content -->
    <div id="intune-content" style="margin-top:16px">${renderSection()}</div>
  `

  el.querySelectorAll('.intune-tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      activeSection = btn.dataset.intuneSection
      render(el)
    })
  })

  el.querySelector('#intune-refresh')?.addEventListener('click', () => {
    const btn = el.querySelector('#intune-refresh')
    btn.innerHTML = `<span class="spinner dark"></span> Scanning...`
    btn.disabled = true
    setTimeout(() => {
      btn.innerHTML = `<i class="ti ti-refresh"></i> Refresh`
      btn.disabled = false
      showToast('Intune inventory updated — 847 devices scanned, 4 compliance policies evaluated.', 'success')
    }, 2200)
  })

  el.querySelector('#intune-remediate')?.addEventListener('click', () => showToast('Remediation workflow initiated — ${criticalRisks} critical devices tagged for action.', 'info'))

  wireSection(el)
}

function renderSection() {
  const map = {
    executive:       renderExecutive,
    health:          renderDeviceHealth,
    compliance:      renderCompliance,
    inventory:       renderInventory,
    security:        renderEndpointSecurity,
    patches:         renderPatchManagement,
    apps:            renderApplications,
    risk:            renderRiskAssessment,
    policies:        renderPolicies,
    recommendations: renderRecommendations,
    copilot:         renderIntuneCopilot,
  }
  return (map[activeSection] || renderExecutive)()
}

// ============================================================
// EXECUTIVE DASHBOARD
// ============================================================
function renderExecutive() {
  const s = INTUNE_SUMMARY
  const p = PLATFORM_DISTRIBUTION

  return `
    <div class="grid-2 mb-3" style="gap:16px">
      <div class="card">
        <div class="card-header">
          <span class="card-title"><i class="ti ti-layout-dashboard"></i> Device Overview</span>
        </div>
        ${metricGrid([
          { label: 'Total Managed',       val: s.totalManagedDevices, cls: 'info' },
          { label: 'Active',              val: s.activeDevices, cls: 'success' },
          { label: 'Inactive',            val: s.inactiveDevices, cls: 'warning' },
          { label: 'Non-Compliant',       val: s.nonCompliant, cls: 'danger' },
          { label: 'Unmanaged',           val: s.unmanaged, cls: 'warning' },
          { label: 'Corporate / BYOD',    val: `${s.corporateDevices} / ${s.byodDevices}`, cls: 'info' },
        ])}
      </div>

      <div class="card">
        <div class="card-header">
          <span class="card-title"><i class="ti ti-chart-pie"></i> Platform Distribution</span>
        </div>
        ${['windows', 'macos', 'ios', 'android', 'linux'].map(os => {
          const d = p[os]
          return `
            <div style="margin-bottom:10px">
              <div style="display:flex;justify-content:space-between;margin-bottom:4px;font-size:11px;font-weight:600">
                <span style="text-transform:capitalize">${os}</span>
                <span>${d.count} (${d.percentage}%)</span>
              </div>
              <div class="score-bar" style="height:8px">
                <div class="score-bar-fill" style="width:${d.percentage}%"></div>
              </div>
              <div style="font-size:10px;color:var(--color-text-tertiary);margin-top:2px">${d.compliant} compliant · ${d.nonCompliant} non-compliant</div>
            </div>
          `
        }).join('')}
      </div>
    </div>

    <div class="card mb-3">
      <div class="card-header">
        <span class="card-title"><i class="ti ti-alert-triangle"></i> Critical Issues Summary</span>
      </div>
      <div class="alert-banner danger mb-3">
        <i class="ti ti-alert-triangle"></i>
        <span><strong>${DEVICE_RISK_ASSESSMENT.filter(d => d.severity === 'critical').length} critical risk devices</strong> require immediate attention</span>
      </div>
      ${DEVICE_RISK_ASSESSMENT.filter(d => d.severity === 'critical').map(d => `
        <div style="padding:8px 10px;background:var(--clr-danger-bg);color:var(--clr-danger-text);border-radius:var(--border-radius-md);margin-bottom:6px;font-size:11px">
          <div style="font-weight:700">${d.deviceName}</div>
          <div style="font-size:10px;margin-top:2px">Risk: ${d.riskScore}/100 · ${d.risks.join(' · ')}</div>
        </div>
      `).join('')}
    </div>

    <div class="grid-2" style="gap:16px">
      <div class="card">
        <div class="card-header">
          <span class="card-title"><i class="ti ti-heartbeat"></i> Security Baseline Compliance</span>
        </div>
        ${['windowsBaseline', 'defenderBaseline', 'edgeBaseline', 'msAppsBaseline'].map((bl, i) => {
          const baseline = SECURITY_BASELINE_COMPARISON[bl]
          const labels = ['Windows', 'Defender', 'Edge', 'M365 Apps']
          return `
            <div style="margin-bottom:10px">
              <div style="display:flex;justify-content:space-between;margin-bottom:4px;font-size:11px;font-weight:600">
                <span>${labels[i]}</span>
                <span style="color:${baseline.score >= 90 ? 'var(--clr-success-text)' : 'var(--clr-warning-text)'}">${baseline.score}/100</span>
              </div>
              <div class="score-bar" style="height:8px">
                <div class="score-bar-fill ${baseline.score >= 90 ? 'success' : 'warning'}" style="width:${baseline.score}%"></div>
              </div>
            </div>
          `
        }).join('')}
      </div>

      <div class="card">
        <div class="card-header">
          <span class="card-title"><i class="ti ti-chart-line"></i> Top Recommendations</span>
        </div>
        ${INTUNE_RECOMMENDATIONS.filter(r => r.priority === 'critical').slice(0, 4).map(r => `
          <div style="display:flex;gap:8px;padding:6px 0;border-bottom:0.5px solid var(--color-border-tertiary);font-size:11px">
            <span class="badge danger" style="flex-shrink:0;min-width:56px;justify-content:center">${r.priority}</span>
            <span style="flex:1">${r.title}</span>
          </div>
        `).join('')}
      </div>
    </div>
  `
}

// ============================================================
// DEVICE HEALTH
// ============================================================
function renderDeviceHealth() {
  const s = INTUNE_SUMMARY
  const avgHealth = Math.round(DEVICE_HEALTH_CALCULATION.reduce((a, d) => a + d.healthScore, 0) / DEVICE_HEALTH_CALCULATION.length)

  return `
    <div class="kpi-row mb-3">
      <div class="kpi-tile">
        <div class="kpi-value ${s.deviceHealthScore >= 75 ? 'success' : 'warning'}">${s.deviceHealthScore}</div>
        <div class="kpi-label">Tenant Health Score</div>
        <div style="font-size:10px;margin-top:3px">Range: 0-100 (higher is better)</div>
      </div>
      <div class="kpi-tile">
        <div class="kpi-value success">${s.encryptionCoverage}%</div>
        <div class="kpi-label">Encryption Coverage</div>
      </div>
      <div class="kpi-tile">
        <div class="kpi-value success">${s.compliancePercentage}%</div>
        <div class="kpi-label">Compliance Rate</div>
      </div>
      <div class="kpi-tile">
        <div class="kpi-value warning">${s.patchCompliance}%</div>
        <div class="kpi-label">Patch Compliance</div>
      </div>
      <div class="kpi-tile">
        <div class="kpi-value success">${s.endpointProtection}%</div>
        <div class="kpi-label">Endpoint Protection</div>
      </div>
    </div>

    <div class="card mb-3">
      <div class="card-title mb-2"><i class="ti ti-heartbeat"></i> Device Health Details</div>
      <table style="width:100%;font-size:11px">
        <thead><tr>
          <th style="width:22%">Device</th>
          <th style="width:12%">Encryption</th>
          <th style="width:12%">Compliance</th>
          <th style="width:12%">Patching</th>
          <th style="width:12%">EP Score</th>
          <th style="width:15%">Health</th>
          <th style="width:15%">Risk Level</th>
        </tr></thead>
        <tbody>
          ${DEVICE_HEALTH_CALCULATION.map(d => `
            <tr>
              <td style="font-weight:600">${d.name}</td>
              <td>${d.encryptionScore}</td>
              <td>${d.complianceScore}</td>
              <td>${d.patchScore}</td>
              <td>${d.epScore}</td>
              <td><span class="badge ${d.healthScore >= 80 ? 'success' : d.healthScore >= 60 ? 'warning' : 'danger'}">${d.healthScore}/100</span></td>
              <td><span class="badge ${d.riskLevel === 'low' ? 'success' : d.riskLevel === 'high' ? 'danger' : 'warning'}">${d.riskLevel}</span></td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>
  `
}

// ============================================================
// COMPLIANCE
// ============================================================
function renderCompliance() {
  return `
    <div class="kpi-row mb-3">
      <div class="kpi-tile">
        <div class="kpi-value success">${INTUNE_SUMMARY.compliancePercentage}%</div>
        <div class="kpi-label">Overall Compliance</div>
      </div>
      <div class="kpi-tile">
        <div class="kpi-value success">${821}</div>
        <div class="kpi-label">Compliant Devices</div>
      </div>
      <div class="kpi-tile">
        <div class="kpi-value danger">${INTUNE_SUMMARY.nonCompliant}</div>
        <div class="kpi-label">Non-Compliant</div>
      </div>
      <div class="kpi-tile">
        <div class="kpi-value info">${0}</div>
        <div class="kpi-label">Pending Evaluation</div>
      </div>
      <div class="kpi-tile">
        <div class="kpi-value warning">${INTUNE_SUMMARY.unmanaged}</div>
        <div class="kpi-label">Unmanaged Devices</div>
      </div>
    </div>

    <div class="card" style="padding:0;overflow:hidden">
      <table>
        <thead><tr>
          <th style="width:30%">Policy</th>
          <th style="width:15%">Assigned</th>
          <th style="width:15%">Compliant</th>
          <th style="width:15%">Non-Compliant</th>
          <th style="width:15%">Pending</th>
          <th style="width:10%">Coverage</th>
        </tr></thead>
        <tbody>
          ${DEVICE_COMPLIANCE_POLICIES.map(p => `
            <tr>
              <td style="font-weight:600">${p.name}</td>
              <td>${p.assignedDevices}</td>
              <td style="color:var(--clr-success-text);font-weight:600">${p.compliant}</td>
              <td style="color:var(--clr-danger-text);font-weight:600">${p.nonCompliant}</td>
              <td>${p.pending}</td>
              <td><span class="badge success">${p.coverage}%</span></td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>
  `
}

// ============================================================
// DEVICE INVENTORY
// ============================================================
function renderInventory() {
  return `
    <div class="filter-bar mb-3">
      <select class="form-select" style="min-width:120px">
        <option>All Compliance</option>
        <option>Compliant</option>
        <option>Non-Compliant</option>
      </select>
      <select class="form-select" style="min-width:100px">
        <option>All Types</option>
        <option>Windows</option>
        <option>macOS</option>
        <option>iOS</option>
        <option>Android</option>
      </select>
    </div>

    <div class="card" style="padding:0;overflow:hidden">
      <table style="font-size:11px">
        <thead><tr>
          <th style="width:15%">Device Name</th>
          <th style="width:10%">Type</th>
          <th style="width:12%">Model</th>
          <th style="width:10%">OS Version</th>
          <th style="width:12%">Last Sync</th>
          <th style="width:12%">Owner</th>
          <th style="width:12%">Compliance</th>
          <th style="width:7%">Encryption</th>
          <th style="width:7%">Risk</th>
        </tr></thead>
        <tbody>
          ${DEVICE_INVENTORY.slice(0, 8).map(d => `
            <tr>
              <td style="font-weight:600">${d.name}</td>
              <td>${d.type}</td>
              <td>${d.model}</td>
              <td style="font-size:10px">${d.osVersion}</td>
              <td style="font-size:10px">${d.lastSync}</td>
              <td>${d.owner}</td>
              <td><span class="badge ${d.compliance === 'compliant' ? 'success' : 'danger'}">${d.compliance}</span></td>
              <td>${d.encryption ? '✓' : '✗'}</td>
              <td><span style="font-weight:700;color:${d.riskLevel === 'critical' ? 'var(--clr-danger-text)' : d.riskLevel === 'high' ? 'var(--clr-warning-text)' : 'var(--clr-success-text)'}">${d.riskLevel === 'critical' ? '🔴' : d.riskLevel === 'high' ? '🟠' : '🟢'}</span></td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>
  `
}

// ============================================================
// ENDPOINT SECURITY
// ============================================================
function renderEndpointSecurity() {
  const e = ENDPOINT_SECURITY_ASSESSMENT
  return `
    <div class="grid-2 mb-3" style="gap:16px">
      <div class="card">
        <div class="card-title mb-3"><i class="ti ti-shield-check"></i> Antivirus & Firewall</div>
        ${metricGrid([
          { label: 'Defender Enabled',    val: e.antivirus.defenderEnabled, cls: 'success' },
          { label: 'Real-Time Protection',val: e.antivirus.realTimeProtection, cls: 'success' },
          { label: 'Cloud Protection',    val: e.antivirus.cloudProtection, cls: 'success' },
          { label: 'Firewall Enabled',    val: e.firewall.enabled, cls: 'success' },
        ])}
      </div>

      <div class="card">
        <div class="card-title mb-3"><i class="ti ti-lock"></i> Protection Coverage</div>
        ${[
          { label: 'Defender', pct: e.antivirus.coverage, target: 100 },
          { label: 'Firewall', pct: e.firewall.coverage, target: 100 },
          { label: 'SmartScreen', pct: e.smartscreen.coverage, target: 100 },
          { label: 'ASR Rules', pct: e.asr.coverage, target: 100 },
        ].map(item => `
          <div class="score-bar-row mb-2">
            <span class="score-label" style="min-width:100px">${item.label}</span>
            <div class="score-bar" style="flex:1;height:8px">
              <div class="score-bar-fill ${item.pct >= 90 ? 'success' : item.pct >= 70 ? 'warning' : 'danger'}" style="width:${item.pct}%"></div>
            </div>
            <span class="score-pct">${item.pct}%</span>
          </div>
        `).join('')}
      </div>
    </div>

    <div class="card">
      <div class="card-header">
        <span class="card-title"><i class="ti ti-alert-triangle"></i> Security Gaps</span>
      </div>
      <div style="font-size:11px">
        <div style="margin-bottom:10px">
          <span class="badge warning" style="margin-bottom:4px">ASR Rules Not Deployed</span>
          <div style="color:var(--color-text-secondary);margin-top:4px">260 devices missing advanced endpoint protection rules</div>
        </div>
        <div>
          <span class="badge warning" style="margin-bottom:4px">SmartScreen Gap</span>
          <div style="color:var(--color-text-secondary);margin-top:4px">146 devices without SmartScreen enabled</div>
        </div>
      </div>
    </div>
  `
}

// ============================================================
// PATCH MANAGEMENT
// ============================================================
function renderPatchManagement() {
  return `
    <div class="alert-banner danger mb-3">
      <i class="ti ti-alert-triangle"></i>
      <span><strong>${PATCH_MANAGEMENT.criticalUpdatesMissing} devices missing critical updates</strong> — schedule patching immediately</span>
    </div>

    <div class="kpi-row mb-3">
      <div class="kpi-tile">
        <div class="kpi-value warning">${PATCH_MANAGEMENT.compliancePercentage}%</div>
        <div class="kpi-label">Patch Compliance</div>
      </div>
      <div class="kpi-tile">
        <div class="kpi-value danger">${PATCH_MANAGEMENT.criticalUpdatesMissing}</div>
        <div class="kpi-label">Critical Updates</div>
      </div>
      <div class="kpi-tile">
        <div class="kpi-value warning">${PATCH_MANAGEMENT.securityUpdatesMissing}</div>
        <div class="kpi-label">Security Updates</div>
      </div>
      <div class="kpi-tile">
        <div class="kpi-value info">${PATCH_MANAGEMENT.avgDaysBehind}</div>
        <div class="kpi-label">Avg Days Behind</div>
      </div>
    </div>

    <div class="card">
      <div class="card-title mb-2">Devices with Missing Critical Updates</div>
      ${PATCH_MANAGEMENT.devices.map(d => `
        <div style="padding:10px;background:var(--clr-${d.severity === 'critical' ? 'danger' : 'warning'}-bg);color:var(--clr-${d.severity}-text);border-radius:var(--border-radius-md);margin-bottom:8px">
          <div style="display:flex;justify-content:space-between;font-weight:700">${d.name} <span>${d.missingUpdates} updates</span></div>
          <div style="font-size:10px;margin-top:3px">${d.daysBehind} days behind schedule</div>
        </div>
      `).join('')}
    </div>
  `
}

// ============================================================
// APPLICATIONS
// ============================================================
function renderApplications() {
  return `
    <div class="grid-2 mb-3" style="gap:16px">
      ${APPLICATION_INVENTORY.map(app => `
        <div class="card">
          <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px">
            <div style="font-weight:700">${app.name}</div>
            <span class="badge ${app.status === 'compliant' ? 'success' : app.status === 'warning' ? 'warning' : 'danger'}">${app.status}</span>
          </div>
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;font-size:10px">
            <div><div style="color:var(--color-text-tertiary)">Deployed</div><div style="font-weight:700">${app.deployedDevices}</div></div>
            <div><div style="color:var(--color-text-tertiary)">Outdated</div><div style="font-weight:700;color:${app.outdated > 0 ? 'var(--clr-warning-text)' : 'var(--clr-success-text)'}">${app.outdated}</div></div>
            <div><div style="color:var(--color-text-tertiary)">Unauthorized</div><div style="font-weight:700;color:${app.unauthorized > 0 ? 'var(--clr-danger-text)' : 'var(--clr-success-text)'}">${app.unauthorized}</div></div>
          </div>
        </div>
      `).join('')}
    </div>
  `
}

// ============================================================
// RISK ASSESSMENT
// ============================================================
function renderRiskAssessment() {
  return `
    ${DEVICE_RISK_ASSESSMENT.map(d => `
      <div class="card mb-2" style="border-left:3px solid ${d.severity === 'critical' ? 'var(--clr-danger-text)' : 'var(--clr-warning-text)'}">
        <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:8px">
          <div>
            <div style="font-size:14px;font-weight:800;color:${d.severity === 'critical' ? 'var(--clr-danger-text)' : 'var(--clr-warning-text)'}">${d.riskScore}/100</div>
            <div style="font-weight:700;margin-top:4px">${d.deviceName}</div>
            <div style="font-size:10px;color:var(--color-text-tertiary)">${d.owner}</div>
          </div>
          <span class="badge ${d.severity === 'critical' ? 'danger' : 'warning'}">${d.severity}</span>
        </div>
        <div style="display:flex;flex-wrap:wrap;gap:4px">
          ${d.risks.map(r => `<span class="badge danger" style="font-size:9px">${r}</span>`).join('')}
        </div>
      </div>
    `).join('')}
  `
}

// ============================================================
// POLICIES
// ============================================================
function renderPolicies() {
  return `
    <div class="section-heading">Configuration Policies (${CONFIGURATION_POLICIES.length})</div>
    ${CONFIGURATION_POLICIES.map(p => `
      <div style="padding:10px;background:var(--color-background-secondary);border-radius:var(--border-radius-md);margin-bottom:8px">
        <div style="display:flex;justify-content:space-between;font-weight:700;margin-bottom:4px">${p.name}</div>
        <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:8px;font-size:10px">
          <div><span style="color:var(--color-text-tertiary)">Assigned:</span> ${p.assigned}</div>
          <div><span style="color:var(--clr-success-text);font-weight:600">✓</span> ${p.compliant}</div>
          <div><span style="color:var(--clr-danger-text);font-weight:600">✗</span> ${p.nonCompliant}</div>
        </div>
      </div>
    `).join('')}

    <div class="section-heading mt-4">Conditional Access Policies</div>
    ${CONDITIONAL_ACCESS_POLICIES.map(p => `
      <div style="padding:10px;background:${p.enabled ? 'var(--clr-success-bg)' : 'var(--color-background-secondary)'};border-radius:var(--border-radius-md);margin-bottom:6px">
        <div style="display:flex;justify-content:space-between">
          <span style="font-weight:700">${p.name}</span>
          <span class="badge ${p.enabled ? 'success' : 'neutral'}">${p.enabled ? 'Enabled' : 'Disabled'}</span>
        </div>
      </div>
    `).join('')}
  `
}

// ============================================================
// RECOMMENDATIONS
// ============================================================
function renderRecommendations() {
  return `
    <div class="card" style="padding:0;overflow:hidden">
      <table>
        <thead><tr>
          <th style="width:11%">Priority</th>
          <th style="width:38%">Recommendation</th>
          <th style="width:12%">Category</th>
          <th style="width:12%">Impact</th>
          <th style="width:12%">Effort</th>
          <th style="width:15%">Status</th>
        </tr></thead>
        <tbody>
          ${INTUNE_RECOMMENDATIONS.map(r => `
            <tr>
              <td><span class="badge ${r.priority === 'critical' ? 'danger' : r.priority === 'high' ? 'warning' : 'info'}">${r.priority}</span></td>
              <td style="font-size:11px;font-weight:500">${r.title}</td>
              <td><span class="pill">${r.category}</span></td>
              <td style="font-size:11px">${r.impact}</td>
              <td><span class="pill">${r.effort}</span></td>
              <td><span class="badge warning">${r.status}</span></td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>
  `
}

// ============================================================
// INTUNE COPILOT
// ============================================================
function renderIntuneCopilot() {
  if (!copilotInit) {
    copilotMessages = [{
      role: 'ai',
      text: `**Intune Security Advisor** — Ask me about device health, compliance, security posture, patch status, or remediation recommendations.\n\n**Current state:** 847 managed devices, 98.2% compliant, 74/100 health score, 2 critical risks`
    }]
    copilotInit = true
  }

  const suggestions = [
    'Show device health summary',
    'Patch management status',
    'Encryption coverage',
    'Firewall & protection status',
    'Critical risk devices',
    'Compliance policies',
  ]

  return `
    <div style="display:flex;flex-direction:column;height:calc(100vh - 340px);min-height:450px">
      <div style="overflow-y:auto;flex:1;padding-bottom:8px" id="intune-cop-msgs">
        ${copilotMessages.map(m => `
          <div class="chat-msg ${m.role === 'ai' ? 'ai' : 'user-msg'}" style="max-width:85%;margin-bottom:12px">
            ${m.role === 'ai' ? `<div class="chat-sender"><i class="ti ti-robot" style="color:var(--clr-info-text)"></i> Intune Advisor</div>` : `<div class="chat-sender" style="justify-content:flex-end">You</div>`}
            <div class="chat-bubble">${formatMsg(m.text)}</div>
          </div>
        `).join('')}
      </div>

      <div style="display:flex;flex-wrap:wrap;gap:5px;padding:8px 0;border-top:0.5px solid var(--color-border-tertiary)">
        ${suggestions.map(s => `<button class="suggestion-pill intune-cop-pill" data-q="${s}">${s}</button>`).join('')}
      </div>

      <div class="chat-input-area" style="padding:0;border-top:none;margin-top:4px">
        <textarea class="chat-input" id="intune-cop-input" placeholder="Ask about device health, compliance, security..." rows="1"></textarea>
        <button class="btn btn-primary" id="intune-cop-send"><i class="ti ti-send"></i></button>
      </div>
    </div>
  `
}

// ============================================================
// Utilities
// ============================================================
function metricGrid(metrics) {
  return `<div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:4px">
    ${metrics.map(m => `
      <div style="padding:8px 10px;background:var(--color-background-secondary);border-radius:var(--border-radius-md)">
        <div style="font-size:10px;color:var(--color-text-tertiary);margin-bottom:3px;text-transform:uppercase;font-weight:600">${m.label}</div>
        <div style="font-size:16px;font-weight:700;color:${
          m.cls === 'success' ? 'var(--clr-success-text)' :
          m.cls === 'danger'  ? 'var(--clr-danger-text)' :
          m.cls === 'warning' ? 'var(--clr-warning-text)' :
          'var(--clr-info-text)'
        }">${m.val}</div>
      </div>
    `).join('')}
  </div>`
}

function wireSection(el) {
  const content = el.querySelector('#intune-content')
  if (!content) return

  const copSend = content.querySelector('#intune-cop-send')
  const copInput = content.querySelector('#intune-cop-input')
  if (copSend && copInput) {
    copSend.addEventListener('click', () => sendCopilotMsg(el, copInput))
    copInput.addEventListener('keydown', e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendCopilotMsg(el, copInput) } })
  }

  content.querySelectorAll('.intune-cop-pill').forEach(p => {
    p.addEventListener('click', () => {
      const inp = content.querySelector('#intune-cop-input')
      if (inp) { inp.value = p.dataset.q; sendCopilotMsg(el, inp) }
    })
  })
}

function sendCopilotMsg(el, input) {
  const text = input.value.trim()
  if (!text) return
  copilotMessages.push({ role: 'user', text })
  input.value = ''

  const msgs = el.querySelector('#intune-cop-msgs')
  if (msgs) {
    msgs.innerHTML += `<div class="chat-msg user-msg" style="max-width:85%;margin-bottom:12px">
      <div class="chat-sender" style="justify-content:flex-end">You</div>
      <div class="chat-bubble">${text}</div>
    </div>`
    msgs.scrollTop = msgs.scrollHeight
  }

  setTimeout(() => {
    const q = text.toLowerCase()
    const match = INTUNE_COPILOT_KB.find(r => r.keywords.some(k => q.includes(k)))
    const response = match?.response || `Searching Intune data for **"${text}"**...\n\nBased on your question, navigate to the relevant section above. Current status: 847 devices, 98.2% compliant, 2 critical risks.`

    copilotMessages.push({ role: 'ai', text: response })
    if (msgs) {
      msgs.innerHTML += `<div class="chat-msg ai" style="max-width:85%;margin-bottom:12px">
        <div class="chat-sender"><i class="ti ti-robot" style="color:var(--clr-info-text)"></i> Intune Advisor</div>
        <div class="chat-bubble">${formatMsg(response)}</div>
      </div>`
      msgs.scrollTop = msgs.scrollHeight
    }
  }, 600)
}

function formatMsg(text) {
  return text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/\n/g, '<br>')
}
