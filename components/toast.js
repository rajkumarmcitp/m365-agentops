const ICONS = { success: 'ti-circle-check', error: 'ti-circle-x', warning: 'ti-alert-triangle', info: 'ti-info-circle' }

export function showToast(message, type = 'info', duration = 3500) {
  const container = document.getElementById('toast-container')
  if (!container) return

  const toast = document.createElement('div')
  toast.className = `toast ${type}`
  toast.innerHTML = `
    <i class="ti ${ICONS[type] || ICONS.info} toast-icon"></i>
    <span class="toast-text">${message}</span>
    <button class="toast-close"><i class="ti ti-x"></i></button>
  `

  container.appendChild(toast)

  const remove = () => {
    toast.style.animation = 'toast-out 200ms ease forwards'
    setTimeout(() => toast.remove(), 200)
  }

  toast.querySelector('.toast-close').addEventListener('click', remove)
  setTimeout(remove, duration)
}
