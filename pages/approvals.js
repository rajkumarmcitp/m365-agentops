// ============================================================
// Approvals Dashboard
// Managers review and approve/reject service requests
// ============================================================

import { showToast } from '../components/toast.js'
import { api } from '../lib/api-client.js'

let approvalView = 'dashboard'  // 'dashboard' | 'details' | 'audit'
let selectedRequest = null
let allRequests = []
let allLogs = []
let filterStatus = 'PENDING_APPROVAL'

export async function initApprovals() {
  const el = document.getElementById('page-approvals')
  if (!el) return

  render(el)
  await loadData(el)
}

async function loadData(el) {
  try {
    // Load requests pending approval
    const requestsRes = await fetch(`${api}/requests?status=${filterStatus}&limit=50`)
    const requestsData = await requestsRes.json()
    allRequests = Array.isArray(requestsData.data) ? requestsData.data : []

    // Load audit logs
    const logsRes = await fetch(`${api}/audit-logs?limit=20`)
    const logsData = await logsRes.json()
    // Handle nested data structure: {success, data: {data: [...], total, etc}}
    allLogs = Array.isArray(logsData.data?.data) ? logsData.data.data : Array.isArray(logsData.data) ? logsData.data : []

    render(el)
  } catch (error) {
    console.error('Error loading approvals data:', error)
    showToast('Failed to load approvals data', 'error')
  }
}

function render(el) {
  if (approvalView === 'dashboard') {
    renderDashboard(el)
  } else if (approvalView === 'details') {
    renderRequestDetails(el)
  } else if (approvalView === 'audit') {
    renderAuditLog(el)
  }
}

// ============================================================
// Dashboard View
// ============================================================
function renderDashboard(el) {
  if (!el) {
    console.error('❌ Page element not found')
    return
  }

  el.innerHTML = `
    <div class="page-header">
      <div>
        <div class="page-title"><i class="ti ti-check-circle"></i> Approvals Dashboard</div>
        <div class="page-subtitle">Review and approve service requests</div>
      </div>
      <div class="page-actions">
        <button class="btn" id="view-audit-btn"><i class="ti ti-history"></i> Audit Log</button>
      </div>
    </div>

    <!-- Status Filters -->
    <div class="card mb-3">
      <div style="display:flex;gap:8px;flex-wrap:wrap">
        ${['PENDING_APPROVAL', 'APPROVED', 'REJECTED', 'COMPLETED'].map(status => `
          <button class="btn ${filterStatus === status ? 'btn-primary' : ''}" id="filter-${status}" style="padding:6px 12px;font-size:11px">
            ${getStatusBadge(status)} ${status}
          </button>
        `).join('')}
      </div>
    </div>

    <!-- Requests Table -->
    <div class="card">
      <div class="card-header">
        <span class="card-title">Service Requests (${allRequests.length})</span>
      </div>
      <div style="padding:0;overflow-x:auto;border-top:0.5px solid var(--color-border-secondary)">
        ${allRequests.length === 0 ? `
          <div style="padding:20px;text-align:center;color:var(--color-text-tertiary)">
            <i class="ti ti-inbox" style="font-size:28px;margin-bottom:8px;display:block"></i>
            No requests found
          </div>
        ` : `
          <table style="width:100%;border-collapse:collapse;font-size:11px">
            <thead style="background:var(--color-background-secondary)">
              <tr>
                <th style="padding:10px 12px;text-align:left;font-weight:600">ID</th>
                <th style="padding:10px 12px;text-align:left;font-weight:600">Operation</th>
                <th style="padding:10px 12px;text-align:left;font-weight:600">Submitted By</th>
                <th style="padding:10px 12px;text-align:left;font-weight:600">Risk</th>
                <th style="padding:10px 12px;text-align:left;font-weight:600">Status</th>
                <th style="padding:10px 12px;text-align:left;font-weight:600">Submitted</th>
                <th style="padding:10px 12px;text-align:center">Actions</th>
              </tr>
            </thead>
            <tbody>
              ${allRequests.map(req => `
                <tr style="border-bottom:0.5px solid var(--color-border-tertiary);cursor:pointer" id="req-${req.id}" data-id="${req.id}">
                  <td style="padding:10px 12px"><strong>${req.id}</strong></td>
                  <td style="padding:10px 12px">${req.operationId.split('-')[0]}</td>
                  <td style="padding:10px 12px">${req.submittedBy}</td>
                  <td style="padding:10px 12px">
                    <span style="padding:2px 6px;border-radius:3px;font-size:10px;background:${getRiskColor(req.validation?.riskLevel)};color:white">
                      ${req.validation?.riskLevel || 'MEDIUM'}
                    </span>
                  </td>
                  <td style="padding:10px 12px">${getStatusBadge(req.status)}</td>
                  <td style="padding:10px 12px;font-size:10px;color:var(--color-text-secondary)">
                    ${new Date(req.submittedAt).toLocaleString()}
                  </td>
                  <td style="padding:10px 12px;text-align:center">
                    ${req.status === 'PENDING_APPROVAL' ? `
                      <button class="btn-sm-approve" data-id="${req.id}" style="padding:4px 8px;font-size:9px;background:var(--clr-success-bg);color:var(--clr-success-text);border:none;border-radius:3px;cursor:pointer">
                        ✓ Review
                      </button>
                    ` : `
                      <span style="color:var(--color-text-tertiary);font-size:10px">${req.status}</span>
                    `}
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        `}
      </div>
    </div>
  `

  // Event handlers
  if (el && el.querySelectorAll) {
    ['PENDING_APPROVAL', 'APPROVED', 'REJECTED', 'COMPLETED'].forEach(status => {
      const btn = el.querySelector(`#filter-${status}`)
      if (btn) {
        btn.addEventListener('click', () => {
          filterStatus = status
          render(el)
          loadData(el)
        })
      }
    })
  }

  if (el && el.querySelectorAll) {
    el.querySelectorAll('.btn-sm-approve').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation()
        const id = btn.dataset.id
        selectedRequest = allRequests.find(r => r.id === id)
        approvalView = 'details'
        render(el)
      })
    })

    const auditBtn = el.querySelector('#view-audit-btn')
    if (auditBtn) {
      auditBtn.addEventListener('click', () => {
        approvalView = 'audit'
        render(el)
      })
    }

    // Row click to view details
    el.querySelectorAll('tr[data-id]').forEach(row => {
      row.addEventListener('click', () => {
        const id = row.dataset.id
        selectedRequest = allRequests.find(r => r.id === id)
        approvalView = 'details'
        render(el)
      })
    })
  }
}

