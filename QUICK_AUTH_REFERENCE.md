# Quick Reference: Real Azure AD Auth Setup

## Status Check (Quick)
Check if real auth is working:
```bash
curl http://localhost:3000/api/debug/auth-status
```

Should show:
```json
{
  "graphClient": {
    "initialized": true,
    "hasValidCredentials": true
  },
  "backup": {
    "agentReady": true,
    "collectorCount": 11
  }
}
```

## PowerShell Diagnostic Check
```bash
# From the m365-agentops directory
pwsh ./check-auth-status.ps1
```

## Azure Portal Config (5 minutes)

1. Go to: https://portal.azure.com
2. Search for: "App registrations"
3. Find your app (M365 AgentOps)
4. Click: API permissions
5. Click: "+ Add a permission"
6. Select: Microsoft Graph
7. Select: Application permissions
8. Add permissions (search each):
   - Application.Read.All
   - Directory.Read.All
   - Policy.Read.All
   - RoleManagement.Read.Directory
   - Exchange.ManageAsApp
   - Team.ReadBasic.All
   - TeamMember.Read.All
   - Sites.Read.All
   - Files.Read.All
   - Group.Read.All
   - DeviceManagementConfiguration.Read.All
   - Compliance.Read.All
   - AuditLog.Read.All

9. After adding, click: "Grant admin consent for [YourTenant]"
10. Confirm: Yes

## Restart Backend
```bash
# Stop current process
Ctrl+C

# Restart
npm run dev
```

## Verify It Works

1. Look for in backend logs:
   ```
   ✓ Azure credentials configured - using real Graph API
   ✓ Unified Graph Client initialized
   ✅ Exchange Online Collector registered
   ```

2. Check debug endpoint:
   ```bash
   curl http://localhost:3000/api/debug/auth-status
   ```

3. Initiate a backup and look for real data

## If Still Showing Demo Data

1. **Check permissions granted**:
   - Azure Portal > App registrations > API permissions
   - Should show "Granted for [YourTenant]" in green
   
2. **Restart backend**:
   - Stop and restart `npm run dev`
   
3. **Wait 5-10 minutes**:
   - Permissions take time to propagate

4. **Check console logs** for errors:
   - Look for "403 Forbidden" or "Unauthorized" errors
   - These indicate permission issues

5. **Verify credentials** in `.env`:
   - Tenant ID, Client ID, Client Secret should not be empty
   - Should not contain "YOUR_" placeholders

## Support Resources

- **Full Setup Guide**: See `SETUP_REAL_AUTH.md`
- **Diagnostic Script**: Run `check-auth-status.ps1`
- **Backend Logs**: `npm run dev` shows real-time logs
- **Debug Endpoint**: `http://localhost:3000/api/debug/auth-status`

## What Should You See After Setup

When real auth is working:

| Service | Demo Data | Real Data |
|---------|-----------|-----------|
| Entra ID | 1 app | 100+ configurations |
| Exchange | 3 policies | 20+ policies |
| Teams | 2 teams | Real teams |
| SharePoint | 1 site | Real sites |
| OneDrive | 1 folder | Real drives |

Your backup system will collect REAL M365 configurations from your tenant!
