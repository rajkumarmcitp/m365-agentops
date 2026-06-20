# TenantGuard Correlation Configuration Guide

## Overview

The TenantGuard Correlation Engine automatically detects relationships between security alerts and identifies attack patterns. This guide shows you how to:
1. Understand the current correlation strategies
2. Configure correlation rules
3. Add custom attack pattern detection
4. Adjust sensitivity and thresholds

---

## Part 1: Current Correlation Strategies

### Strategy 1: Actor-Based Correlation
**What It Does:** Groups alerts from the same user/service within a time window

**File:** `backend/tenantguard/correlation-engine.js:75-129`

**How It Works:**
```javascript
// Current Configuration:
- Groups alerts by: actor (user account)
- Time window: 1 hour (3600000 ms)
- Trigger condition: 
  * At least 1 CRITICAL alert, OR
  * At least 2 HIGH alerts
```

**Example:**
```
Alert: User "admin@company.com" signs in from London at 2:00 PM (score: 65)
Alert: User "admin@company.com" creates forwarding rule at 2:15 PM (score: 80)
Alert: User "admin@company.com" adds global admin at 2:30 PM (score: 95)
↓
Correlation: "admin@company.com performed 3 risky actions in 30 minutes"
Pattern Type: SUSPICIOUS_LOGIN (because it starts with sign-in)
Risk Level: CRITICAL (score >= 85)
Confidence: 96/100
```

**To Modify:** Edit lines 103-104
```javascript
// Current:
if (criticalCount > 0 || highCount >= 2) {

// To make more sensitive (fewer alerts required):
if (criticalCount > 0 || highCount >= 1) {

// To make less sensitive (more alerts required):
if (criticalCount >= 2 || highCount >= 3) {
```

---

### Strategy 2: Target-Based Correlation
**What It Does:** Groups alerts targeting the same resource (mailbox, policy, user, role, etc.)

**File:** `backend/tenantguard/correlation-engine.js:134-180`

**How It Works:**
```javascript
// Extracts target from alert headline/description
Targets: MAILBOX, POLICY, USER, GROUP, ROLE

// Groups alerts by target
// Triggers if 2+ alerts targeting same resource
```

**Example:**
```
Alert: "Mailbox forwarding rule created" (score: 80)
Alert: "Mailbox delegation permission granted" (score: 75)
↓
Correlation: "Multiple actions targeting MAILBOX detected"
Pattern Type: MAILBOX_MANIPULATION
Risk Level: CRITICAL (score >= 85)
```

**To Add New Target Type:** Edit lines 144-148
```javascript
// Current:
if (desc.includes('mailbox') || headline.includes('mailbox')) target = 'MAILBOX'
else if (desc.includes('policy') || headline.includes('policy')) target = 'POLICY'

// To add a new target type:
else if (desc.includes('app') || headline.includes('application')) target = 'APPLICATION'
else if (desc.includes('database') || headline.includes('data')) target = 'DATABASE'
```

---

### Strategy 3: Temporal Correlation
**What It Does:** Detects "burst activity" - many alerts clustered in short time window

**File:** `backend/tenantguard/correlation-engine.js:185-245`

**How It Works:**
```javascript
// Time window: 1 hour (same as actor-based)
// Trigger: 2+ alerts within time window with:
//   * At least 1 CRITICAL alert, OR
//   * Average score >= 70
```

**Example:**
```
Alert: Global Admin Role Added (score: 95)
Alert: Policy Update (score: 85)
Alert: User Added to Group (score: 72)
Alert: Mailbox Forwarding (score: 78)
↓ (All within 1 hour)
Correlation: "6 alerts detected - possible active incident"
Pattern Type: BURST_ACTIVITY
Risk Level: CRITICAL
Confidence: 91/100
```

**To Change Time Window:** Edit line 12
```javascript
// Current: 1 hour
this.timeWindow = 3600000

// To change to 30 minutes:
this.timeWindow = 1800000

// To change to 2 hours:
this.timeWindow = 7200000
```

---

### Strategy 4: Attack Pattern Detection
**What It Does:** Detects specific attack patterns based on alert combinations

