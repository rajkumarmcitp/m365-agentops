# App Registration Strategy for M365 Backup System

## Why Separate App Registration?

### Problem with Single App
```
Single App Registration
│
├─ Regular Operations (Dashboard, Reports, etc.)
│  ├─ Query limits: 2,000 requests/60s
│  └─ Currently uses 500 req/min average
│
└─ Backup Operations (New Heavy Load)
   ├─ Query limits: 2,000 requests/60s (SHARED)
   ├─ Backup needs 1,500 req/min peak
   └─ ⚠️ CONFLICT: Regular ops get throttled during backups
```

### Solution: Separate App Registration
```
App Registration 1 (Main/Production)         App Registration 2 (Backup)
│                                            │
├─ Regular Operations                        ├─ Backup Operations Only
├─ Isolated 2,000 req/60s limit             ├─ Isolated 2,000 req/60s limit
├─ Dashboard queries                        ├─ Backup triggers
├─ Reports                                  ├─ Resource collection
├─ Real-time operations                     ├─ Change detection
└─ NOT affected by backup load             └─ NOT affecting production

✅ Each app has independent throttle limits
✅ Backups won't impact production queries
✅ Better observability and monitoring
✅ Compliance and audit trail separation
```

---

## Graph API Throttling Details

### Default Limits (Per App Registration)
```
Tenant Level:
- 2,000 requests per 60 seconds
- 4,000 concurrent requests

Per User:
- 2,000 requests per 60 seconds per user
- 3,000 concurrent requests per user
```

### Backup Operation Typical Load
```
Exchange Online Backup:
├─ Distribution Groups:    ~100 API calls
├─ Mail Contacts:          ~50 API calls
├─ Transport Rules:        ~30 API calls
├─ Connectors:            ~20 API calls
├─ Mailbox Settings:      ~500 API calls (per resource)
└─ Total per backup: 1,000-2,000 calls (if multiple resources)

Teams Backup:
├─ Teams:                 ~200 API calls
├─ Channels:              ~500 API calls
├─ Policies:              ~100 API calls
└─ Total: 800+ API calls

SharePoint Backup:
├─ Sites:                 ~300 API calls
├─ Permissions:           ~500 API calls
└─ Total: 800+ API calls

FULL BACKUP CYCLE: 3,000-5,000+ API calls
⚠️ At 60-90 minute backup window = 800+ req/min average
   Regular app running 500-600 req/min = 1,300-1,600 req/min = THROTTLING RISK
```

---

## Recommended Architecture

### Production Setup

```
┌─────────────────────────────────────────────────────────┐
│              Azure AD (Your Tenant)                      │
└─────────────────────────────────────────────────────────┘
     │
     ├─────────────────────────┬─────────────────────────┐
     │                         │                         │
     ▼                         ▼                         ▼
┌──────────────┐         ┌──────────────┐         ┌──────────────┐
│   App Reg 1  │         │   App Reg 2  │         │   App Reg 3  │
│   (Main)     │         │   (Backup)   │         │   (Reports)  │
└──────────────┘         └──────────────┘         └──────────────┘
     │                         │                         │
     ├─ Dashboard             ├─ Backup Trigger        ├─ Analytics
     ├─ Real-time Queries     ├─ Collectors            ├─ Reporting
     ├─ User Mgmt             ├─ Change Detection      └─ Auditing
     ├─ Compliance Checks     └─ Storage
     └─ Quick Actions

Permissions Per App:
├─ App 1: Minimal necessary permissions for dashboard
├─ App 2: Exchange.ManageAsApp, SharePoint.Manage, etc. (BACKUP ONLY)
└─ App 3: Only read permissions for reports
```

---

## Setup: Creating Backup App Registration

### Step 1: Create New App in Azure AD

1. Go to Azure Portal → Azure Active Directory → App registrations
2. Click "New registration"
3. Fill in details:
   ```
   Name: M365-Backup-Agent
   Supported account types: Single tenant
   Redirect URI: (leave empty for now)
   ```
4. Click "Register"

### Step 2: Configure App Permissions

Go to API Permissions and add:

**Exchange Permissions:**
```
✅ Exchange.ManageAsApp
✅ Mail.ReadWrite
✅ MailboxSettings.ReadWrite
✅ Organization.Read.All
```

**SharePoint Permissions:**
```
✅ Sites.ReadWrite.All
✅ Sites.Manage.All
✅ SharePointTenantSettings.Read.All
```

**Teams Permissions:**
```
✅ TeamSettings.ReadWrite.All
✅ ChannelSettings.ReadWrite.All
✅ TeamsAppInstallation.ReadWrite.All
```

**Compliance Permissions:**
```
✅ DLP.ReadWrite
✅ eDiscovery.Read.All
✅ InformationProtectionPolicy.Read.All
```

**Intune Permissions:**
```
✅ DeviceManagementConfiguration.ReadWrite.All
✅ DeviceManagementServiceConfig.ReadWrite.All
```

**Microsoft Graph Permissions:**
```
✅ Application.Read.All
✅ Organization.Read.All
✅ User.Read.All
```

### Step 3: Create Client Secret

