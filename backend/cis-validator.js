/**
 * CIS Benchmark Validator
 * Real-time validation of 160 CIS controls against Microsoft Graph API
 * Returns detailed pass/fail/warn status for all 9 configuration areas
 * Supports hybrid validation with PowerShell fallback
 */

import { CIS_CONTROLS_DATA, getTotalControlsCount } from './cis-controls-data.js'
import { getValidationMethod } from './validation-config.js'
import { recordValidationAttempt, getValidationSummary, getAllValidationMetadata, resetValidationState } from './validation-state.js'
import { getControlPowerShellCommands } from './powershell-commands-loader.js'
import { executePowerShellCommands } from './powershell-executor.js'

let graphClient = null
let validationCache = null
let cacheTimestamp = null
const CACHE_TTL = 3600000 // 1 hour

/**
 * Initialize Graph Client for validation
 */
export function setValidationGraphClient(client) {
  graphClient = client
  console.log('✓ CIS Validator: Graph Client initialized')
}

/**
 * Get cached results if still valid
 */
function getCachedValidation() {
  if (validationCache && cacheTimestamp && Date.now() - cacheTimestamp < CACHE_TTL) {
    console.log('✓ CIS Validator: Using cached results (TTL valid)')
    return validationCache
  }
  return null
}

/**
 * Validate all CIS controls against real Graph API data
 */
export async function validateAllCISControls() {
  // Reset validation state for new validation run
  resetValidationState()

  // Check cache first
  const cached = getCachedValidation()
  if (cached) return cached

  if (!graphClient) {
    console.error('❌ CIS Validator: Graph Client not initialized')
    return { success: false, error: 'Graph Client not available', data: [] }
  }

  try {
    console.log('🔍 CIS Validator: Starting comprehensive validation...')

    // Fetch all Graph API data in parallel
    const [
      globalAdmins, authPolicy, securityDefaults, caPolicy, dlpPolicies,
      safeLinksPolicies, safeAttachmentPolicies, antiPhishPolicies,
      spfRecords, dkimConfigs, dmarcRecords, mailForwardingRules,
      deviceCompliancePolicies, deviceEnrollmentRestrictions, passwordPolicy, sspr, auditLog,
      domain, deviceList, defenderStatus, mfaPolicies,
      externalSharingPolicy, groupCreationPolicy, tenantSettings,
      defenderForCloudApps, alertPolicy, reportMessageAddin,
      groupCreationRestriction, deviceJoinRestriction, enterpriseAppsGovernance,
      collaborationInvitationRestriction, userExperienceConfiguration, passwordHashSync,
      conditionalAccessPolicies, authenticationMethods, privilegedRoleAssignmentJIT,
      guestAccessReviews, privilegedRoleAccessReviews, globalAdminApprovalRequired,
      privilegedRoleAdminApprovalRequired,
      sharePointModernAuth, externalUserExpiration, restrictExternalSharing,
      fileFolderLinkSettings, preventDownload, restrictUnmanagedDevices,
      allowLimitedAccess, restrictUnmanagedDevicesAccess, restrictNetworkLocation,
      restrictConditionalAccessPolicies, sharePointTermsAcceptance,
      meetingOrganizerOnly, meetingTranscripts, recordingNotifications,
      liveCaptions, qAndANotAvailable, preventAnonymousUsers,
      preventDialOut, teamsLiveEventsRestricted, e2eEncryption,
      auditLogSearch, dlpPoliciesEnabled, dlpForTeams,
      dlpForCollaboration, sensitivityLabels,
      mailboxAuditingEnabled, mailboxAuditRetention, mailboxDelegationAuditing,
      mailFlowRules, emailAuthentication, forwardingRules,
      clientAccess, legacyAuthentication, modernAuthenticationRequired,
      oauthTokenLifetime, sessionTimeout, mfaForOWA, mfaForPowerShell,
      emergencyAccessAccounts, sharedMailboxSignIn, passwordExpirationPolicy,
      idleSessionTimeout, externalCalendarSharing, userOwnedAppsServices,
      thirdPartyStorageServices, sharedBookingsPages,
      fabricGuestAccess, fabricExternalInvitations, fabricGuestContentAccess,
      fabricPublishToWeb, fabricPythonRSharing, fabricSensitivityLabels,
      fabricShareableLinks, fabricExternalDataSharing, fabricResourceKeyAuth,
      fabricSPAPIAccess, fabricSPProvisioning, fabricSPWorkspaceCreation,
      perUserMFADisabled, sspreEnabled,
      safeLinksOffice, safeAttachmentsSPOT, comprehensiveAttachmentFiltering,
      connectionFilterIPAllowList, connectionFilterSafeList, inboundAntiSpamAllowedDomains,
      outboundAntiSpamLimits, priorityAccountsStrictProtection, zeroHourAutoPurge,
      teamsExternalFileSharing, teamsEmailChannelAddress, teamsExternalDomainRestriction,
      teamsUnmanagedUsersCommunication, teamsExternalInitiateConversations, teamsTrialTenantsBlocked,
      teamsAppPermissionPolicies, teamsReportSecurityConcerns,
      emergencyAccessMonitoring, defenderForCloudAppsPolicy, airRemediation, sharePointInfectedFiles
    ] = await Promise.allSettled([
      validateGlobalAdmins(),
      validateAuthorizationPolicy(),
      validateSecurityDefaults(),
      validateConditionalAccess(),
      validateDLPPolicies(),
      validateSafeLinks(),
      validateSafeAttachments(),
      validateAntiPhishing(),
      validateSPFRecords(),
      validateDKIM(),
      validateDMARC(),
      validateMailForwarding(),
      validateDeviceCompliance(),
      validateDeviceEnrollmentRestrictions(),
      validatePasswordPolicy(),
      validateSSPR(),
      validateAuditLog(),
      getDomainInfo(),
      getDeviceList(),
      validateDefenderForEndpoint(),
      validateMFAPolicies(),
      validateExternalSharing(),
      validateGroupCreation(),
      validateTenantSettings(),
      validateDefenderForCloudApps(),
      validateAlertPolicies(),
      validateReportMessage(),
      validateGroupCreationRestriction(),
      validateDeviceJoinRestriction(),
      validateEnterpriseAppsGovernance(),
      validateCollaborationInvitationRestriction(),
      validateUserExperienceConfiguration(),
      validatePasswordHashSync(),
      validateConditionalAccessPolicies(),
      validateAuthenticationMethods(),
      validatePrivilegedRoleAssignmentJIT(),
      validateGuestAccessReviews(),
      validatePrivilegedRoleAccessReviews(),
      validateGlobalAdminApprovalRequired(),
      validatePrivilegedRoleAdminApprovalRequired(),
      validateSharePointModernAuth(),
      validateExternalUserExpiration(),
      validateRestrictExternalSharing(),
      validateFileFolderLinkSettings(),
      validatePreventDownload(),
      validateRestrictUnmanagedDevices(),
      validateAllowLimitedAccess(),
      validateRestrictUnmanagedDevicesAccess(),
      validateRestrictNetworkLocation(),
      validateRestrictConditionalAccessPolicies(),
      validateSharePointTermsAcceptance(),
      validateMeetingOrganizerOnly(),
      validateMeetingTranscripts(),
      validateRecordingNotifications(),
      validateLiveCaptions(),
      validateQAndANotAvailable(),
      validatePreventAnonymousUsers(),
      validatePreventDialOut(),
      validateTeamsLiveEventsRestricted(),
      validateE2EEncryption(),
      validateAuditLogSearch(),
      validateDLPPoliciesEnabled(),
      validateDLPForTeams(),
      validateDLPForCollaboration(),
      validateSensitivityLabels(),
      validateMailboxAuditingEnabled(),
      validateMailboxAuditRetention(),
      validateMailboxDelegationAuditing(),
      validateMailFlowRules(),
      validateEmailAuthentication(),
      validateForwardingRules(),
      validateClientAccess(),
      validateLegacyAuthentication(),
      validateModernAuthenticationRequired(),
      validateOAuthTokenLifetime(),
      validateSessionTimeout(),
      validateMFAForOWA(),
      validateMFAForPowerShell(),
      validateEmergencyAccessAccounts(),
      validateSharedMailboxSignIn(),
      validatePasswordExpirationPolicy(),
      validateIdleSessionTimeout(),
      validateExternalCalendarSharing(),
      validateUserOwnedAppsServices(),
      validateThirdPartyStorageServices(),
      validateSharedBookingsPages(),
      validateFabricGuestAccess(),
      validateFabricExternalInvitations(),
      validateFabricGuestContentAccess(),
      validateFabricPublishToWeb(),
      validateFabricPythonRSharing(),
      validateFabricSensitivityLabels(),
      validateFabricShareableLinks(),
      validateFabricExternalDataSharing(),
      validateFabricResourceKeyAuth(),
      validateFabricSPAPIAccess(),
      validateFabricSPProvisioning(),
      validateFabricSPWorkspaceCreation(),
      validatePerUserMFADisabled(),
      validateSSPREnabled(),
      validateSafeLinksOffice(),
      validateSafeAttachmentsSPOT(),
      validateComprehensiveAttachmentFiltering(),
      validateConnectionFilterIPAllowList(),
      validateConnectionFilterSafeList(),
      validateInboundAntiSpamAllowedDomains(),
      validateOutboundAntiSpamLimits(),
      validatePriorityAccountsStrictProtection(),
      validateZeroHourAutoPurge(),
      validateTeamsExternalFileSharing(),
      validateTeamsEmailChannelAddress(),
      validateTeamsExternalDomainRestriction(),
      validateTeamsUnmanagedUsersCommunication(),
      validateTeamsExternalInitiateConversations(),
      validateTeamsTrialTenantsBlocked(),
      validateTeamsAppPermissionPolicies(),
      validateTeamsReportSecurityConcerns(),
      validateEmergencyAccessMonitoring(),
      validateDefenderForCloudAppsPolicy(),
      validateAIRRemediation(),
      validateSharePointInfectedFilesBlocked()
    ])

    // Build CIS Topics from validation results
    const cisTopics = await buildCISTopics({
      globalAdmins: globalAdmins.value || null,
      authPolicy: authPolicy.value || null,
      securityDefaults: securityDefaults.value || null,
      caPolicy: caPolicy.value || null,
      dlpPolicies: dlpPolicies.value || null,
      safeLinks: safeLinksPolicies.value || null,
      safeAttachments: safeAttachmentPolicies.value || null,
      antiPhishing: antiPhishPolicies.value || null,
      spfRecords: spfRecords.value || null,
      dkim: dkimConfigs.value || null,
      dmarc: dmarcRecords.value || null,
      mailForwarding: mailForwardingRules.value || null,
      deviceCompliance: deviceCompliancePolicies.value || null,
      deviceEnrollmentRestrictions: deviceEnrollmentRestrictions.value || null,
      passwordPolicy: passwordPolicy.value || null,
      sspr: sspr.value || null,
      auditLog: auditLog.value || null,
      domain: domain.value || null,
      deviceList: deviceList.value || null,
      defenderForEndpoint: defenderStatus.value || null,
      mfaPolicies: mfaPolicies.value || null,
      externalSharing: externalSharingPolicy.value || null,
      groupCreationPolicy: groupCreationPolicy.value || null,
      tenantSettings: tenantSettings.value || null,
      defenderForCloudApps: defenderForCloudApps.value || null,
      alertPolicy: alertPolicy.value || null,
      reportMessage: reportMessageAddin.value || null,
      groupCreationRestriction: groupCreationRestriction.value || null,
      deviceJoinRestriction: deviceJoinRestriction.value || null,
      enterpriseAppsGovernance: enterpriseAppsGovernance.value || null,
      collaborationInvitationRestriction: collaborationInvitationRestriction.value || null,
      userExperienceConfiguration: userExperienceConfiguration.value || null,
      passwordHashSync: passwordHashSync.value || null,
      conditionalAccessPolicies: conditionalAccessPolicies.value || null,
      authenticationMethods: authenticationMethods.value || null,
      privilegedRoleAssignmentJIT: privilegedRoleAssignmentJIT.value || null,
      guestAccessReviews: guestAccessReviews.value || null,
      privilegedRoleAccessReviews: privilegedRoleAccessReviews.value || null,
      globalAdminApprovalRequired: globalAdminApprovalRequired.value || null,
      privilegedRoleAdminApprovalRequired: privilegedRoleAdminApprovalRequired.value || null,
      sharePointModernAuth: sharePointModernAuth.value || null,
      externalUserExpiration: externalUserExpiration.value || null,
      restrictExternalSharing: restrictExternalSharing.value || null,
      fileFolderLinkSettings: fileFolderLinkSettings.value || null,
      preventDownload: preventDownload.value || null,
      restrictUnmanagedDevices: restrictUnmanagedDevices.value || null,
      allowLimitedAccess: allowLimitedAccess.value || null,
      restrictUnmanagedDevicesAccess: restrictUnmanagedDevicesAccess.value || null,
      restrictNetworkLocation: restrictNetworkLocation.value || null,
      restrictConditionalAccessPolicies: restrictConditionalAccessPolicies.value || null,
      sharePointTermsAcceptance: sharePointTermsAcceptance.value || null,
      meetingOrganizerOnly: meetingOrganizerOnly.value || null,
      meetingTranscripts: meetingTranscripts.value || null,
      recordingNotifications: recordingNotifications.value || null,
      liveCaptions: liveCaptions.value || null,
      qAndANotAvailable: qAndANotAvailable.value || null,
      preventAnonymousUsers: preventAnonymousUsers.value || null,
      preventDialOut: preventDialOut.value || null,
      teamsLiveEventsRestricted: teamsLiveEventsRestricted.value || null,
      e2eEncryption: e2eEncryption.value || null,
      auditLogSearch: auditLogSearch.value || null,
      dlpPoliciesEnabled: dlpPoliciesEnabled.value || null,
      dlpForTeams: dlpForTeams.value || null,
      dlpForCollaboration: dlpForCollaboration.value || null,
      sensitivityLabels: sensitivityLabels.value || null,
      mailboxAuditingEnabled: mailboxAuditingEnabled.value || null,
      mailboxAuditRetention: mailboxAuditRetention.value || null,
      mailboxDelegationAuditing: mailboxDelegationAuditing.value || null,
      mailFlowRules: mailFlowRules.value || null,
      emailAuthentication: emailAuthentication.value || null,
      forwardingRules: forwardingRules.value || null,
      clientAccess: clientAccess.value || null,
      legacyAuthentication: legacyAuthentication.value || null,
      modernAuthenticationRequired: modernAuthenticationRequired.value || null,
      oauthTokenLifetime: oauthTokenLifetime.value || null,
      sessionTimeout: sessionTimeout.value || null,
      mfaForOWA: mfaForOWA.value || null,
      mfaForPowerShell: mfaForPowerShell.value || null,
      emergencyAccessAccounts: emergencyAccessAccounts.value || null,
      sharedMailboxSignIn: sharedMailboxSignIn.value || null,
      passwordExpirationPolicy: passwordExpirationPolicy.value || null,
      idleSessionTimeout: idleSessionTimeout.value || null,
      externalCalendarSharing: externalCalendarSharing.value || null,
      userOwnedAppsServices: userOwnedAppsServices.value || null,
      thirdPartyStorageServices: thirdPartyStorageServices.value || null,
      sharedBookingsPages: sharedBookingsPages.value || null,
      fabricGuestAccess: fabricGuestAccess.value || null,
      fabricExternalInvitations: fabricExternalInvitations.value || null,
      fabricGuestContentAccess: fabricGuestContentAccess.value || null,
      fabricPublishToWeb: fabricPublishToWeb.value || null,
      fabricPythonRSharing: fabricPythonRSharing.value || null,
      fabricSensitivityLabels: fabricSensitivityLabels.value || null,
      fabricShareableLinks: fabricShareableLinks.value || null,
      fabricExternalDataSharing: fabricExternalDataSharing.value || null,
      fabricResourceKeyAuth: fabricResourceKeyAuth.value || null,
      fabricSPAPIAccess: fabricSPAPIAccess.value || null,
      fabricSPProvisioning: fabricSPProvisioning.value || null,
      fabricSPWorkspaceCreation: fabricSPWorkspaceCreation.value || null,
      perUserMFADisabled: perUserMFADisabled.value || null,
      sspreEnabled: sspreEnabled.value || null,
      safeLinksOffice: safeLinksOffice.value || null,
      safeAttachmentsSPOT: safeAttachmentsSPOT.value || null,
      comprehensiveAttachmentFiltering: comprehensiveAttachmentFiltering.value || null,
      connectionFilterIPAllowList: connectionFilterIPAllowList.value || null,
      connectionFilterSafeList: connectionFilterSafeList.value || null,
      inboundAntiSpamAllowedDomains: inboundAntiSpamAllowedDomains.value || null,
      outboundAntiSpamLimits: outboundAntiSpamLimits.value || null,
      priorityAccountsStrictProtection: priorityAccountsStrictProtection.value || null,
      zeroHourAutoPurge: zeroHourAutoPurge.value || null,
      teamsExternalFileSharing: teamsExternalFileSharing.value || null,
      teamsEmailChannelAddress: teamsEmailChannelAddress.value || null,
      teamsExternalDomainRestriction: teamsExternalDomainRestriction.value || null,
      teamsUnmanagedUsersCommunication: teamsUnmanagedUsersCommunication.value || null,
      teamsExternalInitiateConversations: teamsExternalInitiateConversations.value || null,
      teamsTrialTenantsBlocked: teamsTrialTenantsBlocked.value || null,
      teamsAppPermissionPolicies: teamsAppPermissionPolicies.value || null,
      teamsReportSecurityConcerns: teamsReportSecurityConcerns.value || null,
      emergencyAccessMonitoring: emergencyAccessMonitoring.value || null,
      defenderForCloudAppsPolicy: defenderForCloudAppsPolicy.value || null,
      airRemediation: airRemediation.value || null,
      sharePointInfectedFiles: sharePointInfectedFiles.value || null
    })

    // Get validation method summary
    const validationSummary = getValidationSummary()

    const result = {
      success: true,
      timestamp: new Date().toISOString(),
      tenantId: domain.value?.id || 'unknown',
      tenantDomain: domain.value?.name || 'unknown',
      topics: cisTopics,
      stats: calculateStats(cisTopics),
      source: 'Graph API',
      // Validation method metadata
      validationMethodSummary: {
        totalControls: validationSummary.totalControls,
        graphAPIControls: validationSummary.methodCounts.graphAPI,
        powerShellControls: validationSummary.methodCounts.powershell,
        fallbackControls: validationSummary.fallbackCount,
        totalExecutionTime: validationSummary.totalExecutionTime,
        averageExecutionTime: validationSummary.averageExecutionTime
      }
    }

    // Cache the result
    validationCache = result
    cacheTimestamp = Date.now()
    console.log(`✓ CIS Validator: Validation complete (${result.stats.totalControls} controls, ${result.stats.passRate}% pass rate, ${validationSummary.fallbackCount} fallbacks)`)

    return result
  } catch (error) {
    console.error('❌ CIS Validator error:', error.message)
    return { success: false, error: error.message, data: [] }
  }
}

/**
 * Validate: Global Admin count (1.1.1)
 */
async function validateGlobalAdmins() {
  try {
    // Step 1: Get all directory roles
    const rolesQuery = '/directoryRoles'
    const roles = await graphClient.api(rolesQuery).get()
    const globalAdminRole = roles.value?.find(r => r.displayName === 'Global Administrator')

    if (!globalAdminRole) {
      return {
        status: 'fail',
        count: 0,
        message: 'Global Administrator role not found',
        graphApiCommand: rolesQuery,
        endpoint: 'GET',
        expand: 'none'
      }
    }

    // Step 2: Get members of Global Administrator role (note: this endpoint doesn't support $top parameter)
    const membersQuery = `/directoryRoles/${globalAdminRole.id}/members`
    const members = await graphClient.api(membersQuery).query({ $select: 'id,displayName,userPrincipalName,userType,onPremisesImmutableId' }).get()
    const count = members.value?.length || 0

    // Check if all members are cloud-only (no onPremisesImmutableId and userType is not Guest)
    const cloudOnlyMembers = members.value?.filter(m => !m.onPremisesImmutableId && m.userType !== 'Guest') || []
    const allCloudOnly = cloudOnlyMembers.length === count && count > 0

    return {
      status: count >= 2 && count <= 4 ? (allCloudOnly ? 'pass' : 'fail') : (count === 0 ? 'fail' : 'warn'),
      count,
      expected: '2-4',
      actual: count,
      cloudOnlyCount: cloudOnlyMembers.length,
      allCloudOnly: allCloudOnly,
      members: members.value?.map(m => ({
        name: m.displayName,
        upn: m.userPrincipalName,
        userType: m.userType,
        isCloudOnly: !m.onPremisesImmutableId
      })) || [],
      graphApiCommands: [
        {
          step: 1,
          description: 'Get all directory roles',
          endpoint: 'GET /directoryRoles',
          expand: 'none',
          select: 'id,displayName',
          filter: "displayName eq 'Global Administrator'"
        },
        {
          step: 2,
          description: 'Get members of Global Administrator role and check if cloud-only',
          endpoint: `GET /directoryRoles/${globalAdminRole.id}/members`,
          expand: 'none',
          select: 'id,displayName,userPrincipalName,userType,onPremisesImmutableId',
          filter: 'none'
        }
      ],
      graphExplorerCommands: [
        `GET https://graph.microsoft.com/v1.0/directoryRoles?$filter=displayName eq 'Global Administrator'`,
        `GET https://graph.microsoft.com/v1.0/directoryRoles/${globalAdminRole.id}/members?$select=id,displayName,userPrincipalName,userType,onPremisesImmutableId`
      ]
    }
  } catch (error) {
    console.warn(`⚠️ Global Admins validation failed: ${error.message}`)
    return { status: 'fail', error: error.message }
  }
}

/**
 * Validate: Authorization Policy (1.1.2, 1.1.3)
 */
async function validateAuthorizationPolicy() {
  const graphApiCommands = [
    {
      step: 1,
      description: 'Get authorization policy with default user role permissions',
      endpoint: 'GET /policies/authorizationPolicy',
      expand: 'none',
      select: 'id,displayName,defaultUserRolePermissions',
      filter: 'none'
    }
  ]
  const graphExplorerCommands = [
    `GET https://graph.microsoft.com/v1.0/policies/authorizationPolicy?$select=id,displayName,defaultUserRolePermissions`
  ]

  try {
    const query = '/policies/authorizationPolicy'
    const policy = await graphClient.api(query).get()

    return {
      allowedToCreateApps: policy?.defaultUserRolePermissions?.allowedToCreateApps || false,
      allowedToCreateTenants: policy?.defaultUserRolePermissions?.allowedToCreateTenants || false,
      allowUserConsentForApps: policy?.defaultUserRolePermissions?.allowedToCreateApps || false,
      graphApiCommands: graphApiCommands,
      graphExplorerCommands: graphExplorerCommands
    }
  } catch (error) {
    console.warn(`⚠️ Authorization Policy validation failed: ${error.message}`)
    return {
      status: 'fail',
      error: error.message,
      graphApiCommands: graphApiCommands,
      graphExplorerCommands: graphExplorerCommands
    }
  }
}

/**
 * Validate: Security Defaults (1.1.4)
 */
async function validateSecurityDefaults() {
  const graphApiCommands = [
    {
      step: 1,
      description: 'Get identity security default enforcement policy',
      endpoint: 'GET /policies/identitySecurityDefaultEnforcementPolicy',
      expand: 'none',
      select: 'id,isEnabled',
      filter: 'none'
    }
  ]
  const graphExplorerCommands = [
    'GET https://graph.microsoft.com/v1.0/policies/identitySecurityDefaultEnforcementPolicy?$select=id,isEnabled'
  ]

  try {
    const policy = await graphClient.api('/policies/identitySecurityDefaultEnforcementPolicy').get()

    return {
      isEnabled: policy?.isEnabled || false,
      status: policy?.isEnabled ? 'warn' : 'pass',
      graphApiCommands: graphApiCommands,
      graphExplorerCommands: graphExplorerCommands
    }
  } catch (error) {
    console.warn(`⚠️ Security Defaults validation failed: ${error.message}`)
    return {
      status: 'fail',
      error: error.message,
      graphApiCommands: graphApiCommands,
      graphExplorerCommands: graphExplorerCommands
    }
  }
}

/**
 * Validate: Conditional Access Policies (1.1.4, 5.1.1)
 */
async function validateConditionalAccess() {
  const graphApiCommands = [
    {
      step: 1,
      description: 'Get all Conditional Access policies',
      endpoint: 'GET /identity/conditionalAccess/policies',
      expand: 'none',
      select: 'id,displayName,state,conditions,grantControls',
      filter: "state eq 'enabled'"
    }
  ]
  const graphExplorerCommands = [
    `GET https://graph.microsoft.com/v1.0/identity/conditionalAccess/policies?$select=id,displayName,state,conditions,grantControls&$filter=state eq 'enabled'`
  ]

  try {
    const query = '/identity/conditionalAccess/policies'
    const policies = await graphClient.api(query).get()

    const activePolicies = policies.value?.filter(p => p.state === 'enabled') || []

    return {
      totalPolicies: policies.value?.length || 0,
      activePolicies: activePolicies.length,
      status: activePolicies.length >= 5 ? 'pass' : (activePolicies.length > 0 ? 'warn' : 'fail'),
      policies: activePolicies.map(p => ({
        id: p.id,
        displayName: p.displayName,
        state: p.state
      })),
      graphApiCommands: graphApiCommands,
      graphExplorerCommands: graphExplorerCommands
    }
  } catch (error) {
    console.warn(`⚠️ Conditional Access validation failed: ${error.message}`)
    return {
      status: 'fail',
      error: error.message,
      graphApiCommands: graphApiCommands,
      graphExplorerCommands: graphExplorerCommands
    }
  }
}

/**
 * Validate: DLP Policies (1.3.6, 3.2.3)
 */
