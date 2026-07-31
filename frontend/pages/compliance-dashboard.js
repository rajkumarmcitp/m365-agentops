// ============================================================
// Compliance Dashboard Page
// Main dashboard for M365 AgentOps compliance engine
// ============================================================

import { complianceApi } from '../lib/compliance-api-client.js'
import { renderComplianceScoreCard } from '../components/compliance-score-card.js'
import { renderFrameworkComparison } from '../components/framework-comparison.js'
import { renderDomainBreakdown } from '../components/domain-breakdown.js'
import { renderDriftAlerts } from '../components/drift-alerts.js'
import { renderTrendChart } from '../components/trend-chart.js'
import { renderRecommendationsPanel } from '../components/recommendations-panel.js'
import { renderControlsList } from '../components/controls-list.js'

// State
let dashboardState = {
  tenantId: null,
  loading: true,
  error: null,
  data: null,
  lastUpdated: null,
  refreshInterval: 300000, // 5 minutes
}

// Page initialization
export function initComplianceDashboard() {
  const container = document.getElementById('page-compliance-dashboard')
  if (!container) {
    console.error('❌ page-compliance-dashboard container not found')
    return
  }

  // Get tenant from URL or session
  dashboardState.tenantId = getTenantId()

  if (!dashboardState.tenantId) {
    renderError(container, 'No tenant configured. Please select a tenant.')
    return
  }

  renderDashboardLayout(container)
  loadDashboardData()

  // Auto-refresh every 5 minutes
  setInterval(() => {
    console.log('🔄 Auto-refreshing compliance dashboard...')
    loadDashboardData()
  }, dashboardState.refreshInterval)
}

/**
 * Get tenant ID from URL, localStorage, or environment
 */
function getTenantId() {
  // Check URL params
  const urlParams = new URLSearchParams(window.location.search)
  if (urlParams.has('tenantId')) {
    return urlParams.get('tenantId')
  }

  // Check localStorage
  const stored = localStorage.getItem('selectedTenantId')
  if (stored) {
    return stored
  }

  // Check window global
  if (window.TENANT_ID) {
    return window.TENANT_ID
  }

  return null
}

/**
 * Render dashboard layout
 */
function renderDashboardLayout(container) {
  const html = `
    <div class="compliance-dashboard">
      <!-- Header -->
      <div class="dashboard-header">
        <div class="header-title">
          <h1>M365 AgentOps Compliance Dashboard</h1>
          <p class="header-subtitle">Real-time compliance monitoring across 1,025 controls</p>
        </div>
        <div class="header-controls">
          <button class="btn btn-secondary" id="refresh-btn">🔄 Refresh</button>
          <button class="btn btn-secondary" id="export-btn">📊 Export</button>
        </div>
      </div>

      <!-- Status bar -->
      <div class="dashboard-status" id="status-bar" style="display: none;">
        <span class="status-message"></span>
      </div>

      <!-- Loading skeleton -->
      <div class="dashboard-skeleton" id="skeleton">
        ${generateSkeletons(3)}
      </div>

      <!-- Dashboard content -->
      <div class="dashboard-content" id="dashboard-content" style="display: none;">
        <!-- Tabs -->
        <div class="dashboard-tabs">
          <button class="tab-btn active" data-tab="overview">📊 Overview</button>
          <button class="tab-btn" data-tab="frameworks">📋 Frameworks</button>
          <button class="tab-btn" data-tab="domains">🗂️ Domains</button>
          <button class="tab-btn" data-tab="alerts">🚨 Alerts & Trends</button>
          <button class="tab-btn" data-tab="controls">📑 All Controls (990+)</button>
        </div>

        <!-- Tab Content: Overview -->
        <div class="tab-content active" id="tab-overview">
          <div class="dashboard-section">
            <div id="score-card" class="score-card-container"></div>
          </div>
          <div class="dashboard-section">
            <div id="recommendations" class="recommendations-container"></div>
          </div>
        </div>

        <!-- Tab Content: Frameworks -->
        <div class="tab-content" id="tab-frameworks">
          <div class="dashboard-section">
            <div id="framework-comparison" class="framework-comparison-container"></div>
          </div>
        </div>

        <!-- Tab Content: Domains -->
        <div class="tab-content" id="tab-domains">
          <div class="dashboard-section">
            <div id="domain-breakdown" class="domain-breakdown-container"></div>
          </div>
        </div>

        <!-- Tab Content: Alerts & Trends -->
        <div class="tab-content" id="tab-alerts">
          <div class="dashboard-section">
            <div id="drift-alerts" class="drift-alerts-container"></div>
          </div>
          <div class="dashboard-section">
            <div id="trend-chart" class="trend-chart-container"></div>
          </div>
        </div>

        <!-- Tab Content: All Controls -->
        <div class="tab-content" id="tab-controls">
          <div class="dashboard-section">
            <div id="controls-list"></div>
          </div>
        </div>
      </div>

      <!-- Error state -->
      <div class="dashboard-error" id="error-container" style="display: none;">
        <div class="error-card">
          <h2>⚠️ Unable to Load Dashboard</h2>
          <p id="error-message"></p>
          <button class="btn btn-primary" id="retry-btn">🔄 Retry</button>
        </div>
      </div>
    </div>
  `

  container.innerHTML = html

  // Attach event listeners
  document.getElementById('refresh-btn')?.addEventListener('click', () => {
    loadDashboardData()
  })

  document.getElementById('export-btn')?.addEventListener('click', () => {
    exportDashboardData()
  })

  document.getElementById('retry-btn')?.addEventListener('click', () => {
    loadDashboardData()
  })

  // Add dashboard styles
  addDashboardStyles()
}

