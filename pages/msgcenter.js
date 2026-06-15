import { state } from '../app.js'
import { showToast } from '../components/toast.js'
import { isDemoAccount } from '../lib/demo-account.js'
import { getMessageCenterMessages, getServiceHealth, api } from '../lib/api-client.js'
import { MC_MESSAGES } from '../data/msgcenter-data.js'

function getAnnouncementDetailsHTML(msg) {
  let html = '<div style="padding:16px;background:#f5f5f5;border-top:1px solid #ddd;min-width:0">'

  if (msg.description && typeof msg.description === 'string') {
    const formattedBody = msg.description
      .replace(/\n/g, '<br>')
      .replace(/\[([^\]]+:)\]/g, '<strong style="color:#333">[$1]</strong>')

    html += `
      <div style="margin-bottom:16px">
        <div style="display:flex;align-items:center;gap:8px;margin-bottom:10px">
          <i class="ti ti-info-circle" style="font-size:14px;color:#0066cc"></i>
          <div style="font-weight:700;font-size:12px;color:#333">Summary</div>
        </div>
        <div style="font-size:11px;color:#555;line-height:1.6;background:#fff;padding:10px;border-radius:6px;border-left:3px solid #0066cc">
          ${formattedBody}
        </div>
      </div>
    `
  }

  html += '</div>'
  return html
}

function getStatusBadgeColor(status) {
  const colors = {
    'Not Reviewed': 'info',
    'Reviewed': 'success',
    'In Progress': 'warning',
    'Resolved': 'success',
    'Not Started': 'neutral',
  }
  return colors[status] || 'neutral'
}

function getStatusColor(status) {
  const colors = {
    'Not Started': 'neutral',
    'In Progress': 'warning',
    'Review': 'info',
    'Resolved': 'success',
    'Pending': 'warning',
    'Approved': 'success',
    'Rejected': 'danger',
  }
  return colors[status] || 'neutral'
}

function formatDateForInput(dateString) {
  if (!dateString) return ''
  try {
    // Convert ISO timestamp to yyyy-MM-dd format
    const date = new Date(dateString)
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    return `${year}-${month}-${day}`
  } catch (e) {
    return dateString
  }
}

