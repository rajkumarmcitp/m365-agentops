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

### **Backup Endpoints**
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
POST   /api/backup/m365/validate-dsc                   - Validate DSC export
```

### **Restore Endpoints (NEW)**
```
GET    /api/backup/m365/{backupID}/resources/{resourceType} - Get specific resource type
GET    /api/backup/m365/{backupID}/resources/{resourceType}/{resourceName} - Get single resource config
POST   /api/backup/m365/restore/dry-run                - Preview restore (no changes made)
POST   /api/backup/m365/restore/single                 - Restore single configuration
POST   /api/backup/m365/restore/multiple               - Restore multiple configurations
GET    /api/backup/m365/restore/history                - Get restore operation history
GET    /api/backup/m365/restore/{restoreID}            - Get restore operation status
POST   /api/backup/m365/restore/{restoreID}/rollback   - Undo restore operation
GET    /api/backup/m365/restore/conflicts/{backupID}   - Check for conflicts before restore
```

### **Configuration Endpoints**
```
POST   /api/backup/m365/schedule                       - Save schedule config
GET    /api/backup/m365/schedule                       - Get schedule config
GET    /api/backup/m365/logs                           - Get backup logs
POST   /api/backup/m365/settings                       - Save backup settings
GET    /api/backup/m365/settings                       - Get backup settings
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

## Restore Capability (NEW)

### **Why Restore?**

**Scenario 1: Accidental Deletion**
```
A Distribution Group "Finance Team" was accidentally deleted.
Admin restores it from backup taken yesterday.
✅ DG is back with all members intact
```

**Scenario 2: Configuration Error**
```
A Transport Rule was modified incorrectly and breaking mail flow.
Admin restores the rule to its backup version.
✅ Mail flow restored, no downtime
```

**Scenario 3: Compliance Rollback**
```
A Retention Policy was changed incorrectly.
Admin restores the policy to backup version.
✅ Compliance restored to known good state
```

**Scenario 4: Testing Changes**
```
Before applying a Teams policy change to production:
1. View the backed-up version
2. Compare with current version
3. Test in dev environment (via DSC export)
4. Apply to prod if validated
✅ Reduces risk of bad changes
```

---

### **Restore Architecture**

```
┌─────────────────────────────────────────┐
│  Admin selects backup & resource(s)     │
└────────────┬────────────────────────────┘
             │
             ▼
┌─────────────────────────────────────────┐
│  1. Validation Phase                    │
│  - Check resource exists in M365        │
│  - Check for conflicts                  │
│  - Verify permissions                   │
│  - Generate conflict report             │
└────────────┬────────────────────────────┘
             │
             ▼
┌─────────────────────────────────────────┐
│  2. Dry-Run Phase (Optional)            │
│  - Preview what will change             │
│  - Show before/after comparison         │
│  - No changes made to M365              │
└────────────┬────────────────────────────┘
             │
             ▼
┌─────────────────────────────────────────┐
│  3. Confirmation Phase                  │
│  - Admin reviews changes                │
│  - Confirms restore operation           │
│  - Action is logged                     │
└────────────┬────────────────────────────┘
             │
             ▼
┌─────────────────────────────────────────┐
│  4. Restore Phase                       │
│  - Apply configuration to M365          │
│  - Use M365DSC Set-DSCConfiguration     │
│  - Monitor for errors                   │
└────────────┬────────────────────────────┘
             │
             ▼
┌─────────────────────────────────────────┐
│  5. Verification Phase                  │
│  - Verify restore succeeded             │
│  - Compare with backup config           │
│  - Log restore operation                │
│  - Create rollback backup               │
└────────────┬────────────────────────────┘
             │
             ▼
┌─────────────────────────────────────────┐
│  ✅ Restore Complete                    │
│  - Notify admin of success              │
│  - Store restore operation in history   │
│  - Automatic rollback backup created    │
└─────────────────────────────────────────┘
```

---

### **Restore Types**

#### **1. Single Resource Restore**
Restore one specific resource (e.g., one Distribution Group)

```powershell
# Example: Restore "Finance Team" Distribution Group
POST /api/backup/m365/restore/single
{
  "backupID": "2026-07-14-001",
  "resourceType": "EXODistributionGroup",
  "resourceName": "finance@contoso.com",
  "dryRun": false,
  "createRollback": true
}

Response:
{
  "restoreID": "restore-2026-07-14-abc123",
  "status": "completed",
  "resourceType": "EXODistributionGroup",
  "resourceName": "Finance Team",
  "changesApplied": {
    "members": ["user1@contoso.com", "user2@contoso.com"],
    "managedBy": ["admin@contoso.com"],
    "displayName": "Finance Team"
  },
  "executionTime": "45 seconds",
  "timestamp": "2026-07-14T10:30:00Z"
}
```

