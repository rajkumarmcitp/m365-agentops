// ============================================================
// Controls List Component
// Displays all 990+ UCC controls with filtering
// ============================================================

const API_URL = window.API_URL || 'http://localhost:3000'

let allControls = []
let filteredControls = []
let currentPage = 1
let validationMap = {}
const itemsPerPage = 25

export function renderControlsList(container, tenantId, validationMapParam = {}) {
  // Store validationMap at module level for use in other functions
  validationMap = validationMapParam

  const html = `
    <div class="controls-list-container">
      <!-- Filters -->
      <div class="controls-filters">
        <div class="filter-group">
          <label for="domain-filter">Domain:</label>
          <select id="domain-filter" class="filter-select">
            <option value="">All Domains (1,199 controls)</option>
            <option value="Identity Security">Identity Security (100)</option>
            <option value="Enterprise Applications">Enterprise Applications (100)</option>
            <option value="Microsoft Purview">Microsoft Purview (100)</option>
            <option value="Defender for Cloud Apps">Defender for Cloud Apps (100)</option>
            <option value="Power Platform">Power Platform (100)</option>
            <option value="Conditional Access">Conditional Access (100)</option>
            <option value="SharePoint Online">SharePoint Online (100)</option>
            <option value="Device Security">Device Security (100)</option>
            <option value="Microsoft Teams">Microsoft Teams (100)</option>
            <option value="Exchange Online">Exchange Online (99)</option>
            <option value="Email Security">Email Security (80)</option>
            <option value="Endpoint Security">Endpoint Security (60)</option>
            <option value="Security Operations">Security Operations (20)</option>
            <option value="Executive Security">Executive Security (10)</option>
            <option value="Security Governance">Security Governance (10)</option>
            <option value="Governance">Governance (10)</option>
            <option value="Executive Intelligence">Executive Intelligence (10)</option>
          </select>
        </div>

        <div class="filter-group">
          <label for="status-filter">Status:</label>
          <select id="status-filter" class="filter-select">
            <option value="">All Status</option>
            <option value="PASS">✓ Pass</option>
            <option value="FAIL">✗ Fail</option>
            <option value="PARTIAL">⚠ Partial</option>
            <option value="UNKNOWN">? Unknown</option>
          </select>
        </div>

        <div class="filter-group">
          <label for="severity-filter">Severity:</label>
          <select id="severity-filter" class="filter-select">
            <option value="">All Severity</option>
            <option value="Critical">🔴 Critical</option>
            <option value="High">🟠 High</option>
            <option value="Medium">🟡 Medium</option>
            <option value="Low">🟢 Low</option>
          </select>
        </div>

        <div class="filter-group">
          <label for="validation-filter">Validation Method:</label>
          <select id="validation-filter" class="filter-select">
            <option value="">All Methods</option>
            <option value="Graph API">Graph API</option>
            <option value="PowerShell">PowerShell</option>
            <option value="Hybrid">Hybrid</option>
          </select>
        </div>

        <button class="btn btn-secondary" id="clear-filters-btn">Clear Filters</button>
      </div>

      <!-- Results info -->
      <div class="controls-info">
        <span id="results-count">Loading controls...</span>
        <button class="btn btn-tertiary" id="export-controls-btn">📥 Export CSV</button>
      </div>

      <!-- Loading state -->
      <div class="controls-loading" id="controls-loading" style="display: none;">
        <div class="spinner"></div>
        <p>Loading controls...</p>
      </div>

      <!-- Table -->
      <div class="controls-table-wrapper" id="controls-table-wrapper" style="display: none;">
        <table class="controls-table">
          <thead>
            <tr>
              <th class="sortable" data-sort="id">ID</th>
              <th class="sortable" data-sort="name">Control Name</th>
              <th class="sortable" data-sort="severity">Severity</th>
              <th class="sortable" data-sort="status">Status</th>
              <th class="sortable" data-sort="score">Score</th>
              <th class="sortable" data-sort="validationMethod">Validation</th>
              <th>Details</th>
            </tr>
          </thead>
          <tbody id="controls-tbody">
            <!-- Rows populated dynamically -->
          </tbody>
        </table>
      </div>

      <!-- Empty state -->
      <div class="controls-empty" id="controls-empty" style="display: none;">
        <p>No controls found matching your filters.</p>
      </div>

      <!-- Error state -->
      <div class="controls-error" id="controls-error" style="display: none;">
        <p id="error-message"></p>
        <button class="btn btn-primary" id="retry-controls-btn">🔄 Retry</button>
      </div>

      <!-- Pagination -->
      <div class="controls-pagination" id="controls-pagination" style="display: none;">
        <button class="btn btn-secondary" id="prev-page-btn">← Previous</button>
        <span id="page-info">Page 1</span>
        <button class="btn btn-secondary" id="next-page-btn">Next →</button>
      </div>
    </div>
  `

  container.innerHTML = html

  // Initialize
  initializeControlsList(tenantId)
}

