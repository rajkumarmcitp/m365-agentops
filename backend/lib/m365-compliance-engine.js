// ============================================================
// M365 Compliance Engine
// Transforms validation results into compliance intelligence
// ============================================================

export class M365ComplianceEngine {
  constructor(db, validationEngine) {
    this.db = db
    this.validationEngine = validationEngine
  }

  // ============================================================
  // WEIGHTED SCORING
  // ============================================================

  /**
   * Calculate overall weighted compliance score
   */
  async calculateWeightedScore(tenantId) {
    try {
      const result = await this.db.query(
        `SELECT
          COUNT(*) as total_controls,
          COUNT(CASE WHEN status = 'Pass' THEN 1 END) as passed,
          COUNT(CASE WHEN status = 'Fail' THEN 1 END) as failed,
          COUNT(CASE WHEN status = 'Partial' THEN 1 END) as partial,
          COUNT(CASE WHEN status = 'Unknown' THEN 1 END) as unknown,
          COUNT(CASE WHEN status = 'Error' THEN 1 END) as error,
          SUM(mcc.risk_weight) as total_points,
          SUM(CASE WHEN mcr.status = 'Pass' THEN mcc.risk_weight ELSE 0 END) as earned_points
        FROM m365_control_results mcr
        JOIN m365_control_catalog mcc ON mcr.control_id = mcc.id
        WHERE mcr.tenant_id = $1`,
        [tenantId]
      )

      const row = result.rows[0]
      if (!row || row.total_controls === '0') {
        return {
          score: 0,
          earnedPoints: 0,
          totalPoints: 0,
          breakdown: {
            passed: 0,
            failed: 0,
            partial: 0,
            unknown: 0,
            error: 0
          },
          status: 'No validation data'
        }
      }

      const totalPoints = parseInt(row.total_points) || 1
      const earnedPoints = parseInt(row.earned_points) || 0
      const score = (earnedPoints / totalPoints) * 100

      return {
        score: Math.round(score * 100) / 100,
        earnedPoints,
        totalPoints,
        breakdown: {
          passed: parseInt(row.passed),
          failed: parseInt(row.failed),
          partial: parseInt(row.partial),
          unknown: parseInt(row.unknown),
          error: parseInt(row.error),
          total: parseInt(row.total_controls)
        },
        status: this.getScoreStatus(score)
      }
    } catch (error) {
      console.error('Error calculating weighted score:', error.message)
      throw error
    }
  }

  /**
   * Get score status label
   */
  getScoreStatus(score) {
    if (score >= 90) return 'Excellent'
    if (score >= 80) return 'Good'
    if (score >= 70) return 'Fair'
    if (score >= 60) return 'Poor'
    return 'Critical'
  }

  // ============================================================
  // FRAMEWORK SCORING
  // ============================================================

  /**
   * Calculate framework-specific compliance score
   */
  async calculateFrameworkScore(framework, tenantId) {
    try {
      const result = await this.db.query(
        `SELECT
          mcm.framework,
          COUNT(DISTINCT mcr.control_id) as total_controls,
          COUNT(DISTINCT CASE WHEN mcr.status = 'Pass' THEN mcr.control_id END) as passed,
          COUNT(DISTINCT CASE WHEN mcr.status = 'Fail' THEN mcr.control_id END) as failed,
          SUM(mcc.risk_weight) as total_points,
          SUM(CASE WHEN mcr.status = 'Pass' THEN mcc.risk_weight ELSE 0 END) as earned_points
        FROM m365_control_mappings mcm
        JOIN m365_control_results mcr ON mcm.control_id = mcr.control_id
        JOIN m365_control_catalog mcc ON mcr.control_id = mcc.id
        WHERE mcm.framework = $1 AND mcr.tenant_id = $2
        GROUP BY mcm.framework`,
        [framework, tenantId]
      )

      if (result.rows.length === 0) {
        return {
          framework,
          score: 0,
          totalControls: 0,
          passed: 0,
          failed: 0,
          status: 'No data'
        }
      }

      const row = result.rows[0]
      const totalPoints = parseInt(row.total_points) || 1
      const earnedPoints = parseInt(row.earned_points) || 0
      const score = (earnedPoints / totalPoints) * 100

      return {
        framework,
        score: Math.round(score * 100) / 100,
        totalControls: parseInt(row.total_controls),
        passed: parseInt(row.passed),
        failed: parseInt(row.failed),
        earnedPoints,
        totalPoints,
        status: this.getScoreStatus(score)
      }
    } catch (error) {
      console.error(`Error calculating ${framework} score:`, error.message)
      throw error
    }
  }

