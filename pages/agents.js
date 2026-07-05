import { showToast } from '../components/toast.js'
import { isDemoAccount } from '../lib/demo-account.js'
import { go } from '../app.js'
import { skeletonLoader } from '../lib/skeleton-loader.js'

const AGENT_CONFIGS = {
  security: { name: 'Security Agent', desc: 'Monitors risky sign-ins, triggers automated responses to identity threats.', icon: 'ti-shield-exclamation', bg: '#FCEBEB', color: '#A32D2D' },
  approval: { name: 'Approval Agent', desc: 'Automates access request routing, approval workflows, and SLA tracking.', icon: 'ti-check-list', bg: '#E6F1FB', color: '#0C447C' },
  execution: { name: 'Execution Agent', desc: 'Executes approved Graph API actions — group creation, license assignment, mailbox provisioning.', icon: 'ti-bolt', bg: '#EAF3DE', color: '#3B6D11' },
  audit: { name: 'Audit Agent', desc: 'Collects and analyses audit log events, surfaces anomalous activity patterns.', icon: 'ti-database', bg: '#FAEEDA', color: '#854F0B' },
  config: { name: 'Config Agent', desc: 'Scans CIS Benchmark controls against tenant configuration on schedule.', icon: 'ti-robot', bg: '#E0F5F4', color: '#0D6B68' },
  compliance: { name: 'Compliance Agent', desc: 'Monitors regulatory compliance posture across Purview, DLP, and retention policies.', icon: 'ti-clipboard-check', bg: '#EEEDFE', color: '#3C3489' }
}

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

  if (isDemoAccount()) {
    renderDemoAgents(el)
  } else {
    // Show skeleton immediately
    el.innerHTML = `
      <div>
        ${skeletonLoader.renderPageHeader('AI Agents', 'Automated intelligence agents managing your M365 tenant', true)}
        ${skeletonLoader.renderCardGridSkeleton(3, 6)}
      </div>
    `
    // Then load real agents
    loadAndRenderAgents(el)
  }
}

async function loadAndRenderAgents(el) {
  try {
    const response = await fetch('/api/agents/all')
    const result = await response.json()

    if (!result.success) {
      showToast('Failed to load agents', 'error')
      renderBlankAgents(el)
      return
    }

    const agentsData = result.data
    renderProductionAgents(el, agentsData)
  } catch (error) {
    console.error('Error loading agents:', error)
    renderBlankAgents(el)
  }
}

