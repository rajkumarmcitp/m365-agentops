/**
 * User Investigation Page
 * Comprehensive user activity analysis and risk assessment
 */

import {
  getUserList,
  getUserInvestigation,
  getSignInLogs,
  getRiskDetections,
  getRegisteredDevices,
  getManagedDevices,
  getOAuthConsent,
  getSecurityAlerts,
  getAccountChanges,
  getUserProfile,
  getUserGroups,
  getDirectoryRoles,
  getAuthenticationMethods,
  getMailboxSettings,
  getRiskyUser,
  getEnterpriseApps
} from '../lib/user-investigation-client.js'
import { showToast } from '../components/toast.js'
import { isDemoAccount } from '../lib/demo-account.js'
import { skeletonLoader } from '../lib/skeleton-loader.js'
import { renderInvestigationAnalysis, showAnalysisLoading } from '../components/investigation-analysis.js'

export function initUserInvestigation() {
  const el = document.getElementById('page-user-investigation')
  if (!el) return

  if (isDemoAccount()) {
    renderDemoUserInvestigation(el)
    return
  }

  // Show skeleton immediately
  el.innerHTML = `
    <div>
      ${skeletonLoader.renderPageHeader('User Investigation', 'Comprehensive user activity analysis and risk assessment', false)}
      ${skeletonLoader.renderMetricsRowSkeleton(4)}
      ${skeletonLoader.renderCardGridSkeleton(1, 2)}
      ${skeletonLoader.renderTableSkeleton(7, 6)}
    </div>
  `

  // Load data and render
  renderUserInvestigation(el)
}

