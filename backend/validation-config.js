/**
 * Validation Configuration System
 * Manages validation method preferences (Graph API, PowerShell, Hybrid)
 * Handles caching, timeouts, and per-control method selection
 */

import fs from 'fs'
import path from 'path'

const CONFIG_FILE = path.join(process.cwd(), 'backend', 'validation-config.json')

/**
 * Default validation configuration
 */
const DEFAULT_CONFIG = {
  validationMethod: 'hybrid',  // 'graphAPI' | 'powershell' | 'hybrid'
  timeout: 30000,  // ms per control
  retryAttempts: 3,
  retryBackoffMs: 2000,
  cacheTTL: 3600000,  // 1 hour
  enablePowerShell: false,  // requires modules installed
  psModulesPath: process.platform === 'win32'
    ? 'C:\\Program Files\\PowerShell\\7'
    : '/opt/microsoft/powershell/7',
  preferredMethods: {
    // Controls with PowerShell support can be configured here
    // '1.1.1': 'graphAPI',
    // '2.1.1': 'hybrid',
  },
  // Map control IDs to validation methods
  controlMethodMap: {},
  lastUpdated: new Date().toISOString()
}

/**
 * Load configuration from file or use defaults
 */
function loadConfig() {
  try {
    if (fs.existsSync(CONFIG_FILE)) {
      const data = fs.readFileSync(CONFIG_FILE, 'utf8')
      const loaded = JSON.parse(data)
      return { ...DEFAULT_CONFIG, ...loaded }
    }
  } catch (error) {
    console.warn(`⚠️ Failed to load validation config: ${error.message}`)
  }
  return { ...DEFAULT_CONFIG }
}

/**
 * Save configuration to file
 */
function saveConfig(config) {
  try {
    const configDir = path.dirname(CONFIG_FILE)
    if (!fs.existsSync(configDir)) {
      fs.mkdirSync(configDir, { recursive: true })
    }

    config.lastUpdated = new Date().toISOString()
    fs.writeFileSync(CONFIG_FILE, JSON.stringify(config, null, 2))
    console.log('✓ Validation config saved')
    return true
  } catch (error) {
    console.error(`❌ Failed to save validation config: ${error.message}`)
    return false
  }
}

// Load on module initialization
let currentConfig = loadConfig()

/**
 * Get current validation configuration
 */
export function getValidationConfig() {
  return { ...currentConfig }
}

/**
 * Update validation configuration
 */
export function updateValidationConfig(updates) {
  currentConfig = { ...currentConfig, ...updates }
  return saveConfig(currentConfig)
}

/**
 * Get validation method for a specific control
 * @param {string} controlId - CIS Control ID (e.g., '1.1.1')
 * @returns {string} - 'graphAPI' | 'powershell' | 'hybrid'
 */
export function getValidationMethod(controlId) {
  // Check if control has specific preference
  if (currentConfig.controlMethodMap[controlId]) {
    return currentConfig.controlMethodMap[controlId]
  }
  // Return global preference
  return currentConfig.validationMethod
}

/**
 * Set validation method for a specific control
 * @param {string} controlId - CIS Control ID
 * @param {string} method - 'graphAPI' | 'powershell' | 'hybrid'
 */
export function setControlValidationMethod(controlId, method) {
  if (!['graphAPI', 'powershell', 'hybrid'].includes(method)) {
    throw new Error(`Invalid validation method: ${method}`)
  }

  currentConfig.controlMethodMap[controlId] = method
  return saveConfig(currentConfig)
}

/**
 * Remove control-specific method preference (use global setting)
 */
export function clearControlValidationMethod(controlId) {
  delete currentConfig.controlMethodMap[controlId]
  return saveConfig(currentConfig)
}

/**
 * Get all controls with custom methods
 */
export function getCustomMethodControls() {
  return Object.entries(currentConfig.controlMethodMap).map(([controlId, method]) => ({
    controlId,
    method
  }))
}

/**
 * Check if PowerShell is enabled
 */
export function isPowerShellEnabled() {
  return currentConfig.enablePowerShell
}

/**
 * Enable/disable PowerShell validation
 */
export function setPowerShellEnabled(enabled) {
  currentConfig.enablePowerShell = enabled
  return saveConfig(currentConfig)
}

/**
 * Get retry configuration
 */
export function getRetryConfig() {
  return {
    attempts: currentConfig.retryAttempts,
    backoffMs: currentConfig.retryBackoffMs,
    timeout: currentConfig.timeout
  }
}

/**
 * Get cache configuration
 */
export function getCacheConfig() {
  return {
    ttl: currentConfig.cacheTTL,
    enabled: currentConfig.cacheTTL > 0
  }
}

/**
 * Reset configuration to defaults
 */
export function resetValidationConfig() {
  currentConfig = { ...DEFAULT_CONFIG }
  return saveConfig(currentConfig)
}

/**
 * Export entire config structure (for API responses)
 */
export function exportConfig() {
  return {
    currentMethod: currentConfig.validationMethod,
    availableMethods: ['graphAPI', 'powershell', 'hybrid'],
    powerShellAvailable: currentConfig.enablePowerShell,
    timeout: currentConfig.timeout,
    retryAttempts: currentConfig.retryAttempts,
    cacheTTL: currentConfig.cacheTTL,
    customMethods: getCustomMethodControls(),
    lastUpdated: currentConfig.lastUpdated
  }
}
