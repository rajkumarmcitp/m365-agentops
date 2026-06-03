import { state, saveState, go } from '../app.js'
import { CFG_TOPICS } from '../data/cis-controls.js'
import { showToast } from '../components/toast.js'

let cfgView = 'main'  // 'main' | 'topic' | 'agent'
let activeTopic = null

// ============================================================
// Topic icon colours
// ============================================================
const TOPIC_COLOURS = {
  t1: { bg: '#E6F1FB', color: '#0C447C' },
  t2: { bg: '#FCEBEB', color: '#A32D2D' },
  t3: { bg: '#EEEDFE', color: '#3C3489' },
  t4: { bg: '#EAF3DE', color: '#3B6D11' },
  t5: { bg: '#E6F1FB', color: '#185FA5' },
  t6: { bg: '#FAEEDA', color: '#854F0B' },
  t7: { bg: '#EAF3DE', color: '#3B6D11' },
  t8: { bg: '#EEEDFE', color: '#3C3489' },
  t9: { bg: '#E0F5F4', color: '#0D6B68' },
}

// ============================================================
// Helpers
// ============================================================
function getTopicStats(topic) {
  const controls = topic.subsections.flatMap(s => s.controls)
  const total = controls.length
  let pass = 0, fail = 0, warn = 0, manual = 0
  controls.forEach(c => {
    const eff = getEffectiveStatus(c)
    if (eff === 'pass') pass++
    else if (eff === 'fail') fail++
    else if (eff === 'warn') warn++
    if (c.type === 'manual') manual++
  })
  const score = total > 0 ? Math.round((pass / total) * 100) : 0
  return { total, pass, fail, warn, manual, score }
}

function getEffectiveStatus(control) {
  if (state.cfgAttested[control.id]) return 'pass'
  return control.status
}

function getAllControls() {
  return CFG_TOPICS.flatMap(t => t.subsections.flatMap(s => s.controls))
}

function getOverallStats() {
  const all = getAllControls()
  let pass = 0, fail = 0, warn = 0, manual = 0
  all.forEach(c => {
    const s = getEffectiveStatus(c)
    if (s === 'pass') pass++
    else if (s === 'fail') fail++
    else if (s === 'warn') warn++
    if (c.type === 'manual') manual++
  })
  const total = all.length
  const score = Math.round((pass / total) * 100)
  return { total, pass, fail, warn, manual, score }
}

function statusBadge(s) {
  const map = { pass: ['success','Pass'], fail: ['danger','Failed'], warn: ['warning','Warning'] }
  const [cls, lbl] = map[s] || ['neutral','Unknown']
  return `<span class="badge ${cls}">${lbl}</span>`
}

function typeBadge(t) {
  return t === 'manual'
    ? `<span class="badge purple">Manual</span>`
    : `<span class="badge info">Auto</span>`
}

function profileBadge(p) {
  return `<span class="badge neutral" style="font-size:9px">${p}</span>`
}

function scoreClass(score) {
  if (score >= 85) return 'success'
  if (score >= 65) return 'warning'
  return 'danger'
}

// ============================================================
// Entry
// ============================================================
export function initM365Config() {
  const el = document.getElementById('page-m365config')
  if (!el) return
  cfgView = 'main'
  activeTopic = null
  renderMain(el)
}

