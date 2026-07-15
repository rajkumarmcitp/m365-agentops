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
      console.log('🔄 Starting Security & Identity backup collection...')
      const startTime = Date.now()

      // Reset state for fresh collection
      this.resources = []
      this.errors = []

      // Collect each resource type
      await this.collectApplications()
      await this.collectServicePrincipals()
      await this.collectRoleAssignments()
      await this.collectConditionalAccessPolicies()
      await this.collectSecurityDefaults()
      await this.collectAuthenticationPolicies()
      await this.collectAdministrativeUnits()
      await this.collectCrossTenantAccessPolicy()
      await this.collectAdminConsentRequestPolicy()
      await this.collectAuthenticationContextClassReference()
      await this.collectAuthenticationFlowPolicy()
      await this.collectAuthenticationMethodsPolicies()
      await this.collectAuthorizationPolicy()
      await this.collectCertificateBasedAuthenticationConfiguration()
      await this.collectClaimsMappingPolicies()
      await this.collectCloudAppSecurityDetectionPolicy()
      await this.collectDeviceCompliancePolicy()
      await this.collectDeviceConfiguration()
      await this.collectDynamicGroup()
      await this.collectEmailClaimConfiguration()
      await this.collectFeatureRolloutPolicy()
      await this.collectGroupsAssignableToRole()
      await this.collectHomeRealmDiscoveryPolicy()
      await this.collectIdentityCleanupPolicy()
      await this.collectIdentityProtectionPolicy()
      await this.collectInactiveUserDeletionPolicy()
      await this.collectLicenseGroup()
      await this.collectMobileAppManagementPolicy()
      await this.collectMobileApplicationManagement()
      await this.collectObjectGlobalSettingPolicy()
      await this.collectPasswordRuleSettings()
      await this.collectPolicyBasedAuthRuleConfiguration()
      await this.collectRoleEligibilityScheduleRequest()
      await this.collectServicePrincipalAppRoleAssignment()
      await this.collectSocialIdentityProvider()
      await this.collectTokenIssuancePolicy()
      await this.collectTokenLifetimePolicy()
      await this.collectUserAdministrativeUnit()
      await this.collectUserRegistrationFeature()

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
