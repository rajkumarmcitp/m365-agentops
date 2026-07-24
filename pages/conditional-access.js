/**
 * Conditional Access Policy Dashboard
 * Real-time validation, compliance scoring, and remediation management
 */

import { showToast } from '../components/toast.js'
import { callAPI } from '../lib/api-client.js'

let currentTab = 'overview'
let currentCategory = 'CA-CAT-02' // Default to Identity Protection
let dashboardData = null
let autoRefreshInterval = null

export function initConditionalAccess() {
  const el = document.getElementById('page-conditionalaccess')
  if (!el) {
    console.warn('CAP page element not found')
    return
  }

  // Render initial UI
  renderCAP(el)

  // Load data
  loadCAPData(el)

  // Set up auto-refresh (5 minutes)
  if (autoRefreshInterval) clearInterval(autoRefreshInterval)
  autoRefreshInterval = setInterval(() => loadCAPData(el), 300000)
}

async function loadCAPData(el) {
  try {
    const [homeData, complianceData, controlsData, riskData, remData, driftData] = await Promise.all([
      callAPI('/cap/dashboard/home'),
      callAPI('/cap/dashboard/compliance'),
      callAPI('/cap/dashboard/controls'),
      callAPI('/cap/dashboard/risk'),
      callAPI('/cap/dashboard/remediation'),
      callAPI('/cap/dashboard/drift')
    ])

    dashboardData = {
      home: homeData?.data || homeData,
      compliance: complianceData?.data || complianceData,
      controls: controlsData?.data || controlsData,
      risk: riskData?.data || riskData,
      remediation: remData?.data || remData,
      drift: driftData?.data || driftData
    }

    renderTabContent(el, currentTab)
  } catch (error) {
    console.error('Error loading CAP data:', error)
    showToast('Failed to load dashboard data', 'error')

    const contentEl = el.querySelector('#cap-content')
    if (contentEl) {
      contentEl.innerHTML = `
        <div class="card" style="background:var(--clr-danger-bg);border-left:3px solid var(--clr-danger-text);padding:16px">
          <div style="font-size:13px;font-weight:500;margin-bottom:8px"><i class="fas fa-exclamation-circle"></i> Failed to load data</div>
          <div style="font-size:11px;color:var(--color-text-secondary);line-height:1.6">
            ${error.message}
            <br><br>
            <button class="btn btn-primary btn-xs" id="cap-retry"><i class="fas fa-sync"></i> Retry</button>
          </div>
        </div>
      `
      el.querySelector('#cap-retry')?.addEventListener('click', () => loadCAPData(el))
    }
  }

  // Category selector event listeners (attached to persistent buttons)
  setTimeout(() => {
    const categoryButtons = el.querySelectorAll('.category-selector')
    categoryButtons.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault()
        currentCategory = e.currentTarget.dataset.category
        categoryButtons.forEach(b => {
          if (b.dataset.category === currentCategory) {
            b.style.background = 'var(--clr-primary)'
            b.style.color = 'white'
            b.style.border = 'none'
          } else {
            b.style.background = 'transparent'
            b.style.color = 'var(--color-text-primary)'
            b.style.border = '0.5px solid var(--color-border-tertiary)'
          }
        })
        renderTabContent(el, currentTab)
      })
    })
  }, 0)
}

