# M365 AgentOps - Azure Deployment Guide

**Status:** Ready for Phase 1  
**Target Timeline:** 2-3 weeks  
**Total Azure Cost (annual):** ~$1,500-2,000

---

## Phase 1: Build & Deploy Frontend to Azure Static Web Apps (Days 1-2)

### 1.1 Prerequisites
- Azure subscription (free trial works)
- GitHub account with repo
- Azure CLI installed locally

### 1.2 Build the Application
```bash
cd /Users/vasanthipromoters/Documents/M365_OpsAgent/m365-agentops
npm install --cache /tmp/npm-cache
npm run build --cache /tmp/npm-cache
```

This creates `/dist/` folder with static files ready for deployment.

### 1.3 Create Azure Static Web Apps Resource

**Option A: Via Azure Portal (Easy)**
1. Go to portal.azure.com
2. Search "Static Web Apps" → Create
3. Fill in:
   - Resource Group: `m365-agentops-rg`
   - Name: `m365ops` (will be `m365ops.azurestaticapps.net`)
   - Region: `East US` or closest to you
   - Hosting Plan: Free (sufficient for this)
4. Connect GitHub → select your repo → main branch
5. Build preset: Custom
   - App location: `.` (root)
   - Build output location: `dist`
6. Click Create

**Result:** App deployed at `https://m365ops.azurestaticapps.net` with auto-redeploy on git push

### 1.4 Verify Deployment
- Visit `https://m365ops.azurestaticapps.net`
- Login screen appears (with simulated data)
- ✅ Confirm it works

### 1.5 (Optional) Add Custom Domain
1. Azure Portal → Static Web Apps → m365ops
2. Custom domains → Add
3. Point DNS CNAME to `m365ops.azurestaticapps.net`
4. Takes 5-15 mins to activate

**At this point:** You have a live, publicly accessible app with simulated data.

---

## Phase 2: Entra ID Authentication Setup (Days 3-4)

### 2.1 Register App in Azure Entra ID

1. **Azure Portal → App registrations → New registration**
2. **Name:** `M365 AgentOps`
3. **Supported account types:** Multitenant
4. **Redirect URI:** Web
   - Add: `https://m365ops.azurestaticapps.net/callback`
   - Add: `https://m365ops.azurestaticapps.net` (for main page)
5. Click Register

### 2.2 Configure App Permissions

1. Go to **API permissions**
2. Add permission → Microsoft Graph
   - **Delegated permissions** (for reading on behalf of user):
     - `User.Read` (read user profile)
     - `DeviceManagementReadWrite.All` (Intune devices)
     - `SecurityEvents.Read.All` (Security)
     - `Application.Read.All` (Entra apps)
     - `Directory.Read.All` (general directory access)
3. Grant admin consent (as your tenant admin)

### 2.3 Create Client Secret

