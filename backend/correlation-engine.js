/**
 * Alert Correlation Engine
 * Analyzes alerts to detect related events and attack patterns
 */

const CORRELATION_RULES = {
  // Time-based correlation: alerts within 5 minutes
  TIME_WINDOW_MS: 5 * 60 * 1000,

  // Type-based correlation weights
  SAME_TYPE_WEIGHT: 0.9,
  SAME_USER_WEIGHT: 0.8,
  SAME_ASSET_WEIGHT: 0.7,
  SAME_SEVERITY_WEIGHT: 0.5,
  TIME_PROXIMITY_WEIGHT: 0.6,

  // Minimum correlation score to group alerts
  CORRELATION_THRESHOLD: 0.65,

  // Known attack patterns (sequences of alert types)
  ATTACK_PATTERNS: {
    'CREDENTIAL_COMPROMISE': [
      'impossible_travel',
      'unusual_signin',
      'compromised_credentials'
    ],
    'PRIVILEGE_ESCALATION': [
      'permission_escalation',
      'role_assignment',
      'admin_activity'
    ],
    'DATA_EXFILTRATION': [
      'mailbox_forwarding',
      'forwarding_rule',
      'data_download',
      'external_sharing'
    ],
    'ACCOUNT_TAKEOVER': [
      'mfa_disabled',
      'password_changed',
      'impossible_travel',
      'unusual_signin'
    ]
  }
}

/**
 * Calculate correlation score between two alerts
 */
export function calculateCorrelationScore(alert1, alert2) {
  let score = 0
  const timeGap = Math.abs(
    new Date(alert1.timestamp).getTime() -
    new Date(alert2.timestamp).getTime()
  )

  // Same alert type
  if (alert1.type === alert2.type) {
    score += CORRELATION_RULES.SAME_TYPE_WEIGHT
  }

  // Same user/actor
  if (alert1.actor === alert2.actor) {
    score += CORRELATION_RULES.SAME_USER_WEIGHT
  }

  // Same severity
  if (alert1.severity === alert2.severity) {
    score += CORRELATION_RULES.SAME_SEVERITY_WEIGHT
  }

  // Time proximity (recent alerts correlate stronger)
  if (timeGap < CORRELATION_RULES.TIME_WINDOW_MS) {
    const timeProximity = 1 - timeGap / CORRELATION_RULES.TIME_WINDOW_MS
    score += CORRELATION_RULES.TIME_PROXIMITY_WEIGHT * timeProximity
  }

  // Normalize score to 0-1
  return Math.min(score / 4, 1)
}

/**
 * Detect known attack patterns
 */
