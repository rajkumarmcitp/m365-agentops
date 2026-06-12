import { go, state } from '../app.js'
import { getDevices, getUsers, getSecurityScore, callAPI } from '../lib/api-client.js'
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

  el.innerHTML = `<div style="padding:20px;text-align:center"><div class="spinner"></div><p>Loading dashboard data...</p></div>`

  // Fetch real data
  try {
    console.log('📡 Fetching real dashboard data from backend...')
    const devicesResult = await getDevices()
    const usersResult = await getUsers()
    const scoreResult = await getSecurityScore()

    // Set real counts (no fallback)
    realDeviceCount = (devicesResult.success && devicesResult.count) ? devicesResult.count : 0
    realUserCount = (usersResult.success && usersResult.count) ? usersResult.count : 0
    realSecureScore = scoreResult.success ? scoreResult.data : null

    // Fetch recent admin consents (last 24 hours)
    try {
      const consentsResult = await callAPI('/audit-logs/consents')
      if (consentsResult.success && consentsResult.data) {
        const now = new Date()
        const last24hrs = new Date(now.getTime() - 24 * 60 * 60 * 1000)
        recentAdminConsents = consentsResult.data
          .filter(c => new Date(c.activityDateTime) >= last24hrs)
          .sort((a, b) => new Date(b.activityDateTime) - new Date(a.activityDateTime))
          .slice(0, 5)
        console.log(`✅ Loaded ${recentAdminConsents.length} recent admin consents (last 24 hours)`)
      }
    } catch (error) {
      console.warn('⚠️ Could not fetch recent admin consents:', error.message)
    }

    console.log(`✅ Loaded dashboard data: ${realDeviceCount} devices, ${realUserCount} users`)
  } catch (error) {
    console.error('❌ Error loading dashboard data:', error)
  }

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

    <!-- Recent Admin Consents Alert -->
    ${recentAdminConsents.length > 0 && !isDismissedRecently() ? `
    <div class="alert-banner warning" style="margin-bottom:16px;display:flex;justify-content:space-between;align-items:center">
      <div style="flex:1">
        <i class="ti ti-alert-triangle"></i>
        <span><strong>${recentAdminConsents.length} new admin consent${recentAdminConsents.length !== 1 ? 's' : ''}</strong> granted in the last 24 hours. Review for suspicious activity.</span>
      </div>
      <button class="btn btn-sm" id="dash-consents-view" style="margin-right:8px"><i class="ti ti-arrow-right"></i> View Details</button>
      <button class="btn btn-sm" id="dash-consents-dismiss" style="padding:6px 12px"><i class="ti ti-x"></i></button>
    </div>

    <!-- Recent Admin Consents Table -->
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
          ${recentAdminConsents.map(consent => `
            <tr style="border-bottom:0.5px solid var(--color-border-tertiary)">
              <td style="padding:10px 12px;font-size:10px">${new Date(consent.activityDateTime).toLocaleString()}</td>
              <td style="padding:10px 12px;font-weight:600;font-size:11px">${consent.appName || '—'}</td>
              <td style="padding:10px 12px;font-size:10px;color:var(--color-text-secondary)">${(consent.scope || '—').substring(0, 40)}${(consent.scope || '—').length > 40 ? '...' : ''}</td>
              <td style="padding:10px 12px;font-size:10px">${(consent.initiatedBy || '—').substring(0, 25)}</td>
              <td style="padding:10px 12px;font-size:10px"><span class="badge ${(consent.result || '').toLowerCase() === 'success' ? 'success' : 'danger'}">${consent.result || '—'}</span></td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>
    ` : ''}

    <!-- KPI Tiles - Real Data Only -->
    <div class="kpi-row">
      <div class="kpi-tile">
        <div class="kpi-value info">${realDeviceCount}</div>
        <div class="kpi-label">Managed Devices</div>
      </div>
      <div class="kpi-tile">
        <div class="kpi-value success">${realUserCount}</div>
        <div class="kpi-label">Total Users</div>
      </div>
      ${realSecureScore ? `<div class="kpi-tile">
        <div class="kpi-value warning">${realSecureScore.overallScore || 0}/100</div>
        <div class="kpi-label">Security Score</div>
      </div>` : ''}
    </div>

    <!-- 📊 Critical Alerts Section -->
    <div style="margin-bottom:16px">
      <div style="font-size:13px;font-weight:700;color:var(--color-text-primary);margin-bottom:12px"><i class="ti ti-alert-triangle"></i> Critical Alerts</div>
      <div class="dash-cards-row mb-3">
        <div class="card"><div class="card-header"><span class="card-title"><i class="ti ti-inbox"></i> Pending Requests</span></div><div style="padding:12px"><div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:12px"><div style="text-align:center"><div style="font-size:20px;font-weight:700;color:var(--clr-warning-text)">2</div><div style="font-size:9px;color:var(--color-text-tertiary)">Pending</div></div><div style="text-align:center"><div style="font-size:16px;font-weight:600;color:var(--clr-info-text)">5</div><div style="font-size:9px;color:var(--color-text-tertiary)">Total</div></div></div><div style="padding-top:8px;border-top:0.5px solid var(--color-border-tertiary);font-size:10px;color:var(--color-text-secondary)">⏱ Oldest: 2 hours ago</div><button class="btn btn-sm" id="dash-to-requests" style="margin-top:8px;width:100%"><i class="ti ti-arrow-right"></i> View Requests</button></div></div>
        <div class="card"><div class="card-header"><span class="card-title"><i class="ti ti-alert-triangle"></i> Security Incidents</span></div><div style="padding:12px"><div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:12px"><div style="text-align:center"><div style="font-size:20px;font-weight:700;color:var(--clr-success-text)">0</div><div style="font-size:9px;color:var(--color-text-tertiary)">Active</div></div><div style="text-align:center"><div style="font-size:16px;font-weight:600;color:var(--clr-info-text)">3</div><div style="font-size:9px;color:var(--color-text-tertiary)">This Week</div></div></div><div style="padding-top:8px;border-top:0.5px solid var(--color-border-tertiary);font-size:10px;color:var(--color-text-secondary)">✓ Status: Investigating</div><button class="btn btn-sm" id="dash-to-security" style="margin-top:8px;width:100%"><i class="ti ti-arrow-right"></i> View Security</button></div></div>
        <div class="card"><div class="card-header"><span class="card-title"><i class="ti ti-shield-check"></i> TenantGuard Alerts</span></div><div style="padding:12px"><div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:12px"><div style="text-align:center"><div style="font-size:20px;font-weight:700;color:var(--clr-warning-text)">5</div><div style="font-size:9px;color:var(--color-text-tertiary)">Active</div></div><div style="text-align:center"><div style="font-size:16px;font-weight:600;color:var(--clr-danger-text)">2</div><div style="font-size:9px;color:var(--color-text-tertiary)">Critical</div></div></div><div style="padding-top:8px;border-top:0.5px solid var(--color-border-tertiary);font-size:10px;color:var(--color-text-secondary)">⚠ Correlations: 2</div><button class="btn btn-sm" id="dash-to-tenantguard" style="margin-top:8px;width:100%"><i class="ti ti-arrow-right"></i> View Alerts</button></div></div>
        <div class="card"><div class="card-header"><span class="card-title"><i class="ti ti-crown"></i> Privileged Accounts</span></div><div style="padding:12px"><div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:12px"><div style="text-align:center"><div style="font-size:20px;font-weight:700;color:var(--clr-danger-text)">1</div><div style="font-size:9px;color:var(--color-text-tertiary)">At-Risk</div></div><div style="text-align:center"><div style="font-size:16px;font-weight:600;color:var(--clr-info-text)">5</div><div style="font-size:9px;color:var(--color-text-tertiary)">Total</div></div></div><div style="padding-top:8px;border-top:0.5px solid var(--color-border-tertiary);font-size:10px;color:var(--color-text-secondary)">⏱ No MFA: 1</div><button class="btn btn-sm" id="dash-to-privaccts" style="margin-top:8px;width:100%"><i class="ti ti-arrow-right"></i> View Accounts</button></div></div>
      </div>
    </div>

    <!-- 🏥 System Health Overview -->
    <div style="margin-bottom:16px">
      <div style="font-size:13px;font-weight:700;color:var(--color-text-primary);margin-bottom:12px"><i class="ti ti-heartbeat"></i> System Health Overview</div>
      <div class="dash-cards-row mb-3">
        <div class="card"><div class="card-header"><span class="card-title"><i class="ti ti-lock-check"></i> Zero Trust Compliance</span></div><div style="padding:12px"><div style="text-align:center;margin-bottom:12px"><div style="font-size:16px;color:var(--color-text-secondary)">No Assessment</div></div><div style="padding:8px;background:var(--color-background-secondary);border-radius:var(--border-radius-sm);text-align:center"><div style="font-size:10px;color:var(--color-text-secondary)">Pillars: 4 • Controls: 12</div></div><button class="btn btn-sm" id="dash-to-zt" style="margin-top:8px;width:100%"><i class="ti ti-arrow-right"></i> Request Assessment</button></div></div>
        <div class="card"><div class="card-header"><span class="card-title"><i class="ti ti-settings-2"></i> CIS Controls</span></div><div style="padding:12px"><div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:12px"><div style="text-align:center"><div style="font-size:20px;font-weight:700;color:var(--clr-warning-text)">78%</div><div style="font-size:9px;color:var(--color-text-tertiary)">Compliance</div></div><div style="text-align:center"><div style="font-size:16px;font-weight:600;color:var(--clr-info-text)">9</div><div style="font-size:9px;color:var(--color-text-tertiary)">Topics</div></div></div><div style="padding-top:8px;border-top:0.5px solid var(--color-border-tertiary);font-size:10px;color:var(--color-text-secondary)">📊 Trend: ↑ +2%</div><button class="btn btn-sm" id="dash-to-m365" style="margin-top:8px;width:100%"><i class="ti ti-arrow-right"></i> View Config</button></div></div>
        <div class="card"><div class="card-header"><span class="card-title"><i class="ti ti-license"></i> License Utilization</span></div><div style="padding:12px"><div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:12px"><div style="text-align:center"><div style="font-size:20px;font-weight:700;color:var(--clr-success-text)">95%</div><div style="font-size:9px;color:var(--color-text-tertiary)">Utilized</div></div><div style="text-align:center"><div style="font-size:16px;font-weight:600;color:var(--clr-info-text)">1.2K</div><div style="font-size:9px;color:var(--color-text-tertiary)">Of 1.3K</div></div></div><div style="padding-top:8px;border-top:0.5px solid var(--color-border-tertiary);font-size:10px;color:var(--color-text-secondary)">⚠ Risk: 50 unused</div><button class="btn btn-sm" id="dash-to-licenses" style="margin-top:8px;width:100%"><i class="ti ti-arrow-right"></i> View Licenses</button></div></div>
        <div class="card"><div class="card-header"><span class="card-title"><i class="ti ti-device-laptop"></i> Device Compliance</span></div><div style="padding:12px"><div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:12px"><div style="text-align:center"><div style="font-size:20px;font-weight:700;color:var(--clr-success-text)">98%</div><div style="font-size:9px;color:var(--color-text-tertiary)">Compliant</div></div><div style="text-align:center"><div style="font-size:16px;font-weight:600;color:var(--clr-info-text)">847</div><div style="font-size:9px;color:var(--color-text-tertiary)">Devices</div></div></div><div style="padding-top:8px;border-top:0.5px solid var(--color-border-tertiary);font-size:10px;color:var(--color-text-secondary)">⚠ Non-Compliant: 15</div><button class="btn btn-sm" id="dash-to-intune" style="margin-top:8px;width:100%"><i class="ti ti-arrow-right"></i> View Devices</button></div></div>
      </div>
    </div>

    <!-- 🚀 Applications & Enterprise Health -->
    <div style="margin-bottom:16px">
      <div style="font-size:13px;font-weight:700;color:var(--color-text-primary);margin-bottom:12px"><i class="ti ti-rocket"></i> Applications & Enterprise Health</div>
      <div class="dash-cards-row mb-3">
        <div class="card"><div class="card-header"><span class="card-title"><i class="ti ti-app-window"></i> Entra Apps</span></div><div style="padding:12px"><div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:12px"><div style="text-align:center"><div style="font-size:20px;font-weight:700;color:var(--clr-danger-text)">3</div><div style="font-size:9px;color:var(--color-text-tertiary)">Expiring</div></div><div style="text-align:center"><div style="font-size:16px;font-weight:600;color:var(--clr-info-text)">5</div><div style="font-size:9px;color:var(--color-text-tertiary)">Total</div></div></div><div style="padding-top:8px;border-top:0.5px solid var(--color-border-tertiary);font-size:10px;color:var(--color-text-secondary)">⚠ Secrets expiring soon</div><button class="btn btn-sm" id="dash-to-apps" style="margin-top:8px;width:100%"><i class="ti ti-arrow-right"></i> View Apps</button></div></div>
        <div class="card"><div class="card-header"><span class="card-title"><i class="ti ti-shield-check"></i> Risk Analysis</span></div><div style="padding:12px"><div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:12px"><div style="text-align:center"><div style="font-size:20px;font-weight:700;color:var(--clr-warning-text)">3</div><div style="font-size:9px;color:var(--color-text-tertiary)">High-Risk</div></div><div style="text-align:center"><div style="font-size:16px;font-weight:600;color:var(--clr-info-text)">15</div><div style="font-size:9px;color:var(--color-text-tertiary)">Users</div></div></div><div style="padding-top:8px;border-top:0.5px solid var(--color-border-tertiary);font-size:10px;color:var(--color-text-secondary)">📊 Risk Score: 42</div><button class="btn btn-sm" id="dash-to-investigation" style="margin-top:8px;width:100%"><i class="ti ti-arrow-right"></i> Investigate</button></div></div>
        <div class="card"><div class="card-header"><span class="card-title"><i class="ti ti-robot"></i> AI Agents</span></div><div style="padding:12px"><div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:12px"><div style="text-align:center"><div style="font-size:20px;font-weight:700;color:var(--clr-success-text)">6</div><div style="font-size:9px;color:var(--color-text-tertiary)">Active</div></div><div style="text-align:center"><div style="font-size:16px;font-weight:600;color:var(--clr-info-text)">4</div><div style="font-size:9px;color:var(--color-text-tertiary)">Healthy</div></div></div><div style="padding-top:8px;border-top:0.5px solid var(--color-border-tertiary);font-size:10px;color:var(--color-text-secondary)">📊 Uptime: 99.8%</div><button class="btn btn-sm" id="dash-to-agents" style="margin-top:8px;width:100%"><i class="ti ti-arrow-right"></i> View Agents</button></div></div>
        <div class="card"><div class="card-header"><span class="card-title"><i class="ti ti-check-list"></i> Pending Approvals</span></div><div style="padding:12px"><div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:12px"><div style="text-align:center"><div style="font-size:20px;font-weight:700;color:var(--clr-warning-text)">3</div><div style="font-size:9px;color:var(--color-text-tertiary)">Pending</div></div><div style="text-align:center"><div style="font-size:16px;font-weight:600;color:var(--clr-info-text)">7</div><div style="font-size:9px;color:var(--color-text-tertiary)">Total</div></div></div><div style="padding-top:8px;border-top:0.5px solid var(--color-border-tertiary);font-size:10px;color:var(--color-text-secondary)">⏱ Oldest: 5 hours</div><button class="btn btn-sm" id="dash-to-approvals" style="margin-top:8px;width:100%"><i class="ti ti-arrow-right"></i> Review</button></div></div>
      </div>
    </div>
  `

  // ---- Change Intelligence widget (appended) ----
  const ciSection = document.createElement('div')
  ciSection.style.marginTop = '16px'
  ciSection.innerHTML = buildChangeIntelWidget()
  el.querySelector('#page-dashboard-inner') || el.appendChild(ciSection)

  el.querySelector('#dash-to-msgcenter-health')?.addEventListener('click', async () => await go('msgcenter'))
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
  el.querySelector('#dash-to-msgcenter')?.addEventListener('click', async () => await go('msgcenter'))

  // Recent admin consents actions
  el.querySelector('#dash-consents-view')?.addEventListener('click', async () => await go('applications'))
  el.querySelector('#dash-consents-dismiss')?.addEventListener('click', () => {
    const alertEl = el.querySelector('.alert-banner')
    const tableEl = el.querySelector('.card')
    if (alertEl) alertEl.style.display = 'none'
    if (tableEl && tableEl.querySelector('table')) tableEl.style.display = 'none'
    localStorage.setItem('dashboard_consents_dismissed', new Date().getTime())
  })
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

function buildChangeIntelWidget() {
  const critical = MC_MESSAGES.filter(m => m.actionRequired && m.severity === 'high').slice(0, 3)
  const activeIssues = SVC_HEALTH.filter(h => h.status !== 'resolved')
  const actionCount = MC_MESSAGES.filter(m => m.actionRequired).length

  const svcHealthDots = Object.entries(SVC_META).map(([svc, meta]) => {
    const issue = SVC_HEALTH.find(h => h.service === svc && h.status !== 'resolved')
    const cls = issue ? (issue.severity === 'high' ? 'fail' : 'warn') : 'pass'
    return `<span title="${svc}: ${issue ? issue.status : 'Operational'}" style="display:inline-flex;align-items:center;gap:3px;font-size:9px;color:var(--color-text-tertiary);margin-right:6px">
      <span class="status-dot ${cls}" style="width:6px;height:6px"></span>${svc.replace('Microsoft ','').replace(' Online','').replace(' ID','').substring(0,7)}</span>`
  }).join('')

  return `
    <div class="dash-cards-row">
      <!-- Change Intelligence Critical Messages -->
      <div class="card">
        <div class="card-header">
          <span class="card-title"><i class="ti ti-antenna" style="color:var(--clr-danger-text)"></i> Change Intelligence</span>
          <span class="badge danger dot">${actionCount} action required</span>
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
      <div class="card">
        <div class="card-header">
          <span class="card-title"><i class="ti ti-heartbeat"></i> Service Health</span>
          <span class="badge ${activeIssues.length > 0 ? 'warning' : 'success'}">${activeIssues.length > 0 ? activeIssues.length + ' active' : 'All clear'}</span>
        </div>
        <div style="display:flex;flex-wrap:wrap;gap:4px;padding:8px 0;border-bottom:0.5px solid var(--color-border-tertiary);margin-bottom:10px">
          ${svcHealthDots}
        </div>
        ${activeIssues.length > 0 ? activeIssues.map(h => `
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
        <div style="margin-top:10px">
          <button class="btn btn-sm" id="dash-to-msgcenter-health">
            <i class="ti ti-heartbeat"></i> Service Health
          </button>
        </div>
      </div>
    </div>
  `
}
