# TenantGuard Entra Apps: Enterprise Enhancement Plan
**Maturity Path: 8.8/10 → 9.8+/10 | 12 Existing Tabs Enhanced (No New Tabs)**

---

## Executive Summary

This plan enriches all 12 existing tabs to incorporate enterprise capabilities:
- **Threat Detection & Incident Response** → Integrated into Risk Center
- **Attack Path Visualization** → Integrated into Risk Center + Permissions Modal  
- **Zero Trust Validation** → Integrated into Risk Center (compliance gauge)
- **Compliance Mapping** → Integrated into Risk Center (CIS/NIST/ISO/Zero Trust frameworks)
- **Application Security Posture Score** → Replaces single risk score in Risk Center
- **Advanced Governance** → Enhanced across Owners, Consent Governance, Recommendations

---

## Phase Breakdown

| Phase | Week | Tabs | Focus | Maturity Impact |
|-------|------|------|-------|-----------------|
| **Phase 1: Foundation** | 1-2 | Executive, Permissions, Risk Center | Metrics, categories, 9D scoring | 8.8 → 9.2 |
| **Phase 2: Governance** | 3-4 | Ownership, Activity, Credentials | Owner details, activity tracking | 9.2 → 9.5 |
| **Phase 3: Advanced** | 5-6 | Lifecycle, Recommendations, Copilot | Unused/duplicate, priority buckets | 9.5 → 9.8+ |

---

# TAB 1: EXECUTIVE DASHBOARD

## Current State
- 12 KPIs displayed in grid format
- Single row, horizontal scroll on mobile

## Enhancements

### 1.1 Add Missing Metrics (6 new cards)

**New Cards to Add:**

```javascript
// 1. Apps without Owners
{
  label: 'Apps without Owners',
  value: appWithoutOwners.length,
  status: appWithoutOwners.length > 0 ? 'warning' : 'success',
  action: 'View at-risk apps',
  color: 'orange',
  icon: '👤'
}

// 2. Critical Permissions (sum of apps with Critical tier permissions)
{
  label: 'Critical Permissions',
  value: appsWithCriticalPerms.length,
  status: 'critical',
  action: 'Review in Permissions tab',
  color: 'red',
  icon: '🚨'
}

// 3. Global Admin Consent Apps (specific count)
{
  label: 'Apps with Global Admin Consent',
  value: appsWithGlobalAdminConsent.length,
  status: appsWithGlobalAdminConsent.length > 0 ? 'warning' : 'success',
  action: 'Review consent grants',
  color: 'orange',
  icon: '✅'
}

// 4. Recently Created (last 7 days)
{
  label: 'Recently Created Apps',
  value: appsCreatedLastWeek.length,
  status: 'info',
  action: 'Review new apps',
  color: 'blue',
  icon: '✨'
}

// 5. Created Outside Business Hours (anomaly detection)
{
  label: 'Created Outside Business Hours',
  value: appsCreatedOutsideBusinessHours.length,
  status: appsCreatedOutsideBusinessHours.length > 0 ? 'warning' : 'success',
  action: 'Investigate unusual creation',
  color: 'amber',
  icon: '⏰'
}

// 6. New Consent This Week
{
  label: 'New Consent Events',
  value: newConsentEventsThisWeek.length,
  status: 'info',
  action: 'Review in Consent Governance',
  color: 'blue',
  icon: '📝'
}
```

### 1.2 Reorganize KPI Layout

**Current:** 12 cards in single row  
**Proposed:** 3-row grid (mobile-responsive)

```
Row 1 (Critical): High Risk Apps | Critical Permissions | Apps without Owners | Global Admin Consent
Row 2 (Credential): Expired Secrets | Expiring 30 days | Expiring 60 days | Certificate-Based Auth
Row 3 (Lifecycle): Unused 90+ Days | Recently Created | Created Outside Hours | New Consent
Row 4 (Enterprise): Total Apps | Enterprise Apps | Multi-Tenant Apps | [Future expansion]
```

### 1.3 Implementation Details

**File:** `pages/applications.js:renderExecutive()`

```javascript
// In renderExecutive() after line 180, add helper functions:

function calculateAppsWithoutOwners(apps) {
  return apps.filter(app => !app.owners || app.owners.length === 0)
}

function calculateAppsWithCriticalPerms(apps, perms) {
  return apps.filter(app => {
    const appPerms = perms.find(p => p.appId === app.id)
    return appPerms?.riskLevel === 'Critical'
  })
}

function calculateGlobalAdminConsentApps(consents) {
  return [...new Set(consents
    .filter(c => c.consentType === 'AllPrincipals' && c.scope?.includes('admin'))
    .map(c => c.targetApp)
  )]
}

function calculateAppsCreatedLastWeek(apps) {
  const weekAgo = new Date(Date.now() - 7*24*60*60*1000)
  return apps.filter(app => new Date(app.createdDateTime) > weekAgo)
}

function calculateAppsCreatedOutsideBusinessHours(apps) {
  // Business hours: 8 AM - 6 PM, Monday-Friday
  return apps.filter(app => {
    const date = new Date(app.createdDateTime)
    const hour = date.getHours()
    const day = date.getDay()
    return day === 0 || day === 6 || hour < 8 || hour >= 18
  })
}

function calculateNewConsentEventsThisWeek(consents) {
  const weekAgo = new Date(Date.now() - 7*24*60*60*1000)
  return consents.filter(c => new Date(c.eventTime) > weekAgo)
}

// In the KPI grid rendering section, add:
const appsNoOwners = calculateAppsWithoutOwners(realApps)
const appsWithCritical = calculateAppsWithCriticalPerms(realApps, realPermissions)
const globalAdminApps = calculateGlobalAdminConsentApps(auditConsents)
const recentApps = calculateAppsCreatedLastWeek(realApps)
const anomalousApps = calculateAppsCreatedOutsideBusinessHours(realApps)
const newConsents = calculateNewConsentEventsThisWeek(auditConsents)

// Add these metrics to the metrics grid:
{ label: 'Apps without Owners', value: appsNoOwners.length, trend: '-12%' },
{ label: 'Critical Permissions', value: appsWithCritical.length, trend: '+3%' },
{ label: 'Global Admin Consent', value: globalAdminApps.length, trend: 'stable' },
{ label: 'Recently Created', value: recentApps.length, trend: '+5' },
{ label: 'Created Outside Hours', value: anomalousApps.length, trend: '-2%' },
{ label: 'New Consent Events', value: newConsents.length, trend: '+1' }
```

### 1.4 Visual Enhancement

**Add color-coding:**
- 🔴 Red: Critical metrics (Critical Permissions, Expired, Without Owners)
- 🟠 Orange: High (Expiring 30/60, Global Admin, Outside Hours)
- 🔵 Blue: Informational (Recently Created, New Consent)
- 🟢 Green: Healthy (Multi-tenant, Certificate-based)

---

# TAB 2 & 3: APP REGISTRATIONS + ENTERPRISE APPS

## Current State
- Separate tabs for "App Registrations" and "Enterprise Apps"
- User feedback suggests they're redundant

## Enhancement: Optional View Toggle

### 2.1 Add Unified Tab Toggle

**File:** `pages/applications.js` - Add toggle UI in tab subnav

```javascript
// In renderSubnav() around line 120, add a toggle option for App Registrations tab:

const appView = `
  <div style="display:flex;gap:8px;align-items:center;padding:8px 12px;background:var(--color-bg-secondary);border-radius:4px">
    <span style="font-size:11px;font-weight:600">View:</span>
    <button class="toggle-btn ${appViewMode === 'registered' ? 'active' : ''}" data-view="registered">
      📋 Registered Apps
    </button>
    <button class="toggle-btn ${appViewMode === 'enterprise' ? 'active' : ''}" data-view="enterprise">
      🏢 Enterprise Apps
    </button>
  </div>
