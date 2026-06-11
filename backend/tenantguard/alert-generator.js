/**
 * Alert Generator - Creates alerts from audit logs
 */

import { getDatabase } from './database.js'
import { v4 as uuid } from 'uuid'

export class AlertGenerator {
  generateAlert(log, scoring) {
    const operation = log.operation_name || 'Unknown Operation'

    return {
      id: `alert-${uuid()}`,
      type: 'SUSPICIOUS_ACTIVITY',
      severity: scoring.severity || 'MEDIUM',
      score: scoring.score || 50,
      headline: operation,
      description: `Suspicious activity detected: ${operation} by ${log.actor}`,
      riskAssessment: JSON.stringify(scoring),
      recommendations: ['Review the activity', 'Check for unauthorized access'],
      actor: log.actor || 'Unknown',
      actionTimestamp: log.timestamp,
      detectedTimestamp: new Date().toISOString(),
      rawEvent: log.raw_data
    }
  }

  saveAlert(alert) {
    const db = getDatabase()

    try {
      db.prepare(`
        INSERT INTO alerts
        (id, type, severity, score, headline, description, risk_assessment, recommendations, actor, action_timestamp, detected_timestamp, raw_event)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `).run(
        alert.id,
        alert.type,
        alert.severity,
        alert.score,
        alert.headline,
        alert.description,
        alert.riskAssessment,
        JSON.stringify(alert.recommendations),
        alert.actor,
        alert.actionTimestamp,
        alert.detectedTimestamp,
        alert.rawEvent
      )

      return alert.id
    } catch (error) {
      console.error('Error saving alert:', error.message)
      return null
    }
  }
}
