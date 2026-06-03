import { go } from '../app.js'
import { showToast } from '../components/toast.js'

const AGENTS = [
  { id: 'approval', name: 'Approval Agent', desc: 'Automates access request routing, approval workflows, and SLA tracking.', icon: 'ti-check-list', bg: '#E6F1FB', color: '#0C447C', status: 'active', statusLabel: 'Active', statLabel: '7 pending', statIcon: 'ti-inbox' },
  { id: 'execution', name: 'Execution Agent', desc: 'Executes approved Graph API actions — group creation, license assignment, mailbox provisioning.', icon: 'ti-bolt', bg: '#EAF3DE', color: '#3B6D11', status: 'active', statusLabel: 'Active', statLabel: '12 Graph actions today', statIcon: 'ti-api' },
  { id: 'security', name: 'Security Agent', desc: 'Monitors risky sign-ins, triggers automated responses to identity threats.', icon: 'ti-shield-exclamation', bg: '#FCEBEB', color: '#A32D2D', status: 'alert', statusLabel: 'Alert', statLabel: '3 risky users', statIcon: 'ti-user-exclamation' },
  { id: 'audit', name: 'Audit Agent', desc: 'Collects and analyses audit log events, surfaces anomalous activity patterns.', icon: 'ti-database', bg: '#FAEEDA', color: '#854F0B', status: 'active', statusLabel: 'Active', statLabel: '28 event types tracked', statIcon: 'ti-activity' },
  { id: 'config', name: 'Config Agent', desc: 'Scans CIS Benchmark controls against tenant configuration on schedule.', icon: 'ti-robot', bg: '#E0F5F4', color: '#0D6B68', status: 'active', statusLabel: 'Active', statLabel: 'Last scan 08:45', statIcon: 'ti-clock', link: 'm365config' },
  { id: 'compliance', name: 'Compliance Agent', desc: 'Monitors regulatory compliance posture across Purview, DLP, and retention policies.', icon: 'ti-clipboard-check', bg: '#EEEDFE', color: '#3C3489', status: 'idle', statusLabel: 'Idle', statLabel: 'No recent scans', statIcon: 'ti-info-circle' },
]

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

    <div class="agents-grid" id="agents-grid"></div>
  `

  const grid = el.querySelector('#agents-grid')
  AGENTS.forEach(agent => {
    const statusDotCls = agent.status === 'active' ? 'active pulse' : agent.status === 'alert' ? 'alert pulse' : 'idle'
    const statusColor = agent.status === 'active' ? 'var(--clr-success-text)' : agent.status === 'alert' ? 'var(--clr-danger-text)' : 'var(--color-text-tertiary)'
    const card = document.createElement('div')
    card.className = 'agent-card'
    card.innerHTML = `
      <div class="agent-icon" style="background:${agent.bg};color:${agent.color}">
        <i class="ti ${agent.icon}"></i>
      </div>
      <div class="agent-name">${agent.name}</div>
      <div class="agent-desc">${agent.desc}</div>
      <div style="display:flex;align-items:center;gap:6px;margin-bottom:8px">
        <div class="status-dot ${statusDotCls}"></div>
        <span style="font-size:11px;font-weight:600;color:${statusColor}">${agent.statusLabel}</span>
      </div>
      <div class="agent-stat">
        <i class="ti ${agent.statIcon}" style="font-size:12px;color:${agent.color}"></i>
        ${agent.statLabel}
      </div>
      <div style="display:flex;gap:6px;margin-top:12px">
        <button class="btn btn-xs btn-primary agent-configure" data-id="${agent.id}"><i class="ti ti-settings"></i> Configure</button>
        ${agent.status !== 'idle' ? `<button class="btn btn-xs agent-pause" data-id="${agent.id}"><i class="ti ti-player-pause"></i> Pause</button>` : `<button class="btn btn-xs btn-success agent-start" data-id="${agent.id}"><i class="ti ti-player-play"></i> Start</button>`}
      </div>
    `
    grid.appendChild(card)
  })

  el.querySelectorAll('.agent-configure').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = btn.dataset.id
      if (id === 'config') go('m365config')
      else showToast(`Opening configuration for ${AGENTS.find(a => a.id === id)?.name}...`, 'info')
    })
  })
  el.querySelectorAll('.agent-pause').forEach(btn => {
    btn.addEventListener('click', () => showToast('Agent paused.', 'warning'))
  })
  el.querySelectorAll('.agent-start').forEach(btn => {
    btn.addEventListener('click', () => showToast('Agent started.', 'success'))
  })
}
