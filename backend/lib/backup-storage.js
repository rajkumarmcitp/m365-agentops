/**
 * M365 Backup Storage Manager
 * Handles backup metadata and file storage in SharePoint
 */

import { Client } from '@microsoft/microsoft-graph-client'
import crypto from 'crypto'

export class BackupStorageManager {
  constructor(graphClient, siteId, config = {}) {
    this.graphClient = graphClient
    this.siteId = siteId

    // SharePoint configuration
    this.backupListId = config.backupListId || process.env.SHAREPOINT_BACKUP_LIST_ID
    this.backupMetadataListId = config.backupMetadataListId || process.env.SHAREPOINT_BACKUP_METADATA_LIST_ID
    this.backupResourcesListId = config.backupResourcesListId || process.env.SHAREPOINT_BACKUP_RESOURCES_LIST_ID
    this.backupChangesListId = config.backupChangesListId || process.env.SHAREPOINT_BACKUP_CHANGES_LIST_ID
    this.backupDataLibraryId = config.backupDataLibraryId || process.env.SHAREPOINT_BACKUP_DATA_LIBRARY_ID
    this.backupDSCLibraryId = config.backupDSCLibraryId || process.env.SHAREPOINT_BACKUP_DSC_LIBRARY_ID
  }

  /**
   * Create backup record in SharePoint list
   */
  async createBackupRecord(backupData) {
    try {
      if (!this.backupListId) {
        console.warn('⚠️ Backup list not configured')
        return { success: false, error: 'Backup list not configured' }
      }

      const record = {
        fields: {
          BackupID: backupData.backupId,
          BackupDate: new Date().toISOString(),
          ServiceName: backupData.serviceName,
          Status: 'InProgress',
          BackupSize: 0,
          RecordCount: backupData.resourceCount || 0,
          ConfigHash: backupData.configHash || '',
          CreatedBy: backupData.createdBy || 'System',
          Description: backupData.description || '',
          BackupType: backupData.backupType || 'Full', // Full or Differential
        }
      }

      const response = await this.graphClient
        .api(`/sites/${this.siteId}/lists/${this.backupListId}/items`)
        .post(record)

      console.log(`✅ Backup record created: ${response.id}`)

      return {
        success: true,
        itemId: response.id,
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
  async updateBackupStatus(itemId, status, details = {}) {
    try {
      if (!this.backupListId) return

      const updateData = {
        fields: {
          Status: status,
          ...details
        }
      }

      await this.graphClient
        .api(`/sites/${this.siteId}/lists/${this.backupListId}/items/${itemId}`)
        .patch(updateData)

      console.log(`✅ Backup status updated: ${status}`)

      return { success: true }
    } catch (error) {
      console.error('❌ Error updating backup status:', error.message)
      return { success: false, error: error.message }
    }
  }

  /**
   * Save backup resource configuration
   */
  async saveBackupResource(backupId, resource) {
    try {
      if (!this.backupResourcesListId) return { success: false }

      const configHash = this.generateHash(JSON.stringify(resource.configuration))

      const record = {
        fields: {
          BackupID: backupId,
          ResourceType: resource.type,
          ResourceName: resource.name,
          ResourceIdentity: resource.identity || resource.name,
          ConfigurationHash: configHash,
          Details: JSON.stringify(resource.configuration),
          CreatedDate: new Date().toISOString(),
        }
      }

      const response = await this.graphClient
        .api(`/sites/${this.siteId}/lists/${this.backupResourcesListId}/items`)
        .post(record)

      return {
        success: true,
        itemId: response.id,
        configHash
      }
    } catch (error) {
      console.error('❌ Error saving backup resource:', error.message)
      return { success: false, error: error.message }
    }
  }

  /**
   * Save backup change record
   */
  async saveBackupChange(backupId, previousBackupId, change) {
    try {
      if (!this.backupChangesListId) return { success: false }

      const record = {
        fields: {
          BackupID: backupId,
          PreviousBackupID: previousBackupId || '',
          ResourceType: change.resourceType,
          ResourceName: change.resourceName,
          ChangeType: change.changeType, // Added, Modified, Deleted
          Details: JSON.stringify(change.details || {}),
          Severity: change.severity || 'Info', // Info, Warning, Critical
          CreatedDate: new Date().toISOString(),
        }
      }

      const response = await this.graphClient
        .api(`/sites/${this.siteId}/lists/${this.backupChangesListId}/items`)
        .post(record)

      return { success: true, itemId: response.id }
    } catch (error) {
      console.error('❌ Error saving backup change:', error.message)
      return { success: false, error: error.message }
    }
  }

  /**
   * Store backup data file in document library
   */
  async saveBackupDataFile(backupId, serviceName, fileFormat, fileContent) {
    try {
      if (!this.backupDataLibraryId) return { success: false }

      const fileName = `${backupId}_${serviceName}_backup.${fileFormat}`

      // Upload file to SharePoint
      const response = await this.graphClient
        .api(`/sites/${this.siteId}/drive/items/root:/M365-Backup-Data/${fileName}:/content`)
        .put(fileContent)

      console.log(`✅ Backup data file saved: ${fileName}`)

      return {
        success: true,
        fileId: response.id,
        fileName,
        webUrl: response.webUrl
      }
    } catch (error) {
      console.error('❌ Error saving backup data file:', error.message)
      return { success: false, error: error.message }
    }
  }

  /**
   * Store DSC export file
   */
  async saveDSCExportFile(backupId, serviceName, dscContent) {
    try {
      if (!this.backupDSCLibraryId) return { success: false }

      const fileName = `${backupId}_${serviceName}_backup.ps1`

      // Upload DSC file to SharePoint
      const response = await this.graphClient
        .api(`/sites/${this.siteId}/drive/items/root:/M365-Backups-DSC/${fileName}:/content`)
        .put(dscContent)

      console.log(`✅ DSC export file saved: ${fileName}`)

      return {
        success: true,
        fileId: response.id,
        fileName,
        webUrl: response.webUrl
      }
    } catch (error) {
      console.error('❌ Error saving DSC export file:', error.message)
      return { success: false, error: error.message }
    }
  }

  /**
   * Get backup record from list
   */
  async getBackupRecord(backupId) {
    try {
      if (!this.backupListId) return null

      const response = await this.graphClient
        .api(`/sites/${this.siteId}/lists/${this.backupListId}/items`)
        .filter(`fields/BackupID eq '${backupId}'`)
        .expand('fields')
        .get()

      if (!response.value || response.value.length === 0) return null

      return response.value[0].fields
    } catch (error) {
      console.error('❌ Error fetching backup record:', error.message)
      return null
    }
  }

  /**
   * Get all backup records for a service
   */
  async getBackupHistory(serviceName, limit = 20) {
    try {
      if (!this.backupListId) return []

      const response = await this.graphClient
        .api(`/sites/${this.siteId}/lists/${this.backupListId}/items`)
        .filter(`fields/ServiceName eq '${serviceName}'`)
        .orderby('fields/BackupDate desc')
        .top(limit)
        .expand('fields')
        .get()

      return response.value?.map(item => item.fields) || []
    } catch (error) {
      console.error('❌ Error fetching backup history:', error.message)
      return []
    }
  }

  /**
   * Get backup resources for a specific backup
   */
  async getBackupResources(backupId, resourceType = null) {
    try {
      if (!this.backupResourcesListId) return []

      let query = this.graphClient
        .api(`/sites/${this.siteId}/lists/${this.backupResourcesListId}/items`)
        .filter(`fields/BackupID eq '${backupId}'`)
        .expand('fields')

      if (resourceType) {
        query = query.filter(`fields/ResourceType eq '${resourceType}'`)
      }

      const response = await query.get()

      return response.value?.map(item => ({
        itemId: item.id,
        ...item.fields
      })) || []
    } catch (error) {
      console.error('❌ Error fetching backup resources:', error.message)
      return []
    }
  }

  /**
   * Get changes between two backups
   */
  async getBackupChanges(backupId) {
    try {
      if (!this.backupChangesListId) return []

      const response = await this.graphClient
        .api(`/sites/${this.siteId}/lists/${this.backupChangesListId}/items`)
        .filter(`fields/BackupID eq '${backupId}'`)
        .expand('fields')
        .get()

      return response.value?.map(item => ({
        itemId: item.id,
        ...item.fields
      })) || []
    } catch (error) {
      console.error('❌ Error fetching backup changes:', error.message)
      return []
    }
  }

  /**
   * Delete backup record and related resources
   */
  async deleteBackup(backupId) {
    try {
      // Delete resources related to backup
      const resources = await this.getBackupResources(backupId)
      for (const resource of resources) {
        await this.graphClient
          .api(`/sites/${this.siteId}/lists/${this.backupResourcesListId}/items/${resource.itemId}`)
          .delete()
      }

      // Delete changes related to backup
      const changes = await this.getBackupChanges(backupId)
      for (const change of changes) {
        await this.graphClient
          .api(`/sites/${this.siteId}/lists/${this.backupChangesListId}/items/${change.itemId}`)
          .delete()
      }

      // Delete main backup record
      const backup = await this.getBackupRecord(backupId)
      if (backup) {
        const items = await this.graphClient
          .api(`/sites/${this.siteId}/lists/${this.backupListId}/items`)
          .filter(`fields/BackupID eq '${backupId}'`)
          .expand('fields')
          .get()

        for (const item of items.value) {
          await this.graphClient
            .api(`/sites/${this.siteId}/lists/${this.backupListId}/items/${item.id}`)
            .delete()
        }
      }

      console.log(`✅ Backup deleted: ${backupId}`)
      return { success: true }
    } catch (error) {
      console.error('❌ Error deleting backup:', error.message)
      return { success: false, error: error.message }
    }
  }

  /**
   * Generate hash of configuration for change detection
   */
  generateHash(data) {
    return crypto
      .createHash('sha256')
      .update(data)
      .digest('hex')
  }

  /**
   * Compare configurations and detect changes
   */
  compareConfigurations(previousConfig, currentConfig) {
    const changes = {
      added: [],
      modified: [],
      deleted: []
    }

    if (!previousConfig || !currentConfig) {
      return { changed: true, changes, details: 'Configuration missing' }
    }

    // Simple comparison - can be enhanced for resource-specific logic
    const prevHash = this.generateHash(JSON.stringify(previousConfig))
    const currHash = this.generateHash(JSON.stringify(currentConfig))

    return {
      changed: prevHash !== currHash,
      previousHash: prevHash,
      currentHash: currHash,
      changes
    }
  }
}

export default BackupStorageManager
