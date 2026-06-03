import { state, saveState } from '../app.js'
import { showToast } from '../components/toast.js'
import { MC_MESSAGES, SVC_HEALTH, SVC_META, DIGEST_STATS } from '../data/msgcenter-data.js'

// ============================================================
// Local state (persisted in app state)
// ============================================================
function getMsgState() {
  if (!state.mcMessages) {
    state.mcMessages = MC_MESSAGES.map(m => ({ id: m.id, status: m.status, tasksCreated: false }))
  }
  return state.mcMessages
}

function getMsgStatus(id) {
  return getMsgState().find(s => s.id === id)?.status || 'new'
}

function setMsgStatus(id, status) {
  const s = getMsgState().find(s => s.id === id)
  if (s) s.status = status
  else getMsgState().push({ id, status, tasksCreated: false })
  saveState()
}

function getMsgTasksCreated(id) {
  return getMsgState().find(s => s.id === id)?.tasksCreated || false
}

function setMsgTasksCreated(id) {
  const s = getMsgState().find(s => s.id === id)
  if (s) s.tasksCreated = true
  saveState()
}

// ============================================================
// Filter state
// ============================================================
let activeTab = 'all'
let filters = { search: '', service: 'all', category: 'all', actionRequired: 'all', status: 'all' }
let expandedIds = new Set()
let digestOpen = false

const TABS = [
  { id: 'all',       label: 'All Messages',      icon: 'ti-inbox' },
  { id: 'health',    label: 'Service Health',     icon: 'ti-heartbeat' },
  { id: 'required',  label: 'Action Required',    icon: 'ti-alert-circle', badgeKey: 'actionRequired' },
  { id: 'upcoming',  label: 'Upcoming Changes',   icon: 'ti-calendar-event' },
  { id: 'copilot',   label: 'Copilot',            icon: 'ti-sparkles' },
  { id: 'licenses',  label: 'License Alerts',     icon: 'ti-license' },
  { id: 'security',  label: 'Security',           icon: 'ti-shield-exclamation' },
]

const SERVICES = ['All Services', 'Exchange Online', 'Microsoft Teams', 'SharePoint Online', 'OneDrive', 'Microsoft Entra ID', 'Microsoft Intune', 'Microsoft Copilot', 'Power Platform', 'Microsoft Defender', 'Microsoft 365']
const CATEGORIES = [
  { val: 'all', label: 'All Categories' },
  { val: 'planForChange', label: 'Plan for Change' },
  { val: 'preventOrFixIssue', label: 'Prevent or Fix Issue' },
  { val: 'stayInformed', label: 'Stay Informed' },
]

// ============================================================
// Entry
// ============================================================
export function initMsgCenter() {
  const el = document.getElementById('page-msgcenter')
  if (!el) return
  expandedIds = new Set()
  digestOpen = false
  render(el)
}

