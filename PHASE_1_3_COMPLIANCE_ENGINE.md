# Phase 1.3: M365 AgentOps Compliance Engine

**Status:** Planning
**Phase:** Core Engine
**Timeline:** 2-3 weeks
**Impact:** Transforms raw validation data into executive-ready compliance intelligence

---

## Overview

Phase 1.3 builds the **Compliance Engine** — the heart of the CSPM platform.

**Input:** 1,010 control validation results (Pass/Fail/Error)
**Output:** 
- Weighted compliance scores (0-100)
- Per-framework reports (CIS, NIST, ISO, CMMC, SOC2, Secure Score, Zero Trust)
- Drift detection & trend analysis
- Risk-based alerting

**Architecture:**

```
┌─────────────────────────────────┐
│   M365 Control Validation        │  ← Phase 1.2 (Complete)
│   (1,010 controls)              │
└────────────┬────────────────────┘
             ↓
┌─────────────────────────────────┐
│  Compliance Engine (Phase 1.3)   │  ← YOU ARE HERE
│                                 │
│  ├─ Weighted Scoring            │
│  ├─ Framework Mapping           │
│  ├─ Drift Detection             │
│  ├─ Snapshot Management         │
│  └─ Historical Trends           │
└────────────┬────────────────────┘
             ↓
┌─────────────────────────────────┐
│   v2.0 API Endpoints (Phase 1.4) │  ← Next
│   (Framework-agnostic reporting) │
└────────────┬────────────────────┘
             ↓
┌─────────────────────────────────┐
│   Executive Dashboards (Phase 2) │
│   (Risk-based visualization)    │
└─────────────────────────────────┘
```

---

## Phase 1.3 Deliverables

### 1. Compliance Calculation Engine

**File:** `backend/lib/m365-compliance-engine.js` (~500 lines)

**Class:** `M365ComplianceEngine`

**Core Methods:**

```javascript
// Calculate weighted compliance score
calculateWeightedScore(controlResults)
  → Takes: array of control results
  → Returns: { score, earnedPoints, totalPoints, breakdown }

// Calculate framework-specific score
calculateFrameworkScore(framework, controlResults)
  → Takes: framework name (CIS, NIST, etc.) + results
  → Returns: { framework, score, controlCount, passCount }

// Calculate domain-level compliance
calculateDomainCompliance(domain, controlResults)
  → Takes: domain (TG-ID, TG-EXO, etc.) + results
  → Returns: { domain, score, controlCount, passed, failed }

// Detect compliance drift
detectComplianceDrift(currentSnapshot, previousSnapshot)
  → Takes: current & previous compliance snapshots
  → Returns: { driftEvents, severity, trend }

// Generate executive summary
generateComplianceSummary(tenantId, daysBack = 90)
  → Takes: tenant ID + days for trend
  → Returns: { score, trend, riskAreas, topIssues }
```

---

### 2. Weighted Scoring Logic

**Algorithm:**

```
WEIGHTED_SCORE = (EARNED_POINTS / TOTAL_POINTS) × 100

Where:
  EARNED_POINTS = SUM(risk_weight) for all controls where status = 'Pass'
  TOTAL_POINTS = SUM(risk_weight) for all controls

Risk Weight Scale:
  Critical  = 10 points
  High      = 7 points
  Medium    = 4 points
  Low       = 2 points
  Info      = 1 point
```

**Example:**

```
Catalog:
  • 202 Critical controls × 10 = 2,020 points
  • 303 High controls × 7 = 2,121 points
  • 303 Medium controls × 4 = 1,212 points
  • 151 Low controls × 2 = 302 points
  • 51 Info controls × 1 = 51 points
  ─────────────────────────────
  Total: 10,250 points maximum

Validation Results:
  • 172 Critical PASS × 10 = 1,720 points
  • 280 High PASS × 7 = 1,960 points
  • 275 Medium PASS × 4 = 1,100 points
  • 145 Low PASS × 2 = 290 points
  • 48 Info PASS × 1 = 48 points
  ─────────────────────────────
  Earned: 8,118 points

COMPLIANCE_SCORE = (8,118 / 10,250) × 100 = 79.2%
```

