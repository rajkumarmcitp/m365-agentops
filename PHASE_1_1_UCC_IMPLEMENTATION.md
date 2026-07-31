# Phase 1.1: M365 AgentOps Universal Control Catalog (UCC) Implementation

**Status:** Ready for Setup
**Phase:** Foundation
**Timeline:** Week 1-2
**Impact:** Transforms compliance reporting from framework-specific to control-based

---

## Overview

Phase 1.1 implements the foundational architecture for M365 AgentOps as an **enterprise-grade Continuous Security Posture Management (CSPM)** platform.

Instead of validating "96 CIS controls," we now validate **TenantGuard Universal Controls (TG-*)** once, then map them to **CIS, NIST, ISO, CMMC, SOC2, Secure Score, Zero Trust**, and future frameworks.

### Key Architecture Change

```
Before (Framework-specific):
CIS Control 5.2.1 → Validate → Report as "CIS Result"

After (Universal):
TG-ID-001 → Validate (once) → Map to:
  ├─ CIS 5.2.1
  ├─ NIST IA-2
  ├─ ISO A.5.17
  ├─ CMMC AC.L2.1.1
  ├─ Secure Score 104
  └─ Zero Trust Identity
```

**Benefit:** Add a new framework by adding mapping rows, not rewriting validation logic.

---

## Files Created

### 1. Database Schema
**File:** `backend/db/migrations/001_m365_ucc_schema.sql`

**Tables:**
- `m365_control_catalog` — Master control definitions (immutable)
- `m365_control_mappings` — Framework mappings (many-to-many)
- `m365_control_results` — Validation results (runtime data)
- `m365_control_evidence` — Complete audit trail (JSON responses)
- `m365_compliance_snapshots` — Historical compliance scoring
- `m365_compliance_drift` — Status change tracking
- `m365_control_history` — Trend data

**Design Highlights:**
- Constraints enforce severity/weight consistency
- Indexes for performance (tenant queries, trend analysis)
- JSON fields for flexibility (raw API responses, evidence)

### 2. Control Catalog (Identity & Auth)
**File:** `backend/db/data/ucc_identity_controls.sql`

**Domains:**
- **TG-ID** (Identity Security) — 10 sample controls
  - TG-ID-001: MFA Required for Global Administrators
  - TG-ID-002: Legacy Authentication Blocked
  - TG-ID-003 through TG-ID-010: Access control, risk policies, guest management
  - (Structure provided for 70 total controls)

- **TG-AUTH** (Authentication & MFA) — 5 sample controls
  - TG-AUTH-001: MFA Registration Required
  - TG-AUTH-002: Authenticator App Enabled
  - TG-AUTH-003: FIDO2 Security Keys
  - TG-AUTH-004: SMS Not Sole Method
  - TG-AUTH-005: Self-Service Password Reset
  - (Structure provided for 35 total controls)

**Rich Metadata:**
```sql
{
  control_id: 'TG-ID-001',
  control_name: 'MFA Required for Global Administrators',
  domain: 'TG-ID',
  severity: 'Critical',
  risk_weight: 10,
  
  validation: {
    engine: 'Graph API',
    endpoint: '/roleManagement/directory/roleAssignments',
    property: 'members[*].mfaEnabled',
    expectedValue: 'true'
  },
  
  remediation: {
    steps: [...],
    effort: 'Low',
    businessImpact: 'Critical',
    autoSupported: true
  },
  
  frameworks: [
    { framework: 'CIS', id: '5.2.1', type: 'Primary' },
    { framework: 'NIST', id: 'IA-2', type: 'Primary' },
    { framework: 'ISO', id: 'A.5.17', type: 'Primary' },
    // ... 4 more frameworks
  ]
}
```

### 3. Framework Mappings
**File:** `backend/db/data/ucc_framework_mappings.sql`

**Approach:** One-to-many mappings stored in `m365_control_mappings` table.

**Example:**
```sql
TG-ID-001 maps to:
  - CIS 5.2.1 (Primary)
  - NIST IA-2 (Primary)
  - ISO A.5.17 (Primary)
  - CMMC AC.L2.1.1 (Primary)
  - SOC2 CC6.1 (Secondary)
  - Secure Score 104 (Primary)
  - Zero Trust Identity (Primary)
```

**Benefit:** Change a mapping → all frameworks update instantly. No code changes.

### 4. Database Initialization
**File:** `backend/db/init-ucc.js`

**Usage:**
```bash
node backend/db/init-ucc.js
```

**Steps:**
1. Creates schema (7 tables + indexes)
2. Seeds control catalog (Identity & Auth domains)
3. Inserts framework mappings
4. Verifies all tables exist
5. Reports: total controls, total mappings, framework coverage

