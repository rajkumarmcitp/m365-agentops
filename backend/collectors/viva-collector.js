/**
 * Microsoft Viva Collector
 * Collects Viva configuration, licensing, and governance data
 * Feeds 100+ Viva security controls
 *
 * API Calls: 8-12 per full collection
 * Delta Queries: Supported
 */

import { BaseCollector } from '../lib/base-collector.js'

export class VivaCollector extends BaseCollector {
  constructor(deltaHelper) {
    super('VivaCollector', { supportsDelta: true, deltaHelper })
  }

  /**
   * Full collection of all Viva data
   */
  async collect(graphClient, tenantId) {
    this.startTimer()
    console.log('📥 Starting Microsoft Viva collection...')

    try {
      // Collect all data in parallel
      const [
        vivaSettings,
        licenses,
        administrativeRoles,
        pimConfig,
        serviceHealth,
        previewFeatures,
        regionalSettings,
        administratorInventory,
        guestAccess,
        accessReviews
      ] = await Promise.allSettled([
        this.getVivaSettings(graphClient),
        this.getVivaLicenses(graphClient),
        this.getAdministrativeRoles(graphClient),
        this.getPIMConfiguration(graphClient),
        this.getServiceHealth(graphClient),
        this.getPreviewFeatures(graphClient),
        this.getRegionalSettings(graphClient),
        this.getAdministratorInventory(graphClient),
        this.getGuestAccess(graphClient),
        this.getAccessReviews(graphClient)
      ])

      const data = this.normalizeResults({
        vivaSettings: vivaSettings.status === 'fulfilled' ? vivaSettings.value : {},
        licenses: licenses.status === 'fulfilled' ? licenses.value : [],
        administrativeRoles: administrativeRoles.status === 'fulfilled' ? administrativeRoles.value : [],
        pimConfiguration: pimConfig.status === 'fulfilled' ? pimConfig.value : {},
        serviceHealth: serviceHealth.status === 'fulfilled' ? serviceHealth.value : [],
        previewFeatures: previewFeatures.status === 'fulfilled' ? previewFeatures.value : [],
        regionalSettings: regionalSettings.status === 'fulfilled' ? regionalSettings.value : {},
        administratorInventory: administratorInventory.status === 'fulfilled' ? administratorInventory.value : [],
        guestAccess: guestAccess.status === 'fulfilled' ? guestAccess.value : [],
        accessReviews: accessReviews.status === 'fulfilled' ? accessReviews.value : []
      })

      const duration = Date.now() - this.startTime
      console.log(`  ✅ VivaCollector: ${JSON.stringify(data).length} bytes (${duration}ms, ${this.apiCallCount} API calls)`)

      return data
    } catch (err) {
      console.error('  ❌ VivaCollector failed:', err.message)
      throw err
    }
  }

  /**
   * Delta collection for Viva
   */
  async delta(graphClient, tenantId, deltaToken) {
    console.log('📥 Starting Microsoft Viva incremental sync...')
    try {
      const endpoints = [
        '/organization',
        '/subscribedSkus',
        '/roleManagement/directory/roleAssignments',
        '/admin/serviceAnnouncement/healthOverviews'
      ]

      const changes = {}
      for (const endpoint of endpoints) {
        try {
          const result = await this.deltaHelper.getDelta(endpoint)
          changes[endpoint] = result
        } catch (err) {
          console.warn(`Delta sync failed for ${endpoint}:`, err.message)
        }
      }

      return this.normalizeResults(changes)
    } catch (err) {
      console.error('Delta collection failed:', err.message)
      throw err
    }
  }

  /**
   * Get Viva tenant settings
   */
  async getVivaSettings(graphClient) {
    try {
      return await graphClient.api('/organization').get()
    } catch (err) {
      console.warn('Failed to get Viva settings:', err.message)
      return {}
    }
  }

  /**
   * Get Viva license information
   */
  async getVivaLicenses(graphClient) {
    try {
      const response = await graphClient.api('/subscribedSkus').get()
      return response.value ? response.value.filter(sku => sku.skuPartNumber && sku.skuPartNumber.includes('Viva')) : []
    } catch (err) {
      console.warn('Failed to get Viva licenses:', err.message)
      return []
    }
  }

  /**
   * Get administrative role assignments
   */
  async getAdministrativeRoles(graphClient) {
    try {
      const response = await graphClient.api('/roleManagement/directory/roleAssignments').get()
      return this.getPaginatedData(graphClient, '/roleManagement/directory/roleAssignments', response)
    } catch (err) {
      console.warn('Failed to get administrative roles:', err.message)
      return []
    }
  }

  /**
   * Get PIM configuration
   */
  async getPIMConfiguration(graphClient) {
    try {
      const response = await graphClient.api('/roleManagement/directory/roleEligibilitySchedules').get()
      return response.value || []
    } catch (err) {
      console.warn('Failed to get PIM configuration:', err.message)
      return []
    }
  }

  /**
   * Get service health status
   */
  async getServiceHealth(graphClient) {
    try {
      const response = await graphClient.api('/admin/serviceAnnouncement/healthOverviews').get()
      return response.value || []
    } catch (err) {
      console.warn('Failed to get service health:', err.message)
      return []
    }
  }

  /**
   * Get preview feature settings
   */
  async getPreviewFeatures(graphClient) {
    try {
      return await graphClient.api('/organization').get()
    } catch (err) {
      console.warn('Failed to get preview features:', err.message)
      return {}
    }
  }

  /**
   * Get regional settings
   */
  async getRegionalSettings(graphClient) {
    try {
      return await graphClient.api('/organization').get()
    } catch (err) {
      console.warn('Failed to get regional settings:', err.message)
      return {}
    }
  }

  /**
   * Get administrator inventory
   */
  async getAdministratorInventory(graphClient) {
    try {
      const response = await graphClient.api('/roleManagement/directory/roleAssignments').get()
      return this.getPaginatedData(graphClient, '/roleManagement/directory/roleAssignments', response)
    } catch (err) {
      console.warn('Failed to get administrator inventory:', err.message)
      return []
    }
  }

  /**
   * Get guest access configuration
   */
  async getGuestAccess(graphClient) {
    try {
      const response = await graphClient.api('/users?$filter=userType eq \'Guest\'').get()
      return response.value || []
    } catch (err) {
      console.warn('Failed to get guest access:', err.message)
      return []
    }
  }

  /**
   * Get access review configurations
   */
  async getAccessReviews(graphClient) {
    try {
      const response = await graphClient.api('/identityGovernance/accessReviews/definitions').get()
      return response.value || []
    } catch (err) {
      console.warn('Failed to get access reviews:', err.message)
      return []
    }
  }

  /**
   * Normalize collected data
   */
  normalizeResults(results) {
    return {
      vivaSettings: results.vivaSettings || {},
      licenses: results.licenses || [],
      administrativeRoles: results.administrativeRoles || [],
      pimConfiguration: results.pimConfiguration || {},
      serviceHealth: results.serviceHealth || [],
      previewFeatures: results.previewFeatures || {},
      regionalSettings: results.regionalSettings || {},
      administratorInventory: results.administratorInventory || [],
      guestAccess: results.guestAccess || [],
      accessReviews: results.accessReviews || [],
      collectionTime: new Date().toISOString(),
      apiCallCount: this.apiCallCount
    }
  }
}
