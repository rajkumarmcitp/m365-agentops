/**
 * TenantGuard SharePoint Sync
 * Stores alerts, correlations, and configuration drift to SharePoint Lists
 */

const SHAREPOINT_SITE_ID = process.env.SHAREPOINT_SITE_ID || 'b60085d7-b9c8-41a3-8789-bab376d0c84f'

/**
 * Store alert to SharePoint
 */
export async function storeAlertToSharePoint(graphClient, alert, listId) {
  if (!graphClient || !listId) {
    console.warn('⚠️ SharePoint not configured for alerts')
    return null
  }

  try {
    const item = {
      fields: {
        AlertID: alert.id,
        Title: alert.headline || alert.name || 'Alert',
        Severity: alert.severity || 'MEDIUM',
        Priority: alert.priority || 'P3',
        RiskScore: alert.riskScore || alert.score || 0,
        Category: alert.category || 'Security',
        Description: alert.description || '',
        Actor: alert.actor || 'System',
        Target: alert.target || 'N/A',
        Source: alert.source || 'Graph API',
        ActionTimestamp: alert.timestamp || alert.action_timestamp || new Date().toISOString(),
        AlertType: alert.type || 'AUDIT',
        RawEvent: JSON.stringify(alert.raw_event || {}),
        Dismissed: alert.dismissed || false,
      }
    }

    const response = await graphClient
      .api(`/sites/${SHAREPOINT_SITE_ID}/lists/${listId}/items`)
      .post(item)

    console.log(`✅ Alert stored in SharePoint: ${alert.id}`)
    return response
  } catch (error) {
    console.error(`❌ Failed to store alert in SharePoint: ${error.message}`)
    return null
  }
}

/**
 * Store correlation to SharePoint
 */
export async function storeCorrelationToSharePoint(graphClient, correlation, listId) {
  if (!graphClient || !listId) {
    console.warn('⚠️ SharePoint not configured for correlations')
    return null
  }

  try {
    const item = {
      fields: {
        Title: correlation.description || 'Correlation',
        CorrelationType: correlation.pattern_type || correlation.correlation_type || 'UNKNOWN',
        AlertIDs: correlation.alert_ids ? (Array.isArray(correlation.alert_ids) ? correlation.alert_ids.join(',') : correlation.alert_ids) : '',
        AlertCount: correlation.alert_count || 0,
        CorrelationScore: correlation.correlation_score || 0,
        RiskLevel: correlation.risk_level || 'MEDIUM',
        Description: correlation.description || '',
        Actor: correlation.actor || 'System',
        Target: correlation.target || 'N/A',
        StartTimestamp: correlation.start_timestamp || new Date().toISOString(),
        EndTimestamp: correlation.end_timestamp || new Date().toISOString(),
        Metadata: JSON.stringify(correlation.metadata || {}),
      }
    }

    const response = await graphClient
      .api(`/sites/${SHAREPOINT_SITE_ID}/lists/${listId}/items`)
      .post(item)

    console.log(`✅ Correlation stored in SharePoint`)
    return response
  } catch (error) {
    console.error(`❌ Failed to store correlation in SharePoint: ${error.message}`)
    return null
  }
}

/**
 * Store configuration drift baseline to SharePoint
 */
export async function storeDriftBaselineToSharePoint(graphClient, driftItems, listId) {
  if (!graphClient || !listId) {
    console.warn('⚠️ SharePoint not configured for drift baseline')
    return []
  }

  const results = []

  for (const item of driftItems) {
    try {
      const spItem = {
        fields: {
          Title: item.setting,
          ExpectedValue: item.expected,
          CurrentValue: item.current,
          DriftedStatus: item.drifted ? 'Yes' : 'No',
          LastDetected: item.since || new Date().toISOString(),
          Timestamp: new Date().toISOString(),
        }
      }

      const response = await graphClient
        .api(`/sites/${SHAREPOINT_SITE_ID}/lists/${listId}/items`)
        .post(spItem)

      results.push({ success: true, setting: item.setting })
      console.log(`✅ Drift item stored: ${item.setting}`)
    } catch (error) {
      results.push({ success: false, setting: item.setting, error: error.message })
      console.error(`❌ Failed to store drift item ${item.setting}: ${error.message}`)
    }
  }

  return results
}

/**
 * Batch store alerts and correlations
 */
export async function batchStoreTenantGuardData(graphClient, alerts, correlations, listIds) {
  const { alertsListId, correlationsListId } = listIds

  console.log(`📝 Batch storing ${alerts.length} alerts and ${correlations.length} correlations...`)

  const alertResults = []
  for (const alert of alerts) {
    const result = await storeAlertToSharePoint(graphClient, alert, alertsListId)
    if (result) alertResults.push(result)
  }

  const corrResults = []
  for (const correlation of correlations) {
    const result = await storeCorrelationToSharePoint(graphClient, correlation, correlationsListId)
    if (result) corrResults.push(result)
  }

  console.log(`✅ Batch store complete: ${alertResults.length} alerts, ${corrResults.length} correlations`)

  return {
    alertsStored: alertResults.length,
    correlationsStored: corrResults.length,
    timestamp: new Date().toISOString()
  }
}
