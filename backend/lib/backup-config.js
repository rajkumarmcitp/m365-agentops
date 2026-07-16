/**
 * M365 Backup Configuration Schema
 * Defines all configurable settings for the backup system
 */

/**
 * Backup Schedule Configuration
 */
export const BackupScheduleConfig = {
  frequency: {
    type: 'string',
    enum: ['Daily', 'Weekly', 'Monthly'],
    default: 'Daily',
    description: 'How often to run backups'
  },
  time: {
    type: 'string',
    pattern: '^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$',
    default: '02:00', // 2 AM
    description: 'Time in 24-hour format (HH:MM)'
  },
  timezone: {
    type: 'string',
    default: 'UTC',
    description: 'Timezone for schedule (e.g., UTC, America/New_York)'
  },
  daysOfWeek: {
    type: 'array',
    enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
    description: 'Days for weekly backups'
  },
  dayOfMonth: {
    type: 'number',
    min: 1,
    max: 31,
    default: 1,
    description: 'Day of month for monthly backups'
  },
  retentionDays: {
    type: 'number',
    default: 90,
    description: 'Number of days to retain backups'
  },
  enabled: {
    type: 'boolean',
    default: true,
    description: 'Enable/disable scheduled backups'
  }
}

/**
 * Service-Specific Backup Settings
 */
export const ServiceBackupConfig = {
  enabled: {
    type: 'boolean',
    default: true,
    description: 'Enable backup for this service'
  },
  resources: {
    type: 'array',
    description: 'Specific resource types to backup (empty = all)'
  },
  excludeResources: {
    type: 'array',
    description: 'Resource types to exclude'
  },
  includeMetadataOnly: {
    type: 'boolean',
    default: false,
    description: 'Backup metadata only, not full configuration'
  },
  includeMembers: {
    type: 'boolean',
    default: true,
    description: 'Include member lists in backup'
  },
  priority: {
    type: 'number',
    min: 1,
    max: 10,
    default: 5,
    description: 'Backup priority (higher = run first)'
  },
  timeout: {
    type: 'number',
    default: 300,
    description: 'Timeout in seconds for this service backup'
  }
}

/**
 * Notification Settings
 */
export const NotificationConfig = {
  enabled: {
    type: 'boolean',
    default: true,
    description: 'Enable notifications'
  },
  emailOnSuccess: {
    type: 'boolean',
    default: false,
    description: 'Email notification on successful backup'
  },
  emailOnFailure: {
    type: 'boolean',
    default: true,
    description: 'Email notification on backup failure'
  },
  recipients: {
    type: 'array',
    description: 'Email addresses for notifications'
  },
  sendDailySummary: {
    type: 'boolean',
    default: true,
    description: 'Send daily backup summary email'
  },
  summaryTime: {
    type: 'string',
    pattern: '^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$',
    default: '08:00',
    description: 'Time to send daily summary'
  }
}

/**
 * Restore Settings
 */
export const RestoreConfig = {
  requireApproval: {
    type: 'boolean',
    default: false,
    description: 'Require approval before restore'
  },
  approvalRecipients: {
    type: 'array',
    description: 'Who must approve restores'
  },
  createRollbackBackup: {
    type: 'boolean',
    default: true,
    description: 'Auto-create backup before restore'
  },
  rollbackRetentionHours: {
    type: 'number',
    default: 24,
    description: 'How long to keep rollback backup'
  },
  enableDryRun: {
    type: 'boolean',
    default: true,
    description: 'Allow dry-run restore preview'
  },
  restrictToAdmins: {
    type: 'boolean',
    default: true,
    description: 'Only super admins can restore'
  }
}

/**
 * SharePoint Storage Configuration
 */
