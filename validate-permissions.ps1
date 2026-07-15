# Validate Azure AD App Permissions against M365DSC/CoreView Requirements
# Compares current permissions with industry-standard requirements

Write-Host ""
Write-Host "╔════════════════════════════════════════════════════════════════╗"
Write-Host "║  Azure AD App Permissions Validator                            ║"
Write-Host "║  Checking Against M365DSC & CoreView Requirements              ║"
Write-Host "╚════════════════════════════════════════════════════════════════╝"
Write-Host ""

$clientId = "04d3be8d-d433-4367-893e-eccc82190a11"

# M365DSC & CoreView Recommended Permissions
$requiredPermissions = @{
  # Microsoft Graph - Application Permissions (Read-Only)
  'Graph.Read' = @(
    # Identity & Directory
    'Application.Read.All',
    'AppRoleAssignment.Read.All',
    'Directory.Read.All',
    'DirectoryObject.Read.All',
    'Domain.Read.All',
    'Group.Read.All',
    'GroupMember.Read.All',
    'IdentityProvider.Read.All',
    'Organization.Read.All',
    'Policy.Read.All',
    'RoleManagement.Read.Directory',
    'User.Read.All',
    'UserAuthenticationMethod.Read.All',

    # Exchange & Mail
    'Exchange.ManageAsApp',
    'Mail.Read',
    'MailboxSettings.Read',

    # Teams & Collaboration
    'Team.ReadBasic.All',
    'TeamMember.Read.All',
    'TeamsApp.Read.All',
    'TeamsAppInstallation.Read.All',
    'Channel.ReadBasic.All',
    'Chat.Read.All',

    # SharePoint & OneDrive
    'Sites.Read.All',
    'Files.Read.All',
    'ListItem.Read.All',

    # Compliance & Security
    'AuditLog.Read.All',
    'Compliance.Read.All',
    'SecurityEvents.Read.All',
    'IdentityRiskyUser.Read.All',
    'IdentityUserRisk.Read.All',

    # Device & Intune
    'Device.Read.All',
    'DeviceManagementConfiguration.Read.All',
    'DeviceManagementManagedDevices.Read.All',
    'DeviceManagementServiceConfig.Read.All',

    # Reports
    'Reports.Read.All'
  )
}

