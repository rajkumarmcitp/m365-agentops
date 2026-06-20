# TenantGuard Quick Reference Card

## Three-Layer Security Analysis

```
ALERTS          →    CORRELATIONS    →    ATTACK PATTERNS
(What happened)      (How they relate)     (What attack type)

6 Events             5 Relationships       5 Attack Types
├ CRITICAL           ├ Actor-based        ├ PRIVILEGE_ESCALATION
├ CRITICAL           ├ Target-based       ├ CREDENTIAL_COMPROMISE
├ CRITICAL           ├ Temporal           ├ DATA_EXFILTRATION
├ HIGH               ├ Pattern 1          ├ BULK_PERMISSION_GRANT
├ HIGH               └─ Pattern 2         └ MASS_USER_CREATION
└─ MEDIUM
```

---

## Current Detection Status

| Layer | Count | Score | Status |
|-------|-------|-------|--------|
| **Alerts** | 6 | N/A | ✅ Working |
| **Correlations** | 5 | 88-96 | ✅ Working |
| **Patterns** | 5 | 88-96 | ✅ Working |

---

## The 4 Correlation Strategies

### 1️⃣ ACTOR-Based
**Groups:** Same user's alerts  
**Time Window:** 1 hour  
**Trigger:** 1+ CRITICAL or 2+ HIGH  
**Example:** admin@company.com performed 3 suspicious actions

### 2️⃣ TARGET-Based
**Groups:** Alerts about same resource  
**Targets:** MAILBOX, POLICY, USER, GROUP, ROLE  
**Trigger:** 2+ alerts targeting same resource  
**Example:** 4 alerts all about mailbox access

### 3️⃣ TEMPORAL
**Groups:** Alerts in tight time cluster  
**Time Window:** 1 hour  
**Trigger:** 6+ alerts with high severity  
**Example:** 6 security events in 45 minutes = burst activity

### 4️⃣ PATTERN-Based
**Groups:** Specific attack signatures  
**Patterns:** Privilege escalation, credential compromise, data theft, etc.  
**Trigger:** Matching alert combinations  
**Example:** Role assignment + Policy change = Privilege escalation

---

## Current Attack Patterns (7 Types)

| Pattern | Score | Indicators |
|---------|-------|------------|
| SUSPICIOUS_LOGIN | 96/100 | Impossible travel, risky login |
| DATA_EXFILTRATION | 92/100 | Forwarding + OAuth + external |
| MASS_USER_CREATION | 94/100 | 5+ users in 1 hour - NEW |
| PRIVILEGE_ESCALATION | 90/100 | Role + policy change |
| BULK_PERMISSION_GRANT | 91/100 | 4+ grants, 2+ types - NEW |
| BURST_ACTIVITY | 91/100 | 6+ alerts in 1 hour |
| CREDENTIAL_COMPROMISE | 88/100 | Login + unusual activity |

---

## How Correlations Are Made

```
1. Collect Alerts (every 15 min)
   └─ Get all alerts from last 24 hours
   └─ Filter out dismissed alerts
   
2. Apply Strategies
   ├─ Find actors with multiple alerts
   ├─ Find targets with multiple alerts
   ├─ Find time-based clusters
   └─ Match attack patterns
   
3. Score Each Correlation
   ├─ Factor in severity (CRITICAL = +15 pts)
   ├─ Factor in count (more = higher score)
   ├─ Factor in recency
   └─ Cap at 100 points
   
4. Save to Database
   ├─ Store correlation details
   ├─ Index by actor, type, score
   └─ Keep for 7 days

5. Display in UI
   ├─ Show in Correlations Tab
   ├─ Show patterns in Attack Patterns Tab
   └─ Link back to individual Alerts
```

---

## Common Tasks

### View Current Alerts
```bash
curl http://localhost:3000/api/tenantguard/alerts | jq '.data | length'
# Output: 6
```

### View Correlations
```bash
curl http://localhost:3000/api/tenantguard/correlations | jq '.data[] | {type: .pattern_type, score: .correlation_score}'
# Output: SUSPICIOUS_LOGIN 96, BURST_ACTIVITY 91, etc.
```

### View in Browser
```
http://localhost:5174/#/tenantguard
- Alerts Tab: See individual events
- Correlations Tab: See grouped relationships
- Attack Patterns Tab: See attack types
```

### Check Backend
```bash
tail -f /tmp/backend.log | grep -i correlation
# Shows: "✓ Stored correlation: ..."
```

---

## How to Configure

### Make Detections More Sensitive
**File:** `backend/tenantguard/correlation-engine.js`

```javascript
// Line 12: Reduce time window
this.timeWindow = 1800000  // 30 min instead of 60

// Result: More correlations detected
```

### Make Detections Less Sensitive
```javascript
// Line 12: Increase time window
this.timeWindow = 7200000  // 2 hours instead of 60

// Line 13: Raise minimum threshold
this.minAlertThreshold = 3  // Was 2

// Result: Fewer correlations, less false positives
```

### Add Custom Pattern (5 Steps)

**Step 1:** Identify what to detect
```
Want to find: Email delegations to external users
```

**Step 2:** Write detection code
```javascript
detectEmailDelegation(alerts) {
  const delegationAlerts = alerts.filter(a => 
    a.headline.toLowerCase().includes('delegation')
  )
  
  if (delegationAlerts.length >= 1) {
    return { /* correlation object */ }
  }
  return null
}
```

**Step 3:** Add to findAttackPatterns()
```javascript
// In findAttackPatterns() method:
const emailPattern = this.detectEmailDelegation(alerts)
if (emailPattern) correlations.push(emailPattern)
```

**Step 4:** Test
```bash
npm run build
# Restart backend
# Check logs for pattern detection
```