// ============================================================
// Main View
// ============================================================
function renderMain(el) {
  cfgView = 'main'
  const stats = getOverallStats()
  const cls = scoreClass(stats.score)

  el.innerHTML = `
    <div class="page-header">
      <div>
        <div class="page-title"><i class="ti ti-settings-2"></i> M365 Config — CIS Benchmark v7.0.0</div>
        <div class="page-subtitle">Last validated: Today at 08:45 AM · ${stats.total} controls across 9 topics</div>
      </div>
      <div class="page-actions">
        <button class="btn" id="cfg-scan-now"><i class="ti ti-refresh"></i> Run scan now</button>
        <button class="btn btn-primary" id="cfg-agent-btn"><i class="ti ti-robot"></i> Config Agent</button>
      </div>
    </div>

    <div class="kpi-row">
      <div class="kpi-tile">
        <div class="kpi-value ${cls}">${stats.score}%</div>
        <div class="kpi-label">Overall Score</div>
      </div>
      <div class="kpi-tile">
        <div class="kpi-value success">${stats.pass}</div>
        <div class="kpi-label">Passed</div>
      </div>
      <div class="kpi-tile">
        <div class="kpi-value danger">${stats.fail}</div>
        <div class="kpi-label">Failed</div>
      </div>
      <div class="kpi-tile">
        <div class="kpi-value warning">${stats.warn}</div>
        <div class="kpi-label">Warnings</div>
      </div>
      <div class="kpi-tile">
        <div class="kpi-value purple">${stats.manual}</div>
        <div class="kpi-label">Manual</div>
      </div>
    </div>

    <div class="card mb-3">
      <div class="card-header">
        <span class="card-title">Overall Compliance Posture</span>
        <span class="badge ${cls}">${stats.score}% compliant</span>
      </div>
      <div class="seg-bar" style="height:12px;border-radius:6px">
        <div class="seg pass" style="width:${(stats.pass/stats.total*100).toFixed(1)}%"></div>
        <div class="seg warn" style="width:${(stats.warn/stats.total*100).toFixed(1)}%"></div>
        <div class="seg fail" style="width:${(stats.fail/stats.total*100).toFixed(1)}%"></div>
      </div>
      <div style="display:flex;gap:20px;margin-top:8px">
        <span style="font-size:10px;color:var(--clr-success-text)">● ${stats.pass} Passed</span>
        <span style="font-size:10px;color:var(--clr-warning-text)">● ${stats.warn} Warnings</span>
        <span style="font-size:10px;color:var(--clr-danger-text)">● ${stats.fail} Failed</span>
        <span style="font-size:10px;color:var(--clr-purple-text)">● ${stats.manual} Manual</span>
      </div>
    </div>

    <div style="font-size:11px;font-weight:600;color:var(--color-text-secondary);margin-bottom:10px;text-transform:uppercase;letter-spacing:0.5px">Topics</div>
    <div class="cfg-topic-grid" id="cfg-topic-grid"></div>
  `

  // Render topic cards
  const grid = el.querySelector('#cfg-topic-grid')
  CFG_TOPICS.forEach(topic => {
    const s = getTopicStats(topic)
    const tCls = scoreClass(s.score)
    const card = document.createElement('div')
    card.className = 'cfg-topic-card'
    const tc = TOPIC_COLOURS[topic.id] || { bg: '#f0f0f0', color: '#555' }
    card.innerHTML = `
      <div class="cfg-topic-icon" style="background:${tc.bg};color:${tc.color}">
        <i class="ti ${topic.icon}"></i>
      </div>
      <div class="cfg-topic-num">Topic ${topic.num}</div>
      <div class="cfg-topic-name">${topic.name}</div>
      <div class="cfg-topic-badges">
        ${s.fail > 0 ? `<span class="badge danger">${s.fail} fail</span>` : ''}
        ${s.warn > 0 ? `<span class="badge warning">${s.warn} warn</span>` : ''}
        ${s.pass > 0 ? `<span class="badge success">${s.pass} pass</span>` : ''}
      </div>
      <div class="cfg-topic-bar">
        <div class="score-bar">
          <div class="score-bar-fill ${tCls}" style="width:${s.score}%"></div>
        </div>
      </div>
      <div class="cfg-topic-pct">${s.score}% · ${s.total} controls</div>
    `
    card.addEventListener('click', () => renderTopic(el, topic))
    grid.appendChild(card)
  })

  el.querySelector('#cfg-scan-now').addEventListener('click', () => {
    const btn = el.querySelector('#cfg-scan-now')
    btn.innerHTML = `<span class="spinner dark"></span> Scanning...`
    btn.disabled = true
    setTimeout(() => {
      btn.innerHTML = `<i class="ti ti-refresh"></i> Run scan now`
      btn.disabled = false
      showToast('Scan complete — 96 controls validated.', 'success')
    }, 2200)
  })

  el.querySelector('#cfg-agent-btn').addEventListener('click', () => renderAgent(el))
}

// ============================================================
// Topic View
// ============================================================
let topicFilter = { search: '', status: 'all', profile: 'all' }

