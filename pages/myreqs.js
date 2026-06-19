import { SERVICE_GROUPS, SERVICE_CATALOG } from '../data/portal-services.js'
import { api } from '../lib/api-client.js'

// Helper to get service display name
function getServiceDisplayName(serviceId) {
  const service = SERVICE_GROUPS.find(s => s.id === serviceId)
  return service ? service.name : serviceId
}

// Helper to get operation display name
function getOperationDisplayName(serviceId, operationId) {
  const catalog = SERVICE_CATALOG[serviceId]
  if (catalog && catalog.operations) {
    const op = catalog.operations.find(o => o.id === operationId)
    if (op) return op.label
  }
  return operationId
}

// Helper to extract the requested item name from form data
function getRequestedItemName(serviceId, operationId, formData) {
  if (!formData || typeof formData !== 'object') return '—'

  // Map operation IDs to the form field that contains the item name
  const itemNameMapping = {
    'create-team': 'displayName',
    'create-channel': 'channelName',
    'create-m365-group': 'displayName',
    'create-dg': 'displayName',
    'add-team-members': 'teamName',
    'add-m365-members': 'groupName',
    'create-shared-mailbox': 'displayName',
    'create-security-group': 'displayName',
    'request-guest-access': 'displayName',
    'assign-license': 'userEmail',
    'reset-password': 'userEmail',
    'create-user': 'email',
  }

  const fieldName = itemNameMapping[operationId]
  if (fieldName && formData[fieldName]) {
    return formData[fieldName]
  }

  // Fallback: try to find any displayName or name field
  if (formData.displayName) return formData.displayName
  if (formData.name) return formData.name
  if (formData.teamName) return formData.teamName
  if (formData.groupName) return formData.groupName
  if (formData.channelName) return formData.channelName
  if (formData.userEmail) return formData.userEmail
  if (formData.email) return formData.email

  return '—'
}

export async function initMyReqs() {
  const el = document.getElementById('page-myreqs')
  if (!el) return

  // Show loading state
  el.innerHTML = `
    <div class="page-header">
      <div>
        <div class="page-title"><i class="ti ti-list-check"></i> My Requests</div>
        <div class="page-subtitle">Track the status of your submitted service requests</div>
      </div>
    </div>

    <div style="margin:16px">
      <div class="spinner"></div>
      <p>Loading your requests...</p>
    </div>
  `

  try {
    // Get user email
    const userEmail = window.userEmail || localStorage.getItem('userEmail')
    if (!userEmail) {
      throw new Error('User email not found')
    }

    // Fetch user's requests from backend
    const response = await fetch(`${api}/self-service/requests/my-requests?email=${encodeURIComponent(userEmail)}`)
    const result = await response.json()

    if (!result.success || !result.data || result.data.length === 0) {
      renderEmptyState(el)
      return
    }

    renderMyRequestsList(el, result.data)
  } catch (error) {
    console.error('Error loading requests:', error.message)
    renderErrorState(el, error.message)
  }
}

function renderEmptyState(el) {
  el.innerHTML = `
    <div class="page-header">
      <div>
        <div class="page-title"><i class="ti ti-list-check"></i> My Requests</div>
        <div class="page-subtitle">Track the status of your submitted service requests</div>
      </div>
    </div>

    <div class="empty-state" style="padding:60px 20px;text-align:center;margin-top:20px">
      <i class="ti ti-inbox" style="font-size:48px;color:var(--color-text-tertiary);margin-bottom:16px;opacity:0.5;display:block"></i>
      <h3 style="color:var(--color-text-secondary);margin-bottom:8px">No Requests Yet</h3>
      <p style="color:var(--color-text-tertiary)">You haven't submitted any service requests yet</p>
    </div>
  `
}

function renderErrorState(el, error) {
  el.innerHTML = `
    <div class="page-header">
      <div>
        <div class="page-title"><i class="ti ti-list-check"></i> My Requests</div>
      </div>
    </div>

    <div class="alert-banner danger" style="margin:16px">
      <i class="ti ti-alert-triangle"></i>
      <span>Failed to load requests: ${error}</span>
    </div>
  `
}

