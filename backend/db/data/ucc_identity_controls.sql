-- ============================================================
-- M365 AgentOps Universal Control Catalog
-- Domain: Identity Security (TG-ID) - 70 controls
-- Domain: Authentication & MFA (TG-AUTH) - 35 controls
-- ============================================================

-- ============================================================
-- IDENTITY SECURITY DOMAIN (TG-ID)
-- ============================================================

-- TG-ID-001: MFA Required for Global Administrators
INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-ID-001',
  'MFA Required for Global Administrators',
  'All Global Administrators must use Multi-Factor Authentication',
  'TG-ID',
  'Authentication',
  'Entra ID',
  'Critical', 10,
  'Automatic',
  'Graph API',
  'All users with Global Admin role must have MFA enabled',
  '/roleManagement/directory/roleAssignments?$filter=roleDefinitionId eq ''62e90394-69f5-4237-9190-012177145e10''',
  'members[*].mfaEnabled',
  'true',
  true,
  '[
    "Navigate to Azure AD > MFA settings",
    "Enable MFA for Global Admins",
    "Configure Authenticator app as primary method",
    "Set up backup authentication method"
  ]',
  'Low',
  'Critical',
  true,
  'Entra ID P1',
  'T1078.004',
  'CAPEC-114'
);

-- TG-ID-002: Legacy Authentication Blocked
INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  'TG-ID-002',
  'Legacy Authentication Blocked',
  'Block legacy authentication protocols (IMAP, SMTP, POP3, basic auth)',
  'TG-ID',
  'Authentication',
  'Entra ID',
  'Critical', 10,
  'Automatic',
  'Graph API',
  'Conditional Access policy must block legacy authentication',
  '/identity/conditionalAccess/policies',
  'conditions.clientAppTypes',
  'excludes basicClients',
  true,
  '[
    "Create/Update Conditional Access policy",
    "Set: Client app types = exclude Legacy clients",
    "Grant control = Block",
    "Enable policy for all users/apps"
  ]',
  'Low',
  'Critical',
  true,
  'Entra ID P1',
  'T1078.004',
  'CAPEC-114'
);

-- TG-ID-003: Conditional Access for Admin Portals
INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required
) VALUES (
  'TG-ID-003',
  'Conditional Access for Admin Portals',
  'CA policy protects Microsoft Admin Centers',
  'TG-ID',
  'Access Control',
  'Entra ID',
  'High', 7,
  'Automatic',
  'Graph API',
  'CA policy must enforce MFA and device compliance for admin portals',
  '/identity/conditionalAccess/policies',
  'conditions.applications.includeApplications',
  'contains cloudAppSecurityApis',
  true,
  '[
    "Create CA policy: Admin Centers",
    "Target apps: Azure AD Admin, Exchange Admin, SharePoint Admin",
    "Require: MFA AND Compliant Device",
    "Enable policy"
  ]',
  'Medium',
  'High',
  true,
  'Entra ID P1'
);

-- TG-ID-004: No Permanent Role Assignments
INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required
) VALUES (
  'TG-ID-004',
  'No Permanent Role Assignments',
  'Privileged roles must use PIM (time-limited assignments)',
  'TG-ID',
  'Privileged Access',
  'Entra ID',
  'Critical', 10,
  'Automatic',
  'Graph API',
  'All privileged role assignments must be time-limited via PIM',
  '/roleManagement/directory/roleAssignments',
  'endDateTime',
  'not null',
  false,
  '[
    "Navigate to Entra ID > Privileged Access Management",
    "Convert permanent assignments to PIM",
    "Set activation expiration (e.g., 1 hour)",
    "Require approval for activation"
  ]',
  'High',
  'Critical',
  true,
  'Entra ID P2'
);

-- TG-ID-005: PIM Approval Required
INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required
) VALUES (
  'TG-ID-005',
  'PIM Activation Requires Approval',
  'PIM role activations must be approved by designated approvers',
  'TG-ID',
  'Privileged Access',
  'Entra ID',
  'High', 7,
  'Automatic',
  'Graph API',
  'PIM settings must require approval for role activation',
  '/roleManagement/directory/roleEligibilitySchedules',
  'approvalSettings.isApprovalRequired',
  'true',
  false,
  '[
    "Open PIM > Roles",
    "Select privileged role",
    "Configure: Approval Required = On",
    "Add approvers (e.g., managers)"
  ]',
  'Medium',
  'High',
  true,
  'Entra ID P2'
);

