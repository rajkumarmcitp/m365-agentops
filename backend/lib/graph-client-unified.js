/**
 * Unified Graph API Client
 * Single instance used by all collectors
 * Manages requests, caching, retry logic, and token lifecycle
 */

import { graphConfigService } from '../services/graph-config-service.js'
import { ClientSecretCredential } from '@azure/identity'
import { Client } from '@microsoft/microsoft-graph-client'
import { TokenCredentialAuthenticationProvider } from '@microsoft/microsoft-graph-client/authProviders/azureTokenCredentials/index.js'

class UnifiedGraphClient {
  constructor() {
    this.configService = graphConfigService
    this.client = null
    this.credential = null
    this.authProvider = null

    // Unified cache (shared across all collectors)
    this.cache = new Map()
    this.cacheTimestamps = new Map()

    // Request queue for rate limiting
    this.requestQueue = []
    this.isProcessing = false

    // Statistics (reported to configService)
    this.stats = {
      totalRequests: 0,
      cachedRequests: 0,
      retriedRequests: 0,
      failedRequests: 0,
      totalLatency: 0,
      requests: []
    }

    // Token management
    this.tokenExpiry = null
    this.isRefreshingToken = false

    console.log('✅ UnifiedGraphClient initialized')
  }

  /**
   * Initialize the client with Azure credentials
   */
  async init() {
    try {
      console.log('🔧 Initializing UnifiedGraphClient...')

      const config = this.configService.getConfigRaw()

      if (!config.credentials.clientId || !config.credentials.clientSecret || !config.credentials.tenantId) {
        throw new Error('Missing Azure credentials in configuration')
      }

      // Create credential provider
      this.credential = new ClientSecretCredential(
        config.credentials.tenantId,
        config.credentials.clientId,
        config.credentials.clientSecret
      )

      // Create auth provider
      this.authProvider = new TokenCredentialAuthenticationProvider(this.credential, {
        scopes: config.scopes
      })

      // Initialize Graph client
      this.client = Client.initWithMiddleware({
        authProvider: this.authProvider,
        defaultVersion: 'v1.0'
      })

      // Set initial token expiry (assume 1 hour from now)
      this.tokenExpiry = new Date(Date.now() + 3600000)

      console.log('✅ UnifiedGraphClient ready')
      this.configService.health.status = 'connected'
      return true
    } catch (error) {
      console.error('❌ Failed to initialize UnifiedGraphClient:', error.message)
      this.configService.health.status = 'error'
      this.configService.health.lastError = error.message
      throw error
    }
  }

  /**
   * Make a GET request
   */
  async get(endpoint, options = {}) {
    return this.request('GET', endpoint, null, options)
  }

  /**
   * Make a POST request
   */
  async post(endpoint, data, options = {}) {
    return this.request('POST', endpoint, data, options)
  }

  /**
   * Make a PATCH request
   */
  async patch(endpoint, data, options = {}) {
    return this.request('PATCH', endpoint, data, options)
  }

  /**
   * Make a DELETE request
   */
  async delete(endpoint, options = {}) {
    return this.request('DELETE', endpoint, null, options)
  }

