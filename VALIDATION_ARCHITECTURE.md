# Hybrid Validation System - Architecture Diagram

## System Overview

```
┌─────────────────────────────────────────────────────────────────────┐
│                       FRONTEND LAYER                                 │
├─────────────────────────────────────────────────────────────────────┤
│                                                                       │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │ pages/validation-settings.js                                 │  │
│  │ ├─ Validation Method Selection (Radio Buttons)              │  │
│  │ │  ├─ Graph API                                             │  │
│  │ │  ├─ PowerShell                                            │  │
│  │ │  └─ Hybrid (Recommended)                                  │  │
│  │ ├─ PowerShell Configuration                                │  │
│  │ ├─ Performance Settings (Timeout, Retries)                 │  │
│  │ ├─ Validation Summary (Last Run Stats)                     │  │
│  │ ├─ Custom Control Methods                                  │  │
│  │ └─ Action Buttons (Save, Reset)                            │  │
│  └──────────────────────────────────────────────────────────────┘  │
│                                                                       │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │ components/validation-method-badge.js                        │  │
│  │ ├─ ValidationMethodBadge (G/P/F indicator)                  │  │
│  │ ├─ ValidationExecutionDetails (Time, Endpoint, Command)     │  │
│  │ └─ ValidationMethodSummary (Stats Grid)                     │  │
│  └──────────────────────────────────────────────────────────────┘  │
│                                                                       │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │ CIS Dashboard / Control Details Modal                        │  │
│  │ ├─ Validation Method Badge                                  │  │
│  │ ├─ Execution Time                                           │  │
│  │ ├─ Fallback Indicator                                       │  │
│  │ └─ Validation Summary                                       │  │
│  └──────────────────────────────────────────────────────────────┘  │
│                                                                       │
└─────────────────────────────────────────────────────────────────────┘
                                  │
                    (HTTP / REST API Calls)
                                  ▼
┌─────────────────────────────────────────────────────────────────────┐
│                       API LAYER (backend/server.js)                  │
├─────────────────────────────────────────────────────────────────────┤
│                                                                       │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │ Configuration Endpoints                                      │   │
│  │ ├─ GET    /api/config/validation-settings                   │   │
│  │ ├─ POST   /api/config/validation-settings                   │   │
│  │ ├─ GET    /api/config/validation-methods                    │   │
│  │ ├─ POST   /api/config/validation-methods/:controlId         │   │
│  │ ├─ DELETE /api/config/validation-methods/:controlId         │   │
│  │ ├─ POST   /api/config/powershell-enable                     │   │
│  │ └─ POST   /api/config/validation-reset                      │   │
│  └─────────────────────────────────────────────────────────────┘   │
│                                                                       │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │ Validation Data Endpoints                                    │   │
│  │ ├─ GET    /api/validation/summary                           │   │
│  │ └─ GET    /api/validation/metadata                          │   │
│  └─────────────────────────────────────────────────────────────┘   │
│                                                                       │
└─────────────────────────────────────────────────────────────────────┘
                                  │
                        (Function Calls)
                                  ▼
┌─────────────────────────────────────────────────────────────────────┐
│                    VALIDATION ENGINE LAYER                           │
├─────────────────────────────────────────────────────────────────────┤
│                                                                       │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │ backend/cis-validator.js                                     │  │
│  │ ├─ validateAllCISControls()                                 │  │
│  │ │  ├─ Reset validation state                               │  │
│  │ │  ├─ Check cache                                          │  │
│  │ │  ├─ Fetch all Graph API data in parallel                │  │
│  │ │  ├─ Build CIS Topics with method metadata               │  │
│  │ │  ├─ Get validation summary                              │  │
│  │ │  └─ Cache result                                        │  │
│  │ └─ getValidationMethodSummary()                            │  │
│  │ └─ getValidationMetadata()                                │  │
│  └──────────────────────────────────────────────────────────────┘  │
│                                                                       │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │ backend/hybrid-validator.js                                  │  │
│  │ ├─ validateWithHybridApproach()           [Main Entry]      │  │
│  │ │  ├─ Get validation method for control                    │  │
│  │ │  └─ Route to appropriate validator                       │  │
│  │ ├─ validateWithGraphAPI()                 [Path 1]         │  │
│  │ │  ├─ Execute Graph API validator                         │  │
│  │ │  ├─ Record validation attempt                           │  │
│  │ │  └─ Return result with metadata                         │  │
│  │ ├─ validateWithPowerShell()               [Path 2]         │  │
│  │ │  ├─ Check if PowerShell enabled                         │  │
│  │ │  ├─ Execute PowerShell commands                         │  │
│  │ │  ├─ Parse PowerShell output                             │  │
│  │ │  ├─ Map to status (pass/fail/warn)                      │  │
│  │ │  ├─ Record validation attempt                           │  │
│  │ │  └─ Return result with metadata                         │  │
│  │ └─ validateWithHybridFallback()           [Path 3]         │  │
│  │    ├─ Try Graph API (with retries)                        │  │
│  │    │  └─ If success: return + record                      │  │
│  │    ├─ If all attempts fail & PS available                 │  │
│  │    │  ├─ Try PowerShell fallback                          │  │
│  │    │  ├─ If success: return + record fallback             │  │
│  │    │  └─ If fails: throw error                            │  │
│  │    └─ If all fail: propagate error                        │  │
│  └──────────────────────────────────────────────────────────────┘  │
│                                                                       │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │ backend/validation-config.js                                 │  │
│  │ ├─ getValidationConfig()                                    │  │
│  │ ├─ updateValidationConfig()                                 │  │
│  │ ├─ getValidationMethod(controlId)                           │  │
│  │ ├─ setControlValidationMethod()                             │  │
│  │ ├─ clearControlValidationMethod()                           │  │
│  │ ├─ isPowerShellEnabled()                                    │  │
│  │ ├─ setPowerShellEnabled()                                   │  │
│  │ ├─ getRetryConfig()                                         │  │
│  │ ├─ getCacheConfig()                                         │  │
│  │ └─ exportConfig()                                           │  │
│  └──────────────────────────────────────────────────────────────┘  │
│                                                                       │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │ backend/validation-state.js                                  │  │
│  │ ├─ recordValidationAttempt()          [Called during val]   │  │
│  │ ├─ getValidationMetadata()                                  │  │
│  │ ├─ getValidationSummary()                                   │  │
│  │ ├─ getFallbackControls()                                    │  │
│  │ ├─ getControlsByValidationMethod()                          │  │
│  │ └─ resetValidationState()              [Called on new run]  │  │
│  └──────────────────────────────────────────────────────────────┘  │
│                                                                       │
└─────────────────────────────────────────────────────────────────────┘
                                  │
                        (Function Calls)
                                  ▼
┌─────────────────────────────────────────────────────────────────────┐
│                    EXECUTION LAYER                                   │
├─────────────────────────────────────────────────────────────────────┤
│                                                                       │
│  ┌─────────────────────┐         ┌──────────────────────────┐       │
│  │   Graph API Path    │         │  PowerShell Path         │       │
│  │                     │         │                          │       │
│  │ Microsoft Graph     │         │  backend/powershell-     │       │
│  │ Client              │         │  executor.js             │       │
│  │                     │         │                          │       │
│  │ ├─ /directoryRoles  │         │  ├─ Connect-MgGraph     │       │
│  │ ├─ /policies        │         │  ├─ Get-MgUser          │       │
│  │ ├─ /devices         │         │  ├─ Get-MgTeam          │       │
│  │ ├─ /teams           │         │  ├─ Connect-ExchangeOn- │       │
│  │ ├─ /drives          │         │  │  line                 │       │
│  │ └─ /security/*      │         │  ├─ Get-TransportRule   │       │
│  │                     │         │  └─ PowerShell parsing   │       │
│  └─────────────────────┘         └──────────────────────────┘       │
│                                                                       │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │ Data Sources                                                 │   │
│  │ ├─ Azure AD                                                 │   │
│  │ ├─ Exchange Online                                          │   │
│  │ ├─ Teams                                                    │   │
│  │ ├─ SharePoint                                               │   │
│  │ ├─ Intune                                                   │   │
│  │ └─ Microsoft Defender                                       │   │
│  └─────────────────────────────────────────────────────────────┘   │
│                                                                       │
└─────────────────────────────────────────────────────────────────────┘
                                  │
                        (Validation Results)
                                  ▼
┌─────────────────────────────────────────────────────────────────────┐
│                    PERSISTENCE LAYER                                 │
├─────────────────────────────────────────────────────────────────────┤
│                                                                       │
│  ┌──────────────────────────┐       ┌──────────────────────────┐   │
│  │ backend/validation-      │       │ Memory (Cache)           │   │
│  │ config.json              │       │                          │   │
│  │                          │       │ ├─ validationCache       │   │
│  │ ├─ Global method         │       │ ├─ cacheTimestamp       │   │
│  │ ├─ Timeout               │       │ └─ TTL: 1 hour          │   │
│  │ ├─ Retries               │       │                          │   │
│  │ ├─ PowerShell enabled    │       │ [Cleared on new run]     │   │
│  │ ├─ Per-control methods   │       │                          │   │
│  │ └─ Last updated          │       │                          │   │
│  └──────────────────────────┘       └──────────────────────────┘   │
│                                                                       │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │ Memory State (validation-state.js)                           │  │
│  │                                                              │  │
│  │ For each control:                                           │  │
│  │ ├─ controlId                                               │  │
│  │ ├─ validationMethod (graphAPI/powershell/fallback)         │  │
│  │ ├─ validationEndpoint/command                              │  │
│  │ ├─ executionTime (ms)                                      │  │
│  │ ├─ fallbackUsed (boolean)                                  │  │
│  │ ├─ fallbackReason (if applicable)                          │  │
│  │ └─ timestamp                                               │  │
│  └──────────────────────────────────────────────────────────────┘  │
│                                                                       │
└─────────────────────────────────────────────────────────────────────┘
```

