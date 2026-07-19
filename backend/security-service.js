/**
 * Security Service
 * Manages authentication, authorization, and advanced security features
 */

import fs from 'fs'
import { join } from 'path'
import { fileURLToPath } from 'url'
import { dirname } from 'path'
import crypto from 'crypto'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const DATA_DIR = join(__dirname, '..', 'data', 'security')
const USERS_FILE = join(DATA_DIR, 'users.json')
const ROLES_FILE = join(DATA_DIR, 'roles.json')
const PERMISSIONS_FILE = join(DATA_DIR, 'permissions.json')
const API_KEYS_FILE = join(DATA_DIR, 'api-keys.json')
const SESSIONS_FILE = join(DATA_DIR, 'sessions.json')
const AUDIT_LOG_FILE = join(DATA_DIR, 'audit-log.json')

// Ensure data directory exists
function ensureDataDir() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true })
  }
}

// Load data files
function loadUsers() {
  ensureDataDir()
  if (fs.existsSync(USERS_FILE)) {
    try {
      return JSON.parse(fs.readFileSync(USERS_FILE, 'utf8'))
    } catch (error) {
      return {}
    }
  }
  return {}
}

function loadRoles() {
  ensureDataDir()
  if (fs.existsSync(ROLES_FILE)) {
    try {
      return JSON.parse(fs.readFileSync(ROLES_FILE, 'utf8'))
    } catch (error) {
      return initializeDefaultRoles()
    }
  }
  return initializeDefaultRoles()
}

function loadPermissions() {
  ensureDataDir()
  if (fs.existsSync(PERMISSIONS_FILE)) {
    try {
      return JSON.parse(fs.readFileSync(PERMISSIONS_FILE, 'utf8'))
    } catch (error) {
      return initializeDefaultPermissions()
    }
  }
  return initializeDefaultPermissions()
}

function loadApiKeys() {
  ensureDataDir()
  if (fs.existsSync(API_KEYS_FILE)) {
    try {
      return JSON.parse(fs.readFileSync(API_KEYS_FILE, 'utf8'))
    } catch (error) {
      return []
    }
  }
  return []
}

function loadSessions() {
  ensureDataDir()
  if (fs.existsSync(SESSIONS_FILE)) {
    try {
      return JSON.parse(fs.readFileSync(SESSIONS_FILE, 'utf8'))
    } catch (error) {
      return []
    }
  }
  return []
}

function loadAuditLog() {
  ensureDataDir()
  if (fs.existsSync(AUDIT_LOG_FILE)) {
    try {
      return JSON.parse(fs.readFileSync(AUDIT_LOG_FILE, 'utf8'))
    } catch (error) {
      return []
    }
  }
  return []
}

// Save data files
function saveUsers(users) {
  ensureDataDir()
  fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2))
}

function saveRoles(roles) {
  ensureDataDir()
  fs.writeFileSync(ROLES_FILE, JSON.stringify(roles, null, 2))
}

function saveApiKeys(keys) {
  ensureDataDir()
  fs.writeFileSync(API_KEYS_FILE, JSON.stringify(keys, null, 2))
}

function saveSessions(sessions) {
  ensureDataDir()
  fs.writeFileSync(SESSIONS_FILE, JSON.stringify(sessions, null, 2))
}

function saveAuditLog(log) {
  ensureDataDir()
  fs.writeFileSync(AUDIT_LOG_FILE, JSON.stringify(log, null, 2))
}

/**
 * Initialize default roles
 */
function initializeDefaultRoles() {
  return {
    'admin': {
      name: 'Administrator',
      description: 'Full access to all resources',
      permissions: ['*']
    },
    'investigator': {
      name: 'Investigator',
      description: 'Can investigate alerts and incidents',
      permissions: ['alert:read', 'alert:write', 'incident:read', 'incident:write', 'comment:*']
    },
    'analyst': {
      name: 'Security Analyst',
      description: 'Can read and analyze security data',
      permissions: ['alert:read', 'incident:read', 'comment:read', 'playbook:read']
    },
    'viewer': {
      name: 'Viewer',
      description: 'Read-only access',
      permissions: ['alert:read', 'incident:read', 'comment:read']
    }
  }
}

/**
 * Initialize default permissions
 */
function initializeDefaultPermissions() {
  return {
    'alert:read': 'Read alerts',
    'alert:write': 'Create and update alerts',
    'alert:delete': 'Delete alerts',
    'incident:read': 'Read incidents',
    'incident:write': 'Create and update incidents',
    'incident:delete': 'Delete incidents',
    'comment:read': 'Read comments',
    'comment:write': 'Add comments',
    'comment:delete': 'Delete comments',
    'playbook:read': 'Read playbooks',
    'playbook:execute': 'Execute playbooks',
    'rule:read': 'Read rules',
    'rule:write': 'Create and update rules',
    'user:manage': 'Manage users',
    'role:manage': 'Manage roles',
    'apikey:manage': 'Manage API keys',
    'audit:read': 'Read audit logs'
  }
}

/**
 * Create API key
 */
export function createApiKey(keyData) {
  try {
    const keys = loadApiKeys()
    const key = crypto.randomBytes(32).toString('hex')
    const keyHash = crypto.createHash('sha256').update(key).digest('hex')

    const apiKey = {
      id: `key-${Date.now()}`,
      name: keyData.name,
      description: keyData.description || '',
      keyHash,
      createdBy: keyData.createdBy,
      createdAt: new Date().toISOString(),
      lastUsed: null,
      active: true,
      permissions: keyData.permissions || ['alert:read']
    }

    keys.push(apiKey)
    saveApiKeys(keys)

    logSecurityEvent('api_key_created', keyData.createdBy, { keyId: apiKey.id })

    return { ...apiKey, key } // Return key only once
  } catch (error) {
    console.error('Error creating API key:', error)
    throw error
  }
}