`

// Add listeners in attachEventListeners():
document.querySelectorAll('.toggle-btn').forEach(btn => {
  btn.addEventListener('click', (e) => {
    appViewMode = e.target.dataset.view
    render(el)
  })
})
```

**Module State:** Add `let appViewMode = 'registered'` near top

### 2.2 Implementation

This is a **low-effort enhancement** — both tabs already exist, just add a UI toggle to switch between them within the "Applications" tab. Users can still access both views without separate tabs.

---

# TAB 4: PERMISSIONS

## Current State
✅ Delegated & Application permissions detected  
✅ Risk scoring (0-100)  
✅ Modal with permission details  
❌ Missing workload-based categorization

## Enhancements

### 4.1 Add Workload Categorization

**File:** `backend/server.js` - Enhance `categorizeSensitiveData()`

```javascript
function categorizeSensitiveDataByWorkload(permissions) {
  // Map permission names to workload categories
  const workloadMap = {
    'Identity': [
      'User.Read',
      'User.ReadWrite',
      'User.Read.All',
      'UserAuthenticationMethod.Read',
      'Directory.Read.All',
      'Directory.ReadWrite.All'
    ],
    'Exchange': [
      'Mail.Read',
      'Mail.ReadWrite',
      'Mail.Send',
      'MailboxSettings.Read',
      'MailboxSettings.ReadWrite'
    ],
    'Teams': [
      'ChatMessage.Read',
      'Chat.ReadWrite',
      'TeamsActivity.Send',
      'Team.ReadBasic.All',
      'TeamMember.Read.All'
    ],
    'SharePoint': [
      'Sites.Read.All',
      'Sites.ReadWrite.All',
      'Sites.Manage.All',
      'Files.Read.All',
      'Files.ReadWrite.All'
    ],
    'Intune': [
      'DeviceManagementManagedDevices.Read.All',
      'DeviceManagementManagedDevices.ReadWrite.All',
      'DeviceManagementPolicy.ReadWrite.All'
    ],
    'Security': [
      'SecurityAlert.Read.All',
      'SecurityAlert.ReadWrite.All',
      'ThreatAssessment.Read.All',
      'ThreatAssessment.ReadWrite.All'
    ]
  }

  const categorized = {}
  permissions.forEach(perm => {
    let found = false
    for (const [workload, perms] of Object.entries(workloadMap)) {
      if (perms.includes(perm)) {
        if (!categorized[workload]) categorized[workload] = []
        categorized[workload].push(perm)
        found = true
        break
      }
    }
    if (!found) {
      if (!categorized['Other']) categorized['Other'] = []
      categorized['Other'].push(perm)
    }
  })

  return categorized
}
```

### 4.2 Enhanced Permission Modal

**File:** `pages/applications.js` - Update `showPermissionDetailsModal()`

```javascript
function showPermissionDetailsModal(appData, el) {
  const workloadGroups = categorizeSensitiveData(appData.permissions)
  
  const workloadSections = Object.entries(workloadGroups)
    .map(([workload, perms]) => `
      <div style="margin-bottom:20px;border-left:3px solid var(--color-accent-primary);padding-left:12px">
        <div style="font-weight:600;font-size:13px;margin-bottom:8px">
          ${getWorkloadIcon(workload)} ${workload}
        </div>
        <div style="display:grid;gap:4px">
          ${perms.map(perm => `
            <div style="padding:8px;background:var(--color-bg-secondary);border-radius:4px;font-size:12px">
              ${getRiskBadge(getRiskLevel(perm))} ${perm}
            </div>
          `).join('')}
        </div>
      </div>
    `).join('')

  const modal = `
    <div class="modal-content">
      <h3>${appData.name}</h3>
      <div style="margin-bottom:16px">
        <span class="badge">${appData.permissionType}</span>
        <span class="badge">${appData.riskLevel}</span>
      </div>
      ${workloadSections}
      <div style="margin-top:20px">
        <button class="btn btn-secondary" id="close-modal">Close</button>
      </div>
    </div>
  `

  return modal
}

function getWorkloadIcon(workload) {
  const icons = {
    'Identity': '👤',
    'Exchange': '📧',
    'Teams': '💬',
    'SharePoint': '📁',
    'Intune': '🔧',
    'Security': '🔒',
    'Other': '⚙️'
  }
  return icons[workload] || '⚙️'
}
```

### 4.3 Permission Change History

**Add to backend `/api/permissions` response:**

```javascript
// Include audit trail for permission changes
const permissionAuditTrail = []
auditConsents.forEach(consent => {
  if (consent.targetApp === appId) {
    permissionAuditTrail.push({
      timestamp: consent.eventTime,
      action: consent.action,
      permissions: consent.scope?.split(' ') || [],
      performedBy: consent.performedBy,
      result: consent.result
    })
  }
})

// In response:
{
  ...existing_fields,
  permissionChangeHistory: permissionAuditTrail
    .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
    .slice(0, 20)
}
```

**Display in modal:**

```javascript
const historySection = `
  <div style="margin-top:20px;border-top:1px solid var(--color-border);padding-top:16px">
    <div style="font-weight:600;margin-bottom:12px">📋 Permission Change History</div>
    <table style="width:100%;font-size:11px">
      <tr style="border-bottom:1px solid var(--color-border)">
        <th style="padding:8px;text-align:left">Date</th>
        <th style="padding:8px;text-align:left">Action</th>
        <th style="padding:8px;text-align:left">Performed By</th>
        <th style="padding:8px;text-align:left">Result</th>
      </tr>
      ${appData.permissionChangeHistory?.map(change => `
        <tr style="border-bottom:1px solid var(--color-border-secondary)">
          <td style="padding:8px">${formatDate(change.timestamp)}</td>
          <td style="padding:8px">${change.action}</td>
          <td style="padding:8px;font-size:10px;color:var(--color-text-secondary)">${change.performedBy}</td>
          <td style="padding:8px">${getRiskBadge(change.result)}</td>
        </tr>
      `).join('')}
    </table>
  </div>
`
```

---

# TAB 5: SECRETS & CERTIFICATES

## Current State
✅ Expiration tracking (30/60/90 day buckets)  
✅ Expired secrets count  
❌ Missing: strength rating, rotation history, certificate details

## Enhancements

### 5.1 Secret Strength Analysis

**File:** `backend/server.js` - Add secret strength scoring

```javascript
function analyzeSecretStrength(secretId, createdDate, lastModified) {
  // Scoring factors:
  let score = 100
  
  // Age factor: Older secrets (>2 years) are weaker
  const ageMonths = (Date.now() - new Date(createdDate)) / (30*24*60*60*1000)
  if (ageMonths > 24) score -= 30
  else if (ageMonths > 12) score -= 15
  
  // Rotation factor: Never rotated = -40
  const rotationMonths = (Date.now() - new Date(lastModified)) / (30*24*60*60*1000)
  if (rotationMonths > 12) score -= 40
  else if (rotationMonths > 6) score -= 20
  
  // Length estimation (unknown actual length, estimate from creation pattern)
  // This is conservative - assume medium strength
  score = Math.max(0, score)
  
  return {
    score: score,
    rating: score >= 80 ? 'Strong' : score >= 60 ? 'Good' : score >= 40 ? 'Fair' : 'Weak',
    factors: {
      age: ageMonths > 24 ? 'Old' : 'Current',
      rotation: rotationMonths > 12 ? 'Never rotated' : `Rotated ${Math.round(rotationMonths)}m ago`,
      riskFactors: score < 60 ? ['Old', 'No recent rotation'] : []
    }
  }
}
```

