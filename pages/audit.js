import { customSkeleton } from '../lib/skeleton-custom.js'

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3000'

export function initAudit() {
  const el = document.getElementById('page-audit')
  if (!el) return

  // Show skeleton immediately with actual table headers
  el.innerHTML = customSkeleton.renderPageWithTable(
    '<i class="ti ti-database"></i> Audit Log',
    'Real Azure AD and security event audit trail',
    3,
    ['Time', 'Event', 'User', 'Category', 'Severity'],
    10
  )

  // Load real data with 300ms minimum skeleton display
  setTimeout(() => {
    loadAuditContent(el)
  }, 300)
}

async function loadAuditContent(el) {
  try {
    const response = await fetch(`${API_BASE}/api/azure-audit-logs?limit=50`)
    const result = await response.json()

    if (!response.ok || !result.success) {
      return renderAuditError(el, result)
    }

    const events = result.data || []
    const stats = result.stats || {}

    renderAuditContent(el, events, stats)
  } catch (error) {
    console.error('Failed to load audit logs:', error)
    return renderAuditError(el, {
      error: 'Failed to connect to backend',
      message: error.message
    })
  }
}

function renderAuditError(el, error) {
  el.innerHTML = `
    <div class="page-header">
      <div class="page-title"><i class="ti ti-database"></i> Audit Log</div>
      <div class="page-subtitle">Real Azure AD and security event audit trail</div>
    </div>

    <div style="margin-top:20px">
      <div class="card" style="background:var(--color-background-secondary);border-left:3px solid var(--color-warning);padding:16px">
        <div style="font-size:13px;font-weight:500;margin-bottom:8px"><i class="ti ti-alert-circle"></i> ${error.error || 'Unable to load audit logs'}</div>
        <div style="font-size:11px;color:var(--color-text-secondary);line-height:1.6">
          ${error.message || 'Azure AD audit logs are not available.'}
          <br><br>
          <strong>To enable:</strong>
          <ol style="margin:0;padding-left:16px">
            <li>Complete Setup Wizard Step 2 (SSO Configuration)</li>
            <li>Complete Setup Wizard Step 3 (Grant Admin Consent)</li>
            <li>Refresh this page</li>
          </ol>
        </div>
      </div>
    </div>
  `
}

function renderAuditContent(el, events, stats) {
  // Calculate severity counts
  const severityCount = {
    danger: stats.bySeverity?.danger || 0,
    warning: stats.bySeverity?.warning || 0,
    info: stats.bySeverity?.info || 0,
    low: stats.bySeverity?.low || 0
  }

  const highSeverity = severityCount.danger + severityCount.warning

  el.innerHTML = `
    <div class="page-header">
      <div class="page-title"><i class="ti ti-database"></i> Audit Log</div>
      <div class="page-subtitle">Real Azure AD and security event audit trail</div>
    </div>

    <div class="kpi-row">
      <div class="kpi-tile"><div class="kpi-value info">${events.length}</div><div class="kpi-label">Recent events</div></div>
      <div class="kpi-tile"><div class="kpi-value danger">${highSeverity}</div><div class="kpi-label">High/medium severity</div></div>
      <div class="kpi-tile">
        <div class="kpi-value" style="color:var(--color-success)">${stats.byCategory ? Object.keys(stats.byCategory).length : 0}</div>
        <div class="kpi-label">Event categories</div>
      </div>
    </div>

    <div class="filter-bar mb-3">
      <input type="text" class="form-input search" placeholder="Search events..." id="audit-search">
      <select class="form-select" id="audit-category-filter">
        <option value="">All categories</option>
        ${Object.keys(stats.byCategory || {}).sort().map(cat => `
          <option value="${cat}">${cat}</option>
        `).join('')}
      </select>
      <select class="form-select" id="audit-severity-filter">
        <option value="">All severity</option>
        <option value="danger">Critical</option>
        <option value="warning">Warning</option>
        <option value="info">Info</option>
        <option value="low">Low</option>
      </select>
      <button class="btn btn-primary" id="audit-export-btn"><i class="ti ti-download"></i> Export</button>
    </div>

    <div class="card" style="padding:0;overflow:hidden">
      <table>
        <thead><tr>
          <th style="width:15%">Time</th>
          <th style="width:35%">Event</th>
          <th style="width:20%">User</th>
          <th style="width:15%">Category</th>
          <th style="width:15%">Severity</th>
        </tr></thead>
        <tbody id="audit-table-body">
          ${events.length === 0 ? `
            <tr><td colspan="5" style="text-align:center;padding:20px;color:var(--color-text-secondary)">
              No audit events found. Azure AD auditing may not be enabled.
            </td></tr>
          ` : events.map(e => `
            <tr class="audit-row" data-category="${e.category}" data-severity="${e.severity}">
              <td class="monospace" style="font-size:10px" data-label="Time">${e.time}</td>
              <td style="font-size:11px" data-label="Event">${e.event}</td>
              <td class="monospace" style="font-size:10px" data-label="User">${e.user}</td>
              <td data-label="Category"><span class="badge neutral">${e.category}</span></td>
              <td data-label="Severity"><span class="badge ${e.sevCls}" style="text-transform:capitalize">${e.severity}</span></td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>

    <div style="font-size:10px;color:var(--color-text-secondary);margin-top:12px;padding:0 12px">
      <strong>Data source:</strong> Azure AD audit logs (directory audits, sign-in logs, provisioning events)
      | <strong>Refresh rate:</strong> Real-time queries to Graph API
    </div>
  `

  // Attach filter event listeners
  const searchInput = el.querySelector('#audit-search')
  const categoryFilter = el.querySelector('#audit-category-filter')
  const severityFilter = el.querySelector('#audit-severity-filter')
  const exportBtn = el.querySelector('#audit-export-btn')

  if (searchInput) {
    searchInput.addEventListener('input', () => filterAuditTable(el))
  }

  if (categoryFilter) {
    categoryFilter.addEventListener('change', () => filterAuditTable(el))
  }

  if (severityFilter) {
    severityFilter.addEventListener('change', () => filterAuditTable(el))
  }

  if (exportBtn) {
    exportBtn.addEventListener('click', () => exportAuditLogs(events))
  }
}

function filterAuditTable(el) {
  const searchInput = el.querySelector('#audit-search')?.value?.toLowerCase() || ''
  const categoryFilter = el.querySelector('#audit-category-filter')?.value || ''
  const severityFilter = el.querySelector('#audit-severity-filter')?.value || ''

  const rows = el.querySelectorAll('.audit-row')

  rows.forEach(row => {
    const event = row.textContent.toLowerCase()
    const category = row.dataset.category
    const severity = row.dataset.severity

    const matchesSearch = searchInput === '' || event.includes(searchInput)
    const matchesCategory = categoryFilter === '' || category === categoryFilter
    const matchesSeverity = severityFilter === '' || severity === severityFilter

    row.style.display = matchesSearch && matchesCategory && matchesSeverity ? '' : 'none'
  })
}

function exportAuditLogs(events) {
  if (!events || events.length === 0) {
    alert('No events to export')
    return
  }

  const headers = ['Time', 'Event', 'User', 'Category', 'Severity']
  const rows = events.map(e => [e.time, e.event, e.user, e.category, e.severity])

  // CSV format
  const csv = [headers, ...rows].map(row => row.map(cell => `"${cell}"`).join(',')).join('\n')

  // Download
  const blob = new Blob([csv], { type: 'text/csv' })
  const url = window.URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `audit-logs-${new Date().toISOString().split('T')[0]}.csv`
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  window.URL.revokeObjectURL(url)
}
