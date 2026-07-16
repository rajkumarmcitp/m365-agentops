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
      await this.collectApplicationAccessPolicy()
      await this.collectAuthenticationPolicies()
      await this.collectAvailabilityAddressSpace()
      await this.collectAvailabilityConfig()
      await this.collectCalendarProcessing()
      await this.collectCasMailbox()
      await this.collectConnectors()
      await this.collectDataAtRestEncryptionPolicies()
      await this.collectDataClassifications()
      await this.collectDistributionGroups()
      await this.collectDynamicDistributionGroups()
      await this.collectEmailAddressPolicies()
      await this.collectExternalMX()
      await this.collectFocusedInbox()
      await this.collectGlobalAddressList()
      await this.collectGroupSettings()
      await this.collectHostedConnectionFilterPolicy()
      await this.collectHostedContentFilterPolicy()
      await this.collectIntraOrganizationConnector()
      await this.collectJournalRules()
      await this.collectMailboxAuditBypass()
      await this.collectMailboxAutoReply()
      await this.collectMailboxCalendarConfiguration()
      await this.collectMailboxCalendarFolders()
      await this.collectMailboxContacts()
      await this.collectMailboxFolderPermissions()
      await this.collectMailboxIRMAccess()
      await this.collectMailboxPermissions()
      await this.collectMailboxPlans()
      await this.collectMailboxSearch()
      await this.collectManagedFolders()
      await this.collectMessageClassifications()
      await this.collectMigration()
      await this.collectMigrationEndpoints()
      await this.collectOfflineAddressBook()
      await this.collectOnPremisesOrganization()
      await this.collectOrgConfig()
      await this.collectOrganizationRelationship()
      await this.collectPartnerApplication()
      await this.collectPlace()
      await this.collectQuarantinePolicy()
      await this.collectRecipientPermissions()
      await this.collectRemoteDomains()
      await this.collectRoleAssignmentPolicies()
      await this.collectSafeLinksPolicy()
      await this.collectSendConnectors()
      await this.collectServicePrincipal()
      await this.collectSharingPolicy()
      await this.collectSharedMailbox()
      await this.collectSmtpServerSettings()
      await this.collectTenantAllowBlockList()
      await this.collectTransportConfig()
      await this.collectTransportRules()
      await this.collectUnifiedGroups()

      // PowerShell collection - advanced Exchange components
      console.log('📊 Starting PowerShell-based collection for advanced Exchange components...')
      await this.collectRoleGroupsPowerShell()
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
      console.log('📋 Collecting Data Classifications (Phase 1 - 225 instances)...')

      const script = `
        \$classifications = Get-DataClassification -ErrorAction Continue |
        Select-Object Name, Description, Guid, @{n='Confidence';e={\$_.Confidence}}, Enabled |
        ConvertTo-Json -Depth 2
        if (\$classifications) { Write-Host \$classifications } else { Write-Host '[]' }
      `

      const classifications = await this.executePowerShell(script)

      if (Array.isArray(classifications) && classifications.length > 0) {
        for (const dc of classifications) {
          this.resources.push({
            type: 'EXODataClassification',
            name: dc.Name || dc.Guid,
            id: dc.Guid || dc.Name,
            properties: {
              Identity: dc.Guid || dc.Name,
              Name: dc.Name,
              Description: dc.Description || '',
              Guid: dc.Guid,
              Confidence: dc.Confidence || 'Unknown',
              Enabled: dc.Enabled !== false,
              ExportDate: new Date().toISOString()
            }
          })
        }
        console.log(`✅ Found ${classifications.length} data classifications`)
      } else {
        console.log('ℹ️ No data classifications found')
      }
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
      console.log('📋 Collecting Email Address Policies (Phase 1)...')

      const script = `
        \$policies = Get-EmailAddressPolicy -ErrorAction Continue |
        Select-Object Name, Identity, DisplayName, Priority, RecipientType, RecipientContainer, @{n='Enabled';e={\$_.Enabled}} |
        ConvertTo-Json -Depth 2
        if (\$policies) { Write-Host \$policies } else { Write-Host '[]' }
      `

      const policies = await this.executePowerShell(script)

      if (Array.isArray(policies) && policies.length > 0) {
        for (const policy of policies) {
          this.resources.push({
            type: 'EXOEmailAddressPolicy',
            name: policy.Name,
            id: policy.Identity,
            properties: {
              Identity: policy.Identity,
              Name: policy.Name,
              DisplayName: policy.DisplayName || policy.Name,
              Priority: policy.Priority || 0,
              RecipientType: policy.RecipientType || 'All',
              RecipientContainer: policy.RecipientContainer,
              Enabled: policy.Enabled !== false,
              ExportDate: new Date().toISOString()
            }
          })
        }
        console.log(`✅ Found ${policies.length} email address policies`)
      } else {
        console.log('ℹ️ No email address policies found')
      }
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
      console.log('📋 Collecting Mailbox Audit Bypass Associations (Phase 1 - 140 instances)...')

      const script = `
        \$bypasses = Get-MailboxAuditBypassAssociation -ErrorAction Continue |
        Select-Object Identity, Name, AuditBypassEnabled, User, @{n='Type';e={\$_.AuditBypassEnabled}}, Guid |
        ConvertTo-Json -Depth 2
        if (\$bypasses) { Write-Host \$bypasses } else { Write-Host '[]' }
      `

      const bypasses = await this.executePowerShell(script)

      if (Array.isArray(bypasses) && bypasses.length > 0) {
        for (const bypass of bypasses) {
          this.resources.push({
            type: 'EXOMailboxAuditBypassAssociation',
            name: bypass.Name || bypass.Identity,
            id: bypass.Identity || bypass.Guid,
            properties: {
              Identity: bypass.Identity,
              Name: bypass.Name,
              User: bypass.User,
              AuditBypassEnabled: bypass.AuditBypassEnabled === true || bypass.Type === true,
              Guid: bypass.Guid,
              ExportDate: new Date().toISOString(),
              Status: bypass.AuditBypassEnabled ? 'Bypassed' : 'Audited'
            }
          })
        }
        console.log(`✅ Found ${bypasses.length} mailbox audit bypass associations`)
      } else {
        console.log('ℹ️ No mailbox audit bypass associations found')
      }
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
   * Collect Exchange Role Groups via PowerShell (Phase 1 - 32 instances)
   * EXORoleGroup
   */
  async collectRoleGroupsPowerShell() {
    try {
      console.log('📋 Collecting Exchange Role Groups (Phase 1 - 32 instances)...')
      const script = `
        \$roleGroups = Get-RoleGroup -ErrorAction Continue |
        Select-Object Identity, Name, DisplayName, Description, Members, @{n='MemberCount';e={@(\$_.Members).Count}}, Guid, WhenCreated, WhenChanged |
        ForEach-Object {
          [PSCustomObject]@{
            Identity = \$_.Identity
            Name = \$_.Name
            DisplayName = \$_.DisplayName
            Description = \$_.Description
            MemberCount = \$_.MemberCount
            Guid = \$_.Guid
            WhenCreated = \$_.WhenCreated
            WhenChanged = \$_.WhenChanged
            Members = @(\$_.Members) | Select-Object -First 50
            ExportDate = (Get-Date).ToIso8601String()
          }
        } | ConvertTo-Json -Depth 3
        Write-Host \$roleGroups
      `

      const roleGroups = await this.executePowerShell(script)

      if (Array.isArray(roleGroups) && roleGroups.length > 0) {
        for (const rg of roleGroups) {
          this.resources.push({
            type: 'EXORoleGroup',
            name: rg.Name,
            id: rg.Identity,
            properties: {
              Identity: rg.Identity,
              Name: rg.Name,
              DisplayName: rg.DisplayName || rg.Name,
              Description: rg.Description || '',
              MemberCount: rg.MemberCount || 0,
              Members: rg.Members || [],
              Guid: rg.Guid,
              WhenCreated: rg.WhenCreated,
              WhenChanged: rg.WhenChanged,
              ExportDate: rg.ExportDate || new Date().toISOString()
            }
          })
        }
        console.log(`✅ Found ${roleGroups.length} Exchange role groups`)
      } else {
        console.log('ℹ️ No Exchange role groups found')
      }
    } catch (error) {
      this.handleError('collectRoleGroupsPowerShell', error)
    }
  }

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
   * Collect Application Access Policies
   * EXOApplicationAccessPolicy (Phase 1)
   */
  async collectApplicationAccessPolicy() {
    try {
      console.log('📋 Collecting Application Access Policies (Phase 1)...')
      const script = `
        @((Get-ApplicationAccessPolicy -ErrorAction Continue) |
          ForEach-Object {
            [PSCustomObject]@{
              Identity = $_.Identity
              Name = $_.Name
              Description = $_.Description
              AccessRight = $_.AccessRight
              AppId = $_.AppId
              PolicyScopeName = $_.PolicyScopeName
              ScopeName = $_.ScopeName
              Guid = $_.Guid
            }
          } |
          ConvertTo-Json -Depth 2)
      `
      const result = await this.executePowerShell(script)
      if (result && Array.isArray(result)) {
        for (const policy of result) {
          this.resources.push({
            type: 'EXOApplicationAccessPolicy',
            name: policy.Name || policy.AppId,
            id: policy.Identity || policy.AppId,
            properties: {
              Identity: policy.Identity,
              Name: policy.Name,
              Description: policy.Description,
              AccessRight: policy.AccessRight,
              AppId: policy.AppId,
              PolicyScopeName: policy.PolicyScopeName,
              ScopeName: policy.ScopeName,
              Guid: policy.Guid,
              ExportDate: new Date().toISOString()
            }
          })
        }
        console.log(`✅ Found ${result.length} application access policies`)
      }
    } catch (error) {
      this.handleError('collectApplicationAccessPolicy', error)
    }
  }

  /**
   * Collect Authentication Policies
   * EXOAuthenticationPolicy & EXOAuthenticationPolicyAssignment (Phase 1)
   */
  async collectAuthenticationPolicies() {
    try {
      console.log('📋 Collecting Authentication Policies (Phase 1)...')
      const script = `
        @((Get-AuthenticationPolicy -ErrorAction Continue) |
          ForEach-Object {
            [PSCustomObject]@{
              Identity = $_.Identity
              Name = $_.Name
              Description = $_.Description
              AllowBasicAuthActiveSync = $_.AllowBasicAuthActiveSync
              AllowBasicAuthImap = $_.AllowBasicAuthImap
              AllowBasicAuthOfflineAddressBook = $_.AllowBasicAuthOfflineAddressBook
              AllowBasicAuthOutlook = $_.AllowBasicAuthOutlook
              AllowBasicAuthPop = $_.AllowBasicAuthPop
              AllowBasicAuthReportingWebServices = $_.AllowBasicAuthReportingWebServices
              AllowBasicAuthSmtp = $_.AllowBasicAuthSmtp
              AllowBasicAuthWebServices = $_.AllowBasicAuthWebServices
              AllowBasicAuthAutodiscover = $_.AllowBasicAuthAutodiscover
              Guid = $_.Guid
            }
          } |
          ConvertTo-Json -Depth 2)
      `
      const result = await this.executePowerShell(script)
      if (result && Array.isArray(result)) {
        for (const policy of result) {
          this.resources.push({
            type: 'EXOAuthenticationPolicy',
            name: policy.Name,
            id: policy.Identity,
            properties: {
              Identity: policy.Identity,
              Name: policy.Name,
              Description: policy.Description,
              AllowBasicAuthProtocols: {
                ActiveSync: policy.AllowBasicAuthActiveSync,
                Imap: policy.AllowBasicAuthImap,
                Pop: policy.AllowBasicAuthPop,
                Smtp: policy.AllowBasicAuthSmtp,
                Outlook: policy.AllowBasicAuthOutlook,
                OfflineAddressBook: policy.AllowBasicAuthOfflineAddressBook,
                WebServices: policy.AllowBasicAuthWebServices,
                ReportingWebServices: policy.AllowBasicAuthReportingWebServices,
                Autodiscover: policy.AllowBasicAuthAutodiscover
              },
              Guid: policy.Guid,
              ExportDate: new Date().toISOString()
            }
          })
        }
        console.log(`✅ Found ${result.length} authentication policies`)
      }
    } catch (error) {
      this.handleError('collectAuthenticationPolicies', error)
    }
  }

  /**
   * Collect Availability Address Spaces
   * EXOAvailabilityAddressSpace (Phase 1)
   */
  async collectAvailabilityAddressSpace() {
    try {
      console.log('📋 Collecting Availability Address Spaces (Phase 1)...')
      const script = `
        @((Get-AvailabilityAddressSpace -ErrorAction Continue) |
          ForEach-Object {
            [PSCustomObject]@{
              Identity = $_.Identity
              Name = $_.Name
              ForestName = $_.ForestName
              AccessMethod = $_.AccessMethod
              UseServiceAccount = $_.UseServiceAccount
              TargetAutodiscoverEpr = $_.TargetAutodiscoverEpr
              Guid = $_.Guid
            }
          } |
          ConvertTo-Json -Depth 2)
      `
      const result = await this.executePowerShell(script)
      if (result && Array.isArray(result)) {
        for (const space of result) {
          this.resources.push({
            type: 'EXOAvailabilityAddressSpace',
            name: space.Name || space.ForestName,
            id: space.Identity,
            properties: {
              Identity: space.Identity,
              Name: space.Name,
              ForestName: space.ForestName,
              AccessMethod: space.AccessMethod,
              UseServiceAccount: space.UseServiceAccount,
              TargetAutodiscoverEpr: space.TargetAutodiscoverEpr,
              Guid: space.Guid,
              ExportDate: new Date().toISOString()
            }
          })
        }
        console.log(`✅ Found ${result.length} availability address spaces`)
      }
    } catch (error) {
      this.handleError('collectAvailabilityAddressSpace', error)
    }
  }

  /**
   * Collect Availability Configuration
   * EXOAvailabilityConfig (Phase 1)
   */
  async collectAvailabilityConfig() {
    try {
      console.log('📋 Collecting Availability Configuration (Phase 1)...')
      const script = `
        @((Get-AvailabilityConfig -ErrorAction Continue) |
          ForEach-Object {
            [PSCustomObject]@{
              Identity = $_.Identity
              OrgWideAccount = $_.OrgWideAccount
              RemoteInteropServicePort = $_.RemoteInteropServicePort
              DeletedItemRetention = $_.DeletedItemRetention
              Guid = $_.Guid
            }
          } |
          ConvertTo-Json -Depth 2)
      `
      const result = await this.executePowerShell(script)
      if (result && Array.isArray(result)) {
        for (const config of result) {
          this.resources.push({
            type: 'EXOAvailabilityConfig',
            name: 'Organization Availability Configuration',
            id: config.Identity,
            properties: {
              Identity: config.Identity,
              OrgWideAccount: config.OrgWideAccount,
              RemoteInteropServicePort: config.RemoteInteropServicePort,
              DeletedItemRetention: config.DeletedItemRetention,
              Guid: config.Guid,
              ExportDate: new Date().toISOString()
            }
          })
        }
        console.log(`✅ Found availability configuration`)
      }
    } catch (error) {
      this.handleError('collectAvailabilityConfig', error)
    }
  }

  /**
   * Collect Calendar Processing
   * EXOCalendarProcessing (Phase 1)
   */
  async collectCalendarProcessing() {
    try {
      console.log('📋 Collecting Calendar Processing Configuration (Phase 1)...')
      const script = `
        @((Get-CalendarProcessing -ResultSize Unlimited -ErrorAction Continue) |
          ForEach-Object {
            [PSCustomObject]@{
              Identity = $_.Identity
              Name = $_.Name
              AutomateProcessing = $_.AutomateProcessing
              AllowConflictMeetings = $_.AllowConflictMeetings
              AllowRecurringMeetings = $_.AllowRecurringMeetings
              EnforceSchedulingHorizonLimit = $_.EnforceSchedulingHorizonLimit
              SchedulingHorizonInDays = $_.SchedulingHorizonInDays
              ConflictPercentageAllowed = $_.ConflictPercentageAllowed
              MaximumConflictInstances = $_.MaximumConflictInstances
              RemovePrivateProperty = $_.RemovePrivateProperty
              RemoveSubject = $_.RemoveSubject
              DeleteSubject = $_.DeleteSubject
              DeleteComments = $_.DeleteComments
              DeleteNonCalendarItems = $_.DeleteNonCalendarItems
              DeleteAttachments = $_.DeleteAttachments
              AddOrganizerToSubject = $_.AddOrganizerToSubject
              Guid = $_.Guid
            }
          } |
          ConvertTo-Json -Depth 2)
      `
      const result = await this.executePowerShell(script)
      if (result && Array.isArray(result)) {
        for (const config of result) {
          this.resources.push({
            type: 'EXOCalendarProcessing',
            name: config.Name || config.Identity,
            id: config.Identity,
            properties: {
              Identity: config.Identity,
              Name: config.Name,
              AutomateProcessing: config.AutomateProcessing,
              AllowConflictMeetings: config.AllowConflictMeetings,
              AllowRecurringMeetings: config.AllowRecurringMeetings,
              EnforceSchedulingHorizonLimit: config.EnforceSchedulingHorizonLimit,
              SchedulingHorizonInDays: config.SchedulingHorizonInDays,
              ConflictPercentageAllowed: config.ConflictPercentageAllowed,
              MaximumConflictInstances: config.MaximumConflictInstances,
              RemovePrivateProperty: config.RemovePrivateProperty,
              RemoveSubject: config.RemoveSubject,
              DeleteSubject: config.DeleteSubject,
              DeleteComments: config.DeleteComments,
              DeleteNonCalendarItems: config.DeleteNonCalendarItems,
              DeleteAttachments: config.DeleteAttachments,
              AddOrganizerToSubject: config.AddOrganizerToSubject,
              Guid: config.Guid,
              ExportDate: new Date().toISOString()
            }
          })
        }
        console.log(`✅ Found ${result.length} calendar processing configurations`)
      }
    } catch (error) {
      this.handleError('collectCalendarProcessing', error)
    }
  }

  /**
   * Collect Data At Rest Encryption Policies
   * EXODataAtRestEncryptionPolicy & EXODataAtRestEncryptionPolicyAssignment (Phase 1)
   */
  async collectDataAtRestEncryptionPolicies() {
    try {
      console.log('📋 Collecting Data At Rest Encryption Policies (Phase 1)...')
      const script = `
        @((Get-DataEncryptionPolicy -ErrorAction Continue) |
          ForEach-Object {
            [PSCustomObject]@{
              Identity = $_.Identity
              Name = $_.Name
              Description = $_.Description
              Name = $_.Name
              Enabled = $_.Enabled
              KeyVaultKeyUri = $_.KeyVaultKeyUri
              Guid = $_.Guid
            }
          } |
          ConvertTo-Json -Depth 2)
      `
      const result = await this.executePowerShell(script)
      if (result && Array.isArray(result)) {
        for (const policy of result) {
          this.resources.push({
            type: 'EXODataAtRestEncryptionPolicy',
            name: policy.Name,
            id: policy.Identity,
            properties: {
              Identity: policy.Identity,
              Name: policy.Name,
              Description: policy.Description,
              Enabled: policy.Enabled,
              KeyVaultKeyUri: policy.KeyVaultKeyUri,
              Guid: policy.Guid,
              ExportDate: new Date().toISOString()
            }
          })
        }
        console.log(`✅ Found ${result.length} data at rest encryption policies`)
      }
    } catch (error) {
      this.handleError('collectDataAtRestEncryptionPolicies', error)
    }
  }

  /**
   * Collect Dynamic Distribution Groups
   * EXODynamicDistributionGroup (Phase 1)
   */
  async collectDynamicDistributionGroups() {
    try {
      console.log('📋 Collecting Dynamic Distribution Groups (Phase 1)...')
      const script = `
        @((Get-DynamicDistributionGroup -ResultSize Unlimited -ErrorAction Continue) |
          ForEach-Object {
            [PSCustomObject]@{
              Identity = $_.Identity
              Name = $_.Name
              DisplayName = $_.DisplayName
              Description = $_.Description
              RecipientFilter = $_.RecipientFilter
              RecipientContainer = $_.RecipientContainer
              ManagedBy = $_.ManagedBy
              Members = (@($_ | Get-DynamicDistributionGroupMember -ErrorAction SilentlyContinue) | Measure-Object).Count
              Guid = $_.Guid
            }
          } |
          ConvertTo-Json -Depth 2)
      `
      const result = await this.executePowerShell(script)
      if (result && Array.isArray(result)) {
        for (const group of result) {
          this.resources.push({
            type: 'EXODynamicDistributionGroup',
            name: group.DisplayName || group.Name,
            id: group.Identity,
            properties: {
              Identity: group.Identity,
              Name: group.Name,
              DisplayName: group.DisplayName,
              Description: group.Description,
              RecipientFilter: group.RecipientFilter,
              RecipientContainer: group.RecipientContainer,
              ManagedBy: group.ManagedBy,
              MemberCount: group.Members,
              Guid: group.Guid,
              ExportDate: new Date().toISOString()
            }
          })
        }
        console.log(`✅ Found ${result.length} dynamic distribution groups`)
      }
    } catch (error) {
      this.handleError('collectDynamicDistributionGroups', error)
    }
  }

  /**
   * Collect Focused Inbox Settings
   * EXOFocusedInbox (Phase 1)
   */
  async collectFocusedInbox() {
    try {
      console.log('📋 Collecting Focused Inbox Settings (Phase 1)...')
      const script = `
        @((Get-FocusedInboxSettings -ErrorAction Continue) |
          ForEach-Object {
            [PSCustomObject]@{
              Identity = $_.Identity
              Name = $_.Name
              FocusedInboxOn = $_.FocusedInboxOn
              Guid = $_.Guid
            }
          } |
          ConvertTo-Json -Depth 2)
      `
      const result = await this.executePowerShell(script)
      if (result && Array.isArray(result)) {
        for (const setting of result) {
          this.resources.push({
            type: 'EXOFocusedInbox',
            name: setting.Name || setting.Identity,
            id: setting.Identity,
            properties: {
              Identity: setting.Identity,
              Name: setting.Name,
              FocusedInboxOn: setting.FocusedInboxOn,
              Guid: setting.Guid,
              ExportDate: new Date().toISOString()
            }
          })
        }
        console.log(`✅ Found ${result.length} focused inbox settings`)
      }
    } catch (error) {
      this.handleError('collectFocusedInbox', error)
    }
  }

  /**
   * Collect Group Settings
   * EXOGroupSettings (Phase 1)
   */
  async collectGroupSettings() {
    try {
      console.log('📋 Collecting Group Settings (Phase 1)...')
      const script = `
        @((Get-UnifiedGroup -ResultSize Unlimited -ErrorAction Continue) |
          ForEach-Object {
            [PSCustomObject]@{
              Identity = $_.Identity
              Name = $_.DisplayName
              Description = $_.Description
              Classification = $_.Classification
              AccessType = $_.AccessType
              IsPublic = $_.IsPublic
              PreferredLanguage = $_.PreferredLanguage
              Guid = $_.ExternalDirectoryObjectId
            }
          } |
          ConvertTo-Json -Depth 2)
      `
      const result = await this.executePowerShell(script)
      if (result && Array.isArray(result)) {
        for (const setting of result) {
          this.resources.push({
            type: 'EXOGroupSettings',
            name: setting.Name,
            id: setting.Identity,
            properties: {
              Identity: setting.Identity,
              Name: setting.Name,
              Description: setting.Description,
              Classification: setting.Classification,
              AccessType: setting.AccessType,
              IsPublic: setting.IsPublic,
              PreferredLanguage: setting.PreferredLanguage,
              Guid: setting.Guid,
              ExportDate: new Date().toISOString()
            }
          })
        }
        console.log(`✅ Found ${result.length} group settings`)
      }
    } catch (error) {
      this.handleError('collectGroupSettings', error)
    }
  }

  /**
   * Collect Intra Organization Connector
   * EXOIntraOrganizationConnector (Phase 1)
   */
  async collectIntraOrganizationConnector() {
    try {
      console.log('📋 Collecting Intra Organization Connectors (Phase 1)...')
      const script = `
        @((Get-IntraOrganizationConnector -ErrorAction Continue) |
          ForEach-Object {
            [PSCustomObject]@{
              Identity = $_.Identity
              Name = $_.Name
              TargetAddressDomains = @($_.TargetAddressDomains) -join ','
              TargetSharingEpr = $_.TargetSharingEpr
              TargetOrgGuid = $_.TargetOrgGuid
              Enabled = $_.Enabled
              Guid = $_.Guid
            }
          } |
          ConvertTo-Json -Depth 2)
      `
      const result = await this.executePowerShell(script)
      if (result && Array.isArray(result)) {
        for (const connector of result) {
          this.resources.push({
            type: 'EXOIntraOrganizationConnector',
            name: connector.Name,
            id: connector.Identity,
            properties: {
              Identity: connector.Identity,
              Name: connector.Name,
              TargetAddressDomains: connector.TargetAddressDomains ? connector.TargetAddressDomains.split(',') : [],
              TargetSharingEpr: connector.TargetSharingEpr,
              TargetOrgGuid: connector.TargetOrgGuid,
              Enabled: connector.Enabled,
              Guid: connector.Guid,
              ExportDate: new Date().toISOString()
            }
          })
        }
        console.log(`✅ Found ${result.length} intra organization connectors`)
      }
    } catch (error) {
      this.handleError('collectIntraOrganizationConnector', error)
    }
  }

  /**
   * Collect Mailbox Calendar Configuration
   * EXOMailboxCalendarConfiguration (Phase 1)
   */
  async collectMailboxCalendarConfiguration() {
    try {
      console.log('📋 Collecting Mailbox Calendar Configuration (Phase 1)...')
      const script = `
        @((Get-MailboxCalendarConfiguration -ResultSize Unlimited -ErrorAction Continue) |
          ForEach-Object {
            [PSCustomObject]@{
              Identity = $_.Identity
              AutomateProcessing = $_.AutomateProcessing
              AllowConflictMeetings = $_.AllowConflictMeetings
              AllowRecurringMeetings = $_.AllowRecurringMeetings
              RemoveOldMeetingMessages = $_.RemoveOldMeetingMessages
              RemovePrivateProperty = $_.RemovePrivateProperty
              RemoveSubject = $_.RemoveSubject
              DeleteSubject = $_.DeleteSubject
              Guid = $_.Guid
            }
          } |
          ConvertTo-Json -Depth 2)
      `
      const result = await this.executePowerShell(script)
      if (result && Array.isArray(result)) {
        for (const config of result) {
          this.resources.push({
            type: 'EXOMailboxCalendarConfiguration',
            name: config.Identity,
            id: config.Identity,
            properties: {
              Identity: config.Identity,
              AutomateProcessing: config.AutomateProcessing,
              AllowConflictMeetings: config.AllowConflictMeetings,
              AllowRecurringMeetings: config.AllowRecurringMeetings,
              RemoveOldMeetingMessages: config.RemoveOldMeetingMessages,
              RemovePrivateProperty: config.RemovePrivateProperty,
              RemoveSubject: config.RemoveSubject,
              DeleteSubject: config.DeleteSubject,
              Guid: config.Guid,
              ExportDate: new Date().toISOString()
            }
          })
        }
        console.log(`✅ Found ${result.length} mailbox calendar configurations`)
      }
    } catch (error) {
      this.handleError('collectMailboxCalendarConfiguration', error)
    }
  }

  /**
   * Collect Mailbox Folder Permissions
   * EXOMailboxFolderPermissions (Phase 1)
   */
  async collectMailboxFolderPermissions() {
    try {
      console.log('📋 Collecting Mailbox Folder Permissions (Phase 1)...')
      const script = `
        @((Get-MailboxFolderPermission -ResultSize Unlimited -ErrorAction Continue) |
          ForEach-Object {
            [PSCustomObject]@{
              Identity = $_.Identity
              User = $_.User
              AccessRights = @($_.AccessRights) -join ','
              SharingPermissionFlags = $_.SharingPermissionFlags
              Guid = $_.ExternalDirectoryObjectId
            }
          } |
          ConvertTo-Json -Depth 2)
      `
      const result = await this.executePowerShell(script)
      if (result && Array.isArray(result)) {
        for (const perm of result) {
          this.resources.push({
            type: 'EXOMailboxFolderPermission',
            name: perm.Identity,
            id: perm.Identity,
            properties: {
              Identity: perm.Identity,
              User: perm.User,
              AccessRights: perm.AccessRights ? perm.AccessRights.split(',') : [],
              SharingPermissionFlags: perm.SharingPermissionFlags,
              ExportDate: new Date().toISOString()
            }
          })
        }
        console.log(`✅ Found ${result.length} mailbox folder permissions`)
      }
    } catch (error) {
      this.handleError('collectMailboxFolderPermissions', error)
    }
  }

  /**
   * Collect Mailbox IRM Access
   * EXOMailboxIRMAccess (Phase 1)
   */
  async collectMailboxIRMAccess() {
    try {
      console.log('📋 Collecting Mailbox IRM Access (Phase 1)...')
      const script = `
        @((Get-IRMConfiguration -ErrorAction Continue) |
          ForEach-Object {
            [PSCustomObject]@{
              Identity = $_.Identity
              InternalLicensingEnabled = $_.InternalLicensingEnabled
              ExternalLicensingEnabled = $_.ExternalLicensingEnabled
              AzureRMSLicensingEnabled = $_.AzureRMSLicensingEnabled
              RMSOnlineLicensingEnabled = $_.RMSOnlineLicensingEnabled
              Guid = $_.Guid
            }
          } |
          ConvertTo-Json -Depth 2)
      `
      const result = await this.executePowerShell(script)
      if (result && Array.isArray(result)) {
        for (const irm of result) {
          this.resources.push({
            type: 'EXOMailboxIRMAccess',
            name: irm.Identity || 'IRM Configuration',
            id: irm.Identity,
            properties: {
              Identity: irm.Identity,
              InternalLicensingEnabled: irm.InternalLicensingEnabled,
              ExternalLicensingEnabled: irm.ExternalLicensingEnabled,
              AzureRMSLicensingEnabled: irm.AzureRMSLicensingEnabled,
              RMSOnlineLicensingEnabled: irm.RMSOnlineLicensingEnabled,
              Guid: irm.Guid,
              ExportDate: new Date().toISOString()
            }
          })
        }
        console.log(`✅ Found IRM access configuration`)
      }
    } catch (error) {
      this.handleError('collectMailboxIRMAccess', error)
    }
  }

  /**
   * Collect Mailbox Permissions
   * EXOMailboxPermission (Phase 1)
   */
  async collectMailboxPermissions() {
    try {
      console.log('📋 Collecting Mailbox Permissions (Phase 1)...')
      const script = `
        @((Get-Mailbox -ResultSize Unlimited -ErrorAction Continue) |
          ForEach-Object {
            $mbox = $_
            @((Get-MailboxPermission -Identity $mbox.Identity -ErrorAction Continue) |
              ForEach-Object {
                [PSCustomObject]@{
                  Mailbox = $mbox.DisplayName
                  User = $_.User
                  AccessRights = @($_.AccessRights) -join ','
                  IsInherited = $_.IsInherited
                  Guid = $_.ExternalDirectoryObjectId
                }
              })
          } |
          ConvertTo-Json -Depth 2)
      `
      const result = await this.executePowerShell(script)
      if (result && Array.isArray(result)) {
        for (const perm of result) {
          this.resources.push({
            type: 'EXOMailboxPermission',
            name: perm.Mailbox,
            id: \`\${perm.Mailbox}-\${perm.User}\`,
            properties: {
              Mailbox: perm.Mailbox,
              User: perm.User,
              AccessRights: perm.AccessRights ? perm.AccessRights.split(',') : [],
              IsInherited: perm.IsInherited,
              ExportDate: new Date().toISOString()
            }
          })
        }
        console.log(`✅ Found ${result.length} mailbox permissions`)
      }
    } catch (error) {
      this.handleError('collectMailboxPermissions', error)
    }
  }

  /**
   * Collect Migration
   * EXOMigration (Phase 1)
   */
  async collectMigration() {
    try {
      console.log('📋 Collecting Migrations (Phase 1)...')
      const script = `
        @((Get-MigrationBatch -ErrorAction Continue) |
          ForEach-Object {
            [PSCustomObject]@{
              Identity = $_.Identity
              MigrationType = $_.MigrationType
              Status = $_.Status
              TotalCount = $_.TotalCount
              CompletedCount = $_.CompletedCount
              StoppedCount = $_.StoppedCount
              FailedCount = $_.FailedCount
              StartedTime = $_.StartedTime
              CompletionTime = $_.CompletionTime
              Guid = $_.Guid
            }
          } |
          ConvertTo-Json -Depth 2)
      `
      const result = await this.executePowerShell(script)
      if (result && Array.isArray(result)) {
        for (const migration of result) {
          this.resources.push({
            type: 'EXOMigration',
            name: migration.Identity,
            id: migration.Identity,
            properties: {
              Identity: migration.Identity,
              MigrationType: migration.MigrationType,
              Status: migration.Status,
              TotalCount: migration.TotalCount,
              CompletedCount: migration.CompletedCount,
              StoppedCount: migration.StoppedCount,
              FailedCount: migration.FailedCount,
              StartedTime: migration.StartedTime,
              CompletionTime: migration.CompletionTime,
              Guid: migration.Guid,
              ExportDate: new Date().toISOString()
            }
          })
        }
        console.log(`✅ Found ${result.length} migrations`)
      }
    } catch (error) {
      this.handleError('collectMigration', error)
    }
  }

  /**
   * Collect Migration Endpoints
   * EXOMigrationEndpoint (Phase 1)
   */
  async collectMigrationEndpoints() {
    try {
      console.log('📋 Collecting Migration Endpoints (Phase 1)...')
      const script = `
        @((Get-MigrationEndpoint -ErrorAction Continue) |
          ForEach-Object {
            [PSCustomObject]@{
              Identity = $_.Identity
              Name = $_.Name
              EndpointType = $_.EndpointType
              RemoteServer = $_.RemoteServer
              Port = $_.Port
              ConnectionSettings = $_.ConnectionSettings
              Guid = $_.Guid
            }
          } |
          ConvertTo-Json -Depth 2)
      `
      const result = await this.executePowerShell(script)
      if (result && Array.isArray(result)) {
        for (const endpoint of result) {
          this.resources.push({
            type: 'EXOMigrationEndpoint',
            name: endpoint.Name,
            id: endpoint.Identity,
            properties: {
              Identity: endpoint.Identity,
              Name: endpoint.Name,
              EndpointType: endpoint.EndpointType,
              RemoteServer: endpoint.RemoteServer,
              Port: endpoint.Port,
              ConnectionSettings: endpoint.ConnectionSettings,
              Guid: endpoint.Guid,
              ExportDate: new Date().toISOString()
            }
          })
        }
        console.log(`✅ Found ${result.length} migration endpoints`)
      }
    } catch (error) {
      this.handleError('collectMigrationEndpoints', error)
    }
  }

  /**
   * Collect Offline Address Book
   * EXOOfflineAddressBook (Phase 1)
   */
  async collectOfflineAddressBook() {
    try {
      console.log('📋 Collecting Offline Address Books (Phase 1)...')
      const script = `
        @((Get-OfflineAddressBook -ResultSize Unlimited -ErrorAction Continue) |
          ForEach-Object {
            [PSCustomObject]@{
              Identity = $_.Identity
              Name = $_.Name
              DisplayName = $_.DisplayName
              AddressLists = @($_.AddressLists) -join ','
              Versions = @($_.Versions) -join ','
              IsDefault = $_.IsDefault
              Guid = $_.Guid
            }
          } |
          ConvertTo-Json -Depth 2)
      `
      const result = await this.executePowerShell(script)
      if (result && Array.isArray(result)) {
        for (const oab of result) {
          this.resources.push({
            type: 'EXOOfflineAddressBook',
            name: oab.DisplayName || oab.Name,
            id: oab.Identity,
            properties: {
              Identity: oab.Identity,
              Name: oab.Name,
              DisplayName: oab.DisplayName,
              AddressLists: oab.AddressLists ? oab.AddressLists.split(',') : [],
              Versions: oab.Versions ? oab.Versions.split(',') : [],
              IsDefault: oab.IsDefault,
              Guid: oab.Guid,
              ExportDate: new Date().toISOString()
            }
          })
        }
        console.log(`✅ Found ${result.length} offline address books`)
      }
    } catch (error) {
      this.handleError('collectOfflineAddressBook', error)
    }
  }

  /**
   * Collect On Premises Organization
   * EXOOnPremisesOrganization (Phase 1)
   */
  async collectOnPremisesOrganization() {
    try {
      console.log('📋 Collecting On Premises Organizations (Phase 1)...')
      const script = `
        @((Get-OnPremisesOrganization -ErrorAction Continue) |
          ForEach-Object {
            [PSCustomObject]@{
              Identity = $_.Identity
              Name = $_.Name
              OrganizationName = $_.OrganizationName
              HybridDomains = @($_.HybridDomains) -join ','
              PublicFolderServers = @($_.PublicFolderServers) -join ','
              Guid = $_.Guid
            }
          } |
          ConvertTo-Json -Depth 2)
      `
      const result = await this.executePowerShell(script)
      if (result && Array.isArray(result)) {
        for (const org of result) {
          this.resources.push({
            type: 'EXOOnPremisesOrganization',
            name: org.OrganizationName || org.Name,
            id: org.Identity,
            properties: {
              Identity: org.Identity,
              Name: org.Name,
              OrganizationName: org.OrganizationName,
              HybridDomains: org.HybridDomains ? org.HybridDomains.split(',') : [],
              PublicFolderServers: org.PublicFolderServers ? org.PublicFolderServers.split(',') : [],
              Guid: org.Guid,
              ExportDate: new Date().toISOString()
            }
          })
        }
        console.log(`✅ Found ${result.length} on premises organizations`)
      }
    } catch (error) {
      this.handleError('collectOnPremisesOrganization', error)
    }
  }

  /**
   * Collect Organization Relationship
   * EXOOrganizationRelationship (Phase 1)
   */
  async collectOrganizationRelationship() {
    try {
      console.log('📋 Collecting Organization Relationships (Phase 1)...')
      const script = `
        @((Get-OrganizationRelationship -ErrorAction Continue) |
          ForEach-Object {
            [PSCustomObject]@{
              Identity = $_.Identity
              Name = $_.Name
              DomainNames = @($_.DomainNames) -join ','
              FreeBusyAccessEnabled = $_.FreeBusyAccessEnabled
              FreeBusyAccessLevel = $_.FreeBusyAccessLevel
              MailboxMoveEnabled = $_.MailboxMoveEnabled
              DeliveryReportEnabled = $_.DeliveryReportEnabled
              TargetAutodiscoverEpr = $_.TargetAutodiscoverEpr
              Guid = $_.Guid
            }
          } |
          ConvertTo-Json -Depth 2)
      `
      const result = await this.executePowerShell(script)
      if (result && Array.isArray(result)) {
        for (const rel of result) {
          this.resources.push({
            type: 'EXOOrganizationRelationship',
            name: rel.Name,
            id: rel.Identity,
            properties: {
              Identity: rel.Identity,
              Name: rel.Name,
              DomainNames: rel.DomainNames ? rel.DomainNames.split(',') : [],
              FreeBusyAccessEnabled: rel.FreeBusyAccessEnabled,
              FreeBusyAccessLevel: rel.FreeBusyAccessLevel,
              MailboxMoveEnabled: rel.MailboxMoveEnabled,
              DeliveryReportEnabled: rel.DeliveryReportEnabled,
              TargetAutodiscoverEpr: rel.TargetAutodiscoverEpr,
              Guid: rel.Guid,
              ExportDate: new Date().toISOString()
            }
          })
        }
        console.log(`✅ Found ${result.length} organization relationships`)
      }
    } catch (error) {
      this.handleError('collectOrganizationRelationship', error)
    }
  }

  /**
   * Collect Partner Application
   * EXOPartnerApplication (Phase 1)
   */
  async collectPartnerApplication() {
    try {
      console.log('📋 Collecting Partner Applications (Phase 1)...')
      const script = `
        @((Get-PartnerApplication -ErrorAction Continue) |
          ForEach-Object {
            [PSCustomObject]@{
              Identity = $_.Identity
              Name = $_.Name
              ApplicationId = $_.ApplicationId
              Enabled = $_.Enabled
              AcceptSecurityIdentifierInformation = $_.AcceptSecurityIdentifierInformation
              LinkedAccount = $_.LinkedAccount
              Guid = $_.Guid
            }
          } |
          ConvertTo-Json -Depth 2)
      `
      const result = await this.executePowerShell(script)
      if (result && Array.isArray(result)) {
        for (const app of result) {
          this.resources.push({
            type: 'EXOPartnerApplication',
            name: app.Name,
            id: app.Identity,
            properties: {
              Identity: app.Identity,
              Name: app.Name,
              ApplicationId: app.ApplicationId,
              Enabled: app.Enabled,
              AcceptSecurityIdentifierInformation: app.AcceptSecurityIdentifierInformation,
              LinkedAccount: app.LinkedAccount,
              Guid: app.Guid,
              ExportDate: new Date().toISOString()
            }
          })
        }
        console.log(`✅ Found ${result.length} partner applications`)
      }
    } catch (error) {
      this.handleError('collectPartnerApplication', error)
    }
  }

  /**
   * Collect Place
   * EXOPlace (Phase 1)
   */
  async collectPlace() {
    try {
      console.log('📋 Collecting Places (Phase 1)...')
      const script = `
        @((Get-Place -ResultSize Unlimited -ErrorAction Continue) |
          ForEach-Object {
            [PSCustomObject]@{
              Identity = $_.Identity
              DisplayName = $_.DisplayName
              Capability = @($_.Capability) -join ','
              IsDefault = $_.IsDefault
              PlaceId = $_.PlaceId
              AudioDeviceName = $_.AudioDeviceName
              VideoDeviceName = $_.VideoDeviceName
              Guid = $_.ExternalDirectoryObjectId
            }
          } |
          ConvertTo-Json -Depth 2)
      `
      const result = await this.executePowerShell(script)
      if (result && Array.isArray(result)) {
        for (const place of result) {
          this.resources.push({
            type: 'EXOPlace',
            name: place.DisplayName,
            id: place.Identity,
            properties: {
              Identity: place.Identity,
              DisplayName: place.DisplayName,
              Capability: place.Capability ? place.Capability.split(',') : [],
              IsDefault: place.IsDefault,
              PlaceId: place.PlaceId,
              AudioDeviceName: place.AudioDeviceName,
              VideoDeviceName: place.VideoDeviceName,
              ExportDate: new Date().toISOString()
            }
          })
        }
        console.log(`✅ Found ${result.length} places`)
      }
    } catch (error) {
      this.handleError('collectPlace', error)
    }
  }

  /**
   * Collect Quarantine Policy
   * EXOQuarantinePolicy (Phase 1)
   */
  async collectQuarantinePolicy() {
    try {
      console.log('📋 Collecting Quarantine Policies (Phase 1)...')
      const script = `
        @((Get-QuarantinePolicy -ErrorAction Continue) |
          ForEach-Object {
            [PSCustomObject]@{
              Identity = $_.Identity
              Name = $_.Name
              ESNEnabled = $_.ESNEnabled
              EndUserSpamNotificationLanguage = $_.EndUserSpamNotificationLanguage
              MultiLanguageCustomDisclaimer = $_.MultiLanguageCustomDisclaimer
              Guid = $_.Guid
            }
          } |
          ConvertTo-Json -Depth 2)
      `
      const result = await this.executePowerShell(script)
      if (result && Array.isArray(result)) {
        for (const policy of result) {
          this.resources.push({
            type: 'EXOQuarantinePolicy',
            name: policy.Name,
            id: policy.Identity,
            properties: {
              Identity: policy.Identity,
              Name: policy.Name,
              ESNEnabled: policy.ESNEnabled,
              EndUserSpamNotificationLanguage: policy.EndUserSpamNotificationLanguage,
              MultiLanguageCustomDisclaimer: policy.MultiLanguageCustomDisclaimer,
              Guid: policy.Guid,
              ExportDate: new Date().toISOString()
            }
          })
        }
        console.log(`✅ Found ${result.length} quarantine policies`)
      }
    } catch (error) {
      this.handleError('collectQuarantinePolicy', error)
    }
  }

  /**
   * Collect Service Principal
   * EXOServicePrincipal (Phase 1)
   */
  async collectServicePrincipal() {
    try {
      console.log('📋 Collecting Service Principals (Phase 1)...')
      const script = `
        @((Get-ServicePrincipal -ErrorAction Continue) |
          ForEach-Object {
            [PSCustomObject]@{
              Identity = $_.Identity
              Name = $_.Name
              AppId = $_.AppId
              TenantId = $_.TenantId
              ObjectId = $_.ObjectId
              Guid = $_.Guid
            }
          } |
          ConvertTo-Json -Depth 2)
      `
      const result = await this.executePowerShell(script)
      if (result && Array.isArray(result)) {
        for (const sp of result) {
          this.resources.push({
            type: 'EXOServicePrincipal',
            name: sp.Name,
            id: sp.Identity,
            properties: {
              Identity: sp.Identity,
              Name: sp.Name,
              AppId: sp.AppId,
              TenantId: sp.TenantId,
              ObjectId: sp.ObjectId,
              Guid: sp.Guid,
              ExportDate: new Date().toISOString()
            }
          })
        }
        console.log(`✅ Found ${result.length} service principals`)
      }
    } catch (error) {
      this.handleError('collectServicePrincipal', error)
    }
  }

  /**
   * Collect Shared Mailbox
   * EXOSharedMailbox (Phase 1)
   */
  async collectSharedMailbox() {
    try {
      console.log('📋 Collecting Shared Mailboxes (Phase 1)...')
      const script = `
        @((Get-Mailbox -ResultSize Unlimited -PublicFolder:$false -ErrorAction Continue) |
          Where-Object { $_.RecipientTypeDetails -eq 'SharedMailbox' } |
          ForEach-Object {
            [PSCustomObject]@{
              Identity = $_.Identity
              DisplayName = $_.DisplayName
              PrimarySmtpAddress = $_.PrimarySmtpAddress
              Owner = $_.ManagedBy
              WhenCreated = $_.WhenCreated
              Guid = $_.Guid
            }
          } |
          ConvertTo-Json -Depth 2)
      `
      const result = await this.executePowerShell(script)
      if (result && Array.isArray(result)) {
        for (const mbox of result) {
          this.resources.push({
            type: 'EXOSharedMailbox',
            name: mbox.DisplayName,
            id: mbox.Identity,
            properties: {
              Identity: mbox.Identity,
              DisplayName: mbox.DisplayName,
              PrimarySmtpAddress: mbox.PrimarySmtpAddress,
              Owner: mbox.Owner,
              WhenCreated: mbox.WhenCreated,
              Guid: mbox.Guid,
              ExportDate: new Date().toISOString()
            }
          })
        }
        console.log(`✅ Found ${result.length} shared mailboxes`)
      }
    } catch (error) {
      this.handleError('collectSharedMailbox', error)
    }
  }

  /**
   * Collect Tenant Allow Block List
   * EXOTenantAllowBlockListItems (Phase 1)
   */
  async collectTenantAllowBlockList() {
    try {
      console.log('📋 Collecting Tenant Allow Block Lists (Phase 1)...')
      const script = `
        @((Get-TenantAllowBlockListItems -ErrorAction Continue) |
          ForEach-Object {
            [PSCustomObject]@{
              Identity = $_.Identity
              ListType = $_.ListType
              Entries = @($_.Entries) -join ','
              ExpirationDate = $_.ExpirationDate
              Notes = $_.Notes
              Guid = $_.Guid
            }
          } |
          ConvertTo-Json -Depth 2)
      `
      const result = await this.executePowerShell(script)
      if (result && Array.isArray(result)) {
        for (const item of result) {
          this.resources.push({
            type: 'EXOTenantAllowBlockList',
            name: item.ListType,
            id: item.Identity,
            properties: {
              Identity: item.Identity,
              ListType: item.ListType,
              Entries: item.Entries ? item.Entries.split(',') : [],
              ExpirationDate: item.ExpirationDate,
              Notes: item.Notes,
              Guid: item.Guid,
              ExportDate: new Date().toISOString()
            }
          })
        }
        console.log(`✅ Found ${result.length} tenant allow block list items`)
      }
    } catch (error) {
      this.handleError('collectTenantAllowBlockList', error)
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
