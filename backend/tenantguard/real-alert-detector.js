/**
 * Real Alert Detector
 * Maps Graph API events and audit logs to TenantGuard alert definitions
 */

import { P1_ALERTS, P2_ALERTS, P3_ALERTS } from './alert-definitions.js'

// Combine all alerts for easy lookup
const ALL_ALERTS = { ...P1_ALERTS, ...P2_ALERTS, ...P3_ALERTS }

/**
 * Detect alerts from audit logs
 * @param {Array} auditLogs - Directory audit logs from Graph API
 * @returns {Array} Detected alerts
 */
export function detectAlertsFromAuditLogs(auditLogs = []) {
  const detectedAlerts = []

  auditLogs.forEach(log => {
    const activity = log.activity || ''
    const result = log.result || 'success'
    const resources = log.resources || []
    const actor = log.initiatedBy?.user?.id || log.initiatedBy?.app?.id || 'system'

    // Identity & Access - MFA Disabled
    if (activity.includes('Disable') && activity.includes('MFA')) {
      detectedAlerts.push(createAlert(
        ALL_ALERTS.MFA_REQUIREMENT_DISABLED,
        `MFA was disabled by ${actor}`,
        actor,
        'Azure AD'
      ))
    }

    // Identity & Access - Conditional Access Policy Changed
    if (activity.includes('Update conditional access') ||
        activity.includes('Delete conditional access')) {
      detectedAlerts.push(createAlert(
        ALL_ALERTS.CONDITIONAL_ACCESS_POLICY_MODIFIED,
        `Conditional Access policy modified: ${activity}`,
        actor,
        'Entra ID'
      ))
    }

    // Identity & Access - Legacy Authentication
    if (activity.includes('Update user') &&
        (log.additionalDetails?.some(d => d.key === 'OAuthPermission'))) {
      detectedAlerts.push(createAlert(
        ALL_ALERTS.LEGACY_AUTHENTICATION_ALLOWED,
        'Legacy authentication protocol access detected',
        actor,
        'Exchange Online'
      ))
    }

    // Identity & Access - Security Defaults Changed
    if (activity.includes('Update authorization policy') ||
        activity.includes('Security Defaults')) {
      detectedAlerts.push(createAlert(
        ALL_ALERTS.SECURITY_DEFAULTS_CHANGED,
        'Azure AD Security Defaults policy was modified',
        actor,
        'Entra ID'
      ))
    }

    // Identity & Access - Global Admin Role Assignment
    if (activity.includes('Add member') &&
        resources.some(r => r.displayName === 'Global Administrator')) {
      detectedAlerts.push(createAlert(
        ALL_ALERTS.PRIVILEGE_ESCALATION,
        `${actor} assigned Global Administrator role`,
        actor,
        'Azure AD'
      ))
    }

    // Application Security - Service Principal Admin Consent
    if (activity.includes('Consent to application')) {
      detectedAlerts.push(createAlert(
        ALL_ALERTS.SERVICE_PRINCIPAL_ADMIN_CONSENT,
        `Admin consent granted to service principal by ${actor}`,
        actor,
        'Application'
      ))
    }

    // DLP & Compliance - Audit Log Purge
    if (activity.includes('Purge') && activity.includes('audit')) {
      detectedAlerts.push(createAlert(
        ALL_ALERTS.AUDIT_LOG_PURGE,
        'Audit logs were purged from the system',
        actor,
        'Unified Audit Log'
      ))
    }

    // Configuration Drift - Risk-Based Policy Disabled
    if (activity.includes('Disable') && activity.includes('risk')) {
      detectedAlerts.push(createAlert(
        ALL_ALERTS.RISK_BASED_POLICY_DISABLED,
        'Risk-based sign-in policy was disabled',
        actor,
        'Entra ID Protection'
      ))
    }
  })

  return detectedAlerts
}

/**
 * Detect alerts from risk detections (Identity Protection)
 * @param {Array} riskDetections - Risk detections from Graph API
 * @returns {Array} Detected alerts
 */
export function detectAlertsFromRiskDetection(riskDetections = []) {
  const detectedAlerts = []

  riskDetections.forEach(detection => {
    const riskLevel = detection.riskLevel || 'medium'
    const activity = detection.activity || ''
    const userId = detection.userId || 'unknown'

    // High risk detections become P1 alerts
    if (riskLevel === 'high' || riskLevel === 'high') {
      detectedAlerts.push(createAlert(
        ALL_ALERTS.IMPOSSIBLE_TRAVEL,
        `Risk detection: ${activity}. Risk Level: ${riskLevel}`,
        userId,
        'Identity Protection'
      ))
    }

    // Medium risk detections become P2 alerts
    if (riskLevel === 'medium') {
      detectedAlerts.push(createAlert(
        ALL_ALERTS.RISKY_SIGNIN,
        `Medium risk sign-in detected: ${activity}`,
        userId,
        'Identity Protection'
      ))
    }
  })

  return detectedAlerts
}

/**
 * Detect alerts from risky sign-ins
 * @param {Array} signIns - Risky sign-ins from Graph API
 * @returns {Array} Detected alerts
 */
