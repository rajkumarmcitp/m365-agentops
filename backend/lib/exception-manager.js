/**
 * Exception Management System
 * Handles approval workflow for compliance exceptions/waivers
 */

import { v4 as uuidv4 } from 'uuid'

const EXCEPTION_STATUSES = {
  PENDING: 'pending',
  APPROVED: 'approved',
  REJECTED: 'rejected',
  EXPIRED: 'expired'
}

const EXCEPTION_PRIORITIES = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high',
  CRITICAL: 'critical'
}

// In-memory storage (replace with database in production)
let exceptions = []

/**
 * Request a new exception
 */
export function requestException(data) {
  try {
    const {
      controlId,
      controlName,
      reason,
      businessJustification,
      requestedBy,
      approverEmail,
      expiryDays = 30,
      priority = EXCEPTION_PRIORITIES.MEDIUM
    } = data

    if (!controlId || !controlName || !reason || !requestedBy || !approverEmail) {
      throw new Error('Missing required fields: controlId, controlName, reason, requestedBy, approverEmail')
    }

    const exceptionId = uuidv4()
    const now = new Date()
    const expiryDate = new Date(now.getTime() + expiryDays * 24 * 60 * 60 * 1000)

    const exception = {
      id: exceptionId,
      controlId,
      controlName,
      status: EXCEPTION_STATUSES.PENDING,
      priority,
      reason,
      businessJustification,
      requestedBy,
      requestedAt: now.toISOString(),
      approverEmail,
      approvedBy: null,
      approvedAt: null,
      rejectedBy: null,
      rejectedAt: null,
      rejectionReason: null,
      expiryDate: expiryDate.toISOString(),
      expiryDays,
      autoExpired: false,
      history: [
        {
          timestamp: now.toISOString(),
          action: 'requested',
          actor: requestedBy,
          note: reason
        }
      ]
    }

    exceptions.push(exception)
    console.log(`✓ Exception requested: ${exceptionId} for control ${controlId}`)
    return exception
  } catch (error) {
    console.error(`❌ Failed to request exception:`, error.message)
    throw error
  }
}

/**
 * Approve an exception
 */
export function approveException(exceptionId, approverEmail, notes = '') {
  try {
    const exception = exceptions.find(e => e.id === exceptionId)
    if (!exception) {
      throw new Error(`Exception not found: ${exceptionId}`)
    }

    if (exception.status !== EXCEPTION_STATUSES.PENDING) {
      throw new Error(`Cannot approve exception with status: ${exception.status}`)
    }

    const now = new Date()
    exception.status = EXCEPTION_STATUSES.APPROVED
    exception.approvedBy = approverEmail
    exception.approvedAt = now.toISOString()

    exception.history.push({
      timestamp: now.toISOString(),
      action: 'approved',
      actor: approverEmail,
      note: notes || 'Approved'
    })

    console.log(`✓ Exception approved: ${exceptionId}`)
    return exception
  } catch (error) {
    console.error(`❌ Failed to approve exception:`, error.message)
    throw error
  }
}

/**
 * Reject an exception
 */
export function rejectException(exceptionId, rejectorEmail, rejectionReason) {
  try {
    const exception = exceptions.find(e => e.id === exceptionId)
    if (!exception) {
      throw new Error(`Exception not found: ${exceptionId}`)
    }

    if (exception.status !== EXCEPTION_STATUSES.PENDING) {
      throw new Error(`Cannot reject exception with status: ${exception.status}`)
    }

    if (!rejectionReason) {
      throw new Error('Rejection reason is required')
    }

    const now = new Date()
    exception.status = EXCEPTION_STATUSES.REJECTED
    exception.rejectedBy = rejectorEmail
    exception.rejectedAt = now.toISOString()
    exception.rejectionReason = rejectionReason

    exception.history.push({
      timestamp: now.toISOString(),
      action: 'rejected',
      actor: rejectorEmail,
      note: rejectionReason
    })

    console.log(`✓ Exception rejected: ${exceptionId}`)
    return exception
  } catch (error) {
    console.error(`❌ Failed to reject exception:`, error.message)
    throw error
  }
}

/**
 * Get all exceptions
 */
export function getAllExceptions() {
  return exceptions
}

/**
 * Get exceptions by status
 */
export function getExceptionsByStatus(status) {
  if (!Object.values(EXCEPTION_STATUSES).includes(status)) {
    throw new Error(`Invalid status: ${status}`)
  }
  return exceptions.filter(e => e.status === status)
}

/**
 * Get exceptions by control
 */
export function getExceptionsByControl(controlId) {
  return exceptions.filter(e => e.controlId === controlId)
}

/**
 * Get exception by ID
 */
