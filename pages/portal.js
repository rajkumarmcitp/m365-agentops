import { state } from '../app.js'
import { showToast } from '../components/toast.js'
import { api } from '../lib/api-client.js'
import { skeletonLoader } from '../lib/skeleton-loader.js'
import {
  SERVICE_GROUPS, EXCHANGE_SUB, SERVICE_CATALOG, WORKFLOW_STEPS
} from '../data/portal-services.js'
import { REQUEST_TEMPLATES, getTemplate } from '../data/request-templates.js'

// ============================================================
// View state
// ============================================================
let portalView = 'landing'      // 'landing' | 'service' | 'form' | 'submitted' | 'templates'
let activeGroupId = null
let activeSubId = null          // for Exchange sub-services
let activeOpId = null
let activeTemplateId = null     // Selected template
let formValues = {}
let reqCounter = 100
let submittedRequestId = null   // Store request ID after submission

// ============================================================
// Entry
// ============================================================
export function initPortal() {
  const el = document.getElementById('page-portal')
  if (!el) return
  portalView = 'landing'
  activeGroupId = null
  activeSubId = null
  activeOpId = null
  activeTemplateId = null
  formValues = {}
  submittedRequestId = null
  render(el)
}

function render(el) {
  if (portalView === 'landing')   renderLanding(el)
  else if (portalView === 'templates') renderTemplatesView(el)
  else if (portalView === 'service') renderServiceView(el)
  else if (portalView === 'form')  renderFormView(el)
  else if (portalView === 'submitted') renderSubmitted(el)
}

// ============================================================
// Helpers
// ============================================================
function svcEnabled(svcKey) {
  const s = state.settings
  if (!s.portalEnabled) return false
  return s[svcKey] !== false
}

function groupSettingKey(groupId) {
  return 'portal_' + groupId.replace(/-/g, '_')
}

function getCatalog(serviceId) {
  return SERVICE_CATALOG[serviceId] || null
}

function getGroup(groupId) {
  return SERVICE_GROUPS.find(g => g.id === groupId)
}

function getOperation(serviceId, opId) {
  const cat = getCatalog(serviceId)
  if (!cat) return null
  return cat.operations.find(o => o.id === opId)
}

function isExchange(groupId) { return groupId === 'exchange' }

// For exchange, default sub is first enabled sub
function defaultExchangeSub() {
  const subKeys = { 'exchange-groups': 'portal_exchange_groups', 'shared-mailbox': 'portal_shared_mailbox', 'room-equipment': 'portal_room_equipment', 'email-services': 'portal_email_services' }
  for (const sub of EXCHANGE_SUB) {
    if (svcEnabled(subKeys[sub.id])) return sub.id
  }
  return EXCHANGE_SUB[0].id
}

// Which service ID to use for operations lookup
function resolveServiceId() {
  if (isExchange(activeGroupId)) return activeSubId
  return activeGroupId
}

// Build the actual approval steps for an operation
function buildWorkflow(op) {
  if (!op) return []
  const required = ['submit', ...op.approvalPath, 'agent', 'action', 'done']
  return WORKFLOW_STEPS.filter(s => required.includes(s.id))
}

// ============================================================
// TEMPLATES VIEW — Template gallery
// ============================================================
function renderTemplatesView(el) {
  const u = state.currentUser

  el.innerHTML = `
    <div class="page-header">
      <div style="display:flex;align-items:center;gap:10px">
        <button class="btn" id="tmpl-back"><i class="ti ti-arrow-left"></i> Back</button>
        <div>
          <div class="page-title"><i class="ti ti-sparkles"></i> Request Templates</div>
          <div class="page-subtitle">Start with a pre-filled template to speed up your request</div>
        </div>
      </div>
    </div>

    <div id="templates-gallery"></div>
  `

  el.querySelector('#tmpl-back').addEventListener('click', () => {
    portalView = 'landing'
    activeTemplateId = null
    render(el)
  })

  const gallery = el.querySelector('#templates-gallery')

  // Group templates by category
  const byCategory = {}
  REQUEST_TEMPLATES.forEach(t => {
    if (!byCategory[t.category]) byCategory[t.category] = []
    byCategory[t.category].push(t)
  })

  // Render each category
  Object.entries(byCategory).forEach(([category, templates]) => {
    const section = document.createElement('div')
    section.style.marginBottom = '32px'

    const header = document.createElement('div')
    header.style.cssText = 'font-size:13px;font-weight:700;color:var(--color-text-primary);margin-bottom:12px;display:flex;align-items:center;gap:8px'
    header.innerHTML = `<i class="ti ti-folder"></i> ${category} (${templates.length})`
    section.appendChild(header)

    const grid = document.createElement('div')
    grid.style.display = 'grid'
    grid.style.gridTemplateColumns = 'repeat(auto-fill, minmax(200px, 1fr))'
    grid.style.gap = '12px'

    templates.forEach(template => {
      const card = document.createElement('div')
      card.style.cssText = `
        padding:16px;
        background:var(--color-background-secondary);
        border:1px solid var(--color-border-secondary);
        border-radius:8px;
        cursor:pointer;
        transition:all 200ms;
      `
      card.innerHTML = `
        <div style="font-size:32px;margin-bottom:8px;text-align:center">${template.thumbnail}</div>
        <div style="font-size:12px;font-weight:600;color:var(--color-text-primary);margin-bottom:4px">${template.name}</div>
        <div style="font-size:10px;color:var(--color-text-secondary);margin-bottom:8px;line-height:1.4">${template.description}</div>
        <div style="display:flex;gap:6px;margin-bottom:8px;flex-wrap:wrap">
          <span style="font-size:9px;padding:2px 6px;background:var(--clr-info-bg);color:var(--clr-info-text);border-radius:3px">
            ⏱ ${template.estimatedTime}
          </span>
          <span style="font-size:9px;padding:2px 6px;background:var(--color-background-primary);color:var(--color-text-secondary);border-radius:3px">
            📊 ${template.popularity}
          </span>
        </div>
        <button style="width:100%;padding:8px;background:var(--clr-info-bg);color:var(--clr-info-text);border:none;border-radius:4px;cursor:pointer;font-size:10px;font-weight:600">
          Use Template
        </button>
      `

      card.addEventListener('mouseover', () => {
        card.style.borderColor = 'var(--clr-info-text)'
        card.style.background = 'var(--color-background-primary)'
      })

      card.addEventListener('mouseout', () => {
        card.style.borderColor = 'var(--color-border-secondary)'
        card.style.background = 'var(--color-background-secondary)'
      })

      card.addEventListener('click', () => {
        activeTemplateId = template.id
        activeGroupId = template.serviceId.includes('-') ? template.serviceId.split('-')[0] : template.serviceId
        if (isExchange(activeGroupId)) activeSubId = template.serviceId
        activeOpId = template.operationId
        formValues = { ...template.formDefaults }
        portalView = 'form'
        render(el)
      })

      grid.appendChild(card)
    })

    section.appendChild(grid)
    gallery.appendChild(section)
  })
}

