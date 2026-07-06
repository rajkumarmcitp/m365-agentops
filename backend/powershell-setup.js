// PowerShell Module Installation and Verification
// Handles checking and installing required PowerShell modules for M365 AgentOps

import { execSync, spawn } from 'child_process'

const REQUIRED_MODULES = [
  { name: 'Microsoft.Graph', version: '2.0.0', minVersion: '2.0.0' },
  { name: 'ExchangeOnlineManagement', version: '3.0.0', minVersion: '3.0.0' },
  { name: 'PnP.PowerShell', version: '2.0.0', minVersion: '2.0.0' },
  { name: 'MicrosoftTeams', version: '6.0.0', minVersion: '6.0.0' },
  { name: 'Microsoft.Online.SharePoint.PowerShell', version: '16.0.0', minVersion: '16.0.0' }
]

/**
 * Check if PowerShell is available and get version
 * Note: PnP.PowerShell requires PowerShell 7+
 */
export function checkPowerShellAvailable() {
  try {
    // Try PowerShell 7+ (pwsh)
    const result = execSync('pwsh -NoProfile -Command "$PSVersionTable.PSVersion.Major"', {
      encoding: 'utf-8',
      stdio: ['pipe', 'pipe', 'ignore']
    }).trim()

    const majorVersion = parseInt(result, 10)

    if (majorVersion >= 7) {
      return {
        available: true,
        version: majorVersion,
        versionString: `PowerShell ${majorVersion}`,
        isSufficientVersion: true,
        message: `PowerShell ${majorVersion} detected (✅ PnP.PowerShell compatible)`
      }
    } else {
      return {
        available: true,
        version: majorVersion,
        versionString: `PowerShell ${majorVersion}`,
        isSufficientVersion: false,
        message: `PowerShell ${majorVersion} detected (❌ Requires PowerShell 7+ for PnP.PowerShell)`
      }
    }
  } catch (error) {
    // Try older PowerShell format
    try {
      const result = execSync(
        'powershell -NoProfile -Command "[System.Environment]::OSVersion.Version"',
        { encoding: 'utf-8', stdio: ['pipe', 'pipe', 'ignore'] }
      ).trim()

      return {
        available: true,
        version: 5,
        versionString: 'PowerShell 5.1 (Windows PowerShell)',
        isSufficientVersion: false,
        message: 'Windows PowerShell 5.1 detected (❌ Requires PowerShell 7+ for PnP.PowerShell)'
      }
    } catch (e) {
      return {
        available: false,
        version: null,
        versionString: null,
        isSufficientVersion: false,
        message: '❌ PowerShell not found. Please install PowerShell 7+ (https://github.com/PowerShell/PowerShell/releases)',
        action: 'install-powershell-7'
      }
    }
  }
}

/**
 * Get PowerShell version number
 */
export function getPowerShellVersion() {
  try {
    const result = execSync('pwsh -NoProfile -Command "$PSVersionTable.PSVersion.Major"', {
      encoding: 'utf-8',
      stdio: ['pipe', 'pipe', 'ignore']
    }).trim()
    return parseInt(result, 10)
  } catch {
    return null
  }
}

/**
 * Check which modules are installed
 */
export function checkInstalledModules() {
  const results = []

  for (const module of REQUIRED_MODULES) {
    try {
      const checkCmd = `pwsh -NoProfile -Command "Get-Module -ListAvailable -Name '${module.name}' | Select-Object -ExpandProperty Version"`

      const version = execSync(checkCmd, {
        encoding: 'utf-8',
        stdio: ['pipe', 'pipe', 'ignore']
      }).trim()

      if (version) {
        results.push({
          name: module.name,
          installed: true,
          version: version,
          status: '✅ Installed',
          action: 'none'
        })
      } else {
        results.push({
          name: module.name,
          installed: false,
          version: null,
          status: '⏳ Not installed',
          action: 'install'
        })
      }
    } catch (error) {
      results.push({
        name: module.name,
        installed: false,
        version: null,
        status: '❌ Not found',
        action: 'install'
      })
    }
  }

  return results
}

/**
 * Install a PowerShell module
 */
