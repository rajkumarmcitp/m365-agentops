# Get TenantGuard List IDs

param(
    [string]$SiteUrl = "https://nasstech.sharepoint.com/sites/M365-AgentOps"
)

Write-Host "🔐 Connecting to SharePoint site..." -ForegroundColor Cyan
Connect-PnPOnline -Url $SiteUrl -UseWebLogin -ErrorAction Stop
Write-Host "✅ Connected`n"

# Get site info
$site = Get-PnPSite -Includes Id
$siteId = $site.Id

Write-Host "Site ID: $siteId`n"

# Get TenantGuard lists
Write-Host "📚 TenantGuard Lists:" -ForegroundColor Green
$lists = Get-PnPList | Where-Object { $_.Title -like "*TenantGuard*" }

foreach ($list in $lists) {
    Write-Host "   $($list.Title): $($list.Id)"
}

Write-Host "`n📋 Copy to backend/.env:`n"
Write-Host "SHAREPOINT_SITE_NAME=M365-AgentOps"
Write-Host "SHAREPOINT_SITE_ID=$siteId"

foreach ($list in $lists) {
    $listName = $list.Title -replace "-", "_"
    $varName = "SHAREPOINT_" + $listName.ToUpper() + "_LIST_ID"
    Write-Host "$varName=$($list.Id)"
}

Disconnect-PnPOnline
Write-Host "`n✅ Done!"
