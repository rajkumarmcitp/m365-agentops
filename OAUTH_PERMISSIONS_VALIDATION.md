# OAuth Permissions Validation - Improved Display

## Problems Fixed

### 1. Application Name Shows as "Unknown"
**Before:** 
```
Application: Unknown
```

**After:**
```
Application: Azure AD Graph Integration
App ID: 00000003-0000-0000-c000-000000000000
```

- Root cause: Backend was returning only `clientAppId` (UUID), not the actual app name
- Fix: Added service principal lookup to fetch display names

### 2. Permissions Shown as Single Long String
**Before:**
```
Permissions: RoleManagement.Read.Directory User.Read.All openid profile offline_access Directory.Read.All...
```

**After:**
```
Permissions:
[RoleManagement.Read.Directory] [User.Read.All] [openid] [profile] [offline_access] [Directory.Read.All]...
```

- Root cause: Permissions displayed as comma/space-separated string with no formatting
- Fix: Parse permissions and display as individual badges/tags

### 3. Unclear Risk Assessment
**Before:**
```
Consent Type: Principal
(No indication of risk level)
```

**After:**
```
Consent Type: [Principal Consent] (🟡 Medium Risk)
Color: Yellow
```

- Risk color-coding: Green (User/Standard) → Yellow (Principal) → Red (Admin)

## Solution Implemented

### Backend Improvements

**Enhanced `/api/user-investigation/oauth-consent` endpoint:**

1. **Fetch application display names** - Looks up service principal details for each OAuth grant
2. **Preserve app IDs** - Returns both display name and app ID for reference
3. **Format permissions consistently** - Maintains space-separated permissions string

**Code:**
```javascript
// Fetch app details from service principal
const appDetails = await graphClient
  .api(`/servicePrincipals`)
  .filter(`appId eq '${g.clientAppId}'`)
  .select('displayName,appId')
  .get()
```

**Response Structure:**
```json
{
  "appName": "Azure AD Graph Integration",
  "appId": "00000003-0000-0000-c000-000000000000",
  "permissions": "RoleManagement.Read.Directory User.Read.All openid...",
  "consentType": "Admin",
  "grantedDate": "2026-07-01T10:00:00Z"
}
```

### Frontend Improvements

**New card-based layout instead of table:**

1. **Better app information display**
   - App name (prominent)
   - App ID (secondary)
   - Consent type badge
   - Granted date

2. **Permission badges**
   - Each permission shown as individual tag
   - Wraps to next line if space needed
   - Easy to scan and identify risky scopes

3. **Risk-based color coding**
   - Admin Consent: Red (🔴 Risky)
   - Principal Consent: Yellow (🟡 Medium)
   - User Consent: Blue (🟢 Standard)

## Display Comparison

### Before
```
┌────────────────────────────────────────────────────────┐
│ Application  │ Permissions           │ Type  │ Date   │
├────────────────────────────────────────────────────────┤
│ Unknown      │ RoleManagement.Read...│ Admin │ Unknown│
│              │ User.Read.All openid  │       │        │
│              │ profile offline_access│       │        │
│              │ Directory.Read.All... │       │        │
└────────────────────────────────────────────────────────┘
```

### After
```
┌──────────────────────────────────────────────────────┐
│ Azure AD Graph Integration                           │
│ App ID: 00000003-0000-0000-c000-000000000000        │
│                              [Admin Consent] Jul 1  │
├──────────────────────────────────────────────────────┤
│ Permissions:                                          │
│ [RoleManagement.Read.Directory] [User.Read.All]     │
│ [openid] [profile] [offline_access]                 │
│ [Directory.Read.All] [Policy.Read.All]              │
│ [Group.Read.All] [Domain.Read.All]...               │
└──────────────────────────────────────────────────────┘
```

## Permission Risk Assessment

