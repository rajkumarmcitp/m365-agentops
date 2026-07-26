/**
 * Risk Assessment Agent
 * Aggregates compliance, threat, and posture signals into a single Tenant Risk Score
 * Runs every 30 minutes to provide real-time risk assessment
 */

let riskAssessmentAgent = null

export class RiskAssessmentAgent {
  constructor(db, eventBus) {
    this.db = db
    this.eventBus = eventBus
    this.isRunning = false
    this.checkInterval = 30 * 60 * 1000 // 30 minutes
    this.monitoringInterval = null
  }

  startMonitoring() {
    if (this.isRunning) return
    this.isRunning = true
    console.log('✅ Risk Assessment Agent initialized')

    // Run first assessment immediately
    this.runAssessment()

    // Schedule recurring assessments
    this.monitoringInterval = setInterval(() => {
      this.runAssessment()
    }, this.checkInterval)
  }

  stopMonitoring() {
    if (this.monitoringInterval) {
      clearInterval(this.monitoringInterval)
      this.monitoringInterval = null
    }
    this.isRunning = false
  }

  runAssessment() {
    try {
      const store = this.db.getStore()

      // Score each pillar
      const complianceScore = this.scoreCompliance(store)
      const threatScore = this.scoreThreats(store)
      const postureScore = this.scorePosture(store)

      // Calculate overall score
      const overallScore = Math.round(complianceScore + threatScore + postureScore)

      // Determine risk level
      const riskLevel = this.getRiskLevel(overallScore)

      // Build top factors
      const factors = this.buildFactors(store, { complianceScore, threatScore, postureScore })

      // Get historical data for trend
      const previousAssessment = this.getPreviousAssessment(store)
      const trend = this.calculateTrend(overallScore, previousAssessment?.overall_score)

      // Count metrics
      const metricsData = this.extractMetrics(store)

      // Build assessment record
      const assessment = {
        id: 'risk_' + Date.now(),
        assessed_at: new Date().toISOString(),
        overall_score: overallScore,
        risk_level: riskLevel,
        compliance_score: Math.round(complianceScore),
        threat_score: Math.round(threatScore),
        posture_score: Math.round(postureScore),
        trend,
        open_drifts: metricsData.openDrifts,
        critical_alerts: metricsData.criticalAlerts,
        true_positives: metricsData.truePositives,
        control_fail_rate: metricsData.controlFailRate,
        factors,
        previous_score: previousAssessment?.overall_score || null
      }

      // Save to store
      this.saveAssessment(assessment)

      // Publish event
      if (this.eventBus) {
        this.eventBus.publish('RISK_ASSESSMENT_COMPLETE', {
          overall_score: assessment.overall_score,
          risk_level: assessment.risk_level,
          trend: assessment.trend
        }, 'risk-assessment-agent')
      }

      console.log(`✅ Risk assessment complete: score=${overallScore} (${riskLevel}) trend=${trend}`)
    } catch (err) {
      console.error('❌ Risk assessment failed:', err.message)
    }
  }

  scoreCompliance(store) {
    const drifts = Object.values(store.complianceDrifts || {})
    const openDrifts = drifts.filter(d => !d.drift_resolved_at)

    let score = 0
    for (const drift of openDrifts) {
      if (drift.severity === 'CRITICAL') score += 10
      else if (drift.severity === 'HIGH') score += 6
      else if (drift.severity === 'MEDIUM') score += 3
    }

    return Math.min(score, 40)
  }

  scoreThreats(store) {
    const alerts = Object.values(store.alerts || {})
    const investigations = Object.values(store.agentInvestigations || {})

    let score = 0

    // Score active high-priority alerts
    const p0Alerts = alerts.filter(a => a.priority === 'P0' && !a.dismissed)
    score += p0Alerts.length * 10

    const p1Alerts = alerts.filter(a => a.priority === 'P1' && !a.dismissed)
    score += p1Alerts.length * 5

    // Score true-positive verdicts
    const truePositives = investigations.filter(i => i.verdict === 'true_positive')
    score += truePositives.length * 7

    return Math.min(score, 35)
  }

  scorePosture(store) {
    const checks = Object.values(store.complianceChecks || {})
    if (checks.length === 0) return 0

    const failedChecks = checks.filter(c => c.status === 'FAIL')
    const failRate = (failedChecks.length / checks.length) * 100

    // Score: 0% fail = 0 points, 100% fail = 25 points
    return Math.min((failRate / 100) * 25, 25)
  }

