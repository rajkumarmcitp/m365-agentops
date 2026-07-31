# Phase 3 Comprehensive Test Plan

## 🎯 Objective
Validate that Phase 3 cache-based validation system works correctly with all 50+ validators, achieving:
- ✅ ZERO per-control API calls
- ✅ 15-25 second validation time
- ✅ 95%+ cache hit rate
- ✅ All validators return results
- ✅ Proper error handling

## 📋 Pre-Test Checklist

Before running tests, verify:
- [ ] Backend server is running
- [ ] GraphClient is initialized
- [ ] Collection system is initialized
- [ ] Initial collection completed
- [ ] Cache is populated (check cache-status endpoint)

## 🧪 Test Suite

### TEST 1: Cache Status Check
**Purpose:** Verify cache system is ready and populated

```bash
curl -s -X GET http://localhost:3001/api/m365-agentops/v2/validation/cache-status | jq .
```

**Expected Response:**
```json
{
  "success": true,
  "cacheReady": true,
  "data": {
    "status": "ready",
    "totalValidations": 0,
    "averageValidationTime": 0,
    "cacheHitRate": 0,
    "fallbackRate": 0,
    "lastUpdated": "2026-07-29T..."
  }
}
```

**Success Criteria:**
- ✅ `success: true`
- ✅ `cacheReady: true`
- ✅ `status: "ready"`

---

### TEST 2: Phase 3a Validation (8 validators)
**Purpose:** Test identity + application validators

```bash
curl -s -X POST http://localhost:3001/api/m365-agentops/v2/validation/phase3a | jq .
```

**Expected Checks:**
- ✅ `success: true`
- ✅ `apiCalls: 0`
- ✅ `phase: "3a"`
- ✅ 8 validators in response
- ✅ All have `cached: true`
- ✅ `duration < 10000` (less than 10 seconds)

**Validator Count:**
- global-admins
- authorization-policy
- security-defaults
- conditional-access
- mfa-configuration
- app-registration-governance
- oauth-permission-grants
- credential-expiration

---

### TEST 3: Phase 3a with Benchmarking
**Purpose:** Verify performance metrics

```bash
curl -s -X POST "http://localhost:3001/api/m365-agentops/v2/validation/phase3a?benchmark=true" | jq .
```

**Expected Performance:**
- ✅ `durationSeconds: 5-10`
- ✅ `averagePerValidatorMs < 100`
- ✅ `validatorsPerSecond > 1.5`
- ✅ `apiCallsPerSecond: 0`
- ✅ `cacheHitsPerSecond > 1.5`

---

### TEST 4: Phase 3b Validation (20 validators)
**Purpose:** Test Teams + SharePoint validators

```bash
curl -s -X POST http://localhost:3001/api/m365-agentops/v2/validation/phase3b | jq .
```

**Expected Checks:**
- ✅ `success: true`
- ✅ `apiCalls: 0`
- ✅ `phase: "3b"`
- ✅ 20 validators in response
- ✅ All have `cached: true`
- ✅ `duration < 10000`

**Teams Validators (9):**
- teams-guest-access
- teams-meeting-recording
- teams-external-access
- teams-live-event-recording
- teams-app-governance
- teams-device-settings
- teams-channel-moderation
- teams-member-permissions
- teams-message-retention

**SharePoint Validators (11):**
- sharepoint-external-sharing
- sharepoint-site-access-control
- sharepoint-file-sharing-links
- sharepoint-dlp-policies
- sharepoint-document-retention
- sharepoint-search-configuration
- sharepoint-file-access-requests
- sharepoint-device-access-control
- sharepoint-unmanaged-device-access
- sharepoint-site-labels
- sharepoint-hub-sites

---

### TEST 5: Phase 3b with Benchmarking
**Purpose:** Verify Phase 3b performance

```bash
curl -s -X POST "http://localhost:3001/api/m365-agentops/v2/validation/phase3b?benchmark=true" | jq .
```

