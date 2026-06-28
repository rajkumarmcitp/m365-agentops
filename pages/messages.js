import { skeletonLoader } from '../lib/skeleton-loader.js'
import { SVC_META, SVC_HEALTH } from '../data/msgcenter-data.js'
import { state } from '../app.js'
import {
  getServiceHealthMessages,
  searchServiceHealthMessages,
  refreshServiceHealth,
  getServiceHealthStatus,
  isServiceHealthInitialized,
  onServiceHealthEvent,
  exportServiceHealthMessages
} from '../lib/service-health-manager.js'

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

  // Listen for sync events from Service Health manager
  if (isServiceHealthInitialized()) {
    // Listen for successful syncs
    onServiceHealthEvent('refreshed', () => {
      console.log('[Messages] Service Health sync completed, refreshing UI')
      loadMessages(el)
    })

    // Listen for sync errors
    onServiceHealthEvent('syncError', (detail) => {
      console.warn('[Messages] Service Health sync error:', detail.error)
    })
  }
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

    <!-- Main Container: Single Column with Expandable Cards -->
    <div style="display:flex;flex-direction:column;gap:12px;margin-bottom:16px;max-width:1200px">
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

      <!-- Messages Container (Single Column with Expandable Cards) -->
      <div id="msg-container" style="display:flex;flex-direction:column;gap:12px"></div>
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

  el.querySelector('#msg-refresh')?.addEventListener('click', async () => {
    const refreshBtn = el.querySelector('#msg-refresh')
    refreshBtn.disabled = true
    refreshBtn.innerHTML = '<span class="spinner dark" style="width:14px;height:14px;margin-right:6px"></span> Refreshing...'

    try {
      if (isServiceHealthInitialized()) {
        // Trigger manual sync from SharePoint
        await refreshServiceHealth()
      }
      loadMessages(el)
    } catch (error) {
      console.error('Refresh error:', error)
    } finally {
      refreshBtn.disabled = false
      refreshBtn.innerHTML = '<i class="ti ti-refresh"></i> Refresh'
    }
  })
}


function loadMessages(el) {
  // Load from Service Health sync service
  if (isServiceHealthInitialized()) {
    // Fetch real data from SharePoint via sync service
    allMessages = getServiceHealthMessages()
    console.log(`[Messages] Loaded ${allMessages.length} messages from Service Health`)
  } else {
    // Fall back to demo data if not configured
    console.log('[Messages] Service Health not configured, using demo data')
    allMessages = SVC_HEALTH.map((msg, idx) => ({
      ...msg,
      assigned: idx % 3 === 0 ? 'John Smith' : idx % 3 === 1 ? 'Sarah Johnson' : null,
      reviewed: idx % 4 === 0,
      resolvedDate: msg.status === 'resolved' ? new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString() : null,
      reviewedBy: idx % 4 === 0 ? 'Mike Chen' : null
    }))
  }

  applyFilters(el)
}

