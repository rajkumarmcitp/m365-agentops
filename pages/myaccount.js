import { go } from '../app.js'
import { showToast } from '../components/toast.js'
import { api } from '../lib/api-client.js'
import { skeletonLoader } from '../lib/skeleton-loader.js'
import {
  USER_PROFILE, SECURITY_DASHBOARD, SIGNIN_ACTIVITY, LICENSES,
  GROUP_MEMBERSHIPS, ONEDRIVE_INFO, TEAMS_INFO, DEVICES, APP_ACCESS,
  PENDING_APPROVALS, COPILOT_READINESS, EXECUTIVE_SUMMARY
} from '../data/myaccount-data.js'

let activeTab = 'executive'

// Real data from backend (fallback to simulated if errors)
let userData = { profile: USER_PROFILE, security: SECURITY_DASHBOARD, signin: SIGNIN_ACTIVITY, licenses: LICENSES, groups: GROUP_MEMBERSHIPS, onedrive: ONEDRIVE_INFO, teams: TEAMS_INFO, devices: DEVICES }

const TABS = [
  { id: 'executive', label: 'Executive Summary', icon: 'ti-dashboard' },
  { id: 'profile', label: 'Profile', icon: 'ti-user' },
  { id: 'security', label: 'Security', icon: 'ti-shield-check' },
  { id: 'signin', label: 'Sign-in Activity', icon: 'ti-login' },
  { id: 'licenses', label: 'Licenses', icon: 'ti-license' },
  { id: 'groups', label: 'Groups', icon: 'ti-users' },
  { id: 'devices', label: 'Devices', icon: 'ti-device-laptop' },
  { id: 'apps', label: 'Apps & Access', icon: 'ti-app-window' },
  { id: 'onedrive', label: 'OneDrive', icon: 'ti-cloud' },
  { id: 'teams', label: 'Teams', icon: 'ti-brand-teams' },
  { id: 'approvals', label: 'Pending Approvals', icon: 'ti-check' },
  { id: 'copilot', label: 'Copilot Insights', icon: 'ti-robot' },
]

export async function initMyAccount() {
  const el = document.getElementById('page-myaccount')
  if (!el) return

  // Fetch real data from backend
  try {
    console.log('📡 Fetching My Account data from backend...')

    // Get current user's email from MSAL (set during login)
    const userEmail = window.userEmail
    if (!userEmail) {
      console.error('❌ User email not found. Make sure you are logged in.')
      showToast('Error: User not authenticated. Please log in again.', 'error')
      return
    }

    console.log(`Fetching data for user: ${userEmail}`)

    const [profile, security, signin, licenses, groups, onedrive, teams, devices, mailbox] = await Promise.allSettled([
      fetch(`${api}/me/profile?email=${encodeURIComponent(userEmail)}`).then(r => r.json()),
      fetch(`${api}/me/security?email=${encodeURIComponent(userEmail)}`).then(r => r.json()),
      fetch(`${api}/me/signin-activity?email=${encodeURIComponent(userEmail)}`).then(r => r.json()),
      fetch(`${api}/me/licenses?email=${encodeURIComponent(userEmail)}`).then(r => r.json()),
      fetch(`${api}/me/groups?email=${encodeURIComponent(userEmail)}`).then(r => r.json()),
      fetch(`${api}/me/onedrive?email=${encodeURIComponent(userEmail)}`).then(r => r.json()),
      fetch(`${api}/me/teams?email=${encodeURIComponent(userEmail)}`).then(r => r.json()),
      fetch(`${api}/me/devices?email=${encodeURIComponent(userEmail)}`).then(r => r.json()),
      fetch(`${api}/me/mailbox?email=${encodeURIComponent(userEmail)}`).then(r => r.json())
    ])

    // Use real data if successful, fallback to simulated
    userData.profile = profile.status === 'fulfilled' && profile.value.success ? profile.value.data : USER_PROFILE
    userData.security = security.status === 'fulfilled' && security.value.success ? security.value.data : SECURITY_DASHBOARD
    userData.signin = signin.status === 'fulfilled' && signin.value.success ? signin.value.data.recentSignins : SIGNIN_ACTIVITY
    userData.licenses = licenses.status === 'fulfilled' && licenses.value.success ? licenses.value.data : LICENSES
    userData.groups = groups.status === 'fulfilled' && groups.value.success ? groups.value.data : GROUP_MEMBERSHIPS
    userData.onedrive = onedrive.status === 'fulfilled' && onedrive.value.success ? onedrive.value.data : ONEDRIVE_INFO
    userData.teams = teams.status === 'fulfilled' && teams.value.success ? teams.value.data : TEAMS_INFO
    userData.devices = devices.status === 'fulfilled' && devices.value.success ? devices.value.data : DEVICES
    userData.mailbox = mailbox.status === 'fulfilled' && mailbox.value.success ? mailbox.value.data : { mailboxUsage: 65 }

    console.log('✓ My Account data loaded')
  } catch (error) {
    console.warn('⚠️ Using simulated data:', error.message)
  }

  render(el)
}

