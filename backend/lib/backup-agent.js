/**
 * M365 Backup Agent
 * Coordinates backup operations across all M365 services
 */

import { BackupStorageManager } from './backup-storage.js'
import { BackupMemoryStore } from './backup-memory-store.js'
import { M365_SERVICES } from './backup-config.js'
import crypto from 'crypto'

export class BackupAgent {
  constructor(graphClient, config = {}) {
    this.graphClient = graphClient
    this.siteId = config.siteId || process.env.SHAREPOINT_SITE_ID
    this.config = config

    // Initialize storage manager with fallback to memory store
    this.storage = new BackupStorageManager(graphClient, this.siteId, config.storage || {})
    this.memoryStore = new BackupMemoryStore()
    this.useMemoryStore = !process.env.SHAREPOINT_BACKUP_LIST_ID

    if (this.useMemoryStore) {
      console.log('ℹ️ SharePoint backup list not configured - using in-memory storage')
    }

    // Collectors registry
    this.collectors = new Map()

    console.log('✅ Backup Agent initialized')
  }

  /**
   * Register a backup collector for a service
   */
  registerCollector(serviceName, collector) {
    this.collectors.set(serviceName, collector)
    console.log(`✅ Collector registered: ${serviceName}`)
  }

  /**
   * Get all registered collectors
   */
  getCollectors() {
    return Array.from(this.collectors.keys())
  }

  /**
   * Trigger backup for specific service
   */
  async backupService(serviceName, options = {}) {
    const startTime = Date.now()

    console.log(`🔄 Starting backup: ${serviceName}`)

    const backupId = this.generateBackupId(serviceName)
    const collector = this.collectors.get(serviceName)

    if (!collector) {
      console.error(`❌ No collector found for ${serviceName}`)
      return {
        success: false,
        error: `No collector registered for ${serviceName}`,
        backupId
      }
    }

    try {
      // Create backup record (use memory store if SharePoint not configured)
      const store = this.useMemoryStore ? this.memoryStore : this.storage
      const recordResult = await store.createBackupRecord({
        backupId,
        serviceName,
        resourceCount: 0,
        createdBy: options.createdBy || 'System',
        description: options.description || `Backup of ${serviceName}`
      })

      if (!recordResult.success) {
        return {
          success: false,
          error: recordResult.error,
          backupId
        }
      }

      const itemId = recordResult.itemId

      // Run collector to get configurations
      console.log(`📦 Collecting ${serviceName} configurations...`)
      const collectorResult = await collector.collect()

      // Save resources and detect changes
      const resources = collectorResult.resources || []

      // Partial or empty collection is still considered success
      // (Zero resources might mean: no configs exist, or admin access not available, or service not licensed)
      if (!collectorResult.success && collectorResult.errors && collectorResult.errors.length > 0) {
        console.warn(`⚠️ Collection had ${collectorResult.errors.length} errors${resources.length > 0 ? `, but ${resources.length} resources collected` : ', 0 resources collected'}`)
      }

      if (resources.length === 0) {
        console.log(`ℹ️ No resources collected for ${serviceName} (may require admin access or service not licensed)`)
      }

      const configHash = this.generateHash(JSON.stringify(resources))
      let changesSummary = 'Initial backup'

      console.log(`💾 Saving ${resources.length} resources...`)

      // Save each resource
      for (const resource of resources) {
        await store.saveBackupResource(backupId, {
          type: resource.type || 'Unknown',
          name: resource.name || resource.id,
          identity: resource.id,
          configuration: resource
        })
      }

      // Update backup record with completion status
      const executionTime = Math.round((Date.now() - startTime) / 1000)
      await store.updateBackupStatus(backupId, 'Completed', {
        backupSize: JSON.stringify(resources).length,
        resourceCount: resources.length,
        configHash: configHash,
        duration: executionTime
      })

      console.log(`✅ Backup completed: ${serviceName} (${executionTime}s)`)

      return {
        success: true,
        backupId,
        serviceName,
        resourceCount: resources.length,
        configHash,
        changes: changesSummary,
        executionTime,
        itemId
      }
    } catch (error) {
      console.error(`❌ Backup failed for ${serviceName}:`, error.message)

      return {
        success: false,
        error: error.message,
        backupId,
        serviceName
      }
    }
  }

