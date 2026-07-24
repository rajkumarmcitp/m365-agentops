/**
 * Control Extractor
 * Extracts security controls from CA policies and maps them to CIS controls where applicable
 */

export function extractControlsFromPolicies(policies) {
  const controls = []
  const cisMapping = {
    'MFA': ['5.2.2.1', '5.2.2.2', '5.2.2.5'],
    'Device Compliance': ['5.2.2.9', '5.2.2.10'],
    'Block Legacy Auth': ['5.2.2.3'],
    'Block High Risk Users': ['5.2.2.6', '5.2.2.8'],
    'Sign-in Risk': ['5.2.2.7'],
    'Session Control': ['5.2.2.4', '5.2.2.13'],
    'Named Locations': ['5.2.2.14'],
    'Device Code Block': ['5.2.2.12'],
    'Intune Enrollment': ['5.2.2.11'],
    'Token Protection': ['5.2.2.16'],
    'Auth Transfer Block': ['5.2.2.17'],
    'Geographic Restrictions': ['5.2.2.15']
  }

  policies.forEach((policy, index) => {
    const controls_in_policy = extractPolicyControls(policy)

    controls_in_policy.forEach(control => {
      const existingControl = controls.find(c => c.name === control.name)

      if (existingControl) {
        // Add policy to existing control
        if (!existingControl.policies.find(p => p.id === policy.id)) {
          existingControl.policies.push({
            id: policy.id,
            name: policy.displayName,
            enabled: policy.state === 'enabled'
          })
        }
      } else {
        // Create new control
        const newControl = {
          id: `CTRL-${String(controls.length + 1).padStart(3, '0')}`,
          name: control.name,
          description: control.description,
          category: control.category,
          riskLevel: control.riskLevel,
          cisControls: cisMapping[control.name] || [],
          policies: [{
            id: policy.id,
            name: policy.displayName,
            enabled: policy.state === 'enabled'
          }],
          met: policy.state === 'enabled',
          severity: getSeverity(control.category)
        }
        controls.push(newControl)
      }
    })
  })

  return controls.sort((a, b) => {
    const severityOrder = { 'Critical': 0, 'High': 1, 'Medium': 2, 'Low': 3 }
    return (severityOrder[a.severity] || 99) - (severityOrder[b.severity] || 99)
  })
}

