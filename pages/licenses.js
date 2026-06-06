import { callAPI } from '../lib/api-client.js'

let realLicenses = []
let licenseSummary = { total: 0, consumed: 0, available: 0, utilizationPct: 0 }
let userAssignments = []
let groupLicensing = []
let complianceData = {}
let activeTab = 'summary'

const TABS = [
  { id: 'summary', label: 'Executive Summary', icon: 'ti-layout-dashboard' },
  { id: 'inventory', label: 'License Inventory', icon: 'ti-box' },
  { id: 'services', label: 'Service Plans', icon: 'ti-list-check' },
  { id: 'assignments', label: 'User Assignments', icon: 'ti-users' },
  { id: 'groups', label: 'Group Licensing', icon: 'ti-users-group' },
  { id: 'compliance', label: 'Compliance', icon: 'ti-shield-check' },
]

export async function initLicenses() {
  const el = document.getElementById('page-licenses')
  if (!el) return

  el.innerHTML = `<div style="padding:20px;text-align:center"><div class="spinner"></div><p>Loading comprehensive license data...</p></div>`

  // Fetch all license data in parallel
  try {
    console.log('📡 Fetching comprehensive license data...')
    const [licenses, assignments, groups, compliance] = await Promise.all([
      callAPI('/licenses'),
      callAPI('/licenses/assignments'),
      callAPI('/licenses/groups'),
      callAPI('/licenses/compliance')
    ])

    if (licenses.success && licenses.data) {
      realLicenses = licenses.data
      licenseSummary = licenses.summary || { total: 0, consumed: 0, available: 0, utilizationPct: 0 }
    }
    if (assignments.success && assignments.data) {
      userAssignments = assignments.data
    }
    if (groups.success && groups.data) {
      groupLicensing = groups.data
    }
    if (compliance.success && compliance.data) {
      complianceData = compliance.data
    }
    console.log(`✅ Loaded all license data`)
  } catch (error) {
    console.error('❌ Error loading license data:', error)
  }

  render(el)
}

function render(el) {
  el.innerHTML = `
    <div class="page-header">
      <div>
        <div class="page-title"><i class="ti ti-license"></i> License Management Dashboard</div>
        <div class="page-subtitle">Enterprise-wide licensing health, utilization, and compliance</div>
      </div>
      <div class="page-actions">
        <button class="btn" id="license-refresh"><i class="ti ti-refresh"></i> Refresh</button>
        <button class="btn btn-primary" id="license-export"><i class="ti ti-download"></i> Export</button>
      </div>
    </div>

    <!-- Tab Navigation -->
    <div style="display:flex;gap:0;border-bottom:1px solid var(--color-border-secondary);margin-bottom:16px;overflow-x:auto">
      ${TABS.map(t => `
        <button class="license-tab-btn ${activeTab === t.id ? 'active' : ''}" data-tab="${t.id}" style="padding:12px 16px;border:none;background:none;cursor:pointer;font-size:11px;font-weight:600;color:var(--color-text-secondary);border-bottom:2px solid transparent;white-space:nowrap;${activeTab === t.id ? 'color:var(--color-text-primary);border-bottom-color:var(--clr-info-text)' : ''}">
          <i class="ti ${t.icon}"></i> ${t.label}
        </button>
      `).join('')}
    </div>

    <!-- Tab Content -->
    <div id="tab-content">
      ${renderTab(activeTab)}
    </div>
  `

  // Attach event listeners
  el.querySelectorAll('.license-tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      activeTab = btn.dataset.tab
      render(el)
    })
  })

  el.querySelector('#license-refresh')?.addEventListener('click', () => {
    initLicenses()
  })

  el.querySelector('#license-export')?.addEventListener('click', () => {
    alert('Export functionality coming soon')
  })
}

function renderTab(tabId) {
  switch(tabId) {
    case 'summary': return renderExecutiveSummary()
    case 'inventory': return renderInventory()
    case 'services': return renderServicePlans()
    case 'assignments': return renderAssignments()
    case 'groups': return renderGroups()
    case 'compliance': return renderCompliance()
    default: return ''
  }
}

