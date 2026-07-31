// ============================================================
// Domain Breakdown Component
// Displays all 17 security domains with control counts
// ============================================================

const realDomains = [
  'Identity Security', 'Enterprise Applications', 'Microsoft Purview',
  'Defender for Cloud Apps', 'Power Platform', 'Conditional Access',
  'SharePoint Online', 'Device Security', 'Microsoft Teams',
  'Exchange Online', 'Email Security', 'Endpoint Security',
  'Security Operations', 'Executive Security', 'Security Governance',
  'Governance', 'Executive Intelligence'
]

export function renderDomainBreakdown(container, domains, tenantId = 'test') {
  if (!container) return

  // Load real domain data from database
  loadRealDomainData(container, tenantId)
}

async function loadRealDomainData(container, tenantId) {
  const API_URL = window.API_URL || 'http://localhost:3000'

  try {
    // Fetch control counts for each real domain
    const domainData = {}

    for (const domain of realDomains) {
      try {
        const encoded = encodeURIComponent(domain)
        const response = await fetch(
          `${API_URL}/api/m365-agentops/v2/compliance/domain/${encoded}/controls?tenantId=${encodeURIComponent(tenantId)}`
        )
        if (response.ok) {
          const data = await response.json()
          const controls = data.data || []

          domainData[domain] = {
            domain,
            totalControls: controls.length,
            passed: controls.filter(c => c.status === 'PASS').length,
            failed: controls.filter(c => c.status === 'FAIL').length,
            partial: controls.filter(c => c.status === 'PARTIAL').length,
            unknown: controls.filter(c => c.status === 'UNKNOWN').length,
            score: controls.length > 0
              ? ((controls.filter(c => c.status === 'PASS').length / controls.length) * 100)
              : 0
          }
        }
      } catch (err) {
        console.warn(`Failed to load ${domain}:`, err)
      }
    }

    // Sort by score (ascending - lowest/riskiest first)
    const sortedDomains = Object.entries(domainData)
      .sort(([, a], [, b]) => a.score - b.score)

    // Create tabs for different views
    const html = `
      <div class="domain-breakdown">
        <div class="breakdown-header">
          <h2>Domain Compliance Breakdown (1,199 Total Controls)</h2>
          <div class="breakdown-tabs">
            <button class="tab-btn active" data-view="all">All Domains (17)</button>
            <button class="tab-btn" data-view="critical">Critical (Score <70%)</button>
            <button class="tab-btn" data-view="good">Good (Score ≥80%)</button>
          </div>
        </div>

        <div class="domains-grid" id="domains-grid">
          ${renderDomainGrid(sortedDomains, 'all')}
        </div>
      </div>
    `

    container.innerHTML = html
    addDomainStyles()

    // Tab switching
    container.querySelectorAll('.tab-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const view = btn.dataset.view
        container.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'))
        btn.classList.add('active')

        const grid = container.querySelector('#domains-grid')
        grid.innerHTML = renderDomainGrid(sortedDomains, view)
      })
    })
  } catch (error) {
    console.error('Error loading domain data:', error)
    container.innerHTML = '<div style="padding: 20px; color: #ef4444;">Failed to load domain data</div>'
  }
}

/**
 * Render domain grid based on view
 */
function renderDomainGrid(domains, view) {
  let filtered = domains

  if (view === 'critical') {
    filtered = domains.filter(([, d]) => d.score < 70)
  } else if (view === 'good') {
    filtered = domains.filter(([, d]) => d.score >= 80)
  }

  if (filtered.length === 0) {
    return '<div class="no-domains">No domains in this category</div>'
  }

  return filtered.map(([domain, data], idx) => renderDomainCard(domain, data, idx)).join('')
}

/**
 * Render single domain card
 */
