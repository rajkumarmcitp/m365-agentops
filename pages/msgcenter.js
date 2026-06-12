import { showToast } from '../components/toast.js'

export function initMsgCenter() {
  const el = document.getElementById('page-msgcenter')
  if (!el) return

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