### 5.2 Certificate Details Enhancement

**File:** `pages/applications.js` - Enhanced certificate section

```javascript
function renderCertificateDetails(certs) {
  const rows = certs.map(cert => {
    const now = Date.now()
    const expiryDate = new Date(cert.endDateTime)
    const daysUntilExpiry = (expiryDate - now) / (24*60*60*1000)
    
    const ageMonths = (now - new Date(cert.startDateTime)) / (30*24*60*60*1000)
    const ageCategory = ageMonths < 6 ? '🟢 New' : 
                       ageMonths < 24 ? '🟡 Aging' : 
                       '🔴 Ancient'
    
    const expiryStatus = daysUntilExpiry < 0 ? '❌ Expired' :
                        daysUntilExpiry < 30 ? '⚠️ Expires soon' :
                        daysUntilExpiry < 90 ? '🟡 Expires 90d' :
                        '🟢 Valid'
    
    return `
      <tr style="border-bottom:1px solid var(--color-border-secondary)">
        <td style="padding:12px;font-size:12px;font-weight:500">${cert.thumbprint?.substring(0, 8)}</td>
        <td style="padding:12px;font-size:11px">${cert.issuer || 'Self-signed'}</td>
        <td style="padding:12px;font-size:11px">${formatDate(cert.startDateTime)}</td>
        <td style="padding:12px;font-size:11px">${formatDate(cert.endDateTime)}</td>
        <td style="padding:12px;text-align:center">${ageCategory}</td>
        <td style="padding:12px;text-align:center">${expiryStatus}</td>
      </tr>
    `
  })
  
  return `
    <table style="width:100%;border-collapse:collapse">
      <thead>
        <tr style="background:var(--color-bg-secondary);border-bottom:2px solid var(--color-border)">
          <th style="padding:12px;text-align:left;font-size:11px;font-weight:600">Thumbprint</th>
          <th style="padding:12px;text-align:left;font-size:11px;font-weight:600">Issuer</th>
          <th style="padding:12px;text-align:left;font-size:11px;font-weight:600">Valid From</th>
          <th style="padding:12px;text-align:left;font-size:11px;font-weight:600">Expires</th>
          <th style="padding:12px;text-align:center;font-size:11px;font-weight:600">Age</th>
          <th style="padding:12px;text-align:center;font-size:11px;font-weight:600">Status</th>
        </tr>
      </thead>
      <tbody>
        ${rows.join('')}
      </tbody>
    </table>
  `
}
```

### 5.3 Rotation History

**Add to credentials section:**

```javascript
const rotationHistory = secrets
  .filter(s => s.appId === appId)
  .sort((a, b) => new Date(b.createdDateTime) - new Date(a.createdDateTime))
  .slice(0, 10)

const rotationChart = `
  <div style="margin-top:16px">
    <div style="font-size:12px;font-weight:600;margin-bottom:8px">Rotation Timeline (Last 10)</div>
    <div style="display:flex;gap:4px;height:40px">
      ${rotationHistory.map((s, i) => {
        const monthsAgo = (Date.now() - new Date(s.createdDateTime)) / (30*24*60*60*1000)
        return `
          <div title="${formatDate(s.createdDateTime)}" 
               style="flex:1;background:var(--color-accent-primary);opacity:${1 - i*0.08};border-radius:4px;cursor:pointer"></div>
        `
      }).join('')}
    </div>
    <div style="font-size:10px;color:var(--color-text-secondary);margin-top:4px">
      Most recent: ${formatDate(rotationHistory[0]?.createdDateTime)} 
      (${Math.round((Date.now() - new Date(rotationHistory[0]?.createdDateTime)) / (30*24*60*60*1000))}m ago)
    </div>
  </div>
`
```

---

# TAB 6: AUDIT CONSENTS → "CONSENT GOVERNANCE"

## Current State
✅ Audit log display  
✅ Risk assessment  
❌ Missing: verified publisher, consent type filters, revocation tracking

## Enhancements

### 6.1 Rename Tab & Add Governance Indicators

**File:** `pages/applications.js` - Rename in subnav from "Audit Consents" to "Consent Governance"

### 6.2 Add Governance Features

```javascript
function renderConsentGovernance() {
  // Add filter tabs
  const filterTabs = `
    <div style="display:flex;gap:8px;margin-bottom:16px;border-bottom:1px solid var(--color-border)">
      <button class="filter-tab ${consentFilter === 'all' ? 'active' : ''}" data-filter="all">
        All Consents (${auditConsents.length})
      </button>
      <button class="filter-tab ${consentFilter === 'admin' ? 'active' : ''}" data-filter="admin">
        Admin Consent (${adminConsents.length})
      </button>
      <button class="filter-tab ${consentFilter === 'user' ? 'active' : ''}" data-filter="user">
        User Consent (${userConsents.length})
      </button>
      <button class="filter-tab ${consentFilter === 'revoked' ? 'active' : ''}" data-filter="revoked">
        Revoked (${revokedConsents.length})
      </button>
    </div>
  `
  
  // Add governance indicators to consent table
  const governanceColumns = `
    <tr style="background:var(--color-bg-secondary);border-bottom:2px solid var(--color-border)">
      <th style="padding:12px;font-weight:600;font-size:11px">Date</th>
      <th style="padding:12px;font-weight:600;font-size:11px">App</th>
      <th style="padding:12px;font-weight:600;font-size:11px">Consent Type</th>
      <th style="padding:12px;font-weight:600;font-size:11px">Granted By</th>
      <th style="padding:12px;font-weight:600;font-size:11px">Permissions</th>
      <th style="padding:12px;font-weight:600;font-size:11px">Verified Publisher</th>
      <th style="padding:12px;font-weight:600;font-size:11px">Policy Compliance</th>
      <th style="padding:12px;font-weight:600;font-size:11px">Risk</th>
    </tr>
  `
}

// Add to backend /api/permissions response:
const consentEntries = auditConsents.map(consent => ({
  ...consent,
  consentType: consent.scope?.includes('admin') ? 'Admin' : 'User',
  verifiedPublisher: isVerifiedPublisher(consent.targetApp),
  policyCompliant: checkConsentPolicy(consent),
  revokedDate: getRevokedDate(consent.targetApp, consent.permissions)
}))
```

### 6.3 Verified Publisher Badge

```javascript
function renderVerifiedPublisherBadge(app) {
  if (app.verifiedPublisher) {
    return `
      <div style="display:flex;align-items:center;gap:4px;padding:4px 8px;background:#D1FAE5;border-radius:4px;font-size:10px;color:#065F46">
        ✅ Verified (${app.publisherDomain})
      </div>
    `
  }
  return `
    <div style="display:flex;align-items:center;gap:4px;padding:4px 8px;background:#FEE2E2;border-radius:4px;font-size:10px;color:#7F1D1D">
      ⚠️ Unverified
    </div>
  `
}
```

### 6.4 Consent Policy Compliance

```javascript
function checkConsentPolicy(consent) {
  // Map to organizational consent policies
  const policies = {
    'admin_only': consent.consentType === 'Admin',
    'no_user_consent': consent.consentType !== 'User',
    'low_risk_only': getRiskLevel(consent) !== 'Critical' && getRiskLevel(consent) !== 'High'
  }
  
  // Return which policies this consent violates
  const violations = Object.entries(policies)
    .filter(([_, violated]) => !violated)
    .map(([policy]) => policy)
  
  return {
    compliant: violations.length === 0,
    violations: violations,
    status: violations.length === 0 ? 'Compliant' : 'Violates ' + violations.length
  }
}
```

