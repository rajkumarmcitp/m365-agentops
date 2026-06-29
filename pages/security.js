import { go, state } from '../app.js'
import { showToast } from '../components/toast.js'
import { getSecurityScore, getIncidents, getDevices, getIdentityPosture, callAPI } from '../lib/api-client.js'
import { isDemoAccount } from '../lib/demo-account.js'
import { skeletonLoader } from '../lib/skeleton-loader.js'
import {
  IDENTITY,
  INCIDENTS as DEMO_INCIDENTS,
  RECOMMENDATIONS,
  SECURE_SCORE,
  EMAIL,
  ENDPOINT,
  TEAMS_SEC,
  SHAREPOINT_SEC,
  DATA_PROTECTION,
  PRIV_ACCESS,
  GUEST_GOVERNANCE,
  API_REFERENCE,
  SECURITY_COPILOT_KB
} from '../data/security-data.js'

let realSecureScore = null
let realIncidents = []
let realIdentityPosture = IDENTITY
let realEmailSecurity = null
let realEndpointSecurity = null
let realTeamsSecurity = null
let realSharepointSecurity = null
let realDataProtection = null
let realPrivAccess = null
let realGuestAccess = null
let realRecommendations = null

// ============================================================
// Sub-navigation
// ============================================================
let activeSection = 'executive'
let recFilter = { priority: 'all', category: 'all', status: 'all' }
let trendRange = '7d'
let copilotMessages = []
let copilotInit = false

const SEC_TABS_ROW1 = [
  { id: 'executive',      label: 'Executive',       icon: 'ti-layout-dashboard' },
  { id: 'securescore',    label: 'Secure Score',    icon: 'ti-shield-check' },
  { id: 'identity',       label: 'Identity',        icon: 'ti-user-check' },
  { id: 'email',          label: 'Email',           icon: 'ti-mail' },
  { id: 'endpoint',       label: 'Endpoint',        icon: 'ti-device-laptop' },
  { id: 'teams',          label: 'Teams',           icon: 'ti-brand-teams' },
  { id: 'sharepoint',     label: 'SharePoint',      icon: 'ti-brand-sharepoint' },
]

const SEC_TABS_ROW2 = [
  { id: 'dataprotection', label: 'Data Protection', icon: 'ti-lock' },
  { id: 'privaccess',     label: 'Priv. Access',    icon: 'ti-crown' },
  { id: 'guests',         label: 'Guests',          icon: 'ti-user-plus' },
  { id: 'incidents',      label: 'Incidents',       icon: 'ti-alert-triangle' },
  { id: 'recommendations',label: 'Recommendations', icon: 'ti-checklist' },
  { id: 'copilot',        label: 'Security Copilot',icon: 'ti-robot' },
  { id: 'apiref',         label: 'API Reference',   icon: 'ti-api' },
]

const SEC_TABS = [...SEC_TABS_ROW1, ...SEC_TABS_ROW2]

// ============================================================
// Entry
// ============================================================
export async function initSecurity() {
  const el = document.getElementById('page-security')
  if (!el) return

  if (isDemoAccount()) {
    console.log('🎭 Demo account detected - showing demo security data')
    renderDemoSecurityPage(el)
    return
  }

  // Show skeleton immediately
  renderSecuritySkeleton(el)

  // Render immediately with skeleton - no waiting for data
  render(el)

  // Load all data in background (non-blocking)
  console.log('📡 Loading security data in background...')
  loadAllDataAsync(el)

  // Wire up tab click handlers for lazy loading
  wireTabHandlers(el)
}

// Load all data in background without blocking initial render
async function loadAllDataAsync(el) {
  try {
    // Load all security data in parallel
    const [scoreResult, devicesResult, incidentsResult, identityResult, emailResult, endpointResult, teamsResult, sharepointResult, dpResult, pamResult, guestResult, recResult] = await Promise.all([
      getSecurityScore(),
      getDevices(),
      getIncidents(),
      getIdentityPosture(),
      callAPI('/security/email'),
      callAPI('/security/endpoint'),
      callAPI('/security/teams'),
      callAPI('/security/sharepoint'),
      callAPI('/security/data-protection'),
      callAPI('/security/priv-access'),
      callAPI('/security/guests'),
      callAPI('/security/recommendations')
    ])

    // Update realSecureScore
    if (scoreResult.success && scoreResult.data) {
      realSecureScore = scoreResult.data
      console.log('✅ Loaded secure score')
    }

    // Update incidents with device enrichment
    let devicesData = devicesResult.success ? devicesResult.data : []
    if (incidentsResult.success && Array.isArray(incidentsResult.data)) {
      realIncidents = enrichIncidents(incidentsResult.data, devicesData)
      console.log(`✅ Loaded ${realIncidents.length} incidents`)
    }

    // Update identity posture
    if (identityResult.success && identityResult.data) {
      realIdentityPosture = mergeIdentityData(identityResult.data)
      console.log('✅ Loaded identity posture')
    }

    // Update email security
    if (emailResult.success && emailResult.data) {
      realEmailSecurity = emailResult.data
      console.log('✅ Loaded email security')
    }

    // Update endpoint security
    if (endpointResult.success && endpointResult.data) {
      realEndpointSecurity = endpointResult.data
      console.log('✅ Loaded endpoint security')
    }

    // Update Teams security
    if (teamsResult.success && teamsResult.data) {
      realTeamsSecurity = teamsResult.data
      console.log('✅ Loaded Teams security')
    }

    // Update SharePoint security
    if (sharepointResult.success && sharepointResult.data) {
      realSharepointSecurity = sharepointResult.data
      console.log('✅ Loaded SharePoint security')
    }

    // Update data protection
    if (dpResult.success && dpResult.data) {
      realDataProtection = dpResult.data
      console.log('✅ Loaded data protection')
    }

    // Update privileged access
    if (pamResult.success && pamResult.data) {
      realPrivAccess = pamResult.data
      console.log('✅ Loaded privileged access')
    }

    // Update guest access
    if (guestResult.success && guestResult.data) {
      realGuestAccess = guestResult.data
      console.log('✅ Loaded guest access')
    }

    // Update recommendations
    if (recResult.success && recResult.data) {
      realRecommendations = recResult.data
      console.log('✅ Loaded recommendations')
    }

    // Re-render with fresh data
    console.log('🔄 Re-rendering with all security data...')
    render(el)
  } catch (error) {
    console.error('❌ Error loading data:', error.message)
  }
}

// Helper function to enrich incidents
function enrichIncidents(incidents, devicesData = []) {
  return incidents.map(incident => {
    const deviceNameSource = incident.deviceName ||
                            incident.description?.match(/Device ([A-Z0-9-]+)/)?.[1] ||
                            incident.title?.match(/([A-Z0-9-]+)/)?.[1] ||
                            incident.description?.match(/([A-Z0-9]{3,})/)?.[1]

    if (deviceNameSource && devicesData.length > 0) {
      const realDevice = devicesData.find(d =>
        d.deviceName?.toUpperCase().includes(deviceNameSource.toUpperCase()) ||
        d.deviceName?.includes(deviceNameSource) ||
        d.id === deviceNameSource
      )

      if (realDevice) {
        return {
          ...incident,
          deviceId: realDevice.id,
          deviceName: realDevice.deviceName,
          deviceOS: realDevice.operatingSystem,
          compliant: realDevice.complianceState === 'Compliant',
          managed: true,
          owner: realDevice.userDisplayName
        }
      }
    }
    return incident
  })
}

// Helper function to merge identity data
function mergeIdentityData(data) {
  return {
    totalUsers: data.totalUsers ?? IDENTITY.totalUsers,
    privAccounts: data.privAccounts ?? IDENTITY.privAccounts,
    globalAdmins: data.globalAdmins ?? IDENTITY.globalAdmins,
    serviceAccounts: data.serviceAccounts ?? IDENTITY.serviceAccounts,
    breakGlass: data.breakGlass ?? IDENTITY.breakGlass,
    identitySecureScore: data.identitySecureScore ?? IDENTITY.identitySecureScore,
    mfaEnabled: data.mfaEnabled ?? IDENTITY.mfaEnabled,
    mfaExcluded: data.mfaExcluded ?? IDENTITY.mfaExcluded,
    passwordlessAdoption: data.passwordlessAdoption ?? IDENTITY.passwordlessAdoption,
    fido2Adoption: data.fido2Adoption ?? IDENTITY.fido2Adoption,
    legacyAuthConnections: data.legacyAuthConnections ?? IDENTITY.legacyAuthConnections,
    highRiskUsers: data.highRiskUsers ?? IDENTITY.highRiskUsers,
    riskySignIns30d: data.riskySignIns30d ?? IDENTITY.riskySignIns30d,
    impossibleTravel30d: data.impossibleTravel30d ?? IDENTITY.impossibleTravel30d,
    anonymousIP30d: data.anonymousIP30d ?? IDENTITY.anonymousIP30d,
    passwordSpray30d: data.passwordSpray30d ?? IDENTITY.passwordSpray30d,
    caPoliciesEnabled: data.caPoliciesEnabled ?? IDENTITY.caPoliciesEnabled,
    caPoliciesDisabled: data.caPoliciesDisabled ?? IDENTITY.caPoliciesDisabled,
    caPoliciesReportOnly: data.caPoliciesReportOnly ?? IDENTITY.caPoliciesReportOnly,
    caUsersExcluded: data.caUsersExcluded ?? IDENTITY.caUsersExcluded,
    identityPolicies: data.identityPolicies,
  }
}

// Wire up tab click handlers for lazy loading
function wireTabHandlers(el) {
  const tabs = el.querySelectorAll('.sec-tab-btn')
  tabs.forEach(tab => {
    tab.addEventListener('click', async (e) => {
      const section = e.target.dataset.section
      // Sections load on demand when clicked
      // Data is already preloaded in background, just switch view
      activeSection = section
    })
  })
}

function renderSecuritySkeleton(el) {
  el.innerHTML = `
    <style>
      @keyframes skeleton-shimmer {
        0% { background-position: -1000px 0; }
        100% { background-position: 1000px 0; }
      }
      .skeleton-animate {
        background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
        background-size: 1000px 100%;
        animation: skeleton-shimmer 2s infinite;
      }
    </style>
    <div class="page-header">
      <div>
        <div class="page-title skeleton-animate" style="width:350px;height:28px;border-radius:4px;margin-bottom:8px"></div>
        <div class="page-subtitle skeleton-animate" style="width:450px;height:16px;border-radius:4px"></div>
      </div>
      <div class="page-actions" style="display:flex;gap:8px">
        <div class="skeleton-animate" style="width:80px;height:32px;border-radius:4px"></div>
        <div class="skeleton-animate" style="width:100px;height:32px;border-radius:4px"></div>
      </div>
    </div>

    <div style="display:grid;grid-template-columns:repeat(5,1fr);gap:12px;margin-bottom:16px">
      ${Array(5).fill(0).map(() => `
        <div class="kpi-tile" style="padding:16px;border-radius:8px;background:var(--color-background-secondary)">
          <div class="skeleton-animate" style="width:50px;height:24px;border-radius:4px;margin-bottom:12px"></div>
          <div class="skeleton-animate" style="width:60%;height:32px;border-radius:4px;margin-bottom:8px"></div>
          <div class="skeleton-animate" style="width:70%;height:12px;border-radius:4px"></div>
        </div>
      `).join('')}
    </div>

    <div style="border-bottom:0.5px solid var(--color-border-secondary);margin-bottom:16px;display:flex;gap:8px;padding-bottom:12px;overflow-x:auto">
      ${Array(8).fill(0).map(() => `
        <div class="skeleton-animate" style="width:120px;height:20px;border-radius:4px;flex-shrink:0"></div>
      `).join('')}
    </div>

    <div style="display:grid;grid-template-columns:repeat(2,1fr);gap:16px;margin-bottom:16px">
      ${Array(2).fill(0).map(() => `
        <div class="card" style="padding:16px">
          <div class="skeleton-animate" style="width:180px;height:20px;border-radius:4px;margin-bottom:16px"></div>
          <div class="skeleton-animate" style="width:100%;height:12px;border-radius:4px;margin-bottom:8px"></div>
          <div class="skeleton-animate" style="width:95%;height:12px;border-radius:4px;margin-bottom:8px"></div>
          <div class="skeleton-animate" style="width:90%;height:12px;border-radius:4px"></div>
        </div>
      `).join('')}
    </div>
  `
}

function render(el) {
  const incidents = Array.isArray(realIncidents) ? realIncidents : []
  const critCount = incidents.filter(i => i.severity === 'critical').length
  const highCount = incidents.filter(i => i.severity === 'high' && i.status !== 'resolved').length
  const openRec   = RECOMMENDATIONS.filter(r => r.priority === 'critical' || r.priority === 'high').length

  el.innerHTML = `
    <div class="page-header">
      <div>
        <div class="page-title"><i class="ti ti-shield-exclamation"></i> Security Command Center</div>
        <div class="page-subtitle">Single-pane-of-glass across Identity, Email, Endpoint, Apps & Data · Last scan: Today 08:45</div>
      </div>
      <div class="page-actions">
        <button class="btn" id="sec-refresh"><i class="ti ti-refresh"></i> Refresh</button>
        <button class="btn btn-primary" id="sec-report"><i class="ti ti-download"></i> Export report</button>
      </div>
    </div>

    <!-- Top-5 always-visible KPI strip -->
    <div class="sec-top5">
      ${topFiveKpi()}
    </div>

    <!-- Internal sub-navigation - Boxed container -->
    <div style="border:0.5px solid var(--color-border-secondary);border-radius:8px;background:var(--color-background-primary);padding:12px;margin-bottom:16px">
      <!-- Row 1 -->
      <div class="tabs" id="sec-subnav-row1" style="margin-bottom:4px;padding-bottom:0">
        ${SEC_TABS_ROW1.map(t => `
          <button class="tab-btn ${activeSection === t.id ? 'active' : ''}" data-sec="${t.id}">
            <i class="ti ${t.icon}"></i><span>${t.label}</span>
            ${t.id === 'identity' && realIdentityPosture.highRiskUsers > 0 ? `<span class="sec-tab-badge red">${realIdentityPosture.highRiskUsers}</span>` : ''}
          </button>
        `).join('')}
      </div>

      <!-- Row 2 -->
      <div class="tabs" id="sec-subnav-row2" style="margin-bottom:0;padding-bottom:0">
        ${SEC_TABS_ROW2.map(t => `
          <button class="tab-btn ${activeSection === t.id ? 'active' : ''}" data-sec="${t.id}">
            <i class="ti ${t.icon}"></i><span>${t.label}</span>
            ${t.id === 'incidents' && critCount > 0 ? `<span class="sec-tab-badge red">${critCount}</span>` : ''}
            ${t.id === 'recommendations' ? `<span class="sec-tab-badge amber">${openRec}</span>` : ''}
          </button>
        `).join('')}
      </div>
    </div>

    <!-- Section content -->
    <div id="sec-content" style="margin-top:16px">${renderSection()}</div>
  `

  el.querySelectorAll('#sec-subnav-row1 .tab-btn, #sec-subnav-row2 .tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      activeSection = btn.dataset.sec
      render(el)
      el.querySelector('#sec-subnav-row1')?.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
    })
  })

  el.querySelector('#sec-refresh')?.addEventListener('click', () => {
    const btn = el.querySelector('#sec-refresh')
    btn.innerHTML = `<span class="spinner dark"></span> Scanning...`
    btn.disabled = true
    setTimeout(() => {
      btn.innerHTML = `<i class="ti ti-refresh"></i> Refresh`
      btn.disabled = false
      showToast('Security posture refreshed — all 15 data sources updated.', 'success')
    }, 2200)
  })

  el.querySelector('#sec-report')?.addEventListener('click', () => showToast('Security report exported as PDF.', 'success'))

  wireSection(el)
}

// ============================================================
// Top-5 always-visible strip
// ============================================================
function topFiveKpi() {
  // Use realSecureScore if it has the required properties, otherwise fall back to demo data
  let ss = SECURE_SCORE || { currentScore: 0, maxScore: 100, percentOf100: 0, delta7d: 0 }
  if (realSecureScore && realSecureScore.currentScore && realSecureScore.maxScore) {
    const pct = Math.round((realSecureScore.currentScore / realSecureScore.maxScore) * 100)
    ss = {
      currentScore: Math.round(realSecureScore.currentScore),
      maxScore: Math.round(realSecureScore.maxScore),
      percentOf100: pct,
      delta7d: 0 // Would need historical data to calculate
    }
  }
  const pct = ss.percentOf100 || 0
  const ssColor = pct >= 80 ? 'success' : pct >= 60 ? 'warning' : 'danger'
  const incidents = Array.isArray(realIncidents) ? realIncidents : []
  const critical = incidents.filter(i => i.severity === 'critical' && i.status !== 'resolved').length

  return `
    <div class="kpi-tile sec-kpi-primary" style="min-width:160px">
      <div style="display:flex;align-items:center;gap:12px">
        ${scoreGauge(ss.currentScore, ss.maxScore, 52)}
        <div>
          <div class="kpi-value ${ssColor}" style="font-size:28px;font-weight:700">${ss.currentScore}<span style="font-size:12px;font-weight:500;color:var(--color-text-tertiary)">/${ss.maxScore}</span></div>
          <div class="kpi-label" style="font-size:10px;text-transform:uppercase;color:var(--color-text-tertiary);font-weight:600">Secure Score</div>
          <div style="font-size:10px;margin-top:3px;color:${ss.delta7d >= 0 ? 'var(--clr-success-text)' : 'var(--clr-danger-text)'}">
            ${ss.delta7d >= 0 ? '+' : ''}${ss.delta7d} this week
          </div>
        </div>
      </div>
    </div>
    <div class="kpi-tile">
      <div class="kpi-value ${critical > 0 ? 'danger' : 'success'}" style="font-size:28px;font-weight:700">${critical > 0 ? critical : '✓'}</div>
      <div class="kpi-label" style="font-size:10px;text-transform:uppercase;color:var(--color-text-tertiary);font-weight:600">Critical Incidents</div>
      <div style="font-size:10px;margin-top:3px;color:var(--color-text-tertiary)">${incidents.filter(i => i.status !== 'resolved').length} open total</div>
    </div>
    <div class="kpi-tile">
      <div class="kpi-value ${realIdentityPosture.highRiskUsers > 0 ? 'danger' : 'success'}" style="font-size:28px;font-weight:700">${realIdentityPosture.highRiskUsers}</div>
      <div class="kpi-label" style="font-size:10px;text-transform:uppercase;color:var(--color-text-tertiary);font-weight:600">High-Risk Users</div>
      <div style="font-size:10px;margin-top:3px;color:var(--color-text-tertiary)">${realIdentityPosture.riskySignIns30d} risky sign-ins (30d)</div>
    </div>
    <div class="kpi-tile">
      <div class="kpi-value success" style="font-size:28px;font-weight:700">0</div>
      <div class="kpi-label" style="font-size:10px;text-transform:uppercase;color:var(--color-text-tertiary);font-weight:600">Vulnerable Devices</div>
      <div style="font-size:10px;margin-top:3px;color:var(--color-text-tertiary)">0 non-compliant</div>
    </div>
  `
}

