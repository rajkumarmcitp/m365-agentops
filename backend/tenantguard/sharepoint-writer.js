/**
 * SharePoint Writer
 * Persists TenantGuard alerts, correlations, and investigations to SharePoint Lists
 */

import { Client } from '@microsoft/microsoft-graph-client'
import { ClientSecretCredential } from '@azure/identity'
import { TokenCredentialAuthenticationProvider } from '@microsoft/microsoft-graph-client/authProviders/azureTokenCredentials'

let graphClient = null
const SHAREPOINT_SITE_ID = process.env.SHAREPOINT_SITE_ID || 'b60085d7-b9c8-41a3-8789-bab376d0c84f'
const ALERTS_LIST_ID = process.env.SHAREPOINT_ALERTS_LIST_ID
const CORRELATIONS_LIST_ID = process.env.SHAREPOINT_CORRELATIONS_LIST_ID
const INVESTIGATIONS_LIST_ID = process.env.SHAREPOINT_INVESTIGATIONS_LIST_ID

/**
 * Initialize SharePoint client
 */
export async function initSharePointWriter() {
  try {
    const credential = new ClientSecretCredential(
      process.env.AZURE_TENANT_ID,
      process.env.AZURE_CLIENT_ID,
      process.env.AZURE_CLIENT_SECRET
    )

    const authProvider = new TokenCredentialAuthenticationProvider(credential, {
      scopes: ['https://graph.microsoft.com/.default']
    })

    graphClient = Client.initWithMiddleware({
      authProvider,
      defaultVersion: 'v1.0'
    })

    console.log('✅ SharePoint writer initialized')
    return graphClient
  } catch (error) {
    console.error('❌ Failed to initialize SharePoint writer:', error.message)
    throw error
  }
}

/**
 * Write alert to SharePoint List
 * @param {Object} alert - Alert object
 * @returns {Promise<Object>} Created list item
 */
export async function writeAlert(alert) {
  if (!ALERTS_LIST_ID) {
    console.warn('⚠️ SHAREPOINT_ALERTS_LIST_ID not configured, skipping write')
    return null
  }

  try {
    const item = {
      fields: {
        AlertID: alert.id,
        Priority: alert.priority,
        Severity: alert.severity,
        RiskScore: alert.riskScore,
        Category: alert.category,
        Description: alert.description,
        Actor: alert.actor,
        Target: alert.target,
        Source: alert.source,
        ActionTimestamp: alert.action_timestamp,
        AlertType: alert.name,
        RiskAssessment: JSON.stringify({}),
        Recommendations: JSON.stringify(alert.remediation || []),
        Dismissed: alert.dismissed || false,
        RawEvent: JSON.stringify(alert.raw_event || {})
      }
    }

    const response = await graphClient
      .api(`/sites/${SHAREPOINT_SITE_ID}/lists/${ALERTS_LIST_ID}/items`)
      .post(item)

    console.log(`✅ Alert written to SharePoint: ${alert.id}`)
    return response
  } catch (error) {
    console.error(`❌ Failed to write alert to SharePoint: ${error.message}`)
    throw error
  }
}

/**
 * Write correlation to SharePoint List
 * @param {Object} correlation - Correlation object
 * @returns {Promise<Object>} Created list item
 */
export async function writeCorrelation(correlation) {
  if (!CORRELATIONS_LIST_ID) {
    console.warn('⚠️ SHAREPOINT_CORRELATIONS_LIST_ID not configured, skipping write')
    return null
  }

  try {
    const item = {
      fields: {
        CorrelationID: correlation.id,
        CorrelationType: correlation.correlation_type,
        PatternType: correlation.pattern_type,
        AlertIDs: correlation.alert_ids.join(','),
        AlertCount: correlation.alert_count,
        Actor: correlation.actor,
        Target: correlation.target,
        StartTimestamp: correlation.start_timestamp,
        EndTimestamp: correlation.end_timestamp,
        CorrelationScore: correlation.correlation_score,
        RiskLevel: correlation.risk_level,
        Description: correlation.description,
        Metadata: JSON.stringify(correlation.metadata || {}),
        Dismissed: correlation.dismissed || false
      }
    }

    const response = await graphClient
      .api(`/sites/${SHAREPOINT_SITE_ID}/lists/${CORRELATIONS_LIST_ID}/items`)
      .post(item)

    console.log(`✅ Correlation written to SharePoint: ${correlation.id}`)
    return response
  } catch (error) {
    console.error(`❌ Failed to write correlation to SharePoint: ${error.message}`)
    throw error
  }
}

/**
 * Write investigation to SharePoint List
 * @param {Object} investigation - Investigation object
 * @returns {Promise<Object>} Created list item
 */