#### **2. Multiple Resources Restore**
Restore multiple resources at once (e.g., all Teams policies)

```powershell
POST /api/backup/m365/restore/multiple
{
  "backupID": "2026-07-14-001",
  "resourceType": "TeamsMeetingPolicy",
  "resourceNames": [
    "Global",
    "FrontlineWorkers",
    "ExternalPartners"
  ],
  "dryRun": true  # Preview only
}
```

#### **3. By Resource Type**
Restore all resources of a type from a backup

```powershell
POST /api/backup/m365/restore/multiple
{
  "backupID": "2026-07-14-001",
  "resourceType": "EXOTransportRule",
  "restoreAll": true,  # All transport rules
  "dryRun": false
}
```

#### **4. Dry-Run (Preview Only)**
Preview what will be restored without making changes

```powershell
POST /api/backup/m365/restore/dry-run
{
  "backupID": "2026-07-14-001",
  "resourceType": "SPOSharingSettings",
  "resourceName": "tenant-wide"
}

Response shows:
- Current configuration in M365
- Backed-up configuration
- Differences (what will change)
- Potential issues/conflicts
```

---

### **Restore UI Components**

#### **Page: Restore Configuration**

**Section 1: Select Backup**
```
Backup Selection
[Dropdown: Select Backup Date]
  ├── 2026-07-14 (3 hours ago) - 85 resources
  ├── 2026-07-13 (1 day ago) - 84 resources
  └── 2026-07-12 (2 days ago) - 83 resources

Service Filter:
[Tabs: All] [Exchange] [Teams] [SharePoint] [Compliance]
```

**Section 2: Browse Backed-up Resources**
```
Resource Type Filter: [Dropdown] EXODistributionGroup

Resources in Backup:
┌────────────────────────────────────────┐
│ Resource Name        │ Type      │ ✓   │
├────────────────────────────────────────┤
│ Finance Team         │ DG        │ [ ] │
│ HR Team              │ DG        │ [ ] │
│ Legal Team           │ DG        │ [ ] │
│ Marketing Team       │ DG        │ [✓] │
│ Sales Team           │ DG        │ [ ] │
└────────────────────────────────────────┘

Selected: 1 resource
```

**Section 3: Preview Changes**
```
Preview: Marketing Team (Distribution Group)

Current Configuration (Live in M365):
- DisplayName: Marketing Team
- Members: user1, user2, user3 (3 members)
- ManagedBy: admin@contoso.com

Backed-up Configuration (2026-07-14):
- DisplayName: Marketing Team
- Members: user1, user2 (2 members)  [CHANGED]
- ManagedBy: admin@contoso.com

⚠️ Changes to Apply:
  🔄 Members: Will remove user3

Conflicts Detected: None
```

**Section 4: Restore Options**
```
☑️  Dry Run (Preview only - don't make changes)
☑️  Create Rollback Backup (Auto-backup current state before restore)
☑️  Send Notification Email (Notify team after restore)

Affected Resources:
- 1 Distribution Group will be modified
- Changes will affect 5 users
```

**Section 5: Confirmation**
```
[Preview Changes] [Dry Run] [Restore Now]

⚠️ Warning: This operation cannot be undone without using rollback backup
```

---

### **Restore History Tracking**

**Restore Record (SharePoint List)**
```
RestoreID                GUID
BackupID               GUID (which backup was used)
ResourceType           Text (EXODistributionGroup, TeamsTeam, etc.)
ResourceNames          Text (comma-separated if multiple)
RestoreDate            DateTime
Status                 Choice (InProgress, Completed, Failed, RolledBack)
DryRun                 Boolean
RestoredBy             User (who initiated restore)
ExecutionTime          Number (seconds)
ChangesSummary         Text (what changed)
ConflictsDetected      Boolean
ErrorMessage           Text (if failed)
RollbackID             GUID (link to rollback backup if created)
NotificationSent       Boolean
Timestamp              DateTime
```

**Restore Dashboard**
```
Recent Restore Operations:
┌─────────────────────────────────────────────┐
│ Date        │ Resource      │ Status │ By    │
├─────────────────────────────────────────────┤
│ 2026-07-14  │ Finance Team  │ ✅     │ Admin │
│ 2026-07-12  │ 3 Teams      │ ✅     │ Admin │
│ 2026-07-10  │ Policy (DRY)  │ Info   │ Admin │
└─────────────────────────────────────────────┘
```

---

### **Conflict Detection**

Before restore, system checks for:

1. **Resource No Longer Exists**
   ```
   ⚠️ Distribution Group "OldTeam" no longer exists
   Option: Skip restore for this resource
   ```

