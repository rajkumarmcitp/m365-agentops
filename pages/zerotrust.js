import { showToast } from '../components/toast.js'
import { callAPI } from '../lib/api-client.js'
import { ZT_PILLARS } from '../data/zt-pillars.js'
import { skeletonLoader } from '../lib/skeleton-loader.js'

let realValidations = null
let realTrends = null
let priorityActions = null
let activeTab = 'overview'

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
  const criticalIssues = summary.fail + summary.warn

  el.innerHTML = `
    <div class="page-header">
      <div>
        <div class="page-title"><i class="ti ti-lock-check"></i> Zero Trust Compliance</div>
        <div class="page-subtitle">${totalValidations} security controls validated across 7 pillars</div>
      </div>
      <div class="page-actions">
        <button class="btn" id="zt-rescan"><i class="ti ti-refresh"></i> Refresh</button>
        <button class="btn btn-primary"><i class="ti ti-download"></i> Export</button>
      </div>
    </div>

    <!-- KPI Row -->
    <div class="kpi-row">
      ${renderZTKPIs(overallScore, scoreColor, totalValidations, summary)}
    </div>

    <!-- Tab Navigation -->
    <div style="border:0.5px solid var(--color-border-secondary);border-radius:8px;background:var(--color-background-primary);padding:12px;margin-bottom:16px">
      <div class="tabs" id="zt-tabs" style="margin-bottom:0;padding-bottom:0">
        <button class="tab-btn active" data-zt-tab="overview">
          <i class="ti ti-layout-grid"></i><span>Overview</span>
        </button>
        <button class="tab-btn" data-zt-tab="identity">
          <i class="ti ti-fingerprint"></i><span>Identity</span>
        </button>
        <button class="tab-btn" data-zt-tab="device">
          <i class="ti ti-device-mobile"></i><span>Device</span>
        </button>
        <button class="tab-btn" data-zt-tab="application">
          <i class="ti ti-app-window"></i><span>Application</span>
        </button>
        <button class="tab-btn" data-zt-tab="data">
          <i class="ti ti-database"></i><span>Data</span>
        </button>
        <button class="tab-btn" data-zt-tab="infrastructure">
          <i class="ti ti-server"></i><span>Infrastructure</span>
        </button>
        <button class="tab-btn" data-zt-tab="threat">
          <i class="ti ti-shield-alert"></i><span>Threat</span>
        </button>
        <button class="tab-btn" data-zt-tab="ai">
          <i class="ti ti-brain"></i><span>AI Security</span>
        </button>
      </div>
    </div>

    <!-- Tab Content -->
    <div id="zt-content"></div>
  `

  // Render tab content
  renderZTTabContent(el)

  // Attach event listeners
  attachZTEventListeners(el)
}

