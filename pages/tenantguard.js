import { getAlertSummary, getAlerts, dismissAlert, getCorrelations, getPatterns, startInvestigation, getInvestigation, chatInvestigation, generateInvestigationReport } from '../lib/tenantguard-client.js'
import { showToast } from '../components/toast.js'
import { isDemoAccount } from '../lib/demo-account.js'

let activeSection = 'alerts'
let activeFilter = 'all'
let allAlerts = []
let allCorrelations = []
let currentInvestigation = null
let autoRefreshInterval = null

const SEVERITY_TABS = [
  { id: 'all', label: 'All Alerts', icon: 'ti-list' },
  { id: 'CRITICAL', label: 'Critical', icon: 'ti-alert-triangle' },
  { id: 'HIGH', label: 'High', icon: 'ti-alert-circle' },
  { id: 'MEDIUM', label: 'Medium', icon: 'ti-alert-octagon' },
]

const MAIN_TABS = [
  { id: 'alerts', label: 'Alerts', icon: 'ti-list' },
  { id: 'correlations', label: 'Correlations', icon: 'ti-link' },
  { id: 'patterns', label: 'Attack Patterns', icon: 'ti-alert-triangle' },
  { id: 'investigation', label: 'AI Investigation', icon: 'ti-robot' },
]

export async function initTenantGuard() {
  const el = document.getElementById('page-tenantguard')
  if (!el) return

  if (isDemoAccount()) {
    console.log('🎭 Demo account detected - showing demo TenantGuard alerts')
    renderDemoTenantGuard(el)
    return
  }

  el.innerHTML = `<div style="padding:20px;text-align:center"><div class="spinner"></div><p>Loading TenantGuard alerts...</p></div>`

  try {
    await refreshData()
  } catch (error) {
    console.error('Error initializing TenantGuard:', error)
    showToast('Failed to load alerts', 'error')
  }

  // Set up auto-refresh (every 5 minutes)
  if (autoRefreshInterval) clearInterval(autoRefreshInterval)
  autoRefreshInterval = setInterval(refreshData, 5 * 60 * 1000)
}

async function refreshData() {
  try {
    const [summary, alerts, correlations] = await Promise.all([
      getAlertSummary(),
      getAlerts('all', 100),
      getCorrelations('all')
    ])

    allAlerts = alerts || []
    allCorrelations = correlations || []
    render(summary)
  } catch (error) {
    console.error('Error refreshing data:', error)
    showToast('Failed to refresh alerts: ' + error.message, 'error')
  }
}

function renderDemoTenantGuard(el) {
  const demoAlerts = [
    { id: 'alert-1', severity: 'CRITICAL', title: 'Suspicious Bulk User Creation', description: 'Detected 47 user accounts created in 3 minutes from unusual location', source: 'Azure AD', timestamp: '2026-06-01 14:32:15', status: 'open', riskScore: 95 },
    { id: 'alert-2', severity: 'CRITICAL', title: 'Global Admin Role Assignment Detected', description: 'User aisha.raza@contoso.com assigned Global Admin role outside normal hours', source: 'Azure AD Audit', timestamp: '2026-06-01 13:45:22', status: 'open', riskScore: 92 },
    { id: 'alert-3', severity: 'HIGH', title: 'Impossible Travel Detected', description: 'Sign-in from UK (London) followed by sign-in from Australia (Sydney) within 2 hours', source: 'Identity Protection', timestamp: '2026-06-01 12:15:43', status: 'open', riskScore: 78 },
    { id: 'alert-4', severity: 'HIGH', title: 'Abnormal Token Usage', description: 'Service principal exchanged 342 tokens in 45 minutes (baseline: 8 tokens/hour)', source: 'Token Audit', timestamp: '2026-06-01 11:30:21', status: 'investigating', riskScore: 75 },
    { id: 'alert-5', severity: 'MEDIUM', title: 'MFA Configuration Change', description: 'MFA enforcement policy disabled by chen.wei@contoso.com', source: 'Azure AD Config', timestamp: '2026-06-01 10:15:09', status: 'open', riskScore: 58 },
  ]

  const demoCorrelations = [
    { id: 'corr-1', title: 'Coordinated Account Compromise', description: 'Multiple accounts experiencing impossible travel, abnormal token usage, and suspicious sign-ins', alerts: ['alert-2', 'alert-3', 'alert-4'], severity: 'CRITICAL', confidence: 96 },
    { id: 'corr-2', title: 'Potential Lateral Movement', description: 'User access patterns suggest attacker moving through service principals to access sensitive data', alerts: ['alert-4', 'alert-5'], severity: 'HIGH', confidence: 87 },
  ]

  const demoSummary = {
    critical: 2,
    high: 2,
    medium: 1,
    total: 5
  }

  activeSection = 'alerts'
  activeFilter = 'all'
  allAlerts = demoAlerts
  allCorrelations = demoCorrelations

  renderDemoTenantGuardUI(el, demoSummary)
}

