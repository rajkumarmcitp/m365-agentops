# Option B Implementation: Exchange DG + Reusable Template

**Goal**: Create working Distribution Group runbook + Node.js handler pattern to replicate for all 11 services

**Timeline**: This week (5 days)

---

## 📋 **Step-by-Step Implementation**

### **DAY 1: Set Up Azure Automation Account & Runbook**

#### **Step 1.1: Create Automation Account (if not exists)**

```
Azure Portal:
  1. Search: "Automation Accounts"
  2. Click "Create"
  3. Fill in:
     - Name: m365-ops-automation
     - Resource Group: your-resource-group
     - Region: Same as your other services
     - Create Azure Run As Account: YES
  4. Click "Create"
  5. Wait 5-10 minutes for deployment
```

#### **Step 1.2: Import Required Modules**

```
Automation Account:
  1. Left menu → "Modules"
  2. Click "Browse Gallery"
  3. Search and click "Import" for each:
     - ExchangeOnlineManagement
     - Microsoft.Graph (for future use)
     - Microsoft.Graph.Authentication
  4. Click "Import" button
  5. Wait for each to complete (5-10 min each)
```

**Verify Modules Imported:**
```
Automation Account → Modules
Should see:
  ✅ ExchangeOnlineManagement
  ✅ Microsoft.Graph
  ✅ Microsoft.Graph.Authentication
  ✅ Az.Accounts (comes with automation)
```

#### **Step 1.3: Set Up Managed Identity**

```
Automation Account:
  1. Left menu → "Identity"
  2. Status: "ON"
  3. Click "Azure role assignments"
  4. Click "Add role assignment"
  5. Fill in:
     - Scope: Subscription
     - Role: Contributor
     - Members: Select your automation account
  6. Click "Save"
```

#### **Step 1.4: Create First Runbook**

```
Automation Account:
  1. Left menu → "Runbooks"
  2. Click "Create a runbook"
  3. Fill in:
     - Name: Exchange-DistributionGroups
     - Runbook type: PowerShell
     - Runtime version: 7.2
  4. Click "Create"
  5. You'll see the PowerShell editor
```

---

### **DAY 2: Add PowerShell Code to Runbook**

#### **Step 2.1: Copy PowerShell Runbook Code**

Open the runbook editor and paste this code:

