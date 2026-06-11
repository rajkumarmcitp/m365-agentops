/**
 * TenantGuard Investigation Schema
 * Database tables for investigation sessions and AI conversations
 */

export function createInvestigationTables(db) {
  // TenantGuard Settings
  db.exec(`
    CREATE TABLE IF NOT EXISTS tenantguard_settings (
      key TEXT PRIMARY KEY,
      value TEXT,
      description TEXT,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_by TEXT
    )
  `)

  // Investigation sessions
  db.exec(`
    CREATE TABLE IF NOT EXISTS investigations (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      alert_id TEXT,
      correlation_id TEXT,
      status TEXT DEFAULT 'in_progress',
      severity TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      created_by TEXT,
      summary TEXT,
      findings TEXT,
      recommendations TEXT,
      completed_at DATETIME
    )
  `)

  // Agent conversation history
  db.exec(`
    CREATE TABLE IF NOT EXISTS investigation_chats (
      id TEXT PRIMARY KEY,
      investigation_id TEXT NOT NULL,
      message_text TEXT NOT NULL,
      sender_type TEXT NOT NULL,
      timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY(investigation_id) REFERENCES investigations(id)
    )
  `)

  // Create indexes for faster queries
  db.exec(`
    CREATE INDEX IF NOT EXISTS idx_investigations_status
      ON investigations(status)
  `)

  db.exec(`
    CREATE INDEX IF NOT EXISTS idx_investigations_severity
      ON investigations(severity)
  `)

  db.exec(`
    CREATE INDEX IF NOT EXISTS idx_investigations_created
      ON investigations(created_at DESC)
  `)

  db.exec(`
    CREATE INDEX IF NOT EXISTS idx_chats_investigation
      ON investigation_chats(investigation_id)
  `)

  db.exec(`
    CREATE INDEX IF NOT EXISTS idx_chats_timestamp
      ON investigation_chats(timestamp)
  `)

  console.log('✅ Investigation tables initialized')
}