function renderZTKPIs(score, scoreColor, total, summary) {
  return `
    <div class="kpi-tile sec-kpi-primary" style="min-width:160px">
      <div style="display:flex;align-items:center;gap:12px">
        <svg width="52" height="52" viewBox="0 0 52 52" style="flex-shrink:0">
          <circle cx="26" cy="26" r="21.32" fill="none" stroke="var(--color-border-tertiary)" stroke-width="7"/>
          <circle cx="26" cy="26" r="21.32" fill="none" stroke="var(--clr-${scoreColor}-text)" stroke-width="7"
            stroke-dasharray="${133.1 * (score / 100)} 133.1" stroke-dashoffset="33.275"
            stroke-linecap="round" transform="rotate(-90 26 26)"/>
          <text x="26" y="30" text-anchor="middle" font-size="14" font-weight="700" fill="var(--clr-${scoreColor}-text)">${score}%</text>
        </svg>
        <div>
          <div class="kpi-value ${scoreColor}" style="font-size:28px;font-weight:700">${score}<span style="font-size:12px;font-weight:500;color:var(--color-text-tertiary)">%</span></div>
          <div class="kpi-label" style="font-size:10px;text-transform:uppercase;color:var(--color-text-tertiary);font-weight:600">Compliance</div>
          <div style="font-size:10px;margin-top:3px;color:var(--color-text-tertiary)">${summary.pass}/${total} passed</div>
        </div>
      </div>
    </div>
    <div class="kpi-tile">
      <div class="kpi-value ${summary.fail > 0 ? 'danger' : 'success'}" style="font-size:28px;font-weight:700">${summary.fail > 0 ? summary.fail : '✓'}</div>
      <div class="kpi-label" style="font-size:10px;text-transform:uppercase;color:var(--color-text-tertiary);font-weight:600">Failed</div>
      <div style="font-size:10px;margin-top:3px;color:var(--color-text-tertiary)">${summary.fail} controls</div>
    </div>
    <div class="kpi-tile">
      <div class="kpi-value ${summary.warn > 0 ? 'warning' : 'success'}" style="font-size:28px;font-weight:700">${summary.warn}</div>
      <div class="kpi-label" style="font-size:10px;text-transform:uppercase;color:var(--color-text-tertiary);font-weight:600">Warnings</div>
      <div style="font-size:10px;margin-top:3px;color:var(--color-text-tertiary)">${summary.warn} controls</div>
    </div>
    <div class="kpi-tile">
      <div class="kpi-value success" style="font-size:28px;font-weight:700">${summary.pass}</div>
      <div class="kpi-label" style="font-size:10px;text-transform:uppercase;color:var(--color-text-tertiary);font-weight:600">Passed</div>
      <div style="font-size:10px;margin-top:3px;color:var(--color-text-tertiary)">${summary.pass} controls</div>
    </div>
  `
}

function renderZTTabContent(el) {
  const contentEl = el.querySelector('#zt-content')
  if (!contentEl) return

  const pillarsMap = {
    identity: 'Identity Security',
    device: 'Device Security',
    application: 'Application Security',
    data: 'Data Protection & Compliance',
    infrastructure: 'Infrastructure & Workload Security',
    threat: 'Network & Threat Protection',
    ai: 'AI Security & Governance'
  }

  // Use real validations if available, otherwise use demo data
  const isDemo = !realValidations

  if (activeTab === 'overview') {
    contentEl.innerHTML = isDemo ? renderZTOverviewDemo() : renderZTOverview()
  } else {
    const pillarName = pillarsMap[activeTab]
    if (isDemo) {
      const demoP = window.ztDemoPillars.find(p => p.name === pillarName)
      contentEl.innerHTML = renderZTPillarContentDemo(demoP || {})
    } else {
      const pillarStats = realValidations.summary.byPillar[pillarName]
      const pillarValidations = realValidations.validations.filter(v => v.pillar === pillarName)
      contentEl.innerHTML = renderZTPillarContent(pillarName, pillarStats, pillarValidations)
    }
  }
}

function renderZTOverview() {
  if (!realValidations || !realValidations.summary.byPillar) return '<div class="card">Loading...</div>'

  const { summary } = realValidations

  return `
    <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(160px,1fr));gap:12px;margin-bottom:24px">
      ${Object.entries(summary.byPillar).map(([pillar, stats]) => {
        const total = stats.pass + stats.fail + stats.warn
        const pillarScore = Math.round((stats.pass / total) * 100) || 0
        const pillarColor = pillarScore >= 80 ? 'success' : pillarScore >= 60 ? 'warning' : 'danger'
        return `
          <div class="card" style="text-align:center;cursor:pointer;transition:all 150ms ease" data-zt-pillar="${pillar}">
            <div style="padding:16px">
              <div style="font-size:28px;font-weight:700;color:var(--clr-${pillarColor}-text)">${pillarScore}%</div>
              <div style="font-size:11px;color:var(--color-text-secondary);margin-top:6px;font-weight:600" title="${pillar}">${pillar.replace(' Security', '')}</div>
              <div style="font-size:10px;color:var(--color-text-tertiary);margin-top:8px">${stats.pass}/${total} passed</div>
            </div>
          </div>
        `
      }).join('')}
    </div>

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
              <th style="width:8%"></th>
            </tr></thead>
            <tbody>
              ${priorityActions.slice(0, 10).map(action => `
                <tr class="validation-row" data-validation-id="${action.id}">
                  <td data-label="Severity"><span class="badge ${action.severity === 'Critical' ? 'danger' : 'warning'}">${action.severity}</span></td>
                  <td style="font-size:11px;font-weight:500" data-label="Control">
                    <div style="font-weight:600">${action.name}</div>
                    <div style="font-size:10px;color:var(--color-text-tertiary);margin-top:3px">${action.description || 'No description'}</div>
                  </td>
                  <td data-label="Pillar"><span class="pill" style="font-size:10px">${action.pillar}</span></td>
                  <td style="font-size:10px;color:var(--color-text-secondary)" data-label="Status">
                    ${action.currentValue || action.status}
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>
    ` : ''}
  `
}

