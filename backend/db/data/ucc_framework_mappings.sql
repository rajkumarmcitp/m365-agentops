-- ============================================================
-- M365 AgentOps Universal Control Catalog
-- Framework Mappings: One Control → Multiple Frameworks
-- ============================================================

-- ============================================================
-- TG-ID-001: MFA Required for Global Administrators
-- Maps to: CIS, NIST, ISO, CMMC, SOC2, Secure Score, Zero Trust
-- ============================================================
INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'CIS', '5.2.1', 'Primary', 'Global Admin MFA requirement' FROM m365_control_catalog WHERE control_id = 'TG-ID-001'
UNION ALL
SELECT id, 'NIST', 'IA-2', 'Primary', 'Multi-factor authentication for users' FROM m365_control_catalog WHERE control_id = 'TG-ID-001'
UNION ALL
SELECT id, 'ISO', 'A.5.17', 'Primary', 'Authentication mechanisms' FROM m365_control_catalog WHERE control_id = 'TG-ID-001'
UNION ALL
SELECT id, 'CMMC', 'AC.L2.1.1', 'Primary', 'Multi-factor authentication' FROM m365_control_catalog WHERE control_id = 'TG-ID-001'
UNION ALL
SELECT id, 'SOC2', 'CC6.1', 'Secondary', 'Logical and physical access controls' FROM m365_control_catalog WHERE control_id = 'TG-ID-001'
UNION ALL
SELECT id, 'Secure Score', '104', 'Primary', 'Require multifactor authentication' FROM m365_control_catalog WHERE control_id = 'TG-ID-001'
UNION ALL
SELECT id, 'Zero Trust', 'Identity', 'Primary', 'Enforce MFA for Identity pillar' FROM m365_control_catalog WHERE control_id = 'TG-ID-001';

-- ============================================================
-- TG-ID-002: Legacy Authentication Blocked
-- Maps to: CIS, NIST, Zero Trust
-- ============================================================
INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'CIS', '5.2.3', 'Primary', 'Block legacy protocols' FROM m365_control_catalog WHERE control_id = 'TG-ID-002'
UNION ALL
SELECT id, 'NIST', 'IA-2', 'Primary', 'Authentication security' FROM m365_control_catalog WHERE control_id = 'TG-ID-002'
UNION ALL
SELECT id, 'Zero Trust', 'Identity', 'Primary', 'Modern authentication requirement' FROM m365_control_catalog WHERE control_id = 'TG-ID-002';

-- ============================================================
-- TG-ID-003: Conditional Access for Admin Portals
-- Maps to: CIS, NIST, ISO, Zero Trust
-- ============================================================
INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'CIS', '5.3.1', 'Primary', 'Conditional Access policies' FROM m365_control_catalog WHERE control_id = 'TG-ID-003'
UNION ALL
SELECT id, 'NIST', 'AC-3', 'Primary', 'Access enforcement' FROM m365_control_catalog WHERE control_id = 'TG-ID-003'
UNION ALL
SELECT id, 'ISO', 'A.5.18', 'Primary', 'Access control implementation' FROM m365_control_catalog WHERE control_id = 'TG-ID-003'
UNION ALL
SELECT id, 'Zero Trust', 'Identity', 'Primary', 'Risk-based access control' FROM m365_control_catalog WHERE control_id = 'TG-ID-003';

-- ============================================================
-- TG-ID-004: No Permanent Role Assignments
-- Maps to: CIS, NIST, ISO, CMMC, Zero Trust
-- ============================================================
INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'CIS', '5.1.3', 'Primary', 'Privileged role management' FROM m365_control_catalog WHERE control_id = 'TG-ID-004'
UNION ALL
SELECT id, 'NIST', 'AC-2', 'Primary', 'Account management' FROM m365_control_catalog WHERE control_id = 'TG-ID-004'
UNION ALL
SELECT id, 'ISO', 'A.5.16', 'Primary', 'Privilege management' FROM m365_control_catalog WHERE control_id = 'TG-ID-004'
UNION ALL
SELECT id, 'CMMC', 'AC.L2.1.2', 'Primary', 'Privileged access management' FROM m365_control_catalog WHERE control_id = 'TG-ID-004'
UNION ALL
SELECT id, 'Zero Trust', 'Identity', 'Primary', 'Just-in-time privileged access' FROM m365_control_catalog WHERE control_id = 'TG-ID-004';

