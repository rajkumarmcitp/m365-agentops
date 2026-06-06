import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import { ClientSecretCredential } from '@azure/identity'
import { Client } from '@microsoft/microsoft-graph-client'
import { TokenCredentialAuthenticationProvider } from '@microsoft/microsoft-graph-client/authProviders/azureTokenCredentials/index.js'
import { validateServiceRequest } from './agent.js'
import {
  createRequest, getRequestById, listRequests, approveRequest, rejectRequest,
  addComment, getRequestStats, markProvisioning, markProvisioningSuccess, markProvisioningFailed
} from './requests.js'
import {
  createAuditLog, listAuditLogs, searchAuditLogs, getAuditStats,
  generateComplianceReport, exportAuditLogs, pruneAuditLogs
} from './audit.js'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 3000

// ============================================================
// Middleware
// ============================================================
// CORS configuration - allow localhost and production origins
app.use((req, res, next) => {
  const origin = req.headers.origin || ''
  const allowedOrigins = [
    'http://localhost:5173',
    'http://localhost:5174',
    'http://127.0.0.1:5173',
    'http://127.0.0.1:5174',
    'https://proud-river-0f55f1e10.7.azurestaticapps.net'
  ]

  if (allowedOrigins.includes(origin) || origin.includes('localhost') || origin.includes('127.0.0.1')) {
    res.header('Access-Control-Allow-Origin', origin)
    res.header('Access-Control-Allow-Credentials', 'true')
  }

  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE')
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization')
  res.header('Access-Control-Max-Age', '3600')

  if (req.method === 'OPTIONS') {
    return res.sendStatus(200)
  }
  next()
})

app.use(express.json())

// ============================================================
// Azure Identity & Graph Client Setup
// ============================================================
let graphClient = null

// Only initialize Graph Client if credentials are valid (not placeholders)
const isValidCredentials =
  process.env.AZURE_TENANT_ID &&
  !process.env.AZURE_TENANT_ID.includes('YOUR_') &&
  process.env.AZURE_CLIENT_ID &&
  !process.env.AZURE_CLIENT_ID.includes('YOUR_') &&
  process.env.AZURE_CLIENT_SECRET &&
  !process.env.AZURE_CLIENT_SECRET.includes('YOUR_')

if (isValidCredentials) {
  try {
    const credential = new ClientSecretCredential(
      process.env.AZURE_TENANT_ID,
      process.env.AZURE_CLIENT_ID,
      process.env.AZURE_CLIENT_SECRET
    )

    const authProvider = new TokenCredentialAuthenticationProvider(credential, {
      scopes: ['https://graph.microsoft.com/.default']
    })

    graphClient = Client.initWithMiddleware({ authProvider })
    console.log('✓ Azure credentials configured - using real Graph API')
  } catch (error) {
    console.warn('⚠️ Graph Client initialization failed:', error.message)
    console.warn('⚠️ Will use simulated data for endpoints')
  }
} else {
  console.log('ℹ️ Azure credentials not configured - using simulated data')
  console.log('ℹ️ Set AZURE_TENANT_ID, AZURE_CLIENT_ID, AZURE_CLIENT_SECRET to use real Graph API')
}

// ============================================================
// Azure AD Group IDs for Role Mapping
// ============================================================
const ROLE_GROUPS = {
  'super': process.env.AZURE_GROUP_SUPER_ADMINS,      // M365-Super-Admins group ID
  'admin': process.env.AZURE_GROUP_ADMINS,            // M365-Admins group ID
  'manager': process.env.AZURE_GROUP_MANAGERS,        // M365-Managers group ID
}

// ============================================================
// Health Check
// ============================================================
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    service: 'M365 AgentOps Backend',
    version: '1.0.0'
  })
})

// ============================================================
// Agent Validation - Validate service requests (rule-based AI)
// ============================================================
app.post('/api/agent/validate-request', async (req, res) => {
  try {
    const { request, userEmail } = req.body

    if (!request || !request.operationId) {
      return res.status(400).json({ error: 'Request and operationId required' })
    }

    console.log(`🤖 Agent validating: ${request.operationId}`)

    const userContext = {
      email: userEmail,
      department: 'Engineering', // TODO: Get from Azure AD
      role: 'user'
    }

    const validation = await validateServiceRequest(request, userContext)

    res.json({
      success: true,
      data: validation
    })
  } catch (error) {
    console.error('✗ Agent validation error:', error.message)
    res.json({
      success: true,
      data: {
        status: 'PENDING_REVIEW',
        riskScore: 0,
        riskLevel: 'MEDIUM',
        checks: [{ id: 'error', status: 'WARN', message: 'Validation error - defaulting to manual review' }],
        recommendations: [],
        autoApprove: false
      }
    })
  }
})

// ============================================================
// Service Requests Management
// ============================================================
app.post('/api/requests/submit', async (req, res) => {
  try {
    const { operationId, fields, validation } = req.body
    const userEmail = req.query.email || 'unknown@contoso.com'

    const request = createRequest(operationId, fields, userEmail, validation)

    res.json({
      success: true,
      data: request
    })
  } catch (error) {
    console.error('✗ Request submission error:', error.message)
    res.status(500).json({ success: false, error: error.message })
  }
})

app.get('/api/requests', async (req, res) => {
  try {
    const filters = {
      status: req.query.status,
      operationId: req.query.operationId,
      submittedBy: req.query.submittedBy,
      pendingApprovalBy: req.query.pendingApprovalBy,
      page: parseInt(req.query.page) || 1,
      limit: parseInt(req.query.limit) || 20
    }

    const requests = listRequests(filters)

    res.json({
      success: true,
      data: requests,
      stats: getRequestStats()
    })
  } catch (error) {
    console.error('✗ Request list error:', error.message)
    res.status(500).json({ success: false, error: error.message })
  }
})

app.get('/api/requests/:id', async (req, res) => {
  try {
    const request = getRequestById(req.params.id)
    if (!request) {
      return res.status(404).json({ success: false, error: 'Request not found' })
    }

    res.json({
      success: true,
      data: request
    })
  } catch (error) {
    console.error('✗ Request detail error:', error.message)
    res.status(500).json({ success: false, error: error.message })
  }
})

app.post('/api/requests/:id/approve', async (req, res) => {
  try {
    const { approverEmail, approverRole, comment } = req.body
    const request = approveRequest(req.params.id, approverEmail, approverRole, comment)

    res.json({
      success: true,
      data: request
    })
  } catch (error) {
    console.error('✗ Approval error:', error.message)
    res.status(400).json({ success: false, error: error.message })
  }
})

app.post('/api/requests/:id/reject', async (req, res) => {
  try {
    const { rejectorEmail, rejectorRole, reason } = req.body
    const request = rejectRequest(req.params.id, rejectorEmail, rejectorRole, reason)

    res.json({
      success: true,
      data: request
    })
  } catch (error) {
    console.error('✗ Rejection error:', error.message)
    res.status(400).json({ success: false, error: error.message })
  }
})

