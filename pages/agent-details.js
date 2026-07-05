import { showToast } from '../components/toast.js'
import { go } from '../app.js'

export async function initAgentDetails() {
  console.log('🚀 initAgentDetails called!')
  const el = document.getElementById('page-agent-details')
  console.log('📄 Found element:', el ? 'YES' : 'NO')
  if (!el) {
    console.error('❌ Element page-agent-details not found!')
    return
  }

  const agentId = window.selectedAgentId
  console.log('📌 Agent ID from window:', agentId)

  if (!agentId) {
    el.innerHTML = '<div style="padding:20px;color:var(--color-text-secondary)"><strong>No agent selected</strong><br><br><button class="btn btn-sm" onclick="go(\'agents\')">Back to Agents</button></div>'
    return
  }

  el.innerHTML = `
    <div style="display:flex;align-items:flex-start;gap:12px;margin-bottom:20px">
      <button class="btn btn-sm" id="back-btn" style="padding:6px 12px;margin-top:2px;flex-shrink:0"><i class="ti ti-arrow-left"></i></button>
      <div style="flex:1;min-width:0">
        <div class="page-title" id="agent-name" style="margin:0">Loading...</div>
        <div class="page-subtitle" id="agent-desc" style="margin:4px 0 0 0">Agent Details</div>
      </div>
    </div>
    <div id="agent-content" style="min-height:200px;color:var(--color-text-secondary)">Loading agent data...</div>
  `

  const backBtn = el.querySelector('#back-btn')
  if (backBtn) {
    backBtn.addEventListener('click', () => {
      go('agents')
    })
  }

  try {
    console.log(`Fetching /api/agents/${agentId}`)
    const response = await fetch(`/api/agents/${agentId}`)
    const result = await response.json()
    console.log('Agent data received:', result)

    if (result.success && result.data) {
      renderAgentDetails(el, agentId, result.data)
    } else {
      throw new Error('Failed to load agent data')
    }
  } catch (error) {
    console.error('Error loading agent:', error)
    el.querySelector('#agent-content').innerHTML = `
      <div style="color:var(--color-text-secondary);text-align:center;padding:40px">
        <div style="font-size:14px;margin-bottom:16px">Failed to load agent details</div>
        <button class="btn btn-sm" onclick="go('agents')">Back to Agents</button>
      </div>
    `
  }
}

