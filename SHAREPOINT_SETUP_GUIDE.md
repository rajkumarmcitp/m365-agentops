# TenantGuard → SharePoint Integration Setup Guide

## 📋 Overview

This guide walks you through setting up a SharePoint site to store TenantGuard alerts, correlations, and investigations.

**Timeline**: 15-20 minutes  
**Skills Required**: Basic SharePoint navigation  
**Tenant**: Nasstech.Onmicrosoft.com

---

## ✅ Step 1: Create SharePoint Site

### Via SharePoint Admin Center (Recommended)

```
1. Go to: https://nasstech-admin.sharepoint.com/
2. Click "Sites" → "Active sites"
3. Click "+ Create site"
4. Choose "Team site"
5. Fill in:
   - Site name: M365-AgentOps
   - Site description: M365 AgentOps - TenantGuard Storage
   - Click "Finish"
6. Wait 2-3 minutes for creation
```

### Alternative: Via Microsoft 365 Admin

```
1. Go to: https://admin.microsoft.com/
2. Go to "Teams & groups" → "Teams sites"
3. Click "+ Create site"
4. Follow same steps as above
```

**Result**: You'll have a site URL like:
```
https://nasstech.sharepoint.com/sites/M365-AgentOps/
```

---

## ✅ Step 2: Create SharePoint Lists

Once the site is created, create three lists:

### List 1: TenantGuard-Alerts

```
1. Go to your SharePoint site
2. Click "+ New" → "List"
3. Click "Blank list"
4. Name: TenantGuard-Alerts
5. Click "Create"
6. Add these columns:
   
   Column Name          | Type      | Required | Notes
   -------------------- | --------- | -------- | -----
   AlertId              | Text      | Yes      | Unique alert ID
   Headline             | Text      | Yes      | Alert title
   Description          | Text      | No       | Full description
   Severity             | Choice    | No       | CRITICAL, HIGH, MEDIUM, INFO
   Score                | Number    | No       | 0-100
   Type                 | Choice    | No       | ADMIN, EXCHANGE, SECURITY, APPLICATION
   Actor                | Text      | No       | Who triggered the alert
   RiskAssessment       | Text      | No       | JSON - risk details
   Recommendations      | Text      | No       | JSON - recommended actions
   Dismissed            | Yes/No    | No       | Alert resolved?
   CreatedTime          | Date/Time | No       | When alert was created
```

**How to add columns**:
```
1. In the list, click "+Add column"
2. Fill Name and Type
3. Click "Create"
4. Repeat for each column
```

### List 2: TenantGuard-Correlations

```
1. Create another blank list
2. Name: TenantGuard-Correlations
3. Add columns:

   Column Name          | Type      | Notes
   -------------------- | --------- | -----
   CorrelationId        | Text      | Unique ID
   Title                | Text      | Correlation title
   Description          | Text      | Details
   AlertCount           | Number    | Related alert count
   Severity             | Choice    | CRITICAL, HIGH, MEDIUM, INFO
   ConfidenceScore      | Number    | 0-100
   PatternType          | Text      | Attack pattern type
   RelatedAlerts        | Text      | JSON array of alert IDs
```

### List 3: TenantGuard-Investigations

```
1. Create another blank list
2. Name: TenantGuard-Investigations
3. Add columns:

   Column Name          | Type      | Notes
   -------------------- | --------- | -----
   InvestigationId      | Text      | Unique ID
   Title                | Text      | Investigation title
   AlertId              | Text      | Related alert (if any)
   Status               | Choice    | Open, Investigating, Resolved
   Messages             | Text      | JSON chat history
   CreatedTime          | Date/Time | Creation time
```

---

## ✅ Step 3: Get Your Site ID

Once lists are created, you need the Site ID and List IDs.

### Get Site ID:

```
PowerShell (Run as Administrator):

$SiteName = "M365-AgentOps"
$SiteUrl = "https://nasstech.sharepoint.com/sites/$SiteName"

Connect-PnPOnline -Url $SiteUrl -UseWebLogin
$site = Get-PnPSite -Includes Id
Write-Host "Site ID: $($site.Id)"
```

Or manually:

```
1. Go to SharePoint site
2. Click "Site information" (gear icon → Site information)
3. Look for "Site ID" at the bottom
4. Copy it
```

### Get List IDs:

```
PowerShell:

$lists = Get-PnPList -Includes Id
foreach($list in $lists) {
    if ($list.Title -like "*TenantGuard*") {
        Write-Host "$($list.Title): $($list.Id)"
    }
}
```

Or manually:

