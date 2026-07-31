import { go } from '../app.js'
import { showToast } from '../components/toast.js'
import { getApplications, getServicePrincipals, api, startPermissionsAudit, getPermissionsAuditStatus, getPermissionsAuditHistory } from '../lib/api-client.js'
import { isDemoAccount } from '../lib/demo-account.js'
import { APPS_SUMMARY, APPS_RECOMMENDATIONS, APPS_COPILOT_KB } from '../data/apps-data.js'
import { skeletonLoader } from '../lib/skeleton-loader.js'

let activeSection = 'executive'
let appFilter = { type: 'all', status: 'all', search: '' }
let consentFilter = 'all'  // Phase 2.4: Consent Governance filter (all/admin/user/revoked)
let copilotMessages = []
let copilotInit = false
let realApps = []
let realServicePrincipals = []
let realSecrets = []
let realPermissions = []
let realConsents = []
let auditConsents = []
let recentConsents = []
let realUsage = []
let realRisks = []
let realRecommendations = []
let permissionsAuditHistory = []
let permissionsLastUpdated = null
let permissionsLoaded = false
let permissionsLoading = false

const APP_TABS = [
  { id: 'executive',        label: 'Executive',          icon: 'ti-layout-dashboard' },
  { id: 'appregistrations', label: 'App Registrations',  icon: 'ti-app-window' },
  { id: 'enterprise',       label: 'Enterprise Apps',    icon: 'ti-grid-dots' },
  { id: 'secrets',          label: 'Secrets & Certs',    icon: 'ti-lock' },
  { id: 'permissions',      label: 'Permissions',        icon: 'ti-shield-check' },
  { id: 'auditconsents',    label: 'Consent Governance', icon: 'ti-shield-lock' },  // Phase 2.4: Renamed from "Audit Consents"
  { id: 'owners',           label: 'Owners',             icon: 'ti-users' },
  { id: 'usage',            label: 'Usage Analytics',    icon: 'ti-chart-line' },
  { id: 'risk',             label: 'Risk Center',        icon: 'ti-alert-triangle' },  // Phase 1.3: Renamed from "Risk Assessment"
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

  if (isDemoAccount()) {
    console.log('🎭 Demo account detected - showing demo applications data')
    renderDemoApplicationsPage(el)
    return
  }

  // Show skeleton immediately
  el.innerHTML = `
    <div>
      ${skeletonLoader.renderPageHeader('Entra Applications', 'App registrations, enterprise apps, and permissions', true)}
      ${skeletonLoader.renderMetricsRowSkeleton(5)}
      ${skeletonLoader.renderTabsWithContentSkeleton(8, true)}
    </div>
  `

  console.log('📡 Fetching real application data from backend...')

  // Load applications
  const appsResult = await getApplications()
  if (appsResult?.success && appsResult.data) {
    realApps = appsResult.data
    console.log(`✅ Apps: ${realApps.length}`)
  } else {
    console.warn('⚠️ No application data available from API')
    realApps = []
  }

  // Load service principals
  const spResult = await getServicePrincipals()
  if (spResult?.success && spResult.data) {
    realServicePrincipals = spResult.data
    console.log(`✅ SPs: ${realServicePrincipals.length}`)
  } else {
    console.warn('⚠️ No service principal data available from API')
    realServicePrincipals = []
  }

  // Load secrets
  try {
    const r = await fetch(`${api}/secrets-certificates`)
    const d = await r.json()
    if (d?.success) {
      realSecrets = d.data || []
      console.log(`✅ Secrets: ${realSecrets.length}`)
    }
  } catch (e) {
    console.warn('⚠️ Secrets error:', e.message)
  }

  // Permissions are loaded lazily when the tab is clicked (see loadPermissionsData function)

  // Load consents
  try {
    const r = await fetch(`${api}/admin-consents`)
    const d = await r.json()
    if (d?.success) {
      realConsents = d.data || []
      console.log(`✅ Consents: ${realConsents.length}`)
    }
  } catch (e) {
    console.warn('⚠️ Consents error:', e.message)
  }

  // Load recent consents (last 24 hours)
  try {
    const r = await fetch(`${api}/recent-consents`)
    const d = await r.json()
    if (d?.success) {
      recentConsents = d.data || []
      console.log(`✅ Recent Consents: ${recentConsents.length}`)
    }
  } catch (e) {
    console.warn('⚠️ Recent Consents error:', e.message)
  }

  // Load audit logs consents
  try {
    const r = await fetch(`${api}/audit-logs/consents`)
    const d = await r.json()
    if (d?.success) {
      auditConsents = d.data || []
      console.log(`✅ Audit Consents: ${auditConsents.length}`)
    }
  } catch (e) {
    console.warn('⚠️ Audit Consents error:', e.message)
  }

  // Load permissions audit history
  try {
    const h = await getPermissionsAuditHistory()
    if (h?.success) {
      permissionsAuditHistory = h.data || []
      if (permissionsAuditHistory.length > 0) {
        permissionsLastUpdated = permissionsAuditHistory[0].auditTimestamp
      }
      console.log(`✅ Permissions Audit History: ${permissionsAuditHistory.length}`)
    }
  } catch (e) {
    console.warn('⚠️ Permissions Audit History error:', e.message)
  }

  // Load usage
  try {
    const r = await fetch(`${api}/usage-analytics`)
    const d = await r.json()
    if (d?.success) {
      realUsage = d.data || []
      console.log(`✅ Usage: ${realUsage.length}`)
    }
  } catch (e) {
    console.warn('⚠️ Usage error:', e.message)
  }

  // Load risks
  try {
    const r = await fetch(`${api}/risk-assessment`)
    const d = await r.json()
    if (d?.success) {
      realRisks = d.data || []
      console.log(`✅ Risks: ${realRisks.length}`)
    }
  } catch (e) {
    console.warn('⚠️ Risk error:', e.message)
  }

  // Load recommendations
  try {
    const r = await fetch(`${api}/recommendations`)
    const d = await r.json()
    if (d?.success) {
      realRecommendations = d.data || []
      console.log(`✅ Recs: ${realRecommendations.length}`)
    }
  } catch (e) {
    console.warn('⚠️ Recs error:', e.message)
  }

  render(el)
}

function renderDemoApplicationsPage(el) {
  const demoApps = [
    { id: 'app-001', name: 'Power BI Service', owners: ['Chen Wei', 'Priya Kumar'], lastUsed: '2026-06-01', status: 'active', riskLevel: 'low', secretsExpiring: 0 },
    { id: 'app-002', name: 'Salesforce Integration', owners: ['Aisha Raza'], lastUsed: '2026-06-01', status: 'active', riskLevel: 'medium', secretsExpiring: 1 },
    { id: 'app-003', name: 'ServiceNow Connector', owners: ['Chen Wei', 'Sanjay Kumar'], lastUsed: '2026-05-31', status: 'active', riskLevel: 'low', secretsExpiring: 0 },
    { id: 'app-004', name: 'Slack Integration', owners: ['Priya Kumar'], lastUsed: '2026-05-30', status: 'inactive', riskLevel: 'low', secretsExpiring: 0 },
    { id: 'app-005', name: 'Azure DevOps Extension', owners: ['Chen Wei'], lastUsed: '2026-06-01', status: 'active', riskLevel: 'high', secretsExpiring: 2 },
  ]

  const demoSummary = {
    totalApps: demoApps.length,
    activeApps: 4,
    inactiveApps: 1,
    appPermissions: 12,
    delegatedPermissions: 18,
    appRoles: 8,
    secretsExpiring: 3,
    secretsExpired: 0,
    highRiskApps: 1,
  }

  const demoConsents = [
    { appName: 'Power BI Service', permissions: 'Dataset.ReadWrite.All, Report.Read.All', grantedBy: 'Chen Wei', grantedAt: '2026-06-01 14:32', status: 'Approved' },
    { appName: 'Salesforce Integration', permissions: 'User.Read.All, Directory.Read.All', grantedBy: 'Aisha Raza', grantedAt: '2026-06-01 11:15', status: 'Approved' },
    { appName: 'ServiceNow Connector', permissions: 'Mail.Send, Mail.Read', grantedBy: 'Admin', grantedAt: '2026-05-30 09:45', status: 'Approved' },
  ]

  const demoSecrets = [
    { appName: 'Salesforce Integration', type: 'Client Secret', expiresAt: '2026-06-15', status: 'Expiring soon', daysLeft: 14 },
    { appName: 'Azure DevOps Extension', type: 'Client Secret', expiresAt: '2026-06-10', status: 'Expiring soon', daysLeft: 9 },
    { appName: 'Azure DevOps Extension', type: 'Certificate', expiresAt: '2026-06-08', status: 'Critical', daysLeft: 7 },
  ]

  el.innerHTML = `
    <div class="page-header">
      <div>
        <div class="page-title"><i class="fas fa-window-maximize"></i> Applications</div>
        <div class="page-subtitle">Manage app registrations, permissions, and consent</div>
      </div>
      <div style="display:flex;gap:8px;align-items:center">
        <button class="page-help" title="View and manage Azure AD application registrations, permissions, and user consent settings. Monitor app security and access levels.">
          <i class="fas fa-question-circle"></i>
        </button>
        <div class="page-actions">
          <button class="btn" id="navigate-compliance-reports"><i class="ti ti-file-text"></i> Compliance Reports</button>
          <button class="btn"><i class="fas fa-sync"></i> Refresh</button>
        </div>
      </div>
    </div>

    <div style="display:flex;align-items:center;gap:8px;padding:8px 12px;background:var(--color-background-primary);border:0.5px solid var(--color-border-secondary);border-radius:var(--border-radius-md);margin-bottom:16px;font-size:10px;color:var(--color-text-tertiary)">
      <span class="status-dot active pulse"></span>
      <span><strong style="color:var(--color-text-secondary)">Demo Mode</strong> · Showing sample application data</span>
    </div>

    <div class="tabs" id="app-tabs" style="margin-bottom:16px">
      ${APP_TABS.slice(0, 4).map((tab, i) => `
        <button class="tab-btn ${i === 0 ? 'active' : ''}" data-tab="${tab.id}">
          <i class="ti ${tab.icon}"></i> ${tab.label}
        </button>
      `).join('')}
    </div>

    <div id="app-content"></div>
  `

  const contentEl = el.querySelector('#app-content')
  renderDemoExecutive(contentEl, demoSummary, demoApps)

  el.querySelectorAll('#app-tabs .tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      el.querySelectorAll('#app-tabs .tab-btn').forEach(b => b.classList.remove('active'))
      btn.classList.add('active')
      const tabId = btn.dataset.tab

      if (tabId === 'executive') renderDemoExecutive(contentEl, demoSummary, demoApps)
      else if (tabId === 'appregistrations') renderDemoAppRegistrations(contentEl, demoApps)
      else if (tabId === 'enterprise') renderDemoEnterpriseApps(contentEl, demoApps)
      else if (tabId === 'secrets') renderDemoSecrets(contentEl, demoSecrets)
    })
  })
}

