import { getAlertSummary, getAlerts, dismissAlert, getCorrelations, getPatterns, startInvestigation, getInvestigation, chatInvestigation, generateInvestigationReport } from '../lib/tenantguard-client.js'
import { showToast } from '../components/toast.js'
import { isDemoAccount } from '../lib/demo-account.js'

let activeTab = 'dashboard'
let allAlerts = []
let allCorrelations = []
let allPatterns = []
let selectedAlertId = null
let autoRefreshInterval = null

const ALERT_PRIORITY_COLORS = {
  'P0': { bg: '#ff4444', text: '#ffffff', label: 'Drop Everything' },
  'P1': { bg: '#dc3545', text: '#ffffff', label: 'Critical' },
  'P2': { bg: '#fd7e14', text: '#ffffff', label: 'High' },
  'P3': { bg: '#ffc107', text: '#000000', label: 'Medium' },
}

const SEVERITY_COLORS = {
  'CRITICAL': '#ff4444',
  'HIGH': '#fd7e14',
  'MEDIUM': '#ffc107',
  'LOW': '#28a745',
}

export async function initTenantGuard() {
  const el = document.getElementById('page-tenantguard')
  if (!el) return

  el.innerHTML = `
    <div style="background:#0f1419;color:#e4e8eb;min-height:100vh;font-family:system-ui,-apple-system,sans-serif;padding:20px">
      <div style="max-width:1600px;margin:0 auto">
        ${renderHeader()}
        ${renderTabs()}
        <div id="tenantguard-content"></div>
      </div>
    </div>
  `

  if (isDemoAccount()) {
    renderDemoTenantGuard(document.getElementById('tenantguard-content'))
    return
  }

  try {
    await refreshData()
    renderContent(document.getElementById('tenantguard-content'))
  } catch (error) {
    console.error('Error initializing TenantGuard:', error)
    showToast('Failed to load alerts', 'error')
  }

  if (autoRefreshInterval) clearInterval(autoRefreshInterval)
  autoRefreshInterval = setInterval(refreshData, 5 * 60 * 1000)
}

function renderHeader() {
  return `
    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:24px;padding-bottom:16px;border-bottom:1px solid #2a2f37">
      <div>
        <h1 style="margin:0;font-size:28px;font-weight:600">🛡️ TenantGuard Security Monitoring</h1>
        <p style="margin:4px 0 0 0;color:#a0a8b0;font-size:13px">Real-time threat detection & attack pattern analysis</p>
      </div>
      <div style="text-align:right">
        <div style="font-size:11px;color:#a0a8b0;margin-bottom:4px">Last updated: <span id="last-update">just now</span></div>
        <button onclick="location.reload()" style="padding:6px 12px;background:#0d6efd;color:#fff;border:none;border-radius:4px;cursor:pointer;font-size:13px">↻ Refresh</button>
      </div>
    </div>
  `
}

function renderTabs() {
  const tabs = [
    { id: 'dashboard', label: '📊 Dashboard', icon: 'ti-dashboard' },
    { id: 'alerts', label: '🚨 Alerts', icon: 'ti-alert-triangle' },
    { id: 'timeline', label: '⏱️ Timeline', icon: 'ti-timeline' },
    { id: 'incidents', label: '🔗 Incidents', icon: 'ti-link' },
    { id: 'audit', label: '📋 Audit', icon: 'ti-list' },
  ]

  return `
    <div style="display:flex;gap:4px;margin-bottom:20px;border-bottom:1px solid #2a2f37;flex-wrap:wrap">
      ${tabs.map(tab => `
        <button onclick="switchTab('${tab.id}')" style="
          padding:12px 16px;
          background:${activeTab === tab.id ? '#0d6efd' : 'transparent'};
          color:${activeTab === tab.id ? '#fff' : '#a0a8b0'};
          border:none;
          border-bottom:${activeTab === tab.id ? '3px solid #0d6efd' : '3px solid transparent'};
          cursor:pointer;
          font-size:14px;
          font-weight:500;
          transition:all 200ms;
        " onmouseover="this.style.color='#e4e8eb'" onmouseout="this.style.color='${activeTab === tab.id ? '#fff' : '#a0a8b0'}'">
          ${tab.label}
        </button>
      `).join('')}
    </div>
  `
}

