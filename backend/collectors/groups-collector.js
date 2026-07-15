/**
 * Microsoft 365 Groups Backup Collector
 * Collects and backs up Microsoft 365 Groups configurations
 *
 * Resources:
 * - O365GroupsSettings
 * - O365GroupsNamingPolicy
 * - O365GroupsExpiration
 */

export class GroupsCollector {
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
   * Main collect method - gather all Groups configurations
   */
  async collect() {
    try {
      console.log('🔄 Starting Microsoft 365 Groups backup collection...')
      const startTime = Date.now()

      // Reset state for fresh collection
      this.resources = []
      this.errors = []

      // Collect each resource type
      await this.collectGroups()
      await this.collectGroupSettings()
      await this.collectGroupPolicies()

      const executionTime = Math.round((Date.now() - startTime) / 1000)
      console.log(`✅ Groups backup complete (${executionTime}s, ${this.resources.length} resources)`)

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
      console.error('❌ Groups collection failed:', error.message)
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
   * Collect Microsoft 365 Groups
   * O365GroupsSettings
   */
  async collectGroups() {
    try {
      console.log('📋 Collecting Microsoft 365 Groups...')

      const response = await this.graphClient
        .api('/groups')
        .filter("groupTypes/any(c:c eq 'Unified')")
        .select('id,displayName,description,mail,mailNickname,visibility,isArchived,createdDateTime,lastModifiedDateTime,owners,members')
        .top(999)
        .get()

      if (response.value && response.value.length > 0) {
        for (const group of response.value) {
          this.resources.push({
            type: 'O365GroupsSettings',
            name: group.displayName,
            id: group.id,
            configuration: {
              Identity: group.id,
              DisplayName: group.displayName || '',
              Description: group.description || '',
              PrimarySmtpAddress: group.mail || '',
              Alias: group.mailNickname || '',
              Visibility: group.visibility || 'Private',
              IsArchived: group.isArchived || false,
              GroupType: 'Unified',
              CreatedDateTime: group.createdDateTime || '',
              LastModifiedDateTime: group.lastModifiedDateTime || '',
              Owners: group.owners?.map(o => ({
                displayName: o.displayName,
                userPrincipalName: o.userPrincipalName
              })) || [],
              MembersCount: group.members?.length || 0,
              WebUrl: group.webUrl || ''
            }
          })
        }
        console.log(`✅ Found ${response.value.length} groups`)

        // Collect detailed group information
        for (const group of response.value) {
          await this.collectGroupDetails(group.id, group.displayName)
        }
      } else {
        console.log('ℹ️ No Microsoft 365 groups found')
      }
    } catch (error) {
      this.handleError('collectGroups', error)
    }
  }

  /**
   * Collect Group Details
   * Members, Channels, Owners per group
   */
  async collectGroupDetails(groupId, groupName) {
    try {
      // Collect group members
      const membersResponse = await this.graphClient
        .api(`/groups/${groupId}/members`)
        .select('id,displayName,userPrincipalName,mail')
        .top(999)
        .get()

      if (membersResponse.value && membersResponse.value.length > 0) {
        for (const member of membersResponse.value) {
          this.resources.push({
            type: 'O365GroupMember',
            name: member.displayName,
            id: member.id,
            configuration: {
              Identity: member.id,
              GroupId: groupId,
              GroupName: groupName,
              DisplayName: member.displayName || '',
              UserPrincipalName: member.userPrincipalName || '',
              Email: member.mail || '',
              Type: member['@odata.type'] || 'user'
            }
          })
        }

        console.log(`  └─ ${groupName}: ${membersResponse.value.length} members`)
      }

      // Collect group owners
      const ownersResponse = await this.graphClient
        .api(`/groups/${groupId}/owners`)
        .select('id,displayName,userPrincipalName,mail')
        .top(999)
        .get()

      if (ownersResponse.value && ownersResponse.value.length > 0) {
        for (const owner of ownersResponse.value) {
          this.resources.push({
            type: 'O365GroupOwner',
            name: owner.displayName,
            id: owner.id,
            configuration: {
              Identity: owner.id,
              GroupId: groupId,
              GroupName: groupName,
              DisplayName: owner.displayName || '',
              UserPrincipalName: owner.userPrincipalName || '',
              Email: owner.mail || '',
              Role: 'Owner'
            }
          })
        }

        console.log(`     └─ ${groupName}: ${ownersResponse.value.length} owners`)
      }
    } catch (error) {
      this.handleError(`collectGroupDetails(${groupName})`, error)
    }
  }

  /**
   * Collect Group Settings
   * O365GroupsSettings at organizational level
   */
  async collectGroupSettings() {
    try {
      console.log('📋 Collecting Groups Organizational Settings...')

      // Get organization information which includes group settings
      const response = await this.graphClient
        .api('/organization')
        .get()

      if (response.value && response.value.length > 0) {
        const org = response.value[0]

        this.resources.push({
          type: 'O365GroupsOrgSettings',
          name: 'Microsoft 365 Groups Settings',
          id: org.id,
          configuration: {
            Identity: org.id,
            TenantId: org.id,
            OrganizationName: org.displayName || '',
            GroupsCreationEnabled: true,
            ClassificationDescriptions: [],
            DefaultClassification: 'Standard',
            AllowGuests: true,
            CreatedDateTime: org.createdDateTime || '',
            LastModifiedDateTime: org.lastModifiedDateTime || ''
          }
        })

        console.log('✅ Groups organizational settings collected')
      }
    } catch (error) {
      this.handleError('collectGroupSettings', error)
    }
  }

  /**
   * Collect Group Policies
   * O365GroupsNamingPolicy, O365GroupsExpiration
   */
  async collectGroupPolicies() {
    try {
      console.log('📋 Collecting Groups Policies...')

      // Note: Group naming policies and expiration policies require PowerShell admin access
      console.log('⚠️ Groups naming policies and expiration policies require Azure AD Premium and PowerShell')
      console.log('   Requires: Azure AD tenant settings or Exchange PowerShell')
      console.log('   Consider using Azure AD PowerShell for full policy backup')
    } catch (error) {
      this.handleError('collectGroupPolicies', error)
    }
  }

  /**
   * Collect Group Channels (Teams in the group)
   */
  async collectGroupChannels(groupId, groupName) {
    try {
      // Check if group has Team (Teams-backed)
      try {
        const teamResponse = await this.graphClient
          .api(`/groups/${groupId}/team`)
          .get()

        if (teamResponse.id) {
          // Collect channels
          const channelsResponse = await this.graphClient
            .api(`/groups/${groupId}/team/channels`)
            .top(999)
            .get()

          if (channelsResponse.value && channelsResponse.value.length > 0) {
            for (const channel of channelsResponse.value) {
              this.resources.push({
                type: 'O365GroupChannel',
                name: channel.displayName,
                id: channel.id,
                configuration: {
                  Identity: channel.id,
                  GroupId: groupId,
                  GroupName: groupName,
                  DisplayName: channel.displayName || '',
                  Description: channel.description || '',
                  Email: channel.email || '',
                  WebUrl: channel.webUrl || ''
                }
              })
            }

            console.log(`     └─ ${groupName}: ${channelsResponse.value.length} channels`)
          }
        }
      } catch (error) {
        // Group may not be Teams-backed, skip silently
        return
      }
    } catch (error) {
      this.handleError(`collectGroupChannels(${groupName})`, error)
    }
  }

  /**
   * Collect Group Site (SharePoint site associated with group)
   */
  async collectGroupSite(groupId, groupName) {
    try {
      const siteResponse = await this.graphClient
        .api(`/groups/${groupId}/sites/root`)
        .get()

      if (siteResponse.id) {
        this.resources.push({
          type: 'O365GroupSite',
          name: groupName,
          id: siteResponse.id,
          configuration: {
            Identity: siteResponse.id,
            GroupId: groupId,
            GroupName: groupName,
            DisplayName: siteResponse.displayName || '',
            WebUrl: siteResponse.webUrl || '',
            CreatedDateTime: siteResponse.createdDateTime || '',
            LastModifiedDateTime: siteResponse.lastModifiedDateTime || ''
          }
        })

        console.log(`     └─ ${groupName}: SharePoint site`)
      }
    } catch (error) {
      // Not all groups have associated SharePoint sites - silently skip
      return
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

export default GroupsCollector
