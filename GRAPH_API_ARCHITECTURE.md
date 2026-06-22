# Graph API Integration Architecture

## System Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────────┐
│                         USER BROWSER                                 │
│  M365 Configuration Page → Click "Validation Report" Button          │
└─────────────────────────────────────────────────────────────────────┘
                              ↓
                    (Frontend → Backend)
                              ↓
┌─────────────────────────────────────────────────────────────────────┐
│                    FRONTEND (Vite/Vue.js)                            │
│  ┌───────────────────────────────────────────────────────────────┐  │
│  │ pages/m365config.js                                           │  │
│  │ - renderValidationView()                                      │  │
│  │ - Calls: fetch('/api/config/cis-controls')                   │  │
│  │ - Displays: Risk score, stats, failed/warning controls        │  │
│  └───────────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────┘
                              ↓
                    HTTP GET /api/config/cis-controls
                              ↓
┌─────────────────────────────────────────────────────────────────────┐
│                BACKEND SERVER (Node.js Express)                      │
│  ┌───────────────────────────────────────────────────────────────┐  │
│  │ backend/server.js                                             │  │
│  │ - Routes: GET /api/config/cis-controls                        │  │
│  │ - Handler: async (req, res)                                   │  │
│  │ - Calls: validateAllCISControls()                             │  │
│  └───────────────────────────────────────────────────────────────┘  │
│                              ↓                                        │
│  ┌───────────────────────────────────────────────────────────────┐  │
│  │ backend/cis-validator.js                                      │  │
│  │ ┌─────────────────────────────────────────────────────────┐   │  │
│  │ │ validateAllCISControls()                               │   │  │
│  │ │ - Check cache (TTL: 1 hour)                            │   │  │
│  │ │ - If cached, return result                             │   │  │
│  │ │ - If expired, run validation...                        │   │  │
│  │ └─────────────────────────────────────────────────────────┘   │  │
│  │                                                               │  │
│  │ ┌─────────────────────────────────────────────────────────┐   │  │
│  │ │ Parallel Graph API Queries (Promise.allSettled)       │   │  │
│  │ ├─ validateGlobalAdmins()                                │   │  │
│  │ ├─ validateAuthorizationPolicy()                         │   │  │
│  │ ├─ validateSecurityDefaults()                            │   │  │
│  │ ├─ validateConditionalAccess()                           │   │  │
│  │ ├─ validateDLPPolicies()                                 │   │  │
│  │ ├─ validateSafeLinks()                                   │   │  │
│  │ ├─ validateSafeAttachments()                             │   │  │
│  │ ├─ validateDeviceCompliance()                            │   │  │
│  │ ├─ validateDefenderForEndpoint()                         │   │  │
│  │ ├─ validateMFAPolicies()                                 │   │  │
│  │ ├─ validateExternalSharing()                             │   │  │
│  │ ├─ getDomainInfo()                                       │   │  │
│  │ ├─ getDeviceList()                                       │   │  │
│  │ └─ ... (13+ more validators)                             │   │  │
│  │ └─────────────────────────────────────────────────────────┘   │  │
│  │                                                               │  │
│  │ ┌─────────────────────────────────────────────────────────┐   │  │
│  │ │ buildCISTopics()                                       │   │  │
│  │ │ - Load CIS_CONTROLS_DATA (160 controls)               │   │  │
│  │ │ - For each control:                                    │   │  │
│  │ │   - Get validator function                             │   │  │
│  │ │   - Pass Graph API data                                │   │  │
│  │ │   - Calculate status (pass/fail/warn)                  │   │  │
│  │ │ - Return validated topics structure                    │   │  │
│  │ └─────────────────────────────────────────────────────────┘   │  │
│  │                                                               │  │
│  │ ┌─────────────────────────────────────────────────────────┐   │  │
│  │ │ calculateStats()                                       │   │  │
│  │ │ - Count passed/failed/warning controls                 │   │  │
│  │ │ - Calculate pass rate (%)                              │   │  │
│  │ │ - Compute risk score: 100 - (failRate + warnRate*0.5) │   │  │
│  │ │ - Determine risk level (Low → Critical)               │   │  │
│  │ └─────────────────────────────────────────────────────────┘   │  │
│  │                                                               │  │
│  │ ┌─────────────────────────────────────────────────────────┐   │  │
│  │ │ Cache Result (in memory)                               │   │  │
│  │ │ - Store: validationCache = result                      │   │  │
│  │ │ - Timestamp: cacheTimestamp = Date.now()              │   │  │
│  │ └─────────────────────────────────────────────────────────┘   │  │
│  │                                                               │  │
│  │ Return:                                                       │  │
│  │ {                                                             │  │
│  │   success: true,                                             │  │
│  │   data: [topics with controls],                              │  │
│  │   stats: { passed, failed, warnings, riskScore },            │  │
│  │   tenantId: "...",                                           │  │
│  │   tenantDomain: "...",                                       │  │
│  │   source: "Graph API"                                        │  │
│  │ }                                                             │  │
│  └───────────────────────────────────────────────────────────────┘  │
│                              ↑                                        │
│                  ┌───────────┴──────────────────┐                   │
│                  ↓          Parallel queries    ↓                   │
│  ┌───────────────────────────────────────────────────────────────┐  │
│  │ backend/cis-controls-data.js (Control Definitions)           │  │
│  │ - CIS_CONTROLS_DATA (160 controls)                           │  │
│  │ - Each control has: ID, title, validator function            │  │
│  │ - Validators: (data) => 'pass'|'fail'|'warn'                │  │
│  └───────────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────────┐
│          MICROSOFT GRAPH API (Azure AD / M365 Tenant)               │
│  ┌───────────────────────────────────────────────────────────────┐  │
│  │ Queries (async, parallel):                                   │  │
│  ├─ GET /directoryRoles/{id}/members → Global admins            │  │
│  ├─ GET /policies/authorizationPolicy → Auth settings           │  │
│  ├─ GET /identity/conditionalAccess/policies → CA policies      │  │
│  ├─ GET /deviceManagement/deviceCompliancePolicies → Compliance │  │
│  ├─ GET /datalossprevention/policies → DLP                      │  │
│  ├─ GET /policies/authenticationMethodsPolicy → MFA            │  │
│  ├─ GET /deviceManagement/managedDevices → Device status        │  │
│  ├─ GET /domains → Domain settings                              │  │
│  ├─ GET /organization → Org settings                            │  │
│  └─ ... (12+ more endpoints)                                    │  │
│                                                                   │  │
│  Real Data Returned:                                             │  │
│  - Active policies and configurations                            │  │
│  - User role assignments                                         │  │
│  - Device compliance status                                      │  │
│  - Security policy settings                                      │  │
│  - Organizational configuration                                  │  │
└─────────────────────────────────────────────────────────────────────┘
                              ↓
              (Responses merged back to validators)
                              ↓
