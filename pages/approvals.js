// ============================================================
// Approvals Dashboard - Phase 2
// Managers & Admins review and approve/reject service requests
// ============================================================

import { state, go } from '../app.js'
import { showToast } from '../components/toast.js'
import { callAPI } from '../lib/api-client.js'
import { skeletonLoader } from '../lib/skeleton-loader.js'

let viewMode = 'queue'  // 'queue' | 'detail'
let selectedRequestId = null
let allRequests = []
let filteredRequests = []
let currentFilter = 'Submitted'  // 'Submitted' | 'Approved' | 'Rejected' | 'Completed' | 'all'

export async function initApprovals() {
  const el = document.getElementById('page-approvals')
  if (!el) return
  viewMode = 'queue'
  currentFilter = 'Submitted'
  await render(el)
}

async function render(el) {
  if (viewMode === 'queue') {
    await renderApprovalQueue(el)
  } else if (viewMode === 'detail') {
    await renderRequestDetail(el)
  }
}

// ============================================================
// APPROVAL QUEUE VIEW
// ============================================================
async function renderApprovalQueue(el) {
  // Show skeleton immediately
  el.innerHTML = `
    <div>
      ${skeletonLoader.renderPageHeader('Approval Queue', 'Review and approve self-service requests', true)}
      ${skeletonLoader.renderMetricsRowSkeleton(4)}
      ${skeletonLoader.renderTableSkeleton(7, 8)}
    </div>
  `

  try {
    // Load all self-service requests
    const response = await callAPI('/self-service/requests')
    if (response.success) {
      allRequests = response.data || []
      applyFilter()
      displayApprovalQueue(el, response.stats || {})
    } else {
      throw new Error(response.error || 'Failed to load requests')
    }
  } catch (error) {
    console.error('Error loading approvals:', error)
    showToast('Failed to load requests: ' + error.message, 'error')
    el.querySelector('[class="page-header"]').insertAdjacentHTML('afterend', `
      <div class="alert-banner danger" style="margin:16px">
        <i class="ti ti-alert-triangle"></i>
        <span>${error.message}</span>
      </div>
    `)
  }

  el.querySelector('#queue-refresh')?.addEventListener('click', async () => {
    await renderApprovalQueue(el)
  })
}

function applyFilter() {
  if (currentFilter === 'all') {
    filteredRequests = allRequests
  } else {
    filteredRequests = allRequests.filter(r => r.status === currentFilter)
  }
}

