# PowerShell Script to Add Choice Columns to SharePoint Lists
# This is a workaround for Graph API limitations with choice columns
# Run this in PowerShell with PnP module installed

# Install PnP PowerShell if needed:
# Install-Module PnP.PowerShell -Scope CurrentUser

# Configuration - ENTER YOUR VALUES BELOW
$SiteUrl = "https://nasstech.sharepoint.com/"  # Root site URL - no changes needed
$TenantId = "b9cc8284-05ed-452f-877a-970779430dcb"  # TODO: Get from Azure AD Properties (copy your Tenant ID here)
$ClientId = "04d3be8d-d433-4367-893e-eccc82190a11"  # TODO: Get from App Registration (copy your Client ID here)
$ClientSecret = "wem8Q~XScY3hJhiqKMcCeaSzYcodlCQB459DtaTy"  # TODO: Get from App Registration Secrets (copy your Client Secret here)

# Get values from environment or prompt if not set
if ([string]::IsNullOrEmpty($TenantId)) {
    $TenantId = Read-Host "Enter your Tenant ID (from Azure AD)"
}
if ([string]::IsNullOrEmpty($ClientId)) {
    $ClientId = Read-Host "Enter your Client ID (from App Registration)"
}
if ([string]::IsNullOrEmpty($ClientSecret)) {
    $ClientSecret = Read-Host -AsSecureString "Enter your Client Secret (from App Registration)"
    $ClientSecret = [System.Net.NetworkCredential]::new('', $ClientSecret).Password
}

Write-Host "🔐 Connecting to SharePoint..."

# Connect using app credentials
Connect-PnPOnline -Url $SiteUrl -ClientId $ClientId -ClientSecret $ClientSecret -Tenant "nasstech.onmicrosoft.com"

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

        # Add the choice column - using Add-PnPField with correct parameters
        # Note: -Required parameter removed as it causes issues in some PnP versions
        Add-PnPField -List $listName `
            -DisplayName $columnName `
            -InternalName $columnName `
            -Type Choice `
            -Choices $choices

        Write-Host "✅ Successfully added $columnName to $listName"

    } catch {
        Write-Host "❌ Error adding $columnName to $listName : $_"
    }
}

Write-Host "`n✅ Choice Column Setup Complete!`n"
Write-Host "📋 Lists are now ready in SharePoint with all required columns."
