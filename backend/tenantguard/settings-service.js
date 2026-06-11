/**
 * TenantGuard Settings Service
 * Manages admin configuration (Claude API key, etc.)
 */

import { getDatabase } from './database.js'

export class SettingsService {
  /**
   * Get a setting value
   */
  static getSetting(key, defaultValue = null) {
    try {
      const db = getDatabase()
      const result = db.prepare(
        'SELECT value FROM tenantguard_settings WHERE key = ?'
      ).get(key)

      return result ? result.value : defaultValue
    } catch (error) {
      console.error(`Error getting setting ${key}:`, error.message)
      return defaultValue
    }
  }

  /**
   * Set a setting value
   */
  static setSetting(key, value, description = null, updatedBy = 'system') {
    try {
      const db = getDatabase()

      // Check if setting exists
      const existing = db.prepare(
        'SELECT key FROM tenantguard_settings WHERE key = ?'
      ).get(key)

      if (existing) {
        // Update existing
        db.prepare(`
          UPDATE tenantguard_settings
          SET value = ?, description = ?, updated_at = CURRENT_TIMESTAMP, updated_by = ?
          WHERE key = ?
        `).run(value, description, updatedBy, key)
      } else {
        // Insert new
        db.prepare(`
          INSERT INTO tenantguard_settings (key, value, description, updated_by)
          VALUES (?, ?, ?, ?)
        `).run(key, value, description, updatedBy)
      }

      return { success: true, message: `Setting '${key}' updated` }
    } catch (error) {
      console.error(`Error setting ${key}:`, error.message)
      return { success: false, error: error.message }
    }
  }

  /**
   * Get Claude API key (masked for security)
   */
  static getClaudeApiKey() {
    return this.getSetting('claude_api_key', null)
  }

  /**
   * Set Claude API key
   */
  static setClaudeApiKey(apiKey, updatedBy = 'system') {
    return this.setSetting(
      'claude_api_key',
      apiKey,
      'Claude API key for AI investigation agent',
      updatedBy
    )
  }

  /**
   * Check if Claude API is configured
   */
  static isClaudeConfigured() {
    const key = this.getClaudeApiKey()
    return !!(key && key.trim())
  }

  /**
   * Get all settings (masked sensitive values)
   */
  static getAllSettings() {
    try {
      const db = getDatabase()
      const settings = db.prepare(
        'SELECT key, value, description, updated_at FROM tenantguard_settings'
      ).all()

      return settings.map(s => ({
        ...s,
        // Mask sensitive settings
        value: s.key.includes('api_key') || s.key.includes('secret') || s.key.includes('password')
          ? this.maskValue(s.value)
          : s.value
      }))
    } catch (error) {
      console.error('Error getting settings:', error.message)
      return []
    }
  }

  /**
   * Mask sensitive value for display
   */
  static maskValue(value) {
    if (!value) return '(empty)'
    if (value.length < 8) return '***'
    return value.substring(0, 4) + '*'.repeat(Math.min(16, value.length - 8)) + value.substring(value.length - 4)
  }
}