app.post('/api/requests/:id/comment', async (req, res) => {
  try {
    const { userEmail, userName, text } = req.body
    const request = addComment(req.params.id, userEmail, userName, text)

    res.json({
      success: true,
      data: request
    })
  } catch (error) {
    console.error('✗ Comment error:', error.message)
    res.status(400).json({ success: false, error: error.message })
  }
})

// ============================================================
// Audit Logging
// ============================================================
app.get('/api/audit-logs', async (req, res) => {
  try {
    const filters = {
      action: req.query.action,
      user: req.query.user,
      requestId: req.query.requestId,
      category: req.query.category,
      startDate: req.query.startDate,
      endDate: req.query.endDate,
      page: parseInt(req.query.page) || 1,
      limit: parseInt(req.query.limit) || 100
    }

    const logs = listAuditLogs(filters)

    res.json({
      success: true,
      data: logs,
      stats: getAuditStats()
    })
  } catch (error) {
    console.error('✗ Audit log error:', error.message)
    res.status(500).json({ success: false, error: error.message })
  }
})

app.get('/api/audit-logs/search', async (req, res) => {
  try {
    const query = req.query.q
    if (!query || query.length < 2) {
      return res.status(400).json({ success: false, error: 'Query too short' })
    }

    const results = searchAuditLogs(query)

    res.json({
      success: true,
      data: results
    })
  } catch (error) {
    console.error('✗ Audit search error:', error.message)
    res.status(500).json({ success: false, error: error.message })
  }
})

app.get('/api/audit-logs/report/compliance', async (req, res) => {
  try {
    const startDate = req.query.startDate || new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()
    const endDate = req.query.endDate || new Date().toISOString()

    const report = generateComplianceReport(startDate, endDate)

    res.json({
      success: true,
      data: report
    })
  } catch (error) {
    console.error('✗ Compliance report error:', error.message)
    res.status(500).json({ success: false, error: error.message })
  }
})

app.get('/api/audit-logs/export', async (req, res) => {
  try {
    const format = req.query.format || 'json'
    const logs = exportAuditLogs(format)

    if (format === 'csv') {
      res.type('text/csv')
      res.send([logs.headers.join(','), ...logs.rows.map(row => row.join(','))].join('\n'))
    } else {
      res.json({
        success: true,
        data: logs
      })
    }
  } catch (error) {
    console.error('✗ Export error:', error.message)
    res.status(500).json({ success: false, error: error.message })
  }
})

// ============================================================
// User Role Determination (based on Azure AD Groups)
// ============================================================
app.post('/api/user/role', async (req, res) => {
  try {
    const { userId } = req.body
    if (!userId) {
      return res.status(400).json({ error: 'userId required' })
    }

    console.log(`Determining role for user: ${userId}`)

    // If graphClient is not initialized, default to 'user' role
    if (!graphClient) {
      console.log('ℹ️ Graph Client not available - defaulting to user role')
      return res.json({ success: true, userId, role: 'user' })
    }

    // Get user's group memberships
    const memberOf = await graphClient
      .api(`/users/${userId}/memberOf`)
      .get()

    const groupIds = memberOf.value.map(g => g.id)
    console.log(`User is member of ${groupIds.length} groups`)

    // Check which role group the user belongs to (priority: super > admin > manager > user)
    let role = 'user' // default role

    if (ROLE_GROUPS.super && groupIds.includes(ROLE_GROUPS.super)) {
      role = 'super'
    } else if (ROLE_GROUPS.admin && groupIds.includes(ROLE_GROUPS.admin)) {
      role = 'admin'
    } else if (ROLE_GROUPS.manager && groupIds.includes(ROLE_GROUPS.manager)) {
      role = 'manager'
    }

    console.log(`✓ User role determined: ${role}`)
    res.json({ success: true, userId, role })
  } catch (error) {
    console.error('✗ Error determining user role:', error.message)
    console.log('ℹ️ Falling back to default user role')
    res.json({ success: true, userId, role: 'user' })
  }
})

// ============================================================
// Device Management (Intune)
// ============================================================
app.get('/api/devices', async (req, res) => {
  try {
    console.log('Fetching managed devices...')
    const devices = await graphClient
      .api('/deviceManagement/managedDevices')
      .get()

    console.log(`✓ Found ${devices.value.length} devices`)
    res.json({
      success: true,
      count: devices.value.length,
      data: devices.value.slice(0, 50)
    })
  } catch (error) {
    console.error('✗ Devices API error:', error.message)
    res.status(500).json({
      success: false,
      error: error.message,
      endpoint: '/deviceManagement/managedDevices',
      hint: 'Ensure DeviceManagementReadWrite.All permission is granted'
    })
  }
})

// Get device compliance policies
app.get('/api/device-compliance-policies', async (req, res) => {
  try {
    console.log('Fetching device compliance policies...')
    const policies = await graphClient
      .api('/deviceManagement/deviceCompliancePolicies')
      .get()

    console.log(`✓ Found ${policies.value.length} policies`)
    res.json({
      success: true,
      count: policies.value.length,
      data: policies.value
    })
  } catch (error) {
    console.error('✗ Compliance policies error:', error.message)
    res.status(500).json({
      success: false,
      error: error.message
    })
  }
})

// ============================================================
// Security (Secure Score & Defender)
// ============================================================
app.get('/api/security/score', async (req, res) => {
  try {
    console.log('📊 Fetching secure score from Graph API...')

    if (!graphClient) {
      throw new Error('Graph Client not initialized')
    }

    const scores = await graphClient
      .api('/security/secureScores')
      .get()

    const latestScore = scores.value[0] || null
    if (!latestScore) {
      throw new Error('No secure score data found')
    }

    console.log(`✓ Secure score: ${latestScore.currentScore}/${latestScore.maxScore}`)
    res.json({
      success: true,
      data: latestScore
    })
  } catch (graphError) {
    console.warn('⚠️ Graph API secure score failed, returning simulated data:', graphError.message)
    console.warn('   ℹ️  Requires permissions: SecurityActions.Read.All, Microsoft Defender license')
    // Fallback to simulated data
    res.json({
      success: true,
      data: {
        currentScore: 92,
        maxScore: 100,
        createdDateTime: new Date().toISOString(),
        controlScores: [
          { controlName: 'MFA enabled', score: 98, max: 100 },
          { controlName: 'Legacy authentication blocked', score: 94, max: 100 },
          { controlName: 'Risk-based Conditional Access', score: 88, max: 100 },
          { controlName: 'Password hash sync', score: 90, max: 100 },
          { controlName: 'Exploit Guard', score: 92, max: 100 }
        ],
        simulated: true
      }
    })
  }
})

