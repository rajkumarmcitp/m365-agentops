/**
 * Validation Dashboard
 * Real-time validation results for all phases (3a, 3b, 3c, 4, 5)
 */

const API_URL = window.location.origin

export async function initValidationDashboard(container) {
  const dashboard = new ValidationDashboard(container)
  await dashboard.init()
  return dashboard
}

class ValidationDashboard {
  constructor(container) {
    this.container = container
    this.cacheStatus = null
    this.validationResults = {}
    this.loading = false
    this.benchmarkMode = true
    this.autoRefresh = false
    this.refreshInterval = 30000
  }

  async init() {
    this.render()
    await this.loadCacheStatus()
    await this.runAllValidations()
    this.attachEventListeners()
  }

  render() {
    const html = `
      <div class="validation-dashboard" style="padding: 20px">
        <style>${this.getStyles()}</style>
        
        <div class="dashboard-header">
          <h1>⚡ M365 Validation Dashboard</h1>
          <div class="header-controls">
            <button class="btn-primary" id="run-all-validations">
              ▶️ Run All Validations
            </button>
            <label>
              <input type="checkbox" id="benchmark-mode" checked>
              Benchmark Mode
            </label>
            <label>
              <input type="checkbox" id="auto-refresh">
              Auto-Refresh
            </label>
            <label id="interval-label" style="display:none">
              Interval:
              <input type="number" id="refresh-interval" value="30" min="5" max="300">
              seconds
            </label>
          </div>
        </div>

        <div id="cache-status" class="cache-status"></div>
        <div id="aggregate-stats" class="aggregate-stats"></div>
        
        <h2 style="margin-top: 30px; margin-bottom: 20px">Validation Phases</h2>
        <div class="phase-grid" id="phase-grid"></div>

        <div id="loading-overlay" class="loading-overlay" style="display:none">
          <div class="spinner"></div>
        </div>
      </div>
    `
    this.container.innerHTML = html
  }

  getStyles() {
    return `
      .validation-dashboard {
        max-width: 1400px;
        margin: 0 auto;
        font-family: var(--font-family, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif);
        color: var(--color-text-primary, #333);
      }

      .dashboard-header h1 {
        font-size: 28px;
        margin: 0 0 20px 0;
        color: #1a1a1a;
      }

      .header-controls {
        display: flex;
        gap: 15px;
        flex-wrap: wrap;
        align-items: center;
      }

      .header-controls label {
        display: flex;
        align-items: center;
        gap: 8px;
        font-size: 14px;
        cursor: pointer;
      }

      .header-controls input[type="checkbox"] {
        cursor: pointer;
      }

      .header-controls input[type="number"] {
        width: 60px;
        padding: 6px;
        border: 1px solid #ddd;
        border-radius: 4px;
      }

      .btn-primary {
        padding: 10px 20px;
        background: #1976d2;
        color: white;
        border: none;
        border-radius: 4px;
        cursor: pointer;
        font-size: 14px;
        font-weight: 500;
      }

      .btn-primary:hover:not(:disabled) {
        background: #1565c0;
      }

      .btn-primary:disabled {
        background: #999;
        cursor: not-allowed;
      }

      .cache-status {
        background: #f5f5f5;
        padding: 15px;
        border-radius: 8px;
        margin-bottom: 20px;
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
        gap: 15px;
      }

      .cache-item {
        font-size: 13px;
      }

      .cache-item strong {
        color: #333;
      }

      .cache-item .value {
        font-size: 16px;
        font-weight: bold;
        color: #1976d2;
        margin-top: 4px;
      }

      .cache-status.ready .value {
        color: #4CAF50;
      }

      .aggregate-stats {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
        padding: 20px;
        border-radius: 8px;
        margin-bottom: 30px;
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
        gap: 20px;
      }

      .stat-item h3 {
        margin: 0 0 5px 0;
        font-size: 13px;
        opacity: 0.9;
        text-transform: uppercase;
      }

      .stat-item .value {
        font-size: 32px;
        font-weight: bold;
      }

      .phase-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
        gap: 20px;
        margin-bottom: 30px;
      }

      .phase-card {
        background: white;
        border: 1px solid #e0e0e0;
        border-radius: 8px;
        padding: 20px;
        box-shadow: 0 2px 4px rgba(0,0,0,0.1);
      }

      .phase-card.error {
        background: #ffebee;
        border-color: #F44336;
        color: #C62828;
      }

      .phase-header {
        display: flex;
        justify-content: space-between;
        align-items: start;
        margin-bottom: 15px;
        border-bottom: 2px solid #f0f0f0;
        padding-bottom: 10px;
      }

      .phase-header h3 {
        margin: 0;
        font-size: 18px;
        color: #333;
      }

      .phase-domains {
        font-size: 12px;
        color: #999;
        background: #f5f5f5;
        padding: 4px 8px;
        border-radius: 4px;
      }

      .phase-metrics {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        gap: 10px;
        margin-bottom: 15px;
      }

      .metric {
        font-size: 12px;
        display: flex;
        flex-direction: column;
        gap: 3px;
      }

      .metric .label {
        color: #999;
        text-transform: uppercase;
        font-weight: 500;
      }

      .metric .value {
        font-size: 16px;
        font-weight: bold;
        color: #333;
      }

      .phase-results {
        display: flex;
        gap: 10px;
        margin-bottom: 15px;
        flex-wrap: wrap;
      }

      .result {
        font-size: 12px;
        padding: 6px 10px;
        border-radius: 4px;
        background: #f5f5f5;
        flex: 1;
        min-width: 80px;
        text-align: center;
      }

      .result.pass {
        background: #e8f5e9;
        color: #2e7d32;
      }

      .result.fail {
        background: #ffebee;
        color: #c62828;
      }

      .result.warn {
        background: #fff3e0;
        color: #e65100;
      }

      .btn-small {
        width: 100%;
        padding: 8px;
        background: #1976d2;
        color: white;
        border: none;
        border-radius: 4px;
        cursor: pointer;
        font-size: 12px;
        font-weight: 500;
      }

      .btn-small:hover:not(:disabled) {
        background: #1565c0;
      }

      .loading-overlay {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0,0,0,0.3);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 1000;
      }

      .spinner {
        width: 40px;
        height: 40px;
        border: 4px solid #f3f3f3;
        border-top: 4px solid #1976d2;
        border-radius: 50%;
        animation: spin 1s linear infinite;
      }

      @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }
    `
  }