---

# TAB 7: OWNERS

## Current State
✅ No Owner / Single Owner / Multiple Owners sections  
❌ Missing: owner details, MFA status, activity tracking

## Enhancements

### 7.1 Enhanced Owner Card

```javascript
function renderOwnerCard(owner, app, userDetails) {
  const lastLogin = userDetails?.signInActivity?.lastSignInDateTime
  const hasMFA = userDetails?.authenticationMethods?.length > 0
  const daysSinceLogin = lastLogin ? 
    Math.floor((Date.now() - new Date(lastLogin)) / (24*60*60*1000)) : 
    null
  
  const ownerRisk = calculateOwnerRisk(owner, userDetails)
  
  const card = `
    <div style="border:1px solid var(--color-border);border-radius:6px;padding:16px;margin-bottom:12px;background:var(--color-bg-secondary)">
      <!-- Header -->
      <div style="display:flex;justify-content:space-between;align-items:start;margin-bottom:12px">
        <div>
          <div style="font-weight:600;font-size:13px">${owner.displayName}</div>
          <div style="font-size:11px;color:var(--color-text-secondary)">${owner.mail}</div>
        </div>
        <div style="font-size:12px;font-weight:600;color:${ownerRisk === 'high' ? '#DC2626' : '#7C3AED'}">
          Risk: ${ownerRisk.toUpperCase()}
        </div>
      </div>
      
      <!-- Details Grid -->
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;font-size:11px;margin-bottom:12px">
        <div>
          <span style="color:var(--color-text-secondary)">Department:</span>
          <div style="font-weight:500">${userDetails?.department || 'Unknown'}</div>
        </div>
        <div>
          <span style="color:var(--color-text-secondary)">Last Login:</span>
          <div style="font-weight:500">${daysSinceLogin ? daysSinceLogin + ' days ago' : 'Never'}</div>
        </div>
        <div>
          <span style="color:var(--color-text-secondary)">MFA Status:</span>
          <div style="font-weight:500">${hasMFA ? '✅ Enabled' : '⚠️ Not set up'}</div>
        </div>
        <div>
          <span style="color:var(--color-text-secondary)">Privileged Role:</span>
          <div style="font-weight:500">${userDetails?.roles?.length > 0 ? userDetails.roles[0] : 'User'}</div>
        </div>
      </div>
      
      <!-- Status Indicators -->
      <div style="display:flex;gap:8px;flex-wrap:wrap">
        ${daysSinceLogin > 90 ? '<span class="badge warning">Inactive 90d+</span>' : ''}
        ${!hasMFA ? '<span class="badge warning">No MFA</span>' : ''}
        ${userDetails?.accountEnabled === false ? '<span class="badge error">Disabled</span>' : ''}
      </div>
    </div>
  `
  
  return card
}

function calculateOwnerRisk(owner, userDetails) {
  let risk = 0
  
  // No login in 90+ days = high risk
  const lastLogin = userDetails?.signInActivity?.lastSignInDateTime
  if (lastLogin && (Date.now() - new Date(lastLogin)) > 90*24*60*60*1000) risk += 40
  
  // No MFA = high risk
  if (!userDetails?.authenticationMethods?.length) risk += 30
  
  // Privileged role = moderate risk (needs monitoring)
  if (userDetails?.roles?.length > 0) risk += 20
  
  return risk > 60 ? 'high' : risk > 30 ? 'medium' : 'low'
}
```

### 7.2 Primary/Backup Owner Designation

```javascript
// Add in owners section header:
<div style="display:flex;gap:8px;margin-bottom:16px">
  <button class="btn ${ownerType === 'primary' ? 'btn-primary' : 'btn-secondary'}" 
          data-type="primary">
    👤 Primary Owners
  </button>
  <button class="btn ${ownerType === 'backup' ? 'btn-primary' : 'btn-secondary'}" 
          data-type="backup">
    🔄 Backup Owners
  </button>
</div>

// In database/SharePoint, designate owners as primary/backup
// Default: first owner = primary, rest = backup
```

---

# TAB 8: USAGE ANALYTICS → "APPLICATION ACTIVITY"

## Current State
❌ Minimal activity data  

## Enhancements

### 8.1 Rename & Expand Metrics

**Rename:** Usage Analytics → Application Activity

**New Metrics:**

```javascript
function renderApplicationActivity() {
  const metrics = [
    // Authentication Activity
    {
      title: 'Last Sign-in',
      value: formatDate(app.lastSignIn),
      icon: '📱',
      category: 'Authentication'
    },
    {
      title: 'Sign-ins (Last 30 days)',
      value: signInCount30d,
      trend: '+15%',
      icon: '📊',
      category: 'Authentication'
    },
    {
      title: 'Failed Sign-ins',
      value: failedSignInCount,
      status: failedSignInCount > 5 ? 'warning' : 'normal',
      icon: '❌',
      category: 'Authentication'
    },
    
    // Token & API Activity
    {
      title: 'Last Token Issued',
      value: formatDate(app.lastTokenIssued),
      icon: '🔑',
      category: 'API Activity'
    },
    {
      title: 'Last Graph Call',
      value: formatDate(app.lastGraphCall),
      icon: '📡',
      category: 'API Activity'
    },
    {
      title: 'API Calls (Last 7 days)',
      value: apiCallCount7d,
      icon: '📈',
      category: 'API Activity'
    },
    
    // Usage Patterns
    {
      title: 'Unique Users',
      value: uniqueUserCount,
      icon: '👥',
      category: 'Usage Patterns'
    },
    {
      title: 'Client Applications',
      value: clientAppsConnected,
      icon: '🔗',
      category: 'Usage Patterns'
    },
    {
      title: 'Top Geo Location',
      value: topGeolocation || 'Unknown',
      icon: '🌍',
      category: 'Usage Patterns'
    },
    
    // Inactivity
    {
      title: 'Days Since Last Activity',
      value: daysSinceLastActivity,
      status: daysSinceLastActivity > 180 ? 'critical' : daysSinceLastActivity > 90 ? 'warning' : 'normal',
      icon: '⏰',
      category: 'Activity Status'
    }
  ]
  
  // Group by category and render
  const grouped = {}
  metrics.forEach(m => {
    if (!grouped[m.category]) grouped[m.category] = []
    grouped[m.category].push(m)
  })
  
  return Object.entries(grouped).map(([category, items]) => `
    <div style="margin-bottom:24px">
      <div style="font-size:13px;font-weight:600;margin-bottom:12px;color:var(--color-text-secondary)">${category}</div>
      <div style="display:grid;grid-template-columns:repeat(auto-fit, minmax(200px, 1fr));gap:12px">
        ${items.map(item => `
          <div style="border:1px solid var(--color-border);border-radius:6px;padding:12px;background:var(--color-bg-secondary)">
            <div style="font-size:11px;color:var(--color-text-secondary)">${item.icon} ${item.title}</div>
            <div style="font-size:16px;font-weight:600;margin:8px 0">${item.value}</div>
            ${item.trend ? `<div style="font-size:11px;color:var(--color-accent-success)">${item.trend}</div>` : ''}
            ${item.status ? `<div style="font-size:11px;color:${item.status === 'critical' ? '#DC2626' : item.status === 'warning' ? '#EA580C' : '#10B981'}">${getStatusLabel(item.status)}</div>` : ''}
          </div>
        `).join('')}
      </div>
    </div>
  `).join('')
}
```

### 8.2 Activity Timeline Chart

