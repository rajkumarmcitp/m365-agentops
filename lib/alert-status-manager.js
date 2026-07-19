/**
 * Alert Status Manager
 * Manages alert investigation status tracking with backend persistence
 */

const API_BASE = '/api'

// Cache for reducing API calls
const statusCache = new Map()
const cacheExpiry = 5 * 60 * 1000 // 5 minutes

const STATUS_WORKFLOW = {
  NEW: { order: 0, label: 'New', icon: '🆕', color: '#1976d2', description: 'Alert newly detected' },
  UNDER_INVESTIGATION: { order: 1, label: 'Under Investigation', icon: '🔍', color: '#f57c00', description: 'Investigation in progress' },
  ACTION_TAKEN: { order: 2, label: 'Action Taken', icon: '✅', color: '#4caf50', description: 'Remediation actions executed' },
  RESOLVED: { order: 3, label: 'Resolved', icon: '✔️', color: '#388e3c', description: 'Alert resolved' },
  FALSE_POSITIVE: { order: 4, label: 'False Positive', icon: '⚠️', color: '#9c27b0', description: 'Alert dismissed as false positive' }
}

const STORAGE_KEY = 'alert-statuses'

export function getAvailableStatuses() {
  return Object.entries(STATUS_WORKFLOW).map(([key, value]) => ({
    key,
    ...value
  }))
}

export function getStatusInfo(status) {
  const statusKey = Object.keys(STATUS_WORKFLOW).find(
    key => STATUS_WORKFLOW[key].label === status || key === status
  )
  return statusKey ? STATUS_WORKFLOW[statusKey] : STATUS_WORKFLOW.NEW
}

export function getAlertStatus(alertId) {
  try {
    // First check in-memory cache
    const cached = statusCache.get(alertId)
    if (cached && Date.now() - cached.timestamp < cacheExpiry) {
      return cached.status
    }

    // Fall back to localStorage (synced from server)
    const statuses = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}')
    return statuses[alertId] || 'NEW'
  } catch {
    return 'NEW'
  }
}

export async function refreshAlertStatus(alertId) {
  try {
    const response = await fetch(`${API_BASE}/alert-status/${alertId}`)
    if (!response.ok) throw new Error(`Failed to fetch status: ${response.statusText}`)

    const result = await response.json()
    if (result.success) {
      const status = result.data.status
      statusCache.set(alertId, { status, timestamp: Date.now() })
      // Update localStorage
      const statuses = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}')
      statuses[alertId] = status
      localStorage.setItem(STORAGE_KEY, JSON.stringify(statuses))
      return status
    }
    throw new Error(result.message || 'Unknown error')
  } catch (error) {
    console.error('Error refreshing alert status:', error)
    return getAlertStatus(alertId)
  }
}

