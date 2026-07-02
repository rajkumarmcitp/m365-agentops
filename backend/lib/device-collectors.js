/**
 * Device Security Data Collectors
 *
 * Optimized module-based collectors that fetch Graph API data once
 * and distribute results across multiple controls, reducing API calls
 * and improving validation performance.
 *
 * Uses centralized UnifiedGraphClient for all Graph API calls (Phase 5).
 */

import { unifiedGraphClient } from './graph-client-unified.js'

export class DeviceCollectors {
  constructor() {
    this.cache = {}
  }

  /**
   * Conditional Access Collector
   * Covers: DEV-012, and CA-based device controls
   */
  async collectConditionalAccess() {
    if (this.cache.conditionalAccess) return this.cache.conditionalAccess

    try {
      const response = await unifiedGraphClient.get('/identity/conditionalAccess/policies')
      const policies = response.value || []

      const data = {
        all: policies,
        enabled: policies.filter(p => p.state === 'enabled'),
        requiresCompliantDevice: policies.find(p =>
          p.state === 'enabled' &&
          p.grantControls?.builtInControls?.includes('compliantDevice')
        ),
        requiresMFA: policies.find(p =>
          p.state === 'enabled' &&
          p.grantControls?.builtInControls?.includes('mfa')
        ),
        blockLegacy: policies.find(p =>
          p.state === 'enabled' &&
          p.conditions?.clientAppTypes?.some(app => app === 'exchangeActiveSync' || app === 'other') &&
          p.grantControls?.builtInControls?.includes('block')
        ),
        timestamp: new Date().toISOString()
      }

      this.cache.conditionalAccess = data
      return data
    } catch (e) {
      console.warn('⚠️ Conditional Access collection failed:', e.message)
      return { all: [], error: e.message }
    }
  }

  /**
   * Compliance Collector
   * Covers: DEV-002, DEV-003, DEV-006, DEV-007, DEV-008, DEV-009, DEV-022
   */
  async collectCompliancePolicies() {
    if (this.cache.compliance) return this.cache.compliance

    try {
      const response = await unifiedGraphClient.get('/deviceManagement/deviceCompliancePolicies')
      const policies = response.value || []

      const data = {
        all: policies,
        total: policies.length,
        byPlatform: {
          windows: policies.filter(p => p.platform === 'windows'),
          android: policies.filter(p => p.platform === 'android'),
          ios: policies.filter(p => p.platform === 'iOS'),
          macos: policies.filter(p => p.platform === 'macOS')
        },
        encryption: policies.find(p =>
          p.displayName?.toLowerCase().includes('bitlocker') ||
          p.displayName?.toLowerCase().includes('encryption')
        ),
        defender: policies.find(p =>
          p.displayName?.toLowerCase().includes('defender') ||
          p.displayName?.toLowerCase().includes('antivirus')
        ),
        androidEnterprise: policies.find(p =>
          p.platform === 'android' &&
          (p.displayName?.toLowerCase().includes('work profile') ||
           p.displayName?.toLowerCase().includes('enterprise'))
        ),
        enabled: policies.filter(p => !p.isScheduledActionPending).length,
        timestamp: new Date().toISOString()
      }

      this.cache.compliance = data
      return data
    } catch (e) {
      console.warn('⚠️ Compliance Collector failed:', e.message)
      return { all: [], byPlatform: {}, error: e.message }
    }
  }

  /**
   * Configuration Collector
   * Covers: DEV-013 through DEV-018, DEV-023 through DEV-025
   */
  async collectConfigurationPolicies() {
    if (this.cache.configuration) return this.cache.configuration

    try {
      const response = await unifiedGraphClient.get('/deviceManagement/configurationPolicies')
      const policies = response.value || []

      const data = {
        all: policies,
        total: policies.length,
        securityBaselines: policies.filter(p =>
          p.name?.toLowerCase().includes('baseline') ||
          p.templateId?.includes('securityBaseline')
        ),
        windowsHello: policies.find(p =>
          p.name?.toLowerCase().includes('windows hello')
        ),
        firewall: policies.find(p =>
          p.name?.toLowerCase().includes('firewall')
        ),
        bitlocker: policies.find(p =>
          p.name?.toLowerCase().includes('bitlocker') ||
          p.name?.toLowerCase().includes('encryption')
        ),
        defenderAV: policies.find(p =>
          p.name?.toLowerCase().includes('defender antivirus') ||
          p.name?.toLowerCase().includes('microsoft defender')
        ),
        asr: policies.find(p =>
          p.name?.toLowerCase().includes('attack surface') ||
          p.name?.toLowerCase().includes('asr')
        ),
        fileVault: policies.find(p =>
          p.name?.toLowerCase().includes('filevault')
        ),
        windowsLAPS: policies.find(p =>
          p.name?.toLowerCase().includes('windows') &&
          p.name?.toLowerCase().includes('laps')
        ),
        macosLAPS: policies.find(p =>
          p.name?.toLowerCase().includes('macos') &&
          p.name?.toLowerCase().includes('laps')
        ),
        timestamp: new Date().toISOString()
      }

      this.cache.configuration = data
      return data
    } catch (e) {
      console.warn('⚠️ Configuration Collector failed:', e.message)
      return { all: [], error: e.message }
    }
  }

