// ============================================================
// Self Service Portal - Admin Requests Dashboard
// View and approve all self service requests in the system
// ============================================================

import { showToast } from '../components/toast.js'
import { api, callAPI } from '../lib/api-client.js'
import { isDemoAccount } from '../lib/demo-account.js'
import { state } from '../app.js'
import {
  notifyRequestApproved,
  notifyRequestRejected
} from '../lib/email-service.js'
import {
  getRequestComments,
  addComment,
  addCancellationRequest,
  approveCancellation,
  denyCancellation
} from '../data/request-comments.js'
import { getSLAStatus, getSLAColor, formatRemainingTime } from '../data/sla-config.js'
import { getPriorityLevel } from '../data/priority-levels.js'
import { exportToCSV, generateComplianceReport, generateComplianceReportHTML } from '../lib/export-service.js'

let allRequests = []
let filteredRequests = []
let selectedRequest = null
let selectedRequests = new Set()
let filters = {
  status: 'Submitted',
  service: 'All',
  dateRange: 'all',
  priority: 'All',
  searchQuery: ''
}
let viewMode = 'list'

const SERVICES = ['All', 'Exchange', 'Teams', 'SharePoint', 'M365 Groups', 'User Management']

const DEMO_REQUESTS = [
  {
    requestId: 'REQ-001',
    service: 'Exchange',
    operation: 'Create Shared Mailbox',
    status: 'Submitted',
    priority: 'high',
    createdDate: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    requesterId: 'john.smith@contoso.com',
    formData: { mailboxName: 'Sales Team', members: '5' },
    slaHours: 24
  },
  {
    requestId: 'REQ-002',
    service: 'Teams',
    operation: 'Create Team',
    status: 'Submitted',
    priority: 'normal',
    createdDate: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
    requesterId: 'mary.johnson@contoso.com',
    formData: { teamName: 'Marketing', description: 'Marketing team collaboration' },
    slaHours: 24
  },
  {
    requestId: 'REQ-003',
    service: 'SharePoint',
    operation: 'Create Site',
    status: 'Approved',
    priority: 'critical',
    createdDate: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    approvedDate: new Date(Date.now() - 20 * 60 * 60 * 1000).toISOString(),
    requesterId: 'alex.williams@contoso.com',
    formData: { siteName: 'HR Documentation', siteType: 'Team Site' },
    slaHours: 24
  }
]

export async function initRequests() {
  const el = document.getElementById('page-requests')
  if (!el) return

  if (isDemoAccount()) {
    allRequests = DEMO_REQUESTS
    applyFilters(el)
    return
  }

  renderSkeleton(el)
  await loadSelfServiceRequests(el)
}

async function loadSelfServiceRequests(el) {
  try {
    console.log('📡 Loading self-service requests...')

    const result = await callAPI('/self-service/requests', 'GET')

    if (result.success && result.data) {
      allRequests = result.data.map(req => ({
        requestId: req.requestId,
        service: req.service || 'Unknown',
        operation: req.operation || 'N/A',
        status: req.status || 'Submitted',
        createdDate: req.createdDate,
        approvedDate: req.approvedDate,
        completedDate: req.completedDate,
        requesterId: req.requesterId || 'Unknown',
        formData: req.formData || {}
      }))
      console.log(`✅ Loaded ${allRequests.length} requests`)
    } else {
      console.warn('⚠️ No requests found')
      allRequests = []
    }

    applyFilters(el)
  } catch (error) {
    console.error('❌ Error loading requests:', error)
    showToast('Error loading requests', 'error')
    renderErrorState(el)
  }
}

function applyFilters(el) {
  filteredRequests = allRequests.filter(req => {
    if (filters.status !== 'All' && req.status !== filters.status) return false
    if (filters.service !== 'All' && req.service !== filters.service) return false
    if (filters.priority !== 'All' && req.priority !== filters.priority) return false

    if (filters.dateRange !== 'all') {
      const reqDate = new Date(req.createdDate)
      const now = new Date()
      const daysAgo = parseInt(filters.dateRange)

      if (!isNaN(daysAgo)) {
        const cutoffDate = new Date(now.getTime() - daysAgo * 24 * 60 * 60 * 1000)
        if (reqDate < cutoffDate) return false
      }
    }

    // Search filter
    if (filters.searchQuery) {
      const q = filters.searchQuery.toLowerCase()
      const matchesSearch =
        req.requestId.toLowerCase().includes(q) ||
        req.service.toLowerCase().includes(q) ||
        req.operation.toLowerCase().includes(q) ||
        req.requesterId.toLowerCase().includes(q)
      if (!matchesSearch) return false
    }

    return true
  })

  renderList(el)
}

function renderSkeleton(el) {
  el.innerHTML = `
    <div class="page-header">
      <div>
        <div class="page-title"><i class="ti ti-inbox"></i> Service Requests</div>
        <div class="page-subtitle">Manage and approve all self-service requests</div>
      </div>
    </div>

    <div style="padding:40px;text-align:center">
      <div class="spinner" style="margin-bottom:16px"></div>
      <p>Loading requests...</p>
    </div>
  `
}

function renderErrorState(el) {
  el.innerHTML = `
    <div class="page-header">
      <div>
        <div class="page-title"><i class="ti ti-inbox"></i> Service Requests</div>
        <div class="page-subtitle">Manage and approve all self-service requests</div>
      </div>
    </div>

    <div class="card" style="padding:40px;text-align:center">
      <i class="ti ti-alert-circle" style="font-size:32px;color:var(--clr-danger-text);margin-bottom:12px;display:block"></i>
      <p style="color:var(--color-text-secondary)">Error loading requests. Please try again.</p>
    </div>
  `
}

