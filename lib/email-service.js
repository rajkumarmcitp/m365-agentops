// ============================================================
// Email Notification Service
// Sends email notifications for request status changes
// ============================================================

import { api } from './api-client.js'
import { showToast } from '../components/toast.js'

// Email templates
const EMAIL_TEMPLATES = {
  submitted: {
    subject: 'Service Request Submitted - {requestId}',
    template: `
      <h2>Request Submitted Successfully</h2>
      <p>Your service request has been submitted for review.</p>
      <div style="background:#f0f0f0;padding:15px;border-radius:5px;margin:20px 0">
        <p><strong>Request ID:</strong> {requestId}</p>
        <p><strong>Service:</strong> {service}</p>
        <p><strong>Operation:</strong> {operation}</p>
        <p><strong>Submitted:</strong> {submittedDate}</p>
        <p><strong>Status:</strong> <span style="color:#FF9800">Pending Approval</span></p>
      </div>
      <p>Next Steps:</p>
      <ul>
        <li>Your request has been forwarded to the appropriate approvers</li>
        <li>You will receive updates via email at each approval stage</li>
        <li>Typical approval time: {estimatedTime}</li>
      </ul>
      <p><a href="{portalUrl}" style="background:#2196F3;color:white;padding:10px 20px;border-radius:5px;text-decoration:none">
        Track Request Status
      </a></p>
    `,
  },

  approved: {
    subject: 'Request Approved - {requestId}',
    template: `
      <h2>Your Request Has Been Approved ✓</h2>
      <p>Great news! Your service request has been approved and will now be processed by our automated agent.</p>
      <div style="background:#E8F5E9;padding:15px;border-radius:5px;margin:20px 0;border-left:4px solid #4CAF50">
        <p><strong>Request ID:</strong> {requestId}</p>
        <p><strong>Service:</strong> {service}</p>
        <p><strong>Approved By:</strong> {approvedBy}</p>
        <p><strong>Approved Date:</strong> {approvedDate}</p>
        {comment}
      </div>
      <p><strong>What Happens Next:</strong></p>
      <ul>
        <li>AI Agent will validate and prepare the request for execution</li>
        <li>System provisioning will begin automatically</li>
        <li>You will be notified when the request is completed</li>
        <li>Estimated completion time: {estimatedCompletion}</li>
      </ul>
      <p><a href="{portalUrl}" style="background:#2196F3;color:white;padding:10px 20px;border-radius:5px;text-decoration:none">
        View Request Details
      </a></p>
    `,
  },

  rejected: {
    subject: 'Request Rejected - {requestId}',
    template: `
      <h2>Request Could Not Be Approved</h2>
      <p>Your service request has been reviewed and cannot be approved at this time.</p>
      <div style="background:#FFEBEE;padding:15px;border-radius:5px;margin:20px 0;border-left:4px solid #F44336">
        <p><strong>Request ID:</strong> {requestId}</p>
        <p><strong>Service:</strong> {service}</p>
        <p><strong>Reviewed By:</strong> {reviewedBy}</p>
        <p><strong>Review Date:</strong> {reviewedDate}</p>
        <p><strong>Reason:</strong></p>
        <p style="margin-left:20px">{reason}</p>
      </div>
      <p><strong>Next Steps:</strong></p>
      <ul>
        <li>Review the rejection reason above</li>
        <li>Address any concerns or requirements</li>
        <li>You can submit a new request or contact the reviewer for clarification</li>
      </ul>
      <p><a href="{portalUrl}" style="background:#2196F3;color:white;padding:10px 20px;border-radius:5px;text-decoration:none">
        Submit New Request
      </a></p>
    `,
  },

  completed: {
    subject: 'Request Completed - {requestId}',
    template: `
      <h2>Your Request Has Been Completed ✓</h2>
      <p>Your service request has been successfully completed and is ready to use.</p>
      <div style="background:#E8F5E9;padding:15px;border-radius:5px;margin:20px 0;border-left:4px solid #4CAF50">
        <p><strong>Request ID:</strong> {requestId}</p>
        <p><strong>Service:</strong> {service}</p>
        <p><strong>Operation:</strong> {operation}</p>
        <p><strong>Completed Date:</strong> {completedDate}</p>
        <p><strong>Status:</strong> <span style="color:#4CAF50">✓ Completed</span></p>
      </div>
      <p><strong>Details:</strong></p>
      <p>{completionDetails}</p>
      <p>If you have any questions or need additional support, please contact our IT team.</p>
      <p><a href="{portalUrl}" style="background:#2196F3;color:white;padding:10px 20px;border-radius:5px;text-decoration:none">
        View All Requests
      </a></p>
    `,
  },
}

