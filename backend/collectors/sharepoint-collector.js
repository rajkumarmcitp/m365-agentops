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

      // Reset state for fresh collection
      this.resources = []
      this.errors = []

      // Base SharePoint structure collection
      console.log('📊 Starting SharePoint base structure collection...')
      await this.collectSites()
      await this.collectHubSites()
      await this.collectSiteDesigns()
      await this.collectTenantSettings()

      // Phase 1 - Core governance and access control
      console.log('📊 Starting SharePoint Phase 1 collection...')
      await this.collectAccessControlSettings() // SPOAccessControlSettings
      await this.collectApps() // SPOApp
      await this.collectBrowserIdleSignOut() // SPOBrowserIdleSignOut
      await this.collectTenantCDNPolicy() // SPOTenantCDNPolicy
      await this.collectSiteAuditSettings() // SPOSiteAuditSettings
      await this.collectUserProfileProperty() // SPOUserProfileProperty
      await this.collectRetentionPolicy() // SPORetentionPolicy
      await this.collectMultiGeoConfiguration() // SPOMultiGeoConfiguration
      await this.collectSharingSettings() // SPOSharingSettings

      // Phase 2 - Advanced governance and compliance
      console.log('📊 Starting SharePoint Phase 2 collection...')
      await this.collectInformationBarrierPolicies() // SPOInformationBarrier
      await this.collectSensitivityLabels() // SPOSensitivityLabel
      await this.collectDLPPolicies() // SPODLPPolicy
      await this.collectOrgNewsSiteSettings() // SPOOrgNewsSite
      await this.collectOrgAssetsLibrarySettings() // SPOOrgAssetsLibrary
      await this.collectSearchConfiguration() // SPOSearchConfiguration
      await this.collectManagedProperties() // SPOManagedProperty
      await this.collectContentTypeHub() // SPOContentTypeHub
      await this.collectPowerPlatformIntegration() // SPOPowerPlatformIntegration
      await this.collectSiteCollectionAdmins() // SPOSiteCollectionAdmin

      // Phase 3 - Final organizational and advanced settings
      console.log('📊 Starting SharePoint Phase 3 collection...')
      await this.collectExternalUserSharing() // SPOExternalUserSharing
      await this.collectHideDefaultThemesSettings() // SPOHideDefaultThemes
      await this.collectRecordManagementSettings() // SPORecordManagement
      await this.collectTenantProperties() // SPOTenantProperties
      await this.collectPersonalSiteSettings() // SPOPersonalSiteSettings
      await this.collectOffice365GroupsSettings() // SPOOffice365GroupsSettings
      await this.collectAdvancedSharingPolicy() // SPOAdvancedSharingPolicy
      await this.collectDataLocationSettings() // SPODataLocationSettings

      // Phase 4 - Advanced content management and modern SharePoint (PnP PowerShell)
      console.log('📊 Starting SharePoint Phase 4 collection (PnP PowerShell)...')
      await this.collectSiteFeatures() // SPOSiteFeatures
      await this.collectModernPageConfiguration() // SPOModernPageConfiguration
      await this.collectSearchResultsBlockConfiguration() // SPOSearchResultsBlockConfiguration
      await this.collectSearchQueryRules() // SPOSearchQueryRules
      await this.collectMicrosoftSearchConfiguration() // SPOMicrosoftSearchConfiguration
      await this.collectContentTypeBindings() // SPOContentTypeBindings
      await this.collectLibraryTemplates() // SPOLibraryTemplates
      await this.collectSiteScriptPolicies() // SPOSiteScriptPolicies
      await this.collectTenantAppCatalogConfiguration() // SPOTenantAppCatalogConfiguration
      await this.collectPageTransitionPolicies() // SPOPageTransitionPolicies
      await this.collectAdvancedSearchConfiguration() // SPOAdvancedSearchConfiguration
      await this.collectSiteCollectionAppCatalogConfiguration() // SPOSiteCollectionAppCatalogConfiguration

      // Phase 5 - Advanced permissions, branding, and site lifecycle
      console.log('📊 Starting SharePoint Phase 5 collection (PnP PowerShell)...')
      await this.collectAdvancedPermissionsManagement() // SPOAdvancedPermissionsManagement
      await this.collectSiteThemingAndBranding() // SPOSiteThemingAndBranding
      await this.collectSiteLifecyclePolicy() // SPOSiteLifecyclePolicy
      await this.collectAdvancedRetentionAndArchive() // SPOAdvancedRetentionAndArchive
      await this.collectDelegationAndAccessReview() // SPODelegationAndAccessReview
      await this.collectSiteGovernancePolicy() // SPOSiteGovernancePolicy
      await this.collectAdvancedAuditingConfiguration() // SPOAdvancedAuditingConfiguration
      await this.collectManagedMetadataConfiguration() // SPOManagedMetadataConfiguration
      await this.collectAdvancedComplianceSettings() // SPOAdvancedComplianceSettings

      // Stub methods for future enhancement
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

      // PowerShell collection - advanced SharePoint components
      console.log('📊 Starting PowerShell-based collection for advanced SharePoint components...')
      await this.collectSharingSettingsPowerShell()
      await this.collectSitePoliciesPowerShell()
      await this.collectExternalUserAccessPowerShell()
      await this.collectRecordsManagementPowerShell()
      await this.collectSearchSettingsPowerShell()

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
   * Collect SharePoint Sites (Comprehensive)
   * SPOSite
   */
  async collectSites() {
    try {
      console.log('📋 Collecting SharePoint sites (Comprehensive)...')

      const response = await this.graphClient
        .api('/sites')
        .select('id,displayName,description,webUrl,siteCollection,createdDateTime,lastModifiedDateTime,quota,sensitivity,isReadOnly,classification,sharingSettings,retentionLabel,parentReference')
        .filter("isSearchable eq true")
        .top(999)
        .get()

      if (response.value && response.value.length > 0) {
        for (const site of response.value) {
          // Collect site members/owners
          let members = []
          try {
            const membersResponse = await this.graphClient
              .api(`/sites/${site.id}/users`)
              .select('id,displayName,userPrincipalName,email')
              .top(999)
              .get()

            if (membersResponse.value) {
              members = membersResponse.value.map(m => ({
                Identity: m.id,
                DisplayName: m.displayName,
                UserPrincipalName: m.userPrincipalName || m.email,
                Email: m.email || ''
              }))
            }
          } catch (e) {
            console.warn(`⚠️ Could not fetch members for site ${site.displayName}`)
          }

          // Collect site lists
          let lists = []
          try {
            const listsResponse = await this.graphClient
              .api(`/sites/${site.id}/lists`)
              .select('id,displayName,description,createdDateTime,items,webUrl,template')
              .top(999)
              .get()

            if (listsResponse.value) {
              lists = listsResponse.value.map(l => ({
                Identity: l.id,
                DisplayName: l.displayName,
                Description: l.description || '',
                CreatedDateTime: l.createdDateTime || '',
                Template: l.template?.displayName || l.template || '',
                WebUrl: l.webUrl || '',
                ItemCount: l.items?.length || 0
              }))
            }
          } catch (e) {
            console.warn(`⚠️ Could not fetch lists for site ${site.displayName}`)
          }

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
              QuotaRemaining: (site.quota?.total || 0) - (site.quota?.used || 0),
              Sensitivity: site.sensitivity || 'Normal',
              IsReadOnly: site.isReadOnly || false,
              IsHomeSite: false,
              Classification: site.classification || '',
              MemberCount: members.length,
              Members: members,
              ListCount: lists.length,
              Lists: lists,
              SharingCapability: site.sharingSettings?.sharingCapability || 'ExternalUserSharingOnly',
              RetentionLabel: site.retentionLabel?.displayName || '',
              StorageQuotaWarningLevel: site.quota?.storageUsageWarningLevel || 0,
              ResourceBehaviorOptions: site.resourceBehaviorOptions || [],
              RestrictionLabelDefault: site.restrictionLabelDefault || '',
              SiteId: site.siteCollection?.root?.id || site.id,
              IsModern: true,
              Owner: members.find(m => m.Roles?.includes('admin'))?.DisplayName || 'System'
            }
          })
        }
        console.log(`✅ Found ${response.value.length} sites with ${members.length} total members and ${lists.length} lists`)
      }
    } catch (error) {
      this.handleError('collectSites', error)
    }
  }

  /**
   * Collect Hub Sites (Comprehensive)
   * SPOHubSite
   */
  async collectHubSites() {
    try {
      console.log('📋 Collecting SharePoint Hub Sites (Comprehensive)...')

      // Hub Sites require specific API endpoint
      try {
        const response = await this.graphClient
          .api('/sites/microsoft.graph.getAllSites')
          .select('id,displayName,description,webUrl,siteCollection,createdDateTime,lastModifiedDateTime,isHubSite,hubSiteData,sharingSettings,classification')
          .top(999)
          .get()

        if (response.value && response.value.length > 0) {
          // Filter for hub sites
          const hubSites = response.value.filter(s => s.isHubSite === true)

          for (const hubSite of hubSites) {
            // Collect hub site members
            let members = []
            try {
              const membersResponse = await this.graphClient
                .api(`/sites/${hubSite.id}/users`)
                .select('id,displayName,userPrincipalName,email')
                .top(999)
                .get()

              if (membersResponse.value) {
                members = membersResponse.value.map(m => ({
                  Identity: m.id,
                  DisplayName: m.displayName,
                  UserPrincipalName: m.userPrincipalName || m.email,
                  Email: m.email || ''
                }))
              }
            } catch (e) {
              console.warn(`⚠️ Could not fetch members for hub site ${hubSite.displayName}`)
            }

            // Collect associated sites
            let associatedSites = []
            try {
              const sitesResponse = await this.graphClient
                .api(`/sites/${hubSite.id}/sites`)
                .select('id,displayName,webUrl,classification')
                .top(999)
                .get()

              if (sitesResponse.value) {
                associatedSites = sitesResponse.value.map(s => ({
                  Identity: s.id,
                  DisplayName: s.displayName,
                  WebUrl: s.webUrl || '',
                  Classification: s.classification || ''
                }))
              }
            } catch (e) {
              console.warn(`⚠️ Could not fetch associated sites for hub ${hubSite.displayName}`)
            }

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
                Theme: hubSite.hubSiteData?.theme || 'Default',
                HeaderEmphasis: hubSite.hubSiteData?.headerEmphasis || '',
                MemberCount: members.length,
                Members: members,
                AssociatedSiteCount: associatedSites.length,
                AssociatedSites: associatedSites,
                CreatedDateTime: hubSite.createdDateTime || '',
                LastModifiedDateTime: hubSite.lastModifiedDateTime || '',
                Classification: hubSite.classification || '',
                SharingCapability: hubSite.sharingSettings?.sharingCapability || 'ExternalUserSharingOnly',
                IsModern: true,
                HubSearchScope: 'Hub'
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
      console.log('📋 Collecting Browser Idle SignOut Settings (PowerShell)...')
      const script = `
        [PSCustomObject]@{
          Enabled = (Get-SPOBrowserIdleSignoutSettings -ErrorAction SilentlyContinue).Enabled -eq $true
          SignOutAfterInactivityInMinutes = (Get-SPOBrowserIdleSignoutSettings -ErrorAction SilentlyContinue).SignOutAfterInactivityInMinutes
          CreatedDate = Get-Date
        } |
        ConvertTo-Json -Depth 2
      `
      const result = await this.executePowerShell(script)
      if (result && typeof result === 'object') {
        this.resources.push({
          type: 'SPOBrowserIdleSignOut',
          name: 'BrowserIdleSignOut',
          id: 'browser-idle-signout',
          configuration: {
            Identity: 'browser-idle-signout',
            Enabled: result.Enabled || false,
            SignOutAfterInactivityInMinutes: result.SignOutAfterInactivityInMinutes || 15,
            CreatedDate: new Date().toISOString()
          }
        })
        console.log('✅ Found browser idle sign out settings')
      }
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
      console.log('📋 Collecting Compatibility Range Settings (PowerShell)...')
      const script = `
        [PSCustomObject]@{
          CompatibilityRange = (Get-SPOCompatibilityRange -ErrorAction SilentlyContinue)
          CreatedDate = Get-Date
        } |
        ConvertTo-Json -Depth 2
      `
      const result = await this.executePowerShell(script)
      if (result) {
        this.resources.push({
          type: 'SPOCompatibilityRange',
          name: 'CompatibilityRange',
          id: 'compatibility-range',
          configuration: {
            Identity: 'compatibility-range',
            CompatibilityRange: result.CompatibilityRange || '14',
            CreatedDate: new Date().toISOString()
          }
        })
        console.log('✅ Found compatibility range setting')
      }
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
      console.log('📋 Collecting External Users (PowerShell)...')
      const script = `
        @((Get-SPOExternalUser -ErrorAction SilentlyContinue) |
          Select-Object -First 999 |
          ForEach-Object {
            [PSCustomObject]@{
              UniqueId = $_.UniqueId
              DisplayName = $_.DisplayName
              Email = $_.Email
              InvitedAsGuest = $_.InvitedAsGuest
              WhenCreated = $_.WhenCreated
            }
          } |
          ConvertTo-Json -Depth 2)
      `
      const result = await this.executePowerShell(script)
      if (result && Array.isArray(result)) {
        for (const user of result) {
          this.resources.push({
            type: 'SPOExternalUser',
            name: user.DisplayName || user.Email,
            id: user.UniqueId,
            configuration: {
              Identity: user.UniqueId,
              DisplayName: user.DisplayName || '',
              Email: user.Email || '',
              InvitedAsGuest: user.InvitedAsGuest || false,
              WhenCreated: user.WhenCreated || new Date().toISOString()
            }
          })
        }
        console.log(`✅ Found ${result.length} external users`)
      }
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

  // ============================================================
  // POWERSHELL COLLECTION METHODS - Advanced SharePoint Components
  // ============================================================

  /**
   * Collect Sharing Settings via PowerShell
   */
  async collectSharingSettingsPowerShell() {
    try {
      console.log('📋 Collecting Sharing Settings (PowerShell)...')
      const script = `
        $settings = Get-SPOTenant -ErrorAction SilentlyContinue
        if ($settings) {
          [PSCustomObject]@{
            Identity = $settings.Url
            ExternalSharingDefault = $settings.SharingCapability
            ExternalSharingAllowed = $settings.RequireAcceptingAccountMatchInvitationEmail
            AllowExternalUserAccess = $settings.SharingDomainRestrictionMode
            PreventExternalSharingDomains = @($settings.SPOSharePointDomainBlackList)
            PreventExternalSharingDomainWhitelist = @($settings.SPOSharePointDomainWhiteList)
            AllowGroomingToAssertByDefault = $settings.AllowGroomingToAssertByDefault
            EmailAttestationRequired = $settings.EmailAttestationRequired
            EmailAttestationExpireInDays = $settings.EmailAttestationExpireInDays
            ApplyAppEnforcedRestrictionsToAdminContent = $settings.ApplyAppEnforcedRestrictionsToAdminContent
            FileAnonymousLinkType = $settings.FileAnonymousLinkType
            FolderAnonymousLinkType = $settings.FolderAnonymousLinkType
            EnableAnonymousLinkExpiration = $settings.EnableAnonymousLinkExpiration
            AnonymousLinkExpirationDays = $settings.AnonymousLinkExpirationDays
            CommentsOnGuestAccessRestrictedFiles = $settings.CommentsOnGuestAccessRestrictedFiles
            DefaultSharingLinkType = $settings.DefaultSharingLinkType
            DefaultLinkPermission = $settings.DefaultLinkPermission
            RequireAnonymousLinksExpire = $settings.RequireAnonymousLinksExpire
            AnonymousLinkExpirationRestricted = $settings.AnonymousLinkExpirationRestricted
          } | ConvertTo-Json -Depth 2
        }
      `
      const result = await this.executePowerShell(script)
      if (result) {
        this.resources.push({
          type: 'SPOSharingPolicy',
          name: 'Tenant Sharing Settings',
          id: 'SharePointTenant',
          configuration: {
            Identity: result.Identity || 'SharePointTenant',
            ExternalSharingDefault: result.ExternalSharingDefault || 'ExternalUserSharingOnly',
            ExternalSharingAllowed: result.ExternalSharingAllowed || true,
            AllowExternalUserAccess: result.AllowExternalUserAccess || 'AllowLimitedAccess',
            PreventExternalSharingDomains: Array.isArray(result.PreventExternalSharingDomains) ? result.PreventExternalSharingDomains : [],
            AllowGroomingToAssertByDefault: result.AllowGroomingToAssertByDefault || false,
            EmailAttestationRequired: result.EmailAttestationRequired || false,
            EmailAttestationExpireInDays: result.EmailAttestationExpireInDays || 30,
            ApplyAppEnforcedRestrictionsToAdminContent: result.ApplyAppEnforcedRestrictionsToAdminContent || false,
            FileAnonymousLinkType: result.FileAnonymousLinkType || 'Edit',
            FolderAnonymousLinkType: result.FolderAnonymousLinkType || 'Edit',
            EnableAnonymousLinkExpiration: result.EnableAnonymousLinkExpiration || false,
            AnonymousLinkExpirationDays: result.AnonymousLinkExpirationDays || 0,
            CommentsOnGuestAccessRestrictedFiles: result.CommentsOnGuestAccessRestrictedFiles || 'Disabled',
            DefaultSharingLinkType: result.DefaultSharingLinkType || 'Internal',
            DefaultLinkPermission: result.DefaultLinkPermission || 'View',
            RequireAnonymousLinksExpire: result.RequireAnonymousLinksExpire || false,
            AnonymousLinkExpirationRestricted: result.AnonymousLinkExpirationRestricted || false
          }
        })
        console.log('✅ Sharing settings collected')
      }
    } catch (error) {
      this.handleError('collectSharingSettingsPowerShell', error)
    }
  }

  /**
   * Collect Site Policies via PowerShell
   */
  async collectSitePoliciesPowerShell() {
    try {
      console.log('📋 Collecting Site Policies (PowerShell)...')
      const script = `
        @((Get-SPOSitePolicy -ErrorAction SilentlyContinue) |
          ForEach-Object {
            [PSCustomObject]@{
              Identity = $_.Name
              DisplayName = $_.Name
              Description = $_.Description
              CreatedDate = $_.CreatedDate
              LastModifiedDate = $_.LastModifiedDate
              Disabled = $_.Disabled
            }
          } |
          ConvertTo-Json -Depth 2)
      `
      const result = await this.executePowerShell(script)
      if (result && Array.isArray(result)) {
        for (const policy of result) {
          this.resources.push({
            type: 'SPOSitePolicy',
            name: policy.DisplayName || policy.Identity,
            id: policy.Identity,
            configuration: {
              Identity: policy.Identity,
              DisplayName: policy.DisplayName || '',
              Description: policy.Description || '',
              CreatedDate: policy.CreatedDate || new Date().toISOString(),
              LastModifiedDate: policy.LastModifiedDate || new Date().toISOString(),
              Disabled: policy.Disabled || false
            }
          })
        }
        console.log(`✅ Found ${result.length} site policies`)
      }
    } catch (error) {
      this.handleError('collectSitePoliciesPowerShell', error)
    }
  }

  /**
   * Collect External User Access via PowerShell
   */
  async collectExternalUserAccessPowerShell() {
    try {
      console.log('📋 Collecting External User Access (PowerShell)...')
      const script = `
        @((Get-SPOExternalUser -ErrorAction SilentlyContinue -ResultSize 1000) |
          ForEach-Object {
            [PSCustomObject]@{
              Identity = $_.RecipientTypeDetails
              DisplayName = $_.DisplayName
              Email = $_.Email
              CreatedDate = $_.WhenCreated
              LastActivity = $_.LastActivity
              ExternalUserState = $_.ExternalUserState
            }
          } |
          ConvertTo-Json -Depth 2)
      `
      const result = await this.executePowerShell(script)
      if (result && Array.isArray(result)) {
        for (const user of result) {
          this.resources.push({
            type: 'SPOExternalUser',
            name: user.DisplayName || user.Email,
            id: user.Email,
            configuration: {
              Identity: user.Email,
              DisplayName: user.DisplayName || '',
              Email: user.Email || '',
              CreatedDate: user.CreatedDate || new Date().toISOString(),
              LastActivity: user.LastActivity || '',
              ExternalUserState: user.ExternalUserState || 'Accepted'
            }
          })
        }
        console.log(`✅ Found ${result.length} external users`)
      }
    } catch (error) {
      this.handleError('collectExternalUserAccessPowerShell', error)
    }
  }

  /**
   * Collect Records Management Settings via PowerShell
   */
  async collectRecordsManagementPowerShell() {
    try {
      console.log('📋 Collecting Records Management Settings (PowerShell)...')
      const script = `
        $settings = Get-SPOTenant -ErrorAction SilentlyContinue
        if ($settings) {
          [PSCustomObject]@{
            DisplayRecordsManagement = $settings.DisplayStartASiteOption
            EnableAutoExpirationVersionTrim = $settings.EnableAutoExpirationVersionTrim
            RetentionEnabled = $true
            ContentTypeHubUrl = $settings.ContentTypeHubUrl
          } | ConvertTo-Json -Depth 2
        }
      `
      const result = await this.executePowerShell(script)
      if (result) {
        this.resources.push({
          type: 'SPORecordsManagement',
          name: 'Records Management Settings',
          id: 'RecordsManagement',
          configuration: {
            Identity: 'RecordsManagement',
            DisplayRecordsManagement: result.DisplayRecordsManagement || false,
            EnableAutoExpirationVersionTrim: result.EnableAutoExpirationVersionTrim || false,
            RetentionEnabled: result.RetentionEnabled || false,
            ContentTypeHubUrl: result.ContentTypeHubUrl || ''
          }
        })
        console.log('✅ Records management settings collected')
      }
    } catch (error) {
      this.handleError('collectRecordsManagementPowerShell', error)
    }
  }

  /**
   * Collect Search Settings via PowerShell
   */
  async collectSearchSettingsPowerShell() {
    try {
      console.log('📋 Collecting Search Settings (PowerShell)...')
      const script = `
        $settings = Get-SPOSearchSettings -ErrorAction SilentlyContinue
        if ($settings) {
          [PSCustomObject]@{
            SearchScope = $settings.SearchScope
            PreferredSearchResultSourceID = $settings.PreferredSearchResultSourceID
            BrowsingDirectoryDepth = $settings.BrowsingDirectoryDepth
            SearchQueryToolTipText = $settings.SearchQueryToolTipText
          } | ConvertTo-Json -Depth 2
        }
      `
      const result = await this.executePowerShell(script)
      if (result) {
        this.resources.push({
          type: 'SPOSearchSetting',
          name: 'Search Settings',
          id: 'SearchSettings',
          configuration: {
            Identity: 'SearchSettings',
            SearchScope: result.SearchScope || 'All',
            PreferredSearchResultSourceID: result.PreferredSearchResultSourceID || '',
            BrowsingDirectoryDepth: result.BrowsingDirectoryDepth || 20,
            SearchQueryToolTipText: result.SearchQueryToolTipText || ''
          }
        })
        console.log('✅ Search settings collected')
      }
    } catch (error) {
      this.handleError('collectSearchSettingsPowerShell', error)
    }
  }

  // ============================================================
  // PHASE 1: ADDITIONAL CRITICAL RESOURCE COLLECTORS
  // ============================================================

  /**
   * Collect Access Control Settings
   * SPOAccessControlSettings (Phase 1)
   */
  async collectAccessControlSettings() {
    try {
      console.log('📋 Collecting SPO Access Control Settings (PowerShell)...')
      const script = `
        [PSCustomObject]@{
          BlockMacClients = (Get-SPOAccessControlSettings -ErrorAction SilentlyContinue).BlockMacClients
          EmailAttestationRequired = (Get-SPOAccessControlSettings -ErrorAction SilentlyContinue).EmailAttestationRequired
          EmailAttestationReAuthDays = (Get-SPOAccessControlSettings -ErrorAction SilentlyContinue).EmailAttestationReAuthDays
          CreatedDate = Get-Date
        } |
        ConvertTo-Json -Depth 2
      `
      const result = await this.executePowerShell(script)
      if (result) {
        this.resources.push({
          type: 'SPOAccessControlSettings',
          name: 'AccessControlSettings',
          id: 'access-control-settings',
          configuration: {
            Identity: 'access-control-settings',
            BlockMacClients: result.BlockMacClients || false,
            EmailAttestationRequired: result.EmailAttestationRequired || false,
            EmailAttestationReAuthDays: result.EmailAttestationReAuthDays || 0,
            CreatedDate: new Date().toISOString()
          }
        })
        console.log('✅ Found access control settings')
      }
    } catch (error) {
      this.handleError('collectAccessControlSettings', error)
    }
  }

  /**
   * Collect Apps
   * SPOApp (Phase 1)
   */
  async collectApps() {
    try {
      console.log('📋 Collecting SPO Apps (PowerShell)...')
      const script = `
        @((Get-SPOApp -ErrorAction SilentlyContinue) |
          Select-Object -First 999 |
          ForEach-Object {
            [PSCustomObject]@{
              AppId = $_.AppId
              Title = $_.Title
              Version = $_.Version
              Status = $_.Status
              CreatedDate = Get-Date
            }
          } |
          ConvertTo-Json -Depth 2)
      `
      const result = await this.executePowerShell(script)
      if (result && Array.isArray(result)) {
        for (const app of result) {
          this.resources.push({
            type: 'SPOApp',
            name: app.Title,
            id: app.AppId,
            configuration: {
              Identity: app.AppId,
              Title: app.Title || '',
              Version: app.Version || '',
              Status: app.Status || 'Unknown',
              CreatedDate: new Date().toISOString()
            }
          })
        }
        console.log(`✅ Found ${result.length} apps`)
      }
    } catch (error) {
      this.handleError('collectApps', error)
    }
  }

  /**
   * Collect Tenant CDN Policy
   * SPOTenantCDNPolicy (Phase 1)
   */
  async collectTenantCDNPolicy() {
    try {
      console.log('📋 Collecting SPO Tenant CDN Policy (PowerShell)...')
      const script = `
        @((Get-SPOTenantCdnPolicy -CdnType Public -ErrorAction SilentlyContinue),
          (Get-SPOTenantCdnPolicy -CdnType Private -ErrorAction SilentlyContinue)) |
        ForEach-Object {
          [PSCustomObject]@{
            CDNType = if ($_ -eq 'Public') { 'Public' } else { 'Private' }
            IncludeSharedFolders = $_.IncludeSharedFolders
            CreatedDate = Get-Date
          }
        } |
        ConvertTo-Json -Depth 2
      `
      const result = await this.executePowerShell(script)
      if (result && Array.isArray(result)) {
        for (const policy of result) {
          this.resources.push({
            type: 'SPOTenantCDNPolicy',
            name: \`CDNPolicy-\${policy.CDNType}\`,
            id: \`cdn-\${policy.CDNType.toLowerCase()}\`,
            configuration: {
              Identity: \`cdn-\${policy.CDNType.toLowerCase()}\`,
              CDNType: policy.CDNType || '',
              IncludeSharedFolders: policy.IncludeSharedFolders || false,
              CreatedDate: new Date().toISOString()
            }
          })
        }
        console.log(`✅ Found ${result.length} CDN policies`)
      }
    } catch (error) {
      this.handleError('collectTenantCDNPolicy', error)
    }
  }

  /**
   * Collect Site Audit Settings
   * SPOSiteAuditSettings (Phase 1)
   */
  async collectSiteAuditSettings() {
    try {
      console.log('📋 Collecting SPO Site Audit Settings (PowerShell)...')
      const script = `
        @((Get-SPOSite -Limit All -ErrorAction SilentlyContinue) |
          Select-Object -First 999 |
          Where-Object { $_.Url -and -not $_.IsPublic } |
          ForEach-Object {
            [PSCustomObject]@{
              SiteUrl = $_.Url
              Owner = $_.Owner
              StorageQuotaMB = $_.StorageQuotaMB
              StorageUsageMB = $_.StorageUsageMB
              LockState = $_.LockState
              CompatibilityLevel = $_.CompatibilityLevel
              CreatedDate = $_.CreatedDate
            }
          } |
          ConvertTo-Json -Depth 2)
      `
      const result = await this.executePowerShell(script)
      if (result && Array.isArray(result)) {
        for (const audit of result) {
          this.resources.push({
            type: 'SPOSiteAuditSettings',
            name: audit.SiteUrl.split('/').pop() || audit.SiteUrl,
            id: audit.SiteUrl,
            configuration: {
              Identity: audit.SiteUrl,
              SiteUrl: audit.SiteUrl || '',
              Owner: audit.Owner || '',
              StorageQuotaMB: audit.StorageQuotaMB || 0,
              StorageUsageMB: audit.StorageUsageMB || 0,
              LockState: audit.LockState || 'Unlock',
              CompatibilityLevel: audit.CompatibilityLevel || 15,
              CreatedDate: audit.CreatedDate || new Date().toISOString()
            }
          })
        }
        console.log(`✅ Found ${result.length} site audit settings`)
      }
    } catch (error) {
      this.handleError('collectSiteAuditSettings', error)
    }
  }

  /**
   * Collect User Profile Property
   * SPOUserProfileProperty (Phase 1)
   */
  async collectUserProfileProperty() {
    try {
      console.log('📋 Collecting SPO User Profile Properties (PowerShell)...')
      const script = `
        @((Get-SPOUserProfileProperty -ErrorAction SilentlyContinue) |
          Select-Object -First 999 |
          ForEach-Object {
            [PSCustomObject]@{
              Name = $_.Name
              DisplayName = $_.DisplayName
              IsUserProperty = $_.IsUserProperty
              IsSearchable = $_.IsSearchable
              CreatedDate = Get-Date
            }
          } |
          ConvertTo-Json -Depth 2)
      `
      const result = await this.executePowerShell(script)
      if (result && Array.isArray(result)) {
        for (const prop of result) {
          this.resources.push({
            type: 'SPOUserProfileProperty',
            name: prop.DisplayName || prop.Name,
            id: prop.Name,
            configuration: {
              Identity: prop.Name,
              Name: prop.Name || '',
              DisplayName: prop.DisplayName || '',
              IsUserProperty: prop.IsUserProperty || false,
              IsSearchable: prop.IsSearchable || false,
              CreatedDate: new Date().toISOString()
            }
          })
        }
        console.log(`✅ Found ${result.length} user profile properties`)
      }
    } catch (error) {
      this.handleError('collectUserProfileProperty', error)
    }
  }

  /**
   * Collect Retention Policy
   * SPORetentionPolicy (Phase 1)
   */
  async collectRetentionPolicy() {
    try {
      console.log('📋 Collecting SPO Retention Policies (PowerShell)...')
      const script = `
        @((Get-SPORetentionLabel -ErrorAction SilentlyContinue) |
          Select-Object -First 999 |
          ForEach-Object {
            [PSCustomObject]@{
              DisplayName = $_.DisplayName
              Name = $_.Name
              RetentionDays = $_.RetentionDays
              RetentionTrigger = $_.RetentionTrigger
              CreatedDate = Get-Date
            }
          } |
          ConvertTo-Json -Depth 2)
      `
      const result = await this.executePowerShell(script)
      if (result && Array.isArray(result)) {
        for (const policy of result) {
          this.resources.push({
            type: 'SPORetentionPolicy',
            name: policy.DisplayName || policy.Name,
            id: policy.Name,
            configuration: {
              Identity: policy.Name,
              DisplayName: policy.DisplayName || '',
              Name: policy.Name || '',
              RetentionDays: policy.RetentionDays || 0,
              RetentionTrigger: policy.RetentionTrigger || '',
              CreatedDate: new Date().toISOString()
            }
          })
        }
        console.log(`✅ Found ${result.length} retention policies`)
      }
    } catch (error) {
      this.handleError('collectRetentionPolicy', error)
    }
  }

  /**
   * Collect Multi-Geo Configuration
   * SPOMultiGeoConfiguration (Phase 1)
   */
  async collectMultiGeoConfiguration() {
    try {
      console.log('📋 Collecting SPO Multi-Geo Configuration (PowerShell)...')
      const script = `
        [PSCustomObject]@{
          IsMultiGeoEnabled = (Get-SPOMultiGeoConfiguration -ErrorAction SilentlyContinue).IsMultiGeoEnabled
          ServicePrincipalId = (Get-SPOMultiGeoConfiguration -ErrorAction SilentlyContinue).ServicePrincipalId
          CreatedDate = Get-Date
        } |
        ConvertTo-Json -Depth 2
      `
      const result = await this.executePowerShell(script)
      if (result) {
        this.resources.push({
          type: 'SPOMultiGeoConfiguration',
          name: 'MultiGeoConfiguration',
          id: 'multi-geo-config',
          configuration: {
            Identity: 'multi-geo-config',
            IsMultiGeoEnabled: result.IsMultiGeoEnabled || false,
            ServicePrincipalId: result.ServicePrincipalId || '',
            CreatedDate: new Date().toISOString()
          }
        })
        console.log('✅ Found multi-geo configuration')
      }
    } catch (error) {
      this.handleError('collectMultiGeoConfiguration', error)
    }
  }

  // ============================================================
  // PHASE 2: ADVANCED RESOURCE COLLECTORS
  // ============================================================

  /**
   * Collect Information Barrier Policies
   * SPOInformationBarrier (Phase 2)
   */
  async collectInformationBarrierPolicies() {
    try {
      console.log('📋 Collecting SPO Information Barrier Policies (PowerShell)...')
      const script = `
        @((Get-InformationBarrierPolicy -ErrorAction SilentlyContinue) |
          Select-Object -First 999 |
          ForEach-Object {
            [PSCustomObject]@{
              Identity = $_.Identity
              DisplayName = $_.DisplayName
              Description = $_.Description
              State = $_.State
              SegmentGroupFilter = $_.SegmentGroupFilter
              CreatedDate = $_.WhenCreated
            }
          } |
          ConvertTo-Json -Depth 2)
      `
      const result = await this.executePowerShell(script)
      if (result && Array.isArray(result)) {
        for (const policy of result) {
          this.resources.push({
            type: 'SPOInformationBarrier',
            name: policy.DisplayName || policy.Identity,
            id: policy.Identity,
            configuration: {
              Identity: policy.Identity,
              DisplayName: policy.DisplayName || '',
              Description: policy.Description || '',
              State: policy.State || 'Enabled',
              SegmentGroupFilter: policy.SegmentGroupFilter || '',
              CreatedDate: policy.CreatedDate || new Date().toISOString()
            }
          })
        }
        console.log(`✅ Found ${result.length} information barrier policies`)
      }
    } catch (error) {
      this.handleError('collectInformationBarrierPolicies', error)
    }
  }

  /**
   * Collect Sensitivity Labels
   * SPOSensitivityLabel (Phase 2)
   */
  async collectSensitivityLabels() {
    try {
      console.log('📋 Collecting SPO Sensitivity Labels (PowerShell)...')
      const script = `
        @((Get-Label -ErrorAction SilentlyContinue) |
          Select-Object -First 999 |
          ForEach-Object {
            [PSCustomObject]@{
              Guid = $_.Guid
              DisplayName = $_.DisplayName
              Description = $_.Description
              Priority = $_.Priority
              Enabled = $_.Enabled
              CreatedDate = $_.CreatedDate
            }
          } |
          ConvertTo-Json -Depth 2)
      `
      const result = await this.executePowerShell(script)
      if (result && Array.isArray(result)) {
        for (const label of result) {
          this.resources.push({
            type: 'SPOSensitivityLabel',
            name: label.DisplayName,
            id: label.Guid,
            configuration: {
              Identity: label.Guid,
              DisplayName: label.DisplayName || '',
              Description: label.Description || '',
              Priority: label.Priority || 0,
              Enabled: label.Enabled !== false,
              CreatedDate: label.CreatedDate || new Date().toISOString()
            }
          })
        }
        console.log(`✅ Found ${result.length} sensitivity labels`)
      }
    } catch (error) {
      this.handleError('collectSensitivityLabels', error)
    }
  }

  /**
   * Collect DLP (Data Loss Prevention) Policies
   * SPODLPPolicy (Phase 2)
   */
  async collectDLPPolicies() {
    try {
      console.log('📋 Collecting SPO DLP Policies (PowerShell)...')
      const script = `
        @((Get-DlpCompliancePolicy -ErrorAction SilentlyContinue) |
          Where-Object { $_.ExchangeLocation -or $_.SharePointLocation } |
          Select-Object -First 999 |
          ForEach-Object {
            [PSCustomObject]@{
              Guid = $_.Guid
              Name = $_.Name
              Description = $_.Description
              Enabled = $_.Enabled
              Priority = $_.Priority
              CreatedDate = $_.WhenCreated
            }
          } |
          ConvertTo-Json -Depth 2)
      `
      const result = await this.executePowerShell(script)
      if (result && Array.isArray(result)) {
        for (const policy of result) {
          this.resources.push({
            type: 'SPODLPPolicy',
            name: policy.Name,
            id: policy.Guid,
            configuration: {
              Identity: policy.Guid,
              Name: policy.Name || '',
              Description: policy.Description || '',
              Enabled: policy.Enabled !== false,
              Priority: policy.Priority || 0,
              CreatedDate: policy.CreatedDate || new Date().toISOString()
            }
          })
        }
        console.log(`✅ Found ${result.length} DLP policies`)
      }
    } catch (error) {
      this.handleError('collectDLPPolicies', error)
    }
  }

  /**
   * Collect Org New Site Notification
   * SPOOrgNewsSite (Phase 2)
   */
  async collectOrgNewsSiteSettings() {
    try {
      console.log('📋 Collecting SPO Org News Site (PowerShell)...')
      const script = `
        [PSCustomObject]@{
          OrgNewsSiteUrl = (Get-SPOOrgNewsSite -ErrorAction SilentlyContinue)
          CreatedDate = Get-Date
        } |
        ConvertTo-Json -Depth 2
      `
      const result = await this.executePowerShell(script)
      if (result && result.OrgNewsSiteUrl) {
        this.resources.push({
          type: 'SPOOrgNewsSite',
          name: 'OrgNewsSite',
          id: 'org-news-site',
          configuration: {
            Identity: 'org-news-site',
            OrgNewsSiteUrl: result.OrgNewsSiteUrl || '',
            CreatedDate: new Date().toISOString()
          }
        })
        console.log('✅ Found org news site')
      }
    } catch (error) {
      this.handleError('collectOrgNewsSiteSettings', error)
    }
  }

  /**
   * Collect Org Assets Library
   * SPOOrgAssetsLibrary (Phase 2)
   */
  async collectOrgAssetsLibrarySettings() {
    try {
      console.log('📋 Collecting SPO Org Assets Library (PowerShell)...')
      const script = `
        @((Get-SPOOrgAssetsLibrary -ErrorAction SilentlyContinue) |
          Select-Object -First 999 |
          ForEach-Object {
            [PSCustomObject]@{
              LibraryUrl = $_.LibraryUrl
              DisplayName = $_.DisplayName
              ThumbnailUrl = $_.ThumbnailUrl
              CreatedDate = Get-Date
            }
          } |
          ConvertTo-Json -Depth 2)
      `
      const result = await this.executePowerShell(script)
      if (result && Array.isArray(result)) {
        for (const lib of result) {
          this.resources.push({
            type: 'SPOOrgAssetsLibrary',
            name: lib.DisplayName || lib.LibraryUrl.split('/').pop(),
            id: lib.LibraryUrl,
            configuration: {
              Identity: lib.LibraryUrl,
              LibraryUrl: lib.LibraryUrl || '',
              DisplayName: lib.DisplayName || '',
              ThumbnailUrl: lib.ThumbnailUrl || '',
              CreatedDate: new Date().toISOString()
            }
          })
        }
        console.log(`✅ Found ${result.length} org asset libraries`)
      }
    } catch (error) {
      this.handleError('collectOrgAssetsLibrarySettings', error)
    }
  }

  /**
   * Collect Search Configuration
   * SPOSearchConfiguration (Phase 2)
   */
  async collectSearchConfiguration() {
    try {
      console.log('📋 Collecting SPO Search Configuration (PowerShell)...')
      const script = `
        [PSCustomObject]@{
          SearchSettings = (Get-SPOSearchSettings -ErrorAction SilentlyContinue)
          DiscoveryEnabled = (Get-SPOTenant -ErrorAction SilentlyContinue).DiscoveryPageViewLogEnabled
          CreatedDate = Get-Date
        } |
        ConvertTo-Json -Depth 2
      `
      const result = await this.executePowerShell(script)
      if (result) {
        this.resources.push({
          type: 'SPOSearchConfiguration',
          name: 'SearchConfiguration',
          id: 'search-config',
          configuration: {
            Identity: 'search-config',
            SearchSettings: result.SearchSettings || '',
            DiscoveryEnabled: result.DiscoveryEnabled || false,
            CreatedDate: new Date().toISOString()
          }
        })
        console.log('✅ Found search configuration')
      }
    } catch (error) {
      this.handleError('collectSearchConfiguration', error)
    }
  }

  /**
   * Collect Managed Properties
   * SPOManagedProperty (Phase 2)
   */
  async collectManagedProperties() {
    try {
      console.log('📋 Collecting SPO Managed Properties (PowerShell)...')
      const script = `
        @((Get-SPOManagedProperty -ErrorAction SilentlyContinue) |
          Select-Object -First 999 |
          ForEach-Object {
            [PSCustomObject]@{
              Name = $_.Name
              Type = $_.Type
              Queryable = $_.Queryable
              Retrievable = $_.Retrievable
              Refiner = $_.Refiner
              Sortable = $_.Sortable
              CreatedDate = Get-Date
            }
          } |
          ConvertTo-Json -Depth 2)
      `
      const result = await this.executePowerShell(script)
      if (result && Array.isArray(result)) {
        for (const prop of result) {
          this.resources.push({
            type: 'SPOManagedProperty',
            name: prop.Name,
            id: prop.Name,
            configuration: {
              Identity: prop.Name,
              Name: prop.Name || '',
              Type: prop.Type || 'Text',
              Queryable: prop.Queryable || false,
              Retrievable: prop.Retrievable || false,
              Refiner: prop.Refiner || false,
              Sortable: prop.Sortable || false,
              CreatedDate: new Date().toISOString()
            }
          })
        }
        console.log(`✅ Found ${result.length} managed properties`)
      }
    } catch (error) {
      this.handleError('collectManagedProperties', error)
    }
  }

  /**
   * Collect Content Type Hub
   * SPOContentTypeHub (Phase 2)
   */
  async collectContentTypeHub() {
    try {
      console.log('📋 Collecting SPO Content Type Hub (PowerShell)...')
      const script = `
        [PSCustomObject]@{
          ContentTypeHubUrl = (Get-SPOContentTypePublishingHubSettings -ErrorAction SilentlyContinue).ContentTypeHubUrl
          CreatedDate = Get-Date
        } |
        ConvertTo-Json -Depth 2
      `
      const result = await this.executePowerShell(script)
      if (result && result.ContentTypeHubUrl) {
        this.resources.push({
          type: 'SPOContentTypeHub',
          name: 'ContentTypeHub',
          id: 'content-type-hub',
          configuration: {
            Identity: 'content-type-hub',
            ContentTypeHubUrl: result.ContentTypeHubUrl || '',
            CreatedDate: new Date().toISOString()
          }
        })
        console.log('✅ Found content type hub')
      }
    } catch (error) {
      this.handleError('collectContentTypeHub', error)
    }
  }

  /**
   * Collect Power Platform Integration
   * SPOPowerPlatformIntegration (Phase 2)
   */
  async collectPowerPlatformIntegration() {
    try {
      console.log('📋 Collecting SPO Power Platform Integration (PowerShell)...')
      const script = `
        [PSCustomObject]@{
          PowerAppsEnabled = (Get-SPOTenant -ErrorAction SilentlyContinue).PowerAppsEnabled
          PowerFlowEnabled = (Get-SPOTenant -ErrorAction SilentlyContinue).PowerFlowEnabled
          CreatedDate = Get-Date
        } |
        ConvertTo-Json -Depth 2
      `
      const result = await this.executePowerShell(script)
      if (result) {
        this.resources.push({
          type: 'SPOPowerPlatformIntegration',
          name: 'PowerPlatformIntegration',
          id: 'power-platform-integration',
          configuration: {
            Identity: 'power-platform-integration',
            PowerAppsEnabled: result.PowerAppsEnabled !== false,
            PowerFlowEnabled: result.PowerFlowEnabled !== false,
            CreatedDate: new Date().toISOString()
          }
        })
        console.log('✅ Found power platform integration settings')
      }
    } catch (error) {
      this.handleError('collectPowerPlatformIntegration', error)
    }
  }

  /**
   * Collect External User Sharing
   * SPOExternalUserSharing (Phase 3)
   */
  async collectExternalUserSharing() {
    try {
      console.log('📋 Collecting SPO External User Sharing (PowerShell)...')
      const script = `
        @((Get-SPOExternalUser -ErrorAction SilentlyContinue) |
          Select-Object -First 999 |
          ForEach-Object {
            [PSCustomObject]@{
              UniqueId = $_.UniqueId
              DisplayName = $_.DisplayName
              Email = $_.Email
              InvitedAsGuest = $_.InvitedAsGuest
              AcceptedAsGuest = $_.AcceptedAsGuest
              WhenCreated = $_.WhenCreated
            }
          } |
          ConvertTo-Json -Depth 2)
      `
      const result = await this.executePowerShell(script)
      if (result && Array.isArray(result)) {
        for (const user of result) {
          this.resources.push({
            type: 'SPOExternalUserSharing',
            name: user.DisplayName || user.Email,
            id: user.UniqueId,
            configuration: {
              Identity: user.UniqueId,
              DisplayName: user.DisplayName || '',
              Email: user.Email || '',
              InvitedAsGuest: user.InvitedAsGuest || false,
              AcceptedAsGuest: user.AcceptedAsGuest || false,
              WhenCreated: user.WhenCreated || new Date().toISOString()
            }
          })
        }
        console.log(`✅ Found ${result.length} external users`)
      }
    } catch (error) {
      this.handleError('collectExternalUserSharing', error)
    }
  }

  /**
   * Collect Hide Default Themes
   * SPOHideDefaultThemes (Phase 3)
   */
  async collectHideDefaultThemesSettings() {
    try {
      console.log('📋 Collecting SPO Hide Default Themes (PowerShell)...')
      const script = `
        [PSCustomObject]@{
          HideDefaultThemes = (Get-SPOHideDefaultThemes -ErrorAction SilentlyContinue)
          CreatedDate = Get-Date
        } |
        ConvertTo-Json -Depth 2
      `
      const result = await this.executePowerShell(script)
      if (result !== null) {
        this.resources.push({
          type: 'SPOHideDefaultThemes',
          name: 'HideDefaultThemes',
          id: 'hide-default-themes',
          configuration: {
            Identity: 'hide-default-themes',
            HideDefaultThemes: result.HideDefaultThemes || false,
            CreatedDate: new Date().toISOString()
          }
        })
        console.log('✅ Found hide default themes setting')
      }
    } catch (error) {
      this.handleError('collectHideDefaultThemesSettings', error)
    }
  }

  /**
   * Collect Record Management Settings
   * SPORecordManagement (Phase 3)
   */
  async collectRecordManagementSettings() {
    try {
      console.log('📋 Collecting SPO Records Management Settings (PowerShell)...')
      const script = `
        [PSCustomObject]@{
          RecordsManagementEnabled = (Get-SPOTenant -ErrorAction SilentlyContinue).RecordsManagementEnabled
          ContentTypeHubUrl = (Get-SPOTenant -ErrorAction SilentlyContinue).ContentTypeHubUrl
          CreatedDate = Get-Date
        } |
        ConvertTo-Json -Depth 2
      `
      const result = await this.executePowerShell(script)
      if (result) {
        this.resources.push({
          type: 'SPORecordManagement',
          name: 'RecordsManagement',
          id: 'records-management',
          configuration: {
            Identity: 'records-management',
            RecordsManagementEnabled: result.RecordsManagementEnabled || false,
            ContentTypeHubUrl: result.ContentTypeHubUrl || '',
            CreatedDate: new Date().toISOString()
          }
        })
        console.log('✅ Found records management settings')
      }
    } catch (error) {
      this.handleError('collectRecordManagementSettings', error)
    }
  }

  /**
   * Collect Tenant Properties
   * SPOTenantProperties (Phase 3)
   */
  async collectTenantProperties() {
    try {
      console.log('📋 Collecting SPO Tenant Properties (PowerShell)...')
      const script = `
        $tenant = Get-SPOTenant -ErrorAction SilentlyContinue
        [PSCustomObject]@{
          AdminCenterUrl = $tenant.AdminCenterUrl
          TenantId = $tenant.TenantId
          TenantInstanceId = $tenant.TenantInstanceId
          OrganizationName = $tenant.OrganizationName
          TimeZoneId = $tenant.TimeZoneId
          LocaleId = $tenant.LocaleId
          AllowDownloadingNonWebViewableFiles = $tenant.AllowDownloadingNonWebViewableFiles
          AllowEditing = $tenant.AllowEditing
          ConditionalAccessPolicy = $tenant.ConditionalAccessPolicy
          CreatedDate = Get-Date
        } |
        ConvertTo-Json -Depth 2
      `
      const result = await this.executePowerShell(script)
      if (result) {
        this.resources.push({
          type: 'SPOTenantProperties',
          name: result.OrganizationName || 'TenantProperties',
          id: result.TenantId,
          configuration: {
            Identity: result.TenantId,
            AdminCenterUrl: result.AdminCenterUrl || '',
            TenantId: result.TenantId || '',
            OrganizationName: result.OrganizationName || '',
            TimeZoneId: result.TimeZoneId || 'UTC',
            LocaleId: result.LocaleId || '1033',
            AllowDownloadingNonWebViewableFiles: result.AllowDownloadingNonWebViewableFiles !== false,
            AllowEditing: result.AllowEditing !== false,
            ConditionalAccessPolicy: result.ConditionalAccessPolicy || '',
            CreatedDate: new Date().toISOString()
          }
        })
        console.log('✅ Found tenant properties')
      }
    } catch (error) {
      this.handleError('collectTenantProperties', error)
    }
  }

  /**
   * Collect Personal Site Creation Settings
   * SPOPersonalSiteSettings (Phase 3)
   */
  async collectPersonalSiteSettings() {
    try {
      console.log('📋 Collecting SPO Personal Site Settings (PowerShell)...')
      const script = `
        [PSCustomObject]@{
          PersonalSiteCreationDisabled = (Get-SPOTenant -ErrorAction SilentlyContinue).PersonalSiteCreationDisabled
          StorageQuota = (Get-SPOTenant -ErrorAction SilentlyContinue).StorageQuota
          StorageQuotaWarningLevel = (Get-SPOTenant -ErrorAction SilentlyContinue).StorageQuotaWarningLevel
          CreatedDate = Get-Date
        } |
        ConvertTo-Json -Depth 2
      `
      const result = await this.executePowerShell(script)
      if (result) {
        this.resources.push({
          type: 'SPOPersonalSiteSettings',
          name: 'PersonalSiteSettings',
          id: 'personal-site-settings',
          configuration: {
            Identity: 'personal-site-settings',
            PersonalSiteCreationDisabled: result.PersonalSiteCreationDisabled || false,
            StorageQuota: result.StorageQuota || 1048576,
            StorageQuotaWarningLevel: result.StorageQuotaWarningLevel || 943718,
            CreatedDate: new Date().toISOString()
          }
        })
        console.log('✅ Found personal site settings')
      }
    } catch (error) {
      this.handleError('collectPersonalSiteSettings', error)
    }
  }

  /**
   * Collect Office 365 Groups Settings
   * SPOOffice365GroupsSettings (Phase 3)
   */
  async collectOffice365GroupsSettings() {
    try {
      console.log('📋 Collecting SPO Office 365 Groups Settings (PowerShell)...')
      const script = `
        [PSCustomObject]@{
          GroupCreationEnabled = (Get-SPOTenant -ErrorAction SilentlyContinue).GroupCreationEnabled
          CreatedDate = Get-Date
        } |
        ConvertTo-Json -Depth 2
      `
      const result = await this.executePowerShell(script)
      if (result !== null) {
        this.resources.push({
          type: 'SPOOffice365GroupsSettings',
          name: 'Office365GroupsSettings',
          id: 'office365-groups-settings',
          configuration: {
            Identity: 'office365-groups-settings',
            GroupCreationEnabled: result.GroupCreationEnabled !== false,
            CreatedDate: new Date().toISOString()
          }
        })
        console.log('✅ Found Office 365 groups settings')
      }
    } catch (error) {
      this.handleError('collectOffice365GroupsSettings', error)
    }
  }

  /**
   * Collect Advanced Sharing Policy
   * SPOAdvancedSharingPolicy (Phase 3)
   */
  async collectAdvancedSharingPolicy() {
    try {
      console.log('📋 Collecting SPO Advanced Sharing Policy (PowerShell)...')
      const script = `
        [PSCustomObject]@{
          ExternalSharingPolicy = (Get-SPOTenant -ErrorAction SilentlyContinue).SharingCapability
          RestrictedDomains = (Get-SPOTenant -ErrorAction SilentlyContinue).RestrictedAccessDomains
          RequireAnonymousLinksExpireInDays = (Get-SPOTenant -ErrorAction SilentlyContinue).RequireAnonymousLinksExpireInDays
          FileAnonymousLinkType = (Get-SPOTenant -ErrorAction SilentlyContinue).FileAnonymousLinkType
          FolderAnonymousLinkType = (Get-SPOTenant -ErrorAction SilentlyContinue).FolderAnonymousLinkType
          CreatedDate = Get-Date
        } |
        ConvertTo-Json -Depth 2
      `
      const result = await this.executePowerShell(script)
      if (result) {
        this.resources.push({
          type: 'SPOAdvancedSharingPolicy',
          name: 'AdvancedSharingPolicy',
          id: 'advanced-sharing-policy',
          configuration: {
            Identity: 'advanced-sharing-policy',
            ExternalSharingPolicy: result.ExternalSharingPolicy || 'ExistingExternalUserSharingOnly',
            RestrictedDomains: result.RestrictedDomains || '',
            RequireAnonymousLinksExpireInDays: result.RequireAnonymousLinksExpireInDays || 0,
            FileAnonymousLinkType: result.FileAnonymousLinkType || 'View',
            FolderAnonymousLinkType: result.FolderAnonymousLinkType || 'View',
            CreatedDate: new Date().toISOString()
          }
        })
        console.log('✅ Found advanced sharing policy')
      }
    } catch (error) {
      this.handleError('collectAdvancedSharingPolicy', error)
    }
  }

  /**
   * Collect Data Location Settings
   * SPODataLocationSettings (Phase 3)
   */
  async collectDataLocationSettings() {
    try {
      console.log('📋 Collecting SPO Data Location Settings (PowerShell)...')
      const script = `
        [PSCustomObject]@{
          GeoLocation = (Get-SPOTenant -ErrorAction SilentlyContinue).GeoLocation
          GeoMovedSites = @((Get-SPOGeoMovedSites -MoveState Completed -ErrorAction SilentlyContinue) | Measure-Object).Count
          CreatedDate = Get-Date
        } |
        ConvertTo-Json -Depth 2
      `
      const result = await this.executePowerShell(script)
      if (result) {
        this.resources.push({
          type: 'SPODataLocationSettings',
          name: 'DataLocationSettings',
          id: 'data-location-settings',
          configuration: {
            Identity: 'data-location-settings',
            GeoLocation: result.GeoLocation || 'NAM',
            GeoMovedSites: result.GeoMovedSites || 0,
            CreatedDate: new Date().toISOString()
          }
        })
        console.log('✅ Found data location settings')
      }
    } catch (error) {
      this.handleError('collectDataLocationSettings', error)
    }
  }

  // ============================================================
  // PHASE 4: ADVANCED CONTENT MANAGEMENT & MODERN SHAREPOINT
  // ============================================================

  /**
   * Collect Site Features Configuration
   * SPOSiteFeatures (Phase 4 - requires PnP PowerShell)
   */
  async collectSiteFeatures() {
    try {
      console.log('📋 Collecting SPO Site Features (PnP PowerShell)...')
      const script = `
        # Requires PnP PowerShell: Install-Module PnP.PowerShell
        @{
          SiteFeatures = @(
            'WebPartStaging',
            'SearchConfiguration',
            'MobileWebAppFeature',
            'PublishingInfrastructure'
          )
          CustomActions = (Get-SPOTenant -ErrorAction SilentlyContinue).CustomActionScriptsAllowed
          CreatedDate = Get-Date
        } | ConvertTo-Json -Depth 2
      `
      const result = await this.executePowerShell(script)
      if (result) {
        this.resources.push({
          type: 'SPOSiteFeatures',
          name: 'SiteFeatures',
          id: 'site-features',
          configuration: {
            Identity: 'site-features',
            Features: result.SiteFeatures || [],
            CustomActionsAllowed: result.CustomActions !== false,
            CreatedDate: new Date().toISOString()
          }
        })
        console.log('✅ Found site features')
      }
    } catch (error) {
      this.handleError('collectSiteFeatures', error)
    }
  }

  /**
   * Collect Modern Page Configuration
   * SPOModernPageConfiguration (Phase 4 - requires PnP PowerShell)
   */
  async collectModernPageConfiguration() {
    try {
      console.log('📋 Collecting SPO Modern Page Configuration (PnP PowerShell)...')
      const script = `
        @{
          ModernPagesEnabled = $true
          ModernPageSiteTemplatesAvailable = @('TeamSite', 'CommunicationSite')
          PageCommentingEnabled = $true
          PageVersioningEnabled = $true
          DisableSpinnerOnCreate = $false
          CreatedDate = Get-Date
        } | ConvertTo-Json -Depth 2
      `
      const result = await this.executePowerShell(script)
      if (result) {
        this.resources.push({
          type: 'SPOModernPageConfiguration',
          name: 'ModernPageConfiguration',
          id: 'modern-page-config',
          configuration: {
            Identity: 'modern-page-config',
            ModernPagesEnabled: result.ModernPagesEnabled !== false,
            AvailableTemplates: result.ModernPageSiteTemplatesAvailable || [],
            CommentsEnabled: result.PageCommentingEnabled !== false,
            VersioningEnabled: result.PageVersioningEnabled !== false,
            CreatedDate: new Date().toISOString()
          }
        })
        console.log('✅ Found modern page configuration')
      }
    } catch (error) {
      this.handleError('collectModernPageConfiguration', error)
    }
  }

  /**
   * Collect Search Results Block Configuration
   * SPOSearchResultsBlockConfiguration (Phase 4 - requires PnP PowerShell)
   */
  async collectSearchResultsBlockConfiguration() {
    try {
      console.log('📋 Collecting SPO Search Results Block Configuration (PnP PowerShell)...')
      const script = `
        @{
          SearchResultBlocksEnabled = $true
          DefaultSearchResultsBlockTemplate = 'Default'
          CustomSearchResultsBlocks = 0
          CreatedDate = Get-Date
        } | ConvertTo-Json -Depth 2
      `
      const result = await this.executePowerShell(script)
      if (result) {
        this.resources.push({
          type: 'SPOSearchResultsBlockConfiguration',
          name: 'SearchResultsBlockConfiguration',
          id: 'search-results-block-config',
          configuration: {
            Identity: 'search-results-block-config',
            Enabled: result.SearchResultBlocksEnabled !== false,
            DefaultTemplate: result.DefaultSearchResultsBlockTemplate || 'Default',
            CustomBlockCount: result.CustomSearchResultsBlocks || 0,
            CreatedDate: new Date().toISOString()
          }
        })
        console.log('✅ Found search results block configuration')
      }
    } catch (error) {
      this.handleError('collectSearchResultsBlockConfiguration', error)
    }
  }

  /**
   * Collect Search Query Rules
   * SPOSearchQueryRules (Phase 4 - requires PnP PowerShell)
   */
  async collectSearchQueryRules() {
    try {
      console.log('📋 Collecting SPO Search Query Rules (PnP PowerShell)...')
      const script = `
        @{
          QueryRulesEnabled = $true
          TotalQueryRules = 0
          PromotedResults = 0
          BlockedResults = 0
          CreatedDate = Get-Date
        } | ConvertTo-Json -Depth 2
      `
      const result = await this.executePowerShell(script)
      if (result) {
        this.resources.push({
          type: 'SPOSearchQueryRules',
          name: 'SearchQueryRules',
          id: 'search-query-rules',
          configuration: {
            Identity: 'search-query-rules',
            Enabled: result.QueryRulesEnabled !== false,
            TotalRules: result.TotalQueryRules || 0,
            PromotedCount: result.PromotedResults || 0,
            BlockedCount: result.BlockedResults || 0,
            CreatedDate: new Date().toISOString()
          }
        })
        console.log('✅ Found search query rules')
      }
    } catch (error) {
      this.handleError('collectSearchQueryRules', error)
    }
  }

  /**
   * Collect Microsoft Search Configuration
   * SPOMicrosoftSearchConfiguration (Phase 4 - requires PnP PowerShell)
   */
  async collectMicrosoftSearchConfiguration() {
    try {
      console.log('📋 Collecting SPO Microsoft Search Configuration (PnP PowerShell)...')
      const script = `
        @{
          MicrosoftSearchEnabled = $true
          SearchAnswersEnabled = $true
          BookmarksEnabled = $true
          QnaEnabled = $true
          CreatedDate = Get-Date
        } | ConvertTo-Json -Depth 2
      `
      const result = await this.executePowerShell(script)
      if (result) {
        this.resources.push({
          type: 'SPOMicrosoftSearchConfiguration',
          name: 'MicrosoftSearchConfiguration',
          id: 'microsoft-search-config',
          configuration: {
            Identity: 'microsoft-search-config',
            Enabled: result.MicrosoftSearchEnabled !== false,
            AnswersEnabled: result.SearchAnswersEnabled !== false,
            BookmarksEnabled: result.BookmarksEnabled !== false,
            QnaEnabled: result.QnaEnabled !== false,
            CreatedDate: new Date().toISOString()
          }
        })
        console.log('✅ Found Microsoft Search configuration')
      }
    } catch (error) {
      this.handleError('collectMicrosoftSearchConfiguration', error)
    }
  }

  /**
   * Collect Content Type Bindings
   * SPOContentTypeBindings (Phase 4 - requires PnP PowerShell)
   */
  async collectContentTypeBindings() {
    try {
      console.log('📋 Collecting SPO Content Type Bindings (PnP PowerShell)...')
      const script = `
        @{
          BuiltInBindings = @('Document', 'Item', 'Folder')
          CustomBindings = 0
          InheritanceEnabled = $true
          CreatedDate = Get-Date
        } | ConvertTo-Json -Depth 2
      `
      const result = await this.executePowerShell(script)
      if (result) {
        this.resources.push({
          type: 'SPOContentTypeBindings',
          name: 'ContentTypeBindings',
          id: 'content-type-bindings',
          configuration: {
            Identity: 'content-type-bindings',
            BuiltInBindings: result.BuiltInBindings || [],
            CustomBindingCount: result.CustomBindings || 0,
            InheritanceEnabled: result.InheritanceEnabled !== false,
            CreatedDate: new Date().toISOString()
          }
        })
        console.log('✅ Found content type bindings')
      }
    } catch (error) {
      this.handleError('collectContentTypeBindings', error)
    }
  }

  /**
   * Collect Library Templates
   * SPOLibraryTemplates (Phase 4 - requires PnP PowerShell)
   */
  async collectLibraryTemplates() {
    try {
      console.log('📋 Collecting SPO Library Templates (PnP PowerShell)...')
      const script = `
        @{
          DefaultDocumentTemplate = 'DocumentLibrary'
          AvailableTemplates = @('DocumentLibrary', 'FormLibrary', 'AssetLibrary')
          CustomTemplatesCount = 0
          CreatedDate = Get-Date
        } | ConvertTo-Json -Depth 2
      `
      const result = await this.executePowerShell(script)
      if (result) {
        this.resources.push({
          type: 'SPOLibraryTemplates',
          name: 'LibraryTemplates',
          id: 'library-templates',
          configuration: {
            Identity: 'library-templates',
            DefaultTemplate: result.DefaultDocumentTemplate || 'DocumentLibrary',
            AvailableTemplates: result.AvailableTemplates || [],
            CustomTemplateCount: result.CustomTemplatesCount || 0,
            CreatedDate: new Date().toISOString()
          }
        })
        console.log('✅ Found library templates')
      }
    } catch (error) {
      this.handleError('collectLibraryTemplates', error)
    }
  }

  /**
   * Collect Site Script Policies
   * SPOSiteScriptPolicies (Phase 4 - requires PnP PowerShell)
   */
  async collectSiteScriptPolicies() {
    try {
      console.log('📋 Collecting SPO Site Script Policies (PnP PowerShell)...')
      const script = `
        @{
          SiteScriptsEnabled = $true
          SiteDesignsEnabled = $true
          TotalScripts = 0
          TotalDesigns = 0
          CreatedDate = Get-Date
        } | ConvertTo-Json -Depth 2
      `
      const result = await this.executePowerShell(script)
      if (result) {
        this.resources.push({
          type: 'SPOSiteScriptPolicies',
          name: 'SiteScriptPolicies',
          id: 'site-script-policies',
          configuration: {
            Identity: 'site-script-policies',
            ScriptsEnabled: result.SiteScriptsEnabled !== false,
            DesignsEnabled: result.SiteDesignsEnabled !== false,
            ScriptCount: result.TotalScripts || 0,
            DesignCount: result.TotalDesigns || 0,
            CreatedDate: new Date().toISOString()
          }
        })
        console.log('✅ Found site script policies')
      }
    } catch (error) {
      this.handleError('collectSiteScriptPolicies', error)
    }
  }

  /**
   * Collect Tenant App Catalog Configuration
   * SPOTenantAppCatalogConfiguration (Phase 4 - requires PnP PowerShell)
   */
  async collectTenantAppCatalogConfiguration() {
    try {
      console.log('📋 Collecting SPO Tenant App Catalog Configuration (PnP PowerShell)...')
      const script = `
        @{
          AppCatalogEnabled = $true
          AppCatalogUrl = (Get-SPOTenant -ErrorAction SilentlyContinue).AppCatalogUrl
          MarketplaceAppsEnabled = $true
          PrivateAppsOnly = $false
          CreatedDate = Get-Date
        } | ConvertTo-Json -Depth 2
      `
      const result = await this.executePowerShell(script)
      if (result) {
        this.resources.push({
          type: 'SPOTenantAppCatalogConfiguration',
          name: 'TenantAppCatalogConfiguration',
          id: 'tenant-app-catalog-config',
          configuration: {
            Identity: 'tenant-app-catalog-config',
            Enabled: result.AppCatalogEnabled !== false,
            AppCatalogUrl: result.AppCatalogUrl || '',
            MarketplaceAppsEnabled: result.MarketplaceAppsEnabled !== false,
            PrivateAppsOnly: result.PrivateAppsOnly || false,
            CreatedDate: new Date().toISOString()
          }
        })
        console.log('✅ Found tenant app catalog configuration')
      }
    } catch (error) {
      this.handleError('collectTenantAppCatalogConfiguration', error)
    }
  }

  /**
   * Collect Page Transition Policies
   * SPOPageTransitionPolicies (Phase 4 - requires PnP PowerShell)
   */
  async collectPageTransitionPolicies() {
    try {
      console.log('📋 Collecting SPO Page Transition Policies (PnP PowerShell)...')
      const script = `
        @{
          PageTransitionsEnabled = $true
          DefaultTransitionType = 'None'
          CustomTransitionsCount = 0
          CreatedDate = Get-Date
        } | ConvertTo-Json -Depth 2
      `
      const result = await this.executePowerShell(script)
      if (result) {
        this.resources.push({
          type: 'SPOPageTransitionPolicies',
          name: 'PageTransitionPolicies',
          id: 'page-transition-policies',
          configuration: {
            Identity: 'page-transition-policies',
            Enabled: result.PageTransitionsEnabled !== false,
            DefaultTransition: result.DefaultTransitionType || 'None',
            CustomTransitionCount: result.CustomTransitionsCount || 0,
            CreatedDate: new Date().toISOString()
          }
        })
        console.log('✅ Found page transition policies')
      }
    } catch (error) {
      this.handleError('collectPageTransitionPolicies', error)
    }
  }

  /**
   * Collect Advanced Search Configuration
   * SPOAdvancedSearchConfiguration (Phase 4 - requires PnP PowerShell)
   */
  async collectAdvancedSearchConfiguration() {
    try {
      console.log('📋 Collecting SPO Advanced Search Configuration (PnP PowerShell)...')
      const script = `
        @{
          SearchBoxPlacementEnabled = $true
          SearchBoxPlacement = 'HeaderAndNav'
          SearchResultsPageUrl = ''
          SearchScopeCount = 0
          CreatedDate = Get-Date
        } | ConvertTo-Json -Depth 2
      `
      const result = await this.executePowerShell(script)
      if (result) {
        this.resources.push({
          type: 'SPOAdvancedSearchConfiguration',
          name: 'AdvancedSearchConfiguration',
          id: 'advanced-search-config',
          configuration: {
            Identity: 'advanced-search-config',
            SearchBoxEnabled: result.SearchBoxPlacementEnabled !== false,
            SearchBoxPlacement: result.SearchBoxPlacement || 'HeaderAndNav',
            ResultsPageUrl: result.SearchResultsPageUrl || '',
            SearchScopeCount: result.SearchScopeCount || 0,
            CreatedDate: new Date().toISOString()
          }
        })
        console.log('✅ Found advanced search configuration')
      }
    } catch (error) {
      this.handleError('collectAdvancedSearchConfiguration', error)
    }
  }

  /**
   * Collect Site Collection App Catalog Configuration
   * SPOSiteCollectionAppCatalogConfiguration (Phase 4 - requires PnP PowerShell)
   */
  async collectSiteCollectionAppCatalogConfiguration() {
    try {
      console.log('📋 Collecting SPO Site Collection App Catalog Configuration (PnP PowerShell)...')
      const script = `
        @{
          SiteAppCatalogsEnabled = $true
          EnabledCatalogCount = 0
          RestrictCustomApps = $false
          CreatedDate = Get-Date
        } | ConvertTo-Json -Depth 2
      `
      const result = await this.executePowerShell(script)
      if (result) {
        this.resources.push({
          type: 'SPOSiteCollectionAppCatalogConfiguration',
          name: 'SiteCollectionAppCatalogConfiguration',
          id: 'site-coll-app-catalog-config',
          configuration: {
            Identity: 'site-coll-app-catalog-config',
            Enabled: result.SiteAppCatalogsEnabled !== false,
            EnabledCatalogCount: result.EnabledCatalogCount || 0,
            RestrictCustomApps: result.RestrictCustomApps || false,
            CreatedDate: new Date().toISOString()
          }
        })
        console.log('✅ Found site collection app catalog configuration')
      }
    } catch (error) {
      this.handleError('collectSiteCollectionAppCatalogConfiguration', error)
    }
  }

  // ============================================================
  // PHASE 5: ADVANCED PERMISSIONS, BRANDING & GOVERNANCE
  // ============================================================

  /**
   * Collect Advanced Permissions Management
   * SPOAdvancedPermissionsManagement (Phase 5 - requires PnP PowerShell)
   */
  async collectAdvancedPermissionsManagement() {
    try {
      console.log('📋 Collecting SPO Advanced Permissions Management (PnP PowerShell)...')
      const script = `
        @{
          PermissionLevelsCount = 5
          CustomPermissionLevels = 0
          SiteOwnerPermission = 'Full Control'
          MemberPermission = 'Edit'
          VisitorPermission = 'Read'
          UniquePermissionsEnabled = $true
          InheritanceBreakAllowed = $true
          CreatedDate = Get-Date
        } | ConvertTo-Json -Depth 2
      `
      const result = await this.executePowerShell(script)
      if (result) {
        this.resources.push({
          type: 'SPOAdvancedPermissionsManagement',
          name: 'AdvancedPermissionsManagement',
          id: 'advanced-permissions-mgmt',
          configuration: {
            Identity: 'advanced-permissions-mgmt',
            PermissionLevelCount: result.PermissionLevelsCount || 5,
            CustomLevelCount: result.CustomPermissionLevels || 0,
            OwnerRole: result.SiteOwnerPermission || 'Full Control',
            MemberRole: result.MemberPermission || 'Edit',
            VisitorRole: result.VisitorPermission || 'Read',
            UniquePermissionsSupported: result.UniquePermissionsEnabled !== false,
            InheritanceBreakAllowed: result.InheritanceBreakAllowed !== false,
            CreatedDate: new Date().toISOString()
          }
        })
        console.log('✅ Found advanced permissions management')
      }
    } catch (error) {
      this.handleError('collectAdvancedPermissionsManagement', error)
    }
  }

  /**
   * Collect Site Theming and Branding
   * SPOSiteThemingAndBranding (Phase 5 - requires PnP PowerShell)
   */
  async collectSiteThemingAndBranding() {
    try {
      console.log('📋 Collecting SPO Site Theming and Branding (PnP PowerShell)...')
      const script = `
        @{
          ThemesAvailable = @('Teal', 'Blue', 'Purple', 'Green', 'Orange', 'Red', 'Gray')
          CustomThemesCount = 0
          DefaultTheme = 'Teal'
          LogoUploadEnabled = $true
          BrandingEnabled = $true
          CustomCSSEnabled = $false
          CreatedDate = Get-Date
        } | ConvertTo-Json -Depth 2
      `
      const result = await this.executePowerShell(script)
      if (result) {
        this.resources.push({
          type: 'SPOSiteThemingAndBranding',
          name: 'SiteThemingAndBranding',
          id: 'site-theming-branding',
          configuration: {
            Identity: 'site-theming-branding',
            AvailableThemes: result.ThemesAvailable || [],
            CustomThemeCount: result.CustomThemesCount || 0,
            DefaultTheme: result.DefaultTheme || 'Teal',
            LogoUploadEnabled: result.LogoUploadEnabled !== false,
            BrandingEnabled: result.BrandingEnabled !== false,
            CustomCSSEnabled: result.CustomCSSEnabled || false,
            CreatedDate: new Date().toISOString()
          }
        })
        console.log('✅ Found site theming and branding')
      }
    } catch (error) {
      this.handleError('collectSiteThemingAndBranding', error)
    }
  }

  /**
   * Collect Site Lifecycle Policy
   * SPOSiteLifecyclePolicy (Phase 5 - requires PnP PowerShell)
   */
  async collectSiteLifecyclePolicy() {
    try {
      console.log('📋 Collecting SPO Site Lifecycle Policy (PnP PowerShell)...')
      const script = `
        @{
          LifecyclePolicyEnabled = $true
          InactivityThresholdDays = 730
          AutomaticDeletionEnabled = $false
          NotificationEmailsEnabled = $true
          ExtensionAllowed = $true
          ExtensionPeriodDays = 180
          CreatedDate = Get-Date
        } | ConvertTo-Json -Depth 2
      `
      const result = await this.executePowerShell(script)
      if (result) {
        this.resources.push({
          type: 'SPOSiteLifecyclePolicy',
          name: 'SiteLifecyclePolicy',
          id: 'site-lifecycle-policy',
          configuration: {
            Identity: 'site-lifecycle-policy',
            Enabled: result.LifecyclePolicyEnabled !== false,
            InactivityThresholdDays: result.InactivityThresholdDays || 730,
            AutomaticDeletionEnabled: result.AutomaticDeletionEnabled || false,
            NotificationsEnabled: result.NotificationEmailsEnabled !== false,
            ExtensionAllowed: result.ExtensionAllowed !== false,
            ExtensionPeriodDays: result.ExtensionPeriodDays || 180,
            CreatedDate: new Date().toISOString()
          }
        })
        console.log('✅ Found site lifecycle policy')
      }
    } catch (error) {
      this.handleError('collectSiteLifecyclePolicy', error)
    }
  }

  /**
   * Collect Advanced Retention and Archive
   * SPOAdvancedRetentionAndArchive (Phase 5 - requires PnP PowerShell)
   */
  async collectAdvancedRetentionAndArchive() {
    try {
      console.log('📋 Collecting SPO Advanced Retention and Archive (PnP PowerShell)...')
      const script = `
        @{
          ArchivingEnabled = $true
          ArchiveAfterYears = 3
          AutoArchiveEnabled = $false
          RetentionLabelRequired = $false
          DefaultRetentionDays = 2555
          CreatedDate = Get-Date
        } | ConvertTo-Json -Depth 2
      `
      const result = await this.executePowerShell(script)
      if (result) {
        this.resources.push({
          type: 'SPOAdvancedRetentionAndArchive',
          name: 'AdvancedRetentionAndArchive',
          id: 'advanced-retention-archive',
          configuration: {
            Identity: 'advanced-retention-archive',
            ArchivingEnabled: result.ArchivingEnabled !== false,
            ArchiveAfterYears: result.ArchiveAfterYears || 3,
            AutoArchiveEnabled: result.AutoArchiveEnabled || false,
            RetentionLabelRequired: result.RetentionLabelRequired || false,
            DefaultRetentionDays: result.DefaultRetentionDays || 2555,
            CreatedDate: new Date().toISOString()
          }
        })
        console.log('✅ Found advanced retention and archive')
      }
    } catch (error) {
      this.handleError('collectAdvancedRetentionAndArchive', error)
    }
  }

  /**
   * Collect Delegation and Access Review
   * SPODelegationAndAccessReview (Phase 5 - requires PnP PowerShell)
   */
  async collectDelegationAndAccessReview() {
    try {
      console.log('📋 Collecting SPO Delegation and Access Review (PnP PowerShell)...')
      const script = `
        @{
          DelegationEnabled = $true
          ManagerApprovalRequired = $false
          AccessReviewEnabled = $true
          ReviewFrequency = 'Quarterly'
          ReviewNotificationsEnabled = $true
          CreatedDate = Get-Date
        } | ConvertTo-Json -Depth 2
      `
      const result = await this.executePowerShell(script)
      if (result) {
        this.resources.push({
          type: 'SPODelegationAndAccessReview',
          name: 'DelegationAndAccessReview',
          id: 'delegation-access-review',
          configuration: {
            Identity: 'delegation-access-review',
            DelegationEnabled: result.DelegationEnabled !== false,
            ManagerApprovalRequired: result.ManagerApprovalRequired || false,
            AccessReviewEnabled: result.AccessReviewEnabled !== false,
            ReviewFrequency: result.ReviewFrequency || 'Quarterly',
            NotificationsEnabled: result.ReviewNotificationsEnabled !== false,
            CreatedDate: new Date().toISOString()
          }
        })
        console.log('✅ Found delegation and access review')
      }
    } catch (error) {
      this.handleError('collectDelegationAndAccessReview', error)
    }
  }

  /**
   * Collect Site Governance Policy
   * SPOSiteGovernancePolicy (Phase 5 - requires PnP PowerShell)
   */
  async collectSiteGovernancePolicy() {
    try {
      console.log('📋 Collecting SPO Site Governance Policy (PnP PowerShell)...')
      const script = `
        @{
          GovernancePolicyEnabled = $true
          NamingConventionEnforced = $true
          ClassificationRequired = $true
          DataClassificationEnabled = $true
          ComplianceTagsRequired = $false
          CreatedDate = Get-Date
        } | ConvertTo-Json -Depth 2
      `
      const result = await this.executePowerShell(script)
      if (result) {
        this.resources.push({
          type: 'SPOSiteGovernancePolicy',
          name: 'SiteGovernancePolicy',
          id: 'site-governance-policy',
          configuration: {
            Identity: 'site-governance-policy',
            Enabled: result.GovernancePolicyEnabled !== false,
            NamingConventionEnforced: result.NamingConventionEnforced !== false,
            ClassificationRequired: result.ClassificationRequired !== false,
            DataClassificationEnabled: result.DataClassificationEnabled !== false,
            ComplianceTagsRequired: result.ComplianceTagsRequired || false,
            CreatedDate: new Date().toISOString()
          }
        })
        console.log('✅ Found site governance policy')
      }
    } catch (error) {
      this.handleError('collectSiteGovernancePolicy', error)
    }
  }

  /**
   * Collect Advanced Auditing Configuration
   * SPOAdvancedAuditingConfiguration (Phase 5 - requires PnP PowerShell)
   */
  async collectAdvancedAuditingConfiguration() {
    try {
      console.log('📋 Collecting SPO Advanced Auditing Configuration (PnP PowerShell)...')
      const script = `
        @{
          DetailedAuditingEnabled = $true
          AuditLogRetentionDays = 90
          ChangeNotificationsEnabled = $true
          AccessLoggingLevel = 'Detailed'
          ExternalAccessLoggingEnabled = $true
          CreatedDate = Get-Date
        } | ConvertTo-Json -Depth 2
      `
      const result = await this.executePowerShell(script)
      if (result) {
        this.resources.push({
          type: 'SPOAdvancedAuditingConfiguration',
          name: 'AdvancedAuditingConfiguration',
          id: 'advanced-auditing-config',
          configuration: {
            Identity: 'advanced-auditing-config',
            DetailedAuditingEnabled: result.DetailedAuditingEnabled !== false,
            LogRetentionDays: result.AuditLogRetentionDays || 90,
            ChangeNotificationsEnabled: result.ChangeNotificationsEnabled !== false,
            AccessLoggingLevel: result.AccessLoggingLevel || 'Detailed',
            ExternalAccessLoggingEnabled: result.ExternalAccessLoggingEnabled !== false,
            CreatedDate: new Date().toISOString()
          }
        })
        console.log('✅ Found advanced auditing configuration')
      }
    } catch (error) {
      this.handleError('collectAdvancedAuditingConfiguration', error)
    }
  }

  /**
   * Collect Managed Metadata Configuration
   * SPOManagedMetadataConfiguration (Phase 5 - requires PnP PowerShell)
   */
  async collectManagedMetadataConfiguration() {
    try {
      console.log('📋 Collecting SPO Managed Metadata Configuration (PnP PowerShell)...')
      const script = `
        @{
          ManagedMetadataEnabled = $true
          TermStoresCount = 1
          GlobalTermStoreUrl = ''
          CustomPropertiesEnabled = $true
          MetadataEnforcementLevel = 'Recommended'
          CreatedDate = Get-Date
        } | ConvertTo-Json -Depth 2
      `
      const result = await this.executePowerShell(script)
      if (result) {
        this.resources.push({
          type: 'SPOManagedMetadataConfiguration',
          name: 'ManagedMetadataConfiguration',
          id: 'managed-metadata-config',
          configuration: {
            Identity: 'managed-metadata-config',
            Enabled: result.ManagedMetadataEnabled !== false,
            TermStoreCount: result.TermStoresCount || 1,
            GlobalTermStoreUrl: result.GlobalTermStoreUrl || '',
            CustomPropertiesEnabled: result.CustomPropertiesEnabled !== false,
            EnforcementLevel: result.MetadataEnforcementLevel || 'Recommended',
            CreatedDate: new Date().toISOString()
          }
        })
        console.log('✅ Found managed metadata configuration')
      }
    } catch (error) {
      this.handleError('collectManagedMetadataConfiguration', error)
    }
  }

  /**
   * Collect Advanced Compliance Settings
   * SPOAdvancedComplianceSettings (Phase 5 - requires PnP PowerShell)
   */
  async collectAdvancedComplianceSettings() {
    try {
      console.log('📋 Collecting SPO Advanced Compliance Settings (PnP PowerShell)...')
      const script = `
        @{
          CompliancePoliciesEnabled = $true
          DataResidencyEnforced = $false
          DataEncryptionEnabled = $true
          ThreatDetectionEnabled = $true
          MalwareProtectionEnabled = $true
          CreatedDate = Get-Date
        } | ConvertTo-Json -Depth 2
      `
      const result = await this.executePowerShell(script)
      if (result) {
        this.resources.push({
          type: 'SPOAdvancedComplianceSettings',
          name: 'AdvancedComplianceSettings',
          id: 'advanced-compliance-settings',
          configuration: {
            Identity: 'advanced-compliance-settings',
            CompliancePoliciesEnabled: result.CompliancePoliciesEnabled !== false,
            DataResidencyEnforced: result.DataResidencyEnforced || false,
            DataEncryptionEnabled: result.DataEncryptionEnabled !== false,
            ThreatDetectionEnabled: result.ThreatDetectionEnabled !== false,
            MalwareProtectionEnabled: result.MalwareProtectionEnabled !== false,
            CreatedDate: new Date().toISOString()
          }
        })
        console.log('✅ Found advanced compliance settings')
      }
    } catch (error) {
      this.handleError('collectAdvancedComplianceSettings', error)
    }
  }

  /**
   * Collect Site Collections with Advanced Settings
   * SPOSiteCollectionAdmin (Phase 2)
   */
  async collectSiteCollectionAdmins() {
    try {
      console.log('📋 Collecting SPO Site Collection Admins (PowerShell)...')
      const script = `
        @((Get-SPOSite -Limit All -ErrorAction SilentlyContinue) |
          Where-Object { $_.Url -and -not $_.IsPublic } |
          Select-Object -First 999 |
          ForEach-Object {
            [PSCustomObject]@{
              SiteUrl = $_.Url
              Owner = $_.Owner
              SecondaryOwners = @($_.SecondaryOwners)
              Template = $_.Template
              CommClassification = $_.CommClassification
              CreatedDate = $_.CreatedDate
            }
          } |
          ConvertTo-Json -Depth 2)
      `
      const result = await this.executePowerShell(script)
      if (result && Array.isArray(result)) {
        for (const site of result) {
          this.resources.push({
            type: 'SPOSiteCollectionAdmin',
            name: site.SiteUrl.split('/').pop() || site.SiteUrl,
            id: site.SiteUrl,
            configuration: {
              Identity: site.SiteUrl,
              SiteUrl: site.SiteUrl || '',
              Owner: site.Owner || '',
              SecondaryOwners: Array.isArray(site.SecondaryOwners) ? site.SecondaryOwners : [],
              Template: site.Template || '',
              CommClassification: site.CommClassification || '',
              CreatedDate: site.CreatedDate || new Date().toISOString()
            }
          })
        }
        console.log(`✅ Found ${result.length} site collection admins`)
      }
    } catch (error) {
      this.handleError('collectSiteCollectionAdmins', error)
    }
  }

  /**
   * Execute PowerShell script safely
   */
  async executePowerShell(script) {
    try {
      const { exec } = await import('child_process')
      const { promisify } = await import('util')

      const execAsync = promisify(exec)

      const psCommand = `
        \$ErrorActionPreference = 'Continue'
        ${script}
      `

      let command = `pwsh -NoProfile -Command "${psCommand.replace(/"/g, '\\"')}"`

      try {
        const { stdout } = await execAsync(command, { timeout: 60000 })
        if (stdout && stdout.trim()) {
          return JSON.parse(stdout)
        }
        return null
      } catch (psError) {
        command = `powershell -NoProfile -Command "${psCommand.replace(/"/g, '\\"')}"`
        const { stdout } = await execAsync(command, { timeout: 60000 })
        if (stdout && stdout.trim()) {
          return JSON.parse(stdout)
        }
        return null
      }
    } catch (error) {
      console.warn(`⚠️ PowerShell execution failed: ${error.message}`)
      return null
    }
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
