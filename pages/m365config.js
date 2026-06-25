import { state, saveState } from '../app.js'
import { showToast } from '../components/toast.js'
import { isDemoAccount } from '../lib/demo-account.js'
import { getCISControls } from '../lib/api-client.js'
import { CFG_TOPICS } from '../data/cis-controls.js'
import { skeletonLoader } from '../lib/skeleton-loader.js'
import { getValidationSummary, validateAllTopics, getFailedControls, getWarningControls, getRiskScore } from '../lib/config-validator.js'

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
  // Manual controls default to 'fail' to force admin review
  if (control.type === 'manual' && !state.cfgAttested?.[control.id]) {
    return 'fail'
  }
  if (state.cfgAttested[control.id]) return state.cfgAttested[control.id]
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

export async function initM365Config() {
  const el = document.getElementById('page-m365config')
  if (!el) return

  if (cfgView === 'validation') {
    renderValidationView(el)
  } else if (cfgView === 'topic') {
    if (activeTopic) {
      if (isDemoAccount()) {
        renderDemoTopic(el, activeTopic)
      } else {
        await renderProductionTopic(el, activeTopic)
      }
    }
  } else {
    cfgView = 'main'
    activeTopic = null
    if (isDemoAccount()) {
      renderDemoMain(el)
    } else {
      await renderProductionMain(el)
    }
  }
}

