import { state } from '../app.js'
import { showToast } from '../components/toast.js'
import { getMessageCenterMessages, getServiceHealth, api } from '../lib/api-client.js'
import { skeletonLoader } from '../lib/skeleton-loader.js'

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

export async function initTasks() {
  const el = document.getElementById('page-tasks')
  if (!el) return

  // Show skeleton immediately
  el.innerHTML = `
    <div>
      ${skeletonLoader.renderPageHeader('Change Announcement Tasks', 'Track and manage change announcement implementation tasks', true)}
      ${skeletonLoader.renderMetricsRowSkeleton(4)}
      ${skeletonLoader.renderTableSkeleton(8, 8)}
    </div>
  `

  await renderTasks(el)
}

async function renderTasks(el) {
  el.innerHTML = `
    <div class="page-header">
      <div>
        <div class="page-title"><i class="ti ti-checkbox"></i> Change Announcement Tasks</div>
        <div class="page-subtitle">Track and manage change announcement implementation tasks</div>
      </div>
      <div class="page-actions">
        <button class="btn" id="tasks-refresh"><i class="ti ti-refresh"></i> Refresh</button>
      </div>
    </div>

    <div class="kpi-row">
      <div class="kpi-tile">
        <div class="kpi-value info" id="total-tasks">0</div>
        <div class="kpi-label">Total Tasks</div>
      </div>
      <div class="kpi-tile">
        <div class="kpi-value warning" id="pending-tasks">0</div>
        <div class="kpi-label">Pending Approval</div>
      </div>
      <div class="kpi-tile">
        <div class="kpi-value info" id="in-progress-tasks">0</div>
        <div class="kpi-label">In Progress</div>
      </div>
      <div class="kpi-tile">
        <div class="kpi-value success" id="resolved-tasks">0</div>
        <div class="kpi-label">Resolved</div>
      </div>
    </div>

    <div class="card">
      <div class="card-header">
        <span class="card-title">Tasks</span>
        <span class="badge info" id="task-count">0 tasks</span>
      </div>
      <div style="overflow-x:auto">
        <table style="width:100%;border-collapse:collapse;font-size:11px">
          <thead>
            <tr style="background:#f5f5f5;border-bottom:1px solid #ddd">
              <th style="padding:10px;text-align:left;font-weight:600;color:#333">Task Title</th>
              <th style="padding:10px;text-align:left;font-weight:600;color:#333">Service</th>
              <th style="padding:10px;text-align:left;font-weight:600;color:#333">Task Status</th>
              <th style="padding:10px;text-align:left;font-weight:600;color:#333">Approval</th>
              <th style="padding:10px;text-align:left;font-weight:600;color:#333">Progress</th>
              <th style="padding:10px;text-align:left;font-weight:600;color:#333">Assigned To</th>
              <th style="padding:10px;text-align:left;font-weight:600;color:#333">Due Date</th>
              <th style="padding:10px;text-align:center;font-weight:600;color:#333">Actions</th>
            </tr>
          </thead>
          <tbody id="tasks-tbody">
            <tr><td colspan="8" style="padding:20px;text-align:center;color:#999">Loading tasks...</td></tr>
          </tbody>
        </table>
      </div>
    </div>
  `

  try {
    const siteUrl = encodeURIComponent(state.settings.sharepointSiteUrl || 'root')
    const result = await fetch(`${api}/msgcenter/tasks?siteUrl=${siteUrl}`).then(r => r.json())

    if (!result.success || !result.data) {
      el.querySelector('#tasks-tbody').innerHTML = '<tr><td colspan="8" style="padding:20px;text-align:center;color:#999">No tasks found</td></tr>'
      return
    }

    const tasks = result.data
    const totalTasks = tasks.length
    const pendingApproval = tasks.filter(t => t.approvalStatus === 'Pending').length
    const inProgress = tasks.filter(t => t.taskStatus === 'In Progress').length
    const resolved = tasks.filter(t => t.taskStatus === 'Resolved').length

    // Update KPIs
    el.querySelector('#total-tasks').textContent = totalTasks
    el.querySelector('#pending-tasks').textContent = pendingApproval
    el.querySelector('#in-progress-tasks').textContent = inProgress
    el.querySelector('#resolved-tasks').textContent = resolved
    el.querySelector('#task-count').textContent = `${totalTasks} tasks`

    // Render tasks table
    const tbody = el.querySelector('#tasks-tbody')
    const userEmail = state.currentUser?.email?.toLowerCase() || ''
    const userRole = state.currentUser?.role || 'user'
    const primaryApprover = state.settings.primaryApprover?.toLowerCase() || ''
    const secondaryApprover = state.settings.secondaryApprover?.toLowerCase() || ''
    const isApprover = ['super', 'admin'].includes(userRole) || userEmail === primaryApprover || userEmail === secondaryApprover

    tbody.innerHTML = tasks.map(task => {
      const isResolved = task.taskStatus === 'Resolved'
      const isPendingApproval = task.approvalStatus === 'Pending' && isResolved && isApprover

      return `
        <tr style="border-bottom:0.5px solid #ddd;hover:background:#f9f9f9;${isResolved && !isPendingApproval ? 'opacity:0.7' : ''}">
          <td style="padding:10px;font-weight:600;color:#0066cc">${task.title}</td>
          <td style="padding:10px">${task.service || '—'}</td>
          <td style="padding:10px">
            <span class="badge ${getStatusColor(task.taskStatus)}" style="font-size:9px">${task.taskStatus}</span>
          </td>
          <td style="padding:10px">
            <span class="badge ${getStatusColor(task.approvalStatus)}" style="font-size:9px">${task.approvalStatus}</span>
          </td>
          <td style="padding:10px">
            <div style="width:80px;height:20px;background:#e0e0e0;border-radius:4px;overflow:hidden">
              <div style="width:${parseInt(task.progress) || 0}%;height:100%;background:#4CAF50;transition:width 200ms"></div>
            </div>
            <div style="font-size:9px;color:#666;margin-top:4px">${task.progress}</div>
          </td>
          <td style="padding:10px">${task.assignedTo || '—'}</td>
          <td style="padding:10px">${task.dueDate?.split('T')[0] || '—'}</td>
          <td style="padding:10px;text-align:center">
            ${isPendingApproval ? `
              <button class="btn-small approve-task-btn" data-task-id="${task.id}" style="font-size:9px;padding:4px 8px;cursor:pointer;background:#4caf50;color:white;border:none;border-radius:4px">
                <i class="ti ti-check"></i> Approve
              </button>
            ` : !isResolved ? `
              <button class="btn-small edit-task-btn" data-task-id="${task.id}" style="font-size:9px;padding:4px 8px;cursor:pointer">
                <i class="ti ti-pencil"></i> Edit
              </button>
            ` : `
              <span style="font-size:9px;color:#4caf50">✓ Resolved</span>
            `}
          </td>
        </tr>
      `
    }).join('')

    // Setup edit button handlers
    setupTaskHandlers(el, tasks)

    // Setup refresh button
    el.querySelector('#tasks-refresh').addEventListener('click', async () => {
      const btn = el.querySelector('#tasks-refresh')
      btn.disabled = true
      btn.innerHTML = `<span class="spinner dark"></span> Refreshing...`
      await renderTasks(el)
    })
  } catch (error) {
    console.error('Error rendering tasks:', error)
    showToast(`Error: ${error.message}`, 'error')
  }
}