function renderTopic(el, topic) {
  cfgView = 'topic'
  activeTopic = topic
  topicFilter = { search: '', status: 'all', profile: 'all' }
  const s = getTopicStats(topic)
  const tCls = scoreClass(s.score)
  const tc = TOPIC_COLOURS[topic.id] || { bg: '#f0f0f0', color: '#555' }

  el.innerHTML = `
    <div class="page-header">
      <div style="display:flex;align-items:center;gap:10px">
        <button class="btn" id="cfg-back"><i class="ti ti-arrow-left"></i> Back</button>
        <div class="cfg-topic-icon" style="background:${tc.bg};color:${tc.color};width:32px;height:32px;border-radius:8px;display:flex;align-items:center;justify-content:center;font-size:16px"><i class="ti ${topic.icon}"></i></div>
        <div>
          <div class="page-title">Topic ${topic.num} — ${topic.name}</div>
          <div class="page-subtitle">${s.total} controls</div>
        </div>
      </div>
      <div class="page-actions">
        <button class="btn" id="cfg-topic-settings-btn" title="Admin Settings"><i class="ti ti-settings"></i></button>
        <button class="btn" id="cfg-topic-scan"><i class="ti ti-refresh"></i> Scan topic</button>
      </div>
    </div>

    ${!state.settings.showPSCommands ? `
      <div class="alert-banner info" style="margin-bottom:14px">
        <i class="ti ti-info-circle"></i>
        PowerShell commands are hidden. Enable in <a href="#" id="cfg-topic-settings-link" style="text-decoration:underline">Admin Settings</a>.
      </div>
    ` : ''}

    <div class="kpi-row">
      <div class="kpi-tile">
        <div class="kpi-value ${tCls}">${s.score}%</div>
        <div class="kpi-label">Score</div>
      </div>
      <div class="kpi-tile">
        <div class="kpi-value success">${s.pass}</div>
        <div class="kpi-label">Passed</div>
      </div>
      <div class="kpi-tile">
        <div class="kpi-value danger">${s.fail}</div>
        <div class="kpi-label">Failed</div>
      </div>
      <div class="kpi-tile">
        <div class="kpi-value warning">${s.warn}</div>
        <div class="kpi-label">Warnings</div>
      </div>
    </div>

    <div class="filter-bar">
      <input type="text" class="form-input search" id="cfg-filter-search" placeholder="Search controls..." value="${topicFilter.search}">
      <select class="form-select" id="cfg-filter-status">
        <option value="all" ${topicFilter.status==='all'?'selected':''}>All Status</option>
        <option value="pass" ${topicFilter.status==='pass'?'selected':''}>Pass</option>
        <option value="fail" ${topicFilter.status==='fail'?'selected':''}>Failed</option>
        <option value="warn" ${topicFilter.status==='warn'?'selected':''}>Warning</option>
      </select>
      <select class="form-select" id="cfg-filter-profile">
        <option value="all">All Profiles</option>
        <option value="E3 L1">E3 L1</option>
        <option value="E3 L2">E3 L2</option>
        <option value="E5 L1">E5 L1</option>
        <option value="E5 L2">E5 L2</option>
      </select>
    </div>

    <div id="cfg-controls-area"></div>
  `

  el.querySelector('#cfg-back').addEventListener('click', () => renderMain(el))
  el.querySelector('#cfg-topic-settings-btn').addEventListener('click', () => go('settings'))

  const settingsLink = el.querySelector('#cfg-topic-settings-link')
  if (settingsLink) settingsLink.addEventListener('click', e => { e.preventDefault(); go('settings') })

  el.querySelector('#cfg-topic-scan').addEventListener('click', () => {
    const btn = el.querySelector('#cfg-topic-scan')
    btn.innerHTML = `<span class="spinner dark"></span> Scanning...`
    btn.disabled = true
    setTimeout(() => {
      btn.innerHTML = `<i class="ti ti-refresh"></i> Scan topic`
      btn.disabled = false
      showToast(`Topic ${topic.num} scan complete.`, 'success')
    }, 1800)
  })

  el.querySelector('#cfg-filter-search').addEventListener('input', e => {
    topicFilter.search = e.target.value
    renderControls(el, topic)
  })
  el.querySelector('#cfg-filter-status').addEventListener('change', e => {
    topicFilter.status = e.target.value
    renderControls(el, topic)
  })
  el.querySelector('#cfg-filter-profile').addEventListener('change', e => {
    topicFilter.profile = e.target.value
    renderControls(el, topic)
  })

  renderControls(el, topic)
}

