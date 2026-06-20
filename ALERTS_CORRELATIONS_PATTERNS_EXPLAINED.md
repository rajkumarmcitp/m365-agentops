# Complete Guide: Alerts → Correlations → Attack Patterns

## Overview

TenantGuard uses a **three-layer security analysis system** to detect sophisticated attacks:

```
Layer 1: ALERTS           Individual security events
         (Raw signals)    ↓
         
Layer 2: CORRELATIONS     Grouped related alerts
         (Relationships)  ↓
         
Layer 3: ATTACK PATTERNS  Attack strategies detected
         (Attack types)   ↓
         
Result:  Complete attack picture with confidence scores
```

---

## Layer 1: ALERTS - Individual Security Events

### What They Are
Alerts are individual security events detected by Azure AD, M365, and other services.

### Current Demo Alerts (6 total)

```
1. "CRITICAL: Global Admin Role Added to External User"
   - Severity: CRITICAL
   - Score: 95/100
   - Type: PRIVILEGE_ESCALATION
   - Actor: admin@nasstech.com
   - Time: 2026-06-19 14:32:52

2. "CRITICAL: Mailbox Forwarding Rule to External Domain"
   - Severity: CRITICAL
   - Score: 92/100
   - Type: DATA_EXFILTRATION
   - Actor: admin@nasstech.com
   - Time: 2026-06-19 14:35:09

3. "HIGH: Suspicious Sign-in from Impossible Travel"
   - Severity: HIGH
   - Score: 85/100
   - Type: ANOMALOUS_LOGIN
   - Actor: admin@nasstech.com
   - Time: 2026-06-19 13:58:11

4. "HIGH: Policy Update Without Approval"
   - Severity: HIGH
   - Score: 78/100
   - Type: CONFIG_CHANGE
   - Actor: Azure AD
   - Time: 2026-06-19 14:25:43

5. "HIGH: Multiple Failed Sign-in Attempts"
   - Severity: HIGH
   - Score: 72/100
   - Type: FAILED_LOGIN
   - Actor: Azure AD Identity Protection
   - Time: 2026-06-19 14:13:05

6. "MEDIUM: Guest User Added to Sensitive Group"
   - Severity: MEDIUM
   - Score: 58/100
   - Type: ACCESS_GRANT
   - Actor: admin@nasstech.com
   - Time: 2026-06-19 14:49:22
```

### Alert Properties

Each alert has:
```javascript
{
  id: "unique-id",           // UUID
  headline: "Alert title",   // User-facing text
  description: "Details",    // Full description
  severity: "CRITICAL",      // CRITICAL, HIGH, MEDIUM, INFO
  score: 95,                 // 0-100 risk score
  type: "PRIVILEGE_ESCALATION",  // Alert type
  actor: "user@company.com", // Who triggered it
  action_timestamp: "2026-06-19T14:32:52.123Z"  // When it happened
}
```

### Viewed In
**Alerts Tab** - Table showing each alert individually

---

## Layer 2: CORRELATIONS - Alert Relationships

### What They Are
Correlations group related alerts to show **connections between events**.

### How Correlations Are Made

The correlation engine runs every **15 minutes** and analyzes all alerts using **4 strategies**:

#### Strategy 1: ACTOR-Based Correlation
**Groups:** Alerts from same user account  
**Triggers on:** 1+ CRITICAL or 2+ HIGH alerts from same actor within 1 hour  
**Example:**
```
Alert 1: admin@nasstech.com signs in from London
Alert 2: admin@nasstech.com creates forwarding rule
Alert 3: admin@nasstech.com adds global admin
↓ (Same actor, 30 minutes apart)
CORRELATION: "Azure AD Identity Protection performed 2 risky actions"
Pattern Type: SUSPICIOUS_LOGIN
Confidence: 96/100
```

#### Strategy 2: TARGET-Based Correlation
**Groups:** Alerts targeting same resource  
**Extracts targets:** MAILBOX, POLICY, USER, GROUP, ROLE  
**Triggers on:** 2+ alerts targeting same resource  
**Example:**
```
Alert: Mailbox forwarding rule created
Alert: Mailbox delegation permission granted
↓ (Both target MAILBOX)
CORRELATION: "Multiple actions targeting USER detected"
Pattern Type: USER_MANIPULATION
Confidence: 89/100
```

