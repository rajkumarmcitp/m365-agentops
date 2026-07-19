import { state, go } from '../app.js'

const ICON_MAP = {
  'ti-layout-dashboard': 'fas fa-chart-pie',
  'ti-inbox': 'fas fa-inbox',
  'ti-shield-exclamation': 'fas fa-exclamation-triangle',
  'ti-alert-triangle': 'fas fa-exclamation-triangle',
  'ti-shield-check': 'fas fa-shield-alt',
  'ti-lock-check': 'fas fa-lock',
  'ti-crown': 'fas fa-crown',
  'ti-settings-2': 'fas fa-cog',
  'ti-antenna': 'fas fa-broadcast-tower',
  'ti-heartbeat': 'fas fa-heartbeat',
  'ti-checkbox': 'fas fa-check-square',
  'ti-app-window': 'fas fa-window-maximize',
  'ti-device-laptop': 'fas fa-laptop',
  'ti-license': 'fas fa-certificate',
  'ti-robot': 'fas fa-robot',
  'ti-user-circle': 'fas fa-user-circle',
  'ti-grid-dots': 'fas fa-th',
  'ti-list-check': 'fas fa-list-check',
  'ti-message-circle': 'fas fa-comment-circle',
  'ti-check-list': 'fas fa-tasks',
  'ti-database-backup': 'fas fa-database',
  'ti-settings-automation': 'fas fa-cogs',
  'ti-database': 'fas fa-database',
  'ti-adjustments-horizontal': 'fas fa-sliders-h',
  'ti-sparkles': 'fas fa-magic',
  'ti-api': 'fas fa-plug',
  'ti-key': 'fas fa-key',
}

const getIcon = (tiClass) => {
  return ICON_MAP[tiClass] || 'fas fa-circle'
}

const NAV_ITEMS = {
  admin: [
    { id: 'dashboard',  label: 'Dashboard',            icon: 'ti-layout-dashboard' },
    { id: 'requests',   label: 'Requests',             icon: 'ti-inbox',              badge: '7',  badgeCls: 'blue' },
    { id: 'security',   label: 'Security',             icon: 'ti-shield-exclamation', badge: '3',  badgeCls: 'red' },
    { id: 'tenantguard',label: 'Tenant Guard',         icon: 'ti-alert-triangle',     badge: '4',  badgeCls: 'red' },
    { id: 'user-investigation',label: 'User Investigation',icon: 'ti-shield-check' },
    { id: 'zerotrust',  label: 'Zero Trust',           icon: 'ti-lock-check',         badge: '33', badgeCls: 'amber' },
    { id: 'conditionalaccess', label: 'Conditional Access', icon: 'ti-shield-check',  badge: 'NEW', badgeCls: 'green' },
    { id: 'privaccts',  label: 'Privileged Accounts',  icon: 'ti-crown',              badge: '12', badgeCls: 'red' },
    { id: 'm365config', label: 'M365 Config',          icon: 'ti-settings-2',         badge: '8',  badgeCls: 'amber' },
    { id: 'msgcenter',      label: 'Change Intelligence',  icon: 'ti-antenna',        badge: '100',badgeCls: 'red' },
    { id: 'messages',       label: 'Service Health',       icon: 'ti-heartbeat',      badge: '75', badgeCls: 'orange' },
    { id: 'tasks',          label: 'Change Tasks',         icon: 'ti-checkbox',       badge: '18', badgeCls: 'blue' },
    { id: 'applications',   label: 'Entra Apps',           icon: 'ti-app-window',     badge: '42', badgeCls: 'red' },
    { id: 'intune',         label: 'Intune Insights',      icon: 'ti-device-laptop',  badge: '156',badgeCls: 'red' },
    { id: 'licenses',       label: 'Licenses',            icon: 'ti-license' },
    { id: 'agents',     label: 'AI Agents',            icon: 'ti-robot' },
  ],
  selfservice: [
    { id: 'myaccount', label: 'My Account',   icon: 'ti-user-circle' },
    { id: 'portal',    label: 'Portal',       icon: 'ti-grid-dots' },
    { id: 'myreqs',    label: 'My Requests',  icon: 'ti-list-check' },
    { id: 'chat',      label: 'AI Copilot',   icon: 'ti-message-circle' },
  ],
  manager: [
    { id: 'approvals', label: 'Pending Approvals', icon: 'ti-check-list', badge: '3', badgeCls: 'red' },
  ],
  config: [
    { id: 'backup',   label: 'Backup & Restore', icon: 'ti-database-backup' },
    { id: 'backup-config', label: 'Backup Configuration', icon: 'ti-settings-automation' },
    { id: 'audit',    label: 'Audit Log',        icon: 'ti-database' },
    { id: 'settings', label: 'Admin Settings',   icon: 'ti-adjustments-horizontal' },
  ],
  super: [
    { id: 'setup-wizard', label: 'Setup Wizard',  icon: 'ti-sparkles' },
    { id: 'graphapi',     label: 'Graph API',     icon: 'ti-api',      badge: 'Live', badgeCls: 'green' },
    { id: 'sso',          label: 'SSO / Entra ID',icon: 'ti-key' },
  ],
}