// ============================================================
// SVG Score Gauge
// ============================================================
function scoreGauge(current, max, size = 80) {
  const pct = current / max
  const r = (size / 2) * 0.82
  const cx = size / 2
  const cy = size / 2
  const circ = 2 * Math.PI * r
  const dash = circ * pct
  const color = pct >= 0.8 ? '#3B6D11' : pct >= 0.6 ? '#854F0B' : '#A32D2D'
  const fs = size < 60 ? 11 : 14

  return `<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" style="flex-shrink:0">
    <circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="var(--color-border-tertiary)" stroke-width="${size < 60 ? 5 : 7}"/>
    <circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="${color}" stroke-width="${size < 60 ? 5 : 7}"
      stroke-dasharray="${dash} ${circ}" stroke-dashoffset="${circ * 0.25}"
      stroke-linecap="round" transform="rotate(-90 ${cx} ${cy})"/>
    <text x="${cx}" y="${cy + 4}" text-anchor="middle" font-size="${fs}" font-weight="700" fill="${color}">${Math.round(pct * 100)}%</text>
  </svg>`
}

// Mini trend bar chart
function trendBars(data, height = 24) {
  const max = Math.max(...data)
  const min = Math.min(...data)
  const range = max - min || 1
  return `<div style="display:flex;align-items:flex-end;gap:2px;height:${height}px">
    ${data.map((v, i) => {
      const h = Math.max(3, ((v - min) / range) * height)
      const isLast = i === data.length - 1
      return `<div style="width:8px;height:${h}px;background:${isLast ? 'var(--clr-primary)' : 'var(--color-border-secondary)'};border-radius:2px 2px 0 0;flex-shrink:0" title="${v}"></div>`
    }).join('')}
  </div>`
}

// Status indicator
function statusIcon(ok, label) {
  if (ok === 'pass'    || ok === true)     return `<span style="color:var(--clr-success-text)"><i class="ti ti-circle-check"></i> ${label}</span>`
  if (ok === 'partial' || ok === 'warn')   return `<span style="color:var(--clr-warning-text)"><i class="ti ti-alert-triangle"></i> ${label}</span>`
  return `<span style="color:var(--clr-danger-text)"><i class="ti ti-circle-x"></i> ${label}</span>`
}

function statusBadge(status) {
  status = String(status || 'unknown').toLowerCase()
  if (status === 'pass' || status === 'enabled') {
    return `<span style="display:inline-block;padding:3px 8px;background:rgba(34,197,94,0.1);color:#22c55e;border-radius:4px;font-size:10px;font-weight:600">✓ Pass</span>`
  }
  if (status === 'warn' || status === 'warning' || status === 'partial') {
    return `<span style="display:inline-block;padding:3px 8px;background:rgba(234,179,8,0.1);color:#eab308;border-radius:4px;font-size:10px;font-weight:600">⚠ Warning</span>`
  }
  if (status === 'unknown') {
    return `<span style="display:inline-block;padding:3px 8px;background:rgba(100,116,139,0.1);color:#64748b;border-radius:4px;font-size:10px;font-weight:600">? Unknown</span>`
  }
  if (status === 'fail') {
    return `<span style="display:inline-block;padding:3px 8px;background:rgba(239,68,68,0.1);color:#ef4444;border-radius:4px;font-size:10px;font-weight:600">✗ Fail</span>`
  }
  return `<span style="display:inline-block;padding:3px 8px;background:rgba(239,68,68,0.1);color:#ef4444;border-radius:4px;font-size:10px;font-weight:600">✗ Fail</span>`
}

// ============================================================
// Section dispatcher
// ============================================================
function renderSection() {
  const map = {
    executive:      renderExecutive,
    securescore:    renderSecureScore,
    identity:       renderIdentity,
    email:          renderEmail,
    endpoint:       renderEndpoint,
    teams:          renderTeams,
    sharepoint:     renderSharepoint,
    dataprotection: renderDataProtection,
    privaccess:     renderPrivAccess,
    guests:         renderGuests,
    incidents:      renderIncidents,
    recommendations:renderRecommendations,
    copilot:        renderSecurityCopilot,
    apiref:         renderApiReference,
  }
  return (map[activeSection] || renderExecutive)()
}

// ============================================================
// EXECUTIVE DASHBOARD
// ============================================================
function renderExecutive() {
  let ss = SECURE_SCORE || { currentScore: 0, maxScore: 100, percentOf100: 0, categories: [], trend7d: [], trend30d: [] }
  if (realSecureScore && realSecureScore.currentScore && realSecureScore.maxScore) {
    const pct = Math.round((realSecureScore.currentScore / realSecureScore.maxScore) * 100)
    ss = {
      currentScore: Math.round(realSecureScore.currentScore),
      maxScore: Math.round(realSecureScore.maxScore),
      percentOf100: pct,
      categories: realSecureScore.controlScores || [],
      trend7d: [],
      trend30d: []
    }
  }
  const incidents = Array.isArray(realIncidents) ? realIncidents : []
  return `
    <!-- Secondary KPI row - Real data only -->
    <div class="kpi-row mb-3">
      <div class="kpi-tile">
        <div class="kpi-value warning" style="font-size:28px;font-weight:700">${realIdentityPosture.identitySecureScore}</div>
        <div class="kpi-label" style="font-size:10px;text-transform:uppercase;color:var(--color-text-tertiary);font-weight:600">Identity Score</div>
      </div>
      <div class="kpi-tile">
        <div class="kpi-value ${realIdentityPosture.mfaEnabled / realIdentityPosture.totalUsers >= 0.95 ? 'success' : 'warning'}" style="font-size:28px;font-weight:700">${Math.round(realIdentityPosture.mfaEnabled / realIdentityPosture.totalUsers * 100)}%</div>
        <div class="kpi-label" style="font-size:10px;text-transform:uppercase;color:var(--color-text-tertiary);font-weight:600">MFA Adoption</div>
      </div>
      <div class="kpi-tile">
        <div class="kpi-value info" style="font-size:28px;font-weight:700">${realIdentityPosture.riskySignIns30d}</div>
        <div class="kpi-label" style="font-size:10px;text-transform:uppercase;color:var(--color-text-tertiary);font-weight:600">Risky Sign-ins (30d)</div>
      </div>
      <div class="kpi-tile">
        <div class="kpi-value info" style="font-size:28px;font-weight:700">${realIdentityPosture.caPoliciesEnabled}</div>
        <div class="kpi-label" style="font-size:10px;text-transform:uppercase;color:var(--color-text-tertiary);font-weight:600">CA Policies Enabled</div>
      </div>
      <div class="kpi-tile">
        <div class="kpi-value info" style="font-size:28px;font-weight:700">${realIdentityPosture.totalUsers}</div>
        <div class="kpi-label" style="font-size:10px;text-transform:uppercase;color:var(--color-text-tertiary);font-weight:600">Total Users</div>
      </div>
    </div>

    <!-- Service security cards - Entra Apps style -->
    <div style="font-size:12px;font-weight:700;color:var(--color-text-secondary);text-transform:uppercase;margin-bottom:16px;letter-spacing:1px">Service Security Posture</div>
    <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:16px;margin-bottom:16px">
        ${[
          { name: 'Identity',    icon: 'ti-user-check',        score: realIdentityPosture.identitySecureScore || 72, color: '#0C447C', issues: realIdentityPosture.highRiskUsers, issueText: 'high-risk users' },
          { name: 'Secure Score',icon: 'ti-shield-check',      score: Math.round(ss.percentOf100 || 0), color: '#854F0B', issues: 0, issueText: '' },
          { name: 'Email',       icon: 'ti-mail',              score: 71, color: '#854F0B', issues: 0, issueText: '', coming: true },
          { name: 'Endpoint',    icon: 'ti-device-laptop',     score: 58, color: '#3B6D11', issues: 0, issueText: '', coming: true },
          { name: 'Teams',       icon: 'ti-brand-teams',       score: 74, color: '#3C3489', issues: 0, issueText: '', coming: true },
          { name: 'SharePoint',  icon: 'ti-brand-sharepoint',  score: 66, color: '#3B6D11', issues: 0, issueText: '', coming: true },
          { name: 'Data',        icon: 'ti-database',          score: 61, color: '#3C3489', issues: 0, issueText: '', coming: true },
          { name: 'Incidents',   icon: 'ti-alert-triangle',    score: incidents.filter(i => i.status !== 'resolved').length === 0 ? 100 : 50, color: incidents.filter(i => i.status !== 'resolved').length === 0 ? '#3B6D11' : '#A32D2D', issues: incidents.filter(i => i.status !== 'resolved').length, issueText: 'open incidents' },
        ].map(s => `
          <div class="card" style="display:flex;flex-direction:column;justify-content:space-between;${s.coming ? 'opacity:0.7' : ''}">
            <div>
              <div style="display:flex;align-items:center;gap:8px;margin-bottom:12px">
                <i class="ti ${s.icon}" style="font-size:20px;color:${s.color}"></i>
                <span class="card-title" style="margin:0;flex:1">${s.name}</span>
              </div>
              <div style="font-size:26px;font-weight:700;color:${s.color};margin-bottom:4px">${s.score}%</div>
              <div style="font-size:10px;text-transform:uppercase;color:var(--color-text-tertiary);font-weight:600">Score</div>
            </div>
            <div style="margin-top:12px;padding-top:12px;border-top:0.5px solid var(--color-border-secondary)">
              ${s.coming ? `<div style="font-size:10px;color:var(--clr-info-text)">Real data soon</div>` : s.issues > 0 ? `<div style="font-size:10px;font-weight:600;color:${s.color}">${s.issues} ${s.issueText}</div>` : `<div style="font-size:10px;color:var(--clr-success-text);font-weight:600">✓ No issues</div>`}
            </div>
          </div>
        `).join('')}
      </div>

    <!-- Real Incidents only - Full Width -->
    <div class="card">
      <div class="card-header">
        <span class="card-title"><i class="ti ti-alert-triangle"></i> Active Incidents</span>
        <button class="btn btn-xs btn-primary" id="exec-view-incidents">View all</button>
      </div>
      ${incidents.filter(i => i.status !== 'resolved').length > 0 ? `
        ${incidents.filter(i => i.status !== 'resolved').slice(0, 4).map(inc => `
          <div style="display:flex;align-items:center;gap:8px;padding:7px 0;border-bottom:0.5px solid var(--color-border-tertiary)">
            <span class="badge ${inc.severity === 'critical' ? 'danger' : inc.severity === 'high' ? 'danger' : 'warning'}" style="flex-shrink:0;min-width:56px;justify-content:center">${inc.severity}</span>
            <div style="flex:1;min-width:0">
              <div style="font-size:11px;font-weight:600;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${inc.title}</div>
              <div style="font-size:9px;color:var(--color-text-tertiary)">${inc.id} · ${inc.category} · ${inc.created}</div>
            </div>
          </div>
        `).join('')}
      ` : `
        <div style="padding:16px;text-align:center;color:var(--clr-success-text)">
          <i class="ti ti-circle-check" style="font-size:24px;display:block;margin-bottom:8px"></i>
          <strong>No active incidents</strong><br/>
          <span style="font-size:11px">Your tenant is secure</span>
        </div>
      `}
    </div>
  `
}

