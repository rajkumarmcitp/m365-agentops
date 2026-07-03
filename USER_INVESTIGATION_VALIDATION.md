# User Investigation Page - Validation & Implementation Guide

## ✅ Validation Checklist

The User Investigation page should be organized into **2 clear categories**:

### Category 1: Actions Performed by the User (What did the user do?)

- [ ] **Sign-in Activity**
  - Graph API: `GET /auditLogs/signIns?$filter=userPrincipalName eq '{UPN}'`
  - Display: Timestamp, Location, Device, OS, Browser, Auth Method, MFA Status, Risk Level
  - Table Format: Timestamp | Location | Device | Status | Risk Level

- [ ] **Risk Detections**
  - Graph API: `GET /identityProtection/riskDetections?$filter=userId eq '{UserId}'`
  - Display: Detection Type, Risk Level, Risk State, Location, Detection Time
  - Table Format: Detection Type | Risk Level | Location | Time

- [ ] **Registered Devices**
  - Graph API: `GET /users/{id}/registeredDevices`
  - Display: Device Name, Device ID, Join Type, OS
  - Table Format: Device Name | OS | Join Type | ID

- [ ] **Managed Devices (Intune)**
  - Graph API: `GET /deviceManagement/managedDevices?$filter=userPrincipalName eq '{UPN}'`
  - Display: Device Name, Compliance State, Encryption, Last Sync, Ownership
  - Table Format: Device Name | Compliance | Encryption | Last Sync

- [ ] **OAuth Consent**
  - Graph API: `GET /oauth2PermissionGrants?$filter=principalId eq '{UserId}'`
  - Display: Application, Consent Type, Permission Scope, Created Date
  - Table Format: App Name | Permissions | Consent Type | Date

- [ ] **Security Alerts**
  - Graph API: `GET /security/alerts_v2?$filter=userStates/any(u:u/userPrincipalName eq '{UPN}')`
  - Display: Alert Name, Severity, Status, Detection Source, Created Time
  - Table Format: Alert | Severity | Status | Source | Time

---

### Category 2: Actions Performed on User Account (What happened to the user's account?)

- [ ] **Account Changes (Directory Audit)**
  - Graph API: `GET /auditLogs/directoryAudits?$filter=targetResources/any(t:t/id eq '{UserId}')`
  - Display by subcategory:
    - **Password Reset**: Initiated By, Time, Result
    - **MFA Changes**: Method (added/removed), Actor, Timestamp
    - **Role Assignment**: Role Name, Initiated By, Action (assign/remove), Timestamp
    - **Group Membership**: Group Name, Action (added/removed), Initiated By, Timestamp
    - **License Changes**: SKU, Actor, Action (assign/remove), Timestamp
    - **User Status**: Action (enabled/disabled/deleted), Initiated By, Timestamp
    - **Profile Updates**: Modified Properties, Actor, Timestamp
  - Table Format: Action | Details | Initiated By | Time | Status

---

## 📊 Visual Structure

```
┌─────────────────────────────────────────────────────────────────┐
│                      User Investigation                         │
│            Comprehensive user activity analysis                 │
└─────────────────────────────────────────────────────────────────┘

[User Search] [Days Back] [Date Range] [Investigate Button]

┌─────────────────────────────────────────────────────────────────┐
│                        User Summary                             │
│  Last Sign-in | Risk Score | Active Devices | Account Status   │
└─────────────────────────────────────────────────────────────────┘

╔═════════════════════════════════════════════════════════════════╗
║ 👤 ACTIONS PERFORMED BY THE USER (What did the user do?)       ║
║─────────────────────────────────────────────────────────────────║
│ ┌──────────────────────────────────────────────────────────┐   │
│ │ 🔐 Sign-in Activity                                      │   │
│ │ Table: Timestamp | Location | Device | Status | Risk    │   │
│ └──────────────────────────────────────────────────────────┘   │
│                                                                  │
│ ┌──────────────────────────────────────────────────────────┐   │
│ │ ⚠️ Risk Detections                                        │   │
│ │ Table: Detection Type | Risk Level | Location | Time    │   │
│ └──────────────────────────────────────────────────────────┘   │
│                                                                  │
│ ┌──────────────────────────────────────────────────────────┐   │
│ │ 💻 Devices Used                                          │   │
│ │ Table: Device | OS | Join Type | Last Sync | Managed   │   │
│ └──────────────────────────────────────────────────────────┘   │
│                                                                  │
│ ┌──────────────────────────────────────────────────────────┐   │
│ │ 🔑 OAuth Permissions Granted                             │   │
│ │ Table: Application | Permissions | Consent Type | Date  │   │
│ └──────────────────────────────────────────────────────────┘   │
│                                                                  │
│ ┌──────────────────────────────────────────────────────────┐   │
│ │ 🚨 Security Alerts                                       │   │
│ │ Table: Alert | Severity | Status | Source | Time       │   │
│ └──────────────────────────────────────────────────────────┘   │
╚═════════════════════════════════════════════════════════════════╝

╔═════════════════════════════════════════════════════════════════╗
║ 📝 ACTIONS PERFORMED ON USER ACCOUNT (What happened to account?)║
║─────────────────────────────────────────────────────────────────║
│ ┌──────────────────────────────────────────────────────────┐   │
│ │ 📋 Account Changes                                       │   │
│ │                                                           │   │
│ │ Password Reset                                           │   │
│ │ ├─ 2026-06-01 10:15 - Reset by John Smith - Success   │   │
│ │                                                           │   │
│ │ MFA Changes                                              │   │
│ │ ├─ 2026-06-01 09:30 - Microsoft Authenticator added   │   │
│ │ ├─ 2026-05-28 14:20 - SMS authentication removed       │   │
│ │                                                           │   │
│ │ Role Assignment                                          │   │
│ │ ├─ 2026-06-01 08:00 - Global Admin assigned (by Admin1)│   │
│ │ ├─ 2026-05-30 15:45 - Teams Admin removed (by Admin2)  │   │
│ │                                                           │   │
│ │ Group Membership                                         │   │
│ │ ├─ 2026-06-01 07:30 - Added to Security Team           │   │
│ │ ├─ 2026-05-27 12:00 - Removed from Interns group      │   │
│ │                                                           │   │
│ │ License Changes                                          │   │
│ │ ├─ 2026-05-31 14:00 - Office 365 E5 assigned          │   │
│ │ ├─ 2026-05-15 10:00 - Teams Essentials removed        │   │
│ │                                                           │   │
│ │ Account Status                                           │   │
│ │ ├─ 2026-06-01 - Enabled (Admin action)                 │   │
│ └──────────────────────────────────────────────────────────┘   │
╚═════════════════════════════════════════════════════════════════╝
```

