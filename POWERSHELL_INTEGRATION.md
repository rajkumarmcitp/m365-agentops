# PowerShell Integration for Distribution Groups

**Goal**: Use Exchange Online PowerShell to create/manage Distribution Groups from Node.js backend

---

## 📦 **Step 1: Install PowerShell Modules**

### **On Windows Server / Azure VM**

```powershell
# Run PowerShell as Administrator

# Install Exchange Online Management module
Install-Module -Name ExchangeOnlineManagement -Force -AllowClobber

# Verify installation
Get-Module ExchangeOnlineManagement -ListAvailable

# Should output:
# ModuleType Version    Name                                ExportedCommands
# ---------- -------    ----                                ----------------
# Binary     3.0.0      ExchangeOnlineManagement            {Get-User, New-DistributionGroup, ...}
```

### **On macOS / Linux (via WSL or Docker)**

```bash
# Install PowerShell first
brew install powershell  # macOS
# or use Docker for Linux

# Then run PowerShell commands
pwsh -Command "Install-Module -Name ExchangeOnlineManagement -Force"
```

---

## 🔐 **Step 2: Authentication Setup**

### **Option A: Service Principal (Recommended for Automation)**

```powershell
# In PowerShell - Create app password
$ClientId = "YOUR_APP_ID"
$ClientSecret = "YOUR_APP_SECRET"
$TenantId = "YOUR_TENANT_ID"

$SecurePassword = ConvertTo-SecureString $ClientSecret -AsPlainText -Force
$Credential = New-Object System.Management.Automation.PSCredential($ClientId, $SecurePassword)

Connect-ExchangeOnline -AppId $ClientId `
  -CertificateThumbprint $CertThumbprint `
  -Organization $TenantId `
  -CommandName "New-DistributionGroup", "Add-DistributionGroupMember", "Remove-DistributionGroupMember", "Set-DistributionGroup"
```

### **Option B: Credentials File (Easier for Testing)**

```powershell
# Store credentials securely
$Credential = Get-Credential
$Credential | Export-Clixml -Path "C:\Scripts\creds.xml"

# Later, use them
$Credential = Import-Clixml -Path "C:\Scripts\creds.xml"
Connect-ExchangeOnline -Credential $Credential
```

---

## 🛠️ **Step 3: PowerShell Script for Distribution Groups**

### **Create file: `/Scripts/manage-dg.ps1`**

```powershell
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
    [string]$ManagedBy,
    
    [Parameter(Mandatory=$false)]
    [string]$CredsPath = "C:\Scripts\creds.xml"
)

# Import credentials
$Credential = Import-Clixml -Path $CredsPath