function renderControls(el, topic) {
  const area = el.querySelector('#cfg-controls-area')
  if (!area) return

  area.innerHTML = topic.subsections.map(sub => {
    const filtered = sub.controls.filter(c => {
      const eff = getEffectiveStatus(c)
      if (topicFilter.status !== 'all' && eff !== topicFilter.status) return false
      if (topicFilter.profile !== 'all' && c.profile !== topicFilter.profile) return false
      if (topicFilter.search) {
        const q = topicFilter.search.toLowerCase()
        if (!c.id.toLowerCase().includes(q) && !c.title.toLowerCase().includes(q)) return false
      }
      return true
    })
    if (filtered.length === 0) return ''

    return `
      <div class="card mb-3" style="padding:0;overflow:hidden">
        <div class="section-heading" style="padding:10px 14px;margin:0;border-bottom:0.5px solid var(--color-border-tertiary)">
          ${sub.name}
        </div>
        ${filtered.map(c => renderControlRow(c)).join('')}
      </div>
    `
  }).join('')

  // Wire events
  area.querySelectorAll('.cfg-control-row').forEach(row => {
    row.addEventListener('click', e => {
      if (e.target.closest('button')) return
      const id = row.dataset.id
      const panel = area.querySelector(`.cfg-expand-panel[data-id="${id}"]`)
      const chevron = row.querySelector('.chevron-btn')
      if (panel) {
        panel.classList.toggle('open')
        if (chevron) chevron.classList.toggle('open', panel.classList.contains('open'))
      }
    })
  })

  // Copy buttons
  area.querySelectorAll('.cfg-copy-btn').forEach(btn => {
    btn.addEventListener('click', e => {
      e.stopPropagation()
      const code = btn.dataset.code
      navigator.clipboard.writeText(code).then(() => {
        btn.classList.add('copy-flash')
        btn.innerHTML = '<i class="ti ti-check"></i>'
        setTimeout(() => {
          btn.classList.remove('copy-flash')
          btn.innerHTML = '<i class="ti ti-copy"></i>'
        }, 1500)
      })
    })
  })

  // Attest / revoke buttons
  area.querySelectorAll('.cfg-attest-btn').forEach(btn => {
    btn.addEventListener('click', e => {
      e.stopPropagation()
      const id = btn.dataset.id
      const now = new Date().toLocaleDateString('en-GB', { day:'numeric', month:'short', year:'numeric' })
      state.cfgAttested[id] = now
      saveState()
      // Re-render just this control panel without full re-render
      renderControls(el, topic)
      showToast(`Control ${id} marked as compliant.`, 'success')
    })
  })
  area.querySelectorAll('.cfg-revoke-btn').forEach(btn => {
    btn.addEventListener('click', e => {
      e.stopPropagation()
      const id = btn.dataset.id
      delete state.cfgAttested[id]
      saveState()
      renderControls(el, topic)
      showToast(`Attestation for ${id} revoked.`, 'warning')
    })
  })

  // Auto-expand failed
  if (state.settings.autoExpandFailed) {
    area.querySelectorAll('.cfg-expand-panel').forEach(panel => {
      const id = panel.dataset.id
      const ctrl = topic.subsections.flatMap(s => s.controls).find(c => c.id === id)
      if (ctrl && getEffectiveStatus(ctrl) === 'fail') {
        panel.classList.add('open')
        const row = area.querySelector(`.cfg-control-row[data-id="${id}"] .chevron-btn`)
        if (row) row.classList.add('open')
      }
    })
  }
}

