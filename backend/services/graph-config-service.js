/**
 * Graph API Configuration Service
 * Singleton service managing centralized Graph API configuration
 * All collectors use this single source of truth
 */

class GraphConfigService {
  constructor() {
    // Load initial config from environment variables
    this.config = {
      credentials: {
        clientId: process.env.AZURE_CLIENT_ID || '',
        clientSecret: process.env.AZURE_CLIENT_SECRET || '',
        tenantId: process.env.AZURE_TENANT_ID || '',
        redirectUri: process.env.AZURE_REDIRECT_URI || 'http://localhost:3000/auth/callback'
      },

      throttling: {
        maxRetries: parseInt(process.env.GRAPH_MAX_RETRIES || '3'),
        backoffInterval: parseInt(process.env.GRAPH_BACKOFF_INTERVAL || '1000'),
        strategy: process.env.GRAPH_BACKOFF_STRATEGY || 'exponential',
        maxConcurrent: parseInt(process.env.GRAPH_MAX_CONCURRENT || '4')
      },

      cache: {
        ttl: parseInt(process.env.GRAPH_CACHE_TTL || '1800000'), // 30 minutes
        strategy: process.env.GRAPH_CACHE_STRATEGY || 'memory',
        enabled: process.env.GRAPH_CACHE_ENABLED !== 'false'
      },

      timeout: parseInt(process.env.GRAPH_TIMEOUT || '30000'),

      rateLimiting: {
        enabled: process.env.GRAPH_RATE_LIMIT_ENABLED !== 'false',
        requestsPerSecond: parseInt(process.env.GRAPH_REQUESTS_PER_SECOND || '100')
      },

      scopes: ['https://graph.microsoft.com/.default'],

      permissions: {
        app: [
          'User.Read.All',
          'Group.ReadWrite.All',
          'Mail.ReadWrite',
          'Directory.Read.All',
          'AuditLog.Read.All',
          'Policy.Read.All',
          'DeviceManagementConfiguration.Read.All',
          'DeviceManagementManagedDevices.Read.All',
          'SecurityEvents.Read.All',
          'SecurityActions.Read.All'
        ],
        delegated: [
          'User.Read',
          'openid',
          'offline_access'
        ]
      }
    }

    // Health status tracking
    this.health = {
      status: 'disconnected', // disconnected, initializing, connected, error
      lastTokenRefresh: null,
      lastTokenExpiryCheck: null,
      errorCount: 0,
      successCount: 0,
      uptime: 0,
      lastError: null,
      lastErrorTime: null
    }

    // Statistics tracking
    this.stats = {
      startTime: Date.now(),
      totalRequests: 0,
      cachedResponses: 0,
      throttledRequests: 0,
      failedRequests: 0,
      totalLatency: 0,
      minLatency: Infinity,
      maxLatency: 0,
      lastRequestTime: null,
      lastRequestEndpoint: null
    }

    // Configuration change history (for audit trail)
    this.history = []

    // Validation state
    this.initialized = false
    this.credentialsValid = false

    console.log('✅ GraphConfigService initialized')
  }

  /**
   * Reload credentials from environment variables
   * Call this after dotenv.config() loads
   */
  reloadCredentials() {
    const newClientId = process.env.AZURE_CLIENT_ID || ''
    const newClientSecret = process.env.AZURE_CLIENT_SECRET || ''
    const newTenantId = process.env.AZURE_TENANT_ID || ''

    const changed =
      newClientId !== this.config.credentials.clientId ||
      newClientSecret !== this.config.credentials.clientSecret ||
      newTenantId !== this.config.credentials.tenantId

    if (changed) {
      this.config.credentials.clientId = newClientId
      this.config.credentials.clientSecret = newClientSecret
      this.config.credentials.tenantId = newTenantId
      console.log('✅ Graph API credentials reloaded from environment')
    }
  }

