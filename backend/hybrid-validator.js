/**
 * Hybrid Validation Engine
 * Handles fallback between Graph API and PowerShell validation
 * Supports configurable per-control validation methods
 */

import { getValidationMethod, getRetryConfig, isPowerShellEnabled } from './validation-config.js'
import { executePowerShellCommands } from './powershell-executor.js'
import { recordValidationAttempt } from './validation-state.js'

/**
 * Validate a control with hybrid approach
 * Tries preferred method, falls back to alternative if needed
 *
 * @param {string} controlId - CIS Control ID
 * @param {Function} graphApiValidator - Async function for Graph API validation
 * @param {Array<string>} powerShellCommands - PowerShell commands for validation
 * @returns {Promise<Object>} Validation result with method metadata
 */
export async function validateWithHybridApproach(
  controlId,
  graphApiValidator,
  powerShellCommands = null
) {
  const method = getValidationMethod(controlId)
  const retryConfig = getRetryConfig()
  const startTime = Date.now()

  // Handle pure Graph API method
  if (method === 'graphAPI') {
    return validateWithGraphAPI(controlId, graphApiValidator, startTime)
  }

  // Handle pure PowerShell method
  if (method === 'powershell') {
    return validateWithPowerShell(controlId, powerShellCommands, startTime)
  }

  // Handle hybrid method: try Graph API first, fallback to PowerShell
  if (method === 'hybrid') {
    return validateWithHybridFallback(
      controlId,
      graphApiValidator,
      powerShellCommands,
      startTime,
      retryConfig
    )
  }

  throw new Error(`Unknown validation method: ${method}`)
}

/**
 * Validate using Graph API
 */
async function validateWithGraphAPI(controlId, validator, startTime) {
  try {
    const result = await validator()

    recordValidationAttempt(controlId, 'graphAPI', {
      endpoint: result.endpoint || 'Graph API',
      executionTime: Date.now() - startTime,
      graphApiDetails: result.details || null,
      fallbackUsed: false
    })

    return {
      ...result,
      validationMethod: 'graphAPI',
      fallbackUsed: false,
      executionTime: Date.now() - startTime
    }
  } catch (error) {
    console.error(`❌ Graph API validation failed for ${controlId}: ${error.message}`)

    recordValidationAttempt(controlId, 'graphAPI', {
      executionTime: Date.now() - startTime,
      fallbackUsed: false,
      error: error.message
    })

    throw error
  }
}

/**
 * Validate using PowerShell
 */
async function validateWithPowerShell(controlId, commands, startTime) {
  if (!commands || commands.length === 0) {
    throw new Error(`No PowerShell commands available for ${controlId}`)
  }

  if (!isPowerShellEnabled()) {
    throw new Error(`PowerShell validation disabled for ${controlId}`)
  }

  try {
    const result = await executePowerShellCommands(commands, controlId)

    if (!result.success) {
      throw new Error(result.error || 'PowerShell execution failed')
    }

    // Parse PowerShell output to validation status
    const status = mapPowerShellResultToStatus(result.output, controlId)

    recordValidationAttempt(controlId, 'powershell', {
      command: commands[0],
      executionTime: Date.now() - startTime,
      powerShellOutput: result.output,
      fallbackUsed: false
    })

    return {
      id: controlId,
      status,
      validationMethod: 'powershell',
      fallbackUsed: false,
      executionTime: Date.now() - startTime,
      psDetails: {
        commandCount: commands.length,
        output: result.output
      }
    }
  } catch (error) {
    console.error(`❌ PowerShell validation failed for ${controlId}: ${error.message}`)

    recordValidationAttempt(controlId, 'powershell', {
      executionTime: Date.now() - startTime,
      fallbackUsed: false,
      error: error.message
    })

    throw error
  }
}

/**
 * Validate with hybrid fallback: try Graph API, fallback to PowerShell
 */
