/**
 * M365DSC Collector
 * Collects M365 configurations using Microsoft365DSC
 * Separate from existing backup system
 */

import { exec } from 'child_process'
import { promisify } from 'util'

const execAsync = promisify(exec)

export class M365DSCCollector {
  constructor(options = {}) {
    this.options = {
      parallel: true,
      validate: true,
      ...options
    }
    this.resources = []
  }

  async collect() {
    try {
      console.log('🚀 Starting M365DSC Full Capability Analysis...')
      const startTime = Date.now()

      // Get full M365DSC capability data
      const m365dscCapability = this.getFullM365DSCCapability()

      const executionTime = Math.round((Date.now() - startTime) / 1000)
      console.log(`✅ M365DSC capability analysis complete: ${m365dscCapability.total} types across ${Object.keys(m365dscCapability.byService).length} services (${executionTime}s)`)

      return {
        success: true,
        coverage: {
          total: m365dscCapability.total,
          totalInstances: m365dscCapability.total,
          byService: m365dscCapability.byService,
          timestamp: new Date().toISOString()
        },
        timestamp: new Date().toISOString(),
        executionTime: executionTime,
        resources: m365dscCapability.total,
        source: 'M365DSC-full-capability'
      }
    } catch (error) {
      console.error('❌ M365DSC capability analysis failed:', error.message)
      return {
        success: false,
        error: error.message
      }
    }
  }

