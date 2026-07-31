// ============================================================
// Drift Alerts Component
// Displays compliance drift: regressions and remediations
// ============================================================

export function renderDriftAlerts(container, drift) {
  if (!container || !drift) return

  const trendIcon = getTrendIcon(drift.trend)
  const trendColor = getTrendColor(drift.trend)
  const severityColor = getSeverityColor(drift.severity)

  const html = `
    <div class="drift-alerts">
      <div class="alerts-header">
        <h2>Compliance Drift Analysis</h2>
        <span class="drift-period">Last 7 Days</span>
      </div>

      <div class="drift-summary-cards">
        <!-- Regressions Card -->
        <div class="drift-card regression-card">
          <div class="card-icon">🔴</div>
          <div class="card-content">
            <div class="card-count">${drift.regressionCount}</div>
            <div class="card-label">Regressions</div>
            <div class="card-desc">Controls failed</div>
          </div>
        </div>

        <!-- Remediations Card -->
        <div class="drift-card remediation-card">
          <div class="card-icon">🟢</div>
          <div class="card-content">
            <div class="card-count">${drift.remediationCount}</div>
            <div class="card-label">Remediations</div>
            <div class="card-desc">Issues fixed</div>
          </div>
        </div>

        <!-- Score Delta Card -->
        <div class="drift-card delta-card">
          <div class="card-icon" style="color: ${drift.scoreDelta > 0 ? '#10b981' : '#ef4444'}">
            ${drift.scoreDelta > 0 ? '📈' : '📉'}
          </div>
          <div class="card-content">
            <div class="card-count" style="color: ${drift.scoreDelta > 0 ? '#10b981' : '#ef4444'}">
              ${drift.scoreDelta > 0 ? '+' : ''}${drift.scoreDelta.toFixed(2)}%
            </div>
            <div class="card-label">Score Change</div>
            <div class="card-desc">${drift.trend}</div>
          </div>
        </div>

        <!-- Severity Card -->
        <div class="drift-card severity-card">
          <div class="card-icon">⚠️</div>
          <div class="card-content">
            <div class="card-label">Severity</div>
            <div class="card-count" style="color: ${severityColor}">
              ${drift.severity}
            </div>
            <div class="card-desc">Alert level</div>
          </div>
        </div>
      </div>

      <div class="drift-details">
        <!-- Regressions Section -->
        <div class="drift-section">
          <h3 class="section-title">🔴 Failed Controls (Regressions)</h3>
          ${renderRegressionsList(drift.regressions)}
        </div>

        <!-- Remediations Section -->
        <div class="drift-section">
          <h3 class="section-title">🟢 Fixed Controls (Remediations)</h3>
          ${renderRemediationsList(drift.remediations)}
        </div>
      </div>

      <div class="drift-recommendations">
        <h3>Impact Assessment</h3>
        <div class="impact-text">
          <p><strong>Current Trend:</strong> ${drift.trend}</p>
          ${drift.scoreDelta < -5 ?
            '<p style="color: #ef4444;"><strong>⚠️ Alert:</strong> Significant compliance decline detected. Immediate action recommended.</p>'
            : drift.scoreDelta < -2 ?
            '<p style="color: #f59e0b;"><strong>⚠️ Warning:</strong> Compliance declining. Review failed controls.</p>'
            : drift.scoreDelta > 2 ?
            '<p style="color: #10b981;"><strong>✓ Positive:</strong> Compliance improving. Maintain remediation pace.</p>'
            :
            '<p style="color: #3b82f6;"><strong>→ Stable:</strong> Compliance stable. Continue monitoring.</p>'
          }
        </div>
      </div>
    </div>
  `

  container.innerHTML = html
  addDriftStyles()
}

/**
 * Render regressions list
 */
function renderRegressionsList(regressions) {
  if (!regressions || regressions.length === 0) {
    return '<div class="empty-state">✓ No regressions detected</div>'
  }

  return `
    <div class="controls-list">
      ${regressions.map((regression, idx) => `
        <div class="control-item" style="animation-delay: ${idx * 50}ms">
          <div class="control-info">
            <span class="control-id">${regression.controlId}</span>
            <span class="control-severity" style="background-color: ${getSeverityBadgeColor(regression.severity)}">
              ${regression.severity}
            </span>
          </div>
          <div class="control-time">
            ${formatTime(regression.changedAt)}
          </div>
        </div>
      `).join('')}
    </div>
  `
}

/**
 * Render remediations list
 */
function renderRemediationsList(remediations) {
  if (!remediations || remediations.length === 0) {
    return '<div class="empty-state">No recent remediations</div>'
  }

  return `
    <div class="controls-list">
      ${remediations.map((remediation, idx) => `
        <div class="control-item fixed" style="animation-delay: ${idx * 50}ms">
          <div class="control-info">
            <span class="control-id">${remediation.controlId}</span>
            <span class="control-badge-fixed">Fixed ✓</span>
          </div>
          <div class="control-time">
            ${formatTime(remediation.changedAt)}
          </div>
        </div>
      `).join('')}
    </div>
  `
}

/**
 * Get trend icon
 */
function getTrendIcon(trend) {
  if (trend.includes('Improving')) return '📈'
  if (trend.includes('Declining')) return '📉'
  return '➡️'
}

/**
 * Get trend color
 */
function getTrendColor(trend) {
  if (trend.includes('Improving')) return '#10b981'
  if (trend.includes('Declining')) return '#ef4444'
  return '#6b7280'
}

/**
 * Get severity color
 */
function getSeverityColor(severity) {
  switch (severity) {
    case 'Critical': return '#7c3aed'
    case 'High': return '#ef4444'
    case 'Medium': return '#f59e0b'
    default: return '#3b82f6'
  }
}

