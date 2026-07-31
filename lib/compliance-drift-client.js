/**
 * Compliance Drift Client
 * Frontend functions for drift detection, recommendations, and remediation
 */

/**
 * Get all open compliance drifts
 */
export async function getOpenDrifts() {
  try {
    const response = await fetch('http://localhost:3001/api/tenantguard/compliance/drifts')
    if (!response.ok) throw new Error(`HTTP ${response.status}`)
    const data = await response.json()
    return data.data || []
  } catch (err) {
    console.error('Failed to get drifts:', err)
    return []
  }
}

/**
 * Get drift history for a specific control
 */
export async function getDriftHistory(controlId) {
  try {
    const response = await fetch(`http://localhost:3001/api/tenantguard/compliance/drifts/${controlId}`)
    if (!response.ok) throw new Error(`HTTP ${response.status}`)
    const data = await response.json()
    return data.data || []
  } catch (err) {
    console.error(`Failed to get drift history for ${controlId}:`, err)
    return []
  }
}

/**
 * Get remediation recommendation for a drift
 */
export async function getRecommendation(driftId) {
  try {
    const response = await fetch(`http://localhost:3001/api/tenantguard/compliance/recommendations/${driftId}`)
    if (!response.ok) throw new Error(`HTTP ${response.status}`)
    const data = await response.json()
    return data.data || null
  } catch (err) {
    console.error(`Failed to get recommendation for ${driftId}:`, err)
    return null
  }
}

/**
 * Approve remediation recommendation
 */
export async function approveRecommendation(recId, notes = '') {
  try {
    const response = await fetch(`http://localhost:3001/api/tenantguard/compliance/recommendations/${recId}/approve`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ notes })
    })
    if (!response.ok) throw new Error(`HTTP ${response.status}`)
    return await response.json()
  } catch (err) {
    console.error(`Failed to approve recommendation ${recId}:`, err)
    throw err
  }
}

/**
 * Reject remediation recommendation
 */
export async function rejectRecommendation(recId, reason = '') {
  try {
    const response = await fetch(`http://localhost:3001/api/tenantguard/compliance/recommendations/${recId}/reject`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ reason })
    })
    if (!response.ok) throw new Error(`HTTP ${response.status}`)
    return await response.json()
  } catch (err) {
    console.error(`Failed to reject recommendation ${recId}:`, err)
    throw err
  }
}

/**
 * Mark drift as manually resolved
 */
export async function markDriftResolved(driftId, notes = '') {
  try {
    const response = await fetch(`http://localhost:3001/api/tenantguard/compliance/drifts/${driftId}/resolve`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ notes })
    })
    if (!response.ok) throw new Error(`HTTP ${response.status}`)
    return await response.json()
  } catch (err) {
    console.error(`Failed to mark drift resolved ${driftId}:`, err)
    throw err
  }
}

/**
 * Get compliance statistics
 */
export async function getComplianceStats() {
  try {
    const response = await fetch('http://localhost:3001/api/tenantguard/compliance/stats')
    if (!response.ok) throw new Error(`HTTP ${response.status}`)
    const data = await response.json()
    return data.data || {}
  } catch (err) {
    console.error('Failed to get compliance stats:', err)
    return {}
  }
}

/**
 * Get drifts by control mapping for quick lookup
 */
export async function getDriftsByControl() {
  const drifts = await getOpenDrifts()
  const byControl = {}
  for (const drift of drifts) {
    if (!byControl[drift.control_id]) {
      byControl[drift.control_id] = []
    }
    byControl[drift.control_id].push(drift)
  }
  return byControl
}