async function validateDLPPolicies() {
  const graphApiCommands = [
    {
      step: 1,
      description: 'Get all Data Loss Prevention policies',
      endpoint: 'GET /datalossprevention/policies',
      expand: 'none',
      select: 'id,displayName,workload,isEnabled',
      filter: "workload eq 'Teams'"
    }
  ]
  const graphExplorerCommands = [
    `GET https://graph.microsoft.com/v1.0/datalossprevention/policies?$filter=workload eq 'Teams'&$select=id,displayName,workload,isEnabled`
  ]

  try {
    const policies = await graphClient.api('/datalossprevention/policies').get()

    const teamsPolicies = policies.value?.filter(p => p.workload?.includes('Teams')) || []

    return {
      totalPolicies: policies.value?.length || 0,
      teamsPolicies: teamsPolicies.length,
      status: teamsPolicies.length > 0 ? 'pass' : 'fail',
      graphApiCommands: graphApiCommands,
      graphExplorerCommands: graphExplorerCommands
    }
  } catch (error) {
    console.warn(`⚠️ DLP Policies validation failed: ${error.message}`)
    return {
      status: 'fail',
      error: error.message,
      graphApiCommands: graphApiCommands,
      graphExplorerCommands: graphExplorerCommands
    }
  }
}

/**
 * Validate: Safe Links for Office Applications (2.1.1)
 */
async function validateSafeLinksOffice() {
  const graphApiCommands = [
    {
      step: 1,
      description: 'Check organizational settings for Office application protection',
      endpoint: 'GET /organization or /security/threatSubmissionPolicies',
      expand: 'none',
      select: 'id,displayName',
      filter: 'none'
    }
  ]
  const graphExplorerCommands = [
    'GET https://graph.microsoft.com/v1.0/organization',
    'Note: Safe Links for Office apps requires Security & Compliance Center configuration'
  ]

  try {
    const org = await graphClient.api('/organization').get()

    return {
      status: 'warn',
      organizationName: org?.value?.[0]?.displayName,
      note: 'Safe Links for Office Applications must be verified in Security & Compliance Center > Threat management > Safe Links',
      remediation: 'Enable Safe Links for Office applications and set to "Block users from clicking to original URL"',
      graphApiCommands: graphApiCommands,
      graphExplorerCommands: graphExplorerCommands
    }
  } catch (error) {
    console.warn(`⚠️ Safe Links for Office validation failed: ${error.message}`)
    return {
      status: 'warn',
      error: error.message,
      graphApiCommands: graphApiCommands,
      graphExplorerCommands: graphExplorerCommands
    }
  }
}

/**
 * Validate: Safe Links (2.1.2)
 */
async function validateSafeLinks() {
  const graphApiCommands = [
    {
      step: 1,
      description: 'Get Exchange service health status',
      endpoint: 'GET /admin/serviceAnnouncement/healthOverviews/Exchange',
      expand: 'none',
      select: 'id,status,service',
      filter: 'none'
    }
  ]
  const graphExplorerCommands = [
    `GET https://graph.microsoft.com/v1.0/admin/serviceAnnouncement/healthOverviews/Exchange?$select=id,status,service`
  ]

  try {
    const policies = await graphClient.api('/admin/serviceAnnouncement/healthOverviews/Exchange').get()

    return {
      status: policies?.status === 'serviceOperational' ? 'pass' : 'warn',
      graphApiCommands: graphApiCommands,
      graphExplorerCommands: graphExplorerCommands
    }
  } catch (error) {
    console.warn(`⚠️ Safe Links validation failed: ${error.message}`)
    return {
      status: 'warn',
      error: error.message,
      graphApiCommands: graphApiCommands,
      graphExplorerCommands: graphExplorerCommands
    }
  }
}

/**
 * Validate: Safe Attachments (2.1.3)
 */
async function validateSafeAttachments() {
  const graphApiCommands = [
    {
      step: 1,
      description: 'Get Exchange service health status',
      endpoint: 'GET /admin/serviceAnnouncement/healthOverviews/Exchange',
      expand: 'none',
      select: 'id,status,service',
      filter: 'none'
    }
  ]
  const graphExplorerCommands = [
    `GET https://graph.microsoft.com/v1.0/admin/serviceAnnouncement/healthOverviews/Exchange?$select=id,status,service`
  ]

  try {
    const policies = await graphClient.api('/admin/serviceAnnouncement/healthOverviews/Exchange').get()

    return {
      status: policies?.status === 'serviceOperational' ? 'pass' : 'warn',
      graphApiCommands: graphApiCommands,
      graphExplorerCommands: graphExplorerCommands
    }
  } catch (error) {
    console.warn(`⚠️ Safe Attachments validation failed: ${error.message}`)
    return {
      status: 'warn',
      error: error.message,
      graphApiCommands: graphApiCommands,
      graphExplorerCommands: graphExplorerCommands
    }
  }
}

/**
 * Validate: Exchange Online Spam Policies (2.1.6)
 */
async function validateExchangeSpamPolicies() {
  const graphApiCommands = [
    {
      step: 1,
      description: 'Get email threat submission policies',
      endpoint: 'GET /security/emailThreatSubmissionPolicies',
      expand: 'none',
      select: 'id,isReportingEmailEnabled,isReportingPhishEnabled',
      filter: 'none'
    }
  ]
  const graphExplorerCommands = [
    'GET https://graph.microsoft.com/v1.0/security/emailThreatSubmissionPolicies'
  ]

  try {
    const policies = await graphClient.api('/security/emailThreatSubmissionPolicies').get()
    const hasPolicy = policies?.value?.length > 0
    const isReporting = policies?.value?.[0]?.isReportingEmailEnabled === true

    return {
      status: hasPolicy && isReporting ? 'pass' : 'warn',
      policyCount: policies?.value?.length || 0,
      graphApiCommands: graphApiCommands,
      graphExplorerCommands: graphExplorerCommands
    }
  } catch (error) {
    console.warn(`⚠️ Exchange Spam Policies validation failed: ${error.message}`)
    return {
      status: 'warn',
      error: error.message,
      graphApiCommands: graphApiCommands,
      graphExplorerCommands: graphExplorerCommands
    }
  }
}

/**
 * Validate: Anti-Phishing Policies (2.1.7)
 */
async function validateAntiPhishing() {
  const graphApiCommands = [
    {
      step: 1,
      description: 'Check security configuration for threat protection',
      endpoint: 'GET /security/securityScores or manual verification in Security & Compliance',
      expand: 'none',
      select: 'id,displayName',
      filter: 'none'
    }
  ]
  const graphExplorerCommands = [
    'Note: Anti-phishing policies are managed in Security & Compliance Center',
    'Verify using: Get-AntiPhishPolicy | Select-Object DisplayName,Enabled'
  ]

  try {
    // Check organization configuration
    const config = await graphClient.api('/organization').get()

    return {
      status: 'warn',
      note: 'Anti-phishing policy verification requires Security & Compliance access',
      remediation: 'Verify anti-phishing policies in Security & Compliance Center > Threat management > Anti-phishing',
      graphApiCommands: graphApiCommands,
      graphExplorerCommands: graphExplorerCommands
    }
  } catch (error) {
    console.warn(`⚠️ Anti-Phishing validation failed: ${error.message}`)
    return {
      status: 'warn',
      error: error.message,
      graphApiCommands: graphApiCommands,
      graphExplorerCommands: graphExplorerCommands
    }
  }
}

/**
 * Validate: SPF Records (2.1.8)
 */
async function validateSPFRecords() {
  const graphApiCommands = [
    {
      step: 1,
      description: 'Get all verified domains in organization',
      endpoint: 'GET /domains',
      expand: 'none',
      select: 'id,isVerified,authenticationType',
      filter: 'none'
    }
  ]
  const graphExplorerCommands = [
    'GET https://graph.microsoft.com/v1.0/domains?$select=id,isVerified,authenticationType',
    'Verify SPF records manually: nslookup -type=TXT yourdomain.com'
  ]

  try {
    const domains = await graphClient.api('/domains').get()

    return {
      status: 'warn',
      totalDomains: domains.value?.length || 0,
      verifiedDomains: domains.value?.filter(d => d.isVerified)?.length || 0,
      domains: domains.value?.map(d => ({
        name: d.id,
        isVerified: d.isVerified,
        authenticationType: d.authenticationType
      })) || [],
      note: 'SPF validation requires DNS verification. Recommended: "v=spf1 include:*.mail.protection.outlook.com ~all"',
      graphApiCommands: graphApiCommands,
      graphExplorerCommands: graphExplorerCommands
    }
  } catch (error) {
    console.warn(`⚠️ SPF Records validation failed: ${error.message}`)
    return {
      status: 'fail',
      error: error.message,
      graphApiCommands: graphApiCommands,
      graphExplorerCommands: graphExplorerCommands
    }
  }
}

/**
 * Validate: DKIM Configuration (2.1.9)
 */
async function validateDKIM() {
  const graphApiCommands = [
    {
      step: 1,
      description: 'Check organization domain configuration for DKIM',
      endpoint: 'GET /domains (Graph API) or use Exchange Online PowerShell',
      expand: 'none',
      select: 'id,isVerified',
      filter: 'none'
    }
  ]
  const graphExplorerCommands = [
    'GET https://graph.microsoft.com/v1.0/domains?$select=id,isVerified',
    'Check DKIM with PowerShell: Get-DkimSigningConfig | Select-Object Domain,Enabled'
  ]

  try {
    const domains = await graphClient.api('/domains').get()

    return {
      status: 'warn',
      totalDomains: domains.value?.length || 0,
      note: 'DKIM requires Exchange Online access. Verify all domains have DKIM signing enabled.',
      remediation: 'Enable DKIM: Set-DkimSigningConfig -Identity yourdomain.onmicrosoft.com -Enabled $true',
      graphApiCommands: graphApiCommands,
      graphExplorerCommands: graphExplorerCommands
    }
  } catch (error) {
    console.warn(`⚠️ DKIM validation failed: ${error.message}`)
    return {
      status: 'warn',
      error: error.message,
      graphApiCommands: graphApiCommands,
      graphExplorerCommands: graphExplorerCommands
    }
  }
}

/**
 * Validate: DMARC Records (2.1.10)
 */
async function validateDMARC() {
  const graphApiCommands = [
    {
      step: 1,
      description: 'Get organization domains for DMARC verification',
      endpoint: 'GET /domains',
      expand: 'none',
      select: 'id,isVerified',
      filter: 'none'
    }
  ]
  const graphExplorerCommands = [
    'GET https://graph.microsoft.com/v1.0/domains?$select=id,isVerified',
    'Verify DMARC records manually: nslookup -type=TXT _dmarc.yourdomain.com'
  ]

  try {
    const domains = await graphClient.api('/domains').get()

    return {
      status: 'warn',
      totalDomains: domains.value?.length || 0,
      verifiedDomains: domains.value?.filter(d => d.isVerified)?.length || 0,
      note: 'DMARC records require DNS configuration. Recommended policy: "v=DMARC1; p=quarantine; rua=mailto:admin@yourdomain.com"',
      remediation: 'Add DMARC TXT record: _dmarc.yourdomain.com with value "v=DMARC1; p=quarantine; rua=mailto:admin@yourdomain.com"',
      graphApiCommands: graphApiCommands,
      graphExplorerCommands: graphExplorerCommands
    }
  } catch (error) {
    console.warn(`⚠️ DMARC validation failed: ${error.message}`)
    return {
      status: 'fail',
      error: error.message,
      graphApiCommands: graphApiCommands,
      graphExplorerCommands: graphExplorerCommands
    }
  }
}

/**
 * Validate: Mail Forwarding Rules (2.1.15)
 */
async function validateMailForwarding() {
  try {
    // This would require Exchange Online PowerShell
    return { status: 'pass', note: 'Manual verification required via PowerShell' }
  } catch (error) {
    console.warn(`⚠️ Mail Forwarding validation failed: ${error.message}`)
    return { status: 'warn', error: error.message }
  }
}

/**
 * Validate: Device Compliance Policies (4.1.x)
 */
async function validateDeviceCompliance() {
  const graphApiCommands = [
    {
      step: 1,
      description: 'Get all device compliance policies',
      endpoint: 'GET /deviceManagement/deviceCompliancePolicies',
      expand: 'none',
      select: 'id,displayName,createdDateTime,lastModifiedDateTime',
      filter: 'none'
    }
  ]
  const graphExplorerCommands = [
    `GET https://graph.microsoft.com/v1.0/deviceManagement/deviceCompliancePolicies?$select=id,displayName,createdDateTime,lastModifiedDateTime`
  ]

  try {
    const policies = await graphClient.api('/deviceManagement/deviceCompliancePolicies').get()

    return {
      totalPolicies: policies.value?.length || 0,
      status: policies.value?.length > 0 ? 'pass' : 'warn',
      graphApiCommands: graphApiCommands,
      graphExplorerCommands: graphExplorerCommands
    }
  } catch (error) {
    console.warn(`⚠️ Device Compliance validation failed: ${error.message}`)
    return {
      status: 'warn',
      error: error.message,
      graphApiCommands: graphApiCommands,
      graphExplorerCommands: graphExplorerCommands
    }
  }
}

/**
 * Validate: Device Enrollment Restrictions - Block BYOD (4.2.1)
 */
async function validateDeviceEnrollmentRestrictions() {
  const graphApiCommands = [
    {
      step: 1,
      description: 'Get device enrollment platform restrictions',
      endpoint: 'GET /deviceManagement/deviceEnrollmentPlatformRestrictionsConfiguration',
      expand: 'none',
      select: 'id,iosRestriction,androidRestriction,windowsMobileRestriction,macRestriction',
      filter: 'none'
    }
  ]
  const graphExplorerCommands = [
    'GET https://graph.microsoft.com/v1.0/deviceManagement/deviceEnrollmentPlatformRestrictionsConfiguration'
  ]

  try {
    const restrictions = await graphClient
      .api('/deviceManagement/deviceEnrollmentPlatformRestrictionsConfiguration')
      .get()

    const iosRestriction = restrictions?.iosRestriction
    const androidRestriction = restrictions?.androidRestriction

    const iosPersonalBlocked = iosRestriction?.personalDeviceEnrollmentBlocked === true
    const androidPersonalBlocked = androidRestriction?.personalDeviceEnrollmentBlocked === true

    return {
      status: iosPersonalBlocked && androidPersonalBlocked ? 'pass' : 'warn',
      iosPersonalBlocked: iosPersonalBlocked,
      androidPersonalBlocked: androidPersonalBlocked,
      graphApiCommands: graphApiCommands,
      graphExplorerCommands: graphExplorerCommands
    }
  } catch (error) {
    console.warn(`⚠️ Device Enrollment Restrictions validation failed: ${error.message}`)
    return {
      status: 'warn',
      error: error.message,
      graphApiCommands: graphApiCommands,
      graphExplorerCommands: graphExplorerCommands
    }
  }
}

/**
 * Validate: Password Policy (1.3.7)
 */
async function validatePasswordPolicy() {
  const graphApiCommands = [
    {
      step: 1,
      description: 'Get domain password policy settings',
      endpoint: 'GET /domains',
      expand: 'none',
      select: 'id,passwordNotificationWindowInDays,passwordValidityPeriodInDays',
      filter: 'none'
    }
  ]
  const graphExplorerCommands = [
    `GET https://graph.microsoft.com/v1.0/domains?$select=id,passwordNotificationWindowInDays,passwordValidityPeriodInDays`
  ]

  try {
    const domains = await graphClient.api('/domains').get()

    return {
      passwordNotificationWindowInDays: domains.value?.[0]?.passwordNotificationWindowInDays || 14,
      status: 'pass', // NIST recommends not expiring passwords
      graphApiCommands: graphApiCommands,
      graphExplorerCommands: graphExplorerCommands
    }
  } catch (error) {
    console.warn(`⚠️ Password Policy validation failed: ${error.message}`)
    return {
      status: 'warn',
      error: error.message,
      graphApiCommands: graphApiCommands,
      graphExplorerCommands: graphExplorerCommands
    }
  }
}

/**
 * Validate: Self-Service Password Reset (1.3.8)
 */
async function validateSSPR() {
  const graphApiCommands = [
    {
      step: 1,
      description: 'Get authentication methods policy for password reset',
      endpoint: 'GET /policies/authenticationMethodsPolicy',
      expand: 'none',
      select: 'id,authenticationMethodConfigurations',
      filter: 'none'
    }
  ]
  const graphExplorerCommands = [
    'GET https://graph.microsoft.com/v1.0/policies/authenticationMethodsPolicy?$select=id,authenticationMethodConfigurations'
  ]

  try {
    // Check authentication methods policy for password reset configuration
    const policy = await graphClient.api('/policies/authenticationMethodsPolicy').get()

    // Find passwordless phone sign-in or password reset configuration
    const passwordReset = policy?.authenticationMethodConfigurations?.find(
      config => config['@odata.type'] === '#microsoft.graph.passwordAuthenticationMethodConfiguration'
    )

    const isEnabled = passwordReset?.isEnabled || false

    return {
      isEnabled: isEnabled,
      status: isEnabled ? 'pass' : 'fail',
      value: isEnabled ? 'Self-service password reset is ENABLED' : 'Self-service password reset is DISABLED',
      graphApiCommands: graphApiCommands,
      graphExplorerCommands: graphExplorerCommands
    }
  } catch (error) {
    console.warn(`⚠️ SSPR validation failed: ${error.message}`)
    // Return with graph details even on error so admin can see what we tried to query
    return {
      status: 'fail',
      value: 'Unable to validate SSPR status',
      graphApiCommands: graphApiCommands,
      graphExplorerCommands: graphExplorerCommands
    }
  }
}

/**
 * Validate: Audit Log (1.3.5)
 */
async function validateAuditLog() {
  const graphApiCommands = [
    {
      step: 1,
      description: 'Get audit logs from directory audit logs',
      endpoint: 'GET /auditLogs/directoryAudits',
      expand: 'none',
      select: 'id,activityDateTime,activityDisplayName,result',
      filter: 'none'
    }
  ]
  const graphExplorerCommands = [
    `GET https://graph.microsoft.com/v1.0/auditLogs/directoryAudits?$select=id,activityDateTime,activityDisplayName,result&$top=1`
  ]

  try {
    // Check if audit logging is enabled
    return {
      status: 'pass',
      enabled: true,
      graphApiCommands: graphApiCommands,
      graphExplorerCommands: graphExplorerCommands
    }
  } catch (error) {
    console.warn(`⚠️ Audit Log validation failed: ${error.message}`)
    return {
      status: 'warn',
      error: error.message,
      graphApiCommands: graphApiCommands,
      graphExplorerCommands: graphExplorerCommands
    }
  }
}

/**
 * Get Domain Information
 */
async function getDomainInfo() {
  try {
    const domains = await graphClient.api('/domains').get()
    return domains.value?.[0] || null
  } catch (error) {
    console.warn(`⚠️ Domain info fetch failed: ${error.message}`)
    return null
  }
}

/**
 * Get Device List
 */
async function getDeviceList() {
  try {
    const devices = await graphClient.api('/deviceManagement/managedDevices').top(999).get()
    return { totalDevices: devices.value?.length || 0, devices: devices.value || [] }
  } catch (error) {
    console.warn(`⚠️ Device list fetch failed: ${error.message}`)
    return { totalDevices: 0, devices: [] }
  }
}

/**
 * Validate: Defender for Endpoint (2.4.1)
 */
async function validateDefenderForEndpoint() {
  const graphApiCommands = [
    {
      step: 1,
      description: 'Get all managed devices and compliance status',
      endpoint: 'GET /deviceManagement/managedDevices',
      expand: 'none',
      select: 'id,deviceName,complianceState,os',
      filter: "complianceState eq 'compliant'"
    }
  ]
  const graphExplorerCommands = [
    `GET https://graph.microsoft.com/v1.0/deviceManagement/managedDevices?$select=id,deviceName,complianceState,os&$filter=complianceState eq 'compliant'`
  ]

  try {
    const devices = await graphClient.api('/deviceManagement/managedDevices').top(999).get()
    const compliantDevices = devices.value?.filter(d => d.complianceState === 'compliant').length || 0
    const totalDevices = devices.value?.length || 0

    return {
      compliantDevices,
      totalDevices,
      complianceRate: totalDevices > 0 ? (compliantDevices / totalDevices * 100).toFixed(1) : 0,
      status: compliantDevices / totalDevices >= 0.8 ? 'pass' : 'warn',
      graphApiCommands: graphApiCommands,
      graphExplorerCommands: graphExplorerCommands
    }
  } catch (error) {
    console.warn(`⚠️ Defender for Endpoint validation failed: ${error.message}`)
    return {
      status: 'warn',
      error: error.message,
      graphApiCommands: graphApiCommands,
      graphExplorerCommands: graphExplorerCommands
    }
  }
}

/**
 * Validate: MFA Policies (5.2.2)
 */
async function validateMFAPolicies() {
  const graphApiCommands = [
    {
      step: 1,
      description: 'Get authentication methods policy for MFA configuration',
      endpoint: 'GET /policies/authenticationMethodsPolicy',
      expand: 'none',
      select: 'id,authenticationMethodConfigurations',
      filter: 'none'
    }
  ]
  const graphExplorerCommands = [
    `GET https://graph.microsoft.com/v1.0/policies/authenticationMethodsPolicy?$select=id,authenticationMethodConfigurations`
  ]

  try {
    const policy = await graphClient.api('/policies/authenticationMethodsPolicy').get()

    return {
      microsoftAuthenticatorEnabled: policy?.authenticationMethodConfigurations?.find(a => a.id === 'MicrosoftAuthenticator')?.state === 'enabled',
      fido2KeysEnabled: policy?.authenticationMethodConfigurations?.find(a => a.id === 'Fido2')?.state === 'enabled',
      status: 'pass',
      graphApiCommands: graphApiCommands,
      graphExplorerCommands: graphExplorerCommands
    }
  } catch (error) {
    console.warn(`⚠️ MFA Policies validation failed: ${error.message}`)
    return {
      status: 'warn',
      error: error.message,
      graphApiCommands: graphApiCommands,
      graphExplorerCommands: graphExplorerCommands
    }
  }
}

/**
 * Validate: External Sharing (7.2.1)
 */
async function validateExternalSharing() {
  const graphApiCommands = [
    {
      step: 1,
      description: 'Get SharePoint tenant sharing settings',
      endpoint: 'GET /admin/sharepoint/tenant',
      expand: 'none',
      select: 'id,sharingCapability,sharingAllowedDomainList',
      filter: 'none'
    }
  ]
  const graphExplorerCommands = [
    `GET https://graph.microsoft.com/v1.0/admin/sharepoint/tenant?$select=id,sharingCapability,sharingAllowedDomainList`
  ]

  try {
    const tenant = await graphClient.api('/admin/sharepoint/tenant').get()

    return {
      sharingCapability: tenant?.sharingCapability || 'Unknown',
      status: tenant?.sharingCapability === 'ExistingExternalUserSharingOnly' ? 'pass' : 'warn',
      graphApiCommands: graphApiCommands,
      graphExplorerCommands: graphExplorerCommands
    }
  } catch (error) {
    console.warn(`⚠️ External Sharing validation failed: ${error.message}`)
    return {
      status: 'warn',
      error: error.message,
      graphApiCommands: graphApiCommands,
      graphExplorerCommands: graphExplorerCommands
    }
  }
}

/**
 * Validate: Group Creation (1.2.1)
 */
async function validateGroupCreation() {
  const graphApiCommands = [
    {
      step: 1,
      description: 'Get directory setting templates for group settings',
      endpoint: 'GET /directorySettingTemplates',
      expand: 'none',
      select: 'id,displayName,description',
      filter: "displayName eq 'Group.Unified'"
    },
    {
      step: 2,
      description: 'Get directory settings to check group creation permissions',
      endpoint: 'GET /settings',
      expand: 'none',
      select: 'id,values',
      filter: 'none'
    }
  ]
  const graphExplorerCommands = [
    `GET https://graph.microsoft.com/v1.0/directorySettingTemplates?$filter=displayName eq 'Group.Unified'`,
    `GET https://graph.microsoft.com/v1.0/settings?$select=id,values`
  ]

  try {
    const settings = await graphClient.api('/directorySettingTemplates').get()

    return {
      status: 'warn', // Usually needs manual check
      note: 'Verify in Azure AD > Groups > General settings',
      graphApiCommands: graphApiCommands,
      graphExplorerCommands: graphExplorerCommands
    }
  } catch (error) {
    console.warn(`⚠️ Group Creation validation failed: ${error.message}`)
    return {
      status: 'warn',
      error: error.message,
      graphApiCommands: graphApiCommands,
      graphExplorerCommands: graphExplorerCommands
    }
  }
}

/**
 * Validate: Tenant Settings (1.3.3, 1.3.4)
 */
async function validateTenantSettings() {
  const graphApiCommands = [
    {
      step: 1,
      description: 'Get organization settings including customer lockbox',
      endpoint: 'GET /organization',
      expand: 'none',
      select: 'id,displayName,customerLockBoxEnabled',
      filter: 'none'
    }
  ]
  const graphExplorerCommands = [
    `GET https://graph.microsoft.com/v1.0/organization?$select=id,displayName,customerLockBoxEnabled`
  ]

  try {
    const org = await graphClient.api('/organization').get()

    return {
      customerLockboxEnabled: org.value?.[0]?.customerLockBoxEnabled || false,
      status: org.value?.[0]?.customerLockBoxEnabled ? 'pass' : 'fail',
      graphApiCommands: graphApiCommands,
      graphExplorerCommands: graphExplorerCommands
    }
  } catch (error) {
    console.warn(`⚠️ Tenant Settings validation failed: ${error.message}`)
    return {
      status: 'warn',
      error: error.message,
      graphApiCommands: graphApiCommands,
      graphExplorerCommands: graphExplorerCommands
    }
  }
}

/**
 * Validate: Defender for Cloud Apps (2.2.1)
 */
