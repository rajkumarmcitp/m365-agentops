import { go } from '../app.js'
import { showToast } from '../components/toast.js'
import { getSecurityScore, getIncidents, getDevices } from '../lib/api-client.js'
import {
  SECURE_SCORE, IDENTITY, EMAIL, ENDPOINT, TEAMS_SEC, SHAREPOINT_SEC,
  DATA_PROTECTION, PRIV_ACCESS, GUEST_GOVERNANCE, INCIDENTS as STATIC_INCIDENTS, RECOMMENDATIONS,
  API_REFERENCE, SECURITY_COPILOT_KB
} from '../data/security-data.js'

let realSecureScore = SECURE_SCORE
let realIncidents = STATIC_INCIDENTS

// ============================================================
// Sub-navigation
// ============================================================
let activeSection = 'executive'
let recFilter = { priority: 'all', category: 'all', status: 'all' }
let trendRange = '7d'
let copilotMessages = []
let copilotInit = false

const SEC_TABS = [
  { id: 'executive',      label: 'Executive',       icon: 'ti-layout-dashboard' },
  { id: 'securescore',    label: 'Secure Score',    icon: 'ti-shield-check' },
  { id: 'identity',       label: 'Identity',        icon: 'ti-user-check' },
  { id: 'email',          label: 'Email',           icon: 'ti-mail' },
  { id: 'endpoint',       label: 'Endpoint',        icon: 'ti-device-laptop' },
  { id: 'teams',          label: 'Teams',           icon: 'ti-brand-teams' },
  { id: 'sharepoint',     label: 'SharePoint',      icon: 'ti-brand-sharepoint' },
  { id: 'dataprotection', label: 'Data Protection', icon: 'ti-lock' },
  { id: 'privaccess',     label: 'Priv. Access',    icon: 'ti-crown' },
  { id: 'guests',         label: 'Guests',          icon: 'ti-user-plus' },
  { id: 'incidents',      label: 'Incidents',       icon: 'ti-alert-triangle' },
  { id: 'recommendations',label: 'Recommendations', icon: 'ti-checklist' },
  { id: 'copilot',        label: 'Security Copilot',icon: 'ti-robot' },
  { id: 'apiref',         label: 'API Reference',   icon: 'ti-api' },
]

