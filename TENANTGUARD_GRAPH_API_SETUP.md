# TenantGuard Graph API Integration - Setup Guide

## ✅ Completed Components

### 1. **Graph API Client** (`backend/tenantguard/graph-api-client.js`)
Fetches security data from Microsoft Graph:
- Audit logs (7 days)
- Risk detections (Identity Protection)
- Risky sign-ins
- Service principals & apps
- OAuth consent grants
- Conditional Access policies
- **Features:** Retry logic, rate limiting, error handling

### 2. **Alert Detector** (`backend/tenantguard/real-alert-detector.js`)
Maps Graph API events → TenantGuard alert definitions:
- Identity & Access (MFA, Conditional Access, Privilege Escalation)
- Application Security (OAuth, Service Principal)
- Exchange, SharePoint, DLP & Compliance alerts
- Risk scoring and categorization
- **Output:** 53 alert types with priority levels

### 3. **SharePoint Writer** (`backend/tenantguard/sharepoint-writer.js`)
Persists alerts to SharePoint Lists:
- Writes alerts to `TenantGuard-Alerts` list
- Writes correlations to `TenantGuard-Correlations` list
- Writes investigations to `TenantGuard-Investigations` list
- Batch operations for efficiency
- Duplicate detection

### 4. **Sync Engine** (`backend/tenantguard/sync-engine.js`)
Orchestrates the entire flow:
- **Full Sync:** Fetch all data → Detect alerts → Store
- **Incremental Sync:** Only new data since last sync
- **Auto Sync:** Scheduled syncs at configurable intervals
- **Correlation Detection:** Identifies attack patterns

### 5. **API Endpoints** (in `backend/server.js`)
```
POST   /api/tenantguard/sync                    # Trigger full sync
POST   /api/tenantguard/sync/incremental        # Trigger incremental sync
GET    /api/tenantguard/sync/status             # Check sync status
```

---

## 🔧 Configuration Required

### Step 1: Get SharePoint List IDs

Run this PowerShell script to get the List IDs:

```powershell
# Connect to your SharePoint site
Connect-PnPOnline -Url "https://nasstech.sharepoint.com/sites/M365-AgentOps" -Interactive

# Get list IDs
$lists = Get-PnPList | Where-Object { $_.Title -match 'TenantGuard' }
foreach ($list in $lists) {
    Write-Host "$($list.Title): $($list.Id)"
}
```

Output will look like:
```
TenantGuard-Alerts: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
TenantGuard-Correlations: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
TenantGuard-Investigations: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
```

### Step 2: Update .env Configuration

In `.env.production` (or `.env` for local testing):

```bash
# Azure AD (Already configured)
AZURE_TENANT_ID=b9cc8284-05ed-452f-877a-970779430dcb
AZURE_CLIENT_ID=04d3be8d-d433-4367-893e-eccc82190a11
AZURE_CLIENT_SECRET=<from-app-service-config>

# TenantGuard Graph API
GRAPH_AUDIT_LOG_DAYS=7
CORRELATION_TIME_WINDOW=3600
ALERT_RETENTION_DAYS=90

# SharePoint List IDs (from PowerShell output above)
SHAREPOINT_SITE_ID=b60085d7-b9c8-41a3-8789-bab376d0c84f
SHAREPOINT_ALERTS_LIST_ID=xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
SHAREPOINT_CORRELATIONS_LIST_ID=xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
SHAREPOINT_INVESTIGATIONS_LIST_ID=xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
```

### Step 3: Verify Azure AD App Permissions

The app registration `04d3be8d-d433-4367-893e-eccc82190a11` needs these permissions:

**Required API Permissions:**
- ✅ `AuditLog.Read.All` — Read audit logs
- ✅ `RiskyUser.Read.All` — Read risky users
- ✅ `IdentityRiskEvent.Read.All` — Read risk detection
- ✅ `SecurityAlert.Read.All` — Read security alerts
- ✅ `Application.Read.All` — Read app registrations
- ✅ `ServicePrincipal.Read.All` — Read service principals
- ✅ `Sites.Read.All` — Access SharePoint Lists

**To verify/add permissions:**
1. Go to Azure AD → App Registrations → `04d3be8d-d433-4367-893e-eccc82190a11`
2. Click "API Permissions"
3. Click "Add a permission" → "Microsoft Graph"
4. Add any missing permissions from the list above
5. Click "Grant admin consent for [tenant]"

---

## 🚀 Usage

### Option 1: Manual Sync (Testing)

**Full sync from Graph API:**
```bash
curl -X POST http://localhost:3000/api/tenantguard/sync \
  -H "Content-Type: application/json"
```

**Response:**
```json
{
  "success": true,
  "timestamp": "2026-06-20T12:00:00.000Z",
  "duration_ms": 5432,
  "stats": {
    "alerts_detected": 23,
    "alerts_written": 23,
    "correlations_detected": 4,
    "correlations_written": 4
  },
  "alerts": [...],
  "correlations": [...]
}
```

**Check sync status:**
```bash
curl http://localhost:3000/api/tenantguard/sync/status
```

### Option 2: Scheduled Syncs (Production)

Add to your backend initialization code:

```javascript
import { scheduleAutoSync } from './tenantguard/sync-engine.js'

// Schedule auto-sync every 30 minutes
scheduleAutoSync(30)
```

Or via API:
```bash
curl -X POST http://localhost:3000/api/tenantguard/sync/schedule \
  -H "Content-Type: application/json" \
  -d '{"intervalMinutes": 30}'
```

---

## 📊 Data Flow

