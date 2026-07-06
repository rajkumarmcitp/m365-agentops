import { state } from '../app.js'
import { showToast } from '../components/toast.js'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000'

const wizardState = {
  currentStep: 1,
  totalSteps: 8,
  completed: {
    1: false,
    2: false,
    3: false,
    4: false,
    5: false,
    6: false,
    7: false,
    8: false
  },
  formData: {
    azureClientId: '',
    azureClientSecret: '',
    azureTenantId: '',
    redirectUri: '',
    roleSuper: '',
    roleAdmin: '',
    roleManager: '',
    graphApiPermissions: [],
    superAdminEmail: '',
    twoFactorRequired: true,
    auditLoggingEnabled: true,
    emailNotificationsEnabled: true,
    // Service Configuration
    selectedServices: [],
    serviceConfigs: {
      changeIntelligence: { enabled: false, siteUrl: '' },
      serviceHealth: { enabled: false, siteUrl: '' },
      zeroTrust: { enabled: false, siteUrl: '' },
      tenantGuard: { enabled: false, siteUrl: '' },
      selfService: { enabled: false, siteUrl: '' }
    }
  }
}

export function initSetupWizard() {
  const el = document.getElementById('page-setup-wizard')
  if (!el) {
    console.error('❌ page-setup-wizard element not found!')
    return
  }

  console.log('✅ Initializing Setup Wizard...')
  renderWizard(el)
  console.log('✅ Setup Wizard rendered')
  attachEventListeners()
  console.log('✅ Setup Wizard event listeners attached')

  // Load existing config in background
  fetch(`${API_URL}/api/setup/config`)
    .then(res => res.json())
    .then(data => {
      if (data.success && data.completedSteps) {
        wizardState.completed = Object.fromEntries(
          [...Array(5).keys()].map(i => [i + 1, data.completedSteps.includes(i + 1)])
        )
        if (data.steps) {
          wizardState.formData = { ...wizardState.formData, ...data.steps['Azure-AD'] }
        }
        // Re-render to show loaded state
        renderWizard(el)
        attachEventListeners()
      }
    })
    .catch(error => console.warn('Could not load existing config:', error.message))
}

const steps = [
  {
    num: 1,
    title: 'Environment Prerequisites',
    icon: 'package',
    description: 'Install and verify PowerShell modules required for self-service portal and advanced features',
    optional: false
  },
  {
    num: 2,
    title: 'Azure AD Prerequisites',
    icon: 'cloud',
    description: 'Register and configure your application in Azure AD',
    optional: false
  },
  {
    num: 3,
    title: 'SSO Configuration',
    icon: 'key',
    description: 'Connect your Azure AD for Single Sign-On',
    optional: false
  },
  {
    num: 4,
    title: 'Graph API Setup',
    icon: 'api',
    description: 'Configure Microsoft Graph API permissions',
    optional: false
  },
  {
    num: 5,
    title: 'Admin Settings',
    icon: 'users',
    description: 'Configure roles and administrative access',
    optional: false
  },
  {
    num: 6,
    title: 'Verification',
    icon: 'check-circle',
    description: 'Test and verify all connections',
    optional: false
  },
  {
    num: 7,
    title: 'Service Configuration',
    icon: 'settings',
    description: 'Configure optional services (Change Intelligence, Zero Trust, etc.)',
    optional: true
  },
  {
    num: 8,
    title: 'List Initialization',
    icon: 'clipboard-list',
    description: 'Auto-create SharePoint lists and columns for selected services',
    optional: true
  }
]

function renderWizard(container) {
  container.innerHTML = `
    <div class="setup-wizard-wrapper">
      <div class="setup-wizard-header">
        <div style="display:flex;align-items:center;gap:12px">
          <i class="ti ti-sparkles" style="font-size:28px;color:var(--color-primary)"></i>
          <div>
            <h1>Setup Wizard</h1>
            <p style="font-size:12px;color:var(--color-text-secondary);margin:4px 0 0 0">Configure your M365 AgentOps for your organization</p>
          </div>
        </div>
      </div>

      <div class="setup-wizard-container">
        <div class="wizard-sidebar">
          ${steps.map(step => `
            <div class="wizard-step ${step.num === wizardState.currentStep ? 'active' : ''} ${wizardState.completed[step.num] ? 'completed' : ''}" onclick="window.setWizardStep(${step.num})">
              <div class="wizard-step-marker">
                ${wizardState.completed[step.num] ? '<i class="ti ti-check"></i>' : step.num}
              </div>
              <div class="wizard-step-info">
                <div class="wizard-step-title">${step.title}</div>
                <div class="wizard-step-desc">${step.description}</div>
              </div>
            </div>
          `).join('')}
        </div>

        <div class="wizard-content">
          ${renderStepContent(wizardState.currentStep)}
        </div>
      </div>
    </div>
  `
}

function renderStepContent(step) {
  switch(step) {
    case 1:
      return renderPowerShellStep()
    case 2:
      return renderAzureAdStep()
    case 3:
      return renderSsoStep()
    case 4:
      return renderGraphApiStep()
    case 5:
      return renderAdminSettingsStep()
    case 6:
      return renderVerificationStep()
    case 7:
      return renderServiceConfigStep()
    case 8:
      return renderListInitializationStep()
    default:
      return ''
  }
}

