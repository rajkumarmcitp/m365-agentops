import { showToast } from '../components/toast.js'
import { callAPI } from '../lib/api-client.js'
import { ZT_PILLARS } from '../data/zt-pillars.js'
import { skeletonLoader } from '../lib/skeleton-loader.js'

let realValidations = null
let realTrends = null
let priorityActions = null
let validationDetails = null

export function initZeroTrust() {
  const el = document.getElementById('page-zerotrust')
  if (!el) return

  // Show skeleton/loading state immediately
  renderZeroTrustSkeleton(el)

  // Fetch real validation data in background
  loadZeroTrustData(el)
}

async function loadZeroTrustData(el) {
  try {
    console.log('🔍 Fetching comprehensive Zero Trust validation data...')

    // Fetch all data in parallel
    const [validationsResult, trendsResult, actionsResult] = await Promise.all([
      callAPI('/zero-trust/validations'),
      callAPI('/zero-trust/trends'),
      callAPI('/zero-trust/priority-actions')
    ])

    if (validationsResult.success && validationsResult.data) {
      realValidations = validationsResult.data
      console.log(`✅ Loaded ${realValidations.totalValidations} validations`)
    }

    if (trendsResult.success && trendsResult.data) {
      realTrends = trendsResult.data
      console.log('✅ Loaded trend data')
    }

    if (actionsResult.success && actionsResult.data) {
      priorityActions = actionsResult.data
      console.log(`✅ Loaded ${priorityActions.length} priority actions`)
    }

    renderZeroTrustWithData(el)
  } catch (error) {
    console.warn('⚠️ Failed to fetch Zero Trust data:', error.message)
    // Fallback to demo data
    console.log('📚 Using demo data')
    renderZeroTrustWithDemoData(el)
  }
}

function renderZeroTrustSkeleton(el) {
  el.innerHTML = `
    <div>
      ${skeletonLoader.renderPageHeader('Zero Trust Compliance', 'Validating 80 security controls...', true)}
      ${skeletonLoader.renderMetricsRowSkeleton(5)}
      ${skeletonLoader.renderCardGridSkeleton(2, 3)}
      ${skeletonLoader.renderTableSkeleton(10)}
    </div>
  `
}

