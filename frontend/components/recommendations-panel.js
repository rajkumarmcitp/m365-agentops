// ============================================================
// Recommendations Panel Component
// Displays executive recommendations and action items
// ============================================================

export function renderRecommendationsPanel(container, summary) {
  if (!container || !summary) return

  const topRisks = summary.topRisks || []
  const recommendations = summary.recommendations || []
  const nextSteps = summary.nextSteps || []

  const html = `
    <div class="recommendations-panel">
      <div class="panel-header">
        <h2>Executive Recommendations</h2>
        <span class="panel-subtitle">Based on current compliance state</span>
      </div>

      <!-- Top Risks Section -->
      <div class="section top-risks">
        <h3 class="section-title">🎯 Top Priority Areas</h3>
        ${renderTopRisks(topRisks)}
      </div>

      <!-- Recommendations Section -->
      <div class="section recommendations-section">
        <h3 class="section-title">💡 Recommended Actions</h3>
        ${renderRecommendations(recommendations)}
      </div>

      <!-- Next Steps Section -->
      <div class="section next-steps">
        <h3 class="section-title">📋 Next Steps</h3>
        ${renderNextSteps(nextSteps)}
      </div>

      <!-- Impact Assessment -->
      <div class="section impact-assessment">
        <h3 class="section-title">📊 Expected Impact</h3>
        <div class="impact-grid">
          <div class="impact-card">
            <div class="impact-icon">⏱️</div>
            <div class="impact-content">
              <div class="impact-label">Estimated Effort</div>
              <div class="impact-value">1-2 weeks</div>
            </div>
          </div>
          <div class="impact-card">
            <div class="impact-icon">📈</div>
            <div class="impact-content">
              <div class="impact-label">Expected Improvement</div>
              <div class="impact-value">+5-10%</div>
            </div>
          </div>
          <div class="impact-card">
            <div class="impact-icon">🎯</div>
            <div class="impact-content">
              <div class="impact-label">Target Score</div>
              <div class="impact-value">85-90%</div>
            </div>
          </div>
        </div>
      </div>

      <!-- Action Buttons -->
      <div class="section action-buttons">
        <button class="btn-action primary" onclick="window.generateReport?.()">
          📄 Generate Full Report
        </button>
        <button class="btn-action secondary" onclick="window.scheduleReview?.()">
          📅 Schedule Review
        </button>
        <button class="btn-action secondary" onclick="window.exportData?.()">
          💾 Export Data
        </button>
      </div>
    </div>
  `

  container.innerHTML = html
  addRecommendationsStyles()
}

/**
 * Render top risks section
 */
function renderTopRisks(topRisks) {
  if (!topRisks || topRisks.length === 0) {
    return '<div class="empty-state">✓ No critical risks identified</div>'
  }

  return `
    <div class="risks-list">
      ${topRisks.map((risk, idx) => `
        <div class="risk-item" style="animation-delay: ${idx * 50}ms">
          <div class="risk-rank">
            <span class="rank-number">${idx + 1}</span>
          </div>
          <div class="risk-info">
            <div class="risk-domain">${risk.domain}</div>
            <div class="risk-details">
              <span class="risk-score">Score: <strong>${risk.score.toFixed(1)}%</strong></span>
              <span class="risk-controls">${risk.failingControls} failing controls</span>
            </div>
          </div>
          <div class="risk-severity">
            <span class="severity-badge" style="background-color: ${getSeverityColor(risk.score)}">
              ${getSeverityLabel(risk.score)}
            </span>
          </div>
        </div>
      `).join('')}
    </div>
  `
}

/**
 * Render recommendations list
 */
function renderRecommendations(recommendations) {
  if (!recommendations || recommendations.length === 0) {
    return '<div class="empty-state">No recommendations at this time</div>'
  }

  return `
    <div class="recommendations-list">
      ${recommendations.map((rec, idx) => `
        <div class="recommendation-item" style="animation-delay: ${idx * 50}ms">
          <div class="rec-number">${idx + 1}</div>
          <div class="rec-content">
            <p class="rec-text">${rec}</p>
          </div>
          <div class="rec-action">
            <button class="btn-rec-action" title="Mark as done">
              ✓
            </button>
          </div>
        </div>
      `).join('')}
    </div>
  `
}