// ============================================================
// Main render
// ============================================================
function render(el) {
  const actionRequiredCount = MC_MESSAGES.filter(m => m.actionRequired && getMsgStatus(m.id) !== 'actioned').length
  const newCount = MC_MESSAGES.filter(m => getMsgStatus(m.id) === 'new').length
  const activeIncidents = SVC_HEALTH.filter(h => h.status !== 'resolved').length

  el.innerHTML = `
    <div class="page-header">
      <div>
        <div class="page-title"><i class="ti ti-antenna"></i> Change Intelligence</div>
        <div class="page-subtitle">
          Graph: /admin/serviceAnnouncement/messages · Last sync: Today at 08:45 · ${MC_MESSAGES.length} messages
        </div>
      </div>
      <div class="page-actions">
        <button class="btn" id="mc-sync"><i class="ti ti-refresh"></i> Sync now</button>
        <button class="btn" id="mc-digest"><i class="ti ti-file-text"></i> Weekly digest</button>
        <button class="btn btn-primary" id="mc-create-tasks"><i class="ti ti-circle-plus"></i> Create tasks (${actionRequiredCount})</button>
      </div>
    </div>

    <div class="kpi-row">
      <div class="kpi-tile">
        <div class="kpi-value info">${MC_MESSAGES.length}</div>
        <div class="kpi-label">Total Messages</div>
      </div>
      <div class="kpi-tile">
        <div class="kpi-value danger">${actionRequiredCount}</div>
        <div class="kpi-label">Action Required</div>
      </div>
      <div class="kpi-tile">
        <div class="kpi-value warning">${MC_MESSAGES.filter(m => m.severity === 'high').length}</div>
        <div class="kpi-label">High Severity</div>
      </div>
      <div class="kpi-tile">
        <div class="kpi-value info">${MC_MESSAGES.filter(m => m.targetRelease).length}</div>
        <div class="kpi-label">Upcoming Changes</div>
      </div>
      <div class="kpi-tile">
        <div class="kpi-value ${activeIncidents > 0 ? 'danger' : 'success'}">${activeIncidents > 0 ? activeIncidents : '✓'}</div>
        <div class="kpi-label">Active Incidents</div>
      </div>
      <div class="kpi-tile">
        <div class="kpi-value success">${MC_MESSAGES.filter(m => getMsgStatus(m.id) === 'actioned').length}</div>
        <div class="kpi-label">Actioned</div>
      </div>
    </div>

    <!-- Graph API source banner -->
    <div style="display:flex;align-items:center;gap:8px;padding:8px 12px;background:var(--color-background-primary);border:0.5px solid var(--color-border-secondary);border-radius:var(--border-radius-md);margin-bottom:16px;font-size:10px;color:var(--color-text-tertiary)">
      <span class="status-dot active pulse"></span>
      <span><strong style="color:var(--color-text-secondary)">Graph API</strong> · GET /admin/serviceAnnouncement/messages</span>
      <span style="margin-left:8px">|</span>
      <span>GET /admin/serviceAnnouncement/issues</span>
      <span style="margin-left:auto" class="badge success">Connected · 20 messages · 5 health events</span>
    </div>

    <!-- Tabs -->
    <div class="tabs mc-tabs" id="mc-tabs">
      ${TABS.map(t => {
        let badge = ''
        if (t.id === 'required') badge = `<span class="nav-badge red" style="margin-left:5px">${actionRequiredCount}</span>`
        if (t.id === 'health')   badge = activeIncidents > 0 ? `<span class="nav-badge red" style="margin-left:5px">${activeIncidents}</span>` : `<span class="nav-badge green" style="margin-left:5px">All clear</span>`
        if (t.id === 'all' && newCount > 0) badge = `<span class="nav-badge blue" style="margin-left:5px">${newCount} new</span>`
        return `<button class="tab-btn ${activeTab === t.id ? 'active' : ''}" data-tab="${t.id}">
          <i class="ti ${t.icon}" style="margin-right:4px"></i>${t.label}${badge}
        </button>`
      }).join('')}
    </div>

    <!-- Content area -->
    <div id="mc-content"></div>

    <!-- Digest overlay -->
    ${digestOpen ? renderDigestOverlay() : ''}
  `

  // Tab switching
  el.querySelectorAll('#mc-tabs .tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      activeTab = btn.dataset.tab
      expandedIds = new Set()
      render(el)
    })
  })

  // Header actions
  el.querySelector('#mc-sync').addEventListener('click', () => runSync(el))
  el.querySelector('#mc-digest').addEventListener('click', () => { digestOpen = !digestOpen; render(el) })
  el.querySelector('#mc-create-tasks').addEventListener('click', () => {
    const toAction = MC_MESSAGES.filter(m => m.actionRequired && getMsgStatus(m.id) !== 'actioned')
    toAction.forEach(m => { if (!getMsgTasksCreated(m.id)) setMsgTasksCreated(m.id) })
    showToast(`${actionRequiredCount} task groups created from action-required messages.`, 'success')
  })

  // Render content
  if (activeTab === 'health') renderHealthContent(el)
  else renderMessages(el)

  // Digest overlay close
  if (digestOpen) {
    el.querySelector('#mc-digest-close')?.addEventListener('click', () => { digestOpen = false; render(el) })
  }
}

