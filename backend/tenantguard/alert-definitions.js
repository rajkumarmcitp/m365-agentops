/**
 * TenantGuard Alert Definitions
 * Comprehensive P1 (Critical) and P2 (High) alert taxonomy with risk scoring
 */

export const ALERT_PRIORITY = {
  P1: 'CRITICAL',
  P2: 'HIGH',
  P3: 'MEDIUM',
  P4: 'LOW'
}

export const ALERT_CATEGORIES = {
  IDENTITY_ACCESS: 'Identity & Access',
  APP_SECURITY: 'Application Security',
  EXCHANGE_SECURITY: 'Exchange Online',
  SHAREPOINT_SECURITY: 'SharePoint & OneDrive',
  TEAMS_SECURITY: 'Teams Security',
  DEVICE_INTUNE: 'Device & Intune',
  DLP_COMPLIANCE: 'DLP & Compliance',
  DEFENDER_SECURITY: 'Defender Security',
  SERVICE_HEALTH: 'Service Health',
  CONFIG_DRIFT: 'Configuration Drift'
}

/**
 * P1 CRITICAL ALERTS (Immediate Action Required)
 * 18 total alert types
 */
export const P1_ALERTS = {
  // Identity & Access (5)
  GLOBAL_ADMIN_ADDED: {
    id: 'P1_001',
    name: 'Global Administrator Added/Modified',
    category: ALERT_CATEGORIES.IDENTITY_ACCESS,
    priority: 'P1',
    severity: 'CRITICAL',
    riskScore: 95,
    description: 'Global Administrator role was added or modified for a user',
    indicators: ['global administrator', 'global admin', 'tenant admin'],
    remediation: [
      'Verify user identity and access legitimacy',
      'Confirm with requestor if change was authorized',
      'Remove role immediately if unauthorized',
      'Audit recent activities by this user',
      'Implement Conditional Access policy to restrict admin access'
    ],
    powerShellScript: `
      # Remove Global Admin role
      Remove-MgDirectoryRoleMember -DirectoryRoleId $roleId -MemberId $userId

      # Audit recent activities
      Get-MgAuditLogDirectoryAudit -Filter "initiatedBy/user/id eq '$userId'" | Select-Object -First 50
    `,
    dataSource: 'Entra ID Audit',
    impactLevel: 'VERY HIGH',
    timeToFix: '15 minutes'
  },

  PRIVILEGED_ROLE_ADMIN_ADDED: {
    id: 'P1_002',
    name: 'Privileged Role Administrator Added',
    category: ALERT_CATEGORIES.IDENTITY_ACCESS,
    priority: 'P1',
    severity: 'CRITICAL',
    riskScore: 93,
    description: 'Privileged Role Administrator role assigned - can manage all privileged roles',
    indicators: ['privileged role administrator', 'pra'],
    remediation: [
      'Verify legitimacy of assignment',
      'Review all roles this user can now manage',
      'Restrict to JIT (Just-In-Time) access via PIM',
      'Audit all role assignments made by this user',
      'Implement MFA and Conditional Access'
    ],
    dataSource: 'Entra ID',
    impactLevel: 'VERY HIGH',
    timeToFix: '15 minutes'
  },

  EXCHANGE_ADMIN_ADDED: {
    id: 'P1_003',
    name: 'Exchange Administrator Added',
    category: ALERT_CATEGORIES.EXCHANGE_SECURITY,
    priority: 'P1',
    severity: 'CRITICAL',
    riskScore: 92,
    description: 'Exchange Administrator role was assigned - full control of mail',
    indicators: ['exchange admin', 'exchange administrator', 'eac admin'],
    remediation: [
      'Verify user credentials and authorization',
      'Review mailbox permissions granted',
      'Check for unauthorized forwarding rules',
      'Audit mailbox access and modifications',
      'Remove if unauthorized'
    ],
    dataSource: 'Exchange Online',
    impactLevel: 'VERY HIGH',
    timeToFix: '15 minutes'
  },

  SHAREPOINT_ADMIN_ADDED: {
    id: 'P1_004',
    name: 'SharePoint Administrator Added',
    category: ALERT_CATEGORIES.SHAREPOINT_SECURITY,
    priority: 'P1',
    severity: 'CRITICAL',
    riskScore: 91,
    description: 'SharePoint Administrator role assigned - full site access control',
    indicators: ['sharepoint admin', 'sharepoint administrator'],
    remediation: [
      'Verify authorization',
      'Review all sites accessed',
      'Check for unauthorized sharing changes',
      'Audit file access and modifications',
      'Enforce read-only access if suspicious'
    ],
    dataSource: 'SharePoint',
    impactLevel: 'VERY HIGH',
    timeToFix: '15 minutes'
  },

  MFA_DISABLED_ADMIN: {
    id: 'P1_005',
    name: 'MFA Disabled for Administrator',
    category: ALERT_CATEGORIES.IDENTITY_ACCESS,
    priority: 'P1',
    severity: 'CRITICAL',
    riskScore: 94,
    description: 'Multi-factor authentication was disabled for privileged account',
    indicators: ['mfa disabled', 'multifactor authentication disabled', 'mfa removed'],
    remediation: [
      'Immediately re-enable MFA for all admins',
      'Review who disabled MFA and why',
      'Check for unauthorized sign-ins',
      'Force password reset',
      'Implement policy to require MFA for privileged accounts'
    ],
    dataSource: 'Entra ID',
    impactLevel: 'VERY HIGH',
    timeToFix: '10 minutes'
  },

  // Conditional Access & Security (4)
  CONDITIONAL_ACCESS_DISABLED: {
    id: 'P1_006',
    name: 'Conditional Access Policy Disabled',
    category: ALERT_CATEGORIES.IDENTITY_ACCESS,
    priority: 'P1',
    severity: 'CRITICAL',
    riskScore: 92,
    description: 'Conditional Access policy was disabled or deleted',
    indicators: ['conditional access', 'ca policy disabled', 'ca policy deleted'],
    remediation: [
      'Re-enable disabled policy immediately',
      'Verify why policy was disabled',
      'Review sign-in activities since disable time',
      'Check for suspicious user access',
      'Implement policy change approvals'
    ],
    dataSource: 'Entra ID',
    impactLevel: 'VERY HIGH',
    timeToFix: '10 minutes'
  },

  SECURITY_DEFAULTS_DISABLED: {
    id: 'P1_007',
    name: 'Security Defaults Disabled',
    category: ALERT_CATEGORIES.IDENTITY_ACCESS,
    priority: 'P1',
    severity: 'CRITICAL',
    riskScore: 93,
    description: 'Azure AD Security Defaults were disabled - baseline protections removed',
    indicators: ['security defaults', 'security defaults disabled'],
    remediation: [
      'Re-enable Security Defaults immediately',
      'Review rationale for disabling',
      'Check if alternative security measures are in place',
      'Audit all user sign-ins during disabled period',
      'Implement Conditional Access as replacement'
    ],
    dataSource: 'Entra ID',
    impactLevel: 'VERY HIGH',
    timeToFix: '10 minutes'
  },

  SUSPICIOUS_SIGNIN_HIGH_RISK: {
    id: 'P1_008',
    name: 'High-Risk Sign-in Activity',
    category: ALERT_CATEGORIES.IDENTITY_ACCESS,
    priority: 'P1',
    severity: 'CRITICAL',
    riskScore: 90,
    description: 'User sign-in flagged as high-risk by Identity Protection',
    indicators: ['impossible travel', 'high risk', 'anomalous token', 'malicious ip'],
    remediation: [
      'Contact user to verify legitimate access',
      'Force password reset if compromised',
      'Review account activity for unauthorized actions',
      'Block risky IP if attack is confirmed',
      'Enable risk-based Conditional Access'
    ],
    dataSource: 'Identity Protection',
    impactLevel: 'HIGH',
    timeToFix: '30 minutes'
  },

  // Application Security (3)
  APP_DIRECTORY_READWRITE_GRANTED: {
    id: 'P1_009',
    name: 'Application Granted Directory.ReadWrite.All',
    category: ALERT_CATEGORIES.APP_SECURITY,
    priority: 'P1',
    severity: 'CRITICAL',
    riskScore: 94,
    description: 'Application granted permissions to read and write all directory objects',
    indicators: ['directory.readwrite.all', 'directory permissions', 'app permissions'],
    remediation: [
      'Verify application legitimacy and vendor',
      'Review why such broad permissions are needed',
      'Remove application if not essential',
      'Restrict to least privilege permissions',
      'Implement application governance policy'
    ],
    dataSource: 'Entra ID',
    impactLevel: 'VERY HIGH',
    timeToFix: '30 minutes'
  },

  APP_MAIL_READWRITE_GRANTED: {
    id: 'P1_010',
    name: 'Application Granted Mail.ReadWrite.All',
    category: ALERT_CATEGORIES.APP_SECURITY,
    priority: 'P1',
    severity: 'CRITICAL',
    riskScore: 93,
    description: 'Application granted permissions to read and write all user emails',
    indicators: ['mail.readwrite', 'mail permissions', 'email permissions'],
    remediation: [
      'Verify application is trusted',
      'Check if Mail.Read.All is sufficient instead',
      'Review email data accessed by app',
      'Revoke if not essential',
      'Implement application access policies'
    ],
    dataSource: 'Entra ID',
    impactLevel: 'VERY HIGH',
    timeToFix: '30 minutes'
  },

  ADMIN_CONSENT_NEW_APP: {
    id: 'P1_011',
    name: 'Admin Consent Granted to New Application',
    category: ALERT_CATEGORIES.APP_SECURITY,
    priority: 'P1',
    severity: 'CRITICAL',
    riskScore: 91,
    description: 'Administrator granted consent to new application with elevated permissions',
    indicators: ['admin consent', 'new app', 'consent granted'],
    remediation: [
      'Verify application is legitimate and from trusted vendor',
      'Review all requested permissions',
      'Check vendor security certifications',
      'Audit application usage and data access',
      'Implement application approval workflow'
    ],
    dataSource: 'Entra ID',
    impactLevel: 'VERY HIGH',
    timeToFix: '30 minutes'
  },

  // Exchange Online (2)
  MAIL_FORWARDING_EXTERNAL: {
    id: 'P1_012',
    name: 'Mail Forwarding Rule to External Domain',
    category: ALERT_CATEGORIES.EXCHANGE_SECURITY,
    priority: 'P1',
    severity: 'CRITICAL',
    riskScore: 95,
    description: 'Mailbox forwarding rule created redirecting emails to external domain',
    indicators: ['forwarding rule', 'external domain', 'mail forwarding', 'redirect'],
    remediation: [
      'Delete the suspicious forwarding rule immediately',
      'Force password reset for mailbox owner',
      'Audit all emails sent to external domain',
      'Check for other forwarding rules',
      'Implement DLP policy to block external forwarding'
    ],
    powerShellScript: `
      # Remove forwarding rule
      Remove-InboxRule -Identity "$ruleId" -Confirm:$false

      # Check for other rules
      Get-InboxRule | Where-Object { $_.ForwardingAddress }
    `,
    dataSource: 'Exchange Online',
    impactLevel: 'VERY HIGH',
    timeToFix: '15 minutes'
  },

  ANTIPHISHING_POLICY_DISABLED: {
    id: 'P1_013',
    name: 'Anti-Phishing Policy Disabled',
    category: ALERT_CATEGORIES.EXCHANGE_SECURITY,
    priority: 'P1',
    severity: 'CRITICAL',
    riskScore: 91,
    description: 'Exchange Online anti-phishing policy was disabled',
    indicators: ['antiphishing disabled', 'phishing policy disabled'],
    remediation: [
      'Re-enable anti-phishing policy immediately',
      'Verify why policy was disabled',
      'Check for phishing emails during disabled period',
      'Review user awareness training',
      'Implement email filtering policies'
    ],
    dataSource: 'Exchange Online',
    impactLevel: 'VERY HIGH',
    timeToFix: '15 minutes'
  },

  // Data Protection (2)
  ANONYMOUS_SHARING_ENABLED: {
    id: 'P1_014',
    name: 'Anonymous Sharing Enabled Tenant-Wide',
    category: ALERT_CATEGORIES.SHAREPOINT_SECURITY,
    priority: 'P1',
    severity: 'CRITICAL',
    riskScore: 92,
    description: 'Tenant-wide policy enabled anonymous user sharing without passwords',
    indicators: ['anonymous sharing', 'anyone link', 'sharing enabled'],
    remediation: [
      'Disable anonymous sharing immediately',
      'Review existing shared links',
      'Revoke high-risk anonymous shares',
      'Enforce authenticated access',
      'Implement sharing policies'
    ],
    dataSource: 'SharePoint',
    impactLevel: 'VERY HIGH',
    timeToFix: '15 minutes'
  },

  DLP_POLICY_DISABLED: {
    id: 'P1_015',
    name: 'DLP Policy Disabled',
    category: ALERT_CATEGORIES.DLP_COMPLIANCE,
    priority: 'P1',
    severity: 'CRITICAL',
    riskScore: 90,
    description: 'Data Loss Prevention policy was disabled or deleted',
    indicators: ['dlp disabled', 'dlp policy disabled', 'dlp rule removed'],
    remediation: [
      'Re-enable DLP policy immediately',
      'Verify who disabled it and why',
      'Check for data exfiltration during disabled period',
      'Review DLP alerts from past 7 days',
      'Implement approval process for policy changes'
    ],
    dataSource: 'Purview',
    impactLevel: 'VERY HIGH',
    timeToFix: '15 minutes'
  },

  // Service & Compliance (2)
  AUDIT_LOGGING_DISABLED: {
    id: 'P1_016',
    name: 'Audit Logging Disabled',
    category: ALERT_CATEGORIES.DLP_COMPLIANCE,
    priority: 'P1',
    severity: 'CRITICAL',
    riskScore: 92,
    description: 'Azure AD or Exchange audit logging was disabled',
    indicators: ['audit log disabled', 'audit logging disabled', 'logging disabled'],
    remediation: [
      'Re-enable audit logging immediately',
      'Verify who disabled logging and why',
      'Check system integrity during logging gap',
      'Review backup audit logs if available',
      'Implement change approval workflow'
    ],
    dataSource: 'Audit Logs',
    impactLevel: 'VERY HIGH',
    timeToFix: '10 minutes'
  },

  RETENTION_POLICY_REMOVED: {
    id: 'P1_017',
    name: 'Retention Policy Removed',
    category: ALERT_CATEGORIES.DLP_COMPLIANCE,
    priority: 'P1',
    severity: 'CRITICAL',
    riskScore: 89,
    description: 'Email or data retention policy was removed',
    indicators: ['retention policy removed', 'retention disabled', 'retention policy deleted'],
    remediation: [
      'Restore retention policy immediately',
      'Review compliance requirements',
      'Verify data preservation status',
      'Audit policy change',
      'Implement change controls'
    ],
    dataSource: 'Purview',
    impactLevel: 'VERY HIGH',
    timeToFix: '15 minutes'
  }
}

