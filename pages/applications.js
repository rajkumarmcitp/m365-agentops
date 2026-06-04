import { go } from '../app.js'
import { showToast } from '../components/toast.js'
import { getApplications, getServicePrincipals } from '../lib/api-client.js'
import {
  APPS_SUMMARY, APP_REGISTRATIONS, ENTERPRISE_APPLICATIONS, SECRETS_CERTIFICATES,
  API_PERMISSIONS, ADMIN_CONSENTS, SIGN_IN_ANALYTICS, RISK_ASSESSMENT,
  APPS_RECOMMENDATIONS, APPS_COPILOT_KB
} from '../data/apps-data.js'

let activeSection = 'executive'
let appFilter = { type: 'all', status: 'all', search: '' }
let copilotMessages = []
let copilotInit = false
let realApps = []
let realServicePrincipals = []

const APP_TABS = [
  { id: 'executive',        label: 'Executive',          icon: 'ti-layout-dashboard' },
  { id: 'appregistrations', label: 'App Registrations',  icon: 'ti-app-window' },
  { id: 'enterprise',       label: 'Enterprise Apps',    icon: 'ti-grid-dots' },
  { id: 'secrets',          label: 'Secrets & Certs',    icon: 'ti-lock' },
  { id: 'permissions',      label: 'Permissions',        icon: 'ti-shield-check' },
  { id: 'consents',         label: 'Admin Consents',     icon: 'ti-user-check' },
  { id: 'owners',           label: 'Owners',             icon: 'ti-users' },
  { id: 'usage',            label: 'Usage Analytics',    icon: 'ti-chart-line' },
  { id: 'risk',             label: 'Risk Assessment',    icon: 'ti-alert-triangle' },
  { id: 'lifecycle',        label: 'Lifecycle',          icon: 'ti-timeline' },
  { id: 'recommendations',  label: 'Recommendations',    icon: 'ti-checklist' },
  { id: 'copilot',          label: 'App Copilot',        icon: 'ti-robot' },
]

// ============================================================
// Entry
// ============================================================
export async function initApplications() {
  const el = document.getElementById('page-applications')
  if (!el) return

  el.innerHTML = `<div style="padding:20px;text-align:center"><div class="spinner"></div><p>Loading real M365 application data...</p></div>`

  console.log('📡 Fetching real application data from backend...')
  const appsResult = await getApplications()
  const spResult = await getServicePrincipals()

  if (!appsResult.success) {
    console.warn('⚠️ Failed to fetch applications, using simulated data:', appsResult.error)
    realApps = APP_REGISTRATIONS
  } else {
    realApps = appsResult.data || APP_REGISTRATIONS
    console.log(`✅ Loaded ${realApps.length} real applications from API`)
  }

  if (!spResult.success) {
    console.warn('⚠️ Failed to fetch service principals, using simulated data')
    realServicePrincipals = ENTERPRISE_APPLICATIONS
  } else {
    realServicePrincipals = spResult.data || ENTERPRISE_APPLICATIONS
    console.log(`✅ Loaded ${realServicePrincipals.length} real service principals from API`)
  }

  render(el)
}

