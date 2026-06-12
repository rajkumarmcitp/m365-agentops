import { showToast } from '../components/toast.js'

export function initZeroTrust() {
  const el = document.getElementById('page-zerotrust')
  if (!el) return

  el.innerHTML = `
    <div class="page-header">
      <div>
        <div class="page-title"><i class="ti ti-lock-check"></i> Zero Trust Compliance</div>
        <div class="page-subtitle">Automated Zero Trust control assessments from Graph API</div>
      </div>
      <div class="page-actions">
        <button class="btn" id="zt-rescan"><i class="ti ti-refresh"></i> Rescan</button>
      </div>
    </div>

    <div class="blank-state">
      <i class="ti ti-database-off" style="font-size:48px;color:var(--color-text-tertiary);margin-bottom:12px"></i>
      <div style="font-size:13px;font-weight:600;margin-bottom:4px">No Zero Trust Data Available</div>
      <div style="font-size:11px;color:var(--color-text-tertiary);margin-bottom:16px">Zero Trust compliance controls will appear here when evaluated via Graph API</div>
      <button class="btn btn-primary btn-sm" id="zt-initiate">Initiate Assessment</button>
    </div>
  `

  el.querySelector('#zt-rescan').addEventListener('click', () => {
    const btn = el.querySelector('#zt-rescan')
    btn.innerHTML = `<span class="spinner dark"></span> Scanning...`
    btn.disabled = true
    setTimeout(() => {
      btn.innerHTML = `<i class="ti ti-refresh"></i> Rescan`
      btn.disabled = false
      showToast('No Zero Trust assessment data available from Graph API', 'info')
    }, 2000)
  })

  el.querySelector('#zt-initiate').addEventListener('click', () => {
    showToast('Zero Trust assessment requires integration with Azure DevOps or Graph API', 'info')
  })
}