function setupTaskHandlers(el, tasks) {
  el.querySelectorAll('.edit-task-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const taskId = e.target.closest('button').dataset.taskId
      const task = tasks.find(t => t.id === taskId)
      if (task) {
        showTaskEditModal(el, task)
      }
    })
  })

  el.querySelectorAll('.approve-task-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const taskId = e.target.closest('button').dataset.taskId
      const task = tasks.find(t => t.id === taskId)
      if (task) {
        showPendingApprovalModal(el, task)
      }
    })
  })
}

async function updateTaskApproval(taskId, approvalStatus, el) {
  try {
    const response = await fetch(`${api}/msgcenter/tasks/${taskId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        approvalStatus,
        siteUrl: state.settings.sharepointSiteUrl || 'root'
      })
    })

    const result = await response.json()

    if (response.ok && result.success) {
      showToast(`✓ Task ${approvalStatus.toLowerCase()} successfully`, 'success')
      // Refresh tasks list
      if (el) await renderTasks(el)
    } else {
      showToast(`Error: ${result.error}`, 'error')
    }
  } catch (error) {
    showToast(`Error: ${error.message}`, 'error')
  }
}

function showResolutionApprovalModal(taskId, progress, assignedTo) {
  const modal = document.createElement('div')
  modal.style.cssText = `
    position:fixed;top:0;left:0;right:0;bottom:0;background:rgba(0,0,0,0.5);
    display:flex;align-items:center;justify-content:center;z-index:1000
  `

  const userEmail = state.currentUser?.email?.toLowerCase() || ''
  const userRole = state.currentUser?.role || 'user'
  const primaryApprover = state.settings.primaryApprover?.toLowerCase() || ''
  const secondaryApprover = state.settings.secondaryApprover?.toLowerCase() || ''

  // Super/Admin can always approve, or if user is designated approver
  const canApprove = ['super', 'admin'].includes(userRole) || userEmail === primaryApprover || userEmail === secondaryApprover
  const isDesignatedApprover = userEmail === primaryApprover || userEmail === secondaryApprover
  const isAdminOverride = ['super', 'admin'].includes(userRole) && !isDesignatedApprover
  const approverName = state.currentUser?.name || 'Current User'
  const isSecondary = userEmail === secondaryApprover

  modal.innerHTML = `
    <div style="background:white;border-radius:8px;padding:24px;max-width:450px;width:90%;box-shadow:0 4px 12px rgba(0,0,0,0.15)">
      <h2 style="margin:0 0 16px 0;font-size:16px;font-weight:700;color:#333">Resolve Task - Final Approval</h2>

      <div style="background:#f0f4ff;border-left:4px solid #0066cc;padding:12px;border-radius:4px;margin-bottom:16px">
        <div style="font-size:11px;color:#0066cc;font-weight:600">⚠️ Final Resolution Approval Required</div>
        <div style="font-size:10px;color:#0066cc;margin-top:6px">Only designated approvers can mark this task as Resolved.</div>
      </div>

      <div style="background:#f5f5f5;border-left:4px solid #666;padding:12px;border-radius:4px;margin-bottom:16px;font-size:10px;color:#333">
        <div style="font-weight:600;margin-bottom:6px">📋 Designated Approvers:</div>
        <div style="margin:4px 0"><strong>Primary:</strong> ${primaryApprover || '<span style="color:#999">Not configured</span>'}</div>
        <div style="margin:4px 0"><strong>Secondary:</strong> ${secondaryApprover || '<span style="color:#999">Not configured</span>'}</div>
      </div>

      ${!primaryApprover && !secondaryApprover ? `
        <div style="background:#ffebee;border-left:4px solid #f44336;padding:12px;border-radius:4px;margin-bottom:16px">
          <div style="font-size:11px;color:#c62828;font-weight:600">⚠️ No approvers configured</div>
          <div style="font-size:10px;color:#c62828;margin-top:6px">Admin must configure approvers in Settings before tasks can be resolved.</div>
        </div>
      ` : isAdminOverride ? `
        <div style="background:#fff3e0;border-left:4px solid #ff9800;padding:12px;border-radius:4px;margin-bottom:16px">
          <div style="font-size:11px;color:#e65100;font-weight:600">🔑 Admin Override</div>
          <div style="font-size:10px;color:#e65100;margin-top:6px">You are a system ${userRole} and can approve even though you're not a designated approver. Approval will be recorded as <strong>Admin Override</strong>.</div>
        </div>
      ` : !canApprove ? `
        <div style="background:#ffcdd2;border-left:4px solid #f44336;padding:12px;border-radius:4px;margin-bottom:16px">
          <div style="font-size:11px;color:#c62828;font-weight:600">❌ You do not have approval permission</div>
          <div style="font-size:10px;color:#c62828;margin-top:6px">Only the designated approvers can approve task resolution. Contact <strong>${primaryApprover || 'Primary'}</strong> or <strong>${secondaryApprover || 'Secondary'}</strong>.</div>
        </div>
      ` : `
        <div style="background:#e8f5e9;border-left:4px solid #4caf50;padding:12px;border-radius:4px;margin-bottom:16px">
          <div style="font-size:11px;color:#2e7d32;font-weight:600">✓ You are an authorized approver</div>
          <div style="font-size:10px;color:#2e7d32;margin-top:6px">You (${approverName}) ${isSecondary ? '(Secondary Approver)' : '(Primary Approver)'} will approve this resolution.</div>
        </div>
      `}

      <div style="margin-bottom:16px">
        <label style="font-size:11px;font-weight:600;color:#555;display:block;margin-bottom:6px">Approval Notes (Optional)</label>
        <textarea id="approval-notes" placeholder="Add any notes about this resolution..." style="width:100%;padding:8px;font-size:11px;border:0.5px solid #ccc;border-radius:4px;resize:vertical;min-height:80px"></textarea>
      </div>

      <div style="display:flex;gap:8px;justify-content:flex-end">
        <button class="btn cancel-resolution" style="background:#e0e0e0;color:#333">Cancel</button>
        <button class="btn btn-primary confirm-resolution" data-task-id="${taskId}" data-progress="${progress}" data-assigned-to="${assignedTo}" data-admin-override="${isAdminOverride}" style="${!canApprove ? 'opacity:0.5;cursor:not-allowed' : ''}" ${!canApprove ? 'disabled' : ''}>
          ✓ Approve & Resolve Task
        </button>
      </div>
    </div>
  `

  document.body.appendChild(modal)

  modal.querySelector('.cancel-resolution').addEventListener('click', () => modal.remove())

  const hasApprovers = primaryApprover || secondaryApprover

  if (canApprove) {
    modal.querySelector('.confirm-resolution').addEventListener('click', async (e) => {
      const btn = e.target
      const progress = btn.dataset.progress
      const assignedTo = btn.dataset.assignedTo
      const adminOverride = btn.dataset.adminOverride === 'true'
      const approvalNotes = modal.querySelector('#approval-notes').value

      btn.disabled = true
      btn.innerHTML = `<span class="spinner dark"></span> Approving...`

      try {
        const response = await fetch(`${api}/msgcenter/tasks/${taskId}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            taskStatus: 'Resolved',
            approvalStatus: 'Approved',
            progress,
            assignedTo,
            notes: approvalNotes ? `[Admin: ${approvalNotes}]` : (adminOverride ? '[Admin Override]' : ''),
            siteUrl: state.settings.sharepointSiteUrl || 'root'
          })
        })

        const result = await response.json()

        if (response.ok && result.success) {
          showToast('✓ Task resolved and approved successfully', 'success')
          modal.remove()
          // Refresh tasks list
          const pageEl = document.getElementById('page-tasks')
          if (pageEl) await renderTasks(pageEl)
        } else {
          showToast(`Error: ${result.error}`, 'error')
        }
      } catch (error) {
        showToast(`Error: ${error.message}`, 'error')
      } finally {
        btn.disabled = false
        btn.innerHTML = '✓ Approve & Resolve Task'
      }
    })
  }
}

