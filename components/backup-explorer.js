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
  // Toggle service tree items
  el.querySelectorAll('.tree-item-header').forEach(header => {
    header.addEventListener('click', (e) => {
      const treeItem = header.closest('.tree-item')
      const content = treeItem.querySelector('.tree-item-content')
      const toggle = header.querySelector('.toggle-icon')

      if (content) {
        const isOpen = content.style.display !== 'none'
        content.style.display = isOpen ? 'none' : 'block'
        if (toggle) {
          toggle.style.transform = isOpen ? 'rotate(0deg)' : 'rotate(90deg)'
        }
      }

      e.stopPropagation()
    })
  })

  // Load resources when backup is expanded
  el.querySelectorAll('.tree-item-header').forEach(header => {
    header.addEventListener('click', async (e) => {
      const backup = header.closest('[data-backup]')
      if (!backup) return

      const backupId = backup.dataset.backup
      const resourceContent = backup.querySelector('.tree-backup-content')
      const resourceList = backup.querySelector(`#resource-list-${backupId}`)

      if (resourceList?.textContent.includes('Loading')) {
        try {
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
          resourceList.innerHTML = `<div style="padding:8px;font-size:11px;color:var(--color-danger)">Error loading resources: ${error.message}</div>`
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
        showResourceDetails(el, checkbox.dataset.resourceId, checkbox.dataset.name, backupId, API_BASE, showToast)
      }
    })
  })
}

function showResourceDetails(el, resourceId, resourceName, backupId, API_BASE, showToast) {
  const detailsContainer = el.querySelector('#details-container')

  detailsContainer.innerHTML = `
    <div style="padding:16px">
      <div style="margin-bottom:20px">
        <div style="font-size:18px;font-weight:600;margin-bottom:8px">
          <i class="ti ti-file"></i> ${resourceName}
        </div>
        <div style="font-size:11px;color:var(--color-text-secondary)">
          ID: ${resourceId.substring(0, 30)}...
        </div>
      </div>

      <div style="background:var(--color-background-primary);padding:12px;border-radius:4px;margin-bottom:20px">
        <div style="font-size:11px;font-weight:500;margin-bottom:8px">Selected for Restore</div>
        <div style="font-size:12px;word-break:break-all">${resourceId}</div>
      </div>

      <div style="display:flex;gap:12px">
        <button class="btn btn-primary" id="restore-selected-resource" data-resource-id="${resourceId}" data-backup-id="${backupId}" style="flex:1">
          <i class="ti ti-restore"></i> Restore This Resource
        </button>
        <button class="btn btn-secondary" id="view-config-resource" style="flex:1">
          <i class="ti ti-code"></i> View Configuration
        </button>
      </div>

      <div id="config-view" style="margin-top:16px;display:none">
        <div style="font-size:11px;font-weight:500;margin-bottom:8px">Configuration:</div>
        <pre style="
          background:var(--color-background-primary);
          padding:12px;
          border-radius:4px;
          font-size:10px;
          overflow-x:auto;
          max-height:300px;
          overflow-y:auto;
          white-space:pre-wrap;
          word-break:break-word
        " id="config-content"></pre>
      </div>
    </div>
  `

  // Restore button handler
  el.querySelector('#restore-selected-resource')?.addEventListener('click', async () => {
    const resourceId = el.querySelector('#restore-selected-resource').dataset.resourceId
    const bid = el.querySelector('#restore-selected-resource').dataset.backupId

    try {
      const response = await fetch(`${API_BASE}/api/backup/m365/restore/${bid}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          resourceIds: [resourceId],
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

  // View config button handler
  el.querySelector('#view-config-resource')?.addEventListener('click', () => {
    const configView = el.querySelector('#config-view')
    const isShown = configView.style.display !== 'none'
    configView.style.display = isShown ? 'none' : 'block'

    if (!isShown && !el.querySelector('#config-content').textContent) {
      // Load config from backup - this is a placeholder
      el.querySelector('#config-content').textContent = 'Configuration data would be loaded from the backup\n\nResource ID: ' + resourceId
    }
  })
}

export default {
  renderBackupExplorer,
  setupBackupExplorerEvents
}
