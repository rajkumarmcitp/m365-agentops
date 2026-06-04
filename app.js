import { USERS } from './data/users.js'
import { renderHeader } from './components/header.js'
import { renderNav } from './components/nav.js'
import { showToast } from './components/toast.js'
import { initMSAL, loginWithMicrosoft, getCurrentUser, logout } from './lib/auth.js'
import { initDashboard } from './pages/dashboard.js'
import { initRequests } from './pages/requests.js'
import { initSecurity } from './pages/security.js'
import { initZeroTrust } from './pages/zerotrust.js'
import { initM365Config } from './pages/m365config.js'
import { initPrivAccts } from './pages/privaccts.js'
import { initLicenses } from './pages/licenses.js'
import { initAgents } from './pages/agents.js'
import { initApprovals } from './pages/approvals.js'
import { initPortal } from './pages/portal.js'
import { initMyReqs } from './pages/myreqs.js'
import { initChat } from './pages/chat.js'
import { initGraphApi } from './pages/graphapi.js'
import { initSso } from './pages/sso.js'
import { initAudit } from './pages/audit.js'
import { initSettings } from './pages/settings.js'
import { initMsgCenter } from './pages/msgcenter.js'
import { initApplications } from './pages/applications.js'
import { initIntune } from './pages/intune.js'

// ============================================================
// Global application state
// ============================================================
export const state = {
  currentUser: null,
  currentPage: 'dashboard',
  settings: {
    showPSCommands: true,
    showTenantResult: true,
    autoExpandFailed: true,
    showGraphHealth: true,
    showZeroTrustScore: true,
    showM365ConfigScore: true,
    agentSchedule: 'daily-0800',
    agentAlertEmail: 'security@contoso.com',
    agentAlertOnFail: true,
    agentDailyDigest: true,
    // Portal services — master switch + per-service toggles
    portalEnabled: true,
    portal_exchange: true,
    portal_teams: true,
    portal_sharepoint: true,
    portal_onedrive: true,
    portal_ext_sharing: true,
    portal_user_access: true,
    portal_licenses: true,
    portal_copilot: true,
    portal_power_platform: true,
    portal_intune: true,
    portal_guest_lifecycle: true,
    // Exchange sub-service toggles
    portal_exchange_groups: true,
    portal_shared_mailbox: true,
    portal_room_equipment: true,
    portal_email_services: true,
  },
  cfgAttested: {},
  cfgAgentLog: [],
  mcMessages: null,
}

const DEFAULTS = {
  showPSCommands: true,
  showTenantResult: true,
  autoExpandFailed: true,
  showGraphHealth: true,
  showZeroTrustScore: true,
  showM365ConfigScore: true,
  portalEnabled: true,
  portal_exchange: true, portal_teams: true, portal_sharepoint: true, portal_onedrive: true,
  portal_ext_sharing: true, portal_user_access: true, portal_licenses: true, portal_copilot: true,
  portal_power_platform: true, portal_intune: true, portal_guest_lifecycle: true,
  portal_exchange_groups: true, portal_shared_mailbox: true, portal_room_equipment: true, portal_email_services: true,
  agentSchedule: 'daily-0800',
  agentAlertEmail: 'security@contoso.com',
  agentAlertOnFail: true,
  agentDailyDigest: true,
}

export function saveState() {
  localStorage.setItem('m365ops_settings', JSON.stringify(state.settings))
  localStorage.setItem('m365ops_attested', JSON.stringify(state.cfgAttested))
  localStorage.setItem('m365ops_agentlog', JSON.stringify(state.cfgAgentLog))
}

function loadState() {
  try {
    const s = localStorage.getItem('m365ops_settings')
    if (s) Object.assign(state.settings, JSON.parse(s))
    const a = localStorage.getItem('m365ops_attested')
    if (a) state.cfgAttested = JSON.parse(a)
    const l = localStorage.getItem('m365ops_agentlog')
    if (l) state.cfgAgentLog = JSON.parse(l)
  } catch (e) { /* ignore */ }
}