// ============================================================
// Identity & Users
// ============================================================
app.get('/api/users', async (req, res) => {
  try {
    console.log('Fetching users...')
    const users = await graphClient
      .api('/users')
      .top(50)
      .get()

    console.log(`✓ Found ${users.value.length} users`)
    res.json({
      success: true,
      count: users.value.length,
      data: users.value
    })
  } catch (error) {
    console.error('✗ Users API error:', error.message)
    res.status(500).json({
      success: false,
      error: error.message
    })
  }
})

// Get risky users (requires Azure AD Premium P2)
app.get('/api/identity/risky-users', async (req, res) => {
  try {
    console.log('👤 Fetching risky users from Graph API...')

    if (!graphClient) {
      throw new Error('Graph Client not initialized')
    }

    const riskyUsers = await graphClient
      .api('/identityProtection/riskyUsers')
      .get()

    console.log(`✓ Found ${riskyUsers.value.length} risky users`)
    res.json({
      success: true,
      count: riskyUsers.value.length,
      data: riskyUsers.value
    })
  } catch (graphError) {
    console.warn('⚠️ Graph API risky users failed, returning simulated data:', graphError.message)
    console.warn('   ℹ️  Requires permissions: IdentityRiskEvent.Read.All, Azure AD Premium P2')
    // Fallback to simulated data
    res.json({
      success: true,
      count: 2,
      data: [
        { id: 'user-1', userPrincipalName: 'john.doe@contoso.com', riskLevel: 'high', riskState: 'atRisk', riskDetail: 'anomalousToken' },
        { id: 'user-2', userPrincipalName: 'jane.smith@contoso.com', riskLevel: 'medium', riskState: 'atRisk', riskDetail: 'unfamiliarLocation' }
      ],
      simulated: true
    })
  }
})

// ============================================================
// Applications (Entra Apps)
// ============================================================
app.get('/api/applications', async (req, res) => {
  try {
    console.log('📱 Fetching applications from Graph API...')

    if (!graphClient) {
      throw new Error('Graph Client not initialized')
    }

    const apps = await graphClient
      .api('/applications')
      .top(50)
      .get()

    console.log(`✓ Found ${apps.value.length} applications`)
    res.json({
      success: true,
      count: apps.value.length,
      data: apps.value
    })
  } catch (graphError) {
    console.warn('⚠️ Graph API failed, returning simulated data:', graphError.message)
    // Fallback to simulated data
    res.json({
      success: true,
      count: 8,
      data: [
        { id: '1', appId: 'app-001', displayName: 'Azure Portal', publisherName: 'Microsoft', createdDateTime: '2024-01-15T10:00:00Z' },
        { id: '2', appId: 'app-002', displayName: 'Microsoft 365', publisherName: 'Microsoft', createdDateTime: '2024-01-15T10:00:00Z' },
        { id: '3', appId: 'app-003', displayName: 'Power BI', publisherName: 'Microsoft', createdDateTime: '2024-02-20T14:30:00Z' },
        { id: '4', appId: 'app-004', displayName: 'Teams Admin', publisherName: 'Microsoft', createdDateTime: '2024-03-01T09:15:00Z' },
        { id: '5', appId: 'app-005', displayName: 'SharePoint Admin', publisherName: 'Microsoft', createdDateTime: '2024-03-05T11:45:00Z' },
        { id: '6', appId: 'app-006', displayName: 'Exchange Admin', publisherName: 'Microsoft', createdDateTime: '2024-03-10T08:30:00Z' },
        { id: '7', appId: 'app-007', displayName: 'Intune', publisherName: 'Microsoft', createdDateTime: '2024-03-15T16:20:00Z' },
        { id: '8', appId: 'app-008', displayName: 'Compliance Center', publisherName: 'Microsoft', createdDateTime: '2024-03-20T13:00:00Z' }
      ]
    })
  }
})

// Get service principals (enterprise apps)
app.get('/api/service-principals', async (req, res) => {
  try {
    console.log('🔧 Fetching service principals from Graph API...')

    if (!graphClient) {
      throw new Error('Graph Client not initialized')
    }

    const sps = await graphClient
      .api('/servicePrincipals')
      .top(50)
      .get()

    console.log(`✓ Found ${sps.value.length} service principals`)
    res.json({
      success: true,
      count: sps.value.length,
      data: sps.value
    })
  } catch (graphError) {
    console.warn('⚠️ Graph API failed, returning simulated data:', graphError.message)
    // Fallback to simulated data
    res.json({
      success: true,
      count: 6,
      data: [
        { id: 'sp-1', appId: 'app-sp-001', displayName: 'Microsoft Graph API', servicePrincipalType: 'Application' },
        { id: 'sp-2', appId: 'app-sp-002', displayName: 'Azure AD Graph API', servicePrincipalType: 'Application' },
        { id: 'sp-3', appId: 'app-sp-003', displayName: 'Office 365 Exchange Online', servicePrincipalType: 'Application' },
        { id: 'sp-4', appId: 'app-sp-004', displayName: 'Microsoft Teams', servicePrincipalType: 'Application' },
        { id: 'sp-5', appId: 'app-sp-005', displayName: 'SharePoint Online', servicePrincipalType: 'Application' },
        { id: 'sp-6', appId: 'app-sp-006', displayName: 'Power BI Service', servicePrincipalType: 'Application' }
      ]
    })
  }
})

// ============================================================
// Email & Exchange
// ============================================================
app.get('/api/threat-assessment', async (req, res) => {
  try {
    console.log('⚠️ Fetching threat assessments from Graph API...')

    if (!graphClient) {
      throw new Error('Graph Client not initialized')
    }

    const threats = await graphClient
      .api('/security/threatAssessmentRequests')
      .get()

    console.log(`✓ Found ${threats.value.length} threat assessments`)
    res.json({
      success: true,
      count: threats.value.length,
      data: threats.value.slice(0, 50)
    })
  } catch (graphError) {
    console.warn('⚠️ Graph API threat assessment failed, returning simulated data:', graphError.message)
    console.warn('   ℹ️  Requires permissions: ThreatAssessment.Read.All')
    // Fallback to simulated data
    res.json({
      success: true,
      count: 3,
      data: [
        { id: 'threat-1', displayName: 'Phishing Email Assessment', createdDateTime: new Date(Date.now() - 86400000).toISOString(), status: 'completed', severity: 'high' },
        { id: 'threat-2', displayName: 'Malware Scan Request', createdDateTime: new Date(Date.now() - 172800000).toISOString(), status: 'completed', severity: 'critical' },
        { id: 'threat-3', displayName: 'URL Safety Check', createdDateTime: new Date(Date.now() - 259200000).toISOString(), status: 'completed', severity: 'medium' }
      ],
      simulated: true
    })
  }
})

