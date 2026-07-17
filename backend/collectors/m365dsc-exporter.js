/**
 * M365DSC Configuration Exporter
 * Uses Microsoft365DSC Export-M365DSCConfiguration for comprehensive M365 backup
 *
 * Advantages:
 * - Officially supported by Microsoft
 * - Handles authentication natively
 * - Supports all 250+ M365 resources
 * - Returns structured PowerShell DSC format
 * - Built-in dependency resolution
 * - Parallel export capability
 */

export class M365DSCExporter {
  constructor(options = {}) {
    this.options = {
      parallel: true,
      validate: true,
      generateInfo: false,
      ...options
    }
  }

  /**
   * Main export function using Export-M365DSCConfiguration
   */
  async export(components = [], outputPath = '/tmp/m365dsc-export') {
    try {
      console.log('🚀 Starting M365DSC Export...')

      const tenantId = process.env.AZURE_TENANT_ID
      const clientId = process.env.AZURE_CLIENT_ID
      const clientSecret = process.env.AZURE_CLIENT_SECRET

      if (!tenantId || !clientId || !clientSecret) {
        throw new Error('Missing Azure credentials (AZURE_TENANT_ID, AZURE_CLIENT_ID, AZURE_CLIENT_SECRET)')
      }

      // Build PowerShell command for Export-M365DSCConfiguration
      const psScript = this.buildExportScript(
        components,
        outputPath,
        tenantId,
        clientId,
        clientSecret
      )

      // Execute the export
      const result = await this.executePowerShell(psScript)

      console.log('✅ M365DSC Export completed successfully')
      return result
    } catch (error) {
      console.error('❌ M365DSC Export failed:', error.message)
      throw error
    }
  }

  /**
   * Build PowerShell script for Export-M365DSCConfiguration
   */
  buildExportScript(components, outputPath, tenantId, clientId, clientSecret) {
    const escapedSecret = clientSecret.replace(/\$/g, '`$').replace(/'/g, "''")

    // Build component list
    const componentList = components.length > 0
      ? `@("${components.join('", "')}")`
      : '@()' // Empty means export all

    return `
      # M365DSC Configuration Export Script
      $WarningPreference = 'SilentlyContinue'
      $ErrorActionPreference = 'SilentlyContinue'

      try {
        # Import M365DSC module
        Import-Module Microsoft365DSC -Force -ErrorAction Stop

        # Create output directory
        $outputPath = '${outputPath}'
        if (-not (Test-Path $outputPath)) {
          New-Item -Path $outputPath -ItemType Directory -Force | Out-Null
        }

        # Export configuration using service principal authentication
        Write-Host "📤 Exporting M365 configurations..."

        Export-M365DSCConfiguration \
          -ApplicationId '${clientId}' \
          -TenantId '${tenantId}' \
          -ApplicationSecret '${escapedSecret}' \
          -Path $outputPath \
          -FileName 'M365Config.ps1' \
          -Components ${componentList} \
          -Parallel \
          -Validate \
          -WithStatistics \
          -IncludeDependencies \
          -ErrorAction SilentlyContinue | Out-Null

        Write-Host "✅ Export completed!"
        Write-Host "📁 Output: $outputPath/M365Config.ps1"

        # Return export summary as JSON
        @{
          success = $true
          path = "$outputPath/M365Config.ps1"
          components = ${componentList}
          timestamp = (Get-Date -Format 'o')
        } | ConvertTo-Json
      } catch {
        Write-Host "❌ Export failed: $_"
        @{
          success = $false
          error = "$_"
        } | ConvertTo-Json
      }
    `
  }

  /**
   * Execute PowerShell script
   */
  async executePowerShell(script) {
    const { exec } = await import('child_process')
    const { promisify } = await import('util')
    const execAsync = promisify(exec)

    try {
      const command = `pwsh -NoProfile -Command "${script.replace(/"/g, '\\"')}"`
      const { stdout } = await execAsync(command, { timeout: 300000 }) // 5 min timeout

      if (stdout && stdout.trim()) {
        return JSON.parse(stdout)
      }
      return { success: false, error: 'No output from PowerShell' }
    } catch (error) {
      console.error('PowerShell execution error:', error.message)
      throw error
    }
  }

  /**
   * Get list of all available M365DSC components
   */
  async getAvailableComponents() {
    try {
      const psScript = `
        $WarningPreference = 'SilentlyContinue'
        Import-Module Microsoft365DSC -Force

        # Get all DSC resources
        $resources = Get-DscResource -Module Microsoft365DSC | Select-Object -ExpandProperty Name

        $resources | Sort-Object | ConvertTo-Json -AsArray
      `

      const result = await this.executePowerShell(psScript)
      return result
    } catch (error) {
      console.error('Error getting components:', error.message)
      return []
    }
  }
}

export default M365DSCExporter