---

## Validation Flow Diagrams

### 1. Single Control Validation (Hybrid Mode)

```
                        ┌─ validateWithHybridApproach ─┐
                        │                               │
                        ▼                               
                  Get Control Config
                        │
            ┌───────────┼───────────┐
            │           │           │
        graphAPI    powershell    hybrid
            │           │           │
            ▼           ▼           ▼
        [API Only]   [PS Only]  [Try API First]
                                    │
                        ┌───────────┘
                        ▼
                   Try Graph API
                   (with retries)
                        │
              ┌─────────┴─────────┐
              │                   │
           SUCCESS              FAIL
              │                   │
              ▼                   ▼
         Record Result      Check if PS available
        (graphAPI, ✓)             │
         Return                   ├─ No  → Throw error
                                  │
                                  ├─ Yes → Try PowerShell
                                  │        │
                                  │        ├─ Success → Record (PS, fallback used)
                                  │        └─ Fail → Throw error
```

### 2. CIS Validation Pipeline

```
validateAllCISControls()
    │
    ├─ Reset validation state
    │
    ├─ Check cache
    │  ├─ Valid → Return cached result
    │  └─ Invalid → Continue
    │
    ├─ Fetch all Graph API data (parallel Promise.allSettled)
    │  ├─ 160+ control validators
    │  └─ Each triggers hybrid validation if configured
    │
    ├─ Build CIS Topics
    │  ├─ For each control:
    │  │  ├─ Get result
    │  │  ├─ Apply status validator
    │  │  ├─ Get validation metadata
    │  │  └─ Add method info to control
    │  │
    │  └─ Return topics with metadata
    │
    ├─ Get validation summary
    │  ├─ Total controls
    │  ├─ Graph API count
    │  ├─ PowerShell count
    │  ├─ Fallback count
    │  └─ Execution times
    │
    ├─ Cache result
    │
    └─ Return complete result with:
       ├─ Topics (with validation methods)
       ├─ Stats
       └─ Validation method summary
```

