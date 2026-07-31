-- ============================================================
-- M365 AgentOps Universal Control Catalog (M365-UCC)
-- Migration 001: Initial Schema
-- ============================================================

-- Drop existing tables if they exist (for clean slate)
DROP TABLE IF EXISTS m365_control_history CASCADE;
DROP TABLE IF EXISTS m365_compliance_drift CASCADE;
DROP TABLE IF EXISTS m365_compliance_snapshots CASCADE;
DROP TABLE IF EXISTS m365_control_evidence CASCADE;
DROP TABLE IF EXISTS m365_control_results CASCADE;
DROP TABLE IF EXISTS m365_control_mappings CASCADE;
DROP TABLE IF EXISTS m365_control_catalog CASCADE;

-- ============================================================
-- 1. Universal Control Catalog (Immutable Master Data)
-- ============================================================
CREATE TABLE m365_control_catalog (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Control Identity
  control_id VARCHAR(50) UNIQUE NOT NULL,  -- TG-ID-001, TG-AUTH-042, etc.
  control_name VARCHAR(255) NOT NULL,
  description TEXT,

  -- Organization
  domain VARCHAR(50) NOT NULL,  -- TG-ID, TG-AUTH, TG-CA, TG-APP, etc.
  category VARCHAR(100),  -- Authentication, MFA, Governance, etc.
  service VARCHAR(100),  -- Entra ID, Exchange, Teams, SharePoint, etc.

  -- Risk Assessment
  severity VARCHAR(50) NOT NULL,  -- Critical, High, Medium, Low, Informational
  risk_weight INT NOT NULL,  -- 10, 7, 4, 2, 1 (must match severity)

  -- Validation Configuration
  validation_type VARCHAR(50) NOT NULL,  -- Automatic, Manual, Hybrid
  validation_engine VARCHAR(50),  -- Graph API, PowerShell, M365 DSC
  validation_logic TEXT,  -- Human-readable rule

  graph_endpoint VARCHAR(500),  -- /policies/authenticationMethodsPolicy
  graph_method VARCHAR(10) DEFAULT 'GET',  -- GET, POST
  graph_property VARCHAR(255),  -- Nested property to evaluate
  expected_value TEXT,  -- What we expect (e.g., "enabled", "true", ">= 2")

  -- Remediation Metadata
  auto_remediation_supported BOOLEAN DEFAULT FALSE,
  remediation_steps TEXT,  -- JSON array of steps
  estimated_effort VARCHAR(50),  -- Low, Medium, High
  business_impact VARCHAR(50),  -- Low, Medium, High, Critical

  -- Technical Details
  powershell_fallback BOOLEAN DEFAULT FALSE,
  license_required VARCHAR(100),  -- e.g., "Entra ID P1"
  mitre_attack VARCHAR(50),  -- e.g., "T1078.004"
  capec VARCHAR(50),  -- e.g., "CAPEC-114"

  -- Audit Trail
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  created_by VARCHAR(255) DEFAULT 'system',
  version INT DEFAULT 1,

  CONSTRAINT severity_weight_check CHECK (
    (severity = 'Critical' AND risk_weight = 10) OR
    (severity = 'High' AND risk_weight = 7) OR
    (severity = 'Medium' AND risk_weight = 4) OR
    (severity = 'Low' AND risk_weight = 2) OR
    (severity = 'Informational' AND risk_weight = 1)
  )
)

CREATE INDEX idx_control_catalog_domain ON m365_control_catalog(domain);
CREATE INDEX idx_control_catalog_service ON m365_control_catalog(service);
CREATE INDEX idx_control_catalog_severity ON m365_control_catalog(severity);

-- ============================================================
-- 2. Framework Mappings (Many-to-Many)
-- ============================================================
CREATE TABLE m365_control_mappings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  control_id UUID NOT NULL REFERENCES m365_control_catalog(id) ON DELETE CASCADE,

  -- Framework Information
  framework VARCHAR(50) NOT NULL,  -- CIS, NIST, ISO, CMMC, SOC2, PCI-DSS
  framework_control_id VARCHAR(50) NOT NULL,  -- 5.2.1, IA-2, A.5.17, etc.

  -- Mapping Type
  mapping_type VARCHAR(50) DEFAULT 'Primary',  -- Primary, Secondary, Informational
  mapping_notes TEXT,

  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

  UNIQUE(control_id, framework, framework_control_id)
)

CREATE INDEX idx_control_mappings_framework ON m365_control_mappings(framework);
CREATE INDEX idx_control_mappings_control_id ON m365_control_mappings(control_id);