try {
  Import-Module Microsoft.Graph.Authentication -Force -ErrorAction Stop
  Import-Module Microsoft.Graph.Applications -Force -ErrorAction Stop

  Write-Host "Connecting to Microsoft Graph..."
  Connect-MgGraph -Scopes "Application.Read.All" -NoWelcome -ErrorAction Stop

  # Get the application
  $app = Get-MgApplication -Filter "appId eq '$clientId'" -ErrorAction Stop

  if (-not $app) {
    Write-Host "❌ Application not found with client ID: $clientId" -ForegroundColor Red
    exit 1
  }

  Write-Host "✅ Found application: $($app.DisplayName)" -ForegroundColor Green
  Write-Host ""

  # Get Microsoft Graph service principal
  $graphSp = Get-MgServicePrincipal -Filter "displayName eq 'Microsoft Graph'" -ErrorAction Stop

  if (-not $graphSp) {
    Write-Host "❌ Microsoft Graph service principal not found" -ForegroundColor Red
    exit 1
  }

  # Get current permissions
  $currentPermissions = @()
  if ($app.RequiredResourceAccess) {
    $graphResources = $app.RequiredResourceAccess | Where-Object { $_.ResourceAppId -eq $graphSp.AppId }
    if ($graphResources) {
      foreach ($access in $graphResources.ResourceAccess) {
        $role = $graphSp.AppRoles | Where-Object { $_.Id -eq $access.id }
        if ($role) {
          $currentPermissions += $role.Value
        }
      }
    }
  }

  Write-Host "═══════════════════════════════════════════════════════════════" -ForegroundColor Cyan
  Write-Host "CURRENT PERMISSIONS" -ForegroundColor Cyan
  Write-Host "═══════════════════════════════════════════════════════════════" -ForegroundColor Cyan
  Write-Host ""
  Write-Host "Currently Configured ($($currentPermissions.Count) permissions):" -ForegroundColor Yellow
  $currentPermissions | Sort-Object | ForEach-Object {
    Write-Host "  ✓ $_"
  }
  Write-Host ""

  # Compare with required
  Write-Host "═══════════════════════════════════════════════════════════════" -ForegroundColor Cyan
  Write-Host "REQUIRED PERMISSIONS ANALYSIS" -ForegroundColor Cyan
  Write-Host "═══════════════════════════════════════════════════════════════" -ForegroundColor Cyan
  Write-Host ""
  Write-Host "M365DSC/CoreView Recommended Permissions ($($requiredPermissions['Graph.Read'].Count) total):" -ForegroundColor Yellow
  Write-Host ""

  $configured = 0
  $missing = 0
  $missingList = @()

  foreach ($perm in $requiredPermissions['Graph.Read'] | Sort-Object) {
    if ($currentPermissions -contains $perm) {
      Write-Host "  ✅ $perm" -ForegroundColor Green
      $configured++
    } else {
      Write-Host "  ❌ $perm" -ForegroundColor Red
      $missing++
      $missingList += $perm
    }
  }

  Write-Host ""
  Write-Host "═══════════════════════════════════════════════════════════════" -ForegroundColor Cyan
  Write-Host "SUMMARY" -ForegroundColor Cyan
  Write-Host "═══════════════════════════════════════════════════════════════" -ForegroundColor Cyan
  Write-Host ""
  Write-Host "Current Status:"
  Write-Host "  • Permissions Configured: $configured" -ForegroundColor Green
  Write-Host "  • Permissions Missing:     $missing" -ForegroundColor $(if ($missing -gt 0) { "Red" } else { "Green" })
  Write-Host "  • Coverage:                $([Math]::Round(($configured / $requiredPermissions['Graph.Read'].Count) * 100, 1))%" -ForegroundColor $(if ($configured -eq $requiredPermissions['Graph.Read'].Count) { "Green" } else { "Yellow" })
  Write-Host ""

  if ($missing -gt 0) {
    Write-Host "⚠️  MISSING PERMISSIONS:" -ForegroundColor Yellow
    Write-Host ""
    $missingList | Sort-Object | ForEach-Object {
      Write-Host "  • $_"
    }
    Write-Host ""
  }

  # Recommendations
  Write-Host "═══════════════════════════════════════════════════════════════" -ForegroundColor Cyan
  Write-Host "RECOMMENDATIONS" -ForegroundColor Cyan
  Write-Host "═══════════════════════════════════════════════════════════════" -ForegroundColor Cyan
  Write-Host ""

  if ($missing -eq 0) {
    Write-Host "✅ All recommended permissions are configured!" -ForegroundColor Green
    Write-Host ""
    Write-Host "Your Azure AD app has full M365DSC/CoreView compliance."
    Write-Host "The backup system can access all M365 resources."
  } else {
    Write-Host "⚠️  $missing permission(s) are missing" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Recommended Actions:"
    Write-Host "  1. Review missing permissions above"
    Write-Host "  2. Add missing permissions in Azure Portal or via PowerShell"
    Write-Host "  3. Grant admin consent for the new permissions"
    Write-Host "  4. Restart backend to use new permissions"
    Write-Host ""
    Write-Host "To add missing permissions via PowerShell, run:"
    Write-Host "  .\add-missing-permissions.ps1"
  }

  Write-Host ""
  Write-Host "═══════════════════════════════════════════════════════════════" -ForegroundColor Cyan
  Write-Host "COMPLIANCE STATUS" -ForegroundColor Cyan
  Write-Host "═══════════════════════════════════════════════════════════════" -ForegroundColor Cyan
  Write-Host ""

  Write-Host "M365DSC Compatibility:   " -NoNewline
  Write-Host $(if ($missing -eq 0) { "✅ COMPLIANT" } else { "⚠️  PARTIAL" }) -ForegroundColor $(if ($missing -eq 0) { "Green" } else { "Yellow" })

  Write-Host "CoreView Compatibility:  " -NoNewline
  Write-Host $(if ($missing -eq 0) { "✅ COMPLIANT" } else { "⚠️  PARTIAL" }) -ForegroundColor $(if ($missing -eq 0) { "Green" } else { "Yellow" })

  Write-Host "Backup Capability:       " -NoNewline
  Write-Host $(if ($missing -lt 10) { "✅ GOOD" } else { "⚠️  LIMITED" }) -ForegroundColor $(if ($missing -lt 10) { "Green" } else { "Yellow" })

  Write-Host ""

  Disconnect-MgGraph | Out-Null

} catch {
  Write-Host "❌ Error: $($_.Exception.Message)" -ForegroundColor Red
  Write-Host ""
  Write-Host "Ensure you have:"
  Write-Host "  • Microsoft.Graph modules installed"
  Write-Host "  • Azure AD admin rights"
  Write-Host "  • Network access to Microsoft Graph"
}

Write-Host ""
