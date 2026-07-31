/**
 * Microsoft Fabric Collector
 * Collects Fabric workspace, security, and data governance settings
 * Feeds 100+ Fabric security controls
 *
 * API Calls: 12-18 per full collection
 * Delta Queries: Supported
 */

import { BaseCollector } from '../lib/base-collector.js'

export class FabricCollector extends BaseCollector {
  constructor(deltaHelper) {
    super('FabricCollector', { supportsDelta: true, deltaHelper })
  }

  /**
   * Full collection of all Fabric data
   */
  async collect(graphClient, tenantId) {
    this.startTime = Date.now()
    console.log('📥 Starting Microsoft Fabric collection...')

    try {
      // Collect all data in parallel
      const [
        tenantSettings,
        workspaces,
        capacities,
        datamarts,
        datasets,
        reports,
        dashboards,
        gateways,
        dataFlows,
        securityRoles,
        auditLogs,
        labelingPolicy,
        dataClassification
      ] = await Promise.allSettled([
        this.getTenantSettings(graphClient),
        this.getWorkspaces(graphClient),
        this.getCapacities(graphClient),
        this.getDatamarts(graphClient),
        this.getDatasets(graphClient),
        this.getReports(graphClient),
        this.getDashboards(graphClient),
        this.getGateways(graphClient),
        this.getDataFlows(graphClient),
        this.getSecurityRoles(graphClient),
        this.getAuditLogs(graphClient),
        this.getLabelingPolicy(graphClient),
        this.getDataClassification(graphClient)
      ])

      const data = this.normalizeResults({
        tenantSettings: tenantSettings.status === 'fulfilled' ? tenantSettings.value : {},
        workspaces: workspaces.status === 'fulfilled' ? workspaces.value : [],
        capacities: capacities.status === 'fulfilled' ? capacities.value : [],
        datamarts: datamarts.status === 'fulfilled' ? datamarts.value : [],
        datasets: datasets.status === 'fulfilled' ? datasets.value : [],
        reports: reports.status === 'fulfilled' ? reports.value : [],
        dashboards: dashboards.status === 'fulfilled' ? dashboards.value : [],
        gateways: gateways.status === 'fulfilled' ? gateways.value : [],
        dataFlows: dataFlows.status === 'fulfilled' ? dataFlows.value : [],
        securityRoles: securityRoles.status === 'fulfilled' ? securityRoles.value : [],
        auditLogs: auditLogs.status === 'fulfilled' ? auditLogs.value : [],
        labelingPolicy: labelingPolicy.status === 'fulfilled' ? labelingPolicy.value : {},
        dataClassification: dataClassification.status === 'fulfilled' ? dataClassification.value : {}
      })

      const duration = Date.now() - this.startTime
      console.log(`  ✅ FabricCollector: ${JSON.stringify(data).length} bytes (${duration}ms, ${this.apiCallCount} API calls)`)

      return data
    } catch (err) {
      console.error('  ❌ FabricCollector failed:', err.message)
      throw err
    }
  }

  /**
   * Delta collection for Fabric
   */
  async delta(graphClient, tenantId, deltaToken) {
    console.log('📥 Starting Microsoft Fabric incremental sync...')
    try {
      const endpoints = [
        '/admin/powerbi/workspaces',
        '/admin/powerbi/capacities',
        '/admin/powerbi/datasets'
      ]

      const changes = {}
      for (const endpoint of endpoints) {
        try {
          const result = await this.deltaHelper.getDelta(endpoint)
          changes[endpoint] = result
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

  async getTenantSettings(graphClient) {
    try {
      return await graphClient.api('/admin/powerbi/tenantSettings').get()
    } catch (err) {
      console.warn('Failed to get Fabric tenant settings:', err.message)
      return {}
    }
  }

  async getWorkspaces(graphClient) {
    try {
      const response = await graphClient.api('/admin/powerbi/workspaces').get()
      return this.getPaginatedData(graphClient, '/admin/powerbi/workspaces', response)
    } catch (err) {
      console.warn('Failed to get Fabric workspaces:', err.message)
      return []
    }
  }

  async getCapacities(graphClient) {
    try {
      const response = await graphClient.api('/admin/powerbi/capacities').get()
      return this.getPaginatedData(graphClient, '/admin/powerbi/capacities', response)
    } catch (err) {
      console.warn('Failed to get Fabric capacities:', err.message)
      return []
    }
  }

  async getDatamarts(graphClient) {
    try {
      const response = await graphClient.api('/admin/powerbi/datamarts').get()
      return response.value || []
    } catch (err) {
      console.warn('Failed to get Fabric datamarts:', err.message)
      return []
    }
  }

  async getDatasets(graphClient) {
    try {
      const response = await graphClient.api('/admin/powerbi/datasets').get()
      return this.getPaginatedData(graphClient, '/admin/powerbi/datasets', response)
    } catch (err) {
      console.warn('Failed to get Fabric datasets:', err.message)
      return []
    }
  }

  async getReports(graphClient) {
    try {
      const response = await graphClient.api('/admin/powerbi/reports').get()
      return response.value || []
    } catch (err) {
      console.warn('Failed to get Fabric reports:', err.message)
      return []
    }
  }

  async getDashboards(graphClient) {
    try {
      const response = await graphClient.api('/admin/powerbi/dashboards').get()
      return response.value || []
    } catch (err) {
      console.warn('Failed to get Fabric dashboards:', err.message)
      return []
    }
  }

  async getGateways(graphClient) {
    try {
      const response = await graphClient.api('/admin/powerbi/gateways').get()
      return response.value || []
    } catch (err) {
      console.warn('Failed to get Fabric gateways:', err.message)
      return []
    }
  }

  async getDataFlows(graphClient) {
    try {
      const response = await graphClient.api('/admin/powerbi/dataflows').get()
      return response.value || []
    } catch (err) {
      console.warn('Failed to get Fabric dataflows:', err.message)
      return []
    }
  }

  async getSecurityRoles(graphClient) {
    try {
      const response = await graphClient.api('/admin/powerbi/securityRoles').get()
      return response.value || []
    } catch (err) {
      console.warn('Failed to get Fabric security roles:', err.message)
      return []
    }
  }

  async getAuditLogs(graphClient) {
    try {
      const response = await graphClient.api('/admin/powerbi/auditLogs').get()
      return response.value || []
    } catch (err) {
      console.warn('Failed to get Fabric audit logs:', err.message)
      return []
    }
  }

  async getLabelingPolicy(graphClient) {
    try {
      return await graphClient.api('/admin/powerbi/labelingPolicy').get()
    } catch (err) {
      console.warn('Failed to get Fabric labeling policy:', err.message)
      return {}
    }
  }

  async getDataClassification(graphClient) {
    try {
      return await graphClient.api('/admin/powerbi/dataClassification').get()
    } catch (err) {
      console.warn('Failed to get Fabric data classification:', err.message)
      return {}
    }
  }

  normalizeResults(results) {
    return {
      tenantSettings: results.tenantSettings || {},
      workspaces: results.workspaces || [],
      capacities: results.capacities || [],
      datamarts: results.datamarts || [],
      datasets: results.datasets || [],
      reports: results.reports || [],
      dashboards: results.dashboards || [],
      gateways: results.gateways || [],
      dataFlows: results.dataFlows || [],
      securityRoles: results.securityRoles || [],
      auditLogs: results.auditLogs || [],
      labelingPolicy: results.labelingPolicy || {},
      dataClassification: results.dataClassification || {},
      collectionTime: new Date().toISOString(),
      apiCallCount: this.apiCallCount
    }
  }
}
