/**
 * Selective Restore Component
 * Modal for selecting specific resources to restore from a backup
 */

import { showToast } from './toast.js'
import { callAPI } from '../lib/api-client.js'

const isDev = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
const API_BASE = import.meta.env.VITE_API_URL || (isDev
  ? 'http://localhost:3001'
  : 'https://m365ops-api-gtbgezb9c7bgata7.centralus-01.azurewebsites.net')

export function renderSelectiveRestoreModal() {
  return `
    <div id="selective-restore-modal" style="
      display:none;
      position:fixed;
      top:0;
      left:0;
      right:0;
      bottom:0;
      background:rgba(0,0,0,0.5);
      z-index:1000;
      justify-content:center;
      align-items:center;
      animation:fadeIn 200ms ease-in
    ">
      <div class="card" style="
        width:90%;
        max-width:900px;
        max-height:85vh;
        overflow-y:auto;
        background:var(--color-background-primary);
        box-shadow:0 10px 40px rgba(0,0,0,0.2)
      ">
        <!-- Header -->
        <div style="
          display:flex;
          justify-content:space-between;
          align-items:center;
          padding:20px;
          border-bottom:1px solid var(--color-border);
          position:sticky;
          top:0;
          background:var(--color-background-primary)
        ">
          <div>
            <h3 style="margin:0 0 4px 0;display:flex;align-items:center;gap:8px">
              <i class="ti ti-refresh"></i> Selective Restore
            </h3>
            <p style="margin:0;font-size:12px;color:var(--color-text-secondary)">
              Choose specific resources to restore from this backup
            </p>
          </div>
          <button id="restore-modal-close" style="
            background:none;
            border:none;
            font-size:24px;
            cursor:pointer;
            color:var(--color-text-secondary);
            padding:0;
            width:32px;
            height:32px;
            display:flex;
            align-items:center;
            justify-content:center
          ">×</button>
        </div>

        <!-- Content -->
        <div style="padding:20px">
          <!-- Backup Info -->
          <div id="restore-backup-info" style="
            background:var(--color-background-secondary);
            padding:12px;
            border-radius:6px;
            margin-bottom:20px;
            font-size:13px
          "></div>

          <!-- Filter & Search -->
          <div style="margin-bottom:20px;display:flex;gap:12px;flex-wrap:wrap;align-items:center">
            <input type="text" id="restore-search" placeholder="Search resources..." style="
              flex:1;
              min-width:200px;
              padding:8px 12px;
              border:1px solid var(--color-border);
              border-radius:6px;
              font-size:13px;
              background:var(--color-background-secondary)
            ">
            <select id="restore-type-filter" style="
              padding:8px 12px;
              border:1px solid var(--color-border);
              border-radius:6px;
              font-size:13px;
              background:var(--color-background-secondary);
              cursor:pointer
            ">
              <option value="">All Types</option>
            </select>
            <button id="restore-select-all" style="
              padding:8px 16px;
              background:#0078d4;
              color:white;
              border:none;
              border-radius:6px;
              cursor:pointer;
              font-weight:600;
              font-size:13px
            ">Select All</button>
            <button id="restore-deselect-all" style="
              padding:8px 16px;
              background:var(--color-border);
              color:var(--color-text);
              border:none;
              border-radius:6px;
              cursor:pointer;
              font-weight:600;
              font-size:13px
            ">Deselect All</button>
          </div>

          <!-- Resources List -->
          <div style="
            border:1px solid var(--color-border);
            border-radius:6px;
            max-height:400px;
            overflow-y:auto;
            margin-bottom:20px
          ">
            <div id="restore-resources-list" style="padding:12px">
              <div style="text-align:center;color:var(--color-text-secondary);padding:20px">
                <i class="ti ti-hourglass" style="font-size:24px;display:block;margin-bottom:8px"></i>
                Loading resources...
              </div>
            </div>
          </div>

          <!-- Selection Summary -->
          <div style="
            background:var(--color-background-secondary);
            padding:12px;
            border-radius:6px;
            margin-bottom:20px;
            font-size:13px;
            display:flex;
            justify-content:space-between;
            align-items:center
          ">
            <span>
              <strong id="restore-selected-count">0</strong> of <strong id="restore-total-count">0</strong> resources selected
            </span>
            <span style="color:var(--color-text-tertiary)">
              <span id="restore-selected-types"></span>
            </span>
          </div>

          <!-- Environment Selection -->
          <div style="margin-bottom:20px;padding:12px;background:var(--color-background-secondary);border-radius:6px">
            <label style="display:block;margin-bottom:8px;font-weight:600;font-size:13px">
              Target Environment
            </label>
            <select id="restore-environment" style="
              width:100%;
              padding:8px 12px;
              border:1px solid var(--color-border);
              border-radius:6px;
              font-size:13px;
              background:var(--color-background-primary);
              cursor:pointer
            ">
              <option value="production">Production</option>
              <option value="staging">Staging</option>
              <option value="development">Development</option>
            </select>
            <p style="margin:8px 0 0 0;font-size:11px;color:var(--color-text-tertiary)">
              ⚠️ Resources will be restored to the selected environment
            </p>
          </div>

          <!-- Action Buttons -->
          <div style="
            display:flex;
            gap:12px;
            justify-content:flex-end;
            padding-top:12px;
            border-top:1px solid var(--color-border)
          ">
            <button id="restore-modal-cancel" style="
              padding:10px 20px;
              background:var(--color-background-secondary);
              border:1px solid var(--color-border);
              border-radius:6px;
              cursor:pointer;
              font-weight:600;
              font-size:13px
            ">Cancel</button>
            <button id="restore-start-btn" style="
              padding:10px 20px;
              background:#16a34a;
              color:white;
              border:none;
              border-radius:6px;
              cursor:pointer;
              font-weight:600;
              font-size:13px
            ">Start Restore</button>
          </div>
        </div>
      </div>

      <style>
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
      </style>
    </div>
  `
}