**Output:**
```
✨ UCC initialization complete!

📈 Summary:
   ✅ Schema created
   ✅ Control catalog populated
   ✅ Framework mappings configured
   ✅ Verification passed

🔗 Framework Coverage:
   • CIS: 15 controls
   • NIST: 12 controls
   • ISO: 10 controls
   • CMMC: 8 controls
   • Secure Score: 8 controls
   • Zero Trust: 15 controls
   • SOC2: 3 controls
```

### 5. Validation Engine
**File:** `backend/lib/m365-control-validation-engine.js`

**Class:** `M365ControlValidationEngine`

**Key Methods:**

```javascript
// Get a control definition
async getControlDefinition(controlId)

// Validate a single control
async validateControl(controlId, tenantId)
  → Returns: { status, confidence, evidence }

// Validate all controls in a domain
async validateDomain(domain, tenantId)

// Validate all controls (all domains)
async validateAllControls(tenantId)
  → Creates compliance snapshot
  → Detects drift
  → Stores evidence

// Evaluate if actual value meets expected
evaluateStatus(actualValue, expectedValue)
  → Handles: >, >=, <, <=, contains, not null, ==
```

**Flow:**
1. Get control definition from catalog
2. Execute validation (Graph API / PowerShell)
3. Extract actual value from API response
4. Evaluate against expected value
5. Store result + evidence + audit trail
6. Calculate compliance snapshot
7. Detect drift from previous state

---

## Setup Instructions

### Prerequisites

1. **PostgreSQL 14+**
   ```bash
   # macOS
   brew install postgresql
   brew services start postgresql

   # Linux
   sudo apt-get install postgresql postgresql-contrib
   ```

2. **Database Configured**
   ```bash
   createdb m365_agentops
   createuser m365_app
   psql -d m365_agentops -c "ALTER USER m365_app WITH PASSWORD 'secure_password';"
   ```

3. **Environment Variables**
   ```bash
   # backend/.env
   DB_HOST=localhost
   DB_PORT=5432
   DB_NAME=m365_agentops
   DB_USER=m365_app
   DB_PASSWORD=secure_password
   DB_SSL=false
   ```

### Step 1: Initialize Database

```bash
cd backend
node db/init-ucc.js
```

**Expected Output:**
```
🚀 Starting M365 AgentOps UCC Initialization...

📋 Running migration: M365-UCC Initial Schema...
✅ Migration completed: M365-UCC Initial Schema

🌱 Seeding control catalog: Identity & Auth Controls...
✅ Seeded 15 records: Identity & Auth Controls

🌱 Seeding control catalog: Framework Mappings...
✅ Seeded 47 records: Framework Mappings

🔍 Verifying schema...
✅ Table exists: m365_control_catalog
✅ Table exists: m365_control_mappings
✅ Table exists: m365_control_results
✅ Table exists: m365_control_evidence
✅ Table exists: m365_compliance_snapshots
✅ Table exists: m365_compliance_drift
✅ Table exists: m365_control_history

📊 Total controls in catalog: 15
📊 Total framework mappings: 47

✨ UCC initialization complete!
```

### Step 2: Verify Installation

```bash
# Connect to database
psql -d m365_agentops

# Check tables
\dt

# Count controls
SELECT domain, COUNT(*) FROM m365_control_catalog GROUP BY domain;

# Check mappings
SELECT framework, COUNT(*) FROM m365_control_mappings GROUP BY framework;
```

### Step 3: Integrate with Backend

Add to `backend/server.js`:

```javascript
import { M365ControlValidationEngine } from './lib/m365-control-validation-engine.js'

let validationEngine

// When graphClient is ready
validationEngine = new M365ControlValidationEngine(pool, graphClient)

// Validation endpoint
app.post('/api/m365-agentops/v2/validate/all', async (req, res) => {
  const tenantId = req.query.tenantId
  try {
    const results = await validationEngine.validateAllControls(tenantId)
    res.json({ success: true, validationCount: results.length, results })
  } catch (e) {
    res.status(500).json({ success: false, error: e.message })
  }
})
```

---

## Data Model Example

### Control: TG-ID-001

```javascript
{
  id: 'uuid-...',
  control_id: 'TG-ID-001',
  control_name: 'MFA Required for Global Administrators',
  domain: 'TG-ID',
  severity: 'Critical',
  risk_weight: 10,
  
  validation_type: 'Automatic',
  validation_engine: 'Graph API',
  graph_endpoint: '/roleManagement/directory/roleAssignments',
  graph_property: 'members[*].mfaEnabled',
  expected_value: 'true',
  
  auto_remediation_supported: true,
  estimated_effort: 'Low',
  business_impact: 'Critical'
}
```

### Validation Result for TG-ID-001

