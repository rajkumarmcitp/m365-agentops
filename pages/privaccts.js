import { showToast } from '../components/toast.js'
import { getPrivilegedAccounts, getWorkloadIdentitiesWithRisk } from '../lib/api-client.js'
import { isDemoAccount } from '../lib/demo-account.js'
import { PA_GROUPS } from '../data/pa-data.js'
import { skeletonLoader } from '../lib/skeleton-loader.js'

let logEntries = []
let realPrivilegedAccounts = []
let workloadIdentities = []
let workloadDataLoaded = false // Track if API returned data (even if empty)
let accountsSummary = { totalAccounts: 0, atRisk: 0, noMFA: 0, permanentRoles: 0, servicePrincipals: 0 }

export async function initPrivAccts() {
  const el = document.getElementById('page-privaccts')
  if (!el) return

  if (isDemoAccount()) {
    console.log('🎭 Demo account detected - showing demo privileged accounts')
    await renderDemoPrivAccts(el)
    return
  }

  // Show skeleton immediately
  renderPrivAcctsSkeleton(el)

  try {
    console.log('📡 Fetching real privileged accounts from Azure AD...')
    const result = await getPrivilegedAccounts()
    if (result.success && result.data?.accounts) {
      realPrivilegedAccounts = result.data.accounts
      accountsSummary = result.data.summary
      console.log(`✅ Loaded ${realPrivilegedAccounts.length} real privileged accounts`)
    } else {
      console.warn('⚠️ No privileged account data available from API')
      realPrivilegedAccounts = []
      accountsSummary = { totalAccounts: 0, atRisk: 0, noMFA: 0, permanentRoles: 0, servicePrincipals: 0 }
    }

    console.log('📡 Fetching workload identities with risk assessment...')
    const workloadResult = await getWorkloadIdentitiesWithRisk()
    if (workloadResult.success && workloadResult.data?.workloadIdentities !== undefined) {
      workloadIdentities = workloadResult.data.workloadIdentities
      workloadDataLoaded = true
      console.log(`✅ Loaded ${workloadIdentities.length} workload identities (real data)`)
    } else {
      console.warn('⚠️ No workload identity data available from API')
      workloadIdentities = []
      workloadDataLoaded = false
    }
  } catch (error) {
    console.error('❌ Error loading privileged accounts or workload identities:', error.message)
    realPrivilegedAccounts = []
    workloadIdentities = []
    accountsSummary = { totalAccounts: 0, atRisk: 0, noMFA: 0, permanentRoles: 0, servicePrincipals: 0 }
  }

  renderPrivAcctsContent(el)
}

function renderPrivAcctsSkeleton(el) {
  el.innerHTML = `
    <div>
      ${skeletonLoader.renderPageHeader('Privileged Accounts', 'Manage and monitor privileged identities', true)}
      ${skeletonLoader.renderMetricsRowSkeleton(4)}
      ${skeletonLoader.renderTableSkeleton(7, 8)}
    </div>
  `
}

function renderPrivAcctsContent(el) {
  el.innerHTML = `
    <div class="page-header">
      <div>
        <div class="page-title"><i class="ti ti-crown"></i> Privileged Accounts</div>
        <div class="page-subtitle">Manage and monitor privileged identities in your tenant</div>
      </div>
      <div class="page-actions">
        <button class="btn" id="pa-sync"><i class="ti ti-refresh"></i> Sync tenant</button>
        <button class="btn btn-primary" id="pa-tag-account"><i class="ti ti-plus"></i> Tag account</button>
      </div>
    </div>

    ${accountsSummary.atRisk > 0 ? `
      <div class="alert-banner danger mb-3">
        <i class="ti ti-alert-triangle"></i>
        ${accountsSummary.atRisk} privileged account${accountsSummary.atRisk > 1 ? 's' : ''} have active risk detection${accountsSummary.atRisk > 1 ? 's' : ''}.
      </div>
    ` : ''}

    <div class="kpi-row">
      <div class="kpi-tile"><div class="kpi-value info">${accountsSummary.totalAccounts}</div><div class="kpi-label">Accounts</div></div>
      <div class="kpi-tile"><div class="kpi-value ${accountsSummary.atRisk > 0 ? 'danger' : 'success'}">${accountsSummary.atRisk}</div><div class="kpi-label">At Risk</div></div>
      <div class="kpi-tile"><div class="kpi-value info">${accountsSummary.noMFA}</div><div class="kpi-label">No MFA</div></div>
      <div class="kpi-tile"><div class="kpi-value info">0</div><div class="kpi-label">Groups</div></div>
      <div class="kpi-tile"><div class="kpi-value warning">${accountsSummary.permanentRoles}</div><div class="kpi-label">Permanent</div></div>
    </div>

    <div class="tabs" id="pa-tabs">
      <button class="tab-btn active" data-tab="accounts">Privileged Accounts</button>
      <button class="tab-btn" data-tab="groups">Privileged Groups</button>
      <button class="tab-btn" data-tab="workload">Workload Identity</button>
      <button class="tab-btn" data-tab="log">Membership Log</button>
    </div>

    <div class="tab-panel active" id="pa-tab-accounts"></div>
    <div class="tab-panel" id="pa-tab-groups"></div>
    <div class="tab-panel" id="pa-tab-workload"></div>
    <div class="tab-panel" id="pa-tab-log"></div>
  `

  renderAccountsTab(el)
  renderGroupsTab(el)
  renderWorkloadIdentityTab(el)
  renderLogTab(el)

  el.querySelectorAll('#pa-tabs .tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      el.querySelectorAll('#pa-tabs .tab-btn').forEach(b => b.classList.remove('active'))
      el.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'))
      btn.classList.add('active')
      el.querySelector(`#pa-tab-${btn.dataset.tab}`).classList.add('active')
    })
  })

  el.querySelector('#pa-sync').addEventListener('click', () => {
    const btn = el.querySelector('#pa-sync')
    btn.innerHTML = `<span class="spinner dark"></span> Syncing...`
    btn.disabled = true
    setTimeout(() => {
      btn.innerHTML = `<i class="ti ti-refresh"></i> Sync tenant`
      btn.disabled = false
      showToast('Tenant sync complete — 14 accounts updated.', 'success')
    }, 2000)
  })

  el.querySelector('#pa-tag-account').addEventListener('click', () => {
    showToast('Tag account: select an account from the table below.', 'info')
  })
}

function riskBadge(risk) {
  if (risk === 'High') return `<span class="badge danger dot">High</span>`
  if (risk === 'Medium') return `<span class="badge warning dot">Medium</span>`
  return `<span class="badge neutral dot">None</span>`
}

function mfaBadge(mfa) {
  if (!mfa || mfa.length === 0) return `<span class="pa-mfa-pill none">No MFA</span>`
  return mfa.map(m => {
    if (m === 'SMS') return `<span class="pa-mfa-pill sms">SMS</span>`
    return `<span class="pa-mfa-pill">${m}</span>`
  }).join('')
}

function roleBadge(role) {
  const isGlobal = role.toLowerCase().includes('global')
  return `<span class="pa-role-chip ${isGlobal ? 'global' : ''}">${role}</span>`
}

