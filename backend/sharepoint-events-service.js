/**
 * SharePoint Events Service
 * Logs all alert events to SharePoint list with 30-day auto-delete retention
 */

const TENANT_ID = process.env.AZURE_TENANT_ID
const CLIENT_ID = process.env.AZURE_CLIENT_ID
const CLIENT_SECRET = process.env.AZURE_CLIENT_SECRET
const SHAREPOINT_SITE_ID = process.env.SHAREPOINT_SITE_ID

const LIST_DISPLAY_NAME = 'Security Events'
const LIST_DESCRIPTION = 'Alert status changes and investigation events with 30-day retention'
const RETENTION_DAYS = 30

let accessToken = null
let tokenExpiry = null
let listId = null
let isInitialized = false

// Get access token using client credentials flow
async function getAccessToken() {
  try {
    // Return cached token if still valid
    if (accessToken && tokenExpiry && Date.now() < tokenExpiry - 60000) {
      return accessToken
    }

    const tokenUrl = `https://login.microsoftonline.com/${TENANT_ID}/oauth2/v2.0/token`

    const response = await fetch(tokenUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        grant_type: 'client_credentials',
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET,
        scope: 'https://graph.microsoft.com/.default'
      })
    })

    if (!response.ok) {
      throw new Error(`Failed to get token: ${response.statusText}`)
    }

    const data = await response.json()
    accessToken = data.access_token
    tokenExpiry = Date.now() + (data.expires_in * 1000)

    return accessToken
  } catch (error) {
    console.error('Error getting access token:', error)
    throw error
  }
}

// Make Graph API call
async function graphApiCall(method, endpoint, body = null) {
  const token = await getAccessToken()

  const options = {
    method,
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  }

  if (body) {
    options.body = JSON.stringify(body)
  }

  const response = await fetch(`https://graph.microsoft.com/v1.0${endpoint}`, options)

  if (!response.ok) {
    const errorText = await response.text()
    throw new Error(`Graph API error: ${response.status} - ${errorText}`)
  }

  return response.json()
}

// Get or create SharePoint events list
export async function initializeListIfNeeded() {
  try {
    if (isInitialized && listId) return listId

    if (!SHAREPOINT_SITE_ID || !TENANT_ID || !CLIENT_ID || !CLIENT_SECRET) {
      console.warn('⚠️ SharePoint configuration incomplete, skipping events list initialization')
      return null
    }

    // Extract site collection and site ID from SHAREPOINT_SITE_ID
    const parts = SHAREPOINT_SITE_ID.split(',')
    if (parts.length < 3) {
      console.warn('⚠️ Invalid SHAREPOINT_SITE_ID format, expected: hostname,mid,siteid')
      return null
    }

    const [hostname, , siteId] = parts

    // Get site ID first
    const siteResponse = await graphApiCall('GET', `/sites/${hostname}:/sites/root`)
    const actualSiteId = siteResponse.id

    // Check if list exists
    const listsResponse = await graphApiCall('GET', `/sites/${actualSiteId}/lists`)

    let existingList = listsResponse.value?.find(
      l => l.displayName === LIST_DISPLAY_NAME
    )

    if (existingList) {
      listId = existingList.id
      console.log(`✅ Found existing SharePoint list: ${LIST_DISPLAY_NAME} (${listId})`)
    } else {
      // Create new list
      listId = await createSecurityEventsList(actualSiteId)
      console.log(`✅ Created new SharePoint list: ${LIST_DISPLAY_NAME} (${listId})`)
    }

    isInitialized = true
    return listId
  } catch (error) {
    console.error('Error initializing SharePoint list:', error)
    // Don't throw - service should degrade gracefully
    return null
  }
}

