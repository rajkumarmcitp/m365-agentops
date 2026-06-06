// ============================================================
// Audit Logging System
// Comprehensive audit trail for compliance and tracking
// ============================================================

// In-memory audit log (replace with database in production)
let auditLogs = []
let auditCounter = 0

// ============================================================
// Audit Log Actions
// ============================================================
const AUDIT_ACTIONS = {
  // Request lifecycle
  REQUEST_SUBMITTED: 'Service request submitted',
  REQUEST_AUTO_APPROVED: 'Request auto-approved by agent',
  REQUEST_STEP_APPROVED: 'Request step approved by user',
  REQUEST_APPROVED: 'Request fully approved',
  REQUEST_REJECTED: 'Request rejected',
  REQUEST_COMMENT_ADDED: 'Comment added to request',

  // Provisioning
  PROVISIONING_STARTED: 'System provisioning started',
  PROVISIONING_COMPLETED: 'System provisioning completed',
  PROVISIONING_FAILED: 'System provisioning failed',

  // Agent actions
  AGENT_VALIDATION_RUN: 'Agent validation executed',
  AGENT_RISK_ASSESSMENT: 'Agent risk assessment completed',

  // User actions
  USER_LOGIN: 'User login',
  USER_LOGOUT: 'User logout',
  SETTINGS_CHANGED: 'Settings changed',

  // Admin actions
  ADMIN_OVERRIDE: 'Admin override applied',
  AUDIT_LOG_VIEWED: 'Audit log viewed',
  REPORT_GENERATED: 'Report generated',

  // System
  SYSTEM_ERROR: 'System error occurred',
  QUOTA_EXCEEDED: 'Service quota exceeded',
  RATE_LIMIT_HIT: 'Rate limit hit'
}

// ============================================================
// Create Audit Log Entry
// ============================================================
export function createAuditLog(entry) {
  const id = `AUDIT-${++auditCounter}`
  const now = new Date().toISOString()

  const log = {
    id,
    timestamp: now,
    action: entry.action,
    actionDescription: AUDIT_ACTIONS[entry.action] || entry.action,
    user: entry.user || 'SYSTEM',
    requestId: entry.requestId || null,
    details: entry.details || {},
    ipAddress: entry.ipAddress || 'N/A',
    userAgent: entry.userAgent || 'N/A',
    status: 'LOGGED'
  }

  auditLogs.push(log)

  // Log to console for monitoring
  console.log(`[AUDIT] ${log.timestamp} | ${log.action} | User: ${log.user} | Request: ${log.requestId || 'N/A'}`)

  return log
}

// ============================================================
// Audit Log Queries
// ============================================================
export function getAuditLogById(id) {
  return auditLogs.find(log => log.id === id)
}

export function listAuditLogs(filters = {}) {
  let result = [...auditLogs]

  // Filter by action
  if (filters.action) {
    result = result.filter(log => log.action === filters.action)
  }

  // Filter by user
  if (filters.user) {
    result = result.filter(log => log.user === filters.user)
  }

  // Filter by request
  if (filters.requestId) {
    result = result.filter(log => log.requestId === filters.requestId)
  }

  // Filter by action category
  if (filters.category) {
    const categories = {
      requests: ['REQUEST_SUBMITTED', 'REQUEST_AUTO_APPROVED', 'REQUEST_STEP_APPROVED', 'REQUEST_APPROVED', 'REQUEST_REJECTED', 'REQUEST_COMMENT_ADDED'],
      provisioning: ['PROVISIONING_STARTED', 'PROVISIONING_COMPLETED', 'PROVISIONING_FAILED'],
      agent: ['AGENT_VALIDATION_RUN', 'AGENT_RISK_ASSESSMENT'],
      admin: ['ADMIN_OVERRIDE', 'AUDIT_LOG_VIEWED', 'REPORT_GENERATED'],
      security: ['USER_LOGIN', 'USER_LOGOUT', 'SYSTEM_ERROR']
    }

    if (categories[filters.category]) {
      result = result.filter(log => categories[filters.category].includes(log.action))
    }
  }

  // Date range filter
  if (filters.startDate) {
    result = result.filter(log => new Date(log.timestamp) >= new Date(filters.startDate))
  }
  if (filters.endDate) {
    result = result.filter(log => new Date(log.timestamp) <= new Date(filters.endDate))
  }

  // Sort by most recent
  result.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))

  // Pagination
  const page = filters.page || 1
  const limit = filters.limit || 100
  const start = (page - 1) * limit
  const end = start + limit

  return {
    data: result.slice(start, end),
    total: result.length,
    page,
    limit,
    pages: Math.ceil(result.length / limit)
  }
}

