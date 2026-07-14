/**
 * Audit Logger
 * Comprehensive logging of all compliance-related actions for compliance trail
 */

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const AUDIT_DIR = path.join(__dirname, '../../data/audit-logs')
const AUDIT_INDEX = path.join(AUDIT_DIR, 'index.json')

// Ensure audit logs directory exists
if (!fs.existsSync(AUDIT_DIR)) {
  fs.mkdirSync(AUDIT_DIR, { recursive: true })
}

// Action types for audit trail
export const AUDIT_ACTIONS = {
  // Exception actions
  EXCEPTION_REQUESTED: 'exception_requested',
  EXCEPTION_APPROVED: 'exception_approved',
  EXCEPTION_REJECTED: 'exception_rejected',
  EXCEPTION_EXPIRED: 'exception_auto_expired',

  // Validation actions
  VALIDATION_STARTED: 'validation_started',
  VALIDATION_COMPLETED: 'validation_completed',
  VALIDATION_FAILED: 'validation_failed',

  // Control actions
  CONTROL_VALIDATED: 'control_validated',
  CONTROL_REMEDIATED: 'control_remediated',
  CONTROL_MANUAL_VALIDATION: 'control_manual_validation',

  // Framework actions (NEW)
  FRAMEWORK_ALIGNMENT_CHANGED: 'framework_alignment_changed',
  FRAMEWORK_COMPLIANCE_CHANGED: 'framework_compliance_changed',
  CONTROL_MAPPING_UPDATED: 'control_mapping_updated',
  FRAMEWORK_COVERAGE_CHANGED: 'framework_coverage_changed',

  // Settings actions
  SETTINGS_CHANGED: 'settings_changed',
  CONFIGURATION_UPDATED: 'configuration_updated',

  // Access actions
  USER_ACCESSED_REPORT: 'user_accessed_report',
  USER_EXPORTED_DATA: 'user_exported_data'
}

// In-memory storage (replace with database in production)
let auditLogs = []

/**
 * Log an audit event
 */
export function logAction(data) {
  try {
    const {
      action,
      actor,
      resourceId,
      resourceType,
      description,
      details = {},
      severity = 'info',
      status = 'success'
    } = data

    if (!action || !actor) {
      throw new Error('Missing required fields: action, actor')
    }

    const logEntry = {
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date().toISOString(),
      action,
      actor,
      resourceId,
      resourceType,
      description,
      details,
      severity, // info, warning, error
      status, // success, failure
      ipAddress: details.ipAddress || 'unknown',
      userAgent: details.userAgent || 'unknown'
    }

    auditLogs.push(logEntry)
    updateAuditIndex(logEntry)

    console.log(`📝 Audit: ${action} by ${actor}`)

    // Asynchronously save to SharePoint (non-blocking)
    if (global.graphClient && global.sharePointSiteId && global.auditLogsListId) {
      saveToSharePointAsync(logEntry).catch(e => console.warn('⚠️ Could not save audit log to SharePoint:', e.message))
    }

    return logEntry
  } catch (error) {
    console.error(`❌ Failed to log audit action:`, error.message)
    throw error
  }
}

/**
 * Save audit log to SharePoint asynchronously
 */
async function saveToSharePointAsync(logEntry) {
  try {
    const itemData = {
      fields: {
        LogID: logEntry.id,
        Timestamp: logEntry.timestamp,
        Action: logEntry.action,
        Actor: logEntry.actor,
        ResourceID: logEntry.resourceId || '',
        ResourceType: logEntry.resourceType || '',
        Description: logEntry.description || '',
        Details: JSON.stringify(logEntry.details || {}),
        Severity: logEntry.severity?.toUpperCase() || 'INFO',
        Status: logEntry.status?.toUpperCase() || 'SUCCESS'
      }
    }

    await global.graphClient.api(
      `/sites/${global.sharePointSiteId}/lists/${global.auditLogsListId}/items`
    ).post(itemData)

    console.log(`✓ Audit log saved to SharePoint: ${logEntry.id}`)
  } catch (error) {
    console.warn(`⚠️ Failed to save audit log to SharePoint:`, error.message)
  }
}

