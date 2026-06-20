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
      // INSERT order: id(0), type(1), severity(2), score(3), priority(4), headline(5), description(6),
      // risk_assessment(7), recommendations(8), actor(9), target(10), action_timestamp(11), raw_event(12), dismissed(13), created_at(14), category(15)

      // Auto-assign meaningful categories based on alert type if not provided
      const categoryMap = {
        'ROLE_CHANGE': 'Identity Management',
        'ADMIN_CHANGE': 'Identity Management',
        'POLICY_CHANGE': 'Security Policy',
        'AUTH_ANOMALY': 'Authentication',
        'DEVICE_POLICY': 'Device Management',
        'DEVICE_COMPLIANCE': 'Device Management',
        'DEVICE_SECURITY': 'Device Management',
        'DEVICE_MONITORING': 'Device Management',
        'TEAMS_POLICY': 'Collaboration',
        'TEAMS_APP': 'Collaboration',
        'SHARING_POLICY': 'Data Protection',
        'EXTERNAL_ACCESS': 'Data Protection',
        'DATA_EXFILTRATION': 'Data Protection',
        'ACCESS_CHANGE': 'Access Control',
        'SIGN_IN': 'Authentication',
        'RISK': 'Risk Detection',
        'AUDIT': 'Directory Audit'
      }

      const assignedCategory = params[15] || categoryMap[params[1]] || 'Unknown'

      this.store.alerts[params[0]] = {
        id: params[0],
        type: params[1],
        severity: params[2],
        score: params[3],
        priority: params[4] || 'P3',
        headline: params[5],
        description: params[6],
        risk_assessment: params[7],
        recommendations: params[8],
        actor: params[9],
        target: params[10],
        action_timestamp: params[11],
        raw_event: params[12],
        dismissed: params[13] || 0,
        created_at: params[14] || new Date().toISOString(),
        category: assignedCategory
      }
      console.log(`✓ Stored alert: ${params[5]} [${assignedCategory}]`)
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