1. Go to **Certificates & secrets**
2. Client secrets → New client secret
3. Description: `M365 AgentOps Backend`
4. Expires: 12 months
5. **Copy the value** (you'll need this in Phase 3)

### 2.4 Note These Values
```
AZURE_TENANT_ID = [Directory (tenant) ID from Overview tab]
AZURE_CLIENT_ID = [Application (client) ID from Overview tab]
AZURE_CLIENT_SECRET = [Value from Certificates & secrets]
REDIRECT_URI = https://m365ops.azurestaticapps.net/callback
```

**At this point:** Entra ID is configured but frontend still uses fake login.

---

## Phase 3: Create Node.js Backend Service (Days 5-7)

### 3.1 Create Azure App Service for Backend

1. **Azure Portal → App Services → Create**
2. **Resource Group:** m365-agentops-rg (same as frontend)
3. **Name:** `m365ops-api` (will be `m365ops-api.azurewebsites.net`)
4. **Publish:** Code
5. **Runtime stack:** Node 20 LTS
6. **Region:** Same as Static Web Apps
7. **App Service Plan:** Free tier works for start (later upgrade if needed)
8. Click Create

### 3.2 Create Backend Service Locally

Create `/backend/server.js` in your project:

```javascript
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const axios = require('axios');
const { ClientSecretCredential } = require('@azure/identity');
const { Client } = require('@microsoft/microsoft-graph-client');
const { TokenCredentialAuthenticationProvider } = require('@microsoft/microsoft-graph-client/authProviders/azureTokenCredentials');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());

// Azure Identity Setup
const credential = new ClientSecretCredential(
  process.env.AZURE_TENANT_ID,
  process.env.AZURE_CLIENT_ID,
  process.env.AZURE_CLIENT_SECRET
);

const authProvider = new TokenCredentialAuthenticationProvider(credential, {
  scopes: ['https://graph.microsoft.com/.default']
});

const graphClient = Client.initWithMiddleware({ authProvider });

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Get user profile
app.get('/api/user', async (req, res) => {
  try {
    const user = await graphClient.api('/me').get();
    res.json({ success: true, data: user });
  } catch (error) {
    console.error('Graph API error:', error.message);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get Intune devices
app.get('/api/devices', async (req, res) => {
  try {
    const devices = await graphClient
      .api('/deviceManagement/managedDevices')
      .get();
    res.json({ success: true, data: devices.value });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get Security Score
app.get('/api/security/score', async (req, res) => {
  try {
    const scores = await graphClient
      .api('/security/secureScores')
      .get();
    res.json({ success: true, data: scores.value[0] });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get Application Registrations
app.get('/api/applications', async (req, res) => {
  try {
    const apps = await graphClient
      .api('/applications')
      .get();
    res.json({ success: true, data: apps.value });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Backend listening on port ${PORT}`);
  console.log(`Connecting to tenant: ${process.env.AZURE_TENANT_ID}`);
});
```

Create `/backend/package.json`:

```json
{
  "name": "m365ops-backend",
  "version": "1.0.0",
  "description": "M365 AgentOps Backend API",
  "main": "server.js",
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js"
  },
  "dependencies": {
    "express": "^4.18.2",
    "cors": "^2.8.5",
    "axios": "^1.6.2",
    "dotenv": "^16.3.1",
    "@azure/identity": "^3.4.0",
    "@microsoft/microsoft-graph-client": "^3.0.4"
  },
  "devDependencies": {
    "nodemon": "^3.0.1"
  }
}
```

Create `/backend/.env.example`:

```
AZURE_TENANT_ID=your-tenant-id
AZURE_CLIENT_ID=your-client-id
AZURE_CLIENT_SECRET=your-client-secret
FRONTEND_URL=https://m365ops.azurestaticapps.net
PORT=3000
```

### 3.3 Deploy Backend to Azure App Service

1. **Via Azure Portal → m365ops-api → Deployment Center**
2. **Source:** GitHub
3. **Select:** Your repo → main branch
4. Let GitHub Actions auto-configure deployment

**Or via CLI:**
```bash
cd backend
npm install
az webapp up --name m365ops-api --resource-group m365-agentops-rg --runtime "node|20-lts"
```

### 3.4 Set Environment Variables in Azure

1. **Azure Portal → m365ops-api → Configuration**
2. **Application settings → New application setting**
3. Add:
   - `AZURE_TENANT_ID` = [your value from Phase 2.4]
   - `AZURE_CLIENT_ID` = [your value from Phase 2.4]
   - `AZURE_CLIENT_SECRET` = [your value from Phase 2.4]
   - `FRONTEND_URL` = `https://m365ops.azurestaticapps.net`
4. Click Save

### 3.5 Test Backend

```bash
curl https://m365ops-api.azurewebsites.net/api/health
# Should return: {"status":"ok","timestamp":"..."}
```

**At this point:** Backend API is live and can call Microsoft Graph API.

---

## Phase 4: Update Frontend to Use Backend (Days 8-9)

### 4.1 Create API Client Library

Create `/src/lib/api.js`:

```javascript
const API_BASE = process.env.VITE_API_URL || 'https://m365ops-api.azurewebsites.net/api';

export async function fetchFromApi(endpoint) {
  try {
    const response = await fetch(`${API_BASE}${endpoint}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include'
    });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return await response.json();
  } catch (error) {
    console.error(`API error on ${endpoint}:`, error.message);
    return { success: false, error: error.message };
  }
}

export async function getUser() { return fetchFromApi('/user'); }
export async function getDevices() { return fetchFromApi('/devices'); }
export async function getSecurityScore() { return fetchFromApi('/security/score'); }
export async function getApplications() { return fetchFromApi('/applications'); }
```

### 4.2 Update Dashboard to Use Real Data

Modify `/pages/dashboard.js` to call backend instead of simulated data:

```javascript
import { getUser, getDevices, getSecurityScore } from '../lib/api.js';