try {
    # Connect to Exchange Online
    Connect-ExchangeOnline -Credential $Credential -SkipLoadingFormatData -WarningAction SilentlyContinue
    
    switch ($Action) {
        "create-dg" {
            Write-Host "📧 Creating Distribution Group: $DisplayName"
            
            # Create the DG
            New-DistributionGroup -Name $DisplayName `
                -Alias $Alias `
                -ManagedBy $ManagedBy `
                -ErrorAction Stop
            
            Write-Host "✅ Distribution Group created: $DisplayName"
            
            # Add members if provided
            if ($Members) {
                $MemberList = $Members -split ',' | ForEach-Object { $_.Trim() }
                foreach ($Member in $MemberList) {
                    try {
                        Add-DistributionGroupMember -Identity $Alias `
                            -Member $Member `
                            -ErrorAction Stop
                        Write-Host "✅ Added member: $Member"
                    }
                    catch {
                        Write-Host "⚠️  Failed to add member $Member : $_"
                    }
                }
            }
            
            # Return success
            @{
                success = $true
                groupName = $DisplayName
                alias = $Alias
                message = "Distribution Group created successfully"
            } | ConvertTo-Json
        }
        
        "add-members" {
            Write-Host "📧 Adding members to: $DisplayName"
            
            $MemberList = $Members -split ',' | ForEach-Object { $_.Trim() }
            $Added = @()
            $Failed = @()
            
            foreach ($Member in $MemberList) {
                try {
                    Add-DistributionGroupMember -Identity $Alias `
                        -Member $Member `
                        -ErrorAction Stop
                    Write-Host "✅ Added: $Member"
                    $Added += $Member
                }
                catch {
                    Write-Host "⚠️  Failed: $Member - $_"
                    $Failed += @{ email = $Member; reason = $_.Exception.Message }
                }
            }
            
            @{
                success = ($Failed.Count -eq 0)
                addedMembers = $Added
                failedMembers = $Failed
                summary = "Added $($Added.Count)/$($MemberList.Count) members"
            } | ConvertTo-Json
        }
        
        "remove-members" {
            Write-Host "📧 Removing members from: $DisplayName"
            
            $MemberList = $Members -split ',' | ForEach-Object { $_.Trim() }
            $Removed = @()
            $Failed = @()
            
            foreach ($Member in $MemberList) {
                try {
                    Remove-DistributionGroupMember -Identity $Alias `
                        -Member $Member `
                        -Confirm:$false `
                        -ErrorAction Stop
                    Write-Host "✅ Removed: $Member"
                    $Removed += $Member
                }
                catch {
                    Write-Host "⚠️  Failed: $Member - $_"
                    $Failed += @{ email = $Member; reason = $_.Exception.Message }
                }
            }
            
            @{
                success = ($Failed.Count -eq 0)
                removedMembers = $Removed
                failedMembers = $Failed
                summary = "Removed $($Removed.Count)/$($MemberList.Count) members"
            } | ConvertTo-Json
        }
        
        "delete-dg" {
            Write-Host "📧 Deleting Distribution Group: $DisplayName"
            
            Remove-DistributionGroup -Identity $Alias `
                -Confirm:$false `
                -ErrorAction Stop
            
            Write-Host "✅ Distribution Group deleted: $DisplayName"
            
            @{
                success = $true
                message = "Distribution Group deleted successfully"
            } | ConvertTo-Json
        }
    }
}
catch {
    Write-Host "❌ Error: $_"
    @{
        success = $false
        error = $_.Exception.Message
    } | ConvertTo-Json
}
finally {
    # Disconnect from Exchange Online
    Disconnect-ExchangeOnline -Confirm:$false -WarningAction SilentlyContinue
}
```

---

## 🔌 **Step 4: Node.js Integration**

### **Create `/backend/powershell-handler.js`**

```javascript
const { spawn } = require('child_process');
const path = require('path');

// Path to PowerShell script
const PS_SCRIPT = path.join(__dirname, '../Scripts/manage-dg.ps1');
const CREDS_PATH = process.env.PS_CREDS_PATH || 'C:\\Scripts\\creds.xml';

/**
 * Execute PowerShell script for Distribution Group operations
 */
async function executeDistributionGroupCommand(action, params) {
  return new Promise((resolve, reject) => {
    const args = [
      '-NoProfile',
      '-ExecutionPolicy', 'Bypass',
      '-File', PS_SCRIPT,
      '-Action', action,
      '-CredsPath', CREDS_PATH
    ];

    // Add parameters
    if (params.displayName) args.push('-DisplayName', params.displayName);
    if (params.alias) args.push('-Alias', params.alias);
    if (params.members) args.push('-Members', params.members);
    if (params.managedBy) args.push('-ManagedBy', params.managedBy);

    console.log(`🔌 Executing PowerShell: ${action}`);

    const ps = spawn('powershell.exe', args, {
      stdio: ['pipe', 'pipe', 'pipe']
    });

    let stdout = '';
    let stderr = '';

    ps.stdout.on('data', (data) => {
      stdout += data.toString();
      console.log(`PS: ${data.toString()}`);
    });

    ps.stderr.on('data', (data) => {
      stderr += data.toString();
      console.error(`PS Error: ${data.toString()}`);
    });

    ps.on('close', (code) => {
      try {
        // Try to parse JSON output from PowerShell
        const result = JSON.parse(stdout);
        if (result.success) {
          console.log(`✅ PowerShell succeeded: ${action}`);
          resolve(result);
        } else {
          console.error(`❌ PowerShell failed: ${result.error}`);
          reject(new Error(result.error));
        }
      } catch (e) {
        console.error(`❌ Failed to parse PowerShell output: ${stdout}`);
        reject(new Error(`PowerShell execution failed: ${stderr || stdout}`));
      }
    });

    ps.on('error', (err) => {
      console.error(`❌ PowerShell spawn error: ${err.message}`);
      reject(err);
    });
  });
}

module.exports = {
  executeDistributionGroupCommand
};
```

---

## 🔄 **Step 5: Update Provisioning Engine**

### **Replace the mock `createDistributionGroup()` with PowerShell call**

```javascript
// In backend/provisioning-engine.js

const { executeDistributionGroupCommand } = require('./powershell-handler');