**File:** `backend/tenantguard/correlation-engine.js:250-396`

#### Pattern 1: Privilege Escalation (lines 272-315)
```javascript
Detects: Role assignment + Policy change within 1 hour
Indicators:
  - Headline contains: "role", "admin", or "privilege"
  - Headline contains: "policy"
Confidence Score: 90
Risk Level: CRITICAL
```

**Example:**
```
Alert: "Global Admin Role Added to User" (score: 95)
Alert: "MFA Policy Disabled" (score: 85)
↓ (Both within 1 hour)
Pattern: PRIVILEGE_ESCALATION
Description: "Privilege escalation attack detected"
```

#### Pattern 2: Credential Compromise (lines 321-358)
```javascript
Detects: Impossible travel + High-risk activity
Indicators:
  - 2+ suspicious logins (impossible travel, suspicious sign-in)
  - 2+ unusual activity alerts (score >= 75)
Confidence Score: 88
Risk Level: CRITICAL
```

**Example:**
```
Alert: "Sign-in from impossible travel" (London -> Sydney in 2 hours)
Alert: "Multiple failed sign-in attempts"
Alert: "Unusual activity: bulk file download"
Alert: "Unusual activity: policy modification"
↓
Pattern: CREDENTIAL_COMPROMISE
Description: "Account compromise: suspicious login patterns + unusual activity"
```

#### Pattern 3: Data Exfiltration (lines 364-396)
```javascript
Detects: Email forwarding + External access indicators
Indicators:
  - Headline contains: "forward", "delegation", "oauth", "consent", "external"
  - 2+ indicators required
Confidence Score: 92
Risk Level: CRITICAL
```

**Example:**
```
Alert: "Mailbox Forwarding Rule to External Domain"
Alert: "OAuth consent grant to external app"
↓
Pattern: DATA_EXFILTRATION
Description: "Data exfiltration attempt: forwarding + external access"
```

---

## Part 2: How to Add Custom Correlation Rules

### Example 1: Add "Mass User Creation" Pattern

```javascript
// File: backend/tenantguard/correlation-engine.js

// Step 1: Add new method to CorrelationEngine class (after line 396)

/**
 * Attack Pattern: Mass User Creation
 * Look for: Multiple user creation alerts from same actor in short time
 */
detectMassUserCreation(alerts) {
  const userCreationAlerts = alerts.filter(a => {
    const headline = (a.headline || '').toLowerCase()
    return headline.includes('user') && (headline.includes('created') || headline.includes('added'))
  })

  // Trigger if 5+ users created by same actor in 1 hour
  if (userCreationAlerts.length >= 5) {
    const grouped = {}
    userCreationAlerts.forEach(alert => {
      const actor = alert.actor || 'System'
      if (!grouped[actor]) grouped[actor] = []
      grouped[actor].push(alert)
    })

    const results = []
    Object.entries(grouped).forEach(([actor, alerts]) => {
      if (alerts.length >= 5) {
        const sorted = alerts.sort((a, b) => 
          new Date(b.action_timestamp) - new Date(a.action_timestamp)
        )
        const timeSpan = new Date(sorted[sorted.length - 1].action_timestamp) -
                         new Date(sorted[0].action_timestamp)

        if (timeSpan < 3600000) { // Within 1 hour
          results.push({
            id: uuid(),
            correlation_type: 'PATTERN',
            alert_ids: sorted.map(a => a.id).join(','),
            actor: actor,
            target: null,
            start_timestamp: sorted[sorted.length - 1].action_timestamp,
            end_timestamp: sorted[0].action_timestamp,
            alert_count: sorted.length,
            correlation_score: 94,
            pattern_type: 'MASS_USER_CREATION',
            risk_level: 'CRITICAL',
            description: `${actor} created ${sorted.length} users in ${Math.round(timeSpan / 60000)} minutes`,
            metadata: JSON.stringify({
              attack_pattern: 'mass_user_creation',
              user_count: sorted.length,
              time_window_minutes: Math.round(timeSpan / 60000)
            })
          })
        }
      }
    })

    return results
  }

  return []
}

// Step 2: Call the new method in analyzeAlerts() (line 57)

// Add this line after the existing pattern detections:
this.findMassUserCreation(alerts).forEach(c => correlations.push(c))

// Change line 57 from:
this.findAttackPatterns(alerts).forEach(c => correlations.push(c))

// To:
this.findAttackPatterns(alerts).forEach(c => correlations.push(c))
// NEW: Mass user creation pattern
const massUserCreations = this.detectMassUserCreation(alerts)
if (massUserCreations.length > 0) {
  massUserCreations.forEach(c => correlations.push(c))
}
```

