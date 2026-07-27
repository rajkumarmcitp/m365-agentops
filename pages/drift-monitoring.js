import { getOpenDrifts, getDriftHistory, getRecommendation, approveRecommendation, rejectRecommendation, markDriftResolved } from '../lib/compliance-drift-client.js'
import { callAPI } from '../lib/api-client.js'

let complianceDrifts = {}
let selectedDriftTab = 'cis'

export function initDriftMonitoring() {
  const el = document.getElementById('page-driftmonitoring')
  if (!el) return

  el.innerHTML = renderDriftMonitoringPage()
  attachDriftTabHandlers()
  loadAllDriftData()
}

function renderDriftMonitoringPage() {
  return `
    <div class="page-header">
      <div class="page-header-content">
        <div class="page-title"><i class="fas fa-exclamation-triangle"></i> Drifts Monitoring</div>
        <div class="page-subtitle">Real-time configuration drift detection for CIS Controls & Conditional Access Policies</div>
      </div>
      <button class="btn btn-primary" onclick="window.refreshDriftsPage()" style="margin-left:auto">
        <i class="fas fa-sync-alt"></i> Refresh
      </button>
    </div>

    <div style="display:flex;gap:8px;margin-bottom:16px;border-bottom:1px solid var(--color-border-primary);padding:0 16px">
      <button class="drift-tab-btn" data-drift-tab="cis" style="padding:12px 16px;border:none;background:none;cursor:pointer;font-weight:600;font-size:14px;color:var(--color-text-secondary);border-bottom:3px solid transparent;transition:all 200ms"
              onclick="window.switchDriftTab('cis')">
        <i class="fas fa-tasks"></i> CIS Control Drifts
      </button>
      <button class="drift-tab-btn" data-drift-tab="ca" style="padding:12px 16px;border:none;background:none;cursor:pointer;font-weight:600;font-size:14px;color:var(--color-text-secondary);border-bottom:3px solid transparent;transition:all 200ms"
              onclick="window.switchDriftTab('ca')">
        <i class="fas fa-shield-alt"></i> CA Policy Drifts
      </button>
    </div>

    <div id="drift-content">
      <!-- Tab content will be loaded here -->
    </div>
  `
}

function attachDriftTabHandlers() {
  window.switchDriftTab = function(tab) {
    selectedDriftTab = tab
    const contentEl = document.getElementById('drift-content')

    // Update tab styling
    document.querySelectorAll('.drift-tab-btn').forEach(btn => {
      btn.style.color = btn.dataset.driftTab === tab ? 'var(--clr-primary)' : 'var(--color-text-secondary)'
      btn.style.borderBottomColor = btn.dataset.driftTab === tab ? 'var(--clr-primary)' : 'transparent'
    })

    if (tab === 'cis') {
      contentEl.innerHTML = renderCISDriftsContent()
      loadCISDriftData()
    } else {
      contentEl.innerHTML = renderCADriftsContent()
      loadCADriftData()
    }
  }

  window.refreshDriftsPage = function() {
    loadAllDriftData()
  }

  // Initialize with CIS tab
  setTimeout(() => window.switchDriftTab('cis'), 100)
}

async function loadAllDriftData() {
  await loadCISDriftData()
  await loadCADriftData()
}

function renderCISDriftsContent() {
  return `
    <div id="cis-drifts-container">
      <div style="text-align:center;padding:40px;color:var(--color-text-secondary)">
        <div class="spinner"></div>
        <div style="margin-top:16px">Loading CIS control drifts...</div>
      </div>
    </div>
  `
}

function renderCADriftsContent() {
  return `
    <div id="ca-drifts-container">
      <div style="text-align:center;padding:40px;color:var(--color-text-secondary)">
        <div class="spinner"></div>
        <div style="margin-top:16px">Loading CA policy drifts...</div>
      </div>
    </div>
  `
}

