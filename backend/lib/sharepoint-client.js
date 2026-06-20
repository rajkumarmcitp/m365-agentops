/**
 * SharePoint API Client for TenantGuard Data Storage
 * Handles all SharePoint CRUD operations for alerts, correlations, investigations
 */

import { Client } from '@microsoft/microsoft-graph-client'

// Graph client will be passed from server.js
let graphClient = null

export function initSharePointClient(client) {
  graphClient = client
  console.log('✅ SharePoint client initialized')
}

// Get IDs from environment (defer validation to when functions are called)
function getConfig() {
  return {
    siteId: process.env.SHAREPOINT_SITE_ID,
    alertsListId: process.env.SHAREPOINT_TENANTGUARD_ALERTS_LIST_ID,
    correlationsListId: process.env.SHAREPOINT_TENANTGUARD_CORRELATIONS_LIST_ID,
    investigationsListId: process.env.SHAREPOINT_TENANTGUARD_INVESTIGATIONS_LIST_ID
  }
}

/**
 * Get SharePoint Site ID
 */
function getSiteId() {
  const config = getConfig()
  if (!config.siteId) {
    throw new Error('SHAREPOINT_SITE_ID not configured in .env')
  }
  return config.siteId
}

/**
 * Get List ID by type
 */
function getListId(listType) {
  const config = getConfig()
  const listMap = {
    'alerts': config.alertsListId,
    'correlations': config.correlationsListId,
    'investigations': config.investigationsListId
  }

  const listId = listMap[listType]
  if (!listId) {
    throw new Error(`Unknown list type: ${listType}. Valid types: alerts, correlations, investigations`)
  }
  return listId
}

/**
 * Add an alert to SharePoint
 */
export async function addAlert(alert) {
  try {
    const siteId = getSiteId()
    const listId = getListId('alerts')
    if (!graphClient) throw new Error('SharePoint client not initialized. Call initSharePointClient() first.')

    const item = {
      fields: {
        AlertId: alert.id,
        Headline: alert.headline,
        Description: alert.description,
        Severity: alert.severity,
        Score: alert.score,
        Type: alert.type,
        Actor: alert.actor,
        RiskAssessment: JSON.stringify(alert.riskAssessment),
        Recommendations: JSON.stringify(alert.recommendations),
        Dismissed: alert.dismissed || false,
        CreatedTime: new Date().toISOString()
      }
    }

    const createdItem = await graphClient
      .api(`/sites/${siteId}/lists/${listId}/items`)
      .post(item)

    console.log(`✅ Alert added to SharePoint: ${alert.headline}`)
    return createdItem
  } catch (error) {
    console.error('❌ Failed to add alert:', error.message)
    throw error
  }
}

/**
 * Get all alerts from SharePoint
 */
export async function getAlerts(filters = {}) {
  try {
    const siteId = getSiteId()
    const listId = getListId('alerts')
    if (!graphClient) throw new Error('SharePoint client not initialized. Call initSharePointClient() first.')

    let filterQuery = ''
    if (filters.severity) {
      filterQuery = `Severity eq '${filters.severity}'`
    }
    if (filters.dismissed === false) {
      filterQuery += (filterQuery ? ' and ' : '') + 'Dismissed eq false'
    }

    const query = `/sites/${siteId}/lists/${listId}/items?$expand=fields`
    const alerts = await graphClient
      .api(filterQuery ? `${query}&$filter=${filterQuery}` : query)
      .get()

    return alerts.value.map(item => ({
      id: item.fields.AlertId,
      headline: item.fields.Headline,
      description: item.fields.Description,
      severity: item.fields.Severity,
      score: item.fields.Score,
      type: item.fields.Type,
      actor: item.fields.Actor,
      riskAssessment: JSON.parse(item.fields.RiskAssessment || '{}'),
      recommendations: JSON.parse(item.fields.Recommendations || '[]'),
      dismissed: item.fields.Dismissed,
      createdTime: item.fields.CreatedTime,
      sharePointId: item.id
    }))
  } catch (error) {
    console.error('❌ Failed to get alerts:', error.message)
    throw error
  }
}