/**
 * Get severity badge color
 */
function getSeverityBadgeColor(severity) {
  switch (severity) {
    case 'Critical': return '#7c3aed'
    case 'High': return '#ef4444'
    case 'Medium': return '#f59e0b'
    case 'Low': return '#3b82f6'
    default: return '#6b7280'
  }
}

/**
 * Format time relative to now
 */
function formatTime(isoTime) {
  if (!isoTime) return 'Unknown'

  const date = new Date(isoTime)
  const now = new Date()
  const diffMs = now - date
  const diffMins = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMs / 3600000)
  const diffDays = Math.floor(diffMs / 86400000)

  if (diffMins < 1) return 'Just now'
  if (diffMins < 60) return `${diffMins}m ago`
  if (diffHours < 24) return `${diffHours}h ago`
  if (diffDays < 7) return `${diffDays}d ago`

  return date.toLocaleDateString()
}

/**
 * Add component styles
 */
function addDriftStyles() {
  if (document.getElementById('drift-alerts-styles')) return

  const styles = `
    <style id="drift-alerts-styles">
      .drift-alerts {
        background: var(--color-bg-primary, #ffffff);
        border: 1px solid var(--color-border-primary, #e5e7eb);
        border-radius: 12px;
        padding: 24px;
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
      }

      .alerts-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 24px;
      }

      .alerts-header h2 {
        font-size: 18px;
        font-weight: 600;
        color: var(--color-text-primary, #111827);
        margin: 0;
      }

      .drift-period {
        font-size: 12px;
        color: var(--color-text-secondary, #6b7280);
        background: var(--color-bg-secondary, #f9fafb);
        padding: 4px 8px;
        border-radius: 4px;
      }

      .drift-summary-cards {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
        gap: 12px;
        margin-bottom: 24px;
      }

      .drift-card {
        background: var(--color-bg-secondary, #f9fafb);
        border: 1px solid var(--color-border-primary, #e5e7eb);
        border-radius: 8px;
        padding: 12px;
        display: flex;
        gap: 12px;
        transition: all 200ms ease;
      }

      .drift-card:hover {
        background: var(--color-bg-primary, #ffffff);
        border-color: var(--color-border-active, #3b82f6);
      }

      .card-icon {
        font-size: 24px;
        line-height: 1;
      }

      .card-content {
        flex: 1;
        display: flex;
        flex-direction: column;
        justify-content: center;
      }

      .card-count {
        font-size: 18px;
        font-weight: bold;
        color: var(--color-text-primary, #111827);
        font-variant-numeric: tabular-nums;
      }

      .card-label {
        font-size: 11px;
        font-weight: 600;
        color: var(--color-text-primary, #111827);
        text-transform: uppercase;
        letter-spacing: 0.5px;
      }

      .card-desc {
        font-size: 10px;
        color: var(--color-text-secondary, #6b7280);
      }

      .drift-details {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
        gap: 24px;
        margin-bottom: 24px;
        padding-top: 24px;
        border-top: 1px solid var(--color-border-primary, #e5e7eb);
      }

      .drift-section {
        display: flex;
        flex-direction: column;
      }

      .section-title {
        font-size: 13px;
        font-weight: 600;
        color: var(--color-text-primary, #111827);
        margin: 0 0 12px 0;
      }

      .controls-list {
        display: flex;
        flex-direction: column;
        gap: 8px;
      }

      .control-item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 8px;
        background: var(--color-bg-secondary, #f9fafb);
        border-radius: 6px;
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

      .control-item.fixed {
        background: #f0fdf4;
      }

      .control-info {
        display: flex;
        align-items: center;
        gap: 8px;
        flex: 1;
      }

      .control-id {
        font-size: 12px;
        font-weight: 600;
        color: var(--color-text-primary, #111827);
        font-family: monospace;
      }

      .control-severity {
        display: inline-flex;
        align-items: center;
        padding: 2px 6px;
        border-radius: 3px;
        color: white;
        font-size: 10px;
        font-weight: 600;
      }

      .control-badge-fixed {
        display: inline-flex;
        align-items: center;
        padding: 2px 6px;
        border-radius: 3px;
        background: #10b981;
        color: white;
        font-size: 10px;
        font-weight: 600;
      }

      .control-time {
        font-size: 11px;
        color: var(--color-text-secondary, #6b7280);
        white-space: nowrap;
      }

      .empty-state {
        padding: 16px;
        text-align: center;
        color: var(--color-text-secondary, #6b7280);
        font-size: 13px;
        background: var(--color-bg-secondary, #f9fafb);
        border-radius: 6px;
      }

      .drift-recommendations {
        padding: 12px;
        background: var(--color-bg-secondary, #f9fafb);
        border-radius: 8px;
        border-left: 3px solid #3b82f6;
      }

      .drift-recommendations h3 {
        font-size: 13px;
        font-weight: 600;
        color: var(--color-text-primary, #111827);
        margin: 0 0 8px 0;
      }

      .impact-text {
        font-size: 12px;
        color: var(--color-text-secondary, #6b7280);
        line-height: 1.5;
      }

      .impact-text p {
        margin: 4px 0;
      }

      /* Responsive */
      @media (max-width: 1024px) {
        .drift-summary-cards {
          grid-template-columns: repeat(2, 1fr);
        }

        .drift-details {
          grid-template-columns: 1fr;
        }
      }

      @media (max-width: 768px) {
        .drift-summary-cards {
          grid-template-columns: 1fr;
        }
      }
    </style>
  `

  document.head.insertAdjacentHTML('beforeend', styles)
}

/**
 * Update drift alerts
 */
export function updateDriftAlerts(container, drift) {
  renderDriftAlerts(container, drift)
}