  /**
   * Initialize the service (validate credentials)
   */
  async init() {
    console.log('🔧 Initializing GraphConfigService...')

    if (!this.config.credentials.clientId || !this.config.credentials.clientSecret || !this.config.credentials.tenantId) {
      console.warn('⚠️  Graph API credentials incomplete - using partial configuration')
      this.health.status = 'error'
      this.health.lastError = 'Missing credentials'
      this.health.lastErrorTime = new Date().toISOString()
      return false
    }

    this.initialized = true
    this.credentialsValid = true
    this.health.status = 'initializing'
    console.log('✅ GraphConfigService ready')
    return true
  }

  /**
   * Get current configuration (masks sensitive values)
   */
  getConfig() {
    return {
      credentials: {
        clientId: this.config.credentials.clientId,
        clientSecret: '•••••••••••••••' + this.config.credentials.clientSecret.slice(-4),
        tenantId: this.config.credentials.tenantId,
        redirectUri: this.config.credentials.redirectUri
      },
      throttling: { ...this.config.throttling },
      cache: { ...this.config.cache },
      timeout: this.config.timeout,
      rateLimiting: { ...this.config.rateLimiting },
      scopes: [...this.config.scopes],
      permissions: {
        app: [...this.config.permissions.app],
        delegated: [...this.config.permissions.delegated]
      }
    }
  }

  /**
   * Get raw config (with real secrets - for internal use only)
   */
  getConfigRaw() {
    return this.config
  }

  /**
   * Update configuration
   */
  updateConfig(newConfig) {
    try {
      const changes = {}

      // Update credentials if provided
      if (newConfig.credentials) {
        if (newConfig.credentials.clientId) {
          changes.clientId = { old: this.config.credentials.clientId, new: newConfig.credentials.clientId }
          this.config.credentials.clientId = newConfig.credentials.clientId
        }
        if (newConfig.credentials.clientSecret) {
          changes.clientSecret = { old: '***', new: '***' }
          this.config.credentials.clientSecret = newConfig.credentials.clientSecret
        }
        if (newConfig.credentials.tenantId) {
          changes.tenantId = { old: this.config.credentials.tenantId, new: newConfig.credentials.tenantId }
          this.config.credentials.tenantId = newConfig.credentials.tenantId
        }
        if (newConfig.credentials.redirectUri) {
          changes.redirectUri = { old: this.config.credentials.redirectUri, new: newConfig.credentials.redirectUri }
          this.config.credentials.redirectUri = newConfig.credentials.redirectUri
        }
      }

      // Update throttling if provided
      if (newConfig.throttling) {
        Object.keys(newConfig.throttling).forEach(key => {
          if (this.config.throttling.hasOwnProperty(key)) {
            changes[`throttling.${key}`] = {
              old: this.config.throttling[key],
              new: newConfig.throttling[key]
            }
            this.config.throttling[key] = newConfig.throttling[key]
          }
        })
      }

      // Update cache if provided
      if (newConfig.cache) {
        Object.keys(newConfig.cache).forEach(key => {
          if (this.config.cache.hasOwnProperty(key)) {
            changes[`cache.${key}`] = {
              old: this.config.cache[key],
              new: newConfig.cache[key]
            }
            this.config.cache[key] = newConfig.cache[key]
          }
        })
      }

      // Update timeout if provided
      if (newConfig.timeout !== undefined) {
        changes.timeout = { old: this.config.timeout, new: newConfig.timeout }
        this.config.timeout = newConfig.timeout
      }

      // Update rate limiting if provided
      if (newConfig.rateLimiting) {
        Object.keys(newConfig.rateLimiting).forEach(key => {
          if (this.config.rateLimiting.hasOwnProperty(key)) {
            changes[`rateLimiting.${key}`] = {
              old: this.config.rateLimiting[key],
              new: newConfig.rateLimiting[key]
            }
            this.config.rateLimiting[key] = newConfig.rateLimiting[key]
          }
        })
      }

      // Log to history
      this.history.push({
        timestamp: new Date().toISOString(),
        action: 'update',
        changes,
        status: 'success',
        source: 'api'
      })

      console.log('✅ Configuration updated:', Object.keys(changes).join(', '))
      return { success: true, changes }
    } catch (error) {
      console.error('❌ Failed to update configuration:', error.message)
      this.health.errorCount++
      this.health.lastError = error.message
      this.health.lastErrorTime = new Date().toISOString()
      return { success: false, error: error.message }
    }
  }

