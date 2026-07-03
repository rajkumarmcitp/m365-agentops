/**
 * Setup Configuration Service
 * Manages setup wizard configuration stored in SharePoint
 */

let graphClient = null

export function setSetupConfigGraphClient(client) {
  graphClient = client
}

/**
 * Initialize Setup Configuration SharePoint List
 * Creates the list if it doesn't exist
 */
export async function initializeSetupConfigList() {
  if (!graphClient) throw new Error('Graph client not initialized')

  try {
    const siteId = process.env.SHAREPOINT_SITE_ID
    if (!siteId) throw new Error('SHAREPOINT_SITE_ID not configured')

    // Extract site ID from the format: "nasstech.sharepoint.com,3f6b857f-3e5d-4c24-b085-21dcd5224220,ad0ee341-52a0-40e9-927d-540a45bc0523"
    const [siteName, siteGuid, webGuid] = siteId.split(',')

    // Check if list already exists
    const lists = await graphClient
      .api(`/sites/${webGuid}/lists`)
      .select('id,displayName')
      .get()

    const existingList = lists.value.find(l => l.displayName === 'Setup-Configuration')
    if (existingList) {
      console.log('✅ Setup-Configuration list already exists')
      return existingList
    }

    // Create list
    console.log('📋 Creating Setup-Configuration list...')
    const listDef = {
      displayName: 'Setup-Configuration',
      description: 'Stores M365 AgentOps setup wizard configuration',
      template: 'genericList'
    }

    const newList = await graphClient
      .api(`/sites/${webGuid}/lists`)
      .post(listDef)

    console.log('✅ Setup-Configuration list created:', newList.id)

    // Add columns
    await addColumnsToList(webGuid, newList.id)

    return newList
  } catch (error) {
    console.error('❌ Failed to initialize setup config list:', error.message)
    throw error
  }
}

async function addColumnsToList(webGuid, listId) {
  const columns = [
    {
      displayName: 'TenantId',
      name: 'TenantId',
      text: { allowMultipleLines: false }
    },
    {
      displayName: 'ClientId',
      name: 'ClientId',
      text: { allowMultipleLines: false }
    },
    {
      displayName: 'ClientSecret',
      name: 'ClientSecret',
      text: { allowMultipleLines: false }
    },
    {
      displayName: 'RedirectUri',
      name: 'RedirectUri',
      text: { allowMultipleLines: false }
    },
    {
      displayName: 'RoleSuper',
      name: 'RoleSuper',
      text: { allowMultipleLines: false }
    },
    {
      displayName: 'RoleAdmin',
      name: 'RoleAdmin',
      text: { allowMultipleLines: false }
    },
    {
      displayName: 'RoleManager',
      name: 'RoleManager',
      text: { allowMultipleLines: false }
    },
    {
      displayName: 'GraphApiPermissions',
      name: 'GraphApiPermissions',
      text: { allowMultipleLines: true }
    },
    {
      displayName: 'SuperAdminEmail',
      name: 'SuperAdminEmail',
      text: { allowMultipleLines: false }
    },
    {
      displayName: 'TwoFactorRequired',
      name: 'TwoFactorRequired',
      choice: { choices: ['true', 'false'] }
    },
    {
      displayName: 'AuditLoggingEnabled',
      name: 'AuditLoggingEnabled',
      choice: { choices: ['true', 'false'] }
    },
    {
      displayName: 'EmailNotificationsEnabled',
      name: 'EmailNotificationsEnabled',
      choice: { choices: ['true', 'false'] }
    },
    {
      displayName: 'SetupStatus',
      name: 'SetupStatus',
      choice: { choices: ['Pending', 'In-Progress', 'Complete'] }
    },
    {
      displayName: 'CompletedSteps',
      name: 'CompletedSteps',
      text: { allowMultipleLines: true }
    }
  ]

  try {
    for (const col of columns) {
      try {
        await graphClient
          .api(`/sites/${webGuid}/lists/${listId}/columns`)
          .post(col)
      } catch (err) {
        if (err.statusCode !== 409) throw err // 409 = already exists
      }
    }
    console.log('✅ Setup-Configuration columns added')
  } catch (error) {
    console.warn('⚠️ Some columns may already exist:', error.message)
  }
}

