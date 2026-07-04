# Directory Audits - User Guide

## What Changed

The **"Actions Performed on User Account"** section now displays all administrative changes to a user's account with:
- ✅ Automatic categorization by activity type
- ✅ Risk-ordered display (most serious first)
- ✅ Before/after value tracking
- ✅ Clear actor attribution
- ✅ Precise timestamps

---

## Before vs After

### BEFORE (Limited View)
```
Account Changes
├─ Reset password
│  Initiated by: admin@contoso.com
│  Unknown date
│  Failed
│
├─ Add member to role (Technical details shown)
│  Initiated by: rajkdura@nastech-solutions.com
│  Invalid Date
│  Failed
```

### AFTER (Comprehensive View)
```
⚡ Privilege Changes (3)
├─ Add member to role (Fabric Administrator)
│  By: Global Administrator (admin@contoso.com)
│  Success ✓ | Jul 4, 2026, 10:28:00 AM
│
├─ Add member to role (Teams Administrator)
│  By: Global Administrator (admin@contoso.com)
│  Success ✓ | Jul 2, 2026, 02:15:00 PM

🔐 Authentication Changes (2)
├─ Register authentication method (Microsoft Authenticator)
│  By: System
│  Success ✓ | Jul 1, 2026, 08:30:00 AM

👤 Identity Changes (1)
├─ Reset password
│  Change: hidden → hidden
│  By: Identity Administrator (idadmin@contoso.com)
│  Success ✓ | Jun 30, 2026, 03:45:00 PM
```

---

## How to Use

### Step 1: Open Investigation Page
Navigate to: **User Investigation → Actions Performed on User Account**

### Step 2: Select Date Range
- Choose **"Last 7 days"**, **"Last 30 days"**, or **"Last 90 days"**
- OR use **Custom Date Range** to pick specific start/end dates

### Step 3: Click "Investigate"
The page will fetch all directory audits for the user

### Step 4: Review "Account Changes" Section
You'll see activities grouped by category:

```
Category Name (Number of Events)
├─ Event 1
│  Action | Before → After Value
│  By: Actor Name (actor@company.com)
│  Status: Success/Failed
│  Time: Full timestamp
│
├─ Event 2
...
```

---

## Understanding the Categories

### 🔴 HIGH PRIORITY

#### ⚡ Privilege Changes
**When to worry:** Role assignments, especially admin-level
```
Example: Add member to role (Global Administrator)
Action: User was granted Global Admin rights
Risk: CRITICAL - Admin can do anything to the tenant
```

#### 🛡️ Security Changes
**When to worry:** Authentication policies, Conditional Access
```
Example: Update conditional access policy
Action: Authentication rules were modified
Risk: Could weaken security posture
```

#### 🔐 Authentication Changes  
**When to worry:** MFA removal without re-enrollment
```
Example: Remove authentication method (Authenticator App)
Action: User's MFA was disabled
Risk: Account now requires only password
```

---

### 🟡 MEDIUM PRIORITY

#### ♻️ Account Lifecycle
**When to worry:** Unexpected creates/deletes/restores
```
Example: Delete user
Action: User account was deleted
Risk: Could impact continuity, may be unauthorized
```

#### 👤 Identity Changes
**When to worry:** Bulk password resets, disables
```
Example: Reset password
Action: User's password was changed
Risk: Could be legitimate admin action or compromise
```

#### 📱 Application Changes
**When to worry:** New app owners/permissions
```
Example: Add application owner
Action: Someone was made app owner
Risk: Could grant unauthorized access
```

---

### 🟢 LOWER PRIORITY

#### 👥 Group Changes
**When to worry:** Bulk membership changes, sensitive groups
```
Example: Add member to group (Finance Team)
Action: User added to group
Risk: Might grant unintended permissions
```

#### 📋 License Changes
**When to worry:** Suspicious license assignments
```
Example: Assign license (Microsoft 365 E5)
Action: User licensed for service
Risk: Usually normal, flag if unexpected
```

---

## Real Investigation Scenarios

### Scenario 1: Privilege Escalation Detection
**User:** sarah.smith@contoso.com  
**Date:** Jul 4, 2026

You see:
```
⚡ Privilege Changes (1)
├─ Add member to role (Global Administrator)
│  By: admin@contoso.com
│  Success ✓ | Jul 4, 2026, 10:15:00 AM
```

**Your Action:**
1. ✓ Do you recognize this promotion?
2. ✓ Did Sarah request this?
3. ✓ Was she actually promoted?
4. ⚠️ If no → INVESTIGATE IMMEDIATELY

---

### Scenario 2: Account Compromise Pattern
**User:** john.doe@contoso.com  
**Date:** Jul 3-4, 2026