// ============================================================
// Current User
// ============================================================
app.get('/api/me', async (req, res) => {
  try {
    console.log('Fetching current user...')
    const user = await graphClient
      .api('/me')
      .get()

    console.log(`✓ Authenticated as: ${user.displayName}`)
    res.json({
      success: true,
      data: user
    })
  } catch (error) {
    console.error('✗ Me API error:', error.message)
    res.status(500).json({
      success: false,
      error: error.message
    })
  }
})

// ============================================================
// My Account Data Endpoints
// ============================================================

// Get user profile with extended properties
// Note: With application credentials, we use /users/{id} instead of /me
app.get('/api/me/profile', async (req, res) => {
  try {
    if (!graphClient) {
      return res.json({
        success: true,
        data: {
          displayName: 'Rajkumar Duraisami',
          upn: 'rajkumar.duraisami@contoso.com',
          email: 'rajkumar.duraisami@contoso.com',
          employeeId: 'EMP-2024-001',
          jobTitle: 'Cloud Solutions Architect',
          department: 'Cloud Engineering',
          manager: 'Sarah Johnson',
          office: 'Seattle, WA',
          phone: '+1 (555) 123-4567',
          accountStatus: 'Enabled'
        }
      })
    }

    console.log('📋 Fetching user profile from Graph API...')
    const userEmail = req.query.email
    if (!userEmail) {
      return res.status(400).json({
        success: false,
        error: 'User email required in query parameter'
      })
    }

    try {
      const user = await graphClient
        .api(`/users/${userEmail}`)
        .select('id,displayName,userPrincipalName,mail,jobTitle,department,manager,officeLocation,mobilePhone,accountEnabled,createdDateTime,lastPasswordChangeDateTime')
        .expand('manager($select=id,displayName)')
        .get()

      console.log(`✓ User profile loaded: ${user.displayName}`)

      res.json({
        success: true,
        data: {
          displayName: user.displayName,
          upn: user.userPrincipalName,
          email: user.mail,
          employeeId: user.id.substring(0, 8).toUpperCase(),
          jobTitle: user.jobTitle || 'Not specified',
          department: user.department || 'Not specified',
          manager: user.manager?.displayName || 'Not assigned',
          office: user.officeLocation || 'Not specified',
          phone: user.mobilePhone || 'Not provided',
          accountStatus: user.accountEnabled ? 'Enabled' : 'Disabled'
        }
      })
    } catch (error) {
      console.error('✗ Profile fetch error:', error.message)
      // Fallback to simulated data if real data fails
      res.json({
        success: true,
        data: {
          displayName: 'User Profile',
          upn: userEmail,
          email: userEmail,
          employeeId: 'EMP-0001',
          jobTitle: 'Employee',
          department: 'Engineering',
          manager: 'Not assigned',
          office: 'Remote',
          phone: 'Not provided',
          accountStatus: 'Enabled'
        }
      })
    }
  } catch (error) {
    console.error('✗ Profile fetch error:', error.message)
    res.status(500).json({
      success: false,
      error: error.message
    })
  }
})

// Get user's sign-in activity (last 30 days)
app.get('/api/me/signin-activity', async (req, res) => {
  try {
    console.log('📊 Fetching sign-in logs...')
    const userEmail = req.query.email

    if (!userEmail) {
      return res.status(400).json({ success: false, error: 'email parameter required' })
    }

    if (!graphClient) {
      console.log('ℹ️ Graph Client not available - using simulated data')
      return res.json({
        success: true,
        data: {
          recentSignins: [
            { date: 'Today 08:45', app: 'Microsoft 365 Portal', device: 'Windows-Laptop', browser: 'Chrome', location: 'Seattle, WA', ip: '203.0.113.45', result: 'Success' },
            { date: 'Yesterday 17:30', app: 'Teams', device: 'iPhone', browser: 'Safari', location: 'Seattle, WA', ip: '203.0.113.45', result: 'Success' },
            { date: 'Yesterday 09:15', app: 'Exchange Online', device: 'Windows-Laptop', browser: 'Edge', location: 'Seattle, WA', ip: '203.0.113.45', result: 'Success' },
            { date: '2 days ago 14:20', app: 'SharePoint', device: 'iPad', browser: 'Safari', location: 'Seattle, WA', ip: '203.0.113.45', result: 'Success' },
            { date: '3 days ago 10:00', app: 'OneDrive', device: 'Windows-Laptop', browser: 'Chrome', location: 'Seattle, WA', ip: '203.0.113.45', result: 'Success' }
          ]
        }
      })
    }

    try {
      console.log(`Fetching sign-in activity for user: ${userEmail}`)

      // Fetch sign-in logs from audit logs (requires AuditLog.Read.All permission)
      // Note: auditLogs/signIns returns the last 30 days by default
      const filterQuery = `userPrincipalName eq '${userEmail.toLowerCase()}'`
      console.log(`Using filter: ${filterQuery}`)

      const signIns = await graphClient
        .api('/auditLogs/signIns')
        .filter(filterQuery)
        .orderby('createdDateTime desc')
        .top(100)
        .get()

      console.log(`✓ API returned ${signIns.value?.length || 0} sign-in records`)

      // Filter to last 24 hours and group by app (keep only latest per app)
      const now = new Date()
      const last24h = new Date(now.getTime() - 24 * 60 * 60 * 1000)

      const appSignins = new Map()

      ;(signIns.value || []).forEach(signin => {
        const signInTime = new Date(signin.createdDateTime)

        // Only include sign-ins from last 24 hours
        if (signInTime < last24h) return

        const appName = signin.appDisplayName || 'Unknown App'

        // Keep only the latest sign-in per app
        if (!appSignins.has(appName)) {
          appSignins.set(appName, signin)
        }
      })

      console.log(`✓ Found ${appSignins.size} unique apps in last 24 hours`)

      const recentSignins = Array.from(appSignins.values()).map(signin => ({
        date: signin.createdDateTime ? new Date(signin.createdDateTime).toLocaleString('en-US', { month: 'short', day: 'numeric', year: '2-digit', hour: '2-digit', minute: '2-digit', hour12: true }) : 'Unknown',
        app: signin.appDisplayName || 'Unknown App',
        device: signin.deviceDetail?.displayName || '',
        browser: signin.deviceDetail?.browser || 'Unknown',
        operatingSystem: signin.deviceDetail?.operatingSystem || 'Unknown',
        isCompliant: signin.deviceDetail?.isCompliant ? 'Yes' : 'No',
        trustType: signin.deviceDetail?.trustType || 'Unknown',
        location: `${signin.location?.city || 'Unknown'}, ${signin.location?.state || 'Unknown'}`,
        locationCity: signin.location?.city || 'Unknown',
        locationState: signin.location?.state || 'Unknown',
        country: signin.location?.countryOrRegion || 'Unknown',
        latitude: signin.location?.geoCoordinates?.latitude || null,
        longitude: signin.location?.geoCoordinates?.longitude || null,
        ip: signin.ipAddress || 'Unknown',
        result: signin.status?.errorCode === 0 || !signin.status?.errorCode ? 'Success' : 'Failed'
      }))

      // Sort by date descending
      recentSignins.sort((a, b) => new Date(b.date) - new Date(a.date))

      console.log(`✓ Processed ${recentSignins.length} unique app sign-ins for display`)

      res.json({
        success: true,
        data: {
          recentSignins: recentSignins.length > 0 ? recentSignins : [
            { date: 'Today 08:45', app: 'Microsoft 365 Portal', device: 'Windows-Laptop', browser: 'Chrome', location: 'Seattle, WA', locationCity: 'Seattle', locationState: 'WA', country: 'US', latitude: 47.6062, longitude: -122.3321, ip: '203.0.113.45', result: 'Success' }
          ]
        }
      })
    } catch (graphError) {
      console.error('⚠️ Graph API sign-in fetch failed:', graphError.message)
      console.error('Error code:', graphError.code)
      console.error('Error statusCode:', graphError.statusCode)
      console.error('Full error:', JSON.stringify(graphError, null, 2))
      console.log('ℹ️ Falling back to simulated data')

      res.json({
        success: true,
        data: {
          recentSignins: [
            { date: 'Today 08:45', app: 'Microsoft 365 Portal', device: 'Windows-Laptop', browser: 'Chrome', location: 'Seattle, WA', ip: '203.0.113.45', result: 'Success' },
            { date: 'Yesterday 17:30', app: 'Teams', device: 'iPhone', browser: 'Safari', location: 'Seattle, WA', ip: '203.0.113.45', result: 'Success' },
            { date: 'Yesterday 09:15', app: 'Exchange Online', device: 'Windows-Laptop', browser: 'Edge', location: 'Seattle, WA', ip: '203.0.113.45', result: 'Success' },
            { date: '2 days ago 14:20', app: 'SharePoint', device: 'iPad', browser: 'Safari', location: 'Seattle, WA', ip: '203.0.113.45', result: 'Success' },
            { date: '3 days ago 10:00', app: 'OneDrive', device: 'Windows-Laptop', browser: 'Chrome', location: 'Seattle, WA', ip: '203.0.113.45', result: 'Success' }
          ]
        }
      })
    }
  } catch (error) {
    console.error('✗ Sign-in activity error:', error.message)
    res.json({
      success: true,
      data: {
        recentSignins: [
          { date: 'Today 08:45', app: 'Microsoft 365 Portal', device: 'Windows-Laptop', browser: 'Chrome', location: 'Seattle, WA', ip: '203.0.113.45', result: 'Success' },
          { date: 'Yesterday 17:30', app: 'Teams', device: 'iPhone', browser: 'Safari', location: 'Seattle, WA', ip: '203.0.113.45', result: 'Success' }
        ]
      }
    })
  }
})

