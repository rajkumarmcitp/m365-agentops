/**
 * Exchange Online Backup Collector
 * Collects and backs up Exchange Online configurations
 *
 * Resources:
 * - EXOAcceptedDomain
 * - EXOConnector
 * - EXODistributionGroup
 * - EXODistributionGroupMember
 * - EXOInboundConnector
 * - EXOMailboxSettings
 * - EXOMailContact
 * - EXOMobileDeviceManagementPolicy
 * - EXOOrgConfig
 * - EXOOutboundConnector
 * - EXORemoteDomain
 * - EXOTransportRule
 * - EXOTransportRuleCollection
 * - EXOUnifiedGroup
 */

export class ExchangeCollector {
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
   * Main collect method - gather all Exchange configurations
   */
  async collect() {
    try {
      console.log('🔄 Starting Exchange Online backup collection...')
      const startTime = Date.now()

      // Collect each resource type
      await this.collectAcceptedDomains()
      await this.collectConnectors()
      await this.collectDistributionGroups()
      await this.collectMailContacts()
      await this.collectRemoteDomains()
      await this.collectTransportRules()
      await this.collectOrgConfig()
      await this.collectUnifiedGroups()

      const executionTime = Math.round((Date.now() - startTime) / 1000)
      console.log(`✅ Exchange backup complete (${executionTime}s, ${this.resources.length} resources)`)

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
      console.error('❌ Exchange collection failed:', error.message)
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
   * Collect Accepted Domains
   * EXOAcceptedDomain
   */
  async collectAcceptedDomains() {
    try {
      console.log('📋 Collecting Accepted Domains...')

      const response = await this.graphClient
        .api('/domains')
        .get()

      if (response.value && response.value.length > 0) {
        for (const domain of response.value) {
          this.resources.push({
            type: 'EXOAcceptedDomain',
            name: domain.id,
            id: domain.id,
            configuration: {
              Identity: domain.id,
              DomainName: domain.id,
              DomainType: domain.authenticationType,
              IsVerified: domain.isVerified,
              IsDefault: domain.isDefault,
              IsInitial: domain.isInitial,
              AvailabilityStatus: domain.availabilityStatus
            }
          })
        }
        console.log(`✅ Found ${response.value.length} accepted domains`)
      }
    } catch (error) {
      this.handleError('collectAcceptedDomains', error)
    }
  }

  /**
   * Collect Mail Connectors (Inbound & Outbound)
   * EXOInboundConnector, EXOOutboundConnector
   */
  async collectConnectors() {
    try {
      console.log('📋 Collecting Mail Connectors...')

      // Note: Connectors require specific admin permissions
      // This would need to be accessed via Azure/Exchange Admin APIs
      // Graph API has limited connector support

      console.log('⚠️ Mail connectors require Exchange Admin Center access (limited Graph API support)')
      console.log('   Consider using Exchange PowerShell for full connector backup')
    } catch (error) {
      this.handleError('collectConnectors', error)
    }
  }

  /**
   * Collect Distribution Groups
   * EXODistributionGroup, EXODistributionGroupMember
   */
  async collectDistributionGroups() {
    try {
      console.log('📋 Collecting Distribution Groups...')

      const response = await this.graphClient
        .api('/groups')
        .filter("groupTypes/any(c:c eq 'DynamicMembership') or NOT(groupTypes/any(c:c eq 'DynamicMembership'))")
        .top(999)
        .get()

      if (response.value && response.value.length > 0) {
        for (const group of response.value) {
          // Skip non-distribution groups
          if (group.groupTypes && group.groupTypes.includes('Unified')) {
            continue
          }

          this.resources.push({
            type: 'EXODistributionGroup',
            name: group.displayName,
            id: group.id,
            configuration: {
              Identity: group.id,
              DisplayName: group.displayName,
              PrimarySmtpAddress: group.mail,
              Alias: group.mailNickname,
              ManagedBy: group.owners?.map(o => o.userPrincipalName) || [],
              Members: [], // Will be populated separately
              GroupType: group.groupTypes || [],
              Description: group.description || '',
              Notes: group.notes || '',
              HasPhoto: group.proxyAddresses?.length > 0
            }
          })
        }

        console.log(`✅ Found ${response.value.length} distribution groups`)

        // Collect group members
        for (const group of response.value) {
          if (group.groupTypes && group.groupTypes.includes('Unified')) {
            continue
          }

          await this.collectGroupMembers(group.id, group.displayName)
        }
      }
    } catch (error) {
      this.handleError('collectDistributionGroups', error)
    }
  }

  /**
   * Collect members for a specific group
   */
  async collectGroupMembers(groupId, groupName) {
    try {
      const membersResponse = await this.graphClient
        .api(`/groups/${groupId}/members`)
        .top(999)
        .get()

      if (membersResponse.value && membersResponse.value.length > 0) {
        // Find the group resource and update members
        const groupResource = this.resources.find(
          r => r.type === 'EXODistributionGroup' && r.id === groupId
        )

        if (groupResource) {
          groupResource.configuration.Members = membersResponse.value.map(member => ({
            displayName: member.displayName,
            userPrincipalName: member.userPrincipalName,
            type: member['@odata.type']
          }))
        }

        console.log(`  └─ ${groupName}: ${membersResponse.value.length} members`)
      }
    } catch (error) {
      this.handleError(`collectGroupMembers(${groupName})`, error)
    }
  }

  /**
   * Collect Mail Contacts
   * EXOMailContact
   */
  async collectMailContacts() {
    try {
      console.log('📋 Collecting Mail Contacts...')

      // Mail contacts are typically external user objects in Graph API
      const response = await this.graphClient
        .api('/contacts')
        .top(999)
        .get()

      if (response.value && response.value.length > 0) {
        for (const contact of response.value) {
          this.resources.push({
            type: 'EXOMailContact',
            name: contact.displayName,
            id: contact.id,
            configuration: {
              Identity: contact.id,
              DisplayName: contact.displayName,
              ExternalEmailAddress: contact.emailAddresses?.[0]?.address || '',
              Alias: contact.surname || '',
              FirstName: contact.givenName || '',
              LastName: contact.surname || '',
              OrganizationalUnit: contact.businessPhones?.[0] || '',
              Notes: contact.personalNotes || ''
            }
          })
        }
        console.log(`✅ Found ${response.value.length} mail contacts`)
      }
    } catch (error) {
      this.handleError('collectMailContacts', error)
    }
  }

  /**
   * Collect Remote Domains
   * EXORemoteDomain
   */
  async collectRemoteDomains() {
    try {
      console.log('📋 Collecting Remote Domains...')

      // Remote domains require Exchange Admin API access
      console.log('⚠️ Remote domains require Exchange Admin Center access (limited Graph API support)')
      console.log('   Consider using Exchange PowerShell for full remote domain backup')
    } catch (error) {
      this.handleError('collectRemoteDomains', error)
    }
  }

  /**
   * Collect Transport Rules
   * EXOTransportRule
   */
  async collectTransportRules() {
    try {
      console.log('📋 Collecting Transport Rules...')

      // Transport rules require Exchange Admin API
      console.log('⚠️ Transport rules require Exchange Admin Center access (limited Graph API support)')
      console.log('   Consider using Exchange PowerShell for full transport rule backup')
    } catch (error) {
      this.handleError('collectTransportRules', error)
    }
  }

  /**
   * Collect Organization Configuration
   * EXOOrgConfig
   */
  async collectOrgConfig() {
    try {
      console.log('📋 Collecting Organization Configuration...')

      // Org-wide settings
      const response = await this.graphClient
        .api('/organization')
        .get()

      if (response.value && response.value.length > 0) {
        const org = response.value[0]

        this.resources.push({
          type: 'EXOOrgConfig',
          name: 'Organization Config',
          id: org.id,
          configuration: {
            Identity: org.id,
            OrganizationName: org.displayName,
            IsMultiNational: org.isMultiNational || false,
            PreferredLanguage: org.preferredLanguage || 'en-US',
            ExchangeVersion: 'Exchange Online',
            TenantId: org.id
          }
        })

        console.log('✅ Organization configuration collected')
      }
    } catch (error) {
      this.handleError('collectOrgConfig', error)
    }
  }

  /**
   * Collect Unified Groups (Microsoft 365 Groups)
   * EXOUnifiedGroup
   */
  async collectUnifiedGroups() {
    try {
      console.log('📋 Collecting Unified/Microsoft 365 Groups...')

      const response = await this.graphClient
        .api('/groups')
        .filter("groupTypes/any(c:c eq 'Unified')")
        .top(999)
        .get()

      if (response.value && response.value.length > 0) {
        for (const group of response.value) {
          this.resources.push({
            type: 'EXOUnifiedGroup',
            name: group.displayName,
            id: group.id,
            configuration: {
              Identity: group.id,
              DisplayName: group.displayName,
              PrimarySmtpAddress: group.mail,
              Alias: group.mailNickname,
              Description: group.description || '',
              Visibility: group.visibility || 'Private',
              IsSubscribedByMail: group.isSubscribedByDefault || false,
              Owner: group.owners?.map(o => o.userPrincipalName)?.[0] || '',
              Members: group.members?.length || 0
            }
          })
        }
        console.log(`✅ Found ${response.value.length} unified groups`)
      }
    } catch (error) {
      this.handleError('collectUnifiedGroups', error)
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

export default ExchangeCollector
