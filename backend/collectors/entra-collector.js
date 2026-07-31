/**
 * Entra (Azure AD) Collector
 * Collects identity and access management data
 * Feeds 120+ identity security controls
 *
 * API Calls: 15-25 per full collection
 * Delta Queries: Supported (significant savings on incremental)
 */

import { BaseCollector } from '../lib/base-collector.js'

export class EntraCollector extends BaseCollector {
  constructor(deltaHelper) {
    super('EntraCollector', { supportsDelta: true, deltaHelper })
  }

  /**
   * Full collection of all Entra/AAD data
   */
  async collect(graphClient, tenantId) {
    this.startTimer()
    console.log('📥 Starting Entra collection...')

    try {
      // Collect all data in parallel
      const [
        users,
        groups,
        directoryRoles,
        roleAssignments,
        policies,
        riskyUsers,
        auditLogs,
        signInLogs,
        passwordPolicy,
        mfaConfig,
        securityDefaults,
        conditionalAccessPolicies,
        applications,
        servicePrincipals
      ] = await Promise.allSettled([
        this.getUsers(graphClient),
        this.getGroups(graphClient),
        this.getDirectoryRoles(graphClient),
        this.getRoleAssignments(graphClient),
        this.getPolicies(graphClient),
        this.getRiskyUsers(graphClient),
        this.getAuditLogs(graphClient),
        this.getSignInLogs(graphClient),
        this.getPasswordPolicy(graphClient),
        this.getMFAConfiguration(graphClient),
        this.getSecurityDefaults(graphClient),
        this.getConditionalAccessPolicies(graphClient),
        this.getApplications(graphClient),
        this.getServicePrincipals(graphClient)
      ])

      // Normalize data
      const data = {
        users: this.normalizeResult(users),
        groups: this.normalizeResult(groups),
        directoryRoles: this.normalizeResult(directoryRoles),
        roleAssignments: this.normalizeResult(roleAssignments),
        policies: this.normalizeResult(policies),
        riskyUsers: this.normalizeResult(riskyUsers),
        auditLogs: this.normalizeResult(auditLogs),
        signInLogs: this.normalizeResult(signInLogs),
        passwordPolicy: this.normalizeResult(passwordPolicy),
        mfaConfig: this.normalizeResult(mfaConfig),
        securityDefaults: this.normalizeResult(securityDefaults),
        conditionalAccessPolicies: this.normalizeResult(conditionalAccessPolicies),
        applications: this.normalizeResult(applications),
        servicePrincipals: this.normalizeResult(servicePrincipals),
        tenantId,
        collectedAt: new Date().toISOString(),
        apiCallCount: this.apiCallCount
      }

      // Record stats
      this.recordDataSize(data)
      this.logSummary()

      return data
    } catch (err) {
      console.error('❌ Entra collection failed:', err.message)
      throw err
    }
  }

  /**
   * Incremental collection using delta queries
   */
  async delta(graphClient, tenantId, deltaToken) {
    console.log('⚡ Starting Entra incremental sync...')

    try {
      const changes = {
        users: await this.deltaHelper.getDeltaPaginated('/users', { trackToken: true }),
        groups: await this.deltaHelper.getDeltaPaginated('/groups', { trackToken: true }),
        riskyUsers: await this.deltaHelper.getDeltaPaginated('/identityProtection/riskyUsers', { trackToken: true }),
        signInLogs: await this.deltaHelper.getDeltaPaginated('/auditLogs/signIns', { trackToken: true }),
        changes: 0,
        apiCallCount: 4
      }

      changes.changes =
        (changes.users.itemCount || 0) +
        (changes.groups.itemCount || 0) +
        (changes.riskyUsers.itemCount || 0) +
        (changes.signInLogs.itemCount || 0)

      return changes
    } catch (err) {
      console.error('❌ Entra incremental sync failed:', err.message)
      throw err
    }
  }

  /**
   * Get all users
   */
  async getUsers(graphClient) {
    return this.getPaginatedData(graphClient, '/users', {
      select: 'id,displayName,userPrincipalName,userType,accountEnabled,createdDateTime,lastSignInDateTime,mail,mobilePhone,jobTitle,department'
    })
  }

  /**
   * Get all groups
   */
  async getGroups(graphClient) {
    return this.getPaginatedData(graphClient, '/groups', {
      select: 'id,displayName,groupTypes,mailEnabled,securityEnabled,createdDateTime,members'
    })
  }

