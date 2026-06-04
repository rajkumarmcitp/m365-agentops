import { go } from '../app.js'
import { getSecurityScore } from '../lib/api-client.js'
import { SECURE_SCORE, IDENTITY, EMAIL, ENDPOINT, TEAMS_SEC, SHAREPOINT_SEC, DATA_PROTECTION, PRIV_ACCESS, GUEST_GOVERNANCE, INCIDENTS, RECOMMENDATIONS, SECURITY_COPILOT_KB } from '../data/security-data.js'

let activeSection = 'executive'
let realSecureScore = null
let copilotMessages = []
let copilotInit = false

const SEC_TABS = [
  { id: 'executive', label: 'Executive', icon: 'ti-layout-dashboard' },
  { id: 'securescore', label: 'Secure Score', icon: 'ti-shield-check' },
  { id: 'identity', label: 'Identity', icon: 'ti-user-check' },
  { id: 'email', label: 'Email', icon: 'ti-mail' },
  { id: 'endpoint', label: 'Endpoint', icon: 'ti-device-laptop' },
  { id: 'teams', label: 'Teams', icon: 'ti-brand-teams' },
  { id: 'sharepoint', label: 'SharePoint', icon: 'ti-brand-sharepoint' },
  { id: 'dataprotection', label: 'Data Protection', icon: 'ti-lock' },
  { id: 'privaccess', label: 'Priv. Access', icon: 'ti-crown' },
  { id: 'guests', label: 'Guests', icon: 'ti-user-plus' },
  { id: 'incidents', label: 'Incidents', icon: 'ti-alert-triangle' },
  { id: 'recommendations', label: 'Recommendations', icon: 'ti-checklist' },
  { id: 'copilot', label: 'Security Copilot', icon: 'ti-robot' },
]

export async function initSecurity() {
  const el = document.getElementById('page-security')
  if (!el) return

  el.innerHTML = `<div style="padding:20px;text-align:center"><div class="spinner"></div><p>Loading security data...</p></div>`

  try {
    console.log('📡 Fetching real security data from backend...')
    const scoreResult = await getSecurityScore()

    if (scoreResult.success) {
      realSecureScore = scoreResult.data || SECURE_SCORE
      console.log('✅ Loaded real secure score from API')
    } else {
      realSecureScore = SECURE_SCORE
      console.warn('⚠️ Using simulated secure score data')
    }

    render(el)
  } catch (error) {
    console.error('❌ Error loading security data:', error)
    realSecureScore = SECURE_SCORE
    render(el)
  }
}

function render(el) {
  const ss = realSecureScore || SECURE_SCORE
  const critCount = INCIDENTS.filter(i => i.severity === 'critical').length
  const highCount = INCIDENTS.filter(i => i.severity === 'high').length

  el.innerHTML = `
    <div class="page-header">
      <div>
        <div class="page-title"><i class="ti ti-shield-exclamation"></i> Security Command Center</div>
        <div class="page-subtitle">Single-pane-of-glass across Microsoft 365 · Last scan: Today 08:45</div>
      </div>
      <div class="page-actions">
        <button class="btn" id="sec-refresh"><i class="ti ti-refresh"></i> Refresh</button>
      </div>
    </div>

    <!-- Top-5 KPI Strip -->
    <div class="kpi-row mb-3">
      <div class="kpi-tile">
        <div class="kpi-value success">${ss.currentScore}/${ss.maxScore}</div>
        <div class="kpi-label">Secure Score</div>
        <div style="font-size:10px;margin-top:3px;color:var(--color-text-tertiary)">${Math.round((ss.currentScore/ss.maxScore)*100)}% coverage</div>
      </div>
      <div class="kpi-tile">
        <div class="kpi-value ${critCount > 0 ? 'danger' : 'success'}">${critCount}</div>
        <div class="kpi-label">Critical Risks</div>
      </div>
      <div class="kpi-tile">
        <div class="kpi-value warning">${IDENTITY.highRiskUsers}</div>
        <div class="kpi-label">High-Risk Users</div>
      </div>
      <div class="kpi-tile">
        <div class="kpi-value info">${ENDPOINT.nonCompliantDevices}</div>
        <div class="kpi-label">Non-Compliant Devices</div>
      </div>
      <div class="kpi-tile">
        <div class="kpi-value warning">${RECOMMENDATIONS.length}</div>
        <div class="kpi-label">Recommendations</div>
      </div>
    </div>

    <!-- Sub-navigation -->
    <div class="intune-subnav" id="sec-subnav">
      ${SEC_TABS.map(t => `
        <button class="intune-tab-btn ${activeSection === t.id ? 'active' : ''}" data-sec-section="${t.id}">
          <i class="ti ${t.icon}"></i><span>${t.label}</span>
        </button>
      `).join('')}
    </div>

    <!-- Content -->
    <div id="sec-content" style="margin-top:16px">${renderSection(ss)}</div>
  `

  el.querySelectorAll('.intune-tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      activeSection = btn.dataset.secSection
      const contentDiv = el.querySelector('#sec-content')
      if (contentDiv) contentDiv.innerHTML = renderSection(ss)
    })
  })

  el.querySelector('#sec-refresh')?.addEventListener('click', () => {
    const btn = el.querySelector('#sec-refresh')
    btn.innerHTML = `<span class="spinner dark"></span> Scanning...`
    btn.disabled = true
    setTimeout(() => {
      btn.innerHTML = `<i class="ti ti-refresh"></i> Refresh`
      btn.disabled = false
    }, 2000)
  })
}