// ============================================================
// LANDING VIEW — 11 service tiles
// ============================================================
function renderLanding(el) {
  const u = state.currentUser
  if (!state.settings.portalEnabled) {
    el.innerHTML = `
      <div class="page-header"><div class="page-title"><i class="ti ti-grid-dots"></i> Self-Service Portal</div></div>
      <div class="locked-banner">
        <i class="ti ti-plug-x"></i>
        <h3>Portal Temporarily Disabled</h3>
        <p>The self-service portal has been disabled by your administrator. Please contact IT for assistance.</p>
      </div>`
    return
  }

  const roleDesc = { user: 'Standard user', manager: 'Manager', admin: 'Administrator', super: 'Super Admin' }
  const available = SERVICE_GROUPS.filter(g => svcEnabled(groupSettingKey(g.id)))

  el.innerHTML = `
    <div class="page-header">
      <div>
        <div class="page-title"><i class="ti ti-sparkles"></i> Self-Service Portal</div>
        <div class="page-subtitle">Request Microsoft 365 resources with instant validation, approval tracking, and automated provisioning</div>
      </div>
    </div>

    <div class="portal-info-banner">
      <i class="ti ti-user-circle"></i>
      <span>Signed in as <strong>${u?.name}</strong> (${roleDesc[u?.role] || u?.role}). All requests are logged and validated by our AI Agent before provisioning.</span>
    </div>

    <div style="margin-bottom:20px">
      <div class="section-label">
        <i class="ti ti-workflow"></i>
        Request Approval & Provisioning Workflow
      </div>
      <div style="font-size:12px;color:var(--color-text-secondary);margin-top:6px;font-weight:500">
        Every request follows this 7-step process from submission to completion
      </div>
    </div>

    <div class="portal-workflow-banner">
      ${WORKFLOW_STEPS.map((s, i) => `
        <div class="pwf-step">
          <div class="pwf-circle pwf-${s.color}"><i class="ti ${s.icon}"></i></div>
          <div class="pwf-label">${s.label}</div>
        </div>
        ${i < WORKFLOW_STEPS.length - 1 ? '<div class="pwf-arrow"><i class="ti ti-arrow-right"></i></div>' : ''}
      `).join('')}
    </div>

    <div style="margin-bottom:16px">
      <div class="section-label">
        <i class="ti ti-layout-grid"></i>
        ${available.length} Services Available
      </div>
    </div>

    <div class="portal-service-grid" id="portal-service-grid"></div>
  `

  const grid = el.querySelector('#portal-service-grid')
  SERVICE_GROUPS.forEach(group => {
    const enabled = svcEnabled(groupSettingKey(group.id))
    const opsCount = isExchange(group.id)
      ? EXCHANGE_SUB.reduce((n, sub) => n + (getCatalog(sub.id)?.operations?.length || 0), 0)
      : (getCatalog(group.id)?.operations?.length || 0)

    const card = document.createElement('div')
    card.className = `portal-svc-card ${!enabled ? 'disabled' : ''}`
    card.innerHTML = `
      <div class="psc-header">
        <div class="psc-icon" style="background:${group.bg};color:${group.color}"><i class="ti ${group.icon}"></i></div>
        <div class="psc-name">${group.name}</div>
      </div>
      <div class="psc-desc">${group.desc}</div>
      <div class="psc-footer">
        <span class="badge ${enabled ? 'info' : 'neutral'}">${enabled ? opsCount + ' actions' : 'Disabled'}</span>
        <button class="btn btn-xs btn-primary psc-open-btn" data-gid="${group.id}" ${!enabled ? 'disabled' : ''}>
          <i class="ti ti-arrow-right"></i> Open
        </button>
      </div>
    `
    if (!enabled) card.title = 'This service has been disabled by your administrator.'
    grid.appendChild(card)
  })

  el.querySelectorAll('.psc-open-btn:not([disabled])').forEach(btn => {
    btn.addEventListener('click', () => {
      activeGroupId = btn.dataset.gid
      if (isExchange(activeGroupId)) activeSubId = defaultExchangeSub()
      activeOpId = null
      activeTemplateId = null
      formValues = {}
      portalView = 'service'
      render(el)
    })
  })

}

// ============================================================
// SERVICE VIEW — operation selector
// ============================================================
function renderServiceView(el) {
  const group = getGroup(activeGroupId)
  if (!group) { portalView = 'landing'; render(el); return }

  const serviceId = resolveServiceId()
  const catalog = getCatalog(serviceId)

  el.innerHTML = `
    <div class="page-header">
      <div style="display:flex;align-items:center;gap:10px">
        <button class="btn" id="svc-back"><i class="ti ti-arrow-left"></i> Back</button>
        <div class="psc-icon sm" style="background:${group.bg};color:${group.color}"><i class="ti ${group.icon}"></i></div>
        <div>
          <div class="page-title">${group.name}</div>
          <div class="page-subtitle">${group.desc}</div>
        </div>
      </div>
    </div>

    ${isExchange(activeGroupId) ? renderExchangeSubTabs() : ''}

    <div id="svc-ops-area"></div>
  `

  el.querySelector('#svc-back').addEventListener('click', () => { portalView = 'landing'; render(el) })

  if (isExchange(activeGroupId)) {
    el.querySelectorAll('.ex-sub-tab').forEach(tab => {
      tab.addEventListener('click', () => {
        activeSubId = tab.dataset.sub
        activeOpId = null
        renderOperations(el, getCatalog(activeSubId))
        el.querySelectorAll('.ex-sub-tab').forEach(t => t.classList.toggle('active', t.dataset.sub === activeSubId))
      })
    })
  }

  renderOperations(el, catalog)
}

function renderExchangeSubTabs() {
  const subKeys = { 'exchange-groups': 'portal_exchange_groups', 'shared-mailbox': 'portal_shared_mailbox', 'room-equipment': 'portal_room_equipment', 'email-services': 'portal_email_services' }
  return `
    <div class="tabs mb-3" style="margin-bottom:16px">
      ${EXCHANGE_SUB.map(sub => {
        const enabled = svcEnabled(subKeys[sub.id])
        return `<button class="tab-btn ex-sub-tab ${sub.id === activeSubId ? 'active' : ''} ${!enabled ? 'disabled-tab' : ''}"
          data-sub="${sub.id}" ${!enabled ? 'disabled' : ''} title="${sub.desc}">
          <i class="ti ${sub.icon}" style="margin-right:4px"></i>${sub.name}
          ${!enabled ? '<span class="badge neutral" style="margin-left:4px;font-size:8px">Off</span>' : ''}
        </button>`
      }).join('')}
    </div>
  `
}

