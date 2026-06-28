import { go, state } from '../app.js'
import { getDevices, getUsers, getSecurityScore, callAPI, getMessageCenterMessages, getServiceHealth } from '../lib/api-client.js'
import { isDemoAccount } from '../lib/demo-account.js'
import { MC_MESSAGES, SVC_HEALTH, SVC_META } from '../data/msgcenter-data.js'

let realDeviceCount = 0
let realUserCount = 0
let realSecureScore = null
let recentAdminConsents = []

function isDismissedRecently() {
  const dismissedTime = localStorage.getItem('dashboard_consents_dismissed')
  if (!dismissedTime) return false
  const now = new Date().getTime()
  const dismissedAt = parseInt(dismissedTime)
  const hoursAgo = (now - dismissedAt) / (1000 * 60 * 60)
  return hoursAgo < 24 // Show again after 24 hours
}

export async function initDashboard() {
  const el = document.getElementById('page-dashboard')
  if (!el) return

  if (isDemoAccount()) {
    renderDemoDashboard(el)
    return
  }

  // Render page structure immediately with blank placeholders
  renderDashboardSkeleton(el)

  // Fetch data in background and update as it arrives
  loadDashboardData(el)
}

function renderDashboardSkeleton(el) {
  el.innerHTML = `
    <div class="page-header">
      <div>
        <div class="page-title"><i class="ti ti-layout-dashboard"></i> Dashboard</div>
        <div class="page-subtitle">${state.tenantDomain} — last updated just now</div>
      </div>
      <div class="page-actions">
        <button class="btn"><i class="ti ti-refresh"></i> Refresh</button>
        <button class="btn btn-primary"><i class="ti ti-download"></i> Export</button>
      </div>
    </div>


    <!-- 📊 Critical Alerts Section -->
    <div style="margin-bottom:20px">
      <div style="font-size:16px;font-weight:700;color:var(--color-text-primary);margin-bottom:16px;padding-bottom:12px;border-bottom:2px solid var(--color-border-secondary)"><i class="ti ti-alert-triangle"></i> Critical Alerts</div>
      <div class="dash-cards-row mb-3">
        <div class="card" style="opacity:0.5;background:var(--color-background-secondary)"><div class="card-header"><span class="card-title"><i class="ti ti-inbox"></i> Pending Requests</span></div><div style="padding:12px"><div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:12px"><div style="text-align:center"><div style="font-size:28px;font-weight:700;color:var(--clr-warning-text)" id="dash-requests-pending">—</div><div style="font-size:9px;color:var(--color-text-tertiary)">Pending</div></div><div style="text-align:center"><div style="font-size:16px;font-weight:600;color:var(--clr-info-text)" id="dash-requests-total">—</div><div style="font-size:9px;color:var(--color-text-tertiary)">Total</div></div></div><div style="padding-top:8px;border-top:0.5px solid var(--color-border-tertiary);font-size:10px;color:var(--color-text-secondary)" id="dash-requests-time">⏱ Loading...</div><button class="btn btn-sm" id="dash-to-requests" style="margin-top:8px;width:100%"><i class="ti ti-arrow-right"></i> View Requests</button></div></div>
        <div class="card" style="opacity:0.5;background:var(--color-background-secondary)"><div class="card-header"><span class="card-title"><i class="ti ti-alert-triangle"></i> Security Incidents</span></div><div style="padding:12px"><div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:12px"><div style="text-align:center"><div style="font-size:28px;font-weight:700;color:var(--clr-success-text)" id="dash-incidents-active">—</div><div style="font-size:9px;color:var(--color-text-tertiary)">Active</div></div><div style="text-align:center"><div style="font-size:16px;font-weight:600;color:var(--clr-info-text)" id="dash-incidents-week">—</div><div style="font-size:9px;color:var(--color-text-tertiary)">This Week</div></div></div><div style="padding-top:8px;border-top:0.5px solid var(--color-border-tertiary);font-size:10px;color:var(--color-text-secondary)" id="dash-incidents-status">✓ Loading...</div><button class="btn btn-sm" id="dash-to-security" style="margin-top:8px;width:100%"><i class="ti ti-arrow-right"></i> View Security</button></div></div>
        <div class="card" style="opacity:0.5;background:var(--color-background-secondary)"><div class="card-header"><span class="card-title"><i class="ti ti-shield-check"></i> TenantGuard Alerts</span></div><div style="padding:12px"><div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:12px"><div style="text-align:center"><div style="font-size:28px;font-weight:700;color:var(--clr-warning-text)" id="dash-tguard-active">—</div><div style="font-size:9px;color:var(--color-text-tertiary)">Active</div></div><div style="text-align:center"><div style="font-size:16px;font-weight:600;color:var(--clr-danger-text)" id="dash-tguard-critical">—</div><div style="font-size:9px;color:var(--color-text-tertiary)">Critical</div></div></div><div style="padding-top:8px;border-top:0.5px solid var(--color-border-tertiary);font-size:10px;color:var(--color-text-secondary)" id="dash-tguard-correlations">⚠ Loading...</div><button class="btn btn-sm" id="dash-to-tenantguard" style="margin-top:8px;width:100%"><i class="ti ti-arrow-right"></i> View Alerts</button></div></div>
        <div class="card" style="opacity:0.5;background:var(--color-background-secondary)"><div class="card-header"><span class="card-title"><i class="ti ti-crown"></i> Privileged Accounts</span></div><div style="padding:12px"><div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:12px"><div style="text-align:center"><div style="font-size:28px;font-weight:700;color:var(--clr-danger-text)" id="dash-priv-atrisk">—</div><div style="font-size:9px;color:var(--color-text-tertiary)">At-Risk</div></div><div style="text-align:center"><div style="font-size:16px;font-weight:600;color:var(--clr-info-text)" id="dash-priv-total">—</div><div style="font-size:9px;color:var(--color-text-tertiary)">Total</div></div></div><div style="padding-top:8px;border-top:0.5px solid var(--color-border-tertiary);font-size:10px;color:var(--color-text-secondary)" id="dash-priv-nomfa">⏱ Loading...</div><button class="btn btn-sm" id="dash-to-privaccts" style="margin-top:8px;width:100%"><i class="ti ti-arrow-right"></i> View Accounts</button></div></div>
      </div>
    </div>

    <!-- 🏥 System Health Overview -->
    <div style="margin-bottom:20px">
      <div style="font-size:16px;font-weight:700;color:var(--color-text-primary);margin-bottom:16px;padding-bottom:12px;border-bottom:2px solid var(--color-border-secondary)"><i class="ti ti-heartbeat"></i> System Health Overview</div>
      <div class="dash-cards-row mb-3">
        <div class="card" style="opacity:0.5;background:var(--color-background-secondary)"><div class="card-header"><span class="card-title"><i class="ti ti-lock-check"></i> Zero Trust Compliance</span></div><div style="padding:12px"><div style="text-align:center;margin-bottom:12px"><div style="font-size:16px;color:var(--color-text-secondary)" id="dash-zt-status">—</div></div><div style="padding:8px;background:var(--color-background-primary);border-radius:var(--border-radius-sm);text-align:center"><div style="font-size:10px;color:var(--color-text-secondary)" id="dash-zt-pillars">Loading...</div></div><button class="btn btn-sm" id="dash-to-zt" style="margin-top:8px;width:100%"><i class="ti ti-arrow-right"></i> Request Assessment</button></div></div>
        <div class="card" style="opacity:0.5;background:var(--color-background-secondary)"><div class="card-header"><span class="card-title"><i class="ti ti-settings-2"></i> CIS Controls</span></div><div style="padding:12px"><div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:12px"><div style="text-align:center"><div style="font-size:28px;font-weight:700;color:var(--clr-warning-text)" id="dash-cis-compliance">—</div><div style="font-size:9px;color:var(--color-text-tertiary)">Compliance</div></div><div style="text-align:center"><div style="font-size:16px;font-weight:600;color:var(--clr-info-text)" id="dash-cis-topics">—</div><div style="font-size:9px;color:var(--color-text-tertiary)">Topics</div></div></div><div style="padding-top:8px;border-top:0.5px solid var(--color-border-tertiary);font-size:10px;color:var(--color-text-secondary)" id="dash-cis-trend">📊 Loading...</div><button class="btn btn-sm" id="dash-to-m365" style="margin-top:8px;width:100%"><i class="ti ti-arrow-right"></i> View Config</button></div></div>
        <div class="card" style="opacity:0.5;background:var(--color-background-secondary)"><div class="card-header"><span class="card-title"><i class="ti ti-license"></i> License Utilization</span></div><div style="padding:12px"><div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:12px"><div style="text-align:center"><div style="font-size:28px;font-weight:700;color:var(--clr-success-text)" id="dash-license-pct">—</div><div style="font-size:9px;color:var(--color-text-tertiary)">Utilized</div></div><div style="text-align:center"><div style="font-size:16px;font-weight:600;color:var(--clr-info-text)" id="dash-license-count">—</div><div style="font-size:9px;color:var(--color-text-tertiary)">Count</div></div></div><div style="padding-top:8px;border-top:0.5px solid var(--color-border-tertiary);font-size:10px;color:var(--color-text-secondary)" id="dash-license-risk">⚠ Loading...</div><button class="btn btn-sm" id="dash-to-licenses" style="margin-top:8px;width:100%"><i class="ti ti-arrow-right"></i> View Licenses</button></div></div>
        <div class="card" style="opacity:0.5;background:var(--color-background-secondary)"><div class="card-header"><span class="card-title"><i class="ti ti-device-laptop"></i> Device Compliance</span></div><div style="padding:12px"><div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:12px"><div style="text-align:center"><div style="font-size:28px;font-weight:700;color:var(--clr-success-text)" id="dash-device-compliance">—</div><div style="font-size:9px;color:var(--color-text-tertiary)">Compliant</div></div><div style="text-align:center"><div style="font-size:16px;font-weight:600;color:var(--clr-info-text)" id="dash-device-count">—</div><div style="font-size:9px;color:var(--color-text-tertiary)">Devices</div></div></div><div style="padding-top:8px;border-top:0.5px solid var(--color-border-tertiary);font-size:10px;color:var(--color-text-secondary)" id="dash-device-noncompliant">⚠ Loading...</div><button class="btn btn-sm" id="dash-to-intune" style="margin-top:8px;width:100%"><i class="ti ti-arrow-right"></i> View Devices</button></div></div>
      </div>
    </div>

    <!-- 🚀 Applications & Enterprise Health -->
    <div style="margin-bottom:20px">
      <div style="font-size:16px;font-weight:700;color:var(--color-text-primary);margin-bottom:16px;padding-bottom:12px;border-bottom:2px solid var(--color-border-secondary)"><i class="ti ti-rocket"></i> Applications & Enterprise Health</div>
      <div class="dash-cards-row mb-3">
        <div class="card" style="opacity:0.5;background:var(--color-background-secondary)"><div class="card-header"><span class="card-title"><i class="ti ti-app-window"></i> Entra Apps</span></div><div style="padding:12px"><div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:12px"><div style="text-align:center"><div style="font-size:28px;font-weight:700;color:var(--clr-danger-text)" id="dash-apps-expiring">—</div><div style="font-size:9px;color:var(--color-text-tertiary)">Expiring</div></div><div style="text-align:center"><div style="font-size:16px;font-weight:600;color:var(--clr-info-text)" id="dash-apps-total">—</div><div style="font-size:9px;color:var(--color-text-tertiary)">Total</div></div></div><div style="padding-top:8px;border-top:0.5px solid var(--color-border-tertiary);font-size:10px;color:var(--color-text-secondary)" id="dash-apps-status">⚠ Loading...</div><button class="btn btn-sm" id="dash-to-apps" style="margin-top:8px;width:100%"><i class="ti ti-arrow-right"></i> View Apps</button></div></div>
        <div class="card" style="opacity:0.5;background:var(--color-background-secondary)"><div class="card-header"><span class="card-title"><i class="ti ti-shield-check"></i> Risk Analysis</span></div><div style="padding:12px"><div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:12px"><div style="text-align:center"><div style="font-size:28px;font-weight:700;color:var(--clr-warning-text)" id="dash-risk-high">—</div><div style="font-size:9px;color:var(--color-text-tertiary)">High-Risk</div></div><div style="text-align:center"><div style="font-size:16px;font-weight:600;color:var(--clr-info-text)" id="dash-risk-users">—</div><div style="font-size:9px;color:var(--color-text-tertiary)">Users</div></div></div><div style="padding-top:8px;border-top:0.5px solid var(--color-border-tertiary);font-size:10px;color:var(--color-text-secondary)" id="dash-risk-score">📊 Loading...</div><button class="btn btn-sm" id="dash-to-investigation" style="margin-top:8px;width:100%"><i class="ti ti-arrow-right"></i> Investigate</button></div></div>
        <div class="card" style="opacity:0.5;background:var(--color-background-secondary)"><div class="card-header"><span class="card-title"><i class="ti ti-robot"></i> AI Agents</span></div><div style="padding:12px"><div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:12px"><div style="text-align:center"><div style="font-size:28px;font-weight:700;color:var(--clr-success-text)" id="dash-agents-active">—</div><div style="font-size:9px;color:var(--color-text-tertiary)">Active</div></div><div style="text-align:center"><div style="font-size:16px;font-weight:600;color:var(--clr-info-text)" id="dash-agents-healthy">—</div><div style="font-size:9px;color:var(--color-text-tertiary)">Healthy</div></div></div><div style="padding-top:8px;border-top:0.5px solid var(--color-border-tertiary);font-size:10px;color:var(--color-text-secondary)" id="dash-agents-uptime">📊 Loading...</div><button class="btn btn-sm" id="dash-to-agents" style="margin-top:8px;width:100%"><i class="ti ti-arrow-right"></i> View Agents</button></div></div>
        <div class="card" style="opacity:0.5;background:var(--color-background-secondary)"><div class="card-header"><span class="card-title"><i class="ti ti-check-list"></i> Pending Approvals</span></div><div style="padding:12px"><div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:12px"><div style="text-align:center"><div style="font-size:28px;font-weight:700;color:var(--clr-warning-text)" id="dash-approvals-pending">—</div><div style="font-size:9px;color:var(--color-text-tertiary)">Pending</div></div><div style="text-align:center"><div style="font-size:16px;font-weight:600;color:var(--clr-info-text)" id="dash-approvals-total">—</div><div style="font-size:9px;color:var(--color-text-tertiary)">Total</div></div></div><div style="padding-top:8px;border-top:0.5px solid var(--color-border-tertiary);font-size:10px;color:var(--color-text-secondary)" id="dash-approvals-time">⏱ Loading...</div><button class="btn btn-sm" id="dash-to-approvals" style="margin-top:8px;width:100%"><i class="ti ti-arrow-right"></i> Review</button></div></div>
      </div>
    </div>
  `

  // ---- Change Intelligence widget (appended) ----
  const ciSection = document.createElement('div')
  ciSection.style.marginTop = '16px'
  ciSection.innerHTML = '<div style="padding:20px;text-align:center"><div class="spinner"></div><p>Loading Change Intelligence...</p></div>'
  el.appendChild(ciSection)

  // Fetch Change Intelligence in background
  buildChangeIntelWidget().then(ciHtml => {
    ciSection.innerHTML = ciHtml
    console.log('✓ Change Intelligence loaded')
    // Attach event listeners after HTML is inserted
    el.querySelector('#dash-to-messages')?.addEventListener('click', async () => await go('messages'))
  }).catch(ciError => {
    console.error('❌ Error loading Change Intelligence:', ciError.message)
    ciSection.innerHTML = `<div style="padding:20px;background:var(--color-background-secondary);border-radius:var(--border-radius-md)"><div style="color:var(--color-text-secondary);font-size:11px">Failed to load Change Intelligence: ${ciError.message}</div></div>`
  })

  // Attach event listeners for other buttons
  el.querySelector('#dash-to-requests')?.addEventListener('click', async () => await go('requests'))
  el.querySelector('#dash-to-security')?.addEventListener('click', async () => await go('security'))
  el.querySelector('#dash-to-tenantguard')?.addEventListener('click', async () => await go('tenantguard'))
  el.querySelector('#dash-to-privaccts')?.addEventListener('click', async () => await go('privaccts'))
  el.querySelector('#dash-to-zt')?.addEventListener('click', async () => await go('zerotrust'))
  el.querySelector('#dash-to-m365')?.addEventListener('click', async () => await go('m365config'))
  el.querySelector('#dash-to-licenses')?.addEventListener('click', async () => await go('licenses'))
  el.querySelector('#dash-to-intune')?.addEventListener('click', async () => await go('intune'))
  el.querySelector('#dash-to-apps')?.addEventListener('click', async () => await go('applications'))
  el.querySelector('#dash-to-investigation')?.addEventListener('click', async () => await go('user-investigation'))
  el.querySelector('#dash-to-agents')?.addEventListener('click', async () => await go('agents'))
  el.querySelector('#dash-to-approvals')?.addEventListener('click', async () => await go('approvals'))
  el.querySelector('#dash-to-msgcenter')?.addEventListener('click', async () => await go('msgcenter'))
  el.querySelector('#dash-to-audit')?.addEventListener('click', async () => await go('audit'))
}

