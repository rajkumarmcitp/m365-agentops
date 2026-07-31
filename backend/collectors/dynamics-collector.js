/**
 * Dynamics 365 Collector
 * Collects Dynamics 365 configuration and security data
 * Feeds 100+ Dynamics 365 security controls
 *
 * API Calls: 10-15 per full collection
 * Delta Queries: Supported
 */

import { BaseCollector } from '../lib/base-collector.js'

export class DynamicsCollector extends BaseCollector {
  constructor(deltaHelper) {
    super('DynamicsCollector', { supportsDelta: true, deltaHelper })
  }

  /**
   * Full collection of all Dynamics 365 data
   */
  async collect(graphClient, tenantId) {
    this.startTimer()
    console.log('📥 Starting Dynamics 365 collection...')

    try {
      // Collect all data in parallel
      const [
        environments,
        instances,
        securityRoles,
        users,
        teams,
        businessUnits,
        auditLogs,
        pluginAssemblies,
        solutions,
        customConnectors
      ] = await Promise.allSettled([
        this.getEnvironments(graphClient),
        this.getInstances(graphClient),
        this.getSecurityRoles(graphClient),
        this.getUsers(graphClient),
        this.getTeams(graphClient),
        this.getBusinessUnits(graphClient),
        this.getAuditLogs(graphClient),
        this.getPluginAssemblies(graphClient),
        this.getSolutions(graphClient),
        this.getCustomConnectors(graphClient)
      ])

      const data = this.normalizeResults({
        environments: environments.status === 'fulfilled' ? environments.value : [],
        instances: instances.status === 'fulfilled' ? instances.value : [],
        securityRoles: securityRoles.status === 'fulfilled' ? securityRoles.value : [],
        users: users.status === 'fulfilled' ? users.value : [],
        teams: teams.status === 'fulfilled' ? teams.value : [],
        businessUnits: businessUnits.status === 'fulfilled' ? businessUnits.value : [],
        auditLogs: auditLogs.status === 'fulfilled' ? auditLogs.value : [],
        pluginAssemblies: pluginAssemblies.status === 'fulfilled' ? pluginAssemblies.value : [],
        solutions: solutions.status === 'fulfilled' ? solutions.value : [],
        customConnectors: customConnectors.status === 'fulfilled' ? customConnectors.value : []
      })

      const duration = Date.now() - this.startTime
      console.log(`  ✅ DynamicsCollector: ${JSON.stringify(data).length} bytes (${duration}ms, ${this.apiCallCount} API calls)`)

      return data
    } catch (err) {
      console.error('  ❌ DynamicsCollector failed:', err.message)
      throw err
    }
  }

  /**
   * Delta collection for Dynamics 365
   */
  async delta(graphClient, tenantId, deltaToken) {
    console.log('📥 Starting Dynamics 365 incremental sync...')
    try {
      const endpoints = [
        '/admin/dynamicscrm/environments',
        '/admin/dynamicscrm/instances',
        '/admin/dynamicscrm/securityRoles'
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

  /**
   * Get Dynamics 365 environments
   */
  async getEnvironments(graphClient) {
    try {
      const response = await graphClient.api('/admin/dynamicscrm/environments').get()
      return this.getPaginatedData(graphClient, '/admin/dynamicscrm/environments', response)
    } catch (err) {
      console.warn('Failed to get Dynamics 365 environments:', err.message)
      return []
    }
  }

  /**
   * Get Dynamics 365 instances
   */
  async getInstances(graphClient) {
    try {
      const response = await graphClient.api('/admin/dynamicscrm/instances').get()
      return this.getPaginatedData(graphClient, '/admin/dynamicscrm/instances', response)
    } catch (err) {
      console.warn('Failed to get Dynamics 365 instances:', err.message)
      return []
    }
  }

  /**
   * Get security roles
   */
  async getSecurityRoles(graphClient) {
    try {
      const response = await graphClient.api('/admin/dynamicscrm/securityRoles').get()
      return this.getPaginatedData(graphClient, '/admin/dynamicscrm/securityRoles', response)
    } catch (err) {
      console.warn('Failed to get security roles:', err.message)
      return []
    }
  }

  /**
   * Get Dynamics users
   */
  async getUsers(graphClient) {
    try {
      const response = await graphClient.api('/admin/dynamicscrm/users').get()
      return this.getPaginatedData(graphClient, '/admin/dynamicscrm/users', response)
    } catch (err) {
      console.warn('Failed to get Dynamics users:', err.message)
      return []
    }
  }

  /**
   * Get Dynamics teams
   */
  async getTeams(graphClient) {
    try {
      const response = await graphClient.api('/admin/dynamicscrm/teams').get()
      return this.getPaginatedData(graphClient, '/admin/dynamicscrm/teams', response)
    } catch (err) {
      console.warn('Failed to get Dynamics teams:', err.message)
      return []
    }
  }

  /**
   * Get business units
   */
  async getBusinessUnits(graphClient) {
    try {
      const response = await graphClient.api('/admin/dynamicscrm/businessUnits').get()
      return this.getPaginatedData(graphClient, '/admin/dynamicscrm/businessUnits', response)
    } catch (err) {
      console.warn('Failed to get business units:', err.message)
      return []
    }
  }

  /**
   * Get audit logs
   */
  async getAuditLogs(graphClient) {
    try {
      const response = await graphClient.api('/admin/dynamicscrm/auditLogs').get()
      return this.getPaginatedData(graphClient, '/admin/dynamicscrm/auditLogs', response)
    } catch (err) {
      console.warn('Failed to get audit logs:', err.message)
      return []
    }
  }

  /**
   * Get plugin assemblies
   */
  async getPluginAssemblies(graphClient) {
    try {
      const response = await graphClient.api('/admin/dynamicscrm/pluginAssemblies').get()
      return this.getPaginatedData(graphClient, '/admin/dynamicscrm/pluginAssemblies', response)
    } catch (err) {
      console.warn('Failed to get plugin assemblies:', err.message)
      return []
    }
  }

  /**
   * Get solutions
   */
  async getSolutions(graphClient) {
    try {
      const response = await graphClient.api('/admin/dynamicscrm/solutions').get()
      return this.getPaginatedData(graphClient, '/admin/dynamicscrm/solutions', response)
    } catch (err) {
      console.warn('Failed to get solutions:', err.message)
      return []
    }
  }

  /**
   * Get custom connectors
   */
  async getCustomConnectors(graphClient) {
    try {
      const response = await graphClient.api('/admin/dynamicscrm/customConnectors').get()
      return this.getPaginatedData(graphClient, '/admin/dynamicscrm/customConnectors', response)
    } catch (err) {
      console.warn('Failed to get custom connectors:', err.message)
      return []
    }
  }

  /**
   * Normalize collected data
   */
  normalizeResults(results) {
    return {
      environments: results.environments || [],
      instances: results.instances || [],
      securityRoles: results.securityRoles || [],
      users: results.users || [],
      teams: results.teams || [],
      businessUnits: results.businessUnits || [],
      auditLogs: results.auditLogs || [],
      pluginAssemblies: results.pluginAssemblies || [],
      solutions: results.solutions || [],
      customConnectors: results.customConnectors || [],
      collectionTime: new Date().toISOString(),
      apiCallCount: this.apiCallCount
    }
  }
}