export async function setAlertStatus(alertId, newStatus, userId = 'system') {
  try {
    const response = await fetch(`${API_BASE}/alert-status/${alertId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: newStatus, userId })
    })

    if (!response.ok) throw new Error(`Failed to update status: ${response.statusText}`)

    const result = await response.json()
    if (result.success) {
      // Update cache
      statusCache.set(alertId, { status: newStatus, timestamp: Date.now() })
      // Update localStorage
      const statuses = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}')
      statuses[alertId] = newStatus
      localStorage.setItem(STORAGE_KEY, JSON.stringify(statuses))

      console.log(`✅ Alert ${alertId}: ${result.data.oldStatus} → ${result.data.newStatus}`)
      return true
    }
    throw new Error(result.message || 'Unknown error')
  } catch (error) {
    console.error('Error updating alert status:', error)
    return false
  }
}

export function getAlertsByStatus(alerts, status) {
  return alerts.filter(alert => getAlertStatus(alert.id) === status)
}

export function getStatusDistribution(alerts) {
  const distribution = {}

  Object.keys(STATUS_WORKFLOW).forEach(status => {
    distribution[status] = getAlertsByStatus(alerts, status).length
  })

  return distribution
}

export function getNextStatuses(currentStatus) {
  const currentOrder = STATUS_WORKFLOW[currentStatus]?.order ?? -1

  return Object.entries(STATUS_WORKFLOW)
    .filter(([_, info]) => info.order > currentOrder)
    .map(([key, value]) => ({
      key,
      ...value
    }))
}

export function canTransitionTo(fromStatus, toStatus) {
  const fromOrder = STATUS_WORKFLOW[fromStatus]?.order ?? -1
  const toOrder = STATUS_WORKFLOW[toStatus]?.order ?? -1

  // Allow transitions forward or to FALSE_POSITIVE (from any status)
  return toOrder > fromOrder || toStatus === 'FALSE_POSITIVE'
}

export function getStatusDuration(alertId, createdAt) {
  const now = new Date()
  const created = new Date(createdAt)
  const diffMs = now - created
  const diffMins = Math.floor(diffMs / (1000 * 60))

  if (diffMins < 1) return 'Just now'
  if (diffMins < 60) return `${diffMins}m ago`

  const diffHours = Math.floor(diffMins / 60)
  if (diffHours < 24) return `${diffHours}h ago`

  const diffDays = Math.floor(diffHours / 24)
  return `${diffDays}d ago`
}

export function getStatusMetrics(alerts) {
  const distribution = getStatusDistribution(alerts)
  const total = alerts.length

  return {
    total,
    new: distribution.NEW,
    underInvestigation: distribution.UNDER_INVESTIGATION,
    actionTaken: distribution.ACTION_TAKEN,
    resolved: distribution.RESOLVED,
    falsePositive: distribution.FALSE_POSITIVE,
    percentResolved: total > 0 ? Math.round((distribution.RESOLVED / total) * 100) : 0,
    percentUnderInvestigation: total > 0 ? Math.round((distribution.UNDER_INVESTIGATION / total) * 100) : 0,
    averageResolutionTime: calculateAverageResolutionTime(alerts)
  }
}

function calculateAverageResolutionTime(alerts) {
  const resolvedAlerts = alerts.filter(a => getAlertStatus(a.id) === 'RESOLVED')

  if (resolvedAlerts.length === 0) return '—'

  const totalTime = resolvedAlerts.reduce((sum, alert) => {
    const created = new Date(alert.timestamp)
    const now = new Date()
    return sum + (now - created)
  }, 0)

  const avgMs = totalTime / resolvedAlerts.length
  const avgMins = Math.floor(avgMs / (1000 * 60))

  if (avgMins < 60) return `${avgMins}m`

  const avgHours = Math.floor(avgMins / 60)
  if (avgHours < 24) return `${avgHours}h`

  const avgDays = Math.floor(avgHours / 24)
  return `${avgDays}d`
}

export async function getStatusTransitionHistory(alertId) {
  try {
    const response = await fetch(`${API_BASE}/alert-status/${alertId}/history`)
    if (!response.ok) throw new Error(`Failed to fetch history: ${response.statusText}`)

    const result = await response.json()
    if (result.success) {
      return result.data.history
    }
    throw new Error(result.message || 'Unknown error')
  } catch (error) {
    console.error('Error fetching status history:', error)
    // Fallback to localStorage
    try {
      const history = JSON.parse(localStorage.getItem(`${STORAGE_KEY}-history-${alertId}`) || '[]')
      return history
    } catch {
      return []
    }
  }
}

export async function addStatusTransition(alertId, fromStatus, toStatus, notes = '') {
  // Transition is recorded automatically by setAlertStatus, but this maintains API compatibility
  try {
    const result = await setAlertStatus(alertId, toStatus, 'system')
    return result
  } catch (error) {
    console.error('Error adding status transition:', error)
    return false
  }
}

function calculateTransitionDuration(history) {
  if (history.length === 0) return 0

  const lastTransition = history[history.length - 1]
  const now = new Date()
  const last = new Date(lastTransition.timestamp)

  return Math.floor((now - last) / (1000 * 60)) // minutes
}

export async function getAllAlertStatuses() {
  try {
    const response = await fetch(`${API_BASE}/alert-statuses/all`)
    if (!response.ok) throw new Error(`Failed to fetch statuses: ${response.statusText}`)

    const result = await response.json()
    if (result.success) {
      return result.data
    }
    throw new Error(result.message || 'Unknown error')
  } catch (error) {
    console.error('Error fetching all statuses:', error)
    return {}
  }
}

export async function getAlertsByStatusServer(status) {
  try {
    const response = await fetch(`${API_BASE}/alert-statuses/by/${status}`)
    if (!response.ok) throw new Error(`Failed to fetch alerts: ${response.statusText}`)

    const result = await response.json()
    if (result.success) {
      return result.data.alertIds
    }
    throw new Error(result.message || 'Unknown error')
  } catch (error) {
    console.error('Error fetching alerts by status:', error)
    return []
  }
}

export async function getStatusMetricsServer() {
  try {
    const response = await fetch(`${API_BASE}/alert-statuses/metrics`)
    if (!response.ok) throw new Error(`Failed to fetch metrics: ${response.statusText}`)

    const result = await response.json()
    if (result.success) {
      return result.data
    }
    throw new Error(result.message || 'Unknown error')
  } catch (error) {
    console.error('Error fetching metrics:', error)
    return {}
  }
}

export async function bulkUpdateStatusServer(alertIds, status, userId = 'system') {
  try {
    const response = await fetch(`${API_BASE}/alert-statuses/bulk-update`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ alertIds, status, userId })
    })

    if (!response.ok) throw new Error(`Failed to bulk update: ${response.statusText}`)

    const result = await response.json()
    if (result.success) {
      // Clear cache for all updated alerts
      alertIds.forEach(id => statusCache.delete(id))
      return result.data
    }
    throw new Error(result.message || 'Unknown error')
  } catch (error) {
    console.error('Error bulk updating statuses:', error)
    return { success: false, error: error.message }
  }
}

export async function exportStatusDataServer() {
  try {
    const response = await fetch(`${API_BASE}/alert-statuses/export`)
    if (!response.ok) throw new Error(`Failed to export: ${response.statusText}`)

    const result = await response.json()
    if (result.success) {
      return result.data
    }
    throw new Error(result.message || 'Unknown error')
  } catch (error) {
    console.error('Error exporting data:', error)
    return null
  }
}

export async function initializeStatusCache() {
  try {
    const response = await fetch(`${API_BASE}/alert-statuses/all`)
    if (!response.ok) throw new Error(`Failed to initialize cache: ${response.statusText}`)

    const result = await response.json()
    if (result.success) {
      // Sync to localStorage for synchronous access during rendering
      localStorage.setItem(STORAGE_KEY, JSON.stringify(result.data))
      // Populate in-memory cache
      Object.entries(result.data).forEach(([alertId, status]) => {
        statusCache.set(alertId, { status, timestamp: Date.now() })
      })
      console.log(`✅ Status cache initialized with ${Object.keys(result.data).length} alerts`)
      return true
    }
    throw new Error(result.message || 'Unknown error')
  } catch (error) {
    console.error('Warning: Failed to initialize status cache from server:', error)
    // Silently fall back to localStorage data
    return false
  }
}