  buildFactors(store, scores) {
    const factors = []

    const drifts = Object.values(store.complianceDrifts || {})
    const openDrifts = drifts.filter(d => !d.drift_resolved_at)
    const criticalDrifts = openDrifts.filter(d => d.severity === 'CRITICAL')
    const highDrifts = openDrifts.filter(d => d.severity === 'HIGH')

    if (criticalDrifts.length > 0) {
      factors.push({
        category: 'Compliance',
        title: `${criticalDrifts.length} Critical CIS Control${criticalDrifts.length > 1 ? 's' : ''} Failed`,
        impact: 'CRITICAL',
        detail: `${criticalDrifts.map(d => d.control_id).join(', ')}`
      })
    }

    if (highDrifts.length > 0) {
      factors.push({
        category: 'Compliance',
        title: `${highDrifts.length} High-Severity Control${highDrifts.length > 1 ? 's' : ''} Drifted`,
        impact: 'HIGH',
        detail: `${highDrifts.slice(0, 3).map(d => d.control_id).join(', ')}${highDrifts.length > 3 ? '...' : ''}`
      })
    }

    const alerts = Object.values(store.alerts || {})
    const p0Alerts = alerts.filter(a => a.priority === 'P0' && !a.dismissed)
    const p1Alerts = alerts.filter(a => a.priority === 'P1' && !a.dismissed)

    if (p0Alerts.length > 0) {
      factors.push({
        category: 'Threats',
        title: `${p0Alerts.length} Critical Security Alert${p0Alerts.length > 1 ? 's' : ''}`,
        impact: 'CRITICAL',
        detail: p0Alerts[0]?.headline || 'Active threat detected'
      })
    }

    if (p1Alerts.length > 0) {
      factors.push({
        category: 'Threats',
        title: `${p1Alerts.length} High-Priority Alert${p1Alerts.length > 1 ? 's' : ''}`,
        impact: 'HIGH',
        detail: p1Alerts[0]?.headline || 'Security alert requiring attention'
      })
    }

    const investigations = Object.values(store.agentInvestigations || {})
    const truePositives = investigations.filter(i => i.verdict === 'true_positive')

    if (truePositives.length > 0) {
      factors.push({
        category: 'Threats',
        title: `${truePositives.length} Confirmed Threat${truePositives.length > 1 ? 's' : ''}`,
        impact: 'HIGH',
        detail: `AI-verified suspicious activity detected`
      })
    }

    const checks = Object.values(store.complianceChecks || {})
    if (checks.length > 0) {
      const failedChecks = checks.filter(c => c.status === 'FAIL')
      const failRate = Math.round((failedChecks.length / checks.length) * 100)
      if (failRate > 20) {
        factors.push({
          category: 'Posture',
          title: `${failRate}% of Controls Failing Validation`,
          impact: failRate > 40 ? 'CRITICAL' : 'HIGH',
          detail: `${failedChecks.length} of ${checks.length} monitored controls`
        })
      }
    }

    return factors.slice(0, 5)
  }

  getRiskLevel(score) {
    if (score >= 75) return 'CRITICAL'
    if (score >= 50) return 'HIGH'
    if (score >= 25) return 'MEDIUM'
    return 'LOW'
  }

  calculateTrend(currentScore, previousScore) {
    if (!previousScore) return 'stable'
    const diff = currentScore - previousScore
    if (diff > 5) return 'deteriorating'
    if (diff < -5) return 'improving'
    return 'stable'
  }

  getPreviousAssessment(store) {
    const assessments = Object.values(store.riskAssessments || {})
    if (assessments.length === 0) return null
    return assessments.sort((a, b) => new Date(b.assessed_at) - new Date(a.assessed_at))[0]
  }

  extractMetrics(store) {
    const drifts = Object.values(store.complianceDrifts || {})
    const openDrifts = drifts.filter(d => !d.drift_resolved_at)

    const alerts = Object.values(store.alerts || {})
    const criticalAlerts = alerts.filter(a => a.priority === 'P0' && !a.dismissed).length

    const investigations = Object.values(store.agentInvestigations || {})
    const truePositives = investigations.filter(i => i.verdict === 'true_positive').length

    const checks = Object.values(store.complianceChecks || {})
    const failedChecks = checks.filter(c => c.status === 'FAIL')
    const controlFailRate = checks.length > 0 ? Math.round((failedChecks.length / checks.length) * 100) : 0

    return {
      openDrifts: openDrifts.length,
      criticalAlerts,
      truePositives,
      controlFailRate
    }
  }

  saveAssessment(assessment) {
    const sql = `INSERT INTO risk_assessments (id, assessed_at, overall_score, risk_level, compliance_score, threat_score, posture_score, trend, open_drifts, critical_alerts, true_positives, control_fail_rate, factors, previous_score) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
    const params = [
      assessment.id,
      assessment.assessed_at,
      assessment.overall_score,
      assessment.risk_level,
      assessment.compliance_score,
      assessment.threat_score,
      assessment.posture_score,
      assessment.trend,
      assessment.open_drifts,
      assessment.critical_alerts,
      assessment.true_positives,
      assessment.control_fail_rate,
      JSON.stringify(assessment.factors),
      assessment.previous_score
    ]
    this.db.run(sql, params)
  }
}

export function initializeRiskAssessmentAgent(db, eventBus) {
  if (!riskAssessmentAgent) {
    riskAssessmentAgent = new RiskAssessmentAgent(db, eventBus)
    riskAssessmentAgent.startMonitoring()
  }
  return riskAssessmentAgent
}

export function getRiskAssessmentAgent() {
  return riskAssessmentAgent
}