/**
 * Get alert by ID
 */
export async function getAlertById(alertId) {
  try {
    const siteId = getSiteId()
    const listId = getListId('alerts')
    if (!graphClient) throw new Error('SharePoint client not initialized. Call initSharePointClient() first.')

    const alerts = await graphClient
      .api(`/sites/${siteId}/lists/${listId}/items?$filter=fields/AlertId eq '${alertId}'&$expand=fields`)
      .get()

    if (!alerts.value || alerts.value.length === 0) {
      throw new Error(`Alert ${alertId} not found`)
    }

    const item = alerts.value[0]
    return {
      id: item.fields.AlertId,
      headline: item.fields.Headline,
      description: item.fields.Description,
      severity: item.fields.Severity,
      score: item.fields.Score,
      type: item.fields.Type,
      actor: item.fields.Actor,
      riskAssessment: JSON.parse(item.fields.RiskAssessment || '{}'),
      recommendations: JSON.parse(item.fields.Recommendations || '[]'),
      dismissed: item.fields.Dismissed,
      createdTime: item.fields.CreatedTime,
      sharePointId: item.id
    }
  } catch (error) {
    console.error(`❌ Failed to get alert ${alertId}:`, error.message)
    throw error
  }
}

/**
 * Update alert (e.g., mark as dismissed)
 */
export async function updateAlert(alertId, updates) {
  try {
    const siteId = getSiteId()
    const listId = getListId('alerts')
    if (!graphClient) throw new Error('SharePoint client not initialized. Call initSharePointClient() first.')

    // Get the SharePoint item ID first
    const alerts = await graphClient
      .api(`/sites/${siteId}/lists/${listId}/items?$filter=fields/AlertId eq '${alertId}'&$expand=fields`)
      .get()

    if (!alerts.value || alerts.value.length === 0) {
      throw new Error(`Alert ${alertId} not found`)
    }

    const itemId = alerts.value[0].id
    const fields = {
      ...(updates.dismissed !== undefined && { Dismissed: updates.dismissed }),
      ...(updates.headline && { Headline: updates.headline }),
      ...(updates.description && { Description: updates.description })
    }

    await graphClient
      .api(`/sites/${siteId}/lists/${listId}/items/${itemId}`)
      .patch({ fields })

    console.log(`✅ Alert updated: ${alertId}`)
  } catch (error) {
    console.error('❌ Failed to update alert:', error.message)
    throw error
  }
}

/**
 * Get alert summary (counts by severity)
 */
export async function getAlertSummary() {
  try {
    const alerts = await getAlerts({ dismissed: false })

    const summary = {
      critical: alerts.filter(a => a.severity === 'CRITICAL').length,
      high: alerts.filter(a => a.severity === 'HIGH').length,
      medium: alerts.filter(a => a.severity === 'MEDIUM').length,
      info: alerts.filter(a => a.severity === 'INFO').length,
      total: alerts.length
    }

    return summary
  } catch (error) {
    console.error('❌ Failed to get alert summary:', error.message)
    throw error
  }
}

/**
 * Add correlation to SharePoint
 */
export async function addCorrelation(correlation) {
  try {
    const siteId = getSiteId()
    const listId = getListId('correlations')
    if (!graphClient) throw new Error('SharePoint client not initialized. Call initSharePointClient() first.')

    const item = {
      fields: {
        CorrelationId: correlation.id,
        Title: correlation.description,
        Description: correlation.description,
        AlertCount: correlation.alert_count,
        Severity: correlation.risk_level,
        ConfidenceScore: correlation.correlation_score,
        PatternType: correlation.pattern_type,
        RelatedAlerts: JSON.stringify(correlation.alert_ids)
      }
    }

    const createdItem = await graphClient
      .api(`/sites/${siteId}/lists/${listId}/items`)
      .post(item)

    console.log(`✅ Correlation added to SharePoint: ${correlation.description}`)
    return createdItem
  } catch (error) {
    console.error('❌ Failed to add correlation:', error.message)
    throw error
  }
}