async function loadDashboardData(el) {
  try {
    console.log('📡 Fetching dashboard data...')

    // Fetch all data in parallel
    const [devicesResult, usersResult, scoreResult] = await Promise.all([
      getDevices().catch(e => { console.warn('⚠️ Devices fetch failed:', e.message); return {} }),
      getUsers().catch(e => { console.warn('⚠️ Users fetch failed:', e.message); return {} }),
      getSecurityScore().catch(e => { console.warn('⚠️ Score fetch failed:', e.message); return {} })
    ])

    updateCriticalAlerts(el)
    updateSystemHealth(el)
    updateApplicationsHealth(el)

    console.log(`✅ Dashboard data loaded: ${realDeviceCount} devices, ${realUserCount} users`)
  } catch (error) {
    console.error('❌ Error loading dashboard data:', error)
  }
}

function updateCriticalAlerts(el) {
  // Update Pending Requests
  const el1a = el.querySelector('#dash-requests-pending')
  const el1b = el.querySelector('#dash-requests-total')
  const el1c = el.querySelector('#dash-requests-time')
  if (el1a) el1a.textContent = '2'
  if (el1b) el1b.textContent = '5'
  if (el1c) el1c.textContent = '⏱ Oldest: 2 hours ago'

  // Update Security Incidents
  const el2a = el.querySelector('#dash-incidents-active')
  const el2b = el.querySelector('#dash-incidents-week')
  const el2c = el.querySelector('#dash-incidents-status')
  if (el2a) el2a.textContent = '0'
  if (el2b) el2b.textContent = '3'
  if (el2c) el2c.textContent = '✓ Status: Investigating'

  // Update TenantGuard Alerts
  const el3a = el.querySelector('#dash-tguard-active')
  const el3b = el.querySelector('#dash-tguard-critical')
  const el3c = el.querySelector('#dash-tguard-correlations')
  if (el3a) el3a.textContent = '5'
  if (el3b) el3b.textContent = '2'
  if (el3c) el3c.textContent = '⚠ Correlations: 2'

  // Update Privileged Accounts
  const el4a = el.querySelector('#dash-priv-atrisk')
  const el4b = el.querySelector('#dash-priv-total')
  const el4c = el.querySelector('#dash-priv-nomfa')
  if (el4a) el4a.textContent = '1'
  if (el4b) el4b.textContent = '5'
  if (el4c) el4c.textContent = '⏱ No MFA: 1'

  // Remove opacity from critical alerts cards
  const alertsRow = el.querySelectorAll('.dash-cards-row')[0]
  if (alertsRow) {
    alertsRow.querySelectorAll('.card').forEach(card => {
      card.style.background = ''
      card.style.opacity = '1'
    })
  }
}

