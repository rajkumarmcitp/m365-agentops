# M365DSC Module Coverage Analysis & Enhancement Plan

**Date:** 2026-07-16  
**Total M365DSC Resources:** 533  
**Current Backup Coverage:** 120 resources  
**Coverage Gap:** 413 resources (77% missing)  

## Executive Summary

The M365DSC module provides **533 DSC resources** covering all M365 services comprehensively. Our current backup system captures only **~120 resources (23%)**, leaving a significant gap of **413 resources (77%)** that could be integrated.

### Current State vs Available Coverage

| Service | Available Resources | Currently Captured | Gap | Priority |
|---------|-------------------|-------------------|-----|----------|
| **Entra ID (AAD)** | 96 | 82 | 14 | 🟡 Medium |
| **Exchange Online (EXO)** | 100 | 39 | 61 | 🔴 High |
| **Intune** | 164 | 84 | 80 | 🔴 High |
| **Teams** | 64 | 6 | 58 | 🔴 High |
| **Security & Compliance (SC)** | 39 | 8 | 31 | 🟠 Medium-High |
| **SharePoint (SPO)** | 23 | 2 | 21 | 🟠 Medium-High |
| **Office 365 (O365)** | 7 | 3 | 4 | 🟡 Medium |
| **Power Platform (PP)** | 6 | 0 | 6 | 🟡 Medium |
| **Azure** | 12 | 0 | 12 | 🟡 Medium |
| **Other Services** | 22 | 0 | 22 | 🟢 Low |
| **TOTAL** | **533** | **120** | **413** | - |

---

## Detailed Service-by-Service Analysis

### 🔴 ENTRA ID (96 resources, 85% coverage)

**Currently Captured (82):**
- Access Review Definitions & Policies
- Applications & Service Principals
- Conditional Access Policies
- Authentication Methods & Policies
- Administrative Units
- Role Assignments & Definitions
- Domains
- Groups & Settings
- Users
- PIM (Privileged Identity Management)
- And 40+ more

**Missing (14 resources):**
1. ✅ AADAccessReviewDefinition
2. ✅ AADAttributeSet
3. ✅ AADConnectorGroupApplicationProxy
4. ✅ AADCustomAuthenticationExtension
5. ✅ AADFeatureRolloutPolicy
6. ✅ AADFilteringPolicy & Rules
7. ✅ AADGroupEligibilitySchedule
8. ✅ AADIdentityAPIConnector
9. ✅ AADNetworkAccess* (Forwarding, Settings)
10. ✅ AADPIMGroupSetting
11. ✅ AADRemoteNetwork
12. ✅ AADRoleManagementPolicyRule
13. ✅ AADRoleSetting
14. ✅ AADSocialIdentityProvider
15. ✅ AADVerifiedIdAuthority*

**Recommendation:** Add remaining 14 for 100% coverage

---

### 🔴 EXCHANGE ONLINE (100 resources, 39% coverage)

**Currently Captured (39):**
- Accepted Domains
- Address Books & Policies
- Anti-spam & Anti-phishing Policies
- ATP (Advanced Threat Protection)
- Data Classifications
- Distribution Groups
- Email Address Policies
- Hosting Policies
- Mailbox Audit Bypass
- Mailbox Policies
- Malware & Phishing Filters
- Organization Config
- Retention Policies
- Role Groups & Assignments
- Safe Attachments & Links
- And more

**Missing (61 resources - CRITICAL):**

**Authentication & Migration (10):**
- EXOActiveSyncDeviceAccessRule
- EXOApplicationAccessPolicy
- EXOAuthenticationPolicy
- EXOAuthenticationPolicyAssignment
- EXOAvailabilityAddressSpace
- EXOAvailabilityConfig
- EXOMigration
- EXOMigrationEndpoint
- EXOOnPremisesOrganization
- EXOPartnerApplication

**Management & Roles (6):**
- EXOManagementRole
- EXOManagementRoleAssignment
- EXOManagementRoleEntry
- EXOManagementScope
- EXOOfflineAddressBook
- EXOOrganizationRelationship

**Advanced Policies (25):**
- EXODataAtRestEncryption* (2)
- EXODataEncryptionPolicy
- EXODynamicDistributionGroup
- EXOEOPProtectionPolicyRule
- EXOFocusedInbox
- EXOGroupSettings
- EXOIntraOrganizationConnector
- EXOMailboxAutoReply*
- EXOMailboxCalendarConfiguration
- EXOMailboxIRMAccess
- EXOMailboxPermission
- EXOMailContact
- EXOMailboxSettings
- EXOPhishSimOverrideRule
- EXOPolicyTipConfig
- EXOPlace
- EXOSecOpsOverrideRule
- EXOSharedMailbox
- EXOSweepRule
- EXOTenantAllowBlockListItems (2)

