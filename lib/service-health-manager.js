/**
 * Service Health Manager
 * Manages initialization and lifecycle of Service Health sync service
 */

import { state } from '../app.js'
import {
  initServiceHealthSync,
  stopServiceHealthSync,
  manualServiceHealthSync,
  getCachedMessages,
  filterMessages,
  getSyncStatusSummary,
  onSyncEvent
} from './service-health-sync.js'

let isInitialized = false

/**
 * Initialize Service Health sync service
 * Called on app startup if SharePoint is configured
 * @returns {Promise<boolean>} True if initialized successfully
 */
export async function initializeServiceHealth() {
  try {
    const settings = state.settings

    // Check if SharePoint is configured
    if (!settings.serviceHealthSiteId || !settings.serviceHealthListId) {
      console.log('[Service Health] Not configured - awaiting admin setup')
      return false
    }

    console.log('[Service Health] Initializing sync service...')

    // Initialize the sync service
    await initServiceHealthSync(
      settings.serviceHealthSiteId,
      settings.serviceHealthListId
    )

    isInitialized = true
    console.log('[Service Health] ✓ Sync service initialized and running')

    // Listen for sync events
    setupSyncEventListeners()

    return true
  } catch (error) {
    console.error('[Service Health] Initialization failed:', error)
    return false
  }
}

/**
 * Stop the Service Health sync service
 */
export function stopServiceHealth() {
  if (isInitialized) {
    stopServiceHealthSync()
    isInitialized = false
    console.log('[Service Health] Sync service stopped')
  }
}

/**
 * Manually trigger a sync (e.g., from Refresh button)
 * @returns {Promise<Object>} Sync result
 */
export async function refreshServiceHealth() {
  console.log('[Service Health] Manual refresh triggered')
  return manualServiceHealthSync()
}

/**
 * Get all Service Health messages
 * @returns {Array} Messages from cache
 */
export function getServiceHealthMessages() {
  return getCachedMessages()
}

/**
 * Get filtered Service Health messages
 * @param {Object} criteria - Filter criteria
 * @returns {Array} Filtered messages
 */
export function searchServiceHealthMessages(criteria) {
  return filterMessages(criteria)
}

/**
 * Get Service Health sync status
 * @returns {Object} Status summary
 */
export function getServiceHealthStatus() {
  return getSyncStatusSummary()
}

/**
 * Check if Service Health is initialized
 * @returns {boolean} True if initialized
 */
export function isServiceHealthInitialized() {
  return isInitialized
}

/**
 * Setup sync event listeners
 * Dispatches events to UI components
 */
function setupSyncEventListeners() {
  // Listen for successful sync
  onSyncEvent('serviceHealthSynced', (event) => {
    const { detail } = event
    console.log(
      `[Service Health] Synced ${detail.messageCount} messages in ${detail.duration}ms`
    )

    // Notify UI to refresh
    dispatchServiceHealthEvent('refreshed', {
      count: detail.messageCount,
      timestamp: detail.timestamp
    })
  })

  // Listen for sync errors
  onSyncEvent('serviceHealthSyncError', (event) => {
    const { detail } = event
    console.error(`[Service Health] Sync error:`, detail.error)

    // Notify UI of error
    dispatchServiceHealthEvent('syncError', {
      error: detail.error,
      timestamp: detail.timestamp
    })
  })
}

/**
 * Dispatch custom event for Service Health
 * @param {string} eventName - Event name
 * @param {Object} detail - Event detail
 */
function dispatchServiceHealthEvent(eventName, detail) {
  const event = new CustomEvent(`serviceHealth:${eventName}`, {
    detail,
    bubbles: true,
    cancelable: true
  })
  document.dispatchEvent(event)
}

/**
 * Listen for Service Health events
 * @param {string} eventName - Event name (without 'serviceHealth:' prefix)
 * @param {Function} handler - Handler function
 * @returns {Function} Unsubscribe function
 */
export function onServiceHealthEvent(eventName, handler) {
  const fullEventName = `serviceHealth:${eventName}`

  const listener = (event) => {
    handler(event.detail)
  }

  document.addEventListener(fullEventName, listener)

  // Return unsubscribe function
  return () => {
    document.removeEventListener(fullEventName, listener)
  }
}

/**
 * Re-initialize if configuration changes
 * Called when admin updates SharePoint settings
 * @returns {Promise<boolean>} True if re-initialized
 */
export async function reconfigureServiceHealth() {
  console.log('[Service Health] Reconfiguring due to settings change...')

  // Stop existing service
  stopServiceHealth()

  // Re-initialize with new settings
  return initializeServiceHealth()
}

/**
 * Export all messages to CSV
 * @returns {string} CSV content
 */
export function exportServiceHealthMessages() {
  const messages = getCachedMessages()

  if (messages.length === 0) {
    return 'No messages to export'
  }

  // CSV headers
  const headers = [
    'MessageID',
    'Title',
    'Service',
    'Severity',
    'Status',
    'StartDate',
    'AssignedTo',
    'ReviewedBy',
    'ResolvedDate'
  ]

  // CSV rows
  const rows = messages.map((msg) => [
    msg.messageId || '',
    `"${msg.title || ''}"`,
    msg.service || '',
    msg.severity || '',
    msg.status || '',
    msg.startDate || '',
    msg.assigned || '',
    msg.reviewedBy || '',
    msg.resolvedDate || ''
  ])

  // Combine headers and rows
  const csv = [
    headers.join(','),
    ...rows.map((row) => row.join(','))
  ].join('\n')

  return csv
}

/**
 * Get Service Health analytics
 * @returns {Object} Analytics summary
 */
export function getServiceHealthAnalytics() {
  const messages = getCachedMessages()

  const byService = {}
  const bySeverity = { high: 0, medium: 0, low: 0 }
  const byStatus = { active: 0, assigned: 0, reviewing: 0, resolved: 0 }

  messages.forEach((msg) => {
    // Count by service
    byService[msg.service] = (byService[msg.service] || 0) + 1

    // Count by severity
    if (msg.severity && bySeverity.hasOwnProperty(msg.severity.toLowerCase())) {
      bySeverity[msg.severity.toLowerCase()]++
    }

    // Count by status
    if (msg.status && byStatus.hasOwnProperty(msg.status.toLowerCase())) {
      byStatus[msg.status.toLowerCase()]++
    }
  })

  return {
    total: messages.length,
    byService,
    bySeverity,
    byStatus,
    resolvedCount: messages.filter((m) => m.status === 'resolved').length,
    activeCount: messages.filter((m) => m.status !== 'resolved').length
  }
}
