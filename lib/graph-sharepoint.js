/**
 * SharePoint Service Health List Management via Microsoft Graph API
 * Handles creation, reading, and updating of Service Health announcements
 */

const SHAREPOINT_CONFIG = {
  listDisplayName: 'Service Health Messages',
  listDescription: 'Service health announcements and incident tracking'
}

/**
 * Create Service Health List in SharePoint with all required columns
 * @param {string} siteId - SharePoint site ID
 * @returns {Promise<{listId: string, status: string}>}
 */
export async function createServiceHealthList(siteId) {
  try {
    // Create the list
    const listResponse = await fetch(
      `https://graph.microsoft.com/v1.0/sites/${siteId}/lists`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${await getAccessToken()}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          displayName: SHAREPOINT_CONFIG.listDisplayName,
          description: SHAREPOINT_CONFIG.listDescription,
          template: 'genericList'
        })
      }
    )

    if (!listResponse.ok) {
      throw new Error(`Failed to create list: ${listResponse.statusText}`)
    }

    const listData = await listResponse.json()
    const listId = listData.id

    // Add columns to the list
    await addServiceHealthColumns(siteId, listId)

    return {
      listId,
      status: 'created',
      message: `Service Health list created with ID: ${listId}`
    }
  } catch (error) {
    console.error('Error creating SharePoint list:', error)
    throw error
  }
}

/**
 * Add all required columns to the Service Health list
 * @param {string} siteId - SharePoint site ID
 * @param {string} listId - SharePoint list ID
 */
async function addServiceHealthColumns(siteId, listId) {
  const columns = [
    {
      name: 'Title',
      columnIndexed: true,
      text: { allowMultipleLines: false }
    },
    {
      name: 'Description',
      columnIndexed: false,
      text: { allowMultipleLines: true }
    },
    {
      name: 'Impact',
      columnIndexed: false,
      text: { allowMultipleLines: true }
    },
    {
      name: 'Service',
      columnIndexed: true,
      choice: {
        choices: [
          'Exchange Online',
          'Microsoft Teams',
          'SharePoint Online',
          'Microsoft Entra ID',
          'Microsoft 365',
          'OneDrive',
          'Outlook',
          'Power Platform',
          'Defender'
        ],
        allowTextEntry: false,
        displayAs: 'dropDownMenu'
      }
    },
    {
      name: 'Severity',
      columnIndexed: true,
      choice: {
        choices: ['High', 'Medium', 'Low'],
        allowTextEntry: false,
        displayAs: 'dropDownMenu'
      }
    },
    {
      name: 'Status',
      columnIndexed: true,
      choice: {
        choices: ['Active', 'Assigned', 'In Review', 'Resolved'],
        allowTextEntry: false,
        displayAs: 'dropDownMenu'
      }
    },
    {
      name: 'StartDate',
      columnIndexed: false,
      dateTime: { format: 'dateTime' }
    },
    {
      name: 'AssignedTo',
      columnIndexed: false,
      personOrGroup: {
        chooseFromType: 'peopleAndGroups',
        displayAs: 'person',
        allowMultipleSelection: false
      }
    },
    {
      name: 'ReviewStatus',
      columnIndexed: false,
      choice: {
        choices: ['Pending Review', 'Reviewed'],
        allowTextEntry: false,
        displayAs: 'dropDownMenu'
      }
    },
    {
      name: 'ReviewedBy',
      columnIndexed: false,
      personOrGroup: {
        chooseFromType: 'peopleAndGroups',
        displayAs: 'person',
        allowMultipleSelection: false
      }
    },
    {
      name: 'Deadline',
      columnIndexed: false,
      dateTime: { format: 'dateOnly' }
    },
    {
      name: 'Notes',
      columnIndexed: false,
      text: { allowMultipleLines: true }
    },
    {
      name: 'ResolvedDate',
      columnIndexed: false,
      dateTime: { format: 'dateTime' }
    },
    {
      name: 'MessageID',
      columnIndexed: true,
      text: { allowMultipleLines: false }
    }
  ]

  const token = await getAccessToken()

  for (const column of columns) {
    try {
      await fetch(
        `https://graph.microsoft.com/v1.0/sites/${siteId}/lists/${listId}/columns`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(column)
        }
      )
    } catch (error) {
      console.warn(`Warning: Could not create column ${column.name}:`, error)
    }
  }
}

