import { showToast } from '../components/toast.js'

export function initAgents() {
  const el = document.getElementById('page-agents')
  if (!el) return

  el.innerHTML = `
    <div class="page-header">
      <div>
        <div class="page-title"><i class="ti ti-robot"></i> AI Agents</div>
        <div class="page-subtitle">Automated intelligence agents managing your M365 tenant</div>
      </div>
      <div class="page-actions">
        <button class="btn btn-primary"><i class="ti ti-plus"></i> Deploy agent</button>
      </div>
    </div>

    <div class="blank-state">
      <i class="ti ti-robot-off" style="font-size:48px;color:var(--color-text-tertiary);margin-bottom:12px"></i>
      <div style="font-size:13px;font-weight:600;margin-bottom:4px">No Agents Available</div>
      <div style="font-size:11px;color:var(--color-text-tertiary);margin-bottom:16px">AI Agents require configuration and deployment through the Graph API management endpoints</div>
      <button class="btn btn-primary btn-sm" id="deploy-agent">Deploy Your First Agent</button>
    </div>
  `

  el.querySelector('#deploy-agent').addEventListener('click', () => {
    showToast('Agent deployment requires Graph API integration and Azure AD app registration', 'info')
  })

  el.querySelector('.btn-primary').addEventListener('click', () => {
    showToast('Agent deployment requires configuration', 'info')
  })
}