/**
 * P2 HIGH ALERTS (Investigate within 4 hours)
 * 21 total alert types
 */
export const P2_ALERTS = {
  // Identity & Access (6)
  MULTIPLE_FAILED_LOGINS: {
    id: 'P2_001',
    name: 'Multiple Failed Login Attempts',
    category: ALERT_CATEGORIES.IDENTITY_ACCESS,
    priority: 'P2',
    severity: 'HIGH',
    riskScore: 82,
    description: 'User experienced multiple failed sign-in attempts from various IPs',
    indicators: ['failed login', 'failed sign-in', 'brute force'],
    remediation: [
      'Temporarily lock user account',
      'Force password reset',
      'Enable MFA for user',
      'Block suspicious IP addresses',
      'Review account security settings'
    ],
    dataSource: 'Identity Protection',
    impactLevel: 'HIGH',
    timeToFix: '1 hour'
  },

  PIM_ROLE_ELIGIBLE_ASSIGNED: {
    id: 'P2_002',
    name: 'Eligible Role Assignment via PIM',
    category: ALERT_CATEGORIES.IDENTITY_ACCESS,
    priority: 'P2',
    severity: 'HIGH',
    riskScore: 75,
    description: 'Privileged role made eligible through PIM - activation required',
    indicators: ['pim assignment', 'pim role', 'eligible role'],
    remediation: [
      'Verify assignment legitimacy',
      'Review PIM activation logs',
      'Audit elevated access during session',
      'Implement approval workflow',
      'Monitor for activation'
    ],
    dataSource: 'Entra ID PIM',
    impactLevel: 'MEDIUM',
    timeToFix: '4 hours'
  },

  HIGH_USERS_WITHOUT_MFA: {
    id: 'P2_003',
    name: 'High Number of Users Without MFA',
    category: ALERT_CATEGORIES.IDENTITY_ACCESS,
    priority: 'P2',
    severity: 'HIGH',
    riskScore: 78,
    description: 'Significant number of users have not enrolled in MFA',
    indicators: ['mfa enrollment', 'mfa compliance', 'without mfa'],
    remediation: [
      'Identify users without MFA enrollment',
      'Send enrollment notifications',
      'Enforce MFA via Conditional Access',
      'Provide MFA enrollment support',
      'Track enrollment completion'
    ],
    dataSource: 'Entra ID',
    impactLevel: 'HIGH',
    timeToFix: '7 days'
  },

  SIGNIN_FROM_NEW_COUNTRY: {
    id: 'P2_004',
    name: 'Sign-in from New Country',
    category: ALERT_CATEGORIES.IDENTITY_ACCESS,
    priority: 'P2',
    severity: 'HIGH',
    riskScore: 72,
    description: 'User signed in from a country not seen in recent activity',
    indicators: ['new country', 'new location', 'geolocation'],
    remediation: [
      'Contact user to verify sign-in',
      'Check for impossible travel scenario',
      'Review user activities',
      'Enable geographic Conditional Access',
      'Monitor for follow-up suspicious activity'
    ],
    dataSource: 'Identity Protection',
    impactLevel: 'MEDIUM',
    timeToFix: '4 hours'
  },

  SIGNIN_OUTSIDE_BUSINESS_HOURS: {
    id: 'P2_005',
    name: 'Sign-in Outside Business Hours',
    category: ALERT_CATEGORIES.IDENTITY_ACCESS,
    priority: 'P2',
    severity: 'HIGH',
    riskScore: 65,
    description: 'User signed in significantly outside normal business hours',
    indicators: ['off-hours', 'business hours', 'unusual time'],
    remediation: [
      'Verify user authorization',
      'Check if legitimate work-related',
      'Review account activities',
      'Monitor for pattern changes',
      'Implement time-based Conditional Access if needed'
    ],
    dataSource: 'Sign-in Logs',
    impactLevel: 'LOW',
    timeToFix: '24 hours'
  },

  ADMIN_WITHOUT_MFA: {
    id: 'P2_006',
    name: 'Administrator Without MFA',
    category: ALERT_CATEGORIES.IDENTITY_ACCESS,
    priority: 'P2',
    severity: 'HIGH',
    riskScore: 85,
    description: 'Privileged administrator account lacks MFA enrollment',
    indicators: ['admin without mfa', 'privileged account', 'mfa missing'],
    remediation: [
      'Force MFA enrollment immediately',
      'Reset admin password',
      'Review recent admin activities',
      'Implement mandatory MFA policy',
      'Audit all admin accounts'
    ],
    dataSource: 'Entra ID',
    impactLevel: 'VERY HIGH',
    timeToFix: '2 hours'
  },

  // Application & Permissions (4)
  NEW_APP_REGISTRATION: {
    id: 'P2_007',
    name: 'New Application Registration',
    category: ALERT_CATEGORIES.APP_SECURITY,
    priority: 'P2',
    severity: 'HIGH',
    riskScore: 70,
    description: 'New OAuth application registered in tenant',
    indicators: ['app registration', 'new app', 'application registered'],
    remediation: [
      'Verify application legitimacy',
      'Review requested permissions',
      'Check vendor credentials',
      'Monitor application usage',
      'Implement app governance'
    ],
    dataSource: 'Entra ID',
    impactLevel: 'MEDIUM',
    timeToFix: '4 hours'
  },

  APP_SECRET_CREATED: {
    id: 'P2_008',
    name: 'Application Secret Created',
    category: ALERT_CATEGORIES.APP_SECURITY,
    priority: 'P2',
    severity: 'HIGH',
    riskScore: 72,
    description: 'New secret or certificate created for application',
    indicators: ['secret created', 'certificate added', 'app credential'],
    remediation: [
      'Verify secret is for legitimate purpose',
      'Check who created the secret',
      'Monitor secret usage',
      'Implement secret rotation policy',
      'Audit application access'
    ],
    dataSource: 'Entra ID',
    impactLevel: 'MEDIUM',
    timeToFix: '4 hours'
  },

  APP_OWNERSHIP_CHANGED: {
    id: 'P2_009',
    name: 'Application Ownership Changed',
    category: ALERT_CATEGORIES.APP_SECURITY,
    priority: 'P2',
    severity: 'HIGH',
    riskScore: 75,
    description: 'Owner of existing application was changed',
    indicators: ['owner changed', 'ownership transfer', 'app owner'],
    remediation: [
      'Verify ownership change is authorized',
      'Review new owner credentials',
      'Check for suspicious permission changes',
      'Monitor application usage',
      'Audit all ownership transfers'
    ],
    dataSource: 'Entra ID',
    impactLevel: 'MEDIUM',
    timeToFix: '4 hours'
  },

  HIGH_RISK_APP_PERMISSIONS: {
    id: 'P2_010',
    name: 'High-Risk App Permissions Granted',
    category: ALERT_CATEGORIES.APP_SECURITY,
    priority: 'P2',
    severity: 'HIGH',
    riskScore: 78,
    description: 'Application granted high-risk permissions like Mail.All or Directory.All',
    indicators: ['high risk permission', 'sensitive permission', 'broad permission'],
    remediation: [
      'Review application purpose',
      'Reduce permissions to minimum needed',
      'Implement approval workflow',
      'Monitor application activities',
      'Consider removing if not essential'
    ],
    dataSource: 'Entra ID',
    impactLevel: 'HIGH',
    timeToFix: '4 hours'
  },

  // Exchange Online (3)
  SHARED_MAILBOX_PERMISSION_ADDED: {
    id: 'P2_011',
    name: 'Shared Mailbox Permission Added',
    category: ALERT_CATEGORIES.EXCHANGE_SECURITY,
    priority: 'P2',
    severity: 'HIGH',
    riskScore: 68,
    description: 'New permission granted to shared mailbox',
    indicators: ['shared mailbox', 'mailbox permission', 'send as'],
    remediation: [
      'Verify recipient is authorized',
      'Review shared mailbox contents',
      'Monitor mailbox access',
      'Implement mailbox access reviews',
      'Remove unnecessary permissions'
    ],
    dataSource: 'Exchange Online',
    impactLevel: 'MEDIUM',
    timeToFix: '4 hours'
  },

  SEND_AS_PERMISSION_ASSIGNED: {
    id: 'P2_012',
    name: 'Send-As Permission Assigned',
    category: ALERT_CATEGORIES.EXCHANGE_SECURITY,
    priority: 'P2',
    severity: 'HIGH',
    riskScore: 70,
    description: 'User granted Send-As permission to another mailbox',
    indicators: ['send as', 'impersonate', 'mailbox permission'],
    remediation: [
      'Verify permission is necessary',
      'Check if Send-On-Behalf sufficient instead',
      'Review email sent by this user',
      'Audit permission usage',
      'Implement approval process'
    ],
    dataSource: 'Exchange Online',
    impactLevel: 'MEDIUM',
    timeToFix: '4 hours'
  },

  TRANSPORT_RULE_CREATED: {
    id: 'P2_013',
    name: 'Transport Rule Created/Modified',
    category: ALERT_CATEGORIES.EXCHANGE_SECURITY,
    priority: 'P2',
    severity: 'HIGH',
    riskScore: 72,
    description: 'Email transport rule created or modified',
    indicators: ['transport rule', 'email rule', 'mail flow rule'],
    remediation: [
      'Verify rule purpose and legitimacy',
      'Check rule actions and conditions',
      'Review affected message count',
      'Monitor rule for unintended effects',
      'Implement rule change approval'
    ],
    dataSource: 'Exchange Online',
    impactLevel: 'MEDIUM',
    timeToFix: '4 hours'
  },

  // SharePoint & OneDrive (3)
  GUEST_USER_ADDED_SENSITIVE_GROUP: {
    id: 'P2_014',
    name: 'Guest User Added to Sensitive Group',
    category: ALERT_CATEGORIES.SHAREPOINT_SECURITY,
    priority: 'P2',
    severity: 'HIGH',
    riskScore: 75,
    description: 'Guest user added to security group with elevated permissions',
    indicators: ['guest added', 'sensitive group', 'guest permission'],
    remediation: [
      'Verify guest user legitimacy',
      'Review sponsorship',
      'Check group membership requirements',
      'Remove if not necessary',
      'Implement access reviews for guest accounts'
    ],
    dataSource: 'Entra ID',
    impactLevel: 'MEDIUM',
    timeToFix: '4 hours'
  },

  SITE_COLLECTION_ADMIN_ADDED: {
    id: 'P2_015',
    name: 'Site Collection Admin Added',
    category: ALERT_CATEGORIES.SHAREPOINT_SECURITY,
    priority: 'P2',
    severity: 'HIGH',
    riskScore: 70,
    description: 'User promoted to site collection administrator',
    indicators: ['site admin', 'collection admin', 'sharepoint admin'],
    remediation: [
      'Verify admin assignment legitimacy',
      'Review user profile and role',
      'Check site content accessed',
      'Audit admin activities',
      'Monitor for suspicious changes'
    ],
    dataSource: 'SharePoint',
    impactLevel: 'MEDIUM',
    timeToFix: '4 hours'
  },

  EXTERNAL_USER_INVITED_TO_SITE: {
    id: 'P2_016',
    name: 'External User Invited to Site',
    category: ALERT_CATEGORIES.SHAREPOINT_SECURITY,
    priority: 'P2',
    severity: 'HIGH',
    riskScore: 68,
    description: 'External user granted access to SharePoint site',
    indicators: ['external user', 'external invitation', 'guest invited'],
    remediation: [
      'Verify external user legitimacy',
      'Check site contents and sensitivity',
      'Review shared files',
      'Monitor external user activities',
      'Implement external user reviews'
    ],
    dataSource: 'SharePoint',
    impactLevel: 'MEDIUM',
    timeToFix: '4 hours'
  },

  // Intune & Device (3)
  DEVICE_COMPLIANCE_POLICY_REMOVED: {
    id: 'P2_017',
    name: 'Device Compliance Policy Removed',
    category: ALERT_CATEGORIES.DEVICE_INTUNE,
    priority: 'P2',
    severity: 'HIGH',
    riskScore: 72,
    description: 'Intune device compliance policy was removed',
    indicators: ['compliance policy removed', 'device policy deleted'],
    remediation: [
      'Restore compliance policy immediately',
      'Review why it was removed',
      'Check non-compliant devices',
      'Audit device status',
      'Implement policy change approval'
    ],
    dataSource: 'Intune',
    impactLevel: 'HIGH',
    timeToFix: '4 hours'
  },

  DEVICE_NONCOMPLIANCE_DETECTED: {
    id: 'P2_018',
    name: 'Device Non-Compliance Detected',
    category: ALERT_CATEGORIES.DEVICE_INTUNE,
    priority: 'P2',
    severity: 'HIGH',
    riskScore: 65,
    description: 'Device reported as non-compliant with security policies',
    indicators: ['non-compliant', 'noncompliant device', 'compliance violation'],
    remediation: [
      'Contact device owner',
      'Verify device security status',
      'Apply missing security patches',
      'Re-enroll device if necessary',
      'Restrict access if needed'
    ],
    dataSource: 'Intune',
    impactLevel: 'MEDIUM',
    timeToFix: '24 hours'
  },

  JAILBROKEN_DEVICE_DETECTED: {
    id: 'P2_019',
    name: 'Jailbroken/Rooted Device Detected',
    category: ALERT_CATEGORIES.DEVICE_INTUNE,
    priority: 'P2',
    severity: 'HIGH',
    riskScore: 80,
    description: 'Device detected as jailbroken or rooted',
    indicators: ['jailbroken', 'rooted', 'device security'],
    remediation: [
      'Immediately block device access',
      'Contact device owner',
      'Require device remediation',
      'Consider device replacement',
      'Review data on device'
    ],
    dataSource: 'Intune',
    impactLevel: 'HIGH',
    timeToFix: '2 hours'
  },

  // Teams (2)
  EXTERNAL_FEDERATION_ENABLED: {
    id: 'P2_020',
    name: 'External Federation Enabled',
    category: ALERT_CATEGORIES.TEAMS_SECURITY,
    priority: 'P2',
    severity: 'HIGH',
    riskScore: 70,
    description: 'Teams external federation enabled for new domains',
    indicators: ['federation enabled', 'external federation', 'teams federation'],
    remediation: [
      'Verify federation necessity',
      'Review allowed external domains',
      'Restrict to trusted partners only',
      'Monitor external communications',
      'Implement federation policies'
    ],
    dataSource: 'Teams',
    impactLevel: 'MEDIUM',
    timeToFix: '4 hours'
  },

  GUEST_ACCESS_ENABLED: {
    id: 'P2_021',
    name: 'Guest Access to Teams Enabled',
    category: ALERT_CATEGORIES.TEAMS_SECURITY,
    priority: 'P2',
    severity: 'HIGH',
    riskScore: 68,
    description: 'Guest user access to Teams enabled',
    indicators: ['guest access', 'teams guest', 'external access'],
    remediation: [
      'Verify guest access necessity',
      'Review guest user list',
      'Check channels accessed by guests',
      'Implement guest usage policies',
      'Monitor guest activities'
    ],
    dataSource: 'Teams',
    impactLevel: 'MEDIUM',
    timeToFix: '4 hours'
  },

  // NEW ALERTS: MFA & CONDITIONAL ACCESS (5)
  MFA_REQUIREMENT_DISABLED: {
    id: 'P1_NEW_001',
    name: 'MFA Requirement Disabled for Critical Users',
    category: ALERT_CATEGORIES.IDENTITY_ACCESS,
    priority: 'P1',
    severity: 'CRITICAL',
    riskScore: 94,
    description: 'MFA requirement has been disabled for critical user roles or organization-wide',
    indicators: ['mfa requirement disabled', 'multifactor disabled', 'mfa policy disabled', 'remove mfa requirement'],
    remediation: [
      'Immediately re-enable MFA requirement for all users',
      'Identify who disabled MFA and review their authorization',
      'Audit all sign-in activities since MFA was disabled',
      'Review access logs for privilege escalation attempts',
      'Implement policy to prevent MFA requirement changes'
    ],
    powerShellScript: `
      # Re-enable MFA requirement
      Update-MgPolicyCrossTenantAccessPolicyDefault -MfaEnforcement required

      # Audit MFA changes
      Get-MgAuditLogDirectoryAudit -Filter "resources/any(s:s/displayName eq 'MFA')" | Select-Object -First 100

      # Get recent sign-ins without MFA
      Get-MgAuditLogSignIn -Filter "authenticationRequirement eq 'singleFactorAuthentication'" -Top 50
    `,
    dataSource: 'Entra ID Audit',
    impactLevel: 'VERY HIGH',
    timeToFix: '15 minutes'
  },

  CA_POLICY_MODIFIED: {
    id: 'P1_NEW_002',
    name: 'Conditional Access Policy Modified/Weakened',
    category: ALERT_CATEGORIES.IDENTITY_ACCESS,
    priority: 'P1',
    severity: 'CRITICAL',
    riskScore: 93,
    description: 'Critical Conditional Access policy was modified, weakening security controls',
    indicators: ['conditional access modified', 'ca policy changed', 'policy weakened', 'access control reduced'],
    remediation: [
      'Review the specific policy changes made',
      'Identify who modified the policy and confirm authorization',
      'Revert to previous secure policy version',
      'Implement approval workflow for CA policy changes',
      'Enable policy change audit logging'
    ],
    powerShellScript: `
      # Get recently modified CA policies
      Get-MgIdentityConditionalAccessPolicy | Select-Object displayName, createdDateTime, modifiedDateTime | Sort-Object modifiedDateTime -Descending | Select-Object -First 20

      # Get policy details
      Get-MgIdentityConditionalAccessPolicy -Filter "displayName eq 'Policy Name'" | Select-Object -ExpandProperty conditions

      # Audit CA changes
      Get-MgAuditLogDirectoryAudit -Filter "resources/any(s:s/displayName eq 'Conditional Access')" | Select-Object -First 100
    `,
    dataSource: 'Entra ID',
    impactLevel: 'VERY HIGH',
    timeToFix: '15 minutes'
  },

  CA_EXCEPTION_CREATED: {
    id: 'P1_NEW_003',
    name: 'Conditional Access Exception Created',
    category: ALERT_CATEGORIES.IDENTITY_ACCESS,
    priority: 'P2',
    severity: 'HIGH',
    riskScore: 82,
    description: 'Conditional Access exception (exclusion) was created, bypassing security controls for specific users/apps',
    indicators: ['ca exception', 'conditional access exclusion', 'bypass policy', 'exclude from ca'],
    remediation: [
      'Review the exception scope and justification',
      'Verify the excluded users/applications are necessary',
      'Set expiration date for the exception',
      'Document exception approval and business reason',
      'Monitor activities of excluded users/apps closely'
    ],
    powerShellScript: `
      # List all CA policies with exclusions
      Get-MgIdentityConditionalAccessPolicy | Where-Object {$_.conditions.users.excludeUsers -ne $null} | Select-Object displayName, conditions

      # Get excluded users
      $policy = Get-MgIdentityConditionalAccessPolicy -Filter "displayName eq 'Policy Name'"
      $policy.conditions.users.excludeUsers

      # Audit exception creations
      Get-MgAuditLogDirectoryAudit -Filter "operationName eq 'Add conditional access policy'" | Select-Object -First 50
    `,
    dataSource: 'Entra ID',
    impactLevel: 'HIGH',
    timeToFix: '2 hours'
  },

  LEGACY_AUTH_ALLOWED: {
    id: 'P1_NEW_004',
    name: 'Legacy Authentication Allowed',
    category: ALERT_CATEGORIES.IDENTITY_ACCESS,
    priority: 'P1',
    severity: 'CRITICAL',
    riskScore: 91,
    description: 'Legacy authentication protocols (IMAP, POP3, SMTP) enabled allowing weak authentication',
    indicators: ['legacy auth enabled', 'basic auth allowed', 'imap enabled', 'pop3 enabled', 'smtp allowed'],
    remediation: [
      'Disable legacy authentication via Conditional Access',
      'Migrate users to modern authentication',
      'Review who enabled legacy auth',
      'Audit legacy authentication sign-ins',
      'Implement policy requiring modern auth protocols'
    ],
    powerShellScript: `
      # Create CA policy to block legacy auth
      $policy = New-MgIdentityConditionalAccessPolicy -DisplayName 'Block Legacy Authentication' -State 'enabled' -Conditions @{clientAppTypes = @('exchangeActiveSync','other')} -GrantControls @{operator='OR';builtInControls=@('block')}

      # Get legacy auth sign-ins
      Get-MgAuditLogSignIn -Filter "clientAppUsed eq 'IMAP' OR clientAppUsed eq 'POP3' OR clientAppUsed eq 'SMTP'" -Top 100

      # Disable legacy auth for Exchange Online
      Set-OrgConfig -LegacyAuthenticationDisabled $true
    `,
    dataSource: 'Entra ID & Exchange',
    impactLevel: 'VERY HIGH',
    timeToFix: '30 minutes'
  },

  PASSWORDLESS_DISABLED: {
    id: 'P2_NEW_001',
    name: 'Passwordless Sign-in Disabled',
    category: ALERT_CATEGORIES.IDENTITY_ACCESS,
    priority: 'P2',
    severity: 'HIGH',
    riskScore: 76,
    description: 'Passwordless authentication methods (Windows Hello, FIDO2) were disabled',
    indicators: ['passwordless disabled', 'windows hello disabled', 'fido2 disabled', 'phone sign-in disabled'],
    remediation: [
      'Re-enable passwordless authentication methods',
      'Notify users about passwordless options',
      'Review why they were disabled',
      'Implement passwordless enrollment campaign',
      'Monitor adoption of passwordless authentication'
    ],
    powerShellScript: `
      # Get passwordless method settings
      Get-MgPolicyAuthenticationMethodPolicy | Select-Object -ExpandProperty authenticationMethodConfigurations | Where-Object {$_.id -like '*windowsHello*' -or $_.id -like '*fido2*'}

      # Enable Windows Hello
      Update-MgPolicyAuthenticationMethodPolicy -Id 'WindowsHelloForBusiness' -Enabled $true

      # Enable FIDO2
      Update-MgPolicyAuthenticationMethodPolicy -Id 'Fido2' -Enabled $true
    `,
    dataSource: 'Entra ID',
    impactLevel: 'MEDIUM',
    timeToFix: '4 hours'
  },

  // NEW ALERTS: SECURITY DEFAULTS & POLICIES (4)
  SECURITY_DEFAULTS_CHANGED: {
    id: 'P1_NEW_005',
    name: 'Security Defaults Policy Changed',
    category: ALERT_CATEGORIES.IDENTITY_ACCESS,
    priority: 'P1',
    severity: 'CRITICAL',
    riskScore: 92,
    description: 'Azure AD Security Defaults were modified or disabled, weakening baseline protections',
    indicators: ['security defaults disabled', 'security defaults changed', 'baseline protection removed'],
    remediation: [
      'Immediately re-enable Security Defaults',
      'Review why they were disabled',
      'Identify who made the change',
      'Audit security impact of disabling defaults',
      'Implement policy to prevent disabling'
    ],
    powerShellScript: `
      # Check Security Defaults status
      Get-MgPolicyIdentitySecurityDefaultEnforcementPolicy | Select-Object isEnabled

      # Enable Security Defaults
      Update-MgPolicyIdentitySecurityDefaultEnforcementPolicy -IsEnabled $true

      # Audit change
      Get-MgAuditLogDirectoryAudit -Filter "operationName eq 'Update Security Default Policy'" | Select-Object -First 20
    `,
    dataSource: 'Entra ID',
    impactLevel: 'VERY HIGH',
    timeToFix: '15 minutes'
  },

  PASSWORD_EXPIRATION_DISABLED: {
    id: 'P2_NEW_002',
    name: 'Password Expiration Policy Disabled',
    category: ALERT_CATEGORIES.CONFIG_DRIFT,
    priority: 'P2',
    severity: 'HIGH',
    riskScore: 80,
    description: 'Password expiration policy was disabled, allowing passwords to remain unchanged indefinitely',
    indicators: ['password expiration disabled', 'password policy changed', 'password never expires'],
    remediation: [
      'Enable password expiration policy',
      'Set appropriate password lifetime (90 days recommended)',
      'Force password change for all users',
      'Review who disabled the policy',
      'Implement approval for policy changes'
    ],
    powerShellScript: `
      # Set password expiration to 90 days
      Update-MgDomain -Id 'yourdomain.onmicrosoft.com' -PasswordValidityPeriodInDays 90

      # Get current password policy
      Get-MgDomain -Search "DisplayName:yourdomain" | Select-Object passwordValidityPeriodInDays

      # Force password change for all users
      Get-MgUser -Filter "userType eq 'Member'" | Update-MgUser -forceChangePasswordNextSignIn $true
    `,
    dataSource: 'Entra ID',
    impactLevel: 'MEDIUM',
    timeToFix: '4 hours'
  },

  RISK_BASED_POLICY_DISABLED: {
    id: 'P1_NEW_006',
    name: 'Risk-Based Sign-in Policy Disabled',
    category: ALERT_CATEGORIES.DEFENDER_SECURITY,
    priority: 'P1',
    severity: 'CRITICAL',
    riskScore: 88,
    description: 'Risk-based Conditional Access or sign-in policies were disabled',
    indicators: ['risk policy disabled', 'sign-in risk disabled', 'identity protection disabled', 'risk assessment disabled'],
    remediation: [
      'Re-enable risk-based policies immediately',
      'Review who disabled them',
      'Audit risky sign-ins that occurred while disabled',
      'Implement approval process for policy changes',
      'Monitor risky sign-in patterns'
    ],
    powerShellScript: `
      # Get risk-based policies
      Get-MgIdentityConditionalAccessPolicy | Where-Object {$_.conditions.riskLevels -ne $null} | Select-Object displayName, state

      # Enable risk-based policy
      Update-MgIdentityConditionalAccessPolicy -ConditionalAccessPolicyId 'policy-id' -State 'enabled'

      # Get risky sign-ins
      Get-MgRiskyUser | Select-Object displayName, riskLevel, riskLastUpdatedDateTime
    `,
    dataSource: 'Entra ID Protection',
    impactLevel: 'VERY HIGH',
    timeToFix: '15 minutes'
  },

  MULTITENANT_POLICY_MODIFIED: {
    id: 'P2_NEW_003',
    name: 'Azure AD Multi-Tenant Access Policy Modified',
    category: ALERT_CATEGORIES.CONFIG_DRIFT,
    priority: 'P2',
    severity: 'HIGH',
    riskScore: 75,
    description: 'Cross-tenant access restrictions were modified, potentially allowing unauthorized B2B access',
    indicators: ['multi-tenant policy changed', 'cross-tenant access modified', 'b2b policy changed'],
    remediation: [
      'Review new multi-tenant access settings',
      'Verify authorized external tenants are listed',
      'Check for unexpected organization additions',
      'Implement approval for B2B access grants',
      'Audit recent external user invitations'
    ],
    powerShellScript: `
      # Get cross-tenant access policy
      Get-MgPolicyCrossTenantAccessPolicy | Select-Object -ExpandProperty b2bCollaborationOutbound

      # Get external access settings
      Get-MgPolicyCrossTenantAccessPolicyPartner -Filter "inboundTrust/notApplicableToExternalUsers eq false"

      # Audit B2B invitations
      Get-MgAuditLogDirectoryAudit -Filter "operationName eq 'Invite external user'" | Select-Object -First 50
    `,
    dataSource: 'Entra ID',
    impactLevel: 'MEDIUM',
    timeToFix: '2 hours'
  },

  // NEW ALERTS: APPLICATION GOVERNANCE (4)
  SERVICE_PRINCIPAL_SECRET_EXPIRED: {
    id: 'P1_NEW_007',
    name: 'Service Principal Secret Expired/Removed',
    category: ALERT_CATEGORIES.APP_SECURITY,
    priority: 'P1',
    severity: 'CRITICAL',
    riskScore: 87,
    description: 'Service principal credentials expired or were deleted, potentially breaking app authentication',
    indicators: ['sp secret expired', 'credential deleted', 'service principal auth failed', 'secret removed'],
    remediation: [
      'Immediately create new service principal credentials',
      'Update application configuration with new secret',
      'Review which apps use this service principal',
      'Check application logs for authentication failures',
      'Implement credential rotation schedule'
    ],
    powerShellScript: `
      # Get service principals with expired secrets
      Get-MgServicePrincipal | Where-Object {$_.passwordCredentials.endDateTime -lt (Get-Date)} | Select-Object displayName, appId

      # Add new credential
      Add-MgServicePrincipalPassword -ServicePrincipalId 'sp-id' -PasswordCredential @{displayName='New-Secret-$(Get-Date -Format yyyyMMdd)'}

      # Check app authentication failures
      Get-MgAuditLogDirectoryAudit -Filter "operationName eq 'Add service principal credentials'" | Select-Object -First 20
    `,
    dataSource: 'Entra ID',
    impactLevel: 'VERY HIGH',
    timeToFix: '15 minutes'
  },

  USER_APP_CONSENT_GRANTED: {
    id: 'P2_NEW_004',
    name: 'Application Permission Grant Consent by User',
    category: ALERT_CATEGORIES.APP_SECURITY,
    priority: 'P2',
    severity: 'HIGH',
    riskScore: 78,
    description: 'User granted consent to application requesting high-risk permissions without admin review',
    indicators: ['user consent granted', 'app permission approved', 'oauth consent', 'third-party app approved'],
    remediation: [
      'Review the application and permissions granted',
      'Validate application legitimacy',
      'Revoke consent if application is suspicious',
      'Require admin consent for sensitive permissions',
      'Implement app approval policies'
    ],
    powerShellScript: `
      # Get applications with user consent
      Get-MgServicePrincipal | Select-Object appId, displayName, replyUrls | Where-Object {$_.replyUrls -like '*oauth*'}

      # List user consents
      Get-MgOauth2PermissionGrant -Filter "principalId ne null" | Select-Object clientId, principalId, consentType

      # Revoke consent if needed
      Remove-MgOauth2PermissionGrant -OAuth2PermissionGrantId 'grant-id'
    `,
    dataSource: 'Entra ID',
    impactLevel: 'MEDIUM',
    timeToFix: '2 hours'
  },

  HIGH_RISK_OAUTH_APP: {
    id: 'P1_NEW_008',
    name: 'High-Risk OAuth Application Granted',
    category: ALERT_CATEGORIES.APP_SECURITY,
    priority: 'P1',
    severity: 'CRITICAL',
    riskScore: 90,
    description: 'High-risk OAuth application was granted permissions to access user data',
    indicators: ['oauth risk detected', 'suspicious oauth app', 'risky permissions granted', 'mail.read granted to unknown app'],
    remediation: [
      'Immediately revoke application access',
      'Investigate application legitimacy and source',
      'Audit data accessed by the application',
      'Notify affected users',
      'Block similar suspicious applications'
    ],
    powerShellScript: `
      # List all OAuth applications
      Get-MgServicePrincipal | Where-Object {$_.tags -contains 'WindowsAzureActiveDirectoryIntegratedApp'} | Select-Object displayName, appId, createdDateTime

      # Get permissions granted
      Get-MgServicePrincipal -ServicePrincipalId 'app-id' | Select-Object -ExpandProperty oauth2PermissionScopes

      # Revoke all permissions
      Get-MgServicePrincipalOauth2PermissionGrant -ServicePrincipalId 'app-id' | Remove-MgOauth2PermissionGrant
    `,
    dataSource: 'Entra ID',
    impactLevel: 'VERY HIGH',
    timeToFix: '15 minutes'
  },

  SP_ADMIN_CONSENT_GRANTED: {
    id: 'P1_NEW_009',
    name: 'Service Principal Granted Admin Consent',
    category: ALERT_CATEGORIES.APP_SECURITY,
    priority: 'P1',
    severity: 'CRITICAL',
    riskScore: 92,
    description: 'Service principal received tenant-wide admin consent for sensitive permissions',
    indicators: ['admin consent granted', 'service principal consent', 'directory read consent', 'sensitive scope granted'],
    remediation: [
      'Review the service principal and requested permissions',
      'Validate business justification for admin consent',
      'Limit permissions to minimum necessary',
      'Revoke consent if not justified',
      'Implement approval workflow for admin consents'
    ],
    powerShellScript: `
      # Get service principals with admin consent
      Get-MgOauth2PermissionGrant -Filter "consentType eq 'AllPrincipals'" | Select-Object clientId, scope, startTime

      # Get service principal details
      Get-MgServicePrincipal -ServicePrincipalId 'sp-id' | Select-Object displayName, appDisplayName, appId

      # Revoke admin consent
      Get-MgOauth2PermissionGrant -OAuth2PermissionGrantId 'grant-id' | Remove-MgOauth2PermissionGrant
    `,
    dataSource: 'Entra ID',
    impactLevel: 'VERY HIGH',
    timeToFix: '15 minutes'
  },

  // NEW ALERTS: DLP & AUDIT (2)
  DLP_EXCEPTION_CREATED: {
    id: 'P2_NEW_005',
    name: 'DLP Policy Exception Created',
    category: ALERT_CATEGORIES.DLP_COMPLIANCE,
    priority: 'P2',
    severity: 'HIGH',
    riskScore: 74,
    description: 'DLP policy exception was created, allowing sensitive data to bypass protection',
    indicators: ['dlp exception', 'dlp rule disabled', 'dlp bypass', 'dlp override'],
    remediation: [
      'Review the exception scope and business justification',
      'Set expiration date for the exception',
      'Document approval and reason',
      'Monitor activities covered by exception',
      'Plan exception sunset/removal'
    ],
    powerShellScript: `
      # Get DLP policies with exceptions
      Get-DlpCompliancePolicy | Select-Object name, enabled, createdDate, lastModifiedDate

      # Get rule exceptions
      Get-DlpComplianceRule | Where-Object {$_.Exceptions -ne $null} | Select-Object name, exceptions

      # Audit DLP changes
      Search-UnifiedAuditLog -RecordType DlpPolicyMatch -ResultSize 100 | Select-Object userIds, timestamp, operations
    `,
    dataSource: 'Purview DLP',
    impactLevel: 'MEDIUM',
    timeToFix: '4 hours'
  },

  AUDIT_LOG_DELETION: {
    id: 'P1_NEW_010',
    name: 'Audit Log Purge/Deletion Detected',
    category: ALERT_CATEGORIES.DLP_COMPLIANCE,
    priority: 'P1',
    severity: 'CRITICAL',
    riskScore: 96,
    description: 'Audit logs were purged, deleted, or retention policy was removed',
    indicators: ['audit log deleted', 'purge audit', 'retention policy removed', 'audit purge', 'logs removed'],
    remediation: [
      'Immediately investigate who initiated the deletion',
      'Check for unauthorized access or data exfiltration',
      'Review any concurrent suspicious activities',
      'Restore audit logs from backup if available',
      'Implement audit log retention policy (minimum 90 days)',
      'Enable Azure Storage Blob immutable backup'
    ],
    powerShellScript: `
      # Check audit log retention
      Get-AdminAuditLogConfig | Select-Object auditLogAgeLimit, adminAuditLogEnabled

      # Search for purge operations
      Search-UnifiedAuditLog -RecordType AzureActiveDirectory -Operations 'Remove-AuditLogSearchResults' -StartDate (Get-Date).AddDays(-30) | Select-Object userIds, timestamp, operations

      # Set minimum retention
      Set-AdminAuditLogConfig -AdminAuditLogEnabled $true -LogRecordCount 2500

      # Enable immutable audit logs
      Set-AdminAuditLogConfig -AuditLogAgeLimit 2555
    `,
    dataSource: 'Unified Audit Log',
    impactLevel: 'CRITICAL',
    timeToFix: '15 minutes'
  }
}