export function renderNav() {
  const sidebar = document.getElementById('sidebar')
  const u = state.currentUser
  if (!u || !sidebar) return

  let access = u.navAccess || []

  // Ensure user-investigation is in access for super/admin users
  if (['super', 'admin'].includes(u.role) && !access.includes('user-investigation')) {
    access = [...access, 'user-investigation']
  }

  // Ensure backup pages and conditional access are in access for super/admin users
  if (['super', 'admin'].includes(u.role)) {
    if (!access.includes('backup')) access = [...access, 'backup']
    if (!access.includes('backup-config')) access = [...access, 'backup-config']
    if (!access.includes('conditionalaccess')) access = [...access, 'conditionalaccess']
  }

  let html = `
    <div class="nav-logo">
      <div class="nav-logo-icon"><i class="fas fa-shield-alt"></i></div>
      <div>
        <div class="nav-logo-text">M365 AgentOps</div>
        <div class="nav-logo-sub">${state.tenantDomain}</div>
      </div>
    </div>
  `

  const buildItems = (items) => items
    .filter(it => access.includes(it.id))
    .map(it => `
      <div class="nav-item" id="n-${it.id}" data-page="${it.id}">
        <i class="${getIcon(it.icon)}"></i>
        <span class="nav-label">${it.label}</span>
        ${it.badge ? `<span class="nav-badge ${it.badgeCls}">${it.badge}</span>` : ''}
      </div>
    `).join('')

  // Check if self-service portal is enabled
  const portalEnabled = state.settings?.portalEnabled !== false

  // Check if Service Health monitoring is enabled
  const serviceHealthEnabled = state.settings?.serviceHealthEnabled !== false

  // Admin section (filter out Requests if portal is disabled, filter out Service Health if disabled)
  let adminNavItems = NAV_ITEMS.admin
  if (!portalEnabled) {
    adminNavItems = adminNavItems.filter(item => item.id !== 'requests')
  }
  if (!serviceHealthEnabled) {
    adminNavItems = adminNavItems.filter(item => item.id !== 'messages')
  }
  const adminItems = buildItems(adminNavItems)
  if (adminItems) {
    html += `<div class="nav-section"><div class="nav-section-label">Administration</div>${adminItems}</div>`
  }

  // Approvals section (only show if portal is enabled)
  if (portalEnabled && ['admin', 'super'].includes(u.role) && access.includes('approvals')) {
    const approvalsItem = NAV_ITEMS.manager.find(it => it.id === 'approvals')
    if (approvalsItem) {
      html += `<div class="nav-section"><div class="nav-section-label">Approvals</div>${buildItems([approvalsItem])}</div>`
    }
  }

  // Self-service section (only show if portal is enabled)
  const ssItems = buildItems(NAV_ITEMS.selfservice)
  if (ssItems && portalEnabled) {
    html += `<div class="nav-divider"></div><div class="nav-section"><div class="nav-section-label">Self-Service</div>${ssItems}</div>`
  }

  // Config
  const cfgItems = buildItems(NAV_ITEMS.config)
  const superItems = buildItems(NAV_ITEMS.super)
  if (cfgItems || superItems) {
    html += `<div class="nav-divider"></div><div class="nav-section"><div class="nav-section-label">Config</div>${cfgItems}${superItems}</div>`
  }

  html += `
    <div class="nav-footer">
      <strong>${u.name}</strong>
      ${u.email}
    </div>
  `

  sidebar.innerHTML = html

  // Logo click handler - navigate to dashboard
  const navLogo = sidebar.querySelector('.nav-logo')
  if (navLogo) {
    navLogo.style.cursor = 'pointer'
    navLogo.addEventListener('click', async () => await go('dashboard'))
  }

  // Click handlers
  sidebar.querySelectorAll('.nav-item').forEach(item => {
    item.addEventListener('click', async () => await go(item.dataset.page))
  })
}
