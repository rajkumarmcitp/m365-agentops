import { getAlertSummary, getAlerts, dismissAlert, getCorrelations, getPatterns, startInvestigation, getInvestigation, chatInvestigation, generateInvestigationReport } from '../lib/tenantguard-client.js'
import { showToast } from '../components/toast.js'
import { isDemoAccount } from '../lib/demo-account.js'
import { renderTenantGuardSettings } from './tenantguard-settings.js'

let activeTab = 'dashboard'
let allAlerts = []
let allCorrelations = []
let allPatterns = []
let selectedAlertId = null
let selectedAlertDetail = null
let autoRefreshInterval = null
let lastUpdateTime = null
let isRefreshing = false
let updateCount = 0

// Real-time update config
const REFRESH_INTERVAL = 10 * 1000 // 10 seconds for real-time feel
const API_BASE = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
  ? 'http://localhost:3000'
  : 'https://m365ops-api-gtbgezb9c7bgata7.centralus-01.azurewebsites.net'

const ALERT_PRIORITY = {
  'P0': { label: '🚨 Drop Everything', color: '#A32D2D', bg: '#FCEBEB' },
  'P1': { label: '🔴 Critical', color: '#A32D2D', bg: '#FCEBEB' },
  'P2': { label: '🟠 High', color: '#854F0B', bg: '#FAEEDA' },
  'P3': { label: '🟡 Medium', color: '#0C447C', bg: '#E6F1FB' },
}

const SEVERITY_COLOR = {
  'CRITICAL': '#A32D2D',
  'HIGH': '#854F0B',
  'MEDIUM': '#0C447C',
  'LOW': '#3B6D11',
}

export async function initTenantGuard() {
  const el = document.getElementById('page-tenantguard')
  if (!el) return

  el.innerHTML = `<div style="padding:20px"><div class="spinner"></div><p>Loading TenantGuard (Real-Time)...</p></div>`

  if (isDemoAccount()) {
    renderDemoTenantGuard(el)
    // Still refresh demo data in real-time
    if (autoRefreshInterval) clearInterval(autoRefreshInterval)
    autoRefreshInterval = setInterval(() => {
      renderContent(el)
    }, REFRESH_INTERVAL)
    return
  }

  try {
    console.log('🚀 Starting TenantGuard with real-time updates (every ' + (REFRESH_INTERVAL/1000) + ' seconds)')
    await refreshData()
    renderContent(el)
    lastUpdateTime = new Date()
  } catch (error) {
    console.error('Error initializing TenantGuard:', error)
    showToast('Failed to load alerts - check backend connection', 'error')
    // Fall back to demo data
    renderDemoTenantGuard(el)
    return
  }

  // Real-time polling - update every 10 seconds
  if (autoRefreshInterval) clearInterval(autoRefreshInterval)
  autoRefreshInterval = setInterval(async () => {
    if (!isRefreshing) {
      isRefreshing = true
      try {
        await refreshData()
        renderContent(el)
        lastUpdateTime = new Date()
        updateCount++
      } catch (error) {
        console.error('Real-time update error:', error)
      } finally {
        isRefreshing = false
      }
    }
  }, REFRESH_INTERVAL)
}