### Example 2: Add "Email Delegation" Pattern

```javascript
// Add to findAttackPatterns() method (after line 263):

// Pattern: Email Delegation
const delegationPattern = this.detectEmailDelegation(alerts)
if (delegationPattern) correlations.push(delegationPattern)

// Then add the method:

/**
 * Attack Pattern: Suspicious Email Delegation
 * Look for: Email delegation + external access + forwarding
 */
detectEmailDelegation(alerts) {
  const delegationAlerts = alerts.filter(a => {
    const headline = (a.headline || '').toLowerCase()
    return headline.includes('delegation') || headline.includes('delegate') || headline.includes('send-as')
  })

  const externalAlerts = alerts.filter(a => {
    const headline = (a.headline || '').toLowerCase()
    return headline.includes('external') || headline.includes('guest')
  })

  if (delegationAlerts.length >= 1 && externalAlerts.length >= 1) {
    const combined = [...delegationAlerts, ...externalAlerts].sort(
      (a, b) => new Date(b.action_timestamp) - new Date(a.action_timestamp)
    )

    return {
      id: uuid(),
      correlation_type: 'PATTERN',
      alert_ids: combined.map(a => a.id).join(','),
      actor: combined[0]?.actor,
      target: null,
      start_timestamp: combined[combined.length - 1].action_timestamp,
      end_timestamp: combined[0].action_timestamp,
      alert_count: combined.length,
      correlation_score: 89,
      pattern_type: 'EMAIL_DELEGATION_ABUSE',
      risk_level: 'CRITICAL',
      description: 'Suspicious email delegation detected: delegation + external access',
      metadata: JSON.stringify({
        attack_pattern: 'email_delegation_abuse',
        delegation_alerts: delegationAlerts.length,
        external_alerts: externalAlerts.length
      })
    }
  }

  return null
}
```

---

## Part 3: Configuration Parameters

### 1. Time Window (How close alerts need to be)
**File:** `correlation-engine.js` line 12

```javascript
// Current: 1 hour
this.timeWindow = 3600000

// Options:
3600000    // 1 hour
1800000    // 30 minutes
7200000    // 2 hours
300000     // 5 minutes (very sensitive)
```

### 2. Minimum Alert Threshold
**File:** `correlation-engine.js` line 13

```javascript
// Current: Minimum 2 alerts to correlate
this.minAlertThreshold = 2

// Options:
2          // Lowest threshold (more correlations)
3          // Medium
5          // High (fewer correlations)
```

### 3. Risk Level Thresholds
**File:** `correlation-engine.js` lines 117, 173, 233

```javascript
// Current scoring:
risk_level: score >= 85 ? 'CRITICAL' : score >= 70 ? 'HIGH' : 'MEDIUM'

// To make more alerts CRITICAL:
risk_level: score >= 75 ? 'CRITICAL' : score >= 60 ? 'HIGH' : 'MEDIUM'

// To be more conservative:
risk_level: score >= 95 ? 'CRITICAL' : score >= 80 ? 'HIGH' : 'MEDIUM'
```

### 4. Alert Score Multipliers (Risk Calculation)
**File:** `correlation-engine.js` lines 408-410

```javascript
// Current: 
score += criticalCount * 15    // Each CRITICAL alert adds 15 points
score += highCount * 8         // Each HIGH alert adds 8 points

// To increase sensitivity to CRITICAL alerts:
score += criticalCount * 25
score += highCount * 10

// To decrease sensitivity:
score += criticalCount * 10
score += highCount * 5
```

---

## Part 4: Testing Your Configuration