export async function setupSelectiveRestoreModal(backupId, backupData) {
  const modal = document.getElementById('selective-restore-modal')
  if (!modal) return

  let selectedResources = new Set()
  let allResources = []
  let resourcesByType = new Map()

  try {
    // Fetch backup resources
    const response = await fetch(`${API_BASE}/api/backup/m365/backup/${backupId}/resources`)
    const result = await response.json()

    if (!result.success || !result.data) {
      showToast('Failed to load backup resources', 'error')
      return
    }

    allResources = result.data || []

    // Organize resources by type
    allResources.forEach(resource => {
      const type = resource.type || 'Unknown'
      if (!resourcesByType.has(type)) {
        resourcesByType.set(type, [])
      }
      resourcesByType.get(type).push(resource)
    })

    // Populate type filter
    const typeFilter = document.getElementById('restore-type-filter')
    if (typeFilter) {
      resourcesByType.forEach((_, type) => {
        const option = document.createElement('option')
        option.value = type
        option.textContent = type
        typeFilter.appendChild(option)
      })
    }

    // Show backup info
    const infoEl = document.getElementById('restore-backup-info')
    if (infoEl && backupData) {
      const backupDate = new Date(backupData.timestamp).toLocaleString()
      infoEl.innerHTML = `
        <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:16px">
          <div>
            <div style="font-weight:600;color:var(--color-text-primary)">Service</div>
            <div style="color:var(--color-text-secondary)">${backupData.serviceName || 'Unknown'}</div>
          </div>
          <div>
            <div style="font-weight:600;color:var(--color-text-primary)">Backup Date</div>
            <div style="color:var(--color-text-secondary)">${backupDate}</div>
          </div>
          <div>
            <div style="font-weight:600;color:var(--color-text-primary)">Total Resources</div>
            <div style="color:var(--color-text-secondary)">${allResources.length}</div>
          </div>
        </div>
      `
    }

    // Render resources
    renderResourcesList(allResources, selectedResources, resourcesByType)

    // Setup event listeners
    setupRestoreEventListeners(modal, backupId, selectedResources, allResources, resourcesByType)

  } catch (error) {
    console.error('Error loading backup resources:', error)
    showToast('Error loading backup resources: ' + error.message, 'error')
  }
}

