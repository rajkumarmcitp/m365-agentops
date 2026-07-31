// ============================================================
// Compliance Score Card Component
// Displays overall compliance score with status and trend
// ============================================================

export function renderComplianceScoreCard(container, score, trend) {
  if (!container) return

  const scoreColor = getScoreColor(score.score)
  const statusIcon = getStatusIcon(score.status)
  const trendIcon = getTrendIcon(trend.direction)
  const trendColor = getTrendColor(trend.direction)

  const html = `
    <div class="compliance-score-card">
      <div class="score-header">
        <h2>Overall Compliance</h2>
        <div class="score-info">
          <span class="info-icon" title="Weighted compliance score based on 1,025 controls across 20 domains">ℹ️</span>
        </div>
      </div>

      <div class="score-display">
        <div class="score-number" style="color: ${scoreColor}">
          ${score.score.toFixed(1)}%
        </div>
        <div class="score-status">
          <span class="status-badge" style="background-color: ${scoreColor}">
            ${statusIcon} ${score.status}
          </span>
        </div>
      </div>

      <div class="score-breakdown">
        <div class="breakdown-row">
          <span class="breakdown-label">✅ Passing:</span>
          <span class="breakdown-value">${score.breakdown.passed}/${score.breakdown.total}</span>
        </div>
        <div class="breakdown-row">
          <span class="breakdown-label">❌ Failing:</span>
          <span class="breakdown-value" style="color: #ef4444">${score.breakdown.failed}</span>
        </div>
        <div class="breakdown-row">
          <span class="breakdown-label">⚠️ Partial:</span>
          <span class="breakdown-value" style="color: #f59e0b">${score.breakdown.partial}</span>
        </div>
        <div class="breakdown-row">
          <span class="breakdown-label">❓ Unknown:</span>
          <span class="breakdown-value">${score.breakdown.unknown}</span>
        </div>
      </div>

      <div class="score-divider"></div>

      <div class="score-trend">
        <div class="trend-header">
          <h3>30-Day Trend</h3>
        </div>
        <div class="trend-display">
          <span class="trend-arrow" style="color: ${trendColor}">${trendIcon}</span>
          <span class="trend-direction">${trend.direction}</span>
        </div>
        <div class="trend-details">
          <div class="detail-row">
            <span class="detail-label">Velocity:</span>
            <span class="detail-value">${trend.velocity > 0 ? '+' : ''}${trend.velocity.toFixed(2)}/day</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">Projection (30d):</span>
            <span class="detail-value" style="color: ${getScoreColor(trend.projection)}">${trend.projection.toFixed(1)}%</span>
          </div>
        </div>
      </div>

      <div class="score-sparkline">
        <div class="sparkline-header">
          <small>Score over time</small>
        </div>
        <svg class="sparkline-chart" viewBox="0 0 200 40" preserveAspectRatio="none">
          <polyline
            fill="none"
            stroke="${scoreColor}"
            stroke-width="2"
            points="${generateSparklinePoints(trend.history)}"
          />
        </svg>
      </div>
    </div>
  `

  container.innerHTML = html

  // Add styles
  addComponentStyles()
}

/**
 * Generate sparkline points from trend history
 */
function generateSparklinePoints(history) {
  if (!history || history.length === 0) return ''

  const minScore = Math.min(...history.map(h => h.score))
  const maxScore = Math.max(...history.map(h => h.score))
  const range = maxScore - minScore || 1

  return history.map((point, i) => {
    const x = (i / (history.length - 1)) * 200
    const y = 40 - ((point.score - minScore) / range) * 40
    return `${x},${y}`
  }).join(' ')
}

/**
 * Get color for score
 */
function getScoreColor(score) {
  if (score >= 90) return '#10b981' // Green
  if (score >= 80) return '#3b82f6' // Blue
  if (score >= 70) return '#f59e0b' // Amber
  if (score >= 60) return '#ef4444' // Red
  return '#7c3aed' // Purple (critical)
}

/**
 * Get icon for status
 */