/**
 * Save setup wizard step data to SharePoint
 */
export async function saveSetupStep(stepData) {
  if (!graphClient) {
    console.warn('⚠️ Graph client not initialized, using demo mode')
    return { id: 'demo-' + Date.now() }
  }

  try {
    const siteId = process.env.SHAREPOINT_SITE_ID
    if (!siteId || siteId.includes('undefined')) {
      console.warn('⚠️ SHAREPOINT_SITE_ID not properly configured, using demo mode')
      return { id: 'demo-' + Date.now() }
    }
    const [, , webGuid] = siteId.split(',')

    // Get list ID
    const lists = await graphClient
      .api(`/sites/${webGuid}/lists`)
      .select('id,displayName')
      .get()

    const list = lists.value.find(l => l.displayName === 'Setup-Configuration')
    if (!list) throw new Error('Setup-Configuration list not found')

    // Check if item already exists
    const items = await graphClient
      .api(`/sites/${webGuid}/lists/${list.id}/items`)
      .filter(`fields/Title eq '${stepData.step}'`)
      .select('id')
      .get()

    const item = {
      fields: {
        Title: stepData.step,
        TenantId: stepData.tenantId || '',
        ClientId: stepData.clientId || '',
        ClientSecret: stepData.clientSecret || '',
        RedirectUri: stepData.redirectUri || '',
        RoleSuper: stepData.roleSuper || '',
        RoleAdmin: stepData.roleAdmin || '',
        RoleManager: stepData.roleManager || '',
        GraphApiPermissions: JSON.stringify(stepData.graphApiPermissions || []),
        SuperAdminEmail: stepData.superAdminEmail || '',
        TwoFactorRequired: String(stepData.twoFactorRequired || true),
        AuditLoggingEnabled: String(stepData.auditLoggingEnabled || true),
        EmailNotificationsEnabled: String(stepData.emailNotificationsEnabled || true),
        SetupStatus: stepData.setupStatus || 'In-Progress',
        CompletedSteps: JSON.stringify(stepData.completedSteps || [])
      }
    }

    let result
    if (items.value.length > 0) {
      // Update existing item
      const itemId = items.value[0].id
      result = await graphClient
        .api(`/sites/${webGuid}/lists/${list.id}/items/${itemId}`)
        .patch(item)
      console.log(`✅ Setup step "${stepData.step}" updated`)
    } else {
      // Create new item
      result = await graphClient
        .api(`/sites/${webGuid}/lists/${list.id}/items`)
        .post(item)
      console.log(`✅ Setup step "${stepData.step}" saved`)
    }

    return result
  } catch (error) {
    console.warn('⚠️ Failed to save setup step to SharePoint:', error.message)
    console.warn('⚠️ Using demo mode - configuration will not persist')
    // Return a demo response so the frontend can continue
    return { id: 'demo-' + Date.now() }
  }
}

/**
 * Get setup configuration from SharePoint
 */
