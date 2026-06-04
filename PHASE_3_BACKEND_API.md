# Phase 3: Node.js Backend API & Graph API Integration

**Goal:** Create secure backend to fetch real Microsoft 365 data  
**Timeline:** 2-3 days  
**Complexity:** Medium-High  
**Cost:** +$40-60/month (Azure App Service)

---

## Architecture Overview

```
Frontend (SPA)
    ↓
MSAL Authentication ← Entra ID
    ↓
Backend API (Node.js)
    ↓
Graph API ← Real M365 Data
    ↓
Azure SQL Database (optional)
```

---

## Step 1: Create Backend Project Structure (30 mins)

### 1.1 Create Backend Directory

```bash
cd /Users/vasanthipromoters/Documents/M365_OpsAgent/m365-agentops
mkdir -p backend
cd backend
```

### 1.2 Create package.json

Create `/backend/package.json`:

```json
{
  "name": "m365ops-backend",
  "version": "1.0.0",
  "description": "M365 AgentOps Backend API",
  "main": "server.js",
  "type": "module",
  "scripts": {
    "start": "node server.js",
    "dev": "node server.js"
  },
  "dependencies": {
    "express": "^4.18.2",
    "cors": "^2.8.5",
    "dotenv": "^16.3.1",
    "@azure/identity": "^3.4.0",
    "@microsoft/microsoft-graph-client": "^3.0.4"
  }
}
```

### 1.3 Create .env.example

Create `/backend/.env.example`:

```
# Azure Entra ID
AZURE_TENANT_ID=your-tenant-id
AZURE_CLIENT_ID=your-client-id
AZURE_CLIENT_SECRET=your-client-secret

# Frontend URL (for CORS)
FRONTEND_URL=https://proud-river-0f55f1e10.7.azurestaticapps.net

# Server
PORT=3000
NODE_ENV=production
```

### 1.4 Create .gitignore

Create `/backend/.gitignore`:

```
node_modules/
.env
.env.local
dist/
*.log
```

---

## Step 2: Build Backend Server (1-2 hours)

Create `/backend/server.js`:

```javascript
import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import { ClientSecretCredential } from '@azure/identity'
import { Client } from '@microsoft/microsoft-graph-client'
import { TokenCredentialAuthenticationProvider } from '@microsoft/microsoft-graph-client/authProviders/azureTokenCredentials'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 3000

// CORS Configuration
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}))

app.use(express.json())

// ============================================================
// Azure Identity & Graph Client Setup
// ============================================================
const credential = new ClientSecretCredential(
  process.env.AZURE_TENANT_ID,
  process.env.AZURE_CLIENT_ID,
  process.env.AZURE_CLIENT_SECRET
)

const authProvider = new TokenCredentialAuthenticationProvider(credential, {
  scopes: ['https://graph.microsoft.com/.default']
})

const graphClient = Client.initWithMiddleware({ authProvider })

// ============================================================
// Health Check
// ============================================================
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    service: 'M365 AgentOps Backend'
  })
})

// ============================================================
// Device Management (Intune)
// ============================================================
app.get('/api/devices', async (req, res) => {
  try {
    const devices = await graphClient
      .api('/deviceManagement/managedDevices')
      .select(['id', 'deviceName', 'operatingSystem', 'osVersion', 'lastSyncDateTime', 'owner', 'isCompliant', 'encryptionStatus'])
      .get()

    res.json({
      success: true,
      count: devices.value.length,
      data: devices.value.slice(0, 50) // Limit to 50 for performance
    })
  } catch (error) {
    console.error('Devices API error:', error.message)
    res.status(500).json({
      success: false,
      error: error.message,
      endpoint: '/deviceManagement/managedDevices'
    })
  }
})

// Get device compliance policies
app.get('/api/device-compliance-policies', async (req, res) => {
  try {
    const policies = await graphClient
      .api('/deviceManagement/deviceCompliancePolicies')
      .get()

    res.json({
      success: true,
      count: policies.value.length,
      data: policies.value
    })
  } catch (error) {
    console.error('Compliance policies error:', error.message)
    res.status(500).json({
      success: false,
      error: error.message
    })
  }
})

// ============================================================
// Security (Secure Score & Defender)
// ============================================================
app.get('/api/security/score', async (req, res) => {
  try {
    const scores = await graphClient
      .api('/security/secureScores')
      .get()

    const latestScore = scores.value[0]
    res.json({
      success: true,
      data: latestScore
    })
  } catch (error) {
    console.error('Secure score error:', error.message)
    res.status(500).json({
      success: false,
      error: error.message,
      endpoint: '/security/secureScores'
    })
  }
})

// ============================================================
// Identity & Users
// ============================================================
app.get('/api/users', async (req, res) => {
  try {
    const users = await graphClient
      .api('/users')
      .select(['id', 'displayName', 'userPrincipalName', 'accountEnabled', 'createdDateTime'])
      .top(50)
      .get()

    res.json({
      success: true,
      count: users.value.length,
      data: users.value
    })
  } catch (error) {
    console.error('Users API error:', error.message)
    res.status(500).json({
      success: false,
      error: error.message
    })
  }
})

// Get risky users
app.get('/api/identity/risky-users', async (req, res) => {
  try {
    const riskyUsers = await graphClient
      .api('/identityProtection/riskyUsers')
      .get()

    res.json({
      success: true,
      count: riskyUsers.value.length,
      data: riskyUsers.value
    })
  } catch (error) {
    console.error('Risky users error:', error.message)
    res.status(500).json({
      success: false,
      error: error.message,
      note: 'Requires Azure AD Premium P2'
    })
  }
})

// ============================================================
// Email & Exchange
// ============================================================
app.get('/api/threat-assessment', async (req, res) => {
  try {
    const threats = await graphClient
      .api('/security/threatAssessmentRequests')
      .get()

    res.json({
      success: true,
      count: threats.value.length,
      data: threats.value.slice(0, 50)
    })
  } catch (error) {
    console.error('Threat assessment error:', error.message)
    res.status(500).json({
      success: false,
      error: error.message,
      note: 'May require additional permissions'
    })
  }
})

// ============================================================
// Applications (Entra Apps)
// ============================================================
app.get('/api/applications', async (req, res) => {
  try {
    const apps = await graphClient
      .api('/applications')
      .select(['id', 'displayName', 'createdDateTime', 'requiredResourceAccess', 'identifierUris'])
      .top(50)
      .get()

    res.json({
      success: true,
      count: apps.value.length,
      data: apps.value
    })
  } catch (error) {
    console.error('Applications API error:', error.message)
    res.status(500).json({
      success: false,
      error: error.message
    })
  }
})

// Get service principals (enterprise apps)
app.get('/api/service-principals', async (req, res) => {
  try {
    const sps = await graphClient
      .api('/servicePrincipals')
      .select(['id', 'displayName', 'createdDateTime', 'appId'])
      .top(50)
      .get()

    res.json({
      success: true,
      count: sps.value.length,
      data: sps.value
    })
  } catch (error) {
    console.error('Service principals error:', error.message)
    res.status(500).json({
      success: false,
      error: error.message
    })
  }
})

// ============================================================
// User Profile (Current User)
// ============================================================
app.get('/api/me', async (req, res) => {
  try {
    const user = await graphClient
      .api('/me')
      .get()

    res.json({
      success: true,
      data: user
    })
  } catch (error) {
    console.error('Me API error:', error.message)
    res.status(500).json({
      success: false,
      error: error.message
    })
  }
})

// ============================================================
// Error Handling
// ============================================================
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err)
  res.status(500).json({
    success: false,
    error: err.message || 'Internal server error'
  })
})

// 404 Handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: 'Endpoint not found',
    path: req.path
  })
})

// ============================================================
// Start Server
// ============================================================
app.listen(PORT, () => {
  console.log(`✓ M365 AgentOps Backend running on port ${PORT}`)
  console.log(`✓ Environment: ${process.env.NODE_ENV || 'development'}`)
  console.log(`✓ CORS enabled for: ${process.env.FRONTEND_URL}`)
  console.log(`✓ Health check: http://localhost:${PORT}/api/health`)
})
```

---

## Step 3: Test Backend Locally (30 mins)

### 3.1 Install Dependencies

```bash
cd /Users/vasanthipromoters/Documents/M365_OpsAgent/m365-agentops/backend
npm install
```

### 3.2 Create .env File

Create `/backend/.env`:

```
AZURE_TENANT_ID=your-tenant-id
AZURE_CLIENT_ID=your-client-id
AZURE_CLIENT_SECRET=your-client-secret
FRONTEND_URL=https://proud-river-0f55f1e10.7.azurestaticapps.net
PORT=3000
NODE_ENV=development
```

### 3.3 Start Backend

```bash
npm start
```

You should see:
```
✓ M365 AgentOps Backend running on port 3000
✓ Environment: development
✓ CORS enabled for: https://proud-river-0f55f1e10.7.azurestaticapps.net
✓ Health check: http://localhost:3000/api/health
```

### 3.4 Test Health Check

```bash
curl http://localhost:3000/api/health
```

Should return:
```json
{"status":"ok","timestamp":"2026-06-04T...","service":"M365 AgentOps Backend"}
```

### 3.5 Test Graph API Call

```bash
curl http://localhost:3000/api/me
```

Should return your user profile (or error if permissions not set).

---

## Step 4: Deploy Backend to Azure (1 hour)

### 4.1 Create Azure App Service

1. **Azure Portal** → **App Services** → **Create**
2. **Basics:**
   - **Name:** `m365ops-api`
   - **Publish:** Code
   - **Runtime stack:** Node 20 LTS
   - **Operating System:** Linux
   - **Region:** East US (same as Static Web Apps)
3. **App Service Plan:**
   - **Pricing tier:** Free (for testing) or B1 ($12/mo for production)
4. Click **"Review + Create"** → **"Create"**

### 4.2 Deploy Code

#### Option A: GitHub Actions (Recommended)

1. Go to **App Service** → **Deployment Center**
2. **Source:** GitHub
3. Select your repo and main branch
4. It auto-creates a workflow

#### Option B: Local Deploy via Azure CLI

```bash
cd /Users/vasanthipromoters/Documents/M365_OpsAgent/m365-agentops/backend
az webapp up --name m365ops-api --resource-group m365-agentops-rg --runtime "node|20-lts"
```

### 4.3 Add Environment Variables to Azure

1. **Azure Portal** → **m365ops-api** → **Configuration**
2. **Application settings** → **New application setting**
3. Add:
   - `AZURE_TENANT_ID` = [your tenant ID from Phase 2]
   - `AZURE_CLIENT_ID` = [your client ID from Phase 2]
   - `AZURE_CLIENT_SECRET` = [your client secret from Phase 2]
   - `FRONTEND_URL` = `https://proud-river-0f55f1e10.7.azurestaticapps.net`
   - `PORT` = `3000`
   - `NODE_ENV` = `production`