export function getExceptionById(exceptionId) {
  return exceptions.find(e => e.id === exceptionId)
}

/**
 * Get pending approvals for approver
 */
export function getPendingApprovalsFor(approverEmail) {
  return exceptions.filter(
    e => e.status === EXCEPTION_STATUSES.PENDING && e.approverEmail === approverEmail
  )
}

/**
 * Check if control has valid exception
 */
export function hasValidException(controlId) {
  const now = new Date()
  return exceptions.some(
    e =>
      e.controlId === controlId &&
      e.status === EXCEPTION_STATUSES.APPROVED &&
      new Date(e.expiryDate) > now
  )
}

/**
 * Get active exceptions for controls
 */
export function getActiveExceptionsForControls(controlIds) {
  const now = new Date()
  const activeExceptions = {}

  controlIds.forEach(controlId => {
    activeExceptions[controlId] = exceptions.filter(
      e =>
        e.controlId === controlId &&
        e.status === EXCEPTION_STATUSES.APPROVED &&
        new Date(e.expiryDate) > now
    )
  })

  return activeExceptions
}

/**
 * Auto-expire old exceptions
 */
export function autoExpireExceptions() {
  const now = new Date()
  let expiredCount = 0

  exceptions.forEach(exception => {
    if (
      exception.status === EXCEPTION_STATUSES.APPROVED &&
      new Date(exception.expiryDate) <= now &&
      !exception.autoExpired
    ) {
      exception.status = EXCEPTION_STATUSES.EXPIRED
      exception.autoExpired = true

      exception.history.push({
        timestamp: now.toISOString(),
        action: 'auto_expired',
        actor: 'system',
        note: 'Automatically expired after expiry date'
      })

      expiredCount++
    }
  })

  if (expiredCount > 0) {
    console.log(`✓ Auto-expired ${expiredCount} exceptions`)
  }

  return expiredCount
}

/**
 * Calculate compliance excluding exceptions
 */
export function calculateComplianceWithExceptions(validations) {
  // Auto-expire first
  autoExpireExceptions()

  const now = new Date()
  let adjustedValidations = validations.map(v => {
    const controlExceptions = exceptions.filter(
      e =>
        e.controlId === v.id &&
        e.status === EXCEPTION_STATUSES.APPROVED &&
        new Date(e.expiryDate) > now
    )

    return {
      ...v,
      hasException: controlExceptions.length > 0,
      exceptions: controlExceptions,
      originalStatus: v.status,
      // If has valid exception, mark as passed for compliance calculation
      adjustedStatus: controlExceptions.length > 0 ? 'pass' : v.status
    }
  })

  // Recalculate compliance with adjusted statuses
  const adjustedSummary = {
    pass: adjustedValidations.filter(v => v.adjustedStatus === 'pass').length,
    fail: adjustedValidations.filter(v => v.adjustedStatus === 'fail').length,
    warn: adjustedValidations.filter(v => v.adjustedStatus === 'warn').length
  }

  const total = adjustedSummary.pass + adjustedSummary.fail + adjustedSummary.warn
  const adjustedScore = total > 0 ? Math.round((adjustedSummary.pass / total) * 100) : 0

  return {
    adjustedScore,
    adjustedSummary,
    adjustedValidations,
    exceptionCount: adjustedValidations.filter(v => v.hasException).length,
    complianceImprovement: adjustedScore - Math.round((validations.filter(v => v.status === 'pass').length / validations.length) * 100)
  }
}

/**
 * Get exception statistics
 */
export function getExceptionStats() {
  const now = new Date()

  return {
    total: exceptions.length,
    pending: exceptions.filter(e => e.status === EXCEPTION_STATUSES.PENDING).length,
    approved: exceptions.filter(
      e => e.status === EXCEPTION_STATUSES.APPROVED && new Date(e.expiryDate) > now
    ).length,
    rejected: exceptions.filter(e => e.status === EXCEPTION_STATUSES.REJECTED).length,
    expired: exceptions.filter(e => e.status === EXCEPTION_STATUSES.EXPIRED).length,
    byPriority: {
      critical: exceptions.filter(e => e.priority === EXCEPTION_PRIORITIES.CRITICAL).length,
      high: exceptions.filter(e => e.priority === EXCEPTION_PRIORITIES.HIGH).length,
      medium: exceptions.filter(e => e.priority === EXCEPTION_PRIORITIES.MEDIUM).length,
      low: exceptions.filter(e => e.priority === EXCEPTION_PRIORITIES.LOW).length
    }
  }
}

/**
 * Export statuses and priorities for API
 */
export const STATUSES = EXCEPTION_STATUSES
export const PRIORITIES = EXCEPTION_PRIORITIES
