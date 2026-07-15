/**
 * Restore Operation Tracker
 * Tracks restore operations and their status
 */

export class RestoreTracker {
  constructor() {
    this.restores = new Map()  // restoreId -> restore record
    this.history = []          // array of all restores
  }

  /**
   * Create a restore operation record
   */
  createRestoreOperation(backupId, resourceIds = []) {
    const restoreId = `restore-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    const record = {
      restoreId,
      backupId,
      resourceIds: resourceIds || [],
      resourceCount: (resourceIds || []).length,
      status: 'In Progress',
      startTime: new Date().toISOString(),
      endTime: null,
      duration: null,
      successCount: 0,
      failureCount: 0,
      errors: [],
      details: []
    }

    this.restores.set(restoreId, record)
    this.history.push(record)

    console.log(`🔄 Restore operation started: ${restoreId}`)
    console.log(`   Backup: ${backupId}`)
    console.log(`   Resources: ${resourceIds.length}`)

    return restoreId
  }

  /**
   * Update restore operation status
   */
  updateRestoreStatus(restoreId, status, data = {}) {
    const record = this.restores.get(restoreId)
    if (!record) return { success: false, error: 'Restore not found' }

    record.status = status
    Object.assign(record, data)

    console.log(`📊 Restore ${restoreId}: ${status}`)
    if (data.details) {
      data.details.forEach(detail => console.log(`   ✓ ${detail}`))
    }

    return { success: true }
  }

  /**
   * Add error to restore operation
   */
  addRestoreError(restoreId, error) {
    const record = this.restores.get(restoreId)
    if (!record) return

    record.errors.push({
      timestamp: new Date().toISOString(),
      message: error
    })
    record.failureCount++

    console.error(`❌ Restore ${restoreId} error: ${error}`)
  }

  /**
   * Add detail to restore operation
   */
  addRestoreDetail(restoreId, detail) {
    const record = this.restores.get(restoreId)
    if (!record) return

    record.details.push({
      timestamp: new Date().toISOString(),
      message: detail
    })

    console.log(`   📝 ${detail}`)
  }

  /**
   * Complete restore operation
   */
  completeRestore(restoreId, success = true) {
    const record = this.restores.get(restoreId)
    if (!record) return { success: false, error: 'Restore not found' }

    record.endTime = new Date().toISOString()
    record.duration = Math.round((new Date(record.endTime) - new Date(record.startTime)) / 1000)
    record.status = success ? 'Completed' : 'Failed'

    const summary = success
      ? `✅ Restore ${restoreId} completed in ${record.duration}s`
      : `❌ Restore ${restoreId} failed after ${record.duration}s`

    console.log(summary)
    console.log(`   Success: ${record.successCount}, Failed: ${record.failureCount}`)

    return { success: true, record }
  }

  /**
   * Get restore operation status
   */
  getRestoreStatus(restoreId) {
    return this.restores.get(restoreId) || null
  }

  /**
   * Get all restores for a backup
   */
  getBackupRestores(backupId, limit = 10) {
    return this.history
      .filter(r => r.backupId === backupId)
      .slice(-limit)
      .reverse()
  }

  /**
   * Get recent restores
   */
  getRecentRestores(limit = 20) {
    return this.history.slice(-limit).reverse()
  }
}

export default RestoreTracker