function renderSection(ss) {
  const renderFns = {
    executive: () => renderExecutive(ss),
    securescore: () => renderSecureScore(ss),
    identity: () => renderIdentity(),
    email: () => renderEmail(),
    endpoint: () => renderEndpoint(),
    teams: () => renderTeams(),
    sharepoint: () => renderSharePoint(),
    dataprotection: () => renderDataProtection(),
    privaccess: () => renderPrivAccess(),
    guests: () => renderGuests(),
    incidents: () => renderIncidents(),
    recommendations: () => renderRecommendations(),
    copilot: () => renderCopilot(),
  }

  const fn = renderFns[activeSection]
  return fn ? fn() : '<div class="alert info">Select a section above</div>'
}

function renderExecutive(ss) {
  return `
    <div class="card">
      <div class="card-header">
        <span class="card-title">Executive Security Overview</span>
      </div>
      <div style="padding:16px">
        <div style="margin-bottom:16px">
          <div style="font-weight:600;margin-bottom:8px">Microsoft Secure Score: ${ss.currentScore}/${ss.maxScore}</div>
          <div style="background:var(--color-bg-secondary);border-radius:4px;height:20px;overflow:hidden">
            <div style="background:#10b981;height:100%;width:${(ss.currentScore/ss.maxScore)*100}%"></div>
          </div>
        </div>
        <div class="grid-2" style="gap:16px;margin-top:16px">
          <div><strong>Critical Incidents</strong><div style="font-size:20px;font-weight:700;color:#dc2626">${INCIDENTS.filter(i => i.severity === 'critical').length}</div></div>
          <div><strong>High-Risk Users</strong><div style="font-size:20px;font-weight:700;color:#f97316">${IDENTITY.highRiskUsers}</div></div>
          <div><strong>MFA Adoption</strong><div style="font-size:20px;font-weight:700;color:#0084ff">${IDENTITY.mfaAdoption}%</div></div>
          <div><strong>Device Compliance</strong><div style="font-size:20px;font-weight:700;color:#10b981">${ENDPOINT.compliancePercentage}%</div></div>
          <div><strong>External Guests</strong><div style="font-size:20px;font-weight:700;color:#f59e0b">${GUEST_GOVERNANCE.totalGuests}</div></div>
          <div><strong>DLP Violations</strong><div style="font-size:20px;font-weight:700;color:#6366f1">${DATA_PROTECTION.dlpViolations}</div></div>
        </div>
      </div>
    </div>
  `
}

function renderSecureScore(ss) {
  return `
    <div class="card">
      <div class="card-header"><span class="card-title">Secure Score Breakdown</span></div>
      <div style="padding:16px">
        <div style="margin-bottom:20px">
          <div style="font-size:14px;font-weight:600;margin-bottom:8px">Score: ${ss.currentScore}/${ss.maxScore} (${Math.round((ss.currentScore/ss.maxScore)*100)}%)</div>
          <div style="background:var(--color-bg-secondary);border-radius:4px;height:24px;overflow:hidden">
            <div style="background:#10b981;height:100%;width:${(ss.currentScore/ss.maxScore)*100}%"></div>
          </div>
        </div>
        <div style="font-size:12px;color:var(--color-text-secondary);margin-bottom:16px">
          Your tenant is performing better than ${ss.percentile || 50}% of similar organizations.
        </div>
        <div class="grid-2" style="gap:16px">
          <div style="padding:12px;background:var(--color-bg-secondary);border-radius:4px">
            <div style="font-size:12px;color:var(--color-text-tertiary)">Identity & Access</div>
            <div style="font-size:18px;font-weight:700">18/40</div>
          </div>
          <div style="padding:12px;background:var(--color-bg-secondary);border-radius:4px">
            <div style="font-size:12px;color:var(--color-text-tertiary)">Data & Apps</div>
            <div style="font-size:18px;font-weight:700">12/30</div>
          </div>
          <div style="padding:12px;background:var(--color-bg-secondary);border-radius:4px">
            <div style="font-size:12px;color:var(--color-text-tertiary)">Infrastructure</div>
            <div style="font-size:18px;font-weight:700">22/22</div>
          </div>
          <div style="padding:12px;background:var(--color-bg-secondary);border-radius:4px">
            <div style="font-size:12px;color:var(--color-text-tertiary)">Devices</div>
            <div style="font-size:18px;font-weight:700">16/42</div>
          </div>
        </div>
      </div>
    </div>
  `
}

