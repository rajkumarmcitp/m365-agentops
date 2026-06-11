/**
 * Database - Simple in-memory storage for Azure App Service compatibility
 * (No native dependencies - safe for Azure deployment)
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
    return Promise.resolve({ lastID: 1, changes: 1 })
  }

  get(sql, params = []) {
    // Extract table and key from SQL
    const tableMatch = sql.match(/FROM\s+(\w+)/i)
    const whereMatch = sql.match(/WHERE\s+(\w+)\s*=\s*\?/i)

    if (tableMatch && whereMatch) {
      const table = tableMatch[1]
      const key = params[0]
      const data = this.store[table] || {}
      return Promise.resolve(data[key] || null)
    }
    return Promise.resolve(null)
  }

  all(sql, params = []) {
    const tableMatch = sql.match(/FROM\s+(\w+)/i)
    if (tableMatch) {
      const table = tableMatch[1]
      const data = this.store[table] || {}
      return Promise.resolve(Object.values(data))
    }
    return Promise.resolve([])
  }

  exec(sql) {
    return Promise.resolve()
  }

  prepare(sql) {
    return {
      run: (...params) => this.run(sql, params),
      get: (...params) => this.get(sql, params),
      all: (...params) => this.all(sql, params)
    }
  }

  close() {
    return Promise.resolve()
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
  if (db) {
    await db.close()
    db = null
  }
}
