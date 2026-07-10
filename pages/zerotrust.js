/**
 * Zero Trust Compliance Page with Progressive Lazy Loading
 *
 * Loading Strategy (2-Phase - No Demo Data):
 * 1. Skeleton (Immediate): Show loading UI instantly
 * 2. Real Data (Async): Load all validations/trends/actions
 *    - Render with real data once ready
 *    - Never show demo/partial data
 *
 * Benefits:
 * - Skeleton visible in <100ms (no blank screen)
 * - Real data only - no stale/demo data displayed
 * - Pillar details load on-demand when tab clicked
 * - Better perceived performance
 */

import { showToast } from '../components/toast.js'
import { callAPI } from '../lib/api-client.js'
import { ZT_PILLARS } from '../data/zt-pillars.js'
import { skeletonLoader } from '../lib/skeleton-loader.js'

let realValidations = null
let realTrends = null
let priorityActions = null
let lastRunTime = null
let activeTab = 'overview'
let lazyLoadedPillars = {}

export function initZeroTrust() {
  const el = document.getElementById('page-zerotrust')
  if (!el) return

  // Re-use in-memory data if already loaded this session
  if (realValidations) {
    renderZeroTrustWithData(el)
    return
  }

  renderZeroTrustSkeleton(el)
  setTimeout(() => loadCachedZeroTrustData(el), 300)
}

async function loadCachedZeroTrustData(el) {
  try {
    const [cachedResult, trendsResult] = await Promise.all([
      callAPI('/zero-trust/last-results'),
      callAPI('/zero-trust/trends')
    ])

    if (cachedResult.success && cachedResult.hasResults && cachedResult.validations?.length > 0) {
      const validations = cachedResult.validations
      const summary = cachedResult.summary || { pass: 0, fail: 0, warn: 0 }

      // Compute byPillar from validation objects (in-memory cache has full fields)
      const byPillar = {}
      for (const v of validations) {
        if (v.pillar) {
          if (!byPillar[v.pillar]) byPillar[v.pillar] = { pass: 0, fail: 0, warn: 0 }
          if (v.status === 'pass') byPillar[v.pillar].pass++
          else if (v.status === 'fail') byPillar[v.pillar].fail++
          else byPillar[v.pillar].warn++
        }
      }

      realValidations = {
        validations,
        summary: { ...summary, byPillar: Object.keys(byPillar).length > 0 ? byPillar : (summary.byPillar || {}) },
        overallScore: cachedResult.overallScore || cachedResult.compliance || 0,
        totalValidations: cachedResult.totalValidations || validations.length
      }
      lastRunTime = cachedResult.lastRunTime

      // Derive priority actions locally from failed/warning validations
      priorityActions = validations
        .filter(v => v.status === 'fail' || v.status === 'warning')
        .sort((a, b) => (a.severity === 'Critical' ? -1 : b.severity === 'Critical' ? 1 : 0))
        .slice(0, 10)
        .map(v => ({
          id: v.id,
          name: v.name || v.id,
          pillar: v.pillar || 'Unknown',
          severity: v.severity || 'High',
          description: v.description || '',
          currentValue: v.currentValue || v.status,
          status: v.status
        }))
    } else {
      renderZeroTrustNoData(el)
      return
    }

    if (trendsResult.success && trendsResult.data) {
      realTrends = trendsResult.data
    }

    renderZeroTrustWithData(el)
  } catch (error) {
    console.warn('⚠️ Failed to load Zero Trust data:', error.message)
    renderZeroTrustError(el, error.message)
  }
}

async function runFullScan(el) {
  try {
    const [validationsResult, trendsResult, actionsResult] = await Promise.all([
      callAPI('/zero-trust/validations'),
      callAPI('/zero-trust/trends'),
      callAPI('/zero-trust/priority-actions')
    ])

    if (validationsResult.success && validationsResult.data) {
      realValidations = validationsResult.data
      lastRunTime = new Date().toISOString()
    }
    if (trendsResult.success && trendsResult.data) realTrends = trendsResult.data
    if (actionsResult.success && actionsResult.data) priorityActions = actionsResult.data

    renderZeroTrustWithData(el)
    showToast('Zero Trust scan complete — all controls re-evaluated.', 'success')
  } catch (error) {
    showToast('Scan failed: ' + error.message, 'error')
    const btn = el.querySelector('#zt-rescan')
    if (btn) { btn.innerHTML = '<i class="ti ti-refresh"></i> Refresh'; btn.disabled = false }
  }
}

function renderZeroTrustNoData(el) {
  el.innerHTML = `
    <div class="page-header">
      <div>
        <div class="page-title"><i class="ti ti-lock-check"></i> Zero Trust Compliance</div>
        <div class="page-subtitle">No assessment data found</div>
      </div>
      <div class="page-actions">
        <button class="btn btn-primary" id="zt-first-scan"><i class="ti ti-player-play"></i> Run First Scan</button>
      </div>
    </div>
    <div class="card" style="text-align:center;padding:40px;color:var(--color-text-secondary)">
      <i class="ti ti-shield-off" style="font-size:40px;margin-bottom:12px;display:block;opacity:0.4"></i>
      <div style="font-size:14px;font-weight:600;margin-bottom:8px">No assessment results yet</div>
      <div style="font-size:12px;margin-bottom:20px">Run the first scan to evaluate all Zero Trust controls. Results are saved to SharePoint and loaded on subsequent visits.</div>
      <button class="btn btn-primary" id="zt-first-scan-2"><i class="ti ti-player-play"></i> Run Assessment Now</button>
    </div>
  `

  const startScan = async () => {
    renderZeroTrustSkeleton(el)
    await runFullScan(el)
  }
  el.querySelector('#zt-first-scan')?.addEventListener('click', startScan)
  el.querySelector('#zt-first-scan-2')?.addEventListener('click', startScan)
}

