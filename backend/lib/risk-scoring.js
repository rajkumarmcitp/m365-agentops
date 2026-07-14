/**
 * Risk Scoring Engine for Zero Trust Validation
 * Calculates risk scores based on severity, impact, and validation status
 */

// Severity weight mapping (base risk contribution)
const SEVERITY_WEIGHTS = {
  'Critical': 40,
  'High': 25,
  'Medium': 15,
  'Low': 8,
  'Info': 2,
  'Unknown': 0
}

// Status multipliers (how much to increase risk based on current status)
const STATUS_MULTIPLIERS = {
  'fail': 1.0,      // Full risk if failed
  'warn': 0.7,      // 70% risk if warning
  'pass': 0.0,      // No risk if passed
  'unknown': 0.5    // 50% risk if unknown/unvalidated
}

/**
 * Calculate risk score for a single control
 * Formula: (Severity Weight + Impact Score) * Status Multiplier
 * Result: 0-100
 */
export function calculateControlRiskScore(control, validationResult) {
  try {
    const severity = control.severity || 'Unknown'
    const severityWeight = SEVERITY_WEIGHTS[severity] || 0
    const impactScore = control.impactScore || 50
    const status = validationResult?.status || 'unknown'
    const statusMultiplier = STATUS_MULTIPLIERS[status] || 0.5

    // Weighted average of severity and impact
    const baseScore = (severityWeight + impactScore) / 2

    // Apply status multiplier
    const riskScore = Math.round(baseScore * statusMultiplier)

    return Math.max(0, Math.min(100, riskScore))
  } catch (error) {
    console.warn(`Error calculating risk score for ${control.id}:`, error.message)
    return 0
  }
}

/**
 * Get risk level badge (Critical, High, Medium, Low)
 */
export function getRiskLevel(riskScore) {
  if (riskScore >= 75) return 'Critical'
  if (riskScore >= 50) return 'High'
  if (riskScore >= 25) return 'Medium'
  return 'Low'
}

/**
 * Get risk color for UI display
 */
export function getRiskColor(riskScore) {
  if (riskScore >= 75) return '#E63946' // Red
  if (riskScore >= 50) return '#F77F00' // Orange
  if (riskScore >= 25) return '#FCBF49' // Yellow
  return '#06A77D' // Green
}

/**
 * Aggregate risk scores by pillar
 */
export function calculatePillarRiskScore(pillarValidations) {
  if (!pillarValidations || pillarValidations.length === 0) {
    return 0
  }

  const totalRisk = pillarValidations.reduce((sum, v) => sum + (v.riskScore || 0), 0)
  return Math.round(totalRisk / pillarValidations.length)
}

/**
 * Calculate overall Zero Trust risk score
 * Weighted average of all pillar scores
 */
export function calculateOverallRiskScore(summaryByPillar) {
  const pillarScores = Object.values(summaryByPillar || {})
    .map(pillar => pillar.riskScore || 0)
    .filter(score => score > 0)

  if (pillarScores.length === 0) return 0

  const totalRisk = pillarScores.reduce((a, b) => a + b, 0)
  return Math.round(totalRisk / pillarScores.length)
}

/**
 * Generate risk summary for dashboard
 */
export function generateRiskSummary(validations, summaryByPillar) {
  return {
    overallRiskScore: calculateOverallRiskScore(summaryByPillar),
    riskLevel: getRiskLevel(calculateOverallRiskScore(summaryByPillar)),
    controlsByRisk: {
      critical: validations.filter(v => (v.riskScore || 0) >= 75).length,
      high: validations.filter(v => (v.riskScore || 0) >= 50 && (v.riskScore || 0) < 75).length,
      medium: validations.filter(v => (v.riskScore || 0) >= 25 && (v.riskScore || 0) < 50).length,
      low: validations.filter(v => (v.riskScore || 0) < 25).length
    },
    pillarRisks: Object.entries(summaryByPillar || {}).reduce((acc, [pillar, data]) => {
      acc[pillar] = {
        riskScore: data.riskScore || 0,
        riskLevel: getRiskLevel(data.riskScore || 0),
        compliance: Math.round((data.pass / (data.pass + data.fail + data.warn)) * 100) || 0
      }
      return acc
    }, {})
  }
}

/**
 * Top failing controls by risk
 */
export function getTopRiskControls(validations, limit = 10) {
  return validations
    .filter(v => v.status !== 'pass')
    .sort((a, b) => (b.riskScore || 0) - (a.riskScore || 0))
    .slice(0, limit)
    .map(v => ({
      id: v.id,
      name: v.name,
      pillar: v.pillar,
      riskScore: v.riskScore,
      riskLevel: getRiskLevel(v.riskScore),
      severity: v.severity,
      status: v.status
    }))
}
