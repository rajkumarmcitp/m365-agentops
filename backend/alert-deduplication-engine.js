/**
 * Alert Deduplication & Throttling Engine
 * Reduces alert fatigue through intelligent grouping and rate-limiting
 */

/**
 * Generate fingerprint for alert based on key characteristics
 */
export function generateAlertFingerprint(alert) {
  const parts = [
    alert.type || 'unknown',
    alert.actor || 'unknown',
    alert.source || 'unknown',
    // Include headline keywords for pattern matching
    (alert.headline || '').split(/\s+/).slice(0, 3).join('_'),
    alert.severity ? alert.severity[0] : 'M' // First letter of severity
  ]

  return parts.filter(p => p && p !== 'unknown').join(':')
}

/**
 * Calculate similarity score between two alerts (0-100)
 */
export function calculateSimilarity(alert1, alert2) {
  let score = 0
  const maxScore = 100

  // Type match (40 points)
  if (alert1.type === alert2.type) {
    score += 40
  } else if (isSimilarType(alert1.type, alert2.type)) {
    score += 20
  }

  // Actor match (30 points)
  if (alert1.actor === alert2.actor) {
    score += 30
  }

  // Severity match (15 points)
  if (alert1.severity === alert2.severity) {
    score += 15
  } else if (isSimilarSeverity(alert1.severity, alert2.severity)) {
    score += 8
  }

  // Source match (15 points)
  if (alert1.source === alert2.source) {
    score += 15
  }

  // Time proximity (5 points - if within 5 minutes)
  if (alert1.timestamp && alert2.timestamp) {
    const timeDiff = Math.abs(
      new Date(alert1.timestamp).getTime() - new Date(alert2.timestamp).getTime()
    ) / 1000 / 60 // minutes

    if (timeDiff < 5) {
      score += 5
    }
  }

  return Math.min(score, maxScore)
}

/**
 * Check if two alert types are similar
 */
function isSimilarType(type1, type2) {
  if (!type1 || !type2) return false

  // Group related types
  const typeGroups = {
    login: ['login', 'signin', 'authentication', 'logon'],
    access: ['file_access', 'resource_access', 'data_access', 'download'],
    permission: ['permission_change', 'role_change', 'privilege_escalation', 'grant'],
    group: ['group_modified', 'group_changed', 'membership_change'],
    delete: ['delete', 'deletion', 'removal', 'purge']
  }

  for (const [group, types] of Object.entries(typeGroups)) {
    if (types.includes(type1) && types.includes(type2)) {
      return true
    }
  }

  return false
}

/**
 * Check if two severities are similar
 */
function isSimilarSeverity(sev1, sev2) {
  const severityOrder = { 'CRITICAL': 4, 'HIGH': 3, 'MEDIUM': 2, 'LOW': 1 }
  const val1 = severityOrder[sev1] || 2
  const val2 = severityOrder[sev2] || 2

  return Math.abs(val1 - val2) <= 1
}

/**
 * Find similar alerts in a collection
 */
export function findDuplicateGroup(alert, recentAlerts, threshold = 70) {
  if (!recentAlerts || recentAlerts.length === 0) {
    return {
      isDuplicate: false,
      groupId: null,
      similarAlerts: [],
      maxSimilarity: 0
    }
  }

  const similar = recentAlerts
    .map(existing => ({
      alert: existing,
      similarity: calculateSimilarity(alert, existing)
    }))
    .filter(item => item.similarity >= threshold)
    .sort((a, b) => b.similarity - a.similarity)

  if (similar.length === 0) {
    return {
      isDuplicate: false,
      groupId: null,
      similarAlerts: [],
      maxSimilarity: 0
    }
  }

  return {
    isDuplicate: true,
    groupId: similar[0].alert.groupId || similar[0].alert.id,
    similarAlerts: similar.map(s => ({
      id: s.alert.id,
      similarity: s.similarity,
      timestamp: s.alert.timestamp
    })),
    maxSimilarity: similar[0].similarity
  }
}

/**
 * Create deduplication summary from alert group
 */
export function createDeduplicationSummary(originalAlert, duplicateAlerts) {
  return {
    groupId: originalAlert.id,
    originalAlert: originalAlert,
    duplicateCount: duplicateAlerts.length,
    timeSpan: calculateTimeSpan(duplicateAlerts),
    actors: [...new Set(duplicateAlerts.map(a => a.actor))],
    sources: [...new Set(duplicateAlerts.map(a => a.source))],
    summary: `${duplicateAlerts.length + 1} similar alert(s) detected`
  }
}

/**
 * Calculate time span of alerts (start to end in seconds)
 */
function calculateTimeSpan(alerts) {
  if (alerts.length === 0) return 0

  const timestamps = alerts.map(a => new Date(a.timestamp).getTime()).sort((a, b) => a - b)
  return (timestamps[timestamps.length - 1] - timestamps[0]) / 1000
}

/**
 * Evaluate throttle policy for alert
 */