// ============================================================
// Messages list (all tabs except health)
// ============================================================
function getFilteredMessages() {
  let msgs = [...MC_MESSAGES]

  if (activeTab === 'required')  msgs = msgs.filter(m => m.actionRequired && getMsgStatus(m.id) !== 'actioned')
  if (activeTab === 'upcoming')  msgs = msgs.filter(m => m.targetRelease)
  if (activeTab === 'copilot')   msgs = msgs.filter(m => m.service === 'Microsoft Copilot' || m.tags.some(t => t.toLowerCase().includes('copilot') || t.toLowerCase().includes('ai')))
  if (activeTab === 'licenses')  msgs = msgs.filter(m => m.tags.some(t => t.toLowerCase().includes('licens')))
  if (activeTab === 'security')  msgs = msgs.filter(m => m.tags.some(t => ['security','mfa','authentication','defender','conditional access','zero trust'].includes(t.toLowerCase())))

  // User filters
  if (filters.search) {
    const q = filters.search.toLowerCase()
    msgs = msgs.filter(m => m.id.toLowerCase().includes(q) || m.title.toLowerCase().includes(q) || m.aiSummary.toLowerCase().includes(q))
  }
  if (filters.service !== 'all') msgs = msgs.filter(m => m.service === filters.service)
  if (filters.category !== 'all') msgs = msgs.filter(m => m.category === filters.category)
  if (filters.actionRequired === 'yes') msgs = msgs.filter(m => m.actionRequired)
  if (filters.actionRequired === 'no') msgs = msgs.filter(m => !m.actionRequired)
  if (filters.status !== 'all') msgs = msgs.filter(m => getMsgStatus(m.id) === filters.status)

  return msgs
}

function renderMessages(el) {
  const content = el.querySelector('#mc-content')
  if (!content) return
  const msgs = getFilteredMessages()

  content.innerHTML = `
    <!-- Filter bar -->
    <div class="filter-bar mc-filter-bar">
      <input type="text" class="form-input search" id="mc-search" placeholder="Search message ID, title, summary..." value="${filters.search}" style="min-width:220px">
      <select class="form-select" id="mc-svc-filter">
        ${SERVICES.map(s => `<option value="${s === 'All Services' ? 'all' : s}" ${filters.service === (s === 'All Services' ? 'all' : s) ? 'selected' : ''}>${s}</option>`).join('')}
      </select>
      <select class="form-select" id="mc-cat-filter">
        ${CATEGORIES.map(c => `<option value="${c.val}" ${filters.category === c.val ? 'selected' : ''}>${c.label}</option>`).join('')}
      </select>
      <select class="form-select" id="mc-req-filter" style="min-width:140px">
        <option value="all" ${filters.actionRequired === 'all' ? 'selected' : ''}>All Messages</option>
        <option value="yes" ${filters.actionRequired === 'yes' ? 'selected' : ''}>Action Required</option>
        <option value="no" ${filters.actionRequired === 'no' ? 'selected' : ''}>No Action Needed</option>
      </select>
      <select class="form-select" id="mc-status-filter">
        <option value="all" ${filters.status === 'all' ? 'selected' : ''}>All Status</option>
        <option value="new" ${filters.status === 'new' ? 'selected' : ''}>New</option>
        <option value="read" ${filters.status === 'read' ? 'selected' : ''}>Read</option>
        <option value="actioned" ${filters.status === 'actioned' ? 'selected' : ''}>Actioned</option>
        <option value="dismissed" ${filters.status === 'dismissed' ? 'selected' : ''}>Dismissed</option>
      </select>
    </div>

    <div style="font-size:10px;color:var(--color-text-tertiary);margin-bottom:10px">
      Showing ${msgs.length} of ${MC_MESSAGES.length} messages
    </div>

    <div id="mc-msg-list">
      ${msgs.length === 0
        ? '<div class="empty-state"><i class="ti ti-inbox-off" style="font-size:32px;margin-bottom:8px"></i><p>No messages match your filters.</p></div>'
        : msgs.map(m => renderMessageCard(m)).join('')
      }
    </div>
  `

  // Wire filters
  content.querySelector('#mc-search').addEventListener('input', e => { filters.search = e.target.value; renderMessages(el) })
  content.querySelector('#mc-svc-filter').addEventListener('change', e => { filters.service = e.target.value; renderMessages(el) })
  content.querySelector('#mc-cat-filter').addEventListener('change', e => { filters.category = e.target.value; renderMessages(el) })
  content.querySelector('#mc-req-filter').addEventListener('change', e => { filters.actionRequired = e.target.value; renderMessages(el) })
  content.querySelector('#mc-status-filter').addEventListener('change', e => { filters.status = e.target.value; renderMessages(el) })

  // Wire card events
  wireCardEvents(content, el)
}