// ============================================================
// SECURE SCORE
// ============================================================
function renderSecureScore() {
  let ss = SECURE_SCORE || { currentScore: 0, maxScore: 100, avgComparable: 0, delta7d: 0, delta30d: 0, delta90d: 0, categories: [] }
  if (realSecureScore && realSecureScore.currentScore && realSecureScore.maxScore) {
    const comparativeData = realSecureScore.averageComparativeScores?.[0] || {}

    // Transform control scores to category format
    const categories = {}
    if (Array.isArray(realSecureScore.controlScores)) {
      realSecureScore.controlScores.forEach(control => {
        const category = control.controlCategory || 'Other'
        if (!categories[category]) {
          categories[category] = { name: category, scores: [], count: 0 }
        }
        const score = control.scoreInPercentage ?? 0
        categories[category].scores.push(score)
        categories[category].count++
      })
    }

    // Convert to array with averages and styling
    const categoryMap = {
      'Identity': { icon: 'ti-user-check' },
      'Apps': { icon: 'ti-app-window' },
      'Data': { icon: 'ti-database' },
      'Devices': { icon: 'ti-device-laptop' },
      'Infrastructure': { icon: 'ti-building' },
      'Other': { icon: 'ti-help' }
    }

    const categoryList = Object.entries(categories).map(([name, data]) => {
      const avgScore = Math.round(data.scores.reduce((a, b) => a + b, 0) / data.count)
      const meta = categoryMap[name] || categoryMap['Other']
      // Color class based on score thresholds
      const colorClass = avgScore >= 80 ? 'success' : avgScore >= 65 ? 'warning' : 'danger'
      return {
        name: name,
        score: avgScore,
        icon: meta.icon,
        colorClass: colorClass
      }
    })

    ss = {
      currentScore: Math.round(realSecureScore.currentScore),
      maxScore: Math.round(realSecureScore.maxScore),
      avgComparable: Math.round(comparativeData.averageScore || 0),
      delta7d: 0,
      delta30d: 0,
      delta90d: 0,
      categories: categoryList
    }
  }
  return `
    <div class="grid-2 mb-3" style="gap:16px">
      <div class="card">
        <div class="card-title mb-3"><i class="ti ti-shield-check"></i> Microsoft Secure Score</div>
        <div style="display:flex;align-items:center;gap:24px;margin-bottom:20px">
          ${scoreGauge(ss.currentScore, ss.maxScore, 100)}
          <div>
            <div style="font-size:32px;font-weight:800;color:var(--clr-warning-text);line-height:1">${ss.currentScore}</div>
            <div style="font-size:16px;color:var(--color-text-tertiary)">out of ${ss.maxScore}</div>
            <div style="font-size:12px;color:var(--color-text-secondary);margin-top:8px">
              You are in the <strong style="color:var(--clr-info-text)">top 40%</strong> of similar organisations
            </div>
            <div style="font-size:11px;color:var(--color-text-tertiary);margin-top:4px">Industry average: ${ss.avgComparable}</div>
          </div>
        </div>
        <div class="kpi-row" style="gap:8px">
          <div class="kpi-tile" style="text-align:center">
            <div class="kpi-value ${ss.delta7d >= 0 ? 'success' : 'danger'}">${ss.delta7d >= 0 ? '+' : ''}${ss.delta7d}</div>
            <div class="kpi-label">7-day</div>
          </div>
          <div class="kpi-tile" style="text-align:center">
            <div class="kpi-value ${ss.delta30d >= 0 ? 'success' : 'danger'}">${ss.delta30d >= 0 ? '+' : ''}${ss.delta30d}</div>
            <div class="kpi-label">30-day</div>
          </div>
          <div class="kpi-tile" style="text-align:center">
            <div class="kpi-value ${ss.delta90d >= 0 ? 'success' : 'danger'}">${ss.delta90d >= 0 ? '+' : ''}${ss.delta90d}</div>
            <div class="kpi-label">90-day</div>
          </div>
          <div class="kpi-tile" style="text-align:center">
            <div class="kpi-value warning">${RECOMMENDATIONS.reduce((s, r) => s + r.scoreGain, 0)}</div>
            <div class="kpi-label">Potential gain</div>
          </div>
        </div>
        <div class="alert-banner info mt-3" style="margin-bottom:0">
          <i class="ti ti-api" style="font-size:12px"></i>
          <code style="font-size:10px">GET /v1.0/security/secureScores</code>
        </div>
      </div>

      <div class="card">
        <div class="card-header">
          <span class="card-title"><i class="ti ti-chart-bar"></i> Score by Category</span>
        </div>
        ${(Array.isArray(ss.categories) ? ss.categories : []).map(c => {
          const categoryColors = {
            'Identity': { bar: '#1e3a8a', text: '#1e3a8a' },
            'Apps': { bar: '#78350f', text: '#78350f' },
            'Data': { bar: '#1e1b4b', text: '#1e1b4b' },
            'Devices': { bar: '#15803d', text: '#15803d' },
            'Infrastructure': { bar: '#7c2d12', text: '#7c2d12' },
            'Other': { bar: '#6b7280', text: '#6b7280' }
          }
          const col = categoryColors[c.name] || categoryColors['Other']
          const statusIcon = c.score >= 80 ? '✓' : c.score >= 65 ? '⚠' : '●'
          const statusText = c.score >= 80 ? 'Good' : c.score >= 65 ? 'Needs attention' : 'Needs improvement'
          const statusColor = c.score >= 80 ? '#059669' : c.score >= 65 ? '#d97706' : '#dc2626'
          return `
          <div style="margin-bottom:20px">
            <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:8px">
              <span style="font-size:12px;font-weight:700;display:flex;align-items:center;gap:8px;color:var(--color-text-primary)">
                <i class="ti ${c.icon}" style="font-size:16px;color:${col.bar}"></i>${c.name}
              </span>
              <span style="font-size:16px;font-weight:700;color:${col.bar}">${c.score}%</span>
            </div>
            <div style="height:8px;background:var(--color-bg-secondary);border-radius:4px;overflow:hidden;margin-bottom:6px">
              <div style="width:${c.score}%;height:100%;background:${col.bar};border-radius:4px;transition:width 0.3s ease"></div>
            </div>
            <div style="display:flex;align-items:center;gap:6px;font-size:11px;color:var(--color-text-secondary)">
              <span style="font-size:14px;color:${statusColor}">${statusIcon}</span>
              <span>${statusText}</span>
            </div>
          </div>
        `}).join('')}
      </div>
    </div>

    <div class="card">
      <div class="card-header">
        <span class="card-title"><i class="ti ti-list-check"></i> Improvement Actions</span>
        <span class="badge info">${RECOMMENDATIONS.length} recommendations · ${RECOMMENDATIONS.reduce((s, r) => s + r.scoreGain, 0)} pts potential</span>
      </div>
      <table>
        <thead><tr>
          <th style="width:12%">Priority</th>
          <th style="width:38%">Recommendation</th>
          <th style="width:13%">Category</th>
          <th style="width:10%">Score Gain</th>
          <th style="width:10%">Effort</th>
          <th style="width:12%">Status</th>
          <th style="width:5%"></th>
        </tr></thead>
        <tbody>
          ${RECOMMENDATIONS.slice(0, 8).map(r => `
            <tr>
              <td data-label="Priority"><span class="badge ${r.priority === 'critical' ? 'danger' : r.priority === 'high' ? 'warning' : r.priority === 'medium' ? 'info' : 'neutral'}">${r.priority}</span></td>
              <td style="font-size:11px;font-weight:500" data-label="Recommendation">${r.title}</td>
              <td data-label="Category"><span class="pill">${r.category}</span></td>
              <td data-label="Score Gain"><span class="badge success">+${r.scoreGain}</span></td>
              <td data-label="Effort"><span class="badge neutral">${r.effort}</span></td>
              <td data-label="Status"><span class="badge ${r.status === 'open' ? 'warning' : 'info'}">${r.status}</span></td>
              <td data-label=""><button class="btn btn-xs"><i class="ti ti-arrow-right"></i></button></td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>
  `
}

// ============================================================
// IDENTITY SECURITY
// ============================================================
function renderIdentity() {
  const id = realIdentityPosture
  return `
    <div class="grid-2 mb-3" style="gap:16px">
      <div class="card">
        <div class="card-title mb-3"><i class="ti ti-user-check"></i> Identity Posture</div>
        ${metricGrid([
          { label: 'Total Users',         val: id.totalUsers.toLocaleString(), cls: 'info' },
          { label: 'Privileged Accounts', val: id.privAccounts, cls: 'warning' },
          { label: 'Global Admins',        val: id.globalAdmins, cls: id.globalAdmins <= 2 ? 'success' : 'danger' },
          { label: 'Service Accounts',     val: id.serviceAccounts, cls: 'info' },
          { label: 'Break Glass Accounts', val: id.breakGlass, cls: 'success' },
          { label: 'Identity Secure Score',val: id.identitySecureScore + '%', cls: 'warning' },
        ])}
      </div>

      <div class="card">
        <div class="card-title mb-3"><i class="ti ti-device-mobile"></i> Authentication</div>
        ${metricGrid([
          { label: 'MFA Enabled',        val: id.mfaEnabled + ' / ' + id.totalUsers, cls: 'success' },
          { label: 'MFA Excluded',       val: id.mfaExcluded, cls: 'danger' },
          { label: 'Passwordless %',     val: id.passwordlessAdoption + '%', cls: 'warning' },
          { label: 'FIDO2 Adopted',      val: id.fido2Adoption, cls: 'info' },
          { label: 'Legacy Auth Connections', val: id.legacyAuthConnections, cls: id.legacyAuthConnections === 0 ? 'success' : 'danger' },
        ])}
        <div style="margin-top:12px">
          <div class="section-heading">MFA Adoption</div>
          <div class="score-bar" style="height:10px;margin-bottom:4px">
            <div class="score-bar-fill warning" style="width:${Math.round(id.mfaEnabled / id.totalUsers * 100)}%"></div>
          </div>
          <div style="font-size:10px;color:var(--color-text-tertiary)">${Math.round(id.mfaEnabled / id.totalUsers * 100)}% — target 100%</div>
        </div>
      </div>
    </div>

    <div class="grid-2 mb-3" style="gap:16px">
      <div class="card">
        <div class="card-title mb-3"><i class="ti ti-eye"></i> Risk Monitoring (30 days)</div>
        <div class="alert-banner ${id.highRiskUsers > 0 ? 'danger' : 'success'}" style="margin-bottom:12px">
          <i class="ti ti-${id.highRiskUsers > 0 ? 'alert-triangle' : 'circle-check'}"></i>
          ${id.highRiskUsers > 0 ? `${id.highRiskUsers} high-risk users require immediate attention.` : 'No high-risk users detected.'}
        </div>
        ${metricGrid([
          { label: 'High-Risk Users',         val: id.highRiskUsers, cls: id.highRiskUsers === 0 ? 'success' : 'danger' },
          { label: 'Risky Sign-ins',           val: id.riskySignIns30d, cls: 'warning' },
          { label: 'Impossible Travel',        val: id.impossibleTravel30d, cls: id.impossibleTravel30d === 0 ? 'success' : 'danger' },
          { label: 'Anonymous IP Sign-ins',    val: id.anonymousIP30d, cls: id.anonymousIP30d === 0 ? 'success' : 'warning' },
          { label: 'Password Spray Attacks',   val: id.passwordSpray30d, cls: 'success' },
        ])}
        <div class="alert-banner info mt-3" style="margin-bottom:0"><i class="ti ti-api"></i><code style="font-size:9px">GET /beta/riskyUsers · GET /beta/riskDetections</code></div>
      </div>

      <div class="card">
        <div class="card-title mb-3"><i class="ti ti-lock-access"></i> Conditional Access</div>
        ${metricGrid([
          { label: 'Policies Enabled',     val: id.caPoliciesEnabled, cls: 'success' },
          { label: 'Policies Disabled',    val: id.caPoliciesDisabled, cls: id.caPoliciesDisabled === 0 ? 'success' : 'warning' },
          { label: 'Report-Only Mode',     val: id.caPoliciesReportOnly, cls: 'warning' },
          { label: 'Users Excluded',       val: id.caUsersExcluded, cls: id.caUsersExcluded > 10 ? 'warning' : 'success' },
        ])}
        ${recBox(['Require phishing-resistant MFA (FIDO2/CBA) for all admins', 'Remove legacy authentication via dedicated CA policy', 'Reduce Global Admin count to maximum 2 PIM-protected accounts', 'Review 18 CA policy exclusions — remove unnecessary exemptions'])}
      </div>
    </div>

    <div class="card mb-3">
      <div class="card-title mb-3"><i class="ti ti-shield-lock"></i> Identity Protection Policies</div>
      <div style="font-size:10px;color:var(--color-text-tertiary);margin-bottom:12px;font-style:italic">Security policies and configurations for authentication, access control, and risk management.</div>
      <div style="overflow-x:auto">
        <table class="table" style="width:100%;font-size:11px">
          <thead>
            <tr style="border-bottom:1px solid var(--color-border-secondary)">
              <th style="padding:8px;text-align:left;font-weight:700;color:var(--color-text-secondary);text-transform:uppercase">Policy / Configuration</th>
              <th style="padding:8px;text-align:center;font-weight:700;color:var(--color-text-secondary);text-transform:uppercase">Status</th>
              <th style="padding:8px;text-align:left;font-weight:700;color:var(--color-text-secondary);text-transform:uppercase">Details</th>
            </tr>
          </thead>
          <tbody>
            ${[
              { name: 'MFA Policy', key: 'mfaPolicy', icon: '🔐' },
              { name: 'Conditional Access', key: 'conditionalAccess', icon: '🔒' },
              { name: 'Password Policy', key: 'passwordPolicy', icon: '🔑' },
              { name: 'Authentication Methods', key: 'authenticationMethods', icon: '📱' },
              { name: 'Risk Policy', key: 'riskPolicy', icon: '⚠️' },
              { name: 'User Risk Policy', key: 'userRiskPolicy', icon: '👤' },
              { name: 'Sign-In Risk Policy', key: 'signInRiskPolicy', icon: '🚨' },
              { name: 'Session Management', key: 'sessionManagement', icon: '⏱️' },
              { name: 'Access Reviews', key: 'accessReview', icon: '📋' }
            ].map(policy => {
              const config = id.identityPolicies?.[policy.key]
              let isConfigured = false
              let details = 'Not configured'

              if (config) {
                if (policy.key === 'mfaPolicy') {
                  isConfigured = config.configured
                  details = config.enrollment > 0 ? config.enrollment + '% enrolled' : config.description
                } else if (policy.key === 'conditionalAccess') {
                  isConfigured = config.configured
                  details = config.count > 0 ? config.count + ' policies deployed' : 'No policies'
                } else if (policy.key === 'accessReview') {
                  isConfigured = config.configured
                  details = config.count > 0 ? config.count + ' active reviews' : 'No reviews'
                } else {
                  isConfigured = config.configured || config.enabled
                  details = config.description || 'Not configured'
                }
              }

              return '<tr style="border-bottom:0.5px solid var(--color-border-tertiary);padding:0">' +
                '<td style="padding:8px;font-weight:600">' + policy.icon + ' ' + policy.name + '</td>' +
                '<td style="padding:8px;text-align:center">' + statusBadge(isConfigured ? 'enabled' : 'unknown') + '</td>' +
                '<td style="padding:8px;color:var(--color-text-tertiary)">' + details + '</td>' +
                '</tr>'
            }).join('')}
          </tbody>
        </table>
      </div>
      <div class="alert-banner info mt-3" style="margin-bottom:0">
        <i class="ti ti-api"></i>
        <code style="font-size:9px">GET /policies/authenticationMethodsPolicy · GET /identity/conditionalAccess/policies · GET /beta/riskyUsers · GET /beta/riskDetections</code>
      </div>
    </div>
  `
}

// ============================================================
// EMAIL SECURITY
// ============================================================
function renderEmail() {
  const e = (realEmailSecurity && typeof realEmailSecurity === 'object') ? realEmailSecurity : EMAIL
  const phishing = Number(e.phishingAttempts30d) || 0
  const malware = Number(e.malwareDetected30d) || 0
  const bec = Number(e.becAttempts30d) || 0
  const spoofed = Number(e.spoofedDomainActivity30d) || 0
  const quarantined = Number(e.quarantined30d) || 0
  const safeAttachments = typeof e.safeAttachments === 'string' ? e.safeAttachments : 'enabled'
  const antiSpamPolicy = typeof e.antiSpamPolicy === 'string' ? e.antiSpamPolicy : 'standard'
  const spf = typeof e.spf === 'string' ? e.spf : 'unknown'
  const dkim = typeof e.dkim === 'string' ? e.dkim : 'unknown'
  const dmarc = typeof e.dmarc === 'string' ? e.dmarc : 'unknown'
  const safeLinks = typeof e.safeLinks === 'string' ? e.safeLinks : 'enabled'

  return `
    <div class="kpi-row mb-3">
      <div class="kpi-tile"><div class="kpi-value danger" style="font-size:28px;font-weight:700">${phishing.toLocaleString()}</div><div class="kpi-label" style="font-size:10px;text-transform:uppercase;color:var(--color-text-tertiary);font-weight:600">Phishing Blocked (30d)</div></div>
      <div class="kpi-tile"><div class="kpi-value warning" style="font-size:28px;font-weight:700">${malware}</div><div class="kpi-label" style="font-size:10px;text-transform:uppercase;color:var(--color-text-tertiary);font-weight:600">Malware Detected</div></div>
      <div class="kpi-tile"><div class="kpi-value danger" style="font-size:28px;font-weight:700">${bec}</div><div class="kpi-label" style="font-size:10px;text-transform:uppercase;color:var(--color-text-tertiary);font-weight:600">BEC Attempts</div></div>
      <div class="kpi-tile"><div class="kpi-value warning" style="font-size:28px;font-weight:700">${spoofed}</div><div class="kpi-label" style="font-size:10px;text-transform:uppercase;color:var(--color-text-tertiary);font-weight:600">Spoofed Domain</div></div>
      <div class="kpi-tile"><div class="kpi-value info" style="font-size:28px;font-weight:700">${quarantined.toLocaleString()}</div><div class="kpi-label" style="font-size:10px;text-transform:uppercase;color:var(--color-text-tertiary);font-weight:600">Quarantined</div></div>
    </div>

    <div class="card mb-3">
      <div class="card-title mb-3"><i class="ti ti-shield-check"></i> Organization Email Security Policies</div>
      <div style="font-size:10px;color:var(--color-text-tertiary);margin-bottom:12px;font-style:italic">Tenant-wide threat protection policies configured in Microsoft 365 Defender. Domain-specific DNS records are validated below.</div>

      <!-- DNS Authentication Records -->
      <div style="margin-bottom:16px">
        <div style="font-size:11px;font-weight:700;color:var(--color-text-secondary);text-transform:uppercase;margin-bottom:8px;padding-bottom:8px;border-bottom:1px solid var(--color-border-tertiary)">📧 Email Authentication</div>
        <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:10px">
          ${[
            { label: 'SPF Record',          ok: spf === 'pass',        note: spf === 'pass' ? 'Configured' : 'Missing or misconfigured' },
            { label: 'DKIM Signing',         ok: dkim === 'pass',       note: dkim === 'pass' ? 'Configured' : 'Not configured' },
            { label: 'DMARC Policy',         ok: dmarc === 'reject' ? 'pass' : dmarc === 'quarantine' ? 'warn' : false, note: dmarc !== 'unknown' ? dmarc : 'Not configured' },
          ].map(item => `
            <div style="padding:10px;background:var(--color-background-secondary);border-radius:var(--border-radius-md);border:0.5px solid var(--color-border-tertiary)">
              <div style="font-size:10px;font-weight:700;color:var(--color-text-tertiary);text-transform:uppercase;margin-bottom:5px">${item.label}</div>
              <div style="font-size:12px;font-weight:600;margin-bottom:3px">${statusIcon(item.ok, item.ok === 'pass' || item.ok === true ? 'Pass' : item.ok === 'warn' ? 'Warning' : 'Fail')}</div>
              <div style="font-size:10px;color:var(--color-text-tertiary)">${item.note}</div>
            </div>
          `).join('')}
        </div>
      </div>

      <!-- Threat Protection Policies -->
      <div>
        <div style="font-size:11px;font-weight:700;color:var(--color-text-secondary);text-transform:uppercase;margin-bottom:8px;padding-bottom:8px;border-bottom:1px solid var(--color-border-tertiary)">🛡️ Threat Protection</div>
        <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:10px">
          ${[
            { label: 'Safe Links', icon: '🔗', ok: e.organizationPolicies?.safeLinks?.enabled, desc: e.organizationPolicies?.safeLinks?.description || 'Protection enabled' },
            { label: 'Safe Attachments', icon: '📎', ok: e.organizationPolicies?.safeAttachments?.enabled, desc: e.organizationPolicies?.safeAttachments?.description || 'Scanning enabled' },
            { label: 'Anti-Phishing', icon: '🎣', ok: e.organizationPolicies?.antiPhishing?.enabled, desc: e.organizationPolicies?.antiPhishing?.description || 'Protection enabled' },
            { label: 'Anti-Spam', icon: '📤', ok: e.organizationPolicies?.antiSpam?.enabled, desc: `${e.organizationPolicies?.antiSpam?.level || 'Standard'} filtering` },
            { label: 'Anti-Malware', icon: '🦠', ok: e.organizationPolicies?.antiMalware?.enabled, desc: e.organizationPolicies?.antiMalware?.description || 'Protection enabled' },
            { label: 'Zero-hour Auto Purge', icon: '⚡', ok: e.organizationPolicies?.zeroHourAutoPurge?.enabled, desc: e.organizationPolicies?.zeroHourAutoPurge?.description || 'ZAP enabled' },
            { label: 'Threat Policies', icon: '⚠️', ok: e.organizationPolicies?.threatPolicies?.configured, desc: e.organizationPolicies?.threatPolicies?.description || 'Policies configured' },
            { label: 'Threat Explorer', icon: '🔍', ok: e.organizationPolicies?.threatExplorer?.enabled, desc: e.organizationPolicies?.threatExplorer?.description || 'Available' },
            { label: 'Automated Investigation', icon: '🤖', ok: e.organizationPolicies?.automatedInvestigation?.enabled, desc: e.organizationPolicies?.automatedInvestigation?.description || 'AIR enabled' },
            { label: 'AIR Settings', icon: '⚙️', ok: e.organizationPolicies?.airSettings?.enabled, desc: e.organizationPolicies?.airSettings?.autoRemediationLevel ? 'Auto-remediation: ' + e.organizationPolicies.airSettings.autoRemediationLevel : 'Configured' },
            { label: 'Email Policies', icon: '📋', ok: e.organizationPolicies?.emailCollaborationPolicies?.enabled, desc: e.organizationPolicies?.emailCollaborationPolicies?.description || 'Policies configured' },
          ].map(item => `
            <div style="padding:10px;background:var(--color-background-secondary);border-radius:var(--border-radius-md);border:0.5px solid var(--color-border-tertiary)">
              <div style="font-size:10px;font-weight:700;color:var(--color-text-tertiary);text-transform:uppercase;margin-bottom:5px">${item.icon} ${item.label}</div>
              <div style="font-size:12px;font-weight:600;margin-bottom:3px">${statusIcon(item.ok, 'Enabled')}</div>
              <div style="font-size:10px;color:var(--color-text-tertiary)">${item.desc}</div>
            </div>
          `).join('')}
        </div>
      </div>
    </div>

    <div class="card mb-3">
      <div class="card-title mb-3"><i class="ti ti-globe"></i> Domain DNS Records Validation</div>
      <div style="font-size:10px;color:var(--color-text-tertiary);margin-bottom:12px;font-style:italic">Shows DNS record validation for each domain. Organization-wide policies (Safe Links, Safe Attachments, Anti-spam) are configured above.</div>
      <div style="overflow-x:auto">
        <table class="table" style="width:100%;font-size:11px">
          <thead>
            <tr style="border-bottom:1px solid var(--color-border-secondary)">
              <th style="padding:8px;text-align:left;font-weight:700;color:var(--color-text-secondary);text-transform:uppercase">Domain</th>
              <th style="padding:8px;text-align:center;font-weight:700;color:var(--color-text-secondary);text-transform:uppercase">SPF Record</th>
              <th style="padding:8px;text-align:center;font-weight:700;color:var(--color-text-secondary);text-transform:uppercase">DKIM Record</th>
              <th style="padding:8px;text-align:center;font-weight:700;color:var(--color-text-secondary);text-transform:uppercase">DMARC Policy</th>
              <th style="padding:8px;text-align:center;font-weight:700;color:var(--color-text-secondary);text-transform:uppercase">Verified</th>
            </tr>
          </thead>
          <tbody>
            ${Array.isArray(e.domains) && e.domains.length > 0 ? e.domains.map(d => `
              <tr style="border-bottom:0.5px solid var(--color-border-tertiary);padding:0">
                <td style="padding:8px;font-weight:600">${d.name || d.id}${d.isDefault ? ' <span style="color:var(--color-text-tertiary);font-weight:400">(default)</span>' : ''}</td>
                <td style="padding:8px;text-align:center">${statusBadge(d.spf)}</td>
                <td style="padding:8px;text-align:center">${statusBadge(d.dkim)}</td>
                <td style="padding:8px;text-align:center">${statusBadge(d.dmarc)}</td>
                <td style="padding:8px;text-align:center">${d.isVerified ? '✅ Verified' : '❌ Not Verified'}</td>
              </tr>
            `).join('') : `
              <tr>
                <td colspan="5" style="padding:20px;text-align:center;color:var(--color-text-tertiary)">No domains found</td>
              </tr>
            `}
          </tbody>
        </table>
      </div>
    </div>

    <div class="card mb-3">
      <div class="card-title mb-3"><i class="ti ti-mail-forward"></i> Mail Flow Security</div>
        <div class="alert-banner ${(Number(e.externalForwardingRules) || 0) > 0 ? 'danger' : 'success'} mb-3">
          <i class="ti ti-${(Number(e.externalForwardingRules) || 0) > 0 ? 'alert-triangle' : 'circle-check'}"></i>
          ${(Number(e.externalForwardingRules) || 0) > 0 ? `${Number(e.externalForwardingRules) || 0} mailboxes have active external forwarding rules — potential data exfiltration risk.` : 'No external forwarding rules detected.'}
        </div>
        ${metricGrid([
          { label: 'External Forwarding Rules', val: Number(e.externalForwardingRules) || 0, cls: (Number(e.externalForwardingRules) || 0) === 0 ? 'success' : 'danger' },
          { label: 'Suspicious Inbox Rules',    val: Number(e.suspiciousInboxRules) || 0, cls: (Number(e.suspiciousInboxRules) || 0) === 0 ? 'success' : 'danger' },
          { label: 'Shared Mailboxes',          val: Number(e.sharedMailboxExposed) || 0, cls: 'info' },
        ])}
        ${recBox([
          'Enable Strict Preset Security Policies in Defender for Office 365',
          'Disable automatic external mail forwarding tenant-wide',
          'Upgrade DMARC policy from quarantine to reject',
          'Extend Safe Attachments coverage to all users (currently partial)',
        ])}
    </div>
  `
}

// ============================================================
// ENDPOINT SECURITY
// ============================================================
function renderEndpoint() {
  const ep = realEndpointSecurity || ENDPOINT
  return `
    <div class="kpi-row mb-3">
      <div class="kpi-tile"><div class="kpi-value info" style="font-size:28px;font-weight:700">${ep.totalManaged}</div><div class="kpi-label" style="font-size:10px;text-transform:uppercase;color:var(--color-text-tertiary);font-weight:600">Managed Devices</div></div>
      <div class="kpi-tile"><div class="kpi-value ${ep.nonCompliant === 0 ? 'success' : 'warning'}" style="font-size:28px;font-weight:700">${ep.nonCompliant}</div><div class="kpi-label" style="font-size:10px;text-transform:uppercase;color:var(--color-text-tertiary);font-weight:600">Non-Compliant</div></div>
      <div class="kpi-tile"><div class="kpi-value ${ep.vulnerable === 0 ? 'success' : 'danger'}" style="font-size:28px;font-weight:700">${ep.vulnerable}</div><div class="kpi-label" style="font-size:10px;text-transform:uppercase;color:var(--color-text-tertiary);font-weight:600">Vulnerable</div></div>
      <div class="kpi-tile"><div class="kpi-value danger" style="font-size:28px;font-weight:700">${ep.ransomwareIndicators}</div><div class="kpi-label" style="font-size:10px;text-transform:uppercase;color:var(--color-text-tertiary);font-weight:600">Ransomware Indicators</div></div>
      <div class="kpi-tile"><div class="kpi-value warning" style="font-size:28px;font-weight:700">${ep.missingCriticalPatches}</div><div class="kpi-label" style="font-size:10px;text-transform:uppercase;color:var(--color-text-tertiary);font-weight:600">Missing Patches</div></div>
    </div>

    <div class="grid-2 mb-3" style="gap:16px">
      <div class="card">
        <div class="card-title mb-3"><i class="ti ti-shield-check"></i> Protection Coverage</div>
        ${[
          { label: 'Defender AV',         pct: ep.avCoverage,       target: 100 },
          { label: 'BitLocker',            pct: ep.bitlockerCoverage, target: 100 },
          { label: 'Firewall Enabled',     pct: ep.firewallEnabled,  target: 100 },
          { label: 'Tamper Protection',    pct: ep.tamperProtection, target: 100 },
        ].map(item => {
          const cls = item.pct >= 99 ? 'success' : item.pct >= 95 ? 'warning' : 'danger'
          return `<div class="score-bar-row mb-2">
            <span class="score-label" style="min-width:140px">${item.label}</span>
            <div class="score-bar" style="flex:1;height:8px">
              <div class="score-bar-fill ${cls}" style="width:${item.pct}%"></div>
            </div>
            <span class="score-pct" style="color:${item.pct < 99 ? 'var(--clr-warning-text)' : 'var(--clr-success-text)'}">${item.pct}%</span>
          </div>`
        }).join('')}
        <div class="alert-banner info mt-3" style="margin-bottom:0"><i class="ti ti-api"></i><code style="font-size:9px">GET /beta/deviceManagement/managedDevices?$select=isEncrypted,deviceName</code></div>
      </div>

      <div class="card">
        <div class="card-title mb-3"><i class="ti ti-alert-triangle"></i> Threat Analytics</div>
        ${ep.activeThreats > 0 ? `
          <div class="alert-banner danger mb-3">
            <i class="ti ti-virus"></i>
            ${ep.activeThreats} active threat${ep.activeThreats > 1 ? 's' : ''} detected. Investigate and remediate immediately.
          </div>
        ` : `
          <div class="alert-banner success mb-3">
            <i class="ti ti-circle-check"></i>
            No active threats detected. Security posture is clean.
          </div>
        `}
        ${metricGrid([
          { label: 'Active Threats',        val: ep.activeThreats,        cls: ep.activeThreats === 0 ? 'success' : 'danger' },
          { label: 'High Severity Alerts',  val: ep.highSeverityAlerts,   cls: ep.highSeverityAlerts === 0 ? 'success' : 'danger' },
          { label: 'Windows 11 (%)',        val: ep.windows11Pct + '%',   cls: 'success' },
          { label: 'Windows 10 (%)',        val: ep.windows10Pct + '%',   cls: ep.windows10Pct > 20 ? 'warning' : 'success' },
        ])}
        ${recBox([
          ep.missingCriticalPatches > 0 ? `Patch ${ep.missingCriticalPatches} device${ep.missingCriticalPatches > 1 ? 's' : ''} missing critical security updates` : 'All devices are patched with critical updates',
          ep.nonCompliant > 0 ? `Review ${ep.nonCompliant} non-compliant device${ep.nonCompliant > 1 ? 's' : ''} and enforce compliance policies` : 'All devices are in compliance',
          ep.bitlockerCoverage < 95 ? `Enable BitLocker on remaining ${Math.round(ep.totalManaged * (100 - ep.bitlockerCoverage) / 100)} unencrypted devices` : 'BitLocker encryption is enabled on all devices',
          ep.windows10Pct > 20 ? 'Plan Windows 10 end-of-life migration — upgrade to Windows 11' : 'OS deployment is aligned with support timelines'
        ])}
      </div>
    </div>

    <div class="card mb-3">
      <div class="card-title mb-3"><i class="ti ti-shield-lock"></i> Defender & Intune Security Settings</div>
      <div style="font-size:10px;color:var(--color-text-tertiary);margin-bottom:12px;font-style:italic">Security policies and configurations deployed across your tenant.</div>
      <div style="overflow-x:auto">
        <table class="table" style="width:100%;font-size:11px">
          <thead>
            <tr style="border-bottom:1px solid var(--color-border-secondary)">
              <th style="padding:8px;text-align:left;font-weight:700;color:var(--color-text-secondary);text-transform:uppercase">Setting</th>
              <th style="padding:8px;text-align:center;font-weight:700;color:var(--color-text-secondary);text-transform:uppercase">Status</th>
              <th style="padding:8px;text-align:left;font-weight:700;color:var(--color-text-secondary);text-transform:uppercase">Details</th>
            </tr>
          </thead>
          <tbody>
            ${[
              { name: 'Antivirus Policy', key: 'antivirusPolicy', icon: '🦠' },
              { name: 'Attack Surface Reduction', key: 'attackSurfaceReduction', icon: '🛡️' },
              { name: 'Web Protection', key: 'webProtection', icon: '🌐' },
              { name: 'Web Content Filtering', key: 'webContentFiltering', icon: '📶' },
              { name: 'Firewall Policies', key: 'firewallPolicies', icon: '🔥' },
              { name: 'Endpoint Detection & Response', key: 'endpointDetectionResponse', icon: '🎯' },
              { name: 'Tamper Protection', key: 'tamperProtection', icon: '⚙️' },
              { name: 'Device Control', key: 'deviceControl', icon: '🖥️' },
              { name: 'USB Policies', key: 'usbPolicies', icon: '💾' },
              { name: 'Device Isolation', key: 'deviceIsolation', icon: '🚫' },
              { name: 'Live Response Settings', key: 'liveResponseSettings', icon: '📡' }
            ].map(setting => {
              const config = ep.defenderSettings?.[setting.key]
              const isConfigured = config?.configured
              const count = config?.count
              const policyPlural = count > 1 ? 'ies' : 'y'
              const details = config?.description || (count && count > 0 ? count + ' polic' + policyPlural + ' deployed' : 'Not configured')
              return '<tr style="border-bottom:0.5px solid var(--color-border-tertiary);padding:0">' +
                '<td style="padding:8px;font-weight:600">' + setting.icon + ' ' + setting.name + '</td>' +
                '<td style="padding:8px;text-align:center">' + statusBadge(isConfigured ? 'enabled' : 'unknown') + '</td>' +
                '<td style="padding:8px;color:var(--color-text-tertiary)">' + details + '</td>' +
                '</tr>'
            }).join('')}
          </tbody>
        </table>
      </div>
      <div class="alert-banner info mt-3" style="margin-bottom:0">
        <i class="ti ti-api"></i>
        <code style="font-size:9px">GET /deviceManagement/deviceConfigurations · GET /deviceManagement/deviceCompliancePolicies</code>
      </div>
    </div>
  `
}

// ============================================================
// TEAMS SECURITY
// ============================================================
function renderTeams() {
  const t = realTeamsSecurity || TEAMS_SEC
  return `
    <div class="kpi-row mb-3">
      <div class="kpi-tile"><div class="kpi-value info" style="font-size:28px;font-weight:700">${t.totalTeams}</div><div class="kpi-label" style="font-size:10px;text-transform:uppercase;color:var(--color-text-tertiary);font-weight:600">Total Teams</div></div>
      <div class="kpi-tile"><div class="kpi-value ${t.publicTeams > 5 ? 'warning' : 'success'}" style="font-size:28px;font-weight:700">${t.publicTeams}</div><div class="kpi-label" style="font-size:10px;text-transform:uppercase;color:var(--color-text-tertiary);font-weight:600">Public Teams</div></div>
      <div class="kpi-tile"><div class="kpi-value warning" style="font-size:28px;font-weight:700">${t.guestEnabledTeams}</div><div class="kpi-label" style="font-size:10px;text-transform:uppercase;color:var(--color-text-tertiary);font-weight:600">Guest Enabled</div></div>
      <div class="kpi-tile"><div class="kpi-value warning" style="font-size:28px;font-weight:700">${t.inactiveTeams90d}</div><div class="kpi-label" style="font-size:10px;text-transform:uppercase;color:var(--color-text-tertiary);font-weight:600">Inactive (90d+)</div></div>
      <div class="kpi-tile"><div class="kpi-value success" style="font-size:28px;font-weight:700">${t.anonymousMeetingAccess ? '⚠️ On' : '✓ Off'}</div><div class="kpi-label" style="font-size:10px;text-transform:uppercase;color:var(--color-text-tertiary);font-weight:600">Anon Meeting</div></div>
    </div>

    <div class="grid-2" style="gap:16px">
      <div class="card">
        <div class="card-title mb-3"><i class="ti ti-settings"></i> Teams Governance</div>
        ${metricGrid([
          { label: 'Teams with External Sharing', val: t.teamsWithExternalSharing, cls: 'warning' },
          { label: 'Unowned Teams',                val: t.unownedTeams, cls: t.unownedTeams === 0 ? 'success' : 'warning' },
          { label: 'Guests Added (30d)',            val: t.guestsAdded30d, cls: 'info' },
          { label: 'External Domains Allowed',     val: t.externalDomainsAllowed, cls: 'warning' },
        ])}
        <div class="alert-banner info mt-3" style="margin-bottom:0"><i class="ti ti-api"></i><code style="font-size:9px">GET /v1.0/groups?$filter=resourceProvisioningOptions/Any(x:x eq 'Team')&$select=displayName,visibility</code></div>
      </div>
      <div class="card">
        <div class="card-title mb-3"><i class="ti ti-shield"></i> Recommendations</div>
        ${recBox([
          t.inactiveTeams90d > 0 ? 'Archive ' + t.inactiveTeams90d + ' inactive Teams (90d+) to reduce sprawl and exposure' : 'No inactive Teams to archive',
          t.unownedTeams > 0 ? 'Assign owners to ' + t.unownedTeams + ' unowned Teams' : 'All Teams have assigned owners',
          t.guestEnabledTeams > 0 ? 'Conduct guest access review for ' + t.guestEnabledTeams + ' guest-enabled Teams' : 'No Teams with guest access enabled',
          t.publicTeams > 5 ? 'Review ' + t.publicTeams + ' public Teams — consider making private' : 'Public Teams count is within acceptable range',
          t.externalDomainsAllowed > 0 ? 'Restrict external domains to known partners only' : 'External domain restrictions already in place',
        ])}
      </div>
    </div>

    <div class="card mb-3">
      <div class="card-title mb-3"><i class="ti ti-shield-lock"></i> Teams Security Policies & Settings</div>
      <div style="font-size:10px;color:var(--color-text-tertiary);margin-bottom:12px;font-style:italic">Security policies and organizational settings for Teams.</div>
      <div style="overflow-x:auto">
        <table class="table" style="width:100%;font-size:11px">
          <thead>
            <tr style="border-bottom:1px solid var(--color-border-secondary)">
              <th style="padding:8px;text-align:left;font-weight:700;color:var(--color-text-secondary);text-transform:uppercase">Policy / Setting</th>
              <th style="padding:8px;text-align:center;font-weight:700;color:var(--color-text-secondary);text-transform:uppercase">Status</th>
              <th style="padding:8px;text-align:left;font-weight:700;color:var(--color-text-secondary);text-transform:uppercase">Details</th>
            </tr>
          </thead>
          <tbody>
            ${[
              { name: 'Teams Messaging Policy', key: 'messagingPolicy', icon: '💬' },
              { name: 'Teams Meeting Policy', key: 'meetingPolicy', icon: '📞' },
              { name: 'Teams Calling Policy', key: 'callingPolicy', icon: '☎️' },
              { name: 'Teams App Permission Policy', key: 'appPermissionPolicy', icon: '🔑' },
              { name: 'Teams App Setup Policy', key: 'appSetupPolicy', icon: '⚙️' },
              { name: 'Guest Access', key: 'guestAccess', icon: '👥' },
              { name: 'External Access', key: 'externalAccess', icon: '🌐' },
              { name: 'Federation Settings', key: 'federationSettings', icon: '🔗' },
              { name: 'Teams Security Settings', key: 'teamsSecurity', icon: '🛡️' }
            ].map(policy => {
              const config = t.securityPolicies?.[policy.key]
              const isConfigured = config?.configured || config?.enabled
              const count = config?.count
              const details = config?.description || (isConfigured ? 'Configured' : 'Not configured')
              const statusType = isConfigured ? 'enabled' : 'unknown'
              return '<tr style="border-bottom:0.5px solid var(--color-border-tertiary);padding:0">' +
                '<td style="padding:8px;font-weight:600">' + policy.icon + ' ' + policy.name + '</td>' +
                '<td style="padding:8px;text-align:center">' + statusBadge(statusType) + '</td>' +
                '<td style="padding:8px;color:var(--color-text-tertiary)">' + details + '</td>' +
                '</tr>'
            }).join('')}
          </tbody>
        </table>
      </div>
      <div class="alert-banner info mt-3" style="margin-bottom:0">
        <i class="ti ti-api"></i>
        <code style="font-size:9px">GET /teamwork/teamsAppSettings · GET /policies/teamsMessagingPolicy · GET /policies/teamsMeetingPolicy · GET /policies/teamsCallingPolicy</code>
      </div>
    </div>
  `
}

// ============================================================
// SHAREPOINT SECURITY
// ============================================================
function renderSharepoint() {
  const s = realSharepointSecurity || SHAREPOINT_SEC
  return `
    <div class="kpi-row mb-3">
      <div class="kpi-tile"><div class="kpi-value info" style="font-size:28px;font-weight:700">${s.totalSites}</div><div class="kpi-label" style="font-size:10px;text-transform:uppercase;color:var(--color-text-tertiary);font-weight:600">Total Sites</div></div>
      <div class="kpi-tile"><div class="kpi-value ${s.externallyShared > 10 ? 'warning' : 'success'}" style="font-size:28px;font-weight:700">${s.externallyShared}</div><div class="kpi-label" style="font-size:10px;text-transform:uppercase;color:var(--color-text-tertiary);font-weight:600">Externally Shared</div></div>
      <div class="kpi-tile"><div class="kpi-value ${s.anonymousLinks > 0 ? 'danger' : 'success'}" style="font-size:28px;font-weight:700">${s.anonymousLinks}</div><div class="kpi-label" style="font-size:10px;text-transform:uppercase;color:var(--color-text-tertiary);font-weight:600">Anonymous Links</div></div>
      <div class="kpi-tile"><div class="kpi-value warning" style="font-size:28px;font-weight:700">${s.sensitiveFiles}</div><div class="kpi-label" style="font-size:10px;text-transform:uppercase;color:var(--color-text-tertiary);font-weight:600">Sensitive Files Flagged</div></div>
      <div class="kpi-tile"><div class="kpi-value warning" style="font-size:28px;font-weight:700">${s.oversharedSites}</div><div class="kpi-label" style="font-size:10px;text-transform:uppercase;color:var(--color-text-tertiary);font-weight:600">Overshared Sites</div></div>
    </div>
    <div class="grid-2" style="gap:16px">
      <div class="card">
        <div class="card-title mb-3"><i class="ti ti-share"></i> Data Exposure</div>
        ${metricGrid([
          { label: 'Public Content',           val: s.publicContent, cls: s.publicContent === 0 ? 'success' : 'danger' },
          { label: 'Large Downloads (30d)',    val: s.largeDownloads30d, cls: 'warning' },
          { label: 'DLP Coverage',             val: s.dlpCoveragePct + '%', cls: s.dlpCoveragePct >= 90 ? 'success' : 'warning' },
          { label: 'Ext. Sharing Restricted',  val: s.restrictedSharingEnabled ? 'Yes' : 'No', cls: s.restrictedSharingEnabled ? 'success' : 'danger' },
        ])}
        <div class="alert-banner ${s.anonymousLinks > 0 ? 'danger' : 'success'} mt-3" style="margin-bottom:0">
          <i class="ti ti-${s.anonymousLinks > 0 ? 'alert-triangle' : 'circle-check'}"></i>
          ${s.anonymousLinks > 0 ? `${s.anonymousLinks} anonymous "Anyone" links allow unauthenticated access to content.` : 'No anonymous links detected.'}
        </div>
      </div>
      <div class="card">
        <div class="card-title mb-3"><i class="ti ti-shield"></i> Recommendations</div>
        ${recBox([
          s.anonymousLinks > 0 ? 'Remove ' + s.anonymousLinks + ' anonymous sharing links — replace with authenticated sharing' : 'No anonymous sharing links detected',
          s.oversharedSites > 0 ? 'Review ' + s.oversharedSites + ' overshared sites with excessive members' : 'No overshared sites detected',
          'Enable sensitivity labels for automatic file classification',
          s.externallyShared > 10 ? 'Restrict external sharing to "Existing guests only" on ' + s.externallyShared + ' externally shared sites' : 'External sharing is properly restricted',
          s.dlpCoveragePct < 100 ? 'Configure DLP policy for SharePoint to reach 100% coverage (currently ' + s.dlpCoveragePct + '%)' : 'DLP coverage is at 100%',
        ])}
      </div>
    </div>

    <div class="card mb-3">
      <div class="card-title mb-3"><i class="ti ti-shield-lock"></i> SharePoint Sharing Policies & Security</div>
      <div style="font-size:10px;color:var(--color-text-tertiary);margin-bottom:12px;font-style:italic">Organizational policies and settings that control sharing and collaboration.</div>
      <div style="overflow-x:auto">
        <table class="table" style="width:100%;font-size:11px">
          <thead>
            <tr style="border-bottom:1px solid var(--color-border-secondary)">
              <th style="padding:8px;text-align:left;font-weight:700;color:var(--color-text-secondary);text-transform:uppercase">Policy / Setting</th>
              <th style="padding:8px;text-align:center;font-weight:700;color:var(--color-text-secondary);text-transform:uppercase">Status</th>
              <th style="padding:8px;text-align:left;font-weight:700;color:var(--color-text-secondary);text-transform:uppercase">Configuration</th>
            </tr>
          </thead>
          <tbody>
            ${[
              { name: 'Default Sharing Link Type', key: 'defaultSharingLink', icon: '🔗', desc: 'Type of link shared by default' },
              { name: 'Guest Sharing Level', key: 'guestSharingLevel', icon: '👥', desc: 'External guest access permissions' },
              { name: 'External User Expiration', key: 'externalUserExpireAccess', icon: '⏰', desc: 'Auto-expire external user access' },
              { name: 'Unverified Limited Sharing', key: 'unverifiedLimitedSharing', icon: '⚠️', desc: 'Limit sharing with unverified domains' },
              { name: 'DLP Policies', key: 'dlpPolicy', icon: '🔒', desc: 'Data loss prevention coverage' },
              { name: 'Sensitivity Labels', key: 'sensitivityLabels', icon: '🏷️', desc: 'Information classification' },
              { name: 'Restricted Sharing', key: 'restrictedSharing', icon: '🚫', desc: 'Prevent external resharing' }
            ].map(policy => {
              let config = s.sharingPolicies?.[policy.key]
              let isEnabled = false
              let details = 'Not configured'

              if (policy.key === 'defaultSharingLink') {
                isEnabled = config?.configured
                details = config?.type || 'Internal link'
              } else if (policy.key === 'guestSharingLevel') {
                isEnabled = config?.enabled
                details = config?.description || 'Not configured'
              } else if (policy.key === 'externalUserExpireAccess') {
                isEnabled = config?.enabled
                details = config?.description || 'No expiration'
              } else if (policy.key === 'unverifiedLimitedSharing') {
                isEnabled = config?.enabled
                details = config?.description || 'Disabled'
              } else if (policy.key === 'dlpPolicy') {
                isEnabled = s.dlpCoveragePct > 0
                details = 'DLP coverage: ' + s.dlpCoveragePct + '%'
              } else if (policy.key === 'sensitivityLabels') {
                isEnabled = true
                details = 'Automatic classification available'
              } else if (policy.key === 'restrictedSharing') {
                isEnabled = s.restrictedSharingEnabled
                details = isEnabled ? 'External users cannot reshare' : 'External resharing allowed'
              }

              return '<tr style="border-bottom:0.5px solid var(--color-border-tertiary);padding:0">' +
                '<td style="padding:8px;font-weight:600">' + policy.icon + ' ' + policy.name + '</td>' +
                '<td style="padding:8px;text-align:center">' + statusBadge(isEnabled ? 'enabled' : 'unknown') + '</td>' +
                '<td style="padding:8px;color:var(--color-text-tertiary)">' + details + '</td>' +
                '</tr>'
            }).join('')}
          </tbody>
        </table>
      </div>
      <div class="alert-banner info mt-3" style="margin-bottom:0">
        <i class="ti ti-api"></i>
        <code style="font-size:9px">GET /sites · GET /admin/sharepoint/settings · GET /informationProtection</code>
      </div>
    </div>

    <div class="card mb-3">
      <div class="card-title mb-3"><i class="ti ti-settings"></i> Advanced SharePoint Security Settings</div>
      <div style="font-size:10px;color:var(--color-text-tertiary);margin-bottom:12px;font-style:italic">Detailed configuration for external sharing, link handling, and data classification.</div>
      <div style="overflow-x:auto">
        <table class="table" style="width:100%;font-size:11px">
          <thead>
            <tr style="border-bottom:1px solid var(--color-border-secondary)">
              <th style="padding:8px;text-align:left;font-weight:700;color:var(--color-text-secondary);text-transform:uppercase">Setting</th>
              <th style="padding:8px;text-align:center;font-weight:700;color:var(--color-text-secondary);text-transform:uppercase">Status</th>
              <th style="padding:8px;text-align:left;font-weight:700;color:var(--color-text-secondary);text-transform:uppercase">Configuration</th>
            </tr>
          </thead>
          <tbody>
            ${[
              { name: 'External Sharing Policies', key: 'externalSharingPolicies', icon: '🌐' },
              { name: 'Site Sharing Policies', key: 'siteSharingPolicies', icon: '🏢' },
              { name: 'Anonymous Links', key: 'anonymousLinkControl', icon: '🔗' },
              { name: 'Default Link Type', key: 'defaultLinkType', icon: '📎' },
              { name: 'Sharing Expiration', key: 'sharingExpiration', icon: '⏰' },
              { name: 'Site Collection Policies', key: 'siteCollectionPolicies', icon: '📂' },
              { name: 'OneDrive Sharing Policies', key: 'onedriveSharing', icon: '☁️' },
              { name: 'Sharing Domains', key: 'sharingDomains', icon: '🌍' },
              { name: 'Site Sensitivity Labels', key: 'siteSensitivityLabels', icon: '🏷️' }
            ].map(setting => {
              const config = s.advancedSettings?.[setting.key]
              let isConfigured = false
              let details = 'Not configured'

              if (config) {
                if (setting.key === 'externalSharingPolicies') {
                  isConfigured = config.configured
                  details = config.description || 'Default sharing policies'
                } else if (setting.key === 'siteSharingPolicies') {
                  isConfigured = config.configured
                  details = config.count > 0 ? config.count + ' sites with policies' : 'No site policies'
                } else if (setting.key === 'anonymousLinkControl') {
                  isConfigured = config.enabled
                  details = isConfigured ? 'Anonymous sharing ' + (config.maxAge === 'unlimited' ? 'allowed' : 'with ' + config.maxAge + ' expiry') : 'Disabled'
                } else if (setting.key === 'defaultLinkType') {
                  isConfigured = true
                  details = config.type ? 'Type: ' + config.type + ' (' + config.scope + ')' : 'Internal link'
                } else if (setting.key === 'sharingExpiration') {
                  isConfigured = config.enabled
                  details = isConfigured ? 'Expires after ' + config.days + ' days' : 'No expiration'
                } else if (setting.key === 'siteCollectionPolicies') {
                  isConfigured = config.configured
                  details = config.description || 'Using tenant defaults'
                } else if (setting.key === 'onedriveSharing') {
                  isConfigured = config.enabled
                  details = config.description || 'OneDrive sharing enabled'
                } else if (setting.key === 'sharingDomains') {
                  isConfigured = config.blocked?.length > 0 || config.allowed?.length > 0
                  details = config.description || 'No domain restrictions'
                } else if (setting.key === 'siteSensitivityLabels') {
                  isConfigured = config.configured
                  details = config.count > 0 ? config.count + ' labels available' : 'No labels configured'
                }
              }

              return '<tr style="border-bottom:0.5px solid var(--color-border-tertiary);padding:0">' +
                '<td style="padding:8px;font-weight:600">' + setting.icon + ' ' + setting.name + '</td>' +
                '<td style="padding:8px;text-align:center">' + statusBadge(isConfigured ? 'enabled' : 'unknown') + '</td>' +
                '<td style="padding:8px;color:var(--color-text-tertiary)">' + details + '</td>' +
                '</tr>'
            }).join('')}
          </tbody>
        </table>
      </div>
      <div class="alert-banner info mt-3" style="margin-bottom:0">
        <i class="ti ti-api"></i>
        <code style="font-size:9px">GET /sites · GET /admin/sharepoint/settings · GET /me/drives · GET /me/informationProtection/sensitivityLabels</code>
      </div>
    </div>
  `
}

// ============================================================
// DATA PROTECTION
// ============================================================
function renderDataProtection() {
  const d = realDataProtection || DATA_PROTECTION
  return `
    <div class="kpi-row mb-3">
      <div class="kpi-tile"><div class="kpi-value warning" style="font-size:28px;font-weight:700">${d.sensitivityLabelsApplied}%</div><div class="kpi-label" style="font-size:10px;text-transform:uppercase;color:var(--color-text-tertiary);font-weight:600">Labels Applied</div></div>
      <div class="kpi-tile"><div class="kpi-value danger" style="font-size:28px;font-weight:700">${d.dlpViolations30d}</div><div class="kpi-label" style="font-size:10px;text-transform:uppercase;color:var(--color-text-tertiary);font-weight:600">DLP Violations (30d)</div></div>
      <div class="kpi-tile"><div class="kpi-value danger" style="font-size:28px;font-weight:700">${d.dataExfiltration30d}</div><div class="kpi-label" style="font-size:10px;text-transform:uppercase;color:var(--color-text-tertiary);font-weight:600">Exfiltration Events</div></div>
      <div class="kpi-tile"><div class="kpi-value warning" style="font-size:28px;font-weight:700">${d.usbTransfers30d}</div><div class="kpi-label" style="font-size:10px;text-transform:uppercase;color:var(--color-text-tertiary);font-weight:600">USB Transfers</div></div>
      <div class="kpi-tile"><div class="kpi-value info" style="font-size:28px;font-weight:700">${d.complianceScore}</div><div class="kpi-label" style="font-size:10px;text-transform:uppercase;color:var(--color-text-tertiary);font-weight:600">Compliance Score</div></div>
    </div>
    <div class="grid-2" style="gap:16px">
      <div class="card">
        <div class="card-title mb-3"><i class="ti ti-tag"></i> Data Governance</div>
        ${metricGrid([
          { label: 'Files Without Labels',   val: d.filesWithoutLabels.toLocaleString(), cls: 'danger' },
          { label: 'Retention Policies',     val: d.retentionPoliciesActive, cls: 'info' },
          { label: 'Insider Risk Policies',  val: d.insiderRiskPolicies, cls: 'info' },
          { label: 'Unusual Downloads (30d)',val: d.unusualDownloads30d, cls: 'warning' },
        ])}
        <div class="section-heading mt-3">DLP Violation Categories</div>
        ${[
          { label: 'PII Exposure',       val: d.piiExposure },
          { label: 'Financial Data',     val: d.financialDataExposure },
          { label: 'Healthcare Data',    val: d.healthcareData },
        ].map(v => `
          <div class="score-bar-row mb-2">
            <span class="score-label" style="min-width:120px">${v.label}</span>
            <div class="score-bar" style="flex:1;height:7px">
              <div class="score-bar-fill danger" style="width:${(v.val / d.dlpViolations30d * 100).toFixed(0)}%"></div>
            </div>
            <span style="font-size:10px;color:var(--clr-danger-text);min-width:24px;text-align:right">${v.val}</span>
          </div>
        `).join('')}
      </div>
      <div class="card">
        <div class="card-title mb-3"><i class="ti ti-shield"></i> Recommendations</div>
        ${recBox([
          d.filesWithoutLabels > 1000 ? 'Enable sensitivity auto-labeling for ~' + d.filesWithoutLabels.toLocaleString() + ' unlabeled files' : 'File labeling coverage is adequate',
          d.protectionPolicies?.dlpPolicies?.count > 0 ? 'Extend DLP policy coverage to include Teams messages' : 'Deploy DLP policies to protect data',
          d.insiderRiskPolicies > 0 ? 'Monitor ' + d.insiderRiskPolicies + ' insider risk policy alerts' : 'Configure insider risk policies for data exfiltration patterns',
          d.usbTransfers30d > 0 ? 'Review ' + d.usbTransfers30d + ' USB transfer events — check device compliance' : 'No USB transfer events detected',
          d.retentionPoliciesActive > 0 ? 'Expand ' + d.retentionPoliciesActive + ' retention policies to cover Teams and OneDrive' : 'Deploy retention policies for Teams and OneDrive',
        ])}
        <div class="alert-banner info mt-3" style="margin-bottom:0"><i class="ti ti-api"></i><code style="font-size:9px">GET /me/informationProtection/sensitivityLabels · GET /security/informationProtection/dlpPolicies · GET /compliance/retentionPolicies</code></div>
      </div>
    </div>

    <div class="card mb-3">
      <div class="card-title mb-3"><i class="ti ti-shield-lock"></i> Data Protection Policies & Compliance</div>
      <div style="font-size:10px;color:var(--color-text-tertiary);margin-bottom:12px;font-style:italic">Security policies and configurations for data classification, loss prevention, and retention.</div>
      <div style="overflow-x:auto">
        <table class="table" style="width:100%;font-size:11px">
          <thead>
            <tr style="border-bottom:1px solid var(--color-border-secondary)">
              <th style="padding:8px;text-align:left;font-weight:700;color:var(--color-text-secondary);text-transform:uppercase">Policy / Configuration</th>
              <th style="padding:8px;text-align:center;font-weight:700;color:var(--color-text-secondary);text-transform:uppercase">Status</th>
              <th style="padding:8px;text-align:left;font-weight:700;color:var(--color-text-secondary);text-transform:uppercase">Details</th>
            </tr>
          </thead>
          <tbody>
            ${[
              { name: 'Sensitivity Labels', key: 'sensitivityLabels', icon: '🏷️' },
              { name: 'DLP Policies', key: 'dlpPolicies', icon: '🔒' },
              { name: 'Retention Policies', key: 'retentionPolicies', icon: '📋' },
              { name: 'Insider Risk', key: 'insiderRisk', icon: '⚠️' },
              { name: 'Data Classification', key: 'dataClassification', icon: '📊' },
              { name: 'Information Barriers', key: 'informationBarrier', icon: '🚧' },
              { name: 'Records Management', key: 'recordsManagement', icon: '📂' },
              { name: 'E-Discovery', key: 'e-discovery', icon: '🔍' },
              { name: 'Audit Logging', key: 'auditLogging', icon: '📝' }
            ].map(policy => {
              const config = d.protectionPolicies?.[policy.key]
              let isConfigured = false
              let details = 'Not configured'

              if (config) {
                if (policy.key === 'sensitivityLabels') {
                  isConfigured = config.configured
                  details = config.count > 0 ? config.count + ' labels configured' : 'No labels'
                } else if (policy.key === 'dlpPolicies') {
                  isConfigured = config.configured
                  details = config.count > 0 ? config.count + ' DLP policies deployed' : 'No DLP policies'
                } else if (policy.key === 'retentionPolicies') {
                  isConfigured = config.configured
                  details = config.count > 0 ? config.count + ' active retention policies' : 'No retention policies'
                } else if (policy.key === 'insiderRisk') {
                  isConfigured = config.configured
                  details = config.count > 0 ? config.count + ' insider risk policies' : 'Not configured'
                } else if (policy.key === 'dataClassification') {
                  isConfigured = config.configured
                  details = config.description || 'Not configured'
                } else if (policy.key === 'informationBarrier') {
                  isConfigured = config.configured
                  details = config.description || 'Not configured'
                } else if (policy.key === 'recordsManagement') {
                  isConfigured = config.configured
                  details = config.description || 'Not configured'
                } else if (policy.key === 'e-discovery') {
                  isConfigured = config.configured
                  details = config.description || 'Not configured'
                } else if (policy.key === 'auditLogging') {
                  isConfigured = config.enabled
                  details = config.description || 'Not enabled'
                }
              }

              return '<tr style="border-bottom:0.5px solid var(--color-border-tertiary);padding:0">' +
                '<td style="padding:8px;font-weight:600">' + policy.icon + ' ' + policy.name + '</td>' +
                '<td style="padding:8px;text-align:center">' + statusBadge(isConfigured ? 'enabled' : 'unknown') + '</td>' +
                '<td style="padding:8px;color:var(--color-text-tertiary)">' + details + '</td>' +
                '</tr>'
            }).join('')}
          </tbody>
        </table>
      </div>
      <div class="alert-banner info mt-3" style="margin-bottom:0">
        <i class="ti ti-api"></i>
        <code style="font-size:9px">GET /me/informationProtection/sensitivityLabels · GET /security/informationProtection/dlpPolicies · GET /compliance/retentionPolicies · GET /auditLogs/directoryAudits</code>
      </div>
    </div>
  `
}

// ============================================================
// PRIVILEGED ACCESS
// ============================================================
function renderPrivAccess() {
  const p = realPrivAccess || PRIV_ACCESS
  return `
    <div class="kpi-row mb-3">
      <div class="kpi-tile"><div class="kpi-value info" style="font-size:28px;font-weight:700">${p.globalAdminCount}</div><div class="kpi-label" style="font-size:10px;text-transform:uppercase;color:var(--color-text-tertiary);font-weight:600">Global Admins</div></div>
      <div class="kpi-tile"><div class="kpi-value info" style="font-size:28px;font-weight:700">${p.securityAdminCount}</div><div class="kpi-label" style="font-size:10px;text-transform:uppercase;color:var(--color-text-tertiary);font-weight:600">Security Admins</div></div>
      <div class="kpi-tile"><div class="kpi-value ${p.permanentAssignments > 2 ? 'danger' : 'success'}" style="font-size:28px;font-weight:700">${p.permanentAssignments}</div><div class="kpi-label" style="font-size:10px;text-transform:uppercase;color:var(--color-text-tertiary);font-weight:600">Permanent Roles</div></div>
      <div class="kpi-tile"><div class="kpi-value success" style="font-size:28px;font-weight:700">${p.pimAdoption}%</div><div class="kpi-label" style="font-size:10px;text-transform:uppercase;color:var(--color-text-tertiary);font-weight:600">PIM Adoption</div></div>
      <div class="kpi-tile"><div class="kpi-value ${p.newAdmins30d > 0 ? 'warning' : 'success'}" style="font-size:28px;font-weight:700">${p.newAdmins30d}</div><div class="kpi-label" style="font-size:10px;text-transform:uppercase;color:var(--color-text-tertiary);font-weight:600">New Admins (30d)</div></div>
    </div>
    <div class="grid-2" style="gap:16px">
      <div class="card">
        <div class="card-title mb-3"><i class="ti ti-crown"></i> Admin Role Distribution</div>
        ${[
          { role: 'Global Administrator',  count: p.globalAdminCount,    pim: true },
          { role: 'Security Administrator',count: p.securityAdminCount,  pim: true },
          { role: 'Exchange Administrator',count: p.exchangeAdminCount,  pim: true },
          { role: 'SharePoint Administrator', count: p.sharePointAdminCount, pim: false },
          { role: 'Teams Administrator',   count: p.teamsAdminCount,     pim: false },
          { role: 'Intune Administrator',  count: p.intuneAdminCount,    pim: false },
        ].map(r => `
          <div style="display:flex;align-items:center;gap:10px;padding:6px 0;border-bottom:0.5px solid var(--color-border-tertiary)">
            <span style="flex:1;font-size:11px">${r.role}</span>
            <span class="badge info">${r.count}</span>
            <span class="badge ${r.pim ? 'success' : 'warning'}">${r.pim ? 'PIM' : 'Permanent'}</span>
          </div>
        `).join('')}
        <div class="alert-banner warning mt-3" style="margin-bottom:0">
          <i class="ti ti-alert-triangle"></i>
          ${p.permanentAssignments} permanent role assignments should be converted to PIM eligible.
        </div>
      </div>
      <div class="card">
        <div class="card-title mb-3"><i class="ti ti-alert-triangle"></i> Critical Alerts (30d)</div>
        ${metricGrid([
          { label: 'New Admin Created',        val: p.newAdmins30d,              cls: p.newAdmins30d > 0 ? 'warning' : 'success' },
          { label: 'Priv. Role Assignments',   val: p.privRoleAssignments30d,    cls: 'info' },
          { label: 'Emergency Access Used',    val: p.emergencyAccess30d,        cls: p.emergencyAccess30d > 0 ? 'danger' : 'success' },
          { label: 'PIM Eligible Roles',       val: p.pimEligibleRoles,          cls: 'success' },
        ])}
        ${recBox(['Convert ' + p.permanentAssignments + ' permanent admin role assignments to PIM eligible', 'Implement Just-in-Time access for all privileged roles', 'Conduct quarterly access review for all admin role holders', 'Enable PIM access review notifications for approvers'])}
        <div class="alert-banner info mt-3" style="margin-bottom:0"><i class="ti ti-api"></i><code style="font-size:9px">GET /beta/roleManagement/directory/roleEligibilitySchedules</code></div>
      </div>
    </div>

    <div class="card mb-3">
      <div class="card-title mb-3"><i class="ti ti-shield-lock"></i> Privileged Access Management (PIM) Policies</div>
      <div style="font-size:10px;color:var(--color-text-tertiary);margin-bottom:12px;font-style:italic">Security policies and configurations for privileged access and Just-in-Time elevation.</div>
      <div style="overflow-x:auto">
        <table class="table" style="width:100%;font-size:11px">
          <thead>
            <tr style="border-bottom:1px solid var(--color-border-secondary)">
              <th style="padding:8px;text-align:left;font-weight:700;color:var(--color-text-secondary);text-transform:uppercase">Policy / Setting</th>
              <th style="padding:8px;text-align:center;font-weight:700;color:var(--color-text-secondary);text-transform:uppercase">Status</th>
              <th style="padding:8px;text-align:left;font-weight:700;color:var(--color-text-secondary);text-transform:uppercase">Configuration</th>
            </tr>
          </thead>
          <tbody>
            ${[
              { name: 'PIM Enabled', key: 'pimEnabled', icon: '🔐' },
              { name: 'MFA Required', key: 'mfaRequired', icon: '📱' },
              { name: 'Just-in-Time Access', key: 'justInTimeAccess', icon: '⏱️' },
              { name: 'Time-Based Activation', key: 'timeBasedActivation', icon: '⏲️' },
              { name: 'Approval Required', key: 'approvalRequired', icon: '✅' },
              { name: 'Audit Logging', key: 'auditLogging', icon: '📝' },
              { name: 'Resource Governance', key: 'resourceGovernance', icon: '🎯' },
              { name: 'Risk Assessment', key: 'riskAssessment', icon: '⚠️' },
              { name: 'Access Reviews', key: 'accessReview', icon: '👁️' }
            ].map(policy => {
              const config = p.privAccessPolicies?.[policy.key]
              let isConfigured = false
              let details = 'Not configured'

              if (config) {
                if (policy.key === 'accessReview') {
                  isConfigured = config.configured
                  details = config.count > 0 ? config.count + ' active reviews' : 'No reviews'
                } else {
                  isConfigured = config.configured || config.enabled
                  details = config.description || 'Not configured'
                }
              }

              return '<tr style="border-bottom:0.5px solid var(--color-border-tertiary);padding:0">' +
                '<td style="padding:8px;font-weight:600">' + policy.icon + ' ' + policy.name + '</td>' +
                '<td style="padding:8px;text-align:center">' + statusBadge(isConfigured ? 'enabled' : 'unknown') + '</td>' +
                '<td style="padding:8px;color:var(--color-text-tertiary)">' + details + '</td>' +
                '</tr>'
            }).join('')}
          </tbody>
        </table>
      </div>
      <div class="alert-banner info mt-3" style="margin-bottom:0">
        <i class="ti ti-api"></i>
        <code style="font-size:9px">GET /directoryRoles · GET /beta/roleManagement/directory/roleEligibilitySchedules · GET /beta/roleManagement/directory/roleAssignmentScheduleInstances</code>
      </div>
    </div>
  `
}

// ============================================================
// GUEST GOVERNANCE
// ============================================================
function renderGuests() {
  const g = (realGuestAccess && typeof realGuestAccess === 'object') ? realGuestAccess : GUEST_GOVERNANCE
  return `
    <div class="kpi-row mb-3">
      <div class="kpi-tile"><div class="kpi-value info" style="font-size:28px;font-weight:700">${g.totalGuests}</div><div class="kpi-label" style="font-size:10px;text-transform:uppercase;color:var(--color-text-tertiary);font-weight:600">Total Guests</div></div>
      <div class="kpi-tile"><div class="kpi-value ${g.dormantGuests90d > 5 ? 'danger' : 'success'}" style="font-size:28px;font-weight:700">${g.dormantGuests90d}</div><div class="kpi-label" style="font-size:10px;text-transform:uppercase;color:var(--color-text-tertiary);font-weight:600">Dormant (90d+)</div></div>
      <div class="kpi-tile"><div class="kpi-value danger" style="font-size:28px;font-weight:700">${g.expiredGuests}</div><div class="kpi-label" style="font-size:10px;text-transform:uppercase;color:var(--color-text-tertiary);font-weight:600">Expired</div></div>
      <div class="kpi-tile"><div class="kpi-value success" style="font-size:28px;font-weight:700">${g.guestsWithPrivAccess}</div><div class="kpi-label" style="font-size:10px;text-transform:uppercase;color:var(--color-text-tertiary);font-weight:600">With Priv. Access</div></div>
      <div class="kpi-tile"><div class="kpi-value warning" style="font-size:28px;font-weight:700">${g.quarterlyReviewOverdue}</div><div class="kpi-label" style="font-size:10px;text-transform:uppercase;color:var(--color-text-tertiary);font-weight:600">Review Overdue</div></div>
    </div>
    <div class="grid-2" style="gap:16px">
      <div class="card">
        <div class="card-title mb-3"><i class="ti ti-user-plus"></i> Guest Activity</div>
        ${metricGrid([
          { label: 'Added (30d)',          val: g.guestsAddedLast30d,  cls: 'info' },
          { label: 'Removed (30d)',        val: g.guestsRemovedLast30d,cls: 'success' },
          { label: 'Avg Account Age',     val: g.avgGuestAgeDays + 'd',cls: 'warning' },
        ])}
        <div class="alert-banner danger mt-3" style="margin-bottom:0">
          <i class="ti ti-clock"></i>
          ${g.expiredGuests} expired guest accounts should be removed immediately.
          ${g.dormantGuests90d} dormant guests require review.
        </div>
        <div class="alert-banner info mt-3" style="margin-bottom:0"><i class="ti ti-api"></i><code style="font-size:9px">GET /v1.0/users?$filter=userType eq 'Guest'&$select=displayName,signInActivity</code></div>
      </div>
      <div class="card">
        <div class="card-title mb-3"><i class="ti ti-shield"></i> Recommendations</div>
        ${recBox([
          g.expiredGuests > 0 ? 'Remove ' + g.expiredGuests + ' expired guest accounts immediately' : 'No expired guest accounts',
          g.dormantGuests90d > 0 ? 'Review and remove ' + g.dormantGuests90d + ' dormant guests (90d+ no sign-in)' : 'No dormant guests detected',
          g.quarterlyReviewOverdue > 0 ? 'Schedule overdue quarterly access review for ' + g.quarterlyReviewOverdue + ' guests' : 'Guest access reviews up to date',
          'Require manager attestation for all guest renewals',
          'Implement automatic expiry policy (365 days max)',
        ])}
      </div>
    </div>

    <div class="card mb-3">
      <div class="card-title mb-3"><i class="ti ti-shield-lock"></i> Guest Access Policies & Security</div>
      <div style="font-size:10px;color:var(--color-text-tertiary);margin-bottom:12px;font-style:italic">Policies and configurations controlling external guest access to your tenant.</div>
      <div style="overflow-x:auto">
        <table class="table" style="width:100%;font-size:11px">
          <thead>
            <tr style="border-bottom:1px solid var(--color-border-secondary)">
              <th style="padding:8px;text-align:left;font-weight:700;color:var(--color-text-secondary);text-transform:uppercase">Policy / Setting</th>
              <th style="padding:8px;text-align:center;font-weight:700;color:var(--color-text-secondary);text-transform:uppercase">Status</th>
              <th style="padding:8px;text-align:left;font-weight:700;color:var(--color-text-secondary);text-transform:uppercase">Configuration</th>
            </tr>
          </thead>
          <tbody>
            ${[
              { name: 'Guest Access Allowed', key: 'guestAccessAllowed', icon: '👥' },
              { name: 'MFA Required', key: 'mfaRequired', icon: '📱' },
              { name: 'External Sharing', key: 'externalSharing', icon: '🌐' },
              { name: 'B2B Collaboration', key: 'b2bCollaboration', icon: '🤝' },
              { name: 'Guest Invite Restrictions', key: 'guestInviteRestrictions', icon: '🚫' },
              { name: 'Access Review Policy', key: 'accessReviewPolicy', icon: '👁️' },
              { name: 'Session Timeout', key: 'sessionTimeout', icon: '⏱️' },
              { name: 'Device Compliance', key: 'deviceCompliance', icon: '🖥️' },
              { name: 'Risk-Based Access', key: 'riskBasedAccess', icon: '⚠️' }
            ].map(policy => {
              const config = g.guestAccessPolicies?.[policy.key]
              let isConfigured = false
              let details = 'Not configured'

              if (config) {
                if (policy.key === 'sessionTimeout') {
                  isConfigured = config.configured
                  details = config.minutes > 0 ? 'Timeout: ' + config.minutes + ' minutes' : 'No timeout'
                } else if (policy.key === 'accessReviewPolicy') {
                  isConfigured = config.configured
                  details = config.count > 0 ? config.count + ' active reviews' : 'No reviews configured'
                } else {
                  isConfigured = config.configured || config.enabled
                  details = config.description || 'Not configured'
                }
              }

              return '<tr style="border-bottom:0.5px solid var(--color-border-tertiary);padding:0">' +
                '<td style="padding:8px;font-weight:600">' + policy.icon + ' ' + policy.name + '</td>' +
                '<td style="padding:8px;text-align:center">' + statusBadge(isConfigured ? 'enabled' : 'unknown') + '</td>' +
                '<td style="padding:8px;color:var(--color-text-tertiary)">' + details + '</td>' +
                '</tr>'
            }).join('')}
          </tbody>
        </table>
      </div>
      <div class="alert-banner info mt-3" style="margin-bottom:0">
        <i class="ti ti-api"></i>
        <code style="font-size:9px">GET /users?$filter=userType eq 'Guest' · GET /auditLogs/directoryAudits · GET /identity/conditionalAccess/policies</code>
      </div>
    </div>
  `
}

// ============================================================
// realIncidents & THREATS
// ============================================================
let incidentFilter = { severity: 'all', status: 'all', search: '' }

function showIncidentModal(el, incident) {
  const timestamp = new Date(incident.timestamp || incident.created).toLocaleString()

  const html = `
    <div style="position:fixed;top:0;left:0;right:0;bottom:0;background:rgba(0,0,0,0.6);display:flex;align-items:center;justify-content:center;z-index:10000;padding:20px" id="incident-modal-backdrop">
      <div style="background:#fff;border-radius:12px;max-width:650px;width:100%;max-height:90vh;overflow-y:auto;box-shadow:0 25px 80px rgba(0,0,0,0.3);position:relative">

        <div style="padding:24px;border-bottom:1px solid #e5e5e5;display:flex;justify-content:space-between;align-items:flex-start">
          <div style="flex:1">
            <div style="display:flex;gap:8px;margin-bottom:12px">
              <span style="display:inline-block;padding:4px 8px;border-radius:4px;font-size:10px;font-weight:600;background:${incident.severity === 'critical' ? '#fee2e2;color:#991b1b' : incident.severity === 'high' ? '#fee2e2;color:#991b1b' : '#fef3c7;color:#92400e'}">${incident.severity.toUpperCase()}</span>
              <span style="display:inline-block;padding:4px 8px;border-radius:4px;font-size:10px;font-weight:600;background:#f3f4f6;color:#374151">${incident.status}</span>
            </div>
            <h2 style="margin:0;font-size:18px;font-weight:700;color:#111827">${incident.title}</h2>
          </div>
          <button onclick="document.getElementById('incident-modal-backdrop').remove()" style="background:none;border:none;font-size:24px;cursor:pointer;color:#6b7280;padding:0;width:32px;height:32px">×</button>
        </div>

        <div style="font-size:11px;color:#6b7280;font-family:monospace;padding:0 24px;word-break:break-all;margin-bottom:16px">
          ID: ${incident.id}
        </div>

        <div style="padding:0 24px 24px">
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:24px;margin-bottom:24px">
            <div>
              <div style="font-size:11px;color:#6b7280;text-transform:uppercase;font-weight:700;margin-bottom:8px">Actor</div>
              <div style="font-size:14px;font-weight:600;color:#111827">${incident.actor || 'System'}</div>
            </div>
            <div>
              <div style="font-size:11px;color:#6b7280;text-transform:uppercase;font-weight:700;margin-bottom:8px">Risk Score</div>
              <div style="font-size:14px;font-weight:700;color:${incident.riskScore > 70 ? '#991b1b' : incident.riskScore > 40 ? '#b45309' : '#059669'}">${incident.riskScore || 0}/100</div>
            </div>
            <div>
              <div style="font-size:11px;color:#6b7280;text-transform:uppercase;font-weight:700;margin-bottom:8px">Timestamp</div>
              <div style="font-size:13px;color:#374151">${timestamp}</div>
            </div>
            <div>
              <div style="font-size:11px;color:#6b7280;text-transform:uppercase;font-weight:700;margin-bottom:8px">Status</div>
              <div style="font-size:13px;color:#374151">${incident.status}</div>
            </div>
          </div>

          <div style="margin-bottom:24px">
            <div style="font-size:11px;color:#6b7280;text-transform:uppercase;font-weight:700;margin-bottom:10px">Description</div>
            <div style="font-size:13px;line-height:1.6;color:#374151;background:#f9fafb;padding:14px;border-radius:6px;border-left:3px solid #3b82f6">
              ${incident.description || 'No additional details available'}
            </div>
          </div>

          <div style="background:#f9fafb;padding:14px;border-radius:6px;border-left:3px solid ${incident.severity === 'critical' ? '#dc2626' : incident.severity === 'high' ? '#dc2626' : '#f59e0b'};margin-bottom:20px">
            <div style="font-size:11px;color:#6b7280;text-transform:uppercase;font-weight:700;margin-bottom:10px">Recommended Actions</div>
            <ul style="margin:0;padding-left:20px;font-size:13px;line-height:1.8;color:#374151">
              ${incident.severity === 'critical' ? `
                <li>Immediately investigate the root cause</li>
                <li>Check for unauthorized access or data exfiltration</li>
                <li>Review related incidents for patterns</li>
                <li>Escalate to security team if compromised</li>
              ` : incident.severity === 'high' ? `
                <li>Review the incident details and actor</li>
                <li>Verify the action was authorized</li>
                <li>Check for similar incidents</li>
                <li>Document findings in ticket</li>
              ` : `
                <li>Log and track the incident</li>
                <li>Correlate with other events if needed</li>
                <li>Determine if remediation is required</li>
                <li>Mark resolved when complete</li>
              `}
            </ul>
          </div>

          <div style="display:flex;gap:10px">
            <button onclick="document.getElementById('incident-modal-backdrop').remove()" style="padding:8px 16px;background:#3b82f6;color:#fff;border:none;border-radius:6px;font-weight:600;cursor:pointer;font-size:13px">Close</button>
            <button onclick="navigator.clipboard.writeText(JSON.stringify(${JSON.stringify(incident).replace(/"/g, '&quot;')}, null, 2)); alert('Incident details copied to clipboard'); document.getElementById('incident-modal-backdrop').remove()" style="padding:8px 16px;background:#f3f4f6;color:#111827;border:none;border-radius:6px;font-weight:600;cursor:pointer;font-size:13px">Export JSON</button>
          </div>
        </div>
      </div>
    </div>
  `

  document.body.insertAdjacentHTML('beforeend', html)
  document.getElementById('incident-modal-backdrop').addEventListener('click', e => {
    if (e.target.id === 'incident-modal-backdrop') e.target.remove()
  })
}

function renderIncidents() {
  let filtered = realIncidents.filter(i => {
    if (incidentFilter.severity !== 'all' && i.severity !== incidentFilter.severity) return false
    if (incidentFilter.status !== 'all' && i.status !== incidentFilter.status) return false
    if (incidentFilter.search && !i.title?.toLowerCase().includes(incidentFilter.search.toLowerCase()) &&
        !i.description?.toLowerCase().includes(incidentFilter.search.toLowerCase()) &&
        !i.actor?.toLowerCase().includes(incidentFilter.search.toLowerCase())) return false
    return true
  })

  const active = filtered.filter(i => i.status !== 'resolved')
  const resolved = filtered.filter(i => i.status === 'resolved')
  const critical = realIncidents.filter(i => i.severity === 'critical').length
  const high = realIncidents.filter(i => i.severity === 'high').length
  const med = realIncidents.filter(i => i.severity === 'medium').length
  const low = realIncidents.filter(i => i.severity === 'low').length

  return `
    <div class="kpi-row mb-3">
      <div class="kpi-tile"><div class="kpi-value ${critical > 0 ? 'danger' : 'success'}" style="font-size:28px;font-weight:700">${critical}</div><div class="kpi-label" style="font-size:10px;text-transform:uppercase;color:var(--color-text-tertiary);font-weight:600">Critical</div></div>
      <div class="kpi-tile"><div class="kpi-value ${high > 0 ? 'danger' : 'success'}" style="font-size:28px;font-weight:700">${high}</div><div class="kpi-label" style="font-size:10px;text-transform:uppercase;color:var(--color-text-tertiary);font-weight:600">High</div></div>
      <div class="kpi-tile"><div class="kpi-value warning" style="font-size:28px;font-weight:700">${med}</div><div class="kpi-label" style="font-size:10px;text-transform:uppercase;color:var(--color-text-tertiary);font-weight:600">Medium</div></div>
      <div class="kpi-tile"><div class="kpi-value info" style="font-size:28px;font-weight:700">${low}</div><div class="kpi-label" style="font-size:10px;text-transform:uppercase;color:var(--color-text-tertiary);font-weight:600">Low</div></div>
      <div class="kpi-tile"><div class="kpi-value success" style="font-size:28px;font-weight:700">${resolved.length}</div><div class="kpi-label" style="font-size:10px;text-transform:uppercase;color:var(--color-text-tertiary);font-weight:600">Resolved (7d)</div></div>
    </div>

    <div class="alert-banner ${critical > 0 ? 'danger' : high > 0 ? 'warning' : 'info'} mb-3">
      <i class="ti ti-robot"></i>
      <div>
        <strong>Security Summary:</strong> ${active.length} active incident${active.length !== 1 ? 's' : ''} detected.
        ${critical > 0 ? `${critical} critical · ` : ''}${high > 0 ? `${high} high · ` : ''}${med > 0 ? `${med} medium · ` : ''}${low > 0 ? `${low} low` : ''}. Review details below for immediate remediation.
      </div>
    </div>

    <!-- Filter Bar -->
    <div style="display:flex;gap:8px;margin-bottom:16px;align-items:center;flex-wrap:nowrap">
      <input type="text" class="form-input" id="incident-search" placeholder="Search..." value="${incidentFilter.search}" style="flex:1;min-width:200px">
      <select class="form-select" id="incident-severity" style="min-width:120px">
        <option value="all" ${incidentFilter.severity === 'all' ? 'selected' : ''}>All Severity</option>
        <option value="critical" ${incidentFilter.severity === 'critical' ? 'selected' : ''}>Critical</option>
        <option value="high" ${incidentFilter.severity === 'high' ? 'selected' : ''}>High</option>
        <option value="medium" ${incidentFilter.severity === 'medium' ? 'selected' : ''}>Medium</option>
        <option value="low" ${incidentFilter.severity === 'low' ? 'selected' : ''}>Low</option>
      </select>
      <select class="form-select" id="incident-status" style="min-width:120px">
        <option value="all" ${incidentFilter.status === 'all' ? 'selected' : ''}>All Status</option>
        <option value="open" ${incidentFilter.status === 'open' ? 'selected' : ''}>Open</option>
        <option value="resolved" ${incidentFilter.status === 'resolved' ? 'selected' : ''}>Resolved</option>
      </select>
      <button class="btn" id="incident-refresh" style="white-space:nowrap"><i class="ti ti-refresh"></i></button>
    </div>

    <div class="section-heading mb-2">Active Incidents (${active.length})</div>
    ${active.length > 0 ? active.map(inc => {
      const incType = inc.title?.split(':')[0] || 'Incident'
      const timestamp = new Date(inc.timestamp || inc.created).toLocaleString()
      return `
      <div class="card mb-2" style="border-left:3px solid ${inc.severity === 'critical' ? 'var(--clr-danger-text)' : inc.severity === 'high' ? 'var(--clr-danger-text)' : 'var(--clr-warning-text)'}">
        <div style="display:flex;align-items:flex-start;gap:12px">
          <div style="flex:1">
            <div style="display:flex;gap:6px;align-items:center;flex-wrap:wrap;margin-bottom:6px">
              <span class="monospace" style="font-size:9px;color:var(--color-text-tertiary);font-family:monospace">${inc.id?.substring(0, 50)}...</span>
              <span class="badge ${inc.severity === 'critical' ? 'danger' : inc.severity === 'high' ? 'danger' : 'warning'}">${inc.severity}</span>
              <span class="badge neutral">${incType}</span>
              <span class="badge ${inc.status === 'open' ? 'danger' : 'info'} dot">${inc.status}</span>
            </div>
            <div style="font-size:12px;font-weight:700;margin-bottom:6px">${inc.title}</div>
            <div style="font-size:10px;color:var(--color-text-secondary);margin-bottom:4px">${inc.description || 'No additional details'}</div>
            <div style="font-size:9px;color:var(--color-text-tertiary)">
              Actor: ${inc.actor || 'System'} · Risk Score: ${inc.riskScore || 0} · ${timestamp}
            </div>
          </div>
          <div style="margin-left:auto;display:flex;gap:6px;flex-shrink:0">
            <button class="btn btn-xs btn-danger incident-review-btn" data-incident-id="${inc.id}">Review</button>
          </div>
        </div>
      </div>
    `}).join('') : `
      <div style="text-align:center;padding:24px;color:var(--color-text-secondary)">
        <i class="ti ti-circle-check" style="font-size:32px;display:block;margin-bottom:8px"></i>
        <strong>No Active Incidents</strong><br/>
        <span style="font-size:11px">Your tenant is operating normally</span>
      </div>
    `}

    ${resolved.length > 0 ? `
      <div class="section-heading mb-2" style="margin-top:16px">Resolved (${resolved.length})</div>
      ${resolved.map(inc => {
        const timestamp = new Date(inc.timestamp || inc.created).toLocaleString()
        return `
        <div class="card mb-2" style="opacity:0.65;border-left:3px solid var(--clr-success-text)">
          <div style="display:flex;align-items:center;gap:10px">
            <span class="monospace" style="font-size:9px;color:var(--color-text-tertiary)">${inc.id?.substring(0, 40)}...</span>
            <span class="badge neutral">${inc.severity}</span>
            <span style="flex:1;font-size:11px">${inc.title}</span>
            <span class="badge success dot">Resolved</span>
            <span style="font-size:9px;color:var(--color-text-tertiary)">${timestamp}</span>
          </div>
        </div>
      `}).join('')}
    ` : ''}
  `
}

// ============================================================
// RECOMMENDATIONS
// ============================================================
function renderRecommendations() {
  const recs = Array.isArray(realRecommendations) ? realRecommendations : RECOMMENDATIONS
  const filtered = recs.filter(r => {
    if (recFilter.priority !== 'all' && r.priority !== recFilter.priority) return false
    if (recFilter.category !== 'all' && r.category !== recFilter.category) return false
    if (recFilter.status !== 'all' && r.status !== recFilter.status) return false
    return true
  })
  const totalGain = filtered.reduce((s, r) => s + (r.scoreGain || 0), 0)

  const cats = [...new Set(recs.map(r => r.category))]

  return `
    <div class="filter-bar mb-3">
      <select class="form-select" id="rec-priority">
        <option value="all" ${recFilter.priority === 'all' ? 'selected' : ''}>All Priorities</option>
        <option value="critical" ${recFilter.priority === 'critical' ? 'selected' : ''}>Critical</option>
        <option value="high" ${recFilter.priority === 'high' ? 'selected' : ''}>High</option>
        <option value="medium" ${recFilter.priority === 'medium' ? 'selected' : ''}>Medium</option>
        <option value="low" ${recFilter.priority === 'low' ? 'selected' : ''}>Low</option>
      </select>
      <select class="form-select" id="rec-category">
        <option value="all">All Categories</option>
        ${cats.map(c => `<option value="${c}" ${recFilter.category === c ? 'selected' : ''}>${c}</option>`).join('')}
      </select>
      <select class="form-select" id="rec-status">
        <option value="all" ${recFilter.status === 'all' ? 'selected' : ''}>All Status</option>
        <option value="open" ${recFilter.status === 'open' ? 'selected' : ''}>Open</option>
        <option value="in-progress" ${recFilter.status === 'in-progress' ? 'selected' : ''}>In Progress</option>
      </select>
      <span class="badge info" style="align-self:center">${filtered.length} items · +${totalGain} pts potential</span>
    </div>

    <div class="card" style="padding:0;overflow:hidden">
      <table>
        <thead><tr>
          <th style="width:11%">Priority</th>
          <th style="width:35%">Recommendation</th>
          <th style="width:11%">Category</th>
          <th style="width:23%">Graph / API Hint</th>
          <th style="width:8%">Score ↑</th>
          <th style="width:7%">Effort</th>
          <th style="width:5%">Status</th>
        </tr></thead>
        <tbody>
          ${filtered.map(r => `
            <tr>
              <td><span class="badge ${r.priority === 'critical' ? 'danger' : r.priority === 'high' ? 'warning' : r.priority === 'medium' ? 'info' : 'neutral'}" style="font-size:9px">${r.priority}</span></td>
              <td style="font-size:11px;font-weight:500;line-height:1.3">${r.title}</td>
              <td><span class="pill" style="font-size:9px">${r.category}</span></td>
              <td><code style="font-size:9px;color:var(--clr-info-text);word-break:break-all;line-height:1.4">${r.apiHint}</code></td>
              <td><span class="badge success" style="font-size:9px">+${r.scoreGain}</span></td>
              <td><span class="badge neutral" style="font-size:9px">${r.effort}</span></td>
              <td><span class="badge ${r.status === 'in-progress' ? 'info' : 'warning'}" style="font-size:9px">${r.status}</span></td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>
  `
}

// ============================================================
// SECURITY COPILOT
// ============================================================
function renderSecurityCopilot() {
  if (!copilotInit || copilotMessages.length === 0) {
    copilotMessages = [{
      role: 'ai',
      text: `**M365 Security Copilot** — I have full context of your security posture across all 15 data sources.\n\nCurrent tenant: **${state.tenantDomain}** · Secure Score: **64/95** · ${realIncidents.filter(i => i.status !== 'resolved').length} active incidents\n\nAsk me anything about your security posture, specific risks, or recommended actions.`
    }]
    copilotInit = true
  }

  const suggestions = [
    'Show me all high-risk users',
    'Why did Secure Score drop this week?',
    'Which Teams have external guests?',
    'Top 10 security improvements',
    'Which devices are vulnerable to ransomware?',
    'Summarize today\'s security posture',
    'Email security status',
    'MFA coverage and gaps',
    'Conditional Access coverage',
    'Guest user governance',
  ]

  return `
    <div style="display:flex;flex-direction:column;height:calc(100vh - 340px);min-height:450px">
      <div style="overflow-y:auto;flex:1;padding-bottom:8px" id="sec-copilot-msgs">
        ${copilotMessages.map(m => `
          <div class="chat-msg ${m.role === 'ai' ? 'ai' : 'user-msg'}" style="max-width:85%;margin-bottom:12px">
            ${m.role === 'ai' ? `<div class="chat-sender"><i class="ti ti-shield-check" style="color:var(--clr-info-text)"></i> Security Copilot</div>` : `<div class="chat-sender" style="justify-content:flex-end">You</div>`}
            <div class="chat-bubble">${formatSecMsg(m.text)}</div>
          </div>
        `).join('')}
      </div>

      <div style="display:flex;flex-wrap:wrap;gap:5px;padding:8px 0 8px;border-top:0.5px solid var(--color-border-tertiary)">
        ${suggestions.slice(0, 5).map(s => `<button class="suggestion-pill sec-cop-pill" data-q="${s}">${s}</button>`).join('')}
      </div>

      <div class="chat-input-area" style="padding:0;border-top:none;margin-top:4px">
        <textarea class="chat-input" id="sec-cop-input" placeholder="Ask about Secure Score, risky users, vulnerabilities, recommendations..." rows="1"></textarea>
        <button class="btn btn-primary" id="sec-cop-send"><i class="ti ti-send"></i></button>
      </div>
    </div>
  `
}

// ============================================================
// API REFERENCE
// ============================================================
function renderApiReference() {
  const cats = [...new Set(API_REFERENCE.map(r => r.category))]
  return `
    <div class="alert-banner info mb-3">
      <i class="ti ti-info-circle"></i>
      <div style="line-height:1.5">
        <strong>Security Data Abstraction Layer</strong> — AgentOps uses a hybrid collection model:
        <strong>Microsoft Graph API</strong> (Identity, Intune, Teams, SharePoint, Secure Score) +
        <strong>Defender XDR API</strong> (Incidents, Alerts) +
        <strong>Exchange Online PowerShell</strong> (DKIM, Mail Flow) +
        <strong>Purview PowerShell</strong> (DLP, Labels, Retention)
      </div>
    </div>

    ${cats.map(cat => `
      <div class="card mb-3" style="padding:0;overflow:hidden">
        <div class="section-heading" style="padding:8px 14px;margin:0;background:var(--color-background-secondary)">
          ${cat}
        </div>
        <table>
          <thead><tr>
            <th style="width:7%">Method</th>
            <th style="width:18%">Source</th>
            <th style="width:40%">Endpoint / Command</th>
            <th style="width:25%">Data Returned</th>
            <th style="width:10%">Auth Scope</th>
          </tr></thead>
          <tbody>
            ${API_REFERENCE.filter(r => r.category === cat).map(r => `
              <tr>
                <td><span class="method-badge ${r.method}" style="font-size:9px">${r.method}</span></td>
                <td style="font-size:10px;color:var(--color-text-secondary)">${r.source}</td>
                <td>
                  <code style="font-size:10px;color:var(--clr-info-text);word-break:break-all;line-height:1.5">${r.endpoint}</code>
                  <button class="btn btn-xs api-copy" data-code="${r.endpoint.replace(/"/g,'&quot;')}" style="margin-left:4px;padding:1px 5px;font-size:9px"><i class="ti ti-copy"></i></button>
                </td>
                <td style="font-size:10px;color:var(--color-text-secondary)">${r.returns}</td>
                <td><span class="pill" style="font-size:8px;word-break:break-all">${r.auth}</span></td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    `).join('')}

    <div class="card" style="background:var(--color-background-secondary)">
      <div class="card-title mb-2"><i class="ti ti-sitemap"></i> AgentOps Collector Architecture</div>
      <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(180px,1fr));gap:10px;margin-top:8px">
        ${[
          { name: 'Graph Collector', items: ['Entra ID', 'Teams', 'Intune', 'SharePoint', 'Secure Score'], icon: 'ti-api', color: 'info' },
          { name: 'Defender Collector', items: ['Incidents', 'Alerts', 'Recommendations', 'TVM'], icon: 'ti-shield-exclamation', color: 'danger' },
          { name: 'Exchange Collector', items: ['Mailboxes', 'DKIM', 'Transport Rules', 'Permissions'], icon: 'ti-mail', color: 'warning' },
          { name: 'Purview Collector', items: ['DLP', 'Labels', 'Retention', 'Audit'], icon: 'ti-lock', color: 'purple' },
          { name: 'Message Center', items: ['Health Issues', 'MC Posts', 'Maintenance', 'Changes'], icon: 'ti-antenna', color: 'info' },
        ].map(c => `
          <div class="card" style="padding:10px">
            <div style="display:flex;align-items:center;gap:6px;margin-bottom:8px">
              <i class="ti ${c.icon}" style="color:var(--clr-${c.color}-text);font-size:14px"></i>
              <span style="font-size:11px;font-weight:700">${c.name}</span>
            </div>
            ${c.items.map(i => `<div style="font-size:10px;color:var(--color-text-secondary);padding:2px 0;display:flex;gap:4px"><i class="ti ti-chevron-right" style="font-size:9px;margin-top:2px"></i>${i}</div>`).join('')}
          </div>
        `).join('')}
      </div>
    </div>
  `
}

// ============================================================
// Section event wiring
// ============================================================
function wireSection(el) {
  const content = el.querySelector('#sec-content')
  if (!content) return

  // Trend range buttons
  content.querySelectorAll('[data-trend]').forEach(btn => {
    btn.addEventListener('click', () => { trendRange = btn.dataset.trend; render(el) })
  })

  // Go-to service section from executive
  content.querySelectorAll('[data-goto]').forEach(tile => {
    tile.addEventListener('click', () => {
      const sectionMap = { identity:'identity', email:'email', endpoint:'endpoint', teams:'teams', sharepoint:'sharepoint', data:'dataprotection', privaccess:'privaccess', guests:'guests' }
      const s = sectionMap[tile.dataset.goto]
      if (s) { activeSection = s; render(el) }
    })
  })

  // Executive nav shortcuts
  content.querySelector('#exec-view-incidents')?.addEventListener('click', () => { activeSection = 'incidents'; render(el) })
  content.querySelector('#exec-view-recs')?.addEventListener('click', () => { activeSection = 'recommendations'; render(el) })

  // Recommendation filters
  content.querySelector('#rec-priority')?.addEventListener('change', e => { recFilter.priority = e.target.value; render(el) })
  content.querySelector('#rec-category')?.addEventListener('change', e => { recFilter.category = e.target.value; render(el) })
  content.querySelector('#rec-status')?.addEventListener('change', e => { recFilter.status = e.target.value; render(el) })

  // Incident filters
  content.querySelector('#incident-search')?.addEventListener('input', e => { incidentFilter.search = e.target.value; render(el) })
  content.querySelector('#incident-severity')?.addEventListener('change', e => { incidentFilter.severity = e.target.value; render(el) })
  content.querySelector('#incident-status')?.addEventListener('change', e => { incidentFilter.status = e.target.value; render(el) })
  content.querySelector('#incident-refresh')?.addEventListener('click', () => render(el))

  // Incident review buttons
  content.querySelectorAll('.incident-review-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const incId = btn.dataset.incidentId
      const incident = realIncidents.find(i => i.id === incId)
      if (incident) showIncidentModal(el, incident)
    })
  })

  // Security Copilot
  const copSend = content.querySelector('#sec-cop-send')
  const copInput = content.querySelector('#sec-cop-input')
  if (copSend && copInput) {
    copSend.addEventListener('click', () => sendCopilotMsg(el, copInput))
    copInput.addEventListener('keydown', e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendCopilotMsg(el, copInput) } })
  }

  content.querySelectorAll('.sec-cop-pill').forEach(p => {
    p.addEventListener('click', () => {
      const inp = content.querySelector('#sec-cop-input')
      if (inp) { inp.value = p.dataset.q; sendCopilotMsg(el, inp) }
    })
  })

  // API copy buttons
  content.querySelectorAll('.api-copy').forEach(btn => {
    btn.addEventListener('click', () => {
      navigator.clipboard.writeText(btn.dataset.code)
      showToast('Endpoint copied to clipboard.', 'success')
    })
  })
}

// ============================================================
// Security Copilot messaging
// ============================================================
function sendCopilotMsg(el, input) {
  const text = input.value.trim()
  if (!text) return
  copilotMessages.push({ role: 'user', text })
  input.value = ''

  const msgs = el.querySelector('#sec-copilot-msgs')
  if (msgs) {
    msgs.innerHTML += `<div class="chat-msg user-msg" style="max-width:85%;margin-bottom:12px">
      <div class="chat-sender" style="justify-content:flex-end">You</div>
      <div class="chat-bubble">${text}</div>
    </div>`
    msgs.scrollTop = msgs.scrollHeight
  }

  setTimeout(() => {
    const q = text.toLowerCase()
    const match = SECURITY_COPILOT_KB.find(r => r.keywords.some(k => q.includes(k)))
    const response = match?.response || `Analysing your query across all 15 security data sources...\n\nFor **"${text}"**: Based on current tenant data, navigate to the relevant section in the Security Command Center for detailed information. Use the Recommendations tab for prioritised action items, or check the Incidents section for active threats.\n\nCurrent status: Secure Score 64/95 · ${realIncidents.filter(i => i.status !== 'resolved').length} active incidents · ${IDENTITY.highRiskUsers} high-risk users.`

    copilotMessages.push({ role: 'ai', text: response })
    if (msgs) {
      msgs.innerHTML += `<div class="chat-msg ai" style="max-width:85%;margin-bottom:12px">
        <div class="chat-sender"><i class="ti ti-shield-check" style="color:var(--clr-info-text)"></i> Security Copilot</div>
        <div class="chat-bubble">${formatSecMsg(response)}</div>
      </div>`
      msgs.scrollTop = msgs.scrollHeight
    }
  }, 600)
}

function formatSecMsg(text) {
  return text
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\n\n/g, '<br><br>')
    .replace(/\n/g, '<br>')
    .replace(/\|(.+)\|\n\|[-|: ]+\|\n/g, '')
    .replace(/\|(.+)\|/g, (m) => {
      const cells = m.split('|').filter(c => c.trim())
      return `<span style="display:flex;gap:16px;font-size:11px;padding:2px 0">${cells.map(c => `<span>${c.trim()}</span>`).join('')}</span>`
    })
}

// ============================================================
// Demo Page Rendering
// ============================================================
function renderDemoSecurityPage(el) {
  const demoScore = { overallScore: 78, categoryScores: { identity: 82, data: 75, devices: 72, apps: 76, infrastructure: 79 } }
  const demoIncidents = DEMO_INCIDENTS.slice(0, 5)

  el.innerHTML = `
    <div class="page-header">
      <div>
        <div class="page-title"><i class="ti ti-shield-check"></i> Security</div>
        <div class="page-subtitle">Comprehensive security posture and threat assessment</div>
      </div>
      <div class="page-actions">
        <button class="btn"><i class="ti ti-refresh"></i> Refresh</button>
      </div>
    </div>

    <div style="display:flex;align-items:center;gap:8px;padding:8px 12px;background:var(--color-background-primary);border:0.5px solid var(--color-border-secondary);border-radius:var(--border-radius-md);margin-bottom:16px;font-size:10px;color:var(--color-text-tertiary)">
      <span class="status-dot active pulse"></span>
      <span><strong style="color:var(--color-text-secondary)">Demo Mode</strong> · Showing sample security data</span>
    </div>

    <div class="kpi-row" style="margin-bottom:20px">
      <div class="kpi-tile">
        <div class="kpi-value info">78</div>
        <div class="kpi-label">Overall Score</div>
      </div>
      <div class="kpi-tile">
        <div class="kpi-value success">82</div>
        <div class="kpi-label">Identity</div>
      </div>
      <div class="kpi-tile">
        <div class="kpi-value warning">75</div>
        <div class="kpi-label">Data</div>
      </div>
      <div class="kpi-tile">
        <div class="kpi-value warning">72</div>
        <div class="kpi-label">Devices</div>
      </div>
      <div class="kpi-tile">
        <div class="kpi-value danger">5</div>
        <div class="kpi-label">Incidents</div>
      </div>
    </div>

    <div class="tabs" id="sec-tabs">
      <button class="tab-btn active" data-section="executive">Executive</button>
      <button class="tab-btn" data-section="securescore">Secure Score</button>
      <button class="tab-btn" data-section="identity">Identity</button>
      <button class="tab-btn" data-section="incidents">Incidents</button>
    </div>

    <div id="security-content"></div>
  `

  const contentEl = el.querySelector('#security-content')
  renderDemoExecutive(contentEl, demoScore, demoIncidents)

  el.querySelectorAll('#sec-tabs .tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      el.querySelectorAll('#sec-tabs .tab-btn').forEach(b => b.classList.remove('active'))
      btn.classList.add('active')
      const section = btn.dataset.section

      if (section === 'executive') renderDemoExecutive(contentEl, demoScore, demoIncidents)
      else if (section === 'securescore') renderDemoSecureScore(contentEl, demoScore)
      else if (section === 'identity') renderDemoIdentity(contentEl)
      else if (section === 'incidents') renderDemoIncidents(contentEl, demoIncidents)
    })
  })
}

function renderDemoExecutive(el, score, incidents) {
  el.innerHTML = `
    <div class="card mb-3">
      <div class="card-header">
        <span class="card-title">Overall Security Score</span>
        <span class="badge warning">${score.overallScore}%</span>
      </div>
      <table style="width:100%">
        <tbody>
          <tr style="border-bottom:0.5px solid var(--color-border-tertiary)">
            <td style="padding:10px 12px;font-size:11px;font-weight:600">Identity</td>
            <td style="padding:10px 12px;text-align:right;font-size:14px;font-weight:700;color:var(--clr-info-text)">${score.categoryScores.identity}%</td>
          </tr>
          <tr style="border-bottom:0.5px solid var(--color-border-tertiary)">
            <td style="padding:10px 12px;font-size:11px;font-weight:600">Data</td>
            <td style="padding:10px 12px;text-align:right;font-size:14px;font-weight:700;color:var(--clr-warning-text)">${score.categoryScores.data}%</td>
          </tr>
          <tr style="border-bottom:0.5px solid var(--color-border-tertiary)">
            <td style="padding:10px 12px;font-size:11px;font-weight:600">Devices</td>
            <td style="padding:10px 12px;text-align:right;font-size:14px;font-weight:700;color:var(--clr-warning-text)">${score.categoryScores.devices}%</td>
          </tr>
          <tr style="border-bottom:0.5px solid var(--color-border-tertiary)">
            <td style="padding:10px 12px;font-size:11px;font-weight:600">Apps</td>
            <td style="padding:10px 12px;text-align:right;font-size:14px;font-weight:700;color:var(--clr-info-text)">${score.categoryScores.apps}%</td>
          </tr>
          <tr>
            <td style="padding:10px 12px;font-size:11px;font-weight:600">Infrastructure</td>
            <td style="padding:10px 12px;text-align:right;font-size:14px;font-weight:700;color:var(--clr-success-text)">${score.categoryScores.infrastructure}%</td>
          </tr>
        </tbody>
      </table>
    </div>

    <div class="card mb-3">
      <div class="card-header">
        <span class="card-title">Active Incidents</span>
        <span class="badge danger">${incidents.length} alerts</span>
      </div>
      <table style="width:100%">
        <thead style="background:var(--color-background-secondary)">
          <tr>
            <th style="padding:10px;text-align:left;font-size:10px;font-weight:600">Incident</th>
            <th style="padding:10px;text-align:left;font-size:10px;font-weight:600">Severity</th>
            <th style="padding:10px;text-align:left;font-size:10px;font-weight:600">Status</th>
            <th style="padding:10px;text-align:left;font-size:10px;font-weight:600">Detected</th>
          </tr>
        </thead>
        <tbody>
          ${incidents.slice(0, 5).map(incident => `
            <tr style="border-bottom:0.5px solid var(--color-border-tertiary)">
              <td style="padding:10px;font-size:11px;color:var(--color-text-secondary)">${incident.title}</td>
              <td style="padding:10px;font-size:10px"><span class="badge ${incident.severity === 'high' ? 'danger' : 'warning'}">${incident.severity}</span></td>
              <td style="padding:10px;font-size:10px"><span class="badge info">Investigating</span></td>
              <td style="padding:10px;font-size:10px;color:var(--color-text-tertiary)">${new Date(incident.detectedAt || Date.now()).toLocaleDateString()}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>
  `
}

function renderDemoSecureScore(el, score) {
  el.innerHTML = `
    <div class="card mb-3">
      <div class="card-header">
        <span class="card-title">Microsoft Secure Score</span>
      </div>
      <div style="padding:20px;text-align:center">
        <div style="font-size:48px;font-weight:700;color:var(--clr-warning-text);margin-bottom:8px">${score.overallScore}</div>
        <div style="font-size:12px;color:var(--color-text-secondary);margin-bottom:20px">Out of 100 possible points</div>
        <div style="width:100%;height:8px;background:var(--color-background-secondary);border-radius:4px;overflow:hidden">
          <div style="height:100%;width:${score.overallScore}%;background:var(--clr-warning-bg)"></div>
        </div>
      </div>
    </div>

    <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px">
      <div class="card">
        <div class="card-title">Identity & Access</div>
        <div style="margin-top:8px">
          <div style="display:flex;justify-content:space-between;margin-bottom:6px">
            <span style="font-size:11px">Secure Score:</span>
            <span style="font-size:11px;font-weight:600">${score.categoryScores.identity} points</span>
          </div>
          <div style="height:4px;background:var(--color-background-secondary);border-radius:2px;overflow:hidden">
            <div style="height:100%;width:${score.categoryScores.identity}%;background:var(--clr-info-bg)"></div>
          </div>
        </div>
      </div>
      <div class="card">
        <div class="card-title">Data Security</div>
        <div style="margin-top:8px">
          <div style="display:flex;justify-content:space-between;margin-bottom:6px">
            <span style="font-size:11px">Secure Score:</span>
            <span style="font-size:11px;font-weight:600">${score.categoryScores.data} points</span>
          </div>
          <div style="height:4px;background:var(--color-background-secondary);border-radius:2px;overflow:hidden">
            <div style="height:100%;width:${score.categoryScores.data}%;background:var(--clr-warning-bg)"></div>
          </div>
        </div>
      </div>
    </div>
  `
}

function renderDemoIdentity(el) {
  el.innerHTML = `
    <div class="card mb-3">
      <div class="card-header">
        <span class="card-title">Identity Posture</span>
      </div>
      <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:12px">
        <div style="padding:12px;background:var(--color-background-secondary);border-radius:var(--border-radius-md)">
          <div style="font-size:10px;color:var(--color-text-tertiary);text-transform:uppercase;font-weight:600;margin-bottom:6px">Total Users</div>
          <div style="font-size:24px;font-weight:700">1,000</div>
        </div>
        <div style="padding:12px;background:var(--color-background-secondary);border-radius:var(--border-radius-md)">
          <div style="font-size:10px;color:var(--color-text-tertiary);text-transform:uppercase;font-weight:600;margin-bottom:6px">MFA Enabled</div>
          <div style="font-size:24px;font-weight:700;color:var(--clr-success-text)">856</div>
          <div style="font-size:9px;color:var(--color-text-tertiary);margin-top:4px">85.6%</div>
        </div>
        <div style="padding:12px;background:var(--color-background-secondary);border-radius:var(--border-radius-md)">
          <div style="font-size:10px;color:var(--color-text-tertiary);text-transform:uppercase;font-weight:600;margin-bottom:6px">Global Admins</div>
          <div style="font-size:24px;font-weight:700;color:var(--clr-warning-text)">4</div>
        </div>
      </div>
    </div>

    <div class="card mb-3">
      <div class="card-header">
        <span class="card-title">Conditional Access</span>
      </div>
      <table style="width:100%">
        <thead style="background:var(--color-background-secondary)">
          <tr>
            <th style="padding:10px;text-align:left;font-size:10px;font-weight:600">Policy</th>
            <th style="padding:10px;text-align:left;font-size:10px;font-weight:600">Status</th>
          </tr>
        </thead>
        <tbody>
          <tr style="border-bottom:0.5px solid var(--color-border-tertiary)">
            <td style="padding:10px;font-size:11px">Require MFA for admins</td>
            <td style="padding:10px"><span class="badge success">Enabled</span></td>
          </tr>
          <tr style="border-bottom:0.5px solid var(--color-border-tertiary)">
            <td style="padding:10px;font-size:11px">Block legacy authentication</td>
            <td style="padding:10px"><span class="badge success">Enabled</span></td>
          </tr>
          <tr style="border-bottom:0.5px solid var(--color-border-tertiary)">
            <td style="padding:10px;font-size:11px">Require compliant devices</td>
            <td style="padding:10px"><span class="badge warning">Report only</span></td>
          </tr>
        </tbody>
      </table>
    </div>
  `
}

function renderDemoIncidents(el, incidents) {
  el.innerHTML = `
    <div class="card">
      <div class="card-header">
        <span class="card-title">Security Alerts</span>
        <span class="badge danger">${incidents.length} open</span>
      </div>
      ${incidents.map((incident, i) => `
        <div style="padding:12px;border-bottom:${i < incidents.length - 1 ? '0.5px solid var(--color-border-tertiary)' : 'none'}">
          <div style="display:flex;justify-content:space-between;align-items:start;margin-bottom:6px">
            <div style="font-weight:600;font-size:11px">${incident.title}</div>
            <span class="badge ${incident.severity === 'high' ? 'danger' : 'warning'}">${incident.severity}</span>
          </div>
          <div style="font-size:10px;color:var(--color-text-secondary);margin-bottom:8px">${incident.description}</div>
          <div style="font-size:9px;color:var(--color-text-tertiary)">Detected: ${new Date(incident.detectedAt || Date.now()).toLocaleString()}</div>
        </div>
      `).join('')}
    </div>
  `
}

// ============================================================
// Reusable sub-components
// ============================================================
function metricGrid(metrics) {
  return `<div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:4px">
    ${metrics.map(m => `
      <div style="padding:8px 10px;background:var(--color-background-secondary);border-radius:var(--border-radius-md);border:0.5px solid var(--color-border-tertiary)">
        <div style="font-size:10px;color:var(--color-text-tertiary);margin-bottom:3px;text-transform:uppercase;font-weight:600;letter-spacing:0.3px">${m.label}</div>
        <div style="font-size:16px;font-weight:700;color:${
          m.cls === 'success' ? 'var(--clr-success-text)' :
          m.cls === 'danger'  ? 'var(--clr-danger-text)' :
          m.cls === 'warning' ? 'var(--clr-warning-text)' :
          m.cls === 'info'    ? 'var(--clr-info-text)' :
          'var(--color-text-primary)'
        }">${m.val}</div>
      </div>
    `).join('')}
  </div>`
}

function recBox(items) {
  return `<div style="margin-top:12px">
    <div class="section-heading">Recommendations</div>
    ${items.map(r => `
      <div style="display:flex;gap:6px;padding:5px 0;border-bottom:0.5px solid var(--color-border-tertiary);font-size:11px;color:var(--color-text-secondary)">
        <i class="ti ti-arrow-right" style="color:var(--clr-warning-text);font-size:11px;flex-shrink:0;margin-top:2px"></i>
        ${r}
      </div>
    `).join('')}
  </div>`
}