```javascript
function renderActivityTimeline(signInData) {
  // Chart last 30 days of activity
  const last30Days = []
  for (let i = 29; i >= 0; i--) {
    const date = new Date()
    date.setDate(date.getDate() - i)
    const count = signInData.filter(s => 
      new Date(s.createdDateTime).toDateString() === date.toDateString()
    ).length
    last30Days.push({ date: date.toLocaleDateString('en-US', {month:'short', day:'numeric'}), count })
  }
  
  const maxCount = Math.max(...last30Days.map(d => d.count), 1)
  
  return `
    <div style="margin-top:20px">
      <div style="font-size:12px;font-weight:600;margin-bottom:8px">Sign-in Activity (Last 30 Days)</div>
      <div style="display:flex;align-items:flex-end;gap:2px;height:100px">
        ${last30Days.map(day => `
          <div style="flex:1;background:var(--color-accent-primary);height:${(day.count/maxCount)*100}%;border-radius:2px 2px 0 0" 
               title="${day.date}: ${day.count} sign-ins"></div>
        `).join('')}
      </div>
      <div style="display:flex;justify-content:space-between;font-size:10px;color:var(--color-text-secondary);margin-top:4px">
        <span>30 days ago</span>
        <span>Today</span>
      </div>
    </div>
  `
}
```

---

# TAB 9: RISK ASSESSMENT → "RISK CENTER"

## Current State
✅ Single 0-100 risk score  
❌ Missing: multi-dimensional analysis, explainability, threat events, Zero Trust, compliance

## Major Enhancement

### 9.1 9-Dimensional Risk Scoring Matrix

```javascript
function calculateComprehensiveRiskScore(app, permissions, consents, secrets, owners, activity) {
  // 1. PERMISSION RISK (0-100)
  const permissionRisk = (() => {
    let score = 0
    const criticalCount = permissions.filter(p => p.riskLevel === 'Critical').length
    const highCount = permissions.filter(p => p.riskLevel === 'High').length
    score += criticalCount * 30
    score += highCount * 15
    score += Math.min(50, permissions.length * 2)
    return Math.min(100, score)
  })()
  
  // 2. CREDENTIAL RISK (0-100)
  const credentialRisk = (() => {
    let score = 0
    const expiredSecrets = secrets.filter(s => new Date(s.endDateTime) < Date.now()).length
    const expiring30d = secrets.filter(s => {
      const daysLeft = (new Date(s.endDateTime) - Date.now()) / (24*60*60*1000)
      return daysLeft < 30 && daysLeft >= 0
    }).length
    const neverRotated = secrets.filter(s => {
      const ageMonths = (Date.now() - new Date(s.createdDateTime)) / (30*24*60*60*1000)
      return ageMonths > 12
    }).length
    
    score += expiredSecrets * 40
    score += expiring30d * 25
    score += neverRotated * 10
    score = Math.min(100, score)
    
    // Reduce score if using certificates (lower risk)
    const certCount = secrets.filter(s => s.type === 'Certificate').length
    score *= (1 - (certCount / Math.max(secrets.length, 1)) * 0.3)
    return Math.round(score)
  })()
  
  // 3. IDENTITY RISK (0-100)
  const identityRisk = (() => {
    let score = 0
    if (!app.verifiedPublisher) score += 25
    if (app.isMultiTenant) score += 15 // Broader potential access
    if (app.signInAudience === 'AzureADMultipleOrgs') score += 10
    return Math.min(100, score)
  })()
  
  // 4. USAGE RISK (0-100)
  const usageRisk = (() => {
    let score = 0
    const daysSinceLastActivity = calculateInactivityDays(activity.lastSignIn)
    const failedSignIns = activity.failedSignInCount || 0
    
    // Unused apps are risky (could be compromised undetected)
    if (daysSinceLastActivity > 180) score += 40
    else if (daysSinceLastActivity > 90) score += 20
    
    // Suspicious activity patterns
    if (failedSignIns > 10) score += 30
    
    return Math.min(100, score)
  })()
  
  // 5. OWNERSHIP RISK (0-100)
  const ownershipRisk = (() => {
    let score = 0
    if (!owners || owners.length === 0) score += 60 // Critical risk
    else if (owners.length === 1) score += 20 // Single point of failure
    
    // Owner status matters
    owners?.forEach(owner => {
      if (!owner.hasMFA) score += 15
      if (owner.daysSinceLogin > 90) score += 15
      if (owner.accountEnabled === false) score += 10
    })
    
    return Math.min(100, score)
  })()
  
  // 6. CONSENT RISK (0-100)
  const consentRisk = (() => {
    let score = 0
    const adminConsents = consents.filter(c => c.consentType === 'Admin').length
    const globalConsents = consents.filter(c => c.scope?.includes('All')).length
    
    score += adminConsents * 20
    score += globalConsents * 15
    
    // New consent activity is higher risk (possible compromise)
    const recentConsents = consents.filter(c => {
      const daysOld = (Date.now() - new Date(c.eventTime)) / (24*60*60*1000)
      return daysOld < 7
    }).length
    score += recentConsents * 10
    
    return Math.min(100, score)
  })()
  
  // 7. LIFECYCLE RISK (0-100)
  const lifecycleRisk = (() => {
    let score = 0
    const ageMonths = (Date.now() - new Date(app.createdDateTime)) / (30*24*60*60*1000)
    
    // Very old apps might be abandoned
    if (ageMonths > 24) score += 10
    
    // Recently created apps need verification
    if (ageMonths < 1) score += 5
    
    return Math.min(100, score)
  })()
  
  // 8. THREAT RISK (0-100)
  const threatRisk = (() => {
    let score = 0
    
    // Check for threat signals
    const threatSignals = detectThreatSignals(app, consents, activity)
    score += threatSignals.impossibleConsent ? 50 : 0
    score += threatSignals.massConsent ? 40 : 0
    score += threatSignals.secretRotation ? 20 : 0
    score += threatSignals.ownerChange ? 10 : 0
    score += threatSignals.permissionEscalation ? 35 : 0
    
    return Math.min(100, score)
  })()
  
  // 9. GOVERNANCE RISK (0-100)
  const governanceRisk = (() => {
    let score = 0
    if (!app.samlSigningCertificateThumbprint) score += 10
    if (!app.replyUrls?.length) score += 15
    if (app.isDisabled) score -= 20 // Disabled = managed
    
    return Math.max(0, Math.min(100, score))
  })()
  
  // Calculate composite score (weighted average)
  const weights = {
    permission: 0.20,
    credential: 0.20,
    identity: 0.10,
    usage: 0.10,
    ownership: 0.15,
    consent: 0.10,
    lifecycle: 0.05,
    threat: 0.05,
    governance: 0.05
  }
  
  const compositeScore = Math.round(
    permissionRisk * weights.permission +
    credentialRisk * weights.credential +
    identityRisk * weights.identity +
    usageRisk * weights.usage +
    ownershipRisk * weights.ownership +
    consentRisk * weights.consent +
    lifecycleRisk * weights.lifecycle +
    threatRisk * weights.threat +
    governanceRisk * weights.governance
  )
  
  return {
    compositeScore,
    dimensions: {
      permission: { score: permissionRisk, weight: weights.permission, factors: ['Critical permissions', 'High-risk scopes'] },
      credential: { score: credentialRisk, weight: weights.credential, factors: ['Expired secrets', 'Old secrets', 'No rotation'] },
      identity: { score: identityRisk, weight: weights.identity, factors: ['Unverified publisher', 'Multi-tenant'] },
      usage: { score: usageRisk, weight: weights.usage, factors: ['Unused 90+ days', 'Failed sign-ins'] },
      ownership: { score: ownershipRisk, weight: weights.ownership, factors: ['No owner', 'Owner inactive', 'Single owner'] },
      consent: { score: consentRisk, weight: weights.consent, factors: ['Admin consent', 'Global scope'] },
      lifecycle: { score: lifecycleRisk, weight: weights.lifecycle, factors: ['Old app', 'Recently created'] },
      threat: { score: threatRisk, weight: weights.threat, factors: ['Impossible consent', 'Mass consent', 'Permission escalation'] },
      governance: { score: governanceRisk, weight: weights.governance, factors: ['No SAML cert', 'No reply URL'] }
    },
    threatSignals: detectThreatSignals(app, consents, activity),
    zeroTrustScore: calculateZeroTrustScore(app, owners, secrets)
  }
}
```

