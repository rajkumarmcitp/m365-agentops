import { showToast } from '../components/toast.js'
import { customSkeleton } from '../lib/skeleton-custom.js'

const isDev = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
const API_BASE = import.meta.env.VITE_API_URL || (isDev
  ? 'http://localhost:3001'
  : 'https://m365ops-api-gtbgezb9c7bgata7.centralus-01.azurewebsites.net')

let allServices = []
let componentConfig = {} // Stores enabled/disabled state per service

export function initBackupConfig() {
  const el = document.getElementById('page-backup-config')
  if (!el) return

  el.innerHTML = customSkeleton.renderPageWithTable(
    '<i class="ti ti-settings-automation"></i> Backup Configuration',
    'Configure which components to backup for each service',
    2,
    ['Service', 'Components'],
    3
  )

  setTimeout(() => {
    loadBackupConfig(el)
  }, 300)
}

async function loadBackupConfig(el) {
  try {
    const response = await fetch(`${API_BASE}/api/backup/m365/services/list`)
    const result = await response.json()

    if (!response.ok || !result.success) {
      return renderError(el, result)
    }

    allServices = result.data || []

    // Load saved configuration from localStorage
    const saved = localStorage.getItem('backupComponentConfig')
    componentConfig = saved ? JSON.parse(saved) : {}

    // Initialize all components as enabled by default
    allServices.forEach(service => {
      if (!componentConfig[service.key]) {
        componentConfig[service.key] = {
          enabled: service.resources.map(() => true) // All enabled by default
        }
      }
    })

    renderBackupConfig(el)
  } catch (error) {
    console.error('Failed to load backup config:', error)
    renderError(el, { error: error.message })
  }
}

function renderBackupConfig(el) {
  el.innerHTML = `
    <div style="max-width:1400px;margin:0 auto">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:24px">
        <div>
          <h2 style="margin:0;font-size:24px;font-weight:600">Backup Configuration</h2>
          <p style="margin:8px 0 0 0;color:var(--color-text-secondary);font-size:13px">
            Select which components to include in backups for each service
          </p>
        </div>
        <div style="display:flex;gap:12px">
          <button id="select-all-btn" class="btn btn-secondary">
            <i class="ti ti-checkbox"></i> Select All
          </button>
          <button id="deselect-all-btn" class="btn btn-secondary">
            <i class="ti ti-checkbox-off"></i> Deselect All
          </button>
          <button id="save-config-btn" class="btn btn-primary">
            <i class="ti ti-check"></i> Save Configuration
          </button>
        </div>
      </div>

      <div style="display:grid;gap:24px">
        ${allServices.map(service => renderServiceConfig(service)).join('')}
      </div>
    </div>
  `

  setupConfigEvents(el)
}

function renderServiceConfig(service) {
  const components = service.resources || []
  const enabled = componentConfig[service.key]?.enabled || components.map(() => true)
  const enabledCount = enabled.filter(Boolean).length

  return `
    <div class="card" style="border:1px solid var(--color-border);border-radius:8px;overflow:hidden">
      <!-- Service Header -->
      <div style="
        padding:16px;
        background:var(--color-background-primary);
        border-bottom:1px solid var(--color-border);
        display:flex;
        justify-content:space-between;
        align-items:center
      ">
        <div style="flex:1">
          <h3 style="margin:0;font-size:16px;font-weight:600">${service.displayName}</h3>
          <p style="margin:4px 0 0 0;font-size:12px;color:var(--color-text-secondary)">
            <span class="service-enabled-count">${enabledCount}</span> of ${components.length} components enabled
          </p>
        </div>
        <div style="display:flex;gap:8px">
          <span class="badge" style="background:var(--color-info);color:white;padding:4px 8px;border-radius:4px;font-size:11px;font-weight:600">
            ${service.tier}
          </span>
        </div>
      </div>

      <!-- Components Grid -->
      <div style="padding:16px;display:grid;grid-template-columns:repeat(auto-fill,minmax(250px,1fr));gap:12px">
        ${components.map((component, idx) => renderComponentCheckbox(service.key, component, idx, enabled[idx])).join('')}
      </div>
    </div>
  `
}

