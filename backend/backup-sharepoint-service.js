/**
 * Backup & Restore SharePoint Integration Service
 * Persists all backup data to SharePoint Lists
 * Lists: BackupHistories, BackupSchedules, BackupVersions, BackupAuditLog
 */

import { Client } from '@microsoft/microsoft-graph-client'
import { getListId } from './sharepoint-config.js'

/**
 * Initialize Graph client for SharePoint operations
 */
function getGraphClient(accessToken) {
  const client = Client.init({
    authProvider: done => {
      done(null, accessToken)
    }
  })
  return client
}

/**
 * Save backup history to SharePoint
 */
export async function saveBackupHistory(accessToken, siteId, backup) {
  try {
    const listId = getListId('BackupHistories')
    if (!listId) {
      console.warn('⚠️ BackupHistories list not configured')
      return null
    }

    const client = getGraphClient(accessToken)
    const item = {
      fields: {
        Title: backup.backupId,
        ServiceName: backup.serviceName,
        ResourceCount: backup.resourceCount,
        SizeBytes: backup.sizeBytes,
        Status: backup.status,
        Timestamp: backup.timestamp,
        Duration: backup.duration || 0,
        ErrorMessage: backup.errorMessage || ''
      }
    }

    const response = await client
      .api(`/sites/${siteId}/lists/${listId}/items`)
      .post(item)

    console.log(`✓ Saved backup to SharePoint: ${backup.backupId}`)
    return response
  } catch (error) {
    console.error('❌ Error saving backup history:', error.message)
    return null
  }
}

/**
 * Load all backup histories from SharePoint
 */
export async function loadBackupHistories(accessToken, siteId) {
  try {
    const listId = getListId('BackupHistories')
    if (!listId) {
      console.warn('⚠️ BackupHistories list not configured')
      return []
    }

    const client = getGraphClient(accessToken)
    const response = await client
      .api(`/sites/${siteId}/lists/${listId}/items`)
      .get()

    return (response.value || []).map(item => ({
      id: item.id,
      backupId: item.fields.Title,
      serviceName: item.fields.ServiceName,
      resourceCount: item.fields.ResourceCount,
      sizeBytes: item.fields.SizeBytes,
      status: item.fields.Status,
      timestamp: item.fields.Timestamp,
      duration: item.fields.Duration || 0,
      errorMessage: item.fields.ErrorMessage || ''
    }))
  } catch (error) {
    console.error('❌ Error loading backup histories:', error.message)
    return []
  }
}

/**
 * Save backup schedule to SharePoint
 */
export async function saveBackupSchedule(accessToken, siteId, schedule) {
  try {
    const listId = getListId('BackupSchedules')
    if (!listId) {
      console.warn('⚠️ BackupSchedules list not configured')
      return null
    }

    const client = getGraphClient(accessToken)
    const item = {
      fields: {
        Title: schedule.name,
        ScheduleId: schedule.id,
        Frequency: schedule.frequency,
        Time: schedule.time,
        Timezone: schedule.timezone,
        BackupType: schedule.backupType,
        Services: (schedule.services || []).join(';'),
        Retention: schedule.retention,
        Enabled: schedule.enabled,
        NextRun: schedule.nextRun,
        LastRun: schedule.lastRun || '',
        RunCount: schedule.runCount,
        SuccessCount: schedule.successCount,
        FailureCount: schedule.failureCount
      }
    }

    const response = await client
      .api(`/sites/${siteId}/lists/${listId}/items`)
      .post(item)

    console.log(`✓ Saved schedule to SharePoint: ${schedule.name}`)
    return response
  } catch (error) {
    console.error('❌ Error saving schedule:', error.message)
    return null
  }
}

/**
 * Load all backup schedules from SharePoint
 */
export async function loadBackupSchedules(accessToken, siteId) {
  try {
    const listId = getListId('BackupSchedules')
    if (!listId) {
      console.warn('⚠️ BackupSchedules list not configured')
      return []
    }

    const client = getGraphClient(accessToken)
    const response = await client
      .api(`/sites/${siteId}/lists/${listId}/items`)
      .get()

    return (response.value || []).map(item => ({
      id: item.fields.ScheduleId,
      name: item.fields.Title,
      frequency: item.fields.Frequency,
      time: item.fields.Time,
      timezone: item.fields.Timezone,
      backupType: item.fields.BackupType,
      services: (item.fields.Services || '').split(';').filter(s => s),
      retention: item.fields.Retention,
      enabled: item.fields.Enabled,
      nextRun: item.fields.NextRun,
      lastRun: item.fields.LastRun || null,
      runCount: item.fields.RunCount || 0,
      successCount: item.fields.SuccessCount || 0,
      failureCount: item.fields.FailureCount || 0
    }))
  } catch (error) {
    console.error('❌ Error loading schedules:', error.message)
    return []
  }
}

/**
 * Save backup version to SharePoint
 */