---

### 3. Framework Scoring

**Algorithm:**

```
FRAMEWORK_SCORE = (MAPPED_EARNED / MAPPED_TOTAL) × 100

Where:
  MAPPED_TOTAL = SUM(risk_weight) for controls mapped to that framework
  MAPPED_EARNED = SUM(risk_weight) for controls mapped to framework AND status = 'Pass'
```

**Example Query:**

```sql
-- CIS Compliance Score
SELECT 
  mcm.framework,
  COUNT(DISTINCT mcr.control_id) as total_controls,
  COUNT(DISTINCT CASE WHEN mcr.status = 'Pass' THEN mcr.control_id END) as passed,
  SUM(mcc.risk_weight) as total_points,
  SUM(CASE WHEN mcr.status = 'Pass' THEN mcc.risk_weight ELSE 0 END) as earned_points,
  ROUND((SUM(CASE WHEN mcr.status = 'Pass' THEN mcc.risk_weight ELSE 0 END) * 100.0 / 
          SUM(mcc.risk_weight))::numeric, 2) as compliance_score
FROM m365_control_mappings mcm
JOIN m365_control_results mcr ON mcm.control_id = mcr.control_id
JOIN m365_control_catalog mcc ON mcr.control_id = mcc.id
WHERE mcm.framework = 'CIS' AND mcr.tenant_id = $1
GROUP BY mcm.framework;
```

---

### 4. Drift Detection

**Drift Types:**

| Type | Previous | Current | Meaning | Action |
|------|----------|---------|---------|--------|
| **Regression** | Pass | Fail | Control failed! | ⚠️ Alert |
| **Remediation** | Fail | Pass | Fixed! | 🎉 Celebrate |
| **Resolution** | Error | Pass | Validation works now | ✅ Confidence gained |
| **Degradation** | Fail | Error | Validation broke | ⚠️ Investigate |
| **Stability** | Same | Same | No change | — |

**Implementation:**

```javascript
async detectDrift(tenantId) {
  // Get latest and previous snapshots
  const latest = await getLatestSnapshot(tenantId)
  const previous = await getPreviousSnapshot(tenantId)
  
  // Calculate score change
  const scoreDelta = latest.complianceScore - previous.complianceScore
  
  // Identify regressions (critical priority)
  const regressions = await db.query(`
    SELECT control_id, previous_status, new_status
    FROM m365_compliance_drift
    WHERE tenant_id = $1 
      AND previous_status = 'Pass' 
      AND new_status = 'Fail'
      AND changed_at > NOW() - INTERVAL '1 day'
  `)
  
  // Identify remediations (celebratory)
  const remediations = await db.query(`
    SELECT control_id, control_name
    FROM m365_compliance_drift
    WHERE tenant_id = $1 
      AND previous_status = 'Fail' 
      AND new_status = 'Pass'
      AND changed_at > NOW() - INTERVAL '1 day'
  `)
  
  return {
    scoreDelta,
    regressions: regressions.rows,
    remediations: remediations.rows,
    severity: scoreDelta < -5 ? 'Critical' : scoreDelta < -2 ? 'High' : 'Medium'
  }
}
```

---

### 5. Trend Analysis

**Historical Data Points:**

```sql
-- Query compliance over 90 days
SELECT 
  snapshot_date,
  compliance_score,
  total_controls,
  passed_controls,
  failed_controls
FROM m365_compliance_snapshots
WHERE tenant_id = $1 AND snapshot_date >= NOW() - INTERVAL '90 days'
ORDER BY snapshot_date;
```

**Trend Calculation:**

```javascript
calculateTrend(snapshots) {
  // Linear regression over last 30 days
  const recent = snapshots.filter(s => s.date > now - 30 days)
  const slope = linearRegression(recent.map(s => s.score))
  
  return {
    direction: slope > 0.5 ? '📈 Improving' : slope < -0.5 ? '📉 Declining' : '➡️ Stable',
    velocity: Math.abs(slope),
    projection: projectedScore(slope, 30) // Where we'll be in 30 days
  }
}
```

---

### 6. Snapshot Management

**Snapshot Structure:**