function renderList(el) {
  const stats = {
    total: allRequests.length,
    submitted: allRequests.filter(r => r.status === 'Submitted').length,
    approved: allRequests.filter(r => r.status === 'Approved').length,
    completed: allRequests.filter(r => r.status === 'Completed').length,
    critical: allRequests.filter(r => r.priority === 'Critical').length,
    high: allRequests.filter(r => r.priority === 'High').length,
    pendingApproval: allRequests.filter(r => r.status === 'Submitted' || r.status === 'Approved').length
  }

  const statusFilters = ['All', 'Submitted', 'Approved', 'Completed']

  el.innerHTML = `
    <div class="page-header">
      <div>
        <div class="page-title"><i class="ti ti-inbox"></i> Service Requests</div>
        <div class="page-subtitle">Manage and approve all self-service requests</div>
      </div>
    </div>

    <!-- KPI Stats -->
    <div class="kpi-row">
      <div class="kpi-tile">
        <div class="kpi-value info">${stats.total}</div>
        <div class="kpi-label">Total Requests</div>
      </div>
      <div class="kpi-tile">
        <div class="kpi-value warning">${stats.submitted}</div>
        <div class="kpi-label">Pending Review</div>
      </div>
      <div class="kpi-tile">
        <div class="kpi-value success">${stats.approved}</div>
        <div class="kpi-label">Processing</div>
      </div>
      <div class="kpi-tile">
        <div class="kpi-value info">${stats.completed}</div>
        <div class="kpi-label">Completed</div>
      </div>
      ${stats.critical > 0 ? `
      <div class="kpi-tile">
        <div class="kpi-value danger">${stats.critical}</div>
        <div class="kpi-label">Critical Priority</div>
      </div>
      ` : ''}
      ${stats.high > 0 ? `
      <div class="kpi-tile">
        <div class="kpi-value warning">${stats.high}</div>
        <div class="kpi-label">High Priority</div>
      </div>
      ` : ''}
      ${stats.pendingApproval > 0 ? `
      <div class="kpi-tile">
        <div class="kpi-value info">${stats.pendingApproval}</div>
        <div class="kpi-label">Awaiting Action</div>
      </div>
      ` : ''}
    </div>

    <!-- Filters & Search -->
    <div class="card" style="padding:16px">
      <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:12px;gap:12px">
        <div style="flex:1">
          <label style="font-size:10px;font-weight:600;color:var(--color-text-secondary);display:block;margin-bottom:6px">
            <i class="ti ti-search"></i> Search Requests
          </label>
          <input id="filter-search" type="text" placeholder="Search by ID, service, operation, or requester..." value="${filters.searchQuery}"
            style="width:100%;padding:8px;border:0.5px solid var(--color-border-secondary);border-radius:var(--border-radius-sm);font-size:11px;background:var(--color-background-primary);color:var(--color-text-primary)">
        </div>
        <button id="refresh-requests-btn" style="padding:8px 12px;background:var(--color-background-secondary);color:var(--color-text-primary);border:0.5px solid var(--color-border-secondary);border-radius:var(--border-radius-sm);cursor:pointer;font-size:11px;font-weight:600;display:flex;align-items:center;gap:6px;margin-top:22px;white-space:nowrap">
          <i class="ti ti-rotate-clockwise-2"></i> Refresh
        </button>
      </div>

      <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(180px,1fr));gap:12px">
        <div>
          <label style="font-size:10px;font-weight:600;color:var(--color-text-secondary);display:block;margin-bottom:6px">Status</label>
          <select id="filter-status" style="width:100%;padding:6px 8px;border:0.5px solid var(--color-border-secondary);border-radius:var(--border-radius-sm);font-size:11px;background:var(--color-background-primary);color:var(--color-text-primary)">
            ${statusFilters.map(s => `<option value="${s}" ${filters.status === s ? 'selected' : ''}>${s}</option>`).join('')}
          </select>
        </div>

        <div>
          <label style="font-size:10px;font-weight:600;color:var(--color-text-secondary);display:block;margin-bottom:6px">Service</label>
          <select id="filter-service" style="width:100%;padding:6px 8px;border:0.5px solid var(--color-border-secondary);border-radius:var(--border-radius-sm);font-size:11px;background:var(--color-background-primary);color:var(--color-text-primary)">
            ${SERVICES.map(s => `<option value="${s}" ${filters.service === s ? 'selected' : ''}>${s}</option>`).join('')}
          </select>
        </div>

        <div>
          <label style="font-size:10px;font-weight:600;color:var(--color-text-secondary);display:block;margin-bottom:6px">Date Range</label>
          <select id="filter-date" style="width:100%;padding:6px 8px;border:0.5px solid var(--color-border-secondary);border-radius:var(--border-radius-sm);font-size:11px;background:var(--color-background-primary);color:var(--color-text-primary)">
            <option value="all" ${filters.dateRange === 'all' ? 'selected' : ''}>All Time</option>
            <option value="1" ${filters.dateRange === '1' ? 'selected' : ''}>Last 24 Hours</option>
            <option value="7" ${filters.dateRange === '7' ? 'selected' : ''}>Last 7 Days</option>
            <option value="30" ${filters.dateRange === '30' ? 'selected' : ''}>Last 30 Days</option>
            <option value="90" ${filters.dateRange === '90' ? 'selected' : ''}>Last 90 Days</option>
          </select>
        </div>

        <div>
          <label style="font-size:10px;font-weight:600;color:var(--color-text-secondary);display:block;margin-bottom:6px">Priority</label>
          <select id="filter-priority" style="width:100%;padding:6px 8px;border:0.5px solid var(--color-border-secondary);border-radius:var(--border-radius-sm);font-size:11px;background:var(--color-background-primary);color:var(--color-text-primary)">
            <option value="All">All Priorities</option>
            <option value="Critical">🔴 Critical</option>
            <option value="High">🟠 High</option>
            <option value="Normal">🔵 Normal</option>
            <option value="Low">⚪ Low</option>
          </select>
        </div>
      </div>
    </div>

    <!-- Export & Report Buttons -->
    <div style="margin-top:16px;display:flex;gap:8px">
      <button id="export-csv-btn" style="padding:8px 12px;background:var(--clr-info-bg);color:var(--clr-info-text);border:none;border-radius:var(--border-radius-sm);cursor:pointer;font-size:11px;font-weight:600">
        <i class="ti ti-download"></i> Export CSV
      </button>
      <button id="compliance-report-btn" style="padding:8px 12px;background:var(--clr-success-bg);color:var(--clr-success-text);border:none;border-radius:var(--border-radius-sm);cursor:pointer;font-size:11px;font-weight:600">
        <i class="ti ti-file-text"></i> Compliance Report
      </button>
    </div>

    <!-- Bulk Actions Bar -->
    ${selectedRequests.size > 0 ? `
      <div style="margin-top:16px;padding:12px;background:var(--clr-info-bg);border-radius:var(--border-radius-sm);display:flex;align-items:center;justify-content:space-between">
        <span style="color:var(--clr-info-text);font-weight:600;font-size:11px">
          ${selectedRequests.size} request(s) selected
        </span>
        <div style="display:flex;gap:8px">
          <button id="bulk-approve-btn" style="padding:6px 12px;background:var(--clr-success-bg);color:var(--clr-success-text);border:none;border-radius:4px;cursor:pointer;font-size:10px;font-weight:600">
            <i class="ti ti-circle-check"></i> Approve All
          </button>
          <button id="bulk-reject-btn" style="padding:6px 12px;background:var(--clr-danger-bg);color:var(--clr-danger-text);border:none;border-radius:4px;cursor:pointer;font-size:10px;font-weight:600">
            <i class="ti ti-circle-x"></i> Reject All
          </button>
          <button id="bulk-clear-btn" style="padding:6px 12px;background:var(--color-background-secondary);color:var(--color-text-primary);border:none;border-radius:4px;cursor:pointer;font-size:10px">
            Clear Selection
          </button>
        </div>
      </div>
    ` : ''}

    <!-- Requests List -->
    <div class="card" style="margin-top:16px;padding:0;overflow:hidden">
      <div class="card-header">
        <span class="card-title">Requests (${filteredRequests.length})</span>
      </div>
      <div style="padding:0;overflow-x:auto;border-top:0.5px solid var(--color-border-secondary)">
        ${filteredRequests.length === 0 ? `
          <div style="padding:40px;text-align:center;color:var(--color-text-tertiary)">
            <i class="ti ti-inbox" style="font-size:32px;margin-bottom:12px;display:block"></i>
            <p style="margin:0">No requests found</p>
          </div>
        ` : `
          <!-- Desktop Table View -->
          <table style="width:100%;border-collapse:collapse;font-size:11px;display:none" class="requests-table-desktop">
            <thead style="background:var(--color-background-secondary)">
              <tr>
                <th style="padding:12px;text-align:center;font-weight:600;width:40px">
                  <input type="checkbox" id="select-all-cb" style="cursor:pointer">
                </th>
                <th style="padding:12px;text-align:left;font-weight:600">Request ID</th>
                <th style="padding:12px;text-align:left;font-weight:600">Service</th>
                <th style="padding:12px;text-align:left;font-weight:600">Operation</th>
                <th style="padding:12px;text-align:left;font-weight:600">Requester</th>
                <th style="padding:12px;text-align:left;font-weight:600">Submitted</th>
                <th style="padding:12px;text-align:left;font-weight:600">Priority</th>
                <th style="padding:12px;text-align:left;font-weight:600">Status</th>
                <th style="padding:12px;text-align:left;font-weight:600">SLA</th>
                <th style="padding:12px;text-align:center;font-weight:600">Action</th>
              </tr>
            </thead>
            <tbody>
              ${filteredRequests.map(req => {
                const priorityLevel = getPriorityLevel(req.priority || 'normal')
                const slaStatus = getSLAStatus(req.createdDate, 'manager-only', req.status)
                const slaColor = getSLAColor(slaStatus)
                const isSelected = selectedRequests.has(req.requestId)
                const submittedDate = new Date(req.createdDate).toLocaleString('en-GB', {
                  month: 'short',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })
                const requesterEmail = req.requesterId ? req.requesterId.split('@')[0] : 'Unknown'
                return `
                  <tr style="border-bottom:0.5px solid var(--color-border-tertiary);background:${isSelected ? 'var(--clr-info-bg)' : 'transparent'}" class="req-table-row" data-req-id="${req.requestId}">
                    <td style="padding:12px;text-align:center">
                      <input type="checkbox" class="req-checkbox" data-req-id="${req.requestId}" ${isSelected ? 'checked' : ''} style="cursor:pointer">
                    </td>
                    <td style="padding:12px;font-weight:600;color:var(--clr-info-text)">${req.requestId}</td>
                    <td style="padding:12px;font-size:10px">${req.service}</td>
                    <td style="padding:12px;font-size:10px">${req.operation || 'N/A'}</td>
                    <td style="padding:12px;font-size:10px" title="${req.requesterId}">${requesterEmail}</td>
                    <td style="padding:12px;font-size:10px">${submittedDate}</td>
                    <td style="padding:12px">
                      <span style="padding:2px 6px;border-radius:3px;background:${priorityLevel.bg};color:${priorityLevel.color};font-weight:600;font-size:9px">
                        <i class="ti ${priorityLevel.icon}"></i> ${priorityLevel.label}
                      </span>
                    </td>
                    <td style="padding:12px">
                      <span style="padding:4px 8px;border-radius:4px;font-weight:600;font-size:10px;background:${getStatusColor(req.status).bg};color:${getStatusColor(req.status).text}">
                        ${req.status}
                      </span>
                    </td>
                    <td style="padding:12px">
                      <div style="background:${slaColor.bg};color:${slaColor.text};padding:4px 8px;border-radius:3px;font-size:9px;font-weight:600;text-align:center">
                        ${slaStatus.message}
                      </div>
                    </td>
                    <td style="padding:12px;text-align:center">
                      ${req.status === 'Submitted' ? `
                        <button class="req-view-btn" data-id="${req.requestId}" style="padding:4px 8px;font-size:9px;background:var(--clr-info-bg);color:var(--clr-info-text);border:none;border-radius:3px;cursor:pointer">
                          Review
                        </button>
                      ` : `
                        <button class="req-view-btn" data-id="${req.requestId}" style="padding:4px 8px;font-size:9px;background:var(--color-background-secondary);color:var(--color-text-secondary);border:none;border-radius:3px;cursor:pointer">
                          View
                        </button>
                      `}
                    </td>
                  </tr>
                `
              }).join('')}
            </tbody>
          </table>

          <!-- Mobile Card View -->
          <div style="display:none" class="requests-cards-mobile">
            <div style="display:grid;gap:12px;padding:16px">
              ${filteredRequests.map(req => {
                const priorityLevel = getPriorityLevel(req.priority || 'normal')
                const slaStatus = getSLAStatus(req.createdDate, 'manager-only', req.status)
                const slaColor = getSLAColor(slaStatus)
                const isSelected = selectedRequests.has(req.requestId)
                const submittedDate = new Date(req.createdDate).toLocaleString('en-GB', {
                  month: 'short',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })
                const requesterEmail = req.requesterId ? req.requesterId.split('@')[0] : 'Unknown'
                return `
                  <div class="card" style="padding:16px;border-left:3px solid ${isSelected ? 'var(--clr-info-text)' : 'var(--color-border-secondary)'};background:${isSelected ? 'var(--clr-info-bg)' : 'transparent'}" data-req-id="${req.requestId}">
                    <div style="display:flex;align-items:flex-start;justify-content:space-between;margin-bottom:12px">
                      <div style="display:flex;align-items:center;gap:8px;flex:1">
                        <input type="checkbox" class="req-checkbox" data-req-id="${req.requestId}" ${isSelected ? 'checked' : ''} style="cursor:pointer;width:14px;height:14px;flex-shrink:0;margin-top:2px">
                        <div>
                          <div style="font-weight:700;font-size:12px;color:var(--clr-info-text);margin-bottom:2px">${req.requestId}</div>
                          <div style="font-size:11px;color:var(--color-text-secondary)">${req.service} • ${req.operation || 'N/A'}</div>
                        </div>
                      </div>
                      <span style="padding:2px 8px;border-radius:3px;background:${priorityLevel.bg};color:${priorityLevel.color};font-weight:600;font-size:9px;white-space:nowrap;margin-left:8px">
                        <i class="ti ${priorityLevel.icon}"></i> ${priorityLevel.label}
                      </span>
                    </div>

                    <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:12px">
                      <div>
                        <div style="color:var(--color-text-secondary);margin-bottom:4px;font-weight:600;font-size:11px">Requester</div>
                        <div style="color:var(--color-text-primary);font-size:11px">${requesterEmail}</div>
                      </div>
                      <div>
                        <div style="color:var(--color-text-secondary);margin-bottom:4px;font-weight:600;font-size:11px">Submitted</div>
                        <div style="color:var(--color-text-primary);font-size:11px">${submittedDate}</div>
                      </div>
                      <div>
                        <div style="color:var(--color-text-secondary);margin-bottom:4px;font-weight:600;font-size:11px">Status</div>
                        <span style="padding:3px 8px;border-radius:3px;font-weight:600;font-size:10px;background:${getStatusColor(req.status).bg};color:${getStatusColor(req.status).text}">
                          ${req.status}
                        </span>
                      </div>
                      <div>
                        <div style="color:var(--color-text-secondary);margin-bottom:4px;font-weight:600;font-size:11px">SLA</div>
                        <div style="background:${slaColor.bg};color:${slaColor.text};padding:3px 8px;border-radius:3px;font-size:10px;font-weight:600;text-align:center">
                          ${slaStatus.message}
                        </div>
                      </div>
                    </div>

                    <div style="display:flex;gap:8px;justify-content:flex-end;border-top:0.5px solid var(--color-border-tertiary);padding-top:12px">
                      ${req.status === 'Submitted' ? `
                        <button class="req-view-btn" data-id="${req.requestId}" style="padding:6px 12px;font-size:10px;background:var(--clr-info-bg);color:var(--clr-info-text);border:none;border-radius:4px;cursor:pointer;font-weight:600">
                          <i class="ti ti-eye"></i> Review
                        </button>
                      ` : `
                        <button class="req-view-btn" data-id="${req.requestId}" style="padding:6px 12px;font-size:10px;background:var(--color-background-secondary);color:var(--color-text-secondary);border:none;border-radius:4px;cursor:pointer;font-weight:600">
                          <i class="ti ti-eye"></i> View
                        </button>
                      `}
                    </div>
                  </div>
                `
              }).join('')}
            </div>
          </div>
        `}
      </div>
    </div>

    <!-- CSS to toggle views based on screen size -->
    <style>
      @media (max-width: 768px) {
        .requests-table-desktop { display: none !important; }
        .requests-cards-mobile { display: block !important; }
      }
      @media (min-width: 769px) {
        .requests-table-desktop { display: table !important; }
        .requests-cards-mobile { display: none !important; }
      }
    </style>
  `

  // Search listener
  el.querySelector('#filter-search')?.addEventListener('input', (e) => {
    filters.searchQuery = e.target.value
    applyFilters(el)
  })

  // Filter listeners
  el.querySelector('#filter-status')?.addEventListener('change', (e) => {
    filters.status = e.target.value
    applyFilters(el)
  })

  el.querySelector('#filter-service')?.addEventListener('change', (e) => {
    filters.service = e.target.value
    applyFilters(el)
  })

  el.querySelector('#filter-date')?.addEventListener('change', (e) => {
    filters.dateRange = e.target.value
    applyFilters(el)
  })

  el.querySelector('#filter-priority')?.addEventListener('change', (e) => {
    const val = e.target.value
    filters.priority = val.includes('All') ? 'All' : val.split(' ').pop()  // Extract last word (Critical, High, etc.)
    applyFilters(el)
  })

  // Refresh button listener
  el.querySelector('#refresh-requests-btn')?.addEventListener('click', async () => {
    const btn = el.querySelector('#refresh-requests-btn')
    const originalHTML = btn.innerHTML
    btn.disabled = true
    btn.innerHTML = '<i class="ti ti-loader-2" style="animation:spin 1s linear infinite"></i> Refreshing...'
    await loadSelfServiceRequests(el)
    btn.innerHTML = originalHTML
    btn.disabled = false
    showToast('Requests refreshed', 'success')
  })

  // Checkbox listeners
  el.querySelectorAll('.req-checkbox').forEach(cb => {
    cb.addEventListener('change', (e) => {
      const reqId = e.target.dataset.reqId
      if (e.target.checked) {
        selectedRequests.add(reqId)
      } else {
        selectedRequests.delete(reqId)
      }
      renderList(el)
    })
  })

  // Export listeners
  el.querySelector('#export-csv-btn')?.addEventListener('click', () => {
    exportToCSV(filteredRequests, `requests-${new Date().toISOString().split('T')[0]}.csv`)
    showToast('CSV exported successfully', 'success')
  })

  el.querySelector('#compliance-report-btn')?.addEventListener('click', () => {
    const stats = generateComplianceReport(filteredRequests)
    const html = generateComplianceReportHTML(stats)
    const printWindow = window.open('', '', 'width=900,height=600')
    printWindow.document.write(html)
    printWindow.document.close()
  })

  // Bulk action listeners
  el.querySelector('#bulk-approve-btn')?.addEventListener('click', () => {
    const selectedReqs = Array.from(selectedRequests)
      .map(id => filteredRequests.find(r => r.requestId === id))
      .filter(r => r && r.status === 'Submitted')

    if (selectedReqs.length === 0) {
      showToast('No submitted requests selected', 'warning')
      return
    }

    const modal = document.createElement('div')
    modal.style.cssText = 'position:fixed;top:0;left:0;right:0;bottom:0;background:rgba(0,0,0,0.5);display:flex;align-items:center;justify-content:center;z-index:1000'

    modal.innerHTML = `
      <div style="background:var(--color-background-primary);border-radius:var(--border-radius-md);max-width:400px;width:90%;box-shadow:0 4px 12px rgba(0,0,0,0.15)">
        <div style="padding:16px;border-bottom:0.5px solid var(--color-border-secondary);font-weight:600">
          <i class="ti ti-circle-check" style="color:var(--clr-success-text);margin-right:8px"></i>Approve ${selectedReqs.length} Request(s)
        </div>
        <div style="padding:16px">
          <p style="margin:0 0 12px 0;font-size:11px">Approve these ${selectedReqs.length} request(s)?</p>
          <ul style="margin:0;padding-left:20px;font-size:10px">
            ${selectedReqs.map(r => `<li>${r.requestId} - ${r.service}</li>`).join('')}
          </ul>
        </div>
        <div style="padding:12px;border-top:0.5px solid var(--color-border-secondary);display:flex;gap:8px;justify-content:flex-end">
          <button class="modal-close" style="padding:6px 12px;background:var(--color-background-secondary);color:var(--color-text-primary);border:none;border-radius:4px;cursor:pointer;font-size:10px">
            Cancel
          </button>
          <button class="confirm-bulk-approve" style="padding:6px 12px;background:var(--clr-success-bg);color:var(--clr-success-text);border:none;border-radius:4px;cursor:pointer;font-size:10px;font-weight:600">
            Approve All
          </button>
        </div>
      </div>
    `

    modal.querySelector('.modal-close').addEventListener('click', () => modal.remove())
    modal.querySelector('.confirm-bulk-approve').addEventListener('click', async () => {
      for (const req of selectedReqs) {
        try {
          await callAPI(`/self-service/requests/${req.requestId}/approve`, 'PUT', {
            approverId: state.currentUser?.email || window.userEmail || 'admin@contoso.com'
          })
          req.status = 'Approved'
          req.approvedDate = new Date().toISOString()
          notifyRequestApproved(req, 'admin@contoso.com')
        } catch (err) {
          console.error(`Error approving ${req.requestId}:`, err)
        }
      }
      selectedRequests.clear()
      showToast(`${selectedReqs.length} request(s) approved`, 'success')
      modal.remove()
      renderList(el)
    })

    el.appendChild(modal)
  })

  el.querySelector('#bulk-reject-btn')?.addEventListener('click', () => {
    const selectedReqs = Array.from(selectedRequests)
      .map(id => filteredRequests.find(r => r.requestId === id))
      .filter(r => r && r.status === 'Submitted')

    if (selectedReqs.length === 0) {
      showToast('No submitted requests selected', 'warning')
      return
    }

    const modal = document.createElement('div')
    modal.style.cssText = 'position:fixed;top:0;left:0;right:0;bottom:0;background:rgba(0,0,0,0.5);display:flex;align-items:center;justify-content:center;z-index:1000'

    modal.innerHTML = `
      <div style="background:var(--color-background-primary);border-radius:var(--border-radius-md);max-width:400px;width:90%;box-shadow:0 4px 12px rgba(0,0,0,0.15)">
        <div style="padding:16px;border-bottom:0.5px solid var(--color-border-secondary);font-weight:600">
          <i class="ti ti-circle-x" style="color:var(--clr-danger-text);margin-right:8px"></i>Reject ${selectedReqs.length} Request(s)
        </div>
        <div style="padding:16px">
          <p style="margin:0 0 12px 0;font-size:11px">Why are you rejecting these ${selectedReqs.length} request(s)?</p>
          <textarea class="bulk-reject-reason" placeholder="Rejection reason..."
            style="width:100%;padding:8px;border:0.5px solid var(--color-border-secondary);border-radius:4px;font-size:10px;min-height:60px;resize:vertical;background:var(--color-background-secondary);color:var(--color-text-primary);font-family:inherit"></textarea>
        </div>
        <div style="padding:12px;border-top:0.5px solid var(--color-border-secondary);display:flex;gap:8px;justify-content:flex-end">
          <button class="modal-close" style="padding:6px 12px;background:var(--color-background-secondary);color:var(--color-text-primary);border:none;border-radius:4px;cursor:pointer;font-size:10px">
            Cancel
          </button>
          <button class="confirm-bulk-reject" style="padding:6px 12px;background:var(--clr-danger-bg);color:var(--clr-danger-text);border:none;border-radius:4px;cursor:pointer;font-size:10px;font-weight:600">
            Reject All
          </button>
        </div>
      </div>
    `

    modal.querySelector('.modal-close').addEventListener('click', () => modal.remove())
    modal.querySelector('.confirm-bulk-reject').addEventListener('click', async () => {
      const reason = modal.querySelector('.bulk-reject-reason').value.trim()
      if (!reason) {
        showToast('Please provide a rejection reason', 'warning')
        return
      }

      for (const req of selectedReqs) {
        try {
          await callAPI(`/self-service/requests/${req.requestId}/reject`, 'PUT', {
            rejectedBy: state.currentUser?.email || window.userEmail || 'admin@contoso.com',
            reason
          })
          req.status = 'Rejected'
          notifyRequestRejected(req, 'admin@contoso.com', reason)
        } catch (err) {
          console.error(`Error rejecting ${req.requestId}:`, err)
        }
      }
      selectedRequests.clear()
      showToast(`${selectedReqs.length} request(s) rejected`, 'success')
      modal.remove()
      renderList(el)
    })

    el.appendChild(modal)
  })

  el.querySelector('#bulk-clear-btn')?.addEventListener('click', () => {
    selectedRequests.clear()
    renderList(el)
  })

  // View button listeners
  el.querySelectorAll('.req-view-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const reqId = btn.dataset.id
      selectedRequest = allRequests.find(r => r.requestId === reqId)
      if (selectedRequest) {
        viewMode = 'details'
        renderDetails(el)
      }
    })
  })
}

