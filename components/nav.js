import { state, go } from '../app.js'

const NAV_ITEMS = {
  admin: [
    { id: 'dashboard',  label: 'Dashboard',            icon: 'ti-layout-dashboard' },
    { id: 'requests',   label: 'Requests',             icon: 'ti-inbox',              badge: '7',  badgeCls: 'blue' },
    { id: 'security',   label: 'Security',             icon: 'ti-shield-exclamation', badge: '3',  badgeCls: 'red' },
    { id: 'tenantguard',label: 'TenantGuard',          icon: 'ti-alert-triangle',     badge: 'Alert' },
    { id: 'user-investigation',label: 'User Investigation',icon: 'ti-shield-check' },
    { id: 'zerotrust',  label: 'Zero Trust',           icon: 'ti-lock-check',         badge: '2',  badgeCls: 'amber' },
    { id: 'privaccts',  label: 'Privileged Accounts',  icon: 'ti-crown',              badge: '2',  badgeCls: 'red' },
    { id: 'm365config', label: 'M365 Config',          icon: 'ti-settings-2',         badge: '4',  badgeCls: 'amber' },
    { id: 'msgcenter',      label: 'Change Intelligence',  icon: 'ti-antenna',            badge: '8',  badgeCls: 'red' },
    { id: 'tasks',          label: 'Change Tasks',         icon: 'ti-checkbox',           badge: '0',  badgeCls: 'blue' },
    { id: 'applications',   label: 'Entra Apps',          icon: 'ti-app-window',         badge: '2',  badgeCls: 'red' },
    { id: 'intune',         label: 'Intune Insights',     icon: 'ti-device-laptop',      badge: '2',  badgeCls: 'red' },
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
    { id: 'audit',    label: 'Audit Log',       icon: 'ti-database' },
    { id: 'settings', label: 'Admin Settings',   icon: 'ti-adjustments-horizontal' },
  ],
  super: [
    { id: 'graphapi', label: 'Graph API',       icon: 'ti-api',      badge: 'Live', badgeCls: 'green' },
    { id: 'sso',      label: 'SSO / Entra ID',  icon: 'ti-key' },
  ],
}

export function renderNav() {
  const sidebar = document.getElementById('sidebar')
  const u = state.currentUser
  if (!u || !sidebar) return

  let access = u.navAccess

  // Ensure user-investigation is in access for super/admin users
  if (['super', 'admin'].includes(u.role) && !access.includes('user-investigation')) {
    access = [...access, 'user-investigation']
  }

  let html = `
    <div class="nav-logo">
      <div class="nav-logo-icon"><i class="ti ti-shield-bolt"></i></div>
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
        <i class="ti ${it.icon}"></i>
        <span class="nav-label">${it.label}</span>
        ${it.badge ? `<span class="nav-badge ${it.badgeCls}">${it.badge}</span>` : ''}
      </div>
    `).join('')

  // Admin section
  const adminItems = buildItems(NAV_ITEMS.admin)
  if (adminItems) {
    html += `<div class="nav-section"><div class="nav-section-label">Administration</div>${adminItems}</div>`
  }

  // Approvals section (for admin and super only)
  if (['admin', 'super'].includes(u.role) && access.includes('approvals')) {
    const approvalsItem = NAV_ITEMS.manager.find(it => it.id === 'approvals')
    if (approvalsItem) {
      html += `<div class="nav-section"><div class="nav-section-label">Approvals</div>${buildItems([approvalsItem])}</div>`
    }
  }

  // Self-service
  const ssItems = buildItems(NAV_ITEMS.selfservice)
  if (ssItems) {
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

  // Click handlers
  sidebar.querySelectorAll('.nav-item').forEach(item => {
    item.addEventListener('click', async () => await go(item.dataset.page))
  })
}
