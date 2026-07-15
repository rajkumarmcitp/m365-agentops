/**
 * Backup Explorer Component
 * File explorer-style navigation for backup resources
 */

export function renderBackupExplorer(backupHistory) {
  const organizedByService = organizeBackupsByService(backupHistory)
  const allDates = getAllBackupDates(backupHistory)

  return `
    <div class="backup-explorer-container" style="display:grid;grid-template-columns:380px 1fr;gap:16px;margin-top:16px;min-height:600px">
      <!-- Left Panel: Service Tree -->
      <div class="explorer-tree-panel" style="border:1px solid var(--color-border);border-radius:8px;overflow:hidden;display:flex;flex-direction:column;background:var(--color-background-secondary)">
        <!-- Date Filter Header -->
        <div style="padding:12px;border-bottom:1px solid var(--color-border)">
          <div style="font-weight:500;font-size:12px;margin-bottom:8px;color:var(--color-text-secondary)">
            <i class="ti ti-calendar"></i> Backup Date
          </div>
          <select id="backup-date-filter" style="
            width:100%;
            padding:6px 8px;
            border:1px solid var(--color-border);
            border-radius:4px;
            font-size:11px;
            background:var(--color-background-primary);
            color:var(--color-text);
            cursor:pointer
          ">
            <option value="">Latest Backups</option>
            ${allDates.map(date => `<option value="${date.value}">${date.label}</option>`).join('')}
          </select>
        </div>

        <!-- Services & Resources Header -->
        <div style="padding:12px;border-bottom:1px solid var(--color-border);font-weight:500;font-size:13px">
          <i class="ti ti-folder-open"></i> Services & Resources
        </div>

        <!-- Services Tree -->
        <div id="backup-tree" style="flex:1;overflow-y:auto;font-size:12px">
          ${renderServiceTree(organizedByService)}
        </div>
      </div>

      <!-- Right Panel: Details & Actions -->
      <div class="explorer-details-panel" style="border:1px solid var(--color-border);border-radius:8px;overflow:hidden;display:flex;flex-direction:column;background:var(--color-background-secondary)">
        <div id="details-container" style="flex:1;overflow-y:auto;padding:16px">
          <div style="text-align:center;color:var(--color-text-secondary);padding:40px">
            <i class="ti ti-folder-open" style="font-size:32px;display:block;margin-bottom:12px;opacity:0.5"></i>
            Select a service or resource to view details
          </div>
        </div>
      </div>
    </div>
  `
}

function organizeBackupsByService(backupHistory) {
  const organized = {}

  backupHistory.forEach(backup => {
    if (!organized[backup.serviceName]) {
      organized[backup.serviceName] = {
        service: backup.serviceName,
        backups: [],
        resources: {}
      }
    }
    organized[backup.serviceName].backups.push(backup)
  })

  return organized
}

function getAllBackupDates(backupHistory) {
  const dateMap = new Map()

  backupHistory.forEach(backup => {
    const date = new Date(backup.timestamp || backup.BackupDate)
    const dateStr = date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
    const dateValue = date.toISOString().split('T')[0]

    if (!dateMap.has(dateValue)) {
      dateMap.set(dateValue, { label: dateStr, value: dateValue })
    }
  })

  // Sort by date, newest first
  return Array.from(dateMap.values()).sort((a, b) => new Date(b.value) - new Date(a.value))
}

function renderServiceTree(organized) {
  const services = Object.keys(organized).sort()

  return `
    <div style="padding:0">
      ${services.map((serviceName, idx) => {
        const data = organized[serviceName]
        const latestBackup = data.backups[0]
        const resourceCount = latestBackup?.resourceCount || 0

        return renderServiceItem(serviceName, data, latestBackup, resourceCount)
      }).join('')}
    </div>

    <style>
      @keyframes spin {
        from { transform: rotate(0deg) }
        to { transform: rotate(360deg) }
      }
    </style>
  `
}