export async function initDashboard() {
  const el = document.getElementById('page-dashboard');
  if (!el) return;
  
  el.innerHTML = '<div style="padding:20px"><div class="spinner"></div> Loading...</div>';
  
  // Fetch real data from backend
  const user = await getUser();
  const devices = await getDevices();
  const security = await getSecurityScore();
  
  // Render with real data
  render(el, { user: user.data, devices: devices.data, security: security.data });
}
```

### 4.3 Create vite.config.js for Environment Variables

```javascript
import { defineConfig } from 'vite'

export default defineConfig({
  define: {
    'process.env.VITE_API_URL': JSON.stringify(
      process.env.VITE_API_URL || 'https://m365ops-api.azurewebsites.net/api'
    )
  }
})
```

### 4.4 Deploy Updated Frontend

```bash
npm run build --cache /tmp/npm-cache
git add -A
git commit -m "feat: integrate backend API for real M365 data"
git push origin main
```

Static Web Apps auto-deploys from GitHub.

**At this point:** Frontend calls backend → backend calls real Graph API → displays real M365 data.

---

## Phase 5: Add Database for State Persistence (Days 10-12)

### 5.1 Create Azure SQL Database

1. **Azure Portal → SQL databases → Create**
2. **Resource Group:** m365-agentops-rg
3. **Database name:** `m365ops-db`
4. **Server:** Create new → `m365ops-server`
5. **Location:** Same region
6. **Compute + storage:** General Purpose, 1 vCore (sufficient)
7. **Authentication:** SQL authentication
   - Admin login: `m365admin`
   - Password: [save securely]
8. Click Create

### 5.2 Create Database Schema

Connect via SQL Server Management Studio or Azure Data Studio:

```sql
CREATE TABLE [dbo].[Users] (
  [Id] INT PRIMARY KEY IDENTITY,
  [UPN] NVARCHAR(255) NOT NULL UNIQUE,
  [DisplayName] NVARCHAR(255),
  [Role] NVARCHAR(50),
  [LastLogin] DATETIME,
  [CreatedAt] DATETIME DEFAULT GETDATE()
);

CREATE TABLE [dbo].[AuditLog] (
  [Id] INT PRIMARY KEY IDENTITY,
  [UserId] INT,
  [Action] NVARCHAR(255),
  [Resource] NVARCHAR(255),
  [Timestamp] DATETIME DEFAULT GETDATE(),
  FOREIGN KEY ([UserId]) REFERENCES [dbo].[Users]([Id])
);

CREATE TABLE [dbo].[Settings] (
  [Id] INT PRIMARY KEY IDENTITY,
  [UserId] INT,
  [Setting] NVARCHAR(255),
  [Value] NVARCHAR(MAX),
  FOREIGN KEY ([UserId]) REFERENCES [dbo].[Users]([Id])
);
```

### 5.3 Update Backend to Use Database

Add to `/backend/server.js`:

```javascript
const mssql = require('mssql');

const sqlConfig = {
  server: process.env.SQL_SERVER,
  database: process.env.SQL_DATABASE,
  authentication: {
    type: 'default',
    options: {
      userName: process.env.SQL_USERNAME,
      password: process.env.SQL_PASSWORD
    }
  },
  options: {
    encrypt: true,
    trustServerCertificate: false,
    connectionTimeout: 30000,
    requestTimeout: 30000,
  }
};

const pool = new mssql.ConnectionPool(sqlConfig);
const poolConnect = pool.connect();