// Send email notification
export async function sendEmailNotification(type, recipientEmail, data) {
  try {
    if (!recipientEmail) {
      console.warn('⚠️ No recipient email provided')
      return false
    }

    const template = EMAIL_TEMPLATES[type]
    if (!template) {
      console.warn(`⚠️ Unknown email template: ${type}`)
      return false
    }

    // Prepare email content
    let subject = template.subject
    let body = template.template

    // Replace placeholders
    Object.entries(data).forEach(([key, value]) => {
      const placeholder = `{${key}}`
      subject = subject.replace(placeholder, value || '')
      body = body.replace(placeholder, value || '')
    })

    // Send via backend API
    const response = await fetch(`${api}/notifications/email`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        to: recipientEmail,
        subject,
        html: body,
        type,
        requestId: data.requestId,
      }),
    })

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`)
    }

    const result = await response.json()
    console.log(`✓ Email sent to ${recipientEmail} (${type})`)
    return result.success !== false

  } catch (error) {
    console.error(`❌ Error sending email (${type}):`, error.message)
    return false
  }
}

// Request submitted notification
export async function notifyRequestSubmitted(recipientEmail, requestData) {
  return sendEmailNotification('submitted', recipientEmail, {
    requestId: requestData.requestId,
    service: requestData.service,
    operation: requestData.operation,
    submittedDate: new Date().toLocaleString(),
    estimatedTime: requestData.estimatedTime || '2-3 days',
    portalUrl: `${window.location.origin}/portal/my-requests`,
  })
}

// Request approved notification
export async function notifyRequestApproved(recipientEmail, requestData, approverEmail, comment) {
  return sendEmailNotification('approved', recipientEmail, {
    requestId: requestData.requestId,
    service: requestData.service,
    approvedBy: approverEmail,
    approvedDate: new Date().toLocaleString(),
    comment: comment ? `<p><strong>Approver Comment:</strong> ${comment}</p>` : '',
    estimatedCompletion: requestData.estimatedCompletion || '1-2 hours',
    portalUrl: `${window.location.origin}/portal/my-requests`,
  })
}

// Request rejected notification
export async function notifyRequestRejected(recipientEmail, requestData, reviewerEmail, reason) {
  return sendEmailNotification('rejected', recipientEmail, {
    requestId: requestData.requestId,
    service: requestData.service,
    reviewedBy: reviewerEmail,
    reviewedDate: new Date().toLocaleString(),
    reason: reason || 'No reason provided',
    portalUrl: `${window.location.origin}/portal`,
  })
}

// Request completed notification
export async function notifyRequestCompleted(recipientEmail, requestData, details) {
  return sendEmailNotification('completed', recipientEmail, {
    requestId: requestData.requestId,
    service: requestData.service,
    operation: requestData.operation,
    completedDate: new Date().toLocaleString(),
    completionDetails: details || 'Your request has been successfully processed.',
    portalUrl: `${window.location.origin}/portal/my-requests`,
  })
}

// Batch send notifications
export async function sendNotifications(notifications) {
  const results = await Promise.all(
    notifications.map(n => sendEmailNotification(n.type, n.email, n.data))
  )
  return results.filter(r => r).length // return count of successful sends
}