function applyFilters(el) {
  // Use service filtering if available
  if (isServiceHealthInitialized()) {
    filteredMessages = searchServiceHealthMessages(filters)
  } else {
    // Fallback to local filtering
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
        (msg.messageId && msg.messageId.toLowerCase().includes(filters.searchQuery.toLowerCase())) ||
        (msg.id && msg.id.toLowerCase().includes(filters.searchQuery.toLowerCase()))

      return serviceMatch && statusMatch && severityMatch && searchMatch
    })
  }

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
      <div class="card msg-card" data-msg-idx="${idx}" style="cursor:pointer;transition:all 150ms;overflow:hidden">
        <!-- Collapsed View (Always Visible) -->
        <div class="msg-collapsed" style="padding:12px;border-left:3px solid ${statusColor};display:flex;gap:10px;align-items:start">
          <div style="width:36px;height:36px;border-radius:6px;background:${svc.bg};display:flex;align-items:center;justify-content:center;color:${svc.color};font-size:18px;flex-shrink:0">
            <i class="ti ${svc.icon}"></i>
          </div>
          <div style="flex:1;min-width:0">
            <div style="font-weight:600;font-size:12px;margin-bottom:2px">${msg.title}</div>
            <div style="font-size:10px;color:var(--color-text-secondary);margin-bottom:6px">${msg.service}</div>
            <div style="display:flex;gap:6px;flex-wrap:wrap">
              <span class="badge ${msg.severity === 'high' ? 'danger' : msg.severity === 'medium' ? 'warning' : 'info'}" style="font-size:8px">${msg.severity.toUpperCase()}</span>
              <span class="badge" style="background:${statusColor}30;color:${statusColor};font-size:8px">${statusLabel}</span>
            </div>
          </div>
          <div style="color:var(--color-text-secondary);font-size:16px;flex-shrink:0">▼</div>
        </div>

        <!-- Expanded View (Hidden by Default) -->
        <div class="msg-expanded" style="display:none;padding:16px;border-top:0.5px solid var(--color-border-secondary);background:var(--color-background-secondary)">
          <!-- Description & Details -->
          <div style="margin-bottom:14px">
            <div style="font-size:10px;color:var(--color-text-secondary);line-height:1.5;background:var(--color-background-primary);padding:8px;border-radius:4px;margin-bottom:8px">
              ${msg.description || 'No description provided'}
            </div>
            <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;font-size:9px">
              <div>
                <div style="color:var(--color-text-secondary);margin-bottom:2px">Started</div>
                <div style="color:var(--color-text-primary);font-weight:500">${new Date(msg.startDate || Date.now()).toLocaleDateString()}</div>
              </div>
              <div>
                <div style="color:var(--color-text-secondary);margin-bottom:2px">Message ID</div>
                <div style="color:var(--color-text-primary);font-weight:500;font-family:monospace;font-size:8px">${msg.messageId || msg.id}</div>
              </div>
            </div>
          </div>

          <!-- Admin Actions -->
          <div style="background:var(--color-background-primary);padding:12px;border-radius:6px">
            <div style="font-size:11px;font-weight:600;margin-bottom:10px;color:var(--color-text-primary);text-transform:uppercase">Admin Actions</div>

            <!-- Review Status -->
            <div style="margin-bottom:10px">
              <label style="display:block;font-size:9px;font-weight:600;margin-bottom:4px;color:var(--color-text-secondary);text-transform:uppercase">Review Status</label>
              <select class="msg-review-status" style="width:100%;padding:6px;border:0.5px solid var(--color-border-secondary);border-radius:4px;font-size:10px;background:var(--color-background-secondary);color:var(--color-text-primary)">
                <option value="pending" ${!msg.reviewed ? 'selected' : ''}>Pending Review</option>
                <option value="reviewed" ${msg.reviewed ? 'selected' : ''}>Reviewed</option>
              </select>
            </div>

            <!-- Assign To -->
            <div style="margin-bottom:10px">
              <label style="display:block;font-size:9px;font-weight:600;margin-bottom:4px;color:var(--color-text-secondary);text-transform:uppercase">Assign To</label>
              <input type="text" class="msg-assign-to" placeholder="Email or name..." value="${msg.assigned || ''}" style="width:100%;padding:6px;border:0.5px solid var(--color-border-secondary);border-radius:4px;font-size:10px;background:var(--color-background-secondary);color:var(--color-text-primary)">
            </div>

            <!-- Set Deadline -->
            <div style="margin-bottom:10px">
              <label style="display:block;font-size:9px;font-weight:600;margin-bottom:4px;color:var(--color-text-secondary);text-transform:uppercase">Set Deadline</label>
              <input type="date" class="msg-deadline" value="${msg.deadline || ''}" style="width:100%;padding:6px;border:0.5px solid var(--color-border-secondary);border-radius:4px;font-size:10px;background:var(--color-background-secondary);color:var(--color-text-primary)">
            </div>

            <!-- Notes -->
            <div style="margin-bottom:10px">
              <label style="display:block;font-size:9px;font-weight:600;margin-bottom:4px;color:var(--color-text-secondary);text-transform:uppercase">Notes</label>
              <textarea class="msg-notes" placeholder="Add notes..." style="width:100%;padding:6px;border:0.5px solid var(--color-border-secondary);border-radius:4px;font-size:10px;background:var(--color-background-secondary);color:var(--color-text-primary);min-height:70px;resize:vertical">${msg.notes || ''}</textarea>
            </div>

            <!-- Save Button -->
            <button class="msg-save-btn" style="width:100%;padding:8px;background:var(--clr-primary-bg);color:white;border:none;border-radius:4px;cursor:pointer;font-weight:600;font-size:11px;margin-bottom:8px">💾 Save Changes</button>

            <!-- Status Info -->
            ${msg.status === 'resolved' ? `
              <div style="padding:8px;background:#4caf5020;border-radius:4px;border-left:3px solid #4caf50;font-size:9px;color:#4caf50">
                ✓ Resolved on ${new Date(msg.resolvedDate).toLocaleDateString()}
              </div>
            ` : ''}
          </div>
        </div>
      </div>
    `
  }).join('')

  container.innerHTML = html

  // Click handlers for expand/collapse
  container.querySelectorAll('.msg-card').forEach(card => {
    const collapsed = card.querySelector('.msg-collapsed')
    const expanded = card.querySelector('.msg-expanded')
    const idx = parseInt(card.dataset.msgIdx)

    collapsed.addEventListener('click', () => {
      const isExpanded = expanded.style.display === 'block'

      // Close all other expanded cards
      container.querySelectorAll('.msg-card').forEach(c => {
        c.querySelector('.msg-expanded').style.display = 'none'
      })

      // Toggle current card
      if (!isExpanded) {
        expanded.style.display = 'block'
        selectedMessage = filteredMessages[idx]
        attachSaveHandler(card, selectedMessage)
      }
    })
  })
}

function attachSaveHandler(card, msg) {
  const btn = card.querySelector('.msg-save-btn')
  const el = document.getElementById('page-messages')

  btn.addEventListener('click', async (e) => {
    e.stopPropagation()

    const reviewStatus = card.querySelector('.msg-review-status').value
    const assigned = card.querySelector('.msg-assign-to').value || null
    const deadline = card.querySelector('.msg-deadline').value || null
    const notes = card.querySelector('.msg-notes').value || ''

    btn.disabled = true
    btn.textContent = '💾 Saving...'

    try {
      const siteId = state.settings?.serviceHealthSiteId
      const listId = state.settings?.serviceHealthListId

      if (!siteId || !listId) {
        console.log('[Messages] No SharePoint configured - saving locally only')
        applyLocalChanges()
      } else {
        if (deadline && isNaN(Date.parse(deadline))) {
          showError('Invalid deadline date', 3000)
          return
        }

        const response = await fetch(
          `http://localhost:3001/api/servicehealth/messages/${msg.id}?siteId=${encodeURIComponent(siteId)}&listId=${encodeURIComponent(listId)}`,
          {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              title: msg.title,
              description: msg.description,
              impact: msg.impact,
              service: msg.service,
              severity: msg.severity,
              status: msg.status,
              assigned: assigned,
              reviewStatus: msg.reviewStatus,
              reviewedBy: msg.reviewed ? msg.reviewedBy : null,
              deadline: deadline,
              notes: notes,
              expectedLastModified: msg.lastModified
            })
          }
        )

        const result = await response.json()

        if (response.status === 409) {
          showError(`Conflict: Item was modified by another user. Please refresh to see latest changes.`, 5000)
          btn.textContent = '⚠️ Conflict - Refresh'
          btn.style.background = '#ff9800'
          return
        }

        if (response.status === 429) {
          showError(`Rate limited. Please try again in ${result.retryAfter || 60} seconds.`, 5000)
          btn.textContent = '⏱️ Rate Limited'
          return
        }

        if (result.success) {
          console.log('[Messages] Changes saved to SharePoint')
          msg.reviewed = reviewStatus === 'reviewed'
          msg.assigned = assigned
          msg.deadline = deadline
          msg.notes = notes
          msg.reviewedBy = msg.reviewed ? 'You' : null
          msg.reviewStatus = reviewStatus === 'reviewed' ? 'Reviewed' : 'Pending Review'
          msg.lastModified = result.timestamp
          applyLocalChanges('SharePoint')
        } else if (result.conflict) {
          showError(`Conflict: Item was modified by another user. Please refresh to see latest changes.`, 5000)
          btn.textContent = '⚠️ Conflict - Refresh'
          btn.style.background = '#ff9800'
          return
        } else {
          console.warn('[Messages] Save returned error:', result.error)
          msg.reviewed = reviewStatus === 'reviewed'
          msg.assigned = assigned
          msg.deadline = deadline
          msg.notes = notes
          msg.reviewedBy = msg.reviewed ? 'You' : null
          msg.reviewStatus = reviewStatus === 'reviewed' ? 'Reviewed' : 'Pending Review'
          applyLocalChanges('Local (offline)')
        }
      }
    } catch (error) {
      console.warn('[Messages] Save error:', error)
      msg.reviewed = reviewStatus === 'reviewed'
      msg.assigned = assigned
      msg.deadline = deadline
      msg.notes = notes
      msg.reviewedBy = msg.reviewed ? 'You' : null
      msg.reviewStatus = reviewStatus === 'reviewed' ? 'Reviewed' : 'Pending Review'
      applyLocalChanges('Local (error)')
    }

    function showError(message, duration = 4000) {
      btn.textContent = '❌ Error'
      btn.style.background = '#f44336'
      setTimeout(() => {
        btn.textContent = '💾 Save Changes'
        btn.style.background = 'var(--clr-primary-bg)'
        btn.disabled = false
      }, duration)
    }

    function applyLocalChanges(source) {
      btn.textContent = `✓ Saved to ${source}!`
      btn.style.background = '#4caf50'

      setTimeout(() => {
        btn.textContent = '💾 Save Changes'
        btn.style.background = 'var(--clr-primary-bg)'
        btn.disabled = false
      }, 2000)
    }
  })
}