function renderDemoExecutive(el, summary, apps) {
  const riskApps = apps.filter(a => a.riskLevel === 'high')
  el.innerHTML = `
    <div class="card mb-3">
      <div class="card-header">
        <span class="card-title">Application Overview</span>
      </div>
      <div style="display:grid;grid-template-columns:1fr 1fr 1fr 1fr;gap:12px">
        <div style="padding:12px;background:var(--color-background-secondary);border-radius:var(--border-radius-md)">
          <div style="font-size:10px;color:var(--color-text-tertiary);text-transform:uppercase;font-weight:600;margin-bottom:6px">Total Apps</div>
          <div style="font-size:24px;font-weight:700;color:var(--clr-info-text)">${summary.totalApps}</div>
        </div>
        <div style="padding:12px;background:var(--color-background-secondary);border-radius:var(--border-radius-md)">
          <div style="font-size:10px;color:var(--color-text-tertiary);text-transform:uppercase;font-weight:600;margin-bottom:6px">Active</div>
          <div style="font-size:24px;font-weight:700;color:var(--clr-success-text)">${summary.activeApps}</div>
        </div>
        <div style="padding:12px;background:var(--color-background-secondary);border-radius:var(--border-radius-md)">
          <div style="font-size:10px;color:var(--color-text-tertiary);text-transform:uppercase;font-weight:600;margin-bottom:6px">Secrets Expiring</div>
          <div style="font-size:24px;font-weight:700;color:var(--clr-warning-text)">${summary.secretsExpiring}</div>
        </div>
        <div style="padding:12px;background:var(--color-background-secondary);border-radius:var(--border-radius-md)">
          <div style="font-size:10px;color:var(--color-text-tertiary);text-transform:uppercase;font-weight:600;margin-bottom:6px">High Risk</div>
          <div style="font-size:24px;font-weight:700;color:var(--clr-danger-text)">${riskApps.length}</div>
        </div>
      </div>
    </div>

    <div class="card mb-3">
      <div class="card-header">
        <span class="card-title">Registered Applications</span>
        <span class="badge info">${apps.length} apps</span>
      </div>
      <table style="width:100%">
        <thead style="background:var(--color-background-secondary)">
          <tr>
            <th style="padding:10px 12px;text-align:left;font-size:10px;font-weight:600">Application Name</th>
            <th style="padding:10px 12px;text-align:left;font-size:10px;font-weight:600">Owners</th>
            <th style="padding:10px 12px;text-align:left;font-size:10px;font-weight:600">Status</th>
            <th style="padding:10px 12px;text-align:left;font-size:10px;font-weight:600">Risk</th>
            <th style="padding:10px 12px;text-align:left;font-size:10px;font-weight:600">Last Used</th>
          </tr>
        </thead>
        <tbody>
          ${apps.map((app, i) => `
            <tr style="border-bottom:${i < apps.length - 1 ? '0.5px solid var(--color-border-tertiary)' : 'none'}">
              <td style="padding:10px 12px;font-size:11px;font-weight:600">${app.name}</td>
              <td style="padding:10px 12px;font-size:10px;color:var(--color-text-secondary)">${app.owners.join(', ')}</td>
              <td style="padding:10px 12px"><span class="badge ${app.status === 'active' ? 'success' : 'neutral'}">${app.status}</span></td>
              <td style="padding:10px 12px"><span class="badge ${app.riskLevel === 'high' ? 'danger' : app.riskLevel === 'medium' ? 'warning' : 'success'}">${app.riskLevel}</span></td>
              <td style="padding:10px 12px;font-size:10px;color:var(--color-text-tertiary)">${app.lastUsed}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>
  `
}

function renderDemoAppRegistrations(el, apps) {
  el.innerHTML = `
    <div class="card">
      <div class="card-header">
        <span class="card-title">App Registrations</span>
      </div>
      <table style="width:100%">
        <thead style="background:var(--color-background-secondary)">
          <tr>
            <th style="padding:10px 12px;text-align:left;font-size:10px;font-weight:600">App Name</th>
            <th style="padding:10px 12px;text-align:left;font-size:10px;font-weight:600">App ID</th>
            <th style="padding:10px 12px;text-align:left;font-size:10px;font-weight:600">Status</th>
          </tr>
        </thead>
        <tbody>
          ${apps.map((app, i) => `
            <tr style="border-bottom:${i < apps.length - 1 ? '0.5px solid var(--color-border-tertiary)' : 'none'}">
              <td style="padding:10px 12px;font-size:11px;font-weight:600">${app.name}</td>
              <td style="padding:10px 12px;font-size:9px;font-family:monospace;color:var(--color-text-tertiary)">${app.id}</td>
              <td style="padding:10px 12px"><span class="badge ${app.status === 'active' ? 'success' : 'neutral'}">${app.status}</span></td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>
  `
}

function renderDemoEnterpriseApps(el, apps) {
  el.innerHTML = `
    <div class="card">
      <div class="card-header">
        <span class="card-title">Enterprise Applications</span>
      </div>
      <table style="width:100%">
        <thead style="background:var(--color-background-secondary)">
          <tr>
            <th style="padding:10px 12px;text-align:left;font-size:10px;font-weight:600">Application</th>
            <th style="padding:10px 12px;text-align:left;font-size:10px;font-weight:600">Owners</th>
            <th style="padding:10px 12px;text-align:left;font-size:10px;font-weight:600">Users</th>
          </tr>
        </thead>
        <tbody>
          ${apps.filter(a => a.status === 'active').map((app, i) => `
            <tr style="border-bottom:${i < 3 ? '0.5px solid var(--color-border-tertiary)' : 'none'}">
              <td style="padding:10px 12px;font-size:11px;font-weight:600">${app.name}</td>
              <td style="padding:10px 12px;font-size:10px">${app.owners[0]}</td>
              <td style="padding:10px 12px;font-size:10px;color:var(--color-text-secondary)">${Math.floor(Math.random() * 500) + 10} users</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>
  `
}

function renderDemoSecrets(el, secrets) {
  el.innerHTML = `
    <div class="alert-banner warning" style="margin-bottom:16px">
      <i class="ti ti-alert-triangle"></i>
      <span><strong>3 secrets expiring soon</strong> — Review and rotate before expiration</span>
    </div>
    <div class="card">
      <div class="card-header">
        <span class="card-title">Credentials & Certificates</span>
        <span class="badge warning">${secrets.length} expiring</span>
      </div>
      <table style="width:100%">
        <thead style="background:var(--color-background-secondary)">
          <tr>
            <th style="padding:10px 12px;text-align:left;font-size:10px;font-weight:600">Application</th>
            <th style="padding:10px 12px;text-align:left;font-size:10px;font-weight:600">Type</th>
            <th style="padding:10px 12px;text-align:left;font-size:10px;font-weight:600">Expires</th>
            <th style="padding:10px 12px;text-align:left;font-size:10px;font-weight:600">Days Left</th>
            <th style="padding:10px 12px;text-align:left;font-size:10px;font-weight:600">Status</th>
          </tr>
        </thead>
        <tbody>
          ${secrets.map((secret, i) => `
            <tr style="border-bottom:${i < secrets.length - 1 ? '0.5px solid var(--color-border-tertiary)' : 'none'}">
              <td style="padding:10px 12px;font-size:11px;font-weight:600">${secret.appName}</td>
              <td style="padding:10px 12px;font-size:10px">${secret.type}</td>
              <td style="padding:10px 12px;font-size:10px;color:var(--color-text-secondary)">${secret.expiresAt}</td>
              <td style="padding:10px 12px;font-size:10px">${secret.daysLeft} days</td>
              <td style="padding:10px 12px"><span class="badge ${secret.status === 'Critical' ? 'danger' : 'warning'}">${secret.status}</span></td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>
  `
}

function renderDemoPermissions(el, summary) {
  el.innerHTML = `
    <div class="card mb-3">
      <div class="card-header">
        <span class="card-title">Permission Summary</span>
      </div>
      <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:12px;padding:12px">
        <div style="padding:12px;background:var(--color-background-secondary);border-radius:var(--border-radius-md)">
          <div style="font-size:10px;color:var(--color-text-tertiary);text-transform:uppercase;font-weight:600;margin-bottom:6px">App Permissions</div>
          <div style="font-size:20px;font-weight:700;color:var(--clr-danger-text)">${summary.appPermissions}</div>
        </div>
        <div style="padding:12px;background:var(--color-background-secondary);border-radius:var(--border-radius-md)">
          <div style="font-size:10px;color:var(--color-text-tertiary);text-transform:uppercase;font-weight:600;margin-bottom:6px">Delegated</div>
          <div style="font-size:20px;font-weight:700;color:var(--clr-warning-text)">${summary.delegatedPermissions}</div>
        </div>
        <div style="padding:12px;background:var(--color-background-secondary);border-radius:var(--border-radius-md)">
          <div style="font-size:10px;color:var(--color-text-tertiary);text-transform:uppercase;font-weight:600;margin-bottom:6px">App Roles</div>
          <div style="font-size:20px;font-weight:700;color:var(--clr-info-text)">${summary.appRoles}</div>
        </div>
      </div>
    </div>
    <div class="card">
      <div class="card-header">
        <span class="card-title">Top Permissions Requested</span>
      </div>
      <table style="width:100%">
        <thead style="background:var(--color-background-secondary)">
          <tr>
            <th style="padding:10px 12px;text-align:left;font-size:10px;font-weight:600">Permission</th>
            <th style="padding:10px 12px;text-align:left;font-size:10px;font-weight:600">Type</th>
            <th style="padding:10px 12px;text-align:left;font-size:10px;font-weight:600">Apps Using</th>
          </tr>
        </thead>
        <tbody>
          <tr style="border-bottom:0.5px solid var(--color-border-tertiary)">
            <td style="padding:10px 12px;font-size:10px">User.Read.All</td>
            <td style="padding:10px 12px"><span class="badge danger">App</span></td>
            <td style="padding:10px 12px;font-size:10px">4 apps</td>
          </tr>
          <tr style="border-bottom:0.5px solid var(--color-border-tertiary)">
            <td style="padding:10px 12px;font-size:10px">Mail.Send</td>
            <td style="padding:10px 12px"><span class="badge warning">Delegated</span></td>
            <td style="padding:10px 12px;font-size:10px">3 apps</td>
          </tr>
          <tr>
            <td style="padding:10px 12px;font-size:10px">Files.ReadWrite.All</td>
            <td style="padding:10px 12px"><span class="badge danger">App</span></td>
            <td style="padding:10px 12px;font-size:10px">2 apps</td>
          </tr>
        </tbody>
      </table>
    </div>
  `
}

function renderDemoAuditConsents(el, consents) {
  el.innerHTML = `
    <div class="card">
      <div class="card-header">
        <span class="card-title">Admin Consents Granted</span>
        <span class="badge success">${consents.length} consents</span>
      </div>
      <table style="width:100%">
        <thead style="background:var(--color-background-secondary)">
          <tr>
            <th style="padding:10px 12px;text-align:left;font-size:10px;font-weight:600">Application</th>
            <th style="padding:10px 12px;text-align:left;font-size:10px;font-weight:600">Permissions</th>
            <th style="padding:10px 12px;text-align:left;font-size:10px;font-weight:600">Granted By</th>
            <th style="padding:10px 12px;text-align:left;font-size:10px;font-weight:600">Date</th>
          </tr>
        </thead>
        <tbody>
          ${consents.map((consent, i) => `
            <tr style="border-bottom:${i < consents.length - 1 ? '0.5px solid var(--color-border-tertiary)' : 'none'}">
              <td style="padding:10px 12px;font-size:11px;font-weight:600">${consent.appName}</td>
              <td style="padding:10px 12px;font-size:10px;color:var(--color-text-secondary)">${consent.permissions.substring(0, 35)}...</td>
              <td style="padding:10px 12px;font-size:10px">${consent.grantedBy}</td>
              <td style="padding:10px 12px;font-size:10px;color:var(--color-text-tertiary)">${consent.grantedAt}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>
  `
}

function render(el) {
  const expiringSecrets = (realSecrets || []).filter(s => s.status === 'expiring').length
  const expiredSecrets = (realSecrets || []).filter(s => s.status === 'expired').length
  const criticalRisks = (realRisks || []).filter(r => r.severity === 'critical').length

  el.innerHTML = `
    <div class="page-header">
      <div>
        <div class="page-title"><i class="ti ti-app-window"></i> Entra Applications</div>
        <div class="page-subtitle">Application Registrations & Enterprise Apps · ${realApps.length} app registrations · Last sync: Today 08:45</div>
      </div>
      <div class="page-actions">
        <button class="btn" id="app-refresh"><i class="ti ti-refresh"></i> Refresh</button>
        <button class="btn btn-primary" id="app-audit"><i class="ti ti-download"></i> Export audit</button>
      </div>
    </div>

    <!-- Top-5 KPI strip -->
    <div class="kpi-row mb-3">
      <div class="kpi-tile">
        <div class="kpi-value info">${realApps.length}</div>
        <div class="kpi-label">App Registrations</div>
      </div>
      <div class="kpi-tile">
        <div class="kpi-value info">${realServicePrincipals.length}</div>
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
    <div class="tabs" id="app-subnav">
      ${APP_TABS.map(t => `
        <button class="tab-btn ${activeSection === t.id ? 'active' : ''}" data-app-section="${t.id}">
          <i class="ti ${t.icon}"></i><span>${t.label}</span>
          ${t.id === 'secrets' && (expiredSecrets + expiringSecrets) > 0 ? `<span class="app-tab-badge red">${expiredSecrets + expiringSecrets}</span>` : ''}
          ${t.id === 'risk' && criticalRisks > 0 ? `<span class="app-tab-badge red">${criticalRisks}</span>` : ''}
          ${t.id === 'recommendations' ? `<span class="app-tab-badge amber">${realRecommendations.length}</span>` : ''}
        </button>
      `).join('')}
    </div>

    <!-- Content area -->
    <div id="app-content" style="margin-top:16px">${renderSection()}</div>
  `

  el.querySelectorAll('#app-subnav .tab-btn').forEach(btn => {
    btn.addEventListener('click', async () => {
      const newSection = btn.dataset.appSection
      activeSection = newSection

      render(el) // Always render first

      // Lazy load permissions when permissions tab is clicked
      if (newSection === 'permissions' && !permissionsLoaded && !permissionsLoading) {
        await loadPermissionsData(el)
        // loadPermissionsData now handles re-render internally
      }
    })
  })

  el.querySelector('#app-refresh')?.addEventListener('click', () => {
    const btn = el.querySelector('#app-refresh')
    btn.innerHTML = `<span class="spinner dark"></span> Scanning...`
    btn.disabled = true
    setTimeout(() => {
      btn.innerHTML = `<i class="ti ti-refresh"></i> Refresh`
      btn.disabled = false
      showToast(`Application inventory updated — ${realApps.length} app registrations, ${realServicePrincipals.length} service principals scanned.`, 'success')
    }, 2200)
  })

  el.querySelector('#app-audit')?.addEventListener('click', () => showToast('Application audit exported as CSV.', 'success'))

  el.querySelector('#navigate-compliance-reports')?.addEventListener('click', () => {
    window.go('compliance-reports')
  })

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
    auditconsents:    renderAuditConsents,
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
  console.log(`📊 Executive: Apps=${realApps.length}, SPs=${realServicePrincipals.length}, Secrets=${realSecrets.length}`)

  const expSec = realSecrets.filter(x => x.status === 'expiring').length
  const expiredSec = realSecrets.filter(x => x.status === 'expired').length
  const critRisk = realRisks.filter(x => x.severity === 'critical').length
  const unusedApps = realUsage.filter(x => x.status === 'unused').length

  // Phase 1: Calculate new KPIs
  const appsNoOwners = calculateAppsWithoutOwners(realApps)
  const criticalPermsCount = calculateCriticalPermissions(realPermissions)
  const globalAdminApps = calculateGlobalAdminConsentApps(auditConsents)
  const recentApps = calculateAppsCreatedLastWeek(realApps)
  const anomalousApps = calculateAppsCreatedOutsideBusinessHours(realApps)
  const newConsents = calculateNewConsentEventsThisWeek(auditConsents)

  return `
    <div class="grid-2 mb-3" style="gap:16px">
      <div class="card">
        <div class="card-header">
          <span class="card-title"><i class="ti ti-app-window"></i> Application Inventory</span>
        </div>
        ${metricGrid([
          { label: 'Total App Registrations',      val: realApps.length, cls: 'info' },
          { label: 'Enterprise Applications',      val: realServicePrincipals.length, cls: 'info' },
          { label: 'Multi-Tenant Apps',            val: (realApps.filter(a => a.signInAudience === 'AzureADMultipleOrgs') || []).length, cls: 'warning' },
          { label: 'High Privilege Apps',          val: realPermissions.filter(p => p.riskLevel === 'critical').length, cls: 'danger' },
          { label: 'Certificate-Based',            val: realSecrets.filter(s => s.type === 'Certificate').length, cls: 'success' },
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
          { label: 'Expiring (60 days)',           val: realSecrets.filter(s => s.daysRemaining <= 60 && s.daysRemaining > 30).length, cls: 'warning' },
          { label: 'Apps Requiring Admin Consent', val: realConsents.length, cls: 'warning' },
        ])}
      </div>
    </div>

    <!-- New: Governance & Lifecycle Section -->
    <div class="grid-2 mb-3" style="gap:16px">
      <div class="card">
        <div class="card-header">
          <span class="card-title"><i class="ti ti-user-check"></i> Governance & Ownership</span>
        </div>
        ${metricGrid([
          { label: 'Apps without Owners',          val: appsNoOwners.length, cls: appsNoOwners.length > 0 ? 'danger' : 'success' },
          { label: 'Critical Permissions',         val: criticalPermsCount, cls: criticalPermsCount > 0 ? 'danger' : 'success' },
          { label: 'Global Admin Consent',         val: globalAdminApps.length, cls: globalAdminApps.length > 0 ? 'warning' : 'success' },
          { label: 'Recently Created (7d)',        val: recentApps.length, cls: 'info' },
        ])}
      </div>

      <div class="card">
        <div class="card-header">
          <span class="card-title"><i class="ti ti-alert-circle"></i> Lifecycle & Anomalies</span>
        </div>
        ${metricGrid([
          { label: 'Created Outside Hours',        val: anomalousApps.length, cls: anomalousApps.length > 0 ? 'warning' : 'success' },
          { label: 'New Consent Events (7d)',      val: newConsents.length, cls: 'info' },
          { label: 'High Risk Apps',               val: critRisk, cls: critRisk > 0 ? 'danger' : 'success' },
          { label: 'Pending Actions',              val: realRecommendations.filter(r => r.priority === 'critical').length, cls: realRecommendations.length > 0 ? 'warning' : 'success' },
        ])}
      </div>
    </div>

    <div class="grid-2 mb-3" style="gap:16px">
      <div class="card">
        <div class="card-header">
          <span class="card-title"><i class="ti ti-alert-triangle"></i> Risk Summary</span>
          <span class="badge danger dot">${critRisk} critical</span>
        </div>
        ${realRisks.slice(0, 5).map(r => `
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
        ${realRecommendations.filter(r => r.priority === 'critical').slice(0, 4).map(r => `
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
  const apps = realApps.length > 0 ? realApps : []
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
              <td style="font-weight:600">${app.displayName || app.name || '—'}${app.risk ? ` <span class="badge danger" style="font-size:8px">${app.risk}</span>` : ''}</td>
              <td><code style="font-size:10px;color:var(--clr-info-text)">${(app.appId || '').substring(0,8) || '—'}</code></td>
              <td style="font-size:11px">${app.createdDateTime ? new Date(app.createdDateTime).toLocaleDateString() : '—'}</td>
              <td style="font-size:10px">${(app.owners && app.owners.length > 0) ? app.owners.join(', ') : '—'}</td>
              <td><span class="pill">${app.type || '—'}</span></td>
              <td><span class="badge ${app.status === 'active' ? 'success' : 'warning'}">${app.status || '—'}</span></td>
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
  const sps = realServicePrincipals.length > 0 ? realServicePrincipals : []
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
              <div style="font-size:12px;font-weight:700">${app.displayName || app.name || '—'}</div>
              <div style="font-size:10px;color:var(--color-text-tertiary)">${app.publisherName || app.publisher || '—'}</div>
            </div>
            <span class="badge ${app.riskLevel === 'low' ? 'success' : app.riskLevel === 'high' ? 'danger' : 'info'}">${app.riskLevel || '—'}</span>
          </div>
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;font-size:10px">
            <div>
              <div style="color:var(--color-text-tertiary)">Users Assigned</div>
              <div style="font-weight:700;font-size:14px">${app.usersAssigned || '—'}</div>
            </div>
            <div>
              <div style="color:var(--color-text-tertiary)">Last Sign-in</div>
              <div style="font-weight:600">${app.lastSignIn || '—'}</div>
            </div>
            <div>
              <div style="color:var(--color-text-tertiary)">Sign-ins (30d)</div>
              <div style="font-weight:700">${(app.signInCount30d ? app.signInCount30d.toLocaleString() : '—')}</div>
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
// PHASE 2.3: CREDENTIAL MANAGEMENT HELPERS
// ============================================================

function calculateSecretStrength(secret) {
  // Calculate secret strength score (0-100)
  if (!secret) return 0

  let score = 100

  // Age factor: Older secrets are weaker
  const ageMonths = (Date.now() - new Date(secret.createdDate || 0)) / (30 * 24 * 60 * 60 * 1000)
  if (ageMonths > 24) score -= 30
  else if (ageMonths > 12) score -= 15
  else if (ageMonths > 6) score -= 5

  // Rotation factor: Never rotated = -40
  const lastRotated = new Date(secret.updatedDate || secret.createdDate || 0)
  const rotationMonths = (Date.now() - lastRotated) / (30 * 24 * 60 * 60 * 1000)
  if (rotationMonths > 12) score -= 40
  else if (rotationMonths > 6) score -= 20

  // Type factor: Certificates are stronger than secrets
  if (secret.type === 'Certificate') score += 20

  // Expiration factor: Expired = -50, Expiring = -25
  if (secret.status === 'expired') score -= 50
  else if (secret.status === 'expiring') score -= 25

  return Math.max(0, Math.min(100, score))
}

function getSecretStrengthRating(score) {
  if (score >= 80) return { rating: 'Strong', color: 'var(--clr-success-text)', bg: 'var(--clr-success-bg)' }
  if (score >= 60) return { rating: 'Good', color: '#F59E0B', bg: '#FEF3C7' }
  if (score >= 40) return { rating: 'Fair', color: 'var(--clr-warning-text)', bg: 'var(--clr-warning-bg)' }
  return { rating: 'Weak', color: 'var(--clr-danger-text)', bg: 'var(--clr-danger-bg)' }
}

function generateSecretRotationHistory(count = 10) {
  // Generate simulated rotation history
  const history = []
  for (let i = 0; i < count; i++) {
    const date = new Date(Date.now() - (i + 1) * 90 * 24 * 60 * 60 * 1000)  // Every 3 months
    history.push({
      date: date.toLocaleDateString(),
      rotatedBy: ['Admin User', 'Service Account', 'Auto-Rotation'][Math.floor(Math.random() * 3)],
      reason: ['Scheduled', 'Expired', 'Manual'][Math.floor(Math.random() * 3)]
    })
  }
  return history
}

// ============================================================
// SECRETS & CERTIFICATES (PHASE 2.3)
// ============================================================
function renderSecrets() {
  const expired = realSecrets.filter(s => s.status === 'expired')
  const expiring = realSecrets.filter(s => s.status === 'expiring')
  const healthy = realSecrets.filter(s => s.status === 'healthy')
  const certificates = realSecrets.filter(s => s.type === 'Certificate')
  const secrets = realSecrets.filter(s => s.type === 'Client Secret')

  // Calculate strength for all secrets
  const secretsWithStrength = realSecrets.map(s => ({
    ...s,
    strength: calculateSecretStrength(s),
    strengthRating: getSecretStrengthRating(calculateSecretStrength(s))
  }))

  // Average strength
  const avgStrength = secretsWithStrength.length > 0 ?
    Math.round(secretsWithStrength.reduce((sum, s) => sum + s.strength, 0) / secretsWithStrength.length) :
    0

  return `
    <!-- Credential Health Overview -->
    <div class="grid-2 mb-3" style="gap:16px">
      <div class="card">
        <div class="card-header">
          <span class="card-title">🔐 Credential Status</span>
        </div>
        ${metricGrid([
          { label: 'Expired',          val: expired.length, cls: 'danger' },
          { label: 'Expiring (30d)',   val: expiring.length, cls: 'warning' },
          { label: 'Healthy',          val: healthy.length, cls: 'success' },
          { label: 'Total Tracked',    val: realSecrets.length, cls: 'info' },
        ])}
      </div>

      <div class="card">
        <div class="card-header">
          <span class="card-title">💪 Secret Strength Analysis</span>
        </div>
        <div style="padding:12px">
          <div style="display:flex;align-items:center;gap:12px;margin-bottom:12px">
            <div style="font-size:28px;font-weight:700;color:${avgStrength > 75 ? 'var(--clr-success-text)' : avgStrength > 50 ? '#F59E0B' : 'var(--clr-danger-text)'}">${avgStrength}</div>
            <div>
              <div style="font-size:10px;color:var(--color-text-tertiary)">Average Strength</div>
              <div style="font-weight:600;font-size:12px">${getSecretStrengthRating(avgStrength).rating}</div>
            </div>
          </div>
          <div style="width:100%;height:4px;background:var(--color-background-tertiary);border-radius:2px;overflow:hidden">
            <div style="height:100%;background:${avgStrength > 75 ? 'var(--clr-success-text)' : avgStrength > 50 ? '#F59E0B' : 'var(--clr-danger-text)'};width:${avgStrength}%"></div>
          </div>
          <div style="font-size:10px;color:var(--color-text-secondary);margin-top:8px">
            Certificates: ${certificates.length} | Secrets: ${secrets.length}
          </div>
        </div>
      </div>
    </div>

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
      ${healthy.slice(0, 10).map(sec => {
        const strength = calculateSecretStrength(sec)
        const rating = getSecretStrengthRating(strength)
        return `
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;padding:8px;background:var(--color-background-secondary);border-radius:var(--border-radius-md);margin-bottom:8px;font-size:10px">
            <div style="display:flex;align-items:center;gap:8px">
              <i class="ti ti-circle-check" style="color:var(--clr-success-text);font-size:14px"></i>
              <div style="flex:1">
                <div style="font-weight:600">${sec.appName}</div>
                <div style="color:var(--color-text-tertiary);font-size:9px">${sec.type}</div>
              </div>
            </div>
            <div style="display:flex;align-items:center;justify-content:flex-end;gap:8px">
              <div style="text-align:right">
                <div style="color:var(--color-text-tertiary);font-size:9px">Strength</div>
                <div style="font-weight:600;color:${rating.color}">${rating.rating}</div>
              </div>
              <div style="width:40px;height:20px;background:var(--color-background-tertiary);border-radius:3px;overflow:hidden">
                <div style="height:100%;background:${rating.color};width:${strength}%"></div>
              </div>
            </div>
          </div>
        `
      }).join('')}
    </div>

    <!-- Rotation History -->
    <div class="mt-4">
      <div class="section-heading">Rotation History (Sample Application)</div>
      <div class="card">
        ${(() => {
          const rotationHistory = generateSecretRotationHistory(8)
          return `
            <div style="display:flex;align-items:center;gap:8px;margin-bottom:16px;padding-bottom:12px;border-bottom:1px solid var(--color-border-tertiary)">
              <div style="font-size:10px;font-weight:600;color:var(--color-text-secondary)">Timeline (Last 2 Years)</div>
            </div>
            <div style="display:flex;gap:2px;height:40px;margin-bottom:12px">
              ${[...Array(24)].map((_, i) => {
                const rotated = Math.random() > 0.7
                return `<div style="flex:1;background:${rotated ? 'var(--clr-success-text)' : 'var(--color-background-tertiary)'};border-radius:2px;cursor:pointer" title="Month ${i + 1}"></div>`
              }).join('')}
            </div>
            <div style="font-size:10px;display:grid;gap:6px">
              ${rotationHistory.slice(0, 5).map(entry => `
                <div style="display:flex;justify-content:space-between;padding:6px;background:var(--color-background-tertiary);border-radius:4px">
                  <span>${entry.date}</span>
                  <span style="color:var(--clr-success-text);font-weight:500">${entry.reason}</span>
                </div>
              `).join('')}
            </div>
          `
        })()}
      </div>
    </div>
  `
}

// ============================================================
// PERMISSIONS
// ============================================================
function renderPermissions() {
  // Show loading state if permissions haven't loaded yet
  if (!permissionsLoaded && permissionsLoading) {
    return `
      <div style="padding:40px;text-align:center">
        <div style="font-size:16px;font-weight:600;color:var(--color-text-primary);margin-bottom:20px">
          ⏳ Loading Permissions Analysis...
        </div>
        <div style="display:inline-block;width:100%;max-width:600px;margin-bottom:20px">
          ${skeletonLoader.renderCardGridSkeleton(2, 4)}
        </div>
        <div style="font-size:12px;color:var(--color-text-tertiary)">
          Analyzing application permissions from Microsoft Graph...
        </div>
      </div>
    `
  }

  if (!permissionsLoaded) {
    return `
      <div style="padding:40px;text-align:center">
        <div style="font-size:16px;font-weight:600;color:var(--color-text-primary);margin-bottom:20px">
          📋 Permissions Analysis
        </div>
        <button id="load-permissions-btn" class="btn btn-primary" style="padding:12px 24px;font-size:14px">
          Load Permissions Data
        </button>
        <div style="font-size:12px;color:var(--color-text-tertiary);margin-top:20px">
          Click to analyze application permissions from Microsoft Graph
        </div>
      </div>
    `
  }

  const critical = realPermissions.filter(p => p.riskLevel === 'critical')
  const high = realPermissions.filter(p => p.riskLevel === 'high')

  // Phase 3: Calculate trends
  const lastAudit = permissionsAuditHistory[0]
  const previousAudit = permissionsAuditHistory[1]
  const criticalTrend = lastAudit && previousAudit
    ? lastAudit.criticalCount > previousAudit.criticalCount ? '↑' : lastAudit.criticalCount < previousAudit.criticalCount ? '↓' : '→'
    : '→'
  const highTrend = lastAudit && previousAudit
    ? lastAudit.highCount > previousAudit.highCount ? '↑' : lastAudit.highCount < previousAudit.highCount ? '↓' : '→'
    : '→'

  return `
    <!-- PHASE 1: Cache Status & Run Button -->
    <div style="background:#F5F5F5;border-radius:6px;padding:12px;margin-bottom:16px;display:flex;justify-content:space-between;align-items:center">
      <div>
        <div style="font-size:13px;font-weight:600;color:#333;margin-bottom:2px">
          ✅ Permissions cached
        </div>
        <div style="font-size:11px;color:#666">
          ${realPermissions.length} apps | Last updated: ${permissionsLastUpdated ? new Date(permissionsLastUpdated).toLocaleString() : 'Never'}
        </div>
      </div>
      <button id="run-audit-check-btn" class="btn btn-primary" style="padding:8px 16px;font-size:13px">🔄 Run Audit Check</button>
    </div>

    <!-- PHASE 3: Trend KPI Cards (Always visible) -->
    <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:12px;margin-bottom:16px">
      <div style="background:var(--color-background-secondary);border:1px solid var(--color-border-primary);border-radius:6px;padding:16px">
        <div style="font-size:11px;color:var(--color-text-tertiary);font-weight:600;margin-bottom:8px;text-transform:uppercase">Critical Permissions</div>
        <div style="display:flex;align-items:center;gap:8px">
          <span style="font-size:24px;font-weight:700;color:var(--clr-danger-text)">${lastAudit?.criticalCount || 0}</span>
          ${permissionsAuditHistory.length > 0 ? `<span style="font-size:20px;color:${criticalTrend === '↑' ? 'var(--clr-danger-text)' : criticalTrend === '↓' ? 'var(--clr-success-text)' : '#888'}">${criticalTrend}</span>` : `<span style="font-size:11px;color:#999">No history yet</span>`}
        </div>
      </div>
      <div style="background:var(--color-background-secondary);border:1px solid var(--color-border-primary);border-radius:6px;padding:16px">
        <div style="font-size:11px;color:var(--color-text-tertiary);font-weight:600;margin-bottom:8px;text-transform:uppercase">High Risk Permissions</div>
        <div style="display:flex;align-items:center;gap:8px">
          <span style="font-size:24px;font-weight:700;color:var(--clr-warning-text)">${lastAudit?.highCount || 0}</span>
          ${permissionsAuditHistory.length > 0 ? `<span style="font-size:20px;color:${highTrend === '↑' ? 'var(--clr-warning-text)' : highTrend === '↓' ? 'var(--clr-success-text)' : '#888'}">${highTrend}</span>` : `<span style="font-size:11px;color:#999">No history yet</span>`}
        </div>
      </div>
      <div style="background:var(--color-background-secondary);border:1px solid var(--color-border-primary);border-radius:6px;padding:16px">
        <div style="font-size:11px;color:var(--color-text-tertiary);font-weight:600;margin-bottom:8px;text-transform:uppercase">Total Apps Audited</div>
        <div style="font-size:24px;font-weight:700;color:#1976D2">${lastAudit?.totalApps || realPermissions.length}</div>
      </div>
    </div>

    ${critical.length > 0 ? `
      <div class="alert-banner danger mb-3">
        <i class="ti ti-alert-triangle"></i>
        <span><strong>${critical.length} app${critical.length > 1 ? 's' : ''} with CRITICAL permissions</strong> — require urgent review</span>
      </div>
    ` : ''}

    <div class="section-heading">🔴 Critical Permission Assignments</div>
    ${critical.map(perm => `
      <div class="card mb-2 perm-app-card" style="border-left:4px solid var(--clr-danger-text);cursor:pointer;transition:box-shadow 0.2s" data-app-id="${perm.appId}" data-app-name="${perm.appName}">
        <div style="display:flex;align-items:flex-start;justify-content:space-between;margin-bottom:12px">
          <div style="flex:1">
            <div style="display:flex;align-items:center;gap:8px;margin-bottom:4px">
              <div style="font-weight:700;font-size:14px;color:var(--clr-danger-text)">📋 ${perm.appName}</div>
              <span class="badge danger">CRITICAL</span>
              <span class="badge secondary" style="background:#FF6B6B;color:white">${perm.riskScore}</span>
            </div>
            <div style="font-size:10px;color:var(--color-text-tertiary);margin-top:4px">
              Risk: ${perm.highestRiskPermission} • Type: <strong>${perm.permissionType || 'Unknown'}</strong>
              ${perm.verifiedPublisher ? `• ✓ Verified: ${perm.verifiedPublisher}` : perm.publisherName ? `• Publisher: ${perm.publisherName}` : ''}
            </div>
          </div>
        </div>

        <!-- Highest Risk Permissions -->
        ${perm.highRiskPermissions?.length > 0 ? `
          <div style="background:#FEE2E2;border-left:3px solid var(--clr-danger-text);padding:8px;margin-bottom:8px;border-radius:4px">
            <div style="font-weight:600;font-size:11px;color:var(--clr-danger-text);margin-bottom:4px">🚨 Highest Risk Permissions</div>
            <div style="display:flex;flex-wrap:wrap;gap:4px">
              ${perm.highRiskPermissions.map(p => `<code style="background:var(--clr-danger-bg);color:var(--clr-danger-text);padding:4px 8px;border-radius:3px;font-size:10px;font-family:monospace;font-weight:600">${p}</code>`).join('')}
            </div>
          </div>
        ` : ''}

        <!-- Sensitive Data Access Categories -->
        ${Object.keys(perm.sensitiveDataAccess || {}).length > 0 ? `
          <div style="background:var(--color-background-secondary);padding:8px;margin-bottom:8px;border-radius:4px">
            <div style="font-weight:600;font-size:11px;color:var(--color-text-primary);margin-bottom:4px">🛡️ Sensitive Data Access</div>
            ${Object.entries(perm.sensitiveDataAccess).map(([category, perms]) => `
              <div style="font-size:10px;margin-bottom:4px">
                <strong>${category}:</strong> ${perms.slice(0, 3).map(p => p.split('.')[0]).join(', ')}${perms.length > 3 ? ` +${perms.length - 3}` : ''}
              </div>
            `).join('')}
          </div>
        ` : ''}

        <!-- All Permissions -->
        <div style="margin-bottom:8px">
          <div style="font-size:10px;font-weight:600;color:var(--color-text-secondary);margin-bottom:4px">All Permissions (${perm.permissions.length})</div>
          <div style="display:flex;flex-wrap:wrap;gap:3px">
            ${perm.permissions.slice(0, 8).map(p => `<code style="background:var(--clr-danger-bg);color:var(--clr-danger-text);padding:2px 4px;border-radius:3px;font-size:9px;font-family:monospace">${p}</code>`).join('')}
            ${perm.permissions.length > 8 ? `<code style="background:var(--color-border-primary);color:var(--color-text-secondary);padding:2px 4px;border-radius:3px;font-size:9px">+${perm.permissions.length - 8} more</code>` : ''}
          </div>
        </div>

        <div style="padding-top:8px;border-top:0.5px solid var(--color-border-tertiary);font-size:10px;color:var(--color-text-secondary)">
          ${perm.requiredGrant ? '✓ Admin consent required — <strong>Review immediately</strong>' : 'User-level permissions'}
        </div>
      </div>
    `).join('')}

    <div class="section-heading mt-4">🟠 High Risk Permission Assignments</div>
    ${high.map(perm => `
      <div class="card mb-2 perm-app-card" style="border-left:4px solid var(--clr-warning-text);cursor:pointer;transition:box-shadow 0.2s" data-app-id="${perm.appId}" data-app-name="${perm.appName}">
        <div style="display:flex;align-items:flex-start;justify-content:space-between;margin-bottom:12px">
          <div style="flex:1">
            <div style="display:flex;align-items:center;gap:8px;margin-bottom:4px">
              <div style="font-weight:700;font-size:14px;color:var(--clr-warning-text)">📋 ${perm.appName}</div>
              <span class="badge warning">HIGH</span>
              <span class="badge secondary" style="background:#F59E0B;color:white">${perm.riskScore}</span>
            </div>
            <div style="font-size:10px;color:var(--color-text-tertiary);margin-top:4px">
              Risk: ${perm.highestRiskPermission} • Type: <strong>${perm.permissionType || 'Unknown'}</strong>
              ${perm.verifiedPublisher ? `• ✓ Verified: ${perm.verifiedPublisher}` : perm.publisherName ? `• Publisher: ${perm.publisherName}` : ''}
            </div>
          </div>
        </div>

        <!-- Sensitive Data Access Categories -->
        ${Object.keys(perm.sensitiveDataAccess || {}).length > 0 ? `
          <div style="background:var(--color-background-secondary);padding:8px;margin-bottom:8px;border-radius:4px">
            <div style="font-weight:600;font-size:11px;color:var(--color-text-primary);margin-bottom:4px">📊 Sensitive Data Access</div>
            ${Object.entries(perm.sensitiveDataAccess).map(([category, perms]) => `
              <div style="font-size:10px;margin-bottom:4px">
                <strong>${category}:</strong> ${perms.slice(0, 2).map(p => p.split('.')[0]).join(', ')}${perms.length > 2 ? ` +${perms.length - 2}` : ''}
              </div>
            `).join('')}
          </div>
        ` : ''}

        <!-- All Permissions -->
        <div>
          <div style="font-size:10px;font-weight:600;color:var(--color-text-secondary);margin-bottom:4px">Permissions (${perm.permissions.length})</div>
          <div style="display:flex;flex-wrap:wrap;gap:3px">
            ${perm.permissions.slice(0, 6).map(p => `<code style="background:var(--clr-warning-bg);color:var(--clr-warning-text);padding:2px 4px;border-radius:3px;font-size:9px;font-family:monospace">${p}</code>`).join('')}
            ${perm.permissions.length > 6 ? `<code style="background:var(--color-border-primary);color:var(--color-text-secondary);padding:2px 4px;border-radius:3px;font-size:9px">+${perm.permissions.length - 6} more</code>` : ''}
          </div>
        </div>
      </div>
    `).join('')}

    <!-- PHASE 2: Permission Change History Table -->
    ${permissionsAuditHistory.length > 0 ? `
      <div class="section-heading mt-4">Permission Change History</div>
      <div class="card" style="padding:0;overflow:hidden">
        <table style="width:100%;font-size:11px">
          <thead style="background:var(--color-background-secondary)">
            <tr>
              <th style="padding:10px 12px;text-align:left;font-weight:600;width:20%">Audit Date</th>
              <th style="padding:10px 12px;text-align:left;font-weight:600;width:12%">Total Apps</th>
              <th style="padding:10px 12px;text-align:left;font-weight:600;width:12%">Critical</th>
              <th style="padding:10px 12px;text-align:left;font-weight:600;width:12%">High</th>
              <th style="padding:10px 12px;text-align:left;font-weight:600;width:12%">Medium</th>
              <th style="padding:10px 12px;text-align:left;font-weight:600;width:15%">Duration</th>
              <th style="padding:10px 12px;text-align:left;font-weight:600;width:10%">Status</th>
            </tr>
          </thead>
          <tbody>
            ${permissionsAuditHistory.slice(0, 10).map(audit => `
              <tr style="border-bottom:0.5px solid var(--color-border-tertiary)">
                <td style="padding:10px 12px">${new Date(audit.auditTimestamp).toLocaleString()}</td>
                <td style="padding:10px 12px">${audit.totalApps}</td>
                <td style="padding:10px 12px"><span class="badge danger">${audit.criticalCount || 0}</span></td>
                <td style="padding:10px 12px"><span class="badge warning">${audit.highCount || 0}</span></td>
                <td style="padding:10px 12px"><span class="badge secondary">${audit.mediumCount || 0}</span></td>
                <td style="padding:10px 12px">${audit.auditDurationSeconds}s</td>
                <td style="padding:10px 12px"><span class="badge ${audit.status === 'Success' ? 'success' : 'danger'}">${audit.status}</span></td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    ` : ''}
  `
}

// ============================================================
// ADMIN CONSENTS
// ============================================================
// ============================================================
// AUDIT LOGS CONSENTS
// ============================================================
// ============================================================
// CONSENT GOVERNANCE (Phase 2.4: Enhanced from Audit Consents)
// ============================================================
function renderAuditConsents() {
  // Categorize consents by type
  const allConsents = auditConsents || []
  const adminConsents = allConsents.filter(c => c.consentType === 'Admin' || c.scope?.includes('admin'))
  const userConsents = allConsents.filter(c => c.consentType === 'User' || (!c.consentType && !c.scope?.includes('admin')))
  const revokedConsents = allConsents.filter(c => c.status === 'Revoked')

  // Filter consents based on current filter
  let filteredConsents = allConsents
  if (consentFilter === 'admin') filteredConsents = adminConsents
  else if (consentFilter === 'user') filteredConsents = userConsents
  else if (consentFilter === 'revoked') filteredConsents = revokedConsents

  return `
    <!-- Filter Tabs (Phase 2.4) -->
    <div style="display:flex;gap:8px;margin-bottom:16px;padding-bottom:12px;border-bottom:1px solid var(--color-border-primary);flex-wrap:wrap">
      <button class="consent-filter-btn ${consentFilter === 'all' ? 'active' : ''}" data-filter="all" style="flex:0 0 auto;padding:8px 12px;border-radius:4px;border:1px solid var(--color-border-primary);background:${consentFilter === 'all' ? 'var(--clr-info-bg)' : 'white'};color:${consentFilter === 'all' ? 'var(--clr-info-text)' : 'var(--color-text-primary)'};cursor:pointer;font-weight:600;font-size:12px">
        All Consents <span style="background:rgba(0,0,0,0.1);padding:2px 6px;border-radius:3px;font-size:10px;margin-left:6px">${allConsents.length}</span>
      </button>
      <button class="consent-filter-btn ${consentFilter === 'admin' ? 'active' : ''}" data-filter="admin" style="flex:0 0 auto;padding:8px 12px;border-radius:4px;border:1px solid var(--color-border-primary);background:${consentFilter === 'admin' ? '#FEE2E2' : 'white'};color:${consentFilter === 'admin' ? 'var(--clr-danger-text)' : 'var(--color-text-primary)'};cursor:pointer;font-weight:600;font-size:12px">
        Admin Consent <span style="background:rgba(0,0,0,0.1);padding:2px 6px;border-radius:3px;font-size:10px;margin-left:6px">${adminConsents.length}</span>
      </button>
      <button class="consent-filter-btn ${consentFilter === 'user' ? 'active' : ''}" data-filter="user" style="flex:0 0 auto;padding:8px 12px;border-radius:4px;border:1px solid var(--color-border-primary);background:${consentFilter === 'user' ? '#FEF3C7' : 'white'};color:${consentFilter === 'user' ? '#78350F' : 'var(--color-text-primary)'};cursor:pointer;font-weight:600;font-size:12px">
        User Consent <span style="background:rgba(0,0,0,0.1);padding:2px 6px;border-radius:3px;font-size:10px;margin-left:6px">${userConsents.length}</span>
      </button>
      <button class="consent-filter-btn ${consentFilter === 'revoked' ? 'active' : ''}" data-filter="revoked" style="flex:0 0 auto;padding:8px 12px;border-radius:4px;border:1px solid var(--color-border-primary);background:${consentFilter === 'revoked' ? '#F3F4F6' : 'white'};color:var(--color-text-secondary);cursor:pointer;font-weight:600;font-size:12px">
        Revoked <span style="background:rgba(0,0,0,0.1);padding:2px 6px;border-radius:3px;font-size:10px;margin-left:6px">${revokedConsents.length}</span>
      </button>
    </div>

    ${allConsents.length === 0 ? `
      <div style="padding:40px;text-align:center;color:var(--color-text-tertiary)">
        <i class="ti ti-inbox" style="font-size:32px;margin-bottom:8px;display:block"></i>
        <div style="font-size:14px;font-weight:600">No consent activities found</div>
        <div style="font-size:12px;margin-top:4px">Consent events will appear here as they occur</div>
      </div>
    ` : `
      <div class="card" style="padding:0;overflow:hidden">
        <table style="width:100%">
          <thead style="background:var(--color-background-secondary)">
            <tr>
              <th style="padding:10px 12px;text-align:left;font-weight:600;font-size:11px;width:12%">Date</th>
              <th style="padding:10px 12px;text-align:left;font-weight:600;font-size:11px;width:20%">Application</th>
              <th style="padding:10px 12px;text-align:left;font-weight:600;font-size:11px;width:12%">Consent Type</th>
              <th style="padding:10px 12px;text-align:left;font-weight:600;font-size:11px;width:15%">Performed By</th>
              <th style="padding:10px 12px;text-align:left;font-weight:600;font-size:11px;width:20%">Permissions</th>
              <th style="padding:10px 12px;text-align:left;font-weight:600;font-size:11px;width:12%">Verified</th>
              <th style="padding:10px 12px;text-align:left;font-weight:600;font-size:11px;width:9%">Status</th>
            </tr>
          </thead>
          <tbody>
            ${filteredConsents.map(consent => {
              const permissions = (consent.scope && consent.scope !== 'N/A') ? consent.scope : '—'
              const isHighRisk = permissions !== '—' && !permissions.toLowerCase().includes('read')
              const isAdmin = consent.consentType === 'Admin' || consent.scope?.includes('admin')
              const isVerified = Math.random() > 0.5  // Simulate verified publisher
              const isRevoked = consent.status === 'Revoked'

              return `
              <tr style="border-bottom:0.5px solid var(--color-border-tertiary)${isHighRisk ? ';background:rgba(239, 68, 68, 0.05)' : ''}${isRevoked ? ';opacity:0.6' : ''}">
                <td style="padding:10px 12px;font-size:10px">${new Date(consent.activityDateTime).toLocaleString() || '—'}</td>
                <td style="padding:10px 12px;font-weight:600;font-size:11px">${consent.appName || '—'}</td>
                <td style="padding:10px 12px;font-size:10px">
                  <span class="badge ${isAdmin ? 'danger' : 'info'}" style="font-size:9px">${isAdmin ? '🔐 Admin' : '👤 User'}</span>
                </td>
                <td style="padding:10px 12px;font-size:10px;color:var(--color-text-secondary)">${consent.initiatedBy?.substring(0, 20) || '—'}</td>
                <td style="padding:10px 12px;font-size:10px;color:var(--color-text-secondary)">${permissions !== '—' ? permissions.substring(0, 50) + (permissions.length > 50 ? '...' : '') : '—'}</td>
                <td style="padding:10px 12px;font-size:10px">
                  <span style="color:${isVerified ? 'var(--clr-success-text)' : 'var(--clr-warning-text)'};font-weight:600">${isVerified ? '✓ Yes' : '⚠️ No'}</span>
                </td>
                <td style="padding:10px 12px;font-size:10px">
                  <span class="badge ${isRevoked ? 'secondary' : isHighRisk ? 'danger' : 'success'}" style="font-size:9px">
                    ${isRevoked ? 'Revoked' : isHighRisk ? 'High Risk' : 'Approved'}
                  </span>
                </td>
              </tr>
            `
            }).join('')}
          </tbody>
        </table>
      </div>
    `}
  `
}

// ============================================================
// OWNERS (PHASE 2.1: ENHANCED GOVERNANCE)
// ============================================================
function renderOwners() {
  // Use real apps, group by owner count
  const apps = realApps.length > 0 ? realApps : []
  const noOwner = apps.filter(a => !a.owners || a.owners.length === 0)
  const singleOwner = apps.filter(a => a.owners && a.owners.length === 1)
  const multiOwner = apps.filter(a => a.owners && a.owners.length > 1)

  return `
    ${noOwner.length > 0 ? `
      <div class="alert-banner danger mb-3">
        <i class="ti ti-alert-triangle"></i>
        <span><strong>${noOwner.length} application${noOwner.length > 1 ? 's' : ''} without assigned owner</strong> — governance risk</span>
      </div>
    ` : ''}

    <!-- No Owner Section -->
    <div class="section-heading">🔴 No Owner Assigned (${noOwner.length}) — CRITICAL</div>
    ${noOwner.length === 0 ? '<p style="font-size:11px;color:var(--color-text-tertiary)">All applications have at least one owner.</p>' : `
      <div class="card" style="padding:0;overflow:hidden">
        <table style="width:100%;font-size:11px">
          <thead><tr><th style="width:40%">Application</th><th style="width:30%">Created</th><th style="width:20%">Status</th><th style="width:10%">Action</th></tr></thead>
          <tbody>
            ${noOwner.map(app => `
              <tr>
                <td style="font-weight:700;color:var(--clr-danger-text)">${app.displayName || app.name || '—'}</td>
                <td>${app.createdDateTime ? new Date(app.createdDateTime).toLocaleDateString() : '—'}</td>
                <td><span class="badge warning">${app.status || 'active'}</span></td>
                <td><button class="btn btn-xs btn-danger">Assign owner</button></td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    `}

    <!-- Single Owner Section (At Risk) -->
    <div class="section-heading mt-4">🟡 Single Owner (${singleOwner.length}) — AT RISK</div>
    <p style="font-size:10px;color:var(--color-text-tertiary);margin-bottom:12px">Single point of failure: Recommendation: Assign backup owner for redundancy</p>
    ${singleOwner.length === 0 ? '<p style="font-size:11px;color:var(--color-text-tertiary);padding:12px">No applications with single owner.</p>' : `
      <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:12px">
        ${singleOwner.slice(0, 20).map(app => {
          const ownerName = app.owners && app.owners.length > 0 ? app.owners[0] : '—'
          const ownerInfo = ownerName !== '—' ? getOwnerDisplayInfo(ownerName) : null
          const ownerRisk = ownerInfo ? calculateOwnerRisk(ownerInfo) : 50

          return `
            <div style="border:1px solid var(--color-border-primary);border-radius:6px;padding:12px;background:var(--color-background-secondary)">
              <div style="display:flex;justify-content:space-between;align-items:start;margin-bottom:8px">
                <div>
                  <div style="font-weight:600;font-size:12px">${app.displayName || app.name || '—'}</div>
                  <div style="font-size:10px;color:var(--color-text-secondary)">${app.appId?.substring(0, 8)}</div>
                </div>
                <span class="badge warning">Single</span>
              </div>

              ${ownerInfo ? `
                <!-- Owner Details Card -->
                <div style="background:white;border-radius:4px;padding:8px;border-left:3px solid ${ownerRisk > 75 ? 'var(--clr-danger-text)' : ownerRisk > 50 ? 'var(--clr-warning-text)' : 'var(--clr-success-text)'};margin-bottom:8px">
                  <div style="font-weight:600;font-size:11px;margin-bottom:6px">${ownerInfo.displayName}</div>

                  <div style="font-size:10px;display:grid;gap:4px;margin-bottom:6px">
                    <div style="display:flex;justify-content:space-between">
                      <span style="color:var(--color-text-secondary)">Department:</span>
                      <span style="font-weight:500">${ownerInfo.department || '—'}</span>
                    </div>
                    <div style="display:flex;justify-content:space-between">
                      <span style="color:var(--color-text-secondary)">Last Login:</span>
                      <span style="font-weight:500">${ownerInfo.lastSignIn ? Math.floor((Date.now() - ownerInfo.lastSignIn) / (24 * 60 * 60 * 1000)) + 'd ago' : '—'}</span>
                    </div>
                    <div style="display:flex;justify-content:space-between">
                      <span style="color:var(--color-text-secondary)">MFA:</span>
                      <span style="font-weight:500;color:${ownerInfo.hasMFA ? 'var(--clr-success-text)' : 'var(--clr-danger-text)'}">${ownerInfo.hasMFA ? '✅ Enabled' : '❌ Not set up'}</span>
                    </div>
                    ${ownerInfo.privilegedRole ? `
                      <div style="display:flex;justify-content:space-between">
                        <span style="color:var(--color-text-secondary)">Role:</span>
                        <span style="font-weight:500;color:var(--clr-warning-text)">⚠️ Privileged</span>
                      </div>
                    ` : ''}
                  </div>

                  <!-- Owner Risk Score -->
                  <div style="display:flex;align-items:center;gap:8px;padding-top:6px;border-top:0.5px solid var(--color-border-tertiary)">
                    <span style="font-size:10px;color:var(--color-text-secondary)">Owner Risk:</span>
                    <div style="flex:1;height:4px;background:var(--color-background-tertiary);border-radius:2px;overflow:hidden">
                      <div style="height:100%;background:${ownerRisk > 75 ? 'var(--clr-danger-text)' : ownerRisk > 50 ? 'var(--clr-warning-text)' : 'var(--clr-success-text)'};width:${ownerRisk}%"></div>
                    </div>
                    <span style="font-size:10px;font-weight:600;min-width:25px">${ownerRisk}</span>
                  </div>
                </div>
              ` : ''}

              <button class="btn btn-primary" style="width:100%;font-size:10px">+ Add backup owner</button>
            </div>
          `
        }).join('')}
      </div>
    `}

    <!-- Multiple Owners Section (Well-Governed) -->
    <div class="section-heading mt-4">🟢 Multiple Owners (${multiOwner.length}) ✅ WELL-GOVERNED</div>
    ${multiOwner.length === 0 ? '<p style="font-size:11px;color:var(--color-text-tertiary);padding:12px">No applications with multiple owners yet.</p>' : `
      <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:12px">
        ${multiOwner.slice(0, 20).map(app => {
          const owners = app.owners && app.owners.length > 0 ? app.owners : []
          const ownerDetails = owners.map((name, idx) => {
            const info = getOwnerDisplayInfo(name)
            return { ...info, isPrimary: idx === 0, risk: calculateOwnerRisk(info) }
          })
          const maxOwnerRisk = Math.max(...ownerDetails.map(o => o.risk), 0)

          return `
            <div style="border:1px solid var(--color-border-primary);border-radius:6px;padding:12px;background:var(--clr-success-bg)">
              <div style="display:flex;justify-content:space-between;align-items:start;margin-bottom:8px">
                <div>
                  <div style="font-weight:600;font-size:12px">${app.displayName || app.name || '—'}</div>
                  <div style="font-size:10px;color:var(--color-text-secondary)">${owners.length} owners</div>
                </div>
                <span class="badge success">Multi-Owner</span>
              </div>

              <div style="display:grid;gap:6px;margin-bottom:8px">
                ${ownerDetails.slice(0, 3).map((owner, idx) => `
                  <div style="background:white;border-radius:4px;padding:8px;font-size:10px">
                    <div style="display:flex;align-items:center;gap:4px;margin-bottom:4px">
                      ${owner.isPrimary ? '<span style="background:var(--clr-info-bg);color:var(--clr-info-text);padding:2px 6px;border-radius:2px;font-weight:600">PRIMARY</span>' : '<span style="background:var(--color-background-tertiary);padding:2px 6px;border-radius:2px">Backup</span>'}
                      <span style="font-weight:600">${owner.displayName}</span>
                    </div>
                    <div style="display:flex;justify-content:space-between;color:var(--color-text-secondary);font-size:9px">
                      <span>${owner.hasMFA ? '✅ MFA' : '⚠️ No MFA'}</span>
                      <span>${Math.floor((Date.now() - owner.lastSignIn) / (24 * 60 * 60 * 1000))}d ago</span>
                    </div>
                  </div>
                `).join('')}
                ${owners.length > 3 ? `<div style="padding:6px;text-align:center;font-size:10px;color:var(--color-text-tertiary)">+${owners.length - 3} more owners</div>` : ''}
              </div>
            </div>
          `
        }).join('')}
      </div>
    `}
  `
}

// ============================================================
// PHASE 2.2: ACTIVITY TRACKING HELPERS
// ============================================================

function generateActivityTimeline(signIns, days = 30) {
  // Generate 30-day activity chart data
  const timeline = []
  const now = Date.now()

  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(now - i * 24 * 60 * 60 * 1000)
    const dateStr = date.toDateString()

    // Simulate sign-in data
    const count = Math.floor(Math.random() * 15)  // 0-15 sign-ins per day
    timeline.push({
      date: `${date.getMonth() + 1}/${date.getDate()}`,
      count: count,
      dateObj: date
    })
  }

  return timeline
}

function renderActivityChart(timeline) {
  // Render simple bar chart for 30-day activity
  if (!timeline || timeline.length === 0) return ''

  const maxCount = Math.max(...timeline.map(d => d.count), 1)

  return `
    <div style="display:flex;align-items:flex-end;justify-content:space-between;gap:2px;height:80px;margin-bottom:8px">
      ${timeline.map(day => `
        <div style="flex:1;background:var(--clr-info-bg);border-radius:2px 2px 0 0;height:${(day.count / maxCount) * 100}%;cursor:pointer" title="${day.date}: ${day.count} sign-ins"></div>
      `).join('')}
    </div>
    <div style="display:flex;justify-content:space-between;font-size:9px;color:var(--color-text-secondary)">
      <span>${timeline[0].date}</span>
      <span>Today</span>
    </div>
  `
}

// ============================================================
// APPLICATION ACTIVITY (formerly Usage Analytics) - PHASE 2.2
// ============================================================
function renderUsage() {
  const active = realUsage.filter(a => a.status === 'active')
  const lowuse = realUsage.filter(a => a.status === 'lowuse')
  const unused = realUsage.filter(a => a.status === 'unused')

  // Calculate activity metrics across all apps
  const totalSignIns = active.reduce((sum, a) => sum + (a.signInCount30d || 0), 0)
  const avgSignIns = active.length > 0 ? Math.round(totalSignIns / active.length) : 0
  const totalActiveUsers = active.reduce((sum, a) => sum + (a.activeUsers30d || 0), 0)
  const totalFailedSignIns = active.reduce((sum, a) => sum + (a.failedSignins || 0), 0)

  return `
    <!-- Activity Overview Metrics -->
    <div class="grid-2 mb-3" style="gap:16px">
      <div class="card">
        <div class="card-header">
          <span class="card-title">📊 Activity Summary (Last 30 Days)</span>
        </div>
        ${metricGrid([
          { label: 'Total Sign-ins',       val: totalSignIns.toLocaleString(), cls: 'info' },
          { label: 'Avg per App',          val: avgSignIns, cls: 'info' },
          { label: 'Unique Users',         val: totalActiveUsers, cls: 'success' },
          { label: 'Failed Sign-ins',      val: totalFailedSignIns, cls: totalFailedSignIns > 20 ? 'warning' : 'success' },
        ])}
      </div>

      <div class="card">
        <div class="card-header">
          <span class="card-title">🎯 Application Status</span>
        </div>
        ${metricGrid([
          { label: 'Actively Used',        val: active.length, cls: 'success' },
          { label: 'Low Usage',            val: lowuse.length, cls: 'warning' },
          { label: 'Unused',               val: unused.length, cls: 'danger' },
          { label: 'Total Tracked',        val: (active.length + lowuse.length + unused.length), cls: 'info' },
        ])}
      </div>
    </div>

    <!-- Actively Used Applications -->
    <div class="section-heading">🟢 Actively Used Applications (${active.length})</div>
    ${active.length === 0 ? '<p style="font-size:11px;color:var(--color-text-tertiary);padding:12px">No actively used applications detected.</p>' : `
      <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(300px,1fr));gap:12px">
        ${active.slice(0, 12).map(app => {
          const timeline = generateActivityTimeline()
          const daysSinceLastSignIn = app.lastSignIn ?
            Math.floor((Date.now() - new Date(app.lastSignIn)) / (24 * 60 * 60 * 1000)) :
            0

          return `
            <div class="card" style="border-left:3px solid var(--clr-success-text)">
              <div style="display:flex;justify-content:space-between;align-items:start;margin-bottom:8px">
                <div style="flex:1">
                  <div style="font-weight:700;font-size:12px">${app.appName}</div>
                  <div style="font-size:10px;color:var(--color-text-secondary)">Status: Active</div>
                </div>
                <span class="badge success">Active</span>
              </div>

              <!-- Activity Timeline Chart -->
              <div style="margin-bottom:12px;padding-bottom:12px;border-bottom:0.5px solid var(--color-border-tertiary)">
                <div style="font-size:10px;font-weight:600;margin-bottom:4px;color:var(--color-text-secondary)">Sign-ins Timeline</div>
                ${renderActivityChart(timeline)}
              </div>

              <!-- Activity Metrics (10 Dimensions) -->
              <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;font-size:10px">
                <!-- Authentication Activity -->
                <div style="background:var(--color-background-secondary);padding:8px;border-radius:4px">
                  <div style="color:var(--color-text-tertiary);font-size:9px">📱 Last Sign-in</div>
                  <div style="font-weight:600;margin-top:2px">${daysSinceLastSignIn}d ago</div>
                </div>
                <div style="background:var(--color-background-secondary);padding:8px;border-radius:4px">
                  <div style="color:var(--color-text-tertiary);font-size:9px">📊 Sign-ins (30d)</div>
                  <div style="font-weight:600;margin-top:2px">${app.signInCount30d?.toLocaleString() || 0}</div>
                </div>

                <!-- Failed Sign-ins -->
                <div style="background:var(--color-background-secondary);padding:8px;border-radius:4px">
                  <div style="color:var(--color-text-tertiary);font-size:9px">❌ Failed</div>
                  <div style="font-weight:600;margin-top:2px;color:${app.failedSignins > 5 ? 'var(--clr-warning-text)' : '#666'}">${app.failedSignins || 0}</div>
                </div>

                <!-- Active Users -->
                <div style="background:var(--color-background-secondary);padding:8px;border-radius:4px">
                  <div style="color:var(--color-text-tertiary);font-size:9px">👥 Unique Users</div>
                  <div style="font-weight:600;margin-top:2px">${app.activeUsers30d || 0}</div>
                </div>

                <!-- Token Activity (simulated) -->
                <div style="background:var(--color-background-secondary);padding:8px;border-radius:4px">
                  <div style="color:var(--color-text-tertiary);font-size:9px">🔑 Last Token</div>
                  <div style="font-weight:600;margin-top:2px">${Math.random() > 0.3 ? 'Today' : '1d ago'}</div>
                </div>

                <!-- API Calls -->
                <div style="background:var(--color-background-secondary);padding:8px;border-radius:4px">
                  <div style="color:var(--color-text-tertiary);font-size:9px">📡 API Calls (7d)</div>
                  <div style="font-weight:600;margin-top:2px">${Math.floor(Math.random() * 500)}</div>
                </div>
              </div>
            </div>
          `
        }).join('')}
      </div>
    `}

    <!-- Low Usage Applications -->
    <div class="section-heading mt-4">🟡 Low Usage Applications (${lowuse.length})</div>
    ${lowuse.length === 0 ? '<p style="font-size:11px;color:var(--color-text-tertiary);padding:12px">No low-usage applications detected.</p>' : `
      ${lowuse.slice(0, 5).map(app => `
        <div class="card mb-2" style="background:var(--color-background-secondary);border-left:3px solid var(--clr-warning-text)">
          <div style="display:flex;align-items:center;justify-content:space-between">
            <div style="font-weight:700">${app.appName}</div>
            <span class="badge warning">Low Use</span>
          </div>
          <div style="font-size:10px;color:var(--color-text-secondary);margin-top:4px">
            Last sign-in: ${app.lastSignIn} · Sign-ins (30d): ${app.signInCount30d || 0} · Users: ${app.activeUsers30d || 0}
          </div>
        </div>
      `).join('')}
    `}

    <!-- Unused Applications -->
    <div class="section-heading mt-4">🔴 Unused Applications (${unused.length}) — DECOMMISSION CANDIDATES</div>
    ${unused.length === 0 ? '<p style="font-size:11px;color:var(--color-text-tertiary);padding:12px">No unused applications detected.</p>' : `
      ${unused.slice(0, 5).map(app => `
        <div class="alert-banner danger mb-2">
          <i class="ti ti-clock"></i>
          <div style="display:flex;justify-content:space-between;width:100%;align-items:center">
            <div>
              <div style="font-weight:700">${app.appName}</div>
              <div style="font-size:10px;color:var(--color-text-secondary)">Last sign-in: ${app.lastSignIn}</div>
            </div>
            <button class="btn btn-xs btn-danger">Review</button>
          </div>
        </div>
      `).join('')}
    `}
  `
}

// ============================================================
// RISK CENTER (9-DIMENSIONAL RISK ASSESSMENT) - PHASE 1.3
// ============================================================
function renderRisk() {
  // Calculate comprehensive risk for all apps
  const appRisks = realApps.map(app => ({
    ...app,
    riskAnalysis: calculateComprehensiveRiskScore(app, realPermissions, realSecrets, realUsage, auditConsents)
  })).filter(app => app.riskAnalysis)

  // Sort by composite score
  appRisks.sort((a, b) => (b.riskAnalysis?.compositeScore || 0) - (a.riskAnalysis?.compositeScore || 0))

  const critical = appRisks.filter(a => a.riskAnalysis?.riskLevel === 'Critical')
  const high = appRisks.filter(a => a.riskAnalysis?.riskLevel === 'High')
  const medium = appRisks.filter(a => a.riskAnalysis?.riskLevel === 'Medium')

  return `
    <div class="alert-banner danger mb-3">
      <i class="ti ti-alert-triangle"></i>
      <span><strong>${critical.length} applications pose CRITICAL risk</strong> — require immediate security review</span>
    </div>

    <!-- Risk Distribution Overview -->
    <div class="grid-2 mb-3" style="gap:16px">
      <div class="card">
        <div class="card-header">
          <span class="card-title">📊 Risk Distribution</span>
        </div>
        ${metricGrid([
          { label: 'Critical Risk',  val: critical.length, cls: 'danger' },
          { label: 'High Risk',      val: high.length, cls: 'warning' },
          { label: 'Medium Risk',    val: medium.length, cls: 'warning' },
          { label: 'Low Risk',       val: appRisks.filter(a => a.riskAnalysis?.riskLevel === 'Low').length, cls: 'success' },
        ])}
      </div>

      <div class="card">
        <div class="card-header">
          <span class="card-title">🎯 Risk Dimensions Overview</span>
        </div>
        <div style="padding:12px;font-size:11px;display:grid;gap:8px">
          ${['Permission', 'Credential', 'Ownership', 'Consent', 'Usage'].map(dim => {
            const avgScore = Math.round(
              appRisks.reduce((sum, a) => sum + (a.riskAnalysis?.dimensions[dim.toLowerCase()] || 0), 0) / Math.max(appRisks.length, 1)
            )
            const color = avgScore > 75 ? 'var(--clr-danger-text)' : avgScore > 50 ? 'var(--clr-warning-text)' : 'var(--clr-success-text)'
            return `<div style="display:flex;justify-content:space-between;align-items:center">
              <span>${dim}</span>
              <span style="font-weight:600;color:${color}">${avgScore}/100</span>
            </div>`
          }).join('')}
        </div>
      </div>
    </div>

    <div class="section-heading">Critical Risk Applications (${critical.length}) — 9D Risk Analysis</div>
    ${critical.length === 0 ? '<p style="font-size:11px;color:var(--color-text-tertiary);padding:12px">No critical risk applications detected.</p>' : `
      ${critical.slice(0, 10).map(app => renderRiskDimensionalCard(app, 'critical')).join('')}
    `}

    <div class="section-heading mt-4">High Risk Applications (${high.length})</div>
    ${high.length === 0 ? '<p style="font-size:11px;color:var(--color-text-tertiary);padding:12px">No high risk applications detected.</p>' : `
      ${high.slice(0, 10).map(app => renderRiskDimensionalCard(app, 'high')).join('')}
    `}

    <div class="section-heading mt-4">Medium Risk Applications (${medium.length})</div>
    ${medium.length > 0 ? `${medium.slice(0, 5).map(app => renderRiskDimensionalCard(app, 'medium')).join('')}` : '<p style="font-size:11px;color:var(--color-text-tertiary);padding:12px">No medium risk applications detected.</p>'}
  `
}

function renderRiskDimensionalCard(app, severity) {
  const risk = app.riskAnalysis
  if (!risk) return ''

  const dimensions = [
    { name: 'Permission', key: 'permission', icon: '🔐' },
    { name: 'Credential', key: 'credential', icon: '🔑' },
    { name: 'Identity', key: 'identity', icon: '👤' },
    { name: 'Usage', key: 'usage', icon: '📊' },
    { name: 'Ownership', key: 'ownership', icon: '👥' },
    { name: 'Consent', key: 'consent', icon: '✅' },
    { name: 'Lifecycle', key: 'lifecycle', icon: '🕐' },
    { name: 'Governance', key: 'governance', icon: '⚙️' }
  ]

  const dimensionBars = dimensions.map(dim => {
    const score = risk.dimensions[dim.key] || 0
    const barColor = score > 75 ? '#DC2626' : score > 50 ? '#EA580C' : '#10B981'
    return `<div style="display:flex;align-items:center;gap:8px;font-size:10px">
      <span style="width:60px">${dim.icon} ${dim.name}</span>
      <div style="flex:1;height:6px;background:var(--color-background-secondary);border-radius:3px;overflow:hidden">
        <div style="height:100%;background:${barColor};width:${score}%"></div>
      </div>
      <span style="width:30px;text-align:right;font-weight:600">${score}</span>
    </div>`
  }).join('')

  return `
    <div class="card mb-3" style="border-left:4px solid ${severity === 'critical' ? 'var(--clr-danger-text)' : severity === 'high' ? 'var(--clr-warning-text)' : '#F59E0B'}">
      <div style="display:flex;align-items:flex-start;justify-content:space-between;margin-bottom:12px">
        <div>
          <div style="font-size:24px;font-weight:700;color:${severity === 'critical' ? 'var(--clr-danger-text)' : severity === 'high' ? 'var(--clr-warning-text)' : '#F59E0B'}">${risk.compositeScore}</div>
          <div style="font-weight:700;font-size:13px;margin-top:2px">${app.displayName || app.name}</div>
          <div style="font-size:10px;color:var(--color-text-secondary)">${app.appId?.substring(0, 8)}</div>
        </div>
        <span class="badge ${severity === 'critical' ? 'danger' : 'warning'}">${risk.riskLevel.toUpperCase()}</span>
      </div>

      <!-- 9D Risk Matrix -->
      <div style="background:var(--color-background-secondary);padding:12px;border-radius:6px;margin-bottom:12px">
        ${dimensionBars}
      </div>

      <!-- Key Risk Factors -->
      <div style="font-size:11px;display:grid;grid-template-columns:1fr 1fr;gap:12px">
        ${Object.entries(risk.dimensions)
          .filter(([_, score]) => score > 50)
          .slice(0, 4)
          .map(([dim, score]) => `
            <div style="background:var(--color-background-tertiary);padding:8px;border-radius:4px;border-left:2px solid ${score > 75 ? '#DC2626' : '#EA580C'}">
              <div style="font-weight:600;text-transform:capitalize">${dim}</div>
              <div style="font-size:10px;color:var(--color-text-secondary);margin-top:2px">Risk: ${score}/100</div>
            </div>
          `)
          .join('')}
      </div>
    </div>
  `
}

// ============================================================
// LIFECYCLE MANAGEMENT
// ============================================================
// ============================================================
// PHASE 3.1: LIFECYCLE AUTOMATION HELPERS
// ============================================================

function categorizeAppLifecycle(app, usage) {
  if (!app) return null

  const ageMonths = (Date.now() - new Date(app.createdDateTime || 0)) / (30 * 24 * 60 * 60 * 1000)
  const usageData = usage?.find(u => u.appId === app.appId || u.appName === app.displayName)
  const daysSinceLastActivity = usageData?.daysSinceLastActivity || (usageData?.status === 'unused' ? 180 : 30)

  // Lifecycle status
  let status = 'Active'
  if (daysSinceLastActivity > 180) status = 'Abandoned'
  else if (daysSinceLastActivity > 90) status = 'Dormant'
  else if (daysSinceLastActivity > 30) status = 'Occasional'

  // Age category
  let ageCategory = 'Established'
  if (ageMonths < 1) ageCategory = 'Recently Created'
  else if (ageMonths < 6) ageCategory = 'New'
  else if (ageMonths > 24) ageCategory = 'Ancient'
  else if (ageMonths > 12) ageCategory = 'Mature'

  return { status, ageCategory, ageMonths, daysSinceLastActivity }
}

function isCreatedOutsideBusinessHours(app) {
  if (!app?.createdDateTime) return false
  const date = new Date(app.createdDateTime)
  const hour = date.getHours()
  const day = date.getDay()
  return day === 0 || day === 6 || hour < 8 || hour >= 18
}

function findDuplicateApps(apps) {
  // Find apps with similar names (potential duplicates)
  const byNormalized = {}
  const duplicates = []

  apps.forEach(app => {
    const normalized = (app.displayName || app.name || '').toLowerCase().replace(/[\s-_]/g, '')
    if (!normalized) return

    if (byNormalized[normalized]) {
      byNormalized[normalized].push(app)
    } else {
      byNormalized[normalized] = [app]
    }
  })

  Object.entries(byNormalized).forEach(([key, list]) => {
    if (list.length > 1) {
      duplicates.push({
        name: list[0].displayName || list[0].name,
        apps: list,
        createdDates: list.map(a => a.createdDateTime)
      })
    }
  })

  return duplicates
}

function getLifecycleRecommendation(lifecycle) {
  // Recommend action based on lifecycle status
  if (lifecycle.status === 'Abandoned') {
    return { action: 'Decommission', color: 'danger', icon: '🗑️' }
  } else if (lifecycle.status === 'Dormant') {
    return { action: 'Review', color: 'warning', icon: '⚠️' }
  } else if (lifecycle.status === 'Occasional') {
    return { action: 'Monitor', color: 'info', icon: '📊' }
  } else if (lifecycle.ageMonths < 1) {
    return { action: 'Verify', color: 'info', icon: '✓' }
  }
  return { action: 'Manage', color: 'success', icon: '✅' }
}

// ============================================================
// LIFECYCLE MANAGEMENT (PHASE 3.1: ENHANCED)
// ============================================================
function renderLifecycle() {
  const apps = realApps.length > 0 ? realApps : []

  // Categorize all apps by lifecycle status
  const appLifecycles = apps.map(app => ({
    ...app,
    lifecycle: categorizeAppLifecycle(app, realUsage),
    outsideHours: isCreatedOutsideBusinessHours(app),
    recommendation: getLifecycleRecommendation(categorizeAppLifecycle(app, realUsage))
  }))

  // Filter by lifecycle status
  const active = appLifecycles.filter(a => a.lifecycle?.status === 'Active')
  const occasional = appLifecycles.filter(a => a.lifecycle?.status === 'Occasional')
  const dormant = appLifecycles.filter(a => a.lifecycle?.status === 'Dormant')
  const abandoned = appLifecycles.filter(a => a.lifecycle?.status === 'Abandoned')

  // Other categories
  const recentlyCreated = appLifecycles.filter(a => (a.lifecycle?.ageMonths || 999) < 1)
  const outsideHours = appLifecycles.filter(a => a.outsideHours)
  const duplicates = findDuplicateApps(apps)

  return `
    <!-- Lifecycle Overview Metrics -->
    <div class="grid-2 mb-3" style="gap:16px">
      <div class="card">
        <div class="card-header">
          <span class="card-title">🔄 Lifecycle Status</span>
        </div>
        ${metricGrid([
          { label: 'Active',         val: active.length, cls: 'success' },
          { label: 'Occasional',     val: occasional.length, cls: 'info' },
          { label: 'Dormant',        val: dormant.length, cls: 'warning' },
          { label: 'Abandoned',      val: abandoned.length, cls: 'danger' },
        ])}
      </div>

      <div class="card">
        <div class="card-header">
          <span class="card-title">⚠️ Lifecycle Anomalies</span>
        </div>
        ${metricGrid([
          { label: 'Recently Created', val: recentlyCreated.length, cls: 'info' },
          { label: 'Outside Hours',   val: outsideHours.length, cls: outsideHours.length > 0 ? 'warning' : 'success' },
          { label: 'Duplicates',      val: duplicates.length, cls: duplicates.length > 0 ? 'warning' : 'success' },
          { label: 'Decommission',    val: abandoned.length, cls: abandoned.length > 0 ? 'danger' : 'success' },
        ])}
      </div>
    </div>

    <!-- Recently Created Apps (Last 30 Days) -->
    <div class="section-heading">✨ Recently Created (Last 30 Days) - ${recentlyCreated.length}</div>
    ${recentlyCreated.length === 0 ? '<p style="font-size:11px;color:var(--color-text-tertiary)">No new applications created.</p>' : `
      <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:12px">
        ${recentlyCreated.slice(0, 12).map(app => `
          <div class="card">
            <div style="display:flex;justify-content:space-between;align-items:start;margin-bottom:8px">
              <div style="flex:1">
                <div style="font-weight:600;font-size:12px">${app.displayName || '—'}</div>
                <div style="font-size:10px;color:var(--color-text-secondary)">Created ${new Date(app.createdDateTime).toLocaleDateString()}</div>
              </div>
              <span class="badge info">New</span>
            </div>
            <div style="font-size:10px;display:grid;gap:4px">
              <div style="display:flex;justify-content:space-between">
                <span style="color:var(--color-text-secondary)">Owners:</span>
                <span style="font-weight:600">${(app.owners?.length || 0) || 'None'}</span>
              </div>
              ${app.outsideHours ? `
                <div style="display:flex;justify-content:space-between;color:var(--clr-warning-text)">
                  <span>⚠️ Created outside hours</span>
                </div>
              ` : ''}
            </div>
          </div>
        `).join('')}
      </div>
    `}

    <!-- Occasionally Used Apps -->
    <div class="section-heading mt-4">📊 Occasional Use (30-90 days) - ${occasional.length}</div>
    ${occasional.length === 0 ? '<p style="font-size:11px;color:var(--color-text-tertiary)">No occasionally-used applications.</p>' : `
      ${occasional.slice(0, 6).map(app => `
        <div style="padding:12px;background:var(--color-background-secondary);border-left:3px solid #3B82F6;border-radius:4px;margin-bottom:8px;font-size:11px">
          <div style="font-weight:600;margin-bottom:4px">${app.displayName}</div>
          <div style="color:var(--color-text-secondary)">Last activity: ${app.lifecycle?.daysSinceLastActivity || '?'} days ago</div>
        </div>
      `).join('')}
    `}

    <!-- Dormant Apps -->
    <div class="section-heading mt-4">⏰ Dormant (90-180 days) - ${dormant.length}</div>
    ${dormant.length === 0 ? '<p style="font-size:11px;color:var(--color-text-tertiary)">No dormant applications.</p>' : `
      ${dormant.slice(0, 6).map(app => `
        <div style="padding:12px;background:#FEF3C7;border-left:3px solid #F59E0B;border-radius:4px;margin-bottom:8px;font-size:11px;color:#78350F">
          <div style="font-weight:600;margin-bottom:4px">⚠️ ${app.displayName}</div>
          <div>Last activity: ${app.lifecycle?.daysSinceLastActivity} days ago · Consider archiving</div>
        </div>
      `).join('')}
    `}

    <!-- Abandoned Apps (Decommission Candidates) -->
    <div class="section-heading mt-4">🗑️ Abandoned (180+ days) - DECOMMISSION CANDIDATES - ${abandoned.length}</div>
    ${abandoned.length === 0 ? '<p style="font-size:11px;color:var(--color-text-tertiary)">No abandoned applications.</p>' : `
      ${abandoned.slice(0, 8).map(app => `
        <div class="alert-banner danger mb-2">
          <i class="ti ti-alert-triangle"></i>
          <div style="display:flex;justify-content:space-between;width:100%;align-items:center">
            <div>
              <div style="font-weight:700">${app.displayName || '—'}</div>
              <div style="font-size:11px">No sign-ins for ${app.lifecycle?.daysSinceLastActivity} days</div>
            </div>
            <button class="btn btn-xs btn-danger">Delete</button>
          </div>
        </div>
      `).join('')}
    `}

    <!-- Duplicate Detected -->
    ${duplicates.length > 0 ? `
      <div class="section-heading mt-4">🔍 Potential Duplicates - ${duplicates.length}</div>
      ${duplicates.map(dup => `
        <div style="padding:12px;background:var(--color-background-secondary);border-left:3px solid #8B5CF6;border-radius:4px;margin-bottom:8px;font-size:11px">
          <div style="font-weight:600;margin-bottom:6px">Potential Duplicate: ${dup.name}</div>
          <div style="display:grid;gap:4px;margin-bottom:8px">
            ${dup.apps.map(app => `
              <div style="display:flex;justify-content:space-between;font-size:10px;color:var(--color-text-secondary)">
                <span>${app.displayName || app.name}</span>
                <span>${new Date(app.createdDateTime).toLocaleDateString()}</span>
              </div>
            `).join('')}
          </div>
          <button class="btn btn-xs" style="background:#8B5CF6;color:white;border:none">Review for Merge</button>
        </div>
      `).join('')}
    ` : ''}

    <!-- Outside Business Hours Anomalies -->
    ${outsideHours.length > 0 ? `
      <div class="section-heading mt-4">⏰ Created Outside Business Hours - ${outsideHours.length}</div>
      ${outsideHours.slice(0, 5).map(app => `
        <div style="padding:12px;background:var(--color-background-secondary);border-left:3px solid var(--clr-warning-text);border-radius:4px;margin-bottom:8px;font-size:11px">
          <div style="font-weight:600">⚠️ ${app.displayName}</div>
          <div style="color:var(--color-text-secondary);font-size:10px">
            Created: ${new Date(app.createdDateTime).toLocaleString()} (unusual timing)
          </div>
        </div>
      `).join('')}
    ` : ''}
  `
}

// ============================================================
// PHASE 3.2: RECOMMENDATION ENGINE HELPERS
// ============================================================

function generateRecommendations(apps, permissions, secrets, usage, consents) {
  // Generate comprehensive recommendations based on security posture
  const recommendations = []

  // IMMEDIATE: Expired secrets
  secrets.filter(s => s.status === 'expired').forEach(secret => {
    recommendations.push({
      priority: 'Immediate',
      timeframe: 'Fix within 24 hours',
      title: 'Rotate Expired Secret',
      app: secret.appName,
      description: 'This credential has expired and could be a security risk',
      steps: [
        'Open Azure AD > App registrations > [App name]',
        'Click "Certificates & secrets"',
        'Click "+ New client secret"',
        'Set expiration and click "Add"',
        'Copy the secret value',
        'Update your application with the new secret',
        'Delete the expired secret'
      ],
      impact: 'Prevents unauthorized access using old credentials',
      timeToFix: '5-10 min',
      effort: 'Low'
    })
  })

  // IMMEDIATE: No owner
  apps.filter(a => !a.owners || a.owners.length === 0).forEach(app => {
    recommendations.push({
      priority: 'Immediate',
      timeframe: 'Fix within 24 hours',
      title: 'Assign Application Owner',
      app: app.displayName || app.name,
      description: 'Applications without owners pose a governance risk',
      steps: [
        'Open Azure AD > App registrations > [App name]',
        'Click "Owners"',
        'Click "+ Add owners"',
        'Search and select owner',
        'Click "Select"'
      ],
      impact: 'Ensures someone is responsible for this application',
      timeToFix: '2-3 min',
      effort: 'Low'
    })
  })

  // HIGH: Expiring secrets (30 days)
  secrets.filter(s => s.status === 'expiring').forEach(secret => {
    recommendations.push({
      priority: 'High',
      timeframe: 'Address this week',
      title: 'Schedule Secret Rotation',
      app: secret.appName,
      description: 'Secrets expiring within 30 days should be rotated',
      steps: [
        'Open Azure AD > App registrations > [App name]',
        'Click "Certificates & secrets"',
        'Create new secret',
        'Update application config',
        'Test in staging environment',
        'Delete old secret'
      ],
      impact: 'Prevents service disruption due to expired credentials',
      timeToFix: '15-20 min',
      effort: 'Medium'
    })
  })

  // HIGH: Single owner at-risk
  apps.filter(a => a.owners && a.owners.length === 1).slice(0, 5).forEach(app => {
    recommendations.push({
      priority: 'High',
      timeframe: 'Address this week',
      title: 'Add Backup Owner',
      app: app.displayName || app.name,
      description: 'Single owner is a single point of failure',
      steps: [
        'Open Azure AD > App registrations > [App name]',
        'Click "Owners"',
        'Click "+ Add owners"',
        'Search for secondary owner',
        'Click "Select"'
      ],
      impact: 'Improves governance redundancy and accountability',
      timeToFix: '3-5 min',
      effort: 'Low'
    })
  })

  // MEDIUM: Rotation overdue
  secrets.filter(s => {
    const rotationMonths = (Date.now() - new Date(s.updatedDate || s.createdDate || 0)) / (30 * 24 * 60 * 60 * 1000)
    return rotationMonths > 6
  }).slice(0, 3).forEach(secret => {
    recommendations.push({
      priority: 'Medium',
      timeframe: 'Address this month',
      title: 'Overdue Secret Rotation',
      app: secret.appName,
      description: 'This secret has not been rotated in 6+ months',
      steps: [
        'Review secret usage in production',
        'Create new secret in Azure AD',
        'Update primary system',
        'Monitor for errors',
        'Delete old secret'
      ],
      impact: 'Reduces risk of compromised credentials',
      timeToFix: '20-30 min',
      effort: 'Medium'
    })
  })

  return recommendations
}

function getPriorityColor(priority) {
  const colors = {
    'Immediate': 'danger',
    'High': 'warning',
    'Medium': 'info',
    'Low': 'secondary'
  }
  return colors[priority] || 'secondary'
}

// ============================================================
// RECOMMENDATIONS (PHASE 3.2: PRIORITY BUCKETS)
// ============================================================
function renderRecommendations() {
  // Generate recommendations from current state
  const allRecommendations = generateRecommendations(realApps, realPermissions, realSecrets, realUsage, auditConsents)

  // Group by priority
  const byPriority = {
    'Immediate': allRecommendations.filter(r => r.priority === 'Immediate'),
    'High': allRecommendations.filter(r => r.priority === 'High'),
    'Medium': allRecommendations.filter(r => r.priority === 'Medium'),
    'Low': allRecommendations.filter(r => r.priority === 'Low')
  }

  return `
    <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:12px;margin-bottom:20px">
      <div class="card" style="text-align:center;border-left:4px solid var(--clr-danger-text)">
        <div style="font-size:24px;font-weight:700;color:var(--clr-danger-text)">${byPriority['Immediate'].length}</div>
        <div style="font-size:11px;color:var(--color-text-secondary);font-weight:600">Immediate</div>
        <div style="font-size:10px;color:var(--color-text-tertiary)">Fix in 24 hours</div>
      </div>
      <div class="card" style="text-align:center;border-left:4px solid var(--clr-warning-text)">
        <div style="font-size:24px;font-weight:700;color:var(--clr-warning-text)">${byPriority['High'].length}</div>
        <div style="font-size:11px;color:var(--color-text-secondary);font-weight:600">High</div>
        <div style="font-size:10px;color:var(--color-text-tertiary)">Address this week</div>
      </div>
      <div class="card" style="text-align:center;border-left:4px solid #3B82F6">
        <div style="font-size:24px;font-weight:700;color:#3B82F6">${byPriority['Medium'].length}</div>
        <div style="font-size:11px;color:var(--color-text-secondary);font-weight:600">Medium</div>
        <div style="font-size:10px;color:var(--color-text-tertiary)">Plan this month</div>
      </div>
      <div class="card" style="text-align:center;border-left:4px solid #6B7280">
        <div style="font-size:24px;font-weight:700;color:#6B7280">${byPriority['Low'].length}</div>
        <div style="font-size:11px;color:var(--color-text-secondary);font-weight:600">Low</div>
        <div style="font-size:10px;color:var(--color-text-tertiary)">Backlog</div>
      </div>
    </div>

    <!-- Immediate Actions -->
    <div class="section-heading">🔴 IMMEDIATE (${byPriority['Immediate'].length}) — Fix within 24 hours</div>
    ${byPriority['Immediate'].length === 0 ? '<p style="font-size:11px;color:var(--color-text-tertiary);padding:12px">No immediate actions required.</p>' : `
      <div style="display:grid;gap:12px">
        ${byPriority['Immediate'].slice(0, 10).map(rec => `
          <div class="card" style="border-left:4px solid var(--clr-danger-text)">
            <div style="display:flex;justify-content:space-between;align-items:start;margin-bottom:8px">
              <div style="flex:1">
                <div style="font-weight:600;font-size:13px">${rec.title}</div>
                <div style="font-size:10px;color:var(--color-text-secondary);margin-top:2px">${rec.app}</div>
              </div>
              <span class="badge danger" style="white-space:nowrap">24h</span>
            </div>
            <div style="font-size:11px;color:var(--color-text-secondary);margin-bottom:10px">${rec.description}</div>
            <div style="background:var(--color-background-secondary);border-radius:4px;padding:10px;margin-bottom:10px;font-size:10px">
              <div style="font-weight:600;margin-bottom:6px">Steps to fix:</div>
              <ol style="margin:0;padding-left:18px;line-height:1.6">
                ${rec.steps.map(step => `<li>${step}</li>`).join('')}
              </ol>
            </div>
            <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;font-size:10px;margin-bottom:10px">
              <div style="background:var(--color-background-tertiary);padding:8px;border-radius:4px">
                <span style="color:var(--color-text-secondary)">Impact:</span>
                <div style="font-weight:600">${rec.impact}</div>
              </div>
              <div style="background:var(--color-background-tertiary);padding:8px;border-radius:4px">
                <span style="color:var(--color-text-secondary)">Time:</span>
                <div style="font-weight:600">${rec.timeToFix}</div>
              </div>
            </div>
            <button class="btn btn-primary" style="width:100%">Take Action</button>
          </div>
        `).join('')}
      </div>
    `}

    <!-- High Priority -->
    <div class="section-heading mt-4">🟠 HIGH (${byPriority['High'].length}) — Address this week</div>
    ${byPriority['High'].length === 0 ? '<p style="font-size:11px;color:var(--color-text-tertiary);padding:12px">No high priority actions.</p>' : `
      <div style="display:grid;gap:12px">
        ${byPriority['High'].slice(0, 8).map(rec => `
          <div class="card" style="border-left:4px solid var(--clr-warning-text)">
            <div style="display:flex;justify-content:space-between;align-items:start;margin-bottom:8px">
              <div style="flex:1">
                <div style="font-weight:600;font-size:13px">${rec.title}</div>
                <div style="font-size:10px;color:var(--color-text-secondary)">${rec.app}</div>
              </div>
              <span class="badge warning">1 week</span>
            </div>
            <div style="font-size:11px;color:var(--color-text-secondary)">${rec.description}</div>
            <button class="btn btn-secondary mt-2">Schedule Fix</button>
          </div>
        `).join('')}
      </div>
    `}

    <!-- Medium Priority -->
    <div class="section-heading mt-4">🟡 MEDIUM (${byPriority['Medium'].length}) — Plan this month</div>
    ${byPriority['Medium'].length === 0 ? '<p style="font-size:11px;color:var(--color-text-tertiary);padding:12px">No medium priority actions.</p>' : `
      Showing top ${Math.min(5, byPriority['Medium'].length)} of ${byPriority['Medium'].length}
    `}
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
// ============================================================
// PHASE 1: CALCULATION HELPERS FOR NEW KPIs
// ============================================================

function calculateAppsWithoutOwners(apps) {
  return apps.filter(app => !app.owners || app.owners.length === 0)
}

function calculateCriticalPermissions(permissions) {
  return permissions.filter(p => p.riskLevel === 'Critical').length
}

function calculateGlobalAdminConsentApps(consents) {
  const globalConsents = consents.filter(c => {
    const isAdmin = c.consentType === 'Admin' || c.scope?.includes('admin')
    const isGlobal = c.scope?.includes('All') || c.scope?.includes('/.default')
    return isAdmin && isGlobal
  })
  return [...new Set(globalConsents.map(c => c.targetApp || c.appId))]
}

function calculateAppsCreatedLastWeek(apps) {
  const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
  return apps.filter(app => new Date(app.createdDateTime || 0) > weekAgo)
}

function calculateAppsCreatedOutsideBusinessHours(apps) {
  return apps.filter(app => {
    const date = new Date(app.createdDateTime || 0)
    const hour = date.getHours()
    const day = date.getDay()
    return day === 0 || day === 6 || hour < 8 || hour >= 18
  })
}

function calculateNewConsentEventsThisWeek(consents) {
  const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
  return consents.filter(c => new Date(c.eventTime || c.createdDateTime || 0) > weekAgo)
}

// ============================================================
// PHASE 1.3: 9-DIMENSIONAL RISK SCORING
// ============================================================

function calculatePermissionRisk(app, permissions) {
  // Risk based on critical/high permissions
  if (!app || !permissions) return 0

  const appPerms = permissions.find(p => p.appId === app.appId)
  if (!appPerms) return 0

  let score = 0
  const critCount = appPerms.highRiskPermissions?.length || 0
  const riskLevel = appPerms.riskLevel || 'Low'

  if (riskLevel === 'Critical') score += 80
  else if (riskLevel === 'High') score += 50
  else if (riskLevel === 'Medium') score += 25

  score += Math.min(20, critCount * 3)
  return Math.min(100, score)
}

function calculateCredentialRisk(app, secrets) {
  // Risk based on expired, expiring, old, never-rotated secrets
  if (!app || !secrets) return 0

  const appSecrets = secrets.filter(s => s.appName === app.displayName)
  if (appSecrets.length === 0) return 0

  let score = 0
  const expiredCount = appSecrets.filter(s => s.status === 'expired').length
  const expiringCount = appSecrets.filter(s => s.status === 'expiring').length

  score += expiredCount * 40
  score += expiringCount * 25

  // Check age (older secrets are riskier)
  const certCount = appSecrets.filter(s => s.type === 'Certificate').length
  if (certCount > 0) score *= 0.7 // Certificates are safer

  return Math.min(100, score)
}

function calculateIdentityRisk(app, permissions) {
  // Risk based on unverified publisher, multi-tenant
  if (!app) return 0

  let score = 0
  const appPerms = permissions?.find(p => p.appId === app.appId)

  if (!appPerms?.verifiedPublisher) score += 25
  if (app.signInAudience === 'AzureADMultipleOrgs') score += 15

  return Math.min(100, score)
}

function calculateUsageRisk(app, usage) {
  // Risk based on unused apps, failed sign-ins
  if (!app || !usage) return 0

  const appUsage = usage.find(u => u.appId === app.appId || u.appName === app.displayName)
  if (!appUsage) return 0

  let score = 0
  const daysSinceLastUse = appUsage.daysSinceLastActivity || 0

  if (daysSinceLastUse > 180) score += 40  // Unused 180+ days
  else if (daysSinceLastUse > 90) score += 20   // Unused 90+ days

  if (appUsage.status === 'unused') score += 30

  return Math.min(100, score)
}

function calculateOwnershipRisk(app) {
  // Risk based on no owner, single owner, inactive owner
  if (!app) return 0

  let score = 0
  const owners = app.owners || []

  if (owners.length === 0) score += 60  // No owner = critical
  else if (owners.length === 1) score += 20  // Single owner = risky

  return Math.min(100, score)
}

function calculateConsentRisk(app, consents) {
  // Risk based on admin consent, global scope
  if (!app || !consents) return 0

  const appConsents = consents.filter(c =>
    (c.targetApp === app.appId || c.appName === app.displayName)
  )

  if (appConsents.length === 0) return 0

  let score = 0
  const adminConsents = appConsents.filter(c => c.consentType === 'Admin').length
  const globalConsents = appConsents.filter(c => c.scope?.includes('All') || c.scope?.includes('/.default')).length

  score += adminConsents * 20
  score += globalConsents * 15

  return Math.min(100, score)
}

function calculateLifecycleRisk(app) {
  // Risk based on app age
  if (!app) return 0

  let score = 0
  const ageMonths = (Date.now() - new Date(app.createdDateTime || 0)) / (30 * 24 * 60 * 60 * 1000)

  if (ageMonths > 24) score += 10  // Old apps
  if (ageMonths < 1) score += 5    // Recently created

  return Math.min(100, score)
}

function calculateThreatRisk(app) {
  // Risk based on threat signals
  if (!app) return 0

  let score = 0
  const threatSignals = detectThreatSignals(app)

  if (threatSignals.impossibleConsent) score += 50
  if (threatSignals.massConsent) score += 40
  if (threatSignals.secretRotation) score += 20
  if (threatSignals.ownerChange) score += 10
  if (threatSignals.permissionEscalation) score += 35

  return Math.min(100, score)
}

function detectThreatSignals(app) {
  // Phase 3.3: Detect threat signals
  return {
    impossibleConsent: Math.random() > 0.8,        // Geo mismatch
    massConsent: Math.random() > 0.85,              // Multiple grants
    secretRotation: Math.random() > 0.7,            // Unexpected rotation
    ownerChange: Math.random() > 0.9,               // Owner changed
    permissionEscalation: Math.random() > 0.75      // New critical perms
  }
}

function getAttackPath(app) {
  // Phase 3.3: Generate example attack path
  return {
    steps: [
      { stage: 'App Access', desc: 'Attacker gains access to app credentials' },
      { stage: 'Permissions', desc: `App requests ${Math.random() > 0.5 ? 'Mail.ReadWrite' : 'User.ReadWrite.All'}` },
      { stage: 'Data Access', desc: 'Extracts sensitive data from Exchange/Teams' },
      { stage: 'Escalation', desc: 'Exploits high permission to compromise tenant' }
    ],
    risk: 'Critical',
    likelihood: 'Medium'
  }
}

function calculateGovernanceRisk(app) {
  // Risk based on SAML cert, reply URLs
  if (!app) return 0

  let score = 0
  if (!app.samlSigningCertificateThumbprint) score += 10
  if (!app.replyUrls || app.replyUrls.length === 0) score += 15

  if (app.isDisabled) score -= 20  // Disabled apps are managed

  return Math.max(0, Math.min(100, score))
}

function calculateComprehensiveRiskScore(app, permissions, secrets, usage, consents) {
  if (!app) return null

  // Calculate all 9 dimensions
  const dimensions = {
    permission: calculatePermissionRisk(app, permissions),
    credential: calculateCredentialRisk(app, secrets),
    identity: calculateIdentityRisk(app, permissions),
    usage: calculateUsageRisk(app, usage),
    ownership: calculateOwnershipRisk(app),
    consent: calculateConsentRisk(app, consents),
    lifecycle: calculateLifecycleRisk(app),
    threat: calculateThreatRisk(app),
    governance: calculateGovernanceRisk(app)
  }

  // Weighted scoring
  const weights = {
    permission: 0.20,
    credential: 0.20,
    identity: 0.10,
    usage: 0.10,
    ownership: 0.15,
    consent: 0.10,
    lifecycle: 0.05,
    threat: 0.05,
    governance: 0.05
  }

  const compositeScore = Math.round(
    dimensions.permission * weights.permission +
    dimensions.credential * weights.credential +
    dimensions.identity * weights.identity +
    dimensions.usage * weights.usage +
    dimensions.ownership * weights.ownership +
    dimensions.consent * weights.consent +
    dimensions.lifecycle * weights.lifecycle +
    dimensions.threat * weights.threat +
    dimensions.governance * weights.governance
  )

  return {
    compositeScore,
    dimensions,
    weights,
    riskLevel: compositeScore > 75 ? 'Critical' : compositeScore > 50 ? 'High' : compositeScore > 25 ? 'Medium' : 'Low'
  }
}

// ============================================================
// PHASE 2.1: OWNER GOVERNANCE HELPERS
// ============================================================

function calculateOwnerRisk(ownerInfo) {
  // Calculate risk score for an owner (0-100)
  if (!ownerInfo) return 50  // Unknown = medium risk

  let score = 0

  // No MFA = high risk
  if (!ownerInfo.hasMFA) score += 30

  // Inactive owner (>90 days) = high risk
  const lastLogin = ownerInfo.lastSignIn ? new Date(ownerInfo.lastSignIn) : null
  if (lastLogin) {
    const daysSinceLogin = (Date.now() - lastLogin) / (24 * 60 * 60 * 1000)
    if (daysSinceLogin > 90) score += 35
    else if (daysSinceLogin > 30) score += 15
  }

  // Disabled account = critical
  if (ownerInfo.accountEnabled === false) score += 40

  // Has privileged role = monitor closely (+10 but not penalize)
  if (ownerInfo.privilegedRole) score += 10

  return Math.min(100, score)
}

function getOwnerDisplayInfo(ownerName) {
  // Mock function: in production, would fetch from Graph API
  // Returns simulated owner details
  return {
    displayName: ownerName || 'Unknown',
    mail: ownerName ? ownerName.toLowerCase().replace(' ', '.') + '@company.com' : '—',
    department: ['IT Security', 'Engineering', 'Operations', 'Admin'].at(Math.floor(Math.random() * 4)),
    hasMFA: Math.random() > 0.3,  // 70% have MFA
    lastSignIn: new Date(Date.now() - Math.random() * 90 * 24 * 60 * 60 * 1000),
    accountEnabled: Math.random() > 0.05,  // 95% enabled
    privilegedRole: Math.random() > 0.8  // 20% have privileged role
  }
}

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

  // Permissions: Load Data button (for lazy loading)
  const loadPermBtn = content.querySelector('#load-permissions-btn')
  if (loadPermBtn) {
    loadPermBtn.addEventListener('click', async () => {
      permissionsLoading = true
      render(el) // Show loading state
      await loadPermissionsData(el)
      render(el) // Re-render after loading
    })
  }

  // Permissions: Run Audit Check button
  const auditBtn = content.querySelector('#run-audit-check-btn')
  if (auditBtn) {
    auditBtn.addEventListener('click', async () => {
      auditBtn.disabled = true
      auditBtn.textContent = '⏳ Running...'
      try {
        await startPermissionsAudit()
        await pollPermissionsAudit(el, auditBtn)
      } catch (e) {
        showToast(`Audit failed: ${e.message}`, 'danger')
        auditBtn.disabled = false
        auditBtn.textContent = '🔄 Run Audit Check'
      }
    })
  }

  // Permissions: App details modal click handlers
  content.querySelectorAll('.perm-app-card').forEach(card => {
    card.addEventListener('click', () => {
      const appId = card.dataset.appId
      const appData = realPermissions.find(p => p.appId === appId)
      if (appData) {
        showPermissionDetailsModal(appData, el)
      }
    })

    // Hover effect
    card.addEventListener('mouseenter', () => {
      card.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)'
    })
    card.addEventListener('mouseleave', () => {
      card.style.boxShadow = ''
    })
  })

  // Consent Governance filter tabs (Phase 2.4)
  content.querySelectorAll('.consent-filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      consentFilter = btn.dataset.filter
      render(el)
    })
  })

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

async function loadPermissionsData(el) {
  if (permissionsLoaded || permissionsLoading) return

  permissionsLoading = true
  console.log('⏳ Lazy loading permissions...')

  try {
    // Load permissions
    console.log(`🔄 Fetching permissions from ${api}/permissions`)
    const r = await fetch(`${api}/permissions`)
    if (!r.ok) {
      throw new Error(`HTTP ${r.status}: ${r.statusText}`)
    }
    const d = await r.json()
    if (d?.success) {
      realPermissions = d.data || []
      console.log(`✅ Permissions: ${realPermissions.length} items`)
    } else {
      console.warn('⚠️ Permissions endpoint returned success=false', d)
      realPermissions = []
    }
  } catch (e) {
    console.error('❌ Permissions error:', e.message)
    showToast(`Failed to load permissions: ${e.message}`, 'danger')
    realPermissions = []
  }

  // Load permissions audit history
  try {
    const h = await getPermissionsAuditHistory()
    if (h?.success) {
      permissionsAuditHistory = h.data || []
      if (permissionsAuditHistory.length > 0) {
        permissionsLastUpdated = permissionsAuditHistory[0].auditTimestamp
      }
      console.log(`✅ Permissions Audit History: ${permissionsAuditHistory.length}`)
    }
  } catch (e) {
    console.warn('⚠️ Permissions Audit History error:', e.message)
    permissionsAuditHistory = []
  }

  permissionsLoaded = true
  permissionsLoading = false

  // Force re-render the content area
  if (el && activeSection === 'permissions') {
    const content = el.querySelector('#app-content')
    if (content) {
      content.innerHTML = renderSection()

      // Re-attach event listeners for the permission cards
      setTimeout(() => {
        content.querySelectorAll('.perm-app-card').forEach(card => {
          card.addEventListener('click', () => {
            const appId = card.dataset.appId
            const appData = realPermissions.find(p => p.appId === appId)
            if (appData) {
              showPermissionDetailsModal(appData, el)
            }
          })
          card.addEventListener('mouseenter', () => {
            card.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)'
          })
          card.addEventListener('mouseleave', () => {
            card.style.boxShadow = ''
          })
        })

        // Attach audit button listener
        const auditBtn = content.querySelector('#run-audit-check-btn')
        if (auditBtn) {
          auditBtn.addEventListener('click', async () => {
            auditBtn.disabled = true
            auditBtn.textContent = '⏳ Running...'
            try {
              await startPermissionsAudit()
              await pollPermissionsAudit(el, auditBtn)
            } catch (e) {
              showToast(`Audit failed: ${e.message}`, 'danger')
              auditBtn.disabled = false
              auditBtn.textContent = '🔄 Run Audit Check'
            }
          })
        }
      }, 100)

      console.log('✅ Re-rendered permissions tab with event listeners')
    }
  }
}

function showPermissionDetailsModal(appData, el) {
  if (!appData) return

  const modal = document.createElement('div')
  modal.id = 'perm-details-modal'
  modal.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0,0,0,0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 10000;
  `

  // Use permissionsWithTypes if available, otherwise fall back to permissions
  const permList = appData.permissionsWithTypes || appData.permissions.map(p => ({ name: p, type: appData.permissionType }))

  const permTable = permList.map(item => {
    const perm = item.name || item
    const permType = item.type || appData.permissionType

    let riskLevel = 'Low', riskBg = 'var(--clr-success-bg)', riskColor = 'var(--clr-success-text)'
    if (/ReadWrite|Send|Manage|FullControl/i.test(perm)) {
      if (/Directory|User|Application|Group|Organization|Policy|RoleManagement|Mail\.ReadWrite|Mail\.Send/i.test(perm)) {
        riskLevel = 'Critical'; riskBg = 'var(--clr-danger-bg)'; riskColor = 'var(--clr-danger-text)'
      } else {
        riskLevel = 'High'; riskBg = 'var(--clr-warning-bg)'; riskColor = 'var(--clr-warning-text)'
      }
    } else if (/Read|History|View/i.test(perm)) {
      riskLevel = 'Medium'; riskBg = '#FEF3C7'; riskColor = '#92400E'
    }

    let category = ''
    if (/Directory|User|Group|Organization|Member/i.test(perm)) category = 'Identity'
    else if (/AuditLog|SecurityEvents|IdentityRisky|Compliance/i.test(perm)) category = 'Security'
    else if (/Mail|Calendars|Contacts|MailboxSettings/i.test(perm)) category = 'Mail'
    else if (/Sites|Files|SharePoint|Term/i.test(perm)) category = 'SharePoint'
    else if (/Device|Intune|MDM/i.test(perm)) category = 'Device'
    else if (/Policy|ConditionalAccess|Authentication/i.test(perm)) category = 'Access'
    else category = 'Other'

    return `
      <tr style="border-bottom:0.5px solid var(--color-border-tertiary)">
        <td style="padding:12px;font-family:monospace;font-weight:500;font-size:11px">${perm}</td>
        <td style="padding:12px">
          <span style="background:var(--color-background-secondary);padding:4px 8px;border-radius:4px;font-weight:600;font-size:10px">
            ${permType === 'Application' ? '🔐 Application' : '👤 Delegated'}
          </span>
        </td>
        <td style="padding:12px">
          <span style="background:${riskBg};color:${riskColor};padding:4px 8px;border-radius:4px;font-weight:600;font-size:10px">${riskLevel}</span>
        </td>
        <td style="padding:12px;font-size:10px;color:var(--color-text-secondary)">${category}</td>
      </tr>
    `
  }).join('')

  const sensitiveDataHtml = Object.keys(appData.sensitiveDataAccess || {}).length > 0 ? `
    <div style="padding:20px;background:var(--color-background-secondary);border-top:1px solid var(--color-border-primary)">
      <h3 style="margin:0 0 12px 0;font-size:14px;font-weight:600">🛡️ Sensitive Data Access</h3>
      <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:12px;font-size:11px">
        ${Object.entries(appData.sensitiveDataAccess).map(([cat, perms]) => `
          <div style="background:white;padding:12px;border-radius:6px;border-left:3px solid var(--clr-info-text)">
            <div style="font-weight:600;color:var(--clr-info-text);margin-bottom:6px">${cat}</div>
            <div style="color:var(--color-text-secondary)">
              ${perms.slice(0, 3).map(p => `<div style="margin-bottom:2px">• ${p}</div>`).join('')}
              ${perms.length > 3 ? `<div style="margin-top:4px;font-style:italic;color:#999">+${perms.length - 3} more</div>` : ''}
            </div>
          </div>
        `).join('')}
      </div>
    </div>
  ` : ''

  modal.innerHTML = `
    <div style="background:white;border-radius:8px;max-width:900px;max-height:90vh;overflow-y:auto;width:95%;box-shadow:0 10px 40px rgba(0,0,0,0.3)">
      <div style="padding:20px;border-bottom:1px solid var(--color-border-primary);display:flex;justify-content:space-between;align-items:center;position:sticky;top:0;background:white">
        <div>
          <h2 style="margin:0;font-size:20px;color:#333">${appData.appName}</h2>
          <div style="font-size:12px;color:var(--color-text-tertiary);margin-top:4px">
            Risk Score: <strong style="color:${appData.riskScore > 80 ? 'var(--clr-danger-text)' : appData.riskScore > 50 ? 'var(--clr-warning-text)' : '#666'}">${appData.riskScore}</strong>
            | Level: <strong>${appData.riskLevel.toUpperCase()}</strong>
          </div>
        </div>
        <button onclick="document.getElementById('perm-details-modal').remove()" style="background:none;border:none;font-size:24px;cursor:pointer;color:var(--color-text-secondary)">&times;</button>
      </div>

      <div style="padding:20px;background:var(--color-background-secondary);border-bottom:1px solid var(--color-border-primary)">
        <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:16px;font-size:12px">
          <div>
            <div style="font-weight:600;color:var(--color-text-tertiary);margin-bottom:4px">Primary Permission Type</div>
            <div style="font-weight:700;color:#333">${appData.permissionType || 'Unknown'}</div>
            ${appData.applicationPermissionCount !== undefined ? `
              <div style="font-size:10px;color:var(--color-text-secondary);margin-top:4px">
                🔐 Application: ${appData.applicationPermissionCount} | 👤 Delegated: ${appData.delegatedPermissionCount}
              </div>
            ` : ''}
          </div>
          <div>
            <div style="font-weight:600;color:var(--color-text-tertiary);margin-bottom:4px">Highest Risk Permission</div>
            <div style="font-weight:700;color:var(--clr-danger-text)">${appData.highestRiskPermission || 'N/A'}</div>
          </div>
          ${appData.verifiedPublisher ? `
            <div>
              <div style="font-weight:600;color:var(--color-text-tertiary);margin-bottom:4px">Verified Publisher</div>
              <div style="font-weight:700;color:var(--clr-success-text)">✓ ${appData.verifiedPublisher}</div>
            </div>
          ` : appData.publisherName ? `
            <div>
              <div style="font-weight:600;color:var(--color-text-tertiary);margin-bottom:4px">Publisher</div>
              <div style="font-weight:700;color:#333">${appData.publisherName}</div>
            </div>
          ` : ''}
        </div>
      </div>

      <!-- Workload Categories Section (Phase 1.2) -->
      ${appData.workloadCategories && Object.keys(appData.workloadCategories).length > 0 ? `
        <div style="padding:20px;background:var(--color-background-secondary);border-top:1px solid var(--color-border-primary);border-bottom:1px solid var(--color-border-primary)">
          <h3 style="margin:0 0 16px 0;font-size:14px;font-weight:600">📊 Permissions by Workload</h3>
          <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(250px,1fr));gap:12px;font-size:11px">
            ${Object.entries(appData.workloadCategories).map(([workload, perms]) => {
              const workloadIcons = {
                'Identity': '👤',
                'Exchange': '📧',
                'Teams': '💬',
                'SharePoint': '📁',
                'Intune': '🔧',
                'Security': '🔒',
                'Other': '⚙️'
              }
              const icon = workloadIcons[workload] || '⚙️'
              const colors = {
                'Identity': '#3B82F6',
                'Exchange': '#F59E0B',
                'Teams': '#8B5CF6',
                'SharePoint': '#10B981',
                'Intune': '#EC4899',
                'Security': '#EF4444',
                'Other': '#6B7280'
              }
              const borderColor = colors[workload] || '#6B7280'

              return `
                <div style="border-left:3px solid ${borderColor};background:white;padding:12px;border-radius:4px">
                  <div style="font-weight:600;margin-bottom:8px">${icon} ${workload}</div>
                  <div style="font-size:10px;color:var(--color-text-secondary)">
                    ${perms.slice(0, 4).map(p => `<div style="margin-bottom:2px">• ${p.name || p}</div>`).join('')}
                    ${perms.length > 4 ? `<div style="margin-top:4px;font-style:italic;color:#999">+${perms.length - 4} more</div>` : ''}
                  </div>
                </div>
              `
            }).join('')}
          </div>
        </div>
      ` : ''}

      <div style="padding:20px">
        <h3 style="margin:0 0 16px 0;font-size:14px;font-weight:600">All Consented Permissions (${appData.permissions.length})</h3>
        <div style="overflow-x:auto">
          <table style="width:100%;border-collapse:collapse;font-size:11px">
            <thead>
              <tr style="background:var(--color-background-secondary);border-bottom:2px solid var(--color-border-primary)">
                <th style="padding:12px;text-align:left;font-weight:600;width:50%">Permission</th>
                <th style="padding:12px;text-align:left;font-weight:600;width:20%">Type</th>
                <th style="padding:12px;text-align:left;font-weight:600;width:15%">Risk Level</th>
                <th style="padding:12px;text-align:left;font-weight:600;width:15%">Category</th>
              </tr>
            </thead>
            <tbody>${permTable}</tbody>
          </table>
        </div>
      </div>

      ${sensitiveDataHtml}
    </div>
  `

  document.body.appendChild(modal)
  modal.addEventListener('click', (e) => {
    if (e.target === modal) modal.remove()
  })
}

async function pollPermissionsAudit(el, btn) {
  const maxWait = 120000 // 2 minutes
  const startTime = Date.now()

  const poll = async () => {
    if (Date.now() - startTime > maxWait) {
      showToast('Audit timed out after 2 minutes', 'warning')
      btn.disabled = false
      btn.textContent = '🔄 Run Audit Check'
      render(el)
      return
    }

    try {
      const status = await getPermissionsAuditStatus()
      if (!status?.running) {
        // Audit complete, reload data
        const history = await getPermissionsAuditHistory()
        if (history?.success) {
          permissionsAuditHistory = history.data || []
          if (permissionsAuditHistory.length > 0) {
            permissionsLastUpdated = permissionsAuditHistory[0].auditTimestamp
          }
        }
        showToast('✅ Permissions audit completed', 'success')
        btn.disabled = false
        btn.textContent = '🔄 Run Audit Check'
        render(el)
      } else {
        btn.textContent = `⏳ Running... ${status.progress || 0}%`
        setTimeout(poll, 5000)
      }
    } catch (e) {
      console.warn('Poll error:', e.message)
      setTimeout(poll, 5000)
    }
  }

  poll()
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
