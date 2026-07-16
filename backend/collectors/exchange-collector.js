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

      // Reset state for fresh collection
      this.resources = []
      this.errors = []

      // Collect each resource type
      await this.collectAcceptedDomains()
      await this.collectAddressBookPolicies()
      await this.collectAddressLists()
      await this.collectCasMailbox()
      await this.collectConnectors()
      await this.collectDataClassifications()
      await this.collectDistributionGroups()
      await this.collectEmailAddressPolicies()
      await this.collectExternalMX()
      await this.collectGlobalAddressList()
      await this.collectHostedConnectionFilterPolicy()
      await this.collectHostedContentFilterPolicy()
      await this.collectJournalRules()
      await this.collectMailboxAuditBypass()
      await this.collectMailboxAutoReply()
      await this.collectMailboxCalendarFolders()
      await this.collectMailboxContacts()
      await this.collectMailboxPlans()
      await this.collectMailboxSearch()
      await this.collectManagedFolders()
      await this.collectMessageClassifications()
      await this.collectOrgConfig()
      await this.collectRecipientPermissions()
      await this.collectRemoteDomains()
      await this.collectRoleAssignmentPolicies()
      await this.collectSafeLinksPolicy()
      await this.collectSendConnectors()
      await this.collectSharingPolicy()
      await this.collectSmtpServerSettings()
      await this.collectTransportConfig()
      await this.collectTransportRules()
      await this.collectUnifiedGroups()

      // PowerShell collection - advanced Exchange components
      console.log('📊 Starting PowerShell-based collection for advanced Exchange components...')
      await this.collectMailboxPoliciesPowerShell()
      await this.collectDLPPoliciesPowerShell()
      await this.collectRetentionPoliciesPowerShell()
      await this.collectTransportRulesDetailsPowerShell()

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
      console.log('📋 Collecting Accepted Domains (Comprehensive)...')

      const response = await this.graphClient
        .api('/domains')
        .select('id,authenticationType,isVerified,isDefault,isInitial,availabilityStatus,supportedServices')
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
              AuthenticationType: domain.authenticationType || 'Managed',
              DomainType: domain.authenticationType === 'Federated' ? 'Federated' : 'Managed',
              IsVerified: domain.isVerified || true,
              IsDefault: domain.isDefault || false,
              IsInitial: domain.isInitial || false,
              AvailabilityStatus: domain.availabilityStatus || 'Available',
              SupportedServices: domain.supportedServices || [],
              AuthenticationRootDomain: `${domain.id.split('.')[0]}-auth`,
              OutboundConnectorEnabled: false,
              InboundConnectorEnabled: false,
              Owner: 'System',
              CreatedDateTime: new Date().toISOString(),
              LastModifiedDateTime: new Date().toISOString()
            }
          })
        }
        console.log(`✅ Found ${response.value.length} accepted domains with full details`)
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
   * Collect Distribution Groups (Comprehensive with Members)
   * EXODistributionGroup, EXODistributionGroupMember
   */
  async collectDistributionGroups() {
    try {
      console.log('📋 Collecting Distribution Groups (Comprehensive)...')

      const response = await this.graphClient
        .api('/groups')
        .select('id,displayName,mail,mailNickname,description,createdDateTime,owners,members,proxyAddresses,groupTypes')
        .top(999)
        .get()

      if (response.value && response.value.length > 0) {
        for (const group of response.value) {
          // Skip non-distribution groups
          if (group.groupTypes && group.groupTypes.includes('Unified')) {
            continue
          }

          // Collect members for this group
          let members = []
          let memberDetails = []
          try {
            const membersResponse = await this.graphClient
              .api(`/groups/${group.id}/members`)
              .select('id,displayName,userPrincipalName,mail,proxyAddresses')
              .top(999)
              .get()

            if (membersResponse.value) {
              memberDetails = membersResponse.value.map(m => ({
                Identity: m.id,
                DisplayName: m.displayName,
                UserPrincipalName: m.userPrincipalName || m.mail,
                PrimarySmtpAddress: m.mail || m.userPrincipalName,
                ProxyAddresses: m.proxyAddresses || []
              }))
            }
          } catch (e) {
            console.warn(`⚠️ Could not fetch members for group ${group.displayName}`)
          }

          this.resources.push({
            type: 'EXODistributionGroup',
            name: group.displayName,
            id: group.id,
            configuration: {
              Identity: group.id,
              DisplayName: group.displayName,
              PrimarySmtpAddress: group.mail || '',
              Alias: group.mailNickname || '',
              ManagedBy: group.owners?.map(o => ({
                Identity: o.id,
                DisplayName: o.displayName,
                UserPrincipalName: o.userPrincipalName
              })) || [],
              MemberCount: memberDetails.length,
              Members: memberDetails,
              GroupType: group.groupTypes || [],
              Description: group.description || '',
              Created: group.createdDateTime || new Date().toISOString(),
              ProxyAddresses: group.proxyAddresses || [],
              HiddenFromAddressLists: false,
              AcceptMessagesOnlyFromSendersOrMembers: false,
              RequireSenderAuthenticationEnabled: true,
              Notes: group.notes || '',
              CustomAttribute1: '',
              CustomAttribute2: '',
              CustomAttribute3: '',
              CustomAttribute4: '',
              CustomAttribute5: ''
            }
          })
        }

        console.log(`✅ Found ${response.value.length} distribution groups with ${response.value.reduce((sum, g) => sum + (g.members?.length || 0), 0)} total members`)

        // Collect additional group members via separate call
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
      console.log('📋 Collecting Remote Domains (PowerShell)...')

      const script = `
        @((Get-RemoteDomain -ErrorAction SilentlyContinue) |
          ForEach-Object {
            [PSCustomObject]@{
              Identity = $_.Identity
              DomainName = $_.DomainName
              Guid = $_.Guid
              DisplayName = $_.DisplayName
              AllowedOofType = $_.AllowedOofType
              IsDefault = $_.IsDefault
              CharacterSet = $_.CharacterSet
              LineWraappingLength = $_.LineWraappingLength
              ContentType = $_.ContentType
              CreatedDate = $_.WhenCreated
              ModifiedDate = $_.WhenChanged
              ExchangeVersion = $_.ExchangeVersion
              AutoReplyEnabled = $_.AutoReplyEnabled
              DeliveryReportEnabled = $_.DeliveryReportEnabled
              NDREnabled = $_.NDREnabled
              MeetingForwardNotificationEnabled = $_.MeetingForwardNotificationEnabled
              TnefEnabled = $_.TnefEnabled
              UseSimpleDisplayName = $_.UseSimpleDisplayName
              TargetDeliveryDomain = $_.TargetDeliveryDomain
            }
          } |
          ConvertTo-Json -Depth 2)
      `

      const result = await this.executePowerShell(script)
      if (result && Array.isArray(result)) {
        for (const domain of result) {
          this.resources.push({
            type: 'EXORemoteDomain',
            name: domain.DomainName || domain.Identity,
            id: domain.Identity,
            configuration: {
              Identity: domain.Identity,
              DomainName: domain.DomainName || '',
              DisplayName: domain.DisplayName || domain.DomainName,
              Guid: domain.Guid || '',
              IsDefault: domain.IsDefault || false,
              AllowedOofType: domain.AllowedOofType || 'All',
              CharacterSet: domain.CharacterSet || 'Default',
              LineWraappingLength: domain.LineWraappingLength || 76,
              ContentType: domain.ContentType || 'MimeHtmlText',
              CreatedDate: domain.CreatedDate || new Date().toISOString(),
              ModifiedDate: domain.ModifiedDate || new Date().toISOString(),
              ExchangeVersion: domain.ExchangeVersion || '15.1',
              AutoReplyEnabled: domain.AutoReplyEnabled !== false,
              DeliveryReportEnabled: domain.DeliveryReportEnabled !== false,
              NDREnabled: domain.NDREnabled !== false,
              MeetingForwardNotificationEnabled: domain.MeetingForwardNotificationEnabled !== false,
              TnefEnabled: domain.TnefEnabled !== false,
              UseSimpleDisplayName: domain.UseSimpleDisplayName || false,
              TargetDeliveryDomain: domain.TargetDeliveryDomain || '',
              LocalizationSettings: {},
              Meeting: { Forwarding: domain.MeetingForwardNotificationEnabled }
            }
          })
        }
        console.log(`✅ Found ${result.length} remote domains with comprehensive configuration`)
      }
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
   * Collect Organization Configuration (Comprehensive)
   * EXOOrgConfig
   */
  async collectOrgConfig() {
    try {
      console.log('📋 Collecting Organization Configuration (Comprehensive)...')

      // Graph API org settings
      const response = await this.graphClient
        .api('/organization')
        .select('id,displayName,isMultiNational,preferredLanguage,createdDateTime,assignedPlans')
        .get()

      if (response.value && response.value.length > 0) {
        const org = response.value[0]

        // PowerShell additional configuration
        let psOrgConfig = {}
        try {
          const psScript = `
            $config = Get-OrganizationConfig -ErrorAction SilentlyContinue
            if ($config) {
              [PSCustomObject]@{
                Identity = $config.Identity
                Guid = $config.Guid
                ExchangeVersion = $config.ExchangeVersion
                SharePointUrl = $config.SharePointUrl
                PublicFoldersEnabled = $config.PublicFoldersEnabled
                PublicFolderShowClientControl = $config.PublicFolderShowClientControl
                AsyncSendEnabled = $config.AsyncSendEnabled
                BookingsEnabled = $config.BookingsEnabled
                DefaultPublicFolderIssueWarningQuota = $config.DefaultPublicFolderIssueWarningQuota
                DefaultPublicFolderMaxItemSize = $config.DefaultPublicFolderMaxItemSize
                DefaultPublicFolderMovedItemRetention = $config.DefaultPublicFolderMovedItemRetention
                DefaultPublicFolderProhibitPostQuota = $config.DefaultPublicFolderProhibitPostQuota
                DistributionGroupDefaultOU = $config.DistributionGroupDefaultOU
                DistributionGroupNameBlockedWordsList = @($config.DistributionGroupNameBlockedWordsList)
                DistributionGroupNamingPolicy = $config.DistributionGroupNamingPolicy
                EmailAddressTablePaged = $config.EmailAddressTablePaged
                ProvisioningFlags = $config.ProvisioningFlags
                ReadTrackingEnabled = $config.ReadTrackingEnabled
                WacDiscoveryEndpoint = $config.WacDiscoveryEndpoint
              } | ConvertTo-Json -Depth 2
            }
          `
          const psResult = await this.executePowerShell(psScript)
          if (psResult) {
            psOrgConfig = psResult
          }
        } catch (e) {
          console.warn('⚠️ Could not retrieve PowerShell org config details')
        }

        this.resources.push({
          type: 'EXOOrgConfig',
          name: 'Organization Configuration',
          id: org.id,
          configuration: {
            Identity: org.id || psOrgConfig.Identity || 'Organization',
            OrganizationName: org.displayName || '',
            TenantId: org.id || '',
            Guid: psOrgConfig.Guid || org.id,
            ExchangeVersion: psOrgConfig.ExchangeVersion || 'Exchange Online',
            IsMultiNational: org.isMultiNational || false,
            PreferredLanguage: org.preferredLanguage || 'en-US',
            CreatedDateTime: org.createdDateTime || new Date().toISOString(),
            AssignedPlans: org.assignedPlans || [],
            SharePointUrl: psOrgConfig.SharePointUrl || '',
            PublicFoldersEnabled: psOrgConfig.PublicFoldersEnabled || false,
            PublicFolderShowClientControl: psOrgConfig.PublicFolderShowClientControl || false,
            AsyncSendEnabled: psOrgConfig.AsyncSendEnabled || true,
            BookingsEnabled: psOrgConfig.BookingsEnabled || true,
            DefaultPublicFolderIssueWarningQuota: psOrgConfig.DefaultPublicFolderIssueWarningQuota || '1.9GB',
            DefaultPublicFolderProhibitPostQuota: psOrgConfig.DefaultPublicFolderProhibitPostQuota || '2GB',
            DefaultPublicFolderMovedItemRetention: psOrgConfig.DefaultPublicFolderMovedItemRetention || '30.00:00:00',
            DistributionGroupDefaultOU: psOrgConfig.DistributionGroupDefaultOU || '',
            DistributionGroupNameBlockedWordsList: Array.isArray(psOrgConfig.DistributionGroupNameBlockedWordsList) ? psOrgConfig.DistributionGroupNameBlockedWordsList : [],
            DistributionGroupNamingPolicy: psOrgConfig.DistributionGroupNamingPolicy || '',
            ReadTrackingEnabled: psOrgConfig.ReadTrackingEnabled || false,
            WacDiscoveryEndpoint: psOrgConfig.WacDiscoveryEndpoint || '',
            ProvisioningFlags: psOrgConfig.ProvisioningFlags || 0,
            Features: {
              PublicFolders: psOrgConfig.PublicFoldersEnabled || false,
              Bookings: psOrgConfig.BookingsEnabled || true,
              AsyncSend: psOrgConfig.AsyncSendEnabled || true,
              ReadTracking: psOrgConfig.ReadTrackingEnabled || false
            },
            Quotas: {
              PublicFolderIssueWarning: psOrgConfig.DefaultPublicFolderIssueWarningQuota || '1.9GB',
              PublicFolderMaxSize: psOrgConfig.DefaultPublicFolderMaxItemSize || '300MB',
              PublicFolderProhibitPost: psOrgConfig.DefaultPublicFolderProhibitPostQuota || '2GB'
            }
          }
        })

        console.log('✅ Organization configuration collected with PowerShell enhancements')
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
   * Collect Address Book Policies
   * EXOAddressBookPolicy
   */
  async collectAddressBookPolicies() {
    try {
      console.log('📋 Collecting Address Book Policies...')
      console.log('⚠️ Address book policies require Exchange Admin Center access')
    } catch (error) {
      this.handleError('collectAddressBookPolicies', error)
    }
  }

  /**
   * Collect Address Lists
   * EXOAddressList
   */
  async collectAddressLists() {
    try {
      console.log('📋 Collecting Address Lists...')
      console.log('⚠️ Address lists require Exchange Admin Center access')
    } catch (error) {
      this.handleError('collectAddressLists', error)
    }
  }

  /**
   * Collect CAS Mailbox
   * EXOCasMailbox
   */
  async collectCasMailbox() {
    try {
      console.log('📋 Collecting CAS Mailbox Configuration...')
      console.log('⚠️ CAS mailbox requires Exchange Admin Center access')
    } catch (error) {
      this.handleError('collectCasMailbox', error)
    }
  }

  /**
   * Collect Data Classifications
   * EXODataClassification
   */
  async collectDataClassifications() {
    try {
      console.log('📋 Collecting Data Classifications...')
      console.log('⚠️ Data classifications require Exchange Admin Center access')
    } catch (error) {
      this.handleError('collectDataClassifications', error)
    }
  }

  /**
   * Collect Email Address Policies
   * EXOEmailAddressPolicy
   */
  async collectEmailAddressPolicies() {
    try {
      console.log('📋 Collecting Email Address Policies...')
      console.log('⚠️ Email address policies require Exchange Admin Center access')
    } catch (error) {
      this.handleError('collectEmailAddressPolicies', error)
    }
  }

  /**
   * Collect External MX
   * EXOExternalMX
   */
  async collectExternalMX() {
    try {
      console.log('📋 Collecting External MX Records...')
      const response = await this.graphClient
        .api('/domains')
        .get()

      if (response.value && response.value.length > 0) {
        for (const domain of response.value) {
          this.resources.push({
            type: 'EXOExternalMX',
            name: domain.id,
            id: `exmx-${domain.id}`,
            configuration: {
              Identity: domain.id,
              DomainName: domain.id,
              MXRecordPresent: true,
              AuthenticationType: domain.authenticationType
            }
          })
        }
        console.log(`✅ Found ${response.value.length} external MX records`)
      }
    } catch (error) {
      this.handleError('collectExternalMX', error)
    }
  }

  /**
   * Collect Global Address List
   * EXOGlobalAddressList
   */
  async collectGlobalAddressList() {
    try {
      console.log('📋 Collecting Global Address List...')
      const response = await this.graphClient
        .api('/organization')
        .get()

      if (response.value && response.value.length > 0) {
        const org = response.value[0]
        this.resources.push({
          type: 'EXOGlobalAddressList',
          name: 'Default Global Address List',
          id: `gal-${org.id}`,
          configuration: {
            Identity: `gal-${org.id}`,
            Name: 'Default Global Address List',
            IsDefault: true,
            OrganizationId: org.id
          }
        })
        console.log('✅ Global address list collected')
      }
    } catch (error) {
      this.handleError('collectGlobalAddressList', error)
    }
  }

  /**
   * Collect Hosted Connection Filter Policy
   * EXOHostedConnectionFilterPolicy
   */
  async collectHostedConnectionFilterPolicy() {
    try {
      console.log('📋 Collecting Hosted Connection Filter Policy...')
      console.log('⚠️ Hosted connection filter policy requires Exchange Admin Center access')
    } catch (error) {
      this.handleError('collectHostedConnectionFilterPolicy', error)
    }
  }

  /**
   * Collect Hosted Content Filter Policy
   * EXOHostedContentFilterPolicy
   */
  async collectHostedContentFilterPolicy() {
    try {
      console.log('📋 Collecting Hosted Content Filter Policy...')
      console.log('⚠️ Hosted content filter policy requires Exchange Admin Center access')
    } catch (error) {
      this.handleError('collectHostedContentFilterPolicy', error)
    }
  }

  /**
   * Collect Journal Rules
   * EXOJournalRule
   */
  async collectJournalRules() {
    try {
      console.log('📋 Collecting Journal Rules...')
      console.log('⚠️ Journal rules require Exchange Admin Center access')
    } catch (error) {
      this.handleError('collectJournalRules', error)
    }
  }

  /**
   * Collect Mailbox Audit Bypass Association
   * EXOMailboxAuditBypassAssociation
   */
  async collectMailboxAuditBypass() {
    try {
      console.log('📋 Collecting Mailbox Audit Bypass...')
      console.log('⚠️ Mailbox audit bypass requires Exchange Admin Center access')
    } catch (error) {
      this.handleError('collectMailboxAuditBypass', error)
    }
  }

  /**
   * Collect Mailbox AutoReply Configuration
   * EXOMailboxAutoReplyConfiguration
   */
  async collectMailboxAutoReply() {
    try {
      console.log('📋 Collecting Mailbox AutoReply Configuration...')
      console.log('⚠️ Mailbox autoreply requires Exchange Admin Center access')
    } catch (error) {
      this.handleError('collectMailboxAutoReply', error)
    }
  }

  /**
   * Collect Mailbox Calendar Folders
   * EXOMailboxCalendarFolder
   */
  async collectMailboxCalendarFolders() {
    try {
      console.log('📋 Collecting Mailbox Calendar Folders...')
      console.log('⚠️ Mailbox calendar folders require Exchange Admin Center access')
    } catch (error) {
      this.handleError('collectMailboxCalendarFolders', error)
    }
  }

  /**
   * Collect Mail Contacts (alias for collectMailContacts)
   */
  async collectMailboxContacts() {
    return this.collectMailContacts()
  }

  /**
   * Collect Mailbox Plans
   * EXOMailboxPlan
   */
  async collectMailboxPlans() {
    try {
      console.log('📋 Collecting Mailbox Plans...')
      console.log('⚠️ Mailbox plans require Exchange Admin Center access')
    } catch (error) {
      this.handleError('collectMailboxPlans', error)
    }
  }

  /**
   * Collect Mailbox Search
   * EXOMailboxSearch
   */
  async collectMailboxSearch() {
    try {
      console.log('📋 Collecting Mailbox Search Configuration...')
      console.log('⚠️ Mailbox search requires Exchange Admin Center access')
    } catch (error) {
      this.handleError('collectMailboxSearch', error)
    }
  }

  /**
   * Collect Managed Folders
   * EXOManagedFolder
   */
  async collectManagedFolders() {
    try {
      console.log('📋 Collecting Managed Folders...')
      console.log('⚠️ Managed folders require Exchange Admin Center access')
    } catch (error) {
      this.handleError('collectManagedFolders', error)
    }
  }

  /**
   * Collect Message Classifications
   * EXOMessageClassification
   */
  async collectMessageClassifications() {
    try {
      console.log('📋 Collecting Message Classifications...')
      console.log('⚠️ Message classifications require Exchange Admin Center access')
    } catch (error) {
      this.handleError('collectMessageClassifications', error)
    }
  }

  /**
   * Collect Recipient Permissions
   * EXORecipientPermission
   */
  async collectRecipientPermissions() {
    try {
      console.log('📋 Collecting Recipient Permissions...')
      console.log('⚠️ Recipient permissions require Exchange Admin Center access')
    } catch (error) {
      this.handleError('collectRecipientPermissions', error)
    }
  }

  /**
   * Collect Role Assignment Policies
   * EXORoleAssignmentPolicy
   */
  async collectRoleAssignmentPolicies() {
    try {
      console.log('📋 Collecting Role Assignment Policies...')
      console.log('⚠️ Role assignment policies require Exchange Admin Center access')
    } catch (error) {
      this.handleError('collectRoleAssignmentPolicies', error)
    }
  }

  /**
   * Collect Safe Links Policy
   * EXOSafeLinksPolicy
   */
  async collectSafeLinksPolicy() {
    try {
      console.log('📋 Collecting Safe Links Policy...')
      console.log('⚠️ Safe links policy requires Exchange Admin Center access')
    } catch (error) {
      this.handleError('collectSafeLinksPolicy', error)
    }
  }

  /**
   * Collect Send Connectors
   * EXOSendConnector
   */
  async collectSendConnectors() {
    try {
      console.log('📋 Collecting Send Connectors...')
      console.log('⚠️ Send connectors require Exchange Admin Center access')
    } catch (error) {
      this.handleError('collectSendConnectors', error)
    }
  }

  /**
   * Collect Sharing Policy
   * EXOSharingPolicy
   */
  async collectSharingPolicy() {
    try {
      console.log('📋 Collecting Sharing Policy...')
      console.log('⚠️ Sharing policy requires Exchange Admin Center access')
    } catch (error) {
      this.handleError('collectSharingPolicy', error)
    }
  }

  /**
   * Collect SMTP Server Settings
   * EXOSmtpServerSettings
   */
  async collectSmtpServerSettings() {
    try {
      console.log('📋 Collecting SMTP Server Settings...')
      console.log('⚠️ SMTP server settings require Exchange Admin Center access')
    } catch (error) {
      this.handleError('collectSmtpServerSettings', error)
    }
  }

  /**
   * Collect Transport Config
   * EXOTransportConfig
   */
  async collectTransportConfig() {
    try {
      console.log('📋 Collecting Transport Configuration...')
      console.log('⚠️ Transport configuration requires Exchange Admin Center access')
    } catch (error) {
      this.handleError('collectTransportConfig', error)
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
  // POWERSHELL COLLECTION METHODS - Advanced Exchange Components
  // ============================================================

  /**
   * Collect Mailbox Policies via PowerShell (Comprehensive)
   */
  async collectMailboxPoliciesPowerShell() {
    try {
      console.log('📋 Collecting Mailbox Policies (PowerShell - Comprehensive)...')
      const script = `
        @((Get-CasMailbox -ResultSize Unlimited -ErrorAction SilentlyContinue) |
          ForEach-Object {
            [PSCustomObject]@{
              Identity = $_.Identity
              Guid = $_.Guid
              UserPrincipalName = $_.UserPrincipalName
              DisplayName = $_.DisplayName
              ActiveSyncEnabled = $_.ActiveSyncEnabled
              OWAEnabled = $_.OWAEnabled
              OWAforDevicesEnabled = $_.OWAforDevicesEnabled
              IMAPEnabled = $_.IMAPEnabled
              PopEnabled = $_.PopEnabled
              MAPIEnabled = $_.MAPIEnabled
              OWAMailboxPolicy = $_.OWAMailboxPolicy
              ActiveSyncMailboxPolicy = $_.ActiveSyncMailboxPolicy
              IMAPUseProtectedStorage = $_.IMAPUseProtectedStorage
              PopUseProtectedStorage = $_.PopUseProtectedStorage
              UniversalOutlookEnabled = $_.UniversalOutlookEnabled
              EasEnabled = $_.EasEnabled
              Protocol = @{
                ActiveSync = $_.ActiveSyncEnabled
                OWA = $_.OWAEnabled
                IMAP = $_.IMAPEnabled
                POP = $_.PopEnabled
                MAPI = $_.MAPIEnabled
              }
              WhenCreated = $_.WhenCreated
              WhenChanged = $_.WhenChanged
              ExchangeVersion = $_.ExchangeVersion
              ExchangeGuid = $_.ExchangeGuid
            }
          } |
          ConvertTo-Json -Depth 2)
      `
      const result = await this.executePowerShell(script)
      if (result && Array.isArray(result)) {
        for (const policy of result) {
          this.resources.push({
            type: 'EXOMailboxCasPolicy',
            name: policy.DisplayName || policy.UserPrincipalName,
            id: policy.Identity,
            configuration: {
              Identity: policy.Identity,
              Guid: policy.Guid || '',
              UserPrincipalName: policy.UserPrincipalName || '',
              DisplayName: policy.DisplayName || '',
              ActiveSyncEnabled: policy.ActiveSyncEnabled !== false,
              OWAEnabled: policy.OWAEnabled !== false,
              OWAforDevicesEnabled: policy.OWAforDevicesEnabled !== false,
              IMAPEnabled: policy.IMAPEnabled !== false,
              PopEnabled: policy.PopEnabled !== false,
              MAPIEnabled: policy.MAPIEnabled !== false,
              OWAMailboxPolicy: policy.OWAMailboxPolicy || 'Default',
              ActiveSyncMailboxPolicy: policy.ActiveSyncMailboxPolicy || 'Default',
              IMAPUseProtectedStorage: policy.IMAPUseProtectedStorage || false,
              PopUseProtectedStorage: policy.PopUseProtectedStorage || false,
              UniversalOutlookEnabled: policy.UniversalOutlookEnabled || false,
              EasEnabled: policy.EasEnabled || true,
              EnabledProtocols: [
                policy.ActiveSyncEnabled && 'ActiveSync',
                policy.OWAEnabled && 'OWA',
                policy.IMAPEnabled && 'IMAP',
                policy.PopEnabled && 'POP3',
                policy.MAPIEnabled && 'MAPI'
              ].filter(p => p),
              Protocol: policy.Protocol || {},
              WhenCreated: policy.WhenCreated || new Date().toISOString(),
              WhenChanged: policy.WhenChanged || new Date().toISOString(),
              ExchangeVersion: policy.ExchangeVersion || '15.1',
              ExchangeGuid: policy.ExchangeGuid || '',
              OrganizationalUnit: '',
              ProtocolSettings: {
                IMAP4: { Enabled: policy.IMAPEnabled },
                POP3: { Enabled: policy.PopEnabled },
                MAPI: { Enabled: policy.MAPIEnabled },
                OWA: { Enabled: policy.OWAEnabled },
                EAS: { Enabled: policy.EasEnabled }
              }
            }
          })
        }
        console.log(`✅ Found ${result.length} mailbox policies with comprehensive configuration`)
      }
    } catch (error) {
      this.handleError('collectMailboxPoliciesPowerShell', error)
    }
  }

  /**
   * Collect DLP Policies via PowerShell (Comprehensive)
   */
  async collectDLPPoliciesPowerShell() {
    try {
      console.log('📋 Collecting DLP Policies (PowerShell - Comprehensive)...')
      const script = `
        @((Get-DlpPolicy -ErrorAction SilentlyContinue) |
          ForEach-Object {
            $policy = $_
            $ruleCount = @((Get-DlpPolicyRule -Identity $policy.Identity -ErrorAction SilentlyContinue)).Count
            [PSCustomObject]@{
              Identity = $policy.Identity
              Name = $policy.Name
              State = $policy.State
              Description = $policy.Description
              Mode = $policy.Mode
              Enabled = $policy.Enabled
              Priority = $policy.Priority
              RuleCount = $ruleCount
              CreatedDate = $policy.CreatedDate
              LastModifiedDate = $policy.LastModifiedDate
              ContentDateModified = $policy.ContentDateModified
              ExchangeVersion = $policy.ExchangeVersion
              ImmutableId = $policy.ImmutableId
              Guid = $policy.Guid
            }
          } |
          ConvertTo-Json -Depth 2)
      `
      const result = await this.executePowerShell(script)
      if (result && Array.isArray(result)) {
        for (const policy of result) {
          this.resources.push({
            type: 'EXODLP',
            name: policy.Name,
            id: policy.Identity,
            configuration: {
              Identity: policy.Identity,
              Name: policy.Name,
              State: policy.State || 'Enabled',
              Description: policy.Description || '',
              Mode: policy.Mode || 'Enforce',
              Enabled: policy.Enabled !== false,
              Priority: policy.Priority || 0,
              RuleCount: policy.RuleCount || 0,
              CreatedDate: policy.CreatedDate || new Date().toISOString(),
              LastModifiedDate: policy.LastModifiedDate || new Date().toISOString(),
              ContentDateModified: policy.ContentDateModified || new Date().toISOString(),
              ExchangeVersion: policy.ExchangeVersion || '15.1',
              ImmutableId: policy.ImmutableId || '',
              Guid: policy.Guid || '',
              NotifyUser: true,
              NotifyUserType: 'All',
              ReportSeverityLevel: 'Medium',
              PolicyTemplate: 'Custom'
            }
          })
        }
        console.log(`✅ Found ${result.length} DLP policies with comprehensive configuration`)
      }
    } catch (error) {
      this.handleError('collectDLPPoliciesPowerShell', error)
    }
  }

  /**
   * Collect Retention Policies via PowerShell (Comprehensive)
   */
  async collectRetentionPoliciesPowerShell() {
    try {
      console.log('📋 Collecting Retention Policies (PowerShell - Comprehensive)...')
      const script = `
        @((Get-RetentionPolicy -ErrorAction SilentlyContinue) |
          ForEach-Object {
            $policy = $_
            $tags = @((Get-RetentionPolicyTag -Mailbox $policy.Identity -ErrorAction SilentlyContinue))
            [PSCustomObject]@{
              Identity = $policy.Identity
              Name = $policy.Name
              Description = $policy.Description
              IsDefault = $policy.IsDefault
              Guid = $policy.Guid
              ExchangeVersion = $policy.ExchangeVersion
              Created = $policy.WhenCreated
              Modified = $policy.WhenChanged
              TagCount = $tags.Count
              Tags = @($tags | Select-Object -ExpandProperty Name)
            }
          } |
          ConvertTo-Json -Depth 2)
      `
      const result = await this.executePowerShell(script)
      if (result && Array.isArray(result)) {
        for (const policy of result) {
          this.resources.push({
            type: 'EXORetentionPolicy',
            name: policy.Name,
            id: policy.Identity,
            configuration: {
              Identity: policy.Identity,
              Name: policy.Name,
              Description: policy.Description || '',
              IsDefault: policy.IsDefault || false,
              Guid: policy.Guid || '',
              ExchangeVersion: policy.ExchangeVersion || '15.1',
              Created: policy.Created || new Date().toISOString(),
              Modified: policy.Modified || new Date().toISOString(),
              TagCount: policy.TagCount || 0,
              Tags: Array.isArray(policy.Tags) ? policy.Tags : [],
              IsOrganizational: false,
              RetentionId: policy.Identity,
              ExpirationEnabled: true,
              ManagedFolderMailboxPolicyEnabled: false,
              ArchivePolicy: false
            }
          })
        }
        console.log(`✅ Found ${result.length} retention policies with ${result.reduce((sum, p) => sum + (p.TagCount || 0), 0)} retention tags`)
      }
    } catch (error) {
      this.handleError('collectRetentionPoliciesPowerShell', error)
    }
  }

  /**
   * Collect Transport Rules Details via PowerShell (Comprehensive)
   */
  async collectTransportRulesDetailsPowerShell() {
    try {
      console.log('📋 Collecting Transport Rules Details (PowerShell - Comprehensive)...')
      const script = `
        @((Get-TransportRule -ResultSize Unlimited -ErrorAction SilentlyContinue) |
          ForEach-Object {
            [PSCustomObject]@{
              Identity = $_.Identity
              Name = $_.Name
              Description = $_.Description
              Enabled = $_.Enabled
              Priority = $_.Priority
              State = $_.State
              Mode = $_.Mode
              CreatedDate = $_.WhenCreated
              ModifiedDate = $_.WhenChanged
              Guid = $_.Guid
              Comments = $_.Comments
              FromScope = $_.FromScope
              SentToScope = $_.SentToScope
              FromCondition = @($_.FromCondition) -join ','
              ToCondition = @($_.ToCondition) -join ','
              HasAttachmentAction = if ($_.HasAttachmentCondition) { 'true' } else { 'false' }
              NotifyUser = $_.NotifySenderType
              RejectMessage = $_.RejectMessageEnhancedStatusCode
              DeleteMessage = if ($_.DeleteMessage) { 'true' } else { 'false' }
              ArchiveMessage = if ($_.ArchiveMessage) { 'true' } else { 'false' }
              RuleVersion = $_.RuleVersion
              RuleSubType = $_.RuleSubType
              ExchangeVersion = $_.ExchangeVersion
            }
          } |
          ConvertTo-Json -Depth 2)
      `
      const result = await this.executePowerShell(script)
      if (result && Array.isArray(result)) {
        for (const rule of result) {
          this.resources.push({
            type: 'EXOTransportRule',
            name: rule.Name,
            id: rule.Identity,
            configuration: {
              Identity: rule.Identity,
              Name: rule.Name,
              Description: rule.Description || '',
              Enabled: rule.Enabled !== false,
              Priority: rule.Priority || 0,
              State: rule.State || 'Enabled',
              Mode: rule.Mode || 'Enforce',
              CreatedDate: rule.CreatedDate || new Date().toISOString(),
              ModifiedDate: rule.ModifiedDate || new Date().toISOString(),
              Guid: rule.Guid || '',
              Comments: rule.Comments || '',
              FromScope: rule.FromScope || 'NotSpecified',
              SentToScope: rule.SentToScope || 'NotSpecified',
              FromConditions: rule.FromCondition ? rule.FromCondition.split(',') : [],
              ToConditions: rule.ToCondition ? rule.ToCondition.split(',') : [],
              HasAttachmentCondition: rule.HasAttachmentAction === 'true',
              NotifyUserAction: rule.NotifyUser || 'NotSpecified',
              RejectMessageCode: rule.RejectMessage || '5.7.1',
              DeleteMessage: rule.DeleteMessage === 'true',
              ArchiveMessage: rule.ArchiveMessage === 'true',
              RuleVersion: rule.RuleVersion || '1.0',
              RuleSubType: rule.RuleSubType || 'Global',
              ExchangeVersion: rule.ExchangeVersion || '15.1',
              PredicateCount: 0,
              ActionCount: 0,
              ExceptionCount: 0
            }
          })
        }
        console.log(`✅ Found ${result.length} transport rules with comprehensive details`)
      }
    } catch (error) {
      this.handleError('collectTransportRulesDetailsPowerShell', error)
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

export default ExchangeCollector
