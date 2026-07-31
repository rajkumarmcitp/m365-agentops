INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-ID-001',
  'MFA Required for Global Administrators',
  'Core identity and access controls - MFA Required for Global Administrators',
  'TG-ID',
  'Authentication',
  'Entra ID',
  'Critical', 10,
  'Automatic',
  'Graph API',
  'Core identity and access controls',
  '/identity/1',
  'isEnabled',
  'true',
  true,
  '["Navigate to Identity Security settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Medium',
  'Critical',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-ID-002',
  'Legacy Authentication Blocked',
  'Core identity and access controls - Legacy Authentication Blocked',
  'TG-ID',
  'Authentication',
  'Entra ID',
  'Critical', 10,
  'Automatic',
  'Graph API',
  'Core identity and access controls',
  '/identity/2',
  'isEnabled',
  'true',
  true,
  '["Navigate to Identity Security settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Medium',
  'Critical',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-ID-003',
  'Conditional Access for Admin Portals',
  'Core identity and access controls - Conditional Access for Admin Portals',
  'TG-ID',
  'Access Control',
  'Entra ID',
  'High', 7,
  'Automatic',
  'Graph API',
  'Core identity and access controls',
  '/identity/3',
  'isEnabled',
  'true',
  true,
  '["Navigate to Identity Security settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Medium',
  'High',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-ID-004',
  'No Permanent Role Assignments',
  'Core identity and access controls - No Permanent Role Assignments',
  'TG-ID',
  'Privileged Access',
  'Entra ID',
  'Critical', 10,
  'Automatic',
  'Graph API',
  'Core identity and access controls',
  '/identity/4',
  'isEnabled',
  'true',
  true,
  '["Navigate to Identity Security settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Medium',
  'Critical',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-ID-005',
  'PIM Approval Required',
  'Core identity and access controls - PIM Approval Required',
  'TG-ID',
  'Privileged Access',
  'Entra ID',
  'High', 7,
  'Automatic',
  'Graph API',
  'Core identity and access controls',
  '/identity/5',
  'isEnabled',
  'true',
  true,
  '["Navigate to Identity Security settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Medium',
  'High',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-ID-006',
  'MFA Required for Global Administrators',
  'Core identity and access controls - MFA Required for Global Administrators',
  'TG-ID',
  'Authentication',
  'Entra ID',
  'Critical', 10,
  'Automatic',
  'Graph API',
  'Core identity and access controls',
  '/identity/6',
  'isEnabled',
  'true',
  true,
  '["Navigate to Identity Security settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Medium',
  'Critical',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-ID-007',
  'Legacy Authentication Blocked',
  'Core identity and access controls - Legacy Authentication Blocked',
  'TG-ID',
  'Authentication',
  'Entra ID',
  'Critical', 10,
  'Automatic',
  'Graph API',
  'Core identity and access controls',
  '/identity/7',
  'isEnabled',
  'true',
  true,
  '["Navigate to Identity Security settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Medium',
  'Critical',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-ID-008',
  'Conditional Access for Admin Portals',
  'Core identity and access controls - Conditional Access for Admin Portals',
  'TG-ID',
  'Access Control',
  'Entra ID',
  'High', 7,
  'Automatic',
  'Graph API',
  'Core identity and access controls',
  '/identity/8',
  'isEnabled',
  'true',
  true,
  '["Navigate to Identity Security settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Medium',
  'High',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-ID-009',
  'No Permanent Role Assignments',
  'Core identity and access controls - No Permanent Role Assignments',
  'TG-ID',
  'Privileged Access',
  'Entra ID',
  'Critical', 10,
  'Automatic',
  'Graph API',
  'Core identity and access controls',
  '/identity/9',
  'isEnabled',
  'true',
  true,
  '["Navigate to Identity Security settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Medium',
  'Critical',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-ID-010',
  'PIM Approval Required',
  'Core identity and access controls - PIM Approval Required',
  'TG-ID',
  'Privileged Access',
  'Entra ID',
  'High', 7,
  'Automatic',
  'Graph API',
  'Core identity and access controls',
  '/identity/10',
  'isEnabled',
  'true',
  true,
  '["Navigate to Identity Security settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Medium',
  'High',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-ID-011',
  'MFA Required for Global Administrators',
  'Core identity and access controls - MFA Required for Global Administrators',
  'TG-ID',
  'Authentication',
  'Entra ID',
  'Critical', 10,
  'Automatic',
  'Graph API',
  'Core identity and access controls',
  '/identity/11',
  'isEnabled',
  'true',
  true,
  '["Navigate to Identity Security settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Medium',
  'Critical',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-ID-012',
  'Legacy Authentication Blocked',
  'Core identity and access controls - Legacy Authentication Blocked',
  'TG-ID',
  'Authentication',
  'Entra ID',
  'Critical', 10,
  'Automatic',
  'Graph API',
  'Core identity and access controls',
  '/identity/12',
  'isEnabled',
  'true',
  true,
  '["Navigate to Identity Security settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Medium',
  'Critical',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-ID-013',
  'Conditional Access for Admin Portals',
  'Core identity and access controls - Conditional Access for Admin Portals',
  'TG-ID',
  'Access Control',
  'Entra ID',
  'High', 7,
  'Automatic',
  'Graph API',
  'Core identity and access controls',
  '/identity/13',
  'isEnabled',
  'true',
  true,
  '["Navigate to Identity Security settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Medium',
  'High',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-ID-014',
  'No Permanent Role Assignments',
  'Core identity and access controls - No Permanent Role Assignments',
  'TG-ID',
  'Privileged Access',
  'Entra ID',
  'Critical', 10,
  'Automatic',
  'Graph API',
  'Core identity and access controls',
  '/identity/14',
  'isEnabled',
  'true',
  true,
  '["Navigate to Identity Security settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Medium',
  'Critical',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-ID-015',
  'PIM Approval Required',
  'Core identity and access controls - PIM Approval Required',
  'TG-ID',
  'Privileged Access',
  'Entra ID',
  'High', 7,
  'Automatic',
  'Graph API',
  'Core identity and access controls',
  '/identity/15',
  'isEnabled',
  'true',
  true,
  '["Navigate to Identity Security settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Medium',
  'High',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-ID-016',
  'MFA Required for Global Administrators',
  'Core identity and access controls - MFA Required for Global Administrators',
  'TG-ID',
  'Authentication',
  'Entra ID',
  'Critical', 10,
  'Automatic',
  'Graph API',
  'Core identity and access controls',
  '/identity/16',
  'isEnabled',
  'true',
  true,
  '["Navigate to Identity Security settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Medium',
  'Critical',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-ID-017',
  'Legacy Authentication Blocked',
  'Core identity and access controls - Legacy Authentication Blocked',
  'TG-ID',
  'Authentication',
  'Entra ID',
  'Critical', 10,
  'Automatic',
  'Graph API',
  'Core identity and access controls',
  '/identity/17',
  'isEnabled',
  'true',
  true,
  '["Navigate to Identity Security settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Medium',
  'Critical',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-ID-018',
  'Conditional Access for Admin Portals',
  'Core identity and access controls - Conditional Access for Admin Portals',
  'TG-ID',
  'Access Control',
  'Entra ID',
  'High', 7,
  'Automatic',
  'Graph API',
  'Core identity and access controls',
  '/identity/18',
  'isEnabled',
  'true',
  true,
  '["Navigate to Identity Security settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Medium',
  'High',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-ID-019',
  'No Permanent Role Assignments',
  'Core identity and access controls - No Permanent Role Assignments',
  'TG-ID',
  'Privileged Access',
  'Entra ID',
  'Critical', 10,
  'Automatic',
  'Graph API',
  'Core identity and access controls',
  '/identity/19',
  'isEnabled',
  'true',
  true,
  '["Navigate to Identity Security settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Medium',
  'Critical',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-ID-020',
  'PIM Approval Required',
  'Core identity and access controls - PIM Approval Required',
  'TG-ID',
  'Privileged Access',
  'Entra ID',
  'High', 7,
  'Automatic',
  'Graph API',
  'Core identity and access controls',
  '/identity/20',
  'isEnabled',
  'true',
  true,
  '["Navigate to Identity Security settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Medium',
  'High',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-ID-021',
  'MFA Required for Global Administrators',
  'Core identity and access controls - MFA Required for Global Administrators',
  'TG-ID',
  'Authentication',
  'Entra ID',
  'Critical', 10,
  'Automatic',
  'Graph API',
  'Core identity and access controls',
  '/identity/21',
  'isEnabled',
  'true',
  true,
  '["Navigate to Identity Security settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Medium',
  'Critical',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-ID-022',
  'Legacy Authentication Blocked',
  'Core identity and access controls - Legacy Authentication Blocked',
  'TG-ID',
  'Authentication',
  'Entra ID',
  'Critical', 10,
  'Automatic',
  'Graph API',
  'Core identity and access controls',
  '/identity/22',
  'isEnabled',
  'true',
  true,
  '["Navigate to Identity Security settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Medium',
  'Critical',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-ID-023',
  'Conditional Access for Admin Portals',
  'Core identity and access controls - Conditional Access for Admin Portals',
  'TG-ID',
  'Access Control',
  'Entra ID',
  'High', 7,
  'Automatic',
  'Graph API',
  'Core identity and access controls',
  '/identity/23',
  'isEnabled',
  'true',
  true,
  '["Navigate to Identity Security settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Medium',
  'High',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-ID-024',
  'No Permanent Role Assignments',
  'Core identity and access controls - No Permanent Role Assignments',
  'TG-ID',
  'Privileged Access',
  'Entra ID',
  'Critical', 10,
  'Automatic',
  'Graph API',
  'Core identity and access controls',
  '/identity/24',
  'isEnabled',
  'true',
  true,
  '["Navigate to Identity Security settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Medium',
  'Critical',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-ID-025',
  'PIM Approval Required',
  'Core identity and access controls - PIM Approval Required',
  'TG-ID',
  'Privileged Access',
  'Entra ID',
  'High', 7,
  'Automatic',
  'Graph API',
  'Core identity and access controls',
  '/identity/25',
  'isEnabled',
  'true',
  true,
  '["Navigate to Identity Security settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Medium',
  'High',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-ID-026',
  'MFA Required for Global Administrators',
  'Core identity and access controls - MFA Required for Global Administrators',
  'TG-ID',
  'Authentication',
  'Entra ID',
  'Critical', 10,
  'Automatic',
  'Graph API',
  'Core identity and access controls',
  '/identity/26',
  'isEnabled',
  'true',
  true,
  '["Navigate to Identity Security settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Medium',
  'Critical',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-ID-027',
  'Legacy Authentication Blocked',
  'Core identity and access controls - Legacy Authentication Blocked',
  'TG-ID',
  'Authentication',
  'Entra ID',
  'Critical', 10,
  'Automatic',
  'Graph API',
  'Core identity and access controls',
  '/identity/27',
  'isEnabled',
  'true',
  true,
  '["Navigate to Identity Security settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Medium',
  'Critical',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-ID-028',
  'Conditional Access for Admin Portals',
  'Core identity and access controls - Conditional Access for Admin Portals',
  'TG-ID',
  'Access Control',
  'Entra ID',
  'High', 7,
  'Automatic',
  'Graph API',
  'Core identity and access controls',
  '/identity/28',
  'isEnabled',
  'true',
  true,
  '["Navigate to Identity Security settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Medium',
  'High',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-ID-029',
  'No Permanent Role Assignments',
  'Core identity and access controls - No Permanent Role Assignments',
  'TG-ID',
  'Privileged Access',
  'Entra ID',
  'Critical', 10,
  'Automatic',
  'Graph API',
  'Core identity and access controls',
  '/identity/29',
  'isEnabled',
  'true',
  true,
  '["Navigate to Identity Security settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Medium',
  'Critical',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-ID-030',
  'PIM Approval Required',
  'Core identity and access controls - PIM Approval Required',
  'TG-ID',
  'Privileged Access',
  'Entra ID',
  'High', 7,
  'Automatic',
  'Graph API',
  'Core identity and access controls',
  '/identity/30',
  'isEnabled',
  'true',
  true,
  '["Navigate to Identity Security settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Medium',
  'High',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-ID-031',
  'MFA Required for Global Administrators',
  'Core identity and access controls - MFA Required for Global Administrators',
  'TG-ID',
  'Authentication',
  'Entra ID',
  'Critical', 10,
  'Automatic',
  'Graph API',
  'Core identity and access controls',
  '/identity/31',
  'isEnabled',
  'true',
  true,
  '["Navigate to Identity Security settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Medium',
  'Critical',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-ID-032',
  'Legacy Authentication Blocked',
  'Core identity and access controls - Legacy Authentication Blocked',
  'TG-ID',
  'Authentication',
  'Entra ID',
  'Critical', 10,
  'Automatic',
  'Graph API',
  'Core identity and access controls',
  '/identity/32',
  'isEnabled',
  'true',
  true,
  '["Navigate to Identity Security settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Medium',
  'Critical',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-ID-033',
  'Conditional Access for Admin Portals',
  'Core identity and access controls - Conditional Access for Admin Portals',
  'TG-ID',
  'Access Control',
  'Entra ID',
  'High', 7,
  'Automatic',
  'Graph API',
  'Core identity and access controls',
  '/identity/33',
  'isEnabled',
  'true',
  true,
  '["Navigate to Identity Security settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Medium',
  'High',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-ID-034',
  'No Permanent Role Assignments',
  'Core identity and access controls - No Permanent Role Assignments',
  'TG-ID',
  'Privileged Access',
  'Entra ID',
  'Critical', 10,
  'Automatic',
  'Graph API',
  'Core identity and access controls',
  '/identity/34',
  'isEnabled',
  'true',
  true,
  '["Navigate to Identity Security settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Medium',
  'Critical',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-ID-035',
  'PIM Approval Required',
  'Core identity and access controls - PIM Approval Required',
  'TG-ID',
  'Privileged Access',
  'Entra ID',
  'High', 7,
  'Automatic',
  'Graph API',
  'Core identity and access controls',
  '/identity/35',
  'isEnabled',
  'true',
  true,
  '["Navigate to Identity Security settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Medium',
  'High',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-ID-036',
  'MFA Required for Global Administrators',
  'Core identity and access controls - MFA Required for Global Administrators',
  'TG-ID',
  'Authentication',
  'Entra ID',
  'Critical', 10,
  'Automatic',
  'Graph API',
  'Core identity and access controls',
  '/identity/36',
  'isEnabled',
  'true',
  true,
  '["Navigate to Identity Security settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Medium',
  'Critical',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-ID-037',
  'Legacy Authentication Blocked',
  'Core identity and access controls - Legacy Authentication Blocked',
  'TG-ID',
  'Authentication',
  'Entra ID',
  'Critical', 10,
  'Automatic',
  'Graph API',
  'Core identity and access controls',
  '/identity/37',
  'isEnabled',
  'true',
  true,
  '["Navigate to Identity Security settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Medium',
  'Critical',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-ID-038',
  'Conditional Access for Admin Portals',
  'Core identity and access controls - Conditional Access for Admin Portals',
  'TG-ID',
  'Access Control',
  'Entra ID',
  'High', 7,
  'Automatic',
  'Graph API',
  'Core identity and access controls',
  '/identity/38',
  'isEnabled',
  'true',
  true,
  '["Navigate to Identity Security settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Medium',
  'High',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-ID-039',
  'No Permanent Role Assignments',
  'Core identity and access controls - No Permanent Role Assignments',
  'TG-ID',
  'Privileged Access',
  'Entra ID',
  'Critical', 10,
  'Automatic',
  'Graph API',
  'Core identity and access controls',
  '/identity/39',
  'isEnabled',
  'true',
  true,
  '["Navigate to Identity Security settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Medium',
  'Critical',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-ID-040',
  'PIM Approval Required',
  'Core identity and access controls - PIM Approval Required',
  'TG-ID',
  'Privileged Access',
  'Entra ID',
  'High', 7,
  'Automatic',
  'Graph API',
  'Core identity and access controls',
  '/identity/40',
  'isEnabled',
  'true',
  true,
  '["Navigate to Identity Security settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Medium',
  'High',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-ID-041',
  'MFA Required for Global Administrators',
  'Core identity and access controls - MFA Required for Global Administrators',
  'TG-ID',
  'Authentication',
  'Entra ID',
  'Critical', 10,
  'Automatic',
  'Graph API',
  'Core identity and access controls',
  '/identity/41',
  'isEnabled',
  'true',
  true,
  '["Navigate to Identity Security settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Medium',
  'Critical',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-ID-042',
  'Legacy Authentication Blocked',
  'Core identity and access controls - Legacy Authentication Blocked',
  'TG-ID',
  'Authentication',
  'Entra ID',
  'Critical', 10,
  'Automatic',
  'Graph API',
  'Core identity and access controls',
  '/identity/42',
  'isEnabled',
  'true',
  true,
  '["Navigate to Identity Security settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Medium',
  'Critical',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-ID-043',
  'Conditional Access for Admin Portals',
  'Core identity and access controls - Conditional Access for Admin Portals',
  'TG-ID',
  'Access Control',
  'Entra ID',
  'High', 7,
  'Automatic',
  'Graph API',
  'Core identity and access controls',
  '/identity/43',
  'isEnabled',
  'true',
  true,
  '["Navigate to Identity Security settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Medium',
  'High',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-ID-044',
  'No Permanent Role Assignments',
  'Core identity and access controls - No Permanent Role Assignments',
  'TG-ID',
  'Privileged Access',
  'Entra ID',
  'Critical', 10,
  'Automatic',
  'Graph API',
  'Core identity and access controls',
  '/identity/44',
  'isEnabled',
  'true',
  true,
  '["Navigate to Identity Security settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Medium',
  'Critical',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-ID-045',
  'PIM Approval Required',
  'Core identity and access controls - PIM Approval Required',
  'TG-ID',
  'Privileged Access',
  'Entra ID',
  'High', 7,
  'Automatic',
  'Graph API',
  'Core identity and access controls',
  '/identity/45',
  'isEnabled',
  'true',
  true,
  '["Navigate to Identity Security settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Medium',
  'High',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-ID-046',
  'MFA Required for Global Administrators',
  'Core identity and access controls - MFA Required for Global Administrators',
  'TG-ID',
  'Authentication',
  'Entra ID',
  'Critical', 10,
  'Automatic',
  'Graph API',
  'Core identity and access controls',
  '/identity/46',
  'isEnabled',
  'true',
  true,
  '["Navigate to Identity Security settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Medium',
  'Critical',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-ID-047',
  'Legacy Authentication Blocked',
  'Core identity and access controls - Legacy Authentication Blocked',
  'TG-ID',
  'Authentication',
  'Entra ID',
  'Critical', 10,
  'Automatic',
  'Graph API',
  'Core identity and access controls',
  '/identity/47',
  'isEnabled',
  'true',
  true,
  '["Navigate to Identity Security settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Medium',
  'Critical',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-ID-048',
  'Conditional Access for Admin Portals',
  'Core identity and access controls - Conditional Access for Admin Portals',
  'TG-ID',
  'Access Control',
  'Entra ID',
  'High', 7,
  'Automatic',
  'Graph API',
  'Core identity and access controls',
  '/identity/48',
  'isEnabled',
  'true',
  true,
  '["Navigate to Identity Security settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Medium',
  'High',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-ID-049',
  'No Permanent Role Assignments',
  'Core identity and access controls - No Permanent Role Assignments',
  'TG-ID',
  'Privileged Access',
  'Entra ID',
  'Critical', 10,
  'Automatic',
  'Graph API',
  'Core identity and access controls',
  '/identity/49',
  'isEnabled',
  'true',
  true,
  '["Navigate to Identity Security settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Medium',
  'Critical',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-ID-050',
  'PIM Approval Required',
  'Core identity and access controls - PIM Approval Required',
  'TG-ID',
  'Privileged Access',
  'Entra ID',
  'High', 7,
  'Automatic',
  'Graph API',
  'Core identity and access controls',
  '/identity/50',
  'isEnabled',
  'true',
  true,
  '["Navigate to Identity Security settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Medium',
  'High',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-ID-051',
  'MFA Required for Global Administrators',
  'Core identity and access controls - MFA Required for Global Administrators',
  'TG-ID',
  'Authentication',
  'Entra ID',
  'Critical', 10,
  'Automatic',
  'Graph API',
  'Core identity and access controls',
  '/identity/51',
  'isEnabled',
  'true',
  true,
  '["Navigate to Identity Security settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Medium',
  'Critical',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-ID-052',
  'Legacy Authentication Blocked',
  'Core identity and access controls - Legacy Authentication Blocked',
  'TG-ID',
  'Authentication',
  'Entra ID',
  'Critical', 10,
  'Automatic',
  'Graph API',
  'Core identity and access controls',
  '/identity/52',
  'isEnabled',
  'true',
  true,
  '["Navigate to Identity Security settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Medium',
  'Critical',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-ID-053',
  'Conditional Access for Admin Portals',
  'Core identity and access controls - Conditional Access for Admin Portals',
  'TG-ID',
  'Access Control',
  'Entra ID',
  'High', 7,
  'Automatic',
  'Graph API',
  'Core identity and access controls',
  '/identity/53',
  'isEnabled',
  'true',
  true,
  '["Navigate to Identity Security settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Medium',
  'High',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-ID-054',
  'No Permanent Role Assignments',
  'Core identity and access controls - No Permanent Role Assignments',
  'TG-ID',
  'Privileged Access',
  'Entra ID',
  'Critical', 10,
  'Automatic',
  'Graph API',
  'Core identity and access controls',
  '/identity/54',
  'isEnabled',
  'true',
  true,
  '["Navigate to Identity Security settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Medium',
  'Critical',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-ID-055',
  'PIM Approval Required',
  'Core identity and access controls - PIM Approval Required',
  'TG-ID',
  'Privileged Access',
  'Entra ID',
  'High', 7,
  'Automatic',
  'Graph API',
  'Core identity and access controls',
  '/identity/55',
  'isEnabled',
  'true',
  true,
  '["Navigate to Identity Security settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Medium',
  'High',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-ID-056',
  'MFA Required for Global Administrators',
  'Core identity and access controls - MFA Required for Global Administrators',
  'TG-ID',
  'Authentication',
  'Entra ID',
  'Critical', 10,
  'Automatic',
  'Graph API',
  'Core identity and access controls',
  '/identity/56',
  'isEnabled',
  'true',
  true,
  '["Navigate to Identity Security settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Medium',
  'Critical',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-ID-057',
  'Legacy Authentication Blocked',
  'Core identity and access controls - Legacy Authentication Blocked',
  'TG-ID',
  'Authentication',
  'Entra ID',
  'Critical', 10,
  'Automatic',
  'Graph API',
  'Core identity and access controls',
  '/identity/57',
  'isEnabled',
  'true',
  true,
  '["Navigate to Identity Security settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Medium',
  'Critical',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-ID-058',
  'Conditional Access for Admin Portals',
  'Core identity and access controls - Conditional Access for Admin Portals',
  'TG-ID',
  'Access Control',
  'Entra ID',
  'High', 7,
  'Automatic',
  'Graph API',
  'Core identity and access controls',
  '/identity/58',
  'isEnabled',
  'true',
  true,
  '["Navigate to Identity Security settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Medium',
  'High',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-ID-059',
  'No Permanent Role Assignments',
  'Core identity and access controls - No Permanent Role Assignments',
  'TG-ID',
  'Privileged Access',
  'Entra ID',
  'Critical', 10,
  'Automatic',
  'Graph API',
  'Core identity and access controls',
  '/identity/59',
  'isEnabled',
  'true',
  true,
  '["Navigate to Identity Security settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Medium',
  'Critical',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-ID-060',
  'PIM Approval Required',
  'Core identity and access controls - PIM Approval Required',
  'TG-ID',
  'Privileged Access',
  'Entra ID',
  'High', 7,
  'Automatic',
  'Graph API',
  'Core identity and access controls',
  '/identity/60',
  'isEnabled',
  'true',
  true,
  '["Navigate to Identity Security settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Medium',
  'High',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-ID-061',
  'MFA Required for Global Administrators',
  'Core identity and access controls - MFA Required for Global Administrators',
  'TG-ID',
  'Authentication',
  'Entra ID',
  'Critical', 10,
  'Automatic',
  'Graph API',
  'Core identity and access controls',
  '/identity/61',
  'isEnabled',
  'true',
  true,
  '["Navigate to Identity Security settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Medium',
  'Critical',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-ID-062',
  'Legacy Authentication Blocked',
  'Core identity and access controls - Legacy Authentication Blocked',
  'TG-ID',
  'Authentication',
  'Entra ID',
  'Critical', 10,
  'Automatic',
  'Graph API',
  'Core identity and access controls',
  '/identity/62',
  'isEnabled',
  'true',
  true,
  '["Navigate to Identity Security settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Medium',
  'Critical',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-ID-063',
  'Conditional Access for Admin Portals',
  'Core identity and access controls - Conditional Access for Admin Portals',
  'TG-ID',
  'Access Control',
  'Entra ID',
  'High', 7,
  'Automatic',
  'Graph API',
  'Core identity and access controls',
  '/identity/63',
  'isEnabled',
  'true',
  true,
  '["Navigate to Identity Security settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Medium',
  'High',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-ID-064',
  'No Permanent Role Assignments',
  'Core identity and access controls - No Permanent Role Assignments',
  'TG-ID',
  'Privileged Access',
  'Entra ID',
  'Critical', 10,
  'Automatic',
  'Graph API',
  'Core identity and access controls',
  '/identity/64',
  'isEnabled',
  'true',
  true,
  '["Navigate to Identity Security settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Medium',
  'Critical',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-ID-065',
  'PIM Approval Required',
  'Core identity and access controls - PIM Approval Required',
  'TG-ID',
  'Privileged Access',
  'Entra ID',
  'High', 7,
  'Automatic',
  'Graph API',
  'Core identity and access controls',
  '/identity/65',
  'isEnabled',
  'true',
  true,
  '["Navigate to Identity Security settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Medium',
  'High',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-ID-066',
  'MFA Required for Global Administrators',
  'Core identity and access controls - MFA Required for Global Administrators',
  'TG-ID',
  'Authentication',
  'Entra ID',
  'Critical', 10,
  'Automatic',
  'Graph API',
  'Core identity and access controls',
  '/identity/66',
  'isEnabled',
  'true',
  true,
  '["Navigate to Identity Security settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Medium',
  'Critical',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-ID-067',
  'Legacy Authentication Blocked',
  'Core identity and access controls - Legacy Authentication Blocked',
  'TG-ID',
  'Authentication',
  'Entra ID',
  'Critical', 10,
  'Automatic',
  'Graph API',
  'Core identity and access controls',
  '/identity/67',
  'isEnabled',
  'true',
  true,
  '["Navigate to Identity Security settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Medium',
  'Critical',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-ID-068',
  'Conditional Access for Admin Portals',
  'Core identity and access controls - Conditional Access for Admin Portals',
  'TG-ID',
  'Access Control',
  'Entra ID',
  'High', 7,
  'Automatic',
  'Graph API',
  'Core identity and access controls',
  '/identity/68',
  'isEnabled',
  'true',
  true,
  '["Navigate to Identity Security settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Medium',
  'High',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-ID-069',
  'No Permanent Role Assignments',
  'Core identity and access controls - No Permanent Role Assignments',
  'TG-ID',
  'Privileged Access',
  'Entra ID',
  'Critical', 10,
  'Automatic',
  'Graph API',
  'Core identity and access controls',
  '/identity/69',
  'isEnabled',
  'true',
  true,
  '["Navigate to Identity Security settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Medium',
  'Critical',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-ID-070',
  'PIM Approval Required',
  'Core identity and access controls - PIM Approval Required',
  'TG-ID',
  'Privileged Access',
  'Entra ID',
  'High', 7,
  'Automatic',
  'Graph API',
  'Core identity and access controls',
  '/identity/70',
  'isEnabled',
  'true',
  true,
  '["Navigate to Identity Security settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Medium',
  'High',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-AUTH-001',
  'MFA Registration Required for Users',
  'MFA, password policy, and auth methods - MFA Registration Required for Users',
  'TG-AUTH',
  'MFA Policy',
  'Entra ID',
  'Critical', 10,
  'Automatic',
  'Graph API',
  'MFA, password policy, and auth methods',
  '/policies/authenticationMethodsPolicy/1',
  'isEnabled',
  'true',
  true,
  '["Navigate to Authentication & MFA settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Medium',
  'Critical',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-AUTH-002',
  'Microsoft Authenticator App Enabled',
  'MFA, password policy, and auth methods - Microsoft Authenticator App Enabled',
  'TG-AUTH',
  'MFA Methods',
  'Entra ID',
  'Critical', 10,
  'Automatic',
  'Graph API',
  'MFA, password policy, and auth methods',
  '/policies/authenticationMethodsPolicy/2',
  'isEnabled',
  'true',
  true,
  '["Navigate to Authentication & MFA settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Medium',
  'Critical',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-AUTH-003',
  'FIDO2 Security Keys Supported',
  'MFA, password policy, and auth methods - FIDO2 Security Keys Supported',
  'TG-AUTH',
  'MFA Methods',
  'Entra ID',
  'High', 7,
  'Automatic',
  'Graph API',
  'MFA, password policy, and auth methods',
  '/policies/authenticationMethodsPolicy/3',
  'isEnabled',
  'true',
  true,
  '["Navigate to Authentication & MFA settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Medium',
  'High',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-AUTH-004',
  'MFA Registration Required for Users',
  'MFA, password policy, and auth methods - MFA Registration Required for Users',
  'TG-AUTH',
  'MFA Policy',
  'Entra ID',
  'Critical', 10,
  'Automatic',
  'Graph API',
  'MFA, password policy, and auth methods',
  '/policies/authenticationMethodsPolicy/4',
  'isEnabled',
  'true',
  true,
  '["Navigate to Authentication & MFA settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Medium',
  'Critical',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-AUTH-005',
  'Microsoft Authenticator App Enabled',
  'MFA, password policy, and auth methods - Microsoft Authenticator App Enabled',
  'TG-AUTH',
  'MFA Methods',
  'Entra ID',
  'Critical', 10,
  'Automatic',
  'Graph API',
  'MFA, password policy, and auth methods',
  '/policies/authenticationMethodsPolicy/5',
  'isEnabled',
  'true',
  true,
  '["Navigate to Authentication & MFA settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Medium',
  'Critical',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-AUTH-006',
  'FIDO2 Security Keys Supported',
  'MFA, password policy, and auth methods - FIDO2 Security Keys Supported',
  'TG-AUTH',
  'MFA Methods',
  'Entra ID',
  'High', 7,
  'Automatic',
  'Graph API',
  'MFA, password policy, and auth methods',
  '/policies/authenticationMethodsPolicy/6',
  'isEnabled',
  'true',
  true,
  '["Navigate to Authentication & MFA settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Medium',
  'High',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-AUTH-007',
  'MFA Registration Required for Users',
  'MFA, password policy, and auth methods - MFA Registration Required for Users',
  'TG-AUTH',
  'MFA Policy',
  'Entra ID',
  'Critical', 10,
  'Automatic',
  'Graph API',
  'MFA, password policy, and auth methods',
  '/policies/authenticationMethodsPolicy/7',
  'isEnabled',
  'true',
  true,
  '["Navigate to Authentication & MFA settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Medium',
  'Critical',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-AUTH-008',
  'Microsoft Authenticator App Enabled',
  'MFA, password policy, and auth methods - Microsoft Authenticator App Enabled',
  'TG-AUTH',
  'MFA Methods',
  'Entra ID',
  'Critical', 10,
  'Automatic',
  'Graph API',
  'MFA, password policy, and auth methods',
  '/policies/authenticationMethodsPolicy/8',
  'isEnabled',
  'true',
  true,
  '["Navigate to Authentication & MFA settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Medium',
  'Critical',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-AUTH-009',
  'FIDO2 Security Keys Supported',
  'MFA, password policy, and auth methods - FIDO2 Security Keys Supported',
  'TG-AUTH',
  'MFA Methods',
  'Entra ID',
  'High', 7,
  'Automatic',
  'Graph API',
  'MFA, password policy, and auth methods',
  '/policies/authenticationMethodsPolicy/9',
  'isEnabled',
  'true',
  true,
  '["Navigate to Authentication & MFA settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Medium',
  'High',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-AUTH-010',
  'MFA Registration Required for Users',
  'MFA, password policy, and auth methods - MFA Registration Required for Users',
  'TG-AUTH',
  'MFA Policy',
  'Entra ID',
  'Critical', 10,
  'Automatic',
  'Graph API',
  'MFA, password policy, and auth methods',
  '/policies/authenticationMethodsPolicy/10',
  'isEnabled',
  'true',
  true,
  '["Navigate to Authentication & MFA settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Medium',
  'Critical',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-AUTH-011',
  'Microsoft Authenticator App Enabled',
  'MFA, password policy, and auth methods - Microsoft Authenticator App Enabled',
  'TG-AUTH',
  'MFA Methods',
  'Entra ID',
  'Critical', 10,
  'Automatic',
  'Graph API',
  'MFA, password policy, and auth methods',
  '/policies/authenticationMethodsPolicy/11',
  'isEnabled',
  'true',
  true,
  '["Navigate to Authentication & MFA settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Medium',
  'Critical',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-AUTH-012',
  'FIDO2 Security Keys Supported',
  'MFA, password policy, and auth methods - FIDO2 Security Keys Supported',
  'TG-AUTH',
  'MFA Methods',
  'Entra ID',
  'High', 7,
  'Automatic',
  'Graph API',
  'MFA, password policy, and auth methods',
  '/policies/authenticationMethodsPolicy/12',
  'isEnabled',
  'true',
  true,
  '["Navigate to Authentication & MFA settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Medium',
  'High',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-AUTH-013',
  'MFA Registration Required for Users',
  'MFA, password policy, and auth methods - MFA Registration Required for Users',
  'TG-AUTH',
  'MFA Policy',
  'Entra ID',
  'Critical', 10,
  'Automatic',
  'Graph API',
  'MFA, password policy, and auth methods',
  '/policies/authenticationMethodsPolicy/13',
  'isEnabled',
  'true',
  true,
  '["Navigate to Authentication & MFA settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Medium',
  'Critical',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-AUTH-014',
  'Microsoft Authenticator App Enabled',
  'MFA, password policy, and auth methods - Microsoft Authenticator App Enabled',
  'TG-AUTH',
  'MFA Methods',
  'Entra ID',
  'Critical', 10,
  'Automatic',
  'Graph API',
  'MFA, password policy, and auth methods',
  '/policies/authenticationMethodsPolicy/14',
  'isEnabled',
  'true',
  true,
  '["Navigate to Authentication & MFA settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Medium',
  'Critical',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-AUTH-015',
  'FIDO2 Security Keys Supported',
  'MFA, password policy, and auth methods - FIDO2 Security Keys Supported',
  'TG-AUTH',
  'MFA Methods',
  'Entra ID',
  'High', 7,
  'Automatic',
  'Graph API',
  'MFA, password policy, and auth methods',
  '/policies/authenticationMethodsPolicy/15',
  'isEnabled',
  'true',
  true,
  '["Navigate to Authentication & MFA settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Medium',
  'High',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-AUTH-016',
  'MFA Registration Required for Users',
  'MFA, password policy, and auth methods - MFA Registration Required for Users',
  'TG-AUTH',
  'MFA Policy',
  'Entra ID',
  'Critical', 10,
  'Automatic',
  'Graph API',
  'MFA, password policy, and auth methods',
  '/policies/authenticationMethodsPolicy/16',
  'isEnabled',
  'true',
  true,
  '["Navigate to Authentication & MFA settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Medium',
  'Critical',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-AUTH-017',
  'Microsoft Authenticator App Enabled',
  'MFA, password policy, and auth methods - Microsoft Authenticator App Enabled',
  'TG-AUTH',
  'MFA Methods',
  'Entra ID',
  'Critical', 10,
  'Automatic',
  'Graph API',
  'MFA, password policy, and auth methods',
  '/policies/authenticationMethodsPolicy/17',
  'isEnabled',
  'true',
  true,
  '["Navigate to Authentication & MFA settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Medium',
  'Critical',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-AUTH-018',
  'FIDO2 Security Keys Supported',
  'MFA, password policy, and auth methods - FIDO2 Security Keys Supported',
  'TG-AUTH',
  'MFA Methods',
  'Entra ID',
  'High', 7,
  'Automatic',
  'Graph API',
  'MFA, password policy, and auth methods',
  '/policies/authenticationMethodsPolicy/18',
  'isEnabled',
  'true',
  true,
  '["Navigate to Authentication & MFA settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Medium',
  'High',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-AUTH-019',
  'MFA Registration Required for Users',
  'MFA, password policy, and auth methods - MFA Registration Required for Users',
  'TG-AUTH',
  'MFA Policy',
  'Entra ID',
  'Critical', 10,
  'Automatic',
  'Graph API',
  'MFA, password policy, and auth methods',
  '/policies/authenticationMethodsPolicy/19',
  'isEnabled',
  'true',
  true,
  '["Navigate to Authentication & MFA settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Medium',
  'Critical',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-AUTH-020',
  'Microsoft Authenticator App Enabled',
  'MFA, password policy, and auth methods - Microsoft Authenticator App Enabled',
  'TG-AUTH',
  'MFA Methods',
  'Entra ID',
  'Critical', 10,
  'Automatic',
  'Graph API',
  'MFA, password policy, and auth methods',
  '/policies/authenticationMethodsPolicy/20',
  'isEnabled',
  'true',
  true,
  '["Navigate to Authentication & MFA settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Medium',
  'Critical',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-AUTH-021',
  'FIDO2 Security Keys Supported',
  'MFA, password policy, and auth methods - FIDO2 Security Keys Supported',
  'TG-AUTH',
  'MFA Methods',
  'Entra ID',
  'High', 7,
  'Automatic',
  'Graph API',
  'MFA, password policy, and auth methods',
  '/policies/authenticationMethodsPolicy/21',
  'isEnabled',
  'true',
  true,
  '["Navigate to Authentication & MFA settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Medium',
  'High',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-AUTH-022',
  'MFA Registration Required for Users',
  'MFA, password policy, and auth methods - MFA Registration Required for Users',
  'TG-AUTH',
  'MFA Policy',
  'Entra ID',
  'Critical', 10,
  'Automatic',
  'Graph API',
  'MFA, password policy, and auth methods',
  '/policies/authenticationMethodsPolicy/22',
  'isEnabled',
  'true',
  true,
  '["Navigate to Authentication & MFA settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Medium',
  'Critical',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-AUTH-023',
  'Microsoft Authenticator App Enabled',
  'MFA, password policy, and auth methods - Microsoft Authenticator App Enabled',
  'TG-AUTH',
  'MFA Methods',
  'Entra ID',
  'Critical', 10,
  'Automatic',
  'Graph API',
  'MFA, password policy, and auth methods',
  '/policies/authenticationMethodsPolicy/23',
  'isEnabled',
  'true',
  true,
  '["Navigate to Authentication & MFA settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Medium',
  'Critical',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-AUTH-024',
  'FIDO2 Security Keys Supported',
  'MFA, password policy, and auth methods - FIDO2 Security Keys Supported',
  'TG-AUTH',
  'MFA Methods',
  'Entra ID',
  'High', 7,
  'Automatic',
  'Graph API',
  'MFA, password policy, and auth methods',
  '/policies/authenticationMethodsPolicy/24',
  'isEnabled',
  'true',
  true,
  '["Navigate to Authentication & MFA settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Medium',
  'High',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-AUTH-025',
  'MFA Registration Required for Users',
  'MFA, password policy, and auth methods - MFA Registration Required for Users',
  'TG-AUTH',
  'MFA Policy',
  'Entra ID',
  'Critical', 10,
  'Automatic',
  'Graph API',
  'MFA, password policy, and auth methods',
  '/policies/authenticationMethodsPolicy/25',
  'isEnabled',
  'true',
  true,
  '["Navigate to Authentication & MFA settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Medium',
  'Critical',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-AUTH-026',
  'Microsoft Authenticator App Enabled',
  'MFA, password policy, and auth methods - Microsoft Authenticator App Enabled',
  'TG-AUTH',
  'MFA Methods',
  'Entra ID',
  'Critical', 10,
  'Automatic',
  'Graph API',
  'MFA, password policy, and auth methods',
  '/policies/authenticationMethodsPolicy/26',
  'isEnabled',
  'true',
  true,
  '["Navigate to Authentication & MFA settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Medium',
  'Critical',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-AUTH-027',
  'FIDO2 Security Keys Supported',
  'MFA, password policy, and auth methods - FIDO2 Security Keys Supported',
  'TG-AUTH',
  'MFA Methods',
  'Entra ID',
  'High', 7,
  'Automatic',
  'Graph API',
  'MFA, password policy, and auth methods',
  '/policies/authenticationMethodsPolicy/27',
  'isEnabled',
  'true',
  true,
  '["Navigate to Authentication & MFA settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Medium',
  'High',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-AUTH-028',
  'MFA Registration Required for Users',
  'MFA, password policy, and auth methods - MFA Registration Required for Users',
  'TG-AUTH',
  'MFA Policy',
  'Entra ID',
  'Critical', 10,
  'Automatic',
  'Graph API',
  'MFA, password policy, and auth methods',
  '/policies/authenticationMethodsPolicy/28',
  'isEnabled',
  'true',
  true,
  '["Navigate to Authentication & MFA settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Medium',
  'Critical',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-AUTH-029',
  'Microsoft Authenticator App Enabled',
  'MFA, password policy, and auth methods - Microsoft Authenticator App Enabled',
  'TG-AUTH',
  'MFA Methods',
  'Entra ID',
  'Critical', 10,
  'Automatic',
  'Graph API',
  'MFA, password policy, and auth methods',
  '/policies/authenticationMethodsPolicy/29',
  'isEnabled',
  'true',
  true,
  '["Navigate to Authentication & MFA settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Medium',
  'Critical',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-AUTH-030',
  'FIDO2 Security Keys Supported',
  'MFA, password policy, and auth methods - FIDO2 Security Keys Supported',
  'TG-AUTH',
  'MFA Methods',
  'Entra ID',
  'High', 7,
  'Automatic',
  'Graph API',
  'MFA, password policy, and auth methods',
  '/policies/authenticationMethodsPolicy/30',
  'isEnabled',
  'true',
  true,
  '["Navigate to Authentication & MFA settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Medium',
  'High',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-AUTH-031',
  'MFA Registration Required for Users',
  'MFA, password policy, and auth methods - MFA Registration Required for Users',
  'TG-AUTH',
  'MFA Policy',
  'Entra ID',
  'Critical', 10,
  'Automatic',
  'Graph API',
  'MFA, password policy, and auth methods',
  '/policies/authenticationMethodsPolicy/31',
  'isEnabled',
  'true',
  true,
  '["Navigate to Authentication & MFA settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Medium',
  'Critical',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-AUTH-032',
  'Microsoft Authenticator App Enabled',
  'MFA, password policy, and auth methods - Microsoft Authenticator App Enabled',
  'TG-AUTH',
  'MFA Methods',
  'Entra ID',
  'Critical', 10,
  'Automatic',
  'Graph API',
  'MFA, password policy, and auth methods',
  '/policies/authenticationMethodsPolicy/32',
  'isEnabled',
  'true',
  true,
  '["Navigate to Authentication & MFA settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Medium',
  'Critical',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-AUTH-033',
  'FIDO2 Security Keys Supported',
  'MFA, password policy, and auth methods - FIDO2 Security Keys Supported',
  'TG-AUTH',
  'MFA Methods',
  'Entra ID',
  'High', 7,
  'Automatic',
  'Graph API',
  'MFA, password policy, and auth methods',
  '/policies/authenticationMethodsPolicy/33',
  'isEnabled',
  'true',
  true,
  '["Navigate to Authentication & MFA settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Medium',
  'High',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-AUTH-034',
  'MFA Registration Required for Users',
  'MFA, password policy, and auth methods - MFA Registration Required for Users',
  'TG-AUTH',
  'MFA Policy',
  'Entra ID',
  'Critical', 10,
  'Automatic',
  'Graph API',
  'MFA, password policy, and auth methods',
  '/policies/authenticationMethodsPolicy/34',
  'isEnabled',
  'true',
  true,
  '["Navigate to Authentication & MFA settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Medium',
  'Critical',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-AUTH-035',
  'Microsoft Authenticator App Enabled',
  'MFA, password policy, and auth methods - Microsoft Authenticator App Enabled',
  'TG-AUTH',
  'MFA Methods',
  'Entra ID',
  'Critical', 10,
  'Automatic',
  'Graph API',
  'MFA, password policy, and auth methods',
  '/policies/authenticationMethodsPolicy/35',
  'isEnabled',
  'true',
  true,
  '["Navigate to Authentication & MFA settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Medium',
  'Critical',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-CA-001',
  'MFA Required for High Risk',
  'Risk-based access policies - MFA Required for High Risk',
  'TG-CA',
  'Risk Policy',
  'Entra ID',
  'High', 7,
  'Automatic',
  'Graph API',
  'Risk-based access policies',
  '/identity/conditionalAccess/1',
  'isEnabled',
  'true',
  true,
  '["Navigate to Conditional Access settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Medium',
  'High',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-CA-002',
  'Device Compliance Required',
  'Risk-based access policies - Device Compliance Required',
  'TG-CA',
  'Device Policy',
  'Entra ID',
  'High', 7,
  'Automatic',
  'Graph API',
  'Risk-based access policies',
  '/identity/conditionalAccess/2',
  'isEnabled',
  'true',
  true,
  '["Navigate to Conditional Access settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Medium',
  'High',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-CA-003',
  'Block Unsupported Client Apps',
  'Risk-based access policies - Block Unsupported Client Apps',
  'TG-CA',
  'Client Policy',
  'Entra ID',
  'Medium', 4,
  'Automatic',
  'Graph API',
  'Risk-based access policies',
  '/identity/conditionalAccess/3',
  'isEnabled',
  'true',
  false,
  '["Navigate to Conditional Access settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Low',
  'High',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-CA-004',
  'MFA Required for High Risk',
  'Risk-based access policies - MFA Required for High Risk',
  'TG-CA',
  'Risk Policy',
  'Entra ID',
  'High', 7,
  'Automatic',
  'Graph API',
  'Risk-based access policies',
  '/identity/conditionalAccess/4',
  'isEnabled',
  'true',
  true,
  '["Navigate to Conditional Access settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Medium',
  'High',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-CA-005',
  'Device Compliance Required',
  'Risk-based access policies - Device Compliance Required',
  'TG-CA',
  'Device Policy',
  'Entra ID',
  'High', 7,
  'Automatic',
  'Graph API',
  'Risk-based access policies',
  '/identity/conditionalAccess/5',
  'isEnabled',
  'true',
  true,
  '["Navigate to Conditional Access settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Medium',
  'High',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-CA-006',
  'Block Unsupported Client Apps',
  'Risk-based access policies - Block Unsupported Client Apps',
  'TG-CA',
  'Client Policy',
  'Entra ID',
  'Medium', 4,
  'Automatic',
  'Graph API',
  'Risk-based access policies',
  '/identity/conditionalAccess/6',
  'isEnabled',
  'true',
  false,
  '["Navigate to Conditional Access settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Low',
  'High',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-CA-007',
  'MFA Required for High Risk',
  'Risk-based access policies - MFA Required for High Risk',
  'TG-CA',
  'Risk Policy',
  'Entra ID',
  'High', 7,
  'Automatic',
  'Graph API',
  'Risk-based access policies',
  '/identity/conditionalAccess/7',
  'isEnabled',
  'true',
  true,
  '["Navigate to Conditional Access settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Medium',
  'High',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-CA-008',
  'Device Compliance Required',
  'Risk-based access policies - Device Compliance Required',
  'TG-CA',
  'Device Policy',
  'Entra ID',
  'High', 7,
  'Automatic',
  'Graph API',
  'Risk-based access policies',
  '/identity/conditionalAccess/8',
  'isEnabled',
  'true',
  true,
  '["Navigate to Conditional Access settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Medium',
  'High',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-CA-009',
  'Block Unsupported Client Apps',
  'Risk-based access policies - Block Unsupported Client Apps',
  'TG-CA',
  'Client Policy',
  'Entra ID',
  'Medium', 4,
  'Automatic',
  'Graph API',
  'Risk-based access policies',
  '/identity/conditionalAccess/9',
  'isEnabled',
  'true',
  false,
  '["Navigate to Conditional Access settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Low',
  'High',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-CA-010',
  'MFA Required for High Risk',
  'Risk-based access policies - MFA Required for High Risk',
  'TG-CA',
  'Risk Policy',
  'Entra ID',
  'High', 7,
  'Automatic',
  'Graph API',
  'Risk-based access policies',
  '/identity/conditionalAccess/10',
  'isEnabled',
  'true',
  true,
  '["Navigate to Conditional Access settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Medium',
  'High',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-CA-011',
  'Device Compliance Required',
  'Risk-based access policies - Device Compliance Required',
  'TG-CA',
  'Device Policy',
  'Entra ID',
  'High', 7,
  'Automatic',
  'Graph API',
  'Risk-based access policies',
  '/identity/conditionalAccess/11',
  'isEnabled',
  'true',
  true,
  '["Navigate to Conditional Access settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Medium',
  'High',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-CA-012',
  'Block Unsupported Client Apps',
  'Risk-based access policies - Block Unsupported Client Apps',
  'TG-CA',
  'Client Policy',
  'Entra ID',
  'Medium', 4,
  'Automatic',
  'Graph API',
  'Risk-based access policies',
  '/identity/conditionalAccess/12',
  'isEnabled',
  'true',
  false,
  '["Navigate to Conditional Access settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Low',
  'High',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-CA-013',
  'MFA Required for High Risk',
  'Risk-based access policies - MFA Required for High Risk',
  'TG-CA',
  'Risk Policy',
  'Entra ID',
  'High', 7,
  'Automatic',
  'Graph API',
  'Risk-based access policies',
  '/identity/conditionalAccess/13',
  'isEnabled',
  'true',
  true,
  '["Navigate to Conditional Access settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Medium',
  'High',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-CA-014',
  'Device Compliance Required',
  'Risk-based access policies - Device Compliance Required',
  'TG-CA',
  'Device Policy',
  'Entra ID',
  'High', 7,
  'Automatic',
  'Graph API',
  'Risk-based access policies',
  '/identity/conditionalAccess/14',
  'isEnabled',
  'true',
  true,
  '["Navigate to Conditional Access settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Medium',
  'High',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-CA-015',
  'Block Unsupported Client Apps',
  'Risk-based access policies - Block Unsupported Client Apps',
  'TG-CA',
  'Client Policy',
  'Entra ID',
  'Medium', 4,
  'Automatic',
  'Graph API',
  'Risk-based access policies',
  '/identity/conditionalAccess/15',
  'isEnabled',
  'true',
  false,
  '["Navigate to Conditional Access settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Low',
  'High',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-CA-016',
  'MFA Required for High Risk',
  'Risk-based access policies - MFA Required for High Risk',
  'TG-CA',
  'Risk Policy',
  'Entra ID',
  'High', 7,
  'Automatic',
  'Graph API',
  'Risk-based access policies',
  '/identity/conditionalAccess/16',
  'isEnabled',
  'true',
  true,
  '["Navigate to Conditional Access settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Medium',
  'High',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-CA-017',
  'Device Compliance Required',
  'Risk-based access policies - Device Compliance Required',
  'TG-CA',
  'Device Policy',
  'Entra ID',
  'High', 7,
  'Automatic',
  'Graph API',
  'Risk-based access policies',
  '/identity/conditionalAccess/17',
  'isEnabled',
  'true',
  true,
  '["Navigate to Conditional Access settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Medium',
  'High',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-CA-018',
  'Block Unsupported Client Apps',
  'Risk-based access policies - Block Unsupported Client Apps',
  'TG-CA',
  'Client Policy',
  'Entra ID',
  'Medium', 4,
  'Automatic',
  'Graph API',
  'Risk-based access policies',
  '/identity/conditionalAccess/18',
  'isEnabled',
  'true',
  false,
  '["Navigate to Conditional Access settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Low',
  'High',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-CA-019',
  'MFA Required for High Risk',
  'Risk-based access policies - MFA Required for High Risk',
  'TG-CA',
  'Risk Policy',
  'Entra ID',
  'High', 7,
  'Automatic',
  'Graph API',
  'Risk-based access policies',
  '/identity/conditionalAccess/19',
  'isEnabled',
  'true',
  true,
  '["Navigate to Conditional Access settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Medium',
  'High',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-CA-020',
  'Device Compliance Required',
  'Risk-based access policies - Device Compliance Required',
  'TG-CA',
  'Device Policy',
  'Entra ID',
  'High', 7,
  'Automatic',
  'Graph API',
  'Risk-based access policies',
  '/identity/conditionalAccess/20',
  'isEnabled',
  'true',
  true,
  '["Navigate to Conditional Access settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Medium',
  'High',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-CA-021',
  'Block Unsupported Client Apps',
  'Risk-based access policies - Block Unsupported Client Apps',
  'TG-CA',
  'Client Policy',
  'Entra ID',
  'Medium', 4,
  'Automatic',
  'Graph API',
  'Risk-based access policies',
  '/identity/conditionalAccess/21',
  'isEnabled',
  'true',
  false,
  '["Navigate to Conditional Access settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Low',
  'High',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-CA-022',
  'MFA Required for High Risk',
  'Risk-based access policies - MFA Required for High Risk',
  'TG-CA',
  'Risk Policy',
  'Entra ID',
  'High', 7,
  'Automatic',
  'Graph API',
  'Risk-based access policies',
  '/identity/conditionalAccess/22',
  'isEnabled',
  'true',
  true,
  '["Navigate to Conditional Access settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Medium',
  'High',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-CA-023',
  'Device Compliance Required',
  'Risk-based access policies - Device Compliance Required',
  'TG-CA',
  'Device Policy',
  'Entra ID',
  'High', 7,
  'Automatic',
  'Graph API',
  'Risk-based access policies',
  '/identity/conditionalAccess/23',
  'isEnabled',
  'true',
  true,
  '["Navigate to Conditional Access settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Medium',
  'High',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-CA-024',
  'Block Unsupported Client Apps',
  'Risk-based access policies - Block Unsupported Client Apps',
  'TG-CA',
  'Client Policy',
  'Entra ID',
  'Medium', 4,
  'Automatic',
  'Graph API',
  'Risk-based access policies',
  '/identity/conditionalAccess/24',
  'isEnabled',
  'true',
  false,
  '["Navigate to Conditional Access settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Low',
  'High',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-CA-025',
  'MFA Required for High Risk',
  'Risk-based access policies - MFA Required for High Risk',
  'TG-CA',
  'Risk Policy',
  'Entra ID',
  'High', 7,
  'Automatic',
  'Graph API',
  'Risk-based access policies',
  '/identity/conditionalAccess/25',
  'isEnabled',
  'true',
  true,
  '["Navigate to Conditional Access settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Medium',
  'High',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-CA-026',
  'Device Compliance Required',
  'Risk-based access policies - Device Compliance Required',
  'TG-CA',
  'Device Policy',
  'Entra ID',
  'High', 7,
  'Automatic',
  'Graph API',
  'Risk-based access policies',
  '/identity/conditionalAccess/26',
  'isEnabled',
  'true',
  true,
  '["Navigate to Conditional Access settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Medium',
  'High',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-CA-027',
  'Block Unsupported Client Apps',
  'Risk-based access policies - Block Unsupported Client Apps',
  'TG-CA',
  'Client Policy',
  'Entra ID',
  'Medium', 4,
  'Automatic',
  'Graph API',
  'Risk-based access policies',
  '/identity/conditionalAccess/27',
  'isEnabled',
  'true',
  false,
  '["Navigate to Conditional Access settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Low',
  'High',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-CA-028',
  'MFA Required for High Risk',
  'Risk-based access policies - MFA Required for High Risk',
  'TG-CA',
  'Risk Policy',
  'Entra ID',
  'High', 7,
  'Automatic',
  'Graph API',
  'Risk-based access policies',
  '/identity/conditionalAccess/28',
  'isEnabled',
  'true',
  true,
  '["Navigate to Conditional Access settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Medium',
  'High',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-CA-029',
  'Device Compliance Required',
  'Risk-based access policies - Device Compliance Required',
  'TG-CA',
  'Device Policy',
  'Entra ID',
  'High', 7,
  'Automatic',
  'Graph API',
  'Risk-based access policies',
  '/identity/conditionalAccess/29',
  'isEnabled',
  'true',
  true,
  '["Navigate to Conditional Access settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Medium',
  'High',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-CA-030',
  'Block Unsupported Client Apps',
  'Risk-based access policies - Block Unsupported Client Apps',
  'TG-CA',
  'Client Policy',
  'Entra ID',
  'Medium', 4,
  'Automatic',
  'Graph API',
  'Risk-based access policies',
  '/identity/conditionalAccess/30',
  'isEnabled',
  'true',
  false,
  '["Navigate to Conditional Access settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Low',
  'High',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-CA-031',
  'MFA Required for High Risk',
  'Risk-based access policies - MFA Required for High Risk',
  'TG-CA',
  'Risk Policy',
  'Entra ID',
  'High', 7,
  'Automatic',
  'Graph API',
  'Risk-based access policies',
  '/identity/conditionalAccess/31',
  'isEnabled',
  'true',
  true,
  '["Navigate to Conditional Access settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Medium',
  'High',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-CA-032',
  'Device Compliance Required',
  'Risk-based access policies - Device Compliance Required',
  'TG-CA',
  'Device Policy',
  'Entra ID',
  'High', 7,
  'Automatic',
  'Graph API',
  'Risk-based access policies',
  '/identity/conditionalAccess/32',
  'isEnabled',
  'true',
  true,
  '["Navigate to Conditional Access settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Medium',
  'High',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-CA-033',
  'Block Unsupported Client Apps',
  'Risk-based access policies - Block Unsupported Client Apps',
  'TG-CA',
  'Client Policy',
  'Entra ID',
  'Medium', 4,
  'Automatic',
  'Graph API',
  'Risk-based access policies',
  '/identity/conditionalAccess/33',
  'isEnabled',
  'true',
  false,
  '["Navigate to Conditional Access settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Low',
  'High',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-CA-034',
  'MFA Required for High Risk',
  'Risk-based access policies - MFA Required for High Risk',
  'TG-CA',
  'Risk Policy',
  'Entra ID',
  'High', 7,
  'Automatic',
  'Graph API',
  'Risk-based access policies',
  '/identity/conditionalAccess/34',
  'isEnabled',
  'true',
  true,
  '["Navigate to Conditional Access settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Medium',
  'High',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-CA-035',
  'Device Compliance Required',
  'Risk-based access policies - Device Compliance Required',
  'TG-CA',
  'Device Policy',
  'Entra ID',
  'High', 7,
  'Automatic',
  'Graph API',
  'Risk-based access policies',
  '/identity/conditionalAccess/35',
  'isEnabled',
  'true',
  true,
  '["Navigate to Conditional Access settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Medium',
  'High',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-CA-036',
  'Block Unsupported Client Apps',
  'Risk-based access policies - Block Unsupported Client Apps',
  'TG-CA',
  'Client Policy',
  'Entra ID',
  'Medium', 4,
  'Automatic',
  'Graph API',
  'Risk-based access policies',
  '/identity/conditionalAccess/36',
  'isEnabled',
  'true',
  false,
  '["Navigate to Conditional Access settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Low',
  'High',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-CA-037',
  'MFA Required for High Risk',
  'Risk-based access policies - MFA Required for High Risk',
  'TG-CA',
  'Risk Policy',
  'Entra ID',
  'High', 7,
  'Automatic',
  'Graph API',
  'Risk-based access policies',
  '/identity/conditionalAccess/37',
  'isEnabled',
  'true',
  true,
  '["Navigate to Conditional Access settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Medium',
  'High',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-CA-038',
  'Device Compliance Required',
  'Risk-based access policies - Device Compliance Required',
  'TG-CA',
  'Device Policy',
  'Entra ID',
  'High', 7,
  'Automatic',
  'Graph API',
  'Risk-based access policies',
  '/identity/conditionalAccess/38',
  'isEnabled',
  'true',
  true,
  '["Navigate to Conditional Access settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Medium',
  'High',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-CA-039',
  'Block Unsupported Client Apps',
  'Risk-based access policies - Block Unsupported Client Apps',
  'TG-CA',
  'Client Policy',
  'Entra ID',
  'Medium', 4,
  'Automatic',
  'Graph API',
  'Risk-based access policies',
  '/identity/conditionalAccess/39',
  'isEnabled',
  'true',
  false,
  '["Navigate to Conditional Access settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Low',
  'High',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-CA-040',
  'MFA Required for High Risk',
  'Risk-based access policies - MFA Required for High Risk',
  'TG-CA',
  'Risk Policy',
  'Entra ID',
  'High', 7,
  'Automatic',
  'Graph API',
  'Risk-based access policies',
  '/identity/conditionalAccess/40',
  'isEnabled',
  'true',
  true,
  '["Navigate to Conditional Access settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Medium',
  'High',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-CA-041',
  'Device Compliance Required',
  'Risk-based access policies - Device Compliance Required',
  'TG-CA',
  'Device Policy',
  'Entra ID',
  'High', 7,
  'Automatic',
  'Graph API',
  'Risk-based access policies',
  '/identity/conditionalAccess/41',
  'isEnabled',
  'true',
  true,
  '["Navigate to Conditional Access settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Medium',
  'High',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-CA-042',
  'Block Unsupported Client Apps',
  'Risk-based access policies - Block Unsupported Client Apps',
  'TG-CA',
  'Client Policy',
  'Entra ID',
  'Medium', 4,
  'Automatic',
  'Graph API',
  'Risk-based access policies',
  '/identity/conditionalAccess/42',
  'isEnabled',
  'true',
  false,
  '["Navigate to Conditional Access settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Low',
  'High',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-CA-043',
  'MFA Required for High Risk',
  'Risk-based access policies - MFA Required for High Risk',
  'TG-CA',
  'Risk Policy',
  'Entra ID',
  'High', 7,
  'Automatic',
  'Graph API',
  'Risk-based access policies',
  '/identity/conditionalAccess/43',
  'isEnabled',
  'true',
  true,
  '["Navigate to Conditional Access settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Medium',
  'High',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-CA-044',
  'Device Compliance Required',
  'Risk-based access policies - Device Compliance Required',
  'TG-CA',
  'Device Policy',
  'Entra ID',
  'High', 7,
  'Automatic',
  'Graph API',
  'Risk-based access policies',
  '/identity/conditionalAccess/44',
  'isEnabled',
  'true',
  true,
  '["Navigate to Conditional Access settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Medium',
  'High',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-CA-045',
  'Block Unsupported Client Apps',
  'Risk-based access policies - Block Unsupported Client Apps',
  'TG-CA',
  'Client Policy',
  'Entra ID',
  'Medium', 4,
  'Automatic',
  'Graph API',
  'Risk-based access policies',
  '/identity/conditionalAccess/45',
  'isEnabled',
  'true',
  false,
  '["Navigate to Conditional Access settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Low',
  'High',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-CA-046',
  'MFA Required for High Risk',
  'Risk-based access policies - MFA Required for High Risk',
  'TG-CA',
  'Risk Policy',
  'Entra ID',
  'High', 7,
  'Automatic',
  'Graph API',
  'Risk-based access policies',
  '/identity/conditionalAccess/46',
  'isEnabled',
  'true',
  true,
  '["Navigate to Conditional Access settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Medium',
  'High',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-CA-047',
  'Device Compliance Required',
  'Risk-based access policies - Device Compliance Required',
  'TG-CA',
  'Device Policy',
  'Entra ID',
  'High', 7,
  'Automatic',
  'Graph API',
  'Risk-based access policies',
  '/identity/conditionalAccess/47',
  'isEnabled',
  'true',
  true,
  '["Navigate to Conditional Access settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Medium',
  'High',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-CA-048',
  'Block Unsupported Client Apps',
  'Risk-based access policies - Block Unsupported Client Apps',
  'TG-CA',
  'Client Policy',
  'Entra ID',
  'Medium', 4,
  'Automatic',
  'Graph API',
  'Risk-based access policies',
  '/identity/conditionalAccess/48',
  'isEnabled',
  'true',
  false,
  '["Navigate to Conditional Access settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Low',
  'High',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-CA-049',
  'MFA Required for High Risk',
  'Risk-based access policies - MFA Required for High Risk',
  'TG-CA',
  'Risk Policy',
  'Entra ID',
  'High', 7,
  'Automatic',
  'Graph API',
  'Risk-based access policies',
  '/identity/conditionalAccess/49',
  'isEnabled',
  'true',
  true,
  '["Navigate to Conditional Access settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Medium',
  'High',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-CA-050',
  'Device Compliance Required',
  'Risk-based access policies - Device Compliance Required',
  'TG-CA',
  'Device Policy',
  'Entra ID',
  'High', 7,
  'Automatic',
  'Graph API',
  'Risk-based access policies',
  '/identity/conditionalAccess/50',
  'isEnabled',
  'true',
  true,
  '["Navigate to Conditional Access settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Medium',
  'High',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-CA-051',
  'Block Unsupported Client Apps',
  'Risk-based access policies - Block Unsupported Client Apps',
  'TG-CA',
  'Client Policy',
  'Entra ID',
  'Medium', 4,
  'Automatic',
  'Graph API',
  'Risk-based access policies',
  '/identity/conditionalAccess/51',
  'isEnabled',
  'true',
  false,
  '["Navigate to Conditional Access settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Low',
  'High',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-CA-052',
  'MFA Required for High Risk',
  'Risk-based access policies - MFA Required for High Risk',
  'TG-CA',
  'Risk Policy',
  'Entra ID',
  'High', 7,
  'Automatic',
  'Graph API',
  'Risk-based access policies',
  '/identity/conditionalAccess/52',
  'isEnabled',
  'true',
  true,
  '["Navigate to Conditional Access settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Medium',
  'High',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-CA-053',
  'Device Compliance Required',
  'Risk-based access policies - Device Compliance Required',
  'TG-CA',
  'Device Policy',
  'Entra ID',
  'High', 7,
  'Automatic',
  'Graph API',
  'Risk-based access policies',
  '/identity/conditionalAccess/53',
  'isEnabled',
  'true',
  true,
  '["Navigate to Conditional Access settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Medium',
  'High',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-CA-054',
  'Block Unsupported Client Apps',
  'Risk-based access policies - Block Unsupported Client Apps',
  'TG-CA',
  'Client Policy',
  'Entra ID',
  'Medium', 4,
  'Automatic',
  'Graph API',
  'Risk-based access policies',
  '/identity/conditionalAccess/54',
  'isEnabled',
  'true',
  false,
  '["Navigate to Conditional Access settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Low',
  'High',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-CA-055',
  'MFA Required for High Risk',
  'Risk-based access policies - MFA Required for High Risk',
  'TG-CA',
  'Risk Policy',
  'Entra ID',
  'High', 7,
  'Automatic',
  'Graph API',
  'Risk-based access policies',
  '/identity/conditionalAccess/55',
  'isEnabled',
  'true',
  true,
  '["Navigate to Conditional Access settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Medium',
  'High',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-CA-056',
  'Device Compliance Required',
  'Risk-based access policies - Device Compliance Required',
  'TG-CA',
  'Device Policy',
  'Entra ID',
  'High', 7,
  'Automatic',
  'Graph API',
  'Risk-based access policies',
  '/identity/conditionalAccess/56',
  'isEnabled',
  'true',
  true,
  '["Navigate to Conditional Access settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Medium',
  'High',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-CA-057',
  'Block Unsupported Client Apps',
  'Risk-based access policies - Block Unsupported Client Apps',
  'TG-CA',
  'Client Policy',
  'Entra ID',
  'Medium', 4,
  'Automatic',
  'Graph API',
  'Risk-based access policies',
  '/identity/conditionalAccess/57',
  'isEnabled',
  'true',
  false,
  '["Navigate to Conditional Access settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Low',
  'High',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-CA-058',
  'MFA Required for High Risk',
  'Risk-based access policies - MFA Required for High Risk',
  'TG-CA',
  'Risk Policy',
  'Entra ID',
  'High', 7,
  'Automatic',
  'Graph API',
  'Risk-based access policies',
  '/identity/conditionalAccess/58',
  'isEnabled',
  'true',
  true,
  '["Navigate to Conditional Access settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Medium',
  'High',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-CA-059',
  'Device Compliance Required',
  'Risk-based access policies - Device Compliance Required',
  'TG-CA',
  'Device Policy',
  'Entra ID',
  'High', 7,
  'Automatic',
  'Graph API',
  'Risk-based access policies',
  '/identity/conditionalAccess/59',
  'isEnabled',
  'true',
  true,
  '["Navigate to Conditional Access settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Medium',
  'High',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-CA-060',
  'Block Unsupported Client Apps',
  'Risk-based access policies - Block Unsupported Client Apps',
  'TG-CA',
  'Client Policy',
  'Entra ID',
  'Medium', 4,
  'Automatic',
  'Graph API',
  'Risk-based access policies',
  '/identity/conditionalAccess/60',
  'isEnabled',
  'true',
  false,
  '["Navigate to Conditional Access settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Low',
  'High',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-APP-001',
  'Application has Verified Publisher',
  'App registration, permissions, credentials - Application has Verified Publisher',
  'TG-APP',
  'Security',
  'Entra ID',
  'High', 7,
  'Automatic',
  'Graph API',
  'App registration, permissions, credentials',
  '/applications/1',
  'isEnabled',
  'true',
  true,
  '["Navigate to Enterprise Applications settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Medium',
  'High',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-APP-002',
  'Application Requires Admin Consent',
  'App registration, permissions, credentials - Application Requires Admin Consent',
  'TG-APP',
  'Permissions',
  'Entra ID',
  'High', 7,
  'Automatic',
  'Graph API',
  'App registration, permissions, credentials',
  '/applications/2',
  'isEnabled',
  'true',
  true,
  '["Navigate to Enterprise Applications settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Medium',
  'High',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-APP-003',
  'Application has Multiple Owners',
  'App registration, permissions, credentials - Application has Multiple Owners',
  'TG-APP',
  'Governance',
  'Entra ID',
  'High', 7,
  'Automatic',
  'Graph API',
  'App registration, permissions, credentials',
  '/applications/3',
  'isEnabled',
  'true',
  true,
  '["Navigate to Enterprise Applications settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Medium',
  'High',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-APP-004',
  'Application has Verified Publisher',
  'App registration, permissions, credentials - Application has Verified Publisher',
  'TG-APP',
  'Security',
  'Entra ID',
  'High', 7,
  'Automatic',
  'Graph API',
  'App registration, permissions, credentials',
  '/applications/4',
  'isEnabled',
  'true',
  true,
  '["Navigate to Enterprise Applications settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Medium',
  'High',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-APP-005',
  'Application Requires Admin Consent',
  'App registration, permissions, credentials - Application Requires Admin Consent',
  'TG-APP',
  'Permissions',
  'Entra ID',
  'High', 7,
  'Automatic',
  'Graph API',
  'App registration, permissions, credentials',
  '/applications/5',
  'isEnabled',
  'true',
  true,
  '["Navigate to Enterprise Applications settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Medium',
  'High',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-APP-006',
  'Application has Multiple Owners',
  'App registration, permissions, credentials - Application has Multiple Owners',
  'TG-APP',
  'Governance',
  'Entra ID',
  'High', 7,
  'Automatic',
  'Graph API',
  'App registration, permissions, credentials',
  '/applications/6',
  'isEnabled',
  'true',
  true,
  '["Navigate to Enterprise Applications settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Medium',
  'High',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-APP-007',
  'Application has Verified Publisher',
  'App registration, permissions, credentials - Application has Verified Publisher',
  'TG-APP',
  'Security',
  'Entra ID',
  'High', 7,
  'Automatic',
  'Graph API',
  'App registration, permissions, credentials',
  '/applications/7',
  'isEnabled',
  'true',
  true,
  '["Navigate to Enterprise Applications settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Medium',
  'High',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-APP-008',
  'Application Requires Admin Consent',
  'App registration, permissions, credentials - Application Requires Admin Consent',
  'TG-APP',
  'Permissions',
  'Entra ID',
  'High', 7,
  'Automatic',
  'Graph API',
  'App registration, permissions, credentials',
  '/applications/8',
  'isEnabled',
  'true',
  true,
  '["Navigate to Enterprise Applications settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Medium',
  'High',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-APP-009',
  'Application has Multiple Owners',
  'App registration, permissions, credentials - Application has Multiple Owners',
  'TG-APP',
  'Governance',
  'Entra ID',
  'High', 7,
  'Automatic',
  'Graph API',
  'App registration, permissions, credentials',
  '/applications/9',
  'isEnabled',
  'true',
  true,
  '["Navigate to Enterprise Applications settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Medium',
  'High',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-APP-010',
  'Application has Verified Publisher',
  'App registration, permissions, credentials - Application has Verified Publisher',
  'TG-APP',
  'Security',
  'Entra ID',
  'High', 7,
  'Automatic',
  'Graph API',
  'App registration, permissions, credentials',
  '/applications/10',
  'isEnabled',
  'true',
  true,
  '["Navigate to Enterprise Applications settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Medium',
  'High',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-APP-011',
  'Application Requires Admin Consent',
  'App registration, permissions, credentials - Application Requires Admin Consent',
  'TG-APP',
  'Permissions',
  'Entra ID',
  'High', 7,
  'Automatic',
  'Graph API',
  'App registration, permissions, credentials',
  '/applications/11',
  'isEnabled',
  'true',
  true,
  '["Navigate to Enterprise Applications settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Medium',
  'High',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-APP-012',
  'Application has Multiple Owners',
  'App registration, permissions, credentials - Application has Multiple Owners',
  'TG-APP',
  'Governance',
  'Entra ID',
  'High', 7,
  'Automatic',
  'Graph API',
  'App registration, permissions, credentials',
  '/applications/12',
  'isEnabled',
  'true',
  true,
  '["Navigate to Enterprise Applications settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Medium',
  'High',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-APP-013',
  'Application has Verified Publisher',
  'App registration, permissions, credentials - Application has Verified Publisher',
  'TG-APP',
  'Security',
  'Entra ID',
  'High', 7,
  'Automatic',
  'Graph API',
  'App registration, permissions, credentials',
  '/applications/13',
  'isEnabled',
  'true',
  true,
  '["Navigate to Enterprise Applications settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Medium',
  'High',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-APP-014',
  'Application Requires Admin Consent',
  'App registration, permissions, credentials - Application Requires Admin Consent',
  'TG-APP',
  'Permissions',
  'Entra ID',
  'High', 7,
  'Automatic',
  'Graph API',
  'App registration, permissions, credentials',
  '/applications/14',
  'isEnabled',
  'true',
  true,
  '["Navigate to Enterprise Applications settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Medium',
  'High',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-APP-015',
  'Application has Multiple Owners',
  'App registration, permissions, credentials - Application has Multiple Owners',
  'TG-APP',
  'Governance',
  'Entra ID',
  'High', 7,
  'Automatic',
  'Graph API',
  'App registration, permissions, credentials',
  '/applications/15',
  'isEnabled',
  'true',
  true,
  '["Navigate to Enterprise Applications settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Medium',
  'High',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-APP-016',
  'Application has Verified Publisher',
  'App registration, permissions, credentials - Application has Verified Publisher',
  'TG-APP',
  'Security',
  'Entra ID',
  'High', 7,
  'Automatic',
  'Graph API',
  'App registration, permissions, credentials',
  '/applications/16',
  'isEnabled',
  'true',
  true,
  '["Navigate to Enterprise Applications settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Medium',
  'High',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-APP-017',
  'Application Requires Admin Consent',
  'App registration, permissions, credentials - Application Requires Admin Consent',
  'TG-APP',
  'Permissions',
  'Entra ID',
  'High', 7,
  'Automatic',
  'Graph API',
  'App registration, permissions, credentials',
  '/applications/17',
  'isEnabled',
  'true',
  true,
  '["Navigate to Enterprise Applications settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Medium',
  'High',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-APP-018',
  'Application has Multiple Owners',
  'App registration, permissions, credentials - Application has Multiple Owners',
  'TG-APP',
  'Governance',
  'Entra ID',
  'High', 7,
  'Automatic',
  'Graph API',
  'App registration, permissions, credentials',
  '/applications/18',
  'isEnabled',
  'true',
  true,
  '["Navigate to Enterprise Applications settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Medium',
  'High',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-APP-019',
  'Application has Verified Publisher',
  'App registration, permissions, credentials - Application has Verified Publisher',
  'TG-APP',
  'Security',
  'Entra ID',
  'High', 7,
  'Automatic',
  'Graph API',
  'App registration, permissions, credentials',
  '/applications/19',
  'isEnabled',
  'true',
  true,
  '["Navigate to Enterprise Applications settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Medium',
  'High',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-APP-020',
  'Application Requires Admin Consent',
  'App registration, permissions, credentials - Application Requires Admin Consent',
  'TG-APP',
  'Permissions',
  'Entra ID',
  'High', 7,
  'Automatic',
  'Graph API',
  'App registration, permissions, credentials',
  '/applications/20',
  'isEnabled',
  'true',
  true,
  '["Navigate to Enterprise Applications settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Medium',
  'High',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-APP-021',
  'Application has Multiple Owners',
  'App registration, permissions, credentials - Application has Multiple Owners',
  'TG-APP',
  'Governance',
  'Entra ID',
  'High', 7,
  'Automatic',
  'Graph API',
  'App registration, permissions, credentials',
  '/applications/21',
  'isEnabled',
  'true',
  true,
  '["Navigate to Enterprise Applications settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Medium',
  'High',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-APP-022',
  'Application has Verified Publisher',
  'App registration, permissions, credentials - Application has Verified Publisher',
  'TG-APP',
  'Security',
  'Entra ID',
  'High', 7,
  'Automatic',
  'Graph API',
  'App registration, permissions, credentials',
  '/applications/22',
  'isEnabled',
  'true',
  true,
  '["Navigate to Enterprise Applications settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Medium',
  'High',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-APP-023',
  'Application Requires Admin Consent',
  'App registration, permissions, credentials - Application Requires Admin Consent',
  'TG-APP',
  'Permissions',
  'Entra ID',
  'High', 7,
  'Automatic',
  'Graph API',
  'App registration, permissions, credentials',
  '/applications/23',
  'isEnabled',
  'true',
  true,
  '["Navigate to Enterprise Applications settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Medium',
  'High',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-APP-024',
  'Application has Multiple Owners',
  'App registration, permissions, credentials - Application has Multiple Owners',
  'TG-APP',
  'Governance',
  'Entra ID',
  'High', 7,
  'Automatic',
  'Graph API',
  'App registration, permissions, credentials',
  '/applications/24',
  'isEnabled',
  'true',
  true,
  '["Navigate to Enterprise Applications settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Medium',
  'High',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-APP-025',
  'Application has Verified Publisher',
  'App registration, permissions, credentials - Application has Verified Publisher',
  'TG-APP',
  'Security',
  'Entra ID',
  'High', 7,
  'Automatic',
  'Graph API',
  'App registration, permissions, credentials',
  '/applications/25',
  'isEnabled',
  'true',
  true,
  '["Navigate to Enterprise Applications settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Medium',
  'High',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-APP-026',
  'Application Requires Admin Consent',
  'App registration, permissions, credentials - Application Requires Admin Consent',
  'TG-APP',
  'Permissions',
  'Entra ID',
  'High', 7,
  'Automatic',
  'Graph API',
  'App registration, permissions, credentials',
  '/applications/26',
  'isEnabled',
  'true',
  true,
  '["Navigate to Enterprise Applications settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Medium',
  'High',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-APP-027',
  'Application has Multiple Owners',
  'App registration, permissions, credentials - Application has Multiple Owners',
  'TG-APP',
  'Governance',
  'Entra ID',
  'High', 7,
  'Automatic',
  'Graph API',
  'App registration, permissions, credentials',
  '/applications/27',
  'isEnabled',
  'true',
  true,
  '["Navigate to Enterprise Applications settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Medium',
  'High',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-APP-028',
  'Application has Verified Publisher',
  'App registration, permissions, credentials - Application has Verified Publisher',
  'TG-APP',
  'Security',
  'Entra ID',
  'High', 7,
  'Automatic',
  'Graph API',
  'App registration, permissions, credentials',
  '/applications/28',
  'isEnabled',
  'true',
  true,
  '["Navigate to Enterprise Applications settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Medium',
  'High',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-APP-029',
  'Application Requires Admin Consent',
  'App registration, permissions, credentials - Application Requires Admin Consent',
  'TG-APP',
  'Permissions',
  'Entra ID',
  'High', 7,
  'Automatic',
  'Graph API',
  'App registration, permissions, credentials',
  '/applications/29',
  'isEnabled',
  'true',
  true,
  '["Navigate to Enterprise Applications settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Medium',
  'High',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-APP-030',
  'Application has Multiple Owners',
  'App registration, permissions, credentials - Application has Multiple Owners',
  'TG-APP',
  'Governance',
  'Entra ID',
  'High', 7,
  'Automatic',
  'Graph API',
  'App registration, permissions, credentials',
  '/applications/30',
  'isEnabled',
  'true',
  true,
  '["Navigate to Enterprise Applications settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Medium',
  'High',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-APP-031',
  'Application has Verified Publisher',
  'App registration, permissions, credentials - Application has Verified Publisher',
  'TG-APP',
  'Security',
  'Entra ID',
  'High', 7,
  'Automatic',
  'Graph API',
  'App registration, permissions, credentials',
  '/applications/31',
  'isEnabled',
  'true',
  true,
  '["Navigate to Enterprise Applications settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Medium',
  'High',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-APP-032',
  'Application Requires Admin Consent',
  'App registration, permissions, credentials - Application Requires Admin Consent',
  'TG-APP',
  'Permissions',
  'Entra ID',
  'High', 7,
  'Automatic',
  'Graph API',
  'App registration, permissions, credentials',
  '/applications/32',
  'isEnabled',
  'true',
  true,
  '["Navigate to Enterprise Applications settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Medium',
  'High',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-APP-033',
  'Application has Multiple Owners',
  'App registration, permissions, credentials - Application has Multiple Owners',
  'TG-APP',
  'Governance',
  'Entra ID',
  'High', 7,
  'Automatic',
  'Graph API',
  'App registration, permissions, credentials',
  '/applications/33',
  'isEnabled',
  'true',
  true,
  '["Navigate to Enterprise Applications settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Medium',
  'High',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-APP-034',
  'Application has Verified Publisher',
  'App registration, permissions, credentials - Application has Verified Publisher',
  'TG-APP',
  'Security',
  'Entra ID',
  'High', 7,
  'Automatic',
  'Graph API',
  'App registration, permissions, credentials',
  '/applications/34',
  'isEnabled',
  'true',
  true,
  '["Navigate to Enterprise Applications settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Medium',
  'High',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-APP-035',
  'Application Requires Admin Consent',
  'App registration, permissions, credentials - Application Requires Admin Consent',
  'TG-APP',
  'Permissions',
  'Entra ID',
  'High', 7,
  'Automatic',
  'Graph API',
  'App registration, permissions, credentials',
  '/applications/35',
  'isEnabled',
  'true',
  true,
  '["Navigate to Enterprise Applications settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Medium',
  'High',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-APP-036',
  'Application has Multiple Owners',
  'App registration, permissions, credentials - Application has Multiple Owners',
  'TG-APP',
  'Governance',
  'Entra ID',
  'High', 7,
  'Automatic',
  'Graph API',
  'App registration, permissions, credentials',
  '/applications/36',
  'isEnabled',
  'true',
  true,
  '["Navigate to Enterprise Applications settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Medium',
  'High',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-APP-037',
  'Application has Verified Publisher',
  'App registration, permissions, credentials - Application has Verified Publisher',
  'TG-APP',
  'Security',
  'Entra ID',
  'High', 7,
  'Automatic',
  'Graph API',
  'App registration, permissions, credentials',
  '/applications/37',
  'isEnabled',
  'true',
  true,
  '["Navigate to Enterprise Applications settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Medium',
  'High',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-APP-038',
  'Application Requires Admin Consent',
  'App registration, permissions, credentials - Application Requires Admin Consent',
  'TG-APP',
  'Permissions',
  'Entra ID',
  'High', 7,
  'Automatic',
  'Graph API',
  'App registration, permissions, credentials',
  '/applications/38',
  'isEnabled',
  'true',
  true,
  '["Navigate to Enterprise Applications settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Medium',
  'High',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-APP-039',
  'Application has Multiple Owners',
  'App registration, permissions, credentials - Application has Multiple Owners',
  'TG-APP',
  'Governance',
  'Entra ID',
  'High', 7,
  'Automatic',
  'Graph API',
  'App registration, permissions, credentials',
  '/applications/39',
  'isEnabled',
  'true',
  true,
  '["Navigate to Enterprise Applications settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Medium',
  'High',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-APP-040',
  'Application has Verified Publisher',
  'App registration, permissions, credentials - Application has Verified Publisher',
  'TG-APP',
  'Security',
  'Entra ID',
  'High', 7,
  'Automatic',
  'Graph API',
  'App registration, permissions, credentials',
  '/applications/40',
  'isEnabled',
  'true',
  true,
  '["Navigate to Enterprise Applications settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Medium',
  'High',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-APP-041',
  'Application Requires Admin Consent',
  'App registration, permissions, credentials - Application Requires Admin Consent',
  'TG-APP',
  'Permissions',
  'Entra ID',
  'High', 7,
  'Automatic',
  'Graph API',
  'App registration, permissions, credentials',
  '/applications/41',
  'isEnabled',
  'true',
  true,
  '["Navigate to Enterprise Applications settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Medium',
  'High',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-APP-042',
  'Application has Multiple Owners',
  'App registration, permissions, credentials - Application has Multiple Owners',
  'TG-APP',
  'Governance',
  'Entra ID',
  'High', 7,
  'Automatic',
  'Graph API',
  'App registration, permissions, credentials',
  '/applications/42',
  'isEnabled',
  'true',
  true,
  '["Navigate to Enterprise Applications settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Medium',
  'High',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-APP-043',
  'Application has Verified Publisher',
  'App registration, permissions, credentials - Application has Verified Publisher',
  'TG-APP',
  'Security',
  'Entra ID',
  'High', 7,
  'Automatic',
  'Graph API',
  'App registration, permissions, credentials',
  '/applications/43',
  'isEnabled',
  'true',
  true,
  '["Navigate to Enterprise Applications settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Medium',
  'High',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-APP-044',
  'Application Requires Admin Consent',
  'App registration, permissions, credentials - Application Requires Admin Consent',
  'TG-APP',
  'Permissions',
  'Entra ID',
  'High', 7,
  'Automatic',
  'Graph API',
  'App registration, permissions, credentials',
  '/applications/44',
  'isEnabled',
  'true',
  true,
  '["Navigate to Enterprise Applications settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Medium',
  'High',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-APP-045',
  'Application has Multiple Owners',
  'App registration, permissions, credentials - Application has Multiple Owners',
  'TG-APP',
  'Governance',
  'Entra ID',
  'High', 7,
  'Automatic',
  'Graph API',
  'App registration, permissions, credentials',
  '/applications/45',
  'isEnabled',
  'true',
  true,
  '["Navigate to Enterprise Applications settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Medium',
  'High',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-APP-046',
  'Application has Verified Publisher',
  'App registration, permissions, credentials - Application has Verified Publisher',
  'TG-APP',
  'Security',
  'Entra ID',
  'High', 7,
  'Automatic',
  'Graph API',
  'App registration, permissions, credentials',
  '/applications/46',
  'isEnabled',
  'true',
  true,
  '["Navigate to Enterprise Applications settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Medium',
  'High',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-APP-047',
  'Application Requires Admin Consent',
  'App registration, permissions, credentials - Application Requires Admin Consent',
  'TG-APP',
  'Permissions',
  'Entra ID',
  'High', 7,
  'Automatic',
  'Graph API',
  'App registration, permissions, credentials',
  '/applications/47',
  'isEnabled',
  'true',
  true,
  '["Navigate to Enterprise Applications settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Medium',
  'High',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-APP-048',
  'Application has Multiple Owners',
  'App registration, permissions, credentials - Application has Multiple Owners',
  'TG-APP',
  'Governance',
  'Entra ID',
  'High', 7,
  'Automatic',
  'Graph API',
  'App registration, permissions, credentials',
  '/applications/48',
  'isEnabled',
  'true',
  true,
  '["Navigate to Enterprise Applications settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Medium',
  'High',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-APP-049',
  'Application has Verified Publisher',
  'App registration, permissions, credentials - Application has Verified Publisher',
  'TG-APP',
  'Security',
  'Entra ID',
  'High', 7,
  'Automatic',
  'Graph API',
  'App registration, permissions, credentials',
  '/applications/49',
  'isEnabled',
  'true',
  true,
  '["Navigate to Enterprise Applications settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Medium',
  'High',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-APP-050',
  'Application Requires Admin Consent',
  'App registration, permissions, credentials - Application Requires Admin Consent',
  'TG-APP',
  'Permissions',
  'Entra ID',
  'High', 7,
  'Automatic',
  'Graph API',
  'App registration, permissions, credentials',
  '/applications/50',
  'isEnabled',
  'true',
  true,
  '["Navigate to Enterprise Applications settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Medium',
  'High',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-APP-051',
  'Application has Multiple Owners',
  'App registration, permissions, credentials - Application has Multiple Owners',
  'TG-APP',
  'Governance',
  'Entra ID',
  'High', 7,
  'Automatic',
  'Graph API',
  'App registration, permissions, credentials',
  '/applications/51',
  'isEnabled',
  'true',
  true,
  '["Navigate to Enterprise Applications settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Medium',
  'High',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-APP-052',
  'Application has Verified Publisher',
  'App registration, permissions, credentials - Application has Verified Publisher',
  'TG-APP',
  'Security',
  'Entra ID',
  'High', 7,
  'Automatic',
  'Graph API',
  'App registration, permissions, credentials',
  '/applications/52',
  'isEnabled',
  'true',
  true,
  '["Navigate to Enterprise Applications settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Medium',
  'High',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-APP-053',
  'Application Requires Admin Consent',
  'App registration, permissions, credentials - Application Requires Admin Consent',
  'TG-APP',
  'Permissions',
  'Entra ID',
  'High', 7,
  'Automatic',
  'Graph API',
  'App registration, permissions, credentials',
  '/applications/53',
  'isEnabled',
  'true',
  true,
  '["Navigate to Enterprise Applications settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Medium',
  'High',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-APP-054',
  'Application has Multiple Owners',
  'App registration, permissions, credentials - Application has Multiple Owners',
  'TG-APP',
  'Governance',
  'Entra ID',
  'High', 7,
  'Automatic',
  'Graph API',
  'App registration, permissions, credentials',
  '/applications/54',
  'isEnabled',
  'true',
  true,
  '["Navigate to Enterprise Applications settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Medium',
  'High',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-APP-055',
  'Application has Verified Publisher',
  'App registration, permissions, credentials - Application has Verified Publisher',
  'TG-APP',
  'Security',
  'Entra ID',
  'High', 7,
  'Automatic',
  'Graph API',
  'App registration, permissions, credentials',
  '/applications/55',
  'isEnabled',
  'true',
  true,
  '["Navigate to Enterprise Applications settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Medium',
  'High',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-APP-056',
  'Application Requires Admin Consent',
  'App registration, permissions, credentials - Application Requires Admin Consent',
  'TG-APP',
  'Permissions',
  'Entra ID',
  'High', 7,
  'Automatic',
  'Graph API',
  'App registration, permissions, credentials',
  '/applications/56',
  'isEnabled',
  'true',
  true,
  '["Navigate to Enterprise Applications settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Medium',
  'High',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-APP-057',
  'Application has Multiple Owners',
  'App registration, permissions, credentials - Application has Multiple Owners',
  'TG-APP',
  'Governance',
  'Entra ID',
  'High', 7,
  'Automatic',
  'Graph API',
  'App registration, permissions, credentials',
  '/applications/57',
  'isEnabled',
  'true',
  true,
  '["Navigate to Enterprise Applications settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Medium',
  'High',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-APP-058',
  'Application has Verified Publisher',
  'App registration, permissions, credentials - Application has Verified Publisher',
  'TG-APP',
  'Security',
  'Entra ID',
  'High', 7,
  'Automatic',
  'Graph API',
  'App registration, permissions, credentials',
  '/applications/58',
  'isEnabled',
  'true',
  true,
  '["Navigate to Enterprise Applications settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Medium',
  'High',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-APP-059',
  'Application Requires Admin Consent',
  'App registration, permissions, credentials - Application Requires Admin Consent',
  'TG-APP',
  'Permissions',
  'Entra ID',
  'High', 7,
  'Automatic',
  'Graph API',
  'App registration, permissions, credentials',
  '/applications/59',
  'isEnabled',
  'true',
  true,
  '["Navigate to Enterprise Applications settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Medium',
  'High',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-APP-060',
  'Application has Multiple Owners',
  'App registration, permissions, credentials - Application has Multiple Owners',
  'TG-APP',
  'Governance',
  'Entra ID',
  'High', 7,
  'Automatic',
  'Graph API',
  'App registration, permissions, credentials',
  '/applications/60',
  'isEnabled',
  'true',
  true,
  '["Navigate to Enterprise Applications settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Medium',
  'High',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-APP-061',
  'Application has Verified Publisher',
  'App registration, permissions, credentials - Application has Verified Publisher',
  'TG-APP',
  'Security',
  'Entra ID',
  'High', 7,
  'Automatic',
  'Graph API',
  'App registration, permissions, credentials',
  '/applications/61',
  'isEnabled',
  'true',
  true,
  '["Navigate to Enterprise Applications settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Medium',
  'High',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-APP-062',
  'Application Requires Admin Consent',
  'App registration, permissions, credentials - Application Requires Admin Consent',
  'TG-APP',
  'Permissions',
  'Entra ID',
  'High', 7,
  'Automatic',
  'Graph API',
  'App registration, permissions, credentials',
  '/applications/62',
  'isEnabled',
  'true',
  true,
  '["Navigate to Enterprise Applications settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Medium',
  'High',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-APP-063',
  'Application has Multiple Owners',
  'App registration, permissions, credentials - Application has Multiple Owners',
  'TG-APP',
  'Governance',
  'Entra ID',
  'High', 7,
  'Automatic',
  'Graph API',
  'App registration, permissions, credentials',
  '/applications/63',
  'isEnabled',
  'true',
  true,
  '["Navigate to Enterprise Applications settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Medium',
  'High',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-APP-064',
  'Application has Verified Publisher',
  'App registration, permissions, credentials - Application has Verified Publisher',
  'TG-APP',
  'Security',
  'Entra ID',
  'High', 7,
  'Automatic',
  'Graph API',
  'App registration, permissions, credentials',
  '/applications/64',
  'isEnabled',
  'true',
  true,
  '["Navigate to Enterprise Applications settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Medium',
  'High',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-APP-065',
  'Application Requires Admin Consent',
  'App registration, permissions, credentials - Application Requires Admin Consent',
  'TG-APP',
  'Permissions',
  'Entra ID',
  'High', 7,
  'Automatic',
  'Graph API',
  'App registration, permissions, credentials',
  '/applications/65',
  'isEnabled',
  'true',
  true,
  '["Navigate to Enterprise Applications settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Medium',
  'High',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-APP-066',
  'Application has Multiple Owners',
  'App registration, permissions, credentials - Application has Multiple Owners',
  'TG-APP',
  'Governance',
  'Entra ID',
  'High', 7,
  'Automatic',
  'Graph API',
  'App registration, permissions, credentials',
  '/applications/66',
  'isEnabled',
  'true',
  true,
  '["Navigate to Enterprise Applications settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Medium',
  'High',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-APP-067',
  'Application has Verified Publisher',
  'App registration, permissions, credentials - Application has Verified Publisher',
  'TG-APP',
  'Security',
  'Entra ID',
  'High', 7,
  'Automatic',
  'Graph API',
  'App registration, permissions, credentials',
  '/applications/67',
  'isEnabled',
  'true',
  true,
  '["Navigate to Enterprise Applications settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Medium',
  'High',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-APP-068',
  'Application Requires Admin Consent',
  'App registration, permissions, credentials - Application Requires Admin Consent',
  'TG-APP',
  'Permissions',
  'Entra ID',
  'High', 7,
  'Automatic',
  'Graph API',
  'App registration, permissions, credentials',
  '/applications/68',
  'isEnabled',
  'true',
  true,
  '["Navigate to Enterprise Applications settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Medium',
  'High',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-APP-069',
  'Application has Multiple Owners',
  'App registration, permissions, credentials - Application has Multiple Owners',
  'TG-APP',
  'Governance',
  'Entra ID',
  'High', 7,
  'Automatic',
  'Graph API',
  'App registration, permissions, credentials',
  '/applications/69',
  'isEnabled',
  'true',
  true,
  '["Navigate to Enterprise Applications settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Medium',
  'High',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-APP-070',
  'Application has Verified Publisher',
  'App registration, permissions, credentials - Application has Verified Publisher',
  'TG-APP',
  'Security',
  'Entra ID',
  'High', 7,
  'Automatic',
  'Graph API',
  'App registration, permissions, credentials',
  '/applications/70',
  'isEnabled',
  'true',
  true,
  '["Navigate to Enterprise Applications settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Medium',
  'High',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-APP-071',
  'Application Requires Admin Consent',
  'App registration, permissions, credentials - Application Requires Admin Consent',
  'TG-APP',
  'Permissions',
  'Entra ID',
  'High', 7,
  'Automatic',
  'Graph API',
  'App registration, permissions, credentials',
  '/applications/71',
  'isEnabled',
  'true',
  true,
  '["Navigate to Enterprise Applications settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Medium',
  'High',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-APP-072',
  'Application has Multiple Owners',
  'App registration, permissions, credentials - Application has Multiple Owners',
  'TG-APP',
  'Governance',
  'Entra ID',
  'High', 7,
  'Automatic',
  'Graph API',
  'App registration, permissions, credentials',
  '/applications/72',
  'isEnabled',
  'true',
  true,
  '["Navigate to Enterprise Applications settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Medium',
  'High',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-APP-073',
  'Application has Verified Publisher',
  'App registration, permissions, credentials - Application has Verified Publisher',
  'TG-APP',
  'Security',
  'Entra ID',
  'High', 7,
  'Automatic',
  'Graph API',
  'App registration, permissions, credentials',
  '/applications/73',
  'isEnabled',
  'true',
  true,
  '["Navigate to Enterprise Applications settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Medium',
  'High',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-APP-074',
  'Application Requires Admin Consent',
  'App registration, permissions, credentials - Application Requires Admin Consent',
  'TG-APP',
  'Permissions',
  'Entra ID',
  'High', 7,
  'Automatic',
  'Graph API',
  'App registration, permissions, credentials',
  '/applications/74',
  'isEnabled',
  'true',
  true,
  '["Navigate to Enterprise Applications settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Medium',
  'High',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-APP-075',
  'Application has Multiple Owners',
  'App registration, permissions, credentials - Application has Multiple Owners',
  'TG-APP',
  'Governance',
  'Entra ID',
  'High', 7,
  'Automatic',
  'Graph API',
  'App registration, permissions, credentials',
  '/applications/75',
  'isEnabled',
  'true',
  true,
  '["Navigate to Enterprise Applications settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Medium',
  'High',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-APP-076',
  'Application has Verified Publisher',
  'App registration, permissions, credentials - Application has Verified Publisher',
  'TG-APP',
  'Security',
  'Entra ID',
  'High', 7,
  'Automatic',
  'Graph API',
  'App registration, permissions, credentials',
  '/applications/76',
  'isEnabled',
  'true',
  true,
  '["Navigate to Enterprise Applications settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Medium',
  'High',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-APP-077',
  'Application Requires Admin Consent',
  'App registration, permissions, credentials - Application Requires Admin Consent',
  'TG-APP',
  'Permissions',
  'Entra ID',
  'High', 7,
  'Automatic',
  'Graph API',
  'App registration, permissions, credentials',
  '/applications/77',
  'isEnabled',
  'true',
  true,
  '["Navigate to Enterprise Applications settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Medium',
  'High',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-APP-078',
  'Application has Multiple Owners',
  'App registration, permissions, credentials - Application has Multiple Owners',
  'TG-APP',
  'Governance',
  'Entra ID',
  'High', 7,
  'Automatic',
  'Graph API',
  'App registration, permissions, credentials',
  '/applications/78',
  'isEnabled',
  'true',
  true,
  '["Navigate to Enterprise Applications settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Medium',
  'High',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-APP-079',
  'Application has Verified Publisher',
  'App registration, permissions, credentials - Application has Verified Publisher',
  'TG-APP',
  'Security',
  'Entra ID',
  'High', 7,
  'Automatic',
  'Graph API',
  'App registration, permissions, credentials',
  '/applications/79',
  'isEnabled',
  'true',
  true,
  '["Navigate to Enterprise Applications settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Medium',
  'High',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-APP-080',
  'Application Requires Admin Consent',
  'App registration, permissions, credentials - Application Requires Admin Consent',
  'TG-APP',
  'Permissions',
  'Entra ID',
  'High', 7,
  'Automatic',
  'Graph API',
  'App registration, permissions, credentials',
  '/applications/80',
  'isEnabled',
  'true',
  true,
  '["Navigate to Enterprise Applications settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Medium',
  'High',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-ROLE-001',
  'Privileged Admin Roles Reviewed',
  'PIM and privileged role management - Privileged Admin Roles Reviewed',
  'TG-ROLE',
  'Access Review',
  'Entra ID',
  'High', 7,
  'Automatic',
  'Graph API',
  'PIM and privileged role management',
  '/roleManagement/1',
  'isEnabled',
  'true',
  true,
  '["Navigate to Privileged Access settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Medium',
  'High',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-ROLE-002',
  'Service Accounts Monitored',
  'PIM and privileged role management - Service Accounts Monitored',
  'TG-ROLE',
  'Service Account',
  'Entra ID',
  'Medium', 4,
  'Automatic',
  'Graph API',
  'PIM and privileged role management',
  '/roleManagement/2',
  'isEnabled',
  'true',
  false,
  '["Navigate to Privileged Access settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Low',
  'High',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-ROLE-003',
  'Privileged Admin Roles Reviewed',
  'PIM and privileged role management - Privileged Admin Roles Reviewed',
  'TG-ROLE',
  'Access Review',
  'Entra ID',
  'High', 7,
  'Automatic',
  'Graph API',
  'PIM and privileged role management',
  '/roleManagement/3',
  'isEnabled',
  'true',
  true,
  '["Navigate to Privileged Access settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Medium',
  'High',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-ROLE-004',
  'Service Accounts Monitored',
  'PIM and privileged role management - Service Accounts Monitored',
  'TG-ROLE',
  'Service Account',
  'Entra ID',
  'Medium', 4,
  'Automatic',
  'Graph API',
  'PIM and privileged role management',
  '/roleManagement/4',
  'isEnabled',
  'true',
  false,
  '["Navigate to Privileged Access settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Low',
  'High',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-ROLE-005',
  'Privileged Admin Roles Reviewed',
  'PIM and privileged role management - Privileged Admin Roles Reviewed',
  'TG-ROLE',
  'Access Review',
  'Entra ID',
  'High', 7,
  'Automatic',
  'Graph API',
  'PIM and privileged role management',
  '/roleManagement/5',
  'isEnabled',
  'true',
  true,
  '["Navigate to Privileged Access settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Medium',
  'High',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-ROLE-006',
  'Service Accounts Monitored',
  'PIM and privileged role management - Service Accounts Monitored',
  'TG-ROLE',
  'Service Account',
  'Entra ID',
  'Medium', 4,
  'Automatic',
  'Graph API',
  'PIM and privileged role management',
  '/roleManagement/6',
  'isEnabled',
  'true',
  false,
  '["Navigate to Privileged Access settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Low',
  'High',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-ROLE-007',
  'Privileged Admin Roles Reviewed',
  'PIM and privileged role management - Privileged Admin Roles Reviewed',
  'TG-ROLE',
  'Access Review',
  'Entra ID',
  'High', 7,
  'Automatic',
  'Graph API',
  'PIM and privileged role management',
  '/roleManagement/7',
  'isEnabled',
  'true',
  true,
  '["Navigate to Privileged Access settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Medium',
  'High',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-ROLE-008',
  'Service Accounts Monitored',
  'PIM and privileged role management - Service Accounts Monitored',
  'TG-ROLE',
  'Service Account',
  'Entra ID',
  'Medium', 4,
  'Automatic',
  'Graph API',
  'PIM and privileged role management',
  '/roleManagement/8',
  'isEnabled',
  'true',
  false,
  '["Navigate to Privileged Access settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Low',
  'High',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-ROLE-009',
  'Privileged Admin Roles Reviewed',
  'PIM and privileged role management - Privileged Admin Roles Reviewed',
  'TG-ROLE',
  'Access Review',
  'Entra ID',
  'High', 7,
  'Automatic',
  'Graph API',
  'PIM and privileged role management',
  '/roleManagement/9',
  'isEnabled',
  'true',
  true,
  '["Navigate to Privileged Access settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Medium',
  'High',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-ROLE-010',
  'Service Accounts Monitored',
  'PIM and privileged role management - Service Accounts Monitored',
  'TG-ROLE',
  'Service Account',
  'Entra ID',
  'Medium', 4,
  'Automatic',
  'Graph API',
  'PIM and privileged role management',
  '/roleManagement/10',
  'isEnabled',
  'true',
  false,
  '["Navigate to Privileged Access settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Low',
  'High',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-ROLE-011',
  'Privileged Admin Roles Reviewed',
  'PIM and privileged role management - Privileged Admin Roles Reviewed',
  'TG-ROLE',
  'Access Review',
  'Entra ID',
  'High', 7,
  'Automatic',
  'Graph API',
  'PIM and privileged role management',
  '/roleManagement/11',
  'isEnabled',
  'true',
  true,
  '["Navigate to Privileged Access settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Medium',
  'High',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-ROLE-012',
  'Service Accounts Monitored',
  'PIM and privileged role management - Service Accounts Monitored',
  'TG-ROLE',
  'Service Account',
  'Entra ID',
  'Medium', 4,
  'Automatic',
  'Graph API',
  'PIM and privileged role management',
  '/roleManagement/12',
  'isEnabled',
  'true',
  false,
  '["Navigate to Privileged Access settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Low',
  'High',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-ROLE-013',
  'Privileged Admin Roles Reviewed',
  'PIM and privileged role management - Privileged Admin Roles Reviewed',
  'TG-ROLE',
  'Access Review',
  'Entra ID',
  'High', 7,
  'Automatic',
  'Graph API',
  'PIM and privileged role management',
  '/roleManagement/13',
  'isEnabled',
  'true',
  true,
  '["Navigate to Privileged Access settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Medium',
  'High',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-ROLE-014',
  'Service Accounts Monitored',
  'PIM and privileged role management - Service Accounts Monitored',
  'TG-ROLE',
  'Service Account',
  'Entra ID',
  'Medium', 4,
  'Automatic',
  'Graph API',
  'PIM and privileged role management',
  '/roleManagement/14',
  'isEnabled',
  'true',
  false,
  '["Navigate to Privileged Access settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Low',
  'High',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-ROLE-015',
  'Privileged Admin Roles Reviewed',
  'PIM and privileged role management - Privileged Admin Roles Reviewed',
  'TG-ROLE',
  'Access Review',
  'Entra ID',
  'High', 7,
  'Automatic',
  'Graph API',
  'PIM and privileged role management',
  '/roleManagement/15',
  'isEnabled',
  'true',
  true,
  '["Navigate to Privileged Access settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Medium',
  'High',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-ROLE-016',
  'Service Accounts Monitored',
  'PIM and privileged role management - Service Accounts Monitored',
  'TG-ROLE',
  'Service Account',
  'Entra ID',
  'Medium', 4,
  'Automatic',
  'Graph API',
  'PIM and privileged role management',
  '/roleManagement/16',
  'isEnabled',
  'true',
  false,
  '["Navigate to Privileged Access settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Low',
  'High',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-ROLE-017',
  'Privileged Admin Roles Reviewed',
  'PIM and privileged role management - Privileged Admin Roles Reviewed',
  'TG-ROLE',
  'Access Review',
  'Entra ID',
  'High', 7,
  'Automatic',
  'Graph API',
  'PIM and privileged role management',
  '/roleManagement/17',
  'isEnabled',
  'true',
  true,
  '["Navigate to Privileged Access settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Medium',
  'High',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-ROLE-018',
  'Service Accounts Monitored',
  'PIM and privileged role management - Service Accounts Monitored',
  'TG-ROLE',
  'Service Account',
  'Entra ID',
  'Medium', 4,
  'Automatic',
  'Graph API',
  'PIM and privileged role management',
  '/roleManagement/18',
  'isEnabled',
  'true',
  false,
  '["Navigate to Privileged Access settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Low',
  'High',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-ROLE-019',
  'Privileged Admin Roles Reviewed',
  'PIM and privileged role management - Privileged Admin Roles Reviewed',
  'TG-ROLE',
  'Access Review',
  'Entra ID',
  'High', 7,
  'Automatic',
  'Graph API',
  'PIM and privileged role management',
  '/roleManagement/19',
  'isEnabled',
  'true',
  true,
  '["Navigate to Privileged Access settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Medium',
  'High',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-ROLE-020',
  'Service Accounts Monitored',
  'PIM and privileged role management - Service Accounts Monitored',
  'TG-ROLE',
  'Service Account',
  'Entra ID',
  'Medium', 4,
  'Automatic',
  'Graph API',
  'PIM and privileged role management',
  '/roleManagement/20',
  'isEnabled',
  'true',
  false,
  '["Navigate to Privileged Access settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Low',
  'High',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-ROLE-021',
  'Privileged Admin Roles Reviewed',
  'PIM and privileged role management - Privileged Admin Roles Reviewed',
  'TG-ROLE',
  'Access Review',
  'Entra ID',
  'High', 7,
  'Automatic',
  'Graph API',
  'PIM and privileged role management',
  '/roleManagement/21',
  'isEnabled',
  'true',
  true,
  '["Navigate to Privileged Access settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Medium',
  'High',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-ROLE-022',
  'Service Accounts Monitored',
  'PIM and privileged role management - Service Accounts Monitored',
  'TG-ROLE',
  'Service Account',
  'Entra ID',
  'Medium', 4,
  'Automatic',
  'Graph API',
  'PIM and privileged role management',
  '/roleManagement/22',
  'isEnabled',
  'true',
  false,
  '["Navigate to Privileged Access settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Low',
  'High',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-ROLE-023',
  'Privileged Admin Roles Reviewed',
  'PIM and privileged role management - Privileged Admin Roles Reviewed',
  'TG-ROLE',
  'Access Review',
  'Entra ID',
  'High', 7,
  'Automatic',
  'Graph API',
  'PIM and privileged role management',
  '/roleManagement/23',
  'isEnabled',
  'true',
  true,
  '["Navigate to Privileged Access settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Medium',
  'High',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-ROLE-024',
  'Service Accounts Monitored',
  'PIM and privileged role management - Service Accounts Monitored',
  'TG-ROLE',
  'Service Account',
  'Entra ID',
  'Medium', 4,
  'Automatic',
  'Graph API',
  'PIM and privileged role management',
  '/roleManagement/24',
  'isEnabled',
  'true',
  false,
  '["Navigate to Privileged Access settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Low',
  'High',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-ROLE-025',
  'Privileged Admin Roles Reviewed',
  'PIM and privileged role management - Privileged Admin Roles Reviewed',
  'TG-ROLE',
  'Access Review',
  'Entra ID',
  'High', 7,
  'Automatic',
  'Graph API',
  'PIM and privileged role management',
  '/roleManagement/25',
  'isEnabled',
  'true',
  true,
  '["Navigate to Privileged Access settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Medium',
  'High',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-ROLE-026',
  'Service Accounts Monitored',
  'PIM and privileged role management - Service Accounts Monitored',
  'TG-ROLE',
  'Service Account',
  'Entra ID',
  'Medium', 4,
  'Automatic',
  'Graph API',
  'PIM and privileged role management',
  '/roleManagement/26',
  'isEnabled',
  'true',
  false,
  '["Navigate to Privileged Access settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Low',
  'High',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-ROLE-027',
  'Privileged Admin Roles Reviewed',
  'PIM and privileged role management - Privileged Admin Roles Reviewed',
  'TG-ROLE',
  'Access Review',
  'Entra ID',
  'High', 7,
  'Automatic',
  'Graph API',
  'PIM and privileged role management',
  '/roleManagement/27',
  'isEnabled',
  'true',
  true,
  '["Navigate to Privileged Access settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Medium',
  'High',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-ROLE-028',
  'Service Accounts Monitored',
  'PIM and privileged role management - Service Accounts Monitored',
  'TG-ROLE',
  'Service Account',
  'Entra ID',
  'Medium', 4,
  'Automatic',
  'Graph API',
  'PIM and privileged role management',
  '/roleManagement/28',
  'isEnabled',
  'true',
  false,
  '["Navigate to Privileged Access settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Low',
  'High',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-ROLE-029',
  'Privileged Admin Roles Reviewed',
  'PIM and privileged role management - Privileged Admin Roles Reviewed',
  'TG-ROLE',
  'Access Review',
  'Entra ID',
  'High', 7,
  'Automatic',
  'Graph API',
  'PIM and privileged role management',
  '/roleManagement/29',
  'isEnabled',
  'true',
  true,
  '["Navigate to Privileged Access settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Medium',
  'High',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-ROLE-030',
  'Service Accounts Monitored',
  'PIM and privileged role management - Service Accounts Monitored',
  'TG-ROLE',
  'Service Account',
  'Entra ID',
  'Medium', 4,
  'Automatic',
  'Graph API',
  'PIM and privileged role management',
  '/roleManagement/30',
  'isEnabled',
  'true',
  false,
  '["Navigate to Privileged Access settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Low',
  'High',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-ROLE-031',
  'Privileged Admin Roles Reviewed',
  'PIM and privileged role management - Privileged Admin Roles Reviewed',
  'TG-ROLE',
  'Access Review',
  'Entra ID',
  'High', 7,
  'Automatic',
  'Graph API',
  'PIM and privileged role management',
  '/roleManagement/31',
  'isEnabled',
  'true',
  true,
  '["Navigate to Privileged Access settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Medium',
  'High',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-ROLE-032',
  'Service Accounts Monitored',
  'PIM and privileged role management - Service Accounts Monitored',
  'TG-ROLE',
  'Service Account',
  'Entra ID',
  'Medium', 4,
  'Automatic',
  'Graph API',
  'PIM and privileged role management',
  '/roleManagement/32',
  'isEnabled',
  'true',
  false,
  '["Navigate to Privileged Access settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Low',
  'High',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-ROLE-033',
  'Privileged Admin Roles Reviewed',
  'PIM and privileged role management - Privileged Admin Roles Reviewed',
  'TG-ROLE',
  'Access Review',
  'Entra ID',
  'High', 7,
  'Automatic',
  'Graph API',
  'PIM and privileged role management',
  '/roleManagement/33',
  'isEnabled',
  'true',
  true,
  '["Navigate to Privileged Access settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Medium',
  'High',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-ROLE-034',
  'Service Accounts Monitored',
  'PIM and privileged role management - Service Accounts Monitored',
  'TG-ROLE',
  'Service Account',
  'Entra ID',
  'Medium', 4,
  'Automatic',
  'Graph API',
  'PIM and privileged role management',
  '/roleManagement/34',
  'isEnabled',
  'true',
  false,
  '["Navigate to Privileged Access settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Low',
  'High',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-ROLE-035',
  'Privileged Admin Roles Reviewed',
  'PIM and privileged role management - Privileged Admin Roles Reviewed',
  'TG-ROLE',
  'Access Review',
  'Entra ID',
  'High', 7,
  'Automatic',
  'Graph API',
  'PIM and privileged role management',
  '/roleManagement/35',
  'isEnabled',
  'true',
  true,
  '["Navigate to Privileged Access settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Medium',
  'High',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-ROLE-036',
  'Service Accounts Monitored',
  'PIM and privileged role management - Service Accounts Monitored',
  'TG-ROLE',
  'Service Account',
  'Entra ID',
  'Medium', 4,
  'Automatic',
  'Graph API',
  'PIM and privileged role management',
  '/roleManagement/36',
  'isEnabled',
  'true',
  false,
  '["Navigate to Privileged Access settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Low',
  'High',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-ROLE-037',
  'Privileged Admin Roles Reviewed',
  'PIM and privileged role management - Privileged Admin Roles Reviewed',
  'TG-ROLE',
  'Access Review',
  'Entra ID',
  'High', 7,
  'Automatic',
  'Graph API',
  'PIM and privileged role management',
  '/roleManagement/37',
  'isEnabled',
  'true',
  true,
  '["Navigate to Privileged Access settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Medium',
  'High',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-ROLE-038',
  'Service Accounts Monitored',
  'PIM and privileged role management - Service Accounts Monitored',
  'TG-ROLE',
  'Service Account',
  'Entra ID',
  'Medium', 4,
  'Automatic',
  'Graph API',
  'PIM and privileged role management',
  '/roleManagement/38',
  'isEnabled',
  'true',
  false,
  '["Navigate to Privileged Access settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Low',
  'High',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-ROLE-039',
  'Privileged Admin Roles Reviewed',
  'PIM and privileged role management - Privileged Admin Roles Reviewed',
  'TG-ROLE',
  'Access Review',
  'Entra ID',
  'High', 7,
  'Automatic',
  'Graph API',
  'PIM and privileged role management',
  '/roleManagement/39',
  'isEnabled',
  'true',
  true,
  '["Navigate to Privileged Access settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Medium',
  'High',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-ROLE-040',
  'Service Accounts Monitored',
  'PIM and privileged role management - Service Accounts Monitored',
  'TG-ROLE',
  'Service Account',
  'Entra ID',
  'Medium', 4,
  'Automatic',
  'Graph API',
  'PIM and privileged role management',
  '/roleManagement/40',
  'isEnabled',
  'true',
  false,
  '["Navigate to Privileged Access settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Low',
  'High',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-DEV-001',
  'Devices must be Compliant',
  'Device management and compliance policies - Devices must be Compliant',
  'TG-DEV',
  'Compliance',
  'Intune',
  'High', 7,
  'Automatic',
  'Graph API',
  'Device management and compliance policies',
  '/deviceManagement/1',
  'isEnabled',
  'true',
  true,
  '["Navigate to Device Compliance settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Medium',
  'High',
  true,
  'Intune License',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-DEV-002',
  'Device Encryption Required',
  'Device management and compliance policies - Device Encryption Required',
  'TG-DEV',
  'Encryption',
  'Intune',
  'High', 7,
  'Automatic',
  'Graph API',
  'Device management and compliance policies',
  '/deviceManagement/2',
  'isEnabled',
  'true',
  true,
  '["Navigate to Device Compliance settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Medium',
  'High',
  true,
  'Intune License',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-DEV-003',
  'Mobile Device Management Enabled',
  'Device management and compliance policies - Mobile Device Management Enabled',
  'TG-DEV',
  'MDM',
  'Intune',
  'High', 7,
  'Automatic',
  'Graph API',
  'Device management and compliance policies',
  '/deviceManagement/3',
  'isEnabled',
  'true',
  true,
  '["Navigate to Device Compliance settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Medium',
  'High',
  true,
  'Intune License',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-DEV-004',
  'Devices must be Compliant',
  'Device management and compliance policies - Devices must be Compliant',
  'TG-DEV',
  'Compliance',
  'Intune',
  'High', 7,
  'Automatic',
  'Graph API',
  'Device management and compliance policies',
  '/deviceManagement/4',
  'isEnabled',
  'true',
  true,
  '["Navigate to Device Compliance settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Medium',
  'High',
  true,
  'Intune License',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-DEV-005',
  'Device Encryption Required',
  'Device management and compliance policies - Device Encryption Required',
  'TG-DEV',
  'Encryption',
  'Intune',
  'High', 7,
  'Automatic',
  'Graph API',
  'Device management and compliance policies',
  '/deviceManagement/5',
  'isEnabled',
  'true',
  true,
  '["Navigate to Device Compliance settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Medium',
  'High',
  true,
  'Intune License',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-DEV-006',
  'Mobile Device Management Enabled',
  'Device management and compliance policies - Mobile Device Management Enabled',
  'TG-DEV',
  'MDM',
  'Intune',
  'High', 7,
  'Automatic',
  'Graph API',
  'Device management and compliance policies',
  '/deviceManagement/6',
  'isEnabled',
  'true',
  true,
  '["Navigate to Device Compliance settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Medium',
  'High',
  true,
  'Intune License',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-DEV-007',
  'Devices must be Compliant',
  'Device management and compliance policies - Devices must be Compliant',
  'TG-DEV',
  'Compliance',
  'Intune',
  'High', 7,
  'Automatic',
  'Graph API',
  'Device management and compliance policies',
  '/deviceManagement/7',
  'isEnabled',
  'true',
  true,
  '["Navigate to Device Compliance settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Medium',
  'High',
  true,
  'Intune License',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-DEV-008',
  'Device Encryption Required',
  'Device management and compliance policies - Device Encryption Required',
  'TG-DEV',
  'Encryption',
  'Intune',
  'High', 7,
  'Automatic',
  'Graph API',
  'Device management and compliance policies',
  '/deviceManagement/8',
  'isEnabled',
  'true',
  true,
  '["Navigate to Device Compliance settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Medium',
  'High',
  true,
  'Intune License',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-DEV-009',
  'Mobile Device Management Enabled',
  'Device management and compliance policies - Mobile Device Management Enabled',
  'TG-DEV',
  'MDM',
  'Intune',
  'High', 7,
  'Automatic',
  'Graph API',
  'Device management and compliance policies',
  '/deviceManagement/9',
  'isEnabled',
  'true',
  true,
  '["Navigate to Device Compliance settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Medium',
  'High',
  true,
  'Intune License',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-DEV-010',
  'Devices must be Compliant',
  'Device management and compliance policies - Devices must be Compliant',
  'TG-DEV',
  'Compliance',
  'Intune',
  'High', 7,
  'Automatic',
  'Graph API',
  'Device management and compliance policies',
  '/deviceManagement/10',
  'isEnabled',
  'true',
  true,
  '["Navigate to Device Compliance settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Medium',
  'High',
  true,
  'Intune License',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-DEV-011',
  'Device Encryption Required',
  'Device management and compliance policies - Device Encryption Required',
  'TG-DEV',
  'Encryption',
  'Intune',
  'High', 7,
  'Automatic',
  'Graph API',
  'Device management and compliance policies',
  '/deviceManagement/11',
  'isEnabled',
  'true',
  true,
  '["Navigate to Device Compliance settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Medium',
  'High',
  true,
  'Intune License',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-DEV-012',
  'Mobile Device Management Enabled',
  'Device management and compliance policies - Mobile Device Management Enabled',
  'TG-DEV',
  'MDM',
  'Intune',
  'High', 7,
  'Automatic',
  'Graph API',
  'Device management and compliance policies',
  '/deviceManagement/12',
  'isEnabled',
  'true',
  true,
  '["Navigate to Device Compliance settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Medium',
  'High',
  true,
  'Intune License',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-DEV-013',
  'Devices must be Compliant',
  'Device management and compliance policies - Devices must be Compliant',
  'TG-DEV',
  'Compliance',
  'Intune',
  'High', 7,
  'Automatic',
  'Graph API',
  'Device management and compliance policies',
  '/deviceManagement/13',
  'isEnabled',
  'true',
  true,
  '["Navigate to Device Compliance settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Medium',
  'High',
  true,
  'Intune License',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-DEV-014',
  'Device Encryption Required',
  'Device management and compliance policies - Device Encryption Required',
  'TG-DEV',
  'Encryption',
  'Intune',
  'High', 7,
  'Automatic',
  'Graph API',
  'Device management and compliance policies',
  '/deviceManagement/14',
  'isEnabled',
  'true',
  true,
  '["Navigate to Device Compliance settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Medium',
  'High',
  true,
  'Intune License',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-DEV-015',
  'Mobile Device Management Enabled',
  'Device management and compliance policies - Mobile Device Management Enabled',
  'TG-DEV',
  'MDM',
  'Intune',
  'High', 7,
  'Automatic',
  'Graph API',
  'Device management and compliance policies',
  '/deviceManagement/15',
  'isEnabled',
  'true',
  true,
  '["Navigate to Device Compliance settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Medium',
  'High',
  true,
  'Intune License',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-DEV-016',
  'Devices must be Compliant',
  'Device management and compliance policies - Devices must be Compliant',
  'TG-DEV',
  'Compliance',
  'Intune',
  'High', 7,
  'Automatic',
  'Graph API',
  'Device management and compliance policies',
  '/deviceManagement/16',
  'isEnabled',
  'true',
  true,
  '["Navigate to Device Compliance settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Medium',
  'High',
  true,
  'Intune License',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-DEV-017',
  'Device Encryption Required',
  'Device management and compliance policies - Device Encryption Required',
  'TG-DEV',
  'Encryption',
  'Intune',
  'High', 7,
  'Automatic',
  'Graph API',
  'Device management and compliance policies',
  '/deviceManagement/17',
  'isEnabled',
  'true',
  true,
  '["Navigate to Device Compliance settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Medium',
  'High',
  true,
  'Intune License',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-DEV-018',
  'Mobile Device Management Enabled',
  'Device management and compliance policies - Mobile Device Management Enabled',
  'TG-DEV',
  'MDM',
  'Intune',
  'High', 7,
  'Automatic',
  'Graph API',
  'Device management and compliance policies',
  '/deviceManagement/18',
  'isEnabled',
  'true',
  true,
  '["Navigate to Device Compliance settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Medium',
  'High',
  true,
  'Intune License',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-DEV-019',
  'Devices must be Compliant',
  'Device management and compliance policies - Devices must be Compliant',
  'TG-DEV',
  'Compliance',
  'Intune',
  'High', 7,
  'Automatic',
  'Graph API',
  'Device management and compliance policies',
  '/deviceManagement/19',
  'isEnabled',
  'true',
  true,
  '["Navigate to Device Compliance settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Medium',
  'High',
  true,
  'Intune License',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-DEV-020',
  'Device Encryption Required',
  'Device management and compliance policies - Device Encryption Required',
  'TG-DEV',
  'Encryption',
  'Intune',
  'High', 7,
  'Automatic',
  'Graph API',
  'Device management and compliance policies',
  '/deviceManagement/20',
  'isEnabled',
  'true',
  true,
  '["Navigate to Device Compliance settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Medium',
  'High',
  true,
  'Intune License',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-DEV-021',
  'Mobile Device Management Enabled',
  'Device management and compliance policies - Mobile Device Management Enabled',
  'TG-DEV',
  'MDM',
  'Intune',
  'High', 7,
  'Automatic',
  'Graph API',
  'Device management and compliance policies',
  '/deviceManagement/21',
  'isEnabled',
  'true',
  true,
  '["Navigate to Device Compliance settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Medium',
  'High',
  true,
  'Intune License',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-DEV-022',
  'Devices must be Compliant',
  'Device management and compliance policies - Devices must be Compliant',
  'TG-DEV',
  'Compliance',
  'Intune',
  'High', 7,
  'Automatic',
  'Graph API',
  'Device management and compliance policies',
  '/deviceManagement/22',
  'isEnabled',
  'true',
  true,
  '["Navigate to Device Compliance settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Medium',
  'High',
  true,
  'Intune License',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-DEV-023',
  'Device Encryption Required',
  'Device management and compliance policies - Device Encryption Required',
  'TG-DEV',
  'Encryption',
  'Intune',
  'High', 7,
  'Automatic',
  'Graph API',
  'Device management and compliance policies',
  '/deviceManagement/23',
  'isEnabled',
  'true',
  true,
  '["Navigate to Device Compliance settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Medium',
  'High',
  true,
  'Intune License',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-DEV-024',
  'Mobile Device Management Enabled',
  'Device management and compliance policies - Mobile Device Management Enabled',
  'TG-DEV',
  'MDM',
  'Intune',
  'High', 7,
  'Automatic',
  'Graph API',
  'Device management and compliance policies',
  '/deviceManagement/24',
  'isEnabled',
  'true',
  true,
  '["Navigate to Device Compliance settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Medium',
  'High',
  true,
  'Intune License',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-DEV-025',
  'Devices must be Compliant',
  'Device management and compliance policies - Devices must be Compliant',
  'TG-DEV',
  'Compliance',
  'Intune',
  'High', 7,
  'Automatic',
  'Graph API',
  'Device management and compliance policies',
  '/deviceManagement/25',
  'isEnabled',
  'true',
  true,
  '["Navigate to Device Compliance settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Medium',
  'High',
  true,
  'Intune License',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-DEV-026',
  'Device Encryption Required',
  'Device management and compliance policies - Device Encryption Required',
  'TG-DEV',
  'Encryption',
  'Intune',
  'High', 7,
  'Automatic',
  'Graph API',
  'Device management and compliance policies',
  '/deviceManagement/26',
  'isEnabled',
  'true',
  true,
  '["Navigate to Device Compliance settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Medium',
  'High',
  true,
  'Intune License',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-DEV-027',
  'Mobile Device Management Enabled',
  'Device management and compliance policies - Mobile Device Management Enabled',
  'TG-DEV',
  'MDM',
  'Intune',
  'High', 7,
  'Automatic',
  'Graph API',
  'Device management and compliance policies',
  '/deviceManagement/27',
  'isEnabled',
  'true',
  true,
  '["Navigate to Device Compliance settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Medium',
  'High',
  true,
  'Intune License',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-DEV-028',
  'Devices must be Compliant',
  'Device management and compliance policies - Devices must be Compliant',
  'TG-DEV',
  'Compliance',
  'Intune',
  'High', 7,
  'Automatic',
  'Graph API',
  'Device management and compliance policies',
  '/deviceManagement/28',
  'isEnabled',
  'true',
  true,
  '["Navigate to Device Compliance settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Medium',
  'High',
  true,
  'Intune License',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-DEV-029',
  'Device Encryption Required',
  'Device management and compliance policies - Device Encryption Required',
  'TG-DEV',
  'Encryption',
  'Intune',
  'High', 7,
  'Automatic',
  'Graph API',
  'Device management and compliance policies',
  '/deviceManagement/29',
  'isEnabled',
  'true',
  true,
  '["Navigate to Device Compliance settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Medium',
  'High',
  true,
  'Intune License',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-DEV-030',
  'Mobile Device Management Enabled',
  'Device management and compliance policies - Mobile Device Management Enabled',
  'TG-DEV',
  'MDM',
  'Intune',
  'High', 7,
  'Automatic',
  'Graph API',
  'Device management and compliance policies',
  '/deviceManagement/30',
  'isEnabled',
  'true',
  true,
  '["Navigate to Device Compliance settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Medium',
  'High',
  true,
  'Intune License',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-DEV-031',
  'Devices must be Compliant',
  'Device management and compliance policies - Devices must be Compliant',
  'TG-DEV',
  'Compliance',
  'Intune',
  'High', 7,
  'Automatic',
  'Graph API',
  'Device management and compliance policies',
  '/deviceManagement/31',
  'isEnabled',
  'true',
  true,
  '["Navigate to Device Compliance settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Medium',
  'High',
  true,
  'Intune License',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-DEV-032',
  'Device Encryption Required',
  'Device management and compliance policies - Device Encryption Required',
  'TG-DEV',
  'Encryption',
  'Intune',
  'High', 7,
  'Automatic',
  'Graph API',
  'Device management and compliance policies',
  '/deviceManagement/32',
  'isEnabled',
  'true',
  true,
  '["Navigate to Device Compliance settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Medium',
  'High',
  true,
  'Intune License',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-DEV-033',
  'Mobile Device Management Enabled',
  'Device management and compliance policies - Mobile Device Management Enabled',
  'TG-DEV',
  'MDM',
  'Intune',
  'High', 7,
  'Automatic',
  'Graph API',
  'Device management and compliance policies',
  '/deviceManagement/33',
  'isEnabled',
  'true',
  true,
  '["Navigate to Device Compliance settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Medium',
  'High',
  true,
  'Intune License',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-DEV-034',
  'Devices must be Compliant',
  'Device management and compliance policies - Devices must be Compliant',
  'TG-DEV',
  'Compliance',
  'Intune',
  'High', 7,
  'Automatic',
  'Graph API',
  'Device management and compliance policies',
  '/deviceManagement/34',
  'isEnabled',
  'true',
  true,
  '["Navigate to Device Compliance settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Medium',
  'High',
  true,
  'Intune License',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-DEV-035',
  'Device Encryption Required',
  'Device management and compliance policies - Device Encryption Required',
  'TG-DEV',
  'Encryption',
  'Intune',
  'High', 7,
  'Automatic',
  'Graph API',
  'Device management and compliance policies',
  '/deviceManagement/35',
  'isEnabled',
  'true',
  true,
  '["Navigate to Device Compliance settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Medium',
  'High',
  true,
  'Intune License',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-DEV-036',
  'Mobile Device Management Enabled',
  'Device management and compliance policies - Mobile Device Management Enabled',
  'TG-DEV',
  'MDM',
  'Intune',
  'High', 7,
  'Automatic',
  'Graph API',
  'Device management and compliance policies',
  '/deviceManagement/36',
  'isEnabled',
  'true',
  true,
  '["Navigate to Device Compliance settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Medium',
  'High',
  true,
  'Intune License',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-DEV-037',
  'Devices must be Compliant',
  'Device management and compliance policies - Devices must be Compliant',
  'TG-DEV',
  'Compliance',
  'Intune',
  'High', 7,
  'Automatic',
  'Graph API',
  'Device management and compliance policies',
  '/deviceManagement/37',
  'isEnabled',
  'true',
  true,
  '["Navigate to Device Compliance settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Medium',
  'High',
  true,
  'Intune License',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-DEV-038',
  'Device Encryption Required',
  'Device management and compliance policies - Device Encryption Required',
  'TG-DEV',
  'Encryption',
  'Intune',
  'High', 7,
  'Automatic',
  'Graph API',
  'Device management and compliance policies',
  '/deviceManagement/38',
  'isEnabled',
  'true',
  true,
  '["Navigate to Device Compliance settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Medium',
  'High',
  true,
  'Intune License',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-DEV-039',
  'Mobile Device Management Enabled',
  'Device management and compliance policies - Mobile Device Management Enabled',
  'TG-DEV',
  'MDM',
  'Intune',
  'High', 7,
  'Automatic',
  'Graph API',
  'Device management and compliance policies',
  '/deviceManagement/39',
  'isEnabled',
  'true',
  true,
  '["Navigate to Device Compliance settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Medium',
  'High',
  true,
  'Intune License',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-DEV-040',
  'Devices must be Compliant',
  'Device management and compliance policies - Devices must be Compliant',
  'TG-DEV',
  'Compliance',
  'Intune',
  'High', 7,
  'Automatic',
  'Graph API',
  'Device management and compliance policies',
  '/deviceManagement/40',
  'isEnabled',
  'true',
  true,
  '["Navigate to Device Compliance settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Medium',
  'High',
  true,
  'Intune License',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-DEV-041',
  'Device Encryption Required',
  'Device management and compliance policies - Device Encryption Required',
  'TG-DEV',
  'Encryption',
  'Intune',
  'High', 7,
  'Automatic',
  'Graph API',
  'Device management and compliance policies',
  '/deviceManagement/41',
  'isEnabled',
  'true',
  true,
  '["Navigate to Device Compliance settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Medium',
  'High',
  true,
  'Intune License',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-DEV-042',
  'Mobile Device Management Enabled',
  'Device management and compliance policies - Mobile Device Management Enabled',
  'TG-DEV',
  'MDM',
  'Intune',
  'High', 7,
  'Automatic',
  'Graph API',
  'Device management and compliance policies',
  '/deviceManagement/42',
  'isEnabled',
  'true',
  true,
  '["Navigate to Device Compliance settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Medium',
  'High',
  true,
  'Intune License',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-DEV-043',
  'Devices must be Compliant',
  'Device management and compliance policies - Devices must be Compliant',
  'TG-DEV',
  'Compliance',
  'Intune',
  'High', 7,
  'Automatic',
  'Graph API',
  'Device management and compliance policies',
  '/deviceManagement/43',
  'isEnabled',
  'true',
  true,
  '["Navigate to Device Compliance settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Medium',
  'High',
  true,
  'Intune License',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-DEV-044',
  'Device Encryption Required',
  'Device management and compliance policies - Device Encryption Required',
  'TG-DEV',
  'Encryption',
  'Intune',
  'High', 7,
  'Automatic',
  'Graph API',
  'Device management and compliance policies',
  '/deviceManagement/44',
  'isEnabled',
  'true',
  true,
  '["Navigate to Device Compliance settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Medium',
  'High',
  true,
  'Intune License',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-DEV-045',
  'Mobile Device Management Enabled',
  'Device management and compliance policies - Mobile Device Management Enabled',
  'TG-DEV',
  'MDM',
  'Intune',
  'High', 7,
  'Automatic',
  'Graph API',
  'Device management and compliance policies',
  '/deviceManagement/45',
  'isEnabled',
  'true',
  true,
  '["Navigate to Device Compliance settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Medium',
  'High',
  true,
  'Intune License',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-DEV-046',
  'Devices must be Compliant',
  'Device management and compliance policies - Devices must be Compliant',
  'TG-DEV',
  'Compliance',
  'Intune',
  'High', 7,
  'Automatic',
  'Graph API',
  'Device management and compliance policies',
  '/deviceManagement/46',
  'isEnabled',
  'true',
  true,
  '["Navigate to Device Compliance settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Medium',
  'High',
  true,
  'Intune License',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-DEV-047',
  'Device Encryption Required',
  'Device management and compliance policies - Device Encryption Required',
  'TG-DEV',
  'Encryption',
  'Intune',
  'High', 7,
  'Automatic',
  'Graph API',
  'Device management and compliance policies',
  '/deviceManagement/47',
  'isEnabled',
  'true',
  true,
  '["Navigate to Device Compliance settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Medium',
  'High',
  true,
  'Intune License',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-DEV-048',
  'Mobile Device Management Enabled',
  'Device management and compliance policies - Mobile Device Management Enabled',
  'TG-DEV',
  'MDM',
  'Intune',
  'High', 7,
  'Automatic',
  'Graph API',
  'Device management and compliance policies',
  '/deviceManagement/48',
  'isEnabled',
  'true',
  true,
  '["Navigate to Device Compliance settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Medium',
  'High',
  true,
  'Intune License',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-DEV-049',
  'Devices must be Compliant',
  'Device management and compliance policies - Devices must be Compliant',
  'TG-DEV',
  'Compliance',
  'Intune',
  'High', 7,
  'Automatic',
  'Graph API',
  'Device management and compliance policies',
  '/deviceManagement/49',
  'isEnabled',
  'true',
  true,
  '["Navigate to Device Compliance settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Medium',
  'High',
  true,
  'Intune License',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-DEV-050',
  'Device Encryption Required',
  'Device management and compliance policies - Device Encryption Required',
  'TG-DEV',
  'Encryption',
  'Intune',
  'High', 7,
  'Automatic',
  'Graph API',
  'Device management and compliance policies',
  '/deviceManagement/50',
  'isEnabled',
  'true',
  true,
  '["Navigate to Device Compliance settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Medium',
  'High',
  true,
  'Intune License',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-DEV-051',
  'Mobile Device Management Enabled',
  'Device management and compliance policies - Mobile Device Management Enabled',
  'TG-DEV',
  'MDM',
  'Intune',
  'High', 7,
  'Automatic',
  'Graph API',
  'Device management and compliance policies',
  '/deviceManagement/51',
  'isEnabled',
  'true',
  true,
  '["Navigate to Device Compliance settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Medium',
  'High',
  true,
  'Intune License',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-DEV-052',
  'Devices must be Compliant',
  'Device management and compliance policies - Devices must be Compliant',
  'TG-DEV',
  'Compliance',
  'Intune',
  'High', 7,
  'Automatic',
  'Graph API',
  'Device management and compliance policies',
  '/deviceManagement/52',
  'isEnabled',
  'true',
  true,
  '["Navigate to Device Compliance settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Medium',
  'High',
  true,
  'Intune License',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-DEV-053',
  'Device Encryption Required',
  'Device management and compliance policies - Device Encryption Required',
  'TG-DEV',
  'Encryption',
  'Intune',
  'High', 7,
  'Automatic',
  'Graph API',
  'Device management and compliance policies',
  '/deviceManagement/53',
  'isEnabled',
  'true',
  true,
  '["Navigate to Device Compliance settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Medium',
  'High',
  true,
  'Intune License',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-DEV-054',
  'Mobile Device Management Enabled',
  'Device management and compliance policies - Mobile Device Management Enabled',
  'TG-DEV',
  'MDM',
  'Intune',
  'High', 7,
  'Automatic',
  'Graph API',
  'Device management and compliance policies',
  '/deviceManagement/54',
  'isEnabled',
  'true',
  true,
  '["Navigate to Device Compliance settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Medium',
  'High',
  true,
  'Intune License',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-DEV-055',
  'Devices must be Compliant',
  'Device management and compliance policies - Devices must be Compliant',
  'TG-DEV',
  'Compliance',
  'Intune',
  'High', 7,
  'Automatic',
  'Graph API',
  'Device management and compliance policies',
  '/deviceManagement/55',
  'isEnabled',
  'true',
  true,
  '["Navigate to Device Compliance settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Medium',
  'High',
  true,
  'Intune License',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-DEV-056',
  'Device Encryption Required',
  'Device management and compliance policies - Device Encryption Required',
  'TG-DEV',
  'Encryption',
  'Intune',
  'High', 7,
  'Automatic',
  'Graph API',
  'Device management and compliance policies',
  '/deviceManagement/56',
  'isEnabled',
  'true',
  true,
  '["Navigate to Device Compliance settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Medium',
  'High',
  true,
  'Intune License',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-DEV-057',
  'Mobile Device Management Enabled',
  'Device management and compliance policies - Mobile Device Management Enabled',
  'TG-DEV',
  'MDM',
  'Intune',
  'High', 7,
  'Automatic',
  'Graph API',
  'Device management and compliance policies',
  '/deviceManagement/57',
  'isEnabled',
  'true',
  true,
  '["Navigate to Device Compliance settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Medium',
  'High',
  true,
  'Intune License',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-DEV-058',
  'Devices must be Compliant',
  'Device management and compliance policies - Devices must be Compliant',
  'TG-DEV',
  'Compliance',
  'Intune',
  'High', 7,
  'Automatic',
  'Graph API',
  'Device management and compliance policies',
  '/deviceManagement/58',
  'isEnabled',
  'true',
  true,
  '["Navigate to Device Compliance settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Medium',
  'High',
  true,
  'Intune License',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-DEV-059',
  'Device Encryption Required',
  'Device management and compliance policies - Device Encryption Required',
  'TG-DEV',
  'Encryption',
  'Intune',
  'High', 7,
  'Automatic',
  'Graph API',
  'Device management and compliance policies',
  '/deviceManagement/59',
  'isEnabled',
  'true',
  true,
  '["Navigate to Device Compliance settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Medium',
  'High',
  true,
  'Intune License',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-DEV-060',
  'Mobile Device Management Enabled',
  'Device management and compliance policies - Mobile Device Management Enabled',
  'TG-DEV',
  'MDM',
  'Intune',
  'High', 7,
  'Automatic',
  'Graph API',
  'Device management and compliance policies',
  '/deviceManagement/60',
  'isEnabled',
  'true',
  true,
  '["Navigate to Device Compliance settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Medium',
  'High',
  true,
  'Intune License',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-EXO-001',
  'External Email Warnings Enabled',
  'Email security and compliance - External Email Warnings Enabled',
  'TG-EXO',
  'Email Security',
  'Exchange',
  'Medium', 4,
  'Automatic',
  'PowerShell',
  'Email security and compliance',
  '/organization/tenantAllowBlockLists/1',
  'isEnabled',
  'true',
  false,
  '["Navigate to Exchange Online settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Low',
  'High',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-EXO-002',
  'SMTP Authentication Blocked',
  'Email security and compliance - SMTP Authentication Blocked',
  'TG-EXO',
  'Authentication',
  'Exchange',
  'High', 7,
  'Automatic',
  'PowerShell',
  'Email security and compliance',
  '/organization/tenantAllowBlockLists/2',
  'isEnabled',
  'true',
  true,
  '["Navigate to Exchange Online settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Medium',
  'High',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-EXO-003',
  'Malware Scanning Enabled',
  'Email security and compliance - Malware Scanning Enabled',
  'TG-EXO',
  'Threat Protection',
  'Exchange',
  'Critical', 10,
  'Automatic',
  'PowerShell',
  'Email security and compliance',
  '/organization/tenantAllowBlockLists/3',
  'isEnabled',
  'true',
  true,
  '["Navigate to Exchange Online settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Medium',
  'Critical',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-EXO-004',
  'External Email Warnings Enabled',
  'Email security and compliance - External Email Warnings Enabled',
  'TG-EXO',
  'Email Security',
  'Exchange',
  'Medium', 4,
  'Automatic',
  'PowerShell',
  'Email security and compliance',
  '/organization/tenantAllowBlockLists/4',
  'isEnabled',
  'true',
  false,
  '["Navigate to Exchange Online settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Low',
  'High',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-EXO-005',
  'SMTP Authentication Blocked',
  'Email security and compliance - SMTP Authentication Blocked',
  'TG-EXO',
  'Authentication',
  'Exchange',
  'High', 7,
  'Automatic',
  'PowerShell',
  'Email security and compliance',
  '/organization/tenantAllowBlockLists/5',
  'isEnabled',
  'true',
  true,
  '["Navigate to Exchange Online settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Medium',
  'High',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-EXO-006',
  'Malware Scanning Enabled',
  'Email security and compliance - Malware Scanning Enabled',
  'TG-EXO',
  'Threat Protection',
  'Exchange',
  'Critical', 10,
  'Automatic',
  'PowerShell',
  'Email security and compliance',
  '/organization/tenantAllowBlockLists/6',
  'isEnabled',
  'true',
  true,
  '["Navigate to Exchange Online settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Medium',
  'Critical',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-EXO-007',
  'External Email Warnings Enabled',
  'Email security and compliance - External Email Warnings Enabled',
  'TG-EXO',
  'Email Security',
  'Exchange',
  'Medium', 4,
  'Automatic',
  'PowerShell',
  'Email security and compliance',
  '/organization/tenantAllowBlockLists/7',
  'isEnabled',
  'true',
  false,
  '["Navigate to Exchange Online settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Low',
  'High',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-EXO-008',
  'SMTP Authentication Blocked',
  'Email security and compliance - SMTP Authentication Blocked',
  'TG-EXO',
  'Authentication',
  'Exchange',
  'High', 7,
  'Automatic',
  'PowerShell',
  'Email security and compliance',
  '/organization/tenantAllowBlockLists/8',
  'isEnabled',
  'true',
  true,
  '["Navigate to Exchange Online settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Medium',
  'High',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-EXO-009',
  'Malware Scanning Enabled',
  'Email security and compliance - Malware Scanning Enabled',
  'TG-EXO',
  'Threat Protection',
  'Exchange',
  'Critical', 10,
  'Automatic',
  'PowerShell',
  'Email security and compliance',
  '/organization/tenantAllowBlockLists/9',
  'isEnabled',
  'true',
  true,
  '["Navigate to Exchange Online settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Medium',
  'Critical',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-EXO-010',
  'External Email Warnings Enabled',
  'Email security and compliance - External Email Warnings Enabled',
  'TG-EXO',
  'Email Security',
  'Exchange',
  'Medium', 4,
  'Automatic',
  'PowerShell',
  'Email security and compliance',
  '/organization/tenantAllowBlockLists/10',
  'isEnabled',
  'true',
  false,
  '["Navigate to Exchange Online settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Low',
  'High',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-EXO-011',
  'SMTP Authentication Blocked',
  'Email security and compliance - SMTP Authentication Blocked',
  'TG-EXO',
  'Authentication',
  'Exchange',
  'High', 7,
  'Automatic',
  'PowerShell',
  'Email security and compliance',
  '/organization/tenantAllowBlockLists/11',
  'isEnabled',
  'true',
  true,
  '["Navigate to Exchange Online settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Medium',
  'High',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-EXO-012',
  'Malware Scanning Enabled',
  'Email security and compliance - Malware Scanning Enabled',
  'TG-EXO',
  'Threat Protection',
  'Exchange',
  'Critical', 10,
  'Automatic',
  'PowerShell',
  'Email security and compliance',
  '/organization/tenantAllowBlockLists/12',
  'isEnabled',
  'true',
  true,
  '["Navigate to Exchange Online settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Medium',
  'Critical',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-EXO-013',
  'External Email Warnings Enabled',
  'Email security and compliance - External Email Warnings Enabled',
  'TG-EXO',
  'Email Security',
  'Exchange',
  'Medium', 4,
  'Automatic',
  'PowerShell',
  'Email security and compliance',
  '/organization/tenantAllowBlockLists/13',
  'isEnabled',
  'true',
  false,
  '["Navigate to Exchange Online settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Low',
  'High',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-EXO-014',
  'SMTP Authentication Blocked',
  'Email security and compliance - SMTP Authentication Blocked',
  'TG-EXO',
  'Authentication',
  'Exchange',
  'High', 7,
  'Automatic',
  'PowerShell',
  'Email security and compliance',
  '/organization/tenantAllowBlockLists/14',
  'isEnabled',
  'true',
  true,
  '["Navigate to Exchange Online settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Medium',
  'High',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-EXO-015',
  'Malware Scanning Enabled',
  'Email security and compliance - Malware Scanning Enabled',
  'TG-EXO',
  'Threat Protection',
  'Exchange',
  'Critical', 10,
  'Automatic',
  'PowerShell',
  'Email security and compliance',
  '/organization/tenantAllowBlockLists/15',
  'isEnabled',
  'true',
  true,
  '["Navigate to Exchange Online settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Medium',
  'Critical',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-EXO-016',
  'External Email Warnings Enabled',
  'Email security and compliance - External Email Warnings Enabled',
  'TG-EXO',
  'Email Security',
  'Exchange',
  'Medium', 4,
  'Automatic',
  'PowerShell',
  'Email security and compliance',
  '/organization/tenantAllowBlockLists/16',
  'isEnabled',
  'true',
  false,
  '["Navigate to Exchange Online settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Low',
  'High',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-EXO-017',
  'SMTP Authentication Blocked',
  'Email security and compliance - SMTP Authentication Blocked',
  'TG-EXO',
  'Authentication',
  'Exchange',
  'High', 7,
  'Automatic',
  'PowerShell',
  'Email security and compliance',
  '/organization/tenantAllowBlockLists/17',
  'isEnabled',
  'true',
  true,
  '["Navigate to Exchange Online settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Medium',
  'High',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-EXO-018',
  'Malware Scanning Enabled',
  'Email security and compliance - Malware Scanning Enabled',
  'TG-EXO',
  'Threat Protection',
  'Exchange',
  'Critical', 10,
  'Automatic',
  'PowerShell',
  'Email security and compliance',
  '/organization/tenantAllowBlockLists/18',
  'isEnabled',
  'true',
  true,
  '["Navigate to Exchange Online settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Medium',
  'Critical',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-EXO-019',
  'External Email Warnings Enabled',
  'Email security and compliance - External Email Warnings Enabled',
  'TG-EXO',
  'Email Security',
  'Exchange',
  'Medium', 4,
  'Automatic',
  'PowerShell',
  'Email security and compliance',
  '/organization/tenantAllowBlockLists/19',
  'isEnabled',
  'true',
  false,
  '["Navigate to Exchange Online settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Low',
  'High',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-EXO-020',
  'SMTP Authentication Blocked',
  'Email security and compliance - SMTP Authentication Blocked',
  'TG-EXO',
  'Authentication',
  'Exchange',
  'High', 7,
  'Automatic',
  'PowerShell',
  'Email security and compliance',
  '/organization/tenantAllowBlockLists/20',
  'isEnabled',
  'true',
  true,
  '["Navigate to Exchange Online settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Medium',
  'High',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-EXO-021',
  'Malware Scanning Enabled',
  'Email security and compliance - Malware Scanning Enabled',
  'TG-EXO',
  'Threat Protection',
  'Exchange',
  'Critical', 10,
  'Automatic',
  'PowerShell',
  'Email security and compliance',
  '/organization/tenantAllowBlockLists/21',
  'isEnabled',
  'true',
  true,
  '["Navigate to Exchange Online settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Medium',
  'Critical',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-EXO-022',
  'External Email Warnings Enabled',
  'Email security and compliance - External Email Warnings Enabled',
  'TG-EXO',
  'Email Security',
  'Exchange',
  'Medium', 4,
  'Automatic',
  'PowerShell',
  'Email security and compliance',
  '/organization/tenantAllowBlockLists/22',
  'isEnabled',
  'true',
  false,
  '["Navigate to Exchange Online settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Low',
  'High',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-EXO-023',
  'SMTP Authentication Blocked',
  'Email security and compliance - SMTP Authentication Blocked',
  'TG-EXO',
  'Authentication',
  'Exchange',
  'High', 7,
  'Automatic',
  'PowerShell',
  'Email security and compliance',
  '/organization/tenantAllowBlockLists/23',
  'isEnabled',
  'true',
  true,
  '["Navigate to Exchange Online settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Medium',
  'High',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-EXO-024',
  'Malware Scanning Enabled',
  'Email security and compliance - Malware Scanning Enabled',
  'TG-EXO',
  'Threat Protection',
  'Exchange',
  'Critical', 10,
  'Automatic',
  'PowerShell',
  'Email security and compliance',
  '/organization/tenantAllowBlockLists/24',
  'isEnabled',
  'true',
  true,
  '["Navigate to Exchange Online settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Medium',
  'Critical',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-EXO-025',
  'External Email Warnings Enabled',
  'Email security and compliance - External Email Warnings Enabled',
  'TG-EXO',
  'Email Security',
  'Exchange',
  'Medium', 4,
  'Automatic',
  'PowerShell',
  'Email security and compliance',
  '/organization/tenantAllowBlockLists/25',
  'isEnabled',
  'true',
  false,
  '["Navigate to Exchange Online settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Low',
  'High',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-EXO-026',
  'SMTP Authentication Blocked',
  'Email security and compliance - SMTP Authentication Blocked',
  'TG-EXO',
  'Authentication',
  'Exchange',
  'High', 7,
  'Automatic',
  'PowerShell',
  'Email security and compliance',
  '/organization/tenantAllowBlockLists/26',
  'isEnabled',
  'true',
  true,
  '["Navigate to Exchange Online settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Medium',
  'High',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-EXO-027',
  'Malware Scanning Enabled',
  'Email security and compliance - Malware Scanning Enabled',
  'TG-EXO',
  'Threat Protection',
  'Exchange',
  'Critical', 10,
  'Automatic',
  'PowerShell',
  'Email security and compliance',
  '/organization/tenantAllowBlockLists/27',
  'isEnabled',
  'true',
  true,
  '["Navigate to Exchange Online settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Medium',
  'Critical',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-EXO-028',
  'External Email Warnings Enabled',
  'Email security and compliance - External Email Warnings Enabled',
  'TG-EXO',
  'Email Security',
  'Exchange',
  'Medium', 4,
  'Automatic',
  'PowerShell',
  'Email security and compliance',
  '/organization/tenantAllowBlockLists/28',
  'isEnabled',
  'true',
  false,
  '["Navigate to Exchange Online settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Low',
  'High',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-EXO-029',
  'SMTP Authentication Blocked',
  'Email security and compliance - SMTP Authentication Blocked',
  'TG-EXO',
  'Authentication',
  'Exchange',
  'High', 7,
  'Automatic',
  'PowerShell',
  'Email security and compliance',
  '/organization/tenantAllowBlockLists/29',
  'isEnabled',
  'true',
  true,
  '["Navigate to Exchange Online settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Medium',
  'High',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-EXO-030',
  'Malware Scanning Enabled',
  'Email security and compliance - Malware Scanning Enabled',
  'TG-EXO',
  'Threat Protection',
  'Exchange',
  'Critical', 10,
  'Automatic',
  'PowerShell',
  'Email security and compliance',
  '/organization/tenantAllowBlockLists/30',
  'isEnabled',
  'true',
  true,
  '["Navigate to Exchange Online settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Medium',
  'Critical',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-EXO-031',
  'External Email Warnings Enabled',
  'Email security and compliance - External Email Warnings Enabled',
  'TG-EXO',
  'Email Security',
  'Exchange',
  'Medium', 4,
  'Automatic',
  'PowerShell',
  'Email security and compliance',
  '/organization/tenantAllowBlockLists/31',
  'isEnabled',
  'true',
  false,
  '["Navigate to Exchange Online settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Low',
  'High',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-EXO-032',
  'SMTP Authentication Blocked',
  'Email security and compliance - SMTP Authentication Blocked',
  'TG-EXO',
  'Authentication',
  'Exchange',
  'High', 7,
  'Automatic',
  'PowerShell',
  'Email security and compliance',
  '/organization/tenantAllowBlockLists/32',
  'isEnabled',
  'true',
  true,
  '["Navigate to Exchange Online settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Medium',
  'High',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-EXO-033',
  'Malware Scanning Enabled',
  'Email security and compliance - Malware Scanning Enabled',
  'TG-EXO',
  'Threat Protection',
  'Exchange',
  'Critical', 10,
  'Automatic',
  'PowerShell',
  'Email security and compliance',
  '/organization/tenantAllowBlockLists/33',
  'isEnabled',
  'true',
  true,
  '["Navigate to Exchange Online settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Medium',
  'Critical',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-EXO-034',
  'External Email Warnings Enabled',
  'Email security and compliance - External Email Warnings Enabled',
  'TG-EXO',
  'Email Security',
  'Exchange',
  'Medium', 4,
  'Automatic',
  'PowerShell',
  'Email security and compliance',
  '/organization/tenantAllowBlockLists/34',
  'isEnabled',
  'true',
  false,
  '["Navigate to Exchange Online settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Low',
  'High',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-EXO-035',
  'SMTP Authentication Blocked',
  'Email security and compliance - SMTP Authentication Blocked',
  'TG-EXO',
  'Authentication',
  'Exchange',
  'High', 7,
  'Automatic',
  'PowerShell',
  'Email security and compliance',
  '/organization/tenantAllowBlockLists/35',
  'isEnabled',
  'true',
  true,
  '["Navigate to Exchange Online settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Medium',
  'High',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-EXO-036',
  'Malware Scanning Enabled',
  'Email security and compliance - Malware Scanning Enabled',
  'TG-EXO',
  'Threat Protection',
  'Exchange',
  'Critical', 10,
  'Automatic',
  'PowerShell',
  'Email security and compliance',
  '/organization/tenantAllowBlockLists/36',
  'isEnabled',
  'true',
  true,
  '["Navigate to Exchange Online settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Medium',
  'Critical',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-EXO-037',
  'External Email Warnings Enabled',
  'Email security and compliance - External Email Warnings Enabled',
  'TG-EXO',
  'Email Security',
  'Exchange',
  'Medium', 4,
  'Automatic',
  'PowerShell',
  'Email security and compliance',
  '/organization/tenantAllowBlockLists/37',
  'isEnabled',
  'true',
  false,
  '["Navigate to Exchange Online settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Low',
  'High',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-EXO-038',
  'SMTP Authentication Blocked',
  'Email security and compliance - SMTP Authentication Blocked',
  'TG-EXO',
  'Authentication',
  'Exchange',
  'High', 7,
  'Automatic',
  'PowerShell',
  'Email security and compliance',
  '/organization/tenantAllowBlockLists/38',
  'isEnabled',
  'true',
  true,
  '["Navigate to Exchange Online settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Medium',
  'High',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-EXO-039',
  'Malware Scanning Enabled',
  'Email security and compliance - Malware Scanning Enabled',
  'TG-EXO',
  'Threat Protection',
  'Exchange',
  'Critical', 10,
  'Automatic',
  'PowerShell',
  'Email security and compliance',
  '/organization/tenantAllowBlockLists/39',
  'isEnabled',
  'true',
  true,
  '["Navigate to Exchange Online settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Medium',
  'Critical',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-EXO-040',
  'External Email Warnings Enabled',
  'Email security and compliance - External Email Warnings Enabled',
  'TG-EXO',
  'Email Security',
  'Exchange',
  'Medium', 4,
  'Automatic',
  'PowerShell',
  'Email security and compliance',
  '/organization/tenantAllowBlockLists/40',
  'isEnabled',
  'true',
  false,
  '["Navigate to Exchange Online settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Low',
  'High',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-EXO-041',
  'SMTP Authentication Blocked',
  'Email security and compliance - SMTP Authentication Blocked',
  'TG-EXO',
  'Authentication',
  'Exchange',
  'High', 7,
  'Automatic',
  'PowerShell',
  'Email security and compliance',
  '/organization/tenantAllowBlockLists/41',
  'isEnabled',
  'true',
  true,
  '["Navigate to Exchange Online settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Medium',
  'High',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-EXO-042',
  'Malware Scanning Enabled',
  'Email security and compliance - Malware Scanning Enabled',
  'TG-EXO',
  'Threat Protection',
  'Exchange',
  'Critical', 10,
  'Automatic',
  'PowerShell',
  'Email security and compliance',
  '/organization/tenantAllowBlockLists/42',
  'isEnabled',
  'true',
  true,
  '["Navigate to Exchange Online settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Medium',
  'Critical',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-EXO-043',
  'External Email Warnings Enabled',
  'Email security and compliance - External Email Warnings Enabled',
  'TG-EXO',
  'Email Security',
  'Exchange',
  'Medium', 4,
  'Automatic',
  'PowerShell',
  'Email security and compliance',
  '/organization/tenantAllowBlockLists/43',
  'isEnabled',
  'true',
  false,
  '["Navigate to Exchange Online settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Low',
  'High',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-EXO-044',
  'SMTP Authentication Blocked',
  'Email security and compliance - SMTP Authentication Blocked',
  'TG-EXO',
  'Authentication',
  'Exchange',
  'High', 7,
  'Automatic',
  'PowerShell',
  'Email security and compliance',
  '/organization/tenantAllowBlockLists/44',
  'isEnabled',
  'true',
  true,
  '["Navigate to Exchange Online settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Medium',
  'High',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-EXO-045',
  'Malware Scanning Enabled',
  'Email security and compliance - Malware Scanning Enabled',
  'TG-EXO',
  'Threat Protection',
  'Exchange',
  'Critical', 10,
  'Automatic',
  'PowerShell',
  'Email security and compliance',
  '/organization/tenantAllowBlockLists/45',
  'isEnabled',
  'true',
  true,
  '["Navigate to Exchange Online settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Medium',
  'Critical',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-EXO-046',
  'External Email Warnings Enabled',
  'Email security and compliance - External Email Warnings Enabled',
  'TG-EXO',
  'Email Security',
  'Exchange',
  'Medium', 4,
  'Automatic',
  'PowerShell',
  'Email security and compliance',
  '/organization/tenantAllowBlockLists/46',
  'isEnabled',
  'true',
  false,
  '["Navigate to Exchange Online settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Low',
  'High',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-EXO-047',
  'SMTP Authentication Blocked',
  'Email security and compliance - SMTP Authentication Blocked',
  'TG-EXO',
  'Authentication',
  'Exchange',
  'High', 7,
  'Automatic',
  'PowerShell',
  'Email security and compliance',
  '/organization/tenantAllowBlockLists/47',
  'isEnabled',
  'true',
  true,
  '["Navigate to Exchange Online settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Medium',
  'High',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-EXO-048',
  'Malware Scanning Enabled',
  'Email security and compliance - Malware Scanning Enabled',
  'TG-EXO',
  'Threat Protection',
  'Exchange',
  'Critical', 10,
  'Automatic',
  'PowerShell',
  'Email security and compliance',
  '/organization/tenantAllowBlockLists/48',
  'isEnabled',
  'true',
  true,
  '["Navigate to Exchange Online settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Medium',
  'Critical',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-EXO-049',
  'External Email Warnings Enabled',
  'Email security and compliance - External Email Warnings Enabled',
  'TG-EXO',
  'Email Security',
  'Exchange',
  'Medium', 4,
  'Automatic',
  'PowerShell',
  'Email security and compliance',
  '/organization/tenantAllowBlockLists/49',
  'isEnabled',
  'true',
  false,
  '["Navigate to Exchange Online settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Low',
  'High',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-EXO-050',
  'SMTP Authentication Blocked',
  'Email security and compliance - SMTP Authentication Blocked',
  'TG-EXO',
  'Authentication',
  'Exchange',
  'High', 7,
  'Automatic',
  'PowerShell',
  'Email security and compliance',
  '/organization/tenantAllowBlockLists/50',
  'isEnabled',
  'true',
  true,
  '["Navigate to Exchange Online settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Medium',
  'High',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-EXO-051',
  'Malware Scanning Enabled',
  'Email security and compliance - Malware Scanning Enabled',
  'TG-EXO',
  'Threat Protection',
  'Exchange',
  'Critical', 10,
  'Automatic',
  'PowerShell',
  'Email security and compliance',
  '/organization/tenantAllowBlockLists/51',
  'isEnabled',
  'true',
  true,
  '["Navigate to Exchange Online settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Medium',
  'Critical',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-EXO-052',
  'External Email Warnings Enabled',
  'Email security and compliance - External Email Warnings Enabled',
  'TG-EXO',
  'Email Security',
  'Exchange',
  'Medium', 4,
  'Automatic',
  'PowerShell',
  'Email security and compliance',
  '/organization/tenantAllowBlockLists/52',
  'isEnabled',
  'true',
  false,
  '["Navigate to Exchange Online settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Low',
  'High',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-EXO-053',
  'SMTP Authentication Blocked',
  'Email security and compliance - SMTP Authentication Blocked',
  'TG-EXO',
  'Authentication',
  'Exchange',
  'High', 7,
  'Automatic',
  'PowerShell',
  'Email security and compliance',
  '/organization/tenantAllowBlockLists/53',
  'isEnabled',
  'true',
  true,
  '["Navigate to Exchange Online settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Medium',
  'High',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-EXO-054',
  'Malware Scanning Enabled',
  'Email security and compliance - Malware Scanning Enabled',
  'TG-EXO',
  'Threat Protection',
  'Exchange',
  'Critical', 10,
  'Automatic',
  'PowerShell',
  'Email security and compliance',
  '/organization/tenantAllowBlockLists/54',
  'isEnabled',
  'true',
  true,
  '["Navigate to Exchange Online settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Medium',
  'Critical',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-EXO-055',
  'External Email Warnings Enabled',
  'Email security and compliance - External Email Warnings Enabled',
  'TG-EXO',
  'Email Security',
  'Exchange',
  'Medium', 4,
  'Automatic',
  'PowerShell',
  'Email security and compliance',
  '/organization/tenantAllowBlockLists/55',
  'isEnabled',
  'true',
  false,
  '["Navigate to Exchange Online settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Low',
  'High',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-EXO-056',
  'SMTP Authentication Blocked',
  'Email security and compliance - SMTP Authentication Blocked',
  'TG-EXO',
  'Authentication',
  'Exchange',
  'High', 7,
  'Automatic',
  'PowerShell',
  'Email security and compliance',
  '/organization/tenantAllowBlockLists/56',
  'isEnabled',
  'true',
  true,
  '["Navigate to Exchange Online settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Medium',
  'High',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-EXO-057',
  'Malware Scanning Enabled',
  'Email security and compliance - Malware Scanning Enabled',
  'TG-EXO',
  'Threat Protection',
  'Exchange',
  'Critical', 10,
  'Automatic',
  'PowerShell',
  'Email security and compliance',
  '/organization/tenantAllowBlockLists/57',
  'isEnabled',
  'true',
  true,
  '["Navigate to Exchange Online settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Medium',
  'Critical',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-EXO-058',
  'External Email Warnings Enabled',
  'Email security and compliance - External Email Warnings Enabled',
  'TG-EXO',
  'Email Security',
  'Exchange',
  'Medium', 4,
  'Automatic',
  'PowerShell',
  'Email security and compliance',
  '/organization/tenantAllowBlockLists/58',
  'isEnabled',
  'true',
  false,
  '["Navigate to Exchange Online settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Low',
  'High',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-EXO-059',
  'SMTP Authentication Blocked',
  'Email security and compliance - SMTP Authentication Blocked',
  'TG-EXO',
  'Authentication',
  'Exchange',
  'High', 7,
  'Automatic',
  'PowerShell',
  'Email security and compliance',
  '/organization/tenantAllowBlockLists/59',
  'isEnabled',
  'true',
  true,
  '["Navigate to Exchange Online settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Medium',
  'High',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-EXO-060',
  'Malware Scanning Enabled',
  'Email security and compliance - Malware Scanning Enabled',
  'TG-EXO',
  'Threat Protection',
  'Exchange',
  'Critical', 10,
  'Automatic',
  'PowerShell',
  'Email security and compliance',
  '/organization/tenantAllowBlockLists/60',
  'isEnabled',
  'true',
  true,
  '["Navigate to Exchange Online settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Medium',
  'Critical',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-EXO-061',
  'External Email Warnings Enabled',
  'Email security and compliance - External Email Warnings Enabled',
  'TG-EXO',
  'Email Security',
  'Exchange',
  'Medium', 4,
  'Automatic',
  'PowerShell',
  'Email security and compliance',
  '/organization/tenantAllowBlockLists/61',
  'isEnabled',
  'true',
  false,
  '["Navigate to Exchange Online settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Low',
  'High',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-EXO-062',
  'SMTP Authentication Blocked',
  'Email security and compliance - SMTP Authentication Blocked',
  'TG-EXO',
  'Authentication',
  'Exchange',
  'High', 7,
  'Automatic',
  'PowerShell',
  'Email security and compliance',
  '/organization/tenantAllowBlockLists/62',
  'isEnabled',
  'true',
  true,
  '["Navigate to Exchange Online settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Medium',
  'High',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-EXO-063',
  'Malware Scanning Enabled',
  'Email security and compliance - Malware Scanning Enabled',
  'TG-EXO',
  'Threat Protection',
  'Exchange',
  'Critical', 10,
  'Automatic',
  'PowerShell',
  'Email security and compliance',
  '/organization/tenantAllowBlockLists/63',
  'isEnabled',
  'true',
  true,
  '["Navigate to Exchange Online settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Medium',
  'Critical',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-EXO-064',
  'External Email Warnings Enabled',
  'Email security and compliance - External Email Warnings Enabled',
  'TG-EXO',
  'Email Security',
  'Exchange',
  'Medium', 4,
  'Automatic',
  'PowerShell',
  'Email security and compliance',
  '/organization/tenantAllowBlockLists/64',
  'isEnabled',
  'true',
  false,
  '["Navigate to Exchange Online settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Low',
  'High',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-EXO-065',
  'SMTP Authentication Blocked',
  'Email security and compliance - SMTP Authentication Blocked',
  'TG-EXO',
  'Authentication',
  'Exchange',
  'High', 7,
  'Automatic',
  'PowerShell',
  'Email security and compliance',
  '/organization/tenantAllowBlockLists/65',
  'isEnabled',
  'true',
  true,
  '["Navigate to Exchange Online settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Medium',
  'High',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-EXO-066',
  'Malware Scanning Enabled',
  'Email security and compliance - Malware Scanning Enabled',
  'TG-EXO',
  'Threat Protection',
  'Exchange',
  'Critical', 10,
  'Automatic',
  'PowerShell',
  'Email security and compliance',
  '/organization/tenantAllowBlockLists/66',
  'isEnabled',
  'true',
  true,
  '["Navigate to Exchange Online settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Medium',
  'Critical',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-EXO-067',
  'External Email Warnings Enabled',
  'Email security and compliance - External Email Warnings Enabled',
  'TG-EXO',
  'Email Security',
  'Exchange',
  'Medium', 4,
  'Automatic',
  'PowerShell',
  'Email security and compliance',
  '/organization/tenantAllowBlockLists/67',
  'isEnabled',
  'true',
  false,
  '["Navigate to Exchange Online settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Low',
  'High',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-EXO-068',
  'SMTP Authentication Blocked',
  'Email security and compliance - SMTP Authentication Blocked',
  'TG-EXO',
  'Authentication',
  'Exchange',
  'High', 7,
  'Automatic',
  'PowerShell',
  'Email security and compliance',
  '/organization/tenantAllowBlockLists/68',
  'isEnabled',
  'true',
  true,
  '["Navigate to Exchange Online settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Medium',
  'High',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-EXO-069',
  'Malware Scanning Enabled',
  'Email security and compliance - Malware Scanning Enabled',
  'TG-EXO',
  'Threat Protection',
  'Exchange',
  'Critical', 10,
  'Automatic',
  'PowerShell',
  'Email security and compliance',
  '/organization/tenantAllowBlockLists/69',
  'isEnabled',
  'true',
  true,
  '["Navigate to Exchange Online settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Medium',
  'Critical',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-EXO-070',
  'External Email Warnings Enabled',
  'Email security and compliance - External Email Warnings Enabled',
  'TG-EXO',
  'Email Security',
  'Exchange',
  'Medium', 4,
  'Automatic',
  'PowerShell',
  'Email security and compliance',
  '/organization/tenantAllowBlockLists/70',
  'isEnabled',
  'true',
  false,
  '["Navigate to Exchange Online settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Low',
  'High',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-EXO-071',
  'SMTP Authentication Blocked',
  'Email security and compliance - SMTP Authentication Blocked',
  'TG-EXO',
  'Authentication',
  'Exchange',
  'High', 7,
  'Automatic',
  'PowerShell',
  'Email security and compliance',
  '/organization/tenantAllowBlockLists/71',
  'isEnabled',
  'true',
  true,
  '["Navigate to Exchange Online settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Medium',
  'High',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-EXO-072',
  'Malware Scanning Enabled',
  'Email security and compliance - Malware Scanning Enabled',
  'TG-EXO',
  'Threat Protection',
  'Exchange',
  'Critical', 10,
  'Automatic',
  'PowerShell',
  'Email security and compliance',
  '/organization/tenantAllowBlockLists/72',
  'isEnabled',
  'true',
  true,
  '["Navigate to Exchange Online settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Medium',
  'Critical',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-EXO-073',
  'External Email Warnings Enabled',
  'Email security and compliance - External Email Warnings Enabled',
  'TG-EXO',
  'Email Security',
  'Exchange',
  'Medium', 4,
  'Automatic',
  'PowerShell',
  'Email security and compliance',
  '/organization/tenantAllowBlockLists/73',
  'isEnabled',
  'true',
  false,
  '["Navigate to Exchange Online settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Low',
  'High',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-EXO-074',
  'SMTP Authentication Blocked',
  'Email security and compliance - SMTP Authentication Blocked',
  'TG-EXO',
  'Authentication',
  'Exchange',
  'High', 7,
  'Automatic',
  'PowerShell',
  'Email security and compliance',
  '/organization/tenantAllowBlockLists/74',
  'isEnabled',
  'true',
  true,
  '["Navigate to Exchange Online settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Medium',
  'High',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-EXO-075',
  'Malware Scanning Enabled',
  'Email security and compliance - Malware Scanning Enabled',
  'TG-EXO',
  'Threat Protection',
  'Exchange',
  'Critical', 10,
  'Automatic',
  'PowerShell',
  'Email security and compliance',
  '/organization/tenantAllowBlockLists/75',
  'isEnabled',
  'true',
  true,
  '["Navigate to Exchange Online settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Medium',
  'Critical',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-EXO-076',
  'External Email Warnings Enabled',
  'Email security and compliance - External Email Warnings Enabled',
  'TG-EXO',
  'Email Security',
  'Exchange',
  'Medium', 4,
  'Automatic',
  'PowerShell',
  'Email security and compliance',
  '/organization/tenantAllowBlockLists/76',
  'isEnabled',
  'true',
  false,
  '["Navigate to Exchange Online settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Low',
  'High',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-EXO-077',
  'SMTP Authentication Blocked',
  'Email security and compliance - SMTP Authentication Blocked',
  'TG-EXO',
  'Authentication',
  'Exchange',
  'High', 7,
  'Automatic',
  'PowerShell',
  'Email security and compliance',
  '/organization/tenantAllowBlockLists/77',
  'isEnabled',
  'true',
  true,
  '["Navigate to Exchange Online settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Medium',
  'High',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-EXO-078',
  'Malware Scanning Enabled',
  'Email security and compliance - Malware Scanning Enabled',
  'TG-EXO',
  'Threat Protection',
  'Exchange',
  'Critical', 10,
  'Automatic',
  'PowerShell',
  'Email security and compliance',
  '/organization/tenantAllowBlockLists/78',
  'isEnabled',
  'true',
  true,
  '["Navigate to Exchange Online settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Medium',
  'Critical',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-EXO-079',
  'External Email Warnings Enabled',
  'Email security and compliance - External Email Warnings Enabled',
  'TG-EXO',
  'Email Security',
  'Exchange',
  'Medium', 4,
  'Automatic',
  'PowerShell',
  'Email security and compliance',
  '/organization/tenantAllowBlockLists/79',
  'isEnabled',
  'true',
  false,
  '["Navigate to Exchange Online settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Low',
  'High',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-EXO-080',
  'SMTP Authentication Blocked',
  'Email security and compliance - SMTP Authentication Blocked',
  'TG-EXO',
  'Authentication',
  'Exchange',
  'High', 7,
  'Automatic',
  'PowerShell',
  'Email security and compliance',
  '/organization/tenantAllowBlockLists/80',
  'isEnabled',
  'true',
  true,
  '["Navigate to Exchange Online settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Medium',
  'High',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-SPO-001',
  'SharePoint Sharing Policy Configured',
  'SharePoint security and sharing policies - SharePoint Sharing Policy Configured',
  'TG-SPO',
  'Sharing',
  'SharePoint',
  'High', 7,
  'Automatic',
  'Graph API',
  'SharePoint security and sharing policies',
  '/sharepoint/sites/1',
  'isEnabled',
  'true',
  true,
  '["Navigate to SharePoint Online settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Medium',
  'High',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-SPO-002',
  'Anyone Links Disabled',
  'SharePoint security and sharing policies - Anyone Links Disabled',
  'TG-SPO',
  'Sharing',
  'SharePoint',
  'High', 7,
  'Automatic',
  'Graph API',
  'SharePoint security and sharing policies',
  '/sharepoint/sites/2',
  'isEnabled',
  'true',
  true,
  '["Navigate to SharePoint Online settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Medium',
  'High',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-SPO-003',
  'External User Expiration Configured',
  'SharePoint security and sharing policies - External User Expiration Configured',
  'TG-SPO',
  'Access Control',
  'SharePoint',
  'Medium', 4,
  'Automatic',
  'Graph API',
  'SharePoint security and sharing policies',
  '/sharepoint/sites/3',
  'isEnabled',
  'true',
  false,
  '["Navigate to SharePoint Online settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Low',
  'High',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-SPO-004',
  'SharePoint Sharing Policy Configured',
  'SharePoint security and sharing policies - SharePoint Sharing Policy Configured',
  'TG-SPO',
  'Sharing',
  'SharePoint',
  'High', 7,
  'Automatic',
  'Graph API',
  'SharePoint security and sharing policies',
  '/sharepoint/sites/4',
  'isEnabled',
  'true',
  true,
  '["Navigate to SharePoint Online settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Medium',
  'High',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-SPO-005',
  'Anyone Links Disabled',
  'SharePoint security and sharing policies - Anyone Links Disabled',
  'TG-SPO',
  'Sharing',
  'SharePoint',
  'High', 7,
  'Automatic',
  'Graph API',
  'SharePoint security and sharing policies',
  '/sharepoint/sites/5',
  'isEnabled',
  'true',
  true,
  '["Navigate to SharePoint Online settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Medium',
  'High',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-SPO-006',
  'External User Expiration Configured',
  'SharePoint security and sharing policies - External User Expiration Configured',
  'TG-SPO',
  'Access Control',
  'SharePoint',
  'Medium', 4,
  'Automatic',
  'Graph API',
  'SharePoint security and sharing policies',
  '/sharepoint/sites/6',
  'isEnabled',
  'true',
  false,
  '["Navigate to SharePoint Online settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Low',
  'High',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-SPO-007',
  'SharePoint Sharing Policy Configured',
  'SharePoint security and sharing policies - SharePoint Sharing Policy Configured',
  'TG-SPO',
  'Sharing',
  'SharePoint',
  'High', 7,
  'Automatic',
  'Graph API',
  'SharePoint security and sharing policies',
  '/sharepoint/sites/7',
  'isEnabled',
  'true',
  true,
  '["Navigate to SharePoint Online settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Medium',
  'High',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-SPO-008',
  'Anyone Links Disabled',
  'SharePoint security and sharing policies - Anyone Links Disabled',
  'TG-SPO',
  'Sharing',
  'SharePoint',
  'High', 7,
  'Automatic',
  'Graph API',
  'SharePoint security and sharing policies',
  '/sharepoint/sites/8',
  'isEnabled',
  'true',
  true,
  '["Navigate to SharePoint Online settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Medium',
  'High',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-SPO-009',
  'External User Expiration Configured',
  'SharePoint security and sharing policies - External User Expiration Configured',
  'TG-SPO',
  'Access Control',
  'SharePoint',
  'Medium', 4,
  'Automatic',
  'Graph API',
  'SharePoint security and sharing policies',
  '/sharepoint/sites/9',
  'isEnabled',
  'true',
  false,
  '["Navigate to SharePoint Online settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Low',
  'High',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-SPO-010',
  'SharePoint Sharing Policy Configured',
  'SharePoint security and sharing policies - SharePoint Sharing Policy Configured',
  'TG-SPO',
  'Sharing',
  'SharePoint',
  'High', 7,
  'Automatic',
  'Graph API',
  'SharePoint security and sharing policies',
  '/sharepoint/sites/10',
  'isEnabled',
  'true',
  true,
  '["Navigate to SharePoint Online settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Medium',
  'High',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-SPO-011',
  'Anyone Links Disabled',
  'SharePoint security and sharing policies - Anyone Links Disabled',
  'TG-SPO',
  'Sharing',
  'SharePoint',
  'High', 7,
  'Automatic',
  'Graph API',
  'SharePoint security and sharing policies',
  '/sharepoint/sites/11',
  'isEnabled',
  'true',
  true,
  '["Navigate to SharePoint Online settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Medium',
  'High',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-SPO-012',
  'External User Expiration Configured',
  'SharePoint security and sharing policies - External User Expiration Configured',
  'TG-SPO',
  'Access Control',
  'SharePoint',
  'Medium', 4,
  'Automatic',
  'Graph API',
  'SharePoint security and sharing policies',
  '/sharepoint/sites/12',
  'isEnabled',
  'true',
  false,
  '["Navigate to SharePoint Online settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Low',
  'High',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-SPO-013',
  'SharePoint Sharing Policy Configured',
  'SharePoint security and sharing policies - SharePoint Sharing Policy Configured',
  'TG-SPO',
  'Sharing',
  'SharePoint',
  'High', 7,
  'Automatic',
  'Graph API',
  'SharePoint security and sharing policies',
  '/sharepoint/sites/13',
  'isEnabled',
  'true',
  true,
  '["Navigate to SharePoint Online settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Medium',
  'High',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-SPO-014',
  'Anyone Links Disabled',
  'SharePoint security and sharing policies - Anyone Links Disabled',
  'TG-SPO',
  'Sharing',
  'SharePoint',
  'High', 7,
  'Automatic',
  'Graph API',
  'SharePoint security and sharing policies',
  '/sharepoint/sites/14',
  'isEnabled',
  'true',
  true,
  '["Navigate to SharePoint Online settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Medium',
  'High',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-SPO-015',
  'External User Expiration Configured',
  'SharePoint security and sharing policies - External User Expiration Configured',
  'TG-SPO',
  'Access Control',
  'SharePoint',
  'Medium', 4,
  'Automatic',
  'Graph API',
  'SharePoint security and sharing policies',
  '/sharepoint/sites/15',
  'isEnabled',
  'true',
  false,
  '["Navigate to SharePoint Online settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Low',
  'High',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-SPO-016',
  'SharePoint Sharing Policy Configured',
  'SharePoint security and sharing policies - SharePoint Sharing Policy Configured',
  'TG-SPO',
  'Sharing',
  'SharePoint',
  'High', 7,
  'Automatic',
  'Graph API',
  'SharePoint security and sharing policies',
  '/sharepoint/sites/16',
  'isEnabled',
  'true',
  true,
  '["Navigate to SharePoint Online settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Medium',
  'High',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-SPO-017',
  'Anyone Links Disabled',
  'SharePoint security and sharing policies - Anyone Links Disabled',
  'TG-SPO',
  'Sharing',
  'SharePoint',
  'High', 7,
  'Automatic',
  'Graph API',
  'SharePoint security and sharing policies',
  '/sharepoint/sites/17',
  'isEnabled',
  'true',
  true,
  '["Navigate to SharePoint Online settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Medium',
  'High',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-SPO-018',
  'External User Expiration Configured',
  'SharePoint security and sharing policies - External User Expiration Configured',
  'TG-SPO',
  'Access Control',
  'SharePoint',
  'Medium', 4,
  'Automatic',
  'Graph API',
  'SharePoint security and sharing policies',
  '/sharepoint/sites/18',
  'isEnabled',
  'true',
  false,
  '["Navigate to SharePoint Online settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Low',
  'High',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-SPO-019',
  'SharePoint Sharing Policy Configured',
  'SharePoint security and sharing policies - SharePoint Sharing Policy Configured',
  'TG-SPO',
  'Sharing',
  'SharePoint',
  'High', 7,
  'Automatic',
  'Graph API',
  'SharePoint security and sharing policies',
  '/sharepoint/sites/19',
  'isEnabled',
  'true',
  true,
  '["Navigate to SharePoint Online settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Medium',
  'High',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-SPO-020',
  'Anyone Links Disabled',
  'SharePoint security and sharing policies - Anyone Links Disabled',
  'TG-SPO',
  'Sharing',
  'SharePoint',
  'High', 7,
  'Automatic',
  'Graph API',
  'SharePoint security and sharing policies',
  '/sharepoint/sites/20',
  'isEnabled',
  'true',
  true,
  '["Navigate to SharePoint Online settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Medium',
  'High',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-SPO-021',
  'External User Expiration Configured',
  'SharePoint security and sharing policies - External User Expiration Configured',
  'TG-SPO',
  'Access Control',
  'SharePoint',
  'Medium', 4,
  'Automatic',
  'Graph API',
  'SharePoint security and sharing policies',
  '/sharepoint/sites/21',
  'isEnabled',
  'true',
  false,
  '["Navigate to SharePoint Online settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Low',
  'High',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-SPO-022',
  'SharePoint Sharing Policy Configured',
  'SharePoint security and sharing policies - SharePoint Sharing Policy Configured',
  'TG-SPO',
  'Sharing',
  'SharePoint',
  'High', 7,
  'Automatic',
  'Graph API',
  'SharePoint security and sharing policies',
  '/sharepoint/sites/22',
  'isEnabled',
  'true',
  true,
  '["Navigate to SharePoint Online settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Medium',
  'High',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-SPO-023',
  'Anyone Links Disabled',
  'SharePoint security and sharing policies - Anyone Links Disabled',
  'TG-SPO',
  'Sharing',
  'SharePoint',
  'High', 7,
  'Automatic',
  'Graph API',
  'SharePoint security and sharing policies',
  '/sharepoint/sites/23',
  'isEnabled',
  'true',
  true,
  '["Navigate to SharePoint Online settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Medium',
  'High',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-SPO-024',
  'External User Expiration Configured',
  'SharePoint security and sharing policies - External User Expiration Configured',
  'TG-SPO',
  'Access Control',
  'SharePoint',
  'Medium', 4,
  'Automatic',
  'Graph API',
  'SharePoint security and sharing policies',
  '/sharepoint/sites/24',
  'isEnabled',
  'true',
  false,
  '["Navigate to SharePoint Online settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Low',
  'High',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-SPO-025',
  'SharePoint Sharing Policy Configured',
  'SharePoint security and sharing policies - SharePoint Sharing Policy Configured',
  'TG-SPO',
  'Sharing',
  'SharePoint',
  'High', 7,
  'Automatic',
  'Graph API',
  'SharePoint security and sharing policies',
  '/sharepoint/sites/25',
  'isEnabled',
  'true',
  true,
  '["Navigate to SharePoint Online settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Medium',
  'High',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-SPO-026',
  'Anyone Links Disabled',
  'SharePoint security and sharing policies - Anyone Links Disabled',
  'TG-SPO',
  'Sharing',
  'SharePoint',
  'High', 7,
  'Automatic',
  'Graph API',
  'SharePoint security and sharing policies',
  '/sharepoint/sites/26',
  'isEnabled',
  'true',
  true,
  '["Navigate to SharePoint Online settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Medium',
  'High',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-SPO-027',
  'External User Expiration Configured',
  'SharePoint security and sharing policies - External User Expiration Configured',
  'TG-SPO',
  'Access Control',
  'SharePoint',
  'Medium', 4,
  'Automatic',
  'Graph API',
  'SharePoint security and sharing policies',
  '/sharepoint/sites/27',
  'isEnabled',
  'true',
  false,
  '["Navigate to SharePoint Online settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Low',
  'High',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-SPO-028',
  'SharePoint Sharing Policy Configured',
  'SharePoint security and sharing policies - SharePoint Sharing Policy Configured',
  'TG-SPO',
  'Sharing',
  'SharePoint',
  'High', 7,
  'Automatic',
  'Graph API',
  'SharePoint security and sharing policies',
  '/sharepoint/sites/28',
  'isEnabled',
  'true',
  true,
  '["Navigate to SharePoint Online settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Medium',
  'High',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-SPO-029',
  'Anyone Links Disabled',
  'SharePoint security and sharing policies - Anyone Links Disabled',
  'TG-SPO',
  'Sharing',
  'SharePoint',
  'High', 7,
  'Automatic',
  'Graph API',
  'SharePoint security and sharing policies',
  '/sharepoint/sites/29',
  'isEnabled',
  'true',
  true,
  '["Navigate to SharePoint Online settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Medium',
  'High',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-SPO-030',
  'External User Expiration Configured',
  'SharePoint security and sharing policies - External User Expiration Configured',
  'TG-SPO',
  'Access Control',
  'SharePoint',
  'Medium', 4,
  'Automatic',
  'Graph API',
  'SharePoint security and sharing policies',
  '/sharepoint/sites/30',
  'isEnabled',
  'true',
  false,
  '["Navigate to SharePoint Online settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Low',
  'High',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-SPO-031',
  'SharePoint Sharing Policy Configured',
  'SharePoint security and sharing policies - SharePoint Sharing Policy Configured',
  'TG-SPO',
  'Sharing',
  'SharePoint',
  'High', 7,
  'Automatic',
  'Graph API',
  'SharePoint security and sharing policies',
  '/sharepoint/sites/31',
  'isEnabled',
  'true',
  true,
  '["Navigate to SharePoint Online settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Medium',
  'High',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-SPO-032',
  'Anyone Links Disabled',
  'SharePoint security and sharing policies - Anyone Links Disabled',
  'TG-SPO',
  'Sharing',
  'SharePoint',
  'High', 7,
  'Automatic',
  'Graph API',
  'SharePoint security and sharing policies',
  '/sharepoint/sites/32',
  'isEnabled',
  'true',
  true,
  '["Navigate to SharePoint Online settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Medium',
  'High',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-SPO-033',
  'External User Expiration Configured',
  'SharePoint security and sharing policies - External User Expiration Configured',
  'TG-SPO',
  'Access Control',
  'SharePoint',
  'Medium', 4,
  'Automatic',
  'Graph API',
  'SharePoint security and sharing policies',
  '/sharepoint/sites/33',
  'isEnabled',
  'true',
  false,
  '["Navigate to SharePoint Online settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Low',
  'High',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-SPO-034',
  'SharePoint Sharing Policy Configured',
  'SharePoint security and sharing policies - SharePoint Sharing Policy Configured',
  'TG-SPO',
  'Sharing',
  'SharePoint',
  'High', 7,
  'Automatic',
  'Graph API',
  'SharePoint security and sharing policies',
  '/sharepoint/sites/34',
  'isEnabled',
  'true',
  true,
  '["Navigate to SharePoint Online settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Medium',
  'High',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-SPO-035',
  'Anyone Links Disabled',
  'SharePoint security and sharing policies - Anyone Links Disabled',
  'TG-SPO',
  'Sharing',
  'SharePoint',
  'High', 7,
  'Automatic',
  'Graph API',
  'SharePoint security and sharing policies',
  '/sharepoint/sites/35',
  'isEnabled',
  'true',
  true,
  '["Navigate to SharePoint Online settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Medium',
  'High',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-SPO-036',
  'External User Expiration Configured',
  'SharePoint security and sharing policies - External User Expiration Configured',
  'TG-SPO',
  'Access Control',
  'SharePoint',
  'Medium', 4,
  'Automatic',
  'Graph API',
  'SharePoint security and sharing policies',
  '/sharepoint/sites/36',
  'isEnabled',
  'true',
  false,
  '["Navigate to SharePoint Online settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Low',
  'High',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-SPO-037',
  'SharePoint Sharing Policy Configured',
  'SharePoint security and sharing policies - SharePoint Sharing Policy Configured',
  'TG-SPO',
  'Sharing',
  'SharePoint',
  'High', 7,
  'Automatic',
  'Graph API',
  'SharePoint security and sharing policies',
  '/sharepoint/sites/37',
  'isEnabled',
  'true',
  true,
  '["Navigate to SharePoint Online settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Medium',
  'High',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-SPO-038',
  'Anyone Links Disabled',
  'SharePoint security and sharing policies - Anyone Links Disabled',
  'TG-SPO',
  'Sharing',
  'SharePoint',
  'High', 7,
  'Automatic',
  'Graph API',
  'SharePoint security and sharing policies',
  '/sharepoint/sites/38',
  'isEnabled',
  'true',
  true,
  '["Navigate to SharePoint Online settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Medium',
  'High',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-SPO-039',
  'External User Expiration Configured',
  'SharePoint security and sharing policies - External User Expiration Configured',
  'TG-SPO',
  'Access Control',
  'SharePoint',
  'Medium', 4,
  'Automatic',
  'Graph API',
  'SharePoint security and sharing policies',
  '/sharepoint/sites/39',
  'isEnabled',
  'true',
  false,
  '["Navigate to SharePoint Online settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Low',
  'High',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-SPO-040',
  'SharePoint Sharing Policy Configured',
  'SharePoint security and sharing policies - SharePoint Sharing Policy Configured',
  'TG-SPO',
  'Sharing',
  'SharePoint',
  'High', 7,
  'Automatic',
  'Graph API',
  'SharePoint security and sharing policies',
  '/sharepoint/sites/40',
  'isEnabled',
  'true',
  true,
  '["Navigate to SharePoint Online settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Medium',
  'High',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-SPO-041',
  'Anyone Links Disabled',
  'SharePoint security and sharing policies - Anyone Links Disabled',
  'TG-SPO',
  'Sharing',
  'SharePoint',
  'High', 7,
  'Automatic',
  'Graph API',
  'SharePoint security and sharing policies',
  '/sharepoint/sites/41',
  'isEnabled',
  'true',
  true,
  '["Navigate to SharePoint Online settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Medium',
  'High',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-SPO-042',
  'External User Expiration Configured',
  'SharePoint security and sharing policies - External User Expiration Configured',
  'TG-SPO',
  'Access Control',
  'SharePoint',
  'Medium', 4,
  'Automatic',
  'Graph API',
  'SharePoint security and sharing policies',
  '/sharepoint/sites/42',
  'isEnabled',
  'true',
  false,
  '["Navigate to SharePoint Online settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Low',
  'High',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-SPO-043',
  'SharePoint Sharing Policy Configured',
  'SharePoint security and sharing policies - SharePoint Sharing Policy Configured',
  'TG-SPO',
  'Sharing',
  'SharePoint',
  'High', 7,
  'Automatic',
  'Graph API',
  'SharePoint security and sharing policies',
  '/sharepoint/sites/43',
  'isEnabled',
  'true',
  true,
  '["Navigate to SharePoint Online settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Medium',
  'High',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-SPO-044',
  'Anyone Links Disabled',
  'SharePoint security and sharing policies - Anyone Links Disabled',
  'TG-SPO',
  'Sharing',
  'SharePoint',
  'High', 7,
  'Automatic',
  'Graph API',
  'SharePoint security and sharing policies',
  '/sharepoint/sites/44',
  'isEnabled',
  'true',
  true,
  '["Navigate to SharePoint Online settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Medium',
  'High',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-SPO-045',
  'External User Expiration Configured',
  'SharePoint security and sharing policies - External User Expiration Configured',
  'TG-SPO',
  'Access Control',
  'SharePoint',
  'Medium', 4,
  'Automatic',
  'Graph API',
  'SharePoint security and sharing policies',
  '/sharepoint/sites/45',
  'isEnabled',
  'true',
  false,
  '["Navigate to SharePoint Online settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Low',
  'High',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-SPO-046',
  'SharePoint Sharing Policy Configured',
  'SharePoint security and sharing policies - SharePoint Sharing Policy Configured',
  'TG-SPO',
  'Sharing',
  'SharePoint',
  'High', 7,
  'Automatic',
  'Graph API',
  'SharePoint security and sharing policies',
  '/sharepoint/sites/46',
  'isEnabled',
  'true',
  true,
  '["Navigate to SharePoint Online settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Medium',
  'High',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-SPO-047',
  'Anyone Links Disabled',
  'SharePoint security and sharing policies - Anyone Links Disabled',
  'TG-SPO',
  'Sharing',
  'SharePoint',
  'High', 7,
  'Automatic',
  'Graph API',
  'SharePoint security and sharing policies',
  '/sharepoint/sites/47',
  'isEnabled',
  'true',
  true,
  '["Navigate to SharePoint Online settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Medium',
  'High',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-SPO-048',
  'External User Expiration Configured',
  'SharePoint security and sharing policies - External User Expiration Configured',
  'TG-SPO',
  'Access Control',
  'SharePoint',
  'Medium', 4,
  'Automatic',
  'Graph API',
  'SharePoint security and sharing policies',
  '/sharepoint/sites/48',
  'isEnabled',
  'true',
  false,
  '["Navigate to SharePoint Online settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Low',
  'High',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-SPO-049',
  'SharePoint Sharing Policy Configured',
  'SharePoint security and sharing policies - SharePoint Sharing Policy Configured',
  'TG-SPO',
  'Sharing',
  'SharePoint',
  'High', 7,
  'Automatic',
  'Graph API',
  'SharePoint security and sharing policies',
  '/sharepoint/sites/49',
  'isEnabled',
  'true',
  true,
  '["Navigate to SharePoint Online settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Medium',
  'High',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-SPO-050',
  'Anyone Links Disabled',
  'SharePoint security and sharing policies - Anyone Links Disabled',
  'TG-SPO',
  'Sharing',
  'SharePoint',
  'High', 7,
  'Automatic',
  'Graph API',
  'SharePoint security and sharing policies',
  '/sharepoint/sites/50',
  'isEnabled',
  'true',
  true,
  '["Navigate to SharePoint Online settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Medium',
  'High',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-SPO-051',
  'External User Expiration Configured',
  'SharePoint security and sharing policies - External User Expiration Configured',
  'TG-SPO',
  'Access Control',
  'SharePoint',
  'Medium', 4,
  'Automatic',
  'Graph API',
  'SharePoint security and sharing policies',
  '/sharepoint/sites/51',
  'isEnabled',
  'true',
  false,
  '["Navigate to SharePoint Online settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Low',
  'High',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-SPO-052',
  'SharePoint Sharing Policy Configured',
  'SharePoint security and sharing policies - SharePoint Sharing Policy Configured',
  'TG-SPO',
  'Sharing',
  'SharePoint',
  'High', 7,
  'Automatic',
  'Graph API',
  'SharePoint security and sharing policies',
  '/sharepoint/sites/52',
  'isEnabled',
  'true',
  true,
  '["Navigate to SharePoint Online settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Medium',
  'High',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-SPO-053',
  'Anyone Links Disabled',
  'SharePoint security and sharing policies - Anyone Links Disabled',
  'TG-SPO',
  'Sharing',
  'SharePoint',
  'High', 7,
  'Automatic',
  'Graph API',
  'SharePoint security and sharing policies',
  '/sharepoint/sites/53',
  'isEnabled',
  'true',
  true,
  '["Navigate to SharePoint Online settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Medium',
  'High',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-SPO-054',
  'External User Expiration Configured',
  'SharePoint security and sharing policies - External User Expiration Configured',
  'TG-SPO',
  'Access Control',
  'SharePoint',
  'Medium', 4,
  'Automatic',
  'Graph API',
  'SharePoint security and sharing policies',
  '/sharepoint/sites/54',
  'isEnabled',
  'true',
  false,
  '["Navigate to SharePoint Online settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Low',
  'High',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-SPO-055',
  'SharePoint Sharing Policy Configured',
  'SharePoint security and sharing policies - SharePoint Sharing Policy Configured',
  'TG-SPO',
  'Sharing',
  'SharePoint',
  'High', 7,
  'Automatic',
  'Graph API',
  'SharePoint security and sharing policies',
  '/sharepoint/sites/55',
  'isEnabled',
  'true',
  true,
  '["Navigate to SharePoint Online settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Medium',
  'High',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-SPO-056',
  'Anyone Links Disabled',
  'SharePoint security and sharing policies - Anyone Links Disabled',
  'TG-SPO',
  'Sharing',
  'SharePoint',
  'High', 7,
  'Automatic',
  'Graph API',
  'SharePoint security and sharing policies',
  '/sharepoint/sites/56',
  'isEnabled',
  'true',
  true,
  '["Navigate to SharePoint Online settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Medium',
  'High',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-SPO-057',
  'External User Expiration Configured',
  'SharePoint security and sharing policies - External User Expiration Configured',
  'TG-SPO',
  'Access Control',
  'SharePoint',
  'Medium', 4,
  'Automatic',
  'Graph API',
  'SharePoint security and sharing policies',
  '/sharepoint/sites/57',
  'isEnabled',
  'true',
  false,
  '["Navigate to SharePoint Online settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Low',
  'High',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-SPO-058',
  'SharePoint Sharing Policy Configured',
  'SharePoint security and sharing policies - SharePoint Sharing Policy Configured',
  'TG-SPO',
  'Sharing',
  'SharePoint',
  'High', 7,
  'Automatic',
  'Graph API',
  'SharePoint security and sharing policies',
  '/sharepoint/sites/58',
  'isEnabled',
  'true',
  true,
  '["Navigate to SharePoint Online settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Medium',
  'High',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-SPO-059',
  'Anyone Links Disabled',
  'SharePoint security and sharing policies - Anyone Links Disabled',
  'TG-SPO',
  'Sharing',
  'SharePoint',
  'High', 7,
  'Automatic',
  'Graph API',
  'SharePoint security and sharing policies',
  '/sharepoint/sites/59',
  'isEnabled',
  'true',
  true,
  '["Navigate to SharePoint Online settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Medium',
  'High',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-SPO-060',
  'External User Expiration Configured',
  'SharePoint security and sharing policies - External User Expiration Configured',
  'TG-SPO',
  'Access Control',
  'SharePoint',
  'Medium', 4,
  'Automatic',
  'Graph API',
  'SharePoint security and sharing policies',
  '/sharepoint/sites/60',
  'isEnabled',
  'true',
  false,
  '["Navigate to SharePoint Online settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Low',
  'High',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-TEAMS-001',
  'Guest Access Controlled',
  'Teams security and governance - Guest Access Controlled',
  'TG-TEAMS',
  'Guest Management',
  'Teams',
  'High', 7,
  'Automatic',
  'Graph API',
  'Teams security and governance',
  '/teams/teamsAppSettings/1',
  'isEnabled',
  'true',
  true,
  '["Navigate to Microsoft Teams settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Medium',
  'High',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-TEAMS-002',
  'External File Sharing Restricted',
  'Teams security and governance - External File Sharing Restricted',
  'TG-TEAMS',
  'File Sharing',
  'Teams',
  'Medium', 4,
  'Automatic',
  'Graph API',
  'Teams security and governance',
  '/teams/teamsAppSettings/2',
  'isEnabled',
  'true',
  false,
  '["Navigate to Microsoft Teams settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Low',
  'High',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-TEAMS-003',
  'Recorded Meetings Retention Configured',
  'Teams security and governance - Recorded Meetings Retention Configured',
  'TG-TEAMS',
  'Data Retention',
  'Teams',
  'Low', 2,
  'Automatic',
  'Graph API',
  'Teams security and governance',
  '/teams/teamsAppSettings/3',
  'isEnabled',
  'true',
  false,
  '["Navigate to Microsoft Teams settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Low',
  'High',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-TEAMS-004',
  'Guest Access Controlled',
  'Teams security and governance - Guest Access Controlled',
  'TG-TEAMS',
  'Guest Management',
  'Teams',
  'High', 7,
  'Automatic',
  'Graph API',
  'Teams security and governance',
  '/teams/teamsAppSettings/4',
  'isEnabled',
  'true',
  true,
  '["Navigate to Microsoft Teams settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Medium',
  'High',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-TEAMS-005',
  'External File Sharing Restricted',
  'Teams security and governance - External File Sharing Restricted',
  'TG-TEAMS',
  'File Sharing',
  'Teams',
  'Medium', 4,
  'Automatic',
  'Graph API',
  'Teams security and governance',
  '/teams/teamsAppSettings/5',
  'isEnabled',
  'true',
  false,
  '["Navigate to Microsoft Teams settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Low',
  'High',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-TEAMS-006',
  'Recorded Meetings Retention Configured',
  'Teams security and governance - Recorded Meetings Retention Configured',
  'TG-TEAMS',
  'Data Retention',
  'Teams',
  'Low', 2,
  'Automatic',
  'Graph API',
  'Teams security and governance',
  '/teams/teamsAppSettings/6',
  'isEnabled',
  'true',
  false,
  '["Navigate to Microsoft Teams settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Low',
  'High',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-TEAMS-007',
  'Guest Access Controlled',
  'Teams security and governance - Guest Access Controlled',
  'TG-TEAMS',
  'Guest Management',
  'Teams',
  'High', 7,
  'Automatic',
  'Graph API',
  'Teams security and governance',
  '/teams/teamsAppSettings/7',
  'isEnabled',
  'true',
  true,
  '["Navigate to Microsoft Teams settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Medium',
  'High',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-TEAMS-008',
  'External File Sharing Restricted',
  'Teams security and governance - External File Sharing Restricted',
  'TG-TEAMS',
  'File Sharing',
  'Teams',
  'Medium', 4,
  'Automatic',
  'Graph API',
  'Teams security and governance',
  '/teams/teamsAppSettings/8',
  'isEnabled',
  'true',
  false,
  '["Navigate to Microsoft Teams settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Low',
  'High',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-TEAMS-009',
  'Recorded Meetings Retention Configured',
  'Teams security and governance - Recorded Meetings Retention Configured',
  'TG-TEAMS',
  'Data Retention',
  'Teams',
  'Low', 2,
  'Automatic',
  'Graph API',
  'Teams security and governance',
  '/teams/teamsAppSettings/9',
  'isEnabled',
  'true',
  false,
  '["Navigate to Microsoft Teams settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Low',
  'High',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-TEAMS-010',
  'Guest Access Controlled',
  'Teams security and governance - Guest Access Controlled',
  'TG-TEAMS',
  'Guest Management',
  'Teams',
  'High', 7,
  'Automatic',
  'Graph API',
  'Teams security and governance',
  '/teams/teamsAppSettings/10',
  'isEnabled',
  'true',
  true,
  '["Navigate to Microsoft Teams settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Medium',
  'High',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-TEAMS-011',
  'External File Sharing Restricted',
  'Teams security and governance - External File Sharing Restricted',
  'TG-TEAMS',
  'File Sharing',
  'Teams',
  'Medium', 4,
  'Automatic',
  'Graph API',
  'Teams security and governance',
  '/teams/teamsAppSettings/11',
  'isEnabled',
  'true',
  false,
  '["Navigate to Microsoft Teams settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Low',
  'High',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-TEAMS-012',
  'Recorded Meetings Retention Configured',
  'Teams security and governance - Recorded Meetings Retention Configured',
  'TG-TEAMS',
  'Data Retention',
  'Teams',
  'Low', 2,
  'Automatic',
  'Graph API',
  'Teams security and governance',
  '/teams/teamsAppSettings/12',
  'isEnabled',
  'true',
  false,
  '["Navigate to Microsoft Teams settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Low',
  'High',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-TEAMS-013',
  'Guest Access Controlled',
  'Teams security and governance - Guest Access Controlled',
  'TG-TEAMS',
  'Guest Management',
  'Teams',
  'High', 7,
  'Automatic',
  'Graph API',
  'Teams security and governance',
  '/teams/teamsAppSettings/13',
  'isEnabled',
  'true',
  true,
  '["Navigate to Microsoft Teams settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Medium',
  'High',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-TEAMS-014',
  'External File Sharing Restricted',
  'Teams security and governance - External File Sharing Restricted',
  'TG-TEAMS',
  'File Sharing',
  'Teams',
  'Medium', 4,
  'Automatic',
  'Graph API',
  'Teams security and governance',
  '/teams/teamsAppSettings/14',
  'isEnabled',
  'true',
  false,
  '["Navigate to Microsoft Teams settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Low',
  'High',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-TEAMS-015',
  'Recorded Meetings Retention Configured',
  'Teams security and governance - Recorded Meetings Retention Configured',
  'TG-TEAMS',
  'Data Retention',
  'Teams',
  'Low', 2,
  'Automatic',
  'Graph API',
  'Teams security and governance',
  '/teams/teamsAppSettings/15',
  'isEnabled',
  'true',
  false,
  '["Navigate to Microsoft Teams settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Low',
  'High',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-TEAMS-016',
  'Guest Access Controlled',
  'Teams security and governance - Guest Access Controlled',
  'TG-TEAMS',
  'Guest Management',
  'Teams',
  'High', 7,
  'Automatic',
  'Graph API',
  'Teams security and governance',
  '/teams/teamsAppSettings/16',
  'isEnabled',
  'true',
  true,
  '["Navigate to Microsoft Teams settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Medium',
  'High',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-TEAMS-017',
  'External File Sharing Restricted',
  'Teams security and governance - External File Sharing Restricted',
  'TG-TEAMS',
  'File Sharing',
  'Teams',
  'Medium', 4,
  'Automatic',
  'Graph API',
  'Teams security and governance',
  '/teams/teamsAppSettings/17',
  'isEnabled',
  'true',
  false,
  '["Navigate to Microsoft Teams settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Low',
  'High',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-TEAMS-018',
  'Recorded Meetings Retention Configured',
  'Teams security and governance - Recorded Meetings Retention Configured',
  'TG-TEAMS',
  'Data Retention',
  'Teams',
  'Low', 2,
  'Automatic',
  'Graph API',
  'Teams security and governance',
  '/teams/teamsAppSettings/18',
  'isEnabled',
  'true',
  false,
  '["Navigate to Microsoft Teams settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Low',
  'High',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-TEAMS-019',
  'Guest Access Controlled',
  'Teams security and governance - Guest Access Controlled',
  'TG-TEAMS',
  'Guest Management',
  'Teams',
  'High', 7,
  'Automatic',
  'Graph API',
  'Teams security and governance',
  '/teams/teamsAppSettings/19',
  'isEnabled',
  'true',
  true,
  '["Navigate to Microsoft Teams settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Medium',
  'High',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-TEAMS-020',
  'External File Sharing Restricted',
  'Teams security and governance - External File Sharing Restricted',
  'TG-TEAMS',
  'File Sharing',
  'Teams',
  'Medium', 4,
  'Automatic',
  'Graph API',
  'Teams security and governance',
  '/teams/teamsAppSettings/20',
  'isEnabled',
  'true',
  false,
  '["Navigate to Microsoft Teams settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Low',
  'High',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-TEAMS-021',
  'Recorded Meetings Retention Configured',
  'Teams security and governance - Recorded Meetings Retention Configured',
  'TG-TEAMS',
  'Data Retention',
  'Teams',
  'Low', 2,
  'Automatic',
  'Graph API',
  'Teams security and governance',
  '/teams/teamsAppSettings/21',
  'isEnabled',
  'true',
  false,
  '["Navigate to Microsoft Teams settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Low',
  'High',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-TEAMS-022',
  'Guest Access Controlled',
  'Teams security and governance - Guest Access Controlled',
  'TG-TEAMS',
  'Guest Management',
  'Teams',
  'High', 7,
  'Automatic',
  'Graph API',
  'Teams security and governance',
  '/teams/teamsAppSettings/22',
  'isEnabled',
  'true',
  true,
  '["Navigate to Microsoft Teams settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Medium',
  'High',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-TEAMS-023',
  'External File Sharing Restricted',
  'Teams security and governance - External File Sharing Restricted',
  'TG-TEAMS',
  'File Sharing',
  'Teams',
  'Medium', 4,
  'Automatic',
  'Graph API',
  'Teams security and governance',
  '/teams/teamsAppSettings/23',
  'isEnabled',
  'true',
  false,
  '["Navigate to Microsoft Teams settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Low',
  'High',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-TEAMS-024',
  'Recorded Meetings Retention Configured',
  'Teams security and governance - Recorded Meetings Retention Configured',
  'TG-TEAMS',
  'Data Retention',
  'Teams',
  'Low', 2,
  'Automatic',
  'Graph API',
  'Teams security and governance',
  '/teams/teamsAppSettings/24',
  'isEnabled',
  'true',
  false,
  '["Navigate to Microsoft Teams settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Low',
  'High',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-TEAMS-025',
  'Guest Access Controlled',
  'Teams security and governance - Guest Access Controlled',
  'TG-TEAMS',
  'Guest Management',
  'Teams',
  'High', 7,
  'Automatic',
  'Graph API',
  'Teams security and governance',
  '/teams/teamsAppSettings/25',
  'isEnabled',
  'true',
  true,
  '["Navigate to Microsoft Teams settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Medium',
  'High',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-TEAMS-026',
  'External File Sharing Restricted',
  'Teams security and governance - External File Sharing Restricted',
  'TG-TEAMS',
  'File Sharing',
  'Teams',
  'Medium', 4,
  'Automatic',
  'Graph API',
  'Teams security and governance',
  '/teams/teamsAppSettings/26',
  'isEnabled',
  'true',
  false,
  '["Navigate to Microsoft Teams settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Low',
  'High',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-TEAMS-027',
  'Recorded Meetings Retention Configured',
  'Teams security and governance - Recorded Meetings Retention Configured',
  'TG-TEAMS',
  'Data Retention',
  'Teams',
  'Low', 2,
  'Automatic',
  'Graph API',
  'Teams security and governance',
  '/teams/teamsAppSettings/27',
  'isEnabled',
  'true',
  false,
  '["Navigate to Microsoft Teams settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Low',
  'High',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-TEAMS-028',
  'Guest Access Controlled',
  'Teams security and governance - Guest Access Controlled',
  'TG-TEAMS',
  'Guest Management',
  'Teams',
  'High', 7,
  'Automatic',
  'Graph API',
  'Teams security and governance',
  '/teams/teamsAppSettings/28',
  'isEnabled',
  'true',
  true,
  '["Navigate to Microsoft Teams settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Medium',
  'High',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-TEAMS-029',
  'External File Sharing Restricted',
  'Teams security and governance - External File Sharing Restricted',
  'TG-TEAMS',
  'File Sharing',
  'Teams',
  'Medium', 4,
  'Automatic',
  'Graph API',
  'Teams security and governance',
  '/teams/teamsAppSettings/29',
  'isEnabled',
  'true',
  false,
  '["Navigate to Microsoft Teams settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Low',
  'High',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-TEAMS-030',
  'Recorded Meetings Retention Configured',
  'Teams security and governance - Recorded Meetings Retention Configured',
  'TG-TEAMS',
  'Data Retention',
  'Teams',
  'Low', 2,
  'Automatic',
  'Graph API',
  'Teams security and governance',
  '/teams/teamsAppSettings/30',
  'isEnabled',
  'true',
  false,
  '["Navigate to Microsoft Teams settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Low',
  'High',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-TEAMS-031',
  'Guest Access Controlled',
  'Teams security and governance - Guest Access Controlled',
  'TG-TEAMS',
  'Guest Management',
  'Teams',
  'High', 7,
  'Automatic',
  'Graph API',
  'Teams security and governance',
  '/teams/teamsAppSettings/31',
  'isEnabled',
  'true',
  true,
  '["Navigate to Microsoft Teams settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Medium',
  'High',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-TEAMS-032',
  'External File Sharing Restricted',
  'Teams security and governance - External File Sharing Restricted',
  'TG-TEAMS',
  'File Sharing',
  'Teams',
  'Medium', 4,
  'Automatic',
  'Graph API',
  'Teams security and governance',
  '/teams/teamsAppSettings/32',
  'isEnabled',
  'true',
  false,
  '["Navigate to Microsoft Teams settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Low',
  'High',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-TEAMS-033',
  'Recorded Meetings Retention Configured',
  'Teams security and governance - Recorded Meetings Retention Configured',
  'TG-TEAMS',
  'Data Retention',
  'Teams',
  'Low', 2,
  'Automatic',
  'Graph API',
  'Teams security and governance',
  '/teams/teamsAppSettings/33',
  'isEnabled',
  'true',
  false,
  '["Navigate to Microsoft Teams settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Low',
  'High',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-TEAMS-034',
  'Guest Access Controlled',
  'Teams security and governance - Guest Access Controlled',
  'TG-TEAMS',
  'Guest Management',
  'Teams',
  'High', 7,
  'Automatic',
  'Graph API',
  'Teams security and governance',
  '/teams/teamsAppSettings/34',
  'isEnabled',
  'true',
  true,
  '["Navigate to Microsoft Teams settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Medium',
  'High',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-TEAMS-035',
  'External File Sharing Restricted',
  'Teams security and governance - External File Sharing Restricted',
  'TG-TEAMS',
  'File Sharing',
  'Teams',
  'Medium', 4,
  'Automatic',
  'Graph API',
  'Teams security and governance',
  '/teams/teamsAppSettings/35',
  'isEnabled',
  'true',
  false,
  '["Navigate to Microsoft Teams settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Low',
  'High',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-TEAMS-036',
  'Recorded Meetings Retention Configured',
  'Teams security and governance - Recorded Meetings Retention Configured',
  'TG-TEAMS',
  'Data Retention',
  'Teams',
  'Low', 2,
  'Automatic',
  'Graph API',
  'Teams security and governance',
  '/teams/teamsAppSettings/36',
  'isEnabled',
  'true',
  false,
  '["Navigate to Microsoft Teams settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Low',
  'High',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-TEAMS-037',
  'Guest Access Controlled',
  'Teams security and governance - Guest Access Controlled',
  'TG-TEAMS',
  'Guest Management',
  'Teams',
  'High', 7,
  'Automatic',
  'Graph API',
  'Teams security and governance',
  '/teams/teamsAppSettings/37',
  'isEnabled',
  'true',
  true,
  '["Navigate to Microsoft Teams settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Medium',
  'High',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-TEAMS-038',
  'External File Sharing Restricted',
  'Teams security and governance - External File Sharing Restricted',
  'TG-TEAMS',
  'File Sharing',
  'Teams',
  'Medium', 4,
  'Automatic',
  'Graph API',
  'Teams security and governance',
  '/teams/teamsAppSettings/38',
  'isEnabled',
  'true',
  false,
  '["Navigate to Microsoft Teams settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Low',
  'High',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-TEAMS-039',
  'Recorded Meetings Retention Configured',
  'Teams security and governance - Recorded Meetings Retention Configured',
  'TG-TEAMS',
  'Data Retention',
  'Teams',
  'Low', 2,
  'Automatic',
  'Graph API',
  'Teams security and governance',
  '/teams/teamsAppSettings/39',
  'isEnabled',
  'true',
  false,
  '["Navigate to Microsoft Teams settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Low',
  'High',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-TEAMS-040',
  'Guest Access Controlled',
  'Teams security and governance - Guest Access Controlled',
  'TG-TEAMS',
  'Guest Management',
  'Teams',
  'High', 7,
  'Automatic',
  'Graph API',
  'Teams security and governance',
  '/teams/teamsAppSettings/40',
  'isEnabled',
  'true',
  true,
  '["Navigate to Microsoft Teams settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Medium',
  'High',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-TEAMS-041',
  'External File Sharing Restricted',
  'Teams security and governance - External File Sharing Restricted',
  'TG-TEAMS',
  'File Sharing',
  'Teams',
  'Medium', 4,
  'Automatic',
  'Graph API',
  'Teams security and governance',
  '/teams/teamsAppSettings/41',
  'isEnabled',
  'true',
  false,
  '["Navigate to Microsoft Teams settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Low',
  'High',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-TEAMS-042',
  'Recorded Meetings Retention Configured',
  'Teams security and governance - Recorded Meetings Retention Configured',
  'TG-TEAMS',
  'Data Retention',
  'Teams',
  'Low', 2,
  'Automatic',
  'Graph API',
  'Teams security and governance',
  '/teams/teamsAppSettings/42',
  'isEnabled',
  'true',
  false,
  '["Navigate to Microsoft Teams settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Low',
  'High',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-TEAMS-043',
  'Guest Access Controlled',
  'Teams security and governance - Guest Access Controlled',
  'TG-TEAMS',
  'Guest Management',
  'Teams',
  'High', 7,
  'Automatic',
  'Graph API',
  'Teams security and governance',
  '/teams/teamsAppSettings/43',
  'isEnabled',
  'true',
  true,
  '["Navigate to Microsoft Teams settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Medium',
  'High',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-TEAMS-044',
  'External File Sharing Restricted',
  'Teams security and governance - External File Sharing Restricted',
  'TG-TEAMS',
  'File Sharing',
  'Teams',
  'Medium', 4,
  'Automatic',
  'Graph API',
  'Teams security and governance',
  '/teams/teamsAppSettings/44',
  'isEnabled',
  'true',
  false,
  '["Navigate to Microsoft Teams settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Low',
  'High',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-TEAMS-045',
  'Recorded Meetings Retention Configured',
  'Teams security and governance - Recorded Meetings Retention Configured',
  'TG-TEAMS',
  'Data Retention',
  'Teams',
  'Low', 2,
  'Automatic',
  'Graph API',
  'Teams security and governance',
  '/teams/teamsAppSettings/45',
  'isEnabled',
  'true',
  false,
  '["Navigate to Microsoft Teams settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Low',
  'High',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-PUR-001',
  'Purview Control 1',
  'Data protection and compliance - Control 1',
  'TG-PUR',
  'Security',
  'Purview',
  'Critical', 10,
  'Automatic',
  'Graph API',
  'Data protection and compliance',
  '/compliance/classificationExactMatches/1',
  'isEnabled',
  'true',
  true,
  '["Navigate to Purview settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Medium',
  'Critical',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-PUR-002',
  'Purview Control 2',
  'Data protection and compliance - Control 2',
  'TG-PUR',
  'Security',
  'Purview',
  'Medium', 4,
  'Automatic',
  'Graph API',
  'Data protection and compliance',
  '/compliance/classificationExactMatches/2',
  'isEnabled',
  'true',
  false,
  '["Navigate to Purview settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Low',
  'High',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-PUR-003',
  'Purview Control 3',
  'Data protection and compliance - Control 3',
  'TG-PUR',
  'Security',
  'Purview',
  'Medium', 4,
  'Automatic',
  'Graph API',
  'Data protection and compliance',
  '/compliance/classificationExactMatches/3',
  'isEnabled',
  'true',
  false,
  '["Navigate to Purview settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Low',
  'High',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-PUR-004',
  'Purview Control 4',
  'Data protection and compliance - Control 4',
  'TG-PUR',
  'Security',
  'Purview',
  'High', 7,
  'Automatic',
  'Graph API',
  'Data protection and compliance',
  '/compliance/classificationExactMatches/4',
  'isEnabled',
  'true',
  true,
  '["Navigate to Purview settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Medium',
  'High',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-PUR-005',
  'Purview Control 5',
  'Data protection and compliance - Control 5',
  'TG-PUR',
  'Security',
  'Purview',
  'High', 7,
  'Automatic',
  'Graph API',
  'Data protection and compliance',
  '/compliance/classificationExactMatches/5',
  'isEnabled',
  'true',
  true,
  '["Navigate to Purview settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Medium',
  'High',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-PUR-006',
  'Purview Control 6',
  'Data protection and compliance - Control 6',
  'TG-PUR',
  'Security',
  'Purview',
  'Critical', 10,
  'Automatic',
  'Graph API',
  'Data protection and compliance',
  '/compliance/classificationExactMatches/6',
  'isEnabled',
  'true',
  true,
  '["Navigate to Purview settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Medium',
  'Critical',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-PUR-007',
  'Purview Control 7',
  'Data protection and compliance - Control 7',
  'TG-PUR',
  'Security',
  'Purview',
  'Critical', 10,
  'Automatic',
  'Graph API',
  'Data protection and compliance',
  '/compliance/classificationExactMatches/7',
  'isEnabled',
  'true',
  true,
  '["Navigate to Purview settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Medium',
  'Critical',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-PUR-008',
  'Purview Control 8',
  'Data protection and compliance - Control 8',
  'TG-PUR',
  'Security',
  'Purview',
  'Medium', 4,
  'Automatic',
  'Graph API',
  'Data protection and compliance',
  '/compliance/classificationExactMatches/8',
  'isEnabled',
  'true',
  false,
  '["Navigate to Purview settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Low',
  'High',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-PUR-009',
  'Purview Control 9',
  'Data protection and compliance - Control 9',
  'TG-PUR',
  'Security',
  'Purview',
  'Critical', 10,
  'Automatic',
  'Graph API',
  'Data protection and compliance',
  '/compliance/classificationExactMatches/9',
  'isEnabled',
  'true',
  true,
  '["Navigate to Purview settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Medium',
  'Critical',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-PUR-010',
  'Purview Control 10',
  'Data protection and compliance - Control 10',
  'TG-PUR',
  'Security',
  'Purview',
  'Critical', 10,
  'Automatic',
  'Graph API',
  'Data protection and compliance',
  '/compliance/classificationExactMatches/10',
  'isEnabled',
  'true',
  true,
  '["Navigate to Purview settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Medium',
  'Critical',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-PUR-011',
  'Purview Control 11',
  'Data protection and compliance - Control 11',
  'TG-PUR',
  'Security',
  'Purview',
  'High', 7,
  'Automatic',
  'Graph API',
  'Data protection and compliance',
  '/compliance/classificationExactMatches/11',
  'isEnabled',
  'true',
  true,
  '["Navigate to Purview settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Medium',
  'High',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-PUR-012',
  'Purview Control 12',
  'Data protection and compliance - Control 12',
  'TG-PUR',
  'Security',
  'Purview',
  'High', 7,
  'Automatic',
  'Graph API',
  'Data protection and compliance',
  '/compliance/classificationExactMatches/12',
  'isEnabled',
  'true',
  true,
  '["Navigate to Purview settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Medium',
  'High',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-PUR-013',
  'Purview Control 13',
  'Data protection and compliance - Control 13',
  'TG-PUR',
  'Security',
  'Purview',
  'High', 7,
  'Automatic',
  'Graph API',
  'Data protection and compliance',
  '/compliance/classificationExactMatches/13',
  'isEnabled',
  'true',
  true,
  '["Navigate to Purview settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Medium',
  'High',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-PUR-014',
  'Purview Control 14',
  'Data protection and compliance - Control 14',
  'TG-PUR',
  'Security',
  'Purview',
  'High', 7,
  'Automatic',
  'Graph API',
  'Data protection and compliance',
  '/compliance/classificationExactMatches/14',
  'isEnabled',
  'true',
  true,
  '["Navigate to Purview settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Medium',
  'High',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-PUR-015',
  'Purview Control 15',
  'Data protection and compliance - Control 15',
  'TG-PUR',
  'Security',
  'Purview',
  'Medium', 4,
  'Automatic',
  'Graph API',
  'Data protection and compliance',
  '/compliance/classificationExactMatches/15',
  'isEnabled',
  'true',
  false,
  '["Navigate to Purview settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Low',
  'High',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-PUR-016',
  'Purview Control 16',
  'Data protection and compliance - Control 16',
  'TG-PUR',
  'Security',
  'Purview',
  'High', 7,
  'Automatic',
  'Graph API',
  'Data protection and compliance',
  '/compliance/classificationExactMatches/16',
  'isEnabled',
  'true',
  true,
  '["Navigate to Purview settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Medium',
  'High',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-PUR-017',
  'Purview Control 17',
  'Data protection and compliance - Control 17',
  'TG-PUR',
  'Security',
  'Purview',
  'Medium', 4,
  'Automatic',
  'Graph API',
  'Data protection and compliance',
  '/compliance/classificationExactMatches/17',
  'isEnabled',
  'true',
  false,
  '["Navigate to Purview settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Low',
  'High',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-PUR-018',
  'Purview Control 18',
  'Data protection and compliance - Control 18',
  'TG-PUR',
  'Security',
  'Purview',
  'Medium', 4,
  'Automatic',
  'Graph API',
  'Data protection and compliance',
  '/compliance/classificationExactMatches/18',
  'isEnabled',
  'true',
  false,
  '["Navigate to Purview settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Low',
  'High',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-PUR-019',
  'Purview Control 19',
  'Data protection and compliance - Control 19',
  'TG-PUR',
  'Security',
  'Purview',
  'Critical', 10,
  'Automatic',
  'Graph API',
  'Data protection and compliance',
  '/compliance/classificationExactMatches/19',
  'isEnabled',
  'true',
  true,
  '["Navigate to Purview settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Medium',
  'Critical',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-PUR-020',
  'Purview Control 20',
  'Data protection and compliance - Control 20',
  'TG-PUR',
  'Security',
  'Purview',
  'Medium', 4,
  'Automatic',
  'Graph API',
  'Data protection and compliance',
  '/compliance/classificationExactMatches/20',
  'isEnabled',
  'true',
  false,
  '["Navigate to Purview settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Low',
  'High',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-PUR-021',
  'Purview Control 21',
  'Data protection and compliance - Control 21',
  'TG-PUR',
  'Security',
  'Purview',
  'High', 7,
  'Automatic',
  'Graph API',
  'Data protection and compliance',
  '/compliance/classificationExactMatches/21',
  'isEnabled',
  'true',
  true,
  '["Navigate to Purview settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Medium',
  'High',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-PUR-022',
  'Purview Control 22',
  'Data protection and compliance - Control 22',
  'TG-PUR',
  'Security',
  'Purview',
  'Critical', 10,
  'Automatic',
  'Graph API',
  'Data protection and compliance',
  '/compliance/classificationExactMatches/22',
  'isEnabled',
  'true',
  true,
  '["Navigate to Purview settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Medium',
  'Critical',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-PUR-023',
  'Purview Control 23',
  'Data protection and compliance - Control 23',
  'TG-PUR',
  'Security',
  'Purview',
  'High', 7,
  'Automatic',
  'Graph API',
  'Data protection and compliance',
  '/compliance/classificationExactMatches/23',
  'isEnabled',
  'true',
  true,
  '["Navigate to Purview settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Medium',
  'High',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-PUR-024',
  'Purview Control 24',
  'Data protection and compliance - Control 24',
  'TG-PUR',
  'Security',
  'Purview',
  'High', 7,
  'Automatic',
  'Graph API',
  'Data protection and compliance',
  '/compliance/classificationExactMatches/24',
  'isEnabled',
  'true',
  true,
  '["Navigate to Purview settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Medium',
  'High',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-PUR-025',
  'Purview Control 25',
  'Data protection and compliance - Control 25',
  'TG-PUR',
  'Security',
  'Purview',
  'Medium', 4,
  'Automatic',
  'Graph API',
  'Data protection and compliance',
  '/compliance/classificationExactMatches/25',
  'isEnabled',
  'true',
  false,
  '["Navigate to Purview settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Low',
  'High',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-PUR-026',
  'Purview Control 26',
  'Data protection and compliance - Control 26',
  'TG-PUR',
  'Security',
  'Purview',
  'Medium', 4,
  'Automatic',
  'Graph API',
  'Data protection and compliance',
  '/compliance/classificationExactMatches/26',
  'isEnabled',
  'true',
  false,
  '["Navigate to Purview settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Low',
  'High',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-PUR-027',
  'Purview Control 27',
  'Data protection and compliance - Control 27',
  'TG-PUR',
  'Security',
  'Purview',
  'Critical', 10,
  'Automatic',
  'Graph API',
  'Data protection and compliance',
  '/compliance/classificationExactMatches/27',
  'isEnabled',
  'true',
  true,
  '["Navigate to Purview settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Medium',
  'Critical',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-PUR-028',
  'Purview Control 28',
  'Data protection and compliance - Control 28',
  'TG-PUR',
  'Security',
  'Purview',
  'Critical', 10,
  'Automatic',
  'Graph API',
  'Data protection and compliance',
  '/compliance/classificationExactMatches/28',
  'isEnabled',
  'true',
  true,
  '["Navigate to Purview settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Medium',
  'Critical',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-PUR-029',
  'Purview Control 29',
  'Data protection and compliance - Control 29',
  'TG-PUR',
  'Security',
  'Purview',
  'High', 7,
  'Automatic',
  'Graph API',
  'Data protection and compliance',
  '/compliance/classificationExactMatches/29',
  'isEnabled',
  'true',
  true,
  '["Navigate to Purview settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Medium',
  'High',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-PUR-030',
  'Purview Control 30',
  'Data protection and compliance - Control 30',
  'TG-PUR',
  'Security',
  'Purview',
  'High', 7,
  'Automatic',
  'Graph API',
  'Data protection and compliance',
  '/compliance/classificationExactMatches/30',
  'isEnabled',
  'true',
  true,
  '["Navigate to Purview settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Medium',
  'High',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-PUR-031',
  'Purview Control 31',
  'Data protection and compliance - Control 31',
  'TG-PUR',
  'Security',
  'Purview',
  'Medium', 4,
  'Automatic',
  'Graph API',
  'Data protection and compliance',
  '/compliance/classificationExactMatches/31',
  'isEnabled',
  'true',
  false,
  '["Navigate to Purview settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Low',
  'High',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-PUR-032',
  'Purview Control 32',
  'Data protection and compliance - Control 32',
  'TG-PUR',
  'Security',
  'Purview',
  'High', 7,
  'Automatic',
  'Graph API',
  'Data protection and compliance',
  '/compliance/classificationExactMatches/32',
  'isEnabled',
  'true',
  true,
  '["Navigate to Purview settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Medium',
  'High',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-PUR-033',
  'Purview Control 33',
  'Data protection and compliance - Control 33',
  'TG-PUR',
  'Security',
  'Purview',
  'High', 7,
  'Automatic',
  'Graph API',
  'Data protection and compliance',
  '/compliance/classificationExactMatches/33',
  'isEnabled',
  'true',
  true,
  '["Navigate to Purview settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Medium',
  'High',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-PUR-034',
  'Purview Control 34',
  'Data protection and compliance - Control 34',
  'TG-PUR',
  'Security',
  'Purview',
  'High', 7,
  'Automatic',
  'Graph API',
  'Data protection and compliance',
  '/compliance/classificationExactMatches/34',
  'isEnabled',
  'true',
  true,
  '["Navigate to Purview settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Medium',
  'High',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-PUR-035',
  'Purview Control 35',
  'Data protection and compliance - Control 35',
  'TG-PUR',
  'Security',
  'Purview',
  'Medium', 4,
  'Automatic',
  'Graph API',
  'Data protection and compliance',
  '/compliance/classificationExactMatches/35',
  'isEnabled',
  'true',
  false,
  '["Navigate to Purview settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Low',
  'High',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-PUR-036',
  'Purview Control 36',
  'Data protection and compliance - Control 36',
  'TG-PUR',
  'Security',
  'Purview',
  'Critical', 10,
  'Automatic',
  'Graph API',
  'Data protection and compliance',
  '/compliance/classificationExactMatches/36',
  'isEnabled',
  'true',
  true,
  '["Navigate to Purview settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Medium',
  'Critical',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-PUR-037',
  'Purview Control 37',
  'Data protection and compliance - Control 37',
  'TG-PUR',
  'Security',
  'Purview',
  'High', 7,
  'Automatic',
  'Graph API',
  'Data protection and compliance',
  '/compliance/classificationExactMatches/37',
  'isEnabled',
  'true',
  true,
  '["Navigate to Purview settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Medium',
  'High',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-PUR-038',
  'Purview Control 38',
  'Data protection and compliance - Control 38',
  'TG-PUR',
  'Security',
  'Purview',
  'High', 7,
  'Automatic',
  'Graph API',
  'Data protection and compliance',
  '/compliance/classificationExactMatches/38',
  'isEnabled',
  'true',
  true,
  '["Navigate to Purview settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Medium',
  'High',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-PUR-039',
  'Purview Control 39',
  'Data protection and compliance - Control 39',
  'TG-PUR',
  'Security',
  'Purview',
  'High', 7,
  'Automatic',
  'Graph API',
  'Data protection and compliance',
  '/compliance/classificationExactMatches/39',
  'isEnabled',
  'true',
  true,
  '["Navigate to Purview settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Medium',
  'High',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-PUR-040',
  'Purview Control 40',
  'Data protection and compliance - Control 40',
  'TG-PUR',
  'Security',
  'Purview',
  'High', 7,
  'Automatic',
  'Graph API',
  'Data protection and compliance',
  '/compliance/classificationExactMatches/40',
  'isEnabled',
  'true',
  true,
  '["Navigate to Purview settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Medium',
  'High',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-PUR-041',
  'Purview Control 41',
  'Data protection and compliance - Control 41',
  'TG-PUR',
  'Security',
  'Purview',
  'High', 7,
  'Automatic',
  'Graph API',
  'Data protection and compliance',
  '/compliance/classificationExactMatches/41',
  'isEnabled',
  'true',
  true,
  '["Navigate to Purview settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Medium',
  'High',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-PUR-042',
  'Purview Control 42',
  'Data protection and compliance - Control 42',
  'TG-PUR',
  'Security',
  'Purview',
  'High', 7,
  'Automatic',
  'Graph API',
  'Data protection and compliance',
  '/compliance/classificationExactMatches/42',
  'isEnabled',
  'true',
  true,
  '["Navigate to Purview settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Medium',
  'High',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-PUR-043',
  'Purview Control 43',
  'Data protection and compliance - Control 43',
  'TG-PUR',
  'Security',
  'Purview',
  'Critical', 10,
  'Automatic',
  'Graph API',
  'Data protection and compliance',
  '/compliance/classificationExactMatches/43',
  'isEnabled',
  'true',
  true,
  '["Navigate to Purview settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Medium',
  'Critical',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-PUR-044',
  'Purview Control 44',
  'Data protection and compliance - Control 44',
  'TG-PUR',
  'Security',
  'Purview',
  'Medium', 4,
  'Automatic',
  'Graph API',
  'Data protection and compliance',
  '/compliance/classificationExactMatches/44',
  'isEnabled',
  'true',
  false,
  '["Navigate to Purview settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Low',
  'High',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-PUR-045',
  'Purview Control 45',
  'Data protection and compliance - Control 45',
  'TG-PUR',
  'Security',
  'Purview',
  'Critical', 10,
  'Automatic',
  'Graph API',
  'Data protection and compliance',
  '/compliance/classificationExactMatches/45',
  'isEnabled',
  'true',
  true,
  '["Navigate to Purview settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Medium',
  'Critical',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-PUR-046',
  'Purview Control 46',
  'Data protection and compliance - Control 46',
  'TG-PUR',
  'Security',
  'Purview',
  'Critical', 10,
  'Automatic',
  'Graph API',
  'Data protection and compliance',
  '/compliance/classificationExactMatches/46',
  'isEnabled',
  'true',
  true,
  '["Navigate to Purview settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Medium',
  'Critical',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-PUR-047',
  'Purview Control 47',
  'Data protection and compliance - Control 47',
  'TG-PUR',
  'Security',
  'Purview',
  'Medium', 4,
  'Automatic',
  'Graph API',
  'Data protection and compliance',
  '/compliance/classificationExactMatches/47',
  'isEnabled',
  'true',
  false,
  '["Navigate to Purview settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Low',
  'High',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-PUR-048',
  'Purview Control 48',
  'Data protection and compliance - Control 48',
  'TG-PUR',
  'Security',
  'Purview',
  'Medium', 4,
  'Automatic',
  'Graph API',
  'Data protection and compliance',
  '/compliance/classificationExactMatches/48',
  'isEnabled',
  'true',
  false,
  '["Navigate to Purview settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Low',
  'High',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-PUR-049',
  'Purview Control 49',
  'Data protection and compliance - Control 49',
  'TG-PUR',
  'Security',
  'Purview',
  'Critical', 10,
  'Automatic',
  'Graph API',
  'Data protection and compliance',
  '/compliance/classificationExactMatches/49',
  'isEnabled',
  'true',
  true,
  '["Navigate to Purview settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Medium',
  'Critical',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-PUR-050',
  'Purview Control 50',
  'Data protection and compliance - Control 50',
  'TG-PUR',
  'Security',
  'Purview',
  'Critical', 10,
  'Automatic',
  'Graph API',
  'Data protection and compliance',
  '/compliance/classificationExactMatches/50',
  'isEnabled',
  'true',
  true,
  '["Navigate to Purview settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Medium',
  'Critical',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-PUR-051',
  'Purview Control 51',
  'Data protection and compliance - Control 51',
  'TG-PUR',
  'Security',
  'Purview',
  'Critical', 10,
  'Automatic',
  'Graph API',
  'Data protection and compliance',
  '/compliance/classificationExactMatches/51',
  'isEnabled',
  'true',
  true,
  '["Navigate to Purview settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Medium',
  'Critical',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-PUR-052',
  'Purview Control 52',
  'Data protection and compliance - Control 52',
  'TG-PUR',
  'Security',
  'Purview',
  'High', 7,
  'Automatic',
  'Graph API',
  'Data protection and compliance',
  '/compliance/classificationExactMatches/52',
  'isEnabled',
  'true',
  true,
  '["Navigate to Purview settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Medium',
  'High',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-PUR-053',
  'Purview Control 53',
  'Data protection and compliance - Control 53',
  'TG-PUR',
  'Security',
  'Purview',
  'Medium', 4,
  'Automatic',
  'Graph API',
  'Data protection and compliance',
  '/compliance/classificationExactMatches/53',
  'isEnabled',
  'true',
  false,
  '["Navigate to Purview settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Low',
  'High',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-PUR-054',
  'Purview Control 54',
  'Data protection and compliance - Control 54',
  'TG-PUR',
  'Security',
  'Purview',
  'Critical', 10,
  'Automatic',
  'Graph API',
  'Data protection and compliance',
  '/compliance/classificationExactMatches/54',
  'isEnabled',
  'true',
  true,
  '["Navigate to Purview settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Medium',
  'Critical',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-PUR-055',
  'Purview Control 55',
  'Data protection and compliance - Control 55',
  'TG-PUR',
  'Security',
  'Purview',
  'Medium', 4,
  'Automatic',
  'Graph API',
  'Data protection and compliance',
  '/compliance/classificationExactMatches/55',
  'isEnabled',
  'true',
  false,
  '["Navigate to Purview settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Low',
  'High',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-PUR-056',
  'Purview Control 56',
  'Data protection and compliance - Control 56',
  'TG-PUR',
  'Security',
  'Purview',
  'Critical', 10,
  'Automatic',
  'Graph API',
  'Data protection and compliance',
  '/compliance/classificationExactMatches/56',
  'isEnabled',
  'true',
  true,
  '["Navigate to Purview settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Medium',
  'Critical',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-PUR-057',
  'Purview Control 57',
  'Data protection and compliance - Control 57',
  'TG-PUR',
  'Security',
  'Purview',
  'High', 7,
  'Automatic',
  'Graph API',
  'Data protection and compliance',
  '/compliance/classificationExactMatches/57',
  'isEnabled',
  'true',
  true,
  '["Navigate to Purview settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Medium',
  'High',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-PUR-058',
  'Purview Control 58',
  'Data protection and compliance - Control 58',
  'TG-PUR',
  'Security',
  'Purview',
  'Critical', 10,
  'Automatic',
  'Graph API',
  'Data protection and compliance',
  '/compliance/classificationExactMatches/58',
  'isEnabled',
  'true',
  true,
  '["Navigate to Purview settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Medium',
  'Critical',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-PUR-059',
  'Purview Control 59',
  'Data protection and compliance - Control 59',
  'TG-PUR',
  'Security',
  'Purview',
  'Medium', 4,
  'Automatic',
  'Graph API',
  'Data protection and compliance',
  '/compliance/classificationExactMatches/59',
  'isEnabled',
  'true',
  false,
  '["Navigate to Purview settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Low',
  'High',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-PUR-060',
  'Purview Control 60',
  'Data protection and compliance - Control 60',
  'TG-PUR',
  'Security',
  'Purview',
  'Critical', 10,
  'Automatic',
  'Graph API',
  'Data protection and compliance',
  '/compliance/classificationExactMatches/60',
  'isEnabled',
  'true',
  true,
  '["Navigate to Purview settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Medium',
  'Critical',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-PUR-061',
  'Purview Control 61',
  'Data protection and compliance - Control 61',
  'TG-PUR',
  'Security',
  'Purview',
  'Critical', 10,
  'Automatic',
  'Graph API',
  'Data protection and compliance',
  '/compliance/classificationExactMatches/61',
  'isEnabled',
  'true',
  true,
  '["Navigate to Purview settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Medium',
  'Critical',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-PUR-062',
  'Purview Control 62',
  'Data protection and compliance - Control 62',
  'TG-PUR',
  'Security',
  'Purview',
  'High', 7,
  'Automatic',
  'Graph API',
  'Data protection and compliance',
  '/compliance/classificationExactMatches/62',
  'isEnabled',
  'true',
  true,
  '["Navigate to Purview settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Medium',
  'High',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-PUR-063',
  'Purview Control 63',
  'Data protection and compliance - Control 63',
  'TG-PUR',
  'Security',
  'Purview',
  'High', 7,
  'Automatic',
  'Graph API',
  'Data protection and compliance',
  '/compliance/classificationExactMatches/63',
  'isEnabled',
  'true',
  true,
  '["Navigate to Purview settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Medium',
  'High',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-PUR-064',
  'Purview Control 64',
  'Data protection and compliance - Control 64',
  'TG-PUR',
  'Security',
  'Purview',
  'High', 7,
  'Automatic',
  'Graph API',
  'Data protection and compliance',
  '/compliance/classificationExactMatches/64',
  'isEnabled',
  'true',
  true,
  '["Navigate to Purview settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Medium',
  'High',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-PUR-065',
  'Purview Control 65',
  'Data protection and compliance - Control 65',
  'TG-PUR',
  'Security',
  'Purview',
  'Critical', 10,
  'Automatic',
  'Graph API',
  'Data protection and compliance',
  '/compliance/classificationExactMatches/65',
  'isEnabled',
  'true',
  true,
  '["Navigate to Purview settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Medium',
  'Critical',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-PUR-066',
  'Purview Control 66',
  'Data protection and compliance - Control 66',
  'TG-PUR',
  'Security',
  'Purview',
  'Medium', 4,
  'Automatic',
  'Graph API',
  'Data protection and compliance',
  '/compliance/classificationExactMatches/66',
  'isEnabled',
  'true',
  false,
  '["Navigate to Purview settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Low',
  'High',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-PUR-067',
  'Purview Control 67',
  'Data protection and compliance - Control 67',
  'TG-PUR',
  'Security',
  'Purview',
  'Critical', 10,
  'Automatic',
  'Graph API',
  'Data protection and compliance',
  '/compliance/classificationExactMatches/67',
  'isEnabled',
  'true',
  true,
  '["Navigate to Purview settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Medium',
  'Critical',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-PUR-068',
  'Purview Control 68',
  'Data protection and compliance - Control 68',
  'TG-PUR',
  'Security',
  'Purview',
  'Critical', 10,
  'Automatic',
  'Graph API',
  'Data protection and compliance',
  '/compliance/classificationExactMatches/68',
  'isEnabled',
  'true',
  true,
  '["Navigate to Purview settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Medium',
  'Critical',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-PUR-069',
  'Purview Control 69',
  'Data protection and compliance - Control 69',
  'TG-PUR',
  'Security',
  'Purview',
  'Medium', 4,
  'Automatic',
  'Graph API',
  'Data protection and compliance',
  '/compliance/classificationExactMatches/69',
  'isEnabled',
  'true',
  false,
  '["Navigate to Purview settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Low',
  'High',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-PUR-070',
  'Purview Control 70',
  'Data protection and compliance - Control 70',
  'TG-PUR',
  'Security',
  'Purview',
  'Critical', 10,
  'Automatic',
  'Graph API',
  'Data protection and compliance',
  '/compliance/classificationExactMatches/70',
  'isEnabled',
  'true',
  true,
  '["Navigate to Purview settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Medium',
  'Critical',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-DEF-001',
  'Microsoft Defender Control 1',
  'Threat protection and detection - Control 1',
  'TG-DEF',
  'Security',
  'Defender',
  'Critical', 10,
  'Automatic',
  'Graph API',
  'Threat protection and detection',
  '/security/threatIntelligence/1',
  'isEnabled',
  'true',
  true,
  '["Navigate to Microsoft Defender settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Medium',
  'Critical',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-DEF-002',
  'Microsoft Defender Control 2',
  'Threat protection and detection - Control 2',
  'TG-DEF',
  'Security',
  'Defender',
  'Medium', 4,
  'Automatic',
  'Graph API',
  'Threat protection and detection',
  '/security/threatIntelligence/2',
  'isEnabled',
  'true',
  false,
  '["Navigate to Microsoft Defender settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Low',
  'High',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-DEF-003',
  'Microsoft Defender Control 3',
  'Threat protection and detection - Control 3',
  'TG-DEF',
  'Security',
  'Defender',
  'Critical', 10,
  'Automatic',
  'Graph API',
  'Threat protection and detection',
  '/security/threatIntelligence/3',
  'isEnabled',
  'true',
  true,
  '["Navigate to Microsoft Defender settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Medium',
  'Critical',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-DEF-004',
  'Microsoft Defender Control 4',
  'Threat protection and detection - Control 4',
  'TG-DEF',
  'Security',
  'Defender',
  'High', 7,
  'Automatic',
  'Graph API',
  'Threat protection and detection',
  '/security/threatIntelligence/4',
  'isEnabled',
  'true',
  true,
  '["Navigate to Microsoft Defender settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Medium',
  'High',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-DEF-005',
  'Microsoft Defender Control 5',
  'Threat protection and detection - Control 5',
  'TG-DEF',
  'Security',
  'Defender',
  'Critical', 10,
  'Automatic',
  'Graph API',
  'Threat protection and detection',
  '/security/threatIntelligence/5',
  'isEnabled',
  'true',
  true,
  '["Navigate to Microsoft Defender settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Medium',
  'Critical',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-DEF-006',
  'Microsoft Defender Control 6',
  'Threat protection and detection - Control 6',
  'TG-DEF',
  'Security',
  'Defender',
  'High', 7,
  'Automatic',
  'Graph API',
  'Threat protection and detection',
  '/security/threatIntelligence/6',
  'isEnabled',
  'true',
  true,
  '["Navigate to Microsoft Defender settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Medium',
  'High',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-DEF-007',
  'Microsoft Defender Control 7',
  'Threat protection and detection - Control 7',
  'TG-DEF',
  'Security',
  'Defender',
  'Medium', 4,
  'Automatic',
  'Graph API',
  'Threat protection and detection',
  '/security/threatIntelligence/7',
  'isEnabled',
  'true',
  false,
  '["Navigate to Microsoft Defender settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Low',
  'High',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-DEF-008',
  'Microsoft Defender Control 8',
  'Threat protection and detection - Control 8',
  'TG-DEF',
  'Security',
  'Defender',
  'High', 7,
  'Automatic',
  'Graph API',
  'Threat protection and detection',
  '/security/threatIntelligence/8',
  'isEnabled',
  'true',
  true,
  '["Navigate to Microsoft Defender settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Medium',
  'High',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-DEF-009',
  'Microsoft Defender Control 9',
  'Threat protection and detection - Control 9',
  'TG-DEF',
  'Security',
  'Defender',
  'Medium', 4,
  'Automatic',
  'Graph API',
  'Threat protection and detection',
  '/security/threatIntelligence/9',
  'isEnabled',
  'true',
  false,
  '["Navigate to Microsoft Defender settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Low',
  'High',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-DEF-010',
  'Microsoft Defender Control 10',
  'Threat protection and detection - Control 10',
  'TG-DEF',
  'Security',
  'Defender',
  'Critical', 10,
  'Automatic',
  'Graph API',
  'Threat protection and detection',
  '/security/threatIntelligence/10',
  'isEnabled',
  'true',
  true,
  '["Navigate to Microsoft Defender settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Medium',
  'Critical',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-DEF-011',
  'Microsoft Defender Control 11',
  'Threat protection and detection - Control 11',
  'TG-DEF',
  'Security',
  'Defender',
  'Critical', 10,
  'Automatic',
  'Graph API',
  'Threat protection and detection',
  '/security/threatIntelligence/11',
  'isEnabled',
  'true',
  true,
  '["Navigate to Microsoft Defender settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Medium',
  'Critical',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-DEF-012',
  'Microsoft Defender Control 12',
  'Threat protection and detection - Control 12',
  'TG-DEF',
  'Security',
  'Defender',
  'Critical', 10,
  'Automatic',
  'Graph API',
  'Threat protection and detection',
  '/security/threatIntelligence/12',
  'isEnabled',
  'true',
  true,
  '["Navigate to Microsoft Defender settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Medium',
  'Critical',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-DEF-013',
  'Microsoft Defender Control 13',
  'Threat protection and detection - Control 13',
  'TG-DEF',
  'Security',
  'Defender',
  'Medium', 4,
  'Automatic',
  'Graph API',
  'Threat protection and detection',
  '/security/threatIntelligence/13',
  'isEnabled',
  'true',
  false,
  '["Navigate to Microsoft Defender settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Low',
  'High',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-DEF-014',
  'Microsoft Defender Control 14',
  'Threat protection and detection - Control 14',
  'TG-DEF',
  'Security',
  'Defender',
  'Critical', 10,
  'Automatic',
  'Graph API',
  'Threat protection and detection',
  '/security/threatIntelligence/14',
  'isEnabled',
  'true',
  true,
  '["Navigate to Microsoft Defender settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Medium',
  'Critical',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-DEF-015',
  'Microsoft Defender Control 15',
  'Threat protection and detection - Control 15',
  'TG-DEF',
  'Security',
  'Defender',
  'Medium', 4,
  'Automatic',
  'Graph API',
  'Threat protection and detection',
  '/security/threatIntelligence/15',
  'isEnabled',
  'true',
  false,
  '["Navigate to Microsoft Defender settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Low',
  'High',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-DEF-016',
  'Microsoft Defender Control 16',
  'Threat protection and detection - Control 16',
  'TG-DEF',
  'Security',
  'Defender',
  'Critical', 10,
  'Automatic',
  'Graph API',
  'Threat protection and detection',
  '/security/threatIntelligence/16',
  'isEnabled',
  'true',
  true,
  '["Navigate to Microsoft Defender settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Medium',
  'Critical',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-DEF-017',
  'Microsoft Defender Control 17',
  'Threat protection and detection - Control 17',
  'TG-DEF',
  'Security',
  'Defender',
  'Medium', 4,
  'Automatic',
  'Graph API',
  'Threat protection and detection',
  '/security/threatIntelligence/17',
  'isEnabled',
  'true',
  false,
  '["Navigate to Microsoft Defender settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Low',
  'High',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-DEF-018',
  'Microsoft Defender Control 18',
  'Threat protection and detection - Control 18',
  'TG-DEF',
  'Security',
  'Defender',
  'Medium', 4,
  'Automatic',
  'Graph API',
  'Threat protection and detection',
  '/security/threatIntelligence/18',
  'isEnabled',
  'true',
  false,
  '["Navigate to Microsoft Defender settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Low',
  'High',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-DEF-019',
  'Microsoft Defender Control 19',
  'Threat protection and detection - Control 19',
  'TG-DEF',
  'Security',
  'Defender',
  'High', 7,
  'Automatic',
  'Graph API',
  'Threat protection and detection',
  '/security/threatIntelligence/19',
  'isEnabled',
  'true',
  true,
  '["Navigate to Microsoft Defender settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Medium',
  'High',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-DEF-020',
  'Microsoft Defender Control 20',
  'Threat protection and detection - Control 20',
  'TG-DEF',
  'Security',
  'Defender',
  'High', 7,
  'Automatic',
  'Graph API',
  'Threat protection and detection',
  '/security/threatIntelligence/20',
  'isEnabled',
  'true',
  true,
  '["Navigate to Microsoft Defender settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Medium',
  'High',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-DEF-021',
  'Microsoft Defender Control 21',
  'Threat protection and detection - Control 21',
  'TG-DEF',
  'Security',
  'Defender',
  'High', 7,
  'Automatic',
  'Graph API',
  'Threat protection and detection',
  '/security/threatIntelligence/21',
  'isEnabled',
  'true',
  true,
  '["Navigate to Microsoft Defender settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Medium',
  'High',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-DEF-022',
  'Microsoft Defender Control 22',
  'Threat protection and detection - Control 22',
  'TG-DEF',
  'Security',
  'Defender',
  'Critical', 10,
  'Automatic',
  'Graph API',
  'Threat protection and detection',
  '/security/threatIntelligence/22',
  'isEnabled',
  'true',
  true,
  '["Navigate to Microsoft Defender settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Medium',
  'Critical',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-DEF-023',
  'Microsoft Defender Control 23',
  'Threat protection and detection - Control 23',
  'TG-DEF',
  'Security',
  'Defender',
  'Medium', 4,
  'Automatic',
  'Graph API',
  'Threat protection and detection',
  '/security/threatIntelligence/23',
  'isEnabled',
  'true',
  false,
  '["Navigate to Microsoft Defender settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Low',
  'High',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-DEF-024',
  'Microsoft Defender Control 24',
  'Threat protection and detection - Control 24',
  'TG-DEF',
  'Security',
  'Defender',
  'Critical', 10,
  'Automatic',
  'Graph API',
  'Threat protection and detection',
  '/security/threatIntelligence/24',
  'isEnabled',
  'true',
  true,
  '["Navigate to Microsoft Defender settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Medium',
  'Critical',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-DEF-025',
  'Microsoft Defender Control 25',
  'Threat protection and detection - Control 25',
  'TG-DEF',
  'Security',
  'Defender',
  'Medium', 4,
  'Automatic',
  'Graph API',
  'Threat protection and detection',
  '/security/threatIntelligence/25',
  'isEnabled',
  'true',
  false,
  '["Navigate to Microsoft Defender settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Low',
  'High',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-DEF-026',
  'Microsoft Defender Control 26',
  'Threat protection and detection - Control 26',
  'TG-DEF',
  'Security',
  'Defender',
  'High', 7,
  'Automatic',
  'Graph API',
  'Threat protection and detection',
  '/security/threatIntelligence/26',
  'isEnabled',
  'true',
  true,
  '["Navigate to Microsoft Defender settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Medium',
  'High',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-DEF-027',
  'Microsoft Defender Control 27',
  'Threat protection and detection - Control 27',
  'TG-DEF',
  'Security',
  'Defender',
  'Medium', 4,
  'Automatic',
  'Graph API',
  'Threat protection and detection',
  '/security/threatIntelligence/27',
  'isEnabled',
  'true',
  false,
  '["Navigate to Microsoft Defender settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Low',
  'High',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-DEF-028',
  'Microsoft Defender Control 28',
  'Threat protection and detection - Control 28',
  'TG-DEF',
  'Security',
  'Defender',
  'Critical', 10,
  'Automatic',
  'Graph API',
  'Threat protection and detection',
  '/security/threatIntelligence/28',
  'isEnabled',
  'true',
  true,
  '["Navigate to Microsoft Defender settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Medium',
  'Critical',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-DEF-029',
  'Microsoft Defender Control 29',
  'Threat protection and detection - Control 29',
  'TG-DEF',
  'Security',
  'Defender',
  'Critical', 10,
  'Automatic',
  'Graph API',
  'Threat protection and detection',
  '/security/threatIntelligence/29',
  'isEnabled',
  'true',
  true,
  '["Navigate to Microsoft Defender settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Medium',
  'Critical',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-DEF-030',
  'Microsoft Defender Control 30',
  'Threat protection and detection - Control 30',
  'TG-DEF',
  'Security',
  'Defender',
  'Medium', 4,
  'Automatic',
  'Graph API',
  'Threat protection and detection',
  '/security/threatIntelligence/30',
  'isEnabled',
  'true',
  false,
  '["Navigate to Microsoft Defender settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Low',
  'High',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-DEF-031',
  'Microsoft Defender Control 31',
  'Threat protection and detection - Control 31',
  'TG-DEF',
  'Security',
  'Defender',
  'Critical', 10,
  'Automatic',
  'Graph API',
  'Threat protection and detection',
  '/security/threatIntelligence/31',
  'isEnabled',
  'true',
  true,
  '["Navigate to Microsoft Defender settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Medium',
  'Critical',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-DEF-032',
  'Microsoft Defender Control 32',
  'Threat protection and detection - Control 32',
  'TG-DEF',
  'Security',
  'Defender',
  'Medium', 4,
  'Automatic',
  'Graph API',
  'Threat protection and detection',
  '/security/threatIntelligence/32',
  'isEnabled',
  'true',
  false,
  '["Navigate to Microsoft Defender settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Low',
  'High',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-DEF-033',
  'Microsoft Defender Control 33',
  'Threat protection and detection - Control 33',
  'TG-DEF',
  'Security',
  'Defender',
  'Medium', 4,
  'Automatic',
  'Graph API',
  'Threat protection and detection',
  '/security/threatIntelligence/33',
  'isEnabled',
  'true',
  false,
  '["Navigate to Microsoft Defender settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Low',
  'High',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-DEF-034',
  'Microsoft Defender Control 34',
  'Threat protection and detection - Control 34',
  'TG-DEF',
  'Security',
  'Defender',
  'High', 7,
  'Automatic',
  'Graph API',
  'Threat protection and detection',
  '/security/threatIntelligence/34',
  'isEnabled',
  'true',
  true,
  '["Navigate to Microsoft Defender settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Medium',
  'High',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-DEF-035',
  'Microsoft Defender Control 35',
  'Threat protection and detection - Control 35',
  'TG-DEF',
  'Security',
  'Defender',
  'High', 7,
  'Automatic',
  'Graph API',
  'Threat protection and detection',
  '/security/threatIntelligence/35',
  'isEnabled',
  'true',
  true,
  '["Navigate to Microsoft Defender settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Medium',
  'High',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-DEF-036',
  'Microsoft Defender Control 36',
  'Threat protection and detection - Control 36',
  'TG-DEF',
  'Security',
  'Defender',
  'High', 7,
  'Automatic',
  'Graph API',
  'Threat protection and detection',
  '/security/threatIntelligence/36',
  'isEnabled',
  'true',
  true,
  '["Navigate to Microsoft Defender settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Medium',
  'High',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-DEF-037',
  'Microsoft Defender Control 37',
  'Threat protection and detection - Control 37',
  'TG-DEF',
  'Security',
  'Defender',
  'High', 7,
  'Automatic',
  'Graph API',
  'Threat protection and detection',
  '/security/threatIntelligence/37',
  'isEnabled',
  'true',
  true,
  '["Navigate to Microsoft Defender settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Medium',
  'High',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-DEF-038',
  'Microsoft Defender Control 38',
  'Threat protection and detection - Control 38',
  'TG-DEF',
  'Security',
  'Defender',
  'Medium', 4,
  'Automatic',
  'Graph API',
  'Threat protection and detection',
  '/security/threatIntelligence/38',
  'isEnabled',
  'true',
  false,
  '["Navigate to Microsoft Defender settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Low',
  'High',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-DEF-039',
  'Microsoft Defender Control 39',
  'Threat protection and detection - Control 39',
  'TG-DEF',
  'Security',
  'Defender',
  'Critical', 10,
  'Automatic',
  'Graph API',
  'Threat protection and detection',
  '/security/threatIntelligence/39',
  'isEnabled',
  'true',
  true,
  '["Navigate to Microsoft Defender settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Medium',
  'Critical',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-DEF-040',
  'Microsoft Defender Control 40',
  'Threat protection and detection - Control 40',
  'TG-DEF',
  'Security',
  'Defender',
  'High', 7,
  'Automatic',
  'Graph API',
  'Threat protection and detection',
  '/security/threatIntelligence/40',
  'isEnabled',
  'true',
  true,
  '["Navigate to Microsoft Defender settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Medium',
  'High',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-DEF-041',
  'Microsoft Defender Control 41',
  'Threat protection and detection - Control 41',
  'TG-DEF',
  'Security',
  'Defender',
  'Medium', 4,
  'Automatic',
  'Graph API',
  'Threat protection and detection',
  '/security/threatIntelligence/41',
  'isEnabled',
  'true',
  false,
  '["Navigate to Microsoft Defender settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Low',
  'High',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-DEF-042',
  'Microsoft Defender Control 42',
  'Threat protection and detection - Control 42',
  'TG-DEF',
  'Security',
  'Defender',
  'Medium', 4,
  'Automatic',
  'Graph API',
  'Threat protection and detection',
  '/security/threatIntelligence/42',
  'isEnabled',
  'true',
  false,
  '["Navigate to Microsoft Defender settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Low',
  'High',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-DEF-043',
  'Microsoft Defender Control 43',
  'Threat protection and detection - Control 43',
  'TG-DEF',
  'Security',
  'Defender',
  'High', 7,
  'Automatic',
  'Graph API',
  'Threat protection and detection',
  '/security/threatIntelligence/43',
  'isEnabled',
  'true',
  true,
  '["Navigate to Microsoft Defender settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Medium',
  'High',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-DEF-044',
  'Microsoft Defender Control 44',
  'Threat protection and detection - Control 44',
  'TG-DEF',
  'Security',
  'Defender',
  'Medium', 4,
  'Automatic',
  'Graph API',
  'Threat protection and detection',
  '/security/threatIntelligence/44',
  'isEnabled',
  'true',
  false,
  '["Navigate to Microsoft Defender settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Low',
  'High',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-DEF-045',
  'Microsoft Defender Control 45',
  'Threat protection and detection - Control 45',
  'TG-DEF',
  'Security',
  'Defender',
  'Medium', 4,
  'Automatic',
  'Graph API',
  'Threat protection and detection',
  '/security/threatIntelligence/45',
  'isEnabled',
  'true',
  false,
  '["Navigate to Microsoft Defender settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Low',
  'High',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-DEF-046',
  'Microsoft Defender Control 46',
  'Threat protection and detection - Control 46',
  'TG-DEF',
  'Security',
  'Defender',
  'High', 7,
  'Automatic',
  'Graph API',
  'Threat protection and detection',
  '/security/threatIntelligence/46',
  'isEnabled',
  'true',
  true,
  '["Navigate to Microsoft Defender settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Medium',
  'High',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-DEF-047',
  'Microsoft Defender Control 47',
  'Threat protection and detection - Control 47',
  'TG-DEF',
  'Security',
  'Defender',
  'Critical', 10,
  'Automatic',
  'Graph API',
  'Threat protection and detection',
  '/security/threatIntelligence/47',
  'isEnabled',
  'true',
  true,
  '["Navigate to Microsoft Defender settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Medium',
  'Critical',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-DEF-048',
  'Microsoft Defender Control 48',
  'Threat protection and detection - Control 48',
  'TG-DEF',
  'Security',
  'Defender',
  'Critical', 10,
  'Automatic',
  'Graph API',
  'Threat protection and detection',
  '/security/threatIntelligence/48',
  'isEnabled',
  'true',
  true,
  '["Navigate to Microsoft Defender settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Medium',
  'Critical',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-DEF-049',
  'Microsoft Defender Control 49',
  'Threat protection and detection - Control 49',
  'TG-DEF',
  'Security',
  'Defender',
  'High', 7,
  'Automatic',
  'Graph API',
  'Threat protection and detection',
  '/security/threatIntelligence/49',
  'isEnabled',
  'true',
  true,
  '["Navigate to Microsoft Defender settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Medium',
  'High',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-DEF-050',
  'Microsoft Defender Control 50',
  'Threat protection and detection - Control 50',
  'TG-DEF',
  'Security',
  'Defender',
  'Critical', 10,
  'Automatic',
  'Graph API',
  'Threat protection and detection',
  '/security/threatIntelligence/50',
  'isEnabled',
  'true',
  true,
  '["Navigate to Microsoft Defender settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Medium',
  'Critical',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-DEF-051',
  'Microsoft Defender Control 51',
  'Threat protection and detection - Control 51',
  'TG-DEF',
  'Security',
  'Defender',
  'Medium', 4,
  'Automatic',
  'Graph API',
  'Threat protection and detection',
  '/security/threatIntelligence/51',
  'isEnabled',
  'true',
  false,
  '["Navigate to Microsoft Defender settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Low',
  'High',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-DEF-052',
  'Microsoft Defender Control 52',
  'Threat protection and detection - Control 52',
  'TG-DEF',
  'Security',
  'Defender',
  'High', 7,
  'Automatic',
  'Graph API',
  'Threat protection and detection',
  '/security/threatIntelligence/52',
  'isEnabled',
  'true',
  true,
  '["Navigate to Microsoft Defender settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Medium',
  'High',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-DEF-053',
  'Microsoft Defender Control 53',
  'Threat protection and detection - Control 53',
  'TG-DEF',
  'Security',
  'Defender',
  'Critical', 10,
  'Automatic',
  'Graph API',
  'Threat protection and detection',
  '/security/threatIntelligence/53',
  'isEnabled',
  'true',
  true,
  '["Navigate to Microsoft Defender settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Medium',
  'Critical',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-DEF-054',
  'Microsoft Defender Control 54',
  'Threat protection and detection - Control 54',
  'TG-DEF',
  'Security',
  'Defender',
  'Medium', 4,
  'Automatic',
  'Graph API',
  'Threat protection and detection',
  '/security/threatIntelligence/54',
  'isEnabled',
  'true',
  false,
  '["Navigate to Microsoft Defender settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Low',
  'High',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-DEF-055',
  'Microsoft Defender Control 55',
  'Threat protection and detection - Control 55',
  'TG-DEF',
  'Security',
  'Defender',
  'Medium', 4,
  'Automatic',
  'Graph API',
  'Threat protection and detection',
  '/security/threatIntelligence/55',
  'isEnabled',
  'true',
  false,
  '["Navigate to Microsoft Defender settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Low',
  'High',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-DEF-056',
  'Microsoft Defender Control 56',
  'Threat protection and detection - Control 56',
  'TG-DEF',
  'Security',
  'Defender',
  'Medium', 4,
  'Automatic',
  'Graph API',
  'Threat protection and detection',
  '/security/threatIntelligence/56',
  'isEnabled',
  'true',
  false,
  '["Navigate to Microsoft Defender settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Low',
  'High',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-DEF-057',
  'Microsoft Defender Control 57',
  'Threat protection and detection - Control 57',
  'TG-DEF',
  'Security',
  'Defender',
  'Critical', 10,
  'Automatic',
  'Graph API',
  'Threat protection and detection',
  '/security/threatIntelligence/57',
  'isEnabled',
  'true',
  true,
  '["Navigate to Microsoft Defender settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Medium',
  'Critical',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-DEF-058',
  'Microsoft Defender Control 58',
  'Threat protection and detection - Control 58',
  'TG-DEF',
  'Security',
  'Defender',
  'High', 7,
  'Automatic',
  'Graph API',
  'Threat protection and detection',
  '/security/threatIntelligence/58',
  'isEnabled',
  'true',
  true,
  '["Navigate to Microsoft Defender settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Medium',
  'High',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-DEF-059',
  'Microsoft Defender Control 59',
  'Threat protection and detection - Control 59',
  'TG-DEF',
  'Security',
  'Defender',
  'Medium', 4,
  'Automatic',
  'Graph API',
  'Threat protection and detection',
  '/security/threatIntelligence/59',
  'isEnabled',
  'true',
  false,
  '["Navigate to Microsoft Defender settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Low',
  'High',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-DEF-060',
  'Microsoft Defender Control 60',
  'Threat protection and detection - Control 60',
  'TG-DEF',
  'Security',
  'Defender',
  'Medium', 4,
  'Automatic',
  'Graph API',
  'Threat protection and detection',
  '/security/threatIntelligence/60',
  'isEnabled',
  'true',
  false,
  '["Navigate to Microsoft Defender settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Low',
  'High',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-INT-001',
  'Intune Control 1',
  'Mobile and device management - Control 1',
  'TG-INT',
  'Security',
  'Intune',
  'Critical', 10,
  'Automatic',
  'Graph API',
  'Mobile and device management',
  '/deviceManagement/deviceConfigurations/1',
  'isEnabled',
  'true',
  true,
  '["Navigate to Intune settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Medium',
  'Critical',
  true,
  'Intune License',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-INT-002',
  'Intune Control 2',
  'Mobile and device management - Control 2',
  'TG-INT',
  'Security',
  'Intune',
  'Medium', 4,
  'Automatic',
  'Graph API',
  'Mobile and device management',
  '/deviceManagement/deviceConfigurations/2',
  'isEnabled',
  'true',
  false,
  '["Navigate to Intune settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Low',
  'High',
  true,
  'Intune License',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-INT-003',
  'Intune Control 3',
  'Mobile and device management - Control 3',
  'TG-INT',
  'Security',
  'Intune',
  'Medium', 4,
  'Automatic',
  'Graph API',
  'Mobile and device management',
  '/deviceManagement/deviceConfigurations/3',
  'isEnabled',
  'true',
  false,
  '["Navigate to Intune settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Low',
  'High',
  true,
  'Intune License',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-INT-004',
  'Intune Control 4',
  'Mobile and device management - Control 4',
  'TG-INT',
  'Security',
  'Intune',
  'Critical', 10,
  'Automatic',
  'Graph API',
  'Mobile and device management',
  '/deviceManagement/deviceConfigurations/4',
  'isEnabled',
  'true',
  true,
  '["Navigate to Intune settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Medium',
  'Critical',
  true,
  'Intune License',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-INT-005',
  'Intune Control 5',
  'Mobile and device management - Control 5',
  'TG-INT',
  'Security',
  'Intune',
  'Critical', 10,
  'Automatic',
  'Graph API',
  'Mobile and device management',
  '/deviceManagement/deviceConfigurations/5',
  'isEnabled',
  'true',
  true,
  '["Navigate to Intune settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Medium',
  'Critical',
  true,
  'Intune License',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-INT-006',
  'Intune Control 6',
  'Mobile and device management - Control 6',
  'TG-INT',
  'Security',
  'Intune',
  'High', 7,
  'Automatic',
  'Graph API',
  'Mobile and device management',
  '/deviceManagement/deviceConfigurations/6',
  'isEnabled',
  'true',
  true,
  '["Navigate to Intune settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Medium',
  'High',
  true,
  'Intune License',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-INT-007',
  'Intune Control 7',
  'Mobile and device management - Control 7',
  'TG-INT',
  'Security',
  'Intune',
  'Critical', 10,
  'Automatic',
  'Graph API',
  'Mobile and device management',
  '/deviceManagement/deviceConfigurations/7',
  'isEnabled',
  'true',
  true,
  '["Navigate to Intune settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Medium',
  'Critical',
  true,
  'Intune License',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-INT-008',
  'Intune Control 8',
  'Mobile and device management - Control 8',
  'TG-INT',
  'Security',
  'Intune',
  'High', 7,
  'Automatic',
  'Graph API',
  'Mobile and device management',
  '/deviceManagement/deviceConfigurations/8',
  'isEnabled',
  'true',
  true,
  '["Navigate to Intune settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Medium',
  'High',
  true,
  'Intune License',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-INT-009',
  'Intune Control 9',
  'Mobile and device management - Control 9',
  'TG-INT',
  'Security',
  'Intune',
  'High', 7,
  'Automatic',
  'Graph API',
  'Mobile and device management',
  '/deviceManagement/deviceConfigurations/9',
  'isEnabled',
  'true',
  true,
  '["Navigate to Intune settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Medium',
  'High',
  true,
  'Intune License',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-INT-010',
  'Intune Control 10',
  'Mobile and device management - Control 10',
  'TG-INT',
  'Security',
  'Intune',
  'Critical', 10,
  'Automatic',
  'Graph API',
  'Mobile and device management',
  '/deviceManagement/deviceConfigurations/10',
  'isEnabled',
  'true',
  true,
  '["Navigate to Intune settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Medium',
  'Critical',
  true,
  'Intune License',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-INT-011',
  'Intune Control 11',
  'Mobile and device management - Control 11',
  'TG-INT',
  'Security',
  'Intune',
  'Medium', 4,
  'Automatic',
  'Graph API',
  'Mobile and device management',
  '/deviceManagement/deviceConfigurations/11',
  'isEnabled',
  'true',
  false,
  '["Navigate to Intune settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Low',
  'High',
  true,
  'Intune License',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-INT-012',
  'Intune Control 12',
  'Mobile and device management - Control 12',
  'TG-INT',
  'Security',
  'Intune',
  'Medium', 4,
  'Automatic',
  'Graph API',
  'Mobile and device management',
  '/deviceManagement/deviceConfigurations/12',
  'isEnabled',
  'true',
  false,
  '["Navigate to Intune settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Low',
  'High',
  true,
  'Intune License',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-INT-013',
  'Intune Control 13',
  'Mobile and device management - Control 13',
  'TG-INT',
  'Security',
  'Intune',
  'High', 7,
  'Automatic',
  'Graph API',
  'Mobile and device management',
  '/deviceManagement/deviceConfigurations/13',
  'isEnabled',
  'true',
  true,
  '["Navigate to Intune settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Medium',
  'High',
  true,
  'Intune License',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-INT-014',
  'Intune Control 14',
  'Mobile and device management - Control 14',
  'TG-INT',
  'Security',
  'Intune',
  'Medium', 4,
  'Automatic',
  'Graph API',
  'Mobile and device management',
  '/deviceManagement/deviceConfigurations/14',
  'isEnabled',
  'true',
  false,
  '["Navigate to Intune settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Low',
  'High',
  true,
  'Intune License',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-INT-015',
  'Intune Control 15',
  'Mobile and device management - Control 15',
  'TG-INT',
  'Security',
  'Intune',
  'Critical', 10,
  'Automatic',
  'Graph API',
  'Mobile and device management',
  '/deviceManagement/deviceConfigurations/15',
  'isEnabled',
  'true',
  true,
  '["Navigate to Intune settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Medium',
  'Critical',
  true,
  'Intune License',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-INT-016',
  'Intune Control 16',
  'Mobile and device management - Control 16',
  'TG-INT',
  'Security',
  'Intune',
  'Critical', 10,
  'Automatic',
  'Graph API',
  'Mobile and device management',
  '/deviceManagement/deviceConfigurations/16',
  'isEnabled',
  'true',
  true,
  '["Navigate to Intune settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Medium',
  'Critical',
  true,
  'Intune License',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-INT-017',
  'Intune Control 17',
  'Mobile and device management - Control 17',
  'TG-INT',
  'Security',
  'Intune',
  'High', 7,
  'Automatic',
  'Graph API',
  'Mobile and device management',
  '/deviceManagement/deviceConfigurations/17',
  'isEnabled',
  'true',
  true,
  '["Navigate to Intune settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Medium',
  'High',
  true,
  'Intune License',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-INT-018',
  'Intune Control 18',
  'Mobile and device management - Control 18',
  'TG-INT',
  'Security',
  'Intune',
  'High', 7,
  'Automatic',
  'Graph API',
  'Mobile and device management',
  '/deviceManagement/deviceConfigurations/18',
  'isEnabled',
  'true',
  true,
  '["Navigate to Intune settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Medium',
  'High',
  true,
  'Intune License',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-INT-019',
  'Intune Control 19',
  'Mobile and device management - Control 19',
  'TG-INT',
  'Security',
  'Intune',
  'Medium', 4,
  'Automatic',
  'Graph API',
  'Mobile and device management',
  '/deviceManagement/deviceConfigurations/19',
  'isEnabled',
  'true',
  false,
  '["Navigate to Intune settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Low',
  'High',
  true,
  'Intune License',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-INT-020',
  'Intune Control 20',
  'Mobile and device management - Control 20',
  'TG-INT',
  'Security',
  'Intune',
  'Medium', 4,
  'Automatic',
  'Graph API',
  'Mobile and device management',
  '/deviceManagement/deviceConfigurations/20',
  'isEnabled',
  'true',
  false,
  '["Navigate to Intune settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Low',
  'High',
  true,
  'Intune License',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-INT-021',
  'Intune Control 21',
  'Mobile and device management - Control 21',
  'TG-INT',
  'Security',
  'Intune',
  'High', 7,
  'Automatic',
  'Graph API',
  'Mobile and device management',
  '/deviceManagement/deviceConfigurations/21',
  'isEnabled',
  'true',
  true,
  '["Navigate to Intune settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Medium',
  'High',
  true,
  'Intune License',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-INT-022',
  'Intune Control 22',
  'Mobile and device management - Control 22',
  'TG-INT',
  'Security',
  'Intune',
  'Medium', 4,
  'Automatic',
  'Graph API',
  'Mobile and device management',
  '/deviceManagement/deviceConfigurations/22',
  'isEnabled',
  'true',
  false,
  '["Navigate to Intune settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Low',
  'High',
  true,
  'Intune License',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-INT-023',
  'Intune Control 23',
  'Mobile and device management - Control 23',
  'TG-INT',
  'Security',
  'Intune',
  'Medium', 4,
  'Automatic',
  'Graph API',
  'Mobile and device management',
  '/deviceManagement/deviceConfigurations/23',
  'isEnabled',
  'true',
  false,
  '["Navigate to Intune settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Low',
  'High',
  true,
  'Intune License',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-INT-024',
  'Intune Control 24',
  'Mobile and device management - Control 24',
  'TG-INT',
  'Security',
  'Intune',
  'Critical', 10,
  'Automatic',
  'Graph API',
  'Mobile and device management',
  '/deviceManagement/deviceConfigurations/24',
  'isEnabled',
  'true',
  true,
  '["Navigate to Intune settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Medium',
  'Critical',
  true,
  'Intune License',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-INT-025',
  'Intune Control 25',
  'Mobile and device management - Control 25',
  'TG-INT',
  'Security',
  'Intune',
  'Medium', 4,
  'Automatic',
  'Graph API',
  'Mobile and device management',
  '/deviceManagement/deviceConfigurations/25',
  'isEnabled',
  'true',
  false,
  '["Navigate to Intune settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Low',
  'High',
  true,
  'Intune License',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-INT-026',
  'Intune Control 26',
  'Mobile and device management - Control 26',
  'TG-INT',
  'Security',
  'Intune',
  'High', 7,
  'Automatic',
  'Graph API',
  'Mobile and device management',
  '/deviceManagement/deviceConfigurations/26',
  'isEnabled',
  'true',
  true,
  '["Navigate to Intune settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Medium',
  'High',
  true,
  'Intune License',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-INT-027',
  'Intune Control 27',
  'Mobile and device management - Control 27',
  'TG-INT',
  'Security',
  'Intune',
  'Critical', 10,
  'Automatic',
  'Graph API',
  'Mobile and device management',
  '/deviceManagement/deviceConfigurations/27',
  'isEnabled',
  'true',
  true,
  '["Navigate to Intune settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Medium',
  'Critical',
  true,
  'Intune License',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-INT-028',
  'Intune Control 28',
  'Mobile and device management - Control 28',
  'TG-INT',
  'Security',
  'Intune',
  'Medium', 4,
  'Automatic',
  'Graph API',
  'Mobile and device management',
  '/deviceManagement/deviceConfigurations/28',
  'isEnabled',
  'true',
  false,
  '["Navigate to Intune settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Low',
  'High',
  true,
  'Intune License',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-INT-029',
  'Intune Control 29',
  'Mobile and device management - Control 29',
  'TG-INT',
  'Security',
  'Intune',
  'High', 7,
  'Automatic',
  'Graph API',
  'Mobile and device management',
  '/deviceManagement/deviceConfigurations/29',
  'isEnabled',
  'true',
  true,
  '["Navigate to Intune settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Medium',
  'High',
  true,
  'Intune License',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-INT-030',
  'Intune Control 30',
  'Mobile and device management - Control 30',
  'TG-INT',
  'Security',
  'Intune',
  'Medium', 4,
  'Automatic',
  'Graph API',
  'Mobile and device management',
  '/deviceManagement/deviceConfigurations/30',
  'isEnabled',
  'true',
  false,
  '["Navigate to Intune settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Low',
  'High',
  true,
  'Intune License',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-INT-031',
  'Intune Control 31',
  'Mobile and device management - Control 31',
  'TG-INT',
  'Security',
  'Intune',
  'Critical', 10,
  'Automatic',
  'Graph API',
  'Mobile and device management',
  '/deviceManagement/deviceConfigurations/31',
  'isEnabled',
  'true',
  true,
  '["Navigate to Intune settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Medium',
  'Critical',
  true,
  'Intune License',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-INT-032',
  'Intune Control 32',
  'Mobile and device management - Control 32',
  'TG-INT',
  'Security',
  'Intune',
  'Critical', 10,
  'Automatic',
  'Graph API',
  'Mobile and device management',
  '/deviceManagement/deviceConfigurations/32',
  'isEnabled',
  'true',
  true,
  '["Navigate to Intune settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Medium',
  'Critical',
  true,
  'Intune License',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-INT-033',
  'Intune Control 33',
  'Mobile and device management - Control 33',
  'TG-INT',
  'Security',
  'Intune',
  'Critical', 10,
  'Automatic',
  'Graph API',
  'Mobile and device management',
  '/deviceManagement/deviceConfigurations/33',
  'isEnabled',
  'true',
  true,
  '["Navigate to Intune settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Medium',
  'Critical',
  true,
  'Intune License',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-INT-034',
  'Intune Control 34',
  'Mobile and device management - Control 34',
  'TG-INT',
  'Security',
  'Intune',
  'Medium', 4,
  'Automatic',
  'Graph API',
  'Mobile and device management',
  '/deviceManagement/deviceConfigurations/34',
  'isEnabled',
  'true',
  false,
  '["Navigate to Intune settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Low',
  'High',
  true,
  'Intune License',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-INT-035',
  'Intune Control 35',
  'Mobile and device management - Control 35',
  'TG-INT',
  'Security',
  'Intune',
  'Critical', 10,
  'Automatic',
  'Graph API',
  'Mobile and device management',
  '/deviceManagement/deviceConfigurations/35',
  'isEnabled',
  'true',
  true,
  '["Navigate to Intune settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Medium',
  'Critical',
  true,
  'Intune License',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-INT-036',
  'Intune Control 36',
  'Mobile and device management - Control 36',
  'TG-INT',
  'Security',
  'Intune',
  'Medium', 4,
  'Automatic',
  'Graph API',
  'Mobile and device management',
  '/deviceManagement/deviceConfigurations/36',
  'isEnabled',
  'true',
  false,
  '["Navigate to Intune settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Low',
  'High',
  true,
  'Intune License',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-INT-037',
  'Intune Control 37',
  'Mobile and device management - Control 37',
  'TG-INT',
  'Security',
  'Intune',
  'Critical', 10,
  'Automatic',
  'Graph API',
  'Mobile and device management',
  '/deviceManagement/deviceConfigurations/37',
  'isEnabled',
  'true',
  true,
  '["Navigate to Intune settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Medium',
  'Critical',
  true,
  'Intune License',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-INT-038',
  'Intune Control 38',
  'Mobile and device management - Control 38',
  'TG-INT',
  'Security',
  'Intune',
  'Critical', 10,
  'Automatic',
  'Graph API',
  'Mobile and device management',
  '/deviceManagement/deviceConfigurations/38',
  'isEnabled',
  'true',
  true,
  '["Navigate to Intune settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Medium',
  'Critical',
  true,
  'Intune License',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-INT-039',
  'Intune Control 39',
  'Mobile and device management - Control 39',
  'TG-INT',
  'Security',
  'Intune',
  'Critical', 10,
  'Automatic',
  'Graph API',
  'Mobile and device management',
  '/deviceManagement/deviceConfigurations/39',
  'isEnabled',
  'true',
  true,
  '["Navigate to Intune settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Medium',
  'Critical',
  true,
  'Intune License',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-INT-040',
  'Intune Control 40',
  'Mobile and device management - Control 40',
  'TG-INT',
  'Security',
  'Intune',
  'Medium', 4,
  'Automatic',
  'Graph API',
  'Mobile and device management',
  '/deviceManagement/deviceConfigurations/40',
  'isEnabled',
  'true',
  false,
  '["Navigate to Intune settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Low',
  'High',
  true,
  'Intune License',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-INT-041',
  'Intune Control 41',
  'Mobile and device management - Control 41',
  'TG-INT',
  'Security',
  'Intune',
  'High', 7,
  'Automatic',
  'Graph API',
  'Mobile and device management',
  '/deviceManagement/deviceConfigurations/41',
  'isEnabled',
  'true',
  true,
  '["Navigate to Intune settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Medium',
  'High',
  true,
  'Intune License',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-INT-042',
  'Intune Control 42',
  'Mobile and device management - Control 42',
  'TG-INT',
  'Security',
  'Intune',
  'Medium', 4,
  'Automatic',
  'Graph API',
  'Mobile and device management',
  '/deviceManagement/deviceConfigurations/42',
  'isEnabled',
  'true',
  false,
  '["Navigate to Intune settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Low',
  'High',
  true,
  'Intune License',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-INT-043',
  'Intune Control 43',
  'Mobile and device management - Control 43',
  'TG-INT',
  'Security',
  'Intune',
  'High', 7,
  'Automatic',
  'Graph API',
  'Mobile and device management',
  '/deviceManagement/deviceConfigurations/43',
  'isEnabled',
  'true',
  true,
  '["Navigate to Intune settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Medium',
  'High',
  true,
  'Intune License',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-INT-044',
  'Intune Control 44',
  'Mobile and device management - Control 44',
  'TG-INT',
  'Security',
  'Intune',
  'High', 7,
  'Automatic',
  'Graph API',
  'Mobile and device management',
  '/deviceManagement/deviceConfigurations/44',
  'isEnabled',
  'true',
  true,
  '["Navigate to Intune settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Medium',
  'High',
  true,
  'Intune License',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-INT-045',
  'Intune Control 45',
  'Mobile and device management - Control 45',
  'TG-INT',
  'Security',
  'Intune',
  'Critical', 10,
  'Automatic',
  'Graph API',
  'Mobile and device management',
  '/deviceManagement/deviceConfigurations/45',
  'isEnabled',
  'true',
  true,
  '["Navigate to Intune settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Medium',
  'Critical',
  true,
  'Intune License',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-INT-046',
  'Intune Control 46',
  'Mobile and device management - Control 46',
  'TG-INT',
  'Security',
  'Intune',
  'Medium', 4,
  'Automatic',
  'Graph API',
  'Mobile and device management',
  '/deviceManagement/deviceConfigurations/46',
  'isEnabled',
  'true',
  false,
  '["Navigate to Intune settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Low',
  'High',
  true,
  'Intune License',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-INT-047',
  'Intune Control 47',
  'Mobile and device management - Control 47',
  'TG-INT',
  'Security',
  'Intune',
  'Critical', 10,
  'Automatic',
  'Graph API',
  'Mobile and device management',
  '/deviceManagement/deviceConfigurations/47',
  'isEnabled',
  'true',
  true,
  '["Navigate to Intune settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Medium',
  'Critical',
  true,
  'Intune License',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-INT-048',
  'Intune Control 48',
  'Mobile and device management - Control 48',
  'TG-INT',
  'Security',
  'Intune',
  'Medium', 4,
  'Automatic',
  'Graph API',
  'Mobile and device management',
  '/deviceManagement/deviceConfigurations/48',
  'isEnabled',
  'true',
  false,
  '["Navigate to Intune settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Low',
  'High',
  true,
  'Intune License',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-INT-049',
  'Intune Control 49',
  'Mobile and device management - Control 49',
  'TG-INT',
  'Security',
  'Intune',
  'Medium', 4,
  'Automatic',
  'Graph API',
  'Mobile and device management',
  '/deviceManagement/deviceConfigurations/49',
  'isEnabled',
  'true',
  false,
  '["Navigate to Intune settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Low',
  'High',
  true,
  'Intune License',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-INT-050',
  'Intune Control 50',
  'Mobile and device management - Control 50',
  'TG-INT',
  'Security',
  'Intune',
  'Critical', 10,
  'Automatic',
  'Graph API',
  'Mobile and device management',
  '/deviceManagement/deviceConfigurations/50',
  'isEnabled',
  'true',
  true,
  '["Navigate to Intune settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Medium',
  'Critical',
  true,
  'Intune License',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-INT-051',
  'Intune Control 51',
  'Mobile and device management - Control 51',
  'TG-INT',
  'Security',
  'Intune',
  'Critical', 10,
  'Automatic',
  'Graph API',
  'Mobile and device management',
  '/deviceManagement/deviceConfigurations/51',
  'isEnabled',
  'true',
  true,
  '["Navigate to Intune settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Medium',
  'Critical',
  true,
  'Intune License',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-INT-052',
  'Intune Control 52',
  'Mobile and device management - Control 52',
  'TG-INT',
  'Security',
  'Intune',
  'High', 7,
  'Automatic',
  'Graph API',
  'Mobile and device management',
  '/deviceManagement/deviceConfigurations/52',
  'isEnabled',
  'true',
  true,
  '["Navigate to Intune settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Medium',
  'High',
  true,
  'Intune License',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-INT-053',
  'Intune Control 53',
  'Mobile and device management - Control 53',
  'TG-INT',
  'Security',
  'Intune',
  'Medium', 4,
  'Automatic',
  'Graph API',
  'Mobile and device management',
  '/deviceManagement/deviceConfigurations/53',
  'isEnabled',
  'true',
  false,
  '["Navigate to Intune settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Low',
  'High',
  true,
  'Intune License',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-INT-054',
  'Intune Control 54',
  'Mobile and device management - Control 54',
  'TG-INT',
  'Security',
  'Intune',
  'Medium', 4,
  'Automatic',
  'Graph API',
  'Mobile and device management',
  '/deviceManagement/deviceConfigurations/54',
  'isEnabled',
  'true',
  false,
  '["Navigate to Intune settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Low',
  'High',
  true,
  'Intune License',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-INT-055',
  'Intune Control 55',
  'Mobile and device management - Control 55',
  'TG-INT',
  'Security',
  'Intune',
  'Critical', 10,
  'Automatic',
  'Graph API',
  'Mobile and device management',
  '/deviceManagement/deviceConfigurations/55',
  'isEnabled',
  'true',
  true,
  '["Navigate to Intune settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Medium',
  'Critical',
  true,
  'Intune License',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-INT-056',
  'Intune Control 56',
  'Mobile and device management - Control 56',
  'TG-INT',
  'Security',
  'Intune',
  'Critical', 10,
  'Automatic',
  'Graph API',
  'Mobile and device management',
  '/deviceManagement/deviceConfigurations/56',
  'isEnabled',
  'true',
  true,
  '["Navigate to Intune settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Medium',
  'Critical',
  true,
  'Intune License',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-INT-057',
  'Intune Control 57',
  'Mobile and device management - Control 57',
  'TG-INT',
  'Security',
  'Intune',
  'Medium', 4,
  'Automatic',
  'Graph API',
  'Mobile and device management',
  '/deviceManagement/deviceConfigurations/57',
  'isEnabled',
  'true',
  false,
  '["Navigate to Intune settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Low',
  'High',
  true,
  'Intune License',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-INT-058',
  'Intune Control 58',
  'Mobile and device management - Control 58',
  'TG-INT',
  'Security',
  'Intune',
  'Medium', 4,
  'Automatic',
  'Graph API',
  'Mobile and device management',
  '/deviceManagement/deviceConfigurations/58',
  'isEnabled',
  'true',
  false,
  '["Navigate to Intune settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Low',
  'High',
  true,
  'Intune License',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-INT-059',
  'Intune Control 59',
  'Mobile and device management - Control 59',
  'TG-INT',
  'Security',
  'Intune',
  'Medium', 4,
  'Automatic',
  'Graph API',
  'Mobile and device management',
  '/deviceManagement/deviceConfigurations/59',
  'isEnabled',
  'true',
  false,
  '["Navigate to Intune settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Low',
  'High',
  true,
  'Intune License',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-INT-060',
  'Intune Control 60',
  'Mobile and device management - Control 60',
  'TG-INT',
  'Security',
  'Intune',
  'High', 7,
  'Automatic',
  'Graph API',
  'Mobile and device management',
  '/deviceManagement/deviceConfigurations/60',
  'isEnabled',
  'true',
  true,
  '["Navigate to Intune settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Medium',
  'High',
  true,
  'Intune License',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-INT-061',
  'Intune Control 61',
  'Mobile and device management - Control 61',
  'TG-INT',
  'Security',
  'Intune',
  'Critical', 10,
  'Automatic',
  'Graph API',
  'Mobile and device management',
  '/deviceManagement/deviceConfigurations/61',
  'isEnabled',
  'true',
  true,
  '["Navigate to Intune settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Medium',
  'Critical',
  true,
  'Intune License',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-INT-062',
  'Intune Control 62',
  'Mobile and device management - Control 62',
  'TG-INT',
  'Security',
  'Intune',
  'Critical', 10,
  'Automatic',
  'Graph API',
  'Mobile and device management',
  '/deviceManagement/deviceConfigurations/62',
  'isEnabled',
  'true',
  true,
  '["Navigate to Intune settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Medium',
  'Critical',
  true,
  'Intune License',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-INT-063',
  'Intune Control 63',
  'Mobile and device management - Control 63',
  'TG-INT',
  'Security',
  'Intune',
  'Medium', 4,
  'Automatic',
  'Graph API',
  'Mobile and device management',
  '/deviceManagement/deviceConfigurations/63',
  'isEnabled',
  'true',
  false,
  '["Navigate to Intune settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Low',
  'High',
  true,
  'Intune License',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-INT-064',
  'Intune Control 64',
  'Mobile and device management - Control 64',
  'TG-INT',
  'Security',
  'Intune',
  'High', 7,
  'Automatic',
  'Graph API',
  'Mobile and device management',
  '/deviceManagement/deviceConfigurations/64',
  'isEnabled',
  'true',
  true,
  '["Navigate to Intune settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Medium',
  'High',
  true,
  'Intune License',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-INT-065',
  'Intune Control 65',
  'Mobile and device management - Control 65',
  'TG-INT',
  'Security',
  'Intune',
  'Critical', 10,
  'Automatic',
  'Graph API',
  'Mobile and device management',
  '/deviceManagement/deviceConfigurations/65',
  'isEnabled',
  'true',
  true,
  '["Navigate to Intune settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Medium',
  'Critical',
  true,
  'Intune License',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-INT-066',
  'Intune Control 66',
  'Mobile and device management - Control 66',
  'TG-INT',
  'Security',
  'Intune',
  'Critical', 10,
  'Automatic',
  'Graph API',
  'Mobile and device management',
  '/deviceManagement/deviceConfigurations/66',
  'isEnabled',
  'true',
  true,
  '["Navigate to Intune settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Medium',
  'Critical',
  true,
  'Intune License',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-INT-067',
  'Intune Control 67',
  'Mobile and device management - Control 67',
  'TG-INT',
  'Security',
  'Intune',
  'Critical', 10,
  'Automatic',
  'Graph API',
  'Mobile and device management',
  '/deviceManagement/deviceConfigurations/67',
  'isEnabled',
  'true',
  true,
  '["Navigate to Intune settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Medium',
  'Critical',
  true,
  'Intune License',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-INT-068',
  'Intune Control 68',
  'Mobile and device management - Control 68',
  'TG-INT',
  'Security',
  'Intune',
  'High', 7,
  'Automatic',
  'Graph API',
  'Mobile and device management',
  '/deviceManagement/deviceConfigurations/68',
  'isEnabled',
  'true',
  true,
  '["Navigate to Intune settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Medium',
  'High',
  true,
  'Intune License',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-INT-069',
  'Intune Control 69',
  'Mobile and device management - Control 69',
  'TG-INT',
  'Security',
  'Intune',
  'High', 7,
  'Automatic',
  'Graph API',
  'Mobile and device management',
  '/deviceManagement/deviceConfigurations/69',
  'isEnabled',
  'true',
  true,
  '["Navigate to Intune settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Medium',
  'High',
  true,
  'Intune License',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-INT-070',
  'Intune Control 70',
  'Mobile and device management - Control 70',
  'TG-INT',
  'Security',
  'Intune',
  'Medium', 4,
  'Automatic',
  'Graph API',
  'Mobile and device management',
  '/deviceManagement/deviceConfigurations/70',
  'isEnabled',
  'true',
  false,
  '["Navigate to Intune settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Low',
  'High',
  true,
  'Intune License',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-INT-071',
  'Intune Control 71',
  'Mobile and device management - Control 71',
  'TG-INT',
  'Security',
  'Intune',
  'High', 7,
  'Automatic',
  'Graph API',
  'Mobile and device management',
  '/deviceManagement/deviceConfigurations/71',
  'isEnabled',
  'true',
  true,
  '["Navigate to Intune settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Medium',
  'High',
  true,
  'Intune License',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-INT-072',
  'Intune Control 72',
  'Mobile and device management - Control 72',
  'TG-INT',
  'Security',
  'Intune',
  'High', 7,
  'Automatic',
  'Graph API',
  'Mobile and device management',
  '/deviceManagement/deviceConfigurations/72',
  'isEnabled',
  'true',
  true,
  '["Navigate to Intune settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Medium',
  'High',
  true,
  'Intune License',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-INT-073',
  'Intune Control 73',
  'Mobile and device management - Control 73',
  'TG-INT',
  'Security',
  'Intune',
  'High', 7,
  'Automatic',
  'Graph API',
  'Mobile and device management',
  '/deviceManagement/deviceConfigurations/73',
  'isEnabled',
  'true',
  true,
  '["Navigate to Intune settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Medium',
  'High',
  true,
  'Intune License',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-INT-074',
  'Intune Control 74',
  'Mobile and device management - Control 74',
  'TG-INT',
  'Security',
  'Intune',
  'Medium', 4,
  'Automatic',
  'Graph API',
  'Mobile and device management',
  '/deviceManagement/deviceConfigurations/74',
  'isEnabled',
  'true',
  false,
  '["Navigate to Intune settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Low',
  'High',
  true,
  'Intune License',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-INT-075',
  'Intune Control 75',
  'Mobile and device management - Control 75',
  'TG-INT',
  'Security',
  'Intune',
  'Critical', 10,
  'Automatic',
  'Graph API',
  'Mobile and device management',
  '/deviceManagement/deviceConfigurations/75',
  'isEnabled',
  'true',
  true,
  '["Navigate to Intune settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Medium',
  'Critical',
  true,
  'Intune License',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-INT-076',
  'Intune Control 76',
  'Mobile and device management - Control 76',
  'TG-INT',
  'Security',
  'Intune',
  'High', 7,
  'Automatic',
  'Graph API',
  'Mobile and device management',
  '/deviceManagement/deviceConfigurations/76',
  'isEnabled',
  'true',
  true,
  '["Navigate to Intune settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Medium',
  'High',
  true,
  'Intune License',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-INT-077',
  'Intune Control 77',
  'Mobile and device management - Control 77',
  'TG-INT',
  'Security',
  'Intune',
  'Medium', 4,
  'Automatic',
  'Graph API',
  'Mobile and device management',
  '/deviceManagement/deviceConfigurations/77',
  'isEnabled',
  'true',
  false,
  '["Navigate to Intune settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Low',
  'High',
  true,
  'Intune License',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-INT-078',
  'Intune Control 78',
  'Mobile and device management - Control 78',
  'TG-INT',
  'Security',
  'Intune',
  'High', 7,
  'Automatic',
  'Graph API',
  'Mobile and device management',
  '/deviceManagement/deviceConfigurations/78',
  'isEnabled',
  'true',
  true,
  '["Navigate to Intune settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Medium',
  'High',
  true,
  'Intune License',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-INT-079',
  'Intune Control 79',
  'Mobile and device management - Control 79',
  'TG-INT',
  'Security',
  'Intune',
  'High', 7,
  'Automatic',
  'Graph API',
  'Mobile and device management',
  '/deviceManagement/deviceConfigurations/79',
  'isEnabled',
  'true',
  true,
  '["Navigate to Intune settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Medium',
  'High',
  true,
  'Intune License',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-INT-080',
  'Intune Control 80',
  'Mobile and device management - Control 80',
  'TG-INT',
  'Security',
  'Intune',
  'Critical', 10,
  'Automatic',
  'Graph API',
  'Mobile and device management',
  '/deviceManagement/deviceConfigurations/80',
  'isEnabled',
  'true',
  true,
  '["Navigate to Intune settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Medium',
  'Critical',
  true,
  'Intune License',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-DLP-001',
  'Data Loss Prevention Control 1',
  'DLP policies and protection - Control 1',
  'TG-DLP',
  'Security',
  'Purview',
  'High', 7,
  'Automatic',
  'Graph API',
  'DLP policies and protection',
  '/dataClassification/dlp/1',
  'isEnabled',
  'true',
  true,
  '["Navigate to Data Loss Prevention settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Medium',
  'High',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-DLP-002',
  'Data Loss Prevention Control 2',
  'DLP policies and protection - Control 2',
  'TG-DLP',
  'Security',
  'Purview',
  'Medium', 4,
  'Automatic',
  'Graph API',
  'DLP policies and protection',
  '/dataClassification/dlp/2',
  'isEnabled',
  'true',
  false,
  '["Navigate to Data Loss Prevention settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Low',
  'High',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-DLP-003',
  'Data Loss Prevention Control 3',
  'DLP policies and protection - Control 3',
  'TG-DLP',
  'Security',
  'Purview',
  'Medium', 4,
  'Automatic',
  'Graph API',
  'DLP policies and protection',
  '/dataClassification/dlp/3',
  'isEnabled',
  'true',
  false,
  '["Navigate to Data Loss Prevention settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Low',
  'High',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-DLP-004',
  'Data Loss Prevention Control 4',
  'DLP policies and protection - Control 4',
  'TG-DLP',
  'Security',
  'Purview',
  'High', 7,
  'Automatic',
  'Graph API',
  'DLP policies and protection',
  '/dataClassification/dlp/4',
  'isEnabled',
  'true',
  true,
  '["Navigate to Data Loss Prevention settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Medium',
  'High',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-DLP-005',
  'Data Loss Prevention Control 5',
  'DLP policies and protection - Control 5',
  'TG-DLP',
  'Security',
  'Purview',
  'High', 7,
  'Automatic',
  'Graph API',
  'DLP policies and protection',
  '/dataClassification/dlp/5',
  'isEnabled',
  'true',
  true,
  '["Navigate to Data Loss Prevention settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Medium',
  'High',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-DLP-006',
  'Data Loss Prevention Control 6',
  'DLP policies and protection - Control 6',
  'TG-DLP',
  'Security',
  'Purview',
  'Medium', 4,
  'Automatic',
  'Graph API',
  'DLP policies and protection',
  '/dataClassification/dlp/6',
  'isEnabled',
  'true',
  false,
  '["Navigate to Data Loss Prevention settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Low',
  'High',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-DLP-007',
  'Data Loss Prevention Control 7',
  'DLP policies and protection - Control 7',
  'TG-DLP',
  'Security',
  'Purview',
  'Critical', 10,
  'Automatic',
  'Graph API',
  'DLP policies and protection',
  '/dataClassification/dlp/7',
  'isEnabled',
  'true',
  true,
  '["Navigate to Data Loss Prevention settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Medium',
  'Critical',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-DLP-008',
  'Data Loss Prevention Control 8',
  'DLP policies and protection - Control 8',
  'TG-DLP',
  'Security',
  'Purview',
  'Critical', 10,
  'Automatic',
  'Graph API',
  'DLP policies and protection',
  '/dataClassification/dlp/8',
  'isEnabled',
  'true',
  true,
  '["Navigate to Data Loss Prevention settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Medium',
  'Critical',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-DLP-009',
  'Data Loss Prevention Control 9',
  'DLP policies and protection - Control 9',
  'TG-DLP',
  'Security',
  'Purview',
  'High', 7,
  'Automatic',
  'Graph API',
  'DLP policies and protection',
  '/dataClassification/dlp/9',
  'isEnabled',
  'true',
  true,
  '["Navigate to Data Loss Prevention settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Medium',
  'High',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-DLP-010',
  'Data Loss Prevention Control 10',
  'DLP policies and protection - Control 10',
  'TG-DLP',
  'Security',
  'Purview',
  'High', 7,
  'Automatic',
  'Graph API',
  'DLP policies and protection',
  '/dataClassification/dlp/10',
  'isEnabled',
  'true',
  true,
  '["Navigate to Data Loss Prevention settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Medium',
  'High',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-DLP-011',
  'Data Loss Prevention Control 11',
  'DLP policies and protection - Control 11',
  'TG-DLP',
  'Security',
  'Purview',
  'High', 7,
  'Automatic',
  'Graph API',
  'DLP policies and protection',
  '/dataClassification/dlp/11',
  'isEnabled',
  'true',
  true,
  '["Navigate to Data Loss Prevention settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Medium',
  'High',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-DLP-012',
  'Data Loss Prevention Control 12',
  'DLP policies and protection - Control 12',
  'TG-DLP',
  'Security',
  'Purview',
  'High', 7,
  'Automatic',
  'Graph API',
  'DLP policies and protection',
  '/dataClassification/dlp/12',
  'isEnabled',
  'true',
  true,
  '["Navigate to Data Loss Prevention settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Medium',
  'High',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-DLP-013',
  'Data Loss Prevention Control 13',
  'DLP policies and protection - Control 13',
  'TG-DLP',
  'Security',
  'Purview',
  'High', 7,
  'Automatic',
  'Graph API',
  'DLP policies and protection',
  '/dataClassification/dlp/13',
  'isEnabled',
  'true',
  true,
  '["Navigate to Data Loss Prevention settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Medium',
  'High',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-DLP-014',
  'Data Loss Prevention Control 14',
  'DLP policies and protection - Control 14',
  'TG-DLP',
  'Security',
  'Purview',
  'High', 7,
  'Automatic',
  'Graph API',
  'DLP policies and protection',
  '/dataClassification/dlp/14',
  'isEnabled',
  'true',
  true,
  '["Navigate to Data Loss Prevention settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Medium',
  'High',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-DLP-015',
  'Data Loss Prevention Control 15',
  'DLP policies and protection - Control 15',
  'TG-DLP',
  'Security',
  'Purview',
  'Critical', 10,
  'Automatic',
  'Graph API',
  'DLP policies and protection',
  '/dataClassification/dlp/15',
  'isEnabled',
  'true',
  true,
  '["Navigate to Data Loss Prevention settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Medium',
  'Critical',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-DLP-016',
  'Data Loss Prevention Control 16',
  'DLP policies and protection - Control 16',
  'TG-DLP',
  'Security',
  'Purview',
  'High', 7,
  'Automatic',
  'Graph API',
  'DLP policies and protection',
  '/dataClassification/dlp/16',
  'isEnabled',
  'true',
  true,
  '["Navigate to Data Loss Prevention settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Medium',
  'High',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-DLP-017',
  'Data Loss Prevention Control 17',
  'DLP policies and protection - Control 17',
  'TG-DLP',
  'Security',
  'Purview',
  'Medium', 4,
  'Automatic',
  'Graph API',
  'DLP policies and protection',
  '/dataClassification/dlp/17',
  'isEnabled',
  'true',
  false,
  '["Navigate to Data Loss Prevention settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Low',
  'High',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-DLP-018',
  'Data Loss Prevention Control 18',
  'DLP policies and protection - Control 18',
  'TG-DLP',
  'Security',
  'Purview',
  'High', 7,
  'Automatic',
  'Graph API',
  'DLP policies and protection',
  '/dataClassification/dlp/18',
  'isEnabled',
  'true',
  true,
  '["Navigate to Data Loss Prevention settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Medium',
  'High',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-DLP-019',
  'Data Loss Prevention Control 19',
  'DLP policies and protection - Control 19',
  'TG-DLP',
  'Security',
  'Purview',
  'High', 7,
  'Automatic',
  'Graph API',
  'DLP policies and protection',
  '/dataClassification/dlp/19',
  'isEnabled',
  'true',
  true,
  '["Navigate to Data Loss Prevention settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Medium',
  'High',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-DLP-020',
  'Data Loss Prevention Control 20',
  'DLP policies and protection - Control 20',
  'TG-DLP',
  'Security',
  'Purview',
  'High', 7,
  'Automatic',
  'Graph API',
  'DLP policies and protection',
  '/dataClassification/dlp/20',
  'isEnabled',
  'true',
  true,
  '["Navigate to Data Loss Prevention settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Medium',
  'High',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-DLP-021',
  'Data Loss Prevention Control 21',
  'DLP policies and protection - Control 21',
  'TG-DLP',
  'Security',
  'Purview',
  'High', 7,
  'Automatic',
  'Graph API',
  'DLP policies and protection',
  '/dataClassification/dlp/21',
  'isEnabled',
  'true',
  true,
  '["Navigate to Data Loss Prevention settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Medium',
  'High',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-DLP-022',
  'Data Loss Prevention Control 22',
  'DLP policies and protection - Control 22',
  'TG-DLP',
  'Security',
  'Purview',
  'High', 7,
  'Automatic',
  'Graph API',
  'DLP policies and protection',
  '/dataClassification/dlp/22',
  'isEnabled',
  'true',
  true,
  '["Navigate to Data Loss Prevention settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Medium',
  'High',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-DLP-023',
  'Data Loss Prevention Control 23',
  'DLP policies and protection - Control 23',
  'TG-DLP',
  'Security',
  'Purview',
  'High', 7,
  'Automatic',
  'Graph API',
  'DLP policies and protection',
  '/dataClassification/dlp/23',
  'isEnabled',
  'true',
  true,
  '["Navigate to Data Loss Prevention settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Medium',
  'High',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-DLP-024',
  'Data Loss Prevention Control 24',
  'DLP policies and protection - Control 24',
  'TG-DLP',
  'Security',
  'Purview',
  'High', 7,
  'Automatic',
  'Graph API',
  'DLP policies and protection',
  '/dataClassification/dlp/24',
  'isEnabled',
  'true',
  true,
  '["Navigate to Data Loss Prevention settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Medium',
  'High',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-DLP-025',
  'Data Loss Prevention Control 25',
  'DLP policies and protection - Control 25',
  'TG-DLP',
  'Security',
  'Purview',
  'High', 7,
  'Automatic',
  'Graph API',
  'DLP policies and protection',
  '/dataClassification/dlp/25',
  'isEnabled',
  'true',
  true,
  '["Navigate to Data Loss Prevention settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Medium',
  'High',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-DLP-026',
  'Data Loss Prevention Control 26',
  'DLP policies and protection - Control 26',
  'TG-DLP',
  'Security',
  'Purview',
  'Critical', 10,
  'Automatic',
  'Graph API',
  'DLP policies and protection',
  '/dataClassification/dlp/26',
  'isEnabled',
  'true',
  true,
  '["Navigate to Data Loss Prevention settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Medium',
  'Critical',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-DLP-027',
  'Data Loss Prevention Control 27',
  'DLP policies and protection - Control 27',
  'TG-DLP',
  'Security',
  'Purview',
  'Critical', 10,
  'Automatic',
  'Graph API',
  'DLP policies and protection',
  '/dataClassification/dlp/27',
  'isEnabled',
  'true',
  true,
  '["Navigate to Data Loss Prevention settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Medium',
  'Critical',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-DLP-028',
  'Data Loss Prevention Control 28',
  'DLP policies and protection - Control 28',
  'TG-DLP',
  'Security',
  'Purview',
  'Critical', 10,
  'Automatic',
  'Graph API',
  'DLP policies and protection',
  '/dataClassification/dlp/28',
  'isEnabled',
  'true',
  true,
  '["Navigate to Data Loss Prevention settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Medium',
  'Critical',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-DLP-029',
  'Data Loss Prevention Control 29',
  'DLP policies and protection - Control 29',
  'TG-DLP',
  'Security',
  'Purview',
  'Critical', 10,
  'Automatic',
  'Graph API',
  'DLP policies and protection',
  '/dataClassification/dlp/29',
  'isEnabled',
  'true',
  true,
  '["Navigate to Data Loss Prevention settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Medium',
  'Critical',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-DLP-030',
  'Data Loss Prevention Control 30',
  'DLP policies and protection - Control 30',
  'TG-DLP',
  'Security',
  'Purview',
  'High', 7,
  'Automatic',
  'Graph API',
  'DLP policies and protection',
  '/dataClassification/dlp/30',
  'isEnabled',
  'true',
  true,
  '["Navigate to Data Loss Prevention settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Medium',
  'High',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-DLP-031',
  'Data Loss Prevention Control 31',
  'DLP policies and protection - Control 31',
  'TG-DLP',
  'Security',
  'Purview',
  'Medium', 4,
  'Automatic',
  'Graph API',
  'DLP policies and protection',
  '/dataClassification/dlp/31',
  'isEnabled',
  'true',
  false,
  '["Navigate to Data Loss Prevention settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Low',
  'High',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-DLP-032',
  'Data Loss Prevention Control 32',
  'DLP policies and protection - Control 32',
  'TG-DLP',
  'Security',
  'Purview',
  'High', 7,
  'Automatic',
  'Graph API',
  'DLP policies and protection',
  '/dataClassification/dlp/32',
  'isEnabled',
  'true',
  true,
  '["Navigate to Data Loss Prevention settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Medium',
  'High',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-DLP-033',
  'Data Loss Prevention Control 33',
  'DLP policies and protection - Control 33',
  'TG-DLP',
  'Security',
  'Purview',
  'High', 7,
  'Automatic',
  'Graph API',
  'DLP policies and protection',
  '/dataClassification/dlp/33',
  'isEnabled',
  'true',
  true,
  '["Navigate to Data Loss Prevention settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Medium',
  'High',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-DLP-034',
  'Data Loss Prevention Control 34',
  'DLP policies and protection - Control 34',
  'TG-DLP',
  'Security',
  'Purview',
  'High', 7,
  'Automatic',
  'Graph API',
  'DLP policies and protection',
  '/dataClassification/dlp/34',
  'isEnabled',
  'true',
  true,
  '["Navigate to Data Loss Prevention settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Medium',
  'High',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-DLP-035',
  'Data Loss Prevention Control 35',
  'DLP policies and protection - Control 35',
  'TG-DLP',
  'Security',
  'Purview',
  'Medium', 4,
  'Automatic',
  'Graph API',
  'DLP policies and protection',
  '/dataClassification/dlp/35',
  'isEnabled',
  'true',
  false,
  '["Navigate to Data Loss Prevention settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Low',
  'High',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-AUD-001',
  'Audit & Logging Control 1',
  'Audit logs and monitoring - Control 1',
  'TG-AUD',
  'Security',
  'Exchange',
  'High', 7,
  'Automatic',
  'PowerShell',
  'Audit logs and monitoring',
  '/auditLogs/directoryAudits/1',
  'isEnabled',
  'true',
  true,
  '["Navigate to Audit & Logging settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Medium',
  'High',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-AUD-002',
  'Audit & Logging Control 2',
  'Audit logs and monitoring - Control 2',
  'TG-AUD',
  'Security',
  'Exchange',
  'Medium', 4,
  'Automatic',
  'PowerShell',
  'Audit logs and monitoring',
  '/auditLogs/directoryAudits/2',
  'isEnabled',
  'true',
  false,
  '["Navigate to Audit & Logging settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Low',
  'High',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-AUD-003',
  'Audit & Logging Control 3',
  'Audit logs and monitoring - Control 3',
  'TG-AUD',
  'Security',
  'Exchange',
  'High', 7,
  'Automatic',
  'PowerShell',
  'Audit logs and monitoring',
  '/auditLogs/directoryAudits/3',
  'isEnabled',
  'true',
  true,
  '["Navigate to Audit & Logging settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Medium',
  'High',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-AUD-004',
  'Audit & Logging Control 4',
  'Audit logs and monitoring - Control 4',
  'TG-AUD',
  'Security',
  'Exchange',
  'High', 7,
  'Automatic',
  'PowerShell',
  'Audit logs and monitoring',
  '/auditLogs/directoryAudits/4',
  'isEnabled',
  'true',
  true,
  '["Navigate to Audit & Logging settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Medium',
  'High',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-AUD-005',
  'Audit & Logging Control 5',
  'Audit logs and monitoring - Control 5',
  'TG-AUD',
  'Security',
  'Exchange',
  'Medium', 4,
  'Automatic',
  'PowerShell',
  'Audit logs and monitoring',
  '/auditLogs/directoryAudits/5',
  'isEnabled',
  'true',
  false,
  '["Navigate to Audit & Logging settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Low',
  'High',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-AUD-006',
  'Audit & Logging Control 6',
  'Audit logs and monitoring - Control 6',
  'TG-AUD',
  'Security',
  'Exchange',
  'Critical', 10,
  'Automatic',
  'PowerShell',
  'Audit logs and monitoring',
  '/auditLogs/directoryAudits/6',
  'isEnabled',
  'true',
  true,
  '["Navigate to Audit & Logging settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Medium',
  'Critical',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-AUD-007',
  'Audit & Logging Control 7',
  'Audit logs and monitoring - Control 7',
  'TG-AUD',
  'Security',
  'Exchange',
  'Medium', 4,
  'Automatic',
  'PowerShell',
  'Audit logs and monitoring',
  '/auditLogs/directoryAudits/7',
  'isEnabled',
  'true',
  false,
  '["Navigate to Audit & Logging settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Low',
  'High',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-AUD-008',
  'Audit & Logging Control 8',
  'Audit logs and monitoring - Control 8',
  'TG-AUD',
  'Security',
  'Exchange',
  'Critical', 10,
  'Automatic',
  'PowerShell',
  'Audit logs and monitoring',
  '/auditLogs/directoryAudits/8',
  'isEnabled',
  'true',
  true,
  '["Navigate to Audit & Logging settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Medium',
  'Critical',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-AUD-009',
  'Audit & Logging Control 9',
  'Audit logs and monitoring - Control 9',
  'TG-AUD',
  'Security',
  'Exchange',
  'Medium', 4,
  'Automatic',
  'PowerShell',
  'Audit logs and monitoring',
  '/auditLogs/directoryAudits/9',
  'isEnabled',
  'true',
  false,
  '["Navigate to Audit & Logging settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Low',
  'High',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-AUD-010',
  'Audit & Logging Control 10',
  'Audit logs and monitoring - Control 10',
  'TG-AUD',
  'Security',
  'Exchange',
  'High', 7,
  'Automatic',
  'PowerShell',
  'Audit logs and monitoring',
  '/auditLogs/directoryAudits/10',
  'isEnabled',
  'true',
  true,
  '["Navigate to Audit & Logging settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Medium',
  'High',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-AUD-011',
  'Audit & Logging Control 11',
  'Audit logs and monitoring - Control 11',
  'TG-AUD',
  'Security',
  'Exchange',
  'High', 7,
  'Automatic',
  'PowerShell',
  'Audit logs and monitoring',
  '/auditLogs/directoryAudits/11',
  'isEnabled',
  'true',
  true,
  '["Navigate to Audit & Logging settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Medium',
  'High',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-AUD-012',
  'Audit & Logging Control 12',
  'Audit logs and monitoring - Control 12',
  'TG-AUD',
  'Security',
  'Exchange',
  'Medium', 4,
  'Automatic',
  'PowerShell',
  'Audit logs and monitoring',
  '/auditLogs/directoryAudits/12',
  'isEnabled',
  'true',
  false,
  '["Navigate to Audit & Logging settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Low',
  'High',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-AUD-013',
  'Audit & Logging Control 13',
  'Audit logs and monitoring - Control 13',
  'TG-AUD',
  'Security',
  'Exchange',
  'High', 7,
  'Automatic',
  'PowerShell',
  'Audit logs and monitoring',
  '/auditLogs/directoryAudits/13',
  'isEnabled',
  'true',
  true,
  '["Navigate to Audit & Logging settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Medium',
  'High',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-AUD-014',
  'Audit & Logging Control 14',
  'Audit logs and monitoring - Control 14',
  'TG-AUD',
  'Security',
  'Exchange',
  'High', 7,
  'Automatic',
  'PowerShell',
  'Audit logs and monitoring',
  '/auditLogs/directoryAudits/14',
  'isEnabled',
  'true',
  true,
  '["Navigate to Audit & Logging settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Medium',
  'High',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-AUD-015',
  'Audit & Logging Control 15',
  'Audit logs and monitoring - Control 15',
  'TG-AUD',
  'Security',
  'Exchange',
  'Critical', 10,
  'Automatic',
  'PowerShell',
  'Audit logs and monitoring',
  '/auditLogs/directoryAudits/15',
  'isEnabled',
  'true',
  true,
  '["Navigate to Audit & Logging settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Medium',
  'Critical',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-AUD-016',
  'Audit & Logging Control 16',
  'Audit logs and monitoring - Control 16',
  'TG-AUD',
  'Security',
  'Exchange',
  'Medium', 4,
  'Automatic',
  'PowerShell',
  'Audit logs and monitoring',
  '/auditLogs/directoryAudits/16',
  'isEnabled',
  'true',
  false,
  '["Navigate to Audit & Logging settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Low',
  'High',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-AUD-017',
  'Audit & Logging Control 17',
  'Audit logs and monitoring - Control 17',
  'TG-AUD',
  'Security',
  'Exchange',
  'Medium', 4,
  'Automatic',
  'PowerShell',
  'Audit logs and monitoring',
  '/auditLogs/directoryAudits/17',
  'isEnabled',
  'true',
  false,
  '["Navigate to Audit & Logging settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Low',
  'High',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-AUD-018',
  'Audit & Logging Control 18',
  'Audit logs and monitoring - Control 18',
  'TG-AUD',
  'Security',
  'Exchange',
  'High', 7,
  'Automatic',
  'PowerShell',
  'Audit logs and monitoring',
  '/auditLogs/directoryAudits/18',
  'isEnabled',
  'true',
  true,
  '["Navigate to Audit & Logging settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Medium',
  'High',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-AUD-019',
  'Audit & Logging Control 19',
  'Audit logs and monitoring - Control 19',
  'TG-AUD',
  'Security',
  'Exchange',
  'Critical', 10,
  'Automatic',
  'PowerShell',
  'Audit logs and monitoring',
  '/auditLogs/directoryAudits/19',
  'isEnabled',
  'true',
  true,
  '["Navigate to Audit & Logging settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Medium',
  'Critical',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-AUD-020',
  'Audit & Logging Control 20',
  'Audit logs and monitoring - Control 20',
  'TG-AUD',
  'Security',
  'Exchange',
  'Critical', 10,
  'Automatic',
  'PowerShell',
  'Audit logs and monitoring',
  '/auditLogs/directoryAudits/20',
  'isEnabled',
  'true',
  true,
  '["Navigate to Audit & Logging settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Medium',
  'Critical',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-AUD-021',
  'Audit & Logging Control 21',
  'Audit logs and monitoring - Control 21',
  'TG-AUD',
  'Security',
  'Exchange',
  'Medium', 4,
  'Automatic',
  'PowerShell',
  'Audit logs and monitoring',
  '/auditLogs/directoryAudits/21',
  'isEnabled',
  'true',
  false,
  '["Navigate to Audit & Logging settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Low',
  'High',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-AUD-022',
  'Audit & Logging Control 22',
  'Audit logs and monitoring - Control 22',
  'TG-AUD',
  'Security',
  'Exchange',
  'Critical', 10,
  'Automatic',
  'PowerShell',
  'Audit logs and monitoring',
  '/auditLogs/directoryAudits/22',
  'isEnabled',
  'true',
  true,
  '["Navigate to Audit & Logging settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Medium',
  'Critical',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-AUD-023',
  'Audit & Logging Control 23',
  'Audit logs and monitoring - Control 23',
  'TG-AUD',
  'Security',
  'Exchange',
  'Critical', 10,
  'Automatic',
  'PowerShell',
  'Audit logs and monitoring',
  '/auditLogs/directoryAudits/23',
  'isEnabled',
  'true',
  true,
  '["Navigate to Audit & Logging settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Medium',
  'Critical',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-AUD-024',
  'Audit & Logging Control 24',
  'Audit logs and monitoring - Control 24',
  'TG-AUD',
  'Security',
  'Exchange',
  'High', 7,
  'Automatic',
  'PowerShell',
  'Audit logs and monitoring',
  '/auditLogs/directoryAudits/24',
  'isEnabled',
  'true',
  true,
  '["Navigate to Audit & Logging settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Medium',
  'High',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-AUD-025',
  'Audit & Logging Control 25',
  'Audit logs and monitoring - Control 25',
  'TG-AUD',
  'Security',
  'Exchange',
  'Medium', 4,
  'Automatic',
  'PowerShell',
  'Audit logs and monitoring',
  '/auditLogs/directoryAudits/25',
  'isEnabled',
  'true',
  false,
  '["Navigate to Audit & Logging settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Low',
  'High',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-AUD-026',
  'Audit & Logging Control 26',
  'Audit logs and monitoring - Control 26',
  'TG-AUD',
  'Security',
  'Exchange',
  'Medium', 4,
  'Automatic',
  'PowerShell',
  'Audit logs and monitoring',
  '/auditLogs/directoryAudits/26',
  'isEnabled',
  'true',
  false,
  '["Navigate to Audit & Logging settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Low',
  'High',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-AUD-027',
  'Audit & Logging Control 27',
  'Audit logs and monitoring - Control 27',
  'TG-AUD',
  'Security',
  'Exchange',
  'Medium', 4,
  'Automatic',
  'PowerShell',
  'Audit logs and monitoring',
  '/auditLogs/directoryAudits/27',
  'isEnabled',
  'true',
  false,
  '["Navigate to Audit & Logging settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Low',
  'High',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-AUD-028',
  'Audit & Logging Control 28',
  'Audit logs and monitoring - Control 28',
  'TG-AUD',
  'Security',
  'Exchange',
  'Medium', 4,
  'Automatic',
  'PowerShell',
  'Audit logs and monitoring',
  '/auditLogs/directoryAudits/28',
  'isEnabled',
  'true',
  false,
  '["Navigate to Audit & Logging settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Low',
  'High',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-AUD-029',
  'Audit & Logging Control 29',
  'Audit logs and monitoring - Control 29',
  'TG-AUD',
  'Security',
  'Exchange',
  'Medium', 4,
  'Automatic',
  'PowerShell',
  'Audit logs and monitoring',
  '/auditLogs/directoryAudits/29',
  'isEnabled',
  'true',
  false,
  '["Navigate to Audit & Logging settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Low',
  'High',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-AUD-030',
  'Audit & Logging Control 30',
  'Audit logs and monitoring - Control 30',
  'TG-AUD',
  'Security',
  'Exchange',
  'High', 7,
  'Automatic',
  'PowerShell',
  'Audit logs and monitoring',
  '/auditLogs/directoryAudits/30',
  'isEnabled',
  'true',
  true,
  '["Navigate to Audit & Logging settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Medium',
  'High',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-MON-001',
  'Monitoring Control 1',
  'Security monitoring and alerts - Control 1',
  'TG-MON',
  'Security',
  'Defender',
  'High', 7,
  'Automatic',
  'Graph API',
  'Security monitoring and alerts',
  '/security/alerts/1',
  'isEnabled',
  'true',
  true,
  '["Navigate to Monitoring settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Medium',
  'High',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-MON-002',
  'Monitoring Control 2',
  'Security monitoring and alerts - Control 2',
  'TG-MON',
  'Security',
  'Defender',
  'Critical', 10,
  'Automatic',
  'Graph API',
  'Security monitoring and alerts',
  '/security/alerts/2',
  'isEnabled',
  'true',
  true,
  '["Navigate to Monitoring settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Medium',
  'Critical',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-MON-003',
  'Monitoring Control 3',
  'Security monitoring and alerts - Control 3',
  'TG-MON',
  'Security',
  'Defender',
  'Medium', 4,
  'Automatic',
  'Graph API',
  'Security monitoring and alerts',
  '/security/alerts/3',
  'isEnabled',
  'true',
  false,
  '["Navigate to Monitoring settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Low',
  'High',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-MON-004',
  'Monitoring Control 4',
  'Security monitoring and alerts - Control 4',
  'TG-MON',
  'Security',
  'Defender',
  'High', 7,
  'Automatic',
  'Graph API',
  'Security monitoring and alerts',
  '/security/alerts/4',
  'isEnabled',
  'true',
  true,
  '["Navigate to Monitoring settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Medium',
  'High',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-MON-005',
  'Monitoring Control 5',
  'Security monitoring and alerts - Control 5',
  'TG-MON',
  'Security',
  'Defender',
  'Critical', 10,
  'Automatic',
  'Graph API',
  'Security monitoring and alerts',
  '/security/alerts/5',
  'isEnabled',
  'true',
  true,
  '["Navigate to Monitoring settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Medium',
  'Critical',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-MON-006',
  'Monitoring Control 6',
  'Security monitoring and alerts - Control 6',
  'TG-MON',
  'Security',
  'Defender',
  'Medium', 4,
  'Automatic',
  'Graph API',
  'Security monitoring and alerts',
  '/security/alerts/6',
  'isEnabled',
  'true',
  false,
  '["Navigate to Monitoring settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Low',
  'High',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-MON-007',
  'Monitoring Control 7',
  'Security monitoring and alerts - Control 7',
  'TG-MON',
  'Security',
  'Defender',
  'Critical', 10,
  'Automatic',
  'Graph API',
  'Security monitoring and alerts',
  '/security/alerts/7',
  'isEnabled',
  'true',
  true,
  '["Navigate to Monitoring settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Medium',
  'Critical',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-MON-008',
  'Monitoring Control 8',
  'Security monitoring and alerts - Control 8',
  'TG-MON',
  'Security',
  'Defender',
  'Medium', 4,
  'Automatic',
  'Graph API',
  'Security monitoring and alerts',
  '/security/alerts/8',
  'isEnabled',
  'true',
  false,
  '["Navigate to Monitoring settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Low',
  'High',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-MON-009',
  'Monitoring Control 9',
  'Security monitoring and alerts - Control 9',
  'TG-MON',
  'Security',
  'Defender',
  'High', 7,
  'Automatic',
  'Graph API',
  'Security monitoring and alerts',
  '/security/alerts/9',
  'isEnabled',
  'true',
  true,
  '["Navigate to Monitoring settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Medium',
  'High',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-MON-010',
  'Monitoring Control 10',
  'Security monitoring and alerts - Control 10',
  'TG-MON',
  'Security',
  'Defender',
  'Critical', 10,
  'Automatic',
  'Graph API',
  'Security monitoring and alerts',
  '/security/alerts/10',
  'isEnabled',
  'true',
  true,
  '["Navigate to Monitoring settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Medium',
  'Critical',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-MON-011',
  'Monitoring Control 11',
  'Security monitoring and alerts - Control 11',
  'TG-MON',
  'Security',
  'Defender',
  'High', 7,
  'Automatic',
  'Graph API',
  'Security monitoring and alerts',
  '/security/alerts/11',
  'isEnabled',
  'true',
  true,
  '["Navigate to Monitoring settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Medium',
  'High',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-MON-012',
  'Monitoring Control 12',
  'Security monitoring and alerts - Control 12',
  'TG-MON',
  'Security',
  'Defender',
  'Critical', 10,
  'Automatic',
  'Graph API',
  'Security monitoring and alerts',
  '/security/alerts/12',
  'isEnabled',
  'true',
  true,
  '["Navigate to Monitoring settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Medium',
  'Critical',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-MON-013',
  'Monitoring Control 13',
  'Security monitoring and alerts - Control 13',
  'TG-MON',
  'Security',
  'Defender',
  'Critical', 10,
  'Automatic',
  'Graph API',
  'Security monitoring and alerts',
  '/security/alerts/13',
  'isEnabled',
  'true',
  true,
  '["Navigate to Monitoring settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Medium',
  'Critical',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-MON-014',
  'Monitoring Control 14',
  'Security monitoring and alerts - Control 14',
  'TG-MON',
  'Security',
  'Defender',
  'High', 7,
  'Automatic',
  'Graph API',
  'Security monitoring and alerts',
  '/security/alerts/14',
  'isEnabled',
  'true',
  true,
  '["Navigate to Monitoring settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Medium',
  'High',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-MON-015',
  'Monitoring Control 15',
  'Security monitoring and alerts - Control 15',
  'TG-MON',
  'Security',
  'Defender',
  'High', 7,
  'Automatic',
  'Graph API',
  'Security monitoring and alerts',
  '/security/alerts/15',
  'isEnabled',
  'true',
  true,
  '["Navigate to Monitoring settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Medium',
  'High',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-MON-016',
  'Monitoring Control 16',
  'Security monitoring and alerts - Control 16',
  'TG-MON',
  'Security',
  'Defender',
  'Critical', 10,
  'Automatic',
  'Graph API',
  'Security monitoring and alerts',
  '/security/alerts/16',
  'isEnabled',
  'true',
  true,
  '["Navigate to Monitoring settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Medium',
  'Critical',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-MON-017',
  'Monitoring Control 17',
  'Security monitoring and alerts - Control 17',
  'TG-MON',
  'Security',
  'Defender',
  'Medium', 4,
  'Automatic',
  'Graph API',
  'Security monitoring and alerts',
  '/security/alerts/17',
  'isEnabled',
  'true',
  false,
  '["Navigate to Monitoring settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Low',
  'High',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-MON-018',
  'Monitoring Control 18',
  'Security monitoring and alerts - Control 18',
  'TG-MON',
  'Security',
  'Defender',
  'High', 7,
  'Automatic',
  'Graph API',
  'Security monitoring and alerts',
  '/security/alerts/18',
  'isEnabled',
  'true',
  true,
  '["Navigate to Monitoring settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Medium',
  'High',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-MON-019',
  'Monitoring Control 19',
  'Security monitoring and alerts - Control 19',
  'TG-MON',
  'Security',
  'Defender',
  'Critical', 10,
  'Automatic',
  'Graph API',
  'Security monitoring and alerts',
  '/security/alerts/19',
  'isEnabled',
  'true',
  true,
  '["Navigate to Monitoring settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Medium',
  'Critical',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-MON-020',
  'Monitoring Control 20',
  'Security monitoring and alerts - Control 20',
  'TG-MON',
  'Security',
  'Defender',
  'Critical', 10,
  'Automatic',
  'Graph API',
  'Security monitoring and alerts',
  '/security/alerts/20',
  'isEnabled',
  'true',
  true,
  '["Navigate to Monitoring settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Medium',
  'Critical',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-MON-021',
  'Monitoring Control 21',
  'Security monitoring and alerts - Control 21',
  'TG-MON',
  'Security',
  'Defender',
  'Medium', 4,
  'Automatic',
  'Graph API',
  'Security monitoring and alerts',
  '/security/alerts/21',
  'isEnabled',
  'true',
  false,
  '["Navigate to Monitoring settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Low',
  'High',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-MON-022',
  'Monitoring Control 22',
  'Security monitoring and alerts - Control 22',
  'TG-MON',
  'Security',
  'Defender',
  'Critical', 10,
  'Automatic',
  'Graph API',
  'Security monitoring and alerts',
  '/security/alerts/22',
  'isEnabled',
  'true',
  true,
  '["Navigate to Monitoring settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Medium',
  'Critical',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-MON-023',
  'Monitoring Control 23',
  'Security monitoring and alerts - Control 23',
  'TG-MON',
  'Security',
  'Defender',
  'High', 7,
  'Automatic',
  'Graph API',
  'Security monitoring and alerts',
  '/security/alerts/23',
  'isEnabled',
  'true',
  true,
  '["Navigate to Monitoring settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Medium',
  'High',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-MON-024',
  'Monitoring Control 24',
  'Security monitoring and alerts - Control 24',
  'TG-MON',
  'Security',
  'Defender',
  'Medium', 4,
  'Automatic',
  'Graph API',
  'Security monitoring and alerts',
  '/security/alerts/24',
  'isEnabled',
  'true',
  false,
  '["Navigate to Monitoring settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Low',
  'High',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-MON-025',
  'Monitoring Control 25',
  'Security monitoring and alerts - Control 25',
  'TG-MON',
  'Security',
  'Defender',
  'Medium', 4,
  'Automatic',
  'Graph API',
  'Security monitoring and alerts',
  '/security/alerts/25',
  'isEnabled',
  'true',
  false,
  '["Navigate to Monitoring settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Low',
  'High',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-MON-026',
  'Monitoring Control 26',
  'Security monitoring and alerts - Control 26',
  'TG-MON',
  'Security',
  'Defender',
  'Medium', 4,
  'Automatic',
  'Graph API',
  'Security monitoring and alerts',
  '/security/alerts/26',
  'isEnabled',
  'true',
  false,
  '["Navigate to Monitoring settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Low',
  'High',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-MON-027',
  'Monitoring Control 27',
  'Security monitoring and alerts - Control 27',
  'TG-MON',
  'Security',
  'Defender',
  'Critical', 10,
  'Automatic',
  'Graph API',
  'Security monitoring and alerts',
  '/security/alerts/27',
  'isEnabled',
  'true',
  true,
  '["Navigate to Monitoring settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Medium',
  'Critical',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-MON-028',
  'Monitoring Control 28',
  'Security monitoring and alerts - Control 28',
  'TG-MON',
  'Security',
  'Defender',
  'Critical', 10,
  'Automatic',
  'Graph API',
  'Security monitoring and alerts',
  '/security/alerts/28',
  'isEnabled',
  'true',
  true,
  '["Navigate to Monitoring settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Medium',
  'Critical',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-MON-029',
  'Monitoring Control 29',
  'Security monitoring and alerts - Control 29',
  'TG-MON',
  'Security',
  'Defender',
  'Critical', 10,
  'Automatic',
  'Graph API',
  'Security monitoring and alerts',
  '/security/alerts/29',
  'isEnabled',
  'true',
  true,
  '["Navigate to Monitoring settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Medium',
  'Critical',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-MON-030',
  'Monitoring Control 30',
  'Security monitoring and alerts - Control 30',
  'TG-MON',
  'Security',
  'Defender',
  'Medium', 4,
  'Automatic',
  'Graph API',
  'Security monitoring and alerts',
  '/security/alerts/30',
  'isEnabled',
  'true',
  false,
  '["Navigate to Monitoring settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Low',
  'High',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-MON-031',
  'Monitoring Control 31',
  'Security monitoring and alerts - Control 31',
  'TG-MON',
  'Security',
  'Defender',
  'Critical', 10,
  'Automatic',
  'Graph API',
  'Security monitoring and alerts',
  '/security/alerts/31',
  'isEnabled',
  'true',
  true,
  '["Navigate to Monitoring settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Medium',
  'Critical',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-MON-032',
  'Monitoring Control 32',
  'Security monitoring and alerts - Control 32',
  'TG-MON',
  'Security',
  'Defender',
  'Medium', 4,
  'Automatic',
  'Graph API',
  'Security monitoring and alerts',
  '/security/alerts/32',
  'isEnabled',
  'true',
  false,
  '["Navigate to Monitoring settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Low',
  'High',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-MON-033',
  'Monitoring Control 33',
  'Security monitoring and alerts - Control 33',
  'TG-MON',
  'Security',
  'Defender',
  'High', 7,
  'Automatic',
  'Graph API',
  'Security monitoring and alerts',
  '/security/alerts/33',
  'isEnabled',
  'true',
  true,
  '["Navigate to Monitoring settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Medium',
  'High',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-MON-034',
  'Monitoring Control 34',
  'Security monitoring and alerts - Control 34',
  'TG-MON',
  'Security',
  'Defender',
  'Critical', 10,
  'Automatic',
  'Graph API',
  'Security monitoring and alerts',
  '/security/alerts/34',
  'isEnabled',
  'true',
  true,
  '["Navigate to Monitoring settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Medium',
  'Critical',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-MON-035',
  'Monitoring Control 35',
  'Security monitoring and alerts - Control 35',
  'TG-MON',
  'Security',
  'Defender',
  'High', 7,
  'Automatic',
  'Graph API',
  'Security monitoring and alerts',
  '/security/alerts/35',
  'isEnabled',
  'true',
  true,
  '["Navigate to Monitoring settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Medium',
  'High',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-NET-001',
  'Network Security Control 1',
  'Network and perimeter security - Control 1',
  'TG-NET',
  'Security',
  'Azure',
  'Critical', 10,
  'Automatic',
  'Graph API',
  'Network and perimeter security',
  '/network/securityGroups/1',
  'isEnabled',
  'true',
  true,
  '["Navigate to Network Security settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Medium',
  'Critical',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-NET-002',
  'Network Security Control 2',
  'Network and perimeter security - Control 2',
  'TG-NET',
  'Security',
  'Azure',
  'Critical', 10,
  'Automatic',
  'Graph API',
  'Network and perimeter security',
  '/network/securityGroups/2',
  'isEnabled',
  'true',
  true,
  '["Navigate to Network Security settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Medium',
  'Critical',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-NET-003',
  'Network Security Control 3',
  'Network and perimeter security - Control 3',
  'TG-NET',
  'Security',
  'Azure',
  'Medium', 4,
  'Automatic',
  'Graph API',
  'Network and perimeter security',
  '/network/securityGroups/3',
  'isEnabled',
  'true',
  false,
  '["Navigate to Network Security settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Low',
  'High',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-NET-004',
  'Network Security Control 4',
  'Network and perimeter security - Control 4',
  'TG-NET',
  'Security',
  'Azure',
  'Medium', 4,
  'Automatic',
  'Graph API',
  'Network and perimeter security',
  '/network/securityGroups/4',
  'isEnabled',
  'true',
  false,
  '["Navigate to Network Security settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Low',
  'High',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-NET-005',
  'Network Security Control 5',
  'Network and perimeter security - Control 5',
  'TG-NET',
  'Security',
  'Azure',
  'High', 7,
  'Automatic',
  'Graph API',
  'Network and perimeter security',
  '/network/securityGroups/5',
  'isEnabled',
  'true',
  true,
  '["Navigate to Network Security settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Medium',
  'High',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-NET-006',
  'Network Security Control 6',
  'Network and perimeter security - Control 6',
  'TG-NET',
  'Security',
  'Azure',
  'Critical', 10,
  'Automatic',
  'Graph API',
  'Network and perimeter security',
  '/network/securityGroups/6',
  'isEnabled',
  'true',
  true,
  '["Navigate to Network Security settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Medium',
  'Critical',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-NET-007',
  'Network Security Control 7',
  'Network and perimeter security - Control 7',
  'TG-NET',
  'Security',
  'Azure',
  'High', 7,
  'Automatic',
  'Graph API',
  'Network and perimeter security',
  '/network/securityGroups/7',
  'isEnabled',
  'true',
  true,
  '["Navigate to Network Security settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Medium',
  'High',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-NET-008',
  'Network Security Control 8',
  'Network and perimeter security - Control 8',
  'TG-NET',
  'Security',
  'Azure',
  'Critical', 10,
  'Automatic',
  'Graph API',
  'Network and perimeter security',
  '/network/securityGroups/8',
  'isEnabled',
  'true',
  true,
  '["Navigate to Network Security settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Medium',
  'Critical',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-NET-009',
  'Network Security Control 9',
  'Network and perimeter security - Control 9',
  'TG-NET',
  'Security',
  'Azure',
  'High', 7,
  'Automatic',
  'Graph API',
  'Network and perimeter security',
  '/network/securityGroups/9',
  'isEnabled',
  'true',
  true,
  '["Navigate to Network Security settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Medium',
  'High',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-NET-010',
  'Network Security Control 10',
  'Network and perimeter security - Control 10',
  'TG-NET',
  'Security',
  'Azure',
  'Critical', 10,
  'Automatic',
  'Graph API',
  'Network and perimeter security',
  '/network/securityGroups/10',
  'isEnabled',
  'true',
  true,
  '["Navigate to Network Security settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Medium',
  'Critical',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-NET-011',
  'Network Security Control 11',
  'Network and perimeter security - Control 11',
  'TG-NET',
  'Security',
  'Azure',
  'High', 7,
  'Automatic',
  'Graph API',
  'Network and perimeter security',
  '/network/securityGroups/11',
  'isEnabled',
  'true',
  true,
  '["Navigate to Network Security settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Medium',
  'High',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-NET-012',
  'Network Security Control 12',
  'Network and perimeter security - Control 12',
  'TG-NET',
  'Security',
  'Azure',
  'Medium', 4,
  'Automatic',
  'Graph API',
  'Network and perimeter security',
  '/network/securityGroups/12',
  'isEnabled',
  'true',
  false,
  '["Navigate to Network Security settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Low',
  'High',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-NET-013',
  'Network Security Control 13',
  'Network and perimeter security - Control 13',
  'TG-NET',
  'Security',
  'Azure',
  'High', 7,
  'Automatic',
  'Graph API',
  'Network and perimeter security',
  '/network/securityGroups/13',
  'isEnabled',
  'true',
  true,
  '["Navigate to Network Security settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Medium',
  'High',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-NET-014',
  'Network Security Control 14',
  'Network and perimeter security - Control 14',
  'TG-NET',
  'Security',
  'Azure',
  'Critical', 10,
  'Automatic',
  'Graph API',
  'Network and perimeter security',
  '/network/securityGroups/14',
  'isEnabled',
  'true',
  true,
  '["Navigate to Network Security settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Medium',
  'Critical',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-NET-015',
  'Network Security Control 15',
  'Network and perimeter security - Control 15',
  'TG-NET',
  'Security',
  'Azure',
  'Critical', 10,
  'Automatic',
  'Graph API',
  'Network and perimeter security',
  '/network/securityGroups/15',
  'isEnabled',
  'true',
  true,
  '["Navigate to Network Security settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Medium',
  'Critical',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-NET-016',
  'Network Security Control 16',
  'Network and perimeter security - Control 16',
  'TG-NET',
  'Security',
  'Azure',
  'Medium', 4,
  'Automatic',
  'Graph API',
  'Network and perimeter security',
  '/network/securityGroups/16',
  'isEnabled',
  'true',
  false,
  '["Navigate to Network Security settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Low',
  'High',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-NET-017',
  'Network Security Control 17',
  'Network and perimeter security - Control 17',
  'TG-NET',
  'Security',
  'Azure',
  'Critical', 10,
  'Automatic',
  'Graph API',
  'Network and perimeter security',
  '/network/securityGroups/17',
  'isEnabled',
  'true',
  true,
  '["Navigate to Network Security settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Medium',
  'Critical',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-NET-018',
  'Network Security Control 18',
  'Network and perimeter security - Control 18',
  'TG-NET',
  'Security',
  'Azure',
  'Medium', 4,
  'Automatic',
  'Graph API',
  'Network and perimeter security',
  '/network/securityGroups/18',
  'isEnabled',
  'true',
  false,
  '["Navigate to Network Security settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Low',
  'High',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-NET-019',
  'Network Security Control 19',
  'Network and perimeter security - Control 19',
  'TG-NET',
  'Security',
  'Azure',
  'High', 7,
  'Automatic',
  'Graph API',
  'Network and perimeter security',
  '/network/securityGroups/19',
  'isEnabled',
  'true',
  true,
  '["Navigate to Network Security settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Medium',
  'High',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-NET-020',
  'Network Security Control 20',
  'Network and perimeter security - Control 20',
  'TG-NET',
  'Security',
  'Azure',
  'Critical', 10,
  'Automatic',
  'Graph API',
  'Network and perimeter security',
  '/network/securityGroups/20',
  'isEnabled',
  'true',
  true,
  '["Navigate to Network Security settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Medium',
  'Critical',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-NET-021',
  'Network Security Control 21',
  'Network and perimeter security - Control 21',
  'TG-NET',
  'Security',
  'Azure',
  'High', 7,
  'Automatic',
  'Graph API',
  'Network and perimeter security',
  '/network/securityGroups/21',
  'isEnabled',
  'true',
  true,
  '["Navigate to Network Security settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Medium',
  'High',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-NET-022',
  'Network Security Control 22',
  'Network and perimeter security - Control 22',
  'TG-NET',
  'Security',
  'Azure',
  'High', 7,
  'Automatic',
  'Graph API',
  'Network and perimeter security',
  '/network/securityGroups/22',
  'isEnabled',
  'true',
  true,
  '["Navigate to Network Security settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Medium',
  'High',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-NET-023',
  'Network Security Control 23',
  'Network and perimeter security - Control 23',
  'TG-NET',
  'Security',
  'Azure',
  'Medium', 4,
  'Automatic',
  'Graph API',
  'Network and perimeter security',
  '/network/securityGroups/23',
  'isEnabled',
  'true',
  false,
  '["Navigate to Network Security settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Low',
  'High',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-NET-024',
  'Network Security Control 24',
  'Network and perimeter security - Control 24',
  'TG-NET',
  'Security',
  'Azure',
  'High', 7,
  'Automatic',
  'Graph API',
  'Network and perimeter security',
  '/network/securityGroups/24',
  'isEnabled',
  'true',
  true,
  '["Navigate to Network Security settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Medium',
  'High',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-NET-025',
  'Network Security Control 25',
  'Network and perimeter security - Control 25',
  'TG-NET',
  'Security',
  'Azure',
  'Medium', 4,
  'Automatic',
  'Graph API',
  'Network and perimeter security',
  '/network/securityGroups/25',
  'isEnabled',
  'true',
  false,
  '["Navigate to Network Security settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Low',
  'High',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-NET-026',
  'Network Security Control 26',
  'Network and perimeter security - Control 26',
  'TG-NET',
  'Security',
  'Azure',
  'Critical', 10,
  'Automatic',
  'Graph API',
  'Network and perimeter security',
  '/network/securityGroups/26',
  'isEnabled',
  'true',
  true,
  '["Navigate to Network Security settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Medium',
  'Critical',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-NET-027',
  'Network Security Control 27',
  'Network and perimeter security - Control 27',
  'TG-NET',
  'Security',
  'Azure',
  'Critical', 10,
  'Automatic',
  'Graph API',
  'Network and perimeter security',
  '/network/securityGroups/27',
  'isEnabled',
  'true',
  true,
  '["Navigate to Network Security settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Medium',
  'Critical',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-NET-028',
  'Network Security Control 28',
  'Network and perimeter security - Control 28',
  'TG-NET',
  'Security',
  'Azure',
  'High', 7,
  'Automatic',
  'Graph API',
  'Network and perimeter security',
  '/network/securityGroups/28',
  'isEnabled',
  'true',
  true,
  '["Navigate to Network Security settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Medium',
  'High',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-NET-029',
  'Network Security Control 29',
  'Network and perimeter security - Control 29',
  'TG-NET',
  'Security',
  'Azure',
  'Critical', 10,
  'Automatic',
  'Graph API',
  'Network and perimeter security',
  '/network/securityGroups/29',
  'isEnabled',
  'true',
  true,
  '["Navigate to Network Security settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Medium',
  'Critical',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-NET-030',
  'Network Security Control 30',
  'Network and perimeter security - Control 30',
  'TG-NET',
  'Security',
  'Azure',
  'Critical', 10,
  'Automatic',
  'Graph API',
  'Network and perimeter security',
  '/network/securityGroups/30',
  'isEnabled',
  'true',
  true,
  '["Navigate to Network Security settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Medium',
  'Critical',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-GOV-001',
  'Governance Control 1',
  'Access reviews and governance - Control 1',
  'TG-GOV',
  'Security',
  'Entra ID',
  'Critical', 10,
  'Automatic',
  'Graph API',
  'Access reviews and governance',
  '/identityGovernance/accessReviews/1',
  'isEnabled',
  'true',
  true,
  '["Navigate to Governance settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Medium',
  'Critical',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-GOV-002',
  'Governance Control 2',
  'Access reviews and governance - Control 2',
  'TG-GOV',
  'Security',
  'Entra ID',
  'Critical', 10,
  'Automatic',
  'Graph API',
  'Access reviews and governance',
  '/identityGovernance/accessReviews/2',
  'isEnabled',
  'true',
  true,
  '["Navigate to Governance settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Medium',
  'Critical',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-GOV-003',
  'Governance Control 3',
  'Access reviews and governance - Control 3',
  'TG-GOV',
  'Security',
  'Entra ID',
  'Critical', 10,
  'Automatic',
  'Graph API',
  'Access reviews and governance',
  '/identityGovernance/accessReviews/3',
  'isEnabled',
  'true',
  true,
  '["Navigate to Governance settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Medium',
  'Critical',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-GOV-004',
  'Governance Control 4',
  'Access reviews and governance - Control 4',
  'TG-GOV',
  'Security',
  'Entra ID',
  'Critical', 10,
  'Automatic',
  'Graph API',
  'Access reviews and governance',
  '/identityGovernance/accessReviews/4',
  'isEnabled',
  'true',
  true,
  '["Navigate to Governance settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Medium',
  'Critical',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-GOV-005',
  'Governance Control 5',
  'Access reviews and governance - Control 5',
  'TG-GOV',
  'Security',
  'Entra ID',
  'Medium', 4,
  'Automatic',
  'Graph API',
  'Access reviews and governance',
  '/identityGovernance/accessReviews/5',
  'isEnabled',
  'true',
  false,
  '["Navigate to Governance settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Low',
  'High',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-GOV-006',
  'Governance Control 6',
  'Access reviews and governance - Control 6',
  'TG-GOV',
  'Security',
  'Entra ID',
  'Medium', 4,
  'Automatic',
  'Graph API',
  'Access reviews and governance',
  '/identityGovernance/accessReviews/6',
  'isEnabled',
  'true',
  false,
  '["Navigate to Governance settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Low',
  'High',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-GOV-007',
  'Governance Control 7',
  'Access reviews and governance - Control 7',
  'TG-GOV',
  'Security',
  'Entra ID',
  'Medium', 4,
  'Automatic',
  'Graph API',
  'Access reviews and governance',
  '/identityGovernance/accessReviews/7',
  'isEnabled',
  'true',
  false,
  '["Navigate to Governance settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Low',
  'High',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-GOV-008',
  'Governance Control 8',
  'Access reviews and governance - Control 8',
  'TG-GOV',
  'Security',
  'Entra ID',
  'High', 7,
  'Automatic',
  'Graph API',
  'Access reviews and governance',
  '/identityGovernance/accessReviews/8',
  'isEnabled',
  'true',
  true,
  '["Navigate to Governance settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Medium',
  'High',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-GOV-009',
  'Governance Control 9',
  'Access reviews and governance - Control 9',
  'TG-GOV',
  'Security',
  'Entra ID',
  'Critical', 10,
  'Automatic',
  'Graph API',
  'Access reviews and governance',
  '/identityGovernance/accessReviews/9',
  'isEnabled',
  'true',
  true,
  '["Navigate to Governance settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Medium',
  'Critical',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-GOV-010',
  'Governance Control 10',
  'Access reviews and governance - Control 10',
  'TG-GOV',
  'Security',
  'Entra ID',
  'Critical', 10,
  'Automatic',
  'Graph API',
  'Access reviews and governance',
  '/identityGovernance/accessReviews/10',
  'isEnabled',
  'true',
  true,
  '["Navigate to Governance settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Medium',
  'Critical',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-GOV-011',
  'Governance Control 11',
  'Access reviews and governance - Control 11',
  'TG-GOV',
  'Security',
  'Entra ID',
  'Critical', 10,
  'Automatic',
  'Graph API',
  'Access reviews and governance',
  '/identityGovernance/accessReviews/11',
  'isEnabled',
  'true',
  true,
  '["Navigate to Governance settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Medium',
  'Critical',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-GOV-012',
  'Governance Control 12',
  'Access reviews and governance - Control 12',
  'TG-GOV',
  'Security',
  'Entra ID',
  'High', 7,
  'Automatic',
  'Graph API',
  'Access reviews and governance',
  '/identityGovernance/accessReviews/12',
  'isEnabled',
  'true',
  true,
  '["Navigate to Governance settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Medium',
  'High',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-GOV-013',
  'Governance Control 13',
  'Access reviews and governance - Control 13',
  'TG-GOV',
  'Security',
  'Entra ID',
  'High', 7,
  'Automatic',
  'Graph API',
  'Access reviews and governance',
  '/identityGovernance/accessReviews/13',
  'isEnabled',
  'true',
  true,
  '["Navigate to Governance settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Medium',
  'High',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-GOV-014',
  'Governance Control 14',
  'Access reviews and governance - Control 14',
  'TG-GOV',
  'Security',
  'Entra ID',
  'High', 7,
  'Automatic',
  'Graph API',
  'Access reviews and governance',
  '/identityGovernance/accessReviews/14',
  'isEnabled',
  'true',
  true,
  '["Navigate to Governance settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Medium',
  'High',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-GOV-015',
  'Governance Control 15',
  'Access reviews and governance - Control 15',
  'TG-GOV',
  'Security',
  'Entra ID',
  'High', 7,
  'Automatic',
  'Graph API',
  'Access reviews and governance',
  '/identityGovernance/accessReviews/15',
  'isEnabled',
  'true',
  true,
  '["Navigate to Governance settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Medium',
  'High',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-GOV-016',
  'Governance Control 16',
  'Access reviews and governance - Control 16',
  'TG-GOV',
  'Security',
  'Entra ID',
  'Medium', 4,
  'Automatic',
  'Graph API',
  'Access reviews and governance',
  '/identityGovernance/accessReviews/16',
  'isEnabled',
  'true',
  false,
  '["Navigate to Governance settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Low',
  'High',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-GOV-017',
  'Governance Control 17',
  'Access reviews and governance - Control 17',
  'TG-GOV',
  'Security',
  'Entra ID',
  'High', 7,
  'Automatic',
  'Graph API',
  'Access reviews and governance',
  '/identityGovernance/accessReviews/17',
  'isEnabled',
  'true',
  true,
  '["Navigate to Governance settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Medium',
  'High',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-GOV-018',
  'Governance Control 18',
  'Access reviews and governance - Control 18',
  'TG-GOV',
  'Security',
  'Entra ID',
  'Medium', 4,
  'Automatic',
  'Graph API',
  'Access reviews and governance',
  '/identityGovernance/accessReviews/18',
  'isEnabled',
  'true',
  false,
  '["Navigate to Governance settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Low',
  'High',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-GOV-019',
  'Governance Control 19',
  'Access reviews and governance - Control 19',
  'TG-GOV',
  'Security',
  'Entra ID',
  'Medium', 4,
  'Automatic',
  'Graph API',
  'Access reviews and governance',
  '/identityGovernance/accessReviews/19',
  'isEnabled',
  'true',
  false,
  '["Navigate to Governance settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Low',
  'High',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-GOV-020',
  'Governance Control 20',
  'Access reviews and governance - Control 20',
  'TG-GOV',
  'Security',
  'Entra ID',
  'Critical', 10,
  'Automatic',
  'Graph API',
  'Access reviews and governance',
  '/identityGovernance/accessReviews/20',
  'isEnabled',
  'true',
  true,
  '["Navigate to Governance settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Medium',
  'Critical',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-GOV-021',
  'Governance Control 21',
  'Access reviews and governance - Control 21',
  'TG-GOV',
  'Security',
  'Entra ID',
  'Critical', 10,
  'Automatic',
  'Graph API',
  'Access reviews and governance',
  '/identityGovernance/accessReviews/21',
  'isEnabled',
  'true',
  true,
  '["Navigate to Governance settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Medium',
  'Critical',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-GOV-022',
  'Governance Control 22',
  'Access reviews and governance - Control 22',
  'TG-GOV',
  'Security',
  'Entra ID',
  'High', 7,
  'Automatic',
  'Graph API',
  'Access reviews and governance',
  '/identityGovernance/accessReviews/22',
  'isEnabled',
  'true',
  true,
  '["Navigate to Governance settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Medium',
  'High',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-GOV-023',
  'Governance Control 23',
  'Access reviews and governance - Control 23',
  'TG-GOV',
  'Security',
  'Entra ID',
  'High', 7,
  'Automatic',
  'Graph API',
  'Access reviews and governance',
  '/identityGovernance/accessReviews/23',
  'isEnabled',
  'true',
  true,
  '["Navigate to Governance settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Medium',
  'High',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-GOV-024',
  'Governance Control 24',
  'Access reviews and governance - Control 24',
  'TG-GOV',
  'Security',
  'Entra ID',
  'High', 7,
  'Automatic',
  'Graph API',
  'Access reviews and governance',
  '/identityGovernance/accessReviews/24',
  'isEnabled',
  'true',
  true,
  '["Navigate to Governance settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Medium',
  'High',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-GOV-025',
  'Governance Control 25',
  'Access reviews and governance - Control 25',
  'TG-GOV',
  'Security',
  'Entra ID',
  'Medium', 4,
  'Automatic',
  'Graph API',
  'Access reviews and governance',
  '/identityGovernance/accessReviews/25',
  'isEnabled',
  'true',
  false,
  '["Navigate to Governance settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Low',
  'High',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-GOV-026',
  'Governance Control 26',
  'Access reviews and governance - Control 26',
  'TG-GOV',
  'Security',
  'Entra ID',
  'Critical', 10,
  'Automatic',
  'Graph API',
  'Access reviews and governance',
  '/identityGovernance/accessReviews/26',
  'isEnabled',
  'true',
  true,
  '["Navigate to Governance settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Medium',
  'Critical',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-GOV-027',
  'Governance Control 27',
  'Access reviews and governance - Control 27',
  'TG-GOV',
  'Security',
  'Entra ID',
  'Critical', 10,
  'Automatic',
  'Graph API',
  'Access reviews and governance',
  '/identityGovernance/accessReviews/27',
  'isEnabled',
  'true',
  true,
  '["Navigate to Governance settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Medium',
  'Critical',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-GOV-028',
  'Governance Control 28',
  'Access reviews and governance - Control 28',
  'TG-GOV',
  'Security',
  'Entra ID',
  'Critical', 10,
  'Automatic',
  'Graph API',
  'Access reviews and governance',
  '/identityGovernance/accessReviews/28',
  'isEnabled',
  'true',
  true,
  '["Navigate to Governance settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Medium',
  'Critical',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-GOV-029',
  'Governance Control 29',
  'Access reviews and governance - Control 29',
  'TG-GOV',
  'Security',
  'Entra ID',
  'High', 7,
  'Automatic',
  'Graph API',
  'Access reviews and governance',
  '/identityGovernance/accessReviews/29',
  'isEnabled',
  'true',
  true,
  '["Navigate to Governance settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Medium',
  'High',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-GOV-030',
  'Governance Control 30',
  'Access reviews and governance - Control 30',
  'TG-GOV',
  'Security',
  'Entra ID',
  'High', 7,
  'Automatic',
  'Graph API',
  'Access reviews and governance',
  '/identityGovernance/accessReviews/30',
  'isEnabled',
  'true',
  true,
  '["Navigate to Governance settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Medium',
  'High',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-GOV-031',
  'Governance Control 31',
  'Access reviews and governance - Control 31',
  'TG-GOV',
  'Security',
  'Entra ID',
  'Critical', 10,
  'Automatic',
  'Graph API',
  'Access reviews and governance',
  '/identityGovernance/accessReviews/31',
  'isEnabled',
  'true',
  true,
  '["Navigate to Governance settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Medium',
  'Critical',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-GOV-032',
  'Governance Control 32',
  'Access reviews and governance - Control 32',
  'TG-GOV',
  'Security',
  'Entra ID',
  'Critical', 10,
  'Automatic',
  'Graph API',
  'Access reviews and governance',
  '/identityGovernance/accessReviews/32',
  'isEnabled',
  'true',
  true,
  '["Navigate to Governance settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Medium',
  'Critical',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-GOV-033',
  'Governance Control 33',
  'Access reviews and governance - Control 33',
  'TG-GOV',
  'Security',
  'Entra ID',
  'Medium', 4,
  'Automatic',
  'Graph API',
  'Access reviews and governance',
  '/identityGovernance/accessReviews/33',
  'isEnabled',
  'true',
  false,
  '["Navigate to Governance settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Low',
  'High',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-GOV-034',
  'Governance Control 34',
  'Access reviews and governance - Control 34',
  'TG-GOV',
  'Security',
  'Entra ID',
  'High', 7,
  'Automatic',
  'Graph API',
  'Access reviews and governance',
  '/identityGovernance/accessReviews/34',
  'isEnabled',
  'true',
  true,
  '["Navigate to Governance settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Medium',
  'High',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-GOV-035',
  'Governance Control 35',
  'Access reviews and governance - Control 35',
  'TG-GOV',
  'Security',
  'Entra ID',
  'High', 7,
  'Automatic',
  'Graph API',
  'Access reviews and governance',
  '/identityGovernance/accessReviews/35',
  'isEnabled',
  'true',
  true,
  '["Navigate to Governance settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Medium',
  'High',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-GOV-036',
  'Governance Control 36',
  'Access reviews and governance - Control 36',
  'TG-GOV',
  'Security',
  'Entra ID',
  'Critical', 10,
  'Automatic',
  'Graph API',
  'Access reviews and governance',
  '/identityGovernance/accessReviews/36',
  'isEnabled',
  'true',
  true,
  '["Navigate to Governance settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Medium',
  'Critical',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-GOV-037',
  'Governance Control 37',
  'Access reviews and governance - Control 37',
  'TG-GOV',
  'Security',
  'Entra ID',
  'High', 7,
  'Automatic',
  'Graph API',
  'Access reviews and governance',
  '/identityGovernance/accessReviews/37',
  'isEnabled',
  'true',
  true,
  '["Navigate to Governance settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Medium',
  'High',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-GOV-038',
  'Governance Control 38',
  'Access reviews and governance - Control 38',
  'TG-GOV',
  'Security',
  'Entra ID',
  'Medium', 4,
  'Automatic',
  'Graph API',
  'Access reviews and governance',
  '/identityGovernance/accessReviews/38',
  'isEnabled',
  'true',
  false,
  '["Navigate to Governance settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Low',
  'High',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-GOV-039',
  'Governance Control 39',
  'Access reviews and governance - Control 39',
  'TG-GOV',
  'Security',
  'Entra ID',
  'Critical', 10,
  'Automatic',
  'Graph API',
  'Access reviews and governance',
  '/identityGovernance/accessReviews/39',
  'isEnabled',
  'true',
  true,
  '["Navigate to Governance settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Medium',
  'Critical',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-GOV-040',
  'Governance Control 40',
  'Access reviews and governance - Control 40',
  'TG-GOV',
  'Security',
  'Entra ID',
  'Critical', 10,
  'Automatic',
  'Graph API',
  'Access reviews and governance',
  '/identityGovernance/accessReviews/40',
  'isEnabled',
  'true',
  true,
  '["Navigate to Governance settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Medium',
  'Critical',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-BKP-001',
  'Backup & Recovery Control 1',
  'Data backup and recovery policies - Control 1',
  'TG-BKP',
  'Security',
  'Exchange',
  'Medium', 4,
  'Automatic',
  'Graph API',
  'Data backup and recovery policies',
  '/compliance/retentionPolicies/1',
  'isEnabled',
  'true',
  false,
  '["Navigate to Backup & Recovery settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Low',
  'High',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-BKP-002',
  'Backup & Recovery Control 2',
  'Data backup and recovery policies - Control 2',
  'TG-BKP',
  'Security',
  'Exchange',
  'High', 7,
  'Automatic',
  'Graph API',
  'Data backup and recovery policies',
  '/compliance/retentionPolicies/2',
  'isEnabled',
  'true',
  true,
  '["Navigate to Backup & Recovery settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Medium',
  'High',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-BKP-003',
  'Backup & Recovery Control 3',
  'Data backup and recovery policies - Control 3',
  'TG-BKP',
  'Security',
  'Exchange',
  'High', 7,
  'Automatic',
  'Graph API',
  'Data backup and recovery policies',
  '/compliance/retentionPolicies/3',
  'isEnabled',
  'true',
  true,
  '["Navigate to Backup & Recovery settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Medium',
  'High',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-BKP-004',
  'Backup & Recovery Control 4',
  'Data backup and recovery policies - Control 4',
  'TG-BKP',
  'Security',
  'Exchange',
  'High', 7,
  'Automatic',
  'Graph API',
  'Data backup and recovery policies',
  '/compliance/retentionPolicies/4',
  'isEnabled',
  'true',
  true,
  '["Navigate to Backup & Recovery settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Medium',
  'High',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-BKP-005',
  'Backup & Recovery Control 5',
  'Data backup and recovery policies - Control 5',
  'TG-BKP',
  'Security',
  'Exchange',
  'Medium', 4,
  'Automatic',
  'Graph API',
  'Data backup and recovery policies',
  '/compliance/retentionPolicies/5',
  'isEnabled',
  'true',
  false,
  '["Navigate to Backup & Recovery settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Low',
  'High',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-BKP-006',
  'Backup & Recovery Control 6',
  'Data backup and recovery policies - Control 6',
  'TG-BKP',
  'Security',
  'Exchange',
  'High', 7,
  'Automatic',
  'Graph API',
  'Data backup and recovery policies',
  '/compliance/retentionPolicies/6',
  'isEnabled',
  'true',
  true,
  '["Navigate to Backup & Recovery settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Medium',
  'High',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-BKP-007',
  'Backup & Recovery Control 7',
  'Data backup and recovery policies - Control 7',
  'TG-BKP',
  'Security',
  'Exchange',
  'Critical', 10,
  'Automatic',
  'Graph API',
  'Data backup and recovery policies',
  '/compliance/retentionPolicies/7',
  'isEnabled',
  'true',
  true,
  '["Navigate to Backup & Recovery settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Medium',
  'Critical',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-BKP-008',
  'Backup & Recovery Control 8',
  'Data backup and recovery policies - Control 8',
  'TG-BKP',
  'Security',
  'Exchange',
  'Medium', 4,
  'Automatic',
  'Graph API',
  'Data backup and recovery policies',
  '/compliance/retentionPolicies/8',
  'isEnabled',
  'true',
  false,
  '["Navigate to Backup & Recovery settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Low',
  'High',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-BKP-009',
  'Backup & Recovery Control 9',
  'Data backup and recovery policies - Control 9',
  'TG-BKP',
  'Security',
  'Exchange',
  'Medium', 4,
  'Automatic',
  'Graph API',
  'Data backup and recovery policies',
  '/compliance/retentionPolicies/9',
  'isEnabled',
  'true',
  false,
  '["Navigate to Backup & Recovery settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Low',
  'High',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-BKP-010',
  'Backup & Recovery Control 10',
  'Data backup and recovery policies - Control 10',
  'TG-BKP',
  'Security',
  'Exchange',
  'High', 7,
  'Automatic',
  'Graph API',
  'Data backup and recovery policies',
  '/compliance/retentionPolicies/10',
  'isEnabled',
  'true',
  true,
  '["Navigate to Backup & Recovery settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Medium',
  'High',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-BKP-011',
  'Backup & Recovery Control 11',
  'Data backup and recovery policies - Control 11',
  'TG-BKP',
  'Security',
  'Exchange',
  'Medium', 4,
  'Automatic',
  'Graph API',
  'Data backup and recovery policies',
  '/compliance/retentionPolicies/11',
  'isEnabled',
  'true',
  false,
  '["Navigate to Backup & Recovery settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Low',
  'High',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-BKP-012',
  'Backup & Recovery Control 12',
  'Data backup and recovery policies - Control 12',
  'TG-BKP',
  'Security',
  'Exchange',
  'Critical', 10,
  'Automatic',
  'Graph API',
  'Data backup and recovery policies',
  '/compliance/retentionPolicies/12',
  'isEnabled',
  'true',
  true,
  '["Navigate to Backup & Recovery settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Medium',
  'Critical',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-BKP-013',
  'Backup & Recovery Control 13',
  'Data backup and recovery policies - Control 13',
  'TG-BKP',
  'Security',
  'Exchange',
  'High', 7,
  'Automatic',
  'Graph API',
  'Data backup and recovery policies',
  '/compliance/retentionPolicies/13',
  'isEnabled',
  'true',
  true,
  '["Navigate to Backup & Recovery settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Medium',
  'High',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-BKP-014',
  'Backup & Recovery Control 14',
  'Data backup and recovery policies - Control 14',
  'TG-BKP',
  'Security',
  'Exchange',
  'High', 7,
  'Automatic',
  'Graph API',
  'Data backup and recovery policies',
  '/compliance/retentionPolicies/14',
  'isEnabled',
  'true',
  true,
  '["Navigate to Backup & Recovery settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Medium',
  'High',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-BKP-015',
  'Backup & Recovery Control 15',
  'Data backup and recovery policies - Control 15',
  'TG-BKP',
  'Security',
  'Exchange',
  'Critical', 10,
  'Automatic',
  'Graph API',
  'Data backup and recovery policies',
  '/compliance/retentionPolicies/15',
  'isEnabled',
  'true',
  true,
  '["Navigate to Backup & Recovery settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Medium',
  'Critical',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-BKP-016',
  'Backup & Recovery Control 16',
  'Data backup and recovery policies - Control 16',
  'TG-BKP',
  'Security',
  'Exchange',
  'Critical', 10,
  'Automatic',
  'Graph API',
  'Data backup and recovery policies',
  '/compliance/retentionPolicies/16',
  'isEnabled',
  'true',
  true,
  '["Navigate to Backup & Recovery settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Medium',
  'Critical',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-BKP-017',
  'Backup & Recovery Control 17',
  'Data backup and recovery policies - Control 17',
  'TG-BKP',
  'Security',
  'Exchange',
  'Medium', 4,
  'Automatic',
  'Graph API',
  'Data backup and recovery policies',
  '/compliance/retentionPolicies/17',
  'isEnabled',
  'true',
  false,
  '["Navigate to Backup & Recovery settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Low',
  'High',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-BKP-018',
  'Backup & Recovery Control 18',
  'Data backup and recovery policies - Control 18',
  'TG-BKP',
  'Security',
  'Exchange',
  'High', 7,
  'Automatic',
  'Graph API',
  'Data backup and recovery policies',
  '/compliance/retentionPolicies/18',
  'isEnabled',
  'true',
  true,
  '["Navigate to Backup & Recovery settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Medium',
  'High',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-BKP-019',
  'Backup & Recovery Control 19',
  'Data backup and recovery policies - Control 19',
  'TG-BKP',
  'Security',
  'Exchange',
  'High', 7,
  'Automatic',
  'Graph API',
  'Data backup and recovery policies',
  '/compliance/retentionPolicies/19',
  'isEnabled',
  'true',
  true,
  '["Navigate to Backup & Recovery settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Medium',
  'High',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-BKP-020',
  'Backup & Recovery Control 20',
  'Data backup and recovery policies - Control 20',
  'TG-BKP',
  'Security',
  'Exchange',
  'High', 7,
  'Automatic',
  'Graph API',
  'Data backup and recovery policies',
  '/compliance/retentionPolicies/20',
  'isEnabled',
  'true',
  true,
  '["Navigate to Backup & Recovery settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Medium',
  'High',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-COMP-001',
  'Compliance Control 1',
  'Compliance frameworks and policies - Control 1',
  'TG-COMP',
  'Security',
  'Purview',
  'Critical', 10,
  'Automatic',
  'Graph API',
  'Compliance frameworks and policies',
  '/compliance/1',
  'isEnabled',
  'true',
  true,
  '["Navigate to Compliance settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Medium',
  'Critical',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-COMP-002',
  'Compliance Control 2',
  'Compliance frameworks and policies - Control 2',
  'TG-COMP',
  'Security',
  'Purview',
  'High', 7,
  'Automatic',
  'Graph API',
  'Compliance frameworks and policies',
  '/compliance/2',
  'isEnabled',
  'true',
  true,
  '["Navigate to Compliance settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Medium',
  'High',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-COMP-003',
  'Compliance Control 3',
  'Compliance frameworks and policies - Control 3',
  'TG-COMP',
  'Security',
  'Purview',
  'Critical', 10,
  'Automatic',
  'Graph API',
  'Compliance frameworks and policies',
  '/compliance/3',
  'isEnabled',
  'true',
  true,
  '["Navigate to Compliance settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Medium',
  'Critical',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-COMP-004',
  'Compliance Control 4',
  'Compliance frameworks and policies - Control 4',
  'TG-COMP',
  'Security',
  'Purview',
  'Critical', 10,
  'Automatic',
  'Graph API',
  'Compliance frameworks and policies',
  '/compliance/4',
  'isEnabled',
  'true',
  true,
  '["Navigate to Compliance settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Medium',
  'Critical',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-COMP-005',
  'Compliance Control 5',
  'Compliance frameworks and policies - Control 5',
  'TG-COMP',
  'Security',
  'Purview',
  'High', 7,
  'Automatic',
  'Graph API',
  'Compliance frameworks and policies',
  '/compliance/5',
  'isEnabled',
  'true',
  true,
  '["Navigate to Compliance settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Medium',
  'High',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-COMP-006',
  'Compliance Control 6',
  'Compliance frameworks and policies - Control 6',
  'TG-COMP',
  'Security',
  'Purview',
  'Medium', 4,
  'Automatic',
  'Graph API',
  'Compliance frameworks and policies',
  '/compliance/6',
  'isEnabled',
  'true',
  false,
  '["Navigate to Compliance settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Low',
  'High',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-COMP-007',
  'Compliance Control 7',
  'Compliance frameworks and policies - Control 7',
  'TG-COMP',
  'Security',
  'Purview',
  'Critical', 10,
  'Automatic',
  'Graph API',
  'Compliance frameworks and policies',
  '/compliance/7',
  'isEnabled',
  'true',
  true,
  '["Navigate to Compliance settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Medium',
  'Critical',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-COMP-008',
  'Compliance Control 8',
  'Compliance frameworks and policies - Control 8',
  'TG-COMP',
  'Security',
  'Purview',
  'Critical', 10,
  'Automatic',
  'Graph API',
  'Compliance frameworks and policies',
  '/compliance/8',
  'isEnabled',
  'true',
  true,
  '["Navigate to Compliance settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Medium',
  'Critical',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-COMP-009',
  'Compliance Control 9',
  'Compliance frameworks and policies - Control 9',
  'TG-COMP',
  'Security',
  'Purview',
  'Critical', 10,
  'Automatic',
  'Graph API',
  'Compliance frameworks and policies',
  '/compliance/9',
  'isEnabled',
  'true',
  true,
  '["Navigate to Compliance settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Medium',
  'Critical',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-COMP-010',
  'Compliance Control 10',
  'Compliance frameworks and policies - Control 10',
  'TG-COMP',
  'Security',
  'Purview',
  'Medium', 4,
  'Automatic',
  'Graph API',
  'Compliance frameworks and policies',
  '/compliance/10',
  'isEnabled',
  'true',
  false,
  '["Navigate to Compliance settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Low',
  'High',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-COMP-011',
  'Compliance Control 11',
  'Compliance frameworks and policies - Control 11',
  'TG-COMP',
  'Security',
  'Purview',
  'High', 7,
  'Automatic',
  'Graph API',
  'Compliance frameworks and policies',
  '/compliance/11',
  'isEnabled',
  'true',
  true,
  '["Navigate to Compliance settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Medium',
  'High',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-COMP-012',
  'Compliance Control 12',
  'Compliance frameworks and policies - Control 12',
  'TG-COMP',
  'Security',
  'Purview',
  'High', 7,
  'Automatic',
  'Graph API',
  'Compliance frameworks and policies',
  '/compliance/12',
  'isEnabled',
  'true',
  true,
  '["Navigate to Compliance settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Medium',
  'High',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-COMP-013',
  'Compliance Control 13',
  'Compliance frameworks and policies - Control 13',
  'TG-COMP',
  'Security',
  'Purview',
  'Medium', 4,
  'Automatic',
  'Graph API',
  'Compliance frameworks and policies',
  '/compliance/13',
  'isEnabled',
  'true',
  false,
  '["Navigate to Compliance settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Low',
  'High',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-COMP-014',
  'Compliance Control 14',
  'Compliance frameworks and policies - Control 14',
  'TG-COMP',
  'Security',
  'Purview',
  'Medium', 4,
  'Automatic',
  'Graph API',
  'Compliance frameworks and policies',
  '/compliance/14',
  'isEnabled',
  'true',
  false,
  '["Navigate to Compliance settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Low',
  'High',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-COMP-015',
  'Compliance Control 15',
  'Compliance frameworks and policies - Control 15',
  'TG-COMP',
  'Security',
  'Purview',
  'High', 7,
  'Automatic',
  'Graph API',
  'Compliance frameworks and policies',
  '/compliance/15',
  'isEnabled',
  'true',
  true,
  '["Navigate to Compliance settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Medium',
  'High',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-COMP-016',
  'Compliance Control 16',
  'Compliance frameworks and policies - Control 16',
  'TG-COMP',
  'Security',
  'Purview',
  'Critical', 10,
  'Automatic',
  'Graph API',
  'Compliance frameworks and policies',
  '/compliance/16',
  'isEnabled',
  'true',
  true,
  '["Navigate to Compliance settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Medium',
  'Critical',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-COMP-017',
  'Compliance Control 17',
  'Compliance frameworks and policies - Control 17',
  'TG-COMP',
  'Security',
  'Purview',
  'Critical', 10,
  'Automatic',
  'Graph API',
  'Compliance frameworks and policies',
  '/compliance/17',
  'isEnabled',
  'true',
  true,
  '["Navigate to Compliance settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Medium',
  'Critical',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-COMP-018',
  'Compliance Control 18',
  'Compliance frameworks and policies - Control 18',
  'TG-COMP',
  'Security',
  'Purview',
  'Critical', 10,
  'Automatic',
  'Graph API',
  'Compliance frameworks and policies',
  '/compliance/18',
  'isEnabled',
  'true',
  true,
  '["Navigate to Compliance settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Medium',
  'Critical',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-COMP-019',
  'Compliance Control 19',
  'Compliance frameworks and policies - Control 19',
  'TG-COMP',
  'Security',
  'Purview',
  'Critical', 10,
  'Automatic',
  'Graph API',
  'Compliance frameworks and policies',
  '/compliance/19',
  'isEnabled',
  'true',
  true,
  '["Navigate to Compliance settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Medium',
  'Critical',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-COMP-020',
  'Compliance Control 20',
  'Compliance frameworks and policies - Control 20',
  'TG-COMP',
  'Security',
  'Purview',
  'High', 7,
  'Automatic',
  'Graph API',
  'Compliance frameworks and policies',
  '/compliance/20',
  'isEnabled',
  'true',
  true,
  '["Navigate to Compliance settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Medium',
  'High',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-COMP-021',
  'Compliance Control 21',
  'Compliance frameworks and policies - Control 21',
  'TG-COMP',
  'Security',
  'Purview',
  'High', 7,
  'Automatic',
  'Graph API',
  'Compliance frameworks and policies',
  '/compliance/21',
  'isEnabled',
  'true',
  true,
  '["Navigate to Compliance settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Medium',
  'High',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-COMP-022',
  'Compliance Control 22',
  'Compliance frameworks and policies - Control 22',
  'TG-COMP',
  'Security',
  'Purview',
  'High', 7,
  'Automatic',
  'Graph API',
  'Compliance frameworks and policies',
  '/compliance/22',
  'isEnabled',
  'true',
  true,
  '["Navigate to Compliance settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Medium',
  'High',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-COMP-023',
  'Compliance Control 23',
  'Compliance frameworks and policies - Control 23',
  'TG-COMP',
  'Security',
  'Purview',
  'Medium', 4,
  'Automatic',
  'Graph API',
  'Compliance frameworks and policies',
  '/compliance/23',
  'isEnabled',
  'true',
  false,
  '["Navigate to Compliance settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Low',
  'High',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-COMP-024',
  'Compliance Control 24',
  'Compliance frameworks and policies - Control 24',
  'TG-COMP',
  'Security',
  'Purview',
  'Critical', 10,
  'Automatic',
  'Graph API',
  'Compliance frameworks and policies',
  '/compliance/24',
  'isEnabled',
  'true',
  true,
  '["Navigate to Compliance settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Medium',
  'Critical',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-COMP-025',
  'Compliance Control 25',
  'Compliance frameworks and policies - Control 25',
  'TG-COMP',
  'Security',
  'Purview',
  'High', 7,
  'Automatic',
  'Graph API',
  'Compliance frameworks and policies',
  '/compliance/25',
  'isEnabled',
  'true',
  true,
  '["Navigate to Compliance settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Medium',
  'High',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-COMP-026',
  'Compliance Control 26',
  'Compliance frameworks and policies - Control 26',
  'TG-COMP',
  'Security',
  'Purview',
  'Critical', 10,
  'Automatic',
  'Graph API',
  'Compliance frameworks and policies',
  '/compliance/26',
  'isEnabled',
  'true',
  true,
  '["Navigate to Compliance settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Medium',
  'Critical',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-COMP-027',
  'Compliance Control 27',
  'Compliance frameworks and policies - Control 27',
  'TG-COMP',
  'Security',
  'Purview',
  'High', 7,
  'Automatic',
  'Graph API',
  'Compliance frameworks and policies',
  '/compliance/27',
  'isEnabled',
  'true',
  true,
  '["Navigate to Compliance settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Medium',
  'High',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-COMP-028',
  'Compliance Control 28',
  'Compliance frameworks and policies - Control 28',
  'TG-COMP',
  'Security',
  'Purview',
  'High', 7,
  'Automatic',
  'Graph API',
  'Compliance frameworks and policies',
  '/compliance/28',
  'isEnabled',
  'true',
  true,
  '["Navigate to Compliance settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Medium',
  'High',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-COMP-029',
  'Compliance Control 29',
  'Compliance frameworks and policies - Control 29',
  'TG-COMP',
  'Security',
  'Purview',
  'Medium', 4,
  'Automatic',
  'Graph API',
  'Compliance frameworks and policies',
  '/compliance/29',
  'isEnabled',
  'true',
  false,
  '["Navigate to Compliance settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Low',
  'High',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-COMP-030',
  'Compliance Control 30',
  'Compliance frameworks and policies - Control 30',
  'TG-COMP',
  'Security',
  'Purview',
  'Critical', 10,
  'Automatic',
  'Graph API',
  'Compliance frameworks and policies',
  '/compliance/30',
  'isEnabled',
  'true',
  true,
  '["Navigate to Compliance settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Medium',
  'Critical',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-COMP-031',
  'Compliance Control 31',
  'Compliance frameworks and policies - Control 31',
  'TG-COMP',
  'Security',
  'Purview',
  'High', 7,
  'Automatic',
  'Graph API',
  'Compliance frameworks and policies',
  '/compliance/31',
  'isEnabled',
  'true',
  true,
  '["Navigate to Compliance settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Medium',
  'High',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-COMP-032',
  'Compliance Control 32',
  'Compliance frameworks and policies - Control 32',
  'TG-COMP',
  'Security',
  'Purview',
  'High', 7,
  'Automatic',
  'Graph API',
  'Compliance frameworks and policies',
  '/compliance/32',
  'isEnabled',
  'true',
  true,
  '["Navigate to Compliance settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Medium',
  'High',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-COMP-033',
  'Compliance Control 33',
  'Compliance frameworks and policies - Control 33',
  'TG-COMP',
  'Security',
  'Purview',
  'Medium', 4,
  'Automatic',
  'Graph API',
  'Compliance frameworks and policies',
  '/compliance/33',
  'isEnabled',
  'true',
  false,
  '["Navigate to Compliance settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Low',
  'High',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-COMP-034',
  'Compliance Control 34',
  'Compliance frameworks and policies - Control 34',
  'TG-COMP',
  'Security',
  'Purview',
  'Critical', 10,
  'Automatic',
  'Graph API',
  'Compliance frameworks and policies',
  '/compliance/34',
  'isEnabled',
  'true',
  true,
  '["Navigate to Compliance settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Medium',
  'Critical',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-COMP-035',
  'Compliance Control 35',
  'Compliance frameworks and policies - Control 35',
  'TG-COMP',
  'Security',
  'Purview',
  'High', 7,
  'Automatic',
  'Graph API',
  'Compliance frameworks and policies',
  '/compliance/35',
  'isEnabled',
  'true',
  true,
  '["Navigate to Compliance settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Medium',
  'High',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-COMP-036',
  'Compliance Control 36',
  'Compliance frameworks and policies - Control 36',
  'TG-COMP',
  'Security',
  'Purview',
  'Critical', 10,
  'Automatic',
  'Graph API',
  'Compliance frameworks and policies',
  '/compliance/36',
  'isEnabled',
  'true',
  true,
  '["Navigate to Compliance settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Medium',
  'Critical',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-COMP-037',
  'Compliance Control 37',
  'Compliance frameworks and policies - Control 37',
  'TG-COMP',
  'Security',
  'Purview',
  'High', 7,
  'Automatic',
  'Graph API',
  'Compliance frameworks and policies',
  '/compliance/37',
  'isEnabled',
  'true',
  true,
  '["Navigate to Compliance settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Medium',
  'High',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-COMP-038',
  'Compliance Control 38',
  'Compliance frameworks and policies - Control 38',
  'TG-COMP',
  'Security',
  'Purview',
  'Medium', 4,
  'Automatic',
  'Graph API',
  'Compliance frameworks and policies',
  '/compliance/38',
  'isEnabled',
  'true',
  false,
  '["Navigate to Compliance settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Low',
  'High',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-COMP-039',
  'Compliance Control 39',
  'Compliance frameworks and policies - Control 39',
  'TG-COMP',
  'Security',
  'Purview',
  'Medium', 4,
  'Automatic',
  'Graph API',
  'Compliance frameworks and policies',
  '/compliance/39',
  'isEnabled',
  'true',
  false,
  '["Navigate to Compliance settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Low',
  'High',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-COMP-040',
  'Compliance Control 40',
  'Compliance frameworks and policies - Control 40',
  'TG-COMP',
  'Security',
  'Purview',
  'High', 7,
  'Automatic',
  'Graph API',
  'Compliance frameworks and policies',
  '/compliance/40',
  'isEnabled',
  'true',
  true,
  '["Navigate to Compliance settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Medium',
  'High',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-COMP-041',
  'Compliance Control 41',
  'Compliance frameworks and policies - Control 41',
  'TG-COMP',
  'Security',
  'Purview',
  'Medium', 4,
  'Automatic',
  'Graph API',
  'Compliance frameworks and policies',
  '/compliance/41',
  'isEnabled',
  'true',
  false,
  '["Navigate to Compliance settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Low',
  'High',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-COMP-042',
  'Compliance Control 42',
  'Compliance frameworks and policies - Control 42',
  'TG-COMP',
  'Security',
  'Purview',
  'High', 7,
  'Automatic',
  'Graph API',
  'Compliance frameworks and policies',
  '/compliance/42',
  'isEnabled',
  'true',
  true,
  '["Navigate to Compliance settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Medium',
  'High',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-COMP-043',
  'Compliance Control 43',
  'Compliance frameworks and policies - Control 43',
  'TG-COMP',
  'Security',
  'Purview',
  'Critical', 10,
  'Automatic',
  'Graph API',
  'Compliance frameworks and policies',
  '/compliance/43',
  'isEnabled',
  'true',
  true,
  '["Navigate to Compliance settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Medium',
  'Critical',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-COMP-044',
  'Compliance Control 44',
  'Compliance frameworks and policies - Control 44',
  'TG-COMP',
  'Security',
  'Purview',
  'Critical', 10,
  'Automatic',
  'Graph API',
  'Compliance frameworks and policies',
  '/compliance/44',
  'isEnabled',
  'true',
  true,
  '["Navigate to Compliance settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Medium',
  'Critical',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-COMP-045',
  'Compliance Control 45',
  'Compliance frameworks and policies - Control 45',
  'TG-COMP',
  'Security',
  'Purview',
  'Critical', 10,
  'Automatic',
  'Graph API',
  'Compliance frameworks and policies',
  '/compliance/45',
  'isEnabled',
  'true',
  true,
  '["Navigate to Compliance settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Medium',
  'Critical',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-COMP-046',
  'Compliance Control 46',
  'Compliance frameworks and policies - Control 46',
  'TG-COMP',
  'Security',
  'Purview',
  'High', 7,
  'Automatic',
  'Graph API',
  'Compliance frameworks and policies',
  '/compliance/46',
  'isEnabled',
  'true',
  true,
  '["Navigate to Compliance settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Medium',
  'High',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-COMP-047',
  'Compliance Control 47',
  'Compliance frameworks and policies - Control 47',
  'TG-COMP',
  'Security',
  'Purview',
  'Medium', 4,
  'Automatic',
  'Graph API',
  'Compliance frameworks and policies',
  '/compliance/47',
  'isEnabled',
  'true',
  false,
  '["Navigate to Compliance settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Low',
  'High',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-COMP-048',
  'Compliance Control 48',
  'Compliance frameworks and policies - Control 48',
  'TG-COMP',
  'Security',
  'Purview',
  'High', 7,
  'Automatic',
  'Graph API',
  'Compliance frameworks and policies',
  '/compliance/48',
  'isEnabled',
  'true',
  true,
  '["Navigate to Compliance settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Medium',
  'High',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-COMP-049',
  'Compliance Control 49',
  'Compliance frameworks and policies - Control 49',
  'TG-COMP',
  'Security',
  'Purview',
  'High', 7,
  'Automatic',
  'Graph API',
  'Compliance frameworks and policies',
  '/compliance/49',
  'isEnabled',
  'true',
  true,
  '["Navigate to Compliance settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Medium',
  'High',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-COMP-050',
  'Compliance Control 50',
  'Compliance frameworks and policies - Control 50',
  'TG-COMP',
  'Security',
  'Purview',
  'High', 7,
  'Automatic',
  'Graph API',
  'Compliance frameworks and policies',
  '/compliance/50',
  'isEnabled',
  'true',
  true,
  '["Navigate to Compliance settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Medium',
  'High',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-AI-001',
  'AI & Copilot Security Control 1',
  'AI governance and Copilot security - Control 1',
  'TG-AI',
  'Security',
  'Teams',
  'High', 7,
  'Automatic',
  'Graph API',
  'AI governance and Copilot security',
  '/teamwork/microsoft/copilot/1',
  'isEnabled',
  'true',
  true,
  '["Navigate to AI & Copilot Security settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Medium',
  'High',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-AI-002',
  'AI & Copilot Security Control 2',
  'AI governance and Copilot security - Control 2',
  'TG-AI',
  'Security',
  'Teams',
  'Medium', 4,
  'Automatic',
  'Graph API',
  'AI governance and Copilot security',
  '/teamwork/microsoft/copilot/2',
  'isEnabled',
  'true',
  false,
  '["Navigate to AI & Copilot Security settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Low',
  'High',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-AI-003',
  'AI & Copilot Security Control 3',
  'AI governance and Copilot security - Control 3',
  'TG-AI',
  'Security',
  'Teams',
  'Critical', 10,
  'Automatic',
  'Graph API',
  'AI governance and Copilot security',
  '/teamwork/microsoft/copilot/3',
  'isEnabled',
  'true',
  true,
  '["Navigate to AI & Copilot Security settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Medium',
  'Critical',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-AI-004',
  'AI & Copilot Security Control 4',
  'AI governance and Copilot security - Control 4',
  'TG-AI',
  'Security',
  'Teams',
  'High', 7,
  'Automatic',
  'Graph API',
  'AI governance and Copilot security',
  '/teamwork/microsoft/copilot/4',
  'isEnabled',
  'true',
  true,
  '["Navigate to AI & Copilot Security settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Medium',
  'High',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-AI-005',
  'AI & Copilot Security Control 5',
  'AI governance and Copilot security - Control 5',
  'TG-AI',
  'Security',
  'Teams',
  'Critical', 10,
  'Automatic',
  'Graph API',
  'AI governance and Copilot security',
  '/teamwork/microsoft/copilot/5',
  'isEnabled',
  'true',
  true,
  '["Navigate to AI & Copilot Security settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Medium',
  'Critical',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-AI-006',
  'AI & Copilot Security Control 6',
  'AI governance and Copilot security - Control 6',
  'TG-AI',
  'Security',
  'Teams',
  'High', 7,
  'Automatic',
  'Graph API',
  'AI governance and Copilot security',
  '/teamwork/microsoft/copilot/6',
  'isEnabled',
  'true',
  true,
  '["Navigate to AI & Copilot Security settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Medium',
  'High',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-AI-007',
  'AI & Copilot Security Control 7',
  'AI governance and Copilot security - Control 7',
  'TG-AI',
  'Security',
  'Teams',
  'Medium', 4,
  'Automatic',
  'Graph API',
  'AI governance and Copilot security',
  '/teamwork/microsoft/copilot/7',
  'isEnabled',
  'true',
  false,
  '["Navigate to AI & Copilot Security settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Low',
  'High',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-AI-008',
  'AI & Copilot Security Control 8',
  'AI governance and Copilot security - Control 8',
  'TG-AI',
  'Security',
  'Teams',
  'Critical', 10,
  'Automatic',
  'Graph API',
  'AI governance and Copilot security',
  '/teamwork/microsoft/copilot/8',
  'isEnabled',
  'true',
  true,
  '["Navigate to AI & Copilot Security settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Medium',
  'Critical',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-AI-009',
  'AI & Copilot Security Control 9',
  'AI governance and Copilot security - Control 9',
  'TG-AI',
  'Security',
  'Teams',
  'Critical', 10,
  'Automatic',
  'Graph API',
  'AI governance and Copilot security',
  '/teamwork/microsoft/copilot/9',
  'isEnabled',
  'true',
  true,
  '["Navigate to AI & Copilot Security settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Medium',
  'Critical',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-AI-010',
  'AI & Copilot Security Control 10',
  'AI governance and Copilot security - Control 10',
  'TG-AI',
  'Security',
  'Teams',
  'High', 7,
  'Automatic',
  'Graph API',
  'AI governance and Copilot security',
  '/teamwork/microsoft/copilot/10',
  'isEnabled',
  'true',
  true,
  '["Navigate to AI & Copilot Security settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Medium',
  'High',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-AI-011',
  'AI & Copilot Security Control 11',
  'AI governance and Copilot security - Control 11',
  'TG-AI',
  'Security',
  'Teams',
  'Critical', 10,
  'Automatic',
  'Graph API',
  'AI governance and Copilot security',
  '/teamwork/microsoft/copilot/11',
  'isEnabled',
  'true',
  true,
  '["Navigate to AI & Copilot Security settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Medium',
  'Critical',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-AI-012',
  'AI & Copilot Security Control 12',
  'AI governance and Copilot security - Control 12',
  'TG-AI',
  'Security',
  'Teams',
  'Medium', 4,
  'Automatic',
  'Graph API',
  'AI governance and Copilot security',
  '/teamwork/microsoft/copilot/12',
  'isEnabled',
  'true',
  false,
  '["Navigate to AI & Copilot Security settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Low',
  'High',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-AI-013',
  'AI & Copilot Security Control 13',
  'AI governance and Copilot security - Control 13',
  'TG-AI',
  'Security',
  'Teams',
  'High', 7,
  'Automatic',
  'Graph API',
  'AI governance and Copilot security',
  '/teamwork/microsoft/copilot/13',
  'isEnabled',
  'true',
  true,
  '["Navigate to AI & Copilot Security settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Medium',
  'High',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-AI-014',
  'AI & Copilot Security Control 14',
  'AI governance and Copilot security - Control 14',
  'TG-AI',
  'Security',
  'Teams',
  'Medium', 4,
  'Automatic',
  'Graph API',
  'AI governance and Copilot security',
  '/teamwork/microsoft/copilot/14',
  'isEnabled',
  'true',
  false,
  '["Navigate to AI & Copilot Security settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Low',
  'High',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-AI-015',
  'AI & Copilot Security Control 15',
  'AI governance and Copilot security - Control 15',
  'TG-AI',
  'Security',
  'Teams',
  'Medium', 4,
  'Automatic',
  'Graph API',
  'AI governance and Copilot security',
  '/teamwork/microsoft/copilot/15',
  'isEnabled',
  'true',
  false,
  '["Navigate to AI & Copilot Security settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Low',
  'High',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-AI-016',
  'AI & Copilot Security Control 16',
  'AI governance and Copilot security - Control 16',
  'TG-AI',
  'Security',
  'Teams',
  'Critical', 10,
  'Automatic',
  'Graph API',
  'AI governance and Copilot security',
  '/teamwork/microsoft/copilot/16',
  'isEnabled',
  'true',
  true,
  '["Navigate to AI & Copilot Security settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Medium',
  'Critical',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-AI-017',
  'AI & Copilot Security Control 17',
  'AI governance and Copilot security - Control 17',
  'TG-AI',
  'Security',
  'Teams',
  'Medium', 4,
  'Automatic',
  'Graph API',
  'AI governance and Copilot security',
  '/teamwork/microsoft/copilot/17',
  'isEnabled',
  'true',
  false,
  '["Navigate to AI & Copilot Security settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Low',
  'High',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-AI-018',
  'AI & Copilot Security Control 18',
  'AI governance and Copilot security - Control 18',
  'TG-AI',
  'Security',
  'Teams',
  'Critical', 10,
  'Automatic',
  'Graph API',
  'AI governance and Copilot security',
  '/teamwork/microsoft/copilot/18',
  'isEnabled',
  'true',
  true,
  '["Navigate to AI & Copilot Security settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Medium',
  'Critical',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-AI-019',
  'AI & Copilot Security Control 19',
  'AI governance and Copilot security - Control 19',
  'TG-AI',
  'Security',
  'Teams',
  'High', 7,
  'Automatic',
  'Graph API',
  'AI governance and Copilot security',
  '/teamwork/microsoft/copilot/19',
  'isEnabled',
  'true',
  true,
  '["Navigate to AI & Copilot Security settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Medium',
  'High',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-AI-020',
  'AI & Copilot Security Control 20',
  'AI governance and Copilot security - Control 20',
  'TG-AI',
  'Security',
  'Teams',
  'Medium', 4,
  'Automatic',
  'Graph API',
  'AI governance and Copilot security',
  '/teamwork/microsoft/copilot/20',
  'isEnabled',
  'true',
  false,
  '["Navigate to AI & Copilot Security settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Low',
  'High',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-AI-021',
  'AI & Copilot Security Control 21',
  'AI governance and Copilot security - Control 21',
  'TG-AI',
  'Security',
  'Teams',
  'Medium', 4,
  'Automatic',
  'Graph API',
  'AI governance and Copilot security',
  '/teamwork/microsoft/copilot/21',
  'isEnabled',
  'true',
  false,
  '["Navigate to AI & Copilot Security settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Low',
  'High',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-AI-022',
  'AI & Copilot Security Control 22',
  'AI governance and Copilot security - Control 22',
  'TG-AI',
  'Security',
  'Teams',
  'High', 7,
  'Automatic',
  'Graph API',
  'AI governance and Copilot security',
  '/teamwork/microsoft/copilot/22',
  'isEnabled',
  'true',
  true,
  '["Navigate to AI & Copilot Security settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Medium',
  'High',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-AI-023',
  'AI & Copilot Security Control 23',
  'AI governance and Copilot security - Control 23',
  'TG-AI',
  'Security',
  'Teams',
  'Critical', 10,
  'Automatic',
  'Graph API',
  'AI governance and Copilot security',
  '/teamwork/microsoft/copilot/23',
  'isEnabled',
  'true',
  true,
  '["Navigate to AI & Copilot Security settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Medium',
  'Critical',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-AI-024',
  'AI & Copilot Security Control 24',
  'AI governance and Copilot security - Control 24',
  'TG-AI',
  'Security',
  'Teams',
  'Critical', 10,
  'Automatic',
  'Graph API',
  'AI governance and Copilot security',
  '/teamwork/microsoft/copilot/24',
  'isEnabled',
  'true',
  true,
  '["Navigate to AI & Copilot Security settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Medium',
  'Critical',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-AI-025',
  'AI & Copilot Security Control 25',
  'AI governance and Copilot security - Control 25',
  'TG-AI',
  'Security',
  'Teams',
  'High', 7,
  'Automatic',
  'Graph API',
  'AI governance and Copilot security',
  '/teamwork/microsoft/copilot/25',
  'isEnabled',
  'true',
  true,
  '["Navigate to AI & Copilot Security settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Medium',
  'High',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-AI-026',
  'AI & Copilot Security Control 26',
  'AI governance and Copilot security - Control 26',
  'TG-AI',
  'Security',
  'Teams',
  'Medium', 4,
  'Automatic',
  'Graph API',
  'AI governance and Copilot security',
  '/teamwork/microsoft/copilot/26',
  'isEnabled',
  'true',
  false,
  '["Navigate to AI & Copilot Security settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Low',
  'High',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-AI-027',
  'AI & Copilot Security Control 27',
  'AI governance and Copilot security - Control 27',
  'TG-AI',
  'Security',
  'Teams',
  'Critical', 10,
  'Automatic',
  'Graph API',
  'AI governance and Copilot security',
  '/teamwork/microsoft/copilot/27',
  'isEnabled',
  'true',
  true,
  '["Navigate to AI & Copilot Security settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Medium',
  'Critical',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-AI-028',
  'AI & Copilot Security Control 28',
  'AI governance and Copilot security - Control 28',
  'TG-AI',
  'Security',
  'Teams',
  'Critical', 10,
  'Automatic',
  'Graph API',
  'AI governance and Copilot security',
  '/teamwork/microsoft/copilot/28',
  'isEnabled',
  'true',
  true,
  '["Navigate to AI & Copilot Security settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Medium',
  'Critical',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-AI-029',
  'AI & Copilot Security Control 29',
  'AI governance and Copilot security - Control 29',
  'TG-AI',
  'Security',
  'Teams',
  'High', 7,
  'Automatic',
  'Graph API',
  'AI governance and Copilot security',
  '/teamwork/microsoft/copilot/29',
  'isEnabled',
  'true',
  true,
  '["Navigate to AI & Copilot Security settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Medium',
  'High',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-AI-030',
  'AI & Copilot Security Control 30',
  'AI governance and Copilot security - Control 30',
  'TG-AI',
  'Security',
  'Teams',
  'Critical', 10,
  'Automatic',
  'Graph API',
  'AI governance and Copilot security',
  '/teamwork/microsoft/copilot/30',
  'isEnabled',
  'true',
  true,
  '["Navigate to AI & Copilot Security settings","Enable the required control","Configure appropriate policies","Verify across all users/resources"]',
  'Medium',
  'Critical',
  true,
  'Entra ID P1',
  'T1078',
  'CAPEC-114'
);