export function resetSettings() {
  Object.assign(state.settings, DEFAULTS)
  saveState()
}

// ============================================================
// RBAC helpers
// ============================================================
export function hasAccess(pageId) {
  if (!state.currentUser) return false
  return state.currentUser.navAccess.includes(pageId)
}

export function isRole(...roles) {
  return state.currentUser && roles.includes(state.currentUser.role)
}

// ============================================================
// Router
// ============================================================
const PAGE_INIT = {
  dashboard: initDashboard,
  msgcenter: initMsgCenter,
  applications: initApplications,
  intune: initIntune,
  requests: initRequests,
  security: initSecurity,
  zerotrust: initZeroTrust,
  m365config: initM365Config,
  privaccts: initPrivAccts,
  licenses: initLicenses,
  agents: initAgents,
  approvals: initApprovals,
  portal: initPortal,
  myreqs: initMyReqs,
  chat: initChat,
  graphapi: initGraphApi,
  sso: initSso,
  audit: initAudit,
  settings: initSettings,
}

export function go(pageId) {
  if (!hasAccess(pageId)) {
    showToast('You do not have access to that page.', 'error')
    return
  }

  state.currentPage = pageId

  // Show/hide pages
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'))
  const pg = document.getElementById('page-' + pageId)
  if (pg) pg.classList.add('active')

  // Update nav active state
  document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'))
  const ni = document.getElementById('n-' + pageId)
  if (ni) ni.classList.add('active')

  // Call init function
  if (PAGE_INIT[pageId]) PAGE_INIT[pageId]()
}