function renderDetails(el) {
  if (!el || !selectedRequest) return

  const req = selectedRequest
  const statusColor = getStatusColor(req.status)
  const createdDate = new Date(req.createdDate).toLocaleString()

  el.innerHTML = `
    <div class="page-header">
      <div style="display:flex;align-items:center;gap:12px">
        <button class="back-btn btn" style="padding:6px 12px;border:none;background:var(--color-background-secondary);color:var(--color-text-primary);cursor:pointer;border-radius:var(--border-radius-sm)">
          <i class="ti ti-arrow-left"></i> Back
        </button>
        <div>
          <div class="page-title">${req.requestId}</div>
          <div class="page-subtitle">${req.service} • ${req.operation}</div>
        </div>
      </div>
    </div>

    <div class="grid-2" style="gap:16px">
      <div>
        <div class="card" style="margin-bottom:16px">
          <div class="card-header"><span class="card-title">Request Information</span></div>
          <div style="padding:16px;border-top:0.5px solid var(--color-border-secondary);font-size:11px">
            <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:12px">
              <div>
                <div style="font-weight:600;color:var(--color-text-tertiary);font-size:10px;margin-bottom:4px">Service</div>
                <div>${req.service}</div>
              </div>
              <div>
                <div style="font-weight:600;color:var(--color-text-tertiary);font-size:10px;margin-bottom:4px">Status</div>
                <span style="padding:2px 6px;border-radius:3px;background:${statusColor.bg};color:${statusColor.text};font-weight:600">${req.status}</span>
              </div>
              <div>
                <div style="font-weight:600;color:var(--color-text-tertiary);font-size:10px;margin-bottom:4px">Submitted By</div>
                <div>${req.requesterId}</div>
              </div>
              <div>
                <div style="font-weight:600;color:var(--color-text-tertiary);font-size:10px;margin-bottom:4px">Submitted Date</div>
                <div>${createdDate}</div>
              </div>
            </div>
          </div>
        </div>

        <div class="card">
          <div class="card-header"><span class="card-title">Submitted Information</span></div>
          <div style="padding:16px;border-top:0.5px solid var(--color-border-secondary);font-size:11px">
            ${Object.entries(req.formData || {}).length === 0 ? `
              <div style="color:var(--color-text-secondary)">No additional information provided</div>
            ` : `
              <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px">
                ${Object.entries(req.formData).map(([key, value]) => `
                  <div>
                    <div style="font-weight:600;color:var(--color-text-tertiary);font-size:10px;margin-bottom:4px">${key}</div>
                    <div style="word-break:break-word">${value || 'N/A'}</div>
                  </div>
                `).join('')}
              </div>
            `}
          </div>
        </div>
      </div>

      <div>
        <div class="card">
          <div class="card-header"><span class="card-title">Actions</span></div>
          <div style="padding:16px;border-top:0.5px solid var(--color-border-secondary);display:flex;flex-direction:column;gap:8px">
            ${req.status === 'Submitted' ? `
              <button id="approve-btn" style="padding:10px 12px;background:var(--clr-success-bg);color:var(--clr-success-text);border:none;border-radius:var(--border-radius-sm);font-weight:600;cursor:pointer;font-size:11px">
                <i class="ti ti-circle-check"></i> Approve Request
              </button>
              <button id="reject-btn" style="padding:10px 12px;background:var(--clr-danger-bg);color:var(--clr-danger-text);border:none;border-radius:var(--border-radius-sm);font-weight:600;cursor:pointer;font-size:11px">
                <i class="ti ti-circle-x"></i> Reject Request
              </button>
            ` : `
              <div style="padding:12px;background:var(--color-background-secondary);border-radius:var(--border-radius-sm);font-size:10px;color:var(--color-text-secondary);text-align:center">
                This request cannot be modified (${req.status})
              </div>
            `}
            <button id="back-btn-2" style="padding:10px 12px;background:var(--color-background-secondary);color:var(--color-text-primary);border:none;border-radius:var(--border-radius-sm);cursor:pointer;font-size:11px;margin-top:8px">
              <i class="ti ti-arrow-left"></i> Back to List
            </button>
          </div>
        </div>

        ${req.approvedDate || req.completedDate ? `
          <div class="card" style="margin-top:16px">
            <div class="card-header"><span class="card-title">Timeline</span></div>
            <div style="padding:16px;border-top:0.5px solid var(--color-border-secondary);font-size:11px">
              <div style="display:flex;gap:8px;margin-bottom:12px">
                <div style="width:20px;height:20px;border-radius:50%;background:var(--clr-success-bg);display:flex;align-items:center;justify-content:center;flex-shrink:0">
                  <i class="ti ti-check" style="font-size:10px;color:var(--clr-success-text)"></i>
                </div>
                <div style="flex:1">
                  <div style="font-weight:600">Submitted</div>
                  <div style="font-size:10px;color:var(--color-text-secondary)">${createdDate}</div>
                </div>
              </div>
              ${req.approvedDate ? `
                <div style="display:flex;gap:8px;margin-bottom:12px">
                  <div style="width:20px;height:20px;border-radius:50%;background:var(--clr-success-bg);display:flex;align-items:center;justify-content:center;flex-shrink:0">
                    <i class="ti ti-check" style="font-size:10px;color:var(--clr-success-text)"></i>
                  </div>
                  <div style="flex:1">
                    <div style="font-weight:600">Approved</div>
                    <div style="font-size:10px;color:var(--color-text-secondary)">${new Date(req.approvedDate).toLocaleString()}</div>
                  </div>
                </div>
              ` : ''}
              ${req.completedDate ? `
                <div style="display:flex;gap:8px">
                  <div style="width:20px;height:20px;border-radius:50%;background:var(--clr-success-bg);display:flex;align-items:center;justify-content:center;flex-shrink:0">
                    <i class="ti ti-check" style="font-size:10px;color:var(--clr-success-text)"></i>
                  </div>
                  <div style="flex:1">
                    <div style="font-weight:600">Completed</div>
                    <div style="font-size:10px;color:var(--color-text-secondary)">${new Date(req.completedDate).toLocaleString()}</div>
                  </div>
                </div>
              ` : ''}
            </div>
          </div>
        ` : ''}
      </div>
    </div>

    <!-- Discussion Thread -->
    <div style="margin-top:20px">
      <div class="card">
        <div class="card-header">
          <span class="card-title"><i class="ti ti-message-circle"></i> Discussion Thread</span>
          <span style="font-size:10px;color:var(--color-text-secondary)">${getRequestComments(req.requestId).length} comment(s)</span>
        </div>
        <div style="padding:16px;border-top:0.5px solid var(--color-border-secondary)">
          <div id="discussion-thread" style="max-height:400px;overflow-y:auto;margin-bottom:16px"></div>

          <!-- Comment Input -->
          <div style="border-top:0.5px solid var(--color-border-secondary);padding-top:12px">
            <textarea id="comment-input" placeholder="Add a comment..."
              style="width:100%;padding:8px;border:0.5px solid var(--color-border-secondary);border-radius:4px;font-size:11px;font-family:inherit;min-height:60px;resize:vertical;background:var(--color-background-secondary);color:var(--color-text-primary)"></textarea>
            <div style="display:flex;gap:8px;margin-top:8px">
              <button id="add-comment-btn" style="flex:1;padding:8px;background:var(--clr-info-bg);color:var(--clr-info-text);border:none;border-radius:4px;cursor:pointer;font-size:10px;font-weight:600">
                <i class="ti ti-send"></i> Add Comment
              </button>
              ${req.status === 'Submitted' ? `
                <button id="cancel-request-btn" style="padding:8px 12px;background:var(--clr-warning-bg);color:var(--clr-warning-text);border:none;border-radius:4px;cursor:pointer;font-size:10px;font-weight:600">
                  <i class="ti ti-x"></i> Request Cancellation
                </button>
              ` : ''}
            </div>
          </div>
        </div>
      </div>
    </div>
  `

  // Render discussion thread
  const threadContainer = el.querySelector('#discussion-thread')
  const comments = getRequestComments(req.requestId)

  if (comments.length === 0) {
    threadContainer.innerHTML = '<div style="text-align:center;color:var(--color-text-tertiary);padding:20px">No comments yet. Start a discussion!</div>'
  } else {
    threadContainer.innerHTML = comments.map((comment, idx) => {
      const isSystemMessage = ['cancellation-request', 'cancellation-approved', 'cancellation-denied'].includes(comment.type)
      const isCancellationRequest = comment.type === 'cancellation-request'
      const bgColor = isSystemMessage ? 'var(--color-background-secondary)' : (comment.isAdmin ? 'var(--clr-info-bg)' : 'var(--color-background-primary)')
      const textColor = isSystemMessage ? 'var(--color-text-primary)' : (comment.isAdmin ? 'var(--clr-info-text)' : 'var(--color-text-secondary)')
      const timestamp = new Date(comment.timestamp).toLocaleString('en-GB', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })

      // Check if there's already a response to this cancellation request
      const hasResponse = comments.slice(idx + 1).some(c =>
        (c.type === 'cancellation-approved' || c.type === 'cancellation-denied')
      )

      return `
        <div style="margin-bottom:12px;padding:10px;background:${bgColor};border-radius:4px;border-left:3px solid ${comment.isAdmin ? 'var(--clr-info-text)' : 'var(--color-border-secondary)'}">
          <div style="display:flex;justify-content:space-between;margin-bottom:6px">
            <div style="font-weight:600;font-size:10px;color:${textColor}">
              ${comment.author} ${comment.isAdmin ? '<span style="background:var(--clr-info-text);color:white;padding:2px 6px;border-radius:2px;margin-left:6px;font-size:8px">ADMIN</span>' : ''}
            </div>
            <div style="font-size:9px;color:var(--color-text-tertiary)">${timestamp}</div>
          </div>
          <div style="font-size:11px;color:var(--color-text-primary);white-space:pre-wrap">${comment.content}</div>
          ${isCancellationRequest && !hasResponse ? `
            <div style="display:flex;gap:8px;margin-top:8px;padding-top:8px;border-top:0.5px solid ${comment.isAdmin ? 'var(--clr-info-text)' : 'var(--color-border-secondary)'}">
              <button class="approve-cancel-btn" data-req-id="${req.requestId}" style="flex:1;padding:6px;background:var(--clr-success-bg);color:var(--clr-success-text);border:none;border-radius:3px;cursor:pointer;font-size:9px;font-weight:600">
                <i class="ti ti-circle-check"></i> Approve Cancellation
              </button>
              <button class="deny-cancel-btn" data-req-id="${req.requestId}" style="flex:1;padding:6px;background:var(--clr-danger-bg);color:var(--clr-danger-text);border:none;border-radius:3px;cursor:pointer;font-size:9px;font-weight:600">
                <i class="ti ti-circle-x"></i> Deny Cancellation
              </button>
            </div>
          ` : ''}
        </div>
      `
    }).join('')

    // Add event listeners for cancellation approval/denial
    el.querySelectorAll('.approve-cancel-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const modal = document.createElement('div')
        modal.style.cssText = 'position:fixed;top:0;left:0;right:0;bottom:0;background:rgba(0,0,0,0.5);display:flex;align-items:center;justify-content:center;z-index:1000'

        modal.innerHTML = `
          <div style="background:var(--color-background-primary);border-radius:var(--border-radius-md);max-width:400px;width:90%;box-shadow:0 4px 12px rgba(0,0,0,0.15)">
            <div style="padding:16px;border-bottom:0.5px solid var(--color-border-secondary);font-weight:600">
              <i class="ti ti-circle-check" style="color:var(--clr-success-text);margin-right:8px"></i>Approve Cancellation
            </div>
            <div style="padding:16px">
              <p style="margin:0 0 12px 0;font-size:11px">Are you sure you want to approve the cancellation of <strong>${req.requestId}</strong>?</p>
              <label style="font-size:10px;font-weight:600;color:var(--color-text-secondary);display:block;margin-bottom:6px">Optional Comment</label>
              <textarea class="cancel-comment" placeholder="Add a comment for the requester..."
                style="width:100%;padding:8px;border:0.5px solid var(--color-border-secondary);border-radius:4px;font-size:10px;min-height:60px;resize:vertical;background:var(--color-background-secondary);color:var(--color-text-primary);font-family:inherit"></textarea>
            </div>
            <div style="padding:12px;border-top:0.5px solid var(--color-border-secondary);display:flex;gap:8px;justify-content:flex-end">
              <button class="modal-close" style="padding:6px 12px;background:var(--color-background-secondary);color:var(--color-text-primary);border:none;border-radius:4px;cursor:pointer;font-size:10px">
                Keep Request
              </button>
              <button class="confirm-approve" style="padding:6px 12px;background:var(--clr-success-bg);color:var(--clr-success-text);border:none;border-radius:4px;cursor:pointer;font-size:10px;font-weight:600">
                Approve Cancellation
              </button>
            </div>
          </div>
        `

        modal.querySelector('.modal-close').addEventListener('click', () => modal.remove())
        modal.querySelector('.confirm-approve').addEventListener('click', () => {
          const comment = modal.querySelector('.cancel-comment').value.trim()
          approveCancellation(req.requestId, state.currentUser?.email || 'admin@contoso.com', state.currentUser?.name || 'Admin', comment || 'Cancellation approved')
          showToast('Cancellation approved', 'success')
          modal.remove()
          renderDetails(el)
        })

        el.appendChild(modal)
      })
    })

    el.querySelectorAll('.deny-cancel-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const modal = document.createElement('div')
        modal.style.cssText = 'position:fixed;top:0;left:0;right:0;bottom:0;background:rgba(0,0,0,0.5);display:flex;align-items:center;justify-content:center;z-index:1000'

        modal.innerHTML = `
          <div style="background:var(--color-background-primary);border-radius:var(--border-radius-md);max-width:400px;width:90%;box-shadow:0 4px 12px rgba(0,0,0,0.15)">
            <div style="padding:16px;border-bottom:0.5px solid var(--color-border-secondary);font-weight:600">
              <i class="ti ti-circle-x" style="color:var(--clr-danger-text);margin-right:8px"></i>Deny Cancellation
            </div>
            <div style="padding:16px">
              <p style="margin:0 0 12px 0;font-size:11px">Why do you want to deny the cancellation of <strong>${req.requestId}</strong>?</p>
              <label style="font-size:10px;font-weight:600;color:var(--color-text-secondary);display:block;margin-bottom:6px">Reason *</label>
              <textarea class="deny-reason" placeholder="Explain why the cancellation cannot be approved..."
                style="width:100%;padding:8px;border:0.5px solid var(--color-border-secondary);border-radius:4px;font-size:10px;min-height:60px;resize:vertical;background:var(--color-background-secondary);color:var(--color-text-primary);font-family:inherit"></textarea>
            </div>
            <div style="padding:12px;border-top:0.5px solid var(--color-border-secondary);display:flex;gap:8px;justify-content:flex-end">
              <button class="modal-close" style="padding:6px 12px;background:var(--color-background-secondary);color:var(--color-text-primary);border:none;border-radius:4px;cursor:pointer;font-size:10px">
                Cancel
              </button>
              <button class="confirm-deny" style="padding:6px 12px;background:var(--clr-danger-bg);color:var(--clr-danger-text);border:none;border-radius:4px;cursor:pointer;font-size:10px;font-weight:600">
                Deny Cancellation
              </button>
            </div>
          </div>
        `

        modal.querySelector('.modal-close').addEventListener('click', () => modal.remove())
        modal.querySelector('.confirm-deny').addEventListener('click', () => {
          const reason = modal.querySelector('.deny-reason').value.trim()
          if (!reason) {
            showToast('Please provide a reason', 'warning')
            return
          }
          denyCancellation(req.requestId, state.currentUser?.email || 'admin@contoso.com', state.currentUser?.name || 'Admin', reason)
          showToast('Cancellation denied', 'info')
          modal.remove()
          renderDetails(el)
        })

        el.appendChild(modal)
      })
    })
  }

  // Comment input handler
  el.querySelector('#add-comment-btn').addEventListener('click', () => {
    const textarea = el.querySelector('#comment-input')
    const content = textarea.value.trim()

    if (!content) {
      showToast('Please enter a comment', 'warning')
      return
    }

    const comment = addComment(req.requestId, {
      author: state.currentUser?.name || 'You',
      authorEmail: state.currentUser?.email || 'user@contoso.com',
      content,
      isAdmin: state.currentUser?.role === 'admin' || state.currentUser?.role === 'super',
    })

    textarea.value = ''
    showToast('Comment added', 'success')

    // Re-render discussion thread
    renderDetails(el)
  })

  // Cancellation request handler
  el.querySelector('#cancel-request-btn')?.addEventListener('click', () => {
    const modal = document.createElement('div')
    modal.style.cssText = 'position:fixed;top:0;left:0;right:0;bottom:0;background:rgba(0,0,0,0.5);display:flex;align-items:center;justify-content:center;z-index:1000'

    modal.innerHTML = `
      <div style="background:var(--color-background-primary);border-radius:var(--border-radius-md);max-width:400px;width:90%;box-shadow:0 4px 12px rgba(0,0,0,0.15)">
        <div style="padding:16px;border-bottom:0.5px solid var(--color-border-secondary);font-weight:600">
          <i class="ti ti-alert-circle" style="color:var(--clr-warning-text);margin-right:8px"></i>Request Cancellation
        </div>
        <div style="padding:16px">
          <p style="margin:0 0 12px 0;font-size:11px">Are you sure you want to request cancellation of <strong>${req.requestId}</strong>?</p>
          <label style="font-size:10px;font-weight:600;color:var(--color-text-secondary);display:block;margin-bottom:6px">Reason for Cancellation *</label>
          <textarea id="cancel-reason" placeholder="Explain why you want to cancel this request..."
            style="width:100%;padding:8px;border:0.5px solid var(--color-border-secondary);border-radius:var(--border-radius-sm);font-size:10px;min-height:80px;resize:vertical;background:var(--color-background-secondary);color:var(--color-text-primary);font-family:inherit"></textarea>
        </div>
        <div style="padding:12px;border-top:0.5px solid var(--color-border-secondary);display:flex;gap:8px;justify-content:flex-end">
          <button id="cancel-modal-close" style="padding:6px 12px;background:var(--color-background-secondary);color:var(--color-text-primary);border:none;border-radius:var(--border-radius-sm);cursor:pointer;font-size:11px">
            Keep Request
          </button>
          <button id="confirm-cancel" style="padding:6px 12px;background:var(--clr-warning-bg);color:var(--clr-warning-text);border:none;border-radius:var(--border-radius-sm);cursor:pointer;font-size:11px;font-weight:600">
            Request Cancellation
          </button>
        </div>
      </div>
    `

    modal.querySelector('#cancel-modal-close').addEventListener('click', () => modal.remove())
    modal.querySelector('#confirm-cancel').addEventListener('click', () => {
      const reason = modal.querySelector('#cancel-reason').value.trim()
      if (!reason) {
        showToast('Please provide a cancellation reason', 'warning')
        return
      }

      addCancellationRequest(req.requestId, reason, state.currentUser?.email || 'user@contoso.com', state.currentUser?.name || 'You')
      showToast('Cancellation request submitted', 'info')
      modal.remove()
      renderDetails(el)
    })

    el.appendChild(modal)
  })

  el.querySelector('.back-btn')?.addEventListener('click', () => {
    viewMode = 'list'
    renderList(el)
  })

  el.querySelector('#back-btn-2')?.addEventListener('click', () => {
    viewMode = 'list'
    renderList(el)
  })

  el.querySelector('#approve-btn')?.addEventListener('click', async () => {
    await handleApproveRequest(el)
  })

  el.querySelector('#reject-btn')?.addEventListener('click', async () => {
    await handleRejectRequest(el)
  })
}