function renderMessageCard(msg) {
  const svc = SVC_META[msg.service] || { icon: 'ti-apps', color: '#185FA5', bg: '#E6F1FB' }
  const st = getMsgStatus(msg.id)
  const isExpanded = expandedIds.has(msg.id)
  const tasksCreated = getMsgTasksCreated(msg.id)

  const severityBadge = {
    high:   '<span class="badge danger">High</span>',
    medium: '<span class="badge warning">Medium</span>',
    low:    '<span class="badge neutral">Low</span>',
  }[msg.severity] || ''

  const catBadge = {
    planForChange: '<span class="badge info">Plan for Change</span>',
    preventOrFixIssue: '<span class="badge danger">Prevent / Fix Issue</span>',
    stayInformed: '<span class="badge neutral">Stay Informed</span>',
  }[msg.category] || ''

  const statusBadge = {
    new:      '<span class="mc-status-dot new"></span>',
    read:     '',
    actioned: '<span class="badge success" style="font-size:9px">✓ Actioned</span>',
    dismissed:'<span class="badge neutral" style="font-size:9px">Dismissed</span>',
  }[st] || ''

  return `
    <div class="mc-card ${st}" data-id="${msg.id}">
      <!-- Card header row -->
      <div class="mc-card-header">
        <div style="display:flex;align-items:center;gap:8px;flex:1;min-width:0">
          ${statusBadge}
          <span class="monospace" style="font-size:10px;color:var(--color-text-tertiary);flex-shrink:0">${msg.id}</span>
          <div class="mc-svc-chip" style="background:${svc.bg};color:${svc.color}">
            <i class="ti ${svc.icon}"></i> ${msg.service}
          </div>
          <span style="font-size:10px;color:var(--color-text-tertiary);flex-shrink:0">Published ${msg.publishedDate}</span>
        </div>
        <div style="display:flex;gap:4px;align-items:center;flex-shrink:0">
          ${severityBadge}
          ${msg.actionRequired ? '<span class="badge danger"><i class="ti ti-alert-circle"></i> Action Required</span>' : ''}
        </div>
      </div>

      <!-- Title -->
      <div class="mc-card-title">${msg.title}</div>

      <!-- Meta row -->
      <div class="mc-meta-row">
        ${catBadge}
        ${msg.targetRelease ? `<span style="font-size:10px;color:var(--color-text-secondary)"><i class="ti ti-calendar" style="font-size:10px"></i> Target: <strong>${msg.targetRelease}</strong></span>` : ''}
        ${msg.actionByDate ? `<span style="font-size:10px;color:${msg.severity === 'high' ? 'var(--clr-danger-text)' : 'var(--clr-warning-text)'}"><i class="ti ti-clock" style="font-size:10px"></i> Act by: <strong>${msg.actionByDate}</strong></span>` : ''}
        <div style="margin-left:auto;display:flex;gap:4px;flex-wrap:wrap">
          ${msg.tags.map(t => `<span class="pill">${t}</span>`).join('')}
        </div>
      </div>

      <!-- AI Summary -->
      <div class="mc-ai-summary">
        <div class="mc-ai-label"><i class="ti ti-robot"></i> AI Summary</div>
        <div class="mc-ai-text">${msg.aiSummary}</div>
      </div>

      <!-- Action bar -->
      <div class="mc-action-bar">
        <button class="btn btn-xs mc-expand-rec" data-id="${msg.id}">
          <i class="ti ti-brain"></i> AI Recommendations ${isExpanded ? '<i class="ti ti-chevron-up"></i>' : '<i class="ti ti-chevron-down"></i>'}
        </button>
        <div style="margin-left:auto;display:flex;gap:5px">
          ${st !== 'actioned' && msg.actionRequired ? `<button class="btn btn-xs btn-success mc-action-btn" data-action="actioned" data-id="${msg.id}"><i class="ti ti-circle-check"></i> Mark actioned</button>` : ''}
          ${st === 'new' ? `<button class="btn btn-xs mc-action-btn" data-action="read" data-id="${msg.id}"><i class="ti ti-eye"></i> Mark read</button>` : ''}
          ${!tasksCreated ? `<button class="btn btn-xs btn-primary mc-create-task-btn" data-id="${msg.id}"><i class="ti ti-circle-plus"></i> Create tasks</button>` : '<span class="badge success" style="font-size:9px"><i class="ti ti-check"></i> Tasks created</span>'}
          <button class="btn btn-xs mc-action-btn" data-action="dismissed" data-id="${msg.id}"><i class="ti ti-x"></i></button>
        </div>
      </div>

      <!-- Expanded AI Recommendations -->
      ${isExpanded ? renderAIRec(msg) : ''}
    </div>
  `
}