function renderControlRow(c) {
  const eff = getEffectiveStatus(c)
  const attested = state.cfgAttested[c.id]

  let attestHtml = ''
  if (attested) {
    attestHtml = `
      <div class="cfg-attestation-strip attested">
        <span><i class="ti ti-circle-check"></i> Verified and marked compliant — ${attested}</span>
        <button class="btn btn-xs btn-danger cfg-revoke-btn" data-id="${c.id}">Revoke</button>
      </div>
    `
  } else if (c.type === 'manual' && eff !== 'pass') {
    attestHtml = `
      <div class="cfg-attestation-strip manual-strip">
        <span><i class="ti ti-clipboard-check"></i> Manual validation required — verify in admin portal.</span>
        <button class="btn btn-xs btn-success cfg-attest-btn" data-id="${c.id}">Mark as compliant</button>
      </div>
    `
  } else if (eff === 'fail') {
    attestHtml = `
      <div class="cfg-attestation-strip fail-strip">
        <span><i class="ti ti-alert-triangle"></i> Non-compliant — after remediation confirm here</span>
        <button class="btn btn-xs btn-success cfg-attest-btn" data-id="${c.id}">Mark as remediated</button>
      </div>
    `
  }

  let expandContent = ''

  // PS block
  if (state.settings.showPSCommands && c.ps) {
    expandContent += `
      <div class="code-block-header">
        <span>PowerShell Validation</span>
        <button class="btn btn-xs cfg-copy-btn" data-code="${escapeAttr(c.ps)}"><i class="ti ti-copy"></i> Copy</button>
      </div>
      <div class="cfg-ps-block">${escapeHtml(c.ps)}</div>
    `
  }

  // Result block
  if (state.settings.showTenantResult && c.value) {
    const color = (eff === 'fail') ? 'var(--clr-danger-text)' : 'var(--clr-success-text)'
    expandContent += `
      <div class="code-block-header"><span>Tenant Result</span></div>
      <div class="cfg-result-block" style="color:${color}">${escapeHtml(c.value)}</div>
    `
  }

  if (!c.ps && c.type === 'manual') {
    expandContent += `<div style="font-size:11px;color:var(--color-text-secondary);margin-bottom:10px;font-style:italic">Manual validation required — verify in admin portal.</div>`
  }

  expandContent += attestHtml

  return `
    <div class="cfg-control-row" data-id="${c.id}">
      <div class="cfg-control-id">${c.id}</div>
      ${profileBadge(c.profile)}
      <div class="cfg-control-title">${c.title}</div>
      <div class="cfg-control-badges">
        ${statusBadge(eff)}
        ${typeBadge(c.type)}
      </div>
      <button class="chevron-btn"><i class="ti ti-chevron-right"></i></button>
    </div>
    <div class="cfg-expand-panel" data-id="${c.id}">
      <div style="font-size:11px;color:var(--color-text-secondary);margin-bottom:10px;line-height:1.5">${c.desc}</div>
      ${expandContent}
    </div>
  `
}

// ============================================================
// Agent View
// ============================================================
const TOPIC_ENABLED = Object.fromEntries(CFG_TOPICS.map(t => [t.id, true]))