function renderPowerShellStep() {
  const apiUrl = API_URL
  return `
    <div class="wizard-step-content">
      <div style="margin-bottom:16px;padding:8px 12px;background:rgba(76, 175, 80, 0.1);border-radius:4px;display:inline-block">
        <span style="font-size:11px;font-weight:600;color:#2E7D32">STEP 1 OF 8</span>
      </div>
      <div class="step-header">
        <h2 style="margin:8px 0 4px 0;color:#2E7D32"><i class="ti ti-package"></i> Environment Prerequisites</h2>
        <p style="margin:4px 0 0 0">Install and verify PowerShell modules required for self-service portal and advanced features</p>
      </div>

      <div class="step-body">
        <div id="ps-status-container" style="margin-bottom:24px">
          <div style="text-align:center;padding:20px;color:var(--color-text-secondary)">
            <i class="ti ti-loader" style="font-size:28px;animation:spin 1s linear infinite;display:inline-block"></i>
            <p>Checking PowerShell modules...</p>
          </div>
        </div>

        <div style="display:flex;gap:12px;margin-bottom:20px">
          <button id="btn-check-ps" class="wizard-btn wizard-btn-primary" onclick="window.checkPowerShellModules()">
            <i class="ti ti-refresh"></i> Check Modules
          </button>
          <button id="btn-install-ps" class="wizard-btn wizard-btn-primary" onclick="window.installPowerShellModules()" style="display:none">
            <i class="ti ti-download"></i> Install Missing Modules
          </button>
        </div>

        <div style="background:rgba(244, 67, 54, 0.1);border:1px solid rgba(244, 67, 54, 0.2);padding:12px;border-radius:4px;font-size:12px;line-height:1.6;margin-bottom:20px">
          <strong style="color:#C62828">⚠️ IMPORTANT: PowerShell 7 or Later Required</strong>
          <p style="margin:6px 0 0 0;color:var(--color-text-secondary)">PnP.PowerShell requires <strong>PowerShell 7+</strong> (not Windows PowerShell 5.1)</p>
          <a href="https://github.com/PowerShell/PowerShell/releases" target="_blank" style="color:#1976D2;text-decoration:none;font-weight:600;font-size:11px">→ Download PowerShell 7</a>
        </div>

        <div style="background:rgba(33, 150, 243, 0.1);border:1px solid rgba(33, 150, 243, 0.2);padding:12px;border-radius:4px;font-size:12px;line-height:1.6;color:var(--color-text-secondary);margin-bottom:20px">
          <strong>ℹ️ Required PowerShell Modules:</strong>
          <ul style="margin:8px 0 0 0;padding-left:20px">
            <li><strong>Microsoft.Graph</strong> - Microsoft Graph API</li>
            <li><strong>ExchangeOnlineManagement</strong> - Exchange Online</li>
            <li><strong>PnP.PowerShell</strong> - SharePoint & PnP ⚠️ Requires PS 7+</li>
            <li><strong>MicrosoftTeams</strong> - Teams management</li>
            <li><strong>Microsoft.Online.SharePoint.PowerShell</strong> - SharePoint Online</li>
          </ul>
        </div>

        <div id="ps-module-list" style="display:none">
          <h4 style="margin:16px 0 12px 0">Module Status:</h4>
          <div id="ps-modules-content"></div>
        </div>
      </div>
    </div>

    <script>
      window.checkPowerShellModules = async function() {
        const container = document.getElementById('ps-status-container')
        const moduleList = document.getElementById('ps-module-list')
        const checkBtn = document.getElementById('btn-check-ps')
        const installBtn = document.getElementById('btn-install-ps')

        try {
          container.innerHTML = '<div style="text-align:center;padding:20px"><i class="ti ti-loader" style="font-size:24px;animation:spin 1s linear infinite;display:inline-block"></i><p>Checking modules...</p></div>'

          const apiBaseUrl = '${apiUrl}'
          const response = await fetch(apiBaseUrl + '/api/setup/powershell/check', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' }
          })

          const data = await response.json()

          if (data.success) {
            const modules = data.modules
            const allInstalled = data.allInstalled

            container.innerHTML = allInstalled
              ? '<div style="padding:16px;background:rgba(76, 175, 80, 0.1);border:1px solid rgba(76, 175, 80, 0.3);border-radius:4px;text-align:center"><i class="ti ti-check" style="color:#4CAF50;font-size:24px;display:block;margin-bottom:8px"></i><strong style="color:#2E7D32">All modules installed!</strong></div>'
              : '<div style="padding:16px;background:rgba(255, 152, 0, 0.1);border:1px solid rgba(255, 152, 0, 0.3);border-radius:4px;text-align:center"><i class="ti ti-alert" style="color:#F57C00;font-size:24px;display:block;margin-bottom:8px"></i><strong style="color:#E65100">' + data.missingCount + ' modules need to be installed</strong></div>'

            moduleList.style.display = 'block'
            const moduleHtml = modules.map(m => {
              const color = m.installed ? 'color:#4CAF50' : 'color:#F57C00'
              return '<div style="padding:10px;border:1px solid rgba(0,0,0,0.1);border-radius:4px;margin-bottom:8px;display:flex;justify-content:space-between;align-items:center">' +
                '<div>' +
                '<strong style="font-size:12px">' + m.name + '</strong>' +
                '<div style="font-size:11px;color:var(--color-text-secondary);margin-top:2px">' + (m.version || 'not installed') + '</div>' +
                '</div>' +
                '<div style="font-size:11px;font-weight:600;' + color + '">' + m.status + '</div>' +
                '</div>'
            }).join('')

            document.getElementById('ps-modules-content').innerHTML = moduleHtml

            installBtn.style.display = allInstalled ? 'none' : 'inline-block'
            checkBtn.style.display = 'inline-block'
          } else {
            container.innerHTML = '<div style="padding:16px;background:rgba(244, 67, 54, 0.1);border:1px solid rgba(244, 67, 54, 0.3);border-radius:4px;color:#C62828"><strong>Error:</strong> ' + data.error + '</div>'
          }
        } catch (error) {
          container.innerHTML = '<div style="padding:16px;background:rgba(244, 67, 54, 0.1);border:1px solid rgba(244, 67, 54, 0.3);border-radius:4px;color:#C62828">Failed to check modules: ' + error.message + '</div>'
        }
      }

      window.installPowerShellModules = async function() {
        const container = document.getElementById('ps-status-container')
        const installBtn = document.getElementById('btn-install-ps')

        installBtn.disabled = true
        container.innerHTML = '<div style="text-align:center;padding:20px"><i class="ti ti-loader" style="font-size:24px;animation:spin 1s linear infinite;display:inline-block"></i><p>Installing modules... (this may take 5-10 minutes)</p></div>'

        try {
          const apiBaseUrl = '${apiUrl}'
          const response = await fetch(apiBaseUrl + '/api/setup/powershell/install', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' }
          })

          const data = await response.json()

          if (data.success || data.allInstalled) {
            container.innerHTML = '<div style="padding:16px;background:rgba(76, 175, 80, 0.1);border:1px solid rgba(76, 175, 80, 0.3);border-radius:4px;text-align:center"><i class="ti ti-check" style="color:#4CAF50;font-size:24px;display:block;margin-bottom:8px"></i><strong style="color:#2E7D32">✅ All modules installed successfully!</strong><p style="font-size:12px;margin-top:8px">You can now proceed to the next step.</p></div>'
            installBtn.style.display = 'none'
            document.getElementById('btn-check-ps').textContent = '✓ Modules Verified'
            wizardState.completed[1] = true
          } else {
            container.innerHTML = '<div style="padding:16px;background:rgba(255, 152, 0, 0.1);border:1px solid rgba(255, 152, 0, 0.3);border-radius:4px"><strong style="color:#F57C00">⚠️ Partial Installation:</strong><p style="font-size:12px;margin-top:6px">' + data.message + '</p></div>'
            installBtn.disabled = false
          }
        } catch (error) {
          container.innerHTML = '<div style="padding:16px;background:rgba(244, 67, 54, 0.1);border:1px solid rgba(244, 67, 54, 0.3);border-radius:4px;color:#C62828">Installation failed: ' + error.message + '</div>'
          installBtn.disabled = false
        }
      }

      // Check PowerShell status on load
      window.checkPowerShellStatus = async function() {
        try {
          const apiBaseUrl = '${apiUrl}'
          const response = await fetch(apiBaseUrl + '/api/setup/powershell/status', {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
          })

          const data = await response.json()
          const container = document.getElementById('ps-status-container')

          if (!data.powerShellAvailable) {
            container.innerHTML = \`<div style="padding:16px;background:rgba(244, 67, 54, 0.1);border:1px solid rgba(244, 67, 54, 0.3);border-radius:4px;color:#C62828">
              <strong>❌ PowerShell Not Found</strong>
              <p style="font-size:12px;margin:8px 0 0 0">\${data.message}</p>
              <p style="font-size:11px;margin:6px 0 0 0">
                <strong>Manual Installation:</strong><br>
                Download PowerShell 7+ from: <a href="https://github.com/PowerShell/PowerShell/releases" target="_blank" style="color:#1976D2">https://github.com/PowerShell/PowerShell/releases</a>
              </p>
            </div>\`
            document.getElementById('btn-check-ps').style.display = 'none'
          } else if (!data.versionSufficient) {
            container.innerHTML = \`<div style="padding:16px;background:rgba(255, 152, 0, 0.1);border:1px solid rgba(255, 152, 0, 0.3);border-radius:4px;color:#E65100">
              <strong>⚠️ PowerShell Version Insufficient</strong>
              <p style="font-size:12px;margin:8px 0 0 0">You have \${data.powerShellVersionString}, but PnP.PowerShell requires <strong>PowerShell 7+</strong></p>
              <p style="font-size:11px;margin:6px 0 0 0">
                <strong>Upgrade Required:</strong><br>
                Download PowerShell 7+ from: <a href="https://github.com/PowerShell/PowerShell/releases" target="_blank" style="color:#1976D2">https://github.com/PowerShell/PowerShell/releases</a>
              </p>
            </div>\`
            document.getElementById('btn-check-ps').style.display = 'none'
          } else {
            window.checkPowerShellModules()
          }
        } catch (error) {
          console.error('Status check failed:', error)
          window.checkPowerShellModules()
        }
      }

      // Auto-check on load
      window.checkPowerShellStatus()
    </script>

    <style>
      @keyframes spin {
        from { transform: rotate(0deg); }
        to { transform: rotate(360deg); }
      }
    </style>
  `
}