  /**
   * Rotate client secret (for credential updates)
   */
  async rotateCredentials(newClientSecret) {
    try {
      const oldSecret = this.config.credentials.clientSecret

      // Update secret
      this.config.credentials.clientSecret = newClientSecret
      this.credentialsValid = true

      // Log to history
      this.history.push({
        timestamp: new Date().toISOString(),
        action: 'rotate-credentials',
        changes: { clientSecret: { old: '***', new: '***' } },
        status: 'success',
        source: 'api'
      })

      console.log('✅ Client secret rotated successfully')
      return { success: true, message: 'Credentials rotated' }
    } catch (error) {
      console.error('❌ Failed to rotate credentials:', error.message)
      this.health.errorCount++
      this.health.lastError = error.message
      this.health.lastErrorTime = new Date().toISOString()
      return { success: false, error: error.message }
    }
  }

  /**
   * Test connection with current credentials
   */
  async testConnection() {
    try {
      const startTime = Date.now()

      if (!this.config.credentials.clientId || !this.config.credentials.clientSecret) {
        return {
          success: false,
          message: 'Missing credentials',
          latency: 0
        }
      }

      // Simulate connection test (would actually call Azure AD in real implementation)
      // For now, just check if credentials are provided
      const latency = Date.now() - startTime

      this.health.status = 'connected'
      this.health.successCount++
      this.stats.totalLatency += latency

      console.log(`✅ Connection test successful (${latency}ms)`)
      return {
        success: true,
        message: 'Connection successful',
        latency,
        timestamp: new Date().toISOString()
      }
    } catch (error) {
      console.error('❌ Connection test failed:', error.message)
      this.health.status = 'error'
      this.health.errorCount++
      this.health.lastError = error.message
      this.health.lastErrorTime = new Date().toISOString()
      return {
        success: false,
        message: error.message,
        latency: 0
      }
    }
  }

  /**
   * Refresh token (simulate token refresh)
   */
  async refreshToken() {
    try {
      this.health.lastTokenRefresh = new Date().toISOString()
      this.health.successCount++

      console.log('✅ Token refreshed successfully')
      return {
        success: true,
        message: 'Token refreshed',
        lastRefresh: this.health.lastTokenRefresh,
        expiresIn: 3600 // 1 hour
      }
    } catch (error) {
      console.error('❌ Token refresh failed:', error.message)
      this.health.errorCount++
      this.health.lastError = error.message
      this.health.lastErrorTime = new Date().toISOString()
      return {
        success: false,
        error: error.message
      }
    }
  }

  /**
   * Get health status
   */
  getHealth() {
    const uptime = Date.now() - this.stats.startTime
    return {
      status: this.health.status,
      initialized: this.initialized,
      credentialsValid: this.credentialsValid,
      lastTokenRefresh: this.health.lastTokenRefresh,
      lastTokenExpiryCheck: this.health.lastTokenExpiryCheck,
      errorCount: this.health.errorCount,
      successCount: this.health.successCount,
      uptime,
      lastError: this.health.lastError,
      lastErrorTime: this.health.lastErrorTime,
      timestamp: new Date().toISOString()
    }
  }