function renderCAP(el) {
  el.innerHTML = `
    <div class="page-header">
      <div>
        <div class="page-title"><i class="fas fa-shield-check"></i> Conditional Access Policies</div>
        <div class="page-subtitle">Zero Trust validation engine with multi-framework compliance scoring</div>
      </div>
      <div style="display:flex;gap:8px;align-items:center">
        <button class="page-help" title="Validate Conditional Access policies across zero trust pillars (Identity, Device, Network, Application, Session, Governance, Monitoring). Monitor compliance against CIS Controls, NIST 800-53, and ISO 27001.">
          <i class="fas fa-question-circle"></i>
        </button>
        <button id="cap-refresh" class="btn btn-primary"><i class="fas fa-sync"></i> Refresh</button>
      </div>
    </div>

    <div class="cap-tabs">
      <button class="tab-btn active" data-tab="overview">Overview</button>
      <button class="tab-btn" data-tab="assessment">Category Assessment</button>
      <button class="tab-btn" data-tab="compliance">Compliance</button>
      <button class="tab-btn" data-tab="controls">Controls</button>
      <button class="tab-btn" data-tab="risk">Risk</button>
      <button class="tab-btn" data-tab="remediation">Remediation</button>
      <button class="tab-btn" data-tab="drift">Drift</button>
    </div>

    <!-- Control Category Selector (Only shown in Category Assessment tab) -->
    <div id="cap-category-selector" style="display:none;gap:8px;margin-bottom:16px;margin-top:16px;flex-wrap:wrap;padding:12px;background:var(--color-background-secondary);border-radius:4px;border:0.5px solid var(--color-border-tertiary)">
      <button class="category-selector" data-category="CA-CAT-01" style="background:transparent;color:var(--color-text-primary);padding:8px 14px;border-radius:4px;border:0.5px solid var(--color-border-tertiary);cursor:pointer;font-weight:600;font-size:12px">
        <i class="fas fa-foundation"></i> Policy Foundation
      </button>
      <button class="category-selector" data-category="CA-CAT-02" style="background:var(--clr-primary);color:white;padding:8px 14px;border-radius:4px;border:none;cursor:pointer;font-weight:600;font-size:12px">
        <i class="fas fa-shield-alt"></i> Identity Protection
      </button>
      <button class="category-selector" data-category="CA-CAT-03" style="background:transparent;color:var(--color-text-primary);padding:8px 14px;border-radius:4px;border:0.5px solid var(--color-border-tertiary);cursor:pointer;font-weight:600;font-size:12px">
        <i class="fas fa-lock"></i> Administrative Protection
      </button>
      <button class="category-selector" data-category="CA-CAT-04" style="background:transparent;color:var(--color-text-primary);padding:8px 14px;border-radius:4px;border:0.5px solid var(--color-border-tertiary);cursor:pointer;font-weight:600;font-size:12px">
        <i class="fas fa-laptop"></i> Device Trust
      </button>
      <button class="category-selector" data-category="CA-CAT-05" style="background:transparent;color:var(--color-text-primary);padding:8px 14px;border-radius:4px;border:0.5px solid var(--color-border-tertiary);cursor:pointer;font-weight:600;font-size:12px">
        <i class="fas fa-cube"></i> Application Protection
      </button>
      <button class="category-selector" data-category="CA-CAT-06" style="background:transparent;color:var(--color-text-primary);padding:8px 14px;border-radius:4px;border:0.5px solid var(--color-border-tertiary);cursor:pointer;font-weight:600;font-size:12px">
        <i class="fas fa-globe"></i> Network Protection
      </button>
      <button class="category-selector" data-category="CA-CAT-07" style="background:transparent;color:var(--color-text-primary);padding:8px 14px;border-radius:4px;border:0.5px solid var(--color-border-tertiary);cursor:pointer;font-weight:600;font-size:12px">
        <i class="fas fa-mobile-alt"></i> Client Application Protection
      </button>
      <button class="category-selector" data-category="CA-CAT-08" style="background:transparent;color:var(--color-text-primary);padding:8px 14px;border-radius:4px;border:0.5px solid var(--color-border-tertiary);cursor:pointer;font-weight:600;font-size:12px">
        <i class="fas fa-hourglass-end"></i> Session Protection
      </button>
      <button class="category-selector" data-category="CA-CAT-09" style="background:transparent;color:var(--color-text-primary);padding:8px 14px;border-radius:4px;border:0.5px solid var(--color-border-tertiary);cursor:pointer;font-weight:600;font-size:12px">
        <i class="fas fa-user-friends"></i> Guest & External Users
      </button>
      <button class="category-selector" data-category="CA-CAT-10" style="background:transparent;color:var(--color-text-primary);padding:8px 14px;border-radius:4px;border:0.5px solid var(--color-border-tertiary);cursor:pointer;font-weight:600;font-size:12px">
        <i class="fas fa-cogs"></i> Workload Identity Protection
      </button>
      <button class="category-selector" data-category="CA-CAT-11" style="background:transparent;color:var(--color-text-primary);padding:8px 14px;border-radius:4px;border:0.5px solid var(--color-border-tertiary);cursor:pointer;font-weight:600;font-size:12px">
        <i class="fas fa-code"></i> Developer Protection
      </button>
      <button class="category-selector" data-category="CA-CAT-12" style="background:transparent;color:var(--color-text-primary);padding:8px 14px;border-radius:4px;border:0.5px solid var(--color-border-tertiary);cursor:pointer;font-weight:600;font-size:12px">
        <i class="fas fa-chart-line"></i> Monitoring & Governance
      </button>
    </div>

    <div id="cap-content" class="cap-content"></div>
  `

  el.querySelector('#cap-refresh').addEventListener('click', () => loadCAPData(el))

  el.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      el.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'))
      btn.classList.add('active')
      currentTab = btn.dataset.tab
      renderTabContent(el, currentTab)
    })
  })

  const contentEl = el.querySelector('#cap-content')
  contentEl.innerHTML = `<div style="padding:40px;text-align:center;color:var(--color-text-secondary)"><i class="fas fa-spinner" style="font-size:20px;margin-bottom:12px;display:block;opacity:0.5;animation:spin 1s linear infinite"></i>Loading...</div>`
}

function renderTabContent(el, tab) {
  const contentEl = el.querySelector('#cap-content')
  if (!contentEl) return

  if (!dashboardData) {
    contentEl.innerHTML = `<div class="loading">Loading ${tab} data...</div>`
    return
  }

  // Show/hide category selector based on tab
  const categorySelector = el.querySelector('#cap-category-selector')
  if (categorySelector) {
    categorySelector.style.display = tab === 'assessment' ? 'flex' : 'none'
  }

  switch (tab) {
    case 'overview':
      renderOverviewTab(contentEl, dashboardData.home)
      break
    case 'assessment':
      renderCategoryAssessmentTab(contentEl, dashboardData.home)
      break
    case 'compliance':
      renderComplianceTab(contentEl, dashboardData.compliance)
      break
    case 'controls':
      renderControlsTab(contentEl, dashboardData.controls)
      break
    case 'risk':
      renderRiskTab(contentEl, dashboardData.risk)
      break
    case 'remediation':
      renderRemediationTab(contentEl, dashboardData.remediation)
      break
    case 'drift':
      renderDriftTab(contentEl, dashboardData.drift)
      break
    default:
      contentEl.innerHTML = '<div>No data</div>'
  }
}

