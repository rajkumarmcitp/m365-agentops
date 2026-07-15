/**
 * In-Memory Backup Store
 * Fallback storage for backups when SharePoint isn't configured
 */

export class BackupMemoryStore {
  constructor() {
    this.backups = new Map()    // backupId -> backup record
    this.resources = new Map()  // backupId -> resources array
    this.history = []           // array of backup records for quick access
  }

  /**
   * Create backup record in memory
   */
  async createBackupRecord(backupData) {
    try {
      const record = {
        id: Math.random().toString(36).substr(2, 9),
        backupId: backupData.backupId,
        serviceName: backupData.serviceName,
        timestamp: new Date().toISOString(),
        status: 'InProgress',
        resourceCount: backupData.resourceCount || 0,
        configHash: backupData.configHash || '',
        createdBy: backupData.createdBy || 'System',
        description: backupData.description || '',
        backupType: backupData.backupType || 'Full'
      }

      this.backups.set(backupData.backupId, record)
      this.history.push(record)

      console.log(`✅ Backup record stored in memory: ${backupData.backupId}`)

      return {
        success: true,
        itemId: record.id,
        backupId: backupData.backupId
      }
    } catch (error) {
      console.error('❌ Error creating backup record:', error.message)
      return { success: false, error: error.message }
    }
  }

  /**
   * Update backup record status
   */
  async updateBackupStatus(backupId, status, details = {}) {
    try {
      const record = this.backups.get(backupId)
      if (record) {
        record.status = status
        Object.assign(record, details)
        console.log(`✅ Backup status updated: ${status}`)
      }
      return { success: true }
    } catch (error) {
      console.error('❌ Error updating backup status:', error.message)
      return { success: false, error: error.message }
    }
  }

  /**
   * Save backup resources
   */
  async saveBackupResource(backupId, resource) {
    try {
      if (!this.resources.has(backupId)) {
        this.resources.set(backupId, [])
      }
      const resources = this.resources.get(backupId)
      resources.push(resource)
      return { success: true }
    } catch (error) {
      console.error('❌ Error saving resource:', error.message)
      return { success: false }
    }
  }

  /**
   * Get backup history
   */
  async getBackupHistory(service = null, limit = 50) {
    try {
      let backups = this.history
      if (service) {
        backups = backups.filter(b => b.serviceName === service)
      }
      return backups.slice(-limit).reverse()
    } catch (error) {
      console.error('❌ Error getting backup history:', error.message)
      return []
    }
  }

  /**
   * Get backup resources
   */
  async getBackupResources(backupId, resourceType = null) {
    try {
      const resources = this.resources.get(backupId) || []
      if (resourceType) {
        return resources.filter(r => r.type === resourceType)
      }
      return resources
    } catch (error) {
      console.error('❌ Error getting backup resources:', error.message)
      return []
    }
  }

  /**
   * Get backup changes
   */
  async getBackupChanges(backupId) {
    try {
      return []
    } catch (error) {
      console.error('❌ Error getting backup changes:', error.message)
      return []
    }
  }
}

export default BackupMemoryStore
