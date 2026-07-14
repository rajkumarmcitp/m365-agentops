# M365 Backup & Restore System Guide

## Overview

The M365 Backup & Restore system provides comprehensive backup and recovery capabilities for Microsoft 365 configurations across 11 major services. The system collects and preserves Microsoft365DSC (Desired State Configuration) resources, enabling quick restoration to known-good configurations in case of accidental changes or security incidents.

## System Architecture

### Supported Services & Resources (373 Total)

| Service | Resources | Tier | Access Method |
|---------|-----------|------|---|
| **ExchangeOnline** | 38 | Tier 1 | Exchange Admin + Graph API |
| **Teams** | 45 | Tier 1 | Teams Admin + Graph API |
| **SharePoint** | 30 | Tier 1 | SharePoint Admin + Graph API |
| **Intune** | 79 | Tier 2 | Intune Admin + Graph API |
| **OneDrive** | 5 | Tier 2 | OneDrive Admin + Graph API |
| **Compliance** | 50 | Tier 2 | Compliance Admin + Graph API |
| **Security** | 60 | Tier 2 | Azure AD Admin + Graph API |
| **PowerPlatform** | 18 | Tier 3 | Power Platform Admin |
| **TenantSettings** | 15 | Tier 3 | Tenant Admin |
| **Dynamics365** | 30 | Tier 3 | Dataverse Admin |
| **Groups** | 3 | Tier 3 | Graph API |

**Service Tiers:**
- **Tier 1 (Critical):** Core M365 services - highest priority backups
- **Tier 2 (Essential):** Important services - regular backup schedule
- **Tier 3 (Extended):** Additional services - extended coverage

## Accessing Backup & Restore

### Web UI

1. **Navigate to Backup & Restore page:**
   - Go to Admin portal
   - Click **Backup & Restore** in the left navigation (Config section)
   - Or direct link: `http://localhost:5173/backup` (dev)

2. **Main interface has two views:**
   - **Services View:** Browse available services and trigger backups
   - **History View:** Track backup history and restore from backups

### API Access

**Base URL:** `http://localhost:3001/api/backup/m365`

#### List Available Services
```bash
GET /api/backup/m365/services/list

Response:
{
  "success": true,
  "data": [
    {
      "key": "ExchangeOnline",
      "displayName": "Exchange Online",
      "tier": "Tier 1",
      "priority": 1,
      "totalResources": 38,
      "resources": [...]
    },
    ...
  ],
  "total": 11
}
```

#### Get Service Details
```bash
GET /api/backup/m365/services/:service

Example:
GET /api/backup/m365/services/ExchangeOnline

Response:
{
  "success": true,
  "data": {
    "displayName": "Exchange Online",
    "tier": "Tier 1",
    "priority": 1,
    "totalResources": 38,
    "resources": [
      "AcceptedDomains",
      "AddressBookPolicies",
      "AddressList",
      ...
    ]
  }
}
```

## Backup Operations

### Triggering Backups

#### From Web UI

1. **Backup Single Service:**
   - Open Backup & Restore page
   - Go to **Services** view
   - Click **Backup** button next to desired service
   - Confirm backup initiation
   - Monitor progress in real-time

2. **Backup All Services:**
   - Open Backup & Restore page
   - Go to **Services** view
   - Click **Backup All** button
   - System will backup all services sequentially

#### Via API

```bash
POST /api/backup/m365/trigger/:service

Example:
curl -X POST http://localhost:3001/api/backup/m365/trigger/ExchangeOnline \
  -H "Content-Type: application/json" \
  -d '{
    "description": "Weekly backup",
    "priority": "high"
  }'

Response:
{
  "success": true,
  "backupId": "bkup-20260715-001234-ExchangeOnline",
  "serviceName": "ExchangeOnline",
  "resourceCount": 38,
  "createdBy": "admin@tenant.onmicrosoft.com",
  "timestamp": "2026-07-15T10:30:00Z"
}
```

### Backup Scheduling

Backups can be configured to run on a schedule:

```javascript
// Example: Daily backups at 2 AM
const scheduleConfig = {
  services: ['ExchangeOnline', 'Teams', 'SharePoint', 'Intune'],
  schedule: 'daily',
  time: '02:00',
  timezone: 'UTC',
  retention: {
    days: 30,
    maxBackups: 10
  }
}
```

### Backup Storage

Backups are stored in SharePoint Online:
- **Location:** Configured SharePoint site
- **List:** M365 Backup Metadata
- **Format:** JSON configuration files
- **Encrypted:** Yes (via SharePoint encryption)
- **Change Detection:** SHA-256 hashing identifies configuration changes

## Restore Operations

### Triggering Restores

#### From Web UI

1. **Restore from Backup:**
   - Open Backup & Restore page
   - Go to **History** view
   - Find desired backup in the list
   - Click **Restore** button
   - Confirm restoration (shows service, resources, and timestamp)
   - Monitor restoration progress

#### Via API

```bash
POST /api/backup/m365/restore/:backupId

Example:
curl -X POST http://localhost:3001/api/backup/m365/restore/bkup-20260715-001234-ExchangeOnline \
  -H "Content-Type: application/json" \
  -d '{
    "targetEnvironment": "production",
    "confirmRestore": true
  }'

Response:
{
  "success": true,
  "backupId": "bkup-20260715-001234-ExchangeOnline",
  "status": "In Progress",
  "message": "Configuration restoration initiated"
}
```

### Restore Best Practices

1. **Pre-Restore Verification:**
   - Review backup timestamp and service
   - Verify resource count matches expectations
   - Check for any recent manual changes that would be overwritten

2. **Off-Peak Restore:**
   - Schedule restores during low-activity windows
   - Avoid business hours for critical services
   - Notify stakeholders before restoration

3. **Validation After Restore:**
   - Verify configuration changes
   - Test critical workflows
   - Monitor service health
   - Check error logs for issues

## Backup Lifecycle Management

### Backup Retention

Backups are retained based on configuration:
- **Default:** 30 days or 10 backups per service (whichever is smaller)
- **Critical Services (Tier 1):** 90 days
- **Essential Services (Tier 2):** 60 days
- **Extended Services (Tier 3):** 30 days

### Manual Backup Deletion

```bash
DELETE /api/backup/m365/backups/:backupId
```

### Backup Verification

Each backup includes:
- Service name and resource count
- MD5 hash for integrity verification
- Timestamp of collection
- Created-by attribution
- Configuration snapshot for comparison

## Monitoring & Alerts

### Backup Status Monitoring

Available endpoints:
```bash
# Get all backups
GET /api/backup/m365/backups

# Get backups for specific service
GET /api/backup/m365/backups/service/:service

# Get specific backup details
GET /api/backup/m365/backups/:backupId
```

### Response Format

```json
{
  "success": true,
  "data": [
    {
      "backupId": "bkup-20260715-001234-ExchangeOnline",
      "serviceName": "ExchangeOnline",
      "resourceCount": 38,
      "status": "Completed",
      "timestamp": "2026-07-15T10:30:00Z",
      "createdBy": "admin@tenant.onmicrosoft.com",
      "error": null
    }
  ]
}
```

### Status Values

- **Pending:** Backup queued and waiting to start
- **In Progress:** Backup collection is actively running
- **Completed:** Backup successful and stored
- **Failed:** Backup encountered an error

## Admin API Requirements

Each service requires specific admin credentials/roles for full backup capability:

### Exchange Online
```powershell
Connect-ExchangeOnline -UserPrincipalName admin@tenant.onmicrosoft.com
```
**Roles Required:** Exchange Administrator

### Teams
```powershell
Connect-MicrosoftTeams -AccountId admin@tenant.onmicrosoft.com
```
**Roles Required:** Teams Administrator

### SharePoint Online
```powershell
Connect-SPOService -Url https://tenant-admin.sharepoint.com
```
**Roles Required:** SharePoint Administrator

### Intune
```powershell
Connect-MsGraph -AdminConsent
```
**Roles Required:** Intune Administrator

### Compliance
```powershell
Connect-ComplianceCenter -UserPrincipalName admin@tenant.onmicrosoft.com
```
**Roles Required:** Compliance Administrator