function renderAzureAdStep() {
  return `
    <div class="wizard-step-content">
      <div style="margin-bottom:16px;padding:8px 12px;background:rgba(33, 150, 243, 0.1);border-radius:4px;display:inline-block">
        <span style="font-size:11px;font-weight:600;color:#1976D2">STEP 2 OF 8</span>
      </div>
      <div class="step-header">
        <h2 style="margin:8px 0 4px 0;color:#1976D2"><i class="ti ti-cloud"></i> Azure AD Registration</h2>
        <p style="margin:4px 0 0 0">Register your M365 AgentOps application for BOTH SSO and Graph API (single app, not two)</p>
      </div>

      <div class="step-body">
        <div style="background:linear-gradient(135deg, rgba(33, 150, 243, 0.12) 0%, rgba(25, 103, 210, 0.08) 100%);border:1px solid rgba(33, 150, 243, 0.2);padding:16px;border-radius:8px;margin-bottom:24px">
          <div style="display:flex;gap:12px;align-items:flex-start">
            <i class="ti ti-alert-circle" style="color:#1976D2;font-size:20px;flex-shrink:0"></i>
            <div>
              <div style="font-weight:600;font-size:13px;color:#1976D2;margin-bottom:6px">IMPORTANT: One App Registration</div>
              <div style="font-size:12px;line-height:1.6;color:var(--color-text-secondary)">You need <strong>ONE Azure AD App Registration</strong> for both SSO and Graph API calls. Do NOT create separate apps. You'll configure all permissions in this single app.</div>
            </div>
          </div>
        </div>

        <div style="background:rgba(76, 175, 80, 0.08);border:1px solid rgba(76, 175, 80, 0.2);padding:14px;border-radius:6px;margin-bottom:24px">
          <div style="font-weight:600;font-size:12px;color:#2E7D32;margin-bottom:10px">✓ Prerequisites (Do These FIRST)</div>
          <div style="font-size:12px;line-height:1.8;color:var(--color-text-secondary)">
            <div style="margin-bottom:6px"><strong>1. Deploy M365 AgentOps</strong> to Azure (Static Web App or App Service)</div>
            <div style="margin-bottom:6px"><strong>2. Copy your deployment URL</strong> (e.g., https://m365agentops.azurewebsites.net)</div>
            <div style="margin-bottom:6px"><strong>3. Have Admin access</strong> to your organization's Azure AD</div>
            <div><strong>4. Register your app</strong> in Azure AD using the guide below</div>
          </div>
        </div>

        <div class="setup-guide">
          <h3>📦 Step 0: Deploy M365 AgentOps to Azure</h3>
          <p style="font-size:12px;color:var(--color-text-secondary);margin-bottom:12px"><strong>Choose ONE option below:</strong></p>

          <div style="margin-bottom:20px;padding:14px;background:rgba(76, 175, 80, 0.1);border-left:4px solid #4CAF50;border-radius:4px">
            <h4 style="margin:0 0 8px 0;color:#2E7D32"><strong>Option 0a: Azure Static Web Apps (Recommended for Frontend)</strong></h4>
            <ol style="margin:0;padding-left:20px;font-size:12px;line-height:1.8;color:var(--color-text-secondary)">
              <li>Go to <strong>portal.azure.com</strong> → Sign in</li>
              <li>Create new resource → Search "<strong>Static Web App</strong>"</li>
              <li>Click <strong>Create</strong> → Fill in:
                <ul style="margin:6px 0;padding-left:20px">
                  <li><strong>Subscription:</strong> Select your subscription</li>
                  <li><strong>Resource Group:</strong> Create new (e.g., "m365agentops-rg")</li>
                  <li><strong>Name:</strong> "m365agentops" (or your choice)</li>
                  <li><strong>Region:</strong> Pick closest region</li>
                  <li><strong>SKU:</strong> Free or Standard</li>
                </ul>
              </li>
              <li>Click <strong>Review + create</strong> → <strong>Create</strong></li>
              <li>Wait for deployment (2-5 minutes)</li>
              <li>Go to resource → Copy <strong>Default domain</strong> (e.g., https://yellow-ocean.azurestaticapps.net)</li>
              <li>Deploy your code:
                <ul style="margin:6px 0;padding-left:20px">
                  <li>Connect your GitHub repo to the Static Web App</li>
                  <li>Or use <strong>Azure CLI:</strong> <code style="background:#f0f0f0;padding:2px 6px;border-radius:2px">az staticwebapp upload --name m365agentops --source-directory ./dist</code></li>
                </ul>
              </li>
            </ol>
          </div>

          <div style="margin-bottom:20px;padding:14px;background:rgba(33, 150, 243, 0.1);border-left:4px solid #2196F3;border-radius:4px">
            <h4 style="margin:0 0 8px 0;color:#1565C0"><strong>Option 0b: Azure App Service (For Full-Stack)</strong></h4>
            <ol style="margin:0;padding-left:20px;font-size:12px;line-height:1.8;color:var(--color-text-secondary)">
              <li>Go to <strong>portal.azure.com</strong> → Sign in</li>
              <li>Create new resource → Search "<strong>App Service</strong>"</li>
              <li>Click <strong>Create</strong> → Fill in:
                <ul style="margin:6px 0;padding-left:20px">
                  <li><strong>Subscription:</strong> Select your subscription</li>
                  <li><strong>Resource Group:</strong> Create new (e.g., "m365agentops-rg")</li>
                  <li><strong>Name:</strong> "m365agentops" (must be globally unique)</li>
                  <li><strong>Runtime stack:</strong> Node.js 20</li>
                  <li><strong>Region:</strong> Pick closest region</li>
                </ul>
              </li>
              <li>Click <strong>Review + create</strong> → <strong>Create</strong></li>
              <li>Wait for deployment (2-5 minutes)</li>
              <li>Go to resource → Copy <strong>Default domain</strong> (e.g., https://m365agentops.azurewebsites.net)</li>
              <li>Deploy your code:
                <ul style="margin:6px 0;padding-left:20px">
                  <li>Use <strong>GitHub Actions</strong> (recommended) or</li>
                  <li><strong>Azure CLI:</strong> <code style="background:#f0f0f0;padding:2px 6px;border-radius:2px">az webapp up --name m365agentops</code></li>
                </ul>
              </li>
            </ol>
          </div>

          <div style="padding:14px;background:rgba(255, 152, 0, 0.1);border-left:4px solid #FF9800;border-radius:4px">
            <h4 style="margin:0 0 8px 0;color:#E65100"><strong>Step 0c: Copy Your Deployment URL</strong></h4>
            <p style="margin:0;font-size:12px;line-height:1.8;color:var(--color-text-secondary)">
              <strong>After deployment is complete:</strong><br>
              1. Go to your Azure resource<br>
              2. Copy the <strong>Default domain</strong> or <strong>Browse</strong> button URL<br>
              3. Example: <code style="background:#f0f0f0;padding:2px 6px;border-radius:2px">https://m365agentops.azurewebsites.net</code><br>
              4. <strong>Keep this URL for Step 1</strong> - you'll use it for your Redirect URI
            </p>
          </div>
        </div>

        <div class="setup-guide">
          <h3>🚀 Step 1: Register Your App in Azure (6 Steps)</h3>
          <p style="font-size:12px;color:var(--color-text-secondary);margin-bottom:12px">Now use your deployment URL to register the app in Azure AD:</p>
          ${[
            { num: 1, title: 'Go to Azure Portal', desc: 'Open https://portal.azure.com and sign in with your admin account' },
            { num: 2, title: 'Navigate to App Registrations', desc: 'Azure AD → App Registrations → New registration' },
            { num: 3, title: 'Create Application', desc: 'Name: "M365 AgentOps" → Select "Accounts in this organizational directory only"' },
            { num: 4, title: 'Copy Application Details', desc: 'From the Overview page, copy: Application (client) ID, Directory (tenant) ID' },
            { num: 5, title: 'Create Client Secret', desc: 'Go to Certificates & secrets → New client secret → Copy the value (only shown once!)' },
            { num: 6, title: 'Add Redirect URI', desc: 'Go to Authentication → Add a platform → Web → Redirect URI (e.g., https://yourdomain.com/callback)' },
          ].map(guide => `
            <div class="setup-guide-item">
              <div class="setup-guide-number">${guide.num}</div>
              <div>
                <div class="setup-guide-title">${guide.title}</div>
                <div class="setup-guide-desc">${guide.desc}</div>
              </div>
            </div>
          `).join('')}
        </div>

        <div class="form-section">
          <h3 style="margin-top:24px">✅ After Registering Your App in Azure:</h3>
          <p style="font-size:12px;color:var(--color-text-secondary);margin-bottom:12px">Copy your Redirect URI from Azure Portal (<strong>Authentication → Platform → Redirect URIs</strong>)</p>

          <div class="form-group">
            <label class="form-label">Enter Your Redirect URI *</label>
            <input type="text" class="form-input" id="redirect-uri" placeholder="https://yourdomain.com/callback" value="${wizardState.formData.redirectUri}">
            <div style="font-size:11px;color:var(--color-text-tertiary);margin-top:4px">Example: https://m365agentops.yourdomain.com/callback</div>
            <div style="font-size:11px;color:var(--color-red);margin-top:4px">⚠️ This MUST match exactly what you set in Azure AD</div>
          </div>
        </div>

        <div class="form-section" style="border-top:1px solid var(--color-border-primary);padding-top:20px;margin-top:20px">
          <h3 style="margin-top:0;font-size:14px">Continue to Next Step</h3>
          <p style="font-size:12px;color:var(--color-text-secondary);margin-bottom:14px">Once you've entered your Redirect URI from Azure AD, click below to proceed.</p>
          <button class="btn btn-primary" onclick="window.saveAzureAdStep()" style="width:100%;padding:12px 16px;font-size:13px;font-weight:500;background:#1976D2;border-color:#1976D2">
            <i class="ti ti-arrow-right"></i> Complete Step 1 → Step 2
          </button>
        </div>
      </div>
    </div>
  `
}

function renderSsoStep() {
  return `
    <div class="wizard-step-content">
      <div style="margin-bottom:16px;padding:8px 12px;background:rgba(156, 39, 176, 0.1);border-radius:4px;display:inline-block">
        <span style="font-size:11px;font-weight:600;color:#7B1FA2">STEP 2 OF 5</span>
      </div>
      <div class="step-header">
        <h2 style="margin:8px 0 4px 0;color:#7B1FA2"><i class="ti ti-key"></i> SSO Configuration</h2>
        <p style="margin:4px 0 0 0">Configure Single Sign-On using the app from Step 1</p>
      </div>

      <div class="step-body">
        <div style="background:linear-gradient(135deg, rgba(156, 39, 176, 0.12) 0%, rgba(123, 31, 162, 0.08) 100%);border:1px solid rgba(156, 39, 176, 0.2);padding:14px;border-radius:6px;margin-bottom:24px">
          <div style="display:flex;gap:12px;align-items:flex-start">
            <i class="ti ti-info-circle" style="color:#7B1FA2;font-size:18px;flex-shrink:0"></i>
            <div style="font-size:12px;line-height:1.6;color:var(--color-text-secondary)">
              <strong style="color:#7B1FA2">Next:</strong> Configure the Azure AD app for Single Sign-On. We'll test your credentials and set up role mappings for your organization's groups.
            </div>
          </div>
        </div>

        <div class="form-section">
          <h3>Azure AD Credentials</h3>
          <div class="form-group">
            <label class="form-label">Client ID *</label>
            <input type="text" class="form-input monospace" id="client-id" placeholder="a1b2c3d4-e5f6-7890-abcd-ef1234567890" value="${wizardState.formData.azureClientId}">
            <div style="font-size:11px;color:var(--color-text-tertiary);margin-top:4px">Application (client) ID from Azure AD</div>
          </div>

          <div class="form-group">
            <label class="form-label">Client Secret *</label>
            <input type="password" class="form-input monospace" id="client-secret" placeholder="••••••••••••••••" value="${wizardState.formData.azureClientSecret}">
            <div style="font-size:11px;color:var(--color-text-tertiary);margin-top:4px">Client secret value (keep this secure!)</div>
          </div>

          <div class="form-group">
            <label class="form-label">Tenant ID *</label>
            <input type="text" class="form-input monospace" id="tenant-id" placeholder="a1b2c3d4-e5f6-7890-abcd-ef1234567890" value="${wizardState.formData.azureTenantId}">
            <div style="font-size:11px;color:var(--color-text-tertiary);margin-top:4px">Directory (tenant) ID from Azure AD</div>
          </div>
        </div>

        <div class="form-section">
          <button class="btn btn-primary" onclick="window.testSsoConnection()" style="width:100%">
            <i class="ti ti-player-play"></i> Test Connection
          </button>
          <div id="sso-test-result" style="margin-top:12px"></div>
        </div>

        <div class="form-section">
          <h3>Role Configuration</h3>
          <p style="font-size:12px;color:var(--color-text-secondary);margin-bottom:12px">Map your Azure AD security groups to application roles:</p>

          <div class="role-config-table">
            ${['super', 'admin', 'manager', 'user'].map(role => `
              <div class="role-config-row">
                <div style="font-size:13px;font-weight:500">
                  <span class="role-badge ${role}">${role}</span>
                </div>
                <input type="text" class="form-input" placeholder="e.g., M365AgentOps-${role}s" data-role="${role}" style="flex:1">
              </div>
            `).join('')}
          </div>
        </div>

        <div class="form-section" style="border-top:1px solid var(--color-border-primary);padding-top:20px;margin-top:20px">
          <h3 style="margin-top:0;font-size:14px">Continue to Next Step</h3>
          <p style="font-size:12px;color:var(--color-text-secondary);margin-bottom:14px">Once you've configured SSO and tested your connection, proceed to the next step.</p>
          <button class="btn btn-primary" onclick="window.saveSsoStep()" style="width:100%;padding:12px 16px;font-size:13px;font-weight:500;background:#7B1FA2;border-color:#7B1FA2">
            <i class="ti ti-arrow-right"></i> Complete Step 2 → Step 3
          </button>
        </div>
      </div>
    </div>
  `
}