function displayApprovalQueue(el, stats) {
  const header = el.querySelector('.page-header')

  // Stats cards
  const filterCards = `
    <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(140px,1fr));gap:12px;margin:16px">
      <div class="card ${currentFilter === 'Submitted' ? 'active' : ''}" style="padding:12px;text-align:center;cursor:pointer;border:1px solid ${currentFilter === 'Submitted' ? 'var(--clr-warning-text)' : 'transparent'}" id="filter-submitted">
        <div style="font-size:28px;font-weight:700;color:var(--clr-warning-text)">${allRequests.filter(r => r.status === 'Submitted').length}</div>
        <div style="font-size:10px;color:var(--color-text-tertiary);margin-top:4px">Pending</div>
      </div>
      <div class="card ${currentFilter === 'Approved' ? 'active' : ''}" style="padding:12px;text-align:center;cursor:pointer;border:1px solid ${currentFilter === 'Approved' ? 'var(--clr-success-text)' : 'transparent'}" id="filter-approved">
        <div style="font-size:28px;font-weight:700;color:var(--clr-success-text)">${allRequests.filter(r => r.status === 'Approved').length}</div>
        <div style="font-size:10px;color:var(--color-text-tertiary);margin-top:4px">Approved</div>
      </div>
      <div class="card ${currentFilter === 'Rejected' ? 'active' : ''}" style="padding:12px;text-align:center;cursor:pointer;border:1px solid ${currentFilter === 'Rejected' ? 'var(--clr-danger-text)' : 'transparent'}" id="filter-rejected">
        <div style="font-size:28px;font-weight:700;color:var(--clr-danger-text)">${allRequests.filter(r => r.status === 'Rejected').length}</div>
        <div style="font-size:10px;color:var(--color-text-tertiary);margin-top:4px">Rejected</div>
      </div>
      <div class="card ${currentFilter === 'Completed' ? 'active' : ''}" style="padding:12px;text-align:center;cursor:pointer;border:1px solid ${currentFilter === 'Completed' ? 'var(--clr-info-text)' : 'transparent'}" id="filter-completed">
        <div style="font-size:28px;font-weight:700;color:var(--clr-info-text)">${allRequests.filter(r => r.status === 'Completed').length}</div>
        <div style="font-size:10px;color:var(--color-text-tertiary);margin-top:4px">Completed</div>
      </div>
    </div>
  `

  header.insertAdjacentHTML('afterend', filterCards)

  // Requests table
  const tableHTML = `
    <div style="margin:16px">
      ${filteredRequests.length === 0 ? `
        <div class="empty-state" style="padding:40px;text-align:center">
          <i class="ti ti-inbox" style="font-size:48px;color:var(--color-text-tertiary);margin-bottom:16px;opacity:0.5;display:block"></i>
          <h3 style="color:var(--color-text-secondary)">No ${currentFilter.toLowerCase()} requests</h3>
        </div>
      ` : `
        <div class="card" style="padding:0;overflow:hidden">
          <table style="width:100%">
            <thead style="background:var(--color-background-secondary)">
              <tr>
                <th style="padding:12px;text-align:left;font-weight:600;font-size:11px">Request ID</th>
                <th style="padding:12px;text-align:left;font-weight:600;font-size:11px">Requester</th>
                <th style="padding:12px;text-align:left;font-weight:600;font-size:11px">Service</th>
                <th style="padding:12px;text-align:left;font-weight:600;font-size:11px">Operation</th>
                <th style="padding:12px;text-align:left;font-weight:600;font-size:11px">Status</th>
                <th style="padding:12px;text-align:left;font-weight:600;font-size:11px">Submitted</th>
                <th style="padding:12px;text-align:center;font-weight:600;font-size:11px">Action</th>
              </tr>
            </thead>
            <tbody>
              ${filteredRequests.map(req => {
                const statusColor = req.status === 'Submitted' ? 'var(--clr-warning-text)' :
                                  req.status === 'Approved' ? 'var(--clr-success-text)' :
                                  req.status === 'Rejected' ? 'var(--clr-danger-text)' :
                                  'var(--clr-info-text)'
                const createdDate = new Date(req.createdDate).toLocaleString('en-GB', {
                  month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
                })
                return `
                  <tr style="border-bottom:0.5px solid var(--color-border-tertiary);cursor:pointer" class="req-row" data-id="${req.requestId}">
                    <td style="padding:12px;font-size:11px;font-weight:600;color:var(--clr-info-text)" data-label="Request ID">${req.requestId}</td>
                    <td style="padding:12px;font-size:10px" data-label="Requester">${req.requesterId || 'N/A'}</td>
                    <td style="padding:12px;font-size:10px" data-label="Service">${req.service || 'N/A'}</td>
                    <td style="padding:12px;font-size:10px" data-label="Operation">${req.operation || 'N/A'}</td>
                    <td style="padding:12px;font-size:10px" data-label="Status"><strong style="color:${statusColor}">${req.status}</strong></td>
                    <td style="padding:12px;font-size:10px;color:var(--color-text-secondary)" data-label="Submitted">${createdDate}</td>
                    <td style="padding:12px;text-align:center" data-label="Action">
                      ${req.status === 'Submitted' ? '<button class="btn btn-sm" style="padding:4px 8px;font-size:9px">Review</button>' : '-'}
                    </td>
                  </tr>
                `
              }).join('')}
            </tbody>
          </table>
        </div>
      `}
    </div>
  `

  header.insertAdjacentHTML('afterend', tableHTML)

  // Attach event listeners
  el.querySelectorAll('.req-row').forEach(row => {
    row.addEventListener('click', async () => {
      selectedRequestId = row.dataset.id
      viewMode = 'detail'
      await render(el)
    })
  })

  // Filter buttons
  el.querySelector('#filter-submitted')?.addEventListener('click', async () => {
    currentFilter = 'Submitted'
    applyFilter()
    await renderApprovalQueue(el)
  })
  el.querySelector('#filter-approved')?.addEventListener('click', async () => {
    currentFilter = 'Approved'
    applyFilter()
    await renderApprovalQueue(el)
  })
  el.querySelector('#filter-rejected')?.addEventListener('click', async () => {
    currentFilter = 'Rejected'
    applyFilter()
    await renderApprovalQueue(el)
  })
  el.querySelector('#filter-completed')?.addEventListener('click', async () => {
    currentFilter = 'Completed'
    applyFilter()
    await renderApprovalQueue(el)
  })
}

