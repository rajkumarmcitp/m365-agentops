/**
 * Machine Learning Anomaly Detection Engine
 * Detects unusual patterns in user behavior, login patterns, and system activity
 */

/**
 * Calculate statistical baseline from historical data
 */
export function calculateBaseline(historicalAlerts) {
  if (!historicalAlerts || historicalAlerts.length === 0) {
    return null
  }

  const metrics = {
    userActivity: {},
    timeOfDay: {},
    severity: [],
    alertTypes: {},
    locations: {},
    deviceTypes: {},
    totalAlerts: historicalAlerts.length
  }

  // Analyze activity patterns
  historicalAlerts.forEach(alert => {
    const user = alert.actor || 'unknown'
    const hour = new Date(alert.timestamp).getHours()
    const type = alert.type || 'unknown'
    const location = alert.location || 'unknown'
    const device = alert.device || 'unknown'

    // User activity frequency
    metrics.userActivity[user] = (metrics.userActivity[user] || 0) + 1

    // Time of day patterns
    metrics.timeOfDay[hour] = (metrics.timeOfDay[hour] || 0) + 1

    // Severity distribution
    metrics.severity.push(alert.severity || 'MEDIUM')

    // Alert type frequency
    metrics.alertTypes[type] = (metrics.alertTypes[type] || 0) + 1

    // Location frequency
    metrics.locations[location] = (metrics.locations[location] || 0) + 1

    // Device type frequency
    metrics.deviceTypes[device] = (metrics.deviceTypes[device] || 0) + 1
  })

  // Calculate statistics
  const severityStats = calculateDistribution(metrics.severity)

  return {
    timestamp: new Date().toISOString(),
    dataPoints: historicalAlerts.length,
    averageAlertsPerUser: historicalAlerts.length / Object.keys(metrics.userActivity).length,
    averageAlertsPerHour: historicalAlerts.length / 24,
    userActivity: metrics.userActivity,
    timeOfDay: metrics.timeOfDay,
    severityDistribution: severityStats,
    alertTypes: metrics.alertTypes,
    locations: metrics.locations,
    deviceTypes: metrics.deviceTypes,
    peakHours: getPeakHours(metrics.timeOfDay),
    commonUsers: getMostCommon(metrics.userActivity, 5),
    commonTypes: getMostCommon(metrics.alertTypes, 5),
    commonLocations: getMostCommon(metrics.locations, 5)
  }
}

/**
 * Detect anomalies in an alert using z-score and isolation techniques
 */
export function detectAnomalies(alert, baseline) {
  if (!baseline) {
    return {
      isAnomaly: false,
      anomalyScore: 0,
      reasons: ['No baseline available']
    }
  }

  const reasons = []
  let anomalyScore = 0
  const anomalyScores = []

  // 1. User activity anomaly
  const userAnomalies = detectUserActivityAnomaly(alert, baseline)
  if (userAnomalies.isAnomaly) {
    reasons.push(userAnomalies.reason)
    anomalyScores.push(userAnomalies.score)
  }

  // 2. Time-based anomaly
  const timeAnomalies = detectTimeBasedAnomaly(alert, baseline)
  if (timeAnomalies.isAnomaly) {
    reasons.push(timeAnomalies.reason)
    anomalyScores.push(timeAnomalies.score)
  }

  // 3. Severity anomaly
  const severityAnomalies = detectSeverityAnomaly(alert, baseline)
  if (severityAnomalies.isAnomaly) {
    reasons.push(severityAnomalies.reason)
    anomalyScores.push(severityAnomalies.score)
  }

  // 4. Alert type anomaly
  const typeAnomalies = detectTypeAnomaly(alert, baseline)
  if (typeAnomalies.isAnomaly) {
    reasons.push(typeAnomalies.reason)
    anomalyScores.push(typeAnomalies.score)
  }

  // 5. Location anomaly
  const locationAnomalies = detectLocationAnomaly(alert, baseline)
  if (locationAnomalies.isAnomaly) {
    reasons.push(locationAnomalies.reason)
    anomalyScores.push(locationAnomalies.score)
  }

  // 6. Device anomaly
  const deviceAnomalies = detectDeviceAnomaly(alert, baseline)
  if (deviceAnomalies.isAnomaly) {
    reasons.push(deviceAnomalies.reason)
    anomalyScores.push(deviceAnomalies.score)
  }

  // Calculate composite anomaly score (average of detected anomalies)
  if (anomalyScores.length > 0) {
    anomalyScore = Math.round(anomalyScores.reduce((a, b) => a + b, 0) / anomalyScores.length)
  }

  return {
    isAnomaly: anomalyScore > 60,
    anomalyScore,
    anomalyCount: reasons.length,
    reasons,
    timestamp: new Date().toISOString(),
    analysis: {
      userAnomaly: userAnomalies,
      timeAnomaly: timeAnomalies,
      severityAnomaly: severityAnomalies,
      typeAnomaly: typeAnomalies,
      locationAnomaly: locationAnomalies,
      deviceAnomaly: deviceAnomalies
    }
  }
}

