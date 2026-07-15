/**
 * Backup Explorer Component
 * File explorer-style navigation for backup resources
 */

export function renderBackupExplorer(backupHistory) {
  const organizedByService = organizeBackupsByService(backupHistory)

  return `
    <div class="backup-explorer-container" style="display:grid;grid-template-columns:250px 1fr;gap:16px;margin-top:16px;min-height:600px">
      <!-- Left Panel: Service Tree -->
      <div class="explorer-tree-panel" style="border:1px solid var(--color-border);border-radius:8px;overflow:hidden;display:flex;flex-direction:column;background:var(--color-background-secondary)">
        <div style="padding:12px;border-bottom:1px solid var(--color-border);font-weight:500;font-size:13px">
          <i class="ti ti-folder-open"></i> Services & Resources
        </div>
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

function renderServiceTree(organized) {
  const services = Object.keys(organized).sort()

  return `
    <div style="padding:8px">
      ${services.map((serviceName, idx) => {
        const data = organized[serviceName]
        const latestBackup = data.backups[0]
        const resourceCount = latestBackup?.resourceCount || 0

        return `
          <div class="tree-item" data-service="${serviceName}" style="margin-bottom:2px">
            <div class="tree-item-header" style="
              padding:8px;
              cursor:pointer;
              border-radius:4px;
              display:flex;
              align-items:center;
              gap:8px;
              user-select:none;
              transition:all 0.2s
            " onmouseover="this.style.background='var(--color-background-primary)'" onmouseout="this.style.background='transparent'">
              <i class="ti ti-chevron-right toggle-icon" style="font-size:12px;transition:transform 0.2s;transform:rotate(0deg)"></i>
              <i class="ti ti-database"></i>
              <span style="flex:1;font-weight:500">${serviceName}</span>
              <span style="
                background:var(--color-primary);
                color:white;
                padding:2px 8px;
                border-radius:3px;
                font-size:11px;
                font-weight:600
              ">${resourceCount}</span>
            </div>

            <div class="tree-item-content" style="display:none;margin-left:12px">
              ${latestBackup ? `
                <div class="tree-item" data-backup="${latestBackup.backupId}" style="margin-bottom:2px">
                  <div class="tree-item-header" style="
                    padding:8px;
                    cursor:pointer;
                    border-radius:4px;
                    display:flex;
                    align-items:center;
                    gap:8px;
                    font-size:11px;
                    color:var(--color-text-secondary);
                    transition:all 0.2s
                  " onmouseover="this.style.background='var(--color-background-primary)'" onmouseout="this.style.background='transparent'">
                    <i class="ti ti-chevron-right toggle-icon-backup" style="font-size:12px;transition:transform 0.2s;transform:rotate(0deg)"></i>
                    <i class="ti ti-calendar"></i>
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

export function setupBackupExplorerEvents(el, API_BASE, showToast) {
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
    <div style="padding:8px">
      ${types.map(type => {
        const resources = grouped[type]
        return `
          <div class="resource-type-group" data-type="${type}" style="margin-bottom:4px">
            <div class="resource-type-header" style="
              padding:6px;
              cursor:pointer;
              border-radius:4px;
              display:flex;
              align-items:center;
              gap:8px;
              font-size:11px;
              font-weight:500;
              transition:all 0.2s;
              background:var(--color-background-primary)
            ">
              <i class="ti ti-chevron-right resource-toggle" style="font-size:11px;transform:rotate(0deg)"></i>
              <i class="ti ti-stack"></i>
              <span style="flex:1">${type}</span>
              <span style="background:var(--color-info);color:white;padding:2px 6px;border-radius:2px;font-size:10px">${resources.length}</span>
            </div>

            <div class="resource-type-content" style="display:none;margin-left:12px">
              ${resources.map(r => `
                <div class="resource-item" data-resource-id="${r.identity || r.name}" style="margin-bottom:2px">
                  <div style="
                    padding:6px;
                    cursor:pointer;
                    border-radius:3px;
                    display:flex;
                    align-items:center;
                    gap:8px;
                    font-size:11px;
                    transition:all 0.2s
                  " onmouseover="this.style.background='var(--color-background-secondary)'" onmouseout="this.style.background='transparent'">
                    <input type="checkbox" class="resource-checkbox" data-resource-id="${r.identity || r.name}" data-name="${r.name}" style="cursor:pointer">
                    <i class="ti ti-file"></i>
                    <span>${r.name || r.type}</span>
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

  detailsContainer.innerHTML = `
    <div style="padding:16px;height:100%;display:flex;flex-direction:column">
      <!-- Header -->
      <div style="margin-bottom:20px">
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

      <!-- Configuration Preview -->
      <div style="margin-bottom:16px;flex:1;display:flex;flex-direction:column">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px">
          <div style="font-size:11px;font-weight:500">Configuration (${configLines} lines)</div>
          <button id="toggle-config" class="btn btn-secondary" style="padding:4px 8px;font-size:11px">
            <i class="ti ti-chevron-down"></i> Show All
          </button>
        </div>
        <pre id="config-content" style="
          background:var(--color-background-primary);
          padding:12px;
          border-radius:4px;
          font-size:10px;
          overflow-x:auto;
          overflow-y:auto;
          white-space:pre-wrap;
          word-break:break-word;
          flex:1;
          margin:0;
          max-height:250px
        ">${configStr}</pre>
      </div>

      <!-- Action Buttons -->
      <div style="display:flex;gap:12px">
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
    const isExpanded = content.style.maxHeight === 'none'

    if (isExpanded) {
      content.style.maxHeight = '250px'
      btn.innerHTML = '<i class="ti ti-chevron-down"></i> Show All'
    } else {
      content.style.maxHeight = 'none'
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
