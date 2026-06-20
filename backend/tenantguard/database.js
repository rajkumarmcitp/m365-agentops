/**
 * Database - Simple in-memory storage for Azure App Service compatibility
 * (No native dependencies - safe for Azure deployment)
 * Returns synchronous results to match better-sqlite3 API
 */

const store = {
  alerts: {},
  correlations: {},
  auditLogs: {},
  dashboardCache: {},
  attestations: {},
  agentLogs: {},
  userSettings: {},
  userSession: null
}

export async function initDatabase() {
  console.log('✅ Database initialized (in-memory mode)')
  return store
}

class DatabaseWrapper {
  constructor() {
    this.store = store
  }

  run(sql, params = []) {
    // Handle INSERT INTO alerts
    if (sql.includes('INSERT INTO alerts')) {
      this.store.alerts = this.store.alerts || {}
      const [id, type, severity, score, headline, description, riskAssessment, recommendations, actor, timestamp, rawEvent, priority] = params
      this.store.alerts[id] = {
        id,
        type,
        severity,
        score,
        priority: priority || 'P3',
        headline,
        description,
        risk_assessment: riskAssessment,
        recommendations,
        actor,
        action_timestamp: timestamp,
        raw_event: rawEvent,
        dismissed: 0,
        created_at: new Date().toISOString()
      }
      console.log(`✓ Stored alert: ${headline}`)
      return { lastID: 1, changes: 1 }
    }

    // Handle INSERT INTO alert_correlations
    if (sql.includes('INSERT') && sql.includes('alert_correlations')) {
      this.store.correlations = this.store.correlations || {}
      const [id, correlation_type, alert_ids, actor, target, start_timestamp, end_timestamp, alert_count, correlation_score, pattern_type, risk_level, description, metadata] = params
      this.store.correlations[id] = {
        id,
        correlation_type,
        alert_ids,
        actor,
        target,
        start_timestamp,
        end_timestamp,
        alert_count,
        correlation_score,
        pattern_type,
        risk_level,
        description,
        metadata,
        dismissed: 0,
        created_at: new Date().toISOString()
      }
      console.log(`✓ Stored correlation: ${description}`)
      return { lastID: 1, changes: 1 }
    }

    // Handle INSERT statements for audit logs
    if (sql.includes('INSERT') && sql.includes('audit_logs_cache')) {
      const [id, source, operation, actor, target, timestamp, rawData] = params
      this.store.auditLogs = this.store.auditLogs || {}
      this.store.auditLogs[id] = {
        id,
        source,
        operation_name: operation,
        actor,
        target,
        timestamp,
        raw_data: rawData
      }
      console.log(`✓ Stored audit log: ${operation}`)
      return { lastID: 1, changes: 1 }
    }
    return { lastID: 1, changes: 1 }
  }

  get(sql, params = []) {
    // Handle COUNT(*) queries with WHERE clause
    if (sql.includes('COUNT(*)')) {
      const tableMatch = sql.match(/FROM\s+(\w+)/i)
      if (!tableMatch) return { count: 0 }

      const table = tableMatch[1]
      const data = this.store[table] || {}

      // Parse WHERE clause (e.g., WHERE severity = 'CRITICAL' AND dismissed = 0)
      let count = Object.values(data).length

      if (sql.includes('WHERE')) {
        if (sql.includes("severity = 'CRITICAL'")) {
          count = Object.values(data).filter(a => a.severity === 'CRITICAL' && !a.dismissed).length
        } else if (sql.includes("severity = 'HIGH'")) {
          count = Object.values(data).filter(a => a.severity === 'HIGH' && !a.dismissed).length
        } else if (sql.includes("severity = 'MEDIUM'")) {
          count = Object.values(data).filter(a => a.severity === 'MEDIUM' && !a.dismissed).length
        } else if (sql.includes("severity = 'INFO'")) {
          count = Object.values(data).filter(a => a.severity === 'INFO' && !a.dismissed).length
        }
      }

      return { count }
    }

    // Extract table and key from SQL like: SELECT * FROM alerts WHERE id = ?
    const tableMatch = sql.match(/FROM\s+(\w+)/i)
    const whereMatch = sql.match(/WHERE\s+(\w+)\s*=\s*\?/i)

    if (tableMatch && whereMatch) {
      const table = tableMatch[1]
      const key = params[0]

      const tableMap = {
        'alerts': 'alerts',
        'audit_logs_cache': 'auditLogs'
      }
      const storeKey = tableMap[table] || table
      const data = this.store[storeKey] || {}
      return data[key] || null
    }

    return null
  }

  all(sql, params = []) {
    const tableMatch = sql.match(/FROM\s+(\w+)/i)
    if (tableMatch) {
      const table = tableMatch[1]

      // Map table names to store keys
      const tableMap = {
        'audit_logs_cache': 'auditLogs',
        'alerts': 'alerts',
        'alert_correlations': 'correlations'
      }

      const storeKey = tableMap[table] || table
      const data = this.store[storeKey] || {}

      let results = Object.values(data)

      // Handle WHERE clause for severity/risk_level/priority filter
      if (sql.includes('WHERE') && sql.includes('severity')) {
        const severityMatch = sql.match(/severity\s*=\s*'([^']+)'/i)
        if (severityMatch) {
          const severity = severityMatch[1]
          results = results.filter(r => r.severity === severity && !r.dismissed)
        }
      } else if (sql.includes('WHERE') && sql.includes('risk_level')) {
        const riskMatch = sql.match(/risk_level\s*=\s*'([^']+)'/i)
        if (riskMatch) {
          const risk = riskMatch[1]
          results = results.filter(r => r.risk_level === risk && !r.dismissed)
        }
      } else if (sql.includes('WHERE') && sql.includes('priority')) {
        const priorityMatch = sql.match(/priority\s*=\s*'([^']+)'/i)
        if (priorityMatch) {
          const priority = priorityMatch[1]
          results = results.filter(r => r.priority === priority && !r.dismissed)
        }
      } else if (sql.includes('WHERE')) {
        // Filter out dismissed items by default
        results = results.filter(r => !r.dismissed)
      }

      // Handle ORDER BY clause
      if (sql.includes('ORDER BY')) {
        if (sql.includes('correlation_score')) {
          results = results.sort((a, b) => b.correlation_score - a.correlation_score)
        } else {
          // Default: reverse chronological
          results = results.sort((a, b) => {
            const aTime = new Date(a.action_timestamp || a.created_at).getTime()
            const bTime = new Date(b.action_timestamp || b.created_at).getTime()
            return bTime - aTime
          })
        }
      }

      // Handle LIMIT clause
      const limitMatch = sql.match(/LIMIT\s+(\d+)/i)
      if (limitMatch) {
        results = results.slice(0, parseInt(limitMatch[1]))
      }

      return results
    }
    return []
  }

  exec(sql) {
    // No-op for in-memory
    return undefined
  }

  prepare(sql) {
    return {
      run: (...params) => this.run(sql, params),
      get: (...params) => this.get(sql, params),
      all: (...params) => this.all(sql, params)
    }
  }

  close() {
    return undefined
  }
}

let db = null

export function getDatabase() {
  if (!db) {
    db = new DatabaseWrapper()
  }
  return db
}

export async function closeDatabase() {
  // No-op for in-memory
  db = null
}