```javascript
{
  id: uuid,
  tenant_id: 'contoso.onmicrosoft.com',
  snapshot_date: '2026-07-28T14:30:00Z',
  
  // Counts
  total_controls: 1025,
  passed_controls: 847,
  failed_controls: 156,
  partial_controls: 18,
  unknown_controls: 4,
  error_controls: 0,
  
  // Weighted Score
  total_risk_points: 10250,
  earned_risk_points: 8118,
  compliance_score: 79.2,
  
  // Per-domain breakdown
  domain_scores: {
    'TG-ID': 88.6,
    'TG-AUTH': 80.0,
    'TG-CA': 80.0,
    'TG-APP': 85.0,
    'TG-EXO': 80.0,
    // ... 15 more domains
  },
  
  // Per-framework breakdown
  framework_scores: {
    'CIS': 82.5,
    'NIST': 81.2,
    'ISO': 79.8,
    'CMMC': 80.5,
    'SOC2': 83.1,
    'Secure Score': 86.4,
    'Zero Trust': 85.9
  },
  
  // Risk assessment
  critical_failures: 30,
  high_failures: 76,
  medium_failures: 50,
  
  // Trend info
  previous_score: 78.9,
  score_delta: +0.3,
  trend: 'Stable'
}
```

---

### 7. API Integration

**Integration with Backend** (`backend/server.js`):

```javascript
import { M365ComplianceEngine } from './lib/m365-compliance-engine.js'

const complianceEngine = new M365ComplianceEngine(pool, validationEngine)

// Endpoint: Get current compliance score
app.get('/api/m365-agentops/v2/compliance/score', async (req, res) => {
  const tenantId = req.query.tenantId
  const score = await complianceEngine.calculateWeightedScore(tenantId)
  res.json(score)
})

// Endpoint: Get framework scores
app.get('/api/m365-agentops/v2/compliance/frameworks', async (req, res) => {
  const tenantId = req.query.tenantId
  const frameworks = ['CIS', 'NIST', 'ISO', 'CMMC', 'SOC2', 'Secure Score', 'Zero Trust']
  const scores = {}
  
  for (const framework of frameworks) {
    scores[framework] = await complianceEngine.calculateFrameworkScore(framework, tenantId)
  }
  
  res.json(scores)
})

// Endpoint: Get domain scores
app.get('/api/m365-agentops/v2/compliance/domains', async (req, res) => {
  const tenantId = req.query.tenantId
  const domains = await complianceEngine.calculateAllDomainCompliance(tenantId)
  res.json(domains)
})

// Endpoint: Get compliance trend
app.get('/api/m365-agentops/v2/compliance/trend', async (req, res) => {
  const tenantId = req.query.tenantId
  const daysBack = parseInt(req.query.daysBack || 90)
  const trend = await complianceEngine.calculateTrend(tenantId, daysBack)
  res.json(trend)
})

// Endpoint: Get drift alerts
app.get('/api/m365-agentops/v2/compliance/drift', async (req, res) => {
  const tenantId = req.query.tenantId
  const daysBack = parseInt(req.query.daysBack || 7)
  const drift = await complianceEngine.detectDrift(tenantId, daysBack)
  res.json(drift)
})

// Endpoint: Get compliance snapshot
app.get('/api/m365-agentops/v2/compliance/snapshot', async (req, res) => {
  const tenantId = req.query.tenantId
  const snapshot = await complianceEngine.getLatestSnapshot(tenantId)
  res.json(snapshot)
})

// Endpoint: Get executive summary
app.get('/api/m365-agentops/v2/compliance/summary', async (req, res) => {
  const tenantId = req.query.tenantId
  const summary = await complianceEngine.generateExecutiveSummary(tenantId)
  res.json(summary)
})
```

---

### 8. Database Helper Methods

**New Queries** (add to existing migration or Phase 1.3 migration):

