import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const CONFIG_DIR = path.join(__dirname, '..', 'data')
const CONFIG_FILE = path.join(CONFIG_DIR, 'self-service-config.json')

// Ensure config directory exists
if (!fs.existsSync(CONFIG_DIR)) {
  fs.mkdirSync(CONFIG_DIR, { recursive: true })
}

export function loadSelfServiceConfig() {
  try {
    if (fs.existsSync(CONFIG_FILE)) {
      const data = fs.readFileSync(CONFIG_FILE, 'utf8')
      const config = JSON.parse(data)
      console.log('✅ Loaded Self Service Portal config from disk')
      return config
    }
    return { siteId: null, siteUrl: null }
  } catch (error) {
    console.error('❌ Error loading config:', error.message)
    return { siteId: null, siteUrl: null }
  }
}

export function saveSelfServiceConfig(siteId, siteUrl) {
  try {
    const config = { siteId, siteUrl, updatedAt: new Date().toISOString() }
    fs.writeFileSync(CONFIG_FILE, JSON.stringify(config, null, 2))
    console.log('✅ Saved Self Service Portal config to disk')
    return true
  } catch (error) {
    console.error('❌ Error saving config:', error.message)
    return false
  }
}

export function clearSelfServiceConfig() {
  try {
    if (fs.existsSync(CONFIG_FILE)) {
      fs.unlinkSync(CONFIG_FILE)
      console.log('✅ Cleared Self Service Portal config')
    }
    return true
  } catch (error) {
    console.error('❌ Error clearing config:', error.message)
    return false
  }
}
