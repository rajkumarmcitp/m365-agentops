# Investigation Agent - Real-World Examples

The Investigation Agent answers the questions a SOC analyst would ask when investigating a user.

---

## Example 1: Normal User Activity

### Investigation Data
```
User: Sarah Miller (Engineering Team)
Period: Last 24 hours

Sign-ins: 5
  - 09:00 Chennai (Office)
  - 11:30 Bangalore (Branch Office)
  - 14:00 Chennai (Office)
  - 16:00 Work from Home
  - 18:30 Work from Home

Devices: 2
  - Laptop (Compliant, Encrypted)
  - Desktop (Compliant, Encrypted)

Roles: 1 (Software Engineer)
Groups: 3 (Engineering, Developers, All Staff)
OAuth Consents: 1 (GitHub Enterprise - granted 3 months ago)
Alerts: 0
Account Changes: 0
Risk Detections: 0
```

### Agent Analysis Output

```
═══════════════════════════════════════════════════════════════

USER STORY

Sarah Miller worked from multiple office locations throughout the day,
signing in 5 times from Chennai and Bangalore branch offices, 
then transitioning to work-from-home in the evening. All sign-ins 
were successful, devices were compliant, and MFA was completed.

═══════════════════════════════════════════════════════════════

RISK SCORE: LOW (8/100)

✅ NORMAL USER ACTIVITY

═══════════════════════════════════════════════════════════════

KEY FINDINGS

✓ 5 successful sign-ins across expected locations
✓ 2 managed devices (100% compliant and encrypted)
✓ MFA completed on all sign-ins
✓ Roles and groups consistent with job function
✓ OAuth consent from expected application (GitHub)
✓ No account changes or risky detections
✓ Sign-in pattern consistent with work schedule

═══════════════════════════════════════════════════════════════

VERDICT: 🟢 NORMAL ACTIVITY

This is standard user behavior. All activity aligns with expected 
work patterns and security policies. No investigation required.

═══════════════════════════════════════════════════════════════
```

---

## Example 2: Suspicious OAuth Activity

### Investigation Data
```
User: John Smith (Sales)
Period: Last 24 hours

Sign-ins: 6
  - All from Chicago (expected location)
  - All successful
  - Normal work hours

Devices: 1 (Compliant)
Roles: 0
Groups: 2 (Sales Team, All Staff)

OAuth Consents: 3
  - Excel Add-in (1 month ago) ✓
  - Outlook Add-in (2 weeks ago) ✓
  - "Budget Analytics" (2 hours ago) 🆕

Alerts: 1
  - "New application created" (Medium severity)

Account Changes: 0
Risk Detections: 0
```

### Agent Analysis Output

```
═══════════════════════════════════════════════════════════════

USER STORY

John Smith had normal sign-in activity from Chicago with all 
sessions successful. However, a new OAuth application called 
"Budget Analytics" was granted consent just 2 hours ago. 
This is unusual given the application name doesn't match typical 
business tools in use.

═══════════════════════════════════════════════════════════════

RISK SCORE: MEDIUM (38/100)

🟡 SUSPICIOUS ACTIVITY

═══════════════════════════════════════════════════════════════

KEY FINDINGS

✓ 6 successful sign-ins from expected location
✓ 1 compliant managed device
✓ MFA completed successfully
✓ 1 NEW OAuth application granted consent (⚠️)
✓ "Budget Analytics" app is unknown/unexpected
✓ Alert: New application created (Medium severity)
✓ No other account changes or risky behavior

═══════════════════════════════════════════════════════════════

SUSPICIOUS PATTERNS

🔍 Unexpected Application Permission

Event Sequence:
  13:00 ─ Sign-in successful (Chicago)
  14:30 ─ Another sign-in from Chicago
  15:58 ─ NEW OAuth consent granted to "Budget Analytics"
  16:00 ─ Alert triggered: New application created

Finding: New application with vague name granted permissions
Risk: Could be phishing, social engineering, or unauthorized app
Confidence: 78%

═══════════════════════════════════════════════════════════════

RECOMMENDED ACTIONS

→ Ask user: "Did you grant permission to 'Budget Analytics' app?"
→ Review the OAuth consent details and application permissions
→ Check application creator and intended use
→ If user didn't authorize: Revoke consent immediately
→ Block application from accessing Exchange if suspicious
→ Monitor for unusual email/data access from this app

═══════════════════════════════════════════════════════════════

VERDICT: 🟡 SUSPICIOUS ACTIVITY - REVIEW REQUIRED

One anomalous OAuth consent granted to an unknown application. 
User's sign-in behavior is normal, but the new application 
permission warrants investigation.

Recommendation: Contact user for verification within 1 hour.

═══════════════════════════════════════════════════════════════
```

