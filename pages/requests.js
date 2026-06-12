// ============================================================
// Service Requests Management
// View and approve all service requests in the system
// ============================================================

import { showToast } from '../components/toast.js'
import { api } from '../lib/api-client.js'
import { isDemoAccount } from '../lib/demo-account.js'

let allRequests = []
let selectedRequest = null
let filterStatus = 'PENDING_APPROVAL'
let viewMode = 'list' // 'list' or 'details'

export async function initRequests() {
  const el = document.getElementById('page-requests')
  if (!el) return

  if (isDemoAccount()) {
    renderDemoRequests(el)
    return
  }

  await loadRequests(el)
  renderList(el)
}

function renderDemoRequests(el) {
  const demoRequests = [
    {
      id: 'REQ-2026-001',
      operationId: 'user-license-assignment-office365',
      submittedBy: 'john.smith@contoso.com',
      submittedAt: '2026-06-01T14:30:00Z',
      status: 'PENDING_APPROVAL',
      validation: {
        riskLevel: 'LOW',
        riskScore: 15,
        approvalPath: ['manager', 'compliance', 'action'],
        checks: [
          { status: 'PASS', message: 'User identity verified' },
          { status: 'PASS', message: 'License availability confirmed' },
          { status: 'PASS', message: 'No policy conflicts' }
        ]
      },
      approvals: [
        { step: 'manager', status: 'APPROVED', approvedBy: 'david.chen@contoso.com', approvedAt: '2026-06-01T15:00:00Z' }
      ],
      fields: { userId: 'john.smith@contoso.com', licenses: 'Office 365 E5', department: 'Sales' }
    },
    {
      id: 'REQ-2026-002',
      operationId: 'group-creation-security',
      submittedBy: 'maya.patel@contoso.com',
      submittedAt: '2026-06-01T13:45:00Z',
      status: 'PENDING_APPROVAL',
      validation: {
        riskLevel: 'MEDIUM',
        riskScore: 52,
        approvalPath: ['compliance', 'action'],
        checks: [
          { status: 'PASS', message: 'Group naming convention valid' },
          { status: 'WARN', message: 'Large membership size detected' },
          { status: 'PASS', message: 'Owner assignment confirmed' }
        ]
      },
      approvals: [],
      fields: { groupName: 'Sales Team AU', members: 47, owner: 'maya.patel@contoso.com' }
    },
    {
      id: 'REQ-2026-003',
      operationId: 'sharepoint-site-creation',
      submittedBy: 'alex.johnson@contoso.com',
      submittedAt: '2026-06-01T12:15:00Z',
      status: 'PENDING_APPROVAL',
      validation: {
        riskLevel: 'LOW',
        riskScore: 18,
        approvalPath: ['manager', 'action'],
        checks: [
          { status: 'PASS', message: 'Site quota available' },
          { status: 'PASS', message: 'Governance policies applied' },
          { status: 'PASS', message: 'Retention label assigned' }
        ]
      },
      approvals: [
        { step: 'manager', status: 'APPROVED', approvedBy: 'robert.williams@contoso.com', approvedAt: '2026-06-01T13:30:00Z' }
      ],
      fields: { siteName: 'HR Policies Site', url: 'hr-policies', classification: 'Internal' }
    },
    {
      id: 'REQ-2026-004',
      operationId: 'admin-role-assignment-global',
      submittedBy: 'sarah.kim@contoso.com',
      submittedAt: '2026-06-01T11:00:00Z',
      status: 'APPROVED',
      validation: {
        riskLevel: 'HIGH',
        riskScore: 78,
        approvalPath: ['manager', 'compliance', 'security', 'ciso'],
        checks: [
          { status: 'PASS', message: 'Business justification provided' },
          { status: 'PASS', message: 'Background check passed' },
          { status: 'PASS', message: 'MFA requirement confirmed' }
        ]
      },
      approvals: [
        { step: 'manager', status: 'APPROVED', approvedBy: 'michael.brown@contoso.com', approvedAt: '2026-06-01T12:00:00Z' },
        { step: 'compliance', status: 'APPROVED', approvedBy: 'lisa.garcia@contoso.com', approvedAt: '2026-06-01T12:45:00Z' },
        { step: 'security', status: 'APPROVED', approvedBy: 'james.miller@contoso.com', approvedAt: '2026-06-01T13:15:00Z' },
        { step: 'ciso', status: 'APPROVED', approvedBy: 'jennifer.lee@contoso.com', approvedAt: '2026-06-01T14:00:00Z' }
      ],
      fields: { userId: 'sarah.kim@contoso.com', role: 'Global Admin', reason: 'Incident response team member' }
    },
    {
      id: 'REQ-2026-005',
      operationId: 'data-export-audit',
      submittedBy: 'chris.rodriguez@contoso.com',
      submittedAt: '2026-05-31T16:30:00Z',
      status: 'COMPLETED',
      validation: {
        riskLevel: 'MEDIUM',
        riskScore: 45,
        approvalPath: ['manager', 'data-protection'],
        checks: [
          { status: 'PASS', message: 'Data retention compliant' },
          { status: 'PASS', message: 'Encryption enabled' },
          { status: 'PASS', message: 'Audit logging configured' }
        ]
      },
      approvals: [
        { step: 'manager', status: 'APPROVED', approvedBy: 'nancy.davis@contoso.com', approvedAt: '2026-05-31T17:00:00Z' },
        { step: 'data-protection', status: 'APPROVED', approvedBy: 'thomas.martin@contoso.com', approvedAt: '2026-05-31T17:45:00Z' },
        { step: 'action', status: 'COMPLETED', approvedAt: '2026-06-01T09:00:00Z' }
      ],
      fields: { dataType: 'User Activity Logs', department: 'IT Security', purpose: 'Quarterly audit' }
    },
    {
      id: 'REQ-2026-006',
      operationId: 'app-consent-request',
      submittedBy: 'emma.thompson@contoso.com',
      submittedAt: '2026-05-30T10:20:00Z',
      status: 'REJECTED',
      validation: {
        riskLevel: 'HIGH',
        riskScore: 81,
        approvalPath: ['compliance', 'security'],
        checks: [
          { status: 'FAIL', message: 'Permissions exceed least privilege requirement' },
          { status: 'FAIL', message: 'Data sharing policy violation' },
          { status: 'WARN', message: 'Publisher not verified' }
        ]
      },
      approvals: [
        { step: 'compliance', status: 'REJECTED', approvedBy: 'paul.harris@contoso.com', approvedAt: '2026-05-30T14:30:00Z' }
      ],
      fields: { appName: 'Analytics Suite Pro', permissions: 'Full Mailbox', vendor: 'Unknown Publisher' }
    },
    {
      id: 'REQ-2026-007',
      operationId: 'dlp-policy-update',
      submittedBy: 'olivia.white@contoso.com',
      submittedAt: '2026-05-29T09:00:00Z',
      status: 'COMPLETED',
      validation: {
        riskLevel: 'MEDIUM',
        riskScore: 62,
        approvalPath: ['security', 'action'],
        checks: [
          { status: 'PASS', message: 'Impact analysis completed' },
          { status: 'PASS', message: 'False positive rate acceptable' },
          { status: 'PASS', message: 'User notifications configured' }
        ]
      },
      approvals: [
        { step: 'security', status: 'APPROVED', approvedBy: 'kevin.anderson@contoso.com', approvedAt: '2026-05-29T10:15:00Z' },
        { step: 'action', status: 'COMPLETED', approvedAt: '2026-05-29T11:00:00Z' }
      ],
      fields: { policyName: 'Credit Card Detection Enhanced', scope: 'All Tenants', sensitivity: 'High' }
    }
  ]

  allRequests = demoRequests
  filterStatus = 'PENDING_APPROVAL'
  renderDemoList(el)
}