// ============================================================
// Request Details View
// ============================================================
function renderRequestDetails(el) {
  if (!el || !selectedRequest) return

  const req = selectedRequest
  const nextApproval = getNextApprovalStep(req)

  el.innerHTML = `
    <div class="page-header">
      <div style="display:flex;align-items:center;gap:10px">
        <button class="btn" id="details-back"><i class="ti ti-arrow-left"></i> Back</button>
        <div>
          <div class="page-title">${req.id}</div>
          <div class="page-subtitle">${req.operationId} • ${getStatusBadge(req.status)}</div>
        </div>
      </div>
    </div>

    <div class="grid-2" style="gap:16px">
      <!-- Request Details -->
      <div>
        <div class="card mb-3">
          <div class="card-header"><span class="card-title">Request Information</span></div>
          <div style="padding:16px;border-top:0.5px solid var(--color-border-secondary)">
            <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;font-size:11px">
              <div>
                <div style="font-weight:600;color:var(--color-text-tertiary);font-size:10px;margin-bottom:2px">Submitted By</div>
                <div>${req.submittedBy}</div>
              </div>
              <div>
                <div style="font-weight:600;color:var(--color-text-tertiary);font-size:10px;margin-bottom:2px">Submitted Date</div>
                <div>${new Date(req.submittedAt).toLocaleString()}</div>
              </div>
              <div>
                <div style="font-weight:600;color:var(--color-text-tertiary);font-size:10px;margin-bottom:2px">Operation</div>
                <div>${req.operationId}</div>
              </div>
              <div>
                <div style="font-weight:600;color:var(--color-text-tertiary);font-size:10px;margin-bottom:2px">Status</div>
                <div>${req.status}</div>
              </div>
            </div>
          </div>
        </div>

        <!-- Risk Assessment -->
        <div class="card mb-3">
          <div class="card-header"><span class="card-title">Risk Assessment</span></div>
          <div style="padding:16px;border-top:0.5px solid var(--color-border-secondary)">
            <div style="margin-bottom:12px">
              <div style="display:flex;align-items:center;gap:10px">
                <div style="font-size:24px;font-weight:600;color:${getRiskColor(req.validation?.riskLevel)}">${req.validation?.riskScore || 0}</div>
                <div>
                  <div style="font-size:12px;font-weight:600">${req.validation?.riskLevel || 'UNKNOWN'} Risk</div>
                  <div style="font-size:10px;color:var(--color-text-secondary)">Risk Score (0-100)</div>
                </div>
              </div>
            </div>

            <!-- Validation Checks -->
            <div style="border-top:0.5px solid var(--color-border-tertiary);padding-top:10px">
              ${(req.validation?.checks || []).map(check => `
                <div style="display:flex;gap:8px;margin-bottom:8px;font-size:10px">
                  <div style="flex-shrink:0">
                    ${check.status === 'PASS' ? '<i class="ti ti-circle-check" style="color:var(--clr-success-text)"></i>' :
                      check.status === 'FAIL' ? '<i class="ti ti-circle-x" style="color:var(--clr-danger-text)"></i>' :
                      '<i class="ti ti-alert-circle" style="color:var(--clr-warning-text)"></i>'}
                  </div>
                  <div>
                    <div style="font-weight:600">${check.message}</div>
                  </div>
                </div>
              `).join('')}
            </div>
          </div>
        </div>

        <!-- Request Fields -->
        <div class="card">
          <div class="card-header"><span class="card-title">Request Fields</span></div>
          <div style="padding:16px;border-top:0.5px solid var(--color-border-secondary);font-size:11px">
            ${Object.entries(req.fields).map(([key, value]) => `
              <div style="display:grid;grid-template-columns:150px 1fr;gap:12px;margin-bottom:8px;padding-bottom:8px;border-bottom:0.5px solid var(--color-border-tertiary)">
                <div style="font-weight:600;color:var(--color-text-secondary)">${key}</div>
                <div style="word-break:break-all">${value}</div>
              </div>
            `).join('')}
          </div>
        </div>
      </div>

      <!-- Approval Workflow & Comments -->
      <div>
        <!-- Approval Status -->
        <div class="card mb-3">
          <div class="card-header"><span class="card-title">Approval Workflow</span></div>
          <div style="padding:16px;border-top:0.5px solid var(--color-border-secondary)">
            ${(req.validation?.approvalPath || []).map((step, idx) => {
              const approval = req.approvals.find(a => a.step === step)
              const isPending = !approval && (step !== 'agent' && step !== 'action')
              const isCompleted = approval?.status === 'APPROVED'

              return `
                <div style="display:flex;gap:10px;margin-bottom:12px;align-items:flex-start">
                  <div style="flex-shrink:0;width:24px;height:24px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:12px;${
                    isCompleted ? 'background:var(--clr-success-bg);color:var(--clr-success-text)' :
                    isPending ? 'background:var(--clr-warning-bg);color:var(--clr-warning-text)' :
                    'background:var(--color-background-tertiary);color:var(--color-text-secondary)'
                  }">
                    ${isCompleted ? '✓' : isPending ? '◯' : '—'}
                  </div>
                  <div style="flex:1;font-size:11px">
                    <div style="font-weight:600;text-transform:capitalize">${step}</div>
                    ${isCompleted ? `
                      <div style="color:var(--clr-success-text);font-size:10px">Approved by ${approval.approverEmail}</div>
                      <div style="color:var(--color-text-tertiary);font-size:9px">${new Date(approval.approvedAt).toLocaleString()}</div>
                    ` : isPending ? `
                      <div style="color:var(--clr-warning-text);font-size:10px">Waiting for approval</div>
                    ` : ''}
                  </div>
                </div>
              `
            }).join('')}
          </div>
        </div>

        <!-- Approval Actions (if pending) -->
        ${req.status === 'PENDING_APPROVAL' && nextApproval ? `
          <div class="card mb-3">
            <div class="card-header"><span class="card-title">Your Action</span></div>
            <div style="padding:16px;border-top:0.5px solid var(--color-border-secondary)">
              <textarea id="approval-comment" placeholder="Add comment (optional)" style="width:100%;padding:8px;border:0.5px solid var(--color-border-secondary);border-radius:4px;font-size:11px;resize:vertical;min-height:60px;margin-bottom:12px"></textarea>
              <div style="display:flex;gap:8px">
                <button class="btn btn-primary" id="approve-btn" style="flex:1;padding:8px">
                  <i class="ti ti-check"></i> Approve
                </button>
                <button class="btn" id="reject-btn" style="flex:1;padding:8px">
                  <i class="ti ti-x"></i> Reject
                </button>
              </div>
            </div>
          </div>
        ` : ''}

        <!-- Comments -->
        <div class="card">
          <div class="card-header"><span class="card-title">Comments (${req.comments.length})</span></div>
          <div style="padding:16px;border-top:0.5px solid var(--color-border-secondary);max-height:300px;overflow-y:auto">
            ${req.comments.length === 0 ? `
              <div style="text-align:center;color:var(--color-text-tertiary);font-size:11px">No comments yet</div>
            ` : `
              ${req.comments.map(comment => `
                <div style="margin-bottom:12px;padding:10px;background:var(--color-background-secondary);border-radius:4px;font-size:10px">
                  <div style="font-weight:600;margin-bottom:3px">${comment.userName}</div>
                  <div style="color:var(--color-text-secondary);margin-bottom:6px">${comment.text}</div>
                  <div style="font-size:9px;color:var(--color-text-tertiary)">${new Date(comment.createdAt).toLocaleString()}</div>
                </div>
              `).join('')}
            `}
          </div>
        </div>
      </div>
    </div>
  `

  // Event handlers
  el.querySelector('#details-back').addEventListener('click', () => {
    approvalView = 'dashboard'
    render(el)
  })

  if (req.status === 'PENDING_APPROVAL' && nextApproval) {
    el.querySelector('#approve-btn').addEventListener('click', async () => {
      const comment = el.querySelector('#approval-comment').value
      await submitApproval(req.id, 'APPROVED', nextApproval.step, comment, el)
    })

    el.querySelector('#reject-btn').addEventListener('click', async () => {
      const comment = el.querySelector('#approval-comment').value
      if (!comment) {
        showToast('Please provide a reason for rejection', 'warning')
        return
      }
      await submitApproval(req.id, 'REJECTED', nextApproval.step, comment, el)
    })
  }
}