async function renderDemoPrivAccts(el) {
  const demoAccounts = [
    { id: 'user-1', name: 'Aisha Raza', email: 'aisha.raza@contoso.com', role: 'Global Administrator', mfa: ['Microsoft Authenticator'], riskLevel: 'high', lastSignIn: '2026-06-01 14:32' },
    { id: 'user-2', name: 'Chen Wei', email: 'chen.wei@contoso.com', role: 'Exchange Administrator', mfa: ['Authenticator App'], riskLevel: 'low', lastSignIn: '2026-06-01 09:15' },
    { id: 'user-3', name: 'Sanjay Kumar', email: 'sanjay.kumar@contoso.com', role: 'Security Administrator', mfa: ['SMS', 'Authenticator App'], riskLevel: 'low', lastSignIn: '2026-06-01 11:45' },
    { id: 'user-4', name: 'Sarah Johnson', email: 'sarah.johnson@contoso.com', role: 'Sharepoint Administrator', mfa: [], riskLevel: 'medium', lastSignIn: '2026-05-30 16:20' },
    { id: 'user-5', name: 'Tom Brooks', email: 'tom.brooks@contoso.com', role: 'Teams Administrator', mfa: ['Microsoft Authenticator'], riskLevel: 'low', lastSignIn: '2026-06-01 13:50' },
  ]

  const demoSummary = {
    totalAccounts: demoAccounts.length,
    atRisk: 1,
    noMFA: 1,
    permanentRoles: 3,
    servicePrincipals: 0
  }

  const demoGroups = [
    { id: 'group-1', name: 'Global Administrators', members: 2, eligible: 1, permanent: true },
    { id: 'group-2', name: 'Exchange Administrators', members: 1, eligible: 0, permanent: true },
    { id: 'group-3', name: 'Security Administrators', members: 1, eligible: 0, permanent: true },
  ]

  const demoLog = [
    { date: '2026-06-01 10:30', user: 'Aisha Raza', action: 'Added to Global Administrator', status: 'Permanent assignment', severity: 'critical' },
    { date: '2026-05-31 14:15', user: 'Chen Wei', action: 'Activated Exchange Administrator', status: 'Temporary (4 hours)', severity: 'warning' },
    { date: '2026-05-30 09:20', user: 'Sanjay Kumar', action: 'MFA verification', status: 'Approved', severity: 'low' },
    { date: '2026-05-29 16:45', user: 'Sarah Johnson', action: 'Removed from SharePoint Administrators', status: 'Role deactivated', severity: 'low' },
    { date: '2026-05-28 11:30', user: 'Tom Brooks', action: 'Added to Teams Administrators', status: 'Eligible assignment', severity: 'warning' },
  ]

  // Also load workload identities from API in demo mode
  try {
    const workloadResult = await getWorkloadIdentitiesWithRisk()
    if (workloadResult.success && workloadResult.data?.workloadIdentities) {
      workloadIdentities = workloadResult.data.workloadIdentities
    }
  } catch (error) {
    console.warn('⚠️ Could not load workload identities in demo mode:', error.message)
  }

  el.innerHTML = `
    <div class="page-header">
      <div>
        <div class="page-title"><i class="ti ti-crown"></i> Privileged Accounts</div>
        <div class="page-subtitle">Manage and monitor privileged identities in your tenant</div>
      </div>
      <div class="page-actions">
        <button class="btn" id="pa-sync"><i class="ti ti-refresh"></i> Sync tenant</button>
        <button class="btn btn-primary" id="pa-tag-account"><i class="ti ti-plus"></i> Tag account</button>
      </div>
    </div>

    <div style="display:flex;align-items:center;gap:8px;padding:8px 12px;background:var(--color-background-primary);border:0.5px solid var(--color-border-secondary);border-radius:var(--border-radius-md);margin-bottom:16px;font-size:10px;color:var(--color-text-tertiary)">
      <span class="status-dot active pulse"></span>
      <span><strong style="color:var(--color-text-secondary)">Demo Mode</strong> · Showing sample privileged accounts</span>
    </div>

    <div class="alert-banner danger mb-3">
      <i class="ti ti-alert-triangle"></i>
      1 privileged account has active risk detection.
    </div>

    <div class="kpi-row">
      <div class="kpi-tile"><div class="kpi-value info">${demoSummary.totalAccounts}</div><div class="kpi-label">Accounts</div></div>
      <div class="kpi-tile"><div class="kpi-value danger">${demoSummary.atRisk}</div><div class="kpi-label">At Risk</div></div>
      <div class="kpi-tile"><div class="kpi-value warning">${demoSummary.noMFA}</div><div class="kpi-label">No MFA</div></div>
      <div class="kpi-tile"><div class="kpi-value info">${demoGroups.length}</div><div class="kpi-label">Groups</div></div>
      <div class="kpi-tile"><div class="kpi-value warning">${demoSummary.permanentRoles}</div><div class="kpi-label">Permanent</div></div>
    </div>

    <div class="tabs" id="pa-tabs">
      <button class="tab-btn active" data-tab="accounts">Privileged Accounts</button>
      <button class="tab-btn" data-tab="groups">Privileged Groups</button>
      <button class="tab-btn" data-tab="workload">Workload Identity</button>
      <button class="tab-btn" data-tab="log">Membership Log</button>
    </div>

    <div class="tab-panel active" id="pa-tab-accounts"></div>
    <div class="tab-panel" id="pa-tab-groups"></div>
    <div class="tab-panel" id="pa-tab-workload"></div>
    <div class="tab-panel" id="pa-tab-log"></div>
  `

  renderDemoAccountsTab(el, demoAccounts)
  renderDemoGroupsTab(el, demoGroups)
  renderDemoWorkloadIdentityTab(el)
  renderDemoLogTab(el, demoLog)

  el.querySelector('#pa-sync').addEventListener('click', () => {
    const btn = el.querySelector('#pa-sync')
    btn.innerHTML = `<span class="spinner dark"></span> Syncing...`
    btn.disabled = true
    setTimeout(() => {
      btn.innerHTML = `<i class="ti ti-refresh"></i> Sync tenant`
      btn.disabled = false
      showToast('Sync complete — all privileged accounts updated', 'success')
    }, 2000)
  })

  el.querySelectorAll('#pa-tabs .tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      el.querySelectorAll('#pa-tabs .tab-btn').forEach(b => b.classList.remove('active'))
      el.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'))
      btn.classList.add('active')
      el.querySelector(`#pa-tab-${btn.dataset.tab}`).classList.add('active')
    })
  })
}

