/**
 * Self Service Portal - SharePoint List Integration
 * Manages requests, approvals, and audit logs for self-service requests
 */

let graphClient = null

export function setSelfServiceGraphClient(client) {
  graphClient = client
}

// ============================================================
// SharePoint Lists Management
// ============================================================

export async function initializeSelfServiceLists(graphClientInstance, siteId) {
  if (!graphClientInstance) {
    console.log('⏭️  Graph Client not available for self-service setup')
    return
  }

  graphClient = graphClientInstance

  const lists = [
    {
      name: 'SelfServiceRequests',
      description: 'User submitted service requests',
      fields: [
        { displayName: 'Service', type: 'choice', choices: ['Exchange', 'Teams', 'SharePoint', 'M365 Groups', 'User Management', 'Other'] },
        { displayName: 'Operation', type: 'text' },
        { displayName: 'Status', type: 'choice', choices: ['Submitted', 'Approved', 'Rejected', 'Completed', 'Cancelled'] },
        { displayName: 'Priority', type: 'choice', choices: ['Low', 'Normal', 'High', 'Critical'] },
        { displayName: 'RequesterId', type: 'text' },
        { displayName: 'FormData', type: 'multiText' },
        { displayName: 'Description', type: 'text' },
        { displayName: 'CreatedDate', type: 'dateTime' },
        { displayName: 'ApprovedDate', type: 'dateTime' },
        { displayName: 'CompletedDate', type: 'dateTime' },
        { displayName: 'RejectionReason', type: 'text' }
      ]
    },
    {
      name: 'SelfServiceApprovals',
      description: 'Approval decisions and workflows',
      fields: [
        { displayName: 'RequestId', type: 'text' },
        { displayName: 'Status', type: 'choice', choices: ['Pending', 'Approved', 'Rejected'] },
        { displayName: 'ApprovalLevel', type: 'choice', choices: ['Manager', 'Admin', 'Executive'] },
        { displayName: 'ApprovedBy', type: 'text' },
        { displayName: 'ApprovedDate', type: 'dateTime' },
        { displayName: 'Notes', type: 'text' }
      ]
    },
    {
      name: 'SelfServiceAudit',
      description: 'Audit trail of all actions',
      fields: [
        { displayName: 'RequestId', type: 'text' },
        { displayName: 'Action', type: 'choice', choices: ['Submitted', 'Approved', 'Rejected', 'Completed', 'Commented', 'Delegated', 'Escalated'] },
        { displayName: 'PerformedBy', type: 'text' },
        { displayName: 'Timestamp', type: 'dateTime' },
        { displayName: 'Details', type: 'text' }
      ]
    }
  ]

  for (const list of lists) {
    try {
      const existing = await graphClient
        .api(`/sites/${siteId}/lists`)
        .filter(`displayName eq '${list.name}'`)
        .get()

      let listId
      if (existing.value.length === 0) {
        console.log(`📝 Creating SharePoint list: ${list.name}`)
        const newList = await graphClient.api(`/sites/${siteId}/lists`).post({
          displayName: list.name,
          description: list.description,
          template: 'genericList'
        })
        listId = newList.id
      } else {
        console.log(`✓ List exists: ${list.name}`)
        listId = existing.value[0].id
      }

      // Create fields
      if (list.fields) {
        for (const field of list.fields) {
          try {
            // Check if field exists
            const fieldsResponse = await graphClient
              .api(`/sites/${siteId}/lists/${listId}/columns`)
              .get()

            const existingField = fieldsResponse.value?.find(f => f.displayName === field.displayName)

            if (!existingField) {
              console.log(`  📌 Creating field: ${field.displayName}`)

              let fieldPayload = {
                displayName: field.displayName,
                name: field.displayName.replace(/\s+/g, '')  // Remove spaces for column name
              }

              if (field.type === 'choice') {
                fieldPayload.choice = {
                  choices: field.choices,
                  allowTextEntry: false,
                  displayAs: 'dropDownMenu'
                }
              } else if (field.type === 'multiText') {
                fieldPayload.text = { allowMultipleLines: true }
              } else if (field.type === 'text') {
                fieldPayload.text = {}
              } else if (field.type === 'dateTime') {
                fieldPayload.dateTime = { format: 'dateTime' }
              }

              console.log(`    Payload: ${JSON.stringify(fieldPayload)}`)
              const response = await graphClient
                .api(`/sites/${siteId}/lists/${listId}/columns`)
                .post(fieldPayload)
              console.log(`    ✓ Field created: ${field.displayName}`)
            } else if (field.displayName === 'FormData' && field.type === 'multiText') {
              // Special case: FormData field needs to be multi-line text, not single-line
              // Delete and recreate if it's the wrong type
              console.log(`  ⚠️  FormData field exists but needs type update, deleting...`)
              try {
                await graphClient
                  .api(`/sites/${siteId}/lists/${listId}/columns/${existingField.id}`)
                  .delete()
                console.log(`  ✓ Deleted old FormData field`)

                // Now create the new multi-line version
                const fieldPayload = {
                  displayName: 'FormData',
                  name: 'FormData',
                  text: { allowMultipleLines: true }
                }
                await graphClient
                  .api(`/sites/${siteId}/lists/${listId}/columns`)
                  .post(fieldPayload)
                console.log(`  ✓ Created new FormData field (multi-line)`)
              } catch (updateError) {
                console.warn(`  ⚠️  Could not update FormData field:`, updateError.message)
              }
            } else {
              console.log(`  ✓ Field exists: ${field.displayName}`)
            }
          } catch (fieldError) {
            console.error(`  ❌ ERROR creating field ${field.displayName}:`, fieldError.message)
            console.error(`    Full error:`, fieldError)
          }
        }
      }
    } catch (error) {
      console.warn(`⚠️  Could not set up list ${list.name}:`, error.message)
    }
  }

  console.log('✅ Self Service Portal lists and fields initialized')
}

