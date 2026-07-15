# Restore Operation Validation Guide

When you initiate a restore operation in the Backup & Restore page, here's how to validate what happened:

## Quick Validation (Within Browser)

### 1. **Console Notification**
When you click "Restore Selected", the UI will:
- Show a toast notification with the Restore ID
- Log complete restore details to the browser console
- Provide a helper function to check status

Look for the console output:
```
✅ RESTORE INITIATED
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Restore ID: restore-1784085441108-mlxm5a53u
Backup ID: 2026-07-15-Teams-998727
Resources: 2
Status: In Progress
Timestamp: 2026-07-15T03:17:21.108Z
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
To check restore status, run in console:
checkRestoreStatus('restore-1784085441108-mlxm5a53u')
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

### 2. **Browser Console Status Check**
Open browser DevTools (F12) → Console tab and run:
```javascript
checkRestoreStatus('restore-1784085441108-mlxm5a53u')
```

This will display:
- **Restore ID**: Unique identifier for this operation
- **Backup ID**: Which backup was used
- **Resource IDs**: Which resources were selected
- **Status**: Current status (In Progress → Processing → Completed/Failed)
- **Duration**: How long it took (in seconds)
- **Success Count**: How many resources were successfully restored
- **Failure Count**: How many failed (0 if all succeeded)
- **Details**: Step-by-step operation details
- **Errors**: Any errors encountered

Example output:
```
{
  restoreId: "restore-1784085441108-mlxm5a53u"
  backupId: "2026-07-15-Teams-998727"
  resourceIds: ["36e1ecd7-f54c-4d34-b41f-0991efe0dd40", "a9314620-5c35-46b7-9168-8b26948bf84a"]
  resourceCount: 2
  status: "Completed"
  startTime: "2026-07-15T03:17:21.108Z"
  endTime: "2026-07-15T03:17:22.109Z"
  duration: 1
  successCount: 2
  failureCount: 0
  details: [
    "Successfully restored 2 resources"
  ]
  errors: []
}
```

---

## API-Level Validation (For Developers)

### 1. **Check Individual Restore Status**
```bash
curl http://localhost:3000/api/backup/m365/restore/restore-1784085441108-mlxm5a53u/status
```

Response:
```json
{
  "success": true,
  "data": {
    "restoreId": "restore-1784085441108-mlxm5a53u",
    "backupId": "2026-07-15-Teams-998727",
    "resourceIds": ["36e1ecd7-...", "a9314620-..."],
    "resourceCount": 2,
    "status": "Completed",
    "startTime": "2026-07-15T03:17:21.108Z",
    "endTime": "2026-07-15T03:17:22.109Z",
    "duration": 1,
    "successCount": 2,
    "failureCount": 0,
    "errors": [],
    "details": ["Successfully restored 2 resources"]
  }
}
```

### 2. **View Restore History for a Specific Backup**
```bash
curl "http://localhost:3000/api/backup/m365/backup/2026-07-15-Teams-998727/restores?limit=10"
```

Shows all restore operations for that backup:
```json
{
  "success": true,
  "data": [
    {
      "restoreId": "restore-1784085441108-mlxm5a53u",
      "status": "Completed",
      "resourceCount": 2,
      "duration": 1,
      "startTime": "2026-07-15T03:17:21.108Z"
    }
  ],
  "total": 1
}
```

### 3. **View All Recent Restore Operations**
```bash
curl "http://localhost:3000/api/backup/m365/restores?limit=50"
```

Lists all restores across all backups, newest first.

---

## Server-Side Validation (Backend Logs)

When a restore is initiated, the backend logs detailed information:

```
🔄 Restore operation started: restore-1784085441108-mlxm5a53u
   Backup: 2026-07-15-Teams-998727
   Resources: 2
   📝 Backup: Teams (14 total resources)
   📝 Target Environment: production
   📝 Selected 2 resources for restore
   📝   └─ Nas-Tech (TeamsTeam)
   📝   └─ IT Team (TeamsTeam)
📊 Restore restore-1784085441108-mlxm5a53u: Processing
   ✓ Validating resources...
   ✓ Preparing configuration...
✅ Restore restore-1784085441108-mlxm5a53u completed in 1s
   Success: 2, Failed: 0
📊 Restore restore-1784085441108-mlxm5a53u: Completed
   ✓ Successfully restored 2 resources
```

To view these logs:
- **Docker**: `docker logs <container-id>`
- **Local**: `tail -f /tmp/backend.log` (if running locally)
- **Azure**: Use Azure App Service logs in portal

---

## Validation Checklist

After initiating a restore, verify:

- [ ] **Restore ID Generated** - Each restore gets a unique ID
- [ ] **Resources Logged** - Selected resources are listed in logs/console
- [ ] **Status Transitions** - Status changes from "In Progress" → "Processing" → "Completed"
- [ ] **Duration Recorded** - Time taken is tracked
- [ ] **Success Count Matches** - Resources restored matches what was selected
- [ ] **Failure Count is Zero** - No errors (unless expected)
- [ ] **Details Logged** - Each resource restore is logged with step-by-step details

---

## Status States

| Status | Meaning |
|--------|---------|
| **In Progress** | Restore was initiated, waiting to process |
| **Processing** | Active restore operations in progress |
| **Completed** | Restore finished successfully |
| **Failed** | Restore encountered errors |

---

## Troubleshooting

### "Restore ID not found"
- Restore operations are stored in memory during server runtime
- Restarting the backend will clear the history
- Store the restore ID immediately after initiating

### "Success count is 0"
- Resources may not have been selected properly
- Check the `resourceIds` array in the restore object
- Verify resources exist in the backup

### "No details shown"
- Details are added as the restore progresses
- Check status immediately after restore completes
- Allow 1-2 seconds for the operation to finish

---

## Examples

### Example 1: Quick Check in Console
```javascript
// After restore completes, check status
checkRestoreStatus('restore-1784085441108-mlxm5a53u')

// Output: Displays complete restore record including:
// - Which resources were restored
// - How long it took
// - Any errors encountered
// - Detailed operation log
```

### Example 2: Programmatic Check
```bash
# Get restore status
curl -s http://localhost:3000/api/backup/m365/restore/restore-ID/status | jq '.'

# Parse specific fields
curl -s http://localhost:3000/api/backup/m365/restore/restore-ID/status | \
  jq '.data | "\(.status) - Restored \(.successCount) of \(.resourceCount) resources in \(.duration)s"'
```

### Example 3: Monitor Multiple Restores
```bash
# Get all restores for a backup
curl -s "http://localhost:3000/api/backup/m365/backup/BACKUP-ID/restores?limit=10" | \
  jq '.data[] | "\(.restoreId): \(.status) (\(.duration)s)"'
```
