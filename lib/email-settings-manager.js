/**
 * Global Email Settings Manager
 * Centralized configuration for email notifications across all pages
 * Any page can import and use this service
 */

const STORAGE_KEY = 'app-email-settings'
const DEFAULT_SETTINGS = {
  enabled: false,
  provider: 'office365',
  from: 'TenantGuard@yourdomain.onmicrosoft.com',
  smtpHost: 'smtp.office365.com',
  smtpPort: 587,
  authUser: '',
  authPass: '',
  recipients: [],
  alertThresholds: {
    P0: 'immediate',
    P1: 'immediate',
    P2: 'digest',
    P3: 'digest'
  },
  rateLimit: {
    maxEmailsPerMinute: 10,
    deduplicationWindow: 3600000 // 1 hour
  },
  digestIntervals: {
    P2: 60 * 60 * 1000,           // 1 hour
    P3: 24 * 60 * 60 * 1000       // 24 hours
  }
}

class EmailSettingsManager {
  constructor() {
    this.settings = this.loadSettings()
    this.listeners = [] // For reactive updates
  }

  /**
   * Load settings from localStorage
   */
  loadSettings() {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) {
        return { ...DEFAULT_SETTINGS, ...JSON.parse(stored) }
      }
    } catch (error) {
      console.error('Error loading email settings:', error)
    }
    return { ...DEFAULT_SETTINGS }
  }

  /**
   * Save settings to localStorage and notify listeners
   */
  saveSettings(newSettings) {
    try {
      this.settings = { ...this.settings, ...newSettings }
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.settings))
      this.notifyListeners()
      console.log('✅ Email settings saved:', this.settings)
      return true
    } catch (error) {
      console.error('Error saving email settings:', error)
      return false
    }
  }

  /**
   * Get all settings
   */
  getSettings() {
    return { ...this.settings }
  }

  /**
   * Get specific setting
   */
  getSetting(key) {
    return this.settings[key]
  }

  /**
   * Check if email alerts are enabled
   */
  isEnabled() {
    return this.settings.enabled === true
  }

  /**
   * Enable/disable email alerts
   */
  setEnabled(enabled) {
    this.saveSettings({ enabled: !!enabled })
  }

  /**
   * Update email provider config
   */
  updateEmailConfig(config) {
    this.saveSettings({
      provider: config.provider || this.settings.provider,
      from: config.from || this.settings.from,
      smtpHost: config.smtpHost || this.settings.smtpHost,
      smtpPort: config.smtpPort || this.settings.smtpPort,
      authUser: config.authUser || this.settings.authUser,
      authPass: config.authPass || this.settings.authPass
    })
  }

  /**
   * Add recipient email
   */
  addRecipient(email) {
    if (!email || typeof email !== 'string') return false
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return false

    const recipients = [...this.settings.recipients]
    if (!recipients.includes(email)) {
      recipients.push(email)
      this.saveSettings({ recipients })
      return true
    }
    return false
  }

  /**
   * Remove recipient email
   */
  removeRecipient(email) {
    const recipients = this.settings.recipients.filter(r => r !== email)
    if (recipients.length >= 1 || recipients.length === 0) { // Allow removal to empty if user wants
      this.saveSettings({ recipients })
      return true
    }
    return false
  }

  /**
   * Get all recipients
   */
  getRecipients() {
    return [...this.settings.recipients]
  }

  /**
   * Update alert delivery thresholds
   */
  setAlertThresholds(thresholds) {
    this.saveSettings({
      alertThresholds: {
        ...this.settings.alertThresholds,
        ...thresholds
      }
    })
  }

  /**
   * Get alert threshold for priority
   */
  getAlertThreshold(priority) {
    return this.settings.alertThresholds[priority] || 'digest'
  }

  /**
   * Update rate limiting
   */
  setRateLimit(config) {
    this.saveSettings({
      rateLimit: {
        ...this.settings.rateLimit,
        ...config
      }
    })
  }

  /**
   * Get rate limit config
   */
  getRateLimit() {
    return { ...this.settings.rateLimit }
  }

  /**
   * Update digest intervals
   */
  setDigestIntervals(intervals) {
    this.saveSettings({
      digestIntervals: {
        ...this.settings.digestIntervals,
        ...intervals
      }
    })
  }

  /**
   * Get digest interval for priority
   */
  getDigestInterval(priority) {
    return this.settings.digestIntervals[priority] || DEFAULT_SETTINGS.digestIntervals[priority]
  }

  /**
   * Verify settings are complete
   */
  isConfigured() {
    return (
      this.settings.provider &&
      this.settings.authUser &&
      this.settings.authPass &&
      this.settings.recipients.length > 0
    )
  }

  /**
   * Check if can send to priority
   */
  canSendAlert(priority) {
    if (!this.isEnabled()) return false
    if (!this.isConfigured()) return false
    return !!this.settings.alertThresholds[priority]
  }

  /**
   * Get delivery mode for alert
   */
  getDeliveryMode(priority) {
    if (!this.canSendAlert(priority)) return null
    return this.settings.alertThresholds[priority]
  }

  /**
   * Subscribe to settings changes
   */
  subscribe(callback) {
    if (typeof callback === 'function') {
      this.listeners.push(callback)
    }
  }

  /**
   * Unsubscribe from settings changes
   */
  unsubscribe(callback) {
    this.listeners = this.listeners.filter(l => l !== callback)
  }

  /**
   * Notify all listeners of changes
   */
  notifyListeners() {
    this.listeners.forEach(listener => {
      try {
        listener(this.settings)
      } catch (error) {
        console.error('Error in email settings listener:', error)
      }
    })
  }

  /**
   * Reset to defaults
   */
  reset() {
    localStorage.removeItem(STORAGE_KEY)
    this.settings = { ...DEFAULT_SETTINGS }
    this.notifyListeners()
    console.log('✅ Email settings reset to defaults')
  }

  /**
   * Export settings as JSON
   */
  export() {
    return JSON.stringify(this.settings, null, 2)
  }

  /**
   * Import settings from JSON
   */
  import(jsonString) {
    try {
      const imported = JSON.parse(jsonString)
      this.saveSettings(imported)
      return true
    } catch (error) {
      console.error('Error importing email settings:', error)
      return false
    }
  }

  /**
   * Get configuration status
   */
  getStatus() {
    return {
      enabled: this.isEnabled(),
      configured: this.isConfigured(),
      provider: this.settings.provider,
      from: this.settings.from,
      recipientCount: this.settings.recipients.length,
      recipients: this.settings.recipients,
      alertThresholds: this.settings.alertThresholds,
      rateLimit: this.settings.rateLimit
    }
  }
}

// Create singleton instance
const emailSettings = new EmailSettingsManager()

// Export for use in all pages
export default emailSettings

export { EmailSettingsManager, STORAGE_KEY, DEFAULT_SETTINGS }