/**
 * Validate API key
 */
export function validateApiKey(key) {
  try {
    const keyHash = crypto.createHash('sha256').update(key).digest('hex')
    const keys = loadApiKeys()
    const apiKey = keys.find(k => k.keyHash === keyHash && k.active)

    if (!apiKey) {
      return null
    }

    // Update last used
    apiKey.lastUsed = new Date().toISOString()
    saveApiKeys(keys)

    return apiKey
  } catch (error) {
    console.error('Error validating API key:', error)
    return null
  }
}

/**
 * Check permission
 */
export function checkPermission(roleOrPermissions, requiredPermission) {
  // Handle wildcard permission
  if (Array.isArray(roleOrPermissions)) {
    const permissions = roleOrPermissions
    return permissions.includes('*') || permissions.includes(requiredPermission)
  }

  // Handle role-based permission
  const roles = loadRoles()
  const role = roles[roleOrPermissions]

  if (!role) {
    return false
  }

  return role.permissions.includes('*') || role.permissions.includes(requiredPermission)
}

/**
 * Create session
 */
export function createSession(userId, userEmail, ipAddress) {
  try {
    const sessions = loadSessions()
    const sessionId = crypto.randomBytes(16).toString('hex')

    const session = {
      id: sessionId,
      userId,
      userEmail,
      ipAddress,
      createdAt: new Date().toISOString(),
      lastActivity: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // 24 hours
      active: true
    }

    sessions.push(session)
    saveSessions(sessions)

    logSecurityEvent('session_created', userId, { sessionId, ipAddress })

    return session
  } catch (error) {
    console.error('Error creating session:', error)
    throw error
  }
}

/**
 * Validate session
 */
export function validateSession(sessionId) {
  try {
    const sessions = loadSessions()
    const session = sessions.find(s => s.id === sessionId && s.active)

    if (!session) {
      return null
    }

    // Check expiration
    if (new Date(session.expiresAt) < new Date()) {
      session.active = false
      saveSessions(sessions)
      return null
    }

    // Update activity
    session.lastActivity = new Date().toISOString()
    saveSessions(sessions)

    return session
  } catch (error) {
    console.error('Error validating session:', error)
    return null
  }
}

/**
 * Revoke session
 */
export function revokeSession(sessionId) {
  try {
    const sessions = loadSessions()
    const session = sessions.find(s => s.id === sessionId)

    if (session) {
      session.active = false
      saveSessions(sessions)
      logSecurityEvent('session_revoked', session.userId, { sessionId })
    }

    return { success: true, sessionId }
  } catch (error) {
    console.error('Error revoking session:', error)
    throw error
  }
}

/**
 * Log security event
 */
export function logSecurityEvent(eventType, actor, details = {}) {
  try {
    const audit = loadAuditLog()

    const event = {
      id: `audit-${Date.now()}`,
      eventType,
      actor,
      timestamp: new Date().toISOString(),
      details,
      severity: eventType.includes('failed') ? 'WARNING' : 'INFO'
    }

    audit.push(event)
    saveAuditLog(audit)

    return event
  } catch (error) {
    console.error('Error logging security event:', error)
  }
}

/**
 * Get audit log
 */
export function getAuditLog(limit = 100, actor = null) {
  try {
    const audit = loadAuditLog()
    return audit
      .filter(e => !actor || e.actor === actor)
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      .slice(0, limit)
  } catch (error) {
    console.error('Error getting audit log:', error)
    return []
  }
}

/**
 * Get security statistics
 */
export function getSecurityStats() {
  try {
    const apiKeys = loadApiKeys()
    const sessions = loadSessions()
    const audit = loadAuditLog()

    return {
      totalApiKeys: apiKeys.length,
      activeApiKeys: apiKeys.filter(k => k.active).length,
      totalSessions: sessions.length,
      activeSessions: sessions.filter(s => s.active).length,
      auditLogEntries: audit.length,
      securityEvents: audit.filter(e => e.severity === 'WARNING').length
    }
  } catch (error) {
    console.error('Error getting security stats:', error)
    return {}
  }
}

/**
 * Revoke API key
 */
export function revokeApiKey(keyId, revokedBy) {
  try {
    const keys = loadApiKeys()
    const key = keys.find(k => k.id === keyId)

    if (key) {
      key.active = false
      saveApiKeys(keys)
      logSecurityEvent('api_key_revoked', revokedBy, { keyId })
    }

    return { success: true, keyId }
  } catch (error) {
    console.error('Error revoking API key:', error)
    throw error
  }
}

/**
 * Get all API keys for user
 */
export function getUserApiKeys(createdBy) {
  try {
    const keys = loadApiKeys()
    return keys.filter(k => k.createdBy === createdBy)
  } catch (error) {
    console.error('Error getting user API keys:', error)
    return []
  }
}

/**
 * Hash password
 */
export function hashPassword(password) {
  return crypto.createHash('sha256').update(password).digest('hex')
}

/**
 * Verify password
 */
export function verifyPassword(password, hash) {
  return hashPassword(password) === hash
}
