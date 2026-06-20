import { getAlertSummary, getAlerts, getCorrelations, getPatterns } from '../lib/tenantguard-client.js'
import { showToast } from '../components/toast.js'

let allAlerts = []
let allCorrelations = []
let selectedAlert = null
let driftOpen = false

const SECURE_BASELINE = [
  { setting: "Security Defaults", expected: "Enabled", current: "Disabled", since: "2025-06-14T09:12:00Z", drifted: true },
  { setting: "MFA for All Admins", expected: "Enforced", current: "Enforced", since: null, drifted: false },
  { setting: "Legacy Auth", expected: "Blocked", current: "Allowed", since: "2025-06-17T14:33:00Z", drifted: true },
  { setting: "Audit Log Retention", expected: "180 days", current: "90 days", since: "2025-06-10T08:00:00Z", drifted: true },
]

const SERVICES = ["Entra", "Exchange", "SharePoint", "Teams", "Intune", "Defender", "Purview"]

export async function initTenantGuardEnhanced() {
  const el = document.getElementById('page-tenantguard-enhanced')
  if (!el) return

  el.innerHTML = `
    <div style="padding: 20px; background: #F5F7FA; min-height: 100vh;">
      <div style="max-width: 1400px; margin: 0 auto;">
        <!-- Header -->
        <div style="margin-bottom: 24px;">
          <h1 style="font-size: 28px; font-weight: 600; margin: 0 0 8px 0; color: #1F2937;">Tenant Guard — Real-Time Threat Dashboard</h1>
          <p style="color: #6B7280; margin: 0;">Live security alerts from Microsoft 365 Graph API</p>
        </div>

        <!-- KPI Cards -->
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 16px; margin-bottom: 24px;">
          <div style="background: white; padding: 16px; border-radius: 8px; border: 1px solid #E5E7EB; box-shadow: 0 1px 2px rgba(0,0,0,0.05);">
            <div style="color: #6B7280; font-size: 12px; font-weight: 600; text-transform: uppercase; margin-bottom: 8px;">Critical Alerts</div>
            <div style="font-size: 24px; font-weight: 700; color: #DC2626;" id="kpi-critical">0</div>
          </div>
          <div style="background: white; padding: 16px; border-radius: 8px; border: 1px solid #E5E7EB; box-shadow: 0 1px 2px rgba(0,0,0,0.05);">
            <div style="color: #6B7280; font-size: 12px; font-weight: 600; text-transform: uppercase; margin-bottom: 8px;">High Severity</div>
            <div style="font-size: 24px; font-weight: 700; color: #F59E0B;" id="kpi-high">0</div>
          </div>
          <div style="background: white; padding: 16px; border-radius: 8px; border: 1px solid #E5E7EB; box-shadow: 0 1px 2px rgba(0,0,0,0.05);">
            <div style="color: #6B7280; font-size: 12px; font-weight: 600; text-transform: uppercase; margin-bottom: 8px;">Medium Alerts</div>
            <div style="font-size: 24px; font-weight: 700; color: #3B82F6;" id="kpi-medium">0</div>
          </div>
          <div style="background: white; padding: 16px; border-radius: 8px; border: 1px solid #E5E7EB; box-shadow: 0 1px 2px rgba(0,0,0,0.05);">
            <div style="color: #6B7280; font-size: 12px; font-weight: 600; text-transform: uppercase; margin-bottom: 8px;">Correlations</div>
            <div style="font-size: 24px; font-weight: 700; color: #0891B2;" id="kpi-corr">0</div>
          </div>
          <div style="background: white; padding: 16px; border-radius: 8px; border: 1px solid #E5E7EB; box-shadow: 0 1px 2px rgba(0,0,0,0.05);">
            <div style="color: #6B7280; font-size: 12px; font-weight: 600; text-transform: uppercase; margin-bottom: 8px;">Risk Score</div>
            <div style="font-size: 24px; font-weight: 700; color: #059669;" id="kpi-risk">0</div>
          </div>
          <div style="background: white; padding: 16px; border-radius: 8px; border: 1px solid #E5E7EB; box-shadow: 0 1px 2px rgba(0,0,0,0.05);">
            <div style="color: #6B7280; font-size: 12px; font-weight: 600; text-transform: uppercase; margin-bottom: 8px;">Total Alerts</div>
            <div style="font-size: 24px; font-weight: 700; color: #1F2937;" id="kpi-total">0</div>
          </div>
        </div>

        <!-- Alerts Section -->
        <div id="alertsContainer" style="margin-bottom: 24px;">
          <div style="text-align: center; padding: 40px; background: white; border-radius: 8px; border: 1px solid #E5E7EB;">
            <div style="color: #6B7280;">Loading alerts...</div>
          </div>
        </div>

        <!-- Drift Panel -->
        <div style="background: white; border-radius: 8px; border: 1px solid #E5E7EB; overflow: hidden; margin-bottom: 24px;">
          <button id="driftToggle" style="width: 100%; padding: 16px; background: #F9FAFB; border: none; cursor: pointer; display: flex; align-items: center; justify-content: space-between; font-size: 14px; font-weight: 600; color: #1F2937;">
            <span>Configuration Baseline Drift — <span style="color: #DC2626;" id="driftCount">3</span> settings out of compliance</span>
            <span id="driftArrow" style="transition: transform 0.2s;">›</span>
          </button>
          <div id="driftContent" style="display: none;">
            <table style="width: 100%; font-size: 13px; border-collapse: collapse;">
              <thead>
                <tr style="background: #F9FAFB; border-top: 1px solid #E5E7EB;">
                  <th style="padding: 12px; text-align: left; font-weight: 600; color: #6B7280;">Setting</th>
                  <th style="padding: 12px; text-align: left; font-weight: 600; color: #6B7280;">Expected</th>
                  <th style="padding: 12px; text-align: left; font-weight: 600; color: #6B7280;">Current</th>
                  <th style="padding: 12px; text-align: left; font-weight: 600; color: #6B7280;">Since</th>
                </tr>
              </thead>
              <tbody id="driftTable"></tbody>
            </table>
          </div>
        </div>

        <!-- Footer -->
        <div style="background: white; border-radius: 8px; border: 1px solid #E5E7EB; padding: 12px 16px; display: flex; align-items: center; justify-content: space-between;">
          <span style="font-size: 13px; color: #6B7280;">
            <span style="display: inline-block; width: 8px; height: 8px; border-radius: 50%; background: #10B981; margin-right: 8px; vertical-align: middle;"></span>
            Data Synced <span id="lastSync">just now</span>
          </span>
          <button id="syncButton" style="padding: 8px 16px; background: #3B82F6; color: white; border: none; border-radius: 6px; cursor: pointer; font-size: 13px; font-weight: 500;">Sync Now</button>
        </div>
      </div>
    </div>
  `

  // Load data
  try {
    await refreshData()
  } catch (error) {
    console.error('Error loading data:', error)
    showToast('Failed to load alerts', 'error')
  }

  // Setup event listeners
  setupEventListeners()
}