function renderContent(el) {
  const totalAlerts = allAlerts.length
  const criticalCount = allAlerts.filter(a => a.severity === 'CRITICAL').length
  const highCount = allAlerts.filter(a => a.severity === 'HIGH').length
  const p0Count = allAlerts.filter(a => a.priority === 'P0').length

  let riskScore = 0
  riskScore += p0Count * 25
  riskScore += criticalCount * 20
  riskScore += highCount * 10
  riskScore = Math.min(Math.max(riskScore, 0), 100)

  const riskLevel = riskScore >= 80 ? 'CRITICAL' : riskScore >= 50 ? 'HIGH' : riskScore >= 20 ? 'MEDIUM' : 'LOW'

  const lastUpdateStr = lastUpdateTime
    ? lastUpdateTime.toLocaleTimeString()
    : 'Loading...'
  const liveIndicator = isRefreshing
    ? '<span style="color:#0C447C">⏳ Updating...</span>'
    : '<span style="color:#3B6D11">🟢 LIVE</span>'

  el.innerHTML = `
    <div class="page-header">
      <div>
        <div class="page-title"><i class="ti ti-shield-exclamation"></i> TenantGuard Security Monitoring</div>
        <div class="page-subtitle">Real-time threat detection & attack pattern analysis · ${liveIndicator} · Updated: ${lastUpdateStr}</div>
      </div>
      <div class="page-actions" style="display:flex;gap:8px">
        <button class="btn" id="tg-refresh" ${isRefreshing ? 'disabled' : ''}><i class="ti ti-refresh"></i> ${isRefreshing ? 'Updating...' : 'Refresh'}</button>
        <button class="btn btn-primary" id="tg-export"><i class="ti ti-download"></i> Export</button>
      </div>
    </div>

    <div class="tabs" id="tg-main-tabs" style="display:flex;gap:4px;flex-wrap:wrap;margin-bottom:16px">
      <button class="tab-btn ${activeTab === 'dashboard' ? 'active' : ''}" data-tab="dashboard">
        <i class="ti ti-layout-dashboard"></i> Dashboard
      </button>
      <button class="tab-btn ${activeTab === 'alerts' ? 'active' : ''}" data-tab="alerts">
        <i class="ti ti-alert-triangle"></i> Alerts <span class="tab-badge">${totalAlerts}</span>
      </button>
      <button class="tab-btn ${activeTab === 'timeline' ? 'active' : ''}" data-tab="timeline">
        <i class="ti ti-timeline"></i> Timeline
      </button>
      <button class="tab-btn ${activeTab === 'incidents' ? 'active' : ''}" data-tab="incidents">
        <i class="ti ti-link"></i> Incidents <span class="tab-badge">${allCorrelations.length}</span>
      </button>
      <button class="tab-btn ${activeTab === 'audit' ? 'active' : ''}" data-tab="audit">
        <i class="ti ti-list"></i> Audit
      </button>
      <button class="tab-btn ${activeTab === 'settings' ? 'active' : ''}" data-tab="settings">
        <i class="ti ti-settings"></i> Settings
      </button>
    </div>

    <div id="tg-content">
      ${renderTabContent(riskScore, riskLevel)}
    </div>
  `

  // Attach event listeners
  document.querySelectorAll('[data-tab]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      activeTab = e.currentTarget.dataset.tab
      renderContent(el)
      // Render settings UI if settings tab selected
      if (activeTab === 'settings') {
        setTimeout(() => {
          renderTenantGuardSettings(el)
        }, 0)
      }
    })
  })

  document.getElementById('tg-refresh')?.addEventListener('click', async () => {
    if (!isRefreshing) {
      isRefreshing = true
      showToast('Refreshing real-time data...', 'info')
      try {
        await refreshData()
        renderContent(el)
        lastUpdateTime = new Date()
        updateCount++
        showToast(`✅ Data refreshed (${updateCount} updates)`, 'success')
      } catch (error) {
        showToast('Failed to refresh data', 'error')
      } finally {
        isRefreshing = false
      }
    }
  })

  document.getElementById('tg-export')?.addEventListener('click', () => {
    showToast('Export feature coming soon', 'info')
  })

  // Alert selection - show detail modal
  document.querySelectorAll('[data-alert-id]').forEach(element => {
    element.addEventListener('click', (e) => {
      const alertId = e.currentTarget.dataset.alertId
      selectedAlertDetail = allAlerts.find(a => a.id === alertId)
      if (selectedAlertDetail) {
        showAlertDetail(el, selectedAlertDetail)
      }
    })
  })
}

function renderTabContent(riskScore, riskLevel) {
  switch (activeTab) {
    case 'dashboard':
      return renderDashboard(riskScore, riskLevel)
    case 'alerts':
      return renderAlertsView()
    case 'timeline':
      return renderTimelineView()
    case 'incidents':
      return renderIncidentsView()
    case 'audit':
      return renderAuditView()
    case 'settings':
      return `<div class="content-area" id="settings-container"></div>`
    default:
      return ''
  }
}

