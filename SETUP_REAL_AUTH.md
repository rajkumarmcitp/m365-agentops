# Real Azure AD Authentication Setup Guide

## Current Status
Your M365 Backup System has Azure AD credentials configured in `.env`:
- **Tenant ID**: b9cc8284-05ed-452f-877a-970779430dcb  
- **Client ID**: 04d3be8d-d433-4367-893e-eccc82190a11

However, backup collectors are showing demo data. This typically means the Azure AD app registration needs the correct permissions (scopes) to read M365 resources.

## What Permissions Are Needed?

The backup collectors require these Graph API permissions:

### Identity & Security (Entra ID)
- `Application.Read.All` - Read Azure AD applications
- `Directory.Read.All` - Read directory objects (users, groups, roles)
- `Policy.Read.All` - Read conditional access and other policies
- `RoleManagement.Read.Directory` - Read directory role assignments

### Exchange Online
- `Exchange.ManageAsApp` - Manage Exchange settings

### Teams
- `Team.ReadBasic.All` - Read Teams information
- `TeamMember.Read.All` - Read team membership

### SharePoint
- `Sites.Read.All` - Read SharePoint sites
- `Files.Read.All` - Read files in SharePoint

### OneDrive
- `Files.Read.All` - Read OneDrive content

### Groups
- `Group.Read.All` - Read Microsoft 365 Groups

### Intune
- `DeviceManagementConfiguration.Read.All` - Read Intune device config
- `DeviceManagementManagedDevices.Read.All` - Read managed devices

### Compliance
- `Compliance.Read.All` - Read compliance and DLP policies

## Option 1: Using PowerShell Script (Recommended)

This script will automatically configure all required permissions:

