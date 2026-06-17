# PowerShell Script to Add Choice Columns to SharePoint Lists
# This is a workaround for Graph API limitations with choice columns
# Run this in PowerShell with PnP module installed

# Install PnP PowerShell if needed:
# Install-Module PnP.PowerShell -Scope CurrentUser

# Configuration - UPDATE WITH YOUR VALUES
$SiteUrl = "https://[tenant].sharepoint.com/sites/[YourSiteName]"  # Update with your site URL
$TenantId = "YOUR_TENANT_ID"  # From Azure AD
$ClientId = "YOUR_CLIENT_ID"  # From App Registration
$ClientSecret = "YOUR_CLIENT_SECRET"  # From App Registration

# Get values from environment or prompt if not set
if ([string]::IsNullOrEmpty($TenantId) -or $TenantId -eq "YOUR_TENANT_ID") {
    $TenantId = Read-Host "Enter your Tenant ID"
}
if ([string]::IsNullOrEmpty($ClientId) -or $ClientId -eq "YOUR_CLIENT_ID") {
    $ClientId = Read-Host "Enter your Client ID (App ID)"
}
if ([string]::IsNullOrEmpty($ClientSecret) -or $ClientSecret -eq "YOUR_CLIENT_SECRET") {
    $ClientSecret = Read-Host -AsSecureString "Enter your Client Secret"
    $ClientSecret = [System.Net.NetworkCredential]::new('', $ClientSecret).Password
}

Write-Host "🔐 Connecting to SharePoint..."

# Connect using app credentials
Connect-PnPOnline -Url $SiteUrl -ClientId $ClientId -ClientSecret $ClientSecret -Tenant "$TenantId.onmicrosoft.com"

Write-Host "✅ Connected to SharePoint`n"

# Define choice columns to add
$ChoiceColumnsToAdd = @(
    @{
        ListName = "SelfServiceRequests"
        ColumnName = "Service"
        Choices = @("Exchange", "Teams", "SharePoint", "M365 Groups", "User Management", "Other")
    },
    @{
        ListName = "SelfServiceRequests"
        ColumnName = "Status"
        Choices = @("Submitted", "Approved", "Rejected", "Completed", "Cancelled")
    },
    @{
        ListName = "SelfServiceRequests"
        ColumnName = "Priority"
        Choices = @("Low", "Normal", "High", "Critical")
    },
    @{
        ListName = "SelfServiceApprovals"
        ColumnName = "Status"
        Choices = @("Pending", "Approved", "Rejected")
    },
    @{
        ListName = "SelfServiceApprovals"
        ColumnName = "ApprovalLevel"
        Choices = @("Manager", "Admin", "Executive")
    },
    @{
        ListName = "SelfServiceAudit"
        ColumnName = "Action"
        Choices = @("Submitted", "Approved", "Rejected", "Completed", "Commented", "Delegated", "Escalated")
    }
)

# Add each choice column
foreach ($column in $ChoiceColumnsToAdd) {
    $listName = $column.ListName
    $columnName = $column.ColumnName
    $choices = $column.Choices

    Write-Host "📋 Adding column: $columnName to $listName..."

    try {
        # Check if column already exists
        $existingColumn = Get-PnPField -List $listName | Where-Object { $_.InternalName -eq $columnName }

        if ($null -ne $existingColumn) {
            Write-Host "⚠️  Column $columnName already exists in $listName"
            continue
        }

        # Add the choice column
        Add-PnPField -List $listName `
            -DisplayName $columnName `
            -InternalName $columnName `
            -Type Choice `
            -Choices $choices `
            -Required $false

        Write-Host "✅ Successfully added $columnName to $listName"

    } catch {
        Write-Host "❌ Error adding $columnName to $listName : $_"
    }
}

Write-Host "`n✅ Choice Column Setup Complete!`n"
Write-Host "📋 Lists are now ready in SharePoint with all required columns."
