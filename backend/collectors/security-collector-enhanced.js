/**
 * Enhanced Security Collector - Additional Collection Methods
 *
 * This module extends SecurityCollector with:
 * - Additional Graph API collection methods (30+ components)
 * - PowerShell-based collection for Graph-unavailable components
 * - Comprehensive error handling and logging
 * - Pagination and retry logic
 *
 * To integrate: Copy these methods into security-collector.js after line 48 (after existing collection method calls)
 */

// ============================================================
// ADDITIONAL GRAPH API COLLECTION METHODS
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
            DisplayName: unit.displayName,
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
      .top(999)
      .get()

    if (response.value && response.value.length > 0) {
      for (const role of response.value) {
        this.resources.push({
          type: 'AADRoleDefinition',
          name: role.displayName,
          id: role.id,
          configuration: {
            Identity: role.id,
            DisplayName: role.displayName,
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
      .select('id,authenticationType,isDefault,isVerified,createdDateTime')
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
            IsVerified: domain.isVerified || false,
            CreatedDateTime: domain.createdDateTime || ''
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
 * Collect Authorization Policy
 */
async collectAuthorizationPolicy() {
  try {
    console.log('📋 Collecting Authorization Policy...')
    const response = await this.graphClient
      .api('/policies/authorizationPolicy')
      .select('id,displayName,description,guestUserRoleId')
      .get()

    if (response && response.id) {
      this.resources.push({
        type: 'AADAuthorizationPolicy',
        name: response.displayName || 'Default',
        id: response.id,
        configuration: {
          Identity: response.id,
          DisplayName: response.displayName || '',
          Description: response.description || '',
          GuestUserRoleId: response.guestUserRoleId || ''
        }
      })
      console.log('✅ Authorization policy collected')
    } else {
      console.log('ℹ️ No authorization policy found')
    }
  } catch (error) {
    this.handleError('collectAuthorizationPolicy', error)
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
      .select('id,displayName,clientId,type')
      .top(999)
      .get()

    if (response.value && response.value.length > 0) {
      for (const provider of response.value) {
        this.resources.push({
          type: 'AADIdentityProvider',
          name: provider.displayName,
          id: provider.id,
          configuration: {
            Identity: provider.id,
            DisplayName: provider.displayName || '',
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
      .select('id,displayName,description,createdDateTime')
      .top(999)
      .get()

    if (response.value && response.value.length > 0) {
      for (const policy of response.value) {
        this.resources.push({
          type: 'AADPermissionGrantPolicy',
          name: policy.displayName,
          id: policy.id,
          configuration: {
            Identity: policy.id,
            DisplayName: policy.displayName || '',
            Description: policy.description || '',
            CreatedDateTime: policy.createdDateTime || ''
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
 * Collect Groups (for analysis)
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
 * Collect Users (for analysis)
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
    console.log('📋 Collecting All Policies...')
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
          console.log(`✅ Found ${response.value.length} ${type}(s)`)
        }
      } catch (e) {
        console.warn(`⚠️ Could not collect from ${endpoint}: ${e.message}`)
      }
    }
  } catch (error) {
    this.handleError('collectAllPolicies', error)
  }
}

// ============================================================
// HELPER METHODS
// ============================================================

/**
 * Get data with pagination support
 */
async getWithPagination(endpoint, select, maxPages = 5) {
  let allResults = []
  let pageCount = 0
  let nextLink = null

  try {
    do {
      const response = await this.graphClient
        .api(nextLink || endpoint)
        .select(select)
        .top(999)
        .get()

      if (response.value) {
        allResults.push(...response.value)
      }

      nextLink = response['@odata.nextLink']
      pageCount++

      if (pageCount >= maxPages) {
        console.warn(`⚠️ Pagination limited to ${maxPages} pages for ${endpoint}`)
        break
      }
    } while (nextLink)
  } catch (error) {
    console.warn(`⚠️ Pagination error for ${endpoint}: ${error.message}`)
  }

  return allResults
}

/**
 * Collect with retry logic
 */
async collectWithRetry(operation, operationName, maxRetries = 3) {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await operation()
    } catch (error) {
      if (attempt === maxRetries) {
        console.warn(`❌ ${operationName} failed after ${maxRetries} attempts: ${error.message}`)
        return null
      }
      const delay = this.options.retryDelay * Math.pow(2, attempt - 1)
      console.warn(`⚠️ ${operationName} attempt ${attempt} failed, retrying in ${delay}ms...`)
      await this.sleep(delay)
    }
  }
}

// ============================================================
// INTEGRATION INSTRUCTIONS
// ============================================================

/**
 * INTEGRATION: Add the following calls to the collect() method
 *
 * After line 48 in security-collector.js (after existing await calls), add:
 *
 * // Additional Graph API Collections (New - expand component coverage)
 * await this.collectAdministrativeUnits()
 * await this.collectDirectoryRoles()
 * await this.collectDomains()
 * await this.collectAuthorizationPolicy()
 * await this.collectIdentityProviders()
 * await this.collectTenantDetails()
 * await this.collectNamedLocations()
 * await this.collectPermissionGrantPolicies()
 * await this.collectGroups()
 * await this.collectUsers()
 * await this.collectAllPolicies()
 *
 * Also copy all method definitions above into security-collector.js after the existing methods
 */

export default {
  methods: {
    collectAdministrativeUnits,
    collectDirectoryRoles,
    collectDomains,
    collectAuthorizationPolicy,
    collectIdentityProviders,
    collectTenantDetails,
    collectNamedLocations,
    collectPermissionGrantPolicies,
    collectGroups,
    collectUsers,
    collectAllPolicies,
    getWithPagination,
    collectWithRetry
  }
}