### 3. Hybrid Fallback Sequence

```
Start Validation
    │
    ├─ Get method for control
    │
    ├─ "hybrid" mode?
    │  │
    │  ├─ NO → Use specified method only
    │  │
    │  └─ YES:
    │     │
    │     ├─ Attempt 1: Try Graph API
    │     │  │
    │     │  ├─ Success → Record + Return (graphAPI)
    │     │  │
    │     │  └─ Fail → Continue to attempt 2
    │     │
    │     ├─ Attempt 2: Retry Graph API
    │     │  │
    │     │  ├─ Success → Record + Return (graphAPI)
    │     │  │
    │     │  └─ Fail → Wait backoff (exponential)
    │     │           Continue to attempt 3
    │     │
    │     ├─ Attempt 3: Final retry Graph API
    │     │  │
    │     │  ├─ Success → Record + Return (graphAPI)
    │     │  │
    │     │  └─ Fail → Check PowerShell availability
    │     │           │
    │     │           ├─ PS unavailable → Throw error
    │     │           │
    │     │           └─ PS available:
    │     │              │
    │     │              ├─ Try PowerShell
    │     │              │  │
    │     │              │  ├─ Success → Record + Return (PS, fallback used)
    │     │              │  │
    │     │              │  └─ Fail → Throw error
    │     │
    │     └─ Record attempt metadata
    │        ├─ Control ID
    │        ├─ Method used (graphAPI/PS/fallback)
    │        ├─ Execution time
    │        ├─ Fallback reason (if applicable)
    │        └─ Timestamp
```

---

## Data Structure Diagrams

### 1. Control Result with Validation Metadata

```javascript
{
  // Original fields
  id: '1.1.1',
  title: 'Global Administrators Count',
  type: '...',
  profile: '...',
  status: 'pass',           // pass/fail/warn/manual
  value: 'Configuration reviewed',
  desc: '...',
  
  // NEW: Validation Method Fields
  validationMethod: 'graphAPI',     // graphAPI | powershell | fallback
  fallbackUsed: false,               // true if fallback was triggered
  fallbackReason: null,              // Reason for fallback if applicable
  executionTime: 245,                // Execution time in milliseconds
  
  // Graph API details (existing)
  graphApiDetails: {
    queryType: '/directoryRoles',
    endpoint: 'GET /directoryRoles',
    expand: 'none',
    select: null,
    filter: null,
    steps: [...],
    graphExplorerCommands: [...]
  },
  
  validatedAt: '2024-06-23T...'
}
```