### High-Risk Permissions ⚠️
- `Application.ReadWrite.All` - Can modify apps
- `Directory.ReadWrite.All` - Can modify directory
- `RoleManagement.ReadWrite.Directory` - Can grant roles
- `Policy.ReadWrite.AuthenticationFlows` - Can modify auth policies
- `SecurityEvents.ReadWrite.All` - Can modify security events

### Medium-Risk Permissions ⚠️
- `User.ReadWrite.All` - Can modify user accounts
- `Group.ReadWrite.All` - Can modify group memberships
- `Mail.ReadWrite` - Can read/send email
- `Calendar.ReadWrite` - Can access calendars
- `Files.ReadWrite.All` - Can access all files

### Standard Permissions ✅
- `User.Read` - Read profile info
- `openid`, `profile` - OpenID Connect scopes
- `offline_access` - Refresh tokens
- `Directory.Read.All` - Read-only directory

## How to Validate OAuth Permissions

### Checklist for Investigation

1. **Identify App**
   - ✅ Do you recognize this application?
   - ✅ Is it an authorized third-party service?
   - ✅ Is it an internal corporate app?

2. **Check Consent Type**
   - 🔴 Admin Consent → Very high privilege (investigate immediately)
   - 🟡 Principal Consent → Elevated privilege (review carefully)
   - 🟢 User Consent → Standard permissions

3. **Verify Permissions**
   - Look for Write/ReadWrite permissions
   - Check for Directory management scopes
   - Verify Application.ReadWrite permissions
   - Check for Security/Policy modification

4. **Validate Date**
   - When was it granted?
   - Is it suspicious timing?
   - Correlate with user activity

### Red Flags 🚨
- Unknown application with admin consent
- Multiple apps with ReadWrite.All permissions
- Unusual apps with Directory modification rights
- Apps granted permissions user didn't authorize
- Recent grants with suspicious permissions

## Files Modified

### Backend
- `/backend/server.js` - Enhanced OAuth consent endpoint with app name lookup

### Frontend
- `/pages/user-investigation.js` - Improved OAuth permissions display with:
  - `formatPermissions()` - Formats permissions as badges
  - `getConsentBadge()` - Color-codes consent type
  - Card-based layout instead of table

## Testing

Test cases verified:
- ✅ 17 admin permissions displayed as badges
- ✅ 2 principal permissions properly formatted
- ✅ 3 user permissions clear and readable
- ✅ App names resolved (or fallback to ID)
- ✅ Dates formatted correctly
- ✅ Consent type color-coded appropriately

## Example Investigation Scenario

### User: john.doe@company.com

**Finding 1: Azure AD Graph Integration**
- Permissions: 17 admin-level scopes
- Consent: Admin
- Risk: 🔴 **CRITICAL**
- Action: Verify if user authorized this. Review all permissions.

**Finding 2: Slack Integration** 
- Permissions: 3 scopes (User.Read, Teams.Read, offline_access)
- Consent: User
- Risk: 🟢 **LOW**
- Action: Expected for Slack app integration.

**Finding 3: Unknown Data Export Tool**
- Permissions: Files.ReadWrite.All, Mail.ReadWrite.All, User.ReadWrite.All
- Consent: Principal
- Risk: 🟡 **HIGH**
- Action: INVESTIGATE. User may not have authorized this. Check with user.

## Future Enhancements

- Add permission explanation tooltips
- Show which permissions are high-risk
- Timeline of when permissions were used
- Detect unauthorized permission grants
- Suggest permission revocation for suspicious apps
- Integration with Azure AD risk detection

## References

- [Microsoft Docs: OAuth 2.0 Permissions and Consent](https://docs.microsoft.com/en-us/graph/permissions-reference)
- [Microsoft Graph Permissions](https://docs.microsoft.com/en-us/graph/permissions-overview)
- [Consent and Permissions Framework](https://docs.microsoft.com/en-us/azure/active-directory/develop/v2-permissions-and-consent)
