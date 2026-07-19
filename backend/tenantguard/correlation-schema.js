/**
 * TenantGuard Correlation Schema
 * Database tables for alert correlations and attack pattern detection
 */

export function createCorrelationTables(db) {
  // Alerts table
  db.exec(`
    CREATE TABLE IF NOT EXISTS alerts (
      id TEXT PRIMARY KEY,
      priority TEXT,
      severity TEXT,
      headline TEXT NOT NULL,
      description TEXT,
      actor TEXT,
      source TEXT,
      action_timestamp DATETIME,
      score INTEGER,
      status TEXT,
      dismissed INTEGER DEFAULT 0,
      risk_assessment TEXT,
      recommendations TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `)

  // Index for faster alert queries
  db.exec(`
    CREATE INDEX IF NOT EXISTS idx_alerts_severity
      ON alerts(severity)
  `)

  db.exec(`
    CREATE INDEX IF NOT EXISTS idx_alerts_priority
      ON alerts(priority)
  `)

  db.exec(`
    CREATE INDEX IF NOT EXISTS idx_alerts_dismissed
      ON alerts(dismissed)
  `)

  // Correlated alert groups table
  db.exec(`
    CREATE TABLE IF NOT EXISTS alert_correlations (
      id TEXT PRIMARY KEY,
      correlation_type TEXT NOT NULL,
      alert_ids TEXT NOT NULL,
      actor TEXT,
      target TEXT,
      start_timestamp DATETIME NOT NULL,
      end_timestamp DATETIME NOT NULL,
      alert_count INTEGER NOT NULL,
      correlation_score INTEGER NOT NULL,
      pattern_type TEXT NOT NULL,
      risk_level TEXT NOT NULL,
      description TEXT NOT NULL,
      metadata TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      dismissed INTEGER DEFAULT 0,
      dismissed_at DATETIME,
      dismiss_reason TEXT
    )
  `)

  // Index for faster queries
  db.exec(`
    CREATE INDEX IF NOT EXISTS idx_correlations_actor
      ON alert_correlations(actor)
  `)

  db.exec(`
    CREATE INDEX IF NOT EXISTS idx_correlations_type
      ON alert_correlations(correlation_type)
  `)

  db.exec(`
    CREATE INDEX IF NOT EXISTS idx_correlations_score
      ON alert_correlations(correlation_score DESC)
  `)

  db.exec(`
    CREATE INDEX IF NOT EXISTS idx_correlations_risk
      ON alert_correlations(risk_level)
  `)

  db.exec(`
    CREATE INDEX IF NOT EXISTS idx_correlations_pattern
      ON alert_correlations(pattern_type)
  `)

  console.log('✅ Correlation tables initialized')
}