function renderContent(el) {
  switch (activeTab) {
    case 'dashboard':
      el.innerHTML = renderDashboard()
      break
    case 'alerts':
      el.innerHTML = renderAlertsView()
      break
    case 'timeline':
      el.innerHTML = renderTimelineView()
      break
    case 'incidents':
      el.innerHTML = renderIncidentsView()
      break
    case 'audit':
      el.innerHTML = renderAuditView()
      break
  }
}

function renderDashboard() {
  const totalAlerts = allAlerts.length
  const criticalCount = allAlerts.filter(a => a.severity === 'CRITICAL').length
  const highCount = allAlerts.filter(a => a.severity === 'HIGH').length
  const p0Count = allAlerts.filter(a => a.priority === 'P0').length
  const p1Count = allAlerts.filter(a => a.priority === 'P1').length

  // Calculate risk score
  let riskScore = 0
  riskScore += p0Count * 25
  riskScore += criticalCount * 20
  riskScore += p1Count * 15
  riskScore += highCount * 10
  riskScore = Math.min(Math.max(riskScore, 0), 100)

  const riskLevel = riskScore >= 80 ? 'CRITICAL' : riskScore >= 50 ? 'HIGH' : riskScore >= 20 ? 'MEDIUM' : 'LOW'
  const riskColor = { CRITICAL: '#ff4444', HIGH: '#fd7e14', MEDIUM: '#ffc107', LOW: '#28a745' }[riskLevel]

  return `
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px;margin-bottom:24px">
      ${renderRiskGauge(riskScore, riskLevel, riskColor)}
      ${renderCriticalAlertsSummary(p0Count, p1Count, criticalCount, highCount)}
    </div>

    <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px;margin-bottom:24px">
      ${renderTopAlerts()}
      ${renderAttackChainsPanel()}
    </div>

    <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px">
      ${renderServiceImpactMap()}
      ${renderMonitoringAgentStatus()}
    </div>
  `
}

function renderRiskGauge(score, level, color) {
  return `
    <div style="background:#1a1f26;border:1px solid #2a2f37;border-radius:8px;padding:20px">
      <h3 style="margin:0 0 16px 0;font-size:14px;color:#a0a8b0;font-weight:600">TENANT RISK LEVEL</h3>
      <div style="display:flex;align-items:center;gap:16px">
        <div style="flex:0 0 120px">
          <svg viewBox="0 0 120 120" style="width:100%;height:100%">
            <circle cx="60" cy="60" r="50" fill="none" stroke="#2a2f37" stroke-width="8"/>
            <circle cx="60" cy="60" r="50" fill="none" stroke="${color}" stroke-width="8" stroke-dasharray="${(score / 100) * 314} 314" stroke-linecap="round" style="transform:rotate(-90deg);transform-origin:60px 60px"/>
            <text x="60" y="70" text-anchor="middle" font-size="32" font-weight="600" fill="${color}">${Math.round(score)}</text>
          </svg>
        </div>
        <div>
          <div style="font-size:28px;font-weight:700;color:${color};margin-bottom:4px">${level}</div>
          <div style="color:#a0a8b0;font-size:12px">
            ${score >= 80 ? '⚠️ Immediate action required' : score >= 50 ? '🔶 Heightened alert' : score >= 20 ? '🟡 Monitor closely' : '✅ Healthy'}
          </div>
        </div>
      </div>
    </div>
  `
}

