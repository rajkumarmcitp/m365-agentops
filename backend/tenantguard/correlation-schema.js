/**
 * TenantGuard Correlation Schema
 * Database tables for alert correlations and attack pattern detection
 */

export function createCorrelationTables(db) {
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