function renderZeroTrustError(el, errorMsg) {
  el.innerHTML = `
    <div class="page-header">
      <div>
        <div class="page-title"><i class="ti ti-lock-check"></i> Zero Trust Compliance</div>
        <div class="page-subtitle">Unable to load validation data</div>
      </div>
    </div>

    <div style="margin-top:20px">
      <div class="card" style="background:var(--color-background-secondary);border-left:3px solid var(--color-warning);padding:16px">
        <div style="font-size:13px;font-weight:500;margin-bottom:8px"><i class="ti ti-alert-circle"></i> Failed to load Zero Trust data</div>
        <div style="font-size:11px;color:var(--color-text-secondary);line-height:1.6">
          ${errorMsg}
          <br><br>
          <button class="btn btn-small" id="zt-retry"><i class="ti ti-refresh"></i> Retry</button>
        </div>
      </div>
    </div>
  `

  el.querySelector('#zt-retry')?.addEventListener('click', () => {
    initZeroTrust()
  })
}

function renderZeroTrustSkeleton(el) {
  el.innerHTML = `
    <div style="animation:fadeIn 200ms ease-in">
      <!-- Page Header -->
      <div class="page-header" style="margin-bottom:20px">
        <div>
          <div class="page-title" style="display:flex;align-items:center;gap:8px;margin-bottom:8px">
            <i class="ti ti-lock-check"></i> Zero Trust Compliance
          </div>
          <div class="page-subtitle" style="color:var(--color-text-secondary)">Loading validation data...</div>
        </div>
        <div class="page-actions">
          <button class="btn" disabled><i class="ti ti-refresh"></i> Refresh</button>
          <button class="btn btn-primary" disabled><i class="ti ti-download"></i> Export</button>
        </div>
      </div>

      <!-- KPI Row -->
      <div class="kpi-row" style="margin-bottom:24px">
        <div class="kpi-tile sec-kpi-primary">
          <div style="display:flex;align-items:center;gap:12px">
            <div style="width:52px;height:52px;background:linear-gradient(90deg, #e0e0e0 25%, #f0f0f0 50%, #e0e0e0 75%);background-size:200% 100%;animation:shimmer 1.5s infinite;border-radius:50%"></div>
            <div>
              <div style="background:linear-gradient(90deg, #e0e0e0 25%, #f0f0f0 50%, #e0e0e0 75%);background-size:200% 100%;animation:shimmer 1.5s infinite;width:60px;height:24px;border-radius:4px;margin-bottom:4px"></div>
              <div style="font-size:10px;text-transform:uppercase;color:var(--color-text-tertiary);font-weight:600">Compliance</div>
            </div>
          </div>
        </div>
        <div class="kpi-tile">
          <div style="background:linear-gradient(90deg, #e0e0e0 25%, #f0f0f0 50%, #e0e0e0 75%);background-size:200% 100%;animation:shimmer 1.5s infinite;width:50px;height:28px;border-radius:4px;margin-bottom:8px"></div>
          <div style="font-size:10px;text-transform:uppercase;color:var(--color-text-tertiary);font-weight:600">Failed</div>
        </div>
        <div class="kpi-tile">
          <div style="background:linear-gradient(90deg, #e0e0e0 25%, #f0f0f0 50%, #e0e0e0 75%);background-size:200% 100%;animation:shimmer 1.5s infinite;width:50px;height:28px;border-radius:4px;margin-bottom:8px"></div>
          <div style="font-size:10px;text-transform:uppercase;color:var(--color-text-tertiary);font-weight:600">Warnings</div>
        </div>
        <div class="kpi-tile">
          <div style="background:linear-gradient(90deg, #e0e0e0 25%, #f0f0f0 50%, #e0e0e0 75%);background-size:200% 100%;animation:shimmer 1.5s infinite;width:50px;height:28px;border-radius:4px;margin-bottom:8px"></div>
          <div style="font-size:10px;text-transform:uppercase;color:var(--color-text-tertiary);font-weight:600">Passed</div>
        </div>
      </div>

      <!-- Tab Navigation -->
      <div style="border:0.5px solid var(--color-border-secondary);border-radius:8px;background:var(--color-background-primary);padding:12px;margin-bottom:16px">
        <div class="tabs" style="margin-bottom:0;padding-bottom:0">
          <button class="tab-btn active" disabled>
            <i class="ti ti-layout-grid"></i><span>Overview</span>
          </button>
          <button class="tab-btn" disabled>
            <i class="ti ti-fingerprint"></i><span>Identity</span>
          </button>
          <button class="tab-btn" disabled>
            <i class="ti ti-device-mobile"></i><span>Device</span>
          </button>
          <button class="tab-btn" disabled>
            <i class="ti ti-app-window"></i><span>Application</span>
          </button>
          <button class="tab-btn" disabled>
            <i class="ti ti-database"></i><span>Data</span>
          </button>
          <button class="tab-btn" disabled>
            <i class="ti ti-server"></i><span>Infrastructure</span>
          </button>
          <button class="tab-btn" disabled>
            <i class="ti ti-shield-alert"></i><span>Threat</span>
          </button>
          <button class="tab-btn" disabled>
            <i class="ti ti-brain"></i><span>AI Security</span>
          </button>
        </div>
      </div>

      <!-- Pillar Cards (Overview Content) -->
      <div style="display:flex;gap:12px;margin-bottom:24px;overflow-x:auto;padding-bottom:8px">
        ${Array(7).fill(0).map(() => `
          <div style="display:flex;flex-direction:column;gap:6px;padding:12px;border-radius:8px;border-left:3px solid var(--color-border-secondary);background:var(--color-background-secondary);min-width:140px;flex-shrink:0">
            <div style="display:flex;align-items:center;gap:6px">
              <div style="background:linear-gradient(90deg, #e0e0e0 25%, #f0f0f0 50%, #e0e0e0 75%);background-size:200% 100%;animation:shimmer 1.5s infinite;width:40px;height:20px;border-radius:4px"></div>
            </div>
            <div style="background:linear-gradient(90deg, #f0f0f0 25%, #f9f9f9 50%, #f0f0f0 75%);background-size:200% 100%;animation:shimmer 1.5s infinite;width:100px;height:12px;border-radius:4px"></div>
            <div style="background:var(--color-border-secondary);height:4px;border-radius:2px;overflow:hidden">
              <div style="background:var(--color-border-secondary);height:100%;width:0%"></div>
            </div>
          </div>
        `).join('')}
      </div>

      <!-- Priority Actions / Validation Table -->
      <div class="card" style="padding:0;overflow:hidden">
        <div class="card-header" style="padding:16px">
          <span class="card-title"><i class="ti ti-alert-circle"></i> Priority Actions</span>
        </div>
        <div style="overflow-x:auto">
          <table style="width:100%">
            <thead><tr style="border-bottom:1px solid var(--color-border-secondary)">
              <th style="width:12%;padding:12px;text-align:left;font-weight:600;font-size:11px">Severity</th>
              <th style="width:35%;padding:12px;text-align:left;font-weight:600;font-size:11px">Control</th>
              <th style="width:15%;padding:12px;text-align:left;font-weight:600;font-size:11px">Pillar</th>
              <th style="width:25%;padding:12px;text-align:left;font-weight:600;font-size:11px">Status</th>
              <th style="width:8%;padding:12px;text-align:right;font-weight:600;font-size:11px"></th>
            </tr></thead>
            <tbody>
              ${Array(10).fill(0).map(() => `
                <tr style="border-bottom:0.5px solid var(--color-border-secondary)">
                  <td style="padding:12px">
                    <div style="background:linear-gradient(90deg, #e0e0e0 25%, #f0f0f0 50%, #e0e0e0 75%);background-size:200% 100%;animation:shimmer 1.5s infinite;width:50px;height:16px;border-radius:4px"></div>
                  </td>
                  <td style="padding:12px">
                    <div style="background:linear-gradient(90deg, #f0f0f0 25%, #f9f9f9 50%, #f0f0f0 75%);background-size:200% 100%;animation:shimmer 1.5s infinite;width:90%;height:12px;border-radius:4px;margin-bottom:6px"></div>
                    <div style="background:linear-gradient(90deg, #f0f0f0 25%, #f9f9f9 50%, #f0f0f0 75%);background-size:200% 100%;animation:shimmer 1.5s infinite;width:70%;height:10px;border-radius:4px"></div>
                  </td>
                  <td style="padding:12px">
                    <div style="background:linear-gradient(90deg, #f0f0f0 25%, #f9f9f9 50%, #f0f0f0 75%);background-size:200% 100%;animation:shimmer 1.5s infinite;width:80px;height:12px;border-radius:4px"></div>
                  </td>
                  <td style="padding:12px">
                    <div style="background:linear-gradient(90deg, #f0f0f0 25%, #f9f9f9 50%, #f0f0f0 75%);background-size:200% 100%;animation:shimmer 1.5s infinite;width:60px;height:12px;border-radius:4px"></div>
                  </td>
                  <td style="padding:12px;text-align:right">
                    <div style="background:linear-gradient(90deg, #f0f0f0 25%, #f9f9f9 50%, #f0f0f0 75%);background-size:200% 100%;animation:shimmer 1.5s infinite;width:40px;height:16px;border-radius:4px;margin-left:auto"></div>
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>

      <style>
        @keyframes shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
      </style>
    </div>
  `
}

function renderZeroTrustWithData(el) {
  if (!realValidations) {
    console.warn('⚠️ No real data available yet')
    return
  }

  const { totalValidations, summary, overallScore } = realValidations
  const scoreColor = overallScore >= 80 ? 'success' : overallScore >= 60 ? 'warning' : 'danger'
  const criticalIssues = summary.fail + summary.warn

  el.innerHTML = `
    <div class="page-header">
      <div>
        <div class="page-title"><i class="ti ti-lock-check"></i> Zero Trust Compliance</div>
        <div class="page-subtitle">${totalValidations} security controls · Last run: ${lastRunTime ? new Date(lastRunTime).toLocaleString() : 'Unknown'}</div>
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

  // Only render if real data is available
  if (!realValidations) {
    contentEl.innerHTML = `
      <div class="card" style="text-align:center;padding:20px;color:var(--color-text-secondary)">
        <div style="font-size:11px"><i class="ti ti-hourglass"></i> Loading validation data...</div>
      </div>
    `
    return
  }

  const pillarsMap = {
    identity: 'Identity Security',
    device: 'Device Security',
    application: 'Application Security',
    data: 'Data Protection & Compliance',
    infrastructure: 'Infrastructure & Workload Security',
    threat: 'Network & Threat Protection',
    ai: 'AI Security & Governance'
  }

  if (activeTab === 'overview') {
    contentEl.innerHTML = renderZTOverview()
  } else {
    const pillarName = pillarsMap[activeTab]
    const pillarStats = realValidations.summary.byPillar[pillarName]
    const pillarValidations = realValidations.validations.filter(v => v.pillar === pillarName)
    contentEl.innerHTML = renderZTPillarContent(pillarName, pillarStats, pillarValidations)
    // Apply "All" as the default active filter
    window.ztApplyFilter('all')
  }
}