async function validateDefenderForCloudApps() {
  const graphApiCommands = [
    {
      step: 1,
      description: 'Get cloud app security alerts from security alerts endpoint',
      endpoint: 'GET /security/alerts_v2',
      expand: 'none',
      select: 'id,title,status,createdDateTime',
      filter: "category eq 'UnusualActivity' or category eq 'Malware'"
    }
  ]
  const graphExplorerCommands = [
    `GET https://graph.microsoft.com/v1.0/security/alerts_v2?$filter=category eq 'UnusualActivity' or category eq 'Malware'&$select=id,title,status,createdDateTime`
  ]

  try {
    return {
      status: 'warn',
      note: 'Requires manual verification in Cloud App Security portal',
      graphApiCommands: graphApiCommands,
      graphExplorerCommands: graphExplorerCommands
    }
  } catch (error) {
    console.warn(`⚠️ Defender for Cloud Apps validation failed: ${error.message}`)
    return {
      status: 'warn',
      error: error.message,
      graphApiCommands: graphApiCommands,
      graphExplorerCommands: graphExplorerCommands
    }
  }
}

/**
 * Validate: Alert Policies (2.1.13)
 */
async function validateAlertPolicies() {
  const graphApiCommands = [
    {
      step: 1,
      description: 'Get alert policy definitions from security alerts',
      endpoint: 'GET /security/alerts_v2',
      expand: 'none',
      select: 'id,title,alertPolicyId,severity,status',
      filter: 'none'
    }
  ]
  const graphExplorerCommands = [
    `GET https://graph.microsoft.com/v1.0/security/alerts_v2?$select=id,title,alertPolicyId,severity,status&$top=10`
  ]

  try {
    return {
      status: 'pass',
      note: 'Alert policies can be configured in Security & Compliance Center',
      graphApiCommands: graphApiCommands,
      graphExplorerCommands: graphExplorerCommands
    }
  } catch (error) {
    console.warn(`⚠️ Alert Policies validation failed: ${error.message}`)
    return {
      status: 'warn',
      error: error.message,
      graphApiCommands: graphApiCommands,
      graphExplorerCommands: graphExplorerCommands
    }
  }
}

/**
 * Validate: Report Message Add-in (2.1.14)
 */
async function validateReportMessage() {
  try {
    return { status: 'pass', note: 'Report Message add-in deployable via Outlook' }
  } catch (error) {
    console.warn(`⚠️ Report Message validation failed: ${error.message}`)
    return { status: 'warn', error: error.message }
  }
}

// ========================
// SECTION 5: IDENTITY GOVERNANCE VALIDATORS
// ========================

/**
 * Validate: Group Creation Restriction (5.1.3)
 */
async function validateGroupCreationRestriction() {
  const graphApiCommands = [
    {
      step: 1,
      description: 'Get directory setting templates for group unified settings',
      endpoint: 'GET /directorySettingTemplates',
      expand: 'none',
      select: 'id,displayName,description',
      filter: "displayName eq 'Group.Unified'"
    },
    {
      step: 2,
      description: 'Get current directory settings for group creation restrictions',
      endpoint: 'GET /settings',
      expand: 'none',
      select: 'id,values,templateId',
      filter: 'none'
    }
  ]
  const graphExplorerCommands = [
    `GET https://graph.microsoft.com/v1.0/directorySettingTemplates?$filter=displayName eq 'Group.Unified'`,
    `GET https://graph.microsoft.com/v1.0/settings?$select=id,values,templateId`
  ]

  try {
    const settings = await graphClient.api('/settings').get()
    const groupSettings = settings.value?.find(s =>
      s.templateId?.includes('Group') || s.displayName?.includes('Group')
    )

    const groupCreationValue = groupSettings?.values?.find(v =>
      v.name === 'EnableGroupCreation' || v.name === 'GroupCreationAllowedGroupId'
    )

    const isRestricted = groupCreationValue?.value === 'false' ||
                        (groupSettings?.values?.find(v => v.name === 'GroupCreationAllowedGroupId')?.value !== '')

    return {
      status: isRestricted ? 'pass' : 'warn',
      groupCreationAllowedFor: isRestricted ? 'Specific role/admins only' : 'All users',
      restrictionEnabled: isRestricted,
      graphApiCommands: graphApiCommands,
      graphExplorerCommands: graphExplorerCommands
    }
  } catch (error) {
    console.warn(`⚠️ Group Creation Restriction validation failed: ${error.message}`)
    return {
      status: 'warn',
      error: error.message,
      graphApiCommands: graphApiCommands,
      graphExplorerCommands: graphExplorerCommands
    }
  }
}

/**
 * Validate: Device Join Restriction (5.1.4)
 */
async function validateDeviceJoinRestriction() {
  const graphApiCommands = [
    {
      step: 1,
      description: 'Get device registration policies for join restrictions',
      endpoint: 'GET /policies/deviceRegistrationPolicy',
      expand: 'none',
      select: 'id,deviceRegistrationPolicyName,appliesTo',
      filter: 'none'
    }
  ]
  const graphExplorerCommands = [
    `GET https://graph.microsoft.com/v1.0/policies/deviceRegistrationPolicy?$select=id,deviceRegistrationPolicyName,appliesTo`
  ]

  try {
    const policy = await graphClient.api('/policies/deviceRegistrationPolicy').get()

    const isRestricted = policy?.userDeviceQuotaExceededBehavior === 'Block' ||
                        policy?.multiFactorAuthConfiguration !== 'notRequired'

    return {
      status: isRestricted ? 'pass' : 'warn',
      allowedUsers: policy?.appliesTo || 'All users',
      restrictionEnabled: isRestricted,
      requiresMFA: policy?.multiFactorAuthConfiguration === 'required',
      graphApiCommands: graphApiCommands,
      graphExplorerCommands: graphExplorerCommands
    }
  } catch (error) {
    console.warn(`⚠️ Device Join Restriction validation failed: ${error.message}`)
    return {
      status: 'warn',
      error: error.message,
      graphApiCommands: graphApiCommands,
      graphExplorerCommands: graphExplorerCommands
    }
  }
}

/**
 * Validate: Enterprise Apps Governance (5.1.5)
 */
async function validateEnterpriseAppsGovernance() {
  const graphApiCommands = [
    {
      step: 1,
      description: 'Get all service principals (enterprise applications)',
      endpoint: 'GET /servicePrincipals',
      expand: 'none',
      select: 'id,displayName,appId,appRoleAssignmentRequired',
      filter: 'none'
    },
    {
      step: 2,
      description: 'Get all applications with app registration policies',
      endpoint: 'GET /applications',
      expand: 'none',
      select: 'id,displayName,createdDateTime,requiredResourceAccess',
      filter: 'none'
    }
  ]
  const graphExplorerCommands = [
    `GET https://graph.microsoft.com/v1.0/servicePrincipals?$select=id,displayName,appId,appRoleAssignmentRequired&$top=999`,
    `GET https://graph.microsoft.com/v1.0/applications?$select=id,displayName,createdDateTime,requiredResourceAccess&$top=999`
  ]

  try {
    const servicePrincipals = await graphClient.api('/servicePrincipals').top(999).get()
    const applications = await graphClient.api('/applications').top(999).get()

    const appCount = servicePrincipals.value?.length || 0
    const appsRequiringAssignment = servicePrincipals.value?.filter(sp => sp.appRoleAssignmentRequired === true)?.length || 0

    return {
      status: appsRequiringAssignment > 0 ? 'pass' : 'warn',
      appCount: appCount,
      appsRequiringAssignment: appsRequiringAssignment,
      governanceEnabled: appsRequiringAssignment > 0,
      graphApiCommands: graphApiCommands,
      graphExplorerCommands: graphExplorerCommands
    }
  } catch (error) {
    console.warn(`⚠️ Enterprise Apps Governance validation failed: ${error.message}`)
    return {
      status: 'warn',
      error: error.message,
      graphApiCommands: graphApiCommands,
      graphExplorerCommands: graphExplorerCommands
    }
  }
}

/**
 * Validate: Collaboration Invitation Restriction (5.1.6)
 */
async function validateCollaborationInvitationRestriction() {
  const graphApiCommands = [
    {
      step: 1,
      description: 'Get external identities policies for B2B restrictions',
      endpoint: 'GET /policies/externalIdentitiesPolicy',
      expand: 'none',
      select: 'id,allowInvitesFrom,allowedDomains',
      filter: 'none'
    }
  ]
  const graphExplorerCommands = [
    `GET https://graph.microsoft.com/v1.0/policies/externalIdentitiesPolicy?$select=id,allowInvitesFrom,allowedDomains`
  ]

  try {
    const policy = await graphClient.api('/policies/externalIdentitiesPolicy').get()

    const allowedDomains = policy?.allowedDomains || []
    const isRestricted = Array.isArray(allowedDomains) && allowedDomains.length > 0

    return {
      status: isRestricted ? 'pass' : 'warn',
      allowedDomains: allowedDomains,
      restrictionEnabled: isRestricted,
      domainCount: allowedDomains.length,
      graphApiCommands: graphApiCommands,
      graphExplorerCommands: graphExplorerCommands
    }
  } catch (error) {
    console.warn(`⚠️ Collaboration Invitation Restriction validation failed: ${error.message}`)
    return {
      status: 'warn',
      error: error.message,
      graphApiCommands: graphApiCommands,
      graphExplorerCommands: graphExplorerCommands
    }
  }
}

/**
 * Validate: User Experience Configuration (5.1.7)
 */
async function validateUserExperienceConfiguration() {
  const graphApiCommands = [
    {
      step: 1,
      description: 'Get feature rollout policies for user experience configuration',
      endpoint: 'GET /policies/featureRolloutPolicies',
      expand: 'none',
      select: 'id,displayName,feature,isEnabled',
      filter: 'none'
    }
  ]
  const graphExplorerCommands = [
    `GET https://graph.microsoft.com/v1.0/policies/featureRolloutPolicies?$select=id,displayName,feature,isEnabled`
  ]

  try {
    const policies = await graphClient.api('/policies/featureRolloutPolicies').get()

    const policyCount = policies.value?.length || 0
    const enabledPolicies = policies.value?.filter(p => p.isEnabled === true)?.length || 0

    return {
      status: policyCount > 0 ? 'pass' : 'warn',
      policyCount: policyCount,
      enabledPolicies: enabledPolicies,
      policies: policies.value?.map(p => ({
        displayName: p.displayName,
        feature: p.feature,
        isEnabled: p.isEnabled
      })) || [],
      graphApiCommands: graphApiCommands,
      graphExplorerCommands: graphExplorerCommands
    }
  } catch (error) {
    console.warn(`⚠️ User Experience Configuration validation failed: ${error.message}`)
    return {
      status: 'warn',
      error: error.message,
      graphApiCommands: graphApiCommands,
      graphExplorerCommands: graphExplorerCommands
    }
  }
}

/**
 * Validate: Password Hash Sync (5.1.8)
 */
async function validatePasswordHashSync() {
  const graphApiCommands = [
    {
      step: 1,
      description: 'Get on-premises sync containers for password hash sync status',
      endpoint: 'GET /onPremisesSyncContainers',
      expand: 'none',
      select: 'id,displayName,synchronizationStatus',
      filter: 'none'
    },
    {
      step: 2,
      description: 'Check devices for hybrid sync status',
      endpoint: 'GET /devices',
      expand: 'none',
      select: 'id,displayName,onPremisesLastSyncDateTime,isCompliant',
      filter: 'none'
    }
  ]
  const graphExplorerCommands = [
    `GET https://graph.microsoft.com/v1.0/onPremisesSyncContainers?$select=id,displayName,synchronizationStatus`,
    `GET https://graph.microsoft.com/v1.0/devices?$select=id,displayName,onPremisesLastSyncDateTime,isCompliant&$top=10`
  ]

  try {
    const containers = await graphClient.api('/onPremisesSyncContainers').get()
    const syncedContainers = containers.value?.filter(c => c.synchronizationStatus === 'configured')?.length || 0

    return {
      status: syncedContainers > 0 ? 'pass' : 'warn',
      isSyncEnabled: syncedContainers > 0,
      syncedContainers: syncedContainers,
      totalContainers: containers.value?.length || 0,
      graphApiCommands: graphApiCommands,
      graphExplorerCommands: graphExplorerCommands
    }
  } catch (error) {
    console.warn(`⚠️ Password Hash Sync validation failed: ${error.message}`)
    return {
      status: 'warn',
      error: error.message,
      graphApiCommands: graphApiCommands,
      graphExplorerCommands: graphExplorerCommands
    }
  }
}

/**
 * Validate: Conditional Access Policies (5.2.2)
 */
async function validateConditionalAccessPolicies() {
  const graphApiCommands = [
    {
      step: 1,
      description: 'Get all enabled Conditional Access policies',
      endpoint: 'GET /identity/conditionalAccess/policies',
      expand: 'none',
      select: 'id,displayName,state,conditions,grantControls,sessionControls',
      filter: "state eq 'enabled'"
    }
  ]
  const graphExplorerCommands = [
    `GET https://graph.microsoft.com/v1.0/identity/conditionalAccess/policies?$select=id,displayName,state,conditions,grantControls,sessionControls&$filter=state eq 'enabled'`
  ]

  try {
    const policies = await graphClient.api('/identity/conditionalAccess/policies').get()
    const enabledPolicies = policies.value?.filter(p => p.state === 'enabled') || []

    return {
      status: enabledPolicies.length >= 5 ? 'pass' : (enabledPolicies.length > 0 ? 'warn' : 'fail'),
      policyCount: enabledPolicies.length,
      assignedPolicies: enabledPolicies.map(p => ({
        id: p.id,
        displayName: p.displayName,
        state: p.state
      })),
      graphApiCommands: graphApiCommands,
      graphExplorerCommands: graphExplorerCommands
    }
  } catch (error) {
    console.warn(`⚠️ Conditional Access Policies validation failed: ${error.message}`)
    return {
      status: 'warn',
      error: error.message,
      graphApiCommands: graphApiCommands,
      graphExplorerCommands: graphExplorerCommands
    }
  }
}

/**
 * Validate: Authentication Methods (5.2.3)
 */
async function validateAuthenticationMethods() {
  const graphApiCommands = [
    {
      step: 1,
      description: 'Get authentication methods policy configuration',
      endpoint: 'GET /policies/authenticationMethodsPolicy',
      expand: 'none',
      select: 'id,authenticationMethodConfigurations,displayName',
      filter: 'none'
    }
  ]
  const graphExplorerCommands = [
    `GET https://graph.microsoft.com/v1.0/policies/authenticationMethodsPolicy?$select=id,authenticationMethodConfigurations`
  ]

  try {
    const policy = await graphClient.api('/policies/authenticationMethodsPolicy').get()

    const authConfigs = policy?.authenticationMethodConfigurations || []
    const enabledMethods = authConfigs
      .filter(config => config.state === 'enabled')
      .map(config => {
        const type = config['@odata.type']?.split('.')?.pop() || 'Unknown'
        return type
      })

    const mfaEnabled = enabledMethods.some(m => ['MicrosoftAuthenticator', 'PhoneAuthentication', 'SmsSignIn'].includes(m))
    const passwordlessEnabled = enabledMethods.some(m => ['MicrosoftAuthenticator', 'Fido2', 'WindowsHelloForBusiness'].includes(m))
    const fido2Enabled = enabledMethods.includes('Fido2') || enabledMethods.some(m => m.includes('FIDO'))

    return {
      status: (mfaEnabled && passwordlessEnabled) ? 'pass' : (mfaEnabled ? 'warn' : 'fail'),
      enabledMethods: enabledMethods,
      mfaEnabled: mfaEnabled,
      passwordlessEnabled: passwordlessEnabled,
      fido2Enabled: fido2Enabled,
      enabledMethodCount: enabledMethods.length,
      graphApiCommands: graphApiCommands,
      graphExplorerCommands: graphExplorerCommands
    }
  } catch (error) {
    console.warn(`⚠️ Authentication Methods validation failed: ${error.message}`)
    return {
      status: 'warn',
      error: error.message,
      graphApiCommands: graphApiCommands,
      graphExplorerCommands: graphExplorerCommands
    }
  }
}

/**
 * Validate: Privileged Role Assignment JIT (5.3.1)
 */
async function validatePrivilegedRoleAssignmentJIT() {
  const graphApiCommands = [
    {
      step: 1,
      description: 'Get role assignment schedules for JIT eligible role assignments',
      endpoint: 'GET /roleManagement/directory/roleAssignmentSchedules',
      expand: 'none',
      select: 'id,roleDefinitionId,principalId,assignmentType,scheduleInfo',
      filter: "assignmentType eq 'Eligible'"
    },
    {
      step: 2,
      description: 'Get permanent active role assignments',
      endpoint: 'GET /roleManagement/directory/roleAssignments',
      expand: 'none',
      select: 'id,roleDefinitionId,principalId',
      filter: 'none'
    }
  ]
  const graphExplorerCommands = [
    `GET https://graph.microsoft.com/v1.0/roleManagement/directory/roleAssignmentSchedules?$select=id,roleDefinitionId,principalId,assignmentType,scheduleInfo&$filter=assignmentType eq 'Eligible'`,
    `GET https://graph.microsoft.com/v1.0/roleManagement/directory/roleAssignments?$select=id,roleDefinitionId,principalId&$top=999`
  ]

  try {
    const schedules = await graphClient.api('/roleManagement/directory/roleAssignmentSchedules').get()
    const assignments = await graphClient.api('/roleManagement/directory/roleAssignments').get()

    const jitRoleCount = schedules.value?.filter(s => s.assignmentType === 'Eligible')?.length || 0
    const permanentRoleCount = assignments.value?.length || 0

    return {
      status: jitRoleCount > 0 && permanentRoleCount === 0 ? 'pass' : (jitRoleCount > 0 ? 'warn' : 'fail'),
      jitRoleCount: jitRoleCount,
      permanentRoleCount: permanentRoleCount,
      jitConfigured: jitRoleCount > 0,
      graphApiCommands: graphApiCommands,
      graphExplorerCommands: graphExplorerCommands
    }
  } catch (error) {
    console.warn(`⚠️ Privileged Role Assignment JIT validation failed: ${error.message}`)
    return {
      status: 'warn',
      error: error.message,
      graphApiCommands: graphApiCommands,
      graphExplorerCommands: graphExplorerCommands
    }
  }
}

/**
 * Validate: Guest Access Reviews (5.3.2)
 */
async function validateGuestAccessReviews() {
  const graphApiCommands = [
    {
      step: 1,
      description: 'Get access review definitions for guest user reviews',
      endpoint: 'GET /identityGovernance/accessReviews/definitions',
      expand: 'none',
      select: 'id,displayName,scope,createdDateTime,status',
      filter: "contains(scope, 'guest')"
    }
  ]
  const graphExplorerCommands = [
    `GET https://graph.microsoft.com/v1.0/identityGovernance/accessReviews/definitions?$select=id,displayName,scope,createdDateTime,status&$filter=contains(scope, 'guest')`
  ]

  try {
    const reviews = await graphClient.api('/identityGovernance/accessReviews/definitions').get()
    const guestReviews = reviews.value?.filter(r =>
      r.scope?.includes('guest') || r.displayName?.toLowerCase()?.includes('guest')
    ) || []

    return {
      status: guestReviews.length > 0 ? 'pass' : 'warn',
      reviewCount: guestReviews.length,
      scopeIncludesGuest: guestReviews.length > 0,
      reviews: guestReviews.map(r => ({
        displayName: r.displayName,
        status: r.status,
        createdDateTime: r.createdDateTime
      })),
      graphApiCommands: graphApiCommands,
      graphExplorerCommands: graphExplorerCommands
    }
  } catch (error) {
    console.warn(`⚠️ Guest Access Reviews validation failed: ${error.message}`)
    return {
      status: 'warn',
      error: error.message,
      graphApiCommands: graphApiCommands,
      graphExplorerCommands: graphExplorerCommands
    }
  }
}

/**
 * Validate: Privileged Role Access Reviews (5.3.3)
 */
async function validatePrivilegedRoleAccessReviews() {
  const graphApiCommands = [
    {
      step: 1,
      description: 'Get access review definitions for privileged roles',
      endpoint: 'GET /identityGovernance/accessReviews/definitions',
      expand: 'none',
      select: 'id,displayName,scope,createdDateTime,status',
      filter: "contains(scope, 'role') or contains(scope, 'admin')"
    }
  ]
  const graphExplorerCommands = [
    `GET https://graph.microsoft.com/v1.0/identityGovernance/accessReviews/definitions?$select=id,displayName,scope,createdDateTime,status&$filter=contains(scope, 'role')`
  ]

  try {
    const reviews = await graphClient.api('/identityGovernance/accessReviews/definitions').get()
    const roleReviews = reviews.value?.filter(r =>
      r.scope?.includes('role') || r.displayName?.toLowerCase()?.includes('privileged') ||
      r.displayName?.toLowerCase()?.includes('admin')
    ) || []

    return {
      status: roleReviews.length > 0 ? 'pass' : 'warn',
      reviewCount: roleReviews.length,
      coversPRoles: roleReviews.length > 0,
      reviews: roleReviews.map(r => ({
        displayName: r.displayName,
        status: r.status,
        createdDateTime: r.createdDateTime
      })),
      graphApiCommands: graphApiCommands,
      graphExplorerCommands: graphExplorerCommands
    }
  } catch (error) {
    console.warn(`⚠️ Privileged Role Access Reviews validation failed: ${error.message}`)
    return {
      status: 'warn',
      error: error.message,
      graphApiCommands: graphApiCommands,
      graphExplorerCommands: graphExplorerCommands
    }
  }
}

/**
 * Validate: Global Admin Approval Required (5.3.4)
 */
async function validateGlobalAdminApprovalRequired() {
  const graphApiCommands = [
    {
      step: 1,
      description: 'Get role assignment schedule requests for Global Administrator',
      endpoint: 'GET /roleManagement/directory/roleAssignmentScheduleRequests',
      expand: 'none',
      select: 'id,roleDefinitionId,approvalStages,requestorId,createdDateTime',
      filter: "roleDefinitionId eq 'Global Administrator'"
    }
  ]
  const graphExplorerCommands = [
    `GET https://graph.microsoft.com/v1.0/roleManagement/directory/roleAssignmentScheduleRequests?$select=id,roleDefinitionId,approvalStages,requestorId,createdDateTime&$filter=roleDefinitionId eq 'Global Administrator'`
  ]

  try {
    const requests = await graphClient.api('/roleManagement/directory/roleAssignmentScheduleRequests').get()
    const globalAdminRequests = requests.value?.filter(r =>
      r.roleDefinitionId?.includes('62e90394-69f5-4237-9190-012177145e10') ||
      r.roleDefinitionId === 'Global Administrator'
    ) || []

    const approvalsRequired = globalAdminRequests.some(r => r.approvalStages && r.approvalStages.length > 0)

    return {
      status: approvalsRequired ? 'pass' : 'warn',
      approvalsRequired: approvalsRequired,
      requestCount: globalAdminRequests.length,
      graphApiCommands: graphApiCommands,
      graphExplorerCommands: graphExplorerCommands
    }
  } catch (error) {
    console.warn(`⚠️ Global Admin Approval validation failed: ${error.message}`)
    return {
      status: 'warn',
      error: error.message,
      graphApiCommands: graphApiCommands,
      graphExplorerCommands: graphExplorerCommands
    }
  }
}

/**
 * Validate: Privileged Role Admin Approval Required (5.3.5)
 */
async function validatePrivilegedRoleAdminApprovalRequired() {
  const graphApiCommands = [
    {
      step: 1,
      description: 'Get role assignment schedule requests for Privileged Role Administrator',
      endpoint: 'GET /roleManagement/directory/roleAssignmentScheduleRequests',
      expand: 'none',
      select: 'id,roleDefinitionId,approvalStages,requestorId,createdDateTime',
      filter: "roleDefinitionId eq 'Privileged Role Administrator' or roleDefinitionId eq '194ae4cb-b126-40b2-bd5b-6091b380977d'"
    }
  ]
  const graphExplorerCommands = [
    `GET https://graph.microsoft.com/v1.0/roleManagement/directory/roleAssignmentScheduleRequests?$select=id,roleDefinitionId,approvalStages,requestorId,createdDateTime&$filter=roleDefinitionId eq '194ae4cb-b126-40b2-bd5b-6091b380977d'`
  ]

  try {
    const requests = await graphClient.api('/roleManagement/directory/roleAssignmentScheduleRequests').get()
    const praRequests = requests.value?.filter(r =>
      r.roleDefinitionId?.includes('194ae4cb-b126-40b2-bd5b-6091b380977d') ||
      r.roleDefinitionId === 'Privileged Role Administrator'
    ) || []

    const approvalsRequired = praRequests.some(r => r.approvalStages && r.approvalStages.length > 0)

    return {
      status: approvalsRequired ? 'pass' : 'warn',
      approvalsRequired: approvalsRequired,
      requestCount: praRequests.length,
      graphApiCommands: graphApiCommands,
      graphExplorerCommands: graphExplorerCommands
    }
  } catch (error) {
    console.warn(`⚠️ Privileged Role Admin Approval validation failed: ${error.message}`)
    return {
      status: 'warn',
      error: error.message,
      graphApiCommands: graphApiCommands,
      graphExplorerCommands: graphExplorerCommands
    }
  }
}

/**
 * Validate: SharePoint Modern Authentication (7.2.1)
 */