function renderOverviewTab(el, data) {
  if (!data || !data.scorecard) {
    el.innerHTML = `
      <div class="card" style="background:var(--clr-danger-bg);border-left:3px solid var(--clr-danger-text);padding:16px">
        <div style="font-size:13px;font-weight:500"><i class="fas fa-exclamation-circle"></i> No data available</div>
        <div style="font-size:12px;color:var(--color-text-secondary);margin-top:8px">Backend services may not be initialized.</div>
      </div>
    `
    return
  }

  const scoreColor = data.scorecard.overallScore >= 80 ? 'var(--clr-success-text)' : data.scorecard.overallScore >= 60 ? 'var(--clr-warning-text)' : 'var(--clr-danger-text)'

  el.innerHTML = `
    <div class="card">
      <div class="card-header">
        <div class="card-title">Security Scorecard</div>
      </div>
      <div class="scorecard">
        <div class="score-item">
          <div class="score-value" style="color: ${scoreColor}">${data.scorecard.overallScore}</div>
          <div class="score-label">Score</div>
          <div class="score-bar">
            <div class="score-fill" style="width: ${data.scorecard.overallScore}%"></div>
          </div>
        </div>
        <div class="score-item">
          <div class="score-value" style="color: ${scoreColor}">${data.scorecard.grade}</div>
          <div class="score-label">Grade</div>
        </div>
        <div class="score-item">
          <div class="score-badge" style="background: ${getRiskBackground(data.scorecard.riskLevel)}; color: ${getRiskText(data.scorecard.riskLevel)}">${data.scorecard.riskLevel}</div>
          <div class="score-label">Risk</div>
        </div>
        <div class="score-item">
          <div class="score-value" style="color: var(--clr-primary)">${data.scorecard.compliance}%</div>
          <div class="score-label">Compliance</div>
        </div>
      </div>
    </div>

    <div class="cap-grid">
      <div class="card">
        <div style="font-size:24px;font-weight:700;color:var(--clr-primary);margin-bottom:4px">${data.keyMetrics.totalPolicies}</div>
        <div style="font-size:12px;color:var(--color-text-secondary)">Total Policies</div>
      </div>
      <div class="card">
        <div style="font-size:24px;font-weight:700;color:var(--clr-primary);margin-bottom:4px">${data.keyMetrics.totalControls}</div>
        <div style="font-size:12px;color:var(--color-text-secondary)">Total Controls</div>
      </div>
      <div class="card" style="background:var(--clr-success-bg);border-color:var(--clr-success-border)">
        <div style="font-size:24px;font-weight:700;color:var(--clr-success-text);margin-bottom:4px">${data.keyMetrics.compliantControls}</div>
        <div style="font-size:12px;color:var(--clr-success-text)">Compliant</div>
      </div>
      <div class="card" style="background:var(--clr-danger-bg);border-color:var(--clr-danger-border)">
        <div style="font-size:24px;font-weight:700;color:var(--clr-danger-text);margin-bottom:4px">${data.keyMetrics.implementationGap}</div>
        <div style="font-size:12px;color:var(--clr-danger-text)">Gap</div>
      </div>
    </div>

    <div class="card">
      <div class="card-header">
        <div class="card-title">Top Recommendations</div>
      </div>
      <div style="display:flex;flex-direction:column;gap:12px">
        ${data.topRecommendations.slice(0, 3).map((rec, i) => `
          <div style="padding:12px;background:var(--color-background-secondary);border-left:3px solid var(--clr-primary);border-radius:4px">
            <div style="font-weight:600;color:var(--color-text-primary);margin-bottom:4px">${rec.title}</div>
            <div style="font-size:12px;color:var(--color-text-secondary);line-height:1.4">${rec.description}</div>
          </div>
        `).join('')}
      </div>
    </div>
  `
}