function showRejectModal(taskId, el) {
  const modal = document.createElement('div')
  modal.style.cssText = `
    position:fixed;top:0;left:0;right:0;bottom:0;background:rgba(0,0,0,0.5);
    display:flex;align-items:center;justify-content:center;z-index:1000
  `

  modal.innerHTML = `
    <div style="background:white;border-radius:8px;padding:24px;max-width:400px;width:90%;box-shadow:0 4px 12px rgba(0,0,0,0.15)">
      <h2 style="margin:0 0 16px 0;font-size:16px;font-weight:700">Reject Task</h2>
      <p style="margin:0 0 16px 0;color:#666;font-size:12px">Please provide a reason for rejection:</p>

      <textarea id="reject-reason" placeholder="Reason for rejection..." style="width:100%;padding:8px;font-size:11px;border:0.5px solid #ccc;border-radius:4px;resize:vertical;min-height:80px;margin-bottom:16px"></textarea>

      <div style="display:flex;gap:8px;justify-content:flex-end">
        <button class="btn cancel-reject" style="background:#e0e0e0;color:#333">Cancel</button>
        <button class="btn btn-primary confirm-reject" data-task-id="${taskId}" style="background:#f44336">Reject Task</button>
      </div>
    </div>
  `

  document.body.appendChild(modal)

  modal.querySelector('.cancel-reject').addEventListener('click', () => modal.remove())

  modal.querySelector('.confirm-reject').addEventListener('click', async (e) => {
    const reason = modal.querySelector('#reject-reason').value || 'No reason provided'
    const btn = e.target
    btn.disabled = true
    btn.innerHTML = `<span class="spinner dark"></span> Rejecting...`

    try {
      const response = await fetch(`${api}/msgcenter/tasks/${taskId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          approvalStatus: 'Rejected',
          notes: reason,
          siteUrl: state.settings.sharepointSiteUrl || 'root'
        })
      })

      const result = await response.json()

      if (response.ok && result.success) {
        showToast('✓ Task rejected successfully', 'success')
        modal.remove()
        // Refresh tasks list
        const pageEl = document.getElementById('page-tasks')
        if (pageEl) await renderTasks(pageEl)
      } else {
        showToast(`Error: ${result.error}`, 'error')
      }
    } catch (error) {
      showToast(`Error: ${error.message}`, 'error')
    } finally {
      btn.disabled = false
      btn.innerHTML = 'Reject Task'
    }
  })
}

function showPendingApprovalModal(el, task) {
  const modal = document.createElement('div')
  modal.style.cssText = `
    position:fixed;top:0;left:0;right:0;bottom:0;background:rgba(0,0,0,0.5);
    display:flex;align-items:center;justify-content:center;z-index:1000
  `

  const userEmail = state.currentUser?.email?.toLowerCase() || ''
  const userRole = state.currentUser?.role || 'user'
  const primaryApprover = state.settings.primaryApprover?.toLowerCase() || ''
  const secondaryApprover = state.settings.secondaryApprover?.toLowerCase() || ''
  const isApprover = ['super', 'admin'].includes(userRole) || userEmail === primaryApprover || userEmail === secondaryApprover
  const approverName = state.currentUser?.name || 'Approver'
  const isSecondary = userEmail === secondaryApprover

  modal.innerHTML = `
    <div style="background:white;border-radius:8px;padding:24px;max-width:500px;width:90%;box-shadow:0 4px 12px rgba(0,0,0,0.15)">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:16px">
        <h2 style="margin:0;font-size:16px;font-weight:700">Review Pending Approval</h2>
        <button class="close-modal" style="background:none;border:none;font-size:20px;cursor:pointer;color:#666">×</button>
      </div>

      <div style="background:#fff3cd;border-left:4px solid #ff9800;padding:12px;border-radius:4px;margin-bottom:16px">
        <div style="font-size:11px;color:#ff6600;font-weight:600">⏳ Waiting for Approval</div>
        <div style="font-size:10px;color:#ff6600;margin-top:6px"><strong>${task.title}</strong> has been marked as resolved and is waiting for your final approval.</div>
      </div>

      <div style="background:#f5f5f5;border-left:4px solid #666;padding:12px;border-radius:4px;margin-bottom:16px;font-size:10px;color:#333">
        <div><strong>Task Status:</strong> ${task.taskStatus}</div>
        <div><strong>Progress:</strong> ${task.progress}</div>
        <div><strong>Assigned To:</strong> ${task.assignedTo || '—'}</div>
        <div><strong>Due Date:</strong> ${task.dueDate?.split('T')[0] || '—'}</div>
        <div style="margin-top:6px"><strong>Approval Status:</strong> ${task.approvalStatus}</div>
      </div>

      <div style="margin-bottom:16px">
        <label style="font-size:11px;font-weight:600;color:#555;display:block;margin-bottom:6px">Approval Notes (Optional)</label>
        <textarea id="approval-notes" placeholder="Add any notes about this approval..." style="width:100%;padding:8px;font-size:11px;border:0.5px solid #ccc;border-radius:4px;resize:vertical;min-height:60px"></textarea>
      </div>

      <div style="display:flex;gap:8px;justify-content:flex-end">
        <button class="btn cancel-approval" style="background:#e0e0e0;color:#333">Cancel</button>
        <button class="btn" id="reject-approval" data-task-id="${task.id}" style="background:#f44336;color:white;border:none;cursor:pointer">✗ Reject</button>
        <button class="btn btn-primary approve-resolution" data-task-id="${task.id}">✓ Approve & Resolve</button>
      </div>
    </div>
  `

  document.body.appendChild(modal)

  modal.querySelector('.close-modal').addEventListener('click', () => modal.remove())
  modal.querySelector('.cancel-approval').addEventListener('click', () => modal.remove())

  modal.querySelector('#reject-approval').addEventListener('click', () => {
    modal.remove()
    showRejectModal(task.id, el)
  })

  modal.querySelector('.approve-resolution').addEventListener('click', async (e) => {
    const btn = e.target
    const approvalNotes = modal.querySelector('#approval-notes').value

    btn.disabled = true
    btn.innerHTML = `<span class="spinner dark"></span> Approving...`

    try {
      const response = await fetch(`${api}/msgcenter/tasks/${task.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          approvalStatus: 'Approved',
          notes: approvalNotes ? `[Approval: ${approvalNotes}]` : '',
          siteUrl: state.settings.sharepointSiteUrl || 'root'
        })
      })

      const result = await response.json()

      if (response.ok && result.success) {
        showToast('✓ Task approved successfully', 'success')
        modal.remove()
        // Refresh tasks list
        const pageEl = document.getElementById('page-tasks')
        if (pageEl) await renderTasks(pageEl)
      } else {
        showToast(`Error: ${result.error}`, 'error')
      }
    } catch (error) {
      showToast(`Error: ${error.message}`, 'error')
    } finally {
      btn.disabled = false
      btn.innerHTML = '✓ Approve & Resolve'
    }
  })
}

