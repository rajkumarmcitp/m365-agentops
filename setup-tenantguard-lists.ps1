# TenantGuard SharePoint Lists Setup via PnP PowerShell
#
# Prerequisites:
#   1. Install PnP PowerShell: Install-Module PnP.PowerShell
#   2. You must be a site owner
#
# Usage: .\setup-tenantguard-lists.ps1

param(
    [string]$SiteUrl = "https://nasstech.sharepoint.com/sites/M365-AgentOps"
)

Write-Host "🚀 TenantGuard SharePoint Lists Setup`n" -ForegroundColor Green
Write-Host "=" * 60

# Connect to SharePoint site
Write-Host "🔐 Connecting to SharePoint site..."
try {
    Connect-PnPOnline -Url $SiteUrl -UseWebLogin -ErrorAction Stop
    Write-Host "✅ Connected to SharePoint site`n" -ForegroundColor Green
} catch {
    Write-Host "❌ Failed to connect: $_" -ForegroundColor Red
    exit 1
}

# Define lists configuration
$lists = @(
    @{
        Name = "TenantGuard-Alerts"
        Title = "TenantGuard Alerts"
        Description = "Security alerts detected by TenantGuard"
        Columns = @(
            @{ Name = "AlertId"; Type = "Text"; Required = $true }
            @{ Name = "Headline"; Type = "Text"; Required = $true }
            @{ Name = "Description"; Type = "Text" }
            @{ Name = "Severity"; Type = "Choice"; Choices = @("CRITICAL", "HIGH", "MEDIUM", "INFO") }
            @{ Name = "Score"; Type = "Number" }
            @{ Name = "Type"; Type = "Choice"; Choices = @("ADMIN", "EXCHANGE", "SECURITY", "APPLICATION") }
            @{ Name = "Actor"; Type = "Text" }
            @{ Name = "RiskAssessment"; Type = "Text" }
            @{ Name = "Recommendations"; Type = "Text" }
            @{ Name = "Dismissed"; Type = "Boolean" }
            @{ Name = "CreatedTime"; Type = "DateTime" }
        )
    }
    @{
        Name = "TenantGuard-Correlations"
        Title = "TenantGuard Correlations"
        Description = "Alert correlations and attack patterns"
        Columns = @(
            @{ Name = "CorrelationId"; Type = "Text"; Required = $true }
            @{ Name = "Title"; Type = "Text"; Required = $true }
            @{ Name = "Description"; Type = "Text" }
            @{ Name = "AlertCount"; Type = "Number" }
            @{ Name = "Severity"; Type = "Choice"; Choices = @("CRITICAL", "HIGH", "MEDIUM", "INFO") }
            @{ Name = "ConfidenceScore"; Type = "Number" }
            @{ Name = "PatternType"; Type = "Text" }
            @{ Name = "RelatedAlerts"; Type = "Text" }
        )
    }
    @{
        Name = "TenantGuard-Investigations"
        Title = "TenantGuard Investigations"
        Description = "AI-powered security investigations"
        Columns = @(
            @{ Name = "InvestigationId"; Type = "Text"; Required = $true }
            @{ Name = "Title"; Type = "Text"; Required = $true }
            @{ Name = "AlertId"; Type = "Text" }
            @{ Name = "Status"; Type = "Choice"; Choices = @("Open", "Investigating", "Resolved") }
            @{ Name = "Messages"; Type = "Text" }
            @{ Name = "CreatedTime"; Type = "DateTime" }
        )
    }
)

# Create lists
$listIds = @{}

foreach ($list in $lists) {
    Write-Host "`n📚 Creating list: $($list.Title)..." -ForegroundColor Cyan

    try {
        # Create the list
        $newList = New-PnPList -Title $list.Title `
            -Template GenericList `
            -Description $list.Description `
            -ErrorAction Stop

        $listId = $newList.Id
        $listIds[$list.Name] = $listId

        Write-Host "   ✅ List created (ID: $listId)" -ForegroundColor Green

        # Remove default Title column (optional, but cleaner)
        try {
            Remove-PnPField -List $newList.Title -Identity "Title" -Force -ErrorAction SilentlyContinue
        } catch {
            # Ignore if it fails
        }

        # Add columns
        Write-Host "   📝 Adding columns..." -ForegroundColor Gray

        foreach ($col in $list.Columns) {
            try {
                $fieldParams = @{
                    List = $newList.Title
                    DisplayName = $col.Name
                    InternalName = $col.Name
                    Type = $col.Type
                    Required = $col.Required
                    ErrorAction = "Stop"
                }

                if ($col.Type -eq "Choice") {
                    $fieldParams["Choices"] = $col.Choices
                }

                Add-PnPField @fieldParams
                Write-Host "      ✓ $($col.Name) ($($col.Type))" -ForegroundColor Green
            } catch {
                Write-Host "      ⚠️  $($col.Name) - $_" -ForegroundColor Yellow
            }
        }

        Write-Host "   ✅ List ready!" -ForegroundColor Green
    } catch {
        Write-Host "   ❌ Failed: $_" -ForegroundColor Red
    }
}

# Get site ID
Write-Host "`n📊 Retrieving site information..." -ForegroundColor Cyan
try {
    $site = Get-PnPSite -Includes Id
    $siteId = $site.Id
    Write-Host "   ✅ Site ID: $siteId" -ForegroundColor Green
} catch {
    Write-Host "   ⚠️  Could not retrieve site ID" -ForegroundColor Yellow
}

# Output summary
Write-Host "`n" + "=" * 60
Write-Host "✅ SETUP COMPLETE!`n" -ForegroundColor Green

Write-Host "📋 Add these to backend/.env:`n" -ForegroundColor Yellow
Write-Host "SHAREPOINT_SITE_NAME=M365-AgentOps"
Write-Host "SHAREPOINT_SITE_ID=$siteId"
Write-Host "SHAREPOINT_ALERTS_LIST_ID=$($listIds['TenantGuard-Alerts'])"
Write-Host "SHAREPOINT_CORRELATIONS_LIST_ID=$($listIds['TenantGuard-Correlations'])"
Write-Host "SHAREPOINT_INVESTIGATIONS_LIST_ID=$($listIds['TenantGuard-Investigations'])"

Write-Host "`n📊 Lists Created:"
Write-Host "   ✅ TenantGuard-Alerts"
Write-Host "   ✅ TenantGuard-Correlations"
Write-Host "   ✅ TenantGuard-Investigations"

Write-Host "`n🚀 Next Steps:"
Write-Host "   1. Copy the IDs above to backend/.env"
Write-Host "   2. Restart backend server: npm run dev"
Write-Host "   3. Backend will automatically connect to SharePoint`n"

Disconnect-PnPOnline