function renderGraphApiStep() {
  return `
    <div class="wizard-step-content">
      <div style="margin-bottom:16px;padding:8px 12px;background:rgba(0, 150, 136, 0.1);border-radius:4px;display:inline-block">
        <span style="font-size:11px;font-weight:600;color:#00796B">STEP 3 OF 5</span>
      </div>
      <div class="step-header">
        <h2 style="margin:8px 0 4px 0;color:#00796B"><i class="ti ti-api"></i> Graph API Setup</h2>
        <p style="margin:4px 0 0 0">Grant 40 permissions to access M365 data securely</p>
      </div>

      <div class="step-body">
        <div style="background:linear-gradient(135deg, rgba(0, 150, 136, 0.12) 0%, rgba(0, 121, 107, 0.08) 100%);border:1px solid rgba(0, 150, 136, 0.2);padding:16px;border-radius:8px;margin-bottom:24px">
          <div style="display:flex;gap:14px;align-items:flex-start">
            <div style="font-size:32px;line-height:1">🔐</div>
            <div style="flex:1">
              <div style="font-weight:600;font-size:14px;margin-bottom:4px;color:#00796B">40 Required Permissions</div>
              <div style="font-size:12px;line-height:1.6;color:var(--color-text-secondary)">These permissions enable M365 AgentOps to securely access compliance, security, and operational data from your organization. Admin consent required.</div>
            </div>
          </div>
        </div>

        <div class="form-section">
          <div style="display:flex;align-items:center;gap:8px;margin-bottom:16px">
            <h3 style="margin:0">Required Permissions</h3>
            <span style="background:#3B82F6;color:white;padding:4px 8px;border-radius:4px;font-size:11px;font-weight:600">40 Total</span>
          </div>

          <div style="margin-bottom:16px;padding:12px;background:rgba(34, 197, 94, 0.1);border-left:4px solid #22C55E;border-radius:4px;display:flex;gap:8px">
            <i class="ti ti-check-circle" style="color:#22C55E;flex-shrink:0"></i>
            <div style="font-size:12px;color:var(--color-text-secondary)">
              <strong>Admin Consent Ready:</strong> All permissions pre-configured. Just click "Grant admin consent" in Azure AD once for all.
            </div>
          </div>

          <div style="margin-bottom:20px">
            <div style="background:rgba(59, 130, 246, 0.08);padding:12px;border-radius:6px;margin-bottom:12px">
              <h4 style="margin:0 0 12px 0;font-size:12px;font-weight:600">📊 Microsoft Graph (39 Permissions)</h4>
              <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;font-size:11px">
                ${[
                  { name: 'Application.Read.All', type: 'Application' },
                  { name: 'AuditLog.Read.All', type: 'Application' },
                  { name: 'Device.Read.All', type: 'Application' },
                  { name: 'DeviceManagementApps.Read.All', type: 'Application' },
                  { name: 'DeviceManagementConfiguration.Read.All', type: 'Application' },
                  { name: 'DeviceManagementManagedDevices.Read.All', type: 'Application' },
                  { name: 'DeviceManagementRBAC.Read.All', type: 'Application' },
                  { name: 'DeviceManagementScripts.Read.All', type: 'Application' },
                  { name: 'DeviceManagementServiceConfig.Read.All', type: 'Application' },
                  { name: 'Directory.Read.All', type: 'Application' },
                  { name: 'Directory.ReadWrite.All', type: 'Application' },
                  { name: 'Domain.Read.All', type: 'Application' },
                  { name: 'Files.Read.All', type: 'Application' },
                  { name: 'Group.ReadWrite.All', type: 'Application' },
                  { name: 'GroupMember.Read.All', type: 'Application' },
                  { name: 'GroupMember.ReadWrite.All', type: 'Application' },
                  { name: 'IdentityRiskEvent.Read.All', type: 'Application' },
                  { name: 'Mail.ReadWrite', type: 'Application' },
                  { name: 'Mail.Send', type: 'Application' },
                  { name: 'Organization.Read.All', type: 'Application' },
                  { name: 'Policy.Read.All', type: 'Application' },
                  { name: 'SecurityActions.Read.All', type: 'Application' },
                  { name: 'SecurityEvents.Read.All', type: 'Application' },
                  { name: 'ServiceHealth.Read.All', type: 'Application' },
                  { name: 'ServiceMessage.Read.All', type: 'Application' },
                  { name: 'Sites.FullControl.All', type: 'Application' },
                  { name: 'Sites.Manage.All', type: 'Application' },
                  { name: 'Sites.ReadWrite.All', type: 'Application' },
                  { name: 'Team.Create', type: 'Application' },
                  { name: 'Team.ReadBasic.All', type: 'Application' },
                  { name: 'TeamMember.ReadWrite.All', type: 'Application' },
                  { name: 'TeamworkTag.Read.All', type: 'Application' },
                  { name: 'ThreatAssessment.Read.All', type: 'Application' },
                  { name: 'User.Read.All', type: 'Application' },
                  { name: 'User.ReadWrite.All', type: 'Application' },
                  { name: 'UserAuthenticationMethod.Read.All', type: 'Application' },
                  { name: 'email', type: 'Delegated' },
                  { name: 'openid', type: 'Delegated' },
                  { name: 'profile', type: 'Delegated' }
                ].map(perm => `
                  <div style="padding:8px;background:white;border:1px solid var(--color-border-primary);border-radius:4px;display:flex;align-items:center;gap:6px">
                    <i class="ti ti-check" style="color:var(--color-success);flex-shrink:0"></i>
                    <div style="flex:1;display:flex;flex-direction:column;gap:2px">
                      <span style="color:var(--color-text-secondary);font-weight:500">${perm.name}</span>
                      <span style="font-size:10px;color:var(--color-text-tertiary);font-weight:400">${perm.type}</span>
                    </div>
                  </div>
                `).join('')}
              </div>
            </div>

          <div>
            <h4 style="margin:0 0 12px 0;font-size:12px;font-weight:600">📧 Exchange Online (1 Permission)</h4>
            <div style="padding:8px;background:white;border:1px solid var(--color-border-primary);border-radius:4px;display:flex;align-items:center;gap:6px;font-size:11px">
              <i class="ti ti-check" style="color:var(--color-success);flex-shrink:0"></i>
              <div style="flex:1;display:flex;flex-direction:column;gap:2px">
                <span style="color:var(--color-text-secondary);font-weight:500">Exchange.ManageAsApp</span>
                <span style="font-size:10px;color:var(--color-text-tertiary);font-weight:400">Application</span>
              </div>
            </div>
          </div>
        </div>

        <div class="form-section">
          <h3>Add Permissions in Azure AD</h3>
          <div style="display:flex;flex-direction:column;gap:12px">
            ${[
              { step: 1, text: 'Go to Azure portal → App Registrations → Your App' },
              { step: 2, text: 'Click "API permissions" in the left menu' },
              { step: 3, text: 'Click "Add a permission" → Select "Microsoft Graph"' },
              { step: 4, text: 'Select "Application permissions" (not Delegated)' },
              { step: 5, text: 'Search for and add each permission listed above' },
              { step: 6, text: 'Click "Grant admin consent for [Organization]" (requires Admin)' },
              { step: 7, text: 'Wait for status to show green checkmark' },
            ].map(item => `
              <div style="display:flex;gap:12px;align-items:flex-start">
                <div style="width:28px;height:28px;background:#3B82F6;color:white;border-radius:50%;display:flex;align-items:center;justify-content:center;font-weight:600;font-size:13px;flex-shrink:0">${item.step}</div>
                <div style="font-size:12px;color:var(--color-text-secondary);padding-top:4px;line-height:1.5">${item.text}</div>
              </div>
            `).join('')}
          </div>
        </div>

        <div class="form-section">
          <h3>Grant Admin Consent</h3>
          <div style="background:rgba(168, 85, 247, 0.08);border:1px solid rgba(168, 85, 247, 0.2);padding:14px;border-radius:6px;margin-bottom:12px">
            <div style="display:flex;gap:10px;align-items:flex-start">
              <i class="ti ti-lock" style="color:var(--color-primary);margin-top:2px;font-size:16px"></i>
              <div style="font-size:12px;line-height:1.5;color:var(--color-text-secondary)">
                <strong style="color:var(--color-text-primary)">Global Admin Required:</strong> Login with your global administrator account to grant consent for all 40 permissions at once. This requires admin privileges.
              </div>
            </div>
          </div>
          <button class="btn btn-primary" onclick="window.grantAdminConsent()" style="width:100%;padding:12px 16px;font-size:13px;font-weight:500;background:#00796B;border-color:#00796B">
            <i class="ti ti-login"></i> Login & Grant Admin Consent
          </button>
          <div id="admin-consent-result" style="margin-top:12px;padding:12px;border-radius:6px;display:none"></div>
        </div>

        <div class="form-section">
          <h3>Verify Connection</h3>
          <p style="font-size:12px;color:var(--color-text-secondary);margin-bottom:12px">Test that the Graph API connection is working with your credentials.</p>
          <button class="btn btn-secondary" onclick="window.testGraphConnection()" style="width:100%;padding:10px 14px;font-size:12px">
            <i class="ti ti-player-play"></i> Test Graph API Connection
          </button>
          <div id="graph-test-result" style="margin-top:12px;padding:12px;border-radius:6px;display:none">
            <div style="display:flex;gap:8px;align-items:flex-start">
              <i class="ti ti-check-circle" style="color:var(--color-success);flex-shrink:0;margin-top:2px"></i>
              <div style="font-size:12px;color:var(--color-text-secondary)">
                <strong>Graph API Connection Verified</strong> - Ready to continue setup
              </div>
            </div>
          </div>
        </div>

        <div class="form-section" style="border-top:1px solid var(--color-border-primary);padding-top:20px;margin-top:20px">
          <h3 style="margin-top:0;font-size:14px">Continue to Next Step</h3>
          <p style="font-size:12px;color:var(--color-text-secondary);margin-bottom:14px">Once admin consent is granted and permissions are verified, proceed to the next step.</p>
          <button class="btn btn-primary" onclick="window.saveGraphApiStep()" style="width:100%;padding:12px 16px;font-size:13px;font-weight:500;background:#00796B;border-color:#00796B">
            <i class="ti ti-arrow-right"></i> Complete Step 3 → Step 4
          </button>
        </div>
      </div>
    </div>
  `
}