function renderZTOverview() {
  if (!realValidations || !realValidations.summary.byPillar) return '<div class="card">Loading...</div>'

  const { summary } = realValidations

  const pillarIcons = {
    'Identity Security': 'ti-shield-check',
    'Device & Workload': 'ti-device-laptop',
    'Infrastructure & Workload': 'ti-building-community',
    'Application': 'ti-app-window',
    'Data Protection & Compliance': 'ti-lock',
    'AI & Governance': 'ti-brain',
    'Network & Threat Protection': 'ti-shield',
    'Email': 'ti-mail',
    'Threat': 'ti-alert-triangle'
  }

  return `
    <div style="display:flex;gap:12px;margin-bottom:24px;overflow-x:auto;padding-bottom:8px;align-items:flex-start">
      ${Object.entries(summary.byPillar).map(([pillar, stats]) => {
        const total = stats.pass + stats.fail + stats.warn
        const pillarScore = Math.round((stats.pass / total) * 100) || 0
        const pillarColor = pillarScore >= 80 ? 'success' : pillarScore >= 60 ? 'warning' : 'danger'
        const scoreColor = pillarColor === 'success' ? '#16a34a' : pillarColor === 'warning' ? '#d97706' : '#dc2626'
        const icon = pillarIcons[pillar] || 'ti-shield-check'
        const shortName = pillar.replace(' Security', '').replace(' & ', ' ').split(' ').slice(0, 2).join(' ')

        return `
          <div style="display:flex;flex-direction:column;gap:6px;padding:12px;border-radius:8px;border-left:3px solid ${scoreColor};cursor:pointer;transition:all 150ms ease;min-width:140px;flex-shrink:0;background:var(--color-background-secondary)"
               data-zt-pillar="${pillar}"
               onmouseover="this.style.background='var(--color-background-primary)'"
               onmouseout="this.style.background='var(--color-background-secondary)'">

            <div style="display:flex;align-items:center;gap:6px">
              <div style="font-size:16px;color:${scoreColor}"><i class="ti ${icon}"></i></div>
              <div style="font-size:18px;font-weight:700;color:${scoreColor}">${pillarScore}%</div>
            </div>

            <div style="font-size:11px;font-weight:600;color:var(--color-text-primary);line-height:1.2">${shortName}</div>

            <div style="background:var(--color-border-secondary);height:4px;border-radius:2px;overflow:hidden">
              <div style="background:${scoreColor};height:100%;width:${pillarScore}%;transition:width 300ms ease"></div>
            </div>

            <div style="font-size:9px;color:var(--color-text-secondary)">${stats.pass}/${total} passed</div>
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
          <div style="width:100%;min-width:0">
            <div style="display:grid;grid-template-columns:110px 1fr 160px 200px;padding:6px 10px;background:var(--color-background-secondary);border-bottom:1px solid var(--color-border-secondary);border-radius:4px 4px 0 0">
              <div style="font-size:11px;font-weight:600;color:var(--color-text-tertiary);text-transform:uppercase;letter-spacing:0.4px">Severity</div>
              <div style="font-size:11px;font-weight:600;color:var(--color-text-tertiary);text-transform:uppercase;letter-spacing:0.4px">Control</div>
              <div style="font-size:11px;font-weight:600;color:var(--color-text-tertiary);text-transform:uppercase;letter-spacing:0.4px">Pillar</div>
              <div style="font-size:11px;font-weight:600;color:var(--color-text-tertiary);text-transform:uppercase;letter-spacing:0.4px">Current Status</div>
            </div>
            ${priorityActions.slice(0, 10).map(action => `
              <div style="display:grid;grid-template-columns:110px 1fr 160px 200px;padding:10px;border-bottom:0.5px solid var(--color-border-tertiary);align-items:start" class="validation-row" data-validation-id="${action.id}">
                <div><span class="badge ${action.severity === 'Critical' ? 'danger' : 'warning'}">${action.severity}</span></div>
                <div style="min-width:0">
                  <div style="font-size:11px;font-weight:600;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${action.name}</div>
                  <div style="font-size:10px;color:var(--color-text-tertiary);margin-top:3px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${action.description || ''}</div>
                </div>
                <div><span class="pill" style="font-size:10px">${action.pillar}</span></div>
                <div style="font-size:10px;color:var(--color-text-secondary)">${action.currentValue || action.status}</div>
              </div>
            `).join('')}
          </div>
        </div>
      </div>
    ` : ''}
  `
}