export async function saveBackupVersion(accessToken, siteId, version) {
  try {
    const listId = getListId('BackupVersions')
    if (!listId) {
      console.warn('⚠️ BackupVersions list not configured')
      return null
    }

    const client = getGraphClient(accessToken)
    const item = {
      fields: {
        Title: version.versionTag,
        VersionId: version.id,
        BackupId: version.backupId,
        CommitMessage: version.commitMessage,
        ParentVersionId: version.parentVersionId || '',
        CreatedBy: version.createdBy,
        CreatedAt: version.createdAt,
        IsRelease: version.isRelease,
        Tags: (version.tags || []).join(';'),
        ResourceCount: version.resourceCount,
        SizeBytes: version.size || 0,
        ServiceName: version.serviceName || ''
      }
    }

    const response = await client
      .api(`/sites/${siteId}/lists/${listId}/items`)
      .post(item)

    console.log(`✓ Saved version to SharePoint: ${version.versionTag}`)
    return response
  } catch (error) {
    console.error('❌ Error saving version:', error.message)
    return null
  }
}

/**
 * Load all backup versions from SharePoint
 */
export async function loadBackupVersions(accessToken, siteId) {
  try {
    const listId = getListId('BackupVersions')
    if (!listId) {
      console.warn('⚠️ BackupVersions list not configured')
      return []
    }

    const client = getGraphClient(accessToken)
    const response = await client
      .api(`/sites/${siteId}/lists/${listId}/items`)
      .get()

    return (response.value || []).map(item => ({
      id: item.fields.VersionId,
      backupId: item.fields.BackupId,
      versionTag: item.fields.Title,
      commitMessage: item.fields.CommitMessage,
      parentVersionId: item.fields.ParentVersionId || null,
      createdBy: item.fields.CreatedBy,
      createdAt: item.fields.CreatedAt,
      isRelease: item.fields.IsRelease,
      tags: (item.fields.Tags || '').split(';').filter(t => t),
      resourceCount: item.fields.ResourceCount || 0,
      size: item.fields.SizeBytes || 0,
      serviceName: item.fields.ServiceName || ''
    }))
  } catch (error) {
    console.error('❌ Error loading versions:', error.message)
    return []
  }
}

/**
 * Save audit log entry to SharePoint
 */
export async function saveAuditLogEntry(accessToken, siteId, event) {
  try {
    const listId = getListId('BackupAuditLog')
    if (!listId) {
      console.warn('⚠️ BackupAuditLog list not configured')
      return null
    }

    const client = getGraphClient(accessToken)
    const item = {
      fields: {
        Title: `${event.action} - ${event.service}`,
        AuditId: event.id,
        Timestamp: event.timestamp,
        Action: event.action,
        Service: event.service,
        Actor: event.actor,
        Status: event.status,
        Message: event.message,
        ResourceCount: event.resourceCount || 0,
        Duration: event.duration || 0,
        ErrorMessage: event.errorMessage || ''
      }
    }

    const response = await client
      .api(`/sites/${siteId}/lists/${listId}/items`)
      .post(item)

    console.log(`✓ Saved audit entry to SharePoint: ${event.action}`)
    return response
  } catch (error) {
    console.error('❌ Error saving audit log:', error.message)
    return null
  }
}

/**
 * Load all audit log entries from SharePoint
 */
export async function loadAuditLog(accessToken, siteId) {
  try {
    const listId = getListId('BackupAuditLog')
    if (!listId) {
      console.warn('⚠️ BackupAuditLog list not configured')
      return []
    }

    const client = getGraphClient(accessToken)
    const response = await client
      .api(`/sites/${siteId}/lists/${listId}/items`)
      .get()

    return (response.value || []).map(item => ({
      id: item.fields.AuditId,
      timestamp: item.fields.Timestamp,
      action: item.fields.Action,
      service: item.fields.Service,
      actor: item.fields.Actor,
      status: item.fields.Status,
      message: item.fields.Message,
      resourceCount: item.fields.ResourceCount || 0,
      duration: item.fields.Duration || 0,
      errorMessage: item.fields.ErrorMessage || ''
    }))
  } catch (error) {
    console.error('❌ Error loading audit log:', error.message)
    return []
  }
}

/**
 * Update backup version in SharePoint
 */
export async function updateBackupVersion(accessToken, siteId, versionId, updates) {
  try {
    const listId = getListId('BackupVersions')
    if (!listId) {
      console.warn('⚠️ BackupVersions list not configured')
      return null
    }

    const client = getGraphClient(accessToken)
    const item = {
      fields: updates
    }

    const response = await client
      .api(`/sites/${siteId}/lists/${listId}/items/${versionId}`)
      .patch(item)

    console.log(`✓ Updated version in SharePoint: ${versionId}`)
    return response
  } catch (error) {
    console.error('❌ Error updating version:', error.message)
    return null
  }
}

/**
 * Delete backup history from SharePoint
 */
export async function deleteBackupHistory(accessToken, siteId, itemId) {
  try {
    const listId = getListId('BackupHistories')
    if (!listId) {
      console.warn('⚠️ BackupHistories list not configured')
      return false
    }

    const client = getGraphClient(accessToken)
    await client
      .api(`/sites/${siteId}/lists/${listId}/items/${itemId}`)
      .delete()

    console.log(`✓ Deleted backup from SharePoint: ${itemId}`)
    return true
  } catch (error) {
    console.error('❌ Error deleting backup:', error.message)
    return false
  }
}