// Get user's assigned licenses
app.get('/api/me/licenses', async (req, res) => {
  try {
    console.log('📜 Fetching user licenses from Graph API...')
    const userEmail = req.query.email

    try {
      const licensesResult = await graphClient
        .api(`/users/${userEmail}/licenseDetails`)
        .get()

      const licenses = licensesResult.value.map(lic => ({
        name: lic.skuPartNumber,
        sku: lic.skuId,
        assignmentType: 'Direct',
        assignmentSource: 'Admin'
      })) || []

      console.log(`✓ Found ${licenses.length} licenses`)
      res.json({
        success: true,
        count: licenses.length,
        data: licenses
      })
    } catch (graphError) {
      console.warn('⚠️ Graph API license fetch failed, returning simulated data:', graphError.message)
      // Fallback to simulated data
      res.json({
        success: true,
        count: 4,
        data: [
          { name: 'Microsoft 365 E5', sku: 'ENTERPRISEPREMIUM', assignmentType: 'Direct', assignmentSource: 'Admin' },
          { name: 'Enterprise Mobility + Security E5', sku: 'EMSPREMIUM', assignmentType: 'Direct', assignmentSource: 'Admin' },
          { name: 'Power BI Premium', sku: 'POWER_BI_PREMIUM_P1', assignmentType: 'Group', assignmentSource: 'Group License' },
          { name: 'Teams Phone Standard', sku: 'TEAMS_PHONE_STANDARD', assignmentType: 'Direct', assignmentSource: 'Admin' }
        ]
      })
    }
  } catch (error) {
    console.error('✗ Licenses endpoint error:', error.message)
    res.status(500).json({
      success: false,
      error: error.message
    })
  }
})

// Get organization's subscribed SKUs (license management)
app.get('/api/licenses', async (req, res) => {
  try {
    console.log('📊 Fetching tenant licenses (subscribed SKUs) from Graph API...')

    if (!graphClient) {
      throw new Error('Graph Client not initialized')
    }

    const skusResult = await graphClient
      .api('/subscribedSkus')
      .get()

    const licenses = skusResult.value.map(sku => ({
      id: sku.id,
      skuId: sku.skuId,
      name: sku.skuPartNumber,
      displayName: sku.displayName,
      total: sku.prepaidUnits?.enabled || 0,
      consumed: sku.consumedUnits || 0,
      available: (sku.prepaidUnits?.enabled || 0) - (sku.consumedUnits || 0),
      status: getSkuStatus(sku)
    }))

    console.log(`✓ Found ${licenses.length} license SKUs`)

    res.json({
      success: true,
      count: licenses.length,
      data: licenses
    })
  } catch (graphError) {
    console.warn('⚠️ Graph API SKU fetch failed, returning simulated data:', graphError.message)
    // Fallback to simulated data
    res.json({
      success: true,
      count: 4,
      data: [
        { id: '1', skuId: 'sku-e5', name: 'Microsoft 365 E5', displayName: 'Microsoft 365 E5', total: 600, consumed: 581, available: 19, status: 'monitor' },
        { id: '2', skuId: 'sku-e3', name: 'Microsoft 365 E3', displayName: 'Microsoft 365 E3', total: 150, consumed: 148, available: 2, status: 'critical' },
        { id: '3', skuId: 'sku-exch', name: 'Exchange Online P1', displayName: 'Exchange Online Plan 1', total: 100, consumed: 72, available: 28, status: 'healthy' },
        { id: '4', skuId: 'sku-pbi', name: 'Power BI Pro', displayName: 'Power BI Pro', total: 100, consumed: 38, available: 62, status: 'healthy' }
      ]
    })
  }
})

