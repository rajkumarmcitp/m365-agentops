/**
 * Backup Alerts Client Service
 * Frontend integration for alert configuration and testing
 */

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3001'

/**
 * Get alert configuration from server
 */
export async function getAlertConfig() {
  try {
    const response = await fetch(`${API_BASE}/api/backup/alerts/config`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    })

    if (response.ok) {
      const result = await response.json()
      return result.data
    }

    return null
  } catch (error) {
    console.error('❌ Error getting alert config:', error.message)
    return null
  }
}

/**
 * Update alert configuration
 */
export async function updateAlertConfig(config) {
  try {
    const response = await fetch(`${API_BASE}/api/backup/alerts/config`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ config })
    })

    if (response.ok) {
      const result = await response.json()
      console.log('✓ Alert configuration updated')
      return result.data
    }

    console.error(`❌ Could not update alert config (${response.status})`)
    return null
  } catch (error) {
    console.error('❌ Error updating alert config:', error.message)
    return null
  }
}

/**
 * Test email alert
 */
export async function testEmailAlert(recipients, subject) {
  try {
    const response = await fetch(`${API_BASE}/api/backup/alerts/test/email`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ recipients, subject })
    })

    const result = await response.json()

    if (response.ok) {
      console.log('✓ Test email sent')
      return { success: true, message: result.message }
    }

    return { success: false, message: result.message || 'Failed to send test email' }
  } catch (error) {
    console.error('❌ Error sending test email:', error.message)
    return { success: false, message: error.message }
  }
}

/**
 * Test Slack alert
 */
export async function testSlackAlert(webhookUrl) {
  try {
    const response = await fetch(`${API_BASE}/api/backup/alerts/test/slack`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ webhookUrl })
    })

    const result = await response.json()

    if (response.ok) {
      console.log('✓ Test Slack alert sent')
      return { success: true, message: result.message }
    }

    return { success: false, message: result.message || 'Failed to send Slack alert' }
  } catch (error) {
    console.error('❌ Error sending test Slack alert:', error.message)
    return { success: false, message: error.message }
  }
}

/**
 * Test Teams alert
 */
export async function testTeamsAlert(webhookUrl) {
  try {
    const response = await fetch(`${API_BASE}/api/backup/alerts/test/teams`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ webhookUrl })
    })

    const result = await response.json()

    if (response.ok) {
      console.log('✓ Test Teams alert sent')
      return { success: true, message: result.message }
    }

    return { success: false, message: result.message || 'Failed to send Teams alert' }
  } catch (error) {
    console.error('❌ Error sending test Teams alert:', error.message)
    return { success: false, message: error.message }
  }
}

/**
 * Trigger alert for an event
 */
export async function triggerAlert(event) {
  try {
    const response = await fetch(`${API_BASE}/api/backup/alerts/process`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ event })
    })

    const result = await response.json()

    if (response.ok) {
      console.log('✓ Alert processed')
      return result.data
    }

    console.warn(`⚠️ Could not process alert (${response.status})`)
    return null
  } catch (error) {
    console.error('❌ Error processing alert:', error.message)
    return null
  }
}