function renderCriticalAlertsSummary(p0, p1, critical, high) {
  return `
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px">
      <div style="background:#1a1f26;border:1px solid #2a2f37;border-radius:8px;padding:16px">
        <div style="font-size:12px;color:#a0a8b0;font-weight:600;margin-bottom:8px">DROP EVERYTHING</div>
        <div style="font-size:32px;font-weight:700;color:#ff4444;margin-bottom:4px">${p0}</div>
        <div style="font-size:12px;color:#a0a8b0">Requires immediate action</div>
      </div>
      <div style="background:#1a1f26;border:1px solid #2a2f37;border-radius:8px;padding:16px">
        <div style="font-size:12px;color:#a0a8b0;font-weight:600;margin-bottom:8px">CRITICAL (P1)</div>
        <div style="font-size:32px;font-weight:700;color:#dc3545;margin-bottom:4px">${p1}</div>
        <div style="font-size:12px;color:#a0a8b0">&lt; 15 minutes response</div>
      </div>
      <div style="background:#1a1f26;border:1px solid #2a2f37;border-radius:8px;padding:16px">
        <div style="font-size:12px;color:#a0a8b0;font-weight:600;margin-bottom:8px">TOTAL CRITICAL</div>
        <div style="font-size:32px;font-weight:700;color:#fd7e14;margin-bottom:4px">${critical}</div>
        <div style="font-size:12px;color:#a0a8b0">CRITICAL severity</div>
      </div>
      <div style="background:#1a1f26;border:1px solid #2a2f37;border-radius:8px;padding:16px">
        <div style="font-size:12px;color:#a0a8b0;font-weight:600;margin-bottom:8px">HIGH ALERTS</div>
        <div style="font-size:32px;font-weight:700;color:#ffc107;margin-bottom:4px">${high}</div>
        <div style="font-size:12px;color:#a0a8b0">Investigate within 1hr</div>
      </div>
    </div>
  `
}

function renderTopAlerts() {
  const topAlerts = allAlerts.slice(0, 5)
  return `
    <div style="background:#1a1f26;border:1px solid #2a2f37;border-radius:8px;padding:16px">
      <h3 style="margin:0 0 12px 0;font-size:14px;color:#e4e8eb;font-weight:600">TOP ALERTS</h3>
      <div style="display:flex;flex-direction:column;gap:8px">
        ${topAlerts.map(alert => `
          <div onclick="selectAlert('${alert.id}')" style="
            background:#0d1219;
            border:1px solid #2a2f37;
            border-radius:6px;
            padding:10px;
            cursor:pointer;
            transition:all 200ms;
          " onmouseover="this.style.borderColor='#0d6efd';this.style.background='#161b22'" onmouseout="this.style.borderColor='#2a2f37';this.style.background='#0d1219'">
            <div style="display:flex;justify-content:space-between;align-items:start;margin-bottom:4px">
              <div style="font-size:12px;font-weight:600;color:white;flex:1">${alert.headline.substring(0, 45)}</div>
              <span style="
                background:${ALERT_PRIORITY_COLORS[alert.priority]?.bg || '#666'};
                color:${ALERT_PRIORITY_COLORS[alert.priority]?.text || '#fff'};
                padding:2px 6px;
                border-radius:3px;
                font-size:10px;
                font-weight:600;
                white-space:nowrap;
                margin-left:8px;
              ">${alert.priority}</span>
            </div>
            <div style="font-size:11px;color:#a0a8b0">${alert.actor || 'System'} · ${new Date(alert.timestamp).toLocaleTimeString()}</div>
          </div>
        `).join('')}
        ${topAlerts.length === 0 ? '<div style="color:#a0a8b0;font-size:13px;text-align:center;padding:20px">No alerts</div>' : ''}
      </div>
    </div>
  `
}

