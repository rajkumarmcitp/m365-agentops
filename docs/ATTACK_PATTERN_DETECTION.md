# TenantGuard Attack Pattern Detection

## Overview

TenantGuard now includes **intelligent attack pattern detection** based on:
- **50 high-value audit events** mapped to real-world attack scenarios
- **Microsoft attack lifecycle** (Initial Access → Persistence → Privilege Escalation → Defense Evasion → Credential Access → Collection → Exfiltration → Impact)
- **MITRE ATT&CK framework** for standardized threat classification

## Architecture

```
Audit Events (9 sources)
        ↓
[Normalize & Filter]
        ↓
[Match against 50 critical events]
        ↓
[Detect attack chains]
        ↓
[Calculate risk score]
        ↓
[Generate prioritized alerts]
        ↓
TenantGuard Dashboard
```

## The 50 Critical Audit Events

### Attack Lifecycle Mapping

| Stage | # Events | Priority | Focus |
|-------|----------|----------|-------|
| **Privilege Escalation** | 5 | P0 | Unauthorized admin access |
| **Defense Evasion** | 9 | P0/P1 | Security control bypass |
| **Persistence** | 13 | P0/P1 | Long-term access mechanisms |
| **Initial Access** | 3 | P0 | Credential compromise |
| **Credential Access** | 3 | P0 | Brute force / leaked credentials |
| **Collection** | 2 | P1 | Data gathering |
| **Exfiltration** | 3 | P0/P1 | Data theft |

### Priority Matrix

| Priority | Description | Response Time | Example |
|----------|-------------|----------------|---------|
| **P0** | Drop Everything ⚠️ | Immediate | Global Admin assigned |
| **P1** | Critical | < 15 minutes | MFA disabled |
| **P2** | High | < 1 hour | OAuth consent granted |
| **P3** | Medium | < 4 hours | Audit log view |

## Top 10 "Drop Everything" Alerts

These require **immediate action**:

```
🚨 CRITICAL ALERTS (Drop Everything):
1. ⚠️  Global Administrator assigned
2. ⚠️  MFA disabled for any privileged account
3. ⚠️  Conditional Access policy disabled
4. ⚠️  Security Defaults disabled
5. ⚠️  Admin consent granted to an application
6. ⚠️  Application granted Directory.ReadWrite.All
7. ⚠️  External email forwarding rule created
8. ⚠️  Impossible travel sign-in detected
9. ⚠️  DLP policy disabled
10. ⚠️ Unified Audit Logging disabled
```

## Critical Events Details

### 1️⃣ Privilege Escalation Events

**Global Administrator Assigned**
- **MITRE ATT&CK:** T1078 – Valid Accounts
- **Risk Score:** 100/100
- **Detection:** `Add-AzureADDirectoryRoleMember` with Global Admin role
- **Response:**
  - ✋ Revoke immediately
  - 🔍 Review all activities by this admin
  - 🔐 Force session termination
  - 📋 Audit for related privilege escalations

**Privileged Role Administrator Assigned**
- **MITRE ATT&CK:** T1098 – Account Manipulation
- **Risk Score:** 95/100
- **Detection:** Role Admin assignment to non-approved users
- **Response:** Same as Global Admin

**Security Administrator Assigned**
- **MITRE ATT&CK:** T1547 – Boot or Logon Autostart Execution
- **Risk Score:** 95/100
- **Detection:** Can disable security policies
- **Response:** Revoke + review policy changes

**Exchange Administrator Assigned**
- **MITRE ATT&CK:** T1114 – Email Collection
- **Risk Score:** 90/100
- **Detection:** Mailbox access capability
- **Response:** Revoke + check mailbox forwarding

---

### 2️⃣ Defense Evasion Events

**Security Defaults Disabled**
- **MITRE ATT&CK:** T1562 – Impair Defenses
- **Risk Score:** 95/100
- **Detection:** Security Defaults policy = False
- **Response:**
  - ✋ Re-enable immediately
  - 🔍 Audit all authentication events during disabled period
  - 📊 Check for MFA bypass attempts
  - 🔐 Force MFA re-registration