function renderDemoTenantGuardUI(el, summary) {
  const criticalCount = summary.critical || 0
  const highCount = summary.high || 0
  const mediumCount = summary.medium || 0
  const totalCount = summary.total || 0
  const correlationCount = allCorrelations.length

  el.innerHTML = `
    <div class="page-header">
      <div>
        <div class="page-title"><i class="ti ti-alert-triangle"></i> TenantGuard Alert Center</div>
        <div class="page-subtitle">Real-time alerts, correlations & attack pattern detection · ${totalCount} alerts · ${correlationCount} correlations</div>
      </div>
      <div class="page-actions">
        <button class="btn" id="tg-refresh"><i class="ti ti-refresh"></i> Refresh</button>
      </div>
    </div>

    <div style="display:flex;align-items:center;gap:8px;padding:8px 12px;background:var(--color-background-primary);border:0.5px solid var(--color-border-secondary);border-radius:var(--border-radius-md);margin-bottom:16px;font-size:10px;color:var(--color-text-tertiary)">
      <span class="status-dot active pulse"></span>
      <span><strong style="color:var(--color-text-secondary)">Demo Mode</strong> · Showing sample TenantGuard alerts</span>
    </div>

    <!-- KPI Tiles -->
    <div class="kpi-row mb-3">
      <div class="kpi-tile">
        <div class="kpi-value danger">${criticalCount}</div>
        <div class="kpi-label">Critical Alerts</div>
      </div>
      <div class="kpi-tile">
        <div class="kpi-value warning">${highCount}</div>
        <div class="kpi-label">High Alerts</div>
      </div>
      <div class="kpi-tile">
        <div class="kpi-value info">${correlationCount}</div>
        <div class="kpi-label">Correlations</div>
      </div>
      <div class="kpi-tile">
        <div class="kpi-value success">${totalCount}</div>
        <div class="kpi-label">Total Alerts</div>
      </div>
    </div>

    <div class="tabs">
      <button class="tab-btn active" data-section="alerts">
        <i class="ti ti-list"></i> Alerts
      </button>
      <button class="tab-btn" data-section="correlations">
        <i class="ti ti-link"></i> Correlations
      </button>
    </div>

    <div id="demo-content"></div>
  `

  const contentEl = el.querySelector('#demo-content')
  renderDemoAlerts(contentEl)

  el.querySelectorAll('.tabs .tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      el.querySelectorAll('.tabs .tab-btn').forEach(b => b.classList.remove('active'))
      btn.classList.add('active')

      const section = btn.dataset.section
      if (section === 'alerts') renderDemoAlerts(contentEl)
      else if (section === 'correlations') renderDemoCorrelations(contentEl)
    })
  })

  el.querySelector('#tg-refresh')?.addEventListener('click', () => {
    const btn = el.querySelector('#tg-refresh')
    btn.innerHTML = `<span class="spinner dark"></span> Refreshing...`
    btn.disabled = true
    setTimeout(() => {
      btn.innerHTML = `<i class="ti ti-refresh"></i> Refresh`
      btn.disabled = false
    }, 2000)
  })
}