**Expected Performance:**
- ✅ `durationSeconds: 5-10`
- ✅ `averagePerValidatorMs < 100`
- ✅ `validatorsPerSecond > 2.0`

---

### TEST 6: Phase 3c Validation (16 validators)
**Purpose:** Test Defender + DLP validators

```bash
curl -s -X POST http://localhost:3001/api/m365-agentops/v2/validation/phase3c | jq .
```

**Expected Checks:**
- ✅ `success: true`
- ✅ `apiCalls: 0`
- ✅ `phase: "3c"`
- ✅ 16 validators in response
- ✅ All have `cached: true`
- ✅ `duration < 10000`

**Defender Validators (10):**
- defender-alert-configuration
- defender-incident-response
- defender-vulnerability-management
- defender-exposure-management
- defender-threat-protection-policy
- defender-email-security
- defender-safe-links
- defender-safe-attachments
- defender-attack-surface-reduction
- defender-detection-and-response

**DLP Validators (6):**
- dlp-policies-enabled
- dlp-policy-coverage
- sensitivity-labels-configured
- label-enforcement
- data-classification
- retention-policies-active

---

### TEST 7: Phase 3c with Benchmarking
**Purpose:** Verify Phase 3c performance

```bash
curl -s -X POST "http://localhost:3001/api/m365-agentops/v2/validation/phase3c?benchmark=true" | jq .
```

**Expected Performance:**
- ✅ `durationSeconds: 5-10`
- ✅ `averagePerValidatorMs < 100`
- ✅ `apiCallsPerSecond: 0`

---

### TEST 8: Combined Phase 3a+3b (28 validators)
**Purpose:** Test combined phase execution

```bash
curl -s -X POST "http://localhost:3001/api/m365-agentops/v2/validation/phase3a-combined?benchmark=true" | jq .
```

**Expected Checks:**
- ✅ `success: true`
- ✅ `apiCalls: 0`
- ✅ `phase: "3a+3b"`
- ✅ 28 total validators (8+20)
- ✅ `duration < 15000` (less than 15 seconds)
- ✅ Performance: `averagePerValidatorMs < 400`

**Validator Mix:**
- Phase 3a: 8 validators
- Phase 3b: 20 validators
- Total: 28

---

### TEST 9: Full Phase 3 (50+ validators)
**Purpose:** Complete system validation

```bash
curl -s -X POST "http://localhost:3001/api/m365-agentops/v2/validation/phase3-full?benchmark=true" | jq .
```

**Expected Checks:**
- ✅ `success: true`
- ✅ `apiCalls: 0`
- ✅ `phase: "3 (Full)"`
- ✅ 50+ total validators
- ✅ `duration < 25000` (less than 25 seconds)
- ✅ Performance: `averagePerValidatorMs < 400`

**Validator Breakdown:**
- Phase 3a: 8 validators (Identity + Applications)
- Phase 3b: 20 validators (Teams + SharePoint)
- Phase 3c: 16+ validators (Defender + DLP)
- Total: 50+ validators

**Expected Stats:**
- Total: 50+
- Pass: 30-40+ (most controls should pass)
- Fail: 5-10
- Warn: 5-10
- Error: 0
- Cached: 50+ (all from cache)
- API Calls Saved: 140+

---

### TEST 10: Error Handling - Missing GraphClient
**Purpose:** Verify error handling when GraphClient not available

```bash
# This would require stopping the server, so documentation only
# Expected response: 503 Service Unavailable
# Message: "Graph Client not initialized"
```

---

### TEST 11: Error Handling - Cache Not Ready
**Purpose:** Verify fallback behavior when cache unavailable

Expected behavior:
- ✅ Graceful error response with helpful message
- ✅ `cacheReady: false` in response
- ✅ HTTP 503 status code

---

### TEST 12: Performance Progression Test
**Purpose:** Verify performance improves as cache warms

Run the same endpoint 5 times and track:

```bash
for i in {1..5}; do
  echo "Run $i"
  curl -s -X POST "http://localhost:3001/api/m365-agentops/v2/validation/phase3-full?benchmark=true" | \
    jq '.benchmark.duration, .data.stats'
  echo ""
done
```