function renderAIRec(msg) {
  const rec = msg.aiRec
  return `
    <div class="mc-rec-panel">
      <div class="mc-rec-header">
        <i class="ti ti-robot" style="color:var(--clr-teal-text);font-size:16px"></i>
        <span style="font-weight:700;font-size:12px">AI Agent Analysis — ${msg.id}</span>
        <span class="badge teal" style="margin-left:6px">Change Intelligence</span>
      </div>

      <div class="grid-2" style="gap:16px;margin-top:12px">
        <div>
          <div class="section-heading">Assessment</div>
          <div style="display:grid;grid-template-columns:auto 1fr;gap:5px 14px;font-size:11px;margin-bottom:12px">
            <span style="color:var(--color-text-tertiary)">Action Required</span>
            <span style="font-weight:600;color:${rec.actionRequired ? 'var(--clr-danger-text)' : 'var(--clr-success-text)'}">
              ${rec.actionRequired ? '✓ YES' : '✗ No'}
            </span>
            <span style="color:var(--color-text-tertiary)">Deadline</span>
            <span style="font-weight:600;color:${msg.actionByDate ? 'var(--clr-warning-text)' : 'var(--color-text-secondary)'}">
              ${rec.deadline || '—'}
            </span>
            <span style="color:var(--color-text-tertiary)">Impacted</span>
            <span>${rec.impacted.join(', ')}</span>
          </div>

          <div class="section-heading">Automation</div>
          <div style="font-size:11px;display:flex;align-items:flex-start;gap:6px;margin-bottom:8px">
            <span style="font-weight:600;color:${rec.automatable ? 'var(--clr-success-text)' : 'var(--color-text-tertiary)'}">
              ${rec.automatable ? '✓ Available' : '✗ Not available'}
            </span>
          </div>
          ${rec.automationNote ? `<div style="font-size:10px;color:var(--color-text-secondary);background:var(--color-background-secondary);padding:8px 10px;border-radius:var(--border-radius-md);font-family:var(--font-mono);line-height:1.5">${rec.automationNote}</div>` : ''}
        </div>

        <div>
          <div class="section-heading">Recommended IT Tasks</div>
          <div style="display:flex;flex-direction:column;gap:5px;margin-bottom:12px">
            ${rec.tasks.map((t, i) => `
              <div style="display:flex;align-items:flex-start;gap:8px;font-size:11px;padding:5px 8px;background:var(--color-background-secondary);border-radius:var(--border-radius-sm);border:0.5px solid var(--color-border-tertiary)">
                <span style="width:16px;height:16px;border-radius:50%;background:var(--clr-info-bg);color:var(--clr-info-text);font-size:9px;font-weight:700;display:flex;align-items:center;justify-content:center;flex-shrink:0">${i + 1}</span>
                <span style="flex:1;line-height:1.4">${t}</span>
              </div>
            `).join('')}
          </div>
        </div>
      </div>

      <div class="mc-rec-actions">
        <button class="btn btn-xs btn-primary mc-create-task-btn" data-id="${msg.id}"><i class="ti ti-circle-plus"></i> Create all tasks</button>
        ${rec.automatable ? `<button class="btn btn-xs" style="border-color:var(--clr-teal-text);color:var(--clr-teal-text)"><i class="ti ti-api"></i> Run Graph query</button>` : ''}
        <button class="btn btn-xs"><i class="ti ti-brand-teams"></i> Notify via Teams</button>
        ${msg.actionRequired ? `<button class="btn btn-xs btn-success mc-action-btn" data-action="actioned" data-id="${msg.id}"><i class="ti ti-circle-check"></i> Mark actioned</button>` : ''}
      </div>
    </div>
  `
}

