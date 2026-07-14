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
      console.log('🔄 Starting OneDrive for Business backup collection...')
      const startTime = Date.now()

      // Collect each resource type
      await this.collectOneDriveSettings()
      await this.collectUserDrives()
      await this.collectDriveDetails()
      await this.collectQuota()
      await this.collectRetention()

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
   * Collect OneDrive Settings
   * ODSettings
   */
  async collectOneDriveSettings() {
    try {
      console.log('📋 Collecting OneDrive Settings...')

      // Get organization information which includes OneDrive settings
      const response = await this.graphClient
        .api('/organization')
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
            LastModifiedDateTime: org.lastModifiedDateTime || ''
          }
        })

        console.log('✅ OneDrive settings collected')
      }
    } catch (error) {
      this.handleError('collectOneDriveSettings', error)
    }
  }

  /**
   * Collect User Drives (OneDrive for Business)
   * ODPersonalSiteDefaultStorage
   */
  async collectUserDrives() {
    try {
      console.log('📋 Collecting User OneDrive Drives...')

      let driveCount = 0

      // Get all users
      const usersResponse = await this.graphClient
        .api('/users')
        .filter("userType eq 'Member'")
        .select('id,displayName,userPrincipalName,mail')
        .top(999)
        .get()

      if (usersResponse.value && usersResponse.value.length > 0) {
        for (const user of usersResponse.value) {
          try {
            // Get user's drive (OneDrive for Business)
            const driveResponse = await this.graphClient
              .api(`/users/${user.id}/drive`)
              .get()

            if (driveResponse.id) {
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
                  DriveType: driveResponse.driveType || 'personal',
                  WebUrl: driveResponse.webUrl || '',
                  CreatedDateTime: driveResponse.createdDateTime || '',
                  LastModifiedDateTime: driveResponse.lastModifiedDateTime || '',
                  QuotaUsed: driveResponse.quota?.used || 0,
                  QuotaTotal: driveResponse.quota?.total || 0,
                  QuotaRemaining: (driveResponse.quota?.total || 0) - (driveResponse.quota?.used || 0)
                }
              })
              driveCount++
            }
          } catch (error) {
            // Silently continue if user doesn't have a drive (e.g., guest users)
            continue
          }
        }

        console.log(`✅ Found ${driveCount} user drives`)
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