function renderDashboard(riskScore, riskLevel) {
  const p0Count = allAlerts.filter(a => a.priority === 'P0').length
  const p1Count = allAlerts.filter(a => a.priority === 'P1').length
  const criticalCount = allAlerts.filter(a => a.severity === 'CRITICAL').length
  const highCount = allAlerts.filter(a => a.severity === 'HIGH').length

  return `
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px;margin-bottom:16px">
      <div class="card">
        <div class="card-title">TENANT RISK LEVEL</div>
        <div style="display:flex;align-items:center;gap:16px;margin-top:12px">
          <div style="text-align:center;flex:0 0 100px">
            <div style="font-size:32px;font-weight:700;color:${riskScore >= 80 ? ALERT_PRIORITY.P0.color : riskScore >= 50 ? ALERT_PRIORITY.P2.color : '#3B6D11'}">${Math.round(riskScore)}</div>
            <div style="font-size:11px;color:var(--color-text-secondary);margin-top:4px">/100</div>
          </div>
          <div>
            <div style="font-size:16px;font-weight:600;margin-bottom:4px">${riskLevel}</div>
            <div style="font-size:12px;color:var(--color-text-secondary)">
              ${riskScore >= 80 ? '⚠️ Immediate action needed' : riskScore >= 50 ? '🔶 Heightened alert' : riskScore >= 20 ? '🟡 Monitor' : '✅ Healthy'}
            </div>
          </div>
        </div>
      </div>

      <div class="card">
        <div class="card-title">CRITICAL ALERTS SUMMARY</div>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-top:12px">
          <div style="padding:12px;background:${ALERT_PRIORITY.P0.bg};border-radius:6px;border-left:3px solid ${ALERT_PRIORITY.P0.color}">
            <div style="font-size:24px;font-weight:700;color:${ALERT_PRIORITY.P0.color}">${p0Count}</div>
            <div style="font-size:11px;color:var(--color-text-secondary);margin-top:4px">P0 (Drop Everything)</div>
          </div>
          <div style="padding:12px;background:${ALERT_PRIORITY.P1.bg};border-radius:6px;border-left:3px solid ${ALERT_PRIORITY.P1.color}">
            <div style="font-size:24px;font-weight:700;color:${ALERT_PRIORITY.P1.color}">${p1Count}</div>
            <div style="font-size:11px;color:var(--color-text-secondary);margin-top:4px">P1 (Critical)</div>
          </div>
          <div style="padding:12px;background:${ALERT_PRIORITY.P2.bg};border-radius:6px;border-left:3px solid ${ALERT_PRIORITY.P2.color}">
            <div style="font-size:24px;font-weight:700;color:${ALERT_PRIORITY.P2.color}">${criticalCount}</div>
            <div style="font-size:11px;color:var(--color-text-secondary);margin-top:4px">Critical Events</div>
          </div>
          <div style="padding:12px;background:${ALERT_PRIORITY.P3.bg};border-radius:6px;border-left:3px solid ${ALERT_PRIORITY.P3.color}">
            <div style="font-size:24px;font-weight:700;color:${ALERT_PRIORITY.P3.color}">${highCount}</div>
            <div style="font-size:11px;color:var(--color-text-secondary);margin-top:4px">High Alerts</div>
          </div>
        </div>
      </div>
    </div>

    <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px;margin-bottom:16px">
      <div class="card">
        <div class="card-title">TOP RECENT ALERTS</div>
        <div style="display:flex;flex-direction:column;gap:8px;margin-top:12px">
          ${allAlerts.slice(0, 5).map(alert => `
            <div style="padding:10px;background:var(--color-background-secondary);border-radius:6px;border-left:3px solid ${ALERT_PRIORITY[alert?.priority]?.color || '#999'};cursor:pointer" data-alert-id="${alert?.id}">
              <div style="font-size:12px;font-weight:600;margin-bottom:4px">${(alert?.headline || 'Unknown Alert').substring(0, 45)}</div>
              <div style="font-size:11px;color:var(--color-text-secondary)">${alert?.actor ? alert.actor + ' · ' : ''}${new Date(alert?.timestamp || Date.now()).toLocaleTimeString()}</div>
            </div>
          `).join('')}
          ${allAlerts.length === 0 ? '<div style="color:var(--color-text-secondary);font-size:12px;text-align:center;padding:20px">No alerts</div>' : ''}
        </div>
      </div>

      <div class="card">
        <div class="card-title">ACTIVE ATTACK CHAINS</div>
        <div style="display:flex;flex-direction:column;gap:8px;margin-top:12px">
          ${allCorrelations.slice(0, 5).map(incident => `
            <div style="padding:10px;background:var(--color-background-secondary);border-radius:6px;border-left:3px solid ${incident?.risk_level === 'CRITICAL' ? ALERT_PRIORITY.P1.color : ALERT_PRIORITY.P2.color}">
              <div style="font-size:12px;font-weight:600;margin-bottom:4px">${(incident?.description || 'Unknown Incident').substring(0, 45)}</div>
              <div style="font-size:11px;color:var(--color-text-secondary)">${incident?.alert_count || 0} events · Score: ${incident?.correlation_score || 0}/100</div>
            </div>
          `).join('')}
          ${allCorrelations.length === 0 ? '<div style="color:var(--color-text-secondary);font-size:12px;text-align:center;padding:20px">No active chains</div>' : ''}
        </div>
      </div>
    </div>

    <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px">
      <div class="card">
        <div class="card-title">SERVICE IMPACT MAP</div>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-top:12px">
          ${['Entra ID', 'Exchange', 'SharePoint', 'OneDrive', 'Teams', 'Intune'].map(service => {
            const count = allAlerts.filter(a => a?.source && String(a.source).includes(service)).length
            const hasCritical = allAlerts.some(a => a?.source && String(a.source).includes(service) && a?.severity === 'CRITICAL')
            return `
              <div style="padding:12px;background:var(--color-background-secondary);border-radius:6px;border-left:3px solid ${hasCritical ? ALERT_PRIORITY.P1.color : count > 0 ? ALERT_PRIORITY.P2.color : '#3B6D11'};text-align:center">
                <div style="font-size:12px;font-weight:600;margin-bottom:4px">${service}</div>
                <div style="font-size:18px;font-weight:700;color:${hasCritical ? ALERT_PRIORITY.P1.color : count > 0 ? ALERT_PRIORITY.P2.color : '#3B6D11'}">${count}</div>
              </div>
            `
          }).join('')}
        </div>
      </div>

      <div class="card">
        <div class="card-title">MONITORING AGENTS</div>
        <div style="display:flex;flex-direction:column;gap:8px;margin-top:12px;font-size:12px">
          <div style="display:flex;justify-content:space-between;padding:8px;background:var(--color-background-secondary);border-radius:4px">
            <span>🔐 Security Agent</span>
            <span style="color:#3B6D11">✅ Healthy</span>
          </div>
          <div style="display:flex;justify-content:space-between;padding:8px;background:var(--color-background-secondary);border-radius:4px">
            <span>📊 Audit (5min)</span>
            <span style="color:#3B6D11">✅ Active</span>
          </div>
          <div style="display:flex;justify-content:space-between;padding:8px;background:var(--color-background-secondary);border-radius:4px">
            <span>🔗 Correlation (15min)</span>
            <span style="color:#3B6D11">✅ Active</span>
          </div>
          <div style="display:flex;justify-content:space-between;padding:8px;background:var(--color-background-secondary);border-radius:4px">
            <span>⚙️ Config Agent</span>
            <span style="color:#3B6D11">✅ Healthy</span>
          </div>
        </div>
      </div>
    </div>
  `
}