/**
 * Generate skeleton loaders
 */
function generateSkeletons(count) {
  return Array(count).fill(`
    <div class="skeleton-card">
      <div class="skeleton-line" style="width: 40%; margin-bottom: 16px;"></div>
      <div class="skeleton-line" style="width: 100%; height: 60px; margin-bottom: 12px;"></div>
      <div class="skeleton-line" style="width: 80%;"></div>
    </div>
  `).join('')
}

/**
 * Load all dashboard data
 */
async function loadDashboardData() {
  dashboardState.loading = true
  const skeleton = document.getElementById('skeleton')
  const content = document.getElementById('dashboard-content')
  const errorContainer = document.getElementById('error-container')

  // Show skeleton
  if (skeleton) skeleton.style.display = 'block'
  if (content) content.style.display = 'none'
  if (errorContainer) errorContainer.style.display = 'none'

  try {
    // Load all data in parallel
    console.log(`📊 Loading compliance data for tenant: ${dashboardState.tenantId}`)

    const [score, frameworks, domains, trend, drift, summary] = await Promise.all([
      complianceApi.getComplianceScore(dashboardState.tenantId),
      complianceApi.getFrameworkScores(dashboardState.tenantId),
      complianceApi.getDomainScores(dashboardState.tenantId),
      complianceApi.getComplianceTrend(dashboardState.tenantId, 30),
      complianceApi.getComplianceDrift(dashboardState.tenantId, 7),
      complianceApi.getExecutiveSummary(dashboardState.tenantId),
    ])

    dashboardState.data = { score, frameworks, domains, trend, drift, summary }
    dashboardState.lastUpdated = new Date()
    dashboardState.error = null

    // Hide skeleton and show content
    if (skeleton) skeleton.style.display = 'none'
    if (content) content.style.display = 'block'
    if (errorContainer) errorContainer.style.display = 'none'

    // Render components
    renderComponents()

    console.log('✅ Dashboard data loaded successfully')
  } catch (error) {
    console.error('❌ Dashboard load failed:', error)
    dashboardState.error = error.message

    // Show error
    if (skeleton) skeleton.style.display = 'none'
    if (content) content.style.display = 'none'
    if (errorContainer) {
      errorContainer.style.display = 'block'
      document.getElementById('error-message').textContent = error.message || 'Failed to load compliance data'
    }
  } finally {
    dashboardState.loading = false
  }
}

/**
 * Render all dashboard components
 */
