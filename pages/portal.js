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
        <div class="page-title"><i class="ti ti-grid-dots"></i> Self-Service Portal</div>
        <div class="page-subtitle">Submit requests — automated approval and provisioning via AI Agent</div>
      </div>
    </div>

    <div style="display:flex;gap:12px;margin-bottom:16px">
      <div class="alert-banner info" style="flex:1">
        <i class="ti ti-user-circle"></i>
        <span>Signed in as <strong>${u?.name}</strong> (${roleDesc[u?.role] || u?.role}).
        All requests are logged and subject to approval workflow and AI Agent validation before provisioning.</span>
      </div>
    </div>

    <div class="portal-workflow-banner mb-3">
      ${WORKFLOW_STEPS.map((s, i) => `
        <div class="pwf-step">
          <div class="pwf-circle pwf-${s.color}"><i class="ti ${s.icon}"></i></div>
          <div class="pwf-label">${s.label}</div>
        </div>
        ${i < WORKFLOW_STEPS.length - 1 ? '<div class="pwf-arrow"><i class="ti ti-arrow-right"></i></div>' : ''}
      `).join('')}
    </div>

    <!-- Quick Templates Section -->
    <div style="margin-bottom:24px">
      <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:12px">
        <div style="font-size:11px;font-weight:600;color:var(--color-text-secondary);text-transform:uppercase;letter-spacing:0.5px">
          ⚡ Quick Start Templates
        </div>
        <button id="view-all-templates" style="font-size:10px;color:var(--clr-info-text);background:transparent;border:none;cursor:pointer;text-decoration:underline">
          View all (${REQUEST_TEMPLATES.length})
        </button>
      </div>
      <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(140px,1fr));gap:10px" id="templates-carousel"></div>
    </div>

    <div style="font-size:11px;font-weight:600;color:var(--color-text-secondary);text-transform:uppercase;letter-spacing:0.5px;margin-bottom:12px">
      ${available.length} services available
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
      <div class="psc-icon" style="background:${group.bg};color:${group.color}"><i class="ti ${group.icon}"></i></div>
      <div class="psc-name">${group.name}</div>
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

  // Render templates carousel (first 6 most popular)
  const carousel = el.querySelector('#templates-carousel')
  REQUEST_TEMPLATES.slice(0, 6).forEach(template => {
    const card = document.createElement('div')
    card.style.cssText = 'padding:12px;background:var(--color-background-secondary);border-radius:6px;cursor:pointer;transition:all 200ms;border:1px solid transparent;text-align:center'
    card.innerHTML = `
      <div style="font-size:24px;margin-bottom:6px">${template.thumbnail}</div>
      <div style="font-size:10px;font-weight:600;color:var(--color-text-primary);margin-bottom:4px;line-height:1.3">${template.name}</div>
      <div style="font-size:9px;color:var(--color-text-secondary)">${template.estimatedTime}</div>
    `
    card.addEventListener('mouseover', () => {
      card.style.background = 'var(--color-border-secondary)'
      card.style.borderColor = 'var(--color-text-tertiary)'
    })
    card.addEventListener('mouseout', () => {
      card.style.background = 'var(--color-background-secondary)'
      card.style.borderColor = 'transparent'
    })
    card.addEventListener('click', () => {
      activeTemplateId = template.id
      activeGroupId = null
      activeOpId = null
      formValues = template.formDefaults || {}
      portalView = 'form'
      render(el)
    })
    carousel.appendChild(card)
  })

  // View all templates button
  el.querySelector('#view-all-templates').addEventListener('click', () => {
    portalView = 'templates'
    render(el)
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

  area.innerHTML = `
    <div class="card">
      <div class="card-title mb-3"><i class="ti ti-list-check"></i> Select an action</div>
      ${Object.entries(grouped).map(([grpName, ops]) => `
        <div style="margin-bottom:16px">
          <div class="section-heading">${grpName}</div>
          <div class="op-cards-grid">
            ${ops.map(op => `
              <div class="op-card ${activeOpId === op.id ? 'selected' : ''}" data-op="${op.id}">
                <div class="op-card-title">${op.label}</div>
                <div class="op-card-steps">
                  ${buildWorkflow(op).map(s => `<span class="op-step-dot op-step-${s.color}" title="${s.label}"></span>`).join('')}
                </div>
                <div class="op-card-approval">
                  <i class="ti ti-route" style="font-size:10px"></i>
                  ${buildWorkflow(op).map(s => s.label).join(' → ')}
                </div>
              </div>
            `).join('')}
          </div>
        </div>
      `).join('')}
    </div>

    <div id="svc-form-preview"></div>
  `

  area.querySelectorAll('.op-card').forEach(card => {
    card.addEventListener('click', () => {
      area.querySelectorAll('.op-card').forEach(c => c.classList.remove('selected'))
      card.classList.add('selected')
      activeOpId = card.dataset.op
      renderFormPreview(area, getCatalog(resolveServiceId()), activeOpId)
    })
  })

  if (activeOpId) {
    const card = area.querySelector(`.op-card[data-op="${activeOpId}"]`)
    if (card) card.classList.add('selected')
    renderFormPreview(area, catalog, activeOpId)
  }
}

function renderFormPreview(area, catalog, opId) {
  const preview = area.querySelector('#svc-form-preview')
  if (!preview) return
  const op = catalog?.operations?.find(o => o.id === opId)
  if (!op) return

  const wfSteps = buildWorkflow(op)

  preview.innerHTML = `
    <div class="card mt-3">
      <div class="card-header">
        <span class="card-title"><i class="ti ti-info-circle"></i> ${op.label}</span>
        <button class="btn btn-primary" id="svc-start-form"><i class="ti ti-arrow-right"></i> Start Request</button>
      </div>

      <div class="grid-2" style="gap:16px">
        <div>
          <div class="section-heading">Approval & Provisioning Workflow</div>
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
          <div class="section-heading">AI Agent Validation Checks</div>
          <div style="display:flex;flex-direction:column;gap:5px">
            ${op.agentChecks.map(c => `
              <div style="display:flex;align-items:flex-start;gap:6px;font-size:11px;color:var(--color-text-secondary)">
                <i class="ti ti-robot" style="color:var(--clr-teal-text);font-size:12px;flex-shrink:0;margin-top:1px"></i>
                ${c}
              </div>
            `).join('')}
          </div>
          <div style="margin-top:10px">
            <div class="section-heading">System Action</div>
            <code style="font-size:10px;font-family:var(--font-mono);color:var(--clr-info-text);background:var(--clr-info-bg);padding:4px 8px;border-radius:4px;display:block;word-break:break-all">${op.systemAction}</code>
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

// ============================================================
// FORM VIEW — dynamic fields + workflow
// ============================================================
function renderFormView(el) {
  const group = getGroup(activeGroupId)
  const serviceId = resolveServiceId()
  const op = getOperation(serviceId, activeOpId)
  if (!op || !group) { portalView = 'service'; render(el); return }

  const wfSteps = buildWorkflow(op)

  el.innerHTML = `
    <div class="page-header">
      <div style="display:flex;align-items:center;gap:10px">
        <button class="btn" id="form-back"><i class="ti ti-arrow-left"></i> Back</button>
        <div class="psc-icon sm" style="background:${group.bg};color:${group.color}"><i class="ti ${group.icon}"></i></div>
        <div>
          <div class="page-title">${op.label}</div>
          <div class="page-subtitle">${group.name}${activeSubId ? ' — ' + (EXCHANGE_SUB.find(s => s.id === activeSubId)?.name || '') : ''}</div>
        </div>
      </div>
    </div>

    <div class="grid-2" style="gap:16px">
      <!-- Form -->
      <div>
        <div class="card mb-3">
          <div class="card-title mb-3"><i class="ti ti-forms"></i> Request Details</div>
          <div id="dynamic-form">
            ${op.fields.map(f => renderField(f)).join('')}
          </div>
        </div>

        <div class="card" style="background:var(--clr-info-bg);border-color:var(--clr-info-border)">
          <div style="display:flex;align-items:flex-start;gap:10px">
            <i class="ti ti-robot" style="font-size:18px;color:var(--clr-teal-text);flex-shrink:0;margin-top:2px"></i>
            <div>
              <div style="font-size:12px;font-weight:600;color:var(--color-text-primary);margin-bottom:6px">AI Agent will validate before provisioning:</div>
              ${op.agentChecks.map(c => `<div style="font-size:11px;color:var(--color-text-secondary);padding:2px 0;display:flex;align-items:flex-start;gap:5px"><i class="ti ti-check" style="color:var(--clr-teal-text);font-size:10px;flex-shrink:0;margin-top:2px"></i>${c}</div>`).join('')}
            </div>
          </div>
        </div>
      </div>

      <!-- Workflow sidebar -->
      <div>
        <div class="card mb-3">
          <div class="card-title mb-3"><i class="ti ti-route"></i> Approval & Provisioning Flow</div>
          <div class="workflow-timeline-v">
            ${wfSteps.map((s, i) => `
              <div class="wfv-step">
                <div class="wfv-left">
                  <div class="wfv-circle wfv-${s.color}"><i class="ti ${s.icon}"></i></div>
                  ${i < wfSteps.length - 1 ? '<div class="wfv-line"></div>' : ''}
                </div>
                <div class="wfv-content">
                  <div class="wfv-title">${s.label}</div>
                  ${wfStepDesc(s.id, op) ? `<div class="wfv-desc">${wfStepDesc(s.id, op)}</div>` : ''}
                </div>
              </div>
            `).join('')}
          </div>
        </div>

        <div class="card">
          <div class="card-title mb-2"><i class="ti ti-api"></i> System Action</div>
          <code style="font-size:10px;font-family:var(--font-mono);color:var(--clr-info-text);word-break:break-all;line-height:1.6">${op.systemAction}</code>
        </div>

        <div style="margin-top:16px">
          <button class="btn btn-primary w-full" id="form-submit" style="width:100%;justify-content:center;padding:10px">
            <i class="ti ti-send"></i> Submit Request
          </button>
          <p style="font-size:10px;color:var(--color-text-tertiary);text-align:center;margin-top:8px">
            By submitting, you acknowledge this request will be logged in the audit trail and routed for approval.
          </p>
        </div>
      </div>
    </div>
  `

  el.querySelector('#form-back').addEventListener('click', () => { portalView = 'service'; render(el) })
  el.querySelector('#form-submit').addEventListener('click', () => handleSubmit(el, op))

  // Wire conditional field visibility
  wireFieldDependencies(el, op)

  // Setup user search autocomplete for members fields
  setupUserSearch(el)
}

function renderField(f) {
  const req = f.required ? ' *' : ''
  const hint = f.hint ? `<div style="font-size:10px;color:var(--color-text-tertiary);margin-top:3px">${f.hint}</div>` : ''

  if (f.type === 'text' || f.type === 'email') {
    // Detect user selection fields across all request types
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

    return `<div class="form-group" data-field="${f.id}" ${hasAutocomplete ? 'style="position:relative"' : ''}>
      <label class="form-label" for="ff-${f.id}">${f.label}${req}</label>
      <input type="${f.type}" class="form-input ${autocompleteClass.trim()}" id="ff-${f.id}" name="${f.id}" placeholder="${f.placeholder || ''}" ${f.required ? 'required' : ''} autocomplete="off">
      ${hasAutocomplete ? '<div class="user-dropdown" id="dd-' + f.id + '" style="display:none;position:absolute;top:100%;left:0;right:0;background:white;border:1px solid #ccc;border-radius:4px;max-height:200px;overflow-y:auto;z-index:1000;box-shadow:0 2px 8px rgba(0,0,0,0.1)"></div>' : ''}
      ${hint}
    </div>`
  }
  if (f.type === 'date') {
    return `<div class="form-group" data-field="${f.id}">
      <label class="form-label" for="ff-${f.id}">${f.label}${req}</label>
      <input type="date" class="form-input" id="ff-${f.id}" name="${f.id}" ${f.required ? 'required' : ''}>
      ${hint}
    </div>`
  }
  if (f.type === 'select') {
    return `<div class="form-group" data-field="${f.id}">
      <label class="form-label" for="ff-${f.id}">${f.label}${req}</label>
      <select class="form-select" id="ff-${f.id}" name="${f.id}" ${f.required ? 'required' : ''}>
        <option value="">— Select —</option>
        ${(f.options || []).map(o => `<option value="${o}">${o}</option>`).join('')}
      </select>
      ${hint}
    </div>`
  }
  if (f.type === 'textarea') {
    return `<div class="form-group" data-field="${f.id}">
      <label class="form-label" for="ff-${f.id}">${f.label}${req}</label>
      <textarea class="form-textarea" id="ff-${f.id}" name="${f.id}" placeholder="${f.placeholder || ''}" ${f.required ? 'required' : ''}></textarea>
      ${hint}
    </div>`
  }
  if (f.type === 'checkbox') {
    return `<div class="form-group" data-field="${f.id}">
      <label style="display:flex;align-items:center;gap:8px;cursor:pointer">
        <input type="checkbox" id="ff-${f.id}" name="${f.id}">
        <span class="form-label" style="margin:0">${f.label}</span>
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
    ? 'http://localhost:3000/api'
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
  if (stepId === 'action') return `Provisioning via: ${op.systemAction}`
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
    <div class="page-header">
      <div class="page-title"><i class="ti ti-circle-check" style="color:var(--clr-success-text)"></i> Request Submitted</div>
    </div>

    <div class="alert-banner success mb-3">
      <i class="ti ti-circle-check"></i>
      <strong>${reqNum}</strong> — ${op.label} request submitted successfully. You will be notified at each approval stage.
    </div>

    <div class="grid-2" style="gap:16px;margin-bottom:16px">
      <div class="card">
        <div class="card-title mb-3"><i class="ti ti-receipt"></i> Request Summary</div>
        <div style="display:grid;grid-template-columns:auto 1fr;gap:5px 16px;font-size:11px">
          <span style="color:var(--color-text-tertiary)">Request ID</span>
          <span class="monospace" style="font-weight:600;color:var(--clr-info-text)">${reqNum}</span>
          <span style="color:var(--color-text-tertiary)">Service</span>
          <span>${group.name}</span>
          <span style="color:var(--color-text-tertiary)">Action</span>
          <span>${op.label}</span>
          <span style="color:var(--color-text-tertiary)">Submitted by</span>
          <span>${state.currentUser?.name}</span>
          <span style="color:var(--color-text-tertiary)">Time</span>
          <span>${new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })} today</span>
          <span style="color:var(--color-text-tertiary)">Status</span>
          <span style="color:var(--clr-warning-text);font-weight:600">Submitted</span>
        </div>
      </div>

      <div class="card">
        <div class="card-title mb-3"><i class="ti ti-route"></i> Workflow Progress</div>
        <div class="workflow-timeline-v compact">
          ${wfSteps.map((s, i) => `
            <div class="wfv-step">
              <div class="wfv-left">
                <div class="wfv-circle ${i === 0 ? 'wfv-success' : 'wfv-neutral'}">
                  ${i === 0 ? '<i class="ti ti-check"></i>' : `<span style="font-size:9px;font-weight:700">${i + 1}</span>`}
                </div>
                ${i < wfSteps.length - 1 ? '<div class="wfv-line"></div>' : ''}
              </div>
              <div class="wfv-content">
                <div class="wfv-title ${i === 0 ? 'done' : i === 1 ? 'active' : 'pending'}">${s.label}</div>
                <div class="wfv-desc">${i === 0 ? 'Completed' : i === 1 ? 'In progress — awaiting response' : 'Pending'}</div>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    </div>

    <div style="display:flex;gap:12px;margin-top:20px">
      <button class="btn btn-primary" id="submit-new" style="padding:10px 16px;font-size:12px;font-weight:600">
        <i class="ti ti-plus"></i> Submit another request
      </button>
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

}