function renderDomainCard(domain, data, index) {
  const riskLevel = getRiskLevel(data.score)
  const riskIcon = getRiskIcon(riskLevel)
  const progressColor = getProgressColor(data.score)

  return `
    <div class="domain-card" style="animation-delay: ${index * 30}ms">
      <div class="domain-header">
        <div class="domain-info">
          <h3 class="domain-code">${domain}</h3>
          <p class="domain-summary">
            ${data.totalControls} controls • ${data.passed} passing • ${data.failed} failing
          </p>
        </div>
        <div class="domain-badge" style="background-color: ${getRiskColor(riskLevel)}">
          ${riskIcon} ${riskLevel}
        </div>
      </div>

      <div class="domain-progress">
        <div class="progress-labels">
          <span class="progress-label">Compliance Score</span>
          <span class="progress-value" style="color: ${progressColor}">
            ${data.score.toFixed(1)}%
          </span>
        </div>
        <div class="progress-bar">
          <div class="progress-fill" style="width: ${data.score}%; background-color: ${progressColor}"></div>
        </div>
      </div>

      <div class="domain-stats">
        <div class="stat-box">
          <span class="stat-value" style="color: #10b981">${data.passed}</span>
          <span class="stat-label">Passing</span>
        </div>
        <div class="stat-box">
          <span class="stat-value" style="color: #ef4444">${data.failed}</span>
          <span class="stat-label">Failing</span>
        </div>
        <div class="stat-box">
          <span class="stat-value" style="color: #f59e0b">${data.totalControls}</span>
          <span class="stat-label">Total</span>
        </div>
      </div>

      <div class="domain-actions">
        <button class="domain-btn" onclick="window.showDomainDetails('${domain}')">
          View Details →
        </button>
      </div>
    </div>
  `
}

/**
 * Get risk level based on score
 */
function getRiskLevel(score) {
  if (score >= 90) return 'Excellent'
  if (score >= 80) return 'Good'
  if (score >= 70) return 'Fair'
  if (score >= 60) return 'Poor'
  return 'Critical'
}

/**
 * Get risk icon
 */
function getRiskIcon(level) {
  switch (level) {
    case 'Excellent': return '⭐'
    case 'Good': return '✅'
    case 'Fair': return '⚠️'
    case 'Poor': return '❌'
    case 'Critical': return '🚨'
    default: return '❓'
  }
}

/**
 * Get risk color
 */
function getRiskColor(level) {
  switch (level) {
    case 'Excellent': return '#10b981'
    case 'Good': return '#3b82f6'
    case 'Fair': return '#f59e0b'
    case 'Poor': return '#ef4444'
    case 'Critical': return '#7c3aed'
    default: return '#6b7280'
  }
}

/**
 * Get progress bar color
 */
function getProgressColor(score) {
  if (score >= 80) return '#10b981'
  if (score >= 70) return '#3b82f6'
  if (score >= 60) return '#f59e0b'
  return '#ef4444'
}

/**
 * Add component styles
 */
