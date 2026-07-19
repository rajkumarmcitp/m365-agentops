/**
 * Collaboration Service
 * Manages comments, mentions, and assignments for alerts and incidents
 */

import fs from 'fs'
import { join } from 'path'
import { fileURLToPath } from 'url'
import { dirname } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const DATA_DIR = join(__dirname, '..', 'data', 'collaboration')
const COMMENTS_FILE = join(DATA_DIR, 'comments.json')
const ASSIGNMENTS_FILE = join(DATA_DIR, 'assignments.json')
const ACTIVITY_FILE = join(DATA_DIR, 'activity.json')

// Ensure data directory exists
function ensureDataDir() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true })
  }
}

// Load comments
function loadComments() {
  ensureDataDir()
  if (fs.existsSync(COMMENTS_FILE)) {
    try {
      const data = fs.readFileSync(COMMENTS_FILE, 'utf8')
      return JSON.parse(data)
    } catch (error) {
      console.error('Error loading comments:', error)
      return []
    }
  }
  return []
}

// Save comments
function saveComments(comments) {
  ensureDataDir()
  try {
    fs.writeFileSync(COMMENTS_FILE, JSON.stringify(comments, null, 2))
  } catch (error) {
    console.error('Error saving comments:', error)
    throw error
  }
}

// Load assignments
function loadAssignments() {
  ensureDataDir()
  if (fs.existsSync(ASSIGNMENTS_FILE)) {
    try {
      const data = fs.readFileSync(ASSIGNMENTS_FILE, 'utf8')
      return JSON.parse(data)
    } catch (error) {
      console.error('Error loading assignments:', error)
      return {}
    }
  }
  return {}
}

// Save assignments
function saveAssignments(assignments) {
  ensureDataDir()
  try {
    fs.writeFileSync(ASSIGNMENTS_FILE, JSON.stringify(assignments, null, 2))
  } catch (error) {
    console.error('Error saving assignments:', error)
    throw error
  }
}

// Load activity
function loadActivity() {
  ensureDataDir()
  if (fs.existsSync(ACTIVITY_FILE)) {
    try {
      const data = fs.readFileSync(ACTIVITY_FILE, 'utf8')
      return JSON.parse(data)
    } catch (error) {
      console.error('Error loading activity:', error)
      return []
    }
  }
  return []
}

// Save activity
function saveActivity(activity) {
  ensureDataDir()
  try {
    fs.writeFileSync(ACTIVITY_FILE, JSON.stringify(activity, null, 2))
  } catch (error) {
    console.error('Error saving activity:', error)
    throw error
  }
}

/**
 * Add comment to alert or incident
 */