export async function getSetupConfig() {
  if (!graphClient) {
    console.warn('⚠️ Graph client not initialized, using demo mode')
    return { setupStatus: 'Pending', completedSteps: [] }
  }

  try {
    const siteId = process.env.SHAREPOINT_SITE_ID
    if (!siteId || siteId.includes('undefined')) {
      console.warn('⚠️ SHAREPOINT_SITE_ID not properly configured')
      return { setupStatus: 'Pending', completedSteps: [] }
    }
    const [, , webGuid] = siteId.split(',')

    const lists = await graphClient
      .api(`/sites/${webGuid}/lists`)
      .select('id,displayName')
      .get()

    const list = lists.value.find(l => l.displayName === 'Setup-Configuration')
    if (!list) {
      return { setupStatus: 'Pending', completedSteps: [] }
    }

    const items = await graphClient
      .api(`/sites/${webGuid}/lists/${list.id}/items`)
      .select('fields')
      .expand('fields')
      .get()

    if (!items.value.length) {
      return { setupStatus: 'Pending', completedSteps: [] }
    }

    // Parse items into config object
    const config = {
      setupStatus: 'Pending',
      completedSteps: [],
      steps: {}
    }

    for (const item of items.value) {
      const f = item.fields
      const stepKey = f.Title

      config.steps[stepKey] = {
        tenantId: f.TenantId || '',
        clientId: f.ClientId || '',
        clientSecret: f.ClientSecret || '', // In production, don't return this
        redirectUri: f.RedirectUri || '',
        roleSuper: f.RoleSuper || '',
        roleAdmin: f.RoleAdmin || '',
        roleManager: f.RoleManager || '',
        graphApiPermissions: tryParse(f.GraphApiPermissions, []),
        superAdminEmail: f.SuperAdminEmail || '',
        twoFactorRequired: f.TwoFactorRequired === 'true',
        auditLoggingEnabled: f.AuditLoggingEnabled === 'true',
        emailNotificationsEnabled: f.EmailNotificationsEnabled === 'true'
      }

      if (f.SetupStatus === 'Complete') {
        config.setupStatus = 'Complete'
      } else if (f.SetupStatus === 'In-Progress' && config.setupStatus === 'Pending') {
        config.setupStatus = 'In-Progress'
      }

      const completed = tryParse(f.CompletedSteps, [])
      config.completedSteps = [...new Set([...config.completedSteps, ...completed])]
    }

    return config
  } catch (error) {
    console.error('❌ Failed to get setup config:', error.message)
    return { setupStatus: 'Pending', completedSteps: [] }
  }
}

/**
 * Mark setup as complete
 */
export async function completeSetup(superAdminEmail) {
  if (!graphClient) throw new Error('Graph client not initialized')

  try {
    const siteId = process.env.SHAREPOINT_SITE_ID
    const [, , webGuid] = siteId.split(',')

    const lists = await graphClient
      .api(`/sites/${webGuid}/lists`)
      .select('id,displayName')
      .get()

    const list = lists.value.find(l => l.displayName === 'Setup-Configuration')
    if (!list) throw new Error('Setup-Configuration list not found')

    // Get the main setup item
    const items = await graphClient
      .api(`/sites/${webGuid}/lists/${list.id}/items`)
      .filter(`fields/Title eq 'Setup-Status'`)
      .select('id')
      .get()

    const updateItem = {
      fields: {
        Title: 'Setup-Status',
        SetupStatus: 'Complete',
        SuperAdminEmail: superAdminEmail,
        CompletedSteps: JSON.stringify([1, 2, 3, 4, 5])
      }
    }

    let result
    if (items.value.length > 0) {
      const itemId = items.value[0].id
      result = await graphClient
        .api(`/sites/${webGuid}/lists/${list.id}/items/${itemId}`)
        .patch(updateItem)
    } else {
      result = await graphClient
        .api(`/sites/${webGuid}/lists/${list.id}/items`)
        .post(updateItem)
    }

    console.log('✅ Setup marked as complete')
    return result
  } catch (error) {
    console.error('❌ Failed to mark setup complete:', error.message)
    throw error
  }
}

/**
 * Test connection (validates credentials)
 */
export async function testSetupConnection(clientId, clientSecret, tenantId) {
  try {
    // Try to get a token with the provided credentials
    const response = await fetch(`https://login.microsoftonline.com/${tenantId}/oauth2/v2.0/token`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        client_id: clientId,
        client_secret: clientSecret,
        scope: 'https://graph.microsoft.com/.default',
        grant_type: 'client_credentials'
      })
    })

    if (!response.ok) {
      return { success: false, message: 'Invalid credentials' }
    }

    return { success: true, message: 'Connection successful' }
  } catch (error) {
    return { success: false, message: error.message }
  }
}

/**
 * Helper: safely parse JSON
 */
function tryParse(str, fallback) {
  try {
    return JSON.parse(str)
  } catch {
    return fallback
  }
}