async function handleApproveRequest(el) {
  if (!selectedRequest) return

  const modal = createApprovalModal('Approve Request', selectedRequest.requestId, async (comment) => {
    try {
      const result = await callAPI(`/self-service/requests/${selectedRequest.requestId}/approve`, 'PUT', {
        approverId: state.currentUser?.email || 'admin@contoso.com',
        comment
      })

      if (result.success) {
        showToast(`Request ${selectedRequest.requestId} approved`, 'success')
        selectedRequest.status = 'Approved'
        selectedRequest.approvedDate = new Date().toISOString()

        // Send approval notification email
        try {
          const approverEmail = state.currentUser?.email || 'admin@contoso.com'
          const requesterEmail = selectedRequest.requesterId
          await notifyRequestApproved(requesterEmail, selectedRequest, approverEmail, comment)
          console.log(`✓ Approval notification sent to ${requesterEmail}`)
        } catch (error) {
          console.warn('⚠️ Failed to send approval notification:', error)
        }

        viewMode = 'list'
        await loadSelfServiceRequests(el)
      } else {
        showToast(`Error: ${result.error}`, 'error')
      }
    } catch (error) {
      console.error('Error approving request:', error)
      showToast('Error approving request', 'error')
    }

    modal.remove()
  })

  el.appendChild(modal)
}

