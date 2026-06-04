import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import { ClientSecretCredential } from '@azure/identity'
import { Client } from '@microsoft/microsoft-graph-client'
import { TokenCredentialAuthenticationProvider } from '@microsoft/microsoft-graph-client/authProviders/azureTokenCredentials/index.js'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 3000

// ============================================================
// Middleware
// ============================================================
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}))

app.use(express.json())

// ============================================================
// Azure Identity & Graph Client Setup
// ============================================================
const credential = new ClientSecretCredential(
  process.env.AZURE_TENANT_ID,
  process.env.AZURE_CLIENT_ID,
  process.env.AZURE_CLIENT_SECRET
)

const authProvider = new TokenCredentialAuthenticationProvider(credential, {
  scopes: ['https://graph.microsoft.com/.default']
})

const graphClient = Client.initWithMiddleware({ authProvider })

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
    console.log('Fetching secure score...')
    const scores = await graphClient
      .api('/security/secureScores')
      .get()

    const latestScore = scores.value[0] || null
    if (!latestScore) {
      return res.json({
        success: false,
        error: 'No secure score data found',
        hint: 'User may need Microsoft Defender for Office 365 or premium security license'
      })
    }

    console.log(`✓ Secure score: ${latestScore.currentScore}/${latestScore.maxScore}`)
    res.json({
      success: true,
      data: latestScore
    })
  } catch (error) {
    console.error('✗ Secure score error:', error.message)
    res.status(500).json({
      success: false,
      error: error.message,
      endpoint: '/security/secureScores',
      hint: 'Requires Microsoft Defender for Office 365'
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
    console.log('Fetching risky users...')
    const riskyUsers = await graphClient
      .api('/identityProtection/riskyUsers')
      .get()

    console.log(`✓ Found ${riskyUsers.value.length} risky users`)
    res.json({
      success: true,
      count: riskyUsers.value.length,
      data: riskyUsers.value
    })
  } catch (error) {
    console.error('✗ Risky users error:', error.message)
    res.status(500).json({
      success: false,
      error: error.message,
      hint: 'Requires Azure AD Premium P2 license'
    })
  }
})

// ============================================================
// Applications (Entra Apps)
// ============================================================
app.get('/api/applications', async (req, res) => {
  try {
    console.log('Fetching applications...')
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
  } catch (error) {
    console.error('✗ Applications API error:', error.message)
    res.status(500).json({
      success: false,
      error: error.message
    })
  }
})

// Get service principals (enterprise apps)
app.get('/api/service-principals', async (req, res) => {
  try {
    console.log('Fetching service principals...')
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
  } catch (error) {
    console.error('✗ Service principals error:', error.message)
    res.status(500).json({
      success: false,
      error: error.message
    })
  }
})

// ============================================================
// Email & Exchange
// ============================================================
app.get('/api/threat-assessment', async (req, res) => {
  try {
    console.log('Fetching threat assessments...')
    const threats = await graphClient
      .api('/security/threatAssessmentRequests')
      .get()

    console.log(`✓ Found ${threats.value.length} threat assessments`)
    res.json({
      success: true,
      count: threats.value.length,
      data: threats.value.slice(0, 50)
    })
  } catch (error) {
    console.error('✗ Threat assessment error:', error.message)
    res.status(500).json({
      success: false,
      error: error.message,
      hint: 'May require SecurityEvents.Read.All permission'
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
      '/api/devices',
      '/api/device-compliance-policies',
      '/api/security/score',
      '/api/users',
      '/api/identity/risky-users',
      '/api/applications',
      '/api/service-principals',
      '/api/threat-assessment',
      '/api/me'
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