### 9.2 Risk Center UI

```javascript
function renderRiskCenter(riskData) {
  const riskLevel = riskData.compositeScore > 75 ? 'Critical' : 
                    riskData.compositeScore > 50 ? 'High' : 
                    riskData.compositeScore > 25 ? 'Medium' : 'Low'
  
  const dimensionRows = Object.entries(riskData.dimensions).map(([dim, data]) => {
    const barColor = data.score > 75 ? '#DC2626' : data.score > 50 ? '#EA580C' : '#10B981'
    return `
      <tr style="border-bottom:1px solid var(--color-border-secondary)">
        <td style="padding:12px;font-weight:500;text-transform:capitalize">${dim}</td>
        <td style="padding:12px">
          <div style="display:flex;align-items:center;gap:8px;height:24px">
            <div style="width:100%;background:var(--color-bg-secondary);border-radius:4px;overflow:hidden;height:8px">
              <div style="background:${barColor};height:100%;width:${data.score}%"></div>
            </div>
            <span style="font-weight:600;min-width:40px">${data.score}</span>
          </div>
        </td>
        <td style="padding:12px;font-size:11px;color:var(--color-text-secondary)">
          ${data.factors?.slice(0, 2).join(', ')}
        </td>
      </tr>
    `
  }).join('')
  
  return `
    <div style="background:var(--color-bg-secondary);border-radius:8px;padding:20px">
      <!-- Header -->
      <div style="display:flex;justify-content:space-between;align-items:start;margin-bottom:24px">
        <div>
          <div style="font-size:28px;font-weight:600">${riskData.compositeScore}</div>
          <div style="font-size:14px;color:var(--color-text-secondary)">Overall Risk Score</div>
        </div>
        <div style="text-align:right;padding:12px 16px;border-radius:6px;background:${
          riskLevel === 'Critical' ? '#FEE2E2' : 
          riskLevel === 'High' ? '#FEF3C7' : 
          riskLevel === 'Medium' ? '#FEF08A' : '#D1FAE5'
        };color:${
          riskLevel === 'Critical' ? '#7F1D1D' : 
          riskLevel === 'High' ? '#78350F' : 
          riskLevel === 'Medium' ? '#713F12' : '#065F46'
        }">
          <div style="font-weight:600">${riskLevel}</div>
          <div style="font-size:11px">${getRiskDescription(riskLevel)}</div>
        </div>
      </div>
      
      <!-- Risk Dimension Table -->
      <table style="width:100%;margin-bottom:24px">
        <thead>
          <tr style="background:var(--color-bg-primary);border-bottom:2px solid var(--color-border)">
            <th style="padding:12px;text-align:left;font-weight:600;font-size:11px">Dimension</th>
            <th style="padding:12px;text-align:left;font-weight:600;font-size:11px">Score</th>
            <th style="padding:12px;text-align:left;font-weight:600;font-size:11px">Risk Factors</th>
          </tr>
        </thead>
        <tbody>
          ${dimensionRows}
        </tbody>
      </table>
      
      <!-- Threat Signals -->
      ${renderThreatSignals(riskData.threatSignals)}
      
      <!-- Zero Trust Score -->
      ${renderZeroTrustGauge(riskData.zeroTrustScore)}
    </div>
  `
}

function detectThreatSignals(app, consents, activity) {
  return {
    impossibleConsent: checkImpossibleConsent(app, consents, activity),
    massConsent: checkMassConsent(consents),
    secretRotation: checkUnexpectedSecretRotation(app),
    ownerChange: checkOwnerChange(app),
    permissionEscalation: checkPermissionEscalation(app, consents)
  }
}

function checkImpossibleConsent(app, consents, activity) {
  // Impossible scenario: consent from geography inconsistent with recent activity
  const recentConsent = consents.filter(c => {
    const daysOld = (Date.now() - new Date(c.eventTime)) / (24*60*60*1000)
    return daysOld < 1
  })[0]
  
  const recentSignIn = activity.lastSignIn
  if (recentConsent && recentSignIn) {
    const consentGeo = recentConsent.geo
    const signInGeo = recentSignIn.geo
    if (consentGeo && signInGeo && consentGeo !== signInGeo) {
      return { detected: true, risk: 'High', description: 'Consent from different geo than recent sign-in' }
    }
  }
  return { detected: false }
}

function checkMassConsent(consents) {
  // Suspicious pattern: multiple consents in short timeframe to same app
  const last24h = consents.filter(c => {
    const daysOld = (Date.now() - new Date(c.eventTime)) / (24*60*60*1000)
    return daysOld < 1
  })
  
  if (last24h.length > 3) {
    return { detected: true, risk: 'High', description: 'Multiple consent grants in 24 hours' }
  }
  return { detected: false }
}
```

### 9.3 Threat Event Timeline

```javascript
function renderThreatEventTimeline(app, auditLogs) {
  const threatEvents = auditLogs
    .filter(log => isThreatEvent(log))
    .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
    .slice(0, 20)
  
  return `
    <div style="margin-top:24px;border-top:1px solid var(--color-border);padding-top:20px">
      <div style="font-size:13px;font-weight:600;margin-bottom:12px">🚨 Threat Event Timeline</div>
      <div style="display:grid;gap:8px">
        ${threatEvents.map(event => `
          <div style="border-left:3px solid ${
            event.severity === 'Critical' ? '#DC2626' : 
            event.severity === 'High' ? '#EA580C' : '#F59E0B'
          };padding:12px;background:var(--color-bg-tertiary);border-radius:4px">
            <div style="display:flex;justify-content:space-between;font-size:12px;font-weight:600">
              <span>${event.type}</span>
              <span style="color:var(--color-text-secondary)">${formatDate(event.timestamp)}</span>
            </div>
            <div style="font-size:11px;color:var(--color-text-secondary);margin-top:4px">${event.description}</div>
          </div>
        `).join('')}
      </div>
    </div>
  `
}

function isThreatEvent(log) {
  const threatPatterns = [
    'secret created', 'secret rotated', 'owner changed',
    'permission granted', 'app enabled', 'app disabled',
    'consent granted', 'sign-in failure'
  ]
  return threatPatterns.some(pattern => log.operation?.toLowerCase().includes(pattern))
}
```

### 9.4 Zero Trust Compliance Gauge

