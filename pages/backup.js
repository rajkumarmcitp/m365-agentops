import { showToast } from '../components/toast.js'
import { customSkeleton } from '../lib/skeleton-custom.js'
import { renderBackupExplorer, setupBackupExplorerEvents } from '../components/backup-explorer.js'
import { renderSelectiveRestoreModal, setupSelectiveRestoreModal } from '../components/selective-restore.js'

const isDev = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
const API_BASE = import.meta.env.VITE_API_URL || (isDev
  ? 'http://localhost:3001'
  : 'https://m365ops-api-gtbgezb9c7bgata7.centralus-01.azurewebsites.net')

let backupView = 'services'
let services = []
let backupHistory = []
let selectedService = null

export function initBackup() {
  const el = document.getElementById('page-backup')
  if (!el) return

  // Show skeleton immediately
  el.innerHTML = customSkeleton.renderPageWithTable(
    '<i class="ti ti-database-backup"></i> M365 Backup & Restore',
    'Backup and restore M365 configurations across all services',
    3,
    ['Service', 'Resources', 'Last Backup'],
    5
  )

  // Load real data with 300ms minimum skeleton display
  setTimeout(() => {
    loadBackupContent(el)
  }, 300)
}

async function loadBackupContent(el) {
  try {
    // Fetch available services
    const servicesResponse = await fetch(`${API_BASE}/api/backup/m365/services/list`)
    const servicesResult = await servicesResponse.json()

    if (!servicesResponse.ok || !servicesResult.success) {
      return renderBackupError(el, servicesResult)
    }

    services = servicesResult.data || []

    // Fetch backup history
    const historyResponse = await fetch(`${API_BASE}/api/backup/m365/backups`)
    const historyResult = historyResponse.ok ? await historyResponse.json() : { success: false, data: [] }

    backupHistory = historyResult.data || []

    renderBackupContent(el)
  } catch (error) {
    console.error('Failed to load backup content:', error)
    return renderBackupError(el, {
      error: 'Failed to connect to backend',
      message: error.message
    })
  }
}

function renderBackupError(el, error) {
  el.innerHTML = `
    <div class="page-header">
      <div class="page-title"><i class="ti ti-database-backup"></i> M365 Backup & Restore</div>
      <div class="page-subtitle">Backup and restore M365 configurations</div>
    </div>

    <div style="margin-top:20px">
      <div class="card" style="background:var(--color-background-secondary);border-left:3px solid var(--color-warning);padding:16px">
        <div style="font-size:13px;font-weight:500;margin-bottom:8px"><i class="ti ti-alert-circle"></i> ${error.error || 'Unable to load backup services'}</div>
        <div style="font-size:11px;color:var(--color-text-secondary);line-height:1.6">
          ${error.message || 'The backup service is not available.'}
          <br><br>
          <strong>To enable:</strong>
          <ol style="margin:0;padding-left:16px">
            <li>Ensure backend server is running (localhost:3001)</li>
            <li>Configure Azure credentials in .env</li>
            <li>Refresh this page</li>
          </ol>
        </div>
      </div>
    </div>
  `
}

function renderBackupContent(el) {
  const totalServices = services.length
  const totalResources = services.reduce((sum, s) => sum + (s.totalResources || 0), 0)
  const recentBackups = backupHistory.length

  el.innerHTML = `
    <div class="page-header">
      <div class="page-title"><i class="ti ti-database-backup"></i> M365 Backup & Restore</div>
      <div class="page-subtitle">Backup and restore M365 configurations across all services</div>
    </div>

    <div class="kpi-row">
      <div class="kpi-tile"><div class="kpi-value info">${totalServices}</div><div class="kpi-label">Services configured</div></div>
      <div class="kpi-tile"><div class="kpi-value" style="color:var(--color-success)">${totalResources}</div><div class="kpi-label">Total resources</div></div>
      <div class="kpi-tile"><div class="kpi-value warning">${recentBackups}</div><div class="kpi-label">Recent backups</div></div>
    </div>

    <div class="filter-bar mb-3">
      <button class="btn ${backupView === 'services' ? 'btn-primary' : 'btn-secondary'}" id="view-services">
        <i class="ti ti-layout-grid"></i> Services
      </button>
      <button class="btn ${backupView === 'history' ? 'btn-primary' : 'btn-secondary'}" id="view-history">
        <i class="ti ti-history"></i> Backup History
      </button>
      <button class="btn ${backupView === 'restore' ? 'btn-primary' : 'btn-secondary'}" id="view-restore">
        <i class="ti ti-restore"></i> Restore Explorer
      </button>
      <input type="text" class="form-input search" placeholder="Search services..." id="services-search" style="${backupView === 'services' ? '' : 'display:none'}">
    </div>

    ${backupView === 'services' ? renderServicesView() : backupView === 'history' ? renderHistoryView() : renderRestoreExplorerView()}

    <!-- Selective Restore Modal -->
    ${renderSelectiveRestoreModal()}
  `

  // Attach event listeners
  el.querySelector('#view-services')?.addEventListener('click', () => {
    backupView = 'services'
    renderBackupContent(el)
  })

  el.querySelector('#view-history')?.addEventListener('click', () => {
    backupView = 'history'
    renderBackupContent(el)
  })

  el.querySelector('#view-restore')?.addEventListener('click', () => {
    backupView = 'restore'
    renderBackupContent(el)
  })

  if (backupView === 'services') {
    const searchInput = el.querySelector('#services-search')
    if (searchInput) {
      searchInput.addEventListener('input', () => filterServices(el))
    }
  }

  // Attach Backup All button listener
  el.querySelector('#backup-all-btn')?.addEventListener('click', () => {
    triggerBackupAll(el)
  })

  // Attach backup button listeners
  el.querySelectorAll('.backup-service-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const serviceName = e.target.closest('button').dataset.service
      triggerBackup(el, serviceName)
    })
  })

  // Attach restore button listeners
  el.querySelectorAll('.restore-backup-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const backupId = e.target.closest('button').dataset.backupId
      showRestoreConfirm(el, backupId)
    })
  })

  // Initialize Restore Explorer if viewing restore
  if (backupView === 'restore') {
    setTimeout(async () => {
      await initializeRestoreExplorerBackup()
    }, 100)
  }
}

