/**
 * Policy Loader Utility
 * Loads Conditional Access policies from Graph API or mock data
 */

import fs from 'fs'
import { join } from 'path'
import { fileURLToPath } from 'url'
import { dirname } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const MOCK_DATA_FILE = join(__dirname, '..', 'data', 'mock-policies.json')

/**
 * Load policies from Graph API or mock data
 */
export async function loadPolicies() {
  try {
    if (fs.existsSync(MOCK_DATA_FILE)) {
      try {
        const mockData = JSON.parse(fs.readFileSync(MOCK_DATA_FILE, 'utf8'))
        console.log(`Loaded ${mockData.length} mock policies`)
        return mockData
      } catch (error) {
        console.warn('Error loading mock policies:', error)
      }
    }
    return getDefaultMockPolicies()
  } catch (error) {
    console.error('Error in loadPolicies:', error)
    return getDefaultMockPolicies()
  }
}

/**
 * Get default mock policies for testing
 */
export function getDefaultMockPolicies() {
  return [
    {
      id: 'policy-001',
      displayName: 'MFA - All Cloud Apps',
      state: 'enabled',
      conditions: {
        applications: {
          includeApplications: ['All']
        },
        users: {
          includeUsers: ['All'],
          excludeUsers: []
        }
      },
      grantControls: {
        operator: 'AND',
        builtInControls: ['mfa']
      },
      sessionControls: {}
    },
    {
      id: 'policy-002',
      displayName: 'Global Admin - Phishing Resistant MFA',
      state: 'enabled',
      conditions: {
        applications: {
          includeApplications: ['All']
        },
        users: {
          includeRoles: ['Global Administrator']
        }
      },
      grantControls: {
        operator: 'AND',
        authenticationStrength: 'Phishing Resistant'
      },
      sessionControls: {}
    },
    {
      id: 'policy-003',
      displayName: 'Device Compliance Required',
      state: 'enabled',
      conditions: {
        applications: {
          includeApplications: ['All']
        }
      },
      grantControls: {
        operator: 'OR',
        builtInControls: ['compliantDevice', 'hybridJoinedDevice']
      },
      sessionControls: {}
    },
    {
      id: 'policy-004',
      displayName: 'Block Legacy Authentication',
      state: 'enabled',
      conditions: {
        applications: {
          includeApplications: ['All']
        },
        clientAppTypes: ['exchangeActiveSync', 'otherClients']
      },
      grantControls: {
        operator: 'AND',
        builtInControls: ['block']
      },
      sessionControls: {}
    },
    {
      id: 'policy-005',
      displayName: 'Guest - MFA Required',
      state: 'enabled',
      conditions: {
        applications: {
          includeApplications: ['All']
        },
        users: {
          includeGuests: true
        }
      },
      grantControls: {
        operator: 'AND',
        builtInControls: ['mfa']
      },
      sessionControls: {}
    },
    {
      id: 'policy-006',
      displayName: 'Exchange Admin - Protected',
      state: 'enabled',
      conditions: {
        applications: {
          includeApplications: ['Exchange Admin Center']
        },
        users: {
          includeRoles: ['Exchange Administrator']
        }
      },
      grantControls: {
        operator: 'AND',
        builtInControls: ['mfa']
      },
      sessionControls: {}
    },
    {
      id: 'policy-007',
      displayName: 'SharePoint Admin - Protected',
      state: 'enabled',
      conditions: {
        applications: {
          includeApplications: ['SharePoint Admin Center']
        },
        users: {
          includeRoles: ['SharePoint Administrator']
        }
      },
      grantControls: {
        operator: 'AND',
        builtInControls: ['mfa']
      },
      sessionControls: {}
    },
    {
      id: 'policy-008',
      displayName: 'High Risk Users - Blocked',
      state: 'enabled',
      conditions: {
        applications: {
          includeApplications: ['All']
        },
        userRiskLevels: ['high']
      },
      grantControls: {
        operator: 'AND',
        builtInControls: ['block']
      },
      sessionControls: {}
    },
    {
      id: 'policy-009',
      displayName: 'Sign-in Risk - Require MFA',
      state: 'enabled',
      conditions: {
        applications: {
          includeApplications: ['All']
        },
        signInRiskLevels: ['high', 'medium']
      },
      grantControls: {
        operator: 'AND',
        builtInControls: ['mfa']
      },
      sessionControls: {}
    },
    {
      id: 'policy-010',
      displayName: 'Named Locations - Conditional Access',
      state: 'enabled',
      conditions: {
        applications: {
          includeApplications: ['All']
        },
        locations: ['AllTrusted']
      },
      grantControls: {
        operator: 'AND',
        builtInControls: []
      },
      sessionControls: {}
    }
  ]
}

export async function loadPoliciesFromGraphAPI(accessToken) {
  try {
    console.log('Graph API integration not yet implemented')
    return getDefaultMockPolicies()
  } catch (error) {
    console.error('Error loading from Graph API:', error)
    return getDefaultMockPolicies()
  }
}

export function saveMockPolicies(policies) {
  const dataDir = join(__dirname, '..', 'data')
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true })
  }

  try {
    fs.writeFileSync(MOCK_DATA_FILE, JSON.stringify(policies, null, 2))
    console.log('Mock policies saved')
    return true
  } catch (error) {
    console.error('Error saving mock policies:', error)
    return false
  }
}

export async function getPolicyById(policyId) {
  const policies = await loadPolicies()
  return policies.find(p => p.id === policyId)
}

export async function getPoliciesByState(state) {
  const policies = await loadPolicies()
  return policies.filter(p => p.state === state)
}

export async function getPoliciesByApplication(appName) {
  const policies = await loadPolicies()
  return policies.filter(p =>
    p.conditions?.applications?.includeApplications?.includes(appName) ||
    p.conditions?.applications?.includeApplications?.includes('All')
  )
}

export async function getPoliciesByRole(roleName) {
  const policies = await loadPolicies()
  return policies.filter(p =>
    p.conditions?.users?.includeRoles?.includes(roleName)
  )
}

export async function getPoliciesWithMFA() {
  const policies = await loadPolicies()
  return policies.filter(p =>
    p.grantControls?.builtInControls?.includes('mfa')
  )
}

export async function getPoliciesWithDeviceCompliance() {
  const policies = await loadPolicies()
  return policies.filter(p =>
    p.grantControls?.builtInControls?.includes('compliantDevice') ||
    p.grantControls?.builtInControls?.includes('hybridJoinedDevice')
  )
}

export async function getPolicyStatistics() {
  const policies = await loadPolicies()

  return {
    totalPolicies: policies.length,
    enabledPolicies: policies.filter(p => p.state === 'enabled').length,
    reportOnlyPolicies: policies.filter(p => p.state === 'reportOnly').length,
    disabledPolicies: policies.filter(p => p.state === 'disabled').length,
    mfaPolicies: policies.filter(p => p.grantControls?.builtInControls?.includes('mfa')).length,
    deviceCompliancePolicies: policies.filter(p =>
      p.grantControls?.builtInControls?.includes('compliantDevice')
    ).length,
    blockLegacyAuthPolicies: policies.filter(p =>
      p.grantControls?.builtInControls?.includes('blockLegacyAuth')
    ).length,
    allCloudAppsPolicies: policies.filter(p =>
      p.conditions?.applications?.includeApplications?.includes('All')
    ).length
  }
}