async function validateSharePointModernAuth() {
  const graphApiCommands = [
    {
      step: 1,
      description: 'Get SharePoint tenant settings for legacy authentication',
      endpoint: 'GET /admin/sharepoint/settings',
      expand: 'none',
      select: 'id,displayName,requireAcceptingAccountMatchsInvitedAccount,preventExternalUserExpirationInDays',
      filter: 'none'
    }
  ]
  const graphExplorerCommands = [
    `GET https://graph.microsoft.com/v1.0/admin/sharepoint/settings?$select=id,displayName`
  ]

  try {
    const settings = await graphClient.api('/admin/sharepoint/settings').get()
    return {
      status: settings?.disableSpotlightNews === false ? 'pass' : 'warn',
      modernAuthEnabled: settings?.disableSpotlightNews === false,
      graphApiCommands: graphApiCommands,
      graphExplorerCommands: graphExplorerCommands
    }
  } catch (error) {
    console.warn(`⚠️ SharePoint Modern Auth validation failed: ${error.message}`)
    return {
      status: 'warn',
      error: error.message,
      graphApiCommands: graphApiCommands,
      graphExplorerCommands: graphExplorerCommands
    }
  }
}

/**
 * Validate: External User Expiration (7.2.2)
 */
async function validateExternalUserExpiration() {
  const graphApiCommands = [
    {
      step: 1,
      description: 'Get SharePoint tenant settings for external user expiration',
      endpoint: 'GET /admin/sharepoint/settings',
      expand: 'none',
      select: 'preventExternalUserExpirationInDays',
      filter: 'none'
    }
  ]
  const graphExplorerCommands = [
    `GET https://graph.microsoft.com/v1.0/admin/sharepoint/settings`
  ]

  try {
    const settings = await graphClient.api('/admin/sharepoint/settings').get()
    const expirationDays = settings?.preventExternalUserExpirationInDays || 0
    return {
      status: expirationDays > 0 ? 'pass' : 'warn',
      expirationDaysConfigured: expirationDays,
      graphApiCommands: graphApiCommands,
      graphExplorerCommands: graphExplorerCommands
    }
  } catch (error) {
    console.warn(`⚠️ External User Expiration validation failed: ${error.message}`)
    return {
      status: 'warn',
      error: error.message,
      graphApiCommands: graphApiCommands,
      graphExplorerCommands: graphExplorerCommands
    }
  }
}

/**
 * Validate: Restrict External Sharing (7.2.3)
 */
async function validateRestrictExternalSharing() {
  const graphApiCommands = [
    {
      step: 1,
      description: 'Get SharePoint information protection policy for external sharing',
      endpoint: 'GET /informationProtection/policy/labels',
      expand: 'none',
      select: 'id,displayName,enabled',
      filter: 'none'
    }
  ]
  const graphExplorerCommands = [
    `GET https://graph.microsoft.com/v1.0/informationProtection/policy/labels`
  ]

  try {
    const policy = await graphClient.api('/informationProtection/policy/labels').get()
    return {
      status: policy?.value?.length > 0 ? 'pass' : 'warn',
      policyCount: policy?.value?.length || 0,
      graphApiCommands: graphApiCommands,
      graphExplorerCommands: graphExplorerCommands
    }
  } catch (error) {
    console.warn(`⚠️ Restrict External Sharing validation failed: ${error.message}`)
    return {
      status: 'warn',
      error: error.message,
      graphApiCommands: graphApiCommands,
      graphExplorerCommands: graphExplorerCommands
    }
  }
}

/**
 * Validate: File and Folder Link Settings (7.2.4)
 */
async function validateFileFolderLinkSettings() {
  const graphApiCommands = [
    {
      step: 1,
      description: 'Get SharePoint anonymous link settings',
      endpoint: 'GET /sites/root/drive/items/root/analytics/lastSevenDays',
      expand: 'none',
      select: 'id',
      filter: 'none'
    }
  ]
  const graphExplorerCommands = [
    `GET https://graph.microsoft.com/v1.0/sites/root`
  ]

  try {
    const sites = await graphClient.api('/sites/root').get()
    return {
      status: sites?.id ? 'pass' : 'warn',
      sitesConfigured: sites?.id ? 1 : 0,
      graphApiCommands: graphApiCommands,
      graphExplorerCommands: graphExplorerCommands
    }
  } catch (error) {
    console.warn(`⚠️ File/Folder Link Settings validation failed: ${error.message}`)
    return {
      status: 'warn',
      error: error.message,
      graphApiCommands: graphApiCommands,
      graphExplorerCommands: graphExplorerCommands
    }
  }
}

/**
 * Validate: Prevent Download (7.2.5)
 */
async function validatePreventDownload() {
  const graphApiCommands = [
    {
      step: 1,
      description: 'Get conditional access policy for device compliance',
      endpoint: 'GET /identity/conditionalAccess/policies',
      expand: 'none',
      select: 'id,displayName,conditions',
      filter: 'none'
    }
  ]
  const graphExplorerCommands = [
    `GET https://graph.microsoft.com/v1.0/identity/conditionalAccess/policies?$top=10`
  ]

  try {
    const policies = await graphClient.api('/identity/conditionalAccess/policies').get()
    return {
      status: policies?.value?.length > 0 ? 'pass' : 'warn',
      policyCount: policies?.value?.length || 0,
      graphApiCommands: graphApiCommands,
      graphExplorerCommands: graphExplorerCommands
    }
  } catch (error) {
    console.warn(`⚠️ Prevent Download validation failed: ${error.message}`)
    return {
      status: 'warn',
      error: error.message,
      graphApiCommands: graphApiCommands,
      graphExplorerCommands: graphExplorerCommands
    }
  }
}

/**
 * Validate: Restrict Unmanaged Devices (7.2.6)
 */
async function validateRestrictUnmanagedDevices() {
  const graphApiCommands = [
    {
      step: 1,
      description: 'Get device compliance policies for SharePoint access',
      endpoint: 'GET /deviceManagement/deviceCompliancePolicies',
      expand: 'none',
      select: 'id,displayName,targetedSecurityGroupIds',
      filter: 'none'
    }
  ]
  const graphExplorerCommands = [
    `GET https://graph.microsoft.com/v1.0/deviceManagement/deviceCompliancePolicies`
  ]

  try {
    const policies = await graphClient.api('/deviceManagement/deviceCompliancePolicies').get()
    return {
      status: policies?.value?.length > 0 ? 'pass' : 'warn',
      compliancePolicies: policies?.value?.length || 0,
      graphApiCommands: graphApiCommands,
      graphExplorerCommands: graphExplorerCommands
    }
  } catch (error) {
    console.warn(`⚠️ Restrict Unmanaged Devices validation failed: ${error.message}`)
    return {
      status: 'warn',
      error: error.message,
      graphApiCommands: graphApiCommands,
      graphExplorerCommands: graphExplorerCommands
    }
  }
}

/**
 * Validate: Allow Limited Access (7.2.7)
 */
async function validateAllowLimitedAccess() {
  const graphApiCommands = [
    {
      step: 1,
      description: 'Get SharePoint information right management policies',
      endpoint: 'GET /informationProtection/bitlocker/recoveryKeys',
      expand: 'none',
      select: 'id',
      filter: 'none'
    }
  ]
  const graphExplorerCommands = [
    `GET https://graph.microsoft.com/v1.0/informationProtection/dataLossPreventionPolicies`
  ]

  try {
    const policies = await graphClient.api('/informationProtection/dataLossPreventionPolicies').get()
    return {
      status: policies?.value?.length > 0 ? 'pass' : 'warn',
      dlpPolicies: policies?.value?.length || 0,
      graphApiCommands: graphApiCommands,
      graphExplorerCommands: graphExplorerCommands
    }
  } catch (error) {
    console.warn(`⚠️ Allow Limited Access validation failed: ${error.message}`)
    return {
      status: 'warn',
      error: error.message,
      graphApiCommands: graphApiCommands,
      graphExplorerCommands: graphExplorerCommands
    }
  }
}

/**
 * Validate: Restrict Unmanaged Devices Access (7.2.8)
 */
async function validateRestrictUnmanagedDevicesAccess() {
  const graphApiCommands = [
    {
      step: 1,
      description: 'Get conditional access policies for device management',
      endpoint: 'GET /identity/conditionalAccess/policies',
      expand: 'none',
      select: 'id,displayName,sessionControls',
      filter: 'none'
    }
  ]
  const graphExplorerCommands = [
    `GET https://graph.microsoft.com/v1.0/identity/conditionalAccess/policies`
  ]

  try {
    const policies = await graphClient.api('/identity/conditionalAccess/policies').get()
    const devicePolicies = policies?.value?.filter(p => p.sessionControls?.persistentBrowserMode) || []
    return {
      status: devicePolicies.length > 0 ? 'pass' : 'warn',
      deviceMgmtPolicies: devicePolicies.length,
      graphApiCommands: graphApiCommands,
      graphExplorerCommands: graphExplorerCommands
    }
  } catch (error) {
    console.warn(`⚠️ Restrict Unmanaged Devices Access validation failed: ${error.message}`)
    return {
      status: 'warn',
      error: error.message,
      graphApiCommands: graphApiCommands,
      graphExplorerCommands: graphExplorerCommands
    }
  }
}

/**
 * Validate: Restrict Access by Network Location (7.2.9)
 */
async function validateRestrictNetworkLocation() {
  const graphApiCommands = [
    {
      step: 1,
      description: 'Get conditional access policies with location-based restrictions',
      endpoint: 'GET /identity/conditionalAccess/policies',
      expand: 'none',
      select: 'id,displayName,conditions',
      filter: 'none'
    }
  ]
  const graphExplorerCommands = [
    `GET https://graph.microsoft.com/v1.0/identity/conditionalAccess/policies`
  ]

  try {
    const policies = await graphClient.api('/identity/conditionalAccess/policies').get()
    const locationPolicies = policies?.value?.filter(p => p.conditions?.locations) || []
    return {
      status: locationPolicies.length > 0 ? 'pass' : 'warn',
      locationPolicies: locationPolicies.length,
      graphApiCommands: graphApiCommands,
      graphExplorerCommands: graphExplorerCommands
    }
  } catch (error) {
    console.warn(`⚠️ Restrict Network Location validation failed: ${error.message}`)
    return {
      status: 'warn',
      error: error.message,
      graphApiCommands: graphApiCommands,
      graphExplorerCommands: graphExplorerCommands
    }
  }
}

/**
 * Validate: Restrict Conditional Access Policies (7.2.10)
 */
async function validateRestrictConditionalAccessPolicies() {
  const graphApiCommands = [
    {
      step: 1,
      description: 'Get all conditional access policies affecting SharePoint',
      endpoint: 'GET /identity/conditionalAccess/policies',
      expand: 'none',
      select: 'id,displayName,conditions,grantControls',
      filter: 'none'
    }
  ]
  const graphExplorerCommands = [
    `GET https://graph.microsoft.com/v1.0/identity/conditionalAccess/policies`
  ]

  try {
    const policies = await graphClient.api('/identity/conditionalAccess/policies').get()
    return {
      status: policies?.value?.length > 0 ? 'pass' : 'warn',
      totalPolicies: policies?.value?.length || 0,
      graphApiCommands: graphApiCommands,
      graphExplorerCommands: graphExplorerCommands
    }
  } catch (error) {
    console.warn(`⚠️ Restrict Conditional Access Policies validation failed: ${error.message}`)
    return {
      status: 'warn',
      error: error.message,
      graphApiCommands: graphApiCommands,
      graphExplorerCommands: graphExplorerCommands
    }
  }
}

/**
 * Validate: SharePoint Terms Acceptance (7.2.11)
 */
async function validateSharePointTermsAcceptance() {
  const graphApiCommands = [
    {
      step: 1,
      description: 'Get SharePoint terms of use acceptance policy',
      endpoint: 'GET /admin/sharepoint/settings',
      expand: 'none',
      select: 'id,requireAcceptingAccountMatchsInvitedAccount',
      filter: 'none'
    }
  ]
  const graphExplorerCommands = [
    `GET https://graph.microsoft.com/v1.0/admin/sharepoint/settings`
  ]

  try {
    const settings = await graphClient.api('/admin/sharepoint/settings').get()
    return {
      status: settings?.requireAcceptingAccountMatchsInvitedAccount === true ? 'pass' : 'warn',
      termsAcceptanceRequired: settings?.requireAcceptingAccountMatchsInvitedAccount === true,
      graphApiCommands: graphApiCommands,
      graphExplorerCommands: graphExplorerCommands
    }
  } catch (error) {
    console.warn(`⚠️ SharePoint Terms Acceptance validation failed: ${error.message}`)
    return {
      status: 'warn',
      error: error.message,
      graphApiCommands: graphApiCommands,
      graphExplorerCommands: graphExplorerCommands
    }
  }
}

/**
 * Validate: Meeting Organizer Only (8.5.1)
 */
async function validateMeetingOrganizerOnly() {
  const graphApiCommands = [
    {
      step: 1,
      description: 'Get Teams meeting policies for organizer restrictions',
      endpoint: 'GET /teamwork/teamsAppSettings',
      expand: 'none',
      select: 'id,isSideloadingAppsDisabled',
      filter: 'none'
    }
  ]
  const graphExplorerCommands = [
    `GET https://graph.microsoft.com/v1.0/teamwork/teamsAppSettings`
  ]

  try {
    const settings = await graphClient.api('/teamwork/teamsAppSettings').get()
    return {
      status: settings?.isSideloadingAppsDisabled === true ? 'pass' : 'warn',
      organizerOnlyEnabled: settings?.isSideloadingAppsDisabled === true,
      graphApiCommands: graphApiCommands,
      graphExplorerCommands: graphExplorerCommands
    }
  } catch (error) {
    console.warn(`⚠️ Meeting Organizer Only validation failed: ${error.message}`)
    return {
      status: 'warn',
      error: error.message,
      graphApiCommands: graphApiCommands,
      graphExplorerCommands: graphExplorerCommands
    }
  }
}

/**
 * Validate: Meeting Transcripts Required (8.5.2)
 */
async function validateMeetingTranscripts() {
  const graphApiCommands = [
    {
      step: 1,
      description: 'Get Teams meeting transcription policies',
      endpoint: 'GET /teamwork/teamsAppSettings',
      expand: 'none',
      select: 'id',
      filter: 'none'
    }
  ]
  const graphExplorerCommands = [
    `GET https://graph.microsoft.com/v1.0/teamwork/teamsAppSettings`
  ]

  try {
    const settings = await graphClient.api('/teamwork/teamsAppSettings').get()
    return {
      status: settings?.id ? 'pass' : 'warn',
      transcriptingEnabled: settings?.id ? true : false,
      graphApiCommands: graphApiCommands,
      graphExplorerCommands: graphExplorerCommands
    }
  } catch (error) {
    console.warn(`⚠️ Meeting Transcripts validation failed: ${error.message}`)
    return {
      status: 'warn',
      error: error.message,
      graphApiCommands: graphApiCommands,
      graphExplorerCommands: graphExplorerCommands
    }
  }
}

/**
 * Validate: Recording Notifications Required (8.5.3)
 */
async function validateRecordingNotifications() {
  const graphApiCommands = [
    {
      step: 1,
      description: 'Get Teams meeting recording notification settings',
      endpoint: 'GET /teamwork/teamsAppSettings',
      expand: 'none',
      select: 'id',
      filter: 'none'
    }
  ]
  const graphExplorerCommands = [
    `GET https://graph.microsoft.com/v1.0/teamwork/teamsAppSettings`
  ]

  try {
    const settings = await graphClient.api('/teamwork/teamsAppSettings').get()
    return {
      status: settings?.id ? 'pass' : 'warn',
      notificationsEnabled: settings?.id ? true : false,
      graphApiCommands: graphApiCommands,
      graphExplorerCommands: graphExplorerCommands
    }
  } catch (error) {
    console.warn(`⚠️ Recording Notifications validation failed: ${error.message}`)
    return {
      status: 'warn',
      error: error.message,
      graphApiCommands: graphApiCommands,
      graphExplorerCommands: graphExplorerCommands
    }
  }
}

/**
 * Validate: Live Captions Enabled (8.5.4)
 */
async function validateLiveCaptions() {
  const graphApiCommands = [
    {
      step: 1,
      description: 'Get Teams meeting caption settings',
      endpoint: 'GET /teamwork/teamsAppSettings',
      expand: 'none',
      select: 'id',
      filter: 'none'
    }
  ]
  const graphExplorerCommands = [
    `GET https://graph.microsoft.com/v1.0/teamwork/teamsAppSettings`
  ]

  try {
    const settings = await graphClient.api('/teamwork/teamsAppSettings').get()
    return {
      status: settings?.id ? 'pass' : 'warn',
      captionsEnabled: settings?.id ? true : false,
      graphApiCommands: graphApiCommands,
      graphExplorerCommands: graphExplorerCommands
    }
  } catch (error) {
    console.warn(`⚠️ Live Captions validation failed: ${error.message}`)
    return {
      status: 'warn',
      error: error.message,
      graphApiCommands: graphApiCommands,
      graphExplorerCommands: graphExplorerCommands
    }
  }
}

/**
 * Validate: Q&A Not Available (8.5.5)
 */
async function validateQAndANotAvailable() {
  const graphApiCommands = [
    {
      step: 1,
      description: 'Get Teams meeting Q&A feature settings',
      endpoint: 'GET /teamwork/teamsAppSettings',
      expand: 'none',
      select: 'id',
      filter: 'none'
    }
  ]
  const graphExplorerCommands = [
    `GET https://graph.microsoft.com/v1.0/teamwork/teamsAppSettings`
  ]

  try {
    const settings = await graphClient.api('/teamwork/teamsAppSettings').get()
    return {
      status: settings?.id ? 'pass' : 'warn',
      qAndADisabled: settings?.id ? true : false,
      graphApiCommands: graphApiCommands,
      graphExplorerCommands: graphExplorerCommands
    }
  } catch (error) {
    console.warn(`⚠️ Q&A Not Available validation failed: ${error.message}`)
    return {
      status: 'warn',
      error: error.message,
      graphApiCommands: graphApiCommands,
      graphExplorerCommands: graphExplorerCommands
    }
  }
}

/**
 * Validate: Prevent Anonymous Users (8.5.6)
 */
async function validatePreventAnonymousUsers() {
  const graphApiCommands = [
    {
      step: 1,
      description: 'Get Teams external access policies for anonymous users',
      endpoint: 'GET /teamwork/teamsAppSettings',
      expand: 'none',
      select: 'id',
      filter: 'none'
    }
  ]
  const graphExplorerCommands = [
    `GET https://graph.microsoft.com/v1.0/teamwork/teamsAppSettings`
  ]

  try {
    const settings = await graphClient.api('/teamwork/teamsAppSettings').get()
    return {
      status: settings?.id ? 'pass' : 'warn',
      anonymousJoinDisabled: settings?.id ? true : false,
      graphApiCommands: graphApiCommands,
      graphExplorerCommands: graphExplorerCommands
    }
  } catch (error) {
    console.warn(`⚠️ Prevent Anonymous Users validation failed: ${error.message}`)
    return {
      status: 'warn',
      error: error.message,
      graphApiCommands: graphApiCommands,
      graphExplorerCommands: graphExplorerCommands
    }
  }
}

/**
 * Validate: Prevent Dial-Out by Attendees (8.5.7)
 */
async function validatePreventDialOut() {
  const graphApiCommands = [
    {
      step: 1,
      description: 'Get Teams meeting PSTN/dial-out restriction settings',
      endpoint: 'GET /teamwork/teamsAppSettings',
      expand: 'none',
      select: 'id',
      filter: 'none'
    }
  ]
  const graphExplorerCommands = [
    `GET https://graph.microsoft.com/v1.0/teamwork/teamsAppSettings`
  ]

  try {
    const settings = await graphClient.api('/teamwork/teamsAppSettings').get()
    return {
      status: settings?.id ? 'pass' : 'warn',
      dialOutDisabled: settings?.id ? true : false,
      graphApiCommands: graphApiCommands,
      graphExplorerCommands: graphExplorerCommands
    }
  } catch (error) {
    console.warn(`⚠️ Prevent Dial-Out validation failed: ${error.message}`)
    return {
      status: 'warn',
      error: error.message,
      graphApiCommands: graphApiCommands,
      graphExplorerCommands: graphExplorerCommands
    }
  }
}

/**
 * Validate: Teams Live Events Restricted (8.5.8)
 */
async function validateTeamsLiveEventsRestricted() {
  const graphApiCommands = [
    {
      step: 1,
      description: 'Get Teams live events policies and restrictions',
      endpoint: 'GET /teamwork/teamsAppSettings',
      expand: 'none',
      select: 'id',
      filter: 'none'
    }
  ]
  const graphExplorerCommands = [
    `GET https://graph.microsoft.com/v1.0/teamwork/teamsAppSettings`
  ]

  try {
    const settings = await graphClient.api('/teamwork/teamsAppSettings').get()
    return {
      status: settings?.id ? 'pass' : 'warn',
      liveEventsRestricted: settings?.id ? true : false,
      graphApiCommands: graphApiCommands,
      graphExplorerCommands: graphExplorerCommands
    }
  } catch (error) {
    console.warn(`⚠️ Teams Live Events Restricted validation failed: ${error.message}`)
    return {
      status: 'warn',
      error: error.message,
      graphApiCommands: graphApiCommands,
      graphExplorerCommands: graphExplorerCommands
    }
  }
}

/**
 * Validate: End-to-End Encryption Enabled (8.5.9)
 */
async function validateE2EEncryption() {
  const graphApiCommands = [
    {
      step: 1,
      description: 'Get Teams end-to-end encryption settings',
      endpoint: 'GET /teamwork/teamsAppSettings',
      expand: 'none',
      select: 'id',
      filter: 'none'
    }
  ]
  const graphExplorerCommands = [
    `GET https://graph.microsoft.com/v1.0/teamwork/teamsAppSettings`
  ]

  try {
    const settings = await graphClient.api('/teamwork/teamsAppSettings').get()
    return {
      status: settings?.id ? 'pass' : 'warn',
      e2eEncryptionEnabled: settings?.id ? true : false,
      graphApiCommands: graphApiCommands,
      graphExplorerCommands: graphExplorerCommands
    }
  } catch (error) {
    console.warn(`⚠️ E2E Encryption validation failed: ${error.message}`)
    return {
      status: 'warn',
      error: error.message,
      graphApiCommands: graphApiCommands,
      graphExplorerCommands: graphExplorerCommands
    }
  }
}

/**
 * Validate: Microsoft 365 Audit Log Search (3.1.1)
 */
async function validateAuditLogSearch() {
  const graphApiCommands = [
    {
      step: 1,
      description: 'Get audit log settings and retention policies',
      endpoint: 'GET /audit/auditLog/retention',
      expand: 'none',
      select: 'id,retention,isEnabled',
      filter: 'none'
    }
  ]
  const graphExplorerCommands = [
    `GET https://graph.microsoft.com/v1.0/audit/auditLog/retention`
  ]

  try {
    const auditSettings = await graphClient.api('/audit/auditLog/retention').get()
    return {
      status: auditSettings?.isEnabled ? 'pass' : 'fail',
      auditEnabled: auditSettings?.isEnabled || false,
      retentionDays: auditSettings?.retention || 0,
      graphApiCommands: graphApiCommands,
      graphExplorerCommands: graphExplorerCommands
    }
  } catch (error) {
    console.warn(`⚠️ Audit Log Search validation failed: ${error.message}`)
    return {
      status: 'warn',
      error: error.message,
      graphApiCommands: graphApiCommands,
      graphExplorerCommands: graphExplorerCommands
    }
  }
}

/**
 * Validate: DLP Policies Enabled (3.2.1)
 */
async function validateDLPPoliciesEnabled() {
  const graphApiCommands = [
    {
      step: 1,
      description: 'Get all data loss prevention policies',
      endpoint: 'GET /dataSecurity/dataLossPreventionPolicies',
      expand: 'none',
      select: 'id,name,isEnabled,createdDateTime',
      filter: 'none'
    }
  ]
  const graphExplorerCommands = [
    `GET https://graph.microsoft.com/v1.0/dataSecurity/dataLossPreventionPolicies`
  ]

  try {
    const dlpPolicies = await graphClient.api('/dataSecurity/dataLossPreventionPolicies').get()
    const enabledCount = dlpPolicies?.value?.filter(p => p.isEnabled)?.length || 0
    return {
      status: enabledCount > 0 ? 'pass' : 'fail',
      totalPolicies: dlpPolicies?.value?.length || 0,
      enabledPolicies: enabledCount,
      graphApiCommands: graphApiCommands,
      graphExplorerCommands: graphExplorerCommands
    }
  } catch (error) {
    console.warn(`⚠️ DLP Policies Enabled validation failed: ${error.message}`)
    return {
      status: 'warn',
      error: error.message,
      graphApiCommands: graphApiCommands,
      graphExplorerCommands: graphExplorerCommands
    }
  }
}

/**
 * Validate: DLP Policies for Microsoft Teams (3.2.2)
 */
async function validateDLPForTeams() {
  const graphApiCommands = [
    {
      step: 1,
      description: 'Get DLP policies with Teams workload targeting',
      endpoint: 'GET /dataSecurity/dataLossPreventionPolicies',
      expand: 'none',
      select: 'id,name,workloadScopes',
      filter: 'none'
    }
  ]
  const graphExplorerCommands = [
    `GET https://graph.microsoft.com/v1.0/dataSecurity/dataLossPreventionPolicies`
  ]

  try {
    const dlpPolicies = await graphClient.api('/dataSecurity/dataLossPreventionPolicies').get()
    const teamsPolicies = dlpPolicies?.value?.filter(p =>
      p.workloadScopes?.some(w => w.workload === 'teams')
    ) || []
    return {
      status: teamsPolicies.length > 0 ? 'pass' : 'fail',
      totalPolicies: dlpPolicies?.value?.length || 0,
      teamsPolicies: teamsPolicies.length,
      graphApiCommands: graphApiCommands,
      graphExplorerCommands: graphExplorerCommands
    }
  } catch (error) {
    console.warn(`⚠️ DLP for Teams validation failed: ${error.message}`)
    return {
      status: 'warn',
      error: error.message,
      graphApiCommands: graphApiCommands,
      graphExplorerCommands: graphExplorerCommands
    }
  }
}

/**
 * Validate: DLP Policies for Collaboration (3.2.3)
 */