// ============================================================
// Request Submission
// ============================================================

export async function submitRequest(siteId, requestData) {
  try {
    if (!graphClient) {
      throw new Error('Graph Client not initialized')
    }

    const {
      serviceId,
      operationId,
      formData,
      requesterId,
      description
    } = requestData

    // Generate request ID
    const requestId = `REQ-${Date.now()}-${Math.random().toString(36).substr(2, 5).toUpperCase()}`

    // Create list item in SelfServiceRequests
    const listResponse = await graphClient
      .api(`/sites/${siteId}/lists`)
      .filter(`displayName eq 'SelfServiceRequests'`)
      .get()

    if (!listResponse.value.length) {
      throw new Error('SelfServiceRequests list not found')
    }

    const listId = listResponse.value[0].id

    console.log('📝 Saving request to SharePoint with formData:', JSON.stringify(formData))

    const requestItem = {
      fields: {
        Title: requestId,
        Service: serviceId,
        Operation: operationId,
        FormData: JSON.stringify(formData),
        Status: 'Submitted',
        RequesterId: requesterId,
        CreatedDate: new Date().toISOString(),
        Description: description || ''
      }
    }

    console.log('📤 Request payload fields.FormData:', requestItem.fields.FormData)

    const result = await graphClient
      .api(`/sites/${siteId}/lists/${listId}/items`)
      .post(requestItem)

    console.log(`✓ Request submitted: ${requestId}`)

    // Create audit log
    await createAuditLog(siteId, requestId, 'Submitted', requesterId, {
      service: serviceId,
      operation: operationId
    })

    return {
      success: true,
      requestId: requestId,
      itemId: result.id,
      message: 'Request submitted successfully'
    }
  } catch (error) {
    console.error('❌ Error submitting request:', error.message)
    return {
      success: false,
      error: error.message
    }
  }
}

// ============================================================
// Request Retrieval
// ============================================================