export function installPowerShellModule(moduleName) {
  return new Promise((resolve, reject) => {
    const installCmd = `pwsh -NoProfile -Command "Set-PSRepository PSGallery -InstallationPolicy Trusted -ErrorAction SilentlyContinue; Install-Module -Name '${moduleName}' -Scope CurrentUser -Force -AllowClobber -AcceptLicense -ErrorAction Stop"`

    try {
      console.log(`📦 Installing ${moduleName}...`)
      const result = execSync(installCmd, {
        encoding: 'utf-8',
        timeout: 300000, // 5 minutes per module
        stdio: 'pipe'
      })

      console.log(`✅ ${moduleName} installed successfully`)
      resolve({
        module: moduleName,
        success: true,
        message: `${moduleName} installed successfully`,
        output: result
      })
    } catch (error) {
      console.error(`❌ Failed to install ${moduleName}:`, error.message)
      resolve({
        module: moduleName,
        success: false,
        message: `Failed to install ${moduleName}: ${error.message}`,
        error: error.message
      })
    }
  })
}

/**
 * Install all missing modules
 */
export async function installMissingModules() {
  console.log('🔍 Checking for missing PowerShell modules...')

  const installed = checkInstalledModules()
  const missingModules = installed.filter(m => !m.installed).map(m => m.name)

  if (missingModules.length === 0) {
    console.log('✅ All required modules are already installed')
    return {
      allInstalled: true,
      modulesChecked: installed.length,
      modulesInstalled: 0,
      results: installed,
      message: 'All required PowerShell modules are already installed'
    }
  }

  console.log(`⏳ Installing ${missingModules.length} missing modules...`)

  const installResults = []
  for (const moduleName of missingModules) {
    const result = await installPowerShellModule(moduleName)
    installResults.push(result)
  }

  const successCount = installResults.filter(r => r.success).length
  const failCount = installResults.filter(r => !r.success).length

  return {
    allInstalled: failCount === 0,
    modulesChecked: installed.length,
    modulesInstalled: successCount,
    modulesFailed: failCount,
    results: installed,
    installResults: installResults,
    message: `Attempted to install ${missingModules.length} modules. Success: ${successCount}, Failed: ${failCount}`
  }
}

/**
 * Get comprehensive setup status
 */
export async function getPowerShellSetupStatus() {
  const psCheck = checkPowerShellAvailable()

  if (!psCheck.available) {
    return {
      ready: false,
      powerShellAvailable: false,
      powerShellVersion: null,
      versionSufficient: false,
      modules: [],
      message: psCheck.message,
      action: psCheck.action || 'install-powershell-7',
      instructions: 'Download and install PowerShell 7 or later from: https://github.com/PowerShell/PowerShell/releases'
    }
  }

  if (!psCheck.isSufficientVersion) {
    return {
      ready: false,
      powerShellAvailable: true,
      powerShellVersion: psCheck.version,
      powerShellVersionString: psCheck.versionString,
      versionSufficient: false,
      modules: [],
      message: psCheck.message,
      action: 'upgrade-powershell-7',
      instructions: 'PnP.PowerShell requires PowerShell 7 or later. Please upgrade from: https://github.com/PowerShell/PowerShell/releases'
    }
  }

  const modules = checkInstalledModules()
  const allInstalled = modules.every(m => m.installed)

  return {
    ready: allInstalled,
    powerShellAvailable: true,
    powerShellVersion: psCheck.version,
    powerShellVersionString: psCheck.versionString,
    versionSufficient: true,
    modules: modules,
    missingCount: modules.filter(m => !m.installed).length,
    message: allInstalled
      ? '✅ All PowerShell modules are installed and ready'
      : `⏳ ${modules.filter(m => !m.installed).length} modules need to be installed`,
    action: allInstalled ? 'none' : 'install'
  }
}

/**
 * Test module functionality
 */
export function testModuleAvailability(moduleName) {
  try {
    const testCmd = `pwsh -NoProfile -Command "Import-Module -Name '${moduleName}' -ErrorAction Stop; Write-Host 'OK'"`
    const result = execSync(testCmd, { encoding: 'utf-8' }).trim()
    return {
      module: moduleName,
      available: result === 'OK',
      message: `${moduleName} is available and can be imported`
    }
  } catch (error) {
    return {
      module: moduleName,
      available: false,
      message: `${moduleName} failed to import: ${error.message}`
    }
  }
}