**Overall/Other (5):**
- EXOCASMailboxSettings
- EXOCalendarProcessing
- EXOExternalInOutlook
- EXOGroupSettings
- EXOServicePrincipal

**Recommendation:** Critical to add top 30 missing items (migration, mgmt, encryption, advanced policies)

---

### 🔴 INTUNE (164 resources, 51% coverage)

**Currently Captured (84):**
- Device Compliance Policies
- Device Configuration Policies
- App Management
- App Protection Policies
- Security Baselines
- Device Categories
- Enrollment Policies
- Role Assignments & Definitions
- And more

**Missing (80 resources - CRITICAL):**

**Device Configurations (45):**
- Account Protection Policies (3)
- App Control Policies (2)
- Antivirus Policies & Exclusions (5)
- AppIsolation & BrowserIsolation (2)
- Compliance Scripts (2)
- Device Control & Remediation (2)
- Disk Encryption (4)
- Endpoint Detection & Response (3)
- Exploit Protection
- Firewall Rules & Policies (3)
- Platform Scripts (3)
- WiFi Configurations (7)
- VPN Configurations (3)
- And more

**Mobile App Management (15):**
- Android Managed Store Config
- App Categories
- LOB Apps (Android, iOS, Windows, macOS)
- Managed Google Play
- Microsoft Store Apps
- Office Suite Apps
- Store Apps
- Web Links
- Win32 Apps
- And more

**Windows Autopilot & Hybrid (8):**
- AutoPilot Device Preparation (2)
- AutoPilot Deployment Profiles (2)
- AutoPilot Device Cleanup
- AutoPilot Enrollment Status Page
- Windows Backup Configuration
- Windows Hello for Business

**Other (10):**
- Alert Rules
- Apple MDM
- Azure Network Connection
- Cloud Provisioning Policy
- Corporate Device Identifier
- Customization Branding
- Device Management Settings
- Derived Credentials
- Mobile Threat Defense
- Policy Sets

**Recommendation:** Add top 40-50 missing items (priority: device configs, mobile app management, autopilot)

---

### 🔴 TEAMS (64 resources, 9% coverage)

**Currently Captured (6):**
- Teams
- Team Channels
- Channel Tabs
- Team Members
- Call Queues
- Call Policies (2)

**Missing (58 resources - CRITICAL):**

**Messaging & Communication (8):**
- TeamsChannelsPolicy
- TeamsFilesPolicy
- TeamsMessagingConfiguration
- TeamsMessagingPolicy
- TeamsCortanaPolicy
- TeamsEnhancedEncryptionPolicy
- TeamsEventsPolicy
- TeamsFeedbackPolicy

**Meeting Policies (8):**
- TeamsAudioConferencingPolicy
- TeamsMeetingPolicy
- TeamsMeetingConfiguration
- TeamsMeetingBroadcastPolicy
- TeamsMeetingBroadcastConfiguration
- TeamsCallingPolicy
- TeamsEmergencyCallingPolicy
- TeamsEmergencyCallRoutingPolicy

**User & Access Control (12):**
- TeamsAppSetupPolicy
- TeamsAppPermissionPolicy
- TeamsGuestMeetingConfiguration
- TeamsGuestCallingConfiguration
- TeamsGuestMessagingConfiguration
- TeamsGroupPolicyAssignment
- TeamsUserPolicyAssignment
- TeamsIPPhonePolicy
- TeamsMobilityPolicy
- TeamsNetworkRoamingPolicy
- TeamsNotificationAndFeedsPolicy
- TeamsVdiPolicy

**Voice & Routing (8):**
- TeamsCallHoldPolicy
- TeamsCallParkPolicy
- TeamsDia InConferencingTenantSettings
- TeamsOnlineVoicemailPolicy
- TeamsOnlineVoicemailUserSettings
- TeamsOnlineVoiceUser
- TeamsPstnUsage
- TeamsVoiceRoute
- TeamsVoiceRoutingPolicy
- TeamsUnassignedNumberTreatment

**Organization & Integration (15):**
- TeamsApplicationInstance
- TeamsClientConfiguration
- TeamsComplianceRecordingPolicy
- TeamsFederationConfiguration
- TeamsOrgWideAppSettings
- TeamsM365App
- TeamsTeam
- TeamsTargetingPolicy
- TeamsTemplatesPolicy
- TeamsTenantDialPlan
- TeamsTenantNetworkRegion
- TeamsTenantNetworkSite
- TeamsTenantNetworkSubnet
- TeamsTenantTrustedIPAddress
- TeamsTranslationRule