async function initializeControlsList(tenantId) {
  console.log('🔄 Initializing controls list for tenant:', tenantId)

  const loadingEl = document.getElementById('controls-loading')
  const tableWrapperEl = document.getElementById('controls-table-wrapper')
  const emptyEl = document.getElementById('controls-empty')
  const errorEl = document.getElementById('controls-error')

  try {
    // Validate elements exist
    if (!loadingEl || !tableWrapperEl) {
      console.error('❌ Required DOM elements not found')
      return
    }

    // Show loading
    loadingEl.style.display = 'flex'
    tableWrapperEl.style.display = 'none'
    emptyEl.style.display = 'none'
    errorEl.style.display = 'none'

    // Fetch all controls from all domains
    console.log('📥 Fetching controls from all domains...')
    await loadAllControls(tenantId)
    console.log(`✅ Loaded ${allControls.length} controls`)

    // Hide loading
    loadingEl.style.display = 'none'

    // Render initial table
    filterAndRender()

    // Attach event listeners
    document.getElementById('domain-filter').addEventListener('change', () => {
      currentPage = 1
      filterAndRender()
    })
    document.getElementById('status-filter').addEventListener('change', () => {
      currentPage = 1
      filterAndRender()
    })
    document.getElementById('severity-filter').addEventListener('change', () => {
      currentPage = 1
      filterAndRender()
    })
    document.getElementById('validation-filter').addEventListener('change', () => {
      currentPage = 1
      filterAndRender()
    })
    document.getElementById('clear-filters-btn').addEventListener('click', () => {
      document.getElementById('domain-filter').value = ''
      document.getElementById('status-filter').value = ''
      document.getElementById('severity-filter').value = ''
      document.getElementById('validation-filter').value = ''
      currentPage = 1
      filterAndRender()
    })
    document.getElementById('export-controls-btn').addEventListener('click', exportControlsAsCSV)
    document.getElementById('retry-controls-btn').addEventListener('click', () => {
      initializeControlsList(tenantId)
    })
    document.getElementById('prev-page-btn')?.addEventListener('click', () => {
      if (currentPage > 1) {
        currentPage--
        filterAndRender()
      }
    })
    document.getElementById('next-page-btn')?.addEventListener('click', () => {
      const maxPages = Math.ceil(filteredControls.length / itemsPerPage)
      if (currentPage < maxPages) {
        currentPage++
        filterAndRender()
      }
    })

    // Attach sort listeners
    document.querySelectorAll('th.sortable').forEach(th => {
      th.addEventListener('click', () => {
        const sortKey = th.dataset.sort
        sortControls(sortKey)
      })
    })

  } catch (error) {
    console.error('❌ Error loading controls:', error)
    loadingEl.style.display = 'none'
    errorEl.style.display = 'block'
    tableWrapperEl.style.display = 'none'
    emptyEl.style.display = 'none'
    const errorMsgEl = document.getElementById('error-message')
    if (errorMsgEl) {
      errorMsgEl.textContent = error.message || 'Failed to load controls. Please try again.'
    }
    console.log('Error details:', { error, allControls: allControls.length })
  }
}