function updateAdminActionsTable(announcements, tasks = []) {
  const tbody = document.getElementById('admin-actions-tbody')
  const countBadge = document.getElementById('admin-actions-count')
  const myTasksTbody = document.getElementById('my-tasks-tbody')
  const myTasksCount = document.getElementById('my-tasks-count')

  if (!tbody || !countBadge) {
    console.warn('Admin actions table elements not found')
    return
  }

  // Filter tasks assigned to current user
  const currentUserEmail = state.currentUser?.email?.toLowerCase() || ''
  const myTasks = tasks.filter(t => t.assignedTo?.toLowerCase() === currentUserEmail)

  if (myTasksTbody && myTasksCount) {
    myTasksCount.textContent = `${myTasks.length} tasks`

    if (myTasks.length === 0) {
      myTasksTbody.innerHTML = '<tr><td colspan="5" style="padding:20px;text-align:center;color:#999">No tasks assigned to you</td></tr>'
    } else {
      myTasksTbody.innerHTML = myTasks.map(task => `
        <tr style="border-bottom:0.5px solid #ddd">
          <td style="padding:10px;font-weight:600;color:#333;max-width:250px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${task.title}</td>
          <td style="padding:10px">
            <span class="badge ${getStatusColor(task.taskStatus)}" style="font-size:9px">${task.taskStatus}</span>
          </td>
          <td style="padding:10px">
            <div style="width:80px;height:20px;background:#e0e0e0;border-radius:4px;overflow:hidden;display:inline-block">
              <div style="width:${parseInt(task.progress) || 0}%;height:100%;background:#4CAF50"></div>
            </div>
            <span style="font-size:9px;color:#666;margin-left:4px">${task.progress}</span>
          </td>
          <td style="padding:10px;font-size:10px">${task.dueDate?.split('T')[0] || '—'}</td>
          <td style="padding:10px;text-align:center">
            <button class="btn-small update-assignee-task" data-task-id="${task.id}" style="font-size:9px;padding:4px 8px;cursor:pointer">
              <i class="ti ti-pencil"></i> Update
            </button>
          </td>
        </tr>
      `).join('')

      // Add event listeners for assignee task update buttons
      myTasksTbody.querySelectorAll('.update-assignee-task').forEach(btn => {
        btn.addEventListener('click', async (e) => {
          const taskId = e.target.closest('button').dataset.taskId
          const task = myTasks.find(t => t.id === taskId)
          if (task) {
            showAssigneeTaskUpdateModal(task)
          }
        })
      })
    }
  }

  if (!announcements || announcements.length === 0) {
    countBadge.textContent = '0 tasks created'
    tbody.innerHTML = '<tr><td colspan="7" style="padding:20px;text-align:center;color:#999">No tasks created yet</td></tr>'
    return
  }

  // Show tasks if any exist, otherwise show announcements with actions
  const tasksMap = new Map(tasks.map(t => [t.announcementId, t]))

  const displayItems = tasks.length > 0 ? tasks : announcements.filter(a => {
    const hasReviewAction = a.reviewStatus && a.reviewStatus !== 'Not Reviewed'
    const hasTaskAction = a.taskStatus && a.taskStatus !== 'Not Started'
    const hasDeadline = !!a.actionDeadline
    const hasNotes = !!a.notes
    return hasReviewAction || hasTaskAction || hasDeadline || hasNotes
  })

  console.log(`📊 Tasks Tracking: ${displayItems.length} tasks`)
  countBadge.textContent = `${displayItems.length} tasks`

  if (displayItems.length === 0) {
    tbody.innerHTML = '<tr><td colspan="7" style="padding:20px;text-align:center;color:#999">No tasks created yet</td></tr>'
    return
  }

  // Check if current user is an approver
  const userEmail = state.currentUser?.email?.toLowerCase() || ''
  const userRole = state.currentUser?.role || 'user'
  const primaryApprover = state.settings.primaryApprover?.toLowerCase() || ''
  const secondaryApprover = state.settings.secondaryApprover?.toLowerCase() || ''
  const isApprover = ['super', 'admin'].includes(userRole) || userEmail === primaryApprover || userEmail === secondaryApprover

  // Render tasks with tracking info
  tbody.innerHTML = displayItems.map(item => {
    // Get the announcement ID - for tasks it's in announcementId, for announcements it's in announcementId
    const msgId = item.announcementId || 'N/A'
    const isPendingApproval = item.taskStatus === 'Resolved' && item.approvalStatus === 'Pending' && isApprover

    return `
      <tr style="border-bottom:0.5px solid #ddd">
        <td style="padding:10px;color:#0066cc;font-weight:600;cursor:pointer" title="${msgId}">${msgId}</td>
        <td style="padding:10px;max-width:200px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${item.title}</td>
        <td style="padding:10px">
          <span class="badge ${getStatusBadgeColor(item.taskStatus)}" style="font-size:9px">${item.taskStatus || '—'}</span>
        </td>
        <td style="padding:10px">
          <span class="badge ${getStatusColor(item.approvalStatus || 'Pending')}" style="font-size:9px">${item.approvalStatus || 'Pending'}</span>
        </td>
        <td style="padding:10px">
          <div style="width:60px;height:16px;background:#e0e0e0;border-radius:3px;overflow:hidden;display:inline-block">
            <div style="width:${parseInt(item.progress) || 0}%;height:100%;background:#4CAF50"></div>
          </div>
          <span style="font-size:9px;color:#666;margin-left:4px">${item.progress || '0%'}</span>
        </td>
        <td style="padding:10px;color:#666;font-size:10px">${item.assignedTo || item.dueDate?.split('T')[0] || '—'}</td>
        <td style="padding:10px;max-width:150px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;color:#666;font-size:9px">${item.notes || '—'}</td>
        <td style="padding:10px;text-align:center">
          ${isPendingApproval ? `
            <button class="btn-small approve-resolution-btn" data-task-id="${item.id}" style="font-size:9px;padding:4px 8px;cursor:pointer;background:#4caf50;color:white;border:none;border-radius:4px">
              <i class="ti ti-check"></i> Approve
            </button>
          ` : `
            <button class="btn-small edit-admin-action-btn" data-task-id="${item.id}" style="font-size:9px;padding:4px 8px;cursor:pointer">
              <i class="ti ti-pencil"></i> Edit
            </button>
          `}
        </td>
      </tr>
    `
  }).join('')

  // Add approve button handlers for pending resolutions
  document.querySelectorAll('.approve-resolution-btn').forEach(btn => {
    btn.addEventListener('click', async (e) => {
      const taskId = e.target.closest('button').dataset.taskId
      const btn = e.target.closest('button')

      btn.disabled = true
      btn.innerHTML = `<span class="spinner dark"></span>`

      try {
        const response = await fetch(`${api}/msgcenter/tasks/${taskId}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            approvalStatus: 'Approved',
            siteUrl: state.settings.sharepointSiteUrl || 'root'
          })
        })

        const result = await response.json()
        if (response.ok && result.success) {
          showToast('✓ Resolution approved successfully', 'success')
          // Refresh the announcements and tasks
          const siteUrl = encodeURIComponent(state.settings.sharepointSiteUrl || 'root')
          Promise.all([
            fetch(`${api}/msgcenter/announcements?siteUrl=${siteUrl}`).then(r => r.json()),
            fetch(`${api}/msgcenter/tasks?siteUrl=${siteUrl}`).then(r => r.json())
          ])
          .then(([announcementsResult, tasksResult]) => {
            if (announcementsResult.success && announcementsResult.data) {
              updateAdminActionsTable(announcementsResult.data, tasksResult.data || [])
            }
          })
        } else {
          showToast(`Error: ${result.error}`, 'error')
          btn.disabled = false
          btn.innerHTML = `<i class="ti ti-check"></i> Approve`
        }
      } catch (error) {
        showToast(`Error: ${error.message}`, 'error')
        btn.disabled = false
        btn.innerHTML = `<i class="ti ti-check"></i> Approve`
      }
    })
  })

  // Add edit button handlers for admin actions table
  document.querySelectorAll('.edit-admin-action-btn').forEach(btn => {
    btn.addEventListener('click', async (e) => {
      const taskId = e.target.closest('button').dataset.taskId
      // Fetch task details and open edit modal
      try {
        const siteUrl = encodeURIComponent(state.settings.sharepointSiteUrl || 'root')
        const result = await fetch(`${api}/msgcenter/tasks?siteUrl=${siteUrl}`).then(r => r.json())
        if (result.success && result.data) {
          const task = result.data.find(t => t.id === taskId)
          if (task) {
            showAdminActionEditModal(task)
          }
        }
      } catch (error) {
        showToast(`Error: ${error.message}`, 'error')
      }
    })
  })
}

export async function initMsgCenter() {
  const el = document.getElementById('page-msgcenter')
  if (!el) return

  if (isDemoAccount()) {
    renderDemoMsgCenter(el)
  } else {
    await renderProductionMsgCenter(el)
  }
}

function renderDemoMsgCenter(el) {
  const actionRequiredCount = MC_MESSAGES.filter(m => m.actionRequired).length

  el.innerHTML = `
    <div class="page-header">
      <div>
        <div class="page-title"><i class="ti ti-antenna"></i> Change Intelligence</div>
        <div class="page-subtitle">
          SharePoint: Change Announcements · Last sync: Today at 08:45 · ${MC_MESSAGES.length} announcements
        </div>
      </div>
      <div class="page-actions">
        <button class="btn" id="mc-sync"><i class="ti ti-refresh"></i> Sync announcements</button>
        <button class="btn" id="mc-digest"><i class="ti ti-file-text"></i> Weekly digest</button>
      </div>
    </div>

    <div class="kpi-row">
      <div class="kpi-tile">
        <div class="kpi-value info">${MC_MESSAGES.length}</div>
        <div class="kpi-label">Total Announcements</div>
      </div>
      <div class="kpi-tile">
        <div class="kpi-value danger">${MC_MESSAGES.filter(m => m.severity === 'high').length}</div>
        <div class="kpi-label">High Severity</div>
      </div>
      <div class="kpi-tile">
        <div class="kpi-value warning">${MC_MESSAGES.filter(m => m.actionRequired).length}</div>
        <div class="kpi-label">Need Review</div>
      </div>
    </div>

    <div style="padding:8px 12px;background:var(--color-background-primary);border:0.5px solid var(--color-border-secondary);border-radius:var(--border-radius-md);margin-bottom:16px;font-size:10px;color:var(--color-text-tertiary)">
      <span class="status-dot active pulse"></span>
      <span><strong style="color:var(--color-text-secondary)">Demo Mode</strong> · Using sample data</span>
    </div>
  `

  el.querySelector('#mc-sync').addEventListener('click', () => {
    const btn = el.querySelector('#mc-sync')
    btn.innerHTML = `<span class="spinner dark"></span> Syncing...`
    btn.disabled = true
    setTimeout(() => {
      btn.innerHTML = `<i class="ti ti-refresh"></i> Sync announcements`
      btn.disabled = false
      showToast(`Synced ${MC_MESSAGES.length} announcements`, 'success')
    }, 2000)
  })
}

async function renderProductionMsgCenter(el) {
  el.innerHTML = `
    <div class="page-header">
      <div>
        <div class="page-title"><i class="ti ti-antenna"></i> Change Intelligence</div>
        <div class="page-subtitle">Loading announcements from SharePoint...</div>
      </div>
    </div>
    <div style="padding:20px;text-align:center"><div class="spinner"></div><p>Loading announcements...</p></div>
  `

  try {
    // Fetch announcements from SharePoint (backend syncs automatically every hour)
    console.log('📡 Fetching announcements from SharePoint...')
    const siteUrl = encodeURIComponent(state.settings.sharepointSiteUrl || 'root')
    const announcementsResult = await fetch(`${api}/msgcenter/announcements?siteUrl=${siteUrl}`)
      .then(r => r.json())

    if (!announcementsResult.success || !announcementsResult.data || announcementsResult.data.length === 0) {
      el.innerHTML = `
        <div class="page-header">
          <div>
            <div class="page-title"><i class="ti ti-antenna"></i> Change Intelligence</div>
            <div class="page-subtitle">No announcements available</div>
          </div>
          <div class="page-actions">
            <button class="btn" id="mc-sync"><i class="ti ti-refresh"></i> Sync announcements</button>
          </div>
        </div>
        <div style="padding:20px;text-align:center;color:var(--color-text-tertiary)">
          No announcements to display. Click "Sync announcements" to fetch the latest updates.
        </div>
      `

      el.querySelector('#mc-sync').addEventListener('click', async () => {
        const btn = el.querySelector('#mc-sync')
        btn.disabled = true
        btn.innerHTML = `<span class="spinner dark"></span> Syncing...`
        await renderProductionMsgCenter(el)
      })
      return
    }

    const announcements = announcementsResult.data
    const notReviewedCount = announcements.filter(a => a.reviewStatus === 'Not Reviewed').length
    const tasksCreatedCount = announcements.filter(a => a.taskStatus !== 'Not Started').length

    el.innerHTML = `
      <div class="page-header">
        <div>
          <div class="page-title"><i class="ti ti-antenna"></i> Change Intelligence</div>
          <div class="page-subtitle">SharePoint: Change Announcements · ${announcements.length} announcements · ${notReviewedCount} need review</div>
        </div>
        <div class="page-actions">
          <button class="btn" id="mc-sync"><i class="ti ti-refresh"></i> Sync announcements</button>
          <button class="btn" id="mc-digest"><i class="ti ti-file-text"></i> Weekly digest</button>
        </div>
      </div>

      <div class="kpi-row">
        <div class="kpi-tile">
          <div class="kpi-value info">${announcements.length}</div>
          <div class="kpi-label">Total Announcements</div>
        </div>
        <div class="kpi-tile">
          <div class="kpi-value warning">${notReviewedCount}</div>
          <div class="kpi-label">Not Reviewed</div>
        </div>
        <div class="kpi-tile">
          <div class="kpi-value success">${tasksCreatedCount}</div>
          <div class="kpi-label">Tasks Created</div>
        </div>
      </div>

      <div style="padding:12px;background:var(--color-background-primary);border:0.5px solid var(--color-border-secondary);border-radius:var(--border-radius-md);margin-bottom:16px">
        <div style="font-size:10px;font-weight:600;color:var(--color-text-secondary);margin-bottom:10px;text-transform:uppercase">Filters</div>
        <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(180px,1fr));gap:12px">
          <div>
            <label style="font-size:10px;color:var(--color-text-secondary);display:block;margin-bottom:6px">Service</label>
            <select id="filter-service" style="width:100%;padding:6px;font-size:10px;border:0.5px solid var(--color-border-secondary);border-radius:4px;background:var(--color-background-secondary)">
              <option value="">All Services</option>
            </select>
          </div>
          <div>
            <label style="font-size:10px;color:var(--color-text-secondary);display:block;margin-bottom:6px">Severity</label>
            <select id="filter-severity" style="width:100%;padding:6px;font-size:10px;border:0.5px solid var(--color-border-secondary);border-radius:4px;background:var(--color-background-secondary)">
              <option value="">All Severities</option>
              <option value="normal">Normal</option>
              <option value="high">High</option>
              <option value="critical">Critical</option>
            </select>
          </div>
          <div>
            <label style="font-size:10px;color:var(--color-text-secondary);display:block;margin-bottom:6px">Review Status</label>
            <select id="filter-review-status" style="width:100%;padding:6px;font-size:10px;border:0.5px solid var(--color-border-secondary);border-radius:4px;background:var(--color-background-secondary)">
              <option value="">All States</option>
              <option value="Not Reviewed">Not Reviewed</option>
              <option value="Reviewed">Reviewed</option>
            </select>
          </div>
          <div>
            <label style="font-size:10px;color:var(--color-text-secondary);display:block;margin-bottom:6px">Task Status</label>
            <select id="filter-task-status" style="width:100%;padding:6px;font-size:10px;border:0.5px solid var(--color-border-secondary);border-radius:4px;background:var(--color-background-secondary)">
              <option value="">All Tasks</option>
              <option value="Not Started">Not Started</option>
              <option value="In Progress">In Progress</option>
              <option value="Resolved">Resolved</option>
            </select>
          </div>
        </div>
      </div>

      <div class="card">
        <div class="card-header">
          <span class="card-title">Announcements Review Queue</span>
          <span class="badge info">${announcements.length} total</span>
        </div>
        <div style="max-height:700px;overflow-y:auto" id="announcements-container"></div>
      </div>

      <div class="card" style="margin-top:20px">
        <div class="card-header">
          <span class="card-title">📋 My Assigned Tasks</span>
          <span class="badge info" id="my-tasks-count" style="font-size:10px">0 tasks</span>
        </div>
        <div style="overflow-x:auto">
          <table style="width:100%;border-collapse:collapse;font-size:11px">
            <thead>
              <tr style="background:#f5f5f5;border-bottom:1px solid #ddd">
                <th style="padding:10px;text-align:left;font-weight:600;color:#333">Task Title</th>
                <th style="padding:10px;text-align:left;font-weight:600;color:#333">Status</th>
                <th style="padding:10px;text-align:left;font-weight:600;color:#333">Progress</th>
                <th style="padding:10px;text-align:left;font-weight:600;color:#333">Due Date</th>
                <th style="padding:10px;text-align:center;font-weight:600;color:#333">Update</th>
              </tr>
            </thead>
            <tbody id="my-tasks-tbody">
              <tr><td colspan="5" style="padding:20px;text-align:center;color:#999">No tasks assigned to you</td></tr>
            </tbody>
          </table>
        </div>
      </div>

      <div class="card" style="margin-top:20px">
        <div class="card-header">
          <span class="card-title">Admin Actions Summary</span>
          <span class="badge info" id="admin-actions-count">0 with actions</span>
        </div>
        <div style="overflow-x:auto">
          <table style="width:100%;border-collapse:collapse;font-size:11px" id="admin-actions-table">
            <thead>
              <tr style="background:#f5f5f5;border-bottom:1px solid #ddd">
                <th style="padding:10px;text-align:left;font-weight:600;color:#333">Message ID</th>
                <th style="padding:10px;text-align:left;font-weight:600;color:#333">Task Title</th>
                <th style="padding:10px;text-align:left;font-weight:600;color:#333">Task Status</th>
                <th style="padding:10px;text-align:left;font-weight:600;color:#333">Approval</th>
                <th style="padding:10px;text-align:left;font-weight:600;color:#333">Progress</th>
                <th style="padding:10px;text-align:left;font-weight:600;color:#333">Assigned To / Due</th>
                <th style="padding:10px;text-align:left;font-weight:600;color:#333">Notes</th>
              </tr>
            </thead>
            <tbody id="admin-actions-tbody">
              <tr><td colspan="6" style="padding:20px;text-align:center;color:#999">No actions taken yet</td></tr>
            </tbody>
          </table>
        </div>
      </div>
    `

    // Populate service filter options
    const services = [...new Set(announcements.map(a => a.service))].sort()
    const serviceSelect = el.querySelector('#filter-service')
    if (serviceSelect) {
      services.forEach(service => {
        const option = document.createElement('option')
        option.value = service
        option.textContent = service
        serviceSelect.appendChild(option)
      })
    }

    // Setup filter event listeners
    const setupFilters = () => {
      const filterService = el.querySelector('#filter-service')?.value || ''
      const filterSeverity = el.querySelector('#filter-severity')?.value || ''
      const filterReviewStatus = el.querySelector('#filter-review-status')?.value || ''
      const filterTaskStatus = el.querySelector('#filter-task-status')?.value || ''

      let visibleCount = 0

      // Show/hide announcements based on filters
      el.querySelectorAll('.mc-announcement-item').forEach((item) => {
        const service = item.dataset.service
        const severity = item.dataset.severity
        const reviewStatus = item.dataset.reviewStatus
        const taskStatus = item.dataset.taskStatus

        const matches =
          (!filterService || service === filterService) &&
          (!filterSeverity || severity === filterSeverity) &&
          (!filterReviewStatus || reviewStatus === filterReviewStatus) &&
          (!filterTaskStatus || taskStatus === filterTaskStatus)

        item.style.display = matches ? 'block' : 'none'
        if (matches) visibleCount++
      })

      // Update count badge
      const countBadges = el.querySelectorAll('.badge.info')
      countBadges.forEach(badge => {
        if (badge.textContent.includes('total')) {
          badge.textContent = `${visibleCount} total`
        }
      })
    }

    // Add filter event listeners
    el.querySelectorAll('#filter-service, #filter-severity, #filter-review-status, #filter-task-status').forEach(filter => {
      filter?.addEventListener('change', setupFilters)
    })

    // Render announcements
    const container = el.querySelector('#announcements-container')
    announcements.forEach((ann, idx) => {
      const reviewStatusColor = getStatusBadgeColor(ann.reviewStatus)
      const taskStatusColor = getStatusBadgeColor(ann.taskStatus)

      const announcementHTML = `
        <div class="mc-announcement-item" data-service="${ann.service}" data-severity="${ann.severity}" data-review-status="${ann.reviewStatus}" data-task-status="${ann.taskStatus}" style="border-bottom:0.5px solid var(--color-border-tertiary)">
          <div class="mc-announcement-header" data-idx="${idx}" style="padding:12px;cursor:pointer;transition:background 150ms;user-select:none">
            <div style="display:flex;justify-content:space-between;align-items:flex-start;gap:8px;margin-bottom:6px">
              <div style="flex:1">
                <div style="font-weight:600;font-size:12px;color:var(--color-text-primary)">${ann.title}</div>
                <div style="font-size:10px;color:var(--color-text-secondary);margin-top:4px">
                  Service: <strong>${ann.service}</strong> · Severity: <strong>${ann.severity}</strong>
                </div>
              </div>
              <div style="display:flex;gap:6px;align-items:flex-start;flex-shrink:0">
                <span class="badge ${reviewStatusColor}" style="font-size:9px">${ann.reviewStatus}</span>
                <span class="badge ${taskStatusColor}" style="font-size:9px">${ann.taskStatus}</span>
                <i class="ti ti-chevron-down mc-chevron" style="font-size:16px;color:#999;transition:transform 150ms;cursor:pointer;flex-shrink:0"></i>
              </div>
            </div>
            ${ann.actionDeadline ? `<div style="font-size:10px;color:var(--clr-danger-text);margin-top:6px">⚠️ Action required by: <strong>${ann.actionDeadline}</strong></div>` : ''}
          </div>
          <div class="mc-announcement-details" data-idx="${idx}" style="display:none;padding:12px;background:#f5f5f5;border-top:1px solid #ddd">
            <div style="display:flex;gap:16px;align-items:flex-start">
              <!-- Summary Section (3/4 width) -->
              <div style="flex:3;min-width:0">
                ${getAnnouncementDetailsHTML(ann)}
              </div>

              <!-- Admin Actions Section (1/4 width) -->
              <div style="flex:1;min-width:250px;padding:12px;background:#fff;border-radius:6px;border:1px solid #ddd">
                <div style="font-weight:700;font-size:11px;color:#333;margin-bottom:12px">Admin Actions</div>

                <div style="margin-bottom:12px">
                  <label style="font-size:10px;font-weight:600;color:#555;display:block;margin-bottom:6px">Review Status</label>
                  <select class="form-select review-status-select" data-item-id="${ann.id}" style="width:100%;padding:6px;font-size:10px;border:0.5px solid #ccc;border-radius:4px">
                    <option value="Not Reviewed" ${ann.reviewStatus === 'Not Reviewed' ? 'selected' : ''}>Not Reviewed</option>
                    <option value="Reviewed" ${ann.reviewStatus === 'Reviewed' ? 'selected' : ''}>Reviewed</option>
                  </select>
                </div>

                <div style="margin-bottom:12px">
                  <label style="font-size:10px;font-weight:600;color:#555;display:block;margin-bottom:6px">Assign To</label>
                  <input type="text" class="form-input assignee-input" data-item-id="${ann.id}" placeholder="Email or name..." value="${ann.assignedTo || ''}" style="width:100%;padding:6px;font-size:10px;border:0.5px solid #ccc;border-radius:4px">
                </div>

                <div style="margin-bottom:12px">
                  <label style="font-size:10px;font-weight:600;color:#555;display:block;margin-bottom:6px">Set Deadline</label>
                  <input type="date" class="form-input deadline-input" data-item-id="${ann.id}" value="${formatDateForInput(ann.actionDeadline)}" style="width:100%;padding:6px;font-size:10px;border:0.5px solid #ccc;border-radius:4px">
                </div>

                <div style="margin-bottom:12px">
                  <label style="font-size:10px;font-weight:600;color:#555;display:block;margin-bottom:6px">Notes</label>
                  <textarea class="form-textarea notes-textarea" data-item-id="${ann.id}" placeholder="Add notes..." style="width:100%;padding:6px;font-size:10px;border:0.5px solid #ccc;border-radius:4px;resize:vertical;min-height:60px">${ann.notes || ''}</textarea>
                </div>

                <div style="display:flex;gap:8px;flex-direction:column">
                  <button class="btn btn-primary save-announcement-btn" data-item-id="${ann.id}" style="width:100%;font-size:10px">
                    <i class="ti ti-device-floppy"></i> Save Changes
                  </button>
                  <div style="font-size:9px;color:#666;padding:8px;background:#f0f0f0;border-radius:4px;text-align:center">
                    💡 Task auto-created when Task Status is set
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      `

      container.innerHTML += announcementHTML
    })

    // Setup event handlers
    setupAnnouncementToggle(el)
    setupActionHandlers(el)

    // Initial population of admin actions table with tasks data
    try {
      const siteUrl = encodeURIComponent(state.settings.sharepointSiteUrl || 'root')
      const tasksResult = await fetch(`${api}/msgcenter/tasks?siteUrl=${siteUrl}`).then(r => r.json())
      const tasks = tasksResult.success ? (tasksResult.data || []) : []
      updateAdminActionsTable(announcements, tasks)
    } catch (tasksError) {
      console.warn('Could not fetch tasks:', tasksError.message)
      updateAdminActionsTable(announcements, [])
    }

    // Refresh button - just reload announcements from SharePoint
    el.querySelector('#mc-sync').addEventListener('click', async () => {
      const btn = el.querySelector('#mc-sync')
      btn.disabled = true
      btn.innerHTML = `<span class="spinner dark"></span> Refreshing...`
      await renderProductionMsgCenter(el)
    })
  } catch (error) {
    console.error('Error rendering Change Intelligence:', error)
    showToast(`Error: ${error.message}`, 'error')
  }
}

const handleAnnouncementClick = (e) => {
  const header = e.target.closest('.mc-announcement-header')
  if (!header) return

  const parentDiv = header.parentElement
  const idx = header.dataset.idx
  const details = parentDiv.querySelector(`.mc-announcement-details[data-idx="${idx}"]`)
  if (!details) return

  const isOpen = details.style.display !== 'none'

  if (isOpen) {
    details.style.display = 'none'
    header.style.background = ''
  } else {
    details.style.display = 'block'
    header.style.background = '#f0f0f0'
  }

  const chevron = header.querySelector('.mc-chevron')
  if (chevron) {
    chevron.style.transform = isOpen ? '' : 'rotate(180deg)'
  }
}

const setupAnnouncementToggle = (el) => {
  const container = el.querySelector('[style*="max-height:700px"]')
  if (!container) return

  container.removeEventListener('click', handleAnnouncementClick)
  container.addEventListener('click', handleAnnouncementClick)
}

const setupActionHandlers = (el) => {
  // Save changes button
  el.querySelectorAll('.save-announcement-btn').forEach(btn => {
    btn.addEventListener('click', async (e) => {
      const itemId = e.target.closest('button').dataset.itemId
      const detailsDiv = e.target.closest('.mc-announcement-details')

      const reviewStatus = detailsDiv.querySelector('.review-status-select').value
      const actionDeadline = detailsDiv.querySelector('.deadline-input').value
      const assignedTo = detailsDiv.querySelector('.assignee-input').value
      const notes = detailsDiv.querySelector('.notes-textarea').value

      console.log('📝 Saving announcement admin actions:', {
        itemId,
        reviewStatus,
        actionDeadline,
        assignedTo,
        assignedToLength: assignedTo?.length || 0
      })

      btn.disabled = true
      btn.innerHTML = `<span class="spinner dark"></span> Saving...`

      try {
        // First save the announcement admin actions
        const response = await fetch(`${api}/msgcenter/announcements/${itemId}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            reviewStatus,
            notes,
            actionDeadline,
            siteUrl: state.settings.sharepointSiteUrl || 'root'
          })
        })

        const result = await response.json()

        if (response.ok && result.success) {
          // Get the announcement data to create task
          try {
            const announcementCard = detailsDiv.closest('.mc-announcement-item')
            if (announcementCard) {
              const titleElem = announcementCard.querySelector('[style*="font-weight:600;font-size:12px"]')
              const serviceElem = announcementCard.querySelector('[style*="color:var(--color-text-secondary);margin-top:4px"]')

              const title = titleElem?.textContent || 'Change Announcement'
              let service = 'Microsoft 365'
              let severity = 'normal'

              if (serviceElem) {
                const serviceText = serviceElem.textContent
                const serviceMatch = serviceText.match(/Service: ([^·]+)/)
                const severityMatch = serviceText.match(/Severity: ([^·]+)/)
                if (serviceMatch) service = serviceMatch[1].trim()
                if (severityMatch) severity = severityMatch[1].trim().toLowerCase()
              }

              // Auto-create task if an assignee is provided
              if (assignedTo) {
                try {
                  console.log('🔄 Creating task with announcement data:', { title, service, severity, actionDeadline, assignedTo })
                  const taskResponse = await fetch(`${api}/msgcenter/create-task-from-announcement`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                      announcementItemId: itemId,
                      announcementData: { title, service, severity, actionDeadline, assignedTo },
                      siteUrl: state.settings.sharepointSiteUrl || 'root'
                    })
                  })
                  const taskResult = await taskResponse.json()
                  console.log('Task creation result:', taskResult)
                  if (taskResponse.ok && taskResult.success) {
                    console.log(`✓ Task created with assignee: ${assignedTo}`)
                  } else {
                    console.warn('Task creation failed:', taskResult.error)
                  }
                } catch (taskError) {
                  console.warn('Could not create task:', taskError.message)
                }
              }
            }
          } catch (dataError) {
            console.warn('Could not extract announcement data:', dataError.message)
          }

          showToast('✓ Changes saved successfully', 'success')

          // Refresh both announcements and tasks
          setTimeout(() => {
            const siteUrl = encodeURIComponent(state.settings.sharepointSiteUrl || 'root')
            Promise.all([
              fetch(`${api}/msgcenter/announcements?siteUrl=${siteUrl}`).then(r => r.json()),
              fetch(`${api}/msgcenter/tasks?siteUrl=${siteUrl}`).then(r => r.json())
            ])
            .then(([announcementsResult, tasksResult]) => {
              if (announcementsResult.success && announcementsResult.data) {
                // Update admin actions table with task data
                updateAdminActionsTable(announcementsResult.data, tasksResult.data || [])

                // Also update the announcement header to show new status
                const header = detailsDiv.closest('[style*="border-bottom"]').querySelector('.mc-announcement-header')
                const idx = header.dataset.idx
                const updatedAnn = announcementsResult.data[idx]
                if (updatedAnn) {
                  const badges = header.querySelectorAll('.badge')
                  if (badges[0]) badges[0].textContent = updatedAnn.reviewStatus
                  if (badges[1]) badges[1].textContent = updatedAnn.taskStatus
                }
              }
            })
            .catch(err => console.error('Error refreshing data:', err))
          }, 500)
        } else {
          showToast(`Error: ${result.error}`, 'error')
        }
      } catch (error) {
        showToast(`Error: ${error.message}`, 'error')
      } finally {
        btn.disabled = false
        btn.innerHTML = `<i class="ti ti-device-floppy"></i> Save Changes`
      }
    })
  })

  // Create task button
  el.querySelectorAll('.create-task-btn').forEach(btn => {
    btn.addEventListener('click', async (e) => {
      const itemId = e.target.closest('button').dataset.itemId
      const detailsDiv = e.target.closest('.mc-announcement-details')

      // Get announcement data from the details
      const title = detailsDiv.closest('[style*="border-bottom"]').querySelector('[style*="font-weight:600"]').textContent
      const description = detailsDiv.querySelector('[style*="border-left:3px"]')?.textContent || ''
      const service = detailsDiv.closest('[style*="border-bottom"]').querySelector('[style*="Service:"]').textContent.split('Service: ')[1].split(' ·')[0]
      const severity = detailsDiv.closest('[style*="border-bottom"]').querySelector('[style*="Severity:"]').textContent.split('Severity: ')[1]
      const actionDeadline = detailsDiv.querySelector('.deadline-input').value

      btn.disabled = true
      btn.innerHTML = `<span class="spinner dark"></span> Creating...`

      try {
        const response = await fetch(`${api}/msgcenter/create-task-from-announcement`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            announcementItemId: itemId,
            announcementData: { title, description, service, severity, actionDeadline },
            siteUrl: state.settings.sharepointSiteUrl || 'root'
          })
        })

        const result = await response.json()

        if (response.ok && result.success) {
          showToast('✓ Task created successfully', 'success')
          // Remove the button after task is created
          btn.style.display = 'none'
          // Refresh admin actions table and update header
          setTimeout(() => {
            const siteUrl = encodeURIComponent(state.settings.sharepointSiteUrl || 'root')
            fetch(`${api}/msgcenter/announcements?siteUrl=${siteUrl}`)
              .then(r => r.json())
              .then(result => {
                if (result.success && result.data) {
                  updateAdminActionsTable(result.data)
                  // Update header badges
                  const header = detailsDiv.closest('[style*="border-bottom"]').querySelector('.mc-announcement-header')
                  const idx = header.dataset.idx
                  const updatedAnn = result.data[idx]
                  if (updatedAnn) {
                    const badges = header.querySelectorAll('.badge')
                    if (badges[0]) badges[0].textContent = updatedAnn.reviewStatus
                    if (badges[1]) badges[1].textContent = updatedAnn.taskStatus
                  }
                }
              })
              .catch(err => console.error('Error refreshing announcements:', err))
          }, 500)
        } else {
          showToast(`Error: ${result.error}`, 'error')
        }
      } catch (error) {
        showToast(`Error: ${error.message}`, 'error')
      } finally {
        btn.disabled = false
        btn.innerHTML = `<i class="ti ti-circle-plus"></i> Create Task`
      }
    })
  })
}