```powershell
# ============================================================
# Azure Automation Runbook: Exchange-DistributionGroups
# Purpose: Create, modify, add/remove members in Distribution Groups
# ============================================================

param(
    [Parameter(Mandatory=$true)]
    [string]$Action,
    
    [Parameter(Mandatory=$false)]
    [string]$DisplayName,
    
    [Parameter(Mandatory=$false)]
    [string]$Alias,
    
    [Parameter(Mandatory=$false)]
    [string]$Members,
    
    [Parameter(Mandatory=$false)]
    [string]$ManagedBy
)

Write-Output "========================================="
Write-Output "Exchange Distribution Groups Runbook"
Write-Output "Action: $Action"
Write-Output "========================================="

try {
    # Step 1: Import required modules
    Write-Output "📦 Importing ExchangeOnlineManagement module..."
    Import-Module ExchangeOnlineManagement -WarningAction SilentlyContinue
    
    # Step 2: Get the Managed Identity
    Write-Output "🔐 Authenticating with Managed Identity..."
    
    # For Automation Account Managed Identity
    $connection = Get-AutomationConnection -Name AzureRunAsConnection -ErrorAction Stop
    
    # Connect using certificate (comes with Automation Account)
    Add-AzAccount -ServicePrincipal `
        -TenantId $connection.TenantId `
        -ApplicationId $connection.ApplicationId `
        -CertificateThumbprint $connection.CertificateThumbprint | Out-Null
    
    # Step 3: Connect to Exchange Online
    Write-Output "🔌 Connecting to Exchange Online..."
    Connect-ExchangeOnline -ManagedIdentity -Organization $env:TENANT_ID -SkipLoadingFormatData -WarningAction SilentlyContinue
    
    # Step 4: Execute the requested action
    $result = $null
    
    if ($Action -eq "create") {
        Write-Output "📧 Creating Distribution Group: $DisplayName"
        
        if (-not $DisplayName -or -not $Alias) {
            throw "DisplayName and Alias are required for create action"
        }
        
        # Create the distribution group
        New-DistributionGroup `
            -Name $DisplayName `
            -Alias $Alias.ToLower().Replace(' ', '-') `
            -ManagedBy $ManagedBy `
            -WarningAction SilentlyContinue
        
        Write-Output "✅ Distribution Group created: $DisplayName"
        
        # Add members if provided
        $addedMembers = @()
        $failedMembers = @()
        
        if ($Members) {
            Write-Output "👥 Adding members..."
            $MemberList = $Members -split ',' | ForEach-Object { $_.Trim() }
            
            foreach ($Member in $MemberList) {
                try {
                    Add-DistributionGroupMember `
                        -Identity $Alias.ToLower().Replace(' ', '-') `
                        -Member $Member `
                        -ErrorAction Stop `
                        -WarningAction SilentlyContinue
                    
                    Write-Output "  ✅ Added: $Member"
                    $addedMembers += $Member
                }
                catch {
                    Write-Output "  ⚠️  Failed: $Member - $($_.Exception.Message)"
                    $failedMembers += @{email = $Member; reason = $_.Exception.Message}
                }
            }
        }
        
        # Build response
        $result = @{
            success = $true
            action = "create"
            groupName = $DisplayName
            alias = $Alias.ToLower().Replace(' ', '-')
            addedMembers = $addedMembers
            failedMembers = if ($failedMembers.Count -gt 0) { $failedMembers } else { $null }
            message = "Distribution Group created successfully"
        }
    }
    
    elseif ($Action -eq "add-members") {
        Write-Output "👥 Adding members to: $DisplayName"
        
        if (-not $DisplayName -or -not $Members) {
            throw "DisplayName and Members are required for add-members action"
        }
        
        $addedMembers = @()
        $failedMembers = @()
        $MemberList = $Members -split ',' | ForEach-Object { $_.Trim() }
        
        foreach ($Member in $MemberList) {
            try {
                Add-DistributionGroupMember `
                    -Identity $DisplayName `
                    -Member $Member `
                    -ErrorAction Stop `
                    -WarningAction SilentlyContinue
                
                Write-Output "  ✅ Added: $Member"
                $addedMembers += $Member
            }
            catch {
                Write-Output "  ⚠️  Failed: $Member - $($_.Exception.Message)"
                $failedMembers += @{email = $Member; reason = $_.Exception.Message}
            }
        }
        
        $result = @{
            success = ($failedMembers.Count -eq 0)
            action = "add-members"
            groupName = $DisplayName
            addedMembers = $addedMembers
            failedMembers = if ($failedMembers.Count -gt 0) { $failedMembers } else { $null }
            message = "Added $($addedMembers.Count) members"
        }
    }
    
    elseif ($Action -eq "delete") {
        Write-Output "🗑️  Deleting Distribution Group: $DisplayName"
        
        if (-not $DisplayName) {
            throw "DisplayName is required for delete action"
        }
        
        Remove-DistributionGroup -Identity $DisplayName -Confirm:$false -WarningAction SilentlyContinue
        
        Write-Output "✅ Distribution Group deleted: $DisplayName"
        
        $result = @{
            success = $true
            action = "delete"
            groupName = $DisplayName
            message = "Distribution Group deleted successfully"
        }
    }
    
    else {
        throw "Unknown action: $Action. Supported: create, add-members, delete"
    }
    
    # Step 5: Return result as JSON
    Write-Output "========================================="
    Write-Output "✅ SUCCESS - Returning result..."
    Write-Output "========================================="
    
    $result | ConvertTo-Json -Depth 3
}

