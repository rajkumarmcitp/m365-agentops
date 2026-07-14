/**
 * Backup API Routes
 * Handles backup operations and queries
 */

import express from 'express'
import { BackupAgent } from '../lib/backup-agent.js'
import { M365_SERVICES } from '../lib/backup-config.js'

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
      const services = Object.entries(M365_SERVICES).map(([key, value]) => ({
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

      for (const service of services) {
        const history = await backupStorage.getBackupHistory(service, limit)
        allHistory.push(...history)
      }

      // Sort by date, newest first
      allHistory.sort((a, b) => new Date(b.BackupDate) - new Date(a.BackupDate))
      allHistory = allHistory.slice(0, limit)

      res.json({
        success: true,
        data: allHistory,
        total: allHistory.length
      })
    } catch (error) {
      console.error('Error getting all backup history:', error)
      res.status(500).json({
        success: false,
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
