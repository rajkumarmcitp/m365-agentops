/**
 * TenantGuard API Client
 * Handles all API calls to the alert backend
 * Enhanced with unified audit collection from multiple M365 sources
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
  try {
    let endpoint = `/alerts?limit=${limit}`
    if (severity !== 'all') {
      endpoint += `&severity=${severity}`
    }
    const result = await callTenantGuardAPI(endpoint)
    if (result.data && result.data.length > 0) {
      return result.data
    }
  } catch (err) {
    console.log('⚠️ Could not fetch from alerts endpoint:', err.message)
  }

  // Final fallback: use dashboard endpoint which has the working data
  try {
    console.log('📊 Falling back to dashboard endpoint for alerts...')
    const result = await callTenantGuardAPI('/dashboard')
    if (result.success && result.data && result.data.alerts) {
      let filtered = result.data.alerts
      if (severity !== 'all') {
        filtered = filtered.filter(a => a.severity === severity)
      }
      console.log(`✅ Fetched ${filtered.length} alerts from dashboard`)
      return filtered.slice(0, limit)
    }
  } catch (err) {
    console.log('⚠️ Dashboard fallback failed:', err.message)
  }

  return []
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

/**
 * ============================================================
 * Unified Audit Collection Endpoints (NEW)
 * ============================================================
 */

/**
 * Collect audit data from all Microsoft 365 sources
 * Sources:
 * 1. Microsoft Purview Audit Log (primary)
 * 2. Entra ID Audit Logs
 * 3. Microsoft Defender XDR
 * 4. Sign-in Logs
 * 5. Risky Users (Identity Protection)
 * 6. Intune Audit
 * 7. Exchange Online Audit
 * 8. SharePoint & OneDrive Audit
 */
export async function collectAllAuditData() {
  try {
    const result = await callTenantGuardAPI('/audit/collect-all', {
      method: 'POST'
    })
    console.log('✅ Unified audit collection completed:', result.summary)
    return result
  } catch (error) {
    console.error('❌ Audit collection failed:', error)
    throw error
  }
}

/**
 * Get audit source configuration and status
 */
export async function getAuditSources() {
  const result = await callTenantGuardAPI('/audit/sources')
  return result.data || []
}

/**
 * Get audit source summary
 */
export async function getAuditSourceSummary() {
  const result = await callTenantGuardAPI('/audit/sources')
  return result.summary || { enabled: 0, total: 0, coverage: '0%' }
}

/**
 * ============================================================
 * Autonomous Threat Investigation Agent Client Functions
 * ============================================================
 */

/**
 * Trigger autonomous investigation for an alert
 */
export async function triggerAutonomousInvestigation(alertId) {
  return callTenantGuardAPI(`/agent/investigate/${alertId}`, { method: 'POST' })
}

/**
 * Get list of all autonomous investigations
 */
export async function getAgentInvestigations() {
  return callTenantGuardAPI('/agent/investigations')
}

/**
 * Get single investigation with full reasoning chain and steps
 */
export async function getAgentInvestigation(id) {
  return callTenantGuardAPI(`/agent/investigations/${id}`)
}

/**
 * Get agent scheduler status
 */
export async function getAgentStatus() {
  return callTenantGuardAPI('/agent/status')
}

/**
 * Pause autonomous investigations
 */
export async function pauseAgent() {
  return callTenantGuardAPI('/agent/pause', { method: 'POST' })
}

/**
 * Resume autonomous investigations
 */
export async function resumeAgent() {
  return callTenantGuardAPI('/agent/resume', { method: 'POST' })
}

/**
 * ============================================================
 * Multi-Agent Orchestrator Client Functions
 * ============================================================
 */

/**
 * Helper function for orchestrator API calls (different base path)
 */
async function callOrchestratorAPI(endpoint, options = {}) {
  const isDev = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
  const baseUrl = isDev
    ? 'http://localhost:3000'
    : 'https://m365ops-api-gtbgezb9c7bgata7.centralus-01.azurewebsites.net'
  const url = `${baseUrl}/api/orchestrator${endpoint}`

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
    console.error('Orchestrator API error:', error)
    throw error
  }
}

/**
 * Get orchestrator status (agents, queue, events, conflicts)
 */
export async function getOrchestratorStatus() {
  return callOrchestratorAPI('/status')
}

/**
 * Get task queue
 */
export async function getOrchestratorTasks() {
  return callOrchestratorAPI('/tasks')
}

/**
 * Submit a new orchestrator task
 */
export async function submitOrchestratorTask(type, payload, priority = 'P2') {
  return callOrchestratorAPI('/task', {
    method: 'POST',
    body: { type, payload, priority }
  })
}

/**
 * Get recent event log
 */
export async function getOrchestratorEvents(limit = 50) {
  return callOrchestratorAPI(`/events?limit=${limit}`)
}

/**
 * Pause all agents
 */
export async function pauseAllAgents() {
  return callOrchestratorAPI('/pause-all', { method: 'POST' })
}

/**
 * Resume all agents
 */
export async function resumeAllAgents() {
  return callOrchestratorAPI('/resume-all', { method: 'POST' })
}

/**
 * Get conflict log
 */
export async function getOrchestratorConflicts() {
  return callOrchestratorAPI('/conflicts')
}
