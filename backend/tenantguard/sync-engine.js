/**
 * TenantGuard Sync Engine
 * Orchestrates Graph API → Alert Detection → SharePoint Storage
 */

import {
  getAuditLogs,
  getRiskDetections,
  getRiskySignIns,
  getRiskyUsers,
  getServicePrincipals,
  getOAuth2PermissionGrants,
  testConnection
} from './graph-api-client.js'

import {
  detectAllAlerts,
  detectAlertsFromAuditLogs,
  detectAlertsFromRiskDetection
} from './real-alert-detector.js'

import {
  writeAlertsBatch,
  writeCorrelationsBatch,
  alertExists
} from './sharepoint-writer.js'

import {
  detectCorrelations
} from './correlation-engine.js'

/**
 * Full sync cycle: Fetch → Detect → Store
 * @returns {Promise<Object>} Sync results
 */
export async function fullSync() {
  console.log('\n🚀 Starting TenantGuard full sync...')
  const startTime = Date.now()

  try {
    // Test connection first
    const connected = await testConnection()
    if (!connected) {
      throw new Error('Graph API connection failed')
    }

    // Fetch data from Graph API
    console.log('📡 Fetching data from Graph API...')
    const graphData = await fetchGraphData()

    // Detect alerts from various sources
    console.log('🔍 Detecting alerts from Graph data...')
    const detectedAlerts = detectAllAlerts(graphData)

    // Detect correlations between alerts
    console.log('🔗 Detecting correlations between alerts...')
    const correlations = detectCorrelations(detectedAlerts)

    // Write to SharePoint
    console.log('💾 Writing to SharePoint Lists...')
    const alertResults = await writeAlertsBatch(detectedAlerts)
    const correlationResults = await writeCorrelationsBatch(correlations)

    const duration = Date.now() - startTime
    const summary = {
      success: true,
      timestamp: new Date().toISOString(),
      duration_ms: duration,
      stats: {
        alerts_detected: detectedAlerts.length,
        alerts_written: alertResults.filter(r => r.success).length,
        correlations_detected: correlations.length,
        correlations_written: correlationResults.filter(r => r.success).length
      },
      alerts: detectedAlerts,
      correlations: correlations
    }

    console.log(`✅ Sync complete in ${duration}ms`)
    console.log(`📊 Summary:`, summary.stats)

    return summary
  } catch (error) {
    console.error('❌ Sync failed:', error.message)
    return {
      success: false,
      error: error.message,
      timestamp: new Date().toISOString()
    }
  }
}

/**
 * Fetch all relevant data from Graph API
 * @returns {Promise<Object>}
 */
export async function fetchGraphData() {
  const data = {}

  try {
    console.log('  📋 Fetching audit logs...')
    data.auditLogs = await getAuditLogs({}, 7)
    console.log(`    ✓ Got ${data.auditLogs.length} audit logs`)

    console.log('  🔴 Fetching risk detections...')
    data.riskDetections = await getRiskDetections()
    console.log(`    ✓ Got ${data.riskDetections.length} risk detections`)

    console.log('  ⚠️ Fetching risky sign-ins...')
    data.riskySignIns = await getRiskySignIns()
    console.log(`    ✓ Got ${data.riskySignIns.length} risky sign-ins`)

    console.log('  👥 Fetching risky users...')
    data.riskyUsers = await getRiskyUsers()
    console.log(`    ✓ Got ${data.riskyUsers.length} risky users`)

    console.log('  🔌 Fetching service principals...')
    data.servicePrincipals = await getServicePrincipals()
    console.log(`    ✓ Got ${data.servicePrincipals.length} service principals`)

    console.log('  📱 Fetching OAuth grants...')
    data.oauthGrants = await getOAuth2PermissionGrants()
    console.log(`    ✓ Got ${data.oauthGrants.length} OAuth grants`)

  } catch (error) {
    console.error(`❌ Error fetching Graph data: ${error.message}`)
    throw error
  }

  return data
}

/**
 * Incremental sync - only fetch new data since last sync
 * @param {Date} lastSyncTime - Last sync timestamp
 * @returns {Promise<Object>}
 */
export async function incrementalSync(lastSyncTime) {
  console.log(`\n🔄 Starting incremental sync since ${lastSyncTime}...`)

  try {
    // Fetch only recent audit logs
    const auditLogs = await getAuditLogs({}, 1) // Last 1 day

    // Detect alerts
    const detectedAlerts = detectAlertsFromAuditLogs(auditLogs)

    // Check which alerts are new
    const newAlerts = []
    for (const alert of detectedAlerts) {
      const exists = await alertExists(alert.id)
      if (!exists) {
        newAlerts.push(alert)
      }
    }

    if (newAlerts.length === 0) {
      console.log('✓ No new alerts detected')
      return {
        success: true,
        alerts_detected: 0,
        timestamp: new Date().toISOString()
      }
    }

    // Detect correlations and write
    const correlations = detectCorrelations(newAlerts)
    const alertResults = await writeAlertsBatch(newAlerts)
    const correlationResults = await writeCorrelationsBatch(correlations)

    return {
      success: true,
      alerts_detected: newAlerts.length,
      alerts_written: alertResults.filter(r => r.success).length,
      correlations_detected: correlations.length,
      correlations_written: correlationResults.filter(r => r.success).length,
      timestamp: new Date().toISOString()
    }
  } catch (error) {
    console.error('❌ Incremental sync failed:', error.message)
    return {
      success: false,
      error: error.message,
      timestamp: new Date().toISOString()
    }
  }
}

/**
 * Schedule automatic syncs
 * @param {number} intervalMinutes - Interval in minutes
 */
export function scheduleAutoSync(intervalMinutes = 30) {
  console.log(`⏱️ Scheduling auto-sync every ${intervalMinutes} minutes...`)

  // Run immediately on startup
  fullSync()

  // Then run at intervals
  setInterval(() => {
    fullSync().catch(error => {
      console.error('Auto-sync failed:', error.message)
    })
  }, intervalMinutes * 60 * 1000)
}

export default {
  fullSync,
  fetchGraphData,
  incrementalSync,
  scheduleAutoSync
}