  /**
   * Backup all services
   */
  async backupAll(options = {}) {
    const startTime = Date.now()
    const services = Array.from(this.collectors.keys())
    const results = []

    console.log(`🔄 Starting full backup (${services.length} services)`)

    for (const serviceName of services) {
      const result = await this.backupService(serviceName, options)
      results.push(result)

      // Add delay between services to avoid rate limiting
      await this.delay(1000)
    }

    const executionTime = Math.round((Date.now() - startTime) / 1000)
    const successCount = results.filter(r => r.success).length
    const failureCount = results.filter(r => !r.success).length

    console.log(`✅ Full backup completed in ${executionTime}s (${successCount} success, ${failureCount} failed)`)

    return {
      success: failureCount === 0,
      executionTime,
      results,
      summary: {
        total: services.length,
        successful: successCount,
        failed: failureCount
      }
    }
  }

  /**
   * Get previous backup for a service
   */
  async getPreviousBackup(serviceName) {
    try {
      const history = await this.storage.getBackupHistory(serviceName, 1)
      return history.length > 0 ? history[0] : null
    } catch (error) {
      console.error('Error getting previous backup:', error.message)
      return null
    }
  }

  /**
   * Detect changes between two backups
   */
  async detectChanges(serviceName, previousBackupId, previousResources, currentResources) {
    const changes = {
      added: [],
      modified: [],
      deleted: []
    }

    // Create maps for comparison
    const prevMap = new Map(previousResources.map(r => [r.ResourceIdentity || r.ResourceName, r]))
    const currMap = new Map(currentResources.map(r => [r.id, r]))

    // Detect added and modified
    for (const [id, current] of currMap) {
      const previous = prevMap.get(id)
      if (!previous) {
        changes.added.push({
          id,
          name: current.name || current.displayName || id,
          type: current.type
        })
      } else {
        // Check if modified
        const prevHash = this.generateHash(JSON.stringify(previous))
        const currHash = this.generateHash(JSON.stringify(current))
        if (prevHash !== currHash) {
          changes.modified.push({
            id,
            name: current.name || current.displayName || id,
            type: current.type
          })
        }
      }
    }

    // Detect deleted
    for (const [id, previous] of prevMap) {
      if (!currMap.has(id)) {
        changes.deleted.push({
          id,
          name: previous.ResourceName || id,
          type: previous.ResourceType
        })
      }
    }

    // Generate summary
    const summary = this.generateChangeSummary(changes)

    // Save change records
    for (const added of changes.added) {
      await this.storage.saveBackupChange(null, previousBackupId, {
        resourceType: added.type,
        resourceName: added.name,
        changeType: 'Added',
        details: { id: added.id }
      })
    }

    for (const modified of changes.modified) {
      await this.storage.saveBackupChange(null, previousBackupId, {
        resourceType: modified.type,
        resourceName: modified.name,
        changeType: 'Modified',
        details: { id: modified.id }
      })
    }

    for (const deleted of changes.deleted) {
      await this.storage.saveBackupChange(null, previousBackupId, {
        resourceType: deleted.type,
        resourceName: deleted.name,
        changeType: 'Deleted',
        details: { id: deleted.id }
      })
    }

    return {
      changes,
      summary,
      hasChanges: changes.added.length > 0 || changes.modified.length > 0 || changes.deleted.length > 0
    }
  }

  /**
   * Generate change summary text
   */
  generateChangeSummary(changes) {
    const parts = []
    if (changes.added.length > 0) parts.push(`${changes.added.length} added`)
    if (changes.modified.length > 0) parts.push(`${changes.modified.length} modified`)
    if (changes.deleted.length > 0) parts.push(`${changes.deleted.length} deleted`)

    return parts.length > 0 ? parts.join(', ') : 'No changes'
  }

  /**
   * Get backup status
   */
  async getBackupStatus(backupId) {
    try {
      const backup = await this.storage.getBackupRecord(backupId)
      if (!backup) return null

      const resources = await this.storage.getBackupResources(backupId)
      const changes = await this.storage.getBackupChanges(backupId)

      return {
        ...backup,
        resourceCount: resources.length,
        changeCount: changes.length,
        resources,
        changes
      }
    } catch (error) {
      console.error('Error getting backup status:', error.message)
      return null
    }
  }

  /**
   * Generate unique backup ID
   */
  generateBackupId(serviceName) {
    const date = new Date().toISOString().split('T')[0]
    const time = Date.now().toString().slice(-6)
    return `${date}-${serviceName}-${time}`
  }

  /**
   * Generate hash of data
   */
  generateHash(data) {
    return crypto
      .createHash('sha256')
      .update(data)
      .digest('hex')
  }

  /**
   * Delay execution
   */
  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms))
  }
}

export default BackupAgent