  /**
   * Get directory roles
   */
  async getDirectoryRoles(graphClient) {
    return this.getPaginatedData(graphClient, '/directoryRoles', {
      select: 'id,displayName,description'
    })
  }

  /**
   * Get role assignments
   */
  async getRoleAssignments(graphClient) {
    return this.getPaginatedData(graphClient, '/roleManagement/directory/roleAssignments', {
      select: 'id,roleDefinitionId,principalId,resourceScope'
    })
  }

  /**
   * Get policies
   */
  async getPolicies(graphClient) {
    const [authPolicy, identityPolicy] = await Promise.allSettled([
      this.queryGraph(graphClient, '/policies/authorizationPolicy'),
      this.queryGraph(graphClient, '/policies/identitySecurityDefaultsEnforcementPolicy')
    ])

    return {
      authorizationPolicy: this.normalizeResult(authPolicy),
      identitySecurityDefaults: this.normalizeResult(identityPolicy)
    }
  }

  /**
   * Get risky users
   */
  async getRiskyUsers(graphClient) {
    return this.getPaginatedData(graphClient, '/identityProtection/riskyUsers', {
      select: 'id,userDisplayName,userPrincipalName,riskLevel,riskState,riskDetail'
    })
  }

  /**
   * Get audit logs
   */
  async getAuditLogs(graphClient) {
    return this.getPaginatedData(graphClient, '/auditLogs/directoryAudits', {
      filter: `activityDateTime gt ${this.getDateHoursAgo(24)}`,
      select: 'id,displayName,category,activityDateTime,result,initiatedBy,targetResources',
      top: 100
    })
  }

  /**
   * Get sign-in logs
   */
  async getSignInLogs(graphClient) {
    return this.getPaginatedData(graphClient, '/auditLogs/signIns', {
      filter: `createdDateTime gt ${this.getDateHoursAgo(24)}`,
      select: 'id,userPrincipalName,userDisplayName,createdDateTime,status,riskLevel,clientAppUsed,deviceDetail',
      top: 100
    })
  }

  /**
   * Get password policy
   */
  async getPasswordPolicy(graphClient) {
    return this.queryGraph(graphClient, '/policies/identitySecurityDefaultsEnforcementPolicy')
  }

  /**
   * Get MFA configuration
   */
  async getMFAConfiguration(graphClient) {
    const [authMethods, policies] = await Promise.allSettled([
      this.queryGraph(graphClient, '/policies/authenticationMethodsPolicy'),
      this.queryGraph(graphClient, '/policies/conditionalAccessPolicies')
    ])

    return {
      authMethods: this.normalizeResult(authMethods),
      policies: this.normalizeResult(policies)
    }
  }

  /**
   * Get security defaults
   */
  async getSecurityDefaults(graphClient) {
    return this.queryGraph(graphClient, '/policies/identitySecurityDefaultsEnforcementPolicy')
  }

  /**
   * Get conditional access policies
   */
  async getConditionalAccessPolicies(graphClient) {
    return this.getPaginatedData(graphClient, '/identity/conditionalAccess/policies', {
      select: 'id,displayName,state,conditions,grantControls,sessionControls'
    })
  }

  /**
   * Get applications
   */
  async getApplications(graphClient) {
    return this.getPaginatedData(graphClient, '/applications', {
      select: 'id,appId,displayName,createdDateTime,publisherDomain,signInAudience'
    })
  }

  /**
   * Get service principals
   */
  async getServicePrincipals(graphClient) {
    return this.getPaginatedData(graphClient, '/servicePrincipals', {
      select: 'id,appId,displayName,servicePrincipalType,createdDateTime,accountEnabled'
    })
  }

  /**
   * Normalize API result (handle errors)
   */
  normalizeResult(result) {
    if (result.status === 'fulfilled') {
      return result.value || []
    }
    console.warn('API call failed:', result.reason?.message)
    return []
  }

  /**
   * Get date N hours ago (for audit log filtering)
   */
  getDateHoursAgo(hours) {
    const date = new Date()
    date.setHours(date.getHours() - hours)
    return date.toISOString()
  }

  /**
   * Normalize data for storage
   */
  normalize(rawData) {
    return {
      ...rawData,
      normalized: true,
      version: '1.0'
    }
  }
}

export default EntraCollector