function renderOperations(el, catalog) {
  const area = el.querySelector('#svc-ops-area')
  if (!area) return
  if (!catalog) { area.innerHTML = '<div class="empty-state">No operations available for this service.</div>'; return }

  // Group operations
  const grouped = {}
  catalog.operations.forEach(op => {
    if (!grouped[op.group]) grouped[op.group] = []
    grouped[op.group].push(op)
  })

  // Determine if we have an active operation group selected
  const activeGroupName = window.activeGroupName
  const activeGroupOps = window.activeGroupOps || []
  const hasActiveGroup = activeGroupName && activeGroupOps.length > 0

  area.innerHTML = `
    <div class="portal-operations-layout">
      <!-- Left Sidebar: Operation Groups -->
      <div class="portal-ops-sidebar">
        <div class="portal-ops-header">
          <div style="font-size:13px;font-weight:700;color:var(--color-text-primary);display:flex;align-items:center;gap:8px">
            <i class="ti ti-list-check"></i> Operation Groups
          </div>
        </div>
        <div class="portal-ops-list">
          ${Object.entries(grouped).map(([grpName, ops]) => `
            <div class="portal-op-group-item ${activeGroupName === grpName ? 'active' : ''}" data-group="${grpName}">
              <div class="op-item-title">${grpName}</div>
              <div class="op-item-count">${ops.length} action${ops.length !== 1 ? 's' : ''}</div>
            </div>
          `).join('')}
        </div>
      </div>

      <!-- Right Content: Form -->
      <div class="portal-ops-content">
        ${hasActiveGroup ? renderOperationForm(catalog, activeGroupName, activeGroupOps) : '<div class="portal-empty-content"><div style="text-align:center;padding:48px 24px"><i class="ti ti-click" style="font-size:48px;color:var(--color-text-secondary);margin-bottom:16px;display:block"></i><p style="color:var(--color-text-secondary);font-size:14px">Select an operation group from the left to begin</p></div></div>'}
      </div>
    </div>
  `

  // Group item click handler
  area.querySelectorAll('.portal-op-group-item').forEach(item => {
    item.addEventListener('click', () => {
      const grpName = item.dataset.group
      const opsData = grouped[grpName] || []

      if (opsData.length > 0) {
        activeOpId = opsData[0].id
        window.activeGroupName = grpName
        window.activeGroupOps = opsData
        renderOperations(el, catalog)

        // Wire up event listeners for the new form
        wireFormEvents(el, catalog)
      }
    })
  })

  // Wire form events if there's an active group
  if (hasActiveGroup) {
    wireFormEvents(el, catalog)
  }
}

function wireFormEvents(el, catalog) {
  // Action selector change handler
  const actionSelector = el.querySelector('#action-selector')
  if (actionSelector) {
    actionSelector.addEventListener('change', (e) => {
      activeOpId = e.target.value
      formValues = {}
      const area = el.querySelector('#svc-ops-area')
      renderOperations(area ? area.parentElement : el, catalog)
    })
  }

  // Form submission
  const form = el.querySelector('#operation-form')
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault()
      const serviceId = resolveServiceId()
      const op = getOperation(serviceId, activeOpId)
      if (op) {
        handleSubmit(el, op)
      }
    })
  }

  // Wire conditional field visibility
  const serviceId = resolveServiceId()
  const op = getOperation(serviceId, activeOpId)
  if (op) {
    wireFieldDependencies(el, op)
    setupUserSearch(el)
  }
}

function renderFormPreview(area, catalog, opId) {
  const preview = area.querySelector('#svc-form-preview')
  if (!preview) return
  const op = catalog?.operations?.find(o => o.id === opId)
  if (!op) return

  const wfSteps = buildWorkflow(op)

  preview.innerHTML = `
    <div class="form-preview-card">
      <div class="form-preview-header">
        <div class="form-preview-title"><i class="ti ti-sparkles"></i> ${op.label}</div>
        <button class="btn-submit" id="svc-start-form"><i class="ti ti-arrow-right"></i> Start Request</button>
      </div>

      <div class="form-preview-grid">
        <div>
          <div class="form-section-heading">Approval & Provisioning Workflow</div>
          <div class="workflow-timeline-h">
            ${wfSteps.map((s, i) => `
              <div class="wfh-step">
                <div class="wfh-circle wfh-${s.color}"><i class="ti ${s.icon}"></i></div>
                <div class="wfh-label">${s.label}</div>
              </div>
              ${i < wfSteps.length - 1 ? '<div class="wfh-arrow"></div>' : ''}
            `).join('')}
          </div>
        </div>
        <div>
          <div class="form-section-heading">AI Agent Validation Checks</div>
          <div class="agent-checks-list">
            ${op.agentChecks.map(c => `
              <div class="agent-check-item">
                <i class="ti ti-robot agent-check-icon"></i>
                <span>${c}</span>
              </div>
            `).join('')}
          </div>
        </div>
      </div>
    </div>
  `

  preview.querySelector('#svc-start-form').addEventListener('click', () => {
    portalView = 'form'
    formValues = {}
    const pageEl = document.getElementById('page-portal')
    render(pageEl)
  })
}

function renderGroupForm(area, catalog, grpName, opsData) {
  const preview = area.querySelector('#svc-form-preview')
  if (!preview) return

  const firstOp = catalog.operations.find(o => o.id === opsData[0].id)
  if (!firstOp) return

  preview.innerHTML = `
    <div class="form-preview-card">
      <div class="form-preview-header">
        <div class="form-preview-title"><i class="ti ti-sparkles"></i> ${grpName}</div>
        <button class="btn-submit" id="svc-start-form"><i class="ti ti-arrow-right"></i> Start Request</button>
      </div>

      <div style="margin-bottom:24px;padding-bottom:20px;border-bottom:1px solid var(--color-border-secondary)">
        <label style="font-size:13px;font-weight:700;color:var(--color-text-primary);display:block;margin-bottom:8px">
          Select Action
        </label>
        <select id="group-action-selector" style="width:100%;padding:10px 12px;border:1px solid var(--color-border-secondary);border-radius:8px;font-size:13px;font-weight:600;color:var(--color-text-primary)">
          ${opsData.map(op => `<option value="${op.id}">${op.label}</option>`).join('')}
        </select>
      </div>

      <div id="group-form-preview"></div>
    </div>
  `

  const selector = preview.querySelector('#group-action-selector')
  const formPreview = preview.querySelector('#group-form-preview')

  // Load initial form
  loadOperationForm(formPreview, catalog, activeOpId)

  // Change handler for action selector
  selector.addEventListener('change', (e) => {
    activeOpId = e.target.value
    loadOperationForm(formPreview, catalog, activeOpId)
  })

  preview.querySelector('#svc-start-form').addEventListener('click', () => {
    portalView = 'form'
    formValues = {}
    const pageEl = document.getElementById('page-portal')
    render(pageEl)
  })
}