**Expected Progression:**
- Run 1: 20-25 seconds (cold cache)
- Run 2-5: 15-20 seconds (cache warming up)
- Cache hit rate should approach 100%

---

## 📊 Test Execution Script

Save as `test-phase3.sh`:

```bash
#!/bin/bash

echo "═══════════════════════════════════════════════════════════════"
echo "              PHASE 3 COMPREHENSIVE TEST SUITE"
echo "═══════════════════════════════════════════════════════════════"
echo ""

BASE_URL="http://localhost:3001/api/m365-agentops/v2/validation"

# Test 1: Cache Status
echo "TEST 1: Cache Status Check"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
curl -s -X GET "$BASE_URL/cache-status" | jq '.data'
echo ""

# Test 2: Phase 3a
echo "TEST 2: Phase 3a (8 validators)"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
curl -s -X POST "$BASE_URL/phase3a?benchmark=true" | jq '.data | {apiCalls, duration, stats: .stats, benchmark: .performanceMetrics}'
echo ""

# Test 3: Phase 3b
echo "TEST 3: Phase 3b (20 validators)"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
curl -s -X POST "$BASE_URL/phase3b?benchmark=true" | jq '.data | {apiCalls, duration, stats: .stats, benchmark: .performanceMetrics}'
echo ""

# Test 4: Phase 3c
echo "TEST 4: Phase 3c (16 validators)"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
curl -s -X POST "$BASE_URL/phase3c?benchmark=true" | jq '.data | {apiCalls, duration, stats: .stats, benchmark: .performanceMetrics}'
echo ""

# Test 5: Combined 3a+3b
echo "TEST 5: Phase 3a+3b Combined (28 validators)"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
curl -s -X POST "$BASE_URL/phase3a-combined?benchmark=true" | jq '.data | {apiCalls, duration, stats: .stats, benchmark: .performanceMetrics}'
echo ""

# Test 6: Full Phase 3
echo "TEST 6: Full Phase 3 (50+ validators)"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
curl -s -X POST "$BASE_URL/phase3-full?benchmark=true" | jq '.data | {apiCalls, duration, stats: .stats, benchmark: .performanceMetrics}'
echo ""

echo "═══════════════════════════════════════════════════════════════"
echo "                    TEST SUITE COMPLETE"
echo "═══════════════════════════════════════════════════════════════"
```

---

## ✅ Success Criteria Summary

| Test | Validators | API Calls | Time | Status |
|------|-----------|-----------|------|--------|
| Phase 3a | 8 | 0 | <10s | ✅ |
| Phase 3b | 20 | 0 | <10s | ✅ |
| Phase 3c | 16 | 0 | <10s | ✅ |
| 3a+3b | 28 | 0 | <15s | ✅ |
| Phase 3 Full | 50+ | 0 | <25s | ✅ |
| Cache Hit | All | 0 | N/A | ✅ |
| Throttling Risk | N/A | ZERO | N/A | ✅ |

---

## 🔍 Validation Checklist

After all tests pass:

- [ ] All endpoints return `success: true`
- [ ] All validators have `cached: true`
- [ ] All API call counts are 0
- [ ] Performance is within targets
- [ ] No errors returned
- [ ] Cache status shows ready
- [ ] Performance scales with validator count
- [ ] Combined endpoints work correctly
- [ ] Benchmark metrics accurate
- [ ] No throttling alerts

---

## 📝 Reporting Template

After testing, report:

1. **Test Results Summary**
   - How many tests passed
   - Any failures or issues
   - Performance actual vs. target

2. **Performance Metrics**
   - Average validation time per phase
   - Per-validator performance
   - Cache hit rates

3. **Validator Status**
   - How many validators returned results
   - Any validators with errors
   - Distribution of pass/fail/warn

4. **Blockers/Issues**
   - Any critical issues found
   - Any performance concerns
   - Any error scenarios

5. **Recommendation**
   - Ready for production?
   - Any fixes needed?
   - Performance acceptable?