/**
 * Map alert keywords to definitions for auto-detection
 */
export function matchAlertToPriority(headline, description) {
  const text = (headline + ' ' + description).toLowerCase()

  // Check P1 alerts
  for (const [key, alert] of Object.entries(P1_ALERTS)) {
    for (const indicator of alert.indicators) {
      if (text.includes(indicator.toLowerCase())) {
        return {
          priority: 'P1',
          alertDefinition: alert,
          matchedIndicator: indicator
        }
      }
    }
  }

  // Check P2 alerts
  for (const [key, alert] of Object.entries(P2_ALERTS)) {
    for (const indicator of alert.indicators) {
      if (text.includes(indicator.toLowerCase())) {
        return {
          priority: 'P2',
          alertDefinition: alert,
          matchedIndicator: indicator
        }
      }
    }
  }

  // No match found
  return {
    priority: 'P3',
    alertDefinition: null,
    matchedIndicator: null
  }
}

/**
 * Calculate risk score based on alert severity and context
 */
export function calculateRiskScore(alert, alertDefinition) {
  if (!alertDefinition) return 50

  let score = alertDefinition.riskScore
  const now = new Date()
  const alertTime = new Date(alert.action_timestamp)
  const minutesAgo = (now - alertTime) / (1000 * 60)

  // Boost score for recent alerts
  if (minutesAgo < 15) score += 5
  if (minutesAgo < 5) score += 5

  // Cap at 100
  return Math.min(score, 100)
}

/**
 * Get remediation for an alert
 */
export function getRemediation(alertDefinition) {
  if (!alertDefinition) return ['Review alert details', 'Investigate cause', 'Take appropriate action']
  return alertDefinition.remediation
}

export default {
  P1_ALERTS,
  P2_ALERTS,
  ALERT_PRIORITY,
  ALERT_CATEGORIES,
  matchAlertToPriority,
  calculateRiskScore,
  getRemediation
}