function addDomainStyles() {
  if (document.getElementById('domain-breakdown-styles')) return

  const styles = `
    <style id="domain-breakdown-styles">
      .domain-breakdown {
        background: var(--color-bg-primary, #ffffff);
        border: 1px solid var(--color-border-primary, #e5e7eb);
        border-radius: 12px;
        padding: 24px;
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
      }

      .breakdown-header {
        margin-bottom: 24px;
      }

      .breakdown-header h2 {
        font-size: 18px;
        font-weight: 600;
        color: var(--color-text-primary, #111827);
        margin: 0 0 16px 0;
      }

      .breakdown-tabs {
        display: flex;
        gap: 8px;
        border-bottom: 1px solid var(--color-border-primary, #e5e7eb);
      }

      .tab-btn {
        padding: 8px 16px;
        background: none;
        border: none;
        border-bottom: 2px solid transparent;
        color: var(--color-text-secondary, #6b7280);
        font-size: 13px;
        font-weight: 500;
        cursor: pointer;
        transition: all 200ms ease;
      }

      .tab-btn:hover {
        color: var(--color-text-primary, #111827);
        border-bottom-color: var(--color-border-active, #3b82f6);
      }

      .tab-btn.active {
        color: #3b82f6;
        border-bottom-color: #3b82f6;
      }

      .domains-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
        gap: 16px;
      }

      .domain-card {
        background: var(--color-bg-secondary, #f9fafb);
        border: 1px solid var(--color-border-primary, #e5e7eb);
        border-radius: 8px;
        padding: 16px;
        transition: all 200ms ease;
        animation: slideUp 300ms ease forwards;
        opacity: 0;
      }

      @keyframes slideUp {
        from {
          opacity: 0;
          transform: translateY(10px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }

      .domain-card:hover {
        background: var(--color-bg-primary, #ffffff);
        border-color: var(--color-border-active, #3b82f6);
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
      }

      .domain-header {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        margin-bottom: 12px;
      }

      .domain-info {
        flex: 1;
      }

      .domain-code {
        font-size: 14px;
        font-weight: 600;
        color: var(--color-text-primary, #111827);
        margin: 0;
      }

      .domain-summary {
        font-size: 12px;
        color: var(--color-text-secondary, #6b7280);
        margin: 4px 0 0 0;
      }

      .domain-badge {
        display: inline-flex;
        align-items: center;
        gap: 4px;
        padding: 4px 8px;
        border-radius: 4px;
        color: white;
        font-size: 11px;
        font-weight: 600;
        white-space: nowrap;
      }

      .domain-progress {
        margin-bottom: 12px;
      }

      .progress-labels {
        display: flex;
        justify-content: space-between;
        margin-bottom: 6px;
      }

      .progress-label {
        font-size: 11px;
        color: var(--color-text-secondary, #6b7280);
        font-weight: 500;
      }

      .progress-value {
        font-size: 12px;
        font-weight: 600;
        font-variant-numeric: tabular-nums;
      }

      .progress-bar {
        height: 6px;
        background: var(--color-bg-tertiary, #e5e7eb);
        border-radius: 3px;
        overflow: hidden;
      }

      .progress-fill {
        height: 100%;
        border-radius: 3px;
        transition: width 300ms ease;
      }

      .domain-stats {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 8px;
        margin-bottom: 12px;
        padding: 8px;
        background: var(--color-bg-tertiary, #f0f0f0);
        border-radius: 6px;
      }

      .stat-box {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 2px;
      }

      .stat-value {
        font-size: 14px;
        font-weight: bold;
        font-variant-numeric: tabular-nums;
      }

      .stat-label {
        font-size: 10px;
        color: var(--color-text-secondary, #6b7280);
      }

      .domain-actions {
        display: flex;
        gap: 8px;
      }

      .domain-btn {
        flex: 1;
        padding: 6px 12px;
        background: #3b82f6;
        color: white;
        border: none;
        border-radius: 4px;
        font-size: 12px;
        font-weight: 500;
        cursor: pointer;
        transition: all 200ms ease;
      }

      .domain-btn:hover {
        background: #2563eb;
        transform: translateY(-1px);
      }

      .no-domains {
        grid-column: 1 / -1;
        text-align: center;
        padding: 32px;
        color: var(--color-text-secondary, #6b7280);
      }

      /* Responsive */
      @media (max-width: 1024px) {
        .domains-grid {
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
        }
      }

      @media (max-width: 768px) {
        .domains-grid {
          grid-template-columns: 1fr;
        }

        .breakdown-tabs {
          flex-wrap: wrap;
        }

        .tab-btn {
          font-size: 12px;
          padding: 6px 12px;
        }
      }
    </style>
  `

  document.head.insertAdjacentHTML('beforeend', styles)
}

/**
 * Update domain breakdown
 */
export function updateDomainBreakdown(container, domains) {
  renderDomainBreakdown(container, domains)
}
