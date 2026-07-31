/**
 * Base Collector
 * Template for all data collectors
 * Standardizes collection, normalization, and caching pattern
 */

import { DeltaQueryHelper } from './delta-query-helper.js'

export class BaseCollector {
  constructor(name, options = {}) {
    this.name = name
    this.supportsDelta = options.supportsDelta !== false
    this.apiCallCount = 0
    this.dataSize = 0
    this.startTime = null

    this.deltaHelper = options.deltaHelper || new DeltaQueryHelper(null)
  }

  /**
   * Main collection method
   * Subclasses should override this
   */
  async collect(graphClient, tenantId) {
    throw new Error(`${this.name}: collect() not implemented`)
  }

  /**
   * Delta/incremental collection
   * Subclasses can override for delta support
   */
  async delta(graphClient, tenantId, deltaToken) {
    throw new Error(`${this.name}: delta() not implemented`)
  }

  /**
   * Execute a single Graph API call with tracking
   */
  async queryGraph(graphClient, endpoint, options = {}) {
    try {
      const startTime = Date.now()

      let query = graphClient.api(endpoint)

      // Apply filter if provided
      if (options.filter) {
        query = query.query({ $filter: options.filter })
      }

      // Apply select if provided
      if (options.select) {
        query = query.select(options.select)
      }

      // Apply top/skip for pagination
      if (options.top) {
        query = query.top(options.top)
      }
      if (options.skip) {
        query = query.skip(options.skip)
      }

      const response = await query.get()

      this.apiCallCount++

      return {
        data: response.value || response,
        nextLink: response['@odata.nextLink'],
        duration: Date.now() - startTime
      }
    } catch (err) {
      console.error(`Graph API error on ${endpoint}:`, err.message)
      this.apiCallCount++
      throw err
    }
  }

  /**
   * Get paginated data (follow nextLink)
   */
  async getPaginatedData(graphClient, endpoint, options = {}) {
    const allData = []
    let nextLink = endpoint
    let pageCount = 0

    try {
      while (nextLink) {
        pageCount++
        console.log(`  📄 ${this.name} page ${pageCount}...`)

        const response = await this.queryGraph(graphClient, nextLink, options)
        allData.push(...response.data)
        nextLink = response.nextLink

        // Respect rate limiting
        if (options.delayMs) {
          await this.delay(options.delayMs)
        }
      }

      return allData
    } catch (err) {
      console.error(`Pagination error in ${this.name}:`, err.message)
      return allData
    }
  }

  /**
   * Normalize collected data
   * Subclasses should override for their data structure
   */
  normalize(rawData) {
    // Default: return as-is
    return rawData
  }

  /**
   * Filter by properties
   */
  filterByProperties(items, properties) {
    return items.filter(item => {
      return properties.every(prop => item.hasOwnProperty(prop))
    })
  }

  /**
   * Map items to standard format
   */
  mapItems(items, mapping) {
    return items.map(item => {
      const mapped = {}
      for (const [key, sourceProp] of Object.entries(mapping)) {
        mapped[key] = this.getNestedProperty(item, sourceProp)
      }
      return mapped
    })
  }

  /**
   * Get nested property by path (e.g., "user.department.name")
   */
  getNestedProperty(obj, path) {
    return path.split('.').reduce((current, prop) => current?.[prop], obj)
  }

  /**
   * Delay execution (for rate limiting)
   */
  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms))
  }

  /**
   * Validate required fields
   */
  validateRequired(item, fields) {
    for (const field of fields) {
      if (!item[field]) {
        return false
      }
    }
    return true
  }

  /**
   * Get collection statistics
   */
  getStats() {
    return {
      name: this.name,
      apiCalls: this.apiCallCount,
      dataSize: this.dataSize,
      duration: this.startTime ? Date.now() - this.startTime : 0,
      apiCallsPerSecond: this.startTime
        ? (this.apiCallCount / ((Date.now() - this.startTime) / 1000)).toFixed(2)
        : 0
    }
  }

  /**
   * Start collection timer
   */
  startTimer() {
    this.startTime = Date.now()
    this.apiCallCount = 0
  }

  /**
   * Record data size
   */
  recordDataSize(data) {
    this.dataSize = JSON.stringify(data).length
  }

  /**
   * Log collection summary
   */
  logSummary() {
    const stats = this.getStats()
    console.log(`
✅ ${stats.name}:
   API Calls: ${stats.apiCalls}
   Data Size: ${(stats.dataSize / 1024).toFixed(2)}KB
   Duration: ${stats.duration}ms
   API Calls/sec: ${stats.apiCallsPerSecond}
    `)
  }
}

export default BaseCollector
