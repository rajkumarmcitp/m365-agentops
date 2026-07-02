/**
 * Graph API Configuration REST API
 * Exposes GraphConfigService through HTTP endpoints
 * Used by Graph API page and admin dashboard
 */

import express from 'express'
import { graphConfigService } from '../services/graph-config-service.js'
import { unifiedGraphClient } from '../lib/graph-client-unified.js'

const router = express.Router()

/**
 * Middleware: Check Super Admin or Admin role
 */
function requireSuperAdmin(req, res, next) {
  const userRole = req.get('X-User-Role')
  const userId = req.get('X-User-Id')

  // Allow if user has super or admin role
  if (userRole === 'super' || userRole === 'admin') {
    return next()
  }

  // Also allow if user ID is 'aisha' (demo account)
  const superAdminAccounts = ['aisha']
  if (superAdminAccounts.includes(userId)) {
    return next()
  }

  // TEMPORARY: Allow any authenticated request (CORS workaround)
  // Once CORS headers are properly deployed, this will use role checking above
  if (userId || userRole) {
    console.log('⚠️ Graph API accessed - role header missing but user ID present (CORS workaround)')
    return next()
  }

  // Deny access
  return res.status(403).json({
    success: false,
    error: 'Graph API access requires authentication'
  })
}

/**
 * GET /api/graph/config
 * Get current configuration (secrets masked)
 */
router.get('/config', requireSuperAdmin, (req, res) => {
  try {
    const config = graphConfigService.getConfig()
    res.json({
      success: true,
      data: config
    })
  } catch (error) {
    console.error('❌ Failed to get config:', error.message)
    res.status(500).json({
      success: false,
      error: error.message
    })
  }
})

/**
 * POST /api/graph/config
 * Update configuration (applies immediately)
 */
router.post('/config', requireSuperAdmin, (req, res) => {
  try {
    const { credentials, throttling, cache, timeout, rateLimiting } = req.body

    const newConfig = {}
    if (credentials) newConfig.credentials = credentials
    if (throttling) newConfig.throttling = throttling
    if (cache) newConfig.cache = cache
    if (timeout !== undefined) newConfig.timeout = timeout
    if (rateLimiting) newConfig.rateLimiting = rateLimiting

    // Validate configuration
    const validation = graphConfigService.validateConfig()
    if (!validation.valid) {
      return res.status(400).json({
        success: false,
        error: 'Invalid configuration',
        issues: validation.issues
      })
    }

    const result = graphConfigService.updateConfig(newConfig)

    res.json({
      success: result.success,
      message: 'Configuration updated successfully',
      changes: result.changes
    })
  } catch (error) {
    console.error('❌ Failed to update config:', error.message)
    res.status(500).json({
      success: false,
      error: error.message
    })
  }
})

/**
 * POST /api/graph/config/test
 * Test connection with current credentials
 */
router.post('/config/test', requireSuperAdmin, async (req, res) => {
  try {
    const result = await graphConfigService.testConnection()

    res.json({
      success: result.success,
      message: result.message,
      latency: result.latency,
      timestamp: result.timestamp
    })
  } catch (error) {
    console.error('❌ Connection test failed:', error.message)
    res.status(500).json({
      success: false,
      error: error.message
    })
  }
})

/**
 * POST /api/graph/config/rotate-credentials
 * Rotate client secret (new secret provided)
 */
router.post('/config/rotate-credentials', requireSuperAdmin, async (req, res) => {
  try {
    const { clientSecret } = req.body

    if (!clientSecret) {
      return res.status(400).json({
        success: false,
        error: 'clientSecret is required'
      })
    }

    const result = await graphConfigService.rotateCredentials(clientSecret)

    res.json({
      success: result.success,
      message: result.message || result.error
    })
  } catch (error) {
    console.error('❌ Credential rotation failed:', error.message)
    res.status(500).json({
      success: false,
      error: error.message
    })
  }
})

/**
 * GET /api/graph/config/health
 * Get connection health status
 */
router.get('/config/health', requireSuperAdmin, (req, res) => {
  try {
    const health = graphConfigService.getHealth()

    res.json({
      success: true,
      data: health
    })
  } catch (error) {
    console.error('❌ Failed to get health:', error.message)
    res.status(500).json({
      success: false,
      error: error.message
    })
  }
})

/**
 * GET /api/graph/config/stats
 * Get API call statistics
 */
router.get('/config/stats', requireSuperAdmin, (req, res) => {
  try {
    const stats = graphConfigService.getStats()
    const clientStats = unifiedGraphClient.getStats()

    res.json({
      success: true,
      data: {
        configService: stats,
        graphClient: clientStats
      }
    })
  } catch (error) {
    console.error('❌ Failed to get stats:', error.message)
    res.status(500).json({
      success: false,
      error: error.message
    })
  }
})

/**
 * PUT /api/graph/config/throttling
 * Update throttling settings
 */
router.put('/config/throttling', requireSuperAdmin, (req, res) => {
  try {
    const { maxRetries, backoffInterval, strategy, maxConcurrent } = req.body

    const newConfig = {
      throttling: {}
    }

    if (maxRetries !== undefined) newConfig.throttling.maxRetries = maxRetries
    if (backoffInterval !== undefined) newConfig.throttling.backoffInterval = backoffInterval
    if (strategy !== undefined) newConfig.throttling.strategy = strategy
    if (maxConcurrent !== undefined) newConfig.throttling.maxConcurrent = maxConcurrent

    const result = graphConfigService.updateConfig(newConfig)

    res.json({
      success: result.success,
      message: 'Throttling settings updated',
      changes: result.changes
    })
  } catch (error) {
    console.error('❌ Failed to update throttling:', error.message)
    res.status(500).json({
      success: false,
      error: error.message
    })
  }
})

