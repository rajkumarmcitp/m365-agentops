# Phase 1 Implementation Guide

## Overview
Phase 1 sets up the foundation for the M365 Configuration Backup System. This includes:
- SharePoint storage structure
- Backend infrastructure (storage manager, agent, routes)
- API endpoints for backup operations
- Configuration schemas

## What's Been Created

### Backend Files

#### 1. **backup-storage.js** - Storage Manager
Location: `/backend/lib/backup-storage.js`

Handles all SharePoint operations:
- Create/update backup records in SharePoint lists
- Save backup resources and changes
- Store backup data files in document libraries
- Retrieve backup history and details
- Delete backups and cleanup

Key Methods:
```javascript
async createBackupRecord(backupData)
async updateBackupStatus(itemId, status, details)
async saveBackupResource(backupId, resource)
async saveBackupChange(backupId, previousBackupId, change)
async saveBackupDataFile(backupId, serviceName, fileFormat, fileContent)
async saveDSCExportFile(backupId, serviceName, dscContent)
async getBackupRecord(backupId)
async getBackupHistory(serviceName, limit)
async getBackupResources(backupId, resourceType)
async getBackupChanges(backupId)
async deleteBackup(backupId)
```

#### 2. **backup-config.js** - Configuration Schemas
Location: `/backend/lib/backup-config.js`

Defines configuration schemas:
- BackupScheduleConfig - Schedule settings
- ServiceBackupConfig - Per-service settings
- NotificationConfig - Email notifications
- RestoreConfig - Restore options
- StorageConfig - SharePoint configuration
- M365_SERVICES - All 10 M365DSC service definitions

Includes:
- 10 M365DSC service definitions
- 86+ resources across all services
- Default configuration values
- Complete schema validation

#### 3. **backup-agent.js** - Core Agent
Location: `/backend/lib/backup-agent.js`

Main backup orchestration engine:
- Coordinates backup operations
- Manages backup collectors
- Detects configuration changes
- Generates change summaries
- Tracks backup status

Key Methods:
```javascript
async backupService(serviceName, options)
async backupAll(options)
async getPreviousBackup(serviceName)
async detectChanges(serviceName, previousBackupId, previousResources, currentResources)
async getBackupStatus(backupId)
generateBackupId(serviceName)
generateHash(data)
```

#### 4. **backup-routes.js** - API Routes
Location: `/backend/routes/backup-routes.js`

Express routes for backup operations:
- POST /api/backup/m365/trigger/:service - Trigger service backup
- POST /api/backup/m365/trigger-all - Backup all services
- GET /api/backup/m365/status - Overall status
- GET /api/backup/m365/status/:service - Service status
- GET /api/backup/m365/history - All backup history
- GET /api/backup/m365/history/:service - Service history
- GET /api/backup/m365/:backupID - Backup details
- GET /api/backup/m365/:backupID/resources - Backup resources
- GET /api/backup/m365/:backupID/changes - Backup changes
- GET /api/backup/m365/services/list - Available services
- GET /api/backup/m365/services/:service - Service details

## SharePoint Setup Required

### Lists to Create

#### 1. **M365-Backup-Metadata** (Main Backup Records)
```
Field Name              | Type          | Description
-----------------------|---------------|------------------
BackupID              | Text (Primary)| Unique backup identifier
BackupDate            | DateTime      | When backup was taken
ServiceName           | Text          | Which service (EXO, Teams, etc.)
Status                | Choice        | InProgress, Completed, Failed
BackupSize            | Number        | Size in bytes
RecordCount           | Number        | Resources count
ConfigHash            | Text          | SHA-256 hash of config
CreatedBy             | Person        | Who triggered backup
Description           | Text          | Backup description
BackupType            | Choice        | Full, Differential
Duration              | Number        | Execution time in seconds
ChangesSummary        | Text          | What changed
Error                 | Text          | Error message if failed
```

#### 2. **M365-Backup-Resources** (Backed-up Resources)
```
Field Name            | Type          | Description
-----------------------|---------------|------------------
BackupID              | Text          | Link to backup
ResourceType          | Text          | Resource type (e.g., EXODistributionGroup)
ResourceName          | Text          | Resource name/display name
ResourceIdentity      | Text          | Unique resource ID
ConfigurationHash     | Text          | SHA-256 hash
Details               | Text          | JSON configuration
CreatedDate           | DateTime      | When resource was backed up
```

#### 3. **M365-Backup-Changes** (Change Log)
```
Field Name            | Type          | Description
-----------------------|---------------|------------------
BackupID              | Text          | Backup ID
PreviousBackupID      | Text          | Previous backup for comparison
ResourceType          | Text          | Type of changed resource
ResourceName          | Text          | Name of changed resource
ChangeType            | Choice        | Added, Modified, Deleted
Details               | Text          | JSON with change details
Severity              | Choice        | Info, Warning, Critical
CreatedDate           | DateTime      | When change was recorded
```

### Document Libraries to Create

#### 1. **M365-Backup-Data** (Raw Backup Files)
Purpose: Store backup data in JSON format
- One file per backup per service
- File naming: `{BackupID}_{ServiceName}_backup.json`
- Retention: Per configured policy (default 90 days)

#### 2. **M365-Backups-DSC** (DSC Exports)
Purpose: Store PowerShell DSC exports
- One file per backup per service
- File naming: `{BackupID}_{ServiceName}_backup.ps1`
- Can be deployed to other tenants
- Retention: Per configured policy

## Environment Variables Required