function renderDemoAlerts(el) {
  el.innerHTML = `
    <div class="card">
      <div class="card-header">
        <span class="card-title">Security Alerts</span>
        <span class="badge danger">${allAlerts.length} alerts</span>
      </div>
      <table style="width:100%">
        <thead style="background:var(--color-background-secondary)">
          <tr>
            <th style="padding:10px 12px;text-align:left;font-size:10px;font-weight:600">Severity</th>
            <th style="padding:10px 12px;text-align:left;font-size:10px;font-weight:600">Alert Title</th>
            <th style="padding:10px 12px;text-align:left;font-size:10px;font-weight:600">Source</th>
            <th style="padding:10px 12px;text-align:left;font-size:10px;font-weight:600">Risk Score</th>
            <th style="padding:10px 12px;text-align:left;font-size:10px;font-weight:600">Status</th>
            <th style="padding:10px 12px;text-align:left;font-size:10px;font-weight:600">Time</th>
          </tr>
        </thead>
        <tbody>
          ${allAlerts.map((alert, i) => `
            <tr style="border-bottom:${i < allAlerts.length - 1 ? '0.5px solid var(--color-border-tertiary)' : 'none'}">
              <td style="padding:10px 12px"><span class="badge ${alert.severity === 'CRITICAL' ? 'danger' : 'warning'}">${alert.severity}</span></td>
              <td style="padding:10px 12px;font-size:11px;font-weight:600">${alert.title}</td>
              <td style="padding:10px 12px;font-size:10px;color:var(--color-text-secondary)">${alert.source}</td>
              <td style="padding:10px 12px;font-size:10px">
                <div style="display:flex;align-items:center;gap:6px">
                  <div style="width:40px;height:6px;background:var(--color-background-secondary);border-radius:3px;overflow:hidden">
                    <div style="height:100%;width:${alert.riskScore}%;background:${alert.riskScore >= 80 ? 'var(--clr-danger-text)' : 'var(--clr-warning-text)'}"></div>
                  </div>
                  <span style="font-weight:600;color:${alert.riskScore >= 80 ? 'var(--clr-danger-text)' : 'var(--clr-warning-text)'}">${alert.riskScore}</span>
                </div>
              </td>
              <td style="padding:10px 12px"><span class="badge ${alert.status === 'open' ? 'danger' : 'warning'}">${alert.status}</span></td>
              <td style="padding:10px 12px;font-size:10px;color:var(--color-text-tertiary)">${alert.timestamp.split(' ')[1]}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>
  `
}

function renderDemoCorrelations(el) {
  el.innerHTML = `
    <div class="card">
      <div class="card-header">
        <span class="card-title">Attack Pattern Correlations</span>
        <span class="badge danger">${allCorrelations.length} correlations</span>
      </div>
      <div style="display:flex;flex-direction:column;gap:12px;padding:12px">
        ${allCorrelations.map((corr, i) => `
          <div style="padding:12px;background:var(--color-background-secondary);border-radius:var(--border-radius-md);border-left:3px solid ${corr.severity === 'CRITICAL' ? 'var(--clr-danger-text)' : 'var(--clr-warning-text)'}">
            <div style="display:flex;justify-content:space-between;align-items:start;margin-bottom:8px">
              <div>
                <div style="font-size:12px;font-weight:600;color:var(--color-text-primary)">${corr.title}</div>
                <div style="font-size:10px;color:var(--color-text-secondary);margin-top:4px">${corr.description}</div>
              </div>
              <span class="badge ${corr.severity === 'CRITICAL' ? 'danger' : 'warning'}">${corr.severity}</span>
            </div>
            <div style="display:flex;justify-content:space-between;align-items:center;font-size:9px;color:var(--color-text-tertiary)">
              <span>${corr.alerts.length} related alerts</span>
              <span style="font-weight:600;color:var(--clr-success-text)">${corr.confidence}% confidence</span>
            </div>
          </div>
        `).join('')}
      </div>
    </div>
  `
}

function render(summary) {
  const el = document.getElementById('page-tenantguard')
  if (!el) return

  const criticalCount = summary.critical || 0
  const highCount = summary.high || 0
  const mediumCount = summary.medium || 0
  const totalCount = summary.total || 0
  const correlationCount = allCorrelations.length

  el.innerHTML = `
    <div class="page-header">
      <div>
        <div class="page-title"><i class="ti ti-alert-triangle"></i> TenantGuard Alert Center</div>
        <div class="page-subtitle">Real-time alerts, correlations & attack pattern detection · ${totalCount} alerts · ${correlationCount} correlations</div>
      </div>
      <div class="page-actions">
        <button class="btn" id="tg-refresh"><i class="ti ti-refresh"></i> Refresh</button>
      </div>
    </div>

    <!-- KPI Tiles -->
    <div class="kpi-row mb-3">
      <div class="kpi-tile">
        <div class="kpi-value danger">${criticalCount}</div>
        <div class="kpi-label">Critical Alerts</div>
      </div>
      <div class="kpi-tile">
        <div class="kpi-value warning">${highCount}</div>
        <div class="kpi-label">High Alerts</div>
      </div>
      <div class="kpi-tile">
        <div class="kpi-value info">${correlationCount}</div>
        <div class="kpi-label">Correlations</div>
      </div>
      <div class="kpi-tile">
        <div class="kpi-value success">${totalCount}</div>
        <div class="kpi-label">Total Alerts</div>
      </div>
    </div>

    <!-- Main Tabs -->
    <div class="tabs" id="tg-main-tabs">
      ${MAIN_TABS.map(t => `
        <button class="tab-btn ${activeSection === t.id ? 'active' : ''}" data-section="${t.id}">
          <i class="ti ${t.icon}"></i><span>${t.label}</span>
          ${t.id === 'alerts' && totalCount > 0 ? `<span class="badge" style="background:var(--clr-danger-bg);color:var(--clr-danger-text)">${totalCount}</span>` : ''}
          ${t.id === 'correlations' && correlationCount > 0 ? `<span class="badge" style="background:var(--clr-warning-bg);color:var(--clr-warning-text)">${correlationCount}</span>` : ''}
        </button>
      `).join('')}
    </div>

    <!-- Content Area -->
    <div id="tg-content" style="margin-top:16px">
      ${activeSection === 'alerts' ? renderAlertsSection() : activeSection === 'correlations' ? renderCorrelationsSection() : activeSection === 'patterns' ? renderPatternsSection() : renderInvestigationSection()}
    </div>
  `

  // Attach main tab listeners
  el.querySelectorAll('[data-section]').forEach(btn => {
    btn.addEventListener('click', () => {
      activeSection = btn.dataset.section
      activeFilter = 'all'
      const content = el.querySelector('#tg-content')
      if (content) {
        content.innerHTML = activeSection === 'alerts' ? renderAlertsSection() : activeSection === 'correlations' ? renderCorrelationsSection() : renderPatternsSection()
        if (activeSection === 'alerts') wireAlerts(el)
      }
      el.querySelectorAll('[data-section]').forEach(b => b.classList.remove('active'))
      btn.classList.add('active')
    })
  })

  el.querySelector('#tg-refresh')?.addEventListener('click', async () => {
    const btn = el.querySelector('#tg-refresh')
    const originalText = btn.innerHTML
    btn.innerHTML = `<span class="spinner dark"></span> Scanning...`
    btn.disabled = true
    await refreshData()
    btn.innerHTML = originalText
    btn.disabled = false
  })

  if (activeSection === 'alerts') wireAlerts(el)
}

function renderAlertsSection() {
  return `
    <!-- Severity Tabs -->
    <div class="tabs" id="tg-severity-tabs">
      ${SEVERITY_TABS.map(t => `
        <button class="tab-btn ${activeFilter === t.id ? 'active' : ''}" data-severity="${t.id}">
          <i class="ti ${t.icon}"></i><span>${t.label}</span>
        </button>
      `).join('')}
    </div>
    <div id="tg-alerts-list" style="margin-top:12px">${renderAlerts()}</div>
  `
}

function renderCorrelationsSection() {
  if (allCorrelations.length === 0) {
    return `
      <div style="text-align:center;padding:40px 20px;color:var(--color-text-secondary)">
        <div style="font-size:48px;margin-bottom:12px;opacity:0.5">🔗</div>
        <div style="font-weight:600;font-size:14px;margin-bottom:4px">No correlations detected</div>
        <div style="font-size:12px">When alerts are related, they will be grouped here</div>
      </div>
    `
  }

  return allCorrelations.map(corr => `
    <div class="tenantguard-alert-card ${corr.risk_level.toLowerCase()}" data-corr-id="${corr.id}" style="cursor:pointer">
      <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:8px">
        <div style="flex:1">
          <div style="font-weight:700;font-size:13px;color:var(--color-text-primary);margin-bottom:4px">
            ${escapeHtml(corr.description)}
          </div>
          <div style="font-size:10px;color:var(--color-text-tertiary);display:flex;gap:12px;flex-wrap:wrap">
            <span><i class="ti ti-link" style="font-size:10px"></i> ${corr.alert_count} alerts</span>
            <span><i class="ti ti-trending-up" style="font-size:10px"></i> Score: ${corr.correlation_score}/100</span>
            <span><i class="ti ti-tag" style="font-size:10px"></i> ${corr.pattern_type}</span>
          </div>
        </div>
        <span class="badge ${getBadgeClass(corr.risk_level)}">${corr.risk_level}</span>
      </div>
    </div>
  `).join('')
}

function renderPatternsSection() {
  const renderPatternAsync = async () => {
    const patterns = await getPatterns()
    if (patterns.length === 0) {
      return `<div style="padding:20px;text-align:center;color:var(--color-text-tertiary)">No patterns detected</div>`
    }

    return `
      <div class="card mb-3">
        <div class="card-header">
          <span class="card-title"><i class="ti ti-alert-triangle"></i> Detected Attack Patterns</span>
        </div>
        <div style="font-size:12px">
          ${patterns.map(p => `
            <div style="display:flex;justify-content:space-between;align-items:center;padding:10px 0;border-bottom:0.5px solid var(--color-border-tertiary)">
              <div style="flex:1">
                <div style="font-weight:600;color:var(--color-text-primary)">${p.pattern_type}</div>
                <div style="font-size:10px;color:var(--color-text-tertiary)">Max Score: ${p.max_score}</div>
              </div>
              <div style="text-align:right">
                <div style="font-weight:700;font-size:16px;color:var(--clr-danger-text)">${p.count}</div>
                <div style="font-size:10px;color:var(--color-text-tertiary)">detected</div>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    `
  }

  // Return loading state while fetching
  return `<div style="padding:20px;text-align:center"><div class="spinner"></div><p style="color:var(--color-text-secondary)">Loading patterns...</p></div>`
}

function renderInvestigationSection() {
  if (currentInvestigation) {
    return renderInvestigationChat()
  }

  return `
    <div class="card mb-3">
      <div class="card-header">
        <span class="card-title"><i class="ti ti-robot"></i> AI Security Investigation Agent</span>
      </div>
      <div style="padding:16px;color:var(--color-text-secondary);text-align:center">
        <div style="font-size:48px;margin-bottom:12px">🤖</div>
        <div style="font-size:13px;font-weight:600;margin-bottom:8px">Select an incident to investigate</div>
        <div style="font-size:12px;margin-bottom:16px">
          Click on an alert or correlation to start an AI-powered investigation.
          TenantGuard will analyze the incident and answer your questions.
        </div>

        <div style="margin-top:20px;border-top:0.5px solid var(--color-border-tertiary);padding-top:16px">
          <div style="font-size:12px;font-weight:600;margin-bottom:12px;color:var(--color-text-primary)">Recent Correlations</div>
          ${allCorrelations.slice(0, 3).map(corr => `
            <button class="btn" style="width:100%;margin-bottom:8px;justify-content:flex-start" onclick="startCorrInvestigation('${corr.id}', '${escapeHtml(corr.description)}')">
              <i class="ti ti-link"></i>
              <span style="text-align:left;flex:1">${escapeHtml(corr.description.substring(0, 50))}...</span>
              <span class="badge ${getBadgeClass(corr.risk_level)}">${corr.risk_level}</span>
            </button>
          `).join('')}
        </div>
      </div>
    </div>
  `
}

function renderInvestigationChat() {
  return `
    <div class="card mb-3">
      <div class="card-header">
        <span class="card-title"><i class="ti ti-robot"></i> ${escapeHtml(currentInvestigation.title)}</span>
        <button class="btn" style="margin-left:auto" onclick="closeInvestigation()">
          <i class="ti ti-x"></i> Close
        </button>
      </div>

      <div id="investigation-chat" style="display:flex;flex-direction:column;height:500px;border:0.5px solid var(--color-border-secondary);border-top:none;border-radius:0 0 4px 4px;overflow:hidden;background:var(--color-background-primary)">
        <div id="investigation-messages" style="flex:1;overflow-y:auto;padding:12px;display:flex;flex-direction:column;gap:8px"></div>

        <div style="display:flex;gap:8px;padding:12px;border-top:0.5px solid var(--color-border-secondary);background:var(--color-background-secondary)">
          <input type="text" id="investigation-input" placeholder="Ask me about this incident..." style="flex:1;padding:8px;border:0.5px solid var(--color-border-secondary);border-radius:4px;background:var(--color-background-primary);color:var(--color-text-primary);font-size:12px" />
          <button id="investigation-send" class="btn btn-primary" style="white-space:nowrap">
            <i class="ti ti-send"></i> Send
          </button>
          <button id="investigation-report" class="btn" style="white-space:nowrap">
            <i class="ti ti-file-text"></i> Report
          </button>
        </div>
      </div>
    </div>
  `
}

function renderAlerts() {
  const filtered = activeFilter === 'all'
    ? allAlerts
    : allAlerts.filter(a => a.severity === activeFilter)

  if (filtered.length === 0) {
    return `
      <div style="text-align:center;padding:40px 20px;color:var(--color-text-secondary)">
        <div style="font-size:48px;margin-bottom:12px;opacity:0.5">✓</div>
        <div style="font-weight:600;font-size:14px;margin-bottom:4px">All clear</div>
        <div style="font-size:12px">
          ${activeFilter === 'all'
            ? 'No active alerts. Your tenant is secure.'
            : `No ${activeFilter.toLowerCase()} severity alerts.`
          }
        </div>
      </div>
    `
  }

  return filtered.map(alert => `
    <div class="tenantguard-alert-card ${alert.severity.toLowerCase()}" data-alert-id="${alert.id}">
      <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:8px">
        <div style="flex:1">
          <div style="font-weight:700;font-size:13px;color:var(--color-text-primary);margin-bottom:4px">
            ${escapeHtml(alert.headline)}
          </div>
          <div style="font-size:10px;color:var(--color-text-tertiary);display:flex;gap:12px;flex-wrap:wrap">
            <span><i class="ti ti-user" style="font-size:10px;vertical-align:baseline"></i> ${escapeHtml(alert.actor || 'System')}</span>
            <span><i class="ti ti-clock" style="font-size:10px;vertical-align:baseline"></i> ${formatTime(alert.action_timestamp)}</span>
            <span><i class="ti ti-trending-up" style="font-size:10px;vertical-align:baseline"></i> Score: ${alert.score}/100</span>
          </div>
        </div>
        <span class="badge ${getBadgeClass(alert.severity)}" style="margin-left:8px">${alert.severity}</span>
      </div>

      <div style="font-size:12px;color:var(--color-text-secondary);margin-bottom:8px;line-height:1.4">
        ${escapeHtml(alert.description)}
      </div>

      <div style="display:flex;gap:6px;font-size:11px">
        <button class="btn tg-details-btn" data-alert-id="${alert.id}">
          <i class="ti ti-info-circle"></i> Details
        </button>
        <button class="btn tg-dismiss-btn" data-alert-id="${alert.id}">
          <i class="ti ti-x"></i> Dismiss
        </button>
      </div>
    </div>
  `).join('')
}

function wireAlerts(el) {
  // Severity tab listeners
  const severityTabs = el.querySelector('#tg-severity-tabs')
  if (severityTabs) {
    severityTabs.querySelectorAll('.tab-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        activeFilter = btn.dataset.severity
        severityTabs.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'))
        btn.classList.add('active')
        const alertsList = el.querySelector('#tg-alerts-list')
        if (alertsList) alertsList.innerHTML = renderAlerts()
        wireAlertButtons(el)
      })
    })
  }

  wireAlertButtons(el)
}

