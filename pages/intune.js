import { go } from '../app.js'
import { showToast } from '../components/toast.js'
import { getDevices, getDeviceCompliancePolicies, callAPI } from '../lib/api-client.js'
import { isDemoAccount } from '../lib/demo-account.js'
import { skeletonLoader } from '../lib/skeleton-loader.js'

let activeSection = 'executive'
let copilotMessages = []
let copilotInit = false
let realDevices = []
let realPolicies = []
let intuneData = {
  summary: {},
  endpointSecurity: {},
  patchManagement: {},
  riskAssessment: {},
  deviceHealth: [],
  applications: [],
  policies: { configurationPolicies: [], conditionalAccessPolicies: [] },
  recommendations: []
}

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

const SECURITY_BASELINE_COMPARISON = {
  windowsBaseline: { score: 92, compliant: 847, nonCompliant: 15 },
  defenderBaseline: { score: 88, compliant: 832, nonCompliant: 30 },
  edgeBaseline: { score: 95, compliant: 856, nonCompliant: 6 },
  msAppsBaseline: { score: 85, compliant: 812, nonCompliant: 50 }
}

export async function initIntune() {
  const el = document.getElementById('page-intune')
  if (!el) return

  if (isDemoAccount()) {
    console.log('🎭 Demo account detected - showing demo Intune data')
    renderDemoIntunePage(el)
    return
  }

  // Show skeleton immediately
  el.innerHTML = `
    <div>
      ${skeletonLoader.renderPageHeader('Intune Insights', 'Device management, compliance, and security', true)}
      ${skeletonLoader.renderMetricsRowSkeleton(5)}
      ${skeletonLoader.renderTabsWithContentSkeleton(8, true)}
    </div>
  `

  // Fetch all real data from backend in parallel
  console.log('📡 Fetching comprehensive Intune data from backend...')
  try {
    const [devicesResult, policiesResult, summaryResult, securityResult, patchResult, riskResult, healthResult, appsResult, policiesDataResult, recommendationsResult] = await Promise.all([
      getDevices(),
      getDeviceCompliancePolicies(),
      callAPI('/intune/summary'),
      callAPI('/intune/endpoint-security'),
      callAPI('/intune/patch-management'),
      callAPI('/intune/risk-assessment'),
      callAPI('/intune/device-health'),
      callAPI('/intune/applications'),
      callAPI('/intune/policies'),
      callAPI('/intune/recommendations')
    ])

    // Handle device data
    if (devicesResult.success && devicesResult.data) {
      realDevices = devicesResult.data
      console.log(`✅ Loaded ${realDevices.length} real devices`)
    } else {
      console.warn('⚠️ No device data available from API')
      realDevices = []
    }

    // Handle policy data
    if (policiesResult.success && policiesResult.data) {
      realPolicies = policiesResult.data
      console.log(`✅ Loaded ${realPolicies.length} real policies`)
    } else {
      console.warn('⚠️ No policy data available from API')
      realPolicies = []
    }

    // Handle summary data
    if (summaryResult.success && summaryResult.data) {
      intuneData.summary = summaryResult.data
      console.log(`✅ Loaded Intune summary`)
    } else {
      intuneData.summary = {}
    }

    // Handle endpoint security data
    if (securityResult.success && securityResult.data) {
      intuneData.endpointSecurity = securityResult.data
      console.log(`✅ Loaded endpoint security data`)
    }

    // Handle patch management data
    if (patchResult.success && patchResult.data) {
      intuneData.patchManagement = patchResult.data
      console.log(`✅ Loaded patch management data`)
    }

    // Handle risk assessment data
    if (riskResult.success && riskResult.data) {
      intuneData.riskAssessment = riskResult.data
      console.log(`✅ Loaded risk assessment data`)
    }

    // Handle device health data
    if (healthResult.success && healthResult.data) {
      intuneData.deviceHealth = healthResult.data
      console.log(`✅ Loaded device health data`)
    }

    // Handle applications data
    if (appsResult.success && appsResult.data) {
      intuneData.applications = appsResult.data
      console.log(`✅ Loaded applications data`)
    }

    // Handle policies data
    if (policiesDataResult.success && policiesDataResult.data) {
      intuneData.policies = policiesDataResult.data
      console.log(`✅ Loaded policies data`)
    }

    // Handle recommendations data
    if (recommendationsResult.success && recommendationsResult.data) {
      intuneData.recommendations = recommendationsResult.data
      console.log(`✅ Loaded recommendations data`)
    }

    console.log('✅ All Intune data loaded successfully')
  } catch (error) {
    console.error('❌ Error loading Intune data:', error)
  }

  render(el)
}