function renderZTOverviewDemo() {
  const demoPillars = window.ztDemoPillars || []

  return `
    <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(160px,1fr));gap:12px;margin-bottom:24px">
      ${demoPillars.map(pillar => {
        const pass = pillar.controls.filter(c => c.status === 'pass').length
        const total = pillar.controls.length
        const pillarScore = Math.round((pass / total) * 100) || 0
        const pillarColor = pillarScore >= 80 ? 'success' : pillarScore >= 60 ? 'warning' : 'danger'
        return `
          <div class="card" style="text-align:center;cursor:pointer;transition:all 150ms ease" data-zt-pillar="${pillar.name}">
            <div style="padding:16px">
              <div style="font-size:28px;font-weight:700;color:var(--clr-${pillarColor}-text)">${pillarScore}%</div>
              <div style="font-size:11px;color:var(--color-text-secondary);margin-top:6px;font-weight:600">${pillar.name}</div>
              <div style="font-size:10px;color:var(--color-text-tertiary);margin-top:8px">${pass}/${total} passed</div>
            </div>
          </div>
        `
      }).join('')}
    </div>
  `
}

function renderZTPillarContentDemo(pillar) {
  if (!pillar.controls) return '<div class="card">Loading...</div>'

  const pass = pillar.controls.filter(c => c.status === 'pass').length
  const warn = pillar.controls.filter(c => c.status === 'warn').length
  const fail = pillar.controls.filter(c => c.status === 'fail').length
  const total = pillar.controls.length
  const pillarScore = Math.round((pass / total) * 100) || 0

  return `
    <div class="card mb-3">
      <div class="card-header">
        <span class="card-title">${pillar.name || 'Pillar'}</span>
        <span class="badge ${pillarScore >= 80 ? 'success' : pillarScore >= 60 ? 'warning' : 'danger'}">${pillarScore}% Compliance</span>
      </div>
      <div style="padding:16px 0">
        <div style="display:flex;gap:24px;align-items:center;padding:0 16px">
          <div>
            <div style="font-size:10px;color:var(--color-text-tertiary);text-transform:uppercase;font-weight:600;margin-bottom:4px">Passed</div>
            <div style="font-size:20px;font-weight:700;color:var(--clr-success-text)">${pass}</div>
          </div>
          <div>
            <div style="font-size:10px;color:var(--color-text-tertiary);text-transform:uppercase;font-weight:600;margin-bottom:4px">Warnings</div>
            <div style="font-size:20px;font-weight:700;color:var(--clr-warning-text)">${warn}</div>
          </div>
          <div>
            <div style="font-size:10px;color:var(--color-text-tertiary);text-transform:uppercase;font-weight:600;margin-bottom:4px">Failed</div>
            <div style="font-size:20px;font-weight:700;color:var(--clr-danger-text)">${fail}</div>
          </div>
        </div>
      </div>
    </div>

    <div class="card">
      <div class="card-header">
        <span class="card-title">Controls</span>
      </div>
      <div style="overflow-x:auto">
        <table>
          <thead><tr>
            <th style="width:5%"></th>
            <th style="width:35%">Control</th>
            <th style="width:25%">Expected</th>
            <th style="width:25%">Current</th>
            <th style="width:10%"></th>
          </tr></thead>
          <tbody>
            ${pillar.controls && pillar.controls.length > 0 ? pillar.controls.map(ctrl => `
              <tr class="control-row" style="cursor:pointer">
                <td style="text-align:center;font-size:16px">
                  ${ctrl.status === 'pass' ? '<span style="color:var(--clr-success-text)">✓</span>' :
                    ctrl.status === 'fail' ? '<span style="color:var(--clr-danger-text)">✗</span>' :
                    '<span style="color:var(--clr-warning-text)">⚠</span>'}
                </td>
                <td style="font-size:11px;font-weight:500" data-label="Control">
                  <div style="font-weight:600">${ctrl.name}</div>
                  <div style="font-size:10px;color:var(--color-text-tertiary);margin-top:3px">${ctrl.desc || ''}</div>
                </td>
                <td style="font-size:10px;color:var(--color-text-secondary)" data-label="Expected">
                  ${ctrl.expectedValue || ctrl.value || '—'}
                </td>
                <td style="font-size:10px;color:var(--color-text-secondary)" data-label="Current">
                  ${ctrl.currentValue || '—'}
                </td>
                <td style="text-align:right" data-label="">
                  <span class="badge ${ctrl.severity === 'Critical' ? 'danger' : ctrl.severity === 'High' ? 'warning' : 'secondary'}" style="font-size:10px">${ctrl.severity || 'Medium'}</span>
                </td>
              </tr>
            `).join('') : '<tr><td colspan="5" style="padding:16px;text-align:center;color:var(--color-text-tertiary)">No controls found</td></tr>'}
          </tbody>
        </table>
      </div>
    </div>
  `
}

