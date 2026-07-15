# Fix Missing Azure AD App Permissions
# Adds all M365DSC/CoreView recommended permissions in one step

Write-Host ""
Write-Host "╔════════════════════════════════════════════════════════════════╗"
Write-Host "║  Auto-Fix Missing Permissions                                  ║"
Write-Host "║  Adding 17 Missing M365DSC/CoreView Permissions                ║"
Write-Host "╚════════════════════════════════════════════════════════════════╝"
Write-Host ""

$clientId = "04d3be8d-d433-4367-893e-eccc82190a11"
$missingPermissions = @(
  "AppRoleAssignment.Read.All",
  "Channel.ReadBasic.All",
  "Chat.Read.All",
  "Compliance.Read.All",
  "DirectoryObject.Read.All",
  "Exchange.ManageAsApp",
  "Group.Read.All",
  "IdentityProvider.Read.All",
  "IdentityUserRisk.Read.All",
  "ListItem.Read.All",
  "Mail.Read",
  "MailboxSettings.Read",
  "RoleManagement.Read.Directory",
  "Sites.Read.All",
  "TeamMember.Read.All",
  "TeamsApp.Read.All",
  "TeamsAppInstallation.Read.All"
)

try {
  Import-Module Microsoft.Graph.Authentication -Force -ErrorAction Stop
  Import-Module Microsoft.Graph.Applications -Force -ErrorAction Stop

  Write-Host "Connecting to Microsoft Graph with elevated permissions..."
  Connect-MgGraph -Scopes "Application.ReadWrite.All", "AppRoleAssignment.ReadWrite.All" -NoWelcome -ErrorAction Stop

  # Get the application
  $app = Get-MgApplication -Filter "appId eq '$clientId'" -ErrorAction Stop

  if (-not $app) {
    Write-Host "❌ Application not found" -ForegroundColor Red
    exit 1
  }

  Write-Host "✅ Found: $($app.DisplayName)" -ForegroundColor Green
  Write-Host ""

  # Get Microsoft Graph service principal
  $graphSp = Get-MgServicePrincipal -Filter "displayName eq 'Microsoft Graph'" -ErrorAction Stop

  # Get existing permissions
  $existingResourceAccess = @()
  if ($app.RequiredResourceAccess) {
    $graphResources = $app.RequiredResourceAccess | Where-Object { $_.ResourceAppId -eq $graphSp.AppId }
    if ($graphResources) {
      $existingResourceAccess = $graphResources.ResourceAccess
    }
  }

  Write-Host "Adding missing permissions..."
  Write-Host ""

  $added = 0
  $skipped = 0

  foreach ($permName in $missingPermissions | Sort-Object) {
    $role = $graphSp.AppRoles | Where-Object { $_.Value -eq $permName }

    if ($role) {
      # Check if already exists
      $exists = $existingResourceAccess | Where-Object { $_.id -eq $role.Id }

      if ($exists) {
        Write-Host "  ⊘ $permName (already exists)" -ForegroundColor Gray
        $skipped++
      } else {
        $existingResourceAccess += @{
          id   = $role.Id
          type = "Role"
        }
        Write-Host "  ✓ $permName" -ForegroundColor Green
        $added++
      }
    } else {
      Write-Host "  ✗ $permName (not found in Graph)" -ForegroundColor Yellow
    }
  }

  Write-Host ""

  # Update the app with all permissions (existing + new)
  if ($added -gt 0) {
    Write-Host "Updating application with new permissions..."

    $requiredResourceAccess = @{
      resourceAppId  = $graphSp.AppId
      resourceAccess = $existingResourceAccess
    }

    Update-MgApplication -ApplicationId $app.Id -RequiredResourceAccess $requiredResourceAccess -ErrorAction Stop

    Write-Host "✅ Successfully added $added new permission(s)" -ForegroundColor Green
  } else {
    Write-Host "All permissions already configured!" -ForegroundColor Green
  }

  Write-Host ""
  Write-Host "═══════════════════════════════════════════════════════════════" -ForegroundColor Cyan
  Write-Host "NEXT STEPS - GRANT ADMIN CONSENT" -ForegroundColor Cyan
  Write-Host "═══════════════════════════════════════════════════════════════" -ForegroundColor Cyan
  Write-Host ""
  Write-Host "Admin consent is REQUIRED for new permissions to be active:"
  Write-Host ""
  Write-Host "1. Go to Azure Portal:"
  Write-Host "   https://portal.azure.com"
  Write-Host ""
  Write-Host "2. Navigate to:"
  Write-Host "   Azure Active Directory > App registrations > M365 AgentOps"
  Write-Host ""
  Write-Host "3. Click 'API permissions' in the left sidebar"
  Write-Host ""
  Write-Host "4. Click 'Grant admin consent for [Your Organization]'"
  Write-Host ""
  Write-Host "5. Confirm by clicking 'Yes'"
  Write-Host ""
  Write-Host "Once admin consent is granted:"
  Write-Host "  → New permissions become active immediately"
  Write-Host "  → Backup system can access all M365 resources"
  Write-Host "  → Both M365DSC and CoreView compliant"
  Write-Host ""
  Write-Host "═══════════════════════════════════════════════════════════════" -ForegroundColor Cyan
  Write-Host ""

  Disconnect-MgGraph | Out-Null

  Write-Host "✅ Permission configuration complete!" -ForegroundColor Green
  Write-Host "   Added: $added  |  Skipped: $skipped  |  Total New: $(($added + $skipped))" -ForegroundColor Cyan
  Write-Host ""

} catch {
  Write-Host "❌ Error: $($_.Exception.Message)" -ForegroundColor Red
  Write-Host ""
  Write-Host "Troubleshooting:"
  Write-Host "  • Ensure you have Azure AD Global Admin or App Admin role"
  Write-Host "  • Install Microsoft.Graph modules: Install-Module Microsoft.Graph -Force"
  Write-Host "  • Try again with fresh PowerShell window"
}

Write-Host ""