---

## 🔧 Implementation Notes

### Data Fetching
Each category fetches data from specific Graph API endpoints:

**Category 1 Endpoints** (7 endpoints):
```
1. /auditLogs/signIns
2. /identityProtection/riskDetections
3. /users/{id}/registeredDevices
4. /deviceManagement/managedDevices
5. /oauth2PermissionGrants
6. /security/alerts_v2
```

**Category 2 Endpoint** (1 endpoint):
```
1. /auditLogs/directoryAudits (filtered by targetResources.id)
```

### Rendering Strategy

**Category 1**: Each subsection renders as a separate card with a table
- If no data: Show "No activity detected"
- Table shows most recent first (sort by timestamp DESC)

**Category 2**: Single card with grouped account changes
- Group by action type (Password Reset, MFA Changes, etc.)
- Show hierarchical list with timestamps
- If no changes: Show "No account modifications detected"

### User Summary Section
Display at top before categories:
- Last Sign-in Time
- Current Risk Score
- Active Device Count
- Account Status (Enabled/Disabled)
- Account Created Date
- Last Password Change

---

## ✅ Current Status vs. Target

| Aspect | Current | Target | Status |
|--------|---------|--------|--------|
| Categories | 5 sections (mixed) | 2 clear categories | ❌ Needs Update |
| Category 1 Items | 2 (App Access, Sign-ins) | 6 (Sign-ins, Risks, Devices, OAuth, Alerts) | ❌ Incomplete |
| Category 2 Items | 2 (Audit, Other Accounts) | 1 unified (Account Changes) | ⚠️ Needs Consolidation |
| Graph Endpoints | Partial | 8 specified endpoints | ⚠️ Partial |
| Risk Timeline | Present | Not needed (info in other sections) | ❌ Remove |
| Actions on Others | Present | Not in scope (privacy) | ⚠️ Consider Removing |

---

## 🚀 Priority Actions

1. **Remove sections that don't fit the 2-category model**
   - Remove "Actions on Other Accounts" (not in scope)
   - Remove "Risk Timeline" (redundant with other data)
   - Remove "Application Access" (captured in Sign-ins)

2. **Add missing sections for Category 1**
   - Risk Detections
   - OAuth Permissions Granted
   - Security Alerts

3. **Reorganize Category 2**
   - Consolidate all audit-based changes under "Account Changes"
   - Group by change type with hierarchical display

4. **Update Graph API calls**
   - Add new endpoints for missing data
   - Filter correctly by user ID and date range
   - Handle empty responses gracefully

---

## 📋 Testing Checklist

- [ ] Both categories render correctly
- [ ] Each subsection shows real data from Graph API
- [ ] Tables show most recent data first
- [ ] Date filters work correctly (7/14/30 days)
- [ ] Custom date range works
- [ ] Empty states show appropriate message
- [ ] Skeleton loading shows before data loads
- [ ] Mobile responsive layout
- [ ] Performance acceptable (< 3 second load)

---

This structure provides a **focused, security-driven investigation experience** without unnecessary complexity.
