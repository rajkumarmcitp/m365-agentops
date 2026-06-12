import { state, saveState, resetSettings } from '../app.js'
import { showToast } from '../components/toast.js'
import { createToggle } from '../components/toggle.js'
import { SERVICE_GROUPS, EXCHANGE_SUB } from '../data/portal-services.js'
import { getClaudeStatus, setClaudeApiKey, removeClaudeApiKey } from '../lib/tenantguard-settings-client.js'

export function initSettings() {
  const el = document.getElementById('page-settings')
  if (!el) return
  renderSettings(el)
}

function renderSettings(el) {
  const s = state.settings

  el.innerHTML = `
    <div class="page-header">
      <div class="page-title"><i class="ti ti-adjustments-horizontal"></i> Admin Settings</div>
      <div class="page-subtitle">Configure application display, agent behaviour, and self-service portal</div>
    </div>

    <!-- M365 Config display preferences -->
    <div class="card mb-3">
      <div class="card-title mb-3"><i class="ti ti-settings-2"></i> M365 Config — Display Preferences</div>
      <div id="settings-ps-wrap" style="margin-bottom:14px"></div>
      <div id="settings-result-wrap" style="margin-bottom:14px"></div>
      <div id="settings-expand-wrap" style="margin-bottom:4px"></div>
    </div>

    <!-- Config Agent -->
    <div class="card mb-3">
      <div class="card-title mb-3"><i class="ti ti-robot"></i> Config Agent</div>
      <div class="form-group">
        <label class="form-label">Scan frequency</label>
        <select class="form-select" id="settings-schedule">
          <option value="daily-0800" ${s.agentSchedule === 'daily-0800' ? 'selected' : ''}>Daily at 08:00</option>
          <option value="every-6h" ${s.agentSchedule === 'every-6h' ? 'selected' : ''}>Every 6 hours</option>
          <option value="weekly" ${s.agentSchedule === 'weekly' ? 'selected' : ''}>Weekly</option>
        </select>
      </div>
      <div id="settings-alert-fail-wrap" style="margin-bottom:10px"></div>
      <div class="form-group">
        <label class="form-label">Alert email</label>
        <input type="email" class="form-input" id="settings-alert-email" value="${s.agentAlertEmail}">
      </div>
    </div>

    <!-- TenantGuard AI Investigation -->
    <div class="card mb-3">
      <div class="card-header">
        <span class="card-title"><i class="ti ti-robot"></i> TenantGuard — AI Investigation Agent</span>
        <span id="claude-status-badge" class="badge info">Loading...</span>
      </div>

      <div class="alert-banner info mb-3" style="margin-top:8px">
        <i class="ti ti-info-circle"></i>
        <span>
          <strong>Optional:</strong> Configure your Claude API key to enable AI-powered security investigations.
          Without this, the system uses intelligent mock responses.
          <a href="https://console.anthropic.com" target="_blank" style="color:var(--clr-primary);text-decoration:underline">Get your API key →</a>
        </span>
      </div>

      <div id="claude-settings-section">
        <div style="padding:12px;background:var(--color-background-secondary);border-radius:var(--border-radius-md)">
          <div class="form-group">
            <label class="form-label">Claude API Key</label>
            <input type="password" class="form-input" id="settings-claude-key" placeholder="sk-..." style="font-family:monospace">
            <div style="font-size:10px;color:var(--color-text-tertiary);margin-top:4px">
              Your API key is stored securely and never shared. Get one free at console.anthropic.com
            </div>
          </div>

          <div class="form-group" style="margin-top:12px">
            <label class="form-label">About Claude Integration</label>
            <div style="font-size:11px;color:var(--color-text-secondary);line-height:1.6">
              <strong>What it does:</strong> Enables real Claude AI to analyze security incidents, answer questions naturally, and generate incident reports.<br>
              <strong>Cost:</strong> ~$0.19 per investigation (Sonnet) or $0.57 (Opus). Free tier: $5 credits.<br>
              <strong>Without it:</strong> System uses intelligent mock responses (fully functional, good for testing).<br>
              <strong>Status:</strong> <span id="claude-mode-text">Checking...</span>
            </div>
          </div>

          <div style="display:flex;gap:8px;margin-top:12px">
            <button class="btn btn-primary" id="claude-save-btn">
              <i class="ti ti-device-floppy"></i> Save API Key
            </button>
            <button class="btn btn-danger" id="claude-remove-btn" style="display:none">
              <i class="ti ti-trash"></i> Remove API Key
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Platform display -->
    <div class="card mb-3">
      <div class="card-title mb-3"><i class="ti ti-layout-dashboard"></i> Platform Display</div>
      <div id="settings-graph-health-wrap" style="margin-bottom:14px"></div>
      <div id="settings-zt-score-wrap" style="margin-bottom:14px"></div>
      <div id="settings-cfg-score-wrap" style="margin-bottom:4px"></div>
    </div>

    <!-- Self-Service Portal Management -->
    <div class="card mb-3">
      <div class="card-header">
        <span class="card-title"><i class="ti ti-grid-dots"></i> Self-Service Portal Management</span>
        <span class="badge info">11 services</span>
      </div>

      <div class="alert-banner info mb-3" style="margin-top:8px">
        <i class="ti ti-info-circle"></i>
        Enable or disable the portal entirely, or toggle individual services and Exchange sub-services.
        Disabled services show as unavailable to end users.
      </div>

      <!-- Master toggle -->
      <div style="padding:12px;background:var(--color-background-secondary);border-radius:var(--border-radius-md);margin-bottom:16px">
        <div id="settings-portal-master-wrap"></div>
      </div>

      <div id="portal-services-section">
        <!-- Main services -->
        <div class="section-heading" style="margin-bottom:8px">Service Availability</div>
        <div class="portal-svc-settings-grid" id="portal-main-toggles"></div>

        <!-- Exchange sub-services -->
        <div class="section-heading" style="margin-top:16px;margin-bottom:8px">
          Exchange Online — Sub-Services
          <span style="font-size:10px;color:var(--color-text-tertiary);text-transform:none;letter-spacing:0;font-weight:400;margin-left:6px">
            Only applies when Exchange Online is enabled above
          </span>
        </div>
        <div class="portal-svc-settings-grid" id="portal-exchange-toggles"></div>
      </div>
    </div>

    <div style="display:flex;gap:8px">
      <button class="btn btn-primary" id="settings-save"><i class="ti ti-device-floppy"></i> Save settings</button>
      <button class="btn btn-danger" id="settings-reset"><i class="ti ti-rotate"></i> Reset to defaults</button>
    </div>
  `

  // ---- M365 Config toggles ----
  const psToggle = createToggle({
    id: 'toggle-ps', checked: s.showPSCommands,
    label: 'Show PowerShell validation commands',
    sublabel: 'Displays the PowerShell command used for each control in the M365 Config topic view.',
    onChange: (v) => { state.settings.showPSCommands = v; saveState() },
  })
  el.querySelector('#settings-ps-wrap').appendChild(psToggle)

  const resultToggle = createToggle({
    id: 'toggle-result', checked: s.showTenantResult,
    label: 'Show simulated tenant result',
    sublabel: 'Displays the simulated tenant scan result for each control.',
    onChange: (v) => { state.settings.showTenantResult = v; saveState() },
  })
  el.querySelector('#settings-result-wrap').appendChild(resultToggle)

  const expandToggle = createToggle({
    id: 'toggle-expand', checked: s.autoExpandFailed,
    label: 'Auto-expand failed controls',
    sublabel: 'Automatically opens the details panel for failed controls on topic load.',
    onChange: (v) => { state.settings.autoExpandFailed = v; saveState() },
  })
  el.querySelector('#settings-expand-wrap').appendChild(expandToggle)

  const alertFailToggle = createToggle({
    id: 'toggle-alert-fail', checked: s.agentAlertOnFail,
    label: 'Alert on new failures',
    sublabel: 'Send email notification when agent detects new failed controls.',
    onChange: (v) => { state.settings.agentAlertOnFail = v; saveState() },
  })
  el.querySelector('#settings-alert-fail-wrap').appendChild(alertFailToggle)

  const graphHealthToggle = createToggle({
    id: 'toggle-graph-health', checked: s.showGraphHealth,
    label: 'Show Graph API health on dashboard',
    onChange: (v) => { state.settings.showGraphHealth = v; saveState() },
  })
  el.querySelector('#settings-graph-health-wrap').appendChild(graphHealthToggle)

  const ztScoreToggle = createToggle({
    id: 'toggle-zt-score', checked: s.showZeroTrustScore,
    label: 'Show Zero Trust score on dashboard',
    onChange: (v) => { state.settings.showZeroTrustScore = v; saveState() },
  })
  el.querySelector('#settings-zt-score-wrap').appendChild(ztScoreToggle)

  const cfgScoreToggle = createToggle({
    id: 'toggle-cfg-score', checked: s.showM365ConfigScore,
    label: 'Show M365 Config score on dashboard',
    onChange: (v) => { state.settings.showM365ConfigScore = v; saveState() },
  })
  el.querySelector('#settings-cfg-score-wrap').appendChild(cfgScoreToggle)

  // ---- Portal master toggle ----
  const portalMasterToggle = createToggle({
    id: 'toggle-portal-master',
    checked: s.portalEnabled !== false,
    label: 'Self-Service Portal — Master Switch',
    sublabel: 'Disable to prevent all users from accessing the portal globally.',
    onChange: (v) => {
      state.settings.portalEnabled = v
      saveState()
      const section = el.querySelector('#portal-services-section')
      if (section) section.style.opacity = v ? '1' : '0.4'
      showToast(v ? 'Self-Service Portal enabled.' : 'Self-Service Portal disabled globally.', v ? 'success' : 'warning')
    },
  })
  el.querySelector('#settings-portal-master-wrap').appendChild(portalMasterToggle)

  const svcSection = el.querySelector('#portal-services-section')
  if (svcSection) svcSection.style.opacity = s.portalEnabled !== false ? '1' : '0.4'

  // ---- Main service toggles ----
  const mainGrid = el.querySelector('#portal-main-toggles')
  SERVICE_GROUPS.forEach(group => {
    const key = 'portal_' + group.id.replace(/-/g, '_')
    const row = document.createElement('div')
    row.className = 'portal-svc-setting-row'
    row.innerHTML = `
      <div class="psc-icon" style="background:${group.bg};color:${group.color};width:28px;height:28px;font-size:13px;border-radius:6px;flex-shrink:0">
        <i class="ti ${group.icon}"></i>
      </div>
      <span style="flex:1;font-size:11px;font-weight:500">${group.name}</span>
      <div id="portal-toggle-${key}"></div>
    `
    mainGrid.appendChild(row)

    const toggle = createToggle({
      id: `chk-${key}`,
      checked: s[key] !== false,
      label: '',
      onChange: (v) => { state.settings[key] = v; saveState() },
    })
    row.querySelector(`#portal-toggle-${key}`).appendChild(toggle)
  })

  // ---- Exchange sub-service toggles ----
  const exGrid = el.querySelector('#portal-exchange-toggles')
  const subKeys = {
    'exchange-groups': 'portal_exchange_groups',
    'shared-mailbox':  'portal_shared_mailbox',
    'room-equipment':  'portal_room_equipment',
    'email-services':  'portal_email_services',
  }
  EXCHANGE_SUB.forEach(sub => {
    const key = subKeys[sub.id]
    const row = document.createElement('div')
    row.className = 'portal-svc-setting-row'
    row.innerHTML = `
      <i class="ti ${sub.icon}" style="color:var(--color-text-secondary)"></i>
      <span style="flex:1;font-size:11px;font-weight:500">${sub.name}</span>
      <div id="portal-toggle-${key}"></div>
    `
    exGrid.appendChild(row)

    const toggle = createToggle({
      id: `chk-${key}`,
      checked: s[key] !== false,
      label: '',
      onChange: (v) => { state.settings[key] = v; saveState() },
    })
    row.querySelector(`#portal-toggle-${key}`).appendChild(toggle)
  })

  // ---- Save & Reset ----
  el.querySelector('#settings-save').addEventListener('click', () => {
    state.settings.agentSchedule = el.querySelector('#settings-schedule').value
    state.settings.agentAlertEmail = el.querySelector('#settings-alert-email').value
    saveState()
    showToast('Settings saved successfully.', 'success')
  })

  el.querySelector('#settings-reset').addEventListener('click', () => {
    resetSettings()
    renderSettings(el)
    showToast('Settings reset to defaults.', 'info')
  })

  // ---- Claude API Configuration ----
  loadClaudeStatus(el)

  el.querySelector('#claude-save-btn').addEventListener('click', async () => {
    const apiKey = el.querySelector('#settings-claude-key').value
    if (!apiKey || apiKey.trim() === '') {
      showToast('Please enter a Claude API key', 'warning')
      return
    }

    const btn = el.querySelector('#claude-save-btn')
    btn.disabled = true
    btn.innerHTML = '<span class="spinner dark"></span> Saving...'

    try {
      const result = await setClaudeApiKey(apiKey)
      if (result.success) {
        showToast('Claude API key configured successfully!', 'success')
        el.querySelector('#settings-claude-key').value = ''
        loadClaudeStatus(el)
      } else {
        showToast('Failed to save: ' + result.error, 'error')
      }
    } catch (error) {
      showToast('Error saving API key: ' + error.message, 'error')
    }

    btn.disabled = false
    btn.innerHTML = '<i class="ti ti-device-floppy"></i> Save API Key'
  })

  el.querySelector('#claude-remove-btn').addEventListener('click', async () => {
    const btn = el.querySelector('#claude-remove-btn')
    btn.disabled = true
    btn.innerHTML = '<span class="spinner dark"></span> Removing...'

    try {
      const result = await removeClaudeApiKey()
      if (result.success) {
        showToast('Claude API key removed', 'success')
        loadClaudeStatus(el)
      } else {
        showToast('Failed to remove: ' + result.error, 'error')
      }
    } catch (error) {
      showToast('Error removing API key: ' + error.message, 'error')
    }

    btn.disabled = false
    btn.innerHTML = '<i class="ti ti-trash"></i> Remove API Key'
  })
}

async function loadClaudeStatus(el) {
  try {
    const status = await getClaudeStatus()
    if (status) {
      const badge = el.querySelector('#claude-status-badge')
      const modeText = el.querySelector('#claude-mode-text')
      const removeBtn = el.querySelector('#claude-remove-btn')

      if (status.available) {
        badge.innerHTML = '<span style="background:var(--clr-success-bg);color:var(--clr-success-text);padding:2px 8px;border-radius:3px;font-size:9px;font-weight:600">ACTIVE</span>'
        modeText.innerHTML = '<strong style="color:var(--clr-success-text)">✓ Claude API Active</strong> - Real AI investigations enabled'
        removeBtn.style.display = 'inline-flex'
      } else {
        badge.innerHTML = '<span style="background:var(--clr-info-bg);color:var(--clr-info-text);padding:2px 8px;border-radius:3px;font-size:9px;font-weight:600">MOCK MODE</span>'
        modeText.innerHTML = '<strong style="color:var(--clr-info-text)">✓ Mock Mode</strong> - Using intelligent fallback responses (fully functional for testing)'
        removeBtn.style.display = 'none'
      }
    }
  } catch (error) {
    console.error('Failed to load Claude status:', error)
  }
}
