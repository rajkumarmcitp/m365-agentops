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
    <div>
      <!-- Page Header -->
      <div style="margin-bottom: 20px;">
        <h1 style="margin: 0 0 4px 0; font-size: 28px;"><i class="ti ti-shield-check"></i> Tenant Guard</h1>
        <p style="margin: 0; color: var(--color-text-secondary); font-size: 13px;">Real-time security threat detection and response across your Microsoft 365 environment</p>
      </div>

      <!-- KPI Row -->
      <div class="kpi-row mb-3">
        <div class="kpi-tile" style="border-left:4px solid var(--clr-danger)">
          <div class="kpi-value danger" id="kpi-critical" style="font-size:48px;font-weight:900">0</div>
          <div class="kpi-label">Critical Alerts</div>
          <div style="font-size:10px;margin-top:3px;color:var(--clr-danger);font-weight:600">Immediate action required</div>
        </div>
        <div class="kpi-tile">
          <div class="kpi-value warning" id="kpi-high">0</div>
          <div class="kpi-label">High Severity</div>
          <div style="font-size:10px;margin-top:3px;color:var(--color-text-tertiary)">Review within hours</div>
        </div>
        <div class="kpi-tile">
          <div class="kpi-value info" id="kpi-medium">0</div>
          <div class="kpi-label">Medium Alerts</div>
          <div style="font-size:10px;margin-top:3px;color:var(--color-text-tertiary)">Monitor and track</div>
        </div>
        <div class="kpi-tile">
          <div class="kpi-value info" id="kpi-risk">0</div>
          <div class="kpi-label">Risk Score</div>
          <div style="font-size:10px;margin-top:3px;color:var(--color-text-tertiary)">Out of 100</div>
        </div>
        <div class="kpi-tile">
          <div class="kpi-value info" id="kpi-corr">0</div>
          <div class="kpi-label">Correlations</div>
          <div style="font-size:10px;margin-top:3px;color:var(--color-text-tertiary)">Related incidents</div>
        </div>
        <div class="kpi-tile">
          <div class="kpi-value info" id="kpi-total">0</div>
          <div class="kpi-label">Total Alerts</div>
          <div style="font-size:10px;margin-top:3px;color:var(--color-text-tertiary)">All time</div>
        </div>
      </div>

      <!-- Coverage Cards -->
      <div class="grid-2 mb-3" style="gap:16px">
        <div class="card">
          <div class="card-header">
            <span class="card-title"><i class="ti ti-radar-2"></i> Coverage</span>
          </div>
          <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:12px;margin-bottom:12px">
            <div style="padding:10px;background:var(--color-bg-secondary);border-radius:6px;text-align:center">
              <div style="font-size:18px;font-weight:700;color:var(--clr-primary)">41</div>
              <div style="font-size:11px;color:var(--color-text-secondary);margin-top:3px">Alert Types</div>
            </div>
            <div style="padding:10px;background:var(--color-bg-secondary);border-radius:6px;text-align:center">
              <div style="font-size:18px;font-weight:700;color:var(--clr-primary)">6</div>
              <div style="font-size:11px;color:var(--color-text-secondary);margin-top:3px">Platforms</div>
            </div>
            <div style="padding:10px;background:var(--color-bg-secondary);border-radius:6px;text-align:center">
              <div style="font-size:18px;font-weight:700;color:var(--clr-primary)">60+</div>
              <div style="font-size:11px;color:var(--color-text-secondary);margin-top:3px">Scenarios</div>
            </div>
          </div>
          <div style="font-size:11px;color:var(--color-text-secondary);margin-bottom:8px">Monitoring:</div>
          <div style="display:flex;flex-wrap:wrap;gap:4px">
            <span class="badge" style="background:var(--color-bg-secondary)">Entra</span>
            <span class="badge" style="background:var(--color-bg-secondary)">Exchange</span>
            <span class="badge" style="background:var(--color-bg-secondary)">SharePoint</span>
            <span class="badge" style="background:var(--color-bg-secondary)">Teams</span>
            <span class="badge" style="background:var(--color-bg-secondary)">Intune</span>
            <span class="badge" style="background:var(--color-bg-secondary)">Defender</span>
          </div>
        </div>

        <div class="card">
          <div class="card-header">
            <span class="card-title"><i class="ti ti-list-check"></i> Alert Categories</span>
          </div>
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px">
            <div style="padding:10px;background:var(--color-bg-secondary);border-radius:6px">
              <div style="font-size:12px;color:var(--color-text-secondary);margin-bottom:4px">Identity & Access</div>
              <div style="font-size:16px;font-weight:700;color:var(--clr-primary)">26</div>
            </div>
            <div style="padding:10px;background:var(--color-bg-secondary);border-radius:6px">
              <div style="font-size:12px;color:var(--color-text-secondary);margin-bottom:4px">Policy & Config</div>
              <div style="font-size:16px;font-weight:700;color:var(--clr-primary)">12</div>
            </div>
            <div style="padding:10px;background:var(--color-bg-secondary);border-radius:6px">
              <div style="font-size:12px;color:var(--color-text-secondary);margin-bottom:4px">Application</div>
              <div style="font-size:16px;font-weight:700;color:var(--clr-primary)">8</div>
            </div>
            <div style="padding:10px;background:var(--color-bg-secondary);border-radius:6px">
              <div style="font-size:12px;color:var(--color-text-secondary);margin-bottom:4px">Device & Data</div>
              <div style="font-size:16px;font-weight:700;color:var(--clr-primary)">15</div>
            </div>
          </div>
        </div>
      </div>

      <!-- Visual Separator -->
      <div style="height:1px;background:var(--color-border-secondary);margin:24px 0"></div>

      <!-- Alerts Section -->
      <div class="card mb-3">
        <div class="card-header">
          <span class="card-title"><i class="ti ti-alert-triangle"></i> Recent Alerts</span>
          <button id="syncButton" class="btn btn-sm btn-primary" style="gap:6px"><i class="ti ti-reload"></i>Sync Now</button>
        </div>
        <div id="alertsContainer">
          <div style="padding:40px;text-align:center;color:var(--color-text-secondary)"><i class="ti ti-loader-2" style="animation:spin 1s linear infinite"></i> Loading alerts...</div>
        </div>
      </div>

      <!-- Security Baseline Section -->
      <div class="card mb-3">
        <div class="card-header">
          <span class="card-title"><i class="ti ti-lock"></i> Security Baseline & Configuration Drift</span>
          <span class="badge danger" id="driftCount">3</span>
        </div>
        <button id="driftToggle" style="width:100%;padding:12px;background:transparent;border:none;cursor:pointer;display:flex;align-items:center;justify-content:space-between;color:var(--clr-primary);font-weight:600;font-size:13px;text-align:left">
          <span><i class="ti ti-chevron-right" id="driftArrow" style="transition:transform 0.2s"></i> Click to view configuration status</span>
        </button>
        <div id="driftContent" style="display:none;border-top:1px solid var(--color-border-secondary);padding-top:12px">
          <table style="width:100%;font-size:12px;border-collapse:collapse">
            <thead>
              <tr>
                <th style="padding:8px;text-align:left;font-weight:600;color:var(--color-text-secondary);border-bottom:1px solid var(--color-border-secondary)">Setting</th>
                <th style="padding:8px;text-align:left;font-weight:600;color:var(--color-text-secondary);border-bottom:1px solid var(--color-border-secondary)">Expected</th>
                <th style="padding:8px;text-align:left;font-weight:600;color:var(--color-text-secondary);border-bottom:1px solid var(--color-border-secondary)">Current</th>
                <th style="padding:8px;text-align:left;font-weight:600;color:var(--color-text-secondary);border-bottom:1px solid var(--color-border-secondary)">Status</th>
              </tr>
            </thead>
            <tbody id="driftTable"></tbody>
          </table>
        </div>
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
      <div style="padding:40px;text-align:center;color:var(--color-text-secondary)">
        <p style="margin:0;font-size:14px"><i class="ti ti-shield-check"></i> All systems secure</p>
        <p style="margin:8px 0 0 0;font-size:12px">No active threats detected</p>
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

    html += `<div style="margin-bottom:16px">`
    html += `<div style="font-size:12px;font-weight:600;color:var(--color-text-secondary);margin-bottom:8px;text-transform:uppercase;letter-spacing:0.5px">${service} <span style="font-weight:400">(${alerts.length})</span></div>`

    alerts.forEach(alert => {
      const severityClass = alert.severity === 'CRITICAL' ? 'danger' : 'warning'
      const severityIcon = alert.severity === 'CRITICAL' ? 'ti-alert-circle' : 'ti-alert-triangle'
      const typeIcon = alert.type === 'ROLE_CHANGE' ? 'ti-user-check' : alert.type === 'POLICY_CHANGE' ? 'ti-lock' : alert.type === 'AUTH_ANOMALY' ? 'ti-alert' : 'ti-alert-circle'
      const time = new Date(alert.timestamp || alert.action_timestamp).toLocaleTimeString()
      const priority = alert.priority || 'P3'
      html += `
        <div class="alert-item" onclick="window.showAlertDetails('${alert.id}')" style="padding:14px;margin-bottom:8px;border-left:4px solid var(--clr-${severityClass});background:var(--color-bg-secondary);border-radius:6px;cursor:pointer;transition:all 0.2s;hover:transform: translateX(4px)">
          <div style="display:flex;align-items:flex-start;justify-content:space-between;gap:12px">
            <div style="flex:1;min-width:0">
              <div style="display:flex;align-items:center;gap:8px;margin-bottom:6px">
                <i class="ti ${typeIcon}" style="color:var(--clr-${severityClass});font-size:14px"></i>
                <p style="margin:0;font-weight:600;font-size:13px;color:var(--color-text-primary)">${alert.headline || alert.name || 'Alert'}</p>
                <span class="badge ${severityClass}" style="margin-left:auto;flex-shrink:0">${priority}</span>
              </div>
              <p style="margin:0;font-size:12px;color:var(--color-text-secondary)"><strong>${alert.actor || 'System'}</strong> <i class="ti ti-arrow-right" style="font-size:10px"></i> <strong>${alert.target || 'N/A'}</strong></p>
              ${alert.category ? `<p style="margin:4px 0 0 0;font-size:11px;color:var(--color-text-tertiary)">${alert.category}</p>` : ''}
            </div>
            <div style="text-align:right;font-size:11px;color:var(--color-text-tertiary);white-space:nowrap;flex-shrink:0">
              <div>${time}</div>
              <span class="badge ${severityClass}" style="margin-top:6px">${alert.severity || 'MEDIUM'}</span>
            </div>
          </div>
        </div>
      `
    })

    html += `</div>`
  })

  container.innerHTML = html
}