/**
 * Get all Service Health messages from SharePoint list
 * @param {string} siteId - SharePoint site ID
 * @param {string} listId - SharePoint list ID
 * @returns {Promise<Array>} Array of message objects
 */
export async function getServiceHealthMessages(siteId, listId) {
  try {
    const response = await fetch(
      `https://graph.microsoft.com/v1.0/sites/${siteId}/lists/${listId}/items?expand=fields(select=id,Title,Description,Impact,Service,Severity,Status,StartDate,AssignedTo,ReviewStatus,ReviewedBy,Deadline,Notes,ResolvedDate,MessageID)&$top=999`,
      {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${await getAccessToken()}`,
          'Content-Type': 'application/json'
        }
      }
    )

    if (!response.ok) {
      throw new Error(`Failed to fetch messages: ${response.statusText}`)
    }

    const data = await response.json()
    const messages = data.value.map(item => ({
      id: item.id,
      ...item.fields
    }))

    return messages
  } catch (error) {
    console.error('Error fetching Service Health messages:', error)
    throw error
  }
}

/**
 * Create a new Service Health message in SharePoint
 * @param {string} siteId - SharePoint site ID
 * @param {string} listId - SharePoint list ID
 * @param {Object} message - Message object with fields
 * @returns {Promise<Object>} Created message with ID
 */
export async function createServiceHealthMessage(siteId, listId, message) {
  try {
    const response = await fetch(
      `https://graph.microsoft.com/v1.0/sites/${siteId}/lists/${listId}/items`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${await getAccessToken()}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          fields: {
            Title: message.title || '',
            Description: message.description || '',
            Impact: message.impact || '',
            Service: message.service || '',
            Severity: message.severity || 'Medium',
            Status: message.status || 'Active',
            StartDate: message.startDate || new Date().toISOString(),
            AssignedTo: message.assigned || null,
            ReviewStatus: message.reviewed ? 'Reviewed' : 'Pending Review',
            ReviewedBy: message.reviewedBy || null,
            Deadline: message.deadline || null,
            Notes: message.notes || '',
            ResolvedDate: message.resolvedDate || null,
            MessageID: message.messageId || generateMessageId()
          }
        })
      }
    )

    if (!response.ok) {
      throw new Error(`Failed to create message: ${response.statusText}`)
    }

    const data = await response.json()
    return {
      id: data.id,
      ...data.fields
    }
  } catch (error) {
    console.error('Error creating Service Health message:', error)
    throw error
  }
}

/**
 * Update an existing Service Health message
 * @param {string} siteId - SharePoint site ID
 * @param {string} listId - SharePoint list ID
 * @param {string} itemId - Item ID to update
 * @param {Object} updates - Fields to update
 * @returns {Promise<Object>} Updated message
 */
export async function updateServiceHealthMessage(siteId, listId, itemId, updates) {
  try {
    const fields = {
      Title: updates.title,
      Description: updates.description,
      Impact: updates.impact,
      Service: updates.service,
      Severity: updates.severity,
      Status: updates.status,
      StartDate: updates.startDate,
      AssignedTo: updates.assigned,
      ReviewStatus: updates.reviewed ? 'Reviewed' : 'Pending Review',
      ReviewedBy: updates.reviewedBy,
      Deadline: updates.deadline,
      Notes: updates.notes,
      ResolvedDate: updates.resolvedDate,
      MessageID: updates.messageId
    }

    // Remove undefined fields
    Object.keys(fields).forEach(key => fields[key] === undefined && delete fields[key])

    const response = await fetch(
      `https://graph.microsoft.com/v1.0/sites/${siteId}/lists/${listId}/items/${itemId}`,
      {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${await getAccessToken()}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ fields })
      }
    )

    if (!response.ok) {
      throw new Error(`Failed to update message: ${response.statusText}`)
    }

    const data = await response.json()
    return {
      id: data.id,
      ...data.fields
    }
  } catch (error) {
    console.error('Error updating Service Health message:', error)
    throw error
  }
}