function render(el) {
  el.innerHTML = `
    <div class="page-header">
      <div>
        <div class="page-title"><i class="ti ti-user-circle"></i> My Account</div>
        <div class="page-subtitle">Your Microsoft 365 profile, security status, and assigned resources</div>
      </div>
      <div class="page-actions">
        <button class="btn" id="myacc-refresh"><i class="ti ti-refresh"></i> Refresh</button>
      </div>
    </div>

    <!-- Tab Navigation -->
    <div class="tabs" id="myacc-subnav">
      ${TABS.map(t => `
        <button class="tab-btn ${activeTab === t.id ? 'active' : ''}" data-tab="${t.id}">
          <i class="ti ${t.icon}"></i><span>${t.label}</span>
          ${t.id === 'approvals' && PENDING_APPROVALS.length > 0 ? `<span class="intune-tab-badge red">${PENDING_APPROVALS.length}</span>` : ''}
        </button>
      `).join('')}
    </div>

    <!-- Content -->
    <div id="myacc-content" style="margin-top:16px">${renderTab()}</div>
  `

  el.querySelectorAll('#myacc-subnav .tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      activeTab = btn.dataset.tab
      el.querySelector('#myacc-content').innerHTML = renderTab()
      // Initialize map for sign-in activity tab
      if (activeTab === 'signin') {
        setTimeout(() => initSigninMap(el), 100)
      }
    })
  })

  // Initialize map on initial load if signin is active tab
  if (activeTab === 'signin') {
    setTimeout(() => initSigninMap(el), 100)
  }

  el.querySelector('#myacc-refresh')?.addEventListener('click', () => {
    const btn = el.querySelector('#myacc-refresh')
    btn.innerHTML = `<span class="spinner dark"></span> Refreshing...`
    btn.disabled = true
    setTimeout(() => {
      btn.innerHTML = `<i class="ti ti-refresh"></i> Refresh`
      btn.disabled = false
      showToast('Your profile has been refreshed.', 'success')
    }, 1500)
  })
}

function renderTab() {
  const tabs = {
    executive: renderExecutive,
    profile: renderProfile,
    security: renderSecurity,
    signin: renderSignin,
    licenses: renderLicenses,
    groups: renderGroups,
    devices: renderDevices,
    apps: renderApps,
    onedrive: renderOneDrive,
    teams: renderTeams,
    approvals: renderApprovals,
    copilot: renderCopilot,
  }
  const fn = tabs[activeTab]
  return fn ? fn() : ''
}

function renderExecutive() {
  // Calculate metrics from real data
  const securityScore = userData.security?.securityScore || 85
  const mfaStatus = userData.security?.mfaStatus || 'Not Enabled'
  const riskLevel = userData.security?.riskLevel || 'Low'
  const assignedLicenses = (userData.licenses && Array.isArray(userData.licenses) ? userData.licenses.length : 0) || userData.licenses?.count || 0
  const devices = (userData.devices && Array.isArray(userData.devices) ? userData.devices.length : 0) || userData.devices?.count || 0
  const groups = (userData.groups && userData.groups.securityGroups ? userData.groups.securityGroups.length : 0) || 0
  const teams = userData.teams?.teamsMembership || 0
  const pendingRequests = 0 // From approvals data if available

  // OneDrive usage percentage
  const oneDriveUsage = userData.onedrive?.percentageUsed || 0

  // Mailbox usage (from mailbox endpoint)
  const mailboxUsage = userData.mailbox?.mailboxUsage || 65

  return `
    <div class="kpi-row mb-3">
      <div class="kpi-tile">
        <div class="kpi-value success">${securityScore}<span style="font-size:10px;font-weight:500">/100</span></div>
        <div class="kpi-label">Security Score</div>
      </div>
      <div class="kpi-tile">
        <div class="kpi-value success">✓</div>
        <div class="kpi-label">MFA Status</div>
        <div style="font-size:10px;margin-top:3px;color:var(--color-text-tertiary)">${mfaStatus}</div>
      </div>
      <div class="kpi-tile">
        <div class="kpi-value success">${riskLevel}</div>
        <div class="kpi-label">Risk Level</div>
      </div>
      <div class="kpi-tile">
        <div class="kpi-value">${assignedLicenses}</div>
        <div class="kpi-label">Licenses</div>
      </div>
      <div class="kpi-tile">
        <div class="kpi-value">${devices}</div>
        <div class="kpi-label">Devices</div>
      </div>
      <div class="kpi-tile">
        <div class="kpi-value">${groups}</div>
        <div class="kpi-label">Groups</div>
      </div>
    </div>

    <div class="card">
      <div class="card-header"><span class="card-title">Key Metrics</span></div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px;padding:16px;border-top:0.5px solid var(--color-border-secondary)">
        <div>
          <div style="font-size:10px;font-weight:600;color:var(--color-text-tertiary);margin-bottom:4px">Teams</div>
          <div style="font-size:14px;font-weight:600">${teams}</div>
        </div>
        <div>
          <div style="font-size:10px;font-weight:600;color:var(--color-text-tertiary);margin-bottom:4px">Pending Requests</div>
          <div style="font-size:14px;font-weight:600;color:var(--clr-warning-text)">${pendingRequests}</div>
        </div>
        <div>
          <div style="font-size:10px;font-weight:600;color:var(--color-text-tertiary);margin-bottom:4px">OneDrive Usage</div>
          <div style="font-size:14px;font-weight:600">${oneDriveUsage}%</div>
        </div>
        <div>
          <div style="font-size:10px;font-weight:600;color:var(--color-text-tertiary);margin-bottom:4px">Mailbox Usage</div>
          <div style="font-size:14px;font-weight:600">${mailboxUsage}%</div>
        </div>
      </div>
    </div>
  `
}

