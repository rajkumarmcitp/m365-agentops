# Phase 1.3 Endpoint Integration Guide

**Purpose:** Wire M365ComplianceEngine into backend/server.js
**File:** `backend/server.js`
**Lines:** Add these endpoints to your existing Express app

---

## 1. Import the Compliance Engine

Add to the top of `backend/server.js` (with other imports):

```javascript
import { M365ComplianceEngine } from './lib/m365-compliance-engine.js'

// Initialize engine (after pool is ready)
let complianceEngine
```

---

## 2. Initialize Engine

Add after your database pool is initialized:

```javascript
// Initialize compliance engine
if (pool) {
  complianceEngine = new M365ComplianceEngine(pool, validationEngine)
  console.log('✅ Compliance Engine initialized')
}
```

---

## 3. Add Endpoints

Add all these endpoints to your Express app:

### Endpoint 1: Get Overall Compliance Score

```javascript
/**
 * GET /api/m365-agentops/v2/compliance/score
 * Returns overall weighted compliance score
 */
app.get('/api/m365-agentops/v2/compliance/score', async (req, res) => {
  try {
    const tenantId = req.query.tenantId
    if (!tenantId) {
      return res.status(400).json({ error: 'tenantId required' })
    }

    const score = await complianceEngine.calculateWeightedScore(tenantId)
    res.json({
      success: true,
      data: score
    })
  } catch (error) {
    console.error('Error getting compliance score:', error.message)
    res.status(500).json({
      success: false,
      error: error.message
    })
  }
})
```

### Endpoint 2: Get All Framework Scores

```javascript
/**
 * GET /api/m365-agentops/v2/compliance/frameworks
 * Returns compliance scores for all 7 frameworks
 */
app.get('/api/m365-agentops/v2/compliance/frameworks', async (req, res) => {
  try {
    const tenantId = req.query.tenantId
    if (!tenantId) {
      return res.status(400).json({ error: 'tenantId required' })
    }

    const frameworks = await complianceEngine.calculateAllFrameworkScores(tenantId)
    res.json({
      success: true,
      data: frameworks
    })
  } catch (error) {
    console.error('Error getting framework scores:', error.message)
    res.status(500).json({
      success: false,
      error: error.message
    })
  }
})
```

### Endpoint 3: Get Single Framework Score

```javascript
/**
 * GET /api/m365-agentops/v2/compliance/framework/:framework
 * Returns compliance score for specific framework
 */
app.get('/api/m365-agentops/v2/compliance/framework/:framework', async (req, res) => {
  try {
    const { framework } = req.params
    const tenantId = req.query.tenantId
    if (!tenantId) {
      return res.status(400).json({ error: 'tenantId required' })
    }

    const score = await complianceEngine.calculateFrameworkScore(framework, tenantId)
    res.json({
      success: true,
      data: score
    })
  } catch (error) {
    console.error(`Error getting ${framework} score:`, error.message)
    res.status(500).json({
      success: false,
      error: error.message
    })
  }
})
```

### Endpoint 4: Get All Domain Scores

```javascript
/**
 * GET /api/m365-agentops/v2/compliance/domains
 * Returns compliance scores for all 20 domains
 */
app.get('/api/m365-agentops/v2/compliance/domains', async (req, res) => {
  try {
    const tenantId = req.query.tenantId
    if (!tenantId) {
      return res.status(400).json({ error: 'tenantId required' })
    }

    const domains = await complianceEngine.calculateAllDomainCompliance(tenantId)
    res.json({
      success: true,
      data: domains
    })
  } catch (error) {
    console.error('Error getting domain scores:', error.message)
    res.status(500).json({
      success: false,
      error: error.message
    })
  }
})
```

### Endpoint 5: Get Single Domain Score

```javascript
/**
 * GET /api/m365-agentops/v2/compliance/domain/:domain
 * Returns compliance score for specific domain
 */
app.get('/api/m365-agentops/v2/compliance/domain/:domain', async (req, res) => {
  try {
    const { domain } = req.params
    const tenantId = req.query.tenantId
    if (!tenantId) {
      return res.status(400).json({ error: 'tenantId required' })
    }

    const score = await complianceEngine.calculateDomainCompliance(domain, tenantId)
    res.json({
      success: true,
      data: score
    })
  } catch (error) {
    console.error(`Error getting ${domain} score:`, error.message)
    res.status(500).json({
      success: false,
      error: error.message
    })
  }
})
```

### Endpoint 6: Get Compliance Trend

