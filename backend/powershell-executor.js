/**
 * PowerShell Command Executor for CIS Validation
 * Full PowerShell validation system supporting Graph API, Exchange Online, and PnP.PowerShell
 * Cross-platform support: Windows, macOS (pwsh), Linux (pwsh)
 */

import { spawn } from 'child_process';
import { execSync } from 'child_process';
import { existsSync } from 'fs';

/**
 * Detect PowerShell executable path for current platform
 * @returns {string} Path to PowerShell executable
 */
function getPowerShellExecutable() {
  // Try pwsh (PowerShell 7+) first (works on all platforms)
  if (existsSync('/usr/local/bin/pwsh')) return '/usr/local/bin/pwsh'; // macOS
  if (existsSync('/usr/bin/pwsh')) return '/usr/bin/pwsh'; // Linux
  if (existsSync('C:\\Program Files\\PowerShell\\7\\pwsh.exe')) return 'C:\\Program Files\\PowerShell\\7\\pwsh.exe'; // Windows

  // Fallback to powershell.exe (Windows only)
  return 'powershell.exe';
}

/**
 * Execute PowerShell commands for control validation
 * @param {string[]} commands - Array of PowerShell commands to execute
 * @param {string} controlId - Control ID for logging
 * @returns {Promise<Object>} Execution result with status and output
 */
export async function executePowerShellCommands(commands, controlId) {
  if (!commands || commands.length === 0) {
    return {
      success: false,
      error: 'No commands provided',
      controlId: controlId
    }
  }

  return new Promise((resolve) => {
    try {
      // Join commands with semicolon for execution
      const scriptContent = commands.join('; ')

      // Get appropriate PowerShell executable for platform
      const psExecutable = getPowerShellExecutable()

      // Execute PowerShell
      const psProcess = spawn(psExecutable, ['-Command', scriptContent], {
        stdio: ['pipe', 'pipe', 'pipe'],
        shell: false
      })

      let stdout = ''
      let stderr = ''

      psProcess.stdout.on('data', (data) => {
        stdout += data.toString()
      })

      psProcess.stderr.on('data', (data) => {
        stderr += data.toString()
      })

      psProcess.on('close', (code) => {
        if (code === 0) {
          resolve({
            success: true,
            output: stdout.trim(),
            controlId: controlId,
            commandCount: commands.length,
            executedAt: new Date().toISOString()
          })
        } else {
          resolve({
            success: false,
            error: stderr.trim() || stdout.trim(),
            controlId: controlId,
            exitCode: code,
            executedAt: new Date().toISOString()
          })
        }
      })

      psProcess.on('error', (err) => {
        resolve({
          success: false,
          error: err.message,
          controlId: controlId,
          executedAt: new Date().toISOString()
        })
      })
    } catch (error) {
      resolve({
        success: false,
        error: error.message,
        controlId: controlId,
        executedAt: new Date().toISOString()
      })
    }
  })
}

/**
 * Execute PowerShell with Graph API authentication
 * @param {string[]} commands - Commands to execute
 * @param {string} scopes - Scopes for Graph API connection
 * @returns {Promise<Object>} Result of execution
 */
export async function executePowerShellWithGraph(commands, scopes = 'User.Read.All,Directory.Read.All') {
  const connectCommand = `Connect-MgGraph -Scopes '${scopes}' -NoWelcome`
  const allCommands = [connectCommand, ...commands]

  return executePowerShellCommands(allCommands, 'graph-authenticated')
}

/**
 * Execute PowerShell with Exchange Online connection
 * @param {string[]} commands - Commands to execute
 * @returns {Promise<Object>} Result of execution
 */
export async function executePowerShellWithExchange(commands) {
  const connectCommand = 'Connect-ExchangeOnline -ShowBanner:$false'
  const allCommands = [connectCommand, ...commands]

  return executePowerShellCommands(allCommands, 'exchange-authenticated')
}

/**
 * Parse PowerShell command output to extract validation results
 * @param {string} output - Raw PowerShell output
 * @param {string} parseFormat - Format to parse ('json', 'table', 'list')
 * @returns {Object} Parsed result
 */
export function parsePowerShellOutput(output, parseFormat = 'list') {
  try {
    if (parseFormat === 'json') {
      return JSON.parse(output)
    }

    if (parseFormat === 'table') {
      const lines = output.split('\n').filter(l => l.trim())
      const headers = lines[0].split(/\s{2,}/).map(h => h.trim())
      const rows = lines.slice(1).map(line =>
        headers.reduce((obj, header, idx) => {
          obj[header] = line.split(/\s{2,}/)[idx]?.trim()
          return obj
        }, {})
      )
      return rows
    }

    // Default: return as string
    return { output: output }
  } catch (error) {
    console.warn(`⚠️ PowerShell output parsing failed: ${error.message}`)
    return { output: output, parseError: error.message }
  }
}

/**
 * Map PowerShell validation results to control status
 * @param {string} output - PowerShell command output
 * @param {string} controlId - Control being validated
 * @returns {string} Status: 'pass', 'fail', or 'warn'
 */
export function mapPowerShellToStatus(output, controlId) {
  if (!output) return 'fail'

  const outputLower = output.toLowerCase()

  // Common success indicators
  if (outputLower.includes('true') ||
    outputLower.includes('enabled') ||
    outputLower.includes('yes') ||
    outputLower.includes('compliant')) {
    return 'pass'
  }

  // Common failure indicators
  if (outputLower.includes('false') ||
    outputLower.includes('disabled') ||
    outputLower.includes('no') ||
    outputLower.includes('non-compliant')) {
    return 'fail'
  }

  // Default to warn if unclear
  return 'warn'
}

/**
 * Check if PowerShell is available on the system
 * @returns {Promise<boolean>} True if PowerShell is available
 */
export async function isPowerShellAvailable() {
  return new Promise((resolve) => {
    const psExecutable = getPowerShellExecutable()
    const ps = spawn(psExecutable, ['-Command', 'Write-Host "available"'], {
      stdio: ['pipe', 'pipe', 'pipe'],
      shell: false
    })

    let available = false

    ps.stdout.on('data', (data) => {
      if (data.toString().includes('available')) {
        available = true
      }
    })

    ps.on('close', () => {
      resolve(available)
    })

    ps.on('error', () => {
      resolve(false)
    })

    // Timeout after 2 seconds
    setTimeout(() => resolve(false), 2000)
  })
}

/**
 * Execute PowerShell command with retry logic
 * @param {string[]} commands - Commands to execute
 * @param {number} maxRetries - Maximum retry attempts
 * @returns {Promise<Object>} Result with retry information
 */
export async function executePowerShellWithRetry(commands, maxRetries = 3) {
  let lastError = null

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const result = await executePowerShellCommands(commands, `attempt-${attempt}`)
      if (result.success) {
        return { ...result, attempts: attempt }
      }
      lastError = result
    } catch (error) {
      lastError = { error: error.message }
    }

    // Wait before retry (exponential backoff)
    if (attempt < maxRetries) {
      await new Promise(resolve => setTimeout(resolve, Math.pow(2, attempt - 1) * 1000))
    }
  }

  return {
    success: false,
    error: lastError?.error || 'All retry attempts failed',
    attempts: maxRetries,
    executedAt: new Date().toISOString()
  }
}