-- ============================================================
-- TG-ID-005: PIM Approval Required
-- Maps to: CIS, NIST, ISO, CMMC
-- ============================================================
INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'CIS', '5.1.4', 'Primary', 'PIM approval workflows' FROM m365_control_catalog WHERE control_id = 'TG-ID-005'
UNION ALL
SELECT id, 'NIST', 'AC-2', 'Primary', 'Privileged account management' FROM m365_control_catalog WHERE control_id = 'TG-ID-005'
UNION ALL
SELECT id, 'ISO', 'A.5.16', 'Primary', 'Separation of duties' FROM m365_control_catalog WHERE control_id = 'TG-ID-005'
UNION ALL
SELECT id, 'CMMC', 'AC.L2.1.2', 'Primary', 'Approval for privileged access' FROM m365_control_catalog WHERE control_id = 'TG-ID-005';

-- ============================================================
-- TG-ID-006: Password Policy: No Expiration
-- Maps to: CIS, NIST, ISO
-- ============================================================
INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'CIS', '5.4.2', 'Primary', 'Password policy configuration' FROM m365_control_catalog WHERE control_id = 'TG-ID-006'
UNION ALL
SELECT id, 'NIST', 'IA-5', 'Primary', 'Password management' FROM m365_control_catalog WHERE control_id = 'TG-ID-006'
UNION ALL
SELECT id, 'ISO', 'A.5.5', 'Primary', 'Access control policies' FROM m365_control_catalog WHERE control_id = 'TG-ID-006';

-- ============================================================
-- TG-ID-007: User Risk Policy Enabled
-- Maps to: NIST, ISO, Zero Trust, Secure Score
-- ============================================================
INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'NIST', 'SI-4', 'Primary', 'Information system monitoring' FROM m365_control_catalog WHERE control_id = 'TG-ID-007'
UNION ALL
SELECT id, 'ISO', 'A.12.4', 'Primary', 'Monitoring and detection' FROM m365_control_catalog WHERE control_id = 'TG-ID-007'
UNION ALL
SELECT id, 'Zero Trust', 'Identity', 'Primary', 'User risk assessment' FROM m365_control_catalog WHERE control_id = 'TG-ID-007'
UNION ALL
SELECT id, 'Secure Score', '320', 'Primary', 'User risk policy configuration' FROM m365_control_catalog WHERE control_id = 'TG-ID-007';

-- ============================================================
-- TG-ID-008: Sign-in Risk Policy Enabled
-- Maps to: NIST, ISO, Zero Trust, Secure Score
-- ============================================================
INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'NIST', 'SI-4', 'Primary', 'Anomalous activity monitoring' FROM m365_control_catalog WHERE control_id = 'TG-ID-008'
UNION ALL
SELECT id, 'ISO', 'A.12.4', 'Primary', 'Monitoring' FROM m365_control_catalog WHERE control_id = 'TG-ID-008'
UNION ALL
SELECT id, 'Zero Trust', 'Identity', 'Primary', 'Sign-in risk assessment' FROM m365_control_catalog WHERE control_id = 'TG-ID-008'
UNION ALL
SELECT id, 'Secure Score', '321', 'Primary', 'Sign-in risk policy' FROM m365_control_catalog WHERE control_id = 'TG-ID-008';

-- ============================================================
-- TG-ID-009: Session Timeout Configured
-- Maps to: CIS, NIST, ISO, CMMC
-- ============================================================
INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'CIS', '5.3.2', 'Primary', 'Session timeout settings' FROM m365_control_catalog WHERE control_id = 'TG-ID-009'
UNION ALL
SELECT id, 'NIST', 'AC-12', 'Primary', 'Session termination' FROM m365_control_catalog WHERE control_id = 'TG-ID-009'
UNION ALL
SELECT id, 'ISO', 'A.5.4', 'Primary', 'Access control policies' FROM m365_control_catalog WHERE control_id = 'TG-ID-009'
UNION ALL
SELECT id, 'CMMC', 'AC.L2.1.3', 'Primary', 'Session management' FROM m365_control_catalog WHERE control_id = 'TG-ID-009';

