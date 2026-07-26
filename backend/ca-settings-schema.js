/**
 * Conditional Access Settings Schema & Validation
 * Flattened representation of all CA policy configurable settings
 * Maps to Microsoft Graph CA Policy schema
 */

export const caSettingsSchema = {
  // Basic Policy Settings
  displayName: { type: 'string', category: 'Policy', required: true },
  state: { type: 'enum', values: ['enabled', 'disabled', 'enabledForReportingButNotEnforced'], category: 'Policy' },
  templateId: { type: 'string', category: 'Policy' },

  // User Conditions
  includeUsers: { type: 'array', category: 'Conditions.Users' },
  excludeUsers: { type: 'array', category: 'Conditions.Users' },
  includeGroups: { type: 'array', category: 'Conditions.Users' },
  excludeGroups: { type: 'array', category: 'Conditions.Users' },
  includeRoles: { type: 'array', category: 'Conditions.Users' },
  excludeRoles: { type: 'array', category: 'Conditions.Users' },
  includeGuestsOrExternalUsers: { type: 'object', category: 'Conditions.Users' },
  excludeGuestsOrExternalUsers: { type: 'object', category: 'Conditions.Users' },

  // Application Conditions
  includeApplications: { type: 'array', category: 'Conditions.Applications' },
  excludeApplications: { type: 'array', category: 'Conditions.Applications' },
  includeUserActions: { type: 'array', category: 'Conditions.Applications' },
  includeAuthenticationContextClassReferences: { type: 'array', category: 'Conditions.Applications' },
  applicationFilterMode: { type: 'enum', values: ['include', 'exclude'], category: 'Conditions.Applications' },
  applicationFilterRule: { type: 'string', category: 'Conditions.Applications' },

  // Client & Platform Conditions
  clientAppTypes: { type: 'array', values: ['browser', 'mobileAppsAndDesktopClients', 'exchangeActiveSync', 'other'], category: 'Conditions.Client' },
  includePlatforms: { type: 'array', category: 'Conditions.Platform' },
  excludePlatforms: { type: 'array', category: 'Conditions.Platform' },

  // Location Conditions
  includeLocations: { type: 'array', category: 'Conditions.Location' },
  excludeLocations: { type: 'array', category: 'Conditions.Location' },

  // Device Conditions
  deviceFilterMode: { type: 'enum', values: ['include', 'exclude'], category: 'Conditions.Device' },
  deviceFilterRule: { type: 'string', category: 'Conditions.Device' },
  includeDeviceStates: { type: 'array', category: 'Conditions.Device' },
  excludeDeviceStates: { type: 'array', category: 'Conditions.Device' },

  // Risk Conditions
  signInRiskLevels: { type: 'array', values: ['low', 'medium', 'high'], category: 'Conditions.Risk' },
  userRiskLevels: { type: 'array', values: ['low', 'medium', 'high'], category: 'Conditions.Risk' },
  servicePrincipalRiskLevels: { type: 'array', values: ['low', 'medium', 'high'], category: 'Conditions.Risk' },

  // Service Principal & Insider Risk
  includeServicePrincipals: { type: 'array', category: 'Conditions.ServicePrincipal' },
  excludeServicePrincipals: { type: 'array', category: 'Conditions.ServicePrincipal' },
  insiderRiskLevels: { type: 'array', category: 'Conditions.Risk' },

  // Authentication Flow
  transferMethods: { type: 'array', category: 'Conditions.AuthFlow' },

  // Grant Controls
  grantOperator: { type: 'enum', values: ['AND', 'OR'], category: 'GrantControls' },
  grantMFA: { type: 'boolean', category: 'GrantControls' },
  grantCompliantDevice: { type: 'boolean', category: 'GrantControls' },
  grantHybridJoinedDevice: { type: 'boolean', category: 'GrantControls' },
  grantApprovedApplication: { type: 'boolean', category: 'GrantControls' },
  grantCompliantApplication: { type: 'boolean', category: 'GrantControls' },
  grantPasswordChange: { type: 'boolean', category: 'GrantControls' },
  grantBlockAccess: { type: 'boolean', category: 'GrantControls' },
  authenticationStrength: { type: 'string', category: 'GrantControls' },
  termsOfUse: { type: 'array', category: 'GrantControls' },
  customAuthenticationFactors: { type: 'array', category: 'GrantControls' },

  // Session Controls
  applicationEnforcedRestrictions: { type: 'boolean', category: 'SessionControls' },
  cloudAppSecurityMode: { type: 'enum', values: ['monitorOnly', 'blockDownloads', 'mcasConfigured'], category: 'SessionControls' },
  persistentBrowserMode: { type: 'enum', values: ['always', 'never'], category: 'SessionControls' },
  signInFrequencyEnabled: { type: 'boolean', category: 'SessionControls' },
  signInFrequencyType: { type: 'enum', values: ['hours', 'days'], category: 'SessionControls' },
  signInFrequencyValue: { type: 'number', category: 'SessionControls' },
  signInFrequencyAuthType: { type: 'enum', values: ['primaryAndSecondaryAuthentication', 'primaryAuthentication'], category: 'SessionControls' },
  disableResilienceDefaults: { type: 'boolean', category: 'SessionControls' },
  continuousAccessEvaluation: { type: 'enum', values: ['strict', 'disabled'], category: 'SessionControls' },
  secureSignInSession: { type: 'boolean', category: 'SessionControls' }
}

