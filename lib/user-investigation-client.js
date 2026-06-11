/**
 * User Investigation API Client
 * Fetches comprehensive user activity data for security investigations
 */

const API_BASE = 'http://localhost:3000/api'

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