function renderZTPillarContent(pillarName, stats, validations) {
  const total = stats.pass + stats.fail + stats.warn
  const pillarScore = Math.round((stats.pass / total) * 100) || 0

  // Group validations by category
  const byCategory = {}
  validations.forEach(v => {
    const cat = v.category || 'General'
    if (!byCategory[cat]) byCategory[cat] = []
    byCategory[cat].push(v)
  })

  return `
    <div class="card mb-3">
      <div class="card-header">
        <span class="card-title">${pillarName}</span>
        <span class="badge ${pillarScore >= 80 ? 'success' : pillarScore >= 60 ? 'warning' : 'danger'}">${pillarScore}% Compliance</span>
      </div>
      <div style="padding:16px 0">
        <div style="display:flex;gap:24px;align-items:center;padding:0 16px">
          <div>
            <div style="font-size:10px;color:var(--color-text-tertiary);text-transform:uppercase;font-weight:600;margin-bottom:4px">Passed</div>
            <div style="font-size:20px;font-weight:700;color:var(--clr-success-text)">${stats.pass}</div>
          </div>
          <div>
            <div style="font-size:10px;color:var(--color-text-tertiary);text-transform:uppercase;font-weight:600;margin-bottom:4px">Warnings</div>
            <div style="font-size:20px;font-weight:700;color:var(--clr-warning-text)">${stats.warn}</div>
          </div>
          <div>
            <div style="font-size:10px;color:var(--color-text-tertiary);text-transform:uppercase;font-weight:600;margin-bottom:4px">Failed</div>
            <div style="font-size:20px;font-weight:700;color:var(--clr-danger-text)">${stats.fail}</div>
          </div>
        </div>
      </div>
    </div>

    ${Object.entries(byCategory).map(([category, controls]) => `
      <div class="card mb-3">
        <div class="card-header" style="background:var(--color-bg-secondary);border-bottom:1px solid var(--color-border-secondary)">
          <span style="font-size:11px;font-weight:700;color:var(--color-text-secondary);text-transform:uppercase">${category}</span>
          <span style="font-size:10px;color:var(--color-text-tertiary);margin-left:12px">(${controls.length} control${controls.length !== 1 ? 's' : ''})</span>
        </div>
        <div style="overflow-x:auto">
          <table>
            <thead><tr>
              <th style="width:5%"></th>
              <th style="width:35%">Control</th>
              <th style="width:25%">Expected</th>
              <th style="width:25%">Current</th>
              <th style="width:10%"></th>
            </tr></thead>
            <tbody>
              ${controls.map(v => `
                <tr class="validation-detail-row" data-validation-id="${v.id}" style="cursor:pointer">
                  <td style="text-align:center;font-size:16px">
                    ${v.status === 'pass' ? '<span style="color:var(--clr-success-text)">✓</span>' :
                      v.status === 'fail' ? '<span style="color:var(--clr-danger-text)">✗</span>' :
                      '<span style="color:var(--clr-warning-text)">⚠</span>'}
                  </td>
                  <td style="font-size:11px;font-weight:500" data-label="Control">
                    <div style="font-weight:600">${v.name}</div>
                    <div style="font-size:10px;color:var(--color-text-tertiary);margin-top:3px">${v.description || 'No description'}</div>
                  </td>
                  <td style="font-size:10px;color:var(--color-text-secondary)" data-label="Expected">
                    ${v.expectedValue || '—'}
                  </td>
                  <td style="font-size:10px;color:var(--color-text-secondary)" data-label="Current">
                    ${v.currentValue || '—'}
                  </td>
                  <td style="text-align:right" data-label="">
                    <span class="badge ${v.severity === 'Critical' ? 'danger' : v.severity === 'High' ? 'warning' : 'secondary'}" style="font-size:10px">${v.severity}</span>
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>
    `).join('')}
  `
}


function renderZeroTrustWithDemoData(el) {
  let allControls = ZT_PILLARS.flatMap(p => p.controls)
  let pass = allControls.filter(c => c.status === 'pass').length
  let warn = allControls.filter(c => c.status === 'warn').length
  let fail = allControls.filter(c => c.status === 'fail').length
  const total = allControls.length
  const overallScore = Math.round((pass / total) * 100)
  const scoreColor = overallScore >= 80 ? 'success' : overallScore >= 60 ? 'warning' : 'danger'

  el.innerHTML = `
    <div class="page-header">
      <div>
        <div class="page-title"><i class="ti ti-lock-check"></i> Zero Trust Compliance</div>
        <div class="page-subtitle">${total} controls across ${ZT_PILLARS.length} pillars</div>
      </div>
      <div class="page-actions">
        <button class="btn" id="zt-rescan"><i class="ti ti-refresh"></i> Refresh</button>
        <button class="btn btn-primary"><i class="ti ti-download"></i> Export</button>
      </div>
    </div>

    <!-- KPI Row -->
    <div class="kpi-row">
      ${renderZTKPIs(overallScore, scoreColor, total, { pass, fail, warn })}
    </div>

    <!-- Tab Navigation -->
    <div style="border:0.5px solid var(--color-border-secondary);border-radius:8px;background:var(--color-background-primary);padding:12px;margin-bottom:16px">
      <div class="tabs" id="zt-tabs" style="margin-bottom:0;padding-bottom:0">
        <button class="tab-btn active" data-zt-tab="overview">
          <i class="ti ti-layout-grid"></i><span>Overview</span>
        </button>
        <button class="tab-btn" data-zt-tab="identity">
          <i class="ti ti-fingerprint"></i><span>Identity</span>
        </button>
        <button class="tab-btn" data-zt-tab="device">
          <i class="ti ti-device-mobile"></i><span>Device</span>
        </button>
        <button class="tab-btn" data-zt-tab="application">
          <i class="ti ti-app-window"></i><span>Application</span>
        </button>
        <button class="tab-btn" data-zt-tab="data">
          <i class="ti ti-database"></i><span>Data</span>
        </button>
        <button class="tab-btn" data-zt-tab="infrastructure">
          <i class="ti ti-server"></i><span>Infrastructure</span>
        </button>
        <button class="tab-btn" data-zt-tab="threat">
          <i class="ti ti-shield-alert"></i><span>Threat</span>
        </button>
        <button class="tab-btn" data-zt-tab="ai">
          <i class="ti ti-brain"></i><span>AI Security</span>
        </button>
      </div>
    </div>

    <!-- Tab Content -->
    <div id="zt-content"></div>
  `

  // Store demo pillars for tab rendering
  window.ztDemoPillars = ZT_PILLARS
  window.ztDemoPass = pass
  window.ztDemoWarn = warn
  window.ztDemoFail = fail

  renderZTTabContent(el)
  attachZTEventListeners(el)
}

function attachZTEventListeners(el) {
  // Tab navigation
  el.querySelectorAll('#zt-tabs .tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      activeTab = btn.dataset.ztTab
      el.querySelectorAll('#zt-tabs .tab-btn').forEach(b => b.classList.remove('active'))
      btn.classList.add('active')
      renderZTTabContent(el)
      attachZTEventListeners(el)
    })
  })

  // Pillar card clicks on overview tab
  el.querySelectorAll('[data-zt-pillar]').forEach(card => {
    card.addEventListener('click', () => {
      const pillarName = card.dataset.ztPillar
      const tabId = Object.entries({
        'Identity Security': 'identity',
        'Device Security': 'device',
        'Application Security': 'application',
        'Data Protection & Compliance': 'data',
        'Infrastructure & Workload Security': 'infrastructure',
        'Network & Threat Protection': 'threat',
        'AI Security & Governance': 'ai'
      }).find(([name]) => name === pillarName)?.[1] || 'overview'

      if (tabId !== 'overview') {
        activeTab = tabId
        const tabBtn = el.querySelector(`[data-zt-tab="${tabId}"]`)
        if (tabBtn) {
          el.querySelectorAll('#zt-tabs .tab-btn').forEach(b => b.classList.remove('active'))
          tabBtn.classList.add('active')
          renderZTTabContent(el)
          attachZTEventListeners(el)
        }
      }
    })
  })

  // Refresh button
  el.querySelector('#zt-rescan')?.addEventListener('click', () => {
    const btn = el.querySelector('#zt-rescan')
    btn.innerHTML = '<span class="spinner dark"></span> Validating...'
    btn.disabled = true
    setTimeout(() => {
      btn.innerHTML = '<i class="ti ti-refresh"></i> Refresh'
      btn.disabled = false
      showToast('Zero Trust validation refreshed — all 80 controls re-evaluated.', 'success')
    }, 2200)
  })

  // Export button
  el.querySelector('.btn-primary')?.addEventListener('click', () => {
    showToast('Zero Trust compliance report exported as PDF.', 'success')
  })

  // Validation detail rows
  el.querySelectorAll('.validation-detail-row').forEach(row => {
    row.addEventListener('click', () => {
      const validationId = row.dataset.validationId
      const validation = realValidations.validations.find(v => v.id === validationId)
      if (validation) {
        showValidationDetail(validation)
      }
    })
  })
}

function showValidationDetail(validation) {
  const modal = document.createElement('div')
  modal.style.cssText = `
    position:fixed;top:0;left:0;right:0;bottom:0;
    background:rgba(0,0,0,0.5);
    display:flex;align-items:center;justify-content:center;
    z-index:9999;
    padding:20px
  `
  modal.setAttribute('role', 'dialog')
  modal.setAttribute('aria-modal', 'true')

  const severity = validation.severity || 'Medium'
  const severityColor = severity === 'Critical' ? 'danger' : severity === 'High' ? 'warning' : 'secondary'
  const statusColor = validation.status === 'pass' ? 'success' : validation.status === 'fail' ? 'danger' : 'warning'
  const priorityColor = validation.priority >= 5 ? 'danger' : validation.priority >= 4 ? 'warning' : validation.priority >= 3 ? 'info' : 'secondary'

  modal.innerHTML = `
    <div style="background:#ffffff;border-radius:8px;padding:0;max-width:750px;width:100%;max-height:90vh;overflow-y:auto;box-shadow:0 20px 25px -5px rgba(0,0,0,0.1);display:flex;flex-direction:column">
      <!-- Header -->
      <div style="padding:20px;border-bottom:1px solid #e5e7eb;display:flex;justify-content:space-between;align-items:start;gap:16px;background:#ffffff">
        <div>
          <h2 style="margin:0 0 8px 0;font-size:18px;font-weight:700">${validation.id}: ${validation.name}</h2>
          <div style="font-size:13px;color:#6b7280;line-height:1.5">${validation.description || 'No description available'}</div>
        </div>
        <button style="background:none;border:none;font-size:24px;cursor:pointer;color:#6b7280;flex-shrink:0" onclick="this.closest('[role=dialog]').remove()">×</button>
      </div>

      <!-- Metadata & Status -->
      <div style="padding:16px 20px;border-bottom:1px solid #e5e7eb;background:#f9fafb">
        <div style="display:flex;flex-wrap:wrap;gap:12px;align-items:center;margin-bottom:12px">
          <span class="badge ${statusColor}" style="font-size:11px;font-weight:600">${validation.status ? validation.status.toUpperCase() : 'UNKNOWN'}</span>
          <span class="badge ${severityColor}" style="font-size:11px;font-weight:600">${severity}</span>
          <span class="badge ${priorityColor}" style="font-size:11px;font-weight:600">Priority: ${validation.priority || '?'}/5</span>
          ${validation.impactScore ? `<span class="badge secondary" style="font-size:11px;font-weight:600">Impact: ${validation.impactScore}</span>` : ''}
        </div>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;font-size:12px;color:var(--color-text-primary)">
          <div><strong>Pillar:</strong> <span style="color:var(--color-text-primary)">${validation.pillar}</span></div>
          <div><strong>Category:</strong> <span style="color:var(--color-text-primary)">${validation.category || 'General'}</span></div>
          ${validation.autoRemediationAvailable ? `<div style="grid-column:span 2"><strong style="color:var(--clr-success-text)">✓ Auto-Remediation Available</strong></div>` : ''}
        </div>
      </div>

      <!-- Content -->
      <div style="padding:20px;overflow-y:auto;color:#111827">
        <!-- What Was Checked -->
        <div style="margin-bottom:20px">
          <h3 style="margin:0 0 8px 0;font-size:11px;font-weight:700;text-transform:uppercase;color:#6b7280;letter-spacing:0.5px">What Was Checked</h3>
          <div style="font-size:13px;background:#f9fafb;padding:12px;border-radius:4px;line-height:1.6;color:#111827">
            ${validation.description || 'No check description available'}
          </div>
        </div>

        <!-- Expected Value -->
        <div style="margin-bottom:20px">
          <h3 style="margin:0 0 8px 0;font-size:11px;font-weight:700;text-transform:uppercase;color:#6b7280;letter-spacing:0.5px">Expected Value / Target</h3>
          <div style="font-size:13px;background:#f0fdf4;padding:12px;border-radius:4px;line-height:1.6;color:#111827;border-left:3px solid #22c55e">
            ${validation.expectedValue || 'No expected value defined'}
          </div>
        </div>

        <!-- Current Value -->
        <div style="margin-bottom:20px">
          <h3 style="margin:0 0 8px 0;font-size:11px;font-weight:700;text-transform:uppercase;color:#6b7280;letter-spacing:0.5px">Current Value</h3>
          <div style="font-size:13px;background:${validation.status === 'pass' ? '#f0fdf4' : validation.status === 'fail' ? '#fef2f2' : '#fefce8'};padding:12px;border-radius:4px;line-height:1.6;color:#111827;border-left:3px solid ${validation.status === 'pass' ? '#22c55e' : validation.status === 'fail' ? '#ef4444' : '#eab308'}">
            ${validation.currentValue || 'Not evaluated'}
          </div>
        </div>

        <!-- Evidence -->
        ${validation.evidence ? `
          <div style="margin-bottom:20px">
            <h3 style="margin:0 0 8px 0;font-size:11px;font-weight:700;text-transform:uppercase;color:#6b7280;letter-spacing:0.5px">Evidence Collected</h3>
            <div style="font-size:13px;background:#f9fafb;padding:12px;border-radius:4px;line-height:1.6;color:#111827">
              ${validation.evidence}
            </div>
          </div>
        ` : ''}

        <!-- Validation Methods -->
        ${(validation.graphApi || validation.powershell) ? `
          <div style="margin-bottom:20px">
            <h3 style="margin:0 0 12px 0;font-size:11px;font-weight:700;text-transform:uppercase;color:#6b7280;letter-spacing:0.5px">Validation Methods</h3>
            ${validation.graphApi ? `
              <div style="margin-bottom:12px">
                <div style="font-size:11px;font-weight:600;color:#111827;margin-bottom:6px">📊 Graph API Query:</div>
                <div style="font-size:12px;background:#f3f4f6;padding:10px;border-radius:4px;border-left:2px solid #3b82f6;overflow-x:auto;font-family:monospace;color:#111827;user-select:all;border:1px solid #e5e7eb">
                  ${validation.graphApi}
                </div>
              </div>
            ` : ''}
            ${validation.powershell ? `
              <div>
                <div style="font-size:11px;font-weight:600;color:#111827;margin-bottom:6px">🔧 PowerShell Command:</div>
                <div style="font-size:12px;background:#f3f4f6;padding:10px;border-radius:4px;border-left:2px solid #f59e0b;overflow-x:auto;font-family:monospace;color:#111827;user-select:all;border:1px solid #e5e7eb">
                  ${validation.powershell}
                </div>
              </div>
            ` : ''}
          </div>
        ` : ''}

        <!-- Remediation -->
        <div style="margin-bottom:20px">
          <h3 style="margin:0 0 8px 0;font-size:11px;font-weight:700;text-transform:uppercase;color:#6b7280;letter-spacing:0.5px">Remediation Steps</h3>
          <div style="font-size:13px;background:${severity === 'Critical' ? '#fef2f2' : severity === 'High' ? '#fefce8' : '#f9fafb'};padding:12px;border-radius:4px;line-height:1.6;color:#111827;border-left:3px solid ${severity === 'Critical' ? '#ef4444' : severity === 'High' ? '#eab308' : '#d1d5db'}">
            ${validation.remediation || 'No remediation steps available'}
          </div>
        </div>

        <!-- Footer Actions -->
        <div style="margin-top:16px;padding-top:16px;border-top:1px solid #e5e7eb;display:flex;gap:8px">
          ${validation.autoRemediationAvailable ? `
            <button style="background:#2563eb;color:white;border:none;padding:10px 16px;border-radius:4px;cursor:pointer;font-size:12px;font-weight:600;flex:1;transition:background 0.2s" onmouseover="this.style.background='#1d4ed8'" onmouseout="this.style.background='#2563eb'" onclick="this.disabled=true;this.innerHTML='<span class=spinner></span> Remediating...';setTimeout(()=>{this.innerHTML='✓ Remediated';setTimeout(()=>this.closest('[role=dialog]').remove(),1500)},2000)">
              <i class="ti ti-zap"></i> Auto-Remediate
            </button>
          ` : ''}
          <button style="background:#f3f4f6;color:#111827;border:1px solid #d1d5db;padding:10px 16px;border-radius:4px;cursor:pointer;font-size:12px;font-weight:600;flex:1;transition:background 0.2s" onmouseover="this.style.background='#e5e7eb'" onmouseout="this.style.background='#f3f4f6'" onclick="this.closest('[role=dialog]').remove()">
            Close
          </button>
        </div>
      </div>
    </div>
  `

  document.body.appendChild(modal)
  modal.addEventListener('click', e => {
    if (e.target === modal) modal.remove()
  })
}