/**
 * Control Validation Rules
 * Maps each control to required CA settings
 */
export const controlValidationRules = {
  // Policy Foundation
  'Con-001': {
    name: 'Conditional Access Enabled with Production Policies',
    requiredSettings: [
      { setting: 'state', values: ['enabled'], reason: 'At least one CA policy must be enabled in production' }
    ],
    description: 'At least one CA policy must be in enabled state for production use'
  },

  'Con-002': {
    name: 'Emergency / Break Glass Accounts Excluded & Validated',
    requiredSettings: [
      { setting: 'excludeUsers', values: ['required'], reason: 'Break glass accounts must be excluded from CA policies' }
    ],
    description: 'Emergency access accounts must be excluded from all CA policies'
  },

  // Identity Protection
  'Con-003': {
    name: 'Require Multi-Factor Authentication',
    requiredSettings: [
      { setting: 'grantMFA', values: [true], reason: 'MFA must be required in grant controls' }
    ],
    description: 'Policies must require multi-factor authentication for user access'
  },

  'Con-004': {
    name: 'Authentication Strength Configured',
    requiredSettings: [
      { setting: 'authenticationStrength', values: ['required'], reason: 'Authentication strength must be configured in at least one policy' }
    ],
    description: 'At least one policy must specify an authentication strength requirement'
  },

  'Con-005': {
    name: 'Phishing Resistant MFA Required',
    requiredSettings: [
      { setting: 'authenticationStrength', values: ['Phishing Resistant'], reason: 'Must require phishing-resistant authentication methods' }
    ],
    description: 'Policies must require phishing-resistant MFA (FIDO2, Certificate, Passkey, Windows Hello)'
  },

  'Con-006': {
    name: 'Passwordless Authentication Supported',
    requiredSettings: [
      { setting: 'authenticationStrength', values: ['Passwordless Phone Sign-in', 'Windows Hello', 'FIDO2'], reason: 'Must support passwordless methods' }
    ],
    description: 'Policies must support passwordless authentication methods'
  },

  'Con-007': {
    name: 'Conditional Access Insights & Reporting Enabled',
    requiredSettings: [
      { setting: 'state', values: ['enabled', 'enabledForReportingButNotEnforced'], reason: 'CA must be enabled or in report-only mode for reporting' }
    ],
    description: 'CA policies must be available for insights and reporting'
  },

  // Risk Management
  'Con-008': {
    name: 'User Risk Policy Configured',
    requiredSettings: [
      { setting: 'userRiskLevels', values: ['required'], reason: 'User risk levels must be evaluated' },
      { setting: 'grantBlockAccess', values: [true], reason: 'High-risk users must be blocked' }
    ],
    description: 'Policies must evaluate user risk levels and block high-risk users'
  },

  'Con-009': {
    name: 'Sign-in Risk Policy Configured',
    requiredSettings: [
      { setting: 'signInRiskLevels', values: ['required'], reason: 'Sign-in risk levels must be evaluated' },
      { setting: 'grantBlockAccess', values: [true], reason: 'High-risk sign-ins must be blocked' }
    ],
    description: 'Policies must evaluate sign-in risk and block high-risk authentication attempts'
  },

  'Con-010': {
    name: 'Block High Risk Users',
    requiredSettings: [
      { setting: 'userRiskLevels', values: ['high'], reason: 'High user risk must be evaluated' },
      { setting: 'grantBlockAccess', values: [true], reason: 'High risk users must be blocked' }
    ],
    description: 'Policies must block access for users with high risk levels'
  },

  // Administrative Protection
  'Con-011': {
    name: 'Global Administrators Protected',
    requiredSettings: [
      { setting: 'includeRoles', values: ['Global Administrator', 'required'], reason: 'Global Admins must be included in protection policy' },
      { setting: 'grantMFA', values: [true], reason: 'Global Admins must require MFA' }
    ],
    description: 'Policies must protect Global Administrator role with MFA'
  },

  'Con-012': {
    name: 'Privileged Roles Protected',
    requiredSettings: [
      { setting: 'includeRoles', values: ['required'], reason: 'Privileged roles must be included' },
      { setting: 'grantMFA', values: [true], reason: 'Privileged roles must require MFA' }
    ],
    description: 'Policies must protect all privileged administrative roles'
  },

  'Con-013': {
    name: 'Azure Portal Protected',
    requiredSettings: [
      { setting: 'includeApplications', values: ['required'], reason: 'Azure Portal must be targeted' },
      { setting: 'grantMFA', values: [true], reason: 'Azure Portal access must require MFA' }
    ],
    description: 'Azure Portal access must be protected with MFA'
  },

  'Con-014': {
    name: 'Administrators Blocked From Unmanaged Devices',
    requiredSettings: [
      { setting: 'includeRoles', values: ['required'], reason: 'Admins must be included' },
      { setting: 'includeDeviceStates', values: ['required'], reason: 'Device compliance must be evaluated' },
      { setting: 'grantBlockAccess', values: [true], reason: 'Unmanaged devices must be blocked' }
    ],
    description: 'Administrators must not access from unmanaged devices'
  },

  'Con-015': {
    name: 'Administrator Sign-ins Restricted to Trusted Locations',
    requiredSettings: [
      { setting: 'includeRoles', values: ['required'], reason: 'Admin roles must be included' },
      { setting: 'includeLocations', values: ['required'], reason: 'Trusted locations must be configured' }
    ],
    description: 'Administrator sign-ins must be restricted to trusted locations'
  },

  'Con-016': {
    name: 'Administrator Session Controls',
    requiredSettings: [
      { setting: 'includeRoles', values: ['required'], reason: 'Privileged roles must be included' },
      { setting: 'signInFrequencyEnabled', values: [true], reason: 'Sign-in frequency must be enforced' }
    ],
    description: 'Policies must enforce session controls for administrators'
  },

  // Device Trust
  'Con-017': {
    name: 'Require Compliant Device',
    requiredSettings: [
      { setting: 'grantCompliantDevice', values: [true], reason: 'Compliant devices must be required' }
    ],
    description: 'Policies must require compliant devices'
  },

  'Con-018': {
    name: 'Require Hybrid Entra Joined Device',
    requiredSettings: [
      { setting: 'grantHybridJoinedDevice', values: [true], reason: 'Hybrid-joined devices must be required' }
    ],
    description: 'Policies must require hybrid Azure AD joined devices'
  },

  // Application Protection (was Con-020)
  'Con-019': {
    name: 'Session Controls Applied to High Value Applications',
    requiredSettings: [
      { setting: 'includeApplications', values: ['required'], reason: 'High-value apps must be targeted' },
      { setting: 'applicationEnforcedRestrictions', values: [true], reason: 'Session controls must be enabled' }
    ],
    description: 'Policies must apply session controls to critical applications'
  },

  // Network Protection (was Con-021 to Con-025)
  'Con-020': {
    name: 'Named Locations Configured',
    requiredSettings: [
      { setting: 'includeLocations', values: ['required'], reason: 'Named locations must be configured in at least one policy' }
    ],
    description: 'Policies must reference and enforce named location conditions'
  },

  'Con-021': {
    name: 'Trusted Locations Configured',
    requiredSettings: [
      { setting: 'includeLocations', values: ['required'], reason: 'Trusted locations must be configured' }
    ],
    description: 'Policies must enforce trusted network location requirements'
  },

  'Con-022': {
    name: 'High Risk Countries Restricted',
    requiredSettings: [
      { setting: 'excludeLocations', values: ['required'], reason: 'High-risk countries must be explicitly excluded' },
      { setting: 'grantBlockAccess', values: [true], reason: 'Access from excluded countries must be blocked' }
    ],
    description: 'Policies must block access from high-risk countries/regions'
  },

  'Con-023': {
    name: 'Anonymous IP Addresses Restricted',
    requiredSettings: [
      { setting: 'signInRiskLevels', values: ['required'], reason: 'Sign-in risk levels must be evaluated' },
      { setting: 'grantBlockAccess', values: [true], reason: 'High-risk sign-ins (including anonymous IP) must be blocked' }
    ],
    description: 'Policy must block access from high-risk sign-ins, which includes anonymous IPs detected by Entra ID'
  },

  'Con-024': {
    name: 'Location-based Conditional Access Implemented',
    requiredSettings: [
      { setting: 'includeLocations', values: ['required'], reason: 'Location conditions must be configured' }
    ],
    description: 'Policies must evaluate and enforce location-based access controls'
  },

  // Client Application Protection (was Con-026 to Con-028)
  'Con-025': {
    name: 'Legacy Authentication Blocked',
    requiredSettings: [
      { setting: 'clientAppTypes', values: ['exchangeActiveSync', 'otherClients'], reason: 'Legacy clients must be targeted' },
      { setting: 'grantBlockAccess', values: [true], reason: 'Legacy auth must be blocked' }
    ],
    description: 'Policies must block legacy authentication protocols'
  },

  'Con-026': {
    name: 'Browser Access Protected',
    requiredSettings: [
      { setting: 'clientAppTypes', values: ['browser'], reason: 'Browser clients must be targeted' },
      { setting: 'grantMFA', values: [true], reason: 'Browser access must require MFA' }
    ],
    description: 'Browser-based access must be protected with MFA'
  },

  'Con-027': {
    name: 'Mobile Applications Protected',
    requiredSettings: [
      { setting: 'clientAppTypes', values: ['mobileAppsAndDesktopClients'], reason: 'Mobile apps must be targeted' },
      { setting: 'grantMFA', values: [true], reason: 'Mobile apps must require MFA' }
    ],
    description: 'Mobile application access must require MFA'
  },

  // Session Protection (was Con-029 to Con-034)
  'Con-028': {
    name: 'Sign-in Frequency Configured',
    requiredSettings: [
      { setting: 'signInFrequencyEnabled', values: [true], reason: 'Sign-in frequency must be enabled' },
      { setting: 'signInFrequencyValue', values: ['required'], reason: 'Sign-in frequency value must be set' }
    ],
    description: 'Policies must enforce periodic re-authentication through sign-in frequency'
  },

  'Con-029': {
    name: 'Persistent Browser Session Controlled',
    requiredSettings: [
      { setting: 'persistentBrowserMode', values: ['never'], reason: 'Persistent browser sessions must be disabled' }
    ],
    description: 'Policies must prevent persistent browser sessions'
  },

  'Con-030': {
    name: 'Application Enforced Restrictions Enabled',
    requiredSettings: [
      { setting: 'applicationEnforcedRestrictions', values: [true], reason: 'Application enforced restrictions must be enabled' }
    ],
    description: 'Policies must enable application-enforced restrictions'
  },

  'Con-031': {
    name: 'Microsoft Defender for Cloud Apps Session Control',
    requiredSettings: [
      { setting: 'cloudAppSecurityMode', values: ['monitorOnly', 'blockDownloads', 'mcasConfigured'], reason: 'Cloud app security must be configured' }
    ],
    description: 'Policies must enable Cloud App Security session control'
  },

  'Con-032': {
    name: 'Token Protection Enabled',
    requiredSettings: [
      { setting: 'secureSignInSession', values: [true], reason: 'Secure sign-in session (token protection) must be enabled' }
    ],
    description: 'Policies must enable token protection for secure sign-in'
  },

  'Con-033': {
    name: 'Continuous Access Evaluation Enabled',
    requiredSettings: [
      { setting: 'continuousAccessEvaluation', values: ['strict'], reason: 'CAE must be configured to strict mode' }
    ],
    description: 'Policies must enable Continuous Access Evaluation (CAE)'
  },

  // Workload Identity Protection (was Con-035 to Con-039)
  'Con-034': {
    name: 'Workload Identity Conditional Access Enabled',
    requiredSettings: [
      { setting: 'includeServicePrincipals', values: ['required'], reason: 'Service principals must be included' }
    ],
    description: 'Policies must apply to workload identities and service principals'
  },

  'Con-035': {
    name: 'Service Principals Protected',
    requiredSettings: [
      { setting: 'includeServicePrincipals', values: ['required'], reason: 'Service principals must be targeted' },
      { setting: 'grantMFA', values: [true], reason: 'Service principals must have additional controls' }
    ],
    description: 'Policies must protect service principal access'
  },

  'Con-036': {
    name: 'Managed Identities Protected',
    requiredSettings: [
      { setting: 'includeServicePrincipals', values: ['required'], reason: 'Managed identities must be included' }
    ],
    description: 'Policies must protect managed identity access'
  },

  'Con-037': {
    name: 'Authentication Context Applied',
    requiredSettings: [
      { setting: 'includeAuthenticationContextClassReferences', values: ['required'], reason: 'Authentication context must be configured' }
    ],
    description: 'Policies must apply authentication context for step-up authentication'
  },

  'Con-038': {
    name: 'High-Risk Workload Identities Blocked',
    requiredSettings: [
      { setting: 'servicePrincipalRiskLevels', values: ['required'], reason: 'Service principal risk levels must be evaluated' },
      { setting: 'grantBlockAccess', values: [true], reason: 'High-risk service principals must be blocked' }
    ],
    description: 'Policies must block high-risk workload identities'
  }
}