```javascript
{
  id: 'uuid-...',
  control_id: 'uuid-tg-id-001',
  tenant_id: 'tenant-123',
  status: 'Pass',           // or Fail, Partial, Unknown, Error
  confidence: 100,          // 0-100 confidence score
  current_value: '["true", "true", "true"]',
  expected_value: 'true',
  data_source: 'Graph API',
  validated_at: '2026-07-28T14:30:00Z'
}
```

### Framework Mapping for TG-ID-001

```javascript
[
  {
    control_id: 'uuid-tg-id-001',
    framework: 'CIS',
    framework_control_id: '5.2.1',
    mapping_type: 'Primary'
  },
  {
    control_id: 'uuid-tg-id-001',
    framework: 'NIST',
    framework_control_id: 'IA-2',
    mapping_type: 'Primary'
  },
  // ... 5 more mappings
]
```

### Compliance Snapshot

```javascript
{
  tenant_id: 'tenant-123',
  snapshot_date: '2026-07-28T14:30:00Z',
  
  // Counts
  total_controls: 15,
  passed_controls: 12,
  failed_controls: 2,
  partial_controls: 1,
  unknown_controls: 0,
  
  // Weighted scoring
  total_risk_points: 120,
  earned_risk_points: 95,
  compliance_score: 79.17,
  
  // Per-framework (JSON)
  framework_scores: {
    "CIS": 80,
    "NIST": 78,
    "ISO": 76,
    "Zero Trust": 81
  }
}
```

---

## Phase 1.1 Deliverables Checklist

- ✅ Database schema (7 tables + indexes)
- ✅ Control catalog (Identity & Auth domains, 15 controls)
- ✅ Framework mappings (47 mappings across 7 frameworks)
- ✅ Validation engine (Graph API validation)
- ✅ Initialization script (automated setup)
- ✅ Documentation (this file)

---

## Next Steps (Phase 1.2 - 1.4)

| Phase | Week | Deliverable |
|-------|------|-------------|
| **1.2** | 2 | Remaining 18 domains (600+ controls) |
| **1.3** | 2-3 | Framework Mappings (all frameworks) |
| **1.4** | 3 | Compliance Engine (weighted scoring) |
| **2.1** | 3-4 | v2.0 API Endpoints |
| **2.2** | 4 | Executive Dashboard |
| **2.3** | 5 | Control Drill-down UI |
| **3.1** | 5-6 | Timeline & Trends |

---

## Architecture Diagram

```
┌────────────────────────────────────────────┐
│   M365 AgentOps: Universal Control Catalog │
└────────────────┬───────────────────────────┘

                 ↓

    ┌───────────────────────────────────────┐
    │  Control Validation Engine (Singleton) │
    │                                       │
    │  - Graph API validation               │
    │  - PowerShell validation (future)     │
    │  - M365 DSC validation (future)       │
    └──────────────┬────────────────────────┘

                   ↓

    ┌───────────────────────────────────────┐
    │   PostgreSQL Database                 │
    │                                       │
    │   ├─ m365_control_catalog             │
    │   ├─ m365_control_mappings            │
    │   ├─ m365_control_results             │
    │   ├─ m365_control_evidence            │
    │   ├─ m365_compliance_snapshots        │
    │   ├─ m365_compliance_drift            │
    │   └─ m365_control_history             │
    └──────────────┬────────────────────────┘

                   ↓

    ┌───────────────────────────────────────┐
    │   Framework Views (Next Phase)        │
    │                                       │
    │   ├─ CIS Benchmark                    │
    │   ├─ NIST CSF 2.0                     │
    │   ├─ ISO 27001                        │
    │   ├─ CMMC 2.0                         │
    │   ├─ SOC2                             │
    │   ├─ Secure Score                     │
    │   └─ Zero Trust                       │
    └───────────────────────────────────────┘

                   ↓

    ┌───────────────────────────────────────┐
    │   Executive Dashboard                 │
    │   - Risk-based scoring                │
    │   - Compliance timeline               │
    │   - Control drill-down                │
    │   - Drift detection                   │
    └───────────────────────────────────────┘
```

---

## Success Criteria

✅ **Phase 1.1 Complete When:**
- [ ] Database schema created and verified
- [ ] 15 controls seeded (Identity & Auth)
- [ ] 47 framework mappings configured
- [ ] init-ucc.js script runs successfully
- [ ] Graph API validation engine working
- [ ] Compliance snapshots being generated
- [ ] Drift detection tracking changes

---

## Support

For issues or questions:
1. Check database connectivity: `psql -d m365_agentops -c "SELECT VERSION();"`
2. Run init script with verbose output: `node backend/db/init-ucc.js 2>&1 | tee ucc-setup.log`
3. Verify tables: `psql -d m365_agentops -c "\dt"`
4. Test validation engine: Add console.log statements in `validateControl()`