```
┌──────────────────────────────────────────┐
│  Microsoft Graph API                     │
│  ├─ Audit Logs (7 days)                  │
│  ├─ Risk Detections                      │
│  ├─ Risky Sign-ins                       │
│  ├─ Service Principals                   │
│  └─ OAuth Grants                         │
└──────────────┬───────────────────────────┘
               │ getAuditLogs(), getRiskDetections(), etc.
               ▼
┌──────────────────────────────────────────┐
│  Alert Detector                          │
│  ├─ Identity & Access (MFA, CAP, etc)   │
│  ├─ Application Security (OAuth)         │
│  ├─ Data Protection (DLP)                │
│  └─ Configuration Drift                  │
└──────────────┬───────────────────────────┘
               │ detectAllAlerts()
               ▼
┌──────────────────────────────────────────┐
│  Correlation Engine                      │
│  ├─ Actor-based                          │
│  ├─ Target-based                         │
│  ├─ Temporal (time-window)               │
│  └─ Pattern-based                        │
└──────────────┬───────────────────────────┘
               │ detectCorrelations()
               ▼
┌──────────────────────────────────────────┐
│  SharePoint Lists                        │
│  ├─ TenantGuard-Alerts (23 items)        │
│  ├─ TenantGuard-Correlations (4 items)   │
│  └─ TenantGuard-Investigations           │
└──────────────┬───────────────────────────┘
               │ getAllAlerts() via API
               ▼
┌──────────────────────────────────────────┐
│  Dashboard (Frontend)                    │
│  ├─ Real-time alerts display             │
│  ├─ Attack patterns visualization        │
│  └─ Investigation management             │
└──────────────────────────────────────────┘
```

---

## 🧪 Testing

### 1. **Test Graph API Connection**

```javascript
import { testConnection } from './backend/tenantguard/graph-api-client.js'

const connected = await testConnection()
console.log(connected ? '✅ Connected' : '❌ Failed')
```

### 2. **Fetch Sample Data**

```javascript
import { getAuditLogs } from './backend/tenantguard/graph-api-client.js'

const logs = await getAuditLogs({}, 1) // Last 1 day
console.log(`Found ${logs.length} audit logs`)
```

### 3. **Test Alert Detection**

```javascript
import { detectAllAlerts } from './backend/tenantguard/real-alert-detector.js'

const alerts = detectAllAlerts({
  auditLogs: [...],
  riskDetections: [...],
  // etc
})
console.log(`Detected ${alerts.length} alerts`)
```

### 4. **Full Integration Test**

```bash
# Start backend
npm run server

# Trigger sync
curl -X POST http://localhost:3000/api/tenantguard/sync

# Check SharePoint Lists in browser
# https://nasstech.sharepoint.com/sites/M365-AgentOps/Lists/TenantGuard-Alerts
```

---

## 📋 Checklist Before Production

- [ ] Azure AD app permissions verified (all 7 required)
- [ ] Client Secret stored securely in Azure Key Vault
- [ ] SharePoint List IDs obtained and configured
- [ ] Environment variables set in App Service
- [ ] Graph API connection tested successfully
- [ ] Full sync executed and data written to SharePoint
- [ ] Dashboard displays real alerts (not demo data)
- [ ] Investigation workflow tested with real alerts
- [ ] Auto-sync scheduled (30-minute interval recommended)
- [ ] Monitoring alerts configured (response time, error rate)
- [ ] Backup strategy for SharePoint Lists

---

## 🔍 Monitoring & Debugging

### View Sync Logs

```bash
# Backend logs (Docker)
docker logs m365-agentops-api | grep "TenantGuard\|Graph\|Sync"

# Or in Application Insights
az monitor app-insights query --resource-group <rg> --app <name> \
  --query "traces | where message contains 'Sync'"
```

### Common Issues

**Issue:** `Graph API connection failed`
- **Check:** Client Secret is correct and not expired
- **Check:** App permissions granted and admin consent given
- **Check:** Network connectivity to graph.microsoft.com

**Issue:** `Failed to write to SharePoint`
- **Check:** List IDs are correct
- **Check:** App has `Sites.Read.All` permission
- **Check:** SharePoint site is accessible

**Issue:** `No alerts detected`
- **Check:** Audit logs exist in the tenant (check 7 days)
- **Check:** Alert detection logic matches your environment

---

## 📈 Performance Expectations

| Operation | Time | Notes |
|-----------|------|-------|
| Fetch 7 days audit logs | 2-5s | Paginated, 100 items/page |
| Detect alerts from logs | 1-2s | Processing 100s of events |
| Write to SharePoint | 3-10s | Batch operations |
| Full sync cycle | 10-30s | All data sources |

**Optimization tips:**
- Increase `GRAPH_AUDIT_LOG_DAYS` gradually (monitor rate limiting)
- Use incremental sync for frequent runs
- Schedule full sync during off-hours (lower throttling)
- Cache static data (roles, apps) for 1 hour

---

## 🎯 Next Steps

1. **Get SharePoint List IDs** (PowerShell script above)
2. **Update .env configuration**
3. **Verify Azure AD permissions**
4. **Test Graph API connection**
5. **Trigger first full sync**
6. **Verify data in SharePoint Lists**
7. **Update dashboard to fetch from SharePoint** (instead of demo data)
8. **Configure scheduled syncs** (30-minute intervals)
9. **Set up monitoring & alerts**
10. **Deploy to production**

---

## 📞 Support

For issues with:
- **Graph API:** Check [Microsoft Graph docs](https://docs.microsoft.com/en-us/graph/overview)
- **SharePoint:** Check [PnP PowerShell docs](https://pnp.github.io/powershell/)
- **TenantGuard:** Check implementation notes in code comments