async function createDistributionGroup(formData) {
  const { displayName, alias, members, managedBy } = formData

  try {
    if (!displayName || !alias) {
      throw new Error('displayName and alias are required')
    }

    // Call PowerShell script
    const result = await executeDistributionGroupCommand('create-dg', {
      displayName,
      alias,
      members,
      managedBy
    })

    return {
      operation: 'Create Distribution Group',
      status: 'completed',
      displayName: result.groupName,
      alias: result.alias,
      addedMembers: result.addedMembers,
      failedMembers: result.failedMembers,
      message: result.message
    }
  } catch (error) {
    throw new Error(`Failed to create distribution group: ${error.message}`)
  }
}

async function modifyDistributionGroup(formData) {
  // Similar implementation...
}

async function deleteDistributionGroup(formData) {
  const { groupName } = formData

  try {
    const result = await executeDistributionGroupCommand('delete-dg', {
      displayName: groupName,
      alias: groupName.toLowerCase().replace(/\s+/g, '-')
    })

    return {
      operation: 'Delete Distribution Group',
      status: 'completed',
      message: result.message
    }
  } catch (error) {
    throw new Error(`Failed to delete distribution group: ${error.message}`)
  }
}
```

---

## 📋 **Step 6: Environment Setup**

### **Create `.env` file**

```bash
# PowerShell credentials path
PS_CREDS_PATH=C:\Scripts\creds.xml

# Or use Service Principal
PS_CLIENT_ID=your-app-id
PS_CLIENT_SECRET=your-app-secret
PS_TENANT_ID=your-tenant-id
```

---

## 🚀 **Step 7: Deployment (Docker/Container)**

### **Update `Dockerfile`**

```dockerfile
# Use Windows Server with PowerShell Core
FROM mcr.microsoft.com/windows/servercore:ltsc2022

# Install PowerShell
RUN powershell -Command \
    $ProgressPreference = 'SilentlyContinue'; \
    Invoke-WebRequest -Uri https://github.com/PowerShell/PowerShell/releases/download/v7.3.0/PowerShell-7.3.0-win-x64.msi \
    -OutFile PowerShell.msi; \
    msiexec.exe /i PowerShell.msi /quiet; \
    Remove-Item PowerShell.msi

# Install Exchange Online Management module
RUN powershell -Command \
    Install-Module -Name ExchangeOnlineManagement -Force -AllowClobber -Scope AllUsers

# Copy application
COPY . /app
WORKDIR /app

# Copy PowerShell scripts
COPY Scripts /Scripts

# Install Node.js dependencies
RUN npm install

# Expose port
EXPOSE 3000

# Start app
CMD ["node", "backend/server.js"]
```

---

## ✅ **Testing**

### **Test PowerShell Script Directly**

```powershell
# Run PowerShell script manually
.\Scripts\manage-dg.ps1 -Action create-dg `
  -DisplayName "Test DG" `
  -Alias "test-dg" `
  -Members "user1@contoso.com, user2@contoso.com" `
  -ManagedBy "admin@contoso.com"

# Should output JSON:
# {
#   "success": true,
#   "groupName": "Test DG",
#   "alias": "test-dg",
#   "message": "Distribution Group created successfully"
# }
```

### **Test via Node.js**

```javascript
const { executeDistributionGroupCommand } = require('./powershell-handler');

async function test() {
  try {
    const result = await executeDistributionGroupCommand('create-dg', {
      displayName: 'Test DG',
      alias: 'test-dg',
      members: 'user1@contoso.com',
      managedBy: 'admin@contoso.com'
    });
    console.log('✅ Success:', result);
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

test();
```

---

## 📋 **Checklist**

- [ ] Install ExchangeOnlineManagement PowerShell module
- [ ] Create PowerShell script (`/Scripts/manage-dg.ps1`)
- [ ] Create Node.js handler (`/backend/powershell-handler.js`)
- [ ] Update provisioning engine to use PowerShell handler
- [ ] Create `.env` file with credentials path
- [ ] Test PowerShell script directly
- [ ] Test via Node.js backend
- [ ] Deploy to production
- [ ] Test Distribution Group creation

---

## 🎯 **Expected Result**

After this setup:

```
Form Submission
    ↓
Node.js Backend
    ↓
PowerShell Handler
    ↓
Execute PowerShell Script
    ↓
Connect to Exchange Online
    ↓
Create Distribution Group
    ↓
Return JSON Result
    ↓
Dashboard Shows "Completed" ✅
    ↓
Group Exists in Microsoft 365 ✅
```

---

**Ready to implement this?** Let me know and I can help with the code updates! 🚀