export function addComment(commentData) {
  try {
    const comments = loadComments()
    const activity = loadActivity()

    const comment = {
      id: `comment-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      resourceType: commentData.resourceType || 'alert', // alert or incident
      resourceId: commentData.resourceId,
      author: commentData.author,
      authorName: commentData.authorName || 'Unknown',
      text: commentData.text,
      mentions: extractMentions(commentData.text),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      reactions: {},
      replies: []
    }

    comments.push(comment)
    saveComments(comments)

    // Log activity
    activity.push({
      id: `activity-${Date.now()}`,
      resourceType: comment.resourceType,
      resourceId: comment.resourceId,
      type: 'comment_added',
      actor: comment.author,
      actorName: comment.authorName,
      timestamp: new Date().toISOString(),
      details: {
        commentId: comment.id,
        preview: comment.text.substring(0, 100)
      },
      mentions: comment.mentions
    })
    saveActivity(activity)

    console.log(`✅ Comment added: ${comment.id}`)
    return comment
  } catch (error) {
    console.error('Error adding comment:', error)
    throw error
  }
}

/**
 * Get comments for resource
 */
export function getComments(resourceType, resourceId) {
  try {
    const comments = loadComments()
    return comments
      .filter(c => c.resourceType === resourceType && c.resourceId === resourceId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
  } catch (error) {
    console.error('Error getting comments:', error)
    return []
  }
}

/**
 * Delete comment
 */
export function deleteComment(commentId) {
  try {
    const comments = loadComments()
    const index = comments.findIndex(c => c.id === commentId)

    if (index === -1) {
      throw new Error(`Comment not found: ${commentId}`)
    }

    comments.splice(index, 1)
    saveComments(comments)

    console.log(`✅ Comment deleted: ${commentId}`)
    return { success: true, commentId }
  } catch (error) {
    console.error('Error deleting comment:', error)
    throw error
  }
}

/**
 * Add reaction to comment
 */
export function addReaction(commentId, emoji, author) {
  try {
    const comments = loadComments()
    const comment = comments.find(c => c.id === commentId)

    if (!comment) {
      throw new Error(`Comment not found: ${commentId}`)
    }

    if (!comment.reactions[emoji]) {
      comment.reactions[emoji] = []
    }

    if (!comment.reactions[emoji].includes(author)) {
      comment.reactions[emoji].push(author)
    }

    comment.updatedAt = new Date().toISOString()
    saveComments(comments)

    return comment
  } catch (error) {
    console.error('Error adding reaction:', error)
    throw error
  }
}

/**
 * Assign alert or incident
 */
export function assignResource(resourceType, resourceId, assignedTo, assignedBy) {
  try {
    const assignments = loadAssignments()
    const key = `${resourceType}:${resourceId}`
    const activity = loadActivity()

    const assignment = {
      resourceType,
      resourceId,
      assignedTo,
      assignedBy: assignedBy || 'system',
      assignedAt: new Date().toISOString(),
      status: 'ASSIGNED'
    }

    assignments[key] = assignment
    saveAssignments(assignments)

    // Log activity
    activity.push({
      id: `activity-${Date.now()}`,
      resourceType,
      resourceId,
      type: 'assigned',
      actor: assignedBy || 'system',
      timestamp: new Date().toISOString(),
      details: {
        assignedTo,
        previousAssignment: assignments[key]?.assignedTo
      }
    })
    saveActivity(activity)

    console.log(`✅ Resource assigned: ${key} to ${assignedTo}`)
    return assignment
  } catch (error) {
    console.error('Error assigning resource:', error)
    throw error
  }
}

/**
 * Get assignment
 */
export function getAssignment(resourceType, resourceId) {
  try {
    const assignments = loadAssignments()
    const key = `${resourceType}:${resourceId}`
    return assignments[key] || null
  } catch (error) {
    console.error('Error getting assignment:', error)
    return null
  }
}

/**
 * Unassign resource
 */
export function unassignResource(resourceType, resourceId, unassignedBy) {
  try {
    const assignments = loadAssignments()
    const key = `${resourceType}:${resourceId}`
    const activity = loadActivity()

    const previousAssignment = assignments[key]
    delete assignments[key]
    saveAssignments(assignments)

    // Log activity
    activity.push({
      id: `activity-${Date.now()}`,
      resourceType,
      resourceId,
      type: 'unassigned',
      actor: unassignedBy || 'system',
      timestamp: new Date().toISOString(),
      details: {
        previousAssignment: previousAssignment?.assignedTo
      }
    })
    saveActivity(activity)

    return { success: true, resourceId }
  } catch (error) {
    console.error('Error unassigning resource:', error)
    throw error
  }
}

/**
 * Get activity timeline
 */
export function getActivityTimeline(resourceType, resourceId, limit = 50) {
  try {
    const activity = loadActivity()
    return activity
      .filter(a => a.resourceType === resourceType && a.resourceId === resourceId)
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      .slice(0, limit)
  } catch (error) {
    console.error('Error getting activity timeline:', error)
    return []
  }
}

/**
 * Get user's assignments
 */
export function getUserAssignments(userId) {
  try {
    const assignments = loadAssignments()
    return Object.entries(assignments)
      .filter(([_, assignment]) => assignment.assignedTo === userId)
      .map(([key, assignment]) => {
        const [resourceType, resourceId] = key.split(':')
        return { resourceType, resourceId, ...assignment }
      })
      .sort((a, b) => new Date(b.assignedAt).getTime() - new Date(a.assignedAt).getTime())
  } catch (error) {
    console.error('Error getting user assignments:', error)
    return []
  }
}

/**
 * Extract @mentions from text
 */
function extractMentions(text) {
  const mentionRegex = /@([a-zA-Z0-9._-]+)/g
  const mentions = []
  let match

  while ((match = mentionRegex.exec(text)) !== null) {
    mentions.push(match[1])
  }

  return mentions
}

/**
 * Get mentioned users
 */
export function getMentionedUsers(text) {
  return extractMentions(text)
}

/**
 * Get collaboration statistics
 */
export function getCollaborationStats() {
  try {
    const comments = loadComments()
    const assignments = loadAssignments()
    const activity = loadActivity()

    const stats = {
      totalComments: comments.length,
      activeAssignments: Object.keys(assignments).length,
      totalActivityEvents: activity.length,
      commentsByUser: {},
      assignmentsByUser: {},
      activityByType: {}
    }

    // Count comments by user
    comments.forEach(c => {
      stats.commentsByUser[c.author] = (stats.commentsByUser[c.author] || 0) + 1
    })

    // Count assignments by user
    Object.values(assignments).forEach(a => {
      stats.assignmentsByUser[a.assignedTo] = (stats.assignmentsByUser[a.assignedTo] || 0) + 1
    })

    // Count activity by type
    activity.forEach(a => {
      stats.activityByType[a.type] = (stats.activityByType[a.type] || 0) + 1
    })

    return stats
  } catch (error) {
    console.error('Error getting collaboration stats:', error)
    return {}
  }
}

/**
 * Export collaboration data
 */
export function exportCollaborationData() {
  try {
    const comments = loadComments()
    const assignments = loadAssignments()
    const activity = loadActivity()

    return {
      exportDate: new Date().toISOString(),
      comments: {
        count: comments.length,
        data: comments
      },
      assignments: {
        count: Object.keys(assignments).length,
        data: assignments
      },
      activity: {
        count: activity.length,
        data: activity
      }
    }
  } catch (error) {
    console.error('Error exporting collaboration data:', error)
    return { exportDate: new Date().toISOString(), comments: { count: 0 }, assignments: { count: 0 }, activity: { count: 0 } }
  }
}