function renderServiceItem(serviceName, data, latestBackup, resourceCount) {
  return `
          <div class="tree-item" data-service="${serviceName}">
            <div class="tree-item-header" style="
              padding:12px 12px;
              cursor:pointer;
              display:flex;
              align-items:center;
              gap:10px;
              user-select:none;
              transition:all 0.2s;
              border-left:3px solid transparent;
              font-weight:600;
              font-size:13px;
              background:var(--color-background-primary);
              border-bottom:1px solid var(--color-border)
            " onmouseover="this.style.background='var(--color-background-secondary)'" onmouseout="this.style.background='var(--color-background-primary)'">
              <i class="ti ti-chevron-right toggle-icon" style="font-size:14px;transition:transform 0.3s ease;transform:rotate(0deg);width:16px;text-align:center;color:var(--color-text-secondary)"></i>
              <i class="ti ti-database" style="font-size:16px;color:var(--color-primary)"></i>
              <span style="flex:1">${serviceName}</span>
              <span style="
                background:#4a5568;
                color:#ffffff;
                padding:4px 10px;
                border-radius:4px;
                font-size:12px;
                font-weight:700;
                min-width:28px;
                text-align:center;
                display:inline-block
              ">${resourceCount}</span>
            </div>

            <div class="tree-item-content" style="display:none">
              ${latestBackup ? `
                <div class="tree-item" data-backup="${latestBackup.backupId}">
                  <div class="tree-item-header" style="
                    padding:10px 12px 10px 30px;
                    cursor:pointer;
                    display:flex;
                    align-items:center;
                    gap:10px;
                    font-size:12px;
                    color:var(--color-text-secondary);
                    transition:all 0.2s;
                    background:var(--color-background-secondary);
                    border-bottom:1px solid var(--color-border)
                  " onmouseover="this.style.background='var(--color-background-primary)'" onmouseout="this.style.background='var(--color-background-secondary)'">
                    <i class="ti ti-chevron-right toggle-icon-backup" style="font-size:12px;transition:transform 0.3s ease;transform:rotate(0deg);width:14px;text-align:center"></i>
                    <i class="ti ti-calendar" style="font-size:14px"></i>
                    <span>${new Date(latestBackup.timestamp).toLocaleString()}</span>
                  </div>

                  <div class="tree-backup-content" style="display:none;margin-left:12px">
                    <div id="resource-list-${latestBackup.backupId}" style="padding:8px;text-align:center;color:var(--color-text-secondary);font-size:11px">
                      <i class="ti ti-loader-2" style="animation:spin 1s linear infinite"></i> Loading resources...
                    </div>
                  </div>
                </div>
              ` : '<div style="padding:8px;font-size:11px;color:var(--color-text-secondary)">No backups</div>'}
            </div>
          </div>
        `
}