function renderDemoAccountsTab(el, accounts) {
  const container = el.querySelector('#pa-tab-accounts')
  container.innerHTML = `
    <div style="margin-bottom:12px">
      <input type="text" class="form-input" placeholder="Search accounts..." style="max-width:300px">
    </div>
    <div class="card" style="padding:0;overflow:hidden">
      <table style="width:100%">
        <thead style="background:var(--color-background-secondary)">
          <tr>
            <th style="padding:10px 12px;text-align:left;font-size:10px;font-weight:600">User</th>
            <th style="padding:10px 12px;text-align:left;font-size:10px;font-weight:600">Email</th>
            <th style="padding:10px 12px;text-align:left;font-size:10px;font-weight:600">Role</th>
            <th style="padding:10px 12px;text-align:left;font-size:10px;font-weight:600">MFA</th>
            <th style="padding:10px 12px;text-align:left;font-size:10px;font-weight:600">Risk</th>
            <th style="padding:10px 12px;text-align:left;font-size:10px;font-weight:600">Last Sign-in</th>
          </tr>
        </thead>
        <tbody>
          ${accounts.map((account, i) => `
            <tr style="border-bottom:${i < accounts.length - 1 ? '0.5px solid var(--color-border-tertiary)' : 'none'}">
              <td style="padding:10px 12px;font-size:11px;font-weight:600">${account.name}</td>
              <td style="padding:10px 12px;font-size:10px;color:var(--color-text-secondary)">${account.email}</td>
              <td style="padding:10px 12px;font-size:10px">${roleBadge(account.role)}</td>
              <td style="padding:10px 12px;font-size:10px">${mfaBadge(account.mfa)}</td>
              <td style="padding:10px 12px"><span class="badge ${account.riskLevel === 'high' ? 'danger' : account.riskLevel === 'medium' ? 'warning' : 'success'}">${account.riskLevel}</span></td>
              <td style="padding:10px 12px;font-size:10px;color:var(--color-text-tertiary)">${account.lastSignIn}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>
  `
}

function renderDemoGroupsTab(el, groups) {
  const container = el.querySelector('#pa-tab-groups')
  container.innerHTML = `
    <div class="card" style="padding:0;overflow:hidden">
      <table style="width:100%">
        <thead style="background:var(--color-background-secondary)">
          <tr>
            <th style="padding:10px 12px;text-align:left;font-size:10px;font-weight:600">Group Name</th>
            <th style="padding:10px 12px;text-align:left;font-size:10px;font-weight:600">Total Members</th>
            <th style="padding:10px 12px;text-align:left;font-size:10px;font-weight:600">Eligible</th>
            <th style="padding:10px 12px;text-align:left;font-size:10px;font-weight:600">Type</th>
          </tr>
        </thead>
        <tbody>
          ${groups.map((group, i) => `
            <tr style="border-bottom:${i < groups.length - 1 ? '0.5px solid var(--color-border-tertiary)' : 'none'}">
              <td style="padding:10px 12px;font-size:11px;font-weight:600">${group.name}</td>
              <td style="padding:10px 12px;font-size:10px">${group.members}</td>
              <td style="padding:10px 12px;font-size:10px">${group.eligible}</td>
              <td style="padding:10px 12px"><span class="badge ${group.permanent ? 'danger' : 'warning'}">${group.permanent ? 'Permanent' : 'Eligible'}</span></td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>
  `
}

function renderDemoLogTab(el, logEntries) {
  const container = el.querySelector('#pa-tab-log')
  container.innerHTML = `
    <div class="card" style="padding:0;overflow:hidden">
      <table style="width:100%">
        <thead style="background:var(--color-background-secondary)">
          <tr>
            <th style="padding:10px 12px;text-align:left;font-size:10px;font-weight:600">Date/Time</th>
            <th style="padding:10px 12px;text-align:left;font-size:10px;font-weight:600">User</th>
            <th style="padding:10px 12px;text-align:left;font-size:10px;font-weight:600">Action</th>
            <th style="padding:10px 12px;text-align:left;font-size:10px;font-weight:600">Status</th>
            <th style="padding:10px 12px;text-align:left;font-size:10px;font-weight:600">Severity</th>
          </tr>
        </thead>
        <tbody>
          ${logEntries.map((entry, i) => `
            <tr style="border-bottom:${i < logEntries.length - 1 ? '0.5px solid var(--color-border-tertiary)' : 'none'}">
              <td style="padding:10px 12px;font-size:10px;color:var(--color-text-tertiary)">${entry.date}</td>
              <td style="padding:10px 12px;font-size:11px;font-weight:600">${entry.user}</td>
              <td style="padding:10px 12px;font-size:10px">${entry.action}</td>
              <td style="padding:10px 12px;font-size:10px">${entry.status}</td>
              <td style="padding:10px 12px"><span class="badge ${entry.severity === 'critical' ? 'danger' : entry.severity === 'warning' ? 'warning' : 'success'}">${entry.severity}</span></td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>
  `
}

function renderAccountsTab(el) {
  const container = el.querySelector('#pa-tab-accounts')
  const searchId = 'pa-acct-search'

  let html = `
    <div class="filter-bar" style="margin-bottom:12px">
      <input type="text" class="form-input search" id="${searchId}" placeholder="Search accounts...">
      <select class="form-select" id="pa-risk-filter">
        <option value="all">All Risk</option>
        <option value="High">High</option>
        <option value="Medium">Medium</option>
        <option value="None">None</option>
      </select>
    </div>
    <div class="card" style="padding:0;overflow:hidden">
      <table>
        <thead><tr>
          <th style="width:22%">User</th>
          <th style="width:25%">Roles</th>
          <th style="width:20%">MFA Methods</th>
          <th style="width:10%">Risk</th>
          <th style="width:8%">PIM</th>
          <th style="width:10%">Type</th>
          <th style="width:5%"></th>
        </tr></thead>
        <tbody id="pa-acct-tbody">
          ${realPrivilegedAccounts.map(a => accountRow(a)).join('')}
        </tbody>
      </table>
    </div>
  `
  container.innerHTML = html

  wireAccountEvents(container)

  container.querySelector(`#${searchId}`)?.addEventListener('input', e => {
    const q = e.target.value.toLowerCase()
    const riskF = container.querySelector('#pa-risk-filter')?.value || 'all'
    filterAccounts(container, q, riskF)
  })
  container.querySelector('#pa-risk-filter')?.addEventListener('change', e => {
    const q = container.querySelector(`#${searchId}`)?.value.toLowerCase() || ''
    filterAccounts(container, q, e.target.value)
  })
}

function filterAccounts(container, q, risk) {
  const tbody = container.querySelector('#pa-acct-tbody')
  if (!tbody) return
  tbody.innerHTML = realPrivilegedAccounts
    .filter(a => {
      const matchQ = !q || a.upn.toLowerCase().includes(q) || a.name.toLowerCase().includes(q)
      const matchR = risk === 'all' || a.risk === risk
      return matchQ && matchR
    })
    .map(a => accountRow(a)).join('')
  wireAccountEvents(container)
}

