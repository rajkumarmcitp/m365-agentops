// ============================================================
// Approval Routing Rules
// Maps services to approval workflows
// ============================================================

export const APPROVAL_WORKFLOWS = {
  // Exchange Services
  'exchange-groups': {
    'create-m365-group': 'manager-then-admin',
    'add-m365-members': 'manager-only',
    'remove-m365-members': 'manager-only',
    'archive-m365-group': 'manager-then-admin',
  },
  'shared-mailbox': {
    'create-shared-mailbox': 'admin-only',
    'delete-shared-mailbox': 'admin-only',
  },
  'room-equipment': {
    'create-room-mailbox': 'manager-then-admin',
  },
  'email-services': {
    'configure-email-services': 'admin-only',
  },

  // Teams Services
  'teams': {
    'create-team': 'manager-only',
    'add-team-members': 'manager-only',
    'delete-team': 'manager-then-admin',
    'configure-team-privacy': 'manager-then-admin',
  },

  // SharePoint Services
  'sharepoint': {
    'create-site': 'manager-only',
    'create-library': 'manager-only',
    'request-access': 'manager-only',
  },

  // OneDrive Services
  'onedrive': {
    'increase-storage': 'manager-only',
    'access-former-employee': 'admin-only',
  },

  // External Sharing
  'ext-sharing': {
    'invite-guest': 'manager-only',
    'extend-guest-access': 'manager-only',
    'remove-guest': 'admin-only',
  },

  // User Access
  'user-access': {
    'request-access': 'manager-only',
    'request-mailbox-access': 'manager-only',
  },

  // Licenses
  'licenses': {
    'assign-license': 'manager-only',
    'remove-license': 'admin-only',
  },

  // Copilot
  'copilot': {
    'request-copilot': 'manager-then-admin',
    'remove-copilot': 'admin-only',
  },

  // Power Platform
  'power-platform': {
    'request-environment': 'manager-then-admin',
    'request-premium-connector': 'admin-only',
  },

  // Intune
  'intune': {
    'retire-device': 'admin-only',
    'wipe-device': 'admin-only',
  },

  // Guest Lifecycle
  'guest-lifecycle': {
    'invite-guest': 'manager-only',
    'extend-guest': 'manager-only',
    'remove-guest': 'admin-only',
  },
}

// Workflow types define the approval steps
export const WORKFLOW_TYPES = {
  'no-approval': {
    name: 'No Approval Required',
    description: 'Request goes directly to agent for processing',
    steps: ['submit', 'agent', 'action', 'done'],
    icon: 'ti-zap',
    color: 'success',
  },
  'manager-only': {
    name: 'Manager Approval Only',
    description: 'Only manager approval required',
    steps: ['submit', 'manager', 'agent', 'action', 'done'],
    icon: 'ti-user-check',
    color: 'warning',
  },
  'admin-only': {
    name: 'Admin Approval Only',
    description: 'Only admin/IT approval required',
    steps: ['submit', 'it', 'agent', 'action', 'done'],
    icon: 'ti-shield-check',
    color: 'danger',
  },
  'manager-then-admin': {
    name: 'Manager → Admin Approval',
    description: 'Manager approval first, then admin approval',
    steps: ['submit', 'manager', 'it', 'agent', 'action', 'done'],
    icon: 'ti-git-compare',
    color: 'info',
  },
}

// Get approval workflow for a service/operation
export function getApprovalWorkflow(serviceId, operationId) {
  const serviceWorkflows = APPROVAL_WORKFLOWS[serviceId]
  if (!serviceWorkflows) return 'manager-only' // default

  const workflow = serviceWorkflows[operationId]
  return workflow || 'manager-only' // default
}

// Get workflow definition (steps and details)
export function getWorkflowDefinition(workflowType) {
  return WORKFLOW_TYPES[workflowType] || WORKFLOW_TYPES['manager-only']
}

// Get all workflow types
export function getAllWorkflowTypes() {
  return Object.entries(WORKFLOW_TYPES).map(([id, def]) => ({
    id,
    ...def,
  }))
}

// Check if operation needs specific approval level
export function needsManagerApproval(serviceId, operationId) {
  const workflow = getApprovalWorkflow(serviceId, operationId)
  return workflow.includes('manager')
}

export function needsAdminApproval(serviceId, operationId) {
  const workflow = getApprovalWorkflow(serviceId, operationId)
  return workflow.includes('admin') || workflow.includes('it')
}

export function needsApproval(serviceId, operationId) {
  const workflow = getApprovalWorkflow(serviceId, operationId)
  return workflow !== 'no-approval'
}