function renderAgentDetails(el, agentId, agentData) {
  const nameEl = el.querySelector('#agent-name')
  const descEl = el.querySelector('#agent-desc')
  const contentEl = el.querySelector('#agent-content')

  nameEl.textContent = agentData.name
  descEl.textContent = agentData.statusLabel

  let html = ``
  const statusColor = getStatusColor(agentData.status)

  // Summary section with status - full width
  html += `
    <div style="background:var(--color-background-primary);border:0.5px solid var(--color-border-secondary);border-radius:12px;padding:24px;margin-bottom:24px">
      <div style="display:flex;align-items:center;gap:16px;margin-bottom:20px">
        <div style="width:14px;height:14px;border-radius:50%;background:${statusColor.text}"></div>
        <div>
          <div style="font-size:13px;color:var(--color-text-secondary);text-transform:uppercase;font-weight:600;letter-spacing:0.5px">Status</div>
          <div style="font-size:16px;font-weight:700;color:var(--color-text-primary);margin-top:2px">${agentData.statusLabel}</div>
        </div>
      </div>
      <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:24px;padding-top:20px;border-top:0.5px solid var(--color-border-secondary)">
        <div>
          <div style="font-size:10px;color:var(--color-text-secondary);text-transform:uppercase;font-weight:600;letter-spacing:0.5px;margin-bottom:8px">Last Scan</div>
          <div style="font-size:13px;font-weight:700;color:var(--color-text-primary)">${new Date(agentData.lastRun).toLocaleDateString()} ${new Date(agentData.lastRun).toLocaleTimeString()}</div>
        </div>
        <div>
          <div style="font-size:10px;color:var(--color-text-secondary);text-transform:uppercase;font-weight:600;letter-spacing:0.5px;margin-bottom:8px">Monitoring Status</div>
          <div style="font-size:13px;font-weight:700;color:var(--color-text-primary)">${agentData.paused ? '⏸️ Paused' : '▶️ Active'}</div>
        </div>
        <div>
          <div style="font-size:10px;color:var(--color-text-secondary);text-transform:uppercase;font-weight:600;letter-spacing:0.5px;margin-bottom:8px">Execution Time</div>
          <div style="font-size:13px;font-weight:700;color:var(--color-text-primary)">Real-time</div>
        </div>
      </div>
    </div>
  `

  // KPI metrics - 5 columns single row
  html += `
    <div style="margin-bottom:24px">
      <div style="font-size:12px;font-weight:700;color:var(--color-text-primary);margin-bottom:14px;text-transform:uppercase;letter-spacing:0.5px">Overview</div>
      <div style="display:grid;grid-template-columns:repeat(5,1fr);gap:16px">
  `

  Object.entries(agentData.stats).forEach(([key, value]) => {
    const label = key
      .replace(/([A-Z])/g, ' $1')
      .replace(/^./, str => str.toUpperCase())
      .trim()
    html += `
      <div style="background:var(--color-background-primary);border:0.5px solid var(--color-border-secondary);border-radius:12px;padding:20px">
        <div style="font-size:10px;color:var(--color-text-secondary);text-transform:uppercase;font-weight:600;letter-spacing:0.5px;margin-bottom:12px">${label}</div>
        <div style="font-size:32px;font-weight:700;color:var(--color-text-primary)">${value}</div>
      </div>
    `
  })

  html += `</div></div>`

  // Agent-specific details
  if (agentId === 'security' && agentData.recentDetections) {
    html += `
      <div style="margin-bottom:24px">
        <div style="font-size:12px;font-weight:700;color:var(--color-text-primary);margin-bottom:14px;text-transform:uppercase;letter-spacing:0.5px">Recent Risk Detections</div>
        ${agentData.recentDetections && agentData.recentDetections.length > 0 ? `
          <div style="display:flex;flex-direction:column;gap:8px">
            ${agentData.recentDetections.map(detection => `
              <div style="background:var(--color-background-primary);border:0.5px solid var(--color-border-secondary);border-left:3px solid ${getSeverityColor(detection.riskLevel)};border-radius:8px;padding:16px">
                <div style="display:flex;justify-content:space-between;align-items:flex-start;gap:12px">
                  <div style="flex:1;min-width:0">
                    <div style="font-weight:600;font-size:13px;color:var(--color-text-primary)">${detection.userDisplayName}</div>
                    <div style="font-size:11px;color:var(--color-text-secondary);margin-top:6px">${detection.riskType}</div>
                    <div style="font-size:10px;color:var(--color-text-tertiary);margin-top:8px">${new Date(detection.detectedDateTime).toLocaleString()}</div>
                  </div>
                  <span style="padding:4px 10px;border-radius:4px;font-size:10px;font-weight:700;background:${getSeverityBg(detection.riskLevel)};color:${getSeverityColor(detection.riskLevel)};white-space:nowrap">
                    ${detection.riskLevel.toUpperCase()}
                  </span>
                </div>
              </div>
            `).join('')}
          </div>
        ` : `
          <div style="background:var(--color-background-primary);border:0.5px solid var(--color-border-secondary);border-radius:8px;padding:32px;text-align:center">
            <div style="font-size:24px;margin-bottom:12px">✅</div>
            <div style="font-size:14px;font-weight:600;color:var(--color-text-primary);margin-bottom:4px">No risks detected</div>
            <div style="font-size:11px;color:var(--color-text-secondary)">Your environment is secure. The agent is continuously monitoring for potential threats.</div>
          </div>
        `}
      </div>
    `
  }

  if (agentId === 'config' && agentData.criticalFailures) {
    html += `
      <div style="margin-bottom:24px">
        <div style="font-size:12px;font-weight:700;color:var(--color-text-primary);margin-bottom:14px;text-transform:uppercase;letter-spacing:0.5px">Critical Control Failures (${agentData.criticalFailures.length})</div>
        ${agentData.criticalFailures && agentData.criticalFailures.length > 0 ? `
          <div style="display:flex;flex-direction:column;gap:8px">
            ${agentData.criticalFailures.map(failure => `
              <div style="background:var(--color-background-primary);border:0.5px solid var(--color-border-secondary);border-left:3px solid ${failure.severity === 'CRITICAL' ? 'var(--clr-danger-text)' : 'var(--clr-warning-text)'};border-radius:8px;padding:16px">
                <div style="display:flex;justify-content:space-between;align-items:flex-start;gap:12px">
                  <div style="flex:1">
                    <div style="font-weight:600;font-size:13px;color:var(--color-text-primary)">${failure.controlId}: ${failure.title}</div>
                    <div style="font-size:11px;color:var(--color-text-secondary);margin-top:6px">${failure.reason}</div>
                  </div>
                  <span style="padding:4px 10px;border-radius:4px;font-size:10px;font-weight:700;background:${failure.severity === 'CRITICAL' ? 'var(--clr-danger-bg)' : 'var(--clr-warning-bg)'};color:${failure.severity === 'CRITICAL' ? 'var(--clr-danger-text)' : 'var(--clr-warning-text)'};white-space:nowrap">
                    ${failure.severity}
                  </span>
                </div>
              </div>
            `).join('')}
          </div>
        ` : `
          <div style="background:var(--color-background-primary);border:0.5px solid var(--color-border-secondary);border-radius:8px;padding:32px;text-align:center">
            <div style="font-size:24px;margin-bottom:12px">✅</div>
            <div style="font-size:14px;font-weight:600;color:var(--color-text-primary);margin-bottom:4px">All controls compliant</div>
            <div style="font-size:11px;color:var(--color-text-secondary)">Your M365 configuration meets all CIS benchmark requirements.</div>
          </div>
        `}
      </div>
    `
  }

  if (agentId === 'approval' && agentData.pendingRequests) {
    html += `
      <div style="margin-bottom:24px">
        <div style="font-size:12px;font-weight:700;color:var(--color-text-primary);margin-bottom:14px;text-transform:uppercase;letter-spacing:0.5px">Pending Requests (${agentData.pendingRequests.length})</div>
        ${agentData.pendingRequests && agentData.pendingRequests.length > 0 ? `
          <div style="display:flex;flex-direction:column;gap:8px">
            ${agentData.pendingRequests.map(req => `
              <div style="background:var(--color-background-primary);border:0.5px solid var(--color-border-secondary);border-left:3px solid var(--clr-warning-text);border-radius:8px;padding:16px">
                <div style="display:flex;justify-content:space-between;align-items:flex-start;gap:12px">
                  <div style="flex:1">
                    <div style="font-weight:600;font-size:13px;color:var(--color-text-primary)">${req.user}</div>
                    <div style="font-size:11px;color:var(--color-text-secondary);margin-top:6px">${req.action}</div>
                    <div style="font-size:10px;color:var(--color-text-tertiary);margin-top:8px">${new Date(req.requestedAt).toLocaleString()}</div>
                  </div>
                  <span style="padding:4px 10px;border-radius:4px;font-size:10px;font-weight:700;background:var(--clr-warning-bg);color:var(--clr-warning-text);white-space:nowrap">PENDING</span>
                </div>
              </div>
            `).join('')}
          </div>
        ` : `
          <div style="background:var(--color-background-primary);border:0.5px solid var(--color-border-secondary);border-radius:8px;padding:32px;text-align:center">
            <div style="font-size:24px;margin-bottom:12px">✅</div>
            <div style="font-size:14px;font-weight:600;color:var(--color-text-primary);margin-bottom:4px">No pending requests</div>
            <div style="font-size:11px;color:var(--color-text-secondary)">All access requests have been processed.</div>
          </div>
        `}
      </div>
    `
  }

  if (agentId === 'execution' && agentData.recentActions) {
    html += `
      <div style="margin-bottom:24px">
        <div style="font-size:12px;font-weight:700;color:var(--color-text-primary);margin-bottom:14px;text-transform:uppercase;letter-spacing:0.5px">Recent Actions (${agentData.recentActions.length})</div>
        ${agentData.recentActions && agentData.recentActions.length > 0 ? `
          <div style="display:flex;flex-direction:column;gap:8px">
            ${agentData.recentActions.map(action => `
              <div style="background:var(--color-background-primary);border:0.5px solid var(--color-border-secondary);border-left:3px solid ${action.status === 'SUCCESS' ? 'var(--clr-success-text)' : 'var(--clr-danger-text)'};border-radius:8px;padding:16px">
                <div style="display:flex;justify-content:space-between;align-items:flex-start;gap:12px">
                  <div style="flex:1">
                    <div style="font-weight:600;font-size:13px;color:var(--color-text-primary)">${action.action}</div>
                    <div style="font-size:10px;color:var(--color-text-tertiary);margin-top:8px">${new Date(action.completedAt).toLocaleString()}</div>
                  </div>
                  <span style="padding:4px 10px;border-radius:4px;font-size:10px;font-weight:700;background:${action.status === 'SUCCESS' ? 'var(--clr-success-bg)' : 'var(--clr-danger-bg)'};color:${action.status === 'SUCCESS' ? 'var(--clr-success-text)' : 'var(--clr-danger-text)'};white-space:nowrap">${action.status}</span>
                </div>
              </div>
            `).join('')}
          </div>
        ` : `
          <div style="background:var(--color-background-primary);border:0.5px solid var(--color-border-secondary);border-radius:8px;padding:32px;text-align:center">
            <div style="font-size:24px;margin-bottom:12px">✅</div>
            <div style="font-size:14px;font-weight:600;color:var(--color-text-primary);margin-bottom:4px">No recent actions</div>
            <div style="font-size:11px;color:var(--color-text-secondary)">All requested actions have been completed.</div>
          </div>
        `}
      </div>
    `
  }

  if (agentId === 'audit' && agentData.recentAnomalies) {
    html += `
      <div style="margin-bottom:24px">
        <div style="font-size:12px;font-weight:700;color:var(--color-text-primary);margin-bottom:14px;text-transform:uppercase;letter-spacing:0.5px">Recent Anomalies (${agentData.recentAnomalies.length})</div>
        ${agentData.recentAnomalies && agentData.recentAnomalies.length > 0 ? `
          <div style="display:flex;flex-direction:column;gap:8px">
            ${agentData.recentAnomalies.map(anomaly => `
              <div style="background:var(--color-background-primary);border:0.5px solid var(--color-border-secondary);border-left:3px solid ${anomaly.severity === 'HIGH' ? 'var(--clr-danger-text)' : 'var(--clr-warning-text)'};border-radius:8px;padding:16px">
                <div style="display:flex;justify-content:space-between;align-items:flex-start;gap:12px">
                  <div style="flex:1">
                    <div style="font-weight:600;font-size:13px;color:var(--color-text-primary)">${anomaly.type}</div>
                    <div style="font-size:11px;color:var(--color-text-secondary);margin-top:6px">${anomaly.count} occurrence${anomaly.count !== 1 ? 's' : ''}</div>
                    <div style="font-size:10px;color:var(--color-text-tertiary);margin-top:8px">${new Date(anomaly.detectedAt).toLocaleString()}</div>
                  </div>
                  <span style="padding:4px 10px;border-radius:4px;font-size:10px;font-weight:700;background:${anomaly.severity === 'HIGH' ? 'var(--clr-danger-bg)' : 'var(--clr-warning-bg)'};color:${anomaly.severity === 'HIGH' ? 'var(--clr-danger-text)' : 'var(--clr-warning-text)'};white-space:nowrap">${anomaly.severity}</span>
                </div>
              </div>
            `).join('')}
          </div>
        ` : `
          <div style="background:var(--color-background-primary);border:0.5px solid var(--color-border-secondary);border-radius:8px;padding:32px;text-align:center">
            <div style="font-size:24px;margin-bottom:12px">✅</div>
            <div style="font-size:14px;font-weight:600;color:var(--color-text-primary);margin-bottom:4px">No anomalies detected</div>
            <div style="font-size:11px;color:var(--color-text-secondary)">Your audit logs show normal activity patterns.</div>
          </div>
        `}
      </div>
    `
  }

  if (agentId === 'compliance' && agentData.violations) {
    html += `
      <div style="margin-bottom:24px">
        <div style="font-size:12px;font-weight:700;color:var(--color-text-primary);margin-bottom:14px;text-transform:uppercase;letter-spacing:0.5px">Compliance Status (${agentData.violations.length})</div>
        <div style="display:flex;flex-direction:column;gap:8px">
          ${agentData.violations.map(violation => {
            const isCompliant = violation.status === 'COMPLIANT'
            return `
              <div style="background:var(--color-background-primary);border:0.5px solid var(--color-border-secondary);border-left:3px solid ${isCompliant ? 'var(--clr-success-text)' : 'var(--clr-warning-text)'};border-radius:8px;padding:16px">
                <div style="display:flex;justify-content:space-between;align-items:flex-start;gap:12px">
                  <div style="flex:1">
                    <div style="font-weight:600;font-size:13px;color:var(--color-text-primary)">${violation.policy}</div>
                    <div style="font-size:11px;color:var(--color-text-secondary);margin-top:6px">Compliance Score: <strong>${violation.score}%</strong></div>
                  </div>
                  <span style="padding:4px 10px;border-radius:4px;font-size:10px;font-weight:700;background:${isCompliant ? 'var(--clr-success-bg)' : 'var(--clr-warning-bg)'};color:${isCompliant ? 'var(--clr-success-text)' : 'var(--clr-warning-text)'};white-space:nowrap">${violation.status}</span>
                </div>
              </div>
            `
          }).join('')}
        </div>
      </div>
    `
  }

  contentEl.innerHTML = html

  // Add Chat with AI section
  addAIChatSection(el, agentId, agentData)
}

