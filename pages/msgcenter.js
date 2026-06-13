import { showToast } from '../components/toast.js'
import { isDemoAccount } from '../lib/demo-account.js'
import { getMessageCenterMessages, getServiceHealth } from '../lib/api-client.js'
import { MC_MESSAGES } from '../data/msgcenter-data.js'

export async function initMsgCenter() {
  const el = document.getElementById('page-msgcenter')
  if (!el) return

  if (isDemoAccount()) {
    renderDemoMsgCenter(el)
  } else {
    await renderProductionMsgCenter(el)
  }
}

function renderDemoMsgCenter(el) {
  const actionRequiredCount = MC_MESSAGES.filter(m => m.actionRequired).length
  const newCount = MC_MESSAGES.length

  el.innerHTML = `
    <div class="page-header">
      <div>
        <div class="page-title"><i class="ti ti-antenna"></i> Change Intelligence</div>
        <div class="page-subtitle">
          Graph: /admin/serviceAnnouncement/messages · Last sync: Today at 08:45 · ${MC_MESSAGES.length} messages
        </div>
      </div>
      <div class="page-actions">
        <button class="btn" id="mc-sync"><i class="ti ti-refresh"></i> Sync now</button>
        <button class="btn" id="mc-digest"><i class="ti ti-file-text"></i> Weekly digest</button>
        <button class="btn btn-primary" id="mc-create-tasks"><i class="ti ti-circle-plus"></i> Create tasks (${actionRequiredCount})</button>
      </div>
    </div>

    <div class="kpi-row">
      <div class="kpi-tile">
        <div class="kpi-value info">${MC_MESSAGES.length}</div>
        <div class="kpi-label">Total Messages</div>
      </div>
      <div class="kpi-tile">
        <div class="kpi-value danger">${actionRequiredCount}</div>
        <div class="kpi-label">Action Required</div>
      </div>
      <div class="kpi-tile">
        <div class="kpi-value warning">${MC_MESSAGES.filter(m => m.severity === 'high').length}</div>
        <div class="kpi-label">High Severity</div>
      </div>
    </div>

    <div style="display:flex;align-items:center;gap:8px;padding:8px 12px;background:var(--color-background-primary);border:0.5px solid var(--color-border-secondary);border-radius:var(--border-radius-md);margin-bottom:16px;font-size:10px;color:var(--color-text-tertiary)">
      <span class="status-dot active pulse"></span>
      <span><strong style="color:var(--color-text-secondary)">Demo Mode</strong> · Showing sample data</span>
    </div>

    <div style="padding:20px;text-align:center;color:var(--color-text-tertiary)">
      <p>Demo account showing sample message data. Messages will be populated from Microsoft Graph API for production accounts.</p>
    </div>
  `

  el.querySelector('#mc-sync').addEventListener('click', () => {
    const btn = el.querySelector('#mc-sync')
    btn.innerHTML = `<span class="spinner dark"></span> Syncing...`
    btn.disabled = true
    setTimeout(() => {
      btn.innerHTML = `<i class="ti ti-refresh"></i> Sync now`
      btn.disabled = false
      showToast(`Synced ${MC_MESSAGES.length} messages`, 'success')
    }, 2000)
  })
}

