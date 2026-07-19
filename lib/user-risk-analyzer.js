/**
 * User Risk Analyzer
 * Analyzes user behavior and recommends policy changes
 */

export function analyzeUserRisks(alerts) {
  const userRisks = {}

  alerts.forEach(alert => {
    const actor = alert?.actor || 'System'
    if (!userRisks[actor]) {
      userRisks[actor] = {
        actor,
        alertCount: 0,
        criticalAlerts: 0,
        riskScore: 0,
        alerts: [],
        policyGaps: [],
        lastAlertTime: null
      }
    }

    const userProfile = userRisks[actor]
    userProfile.alertCount++
    userProfile.alerts.push(alert)

    if (alert?.severity === 'CRITICAL') {
      userProfile.criticalAlerts++
    }

    if (!userProfile.lastAlertTime || new Date(alert?.timestamp) > new Date(userProfile.lastAlertTime)) {
      userProfile.lastAlertTime = alert?.timestamp
    }
  })

  // Calculate risk scores and identify policy gaps
  Object.values(userRisks).forEach(profile => {
    profile.riskScore = calculateUserRiskScore(profile)
    profile.policyGaps = identifyPolicyGaps(profile)
  })

  return Object.values(userRisks).sort((a, b) => b.riskScore - a.riskScore)
}

function calculateUserRiskScore(userProfile) {
  let score = 0

  // Alert count component (0-30)
  score += Math.min(userProfile.alertCount * 3, 30)

  // Critical alert component (0-40)
  score += Math.min(userProfile.criticalAlerts * 8, 40)

  // Recency component (0-30) - recent activity scores higher
  if (userProfile.lastAlertTime) {
    const now = new Date()
    const lastAlert = new Date(userProfile.lastAlertTime)
    const hoursOld = (now - lastAlert) / (1000 * 60 * 60)

    if (hoursOld < 1) score += 30
    else if (hoursOld < 24) score += 25
    else if (hoursOld < 72) score += 15
    else if (hoursOld < 168) score += 8
    else score += 2
  }

  return Math.min(Math.max(Math.round(score), 0), 100)
}

function identifyPolicyGaps(userProfile) {
  const gaps = []
  const alertTypes = userProfile.alerts.map(a => a?.type).join('|')
  const alertSeverities = userProfile.alerts.map(a => a?.severity)

  // Analyze alert types for policy gaps
  if (alertTypes.includes('mfa_disabled')) {
    gaps.push({
      policy: 'Authentication Policies',
      gap: 'MFA not enforced',
      risk: 'CRITICAL',
      recommendation: 'Enable MFA requirement for this user'
    })
  }

  if (alertTypes.includes('impossible_travel') || alertTypes.includes('risky_signin')) {
    gaps.push({
      policy: 'Conditional Access',
      gap: 'No geographic or risk-based access controls',
      risk: 'HIGH',
      recommendation: 'Enable Conditional Access policies based on location/risk'
    })
  }

  if (alertTypes.includes('forwarding_rule') || alertTypes.includes('data_exfiltration')) {
    gaps.push({
      policy: 'Data Loss Prevention',
      gap: 'No DLP policies for email forwarding or data downloads',
      risk: 'HIGH',
      recommendation: 'Implement DLP policy to block external forwarding'
    })
  }

  if (alertTypes.includes('permission_escalation')) {
    gaps.push({
      policy: 'Privileged Access Management',
      gap: 'No approval workflow for role assignments',
      risk: 'HIGH',
      recommendation: 'Enable PIM approval workflow for privileged roles'
    })
  }

  if (alertTypes.includes('oauth_compromise')) {
    gaps.push({
      policy: 'Application Consent',
      gap: 'User can grant app permissions without review',
      risk: 'MEDIUM',
      recommendation: 'Restrict user consent, require admin approval'
    })
  }

  // Check for high alert frequency
  if (userProfile.alertCount >= 5) {
    gaps.push({
      policy: 'Account Management',
      gap: 'High alert frequency suggests compromised or suspicious account',
      risk: 'CRITICAL',
      recommendation: 'Isolate account, reset password, enable monitoring'
    })
  }

  // Check for multiple critical alerts
  if (userProfile.criticalAlerts >= 2) {
    gaps.push({
      policy: 'Incident Response',
      gap: 'Multiple critical incidents suggest active attack',
      risk: 'CRITICAL',
      recommendation: 'Escalate to incident response team immediately'
    })
  }

  return gaps
}

export function getUserBehaviorSummary(userProfile) {
  const summary = []

  if (userProfile.alertCount === 0) {
    return ['✅ No security incidents detected']
  }

  if (userProfile.criticalAlerts > 0) {
    summary.push(`🔴 ${userProfile.criticalAlerts} critical incident(s)`)
  }

  if (userProfile.alertCount > 5) {
    summary.push(`⚠️ High frequency (${userProfile.alertCount} alerts)`)
  } else if (userProfile.alertCount > 0) {
    summary.push(`📊 ${userProfile.alertCount} total alert(s)`)
  }

  // Check alert types
  const alertTypes = new Set(userProfile.alerts.map(a => a?.type))
  if (alertTypes.has('mfa_disabled')) summary.push('🚫 MFA disabled')
  if (alertTypes.has('impossible_travel')) summary.push('🌍 Impossible travel')
  if (alertTypes.has('forwarding_rule')) summary.push('📧 Email forwarding')
  if (alertTypes.has('permission_escalation')) summary.push('📈 Privilege escalation')
  if (alertTypes.has('compromised_credentials')) summary.push('🔓 Credentials compromised')

  return summary.length > 0 ? summary : ['✓ Status under review']
}

export function getRiskColor(riskScore) {
  if (riskScore >= 80) return '#d32f2f' // CRITICAL red
  if (riskScore >= 60) return '#f57c00' // HIGH orange
  if (riskScore >= 40) return '#1976d2' // MEDIUM blue
  return '#388e3c' // LOW green
}

export function getRiskLevel(riskScore) {
  if (riskScore >= 80) return 'CRITICAL'
  if (riskScore >= 60) return 'HIGH'
  if (riskScore >= 40) return 'MEDIUM'
  return 'LOW'
}
