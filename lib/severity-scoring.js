/**
 * Severity Scoring Engine for Phase 1 Monitoring
 * Calculates risk score for incidents/alerts to highlight critical issues
 */

export function calculateSeverityScore(alert, correlations = []) {
  let score = 0

  // 1. Alert Type Risk (0-30 points)
  const typeRiskMap = {
    'impossible_travel': 25,
    'compromised_credentials': 30,
    'ransomware': 28,
    'data_exfiltration': 27,
    'forwarding_rule': 20,
    'permission_escalation': 22,
    'mfa_disabled': 25,
    'unusual_bulk_operation': 18,
    'risky_signin': 15,
    'suspicious_delegation': 20,
    'default': 10,
  }
  score += typeRiskMap[alert.type] || typeRiskMap['default']

  // 2. User Privilege Level (0-30 points)
  const privilegeRiskMap = {
    'global_admin': 30,
    'exchange_admin': 25,
    'security_admin': 24,
    'compliance_admin': 20,
    'privileged_user': 15,
    'standard_user': 5,
    'guest': 2,
  }
  score += privilegeRiskMap[alert.userPrivilege] || 5

  // 3. Data Sensitivity (0-20 points)
  const dataRiskMap = {
    'email': 18,
    'sharepoint': 16,
    'onedrive': 15,
    'distribution_list': 14,
    'calendar': 12,
    'teams': 10,
    'other': 5,
  }
  score += dataRiskMap[alert.dataType] || 5

  // 4. Number of Related Incidents (0-10 points)
  if (correlations && correlations.length > 0) {
    score += Math.min(correlations.length * 2, 10)
  }

  // 5. Time Sensitivity (0-10 points) - Recent incidents score higher
  if (alert.timestamp) {
    const now = new Date()
    const alertTime = new Date(alert.timestamp)
    const hoursOld = (now - alertTime) / (1000 * 60 * 60)

    if (hoursOld < 1) score += 10
    else if (hoursOld < 24) score += 8
    else if (hoursOld < 72) score += 5
    else score += 2
  }

  // Cap at 100
  return Math.min(Math.max(Math.round(score), 0), 100)
}

export function getSeverityLevel(score) {
  if (score >= 90) return 'CRITICAL'
  if (score >= 70) return 'HIGH'
  if (score >= 50) return 'MEDIUM'
  return 'LOW'
}

export function getSeverityColors(severity) {
  const colors = {
    'CRITICAL': { bg: '#FCEBEB', text: '#A32D2D', border: '#D32F2F', icon: '🔴' },
    'HIGH': { bg: '#FAEEDA', text: '#854F0B', border: '#F57C00', icon: '🟠' },
    'MEDIUM': { bg: '#E6F1FB', text: '#0C447C', border: '#1976D2', icon: '🟡' },
    'LOW': { bg: '#E8F5E9', text: '#3B6D11', border: '#388E3C', icon: '🟢' },
  }
  return colors[severity] || colors['LOW']
}

export function getActionChecklist(alert) {
  const actionMap = {
    'impossible_travel': [
      'Verify if user actually traveled to the location',
      'Check for VPN or proxy usage that might mask location',
      'Review mailbox access logs during the suspicious time',
      'Check if credentials were shared or compromised',
      'Monitor for additional impossible travel patterns',
      'Enable Conditional Access to block impossible travel',
      'Reset user password if travel was not legitimate',
      'Review email forwarding rules for this user',
    ],
    'compromised_credentials': [
      'Review recent sign-in locations and devices',
      'Check email forwarding rules for unauthorized destinations',
      'Review mailbox delegation and calendar sharing',
      'Audit OneDrive and SharePoint access logs',
      'Check for new Azure app registrations',
      'Review distribution list modifications',
      'Reset password immediately',
      'Enable MFA if not already enabled',
      'Review conditional access policies',
      'Consider password spray patterns',
    ],
    'forwarding_rule': [
      'Remove unauthorized forwarding rules immediately',
      'Review who created the rule and when',
      'Check mailbox access logs for suspicious access',
      'Verify if sensitive emails were forwarded',
      'Enable rule to require approval for new forwarding rules',
      'Audit all forwarding rules across tenant',
      'Check for similar rules on other accounts',
      'Review email retention and deletion patterns',
    ],
    'data_exfiltration': [
      'Check data download volumes and frequency',
      'Identify which files or folders were accessed',
      'Review download locations (cloud storage, USB, etc)',
      'Check for compression (zip, rar) before download',
      'Verify if attacker is still accessing data',
      'Isolate affected resources if necessary',
      'Enable DLP policies for sensitive data',
      'Review sensitivity labels on accessed files',
      'Check for bulk operations or deletions',
    ],
    'permission_escalation': [
      'Audit group membership changes',
      'Review role additions to user account',
      'Check delegate access on mailboxes',
      'Review SharePoint permission changes',
      'Check Azure role assignments',
      'Verify if escalation was legitimate',
      'Revert unauthorized role/permission changes',
      'Review who made the permission changes',
      'Enable approval workflows for privileged roles',
    ],
    'mfa_disabled': [
      'Re-enable MFA immediately for affected user',
      'Check sign-in activity after MFA was disabled',
      'Verify if user or attacker disabled MFA',
      'Review who disabled MFA and when',
      'Check for suspicious sign-ins without MFA',
      'Implement policy to require MFA for admins',
      'Audit MFA disabling logs',
      'Enable conditional access based on MFA status',
    ],
    'default': [
      'Review alert details and timeline',
      'Identify affected users and resources',
      'Check recent activity logs',
      'Verify if activity was authorized',
      'Document findings and actions taken',
      'Monitor for similar patterns',
      'Update detection rules if needed',
    ],
  }

  return actionMap[alert.type] || actionMap['default']
}

export function formatInvestigationTimeline(events) {
  if (!events || events.length === 0) return []

  return events.map(event => ({
    timestamp: event.timestamp ? new Date(event.timestamp).toLocaleTimeString() : 'Unknown',
    type: event.type || 'Unknown',
    description: event.description || '',
    severity: event.severity || 'INFO',
    actionRequired: event.actionRequired || false,
  })).sort((a, b) => {
    if (!a.timestamp || !b.timestamp) return 0
    return new Date(b.timestamp) - new Date(a.timestamp)
  })
}
