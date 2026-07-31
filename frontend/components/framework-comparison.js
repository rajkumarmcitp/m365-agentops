// ============================================================
// Framework Comparison Component
// Displays frameworks as tabs with controls listing
// ============================================================

let currentFramework = null
let allControls = []
let frameworkControls = {}

export function renderFrameworkComparison(container, frameworks, validationMap = {}) {
  if (!container || !frameworks) return

  // Sort frameworks by score (descending)
  const sortedFrameworks = Object.entries(frameworks)
    .sort(([, a], [, b]) => b.score - a.score)
    .map(([name, data]) => ({ name, ...data }))

  // Set default framework to first one
  currentFramework = sortedFrameworks[0]?.name || 'CIS M365'

  const html = `
    <div class="framework-comparison">
      <!-- Framework Tabs -->
      <div class="framework-tabs-container">
        <div class="framework-tabs">
          ${sortedFrameworks.map((fw, idx) => `
            <button class="framework-tab ${idx === 0 ? 'active' : ''}" data-framework="${fw.name}">
              <span class="framework-tab-name">${fw.name}</span>
              <span class="framework-tab-score">${fw.score.toFixed(1)}%</span>
            </button>
          `).join('')}
        </div>
      </div>

      <!-- Framework Summary Cards (Summary View) -->
      <div id="framework-summary" class="framework-summary-view">
        <div class="comparison-header">
          <h2>Framework Compliance</h2>
          <span class="comparison-subtitle">Across ${sortedFrameworks.length} compliance frameworks</span>
        </div>

        <div class="frameworks-grid">
          ${sortedFrameworks.map((fw, idx) => renderFrameworkRow(fw, idx)).join('')}
        </div>

        <div class="framework-legend">
          <div class="legend-item">
            <span class="legend-color" style="background: #10b981"></span>
            <span>Good (80-100%)</span>
          </div>
          <div class="legend-item">
            <span class="legend-color" style="background: #3b82f6"></span>
            <span>Acceptable (70-79%)</span>
          </div>
          <div class="legend-item">
            <span class="legend-color" style="background: #f59e0b"></span>
            <span>Needs Work (60-69%)</span>
          </div>
          <div class="legend-item">
            <span class="legend-color" style="background: #ef4444"></span>
            <span>Critical (<60%)</span>
          </div>
        </div>
      </div>

      <!-- Framework Details View (Controls List) -->
      <div id="framework-details" class="framework-details-view" style="display: none;">
        <div class="framework-details-header">
          <h2 id="selected-framework-title"></h2>
          <span id="selected-framework-count" class="framework-control-count"></span>
        </div>
        <div id="framework-controls-list"></div>
      </div>
    </div>
  `

  container.innerHTML = html
  attachFrameworkTabListeners(sortedFrameworks, validationMap)
  addFrameworkStyles()
}

/**
 * Attach listeners to framework tabs
 */
function attachFrameworkTabListeners(frameworks, validationMap) {
  const tabs = document.querySelectorAll('.framework-tab')
  const summaryView = document.getElementById('framework-summary')
  const detailsView = document.getElementById('framework-details')
  const controlsList = document.getElementById('framework-controls-list')

  tabs.forEach(tab => {
    tab.addEventListener('click', async () => {
      const frameworkName = tab.dataset.framework
      currentFramework = frameworkName

      // Update active tab styling
      tabs.forEach(t => t.classList.remove('active'))
      tab.classList.add('active')

      // Show details view, hide summary
      summaryView.style.display = 'none'
      detailsView.style.display = 'block'

      // Update framework details
      const framework = frameworks[frameworkName]
      document.getElementById('selected-framework-title').textContent = frameworkName
      document.getElementById('selected-framework-count').textContent = `${framework?.totalControls || 0} controls`

      // Load and display framework controls
      await renderFrameworkControls(frameworkName, validationMap)
    })
  })
}

/**
 * Render controls for selected framework
 */
