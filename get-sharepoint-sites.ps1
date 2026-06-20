# Get list of available SharePoint sites
# Run this to find the correct site name/ID for TenantGuard

Connect-PnPOnline -Url "https://nasstech.sharepoint.com" -Interactive

Write-Host "`n📋 Available SharePoint Sites:" -ForegroundColor Cyan
Write-Host "════════════════════════════════════════════════════════" -ForegroundColor Cyan

# Get all sites
$sites = Get-PnPTenantSite -IncludeOneDriveSites:$false

foreach ($site in $sites) {
    Write-Host "`n✓ Site: $($site.Url)" -ForegroundColor Green
    Write-Host "  Title: $($site.Title)" -ForegroundColor White
    Write-Host "  Status: $($site.Status)" -ForegroundColor White

    # Extract site identifier for Graph API
    $siteUrl = $site.Url
    if ($siteUrl -match '/sites/(.+?)/?$') {
        $siteName = $matches[1]
        Write-Host "  Graph API Format: /sites/$siteName" -ForegroundColor Yellow
    }
}

Write-Host "`n════════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host "Use one of the site identifiers above in TenantGuard Admin Settings" -ForegroundColor Cyan
