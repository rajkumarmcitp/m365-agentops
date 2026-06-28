/**
 * Service Health Messages API Endpoints
 * Handles SharePoint list creation and configuration
 */

import { Router } from 'express'
import {
  createServiceHealthList,
  getSharePointSiteId,
  findServiceHealthList,
  getServiceHealthMessages,
  updateServiceHealthMessage
} from '../../lib/graph-sharepoint.js'

const router = Router()

/**
 * Validate SharePoint site connection
 * POST /api/servicehealth/validate-sharepoint
 */
router.post('/validate-sharepoint', async (req, res) => {
  try {
    const { siteUrl } = req.body

    if (!siteUrl) {
      return res.status(400).json({
        success: false,
        error: 'Site URL is required'
      })
    }

    // Get site ID from Graph API
    const siteId = await getSharePointSiteId('contoso.sharepoint.com', siteUrl)

    res.json({
      success: true,
      siteId,
      siteName: siteUrl,
      message: 'SharePoint site validated successfully'
    })
  } catch (error) {
    console.error('Service Health validation error:', error)
    res.status(400).json({
      success: false,
      error: error.message || 'Failed to validate SharePoint site'
    })
  }
})

/**
 * Initialize Service Health list in SharePoint
 * Creates list with all required columns
 * POST /api/servicehealth/initialize
 */
router.post('/initialize', async (req, res) => {
  try {
    const { siteUrl } = req.body

    if (!siteUrl) {
      return res.status(400).json({
        success: false,
        error: 'Site URL is required'
      })
    }

    // Get site ID
    const siteId = await getSharePointSiteId('contoso.sharepoint.com', siteUrl)

    // Check if list already exists
    const existingListId = await findServiceHealthList(siteId)

    if (existingListId) {
      return res.json({
        success: true,
        siteId,
        listId: existingListId,
        message: 'Service Health list already exists',
        columnsCreated: 0
      })
    }

    // Create the list with all columns
    const result = await createServiceHealthList(siteId)

    res.json({
      success: true,
      siteId,
      listId: result.listId,
      message: result.message,
      columnsCreated: 14
    })
  } catch (error) {
    console.error('Service Health initialization error:', error)
    res.status(400).json({
      success: false,
      error: error.message || 'Failed to initialize Service Health list'
    })
  }
})

/**
 * Get Service Health messages from SharePoint
 * GET /api/servicehealth/messages
 */
router.get('/messages', async (req, res) => {
  try {
    const { siteId, listId } = req.query

    if (!siteId || !listId) {
      return res.status(400).json({
        success: false,
        error: 'siteId and listId are required'
      })
    }

    const messages = await getServiceHealthMessages(siteId, listId)

    res.json({
      success: true,
      messages,
      count: messages.length
    })
  } catch (error) {
    console.error('Error fetching Service Health messages:', error)
    res.status(400).json({
      success: false,
      error: error.message || 'Failed to fetch messages'
    })
  }
})

/**
 * Update a Service Health message
 * PATCH /api/servicehealth/messages/:itemId
 */
router.patch('/messages/:itemId', async (req, res) => {
  try {
    const { siteId, listId } = req.query
    const { itemId } = req.params
    const updates = req.body

    if (!siteId || !listId) {
      return res.status(400).json({
        success: false,
        error: 'siteId and listId are required'
      })
    }

    const updated = await updateServiceHealthMessage(siteId, listId, itemId, updates)

    res.json({
      success: true,
      message: 'Service Health message updated successfully',
      item: updated
    })
  } catch (error) {
    console.error('Error updating Service Health message:', error)
    res.status(400).json({
      success: false,
      error: error.message || 'Failed to update message'
    })
  }
})

export default router