export async function writeInvestigation(investigation) {
  if (!INVESTIGATIONS_LIST_ID) {
    console.warn('⚠️ SHAREPOINT_INVESTIGATIONS_LIST_ID not configured, skipping write')
    return null
  }

  try {
    const item = {
      fields: {
        InvestigationID: investigation.id,
        InvestigationType: investigation.type,
        Status: investigation.status,
        Priority: investigation.priority,
        Severity: investigation.severity,
        RiskScore: investigation.riskScore,
        StartedBy: investigation.startedBy,
        StartedAt: investigation.startedAt,
        CompletedAt: investigation.completedAt,
        CorrelationIDs: investigation.correlationIds?.join(','),
        AlertIDs: investigation.alertIds?.join(','),
        InvestigationNotes: investigation.notes || '',
        AIAnalysis: investigation.aiAnalysis || '',
        Recommendations: JSON.stringify(investigation.recommendations || []),
        ReportGenerated: investigation.reportGenerated || false
      }
    }

    const response = await graphClient
      .api(`/sites/${SHAREPOINT_SITE_ID}/lists/${INVESTIGATIONS_LIST_ID}/items`)
      .post(item)

    console.log(`✅ Investigation written to SharePoint: ${investigation.id}`)
    return response
  } catch (error) {
    console.error(`❌ Failed to write investigation to SharePoint: ${error.message}`)
    throw error
  }
}

/**
 * Batch write alerts to SharePoint
 * @param {Array} alerts - Array of alert objects
 * @returns {Promise<Array>} Results
 */
export async function writeAlertsBatch(alerts = []) {
  console.log(`📝 Writing ${alerts.length} alerts to SharePoint...`)

  const results = []
  for (const alert of alerts) {
    try {
      const result = await writeAlert(alert)
      results.push({ success: true, alertId: alert.id, result })
    } catch (error) {
      results.push({ success: false, alertId: alert.id, error: error.message })
    }
  }

  const successCount = results.filter(r => r.success).length
  console.log(`✅ Successfully wrote ${successCount}/${alerts.length} alerts to SharePoint`)

  return results
}

/**
 * Batch write correlations to SharePoint
 * @param {Array} correlations - Array of correlation objects
 * @returns {Promise<Array>} Results
 */
export async function writeCorrelationsBatch(correlations = []) {
  console.log(`📝 Writing ${correlations.length} correlations to SharePoint...`)

  const results = []
  for (const correlation of correlations) {
    try {
      const result = await writeCorrelation(correlation)
      results.push({ success: true, correlationId: correlation.id, result })
    } catch (error) {
      results.push({ success: false, correlationId: correlation.id, error: error.message })
    }
  }

  const successCount = results.filter(r => r.success).length
  console.log(`✅ Successfully wrote ${successCount}/${correlations.length} correlations to SharePoint`)

  return results
}

/**
 * Check if alert already exists in SharePoint (by AlertID)
 * @param {string} alertId - Alert ID
 * @returns {Promise<boolean>}
 */
export async function alertExists(alertId) {
  if (!ALERTS_LIST_ID) return false

  try {
    const result = await graphClient
      .api(`/sites/${SHAREPOINT_SITE_ID}/lists/${ALERTS_LIST_ID}/items`)
      .filter(`fields/AlertID eq '${alertId}'`)
      .get()

    return result.value?.length > 0
  } catch (error) {
    console.warn(`⚠️ Error checking if alert exists: ${error.message}`)
    return false
  }
}

/**
 * Update alert in SharePoint
 * @param {string} itemId - SharePoint item ID
 * @param {Object} updates - Fields to update
 * @returns {Promise<Object>}
 */
export async function updateAlert(itemId, updates) {
  if (!ALERTS_LIST_ID) return null

  try {
    const item = {
      fields: updates
    }

    const response = await graphClient
      .api(`/sites/${SHAREPOINT_SITE_ID}/lists/${ALERTS_LIST_ID}/items/${itemId}`)
      .patch(item)

    console.log(`✅ Alert updated in SharePoint: ${itemId}`)
    return response
  } catch (error) {
    console.error(`❌ Failed to update alert: ${error.message}`)
    throw error
  }
}

/**
 * Get all alerts from SharePoint
 * @returns {Promise<Array>}
 */
export async function getAllAlerts() {
  if (!ALERTS_LIST_ID) return []

  try {
    const result = await graphClient
      .api(`/sites/${SHAREPOINT_SITE_ID}/lists/${ALERTS_LIST_ID}/items`)
      .expand('fields')
      .get()

    return result.value?.map(item => item.fields) || []
  } catch (error) {
    console.error(`❌ Failed to fetch alerts: ${error.message}`)
    return []
  }
}

export default {
  initSharePointWriter,
  writeAlert,
  writeCorrelation,
  writeInvestigation,
  writeAlertsBatch,
  writeCorrelationsBatch,
  alertExists,
  updateAlert,
  getAllAlerts
}