**Conditional Access Policy Disabled**
- **MITRE ATT&CK:** T1562 – Impair Defenses
- **Risk Score:** 95/100
- **Detection:** CA policy state changed to "Disabled"
- **Response:**
  - ✋ Re-enable policy
  - 🔍 Review sign-in logs during disabled period
  - 📋 Audit who disabled it
  - 🔐 Check for unauthorized access

**MFA Disabled for Administrator**
- **MITRE ATT&CK:** T1621 – Multi-Factor Authentication Bypass
- **Risk Score:** 95/100
- **Detection:** MFA method removed from privileged account
- **Response:**
  - ✋ Re-enable MFA immediately
  - 🔍 Check for sign-ins without MFA
  - 🔐 Force password reset
  - 📋 Review session logs

**Unified Audit Logging Disabled**
- **MITRE ATT&CK:** T1562 – Impair Defenses
- **Risk Score:** 100/100
- **Detection:** Audit log ingestion = False
- **Response:**
  - ✋ Re-enable audit logs immediately
  - 🔍 Investigate what happened during gap
  - 📊 Review all admin activities
  - 🚨 Consider breach incident

---

### 3️⃣ Persistence Events

**New Privileged User Created**
- **MITRE ATT&CK:** T1136 – Create Account
- **Risk Score:** 95/100
- **Detection:** New-AzureADUser with admin role
- **Response:**
  - ✋ Delete account immediately
  - 🔍 Audit account creation details
  - 📋 Check all activities by this user
  - 🔐 Review who created it

**Temporary Access Pass Created**
- **MITRE ATT&CK:** T1621 – Multi-Factor Authentication Bypass
- **Risk Score:** 95/100
- **Detection:** TAP creation for any user
- **Response:**
  - ✋ Revoke TAP immediately
  - 🔍 Check if it was used
  - 📋 Verify who created it
  - 🔐 Force password reset for user

**New App Registration Created + Client Secret**
- **MITRE ATT&CK:** T1199 – Trusted Relationship
- **Risk Score:** 90/100
- **Detection:** Application + secret creation
- **Response:**
  - ✋ Review app permissions
  - 🔍 Audit app access logs
  - 📋 Check what resources it accessed
  - 🔐 Delete if unauthorized

**Admin Consent Granted to Application**
- **MITRE ATT&CK:** T1199 – Trusted Relationship
- **Risk Score:** 95/100
- **Detection:** Tenant-wide consent approval
- **Response:**
  - ✋ Review granted permissions
  - 🔍 Audit app usage
  - 📋 Check data access patterns
  - 🔐 Remove if suspicious

**Application Granted Directory.ReadWrite.All**
- **MITRE ATT&CK:** T1199 – Trusted Relationship
- **Risk Score:** 100/100
- **Detection:** Full directory modify permission
- **Response:**
  - ✋ Remove permission immediately
  - 🔍 Audit all directory changes
  - 📋 Check what was created/modified
  - 🔐 Delete app if malicious

---

### 4️⃣ Credential Access Events

**Impossible Travel Sign-in**
- **MITRE ATT&CK:** T1110 – Brute Force
- **Risk Score:** 80/100
- **Detection:** Sign-in from impossible locations
- **Response:**
  - 🔍 Force password reset
  - 📋 Revoke all sessions
  - 🔐 Review mailbox access
  - ⚠️ Notify user

**Leaked Credentials Detected**
- **MITRE ATT&CK:** T1110 – Brute Force
- **Risk Score:** 95/100
- **Detection:** Password found in public breach
- **Response:**
  - ✋ Force password change
  - 🔍 Revoke all sessions
  - 🔐 Enable MFA
  - 📋 Review account activity

**Password Spray Detected**
- **MITRE ATT&CK:** T1110 – Brute Force
- **Risk Score:** 90/100
- **Detection:** Multiple failed logins from single source
- **Response:**
  - ✋ Block source IP
  - 🔍 Reset targeted accounts
  - 🔐 Enable MFA
  - 📊 Monitor for successful logins

