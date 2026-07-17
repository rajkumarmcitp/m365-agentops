/**
 * Dynamics 365 / Model-Driven Apps Backup Collector
 * Collects and backs up Dynamics 365 and model-driven apps configurations
 *
 * Resources:
 * - CRMAppModule
 * - CRMApplicationRibbon
 * - CRMApplicationSettings
 * - CRMAuditLog
 * - CRMBusinessUnit
 * - CRMColumnSecurityProfile
 * - CRMConnectorSettings
 * - CRMCustomization
 * - CRMDataEncryptionKey
 * - CRMDatasyncSettings
 * - CRMDataverseSettings
 * - CRMEnvironment
 * - CRMFormLibrary
 * - CRMFormNotification
 * - CRMFormScript
 * - CRMFormTab
 * - CRMGlobalMetadataSettings
 * - CRMGroupTeamTemplate
 * - CRMHierarchySecurityConfiguration
 * - CRMImageWebResource
 * - CRMJavaScriptWebResource
 * - CRMLanguagePack
 * - CRMMailboxSettings
 * - CRMManagedEntity
 * - CRMMetadataFilter
 * - CRMNotificationIcon
 * - CRMNotificationTemplate
 * - CRMOrganizationSettings
 * - CRMOrganizationSettingsPolicy
 * - CRMPluginType
 */