2. **Resource Changed Since Backup**
   ```
   ℹ️ "Finance Team" has new members not in backup
   Conflict Type: Member changes
   Options: 
     • Overwrite current members (restore backup)
     • Keep current members
     • Merge (keep new, restore old)
   ```

3. **Dependent Resources Missing**
   ```
   ⚠️ Transport Rule depends on Connector "SMTP-Relay"
   This connector not found in M365
   Action Required: Create connector first
   ```

4. **Permission Issues**
   ```
   ❌ Insufficient permissions to restore:
   - Need: Exchange Administrator role
   - Have: Teams Administrator role
   Action: Contact global admin
   ```

---

### **Automatic Rollback Backup**

When restoring a configuration, system automatically:

1. **Pre-Restore Backup**
   - Takes snapshot of current config
   - Stores as "Rollback Backup"
   - Links to restore operation

2. **Rollback Capability**
   ```
   POST /api/backup/m365/restore/{restoreID}/rollback
   
   If restore caused issues:
   - Admin can undo it
   - Restores the pre-restore state
   - Creates audit trail
   ```

3. **Example Timeline**
   ```
   14:00 - Admin triggers restore of Finance Team DG
   14:00 - System creates rollback backup (current state)
   14:01 - System applies restored configuration
   14:02 - Restore complete ✅
   
   If issues found at 14:30:
   14:30 - Admin clicks "Rollback"
   14:31 - System restores pre-restore state
   14:32 - Back to state before 14:00 ✅
   ```

---

### **Restore Best Practices**

**✅ DO:**
- Use Dry-Run first to preview changes
- Enable Rollback Backup (automatic safety)
- Restore during off-peak hours
- Test in non-production first
- Document why restore was needed
- Notify team about restore operations

**❌ DON'T:**
- Restore production config to test environment without review
- Ignore conflict warnings
- Restore multiple critical resources at once
- Skip dry-run for critical resources
- Restore without approval process

---

### **Restore Role-Based Access**

| Role | Can View Backups | Can Dry-Run | Can Restore | Can Rollback |
|------|------------------|------------|------------|--------------|
| User | ❌ | ❌ | ❌ | ❌ |
| Admin | ✅ | ✅ | ❌ | ❌ |
| Super Admin | ✅ | ✅ | ✅ | ✅ |

---

### **Restore Logging & Audit Trail**

Every restore operation creates audit log entry:

```
Restore Operation Log Entry:

Timestamp: 2026-07-14T10:30:15Z
Operation: Restore Single Configuration
Admin: john.admin@contoso.com
BackupDate: 2026-07-14T07:00:00Z (3 hours ago)
ResourceType: EXODistributionGroup
ResourceName: Finance Team
Action: Restore
Status: ✅ Completed
ExecutionTime: 45 seconds

Changes Applied:
+ Members added: None
- Members removed: None
~ Members modified: user3@contoso.com (removed)
~ DisplayName: "Finance Team" (no change)

Rollback: Automatic backup created [RB-2026-07-14-123]
Notification: Email sent to team

Approval: Not required (within policy)
```

---



✅ Backup all M365DSC-supported resources  
✅ Change detection accurately identifies modifications  
✅ Backup completes in < 15 minutes (per service)  
✅ DSC export format ready for deployment  
✅ Admin can configure backup schedule  
✅ Email notifications on success/failure  
✅ Backup history retained per policy  
✅ Dashboard shows status & trends  

### **Restore Metrics (NEW)**
✅ Single resource restore completes in < 2 minutes  
✅ Dry-run shows accurate preview of changes  
✅ Conflict detection identifies all issues before restore  
✅ Automatic rollback backup created before restore  
✅ Restore operation audited and logged  
✅ Role-based access properly enforced  
✅ Admin can rollback restore within 24 hours  
✅ Restore history tracked with before/after comparison  

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

4. **Build Backup Dashboard**
   - Show backup status
   - Display service-specific history
   - Add trigger capability

5. **Implement Restore UI**
   - Create restore configuration page
   - Add resource browser with checkboxes
   - Implement dry-run preview
   - Add conflict detection warnings

6. **Build Restore Backend**
   - Implement conflict detection logic
   - Create automatic rollback backup system
   - Implement restore verification
   - Add restore history tracking

7. **Add Scheduler**
   - Configure daily/weekly/monthly backups
   - Implement retry logic
   - Send notifications

8. **Advanced Features**
   - Restore approval workflow (for critical resources)
   - Bulk restore operations
   - Scheduled restore testing
   - Compliance reporting (backup/restore audit trail)

---

**Document Version**: 2.0  
**Based on**: M365DSC v1.24+  
**Last Updated**: 2026-07-14  
**Status**: Ready for Implementation