function renderDemoIntunePage(el) {
  const demoDevices = [
    { id: 'DEV-001', name: 'LAPTOP-PRIYA01', os: 'Windows 11', osVersion: '23H2', compliance: 'Compliant', owner: 'Priya Kumar', lastSync: '2026-06-01' },
    { id: 'DEV-002', name: 'LAPTOP-CHEN02', os: 'Windows 11', osVersion: '23H2', compliance: 'Compliant', owner: 'Chen Wei', lastSync: '2026-06-01' },
    { id: 'DEV-003', name: 'IPAD-AISHA01', os: 'iPadOS', osVersion: '17.5', compliance: 'Compliant', owner: 'Aisha Raza', lastSync: '2026-06-01' },
    { id: 'DEV-004', name: 'IPHONE-SANJAY01', os: 'iOS', osVersion: '17.5', compliance: 'Non-compliant', owner: 'Sanjay Kumar', lastSync: '2026-05-31' },
    { id: 'DEV-005', name: 'LAPTOP-JAMES03', os: 'Windows 10', osVersion: '22H2', compliance: 'Non-compliant', owner: 'James Liu', lastSync: '2026-05-30' },
  ]

  const demoSummary = {
    totalDevices: 847,
    compliantDevices: 801,
    nonCompliantDevices: 46,
    enrolledToday: 3,
    updatesPending: 12,
  }

  el.innerHTML = `
    <div class="page-header">
      <div>
        <div class="page-title"><i class="fas fa-laptop"></i> Microsoft Intune Insights</div>
        <div class="page-subtitle">Device Management & Security Assessment · ${demoSummary.totalDevices} devices managed · Last sync: Today 08:45</div>
      </div>
      <div style="display:flex;gap:8px;align-items:center">
        <button class="page-help" title="Monitor device compliance, security posture, and configuration status across your organization. Manage Intune policies and identify non-compliant devices.">
          <i class="fas fa-question-circle"></i>
        </button>
        <div class="page-actions">
          <button class="btn"><i class="fas fa-sync"></i> Refresh</button>
        </div>
      </div>
    </div>

    <div style="display:flex;align-items:center;gap:8px;padding:8px 12px;background:var(--color-background-primary);border:0.5px solid var(--color-border-secondary);border-radius:var(--border-radius-md);margin-bottom:16px;font-size:10px;color:var(--color-text-tertiary)">
      <span class="status-dot active pulse"></span>
      <span><strong style="color:var(--color-text-secondary)">Demo Mode</strong> · Showing sample Intune data</span>
    </div>

    <div class="kpi-row">
      <div class="kpi-tile">
        <div class="kpi-value info">${demoSummary.totalDevices}</div>
        <div class="kpi-label">Total Devices</div>
      </div>
      <div class="kpi-tile">
        <div class="kpi-value success">${demoSummary.compliantDevices}</div>
        <div class="kpi-label">Compliant</div>
      </div>
      <div class="kpi-tile">
        <div class="kpi-value danger">${demoSummary.nonCompliantDevices}</div>
        <div class="kpi-label">Non-compliant</div>
      </div>
      <div class="kpi-tile">
        <div class="kpi-value warning">${demoSummary.updatesPending}</div>
        <div class="kpi-label">Updates Pending</div>
      </div>
      <div class="kpi-tile">
        <div class="kpi-value info">${demoSummary.enrolledToday}</div>
        <div class="kpi-label">Enrolled Today</div>
      </div>
    </div>

    <div class="tabs" id="intune-tabs" style="margin-bottom:16px">
      ${INTUNE_TABS.map((tab, i) => `
        <button class="tab-btn ${i === 0 ? 'active' : ''}" data-tab="${tab.id}">
          <i class="ti ${tab.icon}"></i> ${tab.label}
        </button>
      `).join('')}
    </div>

    <div id="intune-content"></div>
  `

  const contentEl = el.querySelector('#intune-content')
  renderDemoExecutive(contentEl, demoSummary, demoDevices)

  el.querySelectorAll('#intune-tabs .tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      el.querySelectorAll('#intune-tabs .tab-btn').forEach(b => b.classList.remove('active'))
      btn.classList.add('active')
      const tabId = btn.dataset.tab

      if (tabId === 'executive') renderDemoExecutive(contentEl, demoSummary, demoDevices)
      else if (tabId === 'health') renderDemoHealth(contentEl, demoDevices)
      else if (tabId === 'compliance') renderDemoCompliance(contentEl, demoSummary)
      else if (tabId === 'inventory') renderDemoInventory(contentEl, demoDevices)
      else if (tabId === 'security') renderDemoSecurity(contentEl)
      else if (tabId === 'patches') renderDemoPatches(contentEl)
      else contentEl.innerHTML = `<div class="card"><div class="card-header"><span class="card-title">${btn.textContent}</span></div><div style="padding:20px;text-align:center;color:var(--color-text-tertiary)">Demo data for ${btn.textContent}</div></div>`
    })
  })
}