function loadOperationForm(container, catalog, opId) {
  const op = catalog.operations.find(o => o.id === opId)
  if (!op) return

  const wfSteps = buildWorkflow(op)

  container.innerHTML = `
    <div class="form-preview-grid">
      <div>
        <div class="form-section-heading">Approval & Provisioning Workflow</div>
        <div class="workflow-timeline-h">
          ${wfSteps.map((s, i) => `
            <div class="wfh-step">
              <div class="wfh-circle wfh-${s.color}"><i class="ti ${s.icon}"></i></div>
              <div class="wfh-label">${s.label}</div>
            </div>
            ${i < wfSteps.length - 1 ? '<div class="wfh-arrow"></div>' : ''}
          `).join('')}
        </div>
      </div>
      <div>
        <div class="form-section-heading">AI Agent Validation Checks</div>
        <div class="agent-checks-list">
          ${op.agentChecks.map(c => `
            <div class="agent-check-item">
              <i class="ti ti-robot agent-check-icon"></i>
              <span>${c}</span>
            </div>
          `).join('')}
        </div>
      </div>
    </div>
  `
}

// ============================================================
// OPERATION FORM — Render form for operation group in sidebar
// ============================================================
function renderOperationForm(catalog, groupName, groupOps) {
  if (groupOps.length === 0) return '<div class="portal-empty-content">No operations available</div>'

  const op = catalog.operations.find(o => o.id === activeOpId)
  if (!op) return '<div class="portal-empty-content">Operation not found</div>'

  const wfSteps = buildWorkflow(op)
  const hasMultipleOps = groupOps.length > 1

  return `
    <div class="portal-form-wrapper">
      <!-- Operation Header -->
      <div class="portal-ops-header-section">
        <div class="portal-ops-group-name">${groupName}</div>
        ${hasMultipleOps ? `<div class="portal-ops-select-prompt">Select an action</div>` : ''}
      </div>

      <form id="operation-form" class="portal-operation-form">
        <!-- Action Selector -->
        ${hasMultipleOps ? `
          <div class="portal-action-group">
            <label class="portal-action-label">
              <i class="ti ti-list-check"></i> Action Type
            </label>
            <select id="action-selector" class="portal-action-select">
              ${groupOps.map(o => `<option value="${o.id}">${o.label}</option>`).join('')}
            </select>
          </div>
        ` : ''}

        <!-- Form Fields -->
        <div class="portal-form-fields">
          ${op.fields.map(f => renderField(f)).join('')}
        </div>

        <!-- AI Agent Validation Section -->
        <div class="portal-agent-validation">
          <div class="portal-validation-header">
            <i class="ti ti-robot"></i>
            <span><i class="ti ti-sparkles" style="margin-right:6px"></i>AI Agent Validation</span>
          </div>
          <div class="portal-validation-checks">
            ${op.agentChecks.map(c => `
              <div class="portal-validation-check">
                <i class="ti ti-check"></i>
                <span>${c}</span>
              </div>
            `).join('')}
          </div>
        </div>

        <!-- Form Actions -->
        <div class="portal-form-actions">
          <button type="submit" class="btn-submit" id="form-submit">
            <i class="ti ti-send"></i> Submit Request
          </button>
        </div>
      </form>
    </div>
  `
}