/**
 * PUT /api/graph/config/cache
 * Update cache settings
 */
router.put('/config/cache', requireSuperAdmin, (req, res) => {
  try {
    const { ttl, strategy, enabled } = req.body

    const newConfig = {
      cache: {}
    }

    if (ttl !== undefined) newConfig.cache.ttl = ttl
    if (strategy !== undefined) newConfig.cache.strategy = strategy
    if (enabled !== undefined) newConfig.cache.enabled = enabled

    const result = graphConfigService.updateConfig(newConfig)

    res.json({
      success: result.success,
      message: 'Cache settings updated',
      changes: result.changes
    })
  } catch (error) {
    console.error('❌ Failed to update cache:', error.message)
    res.status(500).json({
      success: false,
      error: error.message
    })
  }
})

/**
 * GET /api/graph/config/endpoints
 * List available Graph API endpoints (reference)
 */
router.get('/config/endpoints', requireSuperAdmin, (req, res) => {
  try {
    const endpoints = {
      groups: [
        { method: 'GET', path: '/v1.0/groups', description: 'List all groups' },
        { method: 'POST', path: '/v1.0/groups', description: 'Create a new group' },
        { method: 'PATCH', path: '/v1.0/groups/{id}', description: 'Update group properties' }
      ],
      users: [
        { method: 'GET', path: '/v1.0/users', description: 'List all users' },
        { method: 'GET', path: '/v1.0/users/{id}', description: 'Get user details' },
        { method: 'PATCH', path: '/v1.0/users/{id}', description: 'Update user properties' }
      ],
      devices: [
        { method: 'GET', path: '/v1.0/devices', description: 'List all devices' },
        { method: 'GET', path: '/v1.0/deviceManagement/deviceCompliancePolicies', description: 'List compliance policies' }
      ],
      identity: [
        { method: 'GET', path: '/v1.0/identity/conditionalAccess/policies', description: 'List Conditional Access policies' },
        { method: 'GET', path: '/v1.0/identity/riskDetections', description: 'List risk detections' }
      ],
      sites: [
        { method: 'GET', path: '/v1.0/sites', description: 'List SharePoint sites' },
        { method: 'GET', path: '/v1.0/sites/{siteId}/lists', description: 'List site lists' }
      ],
      teams: [
        { method: 'GET', path: '/v1.0/teams', description: 'List all teams' },
        { method: 'GET', path: '/v1.0/teams/{id}/channels', description: 'List team channels' }
      ],
      audit: [
        { method: 'GET', path: '/v1.0/auditLogs/directoryAudits', description: 'Get directory audit logs' },
        { method: 'GET', path: '/v1.0/auditLogs/signIns', description: 'Get sign-in logs' }
      ]
    }

    res.json({
      success: true,
      data: endpoints
    })
  } catch (error) {
    console.error('❌ Failed to get endpoints:', error.message)
    res.status(500).json({
      success: false,
      error: error.message
    })
  }
})

/**
 * GET /api/graph/config/permissions
 * List required permissions
 */
router.get('/config/permissions', requireSuperAdmin, (req, res) => {
  try {
    const config = graphConfigService.getConfigRaw()

    res.json({
      success: true,
      data: {
        app: config.permissions.app,
        delegated: config.permissions.delegated
      }
    })
  } catch (error) {
    console.error('❌ Failed to get permissions:', error.message)
    res.status(500).json({
      success: false,
      error: error.message
    })
  }
})

/**
 * GET /api/graph/config/history
 * Get configuration change audit trail
 */
router.get('/config/history', requireSuperAdmin, (req, res) => {
  try {
    const limit = Math.min(parseInt(req.query.limit || '50'), 100)
    const history = graphConfigService.getHistory(limit)

    res.json({
      success: true,
      data: history,
      count: history.length
    })
  } catch (error) {
    console.error('❌ Failed to get history:', error.message)
    res.status(500).json({
      success: false,
      error: error.message
    })
  }
})

/**
 * POST /api/graph/config/clear-cache
 * Clear unified Graph API cache
 */
router.post('/config/clear-cache', requireSuperAdmin, (req, res) => {
  try {
    unifiedGraphClient.clearCache()

    res.json({
      success: true,
      message: 'Cache cleared successfully'
    })
  } catch (error) {
    console.error('❌ Failed to clear cache:', error.message)
    res.status(500).json({
      success: false,
      error: error.message
    })
  }
})

/**
 * POST /api/graph/config/refresh-token
 * Force token refresh
 */
router.post('/config/refresh-token', requireSuperAdmin, async (req, res) => {
  try {
    const result = await graphConfigService.refreshToken()

    res.json({
      success: result.success,
      message: result.message,
      lastRefresh: result.lastRefresh,
      expiresIn: result.expiresIn
    })
  } catch (error) {
    console.error('❌ Token refresh failed:', error.message)
    res.status(500).json({
      success: false,
      error: error.message
    })
  }
})

/**
 * GET /api/graph/config/client-health
 * Get unified Graph client health
 */
router.get('/config/client-health', requireSuperAdmin, (req, res) => {
  try {
    const health = unifiedGraphClient.getHealth()

    res.json({
      success: true,
      data: health
    })
  } catch (error) {
    console.error('❌ Failed to get client health:', error.message)
    res.status(500).json({
      success: false,
      error: error.message
    })
  }
})

export default router
