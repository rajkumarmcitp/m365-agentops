# Hybrid Validation System Implementation

## Overview

This document describes the complete implementation of a hybrid validation system that allows switching between Graph API and PowerShell validation methods for CIS controls. The system supports three modes:

1. **Graph API Only** - Uses Microsoft Graph API exclusively (default)
2. **PowerShell Only** - Uses PowerShell cmdlets exclusively
3. **Hybrid** - Tries Graph API first, falls back to PowerShell if needed (recommended)

## Architecture

### Phase 1: Backend Configuration & Storage

#### Files Created/Modified

**1. `backend/validation-config.js`** (NEW)
- Central configuration management for validation methods
- Persists settings to `backend/validation-config.json`
- Functions:
  - `getValidationConfig()` - Get current configuration
  - `updateValidationConfig(updates)` - Save configuration changes
  - `getValidationMethod(controlId)` - Get method for specific control
  - `setControlValidationMethod(controlId, method)` - Set per-control preference
  - `clearControlValidationMethod(controlId)` - Clear custom method
  - `isPowerShellEnabled()` / `setPowerShellEnabled()` - PowerShell toggle
  - `exportConfig()` - Export full config for API responses

**Configuration Structure:**
```javascript
{
  validationMethod: 'hybrid',  // 'graphAPI' | 'powershell' | 'hybrid'
  timeout: 30000,              // ms per control
  retryAttempts: 3,            // Retry count
  retryBackoffMs: 2000,        // Backoff in ms
  cacheTTL: 3600000,           // 1 hour cache
  enablePowerShell: false,     // Enable PS fallback
  psModulesPath: '',           // PowerShell module path
  preferredMethods: {},        // Per-control overrides
  controlMethodMap: {},        // Control -> method mapping
  lastUpdated: ''              // Timestamp
}
```

**2. `backend/validation-state.js`** (NEW)
- Tracks validation method usage during execution
- Records metadata for each control validation
- Functions:
  - `recordValidationAttempt(controlId, method, details)` - Record attempt
  - `getValidationMetadata(controlId)` - Get metadata for control
  - `getValidationSummary()` - Get aggregated summary
  - `getFallbackControls()` - Get controls that used fallback
  - `getControlsByValidationMethod(method)` - Filter by method
  - `resetValidationState()` - Clear all tracking

**Metadata Structure:**
```javascript
{
  controlId: '1.1.1',
  validationMethod: 'graphAPI',  // 'graphAPI' | 'powershell' | 'fallback'
  validationEndpoint: 'GET /directoryRoles',
  validationCommand: 'Get-MgRoleManagement',
  executionTime: 245,            // ms
  fallbackUsed: false,
  fallbackReason: null,
  timestamp: '2024-06-23T...',
  graphApiDetails: {},
  powerShellOutput: null,
  error: null
}
```

**3. `backend/hybrid-validator.js`** (NEW)
- Core hybrid validation engine
- Implements fallback logic
- Functions:
  - `validateWithHybridApproach(controlId, graphValidator, psCommands)` - Main validator
  - `validateWithGraphAPI(controlId, validator, startTime)` - Graph API only
  - `validateWithPowerShell(controlId, commands, startTime)` - PowerShell only
  - `validateWithHybridFallback(...)` - Hybrid with fallback
  - `mapPowerShellResultToStatus(output, controlId)` - Parse PS output
  - `createHybridValidator(controlId, graphValidator, psCommands)` - Create wrapper
  - `batchValidateHybrid(controls)` - Batch validation

**4. `backend/cis-validator.js`** (MODIFIED)
- Updated to import validation config and state modules
- Added validation method metadata to control results
- Modified `buildCISTopics()` to include:
  - `validationMethod` - Method used (graphAPI/powershell/fallback)
  - `fallbackUsed` - Boolean flag
  - `fallbackReason` - Why fallback occurred
  - `executionTime` - Time in ms
- Added validation method summary to response
- Functions added:
  - `getValidationMethodSummary()` - Export summary
  - `getValidationMetadata()` - Export all metadata

### Phase 2: PowerShell Integration

The existing `backend/powershell-executor.js` is leveraged:
- `executePowerShellCommands(commands, controlId)` - Execute PS scripts
- `executePowerShellWithGraph(commands, scopes)` - With Graph auth
- `executePowerShellWithExchange(commands)` - With Exchange auth
- `parsePowerShellOutput(output, format)` - Parse results
- `mapPowerShellToStatus(output, controlId)` - Map to pass/fail/warn

The `hybrid-validator.js` provides wrapper functions that:
- Use PowerShell for controls that have PS commands defined
- Map PowerShell output to control status (pass/fail/warn)
- Track validation method used in results

### Phase 3: Frontend UI - Settings Page