function renderIdentity() {
  return `<div class="card"><div class="card-header"><span class="card-title">Identity Security (Entra ID)</span></div><div style="padding:16px"><strong>MFA Status:</strong> ${IDENTITY.mfaAdoption}% adoption · ${IDENTITY.highRiskUsers} high-risk users · ${IDENTITY.globalAdmins} global admins</div></div>`
}

function renderEmail() {
  return `<div class="card"><div class="card-header"><span class="card-title">Email Security</span></div><div style="padding:16px"><strong>Protection:</strong> ${EMAIL.phishingBlocked} phishing attempts blocked · SPF/DKIM/DMARC: ${EMAIL.spf ? '✅' : '❌'}</div></div>`
}

function renderEndpoint() {
  return `<div class="card"><div class="card-header"><span class="card-title">Endpoint Security</span></div><div style="padding:16px"><strong>Status:</strong> ${ENDPOINT.totalDevices} devices · ${ENDPOINT.compliancePercentage}% compliant · ${ENDPOINT.nonCompliantDevices} non-compliant</div></div>`
}

function renderTeams() {
  return `<div class="card"><div class="card-header"><span class="card-title">Teams Security</span></div><div style="padding:16px"><strong>Configuration:</strong> ${TEAMS_SEC.publicTeams} public teams · ${TEAMS_SEC.guestAccessTeams} with guest access</div></div>`
}

function renderSharePoint() {
  return `<div class="card"><div class="card-header"><span class="card-title">SharePoint Security</span></div><div style="padding:16px"><strong>Sharing:</strong> ${SHAREPOINT_SEC.externallySharedSites} externally shared sites · ${SHAREPOINT_SEC.anonymousLinks} anonymous links active</div></div>`
}

function renderDataProtection() {
  return `<div class="card"><div class="card-header"><span class="card-title">Data Protection</span></div><div style="padding:16px"><strong>DLP:</strong> ${DATA_PROTECTION.dlpViolations} violations detected · ${DATA_PROTECTION.sensitivityLabelsApplied}% files labeled</div></div>`
}

function renderPrivAccess() {
  return `<div class="card"><div class="card-header"><span class="card-title">Privileged Access</span></div><div style="padding:16px"><strong>Admin Accounts:</strong> ${PRIV_ACCESS.globalAdmins} global admins · ${PRIV_ACCESS.securityAdmins} security admins</div></div>`
}

function renderGuests() {
  return `<div class="card"><div class="card-header"><span class="card-title">Guest Governance</span></div><div style="padding:16px"><strong>Guests:</strong> ${GUEST_GOVERNANCE.totalGuests} total · ${GUEST_GOVERNANCE.dormantGuests} inactive (90+ days)</div></div>`
}

function renderIncidents() {
  const active = INCIDENTS.filter(i => i.status === 'open')
  return `
    <div class="card">
      <div class="card-header"><span class="card-title">Active Incidents</span><span class="badge danger">${active.length}</span></div>
      <div style="padding:16px">
        ${active.slice(0, 5).map(i => `
          <div style="padding:8px;border-bottom:1px solid var(--color-border)">
            <div style="font-weight:600">${i.title}</div>
            <div style="font-size:12px;color:var(--color-text-tertiary)">${i.severity.toUpperCase()}</div>
          </div>
        `).join('')}
      </div>
    </div>
  `
}

function renderRecommendations() {
  return `
    <div class="card">
      <div class="card-header"><span class="card-title">Top Recommendations</span><span class="badge blue">${RECOMMENDATIONS.length}</span></div>
      <div style="padding:16px">
        ${RECOMMENDATIONS.slice(0, 8).map(r => `
          <div style="padding:8px;border-bottom:1px solid var(--color-border);display:flex;gap:8px">
            <div>${r.priority === 'critical' ? '🔴' : r.priority === 'high' ? '🟠' : '🟡'}</div>
            <div style="flex:1"><div style="font-weight:600;font-size:12px">${r.title}</div><div style="font-size:10px;color:var(--color-text-tertiary)">+${r.scoreGain} pts</div></div>
          </div>
        `).join('')}
      </div>
    </div>
  `
}

function renderCopilot() {
  return `
    <div class="card">
      <div class="card-header"><span class="card-title">Security Copilot</span></div>
      <div style="padding:16px">
        <div style="margin-bottom:16px"><strong>Questions you can ask:</strong></div>
        <ul style="font-size:12px;color:var(--color-text-secondary);list-style:none;padding:0">
          <li>✓ Show me all high-risk users</li>
          <li>✓ Why did Secure Score drop?</li>
          <li>✓ Which devices are non-compliant?</li>
          <li>✓ What are the top security improvements?</li>
          <li>✓ Summarize security posture</li>
        </ul>
      </div>
    </div>
  `
}
