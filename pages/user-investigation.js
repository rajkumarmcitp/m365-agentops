/**
 * User Investigation Page
 * Comprehensive user activity analysis and risk assessment
 */

import { getUserList, getUserInvestigation } from '../lib/user-investigation-client.js'
import { showToast } from '../components/toast.js'

export function initUserInvestigation() {
  const el = document.getElementById('page-user-investigation')
  if (!el) return
  renderUserInvestigation(el)
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

      <!-- Application Access -->
      <div class="card mb-3">
        <div class="card-title mb-3"><i class="ti ti-apps"></i> Application Access (${'-7d to today'}) </div>
        <div id="applications-section"></div>
      </div>

      <!-- Sign-in Activity -->
      <div class="card mb-3">
        <div class="card-title mb-3"><i class="ti ti-login"></i> Recent Sign-in Activity</div>
        <div id="signin-logs-section"></div>
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

  // Sign-in Logs
  const signinHtml = `
    <div style="overflow-x:auto">
      <table class="data-table">
        <thead>
          <tr>
            <th>Timestamp</th>
            <th>Application</th>
            <th>Location</th>
            <th>Device</th>
            <th>Device Name</th>
            <th>IP Address</th>
            <th>Status</th>
            <th>Risk</th>
          </tr>
        </thead>
        <tbody>
          ${signInLogs.slice(0, 20).map(log => `
            <tr>
              <td>${formatTime(log.timestamp)}</td>
              <td><strong>${log.application}</strong></td>
              <td>${log.location}</td>
              <td style="font-size:11px">${log.device}</td>
              <td style="font-size:11px;color:${log.deviceName ? 'var(--color-text-primary)' : 'var(--color-text-tertiary)'}">${log.deviceName || '-'}</td>
              <td style="font-family:monospace;font-size:10px;color:var(--color-text-secondary)">${log.ipAddress}</td>
              <td>
                <span style="padding:2px 6px;border-radius:3px;font-size:9px;font-weight:600;background:${log.status === 'success' ? 'var(--clr-success-bg)' : 'var(--clr-danger-bg)'};color:${log.status === 'success' ? 'var(--clr-success-text)' : 'var(--clr-danger-text)'}">
                  ${log.status.toUpperCase()}
                </span>
              </td>
              <td>
                <span style="padding:2px 6px;border-radius:3px;font-size:9px;font-weight:600;background:${getRiskBadgeColor(log.riskLevel).bg};color:${getRiskBadgeColor(log.riskLevel).text}">
                  ${log.riskLevel.toUpperCase()}
                </span>
              </td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>
    ${signInLogs.length > 20 ? `<div style="color:var(--color-text-tertiary);font-size:11px;margin-top:8px">Showing 20 of ${signInLogs.length} sign-ins</div>` : ''}
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