  /**
   * Calculate all framework scores
   */
  async calculateAllFrameworkScores(tenantId) {
    const frameworks = ['CIS', 'NIST', 'ISO', 'CMMC', 'SOC2', 'Secure Score', 'Zero Trust']
    const scores = {}

    for (const framework of frameworks) {
      scores[framework] = await this.calculateFrameworkScore(framework, tenantId)
    }

    return scores
  }

  // ============================================================
  // DOMAIN SCORING
  // ============================================================

  /**
   * Calculate domain-specific compliance score
   */
  async calculateDomainCompliance(domain, tenantId) {
    try {
      const result = await this.db.query(
        `SELECT
          mcc.domain,
          COUNT(DISTINCT mcr.control_id) as total_controls,
          COUNT(DISTINCT CASE WHEN mcr.status = 'Pass' THEN mcr.control_id END) as passed,
          COUNT(DISTINCT CASE WHEN mcr.status = 'Fail' THEN mcr.control_id END) as failed,
          SUM(mcc.risk_weight) as total_points,
          SUM(CASE WHEN mcr.status = 'Pass' THEN mcc.risk_weight ELSE 0 END) as earned_points
        FROM m365_control_catalog mcc
        LEFT JOIN m365_control_results mcr ON mcc.id = mcr.control_id AND mcr.tenant_id = $2
        WHERE mcc.domain = $1
        GROUP BY mcc.domain`,
        [domain, tenantId]
      )

      if (result.rows.length === 0) {
        return {
          domain,
          score: 0,
          totalControls: 0,
          passed: 0,
          failed: 0
        }
      }

      const row = result.rows[0]
      const totalPoints = parseInt(row.total_points) || 1
      const earnedPoints = parseInt(row.earned_points) || 0
      const score = (earnedPoints / totalPoints) * 100

      return {
        domain,
        score: Math.round(score * 100) / 100,
        totalControls: parseInt(row.total_controls),
        passed: parseInt(row.passed),
        failed: parseInt(row.failed),
        earnedPoints,
        totalPoints
      }
    } catch (error) {
      console.error(`Error calculating ${domain} compliance:`, error.message)
      throw error
    }
  }

  /**
   * Calculate all domain scores
   */
  async calculateAllDomainCompliance(tenantId) {
    const domains = [
      'TG-ID', 'TG-AUTH', 'TG-CA', 'TG-APP', 'TG-ROLE',
      'TG-DEV', 'TG-EXO', 'TG-SPO', 'TG-TEAMS', 'TG-PUR',
      'TG-DEF', 'TG-INT', 'TG-DLP', 'TG-AUD', 'TG-MON',
      'TG-NET', 'TG-GOV', 'TG-BKP', 'TG-COMP', 'TG-AI'
    ]

    const scores = {}
    for (const domain of domains) {
      scores[domain] = await this.calculateDomainCompliance(domain, tenantId)
    }

    return scores
  }

  // ============================================================
  // COMPLIANCE SNAPSHOTS
  // ============================================================

