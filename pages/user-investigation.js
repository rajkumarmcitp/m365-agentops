/**
 * User Investigation Page
 * Comprehensive user activity analysis and risk assessment
 */

import { getUserList, getUserInvestigation } from '../lib/user-investigation-client.js'
import { showToast } from '../components/toast.js'
import { isDemoAccount } from '../lib/demo-account.js'
import { skeletonLoader } from '../lib/skeleton-loader.js'

export function initUserInvestigation() {
  const el = document.getElementById('page-user-investigation')
  if (!el) return

  if (isDemoAccount()) {
    renderDemoUserInvestigation(el)
    return
  }

  // Show skeleton immediately
  el.innerHTML = `
    <div>
      ${skeletonLoader.renderPageHeader('User Investigation', 'Comprehensive user activity analysis and risk assessment', false)}
      ${skeletonLoader.renderMetricsRowSkeleton(4)}
      ${skeletonLoader.renderCardGridSkeleton(1, 2)}
      ${skeletonLoader.renderTableSkeleton(7, 6)}
    </div>
  `

  // Load data and render
  renderUserInvestigation(el)
}

function renderDemoUserInvestigation(el) {
  const demoUsers = [
    { id: '1', displayName: 'Sarah Kim', mail: 'sarah.kim@contoso.com', riskScore: 78 },
    { id: '2', displayName: 'John Smith', mail: 'john.smith@contoso.com', riskScore: 42 },
    { id: '3', displayName: 'Maya Patel', mail: 'maya.patel@contoso.com', riskScore: 15 },
  ]

  const selectedUserDemo = demoUsers[0]

  const demoAppAccess = [
    { name: 'Microsoft Teams', lastUsed: '2026-06-01 14:32', accessCount: 47, riskLevel: 'LOW' },
    { name: 'SharePoint Online', lastUsed: '2026-06-01 13:15', accessCount: 23, riskLevel: 'LOW' },
    { name: 'Exchange Online', lastUsed: '2026-06-01 10:45', accessCount: 156, riskLevel: 'MEDIUM' },
    { name: 'OneDrive', lastUsed: '2026-05-31 16:20', accessCount: 8, riskLevel: 'LOW' },
  ]

  const demoSignInLogs = [
    { timestamp: '2026-06-01 14:32', location: 'Seattle, WA', app: 'Teams', status: 'Success', risk: 'Low' },
    { timestamp: '2026-06-01 13:45', location: 'Seattle, WA', app: 'OWA', status: 'Success', risk: 'Low' },
    { timestamp: '2026-06-01 10:20', location: 'Seattle, WA', app: 'SharePoint', status: 'Success', risk: 'Low' },
    { timestamp: '2026-05-31 18:30', location: 'Unknown', app: 'Exchange', status: 'MFA Challenge', risk: 'Medium' },
  ]

  const demoAuditLogs = [
    { action: 'User added to group', object: 'Engineering Team', timestamp: '2026-06-01 10:15', status: 'Success' },
    { action: 'Mailbox forwarding rule created', object: 'sarah.kim@contoso.com', timestamp: '2026-05-31 15:45', status: 'Success' },
    { action: 'SharePoint site access granted', object: 'Compliance Docs', timestamp: '2026-05-30 14:20', status: 'Success' },
  ]

  const demoActionsOnOthers = [
    { action: 'Added john.smith to Executives group', timestamp: '2026-06-01 09:30', riskLevel: 'Medium' },
    { action: 'Created forwarding rule to external domain', timestamp: '2026-05-28 16:15', riskLevel: 'High' },
  ]

  const demoTimeline = [
    { date: '2026-06-01', event: 'Abnormal sign-in location detected', severity: 'Medium' },
    { date: '2026-05-31', event: 'MFA bypass attempted', severity: 'High' },
    { date: '2026-05-28', event: 'Email forwarding rule created to external domain', severity: 'High' },
  ]

  el.innerHTML = `
    <div class="page-header">
      <div class="page-title"><i class="ti ti-shield-check"></i> User Investigation</div>
      <div class="page-subtitle">Comprehensive user activity analysis and risk assessment</div>
    </div>

    <div style="display:flex;align-items:center;gap:8px;padding:8px 12px;background:var(--color-background-primary);border:0.5px solid var(--color-border-secondary);border-radius:var(--border-radius-md);margin-bottom:16px;font-size:10px;color:var(--color-text-tertiary)">
      <span class="status-dot active pulse"></span>
      <span><strong style="color:var(--color-text-secondary)">Demo Mode</strong> · Showing sample user investigation data</span>
    </div>

    <!-- Demo User Selection -->
    <div class="card mb-3">
      <div class="card-title mb-3">Demo User Investigation</div>
      <div style="display:flex;gap:12px;flex-wrap:wrap;padding:12px 0">
        ${demoUsers.map(u => `
          <div class="demo-user-card" data-user-id="${u.id}" style="padding:12px;background:var(--color-background-secondary);border:0.5px solid var(--color-border-secondary);border-radius:var(--border-radius-md);cursor:pointer;flex:1;min-width:200px;${u.id === selectedUserDemo.id ? 'border-color:var(--clr-info-text);background:var(--clr-info-bg)' : ''}">
            <div style="font-weight:600;margin-bottom:4px">${u.displayName}</div>
            <div style="font-size:10px;color:var(--color-text-secondary);margin-bottom:8px">${u.mail}</div>
            <div style="display:flex;align-items:center;gap:6px">
              <div style="width:40px;height:8px;background:var(--color-background-tertiary);border-radius:4px;overflow:hidden">
                <div style="height:100%;width:${u.riskScore}%;background:${u.riskScore > 60 ? 'var(--clr-danger-text)' : u.riskScore > 30 ? 'var(--clr-warning-text)' : 'var(--clr-success-text)'}"></div>
              </div>
              <span style="font-size:10px;font-weight:600;color:${u.riskScore > 60 ? 'var(--clr-danger-text)' : u.riskScore > 30 ? 'var(--clr-warning-text)' : 'var(--clr-success-text)'}">${u.riskScore} risk</span>
            </div>
          </div>
        `).join('')}
      </div>
    </div>

    <!-- User Summary KPIs -->
    <div class="kpi-row mb-3">
      <div class="kpi-tile">
        <div class="kpi-value danger">${selectedUserDemo.riskScore}</div>
        <div class="kpi-label">Risk Score</div>
      </div>
      <div class="kpi-tile">
        <div class="kpi-value info">${demoAppAccess.length}</div>
        <div class="kpi-label">Apps Accessed</div>
      </div>
      <div class="kpi-tile">
        <div class="kpi-value warning">${demoSignInLogs.length}</div>
        <div class="kpi-label">Recent Sign-ins</div>
      </div>
      <div class="kpi-tile">
        <div class="kpi-value danger">${demoActionsOnOthers.length}</div>
        <div class="kpi-label">Risky Actions</div>
      </div>
    </div>

    <!-- Application Access -->
    <div class="card mb-3">
      <div class="card-title mb-3"><i class="ti ti-apps"></i> Application Access (Last 7 days)</div>
      <table style="width:100%;border-collapse:collapse;font-size:11px">
        <thead style="background:var(--color-background-secondary)">
          <tr>
            <th style="padding:10px 12px;text-align:left;font-weight:600">Application</th>
            <th style="padding:10px 12px;text-align:left;font-weight:600">Last Used</th>
            <th style="padding:10px 12px;text-align:left;font-weight:600">Access Count</th>
            <th style="padding:10px 12px;text-align:left;font-weight:600">Risk</th>
          </tr>
        </thead>
        <tbody>
          ${demoAppAccess.map(app => `
            <tr style="border-bottom:0.5px solid var(--color-border-tertiary)">
              <td style="padding:10px 12px;font-weight:600">${app.name}</td>
              <td style="padding:10px 12px;font-size:10px;color:var(--color-text-secondary)">${app.lastUsed}</td>
              <td style="padding:10px 12px">${app.accessCount}</td>
              <td style="padding:10px 12px"><span class="badge ${app.riskLevel === 'LOW' ? 'success' : 'warning'}">${app.riskLevel}</span></td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>

    <!-- Sign-in Activity -->
    <div class="card mb-3">
      <div class="card-title mb-3"><i class="ti ti-login"></i> Recent Sign-in Activity</div>
      <table style="width:100%;border-collapse:collapse;font-size:11px">
        <thead style="background:var(--color-background-secondary)">
          <tr>
            <th style="padding:10px 12px;text-align:left;font-weight:600">Timestamp</th>
            <th style="padding:10px 12px;text-align:left;font-weight:600">Location</th>
            <th style="padding:10px 12px;text-align:left;font-weight:600">Application</th>
            <th style="padding:10px 12px;text-align:left;font-weight:600">Status</th>
            <th style="padding:10px 12px;text-align:left;font-weight:600">Risk</th>
          </tr>
        </thead>
        <tbody>
          ${demoSignInLogs.map(log => `
            <tr style="border-bottom:0.5px solid var(--color-border-tertiary)">
              <td style="padding:10px 12px;font-size:10px">${log.timestamp}</td>
              <td style="padding:10px 12px;font-size:10px;color:var(--color-text-secondary)">${log.location}</td>
              <td style="padding:10px 12px">${log.app}</td>
              <td style="padding:10px 12px"><span class="badge ${log.status === 'Success' ? 'success' : 'warning'}">${log.status}</span></td>
              <td style="padding:10px 12px"><span class="badge ${log.risk === 'Low' ? 'success' : 'warning'}">${log.risk}</span></td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>

    <!-- Audit Actions -->
    <div class="card mb-3">
      <div class="card-title mb-3"><i class="ti ti-clipboard-list"></i> Audit Actions</div>
      <div style="display:flex;flex-direction:column;gap:12px;padding:12px 0">
        ${demoAuditLogs.map(log => `
          <div style="padding:12px;background:var(--color-background-secondary);border-radius:var(--border-radius-md);border-left:3px solid var(--clr-info-text)">
            <div style="display:flex;justify-content:space-between;align-items:start">
              <div>
                <div style="font-weight:600;margin-bottom:4px">${log.action}</div>
                <div style="font-size:10px;color:var(--color-text-secondary)">${log.object}</div>
              </div>
              <span class="badge success">${log.status}</span>
            </div>
            <div style="font-size:10px;color:var(--color-text-tertiary);margin-top:8px">${log.timestamp}</div>
          </div>
        `).join('')}
      </div>
    </div>

    <!-- Actions on Other Accounts -->
    <div class="card mb-3">
      <div class="card-title mb-3"><i class="ti ti-users-group"></i> Actions on Other Accounts</div>
      <div style="display:flex;flex-direction:column;gap:12px;padding:12px 0">
        ${demoActionsOnOthers.map(act => `
          <div style="padding:12px;background:var(--color-background-secondary);border-radius:var(--border-radius-md);border-left:3px solid ${act.riskLevel === 'High' ? 'var(--clr-danger-text)' : 'var(--clr-warning-text)'}">
            <div style="display:flex;justify-content:space-between;align-items:start">
              <div style="font-weight:600">${act.action}</div>
              <span class="badge ${act.riskLevel === 'High' ? 'danger' : 'warning'}">${act.riskLevel} Risk</span>
            </div>
            <div style="font-size:10px;color:var(--color-text-tertiary);margin-top:8px">${act.timestamp}</div>
          </div>
        `).join('')}
      </div>
    </div>

    <!-- Risk Timeline -->
    <div class="card mb-3">
      <div class="card-title mb-3"><i class="ti ti-timeline"></i> Risk Timeline</div>
      <div style="display:flex;flex-direction:column;gap:8px;padding:12px 0">
        ${demoTimeline.map(item => `
          <div style="display:flex;gap:12px;align-items:start">
            <div style="flex-shrink:0;margin-top:4px;width:12px;height:12px;border-radius:50%;background:${item.severity === 'High' ? 'var(--clr-danger-text)' : 'var(--clr-warning-text)'}"></div>
            <div style="flex:1">
              <div style="font-weight:600;font-size:11px">${item.event}</div>
              <div style="font-size:10px;color:var(--color-text-tertiary);margin-top:2px">${item.date}</div>
            </div>
            <span class="badge ${item.severity === 'High' ? 'danger' : 'warning'}">${item.severity}</span>
          </div>
        `).join('')}
      </div>
    </div>
  `

  // User card selection
  el.querySelectorAll('.demo-user-card').forEach(card => {
    card.addEventListener('click', () => {
      el.querySelectorAll('.demo-user-card').forEach(c => {
        c.style.borderColor = 'var(--color-border-secondary)'
        c.style.background = 'var(--color-background-secondary)'
      })
      card.style.borderColor = 'var(--clr-info-text)'
      card.style.background = 'var(--clr-info-bg)'
    })
  })
}

function renderUserInvestigation(el) {
  el.innerHTML = `
    <div class="page-header">
      <div class="page-title"><i class="ti ti-shield-check"></i> User Investigation</div>
      <div class="page-subtitle">Comprehensive user activity analysis and risk assessment</div>
    </div>

    <!-- Filters -->
    <div class="card mb-3">
      <div class="card-title mb-3">Filters</div>
      <div style="display:grid;grid-template-columns:1fr 1fr 1fr 150px;gap:12px;align-items:end">
        <div class="form-group" style="margin-bottom:0">
          <label class="form-label">Select User</label>
          <input type="text" id="user-search" class="form-input" placeholder="Search by name or email..." autocomplete="off">
          <div id="user-dropdown" class="user-dropdown" style="display:none;position:absolute;background:white;border:1px solid var(--color-border);border-radius:6px;margin-top:2px;max-height:300px;overflow-y:auto;width:100%;z-index:1000;box-shadow:0 4px 12px rgba(0,0,0,0.1)"></div>
        </div>

        <div class="form-group" style="margin-bottom:0">
          <label class="form-label">Days Back</label>
          <select id="days-back" class="form-select">
            <option value="7">Last 7 days</option>
            <option value="14">Last 14 days</option>
            <option value="30">Last 30 days</option>
          </select>
        </div>

        <div class="form-group" style="margin-bottom:0">
          <label class="form-label">Custom Date Range</label>
          <input type="date" id="custom-date" class="form-input">
        </div>

        <button id="investigate-btn" class="btn btn-primary" disabled>
          <i class="ti ti-search"></i> Investigate
        </button>
      </div>
    </div>

    <!-- Loading state -->
    <div id="loading-state" style="display:none">
      <div class="card mb-3">
        <div style="display:flex;align-items:center;gap:12px;padding:20px">
          <span class="spinner"></span>
          <span>Loading user investigation data...</span>
        </div>
      </div>
    </div>

    <!-- Investigation results -->
    <div id="investigation-results" style="display:none">
      <!-- User Summary -->
      <div class="card mb-3">
        <div class="card-title mb-3">User Summary</div>
        <div id="user-summary" style="display:grid;grid-template-columns:1fr 1fr 1fr 1fr;gap:16px"></div>
      </div>

      <!-- ===== CATEGORY 1: ACTIONS PERFORMED BY THE USER ===== -->
      <div style="border:0.5px solid var(--color-border-secondary);border-radius:8px;padding:16px;margin-bottom:16px;background:var(--color-background-secondary)">
        <h3 style="margin:0 0 16px 0;font-size:14px;font-weight:600;display:flex;align-items:center;gap:8px;color:var(--color-info)">
          <i class="ti ti-user-check"></i>
          Actions Performed by the User (What did the user do?)
        </h3>

        <!-- Sign-in Activity -->
        <div class="card mb-3">
          <div class="card-title mb-3" style="font-size:12px"><i class="ti ti-login"></i> Sign-in Activity</div>
          <div id="signin-logs-section" style="font-size:11px"></div>
        </div>

        <!-- Risk Detections -->
        <div class="card mb-3">
          <div class="card-title mb-3" style="font-size:12px"><i class="ti ti-alert-triangle"></i> Risk Detections</div>
          <div id="risk-detections-section" style="font-size:11px"></div>
        </div>

        <!-- Devices Used -->
        <div class="card mb-3">
          <div class="card-title mb-3" style="font-size:12px"><i class="ti ti-device-laptop"></i> Devices Used</div>
          <div id="devices-section" style="font-size:11px"></div>
        </div>

        <!-- OAuth Permissions -->
        <div class="card mb-3">
          <div class="card-title mb-3" style="font-size:12px"><i class="ti ti-key"></i> OAuth Permissions Granted</div>
          <div id="oauth-consent-section" style="font-size:11px"></div>
        </div>

        <!-- Security Alerts -->
        <div class="card mb-3">
          <div class="card-title mb-3" style="font-size:12px"><i class="ti ti-bell-alert"></i> Security Alerts</div>
          <div id="security-alerts-section" style="font-size:11px"></div>
        </div>
      </div>

      <!-- ===== CATEGORY 2: ACTIONS PERFORMED ON USER ACCOUNT ===== -->
      <div style="border:0.5px solid var(--color-border-secondary);border-radius:8px;padding:16px;margin-bottom:16px;background:var(--color-background-secondary)">
        <h3 style="margin:0 0 16px 0;font-size:14px;font-weight:600;display:flex;align-items:center;gap:8px;color:var(--color-warning)">
          <i class="ti ti-user-edit"></i>
          Actions Performed on User Account (What happened to the user's account?)
        </h3>

        <!-- Account Changes -->
        <div class="card">
          <div class="card-title mb-3" style="font-size:12px"><i class="ti ti-clipboard-list"></i> Account Changes</div>
          <div id="account-changes-section" style="font-size:11px"></div>
        </div>
      </div>

      <!-- ===== ADDITIONAL SECTIONS (LEGACY) ===== -->
      <div style="margin-top:24px;padding-top:16px;border-top:1px solid var(--color-border-secondary)">
        <h3 style="font-size:12px;font-weight:600;color:var(--color-text-secondary);margin-bottom:12px">Additional Investigation Data</h3>

        <!-- Application Access -->
        <div class="card mb-3">
          <div class="card-title mb-3"><i class="ti ti-apps"></i> Application Access</div>
          <div id="applications-section"></div>
        </div>

        <!-- Audit Actions -->
        <div class="card mb-3">
          <div class="card-title mb-3"><i class="ti ti-clipboard-list"></i> Audit Actions</div>
          <div id="audit-logs-section"></div>
        </div>

        <!-- Actions on Other Accounts -->
        <div class="card mb-3">
          <div class="card-title mb-3"><i class="ti ti-users-group"></i> Actions on Other Accounts</div>
          <div id="other-accounts-section"></div>
        </div>

        <!-- Risk Timeline -->
        <div class="card mb-3">
          <div class="card-title mb-3"><i class="ti ti-timeline"></i> Risk Timeline</div>
          <div id="timeline-section"></div>
        </div>
      </div>
    </div>

    <!-- Empty state -->
    <div id="empty-state" style="text-align:center;padding:40px;color:var(--color-text-tertiary)">
      <i class="ti ti-inbox" style="font-size:48px;margin-bottom:12px;opacity:0.5"></i>
      <p>Select a user and click "Investigate" to see their activity</p>
    </div>
  `

  let allUsers = []
  let selectedUserId = null
  const userSearchInput = el.querySelector('#user-search')
  const userDropdown = el.querySelector('#user-dropdown')
  const daysBackSelect = el.querySelector('#days-back')
  const customDateInput = el.querySelector('#custom-date')
  const investigateBtn = el.querySelector('#investigate-btn')

  // Load users on init
  loadUsers()

  async function loadUsers() {
    try {
      const result = await getUserList()
      allUsers = result.data || []
    } catch (error) {
      console.error('Failed to load users:', error)
      showToast('Failed to load user list', 'error')
    }
  }

  // User search and selection
  userSearchInput.addEventListener('input', (e) => {
    const search = e.target.value.toLowerCase()
    if (!search) {
      userDropdown.style.display = 'none'
      return
    }

    const filtered = allUsers.filter(u =>
      u.displayName.toLowerCase().includes(search) ||
      u.mail.toLowerCase().includes(search)
    )

    userDropdown.innerHTML = filtered.map(u => `
      <div class="user-dropdown-item" data-id="${u.id}" style="padding:10px 12px;border-bottom:1px solid var(--color-border);cursor:pointer;font-size:11px">
        <div style="font-weight:500">${u.displayName}</div>
        <div style="color:var(--color-text-tertiary);margin-top:2px">${u.mail}</div>
      </div>
    `).join('')

    filtered.forEach(u => {
      const item = userDropdown.querySelector(`[data-id="${u.id}"]`)
      item?.addEventListener('click', () => {
        selectedUserId = u.id
        userSearchInput.value = u.displayName
        userDropdown.style.display = 'none'
        investigateBtn.disabled = false
      })
    })

    userDropdown.style.display = filtered.length > 0 ? 'block' : 'none'
  })

  // Investigate button
  investigateBtn.addEventListener('click', async () => {
    if (!selectedUserId) {
      showToast('Please select a user', 'warning')
      return
    }

    const daysBack = parseInt(daysBackSelect.value)
    const endDate = new Date()
    const startDate = new Date(endDate)
    startDate.setDate(startDate.getDate() - daysBack)

    showLoading(el, true)

    try {
      const result = await getUserInvestigation(
        selectedUserId,
        startDate.toISOString().split('T')[0],
        endDate.toISOString().split('T')[0]
      )

      renderInvestigation(el, result.data)
      showLoading(el, false)
    } catch (error) {
      console.error('Investigation error:', error)
      showToast('Failed to load investigation data', 'error')
      showLoading(el, false)
    }
  })

  // Close dropdown on click outside
  document.addEventListener('click', (e) => {
    if (!userSearchInput.contains(e.target) && !userDropdown.contains(e.target)) {
      userDropdown.style.display = 'none'
    }
  })
}

function showLoading(el, show) {
  el.querySelector('#loading-state').style.display = show ? 'block' : 'none'
  el.querySelector('#investigation-results').style.display = show ? 'none' : 'block'
  el.querySelector('#empty-state').style.display = show ? 'none' : 'none'
}

function renderInvestigation(el, data) {
  const { user, applicationAccess, signInLogs, auditLogs, actionsOnOtherAccounts, timeline, summary } = data

  // User Summary
  const summaryHtml = `
    <div class="info-card">
      <div style="color:var(--color-text-tertiary);font-size:10px;text-transform:uppercase;letter-spacing:0.5px;margin-bottom:6px">User</div>
      <div style="font-weight:600;font-size:14px">${user.displayName}</div>
      <div style="color:var(--color-text-secondary);font-size:11px;margin-top:4px">${user.mail}</div>
    </div>

    <div class="info-card">
      <div style="color:var(--color-text-tertiary);font-size:10px;text-transform:uppercase;letter-spacing:0.5px;margin-bottom:6px">Risk Score</div>
      <div style="display:flex;align-items:center;gap:8px">
        <div style="font-weight:600;font-size:20px">${user.riskScore}</div>
        <div style="padding:2px 6px;border-radius:3px;font-size:9px;font-weight:600;background:${getRiskColor(user.riskLevel).bg};color:${getRiskColor(user.riskLevel).text}">${user.riskLevel}</div>
      </div>
    </div>

    <div class="info-card">
      <div style="color:var(--color-text-tertiary);font-size:10px;text-transform:uppercase;letter-spacing:0.5px;margin-bottom:6px">Department</div>
      <div style="font-weight:500;font-size:13px">${user.department || 'N/A'}</div>
      <div style="color:var(--color-text-secondary);font-size:11px;margin-top:4px">${user.jobTitle || 'No title'}</div>
    </div>

    <div class="info-card">
      <div style="color:var(--color-text-tertiary);font-size:10px;text-transform:uppercase;letter-spacing:0.5px;margin-bottom:6px">Last Active</div>
      <div style="font-weight:500;font-size:13px">${formatTime(user.lastActive)}</div>
      <div style="color:var(--color-text-secondary);font-size:11px;margin-top:4px">${formatDate(user.lastActive)}</div>
    </div>
  `

  el.querySelector('#user-summary').innerHTML = summaryHtml

  // Application Access - Grouped and sorted
  const appHtml = `
    <div style="overflow-x:auto">
      <table class="data-table">
        <thead>
          <tr>
            <th>Application</th>
            <th>Last Accessed</th>
            <th>Success</th>
            <th>Failures</th>
            <th>Status</th>
            <th>Locations</th>
          </tr>
        </thead>
        <tbody>
          ${applicationAccess.map(app => `
            <tr>
              <td><strong>${app.appName}</strong></td>
              <td>${formatTime(app.lastAccessTime)}</td>
              <td style="color:var(--clr-success-text)">${app.successCount}</td>
              <td style="color:${app.failureCount > 0 ? 'var(--clr-danger-text)' : 'var(--color-text-tertiary)'}"><strong>${app.failureCount}</strong></td>
              <td>
                <span style="padding:2px 6px;border-radius:3px;font-size:9px;font-weight:600;background:${getStatusColor(app.status).bg};color:${getStatusColor(app.status).text}">
                  ${app.status}
                </span>
              </td>
              <td style="font-size:11px;color:var(--color-text-secondary)">${app.locations.join(', ')}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>
  `

  el.querySelector('#applications-section').innerHTML = appHtml

  // Group sign-in logs by application
  const appGroups = {}
  signInLogs.forEach(log => {
    if (!appGroups[log.application]) {
      appGroups[log.application] = []
    }
    appGroups[log.application].push(log)
  })

  // Sign-in Logs by Application
  const signinHtml = `
    <div style="display:grid;gap:16px">
      ${Object.entries(appGroups).slice(0, 10).map(([appName, logs]) => {
        const successCount = logs.filter(l => l.status === 'success').length
        const failureCount = logs.filter(l => l.status === 'failure').length
        const nonCompliantCount = logs.filter(l => l.compliant === 'No').length
        const unmanagedCount = logs.filter(l => l.managed === 'No').length

        return `
          <div style="border:1px solid var(--color-border);border-radius:6px;padding:12px;background:var(--color-bg-secondary)">
            <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px">
              <h4 style="margin:0;color:var(--color-text-primary)">${appName}</h4>
              <div style="display:flex;gap:8px;font-size:11px">
                <span style="padding:4px 8px;border-radius:3px;background:var(--clr-success-bg);color:var(--clr-success-text)"><strong>${successCount}</strong> success</span>
                ${failureCount > 0 ? `<span style="padding:4px 8px;border-radius:3px;background:var(--clr-danger-bg);color:var(--clr-danger-text)"><strong>${failureCount}</strong> failed</span>` : ''}
              </div>
            </div>

            <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(150px,1fr));gap:8px;margin-bottom:12px;font-size:11px">
              <div style="background:var(--color-bg-primary);padding:8px;border-radius:3px">
                <div style="color:var(--color-text-secondary);font-size:10px">Non-Compliant</div>
                <div style="font-weight:600;color:${nonCompliantCount > 0 ? 'var(--clr-warning-text)' : 'var(--color-text-tertiary)'}">${nonCompliantCount}</div>
              </div>
              <div style="background:var(--color-bg-primary);padding:8px;border-radius:3px">
                <div style="color:var(--color-text-secondary);font-size:10px">Unmanaged</div>
                <div style="font-weight:600;color:${unmanagedCount > 0 ? 'var(--clr-info-text)' : 'var(--color-text-tertiary)'}">${unmanagedCount}</div>
              </div>
              <div style="background:var(--color-bg-primary);padding:8px;border-radius:3px">
                <div style="color:var(--color-text-secondary);font-size:10px">Recent Activity</div>
                <div style="font-weight:600">${formatTime(logs[0].timestamp)}</div>
              </div>
            </div>

            <details style="cursor:pointer">
              <summary style="color:var(--color-text-secondary);font-size:11px;font-weight:600;padding:4px 0">Show ${logs.length} sign-in details</summary>
              <table class="data-table" style="margin-top:8px;font-size:10px">
                <thead>
                  <tr>
                    <th>Time</th>
                    <th>Browser / OS</th>
                    <th>Device</th>
                    <th>IP</th>
                    <th>Compliant</th>
                    <th>Managed</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  ${logs.slice(0, 15).map(log => `
                    <tr>
                      <td style="white-space:nowrap">${formatTime(log.timestamp)}</td>
                      <td style="font-size:9px">
                        <div>${log.browser}</div>
                        <div style="color:var(--color-text-secondary)">${log.operatingSystem}</div>
                      </td>
                      <td style="font-size:9px;color:${log.deviceName ? 'var(--color-text-primary)' : 'var(--color-text-tertiary)'}">${log.deviceName || '-'}</td>
                      <td style="font-family:monospace;font-size:9px;color:var(--color-text-secondary)">${log.ipAddress}</td>
                      <td><span style="padding:2px 4px;border-radius:2px;font-size:8px;background:${log.compliant === 'Yes' ? 'var(--clr-success-bg)' : 'var(--clr-warning-bg)'};color:${log.compliant === 'Yes' ? 'var(--clr-success-text)' : 'var(--clr-warning-text)'}">${log.compliant}</span></td>
                      <td><span style="padding:2px 4px;border-radius:2px;font-size:8px;background:${log.managed === 'Yes' ? 'var(--clr-success-bg)' : 'var(--clr-info-bg)'};color:${log.managed === 'Yes' ? 'var(--clr-success-text)' : 'var(--clr-info-text)'}">${log.managed}</span></td>
                      <td><span style="padding:2px 4px;border-radius:2px;font-size:8px;background:${log.status === 'success' ? 'var(--clr-success-bg)' : 'var(--clr-danger-bg)'};color:${log.status === 'success' ? 'var(--clr-success-text)' : 'var(--clr-danger-text)'}">${log.status.toUpperCase()}</span></td>
                    </tr>
                  `).join('')}
                </tbody>
              </table>
              ${logs.length > 15 ? `<div style="color:var(--color-text-tertiary);font-size:9px;margin-top:4px">Showing 15 of ${logs.length} sign-ins</div>` : ''}
            </details>
          </div>
        `
      }).join('')}
    </div>
    ${signInLogs.length > 0 ? `<div style="color:var(--color-text-tertiary);font-size:11px;margin-top:12px">Showing ${Math.min(10, Object.keys(appGroups).length)} of ${Object.keys(appGroups).length} applications (${signInLogs.length} total sign-ins)</div>` : ''}
  `

  el.querySelector('#signin-logs-section').innerHTML = signinHtml

  // Audit Logs
  const auditHtml = `
    <div style="overflow-x:auto">
      <table class="data-table">
        <thead>
          <tr>
            <th>Timestamp</th>
            <th>Operation</th>
            <th>Target</th>
            <th>Result</th>
            <th>Severity</th>
          </tr>
        </thead>
        <tbody>
          ${auditLogs.map(log => `
            <tr>
              <td>${formatTime(log.timestamp)}</td>
              <td><strong>${log.operation}</strong></td>
              <td>${log.target}</td>
              <td>
                <span style="padding:2px 6px;border-radius:3px;font-size:9px;font-weight:600;background:var(--clr-success-bg);color:var(--clr-success-text)">
                  ${log.result.toUpperCase()}
                </span>
              </td>
              <td>
                <span style="padding:2px 6px;border-radius:3px;font-size:9px;font-weight:600;background:${getSeverityColor(log.severity).bg};color:${getSeverityColor(log.severity).text}">
                  ${log.severity}
                </span>
              </td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>
  `

  el.querySelector('#audit-logs-section').innerHTML = auditHtml

  // Actions on Other Accounts
  const othersHtml = `
    <div style="display:flex;flex-direction:column;gap:8px">
      ${actionsOnOtherAccounts.map(action => `
        <div style="padding:12px;background:var(--color-background-secondary);border-radius:6px;border-left:3px solid ${getSeverityColor(action.severity).border}">
          <div style="display:flex;justify-content:space-between;align-items:center">
            <div>
              <div style="font-weight:600;font-size:12px">${action.targetName}</div>
              <div style="font-size:10px;color:var(--color-text-secondary);margin-top:2px">${action.targetUser}</div>
            </div>
            <div style="text-align:right">
              <div style="font-weight:600;font-size:11px">${action.action}</div>
              <div style="font-size:10px;color:var(--color-text-tertiary);margin-top:2px">${formatTime(action.timestamp)}</div>
            </div>
            <span style="padding:2px 6px;border-radius:3px;font-size:9px;font-weight:600;background:${getSeverityColor(action.severity).bg};color:${getSeverityColor(action.severity).text};margin-left:12px">
              ${action.severity}
            </span>
          </div>
        </div>
      `).join('')}
    </div>
  `

  el.querySelector('#other-accounts-section').innerHTML = othersHtml

  // Timeline
  const timelineHtml = `
    <div style="position:relative;padding:20px 0">
      ${timeline.map((event, idx) => `
        <div style="display:flex;gap:16px;margin-bottom:24px;position:relative">
          <div style="display:flex;flex-direction:column;align-items:center;width:40px;flex-shrink:0">
            <div style="width:12px;height:12px;border-radius:50%;background:${getSeverityColor(event.severity).bg};border:2px solid ${getSeverityColor(event.severity).border}"></div>
            ${idx < timeline.length - 1 ? `<div style="width:2px;height:40px;background:var(--color-border);margin-top:8px"></div>` : ''}
          </div>
          <div style="flex:1;padding-top:2px">
            <div style="display:flex;justify-content:space-between;align-items:start;gap:12px">
              <div>
                <div style="font-weight:600;font-size:12px">${event.description}</div>
                <div style="font-size:10px;color:var(--color-text-secondary);margin-top:4px">${formatTime(event.timestamp)}</div>
              </div>
              <span style="padding:2px 6px;border-radius:3px;font-size:9px;font-weight:600;background:${getSeverityColor(event.severity).bg};color:${getSeverityColor(event.severity).text};white-space:nowrap">
                ${event.severity}
              </span>
            </div>
          </div>
        </div>
      `).join('')}
    </div>
  `

  el.querySelector('#timeline-section').innerHTML = timelineHtml

  // Show results
  el.querySelector('#investigation-results').style.display = 'block'
  el.querySelector('#empty-state').style.display = 'none'
}

function getRiskColor(level) {
  const colors = {
    'LOW': { bg: 'var(--clr-success-bg)', text: 'var(--clr-success-text)' },
    'MEDIUM': { bg: 'var(--clr-warning-bg)', text: 'var(--clr-warning-text)' },
    'HIGH': { bg: 'var(--clr-danger-bg)', text: 'var(--clr-danger-text)' },
    'CRITICAL': { bg: 'var(--clr-critical-bg)', text: 'var(--clr-critical-text)' }
  }
  return colors[level] || colors['MEDIUM']
}

function getRiskBadgeColor(level) {
  const colors = {
    'low': { bg: 'rgba(16, 185, 129, 0.1)', text: '#10B981' },
    'medium': { bg: 'rgba(251, 146, 60, 0.1)', text: '#FB923C' },
    'high': { bg: 'rgba(239, 68, 68, 0.1)', text: '#EF4444' }
  }
  return colors[level] || colors['low']
}

function getStatusColor(status) {
  return status === 'SUCCESS'
    ? { bg: 'var(--clr-success-bg)', text: 'var(--clr-success-text)' }
    : { bg: 'var(--clr-danger-bg)', text: 'var(--clr-danger-text)' }
}

function getSeverityColor(severity) {
  const colors = {
    'LOW': { bg: 'var(--clr-success-bg)', text: 'var(--clr-success-text)', border: 'var(--clr-success-text)' },
    'MEDIUM': { bg: 'var(--clr-warning-bg)', text: 'var(--clr-warning-text)', border: 'var(--clr-warning-text)' },
    'HIGH': { bg: 'var(--clr-danger-bg)', text: 'var(--clr-danger-text)', border: 'var(--clr-danger-text)' },
    'CRITICAL': { bg: 'var(--clr-critical-bg)', text: 'var(--clr-critical-text)', border: 'var(--clr-critical-text)' }
  }
  return colors[severity] || colors['MEDIUM']
}

function formatTime(dateString) {
  const date = new Date(dateString)
  const now = new Date()
  const diff = now - date

  const minutes = Math.floor(diff / 60000)
  const hours = Math.floor(diff / 3600000)
  const days = Math.floor(diff / 86400000)

  if (minutes < 1) return 'Just now'
  if (minutes < 60) return `${minutes}m ago`
  if (hours < 24) return `${hours}h ago`
  if (days < 7) return `${days}d ago`

  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })
}

function formatDate(dateString) {
  return new Date(dateString).toLocaleDateString('en-US', { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' })
}
