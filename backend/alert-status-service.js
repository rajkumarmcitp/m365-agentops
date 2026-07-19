/**
 * Alert Status Service
 * Handles persistence of alert statuses and investigation workflow tracking
 */

import fs from 'fs'
import { join } from 'path'
import { fileURLToPath } from 'url'
import { dirname } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const DATA_DIR = join(__dirname, '..', 'data', 'alert-statuses')
const STATUS_FILE = join(DATA_DIR, 'statuses.json')
const HISTORY_FILE = join(DATA_DIR, 'history.json')

// Ensure data directory exists
function ensureDataDir() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true })
  }
}

// Load statuses from file
function loadStatuses() {
  ensureDataDir()
  if (fs.existsSync(STATUS_FILE)) {
    try {
      const data = fs.readFileSync(STATUS_FILE, 'utf8')
      return JSON.parse(data)
    } catch (error) {
      console.error('Error loading statuses:', error)
      return {}
    }
  }
  return {}
}

// Load history from file
function loadHistory() {
  ensureDataDir()
  if (fs.existsSync(HISTORY_FILE)) {
    try {
      const data = fs.readFileSync(HISTORY_FILE, 'utf8')
      return JSON.parse(data)
    } catch (error) {
      console.error('Error loading history:', error)
      return {}
    }
  }
  return {}
}

// Save statuses to file
function saveStatuses(statuses) {
  ensureDataDir()
  try {
    fs.writeFileSync(STATUS_FILE, JSON.stringify(statuses, null, 2))
  } catch (error) {
    console.error('Error saving statuses:', error)
    throw error
  }
}

// Save history to file
function saveHistory(history) {
  ensureDataDir()
  try {
    fs.writeFileSync(HISTORY_FILE, JSON.stringify(history, null, 2))
  } catch (error) {
    console.error('Error saving history:', error)
    throw error
  }
}

/**
 * Get alert status
 */
export function getAlertStatus(alertId) {
  const statuses = loadStatuses()
  return statuses[alertId] || 'NEW'
}

/**
 * Set alert status with validation
 */
export function setAlertStatus(alertId, newStatus, userId = 'system') {
  const statuses = loadStatuses()
  const history = loadHistory()
  const oldStatus = statuses[alertId] || 'NEW'

  // Validate status
  const validStatuses = ['NEW', 'UNDER_INVESTIGATION', 'ACTION_TAKEN', 'RESOLVED', 'FALSE_POSITIVE']
  if (!validStatuses.includes(newStatus)) {
    throw new Error(`Invalid status: ${newStatus}`)
  }

  // Check if transition is valid
  if (!canTransitionTo(oldStatus, newStatus)) {
    throw new Error(`Cannot transition from ${oldStatus} to ${newStatus}`)
  }

  // Update status
  statuses[alertId] = newStatus
  saveStatuses(statuses)

  // Record history
  if (!history[alertId]) {
    history[alertId] = []
  }

  history[alertId].push({
    timestamp: new Date().toISOString(),
    from: oldStatus,
    to: newStatus,
    user: userId,
    duration: calculateDuration(alertId, oldStatus)
  })

  saveHistory(history)

  return {
    alertId,
    oldStatus,
    newStatus,
    timestamp: new Date().toISOString(),
    success: true
  }
}

/**
 * Check if transition is allowed
 */
function canTransitionTo(fromStatus, toStatus) {
  const validStatuses = ['NEW', 'UNDER_INVESTIGATION', 'ACTION_TAKEN', 'RESOLVED', 'FALSE_POSITIVE']
  const fromOrder = validStatuses.indexOf(fromStatus)
  const toOrder = validStatuses.indexOf(toStatus)

  // Allow forward transitions or FALSE_POSITIVE from any state
  return toOrder > fromOrder || toStatus === 'FALSE_POSITIVE'
}

/**
 * Calculate how long alert was in previous status
 */
function calculateDuration(alertId, status) {
  const history = loadHistory()
  if (!history[alertId] || history[alertId].length === 0) {
    return 0
  }

  const lastEntry = history[alertId][history[alertId].length - 1]
  const now = new Date()
  const entered = new Date(lastEntry.timestamp)

  return Math.floor((now - entered) / (1000 * 60)) // minutes
}

/**
 * Get full status history for alert
 */
export function getAlertStatusHistory(alertId) {
  const history = loadHistory()
  return history[alertId] || []
}

/**
 * Get all alert statuses
 */
export function getAllAlertStatuses() {
  return loadStatuses()
}

/**
 * Get alerts by status
 */
export function getAlertsByStatus(status) {
  const statuses = loadStatuses()
  return Object.keys(statuses).filter(alertId => statuses[alertId] === status)
}

/**
 * Get status metrics
 */
export function getStatusMetrics() {
  const statuses = loadStatuses()
  const metrics = {
    total: Object.keys(statuses).length,
    NEW: 0,
    UNDER_INVESTIGATION: 0,
    ACTION_TAKEN: 0,
    RESOLVED: 0,
    FALSE_POSITIVE: 0,
    average_time_to_resolution: 0
  }

  Object.values(statuses).forEach(status => {
    metrics[status] = (metrics[status] || 0) + 1
  })

  // Calculate average time to resolution
  const history = loadHistory()
  const resolutionTimes = []

  Object.values(history).forEach(alerts => {
    for (const entry of alerts) {
      if (entry.to === 'RESOLVED' && entry.duration > 0) {
        resolutionTimes.push(entry.duration)
      }
    }
  })

  if (resolutionTimes.length > 0) {
    metrics.average_time_to_resolution = Math.round(
      resolutionTimes.reduce((a, b) => a + b, 0) / resolutionTimes.length
    )
  }

  return metrics
}

/**
 * Bulk update statuses
 */
export function bulkUpdateStatus(alertIds, newStatus, userId = 'system') {
  const results = []
  const errors = []

  for (const alertId of alertIds) {
    try {
      results.push(setAlertStatus(alertId, newStatus, userId))
    } catch (error) {
      errors.push({
        alertId,
        error: error.message
      })
    }
  }

  return {
    success: errors.length === 0,
    updated: results.length,
    failed: errors.length,
    results,
    errors
  }
}

/**
 * Clear old history (keep last N entries per alert)
 */
export function pruneHistory(maxEntriesPerAlert = 100) {
  const history = loadHistory()

  Object.keys(history).forEach(alertId => {
    if (history[alertId].length > maxEntriesPerAlert) {
      history[alertId] = history[alertId].slice(-maxEntriesPerAlert)
    }
  })

  saveHistory(history)

  return {
    success: true,
    message: `Pruned history to ${maxEntriesPerAlert} entries per alert`
  }
}

/**
 * Export all data for backup/compliance
 */
export function exportAlertData() {
  return {
    timestamp: new Date().toISOString(),
    statuses: loadStatuses(),
    history: loadHistory(),
    metrics: getStatusMetrics()
  }
}

/**
 * Import data from backup
 */
export function importAlertData(data) {
  try {
    if (data.statuses) saveStatuses(data.statuses)
    if (data.history) saveHistory(data.history)

    return {
      success: true,
      message: 'Data imported successfully'
    }
  } catch (error) {
    throw new Error(`Import failed: ${error.message}`)
  }
}
