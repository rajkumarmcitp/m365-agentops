/**
 * Alert Status Manager
 * Manages alert investigation status tracking and workflow
 */

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
    const statuses = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}')
    return statuses[alertId] || 'NEW'
  } catch {
    return 'NEW'
  }
}

export function setAlertStatus(alertId, newStatus) {
  try {
    const statuses = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}')

    // Validate status
    const validStatuses = Object.keys(STATUS_WORKFLOW)
    if (!validStatuses.includes(newStatus)) {
      console.error(`Invalid status: ${newStatus}`)
      return false
    }

    const oldStatus = statuses[alertId]
    statuses[alertId] = newStatus
    localStorage.setItem(STORAGE_KEY, JSON.stringify(statuses))

    console.log(`✅ Alert ${alertId}: ${oldStatus || 'NEW'} → ${newStatus}`)
    return true
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

export function getStatusTransitionHistory(alertId) {
  try {
    const history = JSON.parse(localStorage.getItem(`${STORAGE_KEY}-history-${alertId}`) || '[]')
    return history
  } catch {
    return []
  }
}

export function addStatusTransition(alertId, fromStatus, toStatus, notes = '') {
  try {
    const history = getStatusTransitionHistory(alertId)

    history.push({
      timestamp: new Date().toISOString(),
      from: fromStatus,
      to: toStatus,
      notes,
      duration: calculateTransitionDuration(history)
    })

    localStorage.setItem(`${STORAGE_KEY}-history-${alertId}`, JSON.stringify(history))
    return true
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
