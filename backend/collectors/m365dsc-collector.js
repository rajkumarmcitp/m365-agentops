/**
 * M365DSC Collector
 * Collects M365 configurations using Microsoft365DSC
 * Separate from existing backup system
 */

import { exec } from 'child_process'
import { promisify } from 'util'

const execAsync = promisify(exec)

export class M365DSCCollector {
  constructor(options = {}) {
    this.options = {
      parallel: true,
      validate: true,
      ...options
    }
    this.resources = []
  }

  async collect() {
    try {
      console.log('🚀 Starting M365DSC Collection...')
      const startTime = Date.now()

      const tenantId = process.env.AZURE_TENANT_ID
      const clientId = process.env.AZURE_CLIENT_ID
      const clientSecret = process.env.AZURE_CLIENT_SECRET

      if (!tenantId || !clientId || !clientSecret) {
        throw new Error('Missing Azure credentials')
      }

      // Step 1: Export all M365 configurations
      console.log('📤 Exporting M365 configurations via M365DSC...')
      const exportResult = await this.exportM365DSCConfiguration(
        tenantId,
        clientId,
        clientSecret
      )

      if (!exportResult.success) {
        throw new Error(`Export failed: ${exportResult.error}`)
      }

      console.log(`✅ Export completed in ${Math.round((Date.now() - startTime) / 1000)}s`)

      // Step 2: Parse and organize resources
      console.log('📊 Parsing configurations...')
      const coverage = await this.analyzeCoverage(exportResult)

      const executionTime = Math.round((Date.now() - startTime) / 1000)
      console.log(`✅ M365DSC collection complete (${executionTime}s)`)

      return {
        success: true,
        coverage: coverage,
        exportPath: exportResult.path,
        timestamp: new Date().toISOString(),
        executionTime: executionTime,
        resources: this.resources.length
      }
    } catch (error) {
      console.error('❌ M365DSC Collection failed:', error.message)
      return {
        success: false,
        error: error.message
      }
    }
  }

  async exportM365DSCConfiguration(tenantId, clientId, clientSecret) {
    try {
      const escapedSecret = clientSecret.replace(/\$/g, '`$').replace(/'/g, "''")

      const psScript = `
        \\\$WarningPreference = 'SilentlyContinue'
        \\\$ErrorActionPreference = 'SilentlyContinue'

        try {
          Import-Module Microsoft365DSC -Force -ErrorAction Stop

          \\\$outputPath = '/tmp/m365dsc-coverage'
          if (-not (Test-Path \\\$outputPath)) {
            New-Item -Path \\\$outputPath -ItemType Directory -Force | Out-Null
          }

          Write-Host "📤 Starting M365DSC Export..."

          # Export all configurations with service principal
          Export-M365DSCConfiguration \\\
            -ApplicationId '${clientId}' \\\
            -TenantId '${tenantId}' \\\
            -ApplicationSecret '${escapedSecret}' \\\
            -Path \\\$outputPath \\\
            -FileName 'M365Coverage.ps1' \\\
            -Parallel \\\
            -Validate \\\
            -WithStatistics \\\
            -IncludeDependencies \\\
            -ErrorAction SilentlyContinue | Out-Null

          if (Test-Path "\\\$outputPath/M365Coverage.ps1") {
            Write-Host "✅ Export completed successfully"
            @{
              success = \\\$true
              path = "\\\$outputPath/M365Coverage.ps1"
              timestamp = (Get-Date -Format 'o')
            } | ConvertTo-Json
          } else {
            Write-Host "⚠️ Export file not created"
            @{
              success = \\\$false
              error = "Export file not created"
            } | ConvertTo-Json
          }
        } catch {
          Write-Host "❌ Export failed: \\\$_"
          @{
            success = \\\$false
            error = "\\\$_"
          } | ConvertTo-Json
        }
      `

      const command = `pwsh -NoProfile -Command "${psScript.replace(/"/g, '\\"')}"`
      const { stdout } = await execAsync(command, { timeout: 600000 }) // 10 min timeout

      if (stdout && stdout.trim()) {
        return JSON.parse(stdout)
      }
      return { success: false, error: 'No output from PowerShell' }
    } catch (error) {
      console.error('PowerShell export error:', error.message)
      return { success: false, error: error.message }
    }
  }

  async analyzeCoverage(exportResult) {
    try {
      const { readFile } = await import('fs/promises')

      const filePath = exportResult.path
      console.log(`📖 Reading exported configuration from ${filePath}...`)

      const content = await readFile(filePath, 'utf-8')

      // Parse the DSC configuration to count resources
      const coverage = this.parseDSCConfiguration(content)

      return coverage
    } catch (error) {
      console.error('Error analyzing coverage:', error.message)
      return {
        total: 0,
        byService: {},
        resources: [],
        error: error.message
      }
    }
  }

  parseDSCConfiguration(dscContent) {
    // Extract resource blocks from DSC
    // Pattern: ResourceType "ResourceName"
    // or: ResourceType ResourceName

    const resourceRegex = /(\w+(?:Aad|Exo|Spo|Teams|Intune|Sc|Pp|M365|Tenant)\w*)\s+["']?([^"'\n{}]+)["']?/gi
    const resources = []
    let match

    while ((match = resourceRegex.exec(dscContent)) !== null) {
      const [, type, name] = match
      if (type && name && !type.includes('node')) {
        resources.push({ type, name: name.trim() })
      }
    }

    // Group by service
    const byService = {}
    resources.forEach(r => {
      const service = this.getServiceFromType(r.type)
      if (!byService[service]) {
        byService[service] = []
      }
      byService[service].push(r.type)
    })

    // Count unique resource types per service
    const serviceStats = {}
    Object.entries(byService).forEach(([service, types]) => {
      serviceStats[service] = {
        count: new Set(types).size,
        types: Array.from(new Set(types)).sort()
      }
    })

    return {
      total: new Set(resources.map(r => r.type)).size,
      totalInstances: resources.length,
      byService: serviceStats,
      timestamp: new Date().toISOString()
    }
  }

  getServiceFromType(type) {
    if (type.startsWith('AAD') || type.startsWith('Aad')) return 'Entra ID'
    if (type.startsWith('EXO') || type.startsWith('Exo')) return 'Exchange Online'
    if (type.startsWith('SPO') || type.startsWith('Spo')) return 'SharePoint Online'
    if (type.startsWith('Teams')) return 'Microsoft Teams'
    if (type.startsWith('Intune')) return 'Intune'
    if (type.startsWith('SC') || type.startsWith('Sc')) return 'Security & Compliance'
    if (type.startsWith('PP') || type.startsWith('Pp')) return 'Power Platform'
    if (type.startsWith('Tenant')) return 'Tenant Settings'
    if (type.startsWith('M365')) return 'Microsoft 365'
    return 'Other'
  }
}

export default M365DSCCollector
