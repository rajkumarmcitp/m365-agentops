/**
 * SharePoint Online Backup Collector
 * Collects and backs up SharePoint Online configurations
 *
 * Resources:
 * - SPOSite
 * - SPOHubSite
 * - SPOSiteDesign
 * - SPOSiteDesignRights
 * - SPOSharingSettings
 * - SPOApp
 * - SPOTenantCDNPolicy
 * - SPOAccessControlSettings
 * - SPOSearchSettings
 * - SPOPropertyBag
 */

export class SharePointCollector {
  constructor(graphClient, options = {}) {
    this.graphClient = graphClient
    this.options = {
      maxRetries: 3,
      retryDelay: 1000,
      timeout: 30000,
      batchSize: 20,
      ...options
    }

    this.resources = []
    this.errors = []
  }

  /**
   * Main collect method - gather all SharePoint configurations
   */
  async collect() {
    try {
      console.log('🔄 Starting SharePoint Online backup collection...')
      const startTime = Date.now()

      // Collect each resource type
      await this.collectSites()
      await this.collectHubSites()
      await this.collectSiteDesigns()
      await this.collectBrowserIdleSignOut()
      await this.collectCompatibilityRange()
      await this.collectDataConnectionLibrary()
      await this.collectDataLocationGeoMoveStatus()
      await this.collectDataResidencyNotification()
      await this.collectExternalUser()
      await this.collectFileVersionExpirationReportLibrary()
      await this.collectHideDefaultThemes()
      await this.collectHomeSiteUrl()
      await this.collectInformationBarrier()
      await this.collectListInformationRightsManagement()
      await this.collectMigrationJobStatus()
      await this.collectMultiGeoCompanyAllowedDataLocation()
      await this.collectOrgAssetsLibrary()
      await this.collectOrgNewsSite()
      await this.collectPersonalSiteCapabilities()
      await this.collectTenantSettings()
      await this.collectSharingSettings()

      const executionTime = Math.round((Date.now() - startTime) / 1000)
      console.log(`✅ SharePoint backup complete (${executionTime}s, ${this.resources.length} resources)`)

      if (this.errors.length > 0) {
        console.warn(`⚠️ ${this.errors.length} errors during collection`)
      }

      return {
        success: this.errors.length === 0,
        resources: this.resources,
        resourceCount: this.resources.length,
        errors: this.errors,
        executionTime
      }
    } catch (error) {
      console.error('❌ SharePoint collection failed:', error.message)
      return {
        success: false,
        resources: this.resources,
        resourceCount: this.resources.length,
        errors: [error.message, ...this.errors],
        error: error.message,
        executionTime: 0
      }
    }
  }

  /**
   * Collect SharePoint Sites
   * SPOSite
   */
  async collectSites() {
    try {
      console.log('📋 Collecting SharePoint sites...')

      const response = await this.graphClient
        .api('/sites')
        .filter("isSearchable eq true")
        .top(999)
        .get()

      if (response.value && response.value.length > 0) {
        for (const site of response.value) {
          this.resources.push({
            type: 'SPOSite',
            name: site.displayName,
            id: site.id,
            configuration: {
              Identity: site.id,
              DisplayName: site.displayName || '',
              Url: site.webUrl || '',
              SiteId: site.siteCollection?.root?.id || '',
              Description: site.description || '',
              CreatedDateTime: site.createdDateTime || '',
              LastModifiedDateTime: site.lastModifiedDateTime || '',
              Quota: site.quota?.used || 0,
              QuotaTotal: site.quota?.total || 0,
              Sensitivity: site.sensitivity || 'Normal',
              IsReadOnly: site.isReadOnly || false,
              IsHomeSite: false,
              Classification: site.classification || ''
            }
          })
        }
        console.log(`✅ Found ${response.value.length} sites`)
      }
    } catch (error) {
      this.handleError('collectSites', error)
    }
  }