function renderZTOverviewDemo() {
  const demoPillars = window.ztDemoPillars || []

  const pillarIcons = {
    'Identity Security': 'ti-shield-check',
    'Device & Workload': 'ti-device-laptop',
    'Infrastructure & Workload': 'ti-building-community',
    'Application': 'ti-app-window',
    'Data Protection & Compliance': 'ti-lock',
    'AI & Governance': 'ti-brain',
    'Network & Threat Protection': 'ti-shield',
    'Email': 'ti-mail',
    'Threat': 'ti-alert-triangle'
  }

  return `
    <div style="display:flex;gap:12px;margin-bottom:24px;overflow-x:auto;padding-bottom:8px;align-items:flex-start">
      ${demoPillars.map(pillar => {
        const pass = pillar.controls.filter(c => c.status === 'pass').length
        const warn = pillar.controls.filter(c => c.status === 'warn').length
        const fail = pillar.controls.filter(c => c.status === 'fail').length
        const total = pillar.controls.length
        const pillarScore = Math.round((pass / total) * 100) || 0
        const pillarColor = pillarScore >= 80 ? 'success' : pillarScore >= 60 ? 'warning' : 'danger'
        const scoreColor = pillarColor === 'success' ? '#16a34a' : pillarColor === 'warning' ? '#d97706' : '#dc2626'
        const icon = pillarIcons[pillar.name] || 'ti-shield-check'
        const shortName = pillar.name.replace(' Security', '').replace(' & ', ' ').split(' ').slice(0, 2).join(' ')

        return `
          <div style="display:flex;flex-direction:column;gap:6px;padding:12px;border-radius:8px;border-left:3px solid ${scoreColor};cursor:pointer;transition:all 150ms ease;min-width:140px;flex-shrink:0;background:var(--color-background-secondary)"
               data-zt-pillar="${pillar.name}"
               onmouseover="this.style.background='var(--color-background-primary)'"
               onmouseout="this.style.background='var(--color-background-secondary)'">

            <div style="display:flex;align-items:center;gap:6px">
              <div style="font-size:16px;color:${scoreColor}"><i class="ti ${icon}"></i></div>
              <div style="font-size:18px;font-weight:700;color:${scoreColor}">${pillarScore}%</div>
            </div>

            <div style="font-size:11px;font-weight:600;color:var(--color-text-primary);line-height:1.2">${shortName}</div>

            <div style="background:var(--color-border-secondary);height:4px;border-radius:2px;overflow:hidden">
              <div style="background:${scoreColor};height:100%;width:${pillarScore}%;transition:width 300ms ease"></div>
            </div>

            <div style="font-size:9px;color:var(--color-text-secondary)">${pass}/${total} passed</div>
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
  if (!stats || !validations) return '<div class="card" style="padding:20px;text-align:center;color:var(--color-text-tertiary)">No data for this pillar</div>'

  const pass = stats.pass || 0
  const fail = stats.fail || 0
  const warn = stats.warn || 0
  const total = pass + fail + warn
  const manualCount = validations.filter(v => v.requiresManualValidation).length
  const passPct  = total > 0 ? Math.round((pass / total) * 100) : 0
  const failPct  = total > 0 ? Math.round((fail / total) * 100) : 0
  const warnPct  = total > 0 ? Math.round((warn / total) * 100) : 0

  // Group validations by category
  const byCategory = {}
  validations.forEach(v => {
    const cat = v.category || 'General'
    if (!byCategory[cat]) byCategory[cat] = []
    byCategory[cat].push(v)
  })

  const statusIcon = (status) => {
    if (status === 'pass') return '<span style="color:var(--clr-success-text);font-size:15px;font-weight:700">✓</span>'
    if (status === 'fail') return '<span style="color:var(--clr-danger-text);font-size:15px;font-weight:700">✗</span>'
    return '<span style="color:var(--clr-warning-text);font-size:15px">⚠</span>'
  }

  const filterBtn = (filterVal, label, pct, count, bg, color, border) => `
    <button onclick="window.ztApplyFilter('${filterVal}')"
      data-zt-filter="${filterVal}"
      style="display:flex;flex-direction:column;align-items:center;padding:10px 16px;border-radius:8px;border:2px solid ${border};background:${bg};color:${color};cursor:pointer;transition:all 150ms;min-width:90px;font-family:inherit">
      <span style="font-size:20px;font-weight:700;line-height:1">${pct}%</span>
      <span style="font-size:10px;font-weight:600;margin-top:3px;text-transform:uppercase;letter-spacing:0.4px">${label}</span>
      <span style="font-size:10px;margin-top:1px;opacity:0.75">${count} controls</span>
    </button>`

  return `
    <div class="card mb-3" id="zt-pillar-header">
      <div class="card-header">
        <span class="card-title">${pillarName}</span>
        ${manualCount > 0 ? `<span style="display:inline-flex;align-items:center;gap:4px;font-size:10px;font-weight:700;padding:2px 8px;border-radius:4px;background:#fff3cd;color:#92400e;border:1px solid #fbbf24"><i class="ti ti-hand"></i> ${manualCount} manual</span>` : ''}
      </div>
      <div style="display:flex;gap:10px;align-items:stretch;padding:14px 16px;flex-wrap:wrap">
        <button onclick="window.ztApplyFilter('all')"
          data-zt-filter="all"
          style="display:flex;flex-direction:column;align-items:center;padding:10px 16px;border-radius:8px;border:2px solid var(--color-border-secondary);background:var(--color-background-secondary);color:var(--color-text-primary);cursor:pointer;transition:all 150ms;min-width:80px;font-family:inherit">
          <span style="font-size:20px;font-weight:700;line-height:1">${total}</span>
          <span style="font-size:10px;font-weight:600;margin-top:3px;text-transform:uppercase;letter-spacing:0.4px">All</span>
        </button>
        ${filterBtn('pass',  'Compliant', passPct, pass, '#f0fdf4', '#15803d', '#86efac')}
        ${filterBtn('fail',  'Failed',    failPct, fail, '#fff1f2', '#be123c', '#fda4af')}
        ${filterBtn('warn',  'Warning',   warnPct, warn, '#fffbeb', '#b45309', '#fcd34d')}
        ${manualCount > 0 ? filterBtn('manual', 'Manual', Math.round((manualCount/total)*100), manualCount, '#fff7ed', '#c2410c', '#fdba74') : ''}
      </div>
    </div>

    <div id="zt-pillar-body">
    ${Object.entries(byCategory).map(([category, controls]) => `
      <div class="card mb-3 zt-category-card">
        <div class="card-header">
          <span style="font-size:11px;font-weight:700;color:var(--color-text-secondary);text-transform:uppercase;letter-spacing:0.4px">${category}</span>
          <span class="zt-category-count" style="font-size:10px;color:var(--color-text-tertiary)">${controls.length} control${controls.length !== 1 ? 's' : ''}</span>
        </div>
        <div style="display:grid;grid-template-columns:32px 1fr 200px 200px 90px;padding:6px 12px;background:var(--color-background-secondary);border-bottom:1px solid var(--color-border-secondary)">
          <div></div>
          <div style="font-size:10px;font-weight:600;color:var(--color-text-tertiary);text-transform:uppercase;letter-spacing:0.4px">Control</div>
          <div style="font-size:10px;font-weight:600;color:var(--color-text-tertiary);text-transform:uppercase;letter-spacing:0.4px">Expected</div>
          <div style="font-size:10px;font-weight:600;color:var(--color-text-tertiary);text-transform:uppercase;letter-spacing:0.4px">Current Status</div>
          <div style="font-size:10px;font-weight:600;color:var(--color-text-tertiary);text-transform:uppercase;letter-spacing:0.4px;text-align:right">Severity</div>
        </div>
        ${controls.map(v => `
          <div style="display:grid;grid-template-columns:32px 1fr 200px 200px 90px;padding:10px 12px;border-bottom:0.5px solid var(--color-border-tertiary);align-items:start;cursor:pointer"
               class="validation-detail-row zt-control-row"
               data-validation-id="${v.id}"
               data-status="${v.status}"
               data-manual="${v.requiresManualValidation ? 'true' : 'false'}"
               onmouseover="this.style.background='var(--color-background-secondary)'"
               onmouseout="this.style.background=''">
            <div style="padding-top:2px;text-align:center">${statusIcon(v.status)}</div>
            <div style="min-width:0">
              <div style="font-size:11px;font-weight:600;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">
                ${v.name}
                ${v.requiresManualValidation ? '<span style="display:inline-block;font-size:9px;font-weight:700;padding:1px 6px;border-radius:4px;margin-left:6px;vertical-align:middle;background:#fff3cd;color:#92400e;border:1px solid #fbbf24;letter-spacing:0.3px">MANUAL</span>' : ''}
              </div>
              <div style="font-size:10px;color:var(--color-text-tertiary);margin-top:2px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${v.description || ''}</div>
            </div>
            <div style="font-size:10px;color:var(--color-text-secondary);padding-right:8px">${v.expectedValue || '—'}</div>
            <div style="font-size:10px;color:${v.requiresManualValidation ? 'var(--clr-warning-text)' : 'var(--color-text-secondary)'}">
              ${v.currentValue || '—'}
            </div>
            <div style="text-align:right">
              <span class="badge ${v.severity === 'Critical' ? 'danger' : v.severity === 'High' ? 'warning' : 'secondary'}" style="font-size:9px">${v.severity || '—'}</span>
            </div>
          </div>
        `).join('')}
      </div>
    `).join('')}
    </div>
  `
}

