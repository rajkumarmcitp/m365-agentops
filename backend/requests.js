// ============================================================
// Service Requests Management
// Store and manage service requests, approvals, audit logs
// ============================================================

import { createAuditLog } from './audit.js'

// In-memory storage (replace with database in production)
let requests = []
let requestCounter = 0

// ============================================================
// Request Model
// ============================================================
export function createRequest(operationId, fields, userEmail, validation) {
  const id = `REQ-${++requestCounter}`
  const now = new Date().toISOString()

  const request = {
    id,
    operationId,
    fields,
    submittedBy: userEmail,
    submittedAt: now,
    validation,
    status: validation?.autoApprove ? 'APPROVED' : 'PENDING_APPROVAL',
    approvals: [],
    comments: [],
    auditLog: [],
    provisioning: null,
    createdAt: now,
    updatedAt: now
  }

  requests.push(request)

  // Log request submission
  createAuditLog({
    action: 'REQUEST_SUBMITTED',
    requestId: id,
    user: userEmail,
    details: {
      operationId,
      riskLevel: validation?.riskLevel,
      autoApproved: validation?.autoApprove
    }
  })

  // If auto-approved, log that immediately
  if (validation?.autoApprove) {
    createAuditLog({
      action: 'REQUEST_AUTO_APPROVED',
      requestId: id,
      user: 'SYSTEM',
      details: {
        riskScore: validation.riskScore,
        reason: 'Low-risk request auto-approved by agent'
      }
    })
  }

  return request
}

// ============================================================
// Request Queries
// ============================================================
export function getRequestById(id) {
  return requests.find(r => r.id === id)
}

export function listRequests(filters = {}) {
  let result = [...requests]

  // Filter by status
  if (filters.status) {
    result = result.filter(r => r.status === filters.status)
  }

  // Filter by operation
  if (filters.operationId) {
    result = result.filter(r => r.operationId.startsWith(filters.operationId))
  }

  // Filter by user
  if (filters.submittedBy) {
    result = result.filter(r => r.submittedBy === filters.submittedBy)
  }

  // Filter by approver (requests awaiting their approval)
  if (filters.pendingApprovalBy) {
    result = result.filter(r => {
      const nextApproval = getNextApprovalStep(r)
      return nextApproval && nextApproval.approverRole === filters.pendingApprovalBy
    })
  }

  // Sort by most recent
  result.sort((a, b) => new Date(b.submittedAt) - new Date(a.submittedAt))

  return result
}

// ============================================================
// Approval Workflow
// ============================================================
export function getNextApprovalStep(request) {
  if (request.status !== 'PENDING_APPROVAL') return null

  const approvalPath = request.validation?.approvalPath || ['manager', 'it', 'agent', 'action']

  // Find next step not yet approved
  for (const step of approvalPath) {
    if (step === 'agent') continue // Agent auto-validates
    if (step === 'action') continue // System action

    const approved = request.approvals.find(a => a.step === step && a.status === 'APPROVED')
    if (!approved) {
      return {
        step,
        approverRole: step,
        status: 'PENDING'
      }
    }
  }

  return null
}

export function approveRequest(requestId, approverEmail, approverRole, comment = '') {
  const request = getRequestById(requestId)
  if (!request) throw new Error('Request not found')

  const nextStep = getNextApprovalStep(request)
  if (!nextStep) throw new Error('No pending approvals for this request')

  if (nextStep.step !== approverRole && approverRole !== 'admin') {
    throw new Error(`Not authorized to approve this step. Expected: ${nextStep.step}`)
  }

  // Add approval
  request.approvals.push({
    step: approverRole,
    status: 'APPROVED',
    approverEmail,
    approverName: approverEmail.split('@')[0],
    approvedAt: new Date().toISOString(),
    comment
  })

  request.updatedAt = new Date().toISOString()

  // Check if all approvals complete
  const allSteps = request.validation?.approvalPath || ['manager', 'it', 'agent', 'action']
  const approved = request.approvals.filter(a => a.status === 'APPROVED')
  const requiredSteps = allSteps.filter(s => s !== 'agent' && s !== 'action')

  if (approved.length >= requiredSteps.length) {
    request.status = 'APPROVED'
    createAuditLog({
      action: 'REQUEST_APPROVED',
      requestId,
      user: approverEmail,
      details: {
        step: approverRole,
        allApprovalsComplete: true,
        riskLevel: request.validation?.riskLevel,
        riskScore: request.validation?.riskScore,
        comment
      }
    })
    return request
  }

  createAuditLog({
    action: 'REQUEST_STEP_APPROVED',
    requestId,
    user: approverEmail,
    details: {
      step: approverRole,
      nextStep: getNextApprovalStep(request)?.step,
      riskLevel: request.validation?.riskLevel,
      riskScore: request.validation?.riskScore,
      comment
    }
  })

  return request
}