-- ============================================================
-- 3. Control Validation Results (Runtime Data)
-- ============================================================
CREATE TABLE m365_control_results (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Reference
  control_id UUID NOT NULL REFERENCES m365_control_catalog(id) ON DELETE CASCADE,
  tenant_id VARCHAR(255) NOT NULL,

  -- Validation Status
  status VARCHAR(50) NOT NULL,  -- Pass, Fail, Partial, Unknown, Manual Review, Not Applicable, Error
  confidence INT CHECK (confidence >= 0 AND confidence <= 100),

  -- Values
  current_value TEXT,
  expected_value TEXT,

  -- Data Source
  data_source VARCHAR(50),  -- Graph API, PowerShell, M365 DSC

  -- Validation Metadata
  validated_at TIMESTAMP NOT NULL,
  validated_by VARCHAR(255) DEFAULT 'system',
  api_version VARCHAR(20),
  tool_version VARCHAR(20),

  -- Audit Trail
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

  INDEX idx_control_results_tenant_control (tenant_id, control_id),
  INDEX idx_control_results_validated_at (validated_at DESC)
)

-- ============================================================
-- 4. Evidence Storage (Complete Audit Trail)
-- ============================================================
CREATE TABLE m365_control_evidence (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  result_id UUID NOT NULL REFERENCES m365_control_results(id) ON DELETE CASCADE,

  -- API Call Details
  endpoint VARCHAR(500),
  method VARCHAR(10),  -- GET, POST
  request_body JSON,
  raw_response JSON,

  -- Evaluation Details
  evaluated_property VARCHAR(255),  -- The property that was evaluated
  evaluated_value TEXT,  -- The actual value found
  evaluation_logic TEXT,  -- The rule applied
  evaluation_result BOOLEAN,  -- Did it pass the rule?

  -- Execution Details
  timestamp TIMESTAMP NOT NULL,
  api_version VARCHAR(20),
  execution_time_ms INT,  -- How long did validation take

  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

  INDEX idx_control_evidence_result_id (result_id)
)

-- ============================================================
-- 5. Compliance Snapshots (Timeline)
-- ============================================================
CREATE TABLE m365_compliance_snapshots (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  tenant_id VARCHAR(255) NOT NULL,
  snapshot_date TIMESTAMP NOT NULL,

  -- Control Counts
  total_controls INT NOT NULL,
  passed_controls INT NOT NULL,
  failed_controls INT NOT NULL,
  partial_controls INT NOT NULL,
  unknown_controls INT NOT NULL,

  -- Weighted Score
  total_risk_points INT NOT NULL,
  earned_risk_points INT NOT NULL,
  compliance_score DECIMAL(5, 2) NOT NULL,  -- Percentage

  -- Per-Framework Scores (JSON)
  framework_scores JSON,  -- { "CIS": 73, "NIST": 68, "ISO": 71, "Zero Trust": 74 }

  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

  UNIQUE(tenant_id, snapshot_date),
  INDEX idx_compliance_snapshots_tenant_date (tenant_id, snapshot_date DESC)
)

-- ============================================================
-- 6. Compliance Drift Events
-- ============================================================
CREATE TABLE m365_compliance_drift (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  tenant_id VARCHAR(255) NOT NULL,
  control_id UUID NOT NULL REFERENCES m365_control_catalog(id) ON DELETE CASCADE,

  -- Status Change
  previous_status VARCHAR(50),
  new_status VARCHAR(50),

  -- Drift Details
  changed_at TIMESTAMP NOT NULL,
  drift_reason VARCHAR(255),  -- Regression, Remediated, Validation Error, Policy Changed
  severity VARCHAR(50),  -- Critical, High, Medium, Low

  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

  INDEX idx_compliance_drift_tenant_date (tenant_id, changed_at DESC),
  INDEX idx_compliance_drift_control_id (control_id)
)

-- ============================================================
-- 7. Control History (For Trends)
-- ============================================================
CREATE TABLE m365_control_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  control_id UUID NOT NULL REFERENCES m365_control_catalog(id) ON DELETE CASCADE,
  tenant_id VARCHAR(255) NOT NULL,

  date_snapshot DATE NOT NULL,
  status VARCHAR(50) NOT NULL,
  confidence INT,

  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

  UNIQUE(control_id, tenant_id, date_snapshot),
  INDEX idx_control_history_tenant_control (tenant_id, control_id),
  INDEX idx_control_history_date (date_snapshot DESC)
)

-- ============================================================
-- Indexes for Performance
-- ============================================================
CREATE INDEX idx_control_results_status ON m365_control_results(status);
CREATE INDEX idx_control_results_confidence ON m365_control_results(confidence);
CREATE INDEX idx_compliance_snapshots_score ON m365_compliance_snapshots(compliance_score);

-- ============================================================
-- Migration Metadata
-- ============================================================
CREATE TABLE IF NOT EXISTS schema_migrations (
  version INT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  executed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)

INSERT INTO schema_migrations (version, name) VALUES (1, 'M365-UCC-Initial-Schema');