export function setupBackupExplorerEvents(el, API_BASE, showToast) {
  // Setup date filter
  const dateFilter = el.querySelector('#backup-date-filter')
  if (dateFilter) {
    dateFilter.addEventListener('change', () => {
      const selectedDate = dateFilter.value
      const serviceItems = el.querySelectorAll('.tree-item[data-service]')

      serviceItems.forEach(item => {
        const backupElement = item.querySelector('[data-backup]')
        const backupDate = backupElement?.dataset.backup

        if (selectedDate) {
          // Filter by date
          const backupDateOnly = backupDate?.split('T')[0]
          item.style.display = backupDateOnly === selectedDate ? 'block' : 'none'
        } else {
          // Show all
          item.style.display = 'block'
        }
      })
    })
  }

  // First, load type counts for all services
  loadServiceTypeCounts(el, API_BASE)

  // Setup all tree item headers with proper expand/collapse
  const treeHeaders = el.querySelectorAll('.tree-item-header')

  treeHeaders.forEach(header => {
    header.addEventListener('click', async (e) => {
      e.stopPropagation()
      e.preventDefault()

      const treeItem = header.closest('.tree-item')
      if (!treeItem) return

      // Find the content to toggle (could be .tree-item-content or .tree-backup-content)
      const treeContent = treeItem.querySelector('.tree-item-content')
      const backupContent = treeItem.querySelector('.tree-backup-content')
      const content = treeContent || backupContent

      // Find toggle icon (could be .toggle-icon or .toggle-icon-backup)
      const toggleIcon = header.querySelector('.toggle-icon') || header.querySelector('.toggle-icon-backup')

      if (content) {
        const isCurrentlyOpen = content.style.display !== 'none' && content.style.display !== ''

        // Toggle display
        content.style.display = isCurrentlyOpen ? 'none' : 'block'

        // Rotate icon
        if (toggleIcon) {
          toggleIcon.style.transform = isCurrentlyOpen ? 'rotate(0deg)' : 'rotate(90deg)'
        }

        // If this is a backup and content is now showing, load resources
        const backup = treeItem.closest('[data-backup]')
        if (backup && !isCurrentlyOpen) {
          const backupId = backup.dataset.backup
          const resourceList = backup.querySelector(`#resource-list-${backupId}`)

          if (resourceList && resourceList.textContent.includes('Loading')) {
            try {
              console.log(`Loading resources for backup: ${backupId}`)
              const response = await fetch(`${API_BASE}/api/backup/m365/backup/${backupId}/resources`)
              const result = await response.json()

              if (result.success && result.data?.length > 0) {
                const grouped = groupResourcesByType(result.data)
                resourceList.innerHTML = renderResourceTree(grouped, backupId)
                setupResourceSelection(el, grouped, backupId, API_BASE, showToast)
              } else {
                resourceList.innerHTML = '<div style="padding:8px;font-size:11px;color:var(--color-text-secondary)">No resources in this backup</div>'
              }
            } catch (error) {
              console.error('Error loading resources:', error)
              resourceList.innerHTML = `<div style="padding:8px;font-size:11px;color:var(--color-danger)">Error loading resources: ${error.message}</div>`
            }
          }
        }
      }
    })
  })
}

async function loadServiceTypeCounts(el, API_BASE) {
  // Load type counts for each service's latest backup
  const serviceItems = el.querySelectorAll('.tree-item[data-service]')

  for (const serviceItem of serviceItems) {
    const serviceName = serviceItem.dataset.service
    const backupElement = serviceItem.querySelector('[data-backup]')
    const backupId = backupElement?.dataset.backup

    if (!backupId) continue

    try {
      const response = await fetch(`${API_BASE}/api/backup/m365/backup/${backupId}/resources`)
      const result = await response.json()

      if (result.success && result.data?.length > 0) {
        // Count unique types
        const types = new Set(result.data.map(r => r.type))
        const typeCount = types.size

        // Update the badge with type count
        const badge = serviceItem.querySelector('.tree-item-header span:last-child')
        if (badge) {
          badge.textContent = typeCount
          badge.title = `${typeCount} configuration types`
        }
      }
    } catch (error) {
      console.error(`Error loading type count for ${serviceName}:`, error)
    }
  }
}

function groupResourcesByType(resources) {
  const grouped = {}

  resources.forEach(resource => {
    const type = resource.type || 'Unknown'
    if (!grouped[type]) {
      grouped[type] = []
    }
    grouped[type].push(resource)
  })

  return grouped
}

