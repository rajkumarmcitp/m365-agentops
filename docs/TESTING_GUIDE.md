# Phase 1 Testing Guide - Exchange Collector

## Overview
This guide walks you through testing the M365 Backup System with the Exchange Collector.

## Quick Start

### 1. Initialize Backup System (in server.js)

```javascript
import { BackupAgent } from './lib/backup-agent.js'
import { BackupStorageManager } from './lib/backup-storage.js'
import { ExchangeCollector } from './collectors/exchange-collector.js'

// After GraphClient initialization
let backupAgent = null
let backupStorage = null

async function initializeBackupSystem() {
  if (!graphClient) {
    console.warn('⚠️ GraphClient not initialized, backup system skipped')
    return
  }

  try {
    // Initialize storage
    backupStorage = new BackupStorageManager(
      graphClient,
      process.env.SHAREPOINT_SITE_ID,
      {
        backupListId: process.env.SHAREPOINT_BACKUP_LIST_ID,
        backupResourcesListId: process.env.SHAREPOINT_BACKUP_RESOURCES_LIST_ID,
        backupChangesListId: process.env.SHAREPOINT_BACKUP_CHANGES_LIST_ID,
        backupDataLibraryId: process.env.SHAREPOINT_BACKUP_DATA_LIBRARY_ID
      }
    )

    // Initialize agent
    backupAgent = new BackupAgent(graphClient, {
      siteId: process.env.SHAREPOINT_SITE_ID,
      storage: {
        backupListId: process.env.SHAREPOINT_BACKUP_LIST_ID,
        backupResourcesListId: process.env.SHAREPOINT_BACKUP_RESOURCES_LIST_ID,
        backupChangesListId: process.env.SHAREPOINT_BACKUP_CHANGES_LIST_ID,
        backupDataLibraryId: process.env.SHAREPOINT_BACKUP_DATA_LIBRARY_ID
      }
    })

    // Register collectors
    const exchangeCollector = new ExchangeCollector(graphClient)
    backupAgent.registerCollector('ExchangeOnline', exchangeCollector)

    console.log('✅ Backup system initialized')

    // Setup routes
    setupBackupRoutes(app, backupAgent, backupStorage)

  } catch (error) {
    console.error('❌ Failed to initialize backup system:', error.message)
  }
}

// Call this after GraphClient is ready
await initializeBackupSystem()
```

### 2. Test API Endpoints

#### Test 1: Get Available Services
```bash
curl -s http://localhost:3000/api/backup/m365/services/list | jq
```

Expected response:
```json
{
  "success": true,
  "data": [
    {
      "key": "ExchangeOnline",
      "displayName": "Exchange Online",
      "tier": "TIER 1",
      "priority": 1,
      "resources": ["EXOAcceptedDomain", "EXOConnector", ...],
      "totalResources": 14
    },
    ...
  ],
  "total": 10
}
```

#### Test 2: Get Exchange Service Details
```bash
curl -s http://localhost:3000/api/backup/m365/services/ExchangeOnline | jq
```

Expected response:
```json
{
  "success": true,
  "data": {
    "displayName": "Exchange Online",
    "tier": "TIER 1",
    "priority": 1,
    "resources": [
      "EXOAcceptedDomain",
      "EXOConnector",
      "EXODistributionGroup",
      ...
    ],
    "totalResources": 14
  }
}
```

#### Test 3: Trigger Exchange Backup
```bash
curl -X POST http://localhost:3000/api/backup/m365/trigger/ExchangeOnline \
  -H "Content-Type: application/json" \
  -d '{
    "description": "Initial Exchange backup test",
    "priority": 1
  }' | jq
```

Expected response:
```json
{
  "success": true,
  "backupId": "2026-07-14-ExchangeOnline-123456",
  "serviceName": "ExchangeOnline",
  "resourceCount": 45,
  "configHash": "abc123def456...",
  "changes": "Initial backup",
  "executionTime": 23,
  "itemId": "sp-item-id"
}
```

#### Test 4: Get Backup Status
```bash
curl -s http://localhost:3000/api/backup/m365/status/ExchangeOnline | jq
```

Expected response:
```json
{
  "success": true,
  "data": {
    "BackupID": "2026-07-14-ExchangeOnline-123456",
    "BackupDate": "2026-07-14T10:30:00Z",
    "ServiceName": "ExchangeOnline",
    "Status": "Completed",
    "RecordCount": 45,
    "ConfigHash": "abc123...",
    "ChangesSummary": "Initial backup"
  }
}
```

#### Test 5: Get Backup History
```bash
curl -s "http://localhost:3000/api/backup/m365/history/ExchangeOnline?limit=5" | jq
```

#### Test 6: Get Specific Backup Details
```bash
curl -s http://localhost:3000/api/backup/m365/2026-07-14-ExchangeOnline-123456 | jq
```

---

## What the Exchange Collector Collects

### Currently Working (Graph API Direct)

✅ **Accepted Domains** (EXOAcceptedDomain)
- Domain names, authentication type, verification status

✅ **Distribution Groups** (EXODistributionGroup)
- Group names, owners, members
- Email addresses, aliases

✅ **Group Members** (EXODistributionGroupMember)
- All members of distribution groups
- User and group types

✅ **Mail Contacts** (EXOMailContact)
- External contact details
- Email addresses, phone numbers

✅ **Organization Config** (EXOOrgConfig)
- Tenant-wide Exchange settings
- Organization name, preferences

✅ **Unified Groups** (EXOUnifiedGroup)
- Microsoft 365 Groups
- Visibility, owners, membership count

### Requires PowerShell (Exchange Admin API)

⚠️ **Mail Connectors** (EXOInboundConnector, EXOOutboundConnector)
- Limited Graph API support
- Requires Exchange Admin Center or PowerShell