// ============================================================
// REQUEST DETAIL VIEW
// ============================================================
async function renderRequestDetail(el) {
  if (!selectedRequestId) {
    viewMode = 'queue'
    await render(el)
    return
  }

  el.innerHTML = `
    <div class="page-header">
      <div>
        <div class="page-title"><i class="ti ti-receipt"></i> Request Details</div>
        <div class="page-subtitle">Loading...</div>
      </div>
      <div class="page-actions">
        <button class="btn" id="detail-back"><i class="ti ti-arrow-left"></i> Back</button>
      </div>
    </div>

    <div style="padding:20px;text-align:center">
      <div class="spinner"></div>
      <p>Loading request...</p>
    </div>
  `

  try {
    const response = await callAPI(`/self-service/requests/${selectedRequestId}`)
    if (response.success && response.data) {
      displayRequestDetail(el, response.data)
    } else {
      throw new Error('Request not found')
    }
  } catch (error) {
    console.error('Error loading request:', error)
    el.querySelector('[class="page-header"]').insertAdjacentHTML('afterend', `
      <div class="alert-banner danger" style="margin:16px">
        <i class="ti ti-alert-triangle"></i>
        <span>Error: ${error.message}</span>
      </div>
    `)
  }

  el.querySelector('#detail-back')?.addEventListener('click', async () => {
    viewMode = 'queue'
    await render(el)
  })
}

function displayRequestDetail(el, request) {
  const subtitle = el.querySelector('.page-header .page-subtitle')
  if (subtitle) subtitle.textContent = `${request.requestId} • ${request.status}`

  const statusColor = request.status === 'Submitted' ? 'var(--clr-warning-text)' :
                     request.status === 'Approved' ? 'var(--clr-success-text)' :
                     request.status === 'Rejected' ? 'var(--clr-danger-text)' :
                     'var(--clr-info-text)'
  const createdDate = new Date(request.createdDate).toLocaleString()

  const header = el.querySelector('.page-header')
  header.insertAdjacentHTML('afterend', `
    <div style="margin:16px">
      <!-- Status Banner -->
      <div class="alert-banner" style="background:${statusColor}22;border-left:3px solid ${statusColor};margin-bottom:16px">
        <span style="color:${statusColor};font-weight:600">${request.status}</span>
      </div>

      <!-- Request Information -->
      <div class="card mb-3">
        <div class="card-title mb-3"><i class="ti ti-receipt"></i> Request Information</div>
        <div style="display:grid;grid-template-columns:auto 1fr;gap:8px 16px;font-size:11px">
          <span style="color:var(--color-text-tertiary)">Request ID</span>
          <span style="font-weight:600;color:var(--clr-info-text)">${request.requestId}</span>

          <span style="color:var(--color-text-tertiary)">Requester</span>
          <span>${request.requesterId}</span>

          <span style="color:var(--color-text-tertiary)">Service</span>
          <span>${request.service}</span>

          <span style="color:var(--color-text-tertiary)">Operation</span>
          <span>${request.operation}</span>

          <span style="color:var(--color-text-tertiary)">Submitted</span>
          <span>${createdDate}</span>

          <span style="color:var(--color-text-tertiary)">Status</span>
          <span style="color:${statusColor};font-weight:600">${request.status}</span>
        </div>
      </div>

      <!-- Form Data -->
      <div class="card mb-3">
        <div class="card-title mb-3"><i class="ti ti-list"></i> Submitted Details</div>
        <pre style="background:var(--color-background-secondary);padding:12px;border-radius:4px;margin:0;font-size:10px;overflow-x:auto;max-height:200px;overflow-y:auto">${JSON.stringify(request.formData, null, 2)}</pre>
      </div>

      <!-- Action Buttons -->
      ${request.status === 'Submitted' ? `
        <div style="display:flex;gap:10px">
          <button class="btn btn-primary" id="btn-approve" style="flex:1">
            <i class="ti ti-circle-check"></i> Approve
          </button>
          <button class="btn" id="btn-reject" style="flex:1">
            <i class="ti ti-circle-x"></i> Reject
          </button>
        </div>
      ` : ''}
    </div>
  `)

  el.querySelector('#btn-approve')?.addEventListener('click', () => {
    showApprovalModal(el, request, 'approve')
  })

  el.querySelector('#btn-reject')?.addEventListener('click', () => {
    showApprovalModal(el, request, 'reject')
  })

  el.querySelector('#detail-back')?.addEventListener('click', async () => {
    viewMode = 'queue'
    await render(el)
  })
}