#### Strategy 3: TEMPORAL Correlation
**Groups:** Alerts clustered in time (burst activity)  
**Triggers on:** 6+ alerts within 1 hour with 1+ CRITICAL or avg score ≥70  
**Example:**
```
Alert: [Score 95] Role assignment
Alert: [Score 85] Policy change
Alert: [Score 78] Policy update
Alert: [Score 72] Failed login
Alert: [Score 65] Permission grant
Alert: [Score 58] Guest user added
↓ (All within 1 hour = BURST)
CORRELATION: "6 alerts detected - possible active incident"
Pattern Type: BURST_ACTIVITY
Confidence: 91/100
```

#### Strategy 4: ATTACK PATTERN Correlation
**Detects:** Specific attack signatures  
**Matches:** Known attack chains  
**Current patterns:**
- PRIVILEGE_ESCALATION (role + policy changes)
- CREDENTIAL_COMPROMISE (logins + unusual activity)
- DATA_EXFILTRATION (forwarding + external access)
- MASS_USER_CREATION (5+ users in 1 hour) - NEW
- BULK_PERMISSION_GRANT (4+ grants, 2+ types) - NEW

### Current Correlations (5 detected)

```
1. SUSPICIOUS_LOGIN (96/100 CRITICAL)
   Related Alerts: 2
   Actors: Azure AD Identity Protection
   Time Window: 22 minutes
   Description: "Azure AD Identity Protection performed 2 risky actions"
   
2. BURST_ACTIVITY (91/100 CRITICAL)
   Related Alerts: 6
   Time Window: -58 minutes
   Description: "6 alerts detected - possible active incident"
   
3. PRIVILEGE_ESCALATION (90/100 CRITICAL)
   Related Alerts: 2
   Actors: admin@nasstech.com
   Time Window: -51 minutes
   Description: "Privilege escalation: role + policy changes"
   
4. USER_MANIPULATION (89/100 CRITICAL)
   Related Alerts: 4
   Time Window: 58 minutes
   Description: "Multiple actions targeting USER detected"
   
5. CREDENTIAL_COMPROMISE (88/100 CRITICAL)
   Related Alerts: 7
   Actors: admin@nasstech.com
   Time Window: 58 minutes
   Description: "Account compromise: suspicious login + unusual activity"
```

### Correlation Properties

```javascript
{
  id: "correlation-id",
  correlation_type: "ACTOR",     // ACTOR, TARGET, TEMPORAL, PATTERN
  alert_ids: ["id1", "id2"],     // Related alerts
  actor: "user@company.com",     // If actor-based
  target: "MAILBOX",             // If target-based (null otherwise)
  start_timestamp: "...",        // First alert time
  end_timestamp: "...",          // Last alert time
  alert_count: 3,                // How many alerts related
  correlation_score: 96,         // 0-100 confidence
  pattern_type: "SUSPICIOUS_LOGIN",  // Attack type detected
  risk_level: "CRITICAL",        // Based on score
  description: "...",            // Human-readable summary
  metadata: {                    // Additional context
    severity_breakdown: {critical: 2, high: 1},
    avg_score: 90,
    time_span_minutes: 30
  }
}
```

### Viewed In
**Correlations Tab** - Cards showing grouped alerts and relationships

---

## Layer 3: ATTACK PATTERNS - Attack Strategies Detected

### What They Are
Attack patterns are the **attack type** inferred from correlations.

### Pattern Types

| Pattern | What It Means | Indicators | Risk |
|---------|--------------|-----------|------|
| **SUSPICIOUS_LOGIN** | Risky authentication | Impossible travel, unusual location, failed attempts | CRITICAL |
| **PRIVILEGE_ESCALATION** | Gaining admin access | Role assignment + policy changes | CRITICAL |
| **CREDENTIAL_COMPROMISE** | Account was taken over | Login anomalies + unusual activity | CRITICAL |
| **DATA_EXFILTRATION** | Stealing data | Email forwarding + OAuth + external access | CRITICAL |
| **USER_MANIPULATION** | Targeting specific users | Multiple user-focused actions | CRITICAL |
| **BURST_ACTIVITY** | Rapid attack sequence | Many alerts in short time | CRITICAL |
| **MASS_USER_CREATION** | Creating backdoor accounts | 5+ users from same actor in 1 hour | CRITICAL |
| **BULK_PERMISSION_GRANT** | Expanding access | 4+ grants to multiple resource types | CRITICAL |

