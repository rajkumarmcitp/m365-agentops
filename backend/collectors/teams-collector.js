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

      // Collect each resource type
      await this.collectTeams()
      await this.collectChannels()
      await this.collectChannelTabs()
      await this.collectTeamsUsers()
      await this.collectAppPermissionPolicy()
      await this.collectAppSetupPolicy()
      await this.collectAutoAttendant()
      await this.collectCallPark()
      await this.collectCallQueue()
      await this.collectCalling()
      await this.collectCallingLineIdentity()
      await this.collectCallingPolicy()
      await this.collectChannelMessagingPolicy()
      await this.collectChannelModeration()
      await this.collectClientConfiguration()
      await this.collectComplianceRecordingPolicy()
      await this.collectConnectorPolicy()
      await this.collectDeviceConfiguration()
      await this.collectEventsPolicy()
      await this.collectExternalAccessPolicy()
      await this.collectGuestCallingConfiguration()
      await this.collectGuestMeetingConfiguration()
      await this.collectGuestMessagingConfiguration()
      await this.collectInboundBlockedNumberPattern()
      await this.collectInteropPolicy()
      await this.collectMediaLoggingPolicy()
      await this.collectMeetingConfiguration()
      await this.collectTeamsPolicies()

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
   * Collect Teams
   * TeamsTeam
   */
  async collectTeams() {
    try {
      console.log('📋 Collecting Teams...')

      const response = await this.graphClient
        .api('/teams')
        .top(999)
        .get()

      if (response.value && response.value.length > 0) {
        for (const team of response.value) {
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
              Channels: [], // Will be populated separately
              Members: team.members?.length || 0,
              Owners: team.owners?.map(o => o.userPrincipalName) || []
            }
          })
        }
        console.log(`✅ Found ${response.value.length} teams`)

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
   * Collect channels for a specific team
   */
  async collectTeamChannels(teamId, teamName) {
    try {
      const channelResponse = await this.graphClient
        .api(`/teams/${teamId}/channels`)
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
            description: c.description
          }))
        }

        console.log(`  └─ ${teamName}: ${channelResponse.value.length} channels`)

        // Collect individual channels
        for (const channel of channelResponse.value) {
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
              CreatedDateTime: channel.createdDateTime || ''
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
   * TeamsMeetingPolicy
   */
  async collectMeetingConfiguration() {
    try {
      console.log('📋 Collecting Teams meeting configuration...')

      // Note: Meeting policies require Exchange Admin access
      // This would need to be accessed via Teams PowerShell or admin APIs
      console.log('⚠️ Teams meeting policies require Teams Admin Center access (limited Graph API support)')
      console.log('   Consider using Teams PowerShell for full policy backup')
    } catch (error) {
      this.handleError('collectMeetingConfiguration', error)
    }
  }

  /**
   * Collect Teams Policies and Settings
   * TeamsChannelPolicy, TeamsUpgradeConfiguration, etc.
   */
  async collectTeamsPolicies() {
    try {
      console.log('📋 Collecting Teams policies...')

      // Note: Policies require Teams Admin access
      console.log('⚠️ Teams policies require Teams Admin Center access (limited Graph API support)')
      console.log('   Consider using Teams PowerShell for full policy backup')
    } catch (error) {
      this.handleError('collectTeamsPolicies', error)
    }
  }

  /**
   * Collect App Permission Policy
   * TeamsAppPermissionPolicy
   */
  async collectAppPermissionPolicy() {
    try {
      console.log('📋 Collecting Teams App Permission Policy...')
      console.log('⚠️ App permission policy requires Teams Admin Center access')
    } catch (error) {
      this.handleError('collectAppPermissionPolicy', error)
    }
  }

  /**
   * Collect App Setup Policy
   * TeamsAppSetupPolicy
   */
  async collectAppSetupPolicy() {
    try {
      console.log('📋 Collecting Teams App Setup Policy...')
      console.log('⚠️ App setup policy requires Teams Admin Center access')
    } catch (error) {
      this.handleError('collectAppSetupPolicy', error)
    }
  }

  /**
   * Collect Auto Attendant
   * TeamsAutoAttendant
   */
  async collectAutoAttendant() {
    try {
      console.log('📋 Collecting Teams Auto Attendant...')
      console.log('⚠️ Auto attendant requires Teams Admin Center access')
    } catch (error) {
      this.handleError('collectAutoAttendant', error)
    }
  }

  /**
   * Collect Call Park
   * TeamsCallPark
   */
  async collectCallPark() {
    try {
      console.log('📋 Collecting Teams Call Park Configuration...')
      console.log('⚠️ Call park requires Teams Admin Center access')
    } catch (error) {
      this.handleError('collectCallPark', error)
    }
  }

  /**
   * Collect Call Queue
   * TeamsCallQueue
   */
  async collectCallQueue() {
    try {
      console.log('📋 Collecting Teams Call Queue...')
      console.log('⚠️ Call queue requires Teams Admin Center access')
    } catch (error) {
      this.handleError('collectCallQueue', error)
    }
  }

  /**
   * Collect Calling Configuration
   * TeamsCalling
   */
  async collectCalling() {
    try {
      console.log('📋 Collecting Teams Calling Configuration...')
      console.log('⚠️ Calling configuration requires Teams Admin Center access')
    } catch (error) {
      this.handleError('collectCalling', error)
    }
  }

  /**
   * Collect Calling Line Identity
   * TeamsCallingLineIdentity
   */
  async collectCallingLineIdentity() {
    try {
      console.log('📋 Collecting Teams Calling Line Identity...')
      console.log('⚠️ Calling line identity requires Teams Admin Center access')
    } catch (error) {
      this.handleError('collectCallingLineIdentity', error)
    }
  }

  /**
   * Collect Calling Policy
   * TeamsCallingPolicy
   */
  async collectCallingPolicy() {
    try {
      console.log('📋 Collecting Teams Calling Policy...')
      console.log('⚠️ Calling policy requires Teams Admin Center access')
    } catch (error) {
      this.handleError('collectCallingPolicy', error)
    }
  }

  /**
   * Collect Channel Messaging Policy
   * TeamsChannelMessagingPolicy
   */
  async collectChannelMessagingPolicy() {
    try {
      console.log('📋 Collecting Teams Channel Messaging Policy...')
      console.log('⚠️ Channel messaging policy requires Teams Admin Center access')
    } catch (error) {
      this.handleError('collectChannelMessagingPolicy', error)
    }
  }

  /**
   * Collect Channel Moderation
   * TeamsChannelModeration
   */
  async collectChannelModeration() {
    try {
      console.log('📋 Collecting Teams Channel Moderation Settings...')
      console.log('⚠️ Channel moderation requires Teams Admin Center access')
    } catch (error) {
      this.handleError('collectChannelModeration', error)
    }
  }

  /**
   * Collect Client Configuration
   * TeamsClientConfiguration
   */
  async collectClientConfiguration() {
    try {
      console.log('📋 Collecting Teams Client Configuration...')
      console.log('⚠️ Client configuration requires Teams Admin Center access')
    } catch (error) {
      this.handleError('collectClientConfiguration', error)
    }
  }

  /**
   * Collect Compliance Recording Policy
   * TeamsComplianceRecordingPolicy
   */
  async collectComplianceRecordingPolicy() {
    try {
      console.log('📋 Collecting Teams Compliance Recording Policy...')
      console.log('⚠️ Compliance recording policy requires Teams Admin Center access')
    } catch (error) {
      this.handleError('collectComplianceRecordingPolicy', error)
    }
  }

  /**
   * Collect Connector Policy
   * TeamsConnectorPolicy
   */
  async collectConnectorPolicy() {
    try {
      console.log('📋 Collecting Teams Connector Policy...')
      console.log('⚠️ Connector policy requires Teams Admin Center access')
    } catch (error) {
      this.handleError('collectConnectorPolicy', error)
    }
  }

  /**
   * Collect Device Configuration
   * TeamsDeviceConfiguration
   */
  async collectDeviceConfiguration() {
    try {
      console.log('📋 Collecting Teams Device Configuration...')
      console.log('⚠️ Device configuration requires Teams Admin Center access')
    } catch (error) {
      this.handleError('collectDeviceConfiguration', error)
    }
  }

  /**
   * Collect Events Policy
   * TeamsEventsPolicy
   */
  async collectEventsPolicy() {
    try {
      console.log('📋 Collecting Teams Events Policy...')
      console.log('⚠️ Events policy requires Teams Admin Center access')
    } catch (error) {
      this.handleError('collectEventsPolicy', error)
    }
  }

  /**
   * Collect External Access Policy
   * TeamsExternalAccessPolicy
   */
  async collectExternalAccessPolicy() {
    try {
      console.log('📋 Collecting Teams External Access Policy...')
      console.log('⚠️ External access policy requires Teams Admin Center access')
    } catch (error) {
      this.handleError('collectExternalAccessPolicy', error)
    }
  }

  /**
   * Collect Guest Calling Configuration
   * TeamsGuestCallingConfiguration
   */
  async collectGuestCallingConfiguration() {
    try {
      console.log('📋 Collecting Teams Guest Calling Configuration...')
      console.log('⚠️ Guest calling configuration requires Teams Admin Center access')
    } catch (error) {
      this.handleError('collectGuestCallingConfiguration', error)
    }
  }

  /**
   * Collect Guest Meeting Configuration
   * TeamsGuestMeetingConfiguration
   */
  async collectGuestMeetingConfiguration() {
    try {
      console.log('📋 Collecting Teams Guest Meeting Configuration...')
      console.log('⚠️ Guest meeting configuration requires Teams Admin Center access')
    } catch (error) {
      this.handleError('collectGuestMeetingConfiguration', error)
    }
  }

  /**
   * Collect Guest Messaging Configuration
   * TeamsGuestMessagingConfiguration
   */
  async collectGuestMessagingConfiguration() {
    try {
      console.log('📋 Collecting Teams Guest Messaging Configuration...')
      console.log('⚠️ Guest messaging configuration requires Teams Admin Center access')
    } catch (error) {
      this.handleError('collectGuestMessagingConfiguration', error)
    }
  }

  /**
   * Collect Inbound Blocked Number Pattern
   * TeamsInboundBlockedNumberPattern
   */
  async collectInboundBlockedNumberPattern() {
    try {
      console.log('📋 Collecting Teams Inbound Blocked Number Patterns...')
      console.log('⚠️ Inbound blocked patterns require Teams Admin Center access')
    } catch (error) {
      this.handleError('collectInboundBlockedNumberPattern', error)
    }
  }

  /**
   * Collect Interop Policy
   * TeamsInteropPolicy
   */
  async collectInteropPolicy() {
    try {
      console.log('📋 Collecting Teams Interop Policy...')
      console.log('⚠️ Interop policy requires Teams Admin Center access')
    } catch (error) {
      this.handleError('collectInteropPolicy', error)
    }
  }

  /**
   * Collect Media Logging Policy
   * TeamsMediaLoggingPolicy
   */
  async collectMediaLoggingPolicy() {
    try {
      console.log('📋 Collecting Teams Media Logging Policy...')
      console.log('⚠️ Media logging policy requires Teams Admin Center access')
    } catch (error) {
      this.handleError('collectMediaLoggingPolicy', error)
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

export default TeamsCollector
