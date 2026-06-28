/**
 * Service Health Messages Sync Service
 * Handles hourly synchronization with SharePoint and manages data refresh
 *
 * Sync Flow:
 * 1. Frontend calls this sync service
 * 2. Sync service calls backend API (/api/servicehealth/messages)
 * 3. Backend uses Graph API to fetch from real SharePoint
 * 4. Backend returns transformed messages
 * 5. Frontend caches locally for fast filtering
 * 6. UI updates when sync completes
 */

let syncState = {
  isRunning: false,
  lastSyncTime: null,
  nextSyncTime: null,
  syncInterval: null,
  messages: [],
  error: null,
  isManualSync: false
}

/**
 * Initialize the sync service
 * @param {string} siteId - SharePoint site ID
 * @param {string} listId - SharePoint list ID
 * @returns {Promise<void>}
 */
export async function initServiceHealthSync(siteId, listId) {
  if (!siteId || !listId) {
    console.warn('Service Health sync: Missing siteId or listId')
    return
  }

  syncState.siteId = siteId
  syncState.listId = listId

  // Initial sync
  await performSync()

  // Start hourly sync
  startHourlySync()
}

/**
 * Start the hourly sync interval
 */
function startHourlySync() {
  if (syncState.isRunning) {
    console.log('Service Health sync already running')
    return
  }

  syncState.isRunning = true

  // Sync every 60 minutes (3600000 ms)
  syncState.syncInterval = setInterval(async () => {
    console.log('[Service Health Sync] Running scheduled sync...')
    await performSync()
  }, 60 * 60 * 1000)

  console.log('[Service Health Sync] Service started. Next sync in 60 minutes.')
}

/**
 * Stop the hourly sync interval
 */
export function stopServiceHealthSync() {
  if (syncState.syncInterval) {
    clearInterval(syncState.syncInterval)
    syncState.syncInterval = null
    syncState.isRunning = false
    console.log('[Service Health Sync] Service stopped.')
  }
}

/**
 * Perform a sync from SharePoint with pagination support
 * @returns {Promise<Object>} Sync result with status
 */
async function performSync() {
  const startTime = Date.now()
  syncState.isManualSync = false

  try {
    if (!syncState.siteId || !syncState.listId) {
      throw new Error('Site ID or List ID not configured')
    }

    console.log(`[Service Health Sync] Fetching messages from backend API...`)

    // Fetch all pages of messages (pagination)
    const allMessages = []
    let pageNumber = 0
    let hasMore = true

    while (hasMore) {
      const skip = pageNumber * 100
      const url = `${getApiUrl()}/servicehealth/messages?siteId=${encodeURIComponent(syncState.siteId)}&listId=${encodeURIComponent(syncState.listId)}&skip=${skip}&top=100`

      const response = await fetch(url)

      if (!response.ok) {
        throw new Error(`API error: ${response.status} ${response.statusText}`)
      }

      const result = await response.json()

      if (!result.success || !result.messages) {
        throw new Error(result.error || 'Failed to fetch messages')
      }

      // Transform messages to app format
      const transformed = result.messages.map(msg => ({
        id: msg.id,
        messageId: msg.messageId,
        title: msg.title,
        description: msg.description,
        impact: msg.impact,
        service: msg.service,
        severity: (msg.severity || 'medium').toLowerCase(),
        status: (msg.status || 'active').toLowerCase(),
        startDate: msg.startDate,
        assigned: msg.assigned,
        assignedId: msg.assignedId,
        reviewStatus: msg.reviewStatus,
        reviewed: msg.reviewed,
        reviewedBy: msg.reviewedBy,
        deadline: msg.deadline,
        notes: msg.notes,
        resolvedDate: msg.resolvedDate,
        lastModified: msg.lastModified,
        source: result.source
      }))

      allMessages.push(...transformed)

      hasMore = result.hasMore && result.messages.length > 0
      pageNumber++

      if (pageNumber > 1) {
        console.log(`[Service Health Sync] Fetched page ${pageNumber}: ${result.messages.length} messages`)
      }
    }

    // Update cache with all messages
    syncState.messages = allMessages

    syncState.lastSyncTime = new Date()
    syncState.nextSyncTime = new Date(Date.now() + 60 * 60 * 1000)
    syncState.error = null

    const duration = Date.now() - startTime

    console.log(
      `[Service Health Sync] ✓ Successfully synced ${syncState.messages.length} messages in ${duration}ms`
    )

    // Notify listeners of sync completion
    dispatchSyncEvent('serviceHealthSynced', {
      messageCount: syncState.messages.length,
      duration,
      timestamp: syncState.lastSyncTime,
      pages: pageNumber
    })

    return {
      success: true,
      messageCount: syncState.messages.length,
      duration,
      timestamp: syncState.lastSyncTime,
      pages: pageNumber
    }
  } catch (error) {
    syncState.error = error.message
    console.error('[Service Health Sync] ✗ Sync failed:', error)

    dispatchSyncEvent('serviceHealthSyncError', {
      error: error.message,
      timestamp: new Date()
    })

    return {
      success: false,
      error: error.message,
      timestamp: new Date()
    }
  }
}

/**
 * Get API base URL
 * @returns {string} API URL
 */
