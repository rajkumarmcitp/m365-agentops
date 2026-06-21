/**
 * Agent Dashboard - Phase 3
 * AI Agent processes approved requests and provisions M365 resources
 */

import { state } from '../app.js'
import { showToast } from '../components/toast.js'
import { callAPI } from '../lib/api-client.js'
import { skeletonLoader } from '../lib/skeleton-loader.js'

let viewMode = 'queue'  // 'queue' | 'processing' | 'completed'
let selectedRequestId = null
let pendingRequests = []
let processingRequest = null

export async function initAgent() {
  const el = document.getElementById('page-agent')
  if (!el) return
  viewMode = 'queue'
  selectedRequestId = null
  await render(el)
}

async function render(el) {
  if (viewMode === 'queue') {
    await renderQueue(el)
  } else if (viewMode === 'processing') {
    await renderProcessing(el)
  }
}

// ============================================================
// AGENT QUEUE - Approved Requests Ready to Process
// ============================================================
async function renderQueue(el) {
  // Show skeleton immediately
  el.innerHTML = `
    <div>
      ${skeletonLoader.renderPageHeader('Agent Processing Queue', 'Approved requests ready for provisioning', true)}
      ${skeletonLoader.renderMetricsRowSkeleton(4)}
      ${skeletonLoader.renderTableSkeleton(7, 8)}
    </div>
  `

  try {
    const response = await callAPI('/self-service/requests/pending-processing')

    if (response.success) {
      pendingRequests = response.data || []
      displayQueue(el)
    } else {
      throw new Error(response.error || 'Failed to load requests')
    }
  } catch (error) {
    console.error('Error loading queue:', error)
    showToast('Failed to load requests: ' + error.message, 'error')
    el.querySelector('[class="page-header"]').insertAdjacentHTML('afterend', `
      <div class="alert-banner danger" style="margin:16px">
        <i class="ti ti-alert-triangle"></i>
        <span>${error.message}</span>
      </div>
    `)
  }

  el.querySelector('#queue-refresh')?.addEventListener('click', async () => {
    await renderQueue(el)
  })
}

function displayQueue(el) {
  const header = el.querySelector('.page-header')

  const content = `
    <!-- Stats -->
    <div style="margin:16px;padding:12px;background:var(--color-background-secondary);border-radius:4px;display:flex;align-items:center;gap:12px">
      <div style="flex:1">
        <div style="font-size:24px;font-weight:700;color:var(--clr-warning-text)">${pendingRequests.length}</div>
        <div style="font-size:11px;color:var(--color-text-tertiary)">Approved Requests Pending</div>
      </div>
      <div style="text-align:center">
        <i class="ti ti-arrow-right" style="font-size:24px;color:var(--clr-info-text)"></i>
      </div>
    </div>

    <!-- Queue Table -->
    <div style="margin:16px">
      ${pendingRequests.length === 0 ? `
        <div class="empty-state" style="padding:40px;text-align:center">
          <i class="ti ti-inbox" style="font-size:48px;color:var(--color-text-tertiary);margin-bottom:16px;opacity:0.5;display:block"></i>
          <h3 style="color:var(--color-text-secondary)">Queue is Empty</h3>
          <p style="color:var(--color-text-tertiary)">All approved requests have been processed!</p>
        </div>
      ` : `
        <div class="card" style="padding:0;overflow:hidden">
          <table style="width:100%">
            <thead style="background:var(--color-background-secondary)">
              <tr>
                <th style="padding:12px;text-align:left;font-weight:600;font-size:11px">Request ID</th>
                <th style="padding:12px;text-align:left;font-weight:600;font-size:11px">Requester</th>
                <th style="padding:12px;text-align:left;font-weight:600;font-size:11px">Service</th>
                <th style="padding:12px;text-align:left;font-weight:600;font-size:11px">Operation</th>
                <th style="padding:12px;text-align:left;font-weight:600;font-size:11px">Approved</th>
                <th style="padding:12px;text-align:center;font-weight:600;font-size:11px">Action</th>
              </tr>
            </thead>
            <tbody>
              ${pendingRequests.map(req => {
                const approvedDate = new Date(req.approvedDate).toLocaleString('en-GB', {
                  month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
                })
                return `
                  <tr style="border-bottom:0.5px solid var(--color-border-tertiary)" class="queue-row" data-id="${req.requestId}">
                    <td style="padding:12px;font-size:11px;font-weight:600;color:var(--clr-info-text)">${req.requestId}</td>
                    <td style="padding:12px;font-size:10px">${req.requesterId || 'N/A'}</td>
                    <td style="padding:12px;font-size:10px">${req.service || 'N/A'}</td>
                    <td style="padding:12px;font-size:10px">${req.operation || 'N/A'}</td>
                    <td style="padding:12px;font-size:10px;color:var(--color-text-secondary)">${approvedDate}</td>
                    <td style="padding:12px;text-align:center">
                      <button class="btn btn-primary btn-sm process-btn" style="padding:4px 8px;font-size:9px">Process</button>
                    </td>
                  </tr>
                `
              }).join('')}
            </tbody>
          </table>
        </div>
      `}
    </div>
  `

  header.insertAdjacentHTML('afterend', content)

  // Event listeners
  el.querySelectorAll('.queue-row').forEach(row => {
    row.querySelector('.process-btn')?.addEventListener('click', async (e) => {
      e.stopPropagation()
      selectedRequestId = row.dataset.id
      processingRequest = pendingRequests.find(r => r.requestId === selectedRequestId)
      viewMode = 'processing'
      await render(el)
    })
  })
}