function showAssigneeTaskUpdateModal(task) {
  const modal = document.createElement('div')
  modal.style.cssText = `
    position:fixed;top:0;left:0;right:0;bottom:0;background:rgba(0,0,0,0.5);
    display:flex;align-items:center;justify-content:center;z-index:1000
  `

  modal.innerHTML = `
    <div style="background:white;border-radius:8px;padding:24px;max-width:500px;width:90%;box-shadow:0 4px 12px rgba(0,0,0,0.15)">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:20px">
        <h2 style="margin:0;font-size:16px;font-weight:700">${task.title}</h2>
        <button class="close-modal" style="background:none;border:none;font-size:20px;cursor:pointer;color:#666">×</button>
      </div>

      <div style="background:#e3f2fd;border-left:4px solid #0066cc;padding:12px;border-radius:4px;margin-bottom:16px;font-size:10px;color:#0066cc">
        <strong>Status:</strong> ${task.taskStatus}<br>
        <strong>Approval:</strong> ${task.approvalStatus || 'Pending'}
      </div>

      <div style="margin-bottom:16px">
        <label style="font-size:11px;font-weight:600;color:#555;display:block;margin-bottom:6px">Progress (%)</label>
        <input type="range" id="progress-slider" min="0" max="100" value="${parseInt(task.progress) || 0}" style="width:100%;height:6px;cursor:pointer;margin-bottom:8px">
        <div style="display:flex;justify-content:space-between;align-items:center">
          <span id="progress-value" style="font-size:14px;font-weight:700;color:#4caf50">${parseInt(task.progress) || 0}%</span>
          <div style="font-size:9px;color:#666">Drag to update progress</div>
        </div>
      </div>

      <div style="margin-bottom:16px">
        <label style="font-size:11px;font-weight:600;color:#555;display:block;margin-bottom:6px">Task Status</label>
        <select id="modal-assignee-status" style="width:100%;padding:8px;font-size:11px;border:0.5px solid #ccc;border-radius:4px">
          <option value="Not Started" ${task.taskStatus === 'Not Started' ? 'selected' : ''}>Not Started</option>
          <option value="In Progress" ${task.taskStatus === 'In Progress' ? 'selected' : ''}>In Progress</option>
          <option value="Review" ${task.taskStatus === 'Review' ? 'selected' : ''}>Review</option>
          <option value="Resolved" ${task.taskStatus === 'Resolved' ? 'selected' : ''}>Resolved (needs approval)</option>
        </select>
      </div>

      <div style="background:#fff3cd;border-left:4px solid #ff9800;padding:12px;border-radius:4px;margin-bottom:16px;font-size:10px;color:#ff6600">
        <strong>ℹ️ Marking as "Resolved"</strong> will send it to the approvers for final approval.
      </div>

      <div style="display:flex;gap:8px;justify-content:flex-end">
        <button class="btn cancel-modal" style="background:#e0e0e0;color:#333">Cancel</button>
        <button class="btn btn-primary save-assignee-update" data-task-id="${task.id}">Update Progress</button>
      </div>
    </div>
  `

  document.body.appendChild(modal)

  const progressSlider = modal.querySelector('#progress-slider')
  const progressValue = modal.querySelector('#progress-value')

  progressSlider.addEventListener('input', (e) => {
    progressValue.textContent = e.target.value + '%'
  })

  modal.querySelector('.close-modal').addEventListener('click', () => modal.remove())
  modal.querySelector('.cancel-modal').addEventListener('click', () => modal.remove())

  modal.querySelector('.save-assignee-update').addEventListener('click', async (e) => {
    const btn = e.target
    const taskStatus = modal.querySelector('#modal-assignee-status').value
    const progress = modal.querySelector('#progress-slider').value + '%'

    btn.disabled = true
    btn.innerHTML = `<span class="spinner dark"></span> Updating...`

    try {
      const updatePayload = {
        taskStatus,
        progress,
        siteUrl: state.settings.sharepointSiteUrl || 'root'
      }

      // When assignee marks as resolved, set approval status to pending
      if (taskStatus === 'Resolved') {
        updatePayload.approvalStatus = 'Pending'
      }

      const response = await fetch(`${api}/msgcenter/tasks/${task.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatePayload)
      })

      const result = await response.json()

      if (response.ok && result.success) {
        showToast(`✓ Progress updated to ${progress}`, 'success')
        if (taskStatus === 'Resolved') {
          showToast('Sent to approvers for final approval', 'info')
        }
        modal.remove()
        // Refresh tasks
        const pageEl = document.getElementById('page-msgcenter')
        if (pageEl) {
          const siteUrl = encodeURIComponent(state.settings.sharepointSiteUrl || 'root')
          Promise.all([
            fetch(`${api}/msgcenter/announcements?siteUrl=${siteUrl}`).then(r => r.json()),
            fetch(`${api}/msgcenter/tasks?siteUrl=${siteUrl}`).then(r => r.json())
          ])
          .then(([announcementsResult, tasksResult]) => {
            if (announcementsResult.success && announcementsResult.data) {
              updateAdminActionsTable(announcementsResult.data, tasksResult.data || [])
            }
          })
        }
      } else {
        showToast(`Error: ${result.error}`, 'error')
      }
    } catch (error) {
      showToast(`Error: ${error.message}`, 'error')
    } finally {
      btn.disabled = false
      btn.innerHTML = 'Update Progress'
    }
  })
}

function showAdminActionEditModal(task) {
  const modal = document.createElement('div')
  modal.style.cssText = `
    position:fixed;top:0;left:0;right:0;bottom:0;background:rgba(0,0,0,0.5);
    display:flex;align-items:center;justify-content:center;z-index:1000
  `

  modal.innerHTML = `
    <div style="background:white;border-radius:8px;padding:24px;max-width:500px;width:90%;box-shadow:0 4px 12px rgba(0,0,0,0.15)">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:20px">
        <h2 style="margin:0;font-size:16px;font-weight:700">${task.title}</h2>
        <button class="close-modal" style="background:none;border:none;font-size:20px;cursor:pointer;color:#666">×</button>
      </div>

      <div style="background:#f5f5f5;padding:12px;border-radius:4px;margin-bottom:16px;font-size:10px;color:#666">
        <strong>Message ID:</strong> ${task.announcementId}<br>
        <strong>Service:</strong> ${task.service || '—'}<br>
        <strong>Approval:</strong> ${task.approvalStatus || 'Pending'}
      </div>

      <div style="margin-bottom:16px">
        <label style="font-size:11px;font-weight:600;color:#555;display:block;margin-bottom:6px">Task Status</label>
        <select id="modal-task-status" style="width:100%;padding:8px;font-size:11px;border:0.5px solid #ccc;border-radius:4px">
          <option value="Not Started" ${task.taskStatus === 'Not Started' ? 'selected' : ''}>Not Started</option>
          <option value="In Progress" ${task.taskStatus === 'In Progress' ? 'selected' : ''}>In Progress</option>
          <option value="Review" ${task.taskStatus === 'Review' ? 'selected' : ''}>Review</option>
          <option value="Resolved" ${task.taskStatus === 'Resolved' ? 'selected' : ''}>Resolved</option>
        </select>
      </div>

      <div style="margin-bottom:16px">
        <label style="font-size:11px;font-weight:600;color:#555;display:block;margin-bottom:6px">Progress (%)</label>
        <input type="number" id="modal-progress" min="0" max="100" value="${parseInt(task.progress) || 0}" style="width:100%;padding:8px;font-size:11px;border:0.5px solid #ccc;border-radius:4px">
      </div>

      <div style="margin-bottom:16px">
        <label style="font-size:11px;font-weight:600;color:#555;display:block;margin-bottom:6px">Assigned To</label>
        <input type="text" id="modal-assigned-to" value="${task.assignedTo || ''}" placeholder="Name or email" style="width:100%;padding:8px;font-size:11px;border:0.5px solid #ccc;border-radius:4px">
      </div>

      <div style="display:flex;gap:8px;justify-content:flex-end">
        <button class="btn cancel-modal" style="background:#e0e0e0;color:#333">Cancel</button>
        <button class="btn btn-primary save-admin-action" data-task-id="${task.id}">Save Changes</button>
      </div>
    </div>
  `

  document.body.appendChild(modal)

  modal.querySelector('.close-modal').addEventListener('click', () => modal.remove())
  modal.querySelector('.cancel-modal').addEventListener('click', () => modal.remove())

  modal.querySelector('.save-admin-action').addEventListener('click', async (e) => {
    const btn = e.target
    const taskStatus = modal.querySelector('#modal-task-status').value
    const progress = modal.querySelector('#modal-progress').value + '%'
    const assignedTo = modal.querySelector('#modal-assigned-to').value

    if (taskStatus === 'Resolved' && task.taskStatus !== 'Resolved') {
      showToast('Go to Change Tasks page to mark as Resolved (requires approval)', 'info')
      return
    }

    btn.disabled = true
    btn.innerHTML = `<span class="spinner dark"></span> Saving...`

    try {
      const response = await fetch(`${api}/msgcenter/tasks/${task.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          taskStatus,
          progress,
          assignedTo,
          siteUrl: state.settings.sharepointSiteUrl || 'root'
        })
      })

      const result = await response.json()

      if (response.ok && result.success) {
        showToast('✓ Task updated successfully', 'success')
        modal.remove()
        // Refresh admin actions table
        const pageEl = document.getElementById('page-msgcenter')
        if (pageEl) {
          const siteUrl = encodeURIComponent(state.settings.sharepointSiteUrl || 'root')
          Promise.all([
            fetch(`${api}/msgcenter/announcements?siteUrl=${siteUrl}`).then(r => r.json()),
            fetch(`${api}/msgcenter/tasks?siteUrl=${siteUrl}`).then(r => r.json())
          ])
          .then(([announcementsResult, tasksResult]) => {
            if (announcementsResult.success && announcementsResult.data) {
              updateAdminActionsTable(announcementsResult.data, tasksResult.data || [])
            }
          })
        }
      } else {
        showToast(`Error: ${result.error}`, 'error')
      }
    } catch (error) {
      showToast(`Error: ${error.message}`, 'error')
    } finally {
      btn.disabled = false
      btn.innerHTML = 'Save Changes'
    }
  })
}