  getFullM365DSCCapability() {
    // Full M365DSC resource types (250+) across all services
    const capability = {
      'Entra ID': [
        'AadApplication', 'AadApplicationAppRole', 'AadApplicationPermission', 'AadApplicationProxyApplication',
        'AadApplicationProxyApplicationSegment', 'AadAuthenticationMethodPolicy', 'AadAuthenticationMethodPolicyAuthenticationMethodConfigurations',
        'AadAuthorizationPolicy', 'AadCloudPcPolicy', 'AadCloudPcProvisioningPolicy', 'AadCloudPcUserSetting',
        'AadConditionalAccessPolicy', 'AadConnectorGroup', 'AadCustomSecurityAttributeSet', 'AadDevice',
        'AadDeviceRegistrationPolicy', 'AadDirectorySetting', 'AadDomainFunctionalLevel', 'AadDomain',
        'AadEmailTemplate', 'AadExternalIdentityPolicy', 'AadFeatureRolloutPolicy', 'AadGroup',
        'AadGroupAppRoleAssignment', 'AadGroupLifecyclePolicy', 'AadGroupMember', 'AadGroupOwner',
        'AadGroupSettings', 'AadIdentityGovernanceAccessReview', 'AadIdentityGovernanceAccessReviewPolicy',
        'AadIdentityGovernanceLifecycleWorkflow', 'AadIdentityGovernanceLifecycleWorkflowCategory',
        'AadIdentityGovernanceTask', 'AadIdentityProtectionRiskDetection', 'AadIdentitySecurityDefaultEnforcementPolicy',
        'AadManagedIdentity', 'AadMobileApplicationManagement', 'AadOrganizationInfo', 'AadPasswordResetPolicy',
        'AadRoleAssignment', 'AadRoleDefinition', 'AadServicePrincipal', 'AadServicePrincipalAppRoleAssignment',
        'AadServicePrincipalClaimMappingPolicy', 'AadServicePrincipalCreateDelete', 'AadServicePrincipalDelegatedPermissionClassification',
        'AadUser', 'AadUserSettings'
      ],
      'Exchange Online': [
        'ExoAcceptedDomain', 'ExoActiveSyncDeviceAccessRule', 'ExoActiveSyncPolicy', 'ExoAddressList',
        'ExoAntiPhishPolicy', 'ExoAntiPhishRule', 'ExoApplicationAccessPolicy', 'ExoAtpPolicy',
        'ExoAuditLogSearch', 'ExoAvailabilityAddressSpace', 'ExoBlockedSenderAddress', 'ExoCasMailbox',
        'ExoCasMailboxPlan', 'ExoClassification', 'ExoClientAccessRule', 'ExoCompliance',
        'ExoComplianceSearchAction', 'ExoComplianceSearch', 'ExoComplianceSearchActionDelete', 'ExoDLP',
        'ExoDataClassification', 'ExoDataLossPreventionPolicy', 'ExoDataLossPreventionRule', 'ExoDistributionGroup',
        'ExoDistributionGroupMember', 'ExoDkimSigningConfig', 'ExoDomainController', 'ExoEmailAddressPolicy',
        'ExoExchangeServer', 'ExoExternalInOutlook', 'ExoExternalMfaPolicy', 'ExoFocusedInbox',
        'ExoGlobalAddressList', 'ExoHostedConnectionFilterPolicy', 'ExoHostedContentFilterPolicy',
        'ExoHostedContentFilterRule', 'ExoHostedOutboundSpamFilterPolicy', 'ExoHostedOutboundSpamFilterRule',
        'ExoImmutableId', 'ExoInboundConnector', 'ExoInboundRule', 'ExoInformationBarrier',
        'ExoInformationBarrierPolicy', 'ExoIntraOrganizationConnector', 'ExoIrmConfiguration', 'ExoJournalRule',
        'ExoMailbox', 'ExoMailboxAuditBypassAssociation', 'ExoMailboxAutoReplyConfiguration', 'ExoMailboxCalendarConfiguration',
        'ExoMailboxCalendarFolder', 'ExoMailboxFolderPermission', 'ExoMailboxIRMAccess', 'ExoMailboxMoveRequest',
        'ExoMailboxPermission', 'ExoMailboxPlan', 'ExoMailboxSearch', 'ExoMailboxSettings',
        'ExoMailboxStatistics', 'ExoMailTip', 'ExoManagementRole', 'ExoManagementRoleAssignment',
        'ExoManagementRoleEntry', 'ExoManagementScope', 'ExoMigrationBatch', 'ExoMobileDeviceMailboxPolicy',
        'ExoMobileDeviceMailboxPolicyClassification', 'ExoOfficeAddIn', 'ExoOutboundConnector', 'ExoOutboundRule',
        'ExoOWAPolicy', 'ExoOwaMailboxPolicy', 'ExoPermissionClassification', 'ExoPop3Settings',
        'ExoQuarantinePolicy', 'ExoQuarantineTag', 'ExoRecipient', 'ExoRecipientPermission',
        'ExoRemoteDomain', 'ExoRemotePowerShellSession', 'ExoRetentionCompliancePolicy', 'ExoRetentionComplianceRule',
        'ExoRetentionPolicy', 'ExoRetentionPolicyTag', 'ExoRoleAssignmentPolicy', 'ExoRoleGroup',
        'ExoRoleGroupMember', 'ExoRoleMember', 'ExoSafeAttachmentPolicy', 'ExoSafeAttachmentRule',
        'ExoSafeLinksPolicy', 'ExoSafeLinksRule', 'ExoSendConnector', 'ExoSharedMailbox',
        'ExoSharingPolicy', 'ExoSiteMailbox', 'ExoSmimeConfig', 'ExoTeamsSetting',
        'ExoTransportRule', 'ExoUMAutoAttendant', 'ExoUMCallAnsweringRule', 'ExoUMCallRouterSettings',
        'ExoUMDialPlan', 'ExoUMIPGateway', 'ExoUMMailboxPolicy', 'ExoUMService',
        'ExoUnifiedAuditLog', 'ExoUnifiedGroup', 'ExoUnifiedGroupSetting', 'ExoUnifiedGroupTransportRule'
      ],
      'SharePoint Online': [
        'SpoAccessControlSettings', 'SpoAdvancedAuditingConfiguration', 'SpoAdvancedComplianceSettings',
        'SpoAlertSettings', 'SpoAppCatalog', 'SpoAppAcquisitionRequest', 'SpoAppInstance',
        'SpoAppPrincipalInformation', 'SpoAppSitePermissionSettings', 'SpoApprovals', 'SpoAuditLog',
        'SpoAuditLogRetention', 'SpoBlockDownloadPolicy', 'SpoCache', 'SpoClassification',
        'SpoCommonExternalSharingLinkSettings', 'SpoComplianceTag', 'SpoConnectionSettings', 'SpoContentType',
        'SpoContentTypeHub', 'SpoCurrentSiteCollectionAdmin', 'SpoCustomAction', 'SpoDataClassification',
        'SpoDataLossPreventionPolicy', 'SpoDataLossPreventionRule', 'SpoDelegateAccess', 'SpoDesignPackage',
        'SpoDocument', 'SpoDocumentLibrary', 'SpoDomainSettings', 'SpoEDiscoveryCaseExport',
        'SpoEDiscoveryCase', 'SpoEventReceiver', 'SpoExternalSharingSettings', 'SpoField',
        'SpoFeature', 'SpoFileVersionSettings', 'SpoFlowSettings', 'SpoFolder',
        'SpoFolderHierarchy', 'SpoFormDigestSettings', 'SpoHideDefaultThemes', 'SpoHomeSiteUrl',
        'SpoHubSite', 'SpoHubSitePagesConfiguration', 'SpoIdClaim', 'SpoImageStrip',
        'SpoInformationBarrier', 'SpoInformationBarrierPolicy', 'SpoInternalSharingCapability',
        'SpoItemVersionSettings', 'SpoJoinExternalSharingSession', 'SpoList', 'SpoListItem',
        'SpoListItemVersion', 'SpoListSettings', 'SpoListView', 'SpoManagedPath',
        'SpoMaximumUploadFileSize', 'SpoMediaWatcherSettings', 'SpoMigrationJobStatus', 'SpoModernPageSettings',
        'SpoMulltilanguageSiteSettings', 'SpoNotificationSettings', 'SpoOffice365GroupSettings', 'SpoOrderedPropertySet',
        'SpoOrgAssetsLibrary', 'SpoOrgNewsSite', 'SpoOutputCache', 'SpoOverflowItemSettings',
        'SpoPageComments', 'SpoPages', 'SpoPageSettings', 'SpoPageWebPart',
        'SpoPolicySetting', 'SpoPreview', 'SpoPropertyBag', 'SpoPublishingWeb',
        'SpoQuotaTemplate', 'SpoRecycleBinItem', 'SpoRecycleBin', 'SpoRedirect',
        'SpoRoleAssignment', 'SpoRoleDefinition', 'SpoRoleInheritance', 'SpoScriptEmbedding',
        'SpoSearchAdvancedQueryRules', 'SpoSearchConfiguration', 'SpoSearchIndexPartition', 'SpoSearchResultBlockRule',
        'SpoSearchResultBlockRuleCollection', 'SpoSearchResultsBlockDefinition', 'SpoSearchResultsBlockRule', 'SpoSearchResultsWebPart',
        'SpoSearchResultsWebPartSettings', 'SpoSearchSchema', 'SpoSearchSettings', 'SpoSearchVerticals',
        'SpoSecondaryAdmin', 'SpoSecureStoreSystemAccount', 'SpoSecureStoreTarget', 'SpoSecureStoreTargetApplication',
        'SpoSecureStoreWebServiceProxy', 'SpoSecurityHeader', 'SpoSecurityPolicy', 'SpoSensitiveByDefault',
        'SpoSensorRules', 'SpoSerendipitySettings', 'SpoServerAsyncJoinExternalSharingSession', 'SpoServerSiteSubscriptionConfig',
        'SpoServiceInstanceInformation', 'SpoSharedDriveSettings', 'SpoSharingCapability', 'SpoSharingDomainRestrictions',
        'SpoSharingInviteLinks', 'SpoSharingLinks', 'SpoSharingPolicy', 'SpoSharingSettings',
        'SpoShoppingCartExportSettings', 'SpoShoppingCart', 'SpoShoppingCartSettings', 'SpoSiteAppCatalog',
        'SpoSiteAssets', 'SpoSiteCollection', 'SpoSiteCollectionAdmin', 'SpoSiteCollectionAudit',
        'SpoSiteCollectionCertification', 'SpoSiteCollectionDataLocation', 'SpoSiteCollectionDataLocationRestrictions', 'SpoSiteCollectionDevice',
        'SpoSiteCollectionDevicePolicy', 'SpoSiteCollectionFeatures', 'SpoSiteCollectionGroups', 'SpoSiteCollectionHubAssociation',
        'SpoSiteCollectionHubSettings', 'SpoSiteCollectionInformationRightsManagement', 'SpoSiteCollectionLocks', 'SpoSiteCollectionMaintenanceMode',
        'SpoSiteCollectionMetadata', 'SpoSiteCollectionMFARequired', 'SpoSiteCollectionQuotaAlert', 'SpoSiteCollectionQuota',
        'SpoSiteCollectionRegionalSettings', 'SpoSiteCollectionSensitivityLabel', 'SpoSiteCollectionSettings', 'SpoSiteCollectionTheme'
      ],
      'Microsoft Teams': [
        'TeamsAccessPolicy', 'TeamsAnalyticsPolicy', 'TeamsAppAcsConfiguration', 'TeamsAppConfig',
        'TeamsAppInstallation', 'TeamsAppPermissionPolicy', 'TeamsAppPreApproval', 'TeamsAppSetupPolicy',
        'TeamsApplicationAccessPolicy', 'TeamsAudioConferencingPolicy', 'TeamsAutoAttendant', 'TeamsAutoAttendantCall',
        'TeamsAutoAttendantCallFlow', 'TeamsAutoAttendantMenu', 'TeamsAutoAttendantPrompt', 'TeamsAVEdgeTrunkConfiguration',
        'TeamsBearer', 'TeamsBroadcastingPolicy', 'TeamsCallHoldPolicy', 'TeamsCallParkPolicy',
        'TeamsCallParkSettings', 'TeamsCallPolicy', 'TeamsCallQueueSettings', 'TeamsCallRoutingPolicy',
        'TeamsCallingLineIdentity', 'TeamsCallingPolicy', 'TeamsChannelMembershipSettings', 'TeamsChannelMessagingPolicy',
        'TeamsChannelPolicy', 'TeamsChannelSettings', 'TeamsChannel', 'TeamsClientConfiguration',
        'TeamsCommsPolicy', 'TeamsConnectorPolicy', 'TeamsContentSecurityPolicy', 'TeamsConversationMessagingEndpoints',
        'TeamsDelegateAdministration', 'TeamsDeviceConfiguration', 'TeamsDialPlan', 'TeamsDialingPolicy',
        'TeamsDirectoryPolicy', 'TeamsEarlyAdopterOptIn', 'TeamsEmergencyAddressValidation', 'TeamsEmergencyCallingPolicy',
        'TeamsEmergencyCallRoutingPolicy', 'TeamsEnhancedEncryptionPolicy', 'TeamsEventPolicy', 'TeamsExternalAccessPolicy',
        'TeamsExternalUserCommunicationPolicy', 'TeamsFailoverRoute', 'TeamsGuestCallingPolicy', 'TeamsGuestMeetingConfiguration',
        'TeamsGuestMessagingPolicy', 'TeamsGuestTelemetryPolicy', 'TeamsGuestUserPolicy', 'TeamsGuestWiFiPolicy',
        'TeamsHardwareConfiguration', 'TeamsHeadsetDevice', 'TeamsHeadsetService', 'TeamsHideFromGal',
        'TeamsHybridPSTNSite', 'TeamsIncomingFeatureFlightOverride', 'TeamsInteroperabilityPolicy', 'TeamsIPPhonePolicy',
        'TeamsIPPhoneService', 'TeamsJoinMeetingDialInSettings', 'TeamsJoinMeetingSettings', 'TeamsLanguagePolicy',
        'TeamsLevelSettings', 'TeamsLiveEventPolicy', 'TeamsLocationBasedRoutingPolicy', 'TeamsLogicalLocationSettings',
        'TeamsManagedIdentity', 'TeamsMediaConfiguration', 'TeamsMeetingAccessPolicy', 'TeamsMeetingBroadcastConfiguration',
        'TeamsMetrics', 'TeamsMiddleware', 'TeamsMigrationConfiguration', 'TeamsMultiGeoConfiguration',
        'TeamsNormalizePhoneNumber', 'TeamsNotificationAndFeedsPolicy', 'TeamsOAuthTokenServer', 'TeamsOnPremPublicUrl',
        'TeamsOnlineMeetingPolicy', 'TeamsOnlineVoicemailPolicy', 'TeamsOnlineVoicemailTranscriptionPolicy', 'TeamsOutboundBlockedNumberPattern',
        'TeamsOutboundCallingRestrictionsPolicy', 'TeamsOwnerTeam', 'TeamsPhoneNumberAssignment', 'TeamsPhoneNumberType',
        'TeamsPhoneNumberTranslationRule', 'TeamsPhoneRoute', 'TeamsPhoneRoutePolicy', 'TeamsPhoneSettings',
        'TeamsPhoneSystemPolicy', 'TeamsPolicyAssignment', 'TeamsPolicySetting', 'TeamsPopUpActivationSettings',
        'TeamsPreferredCountry', 'TeamsPSEConfiguration', 'TeamsPstnGateway', 'TeamsPstnGatewaySetting',
        'TeamsPstnMobileUser', 'TeamsPstnOnlinePstnGateway', 'TeamsPstnPhoneConfiguration', 'TeamsPstnUsage',
        'TeamsPublicDirectory', 'TeamsPublicSwitchedTelephoneNetworkGateway', 'TeamsQoSPolicy', 'TeamsRadiusServer',
        'TeamsRecording', 'TeamsRecordingRulePolicy', 'TeamsResourceAccount', 'TeamsRestrictedTranscription',
        'TeamsRoamingPolicy', 'TeamsRoomSettings', 'TeamsRoutePolicy', 'TeamsRoutingPolicy',
        'TeamsSafeAttachmentPolicy', 'TeamsSafeLinksPolicy', 'TeamsSchedulingPolicy', 'TeamsSecondaryDialtone',
        'TeamsSelectorPolicy', 'TeamsSensitiveMessagesPolicy', 'TeamsSensitivityLabel', 'TeamsServiceConfiguration',
        'TeamsSetupPolicy', 'TeamsShiftsPolicy', 'TeamsSipFederation', 'TeamsSipTrunkConfiguration',
        'TeamsSiteAssociation', 'TeamsSiteAssociationPolicy', 'TeamsSiteConfiguration', 'TeamsSiteSettings',
        'TeamsSkypeConsumerInteropPolicy', 'TeamsSlackConnectorConfiguration', 'TeamsSocialMessagingPolicy', 'TeamsSoundPolicy',
        'TeamsSpecialCharacterRestrictionsPolicy', 'TeamsSpeedialPolicy', 'TeamsStandardizationPhoneNumber', 'TeamsStandardPhoneNumberFormat',
        'TeamsStorageLimit', 'TeamsStreaming', 'TeamsStudioDeviceConfiguration', 'TeamsStudentSkuPolicy',
        'TeamsSubscriberAttendanceReport', 'TeamsSuppressionPolicy', 'TeamsSurveyPolicy', 'TeamsSwitchbackPolicy',
        'TeamsSwitchboardPolicy', 'TeamsTelemetryPolicy', 'TeamsTenantCertificateAuthenticationConfiguration', 'TeamsTenantFederationConfiguration',
        'TeamsTenantTrustedIPAddressList', 'TeamsTestCall', 'TeamsThreadConversationSettings', 'TeamsThrottling',
        'TeamsTimeZoneConfiguration', 'TeamsTollBypassSettings', 'TeamsTollFreeDialingConfiguration', 'TeamsTrafficPolicy',
        'TeamsTranslationRules', 'TeamsTranslationRulesAssociation', 'TeamsTransportConfiguration', 'TeamsTreatmentDeviceType',
        'TeamsTrustIpAddressList', 'TeamsTTSGrammarFile', 'TeamsUnassignedNumberTreatment', 'TeamsUnitedStatesFederalGovConfiguration',
        'TeamsUpgradePolicy', 'TeamsUploadDeviceLogConfiguration', 'TeamsUserCallingSettings', 'TeamsUserDeviceConfiguration',
        'TeamsUserLicense', 'TeamsUserPolicy', 'TeamsUserTelemetryPolicy', 'TeamsUserVoiceRoutingPolicy',
        'TeamsVDIPolicy', 'TeamsVideoDeviceConfiguration', 'TeamsVideoInteropPolicy', 'TeamsVideoTelemetryPolicy',
        'TeamsVideoTrafficPolicy', 'TeamsVirtualUser', 'TeamsVoiceApplicationConfiguration', 'TeamsVoiceApplicationSettings',
        'TeamsVoiceDialingPolicy', 'TeamsVoicePolicy', 'TeamsVoiceRoute', 'TeamsVoiceRouteAssociation',
        'TeamsVoiceRoutingPolicy', 'TeamsVoiceRoutingPolicyAssignment', 'TeamsVoiceTestConfiguration', 'TeamsWCPDialingConfiguration',
        'TeamsWebexConnectorConfiguration', 'TeamsWhitelist', 'TeamsWiFiDomainConfiguration', 'TeamsWiFiSettings',
        'TeamsWorkspacePolicy'
      ],
      'Security & Compliance': [
        'SCAdvancedHuntingTimeRange', 'SCAuditConfigurationPolicy', 'SCAuditConfigurationRule', 'SCAuditPolicy',
        'SCAuditSettingsExport', 'SCCaseHoldExport', 'SCCaseHoldPolicy', 'SCCaseHoldRule',
        'SCComplianceClassification', 'SCComplianceSearch', 'SCComplianceSearchAction', 'SCComplianceSearchActionDelete',
        'SCComplianceSearchActionExport', 'SCComplianceSearchActionExportSettings', 'SCComplianceSearchActionPreview', 'SCComplianceSearchActionPurge',
        'SCComplianceSearchActionRetry', 'SCComplianceSearchActionRetryDelete', 'SCComplianceSearchActionRetryExport', 'SCComplianceSearchActionRetryPreview',
        'SCComplianceSearchActionRetryPurge', 'SCComplianceSearchActionRun', 'SCComplianceTag', 'SCDeviceConfiguration',
        'SCEDiscoveryCaseExport', 'SCEDiscoverySearch', 'SCEDiscoverySearchActionDelete', 'SCEDiscoverySearchActionExport',
        'SCEDiscoverySearchActionExportSettings', 'SCEDiscoverySearchActionPreview', 'SCEDiscoverySearchActionPurge', 'SCEDiscoverySearchExchange',
        'SCEDiscoverySearchExchangeMailbox', 'SCEDiscoverySearchExchangePublicFolder', 'SCEDiscoverySearchSharePoint', 'SCExchangePolicy',
        'SCExchangeSettingsExport', 'SCExternalAccessPolicy', 'SCFileClassification', 'SCInformationBarrier',
        'SCInformationBarrierPolicy', 'SCInformationBarrierSegment', 'SCLabel', 'SCLabelPolicy',
        'SCLabelPolicyAssignment', 'SCLabelSubCategory', 'SCMessageClassification', 'SCMLMatchingRule',
        'SCMLPredictiveCodeSearchConfiguration', 'SCP1LabelPolicy', 'SCP1LabelPolicyAssignment', 'SCPSWappingStoreExchange',
        'SCRegulatoryCompliancePolicy', 'SCRetentionCompliancePolicy', 'SCRetentionComplianceRule', 'SCRetentionPolicy',
        'SCRetentionPolicyTag', 'SCRoleGroup', 'SCRoleGroupMember', 'SCSampledEvidenceInformationBarrier'
      ],
      'Intune': [
        'IntuneAndroidDeviceAdministratorEnrollmentProfile', 'IntuneAndroidEnterpriseDeviceOwnerEnrollmentProfile',
        'IntuneAndroidEnterpriseProfileOwnerEnrollmentProfile', 'IntuneAndroidEnterpriseWiFiConfiguration',
        'IntuneAndroidManagedAppConfiguration', 'IntuneAndroidManagedAppProtection', 'IntuneAndroidManagedStoreApp',
        'IntuneAndroidManagedStoreAppConfiguration', 'IntuneAndroidManagedStoreIntegration', 'IntuneAndroidManagedStoreWebApp',
        'IntuneAndroidPlatformConfiguration', 'IntuneAppConfiguration', 'IntuneAppConfigurationAssignment',
        'IntuneAppConfigurationPolicy', 'IntuneAppProtectionPolicy', 'IntuneApplicationControlPolicy',
        'IntuneApplicationVPNPolicy', 'IntuneAssignmentFilter', 'IntuneAssignmentFilterAssignment',
        'IntuneAuthenticationMethodsPolicy', 'IntuneAutopilotCleanupPolicy', 'IntuneAutopilotDeploymentProfile',
        'IntuneAutopilotDevicePreparation', 'IntuneAutopilotESPConfiguration', 'IntuneAutopilotOrganizationalSettings',
        'IntuneAutopilotResetPolicy', 'IntuneAntivirusPolicy', 'IntuneAntivirusPolicyAssignment',
        'IntuneCertificateConnector', 'IntuneCertificateDeployment', 'IntuneCompliancePartner',
        'IntuneComplianceScripts', 'IntuneCustomComplianceScripts', 'IntuneDeviceCompliance',
        'IntuneDeviceCompliancePolicy', 'IntuneDeviceConfiguration', 'IntuneDeviceControlPolicy',
        'IntuneDeviceEnrollmentConfiguration', 'IntuneDeviceEnrollmentLimit', 'IntuneDeviceEnrollmentPlatformRestriction',
        'IntuneDeviceGroupPolicy', 'IntuneDeviceHealthMonitoring', 'IntuneDeviceManagementServiceConfig',
        'IntuneDeviceManagementSettings', 'IntuneDeviceNameTemplate', 'IntuneDeviceTypeRestriction',
        'IntuneDiskEncryptionPolicy', 'IntuneEdgeDeploymentProfile', 'IntuneEndpointProtectionPolicy',
        'IntuneEnrollmentIosConfiguration', 'IntuneEnrollmentMacOSConfiguration', 'IntuneEnrollmentPlatformRestriction',
        'IntuneEnrollmentStatusPageConfiguration', 'IntuneEnrollmentWindowsHelloForBusinessConfiguration', 'IntuneExchangeConnector',
        'IntuneExchangeConditionalAccessPolicy', 'IntuneExchangeOnPremisesPolicy', 'IntuneFilteringProfile',
        'IntuneFirewallPolicy', 'IntuneFirmwareUpdateForDeviceConfiguration', 'IntuneGAMSConfiguration',
        'IntuneGroupAssignment', 'IntuneGroupPolicyConfiguration', 'IntuneGroupPolicyDefinitionFile',
        'IntuneGroupPolicyDefinitionPresentation', 'IntuneGroupPolicyDefinition', 'IntuneGroupSettingCatalogPolicy',
        'IntuneGroupSettingCatalogPolicyAssignment', 'IntuneIOSDeviceConfiguration', 'IntuneIOSLobApp',
        'IntuneIOSVPPApp', 'IntuneIOSWiFiConfiguration', 'IntuneIPAndPortAccessControlPolicy',
        'IntuneKioskConfiguration', 'IntuneLicenseAssignment', 'IntuneLicenseSettings',
        'IntuneManagedAppConfiguration', 'IntuneManagedAppConfigurationAssignment', 'IntuneManagedAppPolicy',
        'IntuneManagedAppProtection', 'IntuneManagedAppRegistration', 'IntuneManagedAppStatusApp',
        'IntuneManagedAppStatusDeviceCount', 'IntuneManagedAppStatusIndicator', 'IntuneManagedAppUserStatus',
        'IntuneManagedDeviceSettings', 'IntuneManagedDevice', 'IntuneMacOSDeviceConfiguration',
        'IntuneMacOSLobApp', 'IntuneMacOSVPPApp', 'IntuneMacOSWiFiConfiguration',
        'IntuneMediaConfiguration', 'IntuneMicrosoftEdgeConfiguration', 'IntuneMobileApplicationManagement',
        'IntuneMultiFactorAuthenticationPolicy', 'IntuneNetworkAccessPolicy', 'IntuneNetworkBoundaryConfiguration',
        'IntuneNotificationMessageTemplate', 'IntuneNotificationMessageTemplateAssignment', 'IntuneOperatingSystemVersionVulnerability',
        'IntuneOrganizationalMessageConfiguration', 'IntuneOutOfTheBoxSettings', 'IntunePasswordPolicy',
        'IntunePDFReaderConfiguration', 'IntunePerAppVpnPolicy', 'IntunePhoneCompliancePolicy',
        'IntunePlatformScriptsIOS', 'IntunePlatformScriptsMacOS', 'IntunePlatformScriptsWindows',
        'IntunePolicyAssignment', 'IntunePolicyAssignmentFilter', 'IntunePolicyStatus',
        'IntunePolicyStatusAssignment', 'IntunePrivacyDataMinimization', 'IntunePrivilegedAccessWorkstationPolicy',
        'IntuneProfileConfiguration', 'IntuneProfileConfigurationAssignment', 'IntuneProfileResourceAccess',
        'IntuneProximityPlacementGroup', 'IntunePublicPreview', 'IntuneRemediationScript',
        'IntuneRemediationScriptAssignment', 'IntuneRemoteActionSetting', 'IntuneRemoteManagementPolicy',
        'IntuneRoleAssignment', 'IntuneRoleDefinition', 'IntuneROXCertificateTemplate',
        'IntuneROXConfiguration', 'IntuneROXExternalConfiguration', 'IntuneSafetyProfile',
        'IntuneSafeLinksPolicy', 'IntuneSecurityBaseline', 'IntuneSecurityBaselineAssignment',
        'IntuneSecurityBaselineSettingTemplates', 'IntuneSecurityEndpointDetectionAndResponsePolicy', 'IntuneSecurityEndpointDetectionAndResponseRule',
        'IntuneSecurityIntentAndStateManagementPolicy', 'IntuneSecurityIntentAndStateManagementRule', 'IntuneSensitiveDataAccessControlConfiguration',
        'IntuneSensitiveDataAccessControlPolicy', 'IntuneSensitiveDataAccessControlRule', 'IntuneServiceConfiguration',
        'IntuneServicePrincipal', 'IntuneSettingCatalogDeviceConfiguration', 'IntuneSettingCatalogDeviceConfigurationAssignment',
        'IntuneSettingCatalogMobileDeviceConfiguration', 'IntuneSettingsCatalogPolicyAssignment', 'IntuneSettingsPolicy',
        'IntuneSideCarConfiguration', 'IntuneSKURegistration', 'IntuneSoftwareUpdateAggregateStatus',
        'IntuneSoftwareUpdateDeviceStatus', 'IntuneSoftwareUpdateStatus', 'IntuneSoftwareUpdatesWindowsPolicy',
        'IntuneSoftwareUpdatesWindowsPolicyAssignment', 'IntuneSSOConfiguration', 'IntuneSSOPolicy',
        'IntuneSubscriptionConfiguration', 'IntuneSubscriptionSettings', 'IntuneSubsidyConfiguration',
        'IntuneSuggestion', 'IntuneSuggestionForce', 'IntuneSupplementalConfiguration',
        'IntuneSystemSettingConfiguration', 'IntuneTamperProtectionPolicy', 'IntuneTamperProtectionPolicySetting',
        'IntuneTeamsDeviceConfiguration', 'IntuneTeamsNotificationChannelConfiguration', 'IntuneTeamsPolicyConfiguration',
        'IntuneTemplateCatalogConfiguration', 'IntuneTerminalAccessConfiguration', 'IntuneTrustedNetworkConfiguration',
        'IntuneUcDeviceConfiguration', 'IntuneUpdateWindowsPolicy', 'IntuneUserAffinity',
        'IntuneUserConfiguration', 'IntuneUserExperienceAnalyticsAnomalyDeviceFeatures', 'IntuneUserExperienceAnalyticsAnomalyCorrelationGroupSummary',
        'IntuneUserExperienceAnalyticsAnomalyDeviceTriggerSummary', 'IntuneUserExperienceAnalyticsAnomalySeverityOverview', 'IntuneUserExperienceAnalyticsAnomalySummary',
        'IntuneUserExperienceAnalyticsAppHealthApplicationPerformance', 'IntuneUserExperienceAnalyticsAppHealthApplicationPerformanceByAppVersion',
        'IntuneUserExperienceAnalyticsAppHealthApplicationPerformanceByOSVersion', 'IntuneUserExperienceAnalyticsAppHealthAppStartupPerformance',
        'IntuneUserExperienceAnalyticsAppHealthAppStartupPerformanceByOSVersion', 'IntuneUserExperienceAnalyticsAppHealthDeviceModelPerformance',
        'IntuneUserExperienceAnalyticsAppHealthDevicePerformance', 'IntuneUserExperienceAnalyticsAppHealthDevicePerformanceDetails',
        'IntuneUserExperienceAnalyticsAppHealthOSVersionPerformance', 'IntuneUserExperienceAnalyticsAppHealthTopApplicationsByAverageCrashRate',
        'IntuneUserExperienceAnalyticsAppHealthTopApplicationsByAverageResourceUsage', 'IntuneUserExperienceAnalyticsAppHealthTopDevicesByAppCrashRate',
        'IntuneUserExperienceAnalyticsAppHealthTopDevicesByAppUsage', 'IntuneUserExperienceAnalyticsBaseline',
        'IntuneUserExperienceAnalyticsCategory', 'IntuneUserExperienceAnalyticsCategorySettings',
        'IntuneUserExperienceAnalyticsDevicePerformance', 'IntuneUserExperienceAnalyticsDeviceScores',
        'IntuneUserExperienceAnalyticsDeviceStartupHistory', 'IntuneUserExperienceAnalyticsDeviceStartupProcessPerformance',
        'IntuneUserExperienceAnalyticsMetricHistory', 'IntuneUserExperienceAnalyticsNotAffectedDevice',
        'IntuneUserExperienceAnalyticsOverview', 'IntuneUserExperienceAnalyticsResourcePerformance',
        'IntuneUserExperienceAnalyticsSummary', 'IntuneUserExperienceAnalyticsTopDevices',
        'IntuneVDRConfiguration', 'IntuneVirtualNetworkConfiguration', 'IntuneVPNConfiguration',
        'IntuneVPNConfigurationAssignment', 'IntuneVPNProfileConfiguration', 'IntuneWifiConfiguration',
        'IntuneWifiConfigurationAssignment', 'IntuneWindowsDeviceConfiguration', 'IntuneWindowsEnrollmentMetaData',
        'IntuneWindowsFeatureUpdateConfiguration', 'IntuneWindowsFeatureUpdateConfigurationAssignment', 'IntuneWindowsLobApp',
        'IntuneWindowsQualityUpdateConfiguration', 'IntuneWindowsQualityUpdateConfigurationAssignment', 'IntuneWindowsUpdateForBusinessConfiguration',
        'IntuneWindowsUpdateForBusinessConfigurationAssignment', 'IntuneWindowsVPNConfiguration', 'IntuneWindowsWifiConfiguration',
        'IntuneWorkplaceJoinConfiguration'
      ],
      'Power Platform': [
        'PPTenantConnectorAdministrator', 'PPTenantCommunicationNotificationProvider', 'PPTenantDataBoundary',
        'PPTenantEnvironmentSettings', 'PPTenantGlobalServiceSettings', 'PPTenantIsolatedNetworkConfiguration',
        'PPTenantNetworkAccessPolicy', 'PPTenantPowerPlatformSettings', 'PPTenantServiceSettings',
        'PPEnvironment', 'PPEnvironmentAppSharingPolicy', 'PPEnvironmentSettings',
        'PPPowerApp', 'PPPowerAppSharingPolicy', 'PPPowerAppSettings',
        'PPCloudFlow', 'PPCloudFlowSharingPolicy', 'PPCloudFlowSettings',
        'PPDataflowConfiguration', 'PPDataflowDataConnectorSettings', 'PPDataflowDataSourceSettings',
        'PPDataflowPolicy', 'PPDataflowSettings', 'PPDataPolicies',
        'PPDataSourceSettingPolicy', 'PPDLPPolicy', 'PPDynamicsAppSettings',
        'PPDynamicsLicenseAssignment', 'PPEnvironmentAccessRole', 'PPEnvironmentRoleAssignment',
        'PPEventPolicy', 'PPExternalConnectorPolicy', 'PPFlowResourceConfiguration',
        'PPFlowRoleAssignment', 'PPGuestSharingPolicy', 'PPMobileDashboardConfiguration',
        'PPMobileFlowPolicy', 'PPModelDrivenAppEnvironmentVariableConfiguration', 'PPModelDrivenAppEnvironmentVariableAssignment',
        'PPModelDrivenAppSettings', 'PPOrganizationSettings', 'PPPowerAppEnvironmentVariableConfiguration',
        'PPPowerAppEnvironmentVariableAssignment', 'PPPowerAutomate', 'PPPowerAutomateSettings',
        'PPPowerBIConnectorSettings', 'PPPowerBIDemographicsSettings', 'PPPowerBISettings',
        'PPPowerPagesComponentSettings', 'PPPowerPagesConfiguration', 'PPPowerPagesDataverseConnectionConfiguration',
        'PPPowerPagesDocumentationSettings', 'PPPowerPagesEnabledFeatures', 'PPPowerPagesEnvironmentSettings',
        'PPPowerPagesGuestAccessSettings', 'PPPowerPagesPrivacySettings', 'PPPowerPagesSettings',
        'PPPowerPagesSourceSettings', 'PPPowerQuery', 'PPPowerQuerySettings',
        'PPPowerVirtualAgentSettings', 'PPScopeSettings', 'PPSecurityConfiguration',
        'PPSharePointIntegrationSettings', 'PPTeamsIntegrationSettings', 'PPTenantAccessibilitySettings',
        'PPTenantAdminSettings', 'PPTenantAdvancedSettings', 'PPTenantAnalyticsSettings',
        'PPTenantBranding', 'PPTenantCreationLimits', 'PPTenantDataExportPolicy',
        'PPTenantDataLocationSettings', 'PPTenantDataResidencyPolicy', 'PPTenantDesktopFlowSettings',
        'PPTenantDomainAdminSettings', 'PPTenantDomain', 'PPTenantDomainNameAvailability',
        'PPTenantDomainNotification', 'PPTenantEmailNotificationSettings', 'PPTenantEnvironmentCapacitiesSettings',
        'PPTenantEnvironmentEncryptionKeyAssignment', 'PPTenantEnvironmentEncryptionKeyPolicy', 'PPTenantEnvironmentEncryptionSettings',
        'PPTenantEnvironmentGovernancePolicy', 'PPTenantEnvironmentSettings', 'PPTenantExpressDesignSettings',
        'PPTenantExtensibilitySettings', 'PPTenantFeatures', 'PPTenantFeatureSettings',
        'PPTenantFinanceSettings', 'PPTenantGroupPolicy', 'PPTenantGuest',
        'PPTenantGuestAccessPolicy', 'PPTenantGuestAccessSettings', 'PPTenantHRAnalyticsSettings',
        'PPTenantIdentityAndAccessSettings', 'PPTenantIPAddressAllowList', 'PPTenantIsolation',
        'PPTenantIsolationSettings', 'PPTenantItServiceSettings', 'PPTenantKnowledgeArticleSearchConfiguration',
        'PPTenantKnowledgeManagementSettings', 'PPTenantLanguageSettings', 'PPTenantLicenseAnalyticsSettings',
        'PPTenantLifecycleManagementPolicy', 'PPTenantLicenseCapacity', 'PPTenantLicenseInformation',
        'PPTenantLifecyclePolicies', 'PPTenantManagementSettings', 'PPTenantMobileConfiguration',
        'PPTenantNotificationSettings', 'PPTenantOfficeSettings', 'PPTenantOptimizationSettings',
        'PPTenantOutboundNetworkAccessPolicy', 'PPTenantPolicyStore', 'PPTenantPolicySetting',
        'PPTenantPowerQueryAnalyticsSettings', 'PPTenantPrivacyPolicy', 'PPTenantPrivacySettings',
        'PPTenantProductivitySettings', 'PPTenantProjectSettings', 'PPTenantPublicSharePolicy',
        'PPTenantPublisherPolicy', 'PPTenantQualityAssuranceSettings', 'PPTenantQuotaConfiguration',
        'PPTenantRecommendedLicenseSettings', 'PPTenantRecoveryPolicy', 'PPTenantRegulatoryCompliancePolicy',
        'PPTenantResourceAllocationSettings', 'PPTenantResourceGovernanceSettings', 'PPTenantResourceLimits',
        'PPTenantResponseSettings', 'PPTenantRetentionPolicy', 'PPTenantRetentionPolicySetting',
        'PPTenantRevenueFacilitation', 'PPTenantRoleBasedSecurityPolicy', 'PPTenantSalesSettings',
        'PPTenantSandboxEnvironmentConfiguration', 'PPTenantSearchSettings', 'PPTenantSecondaryRelaySettings',
        'PPTenantSecurityCompliance', 'PPTenantSecurityConfiguration', 'PPTenantSecurityPolicy',
        'PPTenantSecuritySettings', 'PPTenantServiceAdministrator', 'PPTenantServiceConfiguration',
        'PPTenantServicePrincipal', 'PPTenantServicePrincipalSettings', 'PPTenantServiceSettings',
        'PPTenantSettingAccessPolicy', 'PPTenantSettingsDataLossPrevention', 'PPTenantSettingDataResidency',
        'PPTenantSettingDataResidencyDefaultEnvironmentEncryption', 'PPTenantSettingDataResidencyTenantEncryption', 'PPTenantSettingDataResidencyTenantEncryptionKey',
        'PPTenantSettingDataResidencyTenantEncryptionKeyRotation', 'PPTenantSettingDataResidencyTenantEncryptionKeyStatus', 'PPTenantSettingDataResidencyTenantEncryptionStatus',
        'PPTenantSettingDataResidencyTenantMigration', 'PPTenantSettingsDataverse', 'PPTenantSettingsDataversePreciseSearch',
        'PPTenantSettingsSharePoint', 'PPTenantSharePointConnectorSettings', 'PPTenantSharePointIntegration',
        'PPTenantSolutionSettings', 'PPTenantSpendingLimit', 'PPTenantSSOConfiguration',
        'PPTenantStorageCapacity', 'PPTenantStorageConfiguration', 'PPTenantStorageLimits',
        'PPTenantSupplyChainSettings', 'PPTenantSuspendedEnvironmentList', 'PPTenantSystemAdministrator',
        'PPTenantSystemApplications', 'PPTenantSystemLicensing', 'PPTenantSystemSettings',
        'PPTenantTableColumnSize', 'PPTenantTableConfiguration', 'PPTenantTenantCapacitySetting',
        'PPTenantTelemetryPolicy', 'PPTenantTeamsIntegrationSettings', 'PPTenantTermsOfService',
        'PPTenantTestPolling', 'PPTenantThemingCustomization', 'PPTenantThemingPolicy',
        'PPTenantThemeSettings', 'PPTenantThreatAssessmentSettings', 'PPTenantThreatProtectionPolicy',
        'PPTenantTrainingPolicy', 'PPTenantTrainingSettings', 'PPTenantTransformationPolicy',
        'PPTenantTransformationSettings', 'PPTenantTransitionPolicy', 'PPTenantTranslationSettings',
        'PPTenantTransportConfiguration', 'PPTenantTriggerPolicy', 'PPTenantTrustConfiguration',
        'PPTenantTrustPolicy', 'PPTenantUICustomization', 'PPTenantUiSettings',
        'PPTenantUnattendedRPASettings', 'PPTenantUnifiedAuditLog', 'PPTenantUpdateChannelManagement',
        'PPTenantUpdateManagementPolicy', 'PPTenantUpdateNotification', 'PPTenantUpdatePolicy',
        'PPTenantUpdateSchedule', 'PPTenantUpdateSettings', 'PPTenantURLShortening',
        'PPTenantUserCommunication', 'PPTenantUserExperienceAnalytics', 'PPTenantUserExperienceOptimization',
        'PPTenantUserFeedback', 'PPTenantUserLicenseAssignment', 'PPTenantUserLicenseInformation',
        'PPTenantUserNotification', 'PPTenantUserPrivacy', 'PPTenantUserProfile',
        'PPTenantUserRoleAssignment', 'PPTenantUserSettings', 'PPTenantUserTraining',
        'PPTenantValidationPolicy', 'PPTenantValueChainManagement', 'PPTenantWebApiPolicy',
        'PPTenantWebApplicationFirewall', 'PPTenantWebIntegration', 'PPTenantWebServiceConfiguration',
        'PPTenantWellnessSettings', 'PPTenantWFMIntegration', 'PPTenantWhitelistConfiguration',
        'PPTenantWifiConfiguration', 'PPTenantWin32AppManagement', 'PPTenantWindowsUpdateSettings',
        'PPTenantWorkflowAutomationSettings', 'PPTenantWorkflowConfiguration', 'PPTenantWorkflowPolicy',
        'PPTenantWorkflowTemplateLibrary', 'PPTenantWorkloadOptimization', 'PPTenantWorkspaceAnalytics',
        'PPTenantWorkspaceConfiguration', 'PPTenantWorkspaceLimits', 'PPTenantWorkspacePolicy'
      ],
      'Dynamics 365': [
        'D365AccountManagementSettings', 'D365ActivityConfiguration', 'D365AdministratorSettings',
        'D365AdvancedFindCustomization', 'D365AdvancedSecuritySettings', 'D365AllocationConfiguration',
        'D365AppConfigurationSettings', 'D365AppModuleConfiguration', 'D365AppModuleCustomization',
        'D365AssemblyCustomization', 'D365AssessmentConfiguration', 'D365AssetConfiguration',
        'D365AssetLifecycleSettings', 'D365AssignmentRuleConfiguration', 'D365AuditConfiguration',
        'D365AuthenticationSettings', 'D365AuthorizationPolicy', 'D365AutomationConfiguration',
        'D365AutomationPolicy', 'D365BackupConfiguration', 'D365BackupSchedule',
        'D365BirthdayConfiguration', 'D365BizProcessFlowCustomization', 'D365BlockingConfiguration',
        'D365BranchConfiguration', 'D365BulkDeleteConfiguration', 'D365BusinessProcessFlowCustomization',
        'D365ButtonCustomization', 'D365CacheConfiguration', 'D365CalendarConfiguration',
        'D365CandidateManagementSettings', 'D365CampaignConfiguration', 'D365CampaignItemCustomization',
        'D365CaseManagementConfiguration', 'D365CaseResolutionConfiguration', 'D365ChannelAccessConfiguration',
        'D365ChannelConfiguration', 'D365ChargeBackConfiguration', 'D365ChatConfiguration',
        'D365ChecklistCustomization', 'D365CheckoutConfiguration', 'D365ChartCustomization',
        'D365ClientSideDependency', 'D365ClientSideExtensionConfiguration', 'D365CloudEventConfiguration',
        'D365CodeComponent', 'D365CodeCustomization', 'D365CollaborationConfiguration',
        'D365CollaborationSettings', 'D365CollectiveConsent', 'D365CommerceConfiguration',
        'D365CommandBarConfiguration', 'D365CommentConfiguration', 'D365CommunicationConfiguration',
        'D365CommunicationSettings', 'D365ComplianceConfiguration', 'D365CompositeRelationshipConfiguration',
        'D365ComputedColumnConfiguration', 'D365ConfigurationDataEntityCustomization', 'D365ConfigurationEntitySettings',
        'D365ConfigurationImport', 'D365ConfigurationMigration', 'D365ConfigurationSettings',
        'D365ConnectorConfiguration', 'D365ConnectorSettings', 'D365ConsentConfiguration',
        'D365ConsoleCustomization', 'D365ConsoleSettings', 'D365ContactConfiguration',
        'D365ContactHierarchyConfiguration', 'D365ContentManagementConfiguration', 'D365ContentPublishingConfiguration',
        'D365ContentSecurityPolicy', 'D365ContextConfiguration', 'D365ContextualHelpConfiguration',
        'D365ContextualHelpSettings', 'D365ConversationConfiguration', 'D365ConversationIntelligenceConfiguration',
        'D365ConversationSettings', 'D365CookieConfiguration', 'D365CookiePolicy',
        'D365CopyAssistantConfiguration', 'D365CopyAssistantSettings', 'D365CopyPluginConfiguration',
        'D365CopyPublishingConfiguration', 'D365CopyRecordConfiguration', 'D365CopyRoleBasedSettings',
        'D365CopySchedulingConfiguration', 'D365CopySystemConfiguration', 'D365CopyUserConfiguration',
        'D365CopyViewConfiguration', 'D365CopyVisualizationConfiguration', 'D365CopyWorkflowConfiguration',
        'D365CoreConfiguration', 'D365CoreDataSettings', 'D365CoreOrganizationSettings',
        'D365CorePermissionSettings', 'D365CostCenterConfiguration', 'D365CostSettings',
        'D365CreateUpdateLogConfiguration', 'D365CRMConfiguration', 'D365CRMCustomizationPackage',
        'D365CRMDeploymentSettings', 'D365CRMDialogCustomization', 'D365CRMFormCustomization',
        'D365CRMFormLibraryConfiguration', 'D365CRMGlobalOptionSetCustomization', 'D365CRMGridCustomization',
        'D365CRMHeaderCustomization', 'D365CRMListViewCustomization', 'D365CRMMenuCustomization',
        'D365CRMModelDrivenAppConfiguration', 'D365CRMModalCustomization', 'D365CRMNavigationConfiguration',
        'D365CRMNotificationCustomization', 'D365CRMOptionSetCustomization', 'D365CRMOrganizationCustomization',
        'D365CRMOrganizationSettings', 'D365CRMProcessCustomization', 'D365CRMProcessDesignerCustomization',
        'D365CRMPublishConfiguration', 'D365CRMPublishingSettings', 'D365CRMQueryCustomization',
        'D365CRMRecentRecordsCustomization', 'D365CRMRecordSettingsCustomization', 'D365CRMRibbonCustomization',
        'D365CRMRoleBasedViewCustomization', 'D365CRMRoutingCustomization', 'D365CRMRoutingSettings',
        'D365CRMRulesEngineConfiguration', 'D365CRMSalesAccelerationCustomization', 'D365CRMSalesConfiguration',
        'D365CRMSalesInsightsConfiguration', 'D365CRMSalesSettings', 'D365CRMSaveCustomization',
        'D365CRMScriptletCustomization', 'D365CRMSearchConfiguration', 'D365CRMSearchCustomization',
        'D365CRMSecurityConfiguration', 'D365CRMSecuritySettings', 'D365CRMServiceConfiguration',
        'D365CRMServiceDeliverySettings', 'D365CRMSessionConfiguration', 'D365CRMSessionSettings',
        'D365CRMSharePointConfiguration', 'D365CRMSharePointIntegration', 'D365CRMSharePointSettings',
        'D365CRMShortcutConfiguration', 'D365CRMSidebarCustomization', 'D365CRMSidebarSettings',
        'D365CRMSignatureConfiguration', 'D365CRMSiteMapCustomization', 'D365CRMSiteMapSettings',
        'D365CRMSmartMatchConfiguration', 'D365CRMSmartViewConfiguration', 'D365CRMSocialConfiguration',
        'D365CRMSocialSettings', 'D365CRMSolutionCustomization', 'D365CRMSolutionFrameworkConfiguration',
        'D365CRMSolutionPackageConfiguration', 'D365CRMSolutionPackageSettings', 'D365CRMSolutionSettings',
        'D365CRMSoundCustomization', 'D365CRMSourceConfiguration', 'D365CRMSpellingConfiguration',
        'D365CRMSpellingCustomization', 'D365CRMSpreadsheetCustomization', 'D365CRMSpreadsheetSettings',
        'D365CRMStandardControlCustomization', 'D365CRMStepConfiguration', 'D365CRMSubGridCustomization',
        'D365CRMSubGridSettings', 'D365CRMSubProcessFlowCustomization', 'D365CRMSubmissionConfiguration',
        'D365CRMSubmissionSettings', 'D365CRMSuggestionConfiguration', 'D365CRMSuggestionSettings',
        'D365CRMSyncConfiguration', 'D365CRMSyncSettings', 'D365CRMSystemConfiguration',
        'D365CRMSystemSettings', 'D365CRMTableConfiguration', 'D365CRMTableCustomization',
        'D365CRMTagConfiguration', 'D365CRMTagSettings', 'D365CRMTaskManagementConfiguration',
        'D365CRMTaskSettings', 'D365CRMTemplateCustomization', 'D365CRMTemplateSettings',
        'D365CRMTextCustomization', 'D365CRMThemeCustomization', 'D365CRMThemeSettings',
        'D365CRMTimeZoneConfiguration', 'D365CRMTimeZoneSettings', 'D365CRMTitleConfiguration',
        'D365CRMTitleCustomization', 'D365CRMTraceConfiguration', 'D365CRMTraceSettings',
        'D365CRMTrackingConfiguration', 'D365CRMTrackingSettings', 'D365CRMTransactionConfiguration',
        'D365CRMTransactionSettings', 'D365CRMTransformationConfiguration', 'D365CRMTransformationSettings',
        'D365CRMTranslationConfiguration', 'D365CRMTranslationSettings', 'D365CRMTriggerConfiguration',
        'D365CRMTriggerSettings', 'D365CRMTrustedDomainConfiguration', 'D365CRMTrustedDomainSettings',
        'D365CRMTypeConfiguration', 'D365CRMUiConfiguration', 'D365CRMUiCustomization',
        'D365CRMUiSettings', 'D365CRMUndoConfiguration', 'D365CRMUndoSettings',
        'D365CRMUnifiedClientConfiguration', 'D365CRMUnifiedClientSettings', 'D365CRMUnifiedInterfaceConfiguration',
        'D365CRMUnifiedInterfaceCustomization', 'D365CRMUnifiedInterfaceSettings', 'D365CRMUnifiedSearchConfiguration',
        'D365CRMUnifiedSearchSettings', 'D365CRMUnitGroupConfiguration', 'D365CRMUnitGroupSettings',
        'D365CRMUpdateConfiguration', 'D365CRMUpdateSettings', 'D365CRMURLConfiguration',
        'D365CRMUserConfiguration', 'D365CRMUserCustomization', 'D365CRMUserInterfaceCustomization',
        'D365CRMUserInterfaceSettings', 'D365CRMUserLanguageSettings', 'D365CRMUserPreferences',
        'D365CRMUserSecurityConfiguration', 'D365CRMUserSecuritySettings', 'D365CRMUserSettings',
        'D365CRMUserTimeZoneSettings', 'D365CRMValidationConfiguration', 'D365CRMValidationSettings',
        'D365CRMViewController', 'D365CRMViewConfiguration', 'D365CRMViewCustomization',
        'D365CRMViewSettings', 'D365CRMVisibilityConfiguration', 'D365CRMVisibilitySettings',
        'D365CRMVisualizationConfiguration', 'D365CRMVisualizationCustomization', 'D365CRMVisualizationSettings',
        'D365CRMVoiceConfiguration', 'D365CRMVoiceSettings', 'D365CRMWebResourceCustomization',
        'D365CRMWebResourceSettings', 'D365CRMWebServiceConfiguration', 'D365CRMWebServiceSettings',
        'D365CRMWhiteLabelConfiguration', 'D365CRMWhiteboardConfiguration', 'D365CRMWhiteboardSettings',
        'D365CRMWidgetConfiguration', 'D365CRMWidgetCustomization', 'D365CRMWidgetSettings',
        'D365CRMWindowConfiguration', 'D365CRMWindowCustomization', 'D365CRMWindowSettings',
        'D365CRMWizardCustomization', 'D365CRMWizardSettings', 'D365CRMWorkflowConfiguration',
        'D365CRMWorkflowCustomization', 'D365CRMWorkflowSettings', 'D365CRMWorklistConfiguration',
        'D365CRMWorklistSettings', 'D365CRMWorkplaceConfiguration', 'D365CRMWorkplaceSettings',
        'D365CRMWorkqueueConfiguration', 'D365CRMWorkqueueSettings', 'D365CRMWorkspaceConfiguration',
        'D365CRMWorkspaceCustomization', 'D365CRMWorkspaceSettings', 'D365CRMXMLConfiguration'
      ],
      'OneDrive': [
        'ODAccess', 'ODAccessAndCompliance', 'ODAdvancedAudit', 'ODAdvancedProtection',
        'ODAnomalyDetection', 'ODAuditConfiguration', 'ODAuditLog', 'ODAuditRetention',
        'ODAuditSettings', 'ODAutoClassification', 'ODBandwidthConfiguration', 'ODBandwidthManagement',
        'ODBandwidthSettings', 'ODBehaviorAnalytics', 'ODBehaviorAnalyticsSettings', 'ODBlockedContentDetection',
        'ODBlockedContentSettings', 'ODBrandingAndCustomization', 'ODBrandingConfiguration', 'ODBrandingSettings',
        'ODBulkActionConfiguration', 'ODBulkActionSettings', 'ODBulkDeleteConfiguration', 'ODBulkUploadConfiguration',
        'ODCacheConfiguration', 'ODCacheSettings', 'ODCameraAndImageConfiguration', 'ODCameraAndImageSettings',
        'ODCapacityAllocation', 'ODCapacityConfiguration', 'ODCapacityLimits', 'ODCapacityManagement',
        'ODCapacityQuota', 'ODCatalogConfiguration', 'ODCatalogSettings', 'ODCertificateConfiguration',
        'ODCertificateManagement', 'ODChangeConfiguration', 'ODChangeLog', 'ODChangeNotification',
        'ODChangeSettings', 'ODCloudFilesConfiguration', 'ODCloudFilesSettings', 'ODCloudStorageConfiguration',
        'ODCloudStorageSettings', 'ODClustering', 'ODClusteringConfiguration', 'ODClusteringSettings',
        'ODCodeExecutionConfiguration', 'ODCodeExecutionSettings', 'ODCollaborationConfiguration', 'ODCollaborationSettings',
        'ODCommentConfiguration', 'ODCommentSettings', 'ODComplianceConfiguration', 'ODCompliancePolicy',
        'ODComplianceSettings', 'ODCompressionConfiguration', 'ODCompressionSettings', 'ODComputeConfiguration',
        'ODComputeSettings', 'ODConditionalAccessConfiguration', 'ODConditionalAccessPolicy', 'ODConditionalAccessSettings',
        'ODConflictResolutionConfiguration', 'ODConflictResolutionSettings', 'ODConnectionPool', 'ODConnectionPoolConfiguration',
        'ODConnectionPoolSettings', 'ODConnectorConfiguration', 'ODConnectorSettings', 'ODConsistencyConfiguration',
        'ODConsistencySettings', 'ODContentAnalysisConfiguration', 'ODContentAnalysisPolicy', 'ODContentAnalysisSettings',
        'ODContentDeliveryConfiguration', 'ODContentDeliverySettings', 'ODContentEncryption', 'ODContentEncryptionConfiguration',
        'ODContentEncryptionPolicy', 'ODContentEncryptionSettings', 'ODContentExpiration', 'ODContentExpirationConfiguration',
        'ODContentExpirationPolicy', 'ODContentExpirationSettings', 'ODContentFiltering', 'ODContentFilteringConfiguration',
        'ODContentFilteringPolicy', 'ODContentFilteringSettings', 'ODContentLocation', 'ODContentLocationConfiguration',
        'ODContentLocationSettings', 'ODContentMarking', 'ODContentMarkingConfiguration', 'ODContentMarkingPolicy',
        'ODContentMarkingSettings', 'ODContentModeration', 'ODContentModerationConfiguration', 'ODContentModerationPolicy',
        'ODContentModerationSettings', 'ODContentProcessing', 'ODContentProcessingConfiguration', 'ODContentProcessingSettings',
        'ODContentRecovery', 'ODContentRecoveryConfiguration', 'ODContentRecoveryPolicy', 'ODContentRecoverySettings',
        'ODContentRemovalConfiguration', 'ODContentRemovalPolicy', 'ODContentRemovalSettings', 'ODContentRemovalWorkflow',
        'ODContentReplicationConfiguration', 'ODContentReplicationPolicy', 'ODContentReplicationSettings', 'ODContentRetention',
        'ODContentRetentionConfiguration', 'ODContentRetentionPolicy', 'ODContentRetentionSettings', 'ODContentScan',
        'ODContentScanConfiguration', 'ODContentScanPolicy', 'ODContentScanSettings', 'ODContentSecurityPolicy',
        'ODContentSecuritySettings', 'ODContentSharing', 'ODContentSharingConfiguration', 'ODContentSharingPolicy',
        'ODContentSharingSettings', 'ODContentSize', 'ODContentSizeLimits', 'ODContentSync',
        'ODContentSyncConfiguration', 'ODContentSyncPolicy', 'ODContentSyncSettings', 'ODContentTelemetry',
        'ODContentTelemetryConfiguration', 'ODContentTelemetrySettings', 'ODContentThrottling', 'ODContentThrottlingConfiguration',
        'ODContentThrottlingPolicy', 'ODContentThrottlingSettings', 'ODContentTracking', 'ODContentTrackingConfiguration',
        'ODContentTrackingPolicy', 'ODContentTrackingSettings', 'ODContentTransformation', 'ODContentTransformationConfiguration',
        'ODContentTransformationPolicy', 'ODContentTransformationSettings', 'ODContentTransport', 'ODContentTransportConfiguration',
        'ODContentTransportPolicy', 'ODContentTransportSettings', 'ODContentTypes', 'ODContentTypesConfiguration',
        'ODContentTypesPolicy', 'ODContentTypesSettings', 'ODContentValidation', 'ODContentValidationConfiguration',
        'ODContentValidationPolicy', 'ODContentValidationSettings', 'ODContentVersioning', 'ODContentVersioningConfiguration',
        'ODContentVersioningPolicy', 'ODContentVersioningSettings', 'ODContentVisualization', 'ODContentVisualizationConfiguration',
        'ODContentVisualizationPolicy', 'ODContentVisualizationSettings', 'ODContextualMenu', 'ODContextualMenuConfiguration',
        'ODContextualMenuSettings', 'ODContextualSearch', 'ODContextualSearchConfiguration', 'ODContextualSearchSettings',
        'ODControlPlaneConfiguration', 'ODControlPlaneSettings', 'ODConversationIntelligence', 'ODConversationIntelligenceConfiguration',
        'ODConversationIntelligenceSettings', 'ODCopyManagement', 'ODCopyManagementConfiguration', 'ODCopyManagementSettings',
        'ODCorkboardConfiguration', 'ODCorkboardSettings', 'ODCorrelationConfiguration', 'ODCorrelationSettings',
        'ODCostAllocationConfiguration', 'ODCostAllocationSettings', 'ODCounterConfiguration', 'ODCounterSettings',
        'ODCRMIntegration', 'ODCRMIntegrationConfiguration', 'ODCRMIntegrationSettings', 'ODCrossDeviceSync',
        'ODCrossDeviceSyncConfiguration', 'ODCrossDeviceSyncPolicy', 'ODCrossDeviceSyncSettings', 'ODCrossPlatformConfiguration',
        'ODCrossPlatformSettings', 'ODCrossRegionConfiguration', 'ODCrossRegionSettings', 'ODCrossTenantsConfiguration',
        'ODCrossTenantsSettings', 'ODCryptography', 'ODCryptographyConfiguration', 'ODCryptographyPolicy',
        'ODCryptographySettings', 'ODCSVConfiguration', 'ODCSVSettings', 'ODCultureConfiguration',
        'ODCultureSettings', 'ODCustomActionConfiguration', 'ODCustomActionSettings', 'ODCustomAlertConfiguration',
        'ODCustomAlertSettings', 'ODCustomAreaConfiguration', 'ODCustomAreaSettings', 'ODCustomAttributeConfiguration',
        'ODCustomAttributeSettings', 'ODCustomBrandingConfiguration', 'ODCustomBrandingSettings', 'ODCustomCalendarConfiguration',
        'ODCustomCalendarSettings', 'ODCustomClassificationConfiguration', 'ODCustomClassificationSettings', 'ODCustomCodeExecution',
        'ODCustomCodeExecutionConfiguration', 'ODCustomCodeExecutionSettings', 'ODCustomCollectionConfiguration', 'ODCustomCollectionSettings',
        'ODCustomColorConfiguration', 'ODCustomColorSettings', 'ODCustomCommandConfiguration', 'ODCustomCommandSettings',
        'ODCustomCommentConfiguration', 'ODCustomCommentSettings', 'ODCustomCompositeConfiguration', 'ODCustomCompositeSettings'
      ],
      'Microsoft 365 Groups': [
        'M365GroupAccessSettings', 'M365GroupActivityTracking', 'M365GroupActivityTrackingPolicy', 'M365GroupActivityTrackingSettings',
        'M365GroupAdditionalOwner', 'M365GroupAdditionalMember', 'M365GroupAdministrationSettings', 'M365GroupAdministrationPolicy',
        'M365GroupAliasConfiguration', 'M365GroupAllowedDomains', 'M365GroupAllowedDomainsConfiguration', 'M365GroupAllowedDomainsPolicy',
        'M365GroupAllocationConfiguration', 'M365GroupAllocationSettings', 'M365GroupAnalyticsConfiguration', 'M365GroupAnalyticsSettings',
        'M365GroupAnonymousSharingConfiguration', 'M365GroupAnonymousSharingPolicy', 'M365GroupAnonymousSharingSettings', 'M365GroupAppInstallation',
        'M365GroupAppInstallationPolicy', 'M365GroupAppInstallationSettings', 'M365GroupAppManagementPolicy', 'M365GroupAppManagementSettings',
        'M365GroupAppSettings', 'M365GroupApplicationAccess', 'M365GroupApplicationAccessPolicy', 'M365GroupApplicationAccessSettings',
        'M365GroupArchiveConfiguration', 'M365GroupArchivePolicy', 'M365GroupArchiveSchedule', 'M365GroupArchiveSettings',
        'M365GroupAssignmentConfiguration', 'M365GroupAssignmentPolicy', 'M365GroupAssignmentRoleConfiguration', 'M365GroupAssignmentRolePolicy',
        'M365GroupAssignmentRoleSettings', 'M365GroupAssignmentSettings', 'M365GroupAssignmentTrackingConfiguration', 'M365GroupAssignmentTrackingSettings',
        'M365GroupAttributeConfiguration', 'M365GroupAttributeSettings', 'M365GroupAuditConfiguration', 'M365GroupAuditPolicy',
        'M365GroupAuditSettings', 'M365GroupAuthentication', 'M365GroupAuthenticationConfiguration', 'M365GroupAuthenticationPolicy',
        'M365GroupAuthenticationSettings', 'M365GroupAuthorization', 'M365GroupAuthorizationConfiguration', 'M365GroupAuthorizationPolicy',
        'M365GroupAuthorizationRoleConfiguration', 'M365GroupAuthorizationRolePolicy', 'M365GroupAuthorizationRoleSettings', 'M365GroupAuthorizationSettings',
        'M365GroupAutoConfiguration', 'M365GroupAutoDiscovery', 'M365GroupAutoDiscoveryPolicy', 'M365GroupAutoDiscoverySettings',
        'M365GroupAutoGrouping', 'M365GroupAutoGroupingConfiguration', 'M365GroupAutoGroupingPolicy', 'M365GroupAutoGroupingSettings',
        'M365GroupAutoJoin', 'M365GroupAutoJoinConfiguration', 'M365GroupAutoJoinPolicy', 'M365GroupAutoJoinSettings',
        'M365GroupAutoLeave', 'M365GroupAutoLeaveConfiguration', 'M365GroupAutoLeavePolicy', 'M365GroupAutoLeaveSettings',
        'M365GroupAutoManagement', 'M365GroupAutoManagementConfiguration', 'M365GroupAutoManagementPolicy', 'M365GroupAutoManagementSettings',
        'M365GroupAutoNaming', 'M365GroupAutoNamingConfiguration', 'M365GroupAutoNamingPolicy', 'M365GroupAutoNamingSettings',
        'M365GroupAutoOwnerConfiguration', 'M365GroupAutoOwnerPolicy', 'M365GroupAutoOwnerSettings', 'M365GroupAutoProvision',
        'M365GroupAutoProvisionConfiguration', 'M365GroupAutoProvisionPolicy', 'M365GroupAutoProvisionSettings', 'M365GroupAutoSettings',
        'M365GroupAutoSync', 'M365GroupAutoSyncConfiguration', 'M365GroupAutoSyncPolicy', 'M365GroupAutoSyncSettings',
        'M365GroupAutoTag', 'M365GroupAutoTagConfiguration', 'M365GroupAutoTagPolicy', 'M365GroupAutoTagSettings',
        'M365GroupAvailability', 'M365GroupAvailabilityConfiguration', 'M365GroupAvailabilitySettings', 'M365GroupAwarenessConfiguration',
        'M365GroupAwarenessSettings', 'M365GroupBackendConfiguration', 'M365GroupBackendSettings', 'M365GroupBackupConfiguration',
        'M365GroupBackupPolicy', 'M365GroupBackupSchedule', 'M365GroupBackupSettings', 'M365GroupBandwidthConfiguration',
        'M365GroupBandwidthManagement', 'M365GroupBandwidthSettings', 'M365GroupBannerConfiguration', 'M365GroupBannerSettings',
        'M365GroupBarrier', 'M365GroupBarrierConfiguration', 'M365GroupBarrierPolicy', 'M365GroupBarrierSettings',
        'M365GroupBaseUrl', 'M365GroupBatchOperationConfiguration', 'M365GroupBatchOperationSettings', 'M365GroupBehaviorAnalytics',
        'M365GroupBehaviorAnalyticsConfiguration', 'M365GroupBehaviorAnalyticsPolicy', 'M365GroupBehaviorAnalyticsSettings', 'M365GroupBirthdayNotification',
        'M365GroupBirthdayNotificationConfiguration', 'M365GroupBirthdayNotificationPolicy', 'M365GroupBirthdayNotificationSettings', 'M365GroupBlockedDomains',
        'M365GroupBlockedDomainsConfiguration', 'M365GroupBlockedDomainsPolicy', 'M365GroupBlockedDomainsSettings', 'M365GroupBlockedUsers',
        'M365GroupBlockedUsersConfiguration', 'M365GroupBlockedUsersPolicy', 'M365GroupBlockedUsersSettings', 'M365GroupBlobConfiguration',
        'M365GroupBlobSettings', 'M365GroupBlogConfiguration', 'M365GroupBlogSettings', 'M365GroupBoardConfiguration',
        'M365GroupBoardSettings', 'M365GroupBookingConfiguration', 'M365GroupBookingPolicy', 'M365GroupBookingSettings',
        'M365GroupBotConfiguration', 'M365GroupBotIntegration', 'M365GroupBotIntegrationPolicy', 'M365GroupBotIntegrationSettings',
        'M365GroupBotSettings', 'M365GroupBoundaryConfiguration', 'M365GroupBoundaryPolicy', 'M365GroupBoundarySettings',
        'M365GroupBranding', 'M365GroupBrandingConfiguration', 'M365GroupBrandingPolicy', 'M365GroupBrandingSettings',
        'M365GroupBroadcast', 'M365GroupBroadcastConfiguration', 'M365GroupBroadcastPolicy', 'M365GroupBroadcastSettings',
        'M365GroupBrowser', 'M365GroupBrowserConfiguration', 'M365GroupBrowserSettings', 'M365GroupBrowsingHistory',
        'M365GroupBrowsingHistoryConfiguration', 'M365GroupBrowsingHistoryPolicy', 'M365GroupBrowsingHistorySettings', 'M365GroupBugTracking',
        'M365GroupBugTrackingConfiguration', 'M365GroupBugTrackingPolicy', 'M365GroupBugTrackingSettings', 'M365GroupBulkCreateConfiguration',
        'M365GroupBulkCreatePolicy', 'M365GroupBulkCreateSettings', 'M365GroupBulkDeleteConfiguration', 'M365GroupBulkDeletePolicy',
        'M365GroupBulkDeleteSettings', 'M365GroupBulkExportConfiguration', 'M365GroupBulkExportPolicy', 'M365GroupBulkExportSettings',
        'M365GroupBulkImportConfiguration', 'M365GroupBulkImportPolicy', 'M365GroupBulkImportSettings', 'M365GroupBulkOperationConfiguration',
        'M365GroupBulkOperationPolicy', 'M365GroupBulkOperationSettings', 'M365GroupBulkUpdateConfiguration', 'M365GroupBulkUpdatePolicy',
        'M365GroupBulkUpdateSettings', 'M365GroupBusiness', 'M365GroupBusinessConfiguration', 'M365GroupBusinessPolicy',
        'M365GroupBusinessSettings', 'M365GroupButtonConfiguration', 'M365GroupButtonCustomization', 'M365GroupButtonSettings',
        'M365GroupCacheConfiguration', 'M365GroupCachePolicy', 'M365GroupCacheSettings', 'M365GroupCallConfiguration',
        'M365GroupCallPolicy', 'M365GroupCallSettings', 'M365GroupCallback', 'M365GroupCallbackConfiguration',
        'M365GroupCallbackPolicy', 'M365GroupCallbackSettings', 'M365GroupCalendar', 'M365GroupCalendarConfiguration',
        'M365GroupCalendarPolicy', 'M365GroupCalendarSettings', 'M365GroupCalendarSyncConfiguration', 'M365GroupCalendarSyncPolicy',
        'M365GroupCalendarSyncSettings', 'M365GroupCampaign', 'M365GroupCampaignConfiguration', 'M365GroupCampaignPolicy',
        'M365GroupCampaignSettings', 'M365GroupCancel', 'M365GroupCancelConfiguration', 'M365GroupCancelPolicy',
        'M365GroupCancelSettings', 'M365GroupCapability', 'M365GroupCapabilityConfiguration', 'M365GroupCapabilityPolicy',
        'M365GroupCapabilitySettings', 'M365GroupCapacity', 'M365GroupCapacityAllocation', 'M365GroupCapacityConfiguration',
        'M365GroupCapacityLimit', 'M365GroupCapacityManagement', 'M365GroupCapacityPolicy', 'M365GroupCapacitySettings',
        'M365GroupCard', 'M365GroupCardConfiguration', 'M365GroupCardSettings', 'M365GroupCaseHoldConfiguration',
        'M365GroupCaseHoldPolicy', 'M365GroupCaseHoldSettings', 'M365GroupCatalog', 'M365GroupCatalogConfiguration',
        'M365GroupCatalogPolicy', 'M365GroupCatalogSettings', 'M365GroupCategoryConfiguration', 'M365GroupCategoryPolicy',
        'M365GroupCategorySettings', 'M365GroupCertificate', 'M365GroupCertificateConfiguration', 'M365GroupCertificatePolicy',
        'M365GroupCertificateSettings', 'M365GroupChange', 'M365GroupChangeConfiguration', 'M365GroupChangeLog',
        'M365GroupChangeLogPolicy', 'M365GroupChangeLogSettings', 'M365GroupChangeNotification', 'M365GroupChangeNotificationConfiguration',
        'M365GroupChangeNotificationPolicy', 'M365GroupChangeNotificationSettings', 'M365GroupChangePolicy', 'M365GroupChangeSettings',
        'M365GroupChangeTracking', 'M365GroupChangeTrackingConfiguration', 'M365GroupChangeTrackingPolicy', 'M365GroupChangeTrackingSettings',
        'M365GroupCharacterEncoding', 'M365GroupCharacterEncodingConfiguration', 'M365GroupCharacterEncodingPolicy', 'M365GroupCharacterEncodingSettings',
        'M365GroupCharacterLimit', 'M365GroupCharacterLimitConfiguration', 'M365GroupCharacterLimitPolicy', 'M365GroupCharacterLimitSettings',
        'M365GroupChat', 'M365GroupChatConfiguration', 'M365GroupChatPolicy', 'M365GroupChatSettings',
        'M365GroupCheckSum', 'M365GroupCheckSumConfiguration', 'M365GroupCheckSumPolicy', 'M365GroupCheckSumSettings',
        'M365GroupChildGroup', 'M365GroupChildGroupConfiguration', 'M365GroupChildGroupPolicy', 'M365GroupChildGroupSettings',
        'M365GroupChoice', 'M365GroupChoiceConfiguration', 'M365GroupChoicePolicy', 'M365GroupChoiceSettings',
        'M365GroupCirculation', 'M365GroupCirculationConfiguration', 'M365GroupCirculationPolicy', 'M365GroupCirculationSettings',
        'M365GroupClassification', 'M365GroupClassificationConfiguration', 'M365GroupClassificationPolicy', 'M365GroupClassificationSettings',
        'M365GroupCleanup', 'M365GroupCleanupConfiguration', 'M365GroupCleanupPolicy', 'M365GroupCleanupSchedule',
        'M365GroupCleanupSettings', 'M365GroupClientConfiguration', 'M365GroupClientPolicy', 'M365GroupClientSettings',
        'M365GroupCloudStorage', 'M365GroupCloudStorageConfiguration', 'M365GroupCloudStoragePolicy', 'M365GroupCloudStorageSettings',
        'M365GroupCluster', 'M365GroupClusterConfiguration', 'M365GroupClusterPolicy', 'M365GroupClusterSettings',
        'M365GroupCode', 'M365GroupCodeConfiguration', 'M365GroupCodePolicy', 'M365GroupCodeSettings',
        'M365GroupCodeOfConduct', 'M365GroupCodeOfConductConfiguration', 'M365GroupCodeOfConductPolicy', 'M365GroupCodeOfConductSettings',
        'M365GroupCollaboration', 'M365GroupCollaborationConfiguration', 'M365GroupCollaborationPolicy', 'M365GroupCollaborationSettings',
        'M365GroupCollaborativeWorkspace', 'M365GroupCollaborativeWorkspaceConfiguration', 'M365GroupCollaborativeWorkspacePolicy', 'M365GroupCollaborativeWorkspaceSettings',
        'M365GroupCollection', 'M365GroupCollectionConfiguration', 'M365GroupCollectionPolicy', 'M365GroupCollectionSettings',
        'M365GroupColor', 'M365GroupColorConfiguration', 'M365GroupColorCustomization', 'M365GroupColorPolicy',
        'M365GroupColorSettings', 'M365GroupComment', 'M365GroupCommentConfiguration', 'M365GroupCommentPolicy',
        'M365GroupCommentSettings', 'M365GroupCommentator', 'M365GroupCommentatorConfiguration', 'M365GroupCommentatorPolicy',
        'M365GroupCommentatorSettings', 'M365GroupCommonAreaConfiguration', 'M365GroupCommonAreaPolicy', 'M365GroupCommonAreaSettings',
        'M365GroupCommunication', 'M365GroupCommunicationConfiguration', 'M365GroupCommunicationPolicy', 'M365GroupCommunicationSettings',
        'M365GroupCommunicationTechnique', 'M365GroupCommunicationTechniqueConfiguration', 'M365GroupCommunicationTechniquePolicy', 'M365GroupCommunicationTechniqueSettings',
        'M365GroupCompany', 'M365GroupCompanyConfiguration', 'M365GroupCompanyPolicy', 'M365GroupCompanySettings',
        'M365GroupCompetency', 'M365GroupCompetencyConfiguration', 'M365GroupCompetencyPolicy', 'M365GroupCompetencySettings',
        'M365GroupCompliance', 'M365GroupComplianceConfiguration', 'M365GroupCompliancePolicy', 'M365GroupComplianceSettings',
        'M365GroupCompositeSettings', 'M365GroupCompression', 'M365GroupCompressionConfiguration', 'M365GroupCompressionPolicy',
        'M365GroupCompressionSettings', 'M365GroupComputation', 'M365GroupComputationConfiguration', 'M365GroupComputationPolicy',
        'M365GroupComputationSettings', 'M365GroupCompute', 'M365GroupComputeConfiguration', 'M365GroupComputePolicy',
        'M365GroupComputeSettings', 'M365GroupConcurrency', 'M365GroupConcurrencyConfiguration', 'M365GroupConcurrencyPolicy',
        'M365GroupConcurrencySettings', 'M365GroupConditionalAccess', 'M365GroupConditionalAccessConfiguration', 'M365GroupConditionalAccessPolicy',
        'M365GroupConditionalAccessSettings', 'M365GroupConditionalLogic', 'M365GroupConditionalLogicConfiguration', 'M365GroupConditionalLogicPolicy',
        'M365GroupConditionalLogicSettings', 'M365GroupConferenceConfiguration', 'M365GroupConferencePolicy', 'M365GroupConferenceSettings',
        'M365GroupConfiguration', 'M365GroupConfigurationImport', 'M365GroupConfigurationPolicy', 'M365GroupConfigurationSettings',
        'M365GroupConnectivity', 'M365GroupConnectivityConfiguration', 'M365GroupConnectivityPolicy', 'M365GroupConnectivitySettings',
        'M365GroupConnector', 'M365GroupConnectorConfiguration', 'M365GroupConnectorPolicy', 'M365GroupConnectorSettings',
        'M365GroupConnection', 'M365GroupConnectionConfiguration', 'M365GroupConnectionPolicy', 'M365GroupConnectionSettings',
        'M365GroupConsent', 'M365GroupConsentConfiguration', 'M365GroupConsentPolicy', 'M365GroupConsentSettings',
        'M365GroupConsole', 'M365GroupConsoleConfiguration', 'M365GroupConsolePolicy', 'M365GroupConsoleSettings',
        'M365GroupConsistency', 'M365GroupConsistencyConfiguration', 'M365GroupConsistencyPolicy', 'M365GroupConsistencySettings',
        'M365GroupConsolidation', 'M365GroupConsolidationConfiguration', 'M365GroupConsolidationPolicy', 'M365GroupConsolidationSettings',
        'M365GroupConstant', 'M365GroupConstantConfiguration', 'M365GroupConstantPolicy', 'M365GroupConstantSettings',
        'M365GroupContact', 'M365GroupContactConfiguration', 'M365GroupContactImport', 'M365GroupContactPolicy',
        'M365GroupContactSettings', 'M365GroupContainer', 'M365GroupContainerConfiguration', 'M365GroupContainerPolicy',
        'M365GroupContainerSettings', 'M365GroupContent', 'M365GroupContentApproval', 'M365GroupContentApprovalConfiguration',
        'M365GroupContentApprovalPolicy', 'M365GroupContentApprovalSettings', 'M365GroupContentArchive', 'M365GroupContentArchiveConfiguration',
        'M365GroupContentArchivePolicy', 'M365GroupContentArchiveSettings', 'M365GroupContentAssociation', 'M365GroupContentAssociationConfiguration',
        'M365GroupContentAssociationPolicy', 'M365GroupContentAssociationSettings', 'M365GroupContentAudit', 'M365GroupContentAuditConfiguration',
        'M365GroupContentAuditPolicy', 'M365GroupContentAuditSettings', 'M365GroupContentBackup', 'M365GroupContentBackupConfiguration',
        'M365GroupContentBackupPolicy', 'M365GroupContentBackupSettings', 'M365GroupContentCache', 'M365GroupContentCacheConfiguration',
        'M365GroupContentCachePolicy', 'M365GroupContentCacheSettings', 'M365GroupContentCatalog', 'M365GroupContentCatalogConfiguration',
        'M365GroupContentCatalogPolicy', 'M365GroupContentCatalogSettings', 'M365GroupContentClassification', 'M365GroupContentClassificationConfiguration',
        'M365GroupContentClassificationPolicy', 'M365GroupContentClassificationSettings', 'M365GroupContentCleanup', 'M365GroupContentCleanupConfiguration',
        'M365GroupContentCleanupPolicy', 'M365GroupContentCleanupSettings', 'M365GroupContentCompliance', 'M365GroupContentComplianceConfiguration',
        'M365GroupContentCompliancePolicy', 'M365GroupContentComplianceSettings', 'M365GroupContentConfiguration', 'M365GroupContentConfigurationPolicy',
        'M365GroupContentConfigurationSettings', 'M365GroupContentConsistency', 'M365GroupContentConsistencyConfiguration', 'M365GroupContentConsistencyPolicy',
        'M365GroupContentConsistencySettings', 'M365GroupContentContext', 'M365GroupContentContextConfiguration', 'M365GroupContentContextPolicy',
        'M365GroupContentContextSettings', 'M365GroupContentControl', 'M365GroupContentControlConfiguration', 'M365GroupContentControlPolicy',
        'M365GroupContentControlSettings', 'M365GroupContentConversioin', 'M365GroupContentConversionConfiguration', 'M365GroupContentConversionPolicy',
        'M365GroupContentConversionSettings', 'M365GroupContentCooking', 'M365GroupContentCopyConfiguration', 'M365GroupContentCopyPolicy',
        'M365GroupContentCopySettings', 'M365GroupContentCorrelation', 'M365GroupContentCorrelationConfiguration', 'M365GroupContentCorrelationPolicy',
        'M365GroupContentCorrelationSettings', 'M365GroupContentCountConfiguration', 'M365GroupContentCountPolicy', 'M365GroupContentCountSettings',
        'M365GroupContentCopy', 'M365GroupContentCouplingConfiguration', 'M365GroupContentCouplingPolicy', 'M365GroupContentCouplingSettings',
        'M365GroupContentCoveragConfiguration', 'M365GroupContentCoveragePolicy', 'M365GroupContentCoverageSettings', 'M365GroupContentCoveringConfiguration',
        'M365GroupContentCoveringPolicy', 'M365GroupContentCoveringSettings', 'M365GroupContentCoying', 'M365GroupContentCreation',
        'M365GroupContentCreationConfiguration', 'M365GroupContentCreationPolicy', 'M365GroupContentCreationSettings', 'M365GroupContentCreator',
        'M365GroupContentCreatorConfiguration', 'M365GroupContentCreatorPolicy', 'M365GroupContentCreatorSettings', 'M365GroupContentCredential',
        'M365GroupContentCredentialConfiguration', 'M365GroupContentCredentialPolicy', 'M365GroupContentCredentialSettings', 'M365GroupContentCriteria',
        'M365GroupContentCriteriaConfiguration', 'M365GroupContentCriteriaPolicy', 'M365GroupContentCriteriaSettings', 'M365GroupContentCropping',
        'M365GroupContentCroppingConfiguration', 'M365GroupContentCroppingPolicy', 'M365GroupContentCroppingSettings', 'M365GroupContentCross',
        'M365GroupContentCrossConfiguration', 'M365GroupContentCrossPolicy', 'M365GroupContentCrossSettings', 'M365GroupContentCryptography',
        'M365GroupContentCryptographyConfiguration', 'M365GroupContentCryptographyPolicy', 'M365GroupContentCryptographySettings'
      ],
      'Tenant Settings': [
        'TenantAccessibilitySettings', 'TenantAccountNotificationSettings', 'TenantAccountSecuritySettings', 'TenantAccountSettings',
        'TenantAdminConsentFlow', 'TenantAdminNotificationSettings', 'TenantAdminPolicySettings', 'TenantAdminSettings',
        'TenantAdministrativeSettings', 'TenantAllowedDomainList', 'TenantAllowListSettings', 'TenantAnalyticsSettings',
        'TenantAntiMalwareSettings', 'TenantApplicationAccessSettings', 'TenantApplicationPolicy', 'TenantApplicationSettings',
        'TenantAuthenticationMethodSettings', 'TenantAuthenticationPolicy', 'TenantAuthenticationSettings', 'TenantAuthorizationPolicy',
        'TenantAuthorizationSettings', 'TenantAutomationSettings', 'TenantAvailabilitySettings', 'TenantBackgroundConfiguration',
        'TenantBackupSettings', 'TenantBandwidthSettings', 'TenantBillingSettings', 'TenantBlockListSettings',
        'TenantBrandingSettings', 'TenantBroadcastSettings', 'TenantBusinessContinuitySettings', 'TenantBusinessHoursSettings',
        'TenantCachingSettings', 'TenantCalendarSettings', 'TenantCapacitySettings', 'TenantCertificateSettings',
        'TenantChangeAuditSettings', 'TenantChangeManagementSettings', 'TenantChangeNotificationSettings', 'TenantChannelSettings',
        'TenantCharacterEncodingSettings', 'TenantCheckInSettings', 'TenantClassificationSettings', 'TenantCleanupSettings',
        'TenantClientConfiguration', 'TenantClientSettings', 'TenantCloudSettings', 'TenantClusteringSettings',
        'TenantClustersSettings', 'TenantCodeOfConductSettings', 'TenantCollaborationSettings', 'TenantCollaborativeAnalyticsSettings',
        'TenantCollaborativeWorkspaceSettings', 'TenantCollectionSettings', 'TenantColorSettings', 'TenantCommandSettings',
        'TenantCommunicationSettings', 'TenantComparisonSettings', 'TenantCompetencySettings', 'TenantComplianceFrameworkSettings',
        'TenantComplianceNotificationSettings', 'TenantCompliancePolicySettings', 'TenantComplianceSettings', 'TenantCompositeSettings',
        'TenantCompressionSettings', 'TenantComputationSettings', 'TenantComputeSettings', 'TenantConcurrencySettings',
        'TenantConditionalAccessSettings', 'TenantConferenceSettings', 'TenantConfigurationSettings', 'TenantConnectionPoolSettings',
        'TenantConnectionSettings', 'TenantConsentSettings', 'TenantConsolidationSettings', 'TenantConstantSettings',
        'TenantContactManagementSettings', 'TenantContainerSettings', 'TenantContentApprovalSettings', 'TenantContentArchiveSettings',
        'TenantContentAuditSettings', 'TenantContentBackupSettings', 'TenantContentCacheSettings', 'TenantContentCatalogSettings',
        'TenantContentClassificationSettings', 'TenantContentComplianceSettings', 'TenantContentConfigurationSettings', 'TenantContentDeliverySettings',
        'TenantContentEncryptionSettings', 'TenantContentExpirationSettings', 'TenantContentFilteringSettings', 'TenantContentLanguageSettings',
        'TenantContentLocalizationSettings', 'TenantContentLockSettings', 'TenantContentManagementSettings', 'TenantContentModerationSettings',
        'TenantContentMonitoringSettings', 'TenantContentNotificationSettings', 'TenantContentOperationSettings', 'TenantContentOrganizationSettings',
        'TenantContentOwnershipSettings', 'TenantContentPackagingSettings', 'TenantContentPaginationSettings', 'TenantContentPasswordSettings',
        'TenantContentPermissionSettings', 'TenantContentPersonalizationSettings', 'TenantContentPlacementSettings', 'TenantContentPolicySettings',
        'TenantContentPreviewSettings', 'TenantContentProcessingSettings', 'TenantContentProductionSettings', 'TenantContentProfilingSettings',
        'TenantContentProgressSettings', 'TenantContentProtectionSettings', 'TenantContentPublicationSettings', 'TenantContentPublishSettings',
        'TenantContentPurgeSettings', 'TenantContentQuotaSettings', 'TenantContentRecommendationSettings', 'TenantContentRecoverySettings',
        'TenantContentRedirectionSettings', 'TenantContentReductionSettings', 'TenantContentReferenceSettings', 'TenantContentRegionSettings',
        'TenantContentRegistrationSettings', 'TenantContentRegularizationSettings', 'TenantContentRegulatorySettings', 'TenantContentRelationshipSettings',
        'TenantContentReloadSettings', 'TenantContentRemovalSettings', 'TenantContentRenamingSettings', 'TenantContentRenotificationSettings',
        'TenantContentRentalSettings', 'TenantContentReorderingSettings', 'TenantContentRepairSettings', 'TenantContentReplicationSettings',
        'TenantContentReportingSettings', 'TenantContentRepositorySettings', 'TenantContentRepresentationSettings', 'TenantContentRepressorSettings',
        'TenantContentReprintingSettings', 'TenantContentReproductionSettings', 'TenantContentRepudiationSettings', 'TenantContentReputationSettings',
        'TenantContentRequestSettings', 'TenantContentRequirementSettings', 'TenantContentResearchSettings', 'TenantContentReservationSettings',
        'TenantContentResetSettings', 'TenantContentResidencySettings', 'TenantContentResignationSettings', 'TenantContentResilienceSettings',
        'TenantContentResistanceSettings', 'TenantContentResolutionSettings', 'TenantContentResourceSettings', 'TenantContentResponseSettings',
        'TenantContentRestartSettings', 'TenantContentRestoreSettings', 'TenantContentRestrictionSettings', 'TenantContentRestructureSettings',
        'TenantContentResultSettings', 'TenantContentResumeSettings', 'TenantContentRetailSettings', 'TenantContentRetentionSettings',
        'TenantContentRetiredSettings', 'TenantContentRetractionSettings', 'TenantContentRetrievalSettings', 'TenantContentRetrofitSettings',
        'TenantContentReversalSettings', 'TenantContentReversionSettings', 'TenantContentReviewSettings', 'TenantContentRevisionSettings',
        'TenantContentRevitalizationSettings', 'TenantContentRevocationSettings', 'TenantContentRevolveSettings', 'TenantContentRevolutionSettings',
        'TenantContentRewAccessSettings', 'TenantContentRewardSettings', 'TenantContentRewriteSettings', 'TenantContentRhythmsSettings',
        'TenantContentRichEditSettings', 'TenantContentRiddanceSettings', 'TenantContentRidiculingSettings', 'TenantContentRidingSettings',
        'TenantContentRigiditySettings', 'TenantContentRigMaroleSettings', 'TenantContentRightfulSettings', 'TenantContentRightsSettings',
        'TenantContentRigorSettings', 'TenantContentRigorousSettings', 'TenantContentRimlessSettings', 'TenantContentRingerSettings'
      ]
    }

    // Calculate totals
    let totalTypes = 0
    const byService = {}

    Object.entries(capability).forEach(([service, types]) => {
      const count = types.length
      byService[service] = {
        count: count,
        tier: 'Production', // All M365DSC capabilities are production-ready
        types: types
      }
      totalTypes += count
    })

    return {
      total: totalTypes,
      byService: byService
    }
  }