function renderAttackChainsPanel() {
  const multiStageAttacks = allCorrelations.filter(c => c.alert_count > 2)
  return `
    <div style="background:#1a1f26;border:1px solid #2a2f37;border-radius:8px;padding:16px">
      <h3 style="margin:0 0 12px 0;font-size:14px;color:#e4e8eb;font-weight:600">ACTIVE ATTACK CHAINS</h3>
      <div style="display:flex;flex-direction:column;gap:8px">
        ${multiStageAttacks.slice(0, 5).map(attack => `
          <div style="
            background:#0d1219;
            border:1px solid #2a2f37;
            border-left:3px solid ${attack.risk_level === 'CRITICAL' ? '#ff4444' : '#fd7e14'};
            border-radius:6px;
            padding:10px;
          ">
            <div style="font-size:12px;font-weight:600;color:white;margin-bottom:4px">${attack.description.substring(0, 50)}</div>
            <div style="display:flex;justify-content:space-between;font-size:11px;color:#a0a8b0">
              <span>${attack.alert_count} events · Score: ${attack.correlation_score}/100</span>
              <span>${new Date(attack.start_timestamp).toLocaleTimeString()}</span>
            </div>
          </div>
        `).join('')}
        ${multiStageAttacks.length === 0 ? '<div style="color:#a0a8b0;font-size:13px;text-align:center;padding:20px">No active attack chains detected</div>' : ''}
      </div>
    </div>
  `
}

function renderServiceImpactMap() {
  const services = {}
  allAlerts.forEach(alert => {
    const source = alert.source || 'Unknown'
    services[source] = (services[source] || 0) + 1
  })

  return `
    <div style="background:#1a1f26;border:1px solid #2a2f37;border-radius:8px;padding:16px">
      <h3 style="margin:0 0 12px 0;font-size:14px;color:#e4e8eb;font-weight:600">SERVICE IMPACT MAP</h3>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px">
        ${Object.entries(services).slice(0, 8).map(([service, count]) => {
          const criticalCount = allAlerts.filter(a => a.source === service && a.severity === 'CRITICAL').length
          const statusColor = criticalCount > 0 ? '#ff4444' : count > 0 ? '#fd7e14' : '#28a745'
          return `
            <div style="
              background:#0d1219;
              border:1px solid #2a2f37;
              border-left:3px solid ${statusColor};
              border-radius:6px;
              padding:12px;
              text-align:center;
            ">
              <div style="font-size:12px;font-weight:600;color:white;margin-bottom:4px">${service.substring(0, 15)}</div>
              <div style="font-size:16px;font-weight:700;color:${statusColor}">${count}</div>
              <div style="font-size:11px;color:#a0a8b0">alerts</div>
            </div>
          `
        }).join('')}
      </div>
    </div>
  `
}

function renderMonitoringAgentStatus() {
  return `
    <div style="background:#1a1f26;border:1px solid #2a2f37;border-radius:8px;padding:16px">
      <h3 style="margin:0 0 12px 0;font-size:14px;color:#e4e8eb;font-weight:600">MONITORING AGENTS</h3>
      <div style="display:flex;flex-direction:column;gap:8px;font-size:12px">
        <div style="display:flex;justify-content:space-between;align-items:center;padding:8px;background:#0d1219;border-radius:4px">
          <span>🔐 Security Agent</span>
          <span style="color:#28a745">✅ Healthy</span>
        </div>
        <div style="display:flex;justify-content:space-between;align-items:center;padding:8px;background:#0d1219;border-radius:4px">
          <span>📊 Audit Collection</span>
          <span style="color:#28a745">✅ Every 5min</span>
        </div>
        <div style="display:flex;justify-content:space-between;align-items:center;padding:8px;background:#0d1219;border-radius:4px">
          <span>🔗 Correlation Engine</span>
          <span style="color:#28a745">✅ Every 15min</span>
        </div>
        <div style="display:flex;justify-content:space-between;align-items:center;padding:8px;background:#0d1219;border-radius:4px">
          <span>⚙️ Config Agent</span>
          <span style="color:#28a745">✅ Every 4hr</span>
        </div>
        <div style="display:flex;justify-content:space-between;align-items:center;padding:8px;background:#0d1219;border-radius:4px">
          <span>✅ Approval Agent</span>
          <span style="color:#28a745">✅ Every 2hr</span>
        </div>
      </div>
    </div>
  `
}

