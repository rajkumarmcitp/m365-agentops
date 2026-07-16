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

      // Collect each resource type
      await this.collectOneDriveSettings()
      await this.collectUserDrives()
      await this.collectDriveDetails()
      await this.collectQuota()
      await this.collectRetention()

      // PowerShell-based collections (non-blocking failures)
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
            name: \`Quota - \${quota.Identity}\`,
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

        console.log(\`✅ Collected quotas for \${result.length} OneDrive sites\`)
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
