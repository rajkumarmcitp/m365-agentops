// ============================================================
// AI Agents Scheduler
// Runs agents on a schedule (hourly, daily, weekly)
// ============================================================

import schedule from 'node-schedule'
import {
  getSecurityAgentData, getConfigAgentData, getApprovalAgentData,
  getExecutionAgentData, getAuditAgentData, getComplianceAgentData
} from './agents-service.js'
import {
  getAgentConfig, getAllAgentConfig, getEnabledNotificationChannels
} from './agents-config.js'

// Agent execution history
const executionHistory = {
  security: [],
  config: [],
  approval: [],
  execution: [],
  audit: [],
  compliance: []
}

// Scheduled jobs (can be updated when config changes)
const scheduledJobs = {}

// Last execution times
const lastExecution = {
  security: null,
  config: null,
  approval: null,
  execution: null,
  audit: null,
  compliance: null
}

// ============================================================
// Agent Execution
// ============================================================

async function executeAgent(agentId) {
  console.log(`🚀 [${agentId}] Agent executing...`)
  const startTime = Date.now()

  try {
    let agentData = null

    switch (agentId) {
      case 'security':
        agentData = await getSecurityAgentData()
        break
      case 'config':
        agentData = await getConfigAgentData()
        break
      case 'approval':
        agentData = await getApprovalAgentData()
        break
      case 'execution':
        agentData = await getExecutionAgentData()
        break
      case 'audit':
        agentData = await getAuditAgentData()
        break
      case 'compliance':
        agentData = await getComplianceAgentData()
        break
    }

    const executionTime = Date.now() - startTime

    // Store execution record
    const record = {
      timestamp: new Date().toISOString(),
      agentId,
      status: 'SUCCESS',
      executionTime,
      dataSnapshot: agentData,
      alertsGenerated: generateAlerts(agentId, agentData)
    }

    executionHistory[agentId].push(record)
    lastExecution[agentId] = new Date()

    // Keep only last 100 executions per agent
    if (executionHistory[agentId].length > 100) {
      executionHistory[agentId].shift()
    }

    console.log(`✅ [${agentId}] Agent completed in ${executionTime}ms`)
    console.log(`   Alerts: ${record.alertsGenerated.length}`)

    return record
  } catch (error) {
    console.error(`❌ [${agentId}] Agent execution failed:`, error.message)

    const record = {
      timestamp: new Date().toISOString(),
      agentId,
      status: 'FAILED',
      error: error.message,
      executionTime: Date.now() - startTime
    }

    executionHistory[agentId].push(record)
    return record
  }
}

// ============================================================
// Alert Generation
// ============================================================

function generateAlerts(agentId, agentData) {
  const alerts = []

  if (!agentData || agentData.error) {
    alerts.push({
      severity: 'ERROR',
      type: 'AGENT_ERROR',
      message: `Agent failed: ${agentData?.error || 'Unknown error'}`,
      timestamp: new Date().toISOString()
    })
    return alerts
  }

  switch (agentId) {
    case 'security':
      // High-risk user alert
      if (agentData.stats?.highRisk > 0) {
        alerts.push({
          severity: 'CRITICAL',
          type: 'HIGH_RISK_USERS',
          message: `${agentData.stats.highRisk} high-risk users detected`,
          count: agentData.stats.highRisk,
          timestamp: new Date().toISOString()
        })
      }
      // Multiple risky users
      if (agentData.stats?.totalRiskyUsers > 5) {
        alerts.push({
          severity: 'HIGH',
          type: 'RISKY_USER_THRESHOLD',
          message: `${agentData.stats.totalRiskyUsers} risky users exceed threshold (5)`,
          count: agentData.stats.totalRiskyUsers,
          timestamp: new Date().toISOString()
        })
      }
      break

    case 'config':
      // Critical control failures
      if (agentData.criticalFailures?.length > 0) {
        const criticalCount = agentData.criticalFailures.filter(f => f.severity === 'CRITICAL').length
        if (criticalCount > 0) {
          alerts.push({
            severity: 'CRITICAL',
            type: 'CRITICAL_CONTROL_FAILURE',
            message: `${criticalCount} critical CIS controls failed`,
            failures: agentData.criticalFailures.filter(f => f.severity === 'CRITICAL'),
            timestamp: new Date().toISOString()
          })
        }
      }
      // Low compliance score
      if (agentData.stats?.complianceScore < 70) {
        alerts.push({
          severity: 'HIGH',
          type: 'LOW_COMPLIANCE_SCORE',
          message: `Compliance score is ${agentData.stats.complianceScore}% (target: 80%)`,
          score: agentData.stats.complianceScore,
          timestamp: new Date().toISOString()
        })
      }
      break

    case 'approval':
      // Pending requests exceeding SLA
      if (agentData.stats?.pending > 10) {
        alerts.push({
          severity: 'HIGH',
          type: 'PENDING_REQUESTS_THRESHOLD',
          message: `${agentData.stats.pending} pending requests exceed threshold (10)`,
          count: agentData.stats.pending,
          timestamp: new Date().toISOString()
        })
      }
      break

    case 'execution':
      // Execution failures
      if (agentData.stats?.failures > 0) {
        alerts.push({
          severity: 'MEDIUM',
          type: 'EXECUTION_FAILURE',
          message: `${agentData.stats.failures} executions failed`,
          count: agentData.stats.failures,
          timestamp: new Date().toISOString()
        })
      }
      break

    case 'compliance':
      // Compliance violations
      if (agentData.stats?.dlpPolicies === 0) {
        alerts.push({
          severity: 'HIGH',
          type: 'NO_DLP_POLICIES',
          message: 'No DLP policies configured',
          timestamp: new Date().toISOString()
        })
      }
      break
  }

  return alerts
}