function renderCategoryAssessmentTab(el, data) {
  if (!data || !getControlEvaluation(data)) {
    el.innerHTML = `
      <div class="card" style="background:var(--clr-danger-bg);border-left:3px solid var(--clr-danger-text);padding:16px">
        <div style="font-size:13px;font-weight:500"><i class="fas fa-exclamation-circle"></i> No category data available</div>
        <div style="font-size:12px;color:var(--color-text-secondary);margin-top:8px">Select a category above to view control assessment details.</div>
      </div>
    `
    return
  }

  const categoryEval = getControlEvaluation(data)
  el.innerHTML = `
    <div class="card">
      <div class="card-header">
        <div class="card-title"><i class="fas fa-tasks"></i> ${categoryEval.categoryName} - Control Assessment</div>
      </div>
      <div style="overflow-x:auto">
        <table style="width:100%;border-collapse:collapse;font-size:11px">
          <thead>
            <tr style="background:var(--color-background-secondary);border-bottom:1px solid var(--color-border-tertiary)">
              <th style="padding:10px;text-align:left;font-weight:600;color:var(--color-text-primary);width:80px">Control ID</th>
              <th style="padding:10px;text-align:left;font-weight:600;color:var(--color-text-primary)">Control Name</th>
              <th style="padding:10px;text-align:left;font-weight:600;color:var(--color-text-primary);width:70px">Severity</th>
              <th style="padding:10px;text-align:center;font-weight:600;color:var(--color-text-primary);width:80px">Status</th>
              <th style="padding:10px;text-align:center;font-weight:600;color:var(--color-text-primary);width:60px">Score</th>
              <th style="padding:10px;text-align:left;font-weight:600;color:var(--color-text-primary)">Matched Policies</th>
              <th style="padding:10px;text-align:left;font-weight:600;color:var(--color-text-primary)">Gap/Recommendation</th>
            </tr>
          </thead>
          <tbody>
            ${categoryEval.controls.map((control, i) => `
              <tr style="border-bottom:0.5px solid var(--color-border-tertiary);${i % 2 === 0 ? 'background:var(--color-background-primary)' : 'background:var(--color-background-secondary)'}">
                <td style="padding:10px;color:var(--color-text-primary);font-weight:700;font-family:monospace;vertical-align:top">${control.controlId}</td>
                <td style="padding:10px;color:var(--color-text-primary);font-weight:500;vertical-align:top">${control.name}</td>
                <td style="padding:10px;vertical-align:top">
                  <span style="display:inline-block;padding:3px 6px;border-radius:3px;font-size:10px;font-weight:600;background:${getSeverityBg(control.severity)};color:${getSeverityText(control.severity)}">
                    ${control.severity}
                  </span>
                </td>
                <td style="padding:10px;text-align:center;vertical-align:top">
                  <span style="display:inline-block;padding:4px 10px;border-radius:3px;font-size:10px;font-weight:600;background:${getStatusBg(control.status)};color:${getStatusText(control.status)}">
                    ${control.status}
                  </span>
                </td>
                <td style="padding:10px;text-align:center;font-weight:700;color:var(--color-text-primary);vertical-align:top">${control.score}/${getMaxScore(control.severity)}</td>
                <td style="padding:10px;font-size:10px;color:var(--color-text-secondary);vertical-align:top">
                  ${control.matchedPolicies.length > 0 ? control.matchedPolicies.map(p => `<span style="display:inline-block;background:var(--clr-success-bg);color:var(--clr-success-text);padding:3px 8px;border-radius:3px;margin-right:4px;margin-bottom:4px;font-weight:600">${p}</span>`).join('') : '<span style="color:var(--clr-danger-text);font-style:italic">No policies configured</span>'}
                </td>
                <td style="padding:10px;font-size:10px;line-height:1.5;color:var(--color-text-secondary);vertical-align:top">
                  ${control.missingCoverage.length > 0 ? `<div style="margin-bottom:6px"><strong style="color:var(--clr-danger-text)">Gap:</strong> ${control.missingCoverage.join(', ')}</div>` : '<div style="margin-bottom:6px"><strong style="color:var(--clr-success-text)">✓ No gaps</strong></div>'}
                  <div><strong style="color:var(--color-text-primary)">➜ ${control.recommendation}</strong></div>
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
      <div style="margin-top:16px;padding:12px;background:var(--color-background-secondary);border-radius:4px;display:grid;grid-template-columns:1fr 1fr 1fr;gap:16px;border:1px solid var(--color-border-tertiary)">
        <div style="font-size:12px">
          <div style="color:var(--color-text-secondary);margin-bottom:6px;font-weight:600">Category Score</div>
          <div style="font-size:20px;font-weight:700;color:var(--clr-primary)">${categoryEval.totalScore}/${categoryEval.maxScore}</div>
          <div style="font-size:10px;color:var(--color-text-tertiary);margin-top:4px">${Math.round(categoryEval.totalScore / categoryEval.maxScore * 100)}% of max</div>
        </div>
        <div style="font-size:12px">
          <div style="color:var(--color-text-secondary);margin-bottom:6px;font-weight:600">Controls Status</div>
          <div style="font-size:16px;font-weight:700">
            <span style="color:var(--clr-success-text);margin-right:8px">✓ ${categoryEval.controls.filter(c => c.status === 'Passed').length}</span>
            <span style="color:var(--clr-danger-text)">✗ ${categoryEval.controls.filter(c => c.status === 'Failed').length}</span>
          </div>
          <div style="font-size:10px;color:var(--color-text-tertiary);margin-top:4px">${categoryEval.controls.length} total controls</div>
        </div>
        <div style="font-size:12px">
          <div style="color:var(--color-text-secondary);margin-bottom:6px;font-weight:600">Coverage</div>
          <div style="font-size:20px;font-weight:700;color:${categoryEval.coverage >= 70 ? 'var(--clr-success-text)' : categoryEval.coverage >= 50 ? 'var(--clr-warning-text)' : 'var(--clr-danger-text)'}">${categoryEval.coverage}%</div>
          <div style="font-size:10px;color:var(--color-text-tertiary);margin-top:4px">${categoryEval.coverage >= 80 ? '🟢 Healthy' : categoryEval.coverage >= 60 ? '🟡 At Risk' : '🔴 Critical'}</div>
        </div>
      </div>
    </div>
  `
}

function renderComplianceTab(el, data) {
  if (!data) {
    el.innerHTML = `<div class="card" style="background:var(--clr-danger-bg);border-left:3px solid var(--clr-danger-text);padding:16px"><i class="fas fa-exclamation-circle"></i> No data available</div>`
    return
  }

  el.innerHTML = `
    <div class="card">
      <div class="card-header">
        <div class="card-title">Multi-Framework Compliance</div>
      </div>
      <div class="cap-grid">
        ${data.frameworks.map(fw => `
          <div style="padding:16px;background:var(--color-background-secondary);border:0.5px solid var(--color-border-tertiary);border-radius:4px">
            <div style="font-weight:600;font-size:13px;color:var(--color-text-primary);margin-bottom:8px">${fw.name}</div>
            <div style="font-size:24px;font-weight:700;color:var(--clr-primary);margin-bottom:4px">${fw.score}</div>
            <div style="font-size:12px;padding:4px 8px;background:${getGradeBackground(fw.grade)};color:${getGradeText(fw.grade)};border-radius:3px;width:fit-content;margin-bottom:8px;font-weight:600">${fw.grade}</div>
            <div class="score-bar">
              <div class="score-fill" style="width: ${fw.score}%"></div>
            </div>
          </div>
        `).join('')}
      </div>
    </div>

    ${data.insights ? `
      <div class="card">
        <div class="card-header">
          <div class="card-title">Framework Insights</div>
        </div>
        <div style="display:flex;flex-direction:column;gap:8px">
          ${data.insights.map(insight => `
            <div style="padding:8px;background:var(--color-background-secondary);border-left:3px solid var(--clr-primary);border-radius:4px;font-size:12px;color:var(--color-text-secondary)">${insight.message}</div>
          `).join('')}
        </div>
      </div>
    ` : ''}
  `
}

function renderControlsTab(el, data) {
  if (!data) {
    el.innerHTML = `<div class="card" style="background:var(--clr-danger-bg);border-left:3px solid var(--clr-danger-text);padding:16px"><i class="fas fa-exclamation-circle"></i> No data available</div>`
    return
  }

  el.innerHTML = `
    <div class="cap-grid">
      <div class="card">
        <div style="font-size:20px;font-weight:700;color:var(--clr-primary);margin-bottom:2px">${data.summary.total}</div>
        <div style="font-size:12px;color:var(--color-text-secondary)">Total</div>
      </div>
      <div class="card" style="background:var(--clr-success-bg);border-color:var(--clr-success-border)">
        <div style="font-size:20px;font-weight:700;color:var(--clr-success-text);margin-bottom:2px">${data.summary.compliant}</div>
        <div style="font-size:12px;color:var(--clr-success-text)">Compliant</div>
      </div>
      <div class="card" style="background:var(--clr-danger-bg);border-color:var(--clr-danger-border)">
        <div style="font-size:20px;font-weight:700;color:var(--clr-danger-text);margin-bottom:2px">${data.summary.nonCompliant}</div>
        <div style="font-size:12px;color:var(--clr-danger-text)">Non-Compliant</div>
      </div>
    </div>

    <div class="card">
      <div class="card-header">
        <div class="card-title">By Category</div>
      </div>
      <div style="display:flex;flex-direction:column;gap:12px">
        ${data.byCategory.map(cat => `
          <div style="padding:12px;background:var(--color-background-secondary);border:0.5px solid var(--color-border-tertiary);border-radius:4px">
            <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px">
              <div style="font-weight:600;font-size:13px;color:var(--color-text-primary)">${cat.category}</div>
              <div style="font-size:12px;color:var(--color-text-secondary)">${cat.compliant}/${cat.total}</div>
            </div>
            <div class="score-bar">
              <div class="score-fill" style="width: ${(cat.compliant / cat.total * 100)}%; background: ${cat.status === 'PASS' ? 'var(--clr-success-text)' : 'var(--clr-danger-text)'}"></div>
            </div>
          </div>
        `).join('')}
      </div>
    </div>

    ${data.criticalGaps.length > 0 ? `
      <div class="card" style="border-left:3px solid var(--clr-danger-text)">
        <div class="card-header">
          <div class="card-title"><i class="fas fa-exclamation-triangle"></i> Critical Gaps</div>
        </div>
        <div style="display:flex;flex-direction:column;gap:12px">
          ${data.criticalGaps.map(gap => `
            <div style="padding:12px;background:var(--clr-danger-bg);border:0.5px solid var(--clr-danger-border);border-radius:4px">
              <div style="font-weight:600;color:var(--clr-danger-text);margin-bottom:4px">${gap.id}: ${gap.name}</div>
              <div style="font-size:12px;color:var(--color-text-secondary)">${gap.description}</div>
            </div>
          `).join('')}
        </div>
      </div>
    ` : ''}
  `
}

function renderRiskTab(el, data) {
  if (!data) {
    el.innerHTML = `<div class="card" style="background:var(--clr-danger-bg);border-left:3px solid var(--clr-danger-text);padding:16px"><i class="fas fa-exclamation-circle"></i> No data available</div>`
    return
  }

  el.innerHTML = `
    <div class="card">
      <div class="card-header">
        <div class="card-title">Risk Matrix</div>
      </div>
      <div class="cap-grid">
        <div style="padding:16px;background:var(--clr-danger-bg);border:0.5px solid var(--clr-danger-border);border-radius:4px;text-align:center">
          <div style="font-size:20px;font-weight:700;color:var(--clr-danger-text)">${data.riskMatrix.critical.count}</div>
          <div style="font-size:12px;color:var(--clr-danger-text);margin-top:4px">Critical</div>
          <div style="font-size:11px;color:var(--color-text-secondary);margin-top:6px">${data.riskMatrix.critical.timeToFix}</div>
        </div>
        <div style="padding:16px;background:var(--clr-warning-bg);border:0.5px solid var(--clr-warning-border);border-radius:4px;text-align:center">
          <div style="font-size:20px;font-weight:700;color:var(--clr-warning-text)">${data.riskMatrix.high.count}</div>
          <div style="font-size:12px;color:var(--clr-warning-text);margin-top:4px">High</div>
          <div style="font-size:11px;color:var(--color-text-secondary);margin-top:6px">${data.riskMatrix.high.timeToFix}</div>
        </div>
        <div style="padding:16px;background:#fef3c7;border:0.5px solid #fcd34d;border-radius:4px;text-align:center">
          <div style="font-size:20px;font-weight:700;color:#92400e">${data.riskMatrix.medium.count}</div>
          <div style="font-size:12px;color:#92400e;margin-top:4px">Medium</div>
          <div style="font-size:11px;color:var(--color-text-secondary);margin-top:6px">${data.riskMatrix.medium.timeToFix}</div>
        </div>
        <div style="padding:16px;background:var(--clr-success-bg);border:0.5px solid var(--clr-success-border);border-radius:4px;text-align:center">
          <div style="font-size:20px;font-weight:700;color:var(--clr-success-text)">${data.riskMatrix.low.count}</div>
          <div style="font-size:12px;color:var(--clr-success-text);margin-top:4px">Low</div>
          <div style="font-size:11px;color:var(--color-text-secondary);margin-top:6px">${data.riskMatrix.low.timeToFix}</div>
        </div>
      </div>
    </div>

    ${data.topRisks.length > 0 ? `
      <div class="card">
        <div class="card-header">
          <div class="card-title">Top Risks</div>
        </div>
        <div style="display:flex;flex-direction:column;gap:12px">
          ${data.topRisks.map(risk => `
            <div style="padding:12px;background:var(--color-background-secondary);border-left:3px solid var(--clr-danger-text);border-radius:4px">
              <div style="font-weight:600;font-size:13px;color:var(--color-text-primary);margin-bottom:4px">${risk.controlId}: ${risk.name}</div>
              <div style="font-size:12px;color:var(--color-text-secondary)">${risk.description}</div>
            </div>
          `).join('')}
        </div>
      </div>
    ` : ''}
  `
}

function renderRemediationTab(el, data) {
  if (!data) {
    el.innerHTML = `<div class="card" style="background:var(--clr-danger-bg);border-left:3px solid var(--clr-danger-text);padding:16px"><i class="fas fa-exclamation-circle"></i> No data available</div>`
    return
  }

  el.innerHTML = `
    <div class="cap-grid">
      <div class="card">
        <div style="font-size:20px;font-weight:700;color:var(--clr-primary);margin-bottom:2px">${data.summary.total}</div>
        <div style="font-size:12px;color:var(--color-text-secondary)">Total</div>
      </div>
      <div class="card" style="background:var(--clr-success-bg);border-color:var(--clr-success-border)">
        <div style="font-size:20px;font-weight:700;color:var(--clr-success-text);margin-bottom:2px">${data.summary.successful}</div>
        <div style="font-size:12px;color:var(--clr-success-text)">Successful</div>
      </div>
      <div class="card" style="background:#fef3c7;border-color:#fcd34d">
        <div style="font-size:20px;font-weight:700;color:#92400e;margin-bottom:2px">${data.summary.partial}</div>
        <div style="font-size:12px;color:#92400e">Partial</div>
      </div>
      <div class="card" style="background:var(--clr-danger-bg);border-color:var(--clr-danger-border)">
        <div style="font-size:20px;font-weight:700;color:var(--clr-danger-text);margin-bottom:2px">${data.summary.failed}</div>
        <div style="font-size:12px;color:var(--clr-danger-text)">Failed</div>
      </div>
    </div>

    <div class="card">
      <div class="card-header">
        <div class="card-title">Success Rate</div>
      </div>
      <div style="display:flex;align-items:center;gap:16px">
        <div style="font-size:32px;font-weight:700;color:var(--clr-primary);min-width:60px">${data.summary.successRate}%</div>
        <div class="score-bar" style="flex:1;height:8px">
          <div class="score-fill" style="width: ${data.summary.successRate}%"></div>
        </div>
      </div>
    </div>

    ${data.recentRemediations.length > 0 ? `
      <div class="card">
        <div class="card-header">
          <div class="card-title">Recent Remediations</div>
        </div>
        <div style="display:flex;flex-direction:column;gap:12px">
          ${data.recentRemediations.map(rem => `
            <div style="padding:12px;background:var(--color-background-secondary);border:0.5px solid var(--color-border-tertiary);border-radius:4px;display:flex;justify-content:space-between;align-items:center">
              <div>
                <div style="font-weight:600;font-size:13px;color:var(--color-text-primary)">${rem.controlId}</div>
                <div style="font-size:11px;color:var(--color-text-secondary);margin-top:4px">${new Date(rem.timestamp).toLocaleDateString()} ${rem.dryRun ? '• Dry Run' : ''}</div>
              </div>
              <div style="font-size:11px;padding:4px 8px;background:${rem.status === 'SUCCESS' ? 'var(--clr-success-bg)' : 'var(--clr-danger-bg)'};color:${rem.status === 'SUCCESS' ? 'var(--clr-success-text)' : 'var(--clr-danger-text)'};border-radius:3px;font-weight:600">${rem.status}</div>
            </div>
          `).join('')}
        </div>
      </div>
    ` : ''}
  `
}

function renderDriftTab(el, data) {
  if (!data) {
    el.innerHTML = `<div class="card" style="background:var(--clr-danger-bg);border-left:3px solid var(--clr-danger-text);padding:16px"><i class="fas fa-exclamation-circle"></i> No data available</div>`
    return
  }

  el.innerHTML = `
    <div class="card" style="background:${data.driftDetected ? 'var(--clr-danger-bg)' : 'var(--clr-success-bg)'};border:0.5px solid ${data.driftDetected ? 'var(--clr-danger-border)' : 'var(--clr-success-border)'};border-left:3px solid ${data.driftDetected ? 'var(--clr-danger-text)' : 'var(--clr-success-text)'}">
      <div class="card-header">
        <div class="card-title">${data.driftDetected ? '<i class="fas fa-exclamation-triangle"></i> Drift Detected' : '<i class="fas fa-check-circle"></i> No Drift'}</div>
      </div>
      <div style="font-size:13px;color:${data.driftDetected ? 'var(--clr-danger-text)' : 'var(--clr-success-text)'};line-height:1.5">
        ${data.driftDetected ? 'Configuration changes detected that may impact policies' : 'All policies are in sync with expected configuration'}
      </div>
    </div>

    <div class="cap-grid">
      <div class="card" style="background:var(--clr-danger-bg);border-color:var(--clr-danger-border)">
        <div style="font-size:20px;font-weight:700;color:var(--clr-danger-text);margin-bottom:2px">${data.alerts.active}</div>
        <div style="font-size:12px;color:var(--clr-danger-text)">Active Drifts</div>
      </div>
      <div class="card" style="background:var(--clr-success-bg);border-color:var(--clr-success-border)">
        <div style="font-size:20px;font-weight:700;color:var(--clr-success-text);margin-bottom:2px">${data.policies ? data.policies.length : 0}</div>
        <div style="font-size:12px;color:var(--clr-success-text)">Total Policies</div>
      </div>
    </div>

    ${data.policies && data.policies.length > 0 ? `
      <div class="card">
        <div class="card-header">
          <div class="card-title"><i class="fas fa-layer-group"></i> Conditional Access Policies - Configuration & Drift</div>
        </div>
        <div style="overflow-x:auto;font-size:11px">
          <table style="width:100%;border-collapse:collapse">
            <thead>
              <tr style="background:var(--color-background-secondary);border-bottom:1px solid var(--color-border-tertiary)">
                <th style="padding:10px;text-align:left;font-weight:600;color:var(--color-text-primary);width:180px">Policy Name</th>
                <th style="padding:10px;text-align:left;font-weight:600;color:var(--color-text-primary)">Configuration</th>
                <th style="padding:10px;text-align:center;font-weight:600;color:var(--color-text-primary);width:120px">Drift Status</th>
                <th style="padding:10px;text-align:left;font-weight:600;color:var(--color-text-primary);width:150px">Changed Control</th>
              </tr>
            </thead>
            <tbody>
              ${data.policies.map((policy, idx) => `
                <tr style="border-bottom:0.5px solid var(--color-border-tertiary);${idx % 2 === 0 ? 'background:var(--color-background-primary)' : 'background:var(--color-background-secondary)'}">
                  <td style="padding:10px;vertical-align:top;font-weight:600;color:var(--color-text-primary)">
                    <div>${policy.displayName}</div>
                    <div style="font-size:10px;color:var(--color-text-tertiary);margin-top:3px">${policy.policyId}</div>
                  </td>
                  <td style="padding:10px;vertical-align:top;color:var(--color-text-secondary)">
                    <div style="display:flex;flex-wrap:wrap;gap:6px">
                      ${Object.entries(policy.configuration).map(([key, value]) => `
                        <span style="display:inline-block;background:var(--color-background-secondary);border:0.5px solid var(--color-border-tertiary);padding:4px 8px;border-radius:3px;font-size:10px;white-space:nowrap">
                          <strong>${key}:</strong> ${String(value).substring(0, 30)}${String(value).length > 30 ? '...' : ''}
                        </span>
                      `).join('')}
                    </div>
                  </td>
                  <td style="padding:10px;text-align:center;vertical-align:top">
                    ${policy.driftDetected ? `
                      <span style="display:inline-block;background:var(--clr-danger-bg);color:var(--clr-danger-text);padding:4px 8px;border-radius:3px;font-weight:600;font-size:10px">
                        <i class="fas fa-exclamation-circle"></i> Drift
                      </span>
                    ` : `
                      <span style="display:inline-block;background:var(--clr-success-bg);color:var(--clr-success-text);padding:4px 8px;border-radius:3px;font-weight:600;font-size:10px">
                        <i class="fas fa-check-circle"></i> Synced
                      </span>
                    `}
                  </td>
                  <td style="padding:10px;vertical-align:top;color:var(--color-text-secondary)">
                    ${policy.changedControl ? `
                      <div style="background:var(--clr-warning-bg);border-left:3px solid var(--clr-warning-text);padding:6px;border-radius:3px">
                        <div style="font-weight:600;color:var(--clr-warning-text);font-size:10px;margin-bottom:3px">
                          ${policy.changedControl}
                        </div>
                        <div style="font-size:9px;color:var(--color-text-secondary)">
                          <div><strong>Previous:</strong> ${policy.previousValue}</div>
                          <div><strong>Current:</strong> ${policy.currentValue}</div>
                        </div>
                      </div>
                    ` : `
                      <span style="color:var(--color-text-tertiary);font-style:italic">No changes</span>
                    `}
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>
    ` : ''}

    ${data.recentAlerts && data.recentAlerts.length > 0 ? `
      <div class="card">
        <div class="card-header">
          <div class="card-title">Recent Alerts</div>
        </div>
        <div style="display:flex;flex-direction:column;gap:12px">
          ${data.recentAlerts.map(alert => `
            <div style="padding:12px;background:var(--color-background-secondary);border-left:3px solid ${alert.severity === 'HIGH' ? 'var(--clr-danger-text)' : '#fbbf24'};border-radius:4px">
              <div style="font-weight:600;font-size:13px;color:var(--color-text-primary);margin-bottom:4px">${alert.type}</div>
              <div style="font-size:12px;color:var(--color-text-secondary);margin-bottom:6px">${alert.message}</div>
              <div style="font-size:11px;color:var(--color-text-tertiary)">${new Date(alert.timestamp).toLocaleString()}</div>
            </div>
          `).join('')}
        </div>
      </div>
    ` : ''}
  `
}

function getRiskColor(level) {
  const colors = {
    'LOW': '#dcfce7',
    'MEDIUM': '#fef3c7',
    'HIGH': '#fed7aa',
    'CRITICAL': '#fee2e2'
  }
  return colors[level] || '#f3f4f6'
}

function getRiskBackground(level) {
  const map = {
    'LOW': 'var(--clr-success-bg)',
    'MEDIUM': '#fef3c7',
    'HIGH': 'var(--clr-warning-bg)',
    'CRITICAL': 'var(--clr-danger-bg)'
  }
  return map[level] || 'var(--color-background-secondary)'
}

function getRiskText(level) {
  const map = {
    'LOW': 'var(--clr-success-text)',
    'MEDIUM': '#92400e',
    'HIGH': 'var(--clr-warning-text)',
    'CRITICAL': 'var(--clr-danger-text)'
  }
  return map[level] || 'var(--color-text-primary)'
}

function getPillarColor(status) {
  const colors = {
    'HEALTHY': '#22c55e',
    'WARNING': '#eab308',
    'CRITICAL': '#ef4444'
  }
  return colors[status] || '#6b7280'
}

function getPillarBorderColor(status) {
  const map = {
    'HEALTHY': 'var(--clr-success-text)',
    'WARNING': '#fbbf24',
    'CRITICAL': 'var(--clr-danger-text)'
  }
  return map[status] || 'var(--clr-primary)'
}

function getGradeColor(grade) {
  const colors = {
    'A': '#dcfce7',
    'B': '#dbeafe',
    'C': '#fef3c7',
    'D': '#fed7aa',
    'F': '#fee2e2'
  }
  return colors[grade] || '#f3f4f6'
}

function getGradeBackground(grade) {
  const map = {
    'A': 'var(--clr-success-bg)',
    'B': '#dbeafe',
    'C': '#fef3c7',
    'D': 'var(--clr-warning-bg)',
    'F': 'var(--clr-danger-bg)'
  }
  return map[grade] || 'var(--color-background-secondary)'
}

function getGradeText(grade) {
  const map = {
    'A': 'var(--clr-success-text)',
    'B': '#0369a1',
    'C': '#92400e',
    'D': 'var(--clr-warning-text)',
    'F': 'var(--clr-danger-text)'
  }
  return map[grade] || 'var(--color-text-primary)'
}

function getPillarDescription(pillar) {
  const descriptions = {
    'Identity': 'User verification, MFA, and authentication policies',
    'Device': 'Device compliance and security state validation',
    'Network': 'Network segmentation and access control',
    'Application': 'App permissions, data protection, encryption',
    'Session': 'Active session monitoring and anomaly detection',
    'Governance': 'Policy enforcement and compliance requirements',
    'Monitoring': 'Threat detection and incident response'
  }
  return descriptions[pillar] || 'Zero Trust security domain'
}

function getSeverityBg(severity) {
  const map = {
    'Critical': 'var(--clr-danger-bg)',
    'High': 'var(--clr-warning-bg)',
    'Medium': '#fef3c7',
    'Low': 'var(--clr-success-bg)'
  }
  return map[severity] || 'var(--color-background-secondary)'
}

function getSeverityText(severity) {
  const map = {
    'Critical': 'var(--clr-danger-text)',
    'High': 'var(--clr-warning-text)',
    'Medium': '#92400e',
    'Low': 'var(--clr-success-text)'
  }
  return map[severity] || 'var(--color-text-primary)'
}

function getStatusBg(status) {
  const map = {
    'Passed': 'var(--clr-success-bg)',
    'Failed': 'var(--clr-danger-bg)',
    'Partial': '#fef3c7',
    'NotEvaluated': 'var(--color-background-tertiary)'
  }
  return map[status] || 'var(--color-background-secondary)'
}

function getStatusText(status) {
  const map = {
    'Passed': 'var(--clr-success-text)',
    'Failed': 'var(--clr-danger-text)',
    'Partial': '#92400e',
    'NotEvaluated': 'var(--color-text-secondary)'
  }
  return map[status] || 'var(--color-text-primary)'
}

function getMaxScore(severity) {
  const map = {
    'Critical': 10,
    'High': 8,
    'Medium': 5,
    'Low': 3
  }
  return map[severity] || 10
}

function getControlEvaluation(data) {
  if (!data) return null
  if (currentCategory === 'CA-CAT-01') return data.controlEvaluationCategory1
  if (currentCategory === 'CA-CAT-02') return data.controlEvaluation
  if (currentCategory === 'CA-CAT-03') return data.controlEvaluationCategory3
  if (currentCategory === 'CA-CAT-04') return data.controlEvaluationCategory4
  if (currentCategory === 'CA-CAT-05') return data.controlEvaluationCategory5
  if (currentCategory === 'CA-CAT-06') return data.controlEvaluationCategory6
  if (currentCategory === 'CA-CAT-07') return data.controlEvaluationCategory7
  if (currentCategory === 'CA-CAT-08') return data.controlEvaluationCategory8
  if (currentCategory === 'CA-CAT-09') return data.controlEvaluationCategory9
  if (currentCategory === 'CA-CAT-10') return data.controlEvaluationCategory10
  if (currentCategory === 'CA-CAT-11') return data.controlEvaluationCategory11
  if (currentCategory === 'CA-CAT-12') return data.controlEvaluationCategory12
  return null
}