```
1. Go to each list
2. Click "List settings"
3. Look for "List ID" in the URL or settings
4. Copy it
```

---

## ✅ Step 4: Update Backend Configuration

Update `.env` file in `/backend/.env`:

```bash
# SharePoint Configuration
SHAREPOINT_SITE_NAME=M365-AgentOps
SHAREPOINT_SITE_ID=your-site-id-here
SHAREPOINT_ALERTS_LIST_ID=your-alerts-list-id-here
SHAREPOINT_CORRELATIONS_LIST_ID=your-correlations-list-id-here
SHAREPOINT_INVESTIGATIONS_LIST_ID=your-investigations-list-id-here

# Keep existing settings
AZURE_TENANT_ID=b9cc8284-05ed-452f-877a-970779430dcb
AZURE_CLIENT_ID=04d3be8d-d433-4367-893e-eccc82190a11
AZURE_CLIENT_SECRET=Omp8Q~Me_X.K_SBWGQBn4m~fPQcxqL4CV5zsWcXF
```

**Example**:
```bash
SHAREPOINT_SITE_NAME=M365-AgentOps
SHAREPOINT_SITE_ID=d4571234-5678-90ab-cdef-1234567890ab
SHAREPOINT_ALERTS_LIST_ID=abcd1234-5678-90ef-ghij-0987654321kl
```

---

## ✅ Step 5: Verify Permissions

Ensure your Azure app has these permissions:

```
Required Permissions:
✅ Sites.ReadWrite.All (Read and write items in all site collections)
✅ Directory.Read.All (Read directory data)
```

Check in Azure Portal:

```
1. Go to Azure Portal
2. Azure AD → App registrations
3. Find your app (04d3be8d-d433-4367-893e-eccc82190a11)
4. API permissions
5. Verify "Sites.ReadWrite.All" is there
6. If missing: Click "Add permission" → Microsoft Graph → Sites.ReadWrite.All
```

---

## ✅ Step 6: Test Integration

Once everything is configured:

```bash
# Restart backend server
cd backend
npm run dev

# You should see:
# ✅ Connected to SharePoint site: M365 AgentOps
# ✅ TenantGuard ready
```

Then open TenantGuard page and verify alerts display.

---

## 🔍 Troubleshooting

### "SharePoint site 'M365-AgentOps' not found"

**Fix**:
- Verify site name matches exactly
- Wait 5 minutes after site creation
- Check site URL in SharePoint admin center
- Update `SHAREPOINT_SITE_NAME` in .env

### "List 'TenantGuard-Alerts' not found"

**Fix**:
- Verify list names match exactly
- Check all three lists exist in SharePoint
- Go to site → Lists → verify names
- Resync by restarting backend server

### "Access Denied" errors

**Fix**:
- Verify app has `Sites.ReadWrite.All` permission
- Check Azure app registration permissions
- Verify site admin has consented to app
- Grant site permissions to app: Site Settings → Access

### "Invalid credentials"

**Fix**:
- Verify `.env` credentials are correct
- Check `AZURE_CLIENT_SECRET` hasn't expired
- Regenerate secret in Azure if needed

---

## ✅ Next Steps

Once verified:

1. ✅ SharePoint site created
2. ✅ Lists created with columns
3. ✅ Site ID and List IDs configured in `.env`
4. ✅ Backend connected and tested
5. ✅ TenantGuard page showing SharePoint data

### Proceed to:

```
→ Backend testing
→ Migrate demo alerts to SharePoint
→ Test end-to-end in TenantGuard page
→ Set up automated data sync
```

---

## 📞 Support

If you encounter issues:

1. Check backend logs: `tail -100 /tmp/backend-server.log`
2. Verify SharePoint site is accessible
3. Confirm all lists have required columns
4. Check Azure app permissions
5. Restart backend server after changes

---

## 📊 Reference

### SharePoint Site Structure

```
https://nasstech.sharepoint.com/sites/M365-AgentOps/
├── Lists
│   ├── TenantGuard-Alerts (stores security alerts)
│   ├── TenantGuard-Correlations (alert correlations)
│   └── TenantGuard-Investigations (AI investigations)
```

### File Changes

```
Backend:
✅ lib/sharepoint-client.js (NEW - SharePoint API wrapper)
✅ .env (UPDATE - SharePoint configuration)
⏳ server.js (TO UPDATE - use SharePoint instead of in-memory)
```

### Rollback

If you need to revert to in-memory database:

```bash
# Restore original server.js
git checkout server.js

# Remove .env SharePoint settings
# Restart backend
npm run dev
```

---

**Status**: Ready for SharePoint integration! 🚀
