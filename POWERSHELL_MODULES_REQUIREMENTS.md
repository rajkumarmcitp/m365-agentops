# PowerShell Modules Requirements

Complete list of required PowerShell modules for full M365 security validation using CIS Benchmark v7.0.0.

## Quick Requirements Check

```bash
# Check if all required modules are installed
pwsh -Command "Get-Module Microsoft.Graph, ExchangeOnlineManagement, PnP.PowerShell -ListAvailable | Select-Object Name, Version"
```

---

## Module 1: Microsoft.Graph (v2.38.0+)

**Download Size:** ~200 MB  
**Installation Time:** 3-5 minutes  
**Required:** YES (for 90+ controls)

### Install Command

```bash
pwsh -Command "Install-Module Microsoft.Graph -Repository PSGallery -Scope CurrentUser -Force"
```

### Verify Installation

```bash
pwsh -Command "Get-Module Microsoft.Graph -ListAvailable | Select-Object Name, Version"
```

### Key Submodules Used

```
Microsoft.Graph.Authentication        # Auth/connection
Microsoft.Graph.DirectoryObjects      # Users/Groups/Roles
Microsoft.Graph.Identity.DirectoryManagement  # Identity policies
Microsoft.Graph.Identity.SignIns      # Sign-in settings
Microsoft.Graph.Identity.Governance   # Access reviews
Microsoft.Graph.Compliance            # DLP/audit
Microsoft.Graph.Security              # Defender
Microsoft.Graph.Mail                  # Email settings
Microsoft.Graph.Teams                 # Teams configuration
Microsoft.Graph.Users                 # User properties
Microsoft.Graph.Groups                # Group management
Microsoft.Graph.Devices.CorporateManagement  # Device management
```

### Example Usage

```powershell
# Connect with proper scopes
Connect-MgGraph -Scopes "Directory.Read.All", "User.Read.All", "Organization.Read.All"

# Query global admins
Get-MgDirectoryRole -Filter "displayName eq 'Global Administrator'"

# Get users and properties
Get-MgUser -Property UserPrincipalName, OnPremisesImmutableId
```

### Controls Using This Module

- 1.1.1 - Cloud-only admins
- 1.1.2 - Emergency access accounts
- 1.1.3 - Global admin count
- 1.1.4 - Admin licenses
- 1.2.1 - Public groups
- 5.1.1-5.3.5 - Identity governance (18 controls)
- 2.2.1 - Cloud Apps monitoring
- And 40+ more controls

---

## Module 2: ExchangeOnlineManagement (v3.10.0+)

**Download Size:** ~80 MB  
**Installation Time:** 2-3 minutes  
**Required:** YES (for 20+ controls)

### Install Command

```bash
pwsh -Command "Install-Module ExchangeOnlineManagement -Repository PSGallery -Scope CurrentUser -Force"
```

### Verify Installation

```bash
pwsh -Command "Get-Module ExchangeOnlineManagement -ListAvailable | Select-Object Name, Version"
```

### Key Cmdlets Used

```
Connect-ExchangeOnline              # Establish connection
Get-EXOMailbox                      # Mailbox settings
Get-EXOOrganizationConfig           # Org-wide settings
Get-SafeLinksPolicy                 # Safe Links config
Get-SafeAttachmentPolicy            # Safe Attachments
Get-MalwareFilterPolicy             # Malware protection
Get-HostedContentFilterPolicy       # Spam/phishing
Get-TransportRule                   # Mail flow rules
Get-DlpPolicy                       # DLP policies
Get-ATPProtectionPolicyRule         # Threat protection
```

### Example Usage

```powershell
# Connect to Exchange Online
Connect-ExchangeOnline -ShowBanner:$false

# Get Safe Links policies
Get-SafeLinksPolicy | Select-Object Name, IsEnabled, EnableSafeLinksForOffice

# Verify mailbox auditing
Get-EXOMailbox -ResultSize Unlimited -Properties AuditEnabled | Where-Object {$_.AuditEnabled -eq $false}
```

### Controls Using This Module