### 1. Generate Test Alerts
```javascript
// In server.js, modify alert generation to create specific scenarios

// For mass user creation testing:
for (let i = 0; i < 8; i++) {
  alerts.push({
    id: uuid(),
    headline: `User Created: user${i}@test.com`,
    description: `New user account created`,
    severity: 'HIGH',
    score: 75,
    actor: 'admin@test.com',  // Same actor
    action_timestamp: new Date(Date.now() - (i * 300000)).toISOString(), // 5 min apart
  })
}
```

### 2. Check Correlation Results
```bash
# Test the correlation API
curl http://localhost:3000/api/tenantguard/correlations | jq '.data[] | {
  pattern_type,
  alert_count,
  correlation_score,
  risk_level,
  description
}'
```

### 3. Monitor Backend Logs
```bash
# Watch for correlation messages
tail -f /tmp/backend.log | grep -E "✓ Stored correlation|correlation analysis"
```

---

## Part 5: Best Practices

### Do's ✅
1. **Test changes on dev first** before production
2. **Document custom patterns** with clear descriptions
3. **Use meaningful pattern_type names** (e.g., `MASS_USER_CREATION`)
4. **Include metadata** for debugging and auditing
5. **Start conservative**, then tune based on false positive rates

### Don'ts ❌
1. Don't set time windows too short (<5 minutes) - too many false positives
2. Don't set minimum threshold to 1 - every alert will correlate
3. Don't use vague pattern types like "SUSPICIOUS" or "UNKNOWN"
4. Don't hardcode actor/target - let system detect them
5. Don't ignore edge cases (null values, empty strings)

---

## Part 6: Common Customizations

### Make Correlations More Sensitive (Detect More)
```javascript
// In correlation-engine.js line 12:
this.timeWindow = 1800000  // Change to 30 minutes

// Line 13:
this.minAlertThreshold = 2  // Keep at 2 (already minimum)

// Line 103-104:
if (criticalCount > 0 || highCount >= 1) {  // Changed from >= 2

// Line 218:
if (criticalCount > 0 || avgScore >= 60) {  // Changed from >= 70
```

### Make Correlations Less Sensitive (Fewer False Positives)
```javascript
// In correlation-engine.js line 12:
this.timeWindow = 7200000  // Change to 2 hours

// Line 13:
this.minAlertThreshold = 3  // Changed from 2

// Line 103-104:
if (criticalCount >= 1 && highCount >= 3) {  // More restrictive

// Line 218:
if (criticalCount >= 2 || avgScore >= 80) {  // Higher threshold
```

### Add Service-Specific Patterns (Teams, SharePoint, etc.)

```javascript
// Add to findAttackPatterns() method:

// Pattern: Suspicious Teams Activity
const teamsPattern = this.detectSuspiciousTeams(alerts)
if (teamsPattern) correlations.push(teamsPattern)

detectSuspiciousTeams(alerts) {
  const teamsAlerts = alerts.filter(a => {
    const headline = (a.headline || '').toLowerCase()
    return headline.includes('teams')
  })

  if (teamsAlerts.length >= 3) {
    return {
      id: uuid(),
      pattern_type: 'SUSPICIOUS_TEAMS_ACTIVITY',
      correlation_score: 85,
      // ... rest of pattern
    }
  }
  return null
}
```

---

## Summary

| Component | File | How to Modify |
|-----------|------|---------------|
| Actor Correlation | correlation-engine.js:75-129 | Change severity threshold (line 103) |
| Target Correlation | correlation-engine.js:134-180 | Add target types (line 144-148) |
| Temporal Correlation | correlation-engine.js:185-245 | Change time window (line 12) |
| Attack Patterns | correlation-engine.js:250-396 | Add new methods, call in analyzeAlerts() |
| Thresholds | correlation-engine.js:12-13 | Adjust timeWindow and minAlertThreshold |
| Risk Scoring | correlation-engine.js:402-422 | Modify calculateActorRisk() and calculateTargetRisk() |

---

## Next Steps

1. Review your current alert types
2. Identify which custom patterns would be most valuable
3. Start with one custom pattern
4. Test with sample alerts
5. Gradually add more patterns
6. Monitor false positive rate
7. Tune sensitivity as needed