/**
 * Update audit index for quick lookups
 */
function updateAuditIndex(logEntry) {
  try {
    let index = []

    if (fs.existsSync(AUDIT_INDEX)) {
      const data = fs.readFileSync(AUDIT_INDEX, 'utf-8')
      index = JSON.parse(data)
    }

    index.push({
      id: logEntry.id,
      timestamp: logEntry.timestamp,
      action: logEntry.action,
      actor: logEntry.actor,
      resourceId: logEntry.resourceId,
      resourceType: logEntry.resourceType,
      status: logEntry.status,
      severity: logEntry.severity
    })

    // Sort by timestamp descending
    index.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))

    // Keep last 10,000 entries
    if (index.length > 10000) {
      index = index.slice(0, 10000)
    }

    fs.writeFileSync(AUDIT_INDEX, JSON.stringify(index, null, 2))
  } catch (error) {
    console.warn(`⚠️ Failed to update audit index:`, error.message)
  }
}

/**
 * Get all audit logs with optional filtering
 */
export function getAuditLogs(filters = {}) {
  try {
    let results = auditLogs

    const { action, actor, resourceId, resourceType, status, severity, limit = 100 } = filters

    if (action) {
      results = results.filter(log => log.action === action)
    }
    if (actor) {
      results = results.filter(log => log.actor === actor)
    }
    if (resourceId) {
      results = results.filter(log => log.resourceId === resourceId)
    }
    if (resourceType) {
      results = results.filter(log => log.resourceType === resourceType)
    }
    if (status) {
      results = results.filter(log => log.status === status)
    }
    if (severity) {
      results = results.filter(log => log.severity === severity)
    }

    // Sort by timestamp descending and apply limit
    return results.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp)).slice(0, limit)
  } catch (error) {
    console.error(`❌ Failed to get audit logs:`, error.message)
    throw error
  }
}

/**
 * Get audit logs by date range
 */
export function getAuditLogsByDateRange(startDate, endDate, limit = 100) {
  try {
    const start = new Date(startDate)
    const end = new Date(endDate)

    const results = auditLogs.filter(log => {
      const logDate = new Date(log.timestamp)
      return logDate >= start && logDate <= end
    })

    return results.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp)).slice(0, limit)
  } catch (error) {
    console.error(`❌ Failed to get audit logs by date range:`, error.message)
    throw error
  }
}

/**
 * Get audit logs by user
 */
export function getAuditLogsByUser(actor, limit = 100) {
  return getAuditLogs({ actor, limit })
}

/**
 * Get audit logs by resource
 */
export function getAuditLogsByResource(resourceId, limit = 100) {
  return getAuditLogs({ resourceId, limit })
}

/**
 * Get audit log by ID
 */
export function getAuditLogById(logId) {
  return auditLogs.find(log => log.id === logId)
}

/**
 * Get audit statistics
 */
export function getAuditStats() {
  const total = auditLogs.length

  if (total === 0) {
    return {
      total: 0,
      byAction: {},
      byActor: {},
      byStatus: { success: 0, failure: 0 },
      bySeverity: { info: 0, warning: 0, error: 0 },
      last24Hours: 0,
      last7Days: 0,
      lastFailure: null
    }
  }

  const now = new Date()
  const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000)
  const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)

  const byAction = {}
  const byActor = {}
  const byStatus = { success: 0, failure: 0 }
  const bySeverity = { info: 0, warning: 0, error: 0 }

  let last24Hours = 0
  let last7Days = 0
  let lastFailure = null

  auditLogs.forEach(log => {
    // Count by action
    byAction[log.action] = (byAction[log.action] || 0) + 1

    // Count by actor
    byActor[log.actor] = (byActor[log.actor] || 0) + 1

    // Count by status
    byStatus[log.status] = (byStatus[log.status] || 0) + 1

    // Count by severity
    bySeverity[log.severity] = (bySeverity[log.severity] || 0) + 1

    // Time-based counts
    const logDate = new Date(log.timestamp)
    if (logDate >= oneDayAgo) last24Hours++
    if (logDate >= sevenDaysAgo) last7Days++

    // Last failure
    if (log.status === 'failure' && (!lastFailure || new Date(log.timestamp) > new Date(lastFailure.timestamp))) {
      lastFailure = log
    }
  })

  return {
    total,
    byAction,
    byActor,
    byStatus,
    bySeverity,
    last24Hours,
    last7Days,
    lastFailure
  }
}