// ============================================================
// Login Screen
// ============================================================
async function renderLogin() {
  const app = document.getElementById('app')

  // Check if already authenticated via Entra ID
  const entraUser = await initMSAL()
  if (entraUser) {
    doLoginWithEntraID(entraUser)
    return
  }

  app.innerHTML = `
    <div id="login-screen">
      <div class="login-card">
        <div class="login-logo">
          <div class="login-logo-icon"><i class="ti ti-shield-bolt"></i></div>
          <div class="login-logo-text">
            <h1>M365 AgentOps</h1>
            <p>Enterprise Tenant Administration</p>
          </div>
        </div>

        <div style="margin-bottom:16px">
          <p style="font-size:11px;font-weight:600;color:var(--color-text-tertiary);margin-bottom:8px;text-transform:uppercase">Real Account</p>
          <button class="btn-ms" id="entra-login-btn" style="width:100%">
            <svg width="16" height="16" viewBox="0 0 21 21" fill="none"><rect width="10" height="10" fill="#F25022"/><rect x="11" width="10" height="10" fill="#7FBA00"/><rect y="11" width="10" height="10" fill="#00A4EF"/><rect x="11" y="11" width="10" height="10" fill="#FFB900"/></svg>
            Sign in with Microsoft Entra ID
          </button>
          <p style="font-size:9px;color:var(--color-text-tertiary);margin-top:6px">Use your Office 365 account for real M365 data</p>
        </div>

        <div class="login-divider">or Demo</div>

        <p style="font-size:11px;font-weight:600;color:var(--color-text-tertiary);margin-bottom:8px;text-transform:uppercase">Demo Account</p>
        <p style="font-size:11px;color:var(--color-text-secondary);margin-bottom:12px;">Test with simulated data:</p>
        <div class="user-tiles">
          ${USERS.map(u => `
            <div class="user-tile" data-user="${u.id}">
              <div class="user-avatar" style="background:${u.color}">${u.initials}</div>
              <div class="user-tile-info">
                <h4>${u.name}</h4>
                <p>${u.email}</p>
                <p style="margin-top:3px"><span class="role-badge ${u.role}">${u.role}</span></p>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    </div>
  `

  // Entra ID login
  document.getElementById('entra-login-btn').addEventListener('click', async () => {
    const btn = document.getElementById('entra-login-btn')
    btn.innerHTML = '<span class="spinner" style="margin-right:8px"></span> Signing in...'
    btn.disabled = true

    const account = await loginWithMicrosoft()
    if (account) {
      doLoginWithEntraID(account)
    } else {
      btn.innerHTML = `
        <svg width="16" height="16" viewBox="0 0 21 21" fill="none"><rect width="10" height="10" fill="#F25022"/><rect x="11" width="10" height="10" fill="#7FBA00"/><rect y="11" width="10" height="10" fill="#00A4EF"/><rect x="11" y="11" width="10" height="10" fill="#FFB900"/></svg>
        Sign in with Microsoft Entra ID
      `
      btn.disabled = false
      showToast('Login cancelled or failed. Try again or use demo account.', 'warning')
    }
  })

  // Demo user tile selection
  let selected = null
  document.querySelectorAll('.user-tile').forEach(tile => {
    tile.addEventListener('click', () => {
      document.querySelectorAll('.user-tile').forEach(t => t.classList.remove('selected'))
      tile.classList.add('selected')
      selected = tile.dataset.user
    })
    tile.addEventListener('dblclick', () => {
      doLogin(tile.dataset.user)
    })
  })
}

function doLogin(userId) {
  const user = USERS.find(u => u.id === userId)
  if (!user) return
  state.currentUser = user
  renderShell()
  const defaultPage = user.navAccess[0]
  go(defaultPage)
  showToast(`Welcome back, ${user.name}!`, 'success')
}

function doLoginWithEntraID(account) {
  // Create user object from Entra ID account
  const nameParts = (account.name || account.username).split(' ')
  const entraUser = {
    id: account.localAccountId,
    name: account.name || account.username,
    email: account.username,
    role: 'admin', // Default to admin for real users (Phase 3 will check Graph API for roles)
    initials: nameParts.map(n => n[0]).join('').toUpperCase(),
    color: '#0C447C',
    isEntraID: true,
    account: account,
    navAccess: [
      'dashboard', 'requests', 'security', 'zerotrust', 'privaccts',
      'm365config', 'licenses', 'agents', 'msgcenter', 'applications', 'intune',
      'portal', 'myreqs', 'chat',
      'audit', 'settings'
    ]
  }

  state.currentUser = entraUser
  renderShell()
  const defaultPage = entraUser.navAccess[0]
  go(defaultPage)
  showToast(`Welcome, ${entraUser.name}! Authenticated with Entra ID.`, 'success')
}

// ============================================================
// App Shell
// ============================================================
function renderShell() {
  const app = document.getElementById('app')
  app.innerHTML = `
    <div id="app-shell">
      <nav id="sidebar"></nav>
      <div id="main-content">
        <header id="app-header"></header>
        ${state.currentUser?.role === 'manager' ? `
          <div class="manager-alert-bar">
            <i class="ti ti-alert-triangle"></i>
            <strong>3 requests pending your approval</strong> — including 1 overdue.
            <a href="#" id="alert-approvals-link" style="margin-left:4px;text-decoration:underline;cursor:pointer;">Review now</a>
          </div>
        ` : ''}
        <div id="page-area">
          ${renderAllPages()}
        </div>
      </div>
    </div>
  `

  renderHeader()
  renderNav()

  if (state.currentUser?.role === 'manager') {
    const lnk = document.getElementById('alert-approvals-link')
    if (lnk) lnk.addEventListener('click', e => { e.preventDefault(); go('approvals') })
  }
}

function renderAllPages() {
  const pages = [
    'dashboard','requests','security','zerotrust','privaccts','m365config',
    'msgcenter','applications','intune','licenses','agents','approvals','portal','myreqs','chat',
    'graphapi','sso','audit','settings'
  ]
  return pages.map(p => `<div class="page" id="page-${p}"></div>`).join('')
}

// ============================================================
// Boot
// ============================================================
loadState()
renderLogin().catch(err => {
  console.error('Login render error:', err)
  renderLogin()
})