// ============================================================
// PROCESSING VIEW - Execute Provisioning
// ============================================================
async function renderProcessing(el) {
  if (!selectedRequestId) {
    viewMode = 'queue'
    await render(el)
    return
  }

  el.innerHTML = `
    <div class="page-header">
      <div>
        <div class="page-title"><i class="ti ti-cogs"></i> Processing Request</div>
        <div class="page-subtitle" id="proc-subtitle">Loading...</div>
      </div>
      <div class="page-actions">
        <button class="btn" id="proc-back" style="display:none"><i class="ti ti-arrow-left"></i> Back</button>
      </div>
    </div>

    <div style="padding:40px;text-align:center">
      <div style="margin-bottom:20px">
        <i class="ti ti-robot" style="font-size:64px;color:var(--clr-info-text);opacity:0.7"></i>
      </div>
      <div id="proc-status" style="font-size:14px;font-weight:600;margin-bottom:12px">Processing request...</div>
      <div class="spinner" style="margin:20px auto"></div>
      <p id="proc-message" style="color:var(--color-text-secondary);font-size:12px">Setting up Graph API connection...</p>
    </div>
  `

  try {
    // Get full request details
    const detailResponse = await callAPI(`/self-service/requests/${selectedRequestId}`)
    if (!detailResponse.success || !detailResponse.data) {
      throw new Error('Request details not found')
    }

    const request = detailResponse.data
    const subtitle = el.querySelector('#proc-subtitle')
    if (subtitle) subtitle.textContent = `${request.requestId} • ${request.service} / ${request.operation}`

    // Show processing steps
    const steps = [
      { step: 'Validating request...', delay: 1000 },
      { step: 'Connecting to Graph API...', delay: 2000 },
      { step: `Creating ${request.service} resource...`, delay: 3000 },
      { step: 'Configuring permissions...', delay: 2000 },
      { step: 'Finalizing provisioning...', delay: 1000 }
    ]

    let totalDelay = 0
    for (const { step, delay } of steps) {
      await new Promise(resolve => setTimeout(() => {
        const msg = el.querySelector('#proc-message')
        if (msg) msg.textContent = step
        resolve()
      }, totalDelay))
      totalDelay += delay
    }

    // Process the request
    const processResponse = await callAPI(`/self-service/requests/${selectedRequestId}/process`, 'POST', {
      agentId: state.currentUser?.email || 'agent@system'
    })

    if (processResponse.success) {
      displaySuccess(el, processResponse.data)
    } else {
      displayError(el, processResponse.error, selectedRequestId)
    }
  } catch (error) {
    console.error('Processing error:', error)
    displayError(el, error.message, selectedRequestId)
  }
}