/**
 * Export audit logs for compliance reporting
 */
export function exportAuditLogs(format = 'json', filters = {}) {
  try {
    const logs = getAuditLogs({ limit: 10000, ...filters })

    if (format === 'csv') {
      // Convert to CSV
      const headers = ['ID', 'Timestamp', 'Action', 'Actor', 'Resource ID', 'Resource Type', 'Status', 'Severity', 'Description']
      const rows = logs.map(log =>
        [
          log.id,
          log.timestamp,
          log.action,
          log.actor,
          log.resourceId || '',
          log.resourceType || '',
          log.status,
          log.severity,
          log.description || ''
        ].map(v => `"${String(v).replace(/"/g, '""')}"`)
      )

      return [headers.join(','), ...rows.map(r => r.join(','))].join('\n')
    }

    // Default to JSON
    return JSON.stringify(logs, null, 2)
  } catch (error) {
    console.error(`❌ Failed to export audit logs:`, error.message)
    throw error
  }
}

/**
 * Search audit logs
 */
export function searchAuditLogs(query, limit = 50) {
  try {
    const searchTerm = query.toLowerCase()

    return auditLogs
      .filter(log =>
        log.action.toLowerCase().includes(searchTerm) ||
        log.actor.toLowerCase().includes(searchTerm) ||
        (log.description && log.description.toLowerCase().includes(searchTerm)) ||
        (log.resourceId && log.resourceId.toLowerCase().includes(searchTerm))
      )
      .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
      .slice(0, limit)
  } catch (error) {
    console.error(`❌ Failed to search audit logs:`, error.message)
    throw error
  }
}

/**
 * Purge old audit logs
 */
export function purgeOldAuditLogs(olderThanDays = 365) {
  try {
    const cutoffDate = new Date()
    cutoffDate.setDate(cutoffDate.getDate() - olderThanDays)

    const before = auditLogs.length
    auditLogs = auditLogs.filter(log => new Date(log.timestamp) >= cutoffDate)
    const after = auditLogs.length
    const purged = before - after

    if (purged > 0) {
      updateAuditIndex({})
      console.log(`✓ Purged ${purged} old audit logs`)
    }

    return purged
  } catch (error) {
    console.error(`❌ Failed to purge old audit logs:`, error.message)
    throw error
  }
}

/**
 * Log framework alignment change
 */
export function logFrameworkAlignmentChange(framework, previousScore, newScore, changedControls) {
  return logAction({
    action: AUDIT_ACTIONS.FRAMEWORK_ALIGNMENT_CHANGED,
    actor: 'system',
    resourceId: framework,
    resourceType: 'framework',
    description: `Framework alignment changed: ${framework}`,
    details: {
      framework,
      previousCompliance: previousScore,
      newCompliance: newScore,
      change: newScore - previousScore,
      changedControlsCount: changedControls?.length || 0,
      changedControls: changedControls?.slice(0, 10) // Log first 10 changed controls
    },
    severity: Math.abs(newScore - previousScore) > 10 ? 'warning' : 'info',
    status: 'success'
  })
}

/**
 * Log framework compliance state change
 */
