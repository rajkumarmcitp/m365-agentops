/**
 * Backup Data Sync Service
 * Synchronizes backup data between frontend (in-memory) and SharePoint (persistent)
 */

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3001'

/**
 * Load all backup data from SharePoint
 */
export async function loadAllBackupDataFromSharePoint() {
  try {
    const token = sessionStorage.getItem('accessToken') || localStorage.getItem('accessToken')

    if (!token) {
      return null
    }

    const response = await fetch(`${API_BASE}/api/backup/sharepoint/load-all`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    })

    if (response.ok) {
      const result = await response.json()
      console.log('✓ Loaded backup data from SharePoint')
      return result.data
    } else {
      console.warn(`⚠️ Could not load from SharePoint (${response.status})`)
      return null
    }
  } catch (error) {
    console.error('❌ Error loading backup data from SharePoint:', error.message)
    return null
  }
}

/**
 * Save backup history to SharePoint
 */
export async function syncBackupHistory(backup) {
  try {
    const token = sessionStorage.getItem('accessToken') || localStorage.getItem('accessToken')

    if (!token) {
      return false
    }

    const response = await fetch(`${API_BASE}/api/backup/sharepoint/history`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ backup })
    })

    if (response.ok) {
      console.log(`✓ Synced backup to SharePoint: ${backup.backupId}`)
      return true
    } else {
      console.warn(`⚠️ Could not sync backup (${response.status})`)
      return false
    }
  } catch (error) {
    console.error('❌ Error syncing backup:', error.message)
    return false
  }
}

/**
 * Save backup schedule to SharePoint
 */
export async function syncBackupSchedule(schedule) {
  try {
    const token = sessionStorage.getItem('accessToken') || localStorage.getItem('accessToken')

    if (!token) {
      return false
    }

    const response = await fetch(`${API_BASE}/api/backup/sharepoint/schedule`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ schedule })
    })

    if (response.ok) {
      console.log(`✓ Synced schedule to SharePoint: ${schedule.name}`)
      return true
    } else {
      console.warn(`⚠️ Could not sync schedule (${response.status})`)
      return false
    }
  } catch (error) {
    console.error('❌ Error syncing schedule:', error.message)
    return false
  }
}

/**
 * Save backup version to SharePoint
 */
export async function syncBackupVersion(version) {
  try {
    const token = sessionStorage.getItem('accessToken') || localStorage.getItem('accessToken')

    if (!token) {
      return false
    }

    const response = await fetch(`${API_BASE}/api/backup/sharepoint/version`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ version })
    })

    if (response.ok) {
      console.log(`✓ Synced version to SharePoint: ${version.versionTag}`)
      return true
    } else {
      console.warn(`⚠️ Could not sync version (${response.status})`)
      return false
    }
  } catch (error) {
    console.error('❌ Error syncing version:', error.message)
    return false
  }
}

/**
 * Update backup version in SharePoint (for tagging)
 */
export async function updateBackupVersionInSharePoint(versionId, updates) {
  try {
    const token = sessionStorage.getItem('accessToken') || localStorage.getItem('accessToken')

    if (!token) {
      return false
    }

    const response = await fetch(`${API_BASE}/api/backup/sharepoint/version/${versionId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ updates })
    })

    if (response.ok) {
      console.log(`✓ Updated version in SharePoint: ${versionId}`)
      return true
    } else {
      console.warn(`⚠️ Could not update version (${response.status})`)
      return false
    }
  } catch (error) {
    console.error('❌ Error updating version:', error.message)
    return false
  }
}

/**
 * Save audit log entry to SharePoint
 */
export async function syncAuditLogEntry(event) {
  try {
    const token = sessionStorage.getItem('accessToken') || localStorage.getItem('accessToken')

    if (!token) {
      return false
    }

    const response = await fetch(`${API_BASE}/api/backup/sharepoint/audit`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ event })
    })

    if (response.ok) {
      console.log(`✓ Synced audit entry to SharePoint: ${event.action}`)
      return true
    } else {
      console.warn(`⚠️ Could not sync audit entry (${response.status})`)
      return false
    }
  } catch (error) {
    console.error('❌ Error syncing audit entry:', error.message)
    return false
  }
}

/**
 * Sync all backup data to SharePoint
 * Used for bulk operations or periodic sync
 */
export async function syncAllBackupData(backupData) {
  try {
    const { backupHistories = [], backupSchedules = [], backupVersions = [], auditLog = [] } = backupData

    console.log('📤 Starting bulk sync to SharePoint...')

    const results = {
      historiesSynced: 0,
      schedulesSynced: 0,
      versionsSynced: 0,
      auditEntriesSynced: 0,
      failedOperations: []
    }

    // Sync backup histories
    for (const history of backupHistories) {
      const success = await syncBackupHistory(history)
      if (success) results.historiesSynced++
      else results.failedOperations.push(`history: ${history.backupId}`)
    }

    // Sync schedules
    for (const schedule of backupSchedules) {
      const success = await syncBackupSchedule(schedule)
      if (success) results.schedulesSynced++
      else results.failedOperations.push(`schedule: ${schedule.name}`)
    }

    // Sync versions
    for (const version of backupVersions) {
      const success = await syncBackupVersion(version)
      if (success) results.versionsSynced++
      else results.failedOperations.push(`version: ${version.versionTag}`)
    }

    // Sync audit log
    for (const entry of auditLog) {
      const success = await syncAuditLogEntry(entry)
      if (success) results.auditEntriesSynced++
      else results.failedOperations.push(`audit: ${entry.action}`)
    }

    console.log('✓ Bulk sync complete:', results)
    return results
  } catch (error) {
    console.error('❌ Error during bulk sync:', error.message)
    return null
  }
}

/**
 * Delete backup from SharePoint
 */
export async function deleteBackupFromSharePoint(backupId) {
  try {
    const token = sessionStorage.getItem('accessToken') || localStorage.getItem('accessToken')

    if (!token) {
      return false
    }

    const response = await fetch(`${API_BASE}/api/backup/sharepoint/history/${backupId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    })

    if (response.ok) {
      console.log(`✓ Deleted backup from SharePoint: ${backupId}`)
      return true
    } else {
      console.warn(`⚠️ Could not delete backup (${response.status})`)
      return false
    }
  } catch (error) {
    console.error('❌ Error deleting backup:', error.message)
    return false
  }
}