/**
 * Detect user activity anomaly
 */
function detectUserActivityAnomaly(alert, baseline) {
  const user = alert.actor || 'unknown'
  const userCount = baseline.userActivity[user] || 0
  const avgPerUser = baseline.averageAlertsPerUser

  if (userCount === 0) {
    return {
      isAnomaly: true,
      score: 85,
      reason: `New user "${user}" not in historical baseline`
    }
  }

  // Calculate z-score
  const userFrequency = userCount / baseline.dataPoints
  const expectedFrequency = avgPerUser / baseline.dataPoints
  const standardDev = Math.sqrt(expectedFrequency * (1 - expectedFrequency))

  if (standardDev === 0) {
    return { isAnomaly: false, score: 0, reason: null }
  }

  const zScore = Math.abs((userFrequency - expectedFrequency) / standardDev)

  if (zScore > 3) {
    return {
      isAnomaly: true,
      score: Math.min(100, zScore * 15),
      reason: `User activity anomaly: "${user}" has unusual alert frequency (z-score: ${zScore.toFixed(2)})`
    }
  }

  return { isAnomaly: false, score: 0, reason: null }
}

/**
 * Detect time-based anomaly
 */
function detectTimeBasedAnomaly(alert, baseline) {
  const alertTime = new Date(alert.timestamp)
  const hour = alertTime.getHours()
  const dayOfWeek = alertTime.getDay()

  const hourCount = baseline.timeOfDay[hour] || 0
  const peakHours = baseline.peakHours || []

  // Weekend activity
  const isWeekend = dayOfWeek === 0 || dayOfWeek === 6
  if (isWeekend && hourCount < baseline.averageAlertsPerHour / 2) {
    return {
      isAnomaly: true,
      score: 60,
      reason: `Alert on weekend at unusual hour (${hour}:00) with low baseline activity`
    }
  }

  // Off-peak hours
  if (!peakHours.includes(hour) && hourCount === 0) {
    return {
      isAnomaly: true,
      score: 50,
      reason: `Alert during off-peak hour (${hour}:00) with no historical activity`
    }
  }

  // Very unusual hours (2-5 AM)
  if (hour >= 2 && hour <= 5) {
    return {
      isAnomaly: true,
      score: 45,
      reason: `Alert at unusual early morning hour (${hour}:00)`
    }
  }

  return { isAnomaly: false, score: 0, reason: null }
}

/**
 * Detect severity anomaly
 */
function detectSeverityAnomaly(alert, baseline) {
  const severity = alert.severity || 'MEDIUM'
  const severityMap = { 'CRITICAL': 4, 'HIGH': 3, 'MEDIUM': 2, 'LOW': 1 }
  const severityValue = severityMap[severity] || 2

  const severityDist = baseline.severityDistribution

  if (severity === 'CRITICAL' && severityDist.critical < 0.05) {
    return {
      isAnomaly: true,
      score: 70,
      reason: `CRITICAL severity is anomalous (only ${(severityDist.critical * 100).toFixed(1)}% in baseline)`
    }
  }

  if (severity === 'HIGH' && severity.high < 0.1 && severityDist.high + severityDist.critical < 0.15) {
    return {
      isAnomaly: true,
      score: 55,
      reason: `HIGH severity is unusual for this user baseline`
    }
  }

  return { isAnomaly: false, score: 0, reason: null }
}

/**
 * Detect alert type anomaly
 */
function detectTypeAnomaly(alert, baseline) {
  const type = alert.type || 'unknown'
  const typeCount = baseline.alertTypes[type] || 0

  if (typeCount === 0) {
    return {
      isAnomaly: true,
      score: 70,
      reason: `Alert type "${type}" not in historical baseline`
    }
  }

  const typeFrequency = typeCount / baseline.dataPoints
  if (typeFrequency < 0.01) {
    return {
      isAnomaly: true,
      score: 55,
      reason: `Alert type "${type}" is very rare in baseline (${(typeFrequency * 100).toFixed(2)}%)`
    }
  }

  return { isAnomaly: false, score: 0, reason: null }
}