### 2. Validation Config Structure

```javascript
{
  // Method selection
  validationMethod: 'hybrid',        // Default method for all controls
  
  // Performance tuning
  timeout: 30000,                    // Timeout per control (ms)
  retryAttempts: 3,                  // Number of retry attempts
  retryBackoffMs: 2000,              // Backoff increment (exponential)
  
  // Caching
  cacheTTL: 3600000,                 // Cache TTL (1 hour)
  
  // PowerShell
  enablePowerShell: false,           // PowerShell fallback enabled?
  psModulesPath: '/opt/.../powershell/7',  // Module path
  
  // Legacy/future
  preferredMethods: {},              // Deprecated (use controlMethodMap)
  
  // Per-control overrides
  controlMethodMap: {
    '1.1.1': 'graphAPI',             // Override for specific control
    '2.1.1': 'hybrid',
    '3.1.1': 'powershell'
  },
  
  // Metadata
  lastUpdated: '2024-06-23T...'
}
```

### 3. Validation State Metadata (per control)

```javascript
{
  controlId: '1.1.1',
  validationMethod: 'graphAPI',      // graphAPI | powershell | fallback
  
  // Execution details
  validationEndpoint: 'GET /directoryRoles',
  validationCommand: null,           // PS command if applicable
  executionTime: 245,                // ms
  
  // Fallback tracking
  fallbackUsed: false,
  fallbackReason: null,              // If fallback: why it occurred
  
  // Results
  timestamp: '2024-06-23T10:30:45.123Z',
  graphApiDetails: {
    /* API response data */
  },
  powerShellOutput: null,            // If PS method used
  error: null                        // If validation failed
}
```

### 4. Validation Summary

```javascript
{
  totalControls: 160,                // Total controls validated
  
  // Method breakdown
  graphAPIControls: 150,             // Via Graph API
  powerShellControls: 0,             // Via PowerShell
  fallbackControls: 10,              // Used fallback
  
  // Performance metrics
  totalExecutionTime: 45000,         // Total time (ms)
  averageExecutionTime: 281,         // Per control (ms)
  
  // Timestamp
  timestamp: '2024-06-23T10:31:05.000Z'
}
```

---

## Control Flow Diagrams

### 1. Settings Update Flow

```
User (Frontend)
    │
    ├─ Navigate to /validation-settings
    │
    ├─ Fetch current config
    │  └─ GET /api/config/validation-settings
    │     └─ backend/server.js
    │        └─ validation-config.js
    │           └─ Return current settings
    │
    ├─ Display settings in UI
    │
    ├─ User changes method (e.g., hybrid → graphAPI)
    │
    ├─ Click "Save Settings"
    │
    ├─ Send update
    │  └─ POST /api/config/validation-settings
    │     └─ backend/server.js
    │        └─ validation-config.js
    │           └─ Update in memory
    │           └─ Save to JSON file
    │           └─ Return new config
    │
    ├─ Display success message
    │
    └─ Settings now active for next validation
```

### 2. Validation Run Flow

```
Trigger Validation
    │
    ├─ CIS Dashboard → "Run Validation"
    │
    ├─ validateAllCISControls()
    │  │
    │  ├─ Reset validation state
    │  │
    │  ├─ Check cache
    │  │
    │  ├─ Fetch Graph API data (all controls in parallel)
    │  │  │
    │  │  └─ For each control validator:
    │  │     └─ validateWithHybridApproach()
    │  │        ├─ Get method from validation-config.js
    │  │        ├─ Execute (Graph API or PowerShell)
    │  │        └─ Record metadata via validation-state.js
    │  │
    │  ├─ Build result with methods
    │  │  └─ Include validationMethod, fallbackUsed, etc.
    │  │
    │  ├─ Get summary from validation-state.js
    │  │
    │  ├─ Cache result
    │  │
    │  └─ Return complete result
    │
    ├─ Frontend receives result
    │  │
    │  ├─ Display topics with method badges
    │  │
    │  ├─ Show validation summary
    │  │
    │  └─ Display per-control details
    │
    └─ Complete
```

---

## Summary

This hybrid validation system architecture provides:

✅ **Flexibility** - Switch validation methods globally or per-control
✅ **Resilience** - Automatic fallback when primary method fails
✅ **Visibility** - Complete tracking of validation methods used
✅ **Configurability** - Admin UI for all settings
✅ **Performance** - Caching and parallel execution
✅ **Extensibility** - Easy to add new methods or data sources

The system is production-ready, well-architected, and documented.