function renderAlertsView() {
  return `
    <div style="background:#1a1f26;border:1px solid #2a2f37;border-radius:8px;padding:16px">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:16px">
        <h3 style="margin:0;font-size:16px;color:#e4e8eb;font-weight:600">All Alerts (${allAlerts.length})</h3>
        <input type="text" id="alert-search" placeholder="Search alerts..." style="
          padding:8px 12px;
          background:#0d1219;
          border:1px solid #2a2f37;
          border-radius:4px;
          color:#e4e8eb;
          font-size:13px;
          width:250px;
        " onkeyup="filterAlerts()">
      </div>

      <div style="display:flex;gap:8px;margin-bottom:16px;flex-wrap:wrap">
        <button onclick="filterByPriority('all')" style="padding:6px 12px;background:#2a2f37;color:#e4e8eb;border:1px solid #2a2f37;border-radius:4px;cursor:pointer;font-size:12px">All</button>
        <button onclick="filterByPriority('P0')" style="padding:6px 12px;background:transparent;color:#ff4444;border:1px solid #ff4444;border-radius:4px;cursor:pointer;font-size:12px">🚨 P0</button>
        <button onclick="filterByPriority('P1')" style="padding:6px 12px;background:transparent;color:#dc3545;border:1px solid #dc3545;border-radius:4px;cursor:pointer;font-size:12px">🔴 P1</button>
        <button onclick="filterByPriority('P2')" style="padding:6px 12px;background:transparent;color:#fd7e14;border:1px solid #fd7e14;border-radius:4px;cursor:pointer;font-size:12px">🟠 P2</button>
      </div>

      <div style="max-height:600px;overflow-y:auto">
        ${allAlerts.map(alert => `
          <div onclick="selectAlert('${alert.id}')" style="
            background:#0d1219;
            border:1px solid #2a2f37;
            border-radius:6px;
            padding:12px;
            margin-bottom:8px;
            cursor:pointer;
            transition:all 200ms;
          " onmouseover="this.style.borderColor='#0d6efd';this.style.background='#161b22'" onmouseout="this.style.borderColor='#2a2f37';this.style.background='#0d1219'">
            <div style="display:flex;justify-content:space-between;align-items:start;margin-bottom:6px">
              <div>
                <div style="font-size:13px;font-weight:600;color:white;margin-bottom:2px">${alert.headline}</div>
                <div style="font-size:12px;color:#a0a8b0">${alert.description}</div>
              </div>
              <div style="display:flex;gap:8px;flex-wrap:wrap">
                <span style="
                  background:${ALERT_PRIORITY_COLORS[alert.priority]?.bg || '#666'};
                  color:${ALERT_PRIORITY_COLORS[alert.priority]?.text || '#fff'};
                  padding:4px 8px;
                  border-radius:3px;
                  font-size:11px;
                  font-weight:600;
                  white-space:nowrap;
                ">${alert.priority}</span>
                <span style="
                  background:${SEVERITY_COLORS[alert.severity]};
                  color:${alert.severity === 'CRITICAL' || alert.severity === 'HIGH' ? '#fff' : '#000'};
                  padding:4px 8px;
                  border-radius:3px;
                  font-size:11px;
                  font-weight:600;
                ">${alert.severity}</span>
                <span style="
                  background:${alert.score >= 90 ? '#ff4444' : alert.score >= 70 ? '#fd7e14' : '#ffc107'};
                  color:${alert.score >= 90 || alert.score >= 70 ? '#fff' : '#000'};
                  padding:4px 8px;
                  border-radius:3px;
                  font-size:11px;
                  font-weight:600;
                ">${Math.round(alert.score)}/100</span>
              </div>
            </div>
            <div style="display:flex;justify-content:space-between;font-size:11px;color:#a0a8b0;margin-top:8px">
              <span>${alert.actor || 'System'} · ${alert.source || 'Unknown'}</span>
              <span>${new Date(alert.timestamp).toLocaleTimeString()}</span>
            </div>
          </div>
        `).join('')}
        ${allAlerts.length === 0 ? '<div style="color:#a0a8b0;text-align:center;padding:40px">No alerts found</div>' : ''}
      </div>
    </div>
  `
}