function renderResourcesList(resources, selectedSet, resourcesByType) {
  const container = document.getElementById('restore-resources-list')
  if (!container) return

  const html = resources.map((resource, idx) => {
    const resourceId = resource.identity || resource.id || resource.name
    const isSelected = selectedSet.has(resourceId)

    return `
      <div class="restore-resource-item" style="
        display:flex;
        align-items:center;
        gap:12px;
        padding:12px;
        border-bottom:1px solid var(--color-border);
        transition:background 0.2s
      " data-resource-id="${resourceId}" data-resource-type="${resource.type}">
        <input type="checkbox" class="restore-checkbox" ${isSelected ? 'checked' : ''} style="
          width:18px;
          height:18px;
          cursor:pointer;
          flex-shrink:0
        ">
        <div style="flex:1;min-width:0">
          <div style="
            font-weight:600;
            font-size:13px;
            color:var(--color-text-primary);
            word-break:break-word
          ">${resource.name || resource.id || 'Unknown'}</div>
          <div style="
            font-size:11px;
            color:var(--color-text-tertiary);
            margin-top:2px
          ">
            <span style="background:var(--color-background-secondary);padding:2px 6px;border-radius:3px;display:inline-block">
              ${resource.type || 'Unknown'}
            </span>
          </div>
        </div>
        <div style="
          text-align:right;
          font-size:11px;
          color:var(--color-text-tertiary);
          flex-shrink:0
        ">
          ${resource.properties ? Object.keys(resource.properties).length + ' props' : '—'}
        </div>
      </div>
    `
  }).join('')

  container.innerHTML = html || '<div style="text-align:center;padding:20px;color:var(--color-text-secondary)">No resources found</div>'

  // Add checkbox event listeners
  container.querySelectorAll('.restore-checkbox').forEach(checkbox => {
    checkbox.addEventListener('change', (e) => {
      const item = e.target.closest('.restore-resource-item')
      const resourceId = item.dataset.resourceId

      if (e.target.checked) {
        selectedSet.add(resourceId)
        item.style.background = 'var(--color-background-secondary)'
      } else {
        selectedSet.delete(resourceId)
        item.style.background = 'transparent'
      }

      updateRestoreSummary(selectedSet)
    })
  })

  updateRestoreSummary(selectedSet)
}

function updateRestoreSummary(selectedSet) {
  const selectedCount = document.getElementById('restore-selected-count')
  const totalCount = document.getElementById('restore-total-count')
  const selectedTypes = document.getElementById('restore-selected-types')

  if (selectedCount) selectedCount.textContent = selectedSet.size
  if (totalCount) {
    const total = document.querySelectorAll('.restore-checkbox').length
    totalCount.textContent = total
  }

  if (selectedTypes && selectedSet.size > 0) {
    const typeSet = new Set()
    document.querySelectorAll('.restore-checkbox:checked').forEach(checkbox => {
      const item = checkbox.closest('.restore-resource-item')
      if (item) typeSet.add(item.dataset.resourceType)
    })
    selectedTypes.textContent = Array.from(typeSet).join(', ')
  } else if (selectedTypes) {
    selectedTypes.textContent = ''
  }
}