catch {
    Write-Output "========================================="
    Write-Output "❌ ERROR OCCURRED"
    Write-Output "========================================="
    Write-Output $_.Exception.Message
    
    $errorResult = @{
        success = $false
        action = $Action
        error = $_.Exception.Message
        timestamp = (Get-Date).ToIso8601String()
    }
    
    $errorResult | ConvertTo-Json -Depth 3
    
    throw $_
}

finally {
    # Always disconnect
    Write-Output "Disconnecting from Exchange Online..."
    Disconnect-ExchangeOnline -Confirm:$false -WarningAction SilentlyContinue
}
```

#### **Step 2.2: Save and Test Runbook**

```
Runbook Editor:
  1. Click "Save"
  2. Click "Publish"
  3. Click "Test pane"
  4. Fill in parameters:
     - Action: create
     - DisplayName: Test DG
     - Alias: test-dg
     - Members: user1@contoso.com
     - ManagedBy: admin@contoso.com
  5. Click "Start"
  6. Watch the output - should see ✅ SUCCESS
```

**Expected Test Output:**
```
=========================================
Exchange Distribution Groups Runbook
Action: create
=========================================
📦 Importing ExchangeOnlineManagement module...
🔐 Authenticating with Managed Identity...
🔌 Connecting to Exchange Online...
📧 Creating Distribution Group: Test DG
✅ Distribution Group created: Test DG
👥 Adding members...
  ✅ Added: user1@contoso.com