```javascript
/**
 * GET /api/m365-agentops/v2/compliance/trend
 * Returns compliance trend over specified days
 */
app.get('/api/m365-agentops/v2/compliance/trend', async (req, res) => {
  try {
    const tenantId = req.query.tenantId
    const daysBack = parseInt(req.query.daysBack || 30)
    if (!tenantId) {
      return res.status(400).json({ error: 'tenantId required' })
    }

    const trend = await complianceEngine.calculateTrend(tenantId, daysBack)
    res.json({
      success: true,
      data: trend
    })
  } catch (error) {
    console.error('Error getting compliance trend:', error.message)
    res.status(500).json({
      success: false,
      error: error.message
    })
  }
})
```

### Endpoint 7: Get Compliance Drift

```javascript
/**
 * GET /api/m365-agentops/v2/compliance/drift
 * Returns control status changes (regressions & remediations)
 */
app.get('/api/m365-agentops/v2/compliance/drift', async (req, res) => {
  try {
    const tenantId = req.query.tenantId
    const daysBack = parseInt(req.query.daysBack || 7)
    if (!tenantId) {
      return res.status(400).json({ error: 'tenantId required' })
    }

    const drift = await complianceEngine.detectDrift(tenantId, daysBack)
    res.json({
      success: true,
      data: drift
    })
  } catch (error) {
    console.error('Error detecting drift:', error.message)
    res.status(500).json({
      success: false,
      error: error.message
    })
  }
})
```

### Endpoint 8: Get Compliance Snapshot

```javascript
/**
 * GET /api/m365-agentops/v2/compliance/snapshot
 * Returns latest compliance snapshot
 *
 * POST /api/m365-agentops/v2/compliance/snapshot
 * Creates new compliance snapshot
 */
app.get('/api/m365-agentops/v2/compliance/snapshot', async (req, res) => {
  try {
    const tenantId = req.query.tenantId
    if (!tenantId) {
      return res.status(400).json({ error: 'tenantId required' })
    }

    const snapshot = await complianceEngine.getLatestSnapshot(tenantId)
    res.json({
      success: true,
      data: snapshot
    })
  } catch (error) {
    console.error('Error getting snapshot:', error.message)
    res.status(500).json({
      success: false,
      error: error.message
    })
  }
})

app.post('/api/m365-agentops/v2/compliance/snapshot', async (req, res) => {
  try {
    const { tenantId } = req.body
    if (!tenantId) {
      return res.status(400).json({ error: 'tenantId required' })
    }

    const snapshotId = await complianceEngine.createComplianceSnapshot(tenantId)
    res.json({
      success: true,
      data: { snapshotId }
    })
  } catch (error) {
    console.error('Error creating snapshot:', error.message)
    res.status(500).json({
      success: false,
      error: error.message
    })
  }
})
```

### Endpoint 9: Get Executive Summary

```javascript
/**
 * GET /api/m365-agentops/v2/compliance/summary
 * Returns executive compliance summary with recommendations
 */
app.get('/api/m365-agentops/v2/compliance/summary', async (req, res) => {
  try {
    const tenantId = req.query.tenantId
    if (!tenantId) {
      return res.status(400).json({ error: 'tenantId required' })
    }

    const summary = await complianceEngine.generateExecutiveSummary(tenantId)
    res.json({
      success: true,
      data: summary
    })
  } catch (error) {
    console.error('Error generating summary:', error.message)
    res.status(500).json({
      success: false,
      error: error.message
    })
  }
})
```

### Endpoint 10: Get Failures by Severity

```javascript
/**
 * GET /api/m365-agentops/v2/compliance/failures-by-severity
 * Returns control failures grouped by severity
 */
app.get('/api/m365-agentops/v2/compliance/failures-by-severity', async (req, res) => {
  try {
    const tenantId = req.query.tenantId
    if (!tenantId) {
      return res.status(400).json({ error: 'tenantId required' })
    }

    const failures = await complianceEngine.getFailuresBySeverity(tenantId)
    res.json({
      success: true,
      data: failures
    })
  } catch (error) {
    console.error('Error getting failures by severity:', error.message)
    res.status(500).json({
      success: false,
      error: error.message
    })
  }
})
```

---

## 4. Testing the Endpoints

Once integrated, test with curl:

```bash
# Get overall score
curl "http://localhost:3000/api/m365-agentops/v2/compliance/score?tenantId=contoso.onmicrosoft.com"

# Get all framework scores
curl "http://localhost:3000/api/m365-agentops/v2/compliance/frameworks?tenantId=contoso.onmicrosoft.com"

# Get CIS framework score
curl "http://localhost:3000/api/m365-agentops/v2/compliance/framework/CIS?tenantId=contoso.onmicrosoft.com"

# Get all domain scores
curl "http://localhost:3000/api/m365-agentops/v2/compliance/domains?tenantId=contoso.onmicrosoft.com"

# Get TG-ID domain score
curl "http://localhost:3000/api/m365-agentops/v2/compliance/domain/TG-ID?tenantId=contoso.onmicrosoft.com"

# Get 30-day trend
curl "http://localhost:3000/api/m365-agentops/v2/compliance/trend?tenantId=contoso.onmicrosoft.com&daysBack=30"

# Get 7-day drift
curl "http://localhost:3000/api/m365-agentops/v2/compliance/drift?tenantId=contoso.onmicrosoft.com&daysBack=7"

# Get latest snapshot
curl "http://localhost:3000/api/m365-agentops/v2/compliance/snapshot?tenantId=contoso.onmicrosoft.com"

# Create new snapshot
curl -X POST "http://localhost:3000/api/m365-agentops/v2/compliance/snapshot" \
  -H "Content-Type: application/json" \
  -d '{"tenantId":"contoso.onmicrosoft.com"}'

# Get executive summary
curl "http://localhost:3000/api/m365-agentops/v2/compliance/summary?tenantId=contoso.onmicrosoft.com"

# Get failures by severity
curl "http://localhost:3000/api/m365-agentops/v2/compliance/failures-by-severity?tenantId=contoso.onmicrosoft.com"
```

---

## 5. Frontend Integration

Use the `complianceApi` client in frontend code:

```javascript
import { complianceApi } from '../lib/compliance-api-client.js'

// Get overall score
const score = await complianceApi.getComplianceScore(tenantId)
console.log(`Compliance: ${score.score}% (${score.status})`)

// Get all framework scores
const frameworks = await complianceApi.getFrameworkScores(tenantId)
console.log(frameworks) // { CIS: {...}, NIST: {...}, ... }

// Get trend
const trend = await complianceApi.getComplianceTrend(tenantId, 30)
console.log(trend.direction) // '📈 Improving', '📉 Declining', etc.

// Get drift
const drift = await complianceApi.getComplianceDrift(tenantId, 7)
console.log(`Regressions: ${drift.regressionCount}`)
console.log(`Remediations: ${drift.remediationCount}`)

// Get executive summary
const summary = await complianceApi.getExecutiveSummary(tenantId)
console.log(summary.recommendations) // Array of action items
```

---

## 6. Response Formats

### Compliance Score Response

```json
{
  "success": true,
  "data": {
    "score": 79.2,
    "earnedPoints": 8118,
    "totalPoints": 10250,
    "breakdown": {
      "passed": 847,
      "failed": 156,
      "partial": 18,
      "unknown": 4,
      "error": 0,
      "total": 1025
    },
    "status": "Fair"
  }
}
```

### Framework Scores Response

```json
{
  "success": true,
  "data": {
    "CIS": {
      "framework": "CIS",
      "score": 82.5,
      "totalControls": 450,
      "passed": 371,
      "failed": 79,
      "earnedPoints": 2614,
      "totalPoints": 3170,
      "status": "Good"
    },
    "NIST": { ... },
    "ISO": { ... },
    ...
  }
}
```

### Trend Response

```json
{
  "success": true,
  "data": {
    "daysBack": 30,
    "dataPoints": 30,
    "trend": "📈 Improving",
    "direction": "📈 Improving",
    "velocity": 0.45,
    "projection30Days": 82.1,
    "history": [
      { "date": "2026-06-28", "score": 75.2 },
      { "date": "2026-06-29", "score": 75.8 },
      ...
    ]
  }
}
```

### Drift Response

```json
{
  "success": true,
  "data": {
    "regressions": [
      { "controlId": "TG-ID-001", "severity": "Critical", "changedAt": "2026-07-28T10:30:00Z" },
      ...
    ],
    "remediations": [
      { "controlId": "TG-AUTH-005", "changedAt": "2026-07-28T09:15:00Z" },
      ...
    ],
    "scoreDelta": -2.3,
    "severity": "High",
    "trend": "Declining",
    "regressionCount": 3,
    "remediationCount": 1
  }
}
```

---

## Next Steps

1. ✅ Compliance Engine implemented (`backend/lib/m365-compliance-engine.js`)
2. ✅ Views & indexes created (`backend/db/migrations/002_m365_compliance_views.sql`)
3. ✅ Endpoints specified (this file)
4. **→ Add endpoints to backend/server.js**
5. **→ Test with curl**
6. **→ Integrate frontend client**
7. **→ Build executive dashboards (Phase 2)**
