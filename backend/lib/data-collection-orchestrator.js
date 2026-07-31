/**
 * Data Collection Orchestrator
 * Central hub for all Graph API data collection
 * Manages collectors, caching, incremental sync, and delta queries
 *
 * ARCHITECTURE PRINCIPLE:
 * Collect data ONCE via collectors → Cache locally → Validators read cache
 * Result: 120-180 Graph calls, 30-60 second validation, ZERO per-control API calls
 */

import Redis from 'redis'

export class DataCollectionOrchestrator {
  constructor(graphClient, options = {}) {
    this.graphClient = graphClient
    this.cacheEnabled = options.cacheEnabled !== false
    this.cacheTTL = options.cacheTTL || {} // Per-datatype TTL
    this.deltaTracker = new Map() // Track delta tokens per datatype

    // Initialize cache
    if (this.cacheEnabled) {
      this.cache = null // Will be initialized in init()
      this.cacheType = options.cacheType || 'memory' // 'memory' or 'redis'
      this.memoryCache = new Map() // Fallback in-memory cache
    }

    // Collectors registry (lazy-loaded)
    this.collectors = {}

    // Collection metadata
    this.collectionStats = {
      lastRun: null,
      nextRun: null,
      totalApiCalls: 0,
      successCount: 0,
      failureCount: 0,
      cacheSizeBytes: 0,
      runtimeMs: 0
    }

    console.log('✅ DataCollectionOrchestrator initialized')
  }

  /**
   * Initialize Redis connection (if enabled)
   */
  async initCache() {
    if (!this.cacheEnabled || this.cacheType !== 'redis') {
      console.log('📝 Using in-memory cache')
      return
    }

    try {
      this.cache = Redis.createClient({
        host: process.env.REDIS_HOST || 'localhost',
        port: process.env.REDIS_PORT || 6379,
        password: process.env.REDIS_PASSWORD || undefined,
        db: process.env.REDIS_DB || 0
      })

      await this.cache.connect()
      console.log('✅ Redis cache connected')
    } catch (err) {
      console.warn('⚠️ Redis connection failed, falling back to memory cache:', err.message)
      this.cache = null
      this.cacheType = 'memory'
    }
  }

  /**
   * Register a collector
   */
  registerCollector(name, collector) {
    this.collectors[name] = collector
    console.log(`✅ Registered collector: ${name}`)
  }

  /**
   * Set TTL for a specific data type
   */
  setDataTTL(dataType, ttlMs) {
    this.cacheTTL[dataType] = ttlMs
  }

  /**
   * Run full collection (all collectors in parallel)
   */
  async runFullCollection(tenantId) {
    const startTime = Date.now()
    console.log(`🔄 Starting full collection for tenant: ${tenantId}`)

    try {
      const results = {}
      const errors = {}
      let apiCallCount = 0

      // Run all collectors in parallel
      const collectorEntries = Object.entries(this.collectors)
      const collectionPromises = collectorEntries.map(async ([name, collector]) => {
        try {
          console.log(`  📥 Running ${name}...`)
          const data = await collector.collect(this.graphClient, tenantId)

          results[name] = data
          apiCallCount += data.apiCallCount || 0

          // Cache the result
          await this.cacheData(`${name}.json`, data, this.cacheTTL[name])

          console.log(`  ✅ ${name}: ${JSON.stringify(data).length} bytes`)
          return { success: true, name }
        } catch (err) {
          console.error(`  ❌ ${name} failed:`, err.message)
          errors[name] = err.message
          return { success: false, name, error: err.message }
        }
      })

      const collectionResults = await Promise.allSettled(collectionPromises)

      // Update stats
      this.collectionStats.lastRun = new Date()
      this.collectionStats.totalApiCalls = apiCallCount
      this.collectionStats.successCount = collectionResults.filter(r => r.status === 'fulfilled' && r.value.success).length
      this.collectionStats.failureCount = collectionResults.filter(r => r.status === 'rejected' || (r.status === 'fulfilled' && !r.value.success)).length
      this.collectionStats.runtimeMs = Date.now() - startTime

      console.log(`
📊 Collection Complete:
  ✅ Successes: ${this.collectionStats.successCount}
  ❌ Failures: ${this.collectionStats.failureCount}
  📞 API Calls: ${apiCallCount}
  ⏱️  Time: ${this.collectionStats.runtimeMs}ms
      `)

      return {
        success: this.collectionStats.failureCount === 0,
        results,
        errors,
        stats: this.collectionStats
      }
    } catch (err) {
      console.error('❌ Collection failed:', err)
      return {
        success: false,
        error: err.message,
        stats: this.collectionStats
      }
    }
  }

  /**
   * Run incremental collection (only changed data)
   */
  async runIncrementalSync(tenantId) {
    console.log(`🔄 Starting incremental sync for tenant: ${tenantId}`)
    const startTime = Date.now()

    try {
      const results = {}
      let apiCallCount = 0

      // Run delta queries for collectors that support it
      const syncPromises = Object.entries(this.collectors)
        .filter(([, collector]) => collector.supportsDelta)
        .map(async ([name, collector]) => {
          try {
            // Get delta token from tracker
            const deltaToken = this.deltaTracker.get(name)

            const data = await collector.delta(
              this.graphClient,
              tenantId,
              deltaToken
            )

            results[name] = data
            apiCallCount += data.apiCallCount || 0

            // Store new delta token
            if (data.deltaToken) {
              this.deltaTracker.set(name, data.deltaToken)
            }

            // Merge with existing cache
            await this.mergeData(`${name}.json`, data)

            console.log(`  ✅ ${name}: ${data.changes || 0} changes`)
            return { success: true, name }
          } catch (err) {
            console.error(`  ❌ ${name} sync failed:`, err.message)
            return { success: false, name, error: err.message }
          }
        })

      const syncResults = await Promise.allSettled(syncPromises)

      console.log(`
⚡ Incremental Sync Complete:
  📞 API Calls: ${apiCallCount}
  ⏱️  Time: ${Date.now() - startTime}ms
      `)

      return {
        success: true,
        results,
        stats: {
          apiCalls: apiCallCount,
          runtimeMs: Date.now() - startTime
        }
      }
    } catch (err) {
      console.error('❌ Incremental sync failed:', err)
      return {
        success: false,
        error: err.message
      }
    }
  }

