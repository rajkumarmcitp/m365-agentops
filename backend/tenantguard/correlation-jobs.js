/**
 * TenantGuard Correlation Jobs
 * Periodic correlation analysis
 */

import { CorrelationEngine } from './correlation-engine.js'
import { createCorrelationTables } from './correlation-schema.js'
import { getDatabase } from './database.js'

export function startCorrelationJobs() {
  console.log('🔗 Starting correlation analysis job (every 15 minutes)...')

  try {
    const db = getDatabase()
    createCorrelationTables(db)

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