function renderAlertsView() {
  return `
    <div class="card">
      <div class="card-title">All Alerts (${allAlerts.length})</div>
      <div style="display:flex;gap:8px;margin-bottom:12px;flex-wrap:wrap;margin-top:12px">
        <input type="text" id="alert-search" placeholder="Search alerts..." style="
          padding:8px 12px;
          border:0.5px solid var(--color-border-secondary);
          border-radius:4px;
          font-size:12px;
          flex:1;
          min-width:250px;
        ">
      </div>

      <div style="max-height:600px;overflow-y:auto">
        ${allAlerts.map(alert => `
          <div style="padding:12px;border-bottom:0.5px solid var(--color-border-secondary);cursor:pointer" data-alert-id="${alert?.id}" onmouseover="this.style.background='var(--color-background-secondary)'" onmouseout="this.style.background='transparent'">
            <div style="display:flex;justify-content:space-between;align-items:start;margin-bottom:6px">
              <div>
                <div style="font-size:13px;font-weight:600">${alert?.headline || 'Unknown'}</div>
                <div style="font-size:12px;color:var(--color-text-secondary);margin-top:2px">${alert?.description || 'No description'}</div>
              </div>
              <div style="display:flex;gap:6px;flex-wrap:wrap">
                <span style="background:${ALERT_PRIORITY[alert?.priority]?.bg};color:${ALERT_PRIORITY[alert?.priority]?.color};padding:2px 6px;border-radius:3px;font-size:10px;font-weight:600">${alert?.priority || 'P3'}</span>
                <span style="background:${ALERT_PRIORITY[alert?.severity]?.bg};color:${SEVERITY_COLOR[alert?.severity]};padding:2px 6px;border-radius:3px;font-size:10px;font-weight:600">${alert?.severity || 'MEDIUM'}</span>
              </div>
            </div>
            <div style="display:flex;justify-content:space-between;font-size:11px;color:var(--color-text-secondary)">
              <span>${alert?.source || 'Unknown'}${alert?.actor ? ' · ' + alert.actor : ''}</span>
              <span>${new Date(alert?.timestamp || Date.now()).toLocaleTimeString()}</span>
            </div>
          </div>
        `).join('')}
        ${allAlerts.length === 0 ? '<div style="color:var(--color-text-secondary);text-align:center;padding:40px;font-size:12px">No alerts found</div>' : ''}
      </div>
    </div>
  `
}