export function evaluateThrottlePolicy(alert, policy) {
  if (!policy || !policy.enabled) {
    return {
      shouldThrottle: false,
      reason: null,
      nextAllowed: null
    }
  }

  const now = Date.now()

  // Check time window
  if (!policy.timeWindowMinutes) {
    return {
      shouldThrottle: false,
      reason: null,
      nextAllowed: null
    }
  }

  const windowMs = policy.timeWindowMinutes * 60 * 1000

  // Check alert type match
  if (policy.alertTypes && policy.alertTypes.length > 0) {
    if (!policy.alertTypes.includes(alert.type) && !policy.alertTypes.includes('*')) {
      return {
        shouldThrottle: false,
        reason: null,
        nextAllowed: null
      }
    }
  }

  // Check actor match
  if (policy.actors && policy.actors.length > 0) {
    if (!policy.actors.includes(alert.actor) && !policy.actors.includes('*')) {
      return {
        shouldThrottle: false,
        reason: null,
        nextAllowed: null
      }
    }
  }

  // Check severity match
  if (policy.minSeverity) {
    if (!meetsMinSeverity(alert.severity, policy.minSeverity)) {
      return {
        shouldThrottle: false,
        reason: null,
        nextAllowed: null
      }
    }
  }

  // Policy matched - should throttle
  return {
    shouldThrottle: true,
    reason: `Matched throttle policy: ${policy.name}`,
    nextAllowed: new Date(now + windowMs).toISOString(),
    throttleType: policy.throttleType || 'rate_limit'
  }
}

/**
 * Check if alert meets minimum severity
 */
function meetsMinSeverity(alertSeverity, minSeverity) {
  const severityOrder = { 'CRITICAL': 4, 'HIGH': 3, 'MEDIUM': 2, 'LOW': 1 }
  const alertVal = severityOrder[alertSeverity] || 2
  const minVal = severityOrder[minSeverity] || 2
  return alertVal >= minVal
}

/**
 * Calculate throttle rate statistics
 */
export function calculateThrottleStats(alerts, policies) {
  if (!alerts || alerts.length === 0) {
    return {
      totalAlerts: 0,
      throttledAlerts: 0,
      deduplicatedAlerts: 0,
      throttleRate: 0,
      alertsPerMinute: 0,
      peakAlertCount: 0,
      throttlingSavings: 0
    }
  }

  let throttledCount = 0
  let deduplicatedCount = 0

  alerts.forEach(alert => {
    if (alert.throttled) throttledCount++
    if (alert.isDuplicate) deduplicatedCount++
  })

  // Calculate alerts per minute
  if (alerts.length > 1) {
    const timestamps = alerts
      .map(a => new Date(a.timestamp).getTime())
      .sort((a, b) => a - b)
    const timeSpanMs = timestamps[timestamps.length - 1] - timestamps[0]
    const timeSpanMinutes = Math.max(1, timeSpanMs / 1000 / 60)
    var alertsPerMinute = (alerts.length / timeSpanMinutes).toFixed(2)
  } else {
    var alertsPerMinute = 1
  }

  return {
    totalAlerts: alerts.length,
    throttledAlerts: throttledCount,
    deduplicatedAlerts: deduplicatedCount,
    throttleRate: Math.round((throttledCount / alerts.length) * 100),
    dedupRate: Math.round((deduplicatedCount / alerts.length) * 100),
    alertsPerMinute: parseFloat(alertsPerMinute),
    policiesActive: policies ? policies.filter(p => p.enabled).length : 0,
    throttlingSavings: (throttledCount + deduplicatedCount)
  }
}

/**
 * Group alerts by fingerprint
 */
export function groupAlertsByFingerprint(alerts) {
  const groups = {}

  alerts.forEach(alert => {
    const fingerprint = generateAlertFingerprint(alert)
    if (!groups[fingerprint]) {
      groups[fingerprint] = {
        fingerprint,
        count: 0,
        alerts: [],
        timeSpan: 0,
        severity: alert.severity,
        type: alert.type
      }
    }

    groups[fingerprint].alerts.push(alert)
    groups[fingerprint].count++
  })

  // Calculate time spans
  Object.values(groups).forEach(group => {
    if (group.alerts.length > 1) {
      group.timeSpan = calculateTimeSpan(group.alerts.slice(1))
    }
  })

  return groups
}

/**
 * Generate deduplication recommendation
 */
export function generateDeduplicationRecommendation(alertGroups) {
  const recommendations = []

  Object.entries(alertGroups).forEach(([fingerprint, group]) => {
    if (group.count > 5) {
      recommendations.push({
        fingerprint,
        type: 'high_frequency',
        priority: 'HIGH',
        message: `Alert type "${group.type}" generated ${group.count} instances in short timeframe`,
        action: `Create throttle policy for ${group.type} with 10-minute window`,
        potentialSavings: group.count - 1
      })
    }

    if (group.timeSpan < 300 && group.count > 3) {
      // 3+ alerts in 5 minutes
      recommendations.push({
        fingerprint,
        type: 'burst',
        priority: 'MEDIUM',
        message: `Burst of ${group.count} similar alerts in ${Math.round(group.timeSpan)} seconds`,
        action: `Enable rate limiting for ${group.type}`,
        potentialSavings: Math.floor(group.count / 2)
      })
    }
  })

  return recommendations
}
