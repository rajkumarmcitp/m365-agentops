# M365 Backup System API Reference

**Date:** 2026-07-17  
**Version:** 1.0  
**Status:** Complete for 7 services (542 resources)

---

## Overview

The M365 Backup System provides REST API endpoints to manage backups and restores of Microsoft 365 configurations across multiple services. The system uses a phase-based approach to incrementally build comprehensive coverage.

---

## Base URL

```
https://your-domain.com/api/backup/m365
```

---

## API Endpoints

### 1. Service Management

#### Get All Available Services

```http
GET /services/list
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "key": "OneDrive",
      "displayName": "OneDrive for Business",
      "tier": "TIER 1",
      "priority": 1,
      "resources": ["ODStorageQuotaPolicy", "ODExternalSharingPolicy", ...],
      "totalResources": 30
    },
    {
      "key": "Groups",
      "displayName": "Microsoft 365 Groups",
      "tier": "TIER 2",
      "priority": 6,
      "resources": ["O365GroupsCreationPolicy", ...],
      "totalResources": 30
    },
    {
      "key": "SharePoint",
      "displayName": "SharePoint Online",
      "tier": "TIER 1",
      "priority": 3,
      "resources": [...],
      "totalResources": 100
    },
    {
      "key": "Teams",
      "displayName": "Microsoft Teams",
      "tier": "TIER 1",
      "priority": 2,
      "resources": [...],
      "totalResources": 64
    },
    {
      "key": "ExchangeOnline",
      "displayName": "Exchange Online",
      "tier": "TIER 1",
      "priority": 4,
      "resources": [...],
      "totalResources": 100
    },
    {
      "key": "Security",
      "displayName": "Entra ID",
      "tier": "TIER 1",
      "priority": 8,
      "resources": [...],
      "totalResources": 54
    },
    {
      "key": "Intune",
      "displayName": "Intune",
      "tier": "TIER 1",
      "priority": 5,
      "resources": [...],
      "totalResources": 164
    }
  ],
  "total": 7
}
```

#### Get Service Details

```http
GET /services/{service}
```

**Parameters:**
- `service` (string) - Service key (e.g., "OneDrive", "SharePoint", "Security")

**Response:**
```json
{
  "success": true,
  "data": {
    "displayName": "SharePoint Online",
    "tier": "TIER 1",
    "priority": 3,
    "resources": ["SPOAccessControlSettings", "SPOApp", ...],
    "totalResources": 100,
    "_note_SharePoint_Phase1": {
      "description": "Phase 1 implementation...",
      "coverage": "from 0% to 31%",
      "implementationPhase": "Phase 1 - Core governance"
    }
  }
}
```

---

### 2. Backup Operations

#### Trigger Backup for Single Service

```http
POST /trigger/{service}
Content-Type: application/json

{
  "description": "Backup before maintenance",
  "priority": "high"
}
```

**Parameters:**
- `service` (string) - Service key
- `description` (string, optional) - Backup description
- `priority` (string, optional) - Priority level (low, medium, high)

**Response:**
```json
{
  "success": true,
  "backupId": "SPO-2026-07-17-001",
  "serviceName": "SharePoint",
  "resourceCount": 100,
  "executionTime": 18,
  "timestamp": "2026-07-17T12:34:56Z"
}
```

#### Trigger Backup for All Services

```http
POST /trigger-all
Content-Type: application/json

{
  "description": "Full system backup",
  "priority": "high"
}
```

**Response:**
```json
{
  "success": true,
  "executionTime": 95,
  "results": [
    {
      "success": true,
      "backupId": "OD-2026-07-17-001",
      "serviceName": "OneDrive",
      "resourceCount": 30
    },
    {
      "success": true,
      "backupId": "GRP-2026-07-17-001",
      "serviceName": "Groups",
      "resourceCount": 30
    },
    {
      "success": true,
      "backupId": "SPO-2026-07-17-001",
      "serviceName": "SharePoint",
      "resourceCount": 100
    },
    {
      "success": true,
      "backupId": "TEAMS-2026-07-17-001",
      "serviceName": "Teams",
      "resourceCount": 64
    },
    {
      "success": true,
      "backupId": "EXO-2026-07-17-001",
      "serviceName": "Exchange",
      "resourceCount": 100
    },
    {
      "success": true,
      "backupId": "SEC-2026-07-17-001",
      "serviceName": "Security",
      "resourceCount": 54
    },
    {
      "success": true,
      "backupId": "INTUNE-2026-07-17-001",
      "serviceName": "Intune",
      "resourceCount": 164
    }
  ],
  "summary": {
    "total": 7,
    "successful": 7,
    "failed": 0,
    "totalResourcesBackedUp": 542
  }
}
```

---

### 3. Backup History & Status

#### Get Backup History

```http
GET /history/{service}?limit=10
```

