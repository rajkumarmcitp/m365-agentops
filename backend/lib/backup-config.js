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
      'EXOConnector',
      'EXODistributionGroup',
      'EXODistributionGroupMember',
      'EXOInboundConnector',
      'EXOMailboxSettings',
      'EXOMailContact',
      'EXOMobileDeviceManagementPolicy',
      'EXOOrgConfig',
      'EXOOutboundConnector',
      'EXORemoteDomain',
      'EXOTransportRule',
      'EXOTransportRuleCollection',
      'EXOUnifiedGroup'
    ],
    totalResources: 14
  },
  Teams: {
    displayName: 'Microsoft Teams',
    tier: 'TIER 1',
    priority: 2,
    resources: [
      'TeamsChannel',
      'TeamsChannelPolicy',
      'TeamsChannelTab',
      'TeamsDialInConferencingPolicy',
      'TeamsEmergencyCallingPolicy',
      'TeamsEmergencyNumber',
      'TeamsIPPhonePolicy',
      'TeamsMeetingBroadcastPolicy',
      'TeamsMeetingConfiguration',
      'TeamsMeetingPolicy',
      'TeamsNetworkRoamingPolicy',
      'TeamsPSTNUsage',
      'TeamsTeam',
      'TeamsUpgradeConfiguration',
      'TeamsUser',
      'TeamsVoiceRoute'
    ],
    totalResources: 16
  },
  SharePoint: {
    displayName: 'SharePoint Online',
    tier: 'TIER 1',
    priority: 3,
    resources: [
      'SPOAccessControlSettings',
      'SPOApp',
      'SPOHubSite',
      'SPOMultiGeoConfiguration',
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
    totalResources: 14
  },
  OneDrive: {
    displayName: 'OneDrive',
    tier: 'TIER 2',
    priority: 5,
    resources: [
      'ODSettings',
      'ODPersonalSiteDefaultStorage',
      'ODAccess'
    ],
    totalResources: 3
  },
  Groups: {
    displayName: 'Microsoft 365 Groups',
    tier: 'TIER 2',
    priority: 6,
    resources: [
      'O365GroupsSettings',
      'O365GroupsNamingPolicy',
      'O365GroupsExpiration'
    ],
    totalResources: 3
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
      'SCDLPCompliancePolicy',
      'SCSensitivityLabel',
      'SCRetentionCompliancePolicy',
      'SCRetentionComplianceRule',
      'SCSupervisionPolicy'
    ],
    totalResources: 9
  },
  Intune: {
    displayName: 'Intune',
    tier: 'TIER 2',
    priority: 7,
    resources: [
      'IntuneAppConfiguration',
      'IntuneAppProtectionPolicy',
      'IntuneDeviceCompliance',
      'IntuneDeviceConfiguration',
      'IntuneDeviceEnrollmentPlatformRestriction',
      'IntuneWifiConfiguration',
      'IntuneWindowsUpdateForBusinessConfiguration'
    ],
    totalResources: 7
  },
  PowerPlatform: {
    displayName: 'Power Platform',
    tier: 'TIER 3',
    priority: 9,
    resources: [
      'PPPowerAppsEnvironment',
      'PPTenantSettings',
      'PPTenantIsolationSettings'
    ],
    totalResources: 3
  },
  Security: {
    displayName: 'Security & Identity',
    tier: 'TIER 2',
    priority: 8,
    resources: [
      'AADApplicationPermission',
      'AADApplicationProxy',
      'AADAuthenticationMethodPolicy',
      'AADAuthenticationStrengthPolicy',
      'AADConditionalAccessPolicy',
      'AADCrossTenantAccessPolicy',
      'AADEnrichmentAttribute',
      'AADExternalIdentityPolicy',
      'AADGroupLifecyclePolicy',
      'AADGroupsAdministrativeUnit',
      'AADGroupSettings',
      'AADRoleAssignment',
      'AADSecurityDefaults',
      'AADServicePrincipal',
      'AADSignInFrequencyPolicy',
      'AADUserAuthenticationMethod'
    ],
    totalResources: 16
  },
  TenantSettings: {
    displayName: 'Tenant Settings',
    tier: 'TIER 3',
    priority: 10,
    resources: [
      'M365DSCRuleEvaluation',
      'O365OrgSettings'
    ],
    totalResources: 2
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
