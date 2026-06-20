# Complete TenantGuard SharePoint Lists & Columns Creation
# This script creates lists AND adds all required columns

param(
    [string]$SiteUrl = "https://nasstech.sharepoint.com/sites/M365-AgentOps"
)

Write-Host "🚀 TenantGuard SharePoint Lists & Columns Setup`n" -ForegroundColor Green
Write-Host "=" * 70

# Connect
Write-Host "🔐 Connecting to SharePoint site..." -ForegroundColor Cyan
Connect-PnPOnline -Url $SiteUrl -UseWebLogin -ErrorAction Stop
Write-Host "✅ Connected`n"

# Get site info
$site = Get-PnPSite -Includes Id
$siteId = $site.Id
Write-Host "Site ID: $siteId`n"

# Define lists with their columns
$listsConfig = @(
    @{
        ListName = "TenantGuard-Alerts"
        DisplayName = "TenantGuard Alerts"
        Description = "Security alerts detected by TenantGuard"
        Columns = @(
            @{ Name = "AlertId"; DisplayName = "Alert ID"; Type = "Text"; Required = $true }
            @{ Name = "Headline"; DisplayName = "Headline"; Type = "Text"; Required = $true }
            @{ Name = "Description"; DisplayName = "Description"; Type = "Text" }
            @{ Name = "Severity"; DisplayName = "Severity"; Type = "Choice"; Choices = @("CRITICAL", "HIGH", "MEDIUM", "INFO") }
            @{ Name = "Score"; DisplayName = "Risk Score"; Type = "Number" }
            @{ Name = "Type"; DisplayName = "Alert Type"; Type = "Choice"; Choices = @("ADMIN", "EXCHANGE", "SECURITY", "APPLICATION") }
            @{ Name = "Actor"; DisplayName = "Actor"; Type = "Text" }
            @{ Name = "RiskAssessment"; DisplayName = "Risk Assessment"; Type = "Text" }
            @{ Name = "Recommendations"; DisplayName = "Recommendations"; Type = "Text" }
            @{ Name = "Dismissed"; DisplayName = "Dismissed"; Type = "Boolean" }
            @{ Name = "CreatedTime"; DisplayName = "Created Time"; Type = "DateTime" }
        )
    }
    @{
        ListName = "TenantGuard-Correlations"
        DisplayName = "TenantGuard Correlations"
        Description = "Alert correlations and attack patterns"
        Columns = @(
            @{ Name = "CorrelationId"; DisplayName = "Correlation ID"; Type = "Text"; Required = $true }
            @{ Name = "Title"; DisplayName = "Title"; Type = "Text"; Required = $true }
            @{ Name = "Description"; DisplayName = "Description"; Type = "Text" }
            @{ Name = "AlertCount"; DisplayName = "Alert Count"; Type = "Number" }
            @{ Name = "Severity"; DisplayName = "Severity"; Type = "Choice"; Choices = @("CRITICAL", "HIGH", "MEDIUM", "INFO") }
            @{ Name = "ConfidenceScore"; DisplayName = "Confidence Score"; Type = "Number" }
            @{ Name = "PatternType"; DisplayName = "Pattern Type"; Type = "Text" }
            @{ Name = "RelatedAlerts"; DisplayName = "Related Alerts"; Type = "Text" }
        )
    }
    @{
        ListName = "TenantGuard-Investigations"
        DisplayName = "TenantGuard Investigations"
        Description = "AI-powered security investigations"
        Columns = @(
            @{ Name = "InvestigationId"; DisplayName = "Investigation ID"; Type = "Text"; Required = $true }
            @{ Name = "Title"; DisplayName = "Title"; Type = "Text"; Required = $true }
            @{ Name = "AlertId"; DisplayName = "Alert ID"; Type = "Text" }
            @{ Name = "Status"; DisplayName = "Status"; Type = "Choice"; Choices = @("Open", "Investigating", "Resolved") }
            @{ Name = "Messages"; DisplayName = "Messages"; Type = "Text" }
            @{ Name = "CreatedTime"; DisplayName = "Created Time"; Type = "DateTime" }
        )
    }
)

$listIds = @{}

# Create each list with columns
foreach ($listConfig in $listsConfig) {
    Write-Host "📚 Creating list: $($listConfig.ListName)" -ForegroundColor Cyan

    try {
        # Create the list
        $newList = New-PnPList `
            -Title $listConfig.ListName `
            -Template GenericList `
            -ErrorAction Stop

        $listId = $newList.Id
        $listIds[$listConfig.ListName] = $listId

        Write-Host "   ✅ List created" -ForegroundColor Green
        Write-Host "      ID: $listId"

        # Add columns
        Write-Host "   📝 Adding columns..." -ForegroundColor Gray

        $columnCount = 0
        foreach ($col in $listConfig.Columns) {
            try {
                $fieldParams = @{
                    List = $listConfig.ListName
                    DisplayName = $col.DisplayName
                    InternalName = $col.Name
                    Type = $col.Type
                    ErrorAction = "Stop"
                }

                # Add required parameter if specified
                if ($col.Required) {
                    $fieldParams["Required"] = $col.Required
                }

                # For choice fields, add choices
                if ($col.Type -eq "Choice") {
                    $fieldParams["Choices"] = $col.Choices
                }

                # Create the field
                Add-PnPField @fieldParams | Out-Null
                Write-Host "      ✓ $($col.DisplayName) ($($col.Type))" -ForegroundColor Green
                $columnCount++

            } catch {
                Write-Host "      ⚠️  $($col.DisplayName) - $($_.Exception.Message.Substring(0, 40))" -ForegroundColor Yellow
            }
        }

        Write-Host "   ✅ Added $columnCount/$($listConfig.Columns.Count) columns`n"

    } catch {
        Write-Host "   ❌ Failed to create list: $($_.Exception.Message)`n" -ForegroundColor Red
    }
}

# Summary
Write-Host "=" * 70
Write-Host "✅ SETUP COMPLETE!`n" -ForegroundColor Green

Write-Host "📋 Add these values to backend/.env:`n" -ForegroundColor Yellow
Write-Host "SHAREPOINT_SITE_NAME=M365-AgentOps"
Write-Host "SHAREPOINT_SITE_ID=$siteId"
Write-Host "SHAREPOINT_ALERTS_LIST_ID=$($listIds['TenantGuard-Alerts'])"
Write-Host "SHAREPOINT_CORRELATIONS_LIST_ID=$($listIds['TenantGuard-Correlations'])"
Write-Host "SHAREPOINT_INVESTIGATIONS_LIST_ID=$($listIds['TenantGuard-Investigations'])"
Write-Host ""

Write-Host "📊 Lists Created:" -ForegroundColor Cyan
Write-Host "   ✅ TenantGuard-Alerts ($($listIds['TenantGuard-Alerts']))"
Write-Host "   ✅ TenantGuard-Correlations ($($listIds['TenantGuard-Correlations']))"
Write-Host "   ✅ TenantGuard-Investigations ($($listIds['TenantGuard-Investigations']))"

Write-Host "`n📊 Columns per List:" -ForegroundColor Cyan
foreach ($listConfig in $listsConfig) {
    Write-Host "   $($listConfig.ListName): $($listConfig.Columns.Count) columns"
}

Write-Host "`n🚀 Next Steps:" -ForegroundColor Green
Write-Host "   1. Copy the Site ID and List IDs above"
Write-Host "   2. Add to backend/.env"
Write-Host "   3. Restart backend server: npm run dev`n"

Disconnect-PnPOnline
Write-Host "✅ Done!" -ForegroundColor Green