function render(el) {
  const expiringSecrets = SECRETS_CERTIFICATES.filter(s => s.status === 'expiring').length
  const expiredSecrets = SECRETS_CERTIFICATES.filter(s => s.status === 'expired').length
  const criticalRisks = RISK_ASSESSMENT.filter(r => r.severity === 'critical').length

  el.innerHTML = `
    <div class="page-header">
      <div>
        <div class="page-title"><i class="ti ti-app-window"></i> Entra Applications</div>
        <div class="page-subtitle">Application Registrations & Enterprise Apps · ${APPS_SUMMARY.totalAppRegistrations} app registrations · Last sync: Today 08:45</div>
      </div>
      <div class="page-actions">
        <button class="btn" id="app-refresh"><i class="ti ti-refresh"></i> Refresh</button>
        <button class="btn btn-primary" id="app-audit"><i class="ti ti-download"></i> Export audit</button>
      </div>
    </div>

    <!-- Top-5 KPI strip -->
    <div class="kpi-row mb-3">
      <div class="kpi-tile">
        <div class="kpi-value info">${APPS_SUMMARY.totalAppRegistrations}</div>
        <div class="kpi-label">App Registrations</div>
      </div>
      <div class="kpi-tile">
        <div class="kpi-value info">${APPS_SUMMARY.totalEnterpriseApplications}</div>
        <div class="kpi-label">Enterprise Apps</div>
      </div>
      <div class="kpi-tile">
        <div class="kpi-value ${expiredSecrets > 0 ? 'danger' : expiringSecrets > 0 ? 'warning' : 'success'}">${expiredSecrets}</div>
        <div class="kpi-label">Expired Secrets</div>
      </div>
      <div class="kpi-tile">
        <div class="kpi-value warning">${expiringSecrets}</div>
        <div class="kpi-label">Expiring (30d)</div>
      </div>
      <div class="kpi-tile">
        <div class="kpi-value ${criticalRisks > 0 ? 'danger' : 'warning'}">${criticalRisks}</div>
        <div class="kpi-label">Critical Risk Apps</div>
      </div>
      <div class="kpi-tile">
        <div class="kpi-value warning">${APPS_SUMMARY.highPrivilegeApps}</div>
        <div class="kpi-label">High Privilege</div>
      </div>
    </div>

    <!-- Sub-navigation tabs -->
    <div class="app-subnav" id="app-subnav">
      ${APP_TABS.map(t => `
        <button class="app-tab-btn ${activeSection === t.id ? 'active' : ''}" data-app-section="${t.id}">
          <i class="ti ${t.icon}"></i><span>${t.label}</span>
          ${t.id === 'secrets' && (expiredSecrets + expiringSecrets) > 0 ? `<span class="app-tab-badge red">${expiredSecrets + expiringSecrets}</span>` : ''}
          ${t.id === 'risk' && criticalRisks > 0 ? `<span class="app-tab-badge red">${criticalRisks}</span>` : ''}
          ${t.id === 'recommendations' ? `<span class="app-tab-badge amber">${APPS_RECOMMENDATIONS.length}</span>` : ''}
        </button>
      `).join('')}
    </div>

    <!-- Content area -->
    <div id="app-content" style="margin-top:16px">${renderSection()}</div>
  `

  el.querySelectorAll('.app-tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      activeSection = btn.dataset.appSection
      render(el)
    })
  })

  el.querySelector('#app-refresh')?.addEventListener('click', () => {
    const btn = el.querySelector('#app-refresh')
    btn.innerHTML = `<span class="spinner dark"></span> Scanning...`
    btn.disabled = true
    setTimeout(() => {
      btn.innerHTML = `<i class="ti ti-refresh"></i> Refresh`
      btn.disabled = false
      showToast('Application inventory updated — 87 app registrations, 124 service principals scanned.', 'success')
    }, 2200)
  })

  el.querySelector('#app-audit')?.addEventListener('click', () => showToast('Application audit exported as CSV.', 'success'))

  wireSection(el)
}

// ============================================================
// Section dispatcher
// ============================================================
function renderSection() {
  const map = {
    executive:        renderExecutive,
    appregistrations: renderAppRegistrations,
    enterprise:       renderEnterpriseApps,
    secrets:          renderSecrets,
    permissions:      renderPermissions,
    consents:         renderConsents,
    owners:           renderOwners,
    usage:            renderUsage,
    risk:             renderRisk,
    lifecycle:        renderLifecycle,
    recommendations:  renderRecommendations,
    copilot:          renderAppCopilot,
  }
  return (map[activeSection] || renderExecutive)()
}

// ============================================================
// EXECUTIVE DASHBOARD
// ============================================================
function renderExecutive() {
  const s = APPS_SUMMARY
  const expSec = SECRETS_CERTIFICATES.filter(x => x.status === 'expiring').length
  const expiredSec = SECRETS_CERTIFICATES.filter(x => x.status === 'expired').length
  const critRisk = RISK_ASSESSMENT.filter(x => x.severity === 'critical').length
  const unusedApps = SIGN_IN_ANALYTICS.filter(x => x.status === 'unused').length

  return `
    <div class="grid-2 mb-3" style="gap:16px">
      <div class="card">
        <div class="card-header">
          <span class="card-title"><i class="ti ti-app-window"></i> Application Inventory</span>
        </div>
        ${metricGrid([
          { label: 'Total App Registrations',      val: s.totalAppRegistrations, cls: 'info' },
          { label: 'Enterprise Applications',      val: s.totalEnterpriseApplications, cls: 'info' },
          { label: 'Multi-Tenant Apps',            val: s.multiTenantApps, cls: 'warning' },
          { label: 'High Privilege Apps',          val: s.highPrivilegeApps, cls: 'danger' },
          { label: 'Certificate-Based',            val: s.certificateBasedApps, cls: 'success' },
          { label: 'Unused (90+ days)',            val: unusedApps, cls: 'warning' },
        ])}
      </div>

      <div class="card">
        <div class="card-header">
          <span class="card-title"><i class="ti ti-lock"></i> Credential Health</span>
        </div>
        <div class="alert-banner danger mb-3">
          <i class="ti ti-alert-triangle"></i>
          <span><strong>${expiredSec} secrets EXPIRED</strong> — require immediate replacement</span>
        </div>
        ${metricGrid([
          { label: 'Expired Secrets',              val: expiredSec, cls: 'danger' },
          { label: 'Expiring (30 days)',           val: expSec, cls: 'warning' },
          { label: 'Expiring (60 days)',           val: s.expiringSecrets60d, cls: 'warning' },
          { label: 'Apps Requiring Admin Consent', val: s.appsRequiringConsent, cls: 'warning' },
        ])}
      </div>
    </div>

    <div class="grid-2 mb-3" style="gap:16px">
      <div class="card">
        <div class="card-header">
          <span class="card-title"><i class="ti ti-alert-triangle"></i> Risk Summary</span>
          <span class="badge danger dot">${critRisk} critical</span>
        </div>
        ${RISK_ASSESSMENT.slice(0, 5).map(r => `
          <div style="display:flex;align-items:center;gap:8px;padding:6px 0;border-bottom:0.5px solid var(--color-border-tertiary)">
            <span class="badge ${r.severity === 'critical' ? 'danger' : r.severity === 'high' ? 'warning' : 'info'}" style="min-width:72px">${r.riskScore}/100</span>
            <div style="flex:1;min-width:0">
              <div style="font-size:11px;font-weight:600;overflow:hidden;text-overflow:ellipsis">${r.appName}</div>
              <div style="font-size:10px;color:var(--color-text-tertiary)">${r.risks.slice(0, 2).join(' · ')}</div>
            </div>
            <span class="badge ${r.severity === 'critical' ? 'danger' : 'warning'}" style="flex-shrink:0">${r.severity}</span>
          </div>
        `).join('')}
        <button class="btn btn-primary mt-3" id="exec-view-risk"><i class="ti ti-arrow-right"></i> View all risks</button>
      </div>

      <div class="card">
        <div class="card-header">
          <span class="card-title"><i class="ti ti-checklist"></i> Critical Actions</span>
        </div>
        ${APPS_RECOMMENDATIONS.filter(r => r.priority === 'critical').slice(0, 4).map(r => `
          <div style="display:flex;align-items:flex-start;gap:8px;padding:6px 0;border-bottom:0.5px solid var(--color-border-tertiary)">
            <span class="badge danger" style="flex-shrink:0;font-size:9px;min-width:56px;justify-content:center">${r.priority}</span>
            <div style="flex:1">
              <div style="font-size:11px;font-weight:600;line-height:1.3">${r.title}</div>
              <div style="font-size:10px;color:var(--color-text-tertiary)">${r.app}</div>
            </div>
          </div>
        `).join('')}
        <button class="btn btn-primary mt-3" id="exec-view-recs"><i class="ti ti-arrow-right"></i> View all recommendations</button>
      </div>
    </div>
  `
}