async function loadAllControls(tenantId) {
  const domains = [
    'Identity Security', 'Exchange Online', 'SharePoint Online', 'Enterprise Applications',
    'Defender for Cloud Apps', 'Microsoft Teams', 'Device Security', 'Endpoint Security',
    'Email Security', 'Conditional Access', 'Microsoft Purview', 'Power Platform',
    'Security Operations', 'Executive Security', 'Security Governance', 'Governance',
    'Executive Intelligence'
  ]

  allControls = []
  let successCount = 0
  let failCount = 0

  console.log(`📋 Loading controls from ${domains.length} domains...`)

  // Load controls from each domain
  for (const domain of domains) {
    try {
      const url = `${API_URL}/api/m365-agentops/v2/compliance/domain/${domain}/controls?tenantId=${tenantId}`
      console.log(`  Fetching ${domain}...`)

      const response = await fetch(url)
      if (!response.ok) {
        console.warn(`  ⚠️ ${domain}: HTTP ${response.status}`)
        failCount++
        continue
      }

      const data = await response.json()
      if (data.data && Array.isArray(data.data)) {
        allControls = allControls.concat(data.data)
        successCount++
        console.log(`  ✅ ${domain}: ${data.data.length} controls`)
      } else {
        console.warn(`  ⚠️ ${domain}: No data in response`)
        failCount++
      }
    } catch (err) {
      console.warn(`  ❌ ${domain}: ${err.message}`)
      failCount++
    }
  }

  console.log(`📊 Summary: ${successCount} domains loaded, ${failCount} failed`)
  console.log(`✅ Total controls loaded: ${allControls.length}`)

  if (allControls.length === 0) {
    throw new Error('No controls could be loaded. Please check your API connection.')
  }
}

function filterAndRender() {
  const domainFilter = document.getElementById('domain-filter').value
  const statusFilter = document.getElementById('status-filter').value
  const severityFilter = document.getElementById('severity-filter').value
  const validationFilter = document.getElementById('validation-filter').value

  // Apply filters
  filteredControls = allControls.filter(control => {
    if (domainFilter && control.domain !== domainFilter) return false
    if (statusFilter && control.status !== statusFilter) return false
    if (severityFilter && control.severity !== severityFilter) return false
    if (validationFilter && control.validationMethod !== validationFilter) return false
    return true
  })

  // Render table
  renderControlsTable()
}

function renderControlsTable() {
  const tableWrapperEl = document.getElementById('controls-table-wrapper')
  const emptyEl = document.getElementById('controls-empty')
  const tbodyEl = document.getElementById('controls-tbody')
  const resultsEl = document.getElementById('results-count')
  const paginationEl = document.getElementById('controls-pagination')

  if (filteredControls.length === 0) {
    tableWrapperEl.style.display = 'none'
    emptyEl.style.display = 'block'
    paginationEl.style.display = 'none'
    resultsEl.textContent = 'No controls found'
    return
  }

  tableWrapperEl.style.display = 'block'
  emptyEl.style.display = 'none'

  // Pagination
  const maxPages = Math.ceil(filteredControls.length / itemsPerPage)
  const startIdx = (currentPage - 1) * itemsPerPage
  const endIdx = startIdx + itemsPerPage
  const pageControls = filteredControls.slice(startIdx, endIdx)

  // Render rows with validation status
  tbodyEl.innerHTML = pageControls.map(control => {
    // Use validation status from validationMap if available
    const validation = validationMap[control.id] || {}
    let status = control.status || 'UNKNOWN'
    let score = control.score || 0

    // Override with validation status if available
    if (validation.status) {
      status = validation.status.toUpperCase()
      score = validation.status === 'pass' ? 100 : validation.status === 'fail' ? 0 : 50
    }

    return `
    <tr class="control-row">
      <td class="control-id">${control.id}</td>
      <td class="control-name">${control.name}</td>
      <td class="control-severity">
        <span class="status-badge ${getSeverityClass(control.severity)}">
          ${getSeverityIcon(control.severity)} ${control.severity}
        </span>
      </td>
      <td class="control-status">
        <span class="status-badge ${getStatusClass(status)}">
          ${getStatusIcon(status)} ${status}
        </span>
      </td>
      <td class="control-score">
        <span class="score ${getScoreClass(score)}">${score}%</span>
      </td>
      <td class="control-validation">${control.validationMethod}</td>
      <td class="control-details">
        <button class="btn btn-mini" onclick="window.showControlDetail('${control.id}')">View</button>
      </td>
    </tr>
    `
  }).join('')

  // Update results count
  resultsEl.textContent = `Showing ${startIdx + 1}-${Math.min(endIdx, filteredControls.length)} of ${filteredControls.length} controls`

  // Update pagination
  if (maxPages > 1) {
    paginationEl.style.display = 'flex'
    document.getElementById('page-info').textContent = `Page ${currentPage} of ${maxPages}`
    document.getElementById('prev-page-btn').disabled = currentPage === 1
    document.getElementById('next-page-btn').disabled = currentPage === maxPages
  } else {
    paginationEl.style.display = 'none'
  }
}