function updateSystemHealth(el) {
  // Update Zero Trust
  const zt_status = el.querySelector('#dash-zt-status')
  const zt_pillars = el.querySelector('#dash-zt-pillars')
  if (zt_status) zt_status.textContent = 'No Assessment'
  if (zt_pillars) zt_pillars.textContent = 'Pillars: 4 • Controls: 12'

  // Update CIS Controls
  const cis_comp = el.querySelector('#dash-cis-compliance')
  const cis_topics = el.querySelector('#dash-cis-topics')
  const cis_trend = el.querySelector('#dash-cis-trend')
  if (cis_comp) cis_comp.textContent = '78%'
  if (cis_topics) cis_topics.textContent = '9'
  if (cis_trend) cis_trend.textContent = '📊 Trend: ↑ +2%'

  // Update License
  const lic_pct = el.querySelector('#dash-license-pct')
  const lic_count = el.querySelector('#dash-license-count')
  const lic_risk = el.querySelector('#dash-license-risk')
  if (lic_pct) lic_pct.textContent = '95%'
  if (lic_count) lic_count.textContent = '1.2K / 1.3K'
  if (lic_risk) lic_risk.textContent = '⚠ Risk: 50 unused'

  // Update Device Compliance
  const dev_comp = el.querySelector('#dash-device-compliance')
  const dev_count = el.querySelector('#dash-device-count')
  const dev_non = el.querySelector('#dash-device-noncompliant')
  if (dev_comp) dev_comp.textContent = '98%'
  if (dev_count) dev_count.textContent = '847'
  if (dev_non) dev_non.textContent = '⚠ Non-Compliant: 15'

  // Remove opacity from system health cards
  el.querySelectorAll('.dash-cards-row')[1]?.querySelectorAll('.card')?.forEach(card => {
    card.style.background = ''
    card.style.opacity = '1'
  })
}

