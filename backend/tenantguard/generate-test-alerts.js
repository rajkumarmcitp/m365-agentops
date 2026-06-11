import { initDatabase, getDatabase } from './database.js'
import { v4 as uuid } from 'uuid'

const TEST_ALERTS = [
  {
    headline: 'CRITICAL: Global Admin Role Added to External User',
    description: 'A user with external identity was granted Global Administrator privileges. This is a high-risk security event.',
    actor: 'admin@contoso.com',
    severity: 'CRITICAL',
    score: 95,
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
         risk_assessment, recommendations, actor, action_timestamp, raw_event)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
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
        JSON.stringify({ test: true })
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