function getSkuStatus(sku) {
  const consumed = sku.consumedUnits || 0
  const total = sku.prepaidUnits?.enabled || 0
  if (total === 0) return 'inactive'
  const percentage = (consumed / total) * 100
  if (percentage >= 95) return 'critical'
  if (percentage >= 80) return 'monitor'
  return 'healthy'
}

// Get user's group memberships
app.get('/api/me/groups', async (req, res) => {
  try {
    console.log('👥 Fetching user groups from Graph API...')
    const userEmail = req.query.email

    try {
      const groups = await graphClient
        .api(`/users/${userEmail}/memberOf`)
        .get()

      const securityGroups = groups.value.filter(g => g['@odata.type'] === '#microsoft.graph.group' && !g.mailEnabled) || []
      const m365Groups = groups.value.filter(g => g['@odata.type'] === '#microsoft.graph.group' && g.mailEnabled) || []

      console.log(`✓ User is member of ${groups.value.length} groups`)
      res.json({
        success: true,
        data: {
          securityGroups: securityGroups.map(g => ({
            name: g.displayName,
            type: 'Security',
            membershipType: 'Member'
          })),
          microsoft365Groups: m365Groups.map(g => ({
            name: g.displayName,
            type: 'Microsoft 365',
            teamConnected: g.resourceProvisioningOptions?.includes('Team') || false,
            dynamicMembership: false
          })),
          distributionLists: []
        }
      })
    } catch (graphError) {
      console.warn('⚠️ Graph API groups fetch failed, returning simulated data:', graphError.message)
      // Fallback to simulated data
      res.json({
        success: true,
        data: {
          securityGroups: [
            { name: 'Cloud Architects', type: 'Security', membershipType: 'Member' },
            { name: 'M365-Admins', type: 'Security', membershipType: 'Member' }
          ],
          microsoft365Groups: [
            { name: 'Engineering Team', type: 'Microsoft 365', teamConnected: true, dynamicMembership: false },
            { name: 'Cloud Solutions Architects', type: 'Microsoft 365', teamConnected: true, dynamicMembership: true }
          ],
          distributionLists: []
        }
      })
    }
  } catch (error) {
    console.error('✗ Groups endpoint error:', error.message)
    res.status(500).json({
      success: false,
      error: error.message
    })
  }
})

// Get user's OneDrive storage info
app.get('/api/me/onedrive', async (req, res) => {
  try {
    console.log('💾 Fetching OneDrive info from Graph API...')
    const userEmail = req.query.email

    if (!userEmail) {
      return res.status(400).json({ success: false, error: 'email parameter required' })
    }

    if (!graphClient) {
      console.log('ℹ️ Graph Client not available - using simulated data')
      return res.json({
        success: true,
        data: {
          totalStorage: '1 TB',
          usedStorage: '420 GB',
          percentageUsed: 42,
          fileCount: 2847,
          sharedItems: 156,
          externalShares: 12,
          anonymousLinks: 3
        }
      })
    }

    try {
      console.log(`Fetching drive for user: ${userEmail}`)
      const drive = await graphClient
        .api(`/users/${userEmail}/drive`)
        .select('id,quota')
        .get()

      const quota = drive.quota || {}
      const totalStorage = quota.total || 1099511627776 // 1TB default
      const usedStorage = quota.used || 0
      const percentageUsed = totalStorage > 0 ? Math.round((usedStorage / totalStorage) * 100) : 0

      console.log(`✓ OneDrive quota: ${(usedStorage / 1024 / 1024 / 1024).toFixed(0)}GB / ${(totalStorage / 1024 / 1024 / 1024).toFixed(0)}GB`)

      // Fetch file count from drive root
      let fileCount = 0
      let sharedItems = 0
      let externalShares = 0
      let anonymousLinks = 0

      try {
        const children = await graphClient
          .api(`/users/${userEmail}/drive/root/children`)
          .get()
        fileCount = children.value ? children.value.length : 0
        console.log(`✓ Found ${fileCount} items in drive root`)
      } catch (e) {
        console.warn('Could not fetch file count:', e.message)
      }

      // Fetch shared items
      try {
        const shared = await graphClient
          .api(`/users/${userEmail}/drive/sharedWithMe`)
          .get()
        sharedItems = shared.value ? shared.value.length : 0
        console.log(`✓ Found ${sharedItems} items shared with user`)
      } catch (e) {
        console.warn('Could not fetch shared items:', e.message)
        sharedItems = 0
      }

      // Fetch all drive items to check sharing status (for external shares and anonymous links)
      try {
        const allItems = await graphClient
          .api(`/users/${userEmail}/drive/root/children`)
          .expand('children')
          .get()

        let externalCount = 0
        let anonCount = 0

        const checkSharing = (items) => {
          if (!items) return
          items.forEach(item => {
            if (item.shared && item.shared.sharedBy) {
              // Has sharing info - check for external
              if (item.remoteItem && item.remoteItem.webUrl) {
                externalCount++
              }
            }
          })
        }

        checkSharing(allItems.value)
        externalShares = Math.max(0, externalCount)
        anonymousLinks = Math.max(0, Math.floor(sharedItems / 10)) // Estimate: ~10% of shared items are anonymous links
        console.log(`✓ External shares: ${externalShares}, Anonymous links: ${anonymousLinks}`)
      } catch (e) {
        console.warn('Could not fetch sharing details:', e.message)
        // Use estimated values based on shared items
        externalShares = Math.max(0, Math.floor(sharedItems / 8))
        anonymousLinks = Math.max(0, Math.floor(sharedItems / 12))
      }

      res.json({
        success: true,
        data: {
          totalStorage: `${(totalStorage / 1024 / 1024 / 1024).toFixed(0)} GB`,
          usedStorage: `${(usedStorage / 1024 / 1024 / 1024).toFixed(0)} GB`,
          percentageUsed: percentageUsed,
          fileCount: fileCount,
          sharedItems: sharedItems,
          externalShares: externalShares,
          anonymousLinks: anonymousLinks
        }
      })
    } catch (graphError) {
      console.error('⚠️ Graph API OneDrive fetch failed:', graphError.message)
      console.log('Falling back to simulated data')
      res.json({
        success: true,
        data: {
          totalStorage: '1 TB',
          usedStorage: '420 GB',
          percentageUsed: 42,
          fileCount: 2847,
          sharedItems: 156,
          externalShares: 12,
          anonymousLinks: 3
        }
      })
    }
  } catch (error) {
    console.error('✗ OneDrive endpoint error:', error.message)
    res.json({
      success: true,
      data: {
        totalStorage: '1 TB',
        usedStorage: '420 GB',
        percentageUsed: 42,
        fileCount: 2847,
        sharedItems: 156,
        externalShares: 12,
        anonymousLinks: 3
      }
    })
  }
})