-- ============================================================
-- TG-ID-010: Guest Access Restricted
-- Maps to: CIS, NIST, ISO, Zero Trust
-- ============================================================
INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'CIS', '5.5.1', 'Primary', 'Guest access policies' FROM m365_control_catalog WHERE control_id = 'TG-ID-010'
UNION ALL
SELECT id, 'NIST', 'AC-2', 'Primary', 'Account management' FROM m365_control_catalog WHERE control_id = 'TG-ID-010'
UNION ALL
SELECT id, 'ISO', 'A.5.2', 'Primary', 'User access management' FROM m365_control_catalog WHERE control_id = 'TG-ID-010'
UNION ALL
SELECT id, 'Zero Trust', 'Identity', 'Primary', 'Guest access control' FROM m365_control_catalog WHERE control_id = 'TG-ID-010';

-- ============================================================
-- AUTH Domain Mappings
-- ============================================================

-- TG-AUTH-001: MFA Registration Required
INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'CIS', '5.2.1', 'Secondary', 'MFA enforcement' FROM m365_control_catalog WHERE control_id = 'TG-AUTH-001'
UNION ALL
SELECT id, 'NIST', 'IA-2', 'Primary', 'MFA requirement' FROM m365_control_catalog WHERE control_id = 'TG-AUTH-001'
UNION ALL
SELECT id, 'Secure Score', '104', 'Primary', 'MFA registration' FROM m365_control_catalog WHERE control_id = 'TG-AUTH-001'
UNION ALL
SELECT id, 'Zero Trust', 'Identity', 'Primary', 'Multi-factor authentication' FROM m365_control_catalog WHERE control_id = 'TG-AUTH-001';

-- TG-AUTH-002: Authenticator App Configured
INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'NIST', 'IA-2', 'Primary', 'Multi-factor methods' FROM m365_control_catalog WHERE control_id = 'TG-AUTH-002'
UNION ALL
SELECT id, 'Zero Trust', 'Identity', 'Primary', 'Strong authentication methods' FROM m365_control_catalog WHERE control_id = 'TG-AUTH-002'
UNION ALL
SELECT id, 'Secure Score', '116', 'Primary', 'Authenticator app promotion' FROM m365_control_catalog WHERE control_id = 'TG-AUTH-002';

-- TG-AUTH-003: FIDO2 Security Keys
INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'NIST', 'IA-5', 'Primary', 'Hardware-based authentication' FROM m365_control_catalog WHERE control_id = 'TG-AUTH-003'
UNION ALL
SELECT id, 'ISO', 'A.5.5', 'Primary', 'Authentication mechanisms' FROM m365_control_catalog WHERE control_id = 'TG-AUTH-003'
UNION ALL
SELECT id, 'Zero Trust', 'Identity', 'Primary', 'Phishing-resistant MFA' FROM m365_control_catalog WHERE control_id = 'TG-AUTH-003';

-- TG-AUTH-004: SMS Not Sole MFA
INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'NIST', 'IA-2', 'Secondary', 'MFA method quality' FROM m365_control_catalog WHERE control_id = 'TG-AUTH-004'
UNION ALL
SELECT id, 'Zero Trust', 'Identity', 'Primary', 'Strong authentication methods' FROM m365_control_catalog WHERE control_id = 'TG-AUTH-004';

-- TG-AUTH-005: Self-Service Password Reset
INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, 'CIS', '5.4.1', 'Primary', 'Password management' FROM m365_control_catalog WHERE control_id = 'TG-AUTH-005'
UNION ALL
SELECT id, 'NIST', 'IA-5', 'Secondary', 'Password management' FROM m365_control_catalog WHERE control_id = 'TG-AUTH-005'
UNION ALL
SELECT id, 'Secure Score', '109', 'Primary', 'SSPR configuration' FROM m365_control_catalog WHERE control_id = 'TG-AUTH-005';

-- ============================================================
-- Insert metadata
-- ============================================================
INSERT INTO schema_migrations (version, name) VALUES (2, 'M365-UCC-Identity-Auth-Controls') ON CONFLICT DO NOTHING;