function renderExecutiveSummary() {
  return `
    <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:12px;margin-bottom:24px">
      <div class="card" style="padding:16px">
        <div style="font-size:10px;color:var(--color-text-tertiary);margin-bottom:6px">Total Licenses Purchased</div>
        <div style="font-size:24px;font-weight:700;color:var(--clr-info-text)">${licenseSummary.total.toLocaleString()}</div>
      </div>
      <div class="card" style="padding:16px">
        <div style="font-size:10px;color:var(--color-text-tertiary);margin-bottom:6px">Assigned Licenses</div>
        <div style="font-size:24px;font-weight:700;color:var(--clr-warning-text)">${licenseSummary.consumed.toLocaleString()}</div>
      </div>
      <div class="card" style="padding:16px">
        <div style="font-size:10px;color:var(--color-text-tertiary);margin-bottom:6px">Available Licenses</div>
        <div style="font-size:24px;font-weight:700;color:var(--clr-success-text)">${licenseSummary.available.toLocaleString()}</div>
      </div>
      <div class="card" style="padding:16px">
        <div style="font-size:10px;color:var(--color-text-tertiary);margin-bottom:6px">Utilization Rate</div>
        <div style="font-size:24px;font-weight:700;color:var(--clr-warning-text)">${licenseSummary.utilizationPct}%</div>
      </div>
    </div>

    <!-- Health Status -->
    <div class="card mb-3">
      <div class="card-header">
        <span class="card-title"><i class="ti ti-heart-handshake"></i> Licensing Health Overview</span>
      </div>
      ${realLicenses.map(l => `
        <div style="padding:12px;border-bottom:0.5px solid var(--color-border-tertiary);display:flex;align-items:center;justify-content:space-between">
          <div style="flex:1">
            <div style="font-weight:600;font-size:11px">${l.name || '—'}</div>
            <div style="font-size:10px;color:var(--color-text-tertiary);margin-top:3px">${l.consumed || 0} / ${l.total || 0} assigned</div>
          </div>
          <div style="display:flex;align-items:center;gap:8px;min-width:150px">
            <div class="score-bar" style="flex:1">
              <div class="score-bar-fill ${l.statusCls || 'success'}" style="width:${l.utilizationPct || 0}%"></div>
            </div>
            <span style="font-size:10px;font-weight:600;min-width:35px">${l.utilizationPct || 0}%</span>
            <span class="badge ${l.statusCls || 'success'}" style="min-width:70px;text-align:center">${l.status || 'healthy'}</span>
          </div>
        </div>
      `).join('')}
    </div>

    <!-- Critical Alerts -->
    ${realLicenses.some(l => l.status === 'critical') ? `
      <div class="alert-banner danger mb-3">
        <i class="ti ti-alert-triangle"></i>
        <strong>${realLicenses.filter(l => l.status === 'critical').length} license(s) at CRITICAL capacity</strong> — Immediate action required
      </div>
    ` : ''}
    ${realLicenses.some(l => l.status === 'monitor') ? `
      <div class="alert-banner warning">
        <i class="ti ti-alert-circle"></i>
        <strong>${realLicenses.filter(l => l.status === 'monitor').length} license(s) require monitoring</strong> — Plan additional purchases
      </div>
    ` : ''}
  `
}