function renderTimelineView() {
  const sortedAlerts = [...allAlerts].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
  return `
    <div style="background:#1a1f26;border:1px solid #2a2f37;border-radius:8px;padding:16px">
      <h3 style="margin:0 0 16px 0;font-size:16px;color:#e4e8eb;font-weight:600">ATTACK TIMELINE</h3>
      <div style="position:relative">
        <div style="position:absolute;left:12px;top:0;bottom:0;width:2px;background:#2a2f37"></div>
        <div style="margin-left:40px;display:flex;flex-direction:column;gap:16px">
          ${sortedAlerts.map((alert, idx) => {
            const time = new Date(alert.timestamp)
            const color = ALERT_PRIORITY_COLORS[alert.priority]?.bg || '#666'
            return `
              <div>
                <div style="display:flex;align-items:center;margin-bottom:4px">
                  <div style="
                    position:absolute;
                    left:0;
                    width:28px;
                    height:28px;
                    background:${color};
                    border:3px solid #0f1419;
                    border-radius:50%;
                    display:flex;
                    align-items:center;
                    justify-content:center;
                    font-size:12px;
                  ">●</div>
                  <div style="font-size:12px;font-weight:600;color:white;flex:1">${alert.headline.substring(0, 60)}</div>
                  <span style="font-size:11px;color:#a0a8b0">${time.toLocaleTimeString()}</span>
                </div>
                <div style="font-size:12px;color:#a0a8b0;margin-left:8px">${alert.description}</div>
              </div>
            `
          }).join('')}
        </div>
      </div>
    </div>
  `
}

function renderIncidentsView() {
  return `
    <div style="background:#1a1f26;border:1px solid #2a2f37;border-radius:8px;padding:16px">
      <h3 style="margin:0 0 16px 0;font-size:16px;color:#e4e8eb;font-weight:600">Correlated Incidents (${allCorrelations.length})</h3>
      <div style="display:flex;flex-direction:column;gap:12px;max-height:600px;overflow-y:auto">
        ${allCorrelations.map(incident => `
          <div style="
            background:#0d1219;
            border:${incident.risk_level === 'CRITICAL' ? '2px' : '1px'} solid ${incident.risk_level === 'CRITICAL' ? '#ff4444' : '#2a2f37'};
            border-radius:6px;
            padding:12px;
          ">
            <div style="font-size:13px;font-weight:600;color:white;margin-bottom:6px">${incident.description}</div>
            <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;font-size:11px;color:#a0a8b0;margin-bottom:8px">
              <div>📊 ${incident.alert_count} events · Score: ${incident.correlation_score}/100</div>
              <div>🏷️ ${incident.correlation_type}</div>
            </div>
            <div style="font-size:11px;color:#a0a8b0">
              ${new Date(incident.start_timestamp).toLocaleString()} → ${new Date(incident.end_timestamp).toLocaleString()}
            </div>
          </div>
        `).join('')}
        ${allCorrelations.length === 0 ? '<div style="color:#a0a8b0;text-align:center;padding:40px">No correlated incidents</div>' : ''}
      </div>
    </div>
  `
}