function renderAgent(el) {
  cfgView = 'agent'
  const agentLog = state.cfgAgentLog

  el.innerHTML = `
    <div class="page-header">
      <div style="display:flex;align-items:center;gap:10px">
        <button class="btn" id="cfg-agent-back"><i class="ti ti-arrow-left"></i> Back</button>
        <div>
          <div class="page-title"><i class="ti ti-robot"></i> M365 Config Agent</div>
          <div class="page-subtitle">Automated CIS compliance scanning agent</div>
        </div>
      </div>
    </div>

    <div class="agent-card-lg">
      <div class="agent-icon-lg" style="background:#E0F5F4;color:#0D6B68"><i class="ti ti-robot"></i></div>
      <div style="flex:1">
        <div style="font-size:14px;font-weight:700;margin-bottom:4px">M365 Config Compliance Agent</div>
        <div style="font-size:11px;color:var(--color-text-secondary);line-height:1.5;margin-bottom:10px">
          Automated agent that scans all 9 CIS Benchmark topic areas across your Microsoft 365 tenant.
          Identifies compliance drift, sends alerts on new failures, and maintains audit evidence.
        </div>
        <div class="agent-status-row">
          <div class="status-dot active pulse"></div>
          <span style="font-size:12px;font-weight:600;color:var(--clr-success-text)">Active</span>
          <span style="font-size:10px;color:var(--color-text-tertiary);margin-left:8px">Running on schedule</span>
        </div>
      </div>
      <button class="btn btn-primary" id="cfg-agent-run-now"><i class="ti ti-player-play"></i> Run scan now</button>
    </div>

    <div class="kpi-row">
      <div class="kpi-tile">
        <div class="kpi-value info">Today 08:45</div>
        <div class="kpi-label">Last Scan</div>
      </div>
      <div class="kpi-tile">
        <div class="kpi-value warning">78%</div>
        <div class="kpi-label">Score</div>
      </div>
      <div class="kpi-tile">
        <div class="kpi-value info">96</div>
        <div class="kpi-label">Controls</div>
      </div>
      <div class="kpi-tile">
        <div class="kpi-value danger">4</div>
        <div class="kpi-label">New Fails</div>
      </div>
    </div>

    <div class="grid-2" style="gap:16px;margin-bottom:16px">
      <div class="card">
        <div class="card-title mb-3"><i class="ti ti-settings"></i> Agent Configuration</div>
        <div class="form-group">
          <label class="form-label">Scan frequency</label>
          <select class="form-select" id="agent-schedule">
            <option value="daily-0800" ${state.settings.agentSchedule==='daily-0800'?'selected':''}>Daily at 08:00</option>
            <option value="every-6h" ${state.settings.agentSchedule==='every-6h'?'selected':''}>Every 6 hours</option>
            <option value="weekly" ${state.settings.agentSchedule==='weekly'?'selected':''}>Weekly</option>
          </select>
        </div>
        <div class="form-group">
          <label class="form-label">Alert email</label>
          <input type="email" class="form-input" id="agent-email" value="${state.settings.agentAlertEmail}">
        </div>
        <div style="display:flex;flex-direction:column;gap:8px;margin-bottom:14px">
          <label style="display:flex;align-items:center;gap:8px;cursor:pointer">
            <input type="checkbox" id="agent-alert-fail" ${state.settings.agentAlertOnFail?'checked':''}>
            <span style="font-size:12px">Alert on new failures</span>
          </label>
          <label style="display:flex;align-items:center;gap:8px;cursor:pointer">
            <input type="checkbox" id="agent-daily-digest" ${state.settings.agentDailyDigest?'checked':''}>
            <span style="font-size:12px">Daily digest email</span>
          </label>
          <label style="display:flex;align-items:center;gap:8px;cursor:pointer">
            <input type="checkbox" checked>
            <span style="font-size:12px">Auto-remediation suggestions</span>
          </label>
        </div>
        <button class="btn btn-primary" id="agent-save-cfg"><i class="ti ti-device-floppy"></i> Save configuration</button>
      </div>

      <div class="card">
        <div class="card-title mb-3"><i class="ti ti-list-check"></i> Topics Monitored</div>
        ${CFG_TOPICS.map(t => `
          <div class="topic-toggle-row">
            <div class="cfg-topic-icon" style="background:${TOPIC_COLOURS[t.id]?.bg||'#f0f0f0'};color:${TOPIC_COLOURS[t.id]?.color||'#555'};width:24px;height:24px;border-radius:6px;display:flex;align-items:center;justify-content:center;font-size:12px;flex-shrink:0">
              <i class="ti ${t.icon}"></i>
            </div>
            <span style="flex:1;font-size:11px">${t.name}</span>
            <label class="toggle-switch">
              <input type="checkbox" class="topic-enabled-toggle" data-tid="${t.id}" ${TOPIC_ENABLED[t.id]?'checked':''}>
              <span class="toggle-track"></span>
            </label>
          </div>
        `).join('')}
      </div>
    </div>

    <div class="card">
      <div class="card-header">
        <span class="card-title"><i class="ti ti-terminal"></i> Scan Log</span>
        <button class="btn btn-sm" id="agent-clear-log">Clear</button>
      </div>
      <div id="agent-scan-log" style="max-height:300px;overflow-y:auto">
        ${agentLog.length === 0
          ? '<div class="empty-state">No scan log entries yet. Run a scan to generate log entries.</div>'
          : agentLog.map(renderLogEntry).join('')}
      </div>
    </div>
  `

  el.querySelector('#cfg-agent-back').addEventListener('click', () => renderMain(el))

  el.querySelector('#agent-save-cfg').addEventListener('click', () => {
    state.settings.agentSchedule = el.querySelector('#agent-schedule').value
    state.settings.agentAlertEmail = el.querySelector('#agent-email').value
    state.settings.agentAlertOnFail = el.querySelector('#agent-alert-fail').checked
    state.settings.agentDailyDigest = el.querySelector('#agent-daily-digest').checked
    saveState()
    showToast('Agent configuration saved.', 'success')
  })

  el.querySelector('#agent-clear-log').addEventListener('click', () => {
    state.cfgAgentLog = []
    saveState()
    el.querySelector('#agent-scan-log').innerHTML = '<div class="empty-state">Log cleared.</div>'
  })

  el.querySelector('#cfg-agent-run-now').addEventListener('click', () => {
    runAgentScan(el)
  })

  el.querySelectorAll('.topic-enabled-toggle').forEach(t => {
    t.addEventListener('change', e => {
      TOPIC_ENABLED[e.target.dataset.tid] = e.target.checked
    })
  })
}

