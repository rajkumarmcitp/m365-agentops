import { AuditCollector } from './audit-collector.js'
import { RiskScorer } from './risk-scorer.js'
import { AlertGenerator } from './alert-generator.js'
import { getDatabase } from './database.js'

export function startAuditCollectionJob(graphClient) {
  console.log('🚀 Starting audit collection job (every 5 minutes)...')

  const collector = new AuditCollector(graphClient)
  const scorer = new RiskScorer()
  const generator = new AlertGenerator()

  // Run immediately
  runCollection()

  // Then repeat every 5 minutes
  setInterval(runCollection, 5 * 60 * 1000)

  async function runCollection() {
    try {
      const db = getDatabase()
      const timestamp = new Date().toISOString()
      console.log(`\n📡 [${timestamp}] Collection cycle started`)

      // 1. Collect new audit data
      await collector.collectAuditData()

      // 2. Get unprocessed logs
      const unprocessed = db
        .prepare(`
          SELECT * FROM audit_logs_cache
          WHERE processed = 0
          ORDER BY timestamp DESC
          LIMIT 100
        `)
        .all()

      if (unprocessed.length === 0) {
        console.log('ℹ️ No new logs to process')
        return
      }

      console.log(`📊 Processing ${unprocessed.length} logs...`)

      let alertCount = 0
      for (const log of unprocessed) {
        const scoring = scorer.scoreEvent(log)

        if (scoring && scoring.score >= 50) {
          const alert = generator.generateAlert(log, scoring)
          const alertId = generator.saveAlert(alert)

          // Link alert to audit log
          db.prepare('UPDATE audit_logs_cache SET alert_id = ?, processed = 1 WHERE id = ?').run(
            alertId,
            log.id
          )

          alertCount++
          console.log(`  ✅ Alert: ${alert.headline}`)
        } else {
          // Mark as processed (not an alert)
          db.prepare('UPDATE audit_logs_cache SET processed = 1 WHERE id = ?').run(log.id)
        }
      }

      console.log(`✅ Cycle complete: Generated ${alertCount} alerts`)
    } catch (error) {
      console.error('❌ Collection cycle failed:', error.message)
    }
  }
}