---

## Example 3: Possible Account Compromise

### Investigation Data
```
User: Raj Kumar (Finance Manager)
Period: Last 24 hours

Sign-ins: 8
  - 09:00 Delhi (Office) ✓
  - 14:00 Mumbai (Travel) ✓
  - 18:00 London (BLOCKED) 🚨 Impossible travel
  - 18:05 London (BLOCKED) 🚨 MFA failure
  - 18:10 London (BLOCKED) 🚨 MFA failure
  - 19:00 London (SUCCESS) 🚨 Unusual location, late hour
  - 19:30 London (SUCCESS) 🚨 Mailbox access (unusual IP)
  - 20:00 London (SUCCESS) 🚨 Email forwarding rule added

Risk Detections: 3
  - Impossible Travel
  - Suspicious Sign-in
  - Leaked Credentials

Account Changes: 2
  - Email Forwarding Rule Added (19:58)
  - MFA Method Disabled (20:05)

Alerts: 4
  - "Impossible travel detected"
  - "Multiple MFA failures"
  - "Mailbox forwarding configured"
  - "User security settings modified"

OAuth Consents: 0
Roles: 3 (Finance Manager, Accounts Approver, Compliance Admin)
```

### Agent Analysis Output

```
═══════════════════════════════════════════════════════════════

USER STORY

Raj Kumar signed in from Delhi office at 09:00, then from Mumbai 
at 14:00 (consistent with business travel). At 18:00, multiple 
sign-in attempts from London failed due to impossible travel 
detection and MFA failures. Despite these blocks, a sign-in 
succeeded at 19:00 from an unusual IP. Following this, a mailbox 
forwarding rule was added, MFA was disabled, and a new OAuth 
application was granted access.

═══════════════════════════════════════════════════════════════

RISK SCORE: CRITICAL (87/100)

🔴 POTENTIAL ACCOUNT COMPROMISE

═══════════════════════════════════════════════════════════════

KEY FINDINGS

⚠️ 8 sign-in attempts in 2 hours (vs. normal 2-3 per day)
⚠️ 3 blocked sign-ins from impossible location (London)
⚠️ Multiple MFA failures (4 consecutive attempts)
⚠️ Successful sign-in from unusual location/IP (19:00)
⚠️ Email forwarding rule added to external address
⚠️ MFA disabled on the account
⚠️ 4 security alerts in 1 hour (vs. typical 0)
⚠️ User has Finance Manager + Approval roles (high risk)

═══════════════════════════════════════════════════════════════

EVENT TIMELINE

18:00 ─ Sign-in from London [BLOCKED - Impossible travel]
         │
18:05 ─ Retry from London [BLOCKED - MFA failure]
         │
18:10 ─ Retry from London [BLOCKED - MFA failure]
         │
19:00 ─ Sign-in from London [SUCCESS - Unusual IP]
         │
19:15 ─ Mailbox accessed from London
         │
19:58 ─ Email forwarding rule added
         │
20:05 ─ MFA disabled (ALL methods)
         │
20:30 ─ OAuth consent to unknown application

═══════════════════════════════════════════════════════════════

SUSPICIOUS PATTERNS - CRITICAL CHAIN DETECTED

🚨 ACCOUNT COMPROMISE INDICATOR

Pattern: Credential Compromise with Persistence and Data Exfil

1. Impossible Travel (18:00)
   └─ Attacker attempts login from new location
   
2. MFA Bypass (18:05-18:10)
   └─ Multiple failures suggest credential-only compromise
   
3. Successful Login (19:00)
   └─ Attacker bypasses MFA (possible app password or reuse)
   
4. Mailbox Access (19:15)
   └─ Attacker accesses sensitive emails
   
5. Forwarding Rule (19:58)
   └─ Attacker sets up data exfiltration
   
6. MFA Disabled (20:05)
   └─ Attacker removes security control
   
7. OAuth Consent (20:30)
   └─ Attacker gains persistent access

Confidence: 94%
Assessment: CONFIRMED COMPROMISE - IMMEDIATE ACTION REQUIRED

═══════════════════════════════════════════════════════════════

RECOMMENDED ACTIONS - IMMEDIATE

🚨 Within 5 minutes:
→ Force password reset (via admin console)
→ Revoke all refresh tokens
→ Disable the account temporarily
→ Notify user immediately (call, not email)

🚨 Within 30 minutes:
→ Review mailbox forwarding rules and delete external rules
→ Re-enable MFA with new methods
→ Audit all OAuth consents granted in last 24 hours
→ Check for mail rules that hide sent items
→ Review mailbox access logs for data exfiltration
→ Check for delegates or mailbox permissions changes

🚨 Within 2 hours:
→ Review all sign-in logs for the past 30 days
→ Check OneDrive/SharePoint file access and sharing
→ Audit any approval/financial transactions
→ Escalate to Incident Response team
→ Begin eDiscovery if financial fraud suspected

═══════════════════════════════════════════════════════════════

VERDICT: 🔴 CONFIRMED COMPROMISE - CRITICAL

This investigation shows clear indicators of account compromise 
with persistence and exfiltration attempts. The attacker has 
disabled MFA and installed persistence mechanisms.

Risk Level: CRITICAL (87/100)
Action: IMMEDIATE CONTAINMENT REQUIRED

This incident requires escalation to:
- Incident Response Team
- Finance Department (due to Finance Manager role)
- Compliance/Legal (if data accessed)

Timeline: Compromise occurred within last 2 hours.
Scope: Mailbox access, potential financial approval abuse.

═══════════════════════════════════════════════════════════════
```