function extractPolicyControls(policy) {
  const controls = []
  const displayName = policy.displayName || ''

  // Check for MFA
  if (policy.grantControls?.builtInControls?.includes('mfa') ||
      policy.grantControls?.authenticationStrength) {
    if (displayName.includes('Admin') || displayName.includes('admin')) {
      controls.push({
        name: 'MFA',
        description: 'Multi-factor authentication for administrative users',
        category: 'Authentication',
        riskLevel: 'Critical'
      })
    } else if (displayName.includes('Guest')) {
      controls.push({
        name: 'MFA',
        description: 'Multi-factor authentication for guest users',
        category: 'Authentication',
        riskLevel: 'High'
      })
    } else {
      controls.push({
        name: 'MFA',
        description: 'Multi-factor authentication for all users',
        category: 'Authentication',
        riskLevel: 'Critical'
      })
    }
  }

  // Check for Phishing Resistant MFA
  if (policy.grantControls?.authenticationStrength === 'Phishing Resistant') {
    controls.push({
      name: 'Phishing Resistant Authentication',
      description: 'Require phishing-resistant MFA (FIDO2, Certificate, Passkey)',
      category: 'Authentication',
      riskLevel: 'Critical'
    })
  }

  // Check for Device Compliance
  if (policy.grantControls?.builtInControls?.includes('compliantDevice') ||
      policy.grantControls?.builtInControls?.includes('hybridJoinedDevice')) {
    controls.push({
      name: 'Device Compliance',
      description: 'Require managed or compliant device',
      category: 'Device Management',
      riskLevel: 'High'
    })
  }

  // Check for Legacy Authentication Blocking
  if ((policy.grantControls?.builtInControls?.includes('block') &&
       policy.conditions?.clientAppTypes?.includes('exchangeActiveSync')) ||
      displayName.includes('Legacy')) {
    controls.push({
      name: 'Block Legacy Auth',
      description: 'Block legacy authentication protocols',
      category: 'Legacy Access',
      riskLevel: 'Critical'
    })
  }

  // Check for User Risk
  if (policy.conditions?.userRiskLevels || displayName.includes('Risk')) {
    if (policy.grantControls?.builtInControls?.includes('block')) {
      controls.push({
        name: 'Block High Risk Users',
        description: 'Block users flagged as high risk',
        category: 'Risk Management',
        riskLevel: 'High'
      })
    } else {
      controls.push({
        name: 'User Risk Response',
        description: 'Enforce MFA for risky users',
        category: 'Risk Management',
        riskLevel: 'High'
      })
    }
  }

  // Check for Sign-in Risk
  if (policy.conditions?.signInRiskLevels) {
    controls.push({
      name: 'Sign-in Risk',
      description: 'Respond to sign-in risk levels',
      category: 'Risk Management',
      riskLevel: 'High'
    })
  }

  // Check for Session Controls
  if (policy.sessionControls?.signInFrequency) {
    controls.push({
      name: 'Session Control',
      description: 'Enforce sign-in frequency and session timeout',
      category: 'Session Management',
      riskLevel: 'Medium'
    })
  }

  if (policy.sessionControls?.persistentBrowserMode?.isEnabled === false) {
    controls.push({
      name: 'Persistent Browser Prevention',
      description: 'Prevent persistent browser sessions',
      category: 'Session Management',
      riskLevel: 'High'
    })
  }

  // Check for Named Locations
  if (policy.conditions?.locations) {
    controls.push({
      name: 'Named Locations',
      description: 'Define and enforce trusted named locations',
      category: 'Network Control',
      riskLevel: 'Medium'
    })
  }

  // Check for Device Code Flow
  if (displayName.includes('Device Code') || displayName.includes('device code')) {
    controls.push({
      name: 'Device Code Flow',
      description: 'Block device code authentication flow',
      category: 'Authentication',
      riskLevel: 'High'
    })
  }

  // Check for Intune Enrollment
  if (displayName.includes('Intune') || displayName.includes('Enrollment')) {
    controls.push({
      name: 'Intune Enrollment',
      description: 'Require authentication at every Intune enrollment',
      category: 'Device Management',
      riskLevel: 'Medium'
    })
  }

  // Check for MFA Registration
  if (policy.conditions?.userActions?.includes('urn:user:registersecurityinfo')) {
    controls.push({
      name: 'Security Info Registration',
      description: 'Require device compliance for MFA registration',
      category: 'Authentication',
      riskLevel: 'High'
    })
  }

  // Check for Token Protection
  if (displayName.includes('Token') || policy.sessionControls?.protectTokenProtection?.isEnabled) {
    controls.push({
      name: 'Token Protection',
      description: 'Enable token protection for session tokens',
      category: 'Session Management',
      riskLevel: 'High'
    })
  }

  // Check for Authentication Transfer
  if (displayName.includes('Authentication Transfer') || policy.sessionControls?.transferBlockProtection?.isEnabled) {
    controls.push({
      name: 'Auth Transfer Block',
      description: 'Block authentication transfer',
      category: 'Authentication',
      riskLevel: 'High'
    })
  }

  // Check for Geographic Restrictions
  if (displayName.includes('Geographic') || displayName.includes('Countries') ||
      (policy.conditions?.locations && policy.conditions.locations.includes('BlockedCountries'))) {
    controls.push({
      name: 'Geographic Restrictions',
      description: 'Block access from high-risk countries/regions',
      category: 'Network Control',
      riskLevel: 'High'
    })
  }

  return controls.length > 0 ? controls : [{
    name: 'Conditional Access Policy',
    description: displayName,
    category: 'Policy',
    riskLevel: 'Low'
  }]
}

function getSeverity(category) {
  const severityMap = {
    'Authentication': 'Critical',
    'Device Management': 'High',
    'Risk Management': 'High',
    'Legacy Access': 'Critical',
    'Session Management': 'High',
    'Network Control': 'High',
    'Policy': 'Low'
  }
  return severityMap[category] || 'Medium'
}

export function calculateControlCoverage(controls) {
  const total = controls.length
  const met = controls.filter(c => c.met).length
  const withCIS = controls.filter(c => c.cisControls && c.cisControls.length > 0).length

  return {
    total,
    met,
    percentage: Math.round((met / total) * 100),
    withCIS,
    cisPercentage: Math.round((withCIS / total) * 100)
  }
}
