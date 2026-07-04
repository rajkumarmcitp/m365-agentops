# Directory Audits - Complete Validation & Implementation

## Overview

For **actions performed on a user account**, the single most valuable Microsoft Graph endpoint is **Directory Audits** (`/auditLogs/directoryAudits`). Nearly every administrative change to a Microsoft Entra ID user is captured here.

---

## Primary Graph API Endpoint

### Query User's Audit Events

```http
GET https://graph.microsoft.com/v1.0/auditLogs/directoryAudits
?$filter=targetResources/any(t:t/id eq '{UserId}')
&$orderby=activityDateTime desc
&$top=100
```

### With Date Range (Last 90 Days)

```http
GET /v1.0/auditLogs/directoryAudits
?$filter=
targetResources/any(t:t/id eq 'USER_GUID')
and activityDateTime ge 2026-04-04T00:00:00Z
&$orderby=activityDateTime desc
&$top=100
```

### Filter by Activity Type

```http
GET /v1.0/auditLogs/directoryAudits
?$filter=
targetResources/any(t:t/id eq 'USER_GUID')
and (
activityDisplayName eq 'Update user'
or activityDisplayName eq 'Reset password'
or activityDisplayName eq 'Add member to role'
or activityDisplayName eq 'Remove member from role'
or activityDisplayName eq 'Assign license'
or activityDisplayName eq 'Add member to group'
)
```

---

## Implementation Details

### Backend Configuration

File: `/backend/server.js`

**Endpoint:** `GET /api/user-investigation/account-changes`

**Features:**
- ✅ Fetches last 90 days of audit events
- ✅ Filters by userId using `targetResources/any(t:t/id eq '{userId}')`
- ✅ Orders by `activityDateTime desc` (newest first)
- ✅ Returns top 100 events
- ✅ Normalizes all responses to standard schema

### Normalization Schema

Each audit record is normalized to this standard schema for consistency:

```javascript
{
  // Core investigation fields
  id: string,                    // Audit record ID
  eventTime: datetime,           // When action occurred
  action: string,                // Activity display name
  category: string,              // Categorized activity type

  // Actor information
  actor: string,                 // Display name of who did it
  actorUpn: string,              // UPN of actor
  actorType: string,             // 'User' or 'System'

  // Target information
  targetUser: string,            // User principal name of modified account
  targetType: string,            // Type of target (User, etc)

  // Operation details
  result: string,                // 'Success' or 'Failed'
  operationType: string,         // Add, Update, Delete, Assign, etc
  service: string,               // Microsoft Entra ID

  // Change details
  beforeValue: any,              // Previous value
  afterValue: any,               // New value
  allModifiedProperties: array,  // All property changes

  // Correlation
  correlationId: string,         // GUID for related events

  // Raw data (for debugging)
  raw: object                    // Original Graph response fields
}
```

---

## Activity Categorization

The backend automatically categorizes activities into these 9 categories:

| Category | Examples |
|----------|----------|
| **Identity Changes** | Update user, Enable user, Disable user, Change display name |
| **Authentication Changes** | Register authentication method, Remove MFA, Add authenticator |
| **Privilege Changes** | Add member to role, Remove member from role, Grant admin |
| **Group Changes** | Add member to group, Remove member from group |
| **License Changes** | Assign license, Remove license, Change subscription |
| **Application Changes** | Add app owner, Add service principal, Add app role assignment |
| **Security Changes** | Conditional Access updates, Authentication policy changes, MFA policy |
| **Account Lifecycle** | Create user, Delete user, Restore user, Suspend user |
| **Other Changes** | Any activity not matching above categories |

### Categorization Logic

```javascript
function categorizeActivity(displayName) {
  const name = displayName?.toLowerCase() || ''

  if (name.includes('password') || name.includes('reset')) 
    return 'Identity Changes'
  if (name.includes('authentication') || name.includes('mfa') || name.includes('authenticator')) 
    return 'Authentication Changes'
  if (name.includes('role') && (name.includes('add') || name.includes('remove'))) 
    return 'Privilege Changes'
  // ... etc
}
```