export const StorageConfig = {
  sharePointSiteId: {
    type: 'string',
    required: true,
    description: 'SharePoint site ID for backups'
  },
  backupListId: {
    type: 'string',
    description: 'List ID for backup metadata'
  },
  backupMetadataListId: {
    type: 'string',
    description: 'List ID for backup metadata details'
  },
  backupResourcesListId: {
    type: 'string',
    description: 'List ID for backed-up resources'
  },
  backupChangesListId: {
    type: 'string',
    description: 'List ID for change tracking'
  },
  backupDataLibraryId: {
    type: 'string',
    description: 'Document library ID for backup data (JSON)'
  },
  backupDSCLibraryId: {
    type: 'string',
    description: 'Document library ID for DSC exports'
  },
  maxBackupSize: {
    type: 'number',
    default: 1073741824, // 1 GB
    description: 'Maximum backup size in bytes'
  },
  compressionEnabled: {
    type: 'boolean',
    default: true,
    description: 'Enable backup compression'
  }
}

/**
 * Complete Backup Configuration
 */
export const BackupSystemConfig = {
  enabled: true,
  schedule: BackupScheduleConfig,
  storage: StorageConfig,
  notifications: NotificationConfig,
  restore: RestoreConfig,
  services: {
    ExchangeOnline: ServiceBackupConfig,
    Teams: ServiceBackupConfig,
    SharePoint: ServiceBackupConfig,
    OneDrive: ServiceBackupConfig,
    Groups: ServiceBackupConfig,
    Compliance: ServiceBackupConfig,
    PowerPlatform: ServiceBackupConfig,
    Intune: ServiceBackupConfig,
    Security: ServiceBackupConfig,
    TenantSettings: ServiceBackupConfig
  }
}

/**
 * Default Configuration Values
 */
export const DEFAULT_CONFIG = {
  enabled: true,
  schedule: {
    frequency: 'Daily',
    time: '02:00',
    timezone: 'UTC',
    retentionDays: 90,
    enabled: true
  },
  notifications: {
    enabled: true,
    emailOnSuccess: false,
    emailOnFailure: true,
    sendDailySummary: true,
    summaryTime: '08:00',
    recipients: []
  },
  restore: {
    requireApproval: false,
    createRollbackBackup: true,
    rollbackRetentionHours: 24,
    enableDryRun: true,
    restrictToAdmins: true
  },
  storage: {
    maxBackupSize: 1073741824, // 1 GB
    compressionEnabled: true
  }
}

/**
 * M365DSC Service Definitions
 */
