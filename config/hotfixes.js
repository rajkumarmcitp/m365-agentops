/**
 * Production Hotfixes & Temporary Fixes
 * These are temporary workarounds for production issues
 * Apply environment variables to enable/disable these fixes
 *
 * Environment variables (set in .env.production or deployment):
 * VITE_HOTFIX_SKIP_ALERTS=true
 * VITE_HOTFIX_REDUCE_TIMEOUT=true
 * VITE_HOTFIX_DISABLE_FEATURES=feature1,feature2
 * VITE_HOTFIX_DASHBOARD_REFRESH=120000 (milliseconds)
 */

export const HOTFIXES = {
  // TenantGuard alerts loading issue
  skipTenantGuardAlerts: import.meta.env.VITE_HOTFIX_SKIP_ALERTS === 'true',
  skipTenantGuardAlertsReason: 'Performance issue - backend API slow',
  skipTenantGuardAlertsAppliedDate: '2026-06-22',

  // API timeout reduction
  reduceApiTimeout: import.meta.env.VITE_HOTFIX_REDUCE_TIMEOUT === 'true',
  reducedApiTimeout: import.meta.env.VITE_HOTFIX_API_TIMEOUT ? parseInt(import.meta.env.VITE_HOTFIX_API_TIMEOUT) : 15000,
  reduceApiTimeoutReason: 'Network latency issue',
  reduceApiTimeoutAppliedDate: '2026-06-23',

  // Disabled features (comma-separated)
  disabledFeatures: (import.meta.env.VITE_HOTFIX_DISABLE_FEATURES || '').split(',').filter(Boolean),
  disabledFeaturesReason: 'Temporary disable due to bugs',

  // Dashboard refresh interval override
  dashboardRefreshInterval: import.meta.env.VITE_HOTFIX_DASHBOARD_REFRESH ? parseInt(import.meta.env.VITE_HOTFIX_DASHBOARD_REFRESH) : null,
  dashboardRefreshReason: 'Reduce API load',

  // Security page disable
  disableSecurity: import.meta.env.VITE_HOTFIX_DISABLE_SECURITY === 'true',
  disableSecurityReason: 'Memory leak in compliance checks',
  disableSecurityAppliedDate: '2026-06-24',

  // Configuration page disable
  disableM365Config: import.meta.env.VITE_HOTFIX_DISABLE_M365CONFIG === 'true',
  disableM365ConfigReason: 'CIS benchmark API timing out',

  // Change Intelligence disable
  disableChangeIntelligence: import.meta.env.VITE_HOTFIX_DISABLE_CHANGEINTEL === 'true',
  disableChangeIntelligenceReason: 'SharePoint sync issues',

  /**
   * Check if a feature should be disabled due to hotfix
   * @param {string} featureName - Name of feature to check
   * @returns {boolean} true if feature is disabled by hotfix
   */
  isFeatureDisabled(featureName) {
    return this.disabledFeatures.includes(featureName) ||
           (featureName === 'tenantguard-alerts' && this.skipTenantGuardAlerts) ||
           (featureName === 'security' && this.disableSecurity) ||
           (featureName === 'm365config' && this.disableM365Config) ||
           (featureName === 'changeintelligence' && this.disableChangeIntelligence)
  },

  /**
   * Get all active hotfixes (useful for debugging)
   * @returns {Array} Array of active hotfix names
   */
  getActiveHotfixes() {
    const active = []
    if (this.skipTenantGuardAlerts) active.push('skipTenantGuardAlerts')
    if (this.reduceApiTimeout) active.push('reduceApiTimeout')
    if (this.disabledFeatures.length > 0) active.push(`disabledFeatures: ${this.disabledFeatures.join(', ')}`)
    if (this.dashboardRefreshInterval) active.push(`dashboardRefreshInterval: ${this.dashboardRefreshInterval}ms`)
    if (this.disableSecurity) active.push('disableSecurity')
    if (this.disableM365Config) active.push('disableM365Config')
    if (this.disableChangeIntelligence) active.push('disableChangeIntelligence')
    return active
  },

  /**
   * Log all active hotfixes to console
   */
  logActiveHotfixes() {
    const active = this.getActiveHotfixes()
    if (active.length > 0) {
      console.warn('⚠️ PRODUCTION HOTFIXES ACTIVE:')
      active.forEach(fix => console.warn(`   - ${fix}`))
    }
  },
}

// Log active hotfixes on load
if (typeof window !== 'undefined') {
  window.addEventListener('load', () => {
    HOTFIXES.logActiveHotfixes()
  })
}