function renderMyRequestsList(el, requests) {
  const statusColors = {
    'Submitted': { bg: '#EBF5FF', text: '#0066CC', icon: 'ti-send' },
    'Approved': { bg: '#EBF5FF', text: '#0066CC', icon: 'ti-circle-check' },
    'Rejected': { bg: '#FFEBEE', text: '#C62828', icon: 'ti-circle-x' },
    'Completed': { bg: '#E8F5E9', text: '#2E7D32', icon: 'ti-circle-check' },
    'Cancelled': { bg: '#F3E5F5', text: '#6A1B9A', icon: 'ti-circle-x' }
  }

  const submitted = requests.filter(r => r.status === 'Submitted').length
  const pending = requests.filter(r => r.status === 'Approved').length
  const completed = requests.filter(r => r.status === 'Completed').length
  const rejected = requests.filter(r => r.status === 'Rejected').length

  el.innerHTML = `
    <div class="page-header">
      <div>
        <div class="page-title"><i class="ti ti-list-check"></i> My Requests</div>
        <div class="page-subtitle">Track the status of your submitted service requests</div>
      </div>
    </div>

    <div style="margin:16px">
      <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:12px;margin-bottom:20px">
        <div class="card" style="padding:16px">
          <div style="font-size:24px;font-weight:700;color:#0066CC;margin-bottom:4px">${requests.length}</div>
          <div style="font-size:12px;color:var(--color-text-secondary)">Total Requests</div>
        </div>
        <div class="card" style="padding:16px">
          <div style="font-size:24px;font-weight:700;color:#FF9800;margin-bottom:4px">${submitted}</div>
          <div style="font-size:12px;color:var(--color-text-secondary)">Submitted</div>
        </div>
        <div class="card" style="padding:16px">
          <div style="font-size:24px;font-weight:700;color:#2196F3;margin-bottom:4px">${pending}</div>
          <div style="font-size:12px;color:var(--color-text-secondary)">Processing</div>
        </div>
        <div class="card" style="padding:16px">
          <div style="font-size:24px;font-weight:700;color:#4CAF50;margin-bottom:4px">${completed}</div>
          <div style="font-size:12px;color:var(--color-text-secondary)">Completed</div>
        </div>
        ${rejected > 0 ? `
        <div class="card" style="padding:16px">
          <div style="font-size:24px;font-weight:700;color:#F44336;margin-bottom:4px">${rejected}</div>
          <div style="font-size:12px;color:var(--color-text-secondary)">Rejected</div>
        </div>
        ` : ''}
      </div>

      <div class="card" style="padding:0;overflow:hidden">
        <table style="width:100%;border-collapse:collapse">
          <thead style="background:var(--color-background-secondary);border-bottom:1px solid var(--color-border-primary)">
            <tr>
              <th style="padding:12px;text-align:left;font-weight:700;font-size:11px;text-transform:uppercase;letter-spacing:0.3px;color:var(--color-text-secondary)">Request ID</th>
              <th style="padding:12px;text-align:left;font-weight:700;font-size:11px;text-transform:uppercase;letter-spacing:0.3px;color:var(--color-text-secondary)">Requested Service</th>
              <th style="padding:12px;text-align:left;font-weight:700;font-size:11px;text-transform:uppercase;letter-spacing:0.3px;color:var(--color-text-secondary)">Type of Request</th>
              <th style="padding:12px;text-align:left;font-weight:700;font-size:11px;text-transform:uppercase;letter-spacing:0.3px;color:var(--color-text-secondary)">Item Name</th>
              <th style="padding:12px;text-align:left;font-weight:700;font-size:11px;text-transform:uppercase;letter-spacing:0.3px;color:var(--color-text-secondary)">Submitted</th>
              <th style="padding:12px;text-align:left;font-weight:700;font-size:11px;text-transform:uppercase;letter-spacing:0.3px;color:var(--color-text-secondary)">Status</th>
            </tr>
          </thead>
          <tbody>
            ${requests.map(req => {
              const color = statusColors[req.status] || statusColors['Submitted']
              const createdDate = new Date(req.createdDate).toLocaleString('en-GB', {
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })
              const serviceDisplay = getServiceDisplayName(req.service)
              const operationDisplay = getOperationDisplayName(req.service, req.operation)
              let formData = {}
              try {
                formData = typeof req.formData === 'string' ? JSON.parse(req.formData) : (req.formData || {})
              } catch (e) {
                formData = {}
              }
              const itemName = getRequestedItemName(req.service, req.operation, formData)
              return `
                <tr style="border-bottom:0.5px solid var(--color-border-tertiary);transition:background var(--transition);hover:background var(--color-background-secondary)">
                  <td style="padding:12px;font-size:12px;font-weight:700;color:#0066CC">${req.requestId}</td>
                  <td style="padding:12px;font-size:12px;color:var(--color-text-primary)" title="${req.service}">${serviceDisplay || '—'}</td>
                  <td style="padding:12px;font-size:12px;color:var(--color-text-primary)" title="${req.operation}">${operationDisplay || '—'}</td>
                  <td style="padding:12px;font-size:12px;color:var(--color-text-primary);font-weight:500">${itemName}</td>
                  <td style="padding:12px;font-size:12px;color:var(--color-text-secondary)">${createdDate}</td>
                  <td style="padding:12px;font-size:11px">
                    <span style="background:${color.bg};color:${color.text};padding:4px 8px;border-radius:4px;font-weight:600;display:inline-flex;align-items:center;gap:4px;white-space:nowrap">
                      <i class="ti ${color.icon}" style="font-size:11px"></i> ${req.status}
                    </span>
                  </td>
                </tr>
              `
            }).join('')}
          </tbody>
        </table>
      </div>
    </div>
  `
}