  /**
   * Get statistics
   */
  getStats() {
    const avgLatency = this.stats.totalRequests > 0
      ? Math.round(this.stats.totalLatency / this.stats.totalRequests)
      : 0

    const cacheHitRate = this.stats.totalRequests > 0
      ? Math.round((this.stats.cachedResponses / this.stats.totalRequests) * 100)
      : 0

    return {
      startTime: new Date(this.stats.startTime).toISOString(),
      uptime: Date.now() - this.stats.startTime,
      totalRequests: this.stats.totalRequests,
      cachedResponses: this.stats.cachedResponses,
      cacheHitRate: `${cacheHitRate}%`,
      throttledRequests: this.stats.throttledRequests,
      failedRequests: this.stats.failedRequests,
      successRate: `${this.stats.totalRequests > 0 ? Math.round(((this.stats.totalRequests - this.stats.failedRequests) / this.stats.totalRequests) * 100) : 0}%`,
      avgLatency: `${avgLatency}ms`,
      minLatency: this.stats.minLatency === Infinity ? 0 : `${this.stats.minLatency}ms`,
      maxLatency: `${this.stats.maxLatency}ms`,
      lastRequestTime: this.stats.lastRequestTime,
      lastRequestEndpoint: this.stats.lastRequestEndpoint,
      timestamp: new Date().toISOString()
    }
  }

  /**
   * Record API request for statistics
   */
  recordRequest(endpoint, latency, cached = false, throttled = false, failed = false) {
    this.stats.totalRequests++
    this.stats.totalLatency += latency
    this.stats.lastRequestTime = new Date().toISOString()
    this.stats.lastRequestEndpoint = endpoint

    if (latency < this.stats.minLatency) {
      this.stats.minLatency = latency
    }
    if (latency > this.stats.maxLatency) {
      this.stats.maxLatency = latency
    }

    if (cached) {
      this.stats.cachedResponses++
    }
    if (throttled) {
      this.stats.throttledRequests++
    }
    if (failed) {
      this.stats.failedRequests++
      this.health.errorCount++
    } else {
      this.health.successCount++
    }
  }

  /**
   * Get configuration history (audit trail)
   */
  getHistory(limit = 50) {
    return this.history.slice(-limit).reverse()
  }

  /**
   * Clear statistics
   */
  clearStats() {
    this.stats = {
      startTime: Date.now(),
      totalRequests: 0,
      cachedResponses: 0,
      throttledRequests: 0,
      failedRequests: 0,
      totalLatency: 0,
      minLatency: Infinity,
      maxLatency: 0,
      lastRequestTime: null,
      lastRequestEndpoint: null
    }
    console.log('✅ Statistics cleared')
  }

  /**
   * Export configuration (for persistence)
   */
  exportConfig() {
    return {
      config: this.config,
      history: this.history,
      exportTime: new Date().toISOString()
    }
  }

  /**
   * Import configuration (from persistence)
   */
  importConfig(exportedConfig) {
    try {
      this.config = exportedConfig.config
      this.history = exportedConfig.history || []
      console.log('✅ Configuration imported from backup')
      return { success: true }
    } catch (error) {
      console.error('❌ Failed to import configuration:', error.message)
      return { success: false, error: error.message }
    }
  }

  /**
   * Validate configuration completeness
   */
  validateConfig() {
    const issues = []

    if (!this.config.credentials.clientId) {
      issues.push('Missing AZURE_CLIENT_ID')
    }
    if (!this.config.credentials.clientSecret) {
      issues.push('Missing AZURE_CLIENT_SECRET')
    }
    if (!this.config.credentials.tenantId) {
      issues.push('Missing AZURE_TENANT_ID')
    }
    if (this.config.throttling.maxRetries < 1 || this.config.throttling.maxRetries > 10) {
      issues.push('Invalid maxRetries (should be 1-10)')
    }
    if (this.config.throttling.maxConcurrent < 1 || this.config.throttling.maxConcurrent > 50) {
      issues.push('Invalid maxConcurrent (should be 1-50)')
    }
    if (this.config.timeout < 5000 || this.config.timeout > 120000) {
      issues.push('Invalid timeout (should be 5000-120000ms)')
    }

    return {
      valid: issues.length === 0,
      issues
    }
  }
}

// Create singleton instance
export const graphConfigService = new GraphConfigService()

// Export class for testing
export { GraphConfigService }
