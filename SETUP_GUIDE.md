# M365 AgentOps - Setup & Deployment Guide

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                   Azure Static Web Apps                      │
│           (Frontend: React SPA - Production Ready)           │
│        https://proud-river-0f55f1e10.7.azurestaticapps.net  │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       │ API Calls
                       │ (http://localhost:3000/api/...)
                       ↓
┌─────────────────────────────────────────────────────────────┐
│              Local Node.js Backend (Development)             │
│                 http://localhost:3000                        │
│  ✅ Graph API Integration                                    │
│  ✅ Agent Scheduling & Execution                            │
│  ✅ Local AI Intelligence                                   │
│  ✅ SharePoint Integration                                  │
└─────────────────────────────────────────────────────────────┘
```

## Quick Start

### 1. **Backend Setup** (One-time)

```bash
# Navigate to backend directory
cd /Users/vasanthipromoters/Documents/M365_OpsAgent/m365-agentops/backend

# Install dependencies
npm install

# Start backend
npm start
```

Backend runs at: `http://localhost:3000`

### 2. **Frontend Access**

Open production frontend:
```
https://proud-river-0f55f1e10.7.azurestaticapps.net
```

Or local development:
```bash
cd /Users/vasanthipromoters/Documents/M365_OpsAgent/m365-agentops
npm run dev
# Then open http://localhost:5174
```

## AI Agents Features

### ✅ Six Autonomous Agents

1. **Security Agent** 🛡️
   - Monitors risky sign-ins via Graph API
   - Real-time risk detection
   - AI Chat: Ask about security risks

2. **Config Agent** ⚙️
   - Scans CIS Benchmark controls
   - Compliance scoring (0-100%)
   - AI Chat: Ask about control failures

3. **Approval Agent** ✓
   - Access request management
   - SLA tracking
   - AI Chat: Ask about pending approvals

4. **Execution Agent** ⚡
   - Automated Graph API actions
   - Success rate monitoring
   - AI Chat: Ask about execution status

5. **Audit Agent** 📊
   - Audit log analysis
   - Anomaly detection
   - AI Chat: Ask about anomalies

6. **Compliance Agent** 📋
   - Regulatory compliance tracking
   - DLP & retention policy monitoring
   - AI Chat: Ask about compliance gaps

### 🤖 Local AI Intelligence

All agents include built-in AI chat powered by local intelligence:
- No API key required
- Analyzes agent data locally
- Provides actionable insights
- Context-aware responses

**Suggested Questions:**
- "What are the top security risks?"
- "Which CIS controls are failing?"
- "How many approval requests pending?"
- "Are there any anomalies detected?"

## Monitoring

### Check Backend Health

```bash
curl http://localhost:3000/api/health
```

Response:
```json
{
  "status": "ok",
  "timestamp": "2026-07-05T...",
  "service": "M365 AgentOps Backend",
  "version": "1.0.0"
}
```

### View Agent Data

```bash
# All agents
curl http://localhost:3000/api/agents/all | jq .

# Specific agent
curl http://localhost:3000/api/agents/security | jq .

# Agent history
curl http://localhost:3000/api/agents/security/history | jq .
```

## Troubleshooting

### Frontend shows "Demo Mode"

**Reason:** Backend not running or API unreachable

**Fix:**
```bash
# Terminal 1: Start backend
cd m365-agentops/backend
npm start

# Terminal 2: Frontend will auto-detect backend and show real agents
```

### AI Chat returns error

**Reason:** Backend API unavailable

**Fix:** Ensure backend is running:
```bash
curl http://localhost:3000/api/agents/chat -X POST \
  -H "Content-Type: application/json" \
  -d '{"agentId":"security","userMessage":"Test","agentData":{}}'
```

### Agent data not updating

**Reason:** Scheduled jobs need initialization time

**Fix:** 
- First data collection happens on server start
- Subsequent runs on configured schedules:
  - Security: Hourly
  - Config: Daily 2 AM
  - Approval: Every 15 min
  - Execution: Every 30 min
  - Audit: Hourly
  - Compliance: Weekly Sunday 3 AM

## Configuration

### Environment Variables

Backend uses `.env` file:

```bash
# Azure AD
AZURE_TENANT_ID=b9cc8284-05ed-452f-877a-970779430dcb
AZURE_CLIENT_ID=04d3be8d-d433-4367-893e-eccc82190a11
AZURE_CLIENT_SECRET=<your-secret>

# Frontend URL
FRONTEND_URL=https://proud-river-0f55f1e10.7.azurestaticapps.net

# Port
PORT=3000

# Environment
NODE_ENV=production

# SharePoint
SHAREPOINT_SITE_ID=b60085d7-b9c8-41a3-8789-bab376d0c84f
```

### Customize Agent Schedules

In frontend, click **AI Agents → Configure**:
- Change schedule (hourly, daily, weekly, disabled)
- Toggle notifications (Dashboard, Email, Teams)
- Pause/resume individual agents

## Production Deployment Options

### Option A: Local Backend (Current - Recommended)
✅ **Status:** Working now  
✅ **Pros:** Zero deployment issues, real data, fully functional  
❌ **Cons:** Requires local machine running  
📍 **Use:** Development, testing, small teams

### Option B: Docker Container (Available)
📦 **Status:** Dockerfile ready  
⏳ **Setup:** ~30 minutes  
✅ **Pros:** Scalable, can run anywhere  
❌ **Cons:** Requires Docker knowledge  
📍 **Use:** Enterprise deployment, high availability

To use Docker:
```bash
# Build image
docker build -t m365ops-backend:latest .

# Run container
docker run -d \
  -p 3000:3000 \
  -e AZURE_TENANT_ID="..." \
  -e AZURE_CLIENT_ID="..." \
  -e AZURE_CLIENT_SECRET="..." \
  m365ops-backend:latest
```

## API Documentation

### Health Check
```bash
GET /api/health
```

### Get All Agents
```bash
GET /api/agents/all
```

### Get Specific Agent
```bash
GET /api/agents/{id}
# id: security, config, approval, execution, audit, compliance
```

### Chat with AI
```bash
POST /api/agents/chat
Content-Type: application/json

{
  "agentId": "security",
  "userMessage": "What are the top risks?",
  "agentData": { ... }
}
```

### Update Agent Configuration
```bash
PUT /api/agents/{id}/config

{
  "schedule": "0 * * * *",  // cron expression
  "notifications": {
    "dashboard": true,
    "email": false,
    "teams": true
  }
}
```

## Support & Resources

- **GitHub:** https://github.com/rajkumarmcitp/m365-agentops
- **Issues:** Create GitHub issues for bugs
- **Features:** Request features via GitHub discussions

## Next Steps

1. ✅ **Backend Running** - Start `npm start` in `/backend`
2. ✅ **Frontend Access** - Open production URL
3. ✅ **View Agents** - Navigate to AI Agents page
4. ✅ **Chat with AI** - Click any agent card
5. ✅ **Configure** - Customize schedules & notifications

Enjoy your AI-powered M365 operations! 🚀