function wireCardEvents(content, el) {
  content.querySelectorAll('.mc-expand-rec').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = btn.dataset.id
      if (expandedIds.has(id)) expandedIds.delete(id)
      else { expandedIds.add(id); setMsgStatus(id, getMsgStatus(id) === 'new' ? 'read' : getMsgStatus(id)) }
      renderMessages(el)
    })
  })

  content.querySelectorAll('.mc-action-btn').forEach(btn => {
    btn.addEventListener('click', e => {
      e.stopPropagation()
      const { action, id } = btn.dataset
      setMsgStatus(id, action)
      const msgs = { read: 'Marked as read.', actioned: 'Marked as actioned.', dismissed: 'Message dismissed.' }
      showToast(msgs[action] || 'Updated.', action === 'actioned' ? 'success' : 'info')
      render(el)
    })
  })

  content.querySelectorAll('.mc-create-task-btn').forEach(btn => {
    btn.addEventListener('click', e => {
      e.stopPropagation()
      const id = btn.dataset.id
      setMsgTasksCreated(id)
      showToast(`Tasks created for ${id}. Check task tracker.`, 'success')
      renderMessages(el)
    })
  })
}

// ============================================================
// Service Health tab
// ============================================================
function renderHealthContent(el) {
  const content = el.querySelector('#mc-content')
  if (!content) return

  const active   = SVC_HEALTH.filter(h => h.status !== 'resolved')
  const resolved = SVC_HEALTH.filter(h => h.status === 'resolved')

  const healthGrid = Object.keys(SVC_META).map(svc => {
    const issue = SVC_HEALTH.find(h => h.service === svc && h.status !== 'resolved')
    const color = issue ? (issue.severity === 'high' ? 'var(--clr-danger-text)' : 'var(--clr-warning-text)') : 'var(--clr-success-text)'
    const bg    = issue ? (issue.severity === 'high' ? 'var(--clr-danger-bg)' : 'var(--clr-warning-bg)') : 'var(--clr-success-bg)'
    const dotCls = issue ? (issue.severity === 'high' ? 'fail' : 'warn') : 'pass'
    return `
      <div class="mc-health-svc-tile" style="border-color:${issue ? 'var(--color-border-secondary)' : 'var(--clr-success-border)'}">
        <div class="psc-icon" style="background:${SVC_META[svc].bg};color:${SVC_META[svc].color};width:28px;height:28px;font-size:13px;border-radius:6px">
          <i class="ti ${SVC_META[svc].icon}"></i>
        </div>
        <div style="flex:1;min-width:0">
          <div style="font-size:11px;font-weight:600;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${svc}</div>
          <div style="font-size:9px;color:${color};font-weight:600">${issue ? (issue.status === 'investigating' ? 'Investigating' : 'Degraded') : 'Operational'}</div>
        </div>
        <div class="status-dot ${dotCls}" style="flex-shrink:0"></div>
      </div>
    `
  }).join('')

  const statusLabel = { investigating: 'Investigating', serviceDegradation: 'Service degradation', serviceAdvisory: 'Advisory', serviceInterruption: 'Interrupted', resolved: 'Resolved' }
  const statusCls   = { investigating: 'danger', serviceDegradation: 'warning', serviceAdvisory: 'info', serviceInterruption: 'danger', resolved: 'success' }

  content.innerHTML = `
    <!-- Service health grid -->
    <div class="card mb-3">
      <div class="card-header">
        <span class="card-title"><i class="ti ti-heartbeat"></i> Service Health Overview</span>
        <span class="badge ${active.length > 0 ? 'danger' : 'success'}">${active.length > 0 ? active.length + ' active issue' + (active.length > 1 ? 's' : '') : 'All services operational'}</span>
      </div>
      <div class="mc-health-grid">${healthGrid}</div>
    </div>

    <!-- Active incidents -->
    ${active.length > 0 ? `
      <div style="font-size:10px;font-weight:700;color:var(--color-text-tertiary);text-transform:uppercase;letter-spacing:0.5px;margin-bottom:8px">Active Incidents & Advisories</div>
      ${active.map(h => renderHealthCard(h, statusLabel, statusCls)).join('')}
    ` : ''}

    <!-- Resolved -->
    <div style="font-size:10px;font-weight:700;color:var(--color-text-tertiary);text-transform:uppercase;letter-spacing:0.5px;margin:16px 0 8px">Recently Resolved</div>
    ${resolved.map(h => renderHealthCard(h, statusLabel, statusCls)).join('')}
  `
}