### Current Detected Patterns (5)

```
1. SUSPICIOUS_LOGIN
   Confidence: 96/100
   When: 2026-06-19 14:13:05
   What Happened: Azure AD detected risky login patterns

2. BURST_ACTIVITY
   Confidence: 91/100
   When: 2026-06-19 14:48:45
   What Happened: 6 security events in rapid succession

3. PRIVILEGE_ESCALATION
   Confidence: 90/100
   When: 2026-06-19 14:35:09
   What Happened: Admin role assigned + policy changed

4. USER_MANIPULATION
   Confidence: 89/100
   When: 2026-06-19 14:48:45
   What Happened: Multiple actions targeting users

5. CREDENTIAL_COMPROMISE
   Confidence: 88/100
   When: 2026-06-19 14:49:58
   What Happened: Account taken over, unusual activity detected
```

### Viewed In
**Attack Patterns Tab** - Shows the attack types being executed

---

## The Complete Relationship

### Visual Example: Admin Account Compromise Attack

```
LAYER 1: INDIVIDUAL ALERTS
═══════════════════════════════════════

Time: 14:07:00 - User "admin@nasstech.com" signs in from London
       └─→ Alert: "HIGH: Sign-in from new location"

Time: 14:08:30 - Same user adds 3 service principals
       └─→ Alert: "CRITICAL: Service principal created"

Time: 14:09:15 - Same user creates email forwarding rule
       └─→ Alert: "CRITICAL: Forwarding rule to external domain"

Time: 14:10:00 - Admin role assigned to unknown service account
       └─→ Alert: "CRITICAL: Global admin role granted"

Time: 14:15:00 - OAuth consent grant to external app
       └─→ Alert: "HIGH: OAuth consent to suspicious app"

Time: 14:18:30 - Policy change disabling MFA
       └─→ Alert: "CRITICAL: MFA policy disabled"

Time: 14:20:00 - Bulk group membership changes
       └─→ Alert: "HIGH: Multiple group changes detected"


LAYER 2: CORRELATIONS (Relationships)
═════════════════════════════════════════

Correlation #1 - ACTOR-Based:
  Actor: admin@nasstech.com
  Related Alerts: [7 above]
  Time Window: 13 minutes
  Trigger: CRITICAL alerts from same user
  Result: "Same user performing multiple suspicious actions"
  Confidence: 96/100

Correlation #2 - TEMPORAL:
  Time Window: 13 minutes
  Alert Count: 7
  Trigger: Burst of high-severity events
  Result: "Multiple alerts clustered = active incident"
  Confidence: 91/100

Correlation #3 - ATTACK PATTERN:
  Pattern: PRIVILEGE_ESCALATION
  Detected: Role assignment + policy change (MFA disabled)
  Result: "Attacker escalating privileges"
  Confidence: 90/100

Correlation #4 - ATTACK PATTERN:
  Pattern: CREDENTIAL_COMPROMISE
  Detected: Suspicious login + service principal + OAuth grants
  Result: "Account has been compromised"
  Confidence: 88/100

Correlation #5 - ATTACK PATTERN:
  Pattern: DATA_EXFILTRATION
  Detected: Email forwarding + OAuth + external app
  Result: "Attacker setting up data theft"
  Confidence: 92/100


LAYER 3: ATTACK PATTERNS (Attack Strategy)
═════════════════════════════════════════════

The system detected:
  ✓ PRIVILEGE_ESCALATION (90% confidence)
    └─ Attacker is gaining admin access
  
  ✓ CREDENTIAL_COMPROMISE (88% confidence)
    └─ The admin account has been compromised
  
  ✓ DATA_EXFILTRATION (92% confidence)
    └─ Attacker is setting up data theft mechanisms
  
  ✓ SUSPICIOUS_LOGIN (Initial indicator)
    └─ Started with unusual login location
  
  ✓ BURST_ACTIVITY (91% confidence)
    └─ Attack is happening rapidly


FINAL ASSESSMENT
════════════════════════════════════════

Threat Level: 🔴 CRITICAL
Attack Type: Multi-stage account compromise with data theft intent
Confidence: 90% average
Timeline: 13 minutes
Victim: admin@nasstech.com
Attack Pattern: Privilege escalation → Credential compromise → Data exfiltration
Recommended Action: Immediately revoke admin credentials, review mailbox forwarding, 
                    disable OAuth consents, force password reset
```