// ============================================================
// FORM VIEW — dynamic fields + workflow
// ============================================================
function renderFormView(el) {
  const group = getGroup(activeGroupId)
  const serviceId = resolveServiceId()
  const op = getOperation(serviceId, activeOpId)
  if (!op || !group) { portalView = 'service'; render(el); return }

  const wfSteps = buildWorkflow(op)

  // Check if we have multiple operations from group card click
  const groupOps = window.activeGroupOps || []
  const hasMultipleOps = groupOps.length > 1

  el.innerHTML = `
    <div style="max-width:1000px;margin:0 auto">
      <div style="margin-bottom:40px">
        <button class="btn" id="form-back" style="margin-bottom:24px;background:transparent;border:none;color:var(--clr-info-text);padding:0;font-size:14px;font-weight:700;cursor:pointer;display:flex;align-items:center;gap:8px;transition:all 250ms"><i class="ti ti-arrow-left" style="font-size:16px"></i> Back to Operation Groups</button>

        <div class="form-container">
          <div class="form-header">
            <div class="form-title">
              <i class="ti ti-edit"></i>
              ${window.activeGroupName || group.name}
            </div>
            <div class="form-subtitle">
              ${hasMultipleOps ? 'Select an action to proceed' : op.label}
            </div>
          </div>

          ${hasMultipleOps ? `
            <div style="display:flex;flex-direction:column;gap:10px;margin-bottom:32px;padding:24px;background:linear-gradient(135deg, var(--clr-info-bg) 0%, rgba(230, 241, 251, 0.3) 100%);border-radius:10px;border-left:4px solid var(--clr-info-text)">
              <label style="display:flex;align-items:center;gap:8px;font-size:13px;font-weight:700;color:var(--clr-info-text);text-transform:uppercase;letter-spacing:0.3px">
                <i class="ti ti-list-check" style="font-size:16px"></i> Select Action Type
              </label>
              <p style="margin:0;font-size:12px;color:var(--color-text-secondary);line-height:1.5">Choose the specific action you want to perform for ${window.activeGroupName || group.name}</p>
              <select id="action-selector">
                ${groupOps.map(op => `<option value="${op.id}">${op.label}</option>`).join('')}
              </select>
            </div>
          ` : ''}

          <div class="form-fields">
            ${op.fields.map(f => renderField(f)).join('')}
          </div>

          <div style="background:var(--clr-info-bg);border:1px solid var(--clr-info-border);border-radius:8px;padding:16px;margin-bottom:24px">
            <div style="display:flex;align-items:flex-start;gap:12px">
              <i class="ti ti-robot" style="font-size:18px;color:var(--clr-teal-text);flex-shrink:0;margin-top:2px"></i>
              <div style="flex:1">
                <div style="font-size:13px;font-weight:600;color:var(--color-text-primary);margin-bottom:8px"><i class="ti ti-sparkles" style="margin-right:6px"></i>AI Agent Validation</div>
                <div style="display:flex;flex-direction:column;gap:6px">
                  ${op.agentChecks.map(c => `
                    <div style="font-size:12px;color:var(--color-text-secondary);display:flex;align-items:flex-start;gap:6px">
                      <i class="ti ti-check" style="color:var(--clr-teal-text);font-size:11px;flex-shrink:0;margin-top:2px"></i>
                      <span>${c}</span>
                    </div>
                  `).join('')}
                </div>
              </div>
            </div>
          </div>

          <div class="form-actions">
            <button class="btn-cancel" id="form-cancel">Cancel</button>
            <button class="btn-submit" id="form-submit"><i class="ti ti-send"></i> Submit Request</button>
          </div>

          <div style="text-align:center;margin-top:16px">
            <p style="font-size:11px;color:var(--color-text-secondary)">
              By submitting, you acknowledge this request will be logged and routed for approval by the AI Agent.
            </p>
          </div>
        </div>
      </div>

      <!-- Workflow Card -->
      <div class="form-preview-card">
        <div class="form-section-heading">Approval & Provisioning Workflow</div>
        <div class="workflow-timeline-h" style="margin-bottom:24px">
          ${wfSteps.map((s, i) => `
            <div class="wfh-step">
              <div class="wfh-circle wfh-${s.color}"><i class="ti ${s.icon}"></i></div>
              <div class="wfh-label">${s.label}</div>
            </div>
            ${i < wfSteps.length - 1 ? '<div class="wfh-arrow"></div>' : ''}
          `).join('')}
        </div>

        <div style="margin-top:20px;padding:16px;background:var(--clr-info-bg);border-radius:8px;border-left:3px solid var(--clr-info-text)">
          <div style="font-size:12px;font-weight:600;color:var(--clr-info-text);margin-bottom:12px">
            <i class="ti ti-info-circle" style="margin-right:8px"></i>Workflow Process
          </div>
          <ul style="margin:0;padding-left:20px;font-size:12px;color:var(--color-text-secondary);line-height:1.8">
            <li><strong>Request Submitted:</strong> Your request is logged in the system</li>
            <li><strong>Manager Approval:</strong> Your direct manager reviews and approves</li>
            <li><strong>IT Review:</strong> IT team validates technical requirements</li>
            <li><strong>AI Agent Validation:</strong> Automated checks ensure compliance</li>
            <li><strong>System Provisioning:</strong> Resources are automatically created</li>
            <li><strong>Completion:</strong> You're notified when everything is ready</li>
          </ul>
        </div>
      </div>
    </div>
  `

  el.querySelector('#form-back').addEventListener('click', () => { portalView = 'service'; window.activeGroupName = null; window.activeGroupOps = null; render(el) })
  el.querySelector('#form-cancel').addEventListener('click', () => { portalView = 'service'; window.activeGroupName = null; window.activeGroupOps = null; render(el) })
  el.querySelector('#form-submit').addEventListener('click', () => handleSubmit(el, op))

  // Action selector change handler
  const actionSelector = el.querySelector('#action-selector')
  if (actionSelector) {
    actionSelector.addEventListener('change', (e) => {
      activeOpId = e.target.value
      formValues = {}
      render(el)
    })
  }

  // Wire conditional field visibility
  wireFieldDependencies(el, op)

  // Setup user search autocomplete for members fields
  setupUserSearch(el)
}

function renderField(f) {
  const req = f.required ? ' *' : ''
  const hint = f.hint ? `<div class="form-field-hint">${f.hint}</div>` : ''

  if (f.type === 'text' || f.type === 'email') {
    const userFieldIds = ['members', 'owners', 'managedBy', 'delegates', 'fullAccess', 'sendAs', 'sponsor', 'changeOwner', 'userUpn', 'reassignContent']
    const groupFieldIds = ['groupName', 'group']

    const isUserField = userFieldIds.includes(f.id) ||
                       f.label.toLowerCase().includes('member') ||
                       f.label.toLowerCase().includes('owner') ||
                       f.label.toLowerCase().includes('delegate') ||
                       (f.label.toLowerCase().includes('upn') && (f.placeholder || '').toLowerCase().includes('upn'))

    const isGroupField = groupFieldIds.includes(f.id) ||
                        (f.label.toLowerCase().includes('group') && f.placeholder?.toLowerCase().includes('group'))

    const autocompleteClass = (isUserField ? 'user-search-input' : '') + (isGroupField ? ' group-search-input' : '')
    const hasAutocomplete = isUserField || isGroupField

    return `<div class="form-field-group" data-field="${f.id}" ${hasAutocomplete ? 'style="position:relative"' : ''}>
      <label class="form-field-label" for="ff-${f.id}">
        ${f.label}${req ? '<span class="form-field-required">*</span>' : ''}
      </label>
      <input type="${f.type}" class="form-field-input ${autocompleteClass.trim()}" id="ff-${f.id}" name="${f.id}" placeholder="${f.placeholder || ''}" ${f.required ? 'required' : ''} autocomplete="off">
      ${hasAutocomplete ? '<div class="user-dropdown" id="dd-' + f.id + '" style="display:none;position:absolute;top:100%;left:0;right:0;background:white;border:1px solid #ccc;border-radius:4px;max-height:200px;overflow-y:auto;z-index:1000;box-shadow:0 2px 8px rgba(0,0,0,0.1)"></div>' : ''}
      ${hint}
    </div>`
  }
  if (f.type === 'date') {
    return `<div class="form-field-group" data-field="${f.id}">
      <label class="form-field-label" for="ff-${f.id}">
        ${f.label}${req ? '<span class="form-field-required">*</span>' : ''}
      </label>
      <input type="date" class="form-field-input" id="ff-${f.id}" name="${f.id}" ${f.required ? 'required' : ''}>
      ${hint}
    </div>`
  }
  if (f.type === 'select') {
    return `<div class="form-field-group" data-field="${f.id}">
      <label class="form-field-label" for="ff-${f.id}">
        ${f.label}${req ? '<span class="form-field-required">*</span>' : ''}
      </label>
      <select class="form-field-input" id="ff-${f.id}" name="${f.id}" ${f.required ? 'required' : ''}>
        <option value="">— Select —</option>
        ${(f.options || []).map(o => `<option value="${o}">${o}</option>`).join('')}
      </select>
      ${hint}
    </div>`
  }
  if (f.type === 'textarea') {
    return `<div class="form-field-group" data-field="${f.id}">
      <label class="form-field-label" for="ff-${f.id}">
        ${f.label}${req ? '<span class="form-field-required">*</span>' : ''}
      </label>
      <textarea class="form-field-input" id="ff-${f.id}" name="${f.id}" placeholder="${f.placeholder || ''}" ${f.required ? 'required' : ''} style="min-height:100px;resize:vertical"></textarea>
      ${hint}
    </div>`
  }
  if (f.type === 'checkbox') {
    return `<div class="form-field-group" data-field="${f.id}">
      <label style="display:flex;align-items:center;gap:8px;cursor:pointer">
        <input type="checkbox" id="ff-${f.id}" name="${f.id}">
        <span class="form-field-label" style="margin:0">${f.label}</span>
      </label>
      ${hint}
    </div>`
  }
  return ''
}

