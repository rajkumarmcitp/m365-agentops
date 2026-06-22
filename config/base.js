/**
 * Base Configuration - Shared across all environments
 * These values are the defaults and can be overridden by environment-specific configs
 */

export const BASE_CONFIG = {
  appName: 'M365 AgentOps',
  appVersion: '1.0.0',
  tenantDomain: 'Contoso.com',

  // Feature toggles (can be overridden per environment)
  features: {
    tenantGuard: true,
    dashboard: true,
    security: true,
    changeIntelligence: true,
    userInvestigation: true,
    zeroTrust: true,
    m365Config: true,
    selfServicePortal: true,
    graphApi: true,
    audit: true,
    agents: true,
  },

  // Default timeouts and intervals
  apiTimeout: 30000,
  refreshInterval: 300000, // 5 minutes
  autoRefreshInterval: 300000, // 5 minutes

  // Notification settings
  notifications: {
    enabled: true,
    onApproval: true,
    onDeadline: true,
  },

  // Logging
  logging: {
    enabled: true,
    level: 'info', // debug, info, warn, error
  },

  // Cache settings
  cache: {
    enabled: true,
    ttl: 3600000, // 1 hour
  },

  // Demo mode
  useDemo: false,
  demoDataFallback: true, // Use demo data if API fails
}