function renderProfile() {
  const p = userData.profile
  return `
    <div class="card">
      <div class="card-header"><span class="card-title">Profile Information</span></div>
      <div style="padding:16px;border-top:0.5px solid var(--color-border-secondary)">
        <div style="display:flex;gap:16px;margin-bottom:16px">
          <div style="width:72px;height:72px;border-radius:50%;background:var(--clr-info-bg);color:var(--clr-info-text);display:flex;align-items:center;justify-content:center;font-size:28px;font-weight:700;flex-shrink:0">
            ${p.displayName.split(' ').map(n => n[0]).join('')}
          </div>
          <div style="flex:1">
            <div style="font-size:14px;font-weight:600;margin-bottom:2px">${p.displayName}</div>
            <div style="font-size:11px;color:var(--color-text-secondary)">${p.jobTitle}</div>
            <div style="font-size:11px;color:var(--color-text-tertiary)">${p.department}</div>
          </div>
        </div>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:14px">
          <div>
            <div style="font-size:10px;font-weight:600;color:var(--color-text-tertiary);margin-bottom:4px">EMAIL</div>
            <div style="font-size:11px">${p.email}</div>
          </div>
          <div>
            <div style="font-size:10px;font-weight:600;color:var(--color-text-tertiary);margin-bottom:4px">UPN</div>
            <div style="font-size:11px">${p.upn}</div>
          </div>
          <div>
            <div style="font-size:10px;font-weight:600;color:var(--color-text-tertiary);margin-bottom:4px">EMPLOYEE ID</div>
            <div style="font-size:11px">${p.employeeId}</div>
          </div>
          <div>
            <div style="font-size:10px;font-weight:600;color:var(--color-text-tertiary);margin-bottom:4px">MANAGER</div>
            <div style="font-size:11px">${p.manager}</div>
          </div>
          <div>
            <div style="font-size:10px;font-weight:600;color:var(--color-text-tertiary);margin-bottom:4px">OFFICE</div>
            <div style="font-size:11px">${p.office}</div>
          </div>
          <div>
            <div style="font-size:10px;font-weight:600;color:var(--color-text-tertiary);margin-bottom:4px">PHONE</div>
            <div style="font-size:11px">${p.phone}</div>
          </div>
        </div>
      </div>
    </div>
  `
}