function renderDemoList(el) {
  if (!el || !el.querySelector) {
    console.error('❌ Page element not found or invalid')
    return
  }

  const requests = filterStatus === 'ALL'
    ? allRequests
    : allRequests.filter(r => r.status === filterStatus)

  const stats = {
    total: allRequests.length,
    pending: allRequests.filter(r => r.status === 'PENDING_APPROVAL').length,
    approved: allRequests.filter(r => r.status === 'APPROVED').length,
    rejected: allRequests.filter(r => r.status === 'REJECTED').length,
    completed: allRequests.filter(r => r.status === 'COMPLETED').length
  }

  el.innerHTML = `
    <div class="page-header">
      <div>
        <div class="page-title"><i class="ti ti-inbox"></i> Service Requests</div>
        <div class="page-subtitle">Manage and approve all service requests in the system</div>
      </div>
    </div>

    <div style="display:flex;align-items:center;gap:8px;padding:8px 12px;background:var(--color-background-primary);border:0.5px solid var(--color-border-secondary);border-radius:var(--border-radius-md);margin-bottom:16px;font-size:10px;color:var(--color-text-tertiary)">
      <span class="status-dot active pulse"></span>
      <span><strong style="color:var(--color-text-secondary)">Demo Mode</strong> · Showing sample service requests</span>
    </div>

    <!-- KPI Stats -->
    <div class="kpi-row">
      <div class="kpi-tile">
        <div class="kpi-value info">${stats.total}</div>
        <div class="kpi-label">Total Requests</div>
      </div>
      <div class="kpi-tile">
        <div class="kpi-value warning">${stats.pending}</div>
        <div class="kpi-label">Pending Approval</div>
      </div>
      <div class="kpi-tile">
        <div class="kpi-value success">${stats.approved}</div>
        <div class="kpi-label">Approved</div>
      </div>
      <div class="kpi-tile">
        <div class="kpi-value danger">${stats.rejected}</div>
        <div class="kpi-label">Rejected</div>
      </div>
      <div class="kpi-tile">
        <div class="kpi-value info">${stats.completed}</div>
        <div class="kpi-label">Completed</div>
      </div>
    </div>

    <!-- Status Filters -->
    <div class="card mb-3">
      <div style="display:flex;gap:8px;flex-wrap:wrap">
        ${['ALL', 'PENDING_APPROVAL', 'APPROVED', 'REJECTED', 'COMPLETED'].map(status => `
          <button class="demo-filter-btn ${filterStatus === status ? 'btn-primary' : ''}" data-status="${status}" style="padding:6px 12px;font-size:11px;border:0.5px solid var(--color-border-secondary);background:${filterStatus === status ? 'var(--clr-info-bg)' : 'transparent'};color:${filterStatus === status ? 'var(--clr-info-text)' : 'var(--color-text-secondary)'};border-radius:var(--border-radius-sm);cursor:pointer;transition:all 200ms">
            ${status}
          </button>
        `).join('')}
      </div>
    </div>

    <!-- Requests Table -->
    <div class="card">
      <div class="card-header">
        <span class="card-title">Requests (${requests.length})</span>
      </div>
      <div style="padding:0;overflow-x:auto;border-top:0.5px solid var(--color-border-secondary)">
        ${requests.length === 0 ? `
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
                <th style="padding:10px 12px;text-align:center">Action</th>
              </tr>
            </thead>
            <tbody>
              ${requests.map(req => `
                <tr style="border-bottom:0.5px solid var(--color-border-tertiary);cursor:pointer" class="demo-req-row" data-id="${req.id}">
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
                      <button class="demo-req-review-btn" data-id="${req.id}" style="padding:4px 8px;font-size:9px;background:var(--clr-info-bg);color:var(--clr-info-text);border:none;border-radius:3px;cursor:pointer">
                        ⓘ Review
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
  el.querySelectorAll('.demo-filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      filterStatus = btn.dataset.status
      renderDemoList(el)
    })
  })

  // Row click to view details
  el.querySelectorAll('.demo-req-row').forEach(row => {
    row.addEventListener('click', () => {
      const id = row.dataset.id
      selectedRequest = allRequests.find(r => r.id === id)
      if (selectedRequest) {
        viewMode = 'details'
        renderDemoDetails(el)
      }
    })
  })

  // Review button
  el.querySelectorAll('.demo-req-review-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation()
      const id = btn.dataset.id
      selectedRequest = allRequests.find(r => r.id === id)
      if (selectedRequest) {
        viewMode = 'details'
        renderDemoDetails(el)
      }
    })
  })
}

function renderDemoDetails(el) {
  if (!el || !el.querySelector || !selectedRequest) return

  const req = selectedRequest

  el.innerHTML = `
    <div class="page-header">
      <div style="display:flex;align-items:center;gap:10px">
        <button class="demo-back-btn btn" style="padding:6px 12px;border:none;background:var(--color-background-secondary);color:var(--color-text-primary);cursor:pointer;border-radius:var(--border-radius-sm)"><i class="ti ti-arrow-left"></i> Back</button>
        <div>
          <div class="page-title">${req.id}</div>
          <div class="page-subtitle">${req.operationId} • ${getStatusBadge(req.status)}</div>
        </div>
      </div>
    </div>

    <div class="grid-2" style="gap:16px">
      <!-- Request Info -->
      <div>
        <div class="card mb-3">
          <div class="card-header"><span class="card-title">Request Information</span></div>
          <div style="padding:16px;border-top:0.5px solid var(--color-border-secondary);font-size:11px">
            <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px">
              <div>
                <div style="font-weight:600;color:var(--color-text-tertiary);font-size:10px;margin-bottom:2px">Submitted By</div>
                <div>${req.submittedBy}</div>
              </div>
              <div>
                <div style="font-weight:600;color:var(--color-text-tertiary);font-size:10px;margin-bottom:2px">Submitted</div>
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
            <div style="display:flex;align-items:center;gap:10px;margin-bottom:12px">
              <div style="font-size:28px;font-weight:600;color:${getRiskColor(req.validation?.riskLevel)}">${req.validation?.riskScore || 0}</div>
              <div>
                <div style="font-size:12px;font-weight:600">${req.validation?.riskLevel || 'UNKNOWN'} Risk</div>
                <div style="font-size:10px;color:var(--color-text-secondary)">Risk Score (0-100)</div>
              </div>
            </div>

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
              <div style="margin-bottom:8px;padding-bottom:8px;border-bottom:0.5px solid var(--color-border-tertiary)">
                <div style="font-weight:600;color:var(--color-text-secondary);margin-bottom:2px">${key}</div>
                <div style="word-break:break-all;color:var(--color-text-primary)">${value}</div>
              </div>
            `).join('')}
          </div>
        </div>
      </div>

      <!-- Approval Actions -->
      <div>
        <!-- Approval Workflow -->
        <div class="card mb-3">
          <div class="card-header"><span class="card-title">Approval Workflow</span></div>
          <div style="padding:16px;border-top:0.5px solid var(--color-border-secondary)">
            ${(req.validation?.approvalPath || []).map((step, idx) => {
              const approval = req.approvals.find(a => a.step === step)
              const isPending = !approval && (step !== 'agent' && step !== 'action')
              const isCompleted = approval?.status === 'APPROVED' || approval?.status === 'COMPLETED'

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
                    ${approval ? `
                      <div style="font-size:10px;color:var(--color-text-secondary);margin-top:2px">
                        ${approval.approvedBy || ''} • ${new Date(approval.approvedAt).toLocaleString()}
                      </div>
                    ` : isPending ? `
                      <div style="font-size:10px;color:var(--clr-warning-text);margin-top:2px">Awaiting approval</div>
                    ` : `
                      <div style="font-size:10px;color:var(--color-text-secondary);margin-top:2px">Automated action</div>
                    `}
                  </div>
                </div>
              `
            }).join('')}
          </div>
        </div>

        <!-- Request Summary -->
        <div class="card">
          <div class="card-header"><span class="card-title">Summary</span></div>
          <div style="padding:16px;border-top:0.5px solid var(--color-border-secondary);font-size:11px;color:var(--color-text-secondary)">
            <div style="line-height:1.6">
              ${req.status === 'PENDING_APPROVAL' ? `
                This request is currently awaiting approval. Review the risk assessment and request fields before proceeding.
              ` : req.status === 'APPROVED' ? `
                This request has been approved and is ready for implementation.
              ` : req.status === 'COMPLETED' ? `
                This request has been successfully completed and implemented.
              ` : `
                This request was rejected. Please contact the rejection authority for more details.
              `}
            </div>
          </div>
        </div>
      </div>
    </div>
  `

  el.querySelector('.demo-back-btn')?.addEventListener('click', () => {
    viewMode = 'list'
    renderDemoList(el)
  })
}

async function loadRequests(el) {
  try {
    const res = await fetch(`${api}/requests?limit=100`)
    const data = await res.json()
    allRequests = Array.isArray(data.data) ? data.data : []
    console.log(`📋 Loaded ${allRequests.length} requests`)
  } catch (error) {
    console.error('Error loading requests:', error)
    showToast('Failed to load requests', 'error')
  }
}

function renderList(el) {
  if (!el || !el.querySelector) {
    console.error('❌ Page element not found or invalid')
    return
  }

  const requests = filterStatus === 'ALL'
    ? allRequests
    : allRequests.filter(r => r.status === filterStatus)

  const stats = {
    total: allRequests.length,
    pending: allRequests.filter(r => r.status === 'PENDING_APPROVAL').length,
    approved: allRequests.filter(r => r.status === 'APPROVED').length,
    rejected: allRequests.filter(r => r.status === 'REJECTED').length,
    completed: allRequests.filter(r => r.status === 'COMPLETED').length
  }

  el.innerHTML = `
    <div class="page-header">
      <div>
        <div class="page-title"><i class="ti ti-inbox"></i> Service Requests</div>
        <div class="page-subtitle">Manage and approve all service requests in the system</div>
      </div>
    </div>

    <!-- KPI Stats -->
    <div class="kpi-row">
      <div class="kpi-tile">
        <div class="kpi-value info">${stats.total}</div>
        <div class="kpi-label">Total Requests</div>
      </div>
      <div class="kpi-tile">
        <div class="kpi-value warning">${stats.pending}</div>
        <div class="kpi-label">Pending Approval</div>
      </div>
      <div class="kpi-tile">
        <div class="kpi-value success">${stats.approved}</div>
        <div class="kpi-label">Approved</div>
      </div>
      <div class="kpi-tile">
        <div class="kpi-value danger">${stats.rejected}</div>
        <div class="kpi-label">Rejected</div>
      </div>
    </div>

    <!-- Status Filters -->
    <div class="card mb-3">
      <div style="display:flex;gap:8px;flex-wrap:wrap">
        ${['ALL', 'PENDING_APPROVAL', 'APPROVED', 'REJECTED', 'COMPLETED'].map(status => `
          <button class="btn ${filterStatus === status ? 'btn-primary' : ''}" id="filter-${status}" style="padding:6px 12px;font-size:11px">
            ${status}
          </button>
        `).join('')}
      </div>
    </div>

    <!-- Requests Table -->
    <div class="card">
      <div class="card-header">
        <span class="card-title">Requests (${requests.length})</span>
      </div>
      <div style="padding:0;overflow-x:auto;border-top:0.5px solid var(--color-border-secondary)">
        ${requests.length === 0 ? `
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
                <th style="padding:10px 12px;text-align:center">Action</th>
              </tr>
            </thead>
            <tbody>
              ${requests.map(req => `
                <tr style="border-bottom:0.5px solid var(--color-border-tertiary);cursor:pointer" data-id="${req.id}">
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
                      <button class="req-review-btn" data-id="${req.id}" style="padding:4px 8px;font-size:9px;background:var(--clr-info-bg);color:var(--clr-info-text);border:none;border-radius:3px;cursor:pointer">
                        ⓘ Review
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
  if (el && el.querySelector) {
    ['ALL', 'PENDING_APPROVAL', 'APPROVED', 'REJECTED', 'COMPLETED'].forEach(status => {
      const btn = el.querySelector(`#filter-${status}`)
      if (btn) {
        btn.addEventListener('click', () => {
          filterStatus = status
          renderList(el)
        })
      }
    })
  }

  // Row click to view details
  if (el && el.querySelectorAll) {
    el.querySelectorAll('tr[data-id]').forEach(row => {
      row.addEventListener('click', () => {
        const id = row.dataset.id
        selectedRequest = allRequests.find(r => r.id === id)
        if (selectedRequest) {
          viewMode = 'details'
          renderDetails(el)
        }
      })
    })

    // Review button
    el.querySelectorAll('.req-review-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation()
        const id = btn.dataset.id
        selectedRequest = allRequests.find(r => r.id === id)
        if (selectedRequest) {
          viewMode = 'details'
          renderDetails(el)
        }
      })
    })
  }
}

