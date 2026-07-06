import { callAPI } from '../lib/api-client.js'
import { isDemoAccount } from '../lib/demo-account.js'
import { skeletonLoader } from '../lib/skeleton-loader.js'

let realLicenses = []
let licenseSummary = { total: 0, consumed: 0, available: 0, utilizationPct: 0 }
let userAssignments = []
let groupLicensing = []
let complianceData = {}
let activeTab = 'summary'

// Helper function to check if license is free
function isFreeLicense(licenseName) {
  if (!licenseName) return false
  return licenseName.toLowerCase().includes('free')
}

// Get filtered licenses (exclude free licenses for KPI calculations)
function getFilteredLicensesForKPI() {
  return realLicenses.filter(l => !isFreeLicense(l.name))
}

// Calculate KPI summary from filtered licenses
function calculateKPISummary() {
  const filtered = getFilteredLicensesForKPI()
  const total = filtered.reduce((sum, l) => sum + (l.total || 0), 0)
  const consumed = filtered.reduce((sum, l) => sum + (l.consumed || 0), 0)
  const available = filtered.reduce((sum, l) => sum + (l.available || 0), 0)
  const utilizationPct = total > 0 ? Math.round((consumed / total) * 100) : 0

  return { total, consumed, available, utilizationPct }
}

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

  if (isDemoAccount()) {
    console.log('🎭 Demo account detected - showing demo license data')
    renderDemoLicensesPage(el)
    return
  }

  // Show skeleton immediately
  el.innerHTML = `
    <div>
      ${skeletonLoader.renderPageHeader('Licenses', 'License inventory, assignments, and compliance', true)}
      ${skeletonLoader.renderMetricsRowSkeleton(4)}
      ${skeletonLoader.renderTabsWithContentSkeleton(6, true)}
    </div>
  `

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