// ============================================================
// Scheduler Initialization
// ============================================================

export function initializeAgentScheduler() {
  console.log('\n🔧 Initializing Agent Scheduler...\n')

  const agents = ['security', 'config', 'approval', 'execution', 'audit', 'compliance']
  const config = getAllAgentConfig()

  agents.forEach(agentId => {
    const agentConfig = config[agentId]
    if (!agentConfig) return

    // Skip if agent is disabled
    if (!agentConfig.enabled) {
      console.log(`⏸️  [${agentId}] Disabled`)
      return
    }

    const cronExpression = agentConfig.schedule
    if (!cronExpression) {
      console.log(`⏸️  [${agentId}] No schedule configured`)
      return
    }

    // Schedule the job
    scheduledJobs[agentId] = schedule.scheduleJob(cronExpression, async () => {
      await executeAgent(agentId)
    })

    console.log(`✅ [${agentId}] Scheduled: ${agentConfig.scheduleLabel}`)
  })

  console.log('\n✅ Agent Scheduler initialized\n')
}

export function updateSchedule(agentId, cronExpression) {
  // Cancel existing job if it exists
  if (scheduledJobs[agentId]) {
    scheduledJobs[agentId].cancel()
    delete scheduledJobs[agentId]
  }

  // Schedule new job if cronExpression is provided
  if (cronExpression) {
    scheduledJobs[agentId] = schedule.scheduleJob(cronExpression, async () => {
      await executeAgent(agentId)
    })
    console.log(`✅ [${agentId}] Schedule updated: ${cronExpression}`)
  } else {
    console.log(`⏸️  [${agentId}] Agent disabled`)
  }
}

// ============================================================
// API Endpoints
// ============================================================

export function getAgentExecutionHistory(agentId) {
  return executionHistory[agentId] || []
}

export function getAgentLastExecution(agentId) {
  return lastExecution[agentId]
}

export function getAllExecutionHistory() {
  return executionHistory
}

export function getRecentAlerts(agentId = null, limit = 10) {
  const allAlerts = []

  const agents = agentId ? [agentId] : Object.keys(executionHistory)

  agents.forEach(agent => {
    executionHistory[agent].forEach(record => {
      if (record.alertsGenerated) {
        record.alertsGenerated.forEach(alert => {
          allAlerts.push({
            ...alert,
            agentId: agent
          })
        })
      }
    })
  })

  // Sort by timestamp descending and limit
  return allAlerts
    .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
    .slice(0, limit)
}

// ============================================================
// Manual Execution (for testing)
// ============================================================

export async function manualExecuteAgent(agentId) {
  console.log(`📌 Manual execution triggered for ${agentId}`)
  return await executeAgent(agentId)
}

export async function manualExecuteAllAgents() {
  console.log('📌 Manual execution triggered for all agents')
  const agents = ['security', 'config', 'approval', 'execution', 'audit', 'compliance']
  const results = {}

  for (const agentId of agents) {
    results[agentId] = await executeAgent(agentId)
  }

  return results
}
