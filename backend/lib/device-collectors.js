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
   * Managed Devices Collector
   * Covers: Device inventory, compliance status, sync health, platform distribution
   */
  async collectManagedDevices() {
    if (this.cache.managedDevices) return this.cache.managedDevices

    try {
      const response = await unifiedGraphClient.get('/deviceManagement/managedDevices?$select=id,displayName,deviceName,platform,osVersion,complianceState,lastSyncDateTime,managedDeviceOwnerType,deviceEnrollmentType,isEncrypted,jailBroken')
      const devices = response.value || []

      const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
      const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)

      const data = {
        all: devices,
        total: devices.length,
        byPlatform: {
          windows: devices.filter(d => d.platform === 'Windows').length,
          ios: devices.filter(d => d.platform === 'iOS').length,
          android: devices.filter(d => d.platform === 'Android').length,
          macos: devices.filter(d => d.platform === 'macOS').length
        },
        byCompliance: {
          compliant: devices.filter(d => d.complianceState === 'Compliant').length,
          noncompliant: devices.filter(d => d.complianceState === 'NonCompliant').length,
          unknown: devices.filter(d => !['Compliant', 'NonCompliant'].includes(d.complianceState)).length
        },
        byOwnership: {
          corporate: devices.filter(d => d.managedDeviceOwnerType === 'Company').length,
          personal: devices.filter(d => d.managedDeviceOwnerType === 'Personal').length
        },
        syncHealth: {
          synced7d: devices.filter(d => d.lastSyncDateTime && new Date(d.lastSyncDateTime) > sevenDaysAgo).length,
          synced30d: devices.filter(d => d.lastSyncDateTime && new Date(d.lastSyncDateTime) > thirtyDaysAgo).length,
          stale: devices.filter(d => !d.lastSyncDateTime || new Date(d.lastSyncDateTime) <= thirtyDaysAgo).length
        },
        encryption: {
          encrypted: devices.filter(d => d.isEncrypted === true).length,
          unencrypted: devices.filter(d => d.isEncrypted === false).length
        },
        security: {
          jailbrokenRooted: devices.filter(d => d.jailBroken === true).length
        },
        complianceRate: devices.length > 0
          ? Math.round((devices.filter(d => d.complianceState === 'Compliant').length / devices.length) * 100)
          : 0,
        timestamp: new Date().toISOString()
      }

      this.cache.managedDevices = data
      return data
    } catch (e) {
      console.warn('⚠️ Managed Devices Collector failed:', e.message)
      return { all: [], total: 0, byPlatform: {}, byCompliance: {}, error: e.message }
    }
  }

  /**
   * Compliance Policy Assignments Collector
   * Covers: Assignment status, target groups, deployment metrics
   */
  async collectCompliancePolicyAssignments() {
    if (this.cache.complianceAssignments) return this.cache.complianceAssignments

    try {
      const policiesResponse = await unifiedGraphClient.get('/deviceManagement/deviceCompliancePolicies')
      const policies = policiesResponse.value || []

      const assignmentData = {
        policies: [],
        byPlatform: { windows: [], ios: [], android: [], macos: [] },
        assignmentStatus: {
          assigned: 0,
          unassigned: 0
        }
      }

      for (const policy of policies.slice(0, 20)) { // Limit to avoid excessive API calls
        try {
          const assignResponse = await unifiedGraphClient.get(`/deviceManagement/deviceCompliancePolicies/${policy.id}/assignments`)
          const assignments = assignResponse.value || []

          const policyData = {
            id: policy.id,
            displayName: policy.displayName,
            platform: policy.platform,
            assigned: assignments.length > 0,
            assignmentCount: assignments.length,
            assignments: assignments
          }

          assignmentData.policies.push(policyData)
          if (assignments.length > 0) {
            assignmentData.assignmentStatus.assigned++
          } else {
            assignmentData.assignmentStatus.unassigned++
          }

          if (policy.platform && assignmentData.byPlatform[policy.platform.toLowerCase()]) {
            assignmentData.byPlatform[policy.platform.toLowerCase()].push(policyData)
          }
        } catch (e) {
          console.warn(`⚠️ Failed to get assignments for policy ${policy.id}:`, e.message)
        }
      }

      assignmentData.timestamp = new Date().toISOString()
      this.cache.complianceAssignments = assignmentData
      return assignmentData
    } catch (e) {
      console.warn('⚠️ Compliance Assignment Collector failed:', e.message)
      return { policies: [], assignmentStatus: { assigned: 0, unassigned: 0 }, error: e.message }
    }
  }

  /**
   * Configuration Policy Assignments Collector
   * Covers: Device configuration deployment status
   */
  async collectConfigurationAssignments() {
    if (this.cache.configurationAssignments) return this.cache.configurationAssignments

    try {
      const configResponse = await unifiedGraphClient.get('/deviceManagement/configurationPolicies')
      const configs = configResponse.value || []

      const assignmentData = {
        policies: [],
        assignmentStatus: {
          assigned: 0,
          unassigned: 0
        }
      }

      for (const config of configs.slice(0, 20)) { // Limit to avoid excessive API calls
        try {
          const assignResponse = await unifiedGraphClient.get(`/deviceManagement/configurationPolicies/${config.id}/assignments`)
          const assignments = assignResponse.value || []

          const configData = {
            id: config.id,
            name: config.name,
            assigned: assignments.length > 0,
            assignmentCount: assignments.length
          }

          assignmentData.policies.push(configData)
          if (assignments.length > 0) {
            assignmentData.assignmentStatus.assigned++
          } else {
            assignmentData.assignmentStatus.unassigned++
          }
        } catch (e) {
          console.warn(`⚠️ Failed to get assignments for config ${config.id}:`, e.message)
        }
      }

      assignmentData.timestamp = new Date().toISOString()
      this.cache.configurationAssignments = assignmentData
      return assignmentData
    } catch (e) {
      console.warn('⚠️ Configuration Assignment Collector failed:', e.message)
      return { policies: [], assignmentStatus: { assigned: 0, unassigned: 0 }, error: e.message }
    }
  }

  /**
   * Mobile Device Management Settings Collector
   * Covers: MDM settings, platform-specific policies, device restrictions
   */
  async collectMDMSettings() {
    if (this.cache.mdmSettings) return this.cache.mdmSettings

    try {
      const [androidMdmResponse, iosMdmResponse, macOSMdmResponse, windowsMdmResponse] = await Promise.all([
        unifiedGraphClient.get('/deviceManagement/androidDeviceOwnerEnrollmentProfiles').catch(e => ({ value: [], error: e.message })),
        unifiedGraphClient.get('/deviceManagement/iosEnrollmentConfigurations').catch(e => ({ value: [], error: e.message })),
        unifiedGraphClient.get('/deviceManagement/macOSEnrollmentProfileAssignments').catch(e => ({ value: [], error: e.message })),
        unifiedGraphClient.get('/deviceManagement/windowsEnrollmentConfigurations').catch(e => ({ value: [], error: e.message }))
      ])

      const data = {
        android: {
          enterpriseEnrollment: androidMdmResponse.value?.length > 0,
          count: androidMdmResponse.value?.length || 0,
          error: androidMdmResponse.error
        },
        ios: {
          enrollmentProfiles: iosMdmResponse.value?.length > 0,
          count: iosMdmResponse.value?.length || 0,
          error: iosMdmResponse.error
        },
        macos: {
          enrollmentAssignments: macOSMdmResponse.value?.length > 0,
          count: macOSMdmResponse.value?.length || 0,
          error: macOSMdmResponse.error
        },
        windows: {
          enrollmentConfigs: windowsMdmResponse.value?.length > 0,
          count: windowsMdmResponse.value?.length || 0,
          error: windowsMdmResponse.error
        },
        timestamp: new Date().toISOString()
      }

      this.cache.mdmSettings = data
      return data
    } catch (e) {
      console.warn('⚠️ MDM Settings Collector failed:', e.message)
      return { android: {}, ios: {}, macos: {}, windows: {}, error: e.message }
    }
  }

  /**
   * Collect all device security data
   * Called once per validation run to populate cache
   */
  async collectAll() {
    console.log('📊 Starting Device Security data collection...')
    const startTime = Date.now()

    const [ca, compliance, config, enrollment, appProt, endpoint, admin, managedDevices, complianceAssign, configAssign, mdmSettings] = await Promise.all([
      this.collectConditionalAccess(),
      this.collectCompliancePolicies(),
      this.collectConfigurationPolicies(),
      this.collectEnrollmentConfigurations(),
      this.collectAppProtectionPolicies(),
      this.collectEndpointSecurity(),
      this.collectAdministration(),
      this.collectManagedDevices(),
      this.collectCompliancePolicyAssignments(),
      this.collectConfigurationAssignments(),
      this.collectMDMSettings()
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
      managedDevices,
      complianceAssignments: complianceAssign,
      configurationAssignments: configAssign,
      mdmSettings,
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
