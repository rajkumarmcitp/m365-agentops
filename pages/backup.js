import { showToast } from '../components/toast.js'
import { customSkeleton } from '../lib/skeleton-custom.js'

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
      <input type="text" class="form-input search" placeholder="Search services..." id="services-search" style="${backupView === 'history' ? 'display:none' : ''}">
    </div>

    ${backupView === 'services' ? renderServicesView() : renderHistoryView()}
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
            <th style="width:15%">Resources</th>
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
                  <td data-label="Resources" class="monospace">${service.totalResources}</td>
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
  if (!backup) return

  console.log(`📋 Loading resources for backup ${backupId}...`)

  try {
    // Fetch resources from this backup
    const response = await fetch(`${API_BASE}/api/backup/m365/backup/${backupId}/resources`)
    const result = await response.json()
    const resources = result.data || []

    console.log(`✅ Loaded ${resources.length} resources`)

    // Create restore modal
    const modalId = `restore-modal-${Date.now()}`
    const modalHTML = `
      <div id="${modalId}" style="
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0,0,0,0.5);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 10000;
      ">
        <div style="
          background: var(--color-background-primary);
          border-radius: 8px;
          padding: 24px;
          max-width: 600px;
          max-height: 80vh;
          overflow-y: auto;
          box-shadow: 0 20px 25px rgba(0,0,0,0.15);
        ">
          <div style="margin-bottom: 20px">
            <h3 style="margin: 0 0 8px 0; font-size: 18px">Restore Backup</h3>
            <p style="margin: 0; font-size: 13px; color: var(--color-text-secondary)">
              Service: <strong>${backup.serviceName}</strong> |
              Created: ${new Date(backup.timestamp).toLocaleString()}
            </p>
          </div>

          <div style="margin-bottom: 20px">
            <div style="font-weight: 500; margin-bottom: 12px; font-size: 14px">
              Select resources to restore (${resources.length} available):
            </div>
            <div style="border: 1px solid var(--color-border); border-radius: 4px; max-height: 300px; overflow-y: auto">
              ${resources.length === 0 ? `
                <div style="padding: 16px; text-align: center; color: var(--color-text-secondary)">
                  No resources in this backup
                </div>
              ` : `
                <div style="padding: 0">
                  <label style="display: block; padding: 8px 12px; border-bottom: 1px solid var(--color-border); cursor: pointer">
                    <input type="checkbox" id="select-all-${modalId}" style="margin-right: 8px">
                    <strong>Select All</strong>
                  </label>
                  ${resources.map((r, idx) => `
                    <label style="display: block; padding: 8px 12px; border-bottom: 1px solid var(--color-border); cursor: pointer; font-size: 13px">
                      <input type="checkbox" class="resource-checkbox-${modalId}" data-resource-id="${r.id || idx}" style="margin-right: 8px">
                      ${r.name || r.type || `Resource ${idx + 1}`}
                      ${r.type ? `<span style="color: var(--color-text-secondary); margin-left: 8px">(${r.type})</span>` : ''}
                    </label>
                  `).join('')}
                </div>
              `}
            </div>
          </div>

          <div style="display: flex; gap: 12px; justify-content: flex-end">
            <button class="btn btn-secondary" onclick="document.getElementById('${modalId}').remove()">
              Cancel
            </button>
            <button class="btn btn-primary" id="restore-confirm-${modalId}">
              Restore Selected
            </button>
          </div>
        </div>
      </div>
    `

    // Add modal to page
    const modalDiv = document.createElement('div')
    modalDiv.innerHTML = modalHTML
    document.body.appendChild(modalDiv)

    // Handle Select All
    const selectAllCheckbox = document.getElementById(`select-all-${modalId}`)
    const resourceCheckboxes = document.querySelectorAll(`.resource-checkbox-${modalId}`)

    if (selectAllCheckbox) {
      selectAllCheckbox.addEventListener('change', (e) => {
        resourceCheckboxes.forEach(cb => cb.checked = e.target.checked)
      })
    }

    // Handle Restore button
    const restoreBtn = document.getElementById(`restore-confirm-${modalId}`)
    restoreBtn.addEventListener('click', async () => {
      const selectedResources = Array.from(resourceCheckboxes)
        .filter(cb => cb.checked)
        .map(cb => cb.dataset.resourceId)

      if (selectedResources.length === 0) {
        showToast('❌ Please select at least one resource to restore', 'error')
        return
      }

      document.getElementById(modalId).remove()
      await restoreBackup(el, backupId, selectedResources)
    })

  } catch (error) {
    console.error('Error loading resources:', error)
    showToast(`❌ Error loading resources: ${error.message}`, 'error')
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
      showToast(`✅ Restore initiated for ${selectedResourceIds.length} resources`, 'success')
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