function renderSecurity() {
  const s = userData.security
  return `
    <div class="card">
      <div class="card-header"><span class="card-title">Security & Risk Status</span></div>
      <div style="padding:16px;border-top:0.5px solid var(--color-border-secondary)">
        <div style="padding:12px;background:var(--clr-success-bg);border-left:3px solid var(--clr-success-text);border-radius:var(--border-radius-md);margin-bottom:16px">
          <div style="font-size:11px;font-weight:600;color:var(--color-text-primary)">Your security score is ${s.securityScore}/100 with ${s.riskLevel} risk level.</div>
        </div>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:14px;margin-bottom:16px">
          <div>
            <div style="font-size:10px;font-weight:600;color:var(--color-text-tertiary);margin-bottom:4px">MFA</div>
            <div style="font-size:12px;color:var(--clr-success-text)">✓ ${s.mfaStatus}</div>
            <div style="font-size:9px;color:var(--color-text-tertiary);margin-top:2px">${s.mfaDefaultMethod}</div>
          </div>
          <div>
            <div style="font-size:10px;font-weight:600;color:var(--color-text-tertiary);margin-bottom:4px">PASSWORD</div>
            <div style="font-size:12px">Changed ${s.passwordLastChanged}</div>
            <div style="font-size:9px;color:var(--color-text-tertiary);margin-top:2px">Expires ${s.passwordExpiryDate}</div>
          </div>
        </div>
        <div style="margin-bottom:16px">
          <div style="font-size:11px;font-weight:600;margin-bottom:8px">Authentication Methods</div>
          ${s.authenticationMethods.map(m => `
            <div style="padding:8px;border-bottom:0.5px solid var(--color-border-tertiary);display:flex;justify-content:space-between;font-size:11px">
              <span>${m.type}</span>
              <span style="color:${m.status === 'Enabled' ? 'var(--clr-success-text)' : 'var(--color-text-tertiary)'}">${m.status}</span>
            </div>
          `).join('')}
        </div>
        <div>
          <div style="font-size:11px;font-weight:600;margin-bottom:8px">Risk Detections (Last 30d)</div>
          ${s.riskDetections.map(r => `
            <div style="padding:8px;border-bottom:0.5px solid var(--color-border-tertiary);display:flex;justify-content:space-between;font-size:11px">
              <span>${r.type}</span>
              <span style="color:${r.status === 'No' ? 'var(--clr-success-text)' : 'var(--color-text-tertiary)'}">${r.status}</span>
            </div>
          `).join('')}
        </div>
      </div>
    </div>
  `
}