function getApiUrl() {
  // Get from environment variable (Vite)
  const envUrl = import.meta.env.VITE_API_URL
  if (envUrl) {
    return envUrl
  }

  // Default to localhost:3001 for development
  return 'http://localhost:3001/api'
}

/**
 * Manually trigger a sync (e.g., from Refresh button)
 * @returns {Promise<Object>} Sync result
 */
export async function manualServiceHealthSync() {
  syncState.isManualSync = true
  console.log('[Service Health Sync] Manual refresh triggered')
  return performSync()
}

/**
 * Get current sync state
 * @returns {Object} Current state
 */
export function getSyncState() {
  return {
    isRunning: syncState.isRunning,
    messages: syncState.messages,
    lastSyncTime: syncState.lastSyncTime,
    nextSyncTime: syncState.nextSyncTime,
    error: syncState.error,
    messageCount: syncState.messages.length
  }
}

/**
 * Get all cached messages
 * @returns {Array} Messages
 */
export function getCachedMessages() {
  return [...syncState.messages]
}

/**
 * Get single message by ID
 * @param {string} messageId - Message ID
 * @returns {Object|null} Message or null
 */
export function getMessageById(messageId) {
  return syncState.messages.find(m => m.id === messageId || m.messageId === messageId) || null
}

/**
 * Update local message cache
 * Useful when message is updated via API
 * @param {string} messageId - Message ID
 * @param {Object} updates - Fields to update
 */
export function updateLocalMessage(messageId, updates) {
  const idx = syncState.messages.findIndex(m => m.id === messageId || m.messageId === messageId)
  if (idx !== -1) {
    syncState.messages[idx] = {
      ...syncState.messages[idx],
      ...updates,
      lastModified: new Date().toISOString()
    }
  }
}

/**
 * Add message to local cache
 * @param {Object} message - New message
 */
export function addLocalMessage(message) {
  syncState.messages.unshift(message)
}

/**
 * Remove message from local cache
 * @param {string} messageId - Message ID
 */
export function removeLocalMessage(messageId) {
  syncState.messages = syncState.messages.filter(
    m => m.id !== messageId && m.messageId !== messageId
  )
}

/**
 * Dispatch custom event for sync status
 * Used to notify UI of sync changes
 * @param {string} eventName - Event name
 * @param {Object} detail - Event detail
 */
function dispatchSyncEvent(eventName, detail) {
  const event = new CustomEvent(eventName, {
    detail,
    bubbles: true,
    cancelable: true
  })
  document.dispatchEvent(event)
}

/**
 * Listen for sync events
 * @param {string} eventName - Event name
 * @param {Function} handler - Handler function
 */
export function onSyncEvent(eventName, handler) {
  document.addEventListener(eventName, handler)

  // Return unsubscribe function
  return () => {
    document.removeEventListener(eventName, handler)
  }
}

/**
 * Filter messages by criteria
 * @param {Object} criteria - Filter criteria
 * @returns {Array} Filtered messages
 */
export function filterMessages(criteria) {
  let filtered = [...syncState.messages]

  if (criteria.service && criteria.service !== 'All') {
    filtered = filtered.filter(m => m.service === criteria.service)
  }

  if (criteria.severity && criteria.severity !== 'All') {
    filtered = filtered.filter(m => m.severity === criteria.severity.toLowerCase())
  }

  if (criteria.status && criteria.status !== 'All') {
    if (criteria.status === 'active') {
      filtered = filtered.filter(m => m.status !== 'resolved')
    } else if (criteria.status === 'assigned') {
      filtered = filtered.filter(m => m.assigned)
    } else if (criteria.status === 'reviewing') {
      filtered = filtered.filter(m => m.reviewed)
    } else if (criteria.status === 'resolved') {
      filtered = filtered.filter(m => m.status === 'resolved')
    }
  }

  if (criteria.search) {
    const query = criteria.search.toLowerCase()
    filtered = filtered.filter(
      m =>
        m.title.toLowerCase().includes(query) ||
        m.messageId.toLowerCase().includes(query) ||
        m.description?.toLowerCase().includes(query)
    )
  }

  return filtered
}

/**
 * Get sync status summary for UI
 * @returns {Object} Status summary
 */
export function getSyncStatusSummary() {
  const state = getSyncState()
  return {
    isRunning: state.isRunning,
    messageCount: state.messageCount,
    lastSync: state.lastSyncTime
      ? state.lastSyncTime.toLocaleTimeString()
      : 'Never',
    nextSync: state.nextSyncTime
      ? state.nextSyncTime.toLocaleTimeString()
      : 'Not scheduled',
    error: state.error,
    isSynced: state.lastSyncTime !== null
  }
}

/**
 * Get time until next sync in readable format
 * @returns {string} Time string (e.g., "45 minutes")
 */
export function getTimeUntilNextSync() {
  if (!syncState.nextSyncTime) return 'Not scheduled'

  const msUntil = syncState.nextSyncTime - Date.now()
  const mins = Math.floor(msUntil / 60000)
  const secs = Math.floor((msUntil % 60000) / 1000)

  if (mins === 0) return `${secs}s`
  if (mins < 60) return `${mins}m ${secs}s`
  const hours = Math.floor(mins / 60)
  return `${hours}h ${mins % 60}m`
}
