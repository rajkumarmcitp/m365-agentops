/**
 * PowerShell Commands Loader
 * Loads PowerShell command mappings and enriches controls with automation scripts
 * Supports all 113 CIS controls with 111 having automated PowerShell commands
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

let powerShellCommandsCache = null;

/**
 * Load PowerShell commands mapping from JSON file
 * @returns {Object} Mapping of control IDs to PowerShell commands
 */
export function loadPowerShellCommands() {
  if (powerShellCommandsCache) {
    return powerShellCommandsCache;
  }

  try {
    const mappingPath = path.join(__dirname, 'powershell-commands-mapping.json');
    const mappingData = JSON.parse(fs.readFileSync(mappingPath, 'utf8'));
    powerShellCommandsCache = mappingData.powershell_commands_mapping;
    return powerShellCommandsCache;
  } catch (error) {
    console.error('❌ Failed to load PowerShell commands mapping:', error.message);
    return {};
  }
}

/**
 * Get PowerShell commands for a specific control
 * @param {string} controlId - Control ID (e.g., "1.1.1")
 * @returns {Array<string>|null} Array of PowerShell commands or null if not found
 */
export function getControlPowerShellCommands(controlId) {
  const mapping = loadPowerShellCommands();
  return mapping[controlId]?.commands || null;
}

/**
 * Get remediation steps for a specific control
 * @param {string} controlId - Control ID (e.g., "1.1.1")
 * @returns {string|null} Remediation steps or null if not found
 */
export function getControlRemediation(controlId) {
  const mapping = loadPowerShellCommands();
  return mapping[controlId]?.remediation || null;
}

/**
 * Get all PowerShell commands metadata
 * @returns {Object} Complete mapping with descriptions and commands
 */
export function getAllPowerShellCommandsMetadata() {
  return loadPowerShellCommands();
}

/**
 * Enrich controls with PowerShell commands and remediation
 * Recursively walks control tree and adds powerShellCommands and remediation properties
 * @param {Object} controlsData - CIS_CONTROLS_DATA structure
 * @returns {Object} Enriched controls data
 */
export function enrichControlsWithPowerShellCommands(controlsData) {
  const mapping = loadPowerShellCommands();

  function enrichRecursive(obj) {
    if (Array.isArray(obj)) {
      return obj.map(item => enrichRecursive(item));
    }

    if (typeof obj === 'object' && obj !== null) {
      // If this is a control with an ID, try to add PowerShell commands and remediation
      if (obj.id && obj.type === 'auto' && mapping[obj.id]) {
        obj.powerShellCommands = mapping[obj.id].commands;
        if (mapping[obj.id].remediation) {
          obj.remediation = mapping[obj.id].remediation;
        }
      }

      // Recursively process all properties
      for (const key in obj) {
        obj[key] = enrichRecursive(obj[key]);
      }
    }

    return obj;
  }

  return enrichRecursive(controlsData);
}

/**
 * Get PowerShell command summary
 * @returns {Object} Statistics about PowerShell command coverage
 */
export function getPowerShellCommandSummary() {
  const mapping = loadPowerShellCommands();
  const controlsWithCommands = Object.keys(mapping).length;

  const summary = {
    totalControls: 113,
    controlsWithPowerShell: controlsWithCommands,
    manualControls: 113 - controlsWithCommands,
    coverage: `${Math.round((controlsWithCommands / 113) * 100)}%`,
    commandsByTopic: {}
  };

  // Group by topic
  for (const controlId of Object.keys(mapping)) {
    const topic = controlId.split('.')[0];
    if (!summary.commandsByTopic[topic]) {
      summary.commandsByTopic[topic] = 0;
    }
    summary.commandsByTopic[topic]++;
  }

  return summary;
}

/**
 * Get required PowerShell modules
 * @returns {Array<Object>} Required modules with versions
 */
