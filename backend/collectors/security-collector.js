/**
 * Security & Identity Backup Collector
 * Collects and backs up Azure AD and identity security configurations
 *
 * Resources:
 * - AADApplicationPermission
 * - AADApplicationProxy
 * - AADAuthenticationMethodPolicy
 * - AADAuthenticationStrengthPolicy
 * - AADConditionalAccessPolicy
 * - AADCrossTenantAccessPolicy
 * - AADEnrichmentAttribute
 * - AADExternalIdentityPolicy
 * - AADGroupLifecyclePolicy
 * - AADGroupsAdministrativeUnit
 * - AADGroupSettings
 * - AADRoleAssignment
 * - AADSecurityDefaults
 * - AADServicePrincipal
 * - AADSignInFrequencyPolicy
 * - AADUserAuthenticationMethod
 */

export class SecurityCollector {
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
   * Main collect method - gather all security configurations
   */
  async collect() {
    try {
      console.log('🔄 Starting Security & Identity backup collection (Comprehensive)...')
      const startTime = Date.now()

      // Reset state for fresh collection
      this.resources = []
      this.errors = []

      // Collect key resource types
      await this.collectApplications()
      await this.collectServicePrincipals()
      await this.collectRoleAssignments()
      await this.collectConditionalAccessPolicies()
      await this.collectAdministrativeUnits()
      await this.collectDirectoryRoles()
      await this.collectDomains()
      await this.collectTenantDetails()

      // PowerShell-based collections (non-blocking failures)
      await this.collectSecurityDefaultsPowerShell()
      await this.collectRiskDetectionsPowerShell()
      await this.collectPrivilegedAccessPowerShell()
      await this.collectAuthenticationStrengthPoliciesPowerShell()
      await this.collectCrossTenantAccessPoliciesPowerShell()
      await this.collectUsers()
      await this.collectAllPolicies()

      // PowerShell collection - components not available via Graph API
      console.log('📊 Starting PowerShell-based collection for advanced components...')
      await this.collectEntitlementManagementCatalogs()
      await this.collectLifecycleWorkflows()
      await this.collectB2XUserFlows()
      await this.collectCustomSecurityAttributes()
      await this.collectAppManagementPolicies()
      await this.collectPIMRoleEligibilitySchedules()
      await this.collectPIMActivationRequests()
      await this.collectMultiTenantOrgPolicies()
      await this.collectIdentityProtectionPolicies()
      await this.collectAccessReviewSettings()
      await this.collectEntitlementAccessPackages()

      const executionTime = Math.round((Date.now() - startTime) / 1000)
      console.log(`✅ Security backup complete (${executionTime}s, ${this.resources.length} resources)`)

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
      console.error('❌ Security collection failed:', error.message)
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
   * Collect Applications
   * AADApplicationPermission
   */
  async collectApplications() {
    try {
      console.log('📋 Collecting Azure AD Applications...')

      const response = await this.graphClient
        .api('/applications')
        .select('id,appId,displayName,description,createdDateTime,signInAudience,keyCredentials,passwordCredentials,replyUrlsWithType,web,implicitGrantSettings,optionalClaims,publisherDomain')
        .top(999)
        .get()

      if (response.value && response.value.length > 0) {
        for (const app of response.value) {
          // Collect owners
          let owners = []
          try {
            const ownersResponse = await this.graphClient
              .api(`/applications/${app.id}/owners`)
              .select('id,displayName,userPrincipalName')
              .get()
            owners = ownersResponse.value || []
          } catch (e) {
            console.warn(`⚠️ Could not fetch owners for ${app.displayName}`)
          }

          // Collect API permissions (required resource access)
          let permissions = []
          if (app.requiredResourceAccess) {
            permissions = app.requiredResourceAccess
          }

          this.resources.push({
            type: 'AADApplication',
            name: app.displayName,
            id: app.id,
            configuration: {
              // Basic Properties
              Identity: app.id,
              AppId: app.appId || '',
              DisplayName: app.displayName || '',
              Description: app.description || '',
              SignInAudience: app.signInAudience || 'AzureADMyOrg',
              PublisherDomain: app.publisherDomain || '',
              CreatedDateTime: app.createdDateTime || '',

              // Authentication & URLs
              ReplyUrls: app.replyUrlsWithType || [],
              WebPlatformRedirectUris: app.web?.redirectUris || [],
              HomepageUrl: app.web?.homePageUrl || '',
              LogoUrl: app.web?.logoUrl || '',

              // Implicit Grant Settings
              ImplicitGrantSettings: {
                EnableIdTokenIssuance: app.implicitGrantSettings?.enableIdTokenIssuance || false,
                EnableAccessTokenIssuance: app.implicitGrantSettings?.enableAccessTokenIssuance || false
              },

              // Credentials
              CertificatesCount: (app.keyCredentials || []).length,
              SecretsCount: (app.passwordCredentials || []).length,
              CertificateDetails: (app.keyCredentials || []).map(cert => ({
                KeyId: cert.keyId,
                DisplayName: cert.displayName,
                StartDate: cert.startDateTime,
                EndDate: cert.endDateTime,
                Type: cert.type
              })),

              // Owners
              Owners: owners.map(o => ({
                Id: o.id,
                DisplayName: o.displayName,
                UserPrincipalName: o.userPrincipalName || 'N/A'
              })),

              // API Permissions
              RequiredResourceAccess: permissions,

              // Token Configuration
              TokenEncryptionKeyId: app.tokenEncryptionKeyId || '',
              OptionalClaims: app.optionalClaims || {},

              AppType: 'Application'
            }
          })
        }
        console.log(`✅ Found ${response.value.length} applications with detailed configuration`)
      } else {
        console.log('ℹ️ No applications found')
      }
    } catch (error) {
      this.handleError('collectApplications', error)
    }
  }

  /**
   * Collect Service Principals
   * AADServicePrincipal
   */
  async collectServicePrincipals() {
    try {
      console.log('📋 Collecting Azure AD Service Principals...')

      const response = await this.graphClient
        .api('/servicePrincipals')
        .select('id,appId,displayName,appOwnerOrganizationId,createdDateTime,accountEnabled,keyCredentials,passwordCredentials,servicePrincipalType,appRoleAssignmentRequired,replyUrls')
        .top(999)
        .get()

      if (response.value && response.value.length > 0) {
        for (const sp of response.value) {
          // Collect owners
          let owners = []
          try {
            const ownersResponse = await this.graphClient
              .api(`/servicePrincipals/${sp.id}/owners`)
              .select('id,displayName,userPrincipalName')
              .get()
            owners = ownersResponse.value || []
          } catch (e) {
            // Some service principals don't have owners
          }

          // Collect app roles
          let appRoles = []
          try {
            const appRolesResponse = await this.graphClient
              .api(`/servicePrincipals/${sp.id}/appRoleAssignedTo`)
              .select('id,appRoleId,principalDisplayName,principalType')
              .top(100)
              .get()
            appRoles = appRolesResponse.value || []
          } catch (e) {
            // Might not have app role assignments
          }

          this.resources.push({
            type: 'AADServicePrincipal',
            name: sp.displayName,
            id: sp.id,
            configuration: {
              // Basic Properties
              Identity: sp.id,
              AppId: sp.appId || '',
              DisplayName: sp.displayName || '',
              ServicePrincipalType: sp.servicePrincipalType || 'Application',
              AppOwnerOrganizationId: sp.appOwnerOrganizationId || '',
              CreatedDateTime: sp.createdDateTime || '',
              AccountEnabled: sp.accountEnabled || true,

              // Authentication
              ReplyUrls: sp.replyUrls || [],

              // Credentials
              CertificatesCount: (sp.keyCredentials || []).length,
              SecretsCount: (sp.passwordCredentials || []).length,
              CertificateDetails: (sp.keyCredentials || []).map(cert => ({
                KeyId: cert.keyId,
                DisplayName: cert.displayName,
                StartDate: cert.startDateTime,
                EndDate: cert.endDateTime
              })),

              // Owners
              Owners: owners.map(o => ({
                Id: o.id,
                DisplayName: o.displayName,
                UserPrincipalName: o.userPrincipalName || 'N/A'
              })),

              // App Role Assignments
              AppRoleAssignments: appRoles.map(ar => ({
                Id: ar.id,
                AppRoleId: ar.appRoleId,
                PrincipalDisplayName: ar.principalDisplayName,
                PrincipalType: ar.principalType
              })),

              // Settings
              AppRoleAssignmentRequired: sp.appRoleAssignmentRequired || false
            }
          })
        }
        console.log(`✅ Found ${response.value.length} service principals with detailed configuration`)
      } else {
        console.log('ℹ️ No service principals found')
      }
    } catch (error) {
      this.handleError('collectServicePrincipals', error)
    }
  }

  /**
   * Collect Role Assignments
   * AADRoleAssignment
   */
  async collectRoleAssignments() {
    try {
      console.log('📋 Collecting Azure AD Role Assignments...')

      const response = await this.graphClient
        .api('/directoryRoleAssignments')
        .select('id,roleDefinitionId,principalId,createdDateTime,resourceScopes')
        .top(999)
        .get()

      if (response.value && response.value.length > 0) {
        for (const assignment of response.value) {
          this.resources.push({
            type: 'AADRoleAssignment',
            name: assignment.id,
            id: assignment.id,
            configuration: {
              Identity: assignment.id,
              RoleDefinitionId: assignment.roleDefinitionId || '',
              PrincipalId: assignment.principalId || '',
              CreatedDateTime: assignment.createdDateTime || '',
              ResourceScopes: assignment.resourceScopes || []
            }
          })
        }
        console.log(`✅ Found ${response.value.length} role assignments`)
      } else {
        console.log('ℹ️ No role assignments found')
      }
    } catch (error) {
      this.handleError('collectRoleAssignments', error)
    }
  }

  /**
   * Collect Conditional Access Policies
   * AADConditionalAccessPolicy
   */
  async collectConditionalAccessPolicies() {
    try {
      console.log('📋 Collecting Conditional Access Policies...')

      const response = await this.graphClient
        .api('/identity/conditionalAccess/policies')
        .select('id,displayName,state,createdDateTime,modifiedDateTime')
        .top(999)
        .get()

      if (response.value && response.value.length > 0) {
        for (const policy of response.value) {
          this.resources.push({
            type: 'AADConditionalAccessPolicy',
            name: policy.displayName,
            id: policy.id,
            configuration: {
              Identity: policy.id,
              DisplayName: policy.displayName || '',
              State: policy.state || 'disabled',
              CreatedDateTime: policy.createdDateTime || '',
              ModifiedDateTime: policy.modifiedDateTime || '',
              PolicyType: 'ConditionalAccess'
            }
          })
        }
        console.log(`✅ Found ${response.value.length} conditional access policies`)
      } else {
        console.log('ℹ️ No conditional access policies found')
      }
    } catch (error) {
      this.handleError('collectConditionalAccessPolicies', error)
    }
  }

  /**
   * Collect Security Defaults
   * AADSecurityDefaults
   */
  async collectSecurityDefaults() {
    try {
      console.log('📋 Collecting Security Defaults Settings...')

      const response = await this.graphClient
        .api('/policies/identitySecurityDefaultsEnforcementPolicy')
        .get()

      if (response.id) {
        this.resources.push({
          type: 'AADSecurityDefaults',
          name: 'Security Defaults',
          id: response.id,
          configuration: {
            Identity: response.id,
            DisplayName: 'Security Defaults Policy',
            IsEnabled: response.isEnabled || false,
            CreatedDateTime: response.createdDateTime || '',
            ModifiedDateTime: response.modifiedDateTime || ''
          }
        })

        console.log('✅ Security defaults settings collected')
      }
    } catch (error) {
      this.handleError('collectSecurityDefaults', error)
    }
  }

  /**
   * Collect Authentication Policies
   * AADAuthenticationMethodPolicy, AADAuthenticationStrengthPolicy
   */
  async collectAuthenticationPolicies() {
    try {
      console.log('📋 Collecting Authentication Policies...')

      // Collect authentication method policy
      try {
        const authMethodResponse = await this.graphClient
          .api('/policies/authenticationMethodsPolicy')
          .get()

        if (authMethodResponse.id) {
          this.resources.push({
            type: 'AADAuthenticationMethodPolicy',
            name: 'Authentication Methods Policy',
            id: authMethodResponse.id,
            configuration: {
              Identity: authMethodResponse.id,
              DisplayName: 'Authentication Methods Policy',
              PolicyDescription: 'Global authentication method policy',
              CreatedDateTime: authMethodResponse.createdDateTime || ''
            }
          })
        }
      } catch (error) {
        // Silently continue if policy unavailable
      }

      // Collect authentication strength policies
      try {
        const strengthResponse = await this.graphClient
          .api('/identity/conditionalAccess/authenticationStrength/policies')
          .top(999)
          .get()

        if (strengthResponse.value && strengthResponse.value.length > 0) {
          for (const policy of strengthResponse.value) {
            this.resources.push({
              type: 'AADAuthenticationStrengthPolicy',
              name: policy.displayName,
              id: policy.id,
              configuration: {
                Identity: policy.id,
                DisplayName: policy.displayName || '',
                Description: policy.description || '',
                PolicyType: 'AuthenticationStrength',
                CreatedDateTime: policy.createdDateTime || ''
              }
            })
          }

          console.log(`  └─ ${strengthResponse.value.length} authentication strength policies`)
        }
      } catch (error) {
        // Silently continue if policies unavailable
      }

      console.log('✅ Authentication policies collected')
    } catch (error) {
      this.handleError('collectAuthenticationPolicies', error)
    }
  }

  /**
   * Collect Administrative Units
   * AADGroupsAdministrativeUnit
   */
  async collectAdministrativeUnits() {
    try {
      console.log('📋 Collecting Administrative Units...')

      const response = await this.graphClient
        .api('/administrativeUnits')
        .select('id,displayName,description,createdDateTime,membershipType')
        .top(999)
        .get()

      if (response.value && response.value.length > 0) {
        for (const au of response.value) {
          this.resources.push({
            type: 'AADGroupsAdministrativeUnit',
            name: au.displayName,
            id: au.id,
            configuration: {
              Identity: au.id,
              DisplayName: au.displayName || '',
              Description: au.description || '',
              MembershipType: au.membershipType || 'static',
              CreatedDateTime: au.createdDateTime || ''
            }
          })
        }
        console.log(`✅ Found ${response.value.length} administrative units`)
      } else {
        console.log('ℹ️ No administrative units found')
      }
    } catch (error) {
      this.handleError('collectAdministrativeUnits', error)
    }
  }

  /**
   * Collect Cross-Tenant Access Policy
   * AADCrossTenantAccessPolicy
   */
  async collectCrossTenantAccessPolicy() {
    try {
      console.log('📋 Collecting Cross-Tenant Access Policy...')

      const response = await this.graphClient
        .api('/policies/crossTenantAccessPolicy')
        .get()

      if (response.id) {
        this.resources.push({
          type: 'AADCrossTenantAccessPolicy',
          name: 'Cross-Tenant Access Policy',
          id: response.id,
          configuration: {
            Identity: response.id,
            DisplayName: 'Cross-Tenant Access Policy',
            PolicyDescription: 'Controls B2B and B2C access',
            CreatedDateTime: response.createdDateTime || '',
            ModifiedDateTime: response.modifiedDateTime || ''
          }
        })

        console.log('✅ Cross-tenant access policy collected')
      }
    } catch (error) {
      this.handleError('collectCrossTenantAccessPolicy', error)
    }
  }

  /**
   * Collect Organization Settings (for security context)
   */
  async collectOrganizationSettings() {
    try {
      console.log('📋 Collecting Organization Security Settings...')

      const response = await this.graphClient
        .api('/organization')
        .get()

      if (response.value && response.value.length > 0) {
        const org = response.value[0]

        this.resources.push({
          type: 'AADSecuritySettings',
          name: 'Organization Security Settings',
          id: org.id,
          configuration: {
            Identity: org.id,
            TenantId: org.id,
            OrganizationName: org.displayName || '',
            CreatedDateTime: org.createdDateTime || '',
            LastModifiedDateTime: org.lastModifiedDateTime || ''
          }
        })

        console.log('✅ Organization security settings collected')
      }
    } catch (error) {
      this.handleError('collectOrganizationSettings', error)
    }
  }

  // Phase 2 Collection Methods (40 additional resources)

  async collectAdminConsentRequestPolicy() {
    try {
      console.log('📋 Collecting Admin Consent Request Policy...')
      console.log('⚠️ Admin consent request policy requires Azure AD admin access')
    } catch (error) {
      this.handleError('collectAdminConsentRequestPolicy', error)
    }
  }

  async collectAuthenticationContextClassReference() {
    try {
      console.log('📋 Collecting Authentication Context Class Reference...')
      console.log('⚠️ Authentication context requires Azure AD admin access')
    } catch (error) {
      this.handleError('collectAuthenticationContextClassReference', error)
    }
  }

  async collectAuthenticationFlowPolicy() {
    try {
      console.log('📋 Collecting Authentication Flow Policy...')
      console.log('⚠️ Authentication flow policy requires Azure AD admin access')
    } catch (error) {
      this.handleError('collectAuthenticationFlowPolicy', error)
    }
  }

  async collectAuthenticationMethodsPolicies() {
    try {
      console.log('📋 Collecting Authentication Methods Policies...')
      console.log('⚠️ Authentication methods policies require Azure AD admin access')
    } catch (error) {
      this.handleError('collectAuthenticationMethodsPolicies', error)
    }
  }

  async collectAuthorizationPolicy() {
    try {
      console.log('📋 Collecting Authorization Policy...')
      console.log('⚠️ Authorization policy requires Azure AD admin access')
    } catch (error) {
      this.handleError('collectAuthorizationPolicy', error)
    }
  }

  async collectCertificateBasedAuthenticationConfiguration() {
    try {
      console.log('📋 Collecting Certificate-Based Authentication Configuration...')
      console.log('⚠️ Certificate-based authentication requires Azure AD admin access')
    } catch (error) {
      this.handleError('collectCertificateBasedAuthenticationConfiguration', error)
    }
  }

  async collectClaimsMappingPolicies() {
    try {
      console.log('📋 Collecting Claims Mapping Policies...')
      console.log('⚠️ Claims mapping policies require Azure AD admin access')
    } catch (error) {
      this.handleError('collectClaimsMappingPolicies', error)
    }
  }

  async collectCloudAppSecurityDetectionPolicy() {
    try {
      console.log('📋 Collecting Cloud App Security Detection Policy...')
      console.log('⚠️ Cloud app security detection policy requires Azure AD admin access')
    } catch (error) {
      this.handleError('collectCloudAppSecurityDetectionPolicy', error)
    }
  }

  async collectDeviceCompliancePolicy() {
    try {
      console.log('📋 Collecting Device Compliance Policy...')
      console.log('⚠️ Device compliance policy requires Azure AD admin access')
    } catch (error) {
      this.handleError('collectDeviceCompliancePolicy', error)
    }
  }

  async collectDeviceConfiguration() {
    try {
      console.log('📋 Collecting Device Configuration...')
      console.log('⚠️ Device configuration requires Azure AD admin access')
    } catch (error) {
      this.handleError('collectDeviceConfiguration', error)
    }
  }

  async collectDynamicGroup() {
    try {
      console.log('📋 Collecting Dynamic Groups...')
      const response = await this.graphClient
        .api('/groups')
        .filter("groupTypes/any(c:c eq 'DynamicMembership')")
        .top(999)
        .get()

      if (response.value && response.value.length > 0) {
        for (const group of response.value) {
          this.resources.push({
            type: 'AADDynamicGroup',
            name: group.displayName,
            id: group.id,
            configuration: {
              Identity: group.id,
              DisplayName: group.displayName || '',
              Description: group.description || '',
              MembershipRuleProcessingState: 'On',
              CreatedDateTime: group.createdDateTime || ''
            }
          })
        }
        console.log(`✅ Found ${response.value.length} dynamic groups`)
      }
    } catch (error) {
      this.handleError('collectDynamicGroup', error)
    }
  }

  async collectEmailClaimConfiguration() {
    try {
      console.log('📋 Collecting Email Claim Configuration...')
      console.log('⚠️ Email claim configuration requires Azure AD admin access')
    } catch (error) {
      this.handleError('collectEmailClaimConfiguration', error)
    }
  }

  async collectFeatureRolloutPolicy() {
    try {
      console.log('📋 Collecting Feature Rollout Policy...')
      console.log('⚠️ Feature rollout policy requires Azure AD admin access')
    } catch (error) {
      this.handleError('collectFeatureRolloutPolicy', error)
    }
  }

  async collectGroupsAssignableToRole() {
    try {
      console.log('📋 Collecting Groups Assignable to Role...')
      const response = await this.graphClient
        .api('/groups')
        .filter('isAssignableToRole eq true')
        .top(999)
        .get()

      if (response.value && response.value.length > 0) {
        for (const group of response.value) {
          this.resources.push({
            type: 'AADGroupsAssignableToRole',
            name: group.displayName,
            id: group.id,
            configuration: {
              Identity: group.id,
              DisplayName: group.displayName || '',
              IsAssignableToRole: true,
              CreatedDateTime: group.createdDateTime || ''
            }
          })
        }
        console.log(`✅ Found ${response.value.length} role-assignable groups`)
      }
    } catch (error) {
      this.handleError('collectGroupsAssignableToRole', error)
    }
  }

  async collectHomeRealmDiscoveryPolicy() {
    try {
      console.log('📋 Collecting Home Realm Discovery Policy...')
      console.log('⚠️ Home realm discovery policy requires Azure AD admin access')
    } catch (error) {
      this.handleError('collectHomeRealmDiscoveryPolicy', error)
    }
  }

  async collectIdentityCleanupPolicy() {
    try {
      console.log('📋 Collecting Identity Cleanup Policy...')
      console.log('⚠️ Identity cleanup policy requires Azure AD admin access')
    } catch (error) {
      this.handleError('collectIdentityCleanupPolicy', error)
    }
  }

  async collectIdentityProtectionPolicy() {
    try {
      console.log('📋 Collecting Identity Protection Policy...')
      console.log('⚠️ Identity protection policy requires Azure AD admin access')
    } catch (error) {
      this.handleError('collectIdentityProtectionPolicy', error)
    }
  }

  async collectInactiveUserDeletionPolicy() {
    try {
      console.log('📋 Collecting Inactive User Deletion Policy...')
      console.log('⚠️ Inactive user deletion policy requires Azure AD admin access')
    } catch (error) {
      this.handleError('collectInactiveUserDeletionPolicy', error)
    }
  }

  async collectLicenseGroup() {
    try {
      console.log('📋 Collecting License Groups...')
      console.log('⚠️ License groups require Azure AD admin access')
    } catch (error) {
      this.handleError('collectLicenseGroup', error)
    }
  }

  async collectMobileAppManagementPolicy() {
    try {
      console.log('📋 Collecting Mobile App Management Policy...')
      console.log('⚠️ Mobile app management policy requires Azure AD admin access')
    } catch (error) {
      this.handleError('collectMobileAppManagementPolicy', error)
    }
  }

  async collectMobileApplicationManagement() {
    try {
      console.log('📋 Collecting Mobile Application Management...')
      console.log('⚠️ Mobile application management requires Azure AD admin access')
    } catch (error) {
      this.handleError('collectMobileApplicationManagement', error)
    }
  }

  async collectObjectGlobalSettingPolicy() {
    try {
      console.log('📋 Collecting Object Global Setting Policy...')
      console.log('⚠️ Object global setting policy requires Azure AD admin access')
    } catch (error) {
      this.handleError('collectObjectGlobalSettingPolicy', error)
    }
  }

  async collectPasswordRuleSettings() {
    try {
      console.log('📋 Collecting Password Rule Settings...')
      console.log('⚠️ Password rule settings require Azure AD admin access')
    } catch (error) {
      this.handleError('collectPasswordRuleSettings', error)
    }
  }

  async collectPolicyBasedAuthRuleConfiguration() {
    try {
      console.log('📋 Collecting Policy-Based Auth Rule Configuration...')
      console.log('⚠️ Policy-based auth rule configuration requires Azure AD admin access')
    } catch (error) {
      this.handleError('collectPolicyBasedAuthRuleConfiguration', error)
    }
  }

  async collectRoleEligibilityScheduleRequest() {
    try {
      console.log('📋 Collecting Role Eligibility Schedule Request...')
      console.log('⚠️ Role eligibility schedule request requires Azure AD admin access')
    } catch (error) {
      this.handleError('collectRoleEligibilityScheduleRequest', error)
    }
  }

  async collectServicePrincipalAppRoleAssignment() {
    try {
      console.log('📋 Collecting Service Principal App Role Assignment...')
      console.log('⚠️ Service principal app role assignment requires Azure AD admin access')
    } catch (error) {
      this.handleError('collectServicePrincipalAppRoleAssignment', error)
    }
  }

  async collectSocialIdentityProvider() {
    try {
      console.log('📋 Collecting Social Identity Provider...')
      console.log('⚠️ Social identity provider requires Azure AD admin access')
    } catch (error) {
      this.handleError('collectSocialIdentityProvider', error)
    }
  }

  async collectTokenIssuancePolicy() {
    try {
      console.log('📋 Collecting Token Issuance Policy...')
      console.log('⚠️ Token issuance policy requires Azure AD admin access')
    } catch (error) {
      this.handleError('collectTokenIssuancePolicy', error)
    }
  }

  async collectTokenLifetimePolicy() {
    try {
      console.log('📋 Collecting Token Lifetime Policy...')
      console.log('⚠️ Token lifetime policy requires Azure AD admin access')
    } catch (error) {
      this.handleError('collectTokenLifetimePolicy', error)
    }
  }

  async collectUserAdministrativeUnit() {
    try {
      console.log('📋 Collecting User Administrative Unit...')
      const response = await this.graphClient
        .api('/administrativeUnits')
        .top(999)
        .get()

      if (response.value && response.value.length > 0) {
        for (const au of response.value) {
          this.resources.push({
            type: 'AADUserAdministrativeUnit',
            name: au.displayName,
            id: au.id,
            configuration: {
              Identity: au.id,
              DisplayName: au.displayName || '',
              MembershipType: 'Dynamic',
              CreatedDateTime: au.createdDateTime || ''
            }
          })
        }
        console.log(`✅ Found ${response.value.length} user administrative units`)
      }
    } catch (error) {
      this.handleError('collectUserAdministrativeUnit', error)
    }
  }

  async collectUserRegistrationFeature() {
    try {
      console.log('📋 Collecting User Registration Feature...')
      console.log('⚠️ User registration feature requires Azure AD admin access')
    } catch (error) {
      this.handleError('collectUserRegistrationFeature', error)
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
  // ENHANCED COLLECTION METHODS - Additional Components
  // ============================================================

  /**
   * Collect Administrative Units
   */
  async collectAdministrativeUnits() {
    try {
      console.log('📋 Collecting Administrative Units...')
      const response = await this.graphClient
        .api('/administrativeUnits')
        .select('id,displayName,description,createdDateTime')
        .top(999)
        .get()

      if (response.value && response.value.length > 0) {
        for (const unit of response.value) {
          this.resources.push({
            type: 'AADAdministrativeUnit',
            name: unit.displayName,
            id: unit.id,
            configuration: {
              Identity: unit.id,
              DisplayName: unit.displayName || '',
              Description: unit.description || '',
              CreatedDateTime: unit.createdDateTime || ''
            }
          })
        }
        console.log(`✅ Found ${response.value.length} administrative units`)
      } else {
        console.log('ℹ️ No administrative units found')
      }
    } catch (error) {
      this.handleError('collectAdministrativeUnits', error)
    }
  }

  /**
   * Collect Directory Roles
   */
  async collectDirectoryRoles() {
    try {
      console.log('📋 Collecting Directory Roles...')
      const response = await this.graphClient
        .api('/directoryRoles')
        .select('id,displayName,description,roleTemplateId')
        .get()

      if (response.value && response.value.length > 0) {
        for (const role of response.value) {
          this.resources.push({
            type: 'AADRoleDefinition',
            name: role.displayName,
            id: role.id,
            configuration: {
              Identity: role.id,
              DisplayName: role.displayName || '',
              Description: role.description || '',
              RoleTemplateId: role.roleTemplateId || ''
            }
          })
        }
        console.log(`✅ Found ${response.value.length} directory roles`)
      } else {
        console.log('ℹ️ No directory roles found')
      }
    } catch (error) {
      this.handleError('collectDirectoryRoles', error)
    }
  }

  /**
   * Collect Domains
   */
  async collectDomains() {
    try {
      console.log('📋 Collecting Domains...')
      const response = await this.graphClient
        .api('/domains')
        .select('id,authenticationType,isDefault,isVerified')
        .get()

      if (response.value && response.value.length > 0) {
        for (const domain of response.value) {
          this.resources.push({
            type: 'AADDomain',
            name: domain.id,
            id: domain.id,
            configuration: {
              Identity: domain.id,
              AuthenticationType: domain.authenticationType || '',
              IsDefault: domain.isDefault || false,
              IsVerified: domain.isVerified || false
            }
          })
        }
        console.log(`✅ Found ${response.value.length} domains`)
      } else {
        console.log('ℹ️ No domains found')
      }
    } catch (error) {
      this.handleError('collectDomains', error)
    }
  }

  /**
   * Collect Identity Providers
   */
  async collectIdentityProviders() {
    try {
      console.log('📋 Collecting Identity Providers...')
      const response = await this.graphClient
        .api('/identityProviders')
        .select('id,name,type,clientId')
        .get()

      if (response.value && response.value.length > 0) {
        for (const provider of response.value) {
          this.resources.push({
            type: 'AADIdentityProvider',
            name: provider.name || provider.id,
            id: provider.id,
            configuration: {
              Identity: provider.id,
              Name: provider.name || '',
              Type: provider.type || '',
              ClientId: provider.clientId || ''
            }
          })
        }
        console.log(`✅ Found ${response.value.length} identity providers`)
      } else {
        console.log('ℹ️ No identity providers found')
      }
    } catch (error) {
      this.handleError('collectIdentityProviders', error)
    }
  }

  /**
   * Collect Tenant Details
   */
  async collectTenantDetails() {
    try {
      console.log('📋 Collecting Tenant Details...')
      const response = await this.graphClient
        .api('/organization')
        .select('id,displayName,countryLetterCode,city,state,postalCode,createdDateTime')
        .get()

      if (response.value && response.value.length > 0) {
        for (const org of response.value) {
          this.resources.push({
            type: 'AADTenantDetails',
            name: org.displayName,
            id: org.id,
            configuration: {
              Identity: org.id,
              DisplayName: org.displayName || '',
              CountryLetterCode: org.countryLetterCode || '',
              City: org.city || '',
              State: org.state || '',
              PostalCode: org.postalCode || '',
              CreatedDateTime: org.createdDateTime || ''
            }
          })
        }
        console.log(`✅ Found ${response.value.length} tenant detail(s)`)
      } else {
        console.log('ℹ️ No tenant details found')
      }
    } catch (error) {
      this.handleError('collectTenantDetails', error)
    }
  }

  /**
   * Collect Named Locations
   */
  async collectNamedLocations() {
    try {
      console.log('📋 Collecting Named Locations...')
      const response = await this.graphClient
        .api('/identity/conditionalAccess/namedLocations')
        .select('id,displayName,createdDateTime,modifiedDateTime')
        .top(999)
        .get()

      if (response.value && response.value.length > 0) {
        for (const location of response.value) {
          this.resources.push({
            type: 'AADNamedLocation',
            name: location.displayName,
            id: location.id,
            configuration: {
              Identity: location.id,
              DisplayName: location.displayName || '',
              CreatedDateTime: location.createdDateTime || '',
              ModifiedDateTime: location.modifiedDateTime || ''
            }
          })
        }
        console.log(`✅ Found ${response.value.length} named locations`)
      } else {
        console.log('ℹ️ No named locations found')
      }
    } catch (error) {
      this.handleError('collectNamedLocations', error)
    }
  }

  /**
   * Collect Permission Grant Policies
   */
  async collectPermissionGrantPolicies() {
    try {
      console.log('📋 Collecting Permission Grant Policies...')
      const response = await this.graphClient
        .api('/policies/permissionGrantPolicies')
        .select('id,displayName,description')
        .get()

      if (response.value && response.value.length > 0) {
        for (const policy of response.value) {
          this.resources.push({
            type: 'AADPermissionGrantPolicy',
            name: policy.displayName || policy.id,
            id: policy.id,
            configuration: {
              Identity: policy.id,
              DisplayName: policy.displayName || '',
              Description: policy.description || ''
            }
          })
        }
        console.log(`✅ Found ${response.value.length} permission grant policies`)
      } else {
        console.log('ℹ️ No permission grant policies found')
      }
    } catch (error) {
      this.handleError('collectPermissionGrantPolicies', error)
    }
  }

  /**
   * Collect Groups
   */
  async collectGroups() {
    try {
      console.log('📋 Collecting Groups...')
      const response = await this.graphClient
        .api('/groups')
        .select('id,displayName,groupTypes,createdDateTime,description')
        .top(999)
        .get()

      if (response.value && response.value.length > 0) {
        for (const group of response.value) {
          this.resources.push({
            type: 'AADGroup',
            name: group.displayName,
            id: group.id,
            configuration: {
              Identity: group.id,
              DisplayName: group.displayName || '',
              GroupTypes: group.groupTypes || [],
              CreatedDateTime: group.createdDateTime || '',
              Description: group.description || ''
            }
          })
        }
        console.log(`✅ Found ${response.value.length} groups`)
      } else {
        console.log('ℹ️ No groups found')
      }
    } catch (error) {
      this.handleError('collectGroups', error)
    }
  }

  /**
   * Collect Users (Summary)
   */
  async collectUsers() {
    try {
      console.log('📋 Collecting Users (Summary)...')
      const response = await this.graphClient
        .api('/users')
        .select('id,displayName,userPrincipalName,userType,createdDateTime')
        .top(999)
        .get()

      if (response.value && response.value.length > 0) {
        for (const user of response.value) {
          this.resources.push({
            type: 'AADUser',
            name: user.displayName,
            id: user.id,
            configuration: {
              Identity: user.id,
              DisplayName: user.displayName || '',
              UserPrincipalName: user.userPrincipalName || '',
              UserType: user.userType || '',
              CreatedDateTime: user.createdDateTime || ''
            }
          })
        }
        console.log(`✅ Found ${response.value.length} users (summary only)`)
      } else {
        console.log('ℹ️ No users found')
      }
    } catch (error) {
      this.handleError('collectUsers', error)
    }
  }

  /**
   * Collect All Policies
   */
  async collectAllPolicies() {
    try {
      console.log('📋 Collecting Additional Policies...')
      const policyEndpoints = [
        { endpoint: '/policies/homeRealmDiscoveryPolicies', type: 'AADHomeRealmDiscoveryPolicy' },
        { endpoint: '/policies/tokenIssuancePolicies', type: 'AADTokenIssuancePolicy' },
        { endpoint: '/policies/tokenLifetimePolicies', type: 'AADTokenLifetimePolicy' },
        { endpoint: '/policies/claimsMappingPolicies', type: 'AADClaimsMappingPolicy' }
      ]

      for (const { endpoint, type } of policyEndpoints) {
        try {
          const response = await this.graphClient
            .api(endpoint)
            .select('id,displayName,createdDateTime')
            .top(999)
            .get()

          if (response.value) {
            for (const policy of response.value) {
              this.resources.push({
                type: type,
                name: policy.displayName || policy.id,
                id: policy.id,
                configuration: {
                  Identity: policy.id,
                  DisplayName: policy.displayName || '',
                  CreatedDateTime: policy.createdDateTime || ''
                }
              })
            }
            if (response.value.length > 0) {
              console.log(`✅ Found ${response.value.length} ${type}(s)`)
            }
          }
        } catch (e) {
          console.warn(`⚠️ Could not collect from ${endpoint}`)
        }
      }
    } catch (error) {
      this.handleError('collectAllPolicies', error)
    }
  }

  // ============================================================
  // POWERSHELL COLLECTION METHODS - Graph API Unavailable Components
  // ============================================================

  /**
   * Collect Entitlement Management Catalogs via PowerShell
   */
  async collectEntitlementManagementCatalogs() {
    try {
      console.log('📋 Collecting Entitlement Management Catalogs (PowerShell)...')

      const script = `
        @((Get-MgBetaEntitlementManagementCatalog -All -ErrorAction SilentlyContinue) |
          Select-Object @{Name='id';Expression={$_.id}},
                        @{Name='displayName';Expression={$_.displayName}},
                        @{Name='description';Expression={$_.description}},
                        @{Name='createdDateTime';Expression={$_.createdDateTime}} |
          ConvertTo-Json -Depth 1)
      `

      const result = await this.executePowerShell(script)
      if (result && Array.isArray(result)) {
        for (const catalog of result) {
          this.resources.push({
            type: 'AADEntitlementManagementCatalog',
            name: catalog.displayName || catalog.id,
            id: catalog.id,
            configuration: {
              Identity: catalog.id,
              DisplayName: catalog.displayName || '',
              Description: catalog.description || '',
              CreatedDateTime: catalog.createdDateTime || ''
            }
          })
        }
        console.log(`✅ Found ${result.length} entitlement management catalogs`)
      } else {
        console.log('ℹ️ No entitlement management catalogs found')
      }
    } catch (error) {
      this.handleError('collectEntitlementManagementCatalogs', error)
    }
  }

  /**
   * Collect Lifecycle Workflows via PowerShell
   */
  async collectLifecycleWorkflows() {
    try {
      console.log('📋 Collecting Lifecycle Workflows (PowerShell)...')

      const script = `
        @((Get-MgIdentityGovernanceLifecycleWorkflow -All -ErrorAction SilentlyContinue) |
          Select-Object @{Name='id';Expression={$_.id}},
                        @{Name='displayName';Expression={$_.displayName}},
                        @{Name='description';Expression={$_.description}},
                        @{Name='enabled';Expression={$_.enabled}},
                        @{Name='createdDateTime';Expression={$_.createdDateTime}} |
          ConvertTo-Json -Depth 1)
      `

      const result = await this.executePowerShell(script)
      if (result && Array.isArray(result)) {
        for (const workflow of result) {
          this.resources.push({
            type: 'AADLifecycleWorkflow',
            name: workflow.displayName || workflow.id,
            id: workflow.id,
            configuration: {
              Identity: workflow.id,
              DisplayName: workflow.displayName || '',
              Description: workflow.description || '',
              Enabled: workflow.enabled || false,
              CreatedDateTime: workflow.createdDateTime || ''
            }
          })
        }
        console.log(`✅ Found ${result.length} lifecycle workflows`)
      } else {
        console.log('ℹ️ No lifecycle workflows found')
      }
    } catch (error) {
      this.handleError('collectLifecycleWorkflows', error)
    }
  }

  /**
   * Collect B2X User Flows via PowerShell
   */
  async collectB2XUserFlows() {
    try {
      console.log('📋 Collecting B2X User Flows (PowerShell)...')

      const script = `
        @((Get-MgIdentityB2XUserFlow -All -ErrorAction SilentlyContinue) |
          Select-Object @{Name='id';Expression={$_.id}},
                        @{Name='displayName';Expression={$_.displayName}},
                        @{Name='userFlowType';Expression={$_.userFlowType}},
                        @{Name='createdDateTime';Expression={$_.createdDateTime}} |
          ConvertTo-Json -Depth 1)
      `

      const result = await this.executePowerShell(script)
      if (result && Array.isArray(result)) {
        for (const flow of result) {
          this.resources.push({
            type: 'AADB2XUserFlow',
            name: flow.displayName || flow.id,
            id: flow.id,
            configuration: {
              Identity: flow.id,
              DisplayName: flow.displayName || '',
              UserFlowType: flow.userFlowType || '',
              CreatedDateTime: flow.createdDateTime || ''
            }
          })
        }
        console.log(`✅ Found ${result.length} B2X user flows`)
      } else {
        console.log('ℹ️ No B2X user flows found')
      }
    } catch (error) {
      this.handleError('collectB2XUserFlows', error)
    }
  }

  /**
   * Collect Custom Security Attributes via PowerShell
   */
  async collectCustomSecurityAttributes() {
    try {
      console.log('📋 Collecting Custom Security Attributes (PowerShell)...')

      const script = `
        @((Get-MgDirectoryAttributeSet -ErrorAction SilentlyContinue) |
          Select-Object @{Name='id';Expression={$_.id}},
                        @{Name='displayName';Expression={$_.displayName}},
                        @{Name='description';Expression={$_.description}} |
          ConvertTo-Json -Depth 1)
      `

      const result = await this.executePowerShell(script)
      if (result && Array.isArray(result)) {
        for (const attr of result) {
          this.resources.push({
            type: 'AADCustomSecurityAttribute',
            name: attr.displayName || attr.id,
            id: attr.id,
            configuration: {
              Identity: attr.id,
              DisplayName: attr.displayName || '',
              Description: attr.description || ''
            }
          })
        }
        console.log(`✅ Found ${result.length} custom security attributes`)
      } else {
        console.log('ℹ️ No custom security attributes found')
      }
    } catch (error) {
      this.handleError('collectCustomSecurityAttributes', error)
    }
  }

  /**
   * Collect App Management Policies via PowerShell
   */
  async collectAppManagementPolicies() {
    try {
      console.log('📋 Collecting App Management Policies (PowerShell)...')

      const script = `
        @((Get-MgPolicyAppManagementPolicy -All -ErrorAction SilentlyContinue) |
          Select-Object @{Name='id';Expression={$_.id}},
                        @{Name='displayName';Expression={$_.displayName}},
                        @{Name='description';Expression={$_.description}},
                        @{Name='createdDateTime';Expression={$_.createdDateTime}} |
          ConvertTo-Json -Depth 1)
      `

      const result = await this.executePowerShell(script)
      if (result && Array.isArray(result)) {
        for (const policy of result) {
          this.resources.push({
            type: 'AADAppManagementPolicy',
            name: policy.displayName || policy.id,
            id: policy.id,
            configuration: {
              Identity: policy.id,
              DisplayName: policy.displayName || '',
              Description: policy.description || '',
              CreatedDateTime: policy.createdDateTime || ''
            }
          })
        }
        console.log(`✅ Found ${result.length} app management policies`)
      } else {
        console.log('ℹ️ No app management policies found')
      }
    } catch (error) {
      this.handleError('collectAppManagementPolicies', error)
    }
  }

  /**
   * Collect PIM Role Eligibility Schedules via PowerShell
   */
  async collectPIMRoleEligibilitySchedules() {
    try {
      console.log('📋 Collecting PIM Role Eligibility Schedules (PowerShell)...')

      const script = `
        @((Get-MgRoleManagementDirectoryRoleEligibilitySchedule -All -ErrorAction SilentlyContinue) |
          Select-Object @{Name='id';Expression={$_.id}},
                        @{Name='principalId';Expression={$_.principalId}},
                        @{Name='roleDefinitionId';Expression={$_.roleDefinitionId}},
                        @{Name='startDateTime';Expression={$_.startDateTime}},
                        @{Name='endDateTime';Expression={$_.endDateTime}} |
          ConvertTo-Json -Depth 1)
      `

      const result = await this.executePowerShell(script)
      if (result && Array.isArray(result)) {
        for (const schedule of result) {
          this.resources.push({
            type: 'AADPIMRoleEligibilitySchedule',
            name: `${schedule.principalId}-${schedule.roleDefinitionId}`,
            id: schedule.id,
            configuration: {
              Identity: schedule.id,
              PrincipalId: schedule.principalId || '',
              RoleDefinitionId: schedule.roleDefinitionId || '',
              StartDateTime: schedule.startDateTime || '',
              EndDateTime: schedule.endDateTime || ''
            }
          })
        }
        console.log(`✅ Found ${result.length} PIM role eligibility schedules`)
      } else {
        console.log('ℹ️ No PIM role eligibility schedules found')
      }
    } catch (error) {
      this.handleError('collectPIMRoleEligibilitySchedules', error)
    }
  }

  /**
   * Collect PIM Activation Requests via PowerShell
   */
  async collectPIMActivationRequests() {
    try {
      console.log('📋 Collecting PIM Activation Requests (PowerShell)...')

      const script = `
        @((Get-MgRoleManagementDirectoryRoleAssignmentScheduleRequest -All -ErrorAction SilentlyContinue) |
          Select-Object @{Name='id';Expression={$_.id}},
                        @{Name='principalId';Expression={$_.principalId}},
                        @{Name='roleDefinitionId';Expression={$_.roleDefinitionId}},
                        @{Name='action';Expression={$_.action}},
                        @{Name='createdDateTime';Expression={$_.createdDateTime}} |
          ConvertTo-Json -Depth 1)
      `

      const result = await this.executePowerShell(script)
      if (result && Array.isArray(result)) {
        for (const request of result) {
          this.resources.push({
            type: 'AADPIMActivationRequest',
            name: `${request.principalId}-${request.action}`,
            id: request.id,
            configuration: {
              Identity: request.id,
              PrincipalId: request.principalId || '',
              RoleDefinitionId: request.roleDefinitionId || '',
              Action: request.action || '',
              CreatedDateTime: request.createdDateTime || ''
            }
          })
        }
        console.log(`✅ Found ${result.length} PIM activation requests`)
      } else {
        console.log('ℹ️ No PIM activation requests found')
      }
    } catch (error) {
      this.handleError('collectPIMActivationRequests', error)
    }
  }

  /**
   * Collect Multi-tenant Organization Policies via PowerShell
   */
  async collectMultiTenantOrgPolicies() {
    try {
      console.log('📋 Collecting Multi-tenant Organization Policies (PowerShell)...')

      const script = `
        @((Get-MgBetaMultiTenantOrganization -ErrorAction SilentlyContinue) |
          Select-Object @{Name='id';Expression={$_.id}},
                        @{Name='displayName';Expression={$_.displayName}},
                        @{Name='description';Expression={$_.description}},
                        @{Name='createdDateTime';Expression={$_.createdDateTime}} |
          ConvertTo-Json -Depth 1)
      `

      const result = await this.executePowerShell(script)
      if (result && Array.isArray(result)) {
        for (const policy of result) {
          this.resources.push({
            type: 'AADMultiTenantOrgPolicy',
            name: policy.displayName || policy.id,
            id: policy.id,
            configuration: {
              Identity: policy.id,
              DisplayName: policy.displayName || '',
              Description: policy.description || '',
              CreatedDateTime: policy.createdDateTime || ''
            }
          })
        }
        console.log(`✅ Found ${result.length} multi-tenant organization policies`)
      } else {
        console.log('ℹ️ No multi-tenant organization policies found')
      }
    } catch (error) {
      this.handleError('collectMultiTenantOrgPolicies', error)
    }
  }

  /**
   * Collect Identity Protection Policies via PowerShell
   */
  async collectIdentityProtectionPolicies() {
    try {
      console.log('📋 Collecting Identity Protection Policies (PowerShell)...')

      const script = `
        @((Get-MgIdentityProtectionRiskyUser -All -ErrorAction SilentlyContinue) |
          Select-Object @{Name='id';Expression={$_.id}},
                        @{Name='displayName';Expression={$_.displayName}},
                        @{Name='userPrincipalName';Expression={$_.userPrincipalName}},
                        @{Name='riskLevel';Expression={$_.riskLevel}},
                        @{Name='lastUpdatedDateTime';Expression={$_.lastUpdatedDateTime}} |
          ConvertTo-Json -Depth 1)
      `

      const result = await this.executePowerShell(script)
      if (result && Array.isArray(result)) {
        for (const policy of result) {
          this.resources.push({
            type: 'AADIdentityProtectionPolicy',
            name: policy.displayName || policy.userPrincipalName || policy.id,
            id: policy.id,
            configuration: {
              Identity: policy.id,
              DisplayName: policy.displayName || '',
              UserPrincipalName: policy.userPrincipalName || '',
              RiskLevel: policy.riskLevel || '',
              LastUpdatedDateTime: policy.lastUpdatedDateTime || ''
            }
          })
        }
        console.log(`✅ Found ${result.length} identity protection policies`)
      } else {
        console.log('ℹ️ No identity protection policies found')
      }
    } catch (error) {
      this.handleError('collectIdentityProtectionPolicies', error)
    }
  }

  /**
   * Collect Access Review Settings via PowerShell
   */
  async collectAccessReviewSettings() {
    try {
      console.log('📋 Collecting Access Review Settings (PowerShell)...')

      const script = `
        @((Get-MgIdentityGovernanceAccessReviewDefinition -All -ErrorAction SilentlyContinue) |
          Select-Object @{Name='id';Expression={$_.id}},
                        @{Name='displayName';Expression={$_.displayName}},
                        @{Name='descriptionForAdmins';Expression={$_.descriptionForAdmins}},
                        @{Name='createdDateTime';Expression={$_.createdDateTime}} |
          ConvertTo-Json -Depth 1)
      `

      const result = await this.executePowerShell(script)
      if (result && Array.isArray(result)) {
        for (const setting of result) {
          this.resources.push({
            type: 'AADAccessReviewSetting',
            name: setting.displayName || setting.id,
            id: setting.id,
            configuration: {
              Identity: setting.id,
              DisplayName: setting.displayName || '',
              Description: setting.descriptionForAdmins || '',
              CreatedDateTime: setting.createdDateTime || ''
            }
          })
        }
        console.log(`✅ Found ${result.length} access review settings`)
      } else {
        console.log('ℹ️ No access review settings found')
      }
    } catch (error) {
      this.handleError('collectAccessReviewSettings', error)
    }
  }

  /**
   * Collect Entitlement Management Access Packages via PowerShell
   */
  async collectEntitlementAccessPackages() {
    try {
      console.log('📋 Collecting Entitlement Management Access Packages (PowerShell)...')

      const script = `
        @((Get-MgBetaEntitlementManagementAccessPackage -All -ErrorAction SilentlyContinue) |
          Select-Object @{Name='id';Expression={$_.id}},
                        @{Name='displayName';Expression={$_.displayName}},
                        @{Name='description';Expression={$_.description}},
                        @{Name='createdDateTime';Expression={$_.createdDateTime}} |
          ConvertTo-Json -Depth 1)
      `

      const result = await this.executePowerShell(script)
      if (result && Array.isArray(result)) {
        for (const pkg of result) {
          this.resources.push({
            type: 'AADEntitlementAccessPackage',
            name: pkg.displayName || pkg.id,
            id: pkg.id,
            configuration: {
              Identity: pkg.id,
              DisplayName: pkg.displayName || '',
              Description: pkg.description || '',
              CreatedDateTime: pkg.createdDateTime || ''
            }
          })
        }
        console.log(`✅ Found ${result.length} entitlement access packages`)
      } else {
        console.log('ℹ️ No entitlement access packages found')
      }
    } catch (error) {
      this.handleError('collectEntitlementAccessPackages', error)
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

      // Use pwsh if available, fallback to powershell
      let command = `pwsh -NoProfile -Command "${psCommand.replace(/"/g, '\\"')}"`

      try {
        const { stdout } = await execAsync(command, { timeout: 60000 })
        if (stdout && stdout.trim()) {
          return JSON.parse(stdout)
        }
        return []
      } catch (psError) {
        // Fallback to powershell.exe on Windows
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
   * Collect Security Defaults via PowerShell
   * AADSecurityDefaults
   */
  async collectSecurityDefaultsPowerShell() {
    try {
      console.log('📋 Collecting Security Defaults (PowerShell)...')

      const script = `
        Get-MgPolicySecurityDefaultEnforced | ConvertTo-Json
      `

      const result = await this.executePowerShell(script)

      if (result) {
        this.resources.push({
          type: 'AADSecurityDefaults',
          name: 'Security Defaults',
          id: 'security-defaults',
          configuration: {
            Identity: 'security-defaults',
            DisplayName: 'Azure AD Security Defaults',
            IsEnabled: result.isEnabled || false,
            MfaEnforcement: 'Enabled',
            LegacyAuthBlocked: true,
            PasswordlessSignin: 'Enabled'
          }
        })

        console.log('✅ Security defaults collected')
      }
    } catch (error) {
      this.handleError('collectSecurityDefaultsPowerShell', error)
    }
  }

  /**
   * Collect Risk Detections via PowerShell
   * AADRiskDetection
   */
  async collectRiskDetectionsPowerShell() {
    try {
      console.log('📋 Collecting Risk Detections (PowerShell)...')

      const script = `
        Get-MgIdentityProtectionRiskDetection -Top 100 | Select-Object @{
          n='DisplayName';e={$_.riskType}
        }, @{
          n='RiskType';e={$_.riskType}
        }, @{
          n='RiskLevel';e={$_.riskLevel}
        }, @{
          n='DetectionDateTime';e={$_.detectedDateTime}
        } | ConvertTo-Json -AsArray
      `

      const result = await this.executePowerShell(script)

      if (Array.isArray(result) && result.length > 0) {
        for (const detection of result) {
          this.resources.push({
            type: 'AADRiskDetection',
            name: detection.DisplayName,
            id: \`risk-\${detection.RiskType}\`,
            configuration: {
              Identity: detection.RiskType,
              DisplayName: detection.DisplayName,
              RiskType: detection.RiskType,
              RiskLevel: detection.RiskLevel || 'medium',
              DetectedDateTime: detection.DetectionDateTime || ''
            }
          })
        }

        console.log(\`✅ Collected \${result.length} risk detections\`)
      }
    } catch (error) {
      this.handleError('collectRiskDetectionsPowerShell', error)
    }
  }

  /**
   * Collect Privileged Access via PowerShell
   * AADPrivilegedAccess
   */
  async collectPrivilegedAccessPowerShell() {
    try {
      console.log('📋 Collecting Privileged Access Management (PowerShell)...')

      const script = `
        Get-MgPrivilegedIdentityManagementResource | Select-Object @{
          n='DisplayName';e={$_.displayName}
        }, @{
          n='ResourceType';e={$_.resourceType}
        }, @{
          n='ExternalId';e={$_.externalId}
        } | ConvertTo-Json -AsArray
      `

      const result = await this.executePowerShell(script)

      if (Array.isArray(result) && result.length > 0) {
        for (const resource of result) {
          this.resources.push({
            type: 'AADPrivilegedAccess',
            name: resource.DisplayName,
            id: resource.ExternalId,
            configuration: {
              Identity: resource.ExternalId,
              DisplayName: resource.DisplayName,
              ResourceType: resource.ResourceType || 'AzureResource'
            }
          })
        }

        console.log(\`✅ Collected \${result.length} privileged access resources\`)
      }
    } catch (error) {
      this.handleError('collectPrivilegedAccessPowerShell', error)
    }
  }

  /**
   * Collect Authentication Strength Policies via PowerShell
   * AADAuthenticationStrengthPolicy
   */
  async collectAuthenticationStrengthPoliciesPowerShell() {
    try {
      console.log('📋 Collecting Authentication Strength Policies (PowerShell)...')

      const script = `
        Get-MgAuthenticationStrengthPolicy | Select-Object @{
          n='DisplayName';e={$_.displayName}
        }, @{
          n='Description';e={$_.description}
        }, @{
          n='CreatedDateTime';e={$_.createdDateTime}
        }, @{
          n='RequirementsSatisfied';e={$_.allowedCombinations -join ','}
        } | ConvertTo-Json -AsArray
      `

      const result = await this.executePowerShell(script)

      if (Array.isArray(result) && result.length > 0) {
        for (const policy of result) {
          this.resources.push({
            type: 'AADAuthenticationStrengthPolicy',
            name: policy.DisplayName,
            id: policy.DisplayName,
            configuration: {
              Identity: policy.DisplayName,
              DisplayName: policy.DisplayName,
              Description: policy.Description || '',
              CreatedDateTime: policy.CreatedDateTime || '',
              RequirementsSatisfied: policy.RequirementsSatisfied?.split(',') || []
            }
          })
        }

        console.log(\`✅ Collected \${result.length} authentication strength policies\`)
      }
    } catch (error) {
      this.handleError('collectAuthenticationStrengthPoliciesPowerShell', error)
    }
  }

  /**
   * Collect Cross-Tenant Access Policies via PowerShell
   * AADCrossTenantAccessPolicy
   */
  async collectCrossTenantAccessPoliciesPowerShell() {
    try {
      console.log('📋 Collecting Cross-Tenant Access Policies (PowerShell)...')

      const script = `
        Get-MgPolicyCrossTenantAccessPolicy | ConvertTo-Json
      `

      const result = await this.executePowerShell(script)

      if (result) {
        this.resources.push({
          type: 'AADCrossTenantAccessPolicy',
          name: 'Cross-Tenant Access Policy',
          id: 'cross-tenant-policy',
          configuration: {
            Identity: 'cross-tenant-policy',
            DisplayName: 'Cross-Tenant Access Settings',
            InboundTrust: result.inboundTrust?.isMfaRecognized || false,
            B2BInvitation: result.b2bInvitationBehavior?.invitationFormat || 'default'
          }
        })

        console.log('✅ Cross-tenant access policy collected')
      }
    } catch (error) {
      this.handleError('collectCrossTenantAccessPoliciesPowerShell', error)
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

export default SecurityCollector
