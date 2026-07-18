# TenantGuard Alert Details - View Full Information

## ✨ New Feature: Click to View Full Alert Details

You can now click on any audit log alert to view complete information in a detailed modal.

## 🎯 How to Use

1. **View your TenantGuard dashboard** at http://localhost:5173/#/tenantguard
2. **Click on any alert** in the "TOP RECENT ALERTS" section or "Alerts" tab
3. **A modal opens** showing:
   - Full alert headline
   - Priority level (P0-P3)
   - Severity (CRITICAL, HIGH, MEDIUM)
   - Risk score (0-100)
   - Alert status
   - Complete description
   - **Source system** (where the alert came from)
   - **Actor/User** (who triggered the action)
   - Full timestamp
   - Alert ID

4. **Close the modal** by:
   - Clicking the X button in top right
   - Clicking outside the modal
   - Pressing Escape (if implemented)

## 📊 What You'll See in the Modal

### Alert Information
```
┌─────────────────────────────────────┐
│ Audit Log: Get authentication flows │ ×
├─────────────────────────────────────┤
│ PRIORITY     SEVERITY      SCORE STATUS
│ P3           MEDIUM        42/100 open
├─────────────────────────────────────┤
│ DESCRIPTION
│ Successful: Get authentication flows
├─────────────────────────────────────┤
│ SOURCE          ACTOR
│ Graph API       john.smith@contoso.com
├─────────────────────────────────────┤
│ TIMESTAMP
│ 7/18/2026, 3:41:56 PM
├─────────────────────────────────────┤
│ ALERT ID
│ audit-0-1721324516302
└─────────────────────────────────────┘
```

## 🔧 Making User Info Show Correctly

User information (Actor field) comes from different sources:

### Graph API Audit Logs
**Expected data format:**
```javascript
initiatedBy: [
  {
    user: {
      userPrincipalName: "john.smith@contoso.com",  // Email
      displayName: "John Smith"                      // Name
    }
  }
]
```

### What to Look For in Modal

- ✅ **Email**: `john.smith@contoso.com`
- ✅ **Display Name**: `John Smith`
- ✅ **Service Account**: `Exchange Online`
- ✅ **System**: `System` or blank

### If Showing "System" Instead of User

This can happen when:
1. The audit log is system-generated (normal)
2. Graph API doesn't include `initiatedBy` field
3. The action was performed by a service account

**This is normal behavior for many M365 audit events.**

## 🚀 Complete Setup Steps

### 1. Restart Backend (to apply user extraction fix)
```bash
# If running in terminal, press Ctrl+C
# Then:
node backend/server.js

# OR if running in background:
ps aux | grep "node backend/server.js"
kill -9 <PID>
node backend/server.js
```

### 2. Refresh TenantGuard in Browser
- Go to http://localhost:5173/#/tenantguard
- Press Ctrl+F5 (hard refresh)
- Wait for data to load

### 3. Click on an Alert
- Click any audit log entry
- Modal will open with full details
- Check "ACTOR" field for user information

## 📈 Real-Time Updates

- Dashboard updates every **10 seconds**
- Alerts are **real from Graph API**
- User info **shows when available**
- New alerts appear automatically

## 🔍 Debugging

**If user info still shows as "System":**

1. Open browser console (F12)
2. Look for logs:
   ```
   📡 Fetching real-time data from backend...
   📊 Raw alert data (first item): { actor: "..." }
   📊 Normalized alert (first): { actor: "..." }
   ```

3. Check if `actor` field is populated in raw data

**If modal doesn't open:**

1. Check browser console for errors
2. Verify alert has an `id` field
3. Try refreshing page

## 🎯 Current Status

✅ **Alert details modal**: Working
✅ **Real-time data**: Every 10 seconds
✅ **Graph API integration**: Active
✅ **Actor extraction**: Fixed (needs backend restart)
✅ **User information**: Shows when available

## 📝 Example Audit Logs You'll See

**With User Info:**
```
Audit Log: Set authentication flow policy
Actor: security-admin@contoso.com
Source: Graph API - Audit Logs
Priority: P3
```

**System Generated (no user):**
```
Audit Log: Get authentication flows policy
Actor: System
Source: Graph API - Audit Logs
Priority: P3
```

**Both are valid and expected!**

## 🎉 Summary

The TenantGuard dashboard now has full alert detail viewing:

1. ✅ Click any alert to view complete information
2. ✅ See user/actor who performed the action
3. ✅ View full timestamp and description
4. ✅ Check risk score and priority
5. ✅ Get alert ID for reference

**Try it now:** Click on any audit log alert in TenantGuard! 🚀