---

## How to Understand Your Own Alerts

### Step 1: Look at the Alerts Tab
See what individual events were detected

### Step 2: Check the Correlations Tab
Understand which alerts are related and why

### Step 3: Review the Attack Patterns Tab
Identify what attack is happening

### Step 4: Take Action Based on Pattern
```
If Pattern = PRIVILEGE_ESCALATION:
  → Check who granted admin rights
  → Review recent permission changes
  → Audit resource access

If Pattern = CREDENTIAL_COMPROMISE:
  → Reset user password immediately
  → Review all recent sign-ins
  → Audit all actions by that user

If Pattern = DATA_EXFILTRATION:
  → Check email forwarding rules
  → Audit file/data access
  → Review shared externally items
```

---

## How to Customize (Quick Reference)

### To Add Custom Pattern Detection
**File:** `backend/tenantguard/correlation-engine.js`

```javascript
// 1. Add detection method (after line 396):
detectMyCustomPattern(alerts) {
  // Your detection logic
  return correlationObject
}

// 2. Call it in findAttackPatterns() (line 264):
const myPattern = this.detectMyCustomPattern(alerts)
if (myPattern) correlations.push(myPattern)
```

### To Adjust Sensitivity
**File:** `backend/tenantguard/correlation-engine.js`

```javascript
// Make more sensitive (detect more):
this.timeWindow = 1800000      // 30 min instead of 60
this.minAlertThreshold = 2     // Already at minimum

// Make less sensitive (detect less):
this.timeWindow = 7200000      // 2 hours instead of 60
this.minAlertThreshold = 5     // Require 5 alerts not 2
```

### To Change Risk Thresholds
**File:** `backend/tenantguard/correlation-engine.js`, line 117

```javascript
// Current:
risk_level: score >= 85 ? 'CRITICAL' : score >= 70 ? 'HIGH' : 'MEDIUM'

// Make more alerts CRITICAL:
risk_level: score >= 75 ? 'CRITICAL' : score >= 60 ? 'HIGH' : 'MEDIUM'
```

---

## Configuration Files

| File | Purpose | Location |
|------|---------|----------|
| **CORRELATION_CONFIGURATION_GUIDE.md** | Detailed configuration reference | Project root |
| **CUSTOM_PATTERNS_QUICK_START.md** | Add custom patterns | Project root |
| **correlation-engine.js** | Main correlation logic | backend/tenantguard/ |
| **correlation-schema.js** | Database tables | backend/tenantguard/ |

---

## Database Tables

### alert_correlations Table
Stores all detected correlations with:
- Correlation ID, type, alert relationships
- Actor and target information
- Time window (start/end)
- Pattern type and risk level
- Confidence score
- Metadata for analysis

### Indexes for Performance
- `idx_correlations_actor` - Quick actor lookup
- `idx_correlations_type` - Pattern type search
- `idx_correlations_score` - Sorted by confidence
- `idx_correlations_risk` - Risk level filtering
- `idx_correlations_pattern` - Pattern type grouping

---

## API Endpoints

### Get All Alerts
```bash
GET /api/tenantguard/alerts
Response: {
  success: true,
  data: [alert objects],
  count: 6
}
```

### Get All Correlations
```bash
GET /api/tenantguard/correlations
Response: {
  success: true,
  data: [correlation objects],
  count: 5
}
```

### Get Attack Patterns (same as correlations)
```bash
GET /api/tenantguard/patterns
Response: {
  success: true,
  data: [pattern objects],
  count: 5
}
```

---

## Summary

| Layer | What | How Many | Viewed In | Purpose |
|-------|------|---------|-----------|---------|
| **1. Alerts** | Individual events | 6 | Alerts Tab | See what happened |
| **2. Correlations** | Related alert groups | 5 | Correlations Tab | Understand relationships |
| **3. Patterns** | Attack types | 5 patterns | Attack Patterns Tab | Identify attack strategy |

The three layers work together to provide:
- ✅ **Visibility** into individual security events
- ✅ **Context** on how events relate
- ✅ **Intelligence** on what attack is happening
- ✅ **Confidence scores** on each assessment
- ✅ **Customizable rules** for your environment