⚠️ **Remote Domains** (EXORemoteDomain)
- Limited Graph API support
- Requires Exchange Admin Center or PowerShell

⚠️ **Transport Rules** (EXOTransportRule)
- Limited Graph API support
- Requires Exchange Admin Center or PowerShell

---

## Expected Test Results

### Backup Performance
```
Collection Time:   20-60 seconds (depends on tenant size)
Resources Found:   40-200+ (varies per organization)
Typical Sizes:
  - Small org:     2-5 MB
  - Medium org:    10-30 MB
  - Large org:     50-100+ MB
```

### Resource Breakdown
```
Distribution Groups:     15-50
  └─ Members:          500-5,000
Unified Groups:          5-30
Mail Contacts:          10-100
Accepted Domains:       2-10
Organization Config:    1
```

### Success Indicators
```
✅ API call completes without throttling
✅ All resources saved to SharePoint
✅ Change detection working (shows "Initial backup")
✅ Execution time < 1 minute for typical tenant
✅ No 429 (throttle) errors in logs
```

---

## Running Manual Tests

### Test in Node REPL

```javascript
// node
import { ExchangeCollector } from './backend/collectors/exchange-collector.js'
import { initMSAL, getAccessToken } from './lib/auth.js'

// Initialize auth
const graphClient = await initMSAL()

// Create collector
const collector = new ExchangeCollector(graphClient)

// Run collection
const result = await collector.collect()

// View summary
console.log(collector.getSummary())

// View specific resources
console.log(result.resources.filter(r => r.type === 'EXODistributionGroup'))
```

### Test via PowerShell

```powershell
# Test Graph API connectivity
$headers = @{
    "Authorization" = "Bearer $accessToken"
    "Content-Type" = "application/json"
}

# Get domains
$domains = Invoke-RestMethod `
  -Uri "https://graph.microsoft.com/v1.0/domains" `
  -Headers $headers

# Get groups
$groups = Invoke-RestMethod `
  -Uri "https://graph.microsoft.com/v1.0/groups" `
  -Headers $headers

$groups | Measure-Object
```

---

## Troubleshooting

### Issue: "No collector found for ExchangeOnline"

**Solution:**
```javascript
// Make sure collector is registered BEFORE setting up routes
const exchangeCollector = new ExchangeCollector(graphClient)
backupAgent.registerCollector('ExchangeOnline', exchangeCollector)

// THEN setup routes
setupBackupRoutes(app, backupAgent, backupStorage)
```

### Issue: "SharePoint list not configured"

**Solution:**
Verify environment variables are set:
```bash
echo $SHAREPOINT_BACKUP_LIST_ID
echo $SHAREPOINT_SITE_ID
```

If not set:
```bash
# Add to .env
SHAREPOINT_SITE_ID=your-site-id
SHAREPOINT_BACKUP_LIST_ID=list-id-for-backups
SHAREPOINT_BACKUP_RESOURCES_LIST_ID=resources-list-id
SHAREPOINT_BACKUP_CHANGES_LIST_ID=changes-list-id
SHAREPOINT_BACKUP_DATA_LIBRARY_ID=data-library-id
```

### Issue: 429 Throttle Error

**Solution:** Using a separate backup app registration:

```javascript
import getBackupGraphClient from './lib/backup-auth.js'

const backupGraphClient = await getBackupGraphClient()
const collector = new ExchangeCollector(backupGraphClient)
```

### Issue: "Access Denied" collecting groups/members

**Solution:** Verify app permissions include:
```
✅ Group.Read.All
✅ Directory.Read.All
✅ User.Read.All
✅ Mail.Read
```

### Issue: "Timeout" collecting resources

**Solution:** Increase timeout:
```javascript
const collector = new ExchangeCollector(graphClient, {
  timeout: 60000  // 60 seconds instead of 30
})
```

---

## Performance Testing

### Test Large Organization

```bash
# Time the backup
time curl -X POST http://localhost:3000/api/backup/m365/trigger/ExchangeOnline

# Monitor logs for API calls
tail -f backend.log | grep "Collecting\|✅\|❌"
```

### Monitor API Usage

Add to backup-agent.js:
```javascript
console.log(`
  📊 Backup Statistics
  Resources: ${this.resources.length}
  Errors: ${this.errors.length}
  Time: ${executionTime}s
  Rate: ${Math.round(this.resources.length / executionTime)} resources/sec
  API Calls: ~${this.resources.length * 2} (estimated)
`)
```

---

## Next Steps After Testing

### If Backup Succeeds
1. ✅ Verify data in SharePoint lists
2. ✅ Check document storage
3. ✅ Review backup record details
4. ✅ Proceed to Phase 2 (Add more collectors)

### If Issues Found
1. Check logs for specific errors
2. Verify Graph API permissions
3. Test with separate backup app registration
4. Use PowerShell cmdlets for comparison

### Recommended Next Tests
1. **Change Detection**: Modify an Exchange group, run backup again
2. **Multiple Backups**: Run backup multiple times to test history
3. **Large Tenant**: Test with production-scale data
4. **Backup Retention**: Test deletion of old backups

---

## Success Checklist

- [ ] Exchange Collector registered with Backup Agent
- [ ] API endpoint returns services list
- [ ] Backup trigger executes without errors
- [ ] Resources collected from Graph API
- [ ] Backup record created in SharePoint
- [ ] Backup data stored in document library
- [ ] Backup status can be queried
- [ ] Change detection working (shows "Initial backup")
- [ ] No throttle errors (429) in logs
- [ ] Execution time < 60 seconds

---

**Status**: Ready for Testing  
**Components**: 5 backend files + 1 collector  
**Test Duration**: 30-60 minutes  
**Next Phase**: Teams Collector + SharePoint Collector