  /**
   * Create compliance snapshot
   */
  async createComplianceSnapshot(tenantId) {
    try {
      const overallScore = await this.calculateWeightedScore(tenantId)
      const frameworkScores = await this.calculateAllFrameworkScores(tenantId)
      const domainScores = await this.calculateAllDomainCompliance(tenantId)

      // Build framework scores JSON
      const frameworkScoresJson = {}
      for (const [framework, data] of Object.entries(frameworkScores)) {
        frameworkScoresJson[framework] = data.score
      }

      // Build domain scores JSON
      const domainScoresJson = {}
      for (const [domain, data] of Object.entries(domainScores)) {
        domainScoresJson[domain] = data.score
      }

      // Insert snapshot
      const result = await this.db.query(
        `INSERT INTO m365_compliance_snapshots (
          tenant_id,
          snapshot_date,
          total_controls,
          passed_controls,
          failed_controls,
          partial_controls,
          unknown_controls,
          error_controls,
          total_risk_points,
          earned_risk_points,
          compliance_score,
          framework_scores,
          domain_scores,
          created_at
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, NOW())
        RETURNING id`,
        [
          tenantId,
          new Date(),
          overallScore.breakdown.total,
          overallScore.breakdown.passed,
          overallScore.breakdown.failed,
          overallScore.breakdown.partial,
          overallScore.breakdown.unknown,
          overallScore.breakdown.error,
          overallScore.totalPoints,
          overallScore.earnedPoints,
          overallScore.score,
          JSON.stringify(frameworkScoresJson),
          JSON.stringify(domainScoresJson)
        ]
      )

      console.log(`📊 Compliance snapshot created: ${overallScore.score.toFixed(2)}%`)
      return result.rows[0].id
    } catch (error) {
      console.error('Error creating compliance snapshot:', error.message)
      throw error
    }
  }

  /**
   * Get latest compliance snapshot
   */
  async getLatestSnapshot(tenantId) {
    try {
      const result = await this.db.query(
        `SELECT * FROM m365_compliance_snapshots
         WHERE tenant_id = $1
         ORDER BY snapshot_date DESC
         LIMIT 1`,
        [tenantId]
      )

      if (result.rows.length === 0) {
        return null
      }

      const row = result.rows[0]
      return {
        id: row.id,
        tenantId: row.tenant_id,
        snapshotDate: row.snapshot_date,
        totalControls: row.total_controls,
        passedControls: row.passed_controls,
        failedControls: row.failed_controls,
        partialControls: row.partial_controls,
        unknownControls: row.unknown_controls,
        errorControls: row.error_controls,
        totalRiskPoints: row.total_risk_points,
        earnedRiskPoints: row.earned_risk_points,
        complianceScore: row.compliance_score,
        frameworkScores: row.framework_scores,
        domainScores: row.domain_scores
      }
    } catch (error) {
      console.error('Error getting latest snapshot:', error.message)
      throw error
    }
  }

  /**
   * Get previous compliance snapshot
   */
  async getPreviousSnapshot(tenantId) {
    try {
      const result = await this.db.query(
        `SELECT * FROM m365_compliance_snapshots
         WHERE tenant_id = $1
         ORDER BY snapshot_date DESC
         LIMIT 1 OFFSET 1`,
        [tenantId]
      )

      if (result.rows.length === 0) {
        return null
      }

      return result.rows[0]
    } catch (error) {
      console.error('Error getting previous snapshot:', error.message)
      throw error
    }
  }

  // ============================================================
  // DRIFT DETECTION
  // ============================================================