function renderHealthCard(h, statusLabel, statusCls) {
  const svc = SVC_META[h.service] || { icon: 'ti-apps', color: '#185FA5', bg: '#E6F1FB' }
  const isResolved = h.status === 'resolved'
  return `
    <div class="card mb-3" style="border-left:3px solid ${isResolved ? 'var(--clr-success-text)' : h.severity === 'high' ? 'var(--clr-danger-text)' : 'var(--clr-warning-text)'}">
      <div class="mc-card-header" style="margin-bottom:8px">
        <div class="mc-svc-chip" style="background:${svc.bg};color:${svc.color}">
          <i class="ti ${svc.icon}"></i> ${h.service}
        </div>
        <span class="monospace" style="font-size:10px;color:var(--color-text-tertiary)">${h.id}</span>
        <span class="badge ${statusCls[h.status] || 'neutral'}">${statusLabel[h.status] || h.status}</span>
        <span style="margin-left:auto;font-size:10px;color:var(--color-text-tertiary)">Feature: ${h.feature}</span>
      </div>
      <div style="font-size:12px;font-weight:700;margin-bottom:6px">${h.title}</div>
      <div style="font-size:11px;color:var(--color-text-secondary);margin-bottom:10px;line-height:1.5">${h.userImpact}</div>
      <div style="display:flex;gap:16px;font-size:10px;color:var(--color-text-tertiary);margin-bottom:10px">
        <span><i class="ti ti-clock"></i> Started: ${h.startTime}</span>
        <span><i class="ti ti-refresh"></i> Updated: ${h.lastUpdated}</span>
        ${h.nextUpdate ? `<span><i class="ti ti-calendar"></i> Next update: ${h.nextUpdate}</span>` : ''}
      </div>
      ${h.updates.length > 0 ? `
        <div class="section-heading">Updates</div>
        ${h.updates.map(u => `
          <div style="display:flex;gap:10px;padding:5px 0;border-bottom:0.5px solid var(--color-border-tertiary);font-size:11px">
            <span class="monospace" style="color:var(--color-text-tertiary);flex-shrink:0;min-width:52px">${u.time}</span>
            <span style="color:var(--color-text-secondary);line-height:1.4">${u.text}</span>
          </div>
        `).join('')}
      ` : ''}
    </div>
  `
}