Add these to your `.env` or `.env.local` file:

```env
# SharePoint Configuration
SHAREPOINT_SITE_ID=your-site-id
SHAREPOINT_BACKUP_LIST_ID=list-id-for-backups
SHAREPOINT_BACKUP_METADATA_LIST_ID=list-id-for-metadata
SHAREPOINT_BACKUP_RESOURCES_LIST_ID=list-id-for-resources
SHAREPOINT_BACKUP_CHANGES_LIST_ID=list-id-for-changes
SHAREPOINT_BACKUP_DATA_LIBRARY_ID=library-id-for-backup-data
SHAREPOINT_BACKUP_DSC_LIBRARY_ID=library-id-for-dsc-exports

# Backup Configuration
BACKUP_RETENTION_DAYS=90
BACKUP_MAX_SIZE=1073741824  # 1 GB in bytes
BACKUP_SCHEDULE_FREQUENCY=Daily
BACKUP_SCHEDULE_TIME=02:00  # 2 AM UTC

# Notifications
BACKUP_NOTIFICATION_EMAIL=admin@contoso.com
BACKUP_NOTIFY_ON_FAILURE=true
BACKUP_NOTIFY_ON_SUCCESS=false
```

## Integration Steps

### 1. Add to server.js

```javascript
import setupBackupRoutes from './routes/backup-routes.js'
import { BackupAgent } from './lib/backup-agent.js'
import { BackupStorageManager } from './lib/backup-storage.js'

// Initialize backup system (after GraphClient is initialized)
const backupStorage = new BackupStorageManager(graphClient, process.env.SHAREPOINT_SITE_ID)
const backupAgent = new BackupAgent(graphClient, {
  siteId: process.env.SHAREPOINT_SITE_ID,
  storage: {
    backupListId: process.env.SHAREPOINT_BACKUP_LIST_ID,
    backupMetadataListId: process.env.SHAREPOINT_BACKUP_METADATA_LIST_ID,
    backupResourcesListId: process.env.SHAREPOINT_BACKUP_RESOURCES_LIST_ID,
    backupChangesListId: process.env.SHAREPOINT_BACKUP_CHANGES_LIST_ID,
    backupDataLibraryId: process.env.SHAREPOINT_BACKUP_DATA_LIBRARY_ID,
    backupDSCLibraryId: process.env.SHAREPOINT_BACKUP_DSC_LIBRARY_ID
  }
})

// Setup backup routes
setupBackupRoutes(app, backupAgent, backupStorage)
```

### 2. Create Service Collectors

For each service (Exchange, Teams, etc.), create a collector:

```javascript
// Example: Exchange Collector
class ExchangeCollector {
  async collect() {
    try {
      // Fetch distribution groups
      const dgResponse = await graphClient
        .api('/distribution-list')
        .get()

      const resources = dgResponse.value.map(dg => ({
        type: 'EXODistributionGroup',
        name: dg.displayName,
        id: dg.id,
        configuration: dg
      }))

      return {
        success: true,
        resources
      }
    } catch (error) {
      return {
        success: false,
        error: error.message
      }
    }
  }
}

// Register collector
backupAgent.registerCollector('ExchangeOnline', new ExchangeCollector())
```

### 3. Test Backup Operation

```bash
# Trigger backup via API
curl -X POST http://localhost:3000/api/backup/m365/trigger/ExchangeOnline \
  -H "Content-Type: application/json" \
  -d '{
    "description": "Test backup",
    "priority": 5
  }'

# Expected response:
# {
#   "success": true,
#   "backupId": "2026-07-14-ExchangeOnline-123456",
#   "serviceName": "ExchangeOnline",
#   "resourceCount": 45,
#   "configHash": "abc123def456...",
#   "executionTime": 23
# }
```

## Next Steps

### Phase 1 Completion Checklist

- [ ] Create SharePoint lists (3 lists)
- [ ] Create SharePoint document libraries (2 libraries)
- [ ] Get list and library IDs from SharePoint
- [ ] Add environment variables to `.env`
- [ ] Integrate backup routes into server.js
- [ ] Register at least one collector (Exchange)
- [ ] Test backup trigger via API
- [ ] Verify data in SharePoint
- [ ] Document SharePoint site URL and structure

### Phase 1 → Phase 2 Transition

Once Phase 1 is complete, you'll have:
✅ Storage infrastructure ready
✅ API endpoints for backup operations
✅ Configuration schemas defined
✅ Backup agent foundation

Next (Phase 2):
- Create Exchange Collector
- Create Teams Collector
- Build backup dashboard UI
- Test end-to-end backup flow

## Troubleshooting

### Issue: "SharePoint list not configured"
**Solution**: Ensure environment variables are set with correct list IDs from SharePoint

### Issue: "Access denied" to SharePoint
**Solution**: Verify Azure app has permissions for SharePoint Sites.Selected

### Issue: Backup creates list items but no document storage
**Solution**: Check document library IDs in environment variables

### Issue: "No collector found" error
**Solution**: Ensure collector is registered with `backupAgent.registerCollector()`

## Support

For questions or issues:
1. Check logs: `tail -f backend.log`
2. Verify SharePoint configuration
3. Test Graph API permissions
4. Ensure environment variables are loaded

---

**Phase 1 Status**: Ready for Implementation  
**Created**: 2026-07-14  
**Backend Files**: 4  
**API Endpoints**: 11+  
**SharePoint Lists Required**: 3  
**Document Libraries Required**: 2