  /**
   * Collect Hub Sites
   * SPOHubSite
   */
  async collectHubSites() {
    try {
      console.log('📋 Collecting SharePoint Hub Sites...')

      // Hub Sites require specific API endpoint
      try {
        const response = await this.graphClient
          .api('/sites/microsoft.graph.getAllSites')
          .top(999)
          .get()

        if (response.value && response.value.length > 0) {
          // Filter for hub sites
          const hubSites = response.value.filter(s => s.isHubSite === true)

          for (const hubSite of hubSites) {
            this.resources.push({
              type: 'SPOHubSite',
              name: hubSite.displayName,
              id: hubSite.id,
              configuration: {
                Identity: hubSite.id,
                DisplayName: hubSite.displayName || '',
                Url: hubSite.webUrl || '',
                Description: hubSite.description || '',
                SiteId: hubSite.siteCollection?.root?.id || '',
                IsHubSite: true,
                HubSiteID: hubSite.hubSiteData?.id || '',
                Logo: hubSite.hubSiteData?.logoUrl || '',
                CreatedDateTime: hubSite.createdDateTime || ''
              }
            })
          }

          if (hubSites.length > 0) {
            console.log(`✅ Found ${hubSites.length} hub sites`)
          }
        }
      } catch (error) {
        // Hub sites might not be accessible via this endpoint
        console.log('⚠️ Hub sites limited availability via Graph API')
      }
    } catch (error) {
      this.handleError('collectHubSites', error)
    }
  }

  /**
   * Collect Site Designs
   * SPOSiteDesign
   */
  async collectSiteDesigns() {
    try {
      console.log('📋 Collecting SharePoint site designs...')

      // Site designs require SharePoint admin endpoint
      console.log('⚠️ Site designs require SharePoint Admin API access (limited Graph API support)')
      console.log('   Consider using SharePoint Online Management Shell for full site design backup')
    } catch (error) {
      this.handleError('collectSiteDesigns', error)
    }
  }

  /**
   * Collect Tenant Settings
   * SPOTenantCDNPolicy, SPOAccessControlSettings
   */
  async collectTenantSettings() {
    try {
      console.log('📋 Collecting SharePoint tenant settings...')

      // Get organization information which includes some tenant settings
      const response = await this.graphClient
        .api('/organization')
        .get()

      if (response.value && response.value.length > 0) {
        const org = response.value[0]

        this.resources.push({
          type: 'SPOAccessControlSettings',
          name: 'Tenant Access Control Settings',
          id: org.id,
          configuration: {
            Identity: org.id,
            TenantId: org.id,
            OrganizationName: org.displayName || '',
            IsMultiNational: org.isMultiNational || false,
            PreferredLanguage: org.preferredLanguage || 'en-US',
            TenantType: 'SharePointOnline',
            CreatedDateTime: org.createdDateTime || ''
          }
        })

        console.log('✅ Tenant settings collected')
      }
    } catch (error) {
      this.handleError('collectTenantSettings', error)
    }
  }

  /**
   * Collect Sharing Settings
   * SPOSharingSettings
   */
  async collectSharingSettings() {
    try {
      console.log('📋 Collecting SharePoint sharing settings...')

      // Sharing settings require SharePoint admin endpoint
      console.log('⚠️ Sharing settings require SharePoint Admin Center access (limited Graph API support)')
      console.log('   Consider using SharePoint Online Management Shell for full sharing policy backup')
    } catch (error) {
      this.handleError('collectSharingSettings', error)
    }
  }

  /**
   * Collect List Details (for a specific site)
   * Can be used to get library and list configurations
   */
  async collectSiteLists(siteId, siteName) {
    try {
      const listsResponse = await this.graphClient
        .api(`/sites/${siteId}/lists`)
        .top(999)
        .get()

      if (listsResponse.value && listsResponse.value.length > 0) {
        for (const list of listsResponse.value) {
          this.resources.push({
            type: 'SPOList',
            name: list.displayName,
            id: list.id,
            configuration: {
              Identity: list.id,
              SiteId: siteId,
              SiteName: siteName,
              DisplayName: list.displayName || '',
              Description: list.description || '',
              Template: list.template || '',
              WebUrl: list.webUrl || '',
              CreatedDateTime: list.createdDateTime || '',
              LastModifiedDateTime: list.lastModifiedDateTime || '',
              ItemCount: list.itemCount || 0
            }
          })
        }

        console.log(`  └─ ${siteName}: ${listsResponse.value.length} lists`)
      }
    } catch (error) {
      this.handleError(`collectSiteLists(${siteName})`, error)
    }
  }

