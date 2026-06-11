import { getDatabase } from './database.js'
import { v4 as uuid } from 'uuid'

export class AlertGenerator {
  /**
   * Generate human-readable alert
   */
  generateAlert(event, scoring) {
    const headline = this.generateHeadline(event, scoring)
    const description = this.generateDescription(event, scoring)
    const recommendations = this.generateRecommendations(event, scoring)

    return {
      id: uuid(),
      type: scoring.category,
      severity: scoring.actualSeverity,
      score: scoring.score,
      headline,
      description,
      recommendations: JSON.stringify(recommendations),
      riskAssessment: JSON.stringify({
        score: scoring.score,
        severity: scoring.actualSeverity,
        levels: {
          privilege: this.mapScore(scoring.privilege),
          security: this.mapScore(scoring.security),
          data: this.mapScore(scoring.data),
          frequency: this.mapScore(scoring.frequency || 50)
        },
        impacts: this.getImpacts(scoring)
      }),
      actor: event.actor || 'System',
      actionTimestamp: event.timestamp,
      rawEvent: event.raw_data
    }
  }

  /**
   * Save alert to database
   */
  saveAlert(alert) {
    const db = getDatabase()

    try {
      const stmt = db.prepare(`
        INSERT INTO alerts
        (id, type, severity, score, headline, description,
         risk_assessment, recommendations, actor, action_timestamp, raw_event)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `)

      stmt.run(
        alert.id,
        alert.type,
        alert.severity,
        alert.score,
        alert.headline.substring(0, 500),
        alert.description,
        alert.riskAssessment,
        alert.recommendations,
        alert.actor?.substring(0, 255) || 'System',
        alert.actionTimestamp,
        alert.rawEvent
      )

      return alert.id
    } catch (error) {
      console.error('Error saving alert:', error.message)
      throw error
    }
  }

  generateHeadline(event, scoring) {
    return `${scoring.actualSeverity}: ${scoring.name} by ${event.actor || 'System'}`
  }

  generateDescription(event, scoring) {
    const desc = {
      ADMIN: `Administrator action detected: ${scoring.name}. Performed by: ${event.actor}. This action affects tenant-wide configurations and requires verification.`,
      SECURITY: `Security-related change detected: ${scoring.name}. This change impacts your tenant's security posture.`,
      EXCHANGE: `Exchange Online change detected: ${scoring.name}. Target: ${event.target}. Review for email security implications.`,
      APPLICATION: `Application action: ${scoring.name}. Monitor for unauthorized permissions.`,
      USER: `User activity: ${scoring.name}. User: ${event.target}. Review for unauthorized changes.`,
      DEFAULT: `Audit event: ${scoring.name}. Target: ${event.target}.`
    }
    return desc[scoring.category] || desc.DEFAULT
  }

  generateRecommendations(event, scoring) {
    const recs = {
      'Add role member': [
        'Verify the role assignment was authorized',
        'Review the user\'s recent sign-in activity',
        'Check for unauthorized access',
        'If unauthorized, remove the role immediately'
      ],
      'Consent to application': [
        'Verify the OAuth application is approved by your organization',
        'Review the permissions being requested',
        'Monitor the application\'s API usage',
        'Consider restricting future consent permissions'
      ],
      'Update policy': [
        'Review the specific policy changes made',
        'Verify the changes were authorized',
        'Test the policy functionality',
        'Monitor for user impact from the change'
      ],
      'Delete policy': [
        'Verify this deletion was authorized',
        'If unauthorized, restore the policy immediately',
        'Review access logs for suspicious activity',
        'Consider restricting policy deletion permissions'
      ],
      'Set-Mailbox': [
        'Verify the mailbox configuration was authorized',
        'Review forwarding rules for suspicious destinations',
        'Check delegation permissions',
        'Monitor mailbox access logs'
      ],
      'New-InboxRule': [
        'Review the inbox rule details and conditions',
        'Check if it redirects to external email addresses',
        'Verify the creator was authorized',
        'Monitor for suspicious activity'
      ],
      'New-TransportRule': [
        'Review the transport rule conditions and actions',
        'Check if it modifies email flow unexpectedly',
        'Verify authorization',
        'Monitor impact on email delivery'
      ],
      'Risky sign-in detected': [
        'Review the user\'s recent activities',
        'Check for other suspicious sign-ins from the same location',
        'Consider requiring MFA re-authentication',
        'Reset password if compromise is suspected'
      ],
      'Disable-DkimSigningConfig': [
        'Verify this was an authorized change',
        'Re-enable DKIM signing if it was unauthorized',
        'Review for email spoofing attempts',
        'Monitor sender reputation'
      ]
    }
    return recs[event.operation_name] || [
      'Review this activity',
      'Verify it was authorized',
      'Monitor for similar activity',
      'Document the change for audit trail'
    ]
  }

  getImpacts(scoring) {
    const impacts = []
    if (scoring.privilege > 70) impacts.push('HIGH privilege impact')
    if (scoring.security > 70) impacts.push('HIGH security impact')
    if (scoring.data > 70) impacts.push('HIGH data exposure risk')
    return impacts
  }

  mapScore(score) {
    if (score >= 80) return 'VERY HIGH'
    if (score >= 60) return 'HIGH'
    if (score >= 40) return 'MEDIUM'
    return 'LOW'
  }
}
