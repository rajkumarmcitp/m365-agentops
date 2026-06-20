# TenantGuard SharePoint 400 Error - Troubleshooting Guide

## 🔴 Error: 400 Bad Request (All Formats Failed)

This guide helps you diagnose why the SharePoint validation keeps failing.

---

## 🚀 Step 1: Run Diagnostic Health Check

### **Option A: Local Diagnostic** (if you have backend running locally)
```bash
cd backend
node test-graph-api.js
```

### **Option B: Production Diagnostic** (from anywhere)
```bash
curl "https://m365ops-api-gtbgezb9c7bgata7.centralus-01.azurewebsites.net/api/tenantguard/health"
```

---

## 📊 Interpreting Results

### Expected Output (✅ All Green)
```json
{
  "timestamp": "2026-06-20T...",
  "success": true,
  "checks": {
    "environment": {
      "AZURE_TENANT_ID": "✅ SET",
      "AZURE_CLIENT_ID": "✅ SET",
      "AZURE_CLIENT_SECRET": "✅ SET"
    },
    "graphClient": {
      "initialized": "✅ YES",
      "status": "Ready"
    },
    "graphAPI": {
      "status": "✅ Connected",
      "user": "...",
      "id": "..."
    },
    "sharepoint": {
      "status": "✅ Root site accessible",
      "name": "...",
      "id": "...",
      "url": "..."
    }
  }
}
```

### Issue: ❌ AZURE_CLIENT_SECRET Missing
**Cause:** Environment variable not set in App Service

**Fix:**
1. Go to Azure Portal → App Service → Configuration
2. Click "New application setting"
3. Name: `AZURE_CLIENT_SECRET`
4. Value: (Get from Key Vault or previous setup)
5. Save and restart app

### Issue: ❌ Graph API Failed to Connect
**Cause:** Authentication credentials are wrong

**Troubleshooting:**
1. Verify AZURE_CLIENT_ID is correct: `04d3be8d-d433-4367-893e-eccc82190a11`
2. Verify AZURE_TENANT_ID is correct: `b9cc8284-05ed-452f-877a-970779430dcb`
3. Check AZURE_CLIENT_SECRET hasn't expired
4. Check in Azure AD → App Registrations → Certificates & Secrets

### Issue: ❌ SharePoint Root Site Not Accessible
**Cause:** Missing API permissions

**Check Permissions in Azure AD:**
1. Azure Portal → App Registrations
2. Search for `04d3be8d-d433-4367-893e-eccc82190a11`
3. Click "API Permissions"
4. Verify these are present and have ✅ Granted:
   - `AuditLog.Read.All`
   - `Sites.Read.All`
   - `Application.Read.All`
   - `ServicePrincipal.Read.All`
   - `RiskyUser.Read.All`
   - `IdentityRiskEvent.Read.All`
   - `SecurityAlert.Read.All`

If missing:
1. Click "Add a permission"
2. Select "Microsoft Graph"
3. Select "Application permissions"
4. Search for and add the missing permissions
5. Click "Grant admin consent for [tenant]"

---

## 🔧 Common Issues & Solutions

### Problem: "Resource not found for the segment 'm365-agentops-prod'"
**Means:** The site doesn't exist with that name

**Solution:**
1. List available sites:
   ```bash
   curl "https://m365ops-api-gtbgezb9c7bgata7.centralus-01.azurewebsites.net/api/tenantguard/sharepoint-sites"
   ```
2. Look at the `graphApiFormat` in the response
3. Use EXACTLY that format in Admin Settings

### Problem: "Invalid hostname for this tenancy"
**Means:** The tenant ID doesn't match or URL is wrong

**Solution:**
1. Check AZURE_TENANT_ID is correct
2. Check the SharePoint URL is in the correct tenant
3. Verify app registration is in the right Azure AD tenant

### Problem: "CORS error" or "401 Unauthorized"
**Means:** Authentication failed

**Solution:**
1. Check all environment variables are set
2. Run health check to see what's failing
3. Verify AZURE_CLIENT_SECRET is correct
4. Check if credentials need refresh

---

## ✅ Checklist Before SharePoint Setup

- [ ] Run `/api/tenantguard/health` endpoint
- [ ] All environment variables show "✅ SET"
- [ ] Graph API shows "✅ Connected"
- [ ] SharePoint shows "✅ Root site accessible"
- [ ] All 7 API permissions granted in Azure AD
- [ ] AZURE_CLIENT_SECRET not expired
- [ ] App Service restarted after any config changes

---

## 📞 If Still Failing

1. **Save diagnostic output:**
   ```bash
   curl "https://m365ops-api-gtbgezb9c7bgata7.centralus-01.azurewebsites.net/api/tenantguard/health" > diagnostic.json
   ```

2. **Check backend logs:**
   - Azure Portal → App Service → Log stream
   - Look for error messages
   - Share relevant errors

3. **Verify basic connectivity:**
   ```bash
   # Test if backend is running
   curl "https://m365ops-api-gtbgezb9c7bgata7.centralus-01.azurewebsites.net/api/health"
   ```

4. **Check Application Insights:**
   - Azure Portal → Application Insights
   - Look for recent errors
   - Filter by "/api/tenantguard"

---

## 🎯 Success Indicators

When everything works, you'll see:

1. **Health Check Response:**
   ```
   "success": true
   "graphAPI": "✅ Connected"
   "sharepoint": "✅ Root site accessible"
   ```

2. **SharePoint Sites List:**
   ```bash
   curl .../api/tenantguard/sharepoint-sites
   # Returns list of available sites with correct format
   ```

3. **Validation Success:**
   - Admin Settings accepts the site URL
   - Shows: "Connected to SharePoint site: ..."
   - Can proceed to initialize lists

---

## 📋 Reference

**Key Endpoints:**
- `/api/health` - Basic health check
- `/api/tenantguard/health` - Detailed diagnostic
- `/api/tenantguard/sharepoint-sites` - List available sites
- `/api/tenantguard/validate-sharepoint` - Validate site URL

**Scripts:**
- `backend/test-graph-api.js` - Local testing
- `get-sharepoint-sites.ps1` - PowerShell site listing

**Configuration:**
- `.env` - Local development
- App Service → Configuration - Production settings

---

**Last Updated:** 2026-06-20
**For Issues:** Check /api/tenantguard/health first!
