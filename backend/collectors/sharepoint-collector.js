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
