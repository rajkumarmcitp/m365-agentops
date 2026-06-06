import { go } from '../app.js'
import { getDevices, getUsers, getSecurityScore, api } from '../lib/api-client.js'
import { MC_MESSAGES, SVC_HEALTH, SVC_META } from '../data/msgcenter-data.js'

let realDeviceCount = 0
let realUserCount = 0
let realSecureScore = null
let recentConsents = []

export async function initDashboard() {
  const el = document.getElementById('page-dashboard')
  if (!el) return

  el.innerHTML = `<div style="padding:20px;text-align:center"><div class="spinner"></div><p>Loading dashboard data...</p></div>`

  // Fetch real data
  try {
    console.log('📡 Fetching real dashboard data from backend...')
    const devicesResult = await getDevices()
    const usersResult = await getUsers()
    const scoreResult = await getSecurityScore()

    // Fetch recent consents
    try {
      const consentsRes = await fetch(`${api}/recent-consents`)
      const consentsData = await consentsRes.json()
      if (consentsData.success) {
        recentConsents = consentsData.data || []
      }
    } catch (e) {
      console.warn('⚠️ Failed to fetch recent consents:', e.message)
    }

    // Set real counts with fallback
    realDeviceCount = (devicesResult.success && devicesResult.count) ? devicesResult.count : 847
    realUserCount = (usersResult.success && usersResult.count) ? usersResult.count : 1000
    realSecureScore = scoreResult.success ? scoreResult.data : null

    console.log(`✅ Loaded dashboard data: ${realDeviceCount} devices, ${realUserCount} users, ${recentConsents.length} recent consents`)
  } catch (error) {
    console.error('❌ Error loading dashboard data:', error)
  }

  el.innerHTML = `
    <div class="page-header">
      <div>
        <div class="page-title"><i class="ti ti-layout-dashboard"></i> Dashboard</div>
        <div class="page-subtitle">Contoso.com — last updated just now</div>
      </div>
      <div class="page-actions">
        <button class="btn"><i class="ti ti-refresh"></i> Refresh</button>
        <button class="btn btn-primary"><i class="ti ti-download"></i> Export</button>
      </div>
    </div>

    <!-- Recent Admin Consents Table Alert -->
    ${recentConsents.length > 0 ? `
      <div id="recent-consents-alert" style="margin-bottom:16px">
        <div class="card">
          <div class="card-header" style="display:flex;align-items:center;justify-content:space-between">
            <span class="card-title"><i class="ti ti-alert-circle"></i> Recent Admin Consents</span>
            <button style="background:none;border:none;cursor:pointer;font-size:18px;padding:0" onclick="document.getElementById('recent-consents-alert').style.display='none'">✕</button>
          </div>
          <table style="width:100%">
            <thead><tr style="background:var(--color-background-secondary)">
              <th style="padding:10px 12px;text-align:left;font-weight:600;font-size:11px;width:30%">Application</th>
              <th style="padding:10px 12px;text-align:left;font-weight:600;font-size:11px;width:20%">Scope</th>
              <th style="padding:10px 12px;text-align:left;font-weight:600;font-size:11px;width:50%">Permissions</th>
            </tr></thead>
            <tbody>
              ${recentConsents.map(consent => `
                <tr style="border-bottom:0.5px solid var(--color-border-tertiary);background:rgba(250, 190, 88, 0.05)">
                  <td style="padding:10px 12px;font-weight:600;font-size:11px">${consent.appName}</td>
                  <td style="padding:10px 12px;font-size:10px"><span class="badge warning">${consent.scope}</span></td>
                  <td style="padding:10px 12px;font-size:10px;color:var(--color-text-secondary)">${consent.permissions}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>
    ` : ''}

    <!-- KPI Tiles -->
    <div class="kpi-row">
      <div class="kpi-tile">
        <div class="kpi-value info">7</div>
        <div class="kpi-label">Pending Requests</div>
      </div>
      <div class="kpi-tile">
        <div class="kpi-value danger">3</div>
        <div class="kpi-label">Risky Users</div>
      </div>
      <div class="kpi-tile">
        <div class="kpi-value warning">14</div>
        <div class="kpi-label">Privileged Accounts</div>
      </div>
      <div class="kpi-tile">
        <div class="kpi-value warning">7/12</div>
        <div class="kpi-label">Zero Trust Score</div>
      </div>
      <div class="kpi-tile">
        <div class="kpi-value warning">78%</div>
        <div class="kpi-label">M365 Config Score</div>
      </div>
    </div>

    <!-- Row 1 -->
    <div class="dash-cards-row mb-3">
      <!-- Pending Approvals snapshot -->
      <div class="card">
        <div class="card-header">
          <span class="card-title"><i class="ti ti-check-list"></i> Pending Approvals</span>
          <span class="badge danger dot">3 pending</span>
        </div>
        <table>
          <thead><tr>
            <th style="width:35%">Requestor</th>
            <th style="width:30%">Type</th>
            <th style="width:20%">SLA</th>
            <th style="width:15%">Status</th>
          </tr></thead>
          <tbody>
            <tr>
              <td>Priya Kumar</td>
              <td>Distribution Group</td>
              <td>2h left</td>
              <td><span class="badge warning dot">Pending</span></td>
            </tr>
            <tr>
              <td>James Liu</td>
              <td>MFA Reset</td>
              <td class="sla-overdue">Overdue</td>
              <td><span class="badge danger dot">Overdue</span></td>
            </tr>
            <tr>
              <td>Sara Ogden</td>
              <td>SharePoint Access</td>
              <td>4h left</td>
              <td><span class="badge warning dot">Pending</span></td>
            </tr>
          </tbody>
        </table>
        <div style="margin-top:12px">
          <button class="btn btn-primary" id="dash-to-requests"><i class="ti ti-arrow-right"></i> View all requests</button>
        </div>
      </div>

      <!-- M365 Config snapshot -->
      <div class="card">
        <div class="card-header">
          <span class="card-title"><i class="ti ti-settings-2"></i> M365 Config — CIS Controls</span>
          <span class="badge warning dot">78% compliant</span>
        </div>
        <table>
          <thead><tr>
            <th style="width:20%">Control</th>
            <th style="width:45%">Title</th>
            <th style="width:20%">Status</th>
            <th style="width:15%">Type</th>
          </tr></thead>
          <tbody>
            <tr>
              <td class="monospace">1.1.4</td>
              <td>Security Defaults disabled</td>
              <td><span class="badge danger">Failed</span></td>
              <td><span class="badge info">Auto</span></td>
            </tr>
            <tr>
              <td class="monospace">5.2.2.5</td>
              <td>Device compliance CA policy</td>
              <td><span class="badge danger">Failed</span></td>
              <td><span class="badge info">Auto</span></td>
            </tr>
            <tr>
              <td class="monospace">2.1.3</td>
              <td>Safe Attachments enabled</td>
              <td><span class="badge danger">Failed</span></td>
              <td><span class="badge info">Auto</span></td>
            </tr>
            <tr>
              <td class="monospace">1.2.1</td>
              <td>M365 Groups creation</td>
              <td><span class="badge warning">Warning</span></td>
              <td><span class="badge info">Auto</span></td>
            </tr>
            <tr>
              <td class="monospace">5.1.2.1</td>
              <td>Security Defaults status</td>
              <td><span class="badge warning">Warning</span></td>
              <td><span class="badge info">Auto</span></td>
            </tr>
          </tbody>
        </table>
        <div style="margin-top:12px">
          <button class="btn btn-primary" id="dash-to-m365"><i class="ti ti-arrow-right"></i> View M365 Config</button>
        </div>
      </div>
    </div>

    <!-- Row 2 -->
    <div class="dash-cards-row">
      <!-- Zero Trust snapshot -->
      <div class="card">
        <div class="card-header">
          <span class="card-title"><i class="ti ti-lock-check"></i> Zero Trust Score</span>
          <span class="badge warning dot">7/12 passed</span>
        </div>
        <div style="margin-bottom:12px">
          <div class="seg-bar" style="height:10px;border-radius:5px">
            <div class="seg pass" style="width:58%"></div>
            <div class="seg warn" style="width:25%"></div>
            <div class="seg fail" style="width:17%"></div>
          </div>
          <div style="display:flex;gap:16px;margin-top:6px">
            <span style="font-size:10px;color:var(--clr-success-text)">● 7 Pass</span>
            <span style="font-size:10px;color:var(--clr-warning-text)">● 3 Warn</span>
            <span style="font-size:10px;color:var(--clr-danger-text)">● 2 Fail</span>
          </div>
        </div>
        <table>
          <thead><tr>
            <th style="width:40%">Control</th>
            <th style="width:30%">Pillar</th>
            <th style="width:30%">Status</th>
          </tr></thead>
          <tbody>
            <tr>
              <td>Legacy Auth Blocked</td>
              <td>Identity</td>
              <td><span class="badge danger dot">Failed</span></td>
            </tr>
            <tr>
              <td>Device Risk CA</td>
              <td>Device</td>
              <td><span class="badge danger dot">Failed</span></td>
            </tr>
            <tr>
              <td>MFA Coverage</td>
              <td>Identity</td>
              <td><span class="badge warning dot">Warning</span></td>
            </tr>
            <tr>
              <td>PIM Assignments</td>
              <td>Priv. Access</td>
              <td><span class="badge warning dot">Warning</span></td>
            </tr>
          </tbody>
        </table>
        <div style="margin-top:12px">
          <button class="btn btn-primary" id="dash-to-zt"><i class="ti ti-arrow-right"></i> View Zero Trust</button>
        </div>
      </div>

      <!-- Audit events -->
      <div class="card">
        <div class="card-header">
          <span class="card-title"><i class="ti ti-activity"></i> Recent Audit Events</span>
          <button class="btn btn-sm" id="dash-to-audit">View all</button>
        </div>
        <div style="display:flex;flex-direction:column;gap:10px">
          ${[
            { dot: 'var(--clr-danger-text)',  msg: 'High-risk user sign-in detected — kevin.osei@contoso.com', time: '14 min ago' },
            { dot: 'var(--clr-warning-text)', msg: 'MFA registration incomplete — 3 users below policy threshold', time: '1 hour ago' },
            { dot: 'var(--clr-info-text)',    msg: 'Config scan completed — 4 new failures found', time: '08:45 today' },
          ].map(e => `
            <div style="display:flex;align-items:flex-start;gap:10px;padding-bottom:10px;border-bottom:0.5px solid var(--color-border-tertiary)">
              <div class="dash-event-dot" style="background:${e.dot};margin-top:5px"></div>
              <div style="flex:1">
                <div style="font-size:11px;color:var(--color-text-primary);line-height:1.4">${e.msg}</div>
                <div style="font-size:10px;color:var(--color-text-tertiary);margin-top:2px">${e.time}</div>
              </div>
            </div>
          `).join('')}
        </div>
        <div style="margin-top:4px;padding-top:12px">
          <div class="card-title" style="margin-bottom:10px"><i class="ti ti-crown"></i> Privileged Account Alerts</div>
          <div class="alert-banner danger">
            <i class="ti ti-alert-triangle"></i>
            2 privileged accounts have active risk detections (High severity).
          </div>
          <div class="alert-banner warning" style="margin-bottom:0">
            <i class="ti ti-shield-off"></i>
            1 privileged account (tom.brooks) has no MFA registered.
          </div>
        </div>
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
  el.querySelector('#dash-to-m365')?.addEventListener('click', async () => await go('m365config'))
  el.querySelector('#dash-to-zt')?.addEventListener('click', async () => await go('zerotrust'))
  el.querySelector('#dash-to-audit')?.addEventListener('click', async () => await go('audit'))
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
