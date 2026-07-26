/**
 * Agent Context Store
 * Shared key-value store for inter-agent context sharing
 * Supports TTL, locks, and conflict detection
 */

export class AgentContextStore {
  constructor() {
    this.store = new Map()  // Map<key, { value, agentId, timestamp, ttlMs, lockHolderId }>
    this.locks = new Map()  // Map<key, { agentId, timestamp }>
    this.cleanupInterval = setInterval(() => this.cleanup(), 60 * 1000)  // cleanup every minute
  }

  /**
   * Set a value in the store with optional TTL
   * @param {string} key - context key (e.g. 'threat:alert123')
   * @param {any} value - data to store (will be JSON stringified)
   * @param {string} agentId - agent writing this context
   * @param {number} ttlMinutes - time-to-live in minutes (default 60)
   */
  set(key, value, agentId, ttlMinutes = 60) {
    const ttlMs = ttlMinutes * 60 * 1000
    this.store.set(key, {
      value,
      agentId,
      timestamp: Date.now(),
      ttlMs,
      expiresAt: Date.now() + ttlMs
    })
    console.log(`📝 Context set: ${key} by ${agentId} (TTL: ${ttlMinutes}min)`)
  }

  /**
   * Get a value from the store
   * Returns null if expired or not found
   */
  get(key) {
    const entry = this.store.get(key)
    if (!entry) return null

    // Check if expired
    if (Date.now() > entry.expiresAt) {
      this.store.delete(key)
      return null
    }

    return entry.value
  }

  /**
   * Get all context entries for a specific agent
   */
  getByAgent(agentId) {
    const result = {}
    for (const [key, entry] of this.store) {
      if (Date.now() <= entry.expiresAt && entry.agentId === agentId) {
        result[key] = entry.value
      }
    }
    return result
  }

  /**
   * Acquire an exclusive lock on a key
   * Prevents other agents from modifying this resource
   * @returns {boolean} true if lock acquired, false if held by another agent
   */
  lock(key, agentId) {
    const existingLock = this.locks.get(key)
    if (existingLock && existingLock.agentId !== agentId) {
      console.log(`⚠️ Lock conflict on ${key}: held by ${existingLock.agentId}, requested by ${agentId}`)
      return false
    }

    this.locks.set(key, {
      agentId,
      timestamp: Date.now(),
      acquiredAt: new Date().toISOString()
    })
    console.log(`🔒 Lock acquired: ${key} by ${agentId}`)
    return true
  }

  /**
   * Release a lock on a key
   */
  unlock(key, agentId) {
    const lock = this.locks.get(key)
    if (lock && lock.agentId === agentId) {
      this.locks.delete(key)
      console.log(`🔓 Lock released: ${key} by ${agentId}`)
      return true
    }
    return false
  }

  /**
   * Detect if a key has a lock held by another agent
   * @returns {string|null} agentId of lock holder, or null if no conflict
   */
  detectConflict(key, newAgentId) {
    const lock = this.locks.get(key)
    if (lock && lock.agentId !== newAgentId) {
      return lock.agentId
    }
    return null
  }

  /**
   * Check if a key is locked
   */
  isLocked(key) {
    return this.locks.has(key)
  }

  /**
   * Get all active locks
   */
  getActiveLocks() {
    const result = {}
    for (const [key, lock] of this.locks) {
      result[key] = lock
    }
    return result
  }

  /**
   * Remove expired entries from the store
   * Called periodically
   */
  cleanup() {
    let removed = 0
    const now = Date.now()

    for (const [key, entry] of this.store) {
      if (now > entry.expiresAt) {
        this.store.delete(key)
        removed++
      }
    }

    if (removed > 0) {
      console.log(`🧹 Context cleanup: removed ${removed} expired entries`)
    }
  }

  /**
   * Get store size and stats
   */
  getStats() {
    let totalByAgent = {}
    for (const entry of this.store.values()) {
      totalByAgent[entry.agentId] = (totalByAgent[entry.agentId] || 0) + 1
    }

    return {
      totalEntries: this.store.size,
      activeLocks: this.locks.size,
      entriesByAgent: totalByAgent,
      lockHolders: Array.from(this.locks.values()).map(l => ({ key: l.agentId, holder: l.agentId }))
    }
  }

  /**
   * Clear the store (for testing/reset)
   */
  clear() {
    this.store.clear()
    this.locks.clear()
  }

  /**
   * Shutdown: stop cleanup interval
   */
  shutdown() {
    if (this.cleanupInterval) {
      clearInterval(this.cleanupInterval)
    }
  }
}

// Global singleton instance
let contextStoreInstance = null

export function getContextStore() {
  if (!contextStoreInstance) {
    contextStoreInstance = new AgentContextStore()
  }
  return contextStoreInstance
}

export function initializeContextStore() {
  contextStoreInstance = new AgentContextStore()
  console.log('✅ Context store initialized')
  return contextStoreInstance
}