**File Created: `pages/validation-settings.js`** (NEW)
- Full admin settings page for validation configuration
- Features:
  - Radio buttons to select validation method (Graph API/PowerShell/Hybrid)
  - Toggle to enable/disable PowerShell validation
  - Input fields for timeout and retry settings
  - Display of last validation summary with statistics
  - List of custom per-control method settings
  - Save, reset, and clear buttons

**Key Sections:**
1. **Validation Method** - Choose primary method
2. **PowerShell Configuration** - Enable/disable + required modules list
3. **Performance Settings** - Timeout, retries
4. **Last Validation Summary** - Stats from recent run
5. **Custom Control Methods** - Per-control overrides

### Phase 4: Frontend Display & Reporting

**File Created: `components/validation-method-badge.js`** (NEW)
Three reusable components for displaying validation metadata:

**1. ValidationMethodBadge Component**
- Shows validation method (G for Graph API, P for PowerShell, F for Fallback)
- Color-coded: blue (Graph), orange (PowerShell), yellow (Fallback)
- Two sizes: small (letter) and full (with details)
- Tooltip with full description

**2. ValidationExecutionDetails Component**
- Displays execution time
- Shows API endpoint or PowerShell command used
- Shows fallback reason if applicable
- Styled detail rows

**3. ValidationMethodSummary Component**
- Grid showing counts and percentages
- Graph API vs PowerShell vs Fallback
- Average execution time
- Warning styling if fallbacks occurred

## API Endpoints

All endpoints are in `backend/server.js`:

### Configuration Endpoints

**GET `/api/config/validation-settings`**
- Get current validation configuration
- Response: `{ success: true, data: { currentMethod, availableMethods, ... } }`

**POST `/api/config/validation-settings`**
- Update configuration
- Body: `{ validationMethod, timeout, retryAttempts, enablePowerShell }`
- Response: `{ success: true, data: { ... } }`

**GET `/api/config/validation-methods`**
- Get available methods per control
- Response: `{ success: true, data: { globalMethod, customMethods, ... } }`

**POST `/api/config/validation-methods/:controlId`**
- Set method for specific control
- Body: `{ method: 'graphAPI' | 'powershell' | 'hybrid' }`
- Response: `{ success: true, message: '...' }`

**DELETE `/api/config/validation-methods/:controlId`**
- Clear custom method for control
- Response: `{ success: true, message: '...' }`

**POST `/api/config/powershell-enable`**
- Enable/disable PowerShell validation
- Body: `{ enabled: true | false }`
- Response: `{ success: true, data: { powerShellEnabled } }`

**POST `/api/config/validation-reset`**
- Reset configuration to defaults
- Response: `{ success: true, data: { ... } }`

### Validation Data Endpoints

**GET `/api/validation/summary`**
- Get summary from last validation run
- Response: 
```json
{
  success: true,
  data: {
    totalControls: 160,
    graphAPIControls: 150,
    powerShellControls: 0,
    fallbackControls: 10,
    totalExecutionTime: 45000,
    averageExecutionTime: 281
  }
}
```

**GET `/api/validation/metadata`**
- Get detailed metadata for all controls
- Response: `{ success: true, data: [{ controlId, validationMethod, ... }], count }`

## Control Result Structure

Updated control objects in validation results now include:

```javascript
{
  id: '1.1.1',
  title: 'Control Title',
  status: 'pass',
  value: 'Display value',
  // NEW: Validation method info
  validationMethod: 'graphAPI',  // 'graphAPI' | 'powershell' | 'fallback'
  fallbackUsed: false,           // Was fallback used?
  fallbackReason: null,          // Why fallback occurred
  executionTime: 245,            // ms
  // Existing fields
  graphApiDetails: {...},
  desc: '...',
  profile: '...'
}
```

## Configuration File

Settings are stored in `backend/validation-config.json`:

```json
{
  "validationMethod": "hybrid",
  "timeout": 30000,
  "retryAttempts": 3,
  "retryBackoffMs": 2000,
  "cacheTTL": 3600000,
  "enablePowerShell": false,
  "psModulesPath": "/opt/microsoft/powershell/7",
  "preferredMethods": {},
  "controlMethodMap": {
    "1.1.1": "graphAPI",
    "2.1.1": "hybrid"
  },
  "lastUpdated": "2024-06-23T..."
}
```

## Usage Examples

### Configure Global Validation Method

```javascript
// Use hybrid by default
fetch('/api/config/validation-settings', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    validationMethod: 'hybrid',
    timeout: 30000,
    retryAttempts: 3
  })
})
```

### Set Per-Control Method

```javascript
// Use PowerShell for specific control
fetch('/api/config/validation-methods/2.1.1', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ method: 'powershell' })
})
```

### Get Validation Summary