**Governance (7):**
- TeamsAIPolicy
- TeamsShiftsPolicy
- TeamsUpdateManagementPolicy
- TeamsUpgradeConfiguration
- TeamsUpgradePolicy
- TeamsWorkloadPolicy
- TeamsUserCallingSettings

**Recommendation:** Add top 30-40 items (priority: messaging, meetings, voice routing)

---

### 🟠 SECURITY & COMPLIANCE (39 resources, 21% coverage)

**Currently Captured (8):**
- DLP Policies & Rules
- Retention Policies & Rules
- Sensitivity Labels
- Role Groups
- Audit Config

**Missing (31 resources):**

**Case Management (5):**
- SCCaseHoldPolicy
- SCCaseHoldRule
- SCComplianceCase
- SCComplianceSearch
- SCComplianceSearchAction

**Advanced Policies (8):**
- SCAuditConfigurationPolicy
- SCAutoSensitivityLabelPolicy & Rule
- SCDeviceConditionalAccessPolicy & Rule
- SCDeviceConfigurationPolicy & Rule
- SCDLPSensitiveInformationType* (2)

**File Plan & Records (6):**
- SCFilePlanProperty* (5: Authority, Category, Citation, Department, ReferenceId, SubCategory)

**Governance (6):**
- SCInsiderRiskPolicy
- SCInsiderRiskEntityList
- SCRecordReviewNotificationTemplateConfig
- SCSupervisoryReviewPolicy & Rule
- SCUnifiedAuditLogRetentionPolicy

**Tags & Filtering (4):**
- SCComplianceTag
- SCLabelPolicy
- SCPolicyConfig
- SCSecurityFilter

**Other (2):**
- SCProtectionAlert
- SCRetentionEventType

**Recommendation:** Add all 31 missing (especially case management, insider risk, file plan)

---

### 🟠 SHAREPOINT (23 resources, 9% coverage)

**Currently Captured (2):**
- SPO Sites
- SPO Sharing Settings

**Missing (21 resources):**

**Tenant Configuration (6):**
- SPOAccessControlSettings
- SPOBrowserIdleSignout
- SPORetentionLabelsSettings
- SPOTenantCdnEnabled & Policy (2)
- SPOTenantSettings

**Site Management (8):**
- SPOApp
- SPOHomeSite
- SPOHubSite
- SPOPropertyBag
- SPOSiteAuditSettings
- SPOSiteDesign & Rights (2)
- SPOSiteGroup
- SPOSiteScript

**Search & Governance (5):**
- SPOSearchManagedProperty
- SPOSearchResultSource
- SPOTheme
- SPOStorageEntity
- SPOUserProfileProperty

**Other (2):**
- SPOOrgAssetsLibrary

**Recommendation:** Add all 21 missing (especially tenant config and site management)

---

### 🟡 OFFICE 365 (7 resources, 43% coverage)

**Currently Captured (3):**
- O365Group
- O365OrgCustomizationSetting
- O365OrgSettings

**Missing (4 resources):**
- O365AdminAuditLogConfig
- O365CopilotSettingsPeopleEnhancedPersonalization
- O365ExternalConnection
- O365SearchAndIntelligenceConfigurations

**Recommendation:** Add all 4 missing

---

### 🟡 POWER PLATFORM (6 resources, 0% coverage)

**Missing ALL (6 resources):**
- PPAdminDLPPolicy
- PPDLPPolicyConnectorConfigurations
- PPPowerAppPolicyUrlPatterns
- PPPowerAppsEnvironment
- PPTenantIsolationSettings
- PPTenantSettings

**Recommendation:** Add all 6 for Power Platform coverage

---

### 🟡 AZURE (12 resources, 0% coverage)

**Missing ALL (12 resources):**
- AzureBillingAccountPolicy
- AzureBillingAccountScheduledAction
- AzureBillingAccountsAssociatedTenant
- AzureBillingAccountsRoleAssignment
- AzureDiagnosticSettings (2)
- AzureRoleAssignmentScheduleRequest
- AzureRoleDefinition
- AzureRoleEligibilityScheduleRequest & Settings (2)
- AzureSubscription
- AzureVerifiedIdFaceCheck

**Recommendation:** Add all 12 for Azure coverage

---

### 🟢 OTHER SERVICES (22 resources, 0% coverage)

**OneDrive (1):**
- ODSettings

