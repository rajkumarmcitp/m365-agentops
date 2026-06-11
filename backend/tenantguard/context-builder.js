/**
 * TenantGuard Context Builder
 * Retrieves and formats context from database for AI investigation
 */

import { getDatabase } from './database.js'

export class ContextBuilder {
  constructor() {
    this.db = getDatabase()
  }

  /**
   * Build comprehensive context for an alert
   */
  buildAlertContext(alertId) {
    const alert = this.db.prepare(
      'SELECT * FROM alerts WHERE id = ?'
    ).get(alertId)

    if (!alert) return null

    // Parse JSON fields
    const riskAssessment = this.safeJsonParse(alert.risk_assessment, {})
    const recommendations = this.safeJsonParse(alert.recommendations, [])

    // Get related correlations
    const correlations = this.db.prepare(`
      SELECT * FROM alert_correlations
      WHERE alert_ids LIKE ? AND dismissed = 0
      ORDER BY correlation_score DESC
    `).all(`%${alertId}%`)

    // Get actor's other recent alerts
    const actorAlerts = alert.actor ? this.db.prepare(`
      SELECT id, severity, score, headline, action_timestamp
      FROM alerts
      WHERE actor = ? AND dismissed = 0
      ORDER BY action_timestamp DESC
      LIMIT 15
    `).all(alert.actor) : []

    return {
      alert: {
        id: alert.id,
        headline: alert.headline,
        severity: alert.severity,
        score: alert.score,
        description: alert.description,
        type: alert.type,
        actor: alert.actor,
        timestamp: alert.action_timestamp,
        risk_assessment: riskAssessment,
        recommendations: recommendations
      },
      relatedCorrelations: correlations,
      actorHistory: actorAlerts,
      summary: this.summarizeAlert(alert, riskAssessment, recommendations)
    }
  }

  /**
   * Build comprehensive context for a correlation
   */
  buildCorrelationContext(correlationId) {
    const corr = this.db.prepare(
      'SELECT * FROM alert_correlations WHERE id = ?'
    ).get(correlationId)

    if (!corr) return null

    // Parse metadata
    const metadata = this.safeJsonParse(corr.metadata, {})

    // Get all related alerts
    const alertIds = corr.alert_ids.split(',').filter(id => id.trim())
    const alerts = alertIds.length > 0 ? this.db.prepare(`
      SELECT id, severity, score, headline, actor, action_timestamp, description
      FROM alerts
      WHERE id IN (${alertIds.map(() => '?').join(',')})
      ORDER BY action_timestamp DESC
    `).all(...alertIds) : []

    // Get actor timeline if applicable
    const timeline = corr.actor ? this.db.prepare(`
      SELECT id, severity, score, headline, action_timestamp
      FROM alerts
      WHERE actor = ? AND action_timestamp BETWEEN ? AND ?
      ORDER BY action_timestamp DESC
    `).all(corr.actor, corr.start_timestamp, corr.end_timestamp) : []

    return {
      correlation: {
        id: corr.id,
        type: corr.correlation_type,
        pattern: corr.pattern_type,
        severity: corr.risk_level,
        score: corr.correlation_score,
        description: corr.description,
        alerts_count: corr.alert_count,
        actor: corr.actor,
        target: corr.target,
        start_time: corr.start_timestamp,
        end_time: corr.end_timestamp,
        metadata: metadata
      },
      alerts: alerts,
      timeline: timeline,
      summary: this.summarizeCorrelation(corr, alerts, metadata)
    }
  }

  /**
   * Get detailed actor profile
   */
  getActorProfile(actor) {
    if (!actor) return null

    const alertCounts = this.db.prepare(`
      SELECT severity, COUNT(*) as count
      FROM alerts
      WHERE actor = ? AND dismissed = 0
      GROUP BY severity
    `).all(actor)

    const recentActivity = this.db.prepare(`
      SELECT id, severity, score, headline, action_timestamp
      FROM alerts
      WHERE actor = ? AND dismissed = 0
      ORDER BY action_timestamp DESC
      LIMIT 20
    `).all(actor)

    const avgScore = this.db.prepare(`
      SELECT AVG(score) as avg_score FROM alerts
      WHERE actor = ? AND dismissed = 0
    `).get(actor)

    return {
      actor,
      alertCounts: Object.fromEntries(alertCounts.map(a => [a.severity, a.count])),
      recentActivity,
      avgRiskScore: Math.round(avgScore?.avg_score || 0),
      lastActive: recentActivity[0]?.action_timestamp,
      totalAlerts: recentActivity.length
    }
  }

  /**
   * Get incident timeline
   */
  getIncidentTimeline(startTime, endTime, actor = null) {
    let query = `
      SELECT id, severity, score, headline, actor, action_timestamp
      FROM alerts
      WHERE action_timestamp BETWEEN ? AND ?
      AND dismissed = 0
    `
    const params = [startTime, endTime]

    if (actor) {
      query += ` AND actor = ?`
      params.push(actor)
    }

    query += ` ORDER BY action_timestamp DESC`

    const events = this.db.prepare(query).all(...params)

    return events.map((e, i) => ({
      sequence: i + 1,
      time: e.action_timestamp,
      severity: e.severity,
      score: e.score,
      actor: e.actor,
      action: e.headline
    }))
  }

  /**
   * Summarize alert for context
   */
  summarizeAlert(alert, riskAssessment, recommendations) {
    return `
=== ALERT DETAILS ===
ID: ${alert.id}
Severity: ${alert.severity} (Risk Score: ${alert.score}/100)
Type: ${alert.type}
Actor: ${alert.actor || 'System'}
Timestamp: ${alert.action_timestamp}

Headline: ${alert.headline}

Description:
${alert.description}

Risk Assessment:
- Privilege Impact: ${riskAssessment.levels?.privilege || 'Unknown'}
- Security Impact: ${riskAssessment.levels?.security || 'Unknown'}
- Data Impact: ${riskAssessment.levels?.data || 'Unknown'}
${riskAssessment.impacts ? `- Impacts: ${riskAssessment.impacts.join(', ')}` : ''}

Recommended Actions:
${recommendations.length > 0 ? recommendations.map((r, i) => `${i + 1}. ${r}`).join('\n') : 'N/A'}
`
  }

  /**
   * Summarize correlation for context
   */
  summarizeCorrelation(corr, alerts, metadata) {
    return `
=== CORRELATION DETAILS ===
ID: ${corr.id}
Type: ${corr.correlation_type}
Pattern Detected: ${corr.pattern_type}
Risk Level: ${corr.risk_level} (Score: ${corr.correlation_score}/100)

Description: ${corr.description}

Related Alerts: ${corr.alert_count}
Time Window: ${corr.start_timestamp} to ${corr.end_timestamp}
Actor: ${corr.actor || 'Multiple'}
Target: ${corr.target || 'Multiple'}

Timeline of Events:
${alerts.map((a, i) => `${i + 1}. [${a.severity}] ${a.headline} (${a.action_timestamp})`).join('\n')}

Analysis Context:
${JSON.stringify(metadata, null, 2)}
`
  }

  /**
   * Safe JSON parsing with fallback
   */
  safeJsonParse(jsonStr, fallback = {}) {
    try {
      return jsonStr ? JSON.parse(jsonStr) : fallback
    } catch (e) {
      return fallback
    }
  }

  /**
   * Format context for Claude
   */
  formatContextForAgent(context) {
    if (!context) return ''

    if (context.alert) {
      return context.summary
    } else if (context.correlation) {
      return context.summary
    }

    return ''
  }
}