```javascript
const response = await fetch('/api/validation/summary')
const data = await response.json()
console.log(`Graph API: ${data.data.graphAPIControls}`)
console.log(`PowerShell: ${data.data.powerShellControls}`)
console.log(`Fallbacks: ${data.data.fallbackControls}`)
```

### Display Validation Method in UI

```javascript
import { ValidationMethodBadge } from './components/validation-method-badge.js'

// In control display
<ValidationMethodBadge
  validationMethod={control.validationMethod}
  fallbackUsed={control.fallbackUsed}
  small={true}
/>

// In control details
<ValidationMethodBadge
  validationMethod={control.validationMethod}
  fallbackUsed={control.fallbackUsed}
/>

<ValidationExecutionDetails
  executionTime={control.executionTime}
  endpoint={control.graphApiDetails.endpoint}
  fallbackReason={control.fallbackReason}
/>
```

## Testing the System

### 1. Load Settings Page
```
Navigate to: /validation-settings
- See current validation method
- Toggle between Graph API, PowerShell, and Hybrid
- Adjust timeout and retry settings
```

### 2. Run Validation
```javascript
// Trigger CIS validation
GET /api/cis/validation

// Check response
{
  topics: [...],
  stats: {...},
  validationMethodSummary: {
    graphAPIControls: 150,
    powerShellControls: 0,
    fallbackControls: 10
  }
}
```

### 3. Check Validation Metadata
```javascript
// Get per-control validation method info
GET /api/validation/metadata

// Each control shows:
[{
  controlId: '1.1.1',
  validationMethod: 'graphAPI',
  executionTime: 245,
  timestamp: '2024-06-23T...'
}]
```

### 4. Test Fallback
```
1. Set validation method to 'hybrid'
2. Enable PowerShell validation
3. Run validation
4. Check if any controls show fallbackUsed: true
5. View fallback reason in metadata
```

## Key Features

1. **Flexible Validation** - Switch methods globally or per-control
2. **Intelligent Fallback** - Automatically try alternative if primary fails
3. **Performance Tracking** - Execution time per control
4. **Configurable Retry** - Exponential backoff for failed attempts
5. **Detailed Reporting** - Know which method was used for each control
6. **Easy Administration** - Web UI for all configuration
7. **Persistent Settings** - Configuration saved to disk
8. **Method Metadata** - Full tracking of validation execution

## Performance Considerations

- **Graph API**: Generally 200-500ms per control
- **PowerShell**: 500-2000ms per control (startup overhead)
- **Hybrid**: Uses Graph API (faster) with fallback safety
- **Cache**: 1 hour by default (configurable)
- **Timeout**: 30 seconds per control (configurable)
- **Batch**: All controls validated in parallel via Promise.allSettled

## Security Considerations

1. **Configuration File** - Stored in backend directory, not exposed via API
2. **PS Modules** - PowerShell validation requires modules installed on server
3. **Credentials** - Uses existing Graph Client authentication
4. **Access Control** - Consider restricting settings endpoints to admins
5. **Audit** - All configuration changes timestamped in config file

## Future Enhancements

1. **Per-Control UI** - Toggle validation method in control detail modal
2. **Method Performance** - Track and compare method performance
3. **Automatic Tuning** - Auto-select best method based on success rate
4. **Validation History** - Track method changes over time
5. **Batch Import** - Import method preferences from CSV
6. **Export Reports** - Include validation method in compliance reports
7. **Health Check** - Verify Graph API and PowerShell connectivity
8. **Metrics Dashboard** - Visualize validation method usage

## Troubleshooting

### PowerShell Validation Not Working
- Check if PowerShell modules are installed: `Get-Module -ListAvailable Microsoft.Graph`
- Verify module paths in configuration
- Check PowerShell execution policy
- Enable debug logging in hybrid-validator.js

### Fallback Too Frequent
- Check Graph API authentication
- Verify service principal permissions
- Increase timeout value
- Check network connectivity

### Performance Issues
- Reduce parallel control validation
- Increase timeout (slower = more time for fallback)
- Enable caching (cacheTTL > 0)
- Profile using execution time metadata

## File Manifest

### Created Files
- `backend/validation-config.js` - Configuration management
- `backend/validation-state.js` - State tracking
- `backend/hybrid-validator.js` - Hybrid validation engine
- `pages/validation-settings.js` - Settings UI
- `components/validation-method-badge.js` - UI components
- `backend/validation-config.json` - Persisted configuration (auto-created)

### Modified Files
- `backend/cis-validator.js` - Added validation method tracking
- `backend/server.js` - Added 8 new API endpoints

## Summary

This hybrid validation system provides a complete solution for flexible, reliable CIS control validation. It supports Graph API, PowerShell, and hybrid modes with intelligent fallback, comprehensive metadata tracking, and an intuitive admin UI for configuration. The system is production-ready and can be extended with additional features as needed.
