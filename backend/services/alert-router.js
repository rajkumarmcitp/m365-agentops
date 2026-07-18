/**
 * Alert Router - Route alerts to email notifications based on priority and rules
 */

import emailService from './email-service.js'

let alertQueue = []
let digestQueue = { P1: [], P2: [], P3: [] }
let digestTimers = {}
const DIGEST_INTERVALS = {
  P1: 60 * 60 * 1000,     // 1 hour digest for P1
  P2: 24 * 60 * 60 * 1000, // Daily digest for P2
  P3: 24 * 60 * 60 * 1000  // Daily digest for P3
}

/**
 * Process alert through routing logic
 */
async function routeAlert(alert, config = {}) {
  const recipients = config.recipients || emailService.getEmailConfig()?.recipients || []
  const thresholds = emailService.getEmailConfig()?.alertThresholds || {}

  // Validate alert
  if (!alert || !alert.priority || !alert.headline) {
    console.warn('⚠️ Invalid alert received:', alert)
    return false
  }

  // Route based on priority
  const deliveryMode = thresholds[alert.priority] || 'digest'

  if (deliveryMode === 'immediate') {
    // P0 and P1: Send immediately
    console.log(`🚨 Immediate alert routing: ${alert.priority}`)
    return await emailService.sendAlertEmail(alert, recipients)
  } else if (deliveryMode === 'digest') {
    // P2 and P3: Queue for digest
    console.log(`📋 Queuing alert for digest: ${alert.priority} - ${alert.headline}`)
    queueForDigest(alert, alert.priority)
    return true
  }

  return false
}

/**
 * Queue alert for digest delivery
 */
function queueForDigest(alert, priority = 'P2') {
  if (!digestQueue[priority]) {
    digestQueue[priority] = []
  }

  digestQueue[priority].push(alert)

  // Start digest timer if not already running
  if (!digestTimers[priority]) {
    startDigestTimer(priority)
  }
}

/**
 * Start timer for digest delivery
 */
function startDigestTimer(priority = 'P2') {
  const interval = DIGEST_INTERVALS[priority] || DIGEST_INTERVALS.P2

  digestTimers[priority] = setTimeout(async () => {
    await sendDigest(priority)
  }, interval)

  console.log(`⏰ Digest timer started for ${priority} (${interval / 1000 / 60} minutes)`)
}

/**
 * Send queued digest alerts
 */
async function sendDigest(priority = 'P2') {
  const queue = digestQueue[priority]
  const recipients = emailService.getEmailConfig()?.recipients || []

  if (!queue || queue.length === 0) {
    console.log(`📋 No alerts to digest for ${priority}`)
    digestTimers[priority] = null
    return false
  }

  console.log(`📧 Sending ${priority} digest with ${queue.length} alerts`)
  const result = await emailService.sendDigestEmail(queue, recipients)

  // Clear queue after sending
  digestQueue[priority] = []
  digestTimers[priority] = null

  return result
}

/**
 * Send all pending digests immediately (manual trigger)
 */
async function sendAllDigests() {
  const results = []
  for (const priority of Object.keys(digestQueue)) {
    if (digestQueue[priority].length > 0) {
      const result = await sendDigest(priority)
      results.push({ priority, success: result, count: digestQueue[priority].length })
    }
  }
  return results
}

/**
 * Apply custom rules to alert
 */
function applyCustomRules(alert, rules = []) {
  if (!rules || rules.length === 0) {
    return alert
  }

  let modifiedAlert = { ...alert }

  for (const rule of rules) {
    if (evaluateRule(rule, modifiedAlert)) {
      // Apply rule actions
      if (rule.actions?.changePriority) {
        modifiedAlert.priority = rule.actions.changePriority
      }
      if (rule.actions?.changeDescription) {
        modifiedAlert.description = rule.actions.changeDescription
      }
      if (rule.actions?.skip) {
        return null // Skip this alert
      }
    }
  }

  return modifiedAlert
}

/**
 * Evaluate if a rule applies to an alert
 */
function evaluateRule(rule, alert) {
  if (!rule.conditions) return false

  // All conditions must match
  return rule.conditions.every(condition => {
    const value = getAlertFieldValue(alert, condition.field)

    switch (condition.operator) {
      case 'equals':
        return value === condition.value
      case 'contains':
        return value?.includes?.(condition.value)
      case 'regex':
        return new RegExp(condition.value).test(value)
      case 'gt':
        return value > condition.value
      case 'lt':
        return value < condition.value
      default:
        return false
    }
  })
}

/**
 * Get alert field value with dot notation support
 */
function getAlertFieldValue(alert, fieldPath) {
  return fieldPath.split('.').reduce((obj, field) => obj?.[field], alert)
}

/**
 * Get alert routing stats
 */
function getRoutingStats() {
  return {
    immediateQueue: alertQueue.length,
    digestQueues: {
      P1: digestQueue.P1?.length || 0,
      P2: digestQueue.P2?.length || 0,
      P3: digestQueue.P3?.length || 0
    },
    activeTimers: Object.keys(digestTimers).filter(k => digestTimers[k] !== null),
    config: emailService.getEmailConfig()
  }
}

/**
 * Clear alert queue (for testing)
 */
function clearQueues() {
  alertQueue = []
  digestQueue = { P1: [], P2: [], P3: [] }
  Object.keys(digestTimers).forEach(key => {
    if (digestTimers[key]) {
      clearTimeout(digestTimers[key])
      digestTimers[key] = null
    }
  })
  console.log('🗑️ Alert queues cleared')
}

export default {
  routeAlert,
  queueForDigest,
  startDigestTimer,
  sendDigest,
  sendAllDigests,
  applyCustomRules,
  evaluateRule,
  getRoutingStats,
  clearQueues
}

export {
  routeAlert,
  queueForDigest,
  startDigestTimer,
  sendDigest,
  sendAllDigests,
  applyCustomRules,
  evaluateRule,
  getRoutingStats,
  clearQueues
}