- 2.1.1-2.1.15 - Email security (6 controls)
- 2.2.1 - Cloud Apps monitoring
- 2.4.2-2.4.5 - AIR and Defender features
- 6.1.1-6.1.3 - Mailbox auditing
- 6.2.1-6.2.3 - Mail rules and authentication
- 6.3.1-6.3.2 - Client access
- 6.5.1-6.5.5 - OAuth controls
- 1.2.2 - Shared mailbox sign-in
- 1.3.3 - External calendar sharing
- 1.3.4 - User-owned apps
- 1.3.6 - Customer lockbox
- 1.3.7 - Third-party storage
- 1.3.9 - Bookings pages

---

## Module 3: PnP.PowerShell (v2.0.0+)

**Download Size:** ~50 MB  
**Installation Time:** 1-2 minutes  
**Required:** YES (for 12+ controls)

### Install Command

```bash
pwsh -Command "Install-Module PnP.PowerShell -Repository PSGallery -Scope CurrentUser -Force"
```

### Verify Installation

```bash
pwsh -Command "Get-Module PnP.PowerShell -ListAvailable | Select-Object Name, Version"
```

### Key Cmdlets Used

```
Connect-PnPOnline                   # Establish connection
Get-PnPTenant                       # Tenant settings
Get-PnPTeamsApp                     # Teams app management
Get-PnPTeamsTeam                    # Teams configuration
Get-PnPTeamsUser                    # Teams membership
Get-PnPSharePointSharingSettings    # SharePoint sharing
Set-PnPTeamsTeamArchivedState       # Archive management
Get-PnPUser                         # User properties
Get-PnPGroup                        # Group management
```

### Example Usage

```powershell
# Connect to SharePoint/Teams
Connect-PnPOnline -Url "https://tenant-admin.sharepoint.com" -Interactive

# Get tenant-wide settings
Get-PnPTenant | Select-Object ExternalSharingEnabled, CommentsOnFilesDisabled

# Check Teams apps
Get-PnPTeamsApp | Where-Object {$_.IsBlocked -eq $true}
```

### Controls Using This Module

- 7.2.1-7.2.11 - SharePoint security (11 controls)
- 7.3.1 - Infected files
- 8.1.1-8.1.2 - Teams settings
- 8.2.1-8.2.4 - External access
- 8.5.1-8.5.9 - Meeting security
- 8.4.1 - App permissions
- 8.6.1 - User reporting
- 9.1.1-9.1.12 - Fabric analytics

---

## Installation Comparison

### Option A: Individual Installation (Recommended)

```bash
# Step 1: Install Microsoft.Graph (5 min)
pwsh -Command "Install-Module Microsoft.Graph -Repository PSGallery -Scope CurrentUser -Force"

# Step 2: Install ExchangeOnlineManagement (3 min)
pwsh -Command "Install-Module ExchangeOnlineManagement -Repository PSGallery -Scope CurrentUser -Force"

# Step 3: Install PnP.PowerShell (2 min)
pwsh -Command "Install-Module PnP.PowerShell -Repository PSGallery -Scope CurrentUser -Force"

# Total: ~10 minutes
```

### Option B: Batch Installation Script

```powershell
# Save as install-modules.ps1
$modules = @(
    'Microsoft.Graph',
    'ExchangeOnlineManagement',
    'PnP.PowerShell'
)

foreach ($module in $modules) {
    Write-Host "Installing $module..." -ForegroundColor Cyan
    Install-Module $module -Repository PSGallery -Scope CurrentUser -Force -WarningAction SilentlyContinue
    Write-Host "✓ $module installed" -ForegroundColor Green
}

Write-Host "`nVerifying installations..." -ForegroundColor Cyan
Get-Module $modules -ListAvailable | Select-Object Name, Version | Format-Table -AutoSize
```

Run with:
```bash
pwsh -ExecutionPolicy Bypass -File install-modules.ps1
```

---

## Platform-Specific Notes

### Windows

**PowerShell Versions Supported:**
- PowerShell 5.1 (built-in)
- PowerShell 7+ (recommended)

**Installation:**
```powershell
# PowerShell 5.1
Install-Module Microsoft.Graph -Repository PSGallery -Scope CurrentUser -Force