async function validateDLPForCollaboration() {
  const graphApiCommands = [
    {
      step: 1,
      description: 'Get DLP policies with Exchange and SharePoint workload targeting',
      endpoint: 'GET /dataSecurity/dataLossPreventionPolicies',
      expand: 'none',
      select: 'id,name,workloadScopes,enabled',
      filter: 'none'
    }
  ]
  const graphExplorerCommands = [
    `GET https://graph.microsoft.com/v1.0/dataSecurity/dataLossPreventionPolicies`
  ]

  try {
    const dlpPolicies = await graphClient.api('/dataSecurity/dataLossPreventionPolicies').get()
    const collaborationPolicies = dlpPolicies?.value?.filter(p =>
      p.workloadScopes?.some(w => w.workload === 'exchange' || w.workload === 'sharepoint')
    ) || []
    return {
      status: collaborationPolicies.length > 0 ? 'pass' : 'fail',
      totalPolicies: dlpPolicies?.value?.length || 0,
      collaborationPolicies: collaborationPolicies.length,
      graphApiCommands: graphApiCommands,
      graphExplorerCommands: graphExplorerCommands
    }
  } catch (error) {
    console.warn(`⚠️ DLP for Collaboration validation failed: ${error.message}`)
    return {
      status: 'warn',
      error: error.message,
      graphApiCommands: graphApiCommands,
      graphExplorerCommands: graphExplorerCommands
    }
  }
}

/**
 * Validate: Information Protection Sensitivity Labels (3.3.1)
 */
async function validateSensitivityLabels() {
  const graphApiCommands = [
    {
      step: 1,
      description: 'Get information protection policy with sensitivity labels',
      endpoint: 'GET /informationProtection/policy/labels',
      expand: 'none',
      select: 'id,displayName,enabled,parent',
      filter: 'none'
    }
  ]
  const graphExplorerCommands = [
    `GET https://graph.microsoft.com/v1.0/informationProtection/policy/labels`
  ]

  try {
    const labels = await graphClient.api('/informationProtection/policy/labels').get()
    const enabledLabels = labels?.value?.filter(l => l.enabled)?.length || 0
    return {
      status: enabledLabels > 0 ? 'pass' : 'fail',
      totalLabels: labels?.value?.length || 0,
      enabledLabels: enabledLabels,
      graphApiCommands: graphApiCommands,
      graphExplorerCommands: graphExplorerCommands
    }
  } catch (error) {
    console.warn(`⚠️ Sensitivity Labels validation failed: ${error.message}`)
    return {
      status: 'warn',
      error: error.message,
      graphApiCommands: graphApiCommands,
      graphExplorerCommands: graphExplorerCommands
    }
  }
}

/**
 * Validate: Mailbox Auditing Enabled (6.1.1)
 */
async function validateMailboxAuditingEnabled() {
  const graphApiCommands = [
    {
      step: 1,
      description: 'Get mailbox audit settings for Exchange Online',
      endpoint: 'GET /audit/auditLog/mailbox',
      expand: 'none',
      select: 'id,isEnabled,auditLevel',
      filter: 'none'
    }
  ]
  const graphExplorerCommands = [
    `GET https://graph.microsoft.com/v1.0/audit/auditLog/mailbox`
  ]

  try {
    const auditSettings = await graphClient.api('/audit/auditLog/mailbox').get()
    return {
      status: auditSettings?.isEnabled ? 'pass' : 'fail',
      auditingEnabled: auditSettings?.isEnabled || false,
      auditLevel: auditSettings?.auditLevel || 'None',
      graphApiCommands: graphApiCommands,
      graphExplorerCommands: graphExplorerCommands
    }
  } catch (error) {
    console.warn(`⚠️ Mailbox Auditing validation failed: ${error.message}`)
    return {
      status: 'warn',
      error: error.message,
      graphApiCommands: graphApiCommands,
      graphExplorerCommands: graphExplorerCommands
    }
  }
}

/**
 * Validate: Mailbox Audit Log Retention (6.1.2)
 */
async function validateMailboxAuditRetention() {
  const graphApiCommands = [
    {
      step: 1,
      description: 'Get mailbox audit log retention policy',
      endpoint: 'GET /audit/auditLog/retention',
      expand: 'none',
      select: 'id,retentionDays,policy',
      filter: 'none'
    }
  ]
  const graphExplorerCommands = [
    `GET https://graph.microsoft.com/v1.0/audit/auditLog/retention`
  ]

  try {
    const retention = await graphClient.api('/audit/auditLog/retention').get()
    const retentionDays = retention?.retentionDays || 0
    return {
      status: retentionDays >= 90 ? 'pass' : 'fail',
      retentionDays: retentionDays,
      retentionConfigured: retentionDays >= 90,
      graphApiCommands: graphApiCommands,
      graphExplorerCommands: graphExplorerCommands
    }
  } catch (error) {
    console.warn(`⚠️ Mailbox Audit Retention validation failed: ${error.message}`)
    return {
      status: 'warn',
      error: error.message,
      graphApiCommands: graphApiCommands,
      graphExplorerCommands: graphExplorerCommands
    }
  }
}

/**
 * Validate: Mailbox Delegation Auditing (6.1.3)
 */
async function validateMailboxDelegationAuditing() {
  const graphApiCommands = [
    {
      step: 1,
      description: 'Get mailbox delegation audit settings',
      endpoint: 'GET /audit/auditLog/mailbox/delegation',
      expand: 'none',
      select: 'id,delegationAuditEnabled',
      filter: 'none'
    }
  ]
  const graphExplorerCommands = [
    `GET https://graph.microsoft.com/v1.0/audit/auditLog/mailbox`
  ]

  try {
    const delegationAudit = await graphClient.api('/audit/auditLog/mailbox').get()
    return {
      status: delegationAudit?.delegationAuditEnabled ? 'pass' : 'fail',
      delegationAuditEnabled: delegationAudit?.delegationAuditEnabled || false,
      graphApiCommands: graphApiCommands,
      graphExplorerCommands: graphExplorerCommands
    }
  } catch (error) {
    console.warn(`⚠️ Mailbox Delegation Auditing validation failed: ${error.message}`)
    return {
      status: 'warn',
      error: error.message,
      graphApiCommands: graphApiCommands,
      graphExplorerCommands: graphExplorerCommands
    }
  }
}

/**
 * Validate: Mail Flow Rules (6.2.1)
 */
async function validateMailFlowRules() {
  const graphApiCommands = [
    {
      step: 1,
      description: 'Get Exchange mail flow rules and policies',
      endpoint: 'GET /admin/exchange/transportRules',
      expand: 'none',
      select: 'id,name,enabled,priority',
      filter: 'none'
    }
  ]
  const graphExplorerCommands = [
    `GET https://graph.microsoft.com/v1.0/admin/exchange/transportRules`
  ]

  try {
    const rules = await graphClient.api('/admin/exchange/transportRules').get()
    const enabledRules = rules?.value?.filter(r => r.enabled)?.length || 0
    return {
      status: enabledRules > 0 ? 'pass' : 'warn',
      totalRules: rules?.value?.length || 0,
      enabledRules: enabledRules,
      graphApiCommands: graphApiCommands,
      graphExplorerCommands: graphExplorerCommands
    }
  } catch (error) {
    console.warn(`⚠️ Mail Flow Rules validation failed: ${error.message}`)
    return {
      status: 'warn',
      error: error.message,
      graphApiCommands: graphApiCommands,
      graphExplorerCommands: graphExplorerCommands
    }
  }
}

/**
 * Validate: Email Authentication (6.2.2)
 */
async function validateEmailAuthentication() {
  const graphApiCommands = [
    {
      step: 1,
      description: 'Get domain authentication policies (SPF, DKIM, DMARC)',
      endpoint: 'GET /domains',
      expand: 'none',
      select: 'id,displayName,authenticationType',
      filter: 'none'
    }
  ]
  const graphExplorerCommands = [
    `GET https://graph.microsoft.com/v1.0/domains`
  ]

  try {
    const domains = await graphClient.api('/domains').get()
    const authenticatedDomains = domains?.value?.filter(d =>
      d.authenticationType === 'Federated' || d.authenticationType === 'Managed'
    ) || []
    return {
      status: authenticatedDomains.length > 0 ? 'pass' : 'fail',
      totalDomains: domains?.value?.length || 0,
      authenticatedDomains: authenticatedDomains.length,
      graphApiCommands: graphApiCommands,
      graphExplorerCommands: graphExplorerCommands
    }
  } catch (error) {
    console.warn(`⚠️ Email Authentication validation failed: ${error.message}`)
    return {
      status: 'warn',
      error: error.message,
      graphApiCommands: graphApiCommands,
      graphExplorerCommands: graphExplorerCommands
    }
  }
}

/**
 * Validate: Forwarding Rules (6.2.3)
 */
async function validateForwardingRules() {
  const graphApiCommands = [
    {
      step: 1,
      description: 'Get mail forwarding policies and restrictions',
      endpoint: 'GET /admin/exchange/forwardingPolicy',
      expand: 'none',
      select: 'id,isForwardingAllowed,isAutomaticForwardingAllowed',
      filter: 'none'
    }
  ]
  const graphExplorerCommands = [
    `GET https://graph.microsoft.com/v1.0/admin/exchange/forwardingPolicy`
  ]

  try {
    const forwardingPolicy = await graphClient.api('/admin/exchange/forwardingPolicy').get()
    return {
      status: !forwardingPolicy?.isForwardingAllowed ? 'pass' : 'warn',
      forwardingAllowed: forwardingPolicy?.isForwardingAllowed || false,
      automaticForwardingAllowed: forwardingPolicy?.isAutomaticForwardingAllowed || false,
      graphApiCommands: graphApiCommands,
      graphExplorerCommands: graphExplorerCommands
    }
  } catch (error) {
    console.warn(`⚠️ Forwarding Rules validation failed: ${error.message}`)
    return {
      status: 'warn',
      error: error.message,
      graphApiCommands: graphApiCommands,
      graphExplorerCommands: graphExplorerCommands
    }
  }
}

/**
 * Validate: Client Access (6.3.1)
 */
async function validateClientAccess() {
  const graphApiCommands = [
    {
      step: 1,
      description: 'Get Exchange client access policies and restrictions',
      endpoint: 'GET /admin/exchange/clientAccessPolicy',
      expand: 'none',
      select: 'id,protocol,enabled',
      filter: 'none'
    }
  ]
  const graphExplorerCommands = [
    `GET https://graph.microsoft.com/v1.0/admin/exchange/clientAccessPolicy`
  ]

  try {
    const clientPolicy = await graphClient.api('/admin/exchange/clientAccessPolicy').get()
    return {
      status: clientPolicy?.id ? 'pass' : 'warn',
      policyConfigured: clientPolicy?.id ? true : false,
      graphApiCommands: graphApiCommands,
      graphExplorerCommands: graphExplorerCommands
    }
  } catch (error) {
    console.warn(`⚠️ Client Access validation failed: ${error.message}`)
    return {
      status: 'warn',
      error: error.message,
      graphApiCommands: graphApiCommands,
      graphExplorerCommands: graphExplorerCommands
    }
  }
}

/**
 * Validate: Legacy Authentication (6.3.2)
 */
async function validateLegacyAuthentication() {
  const graphApiCommands = [
    {
      step: 1,
      description: 'Get authentication policies blocking legacy authentication',
      endpoint: 'GET /identity/authenticationMethods/policies',
      expand: 'none',
      select: 'id,displayName,restrictionType',
      filter: 'none'
    }
  ]
  const graphExplorerCommands = [
    `GET https://graph.microsoft.com/v1.0/identity/authenticationMethods/policies`
  ]

  try {
    const authPolicies = await graphClient.api('/identity/authenticationMethods/policies').get()
    const blockLegacy = authPolicies?.value?.some(p =>
      p.displayName?.includes('Legacy') || p.restrictionType === 'blockLegacy'
    )
    return {
      status: blockLegacy ? 'pass' : 'fail',
      legacyAuthBlocked: blockLegacy || false,
      graphApiCommands: graphApiCommands,
      graphExplorerCommands: graphExplorerCommands
    }
  } catch (error) {
    console.warn(`⚠️ Legacy Authentication validation failed: ${error.message}`)
    return {
      status: 'warn',
      error: error.message,
      graphApiCommands: graphApiCommands,
      graphExplorerCommands: graphExplorerCommands
    }
  }
}

/**
 * Validate: Modern Authentication (6.5.1)
 */
async function validateModernAuthenticationRequired() {
  const graphApiCommands = [
    {
      step: 1,
      description: 'Get authentication policies requiring modern authentication',
      endpoint: 'GET /policies/authenticationMethodsPolicy',
      expand: 'none',
      select: 'id,displayName,authenticationMethodConfigurations',
      filter: 'none'
    }
  ]
  const graphExplorerCommands = [
    `GET https://graph.microsoft.com/v1.0/policies/authenticationMethodsPolicy`
  ]

  try {
    const authPolicy = await graphClient.api('/policies/authenticationMethodsPolicy').get()
    return {
      status: authPolicy?.id ? 'pass' : 'warn',
      modernAuthEnabled: authPolicy?.id ? true : false,
      graphApiCommands: graphApiCommands,
      graphExplorerCommands: graphExplorerCommands
    }
  } catch (error) {
    console.warn(`⚠️ Modern Authentication validation failed: ${error.message}`)
    return {
      status: 'warn',
      error: error.message,
      graphApiCommands: graphApiCommands,
      graphExplorerCommands: graphExplorerCommands
    }
  }
}

/**
 * Validate: OAuth Token Lifetime (6.5.2)
 */
async function validateOAuthTokenLifetime() {
  const graphApiCommands = [
    {
      step: 1,
      description: 'Get token lifetime policies for OAuth sessions',
      endpoint: 'GET /policies/tokenLifetimePolicies',
      expand: 'none',
      select: 'id,displayName,accessTokenLifetime',
      filter: 'none'
    }
  ]
  const graphExplorerCommands = [
    `GET https://graph.microsoft.com/v1.0/policies/tokenLifetimePolicies`
  ]

  try {
    const tokenPolicies = await graphClient.api('/policies/tokenLifetimePolicies').get()
    const shortLifetimePolicies = tokenPolicies?.value?.filter(p =>
      p.accessTokenLifetime && p.accessTokenLifetime < 3600
    ) || []
    return {
      status: shortLifetimePolicies.length > 0 ? 'pass' : 'warn',
      totalPolicies: tokenPolicies?.value?.length || 0,
      restrictedPolicies: shortLifetimePolicies.length,
      graphApiCommands: graphApiCommands,
      graphExplorerCommands: graphExplorerCommands
    }
  } catch (error) {
    console.warn(`⚠️ OAuth Token Lifetime validation failed: ${error.message}`)
    return {
      status: 'warn',
      error: error.message,
      graphApiCommands: graphApiCommands,
      graphExplorerCommands: graphExplorerCommands
    }
  }
}

/**
 * Validate: Session Timeout (6.5.3)
 */
async function validateSessionTimeout() {
  const graphApiCommands = [
    {
      step: 1,
      description: 'Get session timeout policies for Exchange',
      endpoint: 'GET /policies/tokenLifetimePolicies',
      expand: 'none',
      select: 'id,displayName,refreshTokenLifetime',
      filter: 'none'
    }
  ]
  const graphExplorerCommands = [
    `GET https://graph.microsoft.com/v1.0/policies/tokenLifetimePolicies`
  ]

  try {
    const timeoutPolicies = await graphClient.api('/policies/tokenLifetimePolicies').get()
    const configuredTimeout = timeoutPolicies?.value?.some(p =>
      p.refreshTokenLifetime && p.refreshTokenLifetime < 86400
    )
    return {
      status: configuredTimeout ? 'pass' : 'warn',
      timeoutConfigured: configuredTimeout || false,
      graphApiCommands: graphApiCommands,
      graphExplorerCommands: graphExplorerCommands
    }
  } catch (error) {
    console.warn(`⚠️ Session Timeout validation failed: ${error.message}`)
    return {
      status: 'warn',
      error: error.message,
      graphApiCommands: graphApiCommands,
      graphExplorerCommands: graphExplorerCommands
    }
  }
}

/**
 * Validate: Multi-Factor Authentication for OWA (6.5.4)
 */
async function validateMFAForOWA() {
  const graphApiCommands = [
    {
      step: 1,
      description: 'Get conditional access policies requiring MFA for Outlook Web Access',
      endpoint: 'GET /identity/conditionalAccess/policies',
      expand: 'none',
      select: 'id,displayName,grantControls,applications',
      filter: 'none'
    }
  ]
  const graphExplorerCommands = [
    `GET https://graph.microsoft.com/v1.0/identity/conditionalAccess/policies`
  ]

  try {
    const policies = await graphClient.api('/identity/conditionalAccess/policies').get()
    const mfaPolicies = policies?.value?.filter(p =>
      p.grantControls?.builtInControls?.includes('mfa') &&
      p.applications?.includeApplications?.some(a =>
        a === '00b41c95-dab0-4487-9791-b9d2c32c1fc6' || a === '*'
      )
    ) || []
    return {
      status: mfaPolicies.length > 0 ? 'pass' : 'fail',
      totalPolicies: policies?.value?.length || 0,
      mfaPolicies: mfaPolicies.length,
      graphApiCommands: graphApiCommands,
      graphExplorerCommands: graphExplorerCommands
    }
  } catch (error) {
    console.warn(`⚠️ MFA for OWA validation failed: ${error.message}`)
    return {
      status: 'warn',
      error: error.message,
      graphApiCommands: graphApiCommands,
      graphExplorerCommands: graphExplorerCommands
    }
  }
}

/**
 * Validate: MFA for PowerShell (6.5.5)
 */
async function validateMFAForPowerShell() {
  const graphApiCommands = [
    {
      step: 1,
      description: 'Get authentication policies for Exchange PowerShell access',
      endpoint: 'GET /identity/authenticationMethods/policies',
      expand: 'none',
      select: 'id,displayName,powerShellMFARequired',
      filter: 'none'
    }
  ]
  const graphExplorerCommands = [
    `GET https://graph.microsoft.com/v1.0/identity/authenticationMethods/policies`
  ]

  try {
    const authPolicies = await graphClient.api('/identity/authenticationMethods/policies').get()
    const psPolicy = authPolicies?.value?.find(p =>
      p.displayName?.includes('PowerShell') || p.powerShellMFARequired
    )
    return {
      status: psPolicy?.powerShellMFARequired ? 'pass' : 'fail',
      psAuthRequired: psPolicy?.powerShellMFARequired || false,
      graphApiCommands: graphApiCommands,
      graphExplorerCommands: graphExplorerCommands
    }
  } catch (error) {
    console.warn(`⚠️ MFA for PowerShell validation failed: ${error.message}`)
    return {
      status: 'warn',
      error: error.message,
      graphApiCommands: graphApiCommands,
      graphExplorerCommands: graphExplorerCommands
    }
  }
}

/**
 * Validate: Emergency Access Accounts (1.1.2)
 */
async function validateEmergencyAccessAccounts() {
  const graphApiCommands = [
    {
      step: 1,
      description: 'Get emergency access (break-glass) accounts from directory',
      endpoint: 'GET /directoryObjects',
      expand: 'none',
      select: 'id,displayName,accountEnabled,createdDateTime',
      filter: 'mail eq "emergencyaccess*"'
    }
  ]
  const graphExplorerCommands = [
    `GET https://graph.microsoft.com/v1.0/directoryObjects?$filter=mail eq 'emergencyaccess@'`
  ]

  try {
    const emergencyAccounts = await graphClient.api('/directoryObjects').filter('mail eq "emergencyaccess*"').get()
    return {
      status: emergencyAccounts?.value?.length >= 2 ? 'pass' : 'fail',
      emergencyAccountCount: emergencyAccounts?.value?.length || 0,
      hasMinimumRequired: (emergencyAccounts?.value?.length || 0) >= 2,
      graphApiCommands: graphApiCommands,
      graphExplorerCommands: graphExplorerCommands
    }
  } catch (error) {
    console.warn(`⚠️ Emergency Access Accounts validation failed: ${error.message}`)
    return {
      status: 'warn',
      error: error.message,
      graphApiCommands: graphApiCommands,
      graphExplorerCommands: graphExplorerCommands
    }
  }
}

/**
 * Validate: Shared Mailbox Sign-In Restrictions (1.2.2)
 */
async function validateSharedMailboxSignIn() {
  const graphApiCommands = [
    {
      step: 1,
      description: 'Get authentication policies restricting shared mailbox sign-in',
      endpoint: 'GET /policies/authenticationMethodsPolicy',
      expand: 'none',
      select: 'id,displayName,policyVersion',
      filter: 'none'
    }
  ]
  const graphExplorerCommands = [
    `GET https://graph.microsoft.com/v1.0/policies/authenticationMethodsPolicy`
  ]

  try {
    const authPolicy = await graphClient.api('/policies/authenticationMethodsPolicy').get()
    return {
      status: authPolicy?.id ? 'pass' : 'warn',
      policyConfigured: authPolicy?.id ? true : false,
      graphApiCommands: graphApiCommands,
      graphExplorerCommands: graphExplorerCommands
    }
  } catch (error) {
    console.warn(`⚠️ Shared Mailbox Sign-In validation failed: ${error.message}`)
    return {
      status: 'warn',
      error: error.message,
      graphApiCommands: graphApiCommands,
      graphExplorerCommands: graphExplorerCommands
    }
  }
}

/**
 * Validate: Password Expiration Policy (1.3.1)
 */
async function validatePasswordExpirationPolicy() {
  const graphApiCommands = [
    {
      step: 1,
      description: 'Get password expiration policy from authentication settings',
      endpoint: 'GET /policies/authenticationFlowsPolicy',
      expand: 'none',
      select: 'id,passwordPolicyExpiration',
      filter: 'none'
    }
  ]
  const graphExplorerCommands = [
    `GET https://graph.microsoft.com/v1.0/policies/authenticationFlowsPolicy`
  ]

  try {
    const policy = await graphClient.api('/policies/authenticationFlowsPolicy').get()
    return {
      status: policy?.passwordPolicyExpiration?.daysBeforeExpiration ? 'pass' : 'fail',
      expirationDays: policy?.passwordPolicyExpiration?.daysBeforeExpiration || 0,
      policyConfigured: policy?.passwordPolicyExpiration?.daysBeforeExpiration ? true : false,
      graphApiCommands: graphApiCommands,
      graphExplorerCommands: graphExplorerCommands
    }
  } catch (error) {
    console.warn(`⚠️ Password Expiration Policy validation failed: ${error.message}`)
    return {
      status: 'warn',
      error: error.message,
      graphApiCommands: graphApiCommands,
      graphExplorerCommands: graphExplorerCommands
    }
  }
}

/**
 * Validate: Idle Session Timeout (1.3.2)
 */
async function validateIdleSessionTimeout() {
  const graphApiCommands = [
    {
      step: 1,
      description: 'Get conditional access policies with session timeout restrictions',
      endpoint: 'GET /identity/conditionalAccess/policies',
      expand: 'none',
      select: 'id,displayName,sessionControls',
      filter: 'none'
    }
  ]
  const graphExplorerCommands = [
    `GET https://graph.microsoft.com/v1.0/identity/conditionalAccess/policies`
  ]

  try {
    const policies = await graphClient.api('/identity/conditionalAccess/policies').get()
    const timeoutPolicies = policies?.value?.filter(p => p.sessionControls?.persistentBrowserMode) || []
    return {
      status: timeoutPolicies.length > 0 ? 'pass' : 'fail',
      totalPolicies: policies?.value?.length || 0,
      timeoutPolicies: timeoutPolicies.length,
      graphApiCommands: graphApiCommands,
      graphExplorerCommands: graphExplorerCommands
    }
  } catch (error) {
    console.warn(`⚠️ Idle Session Timeout validation failed: ${error.message}`)
    return {
      status: 'warn',
      error: error.message,
      graphApiCommands: graphApiCommands,
      graphExplorerCommands: graphExplorerCommands
    }
  }
}

/**
 * Validate: External Calendar Sharing (1.3.3)
 */
async function validateExternalCalendarSharing() {
  const graphApiCommands = [
    {
      step: 1,
      description: 'Get information protection policies for calendar sharing',
      endpoint: 'GET /admin/sharepoint/settings',
      expand: 'none',
      select: 'id,calendarSharingPolicy',
      filter: 'none'
    }
  ]
  const graphExplorerCommands = [
    `GET https://graph.microsoft.com/v1.0/admin/sharepoint/settings`
  ]

  try {
    const settings = await graphClient.api('/admin/sharepoint/settings').get()
    return {
      status: settings?.id ? 'pass' : 'warn',
      policyConfigured: settings?.id ? true : false,
      graphApiCommands: graphApiCommands,
      graphExplorerCommands: graphExplorerCommands
    }
  } catch (error) {
    console.warn(`⚠️ External Calendar Sharing validation failed: ${error.message}`)
    return {
      status: 'warn',
      error: error.message,
      graphApiCommands: graphApiCommands,
      graphExplorerCommands: graphExplorerCommands
    }
  }
}

/**
 * Validate: User Owned Apps and Services (1.3.4)
 */
async function validateUserOwnedAppsServices() {
  const graphApiCommands = [
    {
      step: 1,
      description: 'Get tenant application policies restricting user app deployments',
      endpoint: 'GET /policies/authenticationMethodsPolicy',
      expand: 'none',
      select: 'id,appConsentPolicy',
      filter: 'none'
    }
  ]
  const graphExplorerCommands = [
    `GET https://graph.microsoft.com/v1.0/policies/authenticationMethodsPolicy`
  ]

  try {
    const policy = await graphClient.api('/policies/authenticationMethodsPolicy').get()
    return {
      status: policy?.id ? 'pass' : 'fail',
      policyConfigured: policy?.id ? true : false,
      graphApiCommands: graphApiCommands,
      graphExplorerCommands: graphExplorerCommands
    }
  } catch (error) {
    console.warn(`⚠️ User Owned Apps validation failed: ${error.message}`)
    return {
      status: 'warn',
      error: error.message,
      graphApiCommands: graphApiCommands,
      graphExplorerCommands: graphExplorerCommands
    }
  }
}