**Parameters:**
- `service` (string) - Service key
- `limit` (number, optional) - Number of backups to retrieve (default: 10)

**Response:**
```json
{
  "success": true,
  "service": "SharePoint",
  "backups": [
    {
      "backupId": "SPO-2026-07-17-001",
      "serviceName": "SharePoint",
      "timestamp": "2026-07-17T12:34:56Z",
      "resourceCount": 100,
      "createdBy": "admin@company.com",
      "description": "Full backup before maintenance"
    },
    {
      "backupId": "SPO-2026-07-16-001",
      "serviceName": "SharePoint",
      "timestamp": "2026-07-16T08:15:30Z",
      "resourceCount": 100,
      "createdBy": "system",
      "description": "Automated daily backup"
    }
  ],
  "total": 2
}
```

#### Get Backup Details

```http
GET /backup/{backupId}
```

**Response:**
```json
{
  "success": true,
  "backup": {
    "backupId": "SPO-2026-07-17-001",
    "serviceName": "SharePoint",
    "timestamp": "2026-07-17T12:34:56Z",
    "resourceCount": 100,
    "createdBy": "admin@company.com",
    "resources": [
      {
        "type": "SPOAccessControlSettings",
        "name": "Access Control Configuration",
        "id": "spo-ac-001",
        "properties": { /* resource configuration */ },
        "capturedDate": "2026-07-17T12:34:56Z"
      },
      {
        "type": "SPOTenantCDNPolicy",
        "name": "CDN Configuration",
        "id": "spo-cdn-001",
        "properties": { /* resource configuration */ },
        "capturedDate": "2026-07-17T12:34:56Z"
      }
      // ... more resources
    ]
  }
}
```

#### Get Latest Backup

```http
GET /latest/{service}
```

**Response:**
```json
{
  "success": true,
  "backup": {
    "backupId": "SPO-2026-07-17-001",
    "serviceName": "SharePoint",
    "timestamp": "2026-07-17T12:34:56Z",
    "resourceCount": 100,
    "resources": [...]
  }
}
```

---

### 4. Restore Operations

#### Initiate Restore

```http
POST /restore/{backupId}
Content-Type: application/json

{
  "targetEnvironment": "production",
  "resourceIds": ["spo-ac-001", "spo-cdn-001"],
  "dryRun": false
}
```

**Parameters:**
- `backupId` (string, required) - Backup ID to restore from
- `targetEnvironment` (string, optional) - Target environment (default: "production")
- `resourceIds` (array, optional) - Specific resource IDs to restore (if omitted, all resources are restored)
- `dryRun` (boolean, optional) - Perform dry run without applying changes (default: false)

**Response:**
```json
{
  "success": true,
  "restoreId": "RESTORE-SPO-2026-07-17-001",
  "backupId": "SPO-2026-07-17-001",
  "targetEnvironment": "production",
  "status": "Processing",
  "resourceCount": 2,
  "startTime": "2026-07-17T12:35:00Z",
  "estimatedCompletionTime": "2026-07-17T12:45:00Z"
}
```

#### Get Restore Status

```http
GET /restore/status/{restoreId}
```

**Response:**
```json
{
  "success": true,
  "restoreOperation": {
    "restoreId": "RESTORE-SPO-2026-07-17-001",
    "backupId": "SPO-2026-07-17-001",
    "serviceName": "SharePoint",
    "status": "Processing",
    "startTime": "2026-07-17T12:35:00Z",
    "completionTime": null,
    "resourceCount": 2,
    "resourcesRestored": 1,
    "resourcesFailed": 0,
    "details": [
      "Backup: SharePoint (2 total resources)",
      "Target Environment: production",
      "Selected 2 resources for restore",
      "Resource: Access Control Settings (SPOAccessControlSettings)",
      "Resource: CDN Policy (SPOTenantCDNPolicy)",
      "Restoring resource 1 of 2..."
    ]
  }
}
```

#### Get Restore History

```http
GET /restore/history?limit=10&service={service}
```

**Parameters:**
- `limit` (number, optional) - Number of restore operations to retrieve
- `service` (string, optional) - Filter by service

**Response:**
```json
{
  "success": true,
  "restores": [
    {
      "restoreId": "RESTORE-SPO-2026-07-17-001",
      "backupId": "SPO-2026-07-17-001",
      "serviceName": "SharePoint",
      "status": "Completed",
      "startTime": "2026-07-17T12:35:00Z",
      "completionTime": "2026-07-17T12:45:00Z",
      "resourceCount": 100,
      "resourcesRestored": 100,
      "resourcesFailed": 0
    }
  ],
  "total": 1
}
```

---

### 5. Change Detection

#### Compare Two Backups

```http
GET /compare/{backupId1}/{backupId2}
```

