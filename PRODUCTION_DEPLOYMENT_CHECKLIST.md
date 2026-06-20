# TenantGuard Production Deployment Checklist

## 📋 Pre-Deployment (Before Deploy)

### Configuration Setup
- [ ] Get 3 SharePoint List IDs from PowerPoint
  ```powershell
  Connect-PnPOnline -Url "https://nasstech.sharepoint.com/sites/M365-AgentOps"
  Get-PnPList | Where-Object { $_.Title -match 'TenantGuard' }
  ```
- [ ] Update Admin Settings with List IDs
  - [ ] `SHAREPOINT_ALERTS_LIST_ID`
  - [ ] `SHAREPOINT_CORRELATIONS_LIST_ID`
  - [ ] `SHAREPOINT_INVESTIGATIONS_LIST_ID`

### Azure AD Verification
- [ ] Verify app `04d3be8d-d433-4367-893e-eccc82190a11` has all 7 permissions:
  - [ ] `AuditLog.Read.All`
  - [ ] `RiskyUser.Read.All`
  - [ ] `IdentityRiskEvent.Read.All`
  - [ ] `SecurityAlert.Read.All`
  - [ ] `Application.Read.All`
  - [ ] `ServicePrincipal.Read.All`
  - [ ] `Sites.Read.All`

### Environment Variables
- [ ] `.env.production` contains:
  ```
  AZURE_TENANT_ID=b9cc8284-05ed-452f-877a-970779430dcb
  AZURE_CLIENT_ID=04d3be8d-d433-4367-893e-eccc82190a11
  AZURE_CLIENT_SECRET=<from-key-vault>
  SHAREPOINT_ALERTS_LIST_ID=<obtained-above>
  SHAREPOINT_CORRELATIONS_LIST_ID=<obtained-above>
  SHAREPOINT_INVESTIGATIONS_LIST_ID=<obtained-above>
  GRAPH_AUDIT_LOG_DAYS=7
  ```

### Code Review
- [ ] All 5 core modules included in build
- [ ] API endpoints available in production server
- [ ] No hardcoded credentials in code
- [ ] Error handling in place for Graph API failures

---

## 🚀 Deployment Steps

### Step 1: Deploy Backend
```bash
# Build and deploy to App Service
npm run build
npm install --production
az webapp up --name m365-agentops-api
```

### Step 2: Configure App Service Settings
Add to Application Settings in Azure Portal:
```
SHAREPOINT_ALERTS_LIST_ID = [list-id-1]
SHAREPOINT_CORRELATIONS_LIST_ID = [list-id-2]
SHAREPOINT_INVESTIGATIONS_LIST_ID = [list-id-3]
GRAPH_AUDIT_LOG_DAYS = 7
CORRELATION_TIME_WINDOW = 3600
ALERT_RETENTION_DAYS = 90
```

### Step 3: Deploy Frontend
- [ ] Update frontend API endpoints (if needed)
- [ ] Build and deploy frontend
- [ ] Verify API connectivity

### Step 4: Test API Endpoints
```bash
# Test sync endpoint
curl -X POST https://<app-service>.azurewebsites.net/api/tenantguard/sync

# Check status
curl https://<app-service>.azurewebsites.net/api/tenantguard/sync/status
```

### Step 5: Enable Auto-Sync
Add to backend initialization:
```javascript
import { initGraphClient } from './tenantguard/graph-api-client.js'
import { initSharePointWriter } from './tenantguard/sharepoint-writer.js'
import { scheduleAutoSync } from './tenantguard/sync-engine.js'

// Initialize clients on startup
await initGraphClient()
await initSharePointWriter()

// Schedule sync every 30 minutes
scheduleAutoSync(30)
```

---

## ✅ Post-Deployment Validation

### Immediate Tests (First Hour)
- [ ] Backend started without errors
- [ ] `/api/tenantguard/sync/status` returns `{"syncing": false}`
- [ ] First sync executed: `POST /api/tenantguard/sync`
- [ ] Response contains detected alerts (15-100+)
- [ ] SharePoint Lists contain data:
  - [ ] TenantGuard-Alerts (23+ items)
  - [ ] TenantGuard-Correlations (4+ items)
- [ ] No errors in Application Insights

### Data Validation (First Day)
- [ ] Alert priorities correct (P1/P2/P3)
- [ ] Risk scores in range (0-100)
- [ ] Timestamps accurate
- [ ] Actor/Target fields populated
- [ ] No duplicate alerts on second sync
- [ ] Correlations correctly identified

### Performance Validation
- [ ] Full sync completes in < 30 seconds
- [ ] Incremental sync completes in < 5 seconds
- [ ] No throttling errors (429 status)
- [ ] Graph API quota usage reasonable

---

## 📊 Monitoring Setup

### Application Insights Queries

**Sync Execution Times:**
```kusto
traces
| where message contains "Sync"
| project timestamp, message, customDimensions
| order by timestamp desc
```

**Error Tracking:**
```kusto
traces
| where severityLevel >= 2
| where message contains "TenantGuard" or message contains "Graph"
| order by timestamp desc
```

**API Response Times:**
```kusto
requests
| where name contains "tenantguard/sync"
| summarize avg(duration), max(duration), count()
```

### Azure Monitor Alerts