function wireAlertButtons(el) {
  el.querySelectorAll('.tg-details-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation()
      showAlertDetails(e.target.closest('button').dataset.alertId)
    })
  })

  el.querySelectorAll('.tg-dismiss-btn').forEach(btn => {
    btn.addEventListener('click', async (e) => {
      e.stopPropagation()
      const alertId = e.target.closest('button').dataset.alertId
      try {
        await dismissAlert(alertId, 'Dismissed from dashboard')
        showToast('Alert dismissed', 'success')
        await refreshData()
      } catch (error) {
        showToast('Failed to dismiss alert', 'error')
      }
    })
  })
}

function showAlertDetails(alertId) {
  const alert = allAlerts.find(a => a.id === alertId)
  if (!alert) return

  const el = document.getElementById('tg-content')
  if (!el) return

  let recommendations = []
  let riskAssessment = {}

  try {
    recommendations = JSON.parse(alert.recommendations || '[]')
    riskAssessment = JSON.parse(alert.risk_assessment || '{}')
  } catch (e) {
    // Ignore parse errors
  }

  el.innerHTML = `
    <div class="card mb-3">
      <div class="card-header">
        <div>
          <div class="card-title">${escapeHtml(alert.headline)}</div>
          <div style="font-size:10px;color:var(--color-text-tertiary);margin-top:4px">
            Score: ${alert.score}/100 · ${formatTime(alert.action_timestamp)}
          </div>
        </div>
        <button class="btn" onclick="location.reload()"><i class="ti ti-x"></i> Close</button>
      </div>

      <div style="margin-bottom:16px">
        <div style="font-size:11px;font-weight:600;color:var(--color-text-tertiary);text-transform:uppercase;margin-bottom:8px">Description</div>
        <div style="font-size:12px;color:var(--color-text-secondary);line-height:1.6">
          ${escapeHtml(alert.description)}
        </div>
      </div>

      <div style="margin-bottom:16px">
        <div style="font-size:11px;font-weight:600;color:var(--color-text-tertiary);text-transform:uppercase;margin-bottom:8px">Risk Assessment</div>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;font-size:11px">
          <div>
            <div style="color:var(--color-text-tertiary)">Score</div>
            <div style="font-weight:700;font-size:14px;color:${getSeverityColor(riskAssessment.severity || alert.severity)}">${riskAssessment.score || alert.score}/100</div>
          </div>
          <div>
            <div style="color:var(--color-text-tertiary)">Severity</div>
            <div style="font-weight:700;margin-top:4px"><span class="badge ${getBadgeClass(riskAssessment.severity || alert.severity)}">${riskAssessment.severity || alert.severity}</span></div>
          </div>
          ${Object.entries(riskAssessment.levels || {}).map(([key, val]) => `
            <div>
              <div style="color:var(--color-text-tertiary)">${capitalize(key)}</div>
              <div style="font-weight:700">${val}</div>
            </div>
          `).join('')}
        </div>
        ${riskAssessment.impacts && riskAssessment.impacts.length > 0 ? `
          <div style="margin-top:8px;padding:8px;background:var(--color-background-secondary);border-radius:4px;font-size:11px">
            <strong>Impacts:</strong> ${riskAssessment.impacts.join(', ')}
          </div>
        ` : ''}
      </div>

      ${recommendations.length > 0 ? `
        <div style="margin-bottom:16px">
          <div style="font-size:11px;font-weight:600;color:var(--color-text-tertiary);text-transform:uppercase;margin-bottom:8px">Recommended Actions</div>
          <ul style="list-style:none;padding:0;margin:0;font-size:12px">
            ${recommendations.map(rec => `
              <li style="padding:6px 0;padding-left:20px;position:relative;color:var(--color-text-secondary)">
                <span style="position:absolute;left:0;color:var(--clr-primary)">→</span>
                ${escapeHtml(rec)}
              </li>
            `).join('')}
          </ul>
        </div>
      ` : ''}

      <div style="border-top:0.5px solid var(--color-border-tertiary);padding-top:12px">
        <button class="btn btn-danger" onclick="dismissAndRefreshDetail('${alertId}')">
          <i class="ti ti-check"></i> Dismiss This Alert
        </button>
      </div>
    </div>

    <div id="other-alerts" style="margin-top:16px;font-size:11px;color:var(--color-text-tertiary);padding:8px">
      Loading other alerts...
    </div>
  `

  // Render other alerts
  const otherAlerts = activeFilter === 'all'
    ? allAlerts.filter(a => a.id !== alertId)
    : allAlerts.filter(a => a.severity === activeFilter && a.id !== alertId)

  if (otherAlerts.length > 0) {
    const html = `
      <div style="margin-top:24px">
        <div style="font-size:12px;font-weight:600;color:var(--color-text-primary);margin-bottom:12px">Other Alerts</div>
        ${otherAlerts.map(a => `
          <div class="tenantguard-alert-card ${a.severity.toLowerCase()}" style="cursor:pointer" onclick="showAlertDetailsFromDetail('${a.id}')">
            <div style="display:flex;justify-content:space-between;align-items:flex-start">
              <div style="flex:1">
                <div style="font-weight:600;font-size:12px">${escapeHtml(a.headline)}</div>
                <div style="font-size:10px;color:var(--color-text-tertiary);margin-top:4px">${formatTime(a.action_timestamp)}</div>
              </div>
              <span class="badge ${getBadgeClass(a.severity)}">${a.severity}</span>
            </div>
          </div>
        `).join('')}
      </div>
    `
    const container = el.querySelector('#other-alerts')
    if (container) container.innerHTML = html
  } else {
    const container = el.querySelector('#other-alerts')
    if (container) container.style.display = 'none'
  }
}

