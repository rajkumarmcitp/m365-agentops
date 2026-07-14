# Microsoft 365 Configuration Backup System - M365DSC Aligned Plan

## Overview
Backup solution aligned with M365DSC (Microsoft 365 Desired State Configuration) resources. Focuses on M365 services only, excludes Azure/Entra Azure-specific services.

**Reference**: [Microsoft 365 DSC GitHub](https://github.com/microsoft/Microsoft365DSC)

## Services & Resources to Backup (Based on M365DSC)

### **TIER 1: Exchange Online**
- `EXOAcceptedDomain`
- `EXOConnector`
- `EXODistributionGroup`
- `EXODistributionGroupMember`
- `EXOInboundConnector`
- `EXOMailboxSettings`
- `EXOMailContact`
- `EXOMobileDeviceManagementPolicy`
- `EXOOrgConfig`
- `EXOOutboundConnector`
- `EXORemoteDomain`
- `EXOTransportRule`
- `EXOTransportRuleCollection`
- `EXOUnifiedGroup`

**Priority**: HIGH - Mail, Groups, Transport Rules

---

### **TIER 2: Microsoft Teams**
- `TeamsChannel`
- `TeamsChannelPolicy`
- `TeamsChannelTab`
- `TeamsDialInConferencingPolicy`
- `TeamsEmergencyCallingPolicy`
- `TeamsEmergencyNumber`
- `TeamsIPPhonePolicy`
- `TeamsMeetingBroadcastPolicy`
- `TeamsMeetingConfiguration`
- `TeamsMeetingPolicy`
- `TeamsNetworkRoamingPolicy`
- `TeamsPSTNUsage`
- `TeamsTeam`
- `TeamsUpgradeConfiguration`
- `TeamsUser`
- `TeamsVoiceRoute`

**Priority**: HIGH - Teams Configuration, Policies

---

### **TIER 3: SharePoint Online**
- `SPOAccessControlSettings`
- `SPOApp`
- `SPOHubSite`
- `SPOMultiGeoConfiguration`
- `SPOPropertyBag`
- `SPOSearchResultsBlockedConfig`
- `SPOSearchSettings`
- `SPOSharingSettings`
- `SPOSite`
- `SPOSiteAuditSettings`
- `SPOSiteDesign`
- `SPOSiteDesignRights`
- `SPOTenantCDNPolicy`
- `SPOUserProfileProperty`

**Priority**: HIGH - Sites, Sharing, Security

---

### **TIER 4: OneDrive**
- `ODSettings`
- `ODPersonalSiteDefaultStorage`
- `ODAccess`

**Priority**: MEDIUM - Storage & Access Settings

---

### **TIER 5: Microsoft 365 Groups**
- `O365GroupsSettings`
- `O365GroupsNamingPolicy`
- `O365GroupsExpiration`

**Priority**: MEDIUM - Group Policies

---

### **TIER 6: Security & Compliance**
- `SCAuditConfigurationPolicy`
- `SCAuditPolicyAssociation`
- `SCCaseHoldPolicy`
- `SCComplianceSearch`
- `SCDLPCompliancePolicy`
- `SCSensitivityLabel`
- `SCRetentionCompliancePolicy`
- `SCRetentionComplianceRule`
- `SCSupervisionPolicy`

**Priority**: MEDIUM-HIGH - Compliance, Data Loss Prevention, Retention

---

### **TIER 7: Power Platform (M365DSC Coverage)**
- `PPPowerAppsEnvironment`
- `PPTenantSettings`
- `PPTenantIsolationSettings`

**Priority**: MEDIUM - Environment & Tenant Settings

---

### **TIER 8: Intune (M365DSC Coverage)**
- `IntuneAppConfiguration`
- `IntuneAppProtectionPolicy`
- `IntuneDeviceCompliance`
- `IntuneDeviceConfiguration`
- `IntuneDeviceEnrollmentPlatformRestriction`
- `IntuneWifiConfiguration`
- `IntuneWindowsUpdateForBusinessConfiguration`

**Priority**: MEDIUM - Device & App Management

---

### **TIER 9: Microsoft 365 Defender & Security**
- `AADApplicationPermission`
- `AADApplicationProxy`
- `AADAuthenticationMethodPolicy`
- `AADAuthenticationStrengthPolicy`
- `AADConditionalAccessPolicy`
- `AADCrossTenantAccessPolicy`
- `AADEnrichmentAttribute`
- `AADExternalIdentityPolicy`
- `AADGroupLifecyclePolicy`
- `AADGroupsAdministrativeUnit`
- `AADGroupSettings`
- `AADRoleAssignment`
- `AADSecurityDefaults`
- `AADServicePrincipal`
- `AADSignInFrequencyPolicy`
- `AADUserAuthenticationMethod`

**Priority**: MEDIUM - Identity, Access, Security Policies

---

### **TIER 10: Microsoft 365 Tenant-Wide Settings**
- `M365DSCRuleEvaluation`
- `O365OrgSettings`

**Priority**: LOW - Org-wide Settings

---

## Data Structure

### **Backup Record (SharePoint List)**
```
BackupID                GUID
BackupDate             DateTime
Status                 Choice (InProgress, Completed, Failed)
ServiceName            Text (EXO, Teams, SPO, etc.)
ResourceType           Text (e.g., EXODistributionGroup, TeamsTeam)
ResourceCount          Number (how many resources backed up)
ConfigHash             Text (SHA-256 hash for change detection)
BackupSize             Number (in bytes)
ComparisonWithPrevious Text (changes identified)
PreviousBackupID       GUID (link to previous backup)
ChangesSummary         Text (what changed)
Error                  Text (if backup failed)
DSCExportPath          Text (path to DSC export in doc library)
CreatedBy              User
CompletedDate          DateTime
Duration               Number (minutes taken)
```

---

## Backend Architecture

### **Backup Collectors (M365DSC Aligned)**

Each service gets a dedicated collector that:

```javascript
class ExchangeOnlineBackupCollector {
  async backup() {
    // Use M365DSC EXO* resources
    // Collect: Accepted Domains, Connectors, Distribution Groups, etc.
    // Generate DSC export format
    // Hash configuration for change detection
  }
  
  async getChanges(previousBackupID) {
    // Compare with previous backup
    // Identify additions, modifications, deletions
  }
}
```

### **Collector List**
1. `ExchangeOnlineCollector` - EXO resources
2. `TeamsCollector` - Teams resources
3. `SharePointCollector` - SPO resources
4. `OneDriveCollector` - OD resources
5. `M365GroupsCollector` - O365 Groups resources
6. `ComplianceCollector` - SC* resources
7. `PowerPlatformCollector` - PP resources
8. `IntuneCollector` - Intune resources
9. `SecurityCollector` - AAD/Security resources
10. `TenantSettingsCollector` - M365DSC Org settings

---

## Implementation Approach

### **Phase 1: Foundation**
- [ ] Setup SharePoint storage structure
- [ ] Create DSC export format handlers
- [ ] Implement hash/comparison logic
- [ ] Create API endpoints

### **Phase 2: TIER 1 Services (Exchange + Teams)**
- [ ] Exchange Online Collector
- [ ] Teams Collector
- [ ] Manual trigger capability
- [ ] View backup results

### **Phase 3: TIER 2-3 Services**
- [ ] SharePoint Collector
- [ ] OneDrive Collector
- [ ] Groups Collector
- [ ] Backup history & comparison

### **Phase 4: Remaining Services**
- [ ] Compliance Collector
- [ ] Power Platform Collector
- [ ] Intune Collector
- [ ] Security Collector
- [ ] Tenant Settings

### **Phase 5: Scheduling & Automation**
- [ ] Scheduler setup
- [ ] Admin settings for schedule
- [ ] Email notifications
- [ ] Retention policies

### **Phase 6: Advanced Features**
- [ ] DSC Export format (ready for deployment)
- [ ] Restore/Deploy capability
- [ ] Differential backups
- [ ] Backup encryption
- [ ] Database migration (from SharePoint to SQL)

---

## M365DSC Export Format

Backups will be stored in DSC format for future deployment:

```powershell
# Example DSC Configuration Export
Configuration M365Backup_2026_07_14 {
    Import-DscResource -ModuleName Microsoft365DSC
    
    EXODistributionGroup "Finance Team"
    {
        Identity              = "finance-team@contoso.com"
        DisplayName          = "Finance Team"
        ManagedBy            = @("admin@contoso.com")
        Members              = @("user1@contoso.com", "user2@contoso.com")
        Ensure               = "Present"
    }
    
    TeamsTeam "Engineering"
    {
        DisplayName          = "Engineering"
        Description          = "Engineering Team"
        Owner                = "engineering-lead@contoso.com"
        Visibility           = "Public"
        Ensure               = "Present"
    }
    
    # ... more resources
}
```

---

## Storage Strategy

### **SharePoint Lists**
- **M365-Backup-Metadata**: Backup records with status
- **M365-Backup-Resources**: Individual resource configurations
- **M365-Backup-Changes**: Change log per backup

### **SharePoint Libraries**
- **M365-Backups-Raw**: Raw backup data (JSON/PSCustomObject)
- **M365-Backups-DSC**: DSC format exports (PowerShell)
- **M365-Backups-Archive**: Old backups (for retention)

### **Future: SQL Database**
```sql
CREATE TABLE Backups (
    BackupID GUID PRIMARY KEY,
    ServiceName VARCHAR(50),
    BackupDate DATETIME,
    Status VARCHAR(20),
    ResourceCount INT,
    ConfigHash VARCHAR(256),
    -- DSC export as NVARCHAR(MAX)
);

CREATE TABLE BackupResources (
    ResourceID GUID PRIMARY KEY,
    BackupID GUID FOREIGN KEY,
    ResourceType VARCHAR(100),
    ResourceName VARCHAR(255),
    Configuration NVARCHAR(MAX),
    Hash VARCHAR(256)
);

CREATE TABLE BackupChanges (
    ChangeID GUID PRIMARY KEY,
    BackupID GUID,
    PreviousBackupID GUID,
    ResourceType VARCHAR(100),
    ChangeType VARCHAR(20), -- Added, Modified, Deleted
    Details NVARCHAR(MAX)
);
```

---

## API Endpoints

```
POST   /api/backup/m365/trigger/{service}              - Trigger backup (EXO, Teams, SPO, etc.)
GET    /api/backup/m365/status                         - Get backup status
GET    /api/backup/m365/status/{service}               - Service-specific status
GET    /api/backup/m365/history                        - List all backups
GET    /api/backup/m365/history/{service}              - Service-specific history
GET    /api/backup/m365/{backupID}                     - Get backup details
GET    /api/backup/m365/{backupID}/dsc-export          - Download DSC format
GET    /api/backup/m365/{backupID}/compare/{previousID} - Compare backups
GET    /api/backup/m365/{backupID}/resources           - List backed up resources
POST   /api/backup/m365/schedule                       - Save schedule config
GET    /api/backup/m365/schedule                       - Get schedule config
GET    /api/backup/m365/logs                           - Get backup logs
POST   /api/backup/m365/settings                       - Save backup settings
GET    /api/backup/m365/settings                       - Get backup settings
POST   /api/backup/m365/validate-dsc                   - Validate DSC export
```

---

## Resource Priority & Backup Order

### **High Priority (Backup Daily)**
```
1. Exchange Online (14 resources)
2. Teams Configuration (15 resources)
3. SharePoint Sites & Settings (14 resources)
4. Compliance Policies (9 resources)
```

### **Medium Priority (Backup Weekly)**
```
5. OneDrive Settings (3 resources)
6. M365 Groups Policies (3 resources)
7. Intune Configurations (8 resources)
8. Security Policies (15 resources)
```

### **Low Priority (Backup Monthly)**
```
9. Power Platform (3 resources)
10. Tenant Settings (2 resources)
```

---

## Change Detection Strategy

### **How It Works**
```
1. Backup A (Day 1) - Hash: ABC123
2. Backup B (Day 2) - Hash: DEF456
   → Hashes don't match = Changes detected
   
3. Compare A vs B
   → Distribution Group added
   → Teams Policy modified
   → Transport Rule deleted
   
4. Generate Summary
   → Show what changed in dashboard
```

### **Change Types**
- **Added**: New resources not in previous backup
- **Modified**: Resource exists but configuration changed
- **Deleted**: Resource was present, now gone
- **Unchanged**: Resource same as before

---

## Success Metrics

✅ Backup all M365DSC-supported resources  
✅ Change detection accurately identifies modifications  
✅ Backup completes in < 15 minutes (per service)  
✅ DSC export format ready for deployment  
✅ Admin can configure backup schedule  
✅ Email notifications on success/failure  
✅ Backup history retained per policy  
✅ Dashboard shows status & trends  

---

## Next Steps

1. **Review M365DSC Resources**
   - Confirm which resources to include
   - Identify dependencies between resources

2. **Setup SharePoint Structure**
   - Create lists for metadata, resources, changes
   - Create libraries for raw & DSC formats

3. **Implement Exchange Collector**
   - Start with EXODistributionGroup
   - Add other critical resources
   - Test change detection

4. **Build Dashboard**
   - Show backup status
   - Display service-specific history
   - Add trigger capability

5. **Add Scheduler**
   - Configure daily/weekly/monthly backups
   - Implement retry logic
   - Send notifications

---

**Document Version**: 2.0  
**Based on**: M365DSC v1.24+  
**Last Updated**: 2026-07-14  
**Status**: Ready for Implementation