function renderComponents() {
  if (!dashboardState.data) return

  const { score, frameworks, domains, trend, drift, summary } = dashboardState.data

  // Render score card
  const scoreCardContainer = document.getElementById('score-card')
  if (scoreCardContainer) {
    renderComplianceScoreCard(scoreCardContainer, score, trend)
  }

  // Render framework comparison
  const frameworkContainer = document.getElementById('framework-comparison')
  if (frameworkContainer) {
    renderFrameworkComparison(frameworkContainer, frameworks)
  }

  // Render domain breakdown
  const domainContainer = document.getElementById('domain-breakdown')
  if (domainContainer) {
    renderDomainBreakdown(domainContainer, domains)
  }

  // Render drift alerts
  const driftContainer = document.getElementById('drift-alerts')
  if (driftContainer) {
    renderDriftAlerts(driftContainer, drift)
  }

  // Render trend chart
  const trendContainer = document.getElementById('trend-chart')
  if (trendContainer) {
    renderTrendChart(trendContainer, trend).catch(err => {
      console.error('Chart rendering error:', err)
      trendContainer.innerHTML = '<div style="padding: 16px; color: #6b7280;">Chart unavailable</div>'
    })
  }

  // Render recommendations
  const recContainer = document.getElementById('recommendations')
  if (recContainer) {
    renderRecommendationsPanel(recContainer, summary)
  }

  // Render controls list
  const controlsContainer = document.getElementById('controls-list')
  if (controlsContainer) {
    console.log(`📋 Rendering controls list for tenant: ${dashboardState.tenantId}`)
    renderControlsList(controlsContainer, dashboardState.tenantId)
  } else {
    console.warn('⚠️ controls-list container not found')
  }

  // Attach tab switching functionality
  initializeTabs()

  // Update header with last updated time
  updateLastUpdatedTime()
}

/**
 * Initialize tab switching
 */
function initializeTabs() {
  const tabBtns = document.querySelectorAll('.tab-btn')
  const tabContents = document.querySelectorAll('.tab-content')

  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const tabName = btn.dataset.tab

      // Deactivate all tabs
      tabBtns.forEach(b => b.classList.remove('active'))
      tabContents.forEach(c => c.classList.remove('active'))

      // Activate selected tab
      btn.classList.add('active')
      document.getElementById(`tab-${tabName}`)?.classList.add('active')
    })
  })
}


/**
 * Update last updated time
 */
function updateLastUpdatedTime() {
  const statusBar = document.getElementById('status-bar')
  if (!statusBar) return

  const time = dashboardState.lastUpdated?.toLocaleTimeString()
  statusBar.querySelector('.status-message').textContent = `Last updated: ${time}`
  statusBar.style.display = 'block'
}

/**
 * Export dashboard data
 */