---

### 5️⃣ Collection & Exfiltration Events

**External Forwarding Rule Created**
- **MITRE ATT&CK:** T1114 – Email Collection
- **Risk Score:** 95/100
- **Detection:** New-InboxRule with ExternalForwarding
- **Response:**
  - ✋ Delete rule immediately
  - 🔍 Check what was forwarded
  - 📋 Review mailbox access logs
  - ⚠️ Notify mailbox owner

**Mailbox Full Access Granted**
- **MITRE ATT&CK:** T1114 – Email Collection
- **Risk Score:** 90/100
- **Detection:** Add-MailboxPermission FullAccess
- **Response:**
  - ✋ Remove permission
  - 🔍 Check what emails were accessed
  - 📋 Audit mailbox activity
  - 🔐 Review who granted it

**Large Number of File Downloads**
- **MITRE ATT&CK:** T1005 – Data from Local System
- **Risk Score:** 80/100
- **Detection:** >50 downloads in short timeframe
- **Response:**
  - 🔍 Review what was downloaded
  - 📋 Check user location
  - ⚠️ Verify legitimate need
  - 🔐 Disable account if suspicious

**External Sharing Enabled + Anonymous Link**
- **MITRE ATT&CK:** T1020 – Automated Exfiltration
- **Risk Score:** 85/100
- **Detection:** Public sharing + anonymous access
- **Response:**
  - ✋ Disable external sharing
  - 🔍 Review shared content
  - 📋 Check if sensitive data exposed
  - 🔐 Audit who changed settings

---

## API Endpoints

### Detect Attack Patterns
```bash
POST /api/tenantguard/audit/detect-attacks
```

**Request:**
```json
{
  "events": [
    {
      "activity": "Add Global Administrator",
      "user": "attacker@contoso.com",
      "ipAddress": "192.168.1.100",
      "timestamp": "2026-07-18T12:00:00Z",
      "severity": "CRITICAL"
    }
  ]
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "patterns": 5,
    "riskScore": 92,
    "alerts": {
      "dropEverything": [
        {
          "title": "Global Administrator assigned",
          "severity": "CRITICAL",
          "priority": "P0",
          "miteaTactic": "T1078 – Valid Accounts",
          "user": "attacker@contoso.com",
          "riskScore": 100,
          "recommendedActions": [
            "Immediately revoke session",
            "Disable account if unauthorized",
            "Review recent activities"
          ]
        }
      ],
      "critical": [...],
      "high": [...]
    },
    "summary": {
      "totalPatterns": 5,
      "totalAlerts": 8,
      "dropEverythingCount": 2,
      "riskLevel": "CRITICAL"
    }
  }
}
```

### Collect All + Detect
```bash
POST /api/tenantguard/audit/collect-all
```

**Response includes:**
```json
{
  "attackPatterns": {
    "riskScore": 85,
    "patterns": 12,
    "alerts": {
      "dropEverything": [2 alerts],
      "critical": [5 alerts],
      "high": [8 alerts]
    },
    "riskLevel": "CRITICAL"
  }
}
```

## Attack Chain Detection

### Scenario 1: Classic Admin Compromise
```
1. Global Administrator assigned ← CRITICAL
2. MFA disabled ← CRITICAL  
3. External forwarding created ← CRITICAL
4. Large file downloads ← HIGH
```
**Overall Risk:** CRITICAL (100/100)  
**Interpretation:** Attacker gained admin access, disabled security, setup email theft, exfiltrating data  
**Response:** Immediate incident response  

### Scenario 2: OAuth Backdoor
```
1. App Registration created ← HIGH
2. Admin consent granted ← CRITICAL
3. Directory.ReadWrite.All granted ← CRITICAL
4. Service Principal created ← HIGH
```
**Overall Risk:** CRITICAL (95/100)  
**Interpretation:** Persistent OAuth backdoor installed  
**Response:** Delete app, audit all changes, reset credentials