window.dismissAndRefreshDetail = async function(alertId) {
  try {
    await dismissAlert(alertId)
    showToast('Alert dismissed', 'success')
    await refreshData()
  } catch (error) {
    showToast('Failed to dismiss alert', 'error')
  }
}

window.showAlertDetailsFromDetail = function(alertId) {
  showAlertDetails(alertId)
}

window.startCorrInvestigation = async function(correlationId, title) {
  try {
    activeSection = 'investigation'
    currentInvestigation = await startInvestigation(null, correlationId, title)
    const el = document.getElementById('page-tenantguard')
    if (el) {
      const content = el.querySelector('#tg-content')
      if (content) {
        content.innerHTML = renderInvestigationChat()
        wireInvestigationChat(el)
        loadInvestigationMessages()
      }
    }
  } catch (error) {
    showToast('Failed to start investigation: ' + error.message, 'error')
  }
}

window.closeInvestigation = function() {
  currentInvestigation = null
  activeSection = 'alerts'
  const el = document.getElementById('page-tenantguard')
  if (el) {
    const content = el.querySelector('#tg-content')
    if (content) {
      content.innerHTML = renderAlertsSection()
      wireAlerts(el)
    }
  }
}

async function wireInvestigationChat(el) {
  const sendBtn = el.querySelector('#investigation-send')
  const input = el.querySelector('#investigation-input')
  const reportBtn = el.querySelector('#investigation-report')

  if (sendBtn && input) {
    sendBtn.addEventListener('click', sendInvestigationMessage)
    input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault()
        sendInvestigationMessage()
      }
    })
  }

  if (reportBtn) {
    reportBtn.addEventListener('click', async () => {
      try {
        reportBtn.disabled = true
        reportBtn.innerHTML = '<span class="spinner dark"></span>'
        const report = await generateInvestigationReport(currentInvestigation.id)
        showToast('Report generated! Downloading...', 'success')
        // Could download the report or display it
        reportBtn.disabled = false
        reportBtn.innerHTML = '<i class="ti ti-file-text"></i> Report'
      } catch (error) {
        showToast('Failed to generate report: ' + error.message, 'error')
        reportBtn.disabled = false
        reportBtn.innerHTML = '<i class="ti ti-file-text"></i> Report'
      }
    })
  }
}