function renderZeroTrustWithData(el) {
  if (!realValidations) {
    renderZeroTrustWithDemoData(el)
    return
  }

  const { totalValidations, summary, overallScore } = realValidations
  const scoreColor = overallScore >= 80 ? 'success' : overallScore >= 60 ? 'warning' : 'danger'

  el.innerHTML = `
    <div class="page-header">
      <div>
        <div class="page-title"><i class="ti ti-lock-check"></i> Zero Trust Compliance</div>
        <div class="page-subtitle">${totalValidations} security controls validated across 7 pillars — Last assessment today</div>
      </div>
      <div class="page-actions">
        <button class="btn" id="zt-rescan"><i class="ti ti-refresh"></i> Re-validate</button>
        <button class="btn btn-primary"><i class="ti ti-download"></i> Export Report</button>
      </div>
    </div>

    <!-- Overall Score Card -->
    <div class="card mb-3">
      <div class="card-header">
        <span class="card-title">Overall Zero Trust Posture</span>
        <span class="badge ${scoreColor}">${overallScore}% Compliance</span>
      </div>
      <div style="display:flex;gap:24px;align-items:center;padding:20px 0">
        <div style="flex:1">
          <div style="font-size:48px;font-weight:800;color:var(--clr-${scoreColor}-text);line-height:1">${overallScore}%</div>
          <div style="font-size:13px;color:var(--color-text-secondary);margin-top:8px">
            ${summary.pass}/${totalValidations} controls passed
            <span style="display:inline-block;margin-left:16px;color:var(--clr-warning-text)">
              ${summary.warn} warnings
            </span>
            <span style="display:inline-block;margin-left:8px;color:var(--clr-danger-text)">
              ${summary.fail} failures
            </span>
          </div>
        </div>
        <div style="width:120px">
          <div class="score-bar" style="height:120px;border-radius:50%;background:var(--color-bg-secondary);position:relative;display:flex;align-items:center;justify-content:center">
            <div style="position:absolute;width:120px;height:120px;border-radius:50%;background:conic-gradient(var(--clr-${scoreColor}-text) 0% ${overallScore}%, var(--color-bg-secondary) ${overallScore}% 100%);display:flex;align-items:center;justify-content:center">
              <div style="width:110px;height:110px;border-radius:50%;background:var(--color-bg-primary);display:flex;align-items:center;justify-content:center">
                <span style="font-size:24px;font-weight:700;color:var(--clr-${scoreColor}-text)">${overallScore}%</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      ${realTrends ? `
        <div style="margin-top:16px;padding-top:16px;border-top:1px solid var(--color-border);display:flex;gap:24px">
          <div>
            <div style="font-size:10px;color:var(--color-text-tertiary);text-transform:uppercase;font-weight:600;margin-bottom:4px">7-Day Trend</div>
            <div style="font-size:14px;font-weight:700;color:${realTrends.data[0]?.trend >= 0 ? 'var(--clr-success-text)' : 'var(--clr-danger-text)'}">
              ${realTrends.data[0]?.trend >= 0 ? '+' : ''}${realTrends.data[0]?.trend || 0}%
            </div>
          </div>
          <div>
            <div style="font-size:10px;color:var(--color-text-tertiary);text-transform:uppercase;font-weight:600;margin-bottom:4px">30-Day Trend</div>
            <div style="font-size:14px;font-weight:700;color:${realTrends.data[1]?.trend >= 0 ? 'var(--clr-success-text)' : 'var(--clr-danger-text)'}">
              ${realTrends.data[1]?.trend >= 0 ? '+' : ''}${realTrends.data[1]?.trend || 0}%
            </div>
          </div>
          <div>
            <div style="font-size:10px;color:var(--color-text-tertiary);text-transform:uppercase;font-weight:600;margin-bottom:4px">90-Day Trend</div>
            <div style="font-size:14px;font-weight:700;color:${realTrends.data[2]?.trend >= 0 ? 'var(--clr-success-text)' : 'var(--clr-danger-text)'}">
              ${realTrends.data[2]?.trend >= 0 ? '+' : ''}${realTrends.data[2]?.trend || 0}%
            </div>
          </div>
        </div>
      ` : ''}
    </div>

    <!-- 7 Pillar Score Cards -->
    <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(160px,1fr));gap:12px;margin-bottom:24px">
      ${Object.entries(summary.byPillar).map(([pillar, stats]) => {
        const pillarScore = Math.round((stats.pass / (stats.pass + stats.fail + stats.warn)) * 100) || 0
        const pillarColor = pillarScore >= 80 ? 'success' : pillarScore >= 60 ? 'warning' : 'danger'
        return `
          <div class="card" style="text-align:center;cursor:pointer" data-pillar="${pillar}">
            <div style="padding:16px">
              <div style="font-size:28px;font-weight:700;color:var(--clr-${pillarColor}-text)">${pillarScore}%</div>
              <div style="font-size:11px;color:var(--color-text-secondary);margin-top:6px;font-weight:600">${pillar}</div>
              <div style="font-size:10px;color:var(--color-text-tertiary);margin-top:8px">${stats.pass}/${stats.pass + stats.fail + stats.warn} passed</div>
            </div>
          </div>
        `
      }).join('')}
    </div>

    <!-- Priority Actions Section -->
    ${priorityActions && priorityActions.length > 0 ? `
      <div class="card mb-3">
        <div class="card-header">
          <span class="card-title"><i class="ti ti-alert-circle"></i> Priority Actions</span>
          <span class="badge danger">${priorityActions.length} issues</span>
        </div>
        <div style="overflow-x:auto">
          <table>
            <thead><tr>
              <th style="width:12%">Severity</th>
              <th style="width:35%">Control</th>
              <th style="width:15%">Pillar</th>
              <th style="width:20%">Current Status</th>
              <th style="width:10%">Impact</th>
              <th style="width:8%"></th>
            </tr></thead>
            <tbody>
              ${priorityActions.slice(0, 10).map(action => `
                <tr class="validation-row" data-validation-id="${action.id}">
                  <td data-label="Severity"><span class="badge ${action.severity === 'Critical' ? 'danger' : 'warning'}">${action.severity}</span></td>
                  <td style="font-size:11px;font-weight:500" data-label="Control">
                    <div style="font-weight:600">${action.name}</div>
                    <div style="font-size:10px;color:var(--color-text-tertiary);margin-top:3px">${action.description}</div>
                  </td>
                  <td data-label="Pillar"><span class="pill" style="font-size:10px">${action.category}</span></td>
                  <td style="font-size:10px;color:var(--color-text-secondary)" data-label="Status">
                    ${action.currentValue || action.status}
                  </td>
                  <td data-label="Impact"><span style="font-size:11px;font-weight:600;color:var(--clr-danger-text)">${action.impactScore}/100</span></td>
                  <td data-label="">
                    <button class="btn btn-xs remediate-btn" ${action.autoRemediationAvailable ? '' : 'disabled'} title="${action.autoRemediationAvailable ? 'Auto-remediate' : 'Manual remediation required'}">
                      ${action.autoRemediationAvailable ? '<i class="ti ti-zap"></i>' : '<i class="ti ti-info-circle"></i>'}
                    </button>
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>
    ` : ''}

    <!-- Detailed Validations by Pillar -->
    <div id="zt-pillars"></div>
  `

  // Render pillar details
  renderPillarDetails(el)

  // Attach event listeners
  attachEventListeners(el)
}

function renderPillarDetails(el) {
  const container = el.querySelector('#zt-pillars')
  if (!container || !realValidations) return

  container.innerHTML = Object.entries(realValidations.summary.byPillar).map(([pillar, stats]) => {
    const pillarValidations = realValidations.validations.filter(v => v.pillar === pillar)
    const pillarScore = Math.round((stats.pass / (stats.pass + stats.fail + stats.warn)) * 100) || 0

    return `
      <div class="card mb-3" style="padding:0;overflow:hidden">
        <div class="collapsible-header" style="border-radius:0;background:var(--color-background-secondary);cursor:pointer">
          <span style="flex:1;font-size:12px;font-weight:700">${pillar}</span>
          <div style="display:flex;gap:6px;align-items:center;margin-right:8px">
            ${stats.fail > 0 ? `<span class="badge danger">${stats.fail} fail</span>` : ''}
            ${stats.warn > 0 ? `<span class="badge warning">${stats.warn} warn</span>` : ''}
            ${stats.pass > 0 ? `<span class="badge success">${stats.pass} pass</span>` : ''}
          </div>
          <div style="width:80px;margin-right:8px">
            <div class="score-bar"><div class="score-bar-fill ${pillarScore >= 80 ? 'success' : pillarScore >= 60 ? 'warning' : 'danger'}" style="width:${pillarScore}%"></div></div>
          </div>
          <i class="ti ti-chevron-down" style="font-size:13px;transition:transform 150ms ease"></i>
        </div>
        <div class="collapsible-body open" style="max-height:none">
          ${pillarValidations.map(v => `
            <div style="padding:12px;border-bottom:1px solid var(--color-border);cursor:pointer" class="validation-detail-row" data-validation-id="${v.id}">
              <div style="display:flex;gap:10px;align-items:flex-start">
                <div style="flex-shrink:0;margin-top:2px">
                  ${v.status === 'pass' ? '<span style="font-size:16px;color:var(--clr-success-text)">✓</span>' :
                    v.status === 'fail' ? '<span style="font-size:16px;color:var(--clr-danger-text)">✗</span>' :
                    '<span style="font-size:16px;color:var(--clr-warning-text)">⚠</span>'}
                </div>
                <div style="flex:1">
                  <div style="font-size:12px;font-weight:600">${v.name}</div>
                  <div style="font-size:10px;color:var(--color-text-tertiary);margin-top:2px">${v.description}</div>
                  <div style="font-size:10px;color:var(--color-text-secondary);margin-top:4px">
                    Expected: ${v.expectedValue} | Current: ${v.currentValue || 'Unknown'}
                  </div>
                </div>
                <button class="btn btn-xs" style="flex-shrink:0"><i class="ti ti-arrow-right"></i></button>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    `
  }).join('')
}

function renderZeroTrustWithDemoData(el) {
  // Fallback to original demo rendering
  let allControls = ZT_PILLARS.flatMap(p => p.controls)
  let pass = allControls.filter(c => c.status === 'pass').length
  let warn = allControls.filter(c => c.status === 'warn').length
  let fail = allControls.filter(c => c.status === 'fail').length
  const total = allControls.length

  const pctPass = (pass / total * 100).toFixed(0)
  const pctWarn = (warn / total * 100).toFixed(0)
  const pctFail = (fail / total * 100).toFixed(0)

  el.innerHTML = `
    <div class="page-header">
      <div>
        <div class="page-title"><i class="ti ti-lock-check"></i> Zero Trust Compliance</div>
        <div class="page-subtitle">${total} controls across ${ZT_PILLARS.length} pillars — last assessed today</div>
      </div>
      <div class="page-actions">
        <button class="btn" id="zt-rescan"><i class="ti ti-refresh"></i> Re-scan</button>
        <button class="btn btn-primary"><i class="ti ti-download"></i> Export</button>
      </div>
    </div>

    <div class="kpi-row">
      <div class="kpi-tile">
        <div class="kpi-value warning">${pass}/${total}</div>
        <div class="kpi-label">Overall Score</div>
      </div>
      <div class="kpi-tile">
        <div class="kpi-value success">${pass}</div>
        <div class="kpi-label">Passed</div>
      </div>
      <div class="kpi-tile">
        <div class="kpi-value warning">${warn}</div>
        <div class="kpi-label">Warnings</div>
      </div>
      <div class="kpi-tile">
        <div class="kpi-value danger">${fail}</div>
        <div class="kpi-label">Failed</div>
      </div>
    </div>

    <div class="card mb-3">
      <div class="card-header">
        <span class="card-title">Overall Zero Trust Posture</span>
        <span class="badge warning">${pass}/${total} controls passed</span>
      </div>
      <div class="seg-bar" style="height:10px;border-radius:5px">
        <div class="seg pass" style="width:${pctPass}%"></div>
        <div class="seg warn" style="width:${pctWarn}%"></div>
        <div class="seg fail" style="width:${pctFail}%"></div>
      </div>
      <div style="display:flex;gap:20px;margin-top:8px">
        <span style="font-size:10px;color:var(--clr-success-text)">● ${pass} Passed</span>
        <span style="font-size:10px;color:var(--clr-warning-text)">● ${warn} Warnings</span>
        <span style="font-size:10px;color:var(--clr-danger-text)">● ${fail} Failed</span>
      </div>
    </div>

    <div id="zt-pillars"></div>
  `

  renderPillarsDemoData(el, ZT_PILLARS)
  attachEventListeners(el)
}

function renderPillarsDemoData(el, pillars) {
  const container = el.querySelector('#zt-pillars')
  if (!container) return

  container.innerHTML = pillars.map((pillar, pi) => {
    const pass = pillar.controls.filter(c => c.status === 'pass').length
    const warn = pillar.controls.filter(c => c.status === 'warn').length
    const fail = pillar.controls.filter(c => c.status === 'fail').length
    const total = pillar.controls.length

    const statusCls = fail > 0 ? 'danger' : warn > 0 ? 'warning' : 'success'

    return `
      <div class="card mb-3" style="padding:0;overflow:hidden">
        <div class="collapsible-header" id="zt-pillar-hdr-${pi}" style="border-radius:0;background:var(--color-background-secondary);cursor:pointer">
          <i class="ti ${pillar.icon}" style="font-size:15px;color:var(--color-text-secondary)"></i>
          <span style="flex:1;font-size:12px;font-weight:600">${pillar.name}</span>
          <div style="display:flex;gap:6px;align-items:center;margin-right:8px">
            ${fail > 0 ? `<span class="badge danger">${fail} fail</span>` : ''}
            ${warn > 0 ? `<span class="badge warning">${warn} warn</span>` : ''}
            ${pass > 0 ? `<span class="badge success">${pass} pass</span>` : ''}
          </div>
          <div style="width:80px;margin-right:8px">
            <div class="score-bar"><div class="score-bar-fill ${statusCls}" style="width:${(pass/total*100).toFixed(0)}%"></div></div>
          </div>
          <i class="ti ti-chevron-down" style="font-size:13px;transition:transform 150ms ease" id="zt-pillar-chevron-${pi}"></i>
        </div>
        <div class="collapsible-body open" id="zt-pillar-body-${pi}">
          ${pillar.controls.map((ctrl, ci) => `
            <div>
              <div class="zt-control-row" data-pi="${pi}" data-ci="${ci}">
                <div class="zt-status-icon ${ctrl.status}">
                  <i class="ti ${ctrl.status === 'pass' ? 'ti-check' : ctrl.status === 'warn' ? 'ti-alert-triangle' : 'ti-x'}"></i>
                </div>
                <div style="flex:1">
                  <div style="font-size:11px;font-weight:600">${ctrl.name}</div>
                  <div style="font-size:10px;color:var(--color-text-tertiary);margin-top:1px">${ctrl.desc}</div>
                </div>
                <div style="font-size:10px;color:var(--color-text-secondary);max-width:180px;text-align:right;margin-right:8px;font-style:italic">${ctrl.value || ''}</div>
                <button class="chevron-btn zt-expand-btn"><i class="ti ti-chevron-right"></i></button>
              </div>
              <div class="zt-expand-panel ${ctrl.status}-border" data-pi="${pi}" data-ci="${ci}">
                <strong>Remediation guidance</strong>
                <p style="margin-top:6px">${ctrl.remediation || 'No remediation required.'}</p>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    `
  }).join('')
}

function attachEventListeners(el) {
  // Pillar collapsible headers
  el.querySelectorAll('[id^="zt-pillar-hdr-"]').forEach(hdr => {
    hdr.addEventListener('click', () => {
      const pi = hdr.id.replace('zt-pillar-hdr-', '')
      const body = el.querySelector(`#zt-pillar-body-${pi}`)
      const chev = el.querySelector(`#zt-pillar-chevron-${pi}`)
      if (body) {
        body.classList.toggle('open')
        if (chev) chev.style.transform = body.classList.contains('open') ? 'rotate(0deg)' : 'rotate(-90deg)'
      }
    })
  })

  // Control row expand buttons
  el.querySelectorAll('.zt-control-row').forEach(row => {
    row.addEventListener('click', e => {
      if (e.target.closest('.zt-expand-btn')) {
        const { pi, ci } = row.dataset
        const panel = el.querySelector(`.zt-expand-panel[data-pi="${pi}"][data-ci="${ci}"]`)
        const btn = row.querySelector('.zt-expand-btn')
        if (panel) {
          panel.classList.toggle('open')
          if (btn) btn.classList.toggle('open', panel.classList.contains('open'))
        }
      }
    })
  })

  // Validation detail rows - show modal
  el.querySelectorAll('.validation-detail-row, .validation-row').forEach(row => {
    row.addEventListener('click', e => {
      if (!e.target.closest('.btn, .remediate-btn')) {
        const validationId = row.dataset.validationId
        if (validationId && realValidations) {
          const validation = realValidations.validations.find(v => v.id === validationId)
          if (validation) showValidationModal(el, validation)
        }
      }
    })
  })

  // Remediate buttons
  el.querySelectorAll('.remediate-btn').forEach(btn => {
    btn.addEventListener('click', async (e) => {
      e.stopPropagation()
      const validationId = btn.closest('.validation-row')?.dataset.validationId
      if (!validationId) return

      btn.innerHTML = '<span class="spinner dark"></span>'
      btn.disabled = true

      try {
        const result = await callAPI(`/zero-trust/remediate/${validationId}`, 'POST')
        if (result.success) {
          showToast(`Remediation successful: ${result.data.message}`, 'success')
          setTimeout(() => location.reload(), 1500)
        } else {
          showToast(`Remediation failed: ${result.error}`, 'error')
          btn.innerHTML = '<i class="ti ti-zap"></i>'
          btn.disabled = false
        }
      } catch (error) {
        showToast(`Error: ${error.message}`, 'error')
        btn.innerHTML = '<i class="ti ti-zap"></i>'
        btn.disabled = false
      }
    })
  })

  // Re-scan button
  const rescanBtn = el.querySelector('#zt-rescan')
  if (rescanBtn) {
    rescanBtn.addEventListener('click', () => {
      rescanBtn.innerHTML = '<span class="spinner dark"></span> Validating...'
      rescanBtn.disabled = true
      setTimeout(() => {
        location.reload()
      }, 2000)
    })
  }

  // Pillar cards (click to drill down)
  el.querySelectorAll('[data-pillar]').forEach(card => {
    card.addEventListener('click', () => {
      const pillarName = card.dataset.pillar
      // Smooth scroll to pillar section
      const section = el.querySelector(`[data-pillar="${pillarName}"]`)
      if (section) {
        section.scrollIntoView({ behavior: 'smooth' })
      }
    })
  })
}