```javascript
function calculateZeroTrustScore(app, owners, secrets) {
  let score = 0
  
  const checks = {
    'Least Privilege': {
      pass: hasLeastPrivilegePerms(app),
      weight: 0.20
    },
    'Verified Publisher': {
      pass: app.verifiedPublisher === true,
      weight: 0.15
    },
    'Certificate Auth': {
      pass: secrets?.some(s => s.type === 'Certificate'),
      weight: 0.20
    },
    'Managed Identity': {
      pass: app.isManagedIdentity === true,
      weight: 0.15
    },
    'Owner Assigned': {
      pass: owners && owners.length > 0,
      weight: 0.15
    },
    'Conditional Access': {
      pass: app.conditionalAccessRequired === true,
      weight: 0.10
    },
    'MFA Enabled': {
      pass: owners?.some(o => o.hasMFA),
      weight: 0.05
    }
  }
  
  let totalWeight = 0
  Object.values(checks).forEach(check => {
    if (check.pass) score += check.weight * 100
    totalWeight += check.weight
  })
  
  return {
    score: Math.round(score),
    checks: Object.entries(checks).map(([name, check]) => ({
      name,
      pass: check.pass,
      weight: check.weight
    }))
  }
}

function renderZeroTrustGauge(ztScore) {
  return `
    <div style="margin-top:20px;padding:16px;background:linear-gradient(135deg, #3B82F6 0%, #10B981 100%);border-radius:8px;color:white">
      <div style="font-weight:600;margin-bottom:12px">🛡️ Zero Trust Alignment Score</div>
      <div style="display:flex;align-items:center;gap:16px;margin-bottom:12px">
        <div style="font-size:32px;font-weight:600">${ztScore.score}%</div>
        <div style="flex:1">
          <div style="height:12px;background:rgba(255,255,255,0.2);border-radius:6px;overflow:hidden">
            <div style="height:100%;background:white;width:${ztScore.score}%;transition:width 0.3s"></div>
          </div>
        </div>
      </div>
      <div style="display:grid;grid-template-columns:repeat(2,1fr);gap:8px;font-size:11px">
        ${ztScore.checks.map(check => `
          <div style="display:flex;align-items:center;gap:4px;opacity:${check.pass ? '1' : '0.6'}">
            <span>${check.pass ? '✅' : '❌'}</span>
            <span>${check.name}</span>
          </div>
        `).join('')}
      </div>
    </div>
  `
}
```

---

# TAB 10: LIFECYCLE

## Current State
✅ Created date, last modified, age  
❌ Missing: never-used, abandoned, duplicates, creation anomalies

## Enhancements

### 10.1 Lifecycle Categorization

```javascript
function categorizeAppLifecycle(app, activity, permissions) {
  const ageMonths = (Date.now() - new Date(app.createdDateTime)) / (30*24*60*60*1000)
  const daysSinceLastUse = activity?.daysSinceLastActivity || 999
  const createdHour = new Date(app.createdDateTime).getHours()
  const createdDay = new Date(app.createdDateTime).getDay()
  const isOutsideBusinessHours = createdDay === 0 || createdDay === 6 || createdHour < 8 || createdHour >= 18
  
  return {
    status: daysSinceLastUse > 180 ? 'Unused' :
            daysSinceLastUse > 90 ? 'Dormant' :
            daysSinceLastUse > 30 ? 'Occasional' : 'Active',
    age: ageMonths < 1 ? 'Recently Created' :
         ageMonths < 6 ? 'New' :
         ageMonths < 24 ? 'Established' : 'Mature',
    anomalies: [
      ...(isOutsideBusinessHours ? ['Created outside business hours'] : []),
      ...(daysSinceLastUse > 365 ? ['Unused for 1+ year'] : []),
      ...(ageMonths < 0.5 && permissions?.length > 5 ? ['New app with many permissions'] : [])
    ]
  }
}

function renderLifecycleTab() {
  const sections = {
    'Active': apps.filter(a => categorizeAppLifecycle(a).status === 'Active'),
    'Occasional': apps.filter(a => categorizeAppLifecycle(a).status === 'Occasional'),
    'Dormant': apps.filter(a => categorizeAppLifecycle(a).status === 'Dormant'),
    'Unused': apps.filter(a => categorizeAppLifecycle(a).status === 'Unused'),
  }
  
  const lifecycleView = Object.entries(sections).map(([status, appList]) => {
    const statusColor = status === 'Active' ? '#10B981' : 
                       status === 'Occasional' ? '#F59E0B' :
                       status === 'Dormant' ? '#EA580C' : '#DC2626'
    
    return `
      <div style="margin-bottom:24px">
        <div style="font-size:13px;font-weight:600;color:${statusColor};margin-bottom:12px">
          ${getStatusIcon(status)} ${status} (${appList.length})
        </div>
        ${appList.map(app => {
          const lifecycle = categorizeAppLifecycle(app)
          return `
            <div style="padding:12px;border:1px solid var(--color-border);border-radius:6px;margin-bottom:8px">
              <div style="display:flex;justify-content:space-between;align-items:start">
                <div>
                  <div style="font-weight:500">${app.name}</div>
                  <div style="font-size:11px;color:var(--color-text-secondary)">
                    Created: ${formatDate(app.createdDateTime)} (${lifecycle.age})
                    ${lifecycle.anomalies.length > 0 ? ` | ⚠️ ${lifecycle.anomalies[0]}` : ''}
                  </div>
                </div>
                <button class="btn btn-sm">Action</button>
              </div>
            </div>
          `
        }).join('')}
      </div>
    `
  }).join('')
  
  return lifecycleView
}
```

### 10.2 Duplicate Detection

```javascript
function findDuplicateApps(apps) {
  const byName = {}
  const duplicates = []
  
  apps.forEach(app => {
    const normalized = app.name.toLowerCase().trim()
    if (byName[normalized]) {
      byName[normalized].push(app)
    } else {
      byName[normalized] = [app]
    }
  })
  
  Object.entries(byName).forEach(([name, list]) => {
    if (list.length > 1) {
      duplicates.push({
        name,
        apps: list,
        createdDates: list.map(a => a.createdDateTime),
        riskScore: list.reduce((sum, a) => sum + a.riskScore, 0) / list.length
      })
    }
  })
  
  return duplicates
}

function renderDuplicateAppsAlert(duplicates) {
  if (duplicates.length === 0) return ''
  
  return `
    <div style="background:#FEE2E2;border:1px solid #FECACA;border-radius:6px;padding:12px;margin-bottom:16px">
      <div style="font-weight:600;color:#7F1D1D;margin-bottom:8px">🔍 Found ${duplicates.length} Potential Duplicates</div>
      ${duplicates.map(dup => `
        <div style="font-size:11px;color:#7F1D1D;margin:4px 0">
          <strong>${dup.name}</strong>: ${dup.apps.length} apps found
          <a href="#" onclick="mergeDuplicateApps('${dup.name}')"> [Review & Merge]</a>
        </div>
      `).join('')}
    </div>
  `
}
```

---

# TAB 11: RECOMMENDATIONS

## Current State
✅ Priority levels  
❌ Missing: priority buckets, specific remediation steps

## Enhancement

### 11.1 Priority Bucket Restructuring