  async loadCacheStatus() {
    try {
      const response = await fetch(`${API_URL}/api/m365-agentops/v2/validation/cache-status`)
      const data = await response.json()
      if (data.success) {
        this.cacheStatus = data.data
        this.renderCacheStatus()
      }
    } catch (err) {
      console.error('Error loading cache status:', err)
    }
  }

  renderCacheStatus() {
    const container = document.getElementById('cache-status')
    if (!container || !this.cacheStatus) return

    const ready = this.cacheStatus.status === 'ready' ? 'ready' : ''
    container.className = `cache-status ${ready}`
    container.innerHTML = `
      <div class="cache-item">
        <strong>Cache Status</strong>
        <div class="value">${this.cacheStatus.status === 'ready' ? '✅ Ready' : '⏳ Initializing'}</div>
      </div>
      <div class="cache-item">
        <strong>Hit Rate</strong>
        <div class="value">${this.cacheStatus.cacheHitRate || 0}%</div>
      </div>
      <div class="cache-item">
        <strong>Total Validations</strong>
        <div class="value">${this.cacheStatus.totalValidations || 0}</div>
      </div>
      <div class="cache-item">
        <strong>Last Updated</strong>
        <div class="value">${new Date(this.cacheStatus.lastUpdated).toLocaleTimeString()}</div>
      </div>
    `
  }

  async runAllValidations() {
    this.loading = true
    this.showLoading(true)

    const phases = ['phase3a', 'phase3b', 'phase3c', 'phase4', 'phase5']
    
    for (const phase of phases) {
      try {
        const response = await fetch(
          `${API_URL}/api/m365-agentops/v2/validation/${phase}?benchmark=${this.benchmarkMode}`,
          { method: 'POST' }
        )
        const data = await response.json()
        this.validationResults[phase] = data
      } catch (err) {
        console.error(`Error running ${phase}:`, err)
        this.validationResults[phase] = { success: false, error: err.message }
      }
    }

    this.loading = false
    this.showLoading(false)
    this.renderPhaseCards()
    this.renderAggregateStats()
  }

  renderPhaseCards() {
    const container = document.getElementById('phase-grid')
    if (!container) return

    const phases = [
      { key: 'phase3a', name: 'Phase 3a', domains: 'Identity + Applications' },
      { key: 'phase3b', name: 'Phase 3b', domains: 'Teams + SharePoint' },
      { key: 'phase3c', name: 'Phase 3c', domains: 'Defender + DLP' },
      { key: 'phase4', name: 'Phase 4', domains: 'Dynamics + Viva' },
      { key: 'phase5', name: 'Phase 5', domains: 'Fabric + Power Platform' }
    ]

    container.innerHTML = phases.map(phase => {
      const result = this.validationResults[phase.key]
      if (!result) return `<div class="phase-card error">Loading ${phase.name}...</div>`
      if (!result.success) return `<div class="phase-card error">Error: ${result.error}</div>`

      const { stats = {}, duration = 0, apiCalls = 0 } = result.data || {}
      const { total = 0, pass = 0, fail = 0, warn = 0 } = stats
      const passRate = total > 0 ? Math.round((pass / total) * 100) : 0
      const statusColor = passRate >= 80 ? '#4CAF50' : passRate >= 60 ? '#FF9800' : '#F44336'

      return `
        <div class="phase-card" style="border-left: 4px solid ${statusColor}">
          <div class="phase-header">
            <h3>${phase.name}</h3>
            <span class="phase-domains">${phase.domains}</span>
          </div>
          
          <div class="phase-metrics">
            <div class="metric">
              <span class="label">Validators</span>
              <span class="value">${total}</span>
            </div>
            <div class="metric">
              <span class="label">Pass Rate</span>
              <span class="value" style="color: ${statusColor}">${passRate}%</span>
            </div>
            <div class="metric">
              <span class="label">Duration</span>
              <span class="value">${duration}ms</span>
            </div>
            <div class="metric">
              <span class="label">API Calls</span>
              <span class="value" style="color: #4CAF50">0</span>
            </div>
          </div>

          <div class="phase-results">
            <div class="result pass">✅ Pass: ${pass}</div>
            <div class="result fail">❌ Fail: ${fail}</div>
            <div class="result warn">⚠️ Warn: ${warn}</div>
          </div>

          <button class="btn-small" onclick="window.validationDashboard.runPhase('${phase.key}')" ${this.loading ? 'disabled' : ''}>
            ${this.loading ? 'Running...' : 'Re-run'}
          </button>
        </div>
      `
    }).join('')
  }