function accountRow(a) {
  return `
    <tr class="pa-acct-row" data-id="${a.id}">
      <td>
        <div style="display:flex;align-items:center;gap:6px">
          <div class="user-avatar" style="background:${a.bg};width:24px;height:24px;font-size:9px">${a.isSPN ? 'SP' : a.name.split(' ').map(n=>n[0]).join('')}</div>
          <div>
            <div style="font-size:11px;font-weight:600">${a.name}</div>
            <div class="monospace" style="font-size:9px">${a.upn}</div>
          </div>
        </div>
      </td>
      <td><div class="pill-group">${a.roles.map(roleBadge).join('')}</div></td>
      <td><div class="pill-group">${mfaBadge(a.mfa)}</div></td>
      <td>${riskBadge(a.risk)}</td>
      <td>${a.pim ? '<span class="badge info">PIM</span>' : '<span class="badge neutral">None</span>'}</td>
      <td>${a.isSPN ? '<span class="badge purple">SPN</span>' : '<span class="badge neutral">User</span>'}</td>
      <td><button class="chevron-btn pa-acct-expand"><i class="ti ti-chevron-right"></i></button></td>
    </tr>
    <tr class="pa-acct-expand-row" data-id="${a.id}" style="display:none">
      <td colspan="7" style="padding:0">
        <div class="pa-expand-panel" style="display:block">
          <div class="grid-2" style="gap:16px">
            <div>
              <div class="section-heading">Roles & PIM</div>
              <table>
                <thead><tr><th>Role</th><th>Assignment</th><th>Expiry</th></tr></thead>
                <tbody>
                  ${a.roles.map(r => `
                    <tr><td>${r}</td>
                    <td>${a.pim ? '<span class="badge info">Eligible</span>' : '<span class="badge warning">Permanent</span>'}</td>
                    <td>${a.pim ? '8h session' : '<span style="color:var(--clr-danger-text)">Never</span>'}</td></tr>
                  `).join('')}
                </tbody>
              </table>
            </div>
            <div>
              <div class="section-heading">MFA & Risk</div>
              <table>
                <thead><tr><th>Method</th><th>Status</th></tr></thead>
                <tbody>
                  ${(a.mfa.length ? a.mfa : ['No MFA']).map(m => `
                    <tr><td>${m}</td><td>${m === 'No MFA' ? '<span class="badge danger">Missing</span>' : m === 'SMS' ? '<span class="badge warning">Weak</span>' : '<span class="badge success">Strong</span>'}</td></tr>
                  `).join('')}
                </tbody>
              </table>
              <div style="margin-top:8px">Risk level: ${riskBadge(a.risk)}</div>
            </div>
          </div>
          <div class="pa-action-row">
            <button class="btn btn-sm btn-danger pa-action" data-action="pwd-reset" data-id="${a.id}"><i class="ti ti-key"></i> Force pwd reset</button>
            ${!a.pim ? `<button class="btn btn-sm btn-warning pa-action" data-action="convert-pim" data-id="${a.id}"><i class="ti ti-shield-bolt"></i> Convert to PIM</button>` : ''}
            ${!a.mfa.length ? `<button class="btn btn-sm pa-action" data-action="mfa-enroll" data-id="${a.id}"><i class="ti ti-device-mobile"></i> Trigger MFA enrollment</button>` : ''}
            <button class="btn btn-sm btn-danger pa-action" data-action="remove" data-id="${a.id}"><i class="ti ti-user-minus"></i> Remove</button>
          </div>
        </div>
      </td>
    </tr>
  `
}

function wireAccountEvents(container) {
  container.querySelectorAll('.pa-acct-expand').forEach(btn => {
    btn.addEventListener('click', e => {
      e.stopPropagation()
      const row = btn.closest('.pa-acct-row')
      const id = row.dataset.id
      const expandRow = container.querySelector(`.pa-acct-expand-row[data-id="${id}"]`)
      const isOpen = expandRow.style.display !== 'none'
      expandRow.style.display = isOpen ? 'none' : 'table-row'
      btn.classList.toggle('open', !isOpen)
    })
  })

  container.querySelectorAll('.pa-action').forEach(btn => {
    btn.addEventListener('click', e => {
      e.stopPropagation()
      const { action, id } = btn.dataset
      const acct = PA_ACCOUNTS.find(a => a.id === id)
      if (action === 'pwd-reset') {
        showToast(`Password reset initiated for ${acct?.name}.`, 'warning')
        addLogEntry('risk', `Password reset forced for ${acct?.upn}`, 'Admin')
      } else if (action === 'convert-pim') {
        showToast(`${acct?.name} converted to PIM eligible assignment.`, 'success')
        addLogEntry('add', `${acct?.upn} converted to PIM eligible`, 'Admin')
      } else if (action === 'mfa-enroll') {
        showToast(`MFA enrollment triggered for ${acct?.name}.`, 'info')
        addLogEntry('mfa', `MFA enrollment triggered for ${acct?.upn}`, 'Admin')
      } else if (action === 'remove') {
        showToast(`${acct?.name} removed from privileged role.`, 'danger')
        addLogEntry('remove', `${acct?.upn} removed from privileged role`, 'Admin')
      }
    })
  })
}

function renderGroupsTab(el) {
  const container = el.querySelector('#pa-tab-groups')
  container.innerHTML = `
    <div class="filter-bar" style="margin-bottom:12px">
      <input type="text" class="form-input search" id="pa-grp-search" placeholder="Search groups...">
    </div>
    <div class="card" style="padding:0;overflow:hidden">
      <table>
        <thead><tr>
          <th style="width:25%">Group</th>
          <th style="width:20%">Roles</th>
          <th style="width:10%">Members</th>
          <th style="width:12%">PIM</th>
          <th style="width:18%">Last Activity</th>
          <th style="width:15%">Actions</th>
        </tr></thead>
        <tbody id="pa-grp-tbody">
          ${PA_GROUPS.map(g => groupRow(g)).join('')}
        </tbody>
      </table>
    </div>
  `
  wireGroupEvents(container)

  container.querySelector('#pa-grp-search').addEventListener('input', e => {
    const q = e.target.value.toLowerCase()
    container.querySelector('#pa-grp-tbody').innerHTML = PA_GROUPS
      .filter(g => !q || g.name.toLowerCase().includes(q))
      .map(g => groupRow(g)).join('')
    wireGroupEvents(container)
  })
}

function groupRow(g) {
  return `
    <tr class="pa-grp-row" data-id="${g.id}">
      <td><strong style="font-size:11px">${g.name}</strong></td>
      <td><div class="pill-group">${g.roles.map(r => `<span class="pa-role-chip">${r}</span>`).join('')}</div></td>
      <td>${g.members}</td>
      <td>${g.pim ? `<span class="badge info">PIM ${g.pimType}</span>` : '<span class="badge neutral">None</span>'}</td>
      <td style="font-size:10px;color:var(--color-text-tertiary)">${g.lastActivity}</td>
      <td>
        <button class="btn btn-xs pa-grp-expand" data-id="${g.id}">Members</button>
        <button class="btn btn-xs btn-danger pa-grp-untag" data-id="${g.id}" style="margin-left:4px">Untag</button>
      </td>
    </tr>
    <tr class="pa-grp-expand-row" data-id="${g.id}" style="display:none">
      <td colspan="6" style="padding:0">
        <div class="pa-expand-panel" style="display:block">
          <div class="section-heading">Members</div>
          ${g.ml.map(upn => `
            <div style="display:flex;align-items:center;justify-content:space-between;padding:5px 0;border-bottom:0.5px solid var(--color-border-tertiary)">
              <span class="monospace">${upn}</span>
              <button class="btn btn-xs btn-danger pa-grp-remove-member" data-grp="${g.id}" data-upn="${upn}"><i class="ti ti-user-minus"></i> Remove</button>
            </div>
          `).join('')}
        </div>
      </td>
    </tr>
  `
}

function wireGroupEvents(container) {
  container.querySelectorAll('.pa-grp-expand').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = btn.dataset.id
      const row = container.querySelector(`.pa-grp-expand-row[data-id="${id}"]`)
      row.style.display = row.style.display === 'none' ? 'table-row' : 'none'
    })
  })
  container.querySelectorAll('.pa-grp-untag').forEach(btn => {
    btn.addEventListener('click', () => {
      const g = PA_GROUPS.find(g => g.id === btn.dataset.id)
      showToast(`${g?.name} untagged as privileged group.`, 'warning')
      addLogEntry('remove', `Group "${g?.name}" untagged`, 'Admin')
    })
  })
  container.querySelectorAll('.pa-grp-remove-member').forEach(btn => {
    btn.addEventListener('click', () => {
      showToast(`${btn.dataset.upn} removed from group.`, 'success')
      addLogEntry('remove', `${btn.dataset.upn} removed from group`, 'Admin')
    })
  })
}

