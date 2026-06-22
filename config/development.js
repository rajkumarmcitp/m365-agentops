/**
 * Development Configuration
 * Used when NODE_ENV=development (local development with demo data)
 */

import { BASE_CONFIG } from './base.js'

export const DEVELOPMENT_CONFIG = {
  ...BASE_CONFIG,

  // API Configuration
  apiBase: 'http://localhost:3000',
  apiTimeout: 30000,

  // Demo/Test Mode
  useDemo: true,
  demoDataFallback: true,

  // Dashboard
  services: {
    dashboard: {
      enabled: true,
      refreshInterval: 5000, // 5 seconds for quick testing
      useDemo: true,
    },
    security: {
      enabled: true,
      refreshInterval: 10000,
      useDemo: true,
    },
    tenantGuard: {
      enabled: true,
      refreshInterval: 10000,
      useDemo: true,
    },
    changeIntelligence: {
      enabled: true,
      useDemo: true,
    },
  },

  // Logging - verbose for development
  logging: {
    enabled: true,
    level: 'debug', // Show all logs
    verbose: true,
  },

  // Features - all enabled for testing
  features: {
    ...BASE_CONFIG.features,
    // Override any features if needed
  },

  // Cache - disabled for development
  cache: {
    enabled: false,
  },

  // Notifications - disabled for development
  notifications: {
    enabled: false,
  },

  // Dev tools
  devTools: {
    showConsoleErrors: true,
    logApiCalls: true,
    logStateChanges: true,
    enableDebugMenu: true,
  },
}