function renderDemoUserInvestigation(el) {
  const demoUsers = [
    { id: '1', displayName: 'Sarah Kim', mail: 'sarah.kim@contoso.com', riskScore: 78 },
    { id: '2', displayName: 'John Smith', mail: 'john.smith@contoso.com', riskScore: 42 },
    { id: '3', displayName: 'Maya Patel', mail: 'maya.patel@contoso.com', riskScore: 15 },
  ]

  const selectedUserDemo = demoUsers[0]

  const demoAppAccess = [
    { name: 'Microsoft Teams', lastUsed: '2026-06-01 14:32', accessCount: 47, riskLevel: 'LOW' },
    { name: 'SharePoint Online', lastUsed: '2026-06-01 13:15', accessCount: 23, riskLevel: 'LOW' },
    { name: 'Exchange Online', lastUsed: '2026-06-01 10:45', accessCount: 156, riskLevel: 'MEDIUM' },
    { name: 'OneDrive', lastUsed: '2026-05-31 16:20', accessCount: 8, riskLevel: 'LOW' },
  ]

  const demoSignInLogs = [
    { timestamp: '2026-06-01 14:32', location: 'Seattle, WA', app: 'Teams', status: 'Success', risk: 'Low' },
    { timestamp: '2026-06-01 13:45', location: 'Seattle, WA', app: 'OWA', status: 'Success', risk: 'Low' },
    { timestamp: '2026-06-01 10:20', location: 'Seattle, WA', app: 'SharePoint', status: 'Success', risk: 'Low' },
    { timestamp: '2026-05-31 18:30', location: 'Unknown', app: 'Exchange', status: 'MFA Challenge', risk: 'Medium' },
  ]

  const demoAuditLogs = [
    { action: 'User added to group', object: 'Engineering Team', timestamp: '2026-06-01 10:15', status: 'Success' },
    { action: 'Mailbox forwarding rule created', object: 'sarah.kim@contoso.com', timestamp: '2026-05-31 15:45', status: 'Success' },
    { action: 'SharePoint site access granted', object: 'Compliance Docs', timestamp: '2026-05-30 14:20', status: 'Success' },
  ]

  const demoActionsOnOthers = [
    { action: 'Added john.smith to Executives group', timestamp: '2026-06-01 09:30', riskLevel: 'Medium' },
    { action: 'Created forwarding rule to external domain', timestamp: '2026-05-28 16:15', riskLevel: 'High' },
  ]

  const demoTimeline = [
    { date: '2026-06-01', event: 'Abnormal sign-in location detected', severity: 'Medium' },
    { date: '2026-05-31', event: 'MFA bypass attempted', severity: 'High' },
    { date: '2026-05-28', event: 'Email forwarding rule created to external domain', severity: 'High' },
  ]

  el.innerHTML = `
    <div class="page-header">
      <div class="page-title"><i class="ti ti-shield-check"></i> User Investigation</div>
      <div class="page-subtitle">Comprehensive user activity analysis and risk assessment</div>
    </div>

    <div style="display:flex;align-items:center;gap:8px;padding:8px 12px;background:var(--color-background-primary);border:0.5px solid var(--color-border-secondary);border-radius:var(--border-radius-md);margin-bottom:16px;font-size:10px;color:var(--color-text-tertiary)">
      <span class="status-dot active pulse"></span>
      <span><strong style="color:var(--color-text-secondary)">Demo Mode</strong> · Showing sample user investigation data</span>
    </div>

    <!-- Demo User Selection -->
    <div class="card mb-3">
      <div class="card-title mb-3">Demo User Investigation</div>
      <div style="display:flex;gap:12px;flex-wrap:wrap;padding:12px 0">
        ${demoUsers.map(u => `
          <div class="demo-user-card" data-user-id="${u.id}" style="padding:12px;background:var(--color-background-secondary);border:0.5px solid var(--color-border-secondary);border-radius:var(--border-radius-md);cursor:pointer;flex:1;min-width:200px;${u.id === selectedUserDemo.id ? 'border-color:var(--clr-info-text);background:var(--clr-info-bg)' : ''}">
            <div style="font-weight:600;margin-bottom:4px">${u.displayName}</div>
            <div style="font-size:10px;color:var(--color-text-secondary);margin-bottom:8px">${u.mail}</div>
            <div style="display:flex;align-items:center;gap:6px">
              <div style="width:40px;height:8px;background:var(--color-background-tertiary);border-radius:4px;overflow:hidden">
                <div style="height:100%;width:${u.riskScore}%;background:${u.riskScore > 60 ? 'var(--clr-danger-text)' : u.riskScore > 30 ? 'var(--clr-warning-text)' : 'var(--clr-success-text)'}"></div>
              </div>
              <span style="font-size:10px;font-weight:600;color:${u.riskScore > 60 ? 'var(--clr-danger-text)' : u.riskScore > 30 ? 'var(--clr-warning-text)' : 'var(--clr-success-text)'}">${u.riskScore} risk</span>
            </div>
          </div>
        `).join('')}
      </div>
    </div>

    <!-- User Summary KPIs -->
    <div class="kpi-row mb-3">
      <div class="kpi-tile">
        <div class="kpi-value danger">${selectedUserDemo.riskScore}</div>
        <div class="kpi-label">Risk Score</div>
      </div>
      <div class="kpi-tile">
        <div class="kpi-value info">${demoAppAccess.length}</div>
        <div class="kpi-label">Apps Accessed</div>
      </div>
      <div class="kpi-tile">
        <div class="kpi-value warning">${demoSignInLogs.length}</div>
        <div class="kpi-label">Recent Sign-ins</div>
      </div>
      <div class="kpi-tile">
        <div class="kpi-value danger">${demoActionsOnOthers.length}</div>
        <div class="kpi-label">Risky Actions</div>
      </div>
    </div>

    <!-- Application Access -->
    <div class="card mb-3">
      <div class="card-title mb-3"><i class="ti ti-apps"></i> Application Access (Last 7 days)</div>
      <table style="width:100%;border-collapse:collapse;font-size:11px">
        <thead style="background:var(--color-background-secondary)">
          <tr>
            <th style="padding:10px 12px;text-align:left;font-weight:600">Application</th>
            <th style="padding:10px 12px;text-align:left;font-weight:600">Last Used</th>
            <th style="padding:10px 12px;text-align:left;font-weight:600">Access Count</th>
            <th style="padding:10px 12px;text-align:left;font-weight:600">Risk</th>
          </tr>
        </thead>
        <tbody>
          ${demoAppAccess.map(app => `
            <tr style="border-bottom:0.5px solid var(--color-border-tertiary)">
              <td style="padding:10px 12px;font-weight:600">${app.name}</td>
              <td style="padding:10px 12px;font-size:10px;color:var(--color-text-secondary)">${app.lastUsed}</td>
              <td style="padding:10px 12px">${app.accessCount}</td>
              <td style="padding:10px 12px"><span class="badge ${app.riskLevel === 'LOW' ? 'success' : 'warning'}">${app.riskLevel}</span></td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>

    <!-- Sign-in Activity -->
    <div class="card mb-3">
      <div class="card-title mb-3"><i class="ti ti-login"></i> Recent Sign-in Activity</div>
      <table style="width:100%;border-collapse:collapse;font-size:11px">
        <thead style="background:var(--color-background-secondary)">
          <tr>
            <th style="padding:10px 12px;text-align:left;font-weight:600">Timestamp</th>
            <th style="padding:10px 12px;text-align:left;font-weight:600">Location</th>
            <th style="padding:10px 12px;text-align:left;font-weight:600">Application</th>
            <th style="padding:10px 12px;text-align:left;font-weight:600">Status</th>
            <th style="padding:10px 12px;text-align:left;font-weight:600">Risk</th>
          </tr>
        </thead>
        <tbody>
          ${demoSignInLogs.map(log => `
            <tr style="border-bottom:0.5px solid var(--color-border-tertiary)">
              <td style="padding:10px 12px;font-size:10px">${log.timestamp}</td>
              <td style="padding:10px 12px;font-size:10px;color:var(--color-text-secondary)">${log.location}</td>
              <td style="padding:10px 12px">${log.app}</td>
              <td style="padding:10px 12px"><span class="badge ${log.status === 'Success' ? 'success' : 'warning'}">${log.status}</span></td>
              <td style="padding:10px 12px"><span class="badge ${log.risk === 'Low' ? 'success' : 'warning'}">${log.risk}</span></td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>

    <!-- Audit Actions -->
    <div class="card mb-3">
      <div class="card-title mb-3"><i class="ti ti-clipboard-list"></i> Audit Actions</div>
      <div style="display:flex;flex-direction:column;gap:12px;padding:12px 0">
        ${demoAuditLogs.map(log => `
          <div style="padding:12px;background:var(--color-background-secondary);border-radius:var(--border-radius-md);border-left:3px solid var(--clr-info-text)">
            <div style="display:flex;justify-content:space-between;align-items:start">
              <div>
                <div style="font-weight:600;margin-bottom:4px">${log.action}</div>
                <div style="font-size:10px;color:var(--color-text-secondary)">${log.object}</div>
              </div>
              <span class="badge success">${log.status}</span>
            </div>
            <div style="font-size:10px;color:var(--color-text-tertiary);margin-top:8px">${log.timestamp}</div>
          </div>
        `).join('')}
      </div>
    </div>

    <!-- Actions on Other Accounts -->
    <div class="card mb-3">
      <div class="card-title mb-3"><i class="ti ti-users-group"></i> Actions on Other Accounts</div>
      <div style="display:flex;flex-direction:column;gap:12px;padding:12px 0">
        ${demoActionsOnOthers.map(act => `
          <div style="padding:12px;background:var(--color-background-secondary);border-radius:var(--border-radius-md);border-left:3px solid ${act.riskLevel === 'High' ? 'var(--clr-danger-text)' : 'var(--clr-warning-text)'}">
            <div style="display:flex;justify-content:space-between;align-items:start">
              <div style="font-weight:600">${act.action}</div>
              <span class="badge ${act.riskLevel === 'High' ? 'danger' : 'warning'}">${act.riskLevel} Risk</span>
            </div>
            <div style="font-size:10px;color:var(--color-text-tertiary);margin-top:8px">${act.timestamp}</div>
          </div>
        `).join('')}
      </div>
    </div>

    <!-- Risk Timeline -->
    <div class="card mb-3">
      <div class="card-title mb-3"><i class="ti ti-timeline"></i> Risk Timeline</div>
      <div style="display:flex;flex-direction:column;gap:8px;padding:12px 0">
        ${demoTimeline.map(item => `
          <div style="display:flex;gap:12px;align-items:start">
            <div style="flex-shrink:0;margin-top:4px;width:12px;height:12px;border-radius:50%;background:${item.severity === 'High' ? 'var(--clr-danger-text)' : 'var(--clr-warning-text)'}"></div>
            <div style="flex:1">
              <div style="font-weight:600;font-size:11px">${item.event}</div>
              <div style="font-size:10px;color:var(--color-text-tertiary);margin-top:2px">${item.date}</div>
            </div>
            <span class="badge ${item.severity === 'High' ? 'danger' : 'warning'}">${item.severity}</span>
          </div>
        `).join('')}
      </div>
    </div>
  `

  // User card selection
  el.querySelectorAll('.demo-user-card').forEach(card => {
    card.addEventListener('click', () => {
      el.querySelectorAll('.demo-user-card').forEach(c => {
        c.style.borderColor = 'var(--color-border-secondary)'
        c.style.background = 'var(--color-background-secondary)'
      })
      card.style.borderColor = 'var(--clr-info-text)'
      card.style.background = 'var(--clr-info-bg)'
    })
  })
}

function renderUserInvestigation(el) {
  el.innerHTML = `
    <div class="page-header">
      <div class="page-title"><i class="ti ti-shield-check"></i> User Investigation</div>
      <div class="page-subtitle">Comprehensive user activity analysis and risk assessment</div>
    </div>

    <!-- Filters -->
    <div class="card mb-3">
      <div class="card-title mb-3">Filters</div>
      <div style="display:grid;grid-template-columns:1fr 1fr 1fr 150px;gap:12px;align-items:end">
        <div class="form-group" style="margin-bottom:0">
          <label class="form-label">Select User</label>
          <input type="text" id="user-search" class="form-input" placeholder="Search by name or email..." autocomplete="off">
          <div id="user-dropdown" class="user-dropdown" style="display:none;position:absolute;background:white;border:1px solid var(--color-border);border-radius:6px;margin-top:2px;max-height:300px;overflow-y:auto;width:100%;z-index:1000;box-shadow:0 4px 12px rgba(0,0,0,0.1)"></div>
        </div>

        <div class="form-group" style="margin-bottom:0">
          <label class="form-label">Days Back</label>
          <select id="days-back" class="form-select">
            <option value="7">Last 7 days</option>
            <option value="14">Last 14 days</option>
            <option value="30">Last 30 days</option>
          </select>
        </div>

        <div class="form-group" style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:0">
          <div>
            <label class="form-label">Start Date</label>
            <input type="date" id="custom-start-date" class="form-input">
          </div>
          <div>
            <label class="form-label">End Date</label>
            <input type="date" id="custom-end-date" class="form-input">
          </div>
        </div>

        <button id="investigate-btn" class="btn btn-primary" disabled>
          <i class="ti ti-search"></i> Investigate
        </button>
      </div>
    </div>

    <!-- Loading state -->
    <div id="loading-state" style="display:none">
      <div class="card mb-3">
        <div style="display:flex;align-items:center;gap:12px;padding:20px">
          <span class="spinner"></span>
          <span>Loading user investigation data...</span>
        </div>
      </div>
    </div>

    <!-- Investigation results -->
    <div id="investigation-results" style="display:none">
      <!-- 1. EXECUTIVE VERDICT (Top Priority) -->
      <div id="ai-analysis-section" style="margin-bottom:24px;border:2px solid var(--color-border);border-radius:8px;padding:20px;background:var(--color-bg-secondary)"></div>

      <!-- 2. INVESTIGATION SCORECARD -->
      <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(180px,1fr));gap:12px;margin-bottom:24px">
        <div style="background:var(--color-bg-primary);border:1px solid var(--color-border);border-radius:6px;padding:12px">
          <div style="font-size:10px;color:var(--color-text-secondary);text-transform:uppercase;margin-bottom:6px">Overall Risk</div>
          <div style="font-size:20px;font-weight:700;color:var(--color-primary)" id="scorecard-risk-score">45/100</div>
        </div>
        <div style="background:var(--color-bg-primary);border:1px solid var(--color-border);border-radius:6px;padding:12px">
          <div style="font-size:10px;color:var(--color-text-secondary);text-transform:uppercase;margin-bottom:6px">Successful Sign-ins</div>
          <div style="font-size:20px;font-weight:700;color:var(--color-info)" id="scorecard-signin-success">20</div>
        </div>
        <div style="background:var(--color-bg-primary);border:1px solid var(--color-border);border-radius:6px;padding:12px">
          <div style="font-size:10px;color:var(--color-text-secondary);text-transform:uppercase;margin-bottom:6px">Failed Sign-ins</div>
          <div style="font-size:20px;font-weight:700;color:var(--color-warning)" id="scorecard-signin-failed">1</div>
        </div>
        <div style="background:var(--color-bg-primary);border:1px solid var(--color-border);border-radius:6px;padding:12px">
          <div style="font-size:10px;color:var(--color-text-secondary);text-transform:uppercase;margin-bottom:6px">Admin Changes</div>
          <div style="font-size:20px;font-weight:700;color:var(--color-warning)" id="scorecard-admin-changes">2</div>
        </div>
        <div style="background:var(--color-bg-primary);border:1px solid var(--color-border);border-radius:6px;padding:12px">
          <div style="font-size:10px;color:var(--color-text-secondary);text-transform:uppercase;margin-bottom:6px">OAuth Consents</div>
          <div style="font-size:20px;font-weight:700;color:var(--color-info)" id="scorecard-oauth">3</div>
        </div>
        <div style="background:var(--color-bg-primary);border:1px solid var(--color-border);border-radius:6px;padding:12px">
          <div style="font-size:10px;color:var(--color-text-secondary);text-transform:uppercase;margin-bottom:6px">Risk Detections</div>
          <div style="font-size:20px;font-weight:700;color:var(--color-danger)" id="scorecard-risk-detections">0</div>
        </div>
      </div>

      <!-- 3. INVESTIGATION TABS -->
      <div style="border-bottom:1px solid var(--color-border);margin-bottom:20px">
        <div id="investigation-tabs" style="display:flex;gap:0;flex-wrap:wrap;border-bottom:2px solid var(--color-border)">
          <button class="investigation-tab active" data-tab="overview" style="padding:12px 20px;font-size:12px;font-weight:600;border:none;background:transparent;cursor:pointer;border-bottom:2px solid var(--color-primary);color:var(--color-primary)">
            <i class="ti ti-layout-list" style="margin-right:6px"></i>Overview
          </button>
          <button class="investigation-tab" data-tab="timeline" style="padding:12px 20px;font-size:12px;font-weight:600;border:none;background:transparent;cursor:pointer;color:var(--color-text-secondary)">
            <i class="ti ti-timeline" style="margin-right:6px"></i>Timeline
          </button>
          <button class="investigation-tab" data-tab="identity" style="padding:12px 20px;font-size:12px;font-weight:600;border:none;background:transparent;cursor:pointer;color:var(--color-text-secondary)">
            <i class="ti ti-user" style="margin-right:6px"></i>Identity
          </button>
          <button class="investigation-tab" data-tab="permissions" style="padding:12px 20px;font-size:12px;font-weight:600;border:none;background:transparent;cursor:pointer;color:var(--color-text-secondary)">
            <i class="ti ti-shield-lock" style="margin-right:6px"></i>Permissions
          </button>
          <button class="investigation-tab" data-tab="devices" style="padding:12px 20px;font-size:12px;font-weight:600;border:none;background:transparent;cursor:pointer;color:var(--color-text-secondary)">
            <i class="ti ti-device-laptop" style="margin-right:6px"></i>Devices
          </button>
          <button class="investigation-tab" data-tab="applications" style="padding:12px 20px;font-size:12px;font-weight:600;border:none;background:transparent;cursor:pointer;color:var(--color-text-secondary)">
            <i class="ti ti-apps" style="margin-right:6px"></i>Applications
          </button>
          <button class="investigation-tab" data-tab="admin-changes" style="padding:12px 20px;font-size:12px;font-weight:600;border:none;background:transparent;cursor:pointer;color:var(--color-text-secondary)">
            <i class="ti ti-user-edit" style="margin-right:6px"></i>Admin Changes
          </button>
          <button class="investigation-tab" data-tab="raw-events" style="padding:12px 20px;font-size:12px;font-weight:600;border:none;background:transparent;cursor:pointer;color:var(--color-text-secondary)">
            <i class="ti ti-list-details" style="margin-right:6px"></i>Raw Events
          </button>
        </div>
      </div>

      <!-- TAB: OVERVIEW -->
      <div class="investigation-tab-content active" data-tab="overview">
        <!-- AI Summary Narrative -->
        <div class="card mb-3">
          <div class="card-title mb-3" style="font-size:12px"><i class="ti ti-brain"></i> Investigation Summary</div>
          <div id="ai-narrative-section" style="font-size:11px;line-height:1.6;color:var(--color-text-primary)"></div>
        </div>

        <!-- Findings by Severity -->
        <div class="card mb-3">
          <div class="card-title mb-3" style="font-size:12px"><i class="ti ti-list-check"></i> Findings</div>
          <div id="findings-section" style="font-size:11px"></div>
        </div>

        <!-- Recommended Actions -->
        <div class="card mb-3">
          <div class="card-title mb-3" style="font-size:12px"><i class="ti ti-bulb"></i> Recommended Actions</div>
          <div id="recommendations-section" style="font-size:11px"></div>
        </div>
      </div>

      <!-- TAB: TIMELINE (Most Important for Analysts) -->
      <div class="investigation-tab-content" data-tab="timeline" style="display:none">
        <div class="card mb-3">
          <div class="card-title mb-3" style="font-size:12px"><i class="ti ti-timeline"></i> Investigation Timeline</div>
          <div id="timeline-section" style="font-size:11px"></div>
        </div>
      </div>

      <!-- TAB: IDENTITY -->
      <div class="investigation-tab-content" data-tab="identity" style="display:none">
        <!-- Account Changes -->
        <div class="card mb-3">
          <div class="card-title mb-3" style="font-size:12px"><i class="ti ti-clipboard-list"></i> Account Changes</div>
          <div id="account-changes-section" style="font-size:11px"></div>
        </div>

        <!-- Risk Detections -->
        <div class="card mb-3">
          <div class="card-title mb-3" style="font-size:12px"><i class="ti ti-alert-triangle"></i> Risk Detections</div>
          <div id="risk-detections-section" style="font-size:11px"></div>
        </div>

        <!-- Sign-in Activity -->
        <div class="card mb-3">
          <div class="card-title mb-3" style="font-size:12px"><i class="ti ti-login"></i> Sign-in Activity</div>
          <div id="signin-logs-section" style="font-size:11px"></div>
        </div>

        <!-- Security Alerts -->
        <div class="card mb-3">
          <div class="card-title mb-3" style="font-size:12px"><i class="ti ti-bell-alert"></i> Security Alerts</div>
          <div id="security-alerts-section" style="font-size:11px"></div>
        </div>
      </div>

      <!-- TAB: PERMISSIONS -->
      <div class="investigation-tab-content" data-tab="permissions" style="display:none">
        <!-- Directory Roles -->
        <div class="card mb-3">
          <div class="card-title mb-3" style="font-size:12px"><i class="ti ti-crown"></i> Directory Roles</div>
          <div id="directory-roles-section" style="font-size:11px"></div>
        </div>

        <!-- User Groups -->
        <div class="card mb-3">
          <div class="card-title mb-3" style="font-size:12px"><i class="ti ti-users-group"></i> Group Memberships</div>
          <div id="user-groups-section" style="font-size:11px"></div>
        </div>

        <!-- OAuth Permissions -->
        <div class="card mb-3">
          <div class="card-title mb-3" style="font-size:12px"><i class="ti ti-key"></i> OAuth Permissions Granted</div>
          <div id="oauth-consent-section" style="font-size:11px"></div>
        </div>

        <!-- Authentication Methods -->
        <div class="card mb-3">
          <div class="card-title mb-3" style="font-size:12px"><i class="ti ti-key"></i> Authentication Methods</div>
          <div id="authentication-methods-section" style="font-size:11px"></div>
        </div>
      </div>

      <!-- TAB: DEVICES -->
      <div class="investigation-tab-content" data-tab="devices" style="display:none">
        <div class="card mb-3">
          <div class="card-title mb-3" style="font-size:12px"><i class="ti ti-device-laptop"></i> Devices Used</div>
          <div id="devices-section" style="font-size:11px"></div>
        </div>
      </div>

      <!-- TAB: APPLICATIONS -->
      <div class="investigation-tab-content" data-tab="applications" style="display:none">
        <div class="card mb-3">
          <div class="card-title mb-3"><i class="ti ti-apps"></i> Application Access</div>
          <div id="applications-section" style="font-size:11px"></div>
        </div>

        <div class="card mb-3">
          <div class="card-title mb-3" style="font-size:12px"><i class="ti ti-app-window"></i> Enterprise Applications Owned</div>
          <div id="enterprise-apps-section" style="font-size:11px"></div>
        </div>
      </div>

      <!-- TAB: ADMIN CHANGES -->
      <div class="investigation-tab-content" data-tab="admin-changes" style="display:none">
        <!-- Account Changes (Structured Table) -->
        <div class="card mb-3">
          <div class="card-title mb-3" style="font-size:12px"><i class="ti ti-user-edit"></i> Administrative Changes</div>
          <div id="account-changes-section" style="font-size:11px"></div>
        </div>

        <!-- Actions on Other Accounts -->
        <div class="card mb-3">
          <div class="card-title mb-3"><i class="ti ti-users-group"></i> Actions on Other Accounts</div>
          <div id="other-accounts-section" style="font-size:11px"></div>
        </div>

        <!-- Mailbox Settings -->
        <div class="card mb-3">
          <div class="card-title mb-3" style="font-size:12px"><i class="ti ti-mail"></i> Mailbox Settings</div>
          <div id="mailbox-settings-section" style="font-size:11px"></div>
        </div>
      </div>

      <!-- TAB: RAW EVENTS -->
      <div class="investigation-tab-content" data-tab="raw-events" style="display:none">
        <!-- Audit Actions -->
        <div class="card mb-3">
          <div class="card-title mb-3"><i class="ti ti-clipboard-list"></i> All Audit Events</div>
          <div id="audit-logs-section" style="font-size:11px"></div>
        </div>

        <!-- Risky User Status -->
        <div class="card mb-3">
          <div class="card-title mb-3" style="font-size:12px"><i class="ti ti-alert-triangle"></i> Risky User Status</div>
          <div id="risky-user-section" style="font-size:11px"></div>
        </div>
      </div>

      <!-- Hidden: User Summary (for rendering but not displayed) -->
      <div id="user-summary" style="display:none"></div>
    </div>

    <!-- Empty state -->
    <div id="empty-state" style="text-align:center;padding:40px;color:var(--color-text-tertiary)">
      <i class="ti ti-inbox" style="font-size:48px;margin-bottom:12px;opacity:0.5"></i>
      <p>Select a user and click "Investigate" to see their activity</p>
    </div>
  `

  let allUsers = []
  let selectedUserId = null
  const userSearchInput = el.querySelector('#user-search')
  const userDropdown = el.querySelector('#user-dropdown')
  const daysBackSelect = el.querySelector('#days-back')
  const customStartDateInput = el.querySelector('#custom-start-date')
  const customEndDateInput = el.querySelector('#custom-end-date')
  const investigateBtn = el.querySelector('#investigate-btn')

  // Load users on init
  loadUsers()

  async function loadUsers() {
    try {
      const result = await getUserList()
      allUsers = result.data || []
    } catch (error) {
      console.error('Failed to load users:', error)
      showToast('Failed to load user list', 'error')
    }
  }

  // User search and selection
  userSearchInput.addEventListener('input', (e) => {
    const search = e.target.value.toLowerCase()
    if (!search) {
      userDropdown.style.display = 'none'
      return
    }

    const filtered = allUsers.filter(u =>
      u.displayName.toLowerCase().includes(search) ||
      u.mail.toLowerCase().includes(search)
    )

    userDropdown.innerHTML = filtered.map(u => `
      <div class="user-dropdown-item" data-id="${u.id}" style="padding:10px 12px;border-bottom:1px solid var(--color-border);cursor:pointer;font-size:11px">
        <div style="font-weight:500">${u.displayName}</div>
        <div style="color:var(--color-text-tertiary);margin-top:2px">${u.mail}</div>
      </div>
    `).join('')

    filtered.forEach(u => {
      const item = userDropdown.querySelector(`[data-id="${u.id}"]`)
      item?.addEventListener('click', () => {
        selectedUserId = u.id
        userSearchInput.value = u.displayName
        userDropdown.style.display = 'none'
        investigateBtn.disabled = false
      })
    })

    userDropdown.style.display = filtered.length > 0 ? 'block' : 'none'
  })

  // Investigate button
  investigateBtn.addEventListener('click', async () => {
    if (!selectedUserId) {
      showToast('Please select a user', 'warning')
      return
    }

    const selectedUser = allUsers.find(u => u.id === selectedUserId)

    // Check if custom date range is set
    const customStartDate = customStartDateInput.value
    const customEndDate = customEndDateInput.value

    let dateStr, endDateStr

    if (customStartDate && customEndDate) {
      // Use custom date range
      dateStr = customStartDate
      endDateStr = customEndDate
    } else if (customStartDate || customEndDate) {
      // If only one date is set, show error
      showToast('Please enter both start and end dates for custom range', 'warning')
      return
    } else {
      // Use days back dropdown
      const daysBack = parseInt(daysBackSelect.value)
      const endDate = new Date()
      const startDate = new Date(endDate)
      startDate.setDate(startDate.getDate() - daysBack)

      dateStr = startDate.toISOString().split('T')[0]
      endDateStr = endDate.toISOString().split('T')[0]
    }

    showLoading(el, true)

    try {
      // Fetch all data in parallel
      const [legacyResult, signInResult, riskResult, regDevicesResult, managedDevicesResult, oauthResult, alertsResult, accountChangesResult, profileResult, groupsResult, rolesResult, authMethodsResult, mailboxResult, riskyUserResult, appsResult] = await Promise.all([
        getUserInvestigation(selectedUserId, dateStr, endDateStr),
        getSignInLogs(selectedUserId, selectedUser.mail, dateStr, endDateStr),
        getRiskDetections(selectedUserId, dateStr, endDateStr),
        getRegisteredDevices(selectedUserId),
        getManagedDevices(selectedUserId, selectedUser.mail),
        getOAuthConsent(selectedUserId),
        getSecurityAlerts(selectedUserId, selectedUser.mail, dateStr, endDateStr),
        getAccountChanges(selectedUserId, dateStr, endDateStr),
        getUserProfile(selectedUserId),
        getUserGroups(selectedUserId),
        getDirectoryRoles(selectedUserId),
        getAuthenticationMethods(selectedUserId),
        getMailboxSettings(selectedUserId),
        getRiskyUser(selectedUserId),
        getEnterpriseApps(selectedUserId)
      ])

      const investigationData = {
        user: legacyResult.data?.user || selectedUser,
        applicationAccess: legacyResult.data?.applicationAccess || [],
        signInLogs: legacyResult.data?.signInLogs || [],
        auditLogs: legacyResult.data?.auditLogs || [],
        actionsOnOtherAccounts: legacyResult.data?.actionsOnOtherAccounts || [],
        timeline: legacyResult.data?.timeline || [],
        signInActivity: signInResult.data || [],
        riskDetections: riskResult.data || [],
        registeredDevices: regDevicesResult.data || [],
        managedDevices: managedDevicesResult.data || [],
        oauthConsent: oauthResult.data || [],
        securityAlerts: alertsResult.data || [],
        accountChanges: accountChangesResult.data || [],
        userProfile: profileResult.data || {},
        userGroups: groupsResult.data || [],
        directoryRoles: rolesResult.data || [],
        authenticationMethods: authMethodsResult.data || [],
        mailboxSettings: mailboxResult.data || {},
        riskyUser: riskyUserResult.data || {},
        enterpriseApps: appsResult.data || []
      }

      renderInvestigation(el, investigationData)
      showLoading(el, false)
    } catch (error) {
      console.error('Investigation error:', error)
      showToast('Failed to load investigation data', 'error')
      showLoading(el, false)
    }
  })

  // Close dropdown on click outside
  document.addEventListener('click', (e) => {
    if (!userSearchInput.contains(e.target) && !userDropdown.contains(e.target)) {
      userDropdown.style.display = 'none'
    }
  })
}

function showLoading(el, show) {
  el.querySelector('#loading-state').style.display = show ? 'block' : 'none'
  el.querySelector('#investigation-results').style.display = show ? 'none' : 'block'
  el.querySelector('#empty-state').style.display = show ? 'none' : 'none'
}

function renderInvestigation(el, data) {
  // Expose to global scope for debugging
  window.investigationData = data

  console.log('📊 Investigation Data Loaded:', {
    accountChangesCount: (data.accountChanges || []).length,
    accountChanges: data.accountChanges,
    signInActivityCount: (data.signInActivity || []).length,
    riskDetectionsCount: (data.riskDetections || []).length,
    oauthConsentCount: (data.oauthConsent || []).length,
    directoryRolesCount: (data.directoryRoles || []).length
  })

  const {
    user,
    applicationAccess,
    signInLogs,
    auditLogs,
    actionsOnOtherAccounts,
    timeline,
    signInActivity,
    riskDetections,
    registeredDevices,
    managedDevices,
    oauthConsent,
    securityAlerts,
    accountChanges,
    userProfile,
    userGroups,
    directoryRoles,
    authenticationMethods,
    mailboxSettings,
    riskyUser,
    enterpriseApps
  } = data

  // User Summary
  const summaryHtml = `
    <div class="info-card">
      <div style="color:var(--color-text-tertiary);font-size:10px;text-transform:uppercase;letter-spacing:0.5px;margin-bottom:6px">User</div>
      <div style="font-weight:600;font-size:14px">${user.displayName}</div>
      <div style="color:var(--color-text-secondary);font-size:11px;margin-top:4px">${user.mail}</div>
    </div>

    <div class="info-card">
      <div style="color:var(--color-text-tertiary);font-size:10px;text-transform:uppercase;letter-spacing:0.5px;margin-bottom:6px">Risk Score</div>
      <div style="display:flex;align-items:center;gap:8px">
        <div style="font-weight:600;font-size:20px">${user.riskScore || 0}</div>
        <div style="padding:2px 6px;border-radius:3px;font-size:9px;font-weight:600;background:${getRiskColor(user.riskLevel || 'LOW').bg};color:${getRiskColor(user.riskLevel || 'LOW').text}">${user.riskLevel || 'LOW'}</div>
      </div>
    </div>

    <div class="info-card">
      <div style="color:var(--color-text-tertiary);font-size:10px;text-transform:uppercase;letter-spacing:0.5px;margin-bottom:6px">Department</div>
      <div style="font-weight:500;font-size:13px">${user.department || 'N/A'}</div>
      <div style="color:var(--color-text-secondary);font-size:11px;margin-top:4px">${user.jobTitle || 'No title'}</div>
    </div>

    <div class="info-card">
      <div style="color:var(--color-text-tertiary);font-size:10px;text-transform:uppercase;letter-spacing:0.5px;margin-bottom:6px">Last Active</div>
      <div style="font-weight:500;font-size:13px">${formatTime(user.lastActive || new Date().toISOString())}</div>
      <div style="color:var(--color-text-secondary);font-size:11px;margin-top:4px">${formatDate(user.lastActive || new Date().toISOString())}</div>
    </div>
  `

  el.querySelector('#user-summary').innerHTML = summaryHtml

  // Render new Category 1 sections
  renderSignInActivity(el, signInActivity)
  renderRiskDetections(el, riskDetections)
  renderDevicesUsed(el, registeredDevices, managedDevices)
  renderOAuthPermissions(el, oauthConsent)
  renderSecurityAlerts(el, securityAlerts)

  // Render Category 2 section
  renderAccountChanges(el, accountChanges)

  // Render Identity & Access Information sections
  renderUserGroups(el, userGroups)
  renderDirectoryRoles(el, directoryRoles)
  renderAuthenticationMethods(el, authenticationMethods)
  renderMailboxSettings(el, mailboxSettings)
  renderRiskyUser(el, riskyUser)
  renderEnterpriseApps(el, enterpriseApps)

  // Application Access - Grouped and sorted
  const appHtml = `
    <div style="overflow-x:auto">
      <table class="data-table">
        <thead>
          <tr>
            <th>Application</th>
            <th>Last Accessed</th>
            <th>Success</th>
            <th>Failures</th>
            <th>Status</th>
            <th>Locations</th>
          </tr>
        </thead>
        <tbody>
          ${applicationAccess.map(app => `
            <tr>
              <td><strong>${app.appName}</strong></td>
              <td>${formatTime(app.lastAccessTime)}</td>
              <td style="color:var(--clr-success-text)">${app.successCount}</td>
              <td style="color:${app.failureCount > 0 ? 'var(--clr-danger-text)' : 'var(--color-text-tertiary)'}"><strong>${app.failureCount}</strong></td>
              <td>
                <span style="padding:2px 6px;border-radius:3px;font-size:9px;font-weight:600;background:${getStatusColor(app.status).bg};color:${getStatusColor(app.status).text}">
                  ${app.status}
                </span>
              </td>
              <td style="font-size:11px;color:var(--color-text-secondary)">${app.locations.join(', ')}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>
  `

  el.querySelector('#applications-section').innerHTML = appHtml

  // Group sign-in logs by application
  const appGroups = {}
  signInLogs.forEach(log => {
    if (!appGroups[log.application]) {
      appGroups[log.application] = []
    }
    appGroups[log.application].push(log)
  })

  // Sign-in Logs by Application
  const signinHtml = `
    <div style="display:grid;gap:16px">
      ${Object.entries(appGroups).slice(0, 10).map(([appName, logs]) => {
        const successCount = logs.filter(l => l.status === 'success').length
        const failureCount = logs.filter(l => l.status === 'failure').length
        const nonCompliantCount = logs.filter(l => l.compliant === 'No').length
        const unmanagedCount = logs.filter(l => l.managed === 'No').length

        return `
          <div style="border:1px solid var(--color-border);border-radius:6px;padding:12px;background:var(--color-bg-secondary)">
            <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px">
              <h4 style="margin:0;color:var(--color-text-primary)">${appName}</h4>
              <div style="display:flex;gap:8px;font-size:11px">
                <span style="padding:4px 8px;border-radius:3px;background:var(--clr-success-bg);color:var(--clr-success-text)"><strong>${successCount}</strong> success</span>
                ${failureCount > 0 ? `<span style="padding:4px 8px;border-radius:3px;background:var(--clr-danger-bg);color:var(--clr-danger-text)"><strong>${failureCount}</strong> failed</span>` : ''}
              </div>
            </div>

            <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(150px,1fr));gap:8px;margin-bottom:12px;font-size:11px">
              <div style="background:var(--color-bg-primary);padding:8px;border-radius:3px">
                <div style="color:var(--color-text-secondary);font-size:10px">Non-Compliant</div>
                <div style="font-weight:600;color:${nonCompliantCount > 0 ? 'var(--clr-warning-text)' : 'var(--color-text-tertiary)'}">${nonCompliantCount}</div>
              </div>
              <div style="background:var(--color-bg-primary);padding:8px;border-radius:3px">
                <div style="color:var(--color-text-secondary);font-size:10px">Unmanaged</div>
                <div style="font-weight:600;color:${unmanagedCount > 0 ? 'var(--clr-info-text)' : 'var(--color-text-tertiary)'}">${unmanagedCount}</div>
              </div>
              <div style="background:var(--color-bg-primary);padding:8px;border-radius:3px">
                <div style="color:var(--color-text-secondary);font-size:10px">Recent Activity</div>
                <div style="font-weight:600">${formatTime(logs[0].timestamp)}</div>
              </div>
            </div>

            <details style="cursor:pointer">
              <summary style="color:var(--color-text-secondary);font-size:11px;font-weight:600;padding:4px 0">Show ${logs.length} sign-in details</summary>
              <table class="data-table" style="margin-top:8px;font-size:10px">
                <thead>
                  <tr>
                    <th>Time</th>
                    <th>Browser / OS</th>
                    <th>Device</th>
                    <th>IP</th>
                    <th>Compliant</th>
                    <th>Managed</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  ${logs.slice(0, 15).map(log => `
                    <tr>
                      <td style="white-space:nowrap">${formatTime(log.timestamp)}</td>
                      <td style="font-size:9px">
                        <div>${log.browser}</div>
                        <div style="color:var(--color-text-secondary)">${log.operatingSystem}</div>
                      </td>
                      <td style="font-size:9px;color:${log.deviceName ? 'var(--color-text-primary)' : 'var(--color-text-tertiary)'}">${log.deviceName || '-'}</td>
                      <td style="font-family:monospace;font-size:9px;color:var(--color-text-secondary)">${log.ipAddress}</td>
                      <td><span style="padding:2px 4px;border-radius:2px;font-size:8px;background:${log.compliant === 'Yes' ? 'var(--clr-success-bg)' : 'var(--clr-warning-bg)'};color:${log.compliant === 'Yes' ? 'var(--clr-success-text)' : 'var(--clr-warning-text)'}">${log.compliant}</span></td>
                      <td><span style="padding:2px 4px;border-radius:2px;font-size:8px;background:${log.managed === 'Yes' ? 'var(--clr-success-bg)' : 'var(--clr-info-bg)'};color:${log.managed === 'Yes' ? 'var(--clr-success-text)' : 'var(--clr-info-text)'}">${log.managed}</span></td>
                      <td><span style="padding:2px 4px;border-radius:2px;font-size:8px;background:${log.status === 'success' ? 'var(--clr-success-bg)' : 'var(--clr-danger-bg)'};color:${log.status === 'success' ? 'var(--clr-success-text)' : 'var(--clr-danger-text)'}">${log.status.toUpperCase()}</span></td>
                    </tr>
                  `).join('')}
                </tbody>
              </table>
              ${logs.length > 15 ? `<div style="color:var(--color-text-tertiary);font-size:9px;margin-top:4px">Showing 15 of ${logs.length} sign-ins</div>` : ''}
            </details>
          </div>
        `
      }).join('')}
    </div>
    ${signInLogs.length > 0 ? `<div style="color:var(--color-text-tertiary);font-size:11px;margin-top:12px">Showing ${Math.min(10, Object.keys(appGroups).length)} of ${Object.keys(appGroups).length} applications (${signInLogs.length} total sign-ins)</div>` : ''}
  `

  el.querySelector('#signin-logs-section').innerHTML = signinHtml

  // Audit Logs
  const auditHtml = `
    <div style="overflow-x:auto">
      <table class="data-table">
        <thead>
          <tr>
            <th>Timestamp</th>
            <th>Operation</th>
            <th>Target</th>
            <th>Result</th>
            <th>Severity</th>
          </tr>
        </thead>
        <tbody>
          ${auditLogs.map(log => `
            <tr>
              <td>${formatTime(log.timestamp)}</td>
              <td><strong>${log.operation}</strong></td>
              <td>${log.target}</td>
              <td>
                <span style="padding:2px 6px;border-radius:3px;font-size:9px;font-weight:600;background:var(--clr-success-bg);color:var(--clr-success-text)">
                  ${log.result.toUpperCase()}
                </span>
              </td>
              <td>
                <span style="padding:2px 6px;border-radius:3px;font-size:9px;font-weight:600;background:${getSeverityColor(log.severity).bg};color:${getSeverityColor(log.severity).text}">
                  ${log.severity}
                </span>
              </td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>
  `

  el.querySelector('#audit-logs-section').innerHTML = auditHtml

  // Actions on Other Accounts
  const othersHtml = `
    <div style="display:flex;flex-direction:column;gap:8px">
      ${actionsOnOtherAccounts.map(action => `
        <div style="padding:12px;background:var(--color-background-secondary);border-radius:6px;border-left:3px solid ${getSeverityColor(action.severity).border}">
          <div style="display:flex;justify-content:space-between;align-items:center">
            <div>
              <div style="font-weight:600;font-size:12px">${action.targetName}</div>
              <div style="font-size:10px;color:var(--color-text-secondary);margin-top:2px">${action.targetUser}</div>
            </div>
            <div style="text-align:right">
              <div style="font-weight:600;font-size:11px">${action.action}</div>
              <div style="font-size:10px;color:var(--color-text-tertiary);margin-top:2px">${formatTime(action.timestamp)}</div>
            </div>
            <span style="padding:2px 6px;border-radius:3px;font-size:9px;font-weight:600;background:${getSeverityColor(action.severity).bg};color:${getSeverityColor(action.severity).text};margin-left:12px">
              ${action.severity}
            </span>
          </div>
        </div>
      `).join('')}
    </div>
  `

  el.querySelector('#other-accounts-section').innerHTML = othersHtml

  // Admin Changes (Account Changes) - show all account changes
  const adminChangesData = (data.accountChanges || [])

  const adminChangesHtml = adminChangesData.length > 0 ? `
    <div style="overflow-x:auto">
      <table class="data-table">
        <thead>
          <tr>
            <th>Timestamp</th>
            <th>Action</th>
            <th>Target</th>
            <th>Modified By</th>
          </tr>
        </thead>
        <tbody>
          ${adminChangesData.map(change => `
            <tr>
              <td>${formatTime(change.createdDateTime || change.eventTime)}</td>
              <td><strong>${change.action}</strong></td>
              <td>${change.target || 'N/A'}</td>
              <td>${change.actor || change.initiatedBy || 'System'}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>
  ` : '<div style="padding:20px;text-align:center;color:var(--color-text-secondary)">No admin changes found</div>'

  const accountChangesSection = el.querySelector('#account-changes-section')
  if (accountChangesSection) {
    accountChangesSection.innerHTML = adminChangesHtml
  }

  // Timeline
  const timelineHtml = `
    <div style="position:relative;padding:20px 0">
      ${timeline.map((event, idx) => `
        <div style="display:flex;gap:16px;margin-bottom:24px;position:relative">
          <div style="display:flex;flex-direction:column;align-items:center;width:40px;flex-shrink:0">
            <div style="width:12px;height:12px;border-radius:50%;background:${getSeverityColor(event.severity).bg};border:2px solid ${getSeverityColor(event.severity).border}"></div>
            ${idx < timeline.length - 1 ? `<div style="width:2px;height:40px;background:var(--color-border);margin-top:8px"></div>` : ''}
          </div>
          <div style="flex:1;padding-top:2px">
            <div style="display:flex;justify-content:space-between;align-items:start;gap:12px">
              <div>
                <div style="font-weight:600;font-size:12px">${event.description}</div>
                <div style="font-size:10px;color:var(--color-text-secondary);margin-top:4px">${formatTime(event.timestamp)}</div>
              </div>
              <span style="padding:2px 6px;border-radius:3px;font-size:9px;font-weight:600;background:${getSeverityColor(event.severity).bg};color:${getSeverityColor(event.severity).text};white-space:nowrap">
                ${event.severity}
              </span>
            </div>
          </div>
        </div>
      `).join('')}
    </div>
  `

  el.querySelector('#timeline-section').innerHTML = timelineHtml

  // Show results
  el.querySelector('#investigation-results').style.display = 'block'
  el.querySelector('#empty-state').style.display = 'none'

  // Setup tab switching
  setupInvestigationTabs(el)

  // Update scorecard metrics
  updateScorecardMetrics(el, data)

  // Generate AI analysis asynchronously
  generateAIAnalysis(el, data)
}

/**
 * Setup investigation tab switching
 */
function setupInvestigationTabs(el) {
  const tabs = el.querySelectorAll('.investigation-tab')
  const tabContents = el.querySelectorAll('.investigation-tab-content')

  console.log('🔧 Setting up tabs. Found:', tabs.length, 'tabs and', tabContents.length, 'content divs')

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const tabName = tab.getAttribute('data-tab')
      console.log('📌 Clicked tab:', tabName)

      // Deactivate all tabs
      tabs.forEach(t => {
        t.style.color = 'var(--color-text-secondary)'
        t.style.borderBottomColor = 'transparent'
      })

      // Hide all content
      tabContents.forEach(tc => {
        tc.style.display = 'none'
      })

      // Activate clicked tab
      tab.style.color = 'var(--color-primary)'
      tab.style.borderBottomColor = 'var(--color-primary)'

      // Show matching content
      const activeContent = el.querySelector(`.investigation-tab-content[data-tab="${tabName}"]`)
      console.log('📍 Active content found?', !!activeContent)
      if (activeContent) {
        activeContent.style.display = 'block'
        console.log('✅ Set display:block for', tabName)
      }
    })
  })
}

/**
 * Update scorecard metrics from investigation data
 */
function updateScorecardMetrics(el, data) {
  // Count metrics
  const riskScore = calculateRiskScore(data);
  const signinSuccess = (data.signInActivity || []).filter(s => s.status === 'success' || s.status === 'Success').length;
  const signinFailed = (data.signInActivity || []).filter(s => s.status === 'failed' || s.status === 'Failed' || s.status === 'blocked').length;
  const adminChanges = (data.accountChanges || []).filter(c =>
    (c.action || '').toLowerCase().includes('role') ||
    (c.action || '').toLowerCase().includes('admin') ||
    (c.action || '').toLowerCase().includes('license')
  ).length;
  const oauthCount = (data.oauthConsent || []).length;
  const riskDetections = (data.riskDetections || []).length;

  // Update scorecard elements
  const updateElement = (id, value) => {
    const el = document.querySelector(`#${id}`);
    if (el) el.textContent = value;
  };

  updateElement('scorecard-risk-score', `${riskScore}/100`);
  updateElement('scorecard-signin-success', signinSuccess);
  updateElement('scorecard-signin-failed', signinFailed);
  updateElement('scorecard-admin-changes', adminChanges);
  updateElement('scorecard-oauth', oauthCount);
  updateElement('scorecard-risk-detections', riskDetections);
}

/**
 * Calculate risk score from investigation data
 */
function calculateRiskScore(data) {
  let score = 20;
  score += Math.min((data.riskDetections || []).length * 15, 30);
  score += ((data.accountChanges || []).length > 0) ? 10 : 0;
  score += ((data.oauthConsent || []).length > 2) ? 5 : 0;
  score += ((data.directoryRoles || []).length > 1) ? 10 : 0;
  return Math.min(score, 100);
}

/**
 * Generate AI-powered investigation analysis
 */
async function generateAIAnalysis(el, data) {
  const analysisSection = el.querySelector('#ai-analysis-section')
  if (!analysisSection) return

  // Show loading state
  showAnalysisLoading(analysisSection)

  try {
    console.log('🔍 Calling analysis endpoint with data:', Object.keys(data))

    // Call the analysis endpoint via POST (allows larger payloads)
    // Use backend App Service URL directly (Static Web App Free SKU doesn't support backend linking)
    const backendUrl = window.location.hostname === 'localhost'
      ? 'http://localhost:3000/api/user-investigation/analysis'
      : 'https://m365ops-api-gtbgezb9c7bgata7.centralus-01.azurewebsites.net/api/user-investigation/analysis'

    const analysisResponse = await fetch(backendUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    })

    console.log('📨 Response status:', analysisResponse.status, analysisResponse.statusText)

    if (!analysisResponse.ok) {
      console.error('❌ HTTP error:', analysisResponse.status)
      analysisSection.innerHTML = '<div style="color:var(--color-text-tertiary);padding:20px;text-align:center">Unable to generate AI analysis (HTTP ' + analysisResponse.status + ')</div>'
      return
    }

    const result = await analysisResponse.json()
    console.log('✅ Response received:', result.success ? 'Success' : 'Fallback', 'Has analysis:', !!result.analysis)

    // Handle both full AI analysis (success: true) and fallback analysis (success: false with analysis data)
    if (result.analysis) {
      renderInvestigationAnalysis(analysisSection, result.analysis, data)
      console.log('✅ Analysis rendered successfully')
    } else {
      console.error('❌ No analysis in response:', result)
      analysisSection.innerHTML = '<div style="color:var(--color-text-tertiary);padding:20px;text-align:center">Analysis generation failed - no data returned</div>'
    }
  } catch (error) {
    console.error('❌ Analysis error:', error)
    analysisSection.innerHTML = '<div style="color:var(--color-danger-text);padding:20px;text-align:center">Error: ' + error.message + '</div>'
  }
}

// Render Category 1 sections

function renderSignInActivity(el, data) {
  const section = el.querySelector('#signin-logs-section')
  if (!section) return

  if (!data || data.length === 0) {
    section.innerHTML = '<div style="color:var(--color-text-tertiary);padding:20px;text-align:center">No sign-in activity detected</div>'
    return
  }

  const html = `
    <div style="overflow-x:auto">
      <table class="data-table">
        <thead>
          <tr>
            <th>Timestamp</th>
            <th>Location</th>
            <th>Device</th>
            <th>Status</th>
            <th>Risk Level</th>
          </tr>
        </thead>
        <tbody>
          ${data.slice(0, 20).map(log => `
            <tr>
              <td style="white-space:nowrap">${formatTime(log.timestamp)}</td>
              <td style="font-size:11px">${log.location || '-'}</td>
              <td style="font-size:11px">${log.device ? log.device + ' (' + (log.os || 'Unknown') + ')' : '-'}</td>
              <td>
                <span style="padding:2px 6px;border-radius:3px;font-size:9px;font-weight:600;background:${log.status === 'success' || log.status === 'Success' ? 'var(--clr-success-bg)' : 'var(--clr-danger-bg)'};color:${log.status === 'success' || log.status === 'Success' ? 'var(--clr-success-text)' : 'var(--clr-danger-text)'}">
                  ${log.status || '-'}
                </span>
              </td>
              <td>
                <span style="padding:2px 6px;border-radius:3px;font-size:9px;font-weight:600;background:${getRiskColor(log.riskLevel || 'LOW').bg};color:${getRiskColor(log.riskLevel || 'LOW').text}">
                  ${log.riskLevel || 'LOW'}
                </span>
              </td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>
    ${data.length > 20 ? `<div style="color:var(--color-text-tertiary);font-size:11px;margin-top:8px">Showing 20 of ${data.length} sign-ins</div>` : ''}
  `

  section.innerHTML = html
}

function renderRiskDetections(el, data) {
  const section = el.querySelector('#risk-detections-section')
  if (!section) return

  if (!data || data.length === 0) {
    section.innerHTML = '<div style="color:var(--color-text-tertiary);padding:20px;text-align:center">No risk detections found</div>'
    return
  }

  const html = `
    <div style="overflow-x:auto">
      <table class="data-table">
        <thead>
          <tr>
            <th>Detection Type</th>
            <th>Risk Level</th>
            <th>Location</th>
            <th>Detection Time</th>
          </tr>
        </thead>
        <tbody>
          ${data.slice(0, 20).map(risk => `
            <tr>
              <td><strong>${risk.detectionType || 'Unknown'}</strong></td>
              <td>
                <span style="padding:2px 6px;border-radius:3px;font-size:9px;font-weight:600;background:${getRiskColor(risk.riskLevel || 'MEDIUM').bg};color:${getRiskColor(risk.riskLevel || 'MEDIUM').text}">
                  ${risk.riskLevel || 'MEDIUM'}
                </span>
              </td>
              <td style="font-size:11px;color:var(--color-text-secondary)">${risk.location || '-'}</td>
              <td style="white-space:nowrap;font-size:11px">${formatTime(risk.detectionTime)}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>
    ${data.length > 20 ? `<div style="color:var(--color-text-tertiary);font-size:11px;margin-top:8px">Showing 20 of ${data.length} detections</div>` : ''}
  `

  section.innerHTML = html
}

function renderDevicesUsed(el, registeredDevices, managedDevices) {
  const section = el.querySelector('#devices-section')
  if (!section) return

  const allDevices = [...(registeredDevices || []), ...(managedDevices || [])]
  if (allDevices.length === 0) {
    section.innerHTML = '<div style="color:var(--color-text-tertiary);padding:20px;text-align:center">No devices registered or managed</div>'
    return
  }

  const html = `
    <div style="overflow-x:auto">
      <table class="data-table">
        <thead>
          <tr>
            <th>Device Name</th>
            <th>OS</th>
            <th>Type</th>
            <th>Compliance / Status</th>
          </tr>
        </thead>
        <tbody>
          ${allDevices.slice(0, 20).map(device => `
            <tr>
              <td><strong>${device.name || 'Unknown'}</strong></td>
              <td style="font-size:11px">${device.os || '-'}</td>
              <td style="font-size:11px">${device.type || device.managed ? 'Managed' : 'Registered'}</td>
              <td>
                <span style="padding:2px 6px;border-radius:3px;font-size:9px;font-weight:600;background:${device.complianceState === 'Compliant' || device.encrypted ? 'var(--clr-success-bg)' : 'var(--clr-warning-bg)'};color:${device.complianceState === 'Compliant' || device.encrypted ? 'var(--clr-success-text)' : 'var(--clr-warning-text)'}">
                  ${device.complianceState || (device.encrypted ? 'Encrypted' : 'Unmanaged')}
                </span>
              </td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>
    ${allDevices.length > 20 ? `<div style="color:var(--color-text-tertiary);font-size:11px;margin-top:8px">Showing 20 of ${allDevices.length} devices</div>` : ''}
  `

  section.innerHTML = html
}

function renderOAuthPermissions(el, data) {
  const section = el.querySelector('#oauth-consent-section')
  if (!section) return

  if (!data || data.length === 0) {
    section.innerHTML = '<div style="color:var(--color-text-tertiary);padding:20px;text-align:center">No OAuth permissions granted</div>'
    return
  }

  // Format permissions for display
  function formatPermissions(permissions) {
    if (!permissions) return '-'

    let perms = []
    if (typeof permissions === 'string') {
      // Split by space or comma
      perms = permissions.split(/[\s,]+/).filter(p => p.trim())
    } else if (Array.isArray(permissions)) {
      perms = permissions.flat().filter(p => p && typeof p === 'string')
    }

    if (perms.length === 0) return '-'

    // Create permission badges
    return perms.map(perm => `
      <span style="display:inline-block;padding:3px 6px;margin:2px 2px 2px 0;border-radius:3px;font-size:9px;background:var(--color-info-bg);color:var(--color-info-text);border:1px solid var(--color-border);white-space:nowrap">
        ${perm.trim()}
      </span>
    `).join('')
  }

  // Get consent type badge
  function getConsentBadge(consentType) {
    const type = consentType?.toLowerCase() || 'user'
    let bgColor, textColor

    if (type.includes('admin')) {
      bgColor = 'var(--color-danger-bg)'
      textColor = 'var(--color-danger-text)'
    } else if (type.includes('principal')) {
      bgColor = 'var(--color-warning-bg)'
      textColor = 'var(--color-warning-text)'
    } else {
      bgColor = 'var(--color-info-bg)'
      textColor = 'var(--color-info-text)'
    }

    return `<span style="padding:3px 8px;border-radius:3px;font-size:9px;font-weight:600;background:${bgColor};color:${textColor}">${consentType || 'User'}</span>`
  }

  const html = `
    <div style="display:flex;flex-direction:column;gap:16px">
      ${data.slice(0, 20).map(app => `
        <div style="border:1px solid var(--color-border);border-radius:6px;padding:12px;background:var(--color-bg-secondary)">
          <div style="display:flex;justify-content:space-between;align-items:start;gap:12px;margin-bottom:8px">
            <div>
              <div style="font-weight:600;font-size:12px;color:var(--color-text-primary)">${app.appName || app.displayName || 'Unknown Application'}</div>
              <div style="font-size:9px;color:var(--color-text-secondary);margin-top:2px">App ID: ${app.appId || app.id || 'N/A'}</div>
            </div>
            <div style="text-align:right;white-space:nowrap">
              ${getConsentBadge(app.consentType)}
              <div style="font-size:9px;color:var(--color-text-secondary);margin-top:4px">${formatDate(app.grantedDate)}</div>
            </div>
          </div>
          <div style="margin-top:8px;padding-top:8px;border-top:1px solid var(--color-border)">
            <div style="font-size:10px;color:var(--color-text-secondary);margin-bottom:4px;font-weight:500">Permissions:</div>
            <div style="display:flex;flex-wrap:wrap;gap:4px">
              ${formatPermissions(app.permissions)}
            </div>
          </div>
        </div>
      `).join('')}
    </div>
    ${data.length > 20 ? `<div style="color:var(--color-text-tertiary);font-size:11px;margin-top:12px;padding:8px;text-align:center">Showing 20 of ${data.length} OAuth applications</div>` : ''}
  `

  section.innerHTML = html
}

function renderSecurityAlerts(el, data) {
  const section = el.querySelector('#security-alerts-section')
  if (!section) return

  if (!data || data.length === 0) {
    section.innerHTML = '<div style="color:var(--color-text-tertiary);padding:20px;text-align:center">No security alerts found</div>'
    return
  }

  const html = `
    <div style="overflow-x:auto">
      <table class="data-table">
        <thead>
          <tr>
            <th>Alert Title</th>
            <th>Severity</th>
            <th>Status</th>
            <th>Detection Source</th>
            <th>Created Time</th>
          </tr>
        </thead>
        <tbody>
          ${data.slice(0, 20).map(alert => `
            <tr>
              <td><strong>${alert.title || 'Unknown Alert'}</strong></td>
              <td>
                <span style="padding:2px 6px;border-radius:3px;font-size:9px;font-weight:600;background:${getSeverityColor(alert.severity || 'MEDIUM').bg};color:${getSeverityColor(alert.severity || 'MEDIUM').text}">
                  ${alert.severity || 'MEDIUM'}
                </span>
              </td>
              <td style="font-size:11px">${alert.status || '-'}</td>
              <td style="font-size:11px;color:var(--color-text-secondary)">${alert.detectionSource || '-'}</td>
              <td style="white-space:nowrap;font-size:11px">${formatTime(alert.createdTime)}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>
    ${data.length > 20 ? `<div style="color:var(--color-text-tertiary);font-size:11px;margin-top:8px">Showing 20 of ${data.length} alerts</div>` : ''}
  `

  section.innerHTML = html
}

// Render Category 2 section

function renderAccountChanges(el, data) {
  const section = el.querySelector('#account-changes-section')
  if (!section) return

  if (!data || data.length === 0) {
    section.innerHTML = '<div style="color:var(--color-text-tertiary);padding:20px;text-align:center">No account changes detected</div>'
    return
  }

  // Debug logging
  console.log('🔍 Account Changes Data:', {
    count: data.length,
    firstEvent: data[0],
    fields: data[0] ? Object.keys(data[0]) : []
  })

  // Get category icon and color
  function getCategoryIcon(category) {
    const icons = {
      'Identity Changes': { icon: '👤', color: 'var(--color-info)' },
      'Authentication Changes': { icon: '🔐', color: 'var(--color-warning)' },
      'Privilege Changes': { icon: '⚡', color: 'var(--color-danger)' },
      'Group Changes': { icon: '👥', color: 'var(--color-info)' },
      'License Changes': { icon: '📋', color: 'var(--color-success)' },
      'Application Changes': { icon: '📱', color: 'var(--color-info)' },
      'Security Changes': { icon: '🛡️', color: 'var(--color-danger)' },
      'Account Lifecycle': { icon: '♻️', color: 'var(--color-warning)' },
      'Other Changes': { icon: '📝', color: 'var(--color-text-secondary)' }
    }
    const catName = category || 'Other Changes'
    return icons[catName] || { icon: '📝', color: 'var(--color-text-secondary)' }
  }

  // Format change details for display
  function formatChangeDisplay(change) {
    // Handle both old and new field names
    const action = change.action || change.details || 'Unknown action'
    let display = action

    // Add before/after if available
    const before = change.beforeValue || change.oldValue
    const after = change.afterValue || change.newValue

    if (before && after) {
      display += ` (${before} → ${after})`
    } else if (before) {
      display += ` (was: ${before})`
    } else if (after) {
      display += ` (now: ${after})`
    }

    return display
  }

  // Group by category
  const groupedByCategory = {}
  data.forEach(change => {
    const category = change.category || 'Other Changes'
    if (!groupedByCategory[category]) {
      groupedByCategory[category] = []
    }
    groupedByCategory[category].push(change)
  })

  // Sort categories by risk level
  const categoryOrder = [
    'Privilege Changes',
    'Security Changes',
    'Authentication Changes',
    'Account Lifecycle',
    'Identity Changes',
    'Application Changes',
    'Group Changes',
    'License Changes',
    'Other Changes'
  ]

  const sortedCategories = Object.keys(groupedByCategory).sort((a, b) => {
    const aIndex = categoryOrder.indexOf(a)
    const bIndex = categoryOrder.indexOf(b)
    return (aIndex === -1 ? 999 : aIndex) - (bIndex === -1 ? 999 : bIndex)
  })

  const html = `
    <div style="display:flex;flex-direction:column;gap:16px">
      ${sortedCategories.map(category => {
        const changes = groupedByCategory[category]
        const catInfo = getCategoryIcon(category)

        return `
        <div style="border:1px solid var(--color-border);border-radius:6px;padding:12px;background:var(--color-bg-secondary)">
          <h4 style="margin:0 0 12px 0;font-size:12px;font-weight:600;color:var(--color-text-primary);display:flex;align-items:center;gap:8px">
            <span style="font-size:14px">${catInfo.icon}</span>
            ${category} (${changes.length})
          </h4>
          <div style="display:flex;flex-direction:column;gap:8px">
            ${changes.slice(0, 15).map(change => {
              // Handle both old and new data formats
              const eventTime = change.eventTime || change.timestamp
              const actor = change.actor || change.initiatedBy || 'System'
              const actorUpn = change.actorUpn || 'unknown'
              const result = change.result || change.status || 'Unknown'

              const timestamp = formatDateTime(eventTime)
              const display = formatChangeDisplay(change)
              const statusColor = (result === 'Success' || result === 'success') ? 'var(--color-success-bg)' : 'var(--color-danger-bg)'
              const statusTextColor = (result === 'Success' || result === 'success') ? 'var(--color-success-text)' : 'var(--color-danger-text)'

              return `
              <div style="padding:10px;border:1px solid var(--color-border);border-radius:4px;background:var(--color-bg-primary);font-size:11px">
                <div style="display:flex;justify-content:space-between;align-items:start;gap:8px;margin-bottom:4px">
                  <div style="flex:1">
                    <div style="color:var(--color-text-primary);font-weight:500;margin-bottom:2px">${display}</div>
                    <div style="color:var(--color-text-secondary);font-size:10px">By: ${actor}${actorUpn && actorUpn !== 'unknown' && actorUpn !== 'system' ? ` (${actorUpn})` : ''}</div>
                  </div>
                  <div style="text-align:right;white-space:nowrap;flex-shrink:0">
                    <span style="padding:2px 6px;border-radius:3px;font-size:8px;font-weight:600;background:${statusColor};color:${statusTextColor};display:inline-block">
                      ${result}
                    </span>
                  </div>
                </div>
                <div style="font-size:10px;color:var(--color-text-tertiary);padding-top:4px;border-top:1px solid var(--color-border)">${timestamp}</div>
              </div>
            `}).join('')}
          </div>
          ${changes.length > 15 ? `<div style="color:var(--color-text-tertiary);font-size:9px;margin-top:8px;padding-top:8px;border-top:1px solid var(--color-border)">Showing 15 of ${changes.length} events in this category</div>` : ''}
        </div>
      `}).join('')}
    </div>
  `

  section.innerHTML = html
}

// Render Identity & Access Information sections

function renderUserGroups(el, data) {
  const section = el.querySelector('#user-groups-section')
  if (!section) return

  if (!data || data.length === 0) {
    section.innerHTML = '<div style="color:var(--color-text-tertiary);padding:20px;text-align:center">No group memberships found</div>'
    return
  }

  const html = `
    <div style="overflow-x:auto">
      <table class="data-table">
        <thead>
          <tr>
            <th>Group Name</th>
            <th>Type</th>
            <th>Description</th>
          </tr>
        </thead>
        <tbody>
          ${data.slice(0, 30).map(group => `
            <tr>
              <td><strong>${group.displayName}</strong></td>
              <td style="font-size:10px">${group.type || 'Group'}</td>
              <td style="font-size:10px;color:var(--color-text-secondary);max-width:300px">${group.description || '-'}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>
    ${data.length > 30 ? `<div style="color:var(--color-text-tertiary);font-size:11px;margin-top:8px">Showing 30 of ${data.length} groups</div>` : ''}
  `

  section.innerHTML = html
}

function renderDirectoryRoles(el, data) {
  const section = el.querySelector('#directory-roles-section')
  if (!section) return

  if (!data || data.length === 0) {
    section.innerHTML = '<div style="color:var(--color-text-tertiary);padding:20px;text-align:center">No directory roles assigned</div>'
    return
  }

  const html = `
    <div style="display:flex;flex-direction:column;gap:8px">
      ${data.map(role => `
        <div style="padding:12px;background:var(--color-bg-primary);border-radius:6px;border-left:3px solid var(--color-info)">
          <div style="font-weight:600;font-size:12px;color:var(--color-text-primary)">${role.displayName}</div>
          ${role.description ? `<div style="font-size:10px;color:var(--color-text-secondary);margin-top:4px">${role.description}</div>` : ''}
        </div>
      `).join('')}
    </div>
  `

  section.innerHTML = html
}

function renderAuthenticationMethods(el, data) {
  const section = el.querySelector('#authentication-methods-section')
  if (!section) return

  if (!data || data.length === 0) {
    section.innerHTML = '<div style="color:var(--color-text-tertiary);padding:20px;text-align:center">No authentication methods configured</div>'
    return
  }

  const html = `
    <div style="display:flex;flex-wrap:wrap;gap:8px">
      ${data.map(method => `
        <div style="padding:8px 12px;background:var(--color-info);color:white;border-radius:4px;font-size:11px;font-weight:500">
          ${method.displayName || method.type}
        </div>
      `).join('')}
    </div>
  `

  section.innerHTML = html
}

function renderMailboxSettings(el, data) {
  const section = el.querySelector('#mailbox-settings-section')
  if (!section) return

  if (!data || Object.keys(data).length === 0) {
    section.innerHTML = '<div style="color:var(--color-text-tertiary);padding:20px;text-align:center">No mailbox settings found</div>'
    return
  }

  const html = `
    <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:12px">
      <div style="padding:12px;background:var(--color-bg-primary);border-radius:6px">
        <div style="font-size:10px;color:var(--color-text-secondary);margin-bottom:6px">Time Zone</div>
        <div style="font-weight:600;font-size:12px">${data.timeZone || 'N/A'}</div>
      </div>
      <div style="padding:12px;background:var(--color-bg-primary);border-radius:6px">
        <div style="font-size:10px;color:var(--color-text-secondary);margin-bottom:6px">Language</div>
        <div style="font-weight:600;font-size:12px">${data.language || 'N/A'}</div>
      </div>
      <div style="padding:12px;background:var(--color-bg-primary);border-radius:6px">
        <div style="font-size:10px;color:var(--color-text-secondary);margin-bottom:6px">Auto-Reply Status</div>
        <div style="font-weight:600;font-size:12px">${data.automaticRepliesSetting || 'N/A'}</div>
      </div>
      ${typeof data.workingHours === 'string' ? `<div style="padding:12px;background:var(--color-bg-primary);border-radius:6px"><div style="font-size:10px;color:var(--color-text-secondary);margin-bottom:6px">Working Hours</div><div style="font-weight:600;font-size:12px">Not configured</div></div>` : data.workingHours ? `<div style="padding:12px;background:var(--color-bg-primary);border-radius:6px"><div style="font-size:10px;color:var(--color-text-secondary);margin-bottom:6px">Working Hours</div><div style="font-size:11px"><div>${data.workingHours.daysOfWeek || 'N/A'}</div><div>${data.workingHours.startTime} - ${data.workingHours.endTime}</div></div></div>` : ''}
    </div>
  `

  section.innerHTML = html
}

function renderRiskyUser(el, data) {
  const section = el.querySelector('#risky-user-section')
  if (!section) return

  if (!data || Object.keys(data).length === 0 || !data.id) {
    section.innerHTML = '<div style="color:var(--color-success-text);padding:20px;text-align:center;background:var(--color-success-bg);border-radius:6px">✅ User is not flagged as risky</div>'
    return
  }

  const html = `
    <div style="padding:16px;background:var(--color-danger-bg);border-radius:6px;border-left:4px solid var(--color-danger)">
      <div style="color:var(--color-danger-text);font-weight:600;margin-bottom:12px">⚠️ User flagged as risky</div>
      <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(150px,1fr));gap:12px;font-size:11px">
        <div>
          <div style="color:var(--color-text-secondary);margin-bottom:4px">Risk Level</div>
          <div style="font-weight:600;color:var(--color-danger-text)">${data.riskLevel || 'Unknown'}</div>
        </div>
        <div>
          <div style="color:var(--color-text-secondary);margin-bottom:4px">Risk State</div>
          <div style="font-weight:600;color:var(--color-danger-text)">${data.riskState || 'Unknown'}</div>
        </div>
        <div>
          <div style="color:var(--color-text-secondary);margin-bottom:4px">Risk Detail</div>
          <div style="font-weight:600;color:var(--color-danger-text)">${data.riskDetail || 'N/A'}</div>
        </div>
      </div>
    </div>
  `

  section.innerHTML = html
}

function renderEnterpriseApps(el, data) {
  const section = el.querySelector('#enterprise-apps-section')
  if (!section) return

  if (!data || data.length === 0) {
    section.innerHTML = '<div style="color:var(--color-text-tertiary);padding:20px;text-align:center">No enterprise applications owned</div>'
    return
  }

  const html = `
    <div style="overflow-x:auto">
      <table class="data-table">
        <thead>
          <tr>
            <th>Application Name</th>
            <th>App ID</th>
            <th>Type</th>
            <th>Created Date</th>
          </tr>
        </thead>
        <tbody>
          ${data.slice(0, 20).map(app => `
            <tr>
              <td><strong>${app.displayName}</strong></td>
              <td style="font-family:monospace;font-size:9px;color:var(--color-text-secondary)">${app.appId?.substring(0, 8)}...</td>
              <td style="font-size:10px">${app.servicePrincipalType || 'Unknown'}</td>
              <td style="font-size:11px;white-space:nowrap">${app.createdDateTime ? formatDate(app.createdDateTime) : 'N/A'}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>
    ${data.length > 20 ? `<div style="color:var(--color-text-tertiary);font-size:11px;margin-top:8px">Showing 20 of ${data.length} apps</div>` : ''}
  `

  section.innerHTML = html
}

function getRiskColor(level) {
  const colors = {
    'LOW': { bg: 'var(--clr-success-bg)', text: 'var(--clr-success-text)' },
    'MEDIUM': { bg: 'var(--clr-warning-bg)', text: 'var(--clr-warning-text)' },
    'HIGH': { bg: 'var(--clr-danger-bg)', text: 'var(--clr-danger-text)' },
    'CRITICAL': { bg: 'var(--clr-critical-bg)', text: 'var(--clr-critical-text)' }
  }
  return colors[level] || colors['MEDIUM']
}

function getRiskBadgeColor(level) {
  const colors = {
    'low': { bg: 'rgba(16, 185, 129, 0.1)', text: '#10B981' },
    'medium': { bg: 'rgba(251, 146, 60, 0.1)', text: '#FB923C' },
    'high': { bg: 'rgba(239, 68, 68, 0.1)', text: '#EF4444' }
  }
  return colors[level] || colors['low']
}

function getStatusColor(status) {
  return status === 'SUCCESS'
    ? { bg: 'var(--clr-success-bg)', text: 'var(--clr-success-text)' }
    : { bg: 'var(--clr-danger-bg)', text: 'var(--clr-danger-text)' }
}

function getSeverityColor(severity) {
  const colors = {
    'LOW': { bg: 'var(--clr-success-bg)', text: 'var(--clr-success-text)', border: 'var(--clr-success-text)' },
    'MEDIUM': { bg: 'var(--clr-warning-bg)', text: 'var(--clr-warning-text)', border: 'var(--clr-warning-text)' },
    'HIGH': { bg: 'var(--clr-danger-bg)', text: 'var(--clr-danger-text)', border: 'var(--clr-danger-text)' },
    'CRITICAL': { bg: 'var(--clr-critical-bg)', text: 'var(--clr-critical-text)', border: 'var(--clr-critical-text)' }
  }
  return colors[severity] || colors['MEDIUM']
}

function formatTime(dateString) {
  // Handle null, undefined, or empty strings
  if (!dateString) return 'Unknown date'

  const date = new Date(dateString)

  // Check if date is valid
  if (isNaN(date.getTime())) {
    return 'Invalid date'
  }

  const now = new Date()
  const diff = now - date

  const minutes = Math.floor(diff / 60000)
  const hours = Math.floor(diff / 3600000)
  const days = Math.floor(diff / 86400000)

  if (minutes < 1) return 'Just now'
  if (minutes < 60) return `${minutes}m ago`
  if (hours < 24) return `${hours}h ago`
  if (days < 7) return `${days}d ago`

  try {
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })
  } catch (e) {
    return dateString
  }
}

function formatDate(dateString) {
  // Handle null, undefined, or empty strings
  if (!dateString) return 'Unknown date'

  const date = new Date(dateString)

  // Check if date is valid
  if (isNaN(date.getTime())) {
    return 'Invalid date'
  }

  try {
    return date.toLocaleDateString('en-US', { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' })
  } catch (e) {
    return dateString
  }
}

function formatDateTime(dateString) {
  // Handle null, undefined, or empty strings
  if (!dateString) return 'Unknown date'

  const date = new Date(dateString)

  // Check if date is valid
  if (isNaN(date.getTime())) {
    return 'Invalid date'
  }

  try {
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    })
  } catch (e) {
    return dateString
  }
}