async function handleRejectRequest(el) {
  if (!selectedRequest) return

  const modal = createRejectionModal('Reject Request', selectedRequest.requestId, async (reason) => {
    try {
      const result = await callAPI(`/self-service/requests/${selectedRequest.requestId}/reject`, 'PUT', {
        rejectedBy: state.currentUser?.email || 'admin@contoso.com',
        reason
      })

      if (result.success) {
        showToast(`Request ${selectedRequest.requestId} rejected`, 'info')
        selectedRequest.status = 'Rejected'

        // Send rejection notification email
        try {
          const reviewerEmail = state.currentUser?.email || 'admin@contoso.com'
          const requesterEmail = selectedRequest.requesterId
          await notifyRequestRejected(requesterEmail, selectedRequest, reviewerEmail, reason)
          console.log(`✓ Rejection notification sent to ${requesterEmail}`)
        } catch (error) {
          console.warn('⚠️ Failed to send rejection notification:', error)
        }

        viewMode = 'list'
        await loadSelfServiceRequests(el)
      } else {
        showToast(`Error: ${result.error}`, 'error')
      }
    } catch (error) {
      console.error('Error rejecting request:', error)
      showToast('Error rejecting request', 'error')
    }

    modal.remove()
  })

  el.appendChild(modal)
}

