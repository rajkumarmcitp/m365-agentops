import { api } from '../lib/api-client.js'
import { state } from '../app.js'

let notificationInterval = null

export function initNotifications() {
  // Check for notifications every 30 seconds
  notificationInterval = setInterval(() => {
    checkNotifications()
  }, 30000)

  // Initial check
  checkNotifications()

  return notificationInterval
}

export function stopNotifications() {
  if (notificationInterval) {
    clearInterval(notificationInterval)
    notificationInterval = null
  }
}

async function checkNotifications() {
  try {
    const siteUrl = encodeURIComponent(state.settings.sharepointSiteUrl || 'root')
    const result = await fetch(`${api}/msgcenter/notifications?siteUrl=${siteUrl}`).then(r => r.json())

    if (result.success && result.data) {
      updateNotificationBell(result.unreadCount || 0)

      // Show toast for unread notifications
      const unreadNotifications = result.data.filter(n => !n.read)
      unreadNotifications.forEach(notification => {
        showNotificationToast(notification)
        // Mark as read after showing
        markNotificationAsRead(notification.id)
      })
    }
  } catch (error) {
    console.warn('Error checking notifications:', error.message)
  }
}

function updateNotificationBell(count) {
  const bell = document.getElementById('notification-bell')
  const badge = document.getElementById('notification-badge')

  if (bell && badge) {
    if (count > 0) {
      badge.style.display = 'flex'
      badge.textContent = count > 9 ? '9+' : count
    } else {
      badge.style.display = 'none'
    }
  }
}

function showNotificationToast(notification) {
  const toastContainer = document.getElementById('toast-container')
  if (!toastContainer) return

  const icon = getNotificationIcon(notification.type)
  const color = getNotificationColor(notification.type)

  // Generate message based on type
  let message = notification.message
  if (notification.type === 'approval') {
    message = `"${notification.title}" requires approval`
  } else if (notification.type === 'deadline') {
    message = `Deadline approaching`
  }

  const toast = document.createElement('div')
  toast.style.cssText = `
    background:white;
    border-left:4px solid ${color};
    padding:16px;
    border-radius:6px;
    margin-bottom:12px;
    box-shadow:0 2px 8px rgba(0,0,0,0.1);
    animation:slideIn 300ms ease-out;
  `

  toast.innerHTML = `
    <div style="display:flex;align-items:flex-start;gap:12px">
      <div style="font-size:20px">${icon}</div>
      <div style="flex:1">
        <div style="font-weight:600;color:#333;font-size:12px">${notification.type === 'approval' ? 'Approval Needed' : (notification.type === 'deadline' ? 'Deadline Alert' : notification.title)}</div>
        <div style="color:#666;font-size:11px;margin-top:4px">${message}</div>
      </div>
      <button class="close-toast" style="background:none;border:none;color:#999;cursor:pointer;font-size:16px;padding:0">×</button>
    </div>
  `

  toastContainer.appendChild(toast)

  const closeBtn = toast.querySelector('.close-toast')
  closeBtn?.addEventListener('click', () => {
    toast.style.animation = 'slideOut 300ms ease-in'
    setTimeout(() => toast.remove(), 300)
  })

  // Auto remove after 5 seconds
  setTimeout(() => {
    if (toast.parentElement) {
      toast.style.animation = 'slideOut 300ms ease-in'
      setTimeout(() => toast.remove(), 300)
    }
  }, 5000)
}

function getNotificationIcon(type) {
  const icons = {
    'new_announcement': '📢',
    'deadline': '⏰',
    'task_update': '✓',
    'approval': '👤',
  }
  return icons[type] || '📌'
}

function getNotificationColor(type) {
  const colors = {
    'new_announcement': '#0066cc',
    'deadline': '#ff9800',
    'task_update': '#4caf50',
    'approval': '#9c27b0',
  }
  return colors[type] || '#999'
}

async function markNotificationAsRead(notificationId) {
  try {
    await fetch(`${api}/msgcenter/notifications/${notificationId}/read`, {
      method: 'POST'
    })
  } catch (error) {
    console.warn('Error marking notification as read:', error.message)
  }
}

export async function showNotificationPanel() {
  try {
    const siteUrl = encodeURIComponent(state.settings.sharepointSiteUrl || 'root')
    const result = await fetch(`${api}/msgcenter/notifications?siteUrl=${siteUrl}`).then(r => r.json())

    if (!result.success) {
      return { success: false, data: [] }
    }

    return {
      success: true,
      data: result.data || [],
      count: result.count || 0,
      unreadCount: result.unreadCount || 0
    }
  } catch (error) {
    console.error('Error fetching notifications:', error.message)
    return { success: false, data: [] }
  }
}

// Add CSS animations to document
const style = document.createElement('style')
style.textContent = `
  @keyframes slideIn {
    from {
      transform: translateX(-100%);
      opacity: 0;
    }
    to {
      transform: translateX(0);
      opacity: 1;
    }
  }

  @keyframes slideOut {
    from {
      transform: translateX(0);
      opacity: 1;
    }
    to {
      transform: translateX(-100%);
      opacity: 0;
    }
  }
`
document.head.appendChild(style)