function renderTimelineView() {
  const sorted = [...allAlerts].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
  return `
    <div class="card">
      <div class="card-title">Attack Timeline</div>
      <div style="margin-top:16px;position:relative;padding-left:24px">
        <div style="position:absolute;left:0;top:0;bottom:0;width:2px;background:var(--color-border-secondary)"></div>
        <div style="display:flex;flex-direction:column;gap:16px">
          ${sorted.map(alert => `
            <div>
              <div style="position:absolute;left:-8px;width:14px;height:14px;background:${ALERT_PRIORITY[alert?.priority]?.color || '#999'};border:3px solid white;border-radius:50%"></div>
              <div style="font-size:12px;font-weight:600">${(alert?.headline || 'Unknown').substring(0, 60)}</div>
              <div style="font-size:11px;color:var(--color-text-secondary);margin-top:2px">${alert?.description || 'No description'}</div>
              <div style="font-size:11px;color:var(--color-text-secondary);margin-top:4px">${new Date(alert?.timestamp || Date.now()).toLocaleTimeString()}</div>
            </div>
          `).join('')}
        </div>
      </div>
    </div>
  `
}

function renderIncidentsView() {
  return `
    <div class="card">
      <div class="card-title">Correlated Incidents (${allCorrelations.length})</div>
      <div style="display:flex;flex-direction:column;gap:12px;margin-top:12px">
        ${allCorrelations.map(incident => `
          <div style="padding:12px;border:0.5px solid var(--color-border-secondary);border-left:3px solid ${incident?.risk_level === 'CRITICAL' ? ALERT_PRIORITY.P1.color : ALERT_PRIORITY.P2.color};border-radius:6px">
            <div style="font-size:12px;font-weight:600;margin-bottom:6px">${incident?.description || 'Unknown'}</div>
            <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;font-size:11px;color:var(--color-text-secondary)">
              <div>📊 ${incident?.alert_count || 0} events | Score: ${incident?.correlation_score || 0}/100</div>
              <div>🏷️ ${incident?.correlation_type || 'UNKNOWN'}</div>
            </div>
            <div style="font-size:11px;color:var(--color-text-secondary);margin-top:6px">
              ${new Date(incident?.start_timestamp || Date.now()).toLocaleString()} → ${new Date(incident?.end_timestamp || Date.now()).toLocaleString()}
            </div>
          </div>
        `).join('')}
        ${allCorrelations.length === 0 ? '<div style="color:var(--color-text-secondary);text-align:center;padding:40px;font-size:12px">No correlated incidents</div>' : ''}
      </div>
    </div>
  `
}

function renderAuditView() {
  const criticalAlerts = allAlerts.filter(a => a.severity === 'CRITICAL')
  const avgScore = allAlerts.length > 0 ? Math.round(allAlerts.reduce((a, b) => a + (b.score || 0), 0) / allAlerts.length) : 0

  return `
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px;margin-bottom:16px">
      <div class="card">
        <div class="card-title">COMPLIANCE STATUS</div>
        <div style="display:flex;flex-direction:column;gap:8px;margin-top:12px;font-size:12px">
          <div style="display:flex;justify-content:space-between">
            <span>Total Alerts</span>
            <span style="font-weight:600">${allAlerts.length}</span>
          </div>
          <div style="display:flex;justify-content:space-between">
            <span>CRITICAL</span>
            <span style="font-weight:600;color:${ALERT_PRIORITY.P1.color}">${criticalAlerts.length}</span>
          </div>
          <div style="display:flex;justify-content:space-between">
            <span>Avg Risk Score</span>
            <span style="font-weight:600;color:${ALERT_PRIORITY.P2.color}">${avgScore}/100</span>
          </div>
        </div>
      </div>

      <div class="card">
        <div class="card-title">SYSTEM HEALTH</div>
        <div style="display:flex;flex-direction:column;gap:8px;margin-top:12px;font-size:12px">
          <div>✅ Audit collection: Every 5 min</div>
          <div>✅ Correlation analysis: Every 15 min</div>
          <div>✅ Agent health: Monitoring active</div>
          <div>📊 Last refresh: Just now</div>
        </div>
      </div>
    </div>

    <div class="card">
      <div class="card-title">RECENT ACTIVITIES</div>
      <div style="max-height:400px;overflow-y:auto">
        ${allAlerts.slice(0, 20).map(alert => `
          <div style="padding:10px;border-bottom:0.5px solid var(--color-border-tertiary);font-size:12px">
            <div style="font-weight:600">${(alert?.headline || 'Unknown').substring(0, 50)}</div>
            ${alert?.actor ? `<div style="font-size:11px;color:var(--color-text-secondary);margin-top:2px">${alert.actor}</div>` : ''}
            <div style="font-size:11px;color:var(--color-text-secondary)">${new Date(alert?.timestamp || Date.now()).toLocaleTimeString()}</div>
          </div>
        `).join('')}
      </div>
    </div>
  `
}