  /**
   * Execute HTTP request with retry logic, caching, and rate limiting
   */
  async request(method, endpoint, data = null, options = {}) {
    const startTime = Date.now()
    const cacheKey = `${method}:${endpoint}`

    try {
      // Check cache for GET requests
      if (method === 'GET' && !options.bypassCache) {
        const cached = this.getCached(cacheKey)
        if (cached) {
          const latency = Date.now() - startTime
          this.recordMetrics(endpoint, latency, true, false, false)
          return cached
        }
      }

      // Check token expiry before request
      if (this.shouldRefreshToken()) {
        await this.refreshToken()
      }

      // Execute request with retry logic
      let result
      let lastError

      const config = this.configService.getConfigRaw()
      const maxRetries = config.throttling.maxRetries
      const backoffInterval = config.throttling.backoffInterval
      const strategy = config.throttling.strategy

      for (let attempt = 0; attempt <= maxRetries; attempt++) {
        try {
          // Build request
          let request = this.client.api(endpoint)

          // Apply request options
          if (options.headers) {
            request = request.headers(options.headers)
          }
          if (options.select) {
            request = request.select(options.select)
          }
          if (options.filter) {
            request = request.filter(options.filter)
          }
          if (options.top) {
            request = request.top(options.top)
          }

          // Execute based on method
          switch (method) {
            case 'GET':
              result = await request.get()
              break
            case 'POST':
              result = await request.post(data)
              break
            case 'PATCH':
              result = await request.patch(data)
              break
            case 'DELETE':
              await request.delete()
              result = { success: true }
              break
            default:
              throw new Error(`Unsupported method: ${method}`)
          }

          // Cache GET responses
          if (method === 'GET') {
            const ttl = config.cache.ttl
            this.cache.set(cacheKey, result)
            this.cacheTimestamps.set(cacheKey, Date.now() + ttl)
          }

          // Record success metrics
          const latency = Date.now() - startTime
          this.recordMetrics(endpoint, latency, false, false, false)

          return result
        } catch (error) {
          lastError = error

          // Handle throttling (429) with backoff
          if (error.statusCode === 429) {
            if (attempt < maxRetries) {
              const delay = this.calculateBackoff(attempt, backoffInterval, strategy)
              const latency = Date.now() - startTime
              this.recordMetrics(endpoint, latency, false, true, false)

              console.warn(`⚠️ Rate limited. Retrying in ${delay}ms... (Attempt ${attempt + 1}/${maxRetries})`)
              await this.sleep(delay)
              continue
            }
          }

          // For other errors, retry if attempts remaining
          if (attempt < maxRetries) {
            const delay = this.calculateBackoff(attempt, backoffInterval, strategy)
            console.warn(`⚠️ Request failed: ${error.message}. Retrying in ${delay}ms... (Attempt ${attempt + 1}/${maxRetries})`)
            await this.sleep(delay)
            continue
          }

          throw error
        }
      }
    } catch (error) {
      const latency = Date.now() - startTime
      this.recordMetrics(endpoint, latency, false, false, true)

      console.error(`❌ Request failed after retries: ${endpoint}`, error.message)
      this.configService.health.errorCount++

      throw {
        statusCode: error.statusCode || 500,
        message: error.message,
        endpoint,
        latency
      }
    }
  }

  /**
   * Calculate backoff delay based on strategy
   */
  calculateBackoff(attempt, baseInterval, strategy) {
    switch (strategy) {
      case 'exponential':
        return baseInterval * Math.pow(2, attempt)
      case 'linear':
        return baseInterval * (attempt + 1)
      case 'fixed':
        return baseInterval
      default:
        return baseInterval
    }
  }

