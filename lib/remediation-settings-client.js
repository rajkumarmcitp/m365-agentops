/**
 * Remediation Settings Client
 * Frontend API for auto-remediation configuration
 */

/**
 * Get current remediation settings
 */
export async function getRemediationSettings() {
  try {
    const response = await fetch('http://localhost:3000/api/tenantguard/settings/remediation')
    if (!response.ok) throw new Error(`HTTP ${response.status}`)
    const data = await response.json()
    return data.data || { enabled: false, requiresApproval: true }
  } catch (err) {
    console.error('Failed to get remediation settings:', err)
    return { enabled: false, requiresApproval: true }
  }
}

/**
 * Save remediation settings
 */
export async function saveRemediationSettings(settings) {
  try {
    const response = await fetch('http://localhost:3000/api/tenantguard/settings/remediation', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(settings)
    })
    if (!response.ok) throw new Error(`HTTP ${response.status}`)
    const data = await response.json()
    return data.data || { enabled: false, requiresApproval: true }
  } catch (err) {
    console.error('Failed to save remediation settings:', err)
    throw err
  }
}

/**
 * Get auto-fix execution history
 */
export async function getAutoFixHistory() {
  try {
    const response = await fetch('http://localhost:3000/api/tenantguard/auto-fix/history')
    if (!response.ok) throw new Error(`HTTP ${response.status}`)
    const data = await response.json()
    return data.data || []
  } catch (err) {
    console.error('Failed to get auto-fix history:', err)
    return []
  }
}