async function refreshData() {
  try {
    // Fetch from backend dashboard endpoint (which aggregates everything)
    const isLocalDev = window.location.hostname === 'localhost'
    const baseUrl = isLocalDev ? 'http://localhost:3000' : 'https://m365ops-api-gtbgezb9c7bgata7.centralus-01.azurewebsites.net'

    const dashboardResponse = await fetch(`${baseUrl}/api/tenantguard/dashboard`)
    if (!dashboardResponse.ok) throw new Error('Failed to fetch dashboard')

    const dashboardData = await dashboardResponse.json()

    allAlerts = dashboardData.data.alerts || []
    allCorrelations = dashboardData.data.correlations || []
    const summary = dashboardData.data.summary || {}

    console.log('📊 Data loaded:', { alerts: allAlerts.length, correlations: allCorrelations.length })

    // Update KPIs
    document.getElementById('kpi-critical').textContent = summary.critical || 0
    document.getElementById('kpi-high').textContent = summary.high || 0
    document.getElementById('kpi-medium').textContent = summary.medium || 0
    document.getElementById('kpi-corr').textContent = allCorrelations.length
    document.getElementById('kpi-risk').textContent = calculateRiskScore()
    document.getElementById('kpi-total').textContent = summary.total || 0

    // Render alerts
    renderAlerts()
    renderDrift()
    updateTimestamp()

    // Store to SharePoint in background (non-blocking)
    storeToSharePoint(baseUrl)
  } catch (error) {
    console.error('Error refreshing data:', error)
  }
}

async function storeToSharePoint(baseUrl) {
  try {
    console.log('📤 Storing data to SharePoint...')
    const response = await fetch(`${baseUrl}/api/tenantguard/store-to-sharepoint`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        alerts: allAlerts,
        correlations: allCorrelations,
        timestamp: new Date().toISOString()
      })
    })

    const result = await response.json()
    if (result.success) {
      console.log('✅ Data stored to SharePoint:', result)
    } else {
      console.warn('⚠️ SharePoint storage warning:', result.message)
    }
  } catch (error) {
    console.warn('⚠️ Could not store to SharePoint (non-blocking):', error.message)
  }
}