async function sendInvestigationMessage() {
  const el = document.getElementById('page-tenantguard')
  const input = el?.querySelector('#investigation-input')
  if (!input) return

  const message = input.value.trim()
  if (!message) return

  try {
    input.value = ''
    input.disabled = true

    // Add user message to display
    const messagesEl = el.querySelector('#investigation-messages')
    if (messagesEl) {
      messagesEl.innerHTML += `
        <div style="margin-bottom:8px;text-align:right">
          <div style="display:inline-block;max-width:70%;background:var(--clr-primary);color:white;padding:8px 12px;border-radius:4px;font-size:12px;text-align:left">
            ${escapeHtml(message)}
          </div>
        </div>
      `
      messagesEl.scrollTop = messagesEl.scrollHeight
    }

    // Get agent response
    const response = await chatInvestigation(currentInvestigation.id, message)

    // Add agent response
    if (messagesEl) {
      messagesEl.innerHTML += `
        <div style="margin-bottom:8px">
          <div style="display:inline-block;max-width:70%;background:var(--color-background-secondary);padding:8px 12px;border-radius:4px;font-size:12px;border:0.5px solid var(--color-border-secondary);color:var(--color-text-secondary)">
            ${escapeHtml(response.response).replace(/\n/g, '<br>')}
          </div>
        </div>
      `
      messagesEl.scrollTop = messagesEl.scrollHeight
    }

    input.disabled = false
    input.focus()
  } catch (error) {
    showToast('Failed to send message: ' + error.message, 'error')
    const input = el?.querySelector('#investigation-input')
    if (input) input.disabled = false
  }
}

