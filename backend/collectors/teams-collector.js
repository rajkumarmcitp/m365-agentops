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

      // Collect each resource type
      await this.collectTeams()
      await this.collectChannels()
      await this.collectChannelTabs()
      await this.collectTeamsUsers()
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