function renderDemoAgents(el) {
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

    <div style="display:flex;align-items:center;gap:8px;padding:8px 12px;background:var(--color-background-primary);border:0.5px solid var(--color-border-secondary);border-radius:var(--border-radius-md);margin-bottom:16px;font-size:10px;color:var(--color-text-tertiary)">
      <span class="status-dot active pulse"></span>
      <span><strong style="color:var(--color-text-secondary)">Demo Mode</strong> · Showing sample agents</span>
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
    btn.addEventListener('click', async () => {
      const id = btn.dataset.id
      if (id === 'config') await go('m365config')
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

function renderProductionAgents(el, agentsData) {
  el.innerHTML = `
    <div class="page-header">
      <div>
        <div class="page-title"><i class="ti ti-robot"></i> AI Agents</div>
        <div class="page-subtitle">Automated intelligence agents managing your M365 tenant</div>
      </div>
      <div class="page-actions">
        <button class="btn btn-primary" id="configure-all-btn"><i class="ti ti-settings"></i> Configure</button>
        <button class="btn btn-primary" id="refresh-agents-btn" style="margin-left:8px"><i class="ti ti-refresh"></i> Refresh</button>
      </div>
    </div>

    <div id="schedule-presets" style="display:none"></div>
    <div class="agents-grid" id="agents-grid"></div>

    <!-- Configuration Modal -->
    <div id="config-modal" style="position:fixed;top:0;left:0;right:0;bottom:0;background:rgba(0,0,0,0.5);z-index:1000;align-items:center;justify-content:center" hidden>
      <div style="background:var(--color-background-primary);border-radius:12px;width:90%;max-width:900px;max-height:80vh;overflow-y:auto;box-shadow:0 20px 60px rgba(0,0,0,0.3)">
        <!-- Modal Header -->
        <div style="padding:20px;border-bottom:1px solid var(--color-border);display:flex;justify-content:space-between;align-items:center;position:sticky;top:0;background:var(--color-background-primary);z-index:10">
          <div>
            <div style="font-size:16px;font-weight:700">Configure All Agents</div>
            <div style="font-size:11px;color:var(--color-text-secondary);margin-top:4px">Update schedules and notifications for all agents</div>
          </div>
          <button id="close-config-modal" style="background:none;border:none;font-size:24px;cursor:pointer;color:var(--color-text-secondary)">✕</button>
        </div>

        <!-- Modal Body -->
        <div id="config-modal-body" style="padding:20px;display:grid;grid-template-columns:repeat(auto-fit,minmax(400px,1fr));gap:20px">
          <!-- Agent configuration panels will be inserted here -->
        </div>

        <!-- Modal Footer -->
        <div style="padding:20px;border-top:1px solid var(--color-border);display:flex;gap:8px;justify-content:flex-end;background:var(--color-background-secondary)">
          <button id="cancel-all-config" class="btn btn-xs"><i class="ti ti-x"></i> Cancel</button>
          <button id="save-all-config" class="btn btn-xs btn-primary"><i class="ti ti-check"></i> Save All Changes</button>
        </div>
      </div>
    </div>
  `

  const grid = el.querySelector('#agents-grid')
  grid.className = 'agents-grid'

  const agentsList = ['security', 'config', 'approval', 'execution', 'audit', 'compliance']

  agentsList.forEach(agentId => {
    const agentData = agentsData[agentId]
    const config = AGENT_CONFIGS[agentId]

    if (!agentData || !config) return

    const card = document.createElement('div')
    card.className = 'agent-card'

    const statusDotCls = agentData.status === 'active' ? 'active pulse' : agentData.status === 'alert' ? 'alert pulse' : 'idle'
    const statusColor = agentData.status === 'active' ? 'var(--clr-success-text)' : agentData.status === 'alert' ? 'var(--clr-danger-text)' : agentData.status === 'error' ? 'var(--clr-danger-text)' : 'var(--color-text-tertiary)'

    let statLabel = ''
    if (agentId === 'security') {
      statLabel = `${agentData.stats.totalRiskyUsers} risky users`
    } else if (agentId === 'config') {
      statLabel = `${agentData.stats.complianceScore}% compliant`
    } else if (agentId === 'approval') {
      statLabel = `${agentData.stats.pending} pending`
    } else if (agentId === 'execution') {
      statLabel = `${agentData.stats.actionsExecuted} executed`
    } else if (agentId === 'audit') {
      statLabel = `${agentData.stats.eventCount} events`
    } else if (agentId === 'compliance') {
      statLabel = 'No recent scans'
    }

    const lastRunTime = agentData.lastRun ? new Date(agentData.lastRun).toLocaleString() : 'Never'

    card.innerHTML = `
      <!-- Card Header -->
      <div class="card-header">
        <div style="display:flex;align-items:flex-start;gap:12px;flex:1;cursor:pointer" class="agent-card-content" data-id="${agentId}">
          <div style="background:${config.bg};color:${config.color};width:36px;height:36px;border-radius:6px;display:flex;align-items:center;justify-content:center;flex-shrink:0">
            <i class="ti ${config.icon}" style="font-size:18px"></i>
          </div>
          <div style="flex:1;min-width:0">
            <div class="agent-name">${config.name}</div>
            <div class="agent-desc">${config.desc}</div>
          </div>
        </div>
      </div>

      <!-- Status & Metrics Grid -->
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px;margin-bottom:12px;padding-bottom:12px;border-bottom:0.5px solid var(--color-border-tertiary)">
        <div>
          <div style="font-size:9px;color:var(--color-text-tertiary);margin-bottom:6px;text-transform:uppercase;font-weight:600;letter-spacing:0.5px">Status</div>
          <div style="display:flex;align-items:center;gap:6px;cursor:pointer" class="agent-card-content" data-id="${agentId}">
            <div class="status-dot ${statusDotCls}"></div>
            <span style="font-size:12px;font-weight:600;color:${statusColor}">${agentData.statusLabel}</span>
          </div>
        </div>
        <div>
          <div style="font-size:9px;color:var(--color-text-tertiary);margin-bottom:6px;text-transform:uppercase;font-weight:600;letter-spacing:0.5px">Metrics</div>
          <div class="agent-stat" style="cursor:pointer" class="agent-card-content" data-id="${agentId}">${statLabel}</div>
        </div>
      </div>

      <!-- Last Run -->
      <div style="font-size:10px;color:var(--color-text-tertiary);cursor:pointer" class="agent-card-content" data-id="${agentId}">📅 Last run: ${lastRunTime}</div>
    `
    grid.appendChild(card)

    // Make card clickable for details
    card.querySelectorAll('.agent-card-content').forEach(element => {
      element.addEventListener('click', async () => {
        window.selectedAgentId = agentId
        await go('agent-details')
      })
    })
  })

  // Load schedule presets and notification channels
  loadAgentConfigOptions(el)

  // Global Configure All button
  el.querySelector('#configure-all-btn').addEventListener('click', async () => {
    openConfigureModal(el)
  })

  // Close modal
  el.querySelector('#close-config-modal').addEventListener('click', () => {
    closeConfigureModal(el)
  })

  el.querySelector('#cancel-all-config').addEventListener('click', () => {
    closeConfigureModal(el)
  })

  // Save all config
  el.querySelector('#save-all-config').addEventListener('click', async () => {
    await saveAllAgentConfig(el)
  })


  el.querySelectorAll('.agent-pause').forEach(btn => {
    btn.addEventListener('click', async () => {
      const id = btn.dataset.id
      try {
        const response = await fetch(`/api/agents/${id}/pause`, { method: 'POST' })
        const result = await response.json()
        if (result.success) {
          showToast(`${id} agent paused`, 'warning')
          loadAndRenderAgents(el)
        }
      } catch (error) {
        showToast('Failed to pause agent', 'error')
      }
    })
  })

  el.querySelectorAll('.agent-resume').forEach(btn => {
    btn.addEventListener('click', async () => {
      const id = btn.dataset.id
      try {
        const response = await fetch(`/api/agents/${id}/resume`, { method: 'POST' })
        const result = await response.json()
        if (result.success) {
          showToast(`${id} agent resumed`, 'success')
          loadAndRenderAgents(el)
        }
      } catch (error) {
        showToast('Failed to resume agent', 'error')
      }
    })
  })

  el.querySelector('#refresh-agents-btn').addEventListener('click', () => {
    loadAndRenderAgents(el)
  })
}

// ============================================================
// Configuration Helper Functions
// ============================================================

async function loadAgentConfigOptions(el) {
  try {
    const presetsResponse = await fetch('/api/agents/config/presets')
    const presetsData = await presetsResponse.json()
    const presets = presetsData.data

    const notificationsResponse = await fetch('/api/agents/config/notification-channels')
    const notificationsData = await notificationsResponse.json()
    const channels = notificationsData.data

    window.schedulePresets = presets
    window.notificationChannels = channels
  } catch (error) {
    console.error('Failed to load config options:', error)
  }
}

async function openConfigureModal(el) {
  const modal = el.querySelector('#config-modal')
  const modalBody = el.querySelector('#config-modal-body')

  // Load all agent configs
  const agentsList = ['security', 'config', 'approval', 'execution', 'audit', 'compliance']
  let html = ''

  for (const agentId of agentsList) {
    try {
      const response = await fetch(`/api/agents/${agentId}/config`)
      const result = await response.json()

      if (!result.success) continue

      const config = result.data
      const presets = window.schedulePresets

      html += `
        <div style="border:1px solid var(--color-border);border-radius:8px;padding:16px">
          <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px">
            <div style="font-weight:700;font-size:12px">${agentId.charAt(0).toUpperCase() + agentId.slice(1)} Agent</div>
            <div style="display:flex;gap:6px">
              ${config.enabled ? `
                <button class="btn btn-xs agent-pause-modal" data-id="${agentId}" style="padding:4px 8px"><i class="ti ti-player-pause"></i></button>
              ` : `
                <button class="btn btn-xs btn-success agent-resume-modal" data-id="${agentId}" style="padding:4px 8px"><i class="ti ti-player-play"></i></button>
              `}
            </div>
          </div>

          <!-- Schedule -->
          <div style="margin-bottom:12px">
            <label style="font-size:9px;font-weight:600;color:var(--color-text-tertiary);display:block;margin-bottom:6px;text-transform:uppercase">Schedule</label>
            <select class="modal-schedule-select" data-agent-id="${agentId}" style="width:100%;padding:6px;border:1px solid var(--color-border);border-radius:4px;font-size:10px;background:var(--color-background-primary)">
              ${Object.entries(presets).map(([key, preset]) => `
                <option value="${preset.cron}" ${config.schedule === preset.cron ? 'selected' : ''}>${preset.label}</option>
              `).join('')}
            </select>
          </div>

          <!-- Notifications -->
          <div>
            <label style="font-size:9px;font-weight:600;color:var(--color-text-tertiary);display:block;margin-bottom:6px;text-transform:uppercase">Notifications</label>
            <div style="display:flex;flex-direction:column;gap:6px">
              ${Object.entries(config.notifications).map(([channel, enabled]) => `
                <label style="display:flex;align-items:center;gap:8px;cursor:pointer;font-size:10px">
                  <input type="checkbox" class="modal-notification" data-agent-id="${agentId}" data-channel="${channel}" ${enabled ? 'checked' : ''} style="cursor:pointer;width:14px;height:14px">
                  <span>${channel.charAt(0).toUpperCase() + channel.slice(1)}</span>
                </label>
              `).join('')}
            </div>
          </div>
        </div>
      `
    } catch (error) {
      console.error(`Failed to load config for ${agentId}:`, error)
    }
  }

  modalBody.innerHTML = html
  modal.hidden = false
  modal.style.display = 'flex'

  // Add pause/resume button listeners
  el.querySelectorAll('.agent-pause-modal').forEach(btn => {
    btn.addEventListener('click', async (e) => {
      e.preventDefault()
      e.stopPropagation()
      const agentId = btn.dataset.id
      try {
        await fetch(`/api/agents/${agentId}/pause`, { method: 'POST' })
        showToast(`${agentId} agent paused`, 'warning')
        openConfigureModal(el)
      } catch (error) {
        showToast('Failed to pause agent', 'error')
      }
    })
  })

  el.querySelectorAll('.agent-resume-modal').forEach(btn => {
    btn.addEventListener('click', async (e) => {
      e.preventDefault()
      e.stopPropagation()
      const agentId = btn.dataset.id
      try {
        await fetch(`/api/agents/${agentId}/resume`, { method: 'POST' })
        showToast(`${agentId} agent resumed`, 'success')
        openConfigureModal(el)
      } catch (error) {
        showToast('Failed to resume agent', 'error')
      }
    })
  })
}

function closeConfigureModal(el) {
  const modal = el.querySelector('#config-modal')
  modal.hidden = true
  modal.style.display = 'none'
}

async function saveAllAgentConfig(el) {
  try {
    const agentsList = ['security', 'config', 'approval', 'execution', 'audit', 'compliance']
    const presets = window.schedulePresets

    for (const agentId of agentsList) {
      const scheduleSelect = el.querySelector(`.modal-schedule-select[data-agent-id="${agentId}"]`)
      if (!scheduleSelect) continue

      const schedule = scheduleSelect.value

      // Find schedule label
      let scheduleLabel = schedule
      for (const [key, preset] of Object.entries(presets)) {
        if (preset.cron === schedule) {
          scheduleLabel = preset.label
          break
        }
      }

      // Get notifications
      const notifications = {}
      el.querySelectorAll(`.modal-notification[data-agent-id="${agentId}"]`).forEach(checkbox => {
        notifications[checkbox.dataset.channel] = checkbox.checked
      })

      // Save config
      await fetch(`/api/agents/${agentId}/config`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ schedule, scheduleLabel, notifications })
      })
    }

    showToast('All agent configurations saved!', 'success')
    closeConfigureModal(el)
    loadAndRenderAgents(el)
  } catch (error) {
    console.error('Failed to save configurations:', error)
    showToast('Error saving configurations', 'error')
  }
}

function renderBlankAgents(el) {
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
      <div style="font-size:11px;color:var(--color-text-tertiary);margin-bottom:16px">Failed to load agents. Please check your connection and try again.</div>
    </div>
  `
}
