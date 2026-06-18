import { state, saveState, resetSettings } from '../app.js'
import { showToast } from '../components/toast.js'
import { createToggle } from '../components/toggle.js'
import { SERVICE_GROUPS, EXCHANGE_SUB } from '../data/portal-services.js'
import { getClaudeStatus, setClaudeApiKey, removeClaudeApiKey } from '../lib/tenantguard-settings-client.js'
import { api } from '../lib/api-client.js'

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

    <!-- Change Intelligence Configuration -->
    <div class="card mb-3">
      <div class="card-title mb-3"><i class="ti ti-antenna"></i> Change Intelligence Configuration</div>
      <div style="padding:12px;background:var(--color-background-secondary);border-radius:var(--border-radius-md)">
        <div style="margin-bottom:14px">
          <label class="form-label">Announcement Sync Period</label>
          <select id="settings-sync-days" style="width:100%;padding:8px;font-size:11px;border:0.5px solid #ccc;border-radius:4px">
            <option value="7">Last 7 days (Default)</option>
            <option value="14">Last 14 days</option>
            <option value="30">Last 30 days</option>
          </select>
          <div style="font-size:10px;color:var(--color-text-tertiary);margin-top:6px">
            Pulls announcements created or updated in selected period
          </div>
        </div>

        <div style="margin-bottom:14px">
          <label class="form-label">SharePoint Site URL</label>
          <div style="display:flex;gap:8px">
            <input type="text" class="form-input" id="settings-sharepoint-site" placeholder="e.g., root or /sites/OpsCenter" style="flex:1">
            <button class="btn" id="settings-sharepoint-test" style="white-space:nowrap"><i class="ti ti-check"></i> Test</button>
          </div>
          <div style="font-size:10px;color:var(--color-text-tertiary);margin-top:6px">
            Enter "root" for tenant root site, or "/sites/SiteName" for a specific site
          </div>
        </div>
        <div id="settings-sharepoint-status" style="padding:8px;background:#f0f0f0;border-radius:4px;font-size:10px;color:#666;display:none">
          Status will appear here
        </div>
      </div>
    </div>

    <!-- Self Service Portal SharePoint Configuration -->
    <div class="card mb-3">
      <div class="card-title mb-3"><i class="ti ti-layout-kanban"></i> Self Service Portal — SharePoint Configuration</div>
      <div style="background:#e3f2fd;border-left:4px solid #2196f3;padding:10px;border-radius:4px;margin-bottom:12px;font-size:10px;color:#1565c0">
        <strong>Configuration:</strong> Specify the SharePoint site where Self Service Portal requests, approvals, and audit logs will be stored.
      </div>

      <div style="margin-bottom:14px">
        <label class="form-label">SharePoint Site URL</label>
        <div style="display:flex;gap:8px">
          <input type="text" class="form-input" id="settings-selfservice-site" placeholder="e.g., root or /sites/SelfService" style="flex:1">
          <button class="btn" id="settings-selfservice-test" style="white-space:nowrap"><i class="ti ti-check"></i> Test</button>
        </div>
        <div style="font-size:10px;color:var(--color-text-tertiary);margin-top:6px">
          Enter "root" for tenant root site, or "/sites/SiteName" for a specific site. Lists will be created here: SelfServiceRequests, SelfServiceApprovals, SelfServiceAudit
        </div>
      </div>
      <div id="settings-selfservice-status" style="padding:8px;background:#f0f0f0;border-radius:4px;font-size:10px;color:#666;display:none">
        Status will appear here
      </div>

        <div style="margin-top:16px;border-top:1px solid #ddd;padding-top:14px">
          <label class="form-label">Task Resolution Approvers</label>
          <div style="background:#fff3cd;border-left:4px solid #ff9800;padding:10px;border-radius:4px;margin-bottom:12px;font-size:10px;color:#ff6600">
            <strong>Governance:</strong> Designate 2 accounts (Primary & Secondary) who must approve before tasks can be marked as Resolved.
          </div>

          <div style="margin-bottom:12px">
            <label style="font-size:10px;font-weight:600;color:#555;display:block;margin-bottom:6px">Primary Approver Email</label>
            <input type="email" id="settings-primary-approver" placeholder="admin@company.com" style="width:100%;padding:8px;font-size:11px;border:0.5px solid #ccc;border-radius:4px" value="${s.primaryApprover || ''}">
          </div>

          <div style="margin-bottom:12px">
            <label style="font-size:10px;font-weight:600;color:#555;display:block;margin-bottom:6px">Secondary Approver Email</label>
            <input type="email" id="settings-secondary-approver" placeholder="manager@company.com" style="width:100%;padding:8px;font-size:11px;border:0.5px solid #ccc;border-radius:4px" value="${s.secondaryApprover || ''}">
          </div>

          <div style="font-size:9px;color:#666;padding:8px;background:#f5f5f5;border-radius:4px">
            <strong>Current approvers:</strong><br>
            Primary: ${s.primaryApprover ? `<span style="color:#0066cc;font-weight:600">${s.primaryApprover}</span>` : '<span style="color:#999">Not set</span>'}<br>
            Secondary: ${s.secondaryApprover ? `<span style="color:#0066cc;font-weight:600">${s.secondaryApprover}</span>` : '<span style="color:#999">Not set</span>'}
          </div>
        </div>
      </div>
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
        <!-- Collapsible Service Availability -->
        <div style="border:1px solid var(--color-border-primary);border-radius:var(--border-radius-md);overflow:hidden">
          <button id="svc-availability-toggle" style="width:100%;padding:12px;background:var(--color-background-secondary);border:none;cursor:pointer;display:flex;align-items:center;justify-content:space-between;font-weight:600;font-size:11px;text-transform:uppercase;letter-spacing:0.3px;color:var(--color-text-secondary);transition:background var(--transition)">
            <span style="display:flex;align-items:center;gap:8px">
              <i class="ti ti-grid-dots" style="color:var(--clr-info-text)"></i>
              Service Availability
            </span>
            <i class="ti ti-chevron-down" style="transition:transform var(--transition)"></i>
          </button>
          <div id="svc-availability-content" style="display:none;padding:12px;border-top:1px solid var(--color-border-primary)">
            <div class="portal-svc-settings-grid" id="portal-main-toggles" style="margin-bottom:16px;display:grid;grid-template-columns:repeat(4,1fr);gap:12px"></div>

            <!-- Exchange sub-services -->
            <div class="section-heading" style="margin-bottom:8px;margin-top:12px">
              Exchange Online — Sub-Services
              <span style="font-size:10px;color:var(--color-text-tertiary);text-transform:none;letter-spacing:0;font-weight:400;margin-left:6px">
                Only applies when Exchange Online is enabled
              </span>
            </div>
            <div class="portal-svc-settings-grid" id="portal-exchange-toggles" style="display:grid;grid-template-columns:repeat(4,1fr);gap:12px"></div>
          </div>
        </div>
      </div>

      <!-- Approval Workflow Configuration -->
      <div style="margin-top:20px;padding-top:20px;border-top:1px solid var(--color-border-tertiary)">
        <div class="section-heading" style="margin-bottom:12px">Approval Workflow Configuration</div>
        <div class="alert-banner info mb-3" style="margin-bottom:12px">
          <i class="ti ti-info-circle"></i>
          Configure the approval workflow required for each service type before the AI Agent can process the request.
        </div>
        <div id="workflow-config" style="display:grid;grid-template-columns:repeat(3,1fr);gap:12px"></div>
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

  // ---- Sync Period Configuration ----
  const syncDaysSelect = el.querySelector('#settings-sync-days')
  if (syncDaysSelect) {
    syncDaysSelect.value = s.announcementSyncDays || 7
    syncDaysSelect.addEventListener('change', (e) => {
      state.settings.announcementSyncDays = parseInt(e.target.value)
      saveState()
      showToast(`Sync period set to last ${e.target.value} days`, 'success')
    })
  }

  // ---- SharePoint Configuration (Change Intelligence) ----
  const sharepointInput = el.querySelector('#settings-sharepoint-site')
  const sharepointTestBtn = el.querySelector('#settings-sharepoint-test')
  const sharepointStatus = el.querySelector('#settings-sharepoint-status')

  sharepointInput.value = s.sharepointSiteUrl || 'root'

  sharepointTestBtn.addEventListener('click', async () => {
    const siteUrl = sharepointInput.value.trim() || 'root'
    sharepointTestBtn.disabled = true
    sharepointTestBtn.innerHTML = '<span class="spinner dark" style="width:14px;height:14px"></span> Testing...'
    sharepointStatus.style.display = 'block'
    sharepointStatus.textContent = 'Testing connection...'

    try {
      const response = await fetch(`${api}/msgcenter/validate-sharepoint`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ siteUrl })
      })

      const result = await response.json()

      if (response.ok && result.success) {
        sharepointStatus.style.background = '#e8f5e9'
        sharepointStatus.style.color = '#2e7d32'
        sharepointStatus.textContent = `✓ Connected! Site: ${result.siteName || siteUrl}`
        state.settings.sharepointSiteUrl = siteUrl
        state.settings.sharepointSiteId = result.siteId
        saveState()
        showToast('SharePoint site configured successfully', 'success')
      } else {
        sharepointStatus.style.background = '#ffebee'
        sharepointStatus.style.color = '#c62828'
        sharepointStatus.textContent = `✗ Error: ${result.error || 'Could not connect to site'}`
        showToast('SharePoint connection failed', 'error')
      }
    } catch (error) {
      sharepointStatus.style.background = '#ffebee'
      sharepointStatus.style.color = '#c62828'
      sharepointStatus.textContent = `✗ Error: ${error.message}`
      showToast('SharePoint connection error', 'error')
    } finally {
      sharepointTestBtn.disabled = false
      sharepointTestBtn.innerHTML = '<i class="ti ti-check"></i> Test'
    }
  })

  // ---- Self Service Portal SharePoint Configuration ----
  const selfServiceInput = el.querySelector('#settings-selfservice-site')
  const selfServiceTestBtn = el.querySelector('#settings-selfservice-test')
  const selfServiceStatus = el.querySelector('#settings-selfservice-status')

  selfServiceInput.value = s.selfServiceSiteUrl || 'root'

  selfServiceTestBtn.addEventListener('click', async () => {
    const siteUrl = selfServiceInput.value.trim() || 'root'
    selfServiceTestBtn.disabled = true
    selfServiceTestBtn.innerHTML = '<span class="spinner dark" style="width:14px;height:14px"></span> Testing...'
    selfServiceStatus.style.display = 'block'
    selfServiceStatus.textContent = 'Testing connection...'

    try {
      const response = await fetch(`${api}/self-service/validate-sharepoint`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ siteUrl })
      })

      const result = await response.json()

      if (response.ok && result.success) {
        selfServiceStatus.style.background = '#e8f5e9'
        selfServiceStatus.style.color = '#2e7d32'
        selfServiceStatus.textContent = `✓ Connected! Site: ${result.siteName || siteUrl}`
        state.settings.selfServiceSiteUrl = siteUrl
        state.settings.selfServiceSiteId = result.siteId
        saveState()
        showToast('Self Service Portal SharePoint site configured successfully', 'success')
      } else {
        selfServiceStatus.style.background = '#ffebee'
        selfServiceStatus.style.color = '#c62828'
        selfServiceStatus.textContent = `✗ Error: ${result.error || 'Could not connect to site'}`
        showToast('SharePoint connection failed', 'error')
      }
    } catch (error) {
      selfServiceStatus.style.background = '#ffebee'
      selfServiceStatus.style.color = '#c62828'
      selfServiceStatus.textContent = `✗ Error: ${error.message}`
      showToast('SharePoint connection error', 'error')
    } finally {
      selfServiceTestBtn.disabled = false
      selfServiceTestBtn.innerHTML = '<i class="ti ti-check"></i> Test'
    }
  })

  // ---- Task Resolution Approvers ----
  const primaryApproverInput = el.querySelector('#settings-primary-approver')
  const secondaryApproverInput = el.querySelector('#settings-secondary-approver')

  if (primaryApproverInput) {
    primaryApproverInput.addEventListener('change', (e) => {
      const email = e.target.value.trim()
      if (email && !email.includes('@')) {
        showToast('Please enter a valid email address', 'warning')
        return
      }
      state.settings.primaryApprover = email || null
      saveState()
      showToast(email ? `Primary approver set to ${email}` : 'Primary approver cleared', 'success')
    })
  }

  if (secondaryApproverInput) {
    secondaryApproverInput.addEventListener('change', (e) => {
      const email = e.target.value.trim()
      if (email && !email.includes('@')) {
        showToast('Please enter a valid email address', 'warning')
        return
      }
      state.settings.secondaryApprover = email || null
      saveState()
      showToast(email ? `Secondary approver set to ${email}` : 'Secondary approver cleared', 'success')
    })
  }

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
    const card = document.createElement('div')
    card.style.cssText = 'padding:12px;background:var(--color-background-secondary);border-radius:var(--border-radius-md);border:1px solid var(--color-border-primary);display:flex;align-items:center;gap:10px'
    card.innerHTML = `
      <div class="psc-icon" style="background:${group.bg};color:${group.color};width:28px;height:28px;font-size:12px;border-radius:6px;flex-shrink:0;display:flex;align-items:center;justify-content:center">
        <i class="ti ${group.icon}"></i>
      </div>
      <span style="flex:1;font-size:11px;font-weight:600">${group.name}</span>
      <div id="portal-toggle-${key}"></div>
    `
    mainGrid.appendChild(card)

    const toggle = createToggle({
      id: `chk-${key}`,
      checked: s[key] !== false,
      label: '',
      onChange: (v) => { state.settings[key] = v; saveState() },
    })
    card.querySelector(`#portal-toggle-${key}`).appendChild(toggle)
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
    const card = document.createElement('div')
    card.style.cssText = 'padding:12px;background:var(--color-background-secondary);border-radius:var(--border-radius-md);border:1px solid var(--color-border-primary);display:flex;align-items:center;gap:10px'
    card.innerHTML = `
      <i class="ti ${sub.icon}" style="color:var(--clr-info-text);font-size:14px;flex-shrink:0"></i>
      <span style="flex:1;font-size:11px;font-weight:600">${sub.name}</span>
      <div id="portal-toggle-${key}"></div>
    `
    exGrid.appendChild(card)

    const toggle = createToggle({
      id: `chk-${key}`,
      checked: s[key] !== false,
      label: '',
      onChange: (v) => { state.settings[key] = v; saveState() },
    })
    card.querySelector(`#portal-toggle-${key}`).appendChild(toggle)
  })

  // ---- Service Availability Collapse Toggle ----
  const svcToggleBtn = el.querySelector('#svc-availability-toggle')
  const svcContent = el.querySelector('#svc-availability-content')
  const svcChevron = svcToggleBtn.querySelector('.ti-chevron-down')

  svcToggleBtn.addEventListener('click', () => {
    const isHidden = svcContent.style.display === 'none'
    svcContent.style.display = isHidden ? 'block' : 'none'
    svcChevron.style.transform = isHidden ? 'rotate(180deg)' : 'rotate(0deg)'
  })

  // ---- Approval Workflow Configuration ----
  const workflowConfig = el.querySelector('#workflow-config')
  SERVICE_GROUPS.forEach(group => {
    const workflowKey = 'workflow_' + group.id.replace(/-/g, '_')
    const currentWorkflow = s[workflowKey] || 'admin-only'

    const card = document.createElement('div')
    card.style.cssText = 'padding:12px;background:var(--color-background-secondary);border-radius:var(--border-radius-md);border:1px solid var(--color-border-primary)'
    card.innerHTML = `
      <div style="display:flex;align-items:center;gap:12px;margin-bottom:8px">
        <div class="psc-icon" style="background:${group.bg};color:${group.color};width:24px;height:24px;font-size:11px;border-radius:4px;flex-shrink:0;display:flex;align-items:center;justify-content:center">
          <i class="ti ${group.icon}"></i>
        </div>
        <span style="font-weight:600;font-size:11px">${group.name}</span>
      </div>
      <select class="form-select" style="font-size:11px" id="workflow-${group.id}">
        <option value="no-approval" ${currentWorkflow === 'no-approval' ? 'selected' : ''}>No Approval Required (Direct to Agent)</option>
        <option value="admin-only" ${currentWorkflow === 'admin-only' ? 'selected' : ''}>Admin Approval Only</option>
        <option value="manager-then-admin" ${currentWorkflow === 'manager-then-admin' ? 'selected' : ''}>Manager Approval → Admin Approval</option>
        <option value="manager-only" ${currentWorkflow === 'manager-only' ? 'selected' : ''}>Manager Approval Only</option>
      </select>
    `
    workflowConfig.appendChild(card)

    const select = card.querySelector(`#workflow-${group.id}`)
    select.addEventListener('change', (e) => {
      state.settings[workflowKey] = e.target.value
      saveState()
      showToast(`Workflow updated for ${group.name}`, 'success')
    })
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