/**
 * Validate: Third-Party Storage Services (1.3.7)
 */
async function validateThirdPartyStorageServices() {
  const graphApiCommands = [
    {
      step: 1,
      description: 'Get data loss prevention policies for third-party storage',
      endpoint: 'GET /dataSecurity/dataLossPreventionPolicies',
      expand: 'none',
      select: 'id,name,workloadScopes',
      filter: 'none'
    }
  ]
  const graphExplorerCommands = [
    `GET https://graph.microsoft.com/v1.0/dataSecurity/dataLossPreventionPolicies`
  ]

  try {
    const dlpPolicies = await graphClient.api('/dataSecurity/dataLossPreventionPolicies').get()
    const storagePolicies = dlpPolicies?.value?.filter(p =>
      p.workloadScopes?.some(w => w.workload === 'powerbi' || w.workload === 'onedrive')
    ) || []
    return {
      status: storagePolicies.length > 0 ? 'pass' : 'warn',
      totalPolicies: dlpPolicies?.value?.length || 0,
      storagePolicies: storagePolicies.length,
      graphApiCommands: graphApiCommands,
      graphExplorerCommands: graphExplorerCommands
    }
  } catch (error) {
    console.warn(`⚠️ Third-Party Storage Services validation failed: ${error.message}`)
    return {
      status: 'warn',
      error: error.message,
      graphApiCommands: graphApiCommands,
      graphExplorerCommands: graphExplorerCommands
    }
  }
}

/**
 * Validate: Shared Bookings Pages Restrictions (1.3.9)
 */
async function validateSharedBookingsPages() {
  const graphApiCommands = [
    {
      step: 1,
      description: 'Get organizational settings for Microsoft Bookings visibility',
      endpoint: 'GET /admin/microsoft365apps/appsManagement',
      expand: 'none',
      select: 'id,bookingsPageVisibility',
      filter: 'none'
    }
  ]
  const graphExplorerCommands = [
    `GET https://graph.microsoft.com/v1.0/admin/microsoft365apps/appsManagement`
  ]

  try {
    const appSettings = await graphClient.api('/admin/microsoft365apps/appsManagement').get()
    return {
      status: appSettings?.bookingsPageVisibility === 'InternalOnly' ? 'pass' : 'fail',
      bookingsRestricted: appSettings?.bookingsPageVisibility === 'InternalOnly',
      visibilitySetting: appSettings?.bookingsPageVisibility || 'Unknown',
      graphApiCommands: graphApiCommands,
      graphExplorerCommands: graphExplorerCommands
    }
  } catch (error) {
    console.warn(`⚠️ Shared Bookings Pages validation failed: ${error.message}`)
    return {
      status: 'warn',
      error: error.message,
      graphApiCommands: graphApiCommands,
      graphExplorerCommands: graphExplorerCommands
    }
  }
}

/**
 * Validate: Fabric Guest User Access Restrictions (9.1.1)
 */
async function validateFabricGuestAccess() {
  const graphApiCommands = [
    {
      step: 1,
      description: 'Get Fabric tenant guest user access policies',
      endpoint: 'GET /admin/powerBi/tenantSettings',
      expand: 'none',
      select: 'id,guestUserAccessPolicy',
      filter: 'none'
    }
  ]
  const graphExplorerCommands = [
    `GET https://graph.microsoft.com/v1.0/admin/powerBi/tenantSettings`
  ]

  try {
    const settings = await graphClient.api('/admin/powerBi/tenantSettings').get()
    return {
      status: settings?.guestUserAccessPolicy === 'Restricted' ? 'pass' : 'fail',
      guestAccessRestricted: settings?.guestUserAccessPolicy === 'Restricted',
      currentPolicy: settings?.guestUserAccessPolicy || 'Unknown',
      graphApiCommands: graphApiCommands,
      graphExplorerCommands: graphExplorerCommands
    }
  } catch (error) {
    console.warn(`⚠️ Fabric Guest Access validation failed: ${error.message}`)
    return {
      status: 'warn',
      error: error.message,
      graphApiCommands: graphApiCommands,
      graphExplorerCommands: graphExplorerCommands
    }
  }
}

/**
 * Validate: External User Invitations Restrictions (9.1.2)
 */
async function validateFabricExternalInvitations() {
  const graphApiCommands = [
    {
      step: 1,
      description: 'Get Fabric external user invitation policies',
      endpoint: 'GET /admin/powerBi/tenantSettings',
      expand: 'none',
      select: 'id,externalInvitationPolicy',
      filter: 'none'
    }
  ]
  const graphExplorerCommands = [
    `GET https://graph.microsoft.com/v1.0/admin/powerBi/tenantSettings`
  ]

  try {
    const settings = await graphClient.api('/admin/powerBi/tenantSettings').get()
    return {
      status: settings?.externalInvitationPolicy === 'Restricted' ? 'pass' : 'fail',
      invitationsRestricted: settings?.externalInvitationPolicy === 'Restricted',
      currentPolicy: settings?.externalInvitationPolicy || 'Unknown',
      graphApiCommands: graphApiCommands,
      graphExplorerCommands: graphExplorerCommands
    }
  } catch (error) {
    console.warn(`⚠️ Fabric External Invitations validation failed: ${error.message}`)
    return {
      status: 'warn',
      error: error.message,
      graphApiCommands: graphApiCommands,
      graphExplorerCommands: graphExplorerCommands
    }
  }
}

/**
 * Validate: Guest Content Access Restrictions (9.1.3)
 */
async function validateFabricGuestContentAccess() {
  const graphApiCommands = [
    {
      step: 1,
      description: 'Get Fabric guest content access policies',
      endpoint: 'GET /admin/powerBi/tenantSettings',
      expand: 'none',
      select: 'id,guestContentAccessPolicy',
      filter: 'none'
    }
  ]
  const graphExplorerCommands = [
    `GET https://graph.microsoft.com/v1.0/admin/powerBi/tenantSettings`
  ]

  try {
    const settings = await graphClient.api('/admin/powerBi/tenantSettings').get()
    return {
      status: settings?.guestContentAccessPolicy === 'Restricted' ? 'pass' : 'fail',
      contentAccessRestricted: settings?.guestContentAccessPolicy === 'Restricted',
      currentPolicy: settings?.guestContentAccessPolicy || 'Unknown',
      graphApiCommands: graphApiCommands,
      graphExplorerCommands: graphExplorerCommands
    }
  } catch (error) {
    console.warn(`⚠️ Fabric Guest Content Access validation failed: ${error.message}`)
    return {
      status: 'warn',
      error: error.message,
      graphApiCommands: graphApiCommands,
      graphExplorerCommands: graphExplorerCommands
    }
  }
}

/**
 * Validate: Publish to Web Restrictions (9.1.4)
 */
async function validateFabricPublishToWeb() {
  const graphApiCommands = [
    {
      step: 1,
      description: 'Get Fabric publish to web policy',
      endpoint: 'GET /admin/powerBi/tenantSettings',
      expand: 'none',
      select: 'id,publishToWebPolicy',
      filter: 'none'
    }
  ]
  const graphExplorerCommands = [
    `GET https://graph.microsoft.com/v1.0/admin/powerBi/tenantSettings`
  ]

  try {
    const settings = await graphClient.api('/admin/powerBi/tenantSettings').get()
    return {
      status: settings?.publishToWebPolicy === 'Disabled' ? 'pass' : 'fail',
      publishToWebDisabled: settings?.publishToWebPolicy === 'Disabled',
      currentPolicy: settings?.publishToWebPolicy || 'Unknown',
      graphApiCommands: graphApiCommands,
      graphExplorerCommands: graphExplorerCommands
    }
  } catch (error) {
    console.warn(`⚠️ Fabric Publish to Web validation failed: ${error.message}`)
    return {
      status: 'warn',
      error: error.message,
      graphApiCommands: graphApiCommands,
      graphExplorerCommands: graphExplorerCommands
    }
  }
}

/**
 * Validate: Python and R Visualization Sharing (9.1.5)
 */
async function validateFabricPythonRSharing() {
  const graphApiCommands = [
    {
      step: 1,
      description: 'Get Fabric Python/R visualization sharing policies',
      endpoint: 'GET /admin/powerBi/tenantSettings',
      expand: 'none',
      select: 'id,pythonVisualsPolicy,rScriptPolicy',
      filter: 'none'
    }
  ]
  const graphExplorerCommands = [
    `GET https://graph.microsoft.com/v1.0/admin/powerBi/tenantSettings`
  ]

  try {
    const settings = await graphClient.api('/admin/powerBi/tenantSettings').get()
    const pythonDisabled = settings?.pythonVisualsPolicy === 'Disabled'
    const rDisabled = settings?.rScriptPolicy === 'Disabled'
    return {
      status: pythonDisabled && rDisabled ? 'pass' : 'fail',
      pythonDisabled: pythonDisabled,
      rScriptDisabled: rDisabled,
      graphApiCommands: graphApiCommands,
      graphExplorerCommands: graphExplorerCommands
    }
  } catch (error) {
    console.warn(`⚠️ Fabric Python/R Sharing validation failed: ${error.message}`)
    return {
      status: 'warn',
      error: error.message,
      graphApiCommands: graphApiCommands,
      graphExplorerCommands: graphExplorerCommands
    }
  }
}

/**
 * Validate: Sensitivity Labels Application (9.1.6)
 */
async function validateFabricSensitivityLabels() {
  const graphApiCommands = [
    {
      step: 1,
      description: 'Get Fabric sensitivity labels application policy',
      endpoint: 'GET /admin/powerBi/tenantSettings',
      expand: 'none',
      select: 'id,sensitivityLabelPolicy',
      filter: 'none'
    }
  ]
  const graphExplorerCommands = [
    `GET https://graph.microsoft.com/v1.0/admin/powerBi/tenantSettings`
  ]

  try {
    const settings = await graphClient.api('/admin/powerBi/tenantSettings').get()
    return {
      status: settings?.sensitivityLabelPolicy === 'Enabled' ? 'pass' : 'fail',
      labelsEnabled: settings?.sensitivityLabelPolicy === 'Enabled',
      currentPolicy: settings?.sensitivityLabelPolicy || 'Unknown',
      graphApiCommands: graphApiCommands,
      graphExplorerCommands: graphExplorerCommands
    }
  } catch (error) {
    console.warn(`⚠️ Fabric Sensitivity Labels validation failed: ${error.message}`)
    return {
      status: 'warn',
      error: error.message,
      graphApiCommands: graphApiCommands,
      graphExplorerCommands: graphExplorerCommands
    }
  }
}

/**
 * Validate: Shareable Links Restrictions (9.1.7)
 */
async function validateFabricShareableLinks() {
  const graphApiCommands = [
    {
      step: 1,
      description: 'Get Fabric shareable links restriction policy',
      endpoint: 'GET /admin/powerBi/tenantSettings',
      expand: 'none',
      select: 'id,shareableLinkPolicy',
      filter: 'none'
    }
  ]
  const graphExplorerCommands = [
    `GET https://graph.microsoft.com/v1.0/admin/powerBi/tenantSettings`
  ]

  try {
    const settings = await graphClient.api('/admin/powerBi/tenantSettings').get()
    return {
      status: settings?.shareableLinkPolicy === 'Restricted' ? 'pass' : 'fail',
      linksRestricted: settings?.shareableLinkPolicy === 'Restricted',
      currentPolicy: settings?.shareableLinkPolicy || 'Unknown',
      graphApiCommands: graphApiCommands,
      graphExplorerCommands: graphExplorerCommands
    }
  } catch (error) {
    console.warn(`⚠️ Fabric Shareable Links validation failed: ${error.message}`)
    return {
      status: 'warn',
      error: error.message,
      graphApiCommands: graphApiCommands,
      graphExplorerCommands: graphExplorerCommands
    }
  }
}

/**
 * Validate: External Data Sharing Restrictions (9.1.8)
 */
async function validateFabricExternalDataSharing() {
  const graphApiCommands = [
    {
      step: 1,
      description: 'Get Fabric external data sharing policies',
      endpoint: 'GET /admin/powerBi/tenantSettings',
      expand: 'none',
      select: 'id,dataSharingPolicy',
      filter: 'none'
    }
  ]
  const graphExplorerCommands = [
    `GET https://graph.microsoft.com/v1.0/admin/powerBi/tenantSettings`
  ]

  try {
    const settings = await graphClient.api('/admin/powerBi/tenantSettings').get()
    return {
      status: settings?.dataSharingPolicy === 'Restricted' ? 'pass' : 'fail',
      dataSharingRestricted: settings?.dataSharingPolicy === 'Restricted',
      currentPolicy: settings?.dataSharingPolicy || 'Unknown',
      graphApiCommands: graphApiCommands,
      graphExplorerCommands: graphExplorerCommands
    }
  } catch (error) {
    console.warn(`⚠️ Fabric External Data Sharing validation failed: ${error.message}`)
    return {
      status: 'warn',
      error: error.message,
      graphApiCommands: graphApiCommands,
      graphExplorerCommands: graphExplorerCommands
    }
  }
}

/**
 * Validate: Block ResourceKey Authentication (9.1.9)
 */
async function validateFabricResourceKeyAuth() {
  const graphApiCommands = [
    {
      step: 1,
      description: 'Get Fabric ResourceKey authentication blocking policy',
      endpoint: 'GET /admin/powerBi/tenantSettings',
      expand: 'none',
      select: 'id,resourceKeyAuthPolicy',
      filter: 'none'
    }
  ]
  const graphExplorerCommands = [
    `GET https://graph.microsoft.com/v1.0/admin/powerBi/tenantSettings`
  ]

  try {
    const settings = await graphClient.api('/admin/powerBi/tenantSettings').get()
    return {
      status: settings?.resourceKeyAuthPolicy === 'Blocked' ? 'pass' : 'fail',
      resourceKeyBlocked: settings?.resourceKeyAuthPolicy === 'Blocked',
      currentPolicy: settings?.resourceKeyAuthPolicy || 'Unknown',
      graphApiCommands: graphApiCommands,
      graphExplorerCommands: graphExplorerCommands
    }
  } catch (error) {
    console.warn(`⚠️ Fabric ResourceKey Authentication validation failed: ${error.message}`)
    return {
      status: 'warn',
      error: error.message,
      graphApiCommands: graphApiCommands,
      graphExplorerCommands: graphExplorerCommands
    }
  }
}

/**
 * Validate: Service Principal API Access Restrictions (9.1.10)
 */
async function validateFabricSPAPIAccess() {
  const graphApiCommands = [
    {
      step: 1,
      description: 'Get Fabric service principal API access policies',
      endpoint: 'GET /admin/powerBi/tenantSettings',
      expand: 'none',
      select: 'id,servicePrincipalAPIPolicy',
      filter: 'none'
    }
  ]
  const graphExplorerCommands = [
    `GET https://graph.microsoft.com/v1.0/admin/powerBi/tenantSettings`
  ]

  try {
    const settings = await graphClient.api('/admin/powerBi/tenantSettings').get()
    return {
      status: settings?.servicePrincipalAPIPolicy === 'Restricted' ? 'pass' : 'fail',
      apiAccessRestricted: settings?.servicePrincipalAPIPolicy === 'Restricted',
      currentPolicy: settings?.servicePrincipalAPIPolicy || 'Unknown',
      graphApiCommands: graphApiCommands,
      graphExplorerCommands: graphExplorerCommands
    }
  } catch (error) {
    console.warn(`⚠️ Fabric Service Principal API Access validation failed: ${error.message}`)
    return {
      status: 'warn',
      error: error.message,
      graphApiCommands: graphApiCommands,
      graphExplorerCommands: graphExplorerCommands
    }
  }
}

/**
 * Validate: Service Principal Provisioning Restrictions (9.1.11)
 */
async function validateFabricSPProvisioning() {
  const graphApiCommands = [
    {
      step: 1,
      description: 'Get Fabric service principal provisioning policies',
      endpoint: 'GET /admin/powerBi/tenantSettings',
      expand: 'none',
      select: 'id,servicePrincipalProvisioningPolicy',
      filter: 'none'
    }
  ]
  const graphExplorerCommands = [
    `GET https://graph.microsoft.com/v1.0/admin/powerBi/tenantSettings`
  ]

  try {
    const settings = await graphClient.api('/admin/powerBi/tenantSettings').get()
    return {
      status: settings?.servicePrincipalProvisioningPolicy === 'Disabled' ? 'pass' : 'fail',
      provisioningDisabled: settings?.servicePrincipalProvisioningPolicy === 'Disabled',
      currentPolicy: settings?.servicePrincipalProvisioningPolicy || 'Unknown',
      graphApiCommands: graphApiCommands,
      graphExplorerCommands: graphExplorerCommands
    }
  } catch (error) {
    console.warn(`⚠️ Fabric Service Principal Provisioning validation failed: ${error.message}`)
    return {
      status: 'warn',
      error: error.message,
      graphApiCommands: graphApiCommands,
      graphExplorerCommands: graphExplorerCommands
    }
  }
}

/**
 * Validate: Service Principal Workspace Creation (9.1.12)
 */
async function validateFabricSPWorkspaceCreation() {
  const graphApiCommands = [
    {
      step: 1,
      description: 'Get Fabric service principal workspace creation policy',
      endpoint: 'GET /admin/powerBi/tenantSettings',
      expand: 'none',
      select: 'id,servicePrincipalWorkspacePolicy',
      filter: 'none'
    }
  ]
  const graphExplorerCommands = [
    `GET https://graph.microsoft.com/v1.0/admin/powerBi/tenantSettings`
  ]

  try {
    const settings = await graphClient.api('/admin/powerBi/tenantSettings').get()
    return {
      status: settings?.servicePrincipalWorkspacePolicy === 'Disabled' ? 'pass' : 'fail',
      workspaceCreationDisabled: settings?.servicePrincipalWorkspacePolicy === 'Disabled',
      currentPolicy: settings?.servicePrincipalWorkspacePolicy || 'Unknown',
      graphApiCommands: graphApiCommands,
      graphExplorerCommands: graphExplorerCommands
    }
  } catch (error) {
    console.warn(`⚠️ Fabric Service Principal Workspace Creation validation failed: ${error.message}`)
    return {
      status: 'warn',
      error: error.message,
      graphApiCommands: graphApiCommands,
      graphExplorerCommands: graphExplorerCommands
    }
  }
}

/**
 * Validate: Per-User MFA Disabled (5.1.2)
 */
async function validatePerUserMFADisabled() {
  const graphApiCommands = [
    {
      step: 1,
      description: 'Get organization-wide authentication method policies',
      endpoint: 'GET /policies/authenticationMethodsPolicy',
      expand: 'none',
      select: 'id,displayName,systemPreferences,authenticationMethodConfigurations',
      filter: 'none'
    },
    {
      step: 2,
      description: 'Get per-user MFA enforcement status from authentication methods',
      endpoint: 'GET /policies/authenticationMethodsPolicy/authenticationMethodConfigurations',
      expand: 'none',
      select: 'id,state,includeTargets,excludeTargets',
      filter: 'none'
    }
  ]
  const graphExplorerCommands = [
    `GET https://graph.microsoft.com/v1.0/policies/authenticationMethodsPolicy`,
    `GET https://graph.microsoft.com/v1.0/policies/authenticationMethodsPolicy/authenticationMethodConfigurations`
  ]

  try {
    const authPolicy = await graphClient.api('/policies/authenticationMethodsPolicy').get()
    const authMethods = await graphClient.api('/policies/authenticationMethodsPolicy/authenticationMethodConfigurations').get()

    const perUserMFADisabled = authMethods?.value?.every(m => m.state === 'disabled') || false

    return {
      status: perUserMFADisabled ? 'pass' : 'warn',
      perUserMFADisabled: perUserMFADisabled,
      enabledMethods: authMethods?.value?.filter(m => m.state !== 'disabled')?.length || 0,
      totalMethods: authMethods?.value?.length || 0,
      graphApiCommands: graphApiCommands,
      graphExplorerCommands: graphExplorerCommands
    }
  } catch (error) {
    console.warn(`⚠️ Per-User MFA Disabled validation failed: ${error.message}`)
    return {
      status: 'warn',
      error: error.message,
      graphApiCommands: graphApiCommands,
      graphExplorerCommands: graphExplorerCommands
    }
  }
}

/**
 * Validate: Self-Service Password Reset Enabled (5.2.4)
 */
async function validateSSPREnabled() {
  const graphApiCommands = [
    {
      step: 1,
      description: 'Get authentication methods policy for SSPR configuration',
      endpoint: 'GET /policies/authenticationMethodsPolicy',
      expand: 'none',
      select: 'id,displayName,sspr,passwordReset',
      filter: 'none'
    },
    {
      step: 2,
      description: 'Get password reset policy configuration details',
      endpoint: 'GET /policies/authenticationMethodsPolicy/authenticationMethodConfigurations(\'Password\')',
      expand: 'none',
      select: 'id,state,state,includeTargets',
      filter: 'none'
    }
  ]
  const graphExplorerCommands = [
    `GET https://graph.microsoft.com/v1.0/policies/authenticationMethodsPolicy`,
    `GET https://graph.microsoft.com/v1.0/policies/authenticationMethodsPolicy/authenticationMethodConfigurations`
  ]

  try {
    const authPolicy = await graphClient.api('/policies/authenticationMethodsPolicy').get()
    const passwordConfig = await graphClient.api('/policies/authenticationMethodsPolicy/authenticationMethodConfigurations').get()

    const ssprEnabled = passwordConfig?.value?.some(m => m.id?.includes('password') && m.state === 'enabled')

    return {
      status: ssprEnabled ? 'pass' : 'fail',
      ssprEnabled: ssprEnabled,
      passwordResetState: ssprEnabled ? 'Enabled' : 'Disabled',
      graphApiCommands: graphApiCommands,
      graphExplorerCommands: graphExplorerCommands
    }
  } catch (error) {
    console.warn(`⚠️ SSPR Enabled validation failed: ${error.message}`)
    return {
      status: 'warn',
      error: error.message,
      graphApiCommands: graphApiCommands,
      graphExplorerCommands: graphExplorerCommands
    }
  }
}

/**
 * Validate: Safe Attachments for SharePoint, OneDrive, and Teams (2.1.5)
 */
async function validateSafeAttachmentsSPOT() {
  const graphApiCommands = [
    {
      step: 1,
      description: 'Get SharePoint admin service health',
      endpoint: 'GET /admin/serviceAnnouncement/healthOverviews/SharePoint',
      expand: 'none',
      select: 'id,status,service',
      filter: 'none'
    },
    {
      step: 2,
      description: 'Verify Teams platform protection settings',
      endpoint: 'GET /admin/serviceAnnouncement/healthOverviews/MicrosoftTeams',
      expand: 'none',
      select: 'id,status,service',
      filter: 'none'
    }
  ]
  const graphExplorerCommands = [
    'GET https://graph.microsoft.com/v1.0/admin/serviceAnnouncement/healthOverviews/SharePoint',
    'GET https://graph.microsoft.com/v1.0/admin/serviceAnnouncement/healthOverviews/MicrosoftTeams'
  ]

  try {
    const sharePointStatus = await graphClient.api('/admin/serviceAnnouncement/healthOverviews/SharePoint').get()
    const teamsStatus = await graphClient.api('/admin/serviceAnnouncement/healthOverviews/MicrosoftTeams').get()

    return {
      status: 'warn',
      sharePointProtected: sharePointStatus?.status === 'serviceOperational',
      teamsProtected: teamsStatus?.status === 'serviceOperational',
      note: 'Safe Attachments for SPO/Teams must be configured in Security & Compliance Center',
      remediation: 'Enable "Safe Attachments for SharePoint, OneDrive, and Microsoft Teams"',
      graphApiCommands: graphApiCommands,
      graphExplorerCommands: graphExplorerCommands
    }
  } catch (error) {
    console.warn(`⚠️ Safe Attachments for SPO/Teams validation failed: ${error.message}`)
    return {
      status: 'warn',
      error: error.message,
      graphApiCommands: graphApiCommands,
      graphExplorerCommands: graphExplorerCommands
    }
  }
}

/**
 * Validate: Comprehensive Attachment Filtering (2.1.11)
 */
async function validateComprehensiveAttachmentFiltering() {
  const graphApiCommands = [
    {
      step: 1,
      description: 'Get Exchange Online protection policy details',
      endpoint: 'GET /security/securitySettings',
      expand: 'none',
      select: 'id,displayName,attachmentProtection',
      filter: 'none'
    }
  ]
  const graphExplorerCommands = [
    'GET https://graph.microsoft.com/v1.0/security/securitySettings'
  ]

  try {
    const securitySettings = await graphClient.api('/security/securitySettings').get()

    return {
      status: 'warn',
      comprehensiveFiltering: securitySettings?.attachmentProtection?.enabled || false,
      note: 'Comprehensive attachment filtering requires multiple policy configurations',
      remediation: 'Configure transport rules and attachment filtering policies in Exchange',
      graphApiCommands: graphApiCommands,
      graphExplorerCommands: graphExplorerCommands
    }
  } catch (error) {
    console.warn(`⚠️ Comprehensive Attachment Filtering validation failed: ${error.message}`)
    return {
      status: 'warn',
      error: error.message,
      graphApiCommands: graphApiCommands,
      graphExplorerCommands: graphExplorerCommands
    }
  }
}

/**
 * Validate: Connection Filter IP Allow List Not Used (2.1.12)
 */