  /**
   * Detect compliance drift
   */
  async detectDrift(tenantId, daysBack = 7) {
    try {
      const latest = await this.getLatestSnapshot(tenantId)
      const previous = await this.getPreviousSnapshot(tenantId)

      if (!latest || !previous) {
        return {
          regressions: [],
          remediations: [],
          scoreDelta: 0,
          severity: 'Unknown',
          trend: 'Insufficient data'
        }
      }

      // Calculate score delta
      const scoreDelta = latest.complianceScore - previous.complianceScore

      // Get regressions (Pass → Fail)
      const regressions = await this.db.query(
        `SELECT DISTINCT ON (control_id)
          mcd.control_id,
          mcc.control_id as control_name,
          mcd.previous_status,
          mcd.new_status,
          mcd.changed_at,
          mcc.severity
        FROM m365_compliance_drift mcd
        JOIN m365_control_catalog mcc ON mcd.control_id = mcc.id
        WHERE mcd.tenant_id = $1
          AND mcd.previous_status = 'Pass'
          AND mcd.new_status = 'Fail'
          AND mcd.changed_at >= NOW() - INTERVAL '${daysBack} days'
        ORDER BY control_id, changed_at DESC`,
        [tenantId]
      )

      // Get remediations (Fail → Pass)
      const remediations = await this.db.query(
        `SELECT DISTINCT ON (control_id)
          mcd.control_id,
          mcc.control_id as control_name,
          mcd.previous_status,
          mcd.new_status,
          mcd.changed_at
        FROM m365_compliance_drift mcd
        JOIN m365_control_catalog mcc ON mcd.control_id = mcc.id
        WHERE mcd.tenant_id = $1
          AND mcd.previous_status = 'Fail'
          AND mcd.new_status = 'Pass'
          AND mcd.changed_at >= NOW() - INTERVAL '${daysBack} days'
        ORDER BY control_id, changed_at DESC`,
        [tenantId]
      )

      // Determine severity based on score delta
      let severity = 'Low'
      if (scoreDelta < -10) severity = 'Critical'
      else if (scoreDelta < -5) severity = 'High'
      else if (scoreDelta < -2) severity = 'Medium'

      // Determine trend
      let trend = 'Stable'
      if (scoreDelta > 2) trend = 'Improving'
      else if (scoreDelta < -2) trend = 'Declining'

      return {
        regressions: regressions.rows.map(r => ({
          controlId: r.control_name,
          severity: r.severity,
          changedAt: r.changed_at
        })),
        remediations: remediations.rows.map(r => ({
          controlId: r.control_name,
          changedAt: r.changed_at
        })),
        scoreDelta: Math.round(scoreDelta * 100) / 100,
        severity,
        trend,
        regressionCount: regressions.rows.length,
        remediationCount: remediations.rows.length
      }
    } catch (error) {
      console.error('Error detecting drift:', error.message)
      throw error
    }
  }

  // ============================================================
  // TREND ANALYSIS
  // ============================================================

