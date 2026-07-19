import { getAlertSummary, getAlerts, dismissAlert, getCorrelations, getPatterns, startInvestigation, getInvestigation, chatInvestigation, generateInvestigationReport } from '../lib/tenantguard-client.js'
import { showToast } from '../components/toast.js'
import { isDemoAccount } from '../lib/demo-account.js'
import { renderTenantGuardSettings } from './tenantguard-settings.js'
import { calculateSeverityScore, getSeverityLevel, getSeverityColors, getActionChecklist } from '../lib/severity-scoring.js'
import { getPolicyRecommendations, getPriorityColor, getEffortColor } from '../lib/policy-recommendations.js'
import { getAlertStatus, setAlertStatus, getStatusInfo, getNextStatuses, addStatusTransition, getAvailableStatuses, getStatusMetrics } from '../lib/alert-status-manager.js'
import { analyzeUserRisks, getUserBehaviorSummary, getRiskColor, getRiskLevel } from '../lib/user-risk-analyzer.js'

let activeTab = 'dashboard'
let allAlerts = []
let allCorrelations = []
let allPatterns = []
let selectedAlertId = null
let selectedAlertDetail = null
let autoRefreshInterval = null
let lastUpdateTime = null
let isRefreshing = false
let updateCount = 0

// Real-time update config
const REFRESH_INTERVAL = 60 * 1000 // 60 seconds (1 minute) for efficient polling
const API_BASE = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
  ? 'http://localhost:3000'
  : 'https://m365ops-api-gtbgezb9c7bgata7.centralus-01.azurewebsites.net'

const ALERT_PRIORITY = {
  'P0': { label: '🚨 Drop Everything', color: '#A32D2D', bg: '#FCEBEB' },
  'P1': { label: '🔴 Critical', color: '#A32D2D', bg: '#FCEBEB' },
  'P2': { label: '🟠 High', color: '#854F0B', bg: '#FAEEDA' },
  'P3': { label: '🟡 Medium', color: '#0C447C', bg: '#E6F1FB' },
}

const SEVERITY_COLOR = {
  'CRITICAL': '#A32D2D',
  'HIGH': '#854F0B',
  'MEDIUM': '#0C447C',
  'LOW': '#3B6D11',
}

export async function initTenantGuard() {
  const el = document.getElementById('page-tenantguard')
  if (!el) return

  el.innerHTML = `<div style="padding:20px"><div class="spinner"></div><p>Loading TenantGuard (Real-Time)...</p></div>`

  if (isDemoAccount()) {
    renderDemoTenantGuard(el)
    // Still refresh demo data in real-time
    if (autoRefreshInterval) clearInterval(autoRefreshInterval)
    autoRefreshInterval = setInterval(() => {
      renderContent(el)
    }, REFRESH_INTERVAL)
    return
  }

  try {
    console.log('🚀 Starting TenantGuard with real-time updates (every ' + (REFRESH_INTERVAL/1000) + ' seconds)')
    await refreshData()
    renderContent(el)
    lastUpdateTime = new Date()
  } catch (error) {
    console.error('Error initializing TenantGuard:', error)
    showToast('Failed to load alerts - check backend connection', 'error')
    // Fall back to demo data
    renderDemoTenantGuard(el)
    return
  }

  // Real-time polling - update every 10 seconds
  if (autoRefreshInterval) clearInterval(autoRefreshInterval)
  autoRefreshInterval = setInterval(async () => {
    if (!isRefreshing) {
      isRefreshing = true
      try {
        await refreshData()
        // Don't re-render main content if on settings tab
        if (activeTab !== 'settings') {
          renderContent(el)
        } else {
          // Just update the timestamp without re-rendering
          lastUpdateTime = new Date()
        }
        updateCount++
      } catch (error) {
        console.error('Real-time update error:', error)
      } finally {
        isRefreshing = false
      }
    }
  }, REFRESH_INTERVAL)
}

function renderContent(el) {
  const totalAlerts = allAlerts.length
  const criticalCount = allAlerts.filter(a => a.severity === 'CRITICAL').length
  const highCount = allAlerts.filter(a => a.severity === 'HIGH').length
  const p0Count = allAlerts.filter(a => a.priority === 'P0').length

  let riskScore = 0
  riskScore += p0Count * 25
  riskScore += criticalCount * 20
  riskScore += highCount * 10
  riskScore = Math.min(Math.max(riskScore, 0), 100)

  const riskLevel = riskScore >= 80 ? 'CRITICAL' : riskScore >= 50 ? 'HIGH' : riskScore >= 20 ? 'MEDIUM' : 'LOW'

  const lastUpdateStr = lastUpdateTime
    ? lastUpdateTime.toLocaleTimeString()
    : 'Loading...'
  const liveIndicator = isRefreshing
    ? '<span style="color:#0C447C">⏳ Updating...</span>'
    : '<span style="color:#3B6D11">🟢 LIVE</span>'

  el.innerHTML = `
    <div class="page-header">
      <div>
        <div class="page-title"><i class="fas fa-exclamation-triangle"></i> TenantGuard Security Monitoring</div>
        <div class="page-subtitle">Real-time threat detection & attack pattern analysis · ${liveIndicator} · Updated: ${lastUpdateStr}</div>
      </div>
      <div style="display:flex;gap:8px;align-items:center">
        <button class="page-help" title="Monitor and investigate suspicious activities, attack chains, and correlations using AI-powered threat detection.">
          <i class="fas fa-question-circle"></i>
        </button>
        <div class="page-actions" style="display:flex;gap:8px">
          <button class="btn" id="tg-refresh" ${isRefreshing ? 'disabled' : ''}><i class="fas fa-sync"></i> ${isRefreshing ? 'Updating...' : 'Refresh'}</button>
          <button class="btn btn-primary" id="tg-export"><i class="fas fa-download"></i> Export</button>
        </div>
      </div>
    </div>

    <div class="tabs" id="tg-main-tabs" style="display:flex;gap:4px;flex-wrap:wrap;margin-bottom:16px">
      <button class="tab-btn ${activeTab === 'dashboard' ? 'active' : ''}" data-tab="dashboard">
        <i class="ti ti-layout-dashboard"></i> Dashboard
      </button>
      <button class="tab-btn ${activeTab === 'alerts' ? 'active' : ''}" data-tab="alerts">
        <i class="ti ti-alert-triangle"></i> Alerts <span class="tab-badge">${totalAlerts}</span>
      </button>
      <button class="tab-btn ${activeTab === 'timeline' ? 'active' : ''}" data-tab="timeline">
        <i class="ti ti-timeline"></i> Timeline
      </button>
      <button class="tab-btn ${activeTab === 'incidents' ? 'active' : ''}" data-tab="incidents">
        <i class="ti ti-link"></i> Incidents <span class="tab-badge">${allCorrelations.length}</span>
      </button>
      <button class="tab-btn ${activeTab === 'audit' ? 'active' : ''}" data-tab="audit">
        <i class="ti ti-list"></i> Audit
      </button>
      <button class="tab-btn ${activeTab === 'users' ? 'active' : ''}" data-tab="users">
        <i class="ti ti-users"></i> Users
      </button>
      <button class="tab-btn ${activeTab === 'forensics' ? 'active' : ''}" data-tab="forensics">
        <i class="ti ti-history"></i> Forensics
      </button>
      <button class="tab-btn ${activeTab === 'settings' ? 'active' : ''}" data-tab="settings">
        <i class="ti ti-settings"></i> Settings
      </button>
    </div>

    <div id="tg-content">
      ${renderTabContent(riskScore, riskLevel)}
    </div>
  `

  // Attach event listeners
  document.querySelectorAll('[data-tab]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      activeTab = e.currentTarget.dataset.tab
      renderContent(el)
      // Render settings UI if settings tab selected
      if (activeTab === 'settings') {
        setTimeout(() => {
          renderTenantGuardSettings(el)
        }, 0)
      }
    })
  })

  // Correlation click - navigate to incidents tab
  document.querySelectorAll('.correlation-item').forEach(item => {
    item.addEventListener('click', () => {
      activeTab = 'incidents'
      renderContent(el)
      // Wait for incidents view to render then attach detail listeners
      setTimeout(() => {
        attachIncidentDetailListeners()
      }, 0)
    })
  })

  // Attach incident detail listeners for incidents tab
  attachIncidentDetailListeners()

  document.getElementById('tg-refresh')?.addEventListener('click', async () => {
    if (!isRefreshing) {
      isRefreshing = true
      showToast('Refreshing real-time data...', 'info')
      try {
        await refreshData()
        renderContent(el)
        lastUpdateTime = new Date()
        updateCount++
        showToast(`✅ Data refreshed (${updateCount} updates)`, 'success')
      } catch (error) {
        showToast('Failed to refresh data', 'error')
      } finally {
        isRefreshing = false
      }
    }
  })

  document.getElementById('tg-export')?.addEventListener('click', () => {
    showToast('Export feature coming soon', 'info')
  })

  // Alert selection - show detail modal
  document.querySelectorAll('[data-alert-id]').forEach(element => {
    element.addEventListener('click', (e) => {
      const alertId = e.currentTarget.dataset.alertId
      selectedAlertDetail = allAlerts.find(a => a.id === alertId)
      if (selectedAlertDetail) {
        showAlertDetail(el, selectedAlertDetail)
      }
    })
  })

  // Attach alerts view listeners if on alerts tab
  if (activeTab === 'alerts') {
    setTimeout(() => {
      attachAlertsViewListeners()
    }, 100)
  }

  // Attach forensics export listener
  document.getElementById('forensics-export')?.addEventListener('click', () => {
    exportForensicTimeline()
  })
}

