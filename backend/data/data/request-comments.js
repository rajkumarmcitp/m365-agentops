// ============================================================
// Request Comments/Discussion Thread Data Structure
// Manages comments and discussion on service requests
// ============================================================

// In-memory storage for demo (would be in SharePoint in production)
export const requestComments = {}

export function getRequestComments(requestId) {
  return requestComments[requestId] || []
}

export function addComment(requestId, comment) {
  if (!requestComments[requestId]) {
    requestComments[requestId] = []
  }

  const newComment = {
    id: `comment-${Date.now()}`,
    requestId,
    author: comment.author,
    authorEmail: comment.authorEmail,
    content: comment.content,
    type: comment.type || 'comment', // 'comment', 'cancellation-request', 'cancellation-approved', 'cancellation-denied'
    timestamp: new Date().toISOString(),
    isAdmin: comment.isAdmin || false,
  }

  requestComments[requestId].push(newComment)
  return newComment
}

export function addCancellationRequest(requestId, reason, userEmail, userName) {
  return addComment(requestId, {
    author: userName,
    authorEmail: userEmail,
    content: `**Cancellation Requested**\n\nReason: ${reason}`,
    type: 'cancellation-request',
    isAdmin: false,
  })
}

export function approveCancellation(requestId, adminEmail, adminName, comment) {
  return addComment(requestId, {
    author: adminName,
    authorEmail: adminEmail,
    content: `**Cancellation Approved**\n\n${comment || 'Cancellation approved by admin.'}`,
    type: 'cancellation-approved',
    isAdmin: true,
  })
}

export function denyCancellation(requestId, adminEmail, adminName, reason) {
  return addComment(requestId, {
    author: adminName,
    authorEmail: adminEmail,
    content: `**Cancellation Denied**\n\nReason: ${reason}`,
    type: 'cancellation-denied',
    isAdmin: true,
  })
}

export function clearRequestComments(requestId) {
  delete requestComments[requestId]
}
