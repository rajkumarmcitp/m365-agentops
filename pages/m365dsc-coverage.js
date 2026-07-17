/**
 * M365DSC Coverage Dashboard
 * Shows comprehensive M365 resource coverage via Microsoft365DSC
 * Independent from existing backup system
 */

import { customSkeleton } from './skeleton.js'
import { showToast } from './toast.js'

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:3000'
let coverageData = null

export function initM365DSCCoverage() {
  const el = document.getElementById('page-m365dsc-coverage')
  if (!el) return

  // Show skeleton
  el.innerHTML = customSkeleton.renderPageWithTable(
    '🔍 M365DSC Coverage Analysis',
    'Comprehensive Microsoft 365 configuration coverage via Microsoft365DSC',
    3,
    ['Service', 'Resource Types', 'Coverage'],
    8
  )

  // Load data
  setTimeout(() => loadM365DSCCoverage(el), 300)
}

async function loadM365DSCCoverage(el) {
  try {
    // Trigger M365DSC collection
    console.log('🚀 Triggering M365DSC collection...')
    showToast('Starting M365DSC coverage analysis...', 'info')

    const response = await fetch(`${API_BASE}/api/m365dsc/collect`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    })

    const data = await response.json()

    if (data.success) {
      coverageData = data
      renderCoverageDashboard(el, data)
      showToast('M365DSC coverage analysis complete!', 'success')
    } else {
      renderError(el, `Collection failed: ${data.error}`)
      showToast(`Error: ${data.error}`, 'error')
    }
  } catch (error) {
    console.error('Coverage load error:', error)
    renderError(el, error.message)
    showToast('Failed to load coverage data', 'error')
  }
}

function renderCoverageDashboard(el, data) {
  const coverage = data.coverage || {}
  const byService = coverage.byService || {}

  const html = `
    <div class="card">
      <div style="padding: 16px; border-bottom: 1px solid var(--color-border);">
        <div style="font-weight: 600; font-size: 14px;">M365DSC Coverage Analysis</div>
        <div style="font-size: 12px; color: var(--color-text-secondary); margin-top: 4px;">
          Last updated: ${new Date(coverage.timestamp).toLocaleString()}
        </div>
      </div>

      <div style="padding: 16px;">
        <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; margin-bottom: 24px;">
          <div style="background: var(--color-bg-secondary); padding: 12px; border-radius: 6px;">
            <div style="font-size: 28px; font-weight: 700; color: var(--color-primary);">${coverage.total || 0}</div>
            <div style="font-size: 12px; color: var(--color-text-secondary);">Resource Types</div>
          </div>
          <div style="background: var(--color-bg-secondary); padding: 12px; border-radius: 6px;">
            <div style="font-size: 28px; font-weight: 700; color: var(--color-success);">${coverage.totalInstances || 0}</div>
            <div style="font-size: 12px; color: var(--color-text-secondary);">Instances</div>
          </div>
          <div style="background: var(--color-bg-secondary); padding: 12px; border-radius: 6px;">
            <div style="font-size: 28px; font-weight: 700; color: var(--color-warning);">${Object.keys(byService).length}</div>
            <div style="font-size: 12px; color: var(--color-text-secondary);">Services</div>
          </div>
          <div style="background: var(--color-bg-secondary); padding: 12px; border-radius: 6px;">
            <div style="font-size: 28px; font-weight: 700; color: var(--color-info);">${data.executionTime || 0}s</div>
            <div style="font-size: 12px; color: var(--color-text-secondary);">Collection Time</div>
          </div>
        </div>
      </div>

      <div style="padding: 16px; border-top: 1px solid var(--color-border);">
        <div style="font-weight: 600; font-size: 13px; margin-bottom: 12px;">Service Coverage Breakdown</div>
        <div style="overflow-x: auto;">
          <table>
            <thead>
              <tr>
                <th style="width: 25%;">Service</th>
                <th style="width: 15%;">Resource Types</th>
                <th style="width: 60%;">Coverage Details</th>
              </tr>
            </thead>
            <tbody>
              ${Object.entries(byService)
                .sort((a, b) => b[1].count - a[1].count)
                .map(([service, stats]) => {
                  const barWidth = (stats.count / (coverage.total || 1)) * 100
                  return `
                    <tr>
                      <td>${service}</td>
                      <td style="font-weight: 600;">${stats.count}</td>
                      <td>
                        <div style="display: flex; align-items: center; gap: 8px;">
                          <div style="flex: 1; background: var(--color-bg-secondary); border-radius: 4px; height: 24px; position: relative; overflow: hidden;">
                            <div style="width: ${barWidth}%; background: linear-gradient(90deg, var(--color-primary), var(--color-success)); height: 100%; border-radius: 4px; display: flex; align-items: center; justify-content: flex-end; padding-right: 8px; color: white; font-size: 11px; font-weight: 600;">
                              ${Math.round(barWidth)}%
                            </div>
                          </div>
                        </div>
                        ${stats.types.length > 0 ? `
                          <div style="font-size: 10px; color: var(--color-text-tertiary); margin-top: 4px;">
                            Sample types: ${stats.types.slice(0, 3).join(', ')}${stats.types.length > 3 ? ` +${stats.types.length - 3} more` : ''}
                          </div>
                        ` : ''}
                      </td>
                    </tr>
                  `
                })
                .join('')}
            </tbody>
          </table>
        </div>
      </div>

      <div style="padding: 16px; border-top: 1px solid var(--color-border); background: var(--color-bg-secondary);">
        <div style="display: flex; gap: 12px; margin-bottom: 12px;">
          <button class="btn btn-primary" onclick="location.reload()" style="flex: 1;">
            <i class="ti ti-refresh"></i> Refresh Coverage
          </button>
          <button class="btn btn-secondary" onclick="downloadCoverageReport()" style="flex: 1;">
            <i class="ti ti-download"></i> Download Report
          </button>
        </div>
        <div style="font-size: 11px; color: var(--color-text-tertiary);">
          💡 This analysis uses Microsoft365DSC to scan your entire M365 tenant.
          It covers 250+ resource types across all services and shows what configurations
          are available for backup and restore.
        </div>
      </div>
    </div>
  `

  el.innerHTML = html
}

function renderError(el, message) {
  el.innerHTML = `
    <div class="card" style="padding: 20px; text-align: center;">
      <div style="font-size: 24px; margin-bottom: 12px;">⚠️</div>
      <div style="font-weight: 600; margin-bottom: 8px;">Coverage Analysis Failed</div>
      <div style="color: var(--color-text-secondary); margin-bottom: 16px;">
        ${message}
      </div>
      <button class="btn btn-primary" onclick="location.reload()">
        Try Again
      </button>
    </div>
  `
}

window.downloadCoverageReport = function() {
  if (!coverageData) {
    showToast('No data available', 'error')
    return
  }

  const report = JSON.stringify(coverageData, null, 2)
  const blob = new Blob([report], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `m365dsc-coverage-${new Date().toISOString().split('T')[0]}.json`
  a.click()
  URL.revokeObjectURL(url)

  showToast('Report downloaded!', 'success')
}