function renderComponentCheckbox(serviceKey, component, index, isEnabled) {
  return `
    <div style="
      display:flex;
      align-items:center;
      gap:10px;
      padding:12px;
      border:1px solid var(--color-border);
      border-radius:4px;
      background:var(--color-background-secondary);
      cursor:pointer;
      transition:all 0.2s
    " class="component-item" data-service="${serviceKey}" data-index="${index}">
      <input
        type="checkbox"
        class="component-checkbox"
        data-service="${serviceKey}"
        data-index="${index}"
        ${isEnabled ? 'checked' : ''}
        style="cursor:pointer;width:18px;height:18px"
      >
      <label style="flex:1;cursor:pointer;font-size:12px;margin:0">
        ${component}
      </label>
    </div>
  `
}

function setupConfigEvents(el) {
  // Select All button
  el.querySelector('#select-all-btn')?.addEventListener('click', () => {
    el.querySelectorAll('.component-checkbox').forEach(cb => {
      cb.checked = true
      updateComponentCount(el, cb.dataset.service)
    })
    showToast('✅ All components selected', 'success')
  })

  // Deselect All button
  el.querySelector('#deselect-all-btn')?.addEventListener('click', () => {
    el.querySelectorAll('.component-checkbox').forEach(cb => {
      cb.checked = false
      updateComponentCount(el, cb.dataset.service)
    })
    showToast('✅ All components deselected', 'success')
  })

  // Component checkbox changes
  el.querySelectorAll('.component-checkbox').forEach(checkbox => {
    checkbox.addEventListener('change', () => {
      updateComponentCount(el, checkbox.dataset.service)
    })
  })

  // Component item click (check/uncheck)
  el.querySelectorAll('.component-item').forEach(item => {
    item.addEventListener('click', (e) => {
      if (e.target.tagName !== 'INPUT') {
        const checkbox = item.querySelector('.component-checkbox')
        checkbox.checked = !checkbox.checked
        updateComponentCount(el, checkbox.dataset.service)
      }
    })
  })

  // Save Configuration button
  el.querySelector('#save-config-btn')?.addEventListener('click', saveConfiguration)
}

function updateComponentCount(el, serviceKey) {
  const checkboxes = el.querySelectorAll(`.component-checkbox[data-service="${serviceKey}"]`)
  const enabledCount = Array.from(checkboxes).filter(cb => cb.checked).length

  // Update config object
  componentConfig[serviceKey] = {
    enabled: Array.from(checkboxes).map(cb => cb.checked)
  }

  // Update display
  const card = el.querySelector(`.card:has([data-service="${serviceKey}"])`)
  const countSpan = card?.querySelector('.service-enabled-count')
  if (countSpan) {
    countSpan.textContent = enabledCount
  }
}

function saveConfiguration() {
  try {
    localStorage.setItem('backupComponentConfig', JSON.stringify(componentConfig))
    showToast('✅ Configuration saved! This will apply to future backups.', 'success')
    console.log('Backup component configuration saved:', componentConfig)
  } catch (error) {
    console.error('Error saving configuration:', error)
    showToast('❌ Failed to save configuration', 'error')
  }
}

function renderError(el, result) {
  el.innerHTML = `
    <div class="card" style="padding:40px;text-align:center">
      <i class="ti ti-alert-circle" style="font-size:48px;color:var(--color-danger);margin-bottom:16px;display:block"></i>
      <h3>Failed to Load Configuration</h3>
      <p style="color:var(--color-text-secondary);margin:12px 0 0 0">
        ${result.error || 'Unable to connect to backend'}
      </p>
    </div>
  `
}

export default {
  initBackupConfig
}