```sql
-- Create compliance calculation view
CREATE VIEW v_compliance_summary AS
SELECT 
  mcr.tenant_id,
  MAX(mcr.validated_at) as latest_validation,
  COUNT(*) as total_controls,
  COUNT(CASE WHEN mcr.status = 'Pass' THEN 1 END) as passed,
  COUNT(CASE WHEN mcr.status = 'Fail' THEN 1 END) as failed,
  COUNT(CASE WHEN mcr.status = 'Partial' THEN 1 END) as partial,
  ROUND(
    (SUM(CASE WHEN mcr.status = 'Pass' THEN mcc.risk_weight ELSE 0 END) * 100.0 / 
     SUM(mcc.risk_weight))::numeric, 
    2
  ) as compliance_score
FROM m365_control_results mcr
JOIN m365_control_catalog mcc ON mcr.control_id = mcc.id
GROUP BY mcr.tenant_id;

-- Create framework summary view
CREATE VIEW v_framework_compliance AS
SELECT 
  mcm.framework,
  mcr.tenant_id,
  COUNT(DISTINCT mcr.control_id) as total_controls,
  COUNT(DISTINCT CASE WHEN mcr.status = 'Pass' THEN mcr.control_id END) as passed,
  ROUND(
    (SUM(CASE WHEN mcr.status = 'Pass' THEN mcc.risk_weight ELSE 0 END) * 100.0 / 
     SUM(mcc.risk_weight))::numeric, 
    2
  ) as compliance_score
FROM m365_control_mappings mcm
JOIN m365_control_results mcr ON mcm.control_id = mcr.control_id
JOIN m365_control_catalog mcc ON mcr.control_id = mcc.id
GROUP BY mcm.framework, mcr.tenant_id;

-- Index for performance
CREATE INDEX idx_control_results_tenant_status 
  ON m365_control_results(tenant_id, status);
CREATE INDEX idx_compliance_snapshots_tenant_date 
  ON m365_compliance_snapshots(tenant_id, snapshot_date DESC);
CREATE INDEX idx_compliance_drift_tenant_date 
  ON m365_compliance_drift(tenant_id, changed_at DESC);
```

---

## Implementation Steps

### Step 1: Create Compliance Engine Class
- File: `backend/lib/m365-compliance-engine.js`
- Implement scoring algorithms
- Implement framework mapping logic
- Implement drift detection
- ~500 lines

### Step 2: Add Database Views & Indexes
- Create v_compliance_summary view
- Create v_framework_compliance view
- Add performance indexes
- Test query performance

### Step 3: Integration Tests
- Test weighted scoring calculation
- Test framework-specific scoring
- Test drift detection
- Test historical trend analysis
- Verify all 7 frameworks calculate correctly

### Step 4: API Endpoint Integration
- Add endpoints to `backend/server.js`
- Wire up compliance engine
- Test with curl/Postman
- Verify response formats

### Step 5: Frontend Consumption
- Create `frontend/lib/compliance-api-client.js`
- Expose compliance methods to UI
- Test dashboard integration
- Ready for Phase 2 (Executive Dashboards)

---

## Success Metrics

✅ **Phase 1.3 Complete When:**
- [ ] M365ComplianceEngine class implemented
- [ ] Weighted scoring calculates correctly
- [ ] 7 framework scores all calculate properly
- [ ] Drift detection identifies regressions
- [ ] Trend analysis shows direction & velocity
- [ ] Database views perform < 100ms
- [ ] All 6 API endpoints working
- [ ] Integration tests passing
- [ ] Documentation complete

---

## Performance Expectations

| Operation | Expected | Target |
|-----------|----------|--------|
| Calculate overall score | ~50ms | <100ms |
| Calculate framework score | ~20ms | <50ms |
| Detect drift (7-day scan) | ~100ms | <200ms |
| Generate snapshot | ~150ms | <300ms |
| Trend analysis (90 days) | ~80ms | <150ms |
| Executive summary | ~200ms | <500ms |

---

## Notes

- All scores are weighted (not simple percentages)
- A control failing = impact based on severity (Critical = big impact)
- Frameworks can be added by adding mapping rows (no code changes)
- Evidence trail is preserved for audits
- Historical data supports trending & forecasting

---

**Next Phase:** Phase 1.4 - v2.0 API Endpoints (framework-agnostic reporting)

After Phase 1.4, proceed to Phase 2 (Executive Dashboards) for visualization.