/**
 * Delete a Service Health message
 * @param {string} siteId - SharePoint site ID
 * @param {string} listId - SharePoint list ID
 * @param {string} itemId - Item ID to delete
 * @returns {Promise<boolean>} Success status
 */
export async function deleteServiceHealthMessage(siteId, listId, itemId) {
  try {
    const response = await fetch(
      `https://graph.microsoft.com/v1.0/sites/${siteId}/lists/${listId}/items/${itemId}`,
      {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${await getAccessToken()}`
        }
      }
    )

    if (!response.ok) {
      throw new Error(`Failed to delete message: ${response.statusText}`)
    }

    return true
  } catch (error) {
    console.error('Error deleting Service Health message:', error)
    throw error
  }
}

/**
 * Get SharePoint site ID from domain
 * @param {string} siteDomain - SharePoint site domain (e.g., "contoso.sharepoint.com")
 * @param {string} siteName - SharePoint site name (e.g., "M365-AgentOps")
 * @returns {Promise<string>} Site ID
 */
export async function getSharePointSiteId(siteDomain, siteName) {
  try {
    const response = await fetch(
      `https://graph.microsoft.com/v1.0/sites/${siteDomain}:/sites/${siteName}`,
      {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${await getAccessToken()}`,
          'Content-Type': 'application/json'
        }
      }
    )

    if (!response.ok) {
      throw new Error(`SharePoint site not found: ${response.statusText}`)
    }

    const data = await response.json()
    return data.id
  } catch (error) {
    console.error('Error getting SharePoint site ID:', error)
    throw error
  }
}

/**
 * Find existing Service Health list in SharePoint site
 * @param {string} siteId - SharePoint site ID
 * @returns {Promise<string|null>} List ID if found, null otherwise
 */
export async function findServiceHealthList(siteId) {
  try {
    const response = await fetch(
      `https://graph.microsoft.com/v1.0/sites/${siteId}/lists?$filter=displayName eq '${SHAREPOINT_CONFIG.listDisplayName}'`,
      {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${await getAccessToken()}`,
          'Content-Type': 'application/json'
        }
      }
    )

    if (!response.ok) {
      throw new Error(`Failed to find list: ${response.statusText}`)
    }

    const data = await response.json()
    return data.value.length > 0 ? data.value[0].id : null
  } catch (error) {
    console.error('Error finding Service Health list:', error)
    return null
  }
}

/**
 * Get access token from current authentication session
 * @returns {Promise<string>} Access token
 */
async function getAccessToken() {
  // This will be implemented based on your authentication system
  // For now, it should retrieve the token from your auth context
  const token = sessionStorage.getItem('graphToken')
  if (!token) {
    throw new Error('No authentication token available')
  }
  return token
}

/**
 * Generate unique message ID
 * @returns {string} Message ID (e.g., "SH-20260628-001")
 */
function generateMessageId() {
  const date = new Date().toISOString().split('T')[0].replace(/-/g, '')
  const random = Math.floor(Math.random() * 1000)
    .toString()
    .padStart(3, '0')
  return `SH-${date}-${random}`
}

/**
 * Transform SharePoint list item to message object
 * @param {Object} item - SharePoint item
 * @returns {Object} Message object
 */
export function transformSharePointItem(item) {
  return {
    id: item.id,
    messageId: item.MessageID,
    title: item.Title,
    description: item.Description,
    impact: item.Impact,
    service: item.Service,
    severity: (item.Severity || 'Medium').toLowerCase(),
    status: (item.Status || 'Active').toLowerCase(),
    startDate: item.StartDate,
    assigned: item.AssignedTo?.displayName || null,
    assignedId: item.AssignedTo?.id || null,
    reviewStatus: item.ReviewStatus,
    reviewed: item.ReviewStatus === 'Reviewed',
    reviewedBy: item.ReviewedBy?.displayName || null,
    deadline: item.Deadline,
    notes: item.Notes,
    resolvedDate: item.ResolvedDate,
    lastModified: item.lastModifiedDateTime
  }
}