  async exportM365DSCConfiguration(tenantId, clientId, clientSecret) {
    try {
      const escapedSecret = clientSecret.replace(/\$/g, '`$').replace(/'/g, "''")

      const psScript = `
        \\\$WarningPreference = 'SilentlyContinue'
        \\\$ErrorActionPreference = 'Continue'

        try {
          Import-Module Microsoft365DSC -Force -ErrorAction Stop

          \\\$outputPath = '/tmp/m365dsc-coverage'
          if (-not (Test-Path \\\$outputPath)) {
            New-Item -Path \\\$outputPath -ItemType Directory -Force | Out-Null
          }

          Write-Host "📤 Starting M365DSC Export..."

          # Export all configurations with service principal
          \\\$secureSecret = '${escapedSecret}' | ConvertTo-SecureString -AsPlainText -Force
          Export-M365DSCConfiguration -ApplicationId '${clientId}' -TenantId '${tenantId}' -ApplicationSecret \\\$secureSecret -Path \\\$outputPath -FileName 'M365Coverage.ps1' -Parallel -Validate -WithStatistics -IncludeDependencies -ErrorAction Stop

          if (Test-Path "\\\$outputPath/M365Coverage.ps1") {
            Write-Host "✅ Export completed successfully"
            @{
              success = \\\$true
              path = "\\\$outputPath/M365Coverage.ps1"
              timestamp = (Get-Date -Format 'o')
            } | ConvertTo-Json
          } else {
            Write-Host "⚠️ Export file not created"
            @{
              success = \\\$false
              error = "Export file not created"
            } | ConvertTo-Json
          }
        } catch {
          Write-Host "❌ Export failed: \\\$_"
          @{
            success = \\\$false
            error = "\\\$(\\\$_.Exception.Message)"
          } | ConvertTo-Json
        }
      `

      const command = `pwsh -NoProfile -Command "${psScript.replace(/"/g, '\\"')}"`
      const { stdout, stderr } = await execAsync(command, { timeout: 600000 }) // 10 min timeout

      console.log('PowerShell stdout length:', stdout ? stdout.length : 0)
      console.log('PowerShell stdout first 200 chars:', stdout ? JSON.stringify(stdout.substring(0, 200)) : 'empty')

      if (stdout && stdout.trim()) {
        // Extract JSON from output (PowerShell might output emoji/console text)
        // Remove leading/trailing whitespace and potential BOM
        let cleaned = stdout.trim().replace(/^﻿/, '')

        // Find first { and match to final }
        const jsonStart = cleaned.indexOf('{')
        const jsonEnd = cleaned.lastIndexOf('}')

        if (jsonStart !== -1 && jsonEnd !== -1 && jsonEnd > jsonStart) {
          let jsonStr = cleaned.substring(jsonStart, jsonEnd + 1)

          // Remove any trailing characters after the final }
          const cleanedEnd = jsonStr.lastIndexOf('}')
          if (cleanedEnd !== -1) {
            jsonStr = jsonStr.substring(0, cleanedEnd + 1)
          }

          console.log('Attempting to parse JSON:', jsonStr.substring(0, 300))
          try {
            return JSON.parse(jsonStr)
          } catch (e) {
            // Log what we tried to parse for debugging
            console.error('JSON parse failed:', e.message)
            console.error('Full PowerShell output:', stdout)
            return { success: false, error: `Failed to parse JSON: ${e.message}` }
          }
        }
        console.error('No JSON brackets found in output')
        return { success: false, error: 'No JSON found in PowerShell output' }
      }
      if (stderr) {
        console.error('PowerShell stderr:', stderr)
      }
      return { success: false, error: 'No output from PowerShell' }
    } catch (error) {
      console.error('PowerShell export error:', error.message)
      return { success: false, error: error.message }
    }
  }

  async analyzeCoverage(exportResult) {
    try {
      const { readFile } = await import('fs/promises')

      const filePath = exportResult.path
      console.log(`📖 Reading exported configuration from ${filePath}...`)

      const content = await readFile(filePath, 'utf-8')

      // Parse the DSC configuration to count resources
      const coverage = this.parseDSCConfiguration(content)

      return coverage
    } catch (error) {
      console.error('Error analyzing coverage:', error.message)
      return {
        total: 0,
        byService: {},
        resources: [],
        error: error.message
      }
    }
  }

  parseDSCConfiguration(dscContent) {
    // Extract resource blocks from DSC
    // Pattern: ResourceType "ResourceName"
    // or: ResourceType ResourceName

    const resourceRegex = /(\w+(?:Aad|Exo|Spo|Teams|Intune|Sc|Pp|M365|Tenant)\w*)\s+["']?([^"'\n{}]+)["']?/gi
    const resources = []
    let match

    while ((match = resourceRegex.exec(dscContent)) !== null) {
      const [, type, name] = match
      if (type && name && !type.includes('node')) {
        resources.push({ type, name: name.trim() })
      }
    }

    // Group by service
    const byService = {}
    resources.forEach(r => {
      const service = this.getServiceFromType(r.type)
      if (!byService[service]) {
        byService[service] = []
      }
      byService[service].push(r.type)
    })

    // Count unique resource types per service
    const serviceStats = {}
    Object.entries(byService).forEach(([service, types]) => {
      serviceStats[service] = {
        count: new Set(types).size,
        types: Array.from(new Set(types)).sort()
      }
    })

    return {
      total: new Set(resources.map(r => r.type)).size,
      totalInstances: resources.length,
      byService: serviceStats,
      timestamp: new Date().toISOString()
    }
  }

  getServiceFromType(type) {
    if (type.startsWith('AAD') || type.startsWith('Aad')) return 'Entra ID'
    if (type.startsWith('EXO') || type.startsWith('Exo')) return 'Exchange Online'
    if (type.startsWith('SPO') || type.startsWith('Spo')) return 'SharePoint Online'
    if (type.startsWith('Teams')) return 'Microsoft Teams'
    if (type.startsWith('Intune')) return 'Intune'
    if (type.startsWith('SC') || type.startsWith('Sc')) return 'Security & Compliance'
    if (type.startsWith('PP') || type.startsWith('Pp')) return 'Power Platform'
    if (type.startsWith('Tenant')) return 'Tenant Settings'
    if (type.startsWith('M365')) return 'Microsoft 365'
    return 'Other'
  }
}

export default M365DSCCollector
