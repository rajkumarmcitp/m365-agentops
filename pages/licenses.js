import { callAPI } from '../lib/api-client.js'
import { isDemoAccount } from '../lib/demo-account.js'
import { skeletonLoader } from '../lib/skeleton-loader.js'

let realLicenses = []
let licenseSummary = { total: 0, consumed: 0, available: 0, utilizationPct: 0 }
let userAssignments = []
let groupLicensing = []
let complianceData = {}
let criticalAlerts = { expirationAlerts: {}, servicePlanConflicts: {}, assignmentErrors: {} }
let auditTrail = []
let departmentKPIs = []
let privilegedAccounts = { adminsWithoutP2: [], adminsWithoutDefender: [], adminsWithP2: [], adminsWithDefender: [], adminsWithBoth: [], total: 0 }
let activeTab = 'alerts'

// Pagination state for compliance findings
let compliancePagination = {
  disabled: { currentPage: 1, pageSize: 10 },
  inactive: { currentPage: 1, pageSize: 10 },
  guest: { currentPage: 1, pageSize: 10 },
  overlicense: { currentPage: 1, pageSize: 10 }
}

// Service plans modal storage
let servicePlansStore = {}

// Alert expansion state
let expandedAlertSections = {
  exchangeDisabled: false,
  teamsDisabled: false,
  sharepointDisabled: false,
  failedAssignments: false,
  pendingAssignments: false,
  partialAssignments: false
}

