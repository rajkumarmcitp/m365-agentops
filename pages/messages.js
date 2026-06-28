import { skeletonLoader } from '../lib/skeleton-loader.js'
import { SVC_META, SVC_HEALTH } from '../data/msgcenter-data.js'

let allMessages = []
let filteredMessages = []
let filters = {
  service: 'All',
  status: 'All',
  severity: 'All',
  searchQuery: ''
}

export async function initMessages() {
  const el = document.getElementById('page-messages')
  if (!el) return

  renderMessagesHeader(el)
  loadMessages(el)
}

function renderMessagesHeader(el) {
  el.innerHTML = `
    <div class="page-header">
      <div>
        <div class="page-title"><i class="ti ti-heartbeat"></i> Service Health Messages</div>
        <div class="page-subtitle">Monitor and manage all service health notifications, assignments, and resolutions</div>
      </div>
      <div class="page-actions">
        <button class="btn" id="msg-refresh"><i class="ti ti-refresh"></i> Refresh</button>
        <button class="btn btn-primary" id="msg-export"><i class="ti ti-download"></i> Export</button>
      </div>
    </div>

    <!-- Filters Section -->
    <div class="card" style="margin-bottom:16px">
      <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(150px,1fr));gap:12px;padding:0">
        <div style="padding:12px">
          <div style="font-size:10px;font-weight:600;color:var(--color-text-secondary);margin-bottom:6px;text-transform:uppercase">Service</div>
          <select id="msg-filter-service" style="width:100%;padding:8px;border:0.5px solid var(--color-border-secondary);border-radius:4px;font-size:11px;background:var(--color-background-primary);color:var(--color-text-primary)">
            <option value="All">All Services</option>
            ${Object.keys(SVC_META).map(svc => `<option value="${svc}">${svc}</option>`).join('')}
          </select>
        </div>
        <div style="padding:12px">
          <div style="font-size:10px;font-weight:600;color:var(--color-text-secondary);margin-bottom:6px;text-transform:uppercase">Status</div>
          <select id="msg-filter-status" style="width:100%;padding:8px;border:0.5px solid var(--color-border-secondary);border-radius:4px;font-size:11px;background:var(--color-background-primary);color:var(--color-text-primary)">
            <option value="All">All Status</option>
            <option value="active">Active</option>
            <option value="assigned">Assigned</option>
            <option value="reviewing">In Review</option>
            <option value="resolved">Resolved</option>
          </select>
        </div>
        <div style="padding:12px">
          <div style="font-size:10px;font-weight:600;color:var(--color-text-secondary);margin-bottom:6px;text-transform:uppercase">Severity</div>
          <select id="msg-filter-severity" style="width:100%;padding:8px;border:0.5px solid var(--color-border-secondary);border-radius:4px;font-size:11px;background:var(--color-background-primary);color:var(--color-text-primary)">
            <option value="All">All Severity</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
        </div>
        <div style="padding:12px">
          <div style="font-size:10px;font-weight:600;color:var(--color-text-secondary);margin-bottom:6px;text-transform:uppercase">Search</div>
          <input type="text" id="msg-search" placeholder="Search messages..." style="width:100%;padding:8px;border:0.5px solid var(--color-border-secondary);border-radius:4px;font-size:11px;background:var(--color-background-primary);color:var(--color-text-primary)">
        </div>
      </div>
    </div>

    <!-- Messages List -->
    <div id="msg-container"></div>
  `

  // Add filter listeners
  el.querySelector('#msg-filter-service')?.addEventListener('change', (e) => {
    filters.service = e.target.value
    applyFilters(el)
  })

  el.querySelector('#msg-filter-status')?.addEventListener('change', (e) => {
    filters.status = e.target.value
    applyFilters(el)
  })

  el.querySelector('#msg-filter-severity')?.addEventListener('change', (e) => {
    filters.severity = e.target.value
    applyFilters(el)
  })

  el.querySelector('#msg-search')?.addEventListener('input', (e) => {
    filters.searchQuery = e.target.value
    applyFilters(el)
  })

  el.querySelector('#msg-refresh')?.addEventListener('click', () => {
    loadMessages(el)
  })
}

function loadMessages(el) {
  // Load demo data (in production, this would fetch from API)
  allMessages = SVC_HEALTH.map((msg, idx) => ({
    ...msg,
    assigned: idx % 3 === 0 ? 'John Smith' : idx % 3 === 1 ? 'Sarah Johnson' : null,
    reviewed: idx % 4 === 0,
    resolvedDate: msg.status === 'resolved' ? new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString() : null,
    reviewedBy: idx % 4 === 0 ? 'Mike Chen' : null
  }))

  applyFilters(el)
}

function applyFilters(el) {
  filteredMessages = allMessages.filter(msg => {
    const serviceMatch = filters.service === 'All' || msg.service === filters.service
    const statusMatch = filters.status === 'All' ||
      (filters.status === 'active' && msg.status !== 'resolved') ||
      (filters.status === 'resolved' && msg.status === 'resolved') ||
      (filters.status === 'assigned' && msg.assigned) ||
      (filters.status === 'reviewing' && msg.reviewed)
    const severityMatch = filters.severity === 'All' || msg.severity === filters.severity
    const searchMatch = filters.searchQuery === '' ||
      msg.title.toLowerCase().includes(filters.searchQuery.toLowerCase()) ||
      msg.id.toLowerCase().includes(filters.searchQuery.toLowerCase())

    return serviceMatch && statusMatch && severityMatch && searchMatch
  })

  renderMessages(el)
}