async function loadCISDriftData() {
  try {
    const drifts = await getOpenDrifts()
    complianceDrifts = {}

    for (const drift of drifts) {
      if (!complianceDrifts[drift.control_id]) {
        complianceDrifts[drift.control_id] = []
      }
      complianceDrifts[drift.control_id].push(drift)
    }

    const container = document.getElementById('cis-drifts-container')
    if (!container) return

    const allDrifts = Object.values(complianceDrifts).flat()
    const openDrifts = allDrifts.filter(d => !d.drift_resolved_at)
    const criticalDrifts = openDrifts.filter(d => d.severity === 'CRITICAL')
    const highDrifts = openDrifts.filter(d => d.severity === 'HIGH')

    container.innerHTML = renderCISContentWithData(openDrifts, criticalDrifts, highDrifts)
  } catch (err) {
    console.error('Failed to load CIS drifts:', err)
    const container = document.getElementById('cis-drifts-container')
    if (container) {
      container.innerHTML = `<div class="card" style="background:var(--clr-danger-bg);color:var(--clr-danger-text);padding:16px">
        <i class="fas fa-exclamation-circle"></i> Failed to load CIS drifts
      </div>`
    }
  }
}

function renderCISContentWithData(openDrifts, criticalDrifts, highDrifts) {
  const severityColors = {
    'CRITICAL': { bg: '#FCE8E8', text: '#A32D2D' },
    'HIGH': { bg: '#FEF3C7', text: '#D97706' },
    'MEDIUM': { bg: '#FFF7ED', text: '#B45309' },
    'LOW': { bg: '#F0FDF4', text: '#15803D' }
  }

  const driftTypeLabels = {
    'disabled': '⊗ Disabled',
    'deleted': '🗑️ Deleted',
    'modified': '✏️ Modified'
  }

  const formatTimeAgo = (timestamp) => {
    if (!timestamp) return 'unknown'
    const date = new Date(timestamp)
    const now = new Date()
    const seconds = Math.floor((now - date) / 1000)
    if (seconds < 60) return `${seconds}s ago`
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`
    return `${Math.floor(seconds / 86400)}d ago`
  }

  const sorted = [...openDrifts].sort((a, b) => {
    const severityOrder = { CRITICAL: 0, HIGH: 1, MEDIUM: 2, LOW: 3 }
    return (severityOrder[a.severity] || 4) - (severityOrder[b.severity] || 4)
  })

  let html = `
    <div style="display:flex;gap:12px;margin-bottom:16px;flex-wrap:wrap">
      <div class="card" style="flex:1;min-width:140px;padding:12px;background:var(--color-bg-secondary);text-align:center">
        <div style="font-size:24px;font-weight:700;color:var(--color-primary)">${openDrifts.length}</div>
        <div style="font-size:11px;color:var(--color-text-secondary);margin-top:4px">Open Drifts</div>
      </div>
      <div class="card" style="flex:1;min-width:140px;padding:12px;background:#FCE8E8;text-align:center">
        <div style="font-size:24px;font-weight:700;color:#A32D2D">${criticalDrifts.length}</div>
        <div style="font-size:11px;color:#A32D2D;margin-top:4px">Critical</div>
      </div>
      <div class="card" style="flex:1;min-width:140px;padding:12px;background:#FEF3C7;text-align:center">
        <div style="font-size:24px;font-weight:700;color:#D97706">${highDrifts.length}</div>
        <div style="font-size:11px;color:#D97706;margin-top:4px">High</div>
      </div>
    </div>
  `

  if (openDrifts.length === 0) {
    html += `
      <div style="padding:40px;text-align:center;background:var(--color-background-secondary);border-radius:4px">
        <div style="font-size:48px;margin-bottom:16px">✅</div>
        <h3 style="margin:0 0 8px 0;color:var(--color-text-primary)">No CIS control drifts detected</h3>
        <p style="margin:0;font-size:13px;color:var(--color-text-secondary)">All CIS controls are in compliance.</p>
      </div>
    `
  } else {
    html += `
      <div class="card" style="padding:0;overflow:hidden;border:1px solid var(--color-border-secondary)">
        <div class="card-header">
          <div class="card-title"><i class="fas fa-layer-group"></i> CIS Control Configuration Drifts</div>
        </div>
        <div style="display:grid;grid-template-columns:100px 1fr 150px 150px 200px;gap:0;background:var(--color-bg-tertiary);padding:12px;font-size:11px;font-weight:600;text-transform:uppercase;color:var(--color-text-secondary);border-bottom:1px solid var(--color-border-secondary)">
          <div>Severity</div>
          <div>Control</div>
          <div>Type</div>
          <div>Detected</div>
          <div>Status</div>
        </div>
        ${sorted.map(drift => {
          const color = severityColors[drift.severity] || severityColors.LOW
          const statusText = drift.approval_status === 'pending' ? 'Pending Approval' :
                            drift.approval_status === 'approved' ? 'Approved' :
                            drift.approval_status === 'rejected' ? 'Rejected' : 'No Recommendation'
          return `
            <div style="display:grid;grid-template-columns:100px 1fr 150px 150px 200px;gap:0;padding:12px;border-bottom:0.5px solid var(--color-border-tertiary);align-items:center">
              <div style="font-weight:600;color:${color.text};background:${color.bg};padding:3px 8px;border-radius:3px;text-align:center;font-size:10px">${drift.severity}</div>
              <div style="font-size:11px">
                <div style="font-weight:600;margin-bottom:2px">${drift.control_id}</div>
                <div style="font-size:10px;color:var(--color-text-secondary)">${drift.control_name || 'Unknown control'}</div>
              </div>
              <div style="font-size:10px;color:var(--color-text-secondary)">${driftTypeLabels[drift.drift_type] || drift.drift_type}</div>
              <div style="font-size:10px;color:var(--color-text-secondary)">${formatTimeAgo(drift.drift_detected_at)}</div>
              <div style="display:flex;gap:8px;align-items:center">
                <span style="font-size:10px;color:var(--color-text-secondary)">${statusText}</span>
                <button class="btn btn-sm" onclick="window.showDriftDetails('${drift.control_id}')" style="padding:4px 12px;font-size:11px">View</button>
              </div>
            </div>
          `
        }).join('')}
      </div>
    `
  }

  return html
}

async function loadCADriftData() {
  try {
    const res = await callAPI('/cap/dashboard/drift')
    const container = document.getElementById('ca-drifts-container')
    if (!container) return

    if (!res.success || !res.data.policies) {
      container.innerHTML = '<div class="card" style="background:var(--clr-danger-bg);color:var(--clr-danger-text);padding:16px">Failed to load CA policies</div>'
      return
    }

    const policies = res.data.policies
    const policyDrifts = policies.filter(p => p.driftDetected)
    const driftCount = policyDrifts.length

    let html = `
      <div style="display:flex;gap:12px;margin-bottom:16px;flex-wrap:wrap">
        <div class="card" style="flex:1;min-width:140px;padding:12px;background:var(--color-bg-secondary);text-align:center">
          <div style="font-size:24px;font-weight:700;color:var(--color-primary)">${driftCount}</div>
          <div style="font-size:11px;color:var(--color-text-secondary);margin-top:4px">Policies with Drift</div>
        </div>
        <div class="card" style="flex:1;min-width:140px;padding:12px;background:var(--color-bg-secondary);text-align:center">
          <div style="font-size:24px;font-weight:700;color:var(--color-primary)">${policies.length}</div>
          <div style="font-size:11px;color:var(--color-text-secondary);margin-top:4px">Total Policies</div>
        </div>
      </div>
    `

    if (driftCount === 0) {
      html += `
        <div style="padding:40px;text-align:center;background:var(--color-background-secondary);border-radius:4px">
          <div style="font-size:48px;margin-bottom:16px">✅</div>
          <h3 style="margin:0 0 8px 0;color:var(--color-text-primary)">No CA policy drifts detected</h3>
          <p style="margin:0;font-size:13px;color:var(--color-text-secondary)">All policies are in sync with expected configuration.</p>
        </div>
      `
    } else {
      html += `
        <div class="card">
          <div class="card-header">
            <div class="card-title"><i class="fas fa-layer-group"></i> Conditional Access Policies - Configuration Drift</div>
          </div>
          <div style="overflow-x:auto;font-size:11px">
            <table style="width:100%;border-collapse:collapse">
              <thead>
                <tr style="background:var(--color-background-secondary);border-bottom:1px solid var(--color-border-tertiary)">
                  <th style="padding:10px;text-align:left;font-weight:600;color:var(--color-text-primary);width:200px">Policy Name</th>
                  <th style="padding:10px;text-align:left;font-weight:600;color:var(--color-text-primary)">Configuration</th>
                  <th style="padding:10px;text-align:center;font-weight:600;color:var(--color-text-primary);width:100px">Status</th>
                  <th style="padding:10px;text-align:left;font-weight:600;color:var(--color-text-primary);width:150px">Changed Field</th>
                </tr>
              </thead>
              <tbody>
      `

      policyDrifts.forEach((policy, idx) => {
        html += `
                <tr style="border-bottom:0.5px solid var(--color-border-tertiary);${idx % 2 === 0 ? 'background:var(--color-background-primary)' : 'background:var(--color-background-secondary)'}">
                  <td style="padding:10px;vertical-align:top;font-weight:600;color:var(--color-text-primary)">
                    <div>${policy.displayName}</div>
                    <div style="font-size:10px;color:var(--color-text-tertiary);margin-top:3px">${policy.policyId}</div>
                  </td>
                  <td style="padding:10px;vertical-align:top;color:var(--color-text-secondary)">
                    <div style="display:flex;flex-wrap:wrap;gap:6px">
                      ${Object.entries(policy.configuration || {}).slice(0, 3).map(([key, value]) => `
                        <span style="display:inline-block;background:var(--color-background-secondary);border:0.5px solid var(--color-border-tertiary);padding:4px 8px;border-radius:3px;font-size:10px;white-space:nowrap">
                          <strong>${key}:</strong> ${String(value).substring(0, 25)}${String(value).length > 25 ? '...' : ''}
                        </span>
                      `).join('')}
                    </div>
                  </td>
                  <td style="padding:10px;text-align:center;vertical-align:top">
                    <span style="display:inline-block;background:var(--clr-danger-bg);color:var(--clr-danger-text);padding:4px 8px;border-radius:3px;font-weight:600;font-size:10px">
                      <i class="fas fa-exclamation-circle"></i> Drift
                    </span>
                  </td>
                  <td style="padding:10px;vertical-align:top;color:var(--color-text-secondary)">
                    ${policy.changedControl ? `
                      <div style="background:var(--clr-warning-bg);border-left:3px solid var(--clr-warning-text);padding:6px;border-radius:3px">
                        <div style="font-weight:600;color:var(--clr-warning-text);font-size:10px;margin-bottom:3px">
                          ${policy.changedControl}
                        </div>
                        <div style="font-size:9px;color:var(--color-text-secondary)">
                          <div><strong>Expected:</strong> ${policy.previousValue}</div>
                          <div><strong>Current:</strong> ${policy.currentValue}</div>
                        </div>
                      </div>
                    ` : `
                      <span style="color:var(--color-text-tertiary);font-style:italic">No changes</span>
                    `}
                  </td>
                </tr>
        `
      })

      html += `
              </tbody>
            </table>
          </div>
        </div>
      `
    }

    container.innerHTML = html
  } catch (err) {
    console.error('Failed to load CA drift data:', err)
    const container = document.getElementById('ca-drifts-container')
    if (container) {
      container.innerHTML = '<div class="card" style="background:var(--clr-danger-bg);color:var(--clr-danger-text);padding:16px">Failed to load CA policy drifts</div>'
    }
  }
}