function renderServicesView() {
  return `
    <div class="card">
      <div style="padding:16px;border-bottom:1px solid var(--color-border);display:flex;justify-content:space-between;align-items:center">
        <div style="font-weight:600;font-size:14px">M365 Services</div>
        <button class="btn btn-sm btn-primary" id="backup-all-btn"><i class="ti ti-cloud-upload"></i> Backup All</button>
      </div>
      <div style="overflow-x:auto">
        <table>
          <thead><tr>
            <th style="width:25%">Service</th>
            <th style="width:15%">Tier</th>
            <th style="width:15%">Components</th>
            <th style="width:20%">Last Backup</th>
            <th style="width:25%">Action</th>
          </tr></thead>
          <tbody id="services-table-body">
            ${services.length === 0 ? `
              <tr><td colspan="5" style="text-align:center;padding:20px;color:var(--color-text-secondary)">
                No services available
              </td></tr>
            ` : services.map(service => {
              const lastBackup = backupHistory.find(b => b.serviceName === service.key)
              const tierClass = service.tier === 'Tier 1' ? 'danger' : service.tier === 'Tier 2' ? 'warning' : 'info'
              return `
                <tr class="service-row" data-service="${service.key}">
                  <td data-label="Service" style="font-weight:500">
                    <i class="ti ti-cloud"></i> ${service.displayName}
                  </td>
                  <td data-label="Tier">
                    <span class="badge ${tierClass}">${service.tier}</span>
                  </td>
                  <td data-label="Components" class="monospace">${service.totalResources}</td>
                  <td data-label="Last Backup" style="font-size:11px">
                    ${lastBackup ? new Date(lastBackup.timestamp).toLocaleString() : '<span style="color:var(--color-text-secondary)">Never</span>'}
                  </td>
                  <td data-label="Action">
                    <button class="btn btn-sm btn-primary backup-service-btn" data-service="${service.key}">
                      <i class="ti ti-cloud-upload"></i> Backup
                    </button>
                  </td>
                </tr>
              `
            }).join('')}
          </tbody>
        </table>
      </div>
    </div>

    <div style="font-size:10px;color:var(--color-text-secondary);margin-top:12px;padding:0 12px">
      <strong>Service Tiers:</strong>
      Tier 1 = Critical (Exchange, Teams, SharePoint)
      | Tier 2 = Essential (Intune, OneDrive, Compliance, Security)
      | Tier 3 = Extended (PowerPlatform, TenantSettings, Dynamics365, Groups)
    </div>
  `
}

function renderHistoryView() {
  return `
    <div class="card">
      <div style="padding:16px;border-bottom:1px solid var(--color-border)">
        <div style="font-weight:600;font-size:14px">Backup History</div>
      </div>
      <div style="overflow-x:auto">
        <table>
          <thead><tr>
            <th style="width:20%">Backup ID</th>
            <th style="width:20%">Service</th>
            <th style="width:15%">Resources</th>
            <th style="width:15%">Status</th>
            <th style="width:15%">Timestamp</th>
            <th style="width:15%">Action</th>
          </tr></thead>
          <tbody id="history-table-body">
            ${backupHistory.length === 0 ? `
              <tr><td colspan="6" style="text-align:center;padding:20px;color:var(--color-text-secondary)">
                No backup history. Start by backing up a service.
              </td></tr>
            ` : backupHistory.map(backup => {
              const statusClass = backup.status === 'Completed' ? 'success' : backup.status === 'Failed' ? 'danger' : 'info'
              return `
                <tr class="history-row">
                  <td data-label="Backup ID" class="monospace" style="font-size:10px">${backup.backupId}</td>
                  <td data-label="Service">${backup.serviceName}</td>
                  <td data-label="Resources" class="monospace">${backup.resourceCount}</td>
                  <td data-label="Status">
                    <span class="badge ${statusClass}">${backup.status}</span>
                  </td>
                  <td data-label="Timestamp" style="font-size:11px">
                    ${new Date(backup.timestamp).toLocaleString()}
                  </td>
                  <td data-label="Action">
                    <button class="btn btn-sm btn-secondary restore-backup-btn" data-backup-id="${backup.backupId}"
                      ${backup.status !== 'Completed' ? 'disabled' : ''}>
                      <i class="ti ti-refresh"></i> Restore
                    </button>
                  </td>
                </tr>
              `
            }).join('')}
          </tbody>
        </table>
      </div>
    </div>
  `
}

function filterServices(el) {
  const searchInput = el.querySelector('#services-search')?.value?.toLowerCase() || ''
  const rows = el.querySelectorAll('.service-row')

  rows.forEach(row => {
    const text = row.textContent.toLowerCase()
    row.style.display = searchInput === '' || text.includes(searchInput) ? '' : 'none'
  })
}