function renderAlerts() {
  const container = document.getElementById('alertsContainer')

  if (allAlerts.length === 0) {
    container.innerHTML = `
      <div style="text-align: center; padding: 40px; background: white; border-radius: 8px; border: 1px solid #E5E7EB; color: #6B7280;">
        <p style="margin: 0;">No alerts found. Your tenant is secure! ✓</p>
      </div>
    `
    return
  }

  const alertsByService = {}
  SERVICES.forEach(s => alertsByService[s] = [])
  allAlerts.forEach(alert => {
    const service = alert.service || alert.category || 'Entra'
    if (!alertsByService[service]) alertsByService[service] = []
    alertsByService[service].push(alert)
  })

  let html = ''
  SERVICES.forEach(service => {
    const alerts = alertsByService[service] || []
    if (alerts.length === 0) return

    html += `
      <div style="margin-bottom: 24px;">
        <h3 style="font-size: 16px; font-weight: 600; color: #1F2937; margin: 0 0 12px 0;">${service} <span style="font-weight: 400; color: #6B7280;">(${alerts.length})</span></h3>
        <div style="display: flex; flex-direction: column; gap: 8px;">
    `

    alerts.forEach(alert => {
      const color = getSeverityColor(alert.severity)
      const time = new Date(alert.timestamp || alert.action_timestamp).toLocaleString()
      html += `
        <div style="background: white; padding: 12px; border-radius: 6px; border-left: 4px solid ${color}; border: 1px solid #E5E7EB; border-left: 4px solid ${color};">
          <div style="display: flex; align-items: center; justify-content: space-between; gap: 12px;">
            <div style="flex: 1;">
              <p style="margin: 0 0 4px 0; font-weight: 500; color: #1F2937; font-size: 14px;">${alert.headline || alert.name || 'Alert'}</p>
              <p style="margin: 0; font-size: 13px; color: #6B7280;">${alert.actor || 'System'} → ${alert.target || 'N/A'}</p>
            </div>
            <div style="text-align: right; font-size: 12px; color: #6B7280; white-space: nowrap;">
              <div>${time}</div>
              <div style="color: ${color}; font-weight: 600;">${alert.severity || 'MEDIUM'}</div>
            </div>
          </div>
        </div>
      `
    })

    html += `</div></div>`
  })

  container.innerHTML = html
}

function renderDrift() {
  const driftCount = SECURE_BASELINE.filter(b => b.drifted).length
  document.getElementById('driftCount').textContent = driftCount

  let html = ''
  SECURE_BASELINE.forEach((row) => {
    const borderColor = row.drifted ? '#FCA5A5' : 'transparent'
    const dateColor = row.drifted ? '#DC2626' : '#6B7280'
    const dateStr = row.since ? new Date(row.since).toLocaleDateString() : '—'
    html += `
      <tr style="border-top: 1px solid #E5E7EB; border-left: 4px solid ${borderColor};">
        <td style="padding: 12px; color: #1F2937;">${row.setting}</td>
        <td style="padding: 12px; color: #6B7280;">${row.expected}</td>
        <td style="padding: 12px; color: #6B7280;">${row.current}</td>
        <td style="padding: 12px; color: ${dateColor}; font-size: 12px;">${dateStr}</td>
      </tr>
    `
  })
  document.getElementById('driftTable').innerHTML = html
}

function setupEventListeners() {
  document.getElementById('driftToggle').addEventListener('click', () => {
    driftOpen = !driftOpen
    const content = document.getElementById('driftContent')
    const arrow = document.getElementById('driftArrow')
    if (driftOpen) {
      content.style.display = 'block'
      arrow.style.transform = 'rotate(90deg)'
    } else {
      content.style.display = 'none'
      arrow.style.transform = 'rotate(0deg)'
    }
  })

  document.getElementById('syncButton').addEventListener('click', async () => {
    showToast('Syncing alerts...', 'info')
    await refreshData()
    showToast('Sync complete!', 'success')
  })
}

function calculateRiskScore() {
  return Math.min(
    allAlerts.reduce((total, alert) => {
      const points = alert.severity === 'CRITICAL' ? 25 : alert.severity === 'HIGH' ? 10 : 3
      return total + points
    }, 0),
    100
  )
}

function getSeverityColor(severity) {
  if (severity === 'CRITICAL') return '#DC2626'
  if (severity === 'HIGH') return '#F59E0B'
  return '#3B82F6'
}

function updateTimestamp() {
  const now = new Date()
  document.getElementById('lastSync').textContent = now.toLocaleTimeString()
}