export function detectAlertsFromRiskySignIns(signIns = []) {
  const detectedAlerts = []

  signIns.forEach(signIn => {
    const riskLevel = signIn.riskLevel || 'medium'
    const location = signIn.location || {}
    const userId = signIn.userId || 'unknown'

    detectedAlerts.push(createAlert(
      riskLevel === 'high' ? ALL_ALERTS.IMPOSSIBLE_TRAVEL : ALL_ALERTS.RISKY_SIGNIN,
      `Risky sign-in from ${location.city || 'unknown location'} - Risk: ${riskLevel}`,
      userId,
      'Identity Protection'
    ))
  })

  return detectedAlerts
}

/**
 * Detect alerts from service principal analysis
 * @param {Array} servicePrincipals - Service principals from Graph API
 * @returns {Array} Detected alerts
 */
export function detectAlertsFromServicePrincipals(servicePrincipals = []) {
  const detectedAlerts = []

  servicePrincipals.forEach(sp => {
    // Check for expired credentials
    const credentials = sp.passwordCredentials || []
    credentials.forEach(cred => {
      const endDateTime = new Date(cred.endDateTime)
      const now = new Date()

      if (endDateTime < now) {
        detectedAlerts.push(createAlert(
          ALL_ALERTS.SERVICE_PRINCIPAL_SECRET_EXPIRED,
          `Service principal "${sp.displayName}" has expired credentials`,
          sp.id,
          'Entra ID'
        ))
      }
    })

    // Check for high-privileged app roles
    const appRoles = sp.appRoles || []
    const hasAdminRole = appRoles.some(role =>
      role.allowedMemberTypes?.includes('Application') &&
      (role.value?.includes('Admin') || role.value?.includes('Directory'))
    )

    if (hasAdminRole) {
      detectedAlerts.push(createAlert(
        ALL_ALERTS.HIGH_RISK_OAUTH_APP,
        `Service principal "${sp.displayName}" has high-privilege application roles`,
        sp.id,
        'Application'
      ))
    }
  })

  return detectedAlerts
}

/**
 * Detect alerts from OAuth2 permission grants (consents)
 * @param {Array} grants - OAuth2 permission grants from Graph API
 * @returns {Array} Detected alerts
 */
export function detectAlertsFromOAuthGrants(grants = []) {
  const detectedAlerts = []

  const HIGH_RISK_SCOPES = [
    'Directory.ReadWrite.All',
    'Directory.AccessAsUser.All',
    'Mail.ReadWrite',
    'Mail.Send',
    'Files.ReadWrite.All'
  ]

  grants.forEach(grant => {
    const scopes = grant.scope?.split(' ') || []
    const hasHighRiskScope = scopes.some(scope => HIGH_RISK_SCOPES.includes(scope))

    if (hasHighRiskScope) {
      detectedAlerts.push(createAlert(
        ALL_ALERTS.HIGH_RISK_OAUTH_APP,
        `App granted high-risk permissions: ${scopes.join(', ')}`,
        grant.principalId,
        'Application'
      ))
    }
  })

  return detectedAlerts
}

/**
 * Create an alert object from definition
 * @param {Object} alertDef - Alert definition from alert-definitions.js
 * @param {string} description - Specific description for this instance
 * @param {string} actor - User or service that triggered it
 * @param {string} source - Source system (Azure AD, Exchange, etc.)
 * @returns {Object} Alert object
 */
function createAlert(alertDef, description, actor, source) {
  return {
    id: `alert-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    name: alertDef.name,
    category: alertDef.category,
    priority: alertDef.priority,
    severity: alertDef.severity,
    riskScore: alertDef.riskScore,
    description: description || alertDef.description,
    indicators: alertDef.indicators || [],
    remediation: alertDef.remediation || [],
    actor: actor,
    target: source,
    source: source,
    action_timestamp: new Date().toISOString(),
    dismissed: false,
    raw_event: {}
  }
}

/**
 * Process all Graph API data and detect alerts
 * @param {Object} graphData - Data from Graph API
 * @returns {Array} All detected alerts
 */
export function detectAllAlerts(graphData = {}) {
  const allAlerts = []

  // Process audit logs
  if (graphData.auditLogs?.length > 0) {
    allAlerts.push(...detectAlertsFromAuditLogs(graphData.auditLogs))
  }

  // Process risk detections
  if (graphData.riskDetections?.length > 0) {
    allAlerts.push(...detectAlertsFromRiskDetection(graphData.riskDetections))
  }

  // Process risky sign-ins
  if (graphData.riskySignIns?.length > 0) {
    allAlerts.push(...detectAlertsFromRiskySignIns(graphData.riskySignIns))
  }

  // Process service principals
  if (graphData.servicePrincipals?.length > 0) {
    allAlerts.push(...detectAlertsFromServicePrincipals(graphData.servicePrincipals))
  }

  // Process OAuth grants
  if (graphData.oauthGrants?.length > 0) {
    allAlerts.push(...detectAlertsFromOAuthGrants(graphData.oauthGrants))
  }

  // Remove duplicates by ID
  const uniqueAlerts = Array.from(
    new Map(allAlerts.map(a => [a.id, a])).values()
  )

  console.log(`📊 Detected ${uniqueAlerts.length} unique alerts from Graph API data`)
  return uniqueAlerts
}

export default {
  detectAlertsFromAuditLogs,
  detectAlertsFromRiskDetection,
  detectAlertsFromRiskySignIns,
  detectAlertsFromServicePrincipals,
  detectAlertsFromOAuthGrants,
  detectAllAlerts
}