function renderInventory() {
  return `
    <div class="card" style="padding:0;overflow:hidden">
      <table style="width:100%">
        <thead><tr>
          <th style="padding:12px;text-align:left;font-weight:600;font-size:11px;width:25%">Product Name / SKU</th>
          <th style="padding:12px;text-align:center;font-weight:600;font-size:11px;width:12%">Purchased</th>
          <th style="padding:12px;text-align:center;font-weight:600;font-size:11px;width:12%">Assigned</th>
          <th style="padding:12px;text-align:center;font-weight:600;font-size:11px;width:12%">Available</th>
          <th style="padding:12px;text-align:center;font-weight:600;font-size:11px;width:20%">Usage</th>
          <th style="padding:12px;text-align:center;font-weight:600;font-size:11px;width:19%">Status</th>
        </tr></thead>
        <tbody>
          ${realLicenses.map(l => `
            <tr style="border-bottom:0.5px solid var(--color-border-tertiary)">
              <td style="padding:12px"><strong style="font-size:11px">${l.name || '—'}</strong></td>
              <td style="padding:12px;text-align:center">${(l.total || 0).toLocaleString()}</td>
              <td style="padding:12px;text-align:center">${(l.consumed || 0).toLocaleString()}</td>
              <td style="padding:12px;text-align:center">${(l.available || 0).toLocaleString()}</td>
              <td style="padding:12px">
                <div style="display:flex;align-items:center;gap:8px">
                  <div class="score-bar" style="flex:1">
                    <div class="score-bar-fill ${l.statusCls || 'success'}" style="width:${l.utilizationPct || 0}%"></div>
                  </div>
                  <span style="font-size:10px;font-weight:600;min-width:30px">${l.utilizationPct || 0}%</span>
                </div>
              </td>
              <td style="padding:12px;text-align:center"><span class="badge ${l.statusCls || 'success'}" style="text-transform:capitalize">${l.status || 'healthy'}</span></td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>
  `
}

function renderServicePlans() {
  return `
    <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(350px,1fr));gap:16px">
      ${realLicenses.map(l => `
        <div class="card">
          <div class="card-header">
            <span class="card-title">${l.name || '—'}</span>
            <span class="badge ${l.statusCls || 'success'}">${l.utilizationPct || 0}%</span>
          </div>
          <div style="padding:12px;font-size:10px;color:var(--color-text-secondary);border-bottom:0.5px solid var(--color-border-tertiary)">
            ${(l.total || 0).toLocaleString()} licenses | ${(l.consumed || 0).toLocaleString()} assigned
          </div>
          <div style="padding:12px">
            <div style="font-weight:600;font-size:10px;margin-bottom:8px">Included Services:</div>
            <div style="display:grid;gap:6px">
              <div style="display:flex;align-items:center;gap:6px;font-size:10px">
                <i class="ti ti-circle-filled" style="color:var(--clr-success-text);font-size:6px"></i> Exchange Online
              </div>
              <div style="display:flex;align-items:center;gap:6px;font-size:10px">
                <i class="ti ti-circle-filled" style="color:var(--clr-success-text);font-size:6px"></i> Teams
              </div>
              <div style="display:flex;align-items:center;gap:6px;font-size:10px">
                <i class="ti ti-circle-filled" style="color:var(--clr-success-text);font-size:6px"></i> SharePoint Online
              </div>
              <div style="display:flex;align-items:center;gap:6px;font-size:10px">
                <i class="ti ti-circle-filled" style="color:var(--clr-success-text);font-size:6px"></i> OneDrive for Business
              </div>
            </div>
          </div>
        </div>
      `).join('')}
    </div>
  `
}

function renderAssignments() {
  return `
    <div class="card" style="padding:0;overflow:hidden">
      ${userAssignments.length === 0 ? `
        <div style="padding:20px;text-align:center;color:var(--color-text-tertiary)">
          <i class="ti ti-inbox" style="font-size:32px;margin-bottom:8px;display:block"></i>
          No user license assignments found
        </div>
      ` : `
        <table style="width:100%">
          <thead><tr>
            <th style="padding:12px;text-align:left;font-weight:600;font-size:11px">User Name / Email</th>
            <th style="padding:12px;text-align:left;font-weight:600;font-size:11px">Department</th>
            <th style="padding:12px;text-align:left;font-weight:600;font-size:11px">Licenses</th>
            <th style="padding:12px;text-align:left;font-weight:600;font-size:11px">Count</th>
          </tr></thead>
          <tbody>
            ${userAssignments.slice(0, 50).map(u => `
              <tr style="border-bottom:0.5px solid var(--color-border-tertiary)">
                <td style="padding:12px">
                  <div style="font-weight:600;font-size:11px">${u.displayName || '—'}</div>
                  <div style="font-size:10px;color:var(--color-text-tertiary)">${u.userPrincipalName || '—'}</div>
                </td>
                <td style="padding:12px;font-size:10px">${u.department || '—'}</td>
                <td style="padding:12px;font-size:10px">
                  ${(u.licenses || []).map(l => `<span class="badge secondary" style="margin-right:4px;margin-bottom:4px">${l.skuPartNumber || l.skuId}</span>`).join('')}
                </td>
                <td style="padding:12px;text-align:center;font-weight:600">${u.licenseCount || 0}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
        ${userAssignments.length > 50 ? `<div style="padding:12px;text-align:center;font-size:10px;color:var(--color-text-tertiary)">Showing 50 of ${userAssignments.length} users</div>` : ''}
      `}
    </div>
  `
}

