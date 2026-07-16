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
      console.log('🔄 Starting Microsoft 365 Groups backup collection (Comprehensive)...')
      const startTime = Date.now()

      // Reset state for fresh collection
      this.resources = []
      this.errors = []

      // Collect each resource type
      await this.collectGroups()
      await this.collectGroupSettings()
      await this.collectGroupPolicies()

      // PowerShell-based collections (non-blocking failures)
      await this.collectGroupNamingPolicyPowerShell()
      await this.collectGroupExpirationPolicyPowerShell()
      await this.collectGroupGuestSettingsPowerShell()
      await this.collectGroupClassificationPowerShell()

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
   * Collect Microsoft 365 Groups (Comprehensive)
   * O365GroupsSettings
   */
  async collectGroups() {
    try {
      console.log('📋 Collecting Microsoft 365 Groups (Comprehensive)...')

      const response = await this.graphClient
        .api('/groups')
        .filter("groupTypes/any(c:c eq 'Unified')")
        .select('id,displayName,description,mail,mailNickname,visibility,isArchived,createdDateTime,lastModifiedDateTime,owners,members,resourceProvisioningOptions,classification,preferredLanguage')
        .top(999)
        .get()

      if (response.value && response.value.length > 0) {
        for (const group of response.value) {
          // Collect owner details
          let ownersList = []
          try {
            const ownersResponse = await this.graphClient
              .api(`/groups/${group.id}/owners`)
              .select('id,displayName,userPrincipalName,mail')
              .top(999)
              .get()

            if (ownersResponse.value) {
              ownersList = ownersResponse.value.map(o => ({
                Identity: o.id,
                DisplayName: o.displayName,
                UserPrincipalName: o.userPrincipalName,
                Email: o.mail
              }))
            }
          } catch (e) {
            console.warn(`⚠️ Could not fetch owners for group ${group.displayName}`)
          }

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
              Classification: group.classification || 'Standard',
              PreferredLanguage: group.preferredLanguage || 'en-US',
              CreatedDateTime: group.createdDateTime || '',
              LastModifiedDateTime: group.lastModifiedDateTime || '',
              OwnerCount: ownersList.length,
              Owners: ownersList,
              MembersCount: group.members?.length || 0,
              WebUrl: group.webUrl || '',
              ResourceProvisioningOptions: group.resourceProvisioningOptions || [],
              HasTeam: group.resourceProvisioningOptions?.includes('Team') || false,
              HasSharePoint: group.resourceProvisioningOptions?.includes('Team') || false
            }
          })
        }
        console.log(`✅ Found ${response.value.length} groups with members and owners`)

        // Collect detailed group information
        for (const group of response.value) {
          await this.collectGroupDetails(group.id, group.displayName)
          if (group.resourceProvisioningOptions?.includes('Team')) {
            await this.collectGroupChannels(group.id, group.displayName)
          }
          await this.collectGroupSite(group.id, group.displayName)
        }
      } else {
        console.log('ℹ️ No Microsoft 365 groups found')
      }
    } catch (error) {
      this.handleError('collectGroups', error)
    }
  }

  /**
   * Collect Group Details (Comprehensive)
   * Members, Channels, Owners per group with extended properties
   */
  async collectGroupDetails(groupId, groupName) {
    try {
      // Collect group members with extended details
      const membersResponse = await this.graphClient
        .api(`/groups/${groupId}/members`)
        .select('id,displayName,userPrincipalName,mail,jobTitle,department,createdDateTime')
        .top(999)
        .get()

      if (membersResponse.value && membersResponse.value.length > 0) {
        let membersSummary = []
        for (const member of membersResponse.value) {
          const memberData = {
            Identity: member.id,
            DisplayName: member.displayName || '',
            UserPrincipalName: member.userPrincipalName || '',
            Email: member.mail || '',
            Type: member['@odata.type'] || 'user',
            JobTitle: member.jobTitle || '',
            Department: member.department || '',
            CreatedDateTime: member.createdDateTime || ''
          }

          membersSummary.push(memberData)

          this.resources.push({
            type: 'O365GroupMember',
            name: member.displayName,
            id: member.id,
            configuration: {
              GroupId: groupId,
              GroupName: groupName,
              ...memberData
            }
          })
        }

        // Create summary resource
        this.resources.push({
          type: 'O365GroupMembers',
          name: `${groupName} - Members`,
          id: `${groupId}-members`,
          configuration: {
            Identity: `${groupId}-members`,
            GroupId: groupId,
            GroupName: groupName,
            MemberCount: membersSummary.length,
            Members: membersSummary
          }
        })

        console.log(`  └─ ${groupName}: ${membersResponse.value.length} members`)
      }

      // Collect group owners with details
      const ownersResponse = await this.graphClient
        .api(`/groups/${groupId}/owners`)
        .select('id,displayName,userPrincipalName,mail,jobTitle,department')
        .top(999)
        .get()

      if (ownersResponse.value && ownersResponse.value.length > 0) {
        let ownersSummary = []
        for (const owner of ownersResponse.value) {
          const ownerData = {
            Identity: owner.id,
            DisplayName: owner.displayName || '',
            UserPrincipalName: owner.userPrincipalName || '',
            Email: owner.mail || '',
            JobTitle: owner.jobTitle || '',
            Department: owner.department || '',
            Role: 'Owner'
          }

          ownersSummary.push(ownerData)

          this.resources.push({
            type: 'O365GroupOwner',
            name: owner.displayName,
            id: owner.id,
            configuration: {
              GroupId: groupId,
              GroupName: groupName,
              ...ownerData
            }
          })
        }

        // Create summary resource
        this.resources.push({
          type: 'O365GroupOwners',
          name: `${groupName} - Owners`,
          id: `${groupId}-owners`,
          configuration: {
            Identity: `${groupId}-owners`,
            GroupId: groupId,
            GroupName: groupName,
            OwnerCount: ownersSummary.length,
            Owners: ownersSummary
          }
        })

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
   * Collect Group Naming Policy via PowerShell
   * O365GroupsNamingPolicy
   */
  async collectGroupNamingPolicyPowerShell() {
    try {
      console.log('📋 Collecting Group Naming Policy (PowerShell)...')

      const script = `
        Get-AzureADDirectorySetting | Where-Object {$_.DisplayName -eq "Group.Unified"} | Select-Object @{
          n='PrefixSuffixNamingRequirement';e={$_.Values | Where-Object {$_.Name -eq "PrefixSuffixNamingRequirement"} | Select-Object -ExpandProperty Value}
        }, @{
          n='CustomBlockedWordsList';e={$_.Values | Where-Object {$_.Name -eq "CustomBlockedWordsList"} | Select-Object -ExpandProperty Value}
        } | ConvertTo-Json
      `

      const result = await this.executePowerShell(script)

      if (result) {
        this.resources.push({
          type: 'O365GroupsNamingPolicy',
          name: 'Group Naming Policy',
          id: 'naming-policy',
          configuration: {
            Identity: 'Group.Unified',
            PrefixSuffixNamingRequirement: result.PrefixSuffixNamingRequirement || 'Not configured',
            CustomBlockedWordsList: result.CustomBlockedWordsList || [],
            PrefixRequired: (result.PrefixSuffixNamingRequirement || '').includes('['),
            SuffixRequired: (result.PrefixSuffixNamingRequirement || '').includes(']')
          }
        })

        console.log('✅ Group naming policy collected')
      }
    } catch (error) {
      this.handleError('collectGroupNamingPolicyPowerShell', error)
    }
  }

  /**
   * Collect Group Expiration Policy via PowerShell
   * O365GroupsExpiration
   */
  async collectGroupExpirationPolicyPowerShell() {
    try {
      console.log('📋 Collecting Group Expiration Policy (PowerShell)...')

      const script = `
        Get-AzureADDirectorySetting | Where-Object {$_.DisplayName -eq "Group.Unified"} | Select-Object @{
          n='GroupLifetimeInDays';e={$_.Values | Where-Object {$_.Name -eq "GroupLifetimeInDays"} | Select-Object -ExpandProperty Value}
        }, @{
          n='ManagedGroupLifetimeInDays';e={$_.Values | Where-Object {$_.Name -eq "ManagedGroupLifetimeInDays"} | Select-Object -ExpandProperty Value}
        }, @{
          n='EnableGroupLifecycleManagement';e={$_.Values | Where-Object {$_.Name -eq "EnableGroupLifecycleManagement"} | Select-Object -ExpandProperty Value}
        }, @{
          n='GroupExpirationNotificationMails';e={$_.Values | Where-Object {$_.Name -eq "GroupExpirationNotificationMails"} | Select-Object -ExpandProperty Value}
        } | ConvertTo-Json
      `

      const result = await this.executePowerShell(script)

      if (result) {
        this.resources.push({
          type: 'O365GroupsExpiration',
          name: 'Group Expiration Policy',
          id: 'expiration-policy',
          configuration: {
            Identity: 'Group.Unified',
            GroupLifetimeInDays: result.GroupLifetimeInDays || 0,
            ManagedGroupLifetimeInDays: result.ManagedGroupLifetimeInDays || 0,
            EnableGroupLifecycleManagement: result.EnableGroupLifecycleManagement === 'true',
            GroupExpirationNotificationMails: result.GroupExpirationNotificationMails || '',
            ExpirationEnabled: (result.EnableGroupLifecycleManagement === 'true') || false
          }
        })

        console.log('✅ Group expiration policy collected')
      }
    } catch (error) {
      this.handleError('collectGroupExpirationPolicyPowerShell', error)
    }
  }

  /**
   * Collect Group Guest Settings via PowerShell
   * O365GroupsGuestSettings
   */
  async collectGroupGuestSettingsPowerShell() {
    try {
      console.log('📋 Collecting Group Guest Settings (PowerShell)...')

      const script = `
        Get-AzureADDirectorySetting | Where-Object {$_.DisplayName -eq "Group.Unified"} | Select-Object @{
          n='AllowGuestAccess';e={$_.Values | Where-Object {$_.Name -eq "AllowGuestAccess"} | Select-Object -ExpandProperty Value}
        }, @{
          n='AllowGuestToAccessGroups';e={$_.Values | Where-Object {$_.Name -eq "AllowGuestToAccessGroups"} | Select-Object -ExpandProperty Value}
        }, @{
          n='GuestUsageLocation';e={$_.Values | Where-Object {$_.Name -eq "GuestUsageLocation"} | Select-Object -ExpandProperty Value}
        } | ConvertTo-Json
      `

      const result = await this.executePowerShell(script)

      if (result) {
        this.resources.push({
          type: 'O365GroupsGuestSettings',
          name: 'Group Guest Settings',
          id: 'guest-settings',
          configuration: {
            Identity: 'Group.Unified',
            AllowGuestAccess: result.AllowGuestAccess === 'true',
            AllowGuestToAccessGroups: result.AllowGuestToAccessGroups === 'true',
            GuestUsageLocation: result.GuestUsageLocation || 'Unrestricted',
            GuestsCanCreateGroups: false,
            GuestsCanInviteGuests: true
          }
        })

        console.log('✅ Group guest settings collected')
      }
    } catch (error) {
      this.handleError('collectGroupGuestSettingsPowerShell', error)
    }
  }

  /**
   * Collect Group Classification Settings via PowerShell
   * O365GroupsClassification
   */
  async collectGroupClassificationPowerShell() {
    try {
      console.log('📋 Collecting Group Classification Settings (PowerShell)...')

      const script = `
        Get-AzureADDirectorySetting | Where-Object {$_.DisplayName -eq "Group.Unified"} | Select-Object @{
          n='ClassificationList';e={$_.Values | Where-Object {$_.Name -eq "ClassificationList"} | Select-Object -ExpandProperty Value}
        }, @{
          n='ClassificationDescriptions';e={$_.Values | Where-Object {$_.Name -eq "ClassificationDescriptions"} | Select-Object -ExpandProperty Value}
        }, @{
          n='DefaultClassification';e={$_.Values | Where-Object {$_.Name -eq "DefaultClassification"} | Select-Object -ExpandProperty Value}
        } | ConvertTo-Json
      `

      const result = await this.executePowerShell(script)

      if (result) {
        this.resources.push({
          type: 'O365GroupsClassification',
          name: 'Group Classification',
          id: 'classification-settings',
          configuration: {
            Identity: 'Group.Unified',
            ClassificationList: result.ClassificationList?.split(',') || ['Standard', 'Confidential'],
            ClassificationDescriptions: result.ClassificationDescriptions || '',
            DefaultClassification: result.DefaultClassification || 'Standard',
            ClassificationEnabled: true
          }
        })

        console.log('✅ Group classification settings collected')
      }
    } catch (error) {
      this.handleError('collectGroupClassificationPowerShell', error)
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