function createApprovalModal(title, requestId, onConfirm) {
  const modal = document.createElement('div')
  modal.style.cssText = 'position:fixed;top:0;left:0;right:0;bottom:0;background:rgba(0,0,0,0.5);display:flex;align-items:center;justify-content:center;z-index:1000'

  modal.innerHTML = `
    <div style="background:var(--color-background-primary);border-radius:var(--border-radius-md);max-width:400px;width:90%;box-shadow:0 4px 12px rgba(0,0,0,0.15)">
      <div style="padding:16px;border-bottom:0.5px solid var(--color-border-secondary);font-weight:600">
        <i class="ti ti-circle-check" style="color:var(--clr-success-text);margin-right:8px"></i>${title}
      </div>
      <div style="padding:16px">
        <p style="margin:0 0 12px 0;font-size:11px">Are you sure you want to approve <strong>${requestId}</strong>?</p>
        <textarea id="approval-comment" placeholder="Add optional comment..." style="width:100%;padding:8px;border:0.5px solid var(--color-border-secondary);border-radius:var(--border-radius-sm);font-size:10px;min-height:60px;resize:vertical;background:var(--color-background-secondary);color:var(--color-text-primary);font-family:inherit"></textarea>
      </div>
      <div style="padding:12px;border-top:0.5px solid var(--color-border-secondary);display:flex;gap:8px;justify-content:flex-end">
        <button id="cancel-btn" style="padding:6px 12px;background:var(--color-background-secondary);color:var(--color-text-primary);border:none;border-radius:var(--border-radius-sm);cursor:pointer;font-size:11px">
          Cancel
        </button>
        <button id="confirm-btn" style="padding:6px 12px;background:var(--clr-success-bg);color:var(--clr-success-text);border:none;border-radius:var(--border-radius-sm);cursor:pointer;font-size:11px;font-weight:600">
          Approve
        </button>
      </div>
    </div>
  `

  modal.querySelector('#cancel-btn').addEventListener('click', () => modal.remove())
  modal.querySelector('#confirm-btn').addEventListener('click', () => {
    const comment = modal.querySelector('#approval-comment').value
    onConfirm(comment)
  })

  return modal
}