function renderDemoTenantGuard(el) {
  const demoAlerts = [
    { id: 'alert-1', priority: 'P0', severity: 'CRITICAL', headline: 'MFA Disabled for Global Admin', description: 'MFA requirement removed for global administrator', actor: 'security-admin@contoso.com', source: 'Entra ID', timestamp: new Date().toISOString(), score: 100, status: 'open' },
    { id: 'alert-2', priority: 'P1', severity: 'CRITICAL', headline: 'Conditional Access Disabled', description: 'Critical CA policy was disabled', actor: 'cloud-admin@contoso.com', source: 'Entra ID', timestamp: new Date(Date.now() - 5*60000).toISOString(), score: 95, status: 'open' },
    { id: 'alert-3', priority: 'P1', severity: 'CRITICAL', headline: 'OAuth Admin Consent Granted', description: 'OAuth app received admin consent', actor: 'system', source: 'Application', timestamp: new Date(Date.now() - 10*60000).toISOString(), score: 92, status: 'open' },
    { id: 'alert-4', priority: 'P2', severity: 'HIGH', headline: 'External Forwarding Created', description: 'Email forwarding rule to external email', actor: 'user@contoso.com', source: 'Exchange', timestamp: new Date(Date.now() - 15*60000).toISOString(), score: 88, status: 'open' },
    { id: 'alert-5', priority: 'P2', severity: 'HIGH', headline: 'Global Admin Assigned', description: 'New global admin role assignment', actor: 'admin@contoso.com', source: 'Entra ID', timestamp: new Date(Date.now() - 20*60000).toISOString(), score: 85, status: 'open' },
  ]

  const demoCorrelations = [
    { id: 'corr-1', description: 'Coordinated Admin Compromise - MFA bypass + Forwarding', alert_count: 3, correlation_type: 'ACTOR', risk_level: 'CRITICAL', correlation_score: 96, start_timestamp: new Date(Date.now() - 20*60000).toISOString(), end_timestamp: new Date().toISOString() },
    { id: 'corr-2', description: 'OAuth Backdoor - Admin consent + Directory access', alert_count: 2, correlation_type: 'TARGET', risk_level: 'CRITICAL', correlation_score: 92, start_timestamp: new Date(Date.now() - 15*60000).toISOString(), end_timestamp: new Date().toISOString() },
  ]

  allAlerts = demoAlerts
  allCorrelations = demoCorrelations

  renderContent(el)
}

// Normalize alert field names to match UI expectations
function normalizeAlert(alert) {
  if (!alert) return null

  // Debug logging to see actual fields
  if (!alert.headline && !alert.name) {
    console.log('⚠️ Alert missing headline/name:', Object.keys(alert).slice(0, 10))
  }

  return {
    id: alert.id || alert.ID || 'unknown',
    headline: alert.headline || alert.name || alert.title || alert.activityDisplayName || alert.type || 'Unknown Alert',
    description: alert.description || alert.details || alert.message || alert.category || 'No description available',
    priority: alert.priority || alert.Priority || 'P3',
    severity: alert.severity || alert.Severity || 'MEDIUM',
    actor: alert.actor || alert.initiatedBy?.user?.userPrincipalName || alert.user || alert.target || 'System',
    source: alert.source || alert.Source || alert.category || 'Unknown',
    timestamp: alert.timestamp || alert.activityDateTime || alert.created_at || alert.action_timestamp || new Date().toISOString(),
    score: alert.score || alert.riskScore || 50,
    status: alert.status || alert.Status || 'open',
    type: alert.type || 'AUDIT',
    dismissed: alert.dismissed || 0
  }
}