---

## Example 4: Privilege Escalation Detection

### Investigation Data
```
User: Michael Chen (IT Support)
Period: Last 24 hours

Sign-ins: 4
  - All from office
  - All successful
  - During business hours

Account Changes: 2
  - Global Admin role ASSIGNED (11:30) ⚠️
  - Security Admin role ASSIGNED (11:35) ⚠️

OAuth Consents: 1 (NEW)
  - "Azure Automation" app (granted 11:45)
  - Permissions: Directory.ReadWrite.All

Directory Changes: 5
  - 3 user account disables
  - 2 mailbox permission changes

Roles before: IT Support (standard)
Roles after: Global Admin + Security Admin (elevated)

MFA: Enabled (unchanged)
Groups: No changes
```

### Agent Analysis Output

```
═══════════════════════════════════════════════════════════════

USER STORY

Michael Chen, an IT Support technician, had normal sign-in activity 
during business hours. However, at 11:30, Global Admin and 
Security Admin roles were assigned to the account. Shortly after, 
an OAuth application with Directory.ReadWrite.All permissions was 
granted consent. Within the same hour, multiple user accounts were 
disabled and mailbox permissions were modified.

═══════════════════════════════════════════════════════════════

RISK SCORE: HIGH (68/100)

🟡 SUSPICIOUS PRIVILEGE ESCALATION

═══════════════════════════════════════════════════════════════

KEY FINDINGS

✓ User had legitimate IT Support role
⚠️ Global Admin role ASSIGNED (unusual for support staff)
⚠️ Security Admin role ASSIGNED (escalation)
⚠️ Authorization unknown for elevated roles
⚠️ Immediate use of elevated privileges
⚠️ OAuth app granted with full directory access
⚠️ 5 directory changes within 15 minutes
✓ MFA remained enabled (positive indicator)

═══════════════════════════════════════════════════════════════

SUSPICIOUS PATTERN - PRIVILEGE ESCALATION

🔍 Rapid Privilege Escalation and Abuse

Sequence:
  11:30 ─ Global Admin assigned to IT Support user
           │
  11:35 ─ Security Admin assigned (2nd elevated role)
           │
  11:45 ─ OAuth app granted Directory.ReadWrite.All
           │
  11:50 ─ User disabled (via new admin permissions)
           │
  11:52 ─ User disabled (2nd)
           │
  11:55 ─ Mailbox permission changed

Confidence: 81%
Assessment: POSSIBLE POLICY VIOLATION OR ABUSE OF PRIVILEGES

═══════════════════════════════════════════════════════════════

RECOMMENDED ACTIONS

→ Verify with approver: Was role assignment approved?
→ Contact Michael Chen: "You were assigned Global Admin role"
→ If not authorized: REVOKE Global Admin and Security Admin roles
→ Investigate: Who assigned the roles? (check audit log)
→ Review the 5 directory changes - were they authorized?
→ Audit the OAuth application - what is it doing?
→ Check if user is in appropriate delegation group
→ If abuse confirmed: Escalate to security and HR

═══════════════════════════════════════════════════════════════

VERDICT: 🟡 SUSPICIOUS PRIVILEGE ESCALATION

Privilege roles were assigned without clear authorization, 
followed by immediate use of those elevated permissions. 

This could indicate:
1. Unauthorized privilege escalation (security incident)
2. Legitimate role assignment that wasn't documented
3. Insider threat behavior

Recommendation: Contact approvers and user for verification 
within 1 hour. If unauthorized, revoke immediately.

═══════════════════════════════════════════════════════════════
```

---

## Example 5: Insider Threat Detection