function addAIChatSection(el, agentId, agentData) {
  const chatSection = document.createElement('div')
  chatSection.style.cssText = 'margin-top:32px;padding-top:24px;border-top:0.5px solid var(--color-border-secondary)'

  // Get suggested questions based on agent type
  const suggestedQuestions = getSuggestedQuestions(agentId)

  chatSection.innerHTML = `
    <div style="margin-bottom:16px">
      <div style="font-size:12px;font-weight:700;color:var(--color-text-primary);text-transform:uppercase;letter-spacing:0.5px;margin-bottom:14px">Chat with AI</div>
      <div style="background:var(--color-background-primary);border:0.5px solid var(--color-border-secondary);border-radius:12px;padding:16px;margin-bottom:12px;min-height:300px;max-height:400px;overflow-y:auto" id="ai-chat-messages">
        <div style="font-size:12px;color:var(--color-text-primary);margin-bottom:12px;font-weight:600">
          How can I help?
        </div>
        <div style="display:flex;flex-direction:column;gap:8px" id="suggested-questions">
          ${suggestedQuestions.map((q, idx) => `
            <button class="ai-suggest-btn" data-question="${q}" style="padding:10px 12px;text-align:left;border:0.5px solid var(--color-border-secondary);border-radius:8px;background:var(--color-background-secondary);color:var(--color-text-primary);font-size:11px;cursor:pointer;transition:all 0.2s;font-weight:500" onmouseover="this.style.background='var(--clr-info-bg)';this.style.borderColor='var(--clr-info-text)';this.style.color='var(--clr-info-text)'" onmouseout="this.style.background='var(--color-background-secondary)';this.style.borderColor='var(--color-border-secondary)';this.style.color='var(--color-text-primary)'">
              💡 ${q}
            </button>
          `).join('')}
        </div>
      </div>
      <div style="display:flex;gap:8px">
        <input type="text" id="ai-chat-input" placeholder="Or type your own question..." style="flex:1;padding:10px 12px;border:0.5px solid var(--color-border-secondary);border-radius:8px;font-size:12px;background:var(--color-background-primary);color:var(--color-text-primary)" />
        <button class="btn btn-sm" id="ai-chat-send" style="padding:10px 16px">Send</button>
      </div>
    </div>
  `

  const contentEl = el.querySelector('#agent-content')
  contentEl.parentNode.insertBefore(chatSection, contentEl.nextSibling)

  // Chat event listeners
  const input = chatSection.querySelector('#ai-chat-input')
  const sendBtn = chatSection.querySelector('#ai-chat-send')
  const messagesDiv = chatSection.querySelector('#ai-chat-messages')

  sendBtn.addEventListener('click', () => sendAIMessage(input, messagesDiv, agentId, agentData))
  input.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') sendAIMessage(input, messagesDiv, agentId, agentData)
  })

  // Suggested questions
  chatSection.querySelectorAll('.ai-suggest-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const question = btn.dataset.question
      input.value = question
      // Immediately send the question
      setTimeout(() => sendAIMessage(input, messagesDiv, agentId, agentData), 100)
    })
  })
}

