/**
 * Microsoft Graph API Client for TenantGuard
 * Fetches security events, audit logs, and risk detections
 */

import { Client } from '@microsoft/microsoft-graph-client'
import { ClientSecretCredential } from '@azure/identity'
import { TokenCredentialAuthenticationProvider } from '@microsoft/microsoft-graph-client/authProviders/azureTokenCredentials'

const GRAPH_ENDPOINT = 'https://graph.microsoft.com/v1.0'
const AUDIT_LOG_RETENTION_DAYS = parseInt(process.env.GRAPH_AUDIT_LOG_DAYS || '7')
const REQUEST_TIMEOUT = 30000 // 30 seconds
const MAX_RETRIES = 3

let graphClient = null

/**
 * Initialize Graph API client with app credentials
 */
export async function initGraphClient() {
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

    console.log('✅ Graph API client initialized')
    return graphClient
  } catch (error) {
    console.error('❌ Failed to initialize Graph API client:', error.message)
    throw error
  }
}

/**
 * Get or create client
 */
function getClient() {
  if (!graphClient) {
    throw new Error('Graph API client not initialized. Call initGraphClient() first.')
  }
  return graphClient
}

/**
 * Fetch audit logs with retry logic
 * @param {Object} filters - Filter options
 * @param {number} days - Number of days to look back
 * @returns {Promise<Array>}
 */
export async function getAuditLogs(filters = {}, days = AUDIT_LOG_RETENTION_DAYS) {
  const client = getClient()
  const startDate = new Date()
  startDate.setDate(startDate.getDate() - days)
  const startDateStr = startDate.toISOString().split('T')[0]

  let query = `/auditLogs/directoryAudits?$filter=activityDateTime ge ${startDateStr}`

  // Add additional filters
  if (filters.activity) {
    query += ` and activity eq '${filters.activity}'`
  }
  if (filters.initiatedBy) {
    query += ` and initiatedBy/user/id eq '${filters.initiatedBy}'`
  }
  if (filters.targetResources) {
    query += ` and targetResources/any(t: t/id eq '${filters.targetResources}')`
  }

  query += '&$top=100'

  return retryRequest(async () => {
    const result = await client.api(query).get()
    return result.value || []
  })
}

/**
 * Fetch risk detections (identity protection)
 * @param {Object} filters - Filter options
 * @returns {Promise<Array>}
 */
export async function getRiskDetections(filters = {}) {
  const client = getClient()

  let query = '/identity/riskDetections?$top=100'

  if (filters.riskLevel) {
    query += `&$filter=riskLevel eq '${filters.riskLevel}'`
  }

  return retryRequest(async () => {
    const result = await client.api(query).get()
    return result.value || []
  })
}

/**
 * Fetch risky sign-ins
 * @returns {Promise<Array>}
 */
export async function getRiskySignIns() {
  const client = getClient()

  return retryRequest(async () => {
    const result = await client.api('/identity/signInRisks?$top=50').get()
    return result.value || []
  })
}

/**
 * Fetch risky users
 * @returns {Promise<Array>}
 */
export async function getRiskyUsers() {
  const client = getClient()

  return retryRequest(async () => {
    const result = await client.api('/identity/riskyUsers?$top=50').get()
    return result.value || []
  })
}

/**
 * Fetch security alerts
 * @returns {Promise<Array>}
 */
export async function getSecurityAlerts() {
  const client = getClient()

  return retryRequest(async () => {
    const result = await client.api('/security/alerts_v2?$top=50').get()
    return result.value || []
  })
}

/**
 * Fetch service principals (apps)
 * @param {Object} filters - Filter options
 * @returns {Promise<Array>}
 */
export async function getServicePrincipals(filters = {}) {
  const client = getClient()

  let query = '/servicePrincipals?$top=100'

  if (filters.displayName) {
    query += `&$filter=displayName eq '${filters.displayName}'`
  }

  return retryRequest(async () => {
    const result = await client.api(query).get()
    return result.value || []
  })
}

/**
 * Fetch applications (app registrations)
 * @returns {Promise<Array>}
 */
export async function getApplications() {
  const client = getClient()

  return retryRequest(async () => {
    const result = await client.api('/applications?$top=100').get()
    return result.value || []
  })
}

/**
 * Fetch OAuth2 permission grants (app consents)
 * @returns {Promise<Array>}
 */
export async function getOAuth2PermissionGrants() {
  const client = getClient()

  return retryRequest(async () => {
    const result = await client.api('/oauth2PermissionGrants?$top=100').get()
    return result.value || []
  })
}

/**
 * Fetch user details
 * @param {string} userId - User ID
 * @returns {Promise<Object>}
 */
export async function getUser(userId) {
  const client = getClient()

  return retryRequest(async () => {
    return client.api(`/users/${userId}`).get()
  })
}

/**
 * Fetch all users
 * @returns {Promise<Array>}
 */
export async function getUsers() {
  const client = getClient()

  return retryRequest(async () => {
    const result = await client.api('/users?$top=100').get()
    return result.value || []
  })
}

/**
 * Fetch conditional access policies
 * @returns {Promise<Array>}
 */
export async function getConditionalAccessPolicies() {
  const client = getClient()

  return retryRequest(async () => {
    const result = await client.api('/identity/conditionalAccess/policies?$top=100').get()
    return result.value || []
  })
}

/**
 * Retry logic with exponential backoff
 * @param {Function} fn - Async function to retry
 * @param {number} retries - Number of retries
 * @returns {Promise}
 */
async function retryRequest(fn, retries = MAX_RETRIES) {
  try {
    return await fn()
  } catch (error) {
    if (error.statusCode === 429) {
      // Throttled - wait and retry
      const retryAfter = parseInt(error.responseHeaders?.['retry-after'] || '5') * 1000
      console.warn(`⏱️ Rate limited. Waiting ${retryAfter}ms...`)
      await new Promise(resolve => setTimeout(resolve, retryAfter))
      return retryRequest(fn, retries - 1)
    }

    if (retries > 0 && (error.statusCode >= 500 || error.statusCode === 408)) {
      const delay = Math.pow(2, MAX_RETRIES - retries) * 1000
      console.warn(`🔄 Retrying after ${delay}ms... (${retries} retries left)`)
      await new Promise(resolve => setTimeout(resolve, delay))
      return retryRequest(fn, retries - 1)
    }

    throw error
  }
}

/**
 * Test Graph API connection
 * @returns {Promise<boolean>}
 */
export async function testConnection() {
  try {
    const client = getClient()
    const result = await client.api('/me').get()
    console.log('✅ Graph API connection test successful:', result.displayName)
    return true
  } catch (error) {
    console.error('❌ Graph API connection test failed:', error.message)
    return false
  }
}

export default {
  initGraphClient,
  getAuditLogs,
  getRiskDetections,
  getRiskySignIns,
  getRiskyUsers,
  getSecurityAlerts,
  getServicePrincipals,
  getApplications,
  getOAuth2PermissionGrants,
  getUser,
  getUsers,
  getConditionalAccessPolicies,
  testConnection
}
