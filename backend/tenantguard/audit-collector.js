import { getDatabase } from './database.js'
import { v4 as uuid } from 'uuid'

export class AuditCollector {
  constructor(graphClient) {
    this.graphClient = graphClient
  }

  /**
   * Collect audit data from Graph API
   */
  async collectAuditData() {
    console.log('📡 Collecting audit data...')

    try {
      const db = getDatabase()
      const results = {
        audits: 0,
        signIns: 0,
        risks: 0
      }

      // 1. Fetch directory audits (last 30 minutes)
      try {
        const thirtyMinutesAgo = new Date(Date.now() - 30 * 60 * 1000)
        const audits = await this.graphClient
          .api('/auditLogs/directoryAudits')
          .filter(`activityDateTime gt ${thirtyMinutesAgo.toISOString()}`)
          .top(100)
          .get()

        const stmt = db.prepare(`
          INSERT OR IGNORE INTO audit_logs_cache
          (id, source, operation_name, actor, target, timestamp, raw_data)
          VALUES (?, ?, ?, ?, ?, ?, ?)
        `)

        for (const audit of audits.value || []) {
          const logId = audit.id || uuid()
          try {
            // Extract operation name - try multiple fields
            const operationName = audit.activityDisplayName ||
                                audit.activity ||
                                audit.operationName ||
                                'Unknown Operation'

            // Extract target - check multiple sources
            const target = audit.targetResources?.[0]?.displayName ||
                          audit.targetResources?.[0]?.id ||
                          audit.targetDisplayName ||
                          ''

            stmt.run(
              logId,
              'graph',
              operationName,
              audit.initiatedBy?.user?.userPrincipalName || 'System',
              target,
              audit.activityDateTime,
              JSON.stringify(audit)
            )
            results.audits++
            console.log(`  ✓ Stored audit: ${operationName}`)
          } catch (e) {
            // Ignore duplicate key errors
            if (!e.message.includes('UNIQUE')) {
              console.error('Error inserting audit log:', e.message)
            }
          }
        }
      } catch (error) {
        console.warn('⚠️ Error collecting audits:', error.message)
      }

      // 2. Fetch sign-in logs
      try {
        const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000)
        const signIns = await this.graphClient
          .api('/auditLogs/signIns')
          .filter(`createdDateTime gt ${fiveMinutesAgo.toISOString()}`)
          .top(100)
          .get()

        const stmt = db.prepare(`
          INSERT OR IGNORE INTO audit_logs_cache
          (id, source, operation_name, actor, target, timestamp, raw_data)
          VALUES (?, ?, ?, ?, ?, ?, ?)
        `)

        for (const signIn of signIns.value || []) {
          // Only log high-risk sign-ins
          if (signIn.riskLevelDuringSignIn === 'high' || signIn.riskLevelDuringSignIn === 'medium') {
            const logId = signIn.id || uuid()
            try {
              stmt.run(
                logId,
                'graph',
                'Risky sign-in detected',
                signIn.userPrincipalName,
                signIn.ipAddress,
                signIn.createdDateTime,
                JSON.stringify(signIn)
              )
              results.signIns++
            } catch (e) {
              if (!e.message.includes('UNIQUE')) {
                console.error('Error inserting sign-in log:', e.message)
              }
            }
          }
        }
      } catch (error) {
        console.warn('⚠️ Error collecting sign-ins:', error.message)
      }

      console.log(`✅ Collection complete: ${results.audits} audits, ${results.signIns} sign-ins`)
      return results
    } catch (error) {
      console.error('❌ Collection failed:', error.message)
      throw error
    }
  }
}
