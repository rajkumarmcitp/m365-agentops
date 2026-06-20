# ============================================================
# TenantGuard SharePoint Columns Creation Script
# ============================================================
# This script creates all required columns for the three
# TenantGuard lists in SharePoint Online.
#
# Prerequisites:
# - PnP PowerShell module installed: Install-Module PnP.PowerShell
# - Access to the SharePoint site with appropriate permissions
#
# Usage:
# .\Create-TenantGuardColumns.ps1
# ============================================================

# Configuration
$TenantUrl = "https://nasstech.sharepoint.com"
$SiteUrl = "/sites/M365-AgentOps"
$FullSiteUrl = "$TenantUrl$SiteUrl"
$SiteId = "b60085d7-b9c8-41a3-8789-bab376d0c84f"
$SiteName = "M365-AgentOps"

Write-Host "Target Site: $FullSiteUrl" -ForegroundColor $InfoColor
Write-Host "Site ID: $SiteId" -ForegroundColor $InfoColor
Write-Host "Site Name: $SiteName" -ForegroundColor $InfoColor

# Lists to create columns in
$AlertsListName = "TenantGuard-Alerts"
$CorrelationsListName = "TenantGuard-Correlations"
$InvestigationsListName = "TenantGuard-Investigations"

# Color coding for output
$SuccessColor = "Green"
$ErrorColor = "Red"
$WarningColor = "Yellow"
$InfoColor = "Cyan"

Write-Host "╔════════════════════════════════════════════════════════╗" -ForegroundColor $InfoColor
Write-Host "║  TenantGuard SharePoint Columns Creation              ║" -ForegroundColor $InfoColor
Write-Host "║  Creating 49 columns across 3 lists                   ║" -ForegroundColor $InfoColor
Write-Host "╚════════════════════════════════════════════════════════╝" -ForegroundColor $InfoColor
Write-Host ""