function renderMessages(el) {
  const container = el.querySelector('#msg-container')

  if (filteredMessages.length === 0) {
    container.innerHTML = `
      <div style="padding:40px;text-align:center;background:var(--color-background-secondary);border-radius:8px">
        <i class="ti ti-inbox" style="font-size:48px;color:var(--color-text-tertiary);margin-bottom:12px;opacity:0.5;display:block"></i>
        <div style="color:var(--color-text-secondary);margin-bottom:8px">No messages found</div>
        <div style="font-size:11px;color:var(--color-text-tertiary)">Try adjusting your filters</div>
      </div>
    `
    return
  }

  container.innerHTML = `
    <div style="display:grid;gap:12px">
      ${filteredMessages.map(msg => {
        const svc = SVC_META[msg.service] || { icon: 'ti-apps', color: '#185FA5', bg: '#E6F1FB' }
        const statusColor = msg.status === 'resolved' ? '#4caf50' : msg.severity === 'high' ? '#f44336' : '#ff9800'
        const statusLabel = msg.status === 'resolved' ? 'Resolved' : 'Active'
        const assignmentClass = msg.assigned ? 'success' : 'neutral'
        const reviewClass = msg.reviewed ? 'success' : 'warning'

        return `
          <div class="card" style="padding:16px;cursor:pointer;transition:all 200ms" onmouseover="this.style.boxShadow='0 4px 12px rgba(0,0,0,0.1)'" onmouseout="this.style.boxShadow=''">
            <div style="display:grid;grid-template-columns:auto 1fr auto;gap:16px;align-items:start">
              <!-- Service Icon -->
              <div style="width:40px;height:40px;border-radius:8px;background:${svc.bg};display:flex;align-items:center;justify-content:center;color:${svc.color};font-size:20px;flex-shrink:0">
                <i class="ti ${svc.icon}"></i>
              </div>

              <!-- Message Details -->
              <div style="flex:1;min-width:0">
                <div style="display:flex;align-items:center;gap:8px;margin-bottom:8px">
                  <div style="font-weight:700;font-size:12px">${msg.title}</div>
                  <span class="badge ${msg.severity === 'high' ? 'danger' : msg.severity === 'medium' ? 'warning' : 'info'}" style="font-size:9px">${msg.severity.toUpperCase()}</span>
                </div>
                <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(120px,1fr));gap:8px;margin-bottom:8px;font-size:10px;color:var(--color-text-secondary)">
                  <div><strong>ID:</strong> ${msg.id}</div>
                  <div><strong>Service:</strong> ${msg.service}</div>
                  <div><strong>Started:</strong> ${new Date(msg.startDate || Date.now()).toLocaleDateString()}</div>
                </div>
              </div>

              <!-- Status & Tracking -->
              <div style="text-align:right;flex-shrink:0">
                <div style="margin-bottom:8px">
                  <span class="badge ${statusColor === '#4caf50' ? 'success' : statusColor === '#f44336' ? 'danger' : 'warning'}" style="display:inline-block;font-size:10px">${statusLabel}</span>
                </div>

                <!-- Assignments -->
                <div style="display:flex;align-items:center;gap:6px;margin-bottom:8px;font-size:9px;justify-content:flex-end">
                  <i class="ti ti-user" style="font-size:12px;color:${msg.assigned ? '#4caf50' : '#999'}"></i>
                  <span style="color:${msg.assigned ? '#4caf50' : '#999'}">${msg.assigned ? 'Assigned to ' + msg.assigned : 'Unassigned'}</span>
                </div>

                <!-- Review Status -->
                <div style="display:flex;align-items:center;gap:6px;margin-bottom:8px;font-size:9px;justify-content:flex-end">
                  <i class="ti ti-check-circle" style="font-size:12px;color:${msg.reviewed ? '#4caf50' : '#ff9800'}"></i>
                  <span style="color:${msg.reviewed ? '#4caf50' : '#ff9800'}">${msg.reviewed ? 'Reviewed by ' + msg.reviewedBy : 'Pending Review'}</span>
                </div>

                <!-- Resolution Tracking -->
                ${msg.status === 'resolved' ? `
                  <div style="display:flex;align-items:center;gap:6px;font-size:9px;color:#4caf50;justify-content:flex-end">
                    <i class="ti ti-circle-check" style="font-size:12px"></i>
                    <span>Resolved ${new Date(msg.resolvedDate).toLocaleDateString()}</span>
                  </div>
                ` : ''}
              </div>
            </div>

            <!-- Expandable Details -->
            <div style="margin-top:12px;padding-top:12px;border-top:0.5px solid var(--color-border-secondary);display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:12px;font-size:10px">
              <div>
                <div style="color:var(--color-text-secondary);margin-bottom:4px">Description</div>
                <div style="color:var(--color-text-primary)">${msg.description || 'No description provided'}</div>
              </div>
              <div>
                <div style="color:var(--color-text-secondary);margin-bottom:4px">Impact</div>
                <div style="color:var(--color-text-primary)">${msg.impact || 'Service disruption'}</div>
              </div>
              ${msg.assigned ? `
                <div>
                  <div style="color:var(--color-text-secondary);margin-bottom:4px">Assigned To</div>
                  <div style="color:var(--color-text-primary)">${msg.assigned}</div>
                </div>
              ` : ''}
              ${msg.reviewedBy ? `
                <div>
                  <div style="color:var(--color-text-secondary);margin-bottom:4px">Reviewed By</div>
                  <div style="color:var(--color-text-primary)">${msg.reviewedBy}</div>
                </div>
              ` : ''}
            </div>
          </div>
        `
      }).join('')}
    </div>
  `
}
