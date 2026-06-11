/**
 * TenantGuard Settings Client
 * Manages admin configuration
 */

export async function getClaudeStatus() {
  try {
    const response = await fetch('http://localhost:3000/api/tenantguard/settings/claude-status')
    const data = await response.json()
    return data.data
  } catch (error) {
    console.error('Error getting Claude status:', error)
    return null
  }
}

export async function getAllSettings() {
  try {
    const response = await fetch('http://localhost:3000/api/tenantguard/settings')
    const data = await response.json()
    return data.data || []
  } catch (error) {
    console.error('Error getting settings:', error)
    return []
  }
}

export async function setClaudeApiKey(apiKey) {
  try {
    const response = await fetch('http://localhost:3000/api/tenantguard/settings/claude-api-key', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ apiKey })
    })
    const data = await response.json()
    return data
  } catch (error) {
    console.error('Error setting Claude API key:', error)
    return { success: false, error: error.message }
  }
}

export async function removeClaudeApiKey() {
  try {
    const response = await fetch('http://localhost:3000/api/tenantguard/settings/claude-api-key', {
      method: 'DELETE'
    })
    const data = await response.json()
    return data
  } catch (error) {
    console.error('Error removing Claude API key:', error)
    return { success: false, error: error.message }
  }
}
