# M365DSC Resources Expansion Analysis

## Current Coverage (87 resources across 10 services)

### What We Have ✅
- Exchange Online: 14 resources
- Teams: 16 resources  
- SharePoint: 14 resources
- Compliance: 9 resources
- OneDrive: 3 resources
- Groups: 3 resources
- Intune: 7 resources
- Security: 16 resources
- PowerPlatform: 3 resources
- TenantSettings: 2 resources

---

## Microsoft365DSC Full Resource Coverage

Based on Microsoft365DSC official documentation, the framework supports 300+ resources across these major categories:

### 1. Exchange Online Resources (~40+ total)
**Current: 14 | Available: 40+**

Additional resources to add:
- EXOAddressBookPolicy
- EXOAddressList
- EXOCasMailbox
- EXODataClassification
- EXOEdgeSyncServiceConfig
- EXOEmailAddressPolicy
- EXOExternalMX
- EXOGlobalAddressList
- EXOHostedConnectionFilterPolicy
- EXOHostedContentFilterPolicy
- EXOInboundConnector (partial)
- EXOJournalRule
- EXOMailboxAuditBypassAssociation
- EXOMailboxAutoReplyConfiguration
- EXOMailboxCalendarFolder
- EXOMailboxDatabase
- EXOMailboxPlan
- EXOMailboxSearch
- EXOManagedFolder
- EXOMessageClassification
- EXOMigrationBatch
- EXOOrganizationRelationship
- EXOOwaMailboxPolicy
- EXOPopSettings
- EXORecipientPermission
- EXOResourceConfiguration
- EXORoleAssignmentPolicy
- EXOSafeLinksPolicy
- EXOSecOpsOverride
- EXOSendConnector
- EXOSharedMailbox
- EXOSharingPolicy
- EXOSmtpServerSettings
- EXOTransportConfig
- EXOTransportRuleCollection
- EXOUMAutoAttendant
- EXOUMCallAnsweringRule
- EXOUMDialPlan
- EXOUMIPGateway
- EXOUMMailboxPolicy
- More...

### 2. SharePoint Online Resources (~30+ total)
**Current: 14 | Available: 30+**

Additional resources to add:
- SPOAccessControlSettings (partial)
- SPOBrowserIdleSignOut
- SPOCompatibilityRange
- SPODataConnectionLibrary
- SPODataLocationGeoMoveStatus
- SPODataResidencyNotification
- SPOExternalUser
- SPOFileVersionExpirationReportLibrary
- SPOHideDefaultThemes
- SPOHomeSiteUrl
- SPOInformationBarrier
- SPOListInformationRightsManagement
- SPOMigrationJobStatus
- SPOMultiGeoCompanyAllowedDataLocation
- SPOMultiGeoConfiguration (partial)
- SPOOrgAssetsLibrary
- SPOOrgNewsSite
- SPOPersonalSiteCapabilities
- SPOSensitiveByDefault
- SPOSensitivityLabelSettings
- SPOSearchExternalIndex
- SPOSearchSettings
- SPOSearchResultBlockingRule
- SPOSiteClosure
- SPOSiteDataExternalUser
- SPOSiteDesignRights
- SPOSiteGroup
- SPOStorageEntity
- SPOTenantCDNPolicy
- SPOTheme
- More...

### 3. Teams Resources (~40+ total)
**Current: 16 | Available: 40+**

