// ============================================================
// AI Agent Validation Service (Rule-Based)
// Validates service requests, checks eligibility, flags risks
// ============================================================

// Risk scoring thresholds
const RISK_THRESHOLDS = {
  LOW: 0,      // Auto-approve
  MEDIUM: 30,  // Manager approval
  HIGH: 60,    // Manager + IT approval
  CRITICAL: 80 // All approvals required
}

// ============================================================
// Exchange Groups Validation Rules
// ============================================================
export const validateExchangeGroupRequest = async (request, userContext) => {
  const { operationId, fields } = request
  const checks = []
  let riskScore = 0

  // Check 1: Naming convention
  const { displayName, alias } = fields
  if (!displayName || displayName.length < 3) {
    checks.push({ id: 'naming-length', status: 'FAIL', message: 'Group name too short (min 3 chars)' })
    riskScore += 20
  } else if (!/^[a-zA-Z0-9\s\-\.()]+$/.test(displayName)) {
    checks.push({ id: 'naming-invalid', status: 'FAIL', message: 'Invalid characters in group name' })
    riskScore += 15
  } else {
    checks.push({ id: 'naming-valid', status: 'PASS', message: 'Group name follows naming convention' })
  }

  // Check 2: Duplicate detection
  const isDuplicate = await checkGroupNameExists(displayName, alias)
  if (isDuplicate.exact) {
    checks.push({ id: 'duplicate-exact', status: 'FAIL', message: `Exact match found: ${isDuplicate.groupName}`, suggestion: `Join existing group instead` })
    riskScore += 50
  } else if (isDuplicate.similar && isDuplicate.similar.length > 0) {
    checks.push({ id: 'duplicate-similar', status: 'WARN', message: `Similar groups found: ${isDuplicate.similar.join(', ')}`, suggestion: 'Consider using existing group' })
    riskScore += 10
  } else {
    checks.push({ id: 'duplicate-check', status: 'PASS', message: 'No duplicate group names found' })
  }

  // Check 3: Requestor eligibility
  const eligibility = await checkRequestorEligibility(userContext.email, 'create-m365-group')
  if (!eligibility.eligible) {
    checks.push({ id: 'eligibility', status: 'FAIL', message: `Not eligible: ${eligibility.reason}` })
    riskScore += 40
  } else {
    checks.push({ id: 'eligibility', status: 'PASS', message: 'Requestor is eligible' })
  }

  // Check 4: Business justification quality
  const { justification } = fields
  if (!justification || justification.length < 20) {
    checks.push({ id: 'justification', status: 'WARN', message: 'Justification is brief or missing' })
    riskScore += 5
  } else {
    checks.push({ id: 'justification', status: 'PASS', message: 'Adequate business justification provided' })
  }

  // Check 5: Privacy setting validation
  const { privacy } = fields
  if (privacy !== 'Private' && privacy !== 'Public') {
    checks.push({ id: 'privacy-invalid', status: 'FAIL', message: 'Invalid privacy setting' })
    riskScore += 20
  } else {
    checks.push({ id: 'privacy-valid', status: 'PASS', message: `Privacy setting: ${privacy}` })
  }

  // Determine risk level
  let riskLevel = 'LOW'
  if (riskScore >= RISK_THRESHOLDS.CRITICAL) riskLevel = 'CRITICAL'
  else if (riskScore >= RISK_THRESHOLDS.HIGH) riskLevel = 'HIGH'
  else if (riskScore >= RISK_THRESHOLDS.MEDIUM) riskLevel = 'MEDIUM'

  // Auto-approval for low-risk requests
  const autoApprove = riskLevel === 'LOW' && eligibility.eligible && !isDuplicate.exact

  return {
    operationId,
    status: autoApprove ? 'AUTO_APPROVED' : 'PENDING_REVIEW',
    riskScore,
    riskLevel,
    checks,
    recommendations: generateRecommendations(checks),
    autoApprove,
    approvalPath: getApprovalPath(riskLevel, operationId)
  }
}

// ============================================================
// Teams Validation Rules
// ============================================================
export const validateTeamsRequest = async (request, userContext) => {
  const { operationId, fields } = request
  const checks = []
  let riskScore = 0

  const { teamName, privacy, members } = fields

  // Check 1: Team name validation
  if (!teamName || teamName.length < 3) {
    checks.push({ id: 'teamname-length', status: 'FAIL', message: 'Team name too short' })
    riskScore += 20
  } else {
    checks.push({ id: 'teamname-valid', status: 'PASS', message: 'Team name is valid' })
  }

  // Check 2: Privacy setting
  if (!['Private', 'Public', 'Org-wide'].includes(privacy)) {
    checks.push({ id: 'privacy-invalid', status: 'FAIL', message: 'Invalid privacy setting' })
    riskScore += 25
  } else if (privacy === 'Org-wide') {
    checks.push({ id: 'privacy-org-wide', status: 'WARN', message: 'Org-wide teams require IT approval' })
    riskScore += 30
  } else {
    checks.push({ id: 'privacy-valid', status: 'PASS', message: `Privacy: ${privacy}` })
  }

  // Check 3: Member validation
  if (members && members.length > 0) {
    const memberList = members.split(',').map(m => m.trim())
    const invalidMembers = memberList.filter(m => !isValidUPN(m))
    if (invalidMembers.length > 0) {
      checks.push({ id: 'invalid-members', status: 'FAIL', message: `Invalid UPNs: ${invalidMembers.join(', ')}` })
      riskScore += 25
    } else {
      checks.push({ id: 'members-valid', status: 'PASS', message: `${memberList.length} valid members` })
    }
  }

  const riskLevel = getRiskLevel(riskScore)
  const autoApprove = riskLevel === 'LOW'

  return {
    operationId,
    status: autoApprove ? 'AUTO_APPROVED' : 'PENDING_REVIEW',
    riskScore,
    riskLevel,
    checks,
    recommendations: generateRecommendations(checks),
    autoApprove,
    approvalPath: getApprovalPath(riskLevel, operationId)
  }
}

