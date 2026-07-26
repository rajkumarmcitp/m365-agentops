/**
 * Risk Assessment Client
 * Frontend functions for risk assessment API calls
 */

/**
 * Get current risk assessment
 */
export async function getCurrentRiskAssessment() {
  try {
    const response = await fetch('http://localhost:3000/api/tenantguard/risk/current')
    if (!response.ok) throw new Error(`HTTP ${response.status}`)
    const data = await response.json()
    return data.data || null
  } catch (err) {
    console.error('Failed to get current risk assessment:', err)
    return null
  }
}

/**
 * Get risk assessment history
 */
export async function getRiskHistory(limit = 10) {
  try {
    const response = await fetch(`http://localhost:3000/api/tenantguard/risk/history?limit=${limit}`)
    if (!response.ok) throw new Error(`HTTP ${response.status}`)
    const data = await response.json()
    return data.data || []
  } catch (err) {
    console.error('Failed to get risk history:', err)
    return []
  }
}

/**
 * Get top risk factors from latest assessment
 */
export async function getRiskFactors() {
  try {
    const response = await fetch('http://localhost:3000/api/tenantguard/risk/factors')
    if (!response.ok) throw new Error(`HTTP ${response.status}`)
    const data = await response.json()
    return data.data || []
  } catch (err) {
    console.error('Failed to get risk factors:', err)
    return []
  }
}

/**
 * Trigger immediate risk assessment
 */
export async function triggerRiskAssessment() {
  try {
    const response = await fetch('http://localhost:3000/api/tenantguard/risk/trigger', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    })
    if (!response.ok) throw new Error(`HTTP ${response.status}`)
    const data = await response.json()
    return data.data || null
  } catch (err) {
    console.error('Failed to trigger risk assessment:', err)
    throw err
  }
}