You see:
```
👤 Identity Changes (1)
├─ Reset password
│  By: Identity Administrator (admin@contoso.com)
│  Success ✓ | Jul 3, 2026, 02:30:00 PM

🔐 Authentication Changes (1)
├─ Register authentication method (New Authenticator)
│  By: System
│  Success ✓ | Jul 3, 2026, 02:35:00 PM

⚡ Privilege Changes (1)
├─ Add member to role (Exchange Administrator)
│  By: admin@contoso.com
│  Success ✓ | Jul 3, 2026, 03:00:00 PM
```

**Your Analysis:**
- ⚠️ Password reset by admin
- ⚠️ New authenticator added right after
- ⚠️ Exchange admin role assigned
- 🚨 **Pattern suggests compromise**

**Your Action:**
→ Contact the admin who made changes  
→ Contact John to verify legitimacy  
→ Check recent sign-in activity  
→ Monitor all subsequent actions

---

### Scenario 3: Normal Activity
**User:** jane.williams@contoso.com  
**Date:** Last 30 days

You see:
```
👤 Identity Changes (0)
👥 Group Changes (1)
├─ Add member to group (Finance Team)
│  By: Group Administrator (groupadmin@contoso.com)
│  Success ✓ | Jun 15, 2026, 10:00:00 AM

📋 License Changes (1)
├─ Assign license (Microsoft 365 E5)
│  By: License Administrator (licadmin@contoso.com)
│  Success ✓ | Jun 1, 2026, 09:00:00 AM
```

**Your Analysis:**
- ✓ No privilege escalations
- ✓ No authentication changes  
- ✓ No identity changes
- ✓ Normal group/license management

**Your Action:**
→ Mark as normal  
→ Continue with other sections

---

## Key Indicators to Watch

### 🚨 CRITICAL ALERTS
- ⚡ Add member to role (especially Global Admin, Security Admin)
- 👤 Multiple password resets in short timeframe
- 🔐 MFA removal without immediate re-enrollment
- ♻️ Account disable/delete without approval

### ⚠️ HIGH ALERTS
- 🛡️ Conditional Access policy changes
- 📱 New application owners
- 👥 Bulk group membership changes
- 👤 Disable user account

### ℹ️ INFORMATIONAL
- 📋 License assignments
- 👥 Normal group membership
- 👤 Standard profile updates

---

## Investigation Workflow

1. **See suspicious category** (e.g., ⚡ Privilege Changes)
2. **Read the action** (e.g., "Add member to role")
3. **Check who did it** (Look at "By:" field)
4. **Note when** (Review timestamp)
5. **Verify legitimacy** (Ask the user or admin)
6. **Take action** (Approve or investigate further)

---

## Correlating with Other Sections

### Combine with:
- **Sign-in Logs** - When did they sign in after changes?
- **Risk Detections** - Any anomalies detected?
- **Device Activity** - From where were changes made?
- **OAuth Consent** - Were permissions granted?

### Example Correlation
```
Account Changes: Password reset by admin on Jul 3
Sign-in Logs: First sign-in from new location on Jul 3
Risk Detections: Impossible travel detected on Jul 3
→ Conclusion: Likely account compromise
```

---

## Tips for Analysts

✅ **DO:**
- Review Privilege Changes first (highest risk)
- Check who made each change (actor UPN)
- Verify unusual time zones or times
- Correlate with other investigation sections
- Note the before/after values

❌ **DON'T:**
- Ignore failed operations (could indicate attack)
- Assume System actor is always benign
- Overlook unusual timestamps
- Skip verification with user/admin

---

## Example Report

**Investigation Report: john.doe@contoso.com**

**Finding 1: Role Elevation Detected** ⚡
- Event: Add member to role (Fabric Administrator)
- When: Jul 4, 2026, 10:28 AM
- By: Global Administrator (admin@contoso.com)
- Status: Success

**Finding 2: Authentication Updated** 🔐
- Event: Register authentication method (Windows Hello)
- When: Jul 4, 2026, 08:30 AM
- Status: Success

**Finding 3: Group Membership Updated** 👥
- Event: Add member to group (Finance Team)
- When: Jul 3, 2026, 2:30 PM
- By: Group Administrator (groupadmin@contoso.com)
- Status: Success

**Assessment:**
Normal administrative maintenance. Password reset followed by role assignment aligns with system administrator actions. No indicators of compromise detected.

---

## Troubleshooting

**Q: All dates showing "Unknown date"**  
A: Browser cache issue. Refresh the page.

**Q: No events showing**  
A: User may be new or have no admin changes. Try extending the date range.

**Q: Events look truncated**  
A: Click on the event card to see full details.

**Q: Can't find a specific action**  
A: It might be in a different category. Check all categories listed.

---

## See Also
- [Directory Audits Validation](DIRECTORY_AUDITS_VALIDATION.md) - Technical details
- [Investigation Report](INVESTIGATION_REPORT_FEATURE.md) - Overall report template
- [Date Formatting Fix](DATE_FORMATTING_FIX.md) - Date issues resolved
- [Account Changes Display](ACCOUNT_CHANGES_FIX.md) - Display improvements
