# Custom Attack Patterns - Quick Start Guide

## What Changed

I've added **2 new attack pattern detections** to the TenantGuard system:

### 1. Mass User Creation (NEW)
**Pattern Type:** `MASS_USER_CREATION`  
**Confidence Score:** 94/100  
**Trigger:** 5+ user accounts created by same actor within 1 hour

**What it detects:**
- Account takeover attempts creating backdoor accounts
- Lateral movement preparation
- Insider threats setting up unauthorized access

**Example Alert Flow:**
```
Alert: User "admin@company.com" created "user1"
Alert: User "admin@company.com" created "user2"
Alert: User "admin@company.com" created "user3"
Alert: User "admin@company.com" created "user4"
Alert: User "admin@company.com" created "user5"
↓ (All within 1 hour)
CORRELATION DETECTED:
  Pattern: MASS_USER_CREATION
  Risk Level: CRITICAL
  Description: "Suspicious mass user creation: admin@company.com 
                created 5 accounts in 45 minutes"
```

### 2. Bulk Permission Grant (NEW)
**Pattern Type:** `BULK_PERMISSION_GRANT`  
**Confidence Score:** 91/100  
**Trigger:** 4+ permission/role grants affecting 2+ different resource types within 1 hour

**What it detects:**
- Access expansion attacks
- Privilege escalation across multiple systems
- Insider threat expanding resource access

**Example Alert Flow:**
```
Alert: User granted to Global Admin Role
Alert: User added to Executive Group
Alert: User granted Mailbox Permission
Alert: User added to Site Collection Admin
↓ (All within 1 hour, affects: GLOBAL_ACCESS, GROUP_ACCESS, MAILBOX_ACCESS, ADMIN_ACCESS)
CORRELATION DETECTED:
  Pattern: BULK_PERMISSION_GRANT
  Risk Level: CRITICAL
  Description: "Bulk permission grant detected: 4 permissions 
                granted to multiple resources in 30 minutes"
```

---

## How Alerts Relate Together

### Flow Chart

```
┌─────────────────────────────────────────────┐
│ Individual Alerts Generated                 │
│                                             │
│ • User Created: john.smith@test.com        │
│ • User Created: jane.doe@test.com          │
│ • User Created: external.user@test.com     │
│ • User Created: backup.admin@test.com      │
│ • User Created: service.account@test.com   │
└────────────┬────────────────────────────────┘
             │
             │ Correlation Engine Analyzes
             │ (Every 15 minutes)
             │
             ├─ Are they from same actor?
             ├─ Happened within time window? (1 hour)
             ├─ Count exceeds threshold? (5+ alerts)
             └─ Is pattern suspicious?
             │
             ▼
┌─────────────────────────────────────────────┐
│ Correlation Detected                        │
│                                             │
│ Pattern Type: MASS_USER_CREATION            │
│ Actor: admin@company.com                    │
│ Related Alerts: [5 alerts]                  │
│ Risk Level: CRITICAL                        │
│ Confidence: 94/100                          │
│ Time Span: 45 minutes                       │
└────────────┬────────────────────────────────┘
             │
             │ Displayed in TenantGuard UI
             │
             ▼
┌─────────────────────────────────────────────┐
│ Tabs Show the Relationship                  │
│                                             │
│ 🔔 Alerts Tab:                              │
│    Shows the 5 individual "User Created"    │
│    alerts with timestamps                   │
│                                             │
│ 🔗 Correlations Tab:                        │
│    Shows how the 5 alerts are related       │
│    "admin@company.com" created 5 users      │
│    Related alerts: 5                        │
│    Confidence: 94/100                       │
│                                             │
│ 📊 Attack Patterns Tab:                     │
│    Shows the attack type detected:          │
│    MASS_USER_CREATION                       │
│    (This is what the attacker is doing)     │
└─────────────────────────────────────────────┘
```

---

## Configuration Examples

### Example 1: Make Mass User Creation Less Strict

**Current Config (Default):**
- Minimum 5 users created
- Within 1 hour
- Same actor

**To detect 3+ user creations instead:**

File: `backend/tenantguard/correlation-engine.js`

```javascript
// Find this line in detectMassUserCreation():
if (actorAlerts.length >= 5) return null

// Change to:
if (actorAlerts.length >= 3) return null
```

### Example 2: Reduce Time Window for Faster Detection

**Current Config:** 1 hour (3600000 ms)

**Change to 30 minutes (more sensitive):**

File: `backend/tenantguard/correlation-engine.js`, line 12

```javascript
// Current:
this.timeWindow = 3600000

// Change to:
this.timeWindow = 1800000  // 30 minutes
```