**Alert 1: Sync Failure Rate**
- **Condition:** Error rate > 5% in 5 minutes
- **Action:** Notify ops team

**Alert 2: Graph API Throttling**
- **Condition:** 429 responses detected
- **Action:** Check quota, increase sync interval

**Alert 3: Slow Response Time**
- **Condition:** Response time > 30 seconds for 2+ consecutive syncs
- **Action:** Investigate Graph API performance

**Alert 4: SharePoint Write Failures**
- **Condition:** Write errors > 0 in sync response
- **Action:** Check List IDs, SharePoint connectivity

---

## 🔍 Troubleshooting Guide

### Issue: "Graph API connection failed"
**Symptoms:** Sync fails immediately
**Debug Steps:**
1. Check Client Secret is correct: `az keyvault secret show --name M365AgentOps-ClientSecret`
2. Verify app permissions in Azure AD
3. Test connection: `curl -X GET https://graph.microsoft.com/v1.0/me`
4. Check Application Insights for error details

### Issue: "Failed to write to SharePoint"
**Symptoms:** Alerts detected but not appearing in Lists
**Debug Steps:**
1. Verify List IDs in App Settings
2. Check app has `Sites.Read.All` permission
3. Test SharePoint access: `https://nasstech.sharepoint.com/sites/M365-AgentOps`
4. Check list column names match expected schema

### Issue: "No alerts detected"
**Symptoms:** Sync completes but stats show 0 alerts
**Debug Steps:**
1. Check tenant has recent audit log activity
2. Verify GRAPH_AUDIT_LOG_DAYS setting (should be 7)
3. Check alert detector logic for this event type
4. Review audit logs in Azure AD directly

### Issue: "Rate limiting / 429 errors"
**Symptoms:** Sync fails with HTTP 429
**Debug Steps:**
1. Reduce GRAPH_AUDIT_LOG_DAYS to 3-5
2. Increase sync interval from 30 to 60 minutes
3. Check Graph API quota: https://portal.azure.com (resource usage)
4. Consider using batch endpoint for large queries

---

## 📈 Performance Baseline

Track these metrics weekly:

| Metric | Target | Alert If |
|--------|--------|----------|
| Avg Sync Time | 10-20s | > 30s |
| Alert Detection Rate | 15-100/run | < 5 |
| Graph API Calls | ~30/sync | > 50 |
| SharePoint Write Success | 100% | < 99% |
| Error Rate | < 1% | > 5% |
| Throttle Errors | 0 | > 0 |

---

## 🔐 Security Checklist

- [ ] No credentials hardcoded in code
- [ ] Client Secret stored in Azure Key Vault
- [ ] App Service Managed Identity configured (if using)
- [ ] HTTPS enforced for all API calls
- [ ] CORS configured (frontend domain only)
- [ ] Audit logging enabled
- [ ] SharePoint lists have access controls
- [ ] Sensitive data (audit logs) not cached locally

---

## 📞 Rollback Plan

If production issues occur:

**Option 1: Disable Auto-Sync**
- Comment out `scheduleAutoSync()` in backend
- Deploy immediately
- Investigate issue without ongoing syncs

**Option 2: Revert to Demo Data**
- Update frontend to use demo data temporarily
- Keep real data in SharePoint for investigation
- Fix issue before re-enabling sync

**Option 3: Roll Back Deployment**
```bash
az webapp deployment slot swap --name m365-agentops-api --slot staging
```

---

## ✨ Success Criteria

✅ **Sync executes successfully** (no errors in first run)
✅ **Data appears in SharePoint** (15+ alerts, 3+ correlations)
✅ **Auto-sync runs on schedule** (every 30 minutes)
✅ **No duplicate alerts** (check second sync)
✅ **Performance acceptable** (< 30 seconds per sync)
✅ **Monitoring configured** (alerts working)
✅ **Team trained** (ops team knows how to troubleshoot)

---

## 📋 Daily Operations

### Daily Checks (First Week)
- [ ] Check Application Insights for errors
- [ ] Verify sync completed in past 30 minutes
- [ ] Monitor SharePoint list growth (should increase)
- [ ] Check Graph API quota usage

### Weekly Checks (Ongoing)
- [ ] Review alert detection accuracy
- [ ] Check performance metrics
- [ ] Verify correlations are meaningful
- [ ] Update runbook with any new issues

### Monthly Reviews
- [ ] Analyze alert patterns and trends
- [ ] Optimize sync frequency based on usage
- [ ] Review and tune thresholds
- [ ] Plan for scale or optimization

---

## 📚 Documentation

Keep updated:
- [ ] Deployment runbook
- [ ] Troubleshooting guide
- [ ] Architecture diagram
- [ ] Alert handling procedures
- [ ] Escalation contacts

---

## 🎯 Go-Live Checklist

Before marking production ready:

- [ ] All configuration tested end-to-end
- [ ] First full sync completed successfully
- [ ] Data verified in SharePoint Lists
- [ ] Team trained on operations
- [ ] Monitoring/alerts configured
- [ ] Runbook documented
- [ ] Rollback plan tested
- [ ] Stakeholders notified
- [ ] Handoff to ops team complete

**Status:** Ready to deploy ✅

---

**Created:** 2026-06-20
**Updated By:** Claude Code
**Version:** 1.0
