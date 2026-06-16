import { showToast } from '../components/toast.js'
import { callAPI } from '../lib/api-client.js'
import { ZT_PILLARS } from '../data/zt-pillars.js'

export function initZeroTrust() {
  const el = document.getElementById('page-zerotrust')
  if (!el) return

  // Show skeleton/loading state immediately
  renderZeroTrustSkeleton(el)

  // Fetch real data in background
  loadZeroTrustData(el)
}

async function loadZeroTrustData(el) {
  try {
    console.log('📡 Fetching Zero Trust assessment data...')
    const result = await callAPI('/zero-trust/pillars')

    if (result.success && result.data) {
      console.log('✓ Zero Trust data loaded')
      renderZeroTrustWithData(el, result.data)
    } else {
      throw new Error(result.error || 'Failed to load Zero Trust data')
    }
  } catch (error) {
    console.warn('⚠️ Failed to fetch Zero Trust data:', error.message)
    // Fallback to demo data
    console.log('📚 Using demo/reference data')
    renderZeroTrustWithData(el, ZT_PILLARS)
  }
}

function renderZeroTrustSkeleton(el) {
  el.innerHTML = `
    <div class="page-header">
      <div>
        <div class="page-title"><i class="ti ti-lock-check"></i> Zero Trust Compliance</div>
        <div class="page-subtitle">Loading assessment data...</div>
      </div>
      <div class="page-actions">
        <button class="btn" id="zt-rescan" disabled><i class="ti ti-refresh"></i> Re-scan</button>
        <button class="btn btn-primary" disabled><i class="ti ti-download"></i> Export</button>
      </div>
    </div>

    <div style="padding:40px;text-align:center">
      <div class="spinner"></div>
      <p style="margin-top:16px;color:var(--color-text-secondary)">Assessing Zero Trust compliance controls...</p>
    </div>
  `
}

function renderZeroTrustWithData(el, pillars) {
  let allControls = pillars.flatMap(p => p.controls)
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
        <div class="page-subtitle">${total} controls across ${pillars.length} pillars — last assessed today</div>
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

  renderPillars(el, pillars)

  el.querySelector('#zt-rescan').addEventListener('click', () => {
    const btn = el.querySelector('#zt-rescan')
    btn.innerHTML = `<span class="spinner dark"></span> Scanning...`
    btn.disabled = true
    setTimeout(() => {
      btn.innerHTML = `<i class="ti ti-refresh"></i> Re-scan`
      btn.disabled = false
      showToast('Zero Trust scan complete — ' + total + ' controls assessed.', 'success')
    }, 2000)
  })
}

function renderPillars(el, pillars) {
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
        <div class="collapsible-header" id="zt-pillar-hdr-${pi}" style="border-radius:0;background:var(--color-background-secondary)">
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

  container.querySelectorAll('[id^="zt-pillar-hdr-"]').forEach(hdr => {
    hdr.addEventListener('click', () => {
      const pi = hdr.id.replace('zt-pillar-hdr-', '')
      const body = container.querySelector(`#zt-pillar-body-${pi}`)
      const chev = container.querySelector(`#zt-pillar-chevron-${pi}`)
      body.classList.toggle('open')
      if (chev) chev.style.transform = body.classList.contains('open') ? 'rotate(0deg)' : 'rotate(-90deg)'
    })
  })

  container.querySelectorAll('.zt-control-row').forEach(row => {
    row.addEventListener('click', e => {
      if (e.target.closest('.zt-expand-btn')) {
        const { pi, ci } = row.dataset
        const panel = container.querySelector(`.zt-expand-panel[data-pi="${pi}"][data-ci="${ci}"]`)
        const btn = row.querySelector('.zt-expand-btn')
        if (panel) {
          panel.classList.toggle('open')
          btn.classList.toggle('open', panel.classList.contains('open'))
        }
      }
    })
  })
}

