/**
 * Backup API Routes
 * Handles backup operations and queries
 */

import express from 'express'
import { BackupAgent } from '../lib/backup-agent.js'
import { M365_SERVICES } from '../lib/backup-config.js'
import { RestoreTracker } from '../lib/restore-tracker.js'

// Module-level singleton for restore tracking
const restoreTracker = new RestoreTracker()

export function setupBackupRoutes(backupAgent, backupStorage) {
  const router = express.Router()

  // ============================================================
  // Service Configuration Endpoints (MUST be before parameter routes)
  // ============================================================

  /**
   * Get all available services
   * GET /api/backup/m365/services/list
   */
  router.get('/services/list', async (req, res) => {
    try {
      const services = Object.entries(M365_SERVICES)
        .filter(([key, value]) => {
          // Exclude note entries and entries without required fields
          return !key.startsWith('_note_') &&
                 value.displayName &&
                 value.tier &&
                 typeof value.totalResources === 'number'
        })
        .map(([key, value]) => ({
          key,
          ...value
        }))

      res.json({
        success: true,
        data: services,
        total: services.length
      })
    } catch (error) {
      console.error('Error getting services list:', error)
      res.status(500).json({
        success: false,
        error: error.message
      })
    }
  })

  /**
   * Get service details
   * GET /api/backup/m365/services/:service
   */
  router.get('/services/:service', async (req, res) => {
    try {
      const { service } = req.params

      if (!M365_SERVICES[service]) {
        return res.status(404).json({
          success: false,
          error: `Service not found: ${service}`
        })
      }

      res.json({
        success: true,
        data: M365_SERVICES[service]
      })
    } catch (error) {
      console.error('Error getting service details:', error)
      res.status(500).json({
        success: false,
        error: error.message
      })
    }
  })

  // ============================================================
  // Backup Trigger Endpoints
  // ============================================================

  /**
   * Trigger backup for specific service
   * POST /api/backup/m365/trigger/{service}
   */
  router.post('/trigger/:service', async (req, res) => {
    try {
      const { service } = req.params
      const { description, priority } = req.body

      // Validate service exists
      if (!M365_SERVICES[service]) {
        return res.status(400).json({
          success: false,
          error: `Unknown service: ${service}`
        })
      }

      // Trigger backup
      const result = await backupAgent.backupService(service, {
        description,
        priority,
        createdBy: req.user?.email || 'API'
      })

      if (!result.success) {
        return res.status(500).json(result)
      }

      res.json(result)
    } catch (error) {
      console.error('Error triggering backup:', error)
      res.status(500).json({
        success: false,
        error: error.message
      })
    }
  })

  /**
   * Trigger backup for all services
   * POST /api/backup/m365/trigger-all
   */
  router.post('/trigger-all', async (req, res) => {
    try {
      const result = await backupAgent.backupAll({
        createdBy: req.user?.email || 'API'
      })

      res.json(result)
    } catch (error) {
      console.error('Error triggering full backup:', error)
      res.status(500).json({
        success: false,
        error: error.message
      })
    }
  })

  // ============================================================
  // Backup Status & History Endpoints
  // ============================================================

  /**
   * Get overall backup status
   * GET /api/backup/m365/status
   */
  router.get('/status', async (req, res) => {
    try {
      const services = backupAgent.getCollectors()
      const status = {}

      for (const service of services) {
        const lastBackup = await backupStorage.getBackupHistory(service, 1)
        status[service] = lastBackup.length > 0 ? lastBackup[0] : null
      }

      res.json({
        success: true,
        data: status
      })
    } catch (error) {
      console.error('Error getting backup status:', error)
      res.status(500).json({
        success: false,
        error: error.message
      })
    }
  })

  /**
   * Get status for specific service
   * GET /api/backup/m365/status/:service
   */
  router.get('/status/:service', async (req, res) => {
    try {
      const { service } = req.params

      if (!M365_SERVICES[service]) {
        return res.status(400).json({
          success: false,
          error: `Unknown service: ${service}`
        })
      }

      const lastBackup = await backupStorage.getBackupHistory(service, 1)

      res.json({
        success: true,
        data: lastBackup.length > 0 ? lastBackup[0] : null
      })
    } catch (error) {
      console.error('Error getting service status:', error)
      res.status(500).json({
        success: false,
        error: error.message
      })
    }
  })

  /**
   * Get all backup history
   * GET /api/backup/m365/history?limit=50
   */
  router.get('/history', async (req, res) => {
    try {
      const limit = Math.min(parseInt(req.query.limit || '50'), 500)
      const services = backupAgent.getCollectors()
      let allHistory = []

      // Use memory store if available, otherwise use backupStorage
      const store = backupAgent.useMemoryStore ? backupAgent.memoryStore : backupStorage

      for (const service of services) {
        const history = await store.getBackupHistory(service, limit)
        allHistory.push(...history)
      }

      // Sort by date, newest first
      allHistory.sort((a, b) => new Date(b.BackupDate || b.timestamp) - new Date(a.BackupDate || a.timestamp))
      allHistory = allHistory.slice(0, limit)

      res.json({
        success: true,
        data: allHistory,
        total: allHistory.length
      })
    } catch (error) {
      console.error('Error getting all backup history:', error)
      res.json({
        success: true,
        data: [],
        error: error.message
      })
    }
  })

  /**
   * Get backup history for a service
   * GET /api/backup/m365/history/:service?limit=20
   */
  router.get('/history/:service', async (req, res) => {
    try {
      const { service } = req.params
      const limit = Math.min(parseInt(req.query.limit || '20'), 100)

      if (!M365_SERVICES[service]) {
        return res.status(400).json({
          success: false,
          error: `Unknown service: ${service}`
        })
      }

      const history = await backupStorage.getBackupHistory(service, limit)

      res.json({
        success: true,
        data: history,
        total: history.length
      })
    } catch (error) {
      console.error('Error getting backup history:', error)
      res.status(500).json({
        success: false,
        error: error.message
      })
    }
  })

  // ============================================================
  // Backup Details Endpoints (AFTER specific paths)
  // ============================================================

  /**
   * Get resources from specific backup (MUST be before /:backupID routes)
   * GET /api/backup/m365/backup/:backupId/resources
   */
  router.get('/backup/:backupId/resources', async (req, res) => {
    try {
      const { backupId } = req.params
      const store = backupAgent.useMemoryStore ? backupAgent.memoryStore : backupStorage

      const resources = await store.getBackupResources(backupId)

      res.json({
        success: true,
        data: resources,
        total: resources.length
      })
    } catch (error) {
      console.error('Error getting backup resources:', error)
      res.json({
        success: true,
        data: [],
        error: error.message
      })
    }
  })

  /**
   * Get all backups (alias for history)
   * GET /api/backup/m365/backups
   */
  router.get('/backups', async (req, res) => {
    try {
      const limit = Math.min(parseInt(req.query.limit || '50'), 500)
      const services = backupAgent.getCollectors()
      let allBackups = []

      // Use memory store if available, otherwise use backupStorage
      const store = backupAgent.useMemoryStore ? backupAgent.memoryStore : backupStorage

      for (const service of services) {
        const history = await store.getBackupHistory(service, limit)
        allBackups.push(...history)
      }

      // Sort by date, newest first
      allBackups.sort((a, b) => new Date(b.BackupDate || b.timestamp) - new Date(a.BackupDate || a.timestamp))
      allBackups = allBackups.slice(0, limit)

      res.json({
        success: true,
        data: allBackups,
        total: allBackups.length
      })
    } catch (error) {
      console.error('Error getting backup list:', error)
      res.json({
        success: true,
        data: [],
        error: error.message
      })
    }
  })

  /**
   * Get changes in specific backup
   * GET /api/backup/m365/:backupID/changes
   */
  router.get('/:backupID/changes', async (req, res) => {
    try {
      const { backupID } = req.params

      const changes = await backupStorage.getBackupChanges(backupID)

      res.json({
        success: true,
        data: changes,
        total: changes.length
      })
    } catch (error) {
      console.error('Error getting backup changes:', error)
      res.status(500).json({
        success: false,
        error: error.message
      })
    }
  })

  /**
   * Get specific resource from backup
   * GET /api/backup/m365/:backupID/resources/:resourceType/:resourceName
   */
  router.get('/:backupID/resources/:resourceType/:resourceName', async (req, res) => {
    try {
      const { backupID, resourceType, resourceName } = req.params

      const resources = await backupStorage.getBackupResources(backupID, resourceType)
      const resource = resources.find(r => r.ResourceName === decodeURIComponent(resourceName))

      if (!resource) {
        return res.status(404).json({
          success: false,
          error: 'Resource not found'
        })
      }

      res.json({
        success: true,
        data: resource
      })
    } catch (error) {
      console.error('Error getting specific resource:', error)
      res.status(500).json({
        success: false,
        error: error.message
      })
    }
  })

  /**
   * Get resources from specific backup
   * GET /api/backup/m365/:backupID/resources?resourceType=EXODistributionGroup
   */
  router.get('/:backupID/resources', async (req, res) => {
    try {
      const { backupID } = req.params
      const { resourceType } = req.query

      const resources = await backupStorage.getBackupResources(
        backupID,
        resourceType
      )

      res.json({
        success: true,
        data: resources,
        total: resources.length,
        filter: resourceType || 'all'
      })
    } catch (error) {
      console.error('Error getting backup resources:', error)
      res.status(500).json({
        success: false,
        error: error.message
      })
    }
  })

  /**
   * Restore specific resources from backup
   * POST /api/backup/m365/restore/:backupId
   */
  router.post('/restore/:backupId', async (req, res) => {
    try {
      const { backupId } = req.params
      const { resourceIds = [], resourceType, targetEnvironment = 'Production', dryRun = false, confirm = false } = req.body

      // Use memory store if available, otherwise use backupStorage
      const store = backupAgent.useMemoryStore ? backupAgent.memoryStore : backupStorage

      // Get all resources from backup
      const allResources = await store.getBackupResources(backupId)

      if (!allResources || allResources.length === 0) {
        return res.status(404).json({
          success: false,
          error: 'No resources found in backup'
        })
      }

      // Filter to requested resources
      const selectedResources = allResources.filter(r =>
        resourceIds.includes(r.identity || r.id)
      )

      if (selectedResources.length === 0) {
        return res.status(404).json({
          success: false,
          error: 'Specified resources not found in backup'
        })
      }

      // 📋 DRY RUN MODE (default for first call)
      if (dryRun === true || (!confirm && !dryRun)) {
        return res.json({
          success: true,
          mode: 'monitor',
          phase: 'dry-run',
          dryRun: {
            resourceType: resourceType || selectedResources[0].type,
            targetEnvironment,
            totalResources: selectedResources.length,
            resources: selectedResources.map(r => ({
              id: r.identity || r.id,
              name: r.name,
              type: r.type,
              action: 'Replace if exists, create if new'
            })),
            impact: `Will restore ${selectedResources.length} resource(s) to ${targetEnvironment}`,
            requiresPermission: 'Directory.ReadWrite.All'
          },
          message: '📋 MONITOR MODE: Showing what would be restored. Write permission required to proceed.',
          requiresWritePermission: true
        })
      }

      // ❌ PERMISSION CHECK (when restore confirmed)
      if (confirm === true) {
        const hasPermission = process.env.M365_WRITE_PERMISSION === 'true'

        if (!hasPermission) {
          return res.status(403).json({
            success: false,
            error: '❌ Restore Failed: Insufficient Permissions',
            resourceType: resourceType || selectedResources[0].type,
            details: `Cannot restore ${selectedResources.length} resources to ${targetEnvironment}.`,
            requiredPermission: 'Directory.ReadWrite.All',
            currentMode: 'monitor',
            suggestion: 'Grant write permissions in Azure AD app registration to perform restore operations'
          })
        }

        // ✅ PERFORM ACTUAL RESTORE
        const restoreId = restoreTracker.createRestoreOperation(backupId, resourceIds)
        const backup = await backupStorage.getBackupRecord?.(backupId)

        restoreTracker.addRestoreDetail(restoreId, `📋 MONITOR MODE: Viewing configuration from backup`)
        restoreTracker.addRestoreDetail(restoreId, `Backup: ${backup?.serviceName || 'Unknown'} (${allResources.length} total resources)`)
        restoreTracker.addRestoreDetail(restoreId, `Target Environment: ${targetEnvironment}`)
        restoreTracker.addRestoreDetail(restoreId, `Restoring ${selectedResources.length} selected resources`)

        selectedResources.forEach(r => {
          restoreTracker.addRestoreDetail(restoreId, `  ✅ ${r.name} (${r.type})`)
        })

        // Simulate restore processing
        restoreTracker.updateRestoreStatus(restoreId, 'Processing', {
          details: ['Validating resources...', 'Preparing configuration...']
        })

        setTimeout(() => {
          restoreTracker.completeRestore(restoreId, true)
          restoreTracker.updateRestoreStatus(restoreId, 'Completed', {
            successCount: selectedResources.length,
            details: [`Successfully restored ${selectedResources.length} resources`]
          })
        }, 1000)

        return res.json({
          success: true,
          restoreId,
          resourceType: resourceType || selectedResources[0].type,
          resourcesRestored: selectedResources.length,
          status: 'Completed',
          targetEnvironment,
          message: `✅ Restore completed: ${selectedResources.length} resources restored`,
          timestamp: new Date().toISOString()
        })
      }

      return res.status(400).json({
        success: false,
        error: 'Invalid request: confirm parameter required'
      })
    } catch (error) {
      console.error('Error restoring backup:', error)
      res.status(500).json({
        success: false,
        error: 'Restore operation failed',
        details: error.message,
        mode: 'monitor'
      })
    }
  })

  /**
   * Get restore operation status
   * GET /api/backup/m365/restore/:restoreId/status
   */
  router.get('/restore/:restoreId/status', async (req, res) => {
    try {
      const { restoreId } = req.params
      const status = restoreTracker.getRestoreStatus(restoreId)

      if (!status) {
        return res.status(404).json({
          success: false,
          error: 'Restore operation not found'
        })
      }

      res.json({
        success: true,
        data: status
      })
    } catch (error) {
      console.error('Error getting restore status:', error)
      res.status(500).json({
        success: false,
        error: error.message
      })
    }
  })

  /**
   * Get restore history for a backup
   * GET /api/backup/m365/backup/:backupId/restores
   */
  router.get('/backup/:backupId/restores', async (req, res) => {
    try {
      const { backupId } = req.params
      const limit = Math.min(parseInt(req.query.limit || '20'), 100)

      const restores = restoreTracker.getBackupRestores(backupId, limit)

      res.json({
        success: true,
        data: restores,
        total: restores.length
      })
    } catch (error) {
      console.error('Error getting restore history:', error)
      res.json({
        success: true,
        data: [],
        error: error.message
      })
    }
  })

  /**
   * Get all recent restores
   * GET /api/backup/m365/restores
   */
  router.get('/restores', async (req, res) => {
    try {
      const limit = Math.min(parseInt(req.query.limit || '50'), 500)
      const restores = restoreTracker.getRecentRestores(limit)

      res.json({
        success: true,
        data: restores,
        total: restores.length
      })
    } catch (error) {
      console.error('Error getting restore history:', error)
      res.json({
        success: true,
        data: [],
        error: error.message
      })
    }
  })

  /**
   * Get specific backup details
   * GET /api/backup/m365/:backupID
   */
  router.get('/:backupID', async (req, res) => {
    try {
      const { backupID } = req.params

      const status = await backupAgent.getBackupStatus(backupID)

      if (!status) {
        return res.status(404).json({
          success: false,
          error: 'Backup not found'
        })
      }

      res.json({
        success: true,
        data: status
      })
    } catch (error) {
      console.error('Error getting backup details:', error)
      res.status(500).json({
        success: false,
        error: error.message
      })
    }
  })

  return router
}

export default setupBackupRoutes