function showValidationModal(el, validation) {
  const html = `
    <div style="position:fixed;top:0;left:0;right:0;bottom:0;background:rgba(0,0,0,0.6);display:flex;align-items:center;justify-content:center;z-index:10000;padding:20px" id="validation-modal-backdrop">
      <div style="background:#fff;border-radius:12px;max-width:700px;width:100%;max-height:90vh;overflow-y:auto;box-shadow:0 25px 80px rgba(0,0,0,0.3)">
        <div style="padding:24px;border-bottom:1px solid #e5e5e5;display:flex;justify-content:space-between;align-items:flex-start;sticky;top:0;background:#fff;z-index:100">
          <div style="flex:1">
            <div style="display:flex;gap:8px;margin-bottom:12px">
              <span style="display:inline-block;padding:4px 8px;border-radius:4px;font-size:10px;font-weight:600;background:${validation.severity === 'Critical' ? '#fee2e2;color:#991b1b' : '#fef3c7;color:#92400e'}">${validation.severity}</span>
              <span style="display:inline-block;padding:4px 8px;border-radius:4px;font-size:10px;font-weight:600;background:${validation.status === 'pass' ? '#dcfce7;color:#166534' : '#fee2e2;color:#991b1b'}">${validation.status.toUpperCase()}</span>
            </div>
            <h2 style="margin:0;font-size:18px;font-weight:700;color:#111827">${validation.name}</h2>
          </div>
          <button onclick="document.getElementById('validation-modal-backdrop').remove()" style="background:none;border:none;font-size:24px;cursor:pointer;color:#6b7280;padding:0;width:32px;height:32px">×</button>
        </div>

        <div style="padding:24px">
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:20px;margin-bottom:20px;padding:16px;background:#f9fafb;border-radius:8px">
            <div>
              <div style="font-size:10px;color:#6b7280;text-transform:uppercase;font-weight:700;margin-bottom:6px">Pillar</div>
              <div style="font-size:13px;color:#374151">${validation.pillar}</div>
            </div>
            <div>
              <div style="font-size:10px;color:#6b7280;text-transform:uppercase;font-weight:700;margin-bottom:6px">Impact Score</div>
              <div style="font-size:14px;font-weight:700;color:${validation.impactScore > 70 ? '#dc2626' : '#f59e0b'}">${validation.impactScore}/100</div>
            </div>
            <div>
              <div style="font-size:10px;color:#6b7280;text-transform:uppercase;font-weight:700;margin-bottom:6px">Priority</div>
              <div style="font-size:13px;color:#374151">P${validation.priority}</div>
            </div>
            <div>
              <div style="font-size:10px;color:#6b7280;text-transform:uppercase;font-weight:700;margin-bottom:6px">Auto-Remediation</div>
              <div style="font-size:13px;color:#374151">${validation.autoRemediationAvailable ? '✅ Available' : '❌ Manual Only'}</div>
            </div>
          </div>

          <div style="margin-bottom:20px">
            <div style="font-size:11px;color:#6b7280;text-transform:uppercase;font-weight:700;margin-bottom:10px">Description</div>
            <div style="font-size:13px;line-height:1.6;color:#374151;background:#f9fafb;padding:14px;border-radius:6px">
              ${validation.description}
            </div>
          </div>

          <div style="margin-bottom:20px">
            <div style="font-size:11px;color:#6b7280;text-transform:uppercase;font-weight:700;margin-bottom:6px">Current Value</div>
            <div style="font-size:13px;color:#374151;font-family:monospace;padding:10px;background:#f3f4f6;border-radius:4px;border:1px solid #e5e7eb">
              ${validation.currentValue || 'Unknown'}
            </div>
          </div>

          <div style="margin-bottom:20px">
            <div style="font-size:11px;color:#6b7280;text-transform:uppercase;font-weight:700;margin-bottom:6px">Expected Value</div>
            <div style="font-size:13px;color:#374151;font-family:monospace;padding:10px;background:#f3f4f6;border-radius:4px;border:1px solid #e5e7eb">
              ${validation.expectedValue}
            </div>
          </div>

          <div style="background:#f9fafb;padding:14px;border-radius:6px;border-left:4px solid ${validation.severity === 'Critical' ? '#dc2626' : '#f59e0b'};margin-bottom:20px">
            <div style="font-size:11px;color:#6b7280;text-transform:uppercase;font-weight:700;margin-bottom:8px">Remediation</div>
            <div style="font-size:13px;line-height:1.6;color:#374151">
              ${validation.remediation || 'No remediation available.'}
            </div>
          </div>

          <div style="display:flex;gap:10px">
            <button onclick="document.getElementById('validation-modal-backdrop').remove()" style="padding:10px 16px;background:#3b82f6;color:#fff;border:none;border-radius:6px;font-weight:600;cursor:pointer;font-size:13px">Close</button>
            ${validation.autoRemediationAvailable ? `
              <button onclick="alert('Auto-remediation would be triggered here')" style="padding:10px 16px;background:#10b981;color:#fff;border:none;border-radius:6px;font-weight:600;cursor:pointer;font-size:13px">⚡ Auto-Remediate</button>
            ` : ''}
          </div>
        </div>
      </div>
    </div>
  `

  document.body.insertAdjacentHTML('beforeend', html)
  document.getElementById('validation-modal-backdrop').addEventListener('click', e => {
    if (e.target.id === 'validation-modal-backdrop') e.target.remove()
  })
}