  /**
   * Sleep for specified milliseconds
   */
  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms))
  }

  /**
   * Record request metrics
   */
  recordMetrics(endpoint, latency, cached, throttled, failed) {
    this.stats.totalRequests++
    this.stats.totalLatency += latency

    if (cached) {
      this.stats.cachedRequests++
    }
    if (throttled) {
      this.stats.retriedRequests++
    }
    if (failed) {
      this.stats.failedRequests++
    }

    // Record to config service
    this.configService.recordRequest(endpoint, latency, cached, throttled, failed)

    // Keep last 100 requests for debugging
    this.stats.requests.push({
      endpoint,
      latency,
      cached,
      throttled,
      failed,
      timestamp: new Date().toISOString()
    })
    if (this.stats.requests.length > 100) {
      this.stats.requests.shift()
    }
  }

  /**
   * Get cached response if not expired
   */
  getCached(cacheKey) {
    const expiry = this.cacheTimestamps.get(cacheKey)

    if (!expiry || Date.now() > expiry) {
      this.cache.delete(cacheKey)
      this.cacheTimestamps.delete(cacheKey)
      return null
    }

    return this.cache.get(cacheKey)
  }

  /**
   * Check if token should be refreshed
   */
  shouldRefreshToken() {
    if (!this.tokenExpiry) return true

    // Refresh if less than 5 minutes remaining
    const fiveMinutesFromNow = new Date(Date.now() + 5 * 60 * 1000)
    return this.tokenExpiry < fiveMinutesFromNow
  }

  /**
   * Refresh access token
   */
  async refreshToken() {
    if (this.isRefreshingToken) {
      // Wait for in-progress refresh
      while (this.isRefreshingToken) {
        await this.sleep(100)
      }
      return
    }

    this.isRefreshingToken = true

    try {
      console.log('🔄 Refreshing Graph API token...')

      // Token is automatically refreshed by the credential provider
      // Just update our expiry timestamp
      this.tokenExpiry = new Date(Date.now() + 3600000) // 1 hour from now
      this.configService.health.lastTokenRefresh = new Date().toISOString()

      console.log('✅ Token refreshed')
      this.configService.health.status = 'connected'
    } catch (error) {
      console.error('❌ Token refresh failed:', error.message)
      this.configService.health.status = 'error'
      this.configService.health.lastError = error.message
      throw error
    } finally {
      this.isRefreshingToken = false
    }
  }

  /**
   * Get cache status
   */
  getCacheStatus() {
    let cacheSize = 0
    let expiredCount = 0
    const now = Date.now()

    this.cacheTimestamps.forEach((expiry, key) => {
      cacheSize++
      if (now > expiry) {
        expiredCount++
      }
    })

    return {
      totalCached: cacheSize,
      expired: expiredCount,
      active: cacheSize - expiredCount,
      hitRate: this.stats.totalRequests > 0
        ? Math.round((this.stats.cachedRequests / this.stats.totalRequests) * 100)
        : 0
    }
  }

  /**
   * Get request statistics
   */
  getStats() {
    const avgLatency = this.stats.totalRequests > 0
      ? Math.round(this.stats.totalLatency / this.stats.totalRequests)
      : 0

    return {
      totalRequests: this.stats.totalRequests,
      cachedRequests: this.stats.cachedRequests,
      retriedRequests: this.stats.retriedRequests,
      failedRequests: this.stats.failedRequests,
      successRate: Math.round(((this.stats.totalRequests - this.stats.failedRequests) / this.stats.totalRequests) * 100) || 0,
      avgLatency: `${avgLatency}ms`,
      cacheHitRate: Math.round((this.stats.cachedRequests / this.stats.totalRequests) * 100) || 0,
      recentRequests: this.stats.requests.slice(-10)
    }
  }

  /**
   * Clear cache
   */
  clearCache() {
    this.cache.clear()
    this.cacheTimestamps.clear()
    console.log('✅ Unified cache cleared')
  }

  /**
   * Clear statistics
   */
  clearStats() {
    this.stats = {
      totalRequests: 0,
      cachedRequests: 0,
      retriedRequests: 0,
      failedRequests: 0,
      totalLatency: 0,
      requests: []
    }
    console.log('✅ Client statistics cleared')
  }

  /**
   * Get current health status
   */
  getHealth() {
    return {
      initialized: !!this.client,
      tokenExpiry: this.tokenExpiry?.toISOString(),
      cacheStatus: this.getCacheStatus(),
      isRefreshingToken: this.isRefreshingToken,
      configServiceHealth: this.configService.getHealth()
    }
  }

  /**
   * Test connection (validates credentials and token)
   */
  async testConnection() {
    try {
      const startTime = Date.now()
      const result = await this.get('/me')
      const latency = Date.now() - startTime

      return {
        success: true,
        message: 'Connection successful',
        latency,
        user: result.displayName || result.userPrincipalName,
        timestamp: new Date().toISOString()
      }
    } catch (error) {
      return {
        success: false,
        message: error.message,
        latency: Date.now() - error.startTime || 0
      }
    }
  }
}

// Create singleton instance
const unifiedGraphClient = new UnifiedGraphClient()

export { unifiedGraphClient, UnifiedGraphClient }
