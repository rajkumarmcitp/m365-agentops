import { state, saveState } from '../app.js'
import { showToast } from '../components/toast.js'
import { isDemoAccount } from '../lib/demo-account.js'
import { CFG_TOPICS } from '../data/cis-controls.js'

let cfgView = 'main'
let activeTopic = null

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

function scoreClass(score) {
  if (score >= 85) return 'success'
  if (score >= 65) return 'warning'
  return 'danger'
}

export function initM365Config() {
  const el = document.getElementById('page-m365config')
  if (!el) return
  cfgView = 'main'
  activeTopic = null

  if (isDemoAccount()) {
    renderDemoMain(el)
  } else {
    renderBlankMain(el)
  }
}

function renderDemoMain(el) {
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

    <div style="display:flex;align-items:center;gap:8px;padding:8px 12px;background:var(--color-background-primary);border:0.5px solid var(--color-border-secondary);border-radius:var(--border-radius-md);margin-bottom:16px;font-size:10px;color:var(--color-text-tertiary)">
      <span class="status-dot active pulse"></span>
      <span><strong style="color:var(--color-text-secondary)">Demo Mode</strong> · Showing sample CIS controls</span>
    </div>

    <div style="font-size:11px;font-weight:600;color:var(--color-text-secondary);margin-bottom:10px;text-transform:uppercase;letter-spacing:0.5px">Topics</div>
    <div class="cfg-topic-grid" id="cfg-topic-grid"></div>
  `

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
    `
    card.addEventListener('click', () => {
      activeTopic = topic
      cfgView = 'topic'
      renderDemoTopic(el, topic)
    })
    grid.appendChild(card)
  })

  el.querySelector('#cfg-scan-now').addEventListener('click', () => {
    const btn = el.querySelector('#cfg-scan-now')
    btn.innerHTML = `<span class="spinner dark"></span> Scanning...`
    btn.disabled = true
    setTimeout(() => {
      btn.innerHTML = `<i class="ti ti-refresh"></i> Run scan now`
      btn.disabled = false
      showToast('CIS Benchmark scan complete — see results above', 'success')
    }, 2000)
  })
}

function renderDemoTopic(el, topic) {
  const stats = getTopicStats(topic)
  const cls = scoreClass(stats.score)

  el.innerHTML = `
    <div class="page-header">
      <div>
        <div class="page-title"><i class="ti ti-settings-2"></i> ${topic.name}</div>
        <div class="page-subtitle">Topic ${topic.num} · ${stats.total} controls</div>
      </div>
      <div class="page-actions">
        <button class="btn" id="cfg-back"><i class="ti ti-arrow-left"></i> Back</button>
      </div>
    </div>

    <div class="kpi-row">
      <div class="kpi-tile">
        <div class="kpi-value ${cls}">${stats.score}%</div>
        <div class="kpi-label">Score</div>
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
        <div class="kpi-label">Warning</div>
      </div>
    </div>

    <div id="cfg-controls"></div>
  `

  const controlsDiv = el.querySelector('#cfg-controls')
  topic.subsections.forEach(subsection => {
    const subsectionDiv = document.createElement('div')
    subsectionDiv.className = 'card mb-3'
    subsectionDiv.innerHTML = `
      <div class="card-header" style="background:var(--color-background-secondary)">
        <span class="card-title" style="font-size:12px;font-weight:600">${subsection.name}</span>
      </div>
      <table style="width:100%">
        <thead style="background:var(--color-background-secondary)">
          <tr>
            <th style="padding:10px 12px;text-align:left;font-weight:600;font-size:11px;width:15%">ID</th>
            <th style="padding:10px 12px;text-align:left;font-weight:600;font-size:11px;width:40%">Control</th>
            <th style="padding:10px 12px;text-align:left;font-weight:600;font-size:11px;width:15%">Type</th>
            <th style="padding:10px 12px;text-align:left;font-weight:600;font-size:11px;width:15%">Status</th>
          </tr>
        </thead>
        <tbody>
          ${subsection.controls.map(control => `
            <tr style="border-bottom:0.5px solid var(--color-border-tertiary)">
              <td style="padding:10px 12px;font-size:10px;font-family:monospace">${control.id}</td>
              <td style="padding:10px 12px;font-size:11px">${control.name}</td>
              <td style="padding:10px 12px;font-size:10px"><span class="badge ${control.type === 'manual' ? 'purple' : 'info'}">${control.type === 'manual' ? 'Manual' : 'Auto'}</span></td>
              <td style="padding:10px 12px;font-size:10px">${statusBadge(getEffectiveStatus(control))}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    `
    controlsDiv.appendChild(subsectionDiv)
  })

  el.querySelector('#cfg-back').addEventListener('click', () => {
    cfgView = 'main'
    activeTopic = null
    initM365Config()
  })
}

function renderBlankMain(el) {
  el.innerHTML = `
    <div class="page-header">
      <div>
        <div class="page-title"><i class="ti ti-settings-2"></i> M365 Config — CIS Benchmark</div>
        <div class="page-subtitle">Configuration compliance assessment from Graph API</div>
      </div>
      <div class="page-actions">
        <button class="btn" id="cfg-scan-now"><i class="ti ti-refresh"></i> Run scan</button>
      </div>
    </div>

    <div class="blank-state">
      <i class="ti ti-settings-off" style="font-size:48px;color:var(--color-text-tertiary);margin-bottom:12px"></i>
      <div style="font-size:13px;font-weight:600;margin-bottom:4px">No Configuration Data Available</div>
      <div style="font-size:11px;color:var(--color-text-tertiary);margin-bottom:16px">
        M365 Configuration scanning requires real-time assessment through Microsoft Graph API
      </div>
      <div style="font-size:10px;color:var(--color-text-tertiary);padding:12px;background:var(--color-background-secondary);border-radius:var(--border-radius-md);text-align:left;max-width:400px">
        <strong>Data sources:</strong>
        <div style="margin-top:6px;font-family:monospace;font-size:9px">
          /deviceManagement/deviceCompliancePolicies<br>
          /policies/conditionalAccessPolicies<br>
          /identity/authenticationMethods/policies<br>
          /admin/windows/updates/configs
        </div>
      </div>
    </div>
  `

  el.querySelector('#cfg-scan-now').addEventListener('click', () => {
    const btn = el.querySelector('#cfg-scan-now')
    btn.innerHTML = `<span class="spinner dark"></span> Scanning...`
    btn.disabled = true
    setTimeout(() => {
      btn.innerHTML = `<i class="ti ti-refresh"></i> Run scan`
      btn.disabled = false
      showToast('No configuration data available from Graph API', 'info')
    }, 2000)
  })
}