function renderDrift() {
  const driftCount = SECURE_BASELINE.filter(b => b.drifted).length
  document.getElementById('driftCount').textContent = driftCount

  let html = ''
  SECURE_BASELINE.forEach((row) => {
    const borderStyle = row.drifted ? 'border-left:3px solid var(--clr-danger)' : 'border-left:3px solid var(--clr-success)'
    const statusBadge = row.drifted ? '<span class="badge danger">Drifted</span>' : '<span class="badge success">Compliant</span>'
    const dateStr = row.since ? new Date(row.since).toLocaleDateString() : '—'
    html += `
      <tr style="${borderStyle}">
        <td style="padding:10px;border-bottom:1px solid var(--color-border-secondary)">${row.setting}</td>
        <td style="padding:10px;border-bottom:1px solid var(--color-border-secondary);color:var(--color-text-secondary)">${row.expected}</td>
        <td style="padding:10px;border-bottom:1px solid var(--color-border-secondary);color:var(--color-text-secondary)">${row.current}</td>
        <td style="padding:10px;border-bottom:1px solid var(--color-border-secondary);font-size:11px">${statusBadge}</td>
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

  window.showAlertDetails = (alertId) => {
    const alert = allAlerts.find(a => a.id === alertId)
    if (!alert) return

    const color = getSeverityColor(alert.severity)
    const time = new Date(alert.timestamp || alert.action_timestamp).toLocaleString()

    const modal = document.createElement('div')
    modal.style.cssText = 'position:fixed;top:0;left:0;right:0;bottom:0;background:rgba(0,0,0,0.5);display:flex;align-items:center;justify-content:center;z-index:1000'

    modal.innerHTML = `
      <div class="card" style="max-width:600px;width:90%;max-height:80vh;overflow-y:auto">
        <div class="card-header">
          <h3 style="margin:0;font-size:16px">${alert.headline || alert.name || 'Alert'}</h3>
          <button onclick="this.closest('[data-modal]').remove()" style="background:none;border:none;font-size:24px;cursor:pointer;color:var(--color-text-secondary)">×</button>
        </div>

        <div style="padding:16px;display:flex;flex-direction:column;gap:16px">
          <!-- Severity & Score -->
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px">
            <div style="background:var(--color-bg-secondary);padding:12px;border-radius:6px">
              <p style="margin:0 0 6px 0;font-size:11px;color:var(--color-text-secondary);font-weight:600;text-transform:uppercase">Severity</p>
              <p style="margin:0;font-size:16px;font-weight:700;color:var(--clr-${alert.severity === 'CRITICAL' ? 'danger' : 'warning'})">${alert.severity || 'MEDIUM'}</p>
            </div>
            <div style="background:var(--color-bg-secondary);padding:12px;border-radius:6px">
              <p style="margin:0 0 6px 0;font-size:11px;color:var(--color-text-secondary);font-weight:600;text-transform:uppercase">Risk Score</p>
              <p style="margin:0;font-size:16px;font-weight:700">${alert.score || alert.riskScore || 0}<span style="font-size:11px;color:var(--color-text-secondary)">/100</span></p>
            </div>
          </div>

          <!-- Description -->
          <div>
            <p style="margin:0 0 6px 0;font-size:11px;color:var(--color-text-secondary);font-weight:600;text-transform:uppercase">Description</p>
            <p style="margin:0;font-size:13px;line-height:1.5">${alert.description || 'No description'}</p>
          </div>

          <!-- Actor & Target -->
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px">
            <div>
              <p style="margin:0 0 6px 0;font-size:11px;color:var(--color-text-secondary);font-weight:600;text-transform:uppercase">Actor</p>
              <p style="margin:0;font-size:12px;word-break:break-all;background:var(--color-bg-secondary);padding:8px;border-radius:4px"><strong>${alert.actor || 'System'}</strong></p>
            </div>
            <div>
              <p style="margin:0 0 6px 0;font-size:11px;color:var(--color-text-secondary);font-weight:600;text-transform:uppercase">Target</p>
              <p style="margin:0;font-size:12px;word-break:break-all;background:var(--color-bg-secondary);padding:8px;border-radius:4px"><strong>${alert.target || 'N/A'}</strong></p>
            </div>
          </div>

          <!-- Metadata Grid -->
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px">
            <div>
              <p style="margin:0 0 6px 0;font-size:11px;color:var(--color-text-secondary);font-weight:600;text-transform:uppercase">Category</p>
              <p style="margin:0;font-size:12px">${alert.category || 'Unknown'}</p>
            </div>
            <div>
              <p style="margin:0 0 6px 0;font-size:11px;color:var(--color-text-secondary);font-weight:600;text-transform:uppercase">Type</p>
              <p style="margin:0;font-size:12px">${alert.type || 'Unknown'}</p>
            </div>
            <div>
              <p style="margin:0 0 6px 0;font-size:11px;color:var(--color-text-secondary);font-weight:600;text-transform:uppercase">Priority</p>
              <p style="margin:0"><span class="badge ${alert.priority === 'P1' ? 'danger' : 'warning'}">${alert.priority || 'P3'}</span></p>
            </div>
            <div>
              <p style="margin:0 0 6px 0;font-size:11px;color:var(--color-text-secondary);font-weight:600;text-transform:uppercase">Timestamp</p>
              <p style="margin:0;font-size:12px">${time}</p>
            </div>
          </div>

          <!-- Recommendations -->
          ${alert.recommendations ? `
          <div style="background:var(--color-bg-secondary);padding:12px;border-radius:6px">
            <p style="margin:0 0 10px 0;font-size:11px;color:var(--color-text-secondary);font-weight:600;text-transform:uppercase"><i class="ti ti-list-check"></i> Recommendations</p>
            <ul style="margin:0;padding:0;list-style:none">
              ${(Array.isArray(alert.recommendations) ? alert.recommendations : JSON.parse(alert.recommendations || '[]')).map(rec =>
                `<li style="font-size:12px;margin-bottom:6px;padding-left:20px;position:relative"><span style="position:absolute;left:0">✓</span> ${rec}</li>`
              ).join('')}
            </ul>
          </div>
          ` : ''}

          ${alert.target && /^[a-f0-9-]{36}$/.test(alert.target) ? `
          <div class="alert-box alert-warning" style="padding:12px">
            <p style="margin:0;font-size:12px"><i class="ti ti-info-circle"></i> Test environment: target shows as ID. In production, actual resource names display.</p>
          </div>
          ` : ''}
        </div>

        <div style="padding:12px 16px;border-top:1px solid var(--color-border-secondary);text-align:right">
          <button onclick="this.closest('[data-modal]').remove()" class="btn btn-sm btn-primary">Close</button>
        </div>
      </div>
    `
    modal.setAttribute('data-modal', 'true')
    modal.onclick = (e) => {
      if (e.target === modal) modal.remove()
    }
    document.body.appendChild(modal)
  }
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
  const syncElement = document.getElementById('lastSync')
  if (syncElement) {
    syncElement.textContent = now.toLocaleTimeString()
  }
}