export async function getRequest(siteId, requestId) {
  try {
    if (!graphClient) {
      throw new Error('Graph Client not initialized')
    }

    const listResponse = await graphClient
      .api(`/sites/${siteId}/lists`)
      .filter(`displayName eq 'SelfServiceRequests'`)
      .get()

    if (!listResponse.value.length) {
      throw new Error('SelfServiceRequests list not found')
    }

    const listId = listResponse.value[0].id

    // Fetch all items and filter in code (Title field may not be indexed)
    const items = await graphClient
      .api(`/sites/${siteId}/lists/${listId}/items`)
      .expand('fields')
      .select('id,fields')
      .get()

    const item = items.value.find(i => i.fields && i.fields.Title === requestId)

    if (!item) {
      return { success: false, error: 'Request not found' }
    }

    const fields = item.fields

    return {
      success: true,
      data: {
        id: item.id,
        requestId: fields.Title,
        service: fields.Service,
        operation: fields.Operation,
        formData: fields.FormData ? JSON.parse(fields.FormData) : {},
        status: fields.Status,
        requesterId: fields.RequesterId,
        createdDate: fields.CreatedDate,
        approvedBy: fields.ApprovedBy,
        approvedDate: fields.ApprovedDate,
        completedDate: fields.CompletedDate,
        rejectionReason: fields.RejectionReason || ''
      }
    }
  } catch (error) {
    console.error('❌ Error retrieving request:', error.message)
    return { success: false, error: error.message }
  }
}

// ============================================================
// User's Requests
// ============================================================

export async function getUserRequests(siteId, userEmail) {
  try {
    if (!graphClient) {
      throw new Error('Graph Client not initialized')
    }

    const listResponse = await graphClient
      .api(`/sites/${siteId}/lists`)
      .filter(`displayName eq 'SelfServiceRequests'`)
      .get()

    if (!listResponse.value.length) {
      throw new Error('SelfServiceRequests list not found')
    }

    const listId = listResponse.value[0].id

    // Fetch all items and filter in code (RequesterId field may not be indexed)
    const items = await graphClient
      .api(`/sites/${siteId}/lists/${listId}/items`)
      .expand('fields')
      .select('id,fields')
      .get()

    // Debug: log what we're filtering by
    console.log(`🔍 Looking for requests by user: "${userEmail}"`)

    const requests = items.value
      .filter(item => {
        if (!item.fields) return false
        const requesterId = item.fields.RequesterId || ''
        const matches = requesterId.toLowerCase() === userEmail.toLowerCase()
        if (matches) {
          console.log(`✅ Found request ${item.fields.Title} for ${requesterId}`)
        }
        return matches
      })
      .map(item => {
        let formData = {}
        try {
          formData = item.fields.FormData ? JSON.parse(item.fields.FormData) : {}
        } catch (e) {
          formData = {}
        }

        return {
          id: item.id,
          requestId: item.fields.Title,
          service: item.fields.Service,
          operation: item.fields.Operation,
          status: item.fields.Status,
          createdDate: item.fields.CreatedDate,
          approvedDate: item.fields.ApprovedDate,
          completedDate: item.fields.CompletedDate,
          description: item.fields.Description || '',
          formData: formData
        }
      })

    console.log(`📋 Retrieved ${requests.length} requests for ${userEmail}`)

    return {
      success: true,
      data: requests
    }
  } catch (error) {
    console.error('❌ Error retrieving user requests:', error.message)
    return { success: false, error: error.message, data: [] }
  }
}

// ============================================================
// Approve/Reject Request
// ============================================================

