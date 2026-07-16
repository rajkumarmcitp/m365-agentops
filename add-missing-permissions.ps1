# Add missing permissions to Azure AD app
# Run this script as a user with Azure AD admin access

Write-Host ""
Write-Host "╔════════════════════════════════════════════════════╗"
Write-Host "║  Adding Missing Permissions to M365 AgentOps App   ║"
Write-Host "╚════════════════════════════════════════════════════╝"
Write-Host ""

$clientId = "04d3be8d-d433-4367-893e-eccc82190a11"
$missingPermissions = @("Exchange.ManageAsApp", "Compliance.Read.All")

Write-Host "Missing permissions to add:"
$missingPermissions | ForEach-Object { Write-Host "  • $_" }
Write-Host ""

try {
    Import-Module Microsoft.Graph.Authentication -Force
    Import-Module Microsoft.Graph.Applications -Force

    Write-Host "Connecting to Microsoft Graph..."
    Connect-MgGraph -Scopes "Application.ReadWrite.All", "AppRoleAssignment.ReadWrite.All" -NoWelcome

    # Get the application
    $app = Get-MgApplication -Filter "appId eq '$clientId'"
    if (-not $app) {
        Write-Host "❌ Application not found" -ForegroundColor Red
        exit 1
    }

    Write-Host "✓ Found app: $($app.DisplayName)" -ForegroundColor Green
    Write-Host ""

    # Get Microsoft Graph service principal
    $graphSp = Get-MgServicePrincipal -Filter "displayName eq 'Microsoft Graph'"

    # Get current permissions
    $currentResources = $app.RequiredResourceAccess | Where-Object { $_.ResourceAppId -eq $graphSp.AppId }
    $currentAccess = if ($currentResources) { $currentResources.ResourceAccess } else { @() }

    Write-Host "Adding missing permissions..."
    Write-Host ""

    foreach ($perm in $missingPermissions) {
        # Find the permission in Graph
        $role = $graphSp.AppRoles | Where-Object { $_.Value -eq $perm }

        if ($role) {
            # Check if already added
            $exists = $currentAccess | Where-Object { $_.id -eq $role.Id }

            if ($exists) {
                Write-Host "  ✓ $perm (already configured)" -ForegroundColor Green
            } else {
                # Add to current access
                $currentAccess += @{
                    id   = $role.Id
                    type = "Role"
                }
                Write-Host "  ✓ Added: $perm" -ForegroundColor Green
            }
        }
    }

    # Update the application
    if ($currentAccess) {
        $requiredResourceAccess = @{
            resourceAppId  = $graphSp.AppId
            resourceAccess = $currentAccess
        }

        Update-MgApplication -ApplicationId $app.Id -RequiredResourceAccess $requiredResourceAccess
        Write-Host ""
        Write-Host "✓ Permissions updated in Azure AD" -ForegroundColor Green
    }

    # Now grant admin consent
    Write-Host ""
    Write-Host "Granting admin consent..."

    # Get the service principal for the app
    $appSp = Get-MgServicePrincipal -Filter "appId eq '$clientId'"

    if ($appSp) {
        # Grant admin consent for each permission
        foreach ($role in $graphSp.AppRoles | Where-Object { $_.Value -in $missingPermissions }) {
            try {
                New-MgServicePrincipalAppRoleAssignment -ServicePrincipalId $appSp.Id `
                    -AppRoleId $role.Id `
                    -PrincipalId $appSp.Id `
                    -ResourceId $graphSp.Id -ErrorAction SilentlyContinue | Out-Null
                Write-Host "  ✓ Consent granted: $($role.Value)" -ForegroundColor Green
            } catch {
                # Already granted - that's fine
                Write-Host "  ✓ Consent already granted: $($role.Value)" -ForegroundColor Green
            }
        }
    }

    Write-Host ""
    Write-Host "╔════════════════════════════════════════════════════╗"
    Write-Host "║  All permissions have been configured!              ║"
    Write-Host "╚════════════════════════════════════════════════════╝"
    Write-Host ""
    Write-Host "Next steps:"
    Write-Host "1. Restart the backend: Ctrl+C then npm run dev"
    Write-Host "2. Initiate a new backup to collect real M365 data"
    Write-Host "3. You should now see real Exchange and Compliance data"
    Write-Host ""

    Disconnect-MgGraph | Out-Null

} catch {
    Write-Host "❌ Error: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host ""
    Write-Host "Manual alternative:"
    Write-Host "1. Go to: https://portal.azure.com"
    Write-Host "2. Azure AD > App registrations > M365 AgentOps"
    Write-Host "3. Click: API permissions"
    Write-Host "4. Add: Exchange.ManageAsApp"
    Write-Host "5. Add: Compliance.Read.All"
    Write-Host "6. Click: Grant admin consent"
}