  renderAggregateStats() {
    const container = document.getElementById('aggregate-stats')
    if (!container) return

    let totalValidators = 0
    let totalPass = 0
    let totalFail = 0
    let totalWarn = 0
    let totalDuration = 0
    let phaseCount = 0

    Object.values(this.validationResults).forEach(result => {
      if (result.success && result.data?.stats) {
        const { stats = {}, duration = 0 } = result.data
        totalValidators += stats.total || 0
        totalPass += stats.pass || 0
        totalFail += stats.fail || 0
        totalWarn += stats.warn || 0
        totalDuration += duration || 0
        phaseCount++
      }
    })

    const passRate = totalValidators > 0 ? Math.round((totalPass / totalValidators) * 100) : 0
    const passColor = passRate >= 80 ? '#4CAF50' : passRate >= 60 ? '#FF9800' : '#F44336'

    if (phaseCount === 0) {
      container.innerHTML = ''
      return
    }

    container.innerHTML = `
      <div class="stat-item">
        <h3>Total Validators</h3>
        <div class="value">${totalValidators}</div>
      </div>
      <div class="stat-item">
        <h3>Pass Rate</h3>
        <div class="value" style="color: ${passColor}">${passRate}%</div>
      </div>
      <div class="stat-item">
        <h3>Pass</h3>
        <div class="value" style="color: #4CAF50">${totalPass}</div>
      </div>
      <div class="stat-item">
        <h3>Fail</h3>
        <div class="value" style="color: #F44336">${totalFail}</div>
      </div>
      <div class="stat-item">
        <h3>Warn</h3>
        <div class="value" style="color: #FF9800">${totalWarn}</div>
      </div>
      <div class="stat-item">
        <h3>Total Duration</h3>
        <div class="value" style="color: #4CAF50">${totalDuration}ms</div>
      </div>
    `
  }

  showLoading(show) {
    const overlay = document.getElementById('loading-overlay')
    if (overlay) overlay.style.display = show ? 'flex' : 'none'
  }

  async runPhase(phase) {
    this.loading = true
    this.showLoading(true)

    try {
      const response = await fetch(
        `${API_URL}/api/m365-agentops/v2/validation/${phase}?benchmark=${this.benchmarkMode}`,
        { method: 'POST' }
      )
      const data = await response.json()
      this.validationResults[phase] = data
    } catch (err) {
      console.error(`Error running ${phase}:`, err)
      this.validationResults[phase] = { success: false, error: err.message }
    }

    this.loading = false
    this.showLoading(false)
    this.renderPhaseCards()
    this.renderAggregateStats()
  }

  attachEventListeners() {
    const runBtn = document.getElementById('run-all-validations')
    if (runBtn) {
      runBtn.addEventListener('click', () => this.runAllValidations())
    }

    const benchmarkCb = document.getElementById('benchmark-mode')
    if (benchmarkCb) {
      benchmarkCb.addEventListener('change', (e) => {
        this.benchmarkMode = e.target.checked
      })
    }

    const autoRefreshCb = document.getElementById('auto-refresh')
    const intervalLabel = document.getElementById('interval-label')
    if (autoRefreshCb) {
      autoRefreshCb.addEventListener('change', (e) => {
        this.autoRefresh = e.target.checked
        if (intervalLabel) intervalLabel.style.display = e.target.checked ? 'flex' : 'none'
      })
    }

    const intervalInput = document.getElementById('refresh-interval')
    if (intervalInput) {
      intervalInput.addEventListener('change', (e) => {
        this.refreshInterval = parseInt(e.target.value) * 1000
      })
    }

    // Make dashboard accessible globally for button callbacks
    window.validationDashboard = this
  }
}

export default ValidationDashboard