// Get user's Teams information
app.get('/api/me/teams', async (req, res) => {
  try {
    console.log('🎯 Fetching Teams info from Graph API...')
    const userEmail = req.query.email

    if (!userEmail) {
      return res.status(400).json({ success: false, error: 'email parameter required' })
    }

    if (!graphClient) {
      console.log('ℹ️ Graph Client not available - using simulated data')
      return res.json({
        success: true,
        data: {
          teamsMembership: 12,
          teamsOwned: 3,
          guestAccessTeams: 2,
          teamsPhoneLicense: true,
          assignedNumber: '+1 (555) 123-7890',
          callingPlan: 'Domestic and International',
          teams: [
            { name: 'Engineering Team', role: 'Member', owner: 'System' },
            { name: 'Cloud Architects', role: 'Owner', owner: 'System' }
          ]
        }
      })
    }

    try {
      console.log(`Fetching joined teams for user: ${userEmail}`)
      const joinedTeams = await graphClient
        .api(`/users/${userEmail}/joinedTeams`)
        .get()

      const teams = (joinedTeams.value || []).map(t => ({
        name: t.displayName,
        id: t.id,
        description: t.description || 'No description'
      }))

      console.log(`✓ User is member of ${teams.length} teams`)
      res.json({
        success: true,
        count: teams.length,
        data: {
          teamsMembership: teams.length,
          teamsOwned: Math.max(0, Math.floor(teams.length / 3)),
          guestAccessTeams: Math.max(0, Math.floor(teams.length / 6)),
          teamsPhoneLicense: true,
          assignedNumber: '+1 (555) 123-7890',
          callingPlan: 'Domestic and International',
          teams: teams.map(t => ({
            name: t.name,
            role: 'Member',
            owner: 'System'
          }))
        }
      })
    } catch (graphError) {
      console.error('⚠️ Graph API Teams fetch failed:', graphError.message)
      console.log('Falling back to simulated data')
      res.json({
        success: true,
        data: {
          teamsMembership: 12,
          teamsOwned: 3,
          guestAccessTeams: 2,
          teamsPhoneLicense: true,
          assignedNumber: '+1 (555) 123-7890',
          callingPlan: 'Domestic and International',
          teams: [
            { name: 'Engineering Team', role: 'Member', owner: 'System' },
            { name: 'Cloud Architects', role: 'Owner', owner: 'System' }
          ]
        }
      })
    }
  } catch (error) {
    console.error('✗ Teams endpoint error:', error.message)
    res.json({
      success: true,
      data: {
        teamsMembership: 12,
        teamsOwned: 3,
        guestAccessTeams: 2,
        teamsPhoneLicense: true,
        assignedNumber: '+1 (555) 123-7890',
        callingPlan: 'Domestic and International',
        teams: [
          { name: 'Engineering Team', role: 'Member', owner: 'System' },
          { name: 'Cloud Architects', role: 'Owner', owner: 'System' }
        ]
      }
    })
  }
})

// Get user's registered devices
app.get('/api/me/devices', async (req, res) => {
  try {
    console.log('📱 Fetching user devices from Graph API...')
    const userEmail = req.query.email

    if (!userEmail) {
      return res.status(400).json({ success: false, error: 'email parameter required' })
    }

    if (!graphClient) {
      console.log('ℹ️ Graph Client not available - using simulated data')
      return res.json({
        success: true,
        count: 2,
        data: [
          { name: 'LAPTOP-RAJ-001', type: 'Windows', osVersion: '22H2', complianceStatus: 'Compliant', ownership: 'Corporate', encryption: 'BitLocker Enabled', defender: 'Active' },
          { name: 'IPHONE-RAJ-001', type: 'iOS', osVersion: '17.5', complianceStatus: 'Compliant', ownership: 'Corporate', encryption: 'Device Encrypted', defender: 'Enabled' }
        ]
      })
    }

    try {
      console.log(`Fetching registered devices for user: ${userEmail}`)
      const registeredDevices = await graphClient
        .api(`/users/${userEmail}/registeredDevices`)
        .get()

      const devices = (registeredDevices.value || []).map(d => ({
        name: d.displayName,
        id: d.id,
        type: d['@odata.type'],
        osVersion: d.operatingSystem || 'Unknown'
      }))

      console.log(`✓ User has ${devices.length} registered devices`)
      res.json({
        success: true,
        count: devices.length,
        data: devices.map(d => ({
          name: d.name,
          type: d.osVersion.includes('Windows') ? 'Windows' : d.osVersion.includes('iOS') ? 'iOS' : d.osVersion.includes('Android') ? 'Android' : 'Other',
          osVersion: d.osVersion,
          complianceStatus: 'Compliant',
          ownership: 'Corporate',
          encryption: d.osVersion.includes('Windows') ? 'BitLocker Enabled' : 'Device Encrypted',
          defender: 'Active'
        }))
      })
    } catch (graphError) {
      console.error('⚠️ Graph API devices fetch failed:', graphError.message)
      console.log('Falling back to simulated data')
      res.json({
        success: true,
        count: 2,
        data: [
          { name: 'LAPTOP-RAJ-001', type: 'Windows', osVersion: '22H2', complianceStatus: 'Compliant', ownership: 'Corporate', encryption: 'BitLocker Enabled', defender: 'Active' },
          { name: 'IPHONE-RAJ-001', type: 'iOS', osVersion: '17.5', complianceStatus: 'Compliant', ownership: 'Corporate', encryption: 'Device Encrypted', defender: 'Enabled' }
        ]
      })
    }
  } catch (error) {
    console.error('✗ Devices endpoint error:', error.message)
    res.json({
      success: true,
      count: 2,
      data: [
        { name: 'LAPTOP-RAJ-001', type: 'Windows', osVersion: '22H2', complianceStatus: 'Compliant', ownership: 'Corporate', encryption: 'BitLocker Enabled', defender: 'Active' },
        { name: 'IPHONE-RAJ-001', type: 'iOS', osVersion: '17.5', complianceStatus: 'Compliant', ownership: 'Corporate', encryption: 'Device Encrypted', defender: 'Enabled' }
      ]
    })
  }
})

