/**
 * App Service Configuration Service
 * Updates Azure App Service environment variables automatically
 */

import { execSync } from 'child_process'

/**
 * Update App Service environment variables
 * Uses Azure CLI to update web app settings
 */
export async function updateAppServiceConfig(config) {
  try {
    const appServiceName = process.env.APP_SERVICE_NAME || 'm365ops-api'
    const resourceGroup = process.env.RESOURCE_GROUP || 'm365-agentops-rg'

    if (!appServiceName || !resourceGroup) {
      console.warn('⚠️ APP_SERVICE_NAME or RESOURCE_GROUP not configured - skipping App Service update')
      return {
        success: false,
        message: 'App Service credentials not configured',
        skipped: true
      }
    }

    console.log(`🔧 Updating App Service: ${appServiceName}`)

    const settings = {
      'AZURE_CLIENT_ID': config.clientId,
      'AZURE_CLIENT_SECRET': config.clientSecret,
      'AZURE_TENANT_ID': config.tenantId,
      'AZURE_REDIRECT_URI': config.redirectUri,
      'SHAREPOINT_SITE_ID': config.sharePointSiteId,
      'NODE_ENV': 'production',
      'PORT': '8080'
    }

    // Build Azure CLI command
    let command = `az webapp config appsettings set --resource-group ${resourceGroup} --name ${appServiceName}`

    for (const [key, value] of Object.entries(settings)) {
      if (value) {
        // Escape special characters for shell
        const escapedValue = String(value).replace(/'/g, "'\\''")
        command += ` --settings ${key}='${escapedValue}'`
      }
    }

    console.log('📝 Settings to apply:')
    Object.keys(settings).forEach(key => {
      console.log(`  - ${key}: ${settings[key] ? '✓ set' : '✗ empty'}`)
    })

    // Execute Azure CLI command
    try {
      const result = execSync(command, { encoding: 'utf-8', stdio: 'pipe' })
      console.log('✅ App Service environment variables updated successfully')

      return {
        success: true,
        message: 'App Service environment variables updated',
        appService: appServiceName,
        settingsUpdated: Object.keys(settings).length
      }
    } catch (cliError) {
      console.error('⚠️ Azure CLI error:', cliError.message)

      // Check if user is authenticated with Azure CLI
      if (cliError.message.includes('not logged in') || cliError.message.includes('authentication')) {
        return {
          success: false,
          message: 'Not authenticated with Azure CLI. Run: az login',
          requiresAuth: true
        }
      }

      throw cliError
    }
  } catch (error) {
    console.error('❌ Failed to update App Service:', error.message)
    return {
      success: false,
      message: error.message,
      error: error.message
    }
  }
}

/**
 * Verify App Service connection
 * Tests if Azure CLI can access the App Service
 */
export async function verifyAppService() {
  try {
    const appServiceName = process.env.APP_SERVICE_NAME || 'm365ops-api'
    const resourceGroup = process.env.RESOURCE_GROUP || 'm365-agentops-rg'

    if (!appServiceName || !resourceGroup) {
      return {
        configured: false,
        message: 'App Service credentials not configured'
      }
    }

    const command = `az webapp show --resource-group ${resourceGroup} --name ${appServiceName} --query id`
    const result = execSync(command, { encoding: 'utf-8', stdio: 'pipe' })

    return {
      configured: true,
      appService: appServiceName,
      resourceGroup: resourceGroup,
      available: true
    }
  } catch (error) {
    return {
      configured: true,
      available: false,
      error: error.message
    }
  }
}