export function rejectRequest(requestId, rejectorEmail, rejectorRole, reason) {
  const request = getRequestById(requestId)
  if (!request) throw new Error('Request not found')

  request.status = 'REJECTED'
  request.approvals.push({
    step: rejectorRole,
    status: 'REJECTED',
    approverEmail: rejectorEmail,
    approverName: rejectorEmail.split('@')[0],
    rejectedAt: new Date().toISOString(),
    reason
  })

  request.updatedAt = new Date().toISOString()

  createAuditLog({
    action: 'REQUEST_REJECTED',
    requestId,
    user: rejectorEmail,
    details: {
      step: rejectorRole,
      reason,
      riskLevel: request.validation?.riskLevel,
      riskScore: request.validation?.riskScore
    }
  })

  return request
}

export function addComment(requestId, userEmail, userName, text) {
  const request = getRequestById(requestId)
  if (!request) throw new Error('Request not found')

  request.comments.push({
    id: `COMMENT-${Date.now()}`,
    userEmail,
    userName,
    text,
    createdAt: new Date().toISOString()
  })

  request.updatedAt = new Date().toISOString()

  createAuditLog({
    action: 'REQUEST_COMMENT_ADDED',
    requestId,
    user: userEmail,
    details: {
      comment: text.substring(0, 100)
    }
  })

  return request
}

// ============================================================
// Provisioning Status
// ============================================================
export function markProvisioning(requestId, systemAction) {
  const request = getRequestById(requestId)
  if (!request) throw new Error('Request not found')

  request.provisioning = {
    status: 'IN_PROGRESS',
    systemAction,
    startedAt: new Date().toISOString(),
    result: null
  }

  createAuditLog({
    action: 'PROVISIONING_STARTED',
    requestId,
    user: 'SYSTEM',
    details: {
      systemAction
    }
  })

  return request
}

export function markProvisioningSuccess(requestId, result) {
  const request = getRequestById(requestId)
  if (!request) throw new Error('Request not found')

  if (!request.provisioning) {
    request.provisioning = {
      status: 'COMPLETED',
      systemAction: 'Unknown',
      startedAt: new Date().toISOString()
    }
  }

  request.provisioning.status = 'COMPLETED'
  request.provisioning.result = result
  request.provisioning.completedAt = new Date().toISOString()
  request.status = 'COMPLETED'
  request.updatedAt = new Date().toISOString()

  createAuditLog({
    action: 'PROVISIONING_COMPLETED',
    requestId,
    user: 'SYSTEM',
    details: {
      result: result || 'Success'
    }
  })

  return request
}

export function markProvisioningFailed(requestId, error) {
  const request = getRequestById(requestId)
  if (!request) throw new Error('Request not found')

  if (!request.provisioning) {
    request.provisioning = {
      status: 'FAILED',
      systemAction: 'Unknown',
      startedAt: new Date().toISOString()
    }
  }

  request.provisioning.status = 'FAILED'
  request.provisioning.error = error
  request.provisioning.failedAt = new Date().toISOString()
  request.status = 'FAILED'
  request.updatedAt = new Date().toISOString()

  createAuditLog({
    action: 'PROVISIONING_FAILED',
    requestId,
    user: 'SYSTEM',
    details: {
      error: error.substring(0, 200)
    }
  })

  return request
}

// ============================================================
// Statistics
// ============================================================
export function getRequestStats() {
  const stats = {
    total: requests.length,
    pending: requests.filter(r => r.status === 'PENDING_APPROVAL').length,
    approved: requests.filter(r => r.status === 'APPROVED').length,
    completed: requests.filter(r => r.status === 'COMPLETED').length,
    rejected: requests.filter(r => r.status === 'REJECTED').length,
    failed: requests.filter(r => r.status === 'FAILED').length,
    avgApprovalTime: calculateAvgApprovalTime(),
    byOperationType: groupByOperation(),
    byRiskLevel: groupByRiskLevel()
  }
  return stats
}

function calculateAvgApprovalTime() {
  const completed = requests.filter(r => r.status === 'COMPLETED')
  if (completed.length === 0) return 0

  const totalTime = completed.reduce((sum, r) => {
    const submitted = new Date(r.submittedAt)
    const completed = new Date(r.provisioning?.completedAt || r.updatedAt)
    return sum + (completed - submitted)
  }, 0)

  return Math.round(totalTime / completed.length / 1000 / 60) // minutes
}

function groupByOperation() {
  const groups = {}
  requests.forEach(r => {
    const op = r.operationId.split('-')[0]
    groups[op] = (groups[op] || 0) + 1
  })
  return groups
}

function groupByRiskLevel() {
  const groups = { LOW: 0, MEDIUM: 0, HIGH: 0, CRITICAL: 0 }
  requests.forEach(r => {
    const level = r.validation?.riskLevel || 'MEDIUM'
    groups[level] = (groups[level] || 0) + 1
  })
  return groups
}
