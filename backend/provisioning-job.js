/**
 * Provisioning Job - Monitors and processes approved self-service requests
 * Runs every 30 seconds to check for new approved requests
 */

import { getAllRequests, completeRequest, setSelfServiceGraphClient } from './self-service.js'
import { processApprovedRequest, setProvisioningGraphClient } from './provisioning-engine.js'

let graphClient = null
let jobRunning = false
const POLL_INTERVAL = 30000 // 30 seconds

export function setProvisioningJobGraphClient(client) {
  if (!client) {
    console.warn('⚠️  Graph Client is null in provisioning job')
    return
  }
  graphClient = client
  setSelfServiceGraphClient(client)
  setProvisioningGraphClient(client)
  console.log('✅ Provisioning job Graph Client initialized')
}

export function startProvisioningJob(siteId) {
  if (jobRunning) {
    console.log('⚠️  Provisioning job already running')
    return
  }

  jobRunning = true
  console.log('🚀 Starting provisioning job (checks every 30 seconds for approved requests)')

  // Run immediately, then every 30 seconds
  processApprovedRequests(siteId)
  setInterval(() => processApprovedRequests(siteId), POLL_INTERVAL)
}

export function stopProvisioningJob() {
  jobRunning = false
  console.log('⏹️  Provisioning job stopped')
}

async function processApprovedRequests(siteId) {
  try {
    if (!graphClient) {
      console.log('⏭️  Graph Client not available for provisioning')
      return
    }

    // Get all approved requests
    const result = await getAllRequests(siteId, { status: 'Approved' })

    if (!result.success || !result.data || result.data.length === 0) {
      return // No approved requests to process
    }

    console.log(`\n📋 Found ${result.data.length} approved request(s) to process`)

    for (const request of result.data) {
      await processRequest(siteId, request)
    }
  } catch (error) {
    console.error('❌ Error in provisioning job:', error.message)
  }
}

async function processRequest(siteId, request) {
  try {
    console.log(`\n🔄 Processing: ${request.requestId}`)

    // Extract form data
    let formData = {}
    if (request.formData && typeof request.formData === 'string') {
      try {
        formData = JSON.parse(request.formData)
      } catch (e) {
        formData = request.formData
      }
    } else if (request.formData) {
      formData = request.formData
    }

    // Log the data being sent
    console.log(`   Service: ${request.service}, Operation: ${request.operation}`)
    console.log(`   Form Data: ${JSON.stringify(formData)}`)

    // Call provisioning engine
    const result = await processApprovedRequest({
      requestId: request.requestId,
      service: request.service,
      operation: request.operation,
      formData: formData
    })

    if (result.success) {
      // Mark as completed in SharePoint
      await completeRequest(siteId, request.requestId, {
        status: 'completed',
        resultSummary: JSON.stringify(result.result),
        completedAt: new Date().toISOString()
      })

      console.log(`✅ Request ${request.requestId} completed and marked in SharePoint`)

      // TODO: Send completion email to requester
    } else {
      console.error(`❌ Request ${request.requestId} failed: ${result.error}`)

      // Update request with error (could create a "Processing Failed" status)
      // For now, log the error and keep it as Approved for manual retry
      // await updateRequestError(siteId, request.requestId, result.error)

      // TODO: Send failure email to requester and approver
    }
  } catch (error) {
    console.error(`❌ Error processing request ${request.requestId}:`, error.message)
  }
}
