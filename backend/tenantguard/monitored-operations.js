// What to monitor and how to score it
export const MONITORED_OPERATIONS = {
  // CRITICAL (Score 90+)
  'Add role member': {
    name: 'Role Assignment',
    category: 'ADMIN',
    severity: 'CRITICAL',
    baseScore: 95,
    privilege: 100,
    security: 90,
    data: 85
  },
  'Consent to application': {
    name: 'OAuth App Consent',
    category: 'SECURITY',
    severity: 'CRITICAL',
    baseScore: 93,
    privilege: 85,
    security: 95,
    data: 90
  },
  'Update policy': {
    name: 'Policy Changed',
    category: 'ADMIN',
    severity: 'CRITICAL',
    baseScore: 92,
    privilege: 100,
    security: 95,
    data: 80
  },
  'Delete policy': {
    name: 'Policy Deleted',
    category: 'SECURITY',
    severity: 'CRITICAL',
    baseScore: 94,
    privilege: 95,
    security: 98,
    data: 85
  },
  'Disable Secure Defaults': {
    name: 'Security Defaults Disabled',
    category: 'SECURITY',
    severity: 'CRITICAL',
    baseScore: 99,
    privilege: 98,
    security: 100,
    data: 90
  },
  'Update authentication method': {
    name: 'MFA Configuration Changed',
    category: 'SECURITY',
    severity: 'CRITICAL',
    baseScore: 95,
    privilege: 90,
    security: 95,
    data: 75
  },

  // HIGH (Score 70-89)
  'Set-Mailbox': {
    name: 'Mailbox Configuration Changed',
    category: 'EXCHANGE',
    severity: 'HIGH',
    baseScore: 80,
    privilege: 75,
    security: 80,
    data: 85
  },
  'New-InboxRule': {
    name: 'Inbox Rule Created',
    category: 'EXCHANGE',
    severity: 'HIGH',
    baseScore: 78,
    privilege: 70,
    security: 80,
    data: 85
  },
  'New-TransportRule': {
    name: 'Transport Rule Created',
    category: 'EXCHANGE',
    severity: 'HIGH',
    baseScore: 82,
    privilege: 80,
    security: 75,
    data: 80
  },
  'Disable-DkimSigningConfig': {
    name: 'DKIM Disabled',
    category: 'EXCHANGE',
    severity: 'HIGH',
    baseScore: 84,
    privilege: 80,
    security: 85,
    data: 75
  },
  'Set-TransportRule': {
    name: 'Transport Rule Modified',
    category: 'EXCHANGE',
    severity: 'HIGH',
    baseScore: 80,
    privilege: 78,
    security: 72,
    data: 78
  },
  'Set user as mailbox delegate': {
    name: 'Mailbox Delegation Granted',
    category: 'EXCHANGE',
    severity: 'HIGH',
    baseScore: 76,
    privilege: 85,
    security: 80,
    data: 95
  },
  'Add app role assignment grant to user': {
    name: 'Application Permission Granted',
    category: 'APPLICATION',
    severity: 'HIGH',
    baseScore: 82,
    privilege: 88,
    security: 92,
    data: 90
  },

  // MEDIUM (Score 50-69)
  'Reset password': {
    name: 'Password Reset',
    category: 'USER',
    severity: 'MEDIUM',
    baseScore: 30,
    privilege: 50,
    security: 55,
    data: 60,
    frequency: 100
  },
  'Create user': {
    name: 'User Created',
    category: 'USER',
    severity: 'MEDIUM',
    baseScore: 40,
    privilege: 70,
    security: 65,
    data: 60
  },
  'Update user': {
    name: 'User Updated',
    category: 'USER',
    severity: 'MEDIUM',
    baseScore: 35,
    privilege: 65,
    security: 60,
    data: 50
  },
  'New-ServicePrincipal': {
    name: 'Service Principal Created',
    category: 'APPLICATION',
    severity: 'MEDIUM',
    baseScore: 55,
    privilege: 55,
    security: 60,
    data: 50
  },
  'New app registration': {
    name: 'App Registration Created',
    category: 'APPLICATION',
    severity: 'MEDIUM',
    baseScore: 58,
    privilege: 58,
    security: 62,
    data: 55
  },
  'Risky sign-in detected': {
    name: 'Risky Sign-in',
    category: 'SECURITY',
    severity: 'HIGH',
    baseScore: 75,
    privilege: 65,
    security: 85,
    data: 70
  }
}

export function getOperationConfig(operationName) {
  return MONITORED_OPERATIONS[operationName] || null
}

export function shouldMonitor(operationName) {
  return operationName in MONITORED_OPERATIONS
}