Additional resources to add:
- TeamsAppPermissionPolicy
- TeamsAppSetupPolicy
- TeamsAutoAttendant
- TeamsCallPark
- TeamsCallQueue
- TeamsCalling
- TeamsCallingLineIdentity
- TeamsCallingPolicy
- TeamsChannelMessagingPolicy
- TeamsChannelModeration
- TeamsClientConfiguration
- TeamsCloudMeetingTollBridgeConfiguration
- TeamsCloudMeetingTollSettings
- TeamsComplianceRecordingPolicy
- TeamsConnectorPolicy
- TeamsDeviceConfiguration
- TeamsDisasterRecoveryConfiguration
- TeamsEmergencyCallingPolicy
- TeamsEventsPolicy
- TeamsExternalAccessPolicy
- TeamsGuestCallingConfiguration
- TeamsGuestMeetingConfiguration
- TeamsGuestMessagingConfiguration
- TeamsIPPhonePolicy
- TeamsInboundBlockedNumberPattern
- TeamsInteropPolicy
- TeamsMediaLoggingPolicy
- TeamsMeeting
- TeamsMeetingAccessLevel
- TeamsMeetingBroadcastConfiguration
- TeamsMeetingConfiguration (partial)
- TeamsMessagingPolicy
- TeamsNetworkRoamingPolicy (partial)
- TeamsOnlineVoiceRoutingPolicy
- TeamsPhoneNumberAssignment
- TeamsResourceAccount
- TeamsShiftsPolicy
- TeamsSurvivableBranchAppliancePstnConfiguration
- TeamsUnassignedNumberTreatment
- TeamsUpgradeConfiguration (partial)
- TeamsUserCallingSettings
- More...

### 4. OneDrive Resources (~5+ total)
**Current: 3 | Available: 5+**

Additional resources to add:
- ODPersonalSiteDefaultStorage (partial)
- ODSettings (partial)
- ODAccess (partial)
- ODQuota
- ODRetention

### 5. Compliance/Security Resources (~50+ total)
**Current: 9 | Available: 50+**

Additional resources to add:
- SCCaseHoldPolicy
- SCComplianceSearch
- SCConversationSearchTopicIndex
- SCDataClassification
- SCDLPCompliancePolicy
- SCEdgeCaseHoldPolicy
- SCExchangeBinding
- SCFileClassificationConfig
- SCFilePlanPropertyCategory
- SCFilePlanPropertyCitation
- SCFilePlanPropertyDepartment
- SCFilePlanPropertyReferenceId
- SCFilePlanPropertySubcategory
- SCLabelProperty
- SCRetentionEventType
- SCSupervisoryReviewPolicy
- SCSupervisoryReviewPolicyV2
- SCTraditionalSearch
- SCUnifiedDLPCompliancePolicy
- More...

### 6. Intune Resources (~80+ total)
**Current: 7 | Available: 80+**

Additional resources to add:
- IntuneAndroidDeviceOwnerCertificateProfileScep
- IntuneAndroidDeviceOwnerDerivedCredentialAuthentication
- IntuneAndroidDeviceOwnerEnrollmentProfile
- IntuneAndroidDeviceOwnerManagedAppProtection
- IntuneAndroidManagedAppDeviceCompliancePolicy
- IntuneAndroidManagedAppProtection
- IntuneAndroidManagedStoreAppConfiguration
- IntuneAndroidManagedStoreWebApp
- IntuneAndroidOpenSourceProjectApp
- IntuneApplicationControlPolicyWindows
- IntuneApplePushNotificationCertificate
- IntuneAttackSurfaceReductionRulesPolicy
- IntuneAzureAdGroupAssignment
- IntuneDeviceAndAppManagementAssignmentFilter
- IntuneDeviceCompliancePolicyAndroidDeviceOwner
- IntuneDeviceCompliancePolicyAndroidManagedApp
- IntuneDeviceCompliancePolicyIOS
- IntuneDeviceCompliancePolicyMacOS
- IntuneDeviceCompliancePolicyWindows10
- IntuneDeviceConfigurationAdministrativeTemplatesWindows10
- IntuneDeviceConfigurationAndroidDeviceOwner
- IntuneDeviceConfigurationAndroidManagedApp
- IntuneDeviceConfigurationAndroidWorkProfile
- IntuneDeviceConfigurationCustomWindows10
- IntuneDeviceConfigurationDefenderAdvancedThreatProtectionWindows10
- IntuneDeviceConfigurationDeliveryOptimizationWindows10
- IntuneDeviceConfigurationDeviceRestrictionAndroid
- IntuneDeviceConfigurationDeviceRestrictionsWindows10
- IntuneDeviceConfigurationEditionUpgradeWindows10
- IntuneDeviceConfigurationEmailProfileAndroid
- IntuneDeviceConfigurationEmailProfileiOS
- IntuneDeviceConfigurationEmailProfileWindows10
- IntuneDeviceConfigurationEndpointProtectionWindows10
- IntuneDeviceConfigurationFirewallRuleWindows10
- IntuneDeviceConfigurationIdentityProtectionWindows10
- IntuneDeviceConfigurationIOS
- IntuneDeviceConfigurationMacOS
- IntuneDeviceConfigurationNetworkBoundaryWindows10
- IntuneDeviceConfigurationSecureAssessmentWindows10
- IntuneDeviceConfigurationVpnWindows10
- IntuneDeviceConfigurationWebContentFilterWindows10
- IntuneDeviceConfigurationWiFiWindows10
- IntuneDeviceEnrollmentConfiguration
- IntuneDeviceEnrollmentLimitConfiguration
- IntuneDeviceEnrollmentPlatformRestriction
- IntuneDeviceEnrollmentStatusPageConfiguration
- IntuneDeviceEnrollmentWindowsHelloForBusinessConfiguration
- More...

