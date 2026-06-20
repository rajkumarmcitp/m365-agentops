import { initDatabase, getDatabase } from './database.js'
import { v4 as uuid } from 'uuid'
import { matchAlertToPriority, calculateRiskScore } from './alert-definitions.js'

const TEST_ALERTS = [
  {
    headline: 'CRITICAL: Global Admin Role Added to External User',
    description: 'A user with external identity was granted Global Administrator privileges. This is a high-risk security event.',
    actor: 'admin@contoso.com',
    severity: 'CRITICAL',
    score: 95,
    priority: 'P1',
    type: 'ADMIN',
    riskAssessment: {
      score: 95,
      severity: 'CRITICAL',
      levels: { privilege: 'VERY HIGH', security: 'VERY HIGH', data: 'VERY HIGH', frequency: 'LOW' },
      impacts: ['Unrestricted tenant access', 'Complete privilege escalation', 'All data exposure risk']
    },
    recommendations: [
      'Immediately revoke Global Administrator role from external user',
      'Review all recent actions by this account for unauthorized activity',
      'Audit all Azure AD role assignments for external users',
      'Implement Conditional Access policy to block external admin access',
      'Run security incident response protocol'
    ]
  },
  {
    headline: 'CRITICAL: Mailbox Forwarding Rule to External Domain',
    description: 'A mailbox forwarding rule was created redirecting all emails to an external domain (attacker-domain.com).',
    actor: 'security-team@contoso.com',
    severity: 'CRITICAL',
    score: 92,
    priority: 'P1',
    type: 'EXCHANGE',
    riskAssessment: {
      score: 92,
      severity: 'CRITICAL',
      levels: { privilege: 'HIGH', security: 'VERY HIGH', data: 'VERY HIGH', frequency: 'LOW' },
      impacts: ['Email data exfiltration', 'Unauthorized external access', 'Compliance violation']
    },
    recommendations: [
      'Immediately delete the suspicious forwarding rule',
      'Review mailbox owner for account compromise',
      'Check mailbox audit logs for unauthorized access',
      'Notify all users about email forwarding security',
      'Deploy DLP policy to prevent external email forwarding'
    ]
  },
  {
    headline: 'HIGH: Suspicious Sign-in from Impossible Travel',
    description: 'User msmith@contoso.com signed in from two different countries within 2 hours. Possible account compromise.',
    actor: 'Azure AD Identity Protection',
    severity: 'HIGH',
    score: 78,
    priority: 'P1',
    type: 'SECURITY',
    riskAssessment: {
      score: 78,
      severity: 'HIGH',
      levels: { privilege: 'MEDIUM', security: 'HIGH', data: 'HIGH', frequency: 'MEDIUM' },
      impacts: ['Potential account compromise', 'Suspicious access pattern']
    },
    recommendations: [
      'Contact user to verify legitimate sign-in',
      'Reset user password if account is compromised',
      'Review recent user activities and downloads',
      'Enable MFA if not already active',
      'Monitor account for additional suspicious activities'
    ]
  },
  {
    headline: 'HIGH: Policy Update Without Approval',
    description: 'Conditional Access policy was modified without going through change management approval process.',
    actor: 'john.doe@contoso.com',
    severity: 'HIGH',
    score: 75,
    priority: 'P1',
    type: 'ADMIN',
    riskAssessment: {
      score: 75,
      severity: 'HIGH',
      levels: { privilege: 'HIGH', security: 'HIGH', data: 'MEDIUM', frequency: 'LOW' },
      impacts: ['Unapproved configuration change', 'Potential security gap']
    },
    recommendations: [
      'Review the policy changes immediately',
      'Verify if changes are compliant with security standards',
      'Implement change approval workflow for CA policies',
      'Roll back if changes violate security policies',
      'Audit all policy changes in the past 30 days'
    ]
  },
  {
    headline: 'HIGH: Multiple Failed Sign-in Attempts',
    description: 'User jsmith@contoso.com had 47 failed sign-in attempts in the last hour from different IP addresses.',
    actor: 'Azure AD Identity Protection',
    severity: 'HIGH',
    score: 82,
    priority: 'P2',
    type: 'SECURITY',
    riskAssessment: {
      score: 82,
      severity: 'HIGH',
      levels: { privilege: 'MEDIUM', security: 'HIGH', data: 'MEDIUM', frequency: 'HIGH' },
      impacts: ['Brute force attack detected', 'Account lockout imminent']
    },
    recommendations: [
      'Temporarily lock the user account',
      'Reset user password immediately',
      'Enable MFA for the user',
      'Review and block suspicious IP addresses',
      'Enable sign-in risk-based Conditional Access'
    ]
  },
  {
    headline: 'MEDIUM: Guest User Added to Sensitive Group',
    description: 'A guest user was added to the "Finance Approvers" security group with elevated permissions.',
    actor: 'identity-team@contoso.com',
    severity: 'MEDIUM',
    score: 62,
    priority: 'P2',
    type: 'ADMIN',
    riskAssessment: {
      score: 62,
      severity: 'MEDIUM',
      levels: { privilege: 'MEDIUM', security: 'MEDIUM', data: 'MEDIUM', frequency: 'LOW' },
      impacts: ['Unauthorized access to sensitive resources']
    },
    recommendations: [
      'Review guest user credentials and sponsorship',
      'Verify guest access is required for their role',
      'Remove guest from group if access is not needed',
      'Implement regular review of guest user permissions',
      'Use access reviews for guest account management'
    ]
  },
  {
    headline: 'MEDIUM: Bulk User Account Deletion',
    description: '15 user accounts were deleted in rapid succession. Possible account cleanup or malicious action.',
    actor: 'system',
    severity: 'MEDIUM',
    score: 58,
    priority: 'P3',
    type: 'ADMIN',
    riskAssessment: {
      score: 58,
      severity: 'MEDIUM',
      levels: { privilege: 'HIGH', security: 'MEDIUM', data: 'LOW', frequency: 'LOW' },
      impacts: ['Potential data loss', 'Unplanned user offboarding']
    },
    recommendations: [
      'Verify if deletions were part of planned user offboarding',
      'Check deleted user email forwarding rules',
      'Review deleted user group memberships',
      'Check if user data was properly preserved',
      'Implement bulk operation approval process'
    ]
  },
  {
    headline: 'MEDIUM: Audit Log Retention Changed',
    description: 'Azure AD audit log retention policy was reduced from 90 days to 7 days.',
    actor: 'compliance-admin@contoso.com',
    severity: 'MEDIUM',
    score: 55,
    priority: 'P1',
    type: 'ADMIN',
    riskAssessment: {
      score: 55,
      severity: 'MEDIUM',
      levels: { privilege: 'MEDIUM', security: 'MEDIUM', data: 'HIGH', frequency: 'LOW' },
      impacts: ['Reduced audit trail', 'Compliance risk']
    },
    recommendations: [
      'Review audit retention policy requirements',
      'Verify compliance with organizational policy',
      'Restore retention to minimum 90 days',
      'Document reason for any retention changes',
      'Implement approval for audit policy changes'
    ]
  },
  {
    headline: 'INFO: New OAuth Application Registered',
    description: 'New third-party OAuth application "DataSync Pro" was registered and granted Mail.Read permissions.',
    actor: 'user@contoso.com',
    severity: 'MEDIUM',
    score: 51,
    priority: 'P2',
    type: 'APPLICATION',
    riskAssessment: {
      score: 51,
      severity: 'MEDIUM',
      levels: { privilege: 'LOW', security: 'MEDIUM', data: 'MEDIUM', frequency: 'MEDIUM' },
      impacts: ['Third-party mail access', 'Data exposure potential']
    },
    recommendations: [
      'Verify legitimacy of "DataSync Pro" application',
      'Review requested permissions',
      'Audit any data accessed by the application',
      'Consider restricting OAuth consent to IT admins',
      'Implement application governance policy'
    ]
  },

  // NEW ALERTS: MFA & CONDITIONAL ACCESS
  {
    headline: 'CRITICAL: MFA Requirement Disabled for Critical Users',
    description: 'MFA requirement has been disabled organization-wide, removing mandatory multi-factor authentication.',
    actor: 'security-admin@contoso.com',
    severity: 'CRITICAL',
    score: 94,
    priority: 'P1',
    type: 'SECURITY',
    riskAssessment: {
      score: 94,
      severity: 'CRITICAL',
      levels: { privilege: 'VERY HIGH', security: 'VERY HIGH', data: 'VERY HIGH', frequency: 'LOW' },
      impacts: ['Authentication bypass', 'Credential compromise risk', 'Unauthorized access']
    },
    recommendations: [
      'Immediately re-enable MFA requirement for all users',
      'Audit who disabled MFA and review authorization',
      'Check all sign-in logs since MFA was disabled',
      'Force MFA re-enrollment for critical roles',
      'Implement policy to prevent MFA requirement changes'
    ]
  },

  {
    headline: 'CRITICAL: Conditional Access Policy Modified/Weakened',
    description: 'Critical Conditional Access policy blocking high-risk sign-ins was disabled.',
    actor: 'cloud-admin@contoso.com',
    severity: 'CRITICAL',
    score: 93,
    priority: 'P1',
    type: 'SECURITY',
    riskAssessment: {
      score: 93,
      severity: 'CRITICAL',
      levels: { privilege: 'VERY HIGH', security: 'VERY HIGH', data: 'VERY HIGH', frequency: 'LOW' },
      impacts: ['Security control bypassed', 'Risky sign-ins allowed', 'Breach risk increased']
    },
    recommendations: [
      'Immediately re-enable the Conditional Access policy',
      'Review all policy modifications made today',
      'Audit risky sign-ins that occurred while policy was disabled',
      'Identify who modified the policy',
      'Implement approval workflow for CA changes'
    ]
  },

  {
    headline: 'HIGH: Conditional Access Exception Created',
    description: 'A Conditional Access policy exception was created excluding 25 users from MFA requirements.',
    actor: 'identity-admin@contoso.com',
    severity: 'HIGH',
    score: 82,
    priority: 'P2',
    type: 'SECURITY',
    riskAssessment: {
      score: 82,
      severity: 'HIGH',
      levels: { privilege: 'HIGH', security: 'HIGH', data: 'MEDIUM', frequency: 'MEDIUM' },
      impacts: ['MFA bypassed for users', 'Reduced security posture']
    },
    recommendations: [
      'Review the 25 excluded users and their justification',
      'Set expiration date for the exception (max 30 days)',
      'Document business reason for exception',
      'Monitor activities of excluded users closely',
      'Plan exception removal after business need ends'
    ]
  },

  {
    headline: 'CRITICAL: Legacy Authentication Allowed',
    description: 'Legacy authentication protocols (IMAP, POP3) were enabled for all mailboxes.',
    actor: 'exchange-admin@contoso.com',
    severity: 'CRITICAL',
    score: 91,
    priority: 'P1',
    type: 'EXCHANGE',
    riskAssessment: {
      score: 91,
      severity: 'CRITICAL',
      levels: { privilege: 'VERY HIGH', security: 'VERY HIGH', data: 'HIGH', frequency: 'MEDIUM' },
      impacts: ['Weak authentication enabled', 'Credential compromise', 'Legacy attacks']
    },
    recommendations: [
      'Immediately disable legacy authentication via Conditional Access',
      'Audit legacy auth sign-ins to identify affected users',
      'Migrate users to modern authentication methods',
      'Block legacy auth at the network level',
      'Implement authentication modernization program'
    ]
  },

  {
    headline: 'HIGH: Passwordless Sign-in Disabled',
    description: 'Windows Hello for Business and FIDO2 were disabled organization-wide.',
    actor: 'identity-team@contoso.com',
    severity: 'HIGH',
    score: 76,
    priority: 'P2',
    type: 'SECURITY',
    riskAssessment: {
      score: 76,
      severity: 'HIGH',
      levels: { privilege: 'MEDIUM', security: 'HIGH', data: 'MEDIUM', frequency: 'LOW' },
      impacts: ['Modern auth methods unavailable', 'Reduced security options']
    },
    recommendations: [
      'Re-enable Windows Hello for Business',
      'Re-enable FIDO2 security key support',
      'Notify users about passwordless options',
      'Launch passwordless enrollment campaign',
      'Track adoption of passwordless authentication'
    ]
  },

  // NEW ALERTS: SECURITY DEFAULTS & POLICIES
  {
    headline: 'CRITICAL: Security Defaults Policy Changed',
    description: 'Azure AD Security Defaults were disabled, removing baseline security protections.',
    actor: 'global-admin@contoso.com',
    severity: 'CRITICAL',
    score: 92,
    priority: 'P1',
    type: 'SECURITY',
    riskAssessment: {
      score: 92,
      severity: 'CRITICAL',
      levels: { privilege: 'VERY HIGH', security: 'VERY HIGH', data: 'VERY HIGH', frequency: 'LOW' },
      impacts: ['Baseline protections removed', 'MFA enforcement disabled', 'Admin MFA bypass']
    },
    recommendations: [
      'Immediately re-enable Security Defaults',
      'Review why they were disabled',
      'Audit all activities since disablement',
      'Implement policy to prevent disablement',
      'Run full security assessment'
    ]
  },

  {
    headline: 'HIGH: Password Expiration Policy Disabled',
    description: 'Password expiration policy was disabled allowing passwords to never expire.',
    actor: 'compliance-admin@contoso.com',
    severity: 'HIGH',
    score: 80,
    priority: 'P2',
    type: 'CONFIG_DRIFT',
    riskAssessment: {
      score: 80,
      severity: 'HIGH',
      levels: { privilege: 'MEDIUM', security: 'HIGH', data: 'MEDIUM', frequency: 'LOW' },
      impacts: ['Stale passwords retained', 'Compromise risk', 'Compliance violation']
    },
    recommendations: [
      'Re-enable password expiration (90 days recommended)',
      'Force immediate password change for all users',
      'Review why policy was disabled',
      'Implement approval for policy changes',
      'Monitor password age metrics'
    ]
  },

  {
    headline: 'CRITICAL: Risk-Based Sign-in Policy Disabled',
    description: 'Azure AD Identity Protection risk-based policies were disabled.',
    actor: 'security-admin@contoso.com',
    severity: 'CRITICAL',
    score: 88,
    priority: 'P1',
    type: 'SECURITY',
    riskAssessment: {
      score: 88,
      severity: 'CRITICAL',
      levels: { privilege: 'VERY HIGH', security: 'VERY HIGH', data: 'VERY HIGH', frequency: 'LOW' },
      impacts: ['Risk detection disabled', 'Risky sign-ins allowed', 'Attack detection bypassed']
    },
    recommendations: [
      'Immediately re-enable risk-based policies',
      'Investigate risky sign-ins from disablement period',
      'Audit who disabled the policies',
      'Review risky user/sign-in lists',
      'Implement change approval process'
    ]
  },

  {
    headline: 'HIGH: Multi-Tenant Access Policy Modified',
    description: 'Cross-tenant B2B collaboration restrictions were removed for external organizations.',
    actor: 'identity-admin@contoso.com',
    severity: 'HIGH',
    score: 75,
    priority: 'P2',
    type: 'CONFIG_DRIFT',
    riskAssessment: {
      score: 75,
      severity: 'HIGH',
      levels: { privilege: 'MEDIUM', security: 'HIGH', data: 'MEDIUM', frequency: 'LOW' },
      impacts: ['B2B access expanded', 'External collaboration risk']
    },
    recommendations: [
      'Review newly allowed external organizations',
      'Verify business justification for each partner',
      'Check for unexpected external user invitations',
      'Implement approval for B2B partnerships',
      'Audit external user activities'
    ]
  },

  // NEW ALERTS: APPLICATION GOVERNANCE
  {
    headline: 'CRITICAL: Service Principal Secret Expired/Removed',
    description: 'Service principal "DataExport-API" credentials expired, breaking application authentication.',
    actor: 'app-admin@contoso.com',
    severity: 'CRITICAL',
    score: 87,
    priority: 'P1',
    type: 'APPLICATION',
    riskAssessment: {
      score: 87,
      severity: 'CRITICAL',
      levels: { privilege: 'HIGH', security: 'HIGH', data: 'VERY HIGH', frequency: 'LOW' },
      impacts: ['App authentication failure', 'Service disruption', 'Potential data loss']
    },
    recommendations: [
      'Create new service principal credentials immediately',
      'Update application configuration with new secret',
      'Check application logs for auth failures',
      'Restart affected services',
      'Implement credential rotation schedule'
    ]
  },

  {
    headline: 'HIGH: Application Permission Grant Consent by User',
    description: 'User john.smith@contoso.com granted third-party app "CloudStorage Pro" access to Mail.Read.',
    actor: 'user@contoso.com',
    severity: 'HIGH',
    score: 78,
    priority: 'P2',
    type: 'APPLICATION',
    riskAssessment: {
      score: 78,
      severity: 'HIGH',
      levels: { privilege: 'MEDIUM', security: 'HIGH', data: 'HIGH', frequency: 'MEDIUM' },
      impacts: ['Third-party mail access', 'Data exposure risk', 'Cloud storage app permissions']
    },
    recommendations: [
      'Review "CloudStorage Pro" legitimacy',
      'Validate user consent was intentional',
      'Audit data accessed by the app',
      'Revoke if application is suspicious',
      'Require admin consent for sensitive permissions'
    ]
  },

  {
    headline: 'CRITICAL: High-Risk OAuth Application Granted',
    description: 'OAuth app "MailSync-Pro" was granted Directory.ReadWrite.All permissions.',
    actor: 'system',
    severity: 'CRITICAL',
    score: 90,
    priority: 'P1',
    type: 'APPLICATION',
    riskAssessment: {
      score: 90,
      severity: 'CRITICAL',
      levels: { privilege: 'VERY HIGH', security: 'VERY HIGH', data: 'VERY HIGH', frequency: 'LOW' },
      impacts: ['Directory modification access', 'User/group creation capability', 'Complete data access']
    },
    recommendations: [
      'Immediately revoke application access',
      'Investigate application source and legitimacy',
      'Audit all changes made by the application',
      'Notify affected users of data access',
      'Block similar suspicious applications'
    ]
  },

  {
    headline: 'CRITICAL: Service Principal Granted Admin Consent',
    description: 'Service principal "AnalyticsEngine" received tenant-wide admin consent for sensitive APIs.',
    actor: 'admin@contoso.com',
    severity: 'CRITICAL',
    score: 92,
    priority: 'P1',
    type: 'APPLICATION',
    riskAssessment: {
      score: 92,
      severity: 'CRITICAL',
      levels: { privilege: 'VERY HIGH', security: 'VERY HIGH', data: 'VERY HIGH', frequency: 'LOW' },
      impacts: ['Tenant-wide permissions', 'All data access', 'Complete control granted']
    },
    recommendations: [
      'Review service principal and business justification',
      'Audit all APIs and permissions granted',
      'Limit to minimum necessary permissions',
      'Revoke admin consent if not justified',
      'Implement approval for admin consents'
    ]
  },

  // NEW ALERTS: DLP & AUDIT
  {
    headline: 'HIGH: DLP Policy Exception Created',
    description: 'Exception created for "Finance Department" to bypass DLP policy restrictions on credit card data.',
    actor: 'dlp-admin@contoso.com',
    severity: 'HIGH',
    score: 74,
    priority: 'P2',
    type: 'DLP_COMPLIANCE',
    riskAssessment: {
      score: 74,
      severity: 'HIGH',
      levels: { privilege: 'MEDIUM', security: 'MEDIUM', data: 'HIGH', frequency: 'LOW' },
      impacts: ['DLP bypass for sensitive data', 'Compliance risk', 'Unprotected data flows']
    },
    recommendations: [
      'Review exception scope and business justification',
      'Set 30-day expiration on the exception',
      'Document approval and reason',
      'Monitor Finance Dept data flows closely',
      'Plan exception removal after business need ends'
    ]
  },

  {
    headline: 'CRITICAL: Audit Log Purge/Deletion Detected',
    description: 'Audit logs from the past 60 days were purged from the unified audit log.',
    actor: 'compliance-admin@contoso.com',
    severity: 'CRITICAL',
    score: 96,
    priority: 'P1',
    type: 'DLP_COMPLIANCE',
    riskAssessment: {
      score: 96,
      severity: 'CRITICAL',
      levels: { privilege: 'VERY HIGH', security: 'VERY HIGH', data: 'VERY HIGH', frequency: 'VERY LOW' },
      impacts: ['Audit trail destroyed', 'Forensic evidence loss', 'Compliance violation', 'Legal implications']
    },
    recommendations: [
      'Immediately investigate who initiated the purge',
      'Determine what period was purged and why',
      'Check for concurrent suspicious activities',
      'Restore from backup if available',
      'Set audit retention to minimum 90 days',
      'Implement immutable audit log backups',
      'File security incident report',
      'Notify legal and compliance teams'
    ]
  }
]

export function generateTestAlerts() {
  initDatabase()
  const db = getDatabase()

  console.log('📊 Generating test alerts...')

  let count = 0
  const now = new Date()

  for (const alert of TEST_ALERTS) {
    const id = uuid()
    const timestamp = new Date(now.getTime() - Math.random() * 3600000).toISOString()

    try {
      const stmt = db.prepare(`
        INSERT INTO alerts
        (id, type, severity, score, headline, description,
         risk_assessment, recommendations, actor, action_timestamp, raw_event, priority)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `)

      stmt.run(
        id,
        alert.type,
        alert.severity,
        alert.score,
        alert.headline,
        alert.description,
        JSON.stringify(alert.riskAssessment),
        JSON.stringify(alert.recommendations),
        alert.actor,
        timestamp,
        JSON.stringify({ test: true }),
        alert.priority || 'P3'
      )

      count++
      console.log(`  ✅ ${alert.headline.substring(0, 50)}...`)
    } catch (error) {
      console.error(`  ❌ Failed to insert alert: ${error.message}`)
    }
  }

  console.log(`\n✅ Generated ${count} test alerts`)
  console.log('🚀 Refresh your browser to see alerts in TenantGuard dashboard')
}

generateTestAlerts()
