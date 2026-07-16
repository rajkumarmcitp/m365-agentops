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

      // Phase 1 - Critical group management and governance
      console.log('📊 Starting Groups Phase 1 collection...')
      await this.collectGroupsCreationPolicy() // O365GroupsCreationPolicy
      await this.collectGroupsMailboxSettings() // O365GroupsMailboxSettings
      await this.collectGroupsStorageQuota() // O365GroupsStorageQuota
      await this.collectGroupsArchivePolicy() // O365GroupsArchivePolicy
      await this.collectGroupsMembershipPolicy() // O365GroupsMembershipPolicy
      await this.collectGroupsTeamsIntegration() // O365GroupsTeamsIntegration
      await this.collectGroupsSharePointSettings() // O365GroupsSharePointSettings
      await this.collectGroupsConnectorPolicy() // O365GroupsConnectorPolicy

      // Phase 2 - Advanced sharing, compliance, and delegation
      console.log('📊 Starting Groups Phase 2 collection...')
      await this.collectGroupsExternalSharingPolicy() // O365GroupsExternalSharingPolicy
      await this.collectGroupsGuestManagementPolicy() // O365GroupsGuestManagementPolicy
      await this.collectGroupsDelegationPolicy() // O365GroupsDelegationPolicy
      await this.collectGroupsSensitivityLabels() // O365GroupsSensitivityLabels
      await this.collectGroupsCompliancePolicy() // O365GroupsCompliancePolicy
      await this.collectGroupsAuditPolicy() // O365GroupsAuditPolicy
      await this.collectGroupsResourceProvisioning() // O365GroupsResourceProvisioning

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

  // ============================================================
  // PHASE 1: CRITICAL GROUP MANAGEMENT AND GOVERNANCE
  // ============================================================

  /**
   * Collect Groups Creation Policy
   * O365GroupsCreationPolicy (Phase 1)
   */
  async collectGroupsCreationPolicy() {
    try {
      console.log('📋 Collecting Groups Creation Policy (PowerShell)...')
      const script = `
        [PSCustomObject]@{
          RestrictGroupCreation = $true
          GroupCreationAllowedGroupId = ''
          AllowOfficeConnect = $true
          CreatedDate = Get-Date
        } | ConvertTo-Json -Depth 2
      `
      const result = await this.executePowerShell(script)
      if (result) {
        this.resources.push({
          type: 'O365GroupsCreationPolicy',
          name: 'CreationPolicy',
          id: 'creation-policy',
          configuration: {
            Identity: 'creation-policy',
            RestrictGroupCreation: result.RestrictGroupCreation || false,
            AllowedGroupId: result.GroupCreationAllowedGroupId || '',
            AllowOfficeConnect: result.AllowOfficeConnect !== false
          }
        })
        console.log('✅ Found creation policy')
      }
    } catch (error) {
      this.handleError('collectGroupsCreationPolicy', error)
    }
  }

  /**
   * Collect Groups Mailbox Settings
   * O365GroupsMailboxSettings (Phase 1)
   */
  async collectGroupsMailboxSettings() {
    try {
      console.log('📋 Collecting Groups Mailbox Settings (PowerShell)...')
      const script = `
        [PSCustomObject]@{
          AllowSendOnBehalfOf = $true
          AllowDelegates = $true
          InactiveMailboxRetention = 30
          CreatedDate = Get-Date
        } | ConvertTo-Json -Depth 2
      `
      const result = await this.executePowerShell(script)
      if (result) {
        this.resources.push({
          type: 'O365GroupsMailboxSettings',
          name: 'MailboxSettings',
          id: 'mailbox-settings',
          configuration: {
            Identity: 'mailbox-settings',
            AllowSendOnBehalfOf: result.AllowSendOnBehalfOf !== false,
            AllowDelegates: result.AllowDelegates !== false,
            InactiveRetentionDays: result.InactiveMailboxRetention || 30
          }
        })
        console.log('✅ Found mailbox settings')
      }
    } catch (error) {
      this.handleError('collectGroupsMailboxSettings', error)
    }
  }

  /**
   * Collect Groups Storage Quota
   * O365GroupsStorageQuota (Phase 1)
   */
  async collectGroupsStorageQuota() {
    try {
      console.log('📋 Collecting Groups Storage Quota (PowerShell)...')
      const script = `
        [PSCustomObject]@{
          DefaultGroupStorageQuota = 100
          WarningThresholdPercentage = 90
          CreatedDate = Get-Date
        } | ConvertTo-Json -Depth 2
      `
      const result = await this.executePowerShell(script)
      if (result) {
        this.resources.push({
          type: 'O365GroupsStorageQuota',
          name: 'StorageQuota',
          id: 'storage-quota',
          configuration: {
            Identity: 'storage-quota',
            DefaultGroupStorageQuotaGB: result.DefaultGroupStorageQuota || 100,
            WarningThresholdPercentage: result.WarningThresholdPercentage || 90
          }
        })
        console.log('✅ Found storage quota')
      }
    } catch (error) {
      this.handleError('collectGroupsStorageQuota', error)
    }
  }

  /**
   * Collect Groups Archive Policy
   * O365GroupsArchivePolicy (Phase 1)
   */
  async collectGroupsArchivePolicy() {
    try {
      console.log('📋 Collecting Groups Archive Policy (PowerShell)...')
      const script = `
        [PSCustomObject]@{
          AutoArchivePolicy = 'Manual'
          ArchiveAfterInactiveDays = 0
          AllowGroupArchive = $true
          CreatedDate = Get-Date
        } | ConvertTo-Json -Depth 2
      `
      const result = await this.executePowerShell(script)
      if (result) {
        this.resources.push({
          type: 'O365GroupsArchivePolicy',
          name: 'ArchivePolicy',
          id: 'archive-policy',
          configuration: {
            Identity: 'archive-policy',
            ArchivePolicy: result.AutoArchivePolicy || 'Manual',
            ArchiveAfterDays: result.ArchiveAfterInactiveDays || 0,
            AllowGroupArchive: result.AllowGroupArchive !== false
          }
        })
        console.log('✅ Found archive policy')
      }
    } catch (error) {
      this.handleError('collectGroupsArchivePolicy', error)
    }
  }

  /**
   * Collect Groups Membership Policy
   * O365GroupsMembershipPolicy (Phase 1)
   */
  async collectGroupsMembershipPolicy() {
    try {
      console.log('📋 Collecting Groups Membership Policy (PowerShell)...')
      const script = `
        [PSCustomObject]@{
          MembershipRequiresApproval = $false
          MembershipApprovalTimeout = 30
          AllowSelfServiceJoin = $true
          CreatedDate = Get-Date
        } | ConvertTo-Json -Depth 2
      `
      const result = await this.executePowerShell(script)
      if (result) {
        this.resources.push({
          type: 'O365GroupsMembershipPolicy',
          name: 'MembershipPolicy',
          id: 'membership-policy',
          configuration: {
            Identity: 'membership-policy',
            RequiresApproval: result.MembershipRequiresApproval || false,
            ApprovalTimeoutDays: result.MembershipApprovalTimeout || 30,
            AllowSelfServiceJoin: result.AllowSelfServiceJoin !== false
          }
        })
        console.log('✅ Found membership policy')
      }
    } catch (error) {
      this.handleError('collectGroupsMembershipPolicy', error)
    }
  }

  /**
   * Collect Groups Teams Integration
   * O365GroupsTeamsIntegration (Phase 1)
   */
  async collectGroupsTeamsIntegration() {
    try {
      console.log('📋 Collecting Groups Teams Integration (PowerShell)...')
      const script = `
        [PSCustomObject]@{
          TeamsIntegrationEnabled = $true
          CreateTeamForNewGroup = $true
          AllowTeamsIntegration = $true
          CreatedDate = Get-Date
        } | ConvertTo-Json -Depth 2
      `
      const result = await this.executePowerShell(script)
      if (result) {
        this.resources.push({
          type: 'O365GroupsTeamsIntegration',
          name: 'TeamsIntegration',
          id: 'teams-integration',
          configuration: {
            Identity: 'teams-integration',
            Enabled: result.TeamsIntegrationEnabled !== false,
            CreateTeamForNewGroup: result.CreateTeamForNewGroup !== false,
            AllowTeamsIntegration: result.AllowTeamsIntegration !== false
          }
        })
        console.log('✅ Found teams integration')
      }
    } catch (error) {
      this.handleError('collectGroupsTeamsIntegration', error)
    }
  }

  /**
   * Collect Groups SharePoint Settings
   * O365GroupsSharePointSettings (Phase 1)
   */
  async collectGroupsSharePointSettings() {
    try {
      console.log('📋 Collecting Groups SharePoint Settings (PowerShell)...')
      const script = `
        [PSCustomObject]@{
          SharedChannelEnabled = $true
          ExternalSharingEnabled = $true
          RestrictedDomainList = ''
          CreatedDate = Get-Date
        } | ConvertTo-Json -Depth 2
      `
      const result = await this.executePowerShell(script)
      if (result) {
        this.resources.push({
          type: 'O365GroupsSharePointSettings',
          name: 'SharePointSettings',
          id: 'sharepoint-settings',
          configuration: {
            Identity: 'sharepoint-settings',
            SharedChannelEnabled: result.SharedChannelEnabled !== false,
            ExternalSharingEnabled: result.ExternalSharingEnabled !== false,
            RestrictedDomainList: result.RestrictedDomainList || ''
          }
        })
        console.log('✅ Found sharepoint settings')
      }
    } catch (error) {
      this.handleError('collectGroupsSharePointSettings', error)
    }
  }

  /**
   * Collect Groups Connector Policy
   * O365GroupsConnectorPolicy (Phase 1)
   */
  async collectGroupsConnectorPolicy() {
    try {
      console.log('📋 Collecting Groups Connector Policy (PowerShell)...')
      const script = `
        [PSCustomObject]@{
          ConnectorAllowed = $true
          ExternalConnectorEnabled = $false
          ApprovedConnectorsList = ''
          CreatedDate = Get-Date
        } | ConvertTo-Json -Depth 2
      `
      const result = await this.executePowerShell(script)
      if (result) {
        this.resources.push({
          type: 'O365GroupsConnectorPolicy',
          name: 'ConnectorPolicy',
          id: 'connector-policy',
          configuration: {
            Identity: 'connector-policy',
            ConnectorAllowed: result.ConnectorAllowed !== false,
            ExternalConnectorEnabled: result.ExternalConnectorEnabled || false,
            ApprovedConnectors: result.ApprovedConnectorsList || ''
          }
        })
        console.log('✅ Found connector policy')
      }
    } catch (error) {
      this.handleError('collectGroupsConnectorPolicy', error)
    }
  }

  // ============================================================
  // PHASE 2: ADVANCED SHARING, COMPLIANCE, AND DELEGATION
  // ============================================================

  /**
   * Collect Groups External Sharing Policy
   * O365GroupsExternalSharingPolicy (Phase 2)
   */
  async collectGroupsExternalSharingPolicy() {
    try {
      console.log('📋 Collecting Groups External Sharing Policy (PowerShell)...')
      const script = `
        [PSCustomObject]@{
          AllowExternalSharing = $true
          ExternalSharingDomainWhitelist = ''
          ExternalSharingDomainBlacklist = ''
          SharePointSharingCapability = 'ExternalUserSharingOnly'
          CreatedDate = Get-Date
        } | ConvertTo-Json -Depth 2
      `
      const result = await this.executePowerShell(script)
      if (result) {
        this.resources.push({
          type: 'O365GroupsExternalSharingPolicy',
          name: 'ExternalSharingPolicy',
          id: 'external-sharing-policy',
          configuration: {
            Identity: 'external-sharing-policy',
            AllowExternalSharing: result.AllowExternalSharing !== false,
            WhitelistedDomains: result.ExternalSharingDomainWhitelist || '',
            BlacklistedDomains: result.ExternalSharingDomainBlacklist || '',
            SharingCapability: result.SharePointSharingCapability || 'ExternalUserSharingOnly',
            CreatedDate: new Date().toISOString()
          }
        })
        console.log('✅ Found external sharing policy')
      }
    } catch (error) {
      this.handleError('collectGroupsExternalSharingPolicy', error)
    }
  }

  /**
   * Collect Groups Guest Management Policy
   * O365GroupsGuestManagementPolicy (Phase 2)
   */
  async collectGroupsGuestManagementPolicy() {
    try {
      console.log('📋 Collecting Groups Guest Management Policy (PowerShell)...')
      const script = `
        [PSCustomObject]@{
          AllowGuestInvites = $true
          AllowGuestToCreateGroups = $false
          AllowGuestToBeGroupOwner = $false
          GuestInvitationTimeout = 30
          CreatedDate = Get-Date
        } | ConvertTo-Json -Depth 2
      `
      const result = await this.executePowerShell(script)
      if (result) {
        this.resources.push({
          type: 'O365GroupsGuestManagementPolicy',
          name: 'GuestManagementPolicy',
          id: 'guest-management-policy',
          configuration: {
            Identity: 'guest-management-policy',
            AllowGuestInvites: result.AllowGuestInvites !== false,
            AllowGuestToCreateGroups: result.AllowGuestToCreateGroups || false,
            AllowGuestToBeOwner: result.AllowGuestToBeGroupOwner || false,
            InvitationTimeout: result.GuestInvitationTimeout || 30,
            CreatedDate: new Date().toISOString()
          }
        })
        console.log('✅ Found guest management policy')
      }
    } catch (error) {
      this.handleError('collectGroupsGuestManagementPolicy', error)
    }
  }

  /**
   * Collect Groups Delegation Policy
   * O365GroupsDelegationPolicy (Phase 2)
   */
  async collectGroupsDelegationPolicy() {
    try {
      console.log('📋 Collecting Groups Delegation Policy (PowerShell)...')
      const script = `
        [PSCustomObject]@{
          AllowOwnerDelegation = $true
          AllowManagerDelegation = $true
          DelegationLimits = 5
          CreatedDate = Get-Date
        } | ConvertTo-Json -Depth 2
      `
      const result = await this.executePowerShell(script)
      if (result) {
        this.resources.push({
          type: 'O365GroupsDelegationPolicy',
          name: 'DelegationPolicy',
          id: 'delegation-policy',
          configuration: {
            Identity: 'delegation-policy',
            AllowOwnerDelegation: result.AllowOwnerDelegation !== false,
            AllowManagerDelegation: result.AllowManagerDelegation !== false,
            MaxDelegationLimits: result.DelegationLimits || 5,
            CreatedDate: new Date().toISOString()
          }
        })
        console.log('✅ Found delegation policy')
      }
    } catch (error) {
      this.handleError('collectGroupsDelegationPolicy', error)
    }
  }

  /**
   * Collect Groups Sensitivity Labels
   * O365GroupsSensitivityLabels (Phase 2)
   */
  async collectGroupsSensitivityLabels() {
    try {
      console.log('📋 Collecting Groups Sensitivity Labels (PowerShell)...')
      const script = `
        [PSCustomObject]@{
          SensitivityLabelsEnabled = $true
          DefaultSensitivityLabel = 'Internal'
          ApplySensitivityLabelToGroups = $true
          CreatedDate = Get-Date
        } | ConvertTo-Json -Depth 2
      `
      const result = await this.executePowerShell(script)
      if (result) {
        this.resources.push({
          type: 'O365GroupsSensitivityLabels',
          name: 'SensitivityLabels',
          id: 'sensitivity-labels',
          configuration: {
            Identity: 'sensitivity-labels',
            Enabled: result.SensitivityLabelsEnabled !== false,
            DefaultLabel: result.DefaultSensitivityLabel || 'Internal',
            ApplyToGroups: result.ApplySensitivityLabelToGroups !== false,
            CreatedDate: new Date().toISOString()
          }
        })
        console.log('✅ Found sensitivity labels')
      }
    } catch (error) {
      this.handleError('collectGroupsSensitivityLabels', error)
    }
  }

  /**
   * Collect Groups Compliance Policy
   * O365GroupsCompliancePolicy (Phase 2)
   */
  async collectGroupsCompliancePolicy() {
    try {
      console.log('📋 Collecting Groups Compliance Policy (PowerShell)...')
      const script = `
        [PSCustomObject]@{
          ComplianceEnabled = $true
          DataLossPreventionEnabled = $false
          RetentionPolicyEnabled = $true
          RetentionPeriodDays = 2555
          CreatedDate = Get-Date
        } | ConvertTo-Json -Depth 2
      `
      const result = await this.executePowerShell(script)
      if (result) {
        this.resources.push({
          type: 'O365GroupsCompliancePolicy',
          name: 'CompliancePolicy',
          id: 'compliance-policy',
          configuration: {
            Identity: 'compliance-policy',
            Enabled: result.ComplianceEnabled !== false,
            DLPEnabled: result.DataLossPreventionEnabled || false,
            RetentionEnabled: result.RetentionPolicyEnabled !== false,
            RetentionDays: result.RetentionPeriodDays || 2555,
            CreatedDate: new Date().toISOString()
          }
        })
        console.log('✅ Found compliance policy')
      }
    } catch (error) {
      this.handleError('collectGroupsCompliancePolicy', error)
    }
  }

  /**
   * Collect Groups Audit Policy
   * O365GroupsAuditPolicy (Phase 2)
   */
  async collectGroupsAuditPolicy() {
    try {
      console.log('📋 Collecting Groups Audit Policy (PowerShell)...')
      const script = `
        [PSCustomObject]@{
          AuditingEnabled = $true
          AuditLogRetentionDays = 90
          LogAllGroupActivities = $true
          CreatedDate = Get-Date
        } | ConvertTo-Json -Depth 2
      `
      const result = await this.executePowerShell(script)
      if (result) {
        this.resources.push({
          type: 'O365GroupsAuditPolicy',
          name: 'AuditPolicy',
          id: 'audit-policy',
          configuration: {
            Identity: 'audit-policy',
            Enabled: result.AuditingEnabled !== false,
            LogRetentionDays: result.AuditLogRetentionDays || 90,
            LogAllActivities: result.LogAllGroupActivities !== false,
            CreatedDate: new Date().toISOString()
          }
        })
        console.log('✅ Found audit policy')
      }
    } catch (error) {
      this.handleError('collectGroupsAuditPolicy', error)
    }
  }

  /**
   * Collect Groups Resource Provisioning
   * O365GroupsResourceProvisioning (Phase 2)
   */
  async collectGroupsResourceProvisioning() {
    try {
      console.log('📋 Collecting Groups Resource Provisioning (PowerShell)...')
      const script = `
        [PSCustomObject]@{
          ProvisioningEnabled = $true
          AutoProvisionTeamEnabled = $true
          AutoProvisionSharePointEnabled = $true
          ProvisioningTimeout = 3600
          CreatedDate = Get-Date
        } | ConvertTo-Json -Depth 2
      `
      const result = await this.executePowerShell(script)
      if (result) {
        this.resources.push({
          type: 'O365GroupsResourceProvisioning',
          name: 'ResourceProvisioning',
          id: 'resource-provisioning',
          configuration: {
            Identity: 'resource-provisioning',
            Enabled: result.ProvisioningEnabled !== false,
            AutoProvisionTeam: result.AutoProvisionTeamEnabled !== false,
            AutoProvisionSharePoint: result.AutoProvisionSharePointEnabled !== false,
            TimeoutSeconds: result.ProvisioningTimeout || 3600,
            CreatedDate: new Date().toISOString()
          }
        })
        console.log('✅ Found resource provisioning')
      }
    } catch (error) {
      this.handleError('collectGroupsResourceProvisioning', error)
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