# Function to create a column
function New-SharePointColumn {
    param(
        [Parameter(Mandatory=$true)]
        [string]$ListName,

        [Parameter(Mandatory=$true)]
        [string]$ColumnName,

        [Parameter(Mandatory=$true)]
        [string]$ColumnType,

        [string]$Description = "",

        [array]$Choices = $null,

        [int]$MaxLength = 255,

        [bool]$Required = $false
    )

    try {
        # Check if column already exists
        $existingField = Get-PnPField -List $ListName -Identity $ColumnName -ErrorAction SilentlyContinue
        if ($existingField) {
            Write-Host "  ⊘ $ColumnName already exists" -ForegroundColor $WarningColor
            return $true
        }

        # Create column based on type
        switch ($ColumnType) {
            "Text" {
                Add-PnPField -List $ListName `
                    -DisplayName $ColumnName `
                    -InternalName $ColumnName `
                    -Type Text | Out-Null
            }
            "MultilineText" {
                Add-PnPField -List $ListName `
                    -DisplayName $ColumnName `
                    -InternalName $ColumnName `
                    -Type Note | Out-Null
            }
            "Number" {
                Add-PnPField -List $ListName `
                    -DisplayName $ColumnName `
                    -InternalName $ColumnName `
                    -Type Number | Out-Null
            }
            "DateTime" {
                Add-PnPField -List $ListName `
                    -DisplayName $ColumnName `
                    -InternalName $ColumnName `
                    -Type DateTime | Out-Null
            }
            "Boolean" {
                Add-PnPField -List $ListName `
                    -DisplayName $ColumnName `
                    -InternalName $ColumnName `
                    -Type Boolean | Out-Null
            }
            "Choice" {
                if ($Choices -and $Choices.Count -gt 0) {
                    Add-PnPField -List $ListName `
                        -DisplayName $ColumnName `
                        -InternalName $ColumnName `
                        -Type Choice `
                        -Choices $Choices | Out-Null
                } else {
                    Write-Host "  ✗ No choices provided for $ColumnName" -ForegroundColor $ErrorColor
                    return $false
                }
            }
            default {
                Write-Host "  ✗ Unknown column type: $ColumnType" -ForegroundColor $ErrorColor
                return $false
            }
        }

        Write-Host "  ✓ Created: $ColumnName ($ColumnType)" -ForegroundColor $SuccessColor
        return $true

    } catch {
        Write-Host "  ✗ Error creating $ColumnName : $_" -ForegroundColor $ErrorColor
        return $false
    }
}

# Connect to SharePoint
Write-Host "🔗 Connecting to SharePoint..." -ForegroundColor $InfoColor
Write-Host "   URL: $FullSiteUrl" -ForegroundColor $InfoColor
try {
    Connect-PnPOnline -Url "$FullSiteUrl" -Interactive -ClientID 381b83f8-1a53-4135-8a19-bf083bfe20cd
    Write-Host "✓ Connected successfully" -ForegroundColor $SuccessColor
} catch {
    Write-Host "✗ Failed to connect to SharePoint: $_" -ForegroundColor $ErrorColor
    exit 1
}

Write-Host ""

# ============================================================
# TenantGuard-Alerts Columns (17 total)
# ============================================================
Write-Host "📋 Creating columns for: $AlertsListName" -ForegroundColor $InfoColor
Write-Host ""

$alertsColumns = @(
    @{ Name="AlertID"; Type="Text"; MaxLength=255; Required=$true; Desc="Unique alert identifier" },
    @{ Name="Priority"; Type="Choice"; Choices=@("P1","P2","P3"); Required=$true; Desc="Priority level" },
    @{ Name="Severity"; Type="Choice"; Choices=@("CRITICAL","HIGH","MEDIUM","LOW"); Required=$true; Desc="Severity level" },
    @{ Name="RiskScore"; Type="Number"; Required=$true; Desc="Risk score 0-100" },
    @{ Name="Category"; Type="Choice"; Choices=@("Identity & Access","Application Security","Exchange Online","SharePoint & OneDrive","Teams","Device & Intune","DLP & Compliance","Defender Security","Service Health","Configuration Drift"); Required=$true; Desc="Security category" },
    @{ Name="Description"; Type="MultilineText"; Required=$true; Desc="Alert description" },
    @{ Name="Actor"; Type="Text"; MaxLength=255; Required=$true; Desc="User or service that triggered alert" },
    @{ Name="Target"; Type="Text"; MaxLength=255; Required=$false; Desc="Resource affected" },
    @{ Name="Source"; Type="Choice"; Choices=@("Entra ID","Exchange Online","SharePoint","Identity Protection","Intune","Defender","Purview"); Required=$true; Desc="Alert source system" },
    @{ Name="ActionTimestamp"; Type="DateTime"; Required=$true; Desc="When alert occurred" },
    @{ Name="AlertType"; Type="Text"; MaxLength=255; Required=$false; Desc="ADMIN, EXCHANGE, SECURITY, APPLICATION" },
    @{ Name="RiskAssessment"; Type="MultilineText"; Required=$false; Desc="JSON risk assessment data" },
    @{ Name="Recommendations"; Type="MultilineText"; Required=$false; Desc="JSON array of remediation steps" },
    @{ Name="Dismissed"; Type="Boolean"; Required=$true; Desc="Whether alert dismissed" },
    @{ Name="DismissedAt"; Type="DateTime"; Required=$false; Desc="When alert was dismissed" },
    @{ Name="DismissReason"; Type="Text"; MaxLength=255; Required=$false; Desc="Why dismissed" },
    @{ Name="RawEvent"; Type="MultilineText"; Required=$false; Desc="Full event JSON from source" }
)

$alertsCreated = 0
foreach ($column in $alertsColumns) {
    if (New-SharePointColumn -ListName $AlertsListName `
                             -ColumnName $column.Name `
                             -ColumnType $column.Type `
                             -Description $column.Desc `
                             -Choices $column.Choices `
                             -Required $column.Required) {
        $alertsCreated++
    }
}

Write-Host ""
Write-Host "✓ TenantGuard-Alerts: $alertsCreated/17 columns" -ForegroundColor $SuccessColor
Write-Host ""

# ============================================================
# TenantGuard-Correlations Columns (17 total)
# ============================================================
Write-Host "📋 Creating columns for: $CorrelationsListName" -ForegroundColor $InfoColor
Write-Host ""

$correlationsColumns = @(
    @{ Name="CorrelationID"; Type="Text"; MaxLength=255; Required=$true; Desc="Unique correlation identifier" },
    @{ Name="CorrelationType"; Type="Choice"; Choices=@("ACTOR","TARGET","TEMPORAL","PATTERN"); Required=$true; Desc="Type of correlation" },
    @{ Name="PatternType"; Type="Text"; MaxLength=255; Required=$true; Desc="Attack pattern type" },
    @{ Name="AlertIDs"; Type="MultilineText"; Required=$true; Desc="JSON array of related alert IDs" },
    @{ Name="AlertCount"; Type="Number"; Required=$true; Desc="Number of alerts in correlation" },
    @{ Name="Actor"; Type="Text"; MaxLength=255; Required=$false; Desc="User/service involved" },
    @{ Name="Target"; Type="Text"; MaxLength=255; Required=$false; Desc="Resource targeted" },
    @{ Name="StartTimestamp"; Type="DateTime"; Required=$true; Desc="When correlation period begins" },
    @{ Name="EndTimestamp"; Type="DateTime"; Required=$true; Desc="When correlation period ends" },
    @{ Name="CorrelationScore"; Type="Number"; Required=$true; Desc="Confidence score 0-100" },
    @{ Name="RiskLevel"; Type="Choice"; Choices=@("CRITICAL","HIGH","MEDIUM","LOW"); Required=$true; Desc="Risk level of correlation" },
    @{ Name="Description"; Type="MultilineText"; Required=$true; Desc="What this correlation represents" },
    @{ Name="Metadata"; Type="MultilineText"; Required=$false; Desc="JSON with additional context" },
    @{ Name="Dismissed"; Type="Boolean"; Required=$true; Desc="Whether correlation dismissed" },
    @{ Name="DismissedAt"; Type="DateTime"; Required=$false; Desc="When correlation was dismissed" },
    @{ Name="DismissReason"; Type="Text"; MaxLength=255; Required=$false; Desc="Why correlation was dismissed" }
)

$correlationsCreated = 0
foreach ($column in $correlationsColumns) {
    if (New-SharePointColumn -ListName $CorrelationsListName `
                             -ColumnName $column.Name `
                             -ColumnType $column.Type `
                             -Description $column.Desc `
                             -Choices $column.Choices `
                             -Required $column.Required) {
        $correlationsCreated++
    }
}

Write-Host ""
Write-Host "✓ TenantGuard-Correlations: $correlationsCreated/16 columns" -ForegroundColor $SuccessColor
Write-Host ""

# ============================================================
# TenantGuard-Investigations Columns (17 total)
# ============================================================
Write-Host "📋 Creating columns for: $InvestigationsListName" -ForegroundColor $InfoColor
Write-Host ""

$investigationsColumns = @(
    @{ Name="InvestigationID"; Type="Text"; MaxLength=255; Required=$true; Desc="Unique investigation identifier" },
    @{ Name="InvestigationType"; Type="Choice"; Choices=@("ALERT","CORRELATION","PATTERN"); Required=$true; Desc="Type of investigation" },
    @{ Name="Status"; Type="Choice"; Choices=@("OPEN","IN_PROGRESS","RESOLVED","CLOSED"); Required=$true; Desc="Investigation status" },
    @{ Name="Priority"; Type="Choice"; Choices=@("P1","P2","P3"); Required=$true; Desc="Priority level" },
    @{ Name="Severity"; Type="Choice"; Choices=@("CRITICAL","HIGH","MEDIUM","LOW"); Required=$true; Desc="Severity level" },
    @{ Name="RiskScore"; Type="Number"; Required=$true; Desc="Risk score 0-100" },
    @{ Name="StartedBy"; Type="Text"; MaxLength=255; Required=$true; Desc="User who started investigation" },
    @{ Name="StartedAt"; Type="DateTime"; Required=$true; Desc="When investigation started" },
    @{ Name="CompletedAt"; Type="DateTime"; Required=$false; Desc="When investigation completed" },
    @{ Name="CorrelationIDs"; Type="MultilineText"; Required=$false; Desc="JSON array of related correlation IDs" },
    @{ Name="AlertIDs"; Type="MultilineText"; Required=$false; Desc="JSON array of related alert IDs" },
    @{ Name="InvestigationNotes"; Type="MultilineText"; Required=$false; Desc="Investigator notes and findings" },
    @{ Name="AIAnalysis"; Type="MultilineText"; Required=$false; Desc="Claude AI investigation analysis" },
    @{ Name="Recommendations"; Type="MultilineText"; Required=$false; Desc="JSON array of recommended actions" },
    @{ Name="ReportGenerated"; Type="Boolean"; Required=$false; Desc="Whether report was created" },
    @{ Name="ReportURL"; Type="Text"; MaxLength=255; Required=$false; Desc="Link to generated report" }
)

$investigationsCreated = 0
foreach ($column in $investigationsColumns) {
    if (New-SharePointColumn -ListName $InvestigationsListName `
                             -ColumnName $column.Name `
                             -ColumnType $column.Type `
                             -Description $column.Desc `
                             -Choices $column.Choices `
                             -Required $column.Required) {
        $investigationsCreated++
    }
}

Write-Host ""
Write-Host "✓ TenantGuard-Investigations: $investigationsCreated/16 columns" -ForegroundColor $SuccessColor
Write-Host ""

# ============================================================
# Summary
# ============================================================
$totalCreated = $alertsCreated + $correlationsCreated + $investigationsCreated
$totalExpected = 49

Write-Host "╔════════════════════════════════════════════════════════╗" -ForegroundColor $InfoColor
Write-Host "║  SUMMARY                                               ║" -ForegroundColor $InfoColor
Write-Host "╚════════════════════════════════════════════════════════╝" -ForegroundColor $InfoColor
Write-Host ""
Write-Host "Total Columns Created: $totalCreated/$totalExpected" -ForegroundColor $(if ($totalCreated -eq $totalExpected) { $SuccessColor } else { $WarningColor })
Write-Host ""
Write-Host "List Details:" -ForegroundColor $InfoColor
Write-Host "  • TenantGuard-Alerts: $alertsCreated/17" -ForegroundColor $(if ($alertsCreated -eq 17) { $SuccessColor } else { $WarningColor })
Write-Host "  • TenantGuard-Correlations: $correlationsCreated/16" -ForegroundColor $(if ($correlationsCreated -eq 16) { $SuccessColor } else { $WarningColor })
Write-Host "  • TenantGuard-Investigations: $investigationsCreated/16" -ForegroundColor $(if ($investigationsCreated -eq 16) { $SuccessColor } else { $WarningColor })
Write-Host ""

if ($totalCreated -eq $totalExpected) {
    Write-Host "✓ All columns created successfully!" -ForegroundColor $SuccessColor
    Write-Host ""
    Write-Host "Next steps:" -ForegroundColor $InfoColor
    Write-Host "  1. Verify columns in SharePoint" -ForegroundColor $InfoColor
    Write-Host "  2. Update .env with configuration" -ForegroundColor $InfoColor
    Write-Host "  3. Restart backend: npm run server" -ForegroundColor $InfoColor
    Write-Host "  4. Test TenantGuard dashboard" -ForegroundColor $InfoColor
} else {
    Write-Host "⚠️ Some columns failed to create" -ForegroundColor $WarningColor
    Write-Host "Check the errors above and retry" -ForegroundColor $WarningColor
}

Write-Host ""
Write-Host "Disconnecting..." -ForegroundColor $InfoColor
Disconnect-PnPOnline
Write-Host "✓ Done" -ForegroundColor $SuccessColor