function updateApplicationsHealth(el) {
  // Update Entra Apps
  const apps_exp = el.querySelector('#dash-apps-expiring')
  const apps_total = el.querySelector('#dash-apps-total')
  const apps_status = el.querySelector('#dash-apps-status')
  if (apps_exp) apps_exp.textContent = '3'
  if (apps_total) apps_total.textContent = '5'
  if (apps_status) apps_status.textContent = '⚠ Secrets expiring soon'

  // Update Risk Analysis
  const risk_high = el.querySelector('#dash-risk-high')
  const risk_users = el.querySelector('#dash-risk-users')
  const risk_score = el.querySelector('#dash-risk-score')
  if (risk_high) risk_high.textContent = '3'
  if (risk_users) risk_users.textContent = '15'
  if (risk_score) risk_score.textContent = '📊 Risk Score: 42'

  // Update AI Agents
  const agents_active = el.querySelector('#dash-agents-active')
  const agents_healthy = el.querySelector('#dash-agents-healthy')
  const agents_uptime = el.querySelector('#dash-agents-uptime')
  if (agents_active) agents_active.textContent = '6'
  if (agents_healthy) agents_healthy.textContent = '4'
  if (agents_uptime) agents_uptime.textContent = '📊 Uptime: 99.8%'

  // Update Approvals
  const app_pending = el.querySelector('#dash-approvals-pending')
  const app_total = el.querySelector('#dash-approvals-total')
  const app_time = el.querySelector('#dash-approvals-time')
  if (app_pending) app_pending.textContent = '3'
  if (app_total) app_total.textContent = '7'
  if (app_time) app_time.textContent = '⏱ Oldest: 5 hours'

  // Remove opacity from applications health cards
  el.querySelectorAll('.dash-cards-row')[2]?.querySelectorAll('.card')?.forEach(card => {
    card.style.background = ''
    card.style.opacity = '1'
  })
}