# Or use PowerShell 7 (pwsh)
pwsh -Command "Install-Module Microsoft.Graph -Repository PSGallery -Scope CurrentUser -Force"
```

---

### macOS

**Requirements:**
- PowerShell 7+ (pwsh)
- Homebrew (optional)

**Installation:**
```bash
# Install PowerShell 7 (if not already installed)
brew install powershell

# Install modules
pwsh -Command "Install-Module Microsoft.Graph -Repository PSGallery -Scope CurrentUser -Force"
pwsh -Command "Install-Module ExchangeOnlineManagement -Repository PSGallery -Scope CurrentUser -Force"
pwsh -Command "Install-Module PnP.PowerShell -Repository PSGallery -Scope CurrentUser -Force"
```

---

### Linux

**Requirements:**
- PowerShell 7+ (pwsh)

**Installation:**
```bash
# Install PowerShell 7 (if not already installed)
# See: https://learn.microsoft.com/en-us/powershell/scripting/install/installing-powershell-on-linux

# Install modules
pwsh -Command "Install-Module Microsoft.Graph -Repository PSGallery -Scope CurrentUser -Force"
pwsh -Command "Install-Module ExchangeOnlineManagement -Repository PSGallery -Scope CurrentUser -Force"
pwsh -Command "Install-Module PnP.PowerShell -Repository PSGallery -Scope CurrentUser -Force"
```

---

## Verification Checklist

After installation, verify everything is working:

```bash
# 1. Check module installation
pwsh -Command "Get-Module Microsoft.Graph, ExchangeOnlineManagement, PnP.PowerShell -ListAvailable"

# 2. Test Microsoft.Graph connection
pwsh -Command "Connect-MgGraph -Scopes 'Directory.Read.All' -NoWelcome; Get-MgOrganization | Select-Object DisplayName"

# 3. Test Exchange Online connection
pwsh -Command "Connect-ExchangeOnline -ShowBanner:\$false; Get-EXOMailbox -ResultSize 1"

# 4. Test SharePoint/PnP connection
pwsh -Command "Connect-PnPOnline -Url 'https://TENANT-admin.sharepoint.com' -Interactive; Get-PnPTenant | Select-Object DisplayName"
```

---

## Troubleshooting

### Issue: "Cannot find module"

```powershell
# Solution: Reinstall with force and update
Install-Module Microsoft.Graph -Repository PSGallery -Scope CurrentUser -Force -AllowClobber

# Or update existing
Update-Module Microsoft.Graph
```

### Issue: "Module imported but cmdlet not found"

```powershell
# Solution: Import the submodule explicitly
Import-Module Microsoft.Graph.DirectoryObjects
Import-Module Microsoft.Graph.Users
```

### Issue: "The specified module with version X was not found"

```powershell
# Check available versions
Get-Module Microsoft.Graph -ListAvailable

# Uninstall old version
Uninstall-Module Microsoft.Graph -AllVersions

# Reinstall latest
Install-Module Microsoft.Graph -Repository PSGallery -Scope CurrentUser -Force
```

---

## Storage Location

Modules are installed in platform-specific locations:

**Windows:**
```
C:\Users\{username}\Documents\PowerShell\Modules\
```

**macOS/Linux:**
```
~/.local/share/powershell/Modules/
```

---

## Module Update Strategy

Check for updates periodically:

```bash
# Check for updates
pwsh -Command "Find-Module Microsoft.Graph, ExchangeOnlineManagement, PnP.PowerShell"

# Update all modules
pwsh -Command "Update-Module -Confirm:\$false"
```

---

## License & Support

All modules are:
- ✓ Open Source (MIT License)
- ✓ Maintained by Microsoft
- ✓ Free to use
- ✓ Fully supported

**Documentation:**
- Microsoft.Graph: https://learn.microsoft.com/en-us/powershell/module/microsoft.graph
- ExchangeOnlineManagement: https://learn.microsoft.com/en-us/powershell/exchange
- PnP.PowerShell: https://pnp.github.io/powershell

---

**Last Updated:** 2026-06-23  
**Version:** 1.0.0  
**Total Modules:** 3  
**Total Download:** ~330 MB  
**Installation Time:** ~10 minutes