// ============================================================
// APPROVAL/REJECTION MODAL
// ============================================================
function showApprovalModal(el, request, action) {
  const isApprove = action === 'approve'

  const overlay = document.createElement('div')
  overlay.style.cssText = 'position:fixed;top:0;left:0;right:0;bottom:0;background:rgba(0,0,0,0.5);display:flex;align-items:center;justify-content:center;z-index:1000;padding:20px'

  const modal = document.createElement('div')
  modal.style.cssText = 'background:white;border-radius:8px;max-width:450px;padding:20px;box-shadow:0 10px 40px rgba(0,0,0,0.3)'

  modal.innerHTML = `
    <h2 style="font-size:16px;font-weight:600;margin:0 0 4px;color:var(--color-text-primary)">
      ${isApprove ? '✓ Approve Request?' : '✗ Reject Request?'}
    </h2>
    <p style="font-size:11px;color:var(--color-text-secondary);margin:0 0 16px">${request.requestId}</p>

    <div style="background:var(--color-background-secondary);padding:10px;border-radius:4px;margin-bottom:16px;font-size:10px">
      <strong>${request.service}</strong> - ${request.operation}
    </div>

    <label style="display:block;font-size:11px;font-weight:600;margin-bottom:8px;color:var(--color-text-secondary)">
      ${isApprove ? 'Approval Notes (optional)' : 'Rejection Reason (required)'}
    </label>
    <textarea id="modal-comment" style="width:100%;padding:10px;border:0.5px solid var(--color-border-secondary);border-radius:4px;font-size:11px;min-height:80px;font-family:inherit"
      placeholder="${isApprove ? 'Add any notes about this approval...' : 'Explain why you are rejecting this request...'}"
      ${!isApprove ? 'required' : ''}></textarea>

    <div style="display:flex;gap:10px;margin-top:16px;justify-content:flex-end">
      <button id="modal-cancel" class="btn" style="padding:8px 12px;font-size:11px">Cancel</button>
      <button id="modal-confirm" class="btn ${isApprove ? 'btn-primary' : ''}" style="padding:8px 12px;font-size:11px">
        ${isApprove ? '✓ Approve' : '✗ Reject'}
      </button>
    </div>
  `

  overlay.appendChild(modal)
  document.body.appendChild(overlay)

  document.getElementById('modal-cancel').addEventListener('click', () => {
    overlay.remove()
  })

  document.getElementById('modal-confirm').addEventListener('click', async () => {
    const comment = document.getElementById('modal-comment').value.trim()

    if (!isApprove && !comment) {
      showToast('Please provide a rejection reason', 'warning')
      return
    }

    const btn = document.getElementById('modal-confirm')
    btn.disabled = true
    btn.innerHTML = '<span class="spinner" style="display:inline-block;width:12px;height:12px;border:2px solid currentColor;border-radius:50%;border-right-color:transparent;animation:spin 0.6s linear infinite"></span> Processing...'

    try {
      const endpoint = isApprove
        ? `/self-service/requests/${request.requestId}/approve`
        : `/self-service/requests/${request.requestId}/reject`

      const payload = isApprove
        ? { approverId: state.currentUser?.email, comment }
        : { rejectedBy: state.currentUser?.email, reason: comment }

      const response = await callAPI(endpoint, 'PUT', payload)

      if (response.success) {
        showToast(`Request ${isApprove ? 'approved' : 'rejected'} successfully`, 'success')
        overlay.remove()
        // Refresh detail view after 500ms
        setTimeout(async () => {
          await renderRequestDetail(el)
        }, 500)
      } else {
        throw new Error(response.error || 'Failed to update request')
      }
    } catch (error) {
      showToast('Error: ' + error.message, 'error')
      btn.disabled = false
      btn.innerHTML = isApprove ? '✓ Approve' : '✗ Reject'
    }
  })

  setTimeout(() => document.getElementById('modal-comment').focus(), 100)
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
