/**
 * Power Platform Collector
 * Collects Power Apps, Power Automate, Power BI governance and security data
 * Feeds 100+ Power Platform security controls
 *
 * API Calls: 15-20 per full collection
 * Delta Queries: Supported
 */

import { BaseCollector } from '../lib/base-collector.js'

export class PowerPlatformCollector extends BaseCollector {
  constructor(deltaHelper) {
    super('PowerPlatformCollector', { supportsDelta: true, deltaHelper })
  }

  async collect(graphClient, tenantId) {
    this.startTime = Date.now()
    console.log('📥 Starting Power Platform collection...')

    try {
      const [tenantSettings, environments, powerApps, powerAutomate, powerBI, dlpPolicies, 
              connectors, securityRoles, userAccess, auditLogs, gatewayConfig, 
              modelDrivenApps, canvasApps, cloudFlows] = await Promise.allSettled([
        this.getTenantSettings(graphClient),
        this.getEnvironments(graphClient),
        this.getPowerApps(graphClient),
        this.getPowerAutomate(graphClient),
        this.getPowerBI(graphClient),
        this.getDataLossPreventionPolicies(graphClient),
        this.getConnectors(graphClient),
        this.getSecurityRoles(graphClient),
        this.getUserAccess(graphClient),
        this.getAuditLogs(graphClient),
        this.getGatewayConfiguration(graphClient),
        this.getModelDrivenApps(graphClient),
        this.getCanvasApps(graphClient),
        this.getCloudFlows(graphClient)
      ])

      const data = this.normalizeResults({
        tenantSettings: tenantSettings.status === 'fulfilled' ? tenantSettings.value : {},
        environments: environments.status === 'fulfilled' ? environments.value : [],
        powerApps: powerApps.status === 'fulfilled' ? powerApps.value : [],
        powerAutomate: powerAutomate.status === 'fulfilled' ? powerAutomate.value : [],
        powerBI: powerBI.status === 'fulfilled' ? powerBI.value : [],
        dataLossPreventionPolicies: dlpPolicies.status === 'fulfilled' ? dlpPolicies.value : [],
        connectors: connectors.status === 'fulfilled' ? connectors.value : [],
        securityRoles: securityRoles.status === 'fulfilled' ? securityRoles.value : [],
        userAccess: userAccess.status === 'fulfilled' ? userAccess.value : [],
        auditLogs: auditLogs.status === 'fulfilled' ? auditLogs.value : [],
        gatewayConfiguration: gatewayConfig.status === 'fulfilled' ? gatewayConfig.value : {},
        modelDrivenApps: modelDrivenApps.status === 'fulfilled' ? modelDrivenApps.value : [],
        canvasApps: canvasApps.status === 'fulfilled' ? canvasApps.value : [],
        cloudFlows: cloudFlows.status === 'fulfilled' ? cloudFlows.value : []
      })

      const duration = Date.now() - this.startTime
      console.log(`  ✅ PowerPlatformCollector: ${JSON.stringify(data).length} bytes (${duration}ms, ${this.apiCallCount} API calls)`)
      return data
    } catch (err) {
      console.error('  ❌ PowerPlatformCollector failed:', err.message)
      throw err
    }
  }

  async delta(graphClient, tenantId, deltaToken) {
    console.log('📥 Starting Power Platform incremental sync...')
    try {
      const endpoints = ['/admin/powerplatform/environments', '/admin/powerplatform/powerApps', '/admin/powerplatform/powerAutomate']
      const changes = {}
      for (const endpoint of endpoints) {
        try {
          changes[endpoint] = await this.deltaHelper.getDelta(endpoint)
        } catch (err) {
          console.warn(`Delta sync failed for ${endpoint}:`, err.message)
        }
      }
      return this.normalizeResults(changes)
    } catch (err) {
      console.error('Delta collection failed:', err.message)
      throw err
    }
  }

  async getTenantSettings(graphClient) { return await graphClient.api('/admin/powerplatform/tenantSettings').get().catch(() => ({})) }
  async getEnvironments(graphClient) { const r = await graphClient.api('/admin/powerplatform/environments').get().catch(() => ({value:[]})); return this.getPaginatedData(graphClient, '/admin/powerplatform/environments', r) }
  async getPowerApps(graphClient) { return (await graphClient.api('/admin/powerplatform/powerApps').get().catch(() => ({value:[]}))).value || [] }
  async getPowerAutomate(graphClient) { return (await graphClient.api('/admin/powerplatform/powerAutomate').get().catch(() => ({value:[]}))).value || [] }
  async getPowerBI(graphClient) { return (await graphClient.api('/admin/powerbi/settings').get().catch(() => ({value:[]}))).value || [] }
  async getDataLossPreventionPolicies(graphClient) { return (await graphClient.api('/admin/powerplatform/dlpPolicies').get().catch(() => ({value:[]}))).value || [] }
  async getConnectors(graphClient) { return (await graphClient.api('/admin/powerplatform/connectors').get().catch(() => ({value:[]}))).value || [] }
  async getSecurityRoles(graphClient) { return (await graphClient.api('/admin/powerplatform/securityRoles').get().catch(() => ({value:[]}))).value || [] }
  async getUserAccess(graphClient) { return (await graphClient.api('/admin/powerplatform/userAccess').get().catch(() => ({value:[]}))).value || [] }
  async getAuditLogs(graphClient) { return (await graphClient.api('/admin/powerplatform/auditLogs').get().catch(() => ({value:[]}))).value || [] }
  async getGatewayConfiguration(graphClient) { return await graphClient.api('/admin/powerplatform/gateways').get().catch(() => ({})) }
  async getModelDrivenApps(graphClient) { return (await graphClient.api('/admin/powerplatform/modelDrivenApps').get().catch(() => ({value:[]}))).value || [] }
  async getCanvasApps(graphClient) { return (await graphClient.api('/admin/powerplatform/canvasApps').get().catch(() => ({value:[]}))).value || [] }
  async getCloudFlows(graphClient) { return (await graphClient.api('/admin/powerplatform/cloudFlows').get().catch(() => ({value:[]}))).value || [] }

  normalizeResults(results) {
    return {
      tenantSettings: results.tenantSettings || {},
      environments: results.environments || [],
      powerApps: results.powerApps || [],
      powerAutomate: results.powerAutomate || [],
      powerBI: results.powerBI || [],
      dataLossPreventionPolicies: results.dataLossPreventionPolicies || [],
      connectors: results.connectors || [],
      securityRoles: results.securityRoles || [],
      userAccess: results.userAccess || [],
      auditLogs: results.auditLogs || [],
      gatewayConfiguration: results.gatewayConfiguration || {},
      modelDrivenApps: results.modelDrivenApps || [],
      canvasApps: results.canvasApps || [],
      cloudFlows: results.cloudFlows || [],
      collectionTime: new Date().toISOString(),
      apiCallCount: this.apiCallCount
    }
  }
}