function wireFieldDependencies(el) {
  // No complex conditional logic needed for now — all fields shown
}

function setupUserSearch(el) {
  // Get API URL - determine if production or development
  const isDev = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
  const apiUrl = isDev
    ? 'http://localhost:3001/api'
    : 'https://m365ops-api-gtbgezb9c7bgata7.centralus-01.azurewebsites.net/api'

  // Handle both user and group search inputs
  const userSearchInputs = el.querySelectorAll('.user-search-input')
  const groupSearchInputs = el.querySelectorAll('.group-search-input')

  console.log(`🔍 Found ${userSearchInputs.length} user search input(s) and ${groupSearchInputs.length} group search input(s)`)

  const setupSearch = (input, searchType) => {
    // Strip 'ff-' prefix from input ID to get field ID (e.g., 'ff-members' → 'members')
    const fieldId = input.id.replace('ff-', '')
    const dropdownId = 'dd-' + fieldId
    const dropdown = el.querySelector('#' + dropdownId)
    const endpoint = searchType === 'group' ? '/search/groups' : '/search/users'

    console.log(`🔍 Setting up ${searchType} search for: ${input.id}, Field: ${fieldId}, Dropdown ID: ${dropdownId}, Found: ${!!dropdown}`)
    if (!dropdown) return

    let debounceTimer = null

    input.addEventListener('input', async (e) => {
      // Debounce: wait 300ms before searching
      clearTimeout(debounceTimer)
      debounceTimer = setTimeout(async () => {
        const query = e.target.value.split(',').pop().trim() // Get last value for comma-separated

        if (query.length < 2) {
          dropdown.style.display = 'none'
          return
        }

        try {
          const response = await fetch(`${apiUrl}${endpoint}?query=${encodeURIComponent(query)}`, {
            targetAddressSpace: isDev ? 'local' : undefined
          })
          const result = await response.json()

          if (result.success && result.data.length > 0) {
            const resultType = searchType === 'group' ? 'group' : 'user'
            dropdown.innerHTML = result.data.map((item, idx) => `
              <div class="search-option" data-value="${item.email || item.displayName}" data-index="${idx}" style="padding:10px;cursor:pointer;border-bottom:1px solid #eee">
                <div style="font-weight:600">${item.displayName}</div>
                <div style="font-size:9px;color:var(--color-text-secondary)">${item.email}</div>
              </div>
            `).join('')
            dropdown.style.display = 'block'

            // Click handlers for options
            dropdown.querySelectorAll('.search-option').forEach(option => {
              option.addEventListener('click', () => {
                const selectedValue = option.dataset.value
                if (searchType === 'group') {
                  // For group selection, just set the value
                  input.value = selectedValue
                } else {
                  // For members, handle comma-separated values
                  const currentValue = input.value
                  const parts = currentValue.split(',')
                  parts[parts.length - 1] = selectedValue
                  input.value = parts.join(', ').trim()
                }
                dropdown.style.display = 'none'
              })
            })
          } else {
            const noResultMsg = searchType === 'group' ? 'No groups found' : 'No users found'
            dropdown.innerHTML = `<div style="padding:10px;color:var(--color-text-tertiary)">${noResultMsg}</div>`
            dropdown.style.display = 'block'
          }
        } catch (error) {
          console.error(`${searchType} search error:`, error)
          dropdown.style.display = 'none'
        }
      }, 300) // Wait 300ms before searching
    })

    // Close dropdown when clicking outside
    document.addEventListener('click', (e) => {
      if (e.target !== input && !dropdown.contains(e.target)) {
        dropdown.style.display = 'none'
      }
    }, { once: false })
  }

  // Setup user search inputs
  userSearchInputs.forEach(input => setupSearch(input, 'user'))

  // Setup group search inputs
  groupSearchInputs.forEach(input => setupSearch(input, 'group'))
}

function wfStepDesc(stepId, op) {
  const paths = op.approvalPath || []
  if (stepId === 'submit') return `Request submitted with required details`
  if (stepId === 'manager') return `Your direct manager reviews and approves`
  if (stepId === 'it') return `IT team validates technical feasibility and security`
  if (stepId === 'dataowner') return `Data/resource owner confirms access appropriateness`
  if (stepId === 'agent') return `AI Agent validates: ${op.agentChecks[0]}, and ${op.agentChecks.length - 1} more checks`
  if (stepId === 'action') return `System automatically provisions the resource`
  if (stepId === 'done') return `Email notification sent. Check Self Service → My Requests to track status.`
  return ''
}

function handleSubmit(el, op) {
  // Validate required fields
  const form = el.querySelector('#dynamic-form')
  let valid = true
  const missingFields = []

  op.fields.filter(f => f.required).forEach(f => {
    const input = form.querySelector(`#ff-${f.id}`)
    if (!input) return
    const val = input.type === 'checkbox' ? input.checked : input.value.trim()
    if (!val) {
      valid = false
      missingFields.push(f.label)
      input.style.borderColor = 'var(--clr-danger-text)'
      input.addEventListener('input', () => { input.style.borderColor = '' }, { once: true })
    }
  })

  // Special: wipe confirmation
  const confirmField = op.fields.find(f => f.id === 'confirmation')
  if (confirmField) {
    const inp = form.querySelector('#ff-confirmation')
    const nameInp = form.querySelector('#ff-groupName, #ff-siteUrl, #ff-currentName')
    if (inp && inp.value.toUpperCase() !== 'CONFIRM' && !nameInp) {
      // wipe device requires "CONFIRM"
      if (inp.value !== 'CONFIRM') {
        valid = false
        showToast('Type CONFIRM in the confirmation field to proceed.', 'error')
        return
      }
    }
  }

  if (!valid) {
    showToast(`Please fill in required fields: ${missingFields.slice(0, 3).join(', ')}`, 'error')
    return
  }

  // Collect values
  op.fields.forEach(f => {
    const inp = form.querySelector(`#ff-${f.id}`)
    if (inp) formValues[f.id] = inp.type === 'checkbox' ? inp.checked : inp.value
  })

  console.log('📝 Form values collected:', JSON.stringify(formValues))

  // ============================================================
  // Call Agent Validation
  // ============================================================
  validateWithAgent(el, op)
}

