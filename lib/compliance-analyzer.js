/**
 * Compliance Analyzer
 * Analyzes Zero Trust compliance gaps and generates remediation recommendations
 */

export function analyzeComplianceGaps(alerts, frameworkData) {
  const gaps = []
  const alertTypes = new Set(alerts.map(a => a?.type))

  // Authentication & MFA Gaps
  if (alertTypes.has('mfa_disabled') || alertTypes.some(t => t?.includes('compromised'))) {
    gaps.push({
      category: 'Authentication',
      control: 'Multifactor Authentication',
      status: 'AT RISK',
      severity: 'CRITICAL',
      finding: 'MFA incidents detected - not consistently enforced',
      recommendation: 'Require MFA for all users, especially privileged accounts',
      effort: 'Medium',
      impact: 'High - Prevents 99% of account takeovers'
    })
  }

  // Conditional Access Gaps
  if (alertTypes.has('conditional_access_disabled') || alertTypes.has('impossible_travel')) {
    gaps.push({
      category: 'Access Control',
      control: 'Conditional Access Policies',
      status: 'AT RISK',
      severity: 'CRITICAL',
      finding: 'Conditional Access policies missing or disabled',
      recommendation: 'Implement CA policies for risk-based access decisions',
      effort: 'Medium',
      impact: 'High - Blocks risky sign-ins automatically'
    })
  }

  // Data Protection Gaps
  if (alertTypes.has('data_exfiltration') || alertTypes.has('forwarding_rule')) {
    gaps.push({
      category: 'Data Protection',
      control: 'Data Loss Prevention',
      status: 'AT RISK',
      severity: 'HIGH',
      finding: 'Data exfiltration or unauthorized sharing detected',
      recommendation: 'Enable DLP policies for email, SharePoint, and OneDrive',
      effort: 'High',
      impact: 'High - Prevents sensitive data leakage'
    })
  }

  // Privilege Management Gaps
  if (alertTypes.has('permission_escalation') || alertTypes.has('mfa_disabled')) {
    gaps.push({
      category: 'Privilege Management',
      control: 'Privileged Access Management',
      status: 'AT RISK',
      severity: 'CRITICAL',
      finding: 'Unauthorized privilege escalation or weak admin controls',
      recommendation: 'Implement PIM with approval workflows for admin roles',
      effort: 'High',
      impact: 'High - Prevents privilege abuse'
    })
  }

  // Application Security Gaps
  if (alertTypes.has('oauth_compromise')) {
    gaps.push({
      category: 'Application Security',
      control: 'Application Consent Controls',
      status: 'AT RISK',
      severity: 'HIGH',
      finding: 'Unauthorized app permissions or compromised applications',
      recommendation: 'Require admin consent for app permissions',
      effort: 'Low',
      impact: 'Medium - Prevents app-based breaches'
    })
  }

  // Infrastructure Gaps (based on alert volume)
  if (alerts.length > 10) {
    gaps.push({
      category: 'Infrastructure',
      control: 'Monitoring & Logging',
      status: 'AT RISK',
      severity: 'MEDIUM',
      finding: 'High volume of security alerts suggests monitoring gaps',
      recommendation: 'Enable comprehensive audit logging and alerting',
      effort: 'Low',
      impact: 'Medium - Enables faster threat detection'
    })
  }

  return gaps
}

export function calculateComplianceScore(alerts, controls) {
  // Each control contributes to overall compliance score
  const controlScores = {
    'Authentication': 20,
    'Access Control': 20,
    'Data Protection': 20,
    'Privilege Management': 20,
    'Application Security': 10,
    'Infrastructure': 10
  }

  let score = 100
  const alertTypes = new Set(alerts.map(a => a?.type))

  // Deduct points based on alert types (severity-weighted)
  if (alertTypes.has('mfa_disabled')) score -= 15
  if (alertTypes.has('conditional_access_disabled')) score -= 15
  if (alertTypes.has('permission_escalation')) score -= 12
  if (alertTypes.has('data_exfiltration')) score -= 10
  if (alertTypes.has('forwarding_rule')) score -= 8
  if (alertTypes.has('oauth_compromise')) score -= 8
  if (alertTypes.has('compromised_credentials')) score -= 10

  // Deduct for high alert volume
  if (alerts.length > 5) score -= Math.min((alerts.length - 5) * 2, 10)

  return Math.max(Math.round(score), 0)
}

export function getComplianceLevel(score) {
  if (score >= 90) return 'COMPLIANT'
  if (score >= 70) return 'PARTIALLY COMPLIANT'
  if (score >= 50) return 'NON-COMPLIANT'
  return 'CRITICAL'
}

export function getComplianceColor(level) {
  const colors = {
    'COMPLIANT': '#388e3c',
    'PARTIALLY COMPLIANT': '#f57c00',
    'NON-COMPLIANT': '#d32f2f',
    'CRITICAL': '#c62828'
  }
  return colors[level] || '#666'
}

export function getRemediationPriority(gaps) {
  return gaps.sort((a, b) => {
    const severityOrder = { 'CRITICAL': 0, 'HIGH': 1, 'MEDIUM': 2, 'LOW': 3 }
    return severityOrder[a.severity] - severityOrder[b.severity]
  })
}

export function generateRemediationRoadmap(gaps) {
  const roadmap = {
    immediate: gaps.filter(g => g.severity === 'CRITICAL' && g.effort === 'Low'),
    short_term: gaps.filter(g => g.severity === 'CRITICAL' && g.effort !== 'Low'),
    medium_term: gaps.filter(g => g.severity === 'HIGH'),
    long_term: gaps.filter(g => g.severity === 'MEDIUM' || g.severity === 'LOW')
  }

  return roadmap
}

export function getComplianceMetrics(alerts) {
  const metrics = {
    totalAlerts: alerts.length,
    criticalAlerts: alerts.filter(a => a?.severity === 'CRITICAL').length,
    affectedUsers: new Set(alerts.map(a => a?.actor)).size,
    alertTypes: new Set(alerts.map(a => a?.type)).size,
    lastIncident: alerts.length > 0 ? new Date(Math.max(...alerts.map(a => new Date(a?.timestamp)))).toLocaleString() : 'N/A'
  }

  return metrics
}

export function generateComplianceReport(alerts, frameworkData) {
  const gaps = analyzeComplianceGaps(alerts, frameworkData)
  const score = calculateComplianceScore(alerts, frameworkData)
  const level = getComplianceLevel(score)
  const roadmap = generateRemediationRoadmap(gaps)
  const metrics = getComplianceMetrics(alerts)

  return {
    reportDate: new Date().toISOString(),
    overallScore: score,
    complianceLevel: level,
    metrics,
    gaps: gaps,
    roadmap: roadmap,
    recommendations: gaps.slice(0, 5).map(g => g.recommendation)
  }
}