function renderResourceTree(grouped, backupId) {
  const types = Object.keys(grouped).sort()

  return `
    <div style="padding:0">
      ${types.map(type => {
        const resources = grouped[type]
        return `
          <div class="resource-type-group" data-type="${type}">
            <div class="resource-type-header" style="
              padding:10px 12px 10px 42px;
              cursor:pointer;
              display:flex;
              align-items:center;
              gap:10px;
              font-size:12px;
              font-weight:500;
              transition:all 0.2s;
              background:var(--color-background-secondary);
              border-bottom:1px solid var(--color-border);
              color:var(--color-text)
            " onmouseover="this.style.background='var(--color-background-primary)'" onmouseout="this.style.background='var(--color-background-secondary)'">
              <i class="ti ti-chevron-right resource-toggle" style="font-size:12px;transform:rotate(0deg);transition:transform 0.3s ease;width:14px;text-align:center;color:var(--color-text-secondary)"></i>
              <i class="ti ti-stack" style="font-size:14px;color:var(--color-info)"></i>
              <span style="flex:1">${type}</span>
              <span style="background:#5a67d8;color:#ffffff;padding:4px 9px;border-radius:3px;font-size:11px;font-weight:600;min-width:26px;text-align:center;display:inline-block">${resources.length}</span>
            </div>

            <div class="resource-type-content" style="display:none">
              ${resources.map((r, idx) => `
                <div class="resource-item" data-resource-id="${r.identity || r.name}" style="">
                  <div style="
                    padding:8px 12px 8px 56px;
                    cursor:pointer;
                    display:flex;
                    align-items:center;
                    gap:10px;
                    font-size:11px;
                    transition:all 0.2s;
                    background:${idx % 2 === 0 ? 'transparent' : 'var(--color-background-primary)'};
                    border-bottom:1px solid var(--color-border)
                  " onmouseover="this.style.background='var(--color-background-primary);this.style.borderLeftColor='var(--color-primary)'" onmouseout="this.style.background='${idx % 2 === 0 ? 'transparent' : 'var(--color-background-primary)'}';this.style.borderLeftColor='transparent'">
                    <input type="checkbox" class="resource-checkbox" data-resource-id="${r.identity || r.name}" data-name="${r.name}" style="cursor:pointer;width:16px;height:16px">
                    <i class="ti ti-file-document" style="font-size:13px;color:var(--color-text-secondary)"></i>
                    <span style="flex:1;color:var(--color-text)">${r.name || r.type}</span>
                  </div>
                </div>
              `).join('')}
            </div>
          </div>
        `
      }).join('')}
    </div>
  `
}

function setupResourceSelection(el, grouped, backupId, API_BASE, showToast) {
  // Toggle resource type groups
  el.querySelectorAll('.resource-type-header').forEach(header => {
    header.addEventListener('click', (e) => {
      const group = header.closest('.resource-type-group')
      const content = group.querySelector('.resource-type-content')
      const toggle = header.querySelector('.resource-toggle')

      const isOpen = content.style.display !== 'none'
      content.style.display = isOpen ? 'none' : 'block'
      toggle.style.transform = isOpen ? 'rotate(0deg)' : 'rotate(90deg)'

      e.stopPropagation()
    })
  })

  // Handle resource selection
  el.querySelectorAll('.resource-checkbox').forEach(checkbox => {
    checkbox.addEventListener('change', () => {
      // Update parent details panel when resource is selected
      if (checkbox.checked) {
        // Find the actual resource object from the grouped data
        let selectedResource = null
        for (const [type, resources] of Object.entries(grouped)) {
          const found = resources.find(r => (r.identity || r.name) === checkbox.dataset.resourceId)
          if (found) {
            selectedResource = found
            break
          }
        }

        if (selectedResource) {
          showResourceDetails(el, selectedResource, backupId, API_BASE, showToast)
        }
      }
    })
  })
}