function getStatusIcon(status) {
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
 * Get icon for trend direction
 */
function getTrendIcon(direction) {
  if (!direction || typeof direction !== 'string') return '➡️'
  if (direction.includes('Improving')) return '📈'
  if (direction.includes('Declining')) return '📉'
  return '➡️'
}

/**
 * Get color for trend
 */
function getTrendColor(direction) {
  if (!direction || typeof direction !== 'string') return '#6b7280'
  if (direction.includes('Improving')) return '#10b981'
  if (direction.includes('Declining')) return '#ef4444'
  return '#6b7280'
}

/**
 * Add component styles
 */
function addComponentStyles() {
  if (document.getElementById('compliance-score-card-styles')) return

  const styles = `
    <style id="compliance-score-card-styles">
      .compliance-score-card {
        background: var(--color-bg-primary, #ffffff);
        border: 1px solid var(--color-border-primary, #e5e7eb);
        border-radius: 12px;
        padding: 24px;
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
      }

      .score-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 16px;
      }

      .score-header h2 {
        font-size: 18px;
        font-weight: 600;
        color: var(--color-text-primary, #111827);
        margin: 0;
      }

      .info-icon {
        cursor: help;
        font-size: 14px;
        opacity: 0.6;
      }

      .score-display {
        text-align: center;
        margin-bottom: 24px;
      }

      .score-number {
        font-size: 56px;
        font-weight: bold;
        line-height: 1;
        margin-bottom: 12px;
        font-variant-numeric: tabular-nums;
      }

      .score-status {
        display: flex;
        justify-content: center;
      }

      .status-badge {
        display: inline-flex;
        align-items: center;
        gap: 8px;
        padding: 8px 16px;
        border-radius: 8px;
        color: white;
        font-weight: 500;
        font-size: 14px;
      }

      .score-breakdown {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 12px;
        margin-bottom: 16px;
        padding: 12px;
        background: var(--color-bg-secondary, #f9fafb);
        border-radius: 8px;
      }

      .breakdown-row {
        display: flex;
        justify-content: space-between;
        font-size: 13px;
      }

      .breakdown-label {
        color: var(--color-text-secondary, #6b7280);
        font-weight: 500;
      }

      .breakdown-value {
        color: var(--color-text-primary, #111827);
        font-weight: 600;
        font-variant-numeric: tabular-nums;
      }

      .score-divider {
        height: 1px;
        background: var(--color-border-primary, #e5e7eb);
        margin: 16px 0;
      }

      .score-trend {
        margin-bottom: 16px;
      }

      .trend-header {
        margin-bottom: 12px;
      }

      .trend-header h3 {
        font-size: 14px;
        font-weight: 600;
        color: var(--color-text-primary, #111827);
        margin: 0;
      }

      .trend-display {
        display: flex;
        align-items: center;
        gap: 8px;
        margin-bottom: 12px;
      }

      .trend-arrow {
        font-size: 24px;
      }

      .trend-direction {
        font-size: 14px;
        font-weight: 500;
        color: var(--color-text-primary, #111827);
      }

      .trend-details {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 12px;
        padding: 12px;
        background: var(--color-bg-secondary, #f9fafb);
        border-radius: 8px;
      }

      .detail-row {
        display: flex;
        justify-content: space-between;
        font-size: 12px;
      }

      .detail-label {
        color: var(--color-text-secondary, #6b7280);
        font-weight: 500;
      }

      .detail-value {
        color: var(--color-text-primary, #111827);
        font-weight: 600;
        font-variant-numeric: tabular-nums;
      }

      .score-sparkline {
        margin-top: 16px;
      }

      .sparkline-header {
        margin-bottom: 8px;
        color: var(--color-text-secondary, #6b7280);
      }

      .sparkline-chart {
        width: 100%;
        height: 40px;
        display: block;
      }

      /* Responsive */
      @media (max-width: 768px) {
        .compliance-score-card {
          padding: 16px;
        }

        .score-number {
          font-size: 40px;
        }

        .score-breakdown {
          grid-template-columns: 1fr;
          gap: 8px;
        }

        .trend-details {
          grid-template-columns: 1fr;
        }
      }
    </style>
  `

  document.head.insertAdjacentHTML('beforeend', styles)
}

/**
 * Update card with new data
 */
export function updateComplianceScoreCard(container, score, trend) {
  renderComplianceScoreCard(container, score, trend)
}