function displaySuccess(el, data) {
  const resource = data.resource || {}

  el.innerHTML = `
    <div class="page-header">
      <div>
        <div class="page-title"><i class="ti ti-circle-check" style="color:var(--clr-success-text)"></i> Processing Complete</div>
        <div class="page-subtitle">${data.requestId}</div>
      </div>
      <div class="page-actions">
        <button class="btn" id="proc-back-btn"><i class="ti ti-arrow-left"></i> Back to Queue</button>
      </div>
    </div>

    <div style="margin:16px">
      <div class="alert-banner success" style="margin-bottom:16px">
        <i class="ti ti-circle-check"></i>
        <span><strong>Resource Provisioned Successfully!</strong></span>
      </div>

      <div class="grid-2" style="gap:16px">
        <div class="card">
          <div class="card-title mb-3"><i class="ti ti-receipt"></i> Request Summary</div>
          <div style="display:grid;grid-template-columns:auto 1fr;gap:8px 12px;font-size:11px">
            <span style="color:var(--color-text-tertiary)">Request ID</span>
            <span style="font-weight:600">${data.requestId}</span>

            <span style="color:var(--color-text-tertiary)">Status</span>
            <span style="color:var(--clr-success-text);font-weight:600">✓ Completed</span>

            <span style="color:var(--color-text-tertiary)">Processed At</span>
            <span>${new Date().toLocaleString()}</span>
          </div>
        </div>

        <div class="card">
          <div class="card-title mb-3"><i class="ti ti-shield-check"></i> Provisioned Resource</div>
          <div style="display:grid;grid-template-columns:auto 1fr;gap:8px 12px;font-size:11px">
            <span style="color:var(--color-text-tertiary)">Type</span>
            <span style="font-weight:600">${resource.type || 'N/A'}</span>

            ${resource.resourceName ? `
              <span style="color:var(--color-text-tertiary)">Name</span>
              <span>${resource.resourceName}</span>
            ` : ''}

            ${resource.resourceId ? `
              <span style="color:var(--color-text-tertiary)">Resource ID</span>
              <span style="font-family:var(--font-mono);font-size:9px;color:var(--clr-info-text)">${resource.resourceId.substring(0, 20)}...</span>
            ` : ''}

            ${resource.resourceUrl ? `
              <span style="color:var(--color-text-tertiary)">URL</span>
              <span style="word-break:break-all"><a href="${resource.resourceUrl}" target="_blank" style="color:var(--clr-info-text);text-decoration:none">Open Resource</a></span>
            ` : ''}
          </div>
        </div>
      </div>

      <div style="margin-top:16px;padding:12px;background:var(--clr-success-bg);border-radius:4px;border-left:3px solid var(--clr-success-text)">
        <div style="font-size:11px;color:var(--clr-success-text);font-weight:600;margin-bottom:4px">✓ Notification Sent</div>
        <div style="font-size:10px;color:var(--clr-success-text)">User has been notified of resource completion with access details</div>
      </div>

      <div style="display:flex;gap:10px;margin-top:16px">
        <button class="btn btn-primary" id="proc-continue" style="flex:1">
          <i class="ti ti-arrow-right"></i> Process Next Request
        </button>
        <button class="btn" id="proc-back-btn2">
          <i class="ti ti-arrow-left"></i> Back to Queue
        </button>
      </div>
    </div>
  `

  el.querySelector('#proc-back-btn')?.addEventListener('click', goBackToQueue)
  el.querySelector('#proc-back-btn2')?.addEventListener('click', goBackToQueue)
  el.querySelector('#proc-continue')?.addEventListener('click', async () => {
    viewMode = 'queue'
    selectedRequestId = null
    await render(el)
  })

  showToast('Request processed successfully!', 'success')
}

function displayError(el, error, requestId) {
  el.innerHTML = `
    <div class="page-header">
      <div>
        <div class="page-title"><i class="ti ti-circle-x" style="color:var(--clr-danger-text)"></i> Processing Failed</div>
        <div class="page-subtitle">${requestId}</div>
      </div>
      <div class="page-actions">
        <button class="btn" id="proc-back-btn"><i class="ti ti-arrow-left"></i> Back to Queue</button>
      </div>
    </div>

    <div style="margin:16px">
      <div class="alert-banner danger" style="margin-bottom:16px">
        <i class="ti ti-alert-triangle"></i>
        <span><strong>Provisioning Failed</strong></span>
      </div>

      <div class="card">
        <div class="card-title mb-3"><i class="ti ti-alert-circle"></i> Error Details</div>
        <div style="padding:12px;background:var(--color-background-secondary);border-radius:4px;font-size:11px;color:var(--color-text-secondary);font-family:var(--font-mono);word-break:break-all">
          ${error}
        </div>
      </div>

      <div style="margin-top:16px;padding:12px;background:var(--clr-warning-bg);border-radius:4px;border-left:3px solid var(--clr-warning-text)">
        <div style="font-size:11px;color:var(--clr-warning-text);font-weight:600;margin-bottom:4px">⚠️ Request Status</div>
        <div style="font-size:10px;color:var(--clr-warning-text)">Request remains in "Approved" status. Try processing again or contact support.</div>
      </div>

      <div style="display:flex;gap:10px;margin-top:16px">
        <button class="btn btn-primary" id="proc-retry" style="flex:1">
          <i class="ti ti-refresh"></i> Retry
        </button>
        <button class="btn" id="proc-back-btn2">
          <i class="ti ti-arrow-left"></i> Back to Queue
        </button>
      </div>
    </div>
  `

  el.querySelector('#proc-back-btn')?.addEventListener('click', goBackToQueue)
  el.querySelector('#proc-back-btn2')?.addEventListener('click', goBackToQueue)
  el.querySelector('#proc-retry')?.addEventListener('click', async () => {
    await renderProcessing(el)
  })

  showToast('Provisioning failed: ' + error, 'error')
}

function goBackToQueue() {
  const el = document.getElementById('page-agent')
  viewMode = 'queue'
  selectedRequestId = null
  render(el)
}