/**
 * Flatten policy object to match settings schema
 */
export function flattenPolicySettings(policy) {
  const flattened = {
    displayName: policy.displayName || '',
    state: policy.state || 'disabled',
    templateId: policy.templateId || null,

    // User conditions
    includeUsers: policy.conditions?.users?.includeUsers || [],
    excludeUsers: policy.conditions?.users?.excludeUsers || [],
    includeGroups: policy.conditions?.users?.includeGroups || [],
    excludeGroups: policy.conditions?.users?.excludeGroups || [],
    includeRoles: policy.conditions?.users?.includeRoles || [],
    excludeRoles: policy.conditions?.users?.excludeRoles || [],

    // Application conditions
    includeApplications: policy.conditions?.applications?.includeApplications || [],
    excludeApplications: policy.conditions?.applications?.excludeApplications || [],
    includeUserActions: policy.conditions?.applications?.includeUserActions || [],
    includeAuthenticationContextClassReferences: policy.conditions?.applications?.includeAuthenticationContextClassReferences || [],
    applicationFilterMode: policy.conditions?.applications?.applicationFilter?.mode || null,
    applicationFilterRule: policy.conditions?.applications?.applicationFilter?.rule || null,

    // Client & Platform
    clientAppTypes: policy.conditions?.clientAppTypes || [],
    includePlatforms: policy.conditions?.platforms?.includePlatforms || [],
    excludePlatforms: policy.conditions?.platforms?.excludePlatforms || [],

    // Location
    includeLocations: policy.conditions?.locations?.includeLocations || [],
    excludeLocations: policy.conditions?.locations?.excludeLocations || [],

    // Device
    deviceFilterMode: policy.conditions?.devices?.deviceFilter?.mode || null,
    deviceFilterRule: policy.conditions?.devices?.deviceFilter?.rule || null,
    includeDeviceStates: policy.conditions?.deviceStates?.includeStates || [],
    excludeDeviceStates: policy.conditions?.deviceStates?.excludeStates || [],

    // Risk
    signInRiskLevels: policy.conditions?.signInRiskLevels || [],
    userRiskLevels: policy.conditions?.userRiskLevels || [],
    servicePrincipalRiskLevels: policy.conditions?.servicePrincipalRiskLevels || [],

    // Service Principal
    includeServicePrincipals: policy.conditions?.clientApplications?.includeServicePrincipals || [],
    excludeServicePrincipals: policy.conditions?.clientApplications?.excludeServicePrincipals || [],

    // Grant Controls
    grantOperator: policy.grantControls?.operator || 'AND',
    grantMFA: policy.grantControls?.builtInControls?.includes('mfa') || false,
    grantCompliantDevice: policy.grantControls?.builtInControls?.includes('compliantDevice') || false,
    grantHybridJoinedDevice: policy.grantControls?.builtInControls?.includes('domainJoinedDevice') || false,
    grantApprovedApplication: policy.grantControls?.builtInControls?.includes('approvedApplication') || false,
    grantCompliantApplication: policy.grantControls?.builtInControls?.includes('compliantApplication') || false,
    grantPasswordChange: policy.grantControls?.builtInControls?.includes('passwordChange') || false,
    grantBlockAccess: policy.grantControls?.builtInControls?.includes('block') || false,
    authenticationStrength: policy.grantControls?.authenticationStrength?.displayName || null,
    termsOfUse: policy.grantControls?.termsOfUse || [],

    // Session Controls
    applicationEnforcedRestrictions: policy.sessionControls?.applicationEnforcedRestrictions?.isEnabled || false,
    cloudAppSecurityMode: policy.sessionControls?.cloudAppSecurity?.cloudAppSecurityType || null,
    persistentBrowserMode: policy.sessionControls?.persistentBrowser?.mode || null,
    signInFrequencyEnabled: policy.sessionControls?.signInFrequency?.isEnabled || false,
    signInFrequencyType: policy.sessionControls?.signInFrequency?.type || null,
    signInFrequencyValue: policy.sessionControls?.signInFrequency?.value || 0,
    signInFrequencyAuthType: policy.sessionControls?.signInFrequency?.authenticationType || null,
    disableResilienceDefaults: policy.sessionControls?.disableResilienceDefaults || false,
    continuousAccessEvaluation: policy.sessionControls?.continuousAccessEvaluation?.mode || null,
    secureSignInSession: policy.sessionControls?.secureSignInSession?.isEnabled || false
  }

  return flattened
}

