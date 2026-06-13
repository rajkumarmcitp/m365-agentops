// M365 AgentOps Backend API Client
// Handles all communication with the Node.js backend

// Use localhost for development, Azure for production
const isDev = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
export const api = isDev
  ? 'http://localhost:3000/api'
  : 'https://m365ops-api-gtbgezb9c7bgata7.centralus-01.azurewebsites.net/api'
const API_BASE = api

export async function callAPI(endpoint) {
  try {
    const url = `${API_BASE}${endpoint}`
    console.log(`🔄 Calling: ${url}`)

    const response = await fetch(url, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include'
    })

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`)
    }

    const data = await response.json()
    console.log(`✓ ${endpoint}:`, data)
    return data
  } catch (error) {
    console.error(`✗ API error on ${endpoint}:`, error.message)
    return {
      success: false,
      error: error.message,
      data: [],
      count: 0
    }
  }
}

// ============================================================
// Device Management (Intune)
// ============================================================
export async function getDevices() {
  return callAPI('/devices')
}

export async function getDeviceCompliancePolicies() {
  return callAPI('/device-compliance-policies')
}

// ============================================================
// Configuration & Compliance
// ============================================================
export async function getCISControls() {
  return callAPI('/config/cis-controls')
}

// ============================================================
// Message Center & Service Health
// ============================================================
export async function getMessageCenterMessages() {
  return callAPI('/msgcenter/messages')
}

export async function getServiceHealth() {
  return callAPI('/msgcenter/health')
}

// ============================================================
// Security
// ============================================================
export async function getSecurityScore() {
  return callAPI('/security/score')
}

export async function getIncidents() {
  return callAPI('/security/incidents')
}

export async function getIdentityPosture() {
  return callAPI('/identity/posture')
}

export async function getPrivilegedAccounts() {
  return callAPI('/privileged-accounts')
}

// ============================================================
// Identity
// ============================================================
export async function getUsers() {
  return callAPI('/users')
}

export async function getRiskyUsers() {
  return callAPI('/identity/risky-users')
}

// ============================================================
// Applications
// ============================================================
export async function getApplications() {
  return callAPI('/applications')
}

export async function getServicePrincipals() {
  return callAPI('/service-principals')
}

// ============================================================
// Email & Security
// ============================================================
export async function getThreatAssessment() {
  return callAPI('/threat-assessment')
}

// ============================================================
// Current User
// ============================================================
export async function getCurrentUser() {
  return callAPI('/me')
}