function createRejectionModal(title, requestId, onConfirm) {
  const modal = document.createElement('div')
  modal.style.cssText = 'position:fixed;top:0;left:0;right:0;bottom:0;background:rgba(0,0,0,0.5);display:flex;align-items:center;justify-content:center;z-index:1000'

  modal.innerHTML = `
    <div style="background:var(--color-background-primary);border-radius:var(--border-radius-md);max-width:400px;width:90%;box-shadow:0 4px 12px rgba(0,0,0,0.15)">
      <div style="padding:16px;border-bottom:0.5px solid var(--color-border-secondary);font-weight:600">
        <i class="ti ti-circle-x" style="color:var(--clr-danger-text);margin-right:8px"></i>${title}
      </div>
      <div style="padding:16px">
        <p style="margin:0 0 12px 0;font-size:11px">Are you sure you want to reject <strong>${requestId}</strong>?</p>
        <label style="font-size:10px;font-weight:600;color:var(--color-text-secondary);display:block;margin-bottom:6px">Rejection Reason *</label>
        <textarea id="rejection-reason" placeholder="Provide reason for rejection..." style="width:100%;padding:8px;border:0.5px solid var(--color-border-secondary);border-radius:var(--border-radius-sm);font-size:10px;min-height:60px;resize:vertical;background:var(--color-background-secondary);color:var(--color-text-primary);font-family:inherit" required></textarea>
      </div>
      <div style="padding:12px;border-top:0.5px solid var(--color-border-secondary);display:flex;gap:8px;justify-content:flex-end">
        <button id="cancel-btn" style="padding:6px 12px;background:var(--color-background-secondary);color:var(--color-text-primary);border:none;border-radius:var(--border-radius-sm);cursor:pointer;font-size:11px">
          Cancel
        </button>
        <button id="confirm-btn" style="padding:6px 12px;background:var(--clr-danger-bg);color:var(--clr-danger-text);border:none;border-radius:var(--border-radius-sm);cursor:pointer;font-size:11px;font-weight:600">
          Reject
        </button>
      </div>
    </div>
  `

  modal.querySelector('#cancel-btn').addEventListener('click', () => modal.remove())
  modal.querySelector('#confirm-btn').addEventListener('click', () => {
    const reason = modal.querySelector('#rejection-reason').value
    if (!reason.trim()) {
      showToast('Please provide a rejection reason', 'warning')
      return
    }
    onConfirm(reason)
  })

  return modal
}

function getStatusColor(status) {
  const colors = {
    'Submitted': { bg: 'var(--clr-info-bg)', text: 'var(--clr-info-text)' },
    'Approved': { bg: 'var(--clr-success-bg)', text: 'var(--clr-success-text)' },
    'Rejected': { bg: 'var(--clr-danger-bg)', text: 'var(--clr-danger-text)' },
    'Completed': { bg: 'var(--clr-success-bg)', text: 'var(--clr-success-text)' }
  }
  return colors[status] || { bg: 'var(--color-background-secondary)', text: 'var(--color-text-secondary)' }
}