async function triggerBackup(el, serviceName) {
  const btn = el.querySelector(`.backup-service-btn[data-service="${serviceName}"]`)
  if (!btn) return

  btn.disabled = true
  const originalHTML = btn.innerHTML

  try {
    btn.innerHTML = '<i class="ti ti-loader" style="animation:spin 1s linear infinite"></i> Backing up...'

    const response = await fetch(`${API_BASE}/api/backup/m365/trigger/${serviceName}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        description: `Manual backup at ${new Date().toLocaleString()}`,
        priority: 'high'
      })
    })

    const result = await response.json()

    if (result.success) {
      showToast(`✅ Backup initiated for ${serviceName}`, 'success')
      // Reload backup content to show updated status
      setTimeout(() => loadBackupContent(el), 2000)
    } else {
      showToast(`❌ Backup failed: ${result.error}`, 'error')
      btn.innerHTML = originalHTML
      btn.disabled = false
    }
  } catch (error) {
    console.error('Backup error:', error)
    showToast(`❌ Error: ${error.message}`, 'error')
    btn.innerHTML = originalHTML
    btn.disabled = false
  }
}

async function triggerBackupAll(el) {
  const btn = el.querySelector('#backup-all-btn')
  if (!btn) return

  btn.disabled = true
  const originalHTML = btn.innerHTML

  try {
    btn.innerHTML = '<i class="ti ti-loader" style="animation:spin 1s linear infinite"></i> Backing up all...'

    const response = await fetch(`${API_BASE}/api/backup/m365/trigger-all`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        description: `Full backup at ${new Date().toLocaleString()}`,
        priority: 'high'
      })
    })

    const result = await response.json()

    if (result.success) {
      const count = result.summary?.successful || result.results?.length || 0
      showToast(`✅ Backup initiated for ${count} services (${result.executionTime}s)`, 'success')
      // Reload backup content to show updated status
      setTimeout(() => loadBackupContent(el), 2000)
    } else {
      showToast(`❌ Backup failed: ${result.error}`, 'error')
      btn.innerHTML = originalHTML
      btn.disabled = false
    }
  } catch (error) {
    console.error('Backup All error:', error)
    showToast(`❌ Error: ${error.message}`, 'error')
    btn.innerHTML = originalHTML
    btn.disabled = false
  }
}

async function showRestoreConfirm(el, backupId) {
  const backup = backupHistory.find(b => b.backupId === backupId)
  if (!backup) {
    showToast('Backup not found', 'error')
    return
  }

  try {
    // Show the modal
    const modal = document.getElementById('selective-restore-modal')
    if (modal) {
      modal.style.display = 'flex'

      // Setup the modal with backup data
      await setupSelectiveRestoreModal(backupId, backup)
    }
  } catch (error) {
    console.error('Error showing restore modal:', error)
    showToast(`Error: ${error.message}`, 'error')
  }
}

async function restoreBackup(el, backupId, selectedResourceIds = []) {
  try {
    showToast(`⏳ Restoring ${selectedResourceIds.length} resources...`, 'info')

    const response = await fetch(`${API_BASE}/api/backup/m365/restore/${backupId}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        resourceIds: selectedResourceIds,
        targetEnvironment: 'production'
      })
    })

    const result = await response.json()

    if (result.success) {
      const restoreId = result.restoreId
      const resourceCount = selectedResourceIds.length || result.resourcesRequested

      // Store restore ID for tracking
      sessionStorage.setItem(`lastRestoreId_${backupId}`, restoreId)

      showToast(
        `✅ Restore initiated (ID: ${restoreId.substring(0, 15)}...)\n🔍 Check Console or Restore Status to verify progress`,
        'success'
      )

      // Log restore details for user verification
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
      console.log('✅ RESTORE INITIATED')
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
      console.log(`Restore ID: ${restoreId}`)
      console.log(`Backup ID: ${backupId}`)
      console.log(`Resources: ${resourceCount}`)
      console.log(`Status: ${result.status}`)
      console.log(`Timestamp: ${result.timestamp}`)
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
      console.log('To check restore status, run in console:')
      console.log(`checkRestoreStatus('${restoreId}')`)
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')

      // Make checkRestoreStatus available globally
      window.checkRestoreStatus = async (id) => {
        try {
          const response = await fetch(`${API_BASE}/api/backup/m365/restore/${id}/status`)
          const data = await response.json()
          if (data.success) {
            console.table(data.data)
            console.log('Details:', data.data.details)
            console.log('Errors:', data.data.errors)
          } else {
            console.error('Error:', data.error)
          }
        } catch (err) {
          console.error('Failed to fetch status:', err)
        }
      }

      // Reload after delay
      setTimeout(() => loadBackupContent(el), 2000)
    } else {
      showToast(`❌ Restore failed: ${result.error}`, 'error')
    }
  } catch (error) {
    console.error('Restore error:', error)
    showToast(`❌ Error: ${error.message}`, 'error')
  }
}

function renderExplorerView() {
  const html = renderBackupExplorer(backupHistory)

  // Attach event listeners after a brief delay to ensure DOM is ready
  setTimeout(() => {
    const pageContainer = document.getElementById('page-backup')
    if (pageContainer) {
      console.log('Setting up File Explorer events...')
      setupBackupExplorerEvents(pageContainer, API_BASE, showToast)
      console.log('File Explorer events attached')
    } else {
      console.warn('Page container not found')
    }
  }, 150)

  return html
}

// ============================================================
// RESTORE EXPLORER VIEW
// ============================================================