window.toggleAlertSection = function(section) {
  expandedAlertSections[section] = !expandedAlertSections[section]
  const contentEl = document.getElementById('tab-content')
  if (contentEl) {
    contentEl.innerHTML = renderCriticalAlerts()
  }
}

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
  { id: 'alerts', label: 'Critical Alerts', icon: 'ti-alert-triangle' },
  { id: 'summary', label: 'Executive Summary', icon: 'ti-layout-dashboard' },
  { id: 'inventory', label: 'License Inventory', icon: 'ti-box' },
  { id: 'services', label: 'Service Plans', icon: 'ti-list-check' },
  { id: 'assignments', label: 'User Assignments', icon: 'ti-users' },
  { id: 'groups', label: 'Group Licensing', icon: 'ti-users-group' },
  { id: 'compliance', label: 'Compliance', icon: 'ti-shield-check' },
  { id: 'audit', label: 'Audit Trail', icon: 'ti-history' },
  { id: 'departments', label: 'Department KPIs', icon: 'ti-chart-bar' },
  { id: 'privileged', label: 'Privileged Accounts', icon: 'ti-shield-star' },
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
    const [licenses, assignments, groups, compliance, servicePlans, expirationAlerts, servicePlanConflicts, assignmentErrors, auditTrailData, departmentData, privilegedData] = await Promise.all([
      callAPI('/licenses'),
      callAPI('/licenses/assignments'),
      callAPI('/licenses/groups'),
      callAPI('/licenses/compliance'),
      callAPI('/licenses/service-plans-detail'),
      callAPI('/licenses/expiration-alerts'),
      callAPI('/licenses/service-plan-conflicts'),
      callAPI('/licenses/assignment-errors'),
      callAPI('/licenses/audit-trail'),
      callAPI('/licenses/department-kpis'),
      callAPI('/licenses/privileged-accounts')
    ])

    if (licenses.success && licenses.data) {
      // Merge service plans into licenses if available
      if (servicePlans.success && servicePlans.data) {
        licenses.data = licenses.data.map(l => ({
          ...l,
          servicePlans: servicePlans.data[l.skuId]?.servicePlans || l.servicePlans || []
        }))
      }
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
    if (expirationAlerts.success && expirationAlerts.data) {
      criticalAlerts.expirationAlerts = expirationAlerts.data
    }
    if (servicePlanConflicts.success && servicePlanConflicts.data) {
      criticalAlerts.servicePlanConflicts = servicePlanConflicts.data
    }
    if (assignmentErrors.success && assignmentErrors.data) {
      criticalAlerts.assignmentErrors = assignmentErrors.data
    }
    if (auditTrailData.success && auditTrailData.data) {
      auditTrail = auditTrailData.data
    }
    if (departmentData.success && departmentData.data) {
      departmentKPIs = departmentData.data
    }
    if (privilegedData.success && privilegedData.data) {
      privilegedAccounts = privilegedData.data
    }
    console.log(`✅ Loaded all license data with critical alerts and Phase 2 features`)
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
    <div class="tabs" id="license-tabs" style="margin-bottom:16px">
      ${TABS.map(t => `
        <button class="tab-btn ${activeTab === t.id ? 'active' : ''}" data-tab="${t.id}">
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
  el.querySelectorAll('#license-tabs .tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      activeTab = btn.dataset.tab
      if (activeTab === 'compliance') {
        compliancePagination = {
          disabled: { currentPage: 1, pageSize: 10 },
          inactive: { currentPage: 1, pageSize: 10 },
          guest: { currentPage: 1, pageSize: 10 },
          overlicense: { currentPage: 1, pageSize: 10 }
        }
      }
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
    case 'alerts': return renderCriticalAlerts()
    case 'summary': return renderExecutiveSummary()
    case 'inventory': return renderInventory()
    case 'services': return renderServicePlans()
    case 'assignments': return renderAssignments()
    case 'groups': return renderGroups()
    case 'compliance': return renderCompliance()
    case 'audit': return renderAuditTrail()
    case 'departments': return renderDepartmentKPIs()
    case 'privileged': return renderPrivilegedAccounts()
    default: return ''
  }
}

function renderCriticalAlerts() {
  const { expirationAlerts, servicePlanConflicts, assignmentErrors } = criticalAlerts

  return `
    <div style="margin-bottom:24px">
      <!-- Expiration Alerts -->
      ${expirationAlerts.critical && expirationAlerts.critical.length > 0 ? `
        <div class="card mb-3">
          <div class="card-header">
            <span class="card-title"><i class="ti ti-alert-triangle"></i> 🔴 Critical: License Expiration</span>
          </div>
          <div style="padding:12px">
            <div style="display:grid;gap:8px">
              ${expirationAlerts.critical.map(alert => `
                <div style="padding:12px;background:rgba(239, 68, 68, 0.05);border-radius:6px;border-left:3px solid var(--clr-danger-text)">
                  <div style="font-weight:600;font-size:11px;color:var(--color-text-primary)">${alert.skuPartNumber}</div>
                  <div style="font-size:10px;color:var(--color-text-secondary);margin-top:4px">${alert.status}</div>
                  ${alert.expirationDate ? `<div style="font-size:9px;color:var(--color-text-tertiary);margin-top:2px">Expires: ${new Date(alert.expirationDate).toLocaleDateString()}</div>` : ''}
                </div>
              `).join('')}
            </div>
          </div>
        </div>
      ` : ''}

      ${expirationAlerts.warning && expirationAlerts.warning.length > 0 ? `
        <div class="card mb-3">
          <div class="card-header">
            <span class="card-title"><i class="ti ti-alert-circle"></i> 🟠 Warning: License Expiring Soon</span>
          </div>
          <div style="padding:12px">
            <div style="display:grid;gap:8px">
              ${expirationAlerts.warning.map(alert => `
                <div style="padding:12px;background:rgba(250, 190, 88, 0.05);border-radius:6px;border-left:3px solid var(--clr-warning-text)">
                  <div style="font-weight:600;font-size:11px;color:var(--color-text-primary)">${alert.skuPartNumber}</div>
                  <div style="font-size:10px;color:var(--color-text-secondary);margin-top:4px">${alert.status}</div>
                </div>
              `).join('')}
            </div>
          </div>
        </div>
      ` : ''}

      <!-- Service Plan Conflicts -->
      ${servicePlanConflicts.total > 0 ? `
        <div class="card mb-3">
          <div class="card-header">
            <span class="card-title"><i class="ti ti-alert-octagon"></i> 🟠 Service Plan Conflicts Detected</span>
          </div>
          <div style="padding:12px">
            ${servicePlanConflicts.exchangeDisabled && servicePlanConflicts.exchangeDisabled.length > 0 ? `
              <div style="margin-bottom:12px">
                <div style="font-weight:600;font-size:12px;color:var(--color-text-primary);margin-bottom:8px">Exchange Disabled (${servicePlanConflicts.exchangeDisabled.length} users)</div>
                <div style="display:grid;gap:6px">
                  ${servicePlanConflicts.exchangeDisabled.slice(0, expandedAlertSections.exchangeDisabled ? undefined : 5).map(conflict => `
                    <div style="padding:8px;background:var(--color-background-secondary);border-radius:4px;font-size:11px">
                      <div style="font-weight:500">${conflict.displayName}</div>
                      <div style="color:var(--color-text-tertiary);font-size:10px">${conflict.userPrincipalName}</div>
                    </div>
                  `).join('')}
                  ${servicePlanConflicts.exchangeDisabled.length > 5 ? `<button onclick="window.toggleAlertSection('exchangeDisabled')" style="background:none;border:none;padding:8px;text-align:center;font-size:10px;color:var(--clr-info-text);cursor:pointer;width:100%;font-weight:600">
                    ${expandedAlertSections.exchangeDisabled ? '▼ Show less' : `+ ${servicePlanConflicts.exchangeDisabled.length - 5} more`}
                  </button>` : ''}
                </div>
              </div>
            ` : ''}
            ${servicePlanConflicts.teamsDisabled && servicePlanConflicts.teamsDisabled.length > 0 ? `
              <div style="margin-bottom:12px">
                <div style="font-weight:600;font-size:12px;color:var(--color-text-primary);margin-bottom:8px">Teams Disabled (${servicePlanConflicts.teamsDisabled.length} users)</div>
                <div style="display:grid;gap:6px">
                  ${servicePlanConflicts.teamsDisabled.slice(0, expandedAlertSections.teamsDisabled ? undefined : 5).map(conflict => `
                    <div style="padding:8px;background:var(--color-background-secondary);border-radius:4px;font-size:11px">
                      <div style="font-weight:500">${conflict.displayName}</div>
                      <div style="color:var(--color-text-tertiary);font-size:10px">${conflict.userPrincipalName}</div>
                    </div>
                  `).join('')}
                  ${servicePlanConflicts.teamsDisabled.length > 5 ? `<button onclick="window.toggleAlertSection('teamsDisabled')" style="background:none;border:none;padding:8px;text-align:center;font-size:9px;color:var(--clr-info-text);cursor:pointer;width:100%;font-weight:600">
                    ${expandedAlertSections.teamsDisabled ? '▼ Show less' : `+ ${servicePlanConflicts.teamsDisabled.length - 5} more`}
                  </button>` : ''}
                </div>
              </div>
            ` : ''}
            ${servicePlanConflicts.sharepointDisabled && servicePlanConflicts.sharepointDisabled.length > 0 ? `
              <div style="margin-bottom:12px">
                <div style="font-weight:600;font-size:12px;color:var(--color-text-primary);margin-bottom:8px">SharePoint Disabled (${servicePlanConflicts.sharepointDisabled.length} users)</div>
                <div style="display:grid;gap:6px">
                  ${servicePlanConflicts.sharepointDisabled.slice(0, expandedAlertSections.sharepointDisabled ? undefined : 5).map(conflict => `
                    <div style="padding:8px;background:var(--color-background-secondary);border-radius:4px;font-size:11px">
                      <div style="font-weight:500">${conflict.displayName}</div>
                      <div style="color:var(--color-text-tertiary);font-size:10px">${conflict.userPrincipalName}</div>
                    </div>
                  `).join('')}
                  ${servicePlanConflicts.sharepointDisabled.length > 5 ? `<button onclick="window.toggleAlertSection('sharepointDisabled')" style="background:none;border:none;padding:8px;text-align:center;font-size:9px;color:var(--clr-info-text);cursor:pointer;width:100%;font-weight:600">
                    ${expandedAlertSections.sharepointDisabled ? '▼ Show less' : `+ ${servicePlanConflicts.sharepointDisabled.length - 5} more`}
                  </button>` : ''}
                </div>
              </div>
            ` : ''}
          </div>
        </div>
      ` : ''}

      <!-- Assignment Errors -->
      ${assignmentErrors.total > 0 ? `
        <div class="card mb-3">
          <div class="card-header">
            <span class="card-title"><i class="ti ti-exclamation-mark"></i> 🟠 Assignment Issues Detected</span>
          </div>
          <div style="padding:12px">
            ${assignmentErrors.failedAssignments && assignmentErrors.failedAssignments.length > 0 ? `
              <div style="margin-bottom:12px">
                <div style="font-weight:600;font-size:12px;color:var(--clr-danger-text);margin-bottom:8px">Failed Assignments (${assignmentErrors.failedAssignments.length})</div>
                <div style="display:grid;gap:6px">
                  ${assignmentErrors.failedAssignments.slice(0, expandedAlertSections.failedAssignments ? undefined : 5).map(err => `
                    <div style="padding:8px;background:rgba(239, 68, 68, 0.05);border-radius:4px;font-size:11px;border-left:3px solid var(--clr-danger-text)">
                      <div style="font-weight:500">${err.displayName}</div>
                      <div style="color:var(--color-text-tertiary);font-size:10px">${err.userPrincipalName}</div>
                    </div>
                  `).join('')}
                  ${assignmentErrors.failedAssignments.length > 5 ? `<button onclick="window.toggleAlertSection('failedAssignments')" style="background:none;border:none;padding:8px;text-align:center;font-size:9px;color:var(--clr-info-text);cursor:pointer;width:100%;font-weight:600">
                    ${expandedAlertSections.failedAssignments ? '▼ Show less' : `+ ${assignmentErrors.failedAssignments.length - 5} more`}
                  </button>` : ''}
                </div>
              </div>
            ` : ''}
            ${assignmentErrors.pendingAssignments && assignmentErrors.pendingAssignments.length > 0 ? `
              <div style="margin-bottom:12px">
                <div style="font-weight:600;font-size:12px;color:var(--clr-warning-text);margin-bottom:8px">Pending Activations (${assignmentErrors.pendingAssignments.length})</div>
                <div style="display:grid;gap:6px">
                  ${assignmentErrors.pendingAssignments.slice(0, expandedAlertSections.pendingAssignments ? undefined : 5).map(err => `
                    <div style="padding:8px;background:rgba(250, 190, 88, 0.05);border-radius:4px;font-size:11px;border-left:3px solid var(--clr-warning-text)">
                      <div style="font-weight:500">${err.displayName}</div>
                      <div style="color:var(--color-text-tertiary);font-size:10px">${err.userPrincipalName}</div>
                    </div>
                  `).join('')}
                  ${assignmentErrors.pendingAssignments.length > 5 ? `<button onclick="window.toggleAlertSection('pendingAssignments')" style="background:none;border:none;padding:8px;text-align:center;font-size:9px;color:var(--clr-info-text);cursor:pointer;width:100%;font-weight:600">
                    ${expandedAlertSections.pendingAssignments ? '▼ Show less' : `+ ${assignmentErrors.pendingAssignments.length - 5} more`}
                  </button>` : ''}
                </div>
              </div>
            ` : ''}
          </div>
        </div>
      ` : ''}

      <!-- No Alerts -->
      ${(!expirationAlerts.critical || expirationAlerts.critical.length === 0) &&
        (!expirationAlerts.warning || expirationAlerts.warning.length === 0) &&
        (servicePlanConflicts.total === 0) &&
        (assignmentErrors.total === 0) ? `
        <div class="card" style="text-align:center;padding:40px 20px;background:rgba(34, 197, 94, 0.05)">
          <i class="ti ti-check-circle" style="font-size:32px;color:var(--clr-success-text);margin-bottom:12px;display:block"></i>
          <div style="font-weight:600;font-size:12px;color:var(--clr-success-text)">✅ No Critical Alerts</div>
          <div style="font-size:10px;color:var(--color-text-tertiary);margin-top:6px">All license governance checks passed</div>
        </div>
      ` : ''}
    </div>
  `
}

function renderExecutiveSummary() {
  return `
    <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:12px;margin-bottom:24px">
      <div class="card" style="padding:12px;background:var(--color-background-primary)">
        <div style="font-size:10px;color:var(--color-text-tertiary);text-transform:uppercase;font-weight:600;margin-bottom:6px">Total Licenses Purchased</div>
        <div style="font-size:28px;font-weight:700;color:var(--clr-info-text)">${licenseSummary.total.toLocaleString()}</div>
      </div>
      <div class="card" style="padding:12px;background:var(--color-background-primary)">
        <div style="font-size:10px;color:var(--color-text-tertiary);text-transform:uppercase;font-weight:600;margin-bottom:6px">Assigned Licenses</div>
        <div style="font-size:28px;font-weight:700;color:var(--clr-warning-text)">${licenseSummary.consumed.toLocaleString()}</div>
      </div>
      <div class="card" style="padding:12px;background:var(--color-background-primary)">
        <div style="font-size:10px;color:var(--color-text-tertiary);text-transform:uppercase;font-weight:600;margin-bottom:6px">Available Licenses</div>
        <div style="font-size:28px;font-weight:700;color:var(--clr-success-text)">${licenseSummary.available.toLocaleString()}</div>
      </div>
      <div class="card" style="padding:12px;background:var(--color-background-primary)">
        <div style="font-size:10px;color:var(--color-text-tertiary);text-transform:uppercase;font-weight:600;margin-bottom:6px">Utilization Rate</div>
        <div style="font-size:28px;font-weight:700;color:var(--clr-warning-text)">${licenseSummary.utilizationPct}%</div>
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
        <thead style="background:var(--color-background-secondary)">
          <tr>
            <th style="padding:10px;text-align:left;font-weight:600;font-size:10px;width:25%">Product Name / SKU</th>
            <th style="padding:10px;text-align:center;font-weight:600;font-size:10px;width:12%">Purchased</th>
            <th style="padding:10px;text-align:center;font-weight:600;font-size:10px;width:12%">Assigned</th>
            <th style="padding:10px;text-align:center;font-weight:600;font-size:10px;width:12%">Available</th>
            <th style="padding:10px;text-align:center;font-weight:600;font-size:10px;width:20%">Usage</th>
            <th style="padding:10px;text-align:center;font-weight:600;font-size:10px;width:19%">Status</th>
          </tr>
        </thead>
        <tbody>
          ${getFilteredLicensesForKPI().map(l => `
            <tr style="border-bottom:0.5px solid var(--color-border-tertiary)">
              <td style="padding:10px;font-size:11px;font-weight:500;color:var(--color-text-secondary)">${l.name || '—'}</td>
              <td style="padding:10px;text-align:center;font-size:11px;color:var(--color-text-secondary)">${(l.total || 0).toLocaleString()}</td>
              <td style="padding:10px;text-align:center;font-size:11px;color:var(--color-text-secondary)">${(l.consumed || 0).toLocaleString()}</td>
              <td style="padding:10px;text-align:center;font-size:11px;color:var(--color-text-secondary)">${(l.available || 0).toLocaleString()}</td>
              <td style="padding:10px">
                <div style="display:flex;align-items:center;gap:8px">
                  <div class="score-bar" style="flex:1">
                    <div class="score-bar-fill ${l.statusCls || 'success'}" style="width:${l.utilizationPct || 0}%"></div>
                  </div>
                  <span style="font-size:10px;font-weight:600;min-width:30px">${l.utilizationPct || 0}%</span>
                </div>
              </td>
              <td style="padding:10px;text-align:center"><span class="badge ${l.statusCls || 'success'}" style="text-transform:capitalize">${l.status || 'healthy'}</span></td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>
  `
}

function getStatusColor(status) {
  if (!status) return 'var(--clr-success-text)'
  switch (status.toLowerCase()) {
    case 'enabled': return 'var(--clr-success-text)'
    case 'pendingactivation': return 'var(--clr-warning-text)'
    case 'pendingprovisioning': return 'var(--clr-warning-text)'
    case 'disabled': return 'var(--clr-danger-text)'
    default: return 'var(--color-text-secondary)'
  }
}

window.openServicePlansModal = function(skuId) {
  const servicePlans = servicePlansStore[skuId] || { name: 'Unknown', plans: [] }
  const licenseName = servicePlans.name
  const plans = servicePlans.plans || []

  const modal = document.createElement('div')
  modal.id = 'service-plans-modal'
  modal.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 9999;
  `

  const enabledCount = (plans || []).filter(sp => sp.provisioningStatus === 'Success').length
  const disabledCount = (plans || []).filter(sp => sp.provisioningStatus === 'Disabled').length
  const pendingCount = (plans || []).filter(sp => sp.provisioningStatus?.toLowerCase().includes('pending')).length

  modal.innerHTML = `
    <div style="background: var(--color-background-primary); border-radius: var(--border-radius-md); width: 90%; max-width: 750px; max-height: 85vh; display: flex; flex-direction: column; box-shadow: 0 10px 40px rgba(0,0,0,0.2);">
      <div class="card-header" style="border-bottom: 0.5px solid var(--color-border-tertiary); padding: 12px 16px; display: flex; justify-content: space-between; align-items: flex-start; gap: 12px;">
        <div style="flex: 1;">
          <span class="card-title"><i class="ti ti-list"></i> ${licenseName}</span>
          <div style="font-size: 10px; color: var(--color-text-tertiary); margin-top: 6px;">
            <span style="font-weight: 600;">${plans.length}</span> service plans •
            <span style="color: var(--clr-success-text); font-weight: 500;">✓ ${enabledCount}</span> •
            <span style="color: var(--clr-danger-text); font-weight: 500;">✗ ${disabledCount}</span>
            ${pendingCount > 0 ? ` • <span style="color: var(--clr-warning-text); font-weight: 500;">⏳ ${pendingCount}</span>` : ''}
          </div>
        </div>
        <button onclick="document.getElementById('service-plans-modal').remove()" style="background: none; border: none; font-size: 16px; cursor: pointer; color: var(--color-text-tertiary); padding: 0; width: 24px; height: 24px; display: flex; align-items: center; justify-content: center; flex-shrink: 0;">✕</button>
      </div>

      <div style="flex: 1; overflow-y: auto; padding: 12px;">
        ${plans.length > 0 ? `
          <table style="width:100%">
            ${plans.length > 0 ? `
              <thead style="background: var(--color-background-secondary);">
                <tr>
                  <th style="padding: 10px; text-align: left; font-size: 10px; font-weight: 600; color: var(--color-text-secondary);">#</th>
                  <th style="padding: 10px; text-align: left; font-size: 10px; font-weight: 600; color: var(--color-text-secondary);">Service Plan</th>
                  <th style="padding: 10px; text-align: left; font-size: 10px; font-weight: 600; color: var(--color-text-secondary);">Status</th>
                </tr>
              </thead>
            ` : ''}
            <tbody>
              ${plans.map((sp, idx) => `
                <tr style="border-bottom: 0.5px solid var(--color-border-tertiary);">
                  <td style="padding: 10px; font-size: 10px; color: var(--color-text-tertiary); width: 30px;">${idx + 1}</td>
                  <td style="padding: 10px; font-size: 11px; color: var(--color-text-secondary); font-weight: 500;">${sp.serviceName || '—'}</td>
                  <td style="padding: 10px; font-size: 10px;">
                    <span style="color: ${getStatusColor(sp.provisioningStatus)}; font-weight: 600;">${sp.provisioningStatus || 'Unknown'}</span>
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        ` : `
          <div style="text-align: center; color: var(--color-text-tertiary); padding: 40px 20px;">
            <i class="ti ti-inbox" style="font-size: 28px; margin-bottom: 8px; display: block;"></i>
            <div style="font-size: 10px;">No service plans found</div>
          </div>
        `}
      </div>
    </div>
  `

  document.body.appendChild(modal)
  modal.addEventListener('click', (e) => {
    if (e.target === modal) modal.remove()
  })
}

function renderServicePlans() {
  // Store service plans data for modal access
  getFilteredLicensesForKPI().forEach(l => {
    servicePlansStore[l.skuId] = {
      name: l.name,
      plans: (l.servicePlans || []).map(sp => ({
        serviceName: sp.serviceName,
        provisioningStatus: sp.provisioningStatus
      }))
    }
  })

  return `
    <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(380px,1fr));gap:16px">
      ${getFilteredLicensesForKPI().map(l => `
        <div class="card" style="cursor: pointer; transition: all 0.2s ease; overflow: hidden;" onmouseover="this.style.boxShadow='0 8px 24px rgba(0,0,0,0.12)'; this.style.transform='translateY(-2px)'" onmouseout="this.style.boxShadow=''; this.style.transform=''" onclick="window.openServicePlansModal('${l.skuId}')">
          <div class="card-header">
            <span class="card-title"><i class="ti ti-packages"></i> ${l.name || '—'}</span>
            <span class="badge ${l.statusCls || 'success'}">${l.utilizationPct || 0}%</span>
          </div>
          <div style="padding:10px 12px;font-size:10px;color:var(--color-text-secondary);border-bottom:0.5px solid var(--color-border-tertiary)">
            <span style="font-weight:600;color:var(--color-text-primary)">${(l.total || 0).toLocaleString()}</span> licenses •
            <span style="font-weight:600;color:var(--color-text-primary)">${(l.consumed || 0).toLocaleString()}</span> assigned
          </div>
          <div style="padding:12px">
            <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px">
              <div style="font-size:10px;text-transform:uppercase;font-weight:600;color:var(--color-text-tertiary)">Service Plans <span style="color:var(--color-text-primary);font-size:11px">(${(l.servicePlans || []).length})</span></div>
              <span style="font-size:9px;color:var(--clr-info-text);font-weight:500">Click to view all →</span>
            </div>
            ${(l.servicePlans || []).length > 0 ? `
              <div style="display:grid;gap:6px;max-height:180px;overflow-y:auto">
                ${(l.servicePlans || []).slice(0, 5).map(sp => `
                  <div style="display:flex;align-items:center;gap:8px;font-size:10px;padding:6px 0;border-bottom:0.5px solid var(--color-border-tertiary)">
                    <i class="ti ti-circle-filled" style="color:${getStatusColor(sp.provisioningStatus)};font-size:6px;flex-shrink:0"></i>
                    <div style="flex:1;min-width:0">
                      <div style="font-weight:500;color:var(--color-text-secondary)">${sp.serviceName || '—'}</div>
                    </div>
                    <span style="font-size:9px;color:${getStatusColor(sp.provisioningStatus)};font-weight:600;flex-shrink:0">${sp.provisioningStatus || 'Unknown'}</span>
                  </div>
                `).join('')}
                ${(l.servicePlans || []).length > 5 ? `<div style="padding:8px 0;text-align:center;color:var(--clr-info-text);font-size:9px;font-weight:600;border-top:0.5px solid var(--color-border-tertiary)">+ ${(l.servicePlans || []).length - 5} more services</div>` : ''}
              </div>
            ` : `
              <div style="color:var(--color-text-tertiary);font-size:10px;padding:8px 0">No service plans found</div>
            `}
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
        <div style="padding:40px 20px;text-align:center;color:var(--color-text-tertiary)">
          <i class="ti ti-inbox" style="font-size:32px;margin-bottom:8px;display:block"></i>
          <div style="font-size:10px;">No user license assignments found</div>
        </div>
      ` : `
        <table style="width:100%">
          <thead style="background:var(--color-background-secondary)">
            <tr>
              <th style="padding:10px;text-align:left;font-weight:600;font-size:10px">User Name / Email</th>
              <th style="padding:10px;text-align:left;font-weight:600;font-size:10px">Department</th>
              <th style="padding:10px;text-align:left;font-weight:600;font-size:10px">Licenses</th>
              <th style="padding:10px;text-align:center;font-weight:600;font-size:10px">Count</th>
            </tr>
          </thead>
          <tbody>
            ${userAssignments.slice(0, 50).map(u => `
              <tr style="border-bottom:0.5px solid var(--color-border-tertiary)">
                <td style="padding:10px">
                  <div style="font-weight:600;font-size:11px;color:var(--color-text-secondary)">${u.displayName || '—'}</div>
                  <div style="font-size:10px;color:var(--color-text-tertiary);margin-top:2px">${u.userPrincipalName || '—'}</div>
                </td>
                <td style="padding:10px;font-size:10px;color:var(--color-text-secondary)">${u.department || '—'}</td>
                <td style="padding:10px;font-size:10px">
                  ${(u.licenses || []).map(l => `<span class="badge secondary" style="margin-right:4px;margin-bottom:4px;font-size:9px">${l.skuPartNumber || l.skuId}</span>`).join('')}
                </td>
                <td style="padding:10px;text-align:center;font-size:11px;font-weight:600;color:var(--color-text-secondary)">${u.licenseCount || 0}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
        ${userAssignments.length > 50 ? `<div style="padding:10px;text-align:center;font-size:10px;color:var(--color-text-tertiary);background:var(--color-background-secondary)">Showing 50 of ${userAssignments.length} users</div>` : ''}
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

function getPaginatedData(data, paginationKey) {
  const page = compliancePagination[paginationKey]
  const items = data || []
  const totalPages = Math.ceil(items.length / page.pageSize)
  const startIdx = (page.currentPage - 1) * page.pageSize
  const endIdx = startIdx + page.pageSize
  const pageItems = items.slice(startIdx, endIdx)

  return {
    items: pageItems,
    currentPage: page.currentPage,
    totalPages: Math.max(1, totalPages),
    totalItems: items.length,
    startIdx: startIdx + 1,
    endIdx: Math.min(endIdx, items.length)
  }
}

function createPaginationHTML(paginationKey, label) {
  const page = compliancePagination[paginationKey]
  const { totalPages, currentPage, totalItems } = getPaginatedData([], paginationKey)

  if (totalPages <= 1) return ''

  return `
    <div style="margin-top:12px;display:flex;gap:8px;align-items:center;font-size:10px;color:var(--color-text-secondary)">
      <button onclick="window.compliancePrevPage('${paginationKey}')" class="btn-sm" style="padding:4px 8px;${currentPage === 1 ? 'opacity:0.5;cursor:not-allowed' : ''}">${currentPage === 1 ? '← Prev' : '← Previous'}</button>
      <span>${getPaginatedData([], paginationKey).startIdx}-${getPaginatedData([], paginationKey).endIdx} of ${totalItems} users</span>
      <button onclick="window.complianceNextPage('${paginationKey}')" class="btn-sm" style="padding:4px 8px;${currentPage === totalPages ? 'opacity:0.5;cursor:not-allowed' : ''}">${currentPage === totalPages ? 'Next →' : 'Next →'}</button>
    </div>
  `
}

window.compliancePrevPage = function(paginationKey) {
  if (compliancePagination[paginationKey].currentPage > 1) {
    compliancePagination[paginationKey].currentPage--
    const contentEl = document.getElementById('tab-content')
    if (contentEl) {
      contentEl.innerHTML = renderCompliance()
    }
  }
}

window.complianceNextPage = function(paginationKey) {
  const data = paginationKey === 'disabled' ? complianceData.disabledUsersDetail :
               paginationKey === 'inactive' ? complianceData.inactiveUsersDetail :
               paginationKey === 'guest' ? complianceData.guestUsersDetail :
               complianceData.overlicensedDetail
  const totalPages = Math.ceil((data || []).length / compliancePagination[paginationKey].pageSize)
  if (compliancePagination[paginationKey].currentPage < totalPages) {
    compliancePagination[paginationKey].currentPage++
    const contentEl = document.getElementById('tab-content')
    if (contentEl) {
      contentEl.innerHTML = renderCompliance()
    }
  }
}

function renderCompliance() {
  const scores = complianceData.scores || { utilization: 0, costOptimization: 0, securityCoverage: 0, compliance: 0 }
  const costOpt = complianceData.costOptimization || {}

  const disabledPaginated = getPaginatedData(complianceData.disabledUsersDetail || [], 'disabled')
  const inactivePaginated = getPaginatedData(complianceData.inactiveUsersDetail || [], 'inactive')
  const guestPaginated = getPaginatedData(complianceData.guestUsersDetail || [], 'guest')
  const overlicensePaginated = getPaginatedData(complianceData.overlicensedDetail || [], 'overlicense')

  return `
    <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(250px,1fr));gap:16px;margin-bottom:24px">
      <div class="card" style="padding:16px;text-align:center">
        <div style="font-size:32px;font-weight:700;color:${scores.utilization >= 80 ? 'var(--clr-success-text)' : scores.utilization >= 60 ? 'var(--clr-warning-text)' : 'var(--clr-danger-text)'}">${scores.utilization || 0}%</div>
        <div style="font-size:11px;font-weight:600;margin-top:8px">License Utilization</div>
        <div style="font-size:9px;color:var(--color-text-secondary);margin-top:8px;line-height:1.4">Percentage of assigned licenses actively used by employees</div>
      </div>
      <div class="card" style="padding:16px;text-align:center">
        <div style="font-size:32px;font-weight:700;color:${scores.costOptimization >= 80 ? 'var(--clr-success-text)' : scores.costOptimization >= 60 ? 'var(--clr-warning-text)' : 'var(--clr-danger-text)'}">${scores.costOptimization || 0}%</div>
        <div style="font-size:11px;font-weight:600;margin-top:8px">Cost Optimization</div>
        <div style="font-size:9px;color:var(--color-text-secondary);margin-top:8px;line-height:1.4">Reduced by disabled users, inactive users, and overlicensing</div>
      </div>
      <div class="card" style="padding:16px;text-align:center">
        <div style="font-size:32px;font-weight:700;color:${scores.securityCoverage >= 80 ? 'var(--clr-success-text)' : scores.securityCoverage >= 60 ? 'var(--clr-warning-text)' : 'var(--clr-danger-text)'}">${scores.securityCoverage || 0}%</div>
        <div style="font-size:11px;font-weight:600;margin-top:8px">Security Coverage</div>
        <div style="font-size:9px;color:var(--color-text-secondary);margin-top:8px;line-height:1.4">Penalized if guest users have premium M365 licenses</div>
      </div>
      <div class="card" style="padding:16px;text-align:center">
        <div style="font-size:32px;font-weight:700;color:${scores.compliance >= 80 ? 'var(--clr-success-text)' : scores.compliance >= 60 ? 'var(--clr-warning-text)' : 'var(--clr-danger-text)'}">${scores.compliance || 0}%</div>
        <div style="font-size:11px;font-weight:600;margin-top:8px">Compliance Score</div>
        <div style="font-size:9px;color:var(--color-text-secondary);margin-top:8px;line-height:1.4">Overall health across all licensing best practices</div>
      </div>
    </div>

    <div class="card" style="margin-bottom:16px;background:rgba(99, 102, 241, 0.03);border-left:4px solid var(--clr-info-text)">
      <div class="card-header">
        <span class="card-title"><i class="ti ti-info-circle"></i> How These Scores Are Calculated</span>
      </div>
      <div style="padding:12px;display:grid;gap:8px;font-size:10px">
        <div><strong>📊 License Utilization:</strong> Starts at 85% • Reduced by inactive users (90+ days no login)</div>
        <div><strong>💰 Cost Optimization:</strong> Starts at 80% • Reduced by disabled users with licenses (-10%) • Reduced by inactive users (-5%) • Reduced by overlicensing (-8%)</div>
        <div><strong>🔒 Security Coverage:</strong> Starts at 90% • Reduced if guest users have premium licenses (-15%)</div>
        <div><strong>✅ Compliance Score:</strong> Overall assessment based on all factors above • Ranges 0-100%</div>
        <div style="padding-top:4px;border-top:1px solid rgba(99, 102, 241, 0.2);margin-top:8px;color:var(--color-text-secondary)">Scores are capped between 0-100%. Green (≥80%), Yellow (60-79%), Red (&lt;60%)</div>
      </div>
    </div>

    <div class="card" style="margin-bottom:16px">
      <div class="card-header">
        <span class="card-title"><i class="ti ti-list"></i> Findings Summary</span>
      </div>
      <div style="padding:16px;display:grid;grid-template-columns:repeat(auto-fit,minmax(150px,1fr));gap:12px">
        <div style="padding:12px;background:rgba(239, 68, 68, 0.05);border-radius:6px;border-left:3px solid var(--clr-danger-text)">
          <div style="font-size:24px;font-weight:700;color:var(--clr-danger-text)">${complianceData.disabledUsersWithLicenses || 0}</div>
          <div style="font-size:10px;margin-top:4px">Disabled Users</div>
        </div>
        <div style="padding:12px;background:rgba(250, 190, 88, 0.05);border-radius:6px;border-left:3px solid var(--clr-warning-text)">
          <div style="font-size:24px;font-weight:700;color:var(--clr-warning-text)">${complianceData.inactiveUsers || 0}</div>
          <div style="font-size:10px;margin-top:4px">Inactive Users</div>
        </div>
        <div style="padding:12px;background:rgba(59, 130, 246, 0.05);border-radius:6px;border-left:3px solid var(--clr-info-text)">
          <div style="font-size:24px;font-weight:700;color:var(--clr-info-text)">${complianceData.guestUsersWithPremium || 0}</div>
          <div style="font-size:10px;margin-top:4px">Guest Premium Users</div>
        </div>
        <div style="padding:12px;background:rgba(168, 85, 247, 0.05);border-radius:6px;border-left:3px solid var(--clr-warning-text)">
          <div style="font-size:24px;font-weight:700;color:var(--clr-warning-text)">${complianceData.overlicensedUsers || 0}</div>
          <div style="font-size:10px;margin-top:4px">Overlicensed Users</div>
        </div>
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
        <span class="card-title"><i class="ti ti-shield-alert"></i> Compliance Findings Details</span>
      </div>
      <div style="padding:12px">
        <div style="display:grid;gap:12px">
          ${complianceData.disabledUsersWithLicenses > 0 ? `
          <div style="padding:12px;background:rgba(239, 68, 68, 0.05);border-radius:6px;border-left:3px solid var(--clr-danger-text)">
            <div style="font-weight:600;font-size:11px">🚫 Disabled Users with Active Licenses</div>
            <div style="font-size:10px;color:var(--color-text-secondary);margin-top:4px">${complianceData.disabledUsersWithLicenses} users wasting licenses</div>
            ${disabledPaginated.totalItems > 0 ? `
            <div style="margin-top:8px;font-size:10px;border-top:1px solid rgba(239, 68, 68, 0.2);padding-top:8px">
              ${disabledPaginated.items.map(u => `<div style="padding:4px 0"><strong>${u.displayName}</strong> (${u.licenseCount} license${u.licenseCount !== 1 ? 's' : ''})</div>`).join('')}
              ${createPaginationHTML('disabled', 'Disabled Users')}
            </div>
            ` : ''}
          </div>
          ` : ''}

          ${complianceData.inactiveUsers > 0 ? `
          <div style="padding:12px;background:rgba(250, 190, 88, 0.05);border-radius:6px;border-left:3px solid var(--clr-warning-text)">
            <div style="font-weight:600;font-size:11px">⏱️ Inactive Users (90+ days)</div>
            <div style="font-size:10px;color:var(--color-text-secondary);margin-top:4px">${complianceData.inactiveUsers} users with no activity but consuming licenses</div>
            ${inactivePaginated.totalItems > 0 ? `
            <div style="margin-top:8px;font-size:10px;border-top:1px solid rgba(250, 190, 88, 0.2);padding-top:8px">
              ${inactivePaginated.items.map(u => `<div style="padding:4px 0"><strong>${u.displayName}</strong> • Last sign-in: ${u.lastSignIn} (${u.licenseCount} license${u.licenseCount !== 1 ? 's' : ''})</div>`).join('')}
              ${createPaginationHTML('inactive', 'Inactive Users')}
            </div>
            ` : ''}
          </div>
          ` : ''}

          ${complianceData.guestUsersWithPremium > 0 ? `
          <div style="padding:12px;background:rgba(59, 130, 246, 0.05);border-radius:6px;border-left:3px solid var(--clr-info-text)">
            <div style="font-weight:600;font-size:11px">👥 Guest Users with Premium Licenses</div>
            <div style="font-size:10px;color:var(--color-text-secondary);margin-top:4px">${complianceData.guestUsersWithPremium} external users consuming premium licenses</div>
            ${guestPaginated.totalItems > 0 ? `
            <div style="margin-top:8px;font-size:10px;border-top:1px solid rgba(59, 130, 246, 0.2);padding-top:8px">
              ${guestPaginated.items.map(u => `<div style="padding:4px 0"><strong>${u.displayName}</strong> (${u.licenseCount} license${u.licenseCount !== 1 ? 's' : ''})</div>`).join('')}
              ${createPaginationHTML('guest', 'Guest Users')}
            </div>
            ` : ''}
          </div>
          ` : ''}

          ${complianceData.overlicensedUsers > 0 ? `
          <div style="padding:12px;background:rgba(168, 85, 247, 0.05);border-radius:6px;border-left:3px solid var(--clr-warning-text)">
            <div style="font-weight:600;font-size:11px">📦 Overlicensed Users</div>
            <div style="font-size:10px;color:var(--color-text-secondary);margin-top:4px">${complianceData.overlicensedUsers} users with redundant license combinations</div>
            ${overlicensePaginated.totalItems > 0 ? `
            <div style="margin-top:8px;font-size:10px;border-top:1px solid rgba(168, 85, 247, 0.2);padding-top:8px">
              ${overlicensePaginated.items.map(u => `<div style="padding:4px 0"><strong>${u.displayName}</strong> (${u.licenseCount} licenses: ${u.licenses.join(', ')})</div>`).join('')}
              ${createPaginationHTML('overlicense', 'Overlicensed Users')}
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

function renderAuditTrail() {
  if (!auditTrail || auditTrail.length === 0) {
    return `
      <div class="card" style="text-align:center;padding:40px 20px">
        <i class="ti ti-inbox" style="font-size:32px;color:var(--color-text-tertiary);margin-bottom:12px;display:block"></i>
        <div style="font-size:12px;color:var(--color-text-tertiary)">No audit trail data available</div>
      </div>
    `
  }

  return `
    <div style="margin-bottom:24px">
      <div class="card">
        <div class="card-header">
          <span class="card-title"><i class="ti ti-history"></i> License Assignment Audit Trail</span>
        </div>
        <div style="padding:12px">
          <table style="width:100%;border-collapse:collapse;font-size:11px">
            <thead>
              <tr style="border-bottom:1px solid var(--color-border-tertiary);background:var(--color-background-secondary)">
                <th style="padding:8px;text-align:left;font-weight:600">Timestamp</th>
                <th style="padding:8px;text-align:left;font-weight:600">Action</th>
                <th style="padding:8px;text-align:left;font-weight:600">Target User</th>
                <th style="padding:8px;text-align:left;font-weight:600">Initiated By</th>
              </tr>
            </thead>
            <tbody>
              ${auditTrail.slice(0, 50).map(entry => `
                <tr style="border-bottom:0.5px solid var(--color-border-tertiary)">
                  <td style="padding:8px">${new Date(entry.timestamp).toLocaleDateString()} ${new Date(entry.timestamp).toLocaleTimeString()}</td>
                  <td style="padding:8px"><span class="badge ${entry.action.includes('Assign') ? 'success' : entry.action.includes('Remove') ? 'danger' : 'info'}">${entry.action}</span></td>
                  <td style="padding:8px">${entry.targetUser}</td>
                  <td style="padding:8px">${entry.initiator}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
          <div style="margin-top:12px;font-size:10px;color:var(--color-text-tertiary)">
            Showing ${Math.min(50, auditTrail.length)} of ${auditTrail.length} entries
          </div>
        </div>
      </div>
    </div>
  `
}

function renderDepartmentKPIs() {
  if (!departmentKPIs || departmentKPIs.length === 0) {
    return `
      <div class="card" style="text-align:center;padding:40px 20px">
        <i class="ti ti-inbox" style="font-size:32px;color:var(--color-text-tertiary);margin-bottom:12px;display:block"></i>
        <div style="font-size:12px;color:var(--color-text-tertiary)">No department data available</div>
      </div>
    `
  }

  return `
    <div style="margin-bottom:24px">
      <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:12px;margin-bottom:24px">
        <div class="card" style="padding:12px">
          <div style="font-size:10px;color:var(--color-text-tertiary);text-transform:uppercase;font-weight:600;margin-bottom:6px">Total Departments</div>
          <div style="font-size:28px;font-weight:700;color:var(--clr-info-text)">${departmentKPIs.length}</div>
        </div>
        <div class="card" style="padding:12px">
          <div style="font-size:10px;color:var(--color-text-tertiary);text-transform:uppercase;font-weight:600;margin-bottom:6px">Total Users</div>
          <div style="font-size:28px;font-weight:700;color:var(--clr-info-text)">${departmentKPIs.reduce((sum, d) => sum + d.users, 0).toLocaleString()}</div>
        </div>
        <div class="card" style="padding:12px">
          <div style="font-size:10px;color:var(--color-text-tertiary);text-transform:uppercase;font-weight:600;margin-bottom:6px">Total Licenses</div>
          <div style="font-size:28px;font-weight:700;color:var(--clr-warning-text)">${departmentKPIs.reduce((sum, d) => sum + d.totalLicenses, 0).toLocaleString()}</div>
        </div>
      </div>

      <div class="card">
        <div class="card-header">
          <span class="card-title"><i class="ti ti-chart-bar"></i> License Distribution by Department</span>
        </div>
        <div style="padding:12px">
          <table style="width:100%;border-collapse:collapse;font-size:11px">
            <thead>
              <tr style="border-bottom:1px solid var(--color-border-tertiary);background:var(--color-background-secondary)">
                <th style="padding:8px;text-align:left;font-weight:600">Department</th>
                <th style="padding:8px;text-align:center;font-weight:600">Users</th>
                <th style="padding:8px;text-align:center;font-weight:600">Licenses</th>
                <th style="padding:8px;text-align:center;font-weight:600">Avg/User</th>
              </tr>
            </thead>
            <tbody>
              ${departmentKPIs.slice(0, 30).map(dept => `
                <tr style="border-bottom:0.5px solid var(--color-border-tertiary)">
                  <td style="padding:8px"><strong>${dept.department || 'Unassigned'}</strong></td>
                  <td style="padding:8px;text-align:center">${dept.users}</td>
                  <td style="padding:8px;text-align:center"><span style="background:var(--color-background-secondary);padding:4px 8px;border-radius:4px;font-weight:600">${dept.totalLicenses}</span></td>
                  <td style="padding:8px;text-align:center">${(dept.totalLicenses / (dept.users || 1)).toFixed(2)}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `
}

function renderPrivilegedAccounts() {
  const { adminsWithoutP2, adminsWithoutDefender, adminsWithBoth, total } = privilegedAccounts

  if (total === 0) {
    return `
      <div class="card" style="text-align:center;padding:40px 20px">
        <i class="ti ti-inbox" style="font-size:32px;color:var(--color-text-tertiary);margin-bottom:12px;display:block"></i>
        <div style="font-size:12px;color:var(--color-text-tertiary)">No admin accounts found</div>
      </div>
    `
  }

  return `
    <div style="margin-bottom:24px">
      <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:12px;margin-bottom:24px">
        <div class="card" style="padding:12px;border-left:4px solid var(--clr-success-text)">
          <div style="font-size:10px;color:var(--color-text-tertiary);text-transform:uppercase;font-weight:600;margin-bottom:6px">✅ Secure</div>
          <div style="font-size:28px;font-weight:700;color:var(--clr-success-text)">${adminsWithBoth.length}</div>
          <div style="font-size:9px;color:var(--color-text-tertiary);margin-top:4px">With P2 & Defender</div>
        </div>
        <div class="card" style="padding:12px;border-left:4px solid var(--clr-danger-text)">
          <div style="font-size:10px;color:var(--color-text-tertiary);text-transform:uppercase;font-weight:600;margin-bottom:6px">🔴 Missing Both</div>
          <div style="font-size:28px;font-weight:700;color:var(--clr-danger-text)">${adminsWithoutP2.filter(a => adminsWithoutDefender.some(d => d.userPrincipalName === a.userPrincipalName)).length}</div>
          <div style="font-size:9px;color:var(--color-text-tertiary);margin-top:4px">High Risk</div>
        </div>
        <div class="card" style="padding:12px;border-left:4px solid var(--clr-warning-text)">
          <div style="font-size:10px;color:var(--color-text-tertiary);text-transform:uppercase;font-weight:600;margin-bottom:6px">⚠️ Missing P2</div>
          <div style="font-size:28px;font-weight:700;color:var(--clr-warning-text)">${adminsWithoutP2.length}</div>
          <div style="font-size:9px;color:var(--color-text-tertiary);margin-top:4px">No Entra P2</div>
        </div>
      </div>

      ${adminsWithBoth.length > 0 ? `
        <div class="card" style="margin-bottom:12px">
          <div class="card-header">
            <span class="card-title" style="color:var(--clr-success-text)"><i class="ti ti-check-circle"></i> ✅ Secure Admins (${adminsWithBoth.length})</span>
          </div>
          <div style="padding:12px">
            <table style="width:100%;border-collapse:collapse;font-size:11px">
              <thead>
                <tr style="border-bottom:1px solid var(--color-border-tertiary);background:var(--color-background-secondary)">
                  <th style="padding:8px;text-align:left;font-weight:600">Display Name</th>
                  <th style="padding:8px;text-align:left;font-weight:600">Email</th>
                  <th style="padding:8px;text-align:center;font-weight:600">Role</th>
                </tr>
              </thead>
              <tbody>
                ${adminsWithBoth.slice(0, 10).map(admin => `
                  <tr style="border-bottom:0.5px solid var(--color-border-tertiary)">
                    <td style="padding:8px">${admin.displayName}</td>
                    <td style="padding:8px;font-size:9px">${admin.userPrincipalName}</td>
                    <td style="padding:8px;text-align:center"><span class="badge success">${admin.role.split(' ')[0]}</span></td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        </div>
      ` : ''}

      ${adminsWithoutP2.length > 0 ? `
        <div class="card" style="margin-bottom:12px">
          <div class="card-header">
            <span class="card-title" style="color:var(--clr-warning-text)"><i class="ti ti-alert-triangle"></i> ⚠️ Missing Entra P2 (${adminsWithoutP2.length})</span>
          </div>
          <div style="padding:12px">
            <table style="width:100%;border-collapse:collapse;font-size:11px">
              <thead>
                <tr style="border-bottom:1px solid var(--color-border-tertiary);background:var(--color-background-secondary)">
                  <th style="padding:8px;text-align:left;font-weight:600">Display Name</th>
                  <th style="padding:8px;text-align:left;font-weight:600">Email</th>
                  <th style="padding:8px;text-align:center;font-weight:600">Role</th>
                  <th style="padding:8px;text-align:center;font-weight:600">Status</th>
                </tr>
              </thead>
              <tbody>
                ${adminsWithoutP2.slice(0, 10).map(admin => `
                  <tr style="border-bottom:0.5px solid var(--color-border-tertiary)">
                    <td style="padding:8px">${admin.displayName}</td>
                    <td style="padding:8px;font-size:9px">${admin.userPrincipalName}</td>
                    <td style="padding:8px;text-align:center"><span class="badge info">${admin.role.split(' ')[0]}</span></td>
                    <td style="padding:8px;text-align:center"><span class="badge danger">Missing P2</span></td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        </div>
      ` : ''}
    </div>
  `
}