// ============================================================
// Audit Log View
// ============================================================
function renderAuditLog(el) {
  if (!el) return

  el.innerHTML = `
    <div class="page-header">
      <div style="display:flex;align-items:center;gap:10px">
        <button class="btn" id="audit-back"><i class="ti ti-arrow-left"></i> Back</button>
        <div>
          <div class="page-title">Audit Log</div>
          <div class="page-subtitle">Track all requests, approvals, and system actions</div>
        </div>
      </div>
    </div>

    <!-- Audit Log Table -->
    <div class="card">
      <div class="card-header"><span class="card-title">Activity Log - All System Approvals</span></div>
      <div style="padding:0;overflow-x:auto;border-top:0.5px solid var(--color-border-secondary)">
        <table style="width:100%;border-collapse:collapse;font-size:10px">
          <thead style="background:var(--color-background-secondary)">
            <tr>
              <th style="padding:10px 12px;text-align:left;font-weight:600">Timestamp</th>
              <th style="padding:10px 12px;text-align:left;font-weight:600">Action</th>
              <th style="padding:10px 12px;text-align:left;font-weight:600">User/Approver</th>
              <th style="padding:10px 12px;text-align:left;font-weight:600">Role</th>
              <th style="padding:10px 12px;text-align:left;font-weight:600">Request ID</th>
              <th style="padding:10px 12px;text-align:center;font-weight:600">Risk Level</th>
              <th style="padding:10px 12px;text-align:left;font-weight:600">Reason/Comment</th>
            </tr>
          </thead>
          <tbody>
            ${allLogs.map(log => {
              const riskLevel = log.details?.riskLevel || 'N/A'
              const riskColor = {
                'LOW': '#10b981',
                'MEDIUM': '#f59e0b',
                'HIGH': '#ef4444',
                'CRITICAL': '#991b1b',
                'N/A': '#9ca3af'
              }[riskLevel] || '#9ca3af'

              // Extract approver role from action details
              const approverRole = log.details?.step || log.details?.rejectorRole || '—'

              // Get reason/comment
              const reason = log.details?.reason || log.details?.comment || log.details?.operationId || '—'

              return `
                <tr style="border-bottom:0.5px solid var(--color-border-tertiary);background:${
                  log.action.includes('REJECTED') ? 'rgba(239, 68, 68, 0.05)' :
                  log.action.includes('APPROVED') ? 'rgba(16, 185, 129, 0.05)' :
                  'transparent'
                }">
                  <td style="padding:10px 12px;white-space:nowrap;font-size:9px">${new Date(log.timestamp).toLocaleString()}</td>
                  <td style="padding:10px 12px;font-size:9px">
                    <span style="padding:3px 8px;border-radius:3px;background:${
                      log.action.includes('REJECTED') ? 'var(--clr-danger-bg)' :
                      log.action.includes('APPROVED') ? 'var(--clr-success-bg)' :
                      'var(--color-background-secondary)'
                    };color:${
                      log.action.includes('REJECTED') ? 'var(--clr-danger-text)' :
                      log.action.includes('APPROVED') ? 'var(--clr-success-text)' :
                      'var(--color-text-primary)'
                    };font-weight:600">
                      ${log.action}
                    </span>
                  </td>
                  <td style="padding:10px 12px;font-size:9px;font-weight:600">${log.user}</td>
                  <td style="padding:10px 12px;font-size:9px;text-transform:capitalize">${approverRole}</td>
                  <td style="padding:10px 12px;font-family:monospace;font-size:9px"><strong>${log.requestId || '—'}</strong></td>
                  <td style="padding:10px 12px;text-align:center">
                    <span style="padding:4px 10px;border-radius:3px;background:${riskColor};color:white;font-weight:600;font-size:9px;display:inline-block">
                      ${riskLevel}
                    </span>
                  </td>
                  <td style="padding:10px 12px;font-size:9px;color:var(--color-text-secondary);max-width:200px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">
                    ${reason}
                  </td>
                </tr>
              `
            }).join('')}
          </tbody>
        </table>
      </div>
    </div>
  `

  el.querySelector('#audit-back').addEventListener('click', () => {
    approvalView = 'dashboard'
    render(el)
  })
}