function renderDemoLicensesPage(el) {
  const demoLicenses = [
    { sku: 'Microsoft 365 E5', total: 300, consumed: 285, available: 15, utilizationPct: 95, price: 180 },
    { sku: 'Microsoft 365 E3', total: 500, consumed: 478, available: 22, utilizationPct: 95, price: 20 },
    { sku: 'Microsoft 365 F1', total: 150, consumed: 145, available: 5, utilizationPct: 96, price: 6 },
    { sku: 'Enterprise Mobility + Security E5', total: 200, consumed: 198, available: 2, utilizationPct: 99, price: 22 },
    { sku: 'Office 365 E1', total: 100, consumed: 87, available: 13, utilizationPct: 87, price: 8 },
  ]

  const demoSummary = {
    total: 1250,
    consumed: 1193,
    available: 57,
    utilizationPct: 95
  }

  const demoUsers = [
    { name: 'Priya Kumar', email: 'priya@contoso.com', licenses: ['Microsoft 365 E5', 'Enterprise Mobility + Security E5'] },
    { name: 'Chen Wei', email: 'chen@contoso.com', licenses: ['Microsoft 365 E5'] },
    { name: 'Aisha Raza', email: 'aisha@contoso.com', licenses: ['Microsoft 365 E5', 'Enterprise Mobility + Security E5'] },
    { name: 'Sanjay Kumar', email: 'sanjay@contoso.com', licenses: ['Microsoft 365 E3', 'Office 365 E1'] },
    { name: 'Sarah Johnson', email: 'sarah@contoso.com', licenses: ['Microsoft 365 E3'] },
  ]

  const demoGroups = [
    { name: 'Executive Team', licenses: ['Microsoft 365 E5'], users: 12, utilizationPct: 92 },
    { name: 'Engineering Department', licenses: ['Microsoft 365 E3'], users: 45, utilizationPct: 98 },
    { name: 'Support Team', licenses: ['Microsoft 365 F1'], users: 60, utilizationPct: 96 },
  ]

  const demoServices = [
    { service: 'Exchange Online', status: 'Licensed', users: 847, entitlement: 1250, compliance: '100%' },
    { service: 'SharePoint Online', status: 'Licensed', users: 823, entitlement: 1250, compliance: '100%' },
    { service: 'Teams', status: 'Licensed', users: 812, entitlement: 1250, compliance: '99%' },
    { service: 'Microsoft Forms', status: 'Licensed', users: 1100, entitlement: 1250, compliance: '88%' },
  ]

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

    <div style="display:flex;align-items:center;gap:8px;padding:8px 12px;background:var(--color-background-primary);border:0.5px solid var(--color-border-secondary);border-radius:var(--border-radius-md);margin-bottom:16px;font-size:10px;color:var(--color-text-tertiary)">
      <span class="status-dot active pulse"></span>
      <span><strong style="color:var(--color-text-secondary)">Demo Mode</strong> · Showing sample license data</span>
    </div>

    <!-- Tab Navigation -->
    <div class="tabs">
      ${TABS.map((t, i) => `
        <button class="tab-btn ${i === 0 ? 'active' : ''}" data-tab="${t.id}">
          <i class="ti ${t.icon}"></i> ${t.label}
        </button>
      `).join('')}
    </div>

    <!-- Tab Content -->
    <div id="tab-content"></div>
  `

  const contentEl = el.querySelector('#tab-content')
  renderDemoExecutiveSummary(contentEl, demoSummary, demoLicenses)

  el.querySelectorAll('.tabs .tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      el.querySelectorAll('.tabs .tab-btn').forEach(b => b.classList.remove('active'))
      btn.classList.add('active')
      const tabId = btn.dataset.tab

      if (tabId === 'summary') renderDemoExecutiveSummary(contentEl, demoSummary, demoLicenses)
      else if (tabId === 'inventory') renderDemoInventory(contentEl, demoLicenses)
      else if (tabId === 'services') renderDemoServicePlans(contentEl, demoServices)
      else if (tabId === 'assignments') renderDemoAssignments(contentEl, demoUsers)
      else if (tabId === 'groups') renderDemoGroups(contentEl, demoGroups)
      else if (tabId === 'compliance') renderDemoCompliance(contentEl, demoSummary)
    })
  })

  el.querySelector('#license-refresh')?.addEventListener('click', () => {
    const btn = el.querySelector('#license-refresh')
    btn.innerHTML = `<span class="spinner dark"></span> Syncing...`
    btn.disabled = true
    setTimeout(() => {
      btn.innerHTML = `<i class="ti ti-refresh"></i> Refresh`
      btn.disabled = false
    }, 2000)
  })
}

function renderDemoExecutiveSummary(el, summary, licenses) {
  el.innerHTML = `
    <div class="card mb-3">
      <div class="card-header">
        <span class="card-title">License Utilization Summary</span>
      </div>
      <div style="display:grid;grid-template-columns:1fr 1fr 1fr 1fr;gap:12px;margin-bottom:16px">
        <div style="padding:12px;background:var(--color-background-secondary);border-radius:var(--border-radius-md)">
          <div style="font-size:10px;color:var(--color-text-tertiary);text-transform:uppercase;font-weight:600;margin-bottom:6px">Total Licenses</div>
          <div style="font-size:24px;font-weight:700;color:var(--clr-info-text)">${summary.total}</div>
        </div>
        <div style="padding:12px;background:var(--color-background-secondary);border-radius:var(--border-radius-md)">
          <div style="font-size:10px;color:var(--color-text-tertiary);text-transform:uppercase;font-weight:600;margin-bottom:6px">Consumed</div>
          <div style="font-size:24px;font-weight:700;color:var(--clr-warning-text)">${summary.consumed}</div>
        </div>
        <div style="padding:12px;background:var(--color-background-secondary);border-radius:var(--border-radius-md)">
          <div style="font-size:10px;color:var(--color-text-tertiary);text-transform:uppercase;font-weight:600;margin-bottom:6px">Available</div>
          <div style="font-size:24px;font-weight:700;color:var(--clr-success-text)">${summary.available}</div>
        </div>
        <div style="padding:12px;background:var(--color-background-secondary);border-radius:var(--border-radius-md)">
          <div style="font-size:10px;color:var(--color-text-tertiary);text-transform:uppercase;font-weight:600;margin-bottom:6px">Utilization</div>
          <div style="font-size:24px;font-weight:700;color:var(--clr-warning-text)">${summary.utilizationPct}%</div>
        </div>
      </div>
    </div>

    <div class="card">
      <div class="card-header">
        <span class="card-title">License SKU Summary</span>
      </div>
      <table style="width:100%">
        <thead style="background:var(--color-background-secondary)">
          <tr>
            <th style="padding:10px 12px;text-align:left;font-size:10px;font-weight:600">SKU</th>
            <th style="padding:10px 12px;text-align:left;font-size:10px;font-weight:600">Total</th>
            <th style="padding:10px 12px;text-align:left;font-size:10px;font-weight:600">Consumed</th>
            <th style="padding:10px 12px;text-align:left;font-size:10px;font-weight:600">Available</th>
            <th style="padding:10px 12px;text-align:left;font-size:10px;font-weight:600">Utilization</th>
          </tr>
        </thead>
        <tbody>
          ${licenses.map((lic, i) => `
            <tr style="border-bottom:${i < licenses.length - 1 ? '0.5px solid var(--color-border-tertiary)' : 'none'}">
              <td style="padding:10px 12px;font-size:11px;font-weight:600">${lic.sku}</td>
              <td style="padding:10px 12px;font-size:10px">${lic.total}</td>
              <td style="padding:10px 12px;font-size:10px;color:var(--color-text-secondary)">${lic.consumed}</td>
              <td style="padding:10px 12px;font-size:10px">${lic.available}</td>
              <td style="padding:10px 12px;font-size:10px"><span class="badge warning">${lic.utilizationPct}%</span></td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>
  `
}

function renderDemoInventory(el, licenses) {
  el.innerHTML = `
    <div class="card">
      <div class="card-header">
        <span class="card-title">License Inventory</span>
      </div>
      <table style="width:100%">
        <thead style="background:var(--color-background-secondary)">
          <tr>
            <th style="padding:10px 12px;text-align:left;font-size:10px;font-weight:600">License SKU</th>
            <th style="padding:10px 12px;text-align:left;font-size:10px;font-weight:600">Total Licenses</th>
            <th style="padding:10px 12px;text-align:left;font-size:10px;font-weight:600">Assigned</th>
            <th style="padding:10px 12px;text-align:left;font-size:10px;font-weight:600">Unassigned</th>
            <th style="padding:10px 12px;text-align:left;font-size:10px;font-weight:600">Annual Cost</th>
          </tr>
        </thead>
        <tbody>
          ${licenses.map((lic, i) => `
            <tr style="border-bottom:${i < licenses.length - 1 ? '0.5px solid var(--color-border-tertiary)' : 'none'}">
              <td style="padding:10px 12px;font-size:11px;font-weight:600">${lic.sku}</td>
              <td style="padding:10px 12px;font-size:10px">${lic.total}</td>
              <td style="padding:10px 12px;font-size:10px;color:var(--color-text-secondary)">${lic.consumed}</td>
              <td style="padding:10px 12px;font-size:10px">${lic.available}</td>
              <td style="padding:10px 12px;font-size:10px;font-weight:600">$${(lic.total * lic.price * 12).toLocaleString()}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>
  `
}

function renderDemoServicePlans(el, services) {
  el.innerHTML = `
    <div class="card">
      <div class="card-header">
        <span class="card-title">Service Plans</span>
      </div>
      <table style="width:100%">
        <thead style="background:var(--color-background-secondary)">
          <tr>
            <th style="padding:10px 12px;text-align:left;font-size:10px;font-weight:600">Service</th>
            <th style="padding:10px 12px;text-align:left;font-size:10px;font-weight:600">Status</th>
            <th style="padding:10px 12px;text-align:left;font-size:10px;font-weight:600">Licensed Users</th>
            <th style="padding:10px 12px;text-align:left;font-size:10px;font-weight:600">Entitlement</th>
            <th style="padding:10px 12px;text-align:left;font-size:10px;font-weight:600">Compliance</th>
          </tr>
        </thead>
        <tbody>
          ${services.map((svc, i) => `
            <tr style="border-bottom:${i < services.length - 1 ? '0.5px solid var(--color-border-tertiary)' : 'none'}">
              <td style="padding:10px 12px;font-size:11px;font-weight:600">${svc.service}</td>
              <td style="padding:10px 12px"><span class="badge success">Licensed</span></td>
              <td style="padding:10px 12px;font-size:10px;color:var(--color-text-secondary)">${svc.users}</td>
              <td style="padding:10px 12px;font-size:10px">${svc.entitlement}</td>
              <td style="padding:10px 12px;font-size:10px"><span class="badge ${svc.compliance === '100%' ? 'success' : 'warning'}">${svc.compliance}</span></td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>
  `
}

function renderDemoAssignments(el, users) {
  el.innerHTML = `
    <div class="card">
      <div class="card-header">
        <span class="card-title">User License Assignments</span>
        <span class="badge info">${users.length} users</span>
      </div>
      <table style="width:100%">
        <thead style="background:var(--color-background-secondary)">
          <tr>
            <th style="padding:10px 12px;text-align:left;font-size:10px;font-weight:600">User</th>
            <th style="padding:10px 12px;text-align:left;font-size:10px;font-weight:600">Email</th>
            <th style="padding:10px 12px;text-align:left;font-size:10px;font-weight:600">Licenses Assigned</th>
          </tr>
        </thead>
        <tbody>
          ${users.map((user, i) => `
            <tr style="border-bottom:${i < users.length - 1 ? '0.5px solid var(--color-border-tertiary)' : 'none'}">
              <td style="padding:10px 12px;font-size:11px;font-weight:600">${user.name}</td>
              <td style="padding:10px 12px;font-size:10px;color:var(--color-text-secondary)">${user.email}</td>
              <td style="padding:10px 12px;font-size:10px">${user.licenses.join(', ')}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>
  `
}

function renderDemoGroups(el, groups) {
  el.innerHTML = `
    <div class="card">
      <div class="card-header">
        <span class="card-title">Group Licensing</span>
        <span class="badge info">${groups.length} groups</span>
      </div>
      <table style="width:100%">
        <thead style="background:var(--color-background-secondary)">
          <tr>
            <th style="padding:10px 12px;text-align:left;font-size:10px;font-weight:600">Group Name</th>
            <th style="padding:10px 12px;text-align:left;font-size:10px;font-weight:600">Licenses</th>
            <th style="padding:10px 12px;text-align:left;font-size:10px;font-weight:600">Users</th>
            <th style="padding:10px 12px;text-align:left;font-size:10px;font-weight:600">Utilization</th>
          </tr>
        </thead>
        <tbody>
          ${groups.map((group, i) => `
            <tr style="border-bottom:${i < groups.length - 1 ? '0.5px solid var(--color-border-tertiary)' : 'none'}">
              <td style="padding:10px 12px;font-size:11px;font-weight:600">${group.name}</td>
              <td style="padding:10px 12px;font-size:10px">${group.licenses.join(', ')}</td>
              <td style="padding:10px 12px;font-size:10px;color:var(--color-text-secondary)">${group.users}</td>
              <td style="padding:10px 12px;font-size:10px"><span class="badge ${group.utilizationPct > 95 ? 'warning' : 'success'}">${group.utilizationPct}%</span></td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>
  `
}

function renderDemoCompliance(el, summary) {
  el.innerHTML = `
    <div class="card mb-3">
      <div class="card-header">
        <span class="card-title">License Compliance Report</span>
      </div>
      <div style="padding:16px">
        <div style="margin-bottom:16px">
          <div style="display:flex;justify-content:space-between;margin-bottom:8px">
            <span style="font-size:11px;font-weight:600">Overall Compliance</span>
            <span style="font-size:11px;font-weight:600;color:var(--clr-success-text)">100% Compliant</span>
          </div>
          <div style="width:100%;height:8px;background:var(--color-background-secondary);border-radius:4px;overflow:hidden">
            <div style="height:100%;width:100%;background:var(--clr-success-bg)"></div>
          </div>
        </div>

        <div style="margin-bottom:16px">
          <div style="display:flex;justify-content:space-between;margin-bottom:8px">
            <span style="font-size:11px;font-weight:600">License Utilization</span>
            <span style="font-size:11px;font-weight:600;color:var(--clr-warning-text)">${summary.utilizationPct}%</span>
          </div>
          <div style="width:100%;height:8px;background:var(--color-background-secondary);border-radius:4px;overflow:hidden">
            <div style="height:100%;width:${summary.utilizationPct}%;background:var(--clr-warning-bg)"></div>
          </div>
        </div>

        <div style="padding:12px;background:var(--color-background-secondary);border-radius:var(--border-radius-md);margin-top:16px">
          <div style="font-size:11px;font-weight:600;margin-bottom:8px;color:var(--color-text-primary)">Compliance Status</div>
          <div style="display:flex;gap:12px">
            <div style="flex:1">
              <div style="font-size:10px;color:var(--color-text-tertiary);margin-bottom:4px">Compliant Licenses</div>
              <div style="font-size:16px;font-weight:700;color:var(--clr-success-text)">1,193</div>
            </div>
            <div style="flex:1">
              <div style="font-size:10px;color:var(--color-text-tertiary);margin-bottom:4px">Non-Compliant</div>
              <div style="font-size:16px;font-weight:700;color:var(--clr-danger-text)">0</div>
            </div>
            <div style="flex:1">
              <div style="font-size:10px;color:var(--color-text-tertiary);margin-bottom:4px">Unassigned</div>
              <div style="font-size:16px;font-weight:700;color:var(--clr-info-text)">57</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
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
  // Recalculate KPI summary excluding free licenses before rendering
  licenseSummary = calculateKPISummary()

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
      ${getFilteredLicensesForKPI().map(l => `
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
          ${getFilteredLicensesForKPI().map(l => `
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
      ${getFilteredLicensesForKPI().map(l => `
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
  // Debug: Log realLicenses structure
  if (realLicenses.length > 0) {
    console.log('📊 realLicenses structure:', realLicenses[0])
  }

  // Helper to get license name from skuId
  const getLicenseName = (skuId) => {
    if (!skuId) return '—'

    console.log(`🔍 Looking for license with skuId: ${skuId}`)

    // The license id is composite: tenantId_skuId, so extract the skuId part (after underscore)
    let license = realLicenses.find(l => {
      // Match by exact skuId
      if (l.skuId === skuId) {
        console.log(`✓ Matched by skuId: ${l.name}`)
        return true
      }
      // Match by extracting skuId from composite id (format: tenantId_skuId)
      const compositeIdPart = l.id?.split('_')?.[1]
      if (compositeIdPart === skuId) {
        console.log(`✓ Matched by composite ID: ${l.name}`)
        return true
      }
      // Direct id match
      if (l.id === skuId) {
        console.log(`✓ Matched by id: ${l.name}`)
        return true
      }
      return false
    })

    if (license) {
      return license.name || license.skuPartNumber || skuId.substring(0, 20)
    }

    console.log(`✗ No match found for: ${skuId}`)
    console.log(`   Available licenses: ${realLicenses.map(l => `${l.name}(${l.id.split('_')[1] || l.id})`).join(', ')}`)

    // If not found, return the name in a readable format
    return skuId.substring(0, 20) + (skuId.length > 20 ? '...' : '')
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
            ${groupLicensing.map((g, idx) => {
              console.log(`📊 Group ${idx}: ${g.displayName}, memberCount=${g.memberCount}, type=${typeof g.memberCount}`)
              return `
              <tr style="border-bottom:0.5px solid var(--color-border-tertiary)">
                <td style="padding:12px">
                  <strong style="font-size:11px">${g.displayName || '—'}</strong>
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
                <td style="padding:12px;text-align:center;font-weight:600;color:var(--color-text-primary)">${g.memberCount || 0}</td>
                <td style="padding:12px;font-size:10px">
                  <span class="badge secondary">${g.assignmentMethod || 'Group-Based'}</span>
                </td>
              </tr>
            `
            }).join('')}
          </tbody>
        </table>
      `}
    </div>
  `
}

function renderCompliance() {
  const scores = complianceData.scores || { utilization: 0, costOptimization: 0, securityCoverage: 0, compliance: 0 }
  const costOpt = complianceData.costOptimization || {}

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

    ${costOpt.potentialSavings > 0 ? `
    <div class="card" style="background:rgba(34, 197, 94, 0.05);border-left:4px solid var(--clr-success-text);margin-bottom:16px">
      <div style="padding:16px">
        <div style="font-weight:600;font-size:12px">💰 Potential Monthly Savings</div>
        <div style="font-size:28px;font-weight:700;color:var(--clr-success-text);margin-top:8px">$${costOpt.potentialSavings}</div>
        <div style="font-size:10px;color:var(--color-text-secondary);margin-top:4px">From removing ${costOpt.unusedLicenseCount} unused licenses and consolidating ${costOpt.overlicensedCount} overlicensed assignments</div>
      </div>
    </div>
    ` : ''}

    <div class="card">
      <div class="card-header">
        <span class="card-title"><i class="ti ti-shield-alert"></i> Compliance Findings</span>
      </div>
      <div style="padding:12px">
        <div style="display:grid;gap:12px">
          ${complianceData.disabledUsersWithLicenses > 0 ? `
          <div style="padding:12px;background:rgba(239, 68, 68, 0.05);border-radius:6px;border-left:3px solid var(--clr-danger-text)">
            <div style="font-weight:600;font-size:11px">🚫 Disabled Users with Active Licenses</div>
            <div style="font-size:10px;color:var(--color-text-secondary);margin-top:4px">${complianceData.disabledUsersWithLicenses} users wasting licenses</div>
            ${(complianceData.disabledUsersDetail || []).length > 0 ? `
            <div style="margin-top:8px;font-size:10px;border-top:1px solid rgba(239, 68, 68, 0.2);padding-top:8px">
              ${(complianceData.disabledUsersDetail || []).map(u => `<div style="padding:4px 0"><strong>${u.displayName}</strong> (${u.licenseCount} license${u.licenseCount !== 1 ? 's' : ''})</div>`).join('')}
            </div>
            ` : ''}
          </div>
          ` : ''}

          ${complianceData.inactiveUsers > 0 ? `
          <div style="padding:12px;background:rgba(250, 190, 88, 0.05);border-radius:6px;border-left:3px solid var(--clr-warning-text)">
            <div style="font-weight:600;font-size:11px">⏱️ Inactive Users (90+ days)</div>
            <div style="font-size:10px;color:var(--color-text-secondary);margin-top:4px">${complianceData.inactiveUsers} users with no activity but consuming licenses</div>
            ${(complianceData.inactiveUsersDetail || []).length > 0 ? `
            <div style="margin-top:8px;font-size:10px;border-top:1px solid rgba(250, 190, 88, 0.2);padding-top:8px">
              ${(complianceData.inactiveUsersDetail || []).map(u => `<div style="padding:4px 0"><strong>${u.displayName}</strong> • Last sign-in: ${u.lastSignIn} (${u.licenseCount} license${u.licenseCount !== 1 ? 's' : ''})</div>`).join('')}
            </div>
            ` : ''}
          </div>
          ` : ''}

          ${complianceData.guestUsersWithPremium > 0 ? `
          <div style="padding:12px;background:rgba(59, 130, 246, 0.05);border-radius:6px;border-left:3px solid var(--clr-info-text)">
            <div style="font-weight:600;font-size:11px">👥 Guest Users with Premium Licenses</div>
            <div style="font-size:10px;color:var(--color-text-secondary);margin-top:4px">${complianceData.guestUsersWithPremium} external users consuming premium licenses</div>
            ${(complianceData.guestUsersDetail || []).length > 0 ? `
            <div style="margin-top:8px;font-size:10px;border-top:1px solid rgba(59, 130, 246, 0.2);padding-top:8px">
              ${(complianceData.guestUsersDetail || []).map(u => `<div style="padding:4px 0"><strong>${u.displayName}</strong> (${u.licenseCount} license${u.licenseCount !== 1 ? 's' : ''})</div>`).join('')}
            </div>
            ` : ''}
          </div>
          ` : ''}

          ${complianceData.overlicensedUsers > 0 ? `
          <div style="padding:12px;background:rgba(168, 85, 247, 0.05);border-radius:6px;border-left:3px solid var(--clr-warning-text)">
            <div style="font-weight:600;font-size:11px">📦 Overlicensed Users</div>
            <div style="font-size:10px;color:var(--color-text-secondary);margin-top:4px">${complianceData.overlicensedUsers} users with redundant license combinations</div>
            ${(complianceData.overlicensedDetail || []).length > 0 ? `
            <div style="margin-top:8px;font-size:10px;border-top:1px solid rgba(168, 85, 247, 0.2);padding-top:8px">
              ${(complianceData.overlicensedDetail || []).map(u => `<div style="padding:4px 0"><strong>${u.displayName}</strong> (${u.licenseCount} licenses: ${u.licenses.join(', ')})</div>`).join('')}
            </div>
            ` : ''}
          </div>
          ` : ''}

          ${!complianceData.disabledUsersWithLicenses && !complianceData.inactiveUsers && !complianceData.guestUsersWithPremium && !complianceData.overlicensedUsers ? `
          <div style="padding:12px;background:rgba(34, 197, 94, 0.05);border-radius:6px;border-left:3px solid var(--clr-success-text);text-align:center">
            <div style="font-weight:600;font-size:11px">✅ Excellent Compliance</div>
            <div style="font-size:10px;color:var(--color-text-secondary);margin-top:4px">No licensing issues detected</div>
          </div>
          ` : ''}
        </div>
      </div>
    </div>
  `
}