// ============================================================
// Agent Validation with UI
// ============================================================
async function validateWithAgent(el, op) {
  const btn = el.querySelector('#form-submit')
  const formCard = el.querySelector('.card')

  // Show loading state
  btn.disabled = true
  btn.innerHTML = '<span class="spinner"></span> Validating with AI Agent...'

  try {
    // Call backend agent validation endpoint
    const response = await fetch(`${api}/agent/validate-request`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        request: {
          operationId: op.id,
          fields: formValues
        },
        userEmail: window.userEmail
      })
    })

    const result = await response.json()
    const validation = result.data

    console.log('🤖 Agent validation result:', validation)

    // Show validation results in modal/overlay
    showValidationResults(el, op, validation, formValues)
  } catch (error) {
    console.error('⚠️ Validation error:', error)
    showToast('Agent validation failed. Proceeding with manual review.', 'warning')
    // Proceed without agent validation
    completeSubmission(el, op, null)
  } finally {
    btn.disabled = false
    btn.innerHTML = '<i class="ti ti-send"></i> Submit Request'
  }
}

// ============================================================
// Display Validation Results
// ============================================================
function showValidationResults(el, op, validation, values) {
  const { riskLevel, riskScore, checks, recommendations, autoApprove, approvalPath, status } = validation

  // Color map for risk levels
  const riskColors = {
    LOW: { bg: 'var(--clr-success-bg)', text: 'var(--clr-success-text)', icon: 'ti-circle-check' },
    MEDIUM: { bg: 'var(--clr-warning-bg)', text: 'var(--clr-warning-text)', icon: 'ti-alert-circle' },
    HIGH: { bg: 'var(--clr-danger-bg)', text: 'var(--clr-danger-text)', icon: 'ti-alert-octagon' },
    CRITICAL: { bg: 'var(--clr-danger-bg)', text: 'var(--clr-danger-text)', icon: 'ti-alert-triangle' }
  }

  const color = riskColors[riskLevel]

  // Create overlay
  const overlay = document.createElement('div')
  overlay.style.cssText = 'position:fixed;top:0;left:0;right:0;bottom:0;background:rgba(0,0,0,0.5);display:flex;align-items:center;justify-content:center;z-index:1000;padding:20px'

  const modal = document.createElement('div')
  modal.style.cssText = 'background:white;border-radius:8px;max-width:600px;max-height:80vh;overflow-y:auto;padding:24px;box-shadow:0 10px 40px rgba(0,0,0,0.3)'

  modal.innerHTML = `
    <div style="text-align:center;margin-bottom:24px">
      <div style="display:inline-flex;align-items:center;justify-content:center;width:60px;height:60px;border-radius:50%;background:${color.bg};margin-bottom:12px">
        <i class="ti ${color.icon}" style="font-size:28px;color:${color.text}"></i>
      </div>
      <h2 style="font-size:18px;font-weight:600;margin:0;color:var(--color-text-primary)">Agent Validation Complete</h2>
      <p style="font-size:12px;color:var(--color-text-secondary);margin:8px 0 0">Risk Level: <strong style="color:${color.text}">${riskLevel}</strong> (${riskScore}/100)</p>
    </div>

    <!-- Validation Checks -->
    <div style="margin-bottom:20px">
      <h3 style="font-size:12px;font-weight:600;text-transform:uppercase;color:var(--color-text-tertiary);margin-bottom:10px">Validation Checks</h3>
      <div style="display:flex;flex-direction:column;gap:8px">
        ${checks.map(check => `
          <div style="display:flex;align-items:flex-start;gap:10px;padding:10px;background:var(--color-background-secondary);border-radius:4px">
            <div style="flex-shrink:0;margin-top:2px">
              ${check.status === 'PASS' ? '<i class="ti ti-circle-check" style="color:var(--clr-success-text);font-size:14px"></i>' :
                check.status === 'FAIL' ? '<i class="ti ti-circle-x" style="color:var(--clr-danger-text);font-size:14px"></i>' :
                '<i class="ti ti-alert-circle" style="color:var(--clr-warning-text);font-size:14px"></i>'}
            </div>
            <div>
              <div style="font-size:11px;font-weight:600;color:var(--color-text-primary)">${check.message}</div>
              ${check.suggestion ? `<div style="font-size:10px;color:var(--color-text-secondary);margin-top:3px">💡 ${check.suggestion}</div>` : ''}
            </div>
          </div>
        `).join('')}
      </div>
    </div>

    <!-- Recommendations -->
    ${recommendations && recommendations.length > 0 ? `
      <div style="margin-bottom:20px;padding:12px;background:var(--clr-info-bg);border-left:3px solid var(--clr-info-text);border-radius:4px">
        <div style="font-size:12px;font-weight:600;color:var(--clr-info-text);margin-bottom:8px">🤖 Agent Recommendations</div>
        <ul style="margin:0;padding-left:20px;font-size:11px;color:var(--clr-info-text)">
          ${recommendations.map(r => `<li style="margin-bottom:4px">${r.message}</li>`).join('')}
        </ul>
      </div>
    ` : ''}

    <!-- Auto-Approval Badge -->
    ${autoApprove ? `
      <div style="margin-bottom:20px;padding:12px;background:var(--clr-success-bg);border-radius:4px;text-align:center">
        <div style="font-size:14px;font-weight:600;color:var(--clr-success-text)">✓ AUTO-APPROVED</div>
        <div style="font-size:10px;color:var(--clr-success-text);margin-top:4px">Your request meets all requirements and will be provisioned immediately</div>
      </div>
    ` : `
      <div style="margin-bottom:20px;padding:12px;background:var(--clr-info-bg);border-radius:4px">
        <div style="font-size:12px;font-weight:600;color:var(--clr-info-text);margin-bottom:6px">📋 Approval Required</div>
        <div style="font-size:11px;color:var(--clr-info-text)">
          This request will be routed through:
          <div style="margin-top:6px;font-family:var(--font-mono);font-size:10px;padding:8px;background:rgba(0,0,0,0.1);border-radius:3px">
            ${approvalPath.map((step, idx) => `${step}${idx < approvalPath.length - 1 ? ' → ' : ''}`).join('')}
          </div>
        </div>
      </div>
    `}

    <!-- Action Buttons -->
    <div style="display:flex;gap:10px;justify-content:flex-end">
      <button id="val-cancel" class="btn" style="padding:8px 16px;font-size:12px">Cancel</button>
      <button id="val-submit" class="btn btn-primary" style="padding:8px 16px;font-size:12px">
        <i class="ti ti-send"></i> Confirm & Submit
      </button>
    </div>
  `

  overlay.appendChild(modal)
  document.body.appendChild(overlay)

  // Event handlers
  document.getElementById('val-cancel').addEventListener('click', () => {
    overlay.remove()
  })

  document.getElementById('val-submit').addEventListener('click', () => {
    overlay.remove()
    completeSubmission(el, op, validation)
  })
}