  /**
   * Enrollment Collector
   * Covers: DEV-001
   */
  async collectEnrollmentConfigurations() {
    if (this.cache.enrollment) return this.cache.enrollment

    try {
      const response = await unifiedGraphClient.get('/deviceManagement/deviceEnrollmentConfigurations')
      const configs = response.value || []

      const data = {
        all: configs,
        total: configs.length,
        byPlatform: {
          windows: configs.filter(c => c['@odata.type']?.includes('Windows')).length,
          ios: configs.filter(c => c['@odata.type']?.includes('iOS')).length,
          android: configs.filter(c => c['@odata.type']?.includes('Android')).length,
          macos: configs.filter(c => c['@odata.type']?.includes('macOS')).length
        },
        timestamp: new Date().toISOString()
      }

      this.cache.enrollment = data
      return data
    } catch (e) {
      console.warn('⚠️ Enrollment Collector failed:', e.message)
      return { all: [], byPlatform: {}, error: e.message }
    }
  }

  /**
   * App Protection Collector
   * Covers: DEV-010, DEV-011
   */
  async collectAppProtectionPolicies() {
    if (this.cache.appProtection) return this.cache.appProtection

    try {
      const [iosResponse, androidResponse] = await Promise.all([
        unifiedGraphClient.get('/deviceAppManagement/iosManagedAppProtections').catch(e => ({ value: [], error: e.message })),
        unifiedGraphClient.get('/deviceAppManagement/androidManagedAppProtections').catch(e => ({ value: [], error: e.message }))
      ])

      const data = {
        ios: {
          policies: iosResponse.value || [],
          count: iosResponse.value?.length || 0,
          error: iosResponse.error
        },
        android: {
          policies: androidResponse.value || [],
          count: androidResponse.value?.length || 0,
          error: androidResponse.error
        },
        timestamp: new Date().toISOString()
      }

      this.cache.appProtection = data
      return data
    } catch (e) {
      console.warn('⚠️ App Protection Collector failed:', e.message)
      return { ios: { count: 0 }, android: { count: 0 }, error: e.message }
    }
  }

  /**
   * Endpoint Security Collector
   * Covers: DEV-013, MDE configuration
   */
  async collectEndpointSecurity() {
    if (this.cache.endpointSecurity) return this.cache.endpointSecurity

    try {
      const [intentsResponse, mdeResponse] = await Promise.all([
        unifiedGraphClient.get('/deviceManagement/intents').catch(e => ({ value: [], error: e.message })),
        unifiedGraphClient.get('/deviceManagement/windowsDefenderAdvancedThreatProtectionConfigurations').catch(e => ({ value: [], error: e.message }))
      ])

      const intents = intentsResponse.value || []

      const data = {
        intents: intents,
        securityBaselines: intents.filter(i =>
          i.displayName?.toLowerCase().includes('baseline')
        ),
        mde: {
          configured: mdeResponse.value?.length > 0,
          count: mdeResponse.value?.length || 0,
          error: mdeResponse.error
        },
        timestamp: new Date().toISOString()
      }

      this.cache.endpointSecurity = data
      return data
    } catch (e) {
      console.warn('⚠️ Endpoint Security Collector failed:', e.message)
      return { intents: [], mde: { configured: false }, error: e.message }
    }
  }

  /**
   * Administration Collector
   * Covers: DEV-020, DEV-021, and admin settings
   */
  async collectAdministration() {
    if (this.cache.administration) return this.cache.administration

    try {
      const [tagsResponse, tcResponse, analyticsResponse] = await Promise.all([
        unifiedGraphClient.get('/deviceManagement/roleScopeTags').catch(e => ({ value: [], error: e.message })),
        unifiedGraphClient.get('/deviceManagement/termsAndConditions').catch(e => ({ value: [], error: e.message })),
        unifiedGraphClient.get('/deviceManagement/userExperienceAnalyticsSettings').catch(e => ({ error: e.message }))
      ])

      const tags = tagsResponse.value || []
      const tcs = tcResponse.value || []

      const data = {
        scopeTags: {
          all: tags,
          total: tags.length,
          custom: tags.filter(t => t.displayName !== 'Default').length
        },
        termsAndConditions: {
          all: tcs,
          total: tcs.length,
          published: tcs.filter(t => t.published === true).length
        },
        analytics: {
          enabled: !!analyticsResponse.isScheduledReportingEnabled,
          dataCollectionEnabled: analyticsResponse.dataCollectionEnabled,
          error: analyticsResponse.error
        },
        timestamp: new Date().toISOString()
      }

      this.cache.administration = data
      return data
    } catch (e) {
      console.warn('⚠️ Administration Collector failed:', e.message)
      return { scopeTags: { total: 0 }, termsAndConditions: { total: 0 }, analytics: {}, error: e.message }
    }
  }

  /**
   * Collect all device security data
   * Called once per validation run to populate cache
   */
  async collectAll() {
    console.log('📊 Starting Device Security data collection...')
    const startTime = Date.now()

    const [ca, compliance, config, enrollment, appProt, endpoint, admin] = await Promise.all([
      this.collectConditionalAccess(),
      this.collectCompliancePolicies(),
      this.collectConfigurationPolicies(),
      this.collectEnrollmentConfigurations(),
      this.collectAppProtectionPolicies(),
      this.collectEndpointSecurity(),
      this.collectAdministration()
    ])

    const duration = Date.now() - startTime
    console.log(`✅ Device data collection complete in ${duration}ms`)

    return {
      conditionalAccess: ca,
      compliance,
      configuration: config,
      enrollment,
      appProtection: appProt,
      endpointSecurity: endpoint,
      administration: admin,
      duration,
      timestamp: new Date().toISOString()
    }
  }

  /**
   * Clear cache (for testing or manual refresh)
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

export default DeviceCollectors