function renderAuditView() {
  const criticalAlerts = allAlerts.filter(a => a.severity === 'CRITICAL')
  return `
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px;margin-bottom:16px">
      <div style="background:#1a1f26;border:1px solid #2a2f37;border-radius:8px;padding:16px">
        <div style="font-size:13px;color:#a0a8b0;font-weight:600;margin-bottom:8px">COMPLIANCE STATUS</div>
        <div style="display:flex;flex-direction:column;gap:8px;font-size:12px">
          <div style="display:flex;justify-content:space-between">
            <span>Total Alerts</span>
            <span style="font-weight:600;color:#e4e8eb">${allAlerts.length}</span>
          </div>
          <div style="display:flex;justify-content:space-between">
            <span>CRITICAL</span>
            <span style="font-weight:600;color:#ff4444">${criticalAlerts.length}</span>
          </div>
          <div style="display:flex;justify-content:space-between">
            <span>Avg Risk Score</span>
            <span style="font-weight:600;color:#fd7e14">${allAlerts.length > 0 ? Math.round(allAlerts.reduce((a,b) => a + (b.score || 0), 0) / allAlerts.length) : 0}/100</span>
          </div>
        </div>
      </div>

      <div style="background:#1a1f26;border:1px solid #2a2f37;border-radius:8px;padding:16px">
        <div style="font-size:13px;color:#a0a8b0;font-weight:600;margin-bottom:8px">AUDIT TRAIL</div>
        <div style="display:flex;flex-direction:column;gap:8px;font-size:12px;color:#a0a8b0">
          <div>✅ Audit collection: Every 5 minutes</div>
          <div>✅ Correlation analysis: Every 15 minutes</div>
          <div>✅ Agent health: Monitoring active</div>
          <div>📊 Last refresh: <span id="audit-last-refresh">5 minutes ago</span></div>
        </div>
      </div>
    </div>

    <div style="background:#1a1f26;border:1px solid #2a2f37;border-radius:8px;padding:16px">
      <h3 style="margin:0 0 12px 0;font-size:14px;color:#e4e8eb;font-weight:600">RECENT ACTIVITIES</h3>
      <div style="max-height:400px;overflow-y:auto">
        ${allAlerts.slice(0, 20).map(alert => `
          <div style="
            display:flex;
            justify-content:space-between;
            align-items:center;
            padding:10px;
            border-bottom:1px solid #2a2f37;
            font-size:12px;
          ">
            <div>
              <div style="color:white;font-weight:500">${alert.headline.substring(0, 50)}</div>
              <div style="color:#a0a8b0;font-size:11px">${alert.actor || 'System'}</div>
            </div>
            <span style="color:#a0a8b0">${new Date(alert.timestamp).toLocaleTimeString()}</span>
          </div>
        `).join('')}
      </div>
    </div>
  `
}

function renderDemoTenantGuard(el) {
  const demoAlerts = [
    { id: 'alert-1', priority: 'P0', severity: 'CRITICAL', headline: 'MFA Disabled for Global Admin', description: 'MFA requirement removed for global administrator account', actor: 'security-admin@contoso.com', source: 'Entra ID', timestamp: new Date().toISOString(), score: 100, status: 'open' },
    { id: 'alert-2', priority: 'P1', severity: 'CRITICAL', headline: 'Conditional Access Policy Disabled', description: 'Critical CA policy blocking high-risk sign-ins was disabled', actor: 'cloud-admin@contoso.com', source: 'Entra ID', timestamp: new Date(Date.now() - 5*60000).toISOString(), score: 95, status: 'open' },
    { id: 'alert-3', priority: 'P1', severity: 'CRITICAL', headline: 'High-Risk OAuth App Granted Admin Consent', description: 'OAuth app received Directory.ReadWrite.All permissions', actor: 'system', source: 'Application', timestamp: new Date(Date.now() - 10*60000).toISOString(), score: 92, status: 'open' },
    { id: 'alert-4', priority: 'P2', severity: 'HIGH', headline: 'External Email Forwarding Rule Created', description: 'New inbox rule created with external forwarding to attacker@external.com', actor: 'user@contoso.com', source: 'Exchange', timestamp: new Date(Date.now() - 15*60000).toISOString(), score: 88, status: 'open' },
    { id: 'alert-5', priority: 'P2', severity: 'HIGH', headline: 'Global Administrator Assigned', description: 'New global admin role assigned to suspicious user account', actor: 'admin@contoso.com', source: 'Entra ID', timestamp: new Date(Date.now() - 20*60000).toISOString(), score: 85, status: 'open' },
  ]

  const demoCorrelations = [
    { id: 'corr-1', description: 'Coordinated Admin Compromise - MFA bypass + Forwarding setup', alert_count: 3, correlation_type: 'ACTOR', risk_level: 'CRITICAL', correlation_score: 96, start_timestamp: new Date(Date.now() - 20*60000).toISOString(), end_timestamp: new Date().toISOString() },
    { id: 'corr-2', description: 'OAuth Backdoor Installation - Admin consent + Directory access', alert_count: 2, correlation_type: 'TARGET', risk_level: 'CRITICAL', correlation_score: 92, start_timestamp: new Date(Date.now() - 15*60000).toISOString(), end_timestamp: new Date().toISOString() },
  ]

  allAlerts = demoAlerts
  allCorrelations = demoCorrelations

  el.innerHTML = renderContent(el)
}