// Risk scoring engine for workload identities
function calculateRiskScore(app) {
  let score = 0
  const factors = []

  // Critical permissions (highest weight)
  const criticalPermissions = [
    'Directory.ReadWrite.All',
    'RoleManagement.ReadWrite.Directory',
    'User.ReadWrite.All',
    'Group.ReadWrite.All',
    'AppRoleAssignment.ReadWrite.All',
    'Application.ReadWrite.All',
    'Application.ReadWrite.OwnedBy',
    'Policy.ReadWrite.ConditionalAccess',
    'Device.ReadWrite.All',
    'DeviceManagementConfiguration.ReadWrite.All',
    'DeviceManagementManagedDevices.ReadWrite.All',
    'Organization.ReadWrite.All',
    'Domain.ReadWrite.All',
    'IdentityRiskyUser.ReadWrite.All',
    'IdentityProvider.ReadWrite.All'
  ]

  // Exchange/SharePoint/Teams/Security permissions
  const dangerousPermissions = [
    'Mail.ReadWrite',
    'Mail.Send',
    'Mail.ReadWrite.All',
    'Sites.FullControl.All',
    'Sites.Manage.All',
    'Sites.ReadWrite.All',
    'ChannelSettings.ReadWrite.All',
    'TeamSettings.ReadWrite.All',
    'Chat.ReadWrite.All',
    'Calls.AccessMedia.All',
    'SecurityEvents.ReadWrite.All',
    'SecurityIncident.ReadWrite.All',
    'ThreatSubmission.ReadWrite.All'
  ]

  // Check permissions
  const appPerms = app.consentedPermissions || []
  appPerms.forEach(perm => {
    if (criticalPermissions.includes(perm.name)) {
      score += 100
      factors.push(`Critical permission: ${perm.name}`)
    } else if (dangerousPermissions.includes(perm.name)) {
      score += 85
      factors.push(`Dangerous permission: ${perm.name}`)
    }
  })

  // Role checks
  if (app.hasRole && app.roles.includes('Global Administrator')) {
    score += 100
    factors.push('Assigned Global Administrator role')
  }
  if (app.hasRole && app.roles.some(r => ['Privileged Role Administrator', 'Conditional Access Administrator', 'Security Administrator'].includes(r))) {
    score += 95
    factors.push(`Privileged role assigned: ${app.roles.join(', ')}`)
  }

  // Credential checks
  if (app.secretAgeInDays && app.secretAgeInDays > 365) {
    score += 20
    factors.push(`Secret not rotated in ${app.secretAgeInDays} days`)
  }
  if (app.secretExpiresInDays && app.secretExpiresInDays < 30 && app.secretExpiresInDays > 0) {
    score += 20
    factors.push(`Secret expires in ${app.secretExpiresInDays} days`)
  }

  // Ownership checks
  if (app.ownerCount === 0) {
    score += 25
    factors.push('No owners assigned')
  }

  // Usage checks - handle three cases:
  // -1 = App Registration Only (can't sign in)
  // null = Service Principal outside retention window
  // 0+ = Actual days since last sign-in
  if (app.lastSignInDaysAgo === -1) {
    // App Registration without Service Principal - cannot be used
    score += 10 // Lower penalty than unused app
    factors.push('No Service Principal exists')
  } else if (app.lastSignInDaysAgo !== null && app.lastSignInDaysAgo > 90) {
    // Service Principal with no recent activity
    score += 30
    factors.push(`Last activity ${app.lastSignInDaysAgo} days ago`)
  }

  // Multiple high-risk permissions
  if (appPerms.filter(p => criticalPermissions.includes(p.name)).length > 3) {
    score += 30
    factors.push('Multiple critical permissions detected')
  }

  return {
    score: Math.min(score, 200),
    factors,
    severity: score >= 150 ? 'Critical' : score >= 100 ? 'High' : score >= 50 ? 'Medium' : 'Low'
  }
}

function getDemoWorkloadIdentities() {
  return [
    {
      id: 'app-1',
      name: 'Microsoft Graph Management API',
      appId: '00000003-0000-0000-c000-000000000000',
      lastUsed: '2026-07-27 08:15',
      createdDate: '2026-01-15',
      ownerCount: 1,
      secretAgeInDays: 420,
      secretExpiresInDays: -45,
      lastSignInDaysAgo: 2,
      consentedPermissions: [
        { name: 'Directory.ReadWrite.All', type: 'Application', risk: 'Critical' },
        { name: 'User.ReadWrite.All', type: 'Application', risk: 'Critical' },
        { name: 'Group.ReadWrite.All', type: 'Application', risk: 'Critical' },
        { name: 'RoleManagement.ReadWrite.Directory', type: 'Application', risk: 'Critical' },
        { name: 'Organization.ReadWrite.All', type: 'Application', risk: 'Critical' },
        { name: 'AppRoleAssignment.ReadWrite.All', type: 'Application', risk: 'Critical' },
        { name: 'Application.ReadWrite.All', type: 'Application', risk: 'Critical' },
        { name: 'Policy.ReadWrite.ConditionalAccess', type: 'Application', risk: 'Critical' }
      ]
    },
    {
      id: 'app-2',
      name: 'Azure Service Management API',
      appId: '797f4846-ba00-4fd7-ba43-dac1f8f63013',
      lastUsed: '2026-07-26 14:30',
      createdDate: '2026-02-20',
      ownerCount: 0,
      secretAgeInDays: 180,
      secretExpiresInDays: 185,
      lastSignInDaysAgo: 1,
      hasRole: true,
      roles: ['Application Administrator'],
      consentedPermissions: [
        { name: 'Directory.ReadWrite.All', type: 'Application', risk: 'Critical' },
        { name: 'Application.ReadWrite.All', type: 'Application', risk: 'Critical' },
        { name: 'Policy.ReadWrite.ConditionalAccess', type: 'Application', risk: 'Critical' },
        { name: 'Device.ReadWrite.All', type: 'Application', risk: 'Critical' }
      ]
    },
    {
      id: 'app-3',
      name: 'Exchange Online Management',
      appId: 'a7f3f0ba-63d3-4ef0-a6f8-af8f87c2eb4f',
      lastUsed: '2026-07-27 10:45',
      createdDate: '2026-03-10',
      ownerCount: 1,
      secretAgeInDays: 250,
      secretExpiresInDays: 115,
      lastSignInDaysAgo: 0,
      consentedPermissions: [
        { name: 'Mail.ReadWrite.All', type: 'Application', risk: 'Critical' },
        { name: 'Mail.Send', type: 'Application', risk: 'Critical' },
        { name: 'MailboxSettings.ReadWrite', type: 'Application', risk: 'Critical' },
        { name: 'User.ReadWrite.All', type: 'Application', risk: 'Critical' }
      ]
    },
    {
      id: 'app-4',
      name: 'SharePoint Admin API',
      appId: '8e8a0e31-be67-4be1-9bba-4491c06a7300',
      lastUsed: '2026-07-25 16:20',
      createdDate: '2026-04-05',
      ownerCount: 2,
      secretAgeInDays: 95,
      secretExpiresInDays: 270,
      lastSignInDaysAgo: 2,
      consentedPermissions: [
        { name: 'Sites.FullControl.All', type: 'Application', risk: 'Critical' },
        { name: 'Sites.Manage.All', type: 'Application', risk: 'Critical' },
        { name: 'Files.ReadWrite.All', type: 'Application', risk: 'Critical' }
      ]
    },
    {
      id: 'app-5',
      name: 'Teams Management Service',
      appId: '1b730954-1685-4b74-9bda-da7b524db900',
      lastUsed: '2026-05-10 09:50',
      createdDate: '2026-05-12',
      ownerCount: 0,
      secretAgeInDays: 765,
      secretExpiresInDays: -200,
      lastSignInDaysAgo: 78,
      consentedPermissions: [
        { name: 'TeamSettings.ReadWrite.All', type: 'Application', risk: 'Critical' },
        { name: 'ChannelSettings.ReadWrite.All', type: 'Application', risk: 'Critical' },
        { name: 'Chat.ReadWrite.All', type: 'Application', risk: 'Critical' }
      ]
    },
    {
      id: 'app-6',
      name: 'Compliance Center API',
      appId: '3239592c-1b4f-4746-a8ac-fd016c2d9f56',
      lastUsed: '2026-07-22 13:15',
      createdDate: '2026-06-08',
      ownerCount: 1,
      secretAgeInDays: 45,
      secretExpiresInDays: 320,
      lastSignInDaysAgo: 5,
      consentedPermissions: [
        { name: 'SecurityEvents.ReadWrite.All', type: 'Application', risk: 'Critical' },
        { name: 'SecurityIncident.ReadWrite.All', type: 'Application', risk: 'Critical' },
        { name: 'ThreatSubmission.ReadWrite.All', type: 'Application', risk: 'Critical' }
      ]
    },
  ]
}