```powershell
# Run this in PowerShell as a user with Azure AD admin access

# Install required modules if not already installed
Install-Module Microsoft.Graph.Authentication -Force
Install-Module Microsoft.Graph.Applications -Force

# Connect to Microsoft Graph
Connect-MgGraph -Scopes "Application.ReadWrite.All", "AppRoleAssignment.ReadWrite.All"

# Your app's client ID (from .env)
$appClientId = "04d3be8d-d433-4367-893e-eccc82190a11"

# Get the application
$app = Get-MgApplication -Filter "appId eq '$appClientId'"

if (-not $app) {
    Write-Error "Application not found with client ID: $appClientId"
    exit
}

Write-Host "Found application: $($app.displayName)"

# Required permissions (API Microsoft Graph)
$requiredPermissions = @(
    "Application.Read.All",
    "Directory.Read.All",
    "Policy.Read.All",
    "RoleManagement.Read.Directory",
    "Exchange.ManageAsApp",
    "Team.ReadBasic.All",
    "TeamMember.Read.All",
    "Sites.Read.All",
    "Files.Read.All",
    "Group.Read.All",
    "DeviceManagementConfiguration.Read.All",
    "DeviceManagementManagedDevices.Read.All",
    "Compliance.Read.All",
    "AuditLog.Read.All",
    "SecurityEvents.Read.All"
)

# Get Microsoft Graph service principal
$graphSp = Get-MgServicePrincipal -Filter "displayName eq 'Microsoft Graph'"

Write-Host "Configuring permissions..."

# Remove existing API permissions to start fresh
$existingPermissions = $app.RequiredResourceAccess | 
    Where-Object { $_.ResourceAppId -eq $graphSp.AppId }

if ($existingPermissions) {
    Write-Host "Removing existing Microsoft Graph permissions..."
    $app.RequiredResourceAccess = $app.RequiredResourceAccess | 
        Where-Object { $_.ResourceAppId -ne $graphSp.AppId }
    Update-MgApplication -ApplicationId $app.Id -RequiredResourceAccess $app.RequiredResourceAccess
}

# Get all app roles and OAuth2 permissions for Microsoft Graph
$allPermissions = $graphSp | Get-MgServicePrincipalAppRoleAssignment
$oAuth2Permissions = $graphSp.Oauth2PermissionScopes

# Build required resource access
$resourceAccess = @()

foreach ($permission in $requiredPermissions) {
    # Try to find as app role first
    $role = $graphSp.AppRoles | Where-Object { $_.Value -eq $permission }
    
    if ($role) {
        $resourceAccess += @{
            id   = $role.Id
            type = "Role"
        }
        Write-Host "  ✓ Added app permission: $permission"
    } else {
        # Try OAuth2 permission
        $scope = $oAuth2Permissions | Where-Object { $_.Value -eq $permission }
        if ($scope) {
            $resourceAccess += @{
                id   = $scope.Id
                type = "Scope"
            }
            Write-Host "  ✓ Added delegated permission: $permission"
        } else {
            Write-Host "  ⚠ Permission not found: $permission"
        }
    }
}

# Update the application with required permissions
$requiredResourceAccess = @{
    resourceAppId  = $graphSp.AppId
    resourceAccess = $resourceAccess
}

Update-MgApplication -ApplicationId $app.Id -RequiredResourceAccess $requiredResourceAccess
Write-Host "✓ Permissions configured for app: $($app.displayName)"

# Grant admin consent (this requires admin consent)
Write-Host "`nNext steps:"
Write-Host "1. Go to Azure Portal: https://portal.azure.com"
Write-Host "2. Navigate to: Azure Active Directory > App registrations > $($app.displayName)"
Write-Host "3. Click: API permissions"
Write-Host "4. Click: Grant admin consent for [Tenant]"
Write-Host "5. Confirm by clicking: Yes"
Write-Host "`nOnce admin consent is granted, your app will have access to M365 data."
```

## Option 2: Manual Azure Portal Setup

If you prefer manual configuration:

1. **Go to Azure Portal**: https://portal.azure.com
2. **Navigate to**:
   - Azure Active Directory
   - App registrations
   - Select your app (M365 AgentOps)

3. **Configure Permissions**:
   - Click "API permissions" in the left sidebar
   - Click "+ Add a permission"
   - Select "Microsoft Graph"
   - Select "Application permissions"
   - Search and add each permission:
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
     - DeviceManagementManagedDevices.Read.All
     - Compliance.Read.All
     - AuditLog.Read.All
     - SecurityEvents.Read.All

4. **Grant Admin Consent**:
   - After adding permissions, click "Grant admin consent for [YourTenant]"
   - Confirm the consent

## Verify Real Auth is Working

After configuring permissions, verify the setup:

1. **Restart the backend**:
   ```bash
   # Stop current backend process
   Ctrl+C
   
   # Restart backend
   npm run dev
   ```

2. **Check console logs** for messages like:
   ```
   ✓ Azure credentials configured - using real Graph API
   ✓ Unified Graph Client initialized
   📦 Registering backup collectors...
   ✅ Exchange Online Collector registered
   ✅ Teams Collector registered
   ... etc
   ```

3. **Test backup collection**:
   - Open M365 AgentOps admin interface
   - Go to Backup & Restore
   - Click "Initiate Full Backup"
   - Monitor the console for collector output

4. **Verify real data** in File Explorer:
   - You should see much more resources than demo data
   - Entra ID should show 100+ configurations
   - Exchange, Teams, SharePoint should show real configurations from your tenant

## Troubleshooting

### Issue: Still Showing Demo Data
**Solution**: 
1. Verify admin consent was granted (Azure Portal > API permissions > should show "Granted for [tenant]")
2. Wait 5-10 minutes for permissions to propagate
3. Restart the backend service
4. Check console logs for any permission errors

### Issue: "Permission Denied" Errors in Logs
**Solution**:
1. Ensure the app has the required permissions in Azure AD
2. Check that admin consent has been granted
3. Verify tenant ID in .env matches your Azure AD tenant

### Issue: GraphClient Shows as Not Initialized
**Solution**:
1. Verify .env has AZURE_* or GRAPH_* credentials (not placeholder values)
2. Check that the credentials haven't expired
3. If using Client Secret, verify it hasn't been revoked in Azure Portal

## What Happens Next?

Once real auth is configured:

1. **Backup collectors** will pull real data from your M365 tenant
2. **File Explorer** will show actual configurations from:
   - Entra ID (100+ configurations)
   - Exchange Online (mail policies, rules, etc.)
   - Teams (team settings, policies)
   - SharePoint (site policies, sharing settings)
   - OneDrive (settings, policies)
   - Groups (Microsoft 365 Groups)
   - Intune (device configurations)
   - Compliance (DLP policies, retention)

3. **Granular Backup Configuration** page allows you to:
   - Enable/disable which components to backup
   - Choose which configurations are critical
   - Restore specific configurations instead of full service restore

## Security Notes

- **Client Secret**: The client secret in .env is sensitive. Keep it secure and never commit to version control.
- **Permissions**: The app is configured with read-only permissions for backup purposes
- **Audit**: All Graph API calls are logged and can be audited
- **Compliance**: Backups of M365 configurations help meet compliance requirements

## Support

If you encounter issues:

1. Check the backend console logs for specific error messages
2. Verify the Azure AD app has the required permissions
3. Ensure admin consent has been granted
4. Restart the backend service to clear any caches

For detailed debugging:
```bash
# Run with verbose logging
DEBUG=* npm run dev
```

This will show detailed debug information for all Graph API calls.
