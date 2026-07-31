// ============================================================
// Trend Chart Component
// Displays 30-day compliance trend with projection
// ============================================================

// Load Chart.js from CDN if not already loaded
function ensureChartJsLoaded() {
  if (window.Chart) return Promise.resolve()

  return new Promise((resolve, reject) => {
    const script = document.createElement('script')
    script.src = 'https://cdn.jsdelivr.net/npm/chart.js@4.4.0/dist/chart.umd.min.js'
    script.onload = resolve
    script.onerror = reject
    document.head.appendChild(script)
  })
}

export async function renderTrendChart(container, trend) {
  if (!container || !trend || !trend.history || trend.history.length === 0) {
    container.innerHTML = '<div class="trend-chart"><p>No trend data available</p></div>'
    return
  }

  try {
    await ensureChartJsLoaded()

    const trendIcon = getTrendIcon(trend.direction)
    const trendColor = getTrendColor(trend.direction)

    const html = `
      <div class="trend-chart">
        <div class="chart-header">
          <h2>30-Day Compliance Trend</h2>
          <div class="chart-legend">
            <div class="legend-item">
              <span class="legend-dot actual" style="background-color: #3b82f6"></span>
              <span>Actual Score</span>
            </div>
            <div class="legend-item">
              <span class="legend-dot projection" style="border: 2px dashed #10b981"></span>
              <span>Projection</span>
            </div>
          </div>
        </div>

        <canvas id="trend-canvas" class="trend-canvas"></canvas>

        <div class="trend-analysis">
          <div class="analysis-header">
            <h3>Trend Analysis</h3>
          </div>

          <div class="trend-metrics">
            <div class="metric">
              <div class="metric-icon" style="color: ${trendColor}">${trendIcon}</div>
              <div class="metric-content">
                <div class="metric-label">Direction</div>
                <div class="metric-value">${trend.direction}</div>
              </div>
            </div>

            <div class="metric">
              <div class="metric-icon">📊</div>
              <div class="metric-content">
                <div class="metric-label">Velocity</div>
                <div class="metric-value">
                  ${trend.velocity > 0 ? '+' : ''}${trend.velocity.toFixed(2)}/day
                </div>
              </div>
            </div>

            <div class="metric">
              <div class="metric-icon">🎯</div>
              <div class="metric-content">
                <div class="metric-label">Projected (30 days)</div>
                <div class="metric-value" style="color: ${getProjectionColor(trend.projection)}">
                  ${trend.projection.toFixed(1)}%
                </div>
              </div>
            </div>
          </div>

          <div class="trend-insight">
            ${renderTrendInsight(trend)}
          </div>
        </div>
      </div>
    `

    container.innerHTML = html
    addChartStyles()

    // Render chart
    renderChart(trend)
  } catch (error) {
    console.error('Error rendering trend chart:', error)
    container.innerHTML = '<div class="trend-chart"><p>Error loading chart library</p></div>'
  }
}

/**
 * Render Chart.js chart
 */
