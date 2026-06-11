import sqlite3 from 'sqlite3'
import path from 'path'
import { fileURLToPath } from 'url'
import { mkdir } from 'fs/promises'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const dbDir = path.join(__dirname, '../data')
const dbPath = path.join(dbDir, 'tenantguard.db')

let db = null

const promisify = (fn) => (...args) => new Promise((resolve, reject) => {
  fn(...args, (err, result) => err ? reject(err) : resolve(result))
})

export async function initDatabase() {
  await mkdir(dbDir, { recursive: true })

  return new Promise((resolve, reject) => {
    db = new sqlite3.Database(dbPath, (err) => {
      if (err) return reject(err)

      db.run('PRAGMA foreign_keys = ON', (err) => {
        if (err) return reject(err)

        // Create tables
        db.exec(`
    CREATE TABLE IF NOT EXISTS alerts (
      id TEXT PRIMARY KEY,
      type TEXT,
      severity TEXT,
      score INTEGER,
      headline TEXT,
      description TEXT,
      risk_assessment TEXT,
      recommendations TEXT,
      actor TEXT,
      action_timestamp TEXT,
      detected_timestamp TEXT DEFAULT CURRENT_TIMESTAMP,
      raw_event TEXT,
      dismissed INTEGER DEFAULT 0,
      dismissed_at TEXT,
      dismissed_by TEXT,
      investigation_status TEXT DEFAULT 'pending',
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT DEFAULT CURRENT_TIMESTAMP
    );

    CREATE INDEX IF NOT EXISTS idx_severity ON alerts(severity);
    CREATE INDEX IF NOT EXISTS idx_timestamp ON alerts(action_timestamp);
    CREATE INDEX IF NOT EXISTS idx_dismissed ON alerts(dismissed);

    CREATE TABLE IF NOT EXISTS audit_logs_cache (
      id TEXT PRIMARY KEY,
      source TEXT,
      operation_name TEXT,
      actor TEXT,
      target TEXT,
      timestamp TEXT,
      raw_data TEXT,
      processed INTEGER DEFAULT 0,
      alert_id TEXT,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP
    );

    CREATE INDEX IF NOT EXISTS idx_processed ON audit_logs_cache(processed);

    CREATE TABLE IF NOT EXISTS dashboard_cache (
      id TEXT PRIMARY KEY,
      data_type TEXT,
      data_key TEXT,
      data_value TEXT,
      last_synced TEXT,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
      UNIQUE(data_type, data_key)
    );

    CREATE TABLE IF NOT EXISTS m365_attestations (
      id TEXT PRIMARY KEY,
      control_id TEXT,
      status TEXT,
      result TEXT,
      notes TEXT,
      attested_by TEXT,
      attested_at TEXT,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
      UNIQUE(control_id)
    );

    CREATE TABLE IF NOT EXISTS agent_logs (
      id TEXT PRIMARY KEY,
      job_name TEXT,
      schedule TEXT,
      start_time TEXT,
      end_time TEXT,
      status TEXT,
      controls_checked INTEGER,
      failures_found INTEGER,
      new_failures INTEGER,
      logs TEXT,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP
    );

    CREATE INDEX IF NOT EXISTS idx_agent_date ON agent_logs(start_time);

    CREATE TABLE IF NOT EXISTS user_settings (
      id TEXT PRIMARY KEY,
      setting_key TEXT UNIQUE,
      setting_value TEXT,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS user_session (
      id TEXT PRIMARY KEY,
      user_id TEXT,
      user_name TEXT,
      user_email TEXT,
      user_role TEXT,
      last_active TEXT,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT DEFAULT CURRENT_TIMESTAMP
    );
        `)

        console.log('✅ Database initialized:', dbPath)
        resolve(db)
      })
    })
  })
}

class DatabaseWrapper {
  constructor(db) {
    this.db = db
  }

  run(sql, params = []) {
    return new Promise((resolve, reject) => {
      this.db.run(sql, params, function(err) {
        if (err) reject(err)
        else resolve({ lastID: this.lastID, changes: this.changes })
      })
    })
  }

  get(sql, params = []) {
    return new Promise((resolve, reject) => {
      this.db.get(sql, params, (err, row) => {
        if (err) reject(err)
        else resolve(row)
      })
    })
  }

  all(sql, params = []) {
    return new Promise((resolve, reject) => {
      this.db.all(sql, params, (err, rows) => {
        if (err) reject(err)
        else resolve(rows || [])
      })
    })
  }

  exec(sql) {
    return new Promise((resolve, reject) => {
      this.db.exec(sql, (err) => {
        if (err) reject(err)
        else resolve()
      })
    })
  }

  prepare(sql) {
    return {
      run: (...params) => this.run(sql, params),
      get: (...params) => this.get(sql, params),
      all: (...params) => this.all(sql, params)
    }
  }

  close() {
    return new Promise((resolve, reject) => {
      if (this.db) {
        this.db.close((err) => {
          if (err) reject(err)
          else resolve()
        })
      } else {
        resolve()
      }
    })
  }
}

export function getDatabase() {
  if (!db) {
    throw new Error('Database not initialized. Call initDatabase() first.')
  }
  return new DatabaseWrapper(db)
}

export async function closeDatabase() {
  if (db) {
    await new Promise((resolve, reject) => {
      db.close((err) => {
        if (err) reject(err)
        else resolve()
      })
    })
    db = null
  }
}