function renderWorkloadIdentityTab(el) {
  const container = el.querySelector('#pa-tab-workload')
  if (!container) {
    console.warn('⚠️ Workload identity container not found')
    return
  }

  // Use real workload identities from API if loaded, or fallback to demo data
  // Important: empty array is still valid real data (means 0 privileged apps), don't fall back
  const highPrivilegeApps = workloadDataLoaded ? workloadIdentities : getDemoWorkloadIdentities()

  // Handle empty result (0 privileged apps found)
  if (highPrivilegeApps.length === 0 && workloadDataLoaded) {
    let html = `
      <div style="padding:20px;text-align:center;background:var(--color-background-secondary);border-radius:6px;border:1px solid var(--clr-success-bg)">
        <div style="font-size:16px;font-weight:600;color:var(--clr-success-text);margin-bottom:8px">✅ No Privileged Workload Identities Detected</div>
        <div style="font-size:12px;color:var(--color-text-secondary);margin-bottom:12px">Your tenant has no service principals with privileged permissions or roles assigned.</div>
        <div style="font-size:11px;color:var(--color-text-tertiary);padding:12px;background:var(--color-background-primary);border-radius:4px;border-left:3px solid var(--clr-success-text)">
          <strong>What this means:</strong> No apps have been granted critical permissions like Directory.ReadWrite.All, Application.ReadWrite.All, or privileged directory roles. This is good security practice!
        </div>
      </div>
    `
    container.innerHTML = html
    return
  }

  // Calculate risk scores for all apps and enrich with risk factors
  const appsWithScores = highPrivilegeApps.map(app => {
    const riskData = calculateRiskScore(app)
    return {
      ...app,
      riskData,
      permissions: app.consentedPermissions?.length || 0
    }
  })

  const criticalCount = appsWithScores.filter(a => a.riskData.severity === 'Critical').length
  const highCount = appsWithScores.filter(a => a.riskData.severity === 'High').length
  const mediumCount = appsWithScores.filter(a => a.riskData.severity === 'Medium').length

  let html = `
    <!-- Information Banner -->
    <div style="background:#E3F2FD;border-radius:6px;padding:12px;margin-bottom:16px;border-left:4px solid #1565C0;border-right:1px solid #BBDEFB">
      <div style="display:flex;gap:8px;align-items:flex-start">
        <div style="font-size:16px;color:#1565C0;margin-top:2px">ℹ️</div>
        <div>
          <div style="font-size:12px;font-weight:600;color:#0D47A1;margin-bottom:4px">Privileged Workload Identities</div>
          <div style="font-size:11px;color:#1565C0;line-height:1.5">
            Only applications with privileged permissions or directory roles are displayed. Regular monitoring and auditing of these identities is recommended.
          </div>
        </div>
      </div>
    </div>

    <!-- Cache Status & Refresh -->
    <div style="background:#F5F5F5;border-radius:6px;padding:12px;margin-bottom:16px;border-left:3px solid #1976D2;display:flex;justify-content:space-between;align-items:center">
      <div style="font-size:11px;color:#666">
        <div>✅ Data cached${workloadIdentities.length > 0 ? ': ' + workloadIdentities.length + ' apps' : ''}</div>
        <div style="margin-top:4px;font-size:10px">Last updated: <span id="cache-timestamp">fetching...</span></div>
      </div>
      <button id="refresh-workload-btn" style="padding:8px 16px;background:#1976D2;color:white;border:none;border-radius:4px;cursor:pointer;font-size:12px;font-weight:600;white-space:nowrap;transition:all 0.2s;margin-left:12px">
        🔄 Refresh Now
      </button>
    </div>

    <div style="display:flex;gap:12px;margin-bottom:16px;flex-wrap:wrap">
      <div class="card" style="flex:1;min-width:140px;padding:12px;background:var(--color-bg-secondary);text-align:center">
        <div style="font-size:24px;font-weight:700;color:#D32F2F">${criticalCount}</div>
        <div style="font-size:11px;color:var(--color-text-secondary);margin-top:4px">Critical Risk</div>
      </div>
      <div class="card" style="flex:1;min-width:140px;padding:12px;background:var(--color-bg-secondary);text-align:center">
        <div style="font-size:24px;font-weight:700;color:var(--clr-danger-text)">${highCount}</div>
        <div style="font-size:11px;color:var(--color-text-secondary);margin-top:4px">High Risk</div>
      </div>
      <div class="card" style="flex:1;min-width:140px;padding:12px;background:var(--color-bg-secondary);text-align:center">
        <div style="font-size:24px;font-weight:700;color:var(--clr-warning-text)">${mediumCount}</div>
        <div style="font-size:11px;color:var(--color-text-secondary);margin-top:4px">Medium Risk</div>
      </div>
      <div class="card" style="flex:1;min-width:140px;padding:12px;background:var(--color-bg-secondary);text-align:center">
        <div style="font-size:24px;font-weight:700;color:var(--color-primary)">${highPrivilegeApps.length}</div>
        <div style="font-size:11px;color:var(--color-text-secondary);margin-top:4px">Total Identities</div>
      </div>
    </div>

    <div class="card" style="padding:0;overflow:hidden">
      <table style="width:100%;border-collapse:collapse">
        <thead style="background:var(--color-background-secondary)">
          <tr>
            <th style="padding:10px 12px;text-align:left;font-size:10px;font-weight:600">Workload Identity</th>
            <th style="padding:10px 12px;text-align:center;font-size:10px;font-weight:600">Permissions</th>
            <th style="padding:10px 12px;text-align:center;font-size:10px;font-weight:600">Risk Score</th>
            <th style="padding:10px 12px;text-align:center;font-size:10px;font-weight:600">Severity</th>
            <th style="padding:10px 12px;text-align:center;font-size:10px;font-weight:600">Last Activity</th>
            <th style="padding:10px 12px;text-align:center;font-size:10px;font-weight:600">Owners</th>
            <th style="padding:10px 12px;text-align:center;font-size:10px;font-weight:600">User Assignment Required</th>
          </tr>
        </thead>
        <tbody>
  `

  appsWithScores.forEach((app, idx) => {
    const risk = app.riskData
    const riskColor = risk.severity === 'Critical' ? '#D32F2F' : risk.severity === 'High' ? 'var(--clr-danger-text)' : risk.severity === 'Medium' ? 'var(--clr-warning-text)' : 'var(--clr-success-text)'
    const riskBg = risk.severity === 'Critical' ? '#FFEBEE' : risk.severity === 'High' ? 'var(--clr-danger-bg)' : risk.severity === 'Medium' ? 'var(--clr-warning-bg)' : 'var(--clr-success-bg)'

    // Format credential status
    let credentialStatus = '✅ Valid'
    if (app.secretAgeInDays > 365) {
      credentialStatus = '⚠️ Old'
    } else if (app.secretExpiresInDays < 30 && app.secretExpiresInDays > 0) {
      credentialStatus = '⚠️ Exp. Soon'
    } else if (app.secretExpiresInDays < 0) {
      credentialStatus = '❌ Expired'
    }

    html += `
          <tr style="border-bottom:0.5px solid var(--color-border-tertiary);${idx % 2 === 0 ? 'background:var(--color-background-primary)' : 'background:var(--color-background-secondary)'}">
            <td style="padding:10px 12px;vertical-align:top;font-weight:500;color:var(--color-primary);font-size:11px;cursor:pointer" onclick="window.showAppPermissionsModal('${app.id}')" class="workload-app-name" data-app-id="${app.id}" data-app-name="${app.name}" data-app-permissions='${JSON.stringify(app.consentedPermissions)}' data-risk-factors='${JSON.stringify(risk.factors)}'>
              <span style="text-decoration:underline">${app.name}</span>
              ${app.isAppRegistrationOnly ? '<span style="display:inline-block;margin-left:6px;background:#FFF3E0;color:#E65100;padding:2px 6px;border-radius:2px;font-size:8px;font-weight:600">APP REG ONLY</span>' : ''}
              <div style="font-size:9px;color:var(--color-text-tertiary);margin-top:2px">${app.isAppRegistrationOnly ? '⚠️ No Service Principal' : credentialStatus}</div>
            </td>
            <td style="padding:10px 12px;vertical-align:top;text-align:center">
              <span style="display:inline-block;background:var(--color-background-secondary);border:0.5px solid var(--color-border-tertiary);padding:4px 8px;border-radius:3px;font-size:10px;font-weight:600">${app.permissions}</span>
            </td>
            <td style="padding:10px 12px;text-align:center;vertical-align:top">
              <div style="font-size:10px;font-weight:600;color:${riskColor}">${risk.score}</div>
              <div style="font-size:9px;color:var(--color-text-tertiary)">Score</div>
            </td>
            <td style="padding:10px 12px;text-align:center;vertical-align:top">
              <span style="display:inline-block;background:${riskBg};color:${riskColor};padding:4px 8px;border-radius:3px;font-size:10px;font-weight:600">${risk.severity}</span>
            </td>
            <td style="padding:10px 12px;vertical-align:top;text-align:center">
              <span style="font-size:10px;color:var(--color-text-secondary)">
                ${app.lastSignInDaysAgo === -1 ? '❌ N/A (No SP)' :
                  app.lastSignInDaysAgo === null ? '⏱️ Outside retention' :
                  app.lastSignInDaysAgo === 0 ? 'Today' :
                  app.lastSignInDaysAgo === 1 ? 'Yesterday' :
                  app.lastSignInDaysAgo + 'd ago'}
              </span>
            </td>
            <td style="padding:10px 12px;vertical-align:top;text-align:center">
              <span style="display:inline-block;background:${app.ownerCount === 0 ? '#FFEBEE' : 'var(--color-background-secondary)'};color:${app.ownerCount === 0 ? '#D32F2F' : 'var(--color-text-secondary)'};padding:3px 6px;border-radius:2px;font-size:9px">${app.ownerCount} ${app.ownerCount === 1 ? 'owner' : 'owners'}</span>
            </td>
            <td style="padding:10px 12px;vertical-align:top;text-align:center">
              <span style="display:inline-block;background:${app.userAssignmentRequired ? '#E3F2FD' : '#F5F5F5'};color:${app.userAssignmentRequired ? '#1565C0' : '#757575'};padding:4px 8px;border-radius:3px;font-size:10px;font-weight:600">${app.userAssignmentRequired ? '✅ Enabled' : '❌ Disabled'}</span>
            </td>
          </tr>
    `
  })

  html += `
        </tbody>
      </table>
    </div>
  `

  container.innerHTML = html

  // Attach event listeners
  const cacheTs = highPrivilegeApps.length > 0 ? localStorage.getItem('workload-cache-timestamp') : null
  const cacheEl = container.querySelector('#cache-timestamp')
  if (cacheEl && cacheTs) {
    const date = new Date(cacheTs)
    cacheEl.textContent = date.toLocaleTimeString()
  }

  const refreshBtn = container.querySelector('#refresh-workload-btn')
  if (refreshBtn) {
    refreshBtn.addEventListener('click', async () => {
      refreshBtn.disabled = true
      refreshBtn.textContent = '⏳ Refreshing...'

      try {
        const response = await fetch('/api/workload-identities/refresh', { method: 'POST' })
        const result = await response.json()

        if (result.success) {
          showToast('🔄 Refresh job started. Data will update shortly.', 'info')
          refreshBtn.textContent = '⏳ Running...'
          // Poll for completion (check every 5 seconds for up to 2 minutes)
          let attempts = 0
          const pollInterval = setInterval(async () => {
            attempts++
            try {
              const statusResp = await fetch('/api/workload-identities/risk-assessment')
              const statusData = await statusResp.json()
              const summary = statusData.data?.summary

              if (summary && !summary.isRunning) {
                clearInterval(pollInterval)
                showToast('✅ Workload identities refreshed!', 'success')
                refreshBtn.textContent = '🔄 Refresh Now'
                refreshBtn.disabled = false
                // Reload the page or update the data
                location.reload()
              }
            } catch (err) {
              console.error('Error polling status:', err)
            }

            if (attempts > 24) { // 2 minutes timeout
              clearInterval(pollInterval)
              refreshBtn.textContent = '🔄 Refresh Now'
              refreshBtn.disabled = false
              showToast('⏱️ Refresh timeout. Check back in a moment.', 'warning')
            }
          }, 5000)
        } else {
          showToast('❌ ' + (result.error || 'Refresh failed'), 'error')
          refreshBtn.textContent = '🔄 Refresh Now'
          refreshBtn.disabled = false
        }
      } catch (error) {
        showToast('❌ ' + error.message, 'error')
        refreshBtn.textContent = '🔄 Refresh Now'
        refreshBtn.disabled = false
      }
    })
  }
}