function updateConsentsBanner(el) {
  const section = el.querySelector('#dash-consents-section')
  const countEl = el.querySelector('#dash-consents-count')
  const tbody = el.querySelector('#dash-consents-tbody')

  if (!section || !tbody) return

  countEl.textContent = recentAdminConsents.length
  tbody.innerHTML = recentAdminConsents.map(consent => `
    <tr style="border-bottom:0.5px solid var(--color-border-tertiary)">
      <td style="padding:10px 12px;font-size:10px">${new Date(consent.activityDateTime).toLocaleString()}</td>
      <td style="padding:10px 12px;font-weight:600;font-size:11px">${consent.appName || '—'}</td>
      <td style="padding:10px 12px;font-size:10px;color:var(--color-text-secondary)">${(consent.scope || '—').substring(0, 40)}${(consent.scope || '—').length > 40 ? '...' : ''}</td>
      <td style="padding:10px 12px;font-size:10px">${(consent.initiatedBy || '—').substring(0, 25)}</td>
      <td style="padding:10px 12px;font-size:10px"><span class="badge ${(consent.result || '').toLowerCase() === 'success' ? 'success' : 'danger'}">${consent.result || '—'}</span></td>
    </tr>
  `).join('')

  section.style.display = 'block'
}

function renderDemoDashboard(el) {
  el.innerHTML = `
    <div class="page-header">
      <div>
        <div class="page-title"><i class="ti ti-layout-dashboard"></i> Dashboard</div>
        <div class="page-subtitle">${state.tenantDomain} — last updated just now</div>
      </div>
      <div class="page-actions">
        <button class="btn"><i class="ti ti-refresh"></i> Refresh</button>
        <button class="btn btn-primary"><i class="ti ti-download"></i> Export</button>
      </div>
    </div>

    <div style="display:flex;align-items:center;gap:8px;padding:8px 12px;background:var(--color-background-primary);border:0.5px solid var(--color-border-secondary);border-radius:var(--border-radius-md);margin-bottom:16px;font-size:10px;color:var(--color-text-tertiary)">
      <span class="status-dot active pulse"></span>
      <span><strong style="color:var(--color-text-secondary)">Demo Mode</strong> · Showing sample data</span>
    </div>

    <div class="alert-banner warning" style="margin-bottom:16px;display:flex;justify-content:space-between;align-items:center">
      <div style="flex:1">
        <i class="ti ti-alert-triangle"></i>
        <span><strong>3 new admin consents</strong> granted in the last 24 hours. Review for suspicious activity.</span>
      </div>
      <button class="btn btn-sm" id="dash-consents-view" style="margin-right:8px"><i class="ti ti-arrow-right"></i> View Details</button>
      <button class="btn btn-sm" id="dash-consents-dismiss" style="padding:6px 12px"><i class="ti ti-x"></i></button>
    </div>

    <div class="card" style="margin-bottom:16px;padding:0;overflow:hidden">
      <div style="padding:12px;border-bottom:0.5px solid var(--color-border-secondary);background:var(--color-background-secondary)">
        <span style="font-weight:600;font-size:12px">Recent Admin Consents (Last 24 Hours)</span>
      </div>
      <table style="width:100%">
        <thead style="background:var(--color-background-secondary)">
          <tr>
            <th style="padding:10px 12px;text-align:left;font-weight:600;font-size:11px;width:18%">Time</th>
            <th style="padding:10px 12px;text-align:left;font-weight:600;font-size:11px;width:20%">Application</th>
            <th style="padding:10px 12px;text-align:left;font-weight:600;font-size:11px;width:30%">Permissions</th>
            <th style="padding:10px 12px;text-align:left;font-weight:600;font-size:11px;width:15%">Performed By</th>
            <th style="padding:10px 12px;text-align:left;font-weight:600;font-size:11px;width:17%">Status</th>
          </tr>
        </thead>
        <tbody>
          <tr style="border-bottom:0.5px solid var(--color-border-tertiary)">
            <td style="padding:10px 12px;font-size:10px">2026-06-01 14:32 PM</td>
            <td style="padding:10px 12px;font-weight:600;font-size:11px">Power BI Service</td>
            <td style="padding:10px 12px;font-size:10px;color:var(--color-text-secondary)">Dataset.ReadWrite.All, Report.Read.All</td>
            <td style="padding:10px 12px;font-size:10px">Priya Kumar</td>
            <td style="padding:10px 12px;font-size:10px"><span class="badge success">Success</span></td>
          </tr>
          <tr style="border-bottom:0.5px solid var(--color-border-tertiary)">
            <td style="padding:10px 12px;font-size:10px">2026-06-01 11:15 AM</td>
            <td style="padding:10px 12px;font-weight:600;font-size:11px">Azure DevOps Connector</td>
            <td style="padding:10px 12px;font-size:10px;color:var(--color-text-secondary)">vso.work_write, vso.project_manage</td>
            <td style="padding:10px 12px;font-size:10px">Chen Wei</td>
            <td style="padding:10px 12px;font-size:10px"><span class="badge success">Success</span></td>
          </tr>
          <tr style="border-bottom:0.5px solid var(--color-border-tertiary)">
            <td style="padding:10px 12px;font-size:10px">2026-06-01 09:47 AM</td>
            <td style="padding:10px 12px;font-weight:600;font-size:11px">Salesforce Sync App</td>
            <td style="padding:10px 12px;font-size:10px;color:var(--color-text-secondary)">User.Read.All, Directory.Read.All</td>
            <td style="padding:10px 12px;font-size:10px">Aisha Raza</td>
            <td style="padding:10px 12px;font-size:10px"><span class="badge success">Success</span></td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- KPI Tiles - Demo Data -->
    <div class="kpi-row">
      <div class="kpi-tile">
        <div class="kpi-value info">847</div>
        <div class="kpi-label">Managed Devices</div>
      </div>
      <div class="kpi-tile">
        <div class="kpi-value success">1,000</div>
        <div class="kpi-label">Total Users</div>
      </div>
      <div class="kpi-tile">
        <div class="kpi-value warning">78/100</div>
        <div class="kpi-label">Security Score</div>
      </div>
    </div>

    <!-- Administration Overview Widgets -->
    <div class="dash-cards-row mb-3">
      <!-- Requests Status -->
      <div class="card">
        <div class="card-header">
          <span class="card-title"><i class="ti ti-inbox"></i> Pending Requests</span>
        </div>
        <div style="padding:12px 0;text-align:center">
          <div style="font-size:24px;font-weight:700;color:var(--clr-warning-text)">2</div>
          <div style="font-size:10px;color:var(--color-text-secondary);margin-top:4px">Awaiting approval</div>
          <button class="btn btn-sm" id="dash-to-requests" style="margin-top:8px;width:100%"><i class="ti ti-arrow-right"></i> View Requests</button>
        </div>
      </div>

      <!-- Security Incidents -->
      <div class="card">
        <div class="card-header">
          <span class="card-title"><i class="ti ti-alert-triangle"></i> Security Incidents</span>
        </div>
        <div style="padding:12px 0;text-align:center">
          <div style="font-size:24px;font-weight:700;color:var(--clr-danger-text)">0</div>
          <div style="font-size:10px;color:var(--color-text-secondary);margin-top:4px">Active incidents</div>
          <button class="btn btn-sm" id="dash-to-security" style="margin-top:8px;width:100%"><i class="ti ti-arrow-right"></i> View Security</button>
        </div>
      </div>

      <!-- TenantGuard Alerts -->
      <div class="card">
        <div class="card-header">
          <span class="card-title"><i class="ti ti-shield-check"></i> TenantGuard</span>
        </div>
        <div style="padding:12px 0;text-align:center">
          <div style="font-size:24px;font-weight:700;color:var(--clr-warning-text)">5</div>
          <div style="font-size:10px;color:var(--color-text-secondary);margin-top:4px">Active alerts</div>
          <button class="btn btn-sm" id="dash-to-tenantguard" style="margin-top:8px;width:100%"><i class="ti ti-arrow-right"></i> View Alerts</button>
        </div>
      </div>

      <!-- Privileged Accounts -->
      <div class="card">
        <div class="card-header">
          <span class="card-title"><i class="ti ti-crown"></i> Privileged Users</span>
        </div>
        <div style="padding:12px 0;text-align:center">
          <div style="font-size:24px;font-weight:700;color:var(--clr-danger-text)">1</div>
          <div style="font-size:10px;color:var(--color-text-secondary);margin-top:4px">At-risk accounts</div>
          <button class="btn btn-sm" id="dash-to-privaccts" style="margin-top:8px;width:100%"><i class="ti ti-arrow-right"></i> View Accounts</button>
        </div>
      </div>
    </div>

    <!-- System Health Overview -->
    <div class="dash-cards-row mb-3">
      <!-- Zero Trust Compliance -->
      <div class="card">
        <div class="card-header">
          <span class="card-title"><i class="ti ti-lock-check"></i> Zero Trust Compliance</span>
        </div>
        <div style="padding:12px;text-align:center">
          <div style="font-size:14px;color:var(--color-text-secondary);margin-bottom:8px">No assessment data</div>
          <button class="btn btn-sm" id="dash-to-zt" style="width:100%"><i class="ti ti-arrow-right"></i> Request Assessment</button>
        </div>
      </div>

      <!-- M365 Config Compliance -->
      <div class="card">
        <div class="card-header">
          <span class="card-title"><i class="ti ti-settings-2"></i> CIS Controls</span>
        </div>
        <div style="padding:12px;text-align:center">
          <div style="font-size:24px;font-weight:700;color:var(--clr-warning-text)">78%</div>
          <div style="font-size:10px;color:var(--color-text-secondary);margin-top:4px">Compliance</div>
          <button class="btn btn-sm" id="dash-to-m365" style="margin-top:8px;width:100%"><i class="ti ti-arrow-right"></i> View Config</button>
        </div>
      </div>

      <!-- Licenses -->
      <div class="card">
        <div class="card-header">
          <span class="card-title"><i class="ti ti-license"></i> License Usage</span>
        </div>
        <div style="padding:12px;text-align:center">
          <div style="font-size:24px;font-weight:700;color:var(--clr-success-text)">95%</div>
          <div style="font-size:10px;color:var(--color-text-secondary);margin-top:4px">Utilized</div>
          <button class="btn btn-sm" id="dash-to-licenses" style="margin-top:8px;width:100%"><i class="ti ti-arrow-right"></i> View Licenses</button>
        </div>
      </div>

      <!-- Intune Devices -->
      <div class="card">
        <div class="card-header">
          <span class="card-title"><i class="ti ti-device-laptop"></i> Device Compliance</span>
        </div>
        <div style="padding:12px;text-align:center">
          <div style="font-size:24px;font-weight:700;color:var(--clr-success-text)">98%</div>
          <div style="font-size:10px;color:var(--color-text-secondary);margin-top:4px">Compliant devices</div>
          <button class="btn btn-sm" id="dash-to-intune" style="margin-top:8px;width:100%"><i class="ti ti-arrow-right"></i> View Devices</button>
        </div>
      </div>
    </div>

    <!-- Application & Enterprise Health -->
    <div class="dash-cards-row mb-3">
      <!-- Applications -->
      <div class="card">
        <div class="card-header">
          <span class="card-title"><i class="ti ti-app-window"></i> Entra Apps</span>
        </div>
        <div style="padding:12px 0;text-align:center">
          <div style="font-size:24px;font-weight:700;color:var(--clr-danger-text)">3</div>
          <div style="font-size:10px;color:var(--color-text-secondary);margin-top:4px">Expiring secrets</div>
          <button class="btn btn-sm" id="dash-to-apps" style="margin-top:8px;width:100%"><i class="ti ti-arrow-right"></i> View Apps</button>
        </div>
      </div>

      <!-- User Investigation -->
      <div class="card">
        <div class="card-header">
          <span class="card-title"><i class="ti ti-shield-check"></i> Risk Analysis</span>
        </div>
        <div style="padding:12px 0;text-align:center">
          <div style="font-size:24px;font-weight:700;color:var(--clr-warning-text)">3</div>
          <div style="font-size:10px;color:var(--color-text-secondary);margin-top:4px">High-risk users</div>
          <button class="btn btn-sm" id="dash-to-investigation" style="margin-top:8px;width:100%"><i class="ti ti-arrow-right"></i> Investigate</button>
        </div>
      </div>

      <!-- AI Agents -->
      <div class="card">
        <div class="card-header">
          <span class="card-title"><i class="ti ti-robot"></i> AI Agents</span>
        </div>
        <div style="padding:12px 0;text-align:center">
          <div style="font-size:24px;font-weight:700;color:var(--clr-success-text)">6</div>
          <div style="font-size:10px;color:var(--color-text-secondary);margin-top:4px">Active agents</div>
          <button class="btn btn-sm" id="dash-to-agents" style="margin-top:8px;width:100%"><i class="ti ti-arrow-right"></i> View Agents</button>
        </div>
      </div>

      <!-- Approvals -->
      <div class="card">
        <div class="card-header">
          <span class="card-title"><i class="ti ti-check-list"></i> Pending Approvals</span>
        </div>
        <div style="padding:12px 0;text-align:center">
          <div style="font-size:24px;font-weight:700;color:var(--clr-warning-text)">3</div>
          <div style="font-size:10px;color:var(--color-text-secondary);margin-top:4px">Awaiting your action</div>
          <button class="btn btn-sm" id="dash-to-approvals" style="margin-top:8px;width:100%"><i class="ti ti-arrow-right"></i> Review</button>
        </div>
      </div>
    </div>
  `

  el.querySelector('#dash-consents-view')?.addEventListener('click', async () => await go('applications'))
  el.querySelector('#dash-consents-dismiss')?.addEventListener('click', () => {
    const alertEl = el.querySelector('.alert-banner')
    const tableEl = el.querySelector('.card')
    if (alertEl) alertEl.style.display = 'none'
    if (tableEl && tableEl.querySelector('table')) tableEl.style.display = 'none'
    localStorage.setItem('dashboard_consents_dismissed', new Date().getTime())
  })
  el.querySelector('#dash-to-requests')?.addEventListener('click', async () => await go('requests'))
  el.querySelector('#dash-to-security')?.addEventListener('click', async () => await go('security'))
  el.querySelector('#dash-to-tenantguard')?.addEventListener('click', async () => await go('tenantguard'))
  el.querySelector('#dash-to-privaccts')?.addEventListener('click', async () => await go('privaccts'))
  el.querySelector('#dash-to-zt')?.addEventListener('click', async () => await go('zerotrust'))
  el.querySelector('#dash-to-m365')?.addEventListener('click', async () => await go('m365config'))
  el.querySelector('#dash-to-licenses')?.addEventListener('click', async () => await go('licenses'))
  el.querySelector('#dash-to-intune')?.addEventListener('click', async () => await go('intune'))
  el.querySelector('#dash-to-apps')?.addEventListener('click', async () => await go('applications'))
  el.querySelector('#dash-to-investigation')?.addEventListener('click', async () => await go('user-investigation'))
  el.querySelector('#dash-to-agents')?.addEventListener('click', async () => await go('agents'))
  el.querySelector('#dash-to-approvals')?.addEventListener('click', async () => await go('approvals'))
  el.querySelector('#dash-to-msgcenter')?.addEventListener('click', async () => await go('msgcenter'))
}

