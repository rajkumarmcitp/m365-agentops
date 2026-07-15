# M365 AgentOps - Authentication Status Checker
# Run this script to verify real Azure AD authentication is properly configured

Write-Host ""
Write-Host "╔════════════════════════════════════════════════════╗"
Write-Host "║  M365 AgentOps - Authentication Status Checker     ║"
Write-Host "╚════════════════════════════════════════════════════╝"
Write-Host ""

# Color functions
function Write-Success { Write-Host "✓ $args" -ForegroundColor Green }
function Write-Error { Write-Host "✗ $args" -ForegroundColor Red }
function Write-Warning { Write-Host "⚠ $args" -ForegroundColor Yellow }
function Write-Info { Write-Host "ℹ $args" -ForegroundColor Cyan }

# Check 1: .env file exists and has credentials
Write-Host "Step 1: Checking .env file..." -ForegroundColor Yellow
$envPath = "./.env"

if (Test-Path $envPath) {
    Write-Success ".env file found"

    $envContent = Get-Content $envPath
    $tenantId = ($envContent | Select-String "^AZURE_TENANT_ID=" | Select-Object -First 1).ToString() -replace "AZURE_TENANT_ID=",""
    $clientId = ($envContent | Select-String "^AZURE_CLIENT_ID=" | Select-Object -First 1).ToString() -replace "AZURE_CLIENT_ID=",""
    $clientSecret = ($envContent | Select-String "^AZURE_CLIENT_SECRET=" | Select-Object -First 1).ToString() -replace "AZURE_CLIENT_SECRET=",""

    if ($tenantId -and -not $tenantId.Contains("YOUR_")) {
        Write-Success "Tenant ID configured: $($tenantId.Substring(0, 8))..."
    } else {
        Write-Error "Tenant ID not configured or invalid"
    }

    if ($clientId -and -not $clientId.Contains("YOUR_")) {
        Write-Success "Client ID configured: $($clientId.Substring(0, 8))..."
    } else {
        Write-Error "Client ID not configured or invalid"
    }

    if ($clientSecret -and -not $clientSecret.Contains("YOUR_")) {
        Write-Success "Client Secret configured: $(($clientSecret.Substring(0, 4)) + "***")"
    } else {
        Write-Error "Client Secret not configured or invalid"
    }
} else {
    Write-Error ".env file not found at $envPath"
    Write-Info "Make sure you're running this script from the m365-agentops directory"
    exit 1
}

Write-Host ""
Write-Host "Step 2: Checking Azure AD app permissions..." -ForegroundColor Yellow

# Check 2: Try to connect to Microsoft Graph and verify permissions
try {
    $modules = @("Microsoft.Graph.Authentication", "Microsoft.Graph.Applications")

    foreach ($module in $modules) {
        if (-not (Get-Module -ListAvailable -Name $module)) {
            Write-Warning "$module not installed. Installing..."
            Install-Module $module -Force -Scope CurrentUser | Out-Null
        }
    }

    Import-Module Microsoft.Graph.Authentication -Force
    Import-Module Microsoft.Graph.Applications -Force

    Write-Info "Connecting to Microsoft Graph..."
    Connect-MgGraph -Scopes "Application.Read.All" -NoWelcome | Out-Null

    # Get the application
    $app = Get-MgApplication -Filter "appId eq '$clientId'"

    if ($app) {
        Write-Success "Azure AD app found: $($app.DisplayName)"

        # Check for Microsoft Graph API permissions
        $graphSp = Get-MgServicePrincipal -Filter "displayName eq 'Microsoft Graph'" -ErrorAction SilentlyContinue

        if ($graphSp) {
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
                "Compliance.Read.All",
                "AuditLog.Read.All"
            )

            $configuredPermissions = @()
            if ($app.RequiredResourceAccess) {
                $graphResources = $app.RequiredResourceAccess | Where-Object { $_.ResourceAppId -eq $graphSp.AppId }
                if ($graphResources) {
                    $configuredPermissions = $graphResources.ResourceAccess | ForEach-Object {
                        $roleOrScope = $graphSp.AppRoles | Where-Object { $_.Id -eq $_.id }
                        if ($roleOrScope) { $roleOrScope.Value }
                    }
                }
            }

            Write-Host ""
            Write-Host "  Checking Graph API permissions:" -ForegroundColor Cyan

            $missingCount = 0
            foreach ($perm in $requiredPermissions) {
                if ($configuredPermissions -contains $perm) {
                    Write-Success "    $perm"
                } else {
                    Write-Warning "    $perm (NOT CONFIGURED)"
                    $missingCount++
                }
            }

            Write-Host ""
            if ($missingCount -eq 0) {
                Write-Success "All required permissions are configured!"

                # Check if admin consent is granted
                $adminConsentUrl = "https://portal.azure.com/#blade/Microsoft_AAD_RegisteredApps/ApplicationMenuBlade/CallBacks/appId/$clientId/isMSAApp~/false"
                Write-Info "Admin Consent Status:"
                Write-Info "  Check the Azure Portal: $adminConsentUrl"
                Write-Info "  Look for 'Granted for [Tenant]' next to each permission"
            } else {
                Write-Error "Missing $missingCount permission(s) - see SETUP_REAL_AUTH.md for configuration steps"
            }
        } else {
            Write-Warning "Could not find Microsoft Graph service principal"
        }
    } else {
        Write-Error "Azure AD app not found with client ID: $clientId"
    }

    Disconnect-MgGraph | Out-Null

} catch {
    Write-Warning "Could not connect to Microsoft Graph. This is expected if you don't have Azure AD admin access."
    Write-Info "If you have Azure AD admin rights, the script can automatically configure permissions."
    Write-Host ""
    Write-Host "To manually configure permissions:" -ForegroundColor Yellow
    Write-Info "1. Visit: https://portal.azure.com"
    Write-Info "2. Go to: Azure AD > App registrations > M365 AgentOps"
    Write-Info "3. Click: API permissions"
    Write-Info "4. Follow the steps in SETUP_REAL_AUTH.md"
}

Write-Host ""
Write-Host "Step 3: Testing backend connection..." -ForegroundColor Yellow

try {
    $response = Invoke-WebRequest -Uri "http://localhost:3000/api/health" -TimeoutSec 5 -ErrorAction Stop
    if ($response.StatusCode -eq 200) {
        Write-Success "Backend is running on port 3000"
        Write-Success "GraphClient should be initialized with real Azure AD credentials"
    } else {
        Write-Warning "Backend responded but with unexpected status: $($response.StatusCode)"
    }
} catch {
    Write-Warning "Could not connect to backend on http://localhost:3000"
    Write-Info "Make sure the backend is running: npm run dev"
}

Write-Host ""
Write-Host "Next Steps:" -ForegroundColor Yellow
Write-Host "1. If permissions are missing, follow the setup instructions in SETUP_REAL_AUTH.md"
Write-Host "2. Ensure admin consent is granted in Azure Portal"
Write-Host "3. Restart the backend service"
Write-Host "4. Test backup by initiating a full backup in the UI"
Write-Host ""