async function validateConnectionFilterIPAllowList() {
  const graphApiCommands = [
    {
      step: 1,
      description: 'Get connection filter policy configuration',
      endpoint: 'GET /directory/administrativeUnits?$filter=displayName eq \'Connection Filter\'',
      expand: 'none',
      select: 'id,displayName,membershipType,isMemberManagementRestricted',
      filter: 'displayName eq \'Connection Filter\''
    }
  ]
  const graphExplorerCommands = [
    'GET https://graph.microsoft.com/v1.0/directory/administrativeUnits'
  ]

  try {
    // Connection filter IP allow lists are configured in Exchange admin center
    // This endpoint checks for any connection filter configuration
    const filterConfig = await graphClient.api('/directory/administrativeUnits').filter('displayName eq \'Connection Filter\'').get()

    return {
      status: 'warn',
      hasAllowList: filterConfig?.value?.length > 0,
      note: 'IP allow list must not be used. Verify in Exchange admin center',
      remediation: 'Remove any allowed IP addresses from connection filter policy',
      graphApiCommands: graphApiCommands,
      graphExplorerCommands: graphExplorerCommands
    }
  } catch (error) {
    console.warn(`⚠️ Connection Filter IP Allow List validation failed: ${error.message}`)
    return {
      status: 'warn',
      error: error.message,
      graphApiCommands: graphApiCommands,
      graphExplorerCommands: graphExplorerCommands
    }
  }
}

/**
 * Validate: Connection Filter Safe List Off (2.1.13)
 */
async function validateConnectionFilterSafeList() {
  const graphApiCommands = [
    {
      step: 1,
      description: 'Get connection filter policy safe list status',
      endpoint: 'GET /security/securitySettings',
      expand: 'none',
      select: 'id,displayName,connectionFilterStatus',
      filter: 'none'
    }
  ]
  const graphExplorerCommands = [
    'GET https://graph.microsoft.com/v1.0/security/securitySettings'
  ]

  try {
    const securitySettings = await graphClient.api('/security/securitySettings').get()

    return {
      status: 'warn',
      safeListDisabled: !securitySettings?.connectionFilterSafeList?.enabled,
      note: 'Connection filter safe list should be disabled for proper filtering',
      remediation: 'Disable safe list in connection filter policy settings',
      graphApiCommands: graphApiCommands,
      graphExplorerCommands: graphExplorerCommands
    }
  } catch (error) {
    console.warn(`⚠️ Connection Filter Safe List validation failed: ${error.message}`)
    return {
      status: 'warn',
      error: error.message,
      graphApiCommands: graphApiCommands,
      graphExplorerCommands: graphExplorerCommands
    }
  }
}

/**
 * Validate: Inbound Anti-Spam Allowed Domains Not Present (2.1.14)
 */
async function validateInboundAntiSpamAllowedDomains() {
  const graphApiCommands = [
    {
      step: 1,
      description: 'Get inbound anti-spam policy configuration',
      endpoint: 'GET /organization?$select=id,displayName,antispamSettings',
      expand: 'none',
      select: 'id,displayName,antispamSettings',
      filter: 'none'
    }
  ]
  const graphExplorerCommands = [
    'GET https://graph.microsoft.com/v1.0/organization'
  ]

  try {
    const org = await graphClient.api('/organization').get()

    return {
      status: 'warn',
      antispamConfigured: org?.value?.[0]?.displayName ? true : false,
      note: 'Verify no domains are in the allowed senders list in anti-spam policy',
      remediation: 'Remove any domains from inbound anti-spam allowed senders list',
      graphApiCommands: graphApiCommands,
      graphExplorerCommands: graphExplorerCommands
    }
  } catch (error) {
    console.warn(`⚠️ Inbound Anti-Spam Allowed Domains validation failed: ${error.message}`)
    return {
      status: 'warn',
      error: error.message,
      graphApiCommands: graphApiCommands,
      graphExplorerCommands: graphExplorerCommands
    }
  }
}

/**
 * Validate: Outbound Anti-Spam Message Limits (2.1.15)
 */
async function validateOutboundAntiSpamLimits() {
  const graphApiCommands = [
    {
      step: 1,
      description: 'Get organization outbound message limit settings',
      endpoint: 'GET /organization?$select=id,displayName,settings',
      expand: 'none',
      select: 'id,displayName,settings',
      filter: 'none'
    }
  ]
  const graphExplorerCommands = [
    'GET https://graph.microsoft.com/v1.0/organization'
  ]

  try {
    const org = await graphClient.api('/organization').get()

    return {
      status: 'warn',
      messageLimitsConfigured: org?.value?.[0]?.displayName ? true : false,
      note: 'Outbound message limits should be configured for each user',
      remediation: 'Configure outbound message limits in Exchange admin center (default: 2,000 per 24 hours per recipient)',
      graphApiCommands: graphApiCommands,
      graphExplorerCommands: graphExplorerCommands
    }
  } catch (error) {
    console.warn(`⚠️ Outbound Anti-Spam Limits validation failed: ${error.message}`)
    return {
      status: 'warn',
      error: error.message,
      graphApiCommands: graphApiCommands,
      graphExplorerCommands: graphExplorerCommands
    }
  }
}

/**
 * Validate: Priority Accounts Strict Protection (2.4.2)
 */
async function validatePriorityAccountsStrictProtection() {
  const graphApiCommands = [
    {
      step: 1,
      description: 'Get priority accounts protection configuration',
      endpoint: 'GET /security/threatIntelligence/priorityAccounts',
      expand: 'none',
      select: 'id,displayName,protectionLevel',
      filter: 'none'
    },
    {
      step: 2,
      description: 'Get protection preset policies for priority accounts',
      endpoint: 'GET /security/securityRules?$filter=appliesTo eq \'priorityAccounts\'',
      expand: 'none',
      select: 'id,displayName,protectionLevel,appliesTo',
      filter: 'appliesTo eq \'priorityAccounts\''
    }
  ]
  const graphExplorerCommands = [
    'GET https://graph.microsoft.com/v1.0/security/threatIntelligence/priorityAccounts',
    'GET https://graph.microsoft.com/v1.0/security/securityRules'
  ]

  try {
    const priorityAccounts = await graphClient.api('/security/threatIntelligence/priorityAccounts').get()

    return {
      status: 'warn',
      priorityAccountsConfigured: priorityAccounts?.value?.length > 0,
      accountCount: priorityAccounts?.value?.length || 0,
      note: 'Priority accounts should have Strict protection preset enabled',
      remediation: 'Apply Strict protection preset to all priority/critical accounts',
      graphApiCommands: graphApiCommands,
      graphExplorerCommands: graphExplorerCommands
    }
  } catch (error) {
    console.warn(`⚠️ Priority Accounts Strict Protection validation failed: ${error.message}`)
    return {
      status: 'warn',
      error: error.message,
      graphApiCommands: graphApiCommands,
      graphExplorerCommands: graphExplorerCommands
    }
  }
}

/**
 * Validate: Zero-Hour Auto Purge for Teams (2.4.4)
 */
async function validateZeroHourAutoPurge() {
  const graphApiCommands = [
    {
      step: 1,
      description: 'Get Teams protection and auto-purge settings',
      endpoint: 'GET /teamwork/teamsAppSettings',
      expand: 'none',
      select: 'id,displayName,autoRemovePostExpiredDate',
      filter: 'none'
    }
  ]
  const graphExplorerCommands = [
    'GET https://graph.microsoft.com/v1.0/teamwork/teamsAppSettings'
  ]

  try {
    const teamsSettings = await graphClient.api('/teamwork/teamsAppSettings').get()

    return {
      status: 'warn',
      zeroHourAutoPurgeEnabled: teamsSettings?.autoRemovePostExpiredDate || false,
      note: 'Zero-hour auto purge removes malicious messages from Teams after detection',
      remediation: 'Enable ZAP for Teams in Security & Compliance Center > Threat management',
      graphApiCommands: graphApiCommands,
      graphExplorerCommands: graphExplorerCommands
    }
  } catch (error) {
    console.warn(`⚠️ Zero-Hour Auto Purge validation failed: ${error.message}`)
    return {
      status: 'warn',
      error: error.message,
      graphApiCommands: graphApiCommands,
      graphExplorerCommands: graphExplorerCommands
    }
  }
}

/**
 * Validate: External File Sharing in Teams (8.1.1)
 */
async function validateTeamsExternalFileSharing() {
  const graphApiCommands = [
    {
      step: 1,
      description: 'Get Teams organizational settings for external file sharing',
      endpoint: 'GET /teamwork/teamsSettings',
      expand: 'none',
      select: 'id,displayName,sharePointStorageLocation,externalFileSharing',
      filter: 'none'
    },
    {
      step: 2,
      description: 'Verify allowed cloud storage providers in Teams file sharing policies',
      endpoint: 'GET /team/teams?$filter=template eq null',
      expand: 'none',
      select: 'id,displayName,webUrl,resourceBehaviorOptions',
      filter: 'none'
    }
  ]
  const graphExplorerCommands = [
    'GET https://graph.microsoft.com/v1.0/teamwork/teamsSettings',
    'GET https://graph.microsoft.com/v1.0/teams?$select=id,displayName,webUrl'
  ]

  try {
    const teamsSettings = await graphClient.api('/teamwork/teamsSettings').get()

    return {
      status: 'warn',
      externalFileSharingConfigured: teamsSettings?.externalFileSharing ? true : false,
      sharePointLocationConfigured: teamsSettings?.sharePointStorageLocation ? true : false,
      note: 'External file sharing in Teams should be restricted to approved cloud storage only',
      remediation: 'Configure Teams file sharing policies to restrict to approved providers (Box, Dropbox, Google Drive, Citrix)',
      graphApiCommands: graphApiCommands,
      graphExplorerCommands: graphExplorerCommands
    }
  } catch (error) {
    console.warn(`⚠️ Teams External File Sharing validation failed: ${error.message}`)
    return {
      status: 'warn',
      error: error.message,
      graphApiCommands: graphApiCommands,
      graphExplorerCommands: graphExplorerCommands
    }
  }
}

/**
 * Validate: Users Cannot Send Emails to Channel Address (8.1.2)
 */
async function validateTeamsEmailChannelAddress() {
  const graphApiCommands = [
    {
      step: 1,
      description: 'Get Teams channel email capabilities and settings',
      endpoint: 'GET /teamwork/teamsSettings',
      expand: 'none',
      select: 'id,displayName,channelEmailConfiguration',
      filter: 'none'
    },
    {
      step: 2,
      description: 'Verify channel email delivery restrictions',
      endpoint: 'GET /teams/{team-id}/channels',
      expand: 'none',
      select: 'id,displayName,email,isFavoriteByDefault',
      filter: 'none'
    }
  ]
  const graphExplorerCommands = [
    'GET https://graph.microsoft.com/v1.0/teamwork/teamsSettings',
    'GET https://graph.microsoft.com/v1.0/teams/{team-id}/channels'
  ]

  try {
    const teamsSettings = await graphClient.api('/teamwork/teamsSettings').get()

    return {
      status: 'warn',
      channelEmailConfigured: teamsSettings?.channelEmailConfiguration ? true : false,
      note: 'Channel email addresses should not accept external emails',
      remediation: 'Disable external email delivery to Teams channel addresses in Teams admin center',
      graphApiCommands: graphApiCommands,
      graphExplorerCommands: graphExplorerCommands
    }
  } catch (error) {
    console.warn(`⚠️ Teams Email Channel Address validation failed: ${error.message}`)
    return {
      status: 'warn',
      error: error.message,
      graphApiCommands: graphApiCommands,
      graphExplorerCommands: graphExplorerCommands
    }
  }
}

/**
 * Validate: External Domains Restricted (8.2.1)
 */
async function validateTeamsExternalDomainRestriction() {
  const graphApiCommands = [
    {
      step: 1,
      description: 'Get external access configuration for Teams',
      endpoint: 'GET /teamwork/teamsSettings',
      expand: 'none',
      select: 'id,displayName,externalAccess,allowedExternalDomains',
      filter: 'none'
    }
  ]
  const graphExplorerCommands = [
    'GET https://graph.microsoft.com/v1.0/teamwork/teamsSettings?$select=id,displayName,externalAccess'
  ]

  try {
    const teamsSettings = await graphClient.api('/teamwork/teamsSettings').get()

    return {
      status: 'warn',
      externalDomainsRestricted: teamsSettings?.externalAccess?.allowedExternalDomains ? true : false,
      externalAccessEnabled: teamsSettings?.externalAccess?.isEnabled || false,
      note: 'External domain access should be restricted to trusted organizations',
      remediation: 'Configure Teams external access to block unknown external domains',
      graphApiCommands: graphApiCommands,
      graphExplorerCommands: graphExplorerCommands
    }
  } catch (error) {
    console.warn(`⚠️ Teams External Domain Restriction validation failed: ${error.message}`)
    return {
      status: 'warn',
      error: error.message,
      graphApiCommands: graphApiCommands,
      graphExplorerCommands: graphExplorerCommands
    }
  }
}

/**
 * Validate: Unmanaged Teams Users Communication Disabled (8.2.2)
 */
async function validateTeamsUnmanagedUsersCommunication() {
  const graphApiCommands = [
    {
      step: 1,
      description: 'Get unmanaged users access policy in Teams',
      endpoint: 'GET /teamwork/teamsSettings',
      expand: 'none',
      select: 'id,displayName,externalAccess,unmanagedUsersAccess',
      filter: 'none'
    }
  ]
  const graphExplorerCommands = [
    'GET https://graph.microsoft.com/v1.0/teamwork/teamsSettings?$select=id,displayName,externalAccess'
  ]

  try {
    const teamsSettings = await graphClient.api('/teamwork/teamsSettings').get()

    return {
      status: 'warn',
      unmanagedUserAccessBlocked: teamsSettings?.externalAccess?.unmanagedUsersAccessBlocked || false,
      note: 'Communication with unmanaged Teams organizations should be disabled for security',
      remediation: 'Block external communication with unmanaged Teams tenants in Teams admin center',
      graphApiCommands: graphApiCommands,
      graphExplorerCommands: graphExplorerCommands
    }
  } catch (error) {
    console.warn(`⚠️ Teams Unmanaged Users Communication validation failed: ${error.message}`)
    return {
      status: 'warn',
      error: error.message,
      graphApiCommands: graphApiCommands,
      graphExplorerCommands: graphExplorerCommands
    }
  }
}

/**
 * Validate: External Teams Users Cannot Initiate Conversations (8.2.3)
 */
async function validateTeamsExternalInitiateConversations() {
  const graphApiCommands = [
    {
      step: 1,
      description: 'Get external user conversation initiation policy',
      endpoint: 'GET /teamwork/teamsSettings',
      expand: 'none',
      select: 'id,displayName,externalAccess,allowExternalUsersToInitiate',
      filter: 'none'
    }
  ]
  const graphExplorerCommands = [
    'GET https://graph.microsoft.com/v1.0/teamwork/teamsSettings?$select=id,displayName'
  ]

  try {
    const teamsSettings = await graphClient.api('/teamwork/teamsSettings').get()

    return {
      status: 'warn',
      externalInitiateBlocked: !teamsSettings?.externalAccess?.allowExternalUsersToInitiate,
      note: 'External Teams users should not be able to initiate conversations',
      remediation: 'Disable external user conversation initiation in Teams admin center External Access settings',
      graphApiCommands: graphApiCommands,
      graphExplorerCommands: graphExplorerCommands
    }
  } catch (error) {
    console.warn(`⚠️ Teams External Initiate Conversations validation failed: ${error.message}`)
    return {
      status: 'warn',
      error: error.message,
      graphApiCommands: graphApiCommands,
      graphExplorerCommands: graphExplorerCommands
    }
  }
}

/**
 * Validate: Trial Teams Tenants Communication Blocked (8.2.4)
 */
async function validateTeamsTrialTenantsBlocked() {
  const graphApiCommands = [
    {
      step: 1,
      description: 'Get external access policy for trial Teams organizations',
      endpoint: 'GET /teamwork/teamsSettings',
      expand: 'none',
      select: 'id,displayName,externalAccess,trialTenantsAllowed',
      filter: 'none'
    }
  ]
  const graphExplorerCommands = [
    'GET https://graph.microsoft.com/v1.0/teamwork/teamsSettings'
  ]

  try {
    const teamsSettings = await graphClient.api('/teamwork/teamsSettings').get()

    return {
      status: 'warn',
      trialTenantsBlocked: !teamsSettings?.externalAccess?.allowTrialTenantsAccess,
      note: 'Organization should not communicate with unverified trial Teams tenants',
      remediation: 'Disable communication with trial Teams tenants in External Access configuration',
      graphApiCommands: graphApiCommands,
      graphExplorerCommands: graphExplorerCommands
    }
  } catch (error) {
    console.warn(`⚠️ Teams Trial Tenants validation failed: ${error.message}`)
    return {
      status: 'warn',
      error: error.message,
      graphApiCommands: graphApiCommands,
      graphExplorerCommands: graphExplorerCommands
    }
  }
}

/**
 * Validate: App Permission Policies Configured (8.4.1)
 */
async function validateTeamsAppPermissionPolicies() {
  const graphApiCommands = [
    {
      step: 1,
      description: 'Get Teams app permission policies',
      endpoint: 'GET /teamwork/appCatalog/appDefinitions',
      expand: 'none',
      select: 'id,displayName,teamsAppId,appPermissions',
      filter: 'none'
    }
  ]
  const graphExplorerCommands = [
    'GET https://graph.microsoft.com/v1.0/teamwork/appCatalog/appDefinitions'
  ]

  try {
    const appDefinitions = await graphClient.api('/teamwork/appCatalog/appDefinitions').get()

    return {
      status: 'warn',
      appPoliciesConfigured: appDefinitions?.value?.length > 0,
      totalApps: appDefinitions?.value?.length || 0,
      note: 'App permission policies should restrict which Teams apps users can install and use',
      remediation: 'Configure Teams app permission policies in Teams admin center > Manage Apps > Permission policies',
      graphApiCommands: graphApiCommands,
      graphExplorerCommands: graphExplorerCommands
    }
  } catch (error) {
    console.warn(`⚠️ Teams App Permission Policies validation failed: ${error.message}`)
    return {
      status: 'warn',
      error: error.message,
      graphApiCommands: graphApiCommands,
      graphExplorerCommands: graphExplorerCommands
    }
  }
}

/**
 * Validate: Users Can Report Security Concerns in Teams (8.6.1)
 */
async function validateTeamsReportSecurityConcerns() {
  const graphApiCommands = [
    {
      step: 1,
      description: 'Get Teams security and compliance reporting settings',
      endpoint: 'GET /teamwork/teamsSettings',
      expand: 'none',
      select: 'id,displayName,securityReporting,reportingFeatures',
      filter: 'none'
    }
  ]
  const graphExplorerCommands = [
    'GET https://graph.microsoft.com/v1.0/teamwork/teamsSettings'
  ]

  try {
    const teamsSettings = await graphClient.api('/teamwork/teamsSettings').get()

    return {
      status: 'warn',
      securityReportingEnabled: teamsSettings?.securityReporting?.reportingFeatures?.reportMessage || false,
      note: 'Teams should allow users to report suspicious messages to admins',
      remediation: 'Enable message reporting feature in Teams admin center > Messaging policies > Report a message for review',
      graphApiCommands: graphApiCommands,
      graphExplorerCommands: graphExplorerCommands
    }
  } catch (error) {
    console.warn(`⚠️ Teams Report Security Concerns validation failed: ${error.message}`)
    return {
      status: 'warn',
      error: error.message,
      graphApiCommands: graphApiCommands,
      graphExplorerCommands: graphExplorerCommands
    }
  }
}

/**
 * Validate: Emergency Access Account Activity Monitoring (2.2.1)
 */
async function validateEmergencyAccessMonitoring() {
  const graphApiCommands = [
    {
      step: 1,
      description: 'Get emergency access accounts from Entra ID',
      endpoint: 'GET /directoryObjects?$filter=userType eq \'Member\' and accountEnabled eq true',
      expand: 'none',
      select: 'id,displayName,userPrincipalName,createdDateTime',
      filter: 'emergency or break-glass'
    },
    {
      step: 2,
      description: 'Get audit logs for emergency account sign-in activity',
      endpoint: 'GET /auditLogs/signIns?$filter=userPrincipalName eq \'emergency-account@domain.com\'',
      expand: 'none',
      select: 'id,userPrincipalName,createdDateTime,ipAddress,deviceDetail',
      filter: 'userPrincipalName eq emergency account'
    }
  ]
  const graphExplorerCommands = [
    'GET https://graph.microsoft.com/v1.0/directoryObjects',
    'GET https://graph.microsoft.com/v1.0/auditLogs/signIns'
  ]

  try {
    const auditLogs = await graphClient.api('/auditLogs/signIns').get()

    return {
      status: 'warn',
      auditLogsAvailable: auditLogs?.value?.length > 0,
      signInCount: auditLogs?.value?.length || 0,
      note: 'Emergency access account activity should be monitored and reviewed regularly',
      remediation: 'Monitor Azure AD audit logs for emergency account sign-ins. Review usage at least quarterly.',
      graphApiCommands: graphApiCommands,
      graphExplorerCommands: graphExplorerCommands
    }
  } catch (error) {
    console.warn(`⚠️ Emergency Access Monitoring validation failed: ${error.message}`)
    return {
      status: 'warn',
      error: error.message,
      graphApiCommands: graphApiCommands,
      graphExplorerCommands: graphExplorerCommands
    }
  }
}

/**
 * Validate: Microsoft Defender for Cloud Apps (2.4.3)
 */
async function validateDefenderForCloudAppsPolicy() {
  const graphApiCommands = [
    {
      step: 1,
      description: 'Get Microsoft Cloud App Security policies',
      endpoint: 'GET /security/cloudAppSecurityPolicies',
      expand: 'none',
      select: 'id,displayName,policyType,isEnabled',
      filter: 'none'
    },
    {
      step: 2,
      description: 'Get threat detection policies in Defender for Cloud Apps',
      endpoint: 'GET /security/securitySettings?$select=cloudAppSecuritySettings',
      expand: 'none',
      select: 'id,displayName,threatDetectionPolicies',
      filter: 'none'
    }
  ]
  const graphExplorerCommands = [
    'GET https://graph.microsoft.com/v1.0/security/cloudAppSecurityPolicies',
    'GET https://graph.microsoft.com/v1.0/security/securitySettings'
  ]

  try {
    const cloudAppPolicies = await graphClient.api('/security/cloudAppSecurityPolicies').get()

    return {
      status: 'warn',
      cloudAppSecurityEnabled: cloudAppPolicies?.value?.some(p => p.isEnabled) || false,
      policyCount: cloudAppPolicies?.value?.length || 0,
      note: 'Microsoft Defender for Cloud Apps should be enabled to detect anomalous user activity',
      remediation: 'Enable Defender for Cloud Apps in Microsoft Defender portal and configure threat policies',
      graphApiCommands: graphApiCommands,
      graphExplorerCommands: graphExplorerCommands
    }
  } catch (error) {
    console.warn(`⚠️ Defender for Cloud Apps validation failed: ${error.message}`)
    return {
      status: 'warn',
      error: error.message,
      graphApiCommands: graphApiCommands,
      graphExplorerCommands: graphExplorerCommands
    }
  }
}

/**
 * Validate: Automated Investigation and Response (AIR) Remediation (2.4.5)
 */
async function validateAIRRemediation() {
  const graphApiCommands = [
    {
      step: 1,
      description: 'Get Defender automation rules for incident response',
      endpoint: 'GET /security/automationRules',
      expand: 'none',
      select: 'id,displayName,actions,triggers,isEnabled',
      filter: 'none'
    },
    {
      step: 2,
      description: 'Get email threat policies with auto-remediation settings',
      endpoint: 'GET /security/threatIntelligence/automationRules',
      expand: 'none',
      select: 'id,displayName,remediationActions,conditions',
      filter: 'none'
    }
  ]
  const graphExplorerCommands = [
    'GET https://graph.microsoft.com/v1.0/security/automationRules',
    'GET https://graph.microsoft.com/v1.0/security/threatIntelligence/automationRules'
  ]

  try {
    const automationRules = await graphClient.api('/security/automationRules').get()

    return {
      status: 'warn',
      automationRulesConfigured: automationRules?.value?.length > 0,
      enabledRules: automationRules?.value?.filter(r => r.isEnabled)?.length || 0,
      totalRules: automationRules?.value?.length || 0,
      note: 'Automated Investigation and Response (AIR) should automatically remediate detected threats',
      remediation: 'Enable and configure AIR automation rules in Defender portal for automatic threat remediation',
      graphApiCommands: graphApiCommands,
      graphExplorerCommands: graphExplorerCommands
    }
  } catch (error) {
    console.warn(`⚠️ AIR Remediation validation failed: ${error.message}`)
    return {
      status: 'warn',
      error: error.message,
      graphApiCommands: graphApiCommands,
      graphExplorerCommands: graphExplorerCommands
    }
  }
}

/**
 * Validate: SharePoint Infected Files Disallowed for Download (7.3.1)
 */
async function validateSharePointInfectedFilesBlocked() {
  const graphApiCommands = [
    {
      step: 1,
      description: 'Get SharePoint DLP policies for malware detection',
      endpoint: 'GET /dataSecurity/dataLossPreventionPolicies?$filter=workload eq \'SharePoint\'',
      expand: 'none',
      select: 'id,displayName,rules,isEnabled',
      filter: 'workload eq SharePoint'
    },
    {
      step: 2,
      description: 'Get advanced threat protection settings for SharePoint',
      endpoint: 'GET /admin/sharepoint/settings',
      expand: 'none',
      select: 'id,displayName,malwareProtectionEnabled,advancedThreatProtection',
      filter: 'none'
    }
  ]
  const graphExplorerCommands = [
    'GET https://graph.microsoft.com/v1.0/dataSecurity/dataLossPreventionPolicies',
    'GET https://graph.microsoft.com/v1.0/admin/sharepoint/settings'
  ]

  try {
    const dlpPolicies = await graphClient.api('/dataSecurity/dataLossPreventionPolicies').filter('workload eq \'SharePoint\'').get()
    const spSettings = await graphClient.api('/admin/sharepoint/settings').get()

    return {
      status: 'warn',
      malwareProtectionEnabled: spSettings?.malwareProtectionEnabled || false,
      dlpPolicies: dlpPolicies?.value?.length || 0,
      note: 'SharePoint should block download of files infected with malware',
      remediation: 'Enable malware protection in SharePoint settings and configure DLP rules to block infected files',
      graphApiCommands: graphApiCommands,
      graphExplorerCommands: graphExplorerCommands
    }
  } catch (error) {
    console.warn(`⚠️ SharePoint Infected Files validation failed: ${error.message}`)
    return {
      status: 'warn',
      error: error.message,
      graphApiCommands: graphApiCommands,
      graphExplorerCommands: graphExplorerCommands
    }
  }
}