### Example 3: Add Email Forwarding Pattern

Add this new method after `detectBulkPermissionGrant()`:

```javascript
/**
 * Attack Pattern: Suspicious Email Forwarding
 * Look for: Email forwarding rule to external domain
 */
detectEmailForwarding(alerts) {
  const forwardingAlerts = alerts.filter(a => {
    const headline = (a.headline || '').toLowerCase()
    return headline.includes('forwarding') && headline.includes('external')
  })

  if (forwardingAlerts.length >= 1) {
    return {
      id: uuid(),
      correlation_type: 'PATTERN',
      alert_ids: forwardingAlerts.map(a => a.id).join(','),
      actor: forwardingAlerts[0]?.actor,
      target: null,
      start_timestamp: forwardingAlerts[0].action_timestamp,
      end_timestamp: forwardingAlerts[0].action_timestamp,
      alert_count: forwardingAlerts.length,
      correlation_score: 95,
      pattern_type: 'EMAIL_FORWARDING_ABUSE',
      risk_level: 'CRITICAL',
      description: `Email forwarding to external domain detected`,
      metadata: JSON.stringify({
        attack_pattern: 'email_forwarding_abuse',
        forwarding_count: forwardingAlerts.length
      })
    }
  }

  return null
}
```

Then add it to `findAttackPatterns()`:

```javascript
// Pattern: Email Forwarding
const emailFwdPattern = this.detectEmailForwarding(alerts)
if (emailFwdPattern) correlations.push(emailFwdPattern)
```

---

## Testing Your Custom Patterns

### Step 1: Generate Test Alerts

Edit `backend/server.js` in the `initializeTenantGuard()` function:

```javascript
// Add this to test mass user creation
const testAlerts = [
  {
    id: uuid(),
    type: 'USER_CREATED',
    severity: 'MEDIUM',
    score: 65,
    headline: 'User Created: testuser1@company.com',
    description: 'New user account created',
    actor: 'admin@company.com',
    action_timestamp: new Date(Date.now() - 45 * 60000).toISOString(),
  },
  {
    id: uuid(),
    type: 'USER_CREATED',
    severity: 'MEDIUM',
    score: 65,
    headline: 'User Created: testuser2@company.com',
    description: 'New user account created',
    actor: 'admin@company.com',
    action_timestamp: new Date(Date.now() - 40 * 60000).toISOString(),
  },
  // ... add 3 more similar alerts
]

testAlerts.forEach(alert => {
  db.prepare(`
    INSERT INTO alerts (...)
    VALUES (...)
  `).run(...)
})
```

### Step 2: Restart Backend and Check Logs

```bash
# Kill and restart backend
pkill -f "node server.js"
sleep 2
cd backend && node server.js

# Watch for mass user creation detection
grep "MASS_USER_CREATION" /tmp/backend.log
```

### Step 3: Query the API

```bash
# Check if pattern was detected
curl http://localhost:3000/api/tenantguard/correlations | jq '.data[] | select(.pattern_type == "MASS_USER_CREATION")'

# Output should show:
# {
#   "pattern_type": "MASS_USER_CREATION",
#   "correlation_score": 94,
#   "alert_count": 5,
#   "actor": "admin@company.com",
#   ...
# }
```

---

## Existing vs New Patterns

| Pattern | Type | Trigger | Confidence | New? |
|---------|------|---------|------------|------|
| SUSPICIOUS_LOGIN | Actor | Same user risky logins | 96 | ❌ |
| BURST_ACTIVITY | Temporal | 6+ alerts in 1 hour | 91 | ❌ |
| PRIVILEGE_ESCALATION | Attack | Role + Policy change | 90 | ❌ |
| USER_MANIPULATION | Target | Multiple user actions | 89 | ❌ |
| CREDENTIAL_COMPROMISE | Attack | Logins + unusual activity | 88 | ❌ |
| MASS_USER_CREATION | Attack | 5+ users in 1 hour | 94 | ✅ NEW |
| BULK_PERMISSION_GRANT | Attack | 4+ grants, 2+ types | 91 | ✅ NEW |
| DATA_EXFILTRATION | Attack | Forward + OAuth + consent | 92 | ❌ |

---

## How to Add Your Own Pattern (5 Steps)

### Step 1: Identify the Attack
```
What are you trying to detect?
- Multiple failed logins?
- Bulk group additions?
- Rapid API token creation?
- Unusual after-hours activity?
```

### Step 2: Define Alert Indicators
```javascript
// Example: Detect MFA Bypass Attempts
const mfaBypassAlerts = alerts.filter(a => {
  const headline = (a.headline || '').toLowerCase()
  return headline.includes('mfa') && 
         (headline.includes('disabled') || headline.includes('bypass'))
})
```