// ============================================================
// Helpers
// ============================================================
function getStatusBadge(status) {
  const badges = {
    'PENDING_APPROVAL': '<span style="color:var(--clr-warning-text)">⏳</span>',
    'APPROVED': '<span style="color:var(--clr-success-text)">✓</span>',
    'REJECTED': '<span style="color:var(--clr-danger-text)">✗</span>',
    'COMPLETED': '<span style="color:var(--clr-success-text)">✓✓</span>',
    'FAILED': '<span style="color:var(--clr-danger-text)">!</span>'
  }
  return badges[status] || status
}

function getRiskColor(level) {
  const colors = {
    'LOW': '#10b981',
    'MEDIUM': '#f59e0b',
    'HIGH': '#ef4444',
    'CRITICAL': '#991b1b'
  }
  return colors[level] || '#6b7280'
}

function getNextApprovalStep(request) {
  if (request.status !== 'PENDING_APPROVAL') return null

  const approvalPath = request.validation?.approvalPath || ['manager', 'it', 'agent', 'action']

  for (const step of approvalPath) {
    if (step === 'agent' || step === 'action') continue
    const approved = request.approvals.find(a => a.step === step && a.status === 'APPROVED')
    if (!approved) {
      return {
        step,
        approverRole: step,
        status: 'PENDING'
      }
    }
  }

  return null
}

async function submitApproval(requestId, action, step, comment, el) {
  try {
    const endpoint = action === 'APPROVED' ? 'approve' : 'reject'
    const body = action === 'APPROVED'
      ? { approverEmail: window.userEmail, approverRole: step, comment }
      : { rejectorEmail: window.userEmail, rejectorRole: step, reason: comment }

    const res = await fetch(`${api}/requests/${requestId}/${endpoint}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    })

    const data = await res.json()
    if (data.success) {
      selectedRequest = data.data
      showToast(`Request ${action === 'APPROVED' ? 'approved' : 'rejected'} successfully`, 'success')
      approvalView = 'details'
      render(el)
    }
  } catch (error) {
    console.error('Approval error:', error)
    showToast('Failed to process approval', 'error')
  }
}