// Create the security events list with columns
async function createSecurityEventsList(siteId) {
  try {
    const listPayload = {
      displayName: LIST_DISPLAY_NAME,
      description: LIST_DESCRIPTION,
      template: 'genericList'
    }

    const response = await graphApiCall('POST', `/sites/${siteId}/lists`, listPayload)
    const newListId = response.id

    // Add columns (fields) to the list
    const fields = [
      { displayName: 'AlertID', name: 'AlertID', fieldType: 'Text' },
      { displayName: 'EventType', name: 'EventType', fieldType: 'Text' },
      { displayName: 'PreviousStatus', name: 'PreviousStatus', fieldType: 'Text' },
      { displayName: 'NewStatus', name: 'NewStatus', fieldType: 'Text' },
      { displayName: 'ChangedBy', name: 'ChangedBy', fieldType: 'Text' },
      { displayName: 'EventDetails', name: 'EventDetails', fieldType: 'Text' },
      { displayName: 'Severity', name: 'Severity', fieldType: 'Text' },
      { displayName: 'EventTimestamp', name: 'EventTimestamp', fieldType: 'DateTime' }
    ]

    // Add each field
    for (const field of fields) {
      try {
        const fieldPayload = {
          displayName: field.displayName,
          name: field.name,
          text: { allowMultipleLines: field.fieldType === 'Text' }
        }
        await graphApiCall('POST', `/sites/${siteId}/lists/${newListId}/columns`, fieldPayload)
      } catch (error) {
        console.log(`  Note: Field ${field.displayName} may already exist`)
      }
    }

    return newListId
  } catch (error) {
    console.error('Error creating list:', error)
    throw error
  }
}

// Log event to SharePoint
export async function logEvent(eventData) {
  try {
    if (!SHAREPOINT_SITE_ID) {
      return null // Configuration not available, skip silently
    }

    if (!isInitialized || !listId) {
      await initializeListIfNeeded()
    }

    if (!listId) {
      return null // List initialization failed, skip silently
    }

    const parts = SHAREPOINT_SITE_ID.split(',')
    if (parts.length < 3) return null

    const [hostname, , siteId] = parts

    // Get site ID
    const siteResponse = await graphApiCall('GET', `/sites/${hostname}:/sites/root`)
    const actualSiteId = siteResponse.id

    const itemPayload = {
      fields: {
        AlertID: eventData.alertId || '',
        EventType: eventData.eventType || 'UNKNOWN',
        PreviousStatus: eventData.previousStatus || '',
        NewStatus: eventData.newStatus || '',
        ChangedBy: eventData.userId || 'system',
        EventDetails: eventData.details || '',
        Severity: eventData.severity || 'INFO',
        EventTimestamp: new Date().toISOString()
      }
    }

    const response = await graphApiCall(
      'POST',
      `/sites/${actualSiteId}/lists/${listId}/items`,
      itemPayload
    )

    console.log(`✅ Event logged to SharePoint: ${eventData.alertId} (${eventData.eventType})`)
    return response
  } catch (error) {
    console.error('Error logging event to SharePoint:', error)
    // Don't throw - log events are non-critical
    return null
  }
}

// Cleanup events older than 30 days
export async function cleanupOldEvents() {
  try {
    if (!SHAREPOINT_SITE_ID) {
      return { success: false, error: 'SharePoint not configured', deletedCount: 0 }
    }

    if (!isInitialized || !listId) {
      await initializeListIfNeeded()
    }

    if (!listId) {
      return { success: false, error: 'List not initialized', deletedCount: 0 }
    }

    const parts = SHAREPOINT_SITE_ID.split(',')
    if (parts.length < 3) {
      return { success: false, error: 'Invalid configuration', deletedCount: 0 }
    }

    const [hostname, , siteId] = parts

    // Get site ID
    const siteResponse = await graphApiCall('GET', `/sites/${hostname}:/sites/root`)
    const actualSiteId = siteResponse.id

    // Calculate date 30 days ago
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - RETENTION_DAYS)
    const cutoffDate = thirtyDaysAgo.toISOString().split('T')[0] // Date only

    // Query items older than 30 days
    const query = `fields/EventTimestamp lt '${cutoffDate}'`

    const response = await graphApiCall(
      'GET',
      `/sites/${actualSiteId}/lists/${listId}/items?$filter=${encodeURIComponent(query)}`
    )

    let deletedCount = 0

    // Delete each old item
    for (const item of response.value || []) {
      try {
        await graphApiCall('DELETE', `/sites/${actualSiteId}/lists/${listId}/items/${item.id}`)
        deletedCount++
      } catch (error) {
        console.error(`Error deleting item ${item.id}:`, error)
      }
    }

    console.log(`🧹 Cleaned up ${deletedCount} events older than ${RETENTION_DAYS} days`)
    return { success: true, deletedCount }
  } catch (error) {
    console.error('Error during cleanup:', error)
    return { success: false, error: error.message, deletedCount: 0 }
  }
}