  /**
   * Calculate compliance trend
   */
  async calculateTrend(tenantId, daysBack = 30) {
    try {
      const result = await this.db.query(
        `SELECT
          snapshot_date,
          compliance_score
        FROM m365_compliance_snapshots
        WHERE tenant_id = $1
          AND snapshot_date >= NOW() - INTERVAL '${daysBack} days'
        ORDER BY snapshot_date ASC`,
        [tenantId]
      )

      if (result.rows.length < 2) {
        return {
          daysBack,
          dataPoints: result.rows.length,
          trend: 'Insufficient data',
          direction: 'Unknown',
          velocity: 0,
          projection: null,
          history: result.rows.map(r => ({
            date: r.snapshot_date,
            score: parseFloat(r.compliance_score)
          }))
        }
      }

      // Linear regression calculation
      const scores = result.rows.map(r => parseFloat(r.compliance_score))
      const n = scores.length
      const sumX = (n * (n - 1)) / 2
      const sumY = scores.reduce((a, b) => a + b, 0)
      const sumXY = scores.reduce((sum, score, i) => sum + i * score, 0)
      const sumX2 = (n * (n - 1) * (2 * n - 1)) / 6

      const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX)
      const intercept = (sumY - slope * sumX) / n

      // Determine trend direction
      let direction = '➡️ Stable'
      if (slope > 0.5) direction = '📈 Improving'
      else if (slope < -0.5) direction = '📉 Declining'

      // Project score 30 days forward
      const projection = intercept + slope * (n + 30)

      return {
        daysBack,
        dataPoints: n,
        trend: direction,
        direction,
        velocity: Math.round(slope * 100) / 100,
        projection: Math.max(0, Math.min(100, Math.round(projection * 100) / 100)),
        history: result.rows.map(r => ({
          date: r.snapshot_date,
          score: parseFloat(r.compliance_score)
        }))
      }
    } catch (error) {
      console.error('Error calculating trend:', error.message)
      throw error
    }
  }

  // ============================================================
  // EXECUTIVE SUMMARY
  // ============================================================

  /**
   * Generate executive compliance summary
   */
  async generateExecutiveSummary(tenantId) {
    try {
      const overallScore = await this.calculateWeightedScore(tenantId)
      const drift = await this.detectDrift(tenantId, 7)
      const trend = await this.calculateTrend(tenantId, 30)
      const latestSnapshot = await this.getLatestSnapshot(tenantId)
      const frameworks = await this.calculateAllFrameworkScores(tenantId)
      const domains = await this.calculateAllDomainCompliance(tenantId)

      // Identify top risks (domains with lowest scores)
      const domainsList = Object.values(domains)
        .sort((a, b) => a.score - b.score)
        .slice(0, 5)

      // Identify framework compliance gaps
      const frameworksList = Object.values(frameworks)
        .sort((a, b) => a.score - b.score)
        .slice(0, 5)

      // Determine risk level
      let riskLevel = 'Low'
      if (overallScore.score >= 90) riskLevel = 'Low'
      else if (overallScore.score >= 80) riskLevel = 'Medium'
      else if (overallScore.score >= 70) riskLevel = 'High'
      else riskLevel = 'Critical'

      // Build recommendations
      const recommendations = []

      if (overallScore.breakdown.failed > 0) {
        recommendations.push(
          `Address ${overallScore.breakdown.failed} failing controls prioritized by severity`
        )
      }

      if (drift.regressionCount > 0) {
        recommendations.push(
          `${drift.regressionCount} control regressions detected in the last 7 days`
        )
      }

      if (domainsList[0] && domainsList[0].score < 70) {
        recommendations.push(
          `${domainsList[0].domain} has lowest compliance (${domainsList[0].score}%) — prioritize`
        )
      }

      return {
        tenantId,
        asOfDate: new Date(),
        overallCompliance: {
          score: overallScore.score,
          status: overallScore.status,
          riskLevel,
          breakdown: overallScore.breakdown
        },
        trend: {
          direction: trend.direction,
          velocity: trend.velocity,
          projection30Days: trend.projection
        },
        recentDrift: {
          regressions: drift.regressionCount,
          remediations: drift.remediationCount,
          severity: drift.severity
        },
        topRisks: domainsList.map(d => ({
          domain: d.domain,
          score: d.score,
          failingControls: d.failed
        })),
        frameworkGaps: frameworksList.map(f => ({
          framework: f.framework,
          score: f.score,
          failingControls: f.failed
        })),
        recommendations,
        nextSteps: [
          'Review top 5 failing controls',
          'Prioritize regressions by severity',
          `${domainsList[0]?.domain || 'TG-ID'} domain requires attention`,
          'Implement remediation for critical controls'
        ]
      }
    } catch (error) {
      console.error('Error generating executive summary:', error.message)
      throw error
    }
  }

  // ============================================================
  // SEVERITY BREAKDOWN
  // ============================================================

  /**
   * Get control failures by severity
   */
  async getFailuresBySeverity(tenantId) {
    try {
      const result = await this.db.query(
        `SELECT
          mcc.severity,
          COUNT(*) as count,
          SUM(mcc.risk_weight) as risk_points
        FROM m365_control_results mcr
        JOIN m365_control_catalog mcc ON mcr.control_id = mcc.id
        WHERE mcr.tenant_id = $1 AND mcr.status = 'Fail'
        GROUP BY mcc.severity
        ORDER BY CASE
          WHEN mcc.severity = 'Critical' THEN 1
          WHEN mcc.severity = 'High' THEN 2
          WHEN mcc.severity = 'Medium' THEN 3
          WHEN mcc.severity = 'Low' THEN 4
          WHEN mcc.severity = 'Informational' THEN 5
        END`,
        [tenantId]
      )

      return result.rows.map(r => ({
        severity: r.severity,
        count: parseInt(r.count),
        riskPoints: parseInt(r.risk_points)
      }))
    } catch (error) {
      console.error('Error getting failures by severity:', error.message)
      throw error
    }
  }
}