export function getRequiredPowerShellModules() {
  return [
    {
      name: 'Microsoft.Graph',
      version: '2.38.0+',
      source: 'PSGallery',
      description: 'Microsoft Graph PowerShell SDK for directory, identity, and tenant queries',
      installCommand: 'Install-Module Microsoft.Graph -Repository PSGallery -Scope CurrentUser -Force'
    },
    {
      name: 'ExchangeOnlineManagement',
      version: '3.10.0+',
      source: 'PSGallery',
      description: 'Exchange Online and mailbox management cmdlets',
      installCommand: 'Install-Module ExchangeOnlineManagement -Repository PSGallery -Scope CurrentUser -Force'
    },
    {
      name: 'PnP.PowerShell',
      version: '2.0.0+',
      source: 'PSGallery',
      description: 'SharePoint and Teams management through PnP',
      installCommand: 'Install-Module PnP.PowerShell -Repository PSGallery -Scope CurrentUser -Force'
    }
  ];
}

/**
 * Validate PowerShell module availability
 * @param {Array<string>} moduleNames - Module names to check
 * @returns {Promise<Object>} Availability status for each module
 */
export async function validatePowerShellModules(moduleNames = []) {
  const { executePowerShellCommands } = await import('./powershell-executor.js');

  const modules = moduleNames.length > 0
    ? moduleNames
    : ['Microsoft.Graph', 'ExchangeOnlineManagement', 'PnP.PowerShell'];

  const commands = [
    `$modules = @(${modules.map(m => `'${m}'`).join(',')})`,
    `$modules | ForEach-Object { if (Get-Module -Name $_ -ListAvailable) { Write-Host "$_:installed" } else { Write-Host "$_:missing" } }`
  ];

  const result = await executePowerShellCommands(commands, 'module-validation');

  if (!result.success) {
    return {
      success: false,
      error: result.error,
      modules: modules.reduce((acc, m) => ({ ...acc, [m]: 'unknown' }), {})
    };
  }

  const moduleStatus = {};
  const lines = result.output.split('\n');

  for (const line of lines) {
    const [module, status] = line.split(':');
    if (module && status) {
      moduleStatus[module.trim()] = status.trim();
    }
  }

  // Add missing modules
  for (const module of modules) {
    if (!moduleStatus[module]) {
      moduleStatus[module] = 'missing';
    }
  }

  return {
    success: true,
    modules: moduleStatus,
    allInstalled: Object.values(moduleStatus).every(s => s === 'installed')
  };
}

/**
 * Get setup instructions for PowerShell validation
 * @returns {Object} Installation and setup guide
 */
export function getSetupInstructions() {
  return {
    title: 'Full PowerShell Validation System Setup',
    description: 'Complete PowerShell validation for all 113 CIS controls',
    requiredModules: getRequiredPowerShellModules(),
    setupSteps: [
      {
        step: 1,
        title: 'Install Microsoft.Graph SDK',
        command: 'pwsh -Command "Install-Module Microsoft.Graph -Repository PSGallery -Scope CurrentUser -Force"',
        timeEstimate: '3-5 minutes'
      },
      {
        step: 2,
        title: 'Install ExchangeOnlineManagement',
        command: 'pwsh -Command "Install-Module ExchangeOnlineManagement -Repository PSGallery -Scope CurrentUser -Force"',
        timeEstimate: '2-3 minutes'
      },
      {
        step: 3,
        title: 'Verify installations',
        command: 'pwsh -Command "Get-Module Microsoft.Graph, ExchangeOnlineManagement -ListAvailable | Select-Object Name, Version"',
        timeEstimate: 'Instant'
      }
    ],
    supportedPlatforms: ['Windows (PowerShell 5.1+)', 'macOS (PowerShell 7+)', 'Linux (PowerShell 7+)'],
    coverage: '111 automated controls, 2 manual controls',
    powerShellVersion: 'PowerShell 5.1 or higher (7.0+ recommended)'
  };
}

// Initialize and log summary on load
console.log('📋 PowerShell Commands Loader initialized');
const summary = getPowerShellCommandSummary();
console.log(`   ✓ ${summary.controlsWithPowerShell}/${summary.totalControls} controls (${summary.coverage})`);
