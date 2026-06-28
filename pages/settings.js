import { state, saveState, resetSettings } from '../app.js'
import { showToast } from '../components/toast.js'
import { createToggle } from '../components/toggle.js'
import { skeletonLoader } from '../lib/skeleton-loader.js'
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

        <div style="margin-top:12px;display:flex;gap:8px">
          <button class="btn btn-primary" id="settings-msgcenter-init" style="white-space:nowrap"><i class="ti ti-database"></i> Initialize Lists</button>
          <div style="font-size:10px;color:var(--color-text-tertiary);padding:8px">Creates SharePoint lists and fields for Change Announcements</div>
        </div>
        <div id="settings-msgcenter-init-status" style="padding:8px;background:#f0f0f0;border-radius:4px;font-size:10px;color:#666;display:none;margin-top:8px">
          Initialization status will appear here
        </div>
      </div>
    </div>

    <!-- Service Health Messages Configuration -->
    <div class="card mb-3">
      <div class="card-title mb-3"><i class="ti ti-heartbeat"></i> Service Health Monitoring</div>

      <!-- Service Health Enabled Toggle -->
      <div style="margin-bottom:16px;padding:12px;background:var(--color-background-secondary);border-radius:4px;border-left:3px solid #ff9800">
        <div style="display:flex;align-items:center;justify-content:space-between;gap:12px">
          <div>
            <div style="font-weight:600;font-size:11px;color:var(--color-text-primary);margin-bottom:2px">Monitor Service Health</div>
            <div style="font-size:9px;color:var(--color-text-secondary)">Enable or disable Service Health monitoring and issue tracking</div>
          </div>
          <div id="settings-servicehealth-enabled-toggle"></div>
        </div>
      </div>

      <!-- Service Health Configuration (Only visible when enabled) -->
      <div id="settings-servicehealth-config-section" style="display:none">
        <div style="background:#fff3e0;border-left:4px solid #ff9800;padding:10px;border-radius:4px;margin-bottom:12px;font-size:10px;color:#e65100">
          <i class="ti ti-info-circle"></i>
          <strong>Configuration:</strong> Specify the SharePoint site where Service Health announcements and incident tracking will be stored. The system will automatically create a list with all required fields and sync announcements every hour.
        </div>

        <!-- Admin Actions Toggle -->
        <div style="margin-bottom:14px;padding:12px;background:var(--color-background-secondary);border-radius:4px;border-left:3px solid #4caf50">
          <div style="display:flex;align-items:center;justify-content:space-between;gap:12px">
            <div>
              <div style="font-weight:600;font-size:11px;color:var(--color-text-primary);margin-bottom:2px">Enable Admin Actions</div>
              <div style="font-size:9px;color:var(--color-text-secondary)">Allow admins to assign, review, and manage service health issues</div>
            </div>
            <div id="settings-servicehealth-admin-actions-toggle"></div>
          </div>
        </div>

      <div style="margin-bottom:14px">
        <label class="form-label">SharePoint Site URL</label>
        <div style="display:flex;gap:8px">
          <input type="text" class="form-input" id="settings-servicehealth-site" placeholder="e.g., root or /sites/OpsCenter" style="flex:1">
          <button class="btn" id="settings-servicehealth-test" style="white-space:nowrap"><i class="ti ti-check"></i> Test</button>
        </div>
        <div style="font-size:10px;color:var(--color-text-tertiary);margin-top:6px">
          Enter "root" for tenant root site, or "/sites/SiteName" for a specific site
        </div>
      </div>
      <div id="settings-servicehealth-status" style="padding:8px;background:#f0f0f0;border-radius:4px;font-size:10px;color:#666;display:none">
        Status will appear here
      </div>

      <div style="margin-top:12px;display:flex;gap:8px">
        <button class="btn btn-primary" id="settings-servicehealth-init" style="white-space:nowrap"><i class="ti ti-database"></i> Create Service Health List</button>
        <div style="font-size:10px;color:var(--color-text-tertiary);padding:8px">Creates SharePoint list with all required columns and fields</div>
      </div>
      <div id="settings-servicehealth-init-status" style="padding:8px;background:#f0f0f0;border-radius:4px;font-size:10px;color:#666;display:none;margin-top:8px">
        Initialization status will appear here
      </div>

      <div style="margin-top:12px;padding:12px;background:var(--color-background-secondary);border-radius:var(--border-radius-md)">
        <div style="font-size:10px;font-weight:600;color:var(--color-text-primary);margin-bottom:8px">📋 Configuration Reference</div>
        <div style="font-size:9px;color:var(--color-text-secondary);line-height:1.6">
          <strong>List Created:</strong><br>
          • Service Health Messages — Service health announcements, incident tracking, assignments, and reviews<br><br>
          <strong>Columns:</strong><br>
          • Title, Description, Impact<br>
          • Service (Exchange, Teams, SharePoint, Entra, etc.)<br>
          • Severity (High, Medium, Low)<br>
          • Status (Active, Assigned, In Review, Resolved)<br>
          • StartDate, ResolvedDate, Deadline<br>
          • AssignedTo, ReviewedBy (person fields)<br>
          • ReviewStatus, Notes, MessageID<br><br>
          <strong>Auto Sync:</strong><br>
          • Initial sync on setup<br>
          • Automatic hourly refresh (every 60 minutes)<br>
          • Manual refresh button available on Service Health page<br><br>
          <strong>After Initialization:</strong><br>
          • Service Health page will display announcements from SharePoint<br>
          • Admins can manage messages via the Admin Actions panel<br>
          • All changes are saved back to SharePoint
        </div>
      </div>

        <div id="settings-servicehealth-config" style="margin-top:12px;padding:12px;background:var(--color-background-secondary);border-radius:var(--border-radius-md);display:none">
          <div style="font-size:10px;font-weight:600;color:var(--color-text-primary);margin-bottom:8px">✅ Configuration Complete</div>
          <div style="background:#f5f5f5;padding:8px;border-radius:4px;font-family:monospace;font-size:9px;color:#333;white-space:pre-wrap;word-break:break-all" id="settings-servicehealth-env-output"></div>
          <button class="btn btn-sm" id="settings-servicehealth-copy" style="margin-top:8px;font-size:9px"><i class="ti ti-copy"></i> Copy Configuration</button>
        </div>
      </div>
    </div>

    <!-- License Management Configuration -->
    <div class="card mb-3">
      <div class="card-title mb-3"><i class="ti ti-license"></i> License Management — Group-Based Assignment</div>
      <div style="background:#e3f2fd;border-left:4px solid #2196f3;padding:10px;border-radius:4px;margin-bottom:12px;font-size:10px;color:#1565c0">
        <i class="ti ti-info-circle"></i>
        <strong>Configure groups for license assignment:</strong> When a group is configured, approved license requests will add users to that group instead of direct assignment. The license will be assigned automatically via dynamic group licensing.
      </div>
      <div id="license-config-wrap"></div>
    </div>

    <!-- Tenant Guard Enhanced SharePoint Configuration -->
    <div class="card mb-3">
      <div class="card-title mb-3"><i class="ti ti-alert-triangle"></i> Tenant Guard Enhanced — SharePoint Configuration</div>
      <div style="background:#f3e5f5;border-left:4px solid #9c27b0;padding:10px;border-radius:4px;margin-bottom:12px;font-size:10px;color:#6a1b9a">
        <i class="ti ti-info-circle"></i>
        <strong>Configuration:</strong> Specify the SharePoint site where P1/P2 priority alerts, correlations, and investigations will be stored (Enhanced dashboard). This is required for real-time alert synchronization.
      </div>

      <div style="margin-bottom:14px">
        <label class="form-label">SharePoint Site URL</label>
        <div style="display:flex;gap:8px">
          <input type="text" class="form-input" id="settings-tenantguard-enhanced-site" placeholder="e.g., root or /sites/Security" style="flex:1">
          <button class="btn" id="settings-tenantguard-enhanced-test" style="white-space:nowrap"><i class="ti ti-check"></i> Test</button>
        </div>
        <div style="font-size:10px;color:var(--color-text-tertiary);margin-top:6px">
          Enter "root" for tenant root site, or "/sites/SiteName" for a specific site. Lists will be created here: TenantGuard-Enhanced-Alerts, TenantGuard-Enhanced-Correlations, TenantGuard-Enhanced-Investigations
        </div>
      </div>
      <div id="settings-tenantguard-enhanced-status" style="padding:8px;background:#f0f0f0;border-radius:4px;font-size:10px;color:#666;display:none">
        Status will appear here
      </div>

      <div style="margin-top:12px;display:flex;gap:8px;align-items:center">
        <button class="btn btn-primary" id="settings-tenantguard-enhanced-init" style="white-space:nowrap"><i class="ti ti-database"></i> Initialize Enhanced Lists</button>
        <div style="font-size:10px;color:var(--color-text-tertiary)">Creates P1/P2 priority alert lists with all required fields</div>
      </div>
      <div id="settings-tenantguard-enhanced-init-status" style="padding:8px;background:#f0f0f0;border-radius:4px;font-size:10px;color:#666;display:none;margin-top:8px">
        Initialization status will appear here
      </div>

      <div style="margin-top:12px;padding:12px;background:var(--color-background-secondary);border-radius:var(--border-radius-md)">
        <div style="font-size:10px;font-weight:600;color:var(--color-text-primary);margin-bottom:8px">📋 Configuration Reference</div>
        <div style="font-size:9px;color:var(--color-text-secondary);line-height:1.6">
          <strong>Lists Created:</strong><br>
          • TenantGuard-Enhanced-Alerts — P1/P2 priority security events<br>
          • TenantGuard-Enhanced-Correlations — Grouped alert patterns<br>
          • TenantGuard-Enhanced-Investigations — Investigation logs<br><br>
          <strong>Alert Priority Filter:</strong><br>
          Only P1 (Critical) and P2 (High) priority alerts are stored<br><br>
          <strong>After Initialization:</strong><br>
          • Site ID and List IDs will be displayed below<br>
          • Copy these values to your <code style="background:#f5f5f5;padding:2px 4px;border-radius:2px">.env</code> file<br>
          • Restart backend to activate SharePoint storage
        </div>
      </div>

      <div id="settings-tenantguard-enhanced-config" style="margin-top:12px;padding:12px;background:var(--color-background-secondary);border-radius:var(--border-radius-md);display:none">
        <div style="font-size:10px;font-weight:600;color:var(--color-text-primary);margin-bottom:8px">✅ Configuration Ready - Add to .env:</div>
        <div style="background:#f5f5f5;padding:8px;border-radius:4px;font-family:monospace;font-size:9px;color:#333;white-space:pre-wrap;word-break:break-all" id="settings-tenantguard-enhanced-env-output"></div>
        <button class="btn btn-sm" id="settings-tenantguard-enhanced-copy" style="margin-top:8px;font-size:9px"><i class="ti ti-copy"></i> Copy to Clipboard</button>
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

      <div style="margin-top:12px;display:flex;gap:8px">
        <button class="btn btn-primary" id="settings-selfservice-init" style="white-space:nowrap"><i class="ti ti-database"></i> Initialize Lists</button>
        <div style="font-size:10px;color:var(--color-text-tertiary);padding:8px">Creates SharePoint lists and fields for Self Service Portal</div>
      </div>
      <div id="settings-selfservice-init-status" style="padding:8px;background:#f0f0f0;border-radius:4px;font-size:10px;color:#666;display:none;margin-top:8px">
        Initialization status will appear here
      </div>
    </div>

    <!-- Task Resolution Approvers -->
    <div class="card mb-3">
      <div style="margin-top:0">
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
  const msgcenterInitBtn = el.querySelector('#settings-msgcenter-init')
  const msgcenterInitStatus = el.querySelector('#settings-msgcenter-init-status')

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

  // Initialize Change Intelligence Lists
  msgcenterInitBtn.addEventListener('click', async () => {
    const siteUrl = sharepointInput.value.trim() || 'root'
    msgcenterInitBtn.disabled = true
    msgcenterInitBtn.innerHTML = '<span class="spinner dark" style="width:14px;height:14px"></span> Initializing...'
    msgcenterInitStatus.style.display = 'block'
    msgcenterInitStatus.textContent = 'Creating lists and fields...'

    try {
      const response = await fetch(`${api}/msgcenter/initialize`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ siteUrl })
      })

      const result = await response.json()

      if (response.ok && result.success) {
        msgcenterInitStatus.style.background = '#e8f5e9'
        msgcenterInitStatus.style.color = '#2e7d32'
        msgcenterInitStatus.textContent = `✓ ${result.message}`
        showToast('Change Intelligence lists created successfully', 'success')
      } else {
        msgcenterInitStatus.style.background = '#ffebee'
        msgcenterInitStatus.style.color = '#c62828'
        msgcenterInitStatus.textContent = `✗ Error: ${result.error || 'Could not initialize lists'}`
        showToast('List initialization failed', 'error')
      }
    } catch (error) {
      msgcenterInitStatus.style.background = '#ffebee'
      msgcenterInitStatus.style.color = '#c62828'
      msgcenterInitStatus.textContent = `✗ Error: ${error.message}`
      showToast('List initialization error', 'error')
    } finally {
      msgcenterInitBtn.disabled = false
      msgcenterInitBtn.innerHTML = '<i class="ti ti-database"></i> Initialize Lists'
    }
  })

  // ---- Service Health Messages Configuration ----
  const servicehealthEnabledToggle = el.querySelector('#settings-servicehealth-enabled-toggle')
  const servicehealthAdminActionsToggle = el.querySelector('#settings-servicehealth-admin-actions-toggle')
  const servicehealthConfigSection = el.querySelector('#settings-servicehealth-config-section')

  const servicehealthInput = el.querySelector('#settings-servicehealth-site')
  const servicehealthTestBtn = el.querySelector('#settings-servicehealth-test')
  const servicehealthStatus = el.querySelector('#settings-servicehealth-status')
  const servicehealthInitBtn = el.querySelector('#settings-servicehealth-init')
  const servicehealthInitStatus = el.querySelector('#settings-servicehealth-init-status')
  const servicehealthConfig = el.querySelector('#settings-servicehealth-config')
  const servicehealthEnvOutput = el.querySelector('#settings-servicehealth-env-output')
  const servicehealthCopyBtn = el.querySelector('#settings-servicehealth-copy')

  // Create Service Health Enabled Toggle
  servicehealthEnabledToggle.appendChild(createToggle(
    s.serviceHealthEnabled !== false,
    (enabled) => {
      state.settings.serviceHealthEnabled = enabled
      saveState()
      servicehealthConfigSection.style.display = enabled ? 'block' : 'none'
      showToast(enabled ? 'Service Health monitoring enabled' : 'Service Health monitoring disabled', 'success')
    }
  ))

  // Create Admin Actions Toggle
  servicehealthAdminActionsToggle.appendChild(createToggle(
    s.serviceHealthAdminActionsEnabled !== false,
    (enabled) => {
      state.settings.serviceHealthAdminActionsEnabled = enabled
      saveState()
      showToast(enabled ? 'Admin actions enabled' : 'Admin actions disabled', 'success')
    }
  ))

  // Show/hide configuration section based on enabled status
  servicehealthConfigSection.style.display = s.serviceHealthEnabled !== false ? 'block' : 'none'

  servicehealthInput.value = s.serviceHealthSiteUrl || 'root'

  servicehealthTestBtn.addEventListener('click', async () => {
    const siteUrl = servicehealthInput.value.trim() || 'root'
    servicehealthTestBtn.disabled = true
    servicehealthTestBtn.innerHTML = '<span class="spinner dark" style="width:14px;height:14px"></span> Testing...'
    servicehealthStatus.style.display = 'block'
    servicehealthStatus.textContent = 'Testing connection...'

    try {
      const response = await fetch(`${api}/servicehealth/validate-sharepoint`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ siteUrl })
      })

      const result = await response.json()

      if (response.ok && result.success) {
        servicehealthStatus.style.background = '#e8f5e9'
        servicehealthStatus.style.color = '#2e7d32'
        servicehealthStatus.textContent = `✓ Connected! Site: ${result.siteName || siteUrl}`
        state.settings.serviceHealthSiteUrl = siteUrl
        state.settings.serviceHealthSiteId = result.siteId
        saveState()
        showToast('SharePoint site configured successfully', 'success')
      } else {
        servicehealthStatus.style.background = '#ffebee'
        servicehealthStatus.style.color = '#c62828'
        servicehealthStatus.textContent = `✗ Error: ${result.error || 'Could not connect to site'}`
        showToast('SharePoint connection failed', 'error')
      }
    } catch (error) {
      servicehealthStatus.style.background = '#ffebee'
      servicehealthStatus.style.color = '#c62828'
      servicehealthStatus.textContent = `✗ Error: ${error.message}`
      showToast('SharePoint connection error', 'error')
    } finally {
      servicehealthTestBtn.disabled = false
      servicehealthTestBtn.innerHTML = '<i class="ti ti-check"></i> Test'
    }
  })

  // Initialize Service Health List
  servicehealthInitBtn.addEventListener('click', async () => {
    const siteUrl = servicehealthInput.value.trim() || 'root'
    servicehealthInitBtn.disabled = true
    servicehealthInitBtn.innerHTML = '<span class="spinner dark" style="width:14px;height:14px"></span> Creating...'
    servicehealthInitStatus.style.display = 'block'
    servicehealthInitStatus.textContent = 'Creating Service Health list and fields...'

    try {
      const response = await fetch(`${api}/servicehealth/initialize`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ siteUrl })
      })

      const result = await response.json()

      if (response.ok && result.success) {
        servicehealthInitStatus.style.background = '#e8f5e9'
        servicehealthInitStatus.style.color = '#2e7d32'

        let statusMsg = `✓ ${result.message}`
        if (result.columnsCreated) {
          statusMsg += `\n📋 Columns created: ${result.columnsCreated} fields`
        }
        servicehealthInitStatus.textContent = statusMsg

        // Display configuration
        if (result.siteId && result.listId) {
          servicehealthConfig.style.display = 'block'
          servicehealthEnvOutput.textContent = `SHAREPOINT_SITE_ID=${result.siteId}
SHAREPOINT_SERVICE_HEALTH_LIST_ID=${result.listId}`

          servicehealthCopyBtn.addEventListener('click', () => {
            navigator.clipboard.writeText(servicehealthEnvOutput.textContent)
            showToast('Configuration copied to clipboard', 'success')
          })

          // Save configuration
          state.settings.serviceHealthSiteUrl = siteUrl
          state.settings.serviceHealthSiteId = result.siteId
          state.settings.serviceHealthListId = result.listId
          saveState()
        }

        showToast('Service Health list created successfully', 'success')
      } else {
        servicehealthInitStatus.style.background = '#ffebee'
        servicehealthInitStatus.style.color = '#c62828'
        servicehealthInitStatus.textContent = `✗ Error: ${result.error || 'Could not create list'}`
        showToast('List creation failed', 'error')
      }
    } catch (error) {
      servicehealthInitStatus.style.background = '#ffebee'
      servicehealthInitStatus.style.color = '#c62828'
      servicehealthInitStatus.textContent = `✗ Error: ${error.message}`
      showToast('List creation error', 'error')
    } finally {
      servicehealthInitBtn.disabled = false
      servicehealthInitBtn.innerHTML = '<i class="ti ti-database"></i> Create Service Health List'
    }
  })

  // ---- Tenant Guard Enhanced SharePoint Configuration ----
  const enhancedInput = el.querySelector('#settings-tenantguard-enhanced-site')
  const enhancedTestBtn = el.querySelector('#settings-tenantguard-enhanced-test')
  const enhancedStatus = el.querySelector('#settings-tenantguard-enhanced-status')
  const enhancedInitBtn = el.querySelector('#settings-tenantguard-enhanced-init')
  const enhancedInitStatus = el.querySelector('#settings-tenantguard-enhanced-init-status')
  const enhancedConfig = el.querySelector('#settings-tenantguard-enhanced-config')
  const enhancedEnvOutput = el.querySelector('#settings-tenantguard-enhanced-env-output')
  const enhancedCopyBtn = el.querySelector('#settings-tenantguard-enhanced-copy')

  enhancedInput.value = s.tenantguardEnhancedSiteUrl || 'root'

  enhancedTestBtn.addEventListener('click', async () => {
    const siteUrl = enhancedInput.value.trim() || 'root'
    enhancedTestBtn.disabled = true
    enhancedTestBtn.innerHTML = '<span class="spinner dark" style="width:14px;height:14px"></span> Testing...'
    enhancedStatus.style.display = 'block'
    enhancedStatus.textContent = 'Testing connection...'

    try {
      const response = await fetch(`${api}/tenantguard/validate-sharepoint`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ siteUrl })
      })

      const result = await response.json()

      if (response.ok && result.success) {
        enhancedStatus.style.background = '#e8f5e9'
        enhancedStatus.style.color = '#2e7d32'
        enhancedStatus.textContent = `✓ Connected! Site: ${result.siteName || siteUrl}`
        state.settings.tenantguardEnhancedSiteUrl = siteUrl
        state.settings.tenantguardEnhancedSiteId = result.siteId
        saveState()
        showToast('Enhanced TenantGuard SharePoint site configured successfully', 'success')
      } else {
        enhancedStatus.style.background = '#ffebee'
        enhancedStatus.style.color = '#c62828'
        enhancedStatus.textContent = `✗ Error: ${result.error || 'Could not connect to site'}`
        showToast('SharePoint connection failed', 'error')
      }
    } catch (error) {
      enhancedStatus.style.background = '#ffebee'
      enhancedStatus.style.color = '#c62828'
      enhancedStatus.textContent = `✗ Error: ${error.message}`
      showToast('SharePoint connection error', 'error')
    } finally {
      enhancedTestBtn.disabled = false
      enhancedTestBtn.innerHTML = '<i class="ti ti-check"></i> Test'
    }
  })

  // Initialize Enhanced TenantGuard Lists
  enhancedInitBtn.addEventListener('click', async () => {
    const siteUrl = enhancedInput.value.trim() || 'root'
    enhancedInitBtn.disabled = true
    enhancedInitBtn.innerHTML = '<span class="spinner dark" style="width:14px;height:14px"></span> Initializing...'
    enhancedInitStatus.style.display = 'block'
    enhancedInitStatus.textContent = 'Creating Enhanced TenantGuard lists and fields...'

    try {
      const response = await fetch(`${api}/tenantguard/initialize-enhanced`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ siteUrl })
      })

      const result = await response.json()

      if (response.ok && result.success) {
        enhancedInitStatus.style.background = '#e8f5e9'
        enhancedInitStatus.style.color = '#2e7d32'

        // Build detailed status message with column info
        let statusMsg = `✓ ${result.message}`
        if (result.columns) {
          const alertsCols = result.columns['TenantGuard-Enhanced-Alerts']
          const corrCols = result.columns['TenantGuard-Enhanced-Correlations']
          const invCols = result.columns['TenantGuard-Enhanced-Investigations']

          const totalCreated = (alertsCols?.created?.length || 0) + (corrCols?.created?.length || 0) + (invCols?.created?.length || 0)
          const totalSkipped = (alertsCols?.skipped?.length || 0) + (corrCols?.skipped?.length || 0) + (invCols?.skipped?.length || 0)

          statusMsg += `\n📋 Columns: ${totalCreated} created, ${totalSkipped} already exist`
          statusMsg += `\n  • Enhanced Alerts: ${alertsCols?.created?.length || 0} fields`
          statusMsg += `\n  • Enhanced Correlations: ${corrCols?.created?.length || 0} fields`
          statusMsg += `\n  • Enhanced Investigations: ${invCols?.created?.length || 0} fields`
        }
        enhancedInitStatus.textContent = statusMsg

        // Display configuration for .env file
        if (result.siteId && result.enhancedAlertsListId && result.enhancedCorrelationsListId && result.enhancedInvestigationsListId) {
          enhancedConfig.style.display = 'block'
          enhancedEnvOutput.textContent = `SHAREPOINT_SITE_ID=${result.siteId}
SHAREPOINT_ENHANCED_ALERTS_LIST_ID=${result.enhancedAlertsListId}
SHAREPOINT_ENHANCED_CORRELATIONS_LIST_ID=${result.enhancedCorrelationsListId}
SHAREPOINT_ENHANCED_INVESTIGATIONS_LIST_ID=${result.enhancedInvestigationsListId}`

          enhancedCopyBtn.addEventListener('click', () => {
            navigator.clipboard.writeText(enhancedEnvOutput.textContent)
            showToast('Configuration copied to clipboard', 'success')
          })
        }

        showToast('Enhanced TenantGuard lists and columns created successfully', 'success')
      } else {
        enhancedInitStatus.style.background = '#ffebee'
        enhancedInitStatus.style.color = '#c62828'
        enhancedInitStatus.textContent = `✗ Error: ${result.error || 'Could not initialize lists'}`
        showToast('List initialization failed', 'error')
      }
    } catch (error) {
      enhancedInitStatus.style.background = '#ffebee'
      enhancedInitStatus.style.color = '#c62828'
      enhancedInitStatus.textContent = `✗ Error: ${error.message}`
      showToast('List initialization error', 'error')
    } finally {
      enhancedInitBtn.disabled = false
      enhancedInitBtn.innerHTML = '<i class="ti ti-database"></i> Initialize Enhanced Lists'
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

  // Initialize Lists button
  const selfServiceInitBtn = el.querySelector('#settings-selfservice-init')
  const selfServiceInitStatus = el.querySelector('#settings-selfservice-init-status')

  selfServiceInitBtn.addEventListener('click', async () => {
    selfServiceInitBtn.disabled = true
    selfServiceInitBtn.innerHTML = '<span class="spinner dark" style="width:14px;height:14px"></span> Initializing...'
    selfServiceInitStatus.style.display = 'block'
    selfServiceInitStatus.textContent = 'Creating lists and fields...'

    try {
      const response = await fetch(`${api}/self-service/initialize`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      })

      const result = await response.json()

      if (response.ok && result.success) {
        selfServiceInitStatus.style.background = '#e8f5e9'
        selfServiceInitStatus.style.color = '#2e7d32'
        selfServiceInitStatus.textContent = `✓ ${result.message}`
        showToast('Lists and fields created successfully', 'success')
      } else {
        selfServiceInitStatus.style.background = '#ffebee'
        selfServiceInitStatus.style.color = '#c62828'
        selfServiceInitStatus.textContent = `✗ Error: ${result.error || 'Could not initialize lists'}`
        showToast('List initialization failed', 'error')
      }
    } catch (error) {
      selfServiceInitStatus.style.background = '#ffebee'
      selfServiceInitStatus.style.color = '#c62828'
      selfServiceInitStatus.textContent = `✗ Error: ${error.message}`
      showToast('List initialization error', 'error')
    } finally {
      selfServiceInitBtn.disabled = false
      selfServiceInitBtn.innerHTML = '<i class="ti ti-database"></i> Initialize Lists'
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

  // ---- License Management Configuration ----
  loadLicenseConfig(el)

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

async function loadLicenseConfig(el) {
  try {
    const response = await fetch(`${api}/admin/license-config`)
    const result = await response.json()

    if (result.success && result.licenseConfig) {
      const wrap = el.querySelector('#license-config-wrap')
      if (!wrap) return

      const licenses = result.licenseConfig
      const licenseTypes = Object.keys(licenses).sort()

      let html = '<div style="display:grid;grid-template-columns:1fr 1fr;gap:12px">'

      licenseTypes.forEach(license => {
        const group = licenses[license]
        const inputId = `license-group-${license.replace(/\s+/g, '-').toLowerCase()}`
        html += `
          <div style="padding:10px;background:var(--color-background-secondary);border-radius:var(--border-radius-sm)">
            <div style="font-size:11px;font-weight:600;margin-bottom:6px;color:var(--color-text-primary)">${license}</div>
            <input type="text" class="form-input" id="${inputId}" value="${group || ''}" placeholder="e.g., e3-users@contoso.com" style="font-size:10px;padding:6px">
            <div style="font-size:9px;color:var(--color-text-tertiary);margin-top:4px">Leave blank for direct assignment</div>
          </div>
        `
      })

      html += '</div>'
      html += '<div style="margin-top:12px;display:flex;gap:8px">'
      html += '<button class="btn btn-primary" id="license-config-save"><i class="ti ti-device-floppy"></i> Save Configuration</button>'
      html += '<button class="btn btn-secondary" id="license-config-reload"><i class="ti ti-reload"></i> Reload</button>'
      html += '</div>'

      wrap.innerHTML = html

      // Event listeners
      el.querySelector('#license-config-save').addEventListener('click', async () => {
        const config = {}
        licenseTypes.forEach(license => {
          const inputId = `license-group-${license.replace(/\s+/g, '-').toLowerCase()}`
          const input = el.querySelector(`#${inputId}`)
          config[license] = input.value.trim() || null
        })

        const btn = el.querySelector('#license-config-save')
        btn.disabled = true
        btn.innerHTML = '<i class="ti ti-loading"></i> Saving...'

        try {
          const response = await fetch(`${api}/admin/license-config`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ licenseConfig: config })
          })
          const result = await response.json()

          if (result.success) {
            showToast('License configuration saved successfully', 'success')
          } else {
            showToast('Failed to save: ' + result.error, 'error')
          }
        } catch (error) {
          showToast('Error saving configuration: ' + error.message, 'error')
        }

        btn.disabled = false
        btn.innerHTML = '<i class="ti ti-device-floppy"></i> Save Configuration'
      })

      el.querySelector('#license-config-reload').addEventListener('click', () => {
        loadLicenseConfig(el)
        showToast('Configuration reloaded', 'info')
      })
    }
  } catch (error) {
    console.error('Failed to load license config:', error)
  }
}
