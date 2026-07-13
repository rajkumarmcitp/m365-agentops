/**
 * TenantGuard API Client
 * Handles all API calls to the alert backend
 */

export async function callTenantGuardAPI(endpoint, options = {}) {
  // Use Azure backend in production, localhost in development
  const isDev = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
  const baseUrl = isDev
    ? 'http://localhost:3000'
    : 'https://m365ops-api-gtbgezb9c7bgata7.centralus-01.azurewebsites.net'
  const url = `${baseUrl}/api/tenantguard${endpoint}`

  try {
    const response = await fetch(url, {
      method: options.method || 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...options.headers
      },
      body: options.body ? JSON.stringify(options.body) : undefined
    })

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`)
    }

    const data = await response.json()
    return data
  } catch (error) {
    console.error('TenantGuard API error:', error)
    throw error
  }
}

/**
 * Get alert summary (counts by severity)
 */
export async function getAlertSummary() {
  // First try to fetch real alerts and calculate summary
  try {
    const result = await callTenantGuardAPI('/fetch-real-alerts')
    if (result.success && result.data) {
      const summary = {
        critical: result.data.filter(a => a.severity === 'CRITICAL').length,
        high: result.data.filter(a => a.severity === 'HIGH').length,
        medium: result.data.filter(a => a.severity === 'MEDIUM').length,
        info: result.data.filter(a => a.severity === 'INFO').length
      }
      summary.total = result.data.length
      console.log('✅ Alert summary from real Graph API data')
      return summary
    }
  } catch (err) {
    console.log('⚠️ Could not calculate summary from real alerts:', err.message)
  }

  // Fall back to stored summary
  const result = await callTenantGuardAPI('/alerts/summary')
  return result.data
}

/**
 * Get all alerts with optional filtering
 */
export async function getAlerts(severity = 'all', limit = 50) {
  // First try to fetch real alerts from Graph API
  try {
    const result = await callTenantGuardAPI('/fetch-real-alerts')
    if (result.success && result.data && result.data.length > 0) {
      console.log('✅ Fetched real alerts from Graph API')
      // Apply severity filter if needed
      let filtered = result.data
      if (severity !== 'all') {
        filtered = filtered.filter(a => a.severity === severity)
      }
      return filtered.slice(0, limit)
    }
  } catch (err) {
    console.log('⚠️ Could not fetch real alerts, falling back to stored data:', err.message)
  }

  // Fall back to stored alerts from SharePoint/database
  let endpoint = `/alerts?limit=${limit}`
  if (severity !== 'all') {
    endpoint += `&severity=${severity}`
  }
  const result = await callTenantGuardAPI(endpoint)
  return result.data || []
}

/**
 * Get single alert details
 */
export async function getAlertDetails(alertId) {
  const result = await callTenantGuardAPI(`/alerts/${alertId}`)
  return result.data
}

/**
 * Dismiss an alert
 */
export async function dismissAlert(alertId, reason = '') {
  const result = await callTenantGuardAPI(`/alerts/${alertId}/dismiss`, {
    method: 'POST',
    body: { reason }
  })
  return result
}

/**
 * Get alert correlations
 */
export async function getCorrelations(severity = 'all') {
  let endpoint = '/correlations'
  if (severity !== 'all') {
    endpoint += `?severity=${severity}`
  }
  const result = await callTenantGuardAPI(endpoint)
  return result.data
}

/**
 * Get single correlation details
 */
export async function getCorrelationDetails(correlationId) {
  const result = await callTenantGuardAPI(`/correlations/${correlationId}`)
  return result.data
}

/**
 * Get detected attack patterns
 */
export async function getPatterns() {
  const result = await callTenantGuardAPI('/patterns')
  return result.data
}

/**
 * Start an investigation
 */
export async function startInvestigation(alertId = null, correlationId = null, title = null) {
  const result = await callTenantGuardAPI('/investigate', {
    method: 'POST',
    body: { alertId, correlationId, title }
  })
  return result.data
}

/**
 * Get investigation details
 */
export async function getInvestigation(investigationId) {
  const result = await callTenantGuardAPI(`/investigations/${investigationId}`)
  return result.data
}

/**
 * Send chat message in investigation
 */
export async function chatInvestigation(investigationId, message) {
  const result = await callTenantGuardAPI(`/investigations/${investigationId}/chat`, {
    method: 'POST',
    body: { message }
  })
  return result.data
}

/**
 * Generate investigation report
 */
export async function generateInvestigationReport(investigationId) {
  const result = await callTenantGuardAPI(`/investigations/${investigationId}/report`, {
    method: 'POST'
  })
  return result.data
}