async function validateWithHybridFallback(
  controlId,
  graphApiValidator,
  powerShellCommands,
  startTime,
  retryConfig
) {
  // Try Graph API first
  for (let attempt = 1; attempt <= retryConfig.attempts; attempt++) {
    try {
      const result = await graphApiValidator()

      recordValidationAttempt(controlId, 'graphAPI', {
        endpoint: result.endpoint || 'Graph API',
        executionTime: Date.now() - startTime,
        graphApiDetails: result.details || null,
        fallbackUsed: false
      })

      return {
        ...result,
        validationMethod: 'graphAPI',
        fallbackUsed: false,
        executionTime: Date.now() - startTime,
        attempt
      }
    } catch (graphError) {
      console.warn(`⚠️ Graph API attempt ${attempt}/${retryConfig.attempts} failed for ${controlId}`)

      // If this is the last attempt and PowerShell is available, try fallback
      if (attempt === retryConfig.attempts && powerShellCommands) {
        console.log(`📋 Attempting PowerShell fallback for ${controlId}`)

        try {
          if (!isPowerShellEnabled()) {
            throw new Error('PowerShell validation not enabled')
          }

          const psResult = await executePowerShellCommands(powerShellCommands, controlId)

          if (!psResult.success) {
            throw new Error(psResult.error || 'PowerShell execution failed')
          }

          const status = mapPowerShellResultToStatus(psResult.output, controlId)

          recordValidationAttempt(controlId, 'powershell', {
            command: powerShellCommands[0],
            executionTime: Date.now() - startTime,
            powerShellOutput: psResult.output,
            fallbackUsed: true,
            fallbackReason: graphError.message
          })

          return {
            id: controlId,
            status,
            validationMethod: 'powershell',
            fallbackUsed: true,
            fallbackReason: `Graph API failed: ${graphError.message}`,
            executionTime: Date.now() - startTime,
            psDetails: {
              commandCount: powerShellCommands.length,
              output: psResult.output
            }
          }
        } catch (psError) {
          console.error(`❌ PowerShell fallback also failed for ${controlId}: ${psError.message}`)

          recordValidationAttempt(controlId, 'fallback', {
            executionTime: Date.now() - startTime,
            fallbackUsed: true,
            fallbackReason: `Graph API: ${graphError.message}, PowerShell: ${psError.message}`,
            error: psError.message
          })

          throw psError
        }
      }

      // Wait before retry
      if (attempt < retryConfig.attempts) {
        await sleep(retryConfig.backoffMs * attempt)
      }
    }
  }
}

/**
 * Map PowerShell output to validation status
 */
function mapPowerShellResultToStatus(output, controlId) {
  if (!output) return 'fail'

  const lower = output.toLowerCase()

  // Check for success indicators
  if (lower.includes('true') || lower.includes('enabled') || lower.includes('yes')) {
    return 'pass'
  }

  if (lower.includes('false') || lower.includes('disabled') || lower.includes('no')) {
    return 'fail'
  }

  // If it contains configuration data, assume pass
  if (output.length > 20) {
    return 'pass'
  }

  return 'unknown'
}

/**
 * Sleep utility for retry backoff
 */
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

/**
 * Create a validation wrapper for a control with PowerShell fallback
 *
 * @param {string} controlId - Control ID
 * @param {Function} graphApiValidator - Graph API validation function
 * @param {Array<string>} powerShellCommands - Optional PowerShell commands
 * @returns {Function} Wrapped validator
 */
export function createHybridValidator(controlId, graphApiValidator, powerShellCommands = null) {
  return async () => {
    return validateWithHybridApproach(controlId, graphApiValidator, powerShellCommands)
  }
}

/**
 * Batch validate multiple controls
 */
export async function batchValidateHybrid(controls) {
  const results = await Promise.allSettled(
    controls.map(control =>
      validateWithHybridApproach(
        control.id,
        control.graphApiValidator,
        control.powerShellCommands
      )
    )
  )

  return results.map((result, index) => ({
    controlId: controls[index].id,
    result: result.status === 'fulfilled' ? result.value : { error: result.reason }
  }))
}
