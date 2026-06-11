import { getOperationConfig, shouldMonitor } from './monitored-operations.js'

export class RiskScorer {
  /**
   * Score an audit event
   */
  scoreEvent(event) {
    // Check if we monitor this operation
    if (!shouldMonitor(event.operation_name)) {
      return null
    }

    const config = getOperationConfig(event.operation_name)

    if (!config) {
      return null
    }

    // Calculate weighted score
    // Formula: Privilege(40%) + Security(30%) + Data(20%) + Frequency(10%)
    const score = Math.round(
      (config.privilege * 0.40) +
      (config.security * 0.30) +
      (config.data * 0.20) +
      ((config.frequency || 50) * 0.10)
    )

    // Determine severity
    let severity = 'INFO'
    if (score >= 90) severity = 'CRITICAL'
    else if (score >= 70) severity = 'HIGH'
    else if (score >= 50) severity = 'MEDIUM'

    return {
      ...config,
      score,
      severity,
      actualSeverity: severity,
      components: {
        privilege: config.privilege,
        security: config.security,
        data: config.data,
        frequency: config.frequency || 50
      }
    }
  }

  /**
   * Helper: Map numeric score to text
   */
  mapScore(score) {
    if (score >= 80) return 'VERY HIGH'
    if (score >= 60) return 'HIGH'
    if (score >= 40) return 'MEDIUM'
    return 'LOW'
  }
}