// ============================================================
// License Request Validation
// ============================================================
export const validateLicenseRequest = async (request, userContext) => {
  const { operationId, fields } = request
  const checks = []
  let riskScore = 0

  const { licenseType, quantity, justification } = fields

  // Check 1: License availability
  const availability = await checkLicenseAvailability(licenseType, quantity)
  if (!availability.available) {
    checks.push({ id: 'license-availability', status: 'FAIL', message: `Insufficient licenses (${availability.available}/${quantity})` })
    riskScore += 40
  } else {
    checks.push({ id: 'license-available', status: 'PASS', message: `${availability.available} licenses available` })
  }

  // Check 2: Budget check
  const budgetOK = await checkBudgetAllocation(userContext.department, licenseType, quantity)
  if (!budgetOK) {
    checks.push({ id: 'budget-check', status: 'WARN', message: 'May require budget approval' })
    riskScore += 15
  } else {
    checks.push({ id: 'budget-ok', status: 'PASS', message: 'Budget allocated' })
  }

  // Check 3: Justification
  if (!justification || justification.length < 10) {
    checks.push({ id: 'justification', status: 'WARN', message: 'Justification is brief' })
    riskScore += 5
  } else {
    checks.push({ id: 'justification-good', status: 'PASS', message: 'Good justification' })
  }

  const riskLevel = getRiskLevel(riskScore)
  const autoApprove = riskLevel === 'LOW' && availability.available >= quantity

  return {
    operationId,
    status: autoApprove ? 'AUTO_APPROVED' : 'PENDING_REVIEW',
    riskScore,
    riskLevel,
    checks,
    recommendations: generateRecommendations(checks),
    autoApprove,
    approvalPath: getApprovalPath(riskLevel, operationId)
  }
}

// ============================================================
// Helper Functions
// ============================================================

async function checkGroupNameExists(displayName, alias) {
  // TODO: Query actual M365 groups from Graph API
  // For now, return mock data
  return {
    exact: false,
    similar: []
  }
}

async function checkRequestorEligibility(email, operationType) {
  // TODO: Check against user's role, department, licensing
  return {
    eligible: true,
    reason: null
  }
}

async function checkLicenseAvailability(licenseType, quantity) {
  // TODO: Query actual license availability from M365
  return {
    available: 100,
    total: 200
  }
}

async function checkBudgetAllocation(department, licenseType, quantity) {
  // TODO: Check department budget against license cost
  return true
}

function isValidUPN(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

function getRiskLevel(score) {
  if (score >= 80) return 'CRITICAL'
  if (score >= 60) return 'HIGH'
  if (score >= 30) return 'MEDIUM'
  return 'LOW'
}

function getApprovalPath(riskLevel, operationId) {
  // Default approval paths based on risk level
  const paths = {
    LOW: ['agent', 'action'],
    MEDIUM: ['manager', 'it', 'agent', 'action'],
    HIGH: ['manager', 'dataowner', 'it', 'agent', 'action'],
    CRITICAL: ['manager', 'dataowner', 'it', 'agent', 'action']
  }
  return paths[riskLevel] || paths.MEDIUM
}

function generateRecommendations(checks) {
  return checks
    .filter(c => c.suggestion)
    .map(c => ({ check: c.id, message: c.suggestion }))
}

// ============================================================
// Main Validation Router
// ============================================================
export async function validateServiceRequest(request, userContext) {
  const { operationId } = request

  console.log(`🤖 Agent validating request: ${operationId}`)

  try {
    let validation

    // Route to appropriate validator
    if (operationId.startsWith('exchange-')) {
      validation = await validateExchangeGroupRequest(request, userContext)
    } else if (operationId.startsWith('teams-')) {
      validation = await validateTeamsRequest(request, userContext)
    } else if (operationId.startsWith('license-')) {
      validation = await validateLicenseRequest(request, userContext)
    } else {
      // Default: basic validation
      validation = {
        operationId,
        status: 'PENDING_REVIEW',
        riskScore: 0,
        riskLevel: 'LOW',
        checks: [{ id: 'basic', status: 'PASS', message: 'Request passed basic validation' }],
        recommendations: [],
        autoApprove: false,
        approvalPath: ['manager', 'it', 'agent', 'action']
      }
    }

    console.log(`✓ Validation complete: ${validation.riskLevel} risk, ${validation.autoApprove ? 'AUTO-APPROVED' : 'pending review'}`)
    return validation
  } catch (error) {
    console.error('✗ Validation error:', error.message)
    throw error
  }
}