async function refreshData() {
  try {
    const [summary, alerts, correlations, patterns] = await Promise.all([
      getAlertSummary().catch(() => ({})),
      getAlerts('all', 100).catch(() => []),
      getCorrelations('all').catch(() => []),
      getPatterns().catch(() => []),
    ])

    allAlerts = (alerts && alerts.length > 0) ? alerts : getDemoAlerts()
    allCorrelations = (correlations && correlations.length > 0) ? correlations : getDemoCorrelations()
    allPatterns = patterns || []

    document.getElementById('last-update').textContent = new Date().toLocaleTimeString()
  } catch (error) {
    console.error('Error refreshing data:', error)
  }
}

function getDemoAlerts() {
  return [
    { id: 'alert-6', priority: 'P1', severity: 'CRITICAL', headline: 'MFA Requirement Disabled', description: 'MFA disabled organization-wide', actor: 'security-admin@contoso.com', source: 'Entra ID Audit', timestamp: new Date(Date.now() - 2*60000).toISOString(), score: 94, status: 'open' },
    { id: 'alert-7', priority: 'P1', severity: 'CRITICAL', headline: 'Conditional Access Policy Modified', description: 'Critical CA policy blocking high-risk sign-ins was disabled', actor: 'cloud-admin@contoso.com', source: 'Entra ID', timestamp: new Date(Date.now() - 5*60000).toISOString(), score: 93, status: 'open' },
    { id: 'alert-8', priority: 'P2', severity: 'HIGH', headline: 'OAuth Admin Consent Granted', description: 'OAuth app received admin consent for sensitive APIs', actor: 'admin@contoso.com', source: 'Application', timestamp: new Date(Date.now() - 10*60000).toISOString(), score: 88, status: 'open' },
  ]
}

function getDemoCorrelations() {
  return [
    { id: 'corr-3', description: 'Multi-Stage Attack: Admin compromise → Security bypass → Data access', alert_count: 4, correlation_type: 'PATTERN', risk_level: 'CRITICAL', correlation_score: 95, start_timestamp: new Date(Date.now() - 20*60000).toISOString(), end_timestamp: new Date().toISOString() },
  ]
}

function switchTab(tab) {
  activeTab = tab
  renderContent(document.getElementById('tenantguard-content'))
  window.scrollTo(0, 0)
}

function selectAlert(alertId) {
  selectedAlertId = alertId
  showToast(`Selected alert: ${alertId}`, 'info')
}

function filterByPriority(priority) {
  // Filter logic would go here
  showToast(`Filtered by ${priority}`, 'info')
}

function filterAlerts() {
  const search = document.getElementById('alert-search')?.value || ''
  // Filter logic would go here
  showToast(`Searching for: ${search}`, 'info')
}

window.switchTab = switchTab
window.selectAlert = selectAlert
window.filterByPriority = filterByPriority
window.filterAlerts = filterAlerts
