/**
 * Production Configuration
 * Used when NODE_ENV=production (deployed to Azure)
 * Values can be overridden by environment variables or .env.production
 */

import { BASE_CONFIG } from './base.js'

// Get environment variable from Vite (browser environment)
const getEnv = (key, defaultValue) => {
  if (typeof import.meta !== 'undefined' && import.meta.env) {
    return import.meta.env[key] || defaultValue
  }
  // Browser environment - only import.meta.env is available
  return defaultValue
}

export const PRODUCTION_CONFIG = {
  ...BASE_CONFIG,

  // API Configuration - will be overridden by environment variable if set
  apiBase: getEnv('VITE_API_BASE', 'https://m365ops-api-gtbgezb9c7bgata7.centralus-01.azurewebsites.net'),
  apiTimeout: parseInt(getEnv('VITE_API_TIMEOUT', '30000')),

  // Real data mode
  useDemo: false,
  demoDataFallback: true, // Fallback to demo if API unavailable

  // Dashboard - production settings
  services: {
    dashboard: {
      enabled: true,
      refreshInterval: 300000, // 5 minutes
      useDemo: false,
    },
    security: {
      enabled: true,
      refreshInterval: 300000,
      useDemo: false,
    },
    tenantGuard: {
      enabled: getEnv('VITE_TENANTGUARD_ENABLED', 'true') !== 'false',
      refreshInterval: 300000,
      useDemo: false,
    },
    changeIntelligence: {
      enabled: getEnv('VITE_CHANGE_INTELLIGENCE_ENABLED', 'true') !== 'false',
      useDemo: false,
    },
  },

  // Logging - minimal for production
  logging: {
    enabled: true,
    level: getEnv('VITE_LOG_LEVEL', 'warn'), // Only warn and error
    verbose: false,
  },

  // Features
  features: {
    ...BASE_CONFIG.features,
    // Can be toggled via environment variables
    tenantGuard: getEnv('VITE_FEATURE_TENANTGUARD', 'true') !== 'false',
    userInvestigation: getEnv('VITE_FEATURE_USER_INVESTIGATION', 'true') !== 'false',
    graphApi: getEnv('VITE_FEATURE_GRAPH_API', 'true') !== 'false',
    selfServicePortal: getEnv('VITE_FEATURE_PORTAL', 'true') !== 'false',
  },

  // Cache - enabled for production
  cache: {
    enabled: true,
    ttl: 3600000, // 1 hour
  },

  // Notifications - enabled for production
  notifications: {
    enabled: true,
    onApproval: true,
    onDeadline: true,
  },

  // Production-only settings
  production: {
    // Backend URL for API calls
    backendUrl: getEnv('VITE_BACKEND_URL', 'https://m365ops-api-gtbgezb9c7bgata7.centralus-01.azurewebsites.net'),

    // Authentication
    msal: {
      clientId: getEnv('VITE_MSAL_CLIENT_ID', 'YOUR_CLIENT_ID'),
      authority: getEnv('VITE_MSAL_AUTHORITY', 'https://login.microsoftonline.com/common'),
      redirectUri: getEnv('VITE_MSAL_REDIRECT_URI', 'https://m365ops.contoso.com'),
    },

    // Performance monitoring
    monitoring: {
      enabled: true,
      trackPageViews: true,
      trackErrors: true,
    },
  },

  // Dev tools - disabled in production
  devTools: {
    showConsoleErrors: false,
    logApiCalls: false,
    logStateChanges: false,
    enableDebugMenu: false,
  },
}
