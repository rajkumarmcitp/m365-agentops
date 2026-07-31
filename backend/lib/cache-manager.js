/**
 * Cache Manager
 * Unified interface for memory and Redis caching
 * Supports TTL, serialization, and cache invalidation
 */

export class CacheManager {
  constructor(options = {}) {
    this.type = options.type || 'memory' // 'memory' or 'redis'
    this.prefix = options.prefix || 'tg'
    this.defaultTTL = options.defaultTTL || 3600 // 1 hour
    this.memoryStore = new Map()
    this.redisClient = null

    // Stats
    this.stats = {
      hits: 0,
      misses: 0,
      sets: 0,
      deletes: 0
    }
  }

  /**
   * Initialize Redis client
   */
  async initRedis(config = {}) {
    if (this.type !== 'redis') return

    try {
      const Redis = (await import('redis')).default
      this.redisClient = Redis.createClient({
        host: config.host || process.env.REDIS_HOST || 'localhost',
        port: config.port || process.env.REDIS_PORT || 6379,
        password: config.password || process.env.REDIS_PASSWORD,
        db: config.db || 0,
        ...config
      })

      await this.redisClient.connect()
      console.log('✅ Redis cache connected')
      return true
    } catch (err) {
      console.warn('⚠️ Redis init failed:', err.message)
      this.type = 'memory'
      return false
    }
  }

  /**
   * Get value from cache
   */
  async get(key) {
    const fullKey = `${this.prefix}:${key}`

    try {
      if (this.type === 'redis' && this.redisClient) {
        const value = await this.redisClient.get(fullKey)
        if (value) {
          this.stats.hits++
          return JSON.parse(value)
        }
      } else {
        const entry = this.memoryStore.get(fullKey)
        if (entry && this.isValid(entry)) {
          this.stats.hits++
          return entry.value
        }
      }

      this.stats.misses++
      return null
    } catch (err) {
      console.error(`Cache get error for ${key}:`, err)
      this.stats.misses++
      return null
    }
  }

  /**
   * Set value in cache
   */
  async set(key, value, ttlMs = null) {
    const fullKey = `${this.prefix}:${key}`
    const ttl = ttlMs || this.defaultTTL

    try {
      if (this.type === 'redis' && this.redisClient) {
        await this.redisClient.setEx(
          fullKey,
          Math.floor(ttl / 1000),
          JSON.stringify(value)
        )
      } else {
        this.memoryStore.set(fullKey, {
          value,
          expiresAt: Date.now() + ttl
        })
      }

      this.stats.sets++
      return true
    } catch (err) {
      console.error(`Cache set error for ${key}:`, err)
      return false
    }
  }

  /**
   * Delete from cache
   */
  async delete(key) {
    const fullKey = `${this.prefix}:${key}`

    try {
      if (this.type === 'redis' && this.redisClient) {
        await this.redisClient.del(fullKey)
      } else {
        this.memoryStore.delete(fullKey)
      }

      this.stats.deletes++
      return true
    } catch (err) {
      console.error(`Cache delete error for ${key}:`, err)
      return false
    }
  }

  /**
   * Check if entry is valid
   */
  isValid(entry) {
    return entry.expiresAt > Date.now()
  }

  /**
   * Bulk set multiple keys
   */
  async mset(items, ttlMs = null) {
    const results = await Promise.all(
      items.map(([key, value]) => this.set(key, value, ttlMs))
    )
    return results.every(r => r)
  }

  /**
   * Bulk get multiple keys
   */
  async mget(keys) {
    const values = await Promise.all(keys.map(key => this.get(key)))
    return Object.fromEntries(keys.map((key, idx) => [key, values[idx]]))
  }

  /**
   * Clear cache
   */
  async clear() {
    try {
      if (this.type === 'redis' && this.redisClient) {
        await this.redisClient.flushDb()
      } else {
        this.memoryStore.clear()
      }
      console.log('✅ Cache cleared')
      return true
    } catch (err) {
      console.error('Cache clear error:', err)
      return false
    }
  }

  /**
   * Get cache size
   */
  getSize() {
    if (this.type === 'redis' && this.redisClient) {
      return 'unknown (Redis)'
    }
    return this.memoryStore.size
  }

  /**
   * Get cache stats
   */
  getStats() {
    return {
      type: this.type,
      size: this.getSize(),
      hits: this.stats.hits,
      misses: this.stats.misses,
      sets: this.stats.sets,
      deletes: this.stats.deletes,
      hitRate: this.stats.hits / (this.stats.hits + this.stats.misses) || 0
    }
  }

  /**
   * Cleanup expired entries (memory cache only)
   */
  cleanup() {
    if (this.type !== 'memory') return

    let removed = 0
    for (const [key, entry] of this.memoryStore.entries()) {
      if (!this.isValid(entry)) {
        this.memoryStore.delete(key)
        removed++
      }
    }

    if (removed > 0) {
      console.log(`🧹 Cache cleanup: removed ${removed} expired entries`)
    }
    return removed
  }

  /**
   * Shutdown
   */
  async shutdown() {
    if (this.type === 'redis' && this.redisClient) {
      await this.redisClient.quit()
    }
    this.memoryStore.clear()
    console.log('✅ Cache manager shutdown')
  }
}

export default CacheManager