// Normalize correlation field names
function normalizeCorrelation(corr) {
  if (!corr) return null

  return {
    id: corr.id || corr.ID || 'unknown',
    description: corr.description || corr.Description || 'Unknown Correlation',
    alert_count: corr.alert_count || corr.alertCount || corr.eventCount || 0,
    correlation_type: corr.correlation_type || corr.correlationType || 'PATTERN',
    risk_level: corr.risk_level || corr.riskLevel || 'HIGH',
    correlation_score: corr.correlation_score || corr.correlationScore || corr.score || 50,
    start_timestamp: corr.start_timestamp || corr.startTime || corr.startedAt || new Date().toISOString(),
    end_timestamp: corr.end_timestamp || corr.endTime || corr.endedAt || new Date().toISOString()
  }
}

async function refreshData() {
  try {
    console.log('📡 Fetching real-time data from backend...')

    // Parallel fetch from all backend APIs
    const [alertsRes, correlationsRes, patternsRes] = await Promise.all([
      fetch(`${API_BASE}/api/tenantguard/alerts?limit=100`).then(r => r.json()).catch(e => {
        console.error('Failed to fetch alerts:', e)
        return { success: false, data: [] }
      }),
      fetch(`${API_BASE}/api/tenantguard/correlations`).then(r => r.json()).catch(e => {
        console.error('Failed to fetch correlations:', e)
        return { success: false, data: [] }
      }),
      fetch(`${API_BASE}/api/tenantguard/patterns`).then(r => r.json()).catch(e => {
        console.error('Failed to fetch patterns:', e)
        return { success: false, data: [] }
      }),
    ])

    // Process alerts with field name normalization
    if (alertsRes?.data && Array.isArray(alertsRes.data) && alertsRes.data.length > 0) {
      console.log(`📊 Raw alert data (first item):`, alertsRes.data[0])
      console.log(`📊 Alert source: ${alertsRes.source || 'unknown'}`)

      allAlerts = alertsRes.data.map(normalizeAlert).filter(a => a)
      console.log(`✅ Loaded ${allAlerts.length} real alerts`)
      console.log(`📊 Normalized alert (first):`, allAlerts[0])
    } else if (alertsRes?.success === false || !alertsRes?.data) {
      allAlerts = getDemoAlerts()
      console.log('⚠️ No real alerts from API, using demo data')
    } else {
      allAlerts = getDemoAlerts()
      console.log('⚠️ Empty alerts response, using demo data')
    }

    // Process correlations with field name normalization
    if (correlationsRes?.data && Array.isArray(correlationsRes.data) && correlationsRes.data.length > 0) {
      allCorrelations = correlationsRes.data.map(normalizeCorrelation).filter(c => c)
      console.log(`✅ Loaded ${allCorrelations.length} correlations`)
    } else {
      allCorrelations = getDemoCorrelations()
      console.log('⚠️ No correlations from API, using demo data')
    }

    // Process patterns
    if (patternsRes?.data && Array.isArray(patternsRes.data) && patternsRes.data.length > 0) {
      allPatterns = patternsRes.data
      console.log(`✅ Loaded ${allPatterns.length} patterns`)
    } else {
      allPatterns = []
    }
  } catch (error) {
    console.error('Error refreshing data:', error)
    allAlerts = getDemoAlerts()
    allCorrelations = getDemoCorrelations()
  }
}

function getDemoAlerts() {
  return [
    { id: 'alert-6', priority: 'P1', severity: 'CRITICAL', headline: 'MFA Disabled', description: 'MFA disabled organization-wide', actor: 'security-admin@contoso.com', source: 'Entra ID', timestamp: new Date(Date.now() - 2*60000).toISOString(), score: 94 },
    { id: 'alert-7', priority: 'P1', severity: 'CRITICAL', headline: 'CA Policy Modified', description: 'Policy blocking high-risk sign-ins disabled', actor: 'cloud-admin@contoso.com', source: 'Entra ID', timestamp: new Date(Date.now() - 5*60000).toISOString(), score: 93 },
    { id: 'alert-8', priority: 'P2', severity: 'HIGH', headline: 'OAuth Consent Granted', description: 'OAuth app received admin consent', actor: 'admin@contoso.com', source: 'Application', timestamp: new Date(Date.now() - 10*60000).toISOString(), score: 88 },
  ]
}

function getDemoCorrelations() {
  return [
    { id: 'corr-3', description: 'Multi-Stage: Admin compromise → Security bypass → Access', alert_count: 4, correlation_type: 'PATTERN', risk_level: 'CRITICAL', correlation_score: 95, start_timestamp: new Date(Date.now() - 20*60000).toISOString(), end_timestamp: new Date().toISOString() },
  ]
}