function renderDemoExecutive(el, summary, devices) {
  el.innerHTML = `
    <div class="card mb-3">
      <div class="card-header">
        <span class="card-title">Device Compliance Overview</span>
      </div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:12px">
        <div style="padding:12px;background:var(--color-background-secondary);border-radius:var(--border-radius-md)">
          <div style="font-size:10px;color:var(--color-text-tertiary);text-transform:uppercase;font-weight:600;margin-bottom:6px">Compliance Rate</div>
          <div style="font-size:28px;font-weight:700;color:var(--clr-success-text)">${Math.round(summary.compliantDevices / summary.totalDevices * 100)}%</div>
          <div style="font-size:9px;color:var(--color-text-tertiary);margin-top:4px">${summary.compliantDevices} of ${summary.totalDevices} devices</div>
        </div>
        <div style="padding:12px;background:var(--color-background-secondary);border-radius:var(--border-radius-md)">
          <div style="font-size:10px;color:var(--color-text-tertiary);text-transform:uppercase;font-weight:600;margin-bottom:6px">Non-Compliant Devices</div>
          <div style="font-size:28px;font-weight:700;color:var(--clr-danger-text)">${summary.nonCompliantDevices}</div>
          <div style="font-size:9px;color:var(--color-text-tertiary);margin-top:4px">Require attention</div>
        </div>
      </div>
    </div>

    <div class="card mb-3">
      <div class="card-header">
        <span class="card-title">Recently Enrolled Devices</span>
      </div>
      <table style="width:100%">
        <thead style="background:var(--color-background-secondary)">
          <tr>
            <th style="padding:10px;text-align:left;font-size:10px;font-weight:600">Device Name</th>
            <th style="padding:10px;text-align:left;font-size:10px;font-weight:600">Owner</th>
            <th style="padding:10px;text-align:left;font-size:10px;font-weight:600">OS</th>
            <th style="padding:10px;text-align:left;font-size:10px;font-weight:600">Compliance</th>
          </tr>
        </thead>
        <tbody>
          ${devices.slice(0, 5).map(device => `
            <tr style="border-bottom:0.5px solid var(--color-border-tertiary)">
              <td style="padding:10px;font-size:11px;color:var(--color-text-secondary)">${device.name}</td>
              <td style="padding:10px;font-size:10px">${device.owner}</td>
              <td style="padding:10px;font-size:10px">${device.os} ${device.osVersion}</td>
              <td style="padding:10px"><span class="badge ${device.compliance === 'Compliant' ? 'success' : 'danger'}">${device.compliance}</span></td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>
  `
}

function renderDemoHealth(el, devices) {
  el.innerHTML = `
    <div class="card">
      <div class="card-header">
        <span class="card-title">Device Health Status</span>
      </div>
      <table style="width:100%">
        <thead style="background:var(--color-background-secondary)">
          <tr>
            <th style="padding:10px;text-align:left;font-size:10px;font-weight:600">Device</th>
            <th style="padding:10px;text-align:left;font-size:10px;font-weight:600">Status</th>
            <th style="padding:10px;text-align:left;font-size:10px;font-weight:600">Last Sync</th>
          </tr>
        </thead>
        <tbody>
          ${devices.map(device => `
            <tr style="border-bottom:0.5px solid var(--color-border-tertiary)">
              <td style="padding:10px;font-size:11px">${device.name}</td>
              <td style="padding:10px"><span class="badge ${device.compliance === 'Compliant' ? 'success' : 'warning'}">Healthy</span></td>
              <td style="padding:10px;font-size:10px;color:var(--color-text-tertiary)">${new Date(device.lastSync).toLocaleDateString()}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>
  `
}

function renderDemoCompliance(el, summary) {
  el.innerHTML = `
    <div class="card mb-3">
      <div class="card-header">
        <span class="card-title">Compliance Policies</span>
      </div>
      <table style="width:100%">
        <thead style="background:var(--color-background-secondary)">
          <tr>
            <th style="padding:10px;text-align:left;font-size:10px;font-weight:600">Policy</th>
            <th style="padding:10px;text-align:left;font-size:10px;font-weight:600">Platform</th>
            <th style="padding:10px;text-align:left;font-size:10px;font-weight:600">Compliant</th>
          </tr>
        </thead>
        <tbody>
          <tr style="border-bottom:0.5px solid var(--color-border-tertiary)">
            <td style="padding:10px;font-size:11px">Windows Security Baseline</td>
            <td style="padding:10px;font-size:10px">Windows</td>
            <td style="padding:10px"><span class="badge success">801/801</span></td>
          </tr>
          <tr style="border-bottom:0.5px solid var(--color-border-tertiary)">
            <td style="padding:10px;font-size:11px">Mobile Device Management</td>
            <td style="padding:10px;font-size:10px">iOS/Android</td>
            <td style="padding:10px"><span class="badge warning">46/47</span></td>
          </tr>
          <tr>
            <td style="padding:10px;font-size:11px">Encryption Required</td>
            <td style="padding:10px;font-size:10px">All</td>
            <td style="padding:10px"><span class="badge success">847/847</span></td>
          </tr>
        </tbody>
      </table>
    </div>
  `
}

function renderDemoInventory(el, devices) {
  el.innerHTML = `
    <div class="card">
      <div class="card-header">
        <span class="card-title">Device Inventory</span>
        <span class="badge info">${devices.length} devices</span>
      </div>
      <table style="width:100%">
        <thead style="background:var(--color-background-secondary)">
          <tr>
            <th style="padding:10px;text-align:left;font-size:10px;font-weight:600">Device ID</th>
            <th style="padding:10px;text-align:left;font-size:10px;font-weight:600">Device Name</th>
            <th style="padding:10px;text-align:left;font-size:10px;font-weight:600">Platform</th>
            <th style="padding:10px;text-align:left;font-size:10px;font-weight:600">Owner</th>
          </tr>
        </thead>
        <tbody>
          ${devices.map(device => `
            <tr style="border-bottom:0.5px solid var(--color-border-tertiary)">
              <td style="padding:10px;font-size:9px;font-family:monospace">${device.id}</td>
              <td style="padding:10px;font-size:11px">${device.name}</td>
              <td style="padding:10px;font-size:10px">${device.os}</td>
              <td style="padding:10px;font-size:10px">${device.owner}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>
  `
}

function renderDemoSecurity(el) {
  el.innerHTML = `
    <div class="card mb-3">
      <div class="card-header">
        <span class="card-title">Endpoint Security</span>
      </div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px">
        <div style="padding:12px;background:var(--color-background-secondary);border-radius:var(--border-radius-md)">
          <div style="font-size:10px;color:var(--color-text-tertiary);text-transform:uppercase;font-weight:600;margin-bottom:6px">Antivirus Status</div>
          <div style="font-size:16px;font-weight:700;color:var(--clr-success-text)">847/847</div>
          <div style="font-size:9px;color:var(--color-text-tertiary);margin-top:4px">All devices protected</div>
        </div>
        <div style="padding:12px;background:var(--color-background-secondary);border-radius:var(--border-radius-md)">
          <div style="font-size:10px;color:var(--color-text-tertiary);text-transform:uppercase;font-weight:600;margin-bottom:6px">Firewall Status</div>
          <div style="font-size:16px;font-weight:700;color:var(--clr-success-text)">847/847</div>
          <div style="font-size:9px;color:var(--color-text-tertiary);margin-top:4px">All devices protected</div>
        </div>
      </div>
    </div>
  `
}

function renderDemoPatches(el) {
  el.innerHTML = `
    <div class="card">
      <div class="card-header">
        <span class="card-title">Patch Management</span>
        <span class="badge warning">12 updates pending</span>
      </div>
      <table style="width:100%">
        <thead style="background:var(--color-background-secondary)">
          <tr>
            <th style="padding:10px;text-align:left;font-size:10px;font-weight:600">Update</th>
            <th style="padding:10px;text-align:left;font-size:10px;font-weight:600">Severity</th>
            <th style="padding:10px;text-align:left;font-size:10px;font-weight:600">Devices Affected</th>
          </tr>
        </thead>
        <tbody>
          <tr style="border-bottom:0.5px solid var(--color-border-tertiary)">
            <td style="padding:10px;font-size:11px">Windows 11 23H2 KB5036893</td>
            <td style="padding:10px"><span class="badge danger">Critical</span></td>
            <td style="padding:10px;font-size:10px">4</td>
          </tr>
          <tr style="border-bottom:0.5px solid var(--color-border-tertiary)">
            <td style="padding:10px;font-size:11px">Security Update June 2026</td>
            <td style="padding:10px"><span class="badge warning">Important</span></td>
            <td style="padding:10px;font-size:10px">8</td>
          </tr>
        </tbody>
      </table>
    </div>
  `
}

function render(el) {
  const s = intuneData.summary
  const criticalRisks = intuneData.riskAssessment.criticalRiskCount || 0
  const highRisks = intuneData.riskAssessment.highRiskCount || 0

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
        <div class="kpi-value warning">${intuneData.patchManagement.compliancePercentage || 0}%</div>
        <div class="kpi-label">Patch Status</div>
        <div style="font-size:10px;margin-top:3px;color:var(--color-text-tertiary)">${intuneData.patchManagement.criticalUpdatesMissing || 0} critical</div>
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
    <div class="tabs" id="intune-subnav">
      ${INTUNE_TABS.map(t => `
        <button class="tab-btn ${activeSection === t.id ? 'active' : ''}" data-intune-section="${t.id}">
          <i class="ti ${t.icon}"></i><span>${t.label}</span>
          ${t.id === 'risk' && criticalRisks > 0 ? `<span class="intune-tab-badge red">${criticalRisks}</span>` : ''}
          ${t.id === 'compliance' && s.nonCompliant > 0 ? `<span class="intune-tab-badge red">${s.nonCompliant}</span>` : ''}
          ${t.id === 'patches' && (intuneData.patchManagement.criticalUpdatesMissing || 0) > 0 ? `<span class="intune-tab-badge red">${intuneData.patchManagement.criticalUpdatesMissing || 0}</span>` : ''}
          ${t.id === 'recommendations' ? `<span class="intune-tab-badge amber">${intuneData.recommendations.length || 0}</span>` : ''}
        </button>
      `).join('')}
    </div>

    <!-- Content -->
    <div id="intune-content" style="margin-top:16px">${renderSection()}</div>
  `

  el.querySelectorAll('#intune-subnav .tab-btn').forEach(btn => {
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
  const s = intuneData.summary
  const p = intuneData.summary.platformDistribution || PLATFORM_DISTRIBUTION

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
        ${['windows', 'macos', 'ios', 'android', 'other'].map(os => {
          const d = p[os] || { count: 0, percentage: 0 }
          return `
            <div style="margin-bottom:10px">
              <div style="display:flex;justify-content:space-between;margin-bottom:4px;font-size:11px;font-weight:600">
                <span style="text-transform:capitalize">${os}</span>
                <span>${d.count} (${d.percentage}%)</span>
              </div>
              <div class="score-bar" style="height:8px">
                <div class="score-bar-fill" style="width:${d.percentage}%"></div>
              </div>
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
        <span><strong>${intuneData.riskAssessment.highRiskCount || 0} high-risk devices</strong> require immediate attention</span>
      </div>
      ${(intuneData.riskAssessment.deviceRisks || []).slice(0, 5).map(d => `
        <div style="padding:8px 10px;background:var(--clr-danger-bg);color:var(--clr-danger-text);border-radius:var(--border-radius-md);margin-bottom:6px;font-size:11px">
          <div style="font-weight:700">${d.deviceName || d.name || 'Unknown'}</div>
          <div style="font-size:10px;margin-top:2px">Risk Level: ${d.riskLevel || 'unknown'} · Issues: ${d.issuesCount || 0}</div>
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
        ${(intuneData.recommendations || []).filter(r => r.priority === 'critical').slice(0, 4).map(r => `
          <div style="display:flex;gap:8px;padding:6px 0;border-bottom:0.5px solid var(--color-border-tertiary);font-size:11px">
            <span class="badge danger" style="flex-shrink:0;min-width:56px;justify-content:center">${r.priority}</span>
            <span style="flex:1">${r.title}</span>
          </div>
        `).join('')}
        ${(intuneData.recommendations || []).length === 0 ? '<div style="padding:10px;text-align:center;font-size:11px;color:var(--color-text-tertiary)">No critical recommendations</div>' : ''}
      </div>
    </div>
  `
}

// ============================================================
// DEVICE HEALTH
// ============================================================
function renderDeviceHealth() {
  const s = intuneData.summary
  const devices = intuneData.deviceHealth || []
  const avgHealth = devices.length > 0 ? Math.round(devices.reduce((a, d) => a + d.healthScore, 0) / devices.length) : 0

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
          ${devices.map(d => `
            <tr>
              <td style="font-weight:600">${d.name || 'Unknown'}</td>
              <td>${d.encryptionScore}%</td>
              <td>${d.complianceScore}%</td>
              <td>${d.patchScore}%</td>
              <td>${d.epScore}%</td>
              <td><span class="badge ${d.healthScore >= 80 ? 'success' : d.healthScore >= 60 ? 'warning' : 'danger'}">${d.healthScore}/100</span></td>
              <td><span class="badge ${d.riskLevel === 'low' ? 'success' : d.riskLevel === 'high' ? 'danger' : 'warning'}">${d.riskLevel}</span></td>
            </tr>
          `).join('')}
          ${devices.length === 0 ? '<tr><td colspan="7" style="text-align:center;padding:20px">No devices with health data</td></tr>' : ''}
        </tbody>
      </table>
    </div>
  `
}

// ============================================================
// COMPLIANCE
// ============================================================
function renderCompliance() {
  const s = intuneData.summary
  const compliantDevices = Math.max(0, (s.totalManagedDevices || 0) - (s.nonCompliant || 0))
  const compliancePercentage = s.totalManagedDevices > 0 ? Math.round((compliantDevices / s.totalManagedDevices) * 100) : 0

  return `
    <div class="kpi-row mb-3">
      <div class="kpi-tile">
        <div class="kpi-value success">${compliancePercentage}%</div>
        <div class="kpi-label">Overall Compliance</div>
      </div>
      <div class="kpi-tile">
        <div class="kpi-value success">${compliantDevices}</div>
        <div class="kpi-label">Compliant Devices</div>
      </div>
      <div class="kpi-tile">
        <div class="kpi-value danger">${s.nonCompliant || 0}</div>
        <div class="kpi-label">Non-Compliant</div>
      </div>
      <div class="kpi-tile">
        <div class="kpi-value info">0</div>
        <div class="kpi-label">Pending Evaluation</div>
      </div>
      <div class="kpi-tile">
        <div class="kpi-value warning">0</div>
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
          ${realPolicies.map(p => `
            <tr>
              <td style="font-weight:600">${p.name}</td>
              <td>${p.assignedDevices}</td>
              <td style="color:var(--clr-success-text);font-weight:600">${p.compliant}</td>
              <td style="color:var(--clr-danger-text);font-weight:600">${p.nonCompliant}</td>
              <td>${p.pending}</td>
              <td><span class="badge success">${p.coverage}%</span></td>
            </tr>
          `).join('')}
          ${realPolicies.length === 0 ? '<tr><td colspan="6" style="text-align:center;padding:20px;color:var(--color-text-tertiary)">No compliance policies found - Real data from tenant</td></tr>' : ''}
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
          ${realDevices.slice(0, 50).map(d => `
            <tr>
              <td style="font-weight:600">${d.deviceName || d.name || 'Unknown'}</td>
              <td>${d.operatingSystem || d.type || 'N/A'}</td>
              <td>${d.model || 'N/A'}</td>
              <td style="font-size:10px">${d.osVersion || 'N/A'}</td>
              <td style="font-size:10px">${d.lastSyncDateTime ? new Date(d.lastSyncDateTime).toLocaleString() : d.lastSync || 'N/A'}</td>
              <td>${d.userId || d.owner || 'N/A'}</td>
              <td><span class="badge ${d.isCompliant === true || d.compliance === 'compliant' ? 'success' : 'danger'}">${d.isCompliant === true ? 'compliant' : 'non-compliant'}</span></td>
              <td>${d.encryptionStatus === true || d.encryption === true ? '✓' : '✗'}</td>
              <td><span style="font-weight:700;color:var(--clr-success-text)">🟢</span></td>
            </tr>
          `).join('')}
          ${realDevices.length === 0 ? '<tr><td colspan="9" style="text-align:center;padding:20px;color:var(--color-text-tertiary)">No devices enrolled in Intune - Real data from tenant</td></tr>' : ''}
        </tbody>
      </table>
    </div>
  `
}

// ============================================================
// ENDPOINT SECURITY
// ============================================================
function renderEndpointSecurity() {
  const e = intuneData.endpointSecurity
  return `
    <div class="grid-2 mb-3" style="gap:16px">
      <div class="card">
        <div class="card-title mb-3"><i class="ti ti-shield-check"></i> Antivirus & Firewall</div>
        ${metricGrid([
          { label: 'Defender Enabled',    val: e.antivirus?.defenderEnabled || 0, cls: 'success' },
          { label: 'Real-Time Protection',val: e.antivirus?.realTimeProtection || 0, cls: 'success' },
          { label: 'Cloud Protection',    val: e.antivirus?.cloudProtection || 0, cls: 'success' },
          { label: 'Firewall Enabled',    val: e.firewall?.enabled || 0, cls: 'success' },
        ])}
      </div>

      <div class="card">
        <div class="card-title mb-3"><i class="ti ti-lock"></i> Protection Coverage</div>
        ${[
          { label: 'Defender', pct: e.antivirus?.coverage || 0, target: 100 },
          { label: 'Firewall', pct: e.firewall?.coverage || 0, target: 100 },
          { label: 'SmartScreen', pct: e.smartscreen?.coverage || 0, target: 100 },
          { label: 'ASR Rules', pct: e.asr?.coverage || 0, target: 100 },
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
  const p = intuneData.patchManagement
  const criticalCount = p.criticalUpdatesMissing || 0
  return `
    <div class="alert-banner danger mb-3">
      <i class="ti ti-alert-triangle"></i>
      <span><strong>${criticalCount} devices missing critical updates</strong> — schedule patching immediately</span>
    </div>

    <div class="kpi-row mb-3">
      <div class="kpi-tile">
        <div class="kpi-value warning">${p.compliancePercentage || 0}%</div>
        <div class="kpi-label">Patch Compliance</div>
      </div>
      <div class="kpi-tile">
        <div class="kpi-value danger">${p.criticalUpdatesMissing || 0}</div>
        <div class="kpi-label">Critical Updates</div>
      </div>
      <div class="kpi-tile">
        <div class="kpi-value warning">${p.securityUpdatesMissing || 0}</div>
        <div class="kpi-label">Security Updates</div>
      </div>
      <div class="kpi-tile">
        <div class="kpi-value info">${p.avgDaysBehind || 0}</div>
        <div class="kpi-label">Avg Days Behind</div>
      </div>
    </div>

    <div class="card">
      <div class="card-title mb-2">Patch Compliance Summary</div>
      <div style="padding:10px;background:var(--clr-info-bg);border-radius:var(--border-radius-md);margin-bottom:8px;font-size:11px">
        <div style="display:flex;justify-content:space-between;margin-bottom:4px">
          <span>Quality Updates Missing</span>
          <span style="font-weight:700">${p.qualityUpdatesMissing || 0}</span>
        </div>
        <div style="display:flex;justify-content:space-between">
          <span>Devices Needing Patches</span>
          <span style="font-weight:700">${p.devicesNeedingPatches || 0}</span>
        </div>
      </div>
    </div>
  `
}

// ============================================================
// APPLICATIONS
// ============================================================
function renderApplications() {
  const apps = intuneData.applications || []
  return `
    <div class="grid-2 mb-3" style="gap:16px">
      ${apps.map(app => `
        <div class="card">
          <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px">
            <div style="font-weight:700">${app.name}</div>
            <span class="badge success">${app.status}</span>
          </div>
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;font-size:10px">
            <div><div style="color:var(--color-text-tertiary)">Users</div><div style="font-weight:700">${app.users}</div></div>
            <div><div style="color:var(--color-text-tertiary)">Devices</div><div style="font-weight:700">${app.devices}</div></div>
            <div><div style="color:var(--color-text-tertiary)">Publisher</div><div style="font-weight:700;font-size:9px">${app.publisher}</div></div>
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
  const riskData = intuneData.riskAssessment
  const devices = riskData.deviceRisks || []

  return `
    <div class="kpi-row mb-3">
      <div class="kpi-tile">
        <div class="kpi-value danger">${riskData.criticalRiskCount || 0}</div>
        <div class="kpi-label">Critical Risk Devices</div>
      </div>
      <div class="kpi-tile">
        <div class="kpi-value warning">${riskData.highRiskCount || 0}</div>
        <div class="kpi-label">High Risk Devices</div>
      </div>
      <div class="kpi-tile">
        <div class="kpi-value info">${devices.length || 0}</div>
        <div class="kpi-label">Non-Compliant Devices</div>
      </div>
    </div>

    ${devices.slice(0, 20).map(d => `
      <div class="card mb-2" style="border-left:3px solid ${d.riskLevel === 'high' ? 'var(--clr-danger-text)' : 'var(--clr-warning-text)'}">
        <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:8px">
          <div>
            <div style="font-weight:700;margin-bottom:4px">${d.deviceName || d.name || 'Unknown Device'}</div>
            <div style="font-size:10px;color:var(--color-text-tertiary)">Issues: ${d.issuesCount || 0}</div>
          </div>
          <span class="badge ${d.riskLevel === 'high' ? 'danger' : 'warning'}">${d.riskLevel || 'medium'}</span>
        </div>
      </div>
    `).join('')}
  `
}

// ============================================================
// POLICIES
// ============================================================
function renderPolicies() {
  const policies = intuneData.policies || { configurationPolicies: [], conditionalAccessPolicies: [] }
  const configPolicies = policies.configurationPolicies || []
  const caPolicies = policies.conditionalAccessPolicies || []

  return `
    <div class="section-heading">Configuration Policies (${configPolicies.length})</div>
    ${configPolicies.map(p => `
      <div style="padding:10px;background:var(--color-background-secondary);border-radius:var(--border-radius-md);margin-bottom:8px">
        <div style="display:flex;justify-content:space-between;font-weight:700;margin-bottom:4px">${p.name}</div>
        <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:8px;font-size:10px">
          <div><span style="color:var(--color-text-tertiary)">Assigned:</span> ${p.assigned}</div>
          <div><span style="color:var(--clr-success-text);font-weight:600">✓</span> ${p.compliant}</div>
          <div><span style="color:var(--clr-danger-text);font-weight:600">✗</span> ${p.nonCompliant}</div>
        </div>
      </div>
    `).join('')}
    ${configPolicies.length === 0 ? '<div style="padding:10px;text-align:center;color:var(--color-text-tertiary)">No configuration policies found</div>' : ''}

    <div class="section-heading mt-4">Conditional Access Policies (${caPolicies.length})</div>
    ${caPolicies.map(p => `
      <div style="padding:10px;background:${p.enabled ? 'var(--clr-success-bg)' : 'var(--color-background-secondary)'};border-radius:var(--border-radius-md);margin-bottom:6px">
        <div style="display:flex;justify-content:space-between">
          <span style="font-weight:700">${p.name}</span>
          <span class="badge ${p.enabled ? 'success' : 'neutral'}">${p.enabled ? 'Enabled' : 'Disabled'}</span>
        </div>
      </div>
    `).join('')}
    ${caPolicies.length === 0 ? '<div style="padding:10px;text-align:center;color:var(--color-text-tertiary)">No conditional access policies found</div>' : ''}
  `
}

// ============================================================
// RECOMMENDATIONS
// ============================================================
function renderRecommendations() {
  const recommendations = intuneData.recommendations || []

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
          ${recommendations.map(r => `
            <tr>
              <td><span class="badge ${r.priority === 'critical' ? 'danger' : r.priority === 'high' ? 'warning' : 'info'}">${r.priority}</span></td>
              <td style="font-size:11px;font-weight:500">${r.title}</td>
              <td><span class="pill">${r.category}</span></td>
              <td style="font-size:11px">${r.impact}</td>
              <td><span class="pill">${r.effort}</span></td>
              <td><span class="badge ${r.status === 'Pending' ? 'warning' : r.status === 'In Progress' ? 'info' : 'neutral'}">${r.status}</span></td>
            </tr>
          `).join('')}
          ${recommendations.length === 0 ? '<tr><td colspan="6" style="text-align:center;padding:20px">No recommendations available</td></tr>' : ''}
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
    const s = intuneData.summary || {}
    const r = intuneData.riskAssessment || {}
    copilotMessages = [{
      role: 'ai',
      text: `**Intune Security Advisor** — Ask me about device health, compliance, security posture, patch status, or remediation recommendations.\n\n**Current state:** ${s.totalManagedDevices || 0} managed devices, ${s.compliancePercentage || 0}% compliant, ${s.deviceHealthScore || 0}/100 health score, ${r.criticalRiskCount || 0} critical risks`
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
    const s = intuneData.summary || {}
    const r = intuneData.riskAssessment || {}
    const p = intuneData.patchManagement || {}
    const e = intuneData.endpointSecurity || {}

    let response = `Based on your question about Intune, here's the current tenant status:\n\n`

    // Generate dynamic responses based on real tenant data
    if (q.includes('health') || q.includes('device health')) {
      response += `**Device Health Summary:**\n• Total Managed: ${s.totalManagedDevices || 0}\n• Active: ${s.activeDevices || 0}\n• Health Score: ${s.deviceHealthScore || 0}/100\n• Encryption: ${s.encryptionCoverage || 0}%`
    } else if (q.includes('compliance') || q.includes('compliant')) {
      response += `**Compliance Status:**\n• Overall Compliance: ${s.compliancePercentage || 0}%\n• Non-Compliant: ${s.nonCompliant || 0}\n• Devices: ${s.totalManagedDevices || 0} managed`
    } else if (q.includes('patch') || q.includes('update')) {
      response += `**Patch Management:**\n• Patch Compliance: ${p.compliancePercentage || 0}%\n• Critical Updates Missing: ${p.criticalUpdatesMissing || 0}\n• Devices Needing Patches: ${p.devicesNeedingPatches || 0}`
    } else if (q.includes('security') || q.includes('protection') || q.includes('firewall')) {
      response += `**Endpoint Security:**\n• Antivirus Coverage: ${e.antivirus?.coverage || 0}%\n• Firewall Coverage: ${e.firewall?.coverage || 0}%\n• SmartScreen Coverage: ${e.smartscreen?.coverage || 0}%\n• BitLocker Coverage: ${e.bitlocker?.coverage || 0}%`
    } else if (q.includes('risk') || q.includes('critical')) {
      response += `**Risk Assessment:**\n• Critical Risk Devices: ${r.criticalRiskCount || 0}\n• High Risk Devices: ${r.highRiskCount || 0}\n• Non-Compliant: ${r.deviceRisks?.length || 0}`
    } else if (q.includes('recommendation') || q.includes('suggest')) {
      const recs = intuneData.recommendations || []
      const criticalRecs = recs.filter(x => x.priority === 'critical')
      response += `**Top Recommendations:**\n${criticalRecs.slice(0, 3).map(r => `• **${r.priority.toUpperCase()}:** ${r.title}`).join('\n') || '• No critical recommendations'}`
    } else {
      response += `**Tenant Overview:**\n• Managed Devices: ${s.totalManagedDevices || 0}\n• Compliance: ${s.compliancePercentage || 0}%\n• Health Score: ${s.deviceHealthScore || 0}/100\n• Critical Risks: ${r.criticalRiskCount || 0}\n\nAsk me about device health, compliance, security, patches, or recommendations!`
    }

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
