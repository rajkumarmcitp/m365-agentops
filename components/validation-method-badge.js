/**
 * Validation Method Badge Component
 * Displays which validation method was used for a control
 * Shows Graph API, PowerShell, or Fallback status
 */

import { html } from 'htm/preact'

export function ValidationMethodBadge({ validationMethod, fallbackUsed, small = false }) {
  const getMethodInfo = () => {
    if (fallbackUsed) {
      return {
        label: 'Fallback',
        icon: '⚠',
        title: 'Fallback validation used - Graph API failed',
        bgColor: '#fff3cd',
        textColor: '#856404'
      }
    }

    switch (validationMethod) {
      case 'graphAPI':
        return {
          label: 'G',
          fullLabel: 'Graph API',
          icon: '🔗',
          title: 'Validated using Microsoft Graph API',
          bgColor: '#cfe9ff',
          textColor: '#0078d4'
        }
      case 'powershell':
        return {
          label: 'P',
          fullLabel: 'PowerShell',
          icon: '📜',
          title: 'Validated using PowerShell',
          bgColor: '#fff4ce',
          textColor: '#ff9800'
        }
      case 'hybrid':
        return {
          label: 'H',
          fullLabel: 'Hybrid',
          icon: '🔄',
          title: 'Validated using hybrid method',
          bgColor: '#c8e6c9',
          textColor: '#2e7d32'
        }
      default:
        return {
          label: '?',
          fullLabel: 'Unknown',
          icon: '❓',
          title: 'Validation method unknown',
          bgColor: '#e0e0e0',
          textColor: '#666'
        }
    }
  }

  const info = getMethodInfo()

  if (small) {
    // Small badge format (just letter or icon)
    return html`
      <span class="validation-badge-small"
        style=${{
          background: info.bgColor,
          color: info.textColor,
          padding: '2px 6px',
          borderRadius: '3px',
          fontSize: '11px',
          fontWeight: '600',
          whiteSpace: 'nowrap'
        }}
        title=${info.title}
      >
        ${info.label}
      </span>
    `
  }

  // Full badge format
  return html`
    <div class="validation-method-badge">
      <div class="badge-header">
        <span class="badge-icon">${info.icon}</span>
        <span class="badge-method">${info.fullLabel || info.label}</span>
        ${fallbackUsed && html`<span class="badge-warning">Fallback</span>`}
      </div>
      <div class="badge-title">${info.title}</div>

      <style>${`
        .validation-method-badge {
          background: ${info.bgColor};
          border: 1px solid ${info.textColor}20;
          border-radius: 6px;
          padding: 10px 12px;
          margin: 8px 0;
        }

        .badge-header {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 4px;
        }

        .badge-icon {
          font-size: 16px;
        }

        .badge-method {
          font-weight: 600;
          color: ${info.textColor};
          font-size: 13px;
        }

        .badge-warning {
          background: #ff6b6b;
          color: white;
          padding: 2px 6px;
          border-radius: 3px;
          font-size: 10px;
          font-weight: 600;
          margin-left: 4px;
        }

        .badge-title {
          font-size: 12px;
          color: ${info.textColor}cc;
        }
      `}</style>
    </div>
  `
}

/**
 * Validation Execution Details Component
 */
export function ValidationExecutionDetails({ executionTime, endpoint, command, fallbackReason }) {
  return html`
    <div class="validation-execution-details">
      <div class="detail-row">
        <span class="detail-label">Execution Time:</span>
        <span class="detail-value">${executionTime || 0}ms</span>
      </div>

      ${endpoint && html`
        <div class="detail-row">
          <span class="detail-label">Endpoint:</span>
          <span class="detail-value" style=${{ fontFamily: 'monospace', fontSize: '12px' }}>
            ${endpoint}
          </span>
        </div>
      `}

      ${command && html`
        <div class="detail-row">
          <span class="detail-label">Command:</span>
          <span class="detail-value" style=${{ fontFamily: 'monospace', fontSize: '12px' }}>
            ${command}
          </span>
        </div>
      `}

      ${fallbackReason && html`
        <div class="detail-row warning">
          <span class="detail-label">Fallback Reason:</span>
          <span class="detail-value">${fallbackReason}</span>
        </div>
      `}

      <style>${`
        .validation-execution-details {
          background: #f5f5f5;
          border: 1px solid #e0e0e0;
          border-radius: 4px;
          padding: 12px;
          margin: 8px 0;
          font-size: 12px;
        }

        .detail-row {
          display: flex;
          justify-content: space-between;
          padding: 6px 0;
          border-bottom: 1px solid #e8e8e8;
        }

        .detail-row:last-child {
          border-bottom: none;
        }

        .detail-row.warning {
          background: #fff3cd;
          padding: 8px 10px;
          border-radius: 3px;
          margin: 8px 0;
        }

        .detail-label {
          font-weight: 500;
          color: #666;
        }

        .detail-value {
          color: #1a1a1a;
          text-align: right;
          max-width: 60%;
          word-break: break-word;
        }
      `}</style>
    </div>
  `
}

/**
 * Validation Method Summary Component
 * Shows overview of validation methods used
 */
export function ValidationMethodSummary({ summary }) {
  if (!summary) return null

  const total = summary.totalControls || 0
  const graphApi = summary.graphAPIControls || 0
  const powershell = summary.powerShellControls || 0
  const fallback = summary.fallbackControls || 0

  return html`
    <div class="validation-method-summary">
      <h3>Validation Method Summary</h3>
      <div class="summary-grid">
        <div class="summary-item">
          <div class="summary-number">${graphApi}</div>
          <div class="summary-label">Graph API</div>
          <div class="summary-percentage">${total > 0 ? Math.round((graphApi / total) * 100) : 0}%</div>
        </div>
        <div class="summary-item">
          <div class="summary-number">${powershell}</div>
          <div class="summary-label">PowerShell</div>
          <div class="summary-percentage">${total > 0 ? Math.round((powershell / total) * 100) : 0}%</div>
        </div>
        <div class="summary-item ${fallback > 0 ? 'warning' : ''}">
          <div class="summary-number">${fallback}</div>
          <div class="summary-label">Fallbacks</div>
          <div class="summary-percentage">${total > 0 ? Math.round((fallback / total) * 100) : 0}%</div>
        </div>
        <div class="summary-item">
          <div class="summary-number">${Math.round(summary.averageExecutionTime || 0)}ms</div>
          <div class="summary-label">Avg Time</div>
          <div class="summary-percentage">per control</div>
        </div>
      </div>

      <style>${`
        .validation-method-summary {
          background: white;
          border: 1px solid #e0e0e0;
          border-radius: 6px;
          padding: 16px;
          margin: 16px 0;
        }

        .validation-method-summary h3 {
          margin: 0 0 12px 0;
          font-size: 14px;
          font-weight: 600;
          color: #1a1a1a;
        }

        .summary-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
          gap: 12px;
        }

        .summary-item {
          background: #f5f5f5;
          border: 1px solid #e0e0e0;
          border-radius: 4px;
          padding: 12px;
          text-align: center;
        }

        .summary-item.warning {
          background: #fff3cd;
          border-color: #ffc107;
        }

        .summary-number {
          font-size: 20px;
          font-weight: 600;
          color: #0078d4;
          margin-bottom: 4px;
        }

        .summary-item.warning .summary-number {
          color: #ff6b6b;
        }

        .summary-label {
          font-size: 12px;
          color: #666;
          font-weight: 500;
          margin-bottom: 4px;
        }

        .summary-percentage {
          font-size: 11px;
          color: #999;
        }
      `}</style>
    </div>
  `
}