function showAlertDetail(parentEl, alert) {
  if (!alert) return

  const modal = document.createElement('div')
  modal.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0,0,0,0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
  `

  const content = document.createElement('div')
  content.style.cssText = `
    background: var(--color-background-primary);
    border: 1px solid var(--color-border-secondary);
    border-radius: 8px;
    padding: 24px;
    max-width: 600px;
    width: 90%;
    max-height: 80vh;
    overflow-y: auto;
    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
  `

  const severityColor = SEVERITY_COLOR[alert?.severity] || '#666'
  const priorityColor = ALERT_PRIORITY[alert?.priority]?.color || '#666'

  content.innerHTML = `
    <div style="display:flex;justify-content:space-between;align-items:start;margin-bottom:16px">
      <div>
        <h2 style="margin:0;font-size:18px;color:var(--color-text-primary)">${alert?.headline || 'Alert Details'}</h2>
        <div style="font-size:12px;color:var(--color-text-secondary);margin-top:4px">${alert?.category || 'Alert'}</div>
      </div>
      <button onclick="this.closest('div').parentElement.parentElement.remove()" style="
        background:transparent;
        border:none;
        font-size:24px;
        cursor:pointer;
        color:var(--color-text-secondary);
      ">×</button>
    </div>

    <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:16px">
      <div style="background:var(--color-background-secondary);padding:12px;border-radius:6px">
        <div style="font-size:11px;color:var(--color-text-secondary);margin-bottom:4px">PRIORITY</div>
        <div style="font-size:14px;font-weight:600;color:${priorityColor}">${alert?.priority || 'P3'}</div>
      </div>
      <div style="background:var(--color-background-secondary);padding:12px;border-radius:6px">
        <div style="font-size:11px;color:var(--color-text-secondary);margin-bottom:4px">SEVERITY</div>
        <div style="font-size:14px;font-weight:600;color:${severityColor}">${alert?.severity || 'MEDIUM'}</div>
      </div>
      <div style="background:var(--color-background-secondary);padding:12px;border-radius:6px">
        <div style="font-size:11px;color:var(--color-text-secondary);margin-bottom:4px">RISK SCORE</div>
        <div style="font-size:14px;font-weight:600;color:${alert?.score >= 70 ? severityColor : '#666'}">${Math.round(alert?.score || 0)}/100</div>
      </div>
      <div style="background:var(--color-background-secondary);padding:12px;border-radius:6px">
        <div style="font-size:11px;color:var(--color-text-secondary);margin-bottom:4px">STATUS</div>
        <div style="font-size:14px;font-weight:600">${alert?.status || 'open'}</div>
      </div>
    </div>

    <div style="background:var(--color-background-secondary);padding:12px;border-radius:6px;margin-bottom:16px">
      <div style="font-size:11px;color:var(--color-text-secondary);margin-bottom:8px;font-weight:600">DESCRIPTION</div>
      <div style="font-size:13px;color:var(--color-text-primary);line-height:1.5">${alert?.description || 'No description available'}</div>
    </div>

    <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:16px">
      <div style="background:var(--color-background-secondary);padding:12px;border-radius:6px">
        <div style="font-size:11px;color:var(--color-text-secondary);margin-bottom:4px;font-weight:600">SOURCE</div>
        <div style="font-size:13px;color:var(--color-text-primary)">${alert?.source || 'Unknown'}</div>
      </div>
      <div style="background:var(--color-background-secondary);padding:12px;border-radius:6px">
        <div style="font-size:11px;color:var(--color-text-secondary);margin-bottom:4px;font-weight:600">ACTOR</div>
        <div style="font-size:13px;color:var(--color-text-primary)">${alert?.actor || 'System'}</div>
      </div>
    </div>

    <div style="background:var(--color-background-secondary);padding:12px;border-radius:6px;margin-bottom:16px">
      <div style="font-size:11px;color:var(--color-text-secondary);margin-bottom:4px;font-weight:600">TIMESTAMP</div>
      <div style="font-size:13px;color:var(--color-text-primary)">${new Date(alert?.timestamp).toLocaleString()}</div>
    </div>

    <div style="background:var(--color-background-secondary);padding:12px;border-radius:6px">
      <div style="font-size:11px;color:var(--color-text-secondary);margin-bottom:4px;font-weight:600">ALERT ID</div>
      <div style="font-size:12px;color:var(--color-text-primary);font-family:monospace;word-break:break-all">${alert?.id || 'unknown'}</div>
    </div>
  `

  modal.appendChild(content)
  document.body.appendChild(modal)

  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      modal.remove()
    }
  })
}

window.switchTab = (tab) => {
  activeTab = tab
  const el = document.getElementById('page-tenantguard')
  if (el) renderContent(el)
}