1. Go to "Certificates & secrets"
2. Click "New client secret"
3. Set expiration (12 months recommended)
4. Copy the Value (you'll use this in environment variables)

### Step 4: Get App Details

From "Overview" tab, copy:
- Application (client) ID
- Directory (tenant) ID

### Step 5: Grant Admin Consent

1. In API Permissions, click "Grant admin consent for [tenant]"
2. Wait for consent to complete

---

## Environment Configuration

### Add to `.env.production`

```env
# MAIN APP REGISTRATION (Existing)
AZURE_CLIENT_ID=your-main-app-id
AZURE_CLIENT_SECRET=your-main-secret
AZURE_TENANT_ID=your-tenant-id

# NEW: BACKUP APP REGISTRATION (Separate)
BACKUP_AZURE_CLIENT_ID=your-backup-app-id
BACKUP_AZURE_CLIENT_SECRET=your-backup-secret
BACKUP_AZURE_TENANT_ID=your-tenant-id

# Backup Configuration
BACKUP_RETRY_ATTEMPTS=3
BACKUP_RETRY_DELAY_MS=5000
BACKUP_REQUEST_TIMEOUT_MS=30000
BACKUP_MAX_CONCURRENT_REQUESTS=10
BACKUP_THROTTLE_WAIT_MS=1000
```

---

## Implementation: Dual GraphClient Support

### Create backup-auth.js

```javascript
// backend/lib/backup-auth.js
import { ClientSecretCredential } from '@azure/identity'
import { Client } from '@microsoft/microsoft-graph-client'
import { TokenCredentialAuthenticationProvider } from '@microsoft/microsoft-graph-client/authProviders/azureTokenCredentials'

export async function getBackupGraphClient() {
  // Use BACKUP app registration, not main app
  const credential = new ClientSecretCredential(
    process.env.BACKUP_AZURE_TENANT_ID,
    process.env.BACKUP_AZURE_CLIENT_ID,
    process.env.BACKUP_AZURE_CLIENT_SECRET
  )

  const authProvider = new TokenCredentialAuthenticationProvider(credential, {
    scopes: ['https://graph.microsoft.com/.default']
  })

  const client = Client.initWithMiddleware({
    authProvider,
    defaultVersion: 'v1.0'
  })

  return client
}

export default getBackupGraphClient
```

### Update backup-agent.js

```javascript
// Use backup graph client instead of main graph client
import getBackupGraphClient from './backup-auth.js'

export class BackupAgent {
  async initialize() {
    // Use separate backup client
    this.graphClient = await getBackupGraphClient()
    console.log('✅ Backup Agent using separate app registration')
  }
}
```

---

## Monitoring & Alerting

### Track API Usage

```javascript
// backend/lib/backup-monitor.js
export class BackupMonitor {
  async trackApiUsage(appId, requestCount, timeWindow) {
    // Log API usage per app registration
    console.log(`
      📊 API Usage Report
      App: ${appId}
      Requests: ${requestCount}
      Time Window: ${timeWindow}ms
      Rate: ${Math.round((requestCount / timeWindow) * 60000)} req/min
    `)

    // Alert if approaching limits
    if (requestCount > 1800) {
      console.warn('⚠️ Approaching throttle limit!')
    }
  }
}
```

### Setup Alerts

```
App Registration 1 (Main):
└─ Alert: If > 1,500 req/min → Possible issue

App Registration 2 (Backup):
└─ Alert: If > 1,500 req/min during backup → Normal
         If > 1,500 outside backup window → Investigate
```

---

## Benefits Summary

| Aspect | Single App | Separate Apps |
|--------|-----------|---------------|
| **Throttle Isolation** | ❌ Shared | ✅ Independent |
| **Production Impact** | ❌ Backups can break production | ✅ Protected |
| **Monitoring** | ⚠️ Mixed signals | ✅ Clear separation |
| **Compliance** | ⚠️ Audit trail mixed | ✅ Separate trails |
| **Scaling** | ❌ Limited | ✅ Can add more apps |
| **Cost** | ✅ 1 app | ⚠️ 2-3 apps (minimal) |

---

## Recommended Setup

### Development
```
Single app registration (simpler testing)
```

### Staging
```
Separate apps (test throttle behavior)
```

### Production
```
3 App Registrations:
├─ App 1: Main/Dashboard operations
├─ App 2: Backup operations
└─ App 3: Reports/Analytics (optional)
```

---

## Migration Path (If You Start with Single App)

```
Phase 1 (Current): Single app works for testing
                   ↓
Phase 2 (When scaling): Create backup app
                        ↓
Phase 3 (Update code): Switch to backup app for backups
                       ↓
Phase 4 (Production): Enable dual app setup
```

---

## Cost Impact

Azure AD App Registrations: **FREE**
- No additional licensing cost
- No API call costs (you already pay for M365)
- Just administrative effort to set up

---

## Next Steps

1. **For Testing Now**: Use existing app (Phase 1 - single app acceptable)
2. **Before Production**: Create backup app registration
3. **For Monitoring**: Implement usage tracking
4. **For Scale**: Consider third app for reports/analytics

---

**Recommendation**: Start with single app for testing, migrate to separate backup app before production deployment.
