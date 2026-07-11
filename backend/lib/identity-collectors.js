/**
 * Identity Security Data Collectors
 *
 * Optimized module-based collectors for Identity controls
 * Fetches Graph API data once and distributes across multiple controls
 */

import { unifiedGraphClient } from './graph-client-unified.js'

export class IdentityCollectors {
  constructor() {
    this.cache = {}
  }

  /**
   * Authentication Methods Report Collector
   * Covers: ID-001, ID-002, ID-004
   */
  async collectAuthenticationMethods() {
    if (this.cache.authMethods) return this.cache.authMethods

    try {
      const response = await unifiedGraphClient.get('/reports/authenticationMethods/userRegistrationDetails')
      const details = response.value || []

      const data = {
        all: details,
        total: details.length,
        mfaRegistered: details.filter(u => u.isMfaRegistered).length,
        mfaCapable: details.filter(u => u.isMfaCapable).length,
        ssprRegistered: details.filter(u => u.isSsprRegistered).length,
        passwordless: details.filter(u => {
          const methods = u.methodsRegistered || []
          return methods.includes('fido2') ||
                 methods.includes('windowsHello') ||
                 methods.includes('microsoftAuthenticator')
        }).length,
        mfaCoverage: details.length > 0 ? Math.round((details.filter(u => u.isMfaRegistered).length / details.length) * 100) : 0,
        byMethod: {
          fido2: details.filter(u => u.methodsRegistered?.includes('fido2')).length,
          windowsHello: details.filter(u => u.methodsRegistered?.includes('windowsHello')).length,
          authenticator: details.filter(u => u.methodsRegistered?.includes('microsoftAuthenticator')).length
        },
        timestamp: new Date().toISOString()
      }

      this.cache.authMethods = data
      return data
    } catch (e) {
      console.warn('⚠️ Authentication Methods collection failed:', e.message)
      return { all: [], error: e.message }
    }
  }

  /**
   * Conditional Access Policies Collector
   * Covers: ID-005, ID-006, ID-013-018, etc.
   */
  async collectConditionalAccess() {
    if (this.cache.conditionalAccess) return this.cache.conditionalAccess

    try {
      const response = await unifiedGraphClient.get('/beta/identity/conditionalAccess/policies')
      const policies = response.value || []

      const data = {
        all: policies,
        enabled: policies.filter(p => p.state === 'enabled'),
        total: policies.length,
        byType: {
          mfaRequired: policies.find(p =>
            p.state === 'enabled' &&
            p.grantControls?.builtInControls?.includes('mfa') &&
            p.conditions?.users?.includeUsers?.includes('All')
          ),
          adminMFA: policies.find(p =>
            p.state === 'enabled' &&
            (p.conditions?.includeRoles || []).some(r =>
              typeof r === 'string' && (r.includes('Global') || r.includes('Privileged'))
            ) &&
            p.grantControls?.authenticationStrength?.displayName?.includes('Phishing Resistant')
          ),
          phishingResistant: policies.find(p =>
            p.state === 'enabled' &&
            p.grantControls?.authenticationStrength?.displayName?.toLowerCase().includes('phishing resistant')
          ),
          tokenProtection: policies.find(p =>
            p.state === 'enabled' &&
            p.sessionControls?.tokenProtection?.isEnabled === true
          ),
          userRisk: policies.find(p =>
            p.state === 'enabled' &&
            p.conditions?.userRiskLevels?.includes('high')
          ),
          signInRisk: policies.find(p =>
            p.state === 'enabled' &&
            p.conditions?.signInRiskLevels?.includes('high')
          ),
          blockLegacy: policies.find(p =>
            p.state === 'enabled' &&
            p.conditions?.clientAppTypes?.some(app => app === 'exchangeActiveSync' || app === 'other')
          ),
          compliantDevice: policies.find(p =>
            p.state === 'enabled' &&
            p.grantControls?.builtInControls?.includes('compliantDevice')
          )
        },
        timestamp: new Date().toISOString()
      }

      this.cache.conditionalAccess = data
      return data
    } catch (e) {
      console.warn('⚠️ Conditional Access collection failed:', e.message)
      return { all: [], byType: {}, error: e.message }
    }
  }