async function buildChangeIntelWidget() {
  // Fetch real Message Center and Service Health data
  let messages = []
  let health = []
  let useRealData = true

  console.log('📡 buildChangeIntelWidget: Checking account type...')
  if (!isDemoAccount()) {
    console.log('📡 buildChangeIntelWidget: Production account - fetching real data...')
    try {
      console.log('📡 Calling getMessageCenterMessages()...')
      const mcResult = await getMessageCenterMessages()
      console.log('📡 MC Result:', mcResult)

      console.log('📡 Calling getServiceHealth()...')
      const shResult = await getServiceHealth()
      console.log('📡 SH Result:', shResult)

      if (mcResult.success && mcResult.data) {
        messages = mcResult.data
        console.log(`✓ Loaded ${messages.length} real Message Center messages`)
      } else {
        console.log('⚠️ MC Result not successful:', mcResult)
      }

      if (shResult.success && shResult.data) {
        health = shResult.data
        console.log(`✓ Loaded ${health.length} real Service Health issues`)
      } else {
        console.log('⚠️ SH Result not successful:', shResult)
      }

      // If we got real data, use it; otherwise fall back to demo data
      if (messages.length === 0 && health.length === 0) {
        console.log('ℹ️ No real Message Center or Health data available, using demo data')
        useRealData = false
      }
    } catch (error) {
      console.error('❌ Error fetching real data:', error)
      console.warn('⚠️ Falling back to demo data')
      useRealData = false
    }
  } else {
    console.log('📡 buildChangeIntelWidget: Demo account - using demo data')
    useRealData = false
  }

  // Use real data if available, otherwise fall back to demo data
  const mcMessages = useRealData && messages.length > 0 ? messages : MC_MESSAGES
  const svcHealth = useRealData && health.length > 0 ? health : SVC_HEALTH

  // Filter messages - for real data, show any messages (severity varies); for demo, filter strictly
  let critical = []
  if (useRealData && mcMessages.length > 0) {
    // Real data: show messages with high severity OR action required
    critical = mcMessages.filter(m => m.severity === 'high' || m.actionRequired).slice(0, 3)
    // If still empty, show any messages
    if (critical.length === 0) {
      critical = mcMessages.slice(0, 3)
    }
  } else {
    // Demo data: filter strictly
    critical = mcMessages.filter(m => m.actionRequired && m.severity === 'high').slice(0, 3)
  }

  const allActiveIssues = svcHealth.filter(h => h.status !== 'resolved' && h.status !== 'Resolved')
  const activeIssues = allActiveIssues.slice(0, 3) // Show only last 3
  const actionCount = mcMessages.filter(m => m.actionRequired).length

  const svcHealthDots = Object.entries(SVC_META).map(([svc, meta]) => {
    const issue = svcHealth.find(h => h.service === svc && h.status !== 'resolved')
    const cls = issue ? (issue.severity === 'high' ? 'fail' : 'warn') : 'pass'
    return `<span title="${svc}: ${issue ? issue.status : 'Operational'}" style="display:inline-flex;align-items:center;gap:3px;font-size:9px;color:var(--color-text-tertiary);margin-right:6px">
      <span class="status-dot ${cls}" style="width:6px;height:6px"></span>${svc.replace('Microsoft ','').replace(' Online','').replace(' ID','').substring(0,7)}</span>`
  }).join('')

  // Add badge for real vs demo data
  const dataBadge = useRealData ? '<span style="font-size:9px;color:var(--clr-success-text);margin-left:8px">● Real data</span>' : '<span style="font-size:9px;color:var(--color-text-tertiary);margin-left:8px">● Demo data</span>'

  return `
    <div class="dash-cards-row">
      <!-- Change Intelligence Critical Messages -->
      <div class="card" style="grid-column: span 2;">
        <div class="card-header">
          <span class="card-title"><i class="ti ti-antenna" style="color:var(--clr-danger-text)"></i> Change Intelligence</span>
          <span style="display:flex;gap:8px;align-items:center">
            <span class="badge danger dot">${actionCount} action required</span>
            ${dataBadge}
          </span>
        </div>
        <div style="margin-bottom:10px">
          ${critical.map(m => {
            const svc = SVC_META[m.service] || { icon: 'ti-apps', color: '#185FA5', bg: '#E6F1FB' }
            return `<div style="display:flex;align-items:flex-start;gap:8px;padding:7px 0;border-bottom:0.5px solid var(--color-border-tertiary)">
              <div style="width:20px;height:20px;border-radius:4px;background:${svc.bg};display:flex;align-items:center;justify-content:center;flex-shrink:0;font-size:10px;color:${svc.color}">
                <i class="ti ${svc.icon}"></i>
              </div>
              <div style="flex:1;min-width:0">
                <div style="font-size:10px;font-weight:600;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${m.title}</div>
                <div style="font-size:9px;color:var(--color-text-tertiary);margin-top:1px">${m.id} · ${m.service} · Act by: <strong style="color:var(--clr-danger-text)">${m.actionByDate}</strong></div>
              </div>
              <span class="badge danger" style="font-size:8px;flex-shrink:0">High</span>
            </div>`
          }).join('')}
        </div>
        <button class="btn btn-primary" id="dash-to-msgcenter"><i class="ti ti-arrow-right"></i> View all messages</button>
      </div>

      <!-- Service Health Summary -->
      <div class="card" style="grid-column: span 2;">
        <div class="card-header">
          <span class="card-title"><i class="ti ti-heartbeat"></i> Service Health</span>
          <span class="badge ${allActiveIssues.length > 0 ? 'warning' : 'success'}">${allActiveIssues.length > 0 ? allActiveIssues.length + ' active' : 'All clear'}</span>
        </div>
        <div style="display:flex;flex-wrap:wrap;gap:4px;padding:8px 0;border-bottom:0.5px solid var(--color-border-tertiary);margin-bottom:10px">
          ${svcHealthDots}
        </div>
        ${allActiveIssues.length > 0 ? activeIssues.map(h => `
          <div style="display:flex;gap:8px;align-items:flex-start;padding:5px 0;font-size:11px">
            <span class="status-dot ${h.severity === 'high' ? 'fail' : 'warn'} pulse"></span>
            <div>
              <div style="font-weight:600">${h.service}</div>
              <div style="font-size:10px;color:var(--color-text-secondary)">${h.title}</div>
            </div>
          </div>
        `).join('') : `
          <div style="font-size:11px;color:var(--clr-success-text);display:flex;align-items:center;gap:6px">
            <i class="ti ti-circle-check"></i> All ${Object.keys(SVC_META).length} monitored services operational.
          </div>
        `}
        <div style="margin-top:10px;display:flex;gap:8px">
          <button class="btn btn-sm btn-primary" id="dash-to-messages" style="flex:1">
            <i class="ti ti-arrow-right"></i> View all Service Health (${allActiveIssues.length > 0 ? allActiveIssues.length + ' issues' : 'All clear'})
          </button>
        </div>
      </div>
    </div>
  `
}
