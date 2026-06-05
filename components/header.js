import { state, go } from '../app.js'
import { logout } from '../lib/auth.js'

export function renderHeader() {
  const header = document.getElementById('app-header')
  const u = state.currentUser
  if (!u) return

  header.innerHTML = `
    <div class="header-brand">
      <div class="brand-icon"><i class="ti ti-shield-bolt"></i></div>
      <span>M365 AgentOps</span>
    </div>
    <div class="header-spacer"></div>
    <div class="header-actions">
      <button class="header-icon-btn" title="Notifications" id="hdr-bell">
        <i class="ti ti-bell"></i>
        <span class="bell-badge"></span>
      </button>
      <button class="header-icon-btn" title="Admin Settings" id="hdr-settings">
        <i class="ti ti-settings"></i>
      </button>
      <div class="user-avatar" style="background:${u.color}" title="${u.name} — ${u.email}">${u.initials}</div>
      <span class="role-badge ${u.role}">${u.role}</span>
      <button class="signout-btn" id="hdr-signout">
        <i class="ti ti-logout"></i> Sign out
      </button>
    </div>
  `

  document.getElementById('hdr-settings').addEventListener('click', async () => {
    if (state.currentUser?.navAccess.includes('settings')) await go('settings')
  })

  document.getElementById('hdr-signout').addEventListener('click', async () => {
    console.log('📤 Signing out...')
    state.currentUser = null
    // Clear MSAL session
    await logout()
    // Clear app and reload to show login screen
    document.getElementById('app').innerHTML = ''
    window.location.reload()
  })
}