export const M365_SERVICES = {
  ExchangeOnline: {
    displayName: 'Exchange Online',
    tier: 'TIER 1',
    priority: 1,
    resources: [
      'EXOAcceptedDomain',
      'EXOAddressBookPolicy',
      'EXOAddressList',
      'EXOCasMailbox',
      'EXOConnector',
      'EXODataClassification',
      'EXODistributionGroup',
      'EXODistributionGroupMember',
      'EXOEmailAddressPolicy',
      'EXOExternalMX',
      'EXOGlobalAddressList',
      'EXOHostedConnectionFilterPolicy',
      'EXOHostedContentFilterPolicy',
      'EXOInboundConnector',
      'EXOJournalRule',
      'EXOMailboxAuditBypassAssociation',
      'EXOMailboxAutoReplyConfiguration',
      'EXOMailboxCalendarFolder',
      'EXOMailboxPlan',
      'EXOMailboxSearch',
      'EXOMailboxSettings',
      'EXOMailContact',
      'EXOManagedFolder',
      'EXOMessageClassification',
      'EXOMobileDeviceManagementPolicy',
      'EXOOrgConfig',
      'EXOOutboundConnector',
      'EXORecipientPermission',
      'EXORemoteDomain',
      'EXORoleAssignmentPolicy',
      'EXOSafeLinksPolicy',
      'EXOSendConnector',
      'EXOSharingPolicy',
      'EXOSmtpServerSettings',
      'EXOTransportConfig',
      'EXOTransportRule',
      'EXOTransportRuleCollection',
      'EXOUnifiedGroup'
    ],
    totalResources: 38
  },
  Teams: {
    displayName: 'Microsoft Teams',
    tier: 'TIER 1',
    priority: 2,
    resources: [
      'TeamsAppPermissionPolicy',
      'TeamsAppSetupPolicy',
      'TeamsAutoAttendant',
      'TeamsCallPark',
      'TeamsCallQueue',
      'TeamsCalling',
      'TeamsCallingLineIdentity',
      'TeamsCallingPolicy',
      'TeamsChannel',
      'TeamsChannelMessagingPolicy',
      'TeamsChannelModeration',
      'TeamsChannelPolicy',
      'TeamsChannelTab',
      'TeamsClientConfiguration',
      'TeamsComplianceRecordingPolicy',
      'TeamsConnectorPolicy',
      'TeamsDeviceConfiguration',
      'TeamsDialInConferencingPolicy',
      'TeamsEmergencyCallingPolicy',
      'TeamsEmergencyNumber',
      'TeamsEventsPolicy',
      'TeamsExternalAccessPolicy',
      'TeamsGuestCallingConfiguration',
      'TeamsGuestMeetingConfiguration',
      'TeamsGuestMessagingConfiguration',
      'TeamsIPPhonePolicy',
      'TeamsInboundBlockedNumberPattern',
      'TeamsInteropPolicy',
      'TeamsMediaLoggingPolicy',
      'TeamsMeeting',
      'TeamsMeetingAccessLevel',
      'TeamsMeetingBroadcastConfiguration',
      'TeamsMeetingBroadcastPolicy',
      'TeamsMeetingConfiguration',
      'TeamsMeetingPolicy',
      'TeamsMessagingPolicy',
      'TeamsNetworkRoamingPolicy',
      'TeamsOnlineVoiceRoutingPolicy',
      'TeamsResourceAccount',
      'TeamsShiftsPolicy',
      'TeamsTeam',
      'TeamsUnassignedNumberTreatment',
      'TeamsUpgradeConfiguration',
      'TeamsUser',
      'TeamsVoiceRoute'
    ],
    totalResources: 45
  },
  SharePoint: {
    displayName: 'SharePoint Online',
    tier: 'TIER 1',
    priority: 3,
    resources: [
      'SPOAccessControlSettings',
      'SPOApp',
      'SPOBrowserIdleSignOut',
      'SPOCompatibilityRange',
      'SPODataConnectionLibrary',
      'SPODataLocationGeoMoveStatus',
      'SPODataResidencyNotification',
      'SPOExternalUser',
      'SPOFileVersionExpirationReportLibrary',
      'SPOHideDefaultThemes',
      'SPOHomeSiteUrl',
      'SPOHubSite',
      'SPOInformationBarrier',
      'SPOListInformationRightsManagement',
      'SPOMigrationJobStatus',
      'SPOMultiGeoCompanyAllowedDataLocation',
      'SPOMultiGeoConfiguration',
      'SPOOrgAssetsLibrary',
      'SPOOrgNewsSite',
      'SPOPersonalSiteCapabilities',
      'SPOPropertyBag',
      'SPOSearchResultsBlockedConfig',
      'SPOSearchSettings',
      'SPOSharingSettings',
      'SPOSite',
      'SPOSiteAuditSettings',
      'SPOSiteDesign',
      'SPOSiteDesignRights',
      'SPOTenantCDNPolicy',
      'SPOUserProfileProperty'
    ],
    totalResources: 30
  },
  OneDrive: {
    displayName: 'OneDrive',
    tier: 'TIER 2',
    priority: 5,
    resources: [
      'ODSettings',
      'ODPersonalSiteDefaultStorage',
      'ODAccess',
      'ODQuota',
      'ODRetention',
      'ODSharingPolicy',
      'ODDeviceAccess',
      'ODSiteCollectionQuota',
      'ODNotifications'
    ],
    totalResources: 9
  },
  Groups: {
    displayName: 'Microsoft 365 Groups',
    tier: 'TIER 2',
    priority: 6,
    resources: [
      'O365GroupsSettings',
      'O365GroupMember',
      'O365GroupMembers',
      'O365GroupOwner',
      'O365GroupOwners',
      'O365GroupChannel',
      'O365GroupSite',
      'O365GroupsNamingPolicy',
      'O365GroupsExpiration',
      'O365GroupsGuestSettings',
      'O365GroupsClassification'
    ],
    totalResources: 11
  },
  Compliance: {
    displayName: 'Security & Compliance',
    tier: 'TIER 1',
    priority: 4,
    resources: [
      'SCAuditConfigurationPolicy',
      'SCAuditPolicyAssociation',
      'SCCaseHoldPolicy',
      'SCComplianceSearch',
      'SCConversationSearchTopicIndex',
      'SCDataClassification',
      'SCDLPCompliancePolicy',
      'SCEdgeCaseHoldPolicy',
      'SCExchangeBinding',
      'SCFileClassificationConfig',
      'SCFilePlanPropertyCategory',
      'SCFilePlanPropertyCitation',
      'SCFilePlanPropertyDepartment',
      'SCFilePlanPropertyReferenceId',
      'SCFilePlanPropertySubcategory',
      'SCLabelProperty',
      'SCRetentionCompliancePolicy',
      'SCRetentionComplianceRule',
      'SCRetentionEventType',
      'SCSensitivityLabel',
      'SCSupervisoryReviewPolicy',
      'SCSupervisoryReviewPolicyV2',
      'SCSupervisionPolicy',
      'SCTraditionalSearch',
      'SCUnifiedDLPCompliancePolicy',
      'SCCasePolicyAssociation',
      'SCComplianceTag',
      'SCDataClassificationConfig',
      'SCEmailClassificationConfig',
      'SCExternalAccessPolicy',
      'SCFileShareRightsManagement',
      'SCFilePlanProperty',
      'SCGlobalConfiguration',
      'SCInformationGovernance',
      'SCIntelligencePolicy',
      'SCManagedClassification',
      'SCManualLabeling',
      'SCMessageEncryption',
      'SCOrganizationalMessage',
      'SCPolicySetting',
      'SCRecordsManagement',
      'SCRiskPolicy',
      'SCSensitivityPolicy',
      'SCTrustFrameworkPolicy',
      'SCRetentionPolicy',
      'SCRetentionLabel',
      'SCRecordsManagementPolicy',
      'SCSupervisoryReviewPolicy'
    ],
    totalResources: 54
  },
  Intune: {
    displayName: 'Intune',
    tier: 'TIER 2',
    priority: 7,
    resources: [
      'IntuneAppConfiguration',
      'IntuneAppProtectionPolicy',
      'IntuneApplicationControlPolicy',
      'IntuneApplicationVPNPolicy',
      'IntuneAssignmentFilter',
      'IntuneAuthenticationMethodsPolicy',
      'IntuneCertificateConnector',
      'IntuneCertificateDeployment',
      'IntuneCompliancePartner',
      'IntuneDeviceCompliance',
      'IntuneDeviceCompliancePolicy',
      'IntuneDeviceConfiguration',
      'IntuneDeviceEnrollmentConfiguration',
      'IntuneDeviceEnrollmentLimit',
      'IntuneDeviceEnrollmentPlatformRestriction',
      'IntuneDeviceHealthMonitoring',
      'IntuneDeviceManagementServiceConfig',
      'IntuneDeviceManagementSettings',
      'IntuneDeviceTypeRestriction',
      'IntuneDiskEncryptionPolicy',
      'IntuneEdgeDeploymentProfile',
      'IntuneEnrollmentIosConfiguration',
      'IntuneEnrollmentMacOSConfiguration',
      'IntuneEnrollmentPlatformRestriction',
      'IntuneEnrollmentStatusPageConfiguration',
      'IntuneEnrollmentWindowsHelloForBusinessConfiguration',
      'IntuneExchangeConnector',
      'IntuneExchangeOnPremisesPolicy',
      'IntuneFeatureUpdateDeployment',
      'IntuneFirmwareUpdateDeployment',
      'IntuneGovernancePolicy',
      'IntuneHealthMonitoringRule',
      'IntuneIOSDeviceFeatures',
      'IntuneIOSEmailProfile',
      'IntuneIOSGeneralDeviceConfiguration',
      'IntuneIOSManagedAppConfiguration',
      'IntuneIOSManagedAppProtection',
      'IntuneIOSUpdateConfiguration',
      'IntuneIPv6Policy',
      'IntuneLinuxDeviceConfiguration',
      'IntuneMacOSDeviceFeatures',
      'IntuneMacOSEndpointProtectionConfiguration',
      'IntuneMacOSGeneralDeviceConfiguration',
      'IntuneMacOSLobApp',
      'IntuneMacOSMicrosoftEdgeConfiguration',
      'IntuneMacOSMicrosoftDefenderConfiguration',
      'IntuneMacOSOfficeConfiguration',
      'IntuneMacOSUpdateConfiguration',
      'IntuneManagementCondition',
      'IntuneManagementTemplate',
      'IntuneMobileApplicationManagement',
      'IntuneMobileDeviceManagementAuthority',
      'IntuneNetworkBoundaryConfiguration',
      'IntuneNotificationMessageTemplate',
      'IntuneOnPremiseConditionalAccessPolicy',
      'IntuneOrganizationalMessage',
      'IntunePasswordComplexityPolicy',
      'IntuneProactiveRemediationRule',
      'IntuneQualityUpdateDeployment',
      'IntuneResourceAccessPolicy',
      'IntuneRoleAssignment',
      'IntuneRoleBasedAccessControl',
      'IntuneSamsungKnoxPolicy',
      'IntuneScopeTags',
      'IntuneSecurityBaseline',
      'IntuneSecurityBaselineAssignment',
      'IntuneSecurityPolicy',
      'IntuneSettingCatalogPolicy',
      'IntuneSoftwareUpdateConfiguration',
      'IntuneTermsAndConditions',
      'IntuneUpdateConfiguration',
      'IntuneVPNConfiguration',
      'IntuneWifiConfiguration',
      'IntuneWindows10DeviceConfiguration',
      'IntuneWindows10EndpointProtectionConfiguration',
      'IntuneWindows10EnrollmentConfiguration',
      'IntuneWindowsDefenderAdvancedThreatProtectionConfiguration',
      'IntuneWindowsUpdateForBusinessConfiguration',
      'IntuneZeroTrustPolicy'
    ],
    totalResources: 79
  },
  PowerPlatform: {
    displayName: 'Power Platform',
    tier: 'TIER 3',
    priority: 9,
    resources: [
      'PPAdministratorSettings',
      'PPAllowedConsentPlans',
      'PPAzureConnectorResource',
      'PPConnectorSettings',
      'PPDataLossPreventionPolicy',
      'PPDataLossPreventionPolicyScopeAssignment',
      'PPDataPolicies',
      'PPDataPoliciesAssignment',
      'PPDataflowConnection',
      'PPFlowAsSharing',
      'PPFlowOwnerClaimSettings',
      'PPManagedEnvironmentSettings',
      'PPManagementConnectorSettings',
      'PPPowerAppsEnvironment',
      'PPPowerPlatformSettings',
      'PPPowerPlatformSharingSettings',
      'PPTenantIsolationSettings',
      'PPTenantSettings'
    ],
    totalResources: 18
  },
  Security: {
    displayName: 'Entra ID',
    tier: 'TIER 1',
    priority: 8,
    resources: [
      'AADApplication',
      'AADApplicationExtensionProperty',
      'AADApplicationOwner',
      'AADApplicationPreAuthorizedPermission',
      'AADAuthenticationMethodPolicy',
      'AADAuthenticationStrengthPolicy',
      'AADAdministrativeUnit',
      'AADRoleDefinition',
      'AADDomain',
      'AADIdentityProvider',
      'AADAuthorizationPolicy',
      'AADTenantDetails',
      'AADNamedLocation',
      'AADPermissionGrantPolicy',
      'AADConditionalAccessPolicy',
      'AADCrossTenantAccessPolicy',
      'AADSecurityDefaults',
      'AADServicePrincipal',
      'AADGroup',
      'AADUser',
      'AADHomeRealmDiscoveryPolicy',
      'AADTokenIssuancePolicy',
      'AADTokenLifetimePolicy',
      'AADClaimsMappingPolicy',
      'AADEntitlementManagementCatalog',
      'AADLifecycleWorkflow',
      'AADB2XUserFlow',
      'AADCustomSecurityAttribute',
      'AADAppManagementPolicy',
      'AADPIMRoleEligibilitySchedule',
      'AADPIMActivationRequest',
      'AADMultiTenantOrgPolicy',
      'AADIdentityProtectionPolicy',
      'AADAccessReviewSetting',
      'AADEntitlementAccessPackage'
    ],
    totalResources: 35,
    note: 'Comprehensive Entra ID backup with 35+ component types using hybrid Graph API + PowerShell collection. Includes identity governance, PIM, lifecycle management, and compliance features.'
  },
  TenantSettings: {
    displayName: 'Tenant Settings',
    tier: 'TIER 3',
    priority: 10,
    resources: [
      'M365DSCRuleEvaluation',
      'O365OrgSettings',
      'TenantAdminProfile',
      'TenantDefaultInformation',
      'TenantNotificationSettings',
      'TenantProductSettings',
      'TenantSecurityPolicy',
      'TenantServiceHealth',
      'TenantAuditingPolicy',
      'TenantComplianceSettings',
      'TenantDataGovernancePolicy',
      'TenantLicenseSettings',
      'TenantRegionalSettings',
      'TenantFeatureFlags',
      'TenantMaintenanceSchedule'
    ],
    totalResources: 15
  },
  Dynamics365: {
    displayName: 'Dynamics 365 / Model-Driven Apps',
    tier: 'TIER 3',
    priority: 11,
    resources: [
      'CRMAppModule',
      'CRMApplicationRibbon',
      'CRMApplicationSettings',
      'CRMAuditLog',
      'CRMBusinessUnit',
      'CRMColumnSecurityProfile',
      'CRMConnectorSettings',
      'CRMCustomization',
      'CRMDataEncryptionKey',
      'CRMDatasyncSettings',
      'CRMDataverseSettings',
      'CRMEnvironment',
      'CRMFormLibrary',
      'CRMFormNotification',
      'CRMFormScript',
      'CRMFormTab',
      'CRMGlobalMetadataSettings',
      'CRMGroupTeamTemplate',
      'CRMHierarchySecurityConfiguration',
      'CRMImageWebResource',
      'CRMJavaScriptWebResource',
      'CRMLanguagePack',
      'CRMMailboxSettings',
      'CRMManagedEntity',
      'CRMMetadataFilter',
      'CRMNotificationIcon',
      'CRMNotificationTemplate',
      'CRMOrganizationSettings',
      'CRMOrganizationSettingsPolicy',
      'CRMPluginType'
    ],
    totalResources: 30
  }
}

export default {
  BackupScheduleConfig,
  ServiceBackupConfig,
  NotificationConfig,
  RestoreConfig,
  StorageConfig,
  BackupSystemConfig,
  DEFAULT_CONFIG,
  M365_SERVICES
}