function renderDemoMain(el) {
  const stats = getOverallStats()
  const cls = scoreClass(stats.score)

  el.innerHTML = `
    <div class="page-header">
      <div>
        <div class="page-title"><i class="ti ti-settings-2"></i> Microsoft 365 Configuration</div>
        <div class="page-subtitle">CIS Benchmark Compliance · ${stats.total} controls across 9 configuration areas</div>
      </div>
      <div class="page-actions">
        <button class="btn" id="cfg-validation-btn"><i class="ti ti-checklist"></i> Validation Report</button>
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

    <div style="font-size:11px;font-weight:600;color:var(--color-text-secondary);margin-bottom:16px;padding-bottom:8px;border-bottom:1px solid var(--color-border-secondary);text-transform:uppercase;letter-spacing:0.5px">Configuration Areas</div>
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
      <!-- Header with Icon and Name -->
      <div style="display:flex;align-items:center;gap:12px;margin-bottom:16px;padding-bottom:12px;border-bottom:1px solid var(--color-border-secondary)">
        <div style="background:${tc.bg};color:${tc.color};width:40px;height:40px;border-radius:8px;display:flex;align-items:center;justify-content:center;flex-shrink:0">
          <i class="ti ${topic.icon}" style="font-size:20px"></i>
        </div>
        <div style="flex:1;min-width:0">
          <div style="font-weight:700;font-size:14px;color:var(--color-text-primary);line-height:1.3">${topic.name}</div>
        </div>
        <div style="font-size:16px;font-weight:700;color:${tc.color}">${s.score}%</div>
      </div>

      <!-- Stats Row -->
      <div style="display:flex;gap:12px;margin-bottom:12px">
        ${s.fail > 0 ? `<span style="padding:4px 8px;background:var(--clr-danger-bg);color:var(--clr-danger-text);border-radius:4px;font-size:11px;font-weight:600">${s.fail} Failed</span>` : ''}
        ${s.warn > 0 ? `<span style="padding:4px 8px;background:var(--clr-warning-bg);color:var(--clr-warning-text);border-radius:4px;font-size:11px;font-weight:600">${s.warn} Warnings</span>` : ''}
        ${s.pass > 0 ? `<span style="padding:4px 8px;background:var(--clr-success-bg);color:var(--clr-success-text);border-radius:4px;font-size:11px;font-weight:600">${s.pass} Passed</span>` : ''}
      </div>

      <!-- Progress Bar -->
      <div style="background:var(--color-background-secondary);height:6px;border-radius:3px;overflow:hidden">
        <div style="background:${tc.color};height:100%;width:${s.score}%;transition:width 0.3s ease"></div>
      </div>
    `
    card.addEventListener('click', () => {
      activeTopic = topic
      cfgView = 'topic'
      renderDemoTopic(el, topic)
    })
    grid.appendChild(card)
  })

  el.querySelector('#cfg-validation-btn').addEventListener('click', () => {
    cfgView = 'validation'
    renderValidationView(el)
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

async function renderProductionTopic(el, topic) {
  if (!topic || !topic.id) {
    console.error('❌ Invalid topic data:', topic)
    showToast('Error: Invalid topic data', 'error')
    return
  }

  console.log(`📂 Loading topic ${topic.id}: ${topic.name}`)

  // Fetch real data from backend
  const result = await getCISControls()
  if (!result.success || !result.data) {
    console.warn('⚠️ Using demo data for topic (API unavailable)')
    renderDemoTopic(el, topic)
    return
  }

  // Find the topic in the real data
  const realTopic = result.data.find(t => t.id === topic.id)
  const displayTopic = realTopic || topic

  if (!displayTopic.subsections) {
    console.error('❌ Topic missing subsections:', displayTopic)
    showToast('Error: Topic data incomplete', 'error')
    return
  }

  const stats = getTopicStats(displayTopic)
  console.log(`✅ Loaded topic ${topic.id} with ${displayTopic.subsections.length} subsections`)
  const cls = scoreClass(stats.score)

  el.innerHTML = `
    <div class="page-header">
      <div>
        <div class="page-title"><i class="ti ti-settings-2"></i> ${displayTopic.name}</div>
        <div class="page-subtitle">Microsoft 365 Admin Center · ${stats.total} controls from Graph API</div>
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
  displayTopic.subsections.forEach(subsection => {
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
            <th style="padding:10px 12px;text-align:center;font-weight:600;font-size:11px;width:5%">Details</th>
          </tr>
        </thead>
        <tbody>
          ${subsection.controls.map(control => `
            <tr style="border-bottom:0.5px solid var(--color-border-tertiary);cursor:pointer;transition:background 0.2s" class="control-row" data-control-id="${control.id}">
              <td style="padding:10px 12px;font-size:10px;font-family:monospace">${control.id}</td>
              <td style="padding:10px 12px;font-size:11px">${control.title || control.name || '—'}</td>
              <td style="padding:10px 12px;font-size:10px"><span class="badge ${control.type === 'manual' ? 'purple' : 'info'}">${control.type === 'manual' ? 'Manual' : 'Auto'}</span></td>
              <td style="padding:10px 12px;font-size:10px">${statusBadge(getEffectiveStatus(control))}</td>
              <td style="padding:10px 12px;font-size:10px;text-align:center"><i class="ti ti-chevron-right" style="font-size:16px;color:var(--color-text-tertiary)"></i></td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    `

    // Add row hover effect
    const rows = subsectionDiv.querySelectorAll('.control-row')
    rows.forEach(row => {
      row.addEventListener('mouseenter', () => {
        row.style.background = 'var(--color-background-secondary)'
      })
      row.addEventListener('mouseleave', () => {
        row.style.background = ''
      })
      row.addEventListener('click', (e) => {
        e.stopPropagation()
        const controlId = row.dataset.controlId
        console.log(`🔍 Control row clicked: ${controlId}`)
        const control = subsection.controls.find(c => c.id === controlId)
        if (control) {
          console.log(`📋 Opening details for control ${controlId}:`, control)
          showControlDetails(el, control, displayTopic)
        } else {
          console.error(`❌ Control ${controlId} not found in subsection:`, subsection)
        }
      })
    })

    controlsDiv.appendChild(subsectionDiv)
  })

  el.querySelector('#cfg-back').addEventListener('click', () => {
    cfgView = 'main'
    activeTopic = null
    initM365Config()
  })
}

function renderDemoTopic(el, topic) {
  const stats = getTopicStats(topic)
  const cls = scoreClass(stats.score)

  el.innerHTML = `
    <div class="page-header">
      <div>
        <div class="page-title"><i class="ti ti-settings-2"></i> ${topic.name}</div>
        <div class="page-subtitle">Microsoft 365 Admin Center · ${stats.total} controls</div>
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
            <th style="padding:10px 12px;text-align:center;font-weight:600;font-size:11px;width:5%">Details</th>
          </tr>
        </thead>
        <tbody>
          ${subsection.controls.map(control => `
            <tr style="border-bottom:0.5px solid var(--color-border-tertiary);cursor:pointer;transition:background 0.2s" class="control-row" data-control-id="${control.id}">
              <td style="padding:10px 12px;font-size:10px;font-family:monospace">${control.id}</td>
              <td style="padding:10px 12px;font-size:11px">${control.title || control.name || '—'}</td>
              <td style="padding:10px 12px;font-size:10px"><span class="badge ${control.type === 'manual' ? 'purple' : 'info'}">${control.type === 'manual' ? 'Manual' : 'Auto'}</span></td>
              <td style="padding:10px 12px;font-size:10px">${statusBadge(getEffectiveStatus(control))}</td>
              <td style="padding:10px 12px;font-size:10px;text-align:center"><i class="ti ti-chevron-right" style="font-size:16px;color:var(--color-text-tertiary)"></i></td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    `

    // Add row hover effect
    const rows = subsectionDiv.querySelectorAll('.control-row')
    rows.forEach(row => {
      row.addEventListener('mouseenter', () => {
        row.style.background = 'var(--color-background-secondary)'
      })
      row.addEventListener('mouseleave', () => {
        row.style.background = ''
      })
      row.addEventListener('click', () => {
        const controlId = row.dataset.controlId
        const control = subsection.controls.find(c => c.id === controlId)
        if (control) {
          showControlDetails(el, control, topic)
        }
      })
    })

    controlsDiv.appendChild(subsectionDiv)
  })

  el.querySelector('#cfg-back').addEventListener('click', () => {
    cfgView = 'main'
    activeTopic = null
    initM365Config()
  })
}

function renderProductionTopicCards(el) {
  const stats = getOverallStats()
  const cls = scoreClass(stats.score)

  el.innerHTML = `
    <div class="page-header">
      <div>
        <div class="page-title"><i class="ti ti-settings-2"></i> Microsoft 365 Configuration</div>
        <div class="page-subtitle">CIS Benchmark Compliance · ${stats.total} controls from Graph API</div>
      </div>
      <div class="page-actions">
        <button class="btn" id="cfg-validation-btn"><i class="ti ti-checklist"></i> Validation Report</button>
        <button class="btn" id="cfg-scan-now"><i class="ti ti-refresh"></i> Re-scan</button>
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
    </div>

    <div style="display:flex;align-items:center;gap:8px;padding:8px 12px;background:var(--color-background-primary);border:0.5px solid var(--color-border-secondary);border-radius:var(--border-radius-md);margin-bottom:16px;font-size:10px;color:var(--color-text-tertiary)">
      <span class="status-dot active pulse"></span>
      <span><strong style="color:var(--color-text-secondary)">Tip:</strong> Click on any area below to view detailed controls</span>
    </div>

    <div style="font-size:11px;font-weight:600;color:var(--color-text-secondary);margin-bottom:16px;padding-bottom:8px;border-bottom:1px solid var(--color-border-secondary);text-transform:uppercase;letter-spacing:0.5px">Configuration Areas</div>
    <div class="cfg-topic-grid" id="cfg-topic-grid"></div>
  `

  const grid = el.querySelector('#cfg-topic-grid')
  CFG_TOPICS.forEach(topic => {
    const s = getTopicStats(topic)
    const tCls = scoreClass(s.score)
    const card = document.createElement('div')
    card.className = 'cfg-topic-card'
    const tc = TOPIC_COLOURS[topic.id] || { bg: '#f0f0f0', color: '#555' }
    card.style.cursor = 'pointer'
    card.innerHTML = `
      <div style="display:flex;align-items:center;gap:12px;margin-bottom:16px;padding-bottom:12px;border-bottom:1px solid var(--color-border-secondary)">
        <div style="background:${tc.bg};color:${tc.color};width:40px;height:40px;border-radius:8px;display:flex;align-items:center;justify-content:center;flex-shrink:0">
          <i class="ti ${topic.icon}" style="font-size:20px"></i>
        </div>
        <div style="flex:1">
          <div style="font-weight:600;font-size:12px;color:var(--color-text-primary)">${topic.name}</div>
          <div style="font-size:10px;color:var(--color-text-tertiary)">${s.total} controls</div>
        </div>
        <div style="text-align:right">
          <div style="font-size:14px;font-weight:700;color:var(--clr-${tCls}-text)">${s.score}%</div>
          <div style="font-size:9px;color:var(--color-text-tertiary)">Score</div>
        </div>
      </div>

      <div style="display:flex;gap:8px;margin-bottom:12px">
        <div style="flex:1;text-align:center;padding:8px;background:var(--color-background-secondary);border-radius:4px">
          <div style="font-size:12px;font-weight:600;color:var(--clr-success-text)">${s.pass}</div>
          <div style="font-size:9px;color:var(--color-text-tertiary)">Pass</div>
        </div>
        <div style="flex:1;text-align:center;padding:8px;background:var(--color-background-secondary);border-radius:4px">
          <div style="font-size:12px;font-weight:600;color:var(--clr-warning-text)">${s.warn}</div>
          <div style="font-size:9px;color:var(--color-text-tertiary)">Warn</div>
        </div>
        <div style="flex:1;text-align:center;padding:8px;background:var(--color-background-secondary);border-radius:4px">
          <div style="font-size:12px;font-weight:600;color:var(--clr-danger-text)">${s.fail}</div>
          <div style="font-size:9px;color:var(--color-text-tertiary)">Fail</div>
        </div>
      </div>

      <button class="btn btn-sm view-details-btn" style="width:100%;font-size:10px"><i class="ti ti-arrow-right"></i> View Details</button>
    `

    const viewBtn = card.querySelector('.view-details-btn')
    if (viewBtn) {
      viewBtn.addEventListener('click', async (e) => {
        e.preventDefault()
        e.stopPropagation()
        console.log(`🔍 Topic card clicked: ${topic.id} - ${topic.name}`)
        cfgView = 'topic'
        activeTopic = topic
        console.log(`📂 Calling renderProductionTopic for topic:`, topic)
        try {
          await renderProductionTopic(el, topic)
          console.log(`✅ renderProductionTopic completed`)
        } catch (err) {
          console.error(`❌ Error in renderProductionTopic:`, err)
          showToast(`Error opening topic: ${err.message}`, 'error')
        }
      })
    } else {
      console.warn(`⚠️ View Details button not found for topic ${topic.id}`)
    }

    grid.appendChild(card)
  })

  el.querySelector('#cfg-validation-btn')?.addEventListener('click', () => {
    cfgView = 'validation'
    renderValidationView(el)
  })

  el.querySelector('#cfg-scan-now')?.addEventListener('click', async () => {
    const btn = el.querySelector('#cfg-scan-now')
    btn.innerHTML = `<span class="spinner dark"></span> Scanning...`
    btn.disabled = true
    await renderProductionMain(el)
    btn.innerHTML = `<i class="ti ti-refresh"></i> Re-scan`
    btn.disabled = false
  })

  el.querySelector('#cfg-agent-btn')?.addEventListener('click', () => {
    showToast('Configuration Agent will help remediate failed controls', 'info')
  })
}

async function renderProductionMain(el) {
  // Show skeleton immediately
  el.innerHTML = `
    <div>
      ${skeletonLoader.renderPageHeader('Microsoft 365 Configuration', 'Loading compliance summary...', true)}
      ${skeletonLoader.renderMetricsRowSkeleton(4)}
      ${skeletonLoader.renderCardGridSkeleton(3, 9)}
    </div>
  `

  try {
    console.log('📊 Loading topic summaries (no detailed controls yet)...')

    // Render topic cards immediately with skeleton for each
    renderProductionTopicCards(el)

    // Fetch full data in background for quick access
    const result = await getCISControls()
    console.log('📊 CIS Controls result:', result)

    if (!result.success || !result.data || result.data.length === 0) {
      console.warn('⚠️ No data returned from CIS Controls API:', result)
      renderBlankProductionState(el)
      return
    }

    console.log('✅ Successfully loaded', result.data.length, 'topics')

    // Calculate stats from real data
    const allControls = result.data.flatMap(t => t.subsections.flatMap(s => s.controls))
    const totalReal = allControls.length
    let passReal = 0, failReal = 0, warnReal = 0, manualReal = 0
    allControls.forEach(c => {
      const eff = getEffectiveStatus(c)
      if (eff === 'pass') passReal++
      else if (eff === 'fail') failReal++
      else if (eff === 'warn') warnReal++
      if (c.type === 'manual') manualReal++
    })
    const scoreReal = totalReal > 0 ? Math.round((passReal / totalReal) * 100) : 0
    const stats = { total: totalReal, pass: passReal, fail: failReal, warn: warnReal, manual: manualReal, score: scoreReal }
    const cls = scoreClass(stats.score)

    el.innerHTML = `
      <div class="page-header">
        <div>
          <div class="page-title"><i class="ti ti-settings-2"></i> Microsoft 365 Configuration</div>
          <div class="page-subtitle">CIS Benchmark Compliance · ${stats.total} controls from Graph API</div>
        </div>
        <div class="page-actions">
          <button class="btn" id="cfg-validation-btn"><i class="ti ti-checklist"></i> Validation Report</button>
          <button class="btn" id="cfg-scan-now"><i class="ti ti-refresh"></i> Re-scan</button>
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
        <span><strong style="color:var(--color-text-secondary)">Production Mode</strong> · Real tenant configuration from Graph API</span>
      </div>

      <div style="font-size:11px;font-weight:600;color:var(--color-text-secondary);margin-bottom:16px;padding-bottom:8px;border-bottom:1px solid var(--color-border-secondary);text-transform:uppercase;letter-spacing:0.5px">Configuration Areas</div>
      <div class="cfg-topic-grid" id="cfg-topic-grid"></div>
    `

    const grid = el.querySelector('#cfg-topic-grid')
    result.data.forEach(topic => {
      const s = getTopicStats(topic)
      const tCls = scoreClass(s.score)
      const card = document.createElement('div')
      card.className = 'cfg-topic-card'
      const tc = TOPIC_COLOURS[topic.id] || { bg: '#f0f0f0', color: '#555' }
      card.innerHTML = `
        <!-- Header with Icon and Name -->
        <div style="display:flex;align-items:center;gap:12px;margin-bottom:16px;padding-bottom:12px;border-bottom:1px solid var(--color-border-secondary)">
          <div style="background:${tc.bg};color:${tc.color};width:40px;height:40px;border-radius:8px;display:flex;align-items:center;justify-content:center;flex-shrink:0">
            <i class="ti ${topic.icon}" style="font-size:20px"></i>
          </div>
          <div style="flex:1;min-width:0">
            <div style="font-weight:700;font-size:14px;color:var(--color-text-primary);line-height:1.3">${topic.name}</div>
          </div>
          <div style="font-size:16px;font-weight:700;color:${tc.color}">${s.score}%</div>
        </div>

        <!-- Stats Row -->
        <div style="display:flex;gap:12px;margin-bottom:12px">
          ${s.fail > 0 ? `<span style="padding:4px 8px;background:var(--clr-danger-bg);color:var(--clr-danger-text);border-radius:4px;font-size:11px;font-weight:600">${s.fail} Failed</span>` : ''}
          ${s.warn > 0 ? `<span style="padding:4px 8px;background:var(--clr-warning-bg);color:var(--clr-warning-text);border-radius:4px;font-size:11px;font-weight:600">${s.warn} Warnings</span>` : ''}
          ${s.pass > 0 ? `<span style="padding:4px 8px;background:var(--clr-success-bg);color:var(--clr-success-text);border-radius:4px;font-size:11px;font-weight:600">${s.pass} Passed</span>` : ''}
        </div>

        <!-- Progress Bar -->
        <div style="background:var(--color-background-secondary);height:6px;border-radius:3px;overflow:hidden">
          <div style="background:${tc.color};height:100%;width:${s.score}%;transition:width 0.3s ease"></div>
        </div>
      `
      card.addEventListener('click', async () => {
        activeTopic = topic
        cfgView = 'topic'
        if (isDemoAccount()) {
          renderDemoTopic(el, topic)
        } else {
          await renderProductionTopic(el, topic)
        }
      })
      grid.appendChild(card)
    })

    el.querySelector('#cfg-validation-btn')?.addEventListener('click', () => {
      cfgView = 'validation'
      renderValidationView(el)
    })

    el.querySelector('#cfg-scan-now')?.addEventListener('click', async () => {
      const btn = el.querySelector('#cfg-scan-now')
      btn.innerHTML = `<span class="spinner dark"></span> Scanning...`
      btn.disabled = true
      setTimeout(async () => {
        btn.innerHTML = `<i class="ti ti-refresh"></i> Re-scan`
        btn.disabled = false
        await renderProductionMain(el)
        showToast('Configuration scan completed', 'success')
      }, 2000)
    })

    el.querySelector('#cfg-agent-btn')?.addEventListener('click', () => {
      showToast('Configuration Agent will help remediate failed controls', 'info')
    })
  } catch (error) {
    console.error('❌ Error loading CIS controls:', error)
    renderErrorState(el, error.message)
  }
}

function renderErrorState(el, errorMsg) {
  el.innerHTML = `
    <div class="page-header">
      <div>
        <div class="page-title"><i class="ti ti-settings-2"></i> Microsoft 365 Configuration</div>
        <div class="page-subtitle">CIS Benchmark Compliance Assessment</div>
      </div>
      <div class="page-actions">
        <button class="btn" id="cfg-retry"><i class="ti ti-refresh"></i> Retry</button>
      </div>
    </div>

    <div class="alert alert-danger" style="margin-bottom:16px">
      <i class="ti ti-alert-circle"></i>
      <div>
        <strong>Configuration Load Failed</strong>
        <div style="font-size:11px;margin-top:4px">⏱️ The backend API is taking too long to respond (validation may take 2+ minutes)</div>
        <div style="font-size:10px;margin-top:8px;font-family:monospace;background:var(--color-background-secondary);padding:8px;border-radius:4px">${errorMsg}</div>
        <div style="font-size:11px;margin-top:8px;color:var(--color-text-tertiary)">💡 Try clicking "Retry" below, or check the browser console (F12) for more details</div>
      </div>
    </div>
  `

  el.querySelector('#cfg-retry').addEventListener('click', async () => {
    const btn = el.querySelector('#cfg-retry')
    btn.innerHTML = `<span class="spinner dark"></span> Loading...`
    btn.disabled = true
    await renderProductionMain(el)
  })
}

function renderBlankProductionState(el) {
  el.innerHTML = `
    <div class="page-header">
      <div>
        <div class="page-title"><i class="ti ti-settings-2"></i> Microsoft 365 Configuration</div>
        <div class="page-subtitle">CIS Benchmark Compliance Assessment</div>
      </div>
      <div class="page-actions">
        <button class="btn" id="cfg-scan-now"><i class="ti ti-refresh"></i> Run scan</button>
      </div>
    </div>

    <div class="blank-state">
      <i class="ti ti-settings-off" style="font-size:48px;color:var(--color-text-tertiary);margin-bottom:12px"></i>
      <div style="font-size:13px;font-weight:600;margin-bottom:4px">No Configuration Data Available</div>
      <div style="font-size:11px;color:var(--color-text-tertiary);margin-bottom:16px">
        The API returned no data. Backend may be initializing...
      </div>
      <button class="btn btn-primary" id="cfg-scan-now"><i class="ti ti-refresh"></i> Try Again</button>
    </div>
  `

  el.querySelector('#cfg-scan-now').addEventListener('click', async () => {
    const btn = el.querySelector('#cfg-scan-now')
    btn.innerHTML = `<span class="spinner dark"></span> Scanning...`
    btn.disabled = true
    setTimeout(async () => {
      btn.innerHTML = `<i class="ti ti-refresh"></i> Try Again`
      btn.disabled = false
      await renderProductionMain(el)
    }, 2000)
  })
}

function renderValidationView(el) {
  const summary = getValidationSummary()
  const risk = getRiskScore(summary)
  const failed = getFailedControls()
  const warnings = getWarningControls()

  el.innerHTML = `
    <div class="page-header">
      <div>
        <div class="page-title"><i class="ti ti-checklist"></i> Configuration Validation Report</div>
        <div class="page-subtitle">Real-time validation of all 9 configuration areas against CIS benchmarks</div>
      </div>
      <div class="page-actions">
        <button class="btn" id="validation-back"><i class="ti ti-arrow-left"></i> Back</button>
        <button class="btn" id="validation-export"><i class="ti ti-download"></i> Export Report</button>
      </div>
    </div>

    <div class="validation-summary">
      <div class="validation-overview">
        <div class="risk-score" style="border-left: 4px solid ${risk.color}">
          <div class="score-value">${risk.score}</div>
          <div class="score-label">Risk Score</div>
          <div class="score-level" style="color: ${risk.color}">${risk.level}</div>
        </div>

        <div class="overall-stats">
          <div class="stat-item">
            <span class="stat-label">Pass Rate</span>
            <span class="stat-value success">${summary.passRate}%</span>
          </div>
          <div class="stat-item">
            <span class="stat-label">Passed</span>
            <span class="stat-value">${summary.passed}/${summary.totalControls}</span>
          </div>
          <div class="stat-item">
            <span class="stat-label">Failed</span>
            <span class="stat-value danger">${summary.failed}</span>
          </div>
          <div class="stat-item">
            <span class="stat-label">Warnings</span>
            <span class="stat-value warning">${summary.warnings}</span>
          </div>
        </div>
      </div>

      <div class="topics-breakdown">
        <h3>Configuration Areas Status</h3>
        <div class="topics-grid">
          ${summary.topicSummary.map(topic => `
            <div class="topic-card">
              <div class="topic-icon"><i class="ti ${topic.icon}"></i></div>
              <div class="topic-name">${topic.name}</div>
              <div class="topic-stats">
                <div class="pass-rate">${topic.passRate}%</div>
                <div class="control-count">${topic.passed}/${topic.controls} passed</div>
              </div>
              ${topic.failed > 0 ? `<div class="failed-count" style="color:var(--clr-danger-text)">${topic.failed} failed</div>` : ''}
              ${topic.warnings > 0 ? `<div class="warning-count" style="color:var(--clr-warning-text)">${topic.warnings} warnings</div>` : ''}
            </div>
          `).join('')}
        </div>
      </div>
    </div>

    ${failed.length > 0 ? `
      <div class="validation-panel">
        <div class="validation-panel-title">
          <i class="ti ti-alert-circle"></i> Failed Controls (${failed.length})
        </div>
        <div class="validation-controls-list">
          ${failed.map(control => `
            <div class="validation-control-item fail">
              <div class="validation-control-id">${control.controlId}</div>
              <div class="validation-control-title">${control.title}</div>
              <div class="validation-control-message">
                <strong>Topic:</strong> ${control.topic} · <strong>Section:</strong> ${control.subsection}
              </div>
              <div class="validation-control-remediation">
                <strong>Current State:</strong> ${control.current || 'Not configured'}<br>
                <strong>Expected:</strong> ${control.expected}
                ${control.powerShell ? `<br><strong>Validation:</strong> <code>${control.powerShell}</code>` : ''}
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    ` : ''}

    ${warnings.length > 0 ? `
      <div class="validation-panel">
        <div class="validation-panel-title">
          <i class="ti ti-alert-triangle"></i> Warning Controls (${warnings.length})
        </div>
        <div class="validation-controls-list">
          ${warnings.map(control => `
            <div class="validation-control-item warn">
              <div class="validation-control-id">${control.controlId}</div>
              <div class="validation-control-title">${control.title}</div>
              <div class="validation-control-message">
                <strong>Topic:</strong> ${control.topic} · <strong>Section:</strong> ${control.subsection}
              </div>
              <div class="validation-control-remediation">
                <strong>Current State:</strong> ${control.current || 'Requires review'}<br>
                <strong>Recommendation:</strong> ${control.expected}
                ${control.powerShell ? `<br><strong>Validation:</strong> <code>${control.powerShell}</code>` : ''}
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    ` : ''}
  `

  el.querySelector('#validation-back').addEventListener('click', () => {
    cfgView = 'main'
    activeTopic = null
    initM365Config()
  })

  el.querySelector('#validation-export').addEventListener('click', () => {
    const validation = validateAllTopics()
    const timestamp = new Date().toISOString().split('T')[0]
    const filename = `m365-config-validation-${timestamp}.json`
    const json = JSON.stringify(validation, null, 2)
    const blob = new Blob([json], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = filename
    link.click()
    URL.revokeObjectURL(url)
    showToast(`Validation report exported as ${filename}`, 'success')
  })
}

function showControlDetails(parentEl, control, topic) {
  console.log(`🎯 Creating modal for control ${control.id}`)

  // Create overlay modal
  const modal = document.createElement('div')
  modal.className = 'control-details-modal'
  modal.id = `modal-${control.id}`
  modal.style.zIndex = '10000'
  console.log(`✅ Modal element created with ID: ${modal.id}`)

  modal.innerHTML = `
    <div class="control-details-content">
      <div class="control-details-header">
        <div>
          <div class="control-details-id">${control.id}</div>
          <div class="control-details-title">${control.title || control.name || '—'}</div>
          <div class="control-details-meta">${topic.name} · ${control.type === 'manual' ? 'Manual Validation' : 'Automated Validation'}</div>
        </div>
        <div style="display:flex;gap:8px">
          ${statusBadge(getEffectiveStatus(control))}
          <button class="btn btn-sm" id="close-modal" style="background:transparent;border:none;cursor:pointer;color:var(--color-text-secondary)">
            <i class="ti ti-x" style="font-size:20px"></i>
          </button>
        </div>
      </div>

      <div class="control-details-body">
        <!-- Description Section -->
        <div class="detail-section">
          <div class="detail-section-title">Description</div>
          <div class="detail-section-content">${control.desc || control.description || control.title}</div>
        </div>

        <!-- CIS Profile -->
        <div class="detail-section">
          <div class="detail-section-title">CIS Profile</div>
          <div class="detail-section-content"><span class="badge info">${control.profile || 'E3 L1'}</span></div>
        </div>

        <!-- Validation Method -->
        ${control.type === 'auto' ? `
        <div class="detail-section">
          <div class="detail-section-title">Validation Method</div>
          <div class="detail-section-content">
            ${control.validationMethod === 'powershell' || control.psExecuted ? `
              <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px">
                <span style="font-weight:500">🔵 PowerShell Validation</span>
                <button class="btn btn-sm btn-outline" id="toggle-steps">Expand Commands</button>
              </div>
              <div id="graph-steps" style="display:none !important;background:var(--color-background-secondary);border-radius:var(--border-radius-md);padding:12px;font-family:monospace;font-size:9px;line-height:1.6;max-height:400px;overflow-y:auto;text-align:left !important">
                ${control.ps ? `
                  <div style="margin-bottom:12px;text-align:left !important;display:block">
                    <div style="color:var(--color-text-secondary);margin-bottom:8px;font-weight:600;text-align:left !important">📝 PowerShell Commands:</div>
                    ${(() => {
                      const psText = Array.isArray(control.ps) ? control.ps.join('\n') : (typeof control.ps === 'string' ? control.ps : JSON.stringify(control.ps))
                      return psText.split('\n').map((line, idx) => {
                        const trimmedLine = line.trim()
                        return `<div style="margin-bottom:4px;padding:6px;background:var(--color-background-primary);border-radius:4px;border-left:2px solid #ff9800;white-space:pre-wrap;word-break:break-word;color:var(--color-text-primary);text-align:left !important;display:block;margin-left:0 !important"><span style="color:#999;margin-right:8px;display:inline">${String(idx + 1).padStart(2, '0')}</span><span style="display:inline;text-align:left">${trimmedLine || '&nbsp;'}</span></div>`
                      }).join('')
                    })()}
                  </div>
                ` : ''}
              </div>
            ` : `
              <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px">
                <span style="font-weight:500">Graph API Queries</span>
                <button class="btn btn-sm btn-outline" id="toggle-steps">Expand Steps</button>
              </div>
              <div id="graph-steps" style="display:none !important;background:var(--color-background-secondary);border-radius:var(--border-radius-md);padding:12px;font-family:monospace;font-size:9px;line-height:1.6;max-height:400px;overflow-y:auto;text-align:left !important">
                ${control.graphApiDetails?.steps && Array.isArray(control.graphApiDetails.steps) ? `
                  <div style="margin-bottom:12px;text-align:left !important;display:block">
                    <div style="color:var(--color-text-secondary);margin-bottom:8px;font-weight:600;text-align:left !important">📍 Query Steps:</div>
                    ${control.graphApiDetails.steps.map(s => `
                      <div style="margin-bottom:12px;padding:10px;background:var(--color-background-primary);border-radius:4px;border-left:3px solid #0066cc">
                        <div style="color:#0066cc;font-weight:600">Step ${s.step}: ${s.description || s.endpoint}</div>
                        <div style="color:var(--color-text-primary);margin-top:6px">
                          <div><strong>Endpoint:</strong> ${s.endpoint}</div>
                          ${s.select && s.select !== 'none' ? `<div><strong>Select:</strong> ${s.select}</div>` : ''}
                          ${s.filter && s.filter !== 'none' ? `<div><strong>Filter:</strong> ${s.filter}</div>` : ''}
                          ${s.expand && s.expand !== 'none' ? `<div><strong>Expand:</strong> ${s.expand}</div>` : ''}
                        </div>
                      </div>
                    `).join('')}
                  </div>
                ` : ''}
                ${control.graphApiDetails?.graphExplorerCommands && Array.isArray(control.graphApiDetails.graphExplorerCommands) && control.graphApiDetails.graphExplorerCommands.length > 0 ? `
                  <div style="border-top:0.5px solid var(--color-border-tertiary);padding-top:12px">
                    <div style="color:var(--color-text-secondary);margin-bottom:8px;font-weight:600">🔗 Graph Explorer URLs:</div>
                    ${(control.graphApiDetails.graphExplorerCommands || []).map(cmd => `
                      <div style="margin-bottom:8px;padding:8px;background:var(--color-background-primary);border-radius:4px;border-left:3px solid #4caf50;word-break:break-all;cursor:pointer" title="Click to copy">
                        <span style="color:#4caf50">${cmd}</span>
                      </div>
                    `).join('')}
                  </div>
                ` : ''}
              </div>
            `}
          </div>
        </div>
        ` : `
        <div class="detail-section">
          <div class="detail-section-title">Validation Method</div>
          <div class="detail-section-content">
            <span style="color:var(--color-text-secondary)">⚠️ Manual Validation Required</span>
            <div style="margin-top:8px;padding:12px;background:var(--color-background-secondary);border-radius:var(--border-radius-md);font-size:10px">
              ${control.desc || control.description || 'This control requires manual verification in the Microsoft 365 admin center'}
            </div>
            <div style="margin-top:12px">
              <div style="font-size:10px;font-weight:600;color:var(--color-text-secondary);text-transform:uppercase;margin-bottom:8px">Admin Override</div>
              <div style="display:flex;gap:8px;flex-wrap:wrap" id="manual-override-buttons">
                <button class="btn manual-override-btn" data-status="pass" style="background:var(--clr-success-bg);color:var(--clr-success-text);border:1px solid var(--clr-success-border)">✓ Mark as Pass</button>
                <button class="btn manual-override-btn" data-status="warn" style="background:var(--clr-warning-bg);color:var(--clr-warning-text);border:1px solid var(--clr-warning-border)">⚠ Mark as Manual</button>
                <button class="btn manual-override-btn" data-status="fail" style="background:var(--clr-danger-bg);color:var(--clr-danger-text);border:1px solid var(--clr-danger-border)">✗ Mark as Failed</button>
              </div>
            </div>
          </div>
        </div>
        `}

        <!-- Validation Result -->
        <div class="detail-section">
          <div class="detail-section-title">Validation Result</div>
          <div class="detail-section-content">
            <div style="padding:12px;background:var(--color-background-secondary);border-radius:var(--border-radius-md);border-left:4px solid ${getStatusColor(getEffectiveStatus(control))}">
              <div style="font-weight:600;margin-bottom:12px;color:${getStatusColor(getEffectiveStatus(control))};font-size:13px" id="control-status-display">
                ${getStatusIcon(getEffectiveStatus(control))} ${getEffectiveStatus(control).toUpperCase()}
              </div>

              <div style="margin-bottom:12px">
                <div style="font-size:10px;font-weight:600;color:var(--color-text-secondary);text-transform:uppercase;margin-bottom:6px">Current Value</div>
                <div style="font-size:11px;color:var(--color-text-primary);padding:8px;background:var(--color-background-primary);border-radius:4px;border-left:2px solid #0066cc">
                  ${control.value || 'No data available'}
                </div>
              </div>

              <div style="margin-bottom:12px">
                <div style="font-size:10px;font-weight:600;color:var(--color-text-secondary);text-transform:uppercase;margin-bottom:6px">Reasoning</div>
                <div style="font-size:10px;color:var(--color-text-primary);line-height:1.6;padding:8px;background:var(--color-background-primary);border-radius:4px">
                  ${getValidationExplanation(control)}
                </div>
              </div>

              ${control.ps ? `
              <div style="margin-bottom:12px">
                <div style="font-size:10px;font-weight:600;color:var(--color-text-secondary);text-transform:uppercase;margin-bottom:6px">Verify with PowerShell</div>
                <div style="padding:12px;background:var(--color-background-primary);border-radius:4px;border-left:2px solid #ff9800;font-family:monospace;font-size:9px;line-height:1.8;cursor:pointer;max-height:300px;overflow-y:auto;text-align:left !important">
                  ${(() => {
                    const psText = Array.isArray(control.ps) ? control.ps.join('\n') : (typeof control.ps === 'string' ? control.ps : JSON.stringify(control.ps))
                    return psText.split('\n').map(line => {
                      const trimmedLine = line.trim()
                      return `<div style="white-space:pre-wrap;word-break:break-word;text-align:left !important">${trimmedLine || '&nbsp;'}</div>`
                    }).join('')
                  })()}
                </div>
              </div>
              ` : ''}

              ${control.psOutputDisplay ? `
              <div style="margin-bottom:12px">
                <div style="font-size:10px;font-weight:600;color:var(--color-text-secondary);text-transform:uppercase;margin-bottom:6px">PowerShell Execution Output</div>
                <div style="padding:8px;background:${control.psOutput?.error || control.psOutputDisplay?.includes('Error') || control.psOutputDisplay?.includes('failed') ? '#fee' : 'var(--color-background-primary)'};border-radius:4px;border-left:2px solid ${control.psOutput?.error || control.psOutputDisplay?.includes('Error') || control.psOutputDisplay?.includes('failed') ? '#f44' : '#4caf50'};font-family:monospace;font-size:8px;line-height:1.6;word-break:break-word;max-height:250px;overflow-y:auto;color:${control.psOutput?.error || control.psOutputDisplay?.includes('Error') || control.psOutputDisplay?.includes('failed') ? '#c33' : 'var(--color-text-tertiary)'}">
                  ${control.psOutputDisplay.replace(/</g, '&lt;').replace(/>/g, '&gt;').split('\n').map(line => `<div>${line || '&nbsp;'}</div>`).join('')}
                </div>
              </div>
              ` : ''}

              ${control.type === 'auto' && control.graphApiDetails?.steps && Array.isArray(control.graphApiDetails.steps) ? `
              <div>
                <div style="font-size:10px;font-weight:600;color:var(--color-text-secondary);text-transform:uppercase;margin-bottom:6px">Data Retrieved From</div>
                <div style="font-size:9px;color:var(--color-text-tertiary);padding:8px;background:var(--color-background-primary);border-radius:4px">
                  ${control.graphApiDetails.steps.map(s => `<div>• ${s.endpoint}</div>`).join('')}
                </div>
              </div>
              ` : ''}
            </div>
          </div>
        </div>

        <!-- Remediation -->
        ${getEffectiveStatus(control) !== 'pass' ? `
        <div class="detail-section">
          <div class="detail-section-title">Remediation</div>
          <div class="detail-section-content">
            <div style="padding:12px;background:#FFF3CD;border:0.5px solid #FFE69C;border-radius:var(--border-radius-md)">
              <strong>Expected:</strong> ${control.expected || 'Configure ' + control.title}<br>
              <strong>Current:</strong> ${control.current || 'Review required'}<br>
              ${control.ps ? `<br><strong>PowerShell Commands:</strong><br><div style="background:var(--color-background-primary);padding:8px;border-radius:4px;margin-top:8px;font-size:9px;line-height:1.6;overflow-y:auto;font-family:monospace;max-height:200px;text-align:left !important">
                ${(() => {
                  const psText = Array.isArray(control.ps) ? control.ps.join('\n') : (typeof control.ps === 'string' ? control.ps : JSON.stringify(control.ps))
                  return psText.split('\n').map(line => {
                    const trimmedLine = line.trim()
                    return `<div style="white-space:pre-wrap;word-break:break-word;text-align:left !important">${trimmedLine || '&nbsp;'}</div>`
                  }).join('')
                })()}
              </div>` : ''}
            </div>
          </div>
        </div>
        ` : ''}
      </div>

      <div class="control-details-footer">
        <button class="btn" id="close-modal-btn">Close</button>
        <button class="btn btn-primary" id="copy-details">Copy Details</button>
      </div>
    </div>
  `

  // Add to DOM
  document.body.appendChild(modal)
  console.log(`✅ Modal appended to DOM. Modal in body:`, document.body.contains(modal))

  // Verify modal is visible
  const modalInDOM = document.getElementById(`modal-${control.id}`)
  console.log(`🔍 Modal found in DOM after append:`, !!modalInDOM)
  console.log(`📍 Modal display style:`, window.getComputedStyle(modal).display)
  console.log(`📍 Modal visibility:`, window.getComputedStyle(modal).visibility)
  console.log(`📍 Modal z-index:`, window.getComputedStyle(modal).zIndex)

  // Show toast to confirm modal opened
  showToast(`Opening control ${control.id} details...`, 'info')

  // Event listeners
  const closeBtn1 = modal.querySelector('#close-modal')
  const closeBtn2 = modal.querySelector('#close-modal-btn')

  if (closeBtn1) {
    closeBtn1.addEventListener('click', () => {
      console.log(`🔘 Close button 1 clicked`)
      modal.remove()
    })
  } else {
    console.warn(`⚠️ Close button #close-modal not found`)
  }

  if (closeBtn2) {
    closeBtn2.addEventListener('click', () => {
      console.log(`🔘 Close button 2 clicked`)
      modal.remove()
    })
  } else {
    console.warn(`⚠️ Close button #close-modal-btn not found`)
  }

  // Close modal when clicking backdrop (outside the content area)
  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      console.log(`🔘 Backdrop clicked, closing modal`)
      modal.remove()
    }
  })

  const copyBtn = modal.querySelector('#copy-details')
  if (copyBtn) {
    copyBtn.addEventListener('click', () => {
      const text = `Control: ${control.id}\nTitle: ${control.title}\nStatus: ${getEffectiveStatus(control)}\nDescription: ${control.description}`
      navigator.clipboard.writeText(text).then(() => {
        showToast('Control details copied to clipboard', 'success')
      })
    })
  }

  modal.querySelector('#toggle-steps')?.addEventListener('click', (btn) => {
    const steps = modal.querySelector('#graph-steps')
    if (steps.style.display === 'none') {
      steps.style.display = 'block'
      btn.target.textContent = 'Hide Steps'
    } else {
      steps.style.display = 'none'
      btn.target.textContent = 'Expand Steps'
    }
  })

  // Manual validation override buttons
  modal.querySelectorAll('.manual-override-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const newStatus = btn.dataset.status
      const statusLabels = { pass: '✓ PASS', warn: '⚠ MANUAL', fail: '✗ FAILED' }
      const statusIcons = { pass: '✓', warn: '⚠', fail: '✗' }

      // Update control status in state
      if (!state.cfgAttested) state.cfgAttested = {}
      state.cfgAttested[control.id] = newStatus
      saveState()

      // Update modal display - status header
      const statusEl = modal.querySelector('#control-status-display')
      if (statusEl) {
        statusEl.innerHTML = `${statusIcons[newStatus]} ${newStatus.toUpperCase()}`
        statusEl.style.color = getStatusColor(newStatus)
      }

      // Update border color of validation result box
      const resultBox = modal.querySelector('[border-left:4px solid')
      if (resultBox) {
        resultBox.style.borderLeftColor = getStatusColor(newStatus)
      }

      // Visual feedback
      const statusLabel = statusLabels[newStatus]
      showToast(`Control ${control.id} marked as ${statusLabel}`, 'success')

      // Update button styling to show selected status
      modal.querySelectorAll('.manual-override-btn').forEach(b => {
        if (b.dataset.status === newStatus) {
          b.style.opacity = '1'
          b.style.fontWeight = '700'
          b.style.transform = 'scale(1.05)'
        } else {
          b.style.opacity = '0.6'
          b.style.fontWeight = '400'
          b.style.transform = 'scale(1)'
        }
      })
    })
  })

  // Close on escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.parentNode) modal.remove()
  })
}