### Step 3: Set Thresholds
```javascript
// How many alerts to trigger correlation?
if (mfaBypassAlerts.length < 2) return null

// How close in time?
if (timeSpan > 3600000) return null  // More than 1 hour

// How confident?
const score = 87  // Adjust 0-100
```

### Step 4: Create the Correlation Object
```javascript
return {
  id: uuid(),
  correlation_type: 'PATTERN',
  alert_ids: mfaBypassAlerts.map(a => a.id).join(','),
  actor: mfaBypassAlerts[0]?.actor,
  target: null,
  start_timestamp: sortedAlerts[sortedAlerts.length - 1].action_timestamp,
  end_timestamp: sortedAlerts[0].action_timestamp,
  alert_count: mfaBypassAlerts.length,
  correlation_score: 87,
  pattern_type: 'MFA_BYPASS_ATTEMPT',
  risk_level: 'CRITICAL',
  description: `MFA bypass attempt detected: ${mfaBypassAlerts.length} MFA-related changes`,
  metadata: JSON.stringify({
    attack_pattern: 'mfa_bypass_attempt',
    count: mfaBypassAlerts.length
  })
}
```

### Step 5: Wire it up
```javascript
// In findAttackPatterns():
const mfaBypassPattern = this.detectMFABypass(alerts)
if (mfaBypassPattern) correlations.push(mfaBypassPattern)
```

---

## Common Pattern Ideas

### 1. Suspicious Service Principal Activity
```javascript
// Detect: Service principal token generation, high API calls
if (alerts.filter(a => a.actor.includes('service')).length >= 5) {
  // Create pattern: SERVICE_PRINCIPAL_ABUSE
}
```

### 2. Off-Hours Activity
```javascript
// Detect: Critical actions outside business hours (9-5)
const afterHours = alerts.filter(a => {
  const hour = new Date(a.action_timestamp).getHours()
  return hour < 9 || hour > 17
})
```

### 3. Cross-Tenant Access
```javascript
// Detect: Sign-ins from multiple tenants
if (uniqueTenants.size >= 2) {
  // Create pattern: CROSS_TENANT_ACTIVITY
}
```

### 4. Sensitive Data Access
```javascript
// Detect: Access to sensitive files/groups
if (alerts.filter(a => 
  a.headline.includes('confidential') || 
  a.headline.includes('executive')).length >= 3) {
  // Create pattern: SENSITIVE_DATA_ACCESS
}
```

### 5. Password Policy Bypass
```javascript
// Detect: Password policy changes + account creation
if (passwordPolicyAlerts.length >= 1 && newUserAlerts.length >= 3) {
  // Create pattern: PASSWORD_POLICY_BYPASS
}
```

---

## Dashboard View

When patterns are detected, users will see them in the TenantGuard UI:

**Alerts Tab:**
```
[CRITICAL] User Created: john.smith@test.com
[CRITICAL] User Created: jane.doe@test.com
[CRITICAL] User Created: external.user@test.com
[CRITICAL] User Created: backup.admin@test.com
[CRITICAL] User Created: service.account@test.com
```

**Correlations Tab:**
```
🔗 MASS_USER_CREATION (94/100 confidence)
   Actor: admin@company.com
   5 related alerts
   Risk Level: CRITICAL
   "Suspicious mass user creation: admin@company.com created 5 accounts in 45 minutes"
```

**Attack Patterns Tab:**
```
📊 MASS_USER_CREATION (94/100)
   CRITICAL - Suspicious mass user creation
   Related alerts: 5
   Time window: 45 minutes
```

---

## File Reference

| File | Purpose | How to Modify |
|------|---------|---------------|
| `correlation-engine.js` | Main correlation logic | Add new `detect*()` methods |
| `correlation-schema.js` | Database schema | Add new column if needed |
| `correlation-jobs.js` | Scheduled correlation runs | Change frequency if needed |
| `tenantguard.js` (frontend) | Display correlations | Already done - no changes needed |

---

## Next Steps

1. **Review existing patterns** - Understand how they work
2. **Test the new patterns** - Try detecting mass user creation
3. **Create custom patterns** - Add ones specific to your security needs
4. **Monitor false positives** - Adjust thresholds if needed
5. **Document patterns** - Update this guide with your custom patterns

---

## Support

Questions? Check:
- Backend logs: `tail -f /tmp/backend.log | grep correlation`
- API response: `curl http://localhost:3000/api/tenantguard/correlations | jq`
- Code comments in `correlation-engine.js` for detailed algorithm explanations

