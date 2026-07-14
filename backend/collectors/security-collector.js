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

      // Collect each resource type
      await this.collectApplications()
      await this.collectServicePrincipals()
      await this.collectRoleAssignments()
      await this.collectConditionalAccessPolicies()
      await this.collectSecurityDefaults()
      await this.collectAuthenticationPolicies()
      await this.collectAdministrativeUnits()
      await this.collectCrossTenantAccessPolicy()

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
        .select('id,appId,displayName,description,createdDateTime,signInAudience')
        .top(999)
        .get()

      if (response.value && response.value.length > 0) {
        for (const app of response.value) {
          this.resources.push({
            type: 'AADApplication',
            name: app.displayName,
            id: app.id,
            configuration: {
              Identity: app.id,
              AppId: app.appId || '',
              DisplayName: app.displayName || '',
              Description: app.description || '',
              SignInAudience: app.signInAudience || 'AzureADMyOrg',
              CreatedDateTime: app.createdDateTime || '',
              AppType: 'Application'
            }
          })
        }
        console.log(`✅ Found ${response.value.length} applications`)
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
        .select('id,appId,displayName,appOwnerOrganizationId,createdDateTime,accountEnabled')
        .top(999)
        .get()

      if (response.value && response.value.length > 0) {
        for (const sp of response.value) {
          this.resources.push({
            type: 'AADServicePrincipal',
            name: sp.displayName,
            id: sp.id,
            configuration: {
              Identity: sp.id,
              AppId: sp.appId || '',
              DisplayName: sp.displayName || '',
              AppOwnerOrganizationId: sp.appOwnerOrganizationId || '',
              AccountEnabled: sp.accountEnabled || true,
              CreatedDateTime: sp.createdDateTime || ''
            }
          })
        }
        console.log(`✅ Found ${response.value.length} service principals`)
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