function setupRestoreEventListeners(modal, backupId, selectedResources, allResources, resourcesByType) {
  // Close button
  const closeBtn = document.getElementById('restore-modal-close')
  if (closeBtn) {
    closeBtn.addEventListener('click', () => {
      modal.style.display = 'none'
    })
  }

  // Cancel button
  const cancelBtn = document.getElementById('restore-modal-cancel')
  if (cancelBtn) {
    cancelBtn.addEventListener('click', () => {
      modal.style.display = 'none'
    })
  }

  // Select All
  const selectAllBtn = document.getElementById('restore-select-all')
  if (selectAllBtn) {
    selectAllBtn.addEventListener('click', () => {
      document.querySelectorAll('.restore-checkbox').forEach(checkbox => {
        checkbox.checked = true
        const item = checkbox.closest('.restore-resource-item')
        if (item) {
          selectedResources.add(item.dataset.resourceId)
          item.style.background = 'var(--color-background-secondary)'
        }
      })
      updateRestoreSummary(selectedResources)
    })
  }

  // Deselect All
  const deselectAllBtn = document.getElementById('restore-deselect-all')
  if (deselectAllBtn) {
    deselectAllBtn.addEventListener('click', () => {
      document.querySelectorAll('.restore-checkbox').forEach(checkbox => {
        checkbox.checked = false
        const item = checkbox.closest('.restore-resource-item')
        if (item) {
          selectedResources.delete(item.dataset.resourceId)
          item.style.background = 'transparent'
        }
      })
      updateRestoreSummary(selectedResources)
    })
  }

  // Search filter
  const searchInput = document.getElementById('restore-search')
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      const query = e.target.value.toLowerCase()
      document.querySelectorAll('.restore-resource-item').forEach(item => {
        const text = item.textContent.toLowerCase()
        item.style.display = text.includes(query) ? '' : 'none'
      })
    })
  }

  // Type filter
  const typeFilter = document.getElementById('restore-type-filter')
  if (typeFilter) {
    typeFilter.addEventListener('change', (e) => {
      const selectedType = e.target.value
      document.querySelectorAll('.restore-resource-item').forEach(item => {
        if (!selectedType || item.dataset.resourceType === selectedType) {
          item.style.display = ''
        } else {
          item.style.display = 'none'
        }
      })
    })
  }

  // Start Restore
  const startBtn = document.getElementById('restore-start-btn')
  if (startBtn) {
    startBtn.addEventListener('click', async () => {
      if (selectedResources.size === 0) {
        showToast('Please select at least one resource to restore', 'warning')
        return
      }

      const environment = document.getElementById('restore-environment')?.value || 'production'
      await performRestore(backupId, Array.from(selectedResources), environment, modal)
    })
  }

  // Close on background click
  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      modal.style.display = 'none'
    }
  })
}

async function performRestore(backupId, resourceIds, targetEnvironment, modal) {
  try {
    const startBtn = document.getElementById('restore-start-btn')
    if (startBtn) {
      startBtn.disabled = true
      startBtn.innerHTML = '<i class="ti ti-hourglass" style="animation:spin 1s linear infinite;margin-right:6px"></i>Starting restore...'
    }

    const response = await fetch(`${API_BASE}/api/backup/m365/restore/${backupId}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        resourceIds,
        targetEnvironment
      })
    })

    const result = await response.json()

    if (!response.ok || !result.success) {
      throw new Error(result.error || 'Restore failed')
    }

    showToast(`Restore started! (ID: ${result.restoreId})`, 'success')
    modal.style.display = 'none'

    // Optionally track restore status
    if (result.restoreId) {
      trackRestoreStatus(result.restoreId)
    }

  } catch (error) {
    console.error('Error starting restore:', error)
    showToast('Failed to start restore: ' + error.message, 'error')
  } finally {
    const startBtn = document.getElementById('restore-start-btn')
    if (startBtn) {
      startBtn.disabled = false
      startBtn.innerHTML = 'Start Restore'
    }
  }
}

function trackRestoreStatus(restoreId) {
  const checkStatus = async () => {
    try {
      const response = await fetch(`${API_BASE}/api/backup/m365/restore/${restoreId}/status`)
      const result = await response.json()

      if (result.success && result.data) {
        const status = result.data
        console.log(`Restore ${restoreId}: ${status.status}`)
        console.log(`  Success: ${status.successCount}, Failed: ${status.failureCount}`)

        if (status.status === 'Completed' || status.status === 'Failed') {
          showToast(`Restore ${status.status}: ${status.successCount} resources restored`,
            status.status === 'Completed' ? 'success' : 'error')
        } else {
          // Check again in 2 seconds
          setTimeout(checkStatus, 2000)
        }
      }
    } catch (error) {
      console.error('Error checking restore status:', error)
    }
  }

  // Start status polling
  setTimeout(checkStatus, 1000)
}