function renderGroups() {
  // Helper to get license name from skuId
  const getLicenseName = (skuId) => {
    if (!skuId) return '—'

    // Try multiple ways to find the license
    let license = realLicenses.find(l =>
      l.id === skuId ||
      l.skuId === skuId ||
      l.name === skuId ||
      (l.name && l.name.toLowerCase().includes(skuId.toLowerCase()))
    )

    if (license) {
      return license.name || license.skuId || skuId
    }

    // If not found, return the skuId truncated for display
    return skuId.substring(0, 30) + (skuId.length > 30 ? '...' : '')
  }

  return `
    <div class="card" style="padding:0;overflow:hidden">
      ${groupLicensing.length === 0 ? `
        <div style="padding:20px;text-align:center;color:var(--color-text-tertiary)">
          <i class="ti ti-users-group" style="font-size:32px;margin-bottom:8px;display:block"></i>
          No group-based licensing configured
        </div>
      ` : `
        <table style="width:100%">
          <thead><tr>
            <th style="padding:12px;text-align:left;font-weight:600;font-size:11px">Group Name</th>
            <th style="padding:12px;text-align:left;font-weight:600;font-size:11px">Type</th>
            <th style="padding:12px;text-align:left;font-weight:600;font-size:11px">Assigned Licenses</th>
            <th style="padding:12px;text-align:center;font-weight:600;font-size:11px">Members</th>
            <th style="padding:12px;text-align:left;font-weight:600;font-size:11px">Assignment</th>
          </tr></thead>
          <tbody>
            ${groupLicensing.map(g => `
              <tr style="border-bottom:0.5px solid var(--color-border-tertiary)">
                <td style="padding:12px">
                  <div><strong style="font-size:11px">${g.displayName || '—'}</strong></div>
                  <div style="font-size:10px;color:var(--color-text-tertiary)">${g.mail || g.mailNickname || '—'}</div>
                </td>
                <td style="padding:12px;font-size:10px"><span class="badge info">${g.groupType || 'Static'}</span></td>
                <td style="padding:12px;font-size:10px">
                  ${(g.assignedLicenses && g.assignedLicenses.length > 0) ?
                    (g.assignedLicenses.map(lic => {
                      const licName = getLicenseName(lic.skuId || lic.licenseId)
                      return `<span class="badge secondary" style="margin-right:4px;margin-bottom:4px">${licName}</span>`
                    }).join(''))
                    : '<span style="color:var(--color-text-tertiary)">—</span>'
                  }
                </td>
                <td style="padding:12px;text-align:center;font-weight:600;color:${g.memberCount > 0 ? 'var(--color-text-primary)' : 'var(--color-text-tertiary)'}">${g.memberCount > 0 ? g.memberCount : '0'}</td>
                <td style="padding:12px;font-size:10px">
                  <span class="badge secondary">${g.assignmentMethod || 'Group-Based'}</span>
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      `}
    </div>
  `
}

function renderCompliance() {
  const scores = complianceData.scores || { utilization: 0, costOptimization: 0, securityCoverage: 0, compliance: 0 }

  return `
    <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(250px,1fr));gap:16px;margin-bottom:24px">
      <div class="card" style="padding:16px;text-align:center">
        <div style="font-size:32px;font-weight:700;color:${scores.utilization >= 80 ? 'var(--clr-success-text)' : scores.utilization >= 60 ? 'var(--clr-warning-text)' : 'var(--clr-danger-text)'}">${scores.utilization || 0}%</div>
        <div style="font-size:11px;font-weight:600;margin-top:8px">License Utilization</div>
      </div>
      <div class="card" style="padding:16px;text-align:center">
        <div style="font-size:32px;font-weight:700;color:${scores.costOptimization >= 80 ? 'var(--clr-success-text)' : scores.costOptimization >= 60 ? 'var(--clr-warning-text)' : 'var(--clr-danger-text)'}">${scores.costOptimization || 0}%</div>
        <div style="font-size:11px;font-weight:600;margin-top:8px">Cost Optimization</div>
      </div>
      <div class="card" style="padding:16px;text-align:center">
        <div style="font-size:32px;font-weight:700;color:${scores.securityCoverage >= 80 ? 'var(--clr-success-text)' : scores.securityCoverage >= 60 ? 'var(--clr-warning-text)' : 'var(--clr-danger-text)'}">${scores.securityCoverage || 0}%</div>
        <div style="font-size:11px;font-weight:600;margin-top:8px">Security Coverage</div>
      </div>
      <div class="card" style="padding:16px;text-align:center">
        <div style="font-size:32px;font-weight:700;color:${scores.compliance >= 80 ? 'var(--clr-success-text)' : scores.compliance >= 60 ? 'var(--clr-warning-text)' : 'var(--clr-danger-text)'}">${scores.compliance || 0}%</div>
        <div style="font-size:11px;font-weight:600;margin-top:8px">Compliance Score</div>
      </div>
    </div>

    <div class="card">
      <div class="card-header">
        <span class="card-title"><i class="ti ti-shield-alert"></i> Compliance Findings</span>
      </div>
      <div style="padding:12px">
        <div style="display:grid;gap:12px">
          <div style="padding:12px;background:rgba(239, 68, 68, 0.05);border-radius:6px;border-left:3px solid var(--clr-danger-text)">
            <div style="font-weight:600;font-size:11px">Disabled Users with Active Licenses</div>
            <div style="font-size:10px;color:var(--color-text-secondary);margin-top:4px">${complianceData.disabledUsersWithLicenses || 0} users</div>
          </div>
          <div style="padding:12px;background:rgba(250, 190, 88, 0.05);border-radius:6px;border-left:3px solid var(--clr-warning-text)">
            <div style="font-weight:600;font-size:11px">Inactive Users (90+ days)</div>
            <div style="font-size:10px;color:var(--color-text-secondary);margin-top:4px">${complianceData.inactiveUsers || 0} users consuming licenses</div>
          </div>
          <div style="padding:12px;background:rgba(34, 197, 94, 0.05);border-radius:6px;border-left:3px solid var(--clr-success-text)">
            <div style="font-weight:600;font-size:11px">Premium Security Licenses</div>
            <div style="font-size:10px;color:var(--color-text-secondary);margin-top:4px">Users protected by Entra ID P2 and Defender licenses</div>
          </div>
        </div>
      </div>
    </div>
  `
}