  /**
   * Get cached data (ZERO API calls)
   */
  async getCachedData(dataType) {
    if (!this.cacheEnabled) {
      console.warn('⚠️ Cache disabled')
      return null
    }

    try {
      // Try Redis first
      if (this.cache && this.cacheType === 'redis') {
        const cached = await this.cache.get(`tenantguard:${dataType}`)
        if (cached) {
          console.log(`✅ Cache hit (Redis): ${dataType}`)
          return JSON.parse(cached)
        }
      }

      // Fall back to memory cache
      const memCached = this.memoryCache.get(dataType)
      if (memCached && this.isCacheValid(memCached)) {
        console.log(`✅ Cache hit (Memory): ${dataType}`)
        return memCached.data
      }

      console.log(`❌ Cache miss: ${dataType}`)
      return null
    } catch (err) {
      console.error('Cache retrieval error:', err)
      return null
    }
  }

  /**
   * Cache data with TTL
   */
  async cacheData(key, data, ttlMs = null) {
    const ttl = ttlMs || this.cacheTTL.default || 3600000 // 1 hour default

    try {
      // Store in memory cache
      this.memoryCache.set(key, {
        data,
        timestamp: Date.now(),
        ttl
      })

      // Also store in Redis if available
      if (this.cache && this.cacheType === 'redis') {
        await this.cache.setEx(
          `tenantguard:${key}`,
          Math.floor(ttl / 1000),
          JSON.stringify(data)
        )
      }

      return true
    } catch (err) {
      console.error('Cache storage error:', err)
      return false
    }
  }

  /**
   * Merge incremental data with cached data
   */
  async mergeData(key, incrementalData) {
    try {
      const existing = await this.getCachedData(key.replace('.json', ''))

      if (!existing) {
        await this.cacheData(key, incrementalData)
        return
      }

      // Merge based on data type
      const merged = this.mergeDatasets(existing, incrementalData)
      await this.cacheData(key, merged)
    } catch (err) {
      console.error('Data merge error:', err)
    }
  }

  /**
   * Merge two datasets intelligently
   */
  mergeDatasets(existing, incremental) {
    // For arrays: merge by ID
    if (Array.isArray(existing) && Array.isArray(incremental)) {
      const merged = [...existing]
      const ids = new Set(existing.map(item => item.id || item.key))

      for (const item of incremental) {
        if (ids.has(item.id || item.key)) {
          // Update existing
          const idx = merged.findIndex(m => (m.id || m.key) === (item.id || item.key))
          merged[idx] = item
        } else {
          // Add new
          merged.push(item)
        }
      }
      return merged
    }

    // For objects: deep merge
    if (typeof existing === 'object' && typeof incremental === 'object') {
      return { ...existing, ...incremental }
    }

    return incremental
  }

  /**
   * Check if cached data is still valid (hasn't exceeded TTL)
   */
  isCacheValid(cacheEntry) {
    if (!cacheEntry.timestamp || !cacheEntry.ttl) return false
    return Date.now() - cacheEntry.timestamp < cacheEntry.ttl
  }

  /**
   * Clear cache for a specific data type
   */
  async clearCache(dataType = null) {
    try {
      if (!dataType) {
        // Clear all
        this.memoryCache.clear()
        if (this.cache && this.cacheType === 'redis') {
          await this.cache.flushDb()
        }
        console.log('✅ Cache cleared (all)')
      } else {
        // Clear specific
        this.memoryCache.delete(dataType)
        if (this.cache && this.cacheType === 'redis') {
          await this.cache.del(`tenantguard:${dataType}`)
        }
        console.log(`✅ Cache cleared: ${dataType}`)
      }
    } catch (err) {
      console.error('Cache clear error:', err)
    }
  }

  /**
   * Get collection statistics
   */
  getStats() {
    return {
      ...this.collectionStats,
      cacheSize: this.memoryCache.size,
      dataTypes: Array.from(this.memoryCache.keys())
    }
  }

  /**
   * Schedule collection runs
   */
  scheduleCollections(tenantId) {
    // Initial full collection every 6 hours
    setInterval(() => {
      this.runFullCollection(tenantId).catch(err => {
        console.error('Scheduled collection failed:', err)
      })
    }, 6 * 60 * 60 * 1000)

    // Incremental sync every 5 minutes
    setInterval(() => {
      this.runIncrementalSync(tenantId).catch(err => {
        console.error('Scheduled incremental sync failed:', err)
      })
    }, 5 * 60 * 1000)

    console.log('📅 Collection schedule initialized')
  }

  /**
   * Shutdown
   */
  async shutdown() {
    if (this.cache && this.cacheType === 'redis') {
      await this.cache.quit()
    }
    console.log('✅ DataCollectionOrchestrator shutdown complete')
  }
}

export default DataCollectionOrchestrator