4. Click **"Save"**

### 4.4 Verify Deployment

Once deployed (takes 5-10 mins):

```bash
curl https://m365ops-api.azurewebsites.net/api/health
```

Should return: `{"status":"ok",...}`

---

## Step 5: Update Frontend to Use Backend (1-2 hours)

### 5.1 Create API Client

Create `/src/lib/api-client.js`:

```javascript
const API_BASE = process.env.VITE_API_URL || 'https://m365ops-api.azurewebsites.net/api'

export async function callAPI(endpoint) {
  try {
    const response = await fetch(`${API_BASE}${endpoint}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include'
    })

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`)
    }

    return await response.json()
  } catch (error) {
    console.error(`API error on ${endpoint}:`, error.message)
    return {
      success: false,
      error: error.message,
      data: []
    }
  }
}

// Device Management
export async function getDevices() {
  return callAPI('/devices')
}

export async function getDeviceCompliancePolicies() {
  return callAPI('/device-compliance-policies')
}

// Security
export async function getSecurityScore() {
  return callAPI('/security/score')
}

// Identity
export async function getUsers() {
  return callAPI('/users')
}

export async function getRiskyUsers() {
  return callAPI('/identity/risky-users')
}

// Applications
export async function getApplications() {
  return callAPI('/applications')
}

export async function getServicePrincipals() {
  return callAPI('/service-principals')
}

// Email
export async function getThreatAssessment() {
  return callAPI('/threat-assessment')
}

// Current User
export async function getCurrentUser() {
  return callAPI('/me')
}
```

