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

  renderMessagesLayout(el)
  loadMessages(el)
}

let selectedMessage = null

function renderMessagesLayout(el) {
  el.innerHTML = `
    <div class="page-header">
      <div>
        <div class="page-title"><i class="ti ti-heartbeat"></i> Service Health Messages</div>
        <div class="page-subtitle">Monitor and manage all service health notifications</div>
      </div>
      <div class="page-actions">
        <button class="btn" id="msg-refresh"><i class="ti ti-refresh"></i> Refresh</button>
        <button class="btn btn-primary" id="msg-export"><i class="ti ti-download"></i> Export</button>
      </div>
    </div>

    <!-- Main Container with Left & Right Panels -->
    <div style="display:grid;grid-template-columns:1fr 380px;gap:16px;height:calc(100vh - 240px);margin-bottom:16px">
      <!-- Left Panel: Filters & Messages -->
      <div style="display:flex;flex-direction:column;gap:12px;overflow:hidden">
        <!-- Filters -->
        <div class="card" style="margin:0;padding:12px">
          <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(120px,1fr));gap:8px">
            <div>
              <div style="font-size:9px;font-weight:600;color:var(--color-text-secondary);margin-bottom:4px;text-transform:uppercase">Service</div>
              <select id="msg-filter-service" style="width:100%;padding:6px;border:0.5px solid var(--color-border-secondary);border-radius:4px;font-size:11px;background:var(--color-background-primary);color:var(--color-text-primary)">
                <option value="All">All Services</option>
                ${Object.keys(SVC_META).map(svc => `<option value="${svc}">${svc}</option>`).join('')}
              </select>
            </div>
            <div>
              <div style="font-size:9px;font-weight:600;color:var(--color-text-secondary);margin-bottom:4px;text-transform:uppercase">Status</div>
              <select id="msg-filter-status" style="width:100%;padding:6px;border:0.5px solid var(--color-border-secondary);border-radius:4px;font-size:11px;background:var(--color-background-primary);color:var(--color-text-primary)">
                <option value="All">All Status</option>
                <option value="active">Active</option>
                <option value="assigned">Assigned</option>
                <option value="reviewing">In Review</option>
                <option value="resolved">Resolved</option>
              </select>
            </div>
            <div>
              <div style="font-size:9px;font-weight:600;color:var(--color-text-secondary);margin-bottom:4px;text-transform:uppercase">Severity</div>
              <select id="msg-filter-severity" style="width:100%;padding:6px;border:0.5px solid var(--color-border-secondary);border-radius:4px;font-size:11px;background:var(--color-background-primary);color:var(--color-text-primary)">
                <option value="All">All Severity</option>
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
            </div>
            <div>
              <div style="font-size:9px;font-weight:600;color:var(--color-text-secondary);margin-bottom:4px;text-transform:uppercase">Search</div>
              <input type="text" id="msg-search" placeholder="Search..." style="width:100%;padding:6px;border:0.5px solid var(--color-border-secondary);border-radius:4px;font-size:11px;background:var(--color-background-primary);color:var(--color-text-primary)">
            </div>
          </div>
        </div>

        <!-- Messages List -->
        <div id="msg-container" style="flex:1;overflow-y:auto;display:grid;gap:8px"></div>
      </div>

      <!-- Right Panel: Detail View -->
      <div id="msg-detail-panel" style="background:var(--color-background-secondary);border-radius:8px;padding:16px;overflow-y:auto;display:flex;align-items:center;justify-content:center;color:var(--color-text-secondary);font-size:13px">
        Select a message to view details
      </div>
    </div>
  `

  // Filter listeners
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

  const html = filteredMessages.map((msg, idx) => {
    const svc = SVC_META[msg.service] || { icon: 'ti-apps', color: '#185FA5', bg: '#E6F1FB' }
    const statusLabel = msg.status === 'resolved' ? 'Resolved' : msg.reviewed ? 'Reviewed' : msg.assigned ? 'Assigned' : 'Active'
    const statusColor = msg.status === 'resolved' ? '#4caf50' : msg.reviewed ? '#4caf50' : msg.assigned ? '#ff9800' : '#f44336'

    return `
      <div class="card msg-card" data-msg-idx="${idx}" style="padding:12px;cursor:pointer;transition:all 150ms;border-left:3px solid ${statusColor}">
        <div style="display:flex;gap:10px;align-items:start">
          <div style="width:36px;height:36px;border-radius:6px;background:${svc.bg};display:flex;align-items:center;justify-content:center;color:${svc.color};font-size:18px;flex-shrink:0">
            <i class="ti ${svc.icon}"></i>
          </div>
          <div style="flex:1;min-width:0">
            <div style="font-weight:600;font-size:12px;margin-bottom:2px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${msg.title}</div>
            <div style="font-size:10px;color:var(--color-text-secondary);margin-bottom:6px">${msg.service}</div>
            <div style="display:flex;gap:6px;flex-wrap:wrap">
              <span class="badge ${msg.severity === 'high' ? 'danger' : msg.severity === 'medium' ? 'warning' : 'info'}" style="font-size:8px">${msg.severity.toUpperCase()}</span>
              <span class="badge" style="background:${statusColor}30;color:${statusColor};font-size:8px">${statusLabel}</span>
            </div>
          </div>
        </div>
      </div>
    `
  }).join('')

  container.innerHTML = html

  // Click handlers
  container.querySelectorAll('.msg-card').forEach(card => {
    card.addEventListener('click', () => {
      const idx = parseInt(card.dataset.msgIdx)
      selectedMessage = filteredMessages[idx]
      showMessageDetail(el, selectedMessage)

      // Visual feedback
      container.querySelectorAll('.msg-card').forEach(c => c.style.background = '')
      card.style.background = 'var(--color-background-secondary)'
    })
  })
}

