/**
 * Intune Collector
 * Collects device management and compliance data
 * Feeds 110+ intune/device controls
 *
 * API Calls: 10-15 per collection
 */

import { BaseCollector } from '../lib/base-collector.js'

export class IntuneCollector extends BaseCollector {
  constructor(deltaHelper) {
    super('IntuneCollector', { supportsDelta: true, deltaHelper })
  }

  async collect(graphClient, tenantId) {
    this.startTimer()
    console.log('📥 Starting Intune collection...')

    try {
      const [
        devices,
        compliancePolicies,
        configurations,
        enrollmentRestrictions,
        deviceEnrollmentConfigs,
        complianceSettings,
        protectionPolicies
      ] = await Promise.allSettled([
        this.getDevices(graphClient),
        this.getCompliancePolicies(graphClient),
        this.getDeviceConfigurations(graphClient),
        this.getEnrollmentRestrictions(graphClient),
        this.getDeviceEnrollmentConfigs(graphClient),
        this.getComplianceSettings(graphClient),
        this.getProtectionPolicies(graphClient)
      ])

      const data = {
        devices: this.normalizeResult(devices),
        compliancePolicies: this.normalizeResult(compliancePolicies),
        configurations: this.normalizeResult(configurations),
        enrollmentRestrictions: this.normalizeResult(enrollmentRestrictions),
        deviceEnrollmentConfigs: this.normalizeResult(deviceEnrollmentConfigs),
        complianceSettings: this.normalizeResult(complianceSettings),
        protectionPolicies: this.normalizeResult(protectionPolicies),
        tenantId,
        collectedAt: new Date().toISOString(),
        apiCallCount: this.apiCallCount
      }

      this.recordDataSize(data)
      this.logSummary()

      return data
    } catch (err) {
      console.error('❌ Intune collection failed:', err.message)
      throw err
    }
  }

  async delta(graphClient, tenantId, deltaToken) {
    console.log('⚡ Starting Intune incremental sync...')

    try {
      const changes = {
        devices: await this.deltaHelper.getDeltaPaginated('/deviceManagement/managedDevices', { trackToken: true }),
        policies: await this.deltaHelper.getDeltaPaginated('/deviceManagement/deviceCompliancePolicies', { trackToken: true }),
        changes: 0,
        apiCallCount: 2
      }

      changes.changes = (changes.devices.itemCount || 0) + (changes.policies.itemCount || 0)

      return changes
    } catch (err) {
      console.error('❌ Incremental sync failed:', err.message)
      throw err
    }
  }

  async getDevices(graphClient) {
    return this.getPaginatedData(graphClient, '/deviceManagement/managedDevices', {
      select: 'id,deviceName,managedDeviceOwnerType,enrolledDateTime,lastSyncDateTime,complianceState,osVersion'
    })
  }

  async getCompliancePolicies(graphClient) {
    return this.getPaginatedData(graphClient, '/deviceManagement/deviceCompliancePolicies', {
      select: 'id,displayName,createdDateTime,lastModifiedDateTime'
    })
  }

  async getDeviceConfigurations(graphClient) {
    return this.getPaginatedData(graphClient, '/deviceManagement/deviceConfigurations', {
      select: 'id,displayName,createdDateTime,lastModifiedDateTime'
    })
  }

  async getEnrollmentRestrictions(graphClient) {
    return this.queryGraph(graphClient, '/deviceManagement/deviceEnrollmentConfigurations')
  }

  async getDeviceEnrollmentConfigs(graphClient) {
    return this.getPaginatedData(graphClient, '/deviceManagement/deviceEnrollmentConfigurations', {
      select: 'id,displayName,createdDateTime'
    })
  }

  async getComplianceSettings(graphClient) {
    return this.queryGraph(graphClient, '/deviceManagement/complianceSettings')
  }

  async getProtectionPolicies(graphClient) {
    return this.queryGraph(graphClient, '/deviceManagement/windowsInformationProtectionPolicies')
  }

  normalizeResult(result) {
    if (result.status === 'fulfilled') return result.value || []
    return []
  }

  normalize(rawData) {
    return { ...rawData, normalized: true, version: '1.0' }
  }
}

export default IntuneCollector