function exportDashboardData() {
  if (!dashboardState.data) {
    alert('No data to export')
    return
  }

  const data = JSON.stringify(dashboardState.data, null, 2)
  const blob = new Blob([data], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `compliance-dashboard-${new Date().toISOString().split('T')[0]}.json`
  a.click()
  URL.revokeObjectURL(url)
}

/**
 * Get color for domain score
 */
function getDomainColor(score) {
  if (score >= 80) return '#10b981'
  if (score >= 70) return '#3b82f6'
  if (score >= 60) return '#f59e0b'
  return '#ef4444'
}

/**
 * Get color for score
 */
function getScoreColor(score) {
  if (score >= 90) return '#10b981'
  if (score >= 80) return '#3b82f6'
  if (score >= 70) return '#f59e0b'
  if (score >= 60) return '#ef4444'
  return '#7c3aed'
}

/**
 * Render error message
 */
function renderError(container, message) {
  container.innerHTML = `
    <div class="dashboard-error">
      <div class="error-card">
        <h2>⚠️ Error</h2>
        <p>${message}</p>
      </div>
    </div>
  `
  addDashboardStyles()
}

/**
 * Add dashboard styles
 */
function addDashboardStyles() {
  if (document.getElementById('compliance-dashboard-styles')) return

  const styles = `
    <style id="compliance-dashboard-styles">
      .compliance-dashboard {
        max-width: 1400px;
        margin: 0 auto;
        padding: 24px;
      }

      .dashboard-header {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        margin-bottom: 32px;
        padding-bottom: 24px;
        border-bottom: 1px solid var(--color-border-primary, #e5e7eb);
      }

      .header-title h1 {
        font-size: 32px;
        font-weight: 700;
        color: var(--color-text-primary, #111827);
        margin: 0 0 8px 0;
      }

      .header-subtitle {
        font-size: 14px;
        color: var(--color-text-secondary, #6b7280);
        margin: 0;
      }

      .header-controls {
        display: flex;
        gap: 12px;
      }

      .btn {
        padding: 8px 16px;
        border: 1px solid var(--color-border-primary, #e5e7eb);
        border-radius: 6px;
        background: var(--color-bg-primary, #ffffff);
        color: var(--color-text-primary, #111827);
        font-size: 13px;
        font-weight: 500;
        cursor: pointer;
        transition: all 200ms ease;
      }

      .btn:hover {
        background: var(--color-bg-secondary, #f9fafb);
        border-color: var(--color-border-active, #3b82f6);
      }

      .btn-primary {
        background: #3b82f6;
        color: white;
        border-color: #3b82f6;
      }

      .btn-primary:hover {
        background: #2563eb;
      }

      .dashboard-section {
        margin-bottom: 32px;
      }

      .dashboard-skeleton,
      .dashboard-content {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
        gap: 24px;
      }

      .skeleton-card {
        background: var(--color-bg-primary, #ffffff);
        border: 1px solid var(--color-border-primary, #e5e7eb);
        border-radius: 12px;
        padding: 24px;
        animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
      }

      .skeleton-line {
        height: 16px;
        background: var(--color-bg-secondary, #e5e7eb);
        border-radius: 4px;
      }

      @keyframes pulse {
        0%, 100% { opacity: 1; }
        50% { opacity: 0.5; }
      }

      .dashboard-error {
        display: flex;
        justify-content: center;
        align-items: center;
        min-height: 400px;
      }

      .error-card {
        background: var(--color-bg-primary, #ffffff);
        border: 2px solid #ef4444;
        border-radius: 12px;
        padding: 32px;
        text-align: center;
        max-width: 500px;
      }

      .error-card h2 {
        color: #ef4444;
        margin-bottom: 12px;
      }

      .error-card p {
        color: var(--color-text-secondary, #6b7280);
        margin-bottom: 24px;
      }

      /* Components */
      .domain-breakdown,
      .drift-alerts,
      .trend-chart,
      .recommendations {
        background: var(--color-bg-primary, #ffffff);
        border: 1px solid var(--color-border-primary, #e5e7eb);
        border-radius: 12px;
        padding: 24px;
      }

      .domain-breakdown h2,
      .drift-alerts h2,
      .trend-chart h2,
      .recommendations h2 {
        font-size: 18px;
        font-weight: 600;
        margin: 0 0 16px 0;
        color: var(--color-text-primary, #111827);
      }

      .domains-list {
        display: grid;
        gap: 12px;
      }

      .domain-item {
        display: grid;
        grid-template-columns: 80px 1fr 100px;
        gap: 12px;
        align-items: center;
        padding: 12px;
        background: var(--color-bg-secondary, #f9fafb);
        border-radius: 6px;
      }

      .domain-name {
        font-weight: 600;
        font-size: 13px;
      }

      .domain-score-bar {
        height: 8px;
        background: var(--color-bg-tertiary, #e5e7eb);
        border-radius: 4px;
        overflow: hidden;
      }

      .domain-score-fill {
        height: 100%;
        border-radius: 4px;
        transition: width 300ms ease;
      }

      .domain-score-text {
        display: flex;
        flex-direction: column;
        align-items: flex-end;
        gap: 2px;
      }

      .domain-score-text .score {
        font-weight: 600;
        font-size: 13px;
      }

      .domain-score-text .failures {
        font-size: 11px;
        color: var(--color-text-secondary, #6b7280);
      }

      .drift-summary,
      .trend-summary {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
        gap: 16px;
        margin-bottom: 16px;
      }

      .drift-metric,
      .trend-stat {
        padding: 12px;
        background: var(--color-bg-secondary, #f9fafb);
        border-radius: 6px;
        text-align: center;
      }

      .drift-count {
        font-size: 24px;
        font-weight: bold;
        margin-bottom: 8px;
      }

      .drift-label {
        font-size: 12px;
        font-weight: 600;
        color: var(--color-text-primary, #111827);
      }

      .drift-desc {
        font-size: 11px;
        color: var(--color-text-secondary, #6b7280);
        margin-top: 4px;
      }

      .recommendations-list {
        list-style: decimal;
        padding-left: 20px;
        margin-bottom: 24px;
      }

      .recommendation-item {
        margin-bottom: 12px;
        font-size: 13px;
        line-height: 1.6;
        color: var(--color-text-primary, #111827);
      }

      .next-steps h3 {
        font-size: 14px;
        font-weight: 600;
        margin: 0 0 12px 0;
      }

      .steps-list {
        list-style: disc;
        padding-left: 20px;
      }

      .steps-list li {
        margin-bottom: 8px;
        font-size: 13px;
        color: var(--color-text-secondary, #6b7280);
      }

      /* Responsive */
      @media (max-width: 1024px) {
        .dashboard-header {
          flex-direction: column;
          gap: 16px;
        }

        .header-controls {
          width: 100%;
        }

        .btn {
          flex: 1;
        }

        .domain-item {
          grid-template-columns: 1fr;
          gap: 8px;
        }

        .domain-score-text {
          flex-direction: row;
          justify-content: space-between;
        }
      }

      /* Tab Styles */
      .dashboard-tabs {
        display: flex;
        gap: 8px;
        margin-bottom: 24px;
        border-bottom: 1px solid var(--color-border-primary, #e5e7eb);
        overflow-x: auto;
      }

      .tab-btn {
        padding: 12px 16px;
        border: none;
        background: transparent;
        color: var(--color-text-secondary, #6b7280);
        font-size: 14px;
        font-weight: 500;
        cursor: pointer;
        border-bottom: 2px solid transparent;
        transition: all 200ms ease;
        white-space: nowrap;
      }

      .tab-btn:hover {
        color: var(--color-text-primary, #111827);
      }

      .tab-btn.active {
        color: #3b82f6;
        border-bottom-color: #3b82f6;
      }

      .tab-content {
        display: none;
        animation: fadeIn 200ms ease;
      }

      .tab-content.active {
        display: block;
      }

      @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
      }

      /* Controls List Styles */
      .controls-list-container {
        display: flex;
        flex-direction: column;
        gap: 20px;
      }

      .controls-filters {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
        gap: 12px;
        padding: 16px;
        background: var(--color-bg-secondary, #f9fafb);
        border-radius: 8px;
      }

      .filter-group {
        display: flex;
        flex-direction: column;
        gap: 6px;
      }

      .filter-group label {
        font-size: 12px;
        font-weight: 600;
        color: var(--color-text-primary, #111827);
        text-transform: uppercase;
        letter-spacing: 0.5px;
      }

      .filter-select {
        padding: 8px 12px;
        border: 1px solid var(--color-border-primary, #e5e7eb);
        border-radius: 4px;
        background: white;
        color: var(--color-text-primary, #111827);
        font-size: 13px;
        cursor: pointer;
      }

      .filter-select:focus {
        outline: none;
        border-color: #3b82f6;
        box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
      }

      .controls-info {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 12px;
        background: var(--color-bg-secondary, #f9fafb);
        border-radius: 6px;
        font-size: 13px;
        color: var(--color-text-secondary, #6b7280);
      }

      .controls-loading {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        gap: 12px;
        padding: 40px;
      }

      .spinner {
        width: 30px;
        height: 30px;
        border: 3px solid #e5e7eb;
        border-top-color: #3b82f6;
        border-radius: 50%;
        animation: spin 600ms linear infinite;
      }

      @keyframes spin {
        to { transform: rotate(360deg); }
      }

      .controls-table-wrapper {
        overflow-x: auto;
        border: 1px solid var(--color-border-primary, #e5e7eb);
        border-radius: 8px;
      }

      .controls-table {
        width: 100%;
        border-collapse: collapse;
        background: white;
      }

      .controls-table thead {
        background: var(--color-bg-secondary, #f9fafb);
        border-bottom: 2px solid var(--color-border-primary, #e5e7eb);
      }

      .controls-table th {
        padding: 12px 16px;
        text-align: left;
        font-size: 12px;
        font-weight: 600;
        color: var(--color-text-primary, #111827);
        text-transform: uppercase;
        letter-spacing: 0.5px;
      }

      .controls-table th.sortable {
        cursor: pointer;
        user-select: none;
      }

      .controls-table th.sortable:hover {
        background: #f3f4f6;
      }

      .controls-table td {
        padding: 12px 16px;
        border-bottom: 1px solid var(--color-border-primary, #e5e7eb);
        font-size: 13px;
      }

      .controls-table tbody tr:hover {
        background: #f9fafb;
      }

      .control-id {
        font-family: monospace;
        font-weight: 600;
        color: #3b82f6;
      }

      .control-name {
        font-weight: 500;
        color: var(--color-text-primary, #111827);
      }

      .severity-badge {
        display: inline-block;
        padding: 4px 8px;
        border-radius: 4px;
        font-size: 12px;
        font-weight: 600;
      }

      .severity-critical {
        background: #fee2e2;
        color: #dc2626;
      }

      .severity-high {
        background: #fef3c7;
        color: #d97706;
      }

      .severity-medium {
        background: #fef3c7;
        color: #d97706;
      }

      .severity-low {
        background: #dcfce7;
        color: #16a34a;
      }

      .status-badge {
        display: inline-block;
        padding: 4px 8px;
        border-radius: 4px;
        font-size: 12px;
        font-weight: 600;
      }

      .status-pass {
        background: #dcfce7;
        color: #16a34a;
      }

      .status-fail {
        background: #fee2e2;
        color: #dc2626;
      }

      .status-partial {
        background: #fef3c7;
        color: #d97706;
      }

      .status-unknown {
        background: #f3f4f6;
        color: #6b7280;
      }

      .control-score {
        font-weight: 600;
      }

      .score {
        padding: 2px 6px;
        border-radius: 3px;
        font-size: 12px;
        font-weight: 600;
      }

      .score-excellent {
        background: #dcfce7;
        color: #16a34a;
      }

      .score-good {
        background: #dbeafe;
        color: #0284c7;
      }

      .score-fair {
        background: #fef3c7;
        color: #d97706;
      }

      .score-poor {
        background: #fee2e2;
        color: #dc2626;
      }

      .controls-empty,
      .controls-error {
        padding: 40px;
        text-align: center;
        color: var(--color-text-secondary, #6b7280);
      }

      .controls-pagination {
        display: flex;
        justify-content: center;
        align-items: center;
        gap: 16px;
        padding: 20px;
      }

      .btn-mini {
        padding: 4px 8px;
        font-size: 11px;
        background: #3b82f6;
        color: white;
        border: none;
        border-radius: 4px;
        cursor: pointer;
      }

      .btn-mini:hover {
        background: #2563eb;
      }

      .btn-tertiary {
        background: transparent;
        color: #3b82f6;
        border-color: #3b82f6;
      }

      .btn-secondary {
        background: var(--color-bg-secondary, #f9fafb);
        color: var(--color-text-primary, #111827);
        border-color: var(--color-border-primary, #e5e7eb);
      }

      .btn-secondary:hover {
        background: #f3f4f6;
      }

      @media (max-width: 768px) {
        .compliance-dashboard {
          padding: 12px;
        }

        .header-title h1 {
          font-size: 24px;
        }

        .dashboard-skeleton,
        .dashboard-content {
          grid-template-columns: 1fr;
        }

        .drift-summary,
        .trend-summary {
          grid-template-columns: 1fr;
        }

        .dashboard-tabs {
          overflow-x: auto;
          gap: 4px;
        }

        .tab-btn {
          padding: 10px 12px;
          font-size: 12px;
        }

        .controls-filters {
          grid-template-columns: 1fr;
        }

        .controls-info {
          flex-direction: column;
          gap: 12px;
          text-align: center;
        }

        .controls-table {
          font-size: 12px;
        }

        .controls-table th,
        .controls-table td {
          padding: 8px 12px;
        }
      }
    </style>
  `

  document.head.insertAdjacentHTML('beforeend', styles)
}