async function renderFrameworkControls(frameworkName, validationMap) {
  const controlsList = document.getElementById('framework-controls-list')

  try {
    // Fetch controls for the framework
    const response = await fetch(`http://localhost:3000/api/controls/by-framework/${frameworkName}`)
      .then(r => r.json())
      .catch(() => ({ success: false, controls: [] }))

    if (response.success && response.controls) {
      frameworkControls = response.controls
    } else {
      frameworkControls = []
    }

    // Fetch all validation data to match against framework controls
    const validationRes = await fetch('http://localhost:3000/api/validation/validate-all', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ tenantId: 'demo-tenant' })
    }).then(r => r.json()).catch(() => ({ success: false }))

    let frameworkValidationMap = {}
    if (validationRes.success && validationRes.data && validationRes.data.results) {
      // Build validation map for all results
      validationRes.data.results.forEach(result => {
        frameworkValidationMap[result.controlId] = {
          status: result.status,
          message: result.message,
          severity: result.severity
        }
      })
      console.log(`✅ Loaded ${Object.keys(frameworkValidationMap).length} validation results for framework controls`)
    }

    // Render controls table with both database controls and validation data
    renderFrameworkControlsTable(controlsList, frameworkControls, frameworkValidationMap)
  } catch (err) {
    console.error('Error loading framework controls:', err)
    controlsList.innerHTML = '<p style="padding: 20px; color: #ef4444;">Error loading controls</p>'
  }
}

/**
 * Render controls table for framework
 */
function renderFrameworkControlsTable(container, controls, validationMap) {
  if (!controls || controls.length === 0) {
    container.innerHTML = '<p style="padding: 20px; text-align: center; color: #6b7280;">No controls found for this framework</p>'
    return
  }

  const tableHtml = `
    <div class="framework-controls-table-wrapper">
      <div class="framework-controls-info">
        Showing ${controls.length} controls
      </div>
      <table class="controls-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Control Name</th>
            <th>Severity</th>
            <th>Status</th>
            <th>Score</th>
            <th>Validation</th>
            <th>Details</th>
          </tr>
        </thead>
        <tbody>
          ${controls.map(control => {
            const validation = validationMap[control.id] || {}
            let status = control.status || 'UNKNOWN'
            let score = control.score || 0

            if (validation.status) {
              status = validation.status.toUpperCase()
              score = validation.status === 'pass' ? 100 : validation.status === 'fail' ? 0 : 50
            }

            return `
              <tr class="control-row">
                <td class="control-id">${control.id}</td>
                <td class="control-name">${control.name}</td>
                <td class="control-severity">
                  <span class="status-badge ${getStatusClass(control.severity)}">
                    ${getSeverityIcon(control.severity)} ${control.severity}
                  </span>
                </td>
                <td class="control-status">
                  <span class="status-badge ${getStatusClass(status)}">
                    ${getStatusIcon(status)} ${status}
                  </span>
                </td>
                <td class="control-score">
                  <span class="score ${getScoreClass(score)}">${score}%</span>
                </td>
                <td class="control-validation">${control.validationMethod || 'Graph API'}</td>
                <td class="control-details">
                  <button class="btn btn-mini" onclick="window.showControlDetail('${control.id}')">View</button>
                </td>
              </tr>
            `
          }).join('')}
        </tbody>
      </table>
    </div>
  `

  container.innerHTML = tableHtml
}

/**
 * Get status class for styling
 */
function getStatusClass(value) {
  const statusMap = {
    'pass': 'success',
    'fail': 'danger',
    'partial': 'warning',
    'unknown': 'info',
    'critical': 'danger',
    'high': 'warning',
    'medium': 'warning',
    'low': 'info'
  }
  return statusMap[value?.toLowerCase()] || 'info'
}

/**
 * Get severity icon
 */
function getSeverityIcon(severity) {
  const icons = {
    'Critical': '🔴',
    'High': '🟠',
    'Medium': '🟡',
    'Low': '🟢'
  }
  return icons[severity] || '⚪'
}

/**
 * Get status icon
 */
function getStatusIcon(status) {
  const icons = {
    'PASS': '✓',
    'FAIL': '✗',
    'PARTIAL': '⚠',
    'UNKNOWN': '?'
  }
  return icons[status] || '?'
}

/**
 * Get score class for styling
 */
function getScoreClass(score) {
  if (score >= 80) return 'score-excellent'
  if (score >= 60) return 'score-good'
  if (score >= 40) return 'score-fair'
  return 'score-poor'
}

/**
 * Render a single framework row
 */