// ============================================================
// Audit Log Search
// ============================================================
export function searchAuditLogs(query) {
  return auditLogs.filter(log => {
    return (
      log.id.toLowerCase().includes(query.toLowerCase()) ||
      log.user.toLowerCase().includes(query.toLowerCase()) ||
      log.action.toLowerCase().includes(query.toLowerCase()) ||
      log.requestId?.toLowerCase().includes(query.toLowerCase()) ||
      JSON.stringify(log.details).toLowerCase().includes(query.toLowerCase())
    )
  }).sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
}

// ============================================================
// Audit Log Statistics
// ============================================================
export function getAuditStats() {
  const stats = {
    total: auditLogs.length,
    byAction: groupByAction(),
    byUser: groupByUser(),
    byDay: groupByDay(),
    recentErrors: getRecentErrors(),
    activeUsers: getActiveUsers()
  }
  return stats
}

function groupByAction() {
  const groups = {}
  auditLogs.forEach(log => {
    groups[log.action] = (groups[log.action] || 0) + 1
  })
  return groups
}

function groupByUser() {
  const groups = {}
  auditLogs.forEach(log => {
    if (log.user !== 'SYSTEM') {
      groups[log.user] = (groups[log.user] || 0) + 1
    }
  })
  return groups
}

function groupByDay() {
  const groups = {}
  auditLogs.forEach(log => {
    const day = new Date(log.timestamp).toISOString().split('T')[0]
    groups[day] = (groups[day] || 0) + 1
  })
  return groups
}

function getRecentErrors() {
  return auditLogs
    .filter(log => log.action === 'SYSTEM_ERROR' || log.action === 'PROVISIONING_FAILED')
    .slice(0, 10)
}

function getActiveUsers() {
  const users = new Set()
  auditLogs.forEach(log => {
    if (log.user !== 'SYSTEM') users.add(log.user)
  })
  return Array.from(users)
}

// ============================================================
// Compliance Reports
// ============================================================
export function generateComplianceReport(startDate, endDate) {
  const start = new Date(startDate)
  const end = new Date(endDate)

  const logs = auditLogs.filter(log => {
    const logDate = new Date(log.timestamp)
    return logDate >= start && logDate <= end
  })

  return {
    period: { start: startDate, end: endDate },
    totalEvents: logs.length,
    eventsByAction: groupByActionInRange(logs),
    eventsByUser: groupByUserInRange(logs),
    requestsProcessed: logs.filter(l => l.requestId).length,
    uniqueUsers: new Set(logs.map(l => l.user).filter(u => u !== 'SYSTEM')).size,
    failedOperations: logs.filter(l => l.action.includes('FAILED')).length,
    rejectedRequests: logs.filter(l => l.action === 'REQUEST_REJECTED').length,
    autoApprovedRequests: logs.filter(l => l.action === 'REQUEST_AUTO_APPROVED').length
  }
}

function groupByActionInRange(logs) {
  const groups = {}
  logs.forEach(log => {
    groups[log.action] = (groups[log.action] || 0) + 1
  })
  return groups
}

function groupByUserInRange(logs) {
  const groups = {}
  logs.forEach(log => {
    if (log.user !== 'SYSTEM') {
      groups[log.user] = (groups[log.user] || 0) + 1
    }
  })
  return groups
}

// ============================================================
// Export all logs (for backup/archival)
// ============================================================
export function exportAuditLogs(format = 'json') {
  if (format === 'csv') {
    const headers = ['ID', 'Timestamp', 'Action', 'User', 'RequestID', 'Status']
    const rows = auditLogs.map(log => [
      log.id,
      log.timestamp,
      log.action,
      log.user,
      log.requestId || '',
      log.status
    ])
    return { headers, rows }
  }

  return auditLogs
}

// ============================================================
// Clear old logs (for maintenance)
// ============================================================
export function pruneAuditLogs(daysToKeep = 90) {
  const cutoffDate = new Date()
  cutoffDate.setDate(cutoffDate.getDate() - daysToKeep)

  const removed = auditLogs.filter(log => new Date(log.timestamp) < cutoffDate).length
  auditLogs = auditLogs.filter(log => new Date(log.timestamp) >= cutoffDate)

  createAuditLog({
    action: 'SYSTEM_MAINTENANCE',
    user: 'SYSTEM',
    details: {
      operation: 'Log pruning',
      logsRemoved: removed,
      retentionDays: daysToKeep
    }
  })

  return { removed, retained: auditLogs.length }
}