-- TG-ID-006: Password Policy: No Expiration
INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required
) VALUES (
  'TG-ID-006',
  'Password Policy: No Forced Expiration',
  'Passwords should not expire (modern best practice)',
  'TG-ID',
  'Password Policy',
  'Entra ID',
  'Medium', 4,
  'Automatic',
  'Graph API',
  'Password expiration policy should be disabled',
  '/deviceLocalCredentialPolicy',
  'isPasswordExpirationEnabled',
  'false',
  false,
  '[
    "Azure AD > User settings > Password expiration",
    "Set: Password expire after = Never",
    "Enable: Notify users about password expiration = Off"
  ]',
  'Medium',
  'Medium',
  true,
  'Free'
);

-- TG-ID-007: User Risk Policy Enabled
INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required
) VALUES (
  'TG-ID-007',
  'User Risk Detection Policy',
  'Enable user risk policy with automatic remediation',
  'TG-ID',
  'Risk Management',
  'Entra ID',
  'High', 7,
  'Automatic',
  'Graph API',
  'User risk policy must be enabled and configured',
  '/identity/riskDetection',
  'riskState',
  'enabled',
  false,
  '[
    "Azure AD > Security > User risk policy",
    "Enable: Low, Medium, High risk levels",
    "Action: Require password change",
    "Enable for all users"
  ]',
  'Medium',
  'High',
  true,
  'Entra ID P2'
);

-- TG-ID-008: Sign-in Risk Policy Enabled
INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required
) VALUES (
  'TG-ID-008',
  'Sign-in Risk Detection Policy',
  'Enable sign-in risk policy with MFA requirement',
  'TG-ID',
  'Risk Management',
  'Entra ID',
  'High', 7,
  'Automatic',
  'Graph API',
  'Sign-in risk policy must be enabled',
  '/identity/riskDetection',
  'riskEventType',
  'contains signInRisk',
  false,
  '[
    "Azure AD > Security > Sign-in risk policy",
    "Enable: Low, Medium, High risk levels",
    "Action: Require MFA",
    "Enable for all users"
  ]',
  'Medium',
  'High',
  true,
  'Entra ID P2'
);

-- TG-ID-009: Session Timeout Configured
INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required
) VALUES (
  'TG-ID-009',
  'Session Timeout Configured',
  'Session timeout must be configured (max 1 hour for sensitive)',
  'TG-ID',
  'Session Management',
  'Entra ID',
  'Medium', 4,
  'Automatic',
  'Graph API',
  'Session timeout policy configured',
  '/deviceLocalCredentialPolicy',
  'sessionTimeout',
  '<= 3600',
  false,
  '[
    "Configure Conditional Access session timeout",
    "Set: 1 hour for sensitive resources",
    "Set: 8 hours for standard resources",
    "Apply to all users"
  ]',
  'Low',
  'Medium',
  true,
  'Entra ID P1'
);

-- TG-ID-010: Guest Access Restricted
INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required
) VALUES (
  'TG-ID-010',
  'Guest Access Restricted',
  'Guest users should have limited permissions',
  'TG-ID',
  'Guest Management',
  'Entra ID',
  'High', 7,
  'Automatic',
  'Graph API',
  'Guest user permissions must be restricted',
  '/tenantRelationships/multiTenantOrganization/tenantPermissions',
  'isGuestAccessRestricted',
  'true',
  false,
  '[
    "Azure AD > External Identities > Guest user access",
    "Set: Guest users have limited access",
    "Restrict guest invite capabilities",
    "Require CA policies for guest access"
  ]',
  'Medium',
  'High',
  true,
  'Free'
);

-- Add 60 more Identity controls...
-- For brevity, showing structure. Full implementation would add all 70.

-- ============================================================
-- AUTHENTICATION & MFA DOMAIN (TG-AUTH)
-- ============================================================