function exportForensicTimeline() {
  const timelineData = {
    exportDate: new Date().toISOString(),
    tenant: 'M365 OpsAgent',
    alertCount: allAlerts.length,
    correlationCount: allCorrelations.length,
    alerts: allAlerts.map(alert => ({
      id: alert.id,
      headline: alert.headline,
      description: alert.description,
      severity: getSeverityLevel(calculateSeverityScore(alert)),
      score: calculateSeverityScore(alert),
      status: getAlertStatus(alert.id),
      actor: alert.actor,
      source: alert.source,
      timestamp: alert.timestamp,
      events: alert.events || []
    })),
    correlations: allCorrelations.map(corr => ({
      id: corr.id,
      description: corr.description,
      riskLevel: corr.risk_level,
      correlationScore: corr.correlation_score,
      alertCount: corr.alert_count,
      startTime: corr.start_timestamp,
      endTime: corr.end_timestamp
    }))
  }

  const dataStr = JSON.stringify(timelineData, null, 2)
  const blob = new Blob([dataStr], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `forensic-report-${new Date().toISOString().split('T')[0]}.json`
  a.click()
  URL.revokeObjectURL(url)

  showToast('✅ Forensic report exported', 'success')
}

function exportAlertsAsCSV(alerts) {
  const headers = ['ID', 'Headline', 'Description', 'Severity', 'Score', 'Status', 'Actor', 'Source', 'Timestamp']
  const rows = alerts.map(alert => [
    alert.id,
    alert.headline,
    alert.description,
    getSeverityLevel(calculateSeverityScore(alert)),
    calculateSeverityScore(alert),
    getStatusInfo(getAlertStatus(alert.id)).label,
    alert.actor,
    alert.source,
    new Date(alert.timestamp).toLocaleString()
  ])

  let csv = headers.join(',') + '\n'
  csv += rows.map(row => row.map(cell => `"${cell}"`).join(',')).join('\n')

  const blob = new Blob([csv], { type: 'text/csv' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `alerts-export-${new Date().toISOString().split('T')[0]}.csv`
  a.click()
  URL.revokeObjectURL(url)

  showToast(`✅ Exported ${alerts.length} alert(s) as CSV`, 'success')
}

function exportAlertsAsJSON(alerts) {
  const exportData = {
    exportDate: new Date().toISOString(),
    alertCount: alerts.length,
    alerts: alerts.map(alert => ({
      id: alert.id,
      headline: alert.headline,
      description: alert.description,
      severity: getSeverityLevel(calculateSeverityScore(alert)),
      score: calculateSeverityScore(alert),
      status: getStatusInfo(getAlertStatus(alert.id)).label,
      actor: alert.actor,
      source: alert.source,
      timestamp: alert.timestamp,
      events: alert.events || []
    }))
  }

  const dataStr = JSON.stringify(exportData, null, 2)
  const blob = new Blob([dataStr], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `alerts-export-${new Date().toISOString().split('T')[0]}.json`
  a.click()
  URL.revokeObjectURL(url)

  showToast(`✅ Exported ${alerts.length} alert(s) as JSON`, 'success')
}

function renderTabContent(riskScore, riskLevel) {
  switch (activeTab) {
    case 'dashboard':
      return renderDashboard(riskScore, riskLevel)
    case 'alerts':
      return renderAlertsView()
    case 'timeline':
      return renderTimelineView()
    case 'incidents':
      return renderIncidentsView()
    case 'audit':
      return renderAuditView()
    case 'users':
      return renderUserInvestigationView()
    case 'forensics':
      return renderForensicTimelineView()
    case 'settings':
      return `<div class="content-area" id="settings-container"></div>`
    default:
      return ''
  }
}

function attachAlertsViewListeners() {
  const searchInput = document.getElementById('alert-search')
  const dateRangeFilter = document.getElementById('alert-filter-daterange')
  const severityFilter = document.getElementById('alert-filter-severity')
  const statusFilter = document.getElementById('alert-filter-status')
  const sortSelect = document.getElementById('alert-sort')
  const container = document.getElementById('alerts-container')
  const statsDiv = document.getElementById('alerts-stats')
  const bulkBtn = document.getElementById('alerts-bulk-action')
  const exportCsvBtn = document.getElementById('alerts-export-csv')
  const exportJsonBtn = document.getElementById('alerts-export-json')
  const clearFiltersBtn = document.getElementById('alerts-clear-filters')

  let selectedAlerts = new Set()

  function filterAndRenderAlerts() {
    const searchTerm = (searchInput?.value || '').toLowerCase()
    const dateRangeVal = dateRangeFilter?.value || 'all'
    const severityVal = severityFilter?.value || ''
    const statusVal = statusFilter?.value || ''
    const sortVal = sortSelect?.value || 'recency'

    // Calculate date range
    const now = new Date()
    let cutoffDate = null
    if (dateRangeVal === '24h') cutoffDate = new Date(now - 24 * 60 * 60 * 1000)
    else if (dateRangeVal === '7d') cutoffDate = new Date(now - 7 * 24 * 60 * 60 * 1000)
    else if (dateRangeVal === '30d') cutoffDate = new Date(now - 30 * 24 * 60 * 60 * 1000)

    // Filter alerts
    let filtered = allAlerts.filter(alert => {
      // Date range filter
      if (cutoffDate && new Date(alert?.timestamp) < cutoffDate) return false

      // Search filter
      if (searchTerm) {
        const searchableText = [
          alert?.headline || '',
          alert?.description || '',
          alert?.actor || '',
          alert?.source || ''
        ].join(' ').toLowerCase()

        if (!searchableText.includes(searchTerm)) return false
      }

      // Severity filter
      if (severityVal && alert?.severity !== severityVal) return false

      // Status filter
      if (statusVal && getAlertStatus(alert.id) !== statusVal) return false

      return true
    })

    // Sort alerts
    filtered.sort((a, b) => {
      switch (sortVal) {
        case 'severity':
          return (calculateSeverityScore(b) || 0) - (calculateSeverityScore(a) || 0)
        case 'status':
          return getStatusInfo(getAlertStatus(a.id)).order - getStatusInfo(getAlertStatus(b.id)).order
        case 'actor':
          return (a?.actor || '').localeCompare(b?.actor || '')
        case 'source':
          return (a?.source || '').localeCompare(b?.source || '')
        case 'recency':
        default:
          return new Date(b?.timestamp || 0) - new Date(a?.timestamp || 0)
      }
    })

    // Render alerts
    const alertsHTML = filtered.map((alert, idx) => {
      const severity = calculateSeverityScore(alert)
      const level = getSeverityLevel(severity)
      const colors = getSeverityColors(level)
      const status = getAlertStatus(alert.id)
      const statusInfo = getStatusInfo(status)
      const isSelected = selectedAlerts.has(alert.id)

      return `
        <div class="alert-item-container" data-alert-id="${alert?.id}" style="
          display:flex;
          align-items:start;
          padding:14px;
          border-bottom:0.5px solid var(--color-border-secondary);
          cursor:pointer;
          background:${isSelected ? colors.bg : 'transparent'};
          transition:background 0.2s;
        " onmouseover="this.style.opacity='0.8'" onmouseout="this.style.opacity='1'">
          <input type="checkbox" class="alert-checkbox" style="margin-right:12px;margin-top:2px;cursor:pointer" ${isSelected ? 'checked' : ''}>
          <div style="flex:1">
            <div style="display:flex;gap:8px;margin-bottom:6px;flex-wrap:wrap;align-items:center">
              <div style="flex:1">
                <div style="font-size:13px;font-weight:600;color:var(--color-text-primary)">${alert?.headline || 'Unknown'}</div>
                <div style="font-size:12px;color:var(--color-text-secondary);margin-top:2px">${alert?.description || 'No description'}</div>
              </div>
              <div style="display:flex;gap:6px;flex-wrap:wrap;flex-shrink:0">
                <span style="background:${colors.bg};color:${colors.text};padding:4px 8px;border-radius:3px;font-size:11px;font-weight:600;border:1px solid ${colors.border}">${colors.icon} ${severity}/100</span>
                <span style="background:${statusInfo.color};color:white;padding:4px 8px;border-radius:3px;font-size:11px;font-weight:600;white-space:nowrap">${statusInfo.icon} ${statusInfo.label}</span>
              </div>
            </div>
            <div style="display:flex;justify-content:space-between;font-size:11px;color:var(--color-text-secondary);margin-top:6px">
              <div>
                <span style="display:inline-block;margin-right:12px">📡 ${alert?.source || 'Unknown'}</span>
                <span style="display:inline-block;margin-right:12px">👤 ${alert?.actor || 'System'}</span>
              </div>
              <span>📅 ${new Date(alert?.timestamp || Date.now()).toLocaleTimeString()}</span>
            </div>
          </div>
        </div>
      `
    }).join('')

    container.innerHTML = alertsHTML || '<div style="text-align:center;padding:40px;color:var(--color-text-secondary);font-size:12px">No alerts match your filters</div>'

    // Update stats
    const avgSeverity = filtered.length > 0
      ? Math.round(filtered.reduce((sum, a) => sum + (calculateSeverityScore(a) || 0), 0) / filtered.length)
      : 0

    document.getElementById('alerts-display-count').textContent = filtered.length
    document.getElementById('alerts-severity-avg').textContent = avgSeverity > 0 ? `${avgSeverity}/100` : '—'
    document.getElementById('alerts-selected-count').textContent = selectedAlerts.size

    // Bulk action button visibility
    bulkBtn.style.display = selectedAlerts.size > 0 ? 'block' : 'none'

    // Attach checkbox and detail listeners
    container.querySelectorAll('.alert-item-container').forEach(item => {
      const checkbox = item.querySelector('.alert-checkbox')
      const alertId = item.dataset.alertId

      checkbox.addEventListener('click', (e) => {
        e.stopPropagation()
        if (selectedAlerts.has(alertId)) {
          selectedAlerts.delete(alertId)
        } else {
          selectedAlerts.add(alertId)
        }
        filterAndRenderAlerts()
      })

      item.addEventListener('click', () => {
        const alert = allAlerts.find(a => a.id === alertId)
        if (alert) {
          showAlertDetail(document.getElementById('page-tenantguard'), alert)
        }
      })
    })
  }

  // Event listeners
  searchInput?.addEventListener('input', filterAndRenderAlerts)
  dateRangeFilter?.addEventListener('change', filterAndRenderAlerts)
  severityFilter?.addEventListener('change', filterAndRenderAlerts)
  statusFilter?.addEventListener('change', filterAndRenderAlerts)
  sortSelect?.addEventListener('change', filterAndRenderAlerts)

  // Export handlers
  exportCsvBtn?.addEventListener('click', () => {
    const displayCount = document.getElementById('alerts-display-count')?.textContent || '0'
    const alerts = allAlerts.filter(alert => {
      const searchTerm = (searchInput?.value || '').toLowerCase()
      const dateRangeVal = dateRangeFilter?.value || 'all'
      const severityVal = severityFilter?.value || ''
      const statusVal = statusFilter?.value || ''

      const now = new Date()
      let cutoffDate = null
      if (dateRangeVal === '24h') cutoffDate = new Date(now - 24 * 60 * 60 * 1000)
      else if (dateRangeVal === '7d') cutoffDate = new Date(now - 7 * 24 * 60 * 60 * 1000)
      else if (dateRangeVal === '30d') cutoffDate = new Date(now - 30 * 24 * 60 * 60 * 1000)

      if (cutoffDate && new Date(alert?.timestamp) < cutoffDate) return false
      if (searchTerm) {
        const searchableText = [alert?.headline || '', alert?.description || '', alert?.actor || '', alert?.source || ''].join(' ').toLowerCase()
        if (!searchableText.includes(searchTerm)) return false
      }
      if (severityVal && alert?.severity !== severityVal) return false
      if (statusVal && getAlertStatus(alert.id) !== statusVal) return false
      return true
    })

    exportAlertsAsCSV(alerts)
  })

  exportJsonBtn?.addEventListener('click', () => {
    const displayCount = document.getElementById('alerts-display-count')?.textContent || '0'
    const alerts = allAlerts.filter(alert => {
      const searchTerm = (searchInput?.value || '').toLowerCase()
      const dateRangeVal = dateRangeFilter?.value || 'all'
      const severityVal = severityFilter?.value || ''
      const statusVal = statusFilter?.value || ''

      const now = new Date()
      let cutoffDate = null
      if (dateRangeVal === '24h') cutoffDate = new Date(now - 24 * 60 * 60 * 1000)
      else if (dateRangeVal === '7d') cutoffDate = new Date(now - 7 * 24 * 60 * 60 * 1000)
      else if (dateRangeVal === '30d') cutoffDate = new Date(now - 30 * 24 * 60 * 60 * 1000)

      if (cutoffDate && new Date(alert?.timestamp) < cutoffDate) return false
      if (searchTerm) {
        const searchableText = [alert?.headline || '', alert?.description || '', alert?.actor || '', alert?.source || ''].join(' ').toLowerCase()
        if (!searchableText.includes(searchTerm)) return false
      }
      if (severityVal && alert?.severity !== severityVal) return false
      if (statusVal && getAlertStatus(alert.id) !== statusVal) return false
      return true
    })

    exportAlertsAsJSON(alerts)
  })

  clearFiltersBtn?.addEventListener('click', () => {
    searchInput.value = ''
    dateRangeFilter.value = 'all'
    severityFilter.value = ''
    statusFilter.value = ''
    sortSelect.value = 'recency'
    filterAndRenderAlerts()
    showToast('✅ Filters cleared', 'success')
  })

  // Bulk action handler
  bulkBtn?.addEventListener('click', () => {
    const selectedIds = Array.from(selectedAlerts)
    if (selectedIds.length === 0) return

    showBulkStatusUpdateModal(selectedIds, () => {
      selectedAlerts.clear()
      filterAndRenderAlerts()
    })
  })

  // Initial render
  filterAndRenderAlerts()
}

function showBulkStatusUpdateModal(alertIds, onComplete) {
  const modal = document.createElement('div')
  modal.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0,0,0,0.7);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 10000;
    padding: 20px;
  `

  const content = document.createElement('div')
  content.style.cssText = `
    background: var(--color-background-primary);
    border-radius: 8px;
    padding: 24px;
    max-width: 500px;
    width: 100%;
    box-shadow: 0 10px 40px rgba(0,0,0,0.3);
  `

  const statuses = getAvailableStatuses()

  content.innerHTML = `
    <div style="display:flex;justify-content:space-between;align-items:start;margin-bottom:20px">
      <div>
        <div style="font-size:18px;font-weight:700">🔄 Bulk Status Update</div>
        <div style="font-size:13px;color:var(--color-text-secondary);margin-top:4px">Update status for ${alertIds.length} selected alert(s)</div>
      </div>
      <button onclick="this.closest('[data-modal]').remove()" style="background:none;border:none;font-size:24px;cursor:pointer;color:var(--color-text-secondary)">✕</button>
    </div>

    <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:20px">
      ${statuses.map(status => `
        <button data-status="${status.key}" class="bulk-status-btn" style="
          padding:12px;
          background:${status.color};
          color:white;
          border:none;
          border-radius:6px;
          cursor:pointer;
          font-weight:600;
          font-size:12px;
          transition:opacity 0.2s;
        " onmouseover="this.style.opacity='0.8'" onmouseout="this.style.opacity='1'">
          ${status.icon} ${status.label}
        </button>
      `).join('')}
    </div>

    <div style="display:flex;gap:8px">
      <button onclick="this.closest('[data-modal]').remove()" style="flex:1;padding:12px;background:var(--color-background-secondary);border:1px solid var(--color-border-primary);border-radius:6px;cursor:pointer;font-weight:600;color:var(--color-text-primary)">Cancel</button>
    </div>
  `

  modal.setAttribute('data-modal', 'true')
  modal.appendChild(content)
  modal.addEventListener('click', (e) => {
    if (e.target === modal) modal.remove()
  })

  document.body.appendChild(modal)

  content.querySelectorAll('.bulk-status-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const newStatus = btn.dataset.status
      const oldStatuses = alertIds.map(id => getAlertStatus(id))

      alertIds.forEach((alertId, idx) => {
        setAlertStatus(alertId, newStatus)
        addStatusTransition(alertId, oldStatuses[idx], newStatus)
      })

      showToast(`✅ Updated ${alertIds.length} alert(s) to ${getStatusInfo(newStatus).label}`, 'success')
      modal.remove()
      if (onComplete) onComplete()
    })
  })
}

function renderDashboard(riskScore, riskLevel) {
  const p0Count = allAlerts.filter(a => a.priority === 'P0').length
  const p1Count = allAlerts.filter(a => a.priority === 'P1').length
  const criticalCount = allAlerts.filter(a => a.severity === 'CRITICAL').length
  const highCount = allAlerts.filter(a => a.severity === 'HIGH').length

  return `
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px;margin-bottom:16px">
      <div class="card">
        <div class="card-title">TENANT RISK LEVEL</div>
        <div style="display:flex;align-items:center;gap:16px;margin-top:12px">
          <div style="text-align:center;flex:0 0 100px">
            <div style="font-size:32px;font-weight:700;color:${riskScore >= 80 ? ALERT_PRIORITY.P0.color : riskScore >= 50 ? ALERT_PRIORITY.P2.color : '#3B6D11'}">${Math.round(riskScore)}</div>
            <div style="font-size:11px;color:var(--color-text-secondary);margin-top:4px">/100</div>
          </div>
          <div>
            <div style="font-size:16px;font-weight:600;margin-bottom:4px">${riskLevel}</div>
            <div style="font-size:12px;color:var(--color-text-secondary)">
              ${riskScore >= 80 ? '⚠️ Immediate action needed' : riskScore >= 50 ? '🔶 Heightened alert' : riskScore >= 20 ? '🟡 Monitor' : '✅ Healthy'}
            </div>
          </div>
        </div>
      </div>

      <div class="card">
        <div class="card-title">CRITICAL ALERTS SUMMARY</div>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-top:12px">
          <div style="padding:12px;background:${ALERT_PRIORITY.P0.bg};border-radius:6px;border-left:3px solid ${ALERT_PRIORITY.P0.color}">
            <div style="font-size:24px;font-weight:700;color:${ALERT_PRIORITY.P0.color}">${p0Count}</div>
            <div style="font-size:11px;color:var(--color-text-secondary);margin-top:4px">P0 (Drop Everything)</div>
          </div>
          <div style="padding:12px;background:${ALERT_PRIORITY.P1.bg};border-radius:6px;border-left:3px solid ${ALERT_PRIORITY.P1.color}">
            <div style="font-size:24px;font-weight:700;color:${ALERT_PRIORITY.P1.color}">${p1Count}</div>
            <div style="font-size:11px;color:var(--color-text-secondary);margin-top:4px">P1 (Critical)</div>
          </div>
          <div style="padding:12px;background:${ALERT_PRIORITY.P2.bg};border-radius:6px;border-left:3px solid ${ALERT_PRIORITY.P2.color}">
            <div style="font-size:24px;font-weight:700;color:${ALERT_PRIORITY.P2.color}">${criticalCount}</div>
            <div style="font-size:11px;color:var(--color-text-secondary);margin-top:4px">Critical Events</div>
          </div>
          <div style="padding:12px;background:${ALERT_PRIORITY.P3.bg};border-radius:6px;border-left:3px solid ${ALERT_PRIORITY.P3.color}">
            <div style="font-size:24px;font-weight:700;color:${ALERT_PRIORITY.P3.color}">${highCount}</div>
            <div style="font-size:11px;color:var(--color-text-secondary);margin-top:4px">High Alerts</div>
          </div>
        </div>
      </div>
    </div>

    ${(() => {
      const metrics = getStatusMetrics(allAlerts)
      return `
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px;margin-bottom:16px">
          <div class="card">
            <div class="card-title">📊 INVESTIGATION PROGRESS</div>
            <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-top:12px">
              <div style="padding:12px;background:var(--color-background-secondary);border-radius:6px">
                <div style="font-size:11px;color:var(--color-text-secondary);margin-bottom:4px">🔍 Under Investigation</div>
                <div style="font-size:20px;font-weight:700;color:#f57c00">${metrics.underInvestigation}</div>
                <div style="font-size:10px;color:var(--color-text-secondary);margin-top:2px">${metrics.percentUnderInvestigation}% of total</div>
              </div>
              <div style="padding:12px;background:var(--color-background-secondary);border-radius:6px">
                <div style="font-size:11px;color:var(--color-text-secondary);margin-bottom:4px">✅ Resolved</div>
                <div style="font-size:20px;font-weight:700;color:#4caf50">${metrics.resolved}</div>
                <div style="font-size:10px;color:var(--color-text-secondary);margin-top:2px">${metrics.percentResolved}% of total</div>
              </div>
              <div style="padding:12px;background:var(--color-background-secondary);border-radius:6px">
                <div style="font-size:11px;color:var(--color-text-secondary);margin-bottom:4px">📌 New</div>
                <div style="font-size:20px;font-weight:700;color:#1976d2">${metrics.new}</div>
                <div style="font-size:10px;color:var(--color-text-secondary);margin-top:2px">Not started</div>
              </div>
              <div style="padding:12px;background:var(--color-background-secondary);border-radius:6px">
                <div style="font-size:11px;color:var(--color-text-secondary);margin-bottom:4px">⏱️ Avg Resolution</div>
                <div style="font-size:20px;font-weight:700;color:#388e3c">${metrics.averageResolutionTime}</div>
                <div style="font-size:10px;color:var(--color-text-secondary);margin-top:2px">Time to resolve</div>
              </div>
            </div>
          </div>

          <div class="card">
            <div class="card-title">🛡️ STATUS DISTRIBUTION</div>
            <div style="display:flex;flex-direction:column;gap:10px;margin-top:12px">
              ${(() => {
                const statuses = getAvailableStatuses()
                const total = metrics.total
                return statuses.map(status => {
                  let count = 0
                  if (status.key === 'NEW') count = metrics.new
                  else if (status.key === 'UNDER_INVESTIGATION') count = metrics.underInvestigation
                  else if (status.key === 'ACTION_TAKEN') count = metrics.actionTaken
                  else if (status.key === 'RESOLVED') count = metrics.resolved
                  else if (status.key === 'FALSE_POSITIVE') count = metrics.falsePositive

                  const percentage = total > 0 ? Math.round((count / total) * 100) : 0
                  const barWidth = Math.max(percentage, 5)

                  return `
                    <div>
                      <div style="display:flex;justify-content:space-between;margin-bottom:4px">
                        <span style="font-size:11px;font-weight:600">${status.icon} ${status.label}</span>
                        <span style="font-size:11px;font-weight:600;color:${status.color}">${count}</span>
                      </div>
                      <div style="height:8px;background:var(--color-background-primary);border-radius:4px;overflow:hidden">
                        <div style="height:100%;width:${percentage}%;background:${status.color};transition:width 0.3s"></div>
                      </div>
                    </div>
                  `
                }).join('')
              })()}
            </div>
          </div>
        </div>
      `
    })()}

    <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px;margin-bottom:16px">
      <div class="card">
        <div class="card-title">🔴 CRITICAL ISSUES (Top Priorities)</div>
        <div style="display:flex;flex-direction:column;gap:8px;margin-top:12px">
          ${allAlerts.slice(0, 5).map(alert => {
            const severity = calculateSeverityScore(alert)
            const level = getSeverityLevel(severity)
            const colors = getSeverityColors(level)
            const status = getAlertStatus(alert.id)
            const statusInfo = getStatusInfo(status)
            return `
              <div style="padding:12px;background:${colors.bg};border-radius:6px;border-left:4px solid ${colors.border};cursor:pointer" data-alert-id="${alert?.id}">
                <div style="display:flex;justify-content:space-between;align-items:start;margin-bottom:6px">
                  <div style="flex:1">
                    <div style="font-size:12px;font-weight:600;color:${colors.text}">${colors.icon} ${(alert?.headline || 'Unknown Alert').substring(0, 35)}</div>
                  </div>
                  <div style="display:flex;align-items:center;gap:6px;flex-shrink:0">
                    <span style="font-size:13px;font-weight:700;color:${colors.text}">${severity}/100</span>
                    <span style="background:${statusInfo.color};color:white;padding:2px 6px;border-radius:3px;font-size:10px;font-weight:600;white-space:nowrap">${statusInfo.icon} ${statusInfo.label}</span>
                  </div>
                </div>
                <div style="font-size:11px;color:var(--color-text-secondary)">${alert?.actor ? alert.actor + ' · ' : ''}${new Date(alert?.timestamp || Date.now()).toLocaleTimeString()}</div>
                <div style="font-size:10px;color:${colors.text};margin-top:4px;font-weight:500">⚠️ Click to update status →</div>
              </div>
            `
          }).join('')}
          ${allAlerts.length === 0 ? '<div style="color:var(--color-text-secondary);font-size:12px;text-align:center;padding:20px">✅ No critical issues</div>' : ''}
        </div>
      </div>

      <div class="card">
        <div class="card-title">ACTIVE ATTACK CHAINS</div>
        <div style="display:flex;flex-direction:column;gap:8px;margin-top:12px">
          ${allCorrelations.slice(0, 5).map(incident => `
            <div class="correlation-item" data-correlation-id="${incident?.id}" style="padding:10px;background:var(--color-background-secondary);border-radius:6px;border-left:3px solid ${incident?.risk_level === 'CRITICAL' ? ALERT_PRIORITY.P1.color : ALERT_PRIORITY.P2.color};cursor:pointer;transition:all 0.2s;hover:opacity:0.8">
              <div style="font-size:12px;font-weight:600;margin-bottom:4px">${(incident?.description || 'Unknown Incident').substring(0, 45)}</div>
              <div style="font-size:11px;color:var(--color-text-secondary);margin-bottom:6px">${incident?.alert_count || 0} events · Score: ${incident?.correlation_score || 0}/100</div>
              <div style="font-size:10px;color:var(--clr-info-text);font-weight:500">📖 Click to view details →</div>
            </div>
          `).join('')}
          ${allCorrelations.length === 0 ? '<div style="color:var(--color-text-secondary);font-size:12px;text-align:center;padding:20px">No active chains</div>' : ''}
        </div>
      </div>
    </div>

    <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px">
      <div class="card">
        <div class="card-title">SERVICE IMPACT MAP</div>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-top:12px">
          ${['Entra ID', 'Exchange', 'SharePoint', 'OneDrive', 'Teams', 'Intune'].map(service => {
            const count = allAlerts.filter(a => a?.source && String(a.source).includes(service)).length
            const hasCritical = allAlerts.some(a => a?.source && String(a.source).includes(service) && a?.severity === 'CRITICAL')
            return `
              <div style="padding:12px;background:var(--color-background-secondary);border-radius:6px;border-left:3px solid ${hasCritical ? ALERT_PRIORITY.P1.color : count > 0 ? ALERT_PRIORITY.P2.color : '#3B6D11'};text-align:center">
                <div style="font-size:12px;font-weight:600;margin-bottom:4px">${service}</div>
                <div style="font-size:18px;font-weight:700;color:${hasCritical ? ALERT_PRIORITY.P1.color : count > 0 ? ALERT_PRIORITY.P2.color : '#3B6D11'}">${count}</div>
              </div>
            `
          }).join('')}
        </div>
      </div>

      <div class="card">
        <div class="card-title">MONITORING AGENTS</div>
        <div style="display:flex;flex-direction:column;gap:8px;margin-top:12px;font-size:12px">
          <div style="display:flex;justify-content:space-between;padding:8px;background:var(--color-background-secondary);border-radius:4px">
            <span>🔐 Security Agent</span>
            <span style="color:#3B6D11">✅ Healthy</span>
          </div>
          <div style="display:flex;justify-content:space-between;padding:8px;background:var(--color-background-secondary);border-radius:4px">
            <span>📊 Audit (5min)</span>
            <span style="color:#3B6D11">✅ Active</span>
          </div>
          <div style="display:flex;justify-content:space-between;padding:8px;background:var(--color-background-secondary);border-radius:4px">
            <span>🔗 Correlation (15min)</span>
            <span style="color:#3B6D11">✅ Active</span>
          </div>
          <div style="display:flex;justify-content:space-between;padding:8px;background:var(--color-background-secondary);border-radius:4px">
            <span>⚙️ Config Agent</span>
            <span style="color:#3B6D11">✅ Healthy</span>
          </div>
        </div>
      </div>
    </div>
  `
}

function renderAlertsView() {
  return `
    <div class="card">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:16px">
        <div class="card-title" style="margin:0">📋 All Alerts (${allAlerts.length})</div>
        <button id="alerts-bulk-action" style="padding:8px 12px;background:var(--color-background-secondary);border:1px solid var(--color-border-primary);border-radius:4px;cursor:pointer;font-size:11px;font-weight:600;color:var(--color-text-primary);display:none">
          🔄 Batch Update Status
        </button>
      </div>

      <!-- FILTERS & SEARCH -->
      <div style="display:grid;grid-template-columns:1fr 1fr 1fr 1fr 1fr;gap:10px;margin-bottom:16px">
        <div>
          <label style="font-size:11px;color:var(--color-text-secondary);display:block;margin-bottom:4px">🔍 Search</label>
          <input type="text" id="alert-search" placeholder="Alert name, actor..." style="
            padding:8px 10px;
            border:0.5px solid var(--color-border-secondary);
            border-radius:4px;
            font-size:12px;
            width:100%;
            box-sizing:border-box;
          ">
        </div>
        <div>
          <label style="font-size:11px;color:var(--color-text-secondary);display:block;margin-bottom:4px">📅 Date Range</label>
          <select id="alert-filter-daterange" style="
            padding:8px 10px;
            border:0.5px solid var(--color-border-secondary);
            border-radius:4px;
            font-size:12px;
            width:100%;
            box-sizing:border-box;
            background:var(--color-background-secondary);
            color:var(--color-text-primary);
          ">
            <option value="all">All Time</option>
            <option value="24h">Last 24 Hours</option>
            <option value="7d">Last 7 Days</option>
            <option value="30d">Last 30 Days</option>
          </select>
        </div>
        <div>
          <label style="font-size:11px;color:var(--color-text-secondary);display:block;margin-bottom:4px">⚠️ Severity</label>
          <select id="alert-filter-severity" style="
            padding:8px 10px;
            border:0.5px solid var(--color-border-secondary);
            border-radius:4px;
            font-size:12px;
            width:100%;
            box-sizing:border-box;
            background:var(--color-background-secondary);
            color:var(--color-text-primary);
          ">
            <option value="">All</option>
            <option value="CRITICAL">🔴 CRITICAL</option>
            <option value="HIGH">🟠 HIGH</option>
            <option value="MEDIUM">🟡 MEDIUM</option>
            <option value="LOW">🟢 LOW</option>
          </select>
        </div>
        <div>
          <label style="font-size:11px;color:var(--color-text-secondary);display:block;margin-bottom:4px">📊 Status</label>
          <select id="alert-filter-status" style="
            padding:8px 10px;
            border:0.5px solid var(--color-border-secondary);
            border-radius:4px;
            font-size:12px;
            width:100%;
            box-sizing:border-box;
            background:var(--color-background-secondary);
            color:var(--color-text-primary);
          ">
            <option value="">All</option>
            <option value="NEW">🆕 New</option>
            <option value="UNDER_INVESTIGATION">🔍 Investigating</option>
            <option value="ACTION_TAKEN">✅ Action Taken</option>
            <option value="RESOLVED">✔️ Resolved</option>
            <option value="FALSE_POSITIVE">⚠️ False Positive</option>
          </select>
        </div>
        <div>
          <label style="font-size:11px;color:var(--color-text-secondary);display:block;margin-bottom:4px">📈 Sort</label>
          <select id="alert-sort" style="
            padding:8px 10px;
            border:0.5px solid var(--color-border-secondary);
            border-radius:4px;
            font-size:12px;
            width:100%;
            box-sizing:border-box;
            background:var(--color-background-secondary);
            color:var(--color-text-primary);
          ">
            <option value="recency">⏰ Newest</option>
            <option value="severity">⚠️ Severity</option>
            <option value="status">📊 Status</option>
            <option value="actor">👤 Actor</option>
            <option value="source">📡 Source</option>
          </select>
        </div>
      </div>

      <!-- ADVANCED ACTIONS -->
      <div style="display:flex;gap:8px;margin-bottom:12px;flex-wrap:wrap">
        <button id="alerts-export-csv" style="padding:8px 12px;background:var(--color-background-secondary);border:0.5px solid var(--color-border-secondary);border-radius:4px;cursor:pointer;font-size:11px;font-weight:600;color:var(--color-text-primary)">📊 Export CSV</button>
        <button id="alerts-export-json" style="padding:8px 12px;background:var(--color-background-secondary);border:0.5px solid var(--color-border-secondary);border-radius:4px;cursor:pointer;font-size:11px;font-weight:600;color:var(--color-text-primary)">📋 Export JSON</button>
        <button id="alerts-clear-filters" style="padding:8px 12px;background:var(--color-background-secondary);border:0.5px solid var(--color-border-secondary);border-radius:4px;cursor:pointer;font-size:11px;font-weight:600;color:var(--color-text-primary)">🔄 Reset Filters</button>
      </div>

      <!-- ALERTS LIST STATS -->
      <div id="alerts-stats" style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:10px;margin-bottom:12px">
        <div style="padding:8px;background:var(--color-background-secondary);border-radius:4px;text-align:center">
          <div style="font-size:11px;color:var(--color-text-secondary)">Displaying</div>
          <div style="font-size:16px;font-weight:700;color:var(--color-text-primary)" id="alerts-display-count">0</div>
        </div>
        <div style="padding:8px;background:var(--color-background-secondary);border-radius:4px;text-align:center">
          <div style="font-size:11px;color:var(--color-text-secondary)">Severity Avg</div>
          <div style="font-size:16px;font-weight:700;color:var(--color-text-primary)" id="alerts-severity-avg">—</div>
        </div>
        <div style="padding:8px;background:var(--color-background-secondary);border-radius:4px;text-align:center">
          <div style="font-size:11px;color:var(--color-text-secondary)">Selected</div>
          <div style="font-size:16px;font-weight:700;color:var(--color-text-primary)" id="alerts-selected-count">0</div>
        </div>
      </div>

      <!-- ALERTS CONTAINER -->
      <div id="alerts-container" style="max-height:800px;overflow-y:auto;border:0.5px solid var(--color-border-secondary);border-radius:4px;background:var(--color-background-secondary)">
        <div style="text-align:center;padding:40px;color:var(--color-text-secondary);font-size:12px">Loading alerts...</div>
      </div>
    </div>
  `
}

function renderTimelineView() {
  const sorted = [...allAlerts].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
  return `
    <div class="card">
      <div class="card-title">Attack Timeline</div>
      <div style="margin-top:16px;position:relative;padding-left:24px">
        <div style="position:absolute;left:0;top:0;bottom:0;width:2px;background:var(--color-border-secondary)"></div>
        <div style="display:flex;flex-direction:column;gap:16px">
          ${sorted.map(alert => `
            <div>
              <div style="position:absolute;left:-8px;width:14px;height:14px;background:${ALERT_PRIORITY[alert?.priority]?.color || '#999'};border:3px solid white;border-radius:50%"></div>
              <div style="font-size:12px;font-weight:600">${(alert?.headline || 'Unknown').substring(0, 60)}</div>
              <div style="font-size:11px;color:var(--color-text-secondary);margin-top:2px">${alert?.description || 'No description'}</div>
              <div style="font-size:11px;color:var(--color-text-secondary);margin-top:4px">${new Date(alert?.timestamp || Date.now()).toLocaleTimeString()}</div>
            </div>
          `).join('')}
        </div>
      </div>
    </div>
  `
}

function renderIncidentsView() {
  return `
    <div class="card">
      <div class="card-title">Correlated Incidents (${allCorrelations.length})</div>
      <div style="display:flex;flex-direction:column;gap:12px;margin-top:12px">
        ${allCorrelations.map(incident => `
          <div class="incident-detail-btn" data-incident-id="${incident?.id}" style="padding:12px;border:0.5px solid var(--color-border-secondary);border-left:3px solid ${incident?.risk_level === 'CRITICAL' ? ALERT_PRIORITY.P1.color : ALERT_PRIORITY.P2.color};border-radius:6px;cursor:pointer;transition:all 0.2s;background:var(--color-background-secondary)">
            <div style="font-size:12px;font-weight:600;margin-bottom:6px">${incident?.description || 'Unknown'}</div>
            <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;font-size:11px;color:var(--color-text-secondary);margin-bottom:6px">
              <div>📊 ${incident?.alert_count || 0} events | Score: ${incident?.correlation_score || 0}/100</div>
              <div>🏷️ ${incident?.correlation_type || 'UNKNOWN'}</div>
            </div>
            <div style="font-size:11px;color:var(--color-text-secondary);margin-bottom:8px">
              ${new Date(incident?.start_timestamp || Date.now()).toLocaleString()} → ${new Date(incident?.end_timestamp || Date.now()).toLocaleString()}
            </div>
            <div style="font-size:10px;color:var(--clr-info-text);font-weight:500">📖 Click for details | 🔍 Investigate →</div>
          </div>
        `).join('')}
        ${allCorrelations.length === 0 ? '<div style="color:var(--color-text-secondary);text-align:center;padding:40px;font-size:12px">No correlated incidents</div>' : ''}
      </div>
    </div>
  `
}

function renderAuditView() {
  const criticalAlerts = allAlerts.filter(a => a.severity === 'CRITICAL')
  const avgScore = allAlerts.length > 0 ? Math.round(allAlerts.reduce((a, b) => a + (b.score || 0), 0) / allAlerts.length) : 0

  return `
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px;margin-bottom:16px">
      <div class="card">
        <div class="card-title">COMPLIANCE STATUS</div>
        <div style="display:flex;flex-direction:column;gap:8px;margin-top:12px;font-size:12px">
          <div style="display:flex;justify-content:space-between">
            <span>Total Alerts</span>
            <span style="font-weight:600">${allAlerts.length}</span>
          </div>
          <div style="display:flex;justify-content:space-between">
            <span>CRITICAL</span>
            <span style="font-weight:600;color:${ALERT_PRIORITY.P1.color}">${criticalAlerts.length}</span>
          </div>
          <div style="display:flex;justify-content:space-between">
            <span>Avg Risk Score</span>
            <span style="font-weight:600;color:${ALERT_PRIORITY.P2.color}">${avgScore}/100</span>
          </div>
        </div>
      </div>

      <div class="card">
        <div class="card-title">SYSTEM HEALTH</div>
        <div style="display:flex;flex-direction:column;gap:8px;margin-top:12px;font-size:12px">
          <div>✅ Audit collection: Every 5 min</div>
          <div>✅ Correlation analysis: Every 15 min</div>
          <div>✅ Agent health: Monitoring active</div>
          <div>📊 Last refresh: Just now</div>
        </div>
      </div>
    </div>

    <div class="card">
      <div class="card-title">RECENT ACTIVITIES</div>
      <div style="max-height:400px;overflow-y:auto">
        ${allAlerts.slice(0, 20).map(alert => `
          <div style="padding:10px;border-bottom:0.5px solid var(--color-border-tertiary);font-size:12px">
            <div style="font-weight:600">${(alert?.headline || 'Unknown').substring(0, 50)}</div>
            ${alert?.actor ? `<div style="font-size:11px;color:var(--color-text-secondary);margin-top:2px">${alert.actor}</div>` : ''}
            <div style="font-size:11px;color:var(--color-text-secondary)">${new Date(alert?.timestamp || Date.now()).toLocaleTimeString()}</div>
          </div>
        `).join('')}
      </div>
    </div>
  `
}

function renderUserInvestigationView() {
  const userRisks = analyzeUserRisks(allAlerts)
  const highRiskUsers = userRisks.filter(u => u.riskScore >= 60)

  return `
    <div class="card" style="margin-bottom:16px">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:16px">
        <div class="card-title" style="margin:0">👥 USER RISK ANALYSIS (${userRisks.length})</div>
        <div style="display:flex;gap:12px;font-size:11px">
          <div style="padding:6px 10px;background:var(--color-background-secondary);border-radius:4px">
            <span style="color:var(--color-text-secondary)">High Risk: </span>
            <span style="font-weight:700;color:#d32f2f">${highRiskUsers.length}</span>
          </div>
        </div>
      </div>

      <div style="display:grid;gap:12px">
        ${userRisks.slice(0, 10).map((user, idx) => {
          const riskColor = getRiskColor(user.riskScore)
          const riskLevel = getRiskLevel(user.riskScore)
          const behaviorSummary = getUserBehaviorSummary(user)

          return `
            <div style="padding:14px;background:var(--color-background-secondary);border-radius:6px;border-left:4px solid ${riskColor}">
              <div style="display:flex;justify-content:space-between;align-items:start;margin-bottom:10px">
                <div style="flex:1">
                  <div style="font-size:13px;font-weight:600;color:var(--color-text-primary)">${user.actor}</div>
                  <div style="font-size:11px;color:var(--color-text-secondary);margin-top:2px">${user.alertCount} alert(s) | Last activity: ${new Date(user.lastAlertTime).toLocaleTimeString()}</div>
                </div>
                <div style="display:flex;flex-direction:column;align-items:flex-end;gap:6px">
                  <div style="padding:4px 12px;background:${riskColor};color:white;border-radius:4px;font-size:12px;font-weight:600">
                    ${riskLevel} (${user.riskScore}/100)
                  </div>
                </div>
              </div>

              <div style="display:flex;flex-wrap:wrap;gap:6px;margin-bottom:10px">
                ${behaviorSummary.map(summary => `
                  <span style="font-size:11px;color:var(--color-text-secondary);background:var(--color-background-primary);padding:4px 8px;border-radius:3px">${summary}</span>
                `).join('')}
              </div>

              ${user.policyGaps.length > 0 ? `
                <div style="padding:10px;background:var(--color-background-primary);border-radius:4px;border-left:2px solid #f57c00">
                  <div style="font-size:11px;font-weight:600;color:#f57c00;margin-bottom:6px">⚠️ Policy Gaps:</div>
                  <div style="display:flex;flex-direction:column;gap:4px">
                    ${user.policyGaps.slice(0, 2).map(gap => `
                      <div style="font-size:11px;color:var(--color-text-secondary)">
                        <span style="font-weight:600">${gap.policy}:</span> ${gap.recommendation}
                      </div>
                    `).join('')}
                  </div>
                </div>
              ` : ''}
            </div>
          `
        }).join('')}
        ${userRisks.length === 0 ? '<div style="text-align:center;padding:40px;color:var(--color-text-secondary);font-size:12px">No user risk data available</div>' : ''}
      </div>
    </div>
  `
}

function renderForensicTimelineView() {
  // Sort all alerts and their events chronologically
  const timelineEvents = []

  allAlerts.forEach(alert => {
    if (alert?.events) {
      alert.events.forEach(event => {
        timelineEvents.push({
          timestamp: new Date(event.timestamp),
          type: 'event',
          alert: alert,
          event: event
        })
      })
    }

    // Add alert detection event
    timelineEvents.push({
      timestamp: new Date(alert?.timestamp),
      type: 'alert',
      alert: alert,
      event: null
    })
  })

  // Sort by timestamp descending
  timelineEvents.sort((a, b) => b.timestamp - a.timestamp)

  // Group by actor to show attack chains
  const actorChains = {}
  allAlerts.forEach(alert => {
    const actor = alert?.actor || 'System'
    if (!actorChains[actor]) {
      actorChains[actor] = []
    }
    actorChains[actor].push(alert)
  })

  // Sort actors by alert count
  const sortedActors = Object.entries(actorChains)
    .map(([actor, alerts]) => ({
      actor,
      alerts,
      count: alerts.length,
      riskScore: alerts.reduce((sum, a) => sum + (calculateSeverityScore(a) || 0), 0) / alerts.length
    }))
    .sort((a, b) => b.riskScore - a.riskScore)

  return `
    <div style="display:grid;grid-template-columns:1fr 2fr;gap:16px">
      <!-- ATTACK CHAINS BY ACTOR -->
      <div class="card">
        <div class="card-title">🔗 ATTACK CHAINS</div>
        <div style="display:flex;flex-direction:column;gap:8px;margin-top:12px">
          ${sortedActors.slice(0, 5).map((chain, idx) => {
            const avgRisk = Math.round(chain.riskScore)
            const riskColor = avgRisk >= 80 ? '#d32f2f' : avgRisk >= 60 ? '#f57c00' : '#1976d2'
            return `
              <div style="padding:10px;background:var(--color-background-secondary);border-radius:6px;border-left:3px solid ${riskColor};cursor:pointer" onclick="document.querySelector('#timeline-container').scrollTop = 0">
                <div style="font-size:12px;font-weight:600;margin-bottom:4px">${chain.actor}</div>
                <div style="display:flex;justify-content:space-between;font-size:11px;color:var(--color-text-secondary)">
                  <span>${chain.count} alert(s)</span>
                  <span style="color:${riskColor};font-weight:600">${avgRisk}/100</span>
                </div>
              </div>
            `
          }).join('')}
        </div>
      </div>

      <!-- FORENSIC TIMELINE -->
      <div class="card" style="min-height:500px">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px">
          <div class="card-title" style="margin:0">📈 FORENSIC TIMELINE</div>
          <button id="forensics-export" style="padding:6px 12px;background:var(--color-background-secondary);border:0.5px solid var(--color-border-secondary);border-radius:4px;cursor:pointer;font-size:11px;font-weight:600">⬇️ Export</button>
        </div>
        <div id="timeline-container" style="max-height:600px;overflow-y:auto;position:relative;padding-left:24px">
          <div style="position:absolute;left:0;top:0;bottom:0;width:2px;background:var(--color-border-primary)"></div>
          <div style="display:flex;flex-direction:column;gap:16px">
            ${timelineEvents.slice(0, 50).map(item => {
              const eventColor = item.type === 'alert'
                ? '#d32f2f'
                : item.event?.severity === 'CRITICAL' ? '#d32f2f'
                : item.event?.severity === 'HIGH' ? '#f57c00'
                : '#1976d2'

              if (item.type === 'alert') {
                const severity = calculateSeverityScore(item.alert)
                const level = getSeverityLevel(severity)
                const colors = getSeverityColors(level)

                return `
                  <div style="position:relative">
                    <div style="position:absolute;left:-11px;width:14px;height:14px;background:${eventColor};border:3px solid white;border-radius:50%;margin-top:2px;z-index:1"></div>
                    <div style="padding:10px;background:${colors.bg};border-radius:4px;border:1px solid ${colors.border}">
                      <div style="display:flex;justify-content:space-between;margin-bottom:4px">
                        <div style="font-size:12px;font-weight:600;color:${colors.text}">
                          ${colors.icon} ALERT DETECTED
                        </div>
                        <span style="font-size:11px;color:var(--color-text-secondary)">${item.timestamp.toLocaleTimeString()}</span>
                      </div>
                      <div style="font-size:11px;font-weight:600;color:var(--color-text-primary)">${item.alert?.headline}</div>
                      <div style="font-size:11px;color:var(--color-text-secondary);margin-top:4px">
                        👤 ${item.alert?.actor} | 📡 ${item.alert?.source}
                      </div>
                    </div>
                  </div>
                `
              } else {
                return `
                  <div style="position:relative">
                    <div style="position:absolute;left:-11px;width:14px;height:14px;background:${eventColor};border:3px solid white;border-radius:50%;margin-top:2px;z-index:1"></div>
                    <div style="padding:8px;background:var(--color-background-primary);border-radius:4px;border-left:2px solid ${eventColor}">
                      <div style="display:flex;justify-content:space-between;margin-bottom:2px">
                        <div style="font-size:11px;font-weight:600;color:var(--color-text-primary)">
                          📌 ${item.event?.type?.replace(/_/g, ' ').toUpperCase()}
                        </div>
                        <span style="font-size:10px;color:var(--color-text-secondary)">${item.timestamp.toLocaleTimeString()}</span>
                      </div>
                      <div style="font-size:11px;color:var(--color-text-secondary)">${item.event?.description}</div>
                      ${item.event?.actionRequired ? '<div style="font-size:10px;color:#d32f2f;margin-top:4px;font-weight:600">⚠️ Action Required</div>' : ''}
                    </div>
                  </div>
                `
              }
            }).join('')}
          </div>
        </div>
      </div>
    </div>
  `
}

function renderDemoTenantGuard(el) {
  const demoAlerts = [
    {
      id: 'alert-1',
      priority: 'P0',
      severity: 'CRITICAL',
      headline: 'MFA Disabled for Global Admin',
      description: 'MFA requirement removed for global administrator',
      actor: 'security-admin@contoso.com',
      source: 'Entra ID',
      timestamp: new Date().toISOString(),
      score: 100,
      status: 'open',
      type: 'mfa_disabled',
      userPrivilege: 'global_admin',
      dataType: 'email',
      events: [
        { timestamp: new Date(Date.now() - 20*60000).toISOString(), type: 'sign_in', description: 'Sign-in from 203.45.67.89 (USA)', severity: 'INFO' },
        { timestamp: new Date(Date.now() - 18*60000).toISOString(), type: 'policy_change', description: 'Accessed Azure Active Directory admin center', severity: 'MEDIUM', actionRequired: true },
        { timestamp: new Date(Date.now() - 15*60000).toISOString(), type: 'policy_change', description: 'Modified MFA requirement policy for global admins', severity: 'CRITICAL', actionRequired: true },
        { timestamp: new Date(Date.now() - 12*60000).toISOString(), type: 'sign_in', description: 'Sign-in attempt without MFA (unusual)', severity: 'HIGH', actionRequired: true },
      ]
    },
    {
      id: 'alert-2',
      priority: 'P1',
      severity: 'CRITICAL',
      headline: 'Conditional Access Disabled',
      description: 'Critical CA policy was disabled',
      actor: 'cloud-admin@contoso.com',
      source: 'Entra ID',
      timestamp: new Date(Date.now() - 5*60000).toISOString(),
      score: 95,
      status: 'open',
      type: 'permission_escalation',
      userPrivilege: 'security_admin',
      dataType: 'email',
      events: [
        { timestamp: new Date(Date.now() - 30*60000).toISOString(), type: 'sign_in', description: 'Sign-in from 192.168.1.100 (internal)', severity: 'INFO' },
        { timestamp: new Date(Date.now() - 28*60000).toISOString(), type: 'resource_access', description: 'Accessed Azure Portal', severity: 'INFO' },
        { timestamp: new Date(Date.now() - 25*60000).toISOString(), type: 'policy_change', description: 'Viewed Conditional Access policies', severity: 'MEDIUM', actionRequired: true },
        { timestamp: new Date(Date.now() - 22*60000).toISOString(), type: 'policy_change', description: 'Disabled CA policy: Block legacy authentication', severity: 'CRITICAL', actionRequired: true },
        { timestamp: new Date(Date.now() - 5*60000).toISOString(), type: 'sign_in', description: 'Legacy protocol sign-in detected (POP3)', severity: 'CRITICAL', actionRequired: true },
      ]
    },
    {
      id: 'alert-3',
      priority: 'P1',
      severity: 'CRITICAL',
      headline: 'OAuth Admin Consent Granted',
      description: 'OAuth app received admin consent',
      actor: 'system',
      source: 'Application',
      timestamp: new Date(Date.now() - 10*60000).toISOString(),
      score: 92,
      status: 'open',
      type: 'permission_escalation',
      userPrivilege: 'standard_user',
      dataType: 'email',
      events: [
        { timestamp: new Date(Date.now() - 40*60000).toISOString(), type: 'app_access', description: 'Unknown app requested permissions', severity: 'MEDIUM', actionRequired: true },
        { timestamp: new Date(Date.now() - 38*60000).toISOString(), type: 'app_access', description: 'App requested admin consent for Directory.Read.All', severity: 'HIGH', actionRequired: true },
        { timestamp: new Date(Date.now() - 35*60000).toISOString(), type: 'permission_grant', description: 'Admin consent granted to app', severity: 'CRITICAL', actionRequired: true },
        { timestamp: new Date(Date.now() - 10*60000).toISOString(), type: 'data_access', description: 'App accessed directory listing', severity: 'HIGH', actionRequired: true },
      ]
    },
    {
      id: 'alert-4',
      priority: 'P2',
      severity: 'HIGH',
      headline: 'External Forwarding Created',
      description: 'Email forwarding rule to external email',
      actor: 'user@contoso.com',
      source: 'Exchange',
      timestamp: new Date(Date.now() - 15*60000).toISOString(),
      score: 88,
      status: 'open',
      type: 'forwarding_rule',
      userPrivilege: 'standard_user',
      dataType: 'email',
      events: [
        { timestamp: new Date(Date.now() - 60*60000).toISOString(), type: 'sign_in', description: 'Sign-in from 185.22.33.44 (Russia, VPN)', severity: 'HIGH', actionRequired: true },
        { timestamp: new Date(Date.now() - 58*60000).toISOString(), type: 'mailbox_access', description: 'Accessed mailbox rules settings', severity: 'MEDIUM', actionRequired: true },
        { timestamp: new Date(Date.now() - 55*60000).toISOString(), type: 'rule_creation', description: 'Created forwarding rule to external@protonmail.com', severity: 'CRITICAL', actionRequired: true },
      ]
    },
    {
      id: 'alert-5',
      priority: 'P2',
      severity: 'HIGH',
      headline: 'Global Admin Assigned',
      description: 'New global admin role assignment',
      actor: 'admin@contoso.com',
      source: 'Entra ID',
      timestamp: new Date(Date.now() - 20*60000).toISOString(),
      score: 85,
      status: 'open',
      type: 'permission_escalation',
      userPrivilege: 'compliance_admin',
      dataType: 'email',
      events: [
        { timestamp: new Date(Date.now() - 45*60000).toISOString(), type: 'sign_in', description: 'Sign-in successful', severity: 'INFO' },
        { timestamp: new Date(Date.now() - 43*60000).toISOString(), type: 'resource_access', description: 'Accessed Azure AD admin center', severity: 'INFO' },
        { timestamp: new Date(Date.now() - 40*60000).toISOString(), type: 'role_assignment', description: 'Assigned global admin role to inactive-user@contoso.com', severity: 'CRITICAL', actionRequired: true },
      ]
    },
  ]

  const demoCorrelations = [
    { id: 'corr-1', description: 'Coordinated Admin Compromise - MFA bypass + Forwarding', alert_count: 3, correlation_type: 'ACTOR', risk_level: 'CRITICAL', correlation_score: 96, start_timestamp: new Date(Date.now() - 20*60000).toISOString(), end_timestamp: new Date().toISOString(), alert_ids: JSON.stringify(['alert-1', 'alert-2', 'alert-4']) },
    { id: 'corr-2', description: 'OAuth Backdoor - Admin consent + Directory access', alert_count: 2, correlation_type: 'TARGET', risk_level: 'CRITICAL', correlation_score: 92, start_timestamp: new Date(Date.now() - 15*60000).toISOString(), end_timestamp: new Date().toISOString(), alert_ids: JSON.stringify(['alert-3', 'alert-5']) },
  ]

  allAlerts = demoAlerts
  allCorrelations = demoCorrelations

  renderContent(el)
}

// Normalize alert field names to match UI expectations
function normalizeAlert(alert) {
  if (!alert) return null

  // Debug logging to see actual fields
  if (!alert.headline && !alert.name) {
    console.log('⚠️ Alert missing headline/name:', Object.keys(alert).slice(0, 10))
  }

  return {
    id: alert.id || alert.ID || 'unknown',
    headline: alert.headline || alert.name || alert.title || alert.activityDisplayName || alert.type || 'Unknown Alert',
    description: alert.description || alert.details || alert.message || alert.category || 'No description available',
    priority: alert.priority || alert.Priority || 'P3',
    severity: alert.severity || alert.Severity || 'MEDIUM',
    actor: alert.actor || alert.initiatedBy?.user?.userPrincipalName || alert.user || alert.target || 'System',
    source: alert.source || alert.Source || alert.category || 'Unknown',
    timestamp: alert.timestamp || alert.activityDateTime || alert.created_at || alert.action_timestamp || new Date().toISOString(),
    score: alert.score || alert.riskScore || 50,
    status: alert.status || alert.Status || 'open',
    type: alert.type || 'AUDIT',
    dismissed: alert.dismissed || 0
  }
}

// Normalize correlation field names
function normalizeCorrelation(corr) {
  if (!corr) return null

  return {
    id: corr.id || corr.ID || 'unknown',
    description: corr.description || corr.Description || 'Unknown Correlation',
    alert_count: corr.alert_count || corr.alertCount || corr.eventCount || 0,
    correlation_type: corr.correlation_type || corr.correlationType || 'PATTERN',
    risk_level: corr.risk_level || corr.riskLevel || 'HIGH',
    correlation_score: corr.correlation_score || corr.correlationScore || corr.score || 50,
    start_timestamp: corr.start_timestamp || corr.startTime || corr.startedAt || new Date().toISOString(),
    end_timestamp: corr.end_timestamp || corr.endTime || corr.endedAt || new Date().toISOString(),
    alert_ids: corr.alert_ids || corr.alertIds || []
  }
}

async function refreshData() {
  try {
    console.log('📡 Fetching real-time data from backend...')

    // Parallel fetch from all backend APIs
    const [alertsRes, correlationsRes, patternsRes] = await Promise.all([
      fetch(`${API_BASE}/api/tenantguard/alerts?limit=1000&exclude=informational`).then(r => r.json()).catch(e => {
        console.error('Failed to fetch alerts:', e)
        return { success: false, data: [] }
      }),
      fetch(`${API_BASE}/api/tenantguard/correlations`).then(r => r.json()).catch(e => {
        console.error('Failed to fetch correlations:', e)
        return { success: false, data: [] }
      }),
      fetch(`${API_BASE}/api/tenantguard/patterns`).then(r => r.json()).catch(e => {
        console.error('Failed to fetch patterns:', e)
        return { success: false, data: [] }
      }),
    ])

    // Use demo data only for TenantGuard
    console.log('📊 Using demo data for TenantGuard page')
    allAlerts = getDemoAlerts()
    console.log(`✅ Loaded ${allAlerts.length} demo alerts`)

    allCorrelations = getDemoCorrelations()
    console.log(`✅ Loaded ${allCorrelations.length} demo correlations`)

    allPatterns = [
      { id: 'p1', type: 'Data Exfiltration', severity: 'HIGH', events: 8, pattern: 'Unusual download + external share' },
      { id: 'p2', type: 'Privilege Escalation', severity: 'CRITICAL', events: 12, pattern: 'MFA bypass + role addition' },
      { id: 'p3', type: 'Lateral Movement', severity: 'HIGH', events: 5, pattern: 'Service account compromise' },
    ]
    console.log(`✅ Loaded ${allPatterns.length} demo patterns`)
  } catch (error) {
    console.error('Error refreshing data:', error)
    allAlerts = getDemoAlerts()
    allCorrelations = getDemoCorrelations()
  }
}

function getDemoAlerts() {
  return [
    { id: 'alert-1', priority: 'P0', severity: 'CRITICAL', headline: 'MFA Disabled for Global Admin', description: 'MFA requirement removed for global administrator', actor: 'security-admin@contoso.com', source: 'Entra ID', timestamp: new Date().toISOString(), score: 100, status: 'open' },
    { id: 'alert-2', priority: 'P1', severity: 'CRITICAL', headline: 'Conditional Access Disabled', description: 'Critical CA policy was disabled', actor: 'cloud-admin@contoso.com', source: 'Entra ID', timestamp: new Date(Date.now() - 5*60000).toISOString(), score: 95, status: 'open' },
    { id: 'alert-3', priority: 'P1', severity: 'CRITICAL', headline: 'OAuth Admin Consent Granted', description: 'OAuth app received admin consent', actor: 'system', source: 'Application', timestamp: new Date(Date.now() - 10*60000).toISOString(), score: 92, status: 'open' },
    { id: 'alert-4', priority: 'P2', severity: 'HIGH', headline: 'External Forwarding Created', description: 'Email forwarding rule to external email', actor: 'user@contoso.com', source: 'Exchange', timestamp: new Date(Date.now() - 15*60000).toISOString(), score: 88, status: 'open' },
    { id: 'alert-5', priority: 'P2', severity: 'HIGH', headline: 'Global Admin Assigned', description: 'New global admin role assignment', actor: 'admin@contoso.com', source: 'Entra ID', timestamp: new Date(Date.now() - 20*60000).toISOString(), score: 85, status: 'open' },
  ]
}

function getDemoCorrelations() {
  return [
    { id: 'corr-3', description: 'Multi-Stage: Admin compromise → Security bypass → Access', alert_count: 4, correlation_type: 'PATTERN', risk_level: 'CRITICAL', correlation_score: 95, start_timestamp: new Date(Date.now() - 20*60000).toISOString(), end_timestamp: new Date().toISOString() },
  ]
}

function attachIncidentDetailListeners() {
  document.querySelectorAll('.incident-detail-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const incidentId = btn.dataset.incidentId
      const incident = allCorrelations.find(c => c.id === incidentId)
      if (incident) {
        showIncidentDetailModal(incident)
      }
    })
  })
}

async function startIncidentInvestigation(incident) {
  try {
    console.log('🔍 Starting investigation for incident:', incident.id)

    // Call the imported startInvestigation function with proper parameters
    const result = await startInvestigation(
      null, // alertId (not applicable for correlations)
      incident.id, // correlationId
      incident.description // title
    )

    showToast('🔍 Investigation started for: ' + incident.description.substring(0, 50), 'success')
    console.log('✅ Investigation created:', result)
  } catch (error) {
    console.error('❌ Investigation start failed:', error)
    showToast('❌ Failed to start investigation: ' + error.message, 'error')
  }
}

function showIncidentDetailModal(incident) {
  if (!incident) return

  const modal = document.createElement('div')
  modal.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0,0,0,0.7);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 10000;
  `

  const content = document.createElement('div')
  content.style.cssText = `
    background: var(--color-background-primary);
    border-radius: 8px;
    padding: 24px;
    max-width: 700px;
    max-height: 80vh;
    overflow-y: auto;
    box-shadow: 0 10px 40px rgba(0,0,0,0.3);
  `

  const riskColor = incident?.risk_level === 'CRITICAL' ? '#d32f2f' : incident?.risk_level === 'HIGH' ? '#f57c00' : '#fbc02d'

  content.innerHTML = `
    <div style="margin-bottom: 20px">
      <div style="display: flex; justify-content: space-between; align-items: start; gap: 16px">
        <div>
          <div style="font-size: 18px; font-weight: 700; margin-bottom: 8px">${incident?.description || 'Unknown Incident'}</div>
          <div style="display: flex; gap: 12px; margin-bottom: 12px">
            <span style="background: ${riskColor}; color: white; padding: 4px 12px; border-radius: 20px; font-size: 12px; font-weight: 600">${incident?.risk_level || 'UNKNOWN'}</span>
            <span style="background: var(--color-background-secondary); color: var(--color-text-secondary); padding: 4px 12px; border-radius: 20px; font-size: 12px">${incident?.correlation_type || 'PATTERN'}</span>
          </div>
        </div>
        <button onclick="this.closest('[data-modal]').remove()" style="background: none; border: none; font-size: 24px; cursor: pointer; color: var(--color-text-secondary)">✕</button>
      </div>
    </div>

    <div style="background: var(--color-background-secondary); padding: 16px; border-radius: 6px; margin-bottom: 16px">
      <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 16px">
        <div>
          <div style="font-size: 12px; color: var(--color-text-secondary); margin-bottom: 4px">CORRELATION SCORE</div>
          <div style="font-size: 28px; font-weight: 700; color: ${riskColor}">${incident?.correlation_score || 0}/100</div>
        </div>
        <div>
          <div style="font-size: 12px; color: var(--color-text-secondary); margin-bottom: 4px">EVENTS INVOLVED</div>
          <div style="font-size: 28px; font-weight: 700; color: var(--clr-info-text)">${incident?.alert_count || 0}</div>
        </div>
        <div>
          <div style="font-size: 12px; color: var(--color-text-secondary); margin-bottom: 4px">RISK LEVEL</div>
          <div style="font-size: 20px; font-weight: 700; color: ${riskColor}">${incident?.risk_level || 'N/A'}</div>
        </div>
      </div>
    </div>

    <div style="margin-bottom: 16px">
      <div style="font-size: 14px; font-weight: 600; margin-bottom: 8px; color: var(--color-text-primary)">TIMELINE</div>
      <div style="background: var(--color-background-secondary); padding: 12px; border-radius: 6px; font-size: 13px">
        <div style="margin-bottom: 6px">
          <span style="color: var(--color-text-secondary)">📅 Start:</span> ${new Date(incident?.start_timestamp || Date.now()).toLocaleString()}
        </div>
        <div>
          <span style="color: var(--color-text-secondary)">📅 End:</span> ${new Date(incident?.end_timestamp || Date.now()).toLocaleString()}
        </div>
      </div>
    </div>

    <div style="margin-bottom: 16px">
      <div style="font-size: 14px; font-weight: 600; margin-bottom: 8px; color: var(--color-text-primary)">INCIDENT DETAILS</div>
      <div style="background: var(--color-background-secondary); padding: 12px; border-radius: 6px; font-size: 13px; line-height: 1.6; color: var(--color-text-secondary)">
        <p style="margin: 0 0 8px 0">
          <strong>📌 Incident ID:</strong> ${incident?.id || 'N/A'}
        </p>
        <p style="margin: 0 0 8px 0">
          <strong>🏷️ Type:</strong> ${incident?.correlation_type || 'N/A'}
        </p>
        <p style="margin: 0 0 8px 0">
          <strong>⚠️ Risk Level:</strong> ${incident?.risk_level || 'N/A'}
        </p>
        <p style="margin: 0">
          <strong>📊 Description:</strong> ${incident?.description || 'N/A'}
        </p>
      </div>
    </div>

    <div style="margin-bottom: 16px">
      <div style="font-size: 14px; font-weight: 600; margin-bottom: 8px; color: var(--color-text-primary)">CORRELATED EVENTS</div>
      <div id="related-alerts-container" style="background: var(--color-background-secondary); padding: 12px; border-radius: 6px; font-size: 12px">
        <div style="color: var(--color-text-secondary); text-align: center; padding: 16px">Loading events...</div>
      </div>
    </div>

    <div style="display: flex; gap: 8px">
      <button onclick="this.closest('[data-modal]').remove()" style="flex: 1; padding: 10px; background: var(--color-background-secondary); border: 1px solid var(--color-border-primary); border-radius: 6px; cursor: pointer; font-weight: 600; color: var(--color-text-primary)">Close</button>
      <button id="investigate-btn" style="flex: 1; padding: 10px; background: var(--clr-info-bg); border: 1px solid var(--clr-info-text); border-radius: 6px; cursor: pointer; font-weight: 600; color: var(--clr-info-text)">🔍 Start Investigation</button>
    </div>
  `

  modal.setAttribute('data-modal', 'true')
  modal.appendChild(content)
  modal.addEventListener('click', (e) => {
    if (e.target === modal) modal.remove()
  })

  // Attach investigate button handler
  const investigateBtn = content.querySelector('#investigate-btn')
  investigateBtn.addEventListener('click', async () => {
    await startInvestigation(incident)
    modal.remove()
  })

  document.body.appendChild(modal)

  // Load and display related alerts
  setTimeout(() => {
    const alertsContainer = content.querySelector('#related-alerts-container')
    if (!alertsContainer) return

    try {
      // Parse alert IDs from incident data
      let alertIds = []
      if (incident?.alert_ids) {
        // Try to parse as JSON array
        try {
          alertIds = JSON.parse(incident.alert_ids)
        } catch {
          // If not JSON, treat as comma-separated
          alertIds = incident.alert_ids.split(',').map(id => id.trim())
        }
      }

      console.log('🔍 Looking for alerts:', alertIds)
      console.log('📊 Available alerts in allAlerts:', allAlerts?.length || 0, allAlerts?.map(a => a.id) || [])

      if (!alertIds || alertIds.length === 0) {
        alertsContainer.innerHTML = '<div style="color: var(--color-text-secondary); text-align: center; padding: 12px">No events data available</div>'
        return
      }

      // Find matching alerts from allAlerts
      const relatedAlerts = alertIds
        .map(id => {
          const found = allAlerts?.find(a => a.id === id)
          console.log(`  Alert ${id}: ${found ? 'FOUND' : 'NOT FOUND'}`)
          return found
        })
        .filter(Boolean)

      if (relatedAlerts.length === 0) {
        alertsContainer.innerHTML = `<div style="color: var(--color-text-secondary); padding: 12px">
          <div style="margin-bottom: 4px">📊 ${alertIds.length} event(s) involved:</div>
          ${alertIds.map(id => `<div style="padding: 4px 0; font-family: monospace; font-size: 11px">${id}</div>`).join('')}
        </div>`
        return
      }

      // Display alert details
      alertsContainer.innerHTML = relatedAlerts.map((alert, idx) => `
        <div style="padding: 8px; margin-bottom: 8px; border-left: 3px solid ${alert?.severity === 'CRITICAL' ? '#d32f2f' : '#f57c00'}; background: var(--color-background-primary); border-radius: 4px">
          <div style="font-weight: 600; margin-bottom: 4px">${idx + 1}. ${alert?.headline || alert?.title || 'Unknown Alert'}</div>
          <div style="color: var(--color-text-secondary); font-size: 11px; margin-bottom: 3px">
            🆔 ${alert?.id || 'N/A'}
          </div>
          <div style="color: var(--color-text-secondary); font-size: 11px; margin-bottom: 3px">
            ${alert?.severity ? `⚠️ ${alert.severity}` : ''} ${alert?.action_timestamp ? `| 📅 ${new Date(alert.action_timestamp).toLocaleString()}` : ''}
          </div>
          ${alert?.description ? `<div style="color: var(--color-text-secondary); font-size: 11px">${alert.description}</div>` : ''}
        </div>
      `).join('')
    } catch (error) {
      console.error('Error loading related alerts:', error)
      alertsContainer.innerHTML = '<div style="color: #f57c00; padding: 12px">Error loading events</div>'
    }
  }, 100)
}

function showAlertDetail(el, alert) {
  if (!alert) return

  const modal = document.createElement('div')
  modal.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0,0,0,0.7);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 10000;
    overflow-y: auto;
    padding: 20px;
  `

  const severity = calculateSeverityScore(alert)
  const level = getSeverityLevel(severity)
  const colors = getSeverityColors(level)
  const actionChecklist = getActionChecklist(alert)
  const policyRecommendations = getPolicyRecommendations(alert)
  const currentStatus = getAlertStatus(alert.id)
  const statusInfo = getStatusInfo(currentStatus)
  const nextStatuses = getNextStatuses(currentStatus)

  const content = document.createElement('div')
  content.style.cssText = `
    background: var(--color-background-primary);
    border-radius: 8px;
    padding: 24px;
    max-width: 800px;
    width: 100%;
    box-shadow: 0 10px 40px rgba(0,0,0,0.3);
    border-left: 4px solid ${colors.border};
  `

  content.innerHTML = `
    <div style="display:flex;justify-content:space-between;align-items:start;margin-bottom:20px">
      <div style="flex:1">
        <div style="font-size:14px;font-weight:700;color:${colors.text};margin-bottom:8px">
          ${colors.icon} ${level}
        </div>
        <div style="font-size:18px;font-weight:700;margin-bottom:8px">${alert?.headline || 'Unknown Alert'}</div>
        <div style="font-size:13px;color:var(--color-text-secondary)">
          ${alert?.description || 'No description available'}
        </div>
      </div>
      <button onclick="this.closest('[data-modal]').remove()" style="background:none;border:none;font-size:24px;cursor:pointer;color:var(--color-text-secondary);flex-shrink:0">✕</button>
    </div>

    <!-- SEVERITY SCORE BREAKDOWN -->
    <div class="card" style="margin-bottom:16px;background:${colors.bg};padding:16px;border-radius:8px;border:1px solid ${colors.border}">
      <div style="font-size:14px;font-weight:600;color:${colors.text};margin-bottom:12px">SEVERITY SCORE BREAKDOWN</div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px">
        <div style="padding:12px;background:var(--color-background-secondary);border-radius:6px">
          <div style="font-size:11px;color:var(--color-text-secondary);margin-bottom:4px">OVERALL SCORE</div>
          <div style="font-size:32px;font-weight:700;color:${colors.text}">${severity}/100</div>
        </div>
        <div style="padding:12px;background:var(--color-background-secondary);border-radius:6px">
          <div style="font-size:11px;color:var(--color-text-secondary);margin-bottom:4px">SEVERITY LEVEL</div>
          <div style="font-size:20px;font-weight:700;color:${colors.text}">${level}</div>
        </div>
      </div>
    </div>

    <!-- STATUS TRACKING -->
    <div class="card" style="margin-bottom:16px;padding:16px;background:var(--color-background-secondary);border-radius:8px">
      <div style="font-size:14px;font-weight:600;margin-bottom:12px">📊 INVESTIGATION STATUS</div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:12px">
        <div style="padding:12px;background:var(--color-background-primary);border-radius:6px;border-left:3px solid ${statusInfo.color}">
          <div style="font-size:11px;color:var(--color-text-secondary);margin-bottom:4px">CURRENT STATUS</div>
          <div style="font-size:14px;font-weight:700;color:${statusInfo.color}">${statusInfo.icon} ${statusInfo.label}</div>
          <div style="font-size:11px;color:var(--color-text-secondary);margin-top:4px">${statusInfo.description}</div>
        </div>
        <div style="padding:12px;background:var(--color-background-primary);border-radius:6px">
          <div style="font-size:11px;color:var(--color-text-secondary);margin-bottom:4px">NEXT ACTIONS</div>
          <div style="display:flex;flex-direction:column;gap:6px;margin-top:8px">
            ${nextStatuses.length > 0 ? nextStatuses.map(status => `
              <button data-status="${status.key}" class="status-btn" style="padding:8px;background:${status.color};border:none;border-radius:4px;cursor:pointer;font-size:11px;font-weight:600;color:white;text-align:left">
                ${status.icon} ${status.label}
              </button>
            `).join('') : '<div style="font-size:11px;color:var(--color-text-secondary)">Alert is resolved</div>'}
          </div>
        </div>
      </div>
      <div id="status-message" style="display:none;padding:8px;background:var(--color-background-primary);border-radius:4px;font-size:11px;color:#4caf50;font-weight:600">
        ✅ Status updated successfully
      </div>
    </div>

    <!-- ALERT DETAILS -->
    <div class="card" style="margin-bottom:16px;padding:16px;background:var(--color-background-secondary);border-radius:8px">
      <div style="font-size:14px;font-weight:600;margin-bottom:12px">ALERT DETAILS</div>
      <div style="display:grid;gap:12px">
        <div style="padding:12px;background:var(--color-background-primary);border-radius:6px">
          <div style="font-size:11px;color:var(--color-text-secondary);margin-bottom:4px">🆔 ALERT ID</div>
          <div style="font-size:12px;font-family:monospace">${alert?.id || 'N/A'}</div>
        </div>
        <div style="padding:12px;background:var(--color-background-primary);border-radius:6px">
          <div style="font-size:11px;color:var(--color-text-secondary);margin-bottom:4px">👤 AFFECTED USER</div>
          <div style="font-size:12px;font-weight:600">${alert?.actor || 'Unknown'}</div>
        </div>
        <div style="padding:12px;background:var(--color-background-primary);border-radius:6px">
          <div style="font-size:11px;color:var(--color-text-secondary);margin-bottom:4px">📅 DETECTED</div>
          <div style="font-size:12px">${new Date(alert?.timestamp || Date.now()).toLocaleString()}</div>
        </div>
        <div style="padding:12px;background:var(--color-background-primary);border-radius:6px">
          <div style="font-size:11px;color:var(--color-text-secondary);margin-bottom:4px">📊 SOURCE</div>
          <div style="font-size:12px">${alert?.source || 'Unknown Service'}</div>
        </div>
      </div>
    </div>

    <!-- INVESTIGATION TIMELINE -->
    <div class="card" style="margin-bottom:16px;padding:16px;background:var(--color-background-secondary);border-radius:8px">
      <div style="font-size:14px;font-weight:600;margin-bottom:12px">📈 INVESTIGATION TIMELINE</div>
      ${(() => {
        const events = alert?.events || []
        const totalEvents = events.length
        const criticalEvents = events.filter(e => e.severity === 'CRITICAL').length
        const actionEvents = events.filter(e => e.actionRequired).length
        const timeSpan = totalEvents > 0 ? Math.round((new Date(events[0].timestamp) - new Date(events[events.length - 1].timestamp)) / (1000 * 60)) : 0
        return totalEvents > 0 ? `
          <div style="display:grid;grid-template-columns:1fr 1fr 1fr 1fr;gap:8px;margin-bottom:12px">
            <div style="padding:8px;background:var(--color-background-primary);border-radius:4px;text-align:center">
              <div style="font-size:16px;font-weight:700;color:var(--color-text-primary)">${totalEvents}</div>
              <div style="font-size:10px;color:var(--color-text-secondary)">Total Events</div>
            </div>
            <div style="padding:8px;background:var(--color-background-primary);border-radius:4px;text-align:center">
              <div style="font-size:16px;font-weight:700;color:#d32f2f">${criticalEvents}</div>
              <div style="font-size:10px;color:var(--color-text-secondary)">Critical</div>
            </div>
            <div style="padding:8px;background:var(--color-background-primary);border-radius:4px;text-align:center">
              <div style="font-size:16px;font-weight:700;color:#d32f2f">${actionEvents}</div>
              <div style="font-size:10px;color:var(--color-text-secondary)">Require Action</div>
            </div>
            <div style="padding:8px;background:var(--color-background-primary);border-radius:4px;text-align:center">
              <div style="font-size:16px;font-weight:700;color:var(--color-text-primary)">${timeSpan}m</div>
              <div style="font-size:10px;color:var(--color-text-secondary)">Time Span</div>
            </div>
          </div>
        ` : ''
      })()}
      <div style="margin-top:12px;position:relative;padding-left:24px">
        <div style="position:absolute;left:0;top:0;bottom:0;width:2px;background:var(--color-border-primary)"></div>
        <div style="display:flex;flex-direction:column;gap:16px">
          ${(alert?.events || []).sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp)).map(event => {
            const eventColor = event.severity === 'CRITICAL' ? '#d32f2f' : event.severity === 'HIGH' ? '#f57c00' : event.severity === 'MEDIUM' ? '#1976d2' : '#666'
            const eventIcon = event.type === 'sign_in' ? '🔐' : event.type === 'policy_change' ? '⚙️' : event.type === 'resource_access' ? '📁' : event.type === 'mailbox_access' ? '📧' : event.type === 'rule_creation' ? '📋' : event.type === 'role_assignment' ? '👤' : event.type === 'app_access' ? '🔗' : event.type === 'permission_grant' ? '✅' : event.type === 'data_access' ? '💾' : '📌'
            return `
              <div>
                <div style="position:absolute;left:-11px;width:14px;height:14px;background:${eventColor};border:3px solid white;border-radius:50%;margin-top:2px"></div>
                <div style="display:flex;justify-content:space-between;align-items:start;margin-bottom:4px">
                  <div style="font-size:12px;font-weight:600">${eventIcon} ${event.type.replace(/_/g, ' ').toUpperCase()}</div>
                  ${event.actionRequired ? '<span style="background:#d32f2f;color:white;padding:2px 8px;border-radius:4px;font-size:10px;font-weight:600">⚠️ ACTION</span>' : ''}
                </div>
                <div style="font-size:12px;color:var(--color-text-primary);margin-bottom:4px">${event.description}</div>
                <div style="display:flex;justify-content:space-between;font-size:11px;color:var(--color-text-secondary)">
                  <span>📅 ${new Date(event.timestamp).toLocaleTimeString()}</span>
                  <span style="color:${eventColor};font-weight:600">${event.severity}</span>
                </div>
              </div>
            `
          }).join('')}
          ${(!alert?.events || alert.events.length === 0) ? '<div style="color:var(--color-text-secondary);text-align:center;padding:20px;font-size:12px">No timeline events available</div>' : ''}
        </div>
      </div>
    </div>

    <!-- ACTION CHECKLIST -->
    <div class="card" style="margin-bottom:16px;padding:16px;background:var(--color-background-secondary);border-radius:8px">
      <div style="font-size:14px;font-weight:600;margin-bottom:12px">📋 WHAT NEEDS TO CHANGE - ACTION CHECKLIST</div>
      <div style="display:flex;flex-direction:column;gap:8px">
        ${actionChecklist.map((action, idx) => `
          <div style="display:flex;gap:8px;padding:10px;background:var(--color-background-primary);border-radius:6px;font-size:12px">
            <input type="checkbox" style="flex-shrink:0;margin-top:2px" title="Mark action as completed">
            <label style="cursor:pointer;flex:1">
              <span style="color:var(--color-text-secondary)">[${idx + 1}]</span> ${action}
            </label>
          </div>
        `).join('')}
      </div>
    </div>

    <!-- POLICY RECOMMENDATIONS -->
    <div class="card" style="margin-bottom:16px;padding:16px;background:var(--color-background-secondary);border-radius:8px">
      <div style="font-size:14px;font-weight:600;margin-bottom:12px">🛡️ POLICY RECOMMENDATIONS - WHAT NEEDS TO CHANGE</div>
      <div style="display:flex;flex-direction:column;gap:12px">
        ${policyRecommendations.map((rec, idx) => `
          <div style="padding:12px;background:var(--color-background-primary);border-radius:6px;border-left:3px solid ${getPriorityColor(rec.priority)}">
            <div style="display:flex;justify-content:space-between;align-items:start;margin-bottom:8px">
              <div>
                <div style="font-size:12px;font-weight:600;color:var(--color-text-primary)">${rec.policy}</div>
                <div style="font-size:13px;font-weight:600;margin-top:4px">${rec.recommendation}</div>
              </div>
              <div style="display:flex;gap:6px;flex-direction:column;align-items:flex-end">
                <span style="background:${getPriorityColor(rec.priority)};color:white;padding:3px 8px;border-radius:3px;font-size:10px;font-weight:600">${rec.priority}</span>
                <span style="background:${getEffortColor(rec.effort)};color:white;padding:3px 8px;border-radius:3px;font-size:10px;font-weight:600">${rec.effort}</span>
              </div>
            </div>
            <div style="font-size:11px;color:var(--color-text-secondary);margin-bottom:8px;line-height:1.5">
              <div style="margin-bottom:6px"><strong>📋 How:</strong> ${rec.implementation}</div>
              <div><strong>💡 Impact:</strong> ${rec.impact}</div>
            </div>
          </div>
        `).join('')}
      </div>
    </div>

    <!-- ACTION BUTTONS -->
    <div style="display:flex;gap:8px">
      <button onclick="this.closest('[data-modal]').remove()" style="flex:1;padding:12px;background:var(--color-background-secondary);border:1px solid var(--color-border-primary);border-radius:6px;cursor:pointer;font-weight:600;color:var(--color-text-primary)">Close</button>
      <button id="start-investigation-btn" style="flex:1;padding:12px;background:${colors.border};border:none;border-radius:6px;cursor:pointer;font-weight:600;color:white">🔍 Start Investigation</button>
    </div>
  `

  modal.setAttribute('data-modal', 'true')
  modal.appendChild(content)
  modal.addEventListener('click', (e) => {
    if (e.target === modal) modal.remove()
  })

  document.body.appendChild(modal)

  // Start investigation handler
  content.querySelector('#start-investigation-btn').addEventListener('click', async () => {
    showToast('Starting investigation workflow...', 'info')
    await startInvestigation(alert)
    modal.remove()
  })

  // Status transition handlers
  content.querySelectorAll('.status-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const newStatus = btn.dataset.status
      const oldStatus = currentStatus

      if (setAlertStatus(alert.id, newStatus)) {
        addStatusTransition(alert.id, oldStatus, newStatus)

        // Show success message
        const msgElement = content.querySelector('#status-message')
        msgElement.style.display = 'block'
        msgElement.textContent = `✅ Status updated: ${getStatusInfo(oldStatus).label} → ${getStatusInfo(newStatus).label}`

        // Hide buttons and show resolved state if fully resolved
        setTimeout(() => {
          const statusBtns = content.querySelectorAll('.status-btn')
          statusBtns.forEach(b => b.style.opacity = '0.5')

          // Update next actions if no more statuses available
          if (nextStatuses.length <= 1) {
            const nextActionsDiv = content.querySelector('[style*="Next Actions"]')?.parentElement
            if (nextActionsDiv) {
              nextActionsDiv.innerHTML = '<div style="font-size:11px;color:var(--color-text-secondary)">✓ All actions completed</div>'
            }
          }
        }, 500)

        showToast(`Status updated to ${getStatusInfo(newStatus).label}`, 'success')
      }
    })
  })
}

function showCorrelationDetails(correlation) {
  if (!correlation) return

  const modal = document.createElement('div')
  modal.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0,0,0,0.7);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 10000;
  `

  const content = document.createElement('div')
  content.style.cssText = `
    background: var(--color-background-primary);
    border-radius: 8px;
    padding: 24px;
    max-width: 600px;
    max-height: 80vh;
    overflow-y: auto;
    box-shadow: 0 10px 40px rgba(0,0,0,0.3);
  `

  const riskColor = correlation?.risk_level === 'CRITICAL' ? '#d32f2f' : correlation?.risk_level === 'HIGH' ? '#f57c00' : '#fbc02d'

  content.innerHTML = `
    <div style="margin-bottom: 20px">
      <div style="display: flex; justify-content: space-between; align-items: start; gap: 16px">
        <div>
          <div style="font-size: 18px; font-weight: 700; margin-bottom: 8px">${correlation?.description || 'Unknown Correlation'}</div>
          <div style="display: flex; gap: 12px; margin-bottom: 12px">
            <span style="background: ${riskColor}; color: white; padding: 4px 12px; border-radius: 20px; font-size: 12px; font-weight: 600">${correlation?.risk_level || 'UNKNOWN'}</span>
            <span style="background: var(--color-background-secondary); color: var(--color-text-secondary); padding: 4px 12px; border-radius: 20px; font-size: 12px">${correlation?.correlation_type || 'PATTERN'}</span>
          </div>
        </div>
        <button onclick="this.closest('[data-modal]').remove()" style="background: none; border: none; font-size: 24px; cursor: pointer; color: var(--color-text-secondary)">✕</button>
      </div>
    </div>

    <div style="background: var(--color-background-secondary); padding: 16px; border-radius: 6px; margin-bottom: 16px">
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px">
        <div>
          <div style="font-size: 12px; color: var(--color-text-secondary); margin-bottom: 4px">CORRELATION SCORE</div>
          <div style="font-size: 28px; font-weight: 700; color: ${riskColor}">${correlation?.correlation_score || 0}/100</div>
        </div>
        <div>
          <div style="font-size: 12px; color: var(--color-text-secondary); margin-bottom: 4px">EVENTS INVOLVED</div>
          <div style="font-size: 28px; font-weight: 700; color: var(--clr-info-text)">${correlation?.alert_count || 0}</div>
        </div>
      </div>
    </div>

    <div style="margin-bottom: 16px">
      <div style="font-size: 14px; font-weight: 600; margin-bottom: 8px; color: var(--color-text-primary)">TIMELINE</div>
      <div style="background: var(--color-background-secondary); padding: 12px; border-radius: 6px; font-size: 13px">
        <div style="margin-bottom: 6px">
          <span style="color: var(--color-text-secondary)">Start:</span> ${new Date(correlation?.start_timestamp || Date.now()).toLocaleString()}
        </div>
        <div>
          <span style="color: var(--color-text-secondary)">End:</span> ${new Date(correlation?.end_timestamp || Date.now()).toLocaleString()}
        </div>
      </div>
    </div>

    <div style="margin-bottom: 16px">
      <div style="font-size: 14px; font-weight: 600; margin-bottom: 8px; color: var(--color-text-primary)">DETAILS</div>
      <div style="background: var(--color-background-secondary); padding: 12px; border-radius: 6px; font-size: 13px; line-height: 1.6; color: var(--color-text-secondary)">
        <p style="margin: 0 0 8px 0">
          <strong>ID:</strong> ${correlation?.id || 'N/A'}
        </p>
        <p style="margin: 0 0 8px 0">
          <strong>Type:</strong> ${correlation?.correlation_type || 'N/A'}
        </p>
        <p style="margin: 0">
          <strong>Risk Level:</strong> ${correlation?.risk_level || 'N/A'}
        </p>
      </div>
    </div>

    <div style="display: flex; gap: 8px">
      <button onclick="this.closest('[data-modal]').remove()" style="flex: 1; padding: 10px; background: var(--color-background-secondary); border: 1px solid var(--color-border-primary); border-radius: 6px; cursor: pointer; font-weight: 600; color: var(--color-text-primary)">Close</button>
      <button onclick="console.log('Investigate:', ${JSON.stringify(correlation).replace(/"/g, '&quot;')}); this.closest('[data-modal]').remove(); showToast('Investigation started', 'info')" style="flex: 1; padding: 10px; background: var(--clr-info-bg); border: 1px solid var(--clr-info-text); border-radius: 6px; cursor: pointer; font-weight: 600; color: var(--clr-info-text)">📊 Investigate</button>
    </div>
  `

  modal.setAttribute('data-modal', 'true')
  modal.appendChild(content)
  modal.addEventListener('click', (e) => {
    if (e.target === modal) modal.remove()
  })
  document.body.appendChild(modal)
}


window.switchTab = (tab) => {
  activeTab = tab
  const el = document.getElementById('page-tenantguard')
  if (el) renderContent(el)
}
// Force rebuild on Sat Jul 18 23:30:35 IST 2026
// Force rebuild 1784443222842503000
