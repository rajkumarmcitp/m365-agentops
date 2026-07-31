/**
 * Collection Initialization
 * Sets up DataCollectionOrchestrator on server startup
 * Registers all collectors and starts schedules
 */

import { DataCollectionOrchestrator } from './data-collection-orchestrator.js'
import { CacheManager } from './cache-manager.js'
import { DeltaQueryHelper } from './delta-query-helper.js'
import { EntraCollector } from '../collectors/entra-collector.js'
import { ApplicationCollector } from '../collectors/application-collector.js'
import { ConditionalAccessCollector } from '../collectors/conditional-access-collector.js'
import { DefenderCollector } from '../collectors/defender-collector.js'
import { IntuneCollector } from '../collectors/intune-collector.js'
import { SharePointCollector } from '../collectors/sharepoint-collector.js'
import { TeamsCollector } from '../collectors/teams-collector.js'
import { ExchangeCollector } from '../collectors/exchange-collector.js'
import { DynamicsCollector } from '../collectors/dynamics-collector.js'
import { VivaCollector } from '../collectors/viva-collector.js'
import { FabricCollector } from '../collectors/fabric-collector.js'
import { PowerPlatformCollector } from '../collectors/powerplatform-collector.js'

let orchestrator = null
let cacheManager = null

/**
 * Initialize collection system
 */
export async function initializeCollectionSystem(graphClient) {
  console.log('🔄 Initializing data collection system...')

  try {
    // Initialize cache manager
    const cacheType = process.env.CACHE_TYPE || 'memory'
    cacheManager = new CacheManager({
      type: cacheType,
      prefix: 'tg',
      defaultTTL: parseInt(process.env.CACHE_TTL || '3600000') // 1 hour
    })

    if (cacheType === 'redis') {
      await cacheManager.initRedis({
        host: process.env.REDIS_HOST || 'localhost',
        port: parseInt(process.env.REDIS_PORT || '6379'),
        password: process.env.REDIS_PASSWORD,
        db: parseInt(process.env.REDIS_DB || '0')
      })
    }

    // Initialize orchestrator
    orchestrator = new DataCollectionOrchestrator(graphClient, {
      cacheEnabled: true,
      cacheType: cacheType,
      cacheTTL: {
        'entra.json': 6 * 60 * 60 * 1000, // 6 hours
        'applications.json': 1 * 60 * 60 * 1000, // 1 hour
        'conditionalaccess.json': 30 * 60 * 1000, // 30 minutes
        'auditlogs.json': 5 * 60 * 1000, // 5 minutes
        'defender.json': 2 * 60 * 1000, // 2 minutes
        'intune.json': 30 * 60 * 1000, // 30 minutes
        'exchange.json': 1 * 60 * 60 * 1000, // 1 hour
        'sharepoint.json': 1 * 60 * 60 * 1000, // 1 hour
        'teams.json': 1 * 60 * 60 * 1000, // 1 hour
        'dynamics.json': 2 * 60 * 60 * 1000, // 2 hours
        'viva.json': 2 * 60 * 60 * 1000, // 2 hours
        'fabric.json': 2 * 60 * 60 * 1000, // 2 hours
        'powerplatform.json': 2 * 60 * 60 * 1000 // 2 hours
      }
    })

    await orchestrator.initCache()

    // Register all collectors with delta query support
    console.log('📋 Registering collectors...')
    const deltaHelper = new DeltaQueryHelper(graphClient)

    orchestrator.registerCollector('entra', new EntraCollector(deltaHelper))
    orchestrator.registerCollector('applications', new ApplicationCollector(deltaHelper))
    orchestrator.registerCollector('conditionalaccess', new ConditionalAccessCollector(deltaHelper))
    orchestrator.registerCollector('defender', new DefenderCollector(deltaHelper))
    orchestrator.registerCollector('intune', new IntuneCollector(deltaHelper))
    orchestrator.registerCollector('sharepoint', new SharePointCollector(deltaHelper))
    orchestrator.registerCollector('teams', new TeamsCollector(deltaHelper))
    orchestrator.registerCollector('exchange', new ExchangeCollector(deltaHelper))
    orchestrator.registerCollector('dynamics', new DynamicsCollector(deltaHelper))
    orchestrator.registerCollector('viva', new VivaCollector(deltaHelper))
    orchestrator.registerCollector('fabric', new FabricCollector(deltaHelper))
    orchestrator.registerCollector('powerplatform', new PowerPlatformCollector(deltaHelper))

    // Make orchestrator globally available for validators to access cached data
    globalThis.orchestrator = orchestrator
    globalThis.cacheManager = cacheManager

    console.log('✅ Collection system initialized with 8 collectors')
    return { orchestrator, cacheManager }
  } catch (err) {
    console.error('❌ Collection initialization failed:', err)
    throw err
  }
}

/**
 * Get orchestrator instance
 */
export function getOrchestrator() {
  if (!orchestrator) {
    throw new Error('Collection system not initialized')
  }
  return orchestrator
}

/**
 * Get cache manager instance
 */
export function getCacheManager() {
  if (!cacheManager) {
    throw new Error('Cache manager not initialized')
  }
  return cacheManager
}

/**
 * Start initial collection
 */
export async function startInitialCollection(tenantId) {
  if (!orchestrator) {
    throw new Error('Collection system not initialized')
  }

  console.log('🚀 Starting initial collection...')
  const result = await orchestrator.runFullCollection(tenantId)

  if (result.success) {
    console.log('✅ Initial collection complete')
    // Start scheduled collections
    orchestrator.scheduleCollections(tenantId)
  } else {
    console.error('❌ Initial collection failed')
  }

  return result
}

/**
 * Shutdown collection system
 */
export async function shutdownCollectionSystem() {
  if (orchestrator) {
    await orchestrator.shutdown()
  }
  if (cacheManager) {
    await cacheManager.shutdown()
  }
  console.log('✅ Collection system shutdown complete')
}

/**
 * Get collection status
 */
export function getCollectionStatus() {
  if (!orchestrator) {
    return { status: 'not_initialized' }
  }

  return {
    status: 'running',
    orchestrator: orchestrator.getStats(),
    cache: cacheManager ? cacheManager.getStats() : null
  }
}

/**
 * Get cached data (for use by validators)
 */
export async function getCachedData(dataType) {
  if (!orchestrator) {
    throw new Error('Collection system not initialized')
  }
  return orchestrator.getCachedData(dataType)
}

export default {
  initializeCollectionSystem,
  getOrchestrator,
  getCacheManager,
  startInitialCollection,
  shutdownCollectionSystem,
  getCollectionStatus,
  getCachedData
}