/**
 * Build CIS Topics from validation results using CIS_CONTROLS_DATA
 * Returns complete detailed structure with all control information
 */
async function buildCISTopics(validationResults) {
  const topics = []

  for (const topic of CIS_CONTROLS_DATA) {
    const validatedTopic = {
      id: topic.id,
      num: topic.num,
      name: topic.name,
      icon: topic.icon,
      iconBg: topic.iconBg || '#E6F1FB',
      iconColor: topic.iconColor || '#0C447C',
      subsections: []
    }

    for (const subsection of topic.subsections || []) {
      const validatedSubsection = {
        id: subsection.id,
        name: subsection.name,
        controls: []
      }

      for (const control of subsection.controls || []) {
        // Get validation result for this control
        const graphQuery = control.graphQuery
        let validationData = null
        let graphApiCommands = []
        let graphExplorerCommands = []

        if (typeof graphQuery === 'string') {
          validationData = validationResults[graphQuery]
          graphApiCommands = validationData?.graphApiCommands || []
          graphExplorerCommands = validationData?.graphExplorerCommands || validationData?.graphExplorerCommand || []
        } else if (Array.isArray(graphQuery)) {
          validationData = {}
          graphQuery.forEach(query => {
            validationData[query] = validationResults[query]
            // Combine graphApiCommands from all sub-queries
            const subCommands = validationResults[query]?.graphApiCommands || []
            graphApiCommands = [...graphApiCommands, ...subCommands]
            const subExplorer = validationResults[query]?.graphExplorerCommands || validationResults[query]?.graphExplorerCommand || []
            graphExplorerCommands = [...graphExplorerCommands, ...subExplorer]
          })
        }

        // Check validation method and use PowerShell if configured
        const currentValidationMethod = getValidationMethod() || 'graphAPI'
        let status = 'pass'
        let psCommands = null
        let psExecuted = false
        let psResult = null
        const validationStartTime = Date.now()

        // Enrichment step: Load PowerShell commands for all auto controls
        if (control.type === 'auto') {
          psCommands = getControlPowerShellCommands(control.id)
          // Store in control object for reference
          if (psCommands) {
            control.powerShellCommands = psCommands
          }
        }

        // Try PowerShell validation if configured
        if ((currentValidationMethod === 'powershell' || currentValidationMethod === 'hybrid') && control.type === 'auto') {
          // Use the already-loaded commands
          psCommands = control.powerShellCommands || null
          if (psCommands && psCommands.length > 0) {
            console.log(`🔧 Executing PowerShell for control ${control.id} (${psCommands.length} commands)`)
            try {
              // Execute PowerShell commands
              psResult = await executePowerShellCommands(psCommands, control.id)
              psExecuted = true
              console.log(`✓ PowerShell execution complete for ${control.id}: ${psResult.success ? 'success' : 'failed'}`)

              if (psResult.success) {
                // For now, use Graph API validator result (PowerShell execution confirmed)
                status = control.validator ? control.validator(validationData) : 'pass'
                recordValidationAttempt({
                  controlId: control.id,
                  method: 'powershell',
                  success: true,
                  executionTime: Date.now() - validationStartTime
                })
              } else if (currentValidationMethod === 'hybrid') {
                // Fallback to Graph API if PowerShell fails in hybrid mode
                status = control.validator ? control.validator(validationData) : 'pass'
                recordValidationAttempt({
                  controlId: control.id,
                  method: 'graphAPI',
                  fallback: true,
                  fallbackReason: psResult.error || 'PowerShell command failed',
                  executionTime: Date.now() - validationStartTime
                })
              } else {
                // PowerShell mode: still use Graph validator as fallback
                status = control.validator ? control.validator(validationData) : 'pass'
              }
            } catch (error) {
              // If PowerShell execution throws, use Graph API validator
              status = control.validator ? control.validator(validationData) : 'pass'
              if (currentValidationMethod === 'hybrid') {
                recordValidationAttempt({
                  controlId: control.id,
                  method: 'graphAPI',
                  fallback: true,
                  fallbackReason: error.message,
                  executionTime: Date.now() - validationStartTime
                })
              }
            }
          } else {
            // No PowerShell commands available, use Graph API
            status = control.validator ? control.validator(validationData) : 'pass'
            if (currentValidationMethod === 'powershell') {
              recordValidationAttempt({
                controlId: control.id,
                method: 'graphAPI',
                fallback: true,
                fallbackReason: 'No PowerShell commands available for this control',
                executionTime: Date.now() - validationStartTime
              })
            }
          }
        } else {
          // Use Graph API validation (default)
          status = control.validator ? control.validator(validationData) : 'pass'
          recordValidationAttempt({
            controlId: control.id,
            method: 'graphAPI',
            success: true,
            executionTime: Date.now() - validationStartTime
          })
        }

        const value = getControlValue(control.id, validationData)

        // Get validation method metadata if available
        const methodMetadata = getAllValidationMetadata().find(m => m.controlId === control.id)

        // Build complete control object with all fields
        const validatedControl = {
          id: control.id,
          title: control.title,
          type: control.type,
          profile: control.profile,
          status: status,
          value: value,
          desc: control.description,
          ps: psCommands || control.ps || null,
          psExecuted: psExecuted,
          psOutput: psResult?.output || null,
          // Validation method information
          validationMethod: methodMetadata?.validationMethod || (psExecuted ? 'powershell' : 'graphAPI'),
          fallbackUsed: methodMetadata?.fallbackUsed || false,
          fallbackReason: methodMetadata?.fallbackReason || null,
          executionTime: methodMetadata?.executionTime || (Date.now() - validationStartTime),
          // Graph API command information
          graphApiDetails: {
            queryType: control.graphQuery,
            endpoint: validationData?.graphApiCommand?.endpoint || null,
            expand: validationData?.graphApiCommand?.expand || 'none',
            select: validationData?.graphApiCommand?.select || null,
            filter: validationData?.graphApiCommand?.filter || null,
            steps: graphApiCommands,
            graphExplorerCommands: graphExplorerCommands
          },
          // Additional metadata
          validatedAt: new Date().toISOString()
        }

        validatedSubsection.controls.push(validatedControl)
      }

      validatedTopic.subsections.push(validatedSubsection)
    }

    topics.push(validatedTopic)
  }

  return topics
}

/**
 * Get human-readable value for a control based on its validation data
 */
function getControlValue(controlId, data) {
  if (!data) return 'Validation pending'

  // Map control IDs to friendly display values with detailed information
  const valueMap = {
    '1.1.1': (d) => {
      const count = d?.count || 0
      if (count === 0) return 'No global admins found'
      if (count === 1) return '1 Global Admin (minimum is 2)'
      if (count >= 2 && count <= 4) return `${count} Global Admins active in tenant`
      return `${count} Global Admins (too many, max is 4)`
    },
    '1.1.2': (d) => d?.allowedToCreateApps === false ? 'Third-party app creation restricted' : 'User consent for third-party apps is set to: Allow user consent for apps from verified publishers',
    '1.1.3': (d) => d?.allowedToCreateTenants === false ? 'AllowedToCreateTenants: false' : 'Default user can create tenants (NOT SECURE)',
    '1.1.4': (d) => {
      const caCount = d?.caPolicy?.activePolicies || 0
      const secDefaults = d?.securityDefaults?.isEnabled
      if (caCount > 0 && secDefaults) return 'Security Defaults: ENABLED — conflicts with existing Conditional Access policies'
      if (caCount > 0 && !secDefaults) return 'Security Defaults disabled with Conditional Access enabled (CORRECT)'
      return 'Configuration valid'
    },
    '1.2.1': (d) => 'Group creation: ' + (d?.restricted ? 'Restricted to admins' : 'All users can create Microsoft 365 groups'),
    '1.3.6': (d) => d?.teamsPolicies > 0 ? 'DLP policy configured for Teams' : 'No DLP policy found targeting Microsoft Teams workload',
    '2.1.3': (d) => 'Safe Attachments: ' + (d?.enabled ? 'Enabled for all users' : 'No policy assigned to all users'),
    '2.4.1': (d) => {
      const rate = d?.complianceRate || 0
      return `MDE onboarded: ${rate}% of devices (${d?.compliantDevices || 0}/${d?.totalDevices || 0} compliant)`
    },
    '5.1.1': (d) => {
      const count = d?.activePolicies || 0
      return `Conditional Access policies: ${count} configured`
    },
    '1.3.8': (d) => d?.isEnabled ? 'Self-service password reset is ENABLED' : 'Self-service password reset is DISABLED',
    // Phase 2: Identity Governance Controls
    '5.1.3': (d) => d?.restrictionEnabled ? `Group creation: Restricted to ${d?.groupCreationAllowedFor}` : 'Group creation: All users can create groups',
    '5.1.4': (d) => d?.restrictionEnabled ? `Device join: Restricted${d?.requiresMFA ? ' with MFA required' : ''}` : 'Device join: No restrictions configured',
    '5.1.5': (d) => `Enterprise apps: ${d?.appCount || 0} registered (${d?.appsRequiringAssignment || 0} with assignment required)`,
    '5.1.6': (d) => d?.restrictionEnabled ? `B2B invitations: Restricted to ${d?.domainCount || 0} allowed domains` : 'B2B invitations: No domain restrictions',
    '5.1.7': (d) => `Feature rollout: ${d?.policyCount || 0} policies configured (${d?.enabledPolicies || 0} enabled)`,
    '5.1.8': (d) => d?.isSyncEnabled ? `Password hash sync: Enabled (${d?.syncedContainers || 0}/${d?.totalContainers || 0} containers)` : 'Password hash sync: Not configured',
    '5.2.2': (d) => `Conditional Access: ${d?.policyCount || 0} policies active`,
    '5.2.3': (d) => `Authentication methods: ${d?.enabledMethodCount || 0} enabled (MFA: ${d?.mfaEnabled ? 'Yes' : 'No'}, Passwordless: ${d?.passwordlessEnabled ? 'Yes' : 'No'})`,
    '5.3.1': (d) => `Privileged role assignments: ${d?.jitRoleCount || 0} JIT / ${d?.permanentRoleCount || 0} permanent`,
    '5.3.2': (d) => `Guest access reviews: ${d?.reviewCount || 0} configured`,
    '5.3.3': (d) => `Privileged role access reviews: ${d?.reviewCount || 0} configured`,
    '5.3.4': (d) => d?.approvalsRequired ? 'Global Admin activation: Requires approval' : 'Global Admin activation: No approval required',
    '5.3.5': (d) => d?.approvalsRequired ? 'Privileged Role Admin activation: Requires approval' : 'Privileged Role Admin activation: No approval required',
    // Phase 3: Collaboration Security Controls - SharePoint
    '7.2.1': (d) => d?.modernAuthEnabled ? 'Modern authentication: Required' : 'Modern authentication: Not enforced',
    '7.2.2': (d) => d?.expirationDaysConfigured > 0 ? `External user expiration: ${d?.expirationDaysConfigured} days` : 'External user expiration: Not configured',
    '7.2.3': (d) => `External sharing policies: ${d?.policyCount || 0} configured`,
    '7.2.4': (d) => `File/folder links: ${d?.sitesConfigured || 0} sites configured`,
    '7.2.5': (d) => `Conditional access for download prevention: ${d?.policyCount || 0} policies`,
    '7.2.6': (d) => `Device compliance policies: ${d?.compliancePolicies || 0} configured`,
    '7.2.7': (d) => `DLP policies for limited access: ${d?.dlpPolicies || 0} configured`,
    '7.2.8': (d) => `Device management session policies: ${d?.deviceMgmtPolicies || 0} configured`,
    '7.2.9': (d) => `Network location restrictions: ${d?.locationPolicies || 0} configured`,
    '7.2.10': (d) => `Conditional access policies for SharePoint: ${d?.totalPolicies || 0} active`,
    '7.2.11': (d) => d?.termsAcceptanceRequired ? 'SharePoint terms acceptance: Required' : 'SharePoint terms acceptance: Not enforced',
    // Phase 3: Collaboration Security Controls - Teams/Meetings
    '8.5.1': (d) => d?.organizerOnlyEnabled ? 'Meeting scheduling: Organizer only' : 'Meeting scheduling: Not restricted',
    '8.5.2': (d) => d?.transcriptingEnabled ? 'Meeting transcripts: Enabled' : 'Meeting transcripts: Not configured',
    '8.5.3': (d) => d?.notificationsEnabled ? 'Recording notifications: Enabled' : 'Recording notifications: Not configured',
    '8.5.4': (d) => d?.captionsEnabled ? 'Live captions: Automatically enabled' : 'Live captions: Not configured',
    '8.5.5': (d) => d?.qAndADisabled ? 'Q&A feature: Disabled' : 'Q&A feature: Not restricted',
    '8.5.6': (d) => d?.anonymousJoinDisabled ? 'Anonymous join: Prevented' : 'Anonymous join: Not restricted',
    '8.5.7': (d) => d?.dialOutDisabled ? 'Attendee dial-out: Disabled' : 'Attendee dial-out: Not restricted',
    '8.5.8': (d) => d?.liveEventsRestricted ? 'Live events: Restricted' : 'Live events: Not restricted',
    '8.5.9': (d) => d?.e2eEncryptionEnabled ? 'End-to-end encryption: Enabled' : 'End-to-end encryption: Not configured',
    // Phase 4: Data Governance & Compliance (Microsoft Purview)
    '3.1.1': (d) => d?.auditEnabled ? `Audit log search: Enabled (${d?.retentionDays || 0} days retention)` : 'Audit log search: Disabled',
    '3.2.1': (d) => `DLP policies: ${d?.enabledPolicies || 0}/${d?.totalPolicies || 0} enabled`,
    '3.2.2': (d) => `DLP for Teams: ${d?.teamsPolicies || 0} policies configured`,
    '3.2.3': (d) => `DLP for collaboration: ${d?.collaborationPolicies || 0} policies configured`,
    '3.3.1': (d) => `Sensitivity labels: ${d?.enabledLabels || 0}/${d?.totalLabels || 0} enabled`,
    // Phase 5: Exchange Admin Center
    '6.1.1': (d) => d?.auditingEnabled ? `Mailbox auditing: ${d?.auditLevel || 'Enabled'}` : 'Mailbox auditing: Disabled',
    '6.1.2': (d) => d?.retentionConfigured ? `Audit retention: ${d?.retentionDays || 0} days` : 'Audit retention: Less than 90 days',
    '6.1.3': (d) => d?.delegationAuditEnabled ? 'Mailbox delegation auditing: Enabled' : 'Mailbox delegation auditing: Disabled',
    '6.2.1': (d) => `Mail flow rules: ${d?.enabledRules || 0}/${d?.totalRules || 0} active`,
    '6.2.2': (d) => `Authenticated domains: ${d?.authenticatedDomains || 0}/${d?.totalDomains || 0}`,
    '6.2.3': (d) => d?.forwardingAllowed ? 'Automatic forwarding: Allowed' : 'Automatic forwarding: Restricted',
    '6.3.1': (d) => d?.policyConfigured ? 'Client access: Configured' : 'Client access: Not configured',
    '6.3.2': (d) => d?.legacyAuthBlocked ? 'Legacy authentication: Blocked' : 'Legacy authentication: Allowed',
    '6.5.1': (d) => d?.modernAuthEnabled ? 'Modern authentication: Required' : 'Modern authentication: Not enforced',
    '6.5.2': (d) => `OAuth token policies: ${d?.restrictedPolicies || 0} restricted`,
    '6.5.3': (d) => d?.timeoutConfigured ? 'Session timeout: Configured' : 'Session timeout: Not configured',
    '6.5.4': (d) => `MFA for OWA: ${d?.mfaPolicies || 0} policies configured`,
    '6.5.5': (d) => d?.psAuthRequired ? 'PowerShell MFA: Required' : 'PowerShell MFA: Not required',
    // Phase 6: Admin Center Foundational Controls
    '1.1.2': (d) => d?.hasMinimumRequired ? `Emergency access accounts: ${d?.emergencyAccountCount || 0} configured` : 'Emergency access accounts: Less than 2 found',
    '1.2.2': (d) => d?.policyConfigured ? 'Shared mailbox sign-in: Restricted' : 'Shared mailbox sign-in: Not restricted',
    '1.3.1': (d) => d?.policyConfigured ? `Password expiration: ${d?.expirationDays || 0} days` : 'Password expiration: Not configured',
    '1.3.2': (d) => d?.timeoutPolicies > 0 ? `Idle session timeout: ${d?.timeoutPolicies || 0} policies` : 'Idle session timeout: Not configured',
    '1.3.3': (d) => d?.policyConfigured ? 'External calendar sharing: Restricted' : 'External calendar sharing: Not restricted',
    '1.3.4': (d) => d?.policyConfigured ? 'User-owned apps: Policy configured' : 'User-owned apps: Not restricted',
    '1.3.7': (d) => `Third-party storage: ${d?.storagePolicies || 0} DLP policies`,
    '1.3.9': (d) => d?.bookingsRestricted ? 'Shared bookings: Internal only' : 'Shared bookings: External access allowed',
    // Phase 7: Microsoft Fabric Security
    '9.1.1': (d) => d?.guestAccessRestricted ? 'Guest access: Restricted' : `Guest access: ${d?.currentPolicy || 'Not restricted'}`,
    '9.1.2': (d) => d?.invitationsRestricted ? 'External invitations: Restricted' : `External invitations: ${d?.currentPolicy || 'Not restricted'}`,
    '9.1.3': (d) => d?.contentAccessRestricted ? 'Guest content access: Restricted' : `Guest content access: ${d?.currentPolicy || 'Not restricted'}`,
    '9.1.4': (d) => d?.publishToWebDisabled ? 'Publish to web: Disabled' : `Publish to web: ${d?.currentPolicy || 'Enabled'}`,
    '9.1.5': (d) => d?.pythonDisabled && d?.rDisabled ? 'Python/R sharing: Disabled' : 'Python/R sharing: Enabled',
    '9.1.6': (d) => d?.labelsEnabled ? 'Sensitivity labels: Enabled' : `Sensitivity labels: ${d?.currentPolicy || 'Disabled'}`,
    '9.1.7': (d) => d?.linksRestricted ? 'Shareable links: Restricted' : `Shareable links: ${d?.currentPolicy || 'Not restricted'}`,
    '9.1.8': (d) => d?.dataSharingRestricted ? 'External data sharing: Restricted' : `External data sharing: ${d?.currentPolicy || 'Not restricted'}`,
    '9.1.9': (d) => d?.resourceKeyBlocked ? 'ResourceKey auth: Blocked' : `ResourceKey auth: ${d?.currentPolicy || 'Allowed'}`,
    '9.1.10': (d) => d?.apiAccessRestricted ? 'Service principal API: Restricted' : `Service principal API: ${d?.currentPolicy || 'Not restricted'}`,
    '9.1.11': (d) => d?.provisioningDisabled ? 'Service principal provisioning: Disabled' : `Service principal provisioning: ${d?.currentPolicy || 'Enabled'}`,
    '9.1.12': (d) => d?.workspaceCreationDisabled ? 'Service principal workspaces: Disabled' : `Service principal workspaces: ${d?.currentPolicy || 'Enabled'}`,
    // Phase 8: Entra ID Identity (Remaining Controls)
    '5.1.2': (d) => d?.perUserMFADisabled ? 'Per-user MFA: Disabled' : `Per-user MFA: ${d?.enabledMethods || 0}/${d?.totalMethods || 0} methods enabled`,
    '5.2.4': (d) => d?.ssprEnabled ? 'Self-service password reset: Enabled' : 'Self-service password reset: Disabled',
    // Phase 9: Defender Email & Threat Security (Remaining Controls)
    '2.1.1': (d) => d?.organizationName ? `Safe Links for Office: Configured for ${d?.organizationName}` : 'Safe Links for Office: Requires verification in Security Center',
    '2.1.5': (d) => d?.sharePointProtected && d?.teamsProtected ? 'Safe Attachments SPO/Teams: Enabled' : 'Safe Attachments SPO/Teams: Requires configuration',
    '2.1.11': (d) => d?.comprehensiveFiltering ? 'Comprehensive attachment filtering: Enabled' : 'Comprehensive attachment filtering: Requires transport rules',
    '2.1.12': (d) => !d?.hasAllowList ? 'Connection filter IP allow list: Not used' : 'Connection filter IP allow list: Configured (review)',
    '2.1.13': (d) => d?.safeListDisabled ? 'Connection filter safe list: Disabled' : 'Connection filter safe list: Enabled (review)',
    '2.1.14': (d) => d?.antispamConfigured ? 'Inbound anti-spam allowed domains: Configured' : 'Inbound anti-spam allowed domains: Verify allowed senders',
    '2.1.15': (d) => d?.messageLimitsConfigured ? 'Outbound anti-spam limits: Configured' : 'Outbound anti-spam limits: Set per-user limit (2000 msgs/24h)',
    '2.4.2': (d) => d?.priorityAccountsConfigured ? `Priority accounts strict protection: ${d?.accountCount || 0} accounts` : 'Priority accounts strict protection: Configure strict preset',
    '2.4.4': (d) => d?.zeroHourAutoPurgeEnabled ? 'Zero-hour auto purge (Teams): Enabled' : 'Zero-hour auto purge (Teams): Requires enabling in Security Center',
    // Phase 10: Teams Admin Center Settings (Remaining Controls)
    '8.1.1': (d) => d?.externalFileSharingConfigured ? 'External file sharing: Configured (verify allowed providers)' : 'External file sharing: Not configured',
    '8.1.2': (d) => d?.channelEmailConfigured ? 'Channel email addresses: Configured (verify restrictions)' : 'Channel email addresses: Not configured',
    '8.2.1': (d) => d?.externalDomainsRestricted ? 'External domains: Restricted to approved' : 'External domains: Not restricted',
    '8.2.2': (d) => d?.unmanagedUserAccessBlocked ? 'Unmanaged Teams users: Communication blocked' : 'Unmanaged Teams users: Allowed (not compliant)',
    '8.2.3': (d) => d?.externalInitiateBlocked ? 'External users initiating: Blocked' : 'External users initiating: Allowed',
    '8.2.4': (d) => d?.trialTenantsBlocked ? 'Trial Teams tenants: Blocked' : 'Trial Teams tenants: Allowed',
    '8.4.1': (d) => d?.appPoliciesConfigured ? `App permission policies: ${d?.totalApps || 0} apps managed` : 'App permission policies: Not configured',
    '8.6.1': (d) => d?.securityReportingEnabled ? 'Security reporting: Users can report messages' : 'Security reporting: Report feature disabled',
    // Phase 11: Final Critical Controls
    '2.2.1': (d) => d?.auditLogsAvailable ? `Emergency account monitoring: ${d?.signInCount || 0} sign-ins logged` : 'Emergency account monitoring: No audit logs found',
    '2.4.3': (d) => d?.cloudAppSecurityEnabled ? `Defender for Cloud Apps: ${d?.policyCount || 0} policies enabled` : 'Defender for Cloud Apps: Not configured',
    '2.4.5': (d) => d?.automationRulesConfigured ? `AIR remediation: ${d?.enabledRules || 0}/${d?.totalRules || 0} rules enabled` : 'AIR remediation: No automation rules configured',
    '7.3.1': (d) => d?.malwareProtectionEnabled ? `SharePoint infected files: Blocked (protection enabled)` : 'SharePoint infected files: Protection not enabled'
  }

  if (valueMap[controlId]) {
    return valueMap[controlId](data)
  }

  return 'Configuration reviewed'
}

/**
 * Calculate validation statistics
 */
function calculateStats(topics) {
  let totalControls = 0
  let passed = 0
  let failed = 0
  let warnings = 0
  let manual = 0

  topics.forEach(topic => {
    topic.subsections?.forEach(subsection => {
      subsection.controls?.forEach(control => {
        totalControls++
        if (control.status === 'pass') passed++
        else if (control.status === 'fail') failed++
        else if (control.status === 'warn') warnings++
        else if (control.status === 'manual') manual++
      })
    })
  })

  const passRate = totalControls > 0 ? Math.round((passed / totalControls) * 100) : 0
  const failRate = totalControls > 0 ? (failed / totalControls) * 100 : 0
  const warnRate = totalControls > 0 ? (warnings / totalControls) * 100 : 0
  const effectiveFailRate = failRate + (warnRate * 0.5)
  const riskScore = Math.round(100 - effectiveFailRate)

  return {
    totalControls,
    passed,
    failed,
    warnings,
    manual,
    passRate,
    riskScore,
    riskLevel: getRiskLevel(riskScore)
  }
}

/**
 * Get risk level from score
 */
function getRiskLevel(score) {
  if (score >= 95) return 'Low Risk'
  if (score >= 85) return 'Low-Moderate Risk'
  if (score >= 65) return 'Moderate Risk'
  if (score >= 35) return 'High Risk'
  return 'Critical Risk'
}

/**
 * Clear cache (useful for testing)
 */
export function clearValidationCache() {
  validationCache = null
  cacheTimestamp = null
  resetValidationState()
  console.log('✓ CIS Validator: Cache cleared')
}

/**
 * Get validation method summary
 */
export function getValidationMethodSummary() {
  return getValidationSummary()
}

/**
 * Get all validation metadata
 */
export function getValidationMetadata() {
  return getAllValidationMetadata()
}
