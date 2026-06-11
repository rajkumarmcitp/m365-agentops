/**
 * Database - Simple in-memory storage for Azure App Service compatibility
 * (No native dependencies - safe for Azure deployment)
 * Returns synchronous results to match better-sqlite3 API
 */

const store = {
  alerts: {},
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
    // Handle INSERT statements
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
    // Extract table and key from SQL like: SELECT * FROM alerts WHERE id = ?
    const tableMatch = sql.match(/FROM\s+(\w+)/i)
    const whereMatch = sql.match(/WHERE\s+(\w+)\s*=\s*\?/i)

    if (tableMatch && whereMatch) {
      const table = tableMatch[1]
      const key = params[0]
      const data = this.store[table] || {}
      return data[key] || null
    }

    // For COUNT queries
    if (sql.includes('COUNT(*)')) {
      return { count: 0 }
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
        'alerts': 'alerts'
      }

      const storeKey = tableMap[table] || table
      const data = this.store[storeKey] || {}

      let results = Object.values(data)

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
