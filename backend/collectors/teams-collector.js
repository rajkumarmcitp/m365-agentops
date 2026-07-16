/**
 * Teams Online Backup Collector
 * Collects and backs up Microsoft Teams configurations
 *
 * Resources:
 * - TeamsTeam
 * - TeamsChannel
 * - TeamsChannelTab
 * - TeamsUser
 * - TeamsMeetingPolicy
 * - TeamsChannelPolicy
 * - TeamsDialInConferencingPolicy
 * - TeamsEmergencyCallingPolicy
 * - TeamsUpgradeConfiguration
 * - TeamsNetworkRoamingPolicy
 */

export class TeamsCollector {
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
   * Main collect method - gather all Teams configurations
   */
  async collect() {
    try {
      console.log('🔄 Starting Teams backup collection...')
      const startTime = Date.now()

      // Reset state for fresh collection
      this.resources = []
      this.errors = []

      // Phase 1: Critical Teams Resources Collection
      console.log('📊 Starting Teams Phase 1 collection (messaging, meetings, voice, user access)...')

      // Base Teams structure
      await this.collectTeams()
      await this.collectChannels()
      await this.collectChannelTabs()
      await this.collectTeamsUsers()

      // Phase 1 - Messaging & Communication (8 resources)
      await this.collectTeamsPolicies() // TeamsChannelPolicy
      await this.collectChannelMessagingPolicy() // TeamsChannelMessagingPolicy
      await this.collectChannelModeration() // TeamsChannelModeration
      await this.collectConnectorPolicy() // TeamsConnectorPolicy
      await this.collectAppPermissionPolicy() // TeamsAppPermissionPolicy
      await this.collectAppSetupPolicy()
      await this.collectEventsPolicy() // TeamsEventsPolicy
      await this.collectClientConfiguration() // TeamsClientConfiguration

      // Phase 1 - Meeting Policies (8 resources)
      await this.collectMeetingConfiguration() // TeamsMeetingPolicy (via PowerShell)
      await this.collectGuestMeetingConfiguration() // TeamsGuestMeetingConfiguration
      await this.collectBroadcastConfiguration() // TeamsMeetingBroadcastConfiguration
      await this.collectBroadcastPolicy() // TeamsMeetingBroadcastPolicy
      await this.collectDialInConferencingPolicy() // TeamsDialInConferencingPolicy
      await this.collectComplianceRecordingPolicy() // TeamsComplianceRecordingPolicy
      await this.collectMediaLoggingPolicy() // TeamsMediaLoggingPolicy
      await this.collectUpgradeConfiguration() // TeamsUpgradeConfiguration

      // Phase 1 - Voice & Routing (8 resources)
      await this.collectCalling() // TeamsCalling
      await this.collectCallingPolicy() // TeamsCallingPolicy
      await this.collectCallingLineIdentity() // TeamsCallingLineIdentity
      await this.collectVoiceRoute() // TeamsVoiceRoute
      await this.collectPstnUsage() // TeamsPstnUsage
      await this.collectOnlineVoiceRoutingPolicy() // TeamsOnlineVoiceRoutingPolicy
      await this.collectAutoAttendant() // TeamsAutoAttendant
      await this.collectCallQueue() // TeamsCallQueue

      // Phase 1 - User & Access Control (8+ resources)
      await this.collectExternalAccessPolicy() // TeamsExternalAccessPolicy
      await this.collectInteropPolicy() // TeamsInteropPolicy
      await this.collectNetworkRoamingPolicy() // TeamsNetworkRoamingPolicy
      await this.collectIPPhonePolicy() // TeamsIPPhonePolicy
      await this.collectDeviceConfiguration() // TeamsDeviceConfiguration
      await this.collectGuestCallingConfiguration() // TeamsGuestCallingConfiguration
      await this.collectGuestMessagingConfiguration() // TeamsGuestMessagingConfiguration
      await this.collectUnassignedNumberTreatment() // TeamsUnassignedNumberTreatment
      await this.collectShiftsPolicy() // TeamsShiftsPolicy
      await this.collectCallPark() // TeamsCallPark

      // PowerShell collection - advanced Teams policies
      console.log('📊 Starting PowerShell-based collection for advanced Teams policies...')
      await this.collectTeamsAppPoliciesPowerShell() // TeamsAppSetupPolicy
      await this.collectTeamsMessagingPoliciesPowerShell() // TeamsMessagingPolicy
      await this.collectResourceAccountsPowerShell() // TeamsResourceAccount

      const executionTime = Math.round((Date.now() - startTime) / 1000)
      console.log(`✅ Teams backup complete (${executionTime}s, ${this.resources.length} resources)`)

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
      console.error('❌ Teams collection failed:', error.message)
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
   * Collect Teams (Comprehensive with Details)
   * TeamsTeam
   */
  async collectTeams() {
    try {
      console.log('📋 Collecting Teams (Comprehensive)...')

      const response = await this.graphClient
        .api('/teams')
        .select('id,displayName,description,visibility,mailNickname,isArchived,classification,webUrl,createdDateTime,internalId,specialization,templateId,memberSettings,messagingSettings,discoverySettings,guestSettings,funSettings,resourceBehaviorOptions')
        .top(999)
        .get()

      if (response.value && response.value.length > 0) {
        for (const team of response.value) {
          // Collect members for this team
          let members = []
          let memberDetails = []
          try {
            const membersResponse = await this.graphClient
              .api(`/teams/${team.id}/members`)
              .select('id,displayName,userPrincipalName,email,roles')
              .top(999)
              .get()

            if (membersResponse.value) {
              memberDetails = membersResponse.value.map(m => ({
                Identity: m.id,
                DisplayName: m.displayName,
                UserPrincipalName: m.userPrincipalName || m.email,
                Email: m.email || '',
                Roles: m.roles || []
              }))
            }
          } catch (e) {
            console.warn(`⚠️ Could not fetch members for team ${team.displayName}`)
          }

          this.resources.push({
            type: 'TeamsTeam',
            name: team.displayName,
            id: team.id,
            configuration: {
              Identity: team.id,
              DisplayName: team.displayName,
              Description: team.description || '',
              Visibility: team.visibility || 'Private',
              MailNickname: team.mailNickname || '',
              IsArchived: team.isArchived || false,
              Classification: team.classification || '',
              SPSiteUrl: team.webUrl || '',
              CreatedDateTime: team.createdDateTime || new Date().toISOString(),
              InternalId: team.internalId || team.id,
              Specialization: team.specialization || 'None',
              TemplateId: team.templateId || '',
              MemberCount: memberDetails.length,
              Members: memberDetails,
              Channels: [],
              OwnerCount: memberDetails.filter(m => m.Roles?.includes('owner')).length,
              Owners: memberDetails.filter(m => m.Roles?.includes('owner')),
              MemberSettings: {
                AllowCreateUpdateChannels: team.memberSettings?.allowCreateUpdateChannels ?? true,
                AllowDeleteChannels: team.memberSettings?.allowDeleteChannels ?? true,
                AllowAddRemoveApps: team.memberSettings?.allowAddRemoveApps ?? true,
                AllowCreateUpdateRemoveTabs: team.memberSettings?.allowCreateUpdateRemoveTabs ?? true,
                AllowCreateUpdateRemoveConnectors: team.memberSettings?.allowCreateUpdateRemoveConnectors ?? true
              },
              MessagingSettings: {
                AllowUserEditMessages: team.messagingSettings?.allowUserEditMessages ?? true,
                AllowUserDeleteMessages: team.messagingSettings?.allowUserDeleteMessages ?? true,
                AllowOwnerDeleteMessages: team.messagingSettings?.allowOwnerDeleteMessages ?? true,
                AllowTeamMentions: team.messagingSettings?.allowTeamMentions ?? true,
                AllowChannelMentions: team.messagingSettings?.allowChannelMentions ?? true,
                AllowUserGiphySearch: team.messagingSettings?.allowUserGiphySearch ?? true
              },
              GuestSettings: {
                AllowCreateUpdateChannels: team.guestSettings?.allowCreateUpdateChannels ?? false,
                AllowDeleteChannels: team.guestSettings?.allowDeleteChannels ?? false
              },
              FunSettings: {
                AllowGiphy: team.funSettings?.allowGiphy ?? true,
                GiphyContentRating: team.funSettings?.giphyContentRating || 'Moderate',
                AllowStickersAndMemes: team.funSettings?.allowStickersAndMemes ?? true,
                AllowCustomMemes: team.funSettings?.allowCustomMemes ?? true
              },
              DiscoverySettings: {
                ShowInTeamsSearchAndSuggestions: team.discoverySettings?.showInTeamsSearchAndSuggestions ?? true
              },
              ResourceBehaviorOptions: team.resourceBehaviorOptions || []
            }
          })
        }
        console.log(`✅ Found ${response.value.length} teams with comprehensive details`)

        // Collect channels for each team
        for (const team of response.value) {
          await this.collectTeamChannels(team.id, team.displayName)
        }
      }
    } catch (error) {
      this.handleError('collectTeams', error)
    }
  }

  /**
   * Collect channels for a specific team (Comprehensive)
   */
  async collectTeamChannels(teamId, teamName) {
    try {
      const channelResponse = await this.graphClient
        .api(`/teams/${teamId}/channels`)
        .select('id,displayName,description,isFavoriteByDefault,email,webUrl,createdDateTime,membershipType,moderationSettings')
        .top(999)
        .get()

      if (channelResponse.value && channelResponse.value.length > 0) {
        // Find team resource and update channels list
        const teamResource = this.resources.find(
          r => r.type === 'TeamsTeam' && r.id === teamId
        )

        if (teamResource) {
          teamResource.configuration.Channels = channelResponse.value.map(c => ({
            id: c.id,
            displayName: c.displayName,
            description: c.description,
            membershipType: c.membershipType || 'standard',
            email: c.email
          }))
        }

        console.log(`  └─ ${teamName}: ${channelResponse.value.length} channels`)

        // Collect individual channels with detailed information
        for (const channel of channelResponse.value) {
          // Collect channel members
          let channelMembers = []
          try {
            const membersResponse = await this.graphClient
              .api(`/teams/${teamId}/channels/${channel.id}/members`)
              .select('id,displayName,userPrincipalName,email,roles')
              .top(999)
              .get()

            if (membersResponse.value) {
              channelMembers = membersResponse.value.map(m => ({
                Identity: m.id,
                DisplayName: m.displayName,
                UserPrincipalName: m.userPrincipalName || m.email,
                Email: m.email || '',
                Roles: m.roles || []
              }))
            }
          } catch (e) {
            console.warn(`⚠️ Could not fetch members for channel ${channel.displayName}`)
          }

          // Collect channel tabs
          let channelTabs = []
          try {
            const tabsResponse = await this.graphClient
              .api(`/teams/${teamId}/channels/${channel.id}/tabs`)
              .select('id,displayName,name,webUrl,configuration,teamsApp')
              .top(999)
              .get()

            if (tabsResponse.value) {
              channelTabs = tabsResponse.value.map(t => ({
                Identity: t.id,
                DisplayName: t.displayName || t.name,
                Name: t.name,
                WebUrl: t.webUrl || '',
                AppId: t.teamsApp?.id || '',
                AppName: t.teamsApp?.displayName || ''
              }))
            }
          } catch (e) {
            console.warn(`⚠️ Could not fetch tabs for channel ${channel.displayName}`)
          }

          this.resources.push({
            type: 'TeamsChannel',
            name: channel.displayName,
            id: channel.id,
            configuration: {
              Identity: channel.id,
              TeamId: teamId,
              TeamName: teamName,
              DisplayName: channel.displayName,
              Description: channel.description || '',
              IsFavoriteByDefault: channel.isFavoriteByDefault || false,
              Email: channel.email || '',
              WebUrl: channel.webUrl || '',
              CreatedDateTime: channel.createdDateTime || new Date().toISOString(),
              MembershipType: channel.membershipType || 'standard',
              MemberCount: channelMembers.length,
              Members: channelMembers,
              TabCount: channelTabs.length,
              Tabs: channelTabs,
              ModerationSettings: {
                UserNewMessageRestriction: channel.moderationSettings?.userNewMessageRestriction || 'everyone',
                ReplyRestriction: channel.moderationSettings?.replyRestriction || 'everyone',
                AllowNewMessageFromBots: channel.moderationSettings?.allowNewMessageFromBots ?? true,
                AllowNewMessageFromConnectors: channel.moderationSettings?.allowNewMessageFromConnectors ?? true
              }
            }
          })
        }
      }
    } catch (error) {
      this.handleError(`collectTeamChannels(${teamName})`, error)
    }
  }

  /**
   * Collect Channels (already collected with teams)
   * TeamsChannel
   */
  async collectChannels() {
    // Channels are collected with teams
    console.log('📋 Teams channels already collected with teams')
  }

  /**
   * Collect Channel Tabs
   * TeamsChannelTab
   */
  async collectChannelTabs() {
    try {
      console.log('📋 Collecting Teams channel tabs...')

      let tabCount = 0
      const teams = this.resources.filter(r => r.type === 'TeamsTeam')

      for (const teamRes of teams) {
        const teamId = teamRes.id
        const channels = this.resources.filter(
          r => r.type === 'TeamsChannel' && r.configuration.TeamId === teamId
        )

        for (const channelRes of channels) {
          try {
            const tabResponse = await this.graphClient
              .api(`/teams/${teamId}/channels/${channelRes.id}/tabs`)
              .top(999)
              .get()

            if (tabResponse.value && tabResponse.value.length > 0) {
              for (const tab of tabResponse.value) {
                this.resources.push({
                  type: 'TeamsChannelTab',
                  name: tab.displayName,
                  id: tab.id,
                  configuration: {
                    Identity: tab.id,
                    ChannelId: channelRes.id,
                    ChannelName: channelRes.configuration.DisplayName,
                    TeamId: teamId,
                    TeamName: teamRes.configuration.DisplayName,
                    DisplayName: tab.displayName,
                    AppDefinitionId: tab.teamsApp?.id || '',
                    AppName: tab.teamsApp?.displayName || '',
                    WebUrl: tab.webUrl || '',
                    Configuration: tab.configuration || {}
                  }
                })
                tabCount++
              }
            }
          } catch (error) {
            // Silently continue if tab collection fails for a channel
            continue
          }
        }
      }

      console.log(`✅ Found ${tabCount} channel tabs`)
    } catch (error) {
      this.handleError('collectChannelTabs', error)
    }
  }

  /**
   * Collect Teams Users
   * TeamsUser
   */
  async collectTeamsUsers() {
    try {
      console.log('📋 Collecting Teams users...')

      let userCount = 0
      const teams = this.resources.filter(r => r.type === 'TeamsTeam')

      for (const teamRes of teams) {
        try {
          const teamId = teamRes.id
          const memberResponse = await this.graphClient
            .api(`/teams/${teamId}/members`)
            .top(999)
            .get()

          if (memberResponse.value && memberResponse.value.length > 0) {
            for (const member of memberResponse.value) {
              this.resources.push({
                type: 'TeamsUser',
                name: member.displayName,
                id: member.id,
                configuration: {
                  Identity: member.id,
                  TeamId: teamId,
                  TeamName: teamRes.configuration.DisplayName,
                  DisplayName: member.displayName,
                  Email: member.email || '',
                  UserPrincipalName: member.userPrincipalName || '',
                  Roles: member.roles || [],
                  Type: member['@odata.type'] || ''
                }
              })
              userCount++
            }
          }
        } catch (error) {
          // Silently continue if member collection fails for a team
          continue
        }
      }

      console.log(`✅ Found ${userCount} teams users`)
    } catch (error) {
      this.handleError('collectTeamsUsers', error)
    }
  }

  /**
   * Collect Teams Meeting Configuration
   * TeamsMeetingPolicy (handled via PowerShell)
   */
  async collectMeetingConfiguration() {
    // Meeting policies collected via collectTeamsPoliciesPowerShell()
    console.log('📋 Teams meeting policies collected via PowerShell...')
  }

  /**
   * Collect Teams Policies and Settings
   * TeamsChannelPolicy - Channel message deletion and editing (Phase 1)
   */
  async collectTeamsPolicies() {
    try {
      console.log('📋 Collecting Teams Channel Policies (PowerShell)...')
      const script = `
        @((Get-CsTeamsChannelModeratedPolicy -ErrorAction SilentlyContinue) |
          ForEach-Object {
            [PSCustomObject]@{
              Identity = $_.Identity
              DisplayName = $_.DisplayName
              Description = $_.Description
              ChannelModeratedByDefault = $_.ChannelModeratedByDefault
              NewMembersCanPostMessages = $_.NewMembersCanPostMessages
              CreatedDate = $_.WhenCreated
            }
          } |
          ConvertTo-Json -Depth 2)
      `
      const result = await this.executePowerShell(script)
      if (result && Array.isArray(result)) {
        for (const policy of result) {
          this.resources.push({
            type: 'TeamsChannelPolicy',
            name: policy.DisplayName || policy.Identity,
            id: policy.Identity,
            configuration: {
              Identity: policy.Identity,
              DisplayName: policy.DisplayName || '',
              Description: policy.Description || '',
              ChannelModeratedByDefault: policy.ChannelModeratedByDefault || false,
              NewMembersCanPostMessages: policy.NewMembersCanPostMessages !== false,
              CreatedDate: policy.CreatedDate || new Date().toISOString()
            }
          })
        }
        console.log(`✅ Found ${result.length} Teams channel policies`)
      }
    } catch (error) {
      this.handleError('collectTeamsPolicies', error)
    }
  }

  /**
   * Collect App Permission Policy
   * TeamsAppPermissionPolicy (Phase 1)
   */
  async collectAppPermissionPolicy() {
    try {
      console.log('📋 Collecting Teams App Permission Policy (PowerShell)...')
      const script = `
        @((Get-CsTeamsAppPermissionPolicy -ErrorAction SilentlyContinue) |
          ForEach-Object {
            [PSCustomObject]@{
              Identity = $_.Identity
              DisplayName = $_.DisplayName
              Description = $_.Description
              DefaultCatalogAppsType = $_.DefaultCatalogAppsType
              GlobalCatalogAppsType = $_.GlobalCatalogAppsType
              PrivateCatalogAppsType = $_.PrivateCatalogAppsType
              CreatedDate = $_.WhenCreated
            }
          } |
          ConvertTo-Json -Depth 2)
      `
      const result = await this.executePowerShell(script)
      if (result && Array.isArray(result)) {
        for (const policy of result) {
          this.resources.push({
            type: 'TeamsAppPermissionPolicy',
            name: policy.DisplayName || policy.Identity,
            id: policy.Identity,
            configuration: {
              Identity: policy.Identity,
              DisplayName: policy.DisplayName || '',
              Description: policy.Description || '',
              DefaultCatalogAppsType: policy.DefaultCatalogAppsType || 'Allow',
              GlobalCatalogAppsType: policy.GlobalCatalogAppsType || 'Allow',
              PrivateCatalogAppsType: policy.PrivateCatalogAppsType || 'Allow',
              CreatedDate: policy.CreatedDate || new Date().toISOString()
            }
          })
        }
        console.log(`✅ Found ${result.length} Teams app permission policies`)
      }
    } catch (error) {
      this.handleError('collectAppPermissionPolicy', error)
    }
  }

  /**
   * Collect App Setup Policy
   * TeamsAppSetupPolicy (handled via PowerShell)
   */
  async collectAppSetupPolicy() {
    // App setup policies collected via collectTeamsAppPoliciesPowerShell()
    console.log('📋 Teams app setup policies collected via PowerShell...')
  }

  /**
   * Collect Auto Attendant
   * TeamsAutoAttendant (Phase 1)
   */
  async collectAutoAttendant() {
    try {
      console.log('📋 Collecting Teams Auto Attendant (PowerShell)...')
      const script = `
        @((Get-CsAutoAttendant -ErrorAction SilentlyContinue) |
          ForEach-Object {
            [PSCustomObject]@{
              Identity = $_.Identity
              Name = $_.Name
              LanguageId = $_.LanguageId
              TimeZoneId = $_.TimeZoneId
              VoiceId = $_.VoiceId
              CallFlowsCount = @($_.CallFlows).Count
              CreatedDate = $_.DateTimeCreated
            }
          } |
          ConvertTo-Json -Depth 2)
      `
      const result = await this.executePowerShell(script)
      if (result && Array.isArray(result)) {
        for (const aa of result) {
          this.resources.push({
            type: 'TeamsAutoAttendant',
            name: aa.Name,
            id: aa.Identity,
            configuration: {
              Identity: aa.Identity,
              Name: aa.Name || '',
              LanguageId: aa.LanguageId || 'en-US',
              TimeZoneId: aa.TimeZoneId || 'UTC',
              VoiceId: aa.VoiceId || 'en-US-AriaNeural',
              CallFlowsCount: aa.CallFlowsCount || 0,
              CreatedDate: aa.CreatedDate || new Date().toISOString()
            }
          })
        }
        console.log(`✅ Found ${result.length} auto attendants`)
      }
    } catch (error) {
      this.handleError('collectAutoAttendant', error)
    }
  }

  /**
   * Collect Call Park
   * TeamsCallPark (Phase 1)
   */
  async collectCallPark() {
    try {
      console.log('📋 Collecting Teams Call Park Configuration (PowerShell)...')
      const script = `
        @((Get-CsCallParkPolicy -ErrorAction SilentlyContinue) |
          ForEach-Object {
            [PSCustomObject]@{
              Identity = $_.Identity
              DisplayName = $_.DisplayName
              Description = $_.Description
              CallParkEnabled = $_.CallParkEnabled
              ParkTimeoutSeconds = $_.ParkTimeoutSeconds
              CreatedDate = $_.WhenCreated
            }
          } |
          ConvertTo-Json -Depth 2)
      `
      const result = await this.executePowerShell(script)
      if (result && Array.isArray(result)) {
        for (const policy of result) {
          this.resources.push({
            type: 'TeamsCallPark',
            name: policy.DisplayName || policy.Identity,
            id: policy.Identity,
            configuration: {
              Identity: policy.Identity,
              DisplayName: policy.DisplayName || '',
              Description: policy.Description || '',
              CallParkEnabled: policy.CallParkEnabled !== false,
              ParkTimeoutSeconds: policy.ParkTimeoutSeconds || 300,
              CreatedDate: policy.CreatedDate || new Date().toISOString()
            }
          })
        }
        console.log(`✅ Found ${result.length} call park policies`)
      }
    } catch (error) {
      this.handleError('collectCallPark', error)
    }
  }

  /**
   * Collect Call Queue
   * TeamsCallQueue (Phase 1)
   */
  async collectCallQueue() {
    try {
      console.log('📋 Collecting Teams Call Queue (PowerShell)...')
      const script = `
        @((Get-CsCallQueue -ErrorAction SilentlyContinue) |
          ForEach-Object {
            [PSCustomObject]@{
              Identity = $_.Identity
              Name = $_.Name
              LanguageId = $_.LanguageId
              OverflowAction = $_.OverflowAction
              OverflowThreshold = $_.OverflowThreshold
              TimeoutAction = $_.TimeoutAction
              TimeoutThreshold = $_.TimeoutThreshold
              AgentsCount = @($_.Agents).Count
              CreatedDate = $_.DateTimeCreated
            }
          } |
          ConvertTo-Json -Depth 2)
      `
      const result = await this.executePowerShell(script)
      if (result && Array.isArray(result)) {
        for (const queue of result) {
          this.resources.push({
            type: 'TeamsCallQueue',
            name: queue.Name,
            id: queue.Identity,
            configuration: {
              Identity: queue.Identity,
              Name: queue.Name || '',
              LanguageId: queue.LanguageId || 'en-US',
              OverflowAction: queue.OverflowAction || 'Disconnect',
              OverflowThreshold: queue.OverflowThreshold || 10,
              TimeoutAction: queue.TimeoutAction || 'Disconnect',
              TimeoutThreshold: queue.TimeoutThreshold || 120,
              AgentsCount: queue.AgentsCount || 0,
              CreatedDate: queue.CreatedDate || new Date().toISOString()
            }
          })
        }
        console.log(`✅ Found ${result.length} call queues`)
      }
    } catch (error) {
      this.handleError('collectCallQueue', error)
    }
  }

  /**
   * Collect Calling Configuration
   * TeamsCalling - User calling settings (Phase 1)
   */
  async collectCalling() {
    try {
      console.log('📋 Collecting Teams Calling Configuration (PowerShell)...')
      const script = `
        @((Get-CsTeamsCallingPolicy -ErrorAction SilentlyContinue) |
          ForEach-Object {
            [PSCustomObject]@{
              Identity = $_.Identity
              DisplayName = $_.DisplayName
              Description = $_.Description
              AllowPrivateCalling = $_.AllowPrivateCalling
              AllowCloudRecordingForCalls = $_.AllowCloudRecordingForCalls
              AllowTranscriptionForCalling = $_.AllowTranscriptionForCalling
              BusyOnBusyEnabledType = $_.BusyOnBusyEnabledType
              CreatedDate = $_.WhenCreated
            }
          } |
          ConvertTo-Json -Depth 2)
      `
      const result = await this.executePowerShell(script)
      if (result && Array.isArray(result)) {
        for (const policy of result) {
          this.resources.push({
            type: 'TeamsCalling',
            name: policy.DisplayName || policy.Identity,
            id: policy.Identity,
            configuration: {
              Identity: policy.Identity,
              DisplayName: policy.DisplayName || '',
              Description: policy.Description || '',
              AllowPrivateCalling: policy.AllowPrivateCalling !== false,
              AllowCloudRecordingForCalls: policy.AllowCloudRecordingForCalls !== false,
              AllowTranscriptionForCalling: policy.AllowTranscriptionForCalling !== false,
              BusyOnBusyEnabledType: policy.BusyOnBusyEnabledType || 'Disabled',
              CreatedDate: policy.CreatedDate || new Date().toISOString()
            }
          })
        }
        console.log(`✅ Found ${result.length} Teams calling policies`)
      }
    } catch (error) {
      this.handleError('collectCalling', error)
    }
  }

  /**
   * Collect Calling Line Identity
   * TeamsCallingLineIdentity (Phase 1)
   */
  async collectCallingLineIdentity() {
    try {
      console.log('📋 Collecting Teams Calling Line Identity (PowerShell)...')
      const script = `
        @((Get-CsCallingLineIdentity -ErrorAction SilentlyContinue) |
          ForEach-Object {
            [PSCustomObject]@{
              Identity = $_.Identity
              Description = $_.Description
              LineUri = $_.LineUri
              CompanyName = $_.CompanyName
              DisplayName = $_.DisplayName
              ServiceNumber = $_.ServiceNumber
              CreatedDate = $_.WhenCreated
            }
          } |
          ConvertTo-Json -Depth 2)
      `
      const result = await this.executePowerShell(script)
      if (result && Array.isArray(result)) {
        for (const identity of result) {
          this.resources.push({
            type: 'TeamsCallingLineIdentity',
            name: identity.DisplayName || identity.LineUri,
            id: identity.Identity,
            configuration: {
              Identity: identity.Identity,
              DisplayName: identity.DisplayName || '',
              Description: identity.Description || '',
              LineUri: identity.LineUri || '',
              CompanyName: identity.CompanyName || '',
              ServiceNumber: identity.ServiceNumber || '',
              CreatedDate: identity.CreatedDate || new Date().toISOString()
            }
          })
        }
        console.log(`✅ Found ${result.length} calling line identities`)
      }
    } catch (error) {
      this.handleError('collectCallingLineIdentity', error)
    }
  }

  /**
   * Collect Calling Policy
   * TeamsCallingPolicy (Phase 1)
   */
  async collectCallingPolicy() {
    try {
      console.log('📋 Collecting Teams Calling Policy (PowerShell)...')
      const script = `
        @((Get-CsTeamsCallingPolicy -ErrorAction SilentlyContinue) |
          ForEach-Object {
            [PSCustomObject]@{
              Identity = $_.Identity
              DisplayName = $_.DisplayName
              Description = $_.Description
              AllowPrivateCalling = $_.AllowPrivateCalling
              AllowGroupCalling = $_.AllowGroupCalling
              AllowCloudRecordingForCalls = $_.AllowCloudRecordingForCalls
              AllowTranscriptionForCalling = $_.AllowTranscriptionForCalling
              CreatedDate = $_.WhenCreated
            }
          } |
          ConvertTo-Json -Depth 2)
      `
      const result = await this.executePowerShell(script)
      if (result && Array.isArray(result)) {
        for (const policy of result) {
          this.resources.push({
            type: 'TeamsCallingPolicy',
            name: policy.DisplayName || policy.Identity,
            id: policy.Identity,
            configuration: {
              Identity: policy.Identity,
              DisplayName: policy.DisplayName || '',
              Description: policy.Description || '',
              AllowPrivateCalling: policy.AllowPrivateCalling !== false,
              AllowGroupCalling: policy.AllowGroupCalling !== false,
              AllowCloudRecordingForCalls: policy.AllowCloudRecordingForCalls !== false,
              AllowTranscriptionForCalling: policy.AllowTranscriptionForCalling !== false,
              CreatedDate: policy.CreatedDate || new Date().toISOString()
            }
          })
        }
        console.log(`✅ Found ${result.length} Teams calling policies`)
      }
    } catch (error) {
      this.handleError('collectCallingPolicy', error)
    }
  }

  /**
   * Collect Channel Messaging Policy
   * TeamsChannelMessagingPolicy (Phase 1)
   */
  async collectChannelMessagingPolicy() {
    try {
      console.log('📋 Collecting Teams Channel Messaging Policy (PowerShell)...')
      const script = `
        @((Get-CsTeamsChannelMessagingPolicy -ErrorAction SilentlyContinue) |
          ForEach-Object {
            [PSCustomObject]@{
              Identity = $_.Identity
              DisplayName = $_.DisplayName
              Description = $_.Description
              AllowUserEditMessages = $_.AllowUserEditMessages
              AllowUserDeleteMessages = $_.AllowUserDeleteMessages
              AllowOwnerDeleteMessages = $_.AllowOwnerDeleteMessages
              AllowUserChat = $_.AllowUserChat
              CreatedDate = $_.WhenCreated
            }
          } |
          ConvertTo-Json -Depth 2)
      `
      const result = await this.executePowerShell(script)
      if (result && Array.isArray(result)) {
        for (const policy of result) {
          this.resources.push({
            type: 'TeamsChannelMessagingPolicy',
            name: policy.DisplayName || policy.Identity,
            id: policy.Identity,
            configuration: {
              Identity: policy.Identity,
              DisplayName: policy.DisplayName || '',
              Description: policy.Description || '',
              AllowUserEditMessages: policy.AllowUserEditMessages !== false,
              AllowUserDeleteMessages: policy.AllowUserDeleteMessages !== false,
              AllowOwnerDeleteMessages: policy.AllowOwnerDeleteMessages !== false,
              AllowUserChat: policy.AllowUserChat !== false,
              CreatedDate: policy.CreatedDate || new Date().toISOString()
            }
          })
        }
        console.log(`✅ Found ${result.length} Teams channel messaging policies`)
      }
    } catch (error) {
      this.handleError('collectChannelMessagingPolicy', error)
    }
  }

  /**
   * Collect Channel Moderation
   * TeamsChannelModeration (Phase 1)
   */
  async collectChannelModeration() {
    try {
      console.log('📋 Collecting Teams Channel Moderation (PowerShell)...')
      const script = `
        @((Get-CsTeamsChannelModeratedPolicy -ErrorAction SilentlyContinue) |
          ForEach-Object {
            [PSCustomObject]@{
              Identity = $_.Identity
              DisplayName = $_.DisplayName
              Description = $_.Description
              ChannelModeratedByDefault = $_.ChannelModeratedByDefault
              NewMembersCanPostMessages = $_.NewMembersCanPostMessages
              CreatedDate = $_.WhenCreated
            }
          } |
          ConvertTo-Json -Depth 2)
      `
      const result = await this.executePowerShell(script)
      if (result && Array.isArray(result)) {
        for (const policy of result) {
          this.resources.push({
            type: 'TeamsChannelModeration',
            name: policy.DisplayName || policy.Identity,
            id: policy.Identity,
            configuration: {
              Identity: policy.Identity,
              DisplayName: policy.DisplayName || '',
              Description: policy.Description || '',
              ChannelModeratedByDefault: policy.ChannelModeratedByDefault || false,
              NewMembersCanPostMessages: policy.NewMembersCanPostMessages !== false,
              CreatedDate: policy.CreatedDate || new Date().toISOString()
            }
          })
        }
        console.log(`✅ Found ${result.length} Teams channel moderation policies`)
      }
    } catch (error) {
      this.handleError('collectChannelModeration', error)
    }
  }

  /**
   * Collect Client Configuration
   * TeamsClientConfiguration (Phase 1)
   */
  async collectClientConfiguration() {
    try {
      console.log('📋 Collecting Teams Client Configuration (PowerShell)...')
      const script = `
        @((Get-CsTeamsClientConfiguration -ErrorAction SilentlyContinue) |
          ForEach-Object {
            [PSCustomObject]@{
              Identity = $_.Identity
              Description = $_.Description
              ContentDonloadingExpiration = $_.ContentDonloadingExpiration
              AllowESsnBSupport = $_.AllowESsnBSupport
              CreatedDate = $_.WhenCreated
            }
          } |
          ConvertTo-Json -Depth 2)
      `
      const result = await this.executePowerShell(script)
      if (result && Array.isArray(result)) {
        for (const config of result) {
          this.resources.push({
            type: 'TeamsClientConfiguration',
            name: config.Description || config.Identity,
            id: config.Identity,
            configuration: {
              Identity: config.Identity,
              Description: config.Description || '',
              ContentDownloadingExpiration: config.ContentDonloadingExpiration || 28,
              AllowESsnBSupport: config.AllowESsnBSupport !== false,
              CreatedDate: config.CreatedDate || new Date().toISOString()
            }
          })
        }
        console.log(`✅ Found ${result.length} Teams client configurations`)
      }
    } catch (error) {
      this.handleError('collectClientConfiguration', error)
    }
  }

  /**
   * Collect Compliance Recording Policy
   * TeamsComplianceRecordingPolicy (Phase 1)
   */
  async collectComplianceRecordingPolicy() {
    try {
      console.log('📋 Collecting Teams Compliance Recording Policy (PowerShell)...')
      const script = `
        @((Get-CsTeamsComplianceRecordingPolicy -ErrorAction SilentlyContinue) |
          ForEach-Object {
            [PSCustomObject]@{
              Identity = $_.Identity
              DisplayName = $_.DisplayName
              Description = $_.Description
              Enabled = $_.Enabled
              CreatedDate = $_.WhenCreated
            }
          } |
          ConvertTo-Json -Depth 2)
      `
      const result = await this.executePowerShell(script)
      if (result && Array.isArray(result)) {
        for (const policy of result) {
          this.resources.push({
            type: 'TeamsComplianceRecordingPolicy',
            name: policy.DisplayName || policy.Identity,
            id: policy.Identity,
            configuration: {
              Identity: policy.Identity,
              DisplayName: policy.DisplayName || '',
              Description: policy.Description || '',
              Enabled: policy.Enabled || false,
              CreatedDate: policy.CreatedDate || new Date().toISOString()
            }
          })
        }
        console.log(`✅ Found ${result.length} Teams compliance recording policies`)
      }
    } catch (error) {
      this.handleError('collectComplianceRecordingPolicy', error)
    }
  }

  /**
   * Collect Connector Policy
   * TeamsConnectorPolicy (Phase 1)
   */
  async collectConnectorPolicy() {
    try {
      console.log('📋 Collecting Teams Connector Policy (PowerShell)...')
      const script = `
        @((Get-CsTeamsConnectorPolicy -ErrorAction SilentlyContinue) |
          ForEach-Object {
            [PSCustomObject]@{
              Identity = $_.Identity
              DisplayName = $_.DisplayName
              Description = $_.Description
              AllowOutgoingWebhooks = $_.AllowOutgoingWebhooks
              AllowIncomingWebhooks = $_.AllowIncomingWebhooks
              CreatedDate = $_.WhenCreated
            }
          } |
          ConvertTo-Json -Depth 2)
      `
      const result = await this.executePowerShell(script)
      if (result && Array.isArray(result)) {
        for (const policy of result) {
          this.resources.push({
            type: 'TeamsConnectorPolicy',
            name: policy.DisplayName || policy.Identity,
            id: policy.Identity,
            configuration: {
              Identity: policy.Identity,
              DisplayName: policy.DisplayName || '',
              Description: policy.Description || '',
              AllowOutgoingWebhooks: policy.AllowOutgoingWebhooks !== false,
              AllowIncomingWebhooks: policy.AllowIncomingWebhooks !== false,
              CreatedDate: policy.CreatedDate || new Date().toISOString()
            }
          })
        }
        console.log(`✅ Found ${result.length} Teams connector policies`)
      }
    } catch (error) {
      this.handleError('collectConnectorPolicy', error)
    }
  }

  /**
   * Collect Device Configuration
   * TeamsDeviceConfiguration (Phase 1)
   */
  async collectDeviceConfiguration() {
    try {
      console.log('📋 Collecting Teams Device Configuration (PowerShell)...')
      const script = `
        @((Get-CsTeamsDeviceConfiguration -ErrorAction SilentlyContinue) |
          ForEach-Object {
            [PSCustomObject]@{
              Identity = $_.Identity
              Description = $_.Description
              ContentAddressingMode = $_.ContentAddressingMode
              SearchOnBoot = $_.SearchOnBoot
              CreatedDate = $_.WhenCreated
            }
          } |
          ConvertTo-Json -Depth 2)
      `
      const result = await this.executePowerShell(script)
      if (result && Array.isArray(result)) {
        for (const config of result) {
          this.resources.push({
            type: 'TeamsDeviceConfiguration',
            name: config.Description || config.Identity,
            id: config.Identity,
            configuration: {
              Identity: config.Identity,
              Description: config.Description || '',
              ContentAddressingMode: config.ContentAddressingMode || 'IpV4',
              SearchOnBoot: config.SearchOnBoot || true,
              CreatedDate: config.CreatedDate || new Date().toISOString()
            }
          })
        }
        console.log(`✅ Found ${result.length} Teams device configurations`)
      }
    } catch (error) {
      this.handleError('collectDeviceConfiguration', error)
    }
  }

  /**
   * Collect Events Policy
   * TeamsEventsPolicy (Phase 1)
   */
  async collectEventsPolicy() {
    try {
      console.log('📋 Collecting Teams Events Policy (PowerShell)...')
      const script = `
        @((Get-CsTeamsEventsPolicy -ErrorAction SilentlyContinue) |
          ForEach-Object {
            [PSCustomObject]@{
              Identity = $_.Identity
              DisplayName = $_.DisplayName
              Description = $_.Description
              AllowWebinars = $_.AllowWebinars
              AllowTownhalls = $_.AllowTownhalls
              CreatedDate = $_.WhenCreated
            }
          } |
          ConvertTo-Json -Depth 2)
      `
      const result = await this.executePowerShell(script)
      if (result && Array.isArray(result)) {
        for (const policy of result) {
          this.resources.push({
            type: 'TeamsEventsPolicy',
            name: policy.DisplayName || policy.Identity,
            id: policy.Identity,
            configuration: {
              Identity: policy.Identity,
              DisplayName: policy.DisplayName || '',
              Description: policy.Description || '',
              AllowWebinars: policy.AllowWebinars !== false,
              AllowTownhalls: policy.AllowTownhalls !== false,
              CreatedDate: policy.CreatedDate || new Date().toISOString()
            }
          })
        }
        console.log(`✅ Found ${result.length} Teams events policies`)
      }
    } catch (error) {
      this.handleError('collectEventsPolicy', error)
    }
  }

  /**
   * Collect External Access Policy
   * TeamsExternalAccessPolicy (Phase 1)
   */
  async collectExternalAccessPolicy() {
    try {
      console.log('📋 Collecting Teams External Access Policy (PowerShell)...')
      const script = `
        @((Get-CsExternalAccessPolicy -ErrorAction SilentlyContinue) |
          ForEach-Object {
            [PSCustomObject]@{
              Identity = $_.Identity
              DisplayName = $_.DisplayName
              Description = $_.Description
              EnableFederationAccess = $_.EnableFederationAccess
              EnablePublicCloudAccess = $_.EnablePublicCloudAccess
              CreatedDate = $_.WhenCreated
            }
          } |
          ConvertTo-Json -Depth 2)
      `
      const result = await this.executePowerShell(script)
      if (result && Array.isArray(result)) {
        for (const policy of result) {
          this.resources.push({
            type: 'TeamsExternalAccessPolicy',
            name: policy.DisplayName || policy.Identity,
            id: policy.Identity,
            configuration: {
              Identity: policy.Identity,
              DisplayName: policy.DisplayName || '',
              Description: policy.Description || '',
              EnableFederationAccess: policy.EnableFederationAccess !== false,
              EnablePublicCloudAccess: policy.EnablePublicCloudAccess || false,
              CreatedDate: policy.CreatedDate || new Date().toISOString()
            }
          })
        }
        console.log(`✅ Found ${result.length} Teams external access policies`)
      }
    } catch (error) {
      this.handleError('collectExternalAccessPolicy', error)
    }
  }

  /**
   * Collect Guest Calling Configuration
   * TeamsGuestCallingConfiguration (Phase 1)
   */
  async collectGuestCallingConfiguration() {
    try {
      console.log('📋 Collecting Teams Guest Calling Configuration (PowerShell)...')
      const script = `
        @((Get-CsTeamsGuestCallingConfiguration -ErrorAction SilentlyContinue) |
          ForEach-Object {
            [PSCustomObject]@{
              Identity = $_.Identity
              Description = $_.Description
              AllowPrivateCalling = $_.AllowPrivateCalling
              CreatedDate = $_.WhenCreated
            }
          } |
          ConvertTo-Json -Depth 2)
      `
      const result = await this.executePowerShell(script)
      if (result && Array.isArray(result)) {
        for (const config of result) {
          this.resources.push({
            type: 'TeamsGuestCallingConfiguration',
            name: config.Description || config.Identity,
            id: config.Identity,
            configuration: {
              Identity: config.Identity,
              Description: config.Description || '',
              AllowPrivateCalling: config.AllowPrivateCalling !== false,
              CreatedDate: config.CreatedDate || new Date().toISOString()
            }
          })
        }
        console.log(`✅ Found ${result.length} Teams guest calling configurations`)
      }
    } catch (error) {
      this.handleError('collectGuestCallingConfiguration', error)
    }
  }

  /**
   * Collect Guest Meeting Configuration
   * TeamsGuestMeetingConfiguration (Phase 1)
   */
  async collectGuestMeetingConfiguration() {
    try {
      console.log('📋 Collecting Teams Guest Meeting Configuration (PowerShell)...')
      const script = `
        @((Get-CsTeamsGuestMeetingConfiguration -ErrorAction SilentlyContinue) |
          ForEach-Object {
            [PSCustomObject]@{
              Identity = $_.Identity
              Description = $_.Description
              AllowIPVideo = $_.AllowIPVideo
              AllowMeetNow = $_.AllowMeetNow
              LiveCaptionEnabledType = $_.LiveCaptionEnabledType
              CreatedDate = $_.WhenCreated
            }
          } |
          ConvertTo-Json -Depth 2)
      `
      const result = await this.executePowerShell(script)
      if (result && Array.isArray(result)) {
        for (const config of result) {
          this.resources.push({
            type: 'TeamsGuestMeetingConfiguration',
            name: config.Description || config.Identity,
            id: config.Identity,
            configuration: {
              Identity: config.Identity,
              Description: config.Description || '',
              AllowIPVideo: config.AllowIPVideo !== false,
              AllowMeetNow: config.AllowMeetNow !== false,
              LiveCaptionEnabledType: config.LiveCaptionEnabledType || 'DisabledUserOverride',
              CreatedDate: config.CreatedDate || new Date().toISOString()
            }
          })
        }
        console.log(`✅ Found ${result.length} Teams guest meeting configurations`)
      }
    } catch (error) {
      this.handleError('collectGuestMeetingConfiguration', error)
    }
  }

  /**
   * Collect Guest Messaging Configuration
   * TeamsGuestMessagingConfiguration (Phase 1)
   */
  async collectGuestMessagingConfiguration() {
    try {
      console.log('📋 Collecting Teams Guest Messaging Configuration (PowerShell)...')
      const script = `
        @((Get-CsTeamsGuestMessagingConfiguration -ErrorAction SilentlyContinue) |
          ForEach-Object {
            [PSCustomObject]@{
              Identity = $_.Identity
              Description = $_.Description
              AllowUserEditMessages = $_.AllowUserEditMessages
              AllowUserDeleteMessages = $_.AllowUserDeleteMessages
              AllowOwnerDeleteMessages = $_.AllowOwnerDeleteMessages
              CreatedDate = $_.WhenCreated
            }
          } |
          ConvertTo-Json -Depth 2)
      `
      const result = await this.executePowerShell(script)
      if (result && Array.isArray(result)) {
        for (const config of result) {
          this.resources.push({
            type: 'TeamsGuestMessagingConfiguration',
            name: config.Description || config.Identity,
            id: config.Identity,
            configuration: {
              Identity: config.Identity,
              Description: config.Description || '',
              AllowUserEditMessages: config.AllowUserEditMessages !== false,
              AllowUserDeleteMessages: config.AllowUserDeleteMessages !== false,
              AllowOwnerDeleteMessages: config.AllowOwnerDeleteMessages !== false,
              CreatedDate: config.CreatedDate || new Date().toISOString()
            }
          })
        }
        console.log(`✅ Found ${result.length} Teams guest messaging configurations`)
      }
    } catch (error) {
      this.handleError('collectGuestMessagingConfiguration', error)
    }
  }

  /**
   * Collect Inbound Blocked Number Pattern
   * TeamsInboundBlockedNumberPattern (Phase 1)
   */
  async collectInboundBlockedNumberPattern() {
    try {
      console.log('📋 Collecting Teams Inbound Blocked Number Patterns (PowerShell)...')
      const script = `
        @((Get-CsInboundBlockedNumberPattern -ErrorAction SilentlyContinue) |
          ForEach-Object {
            [PSCustomObject]@{
              Identity = $_.Identity
              Name = $_.Name
              Description = $_.Description
              Enabled = $_.Enabled
              Pattern = $_.Pattern
              CreatedDate = $_.WhenCreated
            }
          } |
          ConvertTo-Json -Depth 2)
      `
      const result = await this.executePowerShell(script)
      if (result && Array.isArray(result)) {
        for (const pattern of result) {
          this.resources.push({
            type: 'TeamsInboundBlockedNumberPattern',
            name: pattern.Name || pattern.Pattern,
            id: pattern.Identity,
            configuration: {
              Identity: pattern.Identity,
              Name: pattern.Name || '',
              Description: pattern.Description || '',
              Enabled: pattern.Enabled !== false,
              Pattern: pattern.Pattern || '',
              CreatedDate: pattern.CreatedDate || new Date().toISOString()
            }
          })
        }
        console.log(`✅ Found ${result.length} inbound blocked number patterns`)
      }
    } catch (error) {
      this.handleError('collectInboundBlockedNumberPattern', error)
    }
  }

  /**
   * Collect Interop Policy
   * TeamsInteropPolicy (Phase 1)
   */
  async collectInteropPolicy() {
    try {
      console.log('📋 Collecting Teams Interop Policy (PowerShell)...')
      const script = `
        @((Get-CsTeamsInteropPolicy -ErrorAction SilentlyContinue) |
          ForEach-Object {
            [PSCustomObject]@{
              Identity = $_.Identity
              DisplayName = $_.DisplayName
              Description = $_.Description
              CallingCompatibility = $_.CallingCompatibility
              ChatCompatibility = $_.ChatCompatibility
              CreatedDate = $_.WhenCreated
            }
          } |
          ConvertTo-Json -Depth 2)
      `
      const result = await this.executePowerShell(script)
      if (result && Array.isArray(result)) {
        for (const policy of result) {
          this.resources.push({
            type: 'TeamsInteropPolicy',
            name: policy.DisplayName || policy.Identity,
            id: policy.Identity,
            configuration: {
              Identity: policy.Identity,
              DisplayName: policy.DisplayName || '',
              Description: policy.Description || '',
              CallingCompatibility: policy.CallingCompatibility || 'TeamsOnly',
              ChatCompatibility: policy.ChatCompatibility || 'TeamsOnly',
              CreatedDate: policy.CreatedDate || new Date().toISOString()
            }
          })
        }
        console.log(`✅ Found ${result.length} Teams interop policies`)
      }
    } catch (error) {
      this.handleError('collectInteropPolicy', error)
    }
  }

  /**
   * Collect Media Logging Policy
   * TeamsMediaLoggingPolicy (Phase 1)
   */
  async collectMediaLoggingPolicy() {
    try {
      console.log('📋 Collecting Teams Media Logging Policy (PowerShell)...')
      const script = `
        @((Get-CsTeamsMediaLoggingPolicy -ErrorAction SilentlyContinue) |
          ForEach-Object {
            [PSCustomObject]@{
              Identity = $_.Identity
              DisplayName = $_.DisplayName
              Description = $_.Description
              MediaLoggingEnabled = $_.MediaLoggingEnabled
              CreatedDate = $_.WhenCreated
            }
          } |
          ConvertTo-Json -Depth 2)
      `
      const result = await this.executePowerShell(script)
      if (result && Array.isArray(result)) {
        for (const policy of result) {
          this.resources.push({
            type: 'TeamsMediaLoggingPolicy',
            name: policy.DisplayName || policy.Identity,
            id: policy.Identity,
            configuration: {
              Identity: policy.Identity,
              DisplayName: policy.DisplayName || '',
              Description: policy.Description || '',
              MediaLoggingEnabled: policy.MediaLoggingEnabled || false,
              CreatedDate: policy.CreatedDate || new Date().toISOString()
            }
          })
        }
        console.log(`✅ Found ${result.length} Teams media logging policies`)
      }
    } catch (error) {
      this.handleError('collectMediaLoggingPolicy', error)
    }
  }

  /**
   * Collect PSTN Usage
   * TeamsPstnUsage (Phase 1)
   */
  async collectPstnUsage() {
    try {
      console.log('📋 Collecting Teams PSTN Usage (PowerShell)...')
      const script = `
        @((Get-CsOnlinePstnUsage -ErrorAction SilentlyContinue) |
          ForEach-Object {
            [PSCustomObject]@{
              Identity = $_.Identity
              Usage = @($_.Usage)
              CreatedDate = $_.WhenCreated
            }
          } |
          ConvertTo-Json -Depth 2)
      `
      const result = await this.executePowerShell(script)
      if (result && Array.isArray(result)) {
        for (const usage of result) {
          this.resources.push({
            type: 'TeamsPstnUsage',
            name: usage.Identity || 'Global',
            id: usage.Identity,
            configuration: {
              Identity: usage.Identity,
              Usage: Array.isArray(usage.Usage) ? usage.Usage : [],
              CreatedDate: usage.CreatedDate || new Date().toISOString()
            }
          })
        }
        console.log(`✅ Found ${result.length} PSTN usage configurations`)
      }
    } catch (error) {
      this.handleError('collectPstnUsage', error)
    }
  }

  /**
   * Collect Voice Route
   * TeamsVoiceRoute (Phase 1)
   */
  async collectVoiceRoute() {
    try {
      console.log('📋 Collecting Teams Voice Routes (PowerShell)...')
      const script = `
        @((Get-CsOnlineVoiceRoute -ErrorAction SilentlyContinue) |
          ForEach-Object {
            [PSCustomObject]@{
              Identity = $_.Identity
              Name = $_.Name
              Description = $_.Description
              Pattern = $_.NumberPattern
              Priority = $_.Priority
              GatewaysCount = @($_.OnlinePstnGatewayList).Count
              CreatedDate = $_.WhenCreated
            }
          } |
          ConvertTo-Json -Depth 2)
      `
      const result = await this.executePowerShell(script)
      if (result && Array.isArray(result)) {
        for (const route of result) {
          this.resources.push({
            type: 'TeamsVoiceRoute',
            name: route.Name,
            id: route.Identity,
            configuration: {
              Identity: route.Identity,
              Name: route.Name || '',
              Description: route.Description || '',
              Pattern: route.Pattern || '',
              Priority: route.Priority || 0,
              GatewaysCount: route.GatewaysCount || 0,
              CreatedDate: route.CreatedDate || new Date().toISOString()
            }
          })
        }
        console.log(`✅ Found ${result.length} Teams voice routes`)
      }
    } catch (error) {
      this.handleError('collectVoiceRoute', error)
    }
  }

  /**
   * Collect Dial-in Conferencing Policy
   * TeamsDialInConferencingPolicy (Phase 1)
   */
  async collectDialInConferencingPolicy() {
    try {
      console.log('📋 Collecting Teams Dial-in Conferencing Policy (PowerShell)...')
      const script = `
        @((Get-CsTeamsConferencingPolicy -ErrorAction SilentlyContinue) |
          ForEach-Object {
            [PSCustomObject]@{
              Identity = $_.Identity
              DisplayName = $_.DisplayName
              Description = $_.Description
              AllowPSTNUsersToBypassLobby = $_.AllowPSTNUsersToBypassLobby
              AllowAnonymousUsersToBypassLobby = $_.AllowAnonymousUsersToBypassLobby
              CreatedDate = $_.WhenCreated
            }
          } |
          ConvertTo-Json -Depth 2)
      `
      const result = await this.executePowerShell(script)
      if (result && Array.isArray(result)) {
        for (const policy of result) {
          this.resources.push({
            type: 'TeamsDialInConferencingPolicy',
            name: policy.DisplayName || policy.Identity,
            id: policy.Identity,
            configuration: {
              Identity: policy.Identity,
              DisplayName: policy.DisplayName || '',
              Description: policy.Description || '',
              AllowPSTNUsersToBypassLobby: policy.AllowPSTNUsersToBypassLobby || false,
              AllowAnonymousUsersToBypassLobby: policy.AllowAnonymousUsersToBypassLobby || false,
              CreatedDate: policy.CreatedDate || new Date().toISOString()
            }
          })
        }
        console.log(`✅ Found ${result.length} Teams dial-in conferencing policies`)
      }
    } catch (error) {
      this.handleError('collectDialInConferencingPolicy', error)
    }
  }

  /**
   * Collect Emergency Calling Policy
   * TeamsEmergencyCallingPolicy (Phase 1)
   */
  async collectEmergencyCallingPolicy() {
    try {
      console.log('📋 Collecting Teams Emergency Calling Policy (PowerShell)...')
      const script = `
        @((Get-CsTeamsEmergencyCallingPolicy -ErrorAction SilentlyContinue) |
          ForEach-Object {
            [PSCustomObject]@{
              Identity = $_.Identity
              DisplayName = $_.DisplayName
              Description = $_.Description
              NotificationDialOutNumber = $_.NotificationDialOutNumber
              NotificationGroup = $_.NotificationGroup
              CreatedDate = $_.WhenCreated
            }
          } |
          ConvertTo-Json -Depth 2)
      `
      const result = await this.executePowerShell(script)
      if (result && Array.isArray(result)) {
        for (const policy of result) {
          this.resources.push({
            type: 'TeamsEmergencyCallingPolicy',
            name: policy.DisplayName || policy.Identity,
            id: policy.Identity,
            configuration: {
              Identity: policy.Identity,
              DisplayName: policy.DisplayName || '',
              Description: policy.Description || '',
              NotificationDialOutNumber: policy.NotificationDialOutNumber || '',
              NotificationGroup: policy.NotificationGroup || '',
              CreatedDate: policy.CreatedDate || new Date().toISOString()
            }
          })
        }
        console.log(`✅ Found ${result.length} Teams emergency calling policies`)
      }
    } catch (error) {
      this.handleError('collectEmergencyCallingPolicy', error)
    }
  }

  /**
   * Collect Online Voice Routing Policy
   * TeamsOnlineVoiceRoutingPolicy (Phase 1)
   */
  async collectOnlineVoiceRoutingPolicy() {
    try {
      console.log('📋 Collecting Teams Online Voice Routing Policy (PowerShell)...')
      const script = `
        @((Get-CsOnlineVoiceRoutingPolicy -ErrorAction SilentlyContinue) |
          ForEach-Object {
            [PSCustomObject]@{
              Identity = $_.Identity
              DisplayName = $_.DisplayName
              Description = $_.Description
              OnlinePstnUsages = @($_.OnlinePstnUsages)
              CreatedDate = $_.WhenCreated
            }
          } |
          ConvertTo-Json -Depth 2)
      `
      const result = await this.executePowerShell(script)
      if (result && Array.isArray(result)) {
        for (const policy of result) {
          this.resources.push({
            type: 'TeamsOnlineVoiceRoutingPolicy',
            name: policy.DisplayName || policy.Identity,
            id: policy.Identity,
            configuration: {
              Identity: policy.Identity,
              DisplayName: policy.DisplayName || '',
              Description: policy.Description || '',
              OnlinePstnUsages: Array.isArray(policy.OnlinePstnUsages) ? policy.OnlinePstnUsages : [],
              CreatedDate: policy.CreatedDate || new Date().toISOString()
            }
          })
        }
        console.log(`✅ Found ${result.length} Teams online voice routing policies`)
      }
    } catch (error) {
      this.handleError('collectOnlineVoiceRoutingPolicy', error)
    }
  }

  /**
   * Collect Upgrade Configuration
   * TeamsUpgradeConfiguration (Phase 1)
   */
  async collectUpgradeConfiguration() {
    try {
      console.log('📋 Collecting Teams Upgrade Configuration (PowerShell)...')
      const script = `
        @((Get-CsTeamsUpgradeConfiguration -ErrorAction SilentlyContinue) |
          ForEach-Object {
            [PSCustomObject]@{
              Identity = $_.Identity
              DownloadTeamsClients = $_.DownloadTeamsClients
              SfBMeetingJoinUx = $_.SfBMeetingJoinUx
              CreatedDate = $_.WhenCreated
            }
          } |
          ConvertTo-Json -Depth 2)
      `
      const result = await this.executePowerShell(script)
      if (result && Array.isArray(result)) {
        for (const config of result) {
          this.resources.push({
            type: 'TeamsUpgradeConfiguration',
            name: config.Identity,
            id: config.Identity,
            configuration: {
              Identity: config.Identity,
              DownloadTeamsClients: config.DownloadTeamsClients !== false,
              SfBMeetingJoinUx: config.SfBMeetingJoinUx || 'TeamsDefault',
              CreatedDate: config.CreatedDate || new Date().toISOString()
            }
          })
        }
        console.log(`✅ Found ${result.length} Teams upgrade configurations`)
      }
    } catch (error) {
      this.handleError('collectUpgradeConfiguration', error)
    }
  }

  /**
   * Collect Network Roaming Policy
   * TeamsNetworkRoamingPolicy (Phase 1)
   */
  async collectNetworkRoamingPolicy() {
    try {
      console.log('📋 Collecting Teams Network Roaming Policy (PowerShell)...')
      const script = `
        @((Get-CsTeamsNetworkRoamingPolicy -ErrorAction SilentlyContinue) |
          ForEach-Object {
            [PSCustomObject]@{
              Identity = $_.Identity
              DisplayName = $_.DisplayName
              Description = $_.Description
              AllowIPVideo = $_.AllowIPVideo
              MediaBitRateKb = $_.MediaBitRateKb
              CreatedDate = $_.WhenCreated
            }
          } |
          ConvertTo-Json -Depth 2)
      `
      const result = await this.executePowerShell(script)
      if (result && Array.isArray(result)) {
        for (const policy of result) {
          this.resources.push({
            type: 'TeamsNetworkRoamingPolicy',
            name: policy.DisplayName || policy.Identity,
            id: policy.Identity,
            configuration: {
              Identity: policy.Identity,
              DisplayName: policy.DisplayName || '',
              Description: policy.Description || '',
              AllowIPVideo: policy.AllowIPVideo !== false,
              MediaBitRateKb: policy.MediaBitRateKb || 50000,
              CreatedDate: policy.CreatedDate || new Date().toISOString()
            }
          })
        }
        console.log(`✅ Found ${result.length} Teams network roaming policies`)
      }
    } catch (error) {
      this.handleError('collectNetworkRoamingPolicy', error)
    }
  }

  /**
   * Collect IP Phone Policy
   * TeamsIPPhonePolicy (Phase 1)
   */
  async collectIPPhonePolicy() {
    try {
      console.log('📋 Collecting Teams IP Phone Policy (PowerShell)...')
      const script = `
        @((Get-CsTeamsIPPhonePolicy -ErrorAction SilentlyContinue) |
          ForEach-Object {
            [PSCustomObject]@{
              Identity = $_.Identity
              DisplayName = $_.DisplayName
              Description = $_.Description
              SearchOnBoot = $_.SearchOnBoot
              SignInTimeout = $_.SignInTimeout
              CreatedDate = $_.WhenCreated
            }
          } |
          ConvertTo-Json -Depth 2)
      `
      const result = await this.executePowerShell(script)
      if (result && Array.isArray(result)) {
        for (const policy of result) {
          this.resources.push({
            type: 'TeamsIPPhonePolicy',
            name: policy.DisplayName || policy.Identity,
            id: policy.Identity,
            configuration: {
              Identity: policy.Identity,
              DisplayName: policy.DisplayName || '',
              Description: policy.Description || '',
              SearchOnBoot: policy.SearchOnBoot !== false,
              SignInTimeout: policy.SignInTimeout || 300,
              CreatedDate: policy.CreatedDate || new Date().toISOString()
            }
          })
        }
        console.log(`✅ Found ${result.length} Teams IP phone policies`)
      }
    } catch (error) {
      this.handleError('collectIPPhonePolicy', error)
    }
  }

  /**
   * Collect Broadcast Configuration
   * TeamsMeetingBroadcastConfiguration (Phase 1)
   */
  async collectBroadcastConfiguration() {
    try {
      console.log('📋 Collecting Teams Meeting Broadcast Configuration (PowerShell)...')
      const script = `
        @((Get-CsTeamsMeetingBroadcastConfiguration -ErrorAction SilentlyContinue) |
          ForEach-Object {
            [PSCustomObject]@{
              Identity = $_.Identity
              BroadcastAttendeeVisibilityMode = $_.BroadcastAttendeeVisibilityMode
              BroadcastRecordingMode = $_.BroadcastRecordingMode
              BroadcastScreenContentMode = $_.BroadcastScreenContentMode
              BroadcastVendorLogoUrl = $_.BroadcastVendorLogoUrl
              CreatedDate = $_.WhenCreated
            }
          } |
          ConvertTo-Json -Depth 2)
      `
      const result = await this.executePowerShell(script)
      if (result && Array.isArray(result)) {
        for (const config of result) {
          this.resources.push({
            type: 'TeamsMeetingBroadcastConfiguration',
            name: config.Identity,
            id: config.Identity,
            configuration: {
              Identity: config.Identity,
              BroadcastAttendeeVisibilityMode: config.BroadcastAttendeeVisibilityMode || 'EveryoneInCompany',
              BroadcastRecordingMode: config.BroadcastRecordingMode || 'UserOverride',
              BroadcastScreenContentMode: config.BroadcastScreenContentMode || 'Disabled',
              BroadcastVendorLogoUrl: config.BroadcastVendorLogoUrl || '',
              CreatedDate: config.CreatedDate || new Date().toISOString()
            }
          })
        }
        console.log(`✅ Found ${result.length} Teams meeting broadcast configurations`)
      }
    } catch (error) {
      this.handleError('collectBroadcastConfiguration', error)
    }
  }

  /**
   * Collect Broadcast Policy
   * TeamsMeetingBroadcastPolicy (Phase 1)
   */
  async collectBroadcastPolicy() {
    try {
      console.log('📋 Collecting Teams Meeting Broadcast Policy (PowerShell)...')
      const script = `
        @((Get-CsTeamsMeetingBroadcastPolicy -ErrorAction SilentlyContinue) |
          ForEach-Object {
            [PSCustomObject]@{
              Identity = $_.Identity
              DisplayName = $_.DisplayName
              Description = $_.Description
              AllowBroadcastScheduling = $_.AllowBroadcastScheduling
              AllowBroadcastTranscoding = $_.AllowBroadcastTranscoding
              CreatedDate = $_.WhenCreated
            }
          } |
          ConvertTo-Json -Depth 2)
      `
      const result = await this.executePowerShell(script)
      if (result && Array.isArray(result)) {
        for (const policy of result) {
          this.resources.push({
            type: 'TeamsMeetingBroadcastPolicy',
            name: policy.DisplayName || policy.Identity,
            id: policy.Identity,
            configuration: {
              Identity: policy.Identity,
              DisplayName: policy.DisplayName || '',
              Description: policy.Description || '',
              AllowBroadcastScheduling: policy.AllowBroadcastScheduling !== false,
              AllowBroadcastTranscoding: policy.AllowBroadcastTranscoding !== false,
              CreatedDate: policy.CreatedDate || new Date().toISOString()
            }
          })
        }
        console.log(`✅ Found ${result.length} Teams meeting broadcast policies`)
      }
    } catch (error) {
      this.handleError('collectBroadcastPolicy', error)
    }
  }

  /**
   * Collect Unassigned Number Treatment
   * TeamsUnassignedNumberTreatment (Phase 1)
   */
  async collectUnassignedNumberTreatment() {
    try {
      console.log('📋 Collecting Teams Unassigned Number Treatment (PowerShell)...')
      const script = `
        @((Get-CsUnassignedNumberTreatmentPolicy -ErrorAction SilentlyContinue) |
          ForEach-Object {
            [PSCustomObject]@{
              Identity = $_.Identity
              Name = $_.Name
              Description = $_.Description
              Pattern = $_.Pattern
              Treatment = $_.Treatment
              CreatedDate = $_.WhenCreated
            }
          } |
          ConvertTo-Json -Depth 2)
      `
      const result = await this.executePowerShell(script)
      if (result && Array.isArray(result)) {
        for (const treatment of result) {
          this.resources.push({
            type: 'TeamsUnassignedNumberTreatment',
            name: treatment.Name,
            id: treatment.Identity,
            configuration: {
              Identity: treatment.Identity,
              Name: treatment.Name || '',
              Description: treatment.Description || '',
              Pattern: treatment.Pattern || '',
              Treatment: treatment.Treatment || 'Disconnect',
              CreatedDate: treatment.CreatedDate || new Date().toISOString()
            }
          })
        }
        console.log(`✅ Found ${result.length} Teams unassigned number treatments`)
      }
    } catch (error) {
      this.handleError('collectUnassignedNumberTreatment', error)
    }
  }

  /**
   * Collect Shifts Policy
   * TeamsShiftsPolicy (Phase 1)
   */
  async collectShiftsPolicy() {
    try {
      console.log('📋 Collecting Teams Shifts Policy (PowerShell)...')
      const script = `
        @((Get-CsTeamsShiftsPolicy -ErrorAction SilentlyContinue) |
          ForEach-Object {
            [PSCustomObject]@{
              Identity = $_.Identity
              DisplayName = $_.DisplayName
              Description = $_.Description
              EnableShiftsConnectorForFrontline = $_.EnableShiftsConnectorForFrontline
              CreatedDate = $_.WhenCreated
            }
          } |
          ConvertTo-Json -Depth 2)
      `
      const result = await this.executePowerShell(script)
      if (result && Array.isArray(result)) {
        for (const policy of result) {
          this.resources.push({
            type: 'TeamsShiftsPolicy',
            name: policy.DisplayName || policy.Identity,
            id: policy.Identity,
            configuration: {
              Identity: policy.Identity,
              DisplayName: policy.DisplayName || '',
              Description: policy.Description || '',
              EnableShiftsConnectorForFrontline: policy.EnableShiftsConnectorForFrontline || false,
              CreatedDate: policy.CreatedDate || new Date().toISOString()
            }
          })
        }
        console.log(`✅ Found ${result.length} Teams shifts policies`)
      }
    } catch (error) {
      this.handleError('collectShiftsPolicy', error)
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
  // POWERSHELL COLLECTION METHODS - Advanced Teams Components
  // ============================================================

  /**
   * Collect Teams Policies via PowerShell
   */
  async collectTeamsPoliciesPowerShell() {
    try {
      console.log('📋 Collecting Teams Policies (PowerShell)...')
      const script = `
        @((Get-CsTeamsMeetingPolicy -ErrorAction SilentlyContinue) |
          ForEach-Object {
            [PSCustomObject]@{
              Identity = $_.Identity
              DisplayName = $_.DisplayName
              Description = $_.Description
              AllowMeetingChat = $_.AllowMeetingChat
              AllowChannelMeetingScheduling = $_.AllowChannelMeetingScheduling
              AllowPrivateMeetingScheduling = $_.AllowPrivateMeetingScheduling
              AllowUserToStartRecordingTranscription = $_.AllowUserToStartRecordingTranscription
              AllowRecordingStorageOutsideRegion = $_.AllowRecordingStorageOutsideRegion
              EnforceRecordingRestrictions = $_.EnforceRecordingRestrictions
              AllowTranscription = $_.AllowTranscription
              MediaBitRateKb = $_.MediaBitRateKb
              AudioProcessing = $_.AudioProcessing
              VideoProcessing = $_.VideoProcessing
              ScreenSharingMode = $_.ScreenSharingMode
              AllowIPVideo = $_.AllowIPVideo
              AllowPSTNUsersToBypassLobby = $_.AllowPSTNUsersToBypassLobby
              AllowAnonymousUsersToStartMeeting = $_.AllowAnonymousUsersToStartMeeting
              AutoAdmittedUsers = $_.AutoAdmittedUsers
              AllowCloudRecording = $_.AllowCloudRecording
              AllowOutlookAddIn = $_.AllowOutlookAddIn
              AllowPowerPointSharing = $_.AllowPowerPointSharing
              AllowParticipantGiveRequestControl = $_.AllowParticipantGiveRequestControl
              AllowNDIStreaming = $_.AllowNDIStreaming
              AllowWhiteboard = $_.AllowWhiteboard
              AllowSharedNotes = $_.AllowSharedNotes
              CreatedDate = $_.WhenCreated
            }
          } |
          ConvertTo-Json -Depth 2)
      `
      const result = await this.executePowerShell(script)
      if (result && Array.isArray(result)) {
        for (const policy of result) {
          this.resources.push({
            type: 'TeamsMeetingPolicy',
            name: policy.DisplayName || policy.Identity,
            id: policy.Identity,
            configuration: {
              Identity: policy.Identity,
              DisplayName: policy.DisplayName || '',
              Description: policy.Description || '',
              AllowMeetingChat: policy.AllowMeetingChat || 'Enabled',
              AllowChannelMeetingScheduling: policy.AllowChannelMeetingScheduling !== false,
              AllowPrivateMeetingScheduling: policy.AllowPrivateMeetingScheduling !== false,
              AllowUserToStartRecordingTranscription: policy.AllowUserToStartRecordingTranscription !== false,
              AllowRecordingStorageOutsideRegion: policy.AllowRecordingStorageOutsideRegion || false,
              EnforceRecordingRestrictions: policy.EnforceRecordingRestrictions || false,
              AllowTranscription: policy.AllowTranscription || true,
              MediaBitRateKb: policy.MediaBitRateKb || 50000,
              AudioProcessing: policy.AudioProcessing || 'Default',
              VideoProcessing: policy.VideoProcessing || 'Default',
              ScreenSharingMode: policy.ScreenSharingMode || 'EntireScreen',
              AllowIPVideo: policy.AllowIPVideo !== false,
              AllowPSTNUsersToBypassLobby: policy.AllowPSTNUsersToBypassLobby || false,
              AllowAnonymousUsersToStartMeeting: policy.AllowAnonymousUsersToStartMeeting || false,
              AutoAdmittedUsers: policy.AutoAdmittedUsers || 'EveryoneInCompany',
              AllowCloudRecording: policy.AllowCloudRecording !== false,
              AllowOutlookAddIn: policy.AllowOutlookAddIn !== false,
              AllowPowerPointSharing: policy.AllowPowerPointSharing !== false,
              AllowParticipantGiveRequestControl: policy.AllowParticipantGiveRequestControl !== false,
              AllowNDIStreaming: policy.AllowNDIStreaming || false,
              AllowWhiteboard: policy.AllowWhiteboard || 'Enabled',
              AllowSharedNotes: policy.AllowSharedNotes !== false,
              CreatedDate: policy.CreatedDate || new Date().toISOString()
            }
          })
        }
        console.log(`✅ Found ${result.length} Teams meeting policies`)
      }
    } catch (error) {
      this.handleError('collectTeamsPoliciesPowerShell', error)
    }
  }

  /**
   * Collect Teams App Policies via PowerShell
   */
  async collectTeamsAppPoliciesPowerShell() {
    try {
      console.log('📋 Collecting Teams App Policies (PowerShell)...')
      const script = `
        @((Get-CsTeamsAppSetupPolicy -ErrorAction SilentlyContinue) |
          ForEach-Object {
            [PSCustomObject]@{
              Identity = $_.Identity
              DisplayName = $_.DisplayName
              Description = $_.Description
              AllowSideLoading = $_.AllowSideLoading
              AllowUserPinning = $_.AllowUserPinning
              PinnedAppBarApps = @($_.PinnedAppBarApps)
              CreatedDate = $_.WhenCreated
            }
          } |
          ConvertTo-Json -Depth 2)
      `
      const result = await this.executePowerShell(script)
      if (result && Array.isArray(result)) {
        for (const policy of result) {
          this.resources.push({
            type: 'TeamsAppPolicy',
            name: policy.DisplayName || policy.Identity,
            id: policy.Identity,
            configuration: {
              Identity: policy.Identity,
              DisplayName: policy.DisplayName || '',
              Description: policy.Description || '',
              AllowSideLoading: policy.AllowSideLoading !== false,
              AllowUserPinning: policy.AllowUserPinning !== false,
              PinnedAppBarApps: Array.isArray(policy.PinnedAppBarApps) ? policy.PinnedAppBarApps : [],
              CreatedDate: policy.CreatedDate || new Date().toISOString()
            }
          })
        }
        console.log(`✅ Found ${result.length} Teams app policies`)
      }
    } catch (error) {
      this.handleError('collectTeamsAppPoliciesPowerShell', error)
    }
  }

  /**
   * Collect Teams Messaging Policies via PowerShell
   */
  async collectTeamsMessagingPoliciesPowerShell() {
    try {
      console.log('📋 Collecting Teams Messaging Policies (PowerShell)...')
      const script = `
        @((Get-CsTeamsMessagingPolicy -ErrorAction SilentlyContinue) |
          ForEach-Object {
            [PSCustomObject]@{
              Identity = $_.Identity
              DisplayName = $_.DisplayName
              Description = $_.Description
              AllowMemes = $_.AllowMemes
              AllowGiphy = $_.AllowGiphy
              GiphyRatingType = $_.GiphyRatingType
              AllowStickers = $_.AllowStickers
              AllowUserChat = $_.AllowUserChat
              AllowUserEditMessages = $_.AllowUserEditMessages
              AllowUserDeleteMessages = $_.AllowUserDeleteMessages
              AllowOwnerDeleteMessages = $_.AllowOwnerDeleteMessages
              AllowUserTranslation = $_.AllowUserTranslation
              AllowImmersiveReader = $_.AllowImmersiveReader
              AllowUserVoiceMessages = $_.AllowUserVoiceMessages
              AllowPriorityMessages = $_.AllowPriorityMessages
              AllowChannelMentions = $_.AllowChannelMentions
              AllowTeamMentions = $_.AllowTeamMentions
              AllowSystemMessages = $_.AllowSystemMessages
              AllowUserChatHistory = $_.AllowUserChatHistory
              CreatedDate = $_.WhenCreated
            }
          } |
          ConvertTo-Json -Depth 2)
      `
      const result = await this.executePowerShell(script)
      if (result && Array.isArray(result)) {
        for (const policy of result) {
          this.resources.push({
            type: 'TeamsMessagingPolicy',
            name: policy.DisplayName || policy.Identity,
            id: policy.Identity,
            configuration: {
              Identity: policy.Identity,
              DisplayName: policy.DisplayName || '',
              Description: policy.Description || '',
              AllowMemes: policy.AllowMemes !== false,
              AllowGiphy: policy.AllowGiphy !== false,
              GiphyRatingType: policy.GiphyRatingType || 'Moderate',
              AllowStickers: policy.AllowStickers !== false,
              AllowUserChat: policy.AllowUserChat !== false,
              AllowUserEditMessages: policy.AllowUserEditMessages !== false,
              AllowUserDeleteMessages: policy.AllowUserDeleteMessages !== false,
              AllowOwnerDeleteMessages: policy.AllowOwnerDeleteMessages !== false,
              AllowUserTranslation: policy.AllowUserTranslation || false,
              AllowImmersiveReader: policy.AllowImmersiveReader !== false,
              AllowUserVoiceMessages: policy.AllowUserVoiceMessages !== false,
              AllowPriorityMessages: policy.AllowPriorityMessages !== false,
              AllowChannelMentions: policy.AllowChannelMentions !== false,
              AllowTeamMentions: policy.AllowTeamMentions !== false,
              AllowSystemMessages: policy.AllowSystemMessages !== false,
              AllowUserChatHistory: policy.AllowUserChatHistory !== false,
              CreatedDate: policy.CreatedDate || new Date().toISOString()
            }
          })
        }
        console.log(`✅ Found ${result.length} Teams messaging policies`)
      }
    } catch (error) {
      this.handleError('collectTeamsMessagingPoliciesPowerShell', error)
    }
  }

  /**
   * Collect Resource Accounts via PowerShell
   */
  async collectResourceAccountsPowerShell() {
    try {
      console.log('📋 Collecting Resource Accounts (PowerShell)...')
      const script = `
        @((Get-CsOnlineApplicationInstance -ErrorAction SilentlyContinue) |
          ForEach-Object {
            [PSCustomObject]@{
              Identity = $_.Identity
              DisplayName = $_.DisplayName
              UserPrincipalName = $_.UserPrincipalName
              ApplicationId = $_.ApplicationId
              ApplicationInstanceId = $_.ApplicationInstanceId
              ObjectId = $_.ObjectId
              CreatedDate = $_.WhenCreated
            }
          } |
          ConvertTo-Json -Depth 2)
      `
      const result = await this.executePowerShell(script)
      if (result && Array.isArray(result)) {
        for (const account of result) {
          this.resources.push({
            type: 'TeamsResourceAccount',
            name: account.DisplayName || account.UserPrincipalName,
            id: account.Identity,
            configuration: {
              Identity: account.Identity,
              DisplayName: account.DisplayName || '',
              UserPrincipalName: account.UserPrincipalName || '',
              ApplicationId: account.ApplicationId || '',
              ApplicationInstanceId: account.ApplicationInstanceId || '',
              ObjectId: account.ObjectId || '',
              CreatedDate: account.CreatedDate || new Date().toISOString()
            }
          })
        }
        console.log(`✅ Found ${result.length} resource accounts`)
      }
    } catch (error) {
      this.handleError('collectResourceAccountsPowerShell', error)
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
        return []
      } catch (psError) {
        command = `powershell -NoProfile -Command "${psCommand.replace(/"/g, '\\"')}"`
        const { stdout } = await execAsync(command, { timeout: 60000 })
        if (stdout && stdout.trim()) {
          return JSON.parse(stdout)
        }
        return []
      }
    } catch (error) {
      console.warn(`⚠️ PowerShell execution failed: ${error.message}`)
      return []
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

export default TeamsCollector