  /**
   * Directory Roles Collector
   * Covers: ID-001, ID-011, ID-022, ID-031, ID-032
   */
  async collectDirectoryRoles() {
    if (this.cache.roles) return this.cache.roles

    try {
      // Use stable roleTemplateId for Global Admins — works even if role isn't activated
      const GLOBAL_ADMIN_TEMPLATE_ID = '62e90394-69f5-4237-9190-012177145e10'

      const [globalAdminResponse, rolesResponse] = await Promise.all([
        unifiedGraphClient.get(
          `/directoryRoles/roleTemplateId=${GLOBAL_ADMIN_TEMPLATE_ID}/members?$select=id,userPrincipalName,displayName`
        ),
        unifiedGraphClient.get('/directoryRoles')
      ])

      const roles = rolesResponse.value || []
      const globalAdmins = globalAdminResponse.value || []

      // Fetch Tenant Creator members separately using dynamic role ID (less critical)
      let tenantCreators = []
      try {
        const tenantCreatorRole = roles.find(r => r.displayName === 'Tenant Creator')
        if (tenantCreatorRole) {
          const tcResponse = await unifiedGraphClient.get(
            `/directoryRoles/${tenantCreatorRole.id}/members?$select=id,userPrincipalName,displayName`
          )
          tenantCreators = tcResponse.value || []
        }
      } catch (e) {
        console.warn('⚠️ Could not fetch Tenant Creator members:', e.message)
      }

      const data = {
        allRoles: roles,
        globalAdmins,
        globalAdminCount: globalAdmins.length,
        tenantCreators,
        tenantCreatorCount: tenantCreators.length,
        timestamp: new Date().toISOString()
      }

      this.cache.roles = data
      return data
    } catch (e) {
      console.warn('⚠️ Directory Roles collection failed:', e.message)
      return { allRoles: [], globalAdmins: [], tenantCreators: [], error: e.message }
    }
  }

  /**
   * Authorization Policy Collector
   * Covers: ID-020, ID-023, ID-035, ID-036
   */
  async collectAuthorizationPolicy() {
    if (this.cache.authPolicy) return this.cache.authPolicy

    try {
      const response = await unifiedGraphClient.get('/policies/authorizationPolicy')

      const data = {
        policy: response,
        allowInvitesFrom: response.allowInvitesFrom,
        guestUserRoleId: response.guestUserRoleId,
        isGuestInviteRestricted: response.allowInvitesFrom === 'adminsAndGuestInviters' || response.allowInvitesFrom === 'none',
        hasGuestRestrictions: !!response.guestUserRoleId,
        timestamp: new Date().toISOString()
      }

      this.cache.authPolicy = data
      return data
    } catch (e) {
      console.warn('⚠️ Authorization Policy collection failed:', e.message)
      return { policy: {}, error: e.message }
    }
  }

  /**
   * Cross-Tenant Access Policy Collector
   * Covers: ID-021, ID-034, ID-037
   */
  async collectCrossTenantAccess() {
    if (this.cache.crossTenant) return this.cache.crossTenant

    try {
      const [v1Response, betaResponse] = await Promise.all([
        unifiedGraphClient.get('/policies/crossTenantAccessPolicy').catch(e => ({ error: e.message })),
        unifiedGraphClient.get('/beta/policies/crossTenantAccessPolicy').catch(e => ({ error: e.message }))
      ])

      const data = {
        v1: v1Response,
        beta: betaResponse,
        hasPolicy: !!v1Response && !v1Response.error,
        hasBetaPolicy: !!betaResponse && !betaResponse.error,
        inboundPolicy: v1Response?.inboundPolicy,
        outboundPolicy: v1Response?.outboundPolicy,
        timestamp: new Date().toISOString()
      }

      this.cache.crossTenant = data
      return data
    } catch (e) {
      console.warn('⚠️ Cross-Tenant Access collection failed:', e.message)
      return { v1: {}, beta: {}, error: e.message }
    }
  }

  /**
   * Terms and Conditions Collector
   * Covers: ID-020, ID-033
   */
  async collectTermsAndConditions() {
    if (this.cache.termsAndConditions) return this.cache.termsAndConditions

    try {
      const response = await unifiedGraphClient.get('/deviceManagement/termsAndConditions')
      const policies = response.value || []

      const data = {
        all: policies,
        total: policies.length,
        published: policies.filter(p => p.published === true).length,
        timestamp: new Date().toISOString()
      }

      this.cache.termsAndConditions = data
      return data
    } catch (e) {
      console.warn('⚠️ Terms and Conditions collection failed:', e.message)
      return { all: [], error: e.message }
    }
  }

  /**
   * Collect all Identity data
   */
  async collectAll() {
    console.log('📊 Starting Identity security data collection...')
    const startTime = Date.now()

    const [authMethods, conditionalAccess, roles, authPolicy, crossTenant, termsAndConditions] = await Promise.all([
      this.collectAuthenticationMethods(),
      this.collectConditionalAccess(),
      this.collectDirectoryRoles(),
      this.collectAuthorizationPolicy(),
      this.collectCrossTenantAccess(),
      this.collectTermsAndConditions()
    ])

    const duration = Date.now() - startTime
    console.log(`✅ Identity data collection complete in ${duration}ms`)

    return {
      authenticationMethods: authMethods,
      conditionalAccess,
      directoryRoles: roles,
      authorizationPolicy: authPolicy,
      crossTenantAccess: crossTenant,
      termsAndConditions,
      duration,
      timestamp: new Date().toISOString()
    }
  }

  /**
   * Clear cache
   */
  clearCache() {
    this.cache = {}
  }

  /**
   * Get cache status
   */
  getCacheStatus() {
    return {
      cached: Object.keys(this.cache),
      count: Object.keys(this.cache).length,
      timestamp: new Date().toISOString()
    }
  }
}

export default IdentityCollectors