// ============================================================
// Entry
// ============================================================
export async function initSecurity() {
  const el = document.getElementById('page-security')
  if (!el) return

  try {
    console.log('📡 Fetching real security data from backend...')

    // Fetch secure score
    const scoreResult = await getSecurityScore()
    if (scoreResult.success) {
      realSecureScore = scoreResult.data || SECURE_SCORE
      console.log('✅ Loaded real secure score from API')
    }

    // Fetch real devices first (needed for both real and static incidents)
    let devicesData = []
    try {
      const devicesResult = await getDevices()
      if (devicesResult.success && devicesResult.data) {
        devicesData = devicesResult.data
        console.log(`✅ Loaded ${devicesData.length} real devices from Intune`)
      }
    } catch (deviceError) {
      console.warn('⚠️ Could not fetch device data:', deviceError.message)
    }

    // Helper function to enrich incidents with device data
    const enrichIncidents = (incidents) => {
      return incidents.map(incident => {
        // Extract device name from description, title, or use deviceName field
        const deviceNameSource = incident.deviceName ||
                                incident.description?.match(/Device ([A-Z0-9-]+)/)?.[1] ||
                                incident.title?.match(/([A-Z0-9-]+)/)?.[1] ||
                                incident.description?.match(/([A-Z0-9]{3,})/)?.[1]

        if (deviceNameSource && devicesData.length > 0) {
          // Try to find matching device in Intune
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

    // Fetch incidents (from alerts)
    const incidentsResult = await getIncidents()
    if (incidentsResult.success && incidentsResult.data.length > 0) {
      realIncidents = enrichIncidents(incidentsResult.data)
      console.log(`✅ Loaded ${realIncidents.length} real incidents from alerts (enriched with device data)`)
    } else {
      console.warn('⚠️ No active incidents, using static data (enriched with real devices)')
      // Enrich static incidents with real device data
      realIncidents = enrichIncidents(STATIC_INCIDENTS)
    }
  } catch (error) {
    console.warn('⚠️ Using simulated data:', error.message)
    realSecureScore = SECURE_SCORE
    realIncidents = STATIC_INCIDENTS
  }

  render(el)
}

function render(el) {
  const critCount = realIncidents.filter(i => i.severity === 'critical').length
  const highCount = realIncidents.filter(i => i.severity === 'high' && i.status !== 'resolved').length
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

    <!-- Internal sub-navigation -->
    <div class="sec-subnav" id="sec-subnav">
      ${SEC_TABS.map(t => `
        <button class="sec-tab-btn ${activeSection === t.id ? 'active' : ''}" data-sec="${t.id}">
          <i class="ti ${t.icon}"></i><span>${t.label}</span>
          ${t.id === 'incidents' && critCount > 0 ? `<span class="sec-tab-badge red">${critCount}</span>` : ''}
          ${t.id === 'recommendations' ? `<span class="sec-tab-badge amber">${openRec}</span>` : ''}
          ${t.id === 'identity' && IDENTITY.highRiskUsers > 0 ? `<span class="sec-tab-badge red">${IDENTITY.highRiskUsers}</span>` : ''}
        </button>
      `).join('')}
    </div>

    <!-- Section content -->
    <div id="sec-content" style="margin-top:16px">${renderSection()}</div>
  `

  el.querySelectorAll('.sec-tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      activeSection = btn.dataset.sec
      render(el)
      el.querySelector('#sec-subnav')?.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
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
  const ss = realSecureScore || SECURE_SCORE
  const pct = ss.percentOf100
  const ssColor = pct >= 80 ? 'success' : pct >= 60 ? 'warning' : 'danger'
  const critical = realIncidents.filter(i => i.severity === 'critical' && i.status !== 'resolved').length

  return `
    <div class="kpi-tile sec-kpi-primary" style="min-width:160px">
      <div style="display:flex;align-items:center;gap:12px">
        ${scoreGauge(ss.current, ss.max, 52)}
        <div>
          <div class="kpi-value ${ssColor}" style="font-size:24px">${ss.current}<span style="font-size:12px;font-weight:500;color:var(--color-text-tertiary)">/${ss.max}</span></div>
          <div class="kpi-label">Secure Score</div>
          <div style="font-size:10px;margin-top:3px;color:${ss.delta7d >= 0 ? 'var(--clr-success-text)' : 'var(--clr-danger-text)'}">
            ${ss.delta7d >= 0 ? '+' : ''}${ss.delta7d} this week
          </div>
        </div>
      </div>
    </div>
    <div class="kpi-tile">
      <div class="kpi-value ${critical > 0 ? 'danger' : 'success'}">${critical > 0 ? critical : '✓'}</div>
      <div class="kpi-label">Critical Incidents</div>
      <div style="font-size:10px;margin-top:3px;color:var(--color-text-tertiary)">${realIncidents.filter(i => i.status !== 'resolved').length} open total</div>
    </div>
    <div class="kpi-tile">
      <div class="kpi-value ${IDENTITY.highRiskUsers > 0 ? 'danger' : 'success'}">${IDENTITY.highRiskUsers}</div>
      <div class="kpi-label">High-Risk Users</div>
      <div style="font-size:10px;margin-top:3px;color:var(--color-text-tertiary)">${IDENTITY.riskySignIns30d} risky sign-ins (30d)</div>
    </div>
    <div class="kpi-tile">
      <div class="kpi-value ${ENDPOINT.vulnerable > 0 ? 'danger' : 'success'}">${ENDPOINT.vulnerable}</div>
      <div class="kpi-label">Vulnerable Devices</div>
      <div style="font-size:10px;margin-top:3px;color:var(--color-text-tertiary)">${ENDPOINT.nonCompliant} non-compliant</div>
    </div>
    <div class="kpi-tile">
      <div class="kpi-value warning">${RECOMMENDATIONS.filter(r => r.priority === 'critical' || r.priority === 'high').length}</div>
      <div class="kpi-label">Top Recommendations</div>
      <div style="font-size:10px;margin-top:3px;color:var(--clr-warning-text)">+${RECOMMENDATIONS.reduce((s, r) => s + r.scoreGain, 0)} pts potential</div>
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
  const ss = SECURE_SCORE
  return `
    <!-- Secondary KPI row -->
    <div class="kpi-row mb-3">
      <div class="kpi-tile">
        <div class="kpi-value warning">${IDENTITY.identitySecureScore}</div>
        <div class="kpi-label">Identity Score</div>
      </div>
      <div class="kpi-tile">
        <div class="kpi-value warning">${DATA_PROTECTION.complianceScore}</div>
        <div class="kpi-label">Compliance Score</div>
      </div>
      <div class="kpi-tile">
        <div class="kpi-value ${IDENTITY.mfaEnabled / IDENTITY.totalUsers >= 0.95 ? 'success' : 'warning'}">${Math.round(IDENTITY.mfaEnabled / IDENTITY.totalUsers * 100)}%</div>
        <div class="kpi-label">MFA Adoption</div>
      </div>
      <div class="kpi-tile">
        <div class="kpi-value info">${IDENTITY.riskySignIns30d}</div>
        <div class="kpi-label">Risky Sign-ins (30d)</div>
      </div>
      <div class="kpi-tile">
        <div class="kpi-value ${ENDPOINT.nonCompliant === 0 ? 'success' : 'warning'}">${ENDPOINT.nonCompliant}</div>
        <div class="kpi-label">Non-Compliant Devices</div>
      </div>
      <div class="kpi-tile">
        <div class="kpi-value ${GUEST_GOVERNANCE.dormantGuests90d > 10 ? 'warning' : 'success'}">${GUEST_GOVERNANCE.dormantGuests90d}</div>
        <div class="kpi-label">Dormant Guests</div>
      </div>
    </div>

    <div class="grid-2 mb-3" style="gap:16px">
      <!-- Score trend + category breakdown -->
      <div class="card">
        <div class="card-header">
          <span class="card-title"><i class="ti ti-trending-up"></i> Secure Score Trend</span>
          <div style="display:flex;gap:4px">
            <button class="btn btn-xs ${trendRange === '7d' ? 'btn-primary' : ''}" data-trend="7d">7d</button>
            <button class="btn btn-xs ${trendRange === '30d' ? 'btn-primary' : ''}" data-trend="30d">30d</button>
          </div>
        </div>
        <div style="display:flex;align-items:flex-end;gap:16px;margin-bottom:16px">
          ${scoreGauge(ss.current, ss.max, 80)}
          <div>
            <div style="font-size:26px;font-weight:800;color:var(--clr-warning-text)">${ss.current}<span style="font-size:13px;font-weight:500;color:var(--color-text-tertiary)"> / ${ss.max}</span></div>
            <div style="font-size:11px;color:var(--color-text-secondary);margin-bottom:6px">Industry avg: ${ss.avgComparable}/100 — you are +${ss.current - ss.avgComparable} above</div>
            <div style="display:flex;gap:12px;font-size:10px">
              <span style="color:${ss.delta7d >= 0 ? 'var(--clr-success-text)' : 'var(--clr-danger-text)'}">${ss.delta7d >= 0 ? '▲' : '▼'}${Math.abs(ss.delta7d)} this week</span>
              <span style="color:${ss.delta30d >= 0 ? 'var(--clr-success-text)' : 'var(--clr-danger-text)'}">${ss.delta30d >= 0 ? '▲' : '▼'}${Math.abs(ss.delta30d)} this month</span>
            </div>
          </div>
        </div>
        <div style="margin-bottom:12px" id="exec-trend-chart">
          ${trendBars(trendRange === '30d' ? ss.trend30d : ss.trend7d, 32)}
        </div>
        <div class="section-heading">Category breakdown</div>
        ${ss.categories.map(c => `
          <div class="score-bar-row" style="margin-bottom:6px">
            <span class="score-label" style="display:flex;align-items:center;gap:5px;min-width:120px">
              <i class="ti ${c.icon}" style="color:${c.color};font-size:12px"></i>${c.name}
            </span>
            <div class="score-bar" style="flex:1">
              <div class="score-bar-fill" style="width:${c.score}%;background:${c.color}"></div>
            </div>
            <span class="score-pct" style="color:${c.color}">${c.score}%</span>
          </div>
        `).join('')}
      </div>

      <!-- Service security grid -->
      <div class="card">
        <div class="card-header">
          <span class="card-title"><i class="ti ti-layout-grid"></i> Service Security Posture</span>
        </div>
        <div class="sec-svc-grid">
          ${[
            { name: 'Identity',    icon: 'ti-user-check',        score: 68, color: '#0C447C', bg:'#E6F1FB', issues: IDENTITY.highRiskUsers },
            { name: 'Email',       icon: 'ti-mail',               score: 71, color: '#854F0B', bg:'#FAEEDA', issues: EMAIL.externalForwardingRules + (EMAIL.dmarc !== 'reject' ? 1 : 0) },
            { name: 'Endpoint',    icon: 'ti-device-laptop',      score: 58, color: '#3B6D11', bg:'#EAF3DE', issues: ENDPOINT.vulnerable },
            { name: 'Teams',       icon: 'ti-brand-teams',        score: 74, color: '#3C3489', bg:'#EEEDFE', issues: TEAMS_SEC.publicTeams },
            { name: 'SharePoint',  icon: 'ti-brand-sharepoint',   score: 66, color: '#3B6D11', bg:'#EAF3DE', issues: SHAREPOINT_SEC.anonymousLinks },
            { name: 'Data',        icon: 'ti-database',           score: 61, color: '#3C3489', bg:'#EEEDFE', issues: DATA_PROTECTION.dlpViolations30d },
            { name: 'Priv Access', icon: 'ti-crown',              score: 78, color: '#854F0B', bg:'#FAEEDA', issues: PRIV_ACCESS.permanentAssignments },
            { name: 'Guests',      icon: 'ti-user-plus',          score: 72, color: '#633806', bg:'#FAEEDA', issues: GUEST_GOVERNANCE.dormantGuests90d },
          ].map(s => {
            const cls = s.score >= 80 ? 'success' : s.score >= 65 ? 'warning' : 'danger'
            return `<div class="sec-svc-tile" data-goto="${s.name.toLowerCase().replace(' ','').replace('.','')}" style="cursor:pointer">
              ${scoreGauge(s.score, 100, 40)}
              <div style="flex:1;min-width:0">
                <div style="display:flex;align-items:center;gap:6px">
                  <div style="width:22px;height:22px;border-radius:5px;background:${s.bg};color:${s.color};display:flex;align-items:center;justify-content:center;font-size:11px;flex-shrink:0"><i class="ti ${s.icon}"></i></div>
                  <span style="font-size:11px;font-weight:600">${s.name}</span>
                </div>
                ${s.issues > 0 ? `<div style="font-size:9px;color:var(--clr-warning-text);margin-top:2px">${s.issues} issue${s.issues > 1 ? 's' : ''}</div>` : `<div style="font-size:9px;color:var(--clr-success-text);margin-top:2px">No issues</div>`}
              </div>
            </div>`
          }).join('')}
        </div>
      </div>
    </div>

    <!-- Incidents summary + Top recommendations -->
    <div class="grid-2" style="gap:16px">
      <div class="card">
        <div class="card-header">
          <span class="card-title"><i class="ti ti-alert-triangle"></i> Active Incidents</span>
          <button class="btn btn-xs btn-primary" id="exec-view-incidents">View all</button>
        </div>
        ${realIncidents.filter(i => i.status !== 'resolved').slice(0, 4).map(inc => `
          <div style="display:flex;align-items:center;gap:8px;padding:7px 0;border-bottom:0.5px solid var(--color-border-tertiary)">
            <span class="badge ${inc.severity === 'critical' ? 'danger' : inc.severity === 'high' ? 'danger' : 'warning'}" style="flex-shrink:0;min-width:56px;justify-content:center">${inc.severity}</span>
            <div style="flex:1;min-width:0">
              <div style="font-size:11px;font-weight:600;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${inc.title}</div>
              <div style="font-size:9px;color:var(--color-text-tertiary)">${inc.id} · ${inc.category} · ${inc.created}</div>
            </div>
          </div>
        `).join('')}
        <div style="margin-top:10px;padding:8px 10px;background:var(--clr-danger-bg);border-radius:var(--border-radius-md);font-size:11px;color:var(--clr-danger-text);line-height:1.5">
          <i class="ti ti-robot"></i> <strong>AI Summary:</strong>
          ${realIncidents.filter(i => i.severity === 'critical').length} critical incident${realIncidents.filter(i => i.severity === 'critical').length !== 1 ? 's' : ''} detected.
          Ransomware indicators found on MBX-LAPTOP-047 — isolate device immediately.
          3 high-severity incidents include BEC attempt and risky sign-ins from unfamiliar locations.
        </div>
      </div>

      <div class="card">
        <div class="card-header">
          <span class="card-title"><i class="ti ti-checklist"></i> Top Recommendations</span>
          <button class="btn btn-xs btn-primary" id="exec-view-recs">View all</button>
        </div>
        ${RECOMMENDATIONS.filter(r => r.priority === 'critical' || r.priority === 'high').slice(0, 5).map(r => `
          <div style="display:flex;align-items:center;gap:8px;padding:6px 0;border-bottom:0.5px solid var(--color-border-tertiary)">
            <span class="badge ${r.priority === 'critical' ? 'danger' : 'warning'}" style="flex-shrink:0;font-size:9px">${r.priority}</span>
            <span style="flex:1;font-size:11px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${r.title}</span>
            <span class="badge success" style="flex-shrink:0;font-size:9px">+${r.scoreGain}pts</span>
          </div>
        `).join('')}
      </div>
    </div>
  `
}

// ============================================================
// SECURE SCORE
// ============================================================
function renderSecureScore() {
  const ss = SECURE_SCORE
  return `
    <div class="grid-2 mb-3" style="gap:16px">
      <div class="card">
        <div class="card-title mb-3"><i class="ti ti-shield-check"></i> Microsoft Secure Score</div>
        <div style="display:flex;align-items:center;gap:24px;margin-bottom:20px">
          ${scoreGauge(ss.current, ss.max, 100)}
          <div>
            <div style="font-size:32px;font-weight:800;color:var(--clr-warning-text);line-height:1">${ss.current}</div>
            <div style="font-size:16px;color:var(--color-text-tertiary)">out of ${ss.max}</div>
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
        ${ss.categories.map(c => `
          <div style="margin-bottom:14px">
            <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:5px">
              <span style="font-size:12px;font-weight:600;display:flex;align-items:center;gap:6px">
                <i class="ti ${c.icon}" style="color:${c.color}"></i>${c.name}
              </span>
              <span style="font-size:12px;font-weight:700;color:${c.color}">${c.score}%</span>
            </div>
            <div class="score-bar" style="height:10px">
              <div class="score-bar-fill" style="width:${c.score}%;background:${c.color}"></div>
            </div>
            <div style="font-size:10px;color:var(--color-text-tertiary);margin-top:3px">${c.score >= 80 ? '✅ Good' : c.score >= 65 ? '⚠️ Needs attention' : '🔴 Needs improvement'}</div>
          </div>
        `).join('')}
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
              <td><span class="badge ${r.priority === 'critical' ? 'danger' : r.priority === 'high' ? 'warning' : r.priority === 'medium' ? 'info' : 'neutral'}">${r.priority}</span></td>
              <td style="font-size:11px;font-weight:500">${r.title}</td>
              <td><span class="pill">${r.category}</span></td>
              <td><span class="badge success">+${r.scoreGain}</span></td>
              <td><span class="badge neutral">${r.effort}</span></td>
              <td><span class="badge ${r.status === 'open' ? 'warning' : 'info'}">${r.status}</span></td>
              <td><button class="btn btn-xs"><i class="ti ti-arrow-right"></i></button></td>
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
  const id = IDENTITY
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
  `
}

// ============================================================
// EMAIL SECURITY
// ============================================================
function renderEmail() {
  const e = EMAIL
  return `
    <div class="kpi-row mb-3">
      <div class="kpi-tile"><div class="kpi-value danger">${e.phishingAttempts30d.toLocaleString()}</div><div class="kpi-label">Phishing Blocked (30d)</div></div>
      <div class="kpi-tile"><div class="kpi-value warning">${e.malwareDetected30d}</div><div class="kpi-label">Malware Detected</div></div>
      <div class="kpi-tile"><div class="kpi-value danger">${e.becAttempts30d}</div><div class="kpi-label">BEC Attempts</div></div>
      <div class="kpi-tile"><div class="kpi-value warning">${e.spoofedDomainActivity30d}</div><div class="kpi-label">Spoofed Domain</div></div>
      <div class="kpi-tile"><div class="kpi-value info">${e.quarantined30d.toLocaleString()}</div><div class="kpi-label">Quarantined</div></div>
    </div>

    <div class="grid-2 mb-3" style="gap:16px">
      <div class="card">
        <div class="card-title mb-3"><i class="ti ti-shield-check"></i> Email Authentication Status</div>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px">
          ${[
            { label: 'SPF Record',          ok: e.spf === 'pass',        note: e.spf === 'pass' ? 'Configured — v=spf1 include:protection.outlook.com -all' : 'Missing or misconfigured' },
            { label: 'DKIM Signing',         ok: e.dkim === 'pass',       note: e.dkim === 'pass' ? 'Enabled for contoso.com' : 'Not configured' },
            { label: 'DMARC Policy',         ok: e.dmarc === 'reject' ? 'pass' : e.dmarc === 'quarantine' ? 'warn' : false, note: `Policy: ${e.dmarc} — ${e.dmarc !== 'reject' ? 'upgrade to reject for full protection' : 'optimal'}` },
            { label: 'Safe Links',           ok: e.safeLinks === 'enabled',note: e.safeLinks === 'enabled' ? 'Active for all users' : 'Disabled' },
            { label: 'Safe Attachments',     ok: e.safeAttachments === 'enabled' ? 'pass' : 'warn', note: e.safeAttachments === 'partial' ? 'Partial — not all users covered' : e.safeAttachments },
            { label: 'Anti-spam Policy',     ok: e.antiSpamPolicy === 'strict' ? 'pass' : 'warn', note: `Level: ${e.antiSpamPolicy} — recommend strict` },
          ].map(item => `
            <div style="padding:10px;background:var(--color-background-secondary);border-radius:var(--border-radius-md);border:0.5px solid var(--color-border-tertiary)">
              <div style="font-size:10px;font-weight:700;color:var(--color-text-tertiary);text-transform:uppercase;margin-bottom:5px">${item.label}</div>
              <div style="font-size:12px;font-weight:600;margin-bottom:3px">${statusIcon(item.ok, item.ok === 'pass' || item.ok === true ? 'Pass' : item.ok === 'warn' ? 'Warning' : 'Fail')}</div>
              <div style="font-size:10px;color:var(--color-text-tertiary);line-height:1.3">${item.note}</div>
            </div>
          `).join('')}
        </div>
      </div>

      <div class="card">
        <div class="card-title mb-3"><i class="ti ti-mail-forward"></i> Mail Flow Security</div>
        <div class="alert-banner ${e.externalForwardingRules > 0 ? 'danger' : 'success'} mb-3">
          <i class="ti ti-${e.externalForwardingRules > 0 ? 'alert-triangle' : 'circle-check'}"></i>
          ${e.externalForwardingRules > 0 ? `${e.externalForwardingRules} mailboxes have active external forwarding rules — potential data exfiltration risk.` : 'No external forwarding rules detected.'}
        </div>
        ${metricGrid([
          { label: 'External Forwarding Rules', val: e.externalForwardingRules, cls: e.externalForwardingRules === 0 ? 'success' : 'danger' },
          { label: 'Suspicious Inbox Rules',    val: e.suspiciousInboxRules, cls: e.suspiciousInboxRules === 0 ? 'success' : 'danger' },
          { label: 'Shared Mailboxes',          val: e.sharedMailboxExposed, cls: 'info' },
        ])}
        ${recBox([
          'Enable Strict Preset Security Policies in Defender for Office 365',
          'Disable automatic external mail forwarding tenant-wide',
          'Upgrade DMARC policy from quarantine to reject',
          'Extend Safe Attachments coverage to all users (currently partial)',
        ])}
      </div>
    </div>
  `
}

// ============================================================
// ENDPOINT SECURITY
// ============================================================
function renderEndpoint() {
  const ep = ENDPOINT
  return `
    <div class="kpi-row mb-3">
      <div class="kpi-tile"><div class="kpi-value info">${ep.totalManaged}</div><div class="kpi-label">Managed Devices</div></div>
      <div class="kpi-tile"><div class="kpi-value ${ep.nonCompliant === 0 ? 'success' : 'warning'}">${ep.nonCompliant}</div><div class="kpi-label">Non-Compliant</div></div>
      <div class="kpi-tile"><div class="kpi-value ${ep.vulnerable === 0 ? 'success' : 'danger'}">${ep.vulnerable}</div><div class="kpi-label">Vulnerable</div></div>
      <div class="kpi-tile"><div class="kpi-value danger">${ep.ransomwareIndicators}</div><div class="kpi-label">Ransomware Indicators</div></div>
      <div class="kpi-tile"><div class="kpi-value warning">${ep.missingCriticalPatches}</div><div class="kpi-label">Missing Patches</div></div>
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
        <div class="alert-banner danger mb-3">
          <i class="ti ti-virus"></i>
          <strong>Ransomware indicators detected on MBX-LAPTOP-047.</strong> INC-2341 is active — isolate device immediately.
        </div>
        ${metricGrid([
          { label: 'Active Threats',        val: ep.activeThreats,        cls: ep.activeThreats === 0 ? 'success' : 'danger' },
          { label: 'High Severity Alerts',  val: ep.highSeverityAlerts,   cls: 'danger' },
          { label: 'Windows 11 (%)',        val: ep.windows11Pct + '%',   cls: 'success' },
          { label: 'Windows 10 (%)',        val: ep.windows10Pct + '%',   cls: 'warning' },
        ])}
        ${recBox(['Patch 23 devices missing critical security updates', 'Isolate ransomware-affected device MBX-LAPTOP-047', 'Enable BitLocker on remaining 36 unencrypted devices', 'Harden SMB and RDP access on Windows 10 devices'])}
      </div>
    </div>
  `
}

// ============================================================
// TEAMS SECURITY
// ============================================================
function renderTeams() {
  const t = TEAMS_SEC
  return `
    <div class="kpi-row mb-3">
      <div class="kpi-tile"><div class="kpi-value info">${t.totalTeams}</div><div class="kpi-label">Total Teams</div></div>
      <div class="kpi-tile"><div class="kpi-value ${t.publicTeams > 5 ? 'warning' : 'success'}">${t.publicTeams}</div><div class="kpi-label">Public Teams</div></div>
      <div class="kpi-tile"><div class="kpi-value warning">${t.guestEnabledTeams}</div><div class="kpi-label">Guest Enabled</div></div>
      <div class="kpi-tile"><div class="kpi-value warning">${t.inactiveTeams90d}</div><div class="kpi-label">Inactive (90d+)</div></div>
      <div class="kpi-tile"><div class="kpi-value success">${t.anonymousMeetingAccess ? '⚠️ On' : '✓ Off'}</div><div class="kpi-label">Anon Meeting</div></div>
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
          'Archive 23 inactive Teams (90d+) to reduce sprawl and exposure',
          'Assign owners to 5 unowned Teams',
          'Conduct guest access review for 34 guest-enabled Teams',
          'Review 8 public Teams — consider making private',
          'Restrict external domains to known partners only',
        ])}
      </div>
    </div>
  `
}

// ============================================================
// SHAREPOINT SECURITY
// ============================================================
function renderSharepoint() {
  const s = SHAREPOINT_SEC
  return `
    <div class="kpi-row mb-3">
      <div class="kpi-tile"><div class="kpi-value info">${s.totalSites}</div><div class="kpi-label">Total Sites</div></div>
      <div class="kpi-tile"><div class="kpi-value ${s.externallyShared > 10 ? 'warning' : 'success'}">${s.externallyShared}</div><div class="kpi-label">Externally Shared</div></div>
      <div class="kpi-tile"><div class="kpi-value ${s.anonymousLinks > 0 ? 'danger' : 'success'}">${s.anonymousLinks}</div><div class="kpi-label">Anonymous Links</div></div>
      <div class="kpi-tile"><div class="kpi-value warning">${s.sensitiveFiles}</div><div class="kpi-label">Sensitive Files Flagged</div></div>
      <div class="kpi-tile"><div class="kpi-value warning">${s.oversharedSites}</div><div class="kpi-label">Overshared Sites</div></div>
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
          'Remove 3 anonymous sharing links — replace with authenticated sharing',
          'Review 5 overshared sites with > 100 members',
          'Enable sensitivity labels for automatic file classification',
          'Restrict external sharing to "Existing guests only" on high-risk sites',
          'Configure DLP policy for SharePoint to reach 100% coverage',
        ])}
      </div>
    </div>
  `
}

// ============================================================
// DATA PROTECTION
// ============================================================
function renderDataProtection() {
  const d = DATA_PROTECTION
  return `
    <div class="kpi-row mb-3">
      <div class="kpi-tile"><div class="kpi-value warning">${d.sensitivityLabelsApplied}%</div><div class="kpi-label">Labels Applied</div></div>
      <div class="kpi-tile"><div class="kpi-value danger">${d.dlpViolations30d}</div><div class="kpi-label">DLP Violations (30d)</div></div>
      <div class="kpi-tile"><div class="kpi-value danger">${d.dataExfiltration30d}</div><div class="kpi-label">Exfiltration Events</div></div>
      <div class="kpi-tile"><div class="kpi-value warning">${d.usbTransfers30d}</div><div class="kpi-label">USB Transfers</div></div>
      <div class="kpi-tile"><div class="kpi-value info">${d.complianceScore}</div><div class="kpi-label">Compliance Score</div></div>
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
          'Enable sensitivity auto-labeling for ~18,000 unlabeled Office files',
          'Extend DLP policy coverage to include Teams messages',
          'Configure insider risk policy for data exfiltration patterns',
          'Review 3 USB transfer events — check device compliance policy',
          'Expand retention policies to cover Teams chat and OneDrive',
        ])}
        <div class="alert-banner info mt-3" style="margin-bottom:0"><i class="ti ti-api"></i><code style="font-size:9px">Get-DlpCompliancePolicy | Get-Label | Get-RetentionCompliancePolicy</code></div>
      </div>
    </div>
  `
}

// ============================================================
// PRIVILEGED ACCESS
// ============================================================
function renderPrivAccess() {
  const p = PRIV_ACCESS
  return `
    <div class="kpi-row mb-3">
      <div class="kpi-tile"><div class="kpi-value info">${p.globalAdminCount}</div><div class="kpi-label">Global Admins</div></div>
      <div class="kpi-tile"><div class="kpi-value info">${p.securityAdminCount}</div><div class="kpi-label">Security Admins</div></div>
      <div class="kpi-tile"><div class="kpi-value ${p.permanentAssignments > 2 ? 'danger' : 'success'}">${p.permanentAssignments}</div><div class="kpi-label">Permanent Roles</div></div>
      <div class="kpi-tile"><div class="kpi-value success">${p.pimAdoption}%</div><div class="kpi-label">PIM Adoption</div></div>
      <div class="kpi-tile"><div class="kpi-value ${p.newAdmins30d > 0 ? 'warning' : 'success'}">${p.newAdmins30d}</div><div class="kpi-label">New Admins (30d)</div></div>
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
        ${recBox(['Convert 4 permanent admin role assignments to PIM eligible', 'Implement Just-in-Time access for all privileged roles', 'Conduct quarterly access review for all admin role holders', 'Enable PIM access review notifications for approvers'])}
        <div class="alert-banner info mt-3" style="margin-bottom:0"><i class="ti ti-api"></i><code style="font-size:9px">GET /beta/roleManagement/directory/roleEligibilitySchedules</code></div>
      </div>
    </div>
  `
}

// ============================================================
// GUEST GOVERNANCE
// ============================================================
function renderGuests() {
  const g = GUEST_GOVERNANCE
  return `
    <div class="kpi-row mb-3">
      <div class="kpi-tile"><div class="kpi-value info">${g.totalGuests}</div><div class="kpi-label">Total Guests</div></div>
      <div class="kpi-tile"><div class="kpi-value ${g.dormantGuests90d > 5 ? 'danger' : 'success'}">${g.dormantGuests90d}</div><div class="kpi-label">Dormant (90d+)</div></div>
      <div class="kpi-tile"><div class="kpi-value danger">${g.expiredGuests}</div><div class="kpi-label">Expired</div></div>
      <div class="kpi-tile"><div class="kpi-value success">${g.guestsWithPrivAccess}</div><div class="kpi-label">With Priv. Access</div></div>
      <div class="kpi-tile"><div class="kpi-value warning">${g.quarterlyReviewOverdue}</div><div class="kpi-label">Review Overdue</div></div>
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
          'Remove 3 expired guest accounts immediately',
          'Review and remove 12 dormant guests (90d+ no sign-in)',
          'Schedule overdue quarterly access review for 14 guests',
          'Require manager attestation for all guest renewals',
          'Implement automatic expiry policy (365 days max)',
        ])}
      </div>
    </div>
  `
}

// ============================================================
// realIncidents & THREATS
// ============================================================
function renderIncidents() {
  const active = realIncidents.filter(i => i.status !== 'resolved')
  const resolved = realIncidents.filter(i => i.status === 'resolved')
  const critical = realIncidents.filter(i => i.severity === 'critical').length
  const high = realIncidents.filter(i => i.severity === 'high').length
  const med = realIncidents.filter(i => i.severity === 'medium').length
  const low = realIncidents.filter(i => i.severity === 'low').length

  return `
    <div class="kpi-row mb-3">
      <div class="kpi-tile"><div class="kpi-value ${critical > 0 ? 'danger' : 'success'}">${critical}</div><div class="kpi-label">Critical</div></div>
      <div class="kpi-tile"><div class="kpi-value ${high > 0 ? 'danger' : 'success'}">${high}</div><div class="kpi-label">High</div></div>
      <div class="kpi-tile"><div class="kpi-value warning">${med}</div><div class="kpi-label">Medium</div></div>
      <div class="kpi-tile"><div class="kpi-value info">${low}</div><div class="kpi-label">Low</div></div>
      <div class="kpi-tile"><div class="kpi-value success">${resolved.length}</div><div class="kpi-label">Resolved (7d)</div></div>
    </div>

    <div class="alert-banner danger mb-3">
      <i class="ti ti-robot"></i>
      <div>
        <strong>AI Security Summary:</strong> ${critical} critical incident detected involving ransomware indicators on a managed endpoint.
        ${high} high-severity incidents include a BEC (business email compromise) attempt and risky identity sign-ins from unfamiliar locations.
        Immediate actions: isolate MBX-LAPTOP-047, force password reset for kevin.osei@contoso.com, and remediate suspicious inbox forwarding rule.
      </div>
    </div>

    <div class="section-heading mb-2">Active Incidents</div>
    ${active.map(inc => `
      <div class="card mb-2" style="border-left:3px solid ${inc.severity === 'critical' ? 'var(--clr-danger-text)' : inc.severity === 'high' ? 'var(--clr-danger-text)' : 'var(--clr-warning-text)'}">
        <div style="display:flex;align-items:flex-start;gap:12px">
          <div>
            <div style="display:flex;gap:6px;align-items:center;flex-wrap:wrap;margin-bottom:6px">
              <span class="monospace" style="font-size:10px;color:var(--color-text-tertiary)">${inc.id}</span>
              <span class="badge ${inc.severity === 'critical' ? 'danger' : inc.severity === 'high' ? 'danger' : 'warning'}">${inc.severity}</span>
              <span class="badge neutral">${inc.category}</span>
              <span class="badge ${inc.status === 'active' ? 'danger' : inc.status === 'investigating' ? 'warning' : 'info'} dot">${inc.status}</span>
            </div>
            <div style="font-size:12px;font-weight:700;margin-bottom:4px">${inc.title}</div>
            <div style="font-size:10px;color:var(--color-text-tertiary)">
              Assignee: ${inc.assignee} · Services: ${inc.services.join(', ')} · Created: ${inc.created}
            </div>
          </div>
          <div style="margin-left:auto;display:flex;gap:6px;flex-shrink:0">
            <button class="btn btn-xs btn-danger">Investigate</button>
            <button class="btn btn-xs">Assign</button>
          </div>
        </div>
      </div>
    `).join('')}

    ${resolved.length > 0 ? `
      <div class="section-heading mb-2" style="margin-top:16px">Recently Resolved</div>
      ${resolved.map(inc => `
        <div class="card mb-2" style="opacity:0.65">
          <div style="display:flex;align-items:center;gap:10px">
            <span class="monospace" style="font-size:10px;color:var(--color-text-tertiary)">${inc.id}</span>
            <span class="badge neutral">${inc.severity}</span>
            <span style="flex:1;font-size:11px">${inc.title}</span>
            <span class="badge success dot">Resolved</span>
            <span style="font-size:10px;color:var(--color-text-tertiary)">${inc.created}</span>
          </div>
        </div>
      `).join('')}
    ` : ''}
  `
}

// ============================================================
// RECOMMENDATIONS
// ============================================================
function renderRecommendations() {
  const filtered = RECOMMENDATIONS.filter(r => {
    if (recFilter.priority !== 'all' && r.priority !== recFilter.priority) return false
    if (recFilter.category !== 'all' && r.category !== recFilter.category) return false
    if (recFilter.status !== 'all' && r.status !== recFilter.status) return false
    return true
  })
  const totalGain = filtered.reduce((s, r) => s + r.scoreGain, 0)

  const cats = [...new Set(RECOMMENDATIONS.map(r => r.category))]

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
      text: `**M365 Security Copilot** — I have full context of your security posture across all 15 data sources.\n\nCurrent tenant: **Contoso.com** · Secure Score: **64/95** · ${realIncidents.filter(i => i.status !== 'resolved').length} active incidents\n\nAsk me anything about your security posture, specific risks, or recommended actions.`
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
