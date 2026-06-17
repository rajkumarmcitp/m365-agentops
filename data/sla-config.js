// ============================================================
// SLA Configuration & Calculations
// Manages approval deadlines and escalation rules
// ============================================================

export const SLA_RULES = {
  'manager-only': {
    approvalHours: 24,
    escalationHours: 20,
    description: 'Manager approval within 24 hours'
  },
  'admin-only': {
    approvalHours: 48,
    escalationHours: 40,
    description: 'Admin approval within 48 hours'
  },
  'manager-then-admin': {
    approvalHours: 72,
    escalationHours: 60,
    description: 'Manager + Admin approval within 72 hours'
  },
  'no-approval': {
    approvalHours: 4,
    escalationHours: 2,
    description: 'Direct to agent within 4 hours'
  }
}

export function getSLADeadline(submittedDate, workflowType) {
  const slaRule = SLA_RULES[workflowType] || SLA_RULES['manager-only']
  const deadline = new Date(submittedDate)
  deadline.setHours(deadline.getHours() + slaRule.approvalHours)
  return deadline
}

export function getSLAStatus(submittedDate, workflowType, status) {
  // Don't show SLA for completed/rejected requests
  if (status === 'Completed' || status === 'Rejected') {
    return { status: 'done', remaining: 0, percentage: 100 }
  }

  const slaRule = SLA_RULES[workflowType] || SLA_RULES['manager-only']
  const deadline = getSLADeadline(submittedDate, workflowType)
  const now = new Date()
  const remaining = deadline.getTime() - now.getTime()
  const totalMs = slaRule.approvalHours * 60 * 60 * 1000
  const percentage = Math.max(0, Math.min(100, (remaining / totalMs) * 100))

  if (remaining < 0) {
    return {
      status: 'overdue',
      remaining: 0,
      percentage: 0,
      hours: 0,
      message: 'OVERDUE'
    }
  }

  const escalationMs = slaRule.escalationHours * 60 * 60 * 1000
  const isEscalating = remaining < escalationMs

  const hours = Math.floor(remaining / (60 * 60 * 1000))
  const minutes = Math.floor((remaining % (60 * 60 * 1000)) / (60 * 1000))

  return {
    status: isEscalating ? 'escalating' : 'active',
    remaining,
    percentage,
    hours,
    minutes,
    message: isEscalating
      ? `⚠️ ${hours}h ${minutes}m remaining`
      : `${hours}h ${minutes}m remaining`
  }
}

export function formatRemainingTime(remaining) {
  if (remaining <= 0) return 'OVERDUE'

  const hours = Math.floor(remaining / (60 * 60 * 1000))
  const minutes = Math.floor((remaining % (60 * 60 * 1000)) / (60 * 1000))

  if (hours > 0) return `${hours}h ${minutes}m`
  return `${minutes}m`
}

export function getSLAColor(slaStatus) {
  switch (slaStatus.status) {
    case 'overdue':
      return { bg: 'var(--clr-danger-bg)', text: 'var(--clr-danger-text)' }
    case 'escalating':
      return { bg: 'var(--clr-warning-bg)', text: 'var(--clr-warning-text)' }
    case 'active':
      return { bg: 'var(--clr-success-bg)', text: 'var(--clr-success-text)' }
    case 'done':
      return { bg: 'var(--color-background-secondary)', text: 'var(--color-text-secondary)' }
    default:
      return { bg: 'var(--color-background-secondary)', text: 'var(--color-text-secondary)' }
  }
}
