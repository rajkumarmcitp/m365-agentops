// ============================================================
// Agent Configuration Management
// Stores and manages agent settings (schedules, notifications, etc.)
// ============================================================

// Default agent configurations
const DEFAULT_CONFIG = {
  security: {
    enabled: true,
    schedule: '0 * * * *',      // Every hour
    scheduleLabel: 'Hourly',
    notifications: {
      dashboard: true,
      email: false,
      teams: false
    },
    alertThresholds: {
      highRiskUsers: 1,          // Alert if > 1 high-risk user
      riskyCriticalCount: 5      // Alert if > 5 risky users total
    }
  },
  config: {
    enabled: true,
    schedule: '0 2 * * *',       // Daily at 2 AM
    scheduleLabel: 'Daily at 2 AM',
    notifications: {
      dashboard: true,
      email: true,
      teams: false
    },
    alertThresholds: {
      complianceScore: 70,       // Alert if < 70%
      criticalFailures: 1        // Alert if any critical failures
    }
  },
  approval: {
    enabled: true,
    schedule: '*/15 * * * *',    // Every 15 minutes
    scheduleLabel: 'Every 15 minutes',
    notifications: {
      dashboard: true,
      email: false,
      teams: false
    },
    alertThresholds: {
      pendingRequestsCount: 10   // Alert if > 10 pending
    }
  },
  execution: {
    enabled: true,
    schedule: '*/30 * * * *',    // Every 30 minutes
    scheduleLabel: 'Every 30 minutes',
    notifications: {
      dashboard: true,
      email: false,
      teams: false
    },
    alertThresholds: {
      failureRate: 10            // Alert if > 10% failures
    }
  },
  audit: {
    enabled: true,
    schedule: '0 * * * *',       // Every hour
    scheduleLabel: 'Hourly',
    notifications: {
      dashboard: true,
      email: false,
      teams: false
    },
    alertThresholds: {
      anomalyCount: 3            // Alert if > 3 anomalies
    }
  },
  compliance: {
    enabled: true,
    schedule: '0 3 * * 0',       // Weekly Sunday at 3 AM
    scheduleLabel: 'Weekly (Sunday 3 AM)',
    notifications: {
      dashboard: true,
      email: true,
      teams: false
    },
    alertThresholds: {
      policyViolations: 1        // Alert if any violations
    }
  }
}

// In-memory configuration (can be moved to database)
let agentConfig = JSON.parse(JSON.stringify(DEFAULT_CONFIG))

// ============================================================
// Configuration API
// ============================================================

export function getAgentConfig(agentId) {
  return agentConfig[agentId] || null
}

export function getAllAgentConfig() {
  return agentConfig
}

export function updateAgentConfig(agentId, updates) {
  if (!agentConfig[agentId]) {
    throw new Error(`Unknown agent: ${agentId}`)
  }

  // Merge updates with existing config
  agentConfig[agentId] = {
    ...agentConfig[agentId],
    ...updates,
    // Preserve nested objects (notifications, alertThresholds)
    notifications: {
      ...agentConfig[agentId].notifications,
      ...(updates.notifications || {})
    },
    alertThresholds: {
      ...agentConfig[agentId].alertThresholds,
      ...(updates.alertThresholds || {})
    }
  }

  console.log(`✅ Updated config for ${agentId}:`, agentConfig[agentId])
  return agentConfig[agentId]
}

export function resetAgentConfig(agentId = null) {
  if (agentId) {
    agentConfig[agentId] = JSON.parse(JSON.stringify(DEFAULT_CONFIG[agentId]))
    console.log(`✅ Reset config for ${agentId}`)
    return agentConfig[agentId]
  } else {
    agentConfig = JSON.parse(JSON.stringify(DEFAULT_CONFIG))
    console.log('✅ Reset all agent configs')
    return agentConfig
  }
}

// ============================================================
// Schedule Presets
// ============================================================

export const SCHEDULE_PRESETS = {
  'every-15-min': { cron: '*/15 * * * *', label: 'Every 15 minutes' },
  'every-30-min': { cron: '*/30 * * * *', label: 'Every 30 minutes' },
  'hourly': { cron: '0 * * * *', label: 'Every hour' },
  'every-2-hours': { cron: '0 */2 * * *', label: 'Every 2 hours' },
  'every-4-hours': { cron: '0 */4 * * *', label: 'Every 4 hours' },
  'daily-2am': { cron: '0 2 * * *', label: 'Daily at 2 AM' },
  'daily-3am': { cron: '0 3 * * *', label: 'Daily at 3 AM' },
  'daily-midnight': { cron: '0 0 * * *', label: 'Daily at midnight' },
  'weekly-sunday': { cron: '0 3 * * 0', label: 'Weekly (Sunday 3 AM)' },
  'weekly-monday': { cron: '0 3 * * 1', label: 'Weekly (Monday 3 AM)' },
  'disabled': { cron: null, label: 'Disabled' }
}

// ============================================================
// Notification Channels
// ============================================================

export const NOTIFICATION_CHANNELS = {
  dashboard: {
    label: 'Dashboard',
    description: 'Show alerts on the dashboard',
    enabled: true
  },
  email: {
    label: 'Email',
    description: 'Send alerts via email',
    enabled: true
  },
  teams: {
    label: 'Microsoft Teams',
    description: 'Post alerts to Teams channel',
    enabled: true
  }
}

// ============================================================
// Helper Functions
// ============================================================

export function validateSchedule(cronExpression) {
  // Basic validation - check if it matches cron format
  const cronRegex = /^(\*|([0-9]|1[0-9]|2[0-9]|3[0-9]|4[0-9]|5[0-9])|\*\/([0-9]|1[0-9]|2[0-9]|3[0-9]|4[0-9]|5[0-9])) (\*|([0-9]|1[0-9]|2[0-3])|\*\/([0-9]|1[0-9]|2[0-3])) (\*|([1-9]|1[0-9]|2[0-9]|3[0-1])|\*\/([1-9]|1[0-9]|2[0-9]|3[0-1])) (\*|([1-9]|1[0-2])|\*\/([1-9]|1[0-2])) (\*|([0-6])|\*\/([0-6]))$/
  return cronRegex.test(cronExpression)
}

export function getScheduleLabel(cronExpression) {
  for (const [key, preset] of Object.entries(SCHEDULE_PRESETS)) {
    if (preset.cron === cronExpression) {
      return preset.label
    }
  }
  return cronExpression
}

export function shouldSendAlert(agentId, alertType, value) {
  const config = agentConfig[agentId]
  if (!config) return true

  // Check if notifications are enabled for any channel
  const hasNotifications = Object.values(config.notifications).some(v => v)
  if (!hasNotifications) return false

  // Check threshold
  const threshold = config.alertThresholds[alertType]
  if (threshold === undefined) return true

  // For count-based thresholds, alert if value exceeds threshold
  return value > threshold
}

export function getEnabledNotificationChannels(agentId) {
  const config = agentConfig[agentId]
  if (!config) return []

  return Object.entries(config.notifications)
    .filter(([, enabled]) => enabled)
    .map(([channel]) => channel)
}