**Response:**
```json
{
  "success": true,
  "comparison": {
    "backup1": "SPO-2026-07-16-001",
    "backup2": "SPO-2026-07-17-001",
    "changes": {
      "added": [
        {
          "type": "SPOTenantCDNPolicy",
          "name": "New CDN Policy",
          "id": "spo-cdn-002"
        }
      ],
      "modified": [
        {
          "type": "SPOAccessControlSettings",
          "name": "Access Control Configuration",
          "id": "spo-ac-001",
          "changes": {
            "oldValue": "open",
            "newValue": "restricted"
          }
        }
      ],
      "deleted": []
    },
    "summary": {
      "added": 1,
      "modified": 1,
      "deleted": 0
    }
  }
}
```

---

## Testing Examples

### Test 1: List All Services

```bash
curl -X GET https://your-domain.com/api/backup/m365/services/list \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Test 2: Trigger Full Backup

```bash
curl -X POST https://your-domain.com/api/backup/m365/trigger-all \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "description": "Full system backup before maintenance",
    "priority": "high"
  }'
```

### Test 3: Get Latest Backup

```bash
curl -X GET https://your-domain.com/api/backup/m365/latest/SharePoint \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Test 4: Initiate Selective Restore

```bash
curl -X POST https://your-domain.com/api/backup/m365/restore/SPO-2026-07-17-001 \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "targetEnvironment": "production",
    "resourceIds": ["spo-ac-001", "spo-cdn-001"]
  }'
```

### Test 5: Check Restore Status

```bash
curl -X GET https://your-domain.com/api/backup/m365/restore/status/RESTORE-SPO-2026-07-17-001 \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

## Resource Coverage by Service

### OneDrive (30 resources - 100%)
- Phase 1: 10 resources
- Phase 2: 6 resources
- Phase 3: 9 resources
- Features: Site creation, retention, compliance, sharing, lifecycle, governance

### Groups (30 resources - 100%)
- Phase 1: 8 resources
- Phase 2: 7 resources
- Phase 3: 4 resources
- Features: Creation policy, expiration, sharing, compliance, governance

### SharePoint (100 resources - 100%)
- Phase 1-3: 47 resources
- Phase 4-5: 21 resources
- Phase 6: 12 resources
- Phase 7: 8 resources
- Phase 8: 12 resources
- Features: All governance, compliance, content, search, analytics, security

### Teams (64 resources - 100%)
- Phase 1: 34 resources
- Phase 2: 10 resources
- Phase 3: 10 resources
- Features: Messaging, meetings, voice, calling, policies, conference

### Exchange (100 resources - 100%)
- Phase 1: 39 resources
- Phase 2: 42 resources
- Phase 3: 19 resources
- Features: Mailbox, retention, DLP, transport rules, security, audit

### Security/Entra ID (54 resources - 100%)
- Phase 1: 28 resources (core identity)
- Phase 2: 13 resources (authentication & CA)
- Phase 3: 12 resources (governance & lifecycle)
- Features: Users, groups, applications, roles, policies, protection

### Intune (164 resources - 100%)
- Phase 1: 164 resources
- Features: Device config, compliance, app management, MDM/MAM

**Total: 542 resources across 7 services**

---

## Error Handling

### Common Error Responses

```json
{
  "success": false,
  "error": "Unknown service: InvalidService"
}
```

```json
{
  "success": false,
  "error": "No collector registered for InvalidService"
}
```

```json
{
  "success": false,
  "error": "Backup not found: INVALID-BACKUP-ID"
}
```

---

## Performance Metrics

### Backup Collection Time
- OneDrive: 5-8 seconds
- Groups: 3-5 seconds
- SharePoint: 15-20 seconds
- Teams: 8-12 seconds
- Exchange: 12-18 seconds
- Security: 15-20 seconds
- Intune: 20-30 seconds
- **Total for all services: 78-113 seconds**

### Storage Requirements
- OneDrive backup: 3-5 MB
- Groups backup: 2-3 MB
- SharePoint backup: 8-12 MB
- Teams backup: 5-8 MB
- Exchange backup: 6-10 MB
- Security backup: 10-15 MB
- Intune backup: 12-20 MB
- **Total per full backup: 46-73 MB**

### Restore Time
- Selective restore: 5-15 minutes
- Full service restore: 15-30 minutes
- All services restore: 60-120 minutes

---

## Authentication & Authorization

All endpoints require authentication via Bearer token (Azure AD OAuth 2.0).

**Required Permissions:**
- `Backup.Read` - Read backup history and details
- `Backup.Write` - Create backups
- `Restore.Execute` - Execute restore operations
- Service-specific admin roles (Global Admin, Security Admin, etc.)

---

## Pagination

Endpoints that return lists support pagination:

```http
GET /history/SharePoint?skip=0&take=10
```

**Parameters:**
- `skip` (number) - Number of records to skip
- `take` (number) - Number of records to return (max 100)

---

**API Version:** 1.0  
**Last Updated:** 2026-07-17  
**Status:** Production Ready