export async function approveRequest(siteId, requestId, approverId, comment) {
  try {
    if (!graphClient) {
      throw new Error('Graph Client not initialized')
    }

    const request = await getRequest(siteId, requestId)
    if (!request || !request.success) {
      throw new Error(request?.error || 'Request not found')
    }

    // Update request status
    const listResponse = await graphClient
      .api(`/sites/${siteId}/lists`)
      .filter(`displayName eq 'SelfServiceRequests'`)
      .get()

    if (!listResponse.value.length) {
      throw new Error('SelfServiceRequests list not found')
    }

    const listId = listResponse.value[0].id
    const itemId = request.data.id

    await graphClient
      .api(`/sites/${siteId}/lists/${listId}/items/${itemId}`)
      .patch({
        fields: {
          Status: 'Approved',
          ApprovedDate: new Date().toISOString()
        }
      })

    // Create approval record
    await createApprovalRecord(siteId, requestId, 'Admin', approverId, 'Approved', comment)

    // Create audit log
    await createAuditLog(siteId, requestId, 'Approved', approverId, {
      comment: comment
    })

    console.log(`✓ Request approved: ${requestId}`)

    return {
      success: true,
      message: 'Request approved successfully'
    }
  } catch (error) {
    console.error('❌ Error approving request:', error.message)
    return { success: false, error: error.message }
  }
}

export async function rejectRequest(siteId, requestId, rejectedBy, reason) {
  try {
    if (!graphClient) {
      throw new Error('Graph Client not initialized')
    }

    const request = await getRequest(siteId, requestId)
    if (!request || !request.success) {
      throw new Error(request?.error || 'Request not found')
    }

    // Update request status
    const listResponse = await graphClient
      .api(`/sites/${siteId}/lists`)
      .filter(`displayName eq 'SelfServiceRequests'`)
      .get()

    if (!listResponse.value.length) {
      throw new Error('SelfServiceRequests list not found')
    }

    const listId = listResponse.value[0].id
    const itemId = request.data.id

    await graphClient
      .api(`/sites/${siteId}/lists/${listId}/items/${itemId}`)
      .patch({
        fields: {
          Status: 'Rejected',
          RejectionReason: reason
        }
      })

    // Create approval record
    await createApprovalRecord(siteId, requestId, 'Admin', rejectedBy, 'Rejected', reason)

    // Create audit log
    await createAuditLog(siteId, requestId, 'Rejected', rejectedBy, {
      reason: reason
    })

    console.log(`✓ Request rejected: ${requestId}`)

    return {
      success: true,
      message: 'Request rejected successfully'
    }
  } catch (error) {
    console.error('❌ Error rejecting request:', error.message)
    return { success: false, error: error.message }
  }
}

// ============================================================
// Approval Record
// ============================================================

async function createApprovalRecord(siteId, requestId, approvalType, approverId, decision, comment) {
  try {
    const listResponse = await graphClient
      .api(`/sites/${siteId}/lists`)
      .filter(`displayName eq 'SelfServiceApprovals'`)
      .get()

    if (!listResponse.value.length) {
      console.warn('⚠️  SelfServiceApprovals list not found')
      return
    }

    const listId = listResponse.value[0].id

    await graphClient
      .api(`/sites/${siteId}/lists/${listId}/items`)
      .post({
        fields: {
          Title: `${requestId}-${approvalType}`,
          RequestId: requestId,
          ApprovalType: approvalType,
          ApproverId: approverId,
          Decision: decision,
          Comment: comment,
          DecidedDate: new Date().toISOString()
        }
      })
  } catch (error) {
    console.warn('⚠️  Could not create approval record:', error.message)
  }
}

// ============================================================
// Audit Log
// ============================================================

async function createAuditLog(siteId, requestId, action, actor, details) {
  try {
    const listResponse = await graphClient
      .api(`/sites/${siteId}/lists`)
      .filter(`displayName eq 'SelfServiceAudit'`)
      .get()

    if (!listResponse.value.length) {
      console.warn('⚠️  SelfServiceAudit list not found')
      return
    }

    const listId = listResponse.value[0].id

    await graphClient
      .api(`/sites/${siteId}/lists/${listId}/items`)
      .post({
        fields: {
          Title: `${requestId}-${action}`,
          RequestId: requestId,
          Action: action,
          Actor: actor,
          Timestamp: new Date().toISOString(),
          Details: JSON.stringify(details)
        }
      })
  } catch (error) {
    console.warn('⚠️  Could not create audit log:', error.message)
  }
}

