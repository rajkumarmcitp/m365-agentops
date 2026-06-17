# Phase 2: SharePoint Lists Setup

## Overview

This guide will help you create 3 SharePoint Lists in your root site for the Self Service Portal:
1. **SelfServiceRequests** — User requests
2. **SelfServiceApprovals** — Approval workflow tracking
3. **SelfServiceAudit** — Audit trail of all actions

## Prerequisites

You need:
- ✅ Azure AD app registration (with Graph API permissions)
- ✅ Tenant ID, Client ID, Client Secret
- ✅ Access to SharePoint root site
- ✅ `node-fetch` installed (or use `npm install node-fetch`)

---

## Step 1: Gather Required Information

### Get Tenant ID
1. Go to **Azure Portal** → **Azure Active Directory** → **Properties**
2. Copy **Tenant ID** (looks like: `12345678-1234-1234-1234-123456789012`)

### Get App Registration Details
1. Go to **Azure Portal** → **App registrations** → Find your app
2. Copy **Application (client) ID** (Client ID)
3. Go to **Certificates & secrets** → **Client secrets**
4. Copy the **Value** (Client Secret) — **⚠️ Only visible once!**

### Get Root Site ID
Option A (Easy — use "root" as placeholder):
```bash
# The script will resolve "root" automatically
```

Option B (Manual):
1. Go to your **SharePoint site**
2. Click the **gear icon** → **Site information**
3. Find the **Site ID** in the URL or site details

---

## Step 2: Run the Setup Script

### Option A: Command Line Arguments
```bash
node scripts/create-sharepoint-lists.mjs \
  "root" \
  "YOUR_TENANT_ID" \
  "YOUR_CLIENT_ID" \
  "YOUR_CLIENT_SECRET"
```

**Example:**
```bash
node scripts/create-sharepoint-lists.mjs \
  "root" \
  "12345678-1234-1234-1234-123456789012" \
  "aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee" \
  "xyz~abc.def.ABC123~XYZ"
```

### Option B: Environment Variables
```bash
# Set these in your terminal or .env file:
export SHAREPOINT_SITE_ID="root"
export GRAPH_TENANT_ID="12345678-1234-1234-1234-123456789012"
export GRAPH_CLIENT_ID="aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee"
export GRAPH_CLIENT_SECRET="xyz~abc.def.ABC123~XYZ"

# Then run:
node scripts/create-sharepoint-lists.mjs
```

### Option C: .env File
Create a `.env` file in the project root:
```env
SHAREPOINT_SITE_ID=root
GRAPH_TENANT_ID=12345678-1234-1234-1234-123456789012
GRAPH_CLIENT_ID=aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee
GRAPH_CLIENT_SECRET=xyz~abc.def.ABC123~XYZ
```

Then run:
```bash
node scripts/create-sharepoint-lists.mjs
```

---

## Step 3: Expected Output

If successful, you'll see:

```
🔐 SharePoint Lists Setup

Tenant: 12345678-1234-1234-1234-123456789012
Site ID: root
Client ID: aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee

🔑 Getting access token...
✅ Access token obtained

📍 Resolving root site...
✅ Root site ID: 12345678-1234-1234-1234-123456789012

📊 Creating SharePoint Lists...

📋 Creating list: SelfServiceRequests
   ✅ List created with ID: abc123def456
   Adding columns...
     • Service: ✅
     • Operation: ✅
     • Status: ✅
     • Priority: ✅
     ...
   ✅ 15/15 columns created

📋 Creating list: SelfServiceApprovals
   ✅ List created with ID: ghi789jkl012
   Adding columns...
     • RequestId: ✅
     ...
   ✅ 8/8 columns created

📋 Creating list: SelfServiceAudit
   ✅ List created with ID: mno345pqr678
   Adding columns...
     • RequestId: ✅
     ...
   ✅ 8/8 columns created

============================================================
✅ SharePoint Lists Setup Complete!
============================================================

Next Steps:
1. Verify lists in SharePoint
2. Set environment variables
3. Run the backend to test connections
```

---

## Step 4: Verify Lists Were Created

1. Go to your **SharePoint root site**
2. Click **Site contents** (or the grid icon)
3. You should see 3 new lists:
   - ✅ **SelfServiceRequests**
   - ✅ **SelfServiceApprovals**
   - ✅ **SelfServiceAudit**

---

## Step 5: Save Configuration

Once lists are created, add to your `.env` or save securely:

```env
# Self-Service Portal
SHAREPOINT_SITE_ID=<site-id-from-output>
GRAPH_TENANT_ID=<your-tenant-id>
GRAPH_CLIENT_ID=<your-client-id>
GRAPH_CLIENT_SECRET=<your-client-secret>

# Backend
SELF_SERVICE_ENABLED=true
```

---

## List Schemas Created

### SelfServiceRequests (15 columns)
```
Title (auto) + 
Service (dropdown)
Operation (text)
Status (dropdown: Submitted, Approved, Rejected, Completed, Cancelled)
Priority (dropdown: Low, Normal, High, Critical)
RequesterId (text - user email)
RequesterName (text)
FormData (multi-line text - JSON)
Description (multi-line text)
CreatedDate (date/time)
ApprovedDate (date/time)
ApprovedBy (text)
RejectedDate (date/time)
RejectionReason (multi-line text)
CompletedDate (date/time)
SLAHours (number)
```

### SelfServiceApprovals (8 columns)
```
Title (auto) +
RequestId (text)
ApproverEmail (text)
ApprovalLevel (dropdown: Manager, Admin, Executive)
Status (dropdown: Pending, Approved, Rejected)
Comment (multi-line text)
CreatedDate (date/time)
DecidedDate (date/time)
DecisionDetails (multi-line text)
```

### SelfServiceAudit (8 columns)
```
Title (auto) +
RequestId (text)
Action (dropdown: Submitted, Approved, Rejected, Completed, Commented, Delegated, Escalated)
Actor (text - name)
ActorEmail (text - email)
Details (multi-line text)
Timestamp (date/time)
IPAddress (text)
UserAgent (text)
```

---

## Troubleshooting

### ❌ "Failed to get access token"
- Check tenant ID is correct
- Check client ID is correct
- Check client secret is correct and hasn't expired
- Verify app has Graph API permissions (Sites.ReadWrite.All)

### ❌ "Failed to get root site"
- Verify you have permissions on the root site
- Try using explicit site ID instead of "root"

### ❌ "Failed to create column"
- Some columns might fail due to permissions
- This is OK — the lists are created with most columns
- You can add missing columns manually in SharePoint

### ❌ Can't find lists in SharePoint
- Refresh the page
- Try **Site contents** → **All items**
- Lists might take 1-2 minutes to appear

---

## What's Next

Once lists are created:

1. **Update backend** to use real lists (Phase 3)
2. **Test submissions** end-to-end
3. **Add email notifications** (Phase 4)
4. **Full user testing** (Phase 5)

---

## Need Help?

If you hit issues:
1. Check error message in console
2. Verify credentials are correct
3. Check app has proper Graph permissions
4. Try creating lists manually in SharePoint first

Questions? Run the script with `-h` or check the script comments.