function renderSignin() {
  const successSignins = userData.signin.filter(s => s.result === 'Success')
  const failedSignins = userData.signin.filter(s => s.result === 'Failed')

  return `
    <div style="display:flex;flex-direction:column;gap:16px">
      <!-- Sign-in Summary -->
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px">
        <div class="card" style="padding:16px;text-align:center">
          <div style="font-size:24px;font-weight:600;color:var(--clr-success-text)">${successSignins.length}</div>
          <div style="font-size:11px;color:var(--color-text-tertiary);margin-top:4px">Successful Sign-ins</div>
        </div>
        <div class="card" style="padding:16px;text-align:center">
          <div style="font-size:24px;font-weight:600;color:var(--clr-error-text)">${failedSignins.length}</div>
          <div style="font-size:11px;color:var(--color-text-tertiary);margin-top:4px">Failed Sign-ins</div>
        </div>
      </div>

      <!-- Sign-in Details Table -->
      <div class="card">
        <div class="card-header"><span class="card-title">Latest Sign-in Per App (Last 24 Hours)</span></div>
        <div style="padding:0;overflow-x:auto;border-top:0.5px solid var(--color-border-secondary)">
          <table style="width:100%;border-collapse:collapse;font-size:10px">
            <thead style="background:var(--color-background-secondary);position:sticky;top:0">
              <tr>
                <th style="padding:10px 8px;text-align:left;font-weight:600;white-space:nowrap">Date/Time</th>
                <th style="padding:10px 8px;text-align:left;font-weight:600;white-space:nowrap">App</th>
                <th style="padding:10px 8px;text-align:left;font-weight:600;white-space:nowrap">IP Address</th>
                <th style="padding:10px 8px;text-align:left;font-weight:600;white-space:nowrap">Device</th>
                <th style="padding:10px 8px;text-align:left;font-weight:600;white-space:nowrap">OS</th>
                <th style="padding:10px 8px;text-align:left;font-weight:600;white-space:nowrap">Browser</th>
                <th style="padding:10px 8px;text-align:center;font-weight:600;white-space:nowrap">Compliant</th>
                <th style="padding:10px 8px;text-align:left;font-weight:600;white-space:nowrap">Trust Type</th>
                <th style="padding:10px 8px;text-align:left;font-weight:600;white-space:nowrap">Location</th>
                <th style="padding:10px 8px;text-align:center;font-weight:600;white-space:nowrap">Status</th>
              </tr>
            </thead>
            <tbody>
              ${userData.signin.map(s => `
                <tr style="border-bottom:0.5px solid var(--color-border-tertiary)">
                  <td style="padding:8px;white-space:nowrap">${s.date}</td>
                  <td style="padding:8px;font-weight:600">${s.app}</td>
                  <td style="padding:8px;font-family:monospace;font-size:9px">${s.ip}</td>
                  <td style="padding:8px">${s.device}</td>
                  <td style="padding:8px">${s.operatingSystem}</td>
                  <td style="padding:8px">${s.browser}</td>
                  <td style="padding:8px;text-align:center">
                    <span style="padding:2px 6px;border-radius:3px;font-size:9px;font-weight:600;${s.isCompliant === 'Yes' ? 'background:var(--clr-success-bg);color:var(--clr-success-text)' : 'background:var(--clr-warning-bg);color:var(--clr-warning-text)'}">${s.isCompliant}</span>
                  </td>
                  <td style="padding:8px">${s.trustType}</td>
                  <td style="padding:8px">${s.location}</td>
                  <td style="padding:8px;text-align:center">
                    <span style="padding:2px 6px;border-radius:3px;font-size:9px;font-weight:600;${s.result === 'Success' ? 'background:var(--clr-success-bg);color:var(--clr-success-text)' : 'background:var(--clr-error-bg);color:var(--clr-error-text)'}">${s.result}</span>
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>

      <!-- Location Map -->
      <div class="card" style="overflow:hidden">
        <div class="card-header"><span class="card-title">Sign-in Locations Map</span></div>
        <div id="signin-map" style="width:100%;height:300px;border-top:0.5px solid var(--color-border-secondary);background:var(--color-background-secondary)"></div>
      </div>
    </div>
  `
}

function renderLicenses() {
  return `
    <div class="card">
      <div class="card-header"><span class="card-title">Assigned Licenses</span></div>
      <div style="padding:0;border-top:0.5px solid var(--color-border-secondary)">
        ${userData.licenses.map(l => `
          <div style="padding:12px;border-bottom:0.5px solid var(--color-border-tertiary)">
            <div style="font-size:11px;font-weight:600">${l.name}</div>
            <div style="font-size:9px;color:var(--color-text-tertiary);margin-top:3px">SKU: ${l.sku}</div>
            <div style="font-size:9px;color:var(--color-text-tertiary)">Assigned ${l.assignmentType} via ${l.assignmentSource}</div>
          </div>
        `).join('')}
      </div>
    </div>
  `
}

function renderGroups() {
  return `
    <div style="display:flex;flex-direction:column;gap:16px">
      <div class="card">
        <div class="card-header"><span class="card-title">Security Groups (${GROUP_MEMBERSHIPS.securityGroups.length})</span></div>
        <div style="padding:0;border-top:0.5px solid var(--color-border-secondary)">
          ${userData.groups.securityGroups.map(g => `
            <div style="padding:10px 12px;border-bottom:0.5px solid var(--color-border-tertiary);font-size:11px">
              <div style="font-weight:600">${g.name}</div>
              <div style="color:var(--color-text-tertiary);font-size:9px">${g.type} • ${g.membershipType}</div>
            </div>
          `).join('')}
        </div>
      </div>
      <div class="card">
        <div class="card-header"><span class="card-title">Microsoft 365 Groups (${GROUP_MEMBERSHIPS.microsoft365Groups.length})</span></div>
        <div style="padding:0;border-top:0.5px solid var(--color-border-secondary)">
          ${userData.groups.microsoft365Groups.map(g => `
            <div style="padding:10px 12px;border-bottom:0.5px solid var(--color-border-tertiary);font-size:11px">
              <div style="font-weight:600">${g.name}</div>
              <div style="color:var(--color-text-tertiary);font-size:9px">${g.teamConnected ? '✓ Teams' : 'No Teams'} • ${g.dynamicMembership ? 'Dynamic' : 'Static'}</div>
            </div>
          `).join('')}
        </div>
      </div>
      <div class="card">
        <div class="card-header"><span class="card-title">Distribution Lists (${GROUP_MEMBERSHIPS.distributionLists.length})</span></div>
        <div style="padding:0;border-top:0.5px solid var(--color-border-secondary)">
          ${(userData.groups.distributionLists || []).map(d => `
            <div style="padding:10px 12px;border-bottom:0.5px solid var(--color-border-tertiary);font-size:11px">
              <div style="font-weight:600">${d.name}</div>
              <div style="color:var(--color-text-tertiary);font-size:9px">${d.membershipType}</div>
            </div>
          `).join('')}
        </div>
      </div>
    </div>
  `
}

function renderDevices() {
  return `
    <div class="card">
      <div class="card-header"><span class="card-title">Registered Devices</span></div>
      <div style="padding:0;border-top:0.5px solid var(--color-border-secondary)">
        ${userData.devices.map(d => `
          <div style="padding:12px;border-bottom:0.5px solid var(--color-border-tertiary)">
            <div style="font-weight:600;font-size:11px;margin-bottom:6px">${d.name}</div>
            <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;font-size:10px">
              <div><span style="color:var(--color-text-tertiary)">Type:</span> ${d.type}</div>
              <div><span style="color:var(--color-text-tertiary)">OS:</span> ${d.osVersion}</div>
              <div><span style="color:var(--color-text-tertiary)">Status:</span> <span style="color:${d.complianceStatus === 'Compliant' ? 'var(--clr-success-text)' : 'var(--clr-warning-text)'}">${d.complianceStatus}</span></div>
              <div><span style="color:var(--color-text-tertiary)">Ownership:</span> ${d.ownership}</div>
            </div>
          </div>
        `).join('')}
      </div>
    </div>
  `
}

function renderApps() {
  return `
    <div class="card">
      <div class="card-header"><span class="card-title">Applications & Access</span></div>
      <div style="padding:0;overflow:hidden;border-top:0.5px solid var(--color-border-secondary)">
        <table style="width:100%;border-collapse:collapse">
          <thead style="background:var(--color-background-secondary)">
            <tr>
              <th style="padding:10px 12px;text-align:left;font-size:10px;font-weight:600">Application</th>
              <th style="padding:10px 12px;text-align:left;font-size:10px;font-weight:600">Last Accessed</th>
              <th style="padding:10px 12px;text-align:left;font-size:10px;font-weight:600">Scope</th>
              <th style="padding:10px 12px;text-align:left;font-size:10px;font-weight:600">Risk</th>
            </tr>
          </thead>
          <tbody>
            ${(userData.apps || APP_ACCESS).map(a => `
              <tr style="border-bottom:0.5px solid var(--color-border-tertiary)">
                <td style="padding:10px 12px;font-size:11px">${a.name}</td>
                <td style="padding:10px 12px;font-size:11px">${a.lastAccessed}</td>
                <td style="padding:10px 12px;font-size:11px">${a.permissionScope}</td>
                <td style="padding:10px 12px;font-size:11px;color:${a.riskLevel === 'Low' ? 'var(--clr-success-text)' : 'var(--clr-warning-text)'}">${a.riskLevel}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    </div>
  `
}

function renderOneDrive() {
  const o = userData.onedrive
  return `
    <div class="card">
      <div class="card-header"><span class="card-title">OneDrive for Business Storage</span></div>
      <div style="padding:16px;border-top:0.5px solid var(--color-border-secondary)">
        <div style="margin-bottom:16px">
          <div style="font-size:11px;font-weight:600;margin-bottom:8px">Storage Usage</div>
          <div style="background:var(--color-border-tertiary);border-radius:var(--border-radius-md);height:20px;overflow:hidden;margin-bottom:6px">
            <div style="background:var(--clr-primary);height:100%;width:${o.percentageUsed}%"></div>
          </div>
          <div style="font-size:10px;color:var(--color-text-secondary)">${o.usedStorage} of ${o.totalStorage} used (${o.percentageUsed}%)</div>
        </div>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:14px;padding-top:12px;border-top:0.5px solid var(--color-border-tertiary)">
          <div>
            <div style="font-size:10px;font-weight:600;color:var(--color-text-tertiary);margin-bottom:4px">FILES</div>
            <div style="font-size:12px;font-weight:600">${o.fileCount}</div>
          </div>
          <div>
            <div style="font-size:10px;font-weight:600;color:var(--color-text-tertiary);margin-bottom:4px">SHARED ITEMS</div>
            <div style="font-size:12px;font-weight:600">${o.sharedItems}</div>
          </div>
          <div>
            <div style="font-size:10px;font-weight:600;color:var(--color-text-tertiary);margin-bottom:4px">EXTERNAL SHARES</div>
            <div style="font-size:12px;font-weight:600;color:var(--clr-warning-text)">${o.externalShares}</div>
          </div>
          <div>
            <div style="font-size:10px;font-weight:600;color:var(--color-text-tertiary);margin-bottom:4px">ANONYMOUS LINKS</div>
            <div style="font-size:12px;font-weight:600;color:var(--clr-warning-text)">${o.anonymousLinks}</div>
          </div>
        </div>
      </div>
    </div>
  `
}

function renderTeams() {
  const t = userData.teams
  return `
    <div class="card">
      <div class="card-header"><span class="card-title">Microsoft Teams</span></div>
      <div style="padding:16px;border-top:0.5px solid var(--color-border-secondary)">
        <div style="display:grid;grid-template-columns:1fr 1fr 1fr 1fr;gap:12px;margin-bottom:16px;padding-bottom:12px;border-bottom:0.5px solid var(--color-border-tertiary)">
          <div>
            <div style="font-size:10px;font-weight:600;color:var(--color-text-tertiary);margin-bottom:4px">TEAMS</div>
            <div style="font-size:14px;font-weight:600">${t.teamsMembership}</div>
          </div>
          <div>
            <div style="font-size:10px;font-weight:600;color:var(--color-text-tertiary);margin-bottom:4px">OWNED</div>
            <div style="font-size:14px;font-weight:600">${t.teamsOwned}</div>
          </div>
          <div>
            <div style="font-size:10px;font-weight:600;color:var(--color-text-tertiary);margin-bottom:4px">GUEST ACCESS</div>
            <div style="font-size:14px;font-weight:600">${t.guestAccessTeams}</div>
          </div>
          <div>
            <div style="font-size:10px;font-weight:600;color:var(--color-text-tertiary);margin-bottom:4px">PHONE</div>
            <div style="font-size:12px;font-weight:600;color:${t.teamsPhoneLicense ? 'var(--clr-success-text)' : 'var(--color-text-tertiary)'}">${t.teamsPhoneLicense ? '✓ Licensed' : 'Not Licensed'}</div>
          </div>
        </div>
        ${t.teamsPhoneLicense ? `
          <div style="padding:12px;background:var(--clr-info-bg);border-radius:var(--border-radius-md);margin-bottom:12px">
            <div style="font-size:10px;font-weight:600;margin-bottom:4px">Phone Details</div>
            <div style="font-size:10px"><strong>Number:</strong> ${t.assignedNumber}</div>
            <div style="font-size:10px"><strong>Plan:</strong> ${t.callingPlan}</div>
          </div>
        ` : ''}
        <div style="font-size:11px;font-weight:600">My Teams</div>
        <div>
          ${t.teams.map(tm => `
            <div style="padding:8px;border-bottom:0.5px solid var(--color-border-tertiary);font-size:11px">
              <div style="font-weight:600">${tm.name}</div>
              <div style="color:var(--color-text-tertiary);font-size:9px">${tm.role} • Owner: ${tm.owner}</div>
            </div>
          `).join('')}
        </div>
      </div>
    </div>
  `
}

function renderApprovals() {
  if (!PENDING_APPROVALS || PENDING_APPROVALS.length === 0) {
    return `
      <div class="card">
        <div style="padding:32px;text-align:center;color:var(--color-text-secondary);font-size:12px">
          ✓ No pending approvals
        </div>
      </div>
    `
  }
  return `
    <div class="card">
      <div class="card-header"><span class="card-title">Pending Approvals</span></div>
      <div style="padding:0;border-top:0.5px solid var(--color-border-secondary)">
        ${PENDING_APPROVALS.map(a => `
          <div style="padding:12px;border-bottom:0.5px solid var(--color-border-tertiary)">
            <div style="display:flex;justify-content:space-between;align-items:start;margin-bottom:4px">
              <div>
                <div style="font-weight:600;font-size:11px">${a.type}</div>
                <div style="font-size:10px;color:var(--color-text-secondary)">${a.group || a.list}</div>
              </div>
              <span style="background:var(--clr-warning-bg);color:var(--clr-warning-text);padding:2px 6px;border-radius:var(--border-radius-sm);font-size:9px;font-weight:600">${a.status}</span>
            </div>
            <div style="font-size:10px;color:var(--color-text-tertiary);margin-top:4px">${a.description}</div>
          </div>
        `).join('')}
      </div>
    </div>
  `
}

function renderCopilot() {
  const c = COPILOT_READINESS
  return `
    <div style="display:flex;flex-direction:column;gap:16px">
      <div class="card">
        <div class="card-header"><span class="card-title">Copilot Readiness Score</span></div>
        <div style="padding:16px;border-top:0.5px solid var(--color-border-secondary);text-align:center">
          <div style="font-size:10px;color:var(--color-text-tertiary);margin-bottom:8px">Personal AI Readiness</div>
          <div style="font-size:32px;font-weight:700;color:var(--clr-primary)">${c.personalAIReadinessScore}<span style="font-size:14px;color:var(--color-text-tertiary)">/100</span></div>
        </div>
      </div>
      <div class="card">
        <div class="card-header"><span class="card-title">Service Usage</span></div>
        <div style="padding:16px;border-top:0.5px solid var(--color-border-secondary);display:grid;grid-template-columns:1fr 1fr;gap:12px">
          <div>
            <div style="font-size:10px;font-weight:600;color:var(--color-text-tertiary);margin-bottom:4px">EXCHANGE</div>
            <div style="font-size:14px;font-weight:600">${c.exchangeUsage}%</div>
          </div>
          <div>
            <div style="font-size:10px;font-weight:600;color:var(--color-text-tertiary);margin-bottom:4px">TEAMS</div>
            <div style="font-size:14px;font-weight:600">${c.teamsUsage}%</div>
          </div>
          <div>
            <div style="font-size:10px;font-weight:600;color:var(--color-text-tertiary);margin-bottom:4px">ONEDRIVE</div>
            <div style="font-size:14px;font-weight:600">${c.oneDriveUsage}%</div>
          </div>
          <div>
            <div style="font-size:10px;font-weight:600;color:var(--color-text-tertiary);margin-bottom:4px">SHAREPOINT</div>
            <div style="font-size:14px;font-weight:600">${c.sharePointUsage}%</div>
          </div>
        </div>
      </div>
      <div class="card">
        <div class="card-header"><span class="card-title">Recommendations</span></div>
        <div style="padding:0;border-top:0.5px solid var(--color-border-secondary)">
          ${c.recommendations.map(r => `
            <div style="padding:12px;border-bottom:0.5px solid var(--color-border-tertiary)">
              <div style="display:flex;justify-content:space-between;align-items:start;margin-bottom:4px">
                <div style="font-weight:600;font-size:11px">${r.title}</div>
                <span style="background:${r.priority === 'High' ? 'var(--clr-danger-bg)' : 'var(--clr-warning-bg)'};color:${r.priority === 'High' ? 'var(--clr-danger-text)' : 'var(--clr-warning-text)'};padding:2px 6px;border-radius:var(--border-radius-sm);font-size:9px;font-weight:600">${r.priority}</span>
              </div>
              <div style="font-size:10px;color:var(--color-text-secondary);margin-top:4px">${r.impact}</div>
            </div>
          `).join('')}
        </div>
      </div>
    </div>
  `
}

function initSigninMap(el) {
  const mapEl = el.querySelector('#signin-map')
  if (!mapEl) return

  // Check if Leaflet is already loaded
  if (window.L) {
    renderSigninMapContent(mapEl)
  } else {
    // Load CSS first
    const link = document.createElement('link')
    link.rel = 'stylesheet'
    link.href = 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.css'
    link.onload = () => {
      // Then load JS
      const script = document.createElement('script')
      script.src = 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.js'
      script.onload = () => {
        console.log('✓ Leaflet loaded')
        renderSigninMapContent(mapEl)
      }
      script.onerror = () => {
        console.error('Failed to load Leaflet')
        mapEl.innerHTML = '<div style="padding:20px;text-align:center;color:var(--color-text-tertiary)">Map failed to load</div>'
      }
      document.head.appendChild(script)
    }
    document.head.appendChild(link)
  }
}

function renderSigninMapContent(mapEl) {
  try {
    // Get coordinates from sign-in data
    const signinLocations = userData.signin.filter(s => s.latitude && s.longitude)

    if (signinLocations.length === 0) {
      mapEl.innerHTML = '<div style="padding:20px;text-align:center;color:var(--color-text-tertiary)">No location data available for map</div>'
      return
    }

    // Clear any existing map
    mapEl.innerHTML = ''

    // Calculate bounds for all locations
    const lats = signinLocations.map(s => s.latitude)
    const lons = signinLocations.map(s => s.longitude)
    const centerLat = (Math.max(...lats) + Math.min(...lats)) / 2
    const centerLon = (Math.max(...lons) + Math.min(...lons)) / 2

    // Initialize map
    const map = window.L.map(mapEl).setView([centerLat, centerLon], 4)

    // Add CartoDB tiles (more reliable than OpenStreetMap)
    window.L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
      attribution: '© CartoDB',
      maxZoom: 19,
      subdomains: 'abcd'
    }).addTo(map)

    // Add markers
    signinLocations.forEach(signin => {
      const isSuccess = signin.result === 'Success'
      const color = isSuccess ? '#10b981' : '#ef4444'

      const marker = window.L.circleMarker([signin.latitude, signin.longitude], {
        radius: 8,
        fillColor: color,
        color: '#fff',
        weight: 2,
        opacity: 1,
        fillOpacity: 0.8
      })

      marker.bindPopup(`
        <div style="font-size:10px">
          <strong>${signin.app}</strong><br>
          ${signin.location}<br>
          ${signin.date}<br>
          <strong>${signin.result}</strong>
        </div>
      `)

      marker.addTo(map)
    })

    console.log(`✓ Map rendered with ${signinLocations.length} markers`)
  } catch (error) {
    console.error('Map rendering error:', error)
    mapEl.innerHTML = '<div style="padding:20px;text-align:center;color:var(--color-text-tertiary)">Error loading map: ' + error.message + '</div>'
  }
}
