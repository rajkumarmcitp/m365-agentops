/**
 * Configuration Loader
 * Dynamically loads the appropriate config based on environment
 * Merges environment variables and hotfixes
 */

import { BASE_CONFIG } from './base.js'
import { DEVELOPMENT_CONFIG } from './development.js'
import { PRODUCTION_CONFIG } from './production.js'
import { HOTFIXES } from './hotfixes.js'

/**
 * Get the appropriate configuration based on NODE_ENV
 */
function getEnvironmentConfig() {
  let env = 'production'
  try {
    env = import.meta.env.MODE || 'production'
  } catch (e) {
    console.warn('⚠️ import.meta.env not available, using production config')
    env = 'production'
  }

  console.log(`📋 Loading configuration for environment: ${env}`)

  if (env === 'production') {
    return PRODUCTION_CONFIG
  } else if (env === 'staging') {
    // Staging uses production config but can be customized
    let stagingApiBase = 'https://m365ops-staging.azurewebsites.net'
    try {
      stagingApiBase = import.meta.env.VITE_API_BASE || stagingApiBase
    } catch (e) {
      // Fall back to default
    }
    return {
      ...PRODUCTION_CONFIG,
      apiBase: stagingApiBase,
    }
  } else {
    // Development
    return DEVELOPMENT_CONFIG
  }
}

/**
 * Apply hotfixes to configuration
 */
function applyHotfixes(config) {
  const modified = { ...config }

  if (HOTFIXES.skipTenantGuardAlerts) {
    modified.services.tenantGuard.enabled = false
  }

  if (HOTFIXES.reduceApiTimeout) {
    modified.apiTimeout = HOTFIXES.reducedApiTimeout
    modified.services.dashboard.refreshInterval = Math.max(5000, HOTFIXES.reducedApiTimeout)
  }

  if (HOTFIXES.dashboardRefreshInterval) {
    modified.services.dashboard.refreshInterval = HOTFIXES.dashboardRefreshInterval
  }

  if (HOTFIXES.disableSecurity) {
    modified.features.security = false
  }

  if (HOTFIXES.disableM365Config) {
    modified.features.m365Config = false
  }

  if (HOTFIXES.disableChangeIntelligence) {
    modified.features.changeIntelligence = false
  }

  // Disable specific features from VITE_HOTFIX_DISABLE_FEATURES
  HOTFIXES.disabledFeatures.forEach(feature => {
    if (feature in modified.features) {
      modified.features[feature] = false
    }
  })

  return modified
}

/**
 * Initialize and return the merged configuration
 */
export function initializeConfig() {
  let config = getEnvironmentConfig()

  // Apply hotfixes
  config = applyHotfixes(config)

  // Log configuration summary
  if (config.logging?.enabled && config.logging?.level === 'debug') {
    console.log('📦 Configuration loaded:', config)
  }

  // Log active hotfixes
  const activeHotfixes = HOTFIXES.getActiveHotfixes()
  if (activeHotfixes.length > 0) {
    console.warn('⚠️ HOTFIXES ACTIVE:', activeHotfixes)
  }

  return config
}

/**
 * Global configuration instance
 * Initialized once and reused throughout the app
 */
export const CONFIG = initializeConfig()

/**
 * Helper functions for configuration
 */
export function isFeatureEnabled(featureName) {
  return CONFIG.features[featureName] === true && !HOTFIXES.isFeatureDisabled(featureName)
}

export function isDevMode() {
  let mode = 'production'
  try {
    mode = import.meta.env.MODE || 'production'
  } catch (e) {
    mode = 'production'
  }
  return CONFIG.useDemo === true || mode === 'development'
}

export function isProdMode() {
  let mode = 'production'
  try {
    mode = import.meta.env.MODE || 'production'
  } catch (e) {
    mode = 'production'
  }
  return CONFIG.useDemo === false && mode === 'production'
}

export function getApiBase() {
  return CONFIG.apiBase
}

export function getApiTimeout() {
  return HOTFIXES.reduceApiTimeout ? HOTFIXES.reducedApiTimeout : CONFIG.apiTimeout
}

export function getServiceConfig(serviceName) {
  return CONFIG.services[serviceName] || {}
}

export function getHotfixStatus() {
  return {
    active: HOTFIXES.getActiveHotfixes(),
    count: HOTFIXES.getActiveHotfixes().length,
    details: {
      skipTenantGuardAlerts: HOTFIXES.skipTenantGuardAlerts,
      reduceApiTimeout: HOTFIXES.reduceApiTimeout,
      disabledFeatures: HOTFIXES.disabledFeatures,
      disableSecurity: HOTFIXES.disableSecurity,
      disableM365Config: HOTFIXES.disableM365Config,
      disableChangeIntelligence: HOTFIXES.disableChangeIntelligence,
    }
  }
}

// Make CONFIG available globally for debugging
if (typeof window !== 'undefined') {
  window.__APP_CONFIG__ = CONFIG
  window.__HOTFIXES__ = HOTFIXES
  window.__CONFIG_HELPERS__ = { isFeatureEnabled, isDevMode, isProdMode, getHotfixStatus }
  console.log('✅ Configuration available at window.__APP_CONFIG__')
  console.log('✅ Hotfixes available at window.__HOTFIXES__')
  console.log('💡 Check hotfix status: window.__CONFIG_HELPERS__.getHotfixStatus()')
}
