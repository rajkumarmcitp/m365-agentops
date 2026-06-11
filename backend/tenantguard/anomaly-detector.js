/**
 * TenantGuard Anomaly Detector
 * Statistical and behavioral anomaly detection
 */

export class AnomalyDetector {
  /**
   * Detect statistical anomalies in alert patterns
   */
  detectAnomalies(alerts) {
    const anomalies = []

    if (!alerts || alerts.length === 0) return anomalies

    // Anomaly 1: Unusual alert volume
    if (alerts.length > 10) {
      anomalies.push({
        type: 'HIGH_ALERT_VOLUME',
        severity: 'HIGH',
        description: `Unusual spike: ${alerts.length} alerts in 24 hours (normal: <5)`,
        confidence: 0.85
      })
    }

    // Anomaly 2: Off-hours activity
    const offHoursAlerts = this.getOffHoursAlerts(alerts)
    if (offHoursAlerts.length >= 3) {
      anomalies.push({
        type: 'OFF_HOURS_ACTIVITY',
        severity: 'MEDIUM',
        description: `${offHoursAlerts.length} alerts detected during off-hours (22:00-06:00)`,
        confidence: 0.75
      })
    }

    // Anomaly 3: Bulk operations
    const bulkOps = alerts.filter(a => {
      const headline = (a.headline || '').toLowerCase()
      return headline.includes('bulk') ||
             headline.includes('multiple') ||
             headline.includes('batch') ||
             headline.includes('deletion')
    })
    if (bulkOps.length > 0) {
      anomalies.push({
        type: 'BULK_OPERATION',
        severity: 'HIGH',
        description: `${bulkOps.length} bulk operation alerts - possible unauthorized mass changes`,
        confidence: 0.80
      })
    }

    // Anomaly 4: High average severity score
    const avgScore = alerts.reduce((sum, a) => sum + a.score, 0) / alerts.length
    if (avgScore >= 75) {
      anomalies.push({
        type: 'HIGH_SEVERITY_CLUSTER',
        severity: 'HIGH',
        description: `${alerts.length} high-severity alerts (avg score: ${Math.round(avgScore)}/100)`,
        confidence: 0.88
      })
    }

    // Anomaly 5: Critical severity concentration
    const criticalAlerts = alerts.filter(a => a.severity === 'CRITICAL')
    if (criticalAlerts.length >= 2) {
      anomalies.push({
        type: 'CRITICAL_CONCENTRATION',
        severity: 'CRITICAL',
        description: `${criticalAlerts.length} critical-severity alerts in short timeframe`,
        confidence: 0.95
      })
    }

    // Anomaly 6: Rapid sequential activity from same actor
    const actorGroups = this.groupByActor(alerts)
    Object.entries(actorGroups).forEach(([actor, actorAlerts]) => {
      if (actorAlerts.length >= 4) {
        const timeSpan = new Date(actorAlerts[0].action_timestamp) -
                         new Date(actorAlerts[actorAlerts.length - 1].action_timestamp)
        if (timeSpan < 600000) { // Within 10 minutes
          anomalies.push({
            type: 'RAPID_SEQUENTIAL_ACTIVITY',
            severity: 'HIGH',
            description: `${actor} performed ${actorAlerts.length} actions within 10 minutes`,
            confidence: 0.82
          })
        }
      }
    })

    return anomalies
  }

  /**
   * Get alerts from off-hours (22:00 - 06:00)
   */
  getOffHoursAlerts(alerts) {
    return alerts.filter(alert => {
      const date = new Date(alert.action_timestamp)
      const hour = date.getHours()
      return hour < 6 || hour >= 22
    })
  }

  /**
   * Group alerts by actor
   */
  groupByActor(alerts) {
    const groups = {}
    alerts.forEach(alert => {
      const actor = alert.actor || 'System'
      if (!groups[actor]) groups[actor] = []
      groups[actor].push(alert)
    })
    return groups
  }

  /**
   * Calculate statistical baseline for comparison
   */
  calculateBaseline(historicalAlerts) {
    if (!historicalAlerts || historicalAlerts.length === 0) {
      return {
        avgDailyAlerts: 3,
        avgSeverityScore: 50,
        criticalPercentage: 0.1,
        highPercentage: 0.2
      }
    }

    const critical = historicalAlerts.filter(a => a.severity === 'CRITICAL').length
    const high = historicalAlerts.filter(a => a.severity === 'HIGH').length
    const avgScore = historicalAlerts.reduce((sum, a) => sum + a.score, 0) / historicalAlerts.length

    return {
      avgDailyAlerts: Math.round(historicalAlerts.length / 7),
      avgSeverityScore: Math.round(avgScore),
      criticalPercentage: critical / historicalAlerts.length,
      highPercentage: high / historicalAlerts.length
    }
  }

  /**
   * Detect deviation from baseline
   */
  detectDeviations(currentAlerts, baseline) {
    const deviations = []

    if (!baseline) {
      baseline = this.calculateBaseline([])
    }

    // Volume deviation
    if (currentAlerts.length > baseline.avgDailyAlerts * 3) {
      deviations.push({
        type: 'VOLUME_DEVIATION',
        description: `${currentAlerts.length} alerts (${Math.round(currentAlerts.length / baseline.avgDailyAlerts)}x normal)`,
        deviation: Math.round(((currentAlerts.length - baseline.avgDailyAlerts) / baseline.avgDailyAlerts) * 100)
      })
    }

    // Severity deviation
    const avgScore = currentAlerts.reduce((sum, a) => sum + a.score, 0) / currentAlerts.length
    if (avgScore > baseline.avgSeverityScore * 1.3) {
      deviations.push({
        type: 'SEVERITY_DEVIATION',
        description: `Average severity ${Math.round(avgScore)} (normal: ${baseline.avgSeverityScore})`,
        deviation: Math.round(((avgScore - baseline.avgSeverityScore) / baseline.avgSeverityScore) * 100)
      })
    }

    return deviations
  }
}
