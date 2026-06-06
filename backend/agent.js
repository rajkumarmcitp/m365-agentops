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
// SharePoint Validation Rules
// ============================================================
export const validateSharePointRequest = async (request, userContext) => {
  const { operationId, fields } = request
  const checks = []
  let riskScore = 0

  const { siteName, siteUrl, accessLevel, externalSharing, dataClassification } = fields

  // Check 1: Site URL format
  if (!siteUrl || !/^[a-z0-9-]+$/.test(siteUrl)) {
    checks.push({ id: 'url-format', status: 'FAIL', message: 'Invalid site URL format (lowercase, hyphens only)' })
    riskScore += 20
  } else {
    checks.push({ id: 'url-format', status: 'PASS', message: 'Site URL format is valid' })
  }

  // Check 2: External sharing risk
  if (externalSharing === 'Anyone') {
    checks.push({ id: 'external-sharing', status: 'FAIL', message: 'External sharing "Anyone" not allowed - IT approval required' })
    riskScore += 40
  } else if (externalSharing === 'External Users') {
    checks.push({ id: 'external-sharing', status: 'WARN', message: 'External user sharing enabled - verify with data owner' })
    riskScore += 20
  } else {
    checks.push({ id: 'external-sharing', status: 'PASS', message: 'Sharing settings are compliant' })
  }

  // Check 3: Data classification
  if (dataClassification === 'Confidential' || dataClassification === 'Secret') {
    checks.push({ id: 'data-class', status: 'WARN', message: `${dataClassification} data requires data owner approval` })
    riskScore += 30
  } else {
    checks.push({ id: 'data-class', status: 'PASS', message: `Data classification: ${dataClassification}` })
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
// OneDrive Validation Rules
// ============================================================
export const validateOneDriveRequest = async (request, userContext) => {
  const { operationId, fields } = request
  const checks = []
  let riskScore = 0

  const { targetUser, requestType, storageQuota, justification } = fields

  // Check 1: Valid user format
  if (!targetUser || !isValidUPN(targetUser)) {
    checks.push({ id: 'user-format', status: 'FAIL', message: 'Invalid user UPN format' })
    riskScore += 25
  } else {
    checks.push({ id: 'user-format', status: 'PASS', message: 'User UPN is valid' })
  }

  // Check 2: Storage increase bounds
  if (requestType === 'increase' && storageQuota) {
    const quota = parseInt(storageQuota)
    if (quota > 2000) {
      checks.push({ id: 'quota-size', status: 'WARN', message: `Large quota increase requested (${quota}GB) - verify with IT` })
      riskScore += 15
    } else {
      checks.push({ id: 'quota-size', status: 'PASS', message: `Storage increase: ${quota}GB` })
    }
  }

  // Check 3: Justification for former employee
  if (requestType === 'former-employee' && (!justification || justification.length < 15)) {
    checks.push({ id: 'justification', status: 'FAIL', message: 'Detailed justification required for former employee access' })
    riskScore += 40
  }

  const riskLevel = getRiskLevel(riskScore)
  const autoApprove = riskLevel === 'LOW' && requestType !== 'former-employee'

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
// External Sharing Validation Rules
// ============================================================
export const validateExternalSharingRequest = async (request, userContext) => {
  const { operationId, fields } = request
  const checks = []
  let riskScore = 0

  const { guestEmail, accessLevel, expiryDays, justification, resourceType } = fields

  // Check 1: Valid email
  if (!guestEmail || !isValidUPN(guestEmail)) {
    checks.push({ id: 'email-format', status: 'FAIL', message: 'Invalid email format' })
    riskScore += 25
  } else {
    checks.push({ id: 'email-format', status: 'PASS', message: 'Guest email is valid' })
  }

  // Check 2: Access level risk
  if (accessLevel === 'Owner') {
    checks.push({ id: 'access-level', status: 'FAIL', message: 'Owner access to external users not allowed - use Contributor instead' })
    riskScore += 50
  } else if (accessLevel === 'Editor') {
    checks.push({ id: 'access-level', status: 'WARN', message: 'Editor access - verify user needs full edit rights' })
    riskScore += 15
  } else {
    checks.push({ id: 'access-level', status: 'PASS', message: `Access level: ${accessLevel}` })
  }

  // Check 3: Expiry validation
  const expiry = parseInt(expiryDays)
  if (expiry > 365) {
    checks.push({ id: 'expiry', status: 'WARN', message: `Long expiry period (${expiry} days) - consider shorter access window` })
    riskScore += 10
  } else {
    checks.push({ id: 'expiry', status: 'PASS', message: `Access expires in ${expiry} days` })
  }

  const riskLevel = getRiskLevel(riskScore)
  const autoApprove = riskLevel === 'LOW' && accessLevel !== 'Owner'

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
// User Access Management Validation
// ============================================================
export const validateUserAccessRequest = async (request, userContext) => {
  const { operationId, fields } = request
  const checks = []
  let riskScore = 0

  const { targetUser, resourceType, accessType, justification } = fields

  // Check 1: User validity
  if (!targetUser || !isValidUPN(targetUser)) {
    checks.push({ id: 'user-format', status: 'FAIL', message: 'Invalid target user UPN' })
    riskScore += 25
  } else {
    checks.push({ id: 'user-format', status: 'PASS', message: 'Target user is valid' })
  }

  // Check 2: Access type risk
  if (accessType === 'Full Access') {
    checks.push({ id: 'access-type', status: 'WARN', message: 'Full access requested - verify with manager' })
    riskScore += 20
  } else {
    checks.push({ id: 'access-type', status: 'PASS', message: `Access type: ${accessType}` })
  }

  // Check 3: Business justification
  if (!justification || justification.length < 15) {
    checks.push({ id: 'justification', status: 'WARN', message: 'Brief justification - more detail recommended' })
    riskScore += 10
  } else {
    checks.push({ id: 'justification', status: 'PASS', message: 'Good business justification provided' })
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
// Intune Validation Rules
// ============================================================
export const validateIntuneRequest = async (request, userContext) => {
  const { operationId, fields } = request
  const checks = []
  let riskScore = 0

  const { deviceId, actionType, enforceCompliance, reason } = fields

  // Check 1: Device validity
  if (!deviceId || deviceId.length < 5) {
    checks.push({ id: 'device-id', status: 'FAIL', message: 'Invalid device ID' })
    riskScore += 30
  } else {
    checks.push({ id: 'device-id', status: 'PASS', message: 'Device ID is valid' })
  }

  // Check 2: Destructive action
  if (actionType === 'Wipe') {
    checks.push({ id: 'destructive-action', status: 'WARN', message: 'Device wipe requested - all data will be lost' })
    riskScore += 40
  } else if (actionType === 'Retire') {
    checks.push({ id: 'destructive-action', status: 'WARN', message: 'Device retirement - will remove from management' })
    riskScore += 25
  } else {
    checks.push({ id: 'destructive-action', status: 'PASS', message: `Action: ${actionType}` })
  }

  // Check 3: Reason provided for destructive actions
  if ((actionType === 'Wipe' || actionType === 'Retire') && (!reason || reason.length < 10)) {
    checks.push({ id: 'reason', status: 'FAIL', message: 'Detailed reason required for this action' })
    riskScore += 25
  }

  const riskLevel = getRiskLevel(riskScore)
  const autoApprove = riskLevel === 'LOW' && actionType !== 'Wipe' && actionType !== 'Retire'

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
// Guest Lifecycle Validation Rules
// ============================================================
export const validateGuestLifecycleRequest = async (request, userContext) => {
  const { operationId, fields } = request
  const checks = []
  let riskScore = 0

  const { guestEmail, actionType, expiryDays, reason } = fields

  // Check 1: Email validity
  if (!guestEmail || !isValidUPN(guestEmail)) {
    checks.push({ id: 'email-format', status: 'FAIL', message: 'Invalid guest email format' })
    riskScore += 25
  } else {
    checks.push({ id: 'email-format', status: 'PASS', message: 'Guest email is valid' })
  }

  // Check 2: Action type
  if (actionType === 'Remove') {
    checks.push({ id: 'action-type', status: 'WARN', message: 'Guest access will be removed - verify they have no pending work' })
    riskScore += 20
  } else if (actionType === 'Extend') {
    checks.push({ id: 'action-type', status: 'PASS', message: `Access will be extended ${expiryDays} days` })
  } else {
    checks.push({ id: 'action-type', status: 'PASS', message: `Action: ${actionType}` })
  }

  // Check 3: Reason for removal
  if (actionType === 'Remove' && (!reason || reason.length < 10)) {
    checks.push({ id: 'reason', status: 'WARN', message: 'Reason for removal recommended' })
    riskScore += 10
  }

  const riskLevel = getRiskLevel(riskScore)
  const autoApprove = riskLevel === 'LOW' && actionType !== 'Remove'

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
// Copilot & Power Platform Validation
// ============================================================
export const validateCopilotRequest = async (request, userContext) => {
  const { operationId, fields } = request
  const checks = []
  let riskScore = 0

  const { licenseType, quantity, targetUsers, justification } = fields

  // Check 1: Quantity bounds
  if (parseInt(quantity) > 50) {
    checks.push({ id: 'quantity', status: 'WARN', message: 'Large license request - verify budget availability' })
    riskScore += 20
  } else {
    checks.push({ id: 'quantity', status: 'PASS', message: `Requesting ${quantity} licenses` })
  }

  // Check 2: Justification quality
  if (!justification || justification.length < 20) {
    checks.push({ id: 'justification', status: 'WARN', message: 'Business justification is brief' })
    riskScore += 10
  } else {
    checks.push({ id: 'justification', status: 'PASS', message: 'Good justification provided' })
  }

  const riskLevel = getRiskLevel(riskScore)
  const autoApprove = riskLevel === 'LOW' && parseInt(quantity) <= 10

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
// Main Validation Router (EXTENDED)
// ============================================================
export async function validateServiceRequest(request, userContext) {
  const { operationId } = request

  console.log(`🤖 Agent validating request: ${operationId}`)

  try {
    let validation

    // Route to appropriate validator based on service
    if (operationId.startsWith('exchange-')) {
      validation = await validateExchangeGroupRequest(request, userContext)
    } else if (operationId.startsWith('teams-')) {
      validation = await validateTeamsRequest(request, userContext)
    } else if (operationId.startsWith('sharepoint-')) {
      validation = await validateSharePointRequest(request, userContext)
    } else if (operationId.startsWith('onedrive-')) {
      validation = await validateOneDriveRequest(request, userContext)
    } else if (operationId.startsWith('ext-sharing-')) {
      validation = await validateExternalSharingRequest(request, userContext)
    } else if (operationId.startsWith('user-access-')) {
      validation = await validateUserAccessRequest(request, userContext)
    } else if (operationId.startsWith('license-')) {
      validation = await validateLicenseRequest(request, userContext)
    } else if (operationId.startsWith('copilot-') || operationId.startsWith('power-platform-')) {
      validation = await validateCopilotRequest(request, userContext)
    } else if (operationId.startsWith('intune-')) {
      validation = await validateIntuneRequest(request, userContext)
    } else if (operationId.startsWith('guest-')) {
      validation = await validateGuestLifecycleRequest(request, userContext)
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
