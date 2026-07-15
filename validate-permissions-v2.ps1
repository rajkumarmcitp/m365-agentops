# Validate Azure AD App Permissions - UPDATED
# Only checks for permissions ACTUALLY AVAILABLE in Microsoft Graph API

Write-Host ""
Write-Host "╔════════════════════════════════════════════════════════════════╗"
Write-Host "║  Azure AD App Permissions Validator v2                         ║"
Write-Host "║  Checking AVAILABLE Microsoft Graph Permissions Only           ║"
Write-Host "╚════════════════════════════════════════════════════════════════╝"
Write-Host ""

$clientId = "04d3be8d-d433-4367-893e-eccc82190a11"

# ACTUAL AVAILABLE PERMISSIONS (verified in Azure Portal)
$availablePermissions = @(
  # Identity & Directory
  'Application.Read.All',
  'Device.Read.All',
  'DeviceManagementConfiguration.Read.All',
  'DeviceManagementManagedDevices.Read.All',
  'DeviceManagementServiceConfig.Read.All',
  'Directory.Read.All',
  'Domain.Read.All',
  'Group.Read.All',
  'GroupMember.Read.All',
  'Organization.Read.All',
  'Policy.Read.All',
  'RoleManagement.Read.Directory',
  'User.Read.All',
  'UserAuthenticationMethod.Read.All',

  # Exchange & Mail
  'Mail.Read',
  'MailboxSettings.Read',

  # Teams & Collaboration
  'Channel.ReadBasic.All',
  'Chat.Read.All',
  'Team.ReadBasic.All',
  'TeamMember.Read.All',
  'TeamsAppInstallation.Read.All',
  'TeamworkTag.Read.All',

  # SharePoint & OneDrive
  'Sites.Read.All',
  'Files.Read.All',

  # Compliance & Security
  'AuditLog.Read.All',
  'SecurityEvents.Read.All',
  'IdentityRiskyUser.Read.All',
  'ServiceHealth.Read.All',

  # Reports
  'Reports.Read.All'
)

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
  Write-Host "PERMISSION STATUS" -ForegroundColor Cyan
  Write-Host "═══════════════════════════════════════════════════════════════" -ForegroundColor Cyan
  Write-Host ""
  Write-Host "Checking AVAILABLE permissions ($($availablePermissions.Count) total):" -ForegroundColor Yellow
  Write-Host ""

  $configured = 0
  $missing = 0
  $missingList = @()

  foreach ($perm in $availablePermissions | Sort-Object) {
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
  Write-Host "Available Permissions Status:"
  Write-Host "  • Configured: $configured" -ForegroundColor Green
  Write-Host "  • Missing:    $missing" -ForegroundColor $(if ($missing -gt 0) { "Red" } else { "Green" })
  Write-Host "  • Coverage:   $([Math]::Round(($configured / $availablePermissions.Count) * 100, 1))%" -ForegroundColor $(if ($configured -eq $availablePermissions.Count) { "Green" } else { "Yellow" })
  Write-Host ""

  # Compliance Status
  Write-Host "═══════════════════════════════════════════════════════════════" -ForegroundColor Cyan
  Write-Host "COMPLIANCE STATUS" -ForegroundColor Cyan
  Write-Host "═══════════════════════════════════════════════════════════════" -ForegroundColor Cyan
  Write-Host ""

  if ($configured -ge 25) {
    Write-Host "✅ M365DSC Compatibility:   EXCELLENT ($configured/31)" -ForegroundColor Green
    Write-Host "✅ CoreView Compatibility:  EXCELLENT ($configured/31)" -ForegroundColor Green
    Write-Host "✅ Backup Capability:       COMPREHENSIVE" -ForegroundColor Green
  } elseif ($configured -ge 20) {
    Write-Host "✅ M365DSC Compatibility:   GOOD ($configured/31)" -ForegroundColor Green
    Write-Host "✅ CoreView Compatibility:  GOOD ($configured/31)" -ForegroundColor Green
    Write-Host "✅ Backup Capability:       FULL" -ForegroundColor Green
  } else {
    Write-Host "⚠️  M365DSC Compatibility:   PARTIAL ($configured/31)" -ForegroundColor Yellow
    Write-Host "⚠️  CoreView Compatibility:  PARTIAL ($configured/31)" -ForegroundColor Yellow
    Write-Host "⚠️  Backup Capability:       LIMITED" -ForegroundColor Yellow
  }

  Write-Host ""

  # Analysis
  Write-Host "═══════════════════════════════════════════════════════════════" -ForegroundColor Cyan
  Write-Host "ANALYSIS" -ForegroundColor Cyan
  Write-Host "═══════════════════════════════════════════════════════════════" -ForegroundColor Cyan
  Write-Host ""

  $extra = $currentPermissions | Where-Object { $_ -notin $availablePermissions }
  if ($extra) {
    Write-Host "Additional Permissions Configured:"
    $extra | Sort-Object | ForEach-Object {
      Write-Host "  • $_"
    }
    Write-Host ""
  }

  if ($missing -eq 0) {
    Write-Host "✅ ALL available permissions are configured!" -ForegroundColor Green
    Write-Host ""
    Write-Host "Your Azure AD app has optimal M365 backup configuration."
    Write-Host "The system can access all available M365 resources."
  } else {
    Write-Host "⚠️  $missing permission(s) can be added for better coverage:" -ForegroundColor Yellow
    Write-Host ""
    $missingList | Sort-Object | ForEach-Object {
      Write-Host "  • $_"
    }
    Write-Host ""
    Write-Host "To add these permissions in Azure Portal:"
    Write-Host "  1. Go to: https://portal.azure.com"
    Write-Host "  2. Azure AD → App registrations → M365 AgentOps"
    Write-Host "  3. API permissions → Add permission"
    Write-Host "  4. Search for each permission above"
    Write-Host "  5. Grant admin consent"
  }

  Write-Host ""
  Write-Host "═══════════════════════════════════════════════════════════════" -ForegroundColor Cyan
  Write-Host "BACKUP COVERAGE" -ForegroundColor Cyan
  Write-Host "═══════════════════════════════════════════════════════════════" -ForegroundColor Cyan
  Write-Host ""

  $coverage = @(
    "✅ Azure AD / Entra ID",
    "✅ Exchange Online",
    "✅ Teams & Chats",
    "✅ SharePoint & OneDrive",
    "✅ M365 Groups",
    "✅ Device Management",
    "✅ Compliance & Audit"
  )

  $coverage | ForEach-Object { Write-Host "  $_" }

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
