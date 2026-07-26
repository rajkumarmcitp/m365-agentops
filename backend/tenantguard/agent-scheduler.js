/**
 * Agent Scheduler
 * Manages autonomous threat investigation scheduling and triggers
 */

import { getDatabase } from './database.js'
import { ThreatInvestigationAgent } from './threat-agent.js'
import { SettingsService } from './settings-service.js'

let agentInstance = null
let isPaused = false
let schedulerInterval = null
const inProgressAlertIds = new Set()

/**
 * Initialize the autonomous threat investigation agent scheduler
 */
export function initializeAgentScheduler(graphApiClient = null) {
  try {
    const apiKey = SettingsService.getClaudeApiKey?.()
    agentInstance = new ThreatInvestigationAgent(apiKey, graphApiClient)

    // Schedule: check for uninvestigated P0/P1 alerts every 10 minutes
    schedulerInterval = setInterval(runScheduledCheck, 10 * 60 * 1000)

    // Also run once on startup
    runScheduledCheck().catch(err => console.error('Initial scheduler check failed:', err))

    console.log('✅ Threat Investigation Agent scheduler initialized')
    return true
  } catch (err) {
    console.error('Failed to initialize agent scheduler:', err.message)
    return false
  }
}

/**
 * Scheduled check: scan for uninvestigated P0/P1 alerts
 */
export async function runScheduledCheck() {
  if (isPaused) {
    console.log('Agent scheduler paused, skipping check')
    return
  }

  if (!agentInstance) {
    console.warn('Agent not initialized')
    return
  }

  try {
    const db = getDatabase()

    // Clean up stale queue entries (older than 30 min)
    const staleTime = new Date(Date.now() - 30 * 60 * 1000).toISOString()
    const staleEntries = db.prepare('SELECT * FROM agent_queue WHERE queued_at < ?').all(staleTime)
    for (const entry of staleEntries) {
      console.log(`Cleaning stale queue entry: ${entry.alert_id}`)
      db.prepare('DELETE FROM agent_queue WHERE alert_id = ?').run(entry.alert_id)
    }

    // Get uninvestigated P0/P1 alerts
    const p0Alerts = db.prepare("SELECT * FROM alerts WHERE priority = 'P0' AND dismissed = 0").all()
    const p1Alerts = db.prepare("SELECT * FROM alerts WHERE priority = 'P1' AND dismissed = 0").all()

    const alerts = [...p0Alerts, ...p1Alerts]
    console.log(`Scheduled check: found ${alerts.length} P0/P1 alerts to investigate`)

    for (const alert of alerts) {
      await triggerOnAlert(alert)
    }
  } catch (err) {
    console.error('Scheduled check failed:', err.message)
  }
}

/**
 * Trigger investigation on new alert (called from real-alert-detector)
 */
export async function triggerOnAlert(alert) {
  if (isPaused) {
    console.log('Agent scheduler paused, skipping trigger')
    return
  }

  if (!agentInstance) {
    console.warn('Agent not initialized')
    return
  }

  // Guard: check if already in progress
  if (inProgressAlertIds.has(alert.id)) {
    console.log(`Alert ${alert.id} already under investigation, skipping`)
    return
  }

  // Only auto-trigger P0/P1
  if (alert.priority !== 'P0' && alert.priority !== 'P1') {
    console.log(`Alert ${alert.id} priority ${alert.priority}, skipping auto-trigger`)
    return
  }

  inProgressAlertIds.add(alert.id)

  try {
    console.log(`🚀 Auto-triggering investigation for alert: ${alert.id}`)
    await agentInstance.investigate(alert.id, 'auto')
  } catch (err) {
    console.error(`Failed to trigger investigation for alert ${alert.id}:`, err.message)
  } finally {
    inProgressAlertIds.delete(alert.id)
  }
}

/**
 * Manually trigger investigation via API
 */
export async function manualTrigger(alertId) {
  if (!agentInstance) {
    throw new Error('Agent not initialized')
  }

  if (inProgressAlertIds.has(alertId)) {
    throw new Error(`Investigation already in progress for alert ${alertId}`)
  }

  inProgressAlertIds.add(alertId)

  try {
    return await agentInstance.investigate(alertId, 'manual')
  } finally {
    inProgressAlertIds.delete(alertId)
  }
}

/**
 * Pause autonomous investigations
 */
export function pauseScheduler() {
  isPaused = true
  console.log('⏸️  Agent scheduler paused')
}

/**
 * Resume autonomous investigations
 */
export function resumeScheduler() {
  isPaused = false
  console.log('▶️  Agent scheduler resumed')
}

/**
 * Get scheduler status
 */
export function getSchedulerStatus() {
  return {
    running: !isPaused,
    schedulerActive: !!schedulerInterval,
    inProgressCount: inProgressAlertIds.size,
    inProgressAlertIds: Array.from(inProgressAlertIds),
    claudeConfigured: agentInstance?.claudeAvailable || false,
    lastCheck: new Date().toISOString()
  }
}

/**
 * Shutdown scheduler (cleanup)
 */
export function shutdownScheduler() {
  if (schedulerInterval) {
    clearInterval(schedulerInterval)
    schedulerInterval = null
  }
  console.log('✓ Agent scheduler shutdown')
}

export default {
  initializeAgentScheduler,
  runScheduledCheck,
  triggerOnAlert,
  manualTrigger,
  pauseScheduler,
  resumeScheduler,
  getSchedulerStatus,
  shutdownScheduler
}