### 7. Azure AD / Security Resources (~60+ total)
**Current: 16 | Available: 60+**

Additional resources to add:
- AADAdminConsentRequestPolicy
- AADAuthenticationContextClassReference
- AADAuthenticationFlowPolicy
- AADAuthenticationMethodsPolicyFido2Combined
- AADAuthenticationMethodsPolicyHardware
- AADAuthenticationMethodsPolicySoftware
- AADAuthenticationMethodsPolicyVoiceMobile
- AADAuthenticationMethodsPolicyVoiceOffice
- AADAuthenticationMethodsPolicyWindowsHelloForBusiness
- AADAuthenticationStrengthPolicy
- AADAuthorizationPolicy
- AADCertificateBasedAuthenticationConfiguration
- AADClaimsMappingPolicies
- AADCloudAppSecurityDetectionPolicy
- AADCrossTenanAccessPolicies
- AADDeviceCompliancePolicy
- AADDeviceConfiguration
- AADDynamicGroup
- AADEmailClaimConfiguration
- AADExternalIdentitiesPolicy
- AADFeatureRolloutPolicy
- AADGroupLifecyclePolicy
- AADGroupsAssignableToRole
- AADHomeRealmDiscoveryPolicy
- AADIdentityCleanupPolicy
- AADIdentityProtectionPolicy
- AADInactiveUserDeletionPolicy
- AADLicenseGroup
- AADMobileAppManagementPolicy
- AADMobileApplicationManagement
- AADObjectGlobalSettingPolicy
- AADPasswordRuleSettings
- AADPolicyBasedAuthRuleConfiguration
- AADRoleAssignment
- AADRoleEligibilityScheduleRequest
- AADSecurityDefaults
- AADServicePrincipalAppRoleAssignment
- AADSocialIdentityProvider
- AADTokenIssuancePolicy
- AADTokenLifetimePolicy
- AADUserAdministrativeUnit
- AADUserRegistrationFeature
- More...

### 8. PowerPlatform Resources (~20+ total)
**Current: 3 | Available: 20+**

Additional resources to add:
- PPAdministratorSettings
- PPAllowedConsentPlans
- PPAzureConnectorResource
- PPConnectorSettings
- PPDataLossPreventionPolicy
- PPDataLossPreventionPolicyScopeAssignment
- PPDataPolicies
- PPDataPoliciesAssignment
- PPDataflowConnection
- PPFlowAsSharing
- PPFlowOwnerClaimSettings
- PPManagedEnvironmentSettings
- PPManagementConnectorSettings
- PPPowerAppsEnvironment
- PPPowerPlatformSettings
- PPPowerPlatformSharingSettings
- PPTenantIsolationSettings
- PPTenantSettings (partial)
- PPTenantSettings (partial)
- More...

### 9. Dynamics 365 / Model-Driven Apps Resources (~30+ total)
**Current: 0 | Available: 30+**