export function detectAttackPatterns(alerts) {
  const detectedPatterns = []

  for (const [patternName, alertTypeSequence] of Object.entries(
    CORRELATION_RULES.ATTACK_PATTERNS
  )) {
    // Sort alerts by timestamp
    const sortedAlerts = [...alerts].sort(
      (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
    )

    // Check if alert sequence matches pattern
    let matchCount = 0
    for (const expectedType of alertTypeSequence) {
      const foundAlert = sortedAlerts.find(
        a => a.type === expectedType && sortedAlerts.indexOf(a) >= matchCount
      )
      if (foundAlert) {
        matchCount++
      }
    }

    // If at least 50% of pattern matched, consider it detected
    const matchPercentage = matchCount / alertTypeSequence.length
    if (matchPercentage >= 0.5) {
      detectedPatterns.push({
        pattern: patternName,
        matchPercentage: Math.round(matchPercentage * 100),
        severity: matchPercentage >= 0.75 ? 'CRITICAL' : 'HIGH',
        matchedAlerts: sortedAlerts.slice(0, matchCount)
      })
    }
  }

  return detectedPatterns
}

/**
 * Group alerts into incidents based on correlation
 */
export function groupAlertsIntoIncidents(alerts) {
  if (!alerts || alerts.length === 0) {
    return []
  }

  const incidents = []
  const processedAlerts = new Set()

  for (const alert of alerts) {
    if (processedAlerts.has(alert.id)) continue

    // Start new incident with this alert
    const incident = {
      id: `incident-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date().toISOString(),
      alerts: [alert],
      status: 'NEW',
      severity: alert.severity,
      type: 'CORRELATED',
      primaryActor: alert.actor,
      correlationReason: ['Initial alert'],
      attackPatterns: []
    }

    processedAlerts.add(alert.id)

    // Find correlated alerts
    for (const otherAlert of alerts) {
      if (processedAlerts.has(otherAlert.id)) continue

      const correlationScore = calculateCorrelationScore(alert, otherAlert)

      if (correlationScore >= CORRELATION_RULES.CORRELATION_THRESHOLD) {
        incident.alerts.push(otherAlert)
        processedAlerts.add(otherAlert.id)

        // Add correlation reason
        const reasons = []
        if (alert.type === otherAlert.type) reasons.push('Same alert type')
        if (alert.actor === otherAlert.actor) reasons.push('Same user')
        if (alert.severity === otherAlert.severity) reasons.push('Same severity')
        incident.correlationReason.push(
          `${otherAlert.id}: ${reasons.join(', ')} (Score: ${(correlationScore * 100).toFixed(0)}%)`
        )

        // Update incident severity if needed
        const severityOrder = { CRITICAL: 3, HIGH: 2, MEDIUM: 1, LOW: 0 }
        if ((severityOrder[otherAlert.severity] || 0) > (severityOrder[incident.severity] || 0)) {
          incident.severity = otherAlert.severity
        }
      }
    }

    // Detect attack patterns in this incident
    incident.attackPatterns = detectAttackPatterns(incident.alerts)

    // Calculate incident risk score
    incident.riskScore = calculateIncidentRiskScore(incident)

    incidents.push(incident)
  }

  return incidents.sort((a, b) => b.riskScore - a.riskScore)
}

/**
 * Calculate risk score for an incident
 */
export function calculateIncidentRiskScore(incident) {
  let score = 0

  // Base score on severity
  const severityScores = { CRITICAL: 90, HIGH: 70, MEDIUM: 50, LOW: 30 }
  score += severityScores[incident.severity] || 30

  // Increase score by number of correlated alerts
  score += Math.min(incident.alerts.length * 5, 30)

  // Increase score if attack pattern detected
  if (incident.attackPatterns && incident.attackPatterns.length > 0) {
    score += 20
  }

  return Math.min(score, 100)
}

/**
 * Analyze incident timeline
 */
export function analyzeIncidentTimeline(incident) {
  if (!incident.alerts || incident.alerts.length === 0) {
    return {}
  }

  const sortedAlerts = [...incident.alerts].sort(
    (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
  )

  const firstAlert = sortedAlerts[0]
  const lastAlert = sortedAlerts[sortedAlerts.length - 1]

  const timeSpanMs = new Date(lastAlert.timestamp).getTime() - new Date(firstAlert.timestamp).getTime()

  let duration = 'Just now'
  if (timeSpanMs >= 1000) {
    const seconds = Math.floor(timeSpanMs / 1000)
    const minutes = Math.floor(seconds / 60)
    const hours = Math.floor(minutes / 60)
    const days = Math.floor(hours / 24)

    if (days > 0) duration = `${days}d ${hours % 24}h`
    else if (hours > 0) duration = `${hours}h ${minutes % 60}m`
    else if (minutes > 0) duration = `${minutes}m ${seconds % 60}s`
    else duration = `${seconds}s`
  }

  return {
    startTime: firstAlert.timestamp,
    endTime: lastAlert.timestamp,
    duration,
    alertCount: incident.alerts.length,
    timeline: sortedAlerts.map((alert, idx) => ({
      sequence: idx + 1,
      type: alert.type,
      timestamp: alert.timestamp,
      actor: alert.actor,
      severity: alert.severity,
      headline: alert.headline
    }))
  }
}

/**
 * Generate incident summary
 */
export function generateIncidentSummary(incident) {
  const timeline = analyzeIncidentTimeline(incident)
  const actors = [...new Set(incident.alerts.map(a => a.actor))]
  const alertTypes = [...new Set(incident.alerts.map(a => a.type))]

  let summary = `Incident detected with ${incident.alerts.length} correlated alert(s). `
  summary += `Duration: ${timeline.duration}. `
  summary += `Actors involved: ${actors.join(', ')}. `
  summary += `Alert types: ${alertTypes.join(', ')}.`

  if (incident.attackPatterns && incident.attackPatterns.length > 0) {
    summary += ` Detected patterns: ${incident.attackPatterns.map(p => p.pattern).join(', ')}.`
  }

  return summary
}