function showTaskEditModal(el, task) {
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

      <div style="margin-bottom:16px">
        <label style="font-size:11px;font-weight:600;color:#555;display:block;margin-bottom:6px">Task Status</label>
        <select id="modal-task-status" style="width:100%;padding:8px;font-size:11px;border:0.5px solid #ccc;border-radius:4px">
          <option value="Not Started" ${task.taskStatus === 'Not Started' ? 'selected' : ''}>Not Started</option>
          <option value="In Progress" ${task.taskStatus === 'In Progress' ? 'selected' : ''}>In Progress</option>
          <option value="Review" ${task.taskStatus === 'Review' ? 'selected' : ''}>Review</option>
          <option value="Resolved" ${task.taskStatus === 'Resolved' ? 'selected' : ''}>Resolved</option>
        </select>
        <div style="font-size:9px;color:#0066cc;margin-top:6px">💡 Changing to "Resolved" requires Manager/Admin approval</div>
      </div>

      <div style="background:#e3f2fd;border-left:4px solid #0066cc;padding:12px;border-radius:4px;margin-bottom:16px">
        <div style="font-size:11px;color:#0066cc;font-weight:600">ℹ️ Approval Status: ${task.approvalStatus}</div>
        <div style="font-size:10px;color:#0066cc;margin-top:6px">Approval is required when marking this task as <strong>Resolved</strong>.</div>
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
        <button class="btn btn-primary save-task-btn" data-task-id="${task.id}">Save Changes</button>
      </div>
    </div>
  `

  document.body.appendChild(modal)

  // Close handlers
  modal.querySelector('.close-modal').addEventListener('click', () => modal.remove())
  modal.querySelector('.cancel-modal').addEventListener('click', () => modal.remove())

  // Save handler
  modal.querySelector('.save-task-btn').addEventListener('click', async (e) => {
    const btn = e.target
    const taskStatus = modal.querySelector('#modal-task-status').value
    const progress = modal.querySelector('#modal-progress').value + '%'
    const assignedTo = modal.querySelector('#modal-assigned-to').value

    // If marking as Resolved, show approval workflow
    if (taskStatus === 'Resolved' && task.taskStatus !== 'Resolved') {
      modal.remove()
      showResolutionApprovalModal(task.id, progress, assignedTo)
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
        // Refresh tasks list
        const pageEl = document.getElementById('page-tasks')
        if (pageEl) await renderTasks(pageEl)
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
