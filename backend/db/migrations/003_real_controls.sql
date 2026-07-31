-- ============================================================
-- Real Control Definitions Schema
-- Stores actual compliance controls from frameworks
-- ============================================================

-- Controls from compliance frameworks
CREATE TABLE IF NOT EXISTS compliance_controls (
  id SERIAL PRIMARY KEY,
  control_id VARCHAR(50) NOT NULL UNIQUE,
  framework VARCHAR(50) NOT NULL,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  domain VARCHAR(20),
  severity VARCHAR(20),
  validation_method VARCHAR(100),
  graph_api_queries TEXT[],
  powershell_commands TEXT[],
  expected_values TEXT,
  remediation_steps TEXT,
  references TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_domain FOREIGN KEY (domain) REFERENCES compliance_domains(id)
);

-- Domain definitions
CREATE TABLE IF NOT EXISTS compliance_domains (
  id VARCHAR(20) PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  description TEXT,
  workload VARCHAR(50)
);

-- Control validation results (stores test results)
CREATE TABLE IF NOT EXISTS control_validations (
  id SERIAL PRIMARY KEY,
  tenant_id VARCHAR(255) NOT NULL,
  control_id VARCHAR(50) NOT NULL,
  status VARCHAR(20),
  score INT,
  details JSONB,
  validated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (control_id) REFERENCES compliance_controls(control_id),
  INDEX idx_tenant_control (tenant_id, control_id),
  INDEX idx_validated_at (validated_at)
);

-- Framework-to-control mappings
CREATE TABLE IF NOT EXISTS framework_controls (
  id SERIAL PRIMARY KEY,
  framework VARCHAR(50) NOT NULL,
  control_id VARCHAR(50) NOT NULL,
  framework_control_id VARCHAR(50),
  coverage DECIMAL(5, 2),
  FOREIGN KEY (control_id) REFERENCES compliance_controls(control_id),
  UNIQUE(framework, control_id)
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_controls_framework ON compliance_controls(framework);
CREATE INDEX IF NOT EXISTS idx_controls_domain ON compliance_controls(domain);
CREATE INDEX IF NOT EXISTS idx_controls_severity ON compliance_controls(severity);
CREATE INDEX IF NOT EXISTS idx_validations_tenant ON control_validations(tenant_id);
CREATE INDEX IF NOT EXISTS idx_validations_status ON control_validations(status);
