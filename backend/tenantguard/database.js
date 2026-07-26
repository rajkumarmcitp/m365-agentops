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
  userSession: null,
  agentInvestigations: {},
  agentInvestigationSteps: {},
  agentQueue: {}
}

export async function initDatabase() {
  console.log('✅ Database initialized (in-memory mode)')
  return store
}

class DatabaseWrapper {
  constructor() {
    this.store = store
  }

  getStore() {
    return this.store
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
        'APP_CHANGE': 'Identity Management',
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

    // Handle INSERT INTO agent_investigations
    if (sql.includes('INSERT INTO agent_investigations') || sql.includes('INSERT') && sql.includes('agent_investigations')) {
      const [id, alert_id, trigger_type, status, priority, priority_score, iteration, max_iterations, verdict, risk_score, report, started_at, completed_at, error, paused, claude_used] = params
      this.store.agentInvestigations[id] = {
        id,
        alert_id,
        trigger_type: trigger_type || 'manual',
        status: status || 'triaging',
        priority: priority || 'P3',
        priority_score: priority_score || 0,
        iteration: iteration || 0,
        max_iterations: max_iterations || 5,
        verdict: verdict || null,
        risk_score: risk_score || null,
        report: report || null,
        started_at: started_at || new Date().toISOString(),
        completed_at: completed_at || null,
        error: error || null,
        paused: paused || 0,
        claude_used: claude_used !== undefined ? claude_used : 1
      }
      console.log(`✓ Stored agent investigation: ${id}`)
      return { lastID: 1, changes: 1 }
    }

    // Handle INSERT INTO agent_investigation_steps
    if (sql.includes('INSERT INTO agent_investigation_steps') || sql.includes('INSERT') && sql.includes('agent_investigation_steps')) {
      const [id, investigation_id, iteration, step_type, tool_name, tool_params, raw_result, findings, next_steps, tokens_used, duration_ms, created_at] = params
      this.store.agentInvestigationSteps[id] = {
        id,
        investigation_id,
        iteration: iteration || 0,
        step_type: step_type || 'gather',
        tool_name,
        tool_params: typeof tool_params === 'string' ? tool_params : JSON.stringify(tool_params || {}),
        raw_result: typeof raw_result === 'string' ? raw_result : JSON.stringify(raw_result || {}),
        findings: typeof findings === 'string' ? findings : JSON.stringify(findings || {}),
        next_steps: typeof next_steps === 'string' ? next_steps : JSON.stringify(next_steps || {}),
        tokens_used: tokens_used || 0,
        duration_ms: duration_ms || 0,
        created_at: created_at || new Date().toISOString()
      }
      console.log(`✓ Stored agent investigation step: ${step_type} on investigation ${investigation_id}`)
      return { lastID: 1, changes: 1 }
    }

    // Handle INSERT INTO agent_queue
    if (sql.includes('INSERT INTO agent_queue') || sql.includes('INSERT') && sql.includes('agent_queue')) {
      const [alert_id, investigation_id, queued_at, status] = params
      this.store.agentQueue[alert_id] = {
        alert_id,
        investigation_id,
        queued_at: queued_at || new Date().toISOString(),
        status: status || 'queued'
      }
      console.log(`✓ Queued investigation for alert: ${alert_id}`)
      return { lastID: 1, changes: 1 }
    }

    // Handle UPDATE agent_investigations
    if (sql.includes('UPDATE agent_investigations')) {
      const whereMatch = sql.match(/WHERE\s+id\s*=\s*\?/i)
      if (whereMatch && params.length > 0) {
        const alertId = params[params.length - 1]
        if (this.store.agentInvestigations[alertId]) {
          // Parse SET clause: status = ?, verdict = ?, etc.
          const setMatch = sql.match(/SET\s+(.+)\s+WHERE/i)
          if (setMatch) {
            const setClause = setMatch[1]
            const pairs = setClause.split(',').map(p => p.trim())
            pairs.forEach((pair, idx) => {
              const [key] = pair.split('=').map(p => p.trim())
              if (params[idx] !== undefined) {
                this.store.agentInvestigations[alertId][key] = params[idx]
              }
            })
            console.log(`✓ Updated agent investigation: ${alertId}`)
          }
        }
      }
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
        'audit_logs_cache': 'auditLogs',
        'agent_investigations': 'agentInvestigations',
        'agent_investigation_steps': 'agentInvestigationSteps',
        'agent_queue': 'agentQueue'
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
        'alert_correlations': 'correlations',
        'agent_investigations': 'agentInvestigations',
        'agent_investigation_steps': 'agentInvestigationSteps',
        'agent_queue': 'agentQueue'
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
      } else if (sql.includes('WHERE') && sql.includes('status')) {
        // For agent_investigations status filter
        const statusMatch = sql.match(/status\s*=\s*'([^']+)'/i)
        if (statusMatch) {
          const status = statusMatch[1]
          results = results.filter(r => r.status === status)
        }
      } else if (sql.includes('WHERE') && sql.includes('investigation_id')) {
        // For agent_investigation_steps filter
        const idMatch = params[0]
        if (idMatch) {
          results = results.filter(r => r.investigation_id === idMatch)
        }
      } else if (sql.includes('WHERE')) {
        // Filter out dismissed items by default (for alerts)
        results = results.filter(r => r.dismissed !== 1)
      }

      // Handle ORDER BY clause
      if (sql.includes('ORDER BY')) {
        if (sql.includes('correlation_score')) {
          results = results.sort((a, b) => b.correlation_score - a.correlation_score)
        } else if (sql.includes('started_at DESC')) {
          results = results.sort((a, b) => {
            const aTime = new Date(a.started_at).getTime()
            const bTime = new Date(b.started_at).getTime()
            return bTime - aTime
          })
        } else if (sql.includes('iteration ASC')) {
          results = results.sort((a, b) => a.iteration - b.iteration)
        } else if (sql.includes('created_at ASC')) {
          results = results.sort((a, b) => {
            const aTime = new Date(a.created_at).getTime()
            const bTime = new Date(b.created_at).getTime()
            return aTime - bTime
          })
        } else {
          // Default: reverse chronological
          results = results.sort((a, b) => {
            const aTime = new Date(a.action_timestamp || a.started_at || a.created_at).getTime()
            const bTime = new Date(b.action_timestamp || b.started_at || b.created_at).getTime()
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