function renderFrameworkRow(framework, index) {
  const progressColor = getFrameworkColor(framework.score)
  const statusText = getFrameworkStatus(framework.score)
  const statusIcon = getFrameworkStatusIcon(framework.status)

  return `
    <div class="framework-row" style="animation-delay: ${index * 50}ms">
      <div class="framework-name">
        <h3>${framework.name}</h3>
        <span class="control-count">${framework.totalControls} controls</span>
      </div>

      <div class="framework-progress">
        <div class="progress-bar">
          <div class="progress-fill" style="width: ${framework.score}%; background-color: ${progressColor}"></div>
        </div>
      </div>

      <div class="framework-score">
        <span class="score-value" style="color: ${progressColor}">
          ${framework.score.toFixed(1)}%
        </span>
        <span class="score-status" title="${framework.status}">
          ${statusIcon}
        </span>
      </div>

      <div class="framework-stats">
        <div class="stat">
          <span class="stat-label">Passed:</span>
          <span class="stat-value">${framework.passed}</span>
        </div>
        <div class="stat">
          <span class="stat-label">Failed:</span>
          <span class="stat-value" style="color: #ef4444">${framework.failed}</span>
        </div>
      </div>
    </div>
  `
}

/**
 * Get color for framework score
 */
function getFrameworkColor(score) {
  if (score >= 80) return '#10b981' // Green
  if (score >= 70) return '#3b82f6' // Blue
  if (score >= 60) return '#f59e0b' // Amber
  return '#ef4444' // Red
}

/**
 * Get status text for framework score
 */
function getFrameworkStatus(score) {
  if (score >= 90) return 'Excellent'
  if (score >= 80) return 'Good'
  if (score >= 70) return 'Fair'
  if (score >= 60) return 'Poor'
  return 'Critical'
}

/**
 * Get icon for framework status
 */
function getFrameworkStatusIcon(status) {
  switch (status) {
    case 'Excellent': return '⭐'
    case 'Good': return '✅'
    case 'Fair': return '⚠️'
    case 'Poor': return '❌'
    case 'Critical': return '🚨'
    default: return '❓'
  }
}

/**
 * Add component styles
 */