### 5.2 Update Intune Page to Use Real Data

Modify `/pages/intune.js` to call backend:

```javascript
import { getDevices, getDeviceCompliancePolicies } from '../lib/api-client.js'

export async function initIntune() {
  const el = document.getElementById('page-intune')
  if (!el) return

  el.innerHTML = '<div style="padding:20px"><div class="spinner"></div> Loading real device data...</div>'

  // Fetch real data from backend
  const devicesResult = await getDevices()
  const policiesResult = await getDeviceCompliancePolicies()

  const devices = devicesResult.data || []
  const policies = policiesResult.data || []

  render(el, { devices, policies })
}
```

### 5.3 Update vite.config.js

Ensure API URL is configured:

```javascript
define: {
  'process.env.VITE_API_URL': JSON.stringify(
    process.env.VITE_API_URL || 'https://m365ops-api.azurewebsites.net/api'
  )
}
```

---

## Step 6: Commit & Deploy (15 mins)

```bash
cd /Users/vasanthipromoters/Documents/M365_OpsAgent/m365-agentops

# Add backend to repo
git add backend/
git add lib/api-client.js
git add pages/intune.js

# Commit
git commit -m "feat: add Node.js backend API and real Graph API integration

- Create Express backend with Graph API endpoints
- Add API client library for frontend
- Deploy to Azure App Service
- Update Intune page to fetch real device data
- Support for devices, users, security, apps endpoints"

# Push
git push origin main
```

---

## Step 7: Test End-to-End (30 mins)

1. **Backend:** https://m365ops-api.azurewebsites.net/api/health
   - Should return OK

2. **Frontend:** https://proud-river-0f55f1e10.7.azurestaticapps.net
   - Login with Entra ID
   - Go to Intune page
   - Should show **real devices** from your tenant!

3. **Check console (F12):**
   - No errors
   - API calls to `/api/devices`, etc.

---

## Troubleshooting

| Issue | Solution |
|-------|----------|
| Backend won't start | Check `.env` file exists with all variables |
| 404 on API endpoint | Verify URL is `https://m365ops-api.azurewebsites.net/api/devices` |
| CORS error | Check `FRONTEND_URL` in Azure App Service settings |
| "No devices found" | Check user has Graph API permissions in Entra ID |
| Timeout on API calls | Graph API might be slow - increase timeout in frontend |

---

## Summary Checklist

- [ ] Created `/backend` directory
- [ ] Created backend `package.json` and `server.js`
- [ ] Tested backend locally on port 3000
- [ ] Created Azure App Service `m365ops-api`
- [ ] Added environment variables to Azure
- [ ] Backend deployed and `/api/health` returns OK
- [ ] Created `/lib/api-client.js` for frontend
- [ ] Updated Intune page to use real data
- [ ] Committed and pushed to GitHub
- [ ] Frontend shows real M365 data!
- [ ] ✅ Phase 3 Complete!

---

## Next: Phase 4 (Optional)

Once Phase 3 is working, you can:
- Add more Graph API endpoints
- Create database layer for caching
- Implement role-based access
- Add more pages with real data

**Total time:** 2-3 days  
**Cost:** +$40-60/month (backend)  
**Result:** Real M365 data from your tenant!