// ============================================================
// APP REGISTRATIONS
// ============================================================
function renderAppRegistrations() {
  const apps = realApps.length > 0 ? realApps : APP_REGISTRATIONS
  const filtered = apps.filter(app => {
    if (appFilter.type !== 'all' && app.category !== appFilter.type) return false
    if (appFilter.status !== 'all' && app.status !== appFilter.status) return false
    if (appFilter.search && !app.name.toLowerCase().includes(appFilter.search.toLowerCase())) return false
    return true
  })

  const cats = [...new Set(apps.map(a => a.category))]

  return `
    <div class="filter-bar mb-3">
      <input type="text" class="form-input" id="app-search" placeholder="Search app name..." value="${appFilter.search}" style="min-width:200px">
      <select class="form-select" id="app-type-filter">
        <option value="all">All Categories</option>
        ${cats.map(c => `<option value="${c}" ${appFilter.type === c ? 'selected' : ''}>${c}</option>`).join('')}
      </select>
      <select class="form-select" id="app-status-filter">
        <option value="all" ${appFilter.status === 'all' ? 'selected' : ''}>All Status</option>
        <option value="active" ${appFilter.status === 'active' ? 'selected' : ''}>Active</option>
        <option value="inactive" ${appFilter.status === 'inactive' ? 'selected' : ''}>Inactive</option>
      </select>
      <span style="font-size:10px;color:var(--color-text-tertiary)">Showing ${filtered.length} of ${apps.length}</span>
    </div>

    <div class="card" style="padding:0;overflow:hidden">
      <table>
        <thead><tr>
          <th style="width:25%">Application Name</th>
          <th style="width:15%">Application ID</th>
          <th style="width:12%">Created</th>
          <th style="width:12%">Owners</th>
          <th style="width:11%">Type</th>
          <th style="width:10%">Status</th>
          <th style="width:5%">Risk</th>
        </tr></thead>
        <tbody>
          ${filtered.map(app => `
            <tr>
              <td style="font-weight:600">${app.name}${app.risk ? ` <span class="badge danger" style="font-size:8px">${app.risk}</span>` : ''}</td>
              <td><code style="font-size:10px;color:var(--clr-info-text)">${app.appId.substring(0,8)}...</code></td>
              <td style="font-size:11px">${app.created}</td>
              <td style="font-size:10px">${app.owners.length === 0 ? '<span class="badge danger">No owner</span>' : app.owners.join(', ')}</td>
              <td><span class="pill">${app.type}</span></td>
              <td><span class="badge ${app.status === 'active' ? 'success' : 'warning'}">${app.status}</span></td>
              <td style="text-align:center;font-size:16px">${app.risk === 'critical' ? '🔴' : app.risk === 'high' ? '🟠' : '🟢'}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>
  `
}

// ============================================================
// ENTERPRISE APPLICATIONS
// ============================================================
function renderEnterpriseApps() {
  const sps = realServicePrincipals.length > 0 ? realServicePrincipals : ENTERPRISE_APPLICATIONS
  const cats = [...new Set(sps.map(a => a.category || 'Other'))]
  return `
    <div class="filter-bar mb-3">
      <select class="form-select" style="min-width:150px">
        <option>All Categories</option>
        ${cats.map(c => `<option>${c}</option>`).join('')}
      </select>
    </div>

    <div class="grid-2 mb-3" style="gap:16px">
      ${sps.map(app => `
        <div class="card">
          <div style="display:flex;align-items:flex-start;gap:12px;margin-bottom:8px">
            <div style="flex:1">
              <div style="font-size:12px;font-weight:700">${app.name}</div>
              <div style="font-size:10px;color:var(--color-text-tertiary)">${app.publisher}</div>
            </div>
            <span class="badge ${app.riskLevel === 'low' ? 'success' : app.riskLevel === 'high' ? 'danger' : 'info'}">${app.riskLevel}</span>
          </div>
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;font-size:10px">
            <div>
              <div style="color:var(--color-text-tertiary)">Users Assigned</div>
              <div style="font-weight:700;font-size:14px">${app.usersAssigned}</div>
            </div>
            <div>
              <div style="color:var(--color-text-tertiary)">Last Sign-in</div>
              <div style="font-weight:600">${app.lastSignIn}</div>
            </div>
            <div>
              <div style="color:var(--color-text-tertiary)">Sign-ins (30d)</div>
              <div style="font-weight:700">${app.signInCount30d.toLocaleString()}</div>
            </div>
            <div>
              <div style="color:var(--color-text-tertiary)">Admin Consent</div>
              <div style="color:${app.adminConsent ? 'var(--clr-success-text)' : 'var(--clr-warning-text)'};font-weight:600">${app.adminConsent ? 'Granted' : 'Pending'}</div>
            </div>
          </div>
        </div>
      `).join('')}
    </div>
  `
}

// ============================================================
// SECRETS & CERTIFICATES
// ============================================================
function renderSecrets() {
  const expired = SECRETS_CERTIFICATES.filter(s => s.status === 'expired')
  const expiring = SECRETS_CERTIFICATES.filter(s => s.status === 'expiring')
  const healthy = SECRETS_CERTIFICATES.filter(s => s.status === 'healthy')

  return `
    ${expired.length > 0 ? `
      <div class="alert-banner danger mb-3">
        <i class="ti ti-alert-triangle"></i>
        <span><strong>${expired.length} secrets have EXPIRED</strong> — require immediate replacement</span>
      </div>
    ` : ''}

    ${expiring.length > 0 ? `
      <div class="alert-banner warning mb-3">
        <i class="ti ti-clock"></i>
        <span><strong>${expiring.length} secrets expiring within 30 days</strong> — schedule rotation</span>
      </div>
    ` : ''}

    <div style="margin-bottom:16px">
      <div class="section-heading">Expired Credentials (${expired.length})</div>
      ${expired.length === 0 ? '<p style="font-size:11px;color:var(--color-text-tertiary)">None — all credentials valid</p>' : `
        <div class="card" style="padding:0;overflow:hidden">
          <table style="width:100%;font-size:11px">
            <thead><tr>
              <th style="width:25%">Application</th>
              <th style="width:15%">Type</th>
              <th style="width:15%">Expired Date</th>
              <th style="width:20%">Days Overdue</th>
              <th style="width:15%">Rotation</th>
              <th style="width:10%">Action</th>
            </tr></thead>
            <tbody>
              ${expired.map(sec => `
                <tr>
                  <td style="font-weight:600">${sec.appName}</td>
                  <td><span class="pill">${sec.type}</span></td>
                  <td style="color:var(--clr-danger-text);font-weight:600">${sec.expiryDate}</td>
                  <td style="color:var(--clr-danger-text);font-weight:700">${Math.abs(sec.daysRemaining)} days overdue</td>
                  <td><span class="badge warning">${sec.rotation}</span></td>
                  <td><button class="btn btn-xs btn-danger">Rotate now</button></td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      `}
    </div>

    <div style="margin-bottom:16px">
      <div class="section-heading">Expiring Soon (${expiring.length})</div>
      <div class="card" style="padding:0;overflow:hidden">
        <table style="width:100%;font-size:11px">
          <thead><tr>
            <th style="width:25%">Application</th>
            <th style="width:15%">Type</th>
            <th style="width:15%">Expiry Date</th>
            <th style="width:20%">Days Remaining</th>
            <th style="width:15%">Rotation</th>
            <th style="width:10%">Action</th>
          </tr></thead>
          <tbody>
            ${expiring.map(sec => {
              const cls = sec.daysRemaining < 30 ? 'danger' : sec.daysRemaining < 60 ? 'warning' : 'success'
              return `
                <tr>
                  <td style="font-weight:600">${sec.appName}</td>
                  <td><span class="pill">${sec.type}</span></td>
                  <td>${sec.expiryDate}</td>
                  <td style="color:var(--clr-${cls}-text);font-weight:700">${sec.daysRemaining} days</td>
                  <td><span class="badge ${cls}">${sec.rotation}</span></td>
                  <td><button class="btn btn-xs">Schedule</button></td>
                </tr>
              `
            }).join('')}
          </tbody>
        </table>
      </div>
    </div>

    <div>
      <div class="section-heading">Healthy Credentials (${healthy.length})</div>
      ${healthy.map(sec => `
        <div style="display:flex;align-items:center;gap:10px;padding:8px 10px;background:var(--color-background-secondary);border-radius:var(--border-radius-md);margin-bottom:5px;font-size:11px">
          <i class="ti ti-circle-check" style="color:var(--clr-success-text);font-size:14px"></i>
          <span style="flex:1">${sec.appName}</span>
          <span style="color:var(--color-text-tertiary)">${sec.type}</span>
          <span style="color:var(--clr-success-text);font-weight:600">${sec.daysRemaining} days</span>
        </div>
      `).join('')}
    </div>
  `
}

// ============================================================
// PERMISSIONS
// ============================================================
function renderPermissions() {
  const critical = API_PERMISSIONS.filter(p => p.riskLevel === 'critical')
  const high = API_PERMISSIONS.filter(p => p.riskLevel === 'high')

  return `
    ${critical.length > 0 ? `
      <div class="alert-banner danger mb-3">
        <i class="ti ti-alert-triangle"></i>
        <span><strong>${critical.length} app${critical.length > 1 ? 's' : ''} with CRITICAL permissions</strong> — require urgent review</span>
      </div>
    ` : ''}

    <div class="section-heading">Critical Permission Assignments</div>
    ${critical.map(perm => `
      <div class="card mb-2">
        <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:8px">
          <div style="font-weight:700;color:var(--clr-danger-text)">${perm.appName}</div>
          <span class="badge danger">CRITICAL</span>
        </div>
        <div style="display:flex;flex-wrap:wrap;gap:4px">
          ${perm.permissions.map(p => `<code style="background:var(--clr-danger-bg);color:var(--clr-danger-text);padding:3px 6px;border-radius:4px;font-size:10px;font-family:monospace">${p}</code>`).join('')}
        </div>
        <div style="margin-top:8px;padding-top:8px;border-top:0.5px solid var(--color-border-tertiary);font-size:10px;color:var(--color-text-secondary)">
          ${perm.requiredGrant ? '✓ Admin consent required — verify necessity' : 'User-level permissions'}
        </div>
      </div>
    `).join('')}

    <div class="section-heading mt-4">High Permission Assignments</div>
    ${high.map(perm => `
      <div class="card mb-2">
        <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:8px">
          <div style="font-weight:700;color:var(--clr-warning-text)">${perm.appName}</div>
          <span class="badge warning">HIGH</span>
        </div>
        <div style="display:flex;flex-wrap:wrap;gap:4px;font-size:10px">
          ${perm.permissions.map(p => `<code style="background:var(--clr-warning-bg);color:var(--clr-warning-text);padding:2px 5px;border-radius:3px;font-family:monospace">${p}</code>`).join('')}
        </div>
      </div>
    `).join('')}
  `
}

// ============================================================
// ADMIN CONSENTS
// ============================================================
function renderConsents() {
  const tenantWide = ADMIN_CONSENTS.filter(c => c.scope === 'Tenant-wide')
  const userScoped = ADMIN_CONSENTS.filter(c => c.scope === 'User')

  return `
    <div class="alert-banner warning mb-3">
      <i class="ti ti-alert-triangle"></i>
      <span><strong>${tenantWide.length} tenant-wide admin consents granted</strong> — review quarterly</span>
    </div>

    <div class="section-heading">Tenant-Wide Consent Grants (${tenantWide.length})</div>
    ${tenantWide.map(consent => `
      <div class="card mb-2" style="border-left:3px solid ${consent.riskAlert ? 'var(--clr-danger-text)' : 'var(--color-border-secondary)'}">
        <div style="display:flex;align-items:flex-start;justify-content:space-between;margin-bottom:8px">
          <div>
            <div style="font-weight:700">${consent.appName}</div>
            <div style="font-size:10px;color:var(--color-text-tertiary)">Granted by ${consent.grantedBy} on ${consent.grantDate}</div>
          </div>
          ${consent.riskAlert ? '<span class="badge danger">⚠️ High Risk</span>' : ''}
        </div>
        <div style="display:flex;flex-wrap:wrap;gap:4px;margin-bottom:8px">
          ${consent.permissions.split(', ').map(p => `<code style="background:var(--color-background-secondary);padding:2px 6px;border-radius:3px;font-size:10px">${p}</code>`).join('')}
        </div>
      </div>
    `).join('')}

    <div class="section-heading mt-4">User-Scoped Consent (${userScoped.length})</div>
    ${userScoped.map(consent => `
      <div class="card mb-2">
        <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:6px">
          <div style="font-weight:700">${consent.appName}</div>
          <span style="font-size:10px;color:var(--color-text-tertiary)">Granted ${consent.grantDate}</span>
        </div>
        <div style="font-size:10px;color:var(--color-text-secondary)">${consent.permissions}</div>
      </div>
    `).join('')}
  `
}

// ============================================================
// OWNERS
// ============================================================
function renderOwners() {
  const noOwner = APP_REGISTRATIONS.filter(a => a.owners.length === 0)
  const singleOwner = APP_REGISTRATIONS.filter(a => a.owners.length === 1)
  const multiOwner = APP_REGISTRATIONS.filter(a => a.owners.length > 1)

  return `
    ${noOwner.length > 0 ? `
      <div class="alert-banner danger mb-3">
        <i class="ti ti-alert-triangle"></i>
        <span><strong>${noOwner.length} application${noOwner.length > 1 ? 's' : ''} without assigned owner</strong> — governance risk</span>
      </div>
    ` : ''}

    <div class="section-heading">No Owner Assigned (${noOwner.length})</div>
    ${noOwner.length === 0 ? '<p style="font-size:11px;color:var(--color-text-tertiary)">All applications have at least one owner.</p>' : `
      <div class="card" style="padding:0;overflow:hidden">
        <table style="width:100%;font-size:11px">
          <thead><tr><th style="width:40%">Application</th><th style="width:30%">Created</th><th style="width:20%">Status</th><th style="width:10%">Action</th></tr></thead>
          <tbody>
            ${noOwner.map(app => `
              <tr>
                <td style="font-weight:700;color:var(--clr-danger-text)">${app.name}</td>
                <td>${app.created}</td>
                <td><span class="badge warning">${app.status}</span></td>
                <td><button class="btn btn-xs btn-danger">Assign owner</button></td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    `}

    <div class="section-heading mt-4">Single Owner (${singleOwner.length}) — At Risk</div>
    <p style="font-size:10px;color:var(--color-text-tertiary);margin-bottom:8px">Recommendation: Assign secondary owner for redundancy</p>
    ${singleOwner.slice(0, 5).map(app => `
      <div style="display:flex;align-items:center;justify-content:space-between;padding:8px;background:var(--color-background-secondary);border-radius:var(--border-radius-md);margin-bottom:4px;font-size:11px">
        <div>
          <div style="font-weight:600">${app.name}</div>
          <div style="color:var(--color-text-tertiary)">Owner: ${app.owners[0]}</div>
        </div>
        <button class="btn btn-xs">Add owner</button>
      </div>
    `).join('')}

    <div class="section-heading mt-4">Multiple Owners (${multiOwner.length}) ✅</div>
    ${multiOwner.map(app => `
      <div style="display:flex;align-items:center;justify-content:space-between;padding:8px;background:var(--clr-success-bg);border-radius:var(--border-radius-md);margin-bottom:4px;font-size:11px">
        <div>
          <div style="font-weight:600">${app.name}</div>
          <div style="color:var(--color-text-tertiary)">${app.owners.join(', ')}</div>
        </div>
      </div>
    `).join('')}
  `
}

// ============================================================
// USAGE ANALYTICS
// ============================================================
function renderUsage() {
  const active = SIGN_IN_ANALYTICS.filter(a => a.status === 'active')
  const lowuse = SIGN_IN_ANALYTICS.filter(a => a.status === 'lowuse')
  const unused = SIGN_IN_ANALYTICS.filter(a => a.status === 'unused')

  return `
    <div class="section-heading">Actively Used Applications (${active.length})</div>
    ${active.map(app => `
      <div class="card mb-2">
        <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:8px">
          <div style="font-weight:700">${app.appName}</div>
          <span class="badge success">Active</span>
        </div>
        <div class="grid-2" style="gap:12px;font-size:10px;margin-top:8px">
          <div>
            <div style="color:var(--color-text-tertiary)">Last Sign-in</div>
            <div style="font-weight:600">${app.lastSignIn}</div>
          </div>
          <div>
            <div style="color:var(--color-text-tertiary)">Sign-ins (30d)</div>
            <div style="font-weight:600">${app.signInCount30d.toLocaleString()}</div>
          </div>
          <div>
            <div style="color:var(--color-text-tertiary)">Active Users</div>
            <div style="font-weight:600">${app.activeUsers30d}</div>
          </div>
          <div>
            <div style="color:var(--color-text-tertiary)">Failed Sign-ins</div>
            <div style="color:var(--clr-warning-text);font-weight:600">${app.failedSignins}</div>
          </div>
        </div>
      </div>
    `).join('')}

    <div class="section-heading mt-4">Low Usage Applications (${lowuse.length})</div>
    ${lowuse.map(app => `
      <div class="card mb-2" style="background:var(--color-background-secondary);border-left:3px solid var(--clr-warning-text)">
        <div style="display:flex;align-items:center;justify-content:space-between">
          <div style="font-weight:700">${app.appName}</div>
          <span class="badge warning">Low Use</span>
        </div>
      </div>
    `).join('')}

    <div class="section-heading mt-4">Unused Applications (${unused.length}) — Decommission Candidates</div>
    ${unused.map(app => `
      <div class="alert-banner warning mb-2">
        <i class="ti ti-clock"></i>
        <div>
          <div style="font-weight:700">${app.appName}</div>
          <div style="font-size:10px">Last sign-in: ${app.lastSignIn}</div>
        </div>
      </div>
    `).join('')}
  `
}

// ============================================================
// RISK ASSESSMENT
// ============================================================
function renderRisk() {
  const critical = RISK_ASSESSMENT.filter(r => r.severity === 'critical')
  const high = RISK_ASSESSMENT.filter(r => r.severity === 'high')

  return `
    <div class="alert-banner danger mb-3">
      <i class="ti ti-alert-triangle"></i>
      <span><strong>${critical.length} applications pose CRITICAL risk</strong> — require immediate security review</span>
    </div>

    <div class="section-heading">Critical Risk Applications (${critical.length})</div>
    ${critical.map(app => `
      <div class="card mb-2" style="border-left:3px solid var(--clr-danger-text)">
        <div style="display:flex;align-items:flex-start;justify-content:space-between;margin-bottom:8px">
          <div>
            <div style="font-size:14px;font-weight:800;color:var(--clr-danger-text)">${app.riskScore}/100</div>
            <div style="font-weight:700;font-size:12px;margin-top:4px">${app.appName}</div>
          </div>
          <span class="badge danger">CRITICAL</span>
        </div>
        <div style="display:flex;flex-wrap:wrap;gap:4px">
          ${app.risks.map(r => `<span class="badge danger" style="font-size:9px">${r}</span>`).join('')}
        </div>
      </div>
    `).join('')}

    <div class="section-heading mt-4">High Risk Applications (${high.length})</div>
    ${high.map(app => `
      <div class="card mb-2">
        <div style="display:flex;align-items:flex-start;justify-content:space-between">
          <div>
            <div style="font-size:14px;font-weight:700;color:var(--clr-warning-text)">${app.riskScore}/100</div>
            <div style="font-weight:700;margin-top:4px">${app.appName}</div>
          </div>
          <span class="badge warning">HIGH</span>
        </div>
      </div>
    `).join('')}
  `
}

// ============================================================
// LIFECYCLE MANAGEMENT
// ============================================================
function renderLifecycle() {
  const recent = APP_REGISTRATIONS.filter(a => {
    const created = new Date(a.created)
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
    return created > thirtyDaysAgo
  })
  const orphaned = APP_REGISTRATIONS.filter(a => a.owners.length === 0 || (a.status === 'inactive' && a.risk === 'critical'))
  const decommission = SIGN_IN_ANALYTICS.filter(a => a.status === 'unused')

  return `
    <div class="section-heading">Recently Created (Last 30 Days)</div>
    ${recent.length === 0 ? '<p style="font-size:11px;color:var(--color-text-tertiary)">No new applications created.</p>' : `
      ${recent.map(app => `
        <div style="padding:10px;background:var(--color-background-secondary);border-radius:var(--border-radius-md);margin-bottom:8px">
          <div style="font-weight:700">${app.name}</div>
          <div style="font-size:10px;color:var(--color-text-tertiary)">Created ${app.created} · Owners: ${app.owners.length > 0 ? app.owners.join(', ') : 'NONE'}</div>
        </div>
      `).join('')}
    `}

    <div class="section-heading mt-4">Orphaned Applications</div>
    ${orphaned.map(app => `
      <div class="alert-banner danger mb-2">
        <i class="ti ti-alert-triangle"></i>
        <span><strong>${app.name}</strong> — no owner, unused, or expired credentials</span>
      </div>
    `).join('')}

    <div class="section-heading mt-4">Decommission Candidates (${decommission.length})</div>
    ${decommission.map(app => `
      <div style="padding:10px;background:var(--clr-danger-bg);color:var(--clr-danger-text);border-radius:var(--border-radius-md);margin-bottom:6px;font-size:11px">
        <div style="font-weight:700">${app.appName}</div>
        <div>No sign-ins for ${Math.round((Date.now() - new Date('2025-12-10')) / (24 * 60 * 60 * 1000))} days</div>
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
          <th style="width:12%">Priority</th>
          <th style="width:40%">Recommendation</th>
          <th style="width:15%">Application</th>
          <th style="width:15%">Category</th>
          <th style="width:10%">Effort</th>
          <th style="width:8%">Action</th>
        </tr></thead>
        <tbody>
          ${APPS_RECOMMENDATIONS.map(r => `
            <tr>
              <td><span class="badge ${r.priority === 'critical' ? 'danger' : r.priority === 'high' ? 'warning' : 'info'}">${r.priority}</span></td>
              <td style="font-size:11px;font-weight:500">${r.title}</td>
              <td style="font-size:11px">${r.app}</td>
              <td><span class="pill">${r.category}</span></td>
              <td style="font-size:11px">${r.effort}</td>
              <td><button class="btn btn-xs">Review</button></td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>
  `
}

// ============================================================
// APP COPILOT
// ============================================================
function renderAppCopilot() {
  if (!copilotInit || copilotMessages.length === 0) {
    copilotMessages = [{
      role: 'ai',
      text: `**Applications & App Registrations Copilot** — Ask me about app security, secrets, permissions, risks, and more.\n\nCurrent state: **87 app registrations**, **124 enterprise apps**, **5 expiring secrets (30d)**, **2 critical risk apps**`
    }]
    copilotInit = true
  }

  const suggestions = [
    'Show expiring secrets',
    'Which apps have Directory.ReadWrite.All?',
    'List apps without owners',
    'Show high-risk applications',
    'Unused apps (90+ days)',
    'Multi-tenant applications',
  ]

  return `
    <div style="display:flex;flex-direction:column;height:calc(100vh - 340px);min-height:450px">
      <div style="overflow-y:auto;flex:1;padding-bottom:8px" id="app-cop-msgs">
        ${copilotMessages.map(m => `
          <div class="chat-msg ${m.role === 'ai' ? 'ai' : 'user-msg'}" style="max-width:85%;margin-bottom:12px">
            ${m.role === 'ai' ? `<div class="chat-sender"><i class="ti ti-app-window" style="color:var(--clr-info-text)"></i> App Copilot</div>` : `<div class="chat-sender" style="justify-content:flex-end">You</div>`}
            <div class="chat-bubble">${formatAppMsg(m.text)}</div>
          </div>
        `).join('')}
      </div>

      <div style="display:flex;flex-wrap:wrap;gap:5px;padding:8px 0 8px;border-top:0.5px solid var(--color-border-tertiary)">
        ${suggestions.slice(0, 5).map(s => `<button class="suggestion-pill app-cop-pill" data-q="${s}">${s}</button>`).join('')}
      </div>

      <div class="chat-input-area" style="padding:0;border-top:none;margin-top:4px">
        <textarea class="chat-input" id="app-cop-input" placeholder="Ask about app security, secrets, permissions, risks..." rows="1"></textarea>
        <button class="btn btn-primary" id="app-cop-send"><i class="ti ti-send"></i></button>
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
  const content = el.querySelector('#app-content')
  if (!content) return

  // App Registrations filters
  content.querySelector('#app-search')?.addEventListener('input', e => { appFilter.search = e.target.value; render(el) })
  content.querySelector('#app-type-filter')?.addEventListener('change', e => { appFilter.type = e.target.value; render(el) })
  content.querySelector('#app-status-filter')?.addEventListener('change', e => { appFilter.status = e.target.value; render(el) })

  // Executive nav shortcuts
  content.querySelector('#exec-view-risk')?.addEventListener('click', () => { activeSection = 'risk'; render(el) })
  content.querySelector('#exec-view-recs')?.addEventListener('click', () => { activeSection = 'recommendations'; render(el) })

  // App Copilot
  const copSend = content.querySelector('#app-cop-send')
  const copInput = content.querySelector('#app-cop-input')
  if (copSend && copInput) {
    copSend.addEventListener('click', () => sendAppCopilotMsg(el, copInput))
    copInput.addEventListener('keydown', e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendAppCopilotMsg(el, copInput) } })
  }

  content.querySelectorAll('.app-cop-pill').forEach(p => {
    p.addEventListener('click', () => {
      const inp = content.querySelector('#app-cop-input')
      if (inp) { inp.value = p.dataset.q; sendAppCopilotMsg(el, inp) }
    })
  })
}

function sendAppCopilotMsg(el, input) {
  const text = input.value.trim()
  if (!text) return
  copilotMessages.push({ role: 'user', text })
  input.value = ''

  const msgs = el.querySelector('#app-cop-msgs')
  if (msgs) {
    msgs.innerHTML += `<div class="chat-msg user-msg" style="max-width:85%;margin-bottom:12px">
      <div class="chat-sender" style="justify-content:flex-end">You</div>
      <div class="chat-bubble">${text}</div>
    </div>`
    msgs.scrollTop = msgs.scrollHeight
  }

  setTimeout(() => {
    const q = text.toLowerCase()
    const match = APPS_COPILOT_KB.find(r => r.keywords.some(k => q.includes(k)))
    const response = match?.response || `Searching application data for **"${text}"**...\n\nBased on your question, navigate to the relevant section above. Current state: 87 app registrations, 2 expired secrets, 2 critical risk apps, 5 recommendations.`

    copilotMessages.push({ role: 'ai', text: response })
    if (msgs) {
      msgs.innerHTML += `<div class="chat-msg ai" style="max-width:85%;margin-bottom:12px">
        <div class="chat-sender"><i class="ti ti-app-window" style="color:var(--clr-info-text)"></i> App Copilot</div>
        <div class="chat-bubble">${formatAppMsg(response)}</div>
      </div>`
      msgs.scrollTop = msgs.scrollHeight
    }
  }, 600)
}

function formatAppMsg(text) {
  return text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/\n/g, '<br>')
}