### Scenario 3: Defense Evasion
```
1. Conditional Access disabled ← CRITICAL
2. Security Defaults disabled ← CRITICAL
3. Audit logging disabled ← CRITICAL
4. MFA disabled ← CRITICAL
```
**Overall Risk:** CRITICAL (98/100)  
**Interpretation:** All security controls removed  
**Response:** Immediate containment, assume full breach

## Risk Scoring

```
Risk Score Calculation:
  Critical Events × 20 points
+ High Events × 10 points
+ Drop-Everything Events × 25 points
= Total (capped at 100)

80-100  → CRITICAL (🔴 Red)
50-79   → HIGH (🟠 Orange)
20-49   → MEDIUM (🟡 Yellow)
0-19    → LOW (🟢 Green)
```

## Recommended Responses

### For Drop-Everything Alerts
1. **Immediate (< 5 minutes)**
   - Disable suspect account
   - Revoke all active sessions
   - Force MFA re-registration

2. **Urgent (< 30 minutes)**
   - Preserve evidence
   - Begin investigation
   - Notify security team

3. **Short-term (< 4 hours)**
   - Full account audit
   - Password reset
   - Review all changes
   - Incident documentation

4. **Follow-up (< 24 hours)**
   - Forensic analysis
   - Remediation verification
   - Stakeholder notification
   - Post-incident review

### For Critical Alerts
- Same as Drop-Everything, but with 15-60 minute response windows

### For High Alerts
- Document
- Investigate
- Plan remediation
- Schedule fixes

## MITRE ATT&CK Mapping

TenantGuard maps all 50 events to MITRE ATT&CK tactics:

| Tactic | Count | Example |
|--------|-------|---------|
| T1078 – Valid Accounts | 4 | Admin assignment |
| T1098 – Account Manipulation | 8 | Role changes |
| T1110 – Brute Force | 3 | Password spray |
| T1114 – Email Collection | 4 | Mailbox access |
| T1199 – Trusted Relationship | 6 | OAuth abuse |
| T1562 – Impair Defenses | 9 | Disable security |
| T1621 – MFA Bypass | 3 | Remove MFA |
| T1136 – Create Account | 2 | Rogue admins |
| T1020 – Automated Exfiltration | 2 | Auto-forward |
| T1005 – Data from Local System | 1 | Bulk download |

## Dashboard Integration

TenantGuard dashboard now shows:

### Alert Priority Section
- **Red Zone:** Drop-Everything (requires immediate action)
- **Orange Zone:** Critical (needs response within 15 min)
- **Yellow Zone:** High (investigate within 1 hour)

### Risk Meter
- Dynamic risk score (0-100)
- Color-coded severity
- Trend over time

### Attack Chain Visualization
- Multi-stage attack flows
- Related event connections
- Timeline of activities

### Recommended Actions Panel
- Prioritized response steps
- Copy-paste command examples
- Investigation checklist

## Limitations & Future Enhancements

**Current Limitations:**
- Requires audit events from 9 sources
- Some events need Purview Audit access
- Real-time delay = ~5 minutes

**Planned Enhancements:**
1. Real-time streaming via Event Hub
2. Behavioral analytics (User & Entity Behavior Analytics)
3. Machine learning anomaly detection
4. Custom rule engine
5. Automated response playbooks
6. SOAR integration (Power Automate)
7. Threat intelligence feeds
8. Phishing/credential exposure monitoring

## FAQ

**Q: What if I get a false positive?**
A: Review the triggering event and adjust detection logic. Each event is documented with expected behavior.

**Q: How do I whitelist legitimate activities?**
A: Document the business justification and create policy exceptions in settings.

**Q: Can I customize the 50 events?**
A: Yes, through custom rules engine (roadmap). Currently using pre-configured events.

**Q: Does TenantGuard automatically block these events?**
A: No, it alerts and recommends actions. You control the response.

**Q: How do I integrate with my SIEM?**
A: Use the API endpoints to push alerts. SIEM integration coming soon.