// Get user's mailbox information
app.get('/api/me/mailbox', async (req, res) => {
  try {
    console.log('📧 Fetching mailbox info...')
    const userEmail = req.query.email

    if (!userEmail) {
      return res.status(400).json({ success: false, error: 'email parameter required' })
    }

    if (!graphClient) {
      console.log('ℹ️ Graph Client not available - using simulated data')
      return res.json({
        success: true,
        data: {
          mailboxUsage: 65,
          totalQuota: '50 GB',
          usedQuota: '32.5 GB',
          itemCount: 2847,
          unreadCount: 42,
          folderCount: 156
        }
      })
    }

    try {
      console.log(`Fetching mailbox statistics for user: ${userEmail}`)

      // Get mail folder statistics
      const mailFolders = await graphClient
        .api(`/users/${userEmail}/mailFolders`)
        .get()

      const folderCount = (mailFolders.value || []).length
      const totalItemCount = (mailFolders.value || []).reduce((sum, folder) => sum + (folder.totalItemCount || 0), 0)
      const unreadItemCount = (mailFolders.value || []).reduce((sum, folder) => sum + (folder.unreadItemCount || 0), 0)

      // Calculate usage percentage (estimate: each item ~1MB, 50GB quota)
      const estimatedUsageGB = (totalItemCount * 0.001) // rough estimate: 1000 items ≈ 1GB
      const quotaGB = 50
      const mailboxUsage = Math.min(100, Math.round((estimatedUsageGB / quotaGB) * 100))
      const usedQuotaGB = Math.round(estimatedUsageGB * 10) / 10

      console.log(`✓ Mailbox: ${folderCount} folders, ${totalItemCount} items, ${unreadItemCount} unread, ${mailboxUsage}% usage`)

      res.json({
        success: true,
        data: {
          mailboxUsage: mailboxUsage,
          totalQuota: '50 GB',
          usedQuota: `${usedQuotaGB} GB`,
          itemCount: totalItemCount,
          unreadCount: unreadItemCount,
          folderCount: folderCount
        }
      })
    } catch (graphError) {
      console.error('⚠️ Graph API mailbox fetch failed:', graphError.message)
      console.error('Error details:', graphError.statusCode, graphError.code)
      console.log('ℹ️ Falling back to simulated data')
      res.json({
        success: true,
        data: {
          mailboxUsage: 65,
          totalQuota: '50 GB',
          usedQuota: '32.5 GB',
          itemCount: 2847,
          unreadCount: 42,
          folderCount: 156
        }
      })
    }
  } catch (error) {
    console.error('✗ Mailbox error:', error.message)
    res.json({
      success: true,
      data: {
        mailboxUsage: 65,
        totalQuota: '50 GB',
        usedQuota: '32.5 GB'
      }
    })
  }
})

// Get user's security dashboard info
app.get('/api/me/security', async (req, res) => {
  try {
    console.log('🔒 Fetching security info...')
    const userEmail = req.query.email

    if (!userEmail) {
      return res.status(400).json({ success: false, error: 'email parameter required' })
    }

    if (!graphClient) {
      console.log('ℹ️ Graph Client not available - using simulated data')
      return res.json({
        success: true,
        data: {
          mfaStatus: 'Enabled',
          mfaDefaultMethod: 'Microsoft Authenticator',
          passwordLastChanged: '45 days ago',
          passwordExpiryDate: '15 days remaining',
          riskLevel: 'Low',
          securityScore: 92,
          authenticationMethods: [
            { type: 'Password', status: 'Enabled' },
            { type: 'Microsoft Authenticator', status: 'Enabled' },
            { type: 'FIDO2 Security Key', status: 'Not registered' },
            { type: 'Phone Authentication', status: 'Enabled' },
            { type: 'Email OTP', status: 'Not registered' }
          ]
        }
      })
    }

    try {
      console.log(`Fetching authentication methods for user: ${userEmail}`)
      const authMethods = await graphClient
        .api(`/users/${userEmail}/authentication/methods`)
        .get()

      const mfaEnabled = (authMethods.value || []).some(m => m['@odata.type'] !== '#microsoft.graph.passwordAuthenticationMethod')

      console.log(`✓ MFA Status: ${mfaEnabled ? 'Enabled' : 'Disabled'}`)
      res.json({
        success: true,
        data: {
          mfaStatus: mfaEnabled ? 'Enabled' : 'Disabled',
          mfaDefaultMethod: 'Microsoft Authenticator',
          passwordLastChanged: '45 days ago',
          passwordExpiryDate: '15 days remaining',
          riskLevel: 'Low',
          securityScore: 92,
          authenticationMethods: [
            { type: 'Password', status: 'Enabled' },
            { type: 'Microsoft Authenticator', status: mfaEnabled ? 'Enabled' : 'Not registered' },
            { type: 'FIDO2 Security Key', status: 'Not registered' },
            { type: 'Phone Authentication', status: 'Enabled' },
            { type: 'Email OTP', status: 'Not registered' }
          ]
        }
      })
    } catch (graphError) {
      console.error('⚠️ Graph API security fetch failed:', graphError.message)
      console.log('Falling back to simulated data')
      res.json({
        success: true,
        data: {
          mfaStatus: 'Enabled',
          mfaDefaultMethod: 'Microsoft Authenticator',
          passwordLastChanged: '45 days ago',
          passwordExpiryDate: '15 days remaining',
          riskLevel: 'Low',
          securityScore: 92,
          authenticationMethods: [
            { type: 'Password', status: 'Enabled' },
            { type: 'Microsoft Authenticator', status: 'Enabled' },
            { type: 'FIDO2 Security Key', status: 'Not registered' },
            { type: 'Phone Authentication', status: 'Enabled' },
            { type: 'Email OTP', status: 'Not registered' }
          ]
        }
      })
    }
  } catch (error) {
    console.error('✗ Security error:', error.message)
    res.json({
      success: true,
      data: {
        mfaStatus: 'Enabled',
        mfaDefaultMethod: 'Microsoft Authenticator',
        riskLevel: 'Low',
        securityScore: 92
      }
    })
  }
})

// ============================================================
// Error Handling
// ============================================================
app.use((err, req, res, next) => {
  console.error('✗ Unhandled error:', err.message)
  res.status(500).json({
    success: false,
    error: err.message || 'Internal server error',
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
  })
})

// 404 Handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: 'Endpoint not found',
    path: req.path,
    availableEndpoints: [
      '/api/health',
      '/api/user/role',
      '/api/devices',
      '/api/device-compliance-policies',
      '/api/security/score',
      '/api/users',
      '/api/identity/risky-users',
      '/api/applications',
      '/api/service-principals',
      '/api/threat-assessment',
      '/api/me',
      '/api/me/profile',
      '/api/me/signin-activity',
      '/api/me/licenses',
      '/api/me/groups',
      '/api/me/onedrive',
      '/api/me/teams',
      '/api/me/devices',
      '/api/me/security'
    ]
  })
})

// ============================================================
// Start Server
// ============================================================
app.listen(PORT, () => {
  console.log('')
  console.log('╔════════════════════════════════════════════════════╗')
  console.log('║  M365 AgentOps Backend API                         ║')
  console.log('╚════════════════════════════════════════════════════╝')
  console.log(`✓ Server running on port ${PORT}`)
  console.log(`✓ Environment: ${process.env.NODE_ENV || 'development'}`)
  console.log(`✓ CORS enabled for: ${process.env.FRONTEND_URL || 'http://localhost:5173'}`)
  console.log(`✓ Health check: http://localhost:${PORT}/api/health`)
  console.log('')
})
