/**
 * Create SharePoint Site and Lists for TenantGuard
 * Run this once to set up the SharePoint infrastructure
 */

import { ClientSecretCredential } from '@azure/identity'
import { Client } from '@microsoft/microsoft-graph-client'
import { TokenCredentialAuthenticationProvider } from '@microsoft/microsoft-graph-client/authProviders/azureTokenCredentials/index.js'

const TENANT_ID = 'b9cc8284-05ed-452f-877a-970779430dcb'
const CLIENT_ID = '04d3be8d-d433-4367-893e-eccc82190a11'
const CLIENT_SECRET = 'Omp8Q~Me_X.K_SBWGQBn4m~fPQcxqL4CV5zsWcXF'
const SITE_NAME = 'M365-AgentOps'
const SITE_DISPLAYNAME = 'M365 AgentOps - TenantGuard'

async function initializeGraphClient() {
  const credential = new ClientSecretCredential(TENANT_ID, CLIENT_ID, CLIENT_SECRET)
  const authProvider = new TokenCredentialAuthenticationProvider({
    credential,
    scopes: ['https://graph.microsoft.com/.default']
  })
  return Client.initWithMiddleware({ authProvider })
}

async function createSharePointSite() {
  try {
    const graphClient = await initializeGraphClient()
    
    console.log('🔍 Checking if SharePoint site already exists...')
    
    // Try to find existing site
    try {
      const existingSite = await graphClient.api(`/sites/${TENANT_ID}:${SITE_NAME}:/`).get()
      console.log('✅ Site already exists:', existingSite.displayName)
      return existingSite
    } catch (error) {
      if (error.statusCode === 404) {
        console.log('📝 Creating new SharePoint site...')
        
        // Create new site
        const siteData = {
          displayName: SITE_DISPLAYNAME,
          description: 'M365 AgentOps - TenantGuard Storage',
          visibility: 'private'
        }
        
        // Note: Direct site creation requires special permissions
        // For now, we'll create a team site via Teams
        const teamData = {
          displayName: SITE_DISPLAYNAME,
          description: 'M365 AgentOps - TenantGuard Storage',
          visibility: 'private'
        }
        
        console.log('📋 Creating Team (which creates SharePoint site)...')
        const newTeam = await graphClient.api('/teams').post(teamData)
        console.log('✅ Team created:', newTeam.id)
        
        // Get the associated SharePoint site
        const teamSite = await graphClient.api(`/teams/${newTeam.id}/sites/root`).get()
        console.log('✅ SharePoint site created:', teamSite.webUrl)
        
        return teamSite
      } else {
        throw error
      }
    }
  } catch (error) {
    console.error('❌ Failed to create site:', error.message)
    throw error
  }
}

async function createLists(siteId) {
  const graphClient = await initializeGraphClient()
  
  const lists = [
    {
      name: 'TenantGuard-Alerts',
      displayName: 'TenantGuard Alerts',
      description: 'Security alerts detected by TenantGuard',
      columns: [
        { name: 'AlertId', type: 'text', required: true },
        { name: 'Headline', type: 'text', required: true },
        { name: 'Description', type: 'text' },
        { name: 'Severity', type: 'choice', choices: ['CRITICAL', 'HIGH', 'MEDIUM', 'INFO'] },
        { name: 'Score', type: 'number' },
        { name: 'Type', type: 'choice', choices: ['ADMIN', 'EXCHANGE', 'SECURITY', 'APPLICATION'] },
        { name: 'Actor', type: 'text' },
        { name: 'RiskAssessment', type: 'text' },
        { name: 'Recommendations', type: 'text' },
        { name: 'Dismissed', type: 'boolean' },
        { name: 'CreatedTime', type: 'datetime' }
      ]
    },
    {
      name: 'TenantGuard-Correlations',
      displayName: 'TenantGuard Correlations',
      description: 'Alert correlations and attack patterns',
      columns: [
        { name: 'CorrelationId', type: 'text', required: true },
        { name: 'Title', type: 'text', required: true },
        { name: 'Description', type: 'text' },
        { name: 'AlertCount', type: 'number' },
        { name: 'Severity', type: 'choice', choices: ['CRITICAL', 'HIGH', 'MEDIUM', 'INFO'] },
        { name: 'ConfidenceScore', type: 'number' },
        { name: 'PatternType', type: 'text' },
        { name: 'RelatedAlerts', type: 'text' }
      ]
    },
    {
      name: 'TenantGuard-Investigations',
      displayName: 'TenantGuard Investigations',
      description: 'AI-powered security investigations',
      columns: [
        { name: 'InvestigationId', type: 'text', required: true },
        { name: 'Title', type: 'text', required: true },
        { name: 'AlertId', type: 'text' },
        { name: 'Status', type: 'choice', choices: ['Open', 'Investigating', 'Resolved'] },
        { name: 'Messages', type: 'text' },
        { name: 'CreatedTime', type: 'datetime' }
      ]
    }
  ]
  
  for (const list of lists) {
    try {
      console.log(`\n📚 Creating list: ${list.displayName}...`)
      
      const listData = {
        displayName: list.displayName,
        description: list.description,
        template: 'generic',
        columns: list.columns.map(col => ({
          name: col.name,
          columnType: col.type,
          enforceUniqueValues: false,
          indexed: false,
          required: col.required || false,
          ...(col.choices && {
            choice: { choices: col.choices }
          })
        }))
      }
      
      const createdList = await graphClient.api(`/sites/${siteId}/lists`).post(listData)
      console.log(`✅ List created: ${createdList.displayName}`)
    } catch (error) {
      console.error(`❌ Failed to create list ${list.displayName}:`, error.message)
    }
  }
}

async function setup() {
  console.log('🚀 Starting SharePoint setup for TenantGuard...\n')
  
  try {
    // Create site
    const site = await createSharePointSite()
    console.log('\n✅ Site ready:', site.webUrl)
    
    // Create lists
    await createLists(site.id)
    
    console.log('\n✅ SharePoint setup complete!')
    console.log('\n📋 Next steps:')
    console.log('   1. Create SharePoint API client (lib/sharepoint-client.js)')
    console.log('   2. Update backend to use SharePoint')
    console.log('   3. Migrate demo alerts to SharePoint')
    console.log('   4. Test end-to-end')
    
  } catch (error) {
    console.error('❌ Setup failed:', error.message)
    process.exit(1)
  }
}

setup()