function showMessageDetail(el, msg) {
  const panel = el.querySelector('#msg-detail-panel')
  if (!panel) return

  const svc = SVC_META[msg.service] || { icon: 'ti-apps', color: '#185FA5', bg: '#E6F1FB' }
  const statusColor = msg.status === 'resolved' ? '#4caf50' : msg.severity === 'high' ? '#f44336' : '#ff9800'

  panel.innerHTML = `
    <!-- Header -->
    <div style="width:100%;padding-bottom:12px;border-bottom:0.5px solid var(--color-border-secondary);margin-bottom:12px">
      <div style="display:flex;gap:10px;align-items:start">
        <div style="width:40px;height:40px;border-radius:6px;background:${svc.bg};display:flex;align-items:center;justify-content:center;color:${svc.color};font-size:18px;flex-shrink:0">
          <i class="ti ${svc.icon}"></i>
        </div>
        <div style="flex:1;min-width:0">
          <div style="font-weight:700;font-size:12px;margin-bottom:2px">${msg.title}</div>
          <div style="font-size:9px;color:var(--color-text-secondary);margin-bottom:6px">${msg.id}</div>
          <div style="display:flex;gap:6px">
            <span class="badge ${msg.severity === 'high' ? 'danger' : msg.severity === 'medium' ? 'warning' : 'info'}" style="font-size:8px">${msg.severity.toUpperCase()}</span>
            <span class="badge" style="background:${statusColor}30;color:${statusColor};font-size:8px">${msg.status === 'resolved' ? 'Resolved' : 'Active'}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Summary Section -->
    <div style="margin-bottom:14px">
      <div style="font-size:11px;font-weight:600;margin-bottom:8px;color:var(--color-text-primary);text-transform:uppercase">Summary</div>
      <div style="font-size:10px;color:var(--color-text-secondary);line-height:1.5;background:var(--color-background-primary);padding:8px;border-radius:4px;margin-bottom:8px">
        ${msg.description || 'No description provided'}
      </div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;font-size:9px">
        <div>
          <div style="color:var(--color-text-secondary);margin-bottom:2px">Service</div>
          <div style="color:var(--color-text-primary);font-weight:500">${msg.service}</div>
        </div>
        <div>
          <div style="color:var(--color-text-secondary);margin-bottom:2px">Started</div>
          <div style="color:var(--color-text-primary);font-weight:500">${new Date(msg.startDate || Date.now()).toLocaleDateString()}</div>
        </div>
      </div>
    </div>

    <!-- Admin Actions Section -->
    <div style="background:var(--color-background-primary);padding:12px;border-radius:6px">
      <div style="font-size:11px;font-weight:600;margin-bottom:10px;color:var(--color-text-primary);text-transform:uppercase">Admin Actions</div>

      <!-- Review Status -->
      <div style="margin-bottom:10px">
        <label style="display:block;font-size:9px;font-weight:600;margin-bottom:4px;color:var(--color-text-secondary);text-transform:uppercase">Review Status</label>
        <select id="msg-review-status" style="width:100%;padding:6px;border:0.5px solid var(--color-border-secondary);border-radius:4px;font-size:10px;background:var(--color-background-secondary);color:var(--color-text-primary)">
          <option value="pending" ${!msg.reviewed ? 'selected' : ''}>Pending Review</option>
          <option value="reviewed" ${msg.reviewed ? 'selected' : ''}>Reviewed</option>
        </select>
      </div>

      <!-- Assign To -->
      <div style="margin-bottom:10px">
        <label style="display:block;font-size:9px;font-weight:600;margin-bottom:4px;color:var(--color-text-secondary);text-transform:uppercase">Assign To</label>
        <input type="text" id="msg-assign-to" placeholder="Email or name..." value="${msg.assigned || ''}" style="width:100%;padding:6px;border:0.5px solid var(--color-border-secondary);border-radius:4px;font-size:10px;background:var(--color-background-secondary);color:var(--color-text-primary)">
      </div>

      <!-- Set Deadline -->
      <div style="margin-bottom:10px">
        <label style="display:block;font-size:9px;font-weight:600;margin-bottom:4px;color:var(--color-text-secondary);text-transform:uppercase">Set Deadline</label>
        <input type="date" id="msg-deadline" value="${msg.deadline || ''}" style="width:100%;padding:6px;border:0.5px solid var(--color-border-secondary);border-radius:4px;font-size:10px;background:var(--color-background-secondary);color:var(--color-text-primary)">
      </div>

      <!-- Notes -->
      <div style="margin-bottom:10px">
        <label style="display:block;font-size:9px;font-weight:600;margin-bottom:4px;color:var(--color-text-secondary);text-transform:uppercase">Notes</label>
        <textarea id="msg-notes" placeholder="Add notes..." style="width:100%;padding:6px;border:0.5px solid var(--color-border-secondary);border-radius:4px;font-size:10px;background:var(--color-background-secondary);color:var(--color-text-primary);min-height:70px;resize:vertical">${msg.notes || ''}</textarea>
      </div>

      <!-- Save Button -->
      <button id="msg-save-btn" style="width:100%;padding:8px;background:var(--clr-primary-bg);color:white;border:none;border-radius:4px;cursor:pointer;font-weight:600;font-size:11px;margin-bottom:8px">💾 Save Changes</button>

      <!-- Status Info -->
      ${msg.status === 'resolved' ? `
        <div style="padding:8px;background:#4caf5020;border-radius:4px;border-left:3px solid #4caf50;font-size:9px;color:#4caf50">
          ✓ Resolved on ${new Date(msg.resolvedDate).toLocaleDateString()}
        </div>
      ` : ''}
    </div>
  `

  // Save handler
  el.querySelector('#msg-save-btn')?.addEventListener('click', () => {
    msg.reviewed = el.querySelector('#msg-review-status').value === 'reviewed'
    msg.assigned = el.querySelector('#msg-assign-to').value || null
    msg.deadline = el.querySelector('#msg-deadline').value || null
    msg.notes = el.querySelector('#msg-notes').value || ''
    msg.reviewedBy = msg.reviewed ? 'You' : null

    // Visual feedback
    const btn = el.querySelector('#msg-save-btn')
    btn.textContent = '✓ Saved!'
    btn.style.background = '#4caf50'
    setTimeout(() => {
      btn.textContent = '💾 Save Changes'
      btn.style.background = 'var(--clr-primary-bg)'
    }, 2000)
  })
}