// ============================================================
// Mark as Completed (for agent processing)
// ============================================================

export async function completeRequest(siteId, requestId, completionDetails) {
  try {
    if (!graphClient) {
      throw new Error('Graph Client not initialized')
    }

    const request = await getRequest(siteId, requestId)
    if (!request || !request.success) {
      throw new Error(request?.error || 'Request not found')
    }

    const listResponse = await graphClient
      .api(`/sites/${siteId}/lists`)
      .filter(`displayName eq 'SelfServiceRequests'`)
      .get()

    if (!listResponse.value.length) {
      throw new Error('SelfServiceRequests list not found')
    }

    const listId = listResponse.value[0].id
    const itemId = request.data.id

    // Update status to Completed
    try {
      await graphClient
        .api(`/sites/${siteId}/lists/${listId}/items/${itemId}`)
        .patch({ fields: { Status: 'Completed' } })
      console.log(`✓ Status updated to Completed: ${requestId}`)
    } catch (statusError) {
      console.error(`⚠️  Could not update Status: ${statusError.message}`)
      throw statusError
    }

    // Create audit log (non-blocking if it fails)
    try {
      await createAuditLog(siteId, requestId, 'Completed', 'Agent', completionDetails)
    } catch (auditError) {
      console.warn(`⚠️  Could not create audit log: ${auditError.message}`)
    }

    console.log(`✓ Request completed: ${requestId}`)

    return {
      success: true,
      message: 'Request marked as completed'
    }
  } catch (error) {
    console.error('❌ Error completing request:', error.message)
    return { success: false, error: error.message }
  }
}

// ============================================================
// Get All Requests (for admin dashboard)
// ============================================================

export async function getAllRequests(siteId, filters = {}) {
  try {
    if (!graphClient) {
      throw new Error('Graph Client not initialized')
    }

    const listResponse = await graphClient
      .api(`/sites/${siteId}/lists`)
      .filter(`displayName eq 'SelfServiceRequests'`)
      .get()

    if (!listResponse.value.length) {
      throw new Error('SelfServiceRequests list not found')
    }

    const listId = listResponse.value[0].id

    // Get all items (don't filter by Status/Service in API query - use client-side filtering)
    // SharePoint Choice columns are not indexed by default, causing filter errors
    const items = await graphClient
      .api(`/sites/${siteId}/lists/${listId}/items`)
      .expand('fields')
      .select('id,fields')
      .get()

    let requests = items.value
      .filter(item => item.fields) // Skip items without fields
      .map(item => {
        // Parse FormData JSON if it exists
        let formData = {}
        if (item.fields.FormData) {
          try {
            formData = JSON.parse(item.fields.FormData)
          } catch (e) {
            console.warn(`Warning: Could not parse FormData for ${item.fields.Title}:`, e.message)
          }
        }

        return {
          id: item.id,
          requestId: item.fields.Title || '',
          service: item.fields.Service || '',
          operation: item.fields.Operation || '',
          requesterId: item.fields.RequesterId || '',
          status: item.fields.Status || 'Submitted',
          formData: formData,
          createdDate: item.fields.CreatedDate,
          approvedDate: item.fields.ApprovedDate,
          completedDate: item.fields.CompletedDate
        }
      })

    // Apply filters on client side instead of in API query
    if (filters.status) {
      requests = requests.filter(r => r.status === filters.status)
    }
    if (filters.service) {
      requests = requests.filter(r => r.service === filters.service)
    }

    return {
      success: true,
      data: requests,
      count: requests.length,
      stats: {
        submitted: requests.filter(r => r.status === 'Submitted').length,
        approved: requests.filter(r => r.status === 'Approved').length,
        rejected: requests.filter(r => r.status === 'Rejected').length,
        completed: requests.filter(r => r.status === 'Completed').length
      }
    }
  } catch (error) {
    console.error('❌ Error retrieving all requests:', error.message)
    return { success: false, error: error.message, data: [], stats: {} }
  }
}
