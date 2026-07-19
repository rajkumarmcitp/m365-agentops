import { state, go } from '../app.js'
import { logout } from '../lib/auth.js'
import { showNotificationPanel } from './notifications.js'

export function renderHeader() {
  const header = document.getElementById('app-header')
  const u = state.currentUser
  if (!u) return

  header.innerHTML = `
    <div class="header-spacer"></div>
    <div class="header-actions">
      <button class="header-icon-btn" title="Notifications" id="notification-bell" style="position:relative">
        <i class="fas fa-bell"></i>
        <span id="notification-badge" style="position:absolute;top:-4px;right:-4px;background:#ff4444;color:white;font-size:10px;font-weight:700;min-width:20px;height:20px;border-radius:50%;display:flex;align-items:center;justify-content:center;display:none">0</span>
      </button>
      <button class="header-icon-btn" title="Admin Settings" id="hdr-settings">
        <i class="fas fa-cog"></i>
      </button>
      <div class="user-avatar" style="background:${u.color}" title="${u.name} — ${u.email}">
        <div class="avatar-initials">${u.initials}</div>
        <div class="avatar-role">${u.role}</div>
      </div>
      <button class="signout-btn" id="hdr-signout" title="Sign out">
        <i class="fas fa-sign-out-alt"></i>
      </button>
    </div>
  `

  // Notification bell click handler
  document.getElementById('notification-bell').addEventListener('click', async () => {
    const result = await showNotificationPanel()
    if (result.data.length > 0) {
      showNotificationModal(result.data)
    }
  })

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

function showNotificationModal(notifications) {
  const modal = document.createElement('div')
  modal.style.cssText = `
    position:fixed;top:0;right:0;width:400px;height:100vh;background:white;
    box-shadow:-2px 0 12px rgba(0,0,0,0.15);z-index:999;display:flex;flex-direction:column
  `

  const getIcon = (type) => {
    const icons = { 'new_announcement': '📢', 'deadline': '⏰', 'task_update': '✓', 'approval': '👤' }
    return icons[type] || '📌'
  }

  const getColor = (type) => {
    const colors = { 'new_announcement': '#0066cc', 'deadline': '#ff9800', 'task_update': '#4caf50', 'approval': '#9c27b0' }
    return colors[type] || '#999'
  }

  modal.innerHTML = `
    <div style="padding:16px;border-bottom:1px solid #e0e0e0;display:flex;justify-content:space-between;align-items:center">
      <h3 style="margin:0;font-size:14px;font-weight:700">Notifications</h3>
      <button id="close-notification-modal" style="background:none;border:none;font-size:20px;cursor:pointer;color:#666">×</button>
    </div>
    <div style="flex:1;overflow-y:auto;padding:12px">
      ${notifications.map(n => `
        <div style="padding:12px;border-left:3px solid ${getColor(n.type)};background:#f9f9f9;border-radius:4px;margin-bottom:12px">
          <div style="display:flex;gap:8px;margin-bottom:6px">
            <span style="font-size:18px">${getIcon(n.type)}</span>
            <div style="flex:1">
              <div style="font-weight:600;font-size:11px;color:#333">${n.title}</div>
              <div style="font-size:10px;color:#666;margin-top:4px">${n.message}</div>
              <div style="font-size:9px;color:#999;margin-top:6px">${new Date(n.timestamp).toLocaleTimeString()}</div>
            </div>
          </div>
        </div>
      `).join('')}
    </div>
  `

  document.body.appendChild(modal)

  modal.querySelector('#close-notification-modal').addEventListener('click', () => {
    modal.remove()
  })

  // Close on outside click
  document.addEventListener('click', (e) => {
    if (!modal.contains(e.target) && e.target.id !== 'notification-bell') {
      modal.remove()
    }
  }, { once: true })
}