// ============================================================
// Weekly Digest overlay
// ============================================================
function renderDigestOverlay() {
  const d = DIGEST_STATS
  const now = new Date().toLocaleDateString('en-GB', { weekday:'long', year:'numeric', month:'long', day:'numeric' })
  return `
    <div class="digest-overlay" id="mc-digest-overlay">
      <div class="digest-panel">
        <div class="digest-header">
          <div>
            <div style="font-size:14px;font-weight:800">Microsoft 365 Weekly Change Digest</div>
            <div style="font-size:11px;color:var(--color-text-secondary);margin-top:2px">Generated ${now} · Contoso.com</div>
          </div>
          <button class="btn btn-xs" id="mc-digest-close"><i class="ti ti-x"></i> Close</button>
        </div>

        <div class="digest-body">
          <!-- Stats row -->
          <div class="digest-stats-row">
            <div class="digest-stat"><span class="ds-val info">${d.totalMessages}</span><span class="ds-lbl">Total Messages</span></div>
            <div class="digest-stat"><span class="ds-val danger">${d.actionRequired}</span><span class="ds-lbl">Action Required</span></div>
            <div class="digest-stat"><span class="ds-val warning">${d.majorChanges}</span><span class="ds-lbl">Major Changes</span></div>
            <div class="digest-stat"><span class="ds-val info">${d.newSinceLastWeek}</span><span class="ds-lbl">New This Week</span></div>
            <div class="digest-stat"><span class="ds-val info">${d.upcoming30Days}</span><span class="ds-lbl">Due in 30 Days</span></div>
            <div class="digest-stat"><span class="ds-val success">${d.resolved}</span><span class="ds-lbl">Resolved Issues</span></div>
          </div>

          <!-- Highlights -->
          <div class="section-heading" style="margin-bottom:10px">⚠️ This Week's Priority Items</div>
          ${d.highlights.map(h => `
            <div style="display:flex;gap:10px;padding:8px 10px;background:var(--color-background-secondary);border-radius:var(--border-radius-md);margin-bottom:6px;border-left:3px solid ${h.severity === 'high' ? 'var(--clr-danger-text)' : 'var(--clr-warning-text)'}">
              <div class="mc-svc-chip" style="background:${SVC_META[h.service]?.bg || '#f0f0f0'};color:${SVC_META[h.service]?.color || '#555'};flex-shrink:0">
                <i class="ti ${SVC_META[h.service]?.icon || 'ti-apps'}"></i> ${h.service}
              </div>
              <span style="font-size:11px;line-height:1.4;flex:1">${h.title}</span>
              <span class="badge ${h.severity === 'high' ? 'danger' : 'warning'}" style="flex-shrink:0">${h.severity}</span>
            </div>
          `).join('')}

          <!-- Action Required section -->
          <div class="section-heading" style="margin-top:16px;margin-bottom:10px">📋 Action Required — ${d.actionRequired} items</div>
          ${MC_MESSAGES.filter(m => m.actionRequired).slice(0, 5).map(m => `
            <div style="display:flex;gap:10px;padding:7px 0;border-bottom:0.5px solid var(--color-border-tertiary);font-size:11px">
              <span class="monospace" style="color:var(--color-text-tertiary);flex-shrink:0">${m.id}</span>
              <span style="flex:1">${m.title}</span>
              ${m.actionByDate ? `<span style="color:var(--clr-danger-text);font-size:10px;flex-shrink:0">By ${m.actionByDate}</span>` : ''}
            </div>
          `).join('')}

          <!-- Service health -->
          <div class="section-heading" style="margin-top:16px;margin-bottom:10px">🟢 Service Health Summary</div>
          <div style="font-size:11px;color:var(--color-text-secondary);line-height:1.7">
            ${SVC_HEALTH.filter(h => h.status !== 'resolved').length === 0
              ? '✅ All Microsoft 365 services are operating normally.'
              : SVC_HEALTH.filter(h => h.status !== 'resolved').map(h => `⚠️ <strong>${h.service}</strong>: ${h.title}`).join('<br>')}
            <br>✅ ${SVC_HEALTH.filter(h => h.status === 'resolved').length} incidents resolved since last digest.
          </div>

          <!-- Footer actions -->
          <div style="display:flex;gap:8px;margin-top:20px;padding-top:14px;border-top:0.5px solid var(--color-border-secondary)">
            <button class="btn btn-primary" onclick="this.textContent='Sent!';setTimeout(()=>this.textContent='',2000)">
              <i class="ti ti-send"></i> Send via Teams
            </button>
            <button class="btn" onclick="this.textContent='Sent!';setTimeout(()=>this.textContent='',2000)">
              <i class="ti ti-mail"></i> Send via email
            </button>
            <button class="btn" onclick="window.print()">
              <i class="ti ti-printer"></i> Print / PDF
            </button>
          </div>
        </div>
      </div>
    </div>
  `
}

// ============================================================
// Sync simulation
// ============================================================
function runSync(el) {
  const btn = el.querySelector('#mc-sync')
  btn.innerHTML = `<span class="spinner dark"></span> Syncing...`
  btn.disabled = true

  setTimeout(() => {
    btn.innerHTML = `<i class="ti ti-refresh"></i> Sync now`
    btn.disabled = false
    showToast('Synced 20 messages from /admin/serviceAnnouncement/messages. 5 health events from /issues.', 'success')
  }, 2000)
}
