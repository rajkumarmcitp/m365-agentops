import { PA_ACCOUNTS, PA_GROUPS, PA_LOG } from '../data/pa-data.js'
import { showToast } from '../components/toast.js'
import { getPrivilegedAccounts } from '../lib/api-client.js'

let logEntries = [...PA_LOG]
let realPrivilegedAccounts = PA_ACCOUNTS
let accountsSummary = { totalAccounts: 0, atRisk: 0, noMFA: 0, permanentRoles: 0, servicePrincipals: 0 }

export async function initPrivAccts() {
  const el = document.getElementById('page-privaccts')
  if (!el) return

  try {
    console.log('📡 Fetching real privileged accounts from Azure AD...')
    const result = await getPrivilegedAccounts()
    if (result.success && result.data?.accounts) {
      realPrivilegedAccounts = result.data.accounts
      accountsSummary = result.data.summary
      console.log(`✅ Loaded ${realPrivilegedAccounts.length} real privileged accounts`)
    }
  } catch (error) {
    console.warn('⚠️ Using demo privileged accounts:', error.message)
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
      <div class="kpi-tile"><div class="kpi-value info">${PA_GROUPS.length}</div><div class="kpi-label">Groups</div></div>
      <div class="kpi-tile"><div class="kpi-value warning">${accountsSummary.permanentRoles}</div><div class="kpi-label">Permanent</div></div>
    </div>

    <div class="tabs" id="pa-tabs">
      <button class="tab-btn active" data-tab="accounts">Privileged Accounts</button>
      <button class="tab-btn" data-tab="groups">Privileged Groups</button>
      <button class="tab-btn" data-tab="log">Membership Log</button>
    </div>

    <div class="tab-panel active" id="pa-tab-accounts"></div>
    <div class="tab-panel" id="pa-tab-groups"></div>
    <div class="tab-panel" id="pa-tab-log"></div>
  `

  renderAccountsTab(el)
  renderGroupsTab(el)
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
