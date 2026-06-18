import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const CONFIG_DIR = path.join(__dirname, '..', 'data')
const SELF_SERVICE_CONFIG_FILE = path.join(CONFIG_DIR, 'self-service-config.json')
const CHANGE_INTELLIGENCE_CONFIG_FILE = path.join(CONFIG_DIR, 'change-intelligence-config.json')

// Ensure config directory exists
if (!fs.existsSync(CONFIG_DIR)) {
  fs.mkdirSync(CONFIG_DIR, { recursive: true })
}

// Self Service Portal Configuration
export function loadSelfServiceConfig() {
  try {
    if (fs.existsSync(SELF_SERVICE_CONFIG_FILE)) {
      const data = fs.readFileSync(SELF_SERVICE_CONFIG_FILE, 'utf8')
      const config = JSON.parse(data)
      console.log('✅ Loaded Self Service Portal config from disk')
      return config
    }
    return { siteId: null, siteUrl: null }
  } catch (error) {
    console.error('❌ Error loading Self Service Portal config:', error.message)
    return { siteId: null, siteUrl: null }
  }
}

export function saveSelfServiceConfig(siteId, siteUrl) {
  try {
    const config = { siteId, siteUrl, updatedAt: new Date().toISOString() }
    fs.writeFileSync(SELF_SERVICE_CONFIG_FILE, JSON.stringify(config, null, 2))
    console.log('✅ Saved Self Service Portal config to disk')
    return true
  } catch (error) {
    console.error('❌ Error saving Self Service Portal config:', error.message)
    return false
  }
}

export function clearSelfServiceConfig() {
  try {
    if (fs.existsSync(SELF_SERVICE_CONFIG_FILE)) {
      fs.unlinkSync(SELF_SERVICE_CONFIG_FILE)
      console.log('✅ Cleared Self Service Portal config')
    }
    return true
  } catch (error) {
    console.error('❌ Error clearing Self Service Portal config:', error.message)
    return false
  }
}

// Change Intelligence Configuration
export function loadChangeIntelligenceConfig() {
  try {
    if (fs.existsSync(CHANGE_INTELLIGENCE_CONFIG_FILE)) {
      const data = fs.readFileSync(CHANGE_INTELLIGENCE_CONFIG_FILE, 'utf8')
      const config = JSON.parse(data)
      console.log('✅ Loaded Change Intelligence config from disk')
      return config
    }
    return { siteId: null, siteUrl: null }
  } catch (error) {
    console.error('❌ Error loading Change Intelligence config:', error.message)
    return { siteId: null, siteUrl: null }
  }
}

export function saveChangeIntelligenceConfig(siteId, siteUrl) {
  try {
    const config = { siteId, siteUrl, updatedAt: new Date().toISOString() }
    fs.writeFileSync(CHANGE_INTELLIGENCE_CONFIG_FILE, JSON.stringify(config, null, 2))
    console.log('✅ Saved Change Intelligence config to disk')
    return true
  } catch (error) {
    console.error('❌ Error saving Change Intelligence config:', error.message)
    return false
  }
}

export function clearChangeIntelligenceConfig() {
  try {
    if (fs.existsSync(CHANGE_INTELLIGENCE_CONFIG_FILE)) {
      fs.unlinkSync(CHANGE_INTELLIGENCE_CONFIG_FILE)
      console.log('✅ Cleared Change Intelligence config')
    }
    return true
  } catch (error) {
    console.error('❌ Error clearing Change Intelligence config:', error.message)
    return false
  }
}