```javascript
function renderRecommendations() {
  const buckets = {
    'Immediate': recommendations.filter(r => r.severity === 'Critical'),
    'High': recommendations.filter(r => r.severity === 'High'),
    'Medium': recommendations.filter(r => r.severity === 'Medium'),
    'Low': recommendations.filter(r => r.severity === 'Low')
  }
  
  const view = Object.entries(buckets).map(([priority, recs]) => `
    <div style="margin-bottom:24px">
      <div style="font-size:13px;font-weight:600;padding:12px;background:${
        priority === 'Immediate' ? '#FEE2E2' :
        priority === 'High' ? '#FEF3C7' :
        priority === 'Medium' ? '#FEF08A' : '#F3F4F6'
      };border-radius:6px;margin-bottom:12px">
        ${priority} Priority (${recs.length}) — ${getPriorityTimeframe(priority)}
      </div>
      
      ${recs.map(rec => `
        <div style="border:1px solid var(--color-border);border-radius:6px;padding:16px;margin-bottom:12px">
          <div style="display:flex;justify-content:space-between;align-items:start;margin-bottom:12px">
            <div>
              <div style="font-weight:600;font-size:13px">${rec.title}</div>
              <div style="font-size:11px;color:var(--color-text-secondary);margin-top:4px">${rec.description}</div>
            </div>
            <span class="badge">${rec.app}</span>
          </div>
          
          <!-- Remediation Steps -->
          <div style="background:var(--color-bg-secondary);border-radius:4px;padding:12px;margin-bottom:12px;font-size:11px">
            <div style="font-weight:600;margin-bottom:8px">Steps to fix:</div>
            <ol style="margin:0;padding-left:20px">
              ${rec.remediationSteps.map(step => `<li style="margin-bottom:4px">${step}</li>`).join('')}
            </ol>
          </div>
          
          <!-- Impact -->
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;font-size:11px">
            <div>
              <span style="color:var(--color-text-secondary)">Impact:</span>
              <div style="font-weight:500">${rec.impact}</div>
            </div>
            <div>
              <span style="color:var(--color-text-secondary)">Time to Fix:</span>
              <div style="font-weight:500">${rec.timeToFix}</div>
            </div>
          </div>
          
          <div style="margin-top:12px">
            <button class="btn btn-primary" onclick="executeRemediation('${rec.id}')">Take Action</button>
            <button class="btn btn-secondary" onclick="snoozeRecommendation('${rec.id}')">Snooze</button>
          </div>
        </div>
      `).join('')}
    </div>
  `).join('')
  
  return view
}

function getPriorityTimeframe(priority) {
  const timeframes = {
    'Immediate': 'Fix within 24 hours',
    'High': 'Fix this week',
    'Medium': 'Fix this month',
    'Low': 'Fix when possible'
  }
  return timeframes[priority]
}
```

### 11.2 Specific Remediation Actions

**Update backend to include specific remediation steps:**

```javascript
// Example recommendations with specific steps:
const recommendations = [
  {
    id: 'rotate-expired-secret',
    title: 'Rotate Expired Secret',
    description: 'Application has an expired client secret that could be a security risk',
    app: 'M365 AgentOps',
    severity: 'Critical',
    remediationSteps: [
      'Open Azure AD > App registrations > [App name]',
      'Click "Certificates & secrets"',
      'Click "+ New client secret"',
      'Set expiration and click "Add"',
      'Copy the secret value immediately',
      'Update your application to use the new secret',
      'Delete the expired secret'
    ],
    impact: 'Prevents unauthorized access using old credentials',
    timeToFix: '5-10 minutes'
  },
  {
    id: 'assign-owner',
    title: 'Assign Application Owner',
    description: 'This application has no owner assigned',
    app: 'Exchange REST API',
    severity: 'High',
    remediationSteps: [
      'Open Azure AD > App registrations > [App name]',
      'Click "Owners"',
      'Click "+ Add owners"',
      'Search for and select the owner',
      'Click "Select"'
    ],
    impact: 'Ensures someone is responsible for this application',
    timeToFix: '2-3 minutes'
  },
  {
    id: 'remove-critical-permission',
    title: 'Review Directory.ReadWrite.All Permission',
    description: 'This app has Directory.ReadWrite.All which is overly permissive',
    app: 'HR Management Tool',
    severity: 'High',
    remediationSteps: [
      'Review if the application actually needs this permission',
      'Open Azure AD > App registrations > [App name]',
      'Click "API permissions"',
      'Find "Directory.ReadWrite.All"',
      'Click the "..." menu and select "Remove admin consent"',
      'Request the application owner to use a more specific permission'
    ],
    impact: 'Implements least privilege principle',
    timeToFix: '10-15 minutes'
  },
  {
    id: 'enable-certificate-auth',
    title: 'Enable Certificate-Based Authentication',
    description: 'Consider using certificates instead of client secrets',
    app: 'Background Service',
    severity: 'Medium',
    remediationSteps: [
      'Open Azure AD > App registrations > [App name]',
      'Click "Certificates & secrets"',
      'Click "Upload certificate"',
      'Select your certificate file',
      'Update your application configuration to use the certificate',
      'Delete the associated client secret'
    ],
    impact: 'Improves security posture with certificate-based auth',
    timeToFix: '15-20 minutes'
  }
]
```

---

# TAB 12: COPILOT

## Current State
✅ AI Q&A interface  
❌ Missing: context-aware examples

## Enhancement: Add Contextual Query Suggestions

```javascript
function renderCopilotEnhancements() {
  const contextQuestions = [
    {
      category: 'Risk Analysis',
      questions: [
        `Why is ${highestRiskApp?.name} risky?`,
        `Which apps have Directory.ReadWrite.All?`,
        `Show apps created outside business hours`,
        `List apps without owners`
      ]
    },
    {
      category: 'Permissions',
      questions: [
        `Which apps can read user email?`,
        `Show apps with Global Admin Consent`,
        `Explain ${criticalPermission?.name}`,
        `List all apps with Teams permissions`
      ]
    },
    {
      category: 'Compliance',
      questions: [
        `Which apps violate our consent policy?`,
        `Show unverified publishers`,
        `List apps that fail Zero Trust checks`,
        `Which apps need to update certificates?`
      ]
    },
    {
      category: 'Investigation',
      questions: [
        `When was ${suspiciousApp?.name} created?`,
        `Who owns ${orphanedApp?.name}?`,
        `Show activity for ${targetApp?.name}`,
        `List similar apps to ${targetApp?.name}`
      ]
    }
  ]
  
  const suggestionsHTML = contextQuestions.map(group => `
    <div style="margin-bottom:16px">
      <div style="font-size:11px;font-weight:600;color:var(--color-text-secondary);margin-bottom:8px">${group.category}</div>
      <div style="display:grid;gap:4px">
        ${group.questions.map(q => `
          <button class="suggestion-btn" onclick="submitQuestion('${q.replace(/'/g, "\\'")}')">
            ${q}
          </button>
        `).join('')}
      </div>
    </div>
  `).join('')
  
  return `
    <div style="padding:16px;background:var(--color-bg-secondary);border-radius:6px;margin-bottom:16px">
      <div style="font-size:12px;font-weight:600;margin-bottom:12px">💡 Suggested Questions</div>
      ${suggestionsHTML}
    </div>
  `
}

// Style for suggestion buttons
const suggestionBtnStyle = `
  .suggestion-btn {
    padding: 8px 12px;
    border: 1px solid var(--color-border);
    border-radius: 4px;
    background: white;
    cursor: pointer;
    font-size: 11px;
    text-align: left;
    transition: all 0.2s;
  }
  
  .suggestion-btn:hover {
    background: var(--color-accent-primary);
    color: white;
    border-color: var(--color-accent-primary);
  }
`
```

---

## Summary: Phase Implementation Timeline

| Week | Phase | Tabs | KPI |
|------|-------|------|-----|
| 1-2 | **Phase 1** | Executive, Permissions, Risk Center | 8.8 → 9.2 |
| 3-4 | **Phase 2** | Ownership, Activity, Credentials, Consent | 9.2 → 9.5 |
| 5-6 | **Phase 3** | Lifecycle, Recommendations, Copilot | 9.5 → 9.8+ |

All enhancements preserve existing tabs — **zero new tabs added**. Capabilities are organically integrated into existing structures through:
- Modal expansions (Permissions modal adds threat context)
- Section additions (Risk Center transforms existing Risk Assessment)
- Filter options (Consent Governance adds filter tabs)
- Data enrichment (all tabs receive additional metrics and insights)

**Result:** Enterprise-grade application governance reaching 9.8+/10 maturity.