async function renderProductionMsgCenter(el) {
  el.innerHTML = `
    <div class="page-header">
      <div>
        <div class="page-title"><i class="ti ti-antenna"></i> Change Intelligence</div>
        <div class="page-subtitle">Loading messages from Microsoft Graph API...</div>
      </div>
    </div>
    <div style="padding:20px;text-align:center"><div class="spinner"></div><p>Syncing messages...</p></div>
  `

  try {
    const mcResult = await getMessageCenterMessages()
    const shResult = await getServiceHealth()

    if (!mcResult.success || !mcResult.data || mcResult.data.length === 0) {
      renderBlankMsgCenter(el)
      return
    }

    const messages = mcResult.data
    const actionRequiredCount = messages.filter(m => m.actionRequired).length
    const highSeverityCount = messages.filter(m => m.severity === 'high').length

    el.innerHTML = `
      <div class="page-header">
        <div>
          <div class="page-title"><i class="ti ti-antenna"></i> Change Intelligence</div>
          <div class="page-subtitle">Graph: /admin/serviceAnnouncement/messages · ${messages.length} messages · <span style="color:var(--clr-success-text)">● Real data</span></div>
        </div>
        <div class="page-actions">
          <button class="btn" id="mc-sync"><i class="ti ti-refresh"></i> Sync now</button>
          <button class="btn" id="mc-digest"><i class="ti ti-file-text"></i> Weekly digest</button>
          <button class="btn btn-primary" id="mc-create-tasks"><i class="ti ti-circle-plus"></i> Create tasks (${actionRequiredCount})</button>
        </div>
      </div>

      <div class="kpi-row">
        <div class="kpi-tile">
          <div class="kpi-value info">${messages.length}</div>
          <div class="kpi-label">Total Messages</div>
        </div>
        <div class="kpi-tile">
          <div class="kpi-value danger">${actionRequiredCount}</div>
          <div class="kpi-label">Action Required</div>
        </div>
        <div class="kpi-tile">
          <div class="kpi-value warning">${highSeverityCount}</div>
          <div class="kpi-label">High Severity</div>
        </div>
      </div>

      <div style="display:flex;align-items:center;gap:8px;padding:8px 12px;background:var(--color-background-primary);border:0.5px solid var(--color-border-secondary);border-radius:var(--border-radius-md);margin-bottom:16px;font-size:10px;color:var(--color-text-tertiary)">
        <span class="status-dot active pulse"></span>
        <span><strong style="color:var(--color-text-secondary)">Production Mode</strong> · Real Message Center data from Graph API</span>
      </div>

      <div style="padding:20px;text-align:center;color:var(--color-text-secondary)">
        <p>Displaying ${messages.length} real Message Center announcements for your Nas-Tech tenant</p>
      </div>
    `

    el.querySelector('#mc-sync').addEventListener('click', async () => {
      const btn = el.querySelector('#mc-sync')
      btn.innerHTML = `<span class="spinner dark"></span> Syncing...`
      btn.disabled = true
      setTimeout(async () => {
        btn.innerHTML = `<i class="ti ti-refresh"></i> Sync now`
        btn.disabled = false
        await renderProductionMsgCenter(el)
        showToast(`Synced ${messages.length} messages`, 'success')
      }, 2000)
    })
  } catch (error) {
    console.error('Error loading Message Center:', error)
    renderBlankMsgCenter(el)
  }
}

function renderBlankMsgCenter(el) {
  el.innerHTML = `
    <div class="page-header">
      <div>
        <div class="page-title"><i class="ti ti-antenna"></i> Change Intelligence</div>
        <div class="page-subtitle">Service announcements and health status from Microsoft Graph API</div>
      </div>
      <div class="page-actions">
        <button class="btn" id="mc-sync"><i class="ti ti-refresh"></i> Sync now</button>
      </div>
    </div>

    <div class="blank-state">
      <i class="ti ti-inbox-off" style="font-size:48px;color:var(--color-text-tertiary);margin-bottom:12px"></i>
      <div style="font-size:13px;font-weight:600;margin-bottom:4px">No Messages Available</div>
      <div style="font-size:11px;color:var(--color-text-tertiary);margin-bottom:16px">
        Change Intelligence requires Microsoft Graph API integration for /admin/serviceAnnouncement/messages
      </div>
      <div style="font-size:10px;color:var(--color-text-tertiary);padding:12px;background:var(--color-background-secondary);border-radius:var(--border-radius-md);text-align:left;max-width:400px">
        <strong>Graph API endpoints:</strong>
        <div style="margin-top:6px;font-family:monospace;font-size:9px">
          GET /admin/serviceAnnouncement/messages<br>
          GET /admin/serviceAnnouncement/issues
        </div>
      </div>
    </div>
  `

  el.querySelector('#mc-sync').addEventListener('click', () => {
    const btn = el.querySelector('#mc-sync')
    btn.innerHTML = `<span class="spinner dark"></span> Syncing...`
    btn.disabled = true
    setTimeout(() => {
      btn.innerHTML = `<i class="ti ti-refresh"></i> Sync now`
      btn.disabled = false
      showToast('No message data available from Graph API', 'info')
    }, 2000)
  })
}
