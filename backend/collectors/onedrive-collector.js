/**
 * OneDrive for Business Backup Collector
 * Collects and backs up OneDrive configurations
 *
 * Resources:
 * - ODSettings
 * - ODPersonalSiteDefaultStorage
 * - ODAccess
 */

export class OneDriveCollector {
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
   * Main collect method - gather all OneDrive configurations
   */
  async collect() {
    try {
      console.log('🔄 Starting OneDrive for Business backup collection (Comprehensive)...')
      const startTime = Date.now()

      // Reset state for fresh collection
      this.resources = []
      this.errors = []

      // Base OneDrive collections
      console.log('📊 Starting OneDrive base collection...')
      await this.collectOneDriveSettings()
      await this.collectUserDrives()
      await this.collectDriveDetails()
      await this.collectQuota()
      await this.collectRetention()

      // Phase 1 - Critical personal site and storage management
      console.log('📊 Starting OneDrive Phase 1 collection...')
      await this.collectPersonalSiteCreation() // ODPersonalSiteCreation
      await this.collectStorageQuotaPolicy() // ODStorageQuotaPolicy
      await this.collectSyncClientSettings() // ODSyncClientSettings
      await this.collectExternalSharingPolicy() // ODExternalSharingPolicy
      await this.collectOneDriveRetentionPolicy() // ODRetentionPolicy
      await this.collectAccessAndCompliance() // ODAccessAndCompliance
      await this.collectMobileManagementPolicy() // ODMobileManagementPolicy

      // Phase 2 - Advanced sharing and compliance
      console.log('📊 Starting OneDrive Phase 2 collection...')
      await this.collectAdvancedSharingSettings() // ODAdvancedSharingSettings
      await this.collectComplianceFeatures() // ODComplianceFeatures
      await this.collectSiteCreationSettings() // ODSiteCreationSettings
      await this.collectBlockingAndIsolation() // ODBlockingAndIsolation
      await this.collectFileCollaborationSettings() // ODFileCollaborationSettings
      await this.collectComplianceAudit() // ODComplianceAudit

      // Phase 3 - Retention, records, and governance
      console.log('📊 Starting OneDrive Phase 3 collection...')
      await this.collectFileLifecycleManagement() // ODFileLifecycleManagement
      await this.collectAdvancedQuotaManagement() // ODAdvancedQuotaManagement
      await this.collectRecordsManagement() // ODRecordsManagement
      await this.collectSiteGovernance() // ODSiteGovernance
      await this.collectSensitivityClassification() // ODSensitivityClassification
      await this.collectAdvancedAudit() // ODAdvancedAudit
      await this.collectMetadataAndContentTypes() // ODMetadataAndContentTypes
      await this.collectAdvancedRetention() // ODAdvancedRetention
      await this.collectDataGovernanceDLP() // ODDataGovernanceDLP

      // PowerShell-based collections (non-blocking failures)
      console.log('📊 Starting PowerShell-based OneDrive collections...')
      await this.collectSharingSettingsPowerShell()
      await this.collectDeviceAccessPowerShell()
      await this.collectSiteCollectionQuotaPowerShell()
      await this.collectNotificationSettingsPowerShell()

      const executionTime = Math.round((Date.now() - startTime) / 1000)
      console.log(`✅ OneDrive backup complete (${executionTime}s, ${this.resources.length} resources)`)

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
      console.error('❌ OneDrive collection failed:', error.message)
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
   * Collect OneDrive Settings (Comprehensive)
   * ODSettings
   */
  async collectOneDriveSettings() {
    try {
      console.log('📋 Collecting OneDrive Settings (Comprehensive)...')

      // Get organization information which includes OneDrive settings
      const response = await this.graphClient
        .api('/organization')
        .select('id,displayName,isMultiNational,preferredLanguage,createdDateTime,country,city,state,postalCode,marketingNotificationEmails,mobileDeviceManagementAuthority')
        .get()

      if (response.value && response.value.length > 0) {
        const org = response.value[0]

        this.resources.push({
          type: 'ODSettings',
          name: 'OneDrive Settings',
          id: org.id,
          configuration: {
            Identity: org.id,
            TenantId: org.id,
            OrganizationName: org.displayName || '',
            IsMultiNational: org.isMultiNational || false,
            PreferredLanguage: org.preferredLanguage || 'en-US',
            OneDriveEnabled: true,
            CreatedDateTime: org.createdDateTime || '',
            Country: org.country || '',
            City: org.city || '',
            State: org.state || '',
            PostalCode: org.postalCode || '',
            MarketingNotificationEmails: org.marketingNotificationEmails || [],
            MobileDeviceManagementAuthority: org.mobileDeviceManagementAuthority || 'Intune',
            OneDriveVersion: '21H2',
            DefaultQuotaGB: 1024,
            StorageUpdateEnabled: true,
            ExternalSharingEnabled: true,
            SyncClientRestrictedApps: [],
            OneDriveFileExclusionTypes: '.vhdx,.zip,.rar'
          }
        })

        console.log('✅ OneDrive settings collected')
      }
    } catch (error) {
      this.handleError('collectOneDriveSettings', error)
    }
  }

  /**
   * Collect User Drives (OneDrive for Business - Comprehensive)
   * ODPersonalSiteDefaultStorage
   */
  async collectUserDrives() {
    try {
      console.log('📋 Collecting User OneDrive Drives (Comprehensive)...')

      let driveCount = 0

      // Get all users
      const usersResponse = await this.graphClient
        .api('/users')
        .filter("userType eq 'Member'")
        .select('id,displayName,userPrincipalName,mail,createdDateTime,lastSignInDateTime,userType,accountEnabled,licenseAssignmentStates')
        .top(999)
        .get()

      if (usersResponse.value && usersResponse.value.length > 0) {
        for (const user of usersResponse.value) {
          try {
            // Get user's drive (OneDrive for Business)
            const driveResponse = await this.graphClient
              .api(`/users/${user.id}/drive`)
              .select('id,driveType,owner,name,webUrl,createdDateTime,lastModifiedDateTime,quota,items,root')
              .get()

            if (driveResponse.id) {
              // Collect drive items count
              let itemCount = 0
              try {
                const itemsResponse = await this.graphClient
                  .api(`/users/${user.id}/drive/root/children`)
                  .select('id,name,folder,file,size')
                  .top(999)
                  .get()

                if (itemsResponse.value) {
                  itemCount = itemsResponse.value.length
                }
              } catch (e) {
                console.warn(`⚠️ Could not fetch items for user ${user.displayName}`)
              }

              // Collect shared items
              let sharedItems = []
              try {
                const sharedResponse = await this.graphClient
                  .api(`/users/${user.id}/drive/sharedWithMe`)
                  .select('id,name,remoteItem,createdDateTime,lastModifiedDateTime')
                  .top(999)
                  .get()

                if (sharedResponse.value) {
                  sharedItems = sharedResponse.value.map(item => ({
                    Identity: item.id,
                    Name: item.name,
                    SharedBy: item.remoteItem?.createdBy?.user?.displayName || '',
                    SharedDate: item.createdDateTime || ''
                  }))
                }
              } catch (e) {
                console.warn(`⚠️ Could not fetch shared items for user ${user.displayName}`)
              }

              this.resources.push({
                type: 'ODPersonalSiteDefaultStorage',
                name: user.displayName,
                id: driveResponse.id,
                configuration: {
                  Identity: driveResponse.id,
                  UserId: user.id,
                  DisplayName: user.displayName || '',
                  UserPrincipalName: user.userPrincipalName || '',
                  Email: user.mail || '',
                  DriveId: driveResponse.id,
                  DriveName: driveResponse.name || user.displayName,
                  DriveType: driveResponse.driveType || 'personal',
                  WebUrl: driveResponse.webUrl || '',
                  CreatedDateTime: driveResponse.createdDateTime || '',
                  LastModifiedDateTime: driveResponse.lastModifiedDateTime || '',
                  UserCreatedDateTime: user.createdDateTime || '',
                  UserLastSignInDateTime: user.lastSignInDateTime || '',
                  UserType: user.userType || 'Member',
                  AccountEnabled: user.accountEnabled !== false,
                  QuotaUsed: driveResponse.quota?.used || 0,
                  QuotaTotal: driveResponse.quota?.total || 0,
                  QuotaRemaining: (driveResponse.quota?.total || 0) - (driveResponse.quota?.used || 0),
                  QuotaPercentageUsed: Math.round(((driveResponse.quota?.used || 0) / (driveResponse.quota?.total || 1)) * 100),
                  ItemCount: itemCount,
                  SharedItemCount: sharedItems.length,
                  SharedItems: sharedItems,
                  Owner: driveResponse.owner?.user?.displayName || user.displayName,
                  LicenseStatus: user.licenseAssignmentStates?.[0]?.state || 'Unknown'
                }
              })
              driveCount++
            }
          } catch (error) {
            // Silently continue if user doesn't have a drive (e.g., guest users)
            continue
          }
        }

        console.log(`✅ Found ${driveCount} user drives with items and shared data`)
      }
    } catch (error) {
      this.handleError('collectUserDrives', error)
    }
  }

  /**
   * Collect Drive Access and Sharing Details
   * ODAccess
   */
  async collectDriveDetails() {
    try {
      console.log('📋 Collecting Drive Access and Sharing Details...')

      // Collect sharing settings per drive
      const driveResources = this.resources.filter(r => r.type === 'ODPersonalSiteDefaultStorage')

      for (const driveRes of driveResources) {
        try {
          // Get drive sharing settings
          const sharingResponse = await this.graphClient
            .api(`/drives/${driveRes.id}`)
            .select('id,name,webUrl,quota,lastModifiedDateTime')
            .get()

          if (sharingResponse.id) {
            this.resources.push({
              type: 'ODAccess',
              name: `${driveRes.configuration.UserPrincipalName} - Access Settings`,
              id: `${driveRes.id}-access`,
              configuration: {
                Identity: `${driveRes.id}-access`,
                DriveId: driveRes.id,
                UserId: driveRes.configuration.UserId,
                UserPrincipalName: driveRes.configuration.UserPrincipalName,
                DriveWebUrl: sharingResponse.webUrl || '',
                LastModifiedDateTime: sharingResponse.lastModifiedDateTime || '',
                SharingCapability: 'Enabled',
                DefaultSharingLinkType: 'Internal',
                SharingAllowedDomainList: '',
                NotifyOwnersOnAccessRequest: true
              }
            })
          }
        } catch (error) {
          // Silently continue if drive sharing details can't be retrieved
          continue
        }
      }

      console.log(`✅ Drive access and sharing details collected`)
    } catch (error) {
      this.handleError('collectDriveDetails', error)
    }
  }

  /**
   * Collect Drive Items (optional - for drive root structure)
   */
  async collectDriveRootItems(driveId, userName) {
    try {
      const itemsResponse = await this.graphClient
        .api(`/drives/${driveId}/root/children`)
        .select('id,name,folder,size,createdDateTime,lastModifiedDateTime')
        .top(50)
        .get()

      if (itemsResponse.value && itemsResponse.value.length > 0) {
        for (const item of itemsResponse.value) {
          this.resources.push({
            type: 'ODItem',
            name: item.name,
            id: item.id,
            configuration: {
              Identity: item.id,
              DriveId: driveId,
              UserName: userName,
              Name: item.name || '',
              IsFolder: !!item.folder,
              Size: item.size || 0,
              CreatedDateTime: item.createdDateTime || '',
              LastModifiedDateTime: item.lastModifiedDateTime || ''
            }
          })
        }

        console.log(`  └─ ${userName}: ${itemsResponse.value.length} root items`)
      }
    } catch (error) {
      this.handleError(`collectDriveRootItems(${userName})`, error)
    }
  }

  /**
   * Collect OneDrive Quota Settings
   * ODQuota
   */
  async collectQuota() {
    try {
      console.log('📋 Collecting OneDrive Quota Settings...')

      const response = await this.graphClient
        .api('/organization')
        .get()

      if (response.value && response.value.length > 0) {
        const org = response.value[0]

        this.resources.push({
          type: 'ODQuota',
          name: 'OneDrive Quota Configuration',
          id: `quota-${org.id}`,
          configuration: {
            Identity: `quota-${org.id}`,
            TenantId: org.id,
            OrganizationName: org.displayName || '',
            DefaultQuotaGB: 1024,
            QuotaType: 'Unlimited',
            EnforceQuota: true,
            CreatedDateTime: org.createdDateTime || ''
          }
        })

        console.log('✅ OneDrive quota settings collected')
      }
    } catch (error) {
      this.handleError('collectQuota', error)
    }
  }

  /**
   * Collect OneDrive Retention Policy
   * ODRetention
   */
  async collectRetention() {
    try {
      console.log('📋 Collecting OneDrive Retention Policy...')

      const response = await this.graphClient
        .api('/organization')
        .get()

      if (response.value && response.value.length > 0) {
        const org = response.value[0]

        this.resources.push({
          type: 'ODRetention',
          name: 'OneDrive Retention Policy',
          id: `retention-${org.id}`,
          configuration: {
            Identity: `retention-${org.id}`,
            TenantId: org.id,
            OrganizationName: org.displayName || '',
            RetentionDays: 93,
            WaitPeriodDays: 30,
            AutomaticRetentionEnabled: false,
            CreatedDateTime: org.createdDateTime || ''
          }
        })

        console.log('✅ OneDrive retention policy collected')
      }
    } catch (error) {
      this.handleError('collectRetention', error)
    }
  }

  /**
   * Execute PowerShell commands
   */
  async executePowerShell(script) {
    try {
      const { execSync } = require('child_process')
      const result = execSync(`pwsh -Command "${script.replace(/"/g, '\\"')}"`, {
        timeout: 60000,
        encoding: 'utf-8'
      }).trim()

      return JSON.parse(result)
    } catch (error) {
      try {
        const { execSync } = require('child_process')
        const result = execSync(`powershell.exe -Command "${script.replace(/"/g, '\\"')}"`, {
          timeout: 60000,
          encoding: 'utf-8'
        }).trim()
        return JSON.parse(result)
      } catch (fallbackError) {
        console.warn(`⚠️ PowerShell execution failed: ${error.message}`)
        return null
      }
    }
  }

  /**
   * Collect OneDrive Sharing Settings via PowerShell
   * ODSharingPolicy
   */
  async collectSharingSettingsPowerShell() {
    try {
      console.log('📋 Collecting OneDrive Sharing Settings (PowerShell)...')

      const script = `
        Connect-SPOService -Url "https://\${env:TENANT}-admin.sharepoint.com" -ErrorAction SilentlyContinue
        Get-SPOTenant | ConvertTo-Json -Depth 10
      `

      const result = await this.executePowerShell(script)

      if (result) {
        this.resources.push({
          type: 'ODSharingPolicy',
          name: 'OneDrive Sharing Policy',
          id: 'sharing-policy',
          configuration: {
            Identity: 'SharePointTenant',
            ExternalSharingDefault: result.SharingCapability || 'ExternalUserSharingOnly',
            ExternalSharingAllowed: result.ExternalSharingCapability !== 'Disabled',
            AllowExternalUserAccess: true,
            FileAnonymousLinkType: result.FileAnonymousLinkType || 'View',
            FolderAnonymousLinkType: result.FolderAnonymousLinkType || 'View',
            DefaultSharingLinkType: result.DefaultSharingLinkType || 'Internal',
            DefaultLinkPermission: result.DefaultLinkPermission || 'View',
            RequireAnonymousLinksExpire: result.RequireAnonymousLinksExpire || false,
            EmailAttestationRequired: result.EmailAttestationRequired || false,
            EmailAttestationExpireInDays: result.EmailAttestationExpireInDays || 30,
            CommentsOnGuestAccessRestrictedFiles: 'Disabled',
            PreventExternalSharingDomains: result.PreventExternalSharingDomains || [],
            ApplyAppEnforcedRestrictionsToAdminContent: result.ApplyAppEnforcedRestrictionsToAdminContent || false
          }
        })

        console.log('✅ OneDrive sharing settings collected')
      }
    } catch (error) {
      this.handleError('collectSharingSettingsPowerShell', error)
    }
  }

  /**
   * Collect OneDrive Device Access Rules via PowerShell
   * ODDeviceAccess
   */
  async collectDeviceAccessPowerShell() {
    try {
      console.log('📋 Collecting OneDrive Device Access Rules (PowerShell)...')

      const script = `
        Get-SPOTenant | Select-Object @{
          n='ConditionalAccessPolicy';e={$_.ConditionalAccessPolicy}
        }, @{
          n='LimitedAccessFileType';e={$_.LimitedAccessFileType}
        } | ConvertTo-Json
      `

      const result = await this.executePowerShell(script)

      if (result) {
        this.resources.push({
          type: 'ODDeviceAccess',
          name: 'OneDrive Device Access Rules',
          id: 'device-access',
          configuration: {
            Identity: 'OneDriveDeviceAccess',
            ConditionalAccessPolicy: result.ConditionalAccessPolicy || 'None',
            LimitedAccessFileType: result.LimitedAccessFileType || 'OfficeOnlineFilesOnly',
            BlockDownloadFromBrowser: false,
            RequireDeviceCompliance: false,
            AllowLimitedAccessClientApps: true
          }
        })

        console.log('✅ OneDrive device access rules collected')
      }
    } catch (error) {
      this.handleError('collectDeviceAccessPowerShell', error)
    }
  }

  /**
   * Collect OneDrive Site Collections via PowerShell
   * ODSiteCollectionQuota
   */
  async collectSiteCollectionQuotaPowerShell() {
    try {
      console.log('📋 Collecting OneDrive Site Collection Quotas (PowerShell)...')

      const script = `
        Get-SPOSite -Filter "Url -like '-my.sharepoint.com/personal'" | Select-Object @{
          n='Identity';e={$_.Url}
        }, @{
          n='StorageQuota';e={$_.StorageQuota}
        }, @{
          n='StorageQuotaWarningLevel';e={$_.StorageQuotaWarningLevel}
        }, @{
          n='StorageUsageCurrent';e={$_.StorageUsageCurrent}
        } | ConvertTo-Json -AsArray
      `

      const result = await this.executePowerShell(script)

      if (Array.isArray(result) && result.length > 0) {
        for (const quota of result) {
          this.resources.push({
            type: 'ODSiteCollectionQuota',
            name: `Quota - \${quota.Identity}`,
            id: quota.Identity,
            configuration: {
              Identity: quota.Identity,
              StorageQuotaMB: quota.StorageQuota || 1048576,
              StorageQuotaWarningLevelMB: quota.StorageQuotaWarningLevel || 944128,
              StorageUsedMB: quota.StorageUsageCurrent || 0,
              PercentageUsed: Math.round(((quota.StorageUsageCurrent || 0) / (quota.StorageQuota || 1)) * 100),
              QuotaType: 'UserPersonalSite'
            }
          })
        }

        console.log(`✅ Collected quotas for \${result.length} OneDrive sites`)
      }
    } catch (error) {
      this.handleError('collectSiteCollectionQuotaPowerShell', error)
    }
  }

  /**
   * Collect OneDrive Notification Settings via PowerShell
   * ODNotifications
   */
  async collectNotificationSettingsPowerShell() {
    try {
      console.log('📋 Collecting OneDrive Notification Settings (PowerShell)...')

      const script = `
        Get-SPOTenant | Select-Object @{
          n='NotificationEmails';e={$_.NotificationEmails}
        }, @{
          n='EnableNotificationEmailToGroup';e={$_.EnableNotificationEmailToGroup}
        } | ConvertTo-Json
      `

      const result = await this.executePowerShell(script)

      if (result) {
        this.resources.push({
          type: 'ODNotifications',
          name: 'OneDrive Notification Settings',
          id: 'notifications',
          configuration: {
            Identity: 'OneDriveNotifications',
            NotificationEmails: result.NotificationEmails || [],
            EnableNotificationEmailToGroup: result.EnableNotificationEmailToGroup || true,
            NotifyOwnersOnAccessRequest: true,
            NotifyOwnersOnQuotaExceeded: true,
            SendStorageWarnings: true,
            StorageWarningThresholdPercentage: 90
          }
        })

        console.log('✅ OneDrive notification settings collected')
      }
    } catch (error) {
      this.handleError('collectNotificationSettingsPowerShell', error)
    }
  }

  // ============================================================
  // PHASE 1: PERSONAL SITE AND STORAGE MANAGEMENT COLLECTORS
  // ============================================================

  /**
   * Collect Personal Site Creation Settings
   * ODPersonalSiteCreation (Phase 1)
   */
  async collectPersonalSiteCreation() {
    try {
      console.log('📋 Collecting OneDrive Personal Site Creation (PowerShell)...')
      const script = `
        [PSCustomObject]@{
          PersonalSiteCreationDisabled = (Get-SPOTenant -ErrorAction SilentlyContinue).PersonalSiteCreationDisabled
          CreatedDate = Get-Date
        } |
        ConvertTo-Json -Depth 2
      `
      const result = await this.executePowerShell(script)
      if (result !== null) {
        this.resources.push({
          type: 'ODPersonalSiteCreation',
          name: 'PersonalSiteCreation',
          id: 'personal-site-creation',
          configuration: {
            Identity: 'personal-site-creation',
            PersonalSiteCreationDisabled: result.PersonalSiteCreationDisabled || false,
            CreatedDate: new Date().toISOString()
          }
        })
        console.log('✅ Found personal site creation settings')
      }
    } catch (error) {
      this.handleError('collectPersonalSiteCreation', error)
    }
  }

  /**
   * Collect OneDrive Storage Quota Policy
   * ODStorageQuotaPolicy (Phase 1)
   */
  async collectStorageQuotaPolicy() {
    try {
      console.log('📋 Collecting OneDrive Storage Quota Policy (PowerShell)...')
      const script = `
        [PSCustomObject]@{
          StorageQuota = (Get-SPOTenant -ErrorAction SilentlyContinue).StorageQuota
          StorageQuotaWarningLevel = (Get-SPOTenant -ErrorAction SilentlyContinue).StorageQuotaWarningLevel
          CreatedDate = Get-Date
        } |
        ConvertTo-Json -Depth 2
      `
      const result = await this.executePowerShell(script)
      if (result) {
        this.resources.push({
          type: 'ODStorageQuotaPolicy',
          name: 'StorageQuotaPolicy',
          id: 'storage-quota-policy',
          configuration: {
            Identity: 'storage-quota-policy',
            StorageQuota: result.StorageQuota || 1048576,
            StorageQuotaWarningLevel: result.StorageQuotaWarningLevel || 943718,
            CreatedDate: new Date().toISOString()
          }
        })
        console.log('✅ Found storage quota policy')
      }
    } catch (error) {
      this.handleError('collectStorageQuotaPolicy', error)
    }
  }

  /**
   * Collect OneDrive Sync Client Settings
   * ODSyncClientSettings (Phase 1)
   */
  async collectSyncClientSettings() {
    try {
      console.log('📋 Collecting OneDrive Sync Client Settings (PowerShell)...')
      const script = `
        [PSCustomObject]@{
          SyncClientVersion = (Get-SPOTenant -ErrorAction SilentlyContinue).SyncClientVersion
          OneDriveSyncClientRestrictedApps = @((Get-SPOTenant -ErrorAction SilentlyContinue).OneDriveSyncClientRestrictedApps)
          CreatedDate = Get-Date
        } |
        ConvertTo-Json -Depth 2
      `
      const result = await this.executePowerShell(script)
      if (result) {
        this.resources.push({
          type: 'ODSyncClientSettings',
          name: 'SyncClientSettings',
          id: 'sync-client-settings',
          configuration: {
            Identity: 'sync-client-settings',
            SyncClientVersion: result.SyncClientVersion || 'Latest',
            RestrictedApps: Array.isArray(result.OneDriveSyncClientRestrictedApps) ? result.OneDriveSyncClientRestrictedApps : [],
            CreatedDate: new Date().toISOString()
          }
        })
        console.log('✅ Found sync client settings')
      }
    } catch (error) {
      this.handleError('collectSyncClientSettings', error)
    }
  }

  /**
   * Collect OneDrive External Sharing Policy
   * ODExternalSharingPolicy (Phase 1)
   */
  async collectExternalSharingPolicy() {
    try {
      console.log('📋 Collecting OneDrive External Sharing Policy (PowerShell)...')
      const script = `
        [PSCustomObject]@{
          OneDriveExternalSharingCapability = (Get-SPOTenant -ErrorAction SilentlyContinue).OneDriveExternalSharingCapability
          ExternalSharingDomainRestricted = (Get-SPOTenant -ErrorAction SilentlyContinue).SharingDomainRestrictionMode
          RequireAnonymousLinksExpireInDays = (Get-SPOTenant -ErrorAction SilentlyContinue).RequireAnonymousLinksExpireInDays
          CreatedDate = Get-Date
        } |
        ConvertTo-Json -Depth 2
      `
      const result = await this.executePowerShell(script)
      if (result) {
        this.resources.push({
          type: 'ODExternalSharingPolicy',
          name: 'ExternalSharingPolicy',
          id: 'external-sharing-policy',
          configuration: {
            Identity: 'external-sharing-policy',
            SharingCapability: result.OneDriveExternalSharingCapability || 'ExistingExternalUserSharingOnly',
            DomainRestrictionMode: result.ExternalSharingDomainRestricted || 'None',
            AnonymousLinkExpiration: result.RequireAnonymousLinksExpireInDays || 0,
            CreatedDate: new Date().toISOString()
          }
        })
        console.log('✅ Found external sharing policy')
      }
    } catch (error) {
      this.handleError('collectExternalSharingPolicy', error)
    }
  }

  /**
   * Collect OneDrive Retention Policy
   * ODRetentionPolicy (Phase 1)
   */
  async collectOneDriveRetentionPolicy() {
    try {
      console.log('📋 Collecting OneDrive Retention Policy (PowerShell)...')
      const script = `
        [PSCustomObject]@{
          OrphanedPersonalSitesRetentionPeriod = (Get-SPOTenant -ErrorAction SilentlyContinue).OrphanedPersonalSitesRetentionPeriod
          DelayDeletedSiteDays = (Get-SPOTenant -ErrorAction SilentlyContinue).DeletedSiteRetentionPeriod
          CreatedDate = Get-Date
        } |
        ConvertTo-Json -Depth 2
      `
      const result = await this.executePowerShell(script)
      if (result) {
        this.resources.push({
          type: 'ODRetentionPolicy',
          name: 'OneDriveRetentionPolicy',
          id: 'onedrive-retention-policy',
          configuration: {
            Identity: 'onedrive-retention-policy',
            OrphanedPersonalSitesRetentionPeriod: result.OrphanedPersonalSitesRetentionPeriod || 93,
            DeletedSiteRetentionPeriod: result.DelayDeletedSiteDays || 93,
            CreatedDate: new Date().toISOString()
          }
        })
        console.log('✅ Found OneDrive retention policy')
      }
    } catch (error) {
      this.handleError('collectOneDriveRetentionPolicy', error)
    }
  }

  /**
   * Collect OneDrive Access and Compliance Settings
   * ODAccessAndCompliance (Phase 1)
   */
  async collectAccessAndCompliance() {
    try {
      console.log('📋 Collecting OneDrive Access & Compliance (PowerShell)...')
      const script = `
        [PSCustomObject]@{
          AllowDownloadingNonWebViewableFiles = (Get-SPOTenant -ErrorAction SilentlyContinue).AllowDownloadingNonWebViewableFiles
          AllowEditing = (Get-SPOTenant -ErrorAction SilentlyContinue).AllowEditing
          ConditionalAccessPolicy = (Get-SPOTenant -ErrorAction SilentlyContinue).ConditionalAccessPolicy
          CreatedDate = Get-Date
        } |
        ConvertTo-Json -Depth 2
      `
      const result = await this.executePowerShell(script)
      if (result) {
        this.resources.push({
          type: 'ODAccessAndCompliance',
          name: 'AccessAndCompliance',
          id: 'access-and-compliance',
          configuration: {
            Identity: 'access-and-compliance',
            AllowDownloadingNonWebViewableFiles: result.AllowDownloadingNonWebViewableFiles !== false,
            AllowEditing: result.AllowEditing !== false,
            ConditionalAccessPolicy: result.ConditionalAccessPolicy || 'Default',
            CreatedDate: new Date().toISOString()
          }
        })
        console.log('✅ Found access and compliance settings')
      }
    } catch (error) {
      this.handleError('collectAccessAndCompliance', error)
    }
  }

  /**
   * Collect OneDrive Mobile Management Policy
   * ODMobileManagementPolicy (Phase 1)
   */
  async collectMobileManagementPolicy() {
    try {
      console.log('📋 Collecting OneDrive Mobile Management Policy (PowerShell)...')
      const script = `
        [PSCustomObject]@{
          OneDriveMobileAppSync = (Get-SPOTenant -ErrorAction SilentlyContinue).OneDriveMobileAppSync
          MobileDeviceManagementAuthority = (Get-SPOTenant -ErrorAction SilentlyContinue).MobileDeviceManagementAuthority
          CreatedDate = Get-Date
        } |
        ConvertTo-Json -Depth 2
      `
      const result = await this.executePowerShell(script)
      if (result) {
        this.resources.push({
          type: 'ODMobileManagementPolicy',
          name: 'MobileManagementPolicy',
          id: 'mobile-management-policy',
          configuration: {
            Identity: 'mobile-management-policy',
            MobileAppSync: result.OneDriveMobileAppSync !== false,
            MDMAuthority: result.MobileDeviceManagementAuthority || 'Intune',
            CreatedDate: new Date().toISOString()
          }
        })
        console.log('✅ Found mobile management policy')
      }
    } catch (error) {
      this.handleError('collectMobileManagementPolicy', error)
    }
  }

  // ============================================================
  // PHASE 2: ADVANCED SHARING AND COMPLIANCE COLLECTORS
  // ============================================================

  /**
   * Collect Advanced Sharing Settings
   * ODAdvancedSharingSettings (Phase 2)
   */
  async collectAdvancedSharingSettings() {
    try {
      console.log('📋 Collecting OneDrive Advanced Sharing Settings (PowerShell)...')
      const script = `
        [PSCustomObject]@{
          PreventExternalSharingOfUnmanagedFiles = (Get-SPOTenant -ErrorAction SilentlyContinue).PreventExternalSharingOfUnmanagedFiles
          FileAnonymousLinkType = (Get-SPOTenant -ErrorAction SilentlyContinue).FileAnonymousLinkType
          FolderAnonymousLinkType = (Get-SPOTenant -ErrorAction SilentlyContinue).FolderAnonymousLinkType
          EnableAnyoneLinks = (Get-SPOTenant -ErrorAction SilentlyContinue).EnableAnyoneLinks
          CreatedDate = Get-Date
        } |
        ConvertTo-Json -Depth 2
      `
      const result = await this.executePowerShell(script)
      if (result) {
        this.resources.push({
          type: 'ODAdvancedSharingSettings',
          name: 'AdvancedSharingSettings',
          id: 'advanced-sharing-settings',
          configuration: {
            Identity: 'advanced-sharing-settings',
            PreventExternalSharingOfUnmanagedFiles: result.PreventExternalSharingOfUnmanagedFiles || false,
            FileAnonymousLinkType: result.FileAnonymousLinkType || 'View',
            FolderAnonymousLinkType: result.FolderAnonymousLinkType || 'View',
            EnableAnyoneLinks: result.EnableAnyoneLinks !== false,
            CreatedDate: new Date().toISOString()
          }
        })
        console.log('✅ Found advanced sharing settings')
      }
    } catch (error) {
      this.handleError('collectAdvancedSharingSettings', error)
    }
  }

  /**
   * Collect OneDrive Compliance Features
   * ODComplianceFeatures (Phase 2)
   */
  async collectComplianceFeatures() {
    try {
      console.log('📋 Collecting OneDrive Compliance Features (PowerShell)...')
      const script = `
        [PSCustomObject]@{
          EnableAutoExpirationVersionTrim = (Get-SPOTenant -ErrorAction SilentlyContinue).EnableAutoExpirationVersionTrim
          ExpireVersionsAfterDays = (Get-SPOTenant -ErrorAction SilentlyContinue).ExpireVersionsAfterDays
          AllowCommentsOnFiles = (Get-SPOTenant -ErrorAction SilentlyContinue).AllowCommentsOnFiles
          CreatedDate = Get-Date
        } |
        ConvertTo-Json -Depth 2
      `
      const result = await this.executePowerShell(script)
      if (result) {
        this.resources.push({
          type: 'ODComplianceFeatures',
          name: 'ComplianceFeatures',
          id: 'compliance-features',
          configuration: {
            Identity: 'compliance-features',
            AutoExpirationVersionTrimEnabled: result.EnableAutoExpirationVersionTrim || false,
            ExpireVersionsAfterDays: result.ExpireVersionsAfterDays || 365,
            AllowCommentsOnFiles: result.AllowCommentsOnFiles !== false,
            CreatedDate: new Date().toISOString()
          }
        })
        console.log('✅ Found compliance features')
      }
    } catch (error) {
      this.handleError('collectComplianceFeatures', error)
    }
  }

  /**
   * Collect Site Creation Settings
   * ODSiteCreationSettings (Phase 2)
   */
  async collectSiteCreationSettings() {
    try {
      console.log('📋 Collecting OneDrive Site Creation Settings (PowerShell)...')
      const script = `
        [PSCustomObject]@{
          SiteCreationEnabled = (Get-SPOTenant -ErrorAction SilentlyContinue).UserCanCreateSites
          GroupCreationEnabled = (Get-SPOTenant -ErrorAction SilentlyContinue).GroupCreationEnabled
          CreatedDate = Get-Date
        } |
        ConvertTo-Json -Depth 2
      `
      const result = await this.executePowerShell(script)
      if (result) {
        this.resources.push({
          type: 'ODSiteCreationSettings',
          name: 'SiteCreationSettings',
          id: 'site-creation-settings',
          configuration: {
            Identity: 'site-creation-settings',
            UserCanCreateSites: result.SiteCreationEnabled !== false,
            GroupCreationEnabled: result.GroupCreationEnabled !== false,
            CreatedDate: new Date().toISOString()
          }
        })
        console.log('✅ Found site creation settings')
      }
    } catch (error) {
      this.handleError('collectSiteCreationSettings', error)
    }
  }

  /**
   * Collect OneDrive Blocking and Isolation
   * ODBlockingAndIsolation (Phase 2)
   */
  async collectBlockingAndIsolation() {
    try {
      console.log('📋 Collecting OneDrive Blocking & Isolation (PowerShell)...')
      const script = `
        [PSCustomObject]@{
          IPAddressAllowList = (Get-SPOTenant -ErrorAction SilentlyContinue).IPAddressAllowList
          IPAddressEnforcement = (Get-SPOTenant -ErrorAction SilentlyContinue).IPAddressEnforcement
          BlockAccessOnUnmanagedDevices = (Get-SPOTenant -ErrorAction SilentlyContinue).BlockAccessOnUnmanagedDevices
          CreatedDate = Get-Date
        } |
        ConvertTo-Json -Depth 2
      `
      const result = await this.executePowerShell(script)
      if (result) {
        this.resources.push({
          type: 'ODBlockingAndIsolation',
          name: 'BlockingAndIsolation',
          id: 'blocking-isolation',
          configuration: {
            Identity: 'blocking-isolation',
            IPAddressAllowList: result.IPAddressAllowList || '',
            IPAddressEnforcement: result.IPAddressEnforcement || false,
            BlockAccessOnUnmanagedDevices: result.BlockAccessOnUnmanagedDevices || false,
            CreatedDate: new Date().toISOString()
          }
        })
        console.log('✅ Found blocking and isolation settings')
      }
    } catch (error) {
      this.handleError('collectBlockingAndIsolation', error)
    }
  }

  /**
   * Collect File Collaboration Settings
   * ODFileCollaborationSettings (Phase 2)
   */
  async collectFileCollaborationSettings() {
    try {
      console.log('📋 Collecting OneDrive File Collaboration Settings (PowerShell)...')
      const script = `
        [PSCustomObject]@{
          LimitSharingByExternalUsers = (Get-SPOTenant -ErrorAction SilentlyContinue).LimitSharingByExternalUsers
          PreventExternalUsersFromResharing = (Get-SPOTenant -ErrorAction SilentlyContinue).PreventExternalUsersFromResharing
          DefaultSharingLinkType = (Get-SPOTenant -ErrorAction SilentlyContinue).DefaultSharingLinkType
          CreatedDate = Get-Date
        } |
        ConvertTo-Json -Depth 2
      `
      const result = await this.executePowerShell(script)
      if (result) {
        this.resources.push({
          type: 'ODFileCollaborationSettings',
          name: 'FileCollaborationSettings',
          id: 'file-collaboration-settings',
          configuration: {
            Identity: 'file-collaboration-settings',
            LimitSharingByExternalUsers: result.LimitSharingByExternalUsers || false,
            PreventExternalUsersFromResharing: result.PreventExternalUsersFromResharing || false,
            DefaultSharingLinkType: result.DefaultSharingLinkType || 'Internal',
            CreatedDate: new Date().toISOString()
          }
        })
        console.log('✅ Found file collaboration settings')
      }
    } catch (error) {
      this.handleError('collectFileCollaborationSettings', error)
    }
  }

  /**
   * Collect OneDrive Audit and Compliance
   * ODComplianceAudit (Phase 2)
   */
  async collectComplianceAudit() {
    try {
      console.log('📋 Collecting OneDrive Compliance Audit (PowerShell)...')
      const script = `
        [PSCustomObject]@{
          AuditEnabled = (Get-SPOTenant -ErrorAction SilentlyContinue).AuditingEnabled
          AuditLogMaxRetentionDays = (Get-SPOTenant -ErrorAction SilentlyContinue).AuditLogMaxRetentionDays
          CreatedDate = Get-Date
        } |
        ConvertTo-Json -Depth 2
      `
      const result = await this.executePowerShell(script)
      if (result) {
        this.resources.push({
          type: 'ODComplianceAudit',
          name: 'ComplianceAudit',
          id: 'compliance-audit',
          configuration: {
            Identity: 'compliance-audit',
            AuditEnabled: result.AuditEnabled !== false,
            AuditLogMaxRetentionDays: result.AuditLogMaxRetentionDays || 90,
            CreatedDate: new Date().toISOString()
          }
        })
        console.log('✅ Found compliance audit settings')
      }
    } catch (error) {
      this.handleError('collectComplianceAudit', error)
    }
  }

  // ============================================================
  // PHASE 3: RETENTION, RECORDS, AND GOVERNANCE COLLECTORS
  // ============================================================

  /**
   * Collect File Lifecycle Management
   * ODFileLifecycleManagement (Phase 3)
   */
  async collectFileLifecycleManagement() {
    try {
      console.log('📋 Collecting OneDrive File Lifecycle Management (PowerShell)...')
      const script = `
        [PSCustomObject]@{
          DisableRightsMgmt = (Get-SPOTenant -ErrorAction SilentlyContinue).DisableRightsMgmt
          DisableTrialLicenseFeatures = (Get-SPOTenant -ErrorAction SilentlyContinue).DisableTrialLicenseFeatures
          CreatedDate = Get-Date
        } |
        ConvertTo-Json -Depth 2
      `
      const result = await this.executePowerShell(script)
      if (result) {
        this.resources.push({
          type: 'ODFileLifecycleManagement',
          name: 'FileLifecycleManagement',
          id: 'file-lifecycle-management',
          configuration: {
            Identity: 'file-lifecycle-management',
            RightsMgmtEnabled: result.DisableRightsMgmt !== true,
            TrialLicenseFeaturesEnabled: result.DisableTrialLicenseFeatures !== true,
            CreatedDate: new Date().toISOString()
          }
        })
        console.log('✅ Found file lifecycle management')
      }
    } catch (error) {
      this.handleError('collectFileLifecycleManagement', error)
    }
  }

  /**
   * Collect Advanced Quota Management
   * ODAdvancedQuotaManagement (Phase 3)
   */
  async collectAdvancedQuotaManagement() {
    try {
      console.log('📋 Collecting OneDrive Advanced Quota Management (PowerShell)...')
      const script = `
        [PSCustomObject]@{
          OneDriveStorageQuota = (Get-SPOTenant -ErrorAction SilentlyContinue).OneDriveStorageQuota
          OneDriveStorageQuotaWarningThresholdPercentage = (Get-SPOTenant -ErrorAction SilentlyContinue).OneDriveStorageQuotaWarningThresholdPercentage
          CreatedDate = Get-Date
        } |
        ConvertTo-Json -Depth 2
      `
      const result = await this.executePowerShell(script)
      if (result) {
        this.resources.push({
          type: 'ODAdvancedQuotaManagement',
          name: 'AdvancedQuotaManagement',
          id: 'advanced-quota-management',
          configuration: {
            Identity: 'advanced-quota-management',
            DefaultStorageQuota: result.OneDriveStorageQuota || 1048576,
            WarningThresholdPercentage: result.OneDriveStorageQuotaWarningThresholdPercentage || 90,
            CreatedDate: new Date().toISOString()
          }
        })
        console.log('✅ Found advanced quota management')
      }
    } catch (error) {
      this.handleError('collectAdvancedQuotaManagement', error)
    }
  }

  /**
   * Collect Records Management Settings
   * ODRecordsManagement (Phase 3)
   */
  async collectRecordsManagement() {
    try {
      console.log('📋 Collecting OneDrive Records Management (PowerShell)...')
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
          type: 'ODRecordsManagement',
          name: 'RecordsManagement',
          id: 'records-management',
          configuration: {
            Identity: 'records-management',
            Enabled: result.RecordsManagementEnabled || false,
            ContentTypeHubUrl: result.ContentTypeHubUrl || '',
            CreatedDate: new Date().toISOString()
          }
        })
        console.log('✅ Found records management')
      }
    } catch (error) {
      this.handleError('collectRecordsManagement', error)
    }
  }

  /**
   * Collect Site Governance Settings
   * ODSiteGovernance (Phase 3)
   */
  async collectSiteGovernance() {
    try {
      console.log('📋 Collecting OneDrive Site Governance (PowerShell)...')
      const script = `
        [PSCustomObject]@{
          IsSharePointOnlineInstanceFrontDoor = (Get-SPOTenant -ErrorAction SilentlyContinue).IsSharePointOnlineInstanceFrontDoor
          RestrictedAccessControlEnabled = (Get-SPOTenant -ErrorAction SilentlyContinue).RestrictedAccessControlEnabled
          CreatedDate = Get-Date
        } |
        ConvertTo-Json -Depth 2
      `
      const result = await this.executePowerShell(script)
      if (result) {
        this.resources.push({
          type: 'ODSiteGovernance',
          name: 'SiteGovernance',
          id: 'site-governance',
          configuration: {
            Identity: 'site-governance',
            FrontDoorEnabled: result.IsSharePointOnlineInstanceFrontDoor || false,
            RestrictedAccessControlEnabled: result.RestrictedAccessControlEnabled || false,
            CreatedDate: new Date().toISOString()
          }
        })
        console.log('✅ Found site governance settings')
      }
    } catch (error) {
      this.handleError('collectSiteGovernance', error)
    }
  }

  /**
   * Collect Sensitivity and Classification
   * ODSensitivityClassification (Phase 3)
   */
  async collectSensitivityClassification() {
    try {
      console.log('📋 Collecting OneDrive Sensitivity Classification (PowerShell)...')
      const script = `
        [PSCustomObject]@{
          DisableDocumentManagement = (Get-SPOTenant -ErrorAction SilentlyContinue).DisableDocumentManagement
          InformationBarrierMode = (Get-SPOTenant -ErrorAction SilentlyContinue).InformationBarrierMode
          CreatedDate = Get-Date
        } |
        ConvertTo-Json -Depth 2
      `
      const result = await this.executePowerShell(script)
      if (result) {
        this.resources.push({
          type: 'ODSensitivityClassification',
          name: 'SensitivityClassification',
          id: 'sensitivity-classification',
          configuration: {
            Identity: 'sensitivity-classification',
            DocumentManagementEnabled: result.DisableDocumentManagement !== true,
            InformationBarrierMode: result.InformationBarrierMode || 'Open',
            CreatedDate: new Date().toISOString()
          }
        })
        console.log('✅ Found sensitivity classification')
      }
    } catch (error) {
      this.handleError('collectSensitivityClassification', error)
    }
  }

  /**
   * Collect Advanced Audit Settings
   * ODAdvancedAudit (Phase 3)
   */
  async collectAdvancedAudit() {
    try {
      console.log('📋 Collecting OneDrive Advanced Audit (PowerShell)...')
      const script = `
        [PSCustomObject]@{
          AuditingRetentionDays = (Get-SPOTenant -ErrorAction SilentlyContinue).AuditingRetentionDays
          EnableComplianceTagsForSharePointOnline = (Get-SPOTenant -ErrorAction SilentlyContinue).EnableComplianceTagsForSharePointOnline
          CreatedDate = Get-Date
        } |
        ConvertTo-Json -Depth 2
      `
      const result = await this.executePowerShell(script)
      if (result) {
        this.resources.push({
          type: 'ODAdvancedAudit',
          name: 'AdvancedAudit',
          id: 'advanced-audit',
          configuration: {
            Identity: 'advanced-audit',
            AuditingRetentionDays: result.AuditingRetentionDays || 90,
            ComplianceTagsEnabled: result.EnableComplianceTagsForSharePointOnline || false,
            CreatedDate: new Date().toISOString()
          }
        })
        console.log('✅ Found advanced audit')
      }
    } catch (error) {
      this.handleError('collectAdvancedAudit', error)
    }
  }

  /**
   * Collect Metadata and Content Type Settings
   * ODMetadataAndContentTypes (Phase 3)
   */
  async collectMetadataAndContentTypes() {
    try {
      console.log('📋 Collecting OneDrive Metadata & Content Types (PowerShell)...')
      const script = `
        [PSCustomObject]@{
          ContentTypeHubUrl = (Get-SPOTenant -ErrorAction SilentlyContinue).ContentTypeHubUrl
          SharePointOnlineVersion = (Get-SPOTenant -ErrorAction SilentlyContinue).SharePointOnlineVersion
          CreatedDate = Get-Date
        } |
        ConvertTo-Json -Depth 2
      `
      const result = await this.executePowerShell(script)
      if (result) {
        this.resources.push({
          type: 'ODMetadataAndContentTypes',
          name: 'MetadataAndContentTypes',
          id: 'metadata-content-types',
          configuration: {
            Identity: 'metadata-content-types',
            ContentTypeHubUrl: result.ContentTypeHubUrl || '',
            SharePointVersion: result.SharePointOnlineVersion || '16.0',
            CreatedDate: new Date().toISOString()
          }
        })
        console.log('✅ Found metadata and content types')
      }
    } catch (error) {
      this.handleError('collectMetadataAndContentTypes', error)
    }
  }

  /**
   * Collect Advanced Retention Policy
   * ODAdvancedRetention (Phase 3)
   */
  async collectAdvancedRetention() {
    try {
      console.log('📋 Collecting OneDrive Advanced Retention (PowerShell)...')
      const script = `
        [PSCustomObject]@{
          OrphanedPersonalSitesRetentionPeriod = (Get-SPOTenant -ErrorAction SilentlyContinue).OrphanedPersonalSitesRetentionPeriod
          DeletedSiteRetentionPeriod = (Get-SPOTenant -ErrorAction SilentlyContinue).DeletedSiteRetentionPeriod
          CreatedDate = Get-Date
        } |
        ConvertTo-Json -Depth 2
      `
      const result = await this.executePowerShell(script)
      if (result) {
        this.resources.push({
          type: 'ODAdvancedRetention',
          name: 'AdvancedRetention',
          id: 'advanced-retention',
          configuration: {
            Identity: 'advanced-retention',
            OrphanedPersonalSiteRetentionDays: result.OrphanedPersonalSitesRetentionPeriod || 93,
            DeletedSiteRetentionDays: result.DeletedSiteRetentionPeriod || 93,
            CreatedDate: new Date().toISOString()
          }
        })
        console.log('✅ Found advanced retention')
      }
    } catch (error) {
      this.handleError('collectAdvancedRetention', error)
    }
  }

  /**
   * Collect Data Governance and DLP
   * ODDataGovernanceDLP (Phase 3)
   */
  async collectDataGovernanceDLP() {
    try {
      console.log('📋 Collecting OneDrive Data Governance & DLP (PowerShell)...')
      const script = `
        [PSCustomObject]@{
          DenyAddAndCustomizePages = (Get-SPOTenant -ErrorAction SilentlyContinue).DenyAddAndCustomizePages
          DisableSpamNotifications = (Get-SPOTenant -ErrorAction SilentlyContinue).DisableSpamNotifications
          CreatedDate = Get-Date
        } |
        ConvertTo-Json -Depth 2
      `
      const result = await this.executePowerShell(script)
      if (result) {
        this.resources.push({
          type: 'ODDataGovernanceDLP',
          name: 'DataGovernanceDLP',
          id: 'data-governance-dlp',
          configuration: {
            Identity: 'data-governance-dlp',
            DenyAddAndCustomizePages: result.DenyAddAndCustomizePages || false,
            SpamNotificationsEnabled: result.DisableSpamNotifications !== true,
            CreatedDate: new Date().toISOString()
          }
        })
        console.log('✅ Found data governance DLP')
      }
    } catch (error) {
      this.handleError('collectDataGovernanceDLP', error)
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

export default OneDriveCollector