// Get event summary statistics
export async function getEventStats() {
  try {
    if (!SHAREPOINT_SITE_ID) {
      return { totalEvents: 0, breakdown: {}, retentionDays: RETENTION_DAYS, configured: false }
    }

    if (!isInitialized || !listId) {
      await initializeListIfNeeded()
    }

    if (!listId) {
      return { totalEvents: 0, breakdown: {}, retentionDays: RETENTION_DAYS }
    }

    const parts = SHAREPOINT_SITE_ID.split(',')
    if (parts.length < 3) return { totalEvents: 0, breakdown: {}, retentionDays: RETENTION_DAYS }

    const [hostname, , siteId] = parts

    // Get site ID
    const siteResponse = await graphApiCall('GET', `/sites/${hostname}:/sites/root`)
    const actualSiteId = siteResponse.id

    const response = await graphApiCall(
      'GET',
      `/sites/${actualSiteId}/lists/${listId}/items?$select=fields`
    )

    const totalEvents = response.value?.length || 0

    const breakdown = {}
    response.value?.forEach(item => {
      const eventType = item.fields?.EventType || 'UNKNOWN'
      breakdown[eventType] = (breakdown[eventType] || 0) + 1
    })

    return {
      totalEvents,
      breakdown,
      retentionDays: RETENTION_DAYS,
      lastCleanup: new Date().toISOString()
    }
  } catch (error) {
    console.error('Error getting event stats:', error)
    return { totalEvents: 0, breakdown: {}, error: error.message }
  }
}

// Export events for compliance reporting
export async function exportEvents(days = 30) {
  try {
    if (!SHAREPOINT_SITE_ID) {
      return { exportDate: new Date().toISOString(), events: [], period: `${days} days`, eventCount: 0 }
    }

    if (!isInitialized || !listId) {
      await initializeListIfNeeded()
    }

    if (!listId) {
      return { exportDate: new Date().toISOString(), events: [], period: `${days} days`, eventCount: 0 }
    }

    const parts = SHAREPOINT_SITE_ID.split(',')
    if (parts.length < 3) {
      return { exportDate: new Date().toISOString(), events: [], period: `${days} days`, eventCount: 0 }
    }

    const [hostname, , siteId] = parts

    // Get site ID
    const siteResponse = await graphApiCall('GET', `/sites/${hostname}:/sites/root`)
    const actualSiteId = siteResponse.id

    // Calculate date range
    const startDate = new Date()
    startDate.setDate(startDate.getDate() - days)
    const startDateStr = startDate.toISOString().split('T')[0]

    // Query events from the last N days
    const query = `fields/EventTimestamp ge '${startDateStr}'`

    const response = await graphApiCall(
      'GET',
      `/sites/${actualSiteId}/lists/${listId}/items?$filter=${encodeURIComponent(query)}&$select=fields&$orderby=fields/EventTimestamp desc`
    )

    return {
      exportDate: new Date().toISOString(),
      period: `${days} days`,
      eventCount: response.value?.length || 0,
      events: (response.value || []).map(item => ({
        alertId: item.fields?.AlertID,
        eventType: item.fields?.EventType,
        previousStatus: item.fields?.PreviousStatus,
        newStatus: item.fields?.NewStatus,
        changedBy: item.fields?.ChangedBy,
        details: item.fields?.EventDetails,
        severity: item.fields?.Severity,
        timestamp: item.fields?.EventTimestamp
      }))
    }
  } catch (error) {
    console.error('Error exporting events:', error)
    return { exportDate: new Date().toISOString(), events: [], error: error.message, eventCount: 0 }
  }
}