function renderRestoreExplorerView() {
  return `
    <style>
      .restore-scrollbar::-webkit-scrollbar { width: 8px; }
      .restore-scrollbar::-webkit-scrollbar-track { background: var(--color-bg-primary); }
      .restore-scrollbar::-webkit-scrollbar-thumb { background: var(--color-border-secondary); border-radius: 4px; }
      .restore-scrollbar::-webkit-scrollbar-thumb:hover { background: var(--color-text-secondary); }
    </style>
    <div style="padding:24px;height:100%;display:flex;flex-direction:column;background:var(--color-bg-primary);">
      <!-- Date Selection as Tabs -->
      <div style="margin-bottom:20px;">
        <label style="display:block;font-size:11px;font-weight:600;color:var(--color-text-secondary);text-transform:uppercase;margin-bottom:12px;letter-spacing:0.3px;">Select Backup Date <span id="restore-dates-count" style="color:var(--color-text-tertiary);font-weight:400;"> (Loading...)</span></label>
        <div id="restore-backup-tabs" style="display:flex;gap:4px;border-bottom:1px solid var(--color-border-secondary);padding-bottom:0;overflow-x:auto;scroll-behavior:smooth;-webkit-overflow-scrolling:touch;">
          <button style="padding:10px 14px;font-size:12px;font-weight:500;border:none;background:transparent;color:var(--color-text-secondary);cursor:pointer;border-bottom:2px solid transparent;white-space:nowrap;transition:all 0.2s;" disabled>Loading dates...</button>
        </div>
        <div style="font-size:10px;color:var(--color-text-tertiary);margin-top:6px;">💡 Scroll horizontally to view older backups</div>
      </div>

      <!-- Context Header -->
      <div id="restore-context-header" style="padding:14px;background:var(--color-bg-secondary);border-left:3px solid var(--color-primary);border-radius:6px;margin-bottom:24px;display:none;">
        <div style="font-size:13px;font-weight:600;color:var(--color-text-primary;">Restoring from: <span id="context-service" style="color:var(--color-primary);">Select a service</span></div>
        <div style="font-size:12px;color:var(--color-text-secondary);margin-top:4px;">Date: <span id="context-date" style="font-weight:600;">Select a date</span></div>
      </div>

      <!-- Four Column Layout -->
      <div style="flex:1;display:grid;grid-template-columns:220px 1fr 1fr 320px;gap:20px;min-height:0;margin-bottom:24px;">

        <!-- Services Column -->
        <div style="background:var(--color-bg-secondary);border:1px solid var(--color-border-secondary);border-radius:8px;display:flex;flex-direction:column;overflow:hidden;box-shadow:0 1px 3px rgba(0,0,0,0.05);">
          <div style="padding:16px;border-bottom:1px solid var(--color-border-tertiary);font-size:12px;font-weight:700;text-transform:uppercase;color:var(--color-text-primary);letter-spacing:0.5px;">📦 Services</div>
          <div id="restore-services-list" class="restore-scrollbar" style="flex:1;overflow-y:auto;padding:12px;gap:8px;display:flex;flex-direction:column;">
            <div style="padding:12px;color:var(--color-text-tertiary);font-size:13px;text-align:center;">Select backup date</div>
          </div>
        </div>

        <!-- Resource Types Column -->
        <div style="background:var(--color-bg-secondary);border:1px solid var(--color-border-secondary);border-radius:8px;display:flex;flex-direction:column;overflow:hidden;box-shadow:0 1px 3px rgba(0,0,0,0.05);">
          <div style="padding:16px;border-bottom:1px solid var(--color-border-tertiary);font-size:12px;font-weight:700;text-transform:uppercase;color:var(--color-text-primary);letter-spacing:0.5px;">📋 Resource Types</div>
          <div id="restore-types-list" class="restore-scrollbar" style="flex:1;overflow-y:auto;padding:12px;gap:8px;display:flex;flex-direction:column;">
            <div style="padding:12px;color:var(--color-text-tertiary);font-size:13px;text-align:center;">Select a service</div>
          </div>
        </div>

        <!-- Resources Column -->
        <div style="background:var(--color-bg-secondary);border:1px solid var(--color-border-secondary);border-radius:8px;display:flex;flex-direction:column;overflow:hidden;box-shadow:0 1px 3px rgba(0,0,0,0.05);">
          <div style="padding:16px;border-bottom:1px solid var(--color-border-tertiary);font-size:12px;font-weight:700;text-transform:uppercase;color:var(--color-text-primary);letter-spacing:0.5px;">📌 Resources</div>
          <div id="restore-search-container" style="padding:12px;border-bottom:1px solid var(--color-border-tertiary);display:none;">
            <input type="text" id="restore-resource-search" placeholder="Search resources..." style="width:100%;padding:8px 12px;border:1px solid var(--color-border-tertiary);border-radius:6px;font-size:13px;background:var(--color-bg-primary);color:var(--color-text-primary);">
          </div>
          <div id="restore-resources-list" class="restore-scrollbar" style="flex:1;overflow-y:auto;padding:12px;gap:8px;display:flex;flex-direction:column;">
            <div style="padding:12px;color:var(--color-text-tertiary);font-size:13px;text-align:center;">Select a resource type</div>
          </div>
        </div>

        <!-- Preview Column -->
        <div style="background:var(--color-bg-secondary);border:1px solid var(--color-border-secondary);border-radius:8px;display:flex;flex-direction:column;overflow:hidden;box-shadow:0 1px 3px rgba(0,0,0,0.05);">
          <div style="padding:16px;border-bottom:1px solid var(--color-border-tertiary);font-size:12px;font-weight:700;text-transform:uppercase;color:var(--color-text-primary);letter-spacing:0.5px;">👁️ Preview</div>
          <div id="restore-preview-content" class="restore-scrollbar" style="flex:1;overflow-y:auto;padding:16px;font-size:13px;color:var(--color-text-tertiary);text-align:left;">
            Select a resource to preview
          </div>
          <div style="padding:12px;border-top:1px solid var(--color-border-tertiary);display:flex;gap:10px;">
            <button id="restore-dry-run-btn" style="flex:1;padding:10px;background:var(--color-primary);color:white;border:none;border-radius:6px;font-size:13px;font-weight:600;cursor:pointer;transition:all 0.2s;" onmouseover="this.style.background='var(--color-primary)';this.style.opacity='0.9'" onmouseout="this.style.opacity='1'" disabled>Dry Run</button>
            <button id="restore-reset-btn" style="flex:1;padding:10px;background:var(--color-bg-tertiary);color:var(--color-text-primary);border:none;border-radius:6px;font-size:13px;font-weight:600;cursor:pointer;transition:all 0.2s;" onmouseover="this.style.background='var(--color-border-secondary)'" onmouseout="this.style.background='var(--color-bg-tertiary)'">Reset</button>
          </div>
        </div>
      </div>

      <!-- Info Footer -->
      <div style="padding:14px 16px;background:var(--color-bg-secondary);border-left:3px solid var(--color-primary);border-radius:6px;font-size:12px;">
        <div style="color:var(--color-text-secondary);font-weight:600;">📋 MONITOR MODE</div>
        <div style="color:var(--color-text-tertiary);margin-top:6px;">Viewing configurations from backups • Write permission required to perform restore</div>
      </div>
    </div>
  `
}

let restoreState = {
  selectedDate: null,
  selectedBackups: [], // Array of backups for selected date
  selectedService: null,
  selectedResourceType: null,
  selectedResource: null,
  allResources: [],
  allServices: [], // All services in the system
  allServiceNames: [], // Display names of all services
  backupsByDate: {}, // Map of date -> array of backups
  allAvailableDates: [],
  resourceTypeFilter: 'successful' // Filter for resource types: successful, notConfigured, errors
}

