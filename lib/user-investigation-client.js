/**
 * User Investigation API Client
 * Fetches comprehensive user activity data for security investigations
 *
 * Category 1: Actions Performed by the User
 * - Sign-in Activity
 * - Risk Detections
 * - Registered Devices
 * - Managed Devices (Intune)
 * - OAuth Permissions Granted
 * - Security Alerts
 *
 * Category 2: Actions Performed on User Account
 * - Account Changes (Directory Audit)
 */

const isDev = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
const API_BASE = isDev
  ? 'http://localhost:3000/api'
  : 'https://m365ops-api-gtbgezb9c7bgata7.centralus-01.azurewebsites.net/api'

export async function getUserList() {
  const response = await fetch(`${API_BASE}/tenantguard/users`)
  if (!response.ok) throw new Error(`Failed to fetch users: ${response.statusText}`)
  return response.json()
}

export async function getUserInvestigation(userId, startDate, endDate) {
  const params = new URLSearchParams()
  if (startDate) params.append('startDate', startDate)
  if (endDate) params.append('endDate', endDate)

  const url = `${API_BASE}/tenantguard/users/${userId}/investigation?${params.toString()}`
  const response = await fetch(url)
  if (!response.ok) throw new Error(`Failed to fetch investigation: ${response.statusText}`)
  return response.json()
}

// ===== CATEGORY 1: ACTIONS PERFORMED BY THE USER =====

export async function getSignInLogs(userId, userPrincipalName, startDate, endDate) {
  const params = new URLSearchParams()
  params.append('userPrincipalName', userPrincipalName)
  if (startDate) params.append('startDate', startDate)
  if (endDate) params.append('endDate', endDate)

  const url = `${API_BASE}/user-investigation/signin-logs?${params.toString()}`
  try {
    const response = await fetch(url)
    if (!response.ok) return { success: false, data: [] }
    return await response.json()
  } catch (error) {
    console.error('Failed to fetch sign-in logs:', error)
    return { success: false, data: [] }
  }
}

export async function getRiskDetections(userId, startDate, endDate) {
  const params = new URLSearchParams()
  params.append('userId', userId)
  if (startDate) params.append('startDate', startDate)
  if (endDate) params.append('endDate', endDate)

  const url = `${API_BASE}/user-investigation/risk-detections?${params.toString()}`
  try {
    const response = await fetch(url)
    if (!response.ok) return { success: false, data: [] }
    return await response.json()
  } catch (error) {
    console.error('Failed to fetch risk detections:', error)
    return { success: false, data: [] }
  }
}

export async function getRegisteredDevices(userId) {
  const params = new URLSearchParams()
  params.append('userId', userId)

  const url = `${API_BASE}/user-investigation/registered-devices?${params.toString()}`
  try {
    const response = await fetch(url)
    if (!response.ok) return { success: false, data: [] }
    return await response.json()
  } catch (error) {
    console.error('Failed to fetch registered devices:', error)
    return { success: false, data: [] }
  }
}

export async function getManagedDevices(userId, userPrincipalName) {
  const params = new URLSearchParams()
  params.append('userPrincipalName', userPrincipalName)

  const url = `${API_BASE}/user-investigation/managed-devices?${params.toString()}`
  try {
    const response = await fetch(url)
    if (!response.ok) return { success: false, data: [] }
    return await response.json()
  } catch (error) {
    console.error('Failed to fetch managed devices:', error)
    return { success: false, data: [] }
  }
}

export async function getOAuthConsent(userId) {
  const params = new URLSearchParams()
  params.append('userId', userId)

  const url = `${API_BASE}/user-investigation/oauth-consent?${params.toString()}`
  try {
    const response = await fetch(url)
    if (!response.ok) return { success: false, data: [] }
    return await response.json()
  } catch (error) {
    console.error('Failed to fetch OAuth consent:', error)
    return { success: false, data: [] }
  }
}

export async function getSecurityAlerts(userId, userPrincipalName, startDate, endDate) {
  const params = new URLSearchParams()
  params.append('userPrincipalName', userPrincipalName)
  if (startDate) params.append('startDate', startDate)
  if (endDate) params.append('endDate', endDate)

  const url = `${API_BASE}/user-investigation/security-alerts?${params.toString()}`
  try {
    const response = await fetch(url)
    if (!response.ok) return { success: false, data: [] }
    return await response.json()
  } catch (error) {
    console.error('Failed to fetch security alerts:', error)
    return { success: false, data: [] }
  }
}

// ===== CATEGORY 2: ACTIONS PERFORMED ON USER ACCOUNT =====

export async function getAccountChanges(userId, startDate, endDate) {
  const params = new URLSearchParams()
  params.append('userId', userId)
  if (startDate) params.append('startDate', startDate)
  if (endDate) params.append('endDate', endDate)

  const url = `${API_BASE}/user-investigation/account-changes?${params.toString()}`
  try {
    const response = await fetch(url)
    if (!response.ok) return { success: false, data: [] }
    return await response.json()
  } catch (error) {
    console.error('Failed to fetch account changes:', error)
    return { success: false, data: [] }
  }
}