function addFrameworkStyles() {
  if (document.getElementById('framework-comparison-styles')) return

  const styles = `
    <style id="framework-comparison-styles">
      .framework-comparison {
        background: var(--color-bg-primary, #ffffff);
        border: 1px solid var(--color-border-primary, #e5e7eb);
        border-radius: 12px;
        padding: 24px;
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
      }

      /* Framework Tabs */
      .framework-tabs-container {
        margin-bottom: 24px;
        border-bottom: 2px solid var(--color-border-primary, #e5e7eb);
        overflow-x: auto;
      }

      .framework-tabs {
        display: flex;
        gap: 4px;
        flex-wrap: nowrap;
      }

      .framework-tab {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 6px;
        padding: 12px 16px;
        border: none;
        background: transparent;
        color: var(--color-text-secondary, #6b7280);
        cursor: pointer;
        border-bottom: 3px solid transparent;
        transition: all 200ms ease;
        font-size: 13px;
        font-weight: 600;
        white-space: nowrap;
      }

      .framework-tab:hover {
        color: var(--color-text-primary, #111827);
        background: rgba(59, 130, 246, 0.05);
      }

      .framework-tab.active {
        color: var(--color-primary-500, #0099ff);
        border-bottom-color: var(--color-primary-500, #0099ff);
      }

      .framework-tab-name {
        font-weight: 600;
      }

      .framework-tab-score {
        font-size: 11px;
        font-weight: 500;
        opacity: 0.8;
      }

      /* Framework Views */
      .framework-summary-view {
        display: block;
      }

      .framework-details-view {
        display: none;
      }

      .framework-details-header {
        margin-bottom: 20px;
      }

      .framework-details-header h2 {
        font-size: 18px;
        font-weight: 600;
        color: var(--color-text-primary, #111827);
        margin: 0 0 8px 0;
      }

      .framework-control-count {
        font-size: 13px;
        color: var(--color-text-secondary, #6b7280);
      }

      .framework-controls-table-wrapper {
        border: 1px solid var(--color-border-primary, #e5e7eb);
        border-radius: 8px;
        overflow: hidden;
      }

      .framework-controls-info {
        padding: 12px 16px;
        background: var(--color-bg-secondary, #f9fafb);
        font-size: 12px;
        color: var(--color-text-secondary, #6b7280);
        border-bottom: 1px solid var(--color-border-primary, #e5e7eb);
      }

      .comparison-header {
        margin-bottom: 24px;
      }

      .comparison-header h2 {
        font-size: 18px;
        font-weight: 600;
        color: var(--color-text-primary, #111827);
        margin: 0 0 8px 0;
      }

      .comparison-subtitle {
        font-size: 13px;
        color: var(--color-text-secondary, #6b7280);
      }

      .frameworks-grid {
        display: grid;
        grid-template-columns: 1fr;
        gap: 16px;
        margin-bottom: 24px;
      }

      .framework-row {
        display: grid;
        grid-template-columns: 120px 1fr 100px 140px;
        gap: 16px;
        align-items: center;
        padding: 12px;
        border: 1px solid var(--color-border-primary, #e5e7eb);
        border-radius: 8px;
        background: var(--color-bg-secondary, #f9fafb);
        transition: all 200ms ease;
        animation: slideIn 300ms ease forwards;
        opacity: 0;
      }

      @keyframes slideIn {
        from {
          opacity: 0;
          transform: translateX(-10px);
        }
        to {
          opacity: 1;
          transform: translateX(0);
        }
      }

      .framework-row:hover {
        background: var(--color-bg-primary, #ffffff);
        border-color: var(--color-border-active, #3b82f6);
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
      }

      .framework-name h3 {
        font-size: 14px;
        font-weight: 600;
        color: var(--color-text-primary, #111827);
        margin: 0;
      }

      .control-count {
        display: block;
        font-size: 12px;
        color: var(--color-text-secondary, #6b7280);
        margin-top: 4px;
      }

      .framework-progress {
        display: flex;
        align-items: center;
      }

      .progress-bar {
        width: 100%;
        height: 8px;
        background: var(--color-bg-tertiary, #e5e7eb);
        border-radius: 4px;
        overflow: hidden;
      }

      .progress-fill {
        height: 100%;
        border-radius: 4px;
        transition: width 300ms ease;
      }

      .framework-score {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 4px;
      }

      .score-value {
        font-size: 18px;
        font-weight: bold;
        font-variant-numeric: tabular-nums;
      }

      .score-status {
        font-size: 16px;
      }

      .framework-stats {
        display: flex;
        gap: 16px;
      }

      .stat {
        display: flex;
        flex-direction: column;
        align-items: center;
      }

      .stat-label {
        font-size: 11px;
        color: var(--color-text-secondary, #6b7280);
        font-weight: 500;
      }

      .stat-value {
        font-size: 14px;
        font-weight: 600;
        color: var(--color-text-primary, #111827);
        font-variant-numeric: tabular-nums;
      }

      .framework-legend {
        display: flex;
        flex-wrap: wrap;
        gap: 24px;
        padding: 16px;
        background: var(--color-bg-secondary, #f9fafb);
        border-radius: 8px;
      }

      .legend-item {
        display: flex;
        align-items: center;
        gap: 8px;
        font-size: 12px;
        color: var(--color-text-secondary, #6b7280);
      }

      .legend-color {
        display: inline-block;
        width: 12px;
        height: 12px;
        border-radius: 2px;
      }

      /* Responsive */
      @media (max-width: 1024px) {
        .framework-row {
          grid-template-columns: 100px 1fr 80px;
          gap: 12px;
        }

        .framework-stats {
          display: none;
        }
      }

      @media (max-width: 768px) {
        .framework-row {
          grid-template-columns: 1fr auto;
          gap: 12px;
          padding: 12px;
        }

        .framework-progress {
          grid-column: 1 / -1;
        }

        .framework-name {
          grid-column: 1 / -1;
        }

        .framework-score {
          flex-direction: row;
          gap: 8px;
        }

        .framework-legend {
          gap: 12px;
        }
      }
    </style>
  `

  document.head.insertAdjacentHTML('beforeend', styles)
}

/**
 * Update comparison with new data
 */
export function updateFrameworkComparison(container, frameworks) {
  renderFrameworkComparison(container, frameworks)
}