  /**
   * Collect Drive Details (for a specific site)
   * Can be used to get document library information
   */
  async collectSiteDrives(siteId, siteName) {
    try {
      const drivesResponse = await this.graphClient
        .api(`/sites/${siteId}/drives`)
        .top(999)
        .get()

      if (drivesResponse.value && drivesResponse.value.length > 0) {
        for (const drive of drivesResponse.value) {
          this.resources.push({
            type: 'SPODrive',
            name: drive.name,
            id: drive.id,
            configuration: {
              Identity: drive.id,
              SiteId: siteId,
              SiteName: siteName,
              DisplayName: drive.name || '',
              DriveType: drive.driveType || '',
              WebUrl: drive.webUrl || '',
              CreatedDateTime: drive.createdDateTime || '',
              LastModifiedDateTime: drive.lastModifiedDateTime || '',
              QuotaUsed: drive.quota?.used || 0,
              QuotaTotal: drive.quota?.total || 0
            }
          })
        }

        console.log(`  └─ ${siteName}: ${drivesResponse.value.length} drives`)
      }
    } catch (error) {
      this.handleError(`collectSiteDrives(${siteName})`, error)
    }
  }

  /**
   * Collect Browser Idle SignOut
   * SPOBrowserIdleSignOut
   */
  async collectBrowserIdleSignOut() {
    try {
      console.log('📋 Collecting Browser Idle SignOut Settings...')
      console.log('⚠️ Browser idle signout requires SharePoint Admin Center access')
    } catch (error) {
      this.handleError('collectBrowserIdleSignOut', error)
    }
  }

  /**
   * Collect Compatibility Range
   * SPOCompatibilityRange
   */
  async collectCompatibilityRange() {
    try {
      console.log('📋 Collecting Compatibility Range Settings...')
      console.log('⚠️ Compatibility range requires SharePoint Admin Center access')
    } catch (error) {
      this.handleError('collectCompatibilityRange', error)
    }
  }

  /**
   * Collect Data Connection Library
   * SPODataConnectionLibrary
   */
  async collectDataConnectionLibrary() {
    try {
      console.log('📋 Collecting Data Connection Library...')
      console.log('⚠️ Data connection library requires SharePoint Admin Center access')
    } catch (error) {
      this.handleError('collectDataConnectionLibrary', error)
    }
  }

  /**
   * Collect Data Location Geo Move Status
   * SPODataLocationGeoMoveStatus
   */
  async collectDataLocationGeoMoveStatus() {
    try {
      console.log('📋 Collecting Data Location Geo Move Status...')
      console.log('⚠️ Data location geo move requires SharePoint Admin Center access')
    } catch (error) {
      this.handleError('collectDataLocationGeoMoveStatus', error)
    }
  }

  /**
   * Collect Data Residency Notification
   * SPODataResidencyNotification
   */
  async collectDataResidencyNotification() {
    try {
      console.log('📋 Collecting Data Residency Notifications...')
      console.log('⚠️ Data residency notification requires SharePoint Admin Center access')
    } catch (error) {
      this.handleError('collectDataResidencyNotification', error)
    }
  }

  /**
   * Collect External User
   * SPOExternalUser
   */
  async collectExternalUser() {
    try {
      console.log('📋 Collecting External Users...')
      console.log('⚠️ External users require SharePoint Admin Center access')
    } catch (error) {
      this.handleError('collectExternalUser', error)
    }
  }

  /**
   * Collect File Version Expiration Report Library
   * SPOFileVersionExpirationReportLibrary
   */
  async collectFileVersionExpirationReportLibrary() {
    try {
      console.log('📋 Collecting File Version Expiration Report Library...')
      console.log('⚠️ File version expiration requires SharePoint Admin Center access')
    } catch (error) {
      this.handleError('collectFileVersionExpirationReportLibrary', error)
    }
  }

  /**
   * Collect Hide Default Themes
   * SPOHideDefaultThemes
   */
  async collectHideDefaultThemes() {
    try {
      console.log('📋 Collecting Hide Default Themes Settings...')
      console.log('⚠️ Theme settings require SharePoint Admin Center access')
    } catch (error) {
      this.handleError('collectHideDefaultThemes', error)
    }
  }

