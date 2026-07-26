/**
 * Normalized Conditional Access Control Framework
 * 38 unique controls with persona/scope metadata
 * Sequential numbering: Con-001 to Con-038
 * Eliminates duplicates by using policy scope instead of separate controls
 */

export const normalizedControls = [
  // Policy Foundation & Governance (2 controls)
  { id: 'Con-001', name: 'Conditional Access Enabled with Production Policies', category: 'Policy Foundation', severity: 'Critical', appliesTo: ['All'] },
  { id: 'Con-002', name: 'Emergency / Break Glass Accounts Excluded & Validated', category: 'Policy Foundation', severity: 'Critical', appliesTo: ['All'] },

  // Authentication & MFA (5 controls)
  { id: 'Con-003', name: 'Require Multi-Factor Authentication', category: 'Identity Protection', severity: 'Critical', appliesTo: ['All Users', 'Guest Users', 'Developers', 'Privileged Roles', 'Workload Identities'] },
  { id: 'Con-004', name: 'Authentication Strength Configured', category: 'Identity Protection', severity: 'Critical', appliesTo: ['Privileged Roles', 'Global Administrators'] },
  { id: 'Con-005', name: 'Phishing Resistant MFA Required', category: 'Identity Protection', severity: 'Critical', appliesTo: ['Global Administrators', 'Privileged Roles'] },
  { id: 'Con-006', name: 'Passwordless Authentication Supported', category: 'Identity Protection', severity: 'High', appliesTo: ['All Users'] },
  { id: 'Con-007', name: 'Conditional Access Insights & Reporting Enabled', category: 'Identity Protection', severity: 'High', appliesTo: ['All'] },

  // Risk & Incident Response (3 controls)
  { id: 'Con-008', name: 'User Risk Policy Configured', category: 'Risk Management', severity: 'High', appliesTo: ['All Users', 'Developers', 'Privileged Roles'] },
  { id: 'Con-009', name: 'Sign-in Risk Policy Configured', category: 'Risk Management', severity: 'High', appliesTo: ['All Users', 'Developers', 'Privileged Roles'] },
  { id: 'Con-010', name: 'Block High Risk Users', category: 'Risk Management', severity: 'High', appliesTo: ['All Users'] },

  // Administrative Protection (6 controls)
  { id: 'Con-011', name: 'Global Administrators Protected', category: 'Administrative Protection', severity: 'Critical', appliesTo: ['Global Administrators'] },
  { id: 'Con-012', name: 'Privileged Roles Protected', category: 'Administrative Protection', severity: 'Critical', appliesTo: ['Privileged Roles'] },
  { id: 'Con-013', name: 'Azure Portal Protected', category: 'Administrative Protection', severity: 'Critical', appliesTo: ['Privileged Roles'] },
  { id: 'Con-014', name: 'Administrators Blocked From Unmanaged Devices', category: 'Administrative Protection', severity: 'Critical', appliesTo: ['Global Administrators', 'Privileged Roles'] },
  { id: 'Con-015', name: 'Administrator Sign-ins Restricted to Trusted Locations', category: 'Administrative Protection', severity: 'High', appliesTo: ['Global Administrators', 'Privileged Roles'] },
  { id: 'Con-016', name: 'Administrator Session Controls', category: 'Administrative Protection', severity: 'High', appliesTo: ['Global Administrators', 'Privileged Roles', 'Developers'] },

  // Device Trust & Compliance (2 controls)
  { id: 'Con-017', name: 'Require Compliant Device', category: 'Device Trust', severity: 'High', appliesTo: ['All Users', 'Developers', 'Privileged Roles'] },
  { id: 'Con-018', name: 'Require Hybrid Entra Joined Device', category: 'Device Trust', severity: 'High', appliesTo: ['Privileged Roles'] },

  // Application Protection (1 control)
  { id: 'Con-019', name: 'Session Controls Applied to High Value Applications', category: 'Application Protection', severity: 'High', appliesTo: ['All'] },

  // Network & Location Controls (5 controls)
  { id: 'Con-020', name: 'Named Locations Configured', category: 'Network Protection', severity: 'High', appliesTo: ['All'] },
  { id: 'Con-021', name: 'Trusted Locations Configured', category: 'Network Protection', severity: 'High', appliesTo: ['All'] },
  { id: 'Con-022', name: 'High Risk Countries Restricted', category: 'Network Protection', severity: 'High', appliesTo: ['All Users'] },
  { id: 'Con-023', name: 'Anonymous IP Addresses Restricted', category: 'Network Protection', severity: 'High', appliesTo: ['All Users'] },
  { id: 'Con-024', name: 'Location-based Conditional Access Implemented', category: 'Network Protection', severity: 'High', appliesTo: ['All'] },

  // Client & Legacy Authentication (3 controls)
  { id: 'Con-025', name: 'Legacy Authentication Blocked', category: 'Client Application Protection', severity: 'Critical', appliesTo: ['All Users'] },
  { id: 'Con-026', name: 'Browser Access Protected', category: 'Client Application Protection', severity: 'High', appliesTo: ['All Users'] },
  { id: 'Con-027', name: 'Mobile Applications Protected', category: 'Client Application Protection', severity: 'High', appliesTo: ['All Users'] },

  // Session Management (5 controls)
  { id: 'Con-028', name: 'Sign-in Frequency Configured', category: 'Session Protection', severity: 'High', appliesTo: ['Global Administrators', 'Privileged Roles', 'Developers'] },
  { id: 'Con-029', name: 'Persistent Browser Session Controlled', category: 'Session Protection', severity: 'Medium', appliesTo: ['All Users'] },
  { id: 'Con-030', name: 'Application Enforced Restrictions Enabled', category: 'Session Protection', severity: 'High', appliesTo: ['All'] },
  { id: 'Con-031', name: 'Microsoft Defender for Cloud Apps Session Control', category: 'Session Protection', severity: 'High', appliesTo: ['All'] },
  { id: 'Con-032', name: 'Token Protection Enabled', category: 'Session Protection', severity: 'High', appliesTo: ['All'] },

  // Continuous Access Evaluation (1 control)
  { id: 'Con-033', name: 'Continuous Access Evaluation Enabled', category: 'Session Protection', severity: 'High', appliesTo: ['All'] },

  // Workload Identity (5 controls)
  { id: 'Con-034', name: 'Workload Identity Conditional Access Enabled', category: 'Workload Identity Protection', severity: 'High', appliesTo: ['Workload Identities'] },
  { id: 'Con-035', name: 'Service Principals Protected', category: 'Workload Identity Protection', severity: 'High', appliesTo: ['Workload Identities'] },
  { id: 'Con-036', name: 'Managed Identities Protected', category: 'Workload Identity Protection', severity: 'High', appliesTo: ['Workload Identities'] },
  { id: 'Con-037', name: 'Authentication Context Applied', category: 'Workload Identity Protection', severity: 'High', appliesTo: ['Workload Identities'] },
  { id: 'Con-038', name: 'High-Risk Workload Identities Blocked', category: 'Workload Identity Protection', severity: 'High', appliesTo: ['Workload Identities'] }
]