**Azure DevOps (4):**
- ADOOrganizationOwner
- ADOPermissionGroup
- ADOPermissionGroupSettings
- ADOSecurityPolicy

**Defender (3):**
- DefenderDeviceAuthenticatedScanDefinition
- DefenderRoleDefinition
- DefenderSubscriptionPlan

**Sentinel (4):**
- SentinelAlertRule
- SentinelSetting
- SentinelThreatIntelligenceIndicator
- SentinelWatchlist

**Fabric (1):**
- FabricAdminTenantSettings

**Commerce (1):**
- CommerceSelfServicePurchase

**Planner (3):**
- PlannerBucket
- PlannerPlan
- PlannerTask

**Spaces/Hubs (2):**
- SHSpaceGroup
- SHSpaceUser

**M365DSC Core (2):**
- M365DSCGraphAPIRuleEvaluation
- M365DSCRuleEvaluation

**Recommendation:** Add priority services (Sentinel for security, Defender, Planner, Commerce)

---

## Enhancement Implementation Plan

### PHASE 1: Critical Gaps (170 resources)
1. **Exchange Online**: Add 30 missing (migration, management, encryption)
2. **Intune**: Add 40 missing (device configs, mobile apps, autopilot)
3. **Teams**: Add 25 missing (messaging, meetings, voice)
4. **Security & Compliance**: Add 15 missing (case management, insider risk)
5. **SharePoint**: Add 15 missing (tenant config, site management)

**Target:** Reach 60%+ coverage

### PHASE 2: Medium Gaps (90 resources)
1. **Exchange Online**: Add remaining 31
2. **Intune**: Add remaining 40
3. **Teams**: Add remaining 33
4. **Security & Compliance**: Add remaining 16
5. **SharePoint**: Add remaining 6

**Target:** Reach 80%+ coverage

### PHASE 3: Extended Coverage (70 resources)
1. **Entra ID**: Add remaining 14
2. **Office 365**: Add all 4
3. **Power Platform**: Add all 6
4. **Azure**: Add all 12
5. **Other Services**: Add priority services

**Target:** Reach 95%+ coverage

---

## Backup & Restore Page Enhancements

### Component Selection UI
```
Service Filter
├─ Entra ID (96 resources, 82/96 enabled)
├─ Exchange Online (100 resources, 39/100 enabled)
├─ Intune (164 resources, 84/164 enabled)
├─ Teams (64 resources, 6/64 enabled)
├─ Security & Compliance (39 resources, 8/39 enabled)
├─ SharePoint (23 resources, 2/23 enabled)
├─ Office 365 (7 resources, 3/7 enabled)
├─ Power Platform (6 resources, 0/6 enabled)
├─ Azure (12 resources, 0/12 enabled)
└─ Other Services (22 resources, 0/22 enabled)

Component Selector
├─ Search bar (filter by name)
├─ Category filter
├─ Enable all / Disable all buttons
├─ Component list with:
│  ├─ Checkbox
│  ├─ Name
│  ├─ Description
│  ├─ Service
│  ├─ Resource count estimate
│  └─ Coverage status
└─ Summary (X components selected, Y resources estimated)
```

### Selective Restore Enhancement
Integrate M365DSC resource knowledge into restore:
- Show available components by service
- Allow filtering to restore by service
- Show estimated resources per component
- Group related components together
- Provide component dependency information

---

## Implementation Roadmap

**Week 1-2:** Phase 1 (170 resources)
- Add Exchange Online enhancements
- Add Intune critical components
- Add Teams core policies
- Update backup config

**Week 3-4:** Phase 2 (90 resources)
- Complete Exchange Online, Intune, Teams
- Add Compliance & SharePoint
- Update backup config
- Enhanced testing

**Week 5-6:** Phase 3 (70 resources)
- Entra ID completion
- Power Platform & Azure
- Other services
- Full integration testing

**Expected Result:**
- **From:** 120 resources (23% coverage)
- **To:** 533 resources (100% coverage)
- **Gain:** +413 resources (+345% improvement)

---

## Compliance & Governance Impact

✅ **GDPR:** Complete user & consent tracking (Entra ID + Teams)
✅ **HIPAA:** Device management, encryption, access control
✅ **SOC 2:** Comprehensive policy documentation, audit trails
✅ **CCPA:** Data classification, retention, deletion policies
✅ **NIST:** Complete configuration management baseline

---

**Next Steps:**
1. Prioritize Phase 1 implementation
2. Update backup-restore pages with component selector
3. Create parallel implementation for each service
4. Integration testing across all 10 service categories
5. Documentation for new components

