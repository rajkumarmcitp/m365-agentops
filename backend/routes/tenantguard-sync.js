/**
 * TenantGuard Sync Routes
 * Endpoints for managing Graph API syncs and alert storage
 */

import express from 'express'
import { fullSync, incrementalSync, scheduleAutoSync } from '../tenantguard/sync-engine.js'
import { initGraphClient } from '../tenantguard/graph-api-client.js'
import { initSharePointWriter, getAllAlerts } from '../tenantguard/sharepoint-writer.js'

const router = express.Router()

let isSyncing = false

/**
 * POST /api/tenantguard/sync
 * Trigger a full sync from Graph API
 */
router.post('/sync', async (req, res) => {
  try {
    if (isSyncing) {
      return res.status(409).json({
        success: false,
        error: 'Sync already in progress'
      })
    }

    isSyncing = true
    const result = await fullSync()
    isSyncing = false

    res.json(result)
  } catch (error) {
    isSyncing = false
    res.status(500).json({
      success: false,
      error: error.message
    })
  }
})

/**
 * POST /api/tenantguard/sync/incremental
 * Trigger an incremental sync since last sync
 */
router.post('/sync/incremental', async (req, res) => {
  try {
    if (isSyncing) {
      return res.status(409).json({
        success: false,
        error: 'Sync already in progress'
      })
    }

    isSyncing = true
    const lastSyncTime = req.body.lastSyncTime || new Date(Date.now() - 24 * 60 * 60 * 1000)
    const result = await incrementalSync(new Date(lastSyncTime))
    isSyncing = false

    res.json(result)
  } catch (error) {
    isSyncing = false
    res.status(500).json({
      success: false,
      error: error.message
    })
  }
})

/**
 * GET /api/tenantguard/sync/status
 * Get current sync status
 */
router.get('/sync/status', (req, res) => {
  res.json({
    syncing: isSyncing,
    timestamp: new Date().toISOString()
  })
})

/**
 * GET /api/tenantguard/alerts
 * Fetch all alerts from SharePoint
 */
router.get('/alerts', async (req, res) => {
  try {
    const alerts = await getAllAlerts()
    res.json({
      success: true,
      data: alerts,
      count: alerts.length
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    })
  }
})

/**
 * POST /api/tenantguard/sync/schedule
 * Schedule automatic syncs
 */
router.post('/sync/schedule', (req, res) => {
  try {
    const intervalMinutes = req.body.intervalMinutes || 30
    scheduleAutoSync(intervalMinutes)

    res.json({
      success: true,
      message: `Auto-sync scheduled every ${intervalMinutes} minutes`,
      interval_minutes: intervalMinutes
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    })
  }
})

/**
 * POST /api/tenantguard/init
 * Initialize Graph API and SharePoint clients
 */
router.post('/init', async (req, res) => {
  try {
    console.log('Initializing TenantGuard clients...')
    await initGraphClient()
    await initSharePointWriter()

    res.json({
      success: true,
      message: 'TenantGuard clients initialized successfully'
    })
  } catch (error) {
    console.error('Initialization error:', error)
    res.status(500).json({
      success: false,
      error: error.message
    })
  }
})

export default router