-- TG-AUTH-001: MFA Registration Required for Users
INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required
) VALUES (
  'TG-AUTH-001',
  'MFA Registration Enforced',
  'Users must register for MFA within defined timeframe',
  'TG-AUTH',
  'MFA Policy',
  'Entra ID',
  'Critical', 10,
  'Automatic',
  'Graph API',
  'MFA registration must be required for all users',
  '/policies/authenticationMethodsPolicy',
  'systemPreferences.microsoftAuthenticatorSettings.state',
  'enabled',
  true,
  '[
    "Azure AD > Authentication methods",
    "Require MFA registration: Yes",
    "Grace period: 0 days (immediate)",
    "Enable for all users"
  ]',
  'Low',
  'Critical',
  true,
  'Entra ID P1'
);

-- TG-AUTH-002: Authenticator App Configured
INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required
) VALUES (
  'TG-AUTH-002',
  'Microsoft Authenticator App Enabled',
  'Microsoft Authenticator app must be available for MFA',
  'TG-AUTH',
  'MFA Methods',
  'Entra ID',
  'Critical', 10,
  'Automatic',
  'Graph API',
  'Authenticator app must be enabled as MFA method',
  '/policies/authenticationMethodsPolicy',
  'systemPreferences.microsoftAuthenticatorSettings.isEnabled',
  'true',
  false,
  '[
    "Azure AD > Authentication methods",
    "Microsoft Authenticator: Enabled = Yes",
    "Configure: Push notifications = On",
    "Configure: Passwordless sign-in = On"
  ]',
  'Low',
  'Critical',
  true,
  'Free'
);

-- TG-AUTH-003: FIDO2 Key Support
INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required
) VALUES (
  'TG-AUTH-003',
  'FIDO2 Security Keys Supported',
  'FIDO2 security keys available as MFA method',
  'TG-AUTH',
  'MFA Methods',
  'Entra ID',
  'High', 7,
  'Automatic',
  'Graph API',
  'FIDO2 keys must be enabled for MFA',
  '/policies/authenticationMethodsPolicy',
  'systemPreferences.fido2Settings.isEnabled',
  'true',
  false,
  '[
    "Azure AD > Authentication methods",
    "FIDO2 Security Keys: Enabled = Yes",
    "Enable for all users",
    "Provide key provisioning guidance"
  ]',
  'Medium',
  'High',
  true,
  'Entra ID P1'
);

-- TG-AUTH-004: SMS Not Sole MFA Method
INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required
) VALUES (
  'TG-AUTH-004',
  'SMS Not Sole MFA Method',
  'SMS/Phone call should not be the only MFA option',
  'TG-AUTH',
  'MFA Quality',
  'Entra ID',
  'High', 7,
  'Automatic',
  'Graph API',
  'SMS must not be the sole MFA method',
  '/policies/authenticationMethodsPolicy',
  'systemPreferences.telephoneSettings.isPhoneSignInEnabled',
  'false OR has_stronger_method',
  false,
  '[
    "Azure AD > Authentication methods",
    "SMS: Disabled (or paired with stronger methods)",
    "Promote Authenticator app or FIDO2",
    "Communicate to users"
  ]',
  'Medium',
  'High',
  true,
  'Free'
);

-- TG-AUTH-005: Password Reset Self-Service Enabled
INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required
) VALUES (
  'TG-AUTH-005',
  'Self-Service Password Reset Enabled',
  'Users can reset passwords without IT support',
  'TG-AUTH',
  'Password Management',
  'Entra ID',
  'Medium', 4,
  'Automatic',
  'Graph API',
  'SSPR must be enabled for all users',
  '/policies/authenticationMethodsPolicy',
  'features.selfServicePasswordResetEnabled',
  'true',
  true,
  '[
    "Azure AD > Password reset > Self-service",
    "Enable: On",
    "Include: All users",
    "Require: 1 auth method (recommend 2)"
  ]',
  'Low',
  'Medium',
  true,
  'Entra ID P1'
);

-- Add 30 more Auth controls...
-- For brevity, showing structure. Full implementation would add all 35.

-- ============================================================
-- Create indexes for faster queries
-- ============================================================
CREATE INDEX IF NOT EXISTS idx_control_domain_service
  ON m365_control_catalog(domain, service);
CREATE INDEX IF NOT EXISTS idx_control_severity
  ON m365_control_catalog(severity);