/**
 * Validate a control against flattened policy settings
 */
export function validateControl(controlId, policies) {
  const rule = controlValidationRules[controlId]
  if (!rule) {
    return { controlId, validated: false, reason: 'No validation rule defined', met: false, implementingPolicies: [] }
  }

  const flattenedPolicies = policies.map(p => ({
    original: p,
    flattened: flattenPolicySettings(p)
  }))

  // Find all policies that satisfy this control's requirements
  const implementingPolicies = []
  const isMet = flattenedPolicies.some(policyWrapper => {
    const policy = policyWrapper.flattened
    const satisfiesControl = rule.requiredSettings.every(req => {
      const policyValue = policy[req.setting]

      if (Array.isArray(policyValue) && req.values.includes('required')) {
        return policyValue.length > 0
      }

      if (Array.isArray(policyValue)) {
        return req.values.some(v => policyValue.includes(v))
      }

      return req.values.includes(policyValue)
    })

    if (satisfiesControl) {
      implementingPolicies.push({
        id: policyWrapper.original.id,
        name: policyWrapper.original.displayName,
        state: policyWrapper.original.state
      })
    }

    return satisfiesControl
  })

  return {
    controlId,
    name: rule.name,
    validated: true,
    met: isMet,
    description: rule.description,
    requiredSettings: rule.requiredSettings,
    implementingPolicies: implementingPolicies.filter(p => p.state === 'enabled'),
    implementingPolicy: implementingPolicies.find(p => p.state === 'enabled') || null
  }
}

export default { caSettingsSchema, controlValidationRules, flattenPolicySettings, validateControl }