function showResourceDetails(el, resource, backupId, API_BASE, showToast) {
  const detailsContainer = el.querySelector('#details-container')
  const resourceId = resource.identity || resource.name
  const resourceName = resource.name || resource.type
  const resourceType = resource.type || 'Unknown'

  // Extract config data - handle both flat (Teams) and nested (AAD) structures
  let config = resource.configuration || resource

  // For AAD/Security services, the actual config is nested one level deeper
  if (config.configuration && typeof config.configuration === 'object' && !Array.isArray(config.configuration)) {
    // Check if this looks like a nested structure (has metadata like type, name, id at outer level)
    if (config.type && config.type === resourceType && config.configuration.Identity) {
      config = config.configuration
    }
  }

  const configStr = JSON.stringify(config, null, 2)
  const configSize = configStr.length
  const configLines = configStr.split('\n').length
  // Escape HTML special characters to prevent injection/syntax errors
  const escapedConfigStr = configStr
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')

  detailsContainer.innerHTML = `
    <div style="padding:16px;height:100%;display:flex;flex-direction:column;gap:16px">
      <!-- Header -->
      <div>
        <div style="font-size:18px;font-weight:600;margin-bottom:8px">
          <i class="ti ti-file"></i> ${resourceName}
        </div>
        <div style="font-size:11px;color:var(--color-text-secondary);margin-bottom:12px">
          Type: <strong>${resourceType}</strong> | Size: <strong>${(configSize / 1024).toFixed(1)}KB</strong>
        </div>
        <div style="font-size:11px;color:var(--color-text-secondary);word-break:break-all;background:var(--color-background-primary);padding:8px;border-radius:4px">
          ID: ${resourceId}
        </div>
      </div>

      <!-- Configuration Preview - Dynamic Height -->
      <div style="flex:1;display:flex;flex-direction:column;min-height:0">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px;flex-shrink:0">
          <div style="font-size:11px;font-weight:500">Configuration (${configLines} lines)</div>
          <button id="toggle-config" class="btn btn-secondary" style="padding:4px 8px;font-size:11px">
            <i class="ti ti-chevron-down"></i> Show All
          </button>
        </div>
        <pre id="config-content" style="
          background:var(--color-background-primary);
          padding:12px;
          border-radius:4px;
          font-size:12px;
          overflow-x:auto;
          overflow-y:hidden;
          white-space:pre-wrap;
          word-break:break-word;
          flex:1;
          margin:0;
          min-height:0;
          max-height:300px;
          transition:max-height 0.3s ease
        ">${escapedConfigStr}</pre>
      </div>

      <!-- Action Buttons - Always Visible -->
      <div style="display:flex;gap:12px;flex-shrink:0">
        <button class="btn btn-primary" id="restore-selected-resource" data-resource-id="${resourceId}" data-backup-id="${backupId}" style="flex:1">
          <i class="ti ti-restore"></i> Restore This Resource
        </button>
        <button class="btn btn-secondary" id="copy-config-btn" style="flex:1">
          <i class="ti ti-copy"></i> Copy Config
        </button>
      </div>
    </div>
  `

  // Restore button handler
  el.querySelector('#restore-selected-resource')?.addEventListener('click', async () => {
    const rid = el.querySelector('#restore-selected-resource').dataset.resourceId
    const bid = el.querySelector('#restore-selected-resource').dataset.backupId

    try {
      const response = await fetch(`${API_BASE}/api/backup/m365/restore/${bid}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          resourceIds: [rid],
          targetEnvironment: 'production'
        })
      })

      const result = await response.json()
      if (result.success) {
        showToast(`✅ Restoring: ${resourceName}`, 'success')
        console.log('Restore Details:', result)
      } else {
        showToast(`❌ Restore failed: ${result.error}`, 'error')
      }
    } catch (error) {
      showToast(`❌ Error: ${error.message}`, 'error')
    }
  })

  // Toggle full config view
  el.querySelector('#toggle-config')?.addEventListener('click', () => {
    const btn = el.querySelector('#toggle-config')
    const content = el.querySelector('#config-content')
    const isExpanded = content?.style.maxHeight === 'none'

    if (isExpanded) {
      // Collapse
      content.style.maxHeight = '300px'
      content.style.overflowY = 'hidden'
      btn.innerHTML = '<i class="ti ti-chevron-down"></i> Show All'
    } else {
      // Expand
      content.style.maxHeight = 'none'
      content.style.overflowY = 'auto'
      btn.innerHTML = '<i class="ti ti-chevron-up"></i> Show Less'
    }
  })

  // Copy config button handler
  el.querySelector('#copy-config-btn')?.addEventListener('click', () => {
    const content = el.querySelector('#config-content').textContent
    navigator.clipboard.writeText(content).then(() => {
      showToast('✅ Configuration copied to clipboard', 'success')
    }).catch(() => {
      showToast('❌ Failed to copy configuration', 'error')
    })
  })
}

export default {
  renderBackupExplorer,
  setupBackupExplorerEvents
}