function getStatusColor(status) {
  const colors = {
    pass: '#4caf50',
    fail: '#f44336',
    warn: '#ff9800'
  }
  return colors[status] || '#999'
}

function getStatusIcon(status) {
  const icons = {
    pass: '✓',
    fail: '✗',
    warn: '⚠'
  }
  return icons[status] || '•'
}

function getValidationExplanation(control) {
  const status = getEffectiveStatus(control)

  // Parse control ID to get category
  const [topic, section, num] = control.id.split('.')

  // Generic explanations based on status and control type
  const explanations = {
    '1.1.1': {
      pass: 'Detected 2-4 Global Administrators as required by CIS benchmark',
      fail: 'No Global Administrators found - access management is compromised',
      warn: 'More than 4 Global Administrators detected - reduces security posture'
    },
    '1.1.2': {
      pass: 'Third-party app consent is properly restricted',
      fail: 'Third-party app consent is allowed - users can grant access to risky apps',
      warn: 'Third-party apps from verified publishers allowed - consider full restriction'
    },
    '1.1.3': {
      pass: 'Default users cannot create new tenants',
      fail: 'Default users can create tenants - significant risk',
      warn: 'Default user tenant creation permissions need review'
    },
    '1.1.4': {
      pass: 'Security Defaults and Conditional Access properly configured',
      fail: 'Conflicting security configuration detected',
      warn: 'Review interaction between Security Defaults and Conditional Access policies'
    }
  }

  // Return control-specific explanation if available
  if (explanations[control.id]) {
    return explanations[control.id][status] || control.description
  }

  // Fallback explanations based on status
  const fallbacks = {
    pass: 'Control validation passed. Configuration meets CIS benchmark requirements.',
    fail: 'Control validation failed. Configuration does not meet CIS benchmark requirements. Review and remediate.',
    warn: 'Control validation shows warning. Configuration partially meets requirements. Review recommended settings.'
  }

  return fallbacks[status] || 'Control validation complete'
}