function renderChart(trend) {
  const canvas = document.getElementById('trend-canvas')
  if (!canvas) return

  const ctx = canvas.getContext('2d')

  // Prepare data
  const labels = trend.history.map(h => {
    const date = new Date(h.date)
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  })

  const actualData = trend.history.map(h => h.score)

  // Calculate projection line
  const n = actualData.length
  const x_values = Array.from({ length: n }, (_, i) => i)
  const y_values = actualData

  // Linear regression
  const sumX = x_values.reduce((a, b) => a + b, 0)
  const sumY = y_values.reduce((a, b) => a + b, 0)
  const sumXY = x_values.reduce((sum, x, i) => sum + x * y_values[i], 0)
  const sumX2 = x_values.reduce((sum, x) => sum + x * x, 0)

  const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX)
  const intercept = (sumY - slope * sumX) / n

  // Project 30 days forward (add projection points)
  const projectionStart = n - 1
  const projectionDays = 30
  const projectionData = Array.from({ length: projectionDays }, (_, i) => {
    return intercept + slope * (projectionStart + i)
  })

  // Create chart
  const chart = new window.Chart(ctx, {
    type: 'line',
    data: {
      labels: labels,
      datasets: [
        {
          label: 'Actual Score',
          data: actualData,
          borderColor: '#3b82f6',
          backgroundColor: 'rgba(59, 130, 246, 0.1)',
          borderWidth: 2,
          fill: true,
          tension: 0.4,
          pointRadius: 4,
          pointBackgroundColor: '#3b82f6',
          pointBorderColor: '#ffffff',
          pointBorderWidth: 2,
          pointHoverRadius: 6,
        },
        {
          label: 'Projection (30 days)',
          data: [
            ...Array(actualData.length - 1).fill(null),
            actualData[actualData.length - 1],
            ...projectionData
          ],
          borderColor: '#10b981',
          borderDash: [5, 5],
          borderWidth: 2,
          fill: false,
          tension: 0.4,
          pointRadius: 0,
          pointHoverRadius: 4,
          spanGaps: true,
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: true,
      interaction: {
        mode: 'index',
        intersect: false
      },
      plugins: {
        legend: {
          display: false
        },
        tooltip: {
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          padding: 12,
          titleFont: { size: 13, weight: 'bold' },
          bodyFont: { size: 12 },
          borderColor: 'rgba(255, 255, 255, 0.2)',
          borderWidth: 1,
          displayColors: true,
          callbacks: {
            label: function(context) {
              let label = context.dataset.label || ''
              if (label) label += ': '
              if (context.parsed.y !== null) {
                label += context.parsed.y.toFixed(1) + '%'
              }
              return label
            }
          }
        }
      },
      scales: {
        y: {
          beginAtZero: false,
          min: Math.max(0, Math.min(...actualData) - 5),
          max: Math.min(100, Math.max(...actualData, trend.projection) + 5),
          ticks: {
            callback: function(value) {
              return value.toFixed(0) + '%'
            },
            font: { size: 11 }
          },
          grid: {
            color: 'rgba(0, 0, 0, 0.05)',
            drawBorder: false
          }
        },
        x: {
          ticks: {
            font: { size: 11 }
          },
          grid: {
            display: false,
            drawBorder: false
          }
        }
      }
    }
  })

  return chart
}

/**
 * Render trend insight
 */
function renderTrendInsight(trend) {
  const velocity = trend.velocity
  const projection = trend.projection
  const current = trend.history[trend.history.length - 1]?.score || 0

  let insight = ''

  if (velocity > 1) {
    insight = `🚀 Strong improvement trend. If this pace continues, compliance will reach ${projection.toFixed(1)}% in 30 days.`
  } else if (velocity > 0.5) {
    insight = `📈 Positive trajectory. Steady improvement with an expected score of ${projection.toFixed(1)}% in 30 days.`
  } else if (velocity > 0) {
    insight = `➡️ Slight improvement. Current pace suggests ${projection.toFixed(1)}% compliance in 30 days.`
  } else if (velocity > -0.5) {
    insight = `➡️ Minimal change. Compliance is relatively stable at ~${current.toFixed(1)}%.`
  } else if (velocity > -1) {
    insight = `📉 Gradual decline. If this trend continues, compliance may drop to ${projection.toFixed(1)}% in 30 days.`
  } else {
    insight = `🚨 Rapid decline. Immediate remediation needed. Projected score: ${projection.toFixed(1)}% in 30 days.`
  }

  return `
    <p class="insight-text">${insight}</p>
    <div class="insight-actions">
      <p class="action-label">Recommended Actions:</p>
      <ul class="action-list">
        ${velocity < -0.5 ? '<li>Prioritize remediation of failing controls</li>' : ''}
        ${current < 70 ? '<li>Focus on critical and high-severity controls first</li>' : ''}
        ${velocity > 0 ? '<li>Maintain current remediation pace</li>' : ''}
        <li>Schedule follow-up review in 7 days</li>
      </ul>
    </div>
  `
}

/**
 * Get trend icon
 */
function getTrendIcon(direction) {
  if (!direction || typeof direction !== 'string') return '➡️'
  if (direction.includes('Improving')) return '📈'
  if (direction.includes('Declining')) return '📉'
  return '➡️'
}

/**
 * Get trend color
 */
function getTrendColor(direction) {
  if (!direction || typeof direction !== 'string') return '#6b7280'
  if (direction.includes('Improving')) return '#10b981'
  if (direction.includes('Declining')) return '#ef4444'
  return '#6b7280'
}

/**
 * Get projection color
 */
function getProjectionColor(projection) {
  if (projection >= 80) return '#10b981'
  if (projection >= 70) return '#3b82f6'
  if (projection >= 60) return '#f59e0b'
  return '#ef4444'
}

/**
 * Add component styles
 */
function addChartStyles() {
  if (document.getElementById('trend-chart-styles')) return

  const styles = `
    <style id="trend-chart-styles">
      .trend-chart {
        background: var(--color-bg-primary, #ffffff);
        border: 1px solid var(--color-border-primary, #e5e7eb);
        border-radius: 12px;
        padding: 24px;
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
      }

      .chart-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 24px;
      }

      .chart-header h2 {
        font-size: 18px;
        font-weight: 600;
        color: var(--color-text-primary, #111827);
        margin: 0;
      }

      .chart-legend {
        display: flex;
        gap: 16px;
      }

      .legend-item {
        display: flex;
        align-items: center;
        gap: 6px;
        font-size: 12px;
        color: var(--color-text-secondary, #6b7280);
      }

      .legend-dot {
        width: 10px;
        height: 10px;
        border-radius: 2px;
      }

      .trend-canvas {
        width: 100%;
        height: 300px;
        margin-bottom: 24px;
      }

      .trend-analysis {
        padding-top: 24px;
        border-top: 1px solid var(--color-border-primary, #e5e7eb);
      }

      .analysis-header {
        margin-bottom: 16px;
      }

      .analysis-header h3 {
        font-size: 14px;
        font-weight: 600;
        color: var(--color-text-primary, #111827);
        margin: 0;
      }

      .trend-metrics {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
        gap: 16px;
        margin-bottom: 16px;
        padding: 16px;
        background: var(--color-bg-secondary, #f9fafb);
        border-radius: 8px;
      }

      .metric {
        display: flex;
        gap: 12px;
        align-items: center;
      }

      .metric-icon {
        font-size: 24px;
        line-height: 1;
      }

      .metric-content {
        flex: 1;
      }

      .metric-label {
        font-size: 11px;
        color: var(--color-text-secondary, #6b7280);
        font-weight: 500;
        text-transform: uppercase;
        letter-spacing: 0.5px;
      }

      .metric-value {
        font-size: 16px;
        font-weight: bold;
        color: var(--color-text-primary, #111827);
        margin-top: 4px;
        font-variant-numeric: tabular-nums;
      }

      .trend-insight {
        padding: 12px;
        background: #f0f9ff;
        border-left: 3px solid #3b82f6;
        border-radius: 6px;
      }

      .insight-text {
        font-size: 13px;
        color: var(--color-text-primary, #111827);
        margin: 0 0 12px 0;
        line-height: 1.5;
      }

      .insight-actions {
        margin-top: 12px;
      }

      .action-label {
        font-size: 12px;
        font-weight: 600;
        color: var(--color-text-primary, #111827);
        margin: 0 0 8px 0;
      }

      .action-list {
        list-style: none;
        padding: 0;
        margin: 0;
        display: flex;
        flex-direction: column;
        gap: 6px;
      }

      .action-list li {
        font-size: 12px;
        color: var(--color-text-secondary, #6b7280);
        padding-left: 20px;
        position: relative;
      }

      .action-list li::before {
        content: '→';
        position: absolute;
        left: 0;
        color: #3b82f6;
        font-weight: bold;
      }

      /* Responsive */
      @media (max-width: 1024px) {
        .chart-header {
          flex-direction: column;
          gap: 12px;
          align-items: flex-start;
        }

        .chart-legend {
          flex-wrap: wrap;
        }

        .trend-metrics {
          grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
        }
      }

      @media (max-width: 768px) {
        .trend-canvas {
          height: 250px;
        }

        .trend-metrics {
          grid-template-columns: 1fr;
        }

        .metric {
          flex-direction: column;
          align-items: flex-start;
        }
      }
    </style>
  `

  document.head.insertAdjacentHTML('beforeend', styles)
}

/**
 * Update trend chart
 */
export async function updateTrendChart(container, trend) {
  await renderTrendChart(container, trend)
}