// ============================================================
// Request Details View
// ============================================================
function renderDetails(el) {
  if (!el || !el.querySelector || !selectedRequest) return

  const req = selectedRequest
  const nextApproval = getNextApprovalStep(req)

  el.innerHTML = `
    <div class="page-header">
      <div style="display:flex;align-items:center;gap:10px">
        <button class="btn" id="back-btn"><i class="ti ti-arrow-left"></i> Back</button>
        <div>
          <div class="page-title">${req.id}</div>
          <div class="page-subtitle">${req.operationId} • ${getStatusBadge(req.status)}</div>
        </div>
      </div>
    </div>

    <div class="grid-2" style="gap:16px">
      <!-- Request Info -->
      <div>
        <div class="card mb-3">
          <div class="card-header"><span class="card-title">Request Information</span></div>
          <div style="padding:16px;border-top:0.5px solid var(--color-border-secondary);font-size:11px">
            <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px">
              <div>
                <div style="font-weight:600;color:var(--color-text-tertiary);font-size:10px;margin-bottom:2px">Submitted By</div>
                <div>${req.submittedBy}</div>
              </div>
              <div>
                <div style="font-weight:600;color:var(--color-text-tertiary);font-size:10px;margin-bottom:2px">Submitted</div>
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
            <div style="display:flex;align-items:center;gap:10px;margin-bottom:12px">
              <div style="font-size:28px;font-weight:600;color:${getRiskColor(req.validation?.riskLevel)}">${req.validation?.riskScore || 0}</div>
              <div>
                <div style="font-size:12px;font-weight:600">${req.validation?.riskLevel || 'UNKNOWN'} Risk</div>
                <div style="font-size:10px;color:var(--color-text-secondary)">Risk Score (0-100)</div>
              </div>
            </div>

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
              <div style="margin-bottom:8px;padding-bottom:8px;border-bottom:0.5px solid var(--color-border-tertiary)">
                <div style="font-weight:600;color:var(--color-text-secondary);margin-bottom:2px">${key}</div>
                <div style="word-break:break-all;color:var(--color-text-primary)">${value}</div>
              </div>
            `).join('')}
          </div>
        </div>
      </div>

      <!-- Approval Actions -->
      <div>
        <!-- Approval Workflow -->
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

        <!-- Approval Actions -->
        ${req.status === 'PENDING_APPROVAL' && nextApproval ? `
          <div class="card mb-3">
            <div class="card-header"><span class="card-title">Your Action</span></div>
            <div style="padding:16px;border-top:0.5px solid var(--color-border-secondary)">
              <textarea id="approval-comment" placeholder="Add comment (required for rejection)" style="width:100%;padding:8px;border:0.5px solid var(--color-border-secondary);border-radius:4px;font-size:11px;resize:vertical;min-height:60px;margin-bottom:12px"></textarea>
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
  const backBtn = el.querySelector('#back-btn')
  if (backBtn) {
    backBtn.addEventListener('click', () => {
      viewMode = 'list'
      renderList(el)
    })
  }

  if (req.status === 'PENDING_APPROVAL' && nextApproval) {
    const approveBtn = el.querySelector('#approve-btn')
    const rejectBtn = el.querySelector('#reject-btn')

    if (approveBtn) {
      approveBtn.addEventListener('click', async () => {
        const comment = el.querySelector('#approval-comment').value
        await submitApproval(req.id, 'APPROVED', nextApproval.step, comment, el)
      })
    }

    if (rejectBtn) {
      rejectBtn.addEventListener('click', async () => {
        const comment = el.querySelector('#approval-comment').value
        if (!comment) {
          showToast('Please provide a reason for rejection', 'warning')
          return
        }
        await submitApproval(req.id, 'REJECTED', nextApproval.step, comment, el)
      })
    }
  }
}

// ============================================================
// Helpers
// ============================================================
function getStatusBadge(status) {
  const badges = {
    'PENDING_APPROVAL': '<span style="color:var(--clr-warning-text)">⏳ Pending</span>',
    'APPROVED': '<span style="color:var(--clr-success-text)">✓ Approved</span>',
    'REJECTED': '<span style="color:var(--clr-danger-text)">✗ Rejected</span>',
    'COMPLETED': '<span style="color:var(--clr-success-text)">✓✓ Completed</span>',
    'FAILED': '<span style="color:var(--clr-danger-text)">! Failed</span>'
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
      showToast(`Request ${action === 'APPROVED' ? 'approved' : 'rejected'} successfully`, 'success')
      // Reload requests and go back to list
      await loadRequests(el)
      viewMode = 'list'
      renderList(el)
    } else {
      showToast('Failed to process approval', 'error')
    }
  } catch (error) {
    console.error('Approval error:', error)
    showToast('Error submitting approval. Please try again.', 'error')
  }
}