function renderDemoWorkloadIdentityTab(el) {
  renderWorkloadIdentityTab(el)
}

// Modal for viewing app permissions
window.showAppPermissionsModal = function(appId) {
  const appElement = document.querySelector(`[data-app-id="${appId}"]`)
  if (!appElement) return

  const appName = appElement.dataset.appName
  const permissions = JSON.parse(appElement.dataset.appPermissions)
  const riskFactors = JSON.parse(appElement.dataset.riskFactors || '[]')

  const riskLevels = {
    'Critical': { color: '#D32F2F', bg: '#FFEBEE' },
    'High': { color: '#F57C00', bg: '#FFF3E0' },
    'Medium': { color: '#F9A825', bg: '#FFFBF0' },
    'Low': { color: '#388E3C', bg: '#F1F8E9' }
  }

  let permissionsHtml = permissions.map((perm, idx) => {
    const risk = perm.risk || 'Unknown'
    const riskStyle = riskLevels[risk] || { color: '#666', bg: '#f5f5f5' }

    return `
      <tr style="border-bottom:0.5px solid var(--color-border-tertiary);${idx % 2 === 0 ? 'background:var(--color-background-primary)' : 'background:var(--color-background-secondary)'}">
        <td style="padding:10px 12px;vertical-align:top;font-weight:500;color:var(--color-text-primary);font-size:11px">${perm.name}</td>
        <td style="padding:10px 12px;vertical-align:top;text-align:center">
          <span style="display:inline-block;background:var(--color-background-secondary);border:0.5px solid var(--color-border-tertiary);padding:3px 8px;border-radius:2px;font-size:9px">${perm.type}</span>
        </td>
        <td style="padding:10px 12px;vertical-align:top;text-align:center">
          <span style="display:inline-block;background:${riskStyle.bg};color:${riskStyle.color};padding:3px 8px;border-radius:2px;font-size:9px;font-weight:600">${risk}</span>
        </td>
      </tr>
    `
  }).join('')

  const modal = document.createElement('div')
  modal.id = 'workload-permissions-modal'
  modal.style.cssText = `
    position:fixed;top:0;left:0;right:0;bottom:0;background:rgba(0,0,0,0.5);
    display:flex;align-items:center;justify-content:center;z-index:9999
  `

  modal.innerHTML = `
    <div style="background:white;border-radius:8px;box-shadow:0 10px 40px rgba(0,0,0,0.2);width:90%;max-width:800px;max-height:80vh;overflow:auto">
      <div style="padding:20px;border-bottom:1px solid var(--color-border-tertiary);display:flex;justify-content:space-between;align-items:center;position:sticky;top:0;background:white">
        <div>
          <h2 style="margin:0;font-size:16px;font-weight:600;color:var(--color-text-primary)">${appName}</h2>
          <p style="margin:4px 0 0 0;font-size:11px;color:var(--color-text-secondary)">Consented Permissions (${permissions.length})</p>
        </div>
        <button onclick="document.getElementById('workload-permissions-modal').remove()" style="border:none;background:none;cursor:pointer;font-size:24px;color:var(--color-text-secondary)">×</button>
      </div>

      <div style="padding:20px">
        ${riskFactors.length > 0 ? `
          <div style="margin-bottom:16px;padding:12px;background:#FFEBEE;border-radius:4px;border-left:4px solid #D32F2F">
            <div style="font-weight:600;color:#B71C1C;font-size:11px;margin-bottom:8px">🚨 Risk Factors Detected:</div>
            <ul style="margin:0;padding:0 0 0 20px;font-size:10px;color:#C62828">
              ${riskFactors.map(f => `<li style="margin:4px 0">${f}</li>`).join('')}
            </ul>
          </div>
        ` : ''}

        <div style="margin-bottom:16px">
          <h3 style="margin:0 0 12px 0;font-size:12px;font-weight:600;color:var(--color-text-primary)">Consented Permissions (${permissions.length})</h3>
          <div class="card" style="padding:0;overflow:hidden">
            <table style="width:100%;border-collapse:collapse;font-size:11px">
              <thead>
                <tr style="background:var(--color-background-secondary)">
                  <th style="padding:10px 12px;text-align:left;font-weight:600;color:var(--color-text-primary)">Permission Name</th>
                  <th style="padding:10px 12px;text-align:center;font-weight:600;color:var(--color-text-primary);width:100px">Type</th>
                  <th style="padding:10px 12px;text-align:center;font-weight:600;color:var(--color-text-primary);width:90px">Risk</th>
                </tr>
              </thead>
              <tbody>
                ${permissionsHtml}
              </tbody>
            </table>
          </div>
        </div>

        <div style="padding:12px;background:var(--color-background-secondary);border-radius:4px;border-left:3px solid var(--clr-warning-text)">
          <p style="margin:0;font-size:10px;color:var(--color-text-secondary)">
            <strong>📋 Reference Categories:</strong> These permissions are based on Microsoft Entra ID risk assessment framework including Directory, Application, Role Management, Mail, SharePoint, Teams, and Security permissions.
          </p>
        </div>
      </div>
    </div>
  `

  document.body.appendChild(modal)

  // Close on background click
  modal.addEventListener('click', (e) => {
    if (e.target === modal) modal.remove()
  })
}