┌─────────────────────────────────────────────────────────────────────┐
│              DATA PROCESSING & VALIDATION                            │
│  - Merge all Graph API responses                                     │
│  - Apply validator functions                                        │
│  - Transform to CIS control format                                  │
│  - Calculate statistics                                             │
└─────────────────────────────────────────────────────────────────────┘
                              ↓
                    HTTP Response (JSON)
                              ↓
┌─────────────────────────────────────────────────────────────────────┐
│           FRONTEND RECEIVES VALIDATION RESULTS                       │
│  - Renders risk score (0-100, color-coded)                          │
│  - Shows statistics (pass rate, counts)                             │
│  - Lists all 9 topics with individual pass rates                    │
│  - Shows failed controls with remediation                           │
│  - Shows warning controls with guidance                             │
│  - Provides JSON export button                                      │
└─────────────────────────────────────────────────────────────────────┘
```

## Data Flow

### 1. Request Phase
```
User clicks "Validation Report" 
  ↓
Frontend: GET /api/config/cis-controls
  ↓
Backend receives request
  ↓
Check if result in cache
  ├─ YES: Return cached result (~100ms)
  └─ NO: Proceed to validation
```

### 2. Validation Phase
```
Backend: validateAllCISControls()
  ↓
Prepare 25+ Graph API queries
  ↓
Execute in parallel (Promise.allSettled)
  ├─ Query 1: /directoryRoles (Global Admins)
  ├─ Query 2: /policies/authorizationPolicy
  ├─ Query 3: /identity/conditionalAccess/policies
  ├─ Query 4: /deviceManagement/deviceCompliancePolicies
  ├─ ... (21+ more queries)
  └─ Each query: 200-500ms
  ↓
All queries complete (~6-13 seconds for first run)
  ↓
Collect results
```

### 3. Processing Phase
```
buildCISTopics()
  ↓
For each of 9 topics:
  For each subsection:
    For each of 160 controls:
      - Get validator function
      - Apply to Graph data
      - Assign pass/fail/warn
      ↓
      Control: {
        id: '1.1.1',
        status: 'pass',
        value: '3 Global Admins',
        ...
      }
      ↓
calculateStats()
  ├─ Passed: 144
  ├─ Failed: 6
  ├─ Warnings: 10
  ├─ Pass Rate: 90%
  ├─ Risk Score: 93
  └─ Risk Level: "Low-Moderate Risk"
```

### 4. Caching Phase
```
validationCache = {
  topics: [...],
  stats: {...},
  timestamp: Date.now()
}

cacheTimestamp = Date.now()
TTL = 1 hour (3600000 ms)

On next request:
  ├─ If Date.now() - cacheTimestamp < TTL
  │  └─ Return cached result
  └─ Else
     └─ Invalidate and re-validate