/**
 * Detect location anomaly
 */
function detectLocationAnomaly(alert, baseline) {
  const location = alert.location || 'unknown'
  const locationCount = baseline.locations[location] || 0

  if (location !== 'unknown' && locationCount === 0) {
    return {
      isAnomaly: true,
      score: 65,
      reason: `Login from new location: "${location}"`
    }
  }

  // Check for impossible travel
  if (alert.previousLocation && alert.previousLocationTime && alert.location) {
    const timeDiff = (new Date(alert.timestamp) - new Date(alert.previousLocationTime)) / 1000 / 60 // minutes
    const distanceMiles = calculateDistance(alert.previousLocation, alert.location)

    // Rough calculation: max realistic speed ~500 mph
    const maxMiles = Math.max(distanceMiles, timeDiff * 500 / 60)
    if (distanceMiles > maxMiles) {
      return {
        isAnomaly: true,
        score: 95,
        reason: `Impossible travel: ${distanceMiles.toFixed(0)} miles in ${timeDiff.toFixed(0)} minutes`
      }
    }
  }

  return { isAnomaly: false, score: 0, reason: null }
}

/**
 * Detect device anomaly
 */
function detectDeviceAnomaly(alert, baseline) {
  const device = alert.device || 'unknown'
  const deviceCount = baseline.deviceTypes[device] || 0

  if (device !== 'unknown' && deviceCount === 0) {
    return {
      isAnomaly: true,
      score: 60,
      reason: `Activity from new device type: "${device}"`
    }
  }

  return { isAnomaly: false, score: 0, reason: null }
}

/**
 * Helper: Calculate distribution of values
 */
function calculateDistribution(values) {
  if (!values || values.length === 0) {
    return { critical: 0, high: 0, medium: 0, low: 0 }
  }

  const counts = { CRITICAL: 0, HIGH: 0, MEDIUM: 0, LOW: 0 }
  values.forEach(v => {
    counts[v] = (counts[v] || 0) + 1
  })

  return {
    critical: counts.CRITICAL / values.length,
    high: counts.HIGH / values.length,
    medium: counts.MEDIUM / values.length,
    low: counts.LOW / values.length
  }
}

/**
 * Helper: Get peak hours
 */
function getPeakHours(timeOfDay) {
  if (!timeOfDay) return []

  const sorted = Object.entries(timeOfDay)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([hour]) => parseInt(hour))

  return sorted
}

/**
 * Helper: Get most common entries
 */
function getMostCommon(obj, limit = 5) {
  if (!obj) return []

  return Object.entries(obj)
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map(([key, count]) => ({ key, count }))
}

/**
 * Helper: Calculate distance between locations (simplified)
 * In production, use actual lat/long coordinates
 */
function calculateDistance(loc1, loc2) {
  if (!loc1 || !loc2) return 0
  // Simplified: return 0 if same, else estimate
  return loc1 === loc2 ? 0 : 1000
}

/**
 * Combine multiple baselines for ensemble detection
 */
export function ensembleDetection(alert, baselines) {
  if (!baselines || baselines.length === 0) {
    return {
      isAnomaly: false,
      anomalyScore: 0,
      reasons: []
    }
  }

  const results = baselines.map(baseline => detectAnomalies(alert, baseline))

  const averageScore = Math.round(
    results.reduce((sum, r) => sum + r.anomalyScore, 0) / results.length
  )

  const allReasons = []
  results.forEach(r => {
    if (r.reasons.length > 0) {
      allReasons.push(...r.reasons)
    }
  })

  return {
    isAnomaly: averageScore > 60,
    anomalyScore: averageScore,
    anomalyCount: allReasons.length,
    reasons: [...new Set(allReasons)], // unique reasons
    modelCount: results.length,
    timestamp: new Date().toISOString()
  }
}

/**
 * Get anomaly severity level
 */
export function getAnomalySeverity(anomalyScore) {
  if (anomalyScore >= 85) return 'CRITICAL'
  if (anomalyScore >= 70) return 'HIGH'
  if (anomalyScore >= 50) return 'MEDIUM'
  if (anomalyScore >= 30) return 'LOW'
  return 'NONE'
}
