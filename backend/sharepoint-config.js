import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const CONFIG_FILE = path.join(__dirname, 'sharepoint-lists-config.json')

// In-memory cache
let configCache = null

/**
 * Load configuration from file or memory
 */
export function loadConfig() {
  if (configCache) return configCache

  try {
    if (fs.existsSync(CONFIG_FILE)) {
      const data = fs.readFileSync(CONFIG_FILE, 'utf-8')
      configCache = JSON.parse(data)
      console.log('✓ Loaded SharePoint configuration from file')
      return configCache
    }
  } catch (error) {
    console.warn('⚠️ Could not load config file:', error.message)
  }

  // Initialize empty config
  configCache = {
    lists: {
      cisValidations: null,
      cisResults: null,
      cisHistory: null,
      zeroTrustValidations: null,
      zeroTrustResults: null,
      zeroTrustHistory: null,
      selfServiceRequests: null,
      selfServiceAudit: null
    },
    lastUpdated: new Date().toISOString()
  }

  return configCache
}

/**
 * Save configuration to file
 */
export function saveConfig(config) {
  try {
    config.lastUpdated = new Date().toISOString()
    fs.writeFileSync(CONFIG_FILE, JSON.stringify(config, null, 2))
    configCache = config
    console.log('✓ Saved SharePoint configuration to file')
    return true
  } catch (error) {
    console.error('❌ Could not save config file:', error.message)
    return false
  }
}

/**
 * Get list ID from config
 */
export function getListId(listKey) {
  const config = loadConfig()
  return config.lists[listKey] || process.env[`SHAREPOINT_${listKey.toUpperCase()}_LIST_ID`]
}

/**
 * Set list ID in config
 */
export function setListId(listKey, listId) {
  const config = loadConfig()
  config.lists[listKey] = listId
  saveConfig(config)
  // Also set in environment for runtime use
  process.env[`SHAREPOINT_${listKey.toUpperCase()}_LIST_ID`] = listId
}

/**
 * Get all list IDs
 */
export function getAllListIds() {
  return loadConfig().lists
}

/**
 * Initialize all missing lists
 */
export async function initializeAllLists(graphClient, siteId) {
  if (!graphClient || !siteId) {
    console.warn('⚠️ Cannot initialize lists: GraphClient or siteId not configured')
    return false
  }

  const config = loadConfig()
  const listConfigs = [
    { key: 'cisValidations', displayName: 'CIS-Validations' },
    { key: 'cisResults', displayName: 'CIS-Results' },
    { key: 'cisHistory', displayName: 'CIS-History' },
    { key: 'zeroTrustValidations', displayName: 'Zero Trust Validations' },
    { key: 'zeroTrustResults', displayName: 'Zero Trust Results' },
    { key: 'zeroTrustHistory', displayName: 'Zero Trust History' },
    { key: 'selfServiceRequests', displayName: 'SelfServiceRequests' },
    { key: 'selfServiceAudit', displayName: 'SelfServiceAudit' }
  ]

  let anyCreated = false

  for (const listConfig of listConfigs) {
    try {
      // Skip if already configured
      if (config.lists[listConfig.key]) {
        console.log(`✓ ${listConfig.displayName} already configured`)
        continue
      }

      // Check if list exists in SharePoint
      const existingLists = await graphClient
        .api(`/sites/${siteId}/lists?$filter=displayName eq '${listConfig.displayName}'`)
        .get()

      if (existingLists.value && existingLists.value.length > 0) {
        const listId = existingLists.value[0].id
        setListId(listConfig.key, listId)
        console.log(`✓ Found existing ${listConfig.displayName}: ${listId}`)
        anyCreated = true
        continue
      }

      // Create list if it doesn't exist
      console.log(`📝 Creating list: ${listConfig.displayName}`)
      const newList = await graphClient.api(`/sites/${siteId}/lists`).post({
        displayName: listConfig.displayName,
        list: { template: 'genericList' }
      })

      setListId(listConfig.key, newList.id)
      console.log(`✓ Created ${listConfig.displayName}: ${newList.id}`)
      anyCreated = true
    } catch (error) {
      console.warn(`⚠️ Could not initialize ${listConfig.displayName}:`, error.message)
    }
  }

  if (anyCreated) {
    saveConfig(config)
  }

  return true
}