```

### 5. Response Phase
```
{
  success: true,
  data: [
    {
      id: 't1',
      name: 'Microsoft 365 Admin Center',
      subsections: [
        {
          id: 't1s1',
          name: '1.1 Users',
          controls: [
            {
              id: '1.1.1',
              title: 'Ensure 2-4 global admins',
              status: 'pass',
              value: '3 Global Admins',
              ...
            },
            ...
          ]
        }
      ]
    },
    ... (8 more topics)
  ],
  stats: {
    totalControls: 160,
    passed: 144,
    failed: 6,
    warnings: 10,
    passRate: 90,
    riskScore: 93,
    riskLevel: 'Low-Moderate Risk'
  },
  tenantId: 'your-tenant-id',
  tenantDomain: 'your-tenant.onmicrosoft.com',
  source: 'Graph API'
}
```

## Validator Execution

Each control has a validator function:

```javascript
{
  id: '1.1.1',
  title: 'Ensure 2-4 global admins',
  validator: (data) => {
    const count = data?.count || 0
    return count >= 2 && count <= 4 ? 'pass' : (count === 0 ? 'fail' : 'warn')
  }
}
```

Execution:
```
1. Graph API returns: { count: 3, members: [...] }
2. Validator receives data
3. Evaluates: 3 >= 2 && 3 <= 4 → true
4. Returns: 'pass'
5. Control status set to 'pass'
6. Display shows: ✓ Pass
```

## Caching Strategy

### Cache Invalidation Scenarios

| Scenario | Action | Result |
|----------|--------|--------|
| First request | Run full validation | 6-13 seconds |
| Same hour | Return from cache | <100ms |
| Next hour | Cache expired, re-validate | 6-13 seconds |
| Manual refresh | POST /refresh → clear cache | 6-13 seconds |
| After config change | User triggers refresh | New results immediately |

### Cache Key Strategy

- **Single global cache** per backend instance
- **Key:** `validationCache`
- **Timestamp:** `cacheTimestamp`
- **TTL:** 3600000 ms (1 hour)
- **Check:** `if (Date.now() - timestamp < TTL)`

## Error Handling

### Graph API Query Failure

```
Promise.allSettled() used to prevent cascade failures

If one query fails:
  - That validator gets null data
  - Validator returns 'warn' or 'fail'
  - Other queries continue
  - Response includes partial results
  - Client still displays meaningful data

Example:
  ├─ /directoryRoles → SUCCESS (3 admins found)
  ├─ /policies/authorizationPolicy → SUCCESS
  ├─ /identity/conditionalAccess/policies → TIMEOUT
  │  └─ Validator gets null
  │  └─ Returns 'warn'
  └─ Result: 2/3 controls pass, 1 warns
```

### Backend Failure

```
If entire validation fails:
  ├─ Frontend receives: { success: false, error: "..." }
  ├─ Frontend displays: Error message
  ├─ Frontend shows: "Click to retry" button
  └─ User can retry request
```

## Performance Metrics

### Response Times

| Operation | Time | Details |
|-----------|------|---------|
| Cache hit | <100ms | Simple data lookup |
| Single query | 200-500ms | One Graph API call |
| All queries (parallel) | 3-8 seconds | 25 queries in parallel |
| Validation processing | 1-2 seconds | Applying validators |
| Stats calculation | <1 second | Counting controls |
| Full first run | 6-13 seconds | Total end-to-end |
| Cached response | <100ms | After TTL valid |

### Scaling

| Users | Load | Backend Load | Recommendation |
|-------|------|-------------|---|
| 1-5 | Low | ~30% | Single instance |
| 5-20 | Medium | ~60% | Load balance 2 instances |
| 20-50 | High | ~90% | 3-4 instances + cache layer |
| 50+ | Very High | N/A | Dedicated Graph API proxy |

## Security Architecture

### Authentication Flow

```
User
  ↓
Browser (Frontend)
  ├─ Makes request to Backend
  ├─ Includes session/auth token
  ↓
Backend validates user session
  ├─ If invalid: Reject request
  ├─ If valid: Proceed
  ↓
Backend authenticates to Graph API
  ├─ Uses: ClientSecretCredential
  ├─ Provides: Tenant ID + Client Secret
  ├─ Receives: Access token from Azure AD
  ↓
Queries Microsoft Graph API
  ├─ Uses: Access token
  ├─ Scopes: Directory.Read.All, Policy.Read.All, etc.
  ├─ Gets: Tenant configuration data
  ↓
Response to Backend
  ↓
Backend processes & validates
  ↓
Response to Frontend (already passed user auth)
  ↓
Display to User
```

### Secret Management

```
Credentials stored in:
  ├─ Environment variables (development)
  ├─ Azure Key Vault (production)
  └─ Never in code or git

Flow:
  1. Backend starts
  2. Reads GRAPH_CLIENT_SECRET from env
  3. Creates ClientSecretCredential
  4. Initializes graphClient
  5. Uses for all Graph API calls
  6. Never exposes to frontend
```

---

**Architecture Version:** 1.0  
**Last Updated:** 2026-06-22  
**Status:** Production Ready