function renderLogEntry(entry) {
  const icons = { scan: 'ti-scan', pass: 'ti-circle-check', fail: 'ti-circle-x', warn: 'ti-alert-triangle', info: 'ti-info-circle', done: 'ti-check' }
  const colors = { scan: 'var(--clr-info-text)', pass: 'var(--clr-success-text)', fail: 'var(--clr-danger-text)', warn: 'var(--clr-warning-text)', info: 'var(--clr-info-text)', done: 'var(--clr-success-text)' }
  return `
    <div class="scan-log-entry">
      <span class="scan-log-time">${entry.time}</span>
      <i class="ti ${icons[entry.type]||'ti-info-circle'} scan-log-icon" style="color:${colors[entry.type]||'inherit'}"></i>
      <span style="flex:1;color:var(--color-text-secondary)">${entry.msg}</span>
    </div>
  `
}

async function runAgentScan(el) {
  const btn = el.querySelector('#cfg-agent-run-now')
  btn.innerHTML = `<span class="spinner"></span> Scanning...`
  btn.disabled = true

  const logDiv = el.querySelector('#agent-scan-log')
  logDiv.innerHTML = ''

  const now = new Date()
  const timeStr = () => now.toLocaleTimeString('en-GB', { hour:'2-digit', minute:'2-digit', second:'2-digit' })

  const entries = []

  const addEntry = (type, msg) => {
    const entry = { type, msg, time: timeStr() }
    entries.unshift(entry)
    state.cfgAgentLog = entries.slice(0, 50)
    saveState()
    logDiv.innerHTML = entries.map(renderLogEntry).join('')
  }

  addEntry('info', 'Agent scan initiated — scanning 9 topic areas...')

  for (const topic of CFG_TOPICS) {
    await delay(350)
    const s = getTopicStats(topic)
    const type = s.fail > 0 ? 'fail' : s.warn > 0 ? 'warn' : 'pass'
    addEntry(type, `Topic ${topic.num}: ${topic.name} — ${s.pass} pass, ${s.warn} warn, ${s.fail} fail`)
  }

  await delay(400)
  const overall = getOverallStats()
  addEntry('done', `Scan complete — Score: ${overall.score}% · ${overall.pass} pass · ${overall.warn} warn · ${overall.fail} fail`)

  btn.innerHTML = `<i class="ti ti-player-play"></i> Run scan now`
  btn.disabled = false
  showToast('Agent scan complete — 96 controls validated.', 'success')
}

function delay(ms) {
  return new Promise(r => setTimeout(r, ms))
}

// ============================================================
// Re-render topic view when settings change (called from settings page)
// ============================================================
export function refreshM365ConfigView() {
  const el = document.getElementById('page-m365config')
  if (!el || !el.classList.contains('active')) return
  if (cfgView === 'topic' && activeTopic) {
    renderTopic(el, activeTopic)
  } else if (cfgView === 'main') {
    renderMain(el)
  }
}

function escapeHtml(str) {
  if (!str) return ''
  return str.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;')
}

function escapeAttr(str) {
  if (!str) return ''
  return str.replace(/"/g,'&quot;').replace(/'/g,'&#039;')
}