/**
 * Map of normalized control IDs to original duplicate IDs for reference
 */
export const controlIdMap = {
  'Con-001': ['Con-001', 'Con-120'],
  'Con-002': ['Con-007', 'Con-028', 'Con-127'],
  'Con-003': ['Con-010', 'Con-110'],
  'Con-004': ['Con-011', 'Con-111'],
  'Con-005': ['Con-012', 'Con-026'],
  'Con-008': ['Con-014', 'Con-114'],
  'Con-009': ['Con-015', 'Con-113'],
  'Con-010': ['Con-016'],
  'Con-011': ['Con-020'],
  'Con-012': ['Con-021'],
  'Con-013': ['Con-022'],
  'Con-014': ['Con-027'],
  'Con-015': ['Con-029'],
  'Con-016': ['Con-031'],
  'Con-017': ['Con-040', 'Con-112'],
  'Con-018': ['Con-041'],
  'Con-019': ['Con-086'],
  'Con-020': ['Con-060'],
  'Con-021': ['Con-061'],
  'Con-022': ['Con-063'],
  'Con-023': ['Con-064'],
  'Con-024': ['Con-066'],
  'Con-025': ['Con-070'],
  'Con-026': ['Con-071'],
  'Con-027': ['Con-072'],
  'Con-028': ['Con-080'],
  'Con-029': ['Con-081'],
  'Con-030': ['Con-082'],
  'Con-031': ['Con-083'],
  'Con-032': ['Con-085'],
  'Con-033': ['Con-084'],
  'Con-034': ['Con-100'],
  'Con-035': ['Con-101'],
  'Con-036': ['Con-102'],
  'Con-037': ['Con-104'],
  'Con-038': ['Con-106']
}

/**
 * Get a normalized control by ID
 */
export function getNormalizedControl(controlId) {
  return normalizedControls.find(c => c.id === controlId)
}

/**
 * Get all normalized controls for a specific persona
 */
export function getControlsByPersona(persona) {
  return normalizedControls.filter(c => c.appliesTo.includes(persona) || c.appliesTo.includes('All'))
}

/**
 * Get all normalized controls for a specific category
 */
export function getControlsByCategory(category) {
  return normalizedControls.filter(c => c.category === category)
}

/**
 * Get all normalized controls with their original duplicate IDs
 */
export function getControlsWithHistory() {
  return normalizedControls.map(control => ({
    ...control,
    originalIds: controlIdMap[control.id] || [control.id]
  }))
}

export default normalizedControls
