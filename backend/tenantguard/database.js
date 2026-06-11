import Database from 'better-sqlite3'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const dbPath = path.join(__dirname, '../data/tenantguard.db')

let db = null

export function initDatabase() {
  db = new Database(dbPath)

  // Enable foreign keys
  db.pragma('foreign_keys = ON')

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
  return db
}

export function getDatabase() {
  if (!db) {
    throw new Error('Database not initialized. Call initDatabase() first.')
  }
  return db
}

export function closeDatabase() {
  if (db) {
    db.close()
    db = null
  }
}