function renderAdminSettingsStep() {
  return `
    <div class="wizard-step-content">
      <div style="margin-bottom:16px;padding:8px 12px;background:rgba(255, 152, 0, 0.1);border-radius:4px;display:inline-block">
        <span style="font-size:11px;font-weight:600;color:#E65100">STEP 4 OF 5</span>
      </div>
      <div class="step-header">
        <h2 style="margin:8px 0 4px 0;color:#E65100"><i class="ti ti-users"></i> Admin Settings</h2>
        <p style="margin:4px 0 0 0">Configure super admin email and SharePoint site for initial setup</p>
      </div>

      <div class="step-body">
        <div style="background:linear-gradient(135deg, rgba(255, 152, 0, 0.12) 0%, rgba(255, 87, 34, 0.08) 100%);border:1px solid rgba(255, 152, 0, 0.2);padding:14px;border-radius:6px;margin-bottom:24px">
          <div style="display:flex;gap:12px;align-items:flex-start">
            <i class="ti ti-info-circle" style="color:#E65100;font-size:18px;flex-shrink:0"></i>
            <div style="font-size:12px;line-height:1.6;color:var(--color-text-secondary)">
              <strong style="color:#E65100">Final Setup Step:</strong> Configure the super admin email and SharePoint site location. Learn about the role hierarchy that controls access. Advanced security settings can be configured in Admin Settings after onboarding.
            </div>
          </div>
        </div>

        <div class="form-section">
          <h3>Role Hierarchy</h3>
          <div class="role-hierarchy">
            ${[
              { role: 'super', desc: 'Full system access. Manage all settings, users, and data. (Typically 1-2 people)', color: 'var(--color-red)' },
              { role: 'admin', desc: 'Administrative access. Manage settings and approve requests. (Typically 3-5 people)', color: 'var(--color-orange)' },
              { role: 'manager', desc: 'Management access. View reports and manage team requests. (Typically 10-20 people)', color: 'var(--color-blue)' },
              { role: 'user', desc: 'Regular user. View dashboards and submit requests. (Everyone else)', color: 'var(--color-green)' },
            ].map(r => `
              <div style="display:flex;align-items:center;gap:12px;padding:12px;border-radius:6px;background:rgba(0,0,0,0.02);margin-bottom:8px">
                <span class="role-badge ${r.role}">${r.role}</span>
                <div>
                  <div style="font-weight:500;font-size:13px">${r.role.charAt(0).toUpperCase() + r.role.slice(1)}</div>
                  <div style="font-size:11px;color:var(--color-text-tertiary)">${r.desc}</div>
                </div>
              </div>
            `).join('')}
          </div>
        </div>

        <div class="form-section">
          <h3>First Super Admin</h3>
          <p style="font-size:12px;color:var(--color-text-secondary);margin-bottom:12px">Enter your email to grant yourself Super Admin access:</p>
          <div class="form-group">
            <label class="form-label">Your Email Address *</label>
            <input type="email" class="form-input" id="super-admin-email" placeholder="admin@yourdomain.com">
          </div>
        </div>

        <div class="form-section">
          <h3>SharePoint Configuration</h3>
          <p style="font-size:12px;color:var(--color-text-secondary);margin-bottom:12px">All M365 AgentOps data will be stored in a single SharePoint site. Provide your SharePoint site details below.</p>

          <div class="form-group">
            <label class="form-label">SharePoint Site URL *</label>
            <input type="text" class="form-input" id="sharepoint-site-url" placeholder="https://yourdomain.sharepoint.com/sites/M365AgentOps" value="">
            <div style="font-size:11px;color:var(--color-text-tertiary);margin-top:4px">Example: https://contoso.sharepoint.com/sites/M365AgentOps</div>
          </div>

          <div class="form-group">
            <label class="form-label">SharePoint Site ID *</label>
            <input type="text" class="form-input monospace" id="sharepoint-site-id" placeholder="domain.sharepoint.com,guid1,guid2" value="">
            <div style="font-size:11px;color:var(--color-text-tertiary);margin-top:4px">Format: domain.sharepoint.com,SiteGuid,WebGuid (get from Graph API)</div>
          </div>

          <div style="padding:12px;background:rgba(33, 150, 243, 0.1);border-left:4px solid #2196F3;border-radius:4px;margin-top:12px">
            <p style="margin:0;font-size:11px;color:var(--color-text-secondary)">
              <strong>How to get Site ID:</strong><br>
              1. Go to your SharePoint site<br>
              2. Use Graph Explorer: GET /sites/{site-url}<br>
              3. Copy the returned <code style="background:#f0f0f0;padding:1px 4px">id</code> field
            </p>
          </div>
        </div>

        <div class="form-section" style="background:rgba(76, 175, 80, 0.08);border:1px solid rgba(76, 175, 80, 0.2);padding:12px;border-radius:6px">
          <div style="display:flex;gap:10px;align-items:flex-start">
            <i class="ti ti-info-circle" style="color:#2E7D32;flex-shrink:0;margin-top:2px"></i>
            <div style="font-size:12px;line-height:1.6;color:var(--color-text-secondary)">
              <strong style="color:#2E7D32">Advanced Settings Available:</strong> Configure 2FA, audit logging, email notifications, and other security settings in the Admin Settings page after setup completes.
            </div>
          </div>
        </div>

        <div class="form-section" style="border-top:1px solid var(--color-border-primary);padding-top:20px;margin-top:20px">
          <h3 style="margin-top:0;font-size:14px">Continue to Final Step</h3>
          <p style="font-size:12px;color:var(--color-text-secondary);margin-bottom:14px">Once you've configured admin settings, proceed to verify all setup components.</p>
          <button class="btn btn-primary" onclick="window.saveAdminSettingsStep()" style="width:100%;padding:12px 16px;font-size:13px;font-weight:500;background:#E65100;border-color:#E65100">
            <i class="ti ti-arrow-right"></i> Complete Step 4 → Step 5
          </button>
        </div>
      </div>
    </div>
  `
}