// ============================================================
// Complete Submission
// ============================================================
async function completeSubmission(el, op, validation) {
  reqCounter++

  try {
    // Submit request to backend Self Service API
    const submitBtn = el.querySelector('#val-submit')
    if (submitBtn) {
      submitBtn.disabled = true
      submitBtn.innerHTML = '<span class="spinner"></span> Submitting...'
    }

    const serviceId = resolveServiceId()
    const submitPayload = {
      serviceId: serviceId,
      operationId: op.id,
      formData: formValues,
      requesterId: state.currentUser?.email || window.userEmail,
      description: op.label
    }
    console.log('📤 Submitting request with formData:', JSON.stringify(submitPayload.formData))

    const response = await fetch(`${api}/self-service/requests/submit`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(submitPayload)
    })

    const result = await response.json()
    if (result.success) {
      console.log('✓ Request submitted:', result.requestId)
      submittedRequestId = result.requestId
      showToast('Request submitted successfully', 'success')
      portalView = 'submitted'
      render(el)
    } else {
      showToast('Failed to submit request: ' + result.error, 'error')
      if (submitBtn) {
        submitBtn.disabled = false
        submitBtn.innerHTML = '<i class="ti ti-send"></i> Confirm & Submit'
      }
    }
  } catch (error) {
    console.error('Submission error:', error)
    showToast('Error submitting request. Please try again.', 'error')
  }
}

// ============================================================
// SUBMITTED VIEW — confirmation + workflow progress
// ============================================================
function renderSubmitted(el) {
  const group = getGroup(activeGroupId)
  const serviceId = resolveServiceId()
  const op = getOperation(serviceId, activeOpId)
  if (!op || !group) { portalView = 'landing'; render(el); return }

  const wfSteps = buildWorkflow(op)
  const reqNum = submittedRequestId || `REQ-${String(reqCounter).padStart(4, '0')}`

  el.innerHTML = `
    <div style="max-width:900px;margin:0 auto">
      <div class="submission-success">
        <div class="submission-success-icon"><i class="ti ti-circle-check"></i></div>
        <div class="submission-success-title">Request Submitted Successfully</div>
        <div class="submission-success-text">
          Your ${op.label} request has been received and is now in the approval workflow.
          <br>You will receive email notifications at each stage.
        </div>
        <div class="submission-id">${reqNum}</div>
      </div>

      <div class="form-preview-card">
        <div class="form-section-heading" style="margin-bottom:20px">Request Details</div>

        <div style="display:grid;grid-template-columns:auto 1fr;gap:10px 24px;margin-bottom:24px;font-size:12px">
          <div style="color:var(--color-text-secondary);font-weight:600">Request ID</div>
          <div style="font-family:var(--font-mono);color:var(--clr-info-text);font-weight:600">${reqNum}</div>

          <div style="color:var(--color-text-secondary);font-weight:600">Service</div>
          <div>${group.name}</div>

          <div style="color:var(--color-text-secondary);font-weight:600">Operation</div>
          <div>${op.label}</div>

          <div style="color:var(--color-text-secondary);font-weight:600">Submitted By</div>
          <div>${state.currentUser?.name}</div>

          <div style="color:var(--color-text-secondary);font-weight:600">Submitted At</div>
          <div>${new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })} today</div>

          <div style="color:var(--color-text-secondary);font-weight:600">Current Status</div>
          <div style="color:var(--clr-warning-text);font-weight:600">In Review</div>
        </div>

        <div class="form-section-heading" style="margin-bottom:16px">Approval Workflow</div>
        <div class="workflow-timeline-h">
          ${wfSteps.map((s, i) => {
            const bgColor = i === 0 ? 'var(--clr-success-text)' : 'var(--color-border-secondary)'
            return `
            <div class="wfh-step">
              <div class="wfh-circle ${i === 0 ? 'wfh-success' : 'wfh-warning'}" style="background:${i === 0 ? 'var(--clr-success-bg)' : 'var(--color-background-secondary)'};color:${i === 0 ? 'var(--clr-success-text)' : 'var(--color-text-secondary)'}">
                ${i === 0 ? '<i class="ti ti-check"></i>' : '<i class="ti ' + s.icon + '"></i>'}
              </div>
              <div class="wfh-label" style="color:${i === 0 ? 'var(--clr-success-text)' : 'var(--color-text-secondary)'}">${s.label}</div>
            </div>
            ${i < wfSteps.length - 1 ? `<div class="wfh-arrow" style="background:${bgColor}"></div>` : ''}
          `
          }).join('')}
        </div>

        <div style="margin-top:24px;padding:16px;background:var(--clr-info-bg);border-radius:8px;border-left:3px solid var(--clr-info-text)">
          <div style="font-size:12px;font-weight:600;color:var(--clr-info-text);margin-bottom:8px">
            <i class="ti ti-info-circle" style="margin-right:6px"></i>What happens next?
          </div>
          <ul style="margin:0;padding-left:20px;font-size:11px;color:var(--color-text-secondary);line-height:1.6">
            <li>Your request will be reviewed by the AI Agent for validation</li>
            <li>Approvers will receive notifications based on the approval path</li>
            <li>Once approved, the system will automatically provision the resource</li>
            <li>You'll be notified when your request is complete</li>
          </ul>
        </div>
      </div>

      <div style="display:flex;gap:12px;margin-top:24px;justify-content:center">
        <button class="btn-cancel" id="back-to-portal" style="padding:10px 20px">
          <i class="ti ti-home"></i> Back to Portal
        </button>
        <button class="btn-submit" id="submit-new" style="padding:10px 20px">
          <i class="ti ti-plus"></i> Submit Another Request
        </button>
      </div>
    </div>
  `

  el.querySelector('#submit-new').addEventListener('click', () => {
    portalView = 'landing'
    activeGroupId = null
    activeSubId = null
    activeOpId = null
    activeTemplateId = null
    formValues = {}
    submittedRequestId = null
    render(el)
  })

  el.querySelector('#back-to-portal').addEventListener('click', () => {
    portalView = 'landing'
    activeGroupId = null
    activeSubId = null
    activeOpId = null
    activeTemplateId = null
    formValues = {}
    submittedRequestId = null
    render(el)
  })

}
