/**
 * TenantGuard Correlation Jobs
 * Periodic correlation analysis
 */

import { CorrelationEngine } from './correlation-engine.js'
import { createCorrelationTables } from './correlation-schema.js'
import { getDatabase } from './database.js'
import { v4 as uuid } from 'uuid'

function initializeDemoData(db) {
  // Add demo correlations for testing
  const demoCorrelations = [
    {
      id: uuid(),
      correlation_type: 'MULTI_FACTOR_ATTACK',
      alert_ids: '["alert-1", "alert-2", "alert-3"]',
      actor: 'john.doe@nastech.onmicrosoft.com',
      target: 'Finance-Group@nastech.onmicrosoft.com',
      start_timestamp: new Date(Date.now() - 3600000).toISOString(),
      end_timestamp: new Date().toISOString(),
      alert_count: 3,
      correlation_score: 92,
      pattern_type: 'Privilege Escalation',
      risk_level: 'CRITICAL',
      description: 'Multiple failed login attempts followed by successful privileged role assignment',
      metadata: JSON.stringify({ source: 'demo', tactics: ['TA0003', 'TA0004'] })
    },
    {
      id: uuid(),
      correlation_type: 'DATA_EXFILTRATION',
      alert_ids: '["alert-4", "alert-5"]',
      actor: 'jane.smith@nastech.onmicrosoft.com',
      target: 'Confidential-Docs',
      start_timestamp: new Date(Date.now() - 7200000).toISOString(),
      end_timestamp: new Date(Date.now() - 3600000).toISOString(),
      alert_count: 2,
      correlation_score: 85,
      pattern_type: 'Data Access Anomaly',
      risk_level: 'HIGH',
      description: 'Unusual file access patterns and external sharing of sensitive documents',
      metadata: JSON.stringify({ source: 'demo', tactics: ['TA0010'] })
    },
    {
      id: uuid(),
      correlation_type: 'CREDENTIAL_COMPROMISE',
      alert_ids: '["alert-6", "alert-7", "alert-8"]',
      actor: 'admin@nastech.onmicrosoft.com',
      target: 'Exchange-Online',
      start_timestamp: new Date(Date.now() - 86400000).toISOString(),
      end_timestamp: new Date(Date.now() - 43200000).toISOString(),
      alert_count: 3,
      correlation_score: 78,
      pattern_type: 'Anomalous Sign-in',
      risk_level: 'HIGH',
      description: 'Multiple sign-in attempts from unusual locations with successful credential use',
      metadata: JSON.stringify({ source: 'demo', tactics: ['TA0006'] })
    }
  ]

  // Insert demo correlations
  demoCorrelations.forEach(corr => {
    db.prepare(`
      INSERT INTO alert_correlations
      (id, correlation_type, alert_ids, actor, target, start_timestamp, end_timestamp,
       alert_count, correlation_score, pattern_type, risk_level, description, metadata, dismissed)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      corr.id, corr.correlation_type, corr.alert_ids, corr.actor, corr.target,
      corr.start_timestamp, corr.end_timestamp, corr.alert_count, corr.correlation_score,
      corr.pattern_type, corr.risk_level, corr.description, corr.metadata, 0
    )
  })

  console.log(`✅ Initialized ${demoCorrelations.length} demo correlations`)
}

export function startCorrelationJobs() {
  console.log('🔗 Starting correlation analysis job (every 15 minutes)...')

  try {
    const db = getDatabase()
    createCorrelationTables(db)

    // Initialize demo data if empty
    const existingCorrelations = db.prepare('SELECT COUNT(*) as count FROM alert_correlations').all()
    if (!existingCorrelations || existingCorrelations[0]?.count === 0) {
      initializeDemoData(db)
    }

    const engine = new CorrelationEngine()

    // Run immediately
    engine.analyzeAlerts()

    // Then repeat every 15 minutes
    setInterval(() => {
      engine.analyzeAlerts()
    }, 15 * 60 * 1000)

    console.log('✅ Correlation job started')
  } catch (error) {
    console.error('❌ Failed to start correlation job:', error.message)
  }
}