/**
 * Get all correlations from SharePoint
 */
export async function getCorrelations() {
  try {
    const siteId = getSiteId()
    const listId = getListId('correlations')
    if (!graphClient) throw new Error('SharePoint client not initialized. Call initSharePointClient() first.')

    const correlations = await graphClient
      .api(`/sites/${siteId}/lists/${listId}/items?$expand=fields`)
      .get()

    return correlations.value.map(item => ({
      id: item.fields.CorrelationId,
      description: item.fields.Description,
      alert_count: item.fields.AlertCount,
      risk_level: item.fields.Severity,
      correlation_score: item.fields.ConfidenceScore,
      pattern_type: item.fields.PatternType,
      alert_ids: JSON.parse(item.fields.RelatedAlerts || '[]'),
      sharePointId: item.id
    }))
  } catch (error) {
    console.error('❌ Failed to get correlations:', error.message)
    throw error
  }
}

/**
 * Add investigation to SharePoint
 */
export async function addInvestigation(investigation) {
  try {
    const siteId = getSiteId()
    const listId = getListId('investigations')
    if (!graphClient) throw new Error('SharePoint client not initialized. Call initSharePointClient() first.')

    const item = {
      fields: {
        InvestigationId: investigation.id,
        Title: investigation.title,
        AlertId: investigation.alertId || '',
        Status: investigation.status || 'Open',
        Messages: JSON.stringify(investigation.messages || []),
        CreatedTime: new Date().toISOString()
      }
    }

    const createdItem = await graphClient
      .api(`/sites/${siteId}/lists/${listId}/items`)
      .post(item)

    console.log(`✅ Investigation added to SharePoint: ${investigation.title}`)
    return createdItem
  } catch (error) {
    console.error('❌ Failed to add investigation:', error.message)
    throw error
  }
}

/**
 * Get investigation by ID
 */
export async function getInvestigation(investigationId) {
  try {
    const siteId = getSiteId()
    const listId = getListId('investigations')
    if (!graphClient) throw new Error('SharePoint client not initialized. Call initSharePointClient() first.')

    const investigations = await graphClient
      .api(`/sites/${siteId}/lists/${listId}/items?$filter=fields/InvestigationId eq '${investigationId}'&$expand=fields`)
      .get()

    if (!investigations.value || investigations.value.length === 0) {
      throw new Error(`Investigation ${investigationId} not found`)
    }

    const item = investigations.value[0]
    return {
      id: item.fields.InvestigationId,
      title: item.fields.Title,
      alertId: item.fields.AlertId,
      status: item.fields.Status,
      messages: JSON.parse(item.fields.Messages || '[]'),
      createdTime: item.fields.CreatedTime,
      sharePointId: item.id
    }
  } catch (error) {
    console.error(`❌ Failed to get investigation ${investigationId}:`, error.message)
    throw error
  }
}

/**
 * Update investigation
 */
export async function updateInvestigation(investigationId, updates) {
  try {
    const siteId = getSiteId()
    const listId = getListId('investigations')
    if (!graphClient) throw new Error('SharePoint client not initialized. Call initSharePointClient() first.')

    // Get the SharePoint item ID first
    const investigations = await graphClient
      .api(`/sites/${siteId}/lists/${listId}/items?$filter=fields/InvestigationId eq '${investigationId}'&$expand=fields`)
      .get()

    if (!investigations.value || investigations.value.length === 0) {
      throw new Error(`Investigation ${investigationId} not found`)
    }

    const itemId = investigations.value[0].id
    const fields = {
      ...(updates.status && { Status: updates.status }),
      ...(updates.messages && { Messages: JSON.stringify(updates.messages) }),
      ...(updates.title && { Title: updates.title })
    }

    await graphClient
      .api(`/sites/${siteId}/lists/${listId}/items/${itemId}`)
      .patch({ fields })

    console.log(`✅ Investigation updated: ${investigationId}`)
  } catch (error) {
    console.error('❌ Failed to update investigation:', error.message)
    throw error
  }
}