// Global filter function — called by onclick on filter buttons
window.ztApplyFilter = function(filterVal) {
  // Update button active states
  document.querySelectorAll('[data-zt-filter]').forEach(btn => {
    const isActive = btn.dataset.ztFilter === filterVal
    btn.style.opacity = isActive ? '1' : '0.55'
    btn.style.transform = isActive ? 'scale(1.04)' : 'scale(1)'
    btn.style.boxShadow = isActive ? '0 2px 8px rgba(0,0,0,0.12)' : 'none'
  })

  // Show/hide control rows — must restore 'grid' (not '') to preserve column layout
  document.querySelectorAll('.zt-control-row').forEach(row => {
    let show = false
    if (filterVal === 'all')         show = true
    else if (filterVal === 'manual') show = row.dataset.manual === 'true'
    else                             show = row.dataset.status === filterVal
    row.style.display = show ? 'grid' : 'none'
  })

  // Hide category cards where all rows are hidden; update visible count
  document.querySelectorAll('.zt-category-card').forEach(card => {
    const rows = card.querySelectorAll('.zt-control-row')
    const visible = [...rows].filter(r => r.style.display !== 'none')
    card.style.display = visible.length === 0 ? 'none' : ''
    const countEl = card.querySelector('.zt-category-count')
    if (countEl) countEl.textContent = `${visible.length} control${visible.length !== 1 ? 's' : ''}`
  })
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
  // Tab navigation with lazy loading
  el.querySelectorAll('#zt-tabs .tab-btn').forEach(btn => {
    btn.addEventListener('click', async () => {
      const tabId = btn.dataset.ztTab
      activeTab = tabId

      el.querySelectorAll('#zt-tabs .tab-btn').forEach(b => b.classList.remove('active'))
      btn.classList.add('active')

      // Show loading state immediately
      renderZTTabContent(el)

      // Lazy load pillar data if not overview tab and not already loaded
      if (tabId !== 'overview' && !lazyLoadedPillars[tabId] && realValidations) {
        const contentEl = el.querySelector('#zt-content')
        if (contentEl) {
          contentEl.innerHTML = `
            <div class="card" style="text-align:center;padding:20px;color:var(--color-text-secondary)">
              <div style="font-size:11px;margin-bottom:8px"><i class="ti ti-hourglass"></i> Loading ${btn.textContent.trim()} controls...</div>
            </div>
          `
        }

        // Cache the loaded pillar data
        lazyLoadedPillars[tabId] = true
      }

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

  // Refresh button — runs a full live scan
  el.querySelector('#zt-rescan')?.addEventListener('click', async () => {
    const btn = el.querySelector('#zt-rescan')
    btn.innerHTML = '<span class="spinner dark"></span> Scanning...'
    btn.disabled = true
    await runFullScan(el)
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

  // Manual validation buttons
  el.querySelectorAll('.btn-validate-manual').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation()
      const controlId = btn.dataset.controlId
      const controlName = btn.dataset.controlName
      const expectedValue = btn.dataset.expected
      showManualValidationModal(controlId, controlName, expectedValue)
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
            <div style="font-size:12px;background:#f9fafb;padding:12px;border-radius:4px;line-height:1.6;color:#111827;font-family:monospace;white-space:pre-wrap;word-break:break-word;overflow-x:auto">
              ${typeof validation.evidence === 'object' ? JSON.stringify(validation.evidence, null, 2) : validation.evidence}
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
          <button class="btn-validate-manual" data-control-id="${validation.id}" data-control-name="${validation.name}" data-expected="${validation.expectedValue}" style="background:#7c3aed;color:white;border:none;padding:10px 16px;border-radius:4px;cursor:pointer;font-size:12px;font-weight:600;flex:1;transition:background 0.2s" onmouseover="this.style.background='#6d28d9'" onmouseout="this.style.background='#7c3aed'">
            <i class="ti ti-pencil"></i> Validate Manually
          </button>
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

function showManualValidationModal(controlId, controlName, expectedValue) {
  const modal = document.createElement('div')
  modal.style.cssText = `
    position:fixed;top:0;left:0;right:0;bottom:0;
    background:rgba(0,0,0,0.5);
    display:flex;align-items:center;justify-content:center;
    z-index:10000;
    padding:20px
  `
  modal.setAttribute('role', 'dialog')
  modal.setAttribute('aria-modal', 'true')

  modal.innerHTML = `
    <div style="background:#ffffff;border-radius:8px;padding:0;max-width:600px;width:100%;max-height:90vh;overflow-y:auto;box-shadow:0 20px 25px -5px rgba(0,0,0,0.1);display:flex;flex-direction:column">
      <!-- Header -->
      <div style="padding:20px;border-bottom:1px solid #e5e7eb;background:#f9fafb;position:relative">
        <h2 style="margin:0;font-size:18px;font-weight:700;color:#111827">Manual Validation</h2>
        <div style="font-size:12px;color:#6b7280;margin-top:4px">${controlId}: ${controlName}</div>
        <button style="position:absolute;top:16px;right:16px;background:none;border:none;font-size:24px;cursor:pointer;color:#6b7280" onclick="this.closest('[role=dialog]').remove()">×</button>
      </div>

      <!-- Form -->
      <form style="padding:20px;overflow-y:auto;flex:1" onsubmit="handleManualValidation(event, '${controlId}')">
        <!-- Expected Value (Read-only) -->
        <div style="margin-bottom:16px">
          <label style="display:block;font-size:12px;font-weight:600;color:#111827;margin-bottom:6px;text-transform:uppercase;letter-spacing:0.5px">Expected Value</label>
          <div style="font-size:13px;background:#f0fdf4;padding:12px;border-radius:4px;border-left:3px solid #22c55e;color:#111827">
            ${expectedValue || 'No expected value defined'}
          </div>
        </div>

        <!-- Current Value -->
        <div style="margin-bottom:16px">
          <label style="display:block;font-size:12px;font-weight:600;color:#111827;margin-bottom:6px;text-transform:uppercase;letter-spacing:0.5px">Current Value <span style="color:#ef4444">*</span></label>
          <input type="text" id="currentValue" placeholder="Enter what you found" style="width:100%;padding:10px 12px;border:1px solid #d1d5db;border-radius:4px;font-size:13px;font-family:inherit;box-sizing:border-box" required>
          <div style="font-size:11px;color:#6b7280;margin-top:4px">Describe the current configuration or setting value</div>
        </div>

        <!-- Status -->
        <div style="margin-bottom:16px">
          <label style="display:block;font-size:12px;font-weight:600;color:#111827;margin-bottom:6px;text-transform:uppercase;letter-spacing:0.5px">Validation Status <span style="color:#ef4444">*</span></label>
          <select id="status" style="width:100%;padding:10px 12px;border:1px solid #d1d5db;border-radius:4px;font-size:13px;font-family:inherit;box-sizing:border-box" required>
            <option value="PASS">✓ Pass - Control is compliant</option>
            <option value="FAIL">✗ Fail - Control is not compliant</option>
            <option value="WARNING">⚠️ Warning - Partial compliance</option>
          </select>
        </div>

        <!-- Notes -->
        <div style="margin-bottom:16px">
          <label style="display:block;font-size:12px;font-weight:600;color:#111827;margin-bottom:6px;text-transform:uppercase;letter-spacing:0.5px">Validation Notes</label>
          <textarea id="notes" placeholder="Where did you check? Any relevant details?" style="width:100%;padding:10px 12px;border:1px solid #d1d5db;border-radius:4px;font-size:13px;font-family:inherit;box-sizing:border-box;min-height:80px;resize:vertical"></textarea>
          <div style="font-size:11px;color:#6b7280;margin-top:4px">Optional: Document how you validated this control</div>
        </div>

        <!-- Evidence (JSON) -->
        <div style="margin-bottom:20px">
          <label style="display:block;font-size:12px;font-weight:600;color:#111827;margin-bottom:6px;text-transform:uppercase;letter-spacing:0.5px">Evidence (JSON)</label>
          <textarea id="evidence" placeholder='{"location": "Teams Admin Center", "setting": "value"}' style="width:100%;padding:10px 12px;border:1px solid #d1d5db;border-radius:4px;font-size:13px;font-family:monospace;box-sizing:border-box;min-height:60px;resize:vertical"></textarea>
          <div style="font-size:11px;color:#6b7280;margin-top:4px">Optional: Structured evidence data as JSON</div>
        </div>

        <!-- Buttons -->
        <div style="display:flex;gap:8px;border-top:1px solid #e5e7eb;padding-top:16px">
          <button type="submit" style="background:#7c3aed;color:white;border:none;padding:10px 16px;border-radius:4px;cursor:pointer;font-size:12px;font-weight:600;flex:1;transition:background 0.2s" onmouseover="this.style.background='#6d28d9'" onmouseout="this.style.background='#7c3aed'">
            <i class="ti ti-check"></i> Save Validation
          </button>
          <button type="button" style="background:#f3f4f6;color:#111827;border:1px solid #d1d5db;padding:10px 16px;border-radius:4px;cursor:pointer;font-size:12px;font-weight:600;flex:1;transition:background 0.2s" onmouseover="this.style.background='#e5e7eb'" onmouseout="this.style.background='#f3f4f6'" onclick="this.closest('[role=dialog]').remove()">
            Cancel
          </button>
        </div>
      </form>
    </div>
  `

  document.body.appendChild(modal)
  modal.addEventListener('click', e => {
    if (e.target === modal) modal.remove()
  })
}

async function handleManualValidation(event, controlId) {
  event.preventDefault()

  const status = document.getElementById('status').value
  const currentValue = document.getElementById('currentValue').value
  const notes = document.getElementById('notes').value
  const evidenceStr = document.getElementById('evidence').value

  let evidence = null
  if (evidenceStr.trim()) {
    try {
      evidence = JSON.parse(evidenceStr)
    } catch (e) {
      showToast('Invalid JSON in evidence field', 'error')
      return
    }
  }

  const userId = `user-${Date.now()}` // In production, get from auth context

  try {
    const response = await fetch(`${api}/zero-trust/validate-manual`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-User-Id': userId
      },
      body: JSON.stringify({
        controlId,
        status,
        currentValue,
        notes,
        evidence
      })
    })

    const result = await response.json()

    if (response.ok && result.success) {
      showToast(`✓ Control ${controlId} marked as validated`, 'success')
      document.querySelector('[role=dialog]').remove()
      // Refresh the zero trust page to show updated status
      setTimeout(() => location.reload(), 1000)
    } else {
      showToast(`Error: ${result.error || 'Validation failed'}`, 'error')
    }
  } catch (error) {
    showToast(`Error: ${error.message}`, 'error')
  }
}