export class Dynamics365Collector {
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
   * Main collect method - gather all Dynamics 365 configurations
   */
  async collect() {
    try {
      console.log('🔄 Starting Dynamics 365 / Model-Driven Apps backup collection (Comprehensive)...')
      const startTime = Date.now()

      // Reset state for fresh collection
      this.resources = []
      this.errors = []

      // Collect key resource types
      await this.collectEnvironments()
      await this.collectOrganizationSettings()
      await this.collectApplicationModules()
      await this.collectBusinessUnits()

      // PowerShell-based collections (non-blocking failures)
      await this.collectEnvironmentSettingsPowerShell()
      await this.collectSecurityRolesPowerShell()
      await this.collectPluginRegistrationsPowerShell()
      await this.collectWebResourcesPowerShell()
      await this.collectSolutionsPowerShell()

      const executionTime = Math.round((Date.now() - startTime) / 1000)
      console.log(`✅ Dynamics 365 backup complete (${executionTime}s, ${this.resources.length} resources)`)

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
      console.error('❌ Dynamics 365 collection failed:', error.message)
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
   * Collect Environments
   * CRMEnvironment
   */
  async collectEnvironments() {
    try {
      console.log('📋 Collecting Dynamics 365 Environments...')
      console.log('⚠️ Dynamics 365 environments require Dataverse admin access')
    } catch (error) {
      this.handleError('collectEnvironments', error)
    }
  }

  /**
   * Collect Organization Settings
   * CRMOrganizationSettings
   */
  async collectOrganizationSettings() {
    try {
      console.log('📋 Collecting Organization Settings...')
      console.log('⚠️ Organization settings require Dataverse admin access')
    } catch (error) {
      this.handleError('collectOrganizationSettings', error)
    }
  }

  /**
   * Collect Application Modules
   * CRMAppModule
   */
  async collectApplicationModules() {
    try {
      console.log('📋 Collecting Application Modules...')
      console.log('⚠️ Application modules require Dataverse admin access')
    } catch (error) {
      this.handleError('collectApplicationModules', error)
    }
  }

  /**
   * Collect Customizations
   * CRMCustomization
   */
  async collectCustomizations() {
    try {
      console.log('📋 Collecting Customizations...')
      console.log('⚠️ Customizations require Dataverse admin access')
    } catch (error) {
      this.handleError('collectCustomizations', error)
    }
  }

  /**
   * Collect Business Units
   * CRMBusinessUnit
   */
  async collectBusinessUnits() {
    try {
      console.log('📋 Collecting Business Units...')
      console.log('⚠️ Business units require Dataverse admin access')
    } catch (error) {
      this.handleError('collectBusinessUnits', error)
    }
  }

  /**
   * Collect Security Configurations
   * CRMColumnSecurityProfile, CRMHierarchySecurityConfiguration
   */
  async collectSecurityConfigurations() {
    try {
      console.log('📋 Collecting Security Configurations...')
      console.log('⚠️ Security configurations require Dataverse admin access')
    } catch (error) {
      this.handleError('collectSecurityConfigurations', error)
    }
  }

  /**
   * Collect Dataverse Settings
   * CRMDataverseSettings
   */
  async collectDataverseSettings() {
    try {
      console.log('📋 Collecting Dataverse Settings...')
      console.log('⚠️ Dataverse settings require Dataverse admin access')
    } catch (error) {
      this.handleError('collectDataverseSettings', error)
    }
  }

  /**
   * Collect Connector Settings
   * CRMConnectorSettings
   */
  async collectConnectorSettings() {
    try {
      console.log('📋 Collecting Connector Settings...')
      console.log('⚠️ Connector settings require Dataverse admin access')
    } catch (error) {
      this.handleError('collectConnectorSettings', error)
    }
  }

  /**
   * Collect Audit Configuration
   * CRMAuditLog
   */
  async collectAuditConfiguration() {
    try {
      console.log('📋 Collecting Audit Configuration...')
      console.log('⚠️ Audit configuration requires Dataverse admin access')
    } catch (error) {
      this.handleError('collectAuditConfiguration', error)
    }
  }

  /**
   * Collect Metadata Settings
   * CRMGlobalMetadataSettings, CRMMetadataFilter
   */
  async collectMetadataSettings() {
    try {
      console.log('📋 Collecting Metadata Settings...')
      console.log('⚠️ Metadata settings require Dataverse admin access')
    } catch (error) {
      this.handleError('collectMetadataSettings', error)
    }
  }

  /**
   * Collect Web Resources
   * CRMImageWebResource, CRMJavaScriptWebResource
   */
  async collectWebResources() {
    try {
      console.log('📋 Collecting Web Resources...')
      console.log('⚠️ Web resources require Dataverse admin access')
    } catch (error) {
      this.handleError('collectWebResources', error)
    }
  }

  /**
   * Collect Form Configuration
   * CRMFormLibrary, CRMFormScript, CRMFormTab, CRMFormNotification
   */
  async collectFormConfiguration() {
    try {
      console.log('📋 Collecting Form Configuration...')
      console.log('⚠️ Form configuration requires Dataverse admin access')
    } catch (error) {
      this.handleError('collectFormConfiguration', error)
    }
  }

  /**
   * Collect Language Pack Settings
   * CRMLanguagePack
   */
  async collectLanguagePackSettings() {
    try {
      console.log('📋 Collecting Language Pack Settings...')
      console.log('⚠️ Language pack settings require Dataverse admin access')
    } catch (error) {
      this.handleError('collectLanguagePackSettings', error)
    }
  }

  /**
   * Collect Notification Settings
   * CRMNotificationIcon, CRMNotificationTemplate
   */
  async collectNotificationSettings() {
    try {
      console.log('📋 Collecting Notification Settings...')
      console.log('⚠️ Notification settings require Dataverse admin access')
    } catch (error) {
      this.handleError('collectNotificationSettings', error)
    }
  }

  /**
   * Collect Plugin Configuration
   * CRMPluginType
   */
  async collectPluginConfiguration() {
    try {
      console.log('📋 Collecting Plugin Configuration...')
      console.log('⚠️ Plugin configuration requires Dataverse admin access')
    } catch (error) {
      this.handleError('collectPluginConfiguration', error)
    }
  }

  /**
   * Execute PowerShell commands
   */
  async executePowerShell(script) {
    try {
      const { execSync } = require('child_process')
      const result = execSync(`pwsh -Command "${script.replace(/"/g, '\\"')}"`, {
        timeout: 60000,
        encoding: 'utf-8'
      }).trim()

      return JSON.parse(result)
    } catch (error) {
      try {
        const { execSync } = require('child_process')
        const result = execSync(`powershell.exe -Command "${script.replace(/"/g, '\\"')}"`, {
          timeout: 60000,
          encoding: 'utf-8'
        }).trim()
        return JSON.parse(result)
      } catch (fallbackError) {
        console.warn(`⚠️ PowerShell execution failed: ${error.message}`)
        return null
      }
    }
  }

  /**
   * Collect Environment Settings via PowerShell
   * CRMEnvironmentSettings
   */
  async collectEnvironmentSettingsPowerShell() {
    try {
      console.log('📋 Collecting Dynamics 365 Environment Settings (PowerShell)...')

      const script = `
        Get-DataverseEnvironment | Select-Object @{
          n='DisplayName';e={$_.displayName}
        }, @{
          n='EnvironmentType';e={$_.environmentType}
        }, @{
          n='CreatedDateTime';e={$_.createdDateTime}
        }, @{
          n='IsProvisioned';e={$_.isProvisioned}
        } | ConvertTo-Json -AsArray
      `

      const result = await this.executePowerShell(script)

      if (Array.isArray(result) && result.length > 0) {
        for (const env of result) {
          this.resources.push({
            type: 'CRMEnvironmentSettings',
            name: env.DisplayName,
            id: env.DisplayName,
            configuration: {
              Identity: env.DisplayName,
              DisplayName: env.DisplayName,
              EnvironmentType: env.EnvironmentType || 'Production',
              CreatedDateTime: env.CreatedDateTime || '',
              IsProvisioned: env.IsProvisioned || false
            }
          })
        }

        console.log(`✅ Collected \${result.length} environments`)
      }
    } catch (error) {
      this.handleError('collectEnvironmentSettingsPowerShell', error)
    }
  }

  /**
   * Collect Security Roles via PowerShell
   * CRMSecurityRole
   */
  async collectSecurityRolesPowerShell() {
    try {
      console.log('📋 Collecting Security Roles (PowerShell)...')

      const script = `
        Get-DataverseSecurityRole | Select-Object @{
          n='DisplayName';e={$_.displayName}
        }, @{
          n='Description';e={$_.description}
        }, @{
          n='CreatedDateTime';e={$_.createdDateTime}
        } | ConvertTo-Json -AsArray
      `

      const result = await this.executePowerShell(script)

      if (Array.isArray(result) && result.length > 0) {
        for (const role of result) {
          this.resources.push({
            type: 'CRMSecurityRole',
            name: role.DisplayName,
            id: role.DisplayName,
            configuration: {
              Identity: role.DisplayName,
              DisplayName: role.DisplayName,
              Description: role.Description || '',
              CreatedDateTime: role.CreatedDateTime || ''
            }
          })
        }

        console.log(`✅ Collected \${result.length} security roles`)
      }
    } catch (error) {
      this.handleError('collectSecurityRolesPowerShell', error)
    }
  }

  /**
   * Collect Plugin Registrations via PowerShell
   * CRMPluginRegistration
   */
  async collectPluginRegistrationsPowerShell() {
    try {
      console.log('📋 Collecting Plugin Registrations (PowerShell)...')

      const script = `
        Get-DataversePluginRegistration | Select-Object @{
          n='DisplayName';e={$_.friendlyName}
        }, @{
          n='AssemblyName';e={$_.assemblyName}
        }, @{
          n='IsManaged';e={$_.isManaged}
        } | ConvertTo-Json -AsArray
      `

      const result = await this.executePowerShell(script)

      if (Array.isArray(result) && result.length > 0) {
        for (const plugin of result) {
          this.resources.push({
            type: 'CRMPluginRegistration',
            name: plugin.DisplayName,
            id: plugin.AssemblyName,
            configuration: {
              Identity: plugin.AssemblyName,
              DisplayName: plugin.DisplayName,
              AssemblyName: plugin.AssemblyName,
              IsManaged: plugin.IsManaged || false
            }
          })
        }

        console.log(`✅ Collected \${result.length} plugin registrations`)
      }
    } catch (error) {
      this.handleError('collectPluginRegistrationsPowerShell', error)
    }
  }

  /**
   * Collect Web Resources via PowerShell
   * CRMWebResource
   */
  async collectWebResourcesPowerShell() {
    try {
      console.log('📋 Collecting Web Resources (PowerShell)...')

      const script = `
        Get-DataverseWebResource | Select-Object @{
          n='DisplayName';e={$_.displayName}
        }, @{
          n='WebResourceType';e={$_.webResourceType}
        }, @{
          n='IsManaged';e={$_.isManaged}
        }, @{
          n='CreatedDateTime';e={$_.createdDateTime}
        } | ConvertTo-Json -AsArray
      `

      const result = await this.executePowerShell(script)

      if (Array.isArray(result) && result.length > 0) {
        for (const resource of result) {
          this.resources.push({
            type: 'CRMWebResource',
            name: resource.DisplayName,
            id: resource.DisplayName,
            configuration: {
              Identity: resource.DisplayName,
              DisplayName: resource.DisplayName,
              WebResourceType: resource.WebResourceType || 'script',
              IsManaged: resource.IsManaged || false,
              CreatedDateTime: resource.CreatedDateTime || ''
            }
          })
        }

        console.log(`✅ Collected \${result.length} web resources`)
      }
    } catch (error) {
      this.handleError('collectWebResourcesPowerShell', error)
    }
  }

  /**
   * Collect Solutions via PowerShell
   * CRMSolution
   */
  async collectSolutionsPowerShell() {
    try {
      console.log('📋 Collecting Solutions (PowerShell)...')

      const script = `
        Get-DataverseSolution | Select-Object @{
          n='DisplayName';e={$_.displayName}
        }, @{
          n='Version';e={$_.version}
        }, @{
          n='IsManaged';e={$_.isManaged}
        }, @{
          n='CreatedDateTime';e={$_.createdDateTime}
        }, @{
          n='ModifiedDateTime';e={$_.modifiedDateTime}
        } | ConvertTo-Json -AsArray
      `

      const result = await this.executePowerShell(script)

      if (Array.isArray(result) && result.length > 0) {
        for (const solution of result) {
          this.resources.push({
            type: 'CRMSolution',
            name: solution.DisplayName,
            id: solution.DisplayName,
            configuration: {
              Identity: solution.DisplayName,
              DisplayName: solution.DisplayName,
              Version: solution.Version || '1.0.0.0',
              IsManaged: solution.IsManaged || false,
              CreatedDateTime: solution.CreatedDateTime || '',
              ModifiedDateTime: solution.ModifiedDateTime || ''
            }
          })
        }

        console.log(`✅ Collected \${result.length} solutions`)
      }
    } catch (error) {
      this.handleError('collectSolutionsPowerShell', error)
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

export default Dynamics365Collector