=========================================
✅ SUCCESS - Returning result...
=========================================
{
  "success": true,
  "action": "create",
  "groupName": "Test DG",
  "alias": "test-dg",
  "addedMembers": ["user1@contoso.com"],
  "failedMembers": null,
  "message": "Distribution Group created successfully"
}
```

---

### **DAY 3: Create Webhook & Node.js Handler**

#### **Step 3.1: Create Webhook for Runbook**

```
Runbook:
  1. Left menu → "Webhooks"
  2. Click "Add Webhook"
  3. Fill in:
     - Name: Exchange-DG-Webhook
     - Enabled: YES
     - Expires: 5 years (or your preference)
  4. Click "Create"
  5. COPY the URL (you'll need this!)
  
Example URL:
https://eus2-v2.azure-automation.net/webhooks?token=ABC123...
```

#### **Step 3.2: Create Node.js Handler File**

Create file: `backend/automation-handler.js`

```javascript
/**
 * Azure Automation Runbook Handler
 * 
 * Provides unified interface for calling Azure Automation Runbooks
 * Same pattern used for all 11 services
 */

const axios = require('axios');

// Environment variables for webhook URLs
// Set these in .env or Azure App Service settings:
// AUTOMATION_EXCHANGE_DG_WEBHOOK=https://eus2-v2.azure-automation.net/...
// AUTOMATION_TEAMS_WEBHOOK=https://...
// AUTOMATION_SHAREPOINT_WEBHOOK=https://...
// etc.

/**
 * Call an Azure Automation Runbook via webhook
 * 
 * @param {string} serviceName - Service name (e.g., 'Exchange-DG', 'Teams-Operations')
 * @param {object} params - Parameters to pass to runbook
 * @returns {Promise<object>} - Result from runbook
 * 
 * Usage:
 *   const result = await callAutomationRunbook('Exchange-DG', {
 *     action: 'create',
 *     displayName: 'Test Group',
 *     alias: 'test-group',
 *     members: 'user@contoso.com',
 *     managedBy: 'admin@contoso.com'
 *   });
 */
async function callAutomationRunbook(serviceName, params) {
  // Get webhook URL from environment
  const envVar = `AUTOMATION_${serviceName.toUpperCase().replace('-', '_')}_WEBHOOK`;
  const webhookUrl = process.env[envVar];
  
  if (!webhookUrl) {
    throw new Error(`Webhook URL not configured for service: ${serviceName}. Set ${envVar} in environment.`);
  }
  
  try {
    console.log(`🔌 Calling Azure Automation Runbook: ${serviceName}`);
    console.log(`   Parameters:`, params);
    
    // Call the webhook
    const response = await axios.post(webhookUrl, params, {
      headers: {
        'Content-Type': 'application/json'
      },
      timeout: 60000  // 60 second timeout (runbooks can be slow)
    });
    
    // Parse response
    let result;
    
    if (typeof response.data === 'string') {
      // Sometimes runbook returns JSON as string
      result = JSON.parse(response.data);
    } else {
      result = response.data;
    }
    
    // Check for success
    if (result.success === false) {
      throw new Error(`Runbook reported failure: ${result.error}`);
    }
    
    console.log(`✅ Success: ${serviceName}`);
    console.log(`   Result:`, result);
    
    return result;
    
  } catch (error) {
    console.error(`❌ Automation Runbook Error: ${serviceName}`);
    console.error(`   Error:`, error.message);
    throw error;
  }
}

module.exports = {
  callAutomationRunbook
};
```

#### **Step 3.3: Set Environment Variable**

Create/update `.env` file:

```bash
# Azure Automation Webhook URLs
AUTOMATION_EXCHANGE_DG_WEBHOOK=https://eus2-v2.azure-automation.net/webhooks?token=YOUR_TOKEN_HERE

# (Add other services as you create them)
# AUTOMATION_TEAMS_WEBHOOK=...
# AUTOMATION_SHAREPOINT_WEBHOOK=...
# etc.
```

---

### **DAY 4: Wire Up Provisioning Engine**

#### **Step 4.1: Update Provisioning Engine**

Edit file: `backend/provisioning-engine.js`

Replace the existing `createDistributionGroup()` function with:

```javascript
// Import the automation handler
const { callAutomationRunbook } = require('./automation-handler');

async function createDistributionGroup(formData) {
  const { displayName, alias, members, managedBy } = formData;

  try {
    if (!displayName || !alias) {
      throw new Error('displayName and alias are required');
    }

    console.log(`🎯 Creating Distribution Group via Azure Automation`);
    
    // Call Azure Automation Runbook
    const result = await callAutomationRunbook('Exchange-DG', {
      action: 'create',
      displayName,
      alias,
      members: members || '',  // Members are optional
      managedBy: managedBy || ''  // Owner is optional
    });

    // Transform result for dashboard
    return {
      operation: 'Create Distribution Group',
      status: 'completed',
      displayName: result.groupName,
      alias: result.alias,
      addedMembers: result.addedMembers,
      failedMembers: result.failedMembers,
      message: result.message
    };
    
  } catch (error) {
    console.error(`❌ Failed to create distribution group:`, error.message);
    throw new Error(`Failed to create distribution group: ${error.message}`);
  }
}

// Export the function
module.exports = { createDistributionGroup };
```

Also update other DG functions:

```javascript
async function modifyDistributionGroup(formData) {
  const { currentName, newName, newAlias, changeOwner } = formData;

  try {
    console.log(`🎯 Modifying Distribution Group via Azure Automation`);
    
    // Call automation (you'll create this runbook later)
    const result = await callAutomationRunbook('Exchange-DG', {
      action: 'modify',
      displayName: currentName,
      newName: newName || '',
      newAlias: newAlias || '',
      changeOwner: changeOwner || ''
    });

    return {
      operation: 'Modify Distribution Group',
      status: 'completed',
      message: result.message
    };
    
  } catch (error) {
    throw new Error(`Failed to modify distribution group: ${error.message}`);
  }
}

async function deleteDistributionGroup(formData) {
  const { groupName } = formData;

  try {
    console.log(`🎯 Deleting Distribution Group via Azure Automation`);
    
    const result = await callAutomationRunbook('Exchange-DG', {
      action: 'delete',
      displayName: groupName
    });

    return {
      operation: 'Delete Distribution Group',
      status: 'completed',
      message: result.message
    };
    
  } catch (error) {
    throw new Error(`Failed to delete distribution group: ${error.message}`);
  }
}
```

---

### **DAY 5: End-to-End Testing**

#### **Step 5.1: Manual Test in Portal**

```
1. Open Self Service Portal
2. Go to: Exchange → Groups → Create Distribution Group
3. Fill in:
   - Display Name: "Test DG Creation"
   - Email Alias: "test-dg-creation"
   - Members: user1@contoso.com
   - Owner: admin@contoso.com
   - Justification: "Testing Azure Automation integration"
4. Click Submit
5. Go to Admin Dashboard
6. Check "Requests" section
7. Find your request
8. Verify Status shows "Completed" ✅
```

#### **Step 5.2: Verify in Exchange**

```
1. Go to Microsoft 365 Admin Center
2. Teams & Groups → Active teams & groups
3. Search for "Test DG Creation"
4. Verify:
   ✅ Group exists
   ✅ Email is correct
   ✅ Members are added
   ✅ Owner is set correctly
```

#### **Step 5.3: Check Logs**

```
Azure Automation:
  1. Runbook → "Exchange-DistributionGroups"
  2. Click "All Logs"
  3. Should see green SUCCESS status
  4. Output should show:
     ✅ Modules imported
     ✅ Exchange connection
     ✅ Group created
     ✅ Members added
     ✅ JSON result returned
```

---

## 📄 **Template for Other 10 Services**

### **How to Replicate for Teams, SharePoint, etc.**

Once Exchange-DG is working, follow this pattern for each service:

```
1. Create new Automation Runbook
   Name: {Service-Name}-Operations
   Runtime: PowerShell 7.2
   
2. Copy the code structure from Exchange-DG
   Replace:
   - Import-Module ExchangeOnlineManagement
   With:
   - Import-Module MicrosoftTeams (or PnP.PowerShell, etc.)
   
   Replace:
   - $Action -eq "create"
   With service-specific operations
   
3. Create webhook
4. Add webhook URL to .env
5. Update provisioning engine function
6. Test in portal
7. Verify in service (Teams, SharePoint, etc.)
```

### **Service-Specific Modules**

| Service | Module | Runbook Name |
|---------|--------|--------------|
| Distribution Groups | ExchangeOnlineManagement | Exchange-DG |
| Shared Mailboxes | ExchangeOnlineManagement | Exchange-SharedMailbox |
| Teams | MicrosoftTeams | Teams-Operations |
| SharePoint | PnP.PowerShell | SharePoint-Sites |
| Licenses | Microsoft.Graph | License-Management |
| Copilot | Microsoft.Graph | Copilot-Management |
| Intune | Microsoft.Graph.Intune | Intune-Devices |
| Power Platform | Microsoft.PowerApps | PowerPlatform-Ops |
| OneDrive | PnP.PowerShell | OneDrive-Management |
| External Sharing | PnP.PowerShell | ExternalSharing-Ops |
| Guest Lifecycle | Microsoft.Graph | Guest-Lifecycle |

---

## ✅ **Success Checklist**

- [ ] Day 1: Azure Automation account created
- [ ] Day 1: Modules imported
- [ ] Day 1: Managed Identity configured
- [ ] Day 1: Runbook created
- [ ] Day 2: PowerShell code added
- [ ] Day 2: Runbook tested in Azure
- [ ] Day 2: Test passed (group created)
- [ ] Day 3: Webhook created
- [ ] Day 3: automation-handler.js created
- [ ] Day 3: Environment variable set
- [ ] Day 4: Provisioning engine updated
- [ ] Day 4: Code tested locally
- [ ] Day 5: Portal end-to-end test
- [ ] Day 5: Verified in Exchange Admin Center
- [ ] Day 5: Azure logs show success

---

## 🚀 **Next: Scale to 10 More Services**

Once this is working:

**Week 2**: Add Shared Mailboxes, Rooms, Email Services (Exchange family)
**Week 3**: Add Teams, SharePoint, OneDrive
**Week 4**: Add Licenses, Copilot, Intune, Power Platform, Guest Lifecycle

Each uses the SAME pattern → Should be quick!

---

**Ready to implement Day 1?** Let me know if you get stuck! 🎯