function getSuggestedQuestions(agentId) {
  const questions = {
    security: [
      'What are the top security risks in my environment?',
      'Should I be concerned about the current risk level?',
      'What remediation steps do you recommend?',
      'How often should I review security risks?'
    ],
    config: [
      'Which CIS controls are failing and why?',
      'What are the critical compliance gaps?',
      'What should I prioritize fixing first?',
      'How can I improve my compliance score?'
    ],
    approval: [
      'How many requests need approval?',
      'What is the typical approval time?',
      'Are there any SLA violations?',
      'Which requests are most urgent?'
    ],
    execution: [
      'How many actions have been executed?',
      'Are there any failed executions?',
      'What is the success rate?',
      'Are there pending actions?'
    ],
    audit: [
      'What anomalies have been detected?',
      'Are there any suspicious patterns?',
      'What should I investigate further?',
      'How can I improve audit monitoring?'
    ],
    compliance: [
      'What is our compliance status?',
      'Which policies have violations?',
      'What should we improve?',
      'Are we meeting all requirements?'
    ]
  }

  return questions[agentId] || [
    'What insights can you provide about this data?',
    'What should I focus on?',
    'Are there any concerns?',
    'What are the recommendations?'
  ]
}

async function sendAIMessage(inputEl, messagesDiv, agentId, agentData) {
  const message = inputEl.value.trim()
  if (!message) return

  // Clear input
  inputEl.value = ''

  // Add user message to chat
  const userMsgDiv = document.createElement('div')
  userMsgDiv.style.cssText = 'margin-bottom:12px;text-align:right'
  userMsgDiv.innerHTML = `
    <div style="display:inline-block;background:var(--clr-info-bg);color:var(--clr-info-text);padding:10px 14px;border-radius:8px;max-width:80%;font-size:12px;word-wrap:break-word">
      ${message}
    </div>
  `
  messagesDiv.appendChild(userMsgDiv)

  // Show loading indicator
  const loadingDiv = document.createElement('div')
  loadingDiv.style.cssText = 'margin-bottom:12px;text-align:left'
  loadingDiv.innerHTML = `
    <div style="display:inline-block;background:var(--color-background-secondary);color:var(--color-text-secondary);padding:10px 14px;border-radius:8px;font-size:12px">
      ⏳ AI is thinking...
    </div>
  `
  messagesDiv.appendChild(loadingDiv)
  messagesDiv.scrollTop = messagesDiv.scrollHeight

  try {
    // Call backend API
    const response = await fetch('/api/agents/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        agentId,
        agentData,
        userMessage: message
      })
    })

    const result = await response.json()

    // Remove loading indicator
    messagesDiv.removeChild(loadingDiv)

    // Add AI response
    const aiMsgDiv = document.createElement('div')
    aiMsgDiv.style.cssText = 'margin-bottom:12px;text-align:left'
    aiMsgDiv.innerHTML = `
      <div style="display:inline-block;background:var(--color-background-secondary);color:var(--color-text-primary);padding:10px 14px;border-radius:8px;max-width:80%;font-size:12px;word-wrap:break-word;line-height:1.5">
        ${result.response || 'Unable to get response from AI'}
      </div>
    `
    messagesDiv.appendChild(aiMsgDiv)
    messagesDiv.scrollTop = messagesDiv.scrollHeight
  } catch (error) {
    console.error('Chat error:', error)
    messagesDiv.removeChild(loadingDiv)
    const errorDiv = document.createElement('div')
    errorDiv.style.cssText = 'margin-bottom:12px;text-align:left'
    errorDiv.innerHTML = `
      <div style="display:inline-block;background:var(--clr-danger-bg);color:var(--clr-danger-text);padding:10px 14px;border-radius:8px;max-width:80%;font-size:12px">
        Error: Unable to reach AI. Please try again.
      </div>
    `
    messagesDiv.appendChild(errorDiv)
  }
}

function getStatusColor(status) {
  const colors = {
    active: { bg: 'var(--clr-success-bg)', text: 'var(--clr-success-text)' },
    alert: { bg: 'var(--clr-warning-bg)', text: 'var(--clr-warning-text)' },
    error: { bg: 'var(--clr-danger-bg)', text: 'var(--clr-danger-text)' },
    idle: { bg: 'var(--color-background-secondary)', text: 'var(--color-text-tertiary)' }
  }
  return colors[status] || colors.idle
}

function getSeverityColor(level) {
  const colors = {
    high: 'var(--clr-danger-text)',
    medium: 'var(--clr-warning-text)',
    low: 'var(--clr-info-text)'
  }
  return colors[level] || colors.low
}

function getSeverityBg(level) {
  const colors = {
    high: 'var(--clr-danger-bg)',
    medium: 'var(--clr-warning-bg)',
    low: 'var(--clr-info-bg)'
  }
  return colors[level] || colors.low
}