async function initializeRestoreExplorerBackup() {
  const dryRunBtn = document.getElementById('restore-dry-run-btn')
  const resetBtn = document.getElementById('restore-reset-btn')

  // Show "Loading services..." initially
  document.getElementById('restore-services-list').innerHTML = '<div style="padding:8px;color:var(--color-text-tertiary);font-size:12px;text-align:center;">Loading services...</div>'

  // Load all services and backups on initialization (wait for completion)
  await loadAllServicesForRestoreBackup()
  await loadAllDatesForRestoreBackup()

  // Show all available services by default
  displayAllAvailableServicesBackup()

  dryRunBtn.addEventListener('click', async () => {
    if (!restoreState.selectedResource) return

    dryRunBtn.innerHTML = 'Running...'
    dryRunBtn.disabled = true

    try {
      const resourceId = restoreState.selectedResource.identity || restoreState.selectedResource.id
      const response = await fetch(`${API_BASE}/api/backup/m365/restore/${restoreState.selectedBackup}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          resourceIds: [resourceId],
          resourceType: restoreState.selectedResourceType,
          dryRun: true
        })
      })

      const data = await response.json()
      if (data.success && data.dryRun) {
        showRestoreDryRunModalBackup(data.dryRun)
      } else {
        showToast(`Error: ${data.error || 'Dry run failed'}`, 'error')
      }
    } catch (error) {
      showToast(`Error: ${error.message}`, 'error')
    } finally {
      dryRunBtn.innerHTML = 'Dry Run'
      dryRunBtn.disabled = false
    }
  })

  resetBtn.addEventListener('click', () => {
    restoreState = { selectedBackup: restoreState.selectedBackup, selectedService: null, selectedResourceType: null, selectedResource: null, allResources: [] }
    document.getElementById('restore-types-list').innerHTML = '<div style="padding:8px;color:var(--color-text-tertiary);font-size:12px;">Select service</div>'
    document.getElementById('restore-resources-list').innerHTML = '<div style="padding:8px;color:var(--color-text-tertiary);font-size:12px;">Select resource type</div>'
    document.getElementById('restore-preview-content').innerHTML = 'Select a resource to preview'
    document.getElementById('restore-dry-run-btn').disabled = true
  })
}

async function loadAllServicesForRestoreBackup() {
  try {
    const response = await fetch(`${API_BASE}/api/backup/m365/services/list`)
    const data = await response.json()

    if (data.success && data.data) {
      // Extract service names, filter out notes and other metadata
      const services = data.data.filter(s => s.displayName && !s.key?.startsWith('_note_'))
      restoreState.allServiceNames = services.map(s => s.displayName).sort()
      restoreState.allServices = services
    }
  } catch (error) {
    console.error('Error loading services:', error)
    showToast('Error loading services', 'error')
  }
}

async function loadAllDatesForRestoreBackup() {
  try {
    const response = await fetch(`${API_BASE}/api/backup/m365/backups?limit=100`)
    const data = await response.json()

    const backupTabsContainer = document.getElementById('restore-backup-tabs')
    backupTabsContainer.innerHTML = ''

    if (data.success && data.data) {
      // Group backups by date
      const dateMap = {}
      data.data.forEach(backup => {
        const date = backup.backupId.split('-').slice(0, 3).join('-')
        if (!dateMap[date]) {
          dateMap[date] = []
        }
        dateMap[date].push(backup)
      })

      restoreState.backupsByDate = dateMap
      restoreState.allAvailableDates = Object.keys(dateMap).sort().reverse() // Most recent first

      // Update dates count
      document.getElementById('restore-dates-count').textContent = `(${restoreState.allAvailableDates.length} dates available)`

      // Create date tabs
      restoreState.allAvailableDates.forEach((date, index) => {
        const tab = document.createElement('button')
        tab.textContent = date
        tab.value = date
        tab.style.cssText = 'padding:10px 14px;font-size:12px;font-weight:500;border:none;background:transparent;color:var(--color-text-secondary);cursor:pointer;border-bottom:2px solid transparent;white-space:nowrap;transition:all 0.2s;'
        tab.addEventListener('mouseover', () => { if (tab.value !== restoreState.selectedDate) tab.style.color = 'var(--color-text-primary)' })
        tab.addEventListener('mouseout', () => { if (tab.value !== restoreState.selectedDate) tab.style.color = 'var(--color-text-secondary)' })
        tab.addEventListener('click', async () => {
          restoreState.selectedDate = tab.value
          document.getElementById('context-date').textContent = tab.value

          // Update all tabs styling
          document.querySelectorAll('#restore-backup-tabs button').forEach(b => {
            b.style.color = 'var(--color-text-secondary)'
            b.style.borderBottomColor = 'transparent'
          })
          tab.style.color = 'var(--color-primary)'
          tab.style.borderBottomColor = 'var(--color-primary)'

          await loadServicesForSelectedDateBackup()
        })
        backupTabsContainer.appendChild(tab)
      })

      // Select first date by default
      if (restoreState.allAvailableDates.length > 0) {
        const firstTab = backupTabsContainer.querySelector('button')
        firstTab.click()
      }
    }
  } catch (error) {
    console.error('Error loading backup dates:', error)
    showToast('Error loading backup dates', 'error')
  }
}

function displayAllAvailableServicesBackup() {
  // Use dynamically loaded services from API
  const allServices = restoreState.allServiceNames.length > 0 ? restoreState.allServiceNames : []

  if (allServices.length === 0) {
    document.getElementById('restore-services-list').innerHTML = '<div style="padding:8px;color:var(--color-text-tertiary);font-size:12px;">Loading services...</div>'
    return
  }

  const servicesHtml = allServices.map(service => `
    <div style="padding:8px;background:var(--color-bg-primary);border:1px solid var(--color-border-tertiary);border-radius:4px;cursor:pointer;font-size:12px;font-weight:500;transition:all 0.2s;opacity:0.6;" data-service="${service}">
      ${service}
    </div>
  `).join('')

  document.getElementById('restore-services-list').innerHTML = servicesHtml

  // Disable all services until date is selected
  document.querySelectorAll('[data-service]').forEach(el => {
    el.style.pointerEvents = 'none'
  })
}

async function loadServicesForSelectedDateBackup() {
  try {
    const date = restoreState.selectedDate
    const backupsForDate = restoreState.backupsByDate[date] || []

    if (backupsForDate.length === 0) {
      document.getElementById('restore-services-list').innerHTML = '<div style="padding:8px;color:var(--color-text-tertiary);font-size:12px;">No services for this date</div>'
      return
    }

    // Load resources from first backup to determine available services
    restoreState.selectedBackups = backupsForDate

    // Extract services from backups using proper mapping
    const servicesSet = new Set()

    // Create key-to-displayName mapping from allServices
    const keyToDisplayName = {}
    restoreState.allServices.forEach(s => {
      keyToDisplayName[s.key] = s.displayName
    })

    backupsForDate.forEach(backup => {
      // Skip backups without serviceName
      if (!backup.serviceName) {
        console.warn('⚠️ Backup has no serviceName:', backup)
        return
      }

      // Match backup serviceName to service key exactly
      const matchedService = restoreState.allServices.find(s =>
        s.key.toLowerCase() === backup.serviceName.toLowerCase()
      )

      if (matchedService) {
        servicesSet.add(matchedService.displayName)
      } else {
        // Service not found - log for debugging
        console.warn(`⚠️ Service not found in allServices: ${backup.serviceName}`)
        console.log('Available service keys:', restoreState.allServices.map(s => s.key))
      }
    })

    const availableServices = Array.from(servicesSet).sort()

    // Filter out any undefined values
    const validServices = availableServices.filter(s => s !== undefined && s !== null && s !== 'undefined')

    // Display ONLY available services (hide unavailable ones)
    const servicesHtml = validServices.map(service => `
      <div style="padding:10px;background:var(--color-bg-primary);border-left:3px solid var(--color-border-tertiary);border-radius:4px;cursor:pointer;font-size:12px;font-weight:400;transition:all 0.2s;text-align:left;color:var(--color-text-primary);" data-service="${service}" onmouseover="this.style.backgroundColor='var(--color-bg-secondary)';this.style.borderLeftColor='var(--color-primary)'" onmouseout="this.style.backgroundColor='var(--color-bg-primary)';this.style.borderLeftColor='var(--color-border-tertiary)'">
        ${service}
      </div>
    `).join('')

    document.getElementById('restore-services-list').innerHTML = servicesHtml || '<div style="padding:12px;color:var(--color-text-tertiary);font-size:13px;text-align:center;">No services available</div>'

    // Add event listeners to available services
    document.querySelectorAll('[data-service]').forEach(el => {
      el.addEventListener('click', () => {
        restoreState.selectedService = el.dataset.service
        loadRestoreResourcesForServiceAndDateBackup()

        // Update visual selection
        document.querySelectorAll('[data-service]').forEach(e => {
          e.style.background = 'var(--color-bg-primary)'
          e.style.borderLeftColor = 'var(--color-border-tertiary)'
          e.style.color = 'var(--color-text-primary)'
        })
        el.style.background = 'var(--color-bg-secondary)'
        el.style.borderLeftColor = 'var(--color-primary)'
        el.style.borderLeftWidth = '4px'
        el.style.color = 'var(--color-primary)'
        el.style.fontWeight = '700'

        // Update context header
        document.getElementById('restore-context-header').style.display = 'block'
        document.getElementById('context-service').textContent = el.dataset.service
      })
    })
  } catch (error) {
    console.error('Error loading services for date:', error)
    showToast('Error loading services', 'error')
  }
}

async function loadRestoreResourcesForServiceAndDateBackup() {
  try {
    // Load resources from the backup matching service and date
    const date = restoreState.selectedDate
    const service = restoreState.selectedService
    const backupsForDate = restoreState.backupsByDate[date] || []

    // Find backup for this service using same matching logic
    const backup = backupsForDate.find(b => {
      // Find the service object that matches this backup (exact key match)
      const matchedService = restoreState.allServices.find(s =>
        s.key.toLowerCase() === b.serviceName.toLowerCase()
      )
      return matchedService && matchedService.displayName === service
    })

    if (!backup) {
      showToast('No backup found for this service and date', 'error')
      return
    }

    const response = await fetch(`${API_BASE}/api/backup/m365/backup/${backup.backupId}/resources?limit=5000`)
    const data = await response.json()

    if (data.success && data.data.length > 0) {
      restoreState.allResources = data.data

      // Load resource types for the selected service
      loadRestoreResourceTypesForServiceBackup()
    }
  } catch (error) {
    console.error('Error loading backup resources:', error)
    showToast('Error loading backup resources', 'error')
  }
}

async function loadRestoreResourcesFromBackupBackup() {
  try {
    const response = await fetch(`${API_BASE}/api/backup/m365/backup/${restoreState.selectedBackup}/resources?limit=5000`)
    const data = await response.json()

    if (data.success && data.data.length > 0) {
      restoreState.allResources = data.data

      // Extract unique services from resources
      const servicesSet = new Set()
      data.data.forEach(r => {
        if (r.type?.startsWith('AAD')) {
          servicesSet.add('Security (Entra ID)')
        } else if (r.type?.startsWith('EXO')) {
          servicesSet.add('Exchange Online')
        } else if (r.type?.startsWith('SPO')) {
          servicesSet.add('SharePoint')
        } else if (r.type?.startsWith('Teams')) {
          servicesSet.add('Teams')
        }
      })

      restoreState.allServices = Array.from(servicesSet).sort()

      // Display services
      const servicesHtml = restoreState.allServices.map(service => `
        <div style="padding:8px;background:var(--color-bg-primary);border:1px solid var(--color-border-tertiary);border-radius:4px;cursor:pointer;font-size:12px;font-weight:500;transition:all 0.2s;" data-service="${service}">
          ${service}
        </div>
      `).join('')

      document.getElementById('restore-services-list').innerHTML = servicesHtml || '<div style="padding:8px;color:var(--color-text-tertiary);">No services</div>'

      document.querySelectorAll('[data-service]').forEach(el => {
        el.addEventListener('click', () => {
          restoreState.selectedService = el.dataset.service
          loadRestoreResourceTypesForServiceBackup()
          document.querySelectorAll('[data-service]').forEach(e => e.style.background = 'var(--color-bg-primary)')
          el.style.background = 'var(--color-primary)'
          el.style.color = 'white'
        })
      })
    }
  } catch (error) {
    console.error('Error loading backup resources:', error)
    showToast('Error loading backup resources', 'error')
  }
}

function loadRestoreResourceTypesForServiceBackup() {
  const serviceTypeMap = {
    'Security (Entra ID)': 'AAD',
    'Exchange Online': 'EXO',
    'SharePoint': 'SPO',
    'Teams': 'Teams'
  }

  const prefix = serviceTypeMap[restoreState.selectedService] || ''
  const filtered = restoreState.allResources.filter(r => r.type?.startsWith(prefix))

  // Analyze resource status by type
  const typeStats = {}
  filtered.forEach(r => {
    if (!typeStats[r.type]) {
      typeStats[r.type] = { successful: 0, notConfigured: 0, errors: 0, total: 0 }
    }
    typeStats[r.type].total += 1

    // Check if resource was successfully backed up
    if (r.configuration && Object.keys(r.configuration).length > 0) {
      typeStats[r.type].successful += 1
    } else if (r.error) {
      typeStats[r.type].errors += 1
    } else {
      typeStats[r.type].notConfigured += 1
    }
  })

  // Set default filter to successful
  if (!restoreState.resourceTypeFilter) {
    restoreState.resourceTypeFilter = 'successful'
  }

  // Count total types with any status
  const totalTypes = Object.keys(typeStats).length
  const successfulTypes = Object.values(typeStats).filter(s => s.successful > 0).length
  const notConfiguredTypes = Object.values(typeStats).filter(s => s.notConfigured > 0).length
  const errorTypes = Object.values(typeStats).filter(s => s.errors > 0).length
  const emptyTypes = totalTypes - successfulTypes - notConfiguredTypes - errorTypes
  const totalResources = Object.values(typeStats).reduce((sum, s) => sum + s.total, 0)

  // Create filter dropdown with counts
  const filterDropdownHtml = `
    <div style="margin-bottom:12px;">
      <div style="font-size:10px;color:var(--color-text-tertiary);margin-bottom:8px;line-height:1.5;">
        📊 Total: ${totalTypes} types | ${totalResources} resources<br>
        ✅ ${successfulTypes} successful | ⚠️ ${notConfiguredTypes} not configured | ❌ ${errorTypes} errors ${emptyTypes > 0 ? `| 🔍 ${emptyTypes} empty` : ''}
      </div>
      <select id="restore-types-filter" style="width:100%;padding:8px 12px;font-size:12px;font-weight:500;border:1px solid var(--color-border-secondary);border-radius:6px;background:var(--color-bg-primary);color:var(--color-text-primary);cursor:pointer;">
        <option value="successful">✅ Successful (${successfulTypes})</option>
        <option value="notConfigured">⚠️ Not Configured (${notConfiguredTypes})</option>
        <option value="errors">❌ Errors (${errorTypes})</option>
      </select>
      ${emptyTypes > 0 ? `<div style="font-size:10px;color:var(--color-text-tertiary);margin-top:8px;padding:8px;background:var(--color-bg-primary);border-radius:4px;border-left:2px solid var(--color-primary);">
        💡 <strong>${emptyTypes} types are empty</strong> (configured but no instances in your environment)
      </div>` : ''}
      <details style="margin-top:8px;font-size:10px;cursor:pointer;">
        <summary style="color:var(--color-primary);font-weight:600;padding:6px;background:var(--color-bg-primary);border-radius:4px;">
          📋 View Type Breakdown
        </summary>
        <div style="margin-top:8px;padding:8px;background:var(--color-bg-primary);border-radius:4px;font-size:9px;line-height:1.6;max-height:200px;overflow-y:auto;">
          ${successfulTypes > 0 ? `<div><strong style="color:#4CAF50;">✅ Successful (${successfulTypes}):</strong> ${Object.entries(typeStats).filter(([_, s]) => s.successful > 0).map(([t]) => t).join(', ')}</div>` : ''}
          ${notConfiguredTypes > 0 ? `<div style="margin-top:6px;"><strong style="color:#FFC107;">⚠️ Not Configured (${notConfiguredTypes}):</strong> ${Object.entries(typeStats).filter(([_, s]) => s.notConfigured > 0).map(([t]) => t).join(', ')}</div>` : ''}
          ${errorTypes > 0 ? `<div style="margin-top:6px;"><strong style="color:#f44336;">❌ Errors (${errorTypes}):</strong> ${Object.entries(typeStats).filter(([_, s]) => s.errors > 0).map(([t]) => t).join(', ')}</div>` : ''}
          ${emptyTypes > 0 ? `<div style="margin-top:6px;"><strong style="color:var(--color-text-tertiary);">🔍 Empty (${emptyTypes}):</strong> No resources to show</div>` : ''}
        </div>
      </details>
    </div>
  `

  // Filter resource types based on current filter
  const filteredTypes = Object.entries(typeStats)
    .filter(([type, stats]) => {
      if (restoreState.resourceTypeFilter === 'successful') return stats.successful > 0
      if (restoreState.resourceTypeFilter === 'notConfigured') return stats.notConfigured > 0
      if (restoreState.resourceTypeFilter === 'errors') return stats.errors > 0
      return true
    })
    .sort((a, b) => a[0].localeCompare(b[0]))

  const typesHtml = filteredTypes
    .map(([type, stats]) => {
      let statusIcon = '✅'
      let statusColor = '#4CAF50'
      if (stats.errors > 0) { statusIcon = '❌'; statusColor = '#f44336' }
      else if (stats.notConfigured > 0) { statusIcon = '⚠️'; statusColor = '#FFC107' }

      return `
        <div style="padding:10px;background:var(--color-bg-primary);border-left:3px solid var(--color-border-tertiary);border-radius:4px;cursor:pointer;font-size:12px;font-weight:400;transition:all 0.2s;color:var(--color-text-primary);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;" data-type="${type}" onmouseover="this.style.backgroundColor='var(--color-bg-secondary)';this.style.borderLeftColor='${statusColor}'" onmouseout="this.style.backgroundColor='var(--color-bg-primary)';this.style.borderLeftColor='var(--color-border-tertiary)'" title="${statusIcon} ${type}">
          <span style="font-weight:500;">${statusIcon} ${type}</span>
        </div>
      `
    }).join('')

  // Show empty state if no types match filter
  const emptyStateHtml = filteredTypes.length === 0 ? `
    <div style="padding:20px;color:var(--color-text-tertiary);font-size:12px;text-align:center;margin-top:10px;">
      <div style="margin-bottom:8px;">
        ${restoreState.resourceTypeFilter === 'notConfigured' ? '⚠️ No Not Configured Types' : restoreState.resourceTypeFilter === 'errors' ? '❌ No Error Types' : '✅ No Types Found'}
      </div>
      <div style="font-size:11px;line-height:1.5;">
        ${restoreState.resourceTypeFilter === 'notConfigured' ? 'All resource types have been successfully configured.' : restoreState.resourceTypeFilter === 'errors' ? 'All resource types backed up successfully with no errors.' : 'No resource types available for this service.'}
      </div>
      <div style="font-size:11px;color:var(--color-text-secondary);margin-top:8px;">
        Try selecting a different filter or service.
      </div>
    </div>
  ` : ''

  document.getElementById('restore-types-list').innerHTML = filterDropdownHtml + typesHtml + emptyStateHtml

  // Add filter dropdown listener
  const filterSelect = document.getElementById('restore-types-filter')
  if (filterSelect) {
    filterSelect.value = restoreState.resourceTypeFilter
    filterSelect.addEventListener('change', () => {
      // Reset selected resource type and resources when filter changes
      restoreState.selectedResourceType = null
      restoreState.selectedResource = null
      document.getElementById('restore-resources-list').innerHTML = '<div style="padding:10px;color:var(--color-text-tertiary);font-size:12px;text-align:center;">Select resource type</div>'
      document.getElementById('restore-preview-content').innerHTML = 'Select resource'
      document.getElementById('restore-dry-run-btn').disabled = true

      // Clear visual selection highlighting from resource types
      document.querySelectorAll('[data-type]').forEach(el => {
        el.style.background = 'var(--color-bg-primary)'
        el.style.borderLeftColor = 'var(--color-border-tertiary)'
        el.style.color = 'var(--color-text-primary)'
        el.style.fontWeight = '400'
      })

      restoreState.resourceTypeFilter = filterSelect.value
      loadRestoreResourceTypesForServiceBackup()
    })
  }

  document.querySelectorAll('[data-type]').forEach(el => {
    el.addEventListener('click', () => {
      restoreState.selectedResourceType = el.dataset.type
      loadRestoreResourcesBackup()

      // Update visual selection
      document.querySelectorAll('[data-type]').forEach(e => {
        e.style.background = 'var(--color-bg-primary)'
        e.style.borderLeftColor = 'var(--color-border-tertiary)'
        e.style.color = 'var(--color-text-primary)'
        e.style.fontWeight = '400'
      })
      el.style.background = 'var(--color-bg-secondary)'
      el.style.borderLeftColor = 'var(--color-primary)'
      el.style.borderLeftWidth = '4px'
      el.style.color = 'var(--color-primary)'
      el.style.fontWeight = '700'
    })
  })
}

function loadRestoreResourcesBackup() {
  const filtered = restoreState.allResources.filter(r => r.type === restoreState.selectedResourceType)
  document.getElementById('restore-search-container').style.display = filtered.length >= 10 ? 'block' : 'none'

  const resourcesHtml = filtered.map(r => `
    <div style="padding:8px;background:var(--color-bg-primary);border:1px solid var(--color-border-tertiary);border-radius:4px;cursor:pointer;font-size:12px;margin-bottom:4px;transition:all 0.2s;" data-resource-id="${r.identity || r.id}">
      <input type="radio" name="restore-resource" value="${r.identity || r.id}" style="margin-right:6px;">
      <label style="cursor:pointer;">${r.name}</label>
    </div>
  `).join('')

  document.getElementById('restore-resources-list').innerHTML = resourcesHtml || '<div style="padding:8px;color:var(--color-text-tertiary);">No resources</div>'

  document.querySelectorAll('input[name="restore-resource"]').forEach(radio => {
    radio.addEventListener('change', () => {
      restoreState.selectedResource = restoreState.allResources.find(r => (r.identity || r.id) === radio.value)
      displayRestorePreviewBackup()
      document.getElementById('restore-dry-run-btn').disabled = false
    })
  })
}

function displayRestorePreviewBackup() {
  if (!restoreState.selectedResource) return

  const jsonStr = JSON.stringify(restoreState.selectedResource, null, 2)
  const previewHtml = `<pre style="font-size:11px;white-space:pre-wrap;word-wrap:break-word;color:var(--color-text-secondary);line-height:1.4;margin:0;">${escapeHtml(jsonStr)}</pre>`

  document.getElementById('restore-preview-content').innerHTML = previewHtml
}

function escapeHtml(text) {
  const map = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;'
  }
  return text.replace(/[&<>"']/g, m => map[m])
}

function showRestoreDryRunModalBackup(dryRun) {
  const resourceList = dryRun.resources.map(r => `<div style="padding:8px;background:var(--color-bg-tertiary);border-radius:4px;font-size:11px;margin:4px 0;">
    <strong>${r.name}</strong><br>
    <span style="color:var(--color-text-tertiary);">${r.type} - ${r.action}</span>
  </div>`).join('')

  const message = `
    <div style="padding:15px;">
      <div style="margin-bottom:15px;padding:12px;background:var(--color-bg-tertiary);border-radius:6px;font-size:12px;">
        <strong>📋 MONITOR MODE</strong><br>
        Showing preview of resources to be restored
      </div>

      <div style="margin-bottom:15px;">
        <div style="font-size:12px;font-weight:600;margin-bottom:8px;">Impact:</div>
        ${resourceList}
      </div>

      <div style="font-size:11px;color:var(--color-text-tertiary);margin-bottom:15px;">
        <strong>⚠️ Permission Required:</strong> ${dryRun.requiresPermission}
      </div>

      <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;">
        <button onclick="this.closest('[role=dialog]').remove()" style="padding:8px;background:var(--color-bg-tertiary);border:none;border-radius:4px;cursor:pointer;font-size:12px;font-weight:600;">Cancel</button>
        <button onclick="performRestoreBackup('${restoreState.selectedBackup}','${restoreState.selectedResourceType}')" style="padding:8px;background:var(--color-primary);color:white;border:none;border-radius:4px;cursor:pointer;font-size:12px;font-weight:600;">Proceed</button>
      </div>
    </div>
  `

  const dialog = document.createElement('div')
  dialog.setAttribute('role', 'dialog')
  dialog.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.5);display:flex;align-items:center;justify-content:center;z-index:9999;'
  dialog.innerHTML = `<div style="background:var(--color-bg-primary);border-radius:8px;max-width:500px;width:90%;max-height:80vh;overflow-y:auto;box-shadow:0 10px 40px rgba(0,0,0,0.3);">${message}</div>`
  document.body.appendChild(dialog)
}

async function performRestoreBackup(backupId, resourceType) {
  const resourceId = restoreState.selectedResource.identity || restoreState.selectedResource.id

  try {
    const response = await fetch(`${API_BASE}/api/backup/m365/restore/${backupId}?confirm=true`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        resourceIds: [resourceId],
        resourceType,
        targetEnvironment: 'Production',
        confirm: true
      })
    })

    const data = await response.json()

    if (response.ok && data.success) {
      showToast(`✅ Restore Completed\n\nResource: ${restoreState.selectedResource.name}\nRestored: ${data.resourcesRestored} resource(s)`, 'success')
    } else if (response.status === 403) {
      showToast(`❌ Permission Denied\n\n${data.error || 'Write permissions required to restore'}`, 'error')
    } else {
      showToast(`Error: ${data.error || 'Restore failed'}`, 'error')
    }

    document.querySelector('[role=dialog]')?.remove()
  } catch (error) {
    showToast(`Error: ${error.message}`, 'error')
  }
}