function renderLogTab(el) {
  const container = el.querySelector('#pa-tab-log')
  redrawLog(container)
}

function redrawLog(container) {
  container.innerHTML = `
    <div class="card" style="padding:12px 16px">
      <div class="card-title mb-3"><i class="ti ti-history"></i> Membership Change Log</div>
      ${logEntries.map(e => `
        <div class="log-entry-row">
          <div class="log-icon-wrap" style="background:${e.bg}">
            <i class="ti ${e.icls}" style="color:${e.ic}"></i>
          </div>
          <div style="flex:1">
            <div style="font-size:11px;font-weight:600">${e.title}</div>
            <div style="font-size:10px;color:var(--color-text-secondary);margin-top:1px">${e.detail}</div>
            <div style="font-size:9px;color:var(--color-text-tertiary);margin-top:2px">By ${e.by} · ${e.time}</div>
          </div>
        </div>
      `).join('')}
    </div>
  `
}

function addLogEntry(type, msg, by) {
  const icons = { add: 'ti-user-plus', remove: 'ti-user-minus', risk: 'ti-alert-triangle', mfa: 'ti-shield', tag: 'ti-tag', review: 'ti-clipboard-check' }
  const colors = { add: 'var(--clr-info-text)', remove: 'var(--clr-warning-text)', risk: 'var(--clr-danger-text)', mfa: 'var(--clr-success-text)', tag: 'var(--clr-info-text)', review: 'var(--clr-success-text)' }
  const bgs = { add: 'var(--clr-info-bg)', remove: 'var(--clr-warning-bg)', risk: 'var(--clr-danger-bg)', mfa: 'var(--clr-success-bg)', tag: 'var(--clr-info-bg)', review: 'var(--clr-success-bg)' }
  logEntries.unshift({
    id: Date.now(),
    type,
    icls: icons[type] || 'ti-info-circle',
    ic: colors[type] || 'var(--clr-info-text)',
    bg: bgs[type] || 'var(--clr-info-bg)',
    title: msg,
    detail: msg,
    by,
    time: 'Just now',
  })
  const logTab = document.querySelector('#pa-tab-log')
  if (logTab) redrawLog(logTab)
}