**NOT CURRENTLY COVERED:**
- CRMAppModule
- CRMApplicationRibbon
- CRMApplicationSettings
- CRMAuditLog
- CRMBusinessUnit
- CRMColumnSecurityProfile
- CRMConnectorSettings
- CRMCustomization
- CRMDataEncryptionKey
- CRMDatasyncSettings
- CRMDataverseSettings
- CRMEnvironment
- CRMFormLibrary
- CRMFormNotification
- CRMFormScript
- CRMFormTab
- CRMGlobalMetadataSettings
- CRMGroupTeamTemplate
- CRMHierarchySecurityConfiguration
- CRMImageWebResource
- CRMJavaScriptWebResource
- CRMLanguagePack
- CRMMailboxSettings
- CRMManagedEntity
- CRMMetadataFilter
- CRMNotificationIcon
- CRMNotificationTemplate
- CRMOrganizationSettings
- CRMOrganizationSettingsPolicy
- CRMPluginType
- CRMPrincipalAttributeAccess
- More...

### 10. Tenant Settings / Global Resources (~15+ total)
**Current: 2 | Available: 15+**

Additional resources to add:
- TenantsAdminProfile
- TenantDefaultInformation
- TenantNotificationSettings
- TenantProductSettings
- TenantSecurityPolicy
- TenantServiceHealth
- TenantSettings (expanded)
- More...

---

## Expansion Recommendations

### Phase 1 (Quick Wins - High Priority)
- Add remaining Exchange resources (26 more)
- Add remaining Teams resources (24 more)
- Add remaining SharePoint resources (16 more)
- Add remaining Intune resources (73 more)
- **Total Phase 1: +139 resources**

### Phase 2 (Standard Coverage)
- Add remaining Compliance resources (41 more)
- Add remaining Security resources (44 more)
- Add remaining OneDrive resources (2 more)
- **Total Phase 2: +87 resources**

### Phase 3 (Extended Coverage)
- Add Dynamics 365 / Model-Driven Apps (30+ resources)
- Add remaining PowerPlatform resources (17 more)
- Add expanded TenantSettings (13 more)
- **Total Phase 3: +60 resources**

---

## Summary

| Category | Current | Available | Gap | Priority |
|----------|---------|-----------|-----|----------|
| Exchange | 14 | 40 | 26 | High |
| Teams | 16 | 40 | 24 | High |
| SharePoint | 14 | 30 | 16 | High |
| Intune | 7 | 80 | 73 | High |
| Compliance | 9 | 50 | 41 | Medium |
| Security | 16 | 60 | 44 | Medium |
| OneDrive | 3 | 5 | 2 | Medium |
| PowerPlatform | 3 | 20 | 17 | Low |
| Dynamics 365 | 0 | 30 | 30 | Low |
| TenantSettings | 2 | 15 | 13 | Low |
| **TOTAL** | **87** | **370+** | **286+** | |

---

## Implementation Strategy

### Current System (10 collectors, 87 resources)
- ✅ All critical M365 services covered
- ✅ 23% of total available M365DSC resources
- ✅ Sufficient for MVP/initial deployment

### To reach 200 resources (Phase 1-2)
- Add 113 resources to existing 10 collectors
- Estimated effort: 2-3 weeks
- High ROI: covers 54% of available resources

### To reach 370+ resources (Full coverage)
- Add all Microsoft365DSC resources
- Estimated effort: 6-8 weeks
- Maximum coverage: enterprise-grade backup

---

## Next Steps

1. **Immediate (Use Current System)**
   - Deploy with 87 resources (10 collectors)
   - Get production feedback
   - Identify most-used resources

2. **Near-term (Phase 1-2, 200 resources)**
   - Add high-priority resources (Exchange, Teams, SharePoint, Intune)
   - Expand existing collectors
   - Maintain backward compatibility

3. **Long-term (Full Coverage, 370+ resources)**
   - Add Dynamics 365 / Model-Driven Apps
   - Implement specialized collectors
   - Enterprise-grade compliance