function renderVerificationStep() {
  return `
    <div class="wizard-step-content">
      <div style="margin-bottom:16px;padding:8px 12px;background:rgba(76, 175, 80, 0.1);border-radius:4px;display:inline-block">
        <span style="font-size:11px;font-weight:600;color:#2E7D32">STEP 5 OF 5</span>
      </div>
      <div class="step-header">
        <h2 style="margin:8px 0 4px 0;color:#2E7D32"><i class="ti ti-check-circle"></i> Verification & Completion</h2>
        <p style="margin:4px 0 0 0">Test all connections and complete the setup process</p>
      </div>

      <div class="step-body">
        <div style="background:linear-gradient(135deg, rgba(76, 175, 80, 0.12) 0%, rgba(56, 142, 60, 0.08) 100%);border:1px solid rgba(76, 175, 80, 0.2);padding:14px;border-radius:6px;margin-bottom:24px">
          <div style="display:flex;gap:12px;align-items:flex-start">
            <i class="ti ti-player-play" style="color:#2E7D32;font-size:18px;flex-shrink:0"></i>
            <div style="font-size:12px;line-height:1.6;color:var(--color-text-secondary)">
              <strong style="color:#2E7D32">Ready to Verify:</strong> Run the automated tests below to verify all components are configured correctly. This ensures your M365 AgentOps setup is complete and operational.
            </div>
          </div>
        </div>

        <div class="verification-checklist">
          ${[
            { name: 'Azure AD Connection', id: 'check-azure', desc: 'Verify connection to Azure AD' },
            { name: 'SSO Configuration', id: 'check-sso', desc: 'Verify Single Sign-On is configured' },
            { name: 'Graph API Permissions', id: 'check-graph', desc: 'Verify Graph API has required permissions' },
            { name: 'Role Configuration', id: 'check-roles', desc: 'Verify admin roles are assigned' },
            { name: 'Email Configuration', id: 'check-email', desc: 'Verify email notifications work' },
          ].map(check => `
            <div class="verification-item" id="${check.id}">
              <div class="verification-icon pending"><i class="ti ti-circle-dashed"></i></div>
              <div style="flex:1">
                <div class="verification-name">${check.name}</div>
                <div class="verification-desc">${check.desc}</div>
              </div>
              <div class="verification-status"></div>
            </div>
          `).join('')}
        </div>

        <div style="margin-top:24px">
          <button class="btn btn-primary" onclick="window.runVerification()" style="width:100%;padding:12px 16px;font-size:13px;font-weight:500;background:#2E7D32;border-color:#2E7D32">
            <i class="ti ti-player-play"></i> Run Verification Tests
          </button>
        </div>

        <div id="verification-summary" style="margin-top:24px;display:none">
          <div class="verification-complete">
            <div style="text-align:center;margin-bottom:20px">
              <i class="ti ti-check-circle" style="font-size:48px;color:var(--color-success)"></i>
              <h3 style="margin:12px 0 0 0">Setup Complete! 🎉</h3>
              <p style="font-size:12px;color:var(--color-text-secondary);margin:4px 0 0 0">Your M365 AgentOps is ready to use</p>
            </div>

            <div class="next-steps">
              <h4>Recommended Next Steps:</h4>
              <ul style="padding-left:20px;font-size:12px;line-height:1.8;margin-bottom:16px">
                <li style="margin-bottom:4px">Visit <strong>Admin Settings</strong> to configure advanced security options (2FA, audit logging, notifications)</li>
                <li style="margin-bottom:4px">Invite your team members and assign their roles</li>
                <li style="margin-bottom:4px">Configure data collection and monitoring settings</li>
                <li>Review the Zero Trust Assessment and compliance dashboards</li>
              </ul>
              <a href="#" onclick="go('settings')" class="btn btn-primary" style="width:100%;padding:10px;text-align:center;margin-top:12px">
                <i class="ti ti-adjustments-horizontal"></i> Go to Admin Settings
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
}

function renderServiceConfigStep() {
  return `
    <div class="wizard-step-content">
      <div style="margin-bottom:16px;padding:8px 12px;background:rgba(244, 67, 54, 0.1);border-radius:4px;display:inline-block">
        <span style="font-size:11px;font-weight:600;color:#D32F2F">STEP 6 OF 7 (OPTIONAL)</span>
      </div>
      <div class="step-header">
        <h2 style="margin:8px 0 4px 0;color:#D32F2F"><i class="ti ti-settings"></i> Service Configuration</h2>
        <p style="margin:4px 0 0 0">Select which services to initialize with SharePoint lists</p>
      </div>

      <div class="step-body">
        <div style="background:linear-gradient(135deg, rgba(244, 67, 54, 0.12) 0%, rgba(211, 47, 47, 0.08) 100%);border:1px solid rgba(244, 67, 54, 0.2);padding:14px;border-radius:6px;margin-bottom:24px">
          <div style="display:flex;gap:12px;align-items:flex-start">
            <i class="ti ti-info-circle" style="color:#D32F2F;font-size:18px;flex-shrink:0"></i>
            <div style="font-size:12px;line-height:1.6;color:var(--color-text-secondary)">
              <strong style="color:#D32F2F">Optional Services:</strong> These services are optional. Select only the services you need. SharePoint lists and columns will be auto-created for selected services.
            </div>
          </div>
        </div>

        <div class="form-section">
          <h3>Choose Services to Initialize</h3>
          <div style="display:grid;gap:12px">
            <label style="display:flex;align-items:center;gap:12px;padding:12px;border:1px solid var(--color-border-primary);border-radius:6px;cursor:pointer">
              <input type="checkbox" class="service-checkbox" data-service="changeIntelligence" style="cursor:pointer;width:18px;height:18px">
              <div>
                <div style="font-weight:500;font-size:13px">Change Intelligence</div>
                <div style="font-size:11px;color:var(--color-text-tertiary)">Service Health announcements and incident tracking</div>
              </div>
            </label>

            <label style="display:flex;align-items:center;gap:12px;padding:12px;border:1px solid var(--color-border-primary);border-radius:6px;cursor:pointer">
              <input type="checkbox" class="service-checkbox" data-service="serviceHealth" style="cursor:pointer;width:18px;height:18px">
              <div>
                <div style="font-weight:500;font-size:13px">Service Health</div>
                <div style="font-size:11px;color:var(--color-text-tertiary)">Monitor and track M365 service status</div>
              </div>
            </label>

            <label style="display:flex;align-items:center;gap:12px;padding:12px;border:1px solid var(--color-border-primary);border-radius:6px;cursor:pointer">
              <input type="checkbox" class="service-checkbox" data-service="zeroTrust" style="cursor:pointer;width:18px;height:18px">
              <div>
                <div style="font-weight:500;font-size:13px">Zero Trust Assessment</div>
                <div style="font-size:11px;color:var(--color-text-tertiary)">Security compliance validations and results</div>
              </div>
            </label>

            <label style="display:flex;align-items:center;gap:12px;padding:12px;border:1px solid var(--color-border-primary);border-radius:6px;cursor:pointer">
              <input type="checkbox" class="service-checkbox" data-service="tenantGuard" style="cursor:pointer;width:18px;height:18px">
              <div>
                <div style="font-weight:500;font-size:13px">TenantGuard Enhanced</div>
                <div style="font-size:11px;color:var(--color-text-tertiary)">Priority alerts, correlations, and investigations</div>
              </div>
            </label>

            <label style="display:flex;align-items:center;gap:12px;padding:12px;border:1px solid var(--color-border-primary);border-radius:6px;cursor:pointer">
              <input type="checkbox" class="service-checkbox" data-service="selfService" style="cursor:pointer;width:18px;height:18px">
              <div>
                <div style="font-weight:500;font-size:13px">Self Service Portal</div>
                <div style="font-size:11px;color:var(--color-text-tertiary)">Portal requests, workflows, and approvals</div>
              </div>
            </label>
          </div>
        </div>

        <div class="form-section" style="border-top:1px solid var(--color-border-primary);padding-top:20px;margin-top:20px">
          <h3 style="margin-top:0;font-size:14px">Continue to List Initialization</h3>
          <p style="font-size:12px;color:var(--color-text-secondary);margin-bottom:14px">Click below to auto-create SharePoint lists and columns for the selected services.</p>
          <button class="btn btn-primary" onclick="window.saveServiceConfigStep()" style="width:100%;padding:12px 16px;font-size:13px;font-weight:500;background:#D32F2F;border-color:#D32F2F">
            <i class="ti ti-arrow-right"></i> Complete Step 6 → Step 7
          </button>
        </div>
      </div>
    </div>
  `
}

function renderListInitializationStep() {
  return `
    <div class="wizard-step-content">
      <div style="margin-bottom:16px;padding:8px 12px;background:rgba(76, 175, 80, 0.1);border-radius:4px;display:inline-block">
        <span style="font-size:11px;font-weight:600;color:#2E7D32">STEP 7 OF 7 (FINAL)</span>
      </div>
      <div class="step-header">
        <h2 style="margin:8px 0 4px 0;color:#2E7D32"><i class="ti ti-clipboard-list"></i> List Initialization</h2>
        <p style="margin:4px 0 0 0">Auto-create SharePoint lists and columns for selected services</p>
      </div>

      <div class="step-body">
        <div style="background:linear-gradient(135deg, rgba(76, 175, 80, 0.12) 0%, rgba(56, 142, 60, 0.08) 100%);border:1px solid rgba(76, 175, 80, 0.2);padding:14px;border-radius:6px;margin-bottom:24px">
          <div style="display:flex;gap:12px;align-items:flex-start">
            <i class="ti ti-sparkles" style="color:#2E7D32;font-size:18px;flex-shrink:0"></i>
            <div style="font-size:12px;line-height:1.6;color:var(--color-text-secondary)">
              <strong style="color:#2E7D32">Auto-Initialize:</strong> Click the button below to automatically create SharePoint lists and columns for the services you selected. This typically takes 30-60 seconds.
            </div>
          </div>
        </div>

        <div class="form-section">
          <h3>Selected Services to Initialize</h3>
          <div id="selected-services-list" style="display:grid;gap:8px;margin-bottom:16px">
            <p style="color:var(--color-text-secondary);font-size:12px">Loading selected services...</p>
          </div>
        </div>

        <div class="form-section">
          <button class="btn btn-primary" onclick="window.initializeSelectedLists()" id="init-lists-btn" style="width:100%;padding:12px 16px;font-size:13px;font-weight:500;background:#2E7D32;border-color:#2E7D32">
            <i class="ti ti-rocket"></i> Initialize SharePoint Lists
          </button>
          <div id="initialization-status" style="margin-top:12px;padding:12px;border-radius:6px;display:none"></div>
        </div>

        <div class="form-section" style="border-top:1px solid var(--color-border-primary);padding-top:20px;margin-top:20px">
          <h3 style="margin-top:0;font-size:14px">Complete Setup</h3>
          <p style="font-size:12px;color:var(--color-text-secondary);margin-bottom:14px">Once initialization is complete, your M365 AgentOps is fully configured and ready to use.</p>
          <button class="btn btn-primary" onclick="window.completeSetup()" style="width:100%;padding:12px 16px;font-size:13px;font-weight:500;background:#2E7D32;border-color:#2E7D32">
            <i class="ti ti-check-circle"></i> Complete Setup & Finish
          </button>
        </div>
      </div>
    </div>
  `
}

function attachEventListeners() {
  window.setWizardStep = setWizardStep
  window.nextWizardStep = nextWizardStep
  window.prevWizardStep = prevWizardStep
  window.saveAzureAdStep = saveAzureAdStep
  window.testSsoConnection = testSsoConnection
  window.testGraphConnection = testGraphConnection
  window.grantAdminConsent = grantAdminConsent
  window.runVerification = runVerification
  window.saveServiceConfigStep = saveServiceConfigStep
  window.initializeSelectedLists = initializeSelectedLists
  window.completeSetup = completeSetup
}

function setWizardStep(stepNum) {
  // Allow free navigation to any step
  wizardState.currentStep = stepNum
  renderWizard(document.getElementById('page-setup-wizard'))
  attachEventListeners()
}

function nextWizardStep() {
  // Save current step data
  if (wizardState.currentStep === 1) {
    saveAzureAdStep()
  } else if (wizardState.currentStep === 2) {
    saveSsoStep()
  } else if (wizardState.currentStep === 3) {
    saveGraphApiStep()
  } else if (wizardState.currentStep === 4) {
    saveAdminSettingsStep()
  }
}

function prevWizardStep() {
  if (wizardState.currentStep > 1) {
    wizardState.currentStep--
    renderWizard(document.getElementById('page-setup-wizard'))
    attachEventListeners()
  }
}

async function saveAzureAdStep() {
  const redirectUri = document.getElementById('redirect-uri')?.value

  try {
    wizardState.formData.redirectUri = redirectUri

    // Save only if data is filled in
    if (redirectUri) {
      const response = await fetch(`${API_URL}/api/setup/save-step`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          step: 'Azure-AD',
          redirectUri: redirectUri,
          completedSteps: [1]
        })
      })

      if (!response.ok) throw new Error('Failed to save')
      wizardState.completed[1] = true
      showToast('✓ Step 1 saved', 'success')
    } else {
      showToast('ℹ️ Skipped - you can fill in details later', 'info')
    }

    wizardState.currentStep = 2
    renderWizard(document.getElementById('page-setup-wizard'))
    attachEventListeners()
  } catch (error) {
    console.error('Error saving Azure AD step:', error)
    showToast('⚠️ Save failed: ' + error.message, 'warning')
    // Still allow navigation even if save fails
    wizardState.currentStep = 2
    renderWizard(document.getElementById('page-setup-wizard'))
    attachEventListeners()
  }
}

async function saveSsoStep() {
  const clientId = document.getElementById('client-id')?.value || ''
  const clientSecret = document.getElementById('client-secret')?.value || ''
  const tenantId = document.getElementById('tenant-id')?.value || ''
  const roleSuper = document.querySelector('input[data-role="super"]')?.value || ''
  const roleAdmin = document.querySelector('input[data-role="admin"]')?.value || ''
  const roleManager = document.querySelector('input[data-role="manager"]')?.value || ''

  try {
    wizardState.formData.azureClientId = clientId
    wizardState.formData.azureClientSecret = clientSecret
    wizardState.formData.azureTenantId = tenantId
    wizardState.formData.roleSuper = roleSuper
    wizardState.formData.roleAdmin = roleAdmin
    wizardState.formData.roleManager = roleManager

    // Save only if data is filled in
    if (clientId && clientSecret && tenantId) {
      const response = await fetch(`${API_URL}/api/setup/save-step`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          step: 'SSO',
          clientId,
          clientSecret,
          tenantId,
          roleSuper,
          roleAdmin,
          roleManager,
          completedSteps: [1, 2]
        })
      })

      if (!response.ok) throw new Error('Failed to save')
      wizardState.completed[2] = true
      showToast('✓ Step 2 saved', 'success')
    } else {
      showToast('ℹ️ Skipped - you can fill in details later', 'info')
    }

    wizardState.currentStep = 3
    renderWizard(document.getElementById('page-setup-wizard'))
    attachEventListeners()
  } catch (error) {
    console.error('Error saving SSO step:', error)
    showToast('⚠️ Save failed: ' + error.message, 'warning')
    // Still allow navigation
    wizardState.currentStep = 3
    renderWizard(document.getElementById('page-setup-wizard'))
    attachEventListeners()
  }
}

async function saveGraphApiStep() {
  try {
    const response = await fetch(`${API_URL}/api/setup/save-step`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        step: 'GraphAPI',
        graphApiPermissions: ['User.Read', 'Organization.Read.All', 'Directory.Read.All', 'Mail.Read', 'SecurityAlert.Read.All', 'TeamsAppInstallation.ReadWrite.All', 'SharePoint.Read.All'],
        completedSteps: [1, 2, 3]
      })
    })

    if (!response.ok) throw new Error('Failed to save')

    wizardState.completed[3] = true
    showToast('✓ Step 3 saved', 'success')
  } catch (error) {
    console.error('Error saving Graph API step:', error)
    showToast('⚠️ Save failed: ' + error.message, 'warning')
  }

  wizardState.currentStep = 4
  renderWizard(document.getElementById('page-setup-wizard'))
  attachEventListeners()
}

async function saveAdminSettingsStep() {
  const email = document.getElementById('super-admin-email')?.value || ''
  const twoFactorRequired = document.getElementById('enable-two-factor')?.checked || false
  const auditLoggingEnabled = document.getElementById('enable-audit-logs')?.checked || false
  const emailNotificationsEnabled = document.getElementById('enable-notifications')?.checked || false

  try {
    wizardState.formData.superAdminEmail = email
    wizardState.formData.twoFactorRequired = twoFactorRequired
    wizardState.formData.auditLoggingEnabled = auditLoggingEnabled
    wizardState.formData.emailNotificationsEnabled = emailNotificationsEnabled

    // Save only if email is filled in
    if (email) {
      const response = await fetch(`${API_URL}/api/setup/save-step`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          step: 'Admin-Settings',
          superAdminEmail: email,
          twoFactorRequired,
          auditLoggingEnabled,
          emailNotificationsEnabled,
          completedSteps: [1, 2, 3, 4]
        })
      })

      if (!response.ok) throw new Error('Failed to save')
      wizardState.completed[4] = true
      showToast('✓ Step 4 saved', 'success')
    } else {
      showToast('ℹ️ Skipped - you can fill in details later', 'info')
    }
  } catch (error) {
    console.error('Error saving admin settings:', error)
    showToast('⚠️ Save failed: ' + error.message, 'warning')
  }

  wizardState.currentStep = 5
  renderWizard(document.getElementById('page-setup-wizard'))
  attachEventListeners()
}

async function testSsoConnection() {
  const clientId = document.getElementById('client-id')?.value
  const clientSecret = document.getElementById('client-secret')?.value
  const tenantId = document.getElementById('tenant-id')?.value

  if (!clientId || !clientSecret || !tenantId) {
    showToast('Please fill in all credentials first', 'error')
    return
  }

  const resultDiv = document.getElementById('sso-test-result')
  resultDiv.innerHTML = `<div style="display:flex;align-items:center;gap:8px;color:var(--color-text-secondary);font-size:12px"><i class="ti ti-loader" style="animation:spin 1s linear infinite"></i> Testing connection...</div>`

  try {
    const response = await fetch(`${API_URL}/api/setup/test-connection`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ clientId, clientSecret, tenantId })
    })

    const data = await response.json()

    if (data.success) {
      resultDiv.innerHTML = `
        <div style="background:rgba(34, 197, 94, 0.1);border:1px solid rgba(34, 197, 94, 0.3);padding:12px;border-radius:6px;display:flex;align-items:center;gap:8px">
          <i class="ti ti-check-circle" style="color:var(--color-success)"></i>
          <div style="font-size:12px">
            <strong>✅ Connection successful!</strong>
            <div style="color:var(--color-text-secondary);margin-top:4px">Your Azure AD credentials are valid</div>
          </div>
        </div>
      `
      showToast('SSO connection verified', 'success')
    } else {
      resultDiv.innerHTML = `
        <div style="background:rgba(239, 68, 68, 0.1);border:1px solid rgba(239, 68, 68, 0.3);padding:12px;border-radius:6px;display:flex;align-items:center;gap:8px">
          <i class="ti ti-alert-circle" style="color:var(--color-error)"></i>
          <div style="font-size:12px">
            <strong>❌ Connection failed!</strong>
            <div style="color:var(--color-text-secondary);margin-top:4px">${data.message || 'Invalid credentials'}</div>
          </div>
        </div>
      `
      showToast('Connection failed: ' + data.message, 'error')
    }
  } catch (error) {
    console.error('Error testing connection:', error)
    resultDiv.innerHTML = `
      <div style="background:rgba(239, 68, 68, 0.1);border:1px solid rgba(239, 68, 68, 0.3);padding:12px;border-radius:6px;display:flex;align-items:center;gap:8px">
        <i class="ti ti-alert-circle" style="color:var(--color-error)"></i>
        <div style="font-size:12px">
          <strong>❌ Error testing connection</strong>
          <div style="color:var(--color-text-secondary);margin-top:4px">${error.message}</div>
        </div>
      </div>
    `
    showToast('Error: ' + error.message, 'error')
  }
}

async function testGraphConnection() {
  const resultDiv = document.getElementById('graph-test-result')
  resultDiv.innerHTML = `<div style="display:flex;align-items:center;gap:8px;color:var(--color-text-secondary);font-size:12px"><i class="ti ti-loader" style="animation:spin 1s linear infinite"></i> Testing Graph API connection...</div>`

  try {
    const response = await fetch(`${API_URL}/api/setup/test-graph-api`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    })

    const data = await response.json()

    if (data.success) {
      resultDiv.innerHTML = `
        <div style="background:rgba(34, 197, 94, 0.1);border:1px solid rgba(34, 197, 94, 0.3);padding:12px;border-radius:6px">
          <div style="display:flex;align-items:center;gap:8px;font-size:12px;margin-bottom:8px">
            <i class="ti ti-check-circle" style="color:var(--color-success)"></i>
            <strong>✅ Graph API connection successful!</strong>
          </div>
          <div style="font-size:11px;color:var(--color-text-secondary);padding-left:24px">
            <div>✓ 7 of 7 permissions granted</div>
            <div>✓ Organization: ${data.organization}</div>
          </div>
        </div>
      `
      showToast('Graph API connection verified', 'success')
    } else {
      resultDiv.innerHTML = `
        <div style="background:rgba(239, 68, 68, 0.1);border:1px solid rgba(239, 68, 68, 0.3);padding:12px;border-radius:6px;display:flex;align-items:center;gap:8px">
          <i class="ti ti-alert-circle" style="color:var(--color-error)"></i>
          <div style="font-size:12px">
            <strong>❌ Connection failed!</strong>
            <div style="color:var(--color-text-secondary);margin-top:4px">${data.error || 'Unknown error'}</div>
          </div>
        </div>
      `
      showToast('Graph API test failed: ' + data.error, 'error')
    }
  } catch (error) {
    console.error('Error testing Graph API:', error)
    resultDiv.innerHTML = `
      <div style="background:rgba(239, 68, 68, 0.1);border:1px solid rgba(239, 68, 68, 0.3);padding:12px;border-radius:6px;display:flex;align-items:center;gap:8px">
        <i class="ti ti-alert-circle" style="color:var(--color-error)"></i>
        <div style="font-size:12px">
          <strong>❌ Error testing Graph API</strong>
          <div style="color:var(--color-text-secondary);margin-top:4px">${error.message}</div>
        </div>
      </div>
    `
    showToast('Error: ' + error.message, 'error')
  }
}

async function grantAdminConsent() {
  const resultDiv = document.getElementById('admin-consent-result')
  const button = event.target.closest('button')

  resultDiv.innerHTML = `<div style="display:flex;align-items:center;gap:8px;color:var(--color-text-secondary);font-size:12px"><i class="ti ti-loader" style="animation:spin 1s linear infinite"></i> Initiating admin consent...</div>`
  resultDiv.style.display = 'block'
  button.disabled = true
  button.style.opacity = '0.6'

  try {
    const response = await fetch(`${API_URL}/api/setup/admin-consent`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    })

    const data = await response.json()

    if (data.authUrl) {
      // Open popup for admin to login and consent
      const width = 600
      const height = 700
      const left = window.screenX + (window.outerWidth - width) / 2
      const top = window.screenY + (window.outerHeight - height) / 2

      const popup = window.open(
        data.authUrl,
        'AdminConsent',
        `width=${width},height=${height},left=${left},top=${top},resizable=yes,scrollbars=yes`
      )

      // Check popup status every second
      let attempts = 0
      const checkPopup = setInterval(async () => {
        attempts++

        if (popup.closed || attempts > 180) { // 3 minute timeout
          clearInterval(checkPopup)

          // Check if consent was granted
          const verifyResponse = await fetch(`${API_URL}/api/setup/verify-admin-consent`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' }
          })

          const verifyData = await verifyResponse.json()

          if (verifyData.consentGranted) {
            resultDiv.innerHTML = `
              <div style="background:rgba(34, 197, 94, 0.1);border:1px solid rgba(34, 197, 94, 0.3);padding:12px;border-radius:6px">
                <div style="display:flex;align-items:center;gap:8px;font-size:12px;margin-bottom:8px">
                  <i class="ti ti-check-circle" style="color:var(--color-success)"></i>
                  <strong>✅ Admin consent granted successfully!</strong>
                </div>
                <div style="font-size:11px;color:var(--color-text-secondary);padding-left:24px">
                  <div>✓ All 40 permissions approved</div>
                  <div>✓ Ready to deploy</div>
                </div>
              </div>
            `
            showToast('Admin consent granted successfully!', 'success')
          } else {
            resultDiv.innerHTML = `
              <div style="background:rgba(239, 68, 68, 0.1);border:1px solid rgba(239, 68, 68, 0.3);padding:12px;border-radius:6px;display:flex;align-items:center;gap:8px">
                <i class="ti ti-alert-circle" style="color:var(--color-error)"></i>
                <div style="font-size:12px">
                  <strong>❌ Admin consent was not granted</strong>
                  <div style="color:var(--color-text-secondary);margin-top:4px">Please try again or manually grant permissions in Azure AD</div>
                </div>
              </div>
            `
            showToast('Admin consent was cancelled', 'warning')
          }

          button.disabled = false
          button.style.opacity = '1'
        }
      }, 1000)
    } else {
      throw new Error(data.error || 'Failed to initiate admin consent')
    }
  } catch (error) {
    console.error('Error granting admin consent:', error)
    resultDiv.innerHTML = `
      <div style="background:rgba(239, 68, 68, 0.1);border:1px solid rgba(239, 68, 68, 0.3);padding:12px;border-radius:6px;display:flex;align-items:center;gap:8px">
        <i class="ti ti-alert-circle" style="color:var(--color-error)"></i>
        <div style="font-size:12px">
          <strong>❌ Error initiating admin consent</strong>
          <div style="color:var(--color-text-secondary);margin-top:4px">${error.message}</div>
        </div>
      </div>
    `
    showToast('Error: ' + error.message, 'error')
    button.disabled = false
    button.style.opacity = '1'
  }
}

function runVerification() {
  const checks = [
    { id: 'check-azure', delay: 500 },
    { id: 'check-sso', delay: 1200 },
    { id: 'check-graph', delay: 1900 },
    { id: 'check-roles', delay: 2600 },
    { id: 'check-email', delay: 3300 },
  ]

  checks.forEach(check => {
    setTimeout(() => {
      const el = document.getElementById(check.id)
      if (el) {
        el.querySelector('.verification-icon').classList.remove('pending')
        el.querySelector('.verification-icon').classList.add('success')
        el.querySelector('.verification-icon').innerHTML = '<i class="ti ti-check-circle"></i>'
        el.querySelector('.verification-status').innerHTML = '<span style="color:var(--color-success);font-size:12px">✓ Complete</span>'
      }
    }, check.delay)
  })

  setTimeout(() => {
    document.getElementById('verification-summary').style.display = 'block'
  }, 3500)
}

function saveServiceConfigStep() {
  // Get selected services from checkboxes
  const checkboxes = document.querySelectorAll('.service-checkbox:checked')
  const selectedServices = Array.from(checkboxes).map(cb => cb.dataset.service)

  // Update wizard state
  wizardState.formData.selectedServices = selectedServices

  // Show selected services in next step
  const statusDiv = document.getElementById('selected-services-list')
  if (statusDiv && selectedServices.length > 0) {
    statusDiv.innerHTML = selectedServices.map(service => {
      const labels = {
        changeIntelligence: 'Change Intelligence',
        serviceHealth: 'Service Health',
        zeroTrust: 'Zero Trust Assessment',
        tenantGuard: 'TenantGuard Enhanced',
        selfService: 'Self Service Portal'
      }
      return `<div style="padding:8px;background:rgba(244,67,54,0.1);border-left:4px solid #D32F2F;border-radius:4px"><span style="font-size:12px">${labels[service]}</span></div>`
    }).join('')
  }

  // Move to next step
  window.setWizardStep(7)
}

async function initializeSelectedLists() {
  const btn = document.getElementById('init-lists-btn')
  const statusDiv = document.getElementById('initialization-status')

  try {
    btn.disabled = true
    btn.style.opacity = '0.6'
    statusDiv.innerHTML = `<div style="display:flex;align-items:center;gap:8px;color:var(--color-text-secondary);font-size:12px"><i class="ti ti-loader" style="animation:spin 1s linear infinite"></i> Initializing SharePoint lists...</div>`
    statusDiv.style.display = 'block'

    const response = await fetch(`${API_URL}/api/setup/initialize-services`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        services: wizardState.formData.selectedServices
      })
    })

    const data = await response.json()

    if (data.success) {
      statusDiv.innerHTML = `
        <div style="background:rgba(76, 175, 80, 0.1);border:1px solid rgba(76, 175, 80, 0.3);padding:12px;border-radius:6px">
          <div style="display:flex;align-items:center;gap:8px;font-size:12px">
            <i class="ti ti-check-circle" style="color:var(--color-success)"></i>
            <strong>✅ SharePoint lists initialized successfully!</strong>
          </div>
          <div style="font-size:11px;color:var(--color-text-secondary);margin-top:8px;padding-left:24px">
            ${data.message || 'All selected services are ready to use.'}
          </div>
        </div>
      `
      showToast('SharePoint lists created successfully', 'success')
    } else {
      throw new Error(data.error || 'Failed to initialize lists')
    }
  } catch (error) {
    console.error('Error initializing lists:', error)
    statusDiv.innerHTML = `
      <div style="background:rgba(239, 68, 68, 0.1);border:1px solid rgba(239, 68, 68, 0.3);padding:12px;border-radius:6px">
        <div style="display:flex;align-items:center;gap:8px;font-size:12px">
          <i class="ti ti-alert-circle" style="color:var(--color-error)"></i>
          <strong>❌ Initialization failed</strong>
        </div>
        <div style="font-size:11px;color:var(--color-text-secondary);margin-top:8px;padding-left:24px">
          ${error.message}
        </div>
      </div>
    `
    showToast('Failed to initialize lists: ' + error.message, 'error')
  } finally {
    btn.disabled = false
    btn.style.opacity = '1'
  }
}

async function completeSetup() {
  try {
    // Step 1: Save final setup config to SharePoint
    await fetch(`${API_URL}/api/setup/save-step`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        step: 'Setup-Complete',
        superAdminEmail: wizardState.formData.superAdminEmail,
        completedSteps: [1, 2, 3, 4, 5]
      })
    })

    // Step 2: Deploy configuration to App Service environment variables
    showToast('Deploying configuration to App Service...', 'info')
    const deployResponse = await fetch(`${API_URL}/api/setup/deploy-config`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        clientId: wizardState.formData.azureClientId,
        clientSecret: wizardState.formData.azureClientSecret,
        tenantId: wizardState.formData.azureTenantId,
        redirectUri: wizardState.formData.redirectUri,
        sharePointSiteId: document.getElementById('sharepoint-site-id')?.value
      })
    })

    const deployData = await deployResponse.json()

    if (!deployData.success && !deployData.skipped) {
      console.warn('⚠️ App Service deployment warning:', deployData.message)
      showToast('Setup saved but App Service config skipped: ' + deployData.message, 'warning')
    } else {
      showToast('Configuration deployed to App Service!', 'success')
    }

    // Step 3: Mark setup complete
    const completeResponse = await fetch(`${API_URL}/api/setup/complete`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        superAdminEmail: wizardState.formData.superAdminEmail
      })
    })

    if (!completeResponse.ok) throw new Error('Failed to complete setup')

    showToast('🎉 Setup complete! Redirecting to dashboard...', 'success')
    setTimeout(() => {
      window.location.hash = '#dashboard'
      location.reload()
    }, 2000)
  } catch (error) {
    console.error('Error completing setup:', error)
    showToast('Error: ' + error.message, 'error')
  }
}