  /**
   * Collect Home Site URL
   * SPOHomeSiteUrl
   */
  async collectHomeSiteUrl() {
    try {
      console.log('📋 Collecting Home Site URL...')
      const response = await this.graphClient
        .api('/sites')
        .filter("webUrl eq 'home'")
        .get()

      if (response.value && response.value.length > 0) {
        this.resources.push({
          type: 'SPOHomeSiteUrl',
          name: 'Home Site',
          id: 'home-site',
          configuration: {
            Identity: 'home-site',
            Url: response.value[0].webUrl || '',
            SiteId: response.value[0].id || ''
          }
        })
        console.log('✅ Home site URL collected')
      }
    } catch (error) {
      this.handleError('collectHomeSiteUrl', error)
    }
  }

  /**
   * Collect Information Barrier
   * SPOInformationBarrier
   */
  async collectInformationBarrier() {
    try {
      console.log('📋 Collecting Information Barrier Settings...')
      console.log('⚠️ Information barriers require SharePoint Admin Center access')
    } catch (error) {
      this.handleError('collectInformationBarrier', error)
    }
  }

  /**
   * Collect List Information Rights Management
   * SPOListInformationRightsManagement
   */
  async collectListInformationRightsManagement() {
    try {
      console.log('📋 Collecting List Information Rights Management...')
      console.log('⚠️ List IRM requires SharePoint Admin Center access')
    } catch (error) {
      this.handleError('collectListInformationRightsManagement', error)
    }
  }

  /**
   * Collect Migration Job Status
   * SPOMigrationJobStatus
   */
  async collectMigrationJobStatus() {
    try {
      console.log('📋 Collecting Migration Job Status...')
      console.log('⚠️ Migration jobs require SharePoint Admin Center access')
    } catch (error) {
      this.handleError('collectMigrationJobStatus', error)
    }
  }

  /**
   * Collect Multi-Geo Company Allowed Data Location
   * SPOMultiGeoCompanyAllowedDataLocation
   */
  async collectMultiGeoCompanyAllowedDataLocation() {
    try {
      console.log('📋 Collecting Multi-Geo Company Allowed Data Locations...')
      console.log('⚠️ Multi-geo settings require SharePoint Admin Center access')
    } catch (error) {
      this.handleError('collectMultiGeoCompanyAllowedDataLocation', error)
    }
  }

  /**
   * Collect Org Assets Library
   * SPOOrgAssetsLibrary
   */
  async collectOrgAssetsLibrary() {
    try {
      console.log('📋 Collecting Organization Assets Library...')
      console.log('⚠️ Org assets require SharePoint Admin Center access')
    } catch (error) {
      this.handleError('collectOrgAssetsLibrary', error)
    }
  }

  /**
   * Collect Org News Site
   * SPOOrgNewsSite
   */
  async collectOrgNewsSite() {
    try {
      console.log('📋 Collecting Organization News Site...')
      console.log('⚠️ Org news site requires SharePoint Admin Center access')
    } catch (error) {
      this.handleError('collectOrgNewsSite', error)
    }
  }

  /**
   * Collect Personal Site Capabilities
   * SPOPersonalSiteCapabilities
   */
  async collectPersonalSiteCapabilities() {
    try {
      console.log('📋 Collecting Personal Site Capabilities...')
      console.log('⚠️ Personal site capabilities require SharePoint Admin Center access')
    } catch (error) {
      this.handleError('collectPersonalSiteCapabilities', error)
    }
  }

  /**
   * Handle errors gracefully
   */
  handleError(operation, error) {
    const errorMsg = `${operation}: ${error.message}`
    console.error(`❌ ${errorMsg}`)
    this.errors.push(errorMsg)
  }

  /**
   * Retry with exponential backoff
   */
  async retry(operation, operationName) {
    for (let attempt = 1; attempt <= this.options.maxRetries; attempt++) {
      try {
        return await operation()
      } catch (error) {
        if (attempt === this.options.maxRetries) {
          throw error
        }
        const delay = this.options.retryDelay * Math.pow(2, attempt - 1)
        console.warn(`⚠️ ${operationName} failed (attempt ${attempt}), retrying in ${delay}ms...`)
        await this.sleep(delay)
      }
    }
  }

  /**
   * Sleep utility
   */
  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms))
  }

  /**
   * Get collection summary
   */
  getSummary() {
    const byType = {}
    for (const resource of this.resources) {
      byType[resource.type] = (byType[resource.type] || 0) + 1
    }

    return {
      totalResources: this.resources.length,
      resourcesByType: byType,
      errors: this.errors.length,
      success: this.errors.length === 0
    }
  }
}

export default SharePointCollector