---

## Frontend Display

### Categorized Event View

Events are displayed grouped by category with:
- **Category icon & name** - Visual indicator of activity type
- **Event count** - Number of events in each category
- **Individual events** - Showing:
  - Action taken
  - Before/after values
  - Who performed it
  - When it happened
  - Success/Failed status

### Example Display

```
⚡ Privilege Changes (3)
  ┌─────────────────────────────────────────────┐
  │ Add member to role (Fabric Administrator)   │
  │ By: Global Administrator (admin@contoso.com)│
  │ Status: Success                             │
  │ Jul 4, 2026, 09:15:00 AM                   │
  └─────────────────────────────────────────────┘

🔐 Authentication Changes (2)
  ┌─────────────────────────────────────────────┐
  │ Register authentication method (Add Windows │
  │ Hello for Business)                         │
  │ By: user@contoso.com                        │
  │ Status: Success                             │
  │ Jul 3, 2026, 02:30:00 PM                   │
  └─────────────────────────────────────────────┘
```

---

## Important Graph API Fields

| JSON Property | Description | Example |
|---------------|-------------|---------|
| `id` | Unique audit record ID | UUID |
| `activityDateTime` | When action occurred | 2026-07-04T09:15:42Z |
| `activityDisplayName` | Human-readable action | "Reset password" |
| `category` | Audit category | "UserManagement" |
| `operationType` | Type of operation | "Update", "Add", "Delete" |
| `result` | Outcome of action | "Success", "Failure" |
| `loggedByService` | Which service logged it | "Core Directory" |
| `initiatedBy.user.displayName` | Who did it | "Global Administrator" |
| `initiatedBy.user.userPrincipalName` | Actor's UPN | admin@contoso.com |
| `targetResources[0].id` | What was modified | User ID |
| `targetResources[0].userPrincipalName` | Target UPN | user@contoso.com |
| `targetResources[0].modifiedProperties` | What changed | Array of property changes |
| `modifiedProperties[].displayName` | Property name | "Enabled" |
| `modifiedProperties[].oldValue` | Previous value | "False" |
| `modifiedProperties[].newValue` | New value | "True" |
| `correlationId` | Correlation ID | UUID |

---

## Investigation Examples

### Example 1: Password Reset

**Raw Audit Event:**
```json
{
  "activityDateTime": "2026-07-04T09:15:42Z",
  "activityDisplayName": "Reset password",
  "initiatedBy": {
    "user": {
      "displayName": "Global Administrator",
      "userPrincipalName": "admin@contoso.com"
    }
  },
  "result": "Success",
  "targetResources": [
    {
      "userPrincipalName": "user@contoso.com",
      "id": "user-id-guid"
    }
  ]
}
```

**Normalized View:**
```
Category: Identity Changes
Action: Reset password
By: Global Administrator (admin@contoso.com)
Status: Success
Time: Jul 4, 2026, 09:15 AM
```

### Example 2: Role Assignment

**Raw Audit Event:**
```json
{
  "activityDateTime": "2026-07-03T14:30:00Z",
  "activityDisplayName": "Add member to role",
  "operationType": "Assign",
  "initiatedBy": {
    "user": {
      "displayName": "Identity Administrator",
      "userPrincipalName": "idadmin@contoso.com"
    }
  },
  "result": "Success",
  "targetResources": [
    {
      "modifiedProperties": [
        {
          "displayName": "Role.DisplayName",
          "oldValue": null,
          "newValue": "Fabric Administrator"
        }
      ]
    }
  ]
}
```

**Normalized View:**
```
Category: Privilege Changes  ⚡
Action: Add member to role (Fabric Administrator)
By: Identity Administrator (idadmin@contoso.com)
Status: Success
Time: Jul 3, 2026, 02:30 PM
```

