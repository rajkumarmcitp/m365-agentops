/**
 * Service Health Cache Manager
 * Implements smart caching with deduplication and expiration
 */

class ServiceHealthCache {
  constructor() {
    this.cache = new Map()
    this.pendingRequests = new Map()
    this.expirationTimes = new Map()
    this.DEFAULT_TTL = 5 * 60 * 1000 // 5 minutes
  }

  /**
   * Get cached value or execute fetch with deduplication
   * Prevents duplicate concurrent requests for same resource
   * @param {string} key - Cache key
   * @param {Function} fetchFn - Async function to fetch data
   * @param {number} ttl - Time to live in ms
   * @returns {Promise<*>} Cached or fetched value
   */
  async getOrFetch(key, fetchFn, ttl = this.DEFAULT_TTL) {
    // Check if value exists and is not expired
    if (this.cache.has(key)) {
      const expTime = this.expirationTimes.get(key)
      if (expTime && Date.now() < expTime) {
        console.log(`[Cache] ✓ Hit: ${key}`)
        return this.cache.get(key)
      }
      // Expired - remove it
      this.cache.delete(key)
      this.expirationTimes.delete(key)
    }

    // Check if request is already pending (deduplication)
    if (this.pendingRequests.has(key)) {
      console.log(`[Cache] ⏳ Dedup: ${key} (waiting for in-flight request)`)
      return this.pendingRequests.get(key)
    }

    // Fetch new value
    console.log(`[Cache] ↓ Miss: ${key} (fetching)`)
    const promise = fetchFn()
      .then(value => {
        this.cache.set(key, value)
        this.expirationTimes.set(key, Date.now() + ttl)
        this.pendingRequests.delete(key)
        console.log(`[Cache] ✓ Stored: ${key}`)
        return value
      })
      .catch(error => {
        this.pendingRequests.delete(key)
        throw error
      })

    this.pendingRequests.set(key, promise)
    return promise
  }

  /**
   * Invalidate cache entry
   * @param {string} key - Cache key to invalidate
   */
  invalidate(key) {
    this.cache.delete(key)
    this.expirationTimes.delete(key)
    console.log(`[Cache] ✗ Invalidated: ${key}`)
  }

  /**
   * Invalidate all cache entries
   */
  invalidateAll() {
    this.cache.clear()
    this.expirationTimes.clear()
    console.log(`[Cache] ✗ Invalidated all`)
  }

  /**
   * Get cache statistics
   * @returns {Object} Cache stats
   */
  getStats() {
    const now = Date.now()
    let validCount = 0
    let expiredCount = 0

    for (const [key, expTime] of this.expirationTimes) {
      if (now < expTime) {
        validCount++
      } else {
        expiredCount++
      }
    }

    return {
      total: this.cache.size,
      valid: validCount,
      expired: expiredCount,
      pending: this.pendingRequests.size
    }
  }

  /**
   * Clear expired entries
   */
  clearExpired() {
    const now = Date.now()
    let cleared = 0

    for (const [key, expTime] of this.expirationTimes) {
      if (now >= expTime) {
        this.cache.delete(key)
        this.expirationTimes.delete(key)
        cleared++
      }
    }

    if (cleared > 0) {
      console.log(`[Cache] Cleared ${cleared} expired entries`)
    }

    return cleared
  }
}

export const serviceHealthCache = new ServiceHealthCache()

/**
 * Request batch accumulator for batching API requests
 * Useful for reducing API calls when multiple components request same data
 */
export class RequestBatcher {
  constructor(batchSize = 50, batchDelayMs = 100) {
    this.queue = []
    this.batchSize = batchSize
    this.batchDelayMs = batchDelayMs
    this.flushTimeout = null
    this.processing = false
  }

  /**
   * Add request to batch
   * @param {string} id - Request ID
   * @param {*} data - Request data
   * @returns {Promise<*>} Result promise
   */
  add(id, data) {
    return new Promise((resolve, reject) => {
      this.queue.push({ id, data, resolve, reject })

      // Flush if batch is full
      if (this.queue.length >= this.batchSize) {
        this.flush()
      } else if (!this.flushTimeout) {
        // Schedule flush if not already scheduled
        this.flushTimeout = setTimeout(() => this.flush(), this.batchDelayMs)
      }
    })
  }

  /**
   * Flush pending requests
   * @param {Function} processFn - Function to process batch
   * @returns {Promise<*>} Processing promise
   */
  async flush(processFn) {
    if (this.processing || this.queue.length === 0) {
      return
    }

    clearTimeout(this.flushTimeout)
    this.flushTimeout = null

    const batch = this.queue.splice(0, this.batchSize)
    this.processing = true

    try {
      if (processFn) {
        const results = await processFn(batch)
        batch.forEach((req, idx) => {
          req.resolve(results[idx])
        })
      }
    } catch (error) {
      batch.forEach(req => req.reject(error))
    } finally {
      this.processing = false

      // Schedule next flush if more items
      if (this.queue.length > 0) {
        this.flushTimeout = setTimeout(() => this.flush(processFn), this.batchDelayMs)
      }
    }
  }

  /**
   * Get queue size
   * @returns {number} Pending requests
   */
  size() {
    return this.queue.length
  }
}

/**
 * Performance monitor for API calls
 */
export class PerformanceMonitor {
  constructor() {
    this.calls = []
    this.maxEntries = 1000
  }

  /**
   * Record API call
   * @param {string} endpoint - API endpoint
   * @param {number} duration - Duration in ms
   * @param {boolean} success - Was successful
   */
  record(endpoint, duration, success) {
    this.calls.push({
      endpoint,
      duration,
      success,
      timestamp: Date.now()
    })

    // Keep only recent calls
    if (this.calls.length > this.maxEntries) {
      this.calls.shift()
    }
  }

  /**
   * Get performance summary
   * @param {string} endpoint - Optional endpoint filter
   * @returns {Object} Summary stats
   */
  getSummary(endpoint = null) {
    let calls = this.calls

    if (endpoint) {
      calls = calls.filter(c => c.endpoint === endpoint)
    }

    if (calls.length === 0) {
      return null
    }

    const durations = calls.map(c => c.duration)
    const successful = calls.filter(c => c.success).length

    return {
      count: calls.length,
      successful,
      failed: calls.length - successful,
      successRate: ((successful / calls.length) * 100).toFixed(1),
      avgDuration: (durations.reduce((a, b) => a + b, 0) / calls.length).toFixed(0),
      minDuration: Math.min(...durations),
      maxDuration: Math.max(...durations),
      p95Duration: this._percentile(durations, 0.95)
    }
  }

  /**
   * Calculate percentile
   * @param {Array} arr - Sorted array
   * @param {number} p - Percentile (0-1)
   * @returns {number} Value at percentile
   */
  _percentile(arr, p) {
    const sorted = [...arr].sort((a, b) => a - b)
    const index = Math.ceil(sorted.length * p) - 1
    return sorted[Math.max(0, index)]
  }

  /**
   * Clear history
   */
  clear() {
    this.calls = []
  }
}

export const performanceMonitor = new PerformanceMonitor()