### Investigation Data
```
User: Lisa Wong (Product Manager)
Period: Last 48 hours

Sign-ins: 6 (normal)
Devices: 2 (normal)
MFA: Enabled (normal)
Risk Detections: 0

Account Changes: 1
  - License REMOVED (yesterday)
  - Office 365 E5 → Basic License

Actions on Files: (from SharePoint audit)
  - 340 files downloaded (yesterday afternoon)
  - 2 major product documents shared externally
  - Confidential roadmap shared with personal email

OAuth Consents: 1
  - "Data Export Tool" (granted yesterday)
  - Permissions: Files.ReadWrite.All

Alerts: 2
  - "External sharing enabled for sensitive folder"
  - "Bulk file download detected"

Groups: REMOVED
  - Removed from "Product Strategy" group
  - Removed from "Executive Steering"
```

### Agent Analysis Output

```
═══════════════════════════════════════════════════════════════

USER STORY

Lisa Wong, a Product Manager, performed multiple unusual actions 
over the past 48 hours. She downloaded 340 files in a single 
afternoon, shared confidential documents externally with her 
personal email, granted OAuth permissions to a data export tool, 
had her license downgraded, and was removed from high-level 
strategy groups.

═══════════════════════════════════════════════════════════════

RISK SCORE: HIGH (72/100)

🔴 POTENTIAL INSIDER THREAT - DATA EXFILTRATION

═══════════════════════════════════════════════════════════════

KEY FINDINGS

⚠️ 340 files downloaded in single afternoon
⚠️ Bulk download of product documents
⚠️ Confidential roadmap shared externally
⚠️ Shared with personal email (not company)
⚠️ OAuth consent to data export tool
⚠️ License downgraded (possible termination prep)
⚠️ Removed from strategy groups (access revocation prep)
⚠️ Timing suggests coordinated activity

═══════════════════════════════════════════════════════════════

SUSPICIOUS PATTERN - DATA EXFILTRATION

🔍 Coordinated Insider Threat Activity

Sequence (Over 48 hours):
  Day 1, 14:00 ─ 340 files downloaded
                 │
  Day 1, 15:30 ─ OAuth consent granted (data export tool)
                 │
  Day 1, 16:00 ─ Confidential roadmap shared externally
                 │
  Day 1, 17:00 ─ Additional files shared with personal email
                 │
  Day 2, 09:00 ─ License downgraded (license admin action)
                 │
  Day 2, 10:00 ─ Removed from high-level groups

Confidence: 87%
Assessment: STRONG INDICATORS OF DATA EXFILTRATION

═══════════════════════════════════════════════════════════════

RECOMMENDED ACTIONS - URGENT

Within 1 hour:
→ Revoke OAuth consent to "Data Export Tool"
→ Disable external sharing permissions
→ Audit all data shared to personal email
→ Check email forwarding rules
→ Review what information was on downloaded files

Within 2 hours:
→ Interview Lisa Wong about planned departures
→ Check with HR - is termination planned?
→ Ask: "Why were files downloaded and shared externally?"
→ Request data classification of shared documents
→ Check if files were sold or shared with competitors

Within 24 hours:
→ If termination confirmed: Accelerate off-boarding
→ Disable account access
→ Recover exported data if possible
→ Audit recipient email accounts
→ Escalate to Legal if IP theft suspected

═══════════════════════════════════════════════════════════════

VERDICT: 🔴 PROBABLE INSIDER THREAT - DATA EXFILTRATION

Multiple indicators suggest intentional exfiltration of 
confidential data:
- Bulk file downloads
- External sharing to personal accounts
- Persistence mechanism (OAuth consent)
- Account access removal preparation

This requires immediate Incident Response escalation.

Risk Level: HIGH (72/100)
Action: DISABLE ACCOUNT AND INVESTIGATE IMMEDIATELY

Consider involving:
- Security team
- Legal/IP counsel
- HR
- Law enforcement (if trade secret suspected)

═══════════════════════════════════════════════════════════════
```

---

## Key Insights

The Investigation Agent excels at:

1. **Detecting Patterns** - Finds chains of events that are individually benign but collectively suspicious

2. **Prioritizing** - Uses risk scores to help analysts focus on what matters most

3. **Explaining Context** - Provides narrative that helps analysts understand "why" not just "what"

4. **Recommending Actions** - Suggests concrete next steps tailored to the finding

5. **Confidence Levels** - Acknowledges uncertainty in AI analysis

6. **Speed** - Completes in seconds what would take analysts 15+ minutes

This transforms the Investigation experience from "here are 28 datasets" to "here's what you need to know, and here's what to do about it."
