# Phase 7: Testing & Validation Guide
## End-to-End Testing Procedures

**Version:** 1.0  
**Date:** 2026-07-26  
**Scope:** Autonomous Risk Assessment & Auto-Remediation (Phase 7a-7d)

---

## Table of Contents

1. [Test Overview](#test-overview)
2. [Environment Setup](#environment-setup)
3. [Test Scenarios](#test-scenarios)
4. [Performance Testing](#performance-testing)
5. [Validation Checklist](#validation-checklist)
6. [Test Report Template](#test-report-template)

---

## Test Overview

### Objectives

- ✅ Verify drift detection works correctly
- ✅ Validate recommendation generation
- ✅ Test approval workflow (with/without auto-fix)
- ✅ Verify auto-fix execution & Graph API calls
- ✅ Confirm event logging & audit trail
- ✅ Validate monitoring dashboard
- ✅ Test error handling & rollback
- ✅ Performance under load

### Test Environment

**Required:**
- Access to Azure AD tenant (test tenant recommended)
- M365 OpsAgent deployed and running
- Backend server (localhost:3000)
- Frontend server (localhost:5173)
- Graph API credentials configured

**Recommended:**
- Dedicated test Azure AD tenant
- Non-production Conditional Access policies
- Test user account for approvals
- Service principal for Graph API calls

### Test Timeline

- **Phase 1:** Basic functionality (1-2 hours)
- **Phase 2:** Approval workflows (1 hour)
- **Phase 3:** Auto-fix execution (1-2 hours)
- **Phase 4:** Monitoring & rollback (1 hour)
- **Phase 5:** Performance & scale (2-3 hours)

**Total:** ~8-10 hours

---

## Environment Setup

### Pre-Test Checklist

```bash
# 1. Verify backend is running
curl -s http://localhost:3000/health | jq .
# Expected: { "status": "ok", "timestamp": "..." }

# 2. Verify frontend is accessible
curl -s http://localhost:5173 | grep -o "<title>.*</title>"
# Expected: <title>M365 OpsAgent</title>

# 3. Verify database exists
ls -la backend/tenantguard.db
# Expected: -rw-r--r-- ... tenantguard.db

# 4. Verify Graph API connectivity
curl -s https://graph.microsoft.com/v1.0/me \
  -H "Authorization: Bearer YOUR_TOKEN" | jq '.userPrincipalName'
# Expected: your@tenant.onmicrosoft.com

# 5. Verify auto-fix agent initialized
grep "Auto-Fix Agent initialized" backend.log
# Expected: ✅ Auto-Fix Agent initialized
```

### Test Data Preparation

**Create Test Control (Optional - for testing):**

If you want to test without real drifts, create a test drift:

```bash
# Manually disable a Conditional Access policy in Azure AD
# This will trigger drift detection on next validation run

# Or create test data via database:
sqlite3 backend/tenantguard.db << EOF
INSERT INTO compliance_drifts VALUES (
  'drift_test_' || strftime('%s', 'now'),
  'Con-025',
  'POLICY_CHANGE',
  'Legacy auth blocked',
  'Legacy auth allowed',
  datetime('now'),
  NULL,
  'test-user@contoso.com',
  'HIGH'
);
EOF
```

---

## Test Scenarios

### Scenario 1: Drift Detection & Recommendation

**Objective:** Verify drifts are detected and recommendations generated

**Preconditions:**
- Auto-fix disabled (`enabled: false`)
- Approval required (`requiresApproval: true`)

**Steps:**

1. **Manually Trigger Drift**
   ```
   In Azure AD: Conditional Access → Policies
   Select any enabled policy → Modify settings → Save
   This creates a drift vs. expected CIS baseline
   ```

2. **Run Compliance Validation**
   ```bash
   curl -X POST http://localhost:3000/api/tenantguard/compliance/validate \
     -H 'Content-Type: application/json' \
     -d '{"controls": ["Con-025"]}'
   ```

3. **Verify Drift Detected**
   ```bash
   curl http://localhost:3000/api/tenantguard/compliance/drifts | jq '.data | length'
   # Should return > 0
   ```

4. **Check Recommendation Generated**
   ```bash
   curl http://localhost:3000/api/tenantguard/compliance/drifts | \
     jq '.data[0].recommendation'
   # Should show recommendation details
   ```

5. **View in UI**
   - Open browser: http://localhost:5173
   - Navigate to: Zero Trust → Drifts tab
   - Verify drift appears in table
   - Check recommendation details in modal

**Expected Results:**
- ✅ Drift appears in database
- ✅ Recommendation generated
- ✅ UI displays drift with ✓ status
- ✅ Modal shows recommendation details

**Pass Criteria:**
- Drift detection: PASS
- Recommendation generation: PASS
- UI display: PASS

---

### Scenario 2: Approval Workflow (Manual Only)

**Objective:** Test approval without auto-fix execution

**Preconditions:**
- Auto-fix disabled (`enabled: false`)
- Recommendation exists and pending approval

**Steps:**

1. **Open Drift Modal**
   ```
   In UI: Zero Trust → Drifts → [Click drift] → View Details
   ```

2. **Verify Button Label**
   ```
   Expected button: "✓ Approve" (NOT "⚡ Approve + Auto-Fix")
   ```

3. **Click Approve Button**
   ```
   Click "✓ Approve"
   → Enter optional note in prompt
   → Confirm
   ```

4. **Verify Approval Response**
   ```
   Toast message: "Recommendation approved"
   Modal closes
   ```

5. **Check Approval in Database**
   ```bash
   curl http://localhost:3000/api/tenantguard/compliance/recommendations | \
     jq '.data[] | select(.approval_status == "approved") | .id'
   ```

6. **Verify NO Auto-Fix Triggered**
   ```bash
   curl http://localhost:3000/api/tenantguard/auto-fix/history | jq '.data | length'
   # Should be 0 or unchanged from before approval
   ```

**Expected Results:**
- ✅ Button shows "✓ Approve"
- ✅ Approval recorded in database
- ✅ Toast shows "Recommendation approved"
- ✅ No auto-fix execution logged

**Pass Criteria:**
- Approval recorded: PASS
- No unintended auto-fix: PASS
- UI responds correctly: PASS

---

### Scenario 3: Approval + Auto-Fix Execution

**Objective:** Test complete approval-to-auto-fix workflow

**Preconditions:**
- Auto-fix enabled (`enabled: true`)
- Approval required (`requiresApproval: true`)
- Pending recommendation exists
- Graph API permissions granted (Policy.ReadWrite.*)

**Steps:**

1. **Enable Auto-Remediation**
   ```bash
   curl -X POST http://localhost:3000/api/tenantguard/settings/remediation \
     -H 'Content-Type: application/json' \
     -d '{"enabled": true, "requiresApproval": true}'
   ```

2. **Verify Settings Updated**
   ```bash
   curl http://localhost:3000/api/tenantguard/settings/remediation | \
     jq '.data | {enabled, requiresApproval}'
   # Expected: { "enabled": true, "requiresApproval": true }
   ```

3. **Open Drift Modal**
   ```
   In UI: Zero Trust → Drifts → [Click drift]
   ```

4. **Verify Button Label Changed**
   ```
   Expected button: "⚡ Approve + Auto-Fix" (not "✓ Approve")
   ```

5. **Verify Badge Shows Auto-Fix Status**
   ```
   Look for: "⚡ Fix will be applied automatically after approval"
   ```

6. **Click Approve Button**
   ```
   Button text: "⚡ Approve + Auto-Fix"
   ```

7. **Verify Toast Message**
   ```
   Expected: "⚡ Auto-fix will be applied shortly"
   (NOT "Recommendation approved")
   ```

8. **Check Auto-Fix History**
   ```bash
   sleep 2  # Wait for async execution
   curl http://localhost:3000/api/tenantguard/auto-fix/history | \
     jq '.data[0] | {controlId, executed, timestamp}'
   ```

9. **Verify Policy Created in Azure AD**
   ```
   In Azure Portal: Azure AD → Conditional Access → Policies
   Look for: "[M365 OpsAgent] Block Legacy Authentication"
   Status should be: Enabled
   ```

10. **Check Monitoring Dashboard**
    ```
    In UI: TenantGuard → Settings → Auto-Fix Activity Monitoring
    Verify:
    - Total Executed: incremented
    - Success Rate: shows % (e.g., "100%")
    - Failures: remains 0
    - Last Execution: shows "Just now"
    - Recent Executions: new row with ✅ Success
    ```

**Expected Results:**
- ✅ Button shows "⚡ Approve + Auto-Fix"
- ✅ Badge displays auto-fix warning
- ✅ Toast shows auto-fix message
- ✅ Auto-fix execution logged to event bus
- ✅ Policy created in Azure AD
- ✅ Dashboard updated with new execution

**Pass Criteria:**
- UI changes correctly based on settings: PASS
- Auto-fix triggered on approval: PASS
- Graph API call successful: PASS
- Event logging working: PASS
- Dashboard updates: PASS

---

### Scenario 4: Auto-Fix Failure Handling

**Objective:** Verify graceful handling when auto-fix fails

**Preconditions:**
- Auto-fix enabled (`enabled: true`)
- Graph API permissions exist BUT policy already exists (conflict)

**Steps:**

1. **Create Duplicate Policy (to trigger failure)**
   ```
   In Azure AD: Manually create a Conditional Access policy with name:
   "[M365 OpsAgent] Block Legacy Authentication"
   ```

2. **Trigger Drift (same control)**
   ```bash
   # Modify existing policy or delete to re-detect
   ```

3. **Generate Recommendation**
   ```bash
   curl -X POST http://localhost:3000/api/tenantguard/compliance/validate
   ```

4. **Approve with Auto-Fix**
   ```
   Click "⚡ Approve + Auto-Fix"
   ```

5. **Check Result**
   ```bash
   curl http://localhost:3000/api/tenantguard/auto-fix/history | \
     jq '.data[0] | {executed, error}'
   # Expected: "executed": false, error message present
   ```

6. **Verify UI Shows Failure**
   ```
   In dashboard: Recent Executions table
   Look for row with: ❌ Failed badge
   ```

**Expected Results:**
- ✅ Auto-fix attempted despite duplicate
- ✅ Failure caught and logged
- ✅ Error message captured
- ✅ Dashboard shows failure status
- ✅ Approval still recorded (not blocked)

**Pass Criteria:**
- Graceful error handling: PASS
- Failure logged correctly: PASS
- No cascading failures: PASS

---

### Scenario 5: Immediate Auto-Fix (No Approval)

**Objective:** Test auto-fix without approval requirement

**Preconditions:**
- Auto-fix enabled (`enabled: true`)
- Approval NOT required (`requiresApproval: false`)

**Steps:**

1. **Change Settings**
   ```bash
   curl -X POST http://localhost:3000/api/tenantguard/settings/remediation \
     -H 'Content-Type: application/json' \
     -d '{"enabled": true, "requiresApproval": false}'
   ```

2. **Verify Settings Updated**
   ```bash
   curl http://localhost:3000/api/tenantguard/settings/remediation | \
     jq '.data.requiresApproval'
   # Expected: false
   ```

3. **Create Test Drift**
   ```
   Modify Azure AD policy to trigger new drift
   ```

4. **Open Modal**
   ```
   Zero Trust → Drifts → [Click drift]
   ```

5. **Verify Different UI**
   ```
   Button should show: "✓ Approve" (not auto-fix version)
   No "⚡ Fix will be applied" badge
   ```

6. **Click Approve**
   ```
   Immediately triggers auto-fix without confirmation
   ```

7. **Check Immediate Execution**
   ```bash
   # Auto-fix should execute immediately
   sleep 1
   curl http://localhost:3000/api/tenantguard/auto-fix/history | \
     jq '.data[0].executed'
   # Expected: true (immediately, no waiting)
   ```

**Expected Results:**
- ✅ Settings updated correctly
- ✅ UI adapts to settings
- ✅ Auto-fix executes immediately on approval
- ✅ No confirmation dialog needed

**Pass Criteria:**
- Settings respected by UI: PASS
- Immediate execution on approval: PASS

---

### Scenario 6: Monitoring Dashboard

**Objective:** Verify dashboard displays accurate metrics

**Preconditions:**
- Multiple auto-fix executions (successful and failed)
- Dashboard loaded

**Steps:**

1. **Navigate to Dashboard**
   ```
   TenantGuard → Settings → Auto-Fix Activity Monitoring
   ```

2. **Verify Stats Cards Render**
   ```
   Should show 4 cards:
   - Total Executed: [count]
   - Success Rate: [%]
   - Failures: [count]
   - Last Execution: [time]
   ```

3. **Verify Calculations**
   ```
   Total Executed = sum of all executions
   Success Rate = (successful / total) × 100%
   Failures = count where executed=false
   Last Execution = time of most recent event
   ```

4. **Verify Table Displays**
   ```
   Should show up to 50 recent executions with:
   - Control ID column
   - Status badge (✅ or ❌)
   - Triggered By email
   - Timestamp
   - Policy ID link
   ```

5. **Test Manual Refresh**
   ```
   Click "🔄 Refresh" button
   Dashboard should update within 1 second
   ```

6. **Test Auto-Refresh**
   ```
   Wait 10 seconds
   Dashboard should auto-update
   (Open network tab to verify API calls)
   ```

7. **Verify No Errors**
   ```
   Open browser console (F12)
   Should show no red error messages
   Network tab should show 200 OK responses
   ```

**Expected Results:**
- ✅ All 4 stat cards display
- ✅ Calculations are accurate
- ✅ Table shows recent executions
- ✅ Manual refresh works
- ✅ Auto-refresh works every 10 seconds
- ✅ No console errors

**Pass Criteria:**
- Dashboard renders: PASS
- Metrics accurate: PASS
- Refresh mechanisms working: PASS
- No errors: PASS

---

## Performance Testing

### Load Test: Multiple Concurrent Auto-Fixes

**Objective:** Verify system handles multiple auto-fixes concurrently

**Preconditions:**
- Backend running
- Auto-fix enabled
- Multiple drifts available (4+ controls)

**Test Script:**

```bash
#!/bin/bash
# concurrent_fix_test.sh

BACKEND="http://localhost:3000"
NUM_FIXES=5
INTERVAL=1

echo "Starting concurrent auto-fix load test..."

for i in $(seq 1 $NUM_FIXES); do
  # Get a pending recommendation
  REC_ID=$(curl -s "$BACKEND/api/tenantguard/compliance/recommendations" | \
    jq -r ".data[0].id")
  
  if [ -z "$REC_ID" ] || [ "$REC_ID" = "null" ]; then
    echo "No pending recommendations. Skipping iteration $i"
    continue
  fi
  
  echo "[$i] Approving recommendation: $REC_ID"
  
  # Approve (will trigger auto-fix if enabled)
  curl -s -X POST "$BACKEND/api/tenantguard/compliance/recommendations/$REC_ID/approve" \
    -H 'Content-Type: application/json' \
    -d '{"notes": "Concurrent test"}' | jq '.data.autoFixTriggered'
  
  sleep $INTERVAL
done

# Check results
echo ""
echo "Test Complete. Results:"
curl -s "$BACKEND/api/tenantguard/auto-fix/history" | jq '{
  total_executed: (.data | length),
  success_count: (.data | map(select(.executed==true)) | length),
  failure_count: (.data | map(select(.executed==false)) | length)
}'
```

**Run Test:**

```bash
bash concurrent_fix_test.sh
```

**Metrics to Capture:**

- Total time to complete N fixes
- Success rate (% of fixes that executed)
- Error count
- Average response time per approval
- Peak memory usage (via `top` or `ps`)

**Expected Results:**
- All approvals succeed
- No duplicates created
- Success rate > 95%
- Response time < 3 seconds per approval

---

### Stress Test: Long-Running Monitoring

**Objective:** Verify dashboard doesn't degrade over time

**Test:**

1. Let system run for 1+ hour
2. Keep dashboard open with auto-refresh
3. Monitor for:
   - Increasing response times
   - Memory leaks
   - JavaScript errors in console
   - Dropped events

**Expected Results:**
- Response times stable
- Memory stable (no continuous growth)
- No console errors
- All events captured

---

## Validation Checklist

### Functional Validation

- [ ] Drift detection works
- [ ] Recommendations generated correctly
- [ ] Approval workflow completes
- [ ] Auto-fix executes (when enabled)
- [ ] Event logging works
- [ ] Dashboard displays metrics
- [ ] Manual refresh works
- [ ] Auto-refresh works (10s interval)
- [ ] Settings persist across sessions
- [ ] Graph API calls succeed

### Security Validation

- [ ] Approval required by default
- [ ] Audit trail complete
- [ ] Only admins can approve
- [ ] Settings changes logged
- [ ] No credentials exposed in logs
- [ ] Database protected
- [ ] Event bus doesn't log sensitive data

### Performance Validation

- [ ] Dashboard loads < 2 seconds
- [ ] Refresh completes < 1 second
- [ ] API responds < 1 second
- [ ] No memory leaks after 1+ hours
- [ ] Supports 50+ events in history
- [ ] Concurrent fixes don't conflict

### Error Handling

- [ ] Graceful handling when auto-fix fails
- [ ] Failure doesn't block approval
- [ ] Errors logged but not breaking
- [ ] Network errors handled
- [ ] Database errors handled
- [ ] Missing data handled gracefully

### UI/UX Validation

- [ ] Settings section displays clearly
- [ ] Buttons labeled correctly
- [ ] Badges color-coded (green/red)
- [ ] Timestamps human-readable
- [ ] No broken links
- [ ] Responsive on mobile/tablet
- [ ] Dark mode works (if applicable)

---

## Test Report Template

```markdown
# Phase 7 Test Report

**Date:** YYYY-MM-DD  
**Tester:** [Name]  
**Environment:** [Dev/Staging/Prod]  

## Executive Summary

[1-2 sentence overview of results]

## Test Coverage

| Scenario | Status | Notes |
|----------|--------|-------|
| Drift Detection | ✅ PASS | [Details] |
| Manual Approval | ✅ PASS | [Details] |
| Auto-Fix Execution | ✅ PASS | [Details] |
| Failure Handling | ✅ PASS | [Details] |
| Dashboard | ✅ PASS | [Details] |

## Performance Metrics

- Dashboard load time: XXms
- Auto-fix execution: XXms
- API response time: XXms
- Memory usage: XXMb
- Success rate: XX%

## Issues Found

### Critical

[List any critical issues]

### High

[List high-priority issues]

### Medium

[List medium-priority issues]

### Low

[List low-priority issues or suggestions]

## Recommendations

1. [Recommendation 1]
2. [Recommendation 2]
3. [Recommendation 3]

## Sign-Off

- QA Verified: ✅ / ❌
- Ready for Production: ✅ / ❌
- Issues Blocking Release: [Yes/No]

---

**Approved By:** [Name]  
**Date:** YYYY-MM-DD
```

---

## Summary

This guide provides comprehensive testing procedures for Phase 7. Key focus areas:

1. **Drift Detection** — Basic functionality
2. **Approval Workflow** — With/without auto-fix
3. **Auto-Fix Execution** — Graph API integration
4. **Monitoring** — Dashboard accuracy
5. **Error Handling** — Graceful degradation
6. **Performance** — Load and stress testing

**Estimated Time:** 8-10 hours complete testing

**Success Criteria:**
- All scenarios pass
- No critical issues
- Performance acceptable
- Production-ready

---

**For questions or issues, refer to PHASE_7_DEPLOYMENT.md for troubleshooting guide.**