---

## Investigation Summary Template

After processing directory audits, generate a concise summary:

```
User Account Investigation

Target User
user@contoso.com

Investigation Period
Last 30 Days

Events Detected (23 total)
├─ Privilege Changes (3)
├─ Authentication Changes (2)
├─ Identity Changes (8)
├─ License Changes (4)
├─ Group Changes (6)
└─ Other Changes (0)

Key Activities
✓ Password reset by Global Administrator on 04-Jul
✓ Microsoft Authenticator added as authentication method
✓ Added to Finance Group and Security Group
✓ Microsoft 365 E5 license assigned
✓ Fabric Administrator role assigned (04-Jul)

Risk Assessment
⚠️ MEDIUM - Elevated privileges assigned recently
✓ All operations successful (no failed attempts)
✓ No account disable/delete operations
✓ Normal administrative maintenance pattern

Status
Normal account administration. Monitor Fabric Administrator 
role usage to ensure it's being used as expected.
```

---

## API Response Format

### Success Response
```json
{
  "success": true,
  "data": [
    {
      "id": "audit-id",
      "eventTime": "2026-07-04T09:15:42Z",
      "action": "Reset password",
      "category": "Identity Changes",
      "actor": "Global Administrator",
      "actorUpn": "admin@contoso.com",
      "targetUser": "user@contoso.com",
      "result": "Success",
      "beforeValue": null,
      "afterValue": "Password reset",
      "correlationId": "guid"
    }
    // ... more events
  ],
  "metadata": {
    "total": 23,
    "source": "Microsoft Graph /auditLogs/directoryAudits",
    "endpoint": "/auditLogs/directoryAudits?$filter=targetResources/any(...)"
  }
}
```

---

## Validation Checklist

When investigating account changes, verify:

- ✅ **Completeness** - All 90 days of events retrieved
- ✅ **Accuracy** - Dates correctly formatted
- ✅ **Categorization** - Activities correctly categorized
- ✅ **Actor Info** - Clear who performed each action
- ✅ **Target Info** - Clear what account was modified
- ✅ **Before/After** - Property changes clearly shown
- ✅ **Status** - Success/Failed clearly indicated
- ✅ **Correlation** - Related events linked by correlationId

---

## Performance Notes

- **Default limit:** 100 events per request
- **Date range:** 90 days optimal (full history available)
- **Refresh rate:** Real-time (logs available immediately)
- **Latency:** Usually <1 second response

---

## Common Investigation Patterns

### Pattern 1: Privilege Escalation
Look for: "Add member to role" + high-privilege roles (Admin, Security Admin, etc)
Risk: 🔴 HIGH

### Pattern 2: Account Compromise
Look for: "Reset password" + "Enable user" + "Add member to group" + unusual locations/times
Risk: 🔴 CRITICAL

### Pattern 3: Insider Threat
Look for: "Add member to group" + "Files.ReadWrite.All" consent + unusual hours
Risk: 🟡 MEDIUM-HIGH

### Pattern 4: Suspicious MFA Removal
Look for: "Remove authentication method" + no corresponding re-enrollment
Risk: 🟡 MEDIUM

### Pattern 5: License Abuse
Look for: "Assign license" + unusual license types + group memberships
Risk: 🟡 MEDIUM

---

## Files Modified

- `/backend/server.js` - Enhanced `/api/user-investigation/account-changes` endpoint with full normalization
- `/pages/user-investigation.js` - Improved display with category icons, before/after values, risk-ordered layout

---

## References

- [Microsoft Graph directoryAudit resource type](https://learn.microsoft.com/en-us/graph/api/resources/directoryaudit)
- [List directoryAudits](https://learn.microsoft.com/en-us/graph/api/directoryaudit-list)
- [Microsoft Entra audit log schema](https://learn.microsoft.com/en-us/azure/active-directory/reports-monitoring/reference-audit-activities)