**Step 5:** Monitor
```bash
curl http://localhost:3000/api/tenantguard/correlations | \
  jq '.data[] | select(.pattern_type == "EMAIL_DELEGATION")'
```

---

## File Locations

| File | Purpose | Modify For |
|------|---------|-----------|
| `correlation-engine.js` | Main logic | Add patterns |
| `correlation-schema.js` | Database | New table columns |
| `database.js` | In-memory store | Storage logic |
| `tenantguard.js` | Frontend | UI changes |
| `server.js` | API endpoints | Endpoint changes |

---

## Key Parameters

```javascript
// Time window for grouping alerts
this.timeWindow = 3600000  // milliseconds (1 hour)

// Minimum alerts to create correlation
this.minAlertThreshold = 2  // Number of alerts

// Risk level thresholds
if (score >= 85) risk = 'CRITICAL'
if (score >= 70) risk = 'HIGH'
if (score >= 50) risk = 'MEDIUM'

// Score multipliers
criticalCount * 15  // Each CRITICAL adds 15 points
highCount * 8       // Each HIGH adds 8 points
```

---

## Understanding Confidence Scores

| Score | Meaning | Action |
|-------|---------|--------|
| 95-100 | Very likely attack | Investigate immediately |
| 85-94 | Likely attack | Review within 1 hour |
| 75-84 | Possible attack | Review within 4 hours |
| 60-74 | Suspicious | Monitor, review daily |
| <60 | Low risk | Alert for awareness |

---

## Understanding Risk Levels

```
🔴 CRITICAL (Score ≥ 85)
   ├─ Immediate threat
   ├─ Requires immediate action
   └─ Example: Privilege escalation, account compromise

🟠 HIGH (Score ≥ 70)
   ├─ Significant risk
   ├─ Needs investigation
   └─ Example: Suspicious login, unusual activity

🟡 MEDIUM (Score ≥ 50)
   ├─ Notable event
   ├─ Monitor and review
   └─ Example: Policy change, guest user added

🟢 LOW (<50)
   ├─ Routine activity
   ├─ For awareness
   └─ Example: Normal user addition, standard access
```

---

## Documentation Map

```
├─ ALERTS_CORRELATIONS_PATTERNS_EXPLAINED.md
│  └─ START HERE: Understand the 3-layer system
│     Visual guides, real-world examples
│
├─ CORRELATION_CONFIGURATION_GUIDE.md
│  └─ Deep dive: How each strategy works
│     Configuration details, all parameters
│
├─ CUSTOM_PATTERNS_QUICK_START.md
│  └─ How to: Add custom patterns
│     2 new patterns explained, 5 ideas
│
└─ This file (QUICK_REFERENCE.md)
   └─ Quick lookup: Common tasks & parameters
      Cheat sheet for daily use
```

---

## Quick Test

### 1. Check Alerts
```bash
curl http://localhost:3000/api/tenantguard/alerts | jq '.count'
# Should return: 6
```

### 2. Check Correlations
```bash
curl http://localhost:3000/api/tenantguard/correlations | jq '.count'
# Should return: 5
```

### 3. Check Patterns
```bash
curl http://localhost:3000/api/tenantguard/patterns | jq '.data | map(.pattern_type) | unique'
# Should return: 5 pattern types
```

### 4. View in UI
```
http://localhost:5174/#/tenantguard
- Click Alerts Tab → See 6 alerts
- Click Correlations Tab → See 5 correlations
- Click Attack Patterns Tab → See 5 patterns
```

### 5. Check Confidence
```bash
curl http://localhost:3000/api/tenantguard/correlations | \
  jq '.data[] | "\(.pattern_type): \(.correlation_score)/100"'
# Shows each pattern with its confidence score
```

---

## Troubleshooting

| Problem | Solution |
|---------|----------|
| No correlations showing | Check time - new alerts need 15 min |
| Low confidence scores | Adjust multipliers in calculateRisk() |
| Too many false positives | Increase timeWindow or minAlertThreshold |
| Not enough detections | Decrease timeWindow or minAlertThreshold |
| Patterns not appearing | Check alert headlines match detection logic |
| Database empty | Restart backend to regenerate demo data |

---

## Next Actions

- [ ] Read ALERTS_CORRELATIONS_PATTERNS_EXPLAINED.md
- [ ] Review CORRELATION_CONFIGURATION_GUIDE.md
- [ ] Try adding 1 custom pattern from CUSTOM_PATTERNS_QUICK_START.md
- [ ] Test with API calls or browser
- [ ] Monitor logs for correlation detection
- [ ] Adjust thresholds based on false positive rate
- [ ] Document your custom patterns

---

## Key Takeaways

1. **Alerts** = What happened (individual events)
2. **Correlations** = How they relate (grouped by actor/target/time)
3. **Patterns** = What attack type (the strategy being used)
4. **Confidence** = 0-100 score showing certainty
5. **Customizable** = 4 strategies, easily add more patterns
6. **Fast** = Runs every 15 minutes automatically
7. **Smart** = Learns from your alerts, adjusts scoring

---

## Support

**Quick Questions?** → Check QUICK_REFERENCE.md (this file)  
**Understanding System?** → Read ALERTS_CORRELATIONS_PATTERNS_EXPLAINED.md  
**Configuring Settings?** → See CORRELATION_CONFIGURATION_GUIDE.md  
**Adding Patterns?** → Follow CUSTOM_PATTERNS_QUICK_START.md  
**Debugging?** → Check backend logs: `tail -f /tmp/backend.log | grep correlation`

---

**Last Updated:** 2026-06-19  
**Build Status:** ✅ All Systems Operational  
**API Status:** ✅ All Endpoints Responding  
**UI Status:** ✅ All Tabs Functional