function sortControls(key) {
  filteredControls.sort((a, b) => {
    let valA = a[key]
    let valB = b[key]

    // Handle numeric values
    if (key === 'score') {
      valA = Number(valA) || 0
      valB = Number(valB) || 0
      return valB - valA
    }

    // Handle string values
    if (typeof valA === 'string') {
      return valA.localeCompare(valB)
    }

    return 0
  })

  currentPage = 1
  renderControlsTable()
}

function getSeverityIcon(severity) {
  const icons = {
    'Critical': '🔴',
    'High': '🟠',
    'Medium': '🟡',
    'Low': '🟢'
  }
  return icons[severity] || '⚪'
}

function getSeverityClass(severity) {
  const severityMap = {
    'critical': 'danger',
    'high': 'warning',
    'medium': 'warning',
    'low': 'info'
  }
  return severityMap[severity.toLowerCase()] || 'info'
}

function getStatusIcon(status) {
  const icons = {
    'PASS': '✓',
    'FAIL': '✗',
    'PARTIAL': '⚠',
    'UNKNOWN': '?'
  }
  return icons[status] || '?'
}

function getStatusClass(status) {
  const statusMap = {
    'pass': 'success',
    'fail': 'danger',
    'partial': 'warning',
    'unknown': 'info'
  }
  return statusMap[status.toLowerCase()] || 'info'
}

function getScoreClass(score) {
  if (score >= 80) return 'score-excellent'
  if (score >= 60) return 'score-good'
  if (score >= 40) return 'score-fair'
  return 'score-poor'
}

function exportControlsAsCSV() {
  const headers = ['ID', 'Name', 'Severity', 'Status', 'Score', 'Validation Method', 'Description', 'Remediation']
  const rows = filteredControls.map(c => [
    c.id,
    c.name,
    c.severity,
    c.status,
    c.score,
    c.validationMethod,
    c.description || '',
    c.remediation || ''
  ])

  const csvContent = [
    headers.join(','),
    ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
  ].join('\n')

  const blob = new Blob([csvContent], { type: 'text/csv' })
  const url = window.URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = `controls-${new Date().toISOString().split('T')[0]}.csv`
  link.click()
  window.URL.revokeObjectURL(url)
}

// Global function to show control details
window.showControlDetail = async (controlId) => {
  const control = allControls.find(c => c.id === controlId)
  if (!control) return

  const modal = document.createElement('div')
  modal.className = 'modal-overlay'
  modal.innerHTML = `
    <div class="modal-content" style="max-width: 700px;">
      <div class="modal-header">
        <h2>${control.id} - ${control.name}</h2>
        <button class="btn-close" onclick="this.closest('.modal-overlay').remove()">×</button>
      </div>
      <div class="modal-body">
        <div style="display: grid; gap: 16px;">
          <div>
            <strong>Severity:</strong> <span class="severity-badge ${getSeverityClass(control.severity)}">${getSeverityIcon(control.severity)} ${control.severity}</span>
          </div>
          <div>
            <strong>Status:</strong> <span class="status-badge ${getStatusClass(control.status)}">${getStatusIcon(control.status)} ${control.status}</span>
          </div>
          <div>
            <strong>Score:</strong> <span class="score ${getScoreClass(control.score)}">${control.score}%</span>
          </div>
          <div>
            <strong>Validation Method:</strong> ${control.validationMethod}
          </div>
          <div>
            <strong>Description:</strong>
            <p>${control.description || 'No description available'}</p>
          </div>
          <div>
            <strong>Remediation:</strong>
            <p>${control.remediation || 'No remediation steps available'}</p>
          </div>
          ${control.graphApiQueries && control.graphApiQueries.length > 0 ? `
            <div>
              <strong>Graph API Queries:</strong>
              <ul style="margin: 8px 0; padding-left: 20px;">
                ${control.graphApiQueries.map(q => `<li><code>${q}</code></li>`).join('')}
              </ul>
            </div>
          ` : ''}
          ${control.powershellCommands && control.powershellCommands.length > 0 ? `
            <div>
              <strong>PowerShell Commands:</strong>
              <ul style="margin: 8px 0; padding-left: 20px;">
                ${control.powershellCommands.map(c => `<li><code>${c}</code></li>`).join('')}
              </ul>
            </div>
          ` : ''}
        </div>
      </div>
    </div>
  `

  document.body.appendChild(modal)
  modal.addEventListener('click', (e) => {
    if (e.target === modal) modal.remove()
  })
}