async function loadInvestigationMessages() {
  try {
    const investigation = await getInvestigation(currentInvestigation.id)
    const messagesEl = document.querySelector('#investigation-messages')

    if (messagesEl && investigation.messages) {
      messagesEl.innerHTML = investigation.messages.map(m => `
        <div style="margin-bottom:8px;${m.sender_type === 'user' ? 'text-align:right' : ''}">
          <div style="display:inline-block;max-width:70%;${m.sender_type === 'user' ? 'background:var(--clr-primary);color:white' : 'background:var(--color-background-secondary);border:0.5px solid var(--color-border-secondary);color:var(--color-text-secondary)'};padding:8px 12px;border-radius:4px;font-size:12px;${m.sender_type !== 'user' ? 'text-align:left' : ''}">
            ${escapeHtml(m.message_text).replace(/\n/g, '<br>')}
          </div>
        </div>
      `).join('')
      messagesEl.scrollTop = messagesEl.scrollHeight
    }
  } catch (error) {
    console.error('Failed to load messages:', error)
  }
}

function formatTime(isoString) {
  if (!isoString) return 'Unknown'
  const date = new Date(isoString)
  return date.toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1)
}

function escapeHtml(text) {
  if (!text) return ''
  const map = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;'
  }
  return String(text).replace(/[&<>"']/g, m => map[m])
}

function getBadgeClass(severity) {
  switch (severity?.toUpperCase()) {
    case 'CRITICAL': return 'danger'
    case 'HIGH': return 'warning'
    case 'MEDIUM': return 'info'
    default: return 'neutral'
  }
}

function getSeverityColor(severity) {
  switch (severity?.toUpperCase()) {
    case 'CRITICAL': return 'var(--clr-danger-text)'
    case 'HIGH': return 'var(--clr-warning-text)'
    case 'MEDIUM': return 'var(--clr-info-text)'
    default: return 'var(--color-text-primary)'
  }
}