### Azure AD / Security
```powershell
Connect-AzureAD -TenantId 'TENANT_ID'
```
**Roles Required:** Global Administrator or Security Administrator

### Power Platform
```powershell
Add-PowerAppsAccount -Endpoint prod
```
**Roles Required:** Power Platform Administrator

### Dynamics 365
```powershell
Add-PowerAppsAccount -Endpoint prod
Connect-DynamicsCrm -Online
```
**Roles Required:** Dataverse Administrator

## Troubleshooting

### Backup Fails to Start

**Problem:** Backup button grayed out or returns error

**Solutions:**
1. Verify Graph API credentials in backend `.env`
2. Check service-specific admin role assignments
3. Verify SharePoint site ID configuration
4. Review backend logs for authentication errors

```bash
# Check backend logs
tail -f backend.log | grep "ERROR\|Backup"
```

### Backup Collects Zero Resources

**Problem:** Backup completes but shows 0 resources

**Solutions:**
1. Verify admin API credentials are valid
2. Check if service has any configurations to backup
3. Verify service is not in maintenance mode
4. Check for API throttling (wait and retry)

### Restore Fails

**Problem:** Restore operation fails or partially completes

**Solutions:**
1. Verify you have write permissions to target service
2. Check if backup is not corrupted
3. Review backup timestamp (may be too old)
4. Check for conflicting configurations
5. Verify service is in healthy state

### Performance Issues

**Problem:** Backups are slow or timing out

**Solutions:**
1. Increase timeout values in backup-config.js
2. Reduce batch size for pagination
3. Backup services separately instead of all at once
4. Check network connectivity to Graph API
5. Monitor API rate limits

## Configuration

### Backup Config File

Located at: `backend/lib/backup-config.js`

```javascript
const BackupScheduleConfig = {
  enabled: true,
  interval: 'daily',
  time: '02:00',
  services: ['ExchangeOnline', 'Teams', 'SharePoint'],
  maxRetries: 3,
  retryDelay: 1000
}

const RestoreConfig = {
  maxRetries: 3,
  retryDelay: 1000,
  confirmRequired: true,
  dryRun: false
}
```

### Environment Variables

Required in `.env`:
```bash
# Graph API Credentials
GRAPH_TENANT_ID=your-tenant-id
GRAPH_CLIENT_ID=your-client-id
GRAPH_CLIENT_SECRET=your-client-secret

# SharePoint Storage
SHAREPOINT_SITE_ID=your-sharepoint-site-id

# Optional: Backup-specific settings
BACKUP_RETENTION_DAYS=30
BACKUP_MAX_PER_SERVICE=10
```

## Examples

### Example 1: Daily Backup Schedule

```bash
# Web UI: Set up automatic daily backups
# Backup & Restore page → Settings → Schedule
# Enabled: Yes
# Time: 2:00 AM
# Services: All Tier 1 and Tier 2 services
# Retention: 30 days
```

### Example 2: Disaster Recovery Scenario

```bash
# 1. Alert received: Unauthorized changes detected in Teams
# 2. Open Backup & Restore → History
# 3. Find last known-good backup from 1 hour ago
# 4. Click Restore, confirm action
# 5. System restores Teams configuration
# 6. Verify in Teams Admin Center
# 7. All unauthorized changes reverted
```

### Example 3: Migration Preparation

```bash
# Before tenant migration:
# 1. Backup & Restore → Services
# 2. Select all critical services
# 3. Click "Backup All"
# 4. Wait for all backups to complete
# 5. Export backup metadata for documentation
# 6. Proceed with migration
# 7. Post-migration, restore if needed
```

## Support & Help

For issues or questions:
1. Check logs: `backend.log`
2. Review error messages in UI
3. Verify all prerequisites are met
4. Test with single service first before batch operations
5. Contact M365 AgentOps support

## Related Documentation

- [M365DSC Resources](https://microsoft365dsc.com/resources/overview/)
- [Graph API Authentication](https://learn.microsoft.com/en-us/graph/auth/)
- [SharePoint List Management](https://learn.microsoft.com/en-us/sharepoint/dev/general-development/lists-and-list-items-rest-api-overview)
- [Change Management Best Practices](./CHANGE_MANAGEMENT.md)