export function logFrameworkComplianceChange(framework, previousStatus, newStatus, details) {
  return logAction({
    action: AUDIT_ACTIONS.FRAMEWORK_COMPLIANCE_CHANGED,
    actor: 'system',
    resourceId: framework,
    resourceType: 'framework',
    description: `${framework} compliance status: ${previousStatus} → ${newStatus}`,
    details: {
      framework,
      previousStatus,
      newStatus,
      ...details
    },
    severity: newStatus === 'Non-Compliant' ? 'error' : newStatus === 'Partial' ? 'warning' : 'info',
    status: 'success'
  })
}

/**
 * Log control-to-framework mapping update
 */
export function logControlMappingUpdate(controlId, framework, action, reason) {
  return logAction({
    action: AUDIT_ACTIONS.CONTROL_MAPPING_UPDATED,
    actor: 'system',
    resourceId: controlId,
    resourceType: 'control_mapping',
    description: `Control ${controlId} mapping to ${framework}: ${action}`,
    details: {
      controlId,
      framework,
      action, // 'added', 'removed', 'updated'
      reason
    },
    severity: 'info',
    status: 'success'
  })
}

/**
 * Log framework coverage change
 */
export function logFrameworkCoverageChange(framework, previousCoverage, newCoverage, details) {
  return logAction({
    action: AUDIT_ACTIONS.FRAMEWORK_COVERAGE_CHANGED,
    actor: 'system',
    resourceId: framework,
    resourceType: 'framework_coverage',
    description: `${framework} coverage: ${previousCoverage}% → ${newCoverage}%`,
    details: {
      framework,
      previousCoverage,
      newCoverage,
      change: newCoverage - previousCoverage,
      ...details
    },
    severity: newCoverage < previousCoverage ? 'warning' : 'info',
    status: 'success'
  })
}

/**
 * Get framework audit logs
 */
export function getFrameworkAuditLogs(framework, limit = 100) {
  return getAuditLogs({
    resourceId: framework,
    resourceType: 'framework',
    limit
  })
}

/**
 * Get all framework changes in date range
 */
export function getFrameworkChangesInRange(startDate, endDate) {
  const start = new Date(startDate)
  const end = new Date(endDate)

  return auditLogs
    .filter(log => {
      const logDate = new Date(log.timestamp)
      return (
        logDate >= start &&
        logDate <= end &&
        [
          AUDIT_ACTIONS.FRAMEWORK_ALIGNMENT_CHANGED,
          AUDIT_ACTIONS.FRAMEWORK_COMPLIANCE_CHANGED,
          AUDIT_ACTIONS.CONTROL_MAPPING_UPDATED,
          AUDIT_ACTIONS.FRAMEWORK_COVERAGE_CHANGED
        ].includes(log.action)
      )
    })
    .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
}

/**
 * Generate compliance report
 */
export function generateComplianceReport(dateRange = { days: 30 }) {
  try {
    const now = new Date()
    const startDate = new Date(now.getTime() - dateRange.days * 24 * 60 * 60 * 1000)

    const logs = getAuditLogsByDateRange(startDate, now, 10000)
    const stats = getAuditStats()

    const exceptionLogs = logs.filter(l => l.action.startsWith('exception_'))
    const validationLogs = logs.filter(l => l.action.startsWith('validation_'))
    const controlLogs = logs.filter(l => l.action.startsWith('control_'))

    return {
      reportDate: new Date().toISOString(),
      period: `Last ${dateRange.days} days`,
      totalEvents: logs.length,
      summary: {
        exceptions: exceptionLogs.length,
        validations: validationLogs.length,
        controls: controlLogs.length,
        successRate: logs.length > 0 ? Math.round((stats.byStatus.success / logs.length) * 100) : 0
      },
      topActors: Object.entries(stats.byActor)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 10)
        .map(([actor, count]) => ({ actor, count })),
      topActions: Object.entries(stats.byAction)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 10)
        .map(([action, count]) => ({ action, count })),
      failures: logs.filter(l => l.status === 'failure'),
      warnings: logs.filter(l => l.severity === 'warning'),
      errors: logs.filter(l => l.severity === 'error')
    }
  } catch (error) {
    console.error(`❌ Failed to generate compliance report:`, error.message)
    throw error
  }
}