// Log user login
app.post('/api/user/login', async (req, res) => {
  try {
    const { upn, displayName } = req.body;
    const ps = new mssql.PreparedStatement(await poolConnect);
    ps.input('upn', mssql.NVarChar(255));
    ps.input('displayName', mssql.NVarChar(255));
    
    await ps.query(`
      MERGE dbo.Users AS target
      USING (SELECT @upn AS UPN, @displayName AS DisplayName) AS source
      ON target.UPN = source.UPN
      WHEN MATCHED THEN UPDATE SET LastLogin = GETDATE()
      WHEN NOT MATCHED THEN INSERT (UPN, DisplayName, LastLogin) 
        VALUES (source.UPN, source.DisplayName, GETDATE());
    `);
    
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});
```

### 5.4 Add Database Credentials to Azure App Service

1. **Azure Portal → m365ops-api → Configuration**
2. **Application settings → New application setting**
3. Add:
   - `SQL_SERVER` = `m365ops-server.database.windows.net`
   - `SQL_DATABASE` = `m365ops-db`
   - `SQL_USERNAME` = `m365admin`
   - `SQL_PASSWORD` = [your password]
4. Click Save

**At this point:** Application stores user logins and audit logs in database.

---

## Phase 6: Production Hardening (Days 13-14)

### 6.1 Enable HTTPS & SSL

- ✅ Azure Static Web Apps: HTTPS enabled by default
- ✅ Azure App Service: HTTPS enabled by default
- Azure SQL: Use encrypted connections (already configured)

### 6.2 Setup Monitoring & Alerts

1. **Azure Portal → m365ops-api → Application Insights**
2. Enable Application Insights (automatically configured)
3. Set alerts for:
   - HTTP errors (5xx)
   - Slow requests (> 2 sec)
   - Exceptions

### 6.3 Enable Backup

**For Azure SQL:**
1. **Azure Portal → m365ops-db → Backups**
2. **Backup retention:** 35 days (default)
3. Test restore process

**For Static Web Apps:**
- GitHub is your backup (all code versioned)

### 6.4 Security Best Practices

- [ ] Enable Azure Defender for SQL
- [ ] Configure Firewall rules for SQL (allow only App Service)
- [ ] Use Azure Key Vault for secrets (not in app settings)
- [ ] Enable logging for all API calls
- [ ] Rotate client secret annually

### 6.5 Performance Testing

Test at `https://m365ops.azurestaticapps.net`:
- [ ] Login works
- [ ] Dashboard loads real data
- [ ] Intune/Security/Apps pages show real data
- [ ] No console errors
- [ ] Page load < 3 seconds

---

## Phase 7: Custom Domain & SSL (Optional, Days 15)

1. **Azure Static Web Apps → m365ops → Custom domains**
2. Add your domain (e.g., `m365ops.yourdomain.com`)
3. Point DNS CNAME to provided value
4. SSL certificate auto-provisioned (takes 5-15 mins)

---

## Deployment Checklist

- [ ] **Phase 1:** Frontend deployed to Static Web Apps
- [ ] **Phase 2:** Entra ID app registered with permissions
- [ ] **Phase 3:** Node.js backend deployed to App Service
- [ ] **Phase 4:** Frontend updated to call backend API
- [ ] **Phase 5:** Azure SQL Database created and configured
- [ ] **Phase 6:** Monitoring and backups enabled
- [ ] **Phase 7:** Custom domain configured (optional)

---

## Cost Estimate (Monthly)

| Service | Tier | Cost |
|---------|------|------|
| Static Web Apps | Free | $0 |
| App Service | Free ($0) → B1 ($15) | $15 |
| Azure SQL | Standard S0 | $15 |
| Application Insights | Pay-as-you-go | $0-20 |
| Data transfer | Minimal | $0-5 |
| **TOTAL** | | **$30-55/month** |

---

## Troubleshooting

**Static Web Apps won't deploy:**
- Check GitHub Actions → Workflows
- Ensure `npm run build` works locally first
- Verify build output location is `dist/`

**Backend API returns 500:**
- Check Azure App Service logs (Diagnose and solve problems)
- Verify Graph API permissions granted in Entra ID
- Confirm environment variables set in Configuration

**Frontend can't reach backend:**
- Verify CORS enabled in backend
- Check FRONTEND_URL environment variable
- Ensure API endpoint URL correct in frontend

**Real data not showing:**
- Confirm authenticated user has Graph API permissions
- Check Application Insights for Graph API errors
- Verify API responses in Network tab (F12)

---

## Next Steps

1. **Week 1:** Deploy Phase 1-3 (frontend + backend live)
2. **Week 2:** Complete Phase 4-5 (real data + database)
3. **Week 3:** Phase 6-7 (hardening + custom domain)

Ready to start? Begin with **Phase 1: Build & Deploy Frontend**.