/**
 * Render next steps
 */
function renderNextSteps(nextSteps) {
  if (!nextSteps || nextSteps.length === 0) {
    return '<div class="empty-state">No pending steps</div>'
  }

  return `
    <div class="steps-list">
      ${nextSteps.map((step, idx) => `
        <div class="step-item" style="animation-delay: ${idx * 50}ms">
          <div class="step-number">${idx + 1}</div>
          <div class="step-content">
            <p class="step-text">${step}</p>
          </div>
          <div class="step-status">
            <input type="checkbox" class="step-checkbox" title="Mark as complete">
          </div>
        </div>
      `).join('')}
    </div>
  `
}

/**
 * Get severity label
 */
function getSeverityLabel(score) {
  if (score >= 80) return 'Good'
  if (score >= 70) return 'Fair'
  if (score >= 60) return 'Poor'
  return 'Critical'
}

/**
 * Get severity color
 */
function getSeverityColor(score) {
  if (score >= 80) return '#10b981'
  if (score >= 70) return '#3b82f6'
  if (score >= 60) return '#f59e0b'
  return '#ef4444'
}

/**
 * Add component styles
 */
function addRecommendationsStyles() {
  if (document.getElementById('recommendations-panel-styles')) return

  const styles = `
    <style id="recommendations-panel-styles">
      .recommendations-panel {
        background: var(--color-bg-primary, #ffffff);
        border: 1px solid var(--color-border-primary, #e5e7eb);
        border-radius: 12px;
        padding: 24px;
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
      }

      .panel-header {
        margin-bottom: 24px;
      }

      .panel-header h2 {
        font-size: 18px;
        font-weight: 600;
        color: var(--color-text-primary, #111827);
        margin: 0 0 4px 0;
      }

      .panel-subtitle {
        font-size: 12px;
        color: var(--color-text-secondary, #6b7280);
      }

      .section {
        margin-bottom: 24px;
        padding-bottom: 24px;
        border-bottom: 1px solid var(--color-border-primary, #e5e7eb);
      }

      .section:last-of-type {
        border-bottom: none;
        margin-bottom: 0;
        padding-bottom: 0;
      }

      .section-title {
        font-size: 13px;
        font-weight: 600;
        color: var(--color-text-primary, #111827);
        margin: 0 0 12px 0;
        text-transform: uppercase;
        letter-spacing: 0.5px;
      }

      /* Top Risks */
      .risks-list {
        display: flex;
        flex-direction: column;
        gap: 8px;
      }

      .risk-item {
        display: grid;
        grid-template-columns: 28px 1fr auto;
        gap: 12px;
        align-items: center;
        padding: 12px;
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

      .risk-rank {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 28px;
        height: 28px;
        background: #3b82f6;
        color: white;
        border-radius: 50%;
        font-weight: bold;
        font-size: 12px;
      }

      .risk-info {
        display: flex;
        flex-direction: column;
        gap: 4px;
      }

      .risk-domain {
        font-size: 13px;
        font-weight: 600;
        color: var(--color-text-primary, #111827);
      }

      .risk-details {
        display: flex;
        gap: 12px;
        font-size: 11px;
        color: var(--color-text-secondary, #6b7280);
      }

      .risk-score {
        font-weight: 500;
      }

      .risk-severity {
        display: flex;
        gap: 8px;
      }

      .severity-badge {
        display: inline-flex;
        align-items: center;
        padding: 4px 8px;
        border-radius: 4px;
        color: white;
        font-size: 11px;
        font-weight: 600;
      }

      /* Recommendations */
      .recommendations-list {
        display: flex;
        flex-direction: column;
        gap: 8px;
      }

      .recommendation-item {
        display: grid;
        grid-template-columns: 24px 1fr auto;
        gap: 12px;
        align-items: flex-start;
        padding: 12px;
        background: var(--color-bg-secondary, #f9fafb);
        border-radius: 6px;
        animation: slideIn 300ms ease forwards;
        opacity: 0;
      }

      .rec-number {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 24px;
        height: 24px;
        background: #f59e0b;
        color: white;
        border-radius: 50%;
        font-weight: bold;
        font-size: 11px;
        flex-shrink: 0;
      }

      .rec-content {
        padding-top: 2px;
      }

      .rec-text {
        font-size: 13px;
        color: var(--color-text-primary, #111827);
        margin: 0;
        line-height: 1.5;
      }

      .rec-action {
        padding-top: 2px;
      }

      .btn-rec-action {
        width: 24px;
        height: 24px;
        border: 1px solid #e5e7eb;
        background: white;
        border-radius: 4px;
        cursor: pointer;
        font-size: 12px;
        transition: all 200ms ease;
      }

      .btn-rec-action:hover {
        background: #10b981;
        border-color: #10b981;
        color: white;
      }

      /* Next Steps */
      .steps-list {
        display: flex;
        flex-direction: column;
        gap: 8px;
      }

      .step-item {
        display: grid;
        grid-template-columns: 24px 1fr auto;
        gap: 12px;
        align-items: center;
        padding: 12px;
        background: var(--color-bg-secondary, #f9fafb);
        border-radius: 6px;
        animation: slideIn 300ms ease forwards;
        opacity: 0;
      }

      .step-number {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 24px;
        height: 24px;
        background: #10b981;
        color: white;
        border-radius: 50%;
        font-weight: bold;
        font-size: 11px;
        flex-shrink: 0;
      }

      .step-text {
        font-size: 13px;
        color: var(--color-text-primary, #111827);
        margin: 0;
        line-height: 1.5;
      }

      .step-checkbox {
        width: 18px;
        height: 18px;
        cursor: pointer;
      }

      /* Impact Assessment */
      .impact-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(130px, 1fr));
        gap: 12px;
      }

      .impact-card {
        display: flex;
        gap: 12px;
        padding: 12px;
        background: var(--color-bg-secondary, #f9fafb);
        border-radius: 6px;
        border-left: 3px solid #3b82f6;
      }

      .impact-icon {
        font-size: 24px;
        line-height: 1;
      }

      .impact-content {
        flex: 1;
      }

      .impact-label {
        font-size: 10px;
        color: var(--color-text-secondary, #6b7280);
        font-weight: 500;
        text-transform: uppercase;
        letter-spacing: 0.5px;
      }

      .impact-value {
        font-size: 14px;
        font-weight: bold;
        color: var(--color-text-primary, #111827);
        margin-top: 4px;
      }

      /* Action Buttons */
      .action-buttons {
        display: flex;
        gap: 8px;
        flex-wrap: wrap;
      }

      .btn-action {
        flex: 1;
        min-width: 150px;
        padding: 10px 16px;
        border: 1px solid var(--color-border-primary, #e5e7eb);
        border-radius: 6px;
        font-size: 13px;
        font-weight: 500;
        cursor: pointer;
        transition: all 200ms ease;
      }

      .btn-action.primary {
        background: #3b82f6;
        color: white;
        border-color: #3b82f6;
      }

      .btn-action.primary:hover {
        background: #2563eb;
      }

      .btn-action.secondary {
        background: var(--color-bg-secondary, #f9fafb);
        color: var(--color-text-primary, #111827);
      }

      .btn-action.secondary:hover {
        background: var(--color-bg-tertiary, #e5e7eb);
      }

      .empty-state {
        padding: 16px;
        text-align: center;
        color: var(--color-text-secondary, #6b7280);
        font-size: 13px;
        background: var(--color-bg-secondary, #f9fafb);
        border-radius: 6px;
      }

      /* Responsive */
      @media (max-width: 768px) {
        .impact-grid {
          grid-template-columns: 1fr;
        }

        .action-buttons {
          flex-direction: column;
        }

        .btn-action {
          width: 100%;
        }
      }
    </style>
  `

  document.head.insertAdjacentHTML('beforeend', styles)
}

/**
 * Update recommendations panel
 */
export function updateRecommendationsPanel(container, summary) {
  renderRecommendationsPanel(container, summary)
}
