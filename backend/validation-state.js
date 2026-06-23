/**
 * Validation State Tracker
 * Tracks which validation method was used for each control during validation
 * Provides per-control metadata about validation execution
 */

class ValidationStateTracker {
  constructor() {
    this.results = new Map()
  }

  /**
   * Record validation attempt for a control
   */
  recordValidation(controlId, method, details = {}) {
    this.results.set(controlId, {
      controlId,
      validationMethod: method,  // 'graphAPI' | 'powershell' | 'fallback'
      validationEndpoint: details.endpoint || null,
      validationCommand: details.command || null,
      executionTime: details.executionTime || 0,  // ms
      fallbackUsed: details.fallbackUsed || false,
      fallbackReason: details.fallbackReason || null,
      timestamp: new Date().toISOString(),
      graphApiDetails: details.graphApiDetails || null,
      powerShellOutput: details.powerShellOutput || null,
      error: details.error || null
    })
  }

  /**
   * Get validation metadata for a control
   */
  getValidationMetadata(controlId) {
    return this.results.get(controlId) || null
  }

  /**
   * Get all validation metadata
   */
  getAllMetadata() {
    return Array.from(this.results.values())
  }

  /**
   * Get summary statistics
   */
  getSummary() {
    const metadata = this.getAllMetadata()
    const methodCounts = {
      graphAPI: 0,
      powershell: 0,
      fallback: 0
    }

    let totalTime = 0
    let fallbackCount = 0

    metadata.forEach(m => {
      methodCounts[m.validationMethod] = (methodCounts[m.validationMethod] || 0) + 1
      totalTime += m.executionTime
      if (m.fallbackUsed) fallbackCount++
    })

    return {
      totalControls: metadata.length,
      methodCounts,
      fallbackCount,
      totalExecutionTime: totalTime,
      averageExecutionTime: metadata.length > 0 ? totalTime / metadata.length : 0,
      timestamp: new Date().toISOString()
    }
  }

  /**
   * Clear all tracked state
   */
  clear() {
    this.results.clear()
  }

  /**
   * Get controls that used fallback
   */
  getFallbackControls() {
    return Array.from(this.results.values()).filter(m => m.fallbackUsed)
  }

  /**
   * Get controls by method
   */
  getControlsByMethod(method) {
    return Array.from(this.results.values()).filter(m => m.validationMethod === method)
  }
}

// Global instance
const tracker = new ValidationStateTracker()

export function getValidationStateTracker() {
  return tracker
}

export function resetValidationState() {
  tracker.clear()
}

export function recordValidationAttempt(controlId, method, details) {
  tracker.recordValidation(controlId, method, details)
}

export function getValidationSummary() {
  return tracker.getSummary()
}

export function getAllValidationMetadata() {
  return tracker.getAllMetadata()
}

export function getValidationMetadata(controlId) {
  return tracker.getValidationMetadata(controlId)
}

export function getFallbackControls() {
  return tracker.getFallbackControls()
}

export function getControlsByValidationMethod(method) {
  return tracker.getControlsByMethod(method)
}
