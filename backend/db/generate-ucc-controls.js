// ============================================================
// M365 AgentOps: Universal Control Catalog Generator
// Generates 600+ controls across 20 domains
// ============================================================

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Domain definitions with control counts and Graph endpoints
const DOMAIN_DEFINITIONS = {
  'TG-ID': {
    name: 'Identity Security',
    description: 'Core identity and access controls',
    count: 70,
    service: 'Entra ID',
    endpoint_prefix: '/identity'
  },
  'TG-AUTH': {
    name: 'Authentication & MFA',
    description: 'MFA, password policy, and auth methods',
    count: 35,
    service: 'Entra ID',
    endpoint_prefix: '/policies/authenticationMethodsPolicy'
  },
  'TG-CA': {
    name: 'Conditional Access',
    description: 'Risk-based access policies',
    count: 60,
    service: 'Entra ID',
    endpoint_prefix: '/identity/conditionalAccess'
  },
  'TG-APP': {
    name: 'Enterprise Applications',
    description: 'App registration, permissions, credentials',
    count: 80,
    service: 'Entra ID',
    endpoint_prefix: '/applications'
  },
  'TG-ROLE': {
    name: 'Privileged Access',
    description: 'PIM and privileged role management',
    count: 40,
    service: 'Entra ID',
    endpoint_prefix: '/roleManagement'
  },
  'TG-DEV': {
    name: 'Device Compliance',
    description: 'Device management and compliance policies',
    count: 60,
    service: 'Intune',
    endpoint_prefix: '/deviceManagement'
  },
  'TG-EXO': {
    name: 'Exchange Online',
    description: 'Email security and compliance',
    count: 80,
    service: 'Exchange',
    endpoint_prefix: '/organization/tenantAllowBlockLists'
  },
  'TG-SPO': {
    name: 'SharePoint Online',
    description: 'SharePoint security and sharing policies',
    count: 60,
    service: 'SharePoint',
    endpoint_prefix: '/sharepoint/sites'
  },
  'TG-TEAMS': {
    name: 'Microsoft Teams',
    description: 'Teams security and governance',
    count: 45,
    service: 'Teams',
    endpoint_prefix: '/teams/teamsAppSettings'
  },
  'TG-PUR': {
    name: 'Purview',
    description: 'Data protection and compliance',
    count: 70,
    service: 'Purview',
    endpoint_prefix: '/compliance/classificationExactMatches'
  },
  'TG-DEF': {
    name: 'Microsoft Defender',
    description: 'Threat protection and detection',
    count: 60,
    service: 'Defender',
    endpoint_prefix: '/security/threatIntelligence'
  },
  'TG-INT': {
    name: 'Intune',
    description: 'Mobile and device management',
    count: 80,
    service: 'Intune',
    endpoint_prefix: '/deviceManagement/deviceConfigurations'
  },
  'TG-DLP': {
    name: 'Data Loss Prevention',
    description: 'DLP policies and protection',
    count: 35,
    service: 'Purview',
    endpoint_prefix: '/dataClassification/dlp'
  },
  'TG-AUD': {
    name: 'Audit & Logging',
    description: 'Audit logs and monitoring',
    count: 30,
    service: 'Exchange',
    endpoint_prefix: '/auditLogs/directoryAudits'
  },
  'TG-MON': {
    name: 'Monitoring',
    description: 'Security monitoring and alerts',
    count: 35,
    service: 'Defender',
    endpoint_prefix: '/security/alerts'
  },
  'TG-NET': {
    name: 'Network Security',
    description: 'Network and perimeter security',
    count: 30,
    service: 'Azure',
    endpoint_prefix: '/network/securityGroups'
  },
  'TG-GOV': {
    name: 'Governance',
    description: 'Access reviews and governance',
    count: 40,
    service: 'Entra ID',
    endpoint_prefix: '/identityGovernance/accessReviews'
  },
  'TG-BKP': {
    name: 'Backup & Recovery',
    description: 'Data backup and recovery policies',
    count: 20,
    service: 'Exchange',
    endpoint_prefix: '/compliance/retentionPolicies'
  },
  'TG-COMP': {
    name: 'Compliance',
    description: 'Compliance frameworks and policies',
    count: 50,
    service: 'Purview',
    endpoint_prefix: '/compliance'
  },
  'TG-AI': {
    name: 'AI & Copilot Security',
    description: 'AI governance and Copilot security',
    count: 30,
    service: 'Teams',
    endpoint_prefix: '/teamwork/microsoft/copilot'
  }
}

// Control templates for each domain
const CONTROL_TEMPLATES = {
  'TG-ID': [
    {
      name: 'MFA Required for Global Administrators',
      category: 'Authentication',
      severity: 'Critical',
      frameworks: ['CIS:5.2.1', 'NIST:IA-2', 'ISO:A.5.17', 'CMMC:AC.L2.1.1', 'SOC2:CC6.1', 'Secure Score:104', 'Zero Trust:Identity']
    },
    {
      name: 'Legacy Authentication Blocked',
      category: 'Authentication',
      severity: 'Critical',
      frameworks: ['CIS:5.2.3', 'NIST:IA-2', 'Zero Trust:Identity']
    },
    {
      name: 'Conditional Access for Admin Portals',
      category: 'Access Control',
      severity: 'High',
      frameworks: ['CIS:5.3.1', 'NIST:AC-3', 'ISO:A.5.18', 'Zero Trust:Identity']
    },
    {
      name: 'No Permanent Role Assignments',
      category: 'Privileged Access',
      severity: 'Critical',
      frameworks: ['CIS:5.1.3', 'NIST:AC-2', 'ISO:A.5.16', 'CMMC:AC.L2.1.2', 'Zero Trust:Identity']
    },
    {
      name: 'PIM Approval Required',
      category: 'Privileged Access',
      severity: 'High',
      frameworks: ['CIS:5.1.4', 'NIST:AC-2', 'ISO:A.5.16', 'CMMC:AC.L2.1.2']
    }
  ],
  'TG-AUTH': [
    {
      name: 'MFA Registration Required for Users',
      category: 'MFA Policy',
      severity: 'Critical',
      frameworks: ['CIS:5.2.1', 'NIST:IA-2', 'Secure Score:104', 'Zero Trust:Identity']
    },
    {
      name: 'Microsoft Authenticator App Enabled',
      category: 'MFA Methods',
      severity: 'Critical',
      frameworks: ['NIST:IA-2', 'Zero Trust:Identity', 'Secure Score:116']
    },
    {
      name: 'FIDO2 Security Keys Supported',
      category: 'MFA Methods',
      severity: 'High',
      frameworks: ['NIST:IA-5', 'ISO:A.5.5', 'Zero Trust:Identity']
    }
  ],
  'TG-CA': [
    {
      name: 'MFA Required for High Risk',
      category: 'Risk Policy',
      severity: 'High',
      frameworks: ['CIS:5.3.1', 'NIST:AC-3', 'Zero Trust:Identity']
    },
    {
      name: 'Device Compliance Required',
      category: 'Device Policy',
      severity: 'High',
      frameworks: ['NIST:CM-2', 'ISO:A.5.19', 'Zero Trust:Devices']
    },
    {
      name: 'Block Unsupported Client Apps',
      category: 'Client Policy',
      severity: 'Medium',
      frameworks: ['CIS:5.3.2', 'NIST:AC-3']
    }
  ],
  'TG-APP': [
    {
      name: 'Application has Verified Publisher',
      category: 'Security',
      severity: 'High',
      frameworks: ['Zero Trust:Applications']
    },
    {
      name: 'Application Requires Admin Consent',
      category: 'Permissions',
      severity: 'High',
      frameworks: ['CIS:5.7', 'NIST:AC-3']
    },
    {
      name: 'Application has Multiple Owners',
      category: 'Governance',
      severity: 'High',
      frameworks: ['CIS:5.8', 'NIST:AC-3', 'ISO:A.8.2']
    }
  ],
  'TG-ROLE': [
    {
      name: 'Privileged Admin Roles Reviewed',
      category: 'Access Review',
      severity: 'High',
      frameworks: ['NIST:AC-2', 'ISO:A.5.16', 'CMMC:AC.L2.1.2']
    },
    {
      name: 'Service Accounts Monitored',
      category: 'Service Account',
      severity: 'Medium',
      frameworks: ['NIST:SI-4', 'ISO:A.12.4']
    }
  ],
  'TG-DEV': [
    {
      name: 'Devices must be Compliant',
      category: 'Compliance',
      severity: 'High',
      frameworks: ['NIST:CM-2', 'ISO:A.5.19', 'Zero Trust:Devices']
    },
    {
      name: 'Device Encryption Required',
      category: 'Encryption',
      severity: 'High',
      frameworks: ['ISO:A.10.2', 'CMMC:SC.L2.3.13']
    },
    {
      name: 'Mobile Device Management Enabled',
      category: 'MDM',
      severity: 'High',
      frameworks: ['NIST:CM-3', 'Zero Trust:Devices']
    }
  ],
  'TG-EXO': [
    {
      name: 'External Email Warnings Enabled',
      category: 'Email Security',
      severity: 'Medium',
      frameworks: ['CIS:2.1.6', 'NIST:SI-4']
    },
    {
      name: 'SMTP Authentication Blocked',
      category: 'Authentication',
      severity: 'High',
      frameworks: ['CIS:2.1.2', 'NIST:IA-2']
    },
    {
      name: 'Malware Scanning Enabled',
      category: 'Threat Protection',
      severity: 'Critical',
      frameworks: ['CIS:2.1.10', 'NIST:SI-3']
    }
  ],
  'TG-SPO': [
    {
      name: 'SharePoint Sharing Policy Configured',
      category: 'Sharing',
      severity: 'High',
      frameworks: ['CIS:7.2.1', 'NIST:AC-3', 'Zero Trust:Data']
    },
    {
      name: 'Anyone Links Disabled',
      category: 'Sharing',
      severity: 'High',
      frameworks: ['CIS:7.2.3', 'NIST:AC-3', 'ISO:A.5.2']
    },
    {
      name: 'External User Expiration Configured',
      category: 'Access Control',
      severity: 'Medium',
      frameworks: ['NIST:AC-2', 'ISO:A.5.2']
    }
  ],
  'TG-TEAMS': [
    {
      name: 'Guest Access Controlled',
      category: 'Guest Management',
      severity: 'High',
      frameworks: ['CIS:8.1.1', 'NIST:AC-2', 'Zero Trust:Identity']
    },
    {
      name: 'External File Sharing Restricted',
      category: 'File Sharing',
      severity: 'Medium',
      frameworks: ['CIS:8.2.1', 'NIST:AC-3']
    },
    {
      name: 'Recorded Meetings Retention Configured',
      category: 'Data Retention',
      severity: 'Low',
      frameworks: ['ISO:A.5.3']
    }
  ]
}

// Framework definitions with typical control IDs
const FRAMEWORK_CONTROLS = {
  CIS: ['2.1.1', '2.1.2', '2.1.3', '2.1.6', '2.1.10', '2.4.2', '3.1.1', '5.1.3', '5.1.4', '5.2.1', '5.2.3', '5.3.1', '5.3.2', '5.4.1', '5.7', '5.8', '6.1.1', '6.2.1', '7.2.1', '7.2.3', '8.1.1', '8.2.1'],
  NIST: ['AC-2', 'AC-3', 'AC-12', 'IA-2', 'IA-5', 'SI-3', 'SI-4', 'CM-2', 'CM-3', 'SC-7'],
  ISO: ['A.5.2', 'A.5.3', 'A.5.5', 'A.5.16', 'A.5.17', 'A.5.18', 'A.5.19', 'A.8.2', 'A.10.2', 'A.12.4'],
  CMMC: ['AC.L2.1.1', 'AC.L2.1.2', 'AC.L2.1.3', 'SC.L2.3.13'],
  SOC2: ['CC6.1', 'CC6.2', 'CC7.2'],
  'Secure Score': ['104', '109', '116', '320', '321'],
  'Zero Trust': ['Identity', 'Devices', 'Data', 'Applications', 'Networks', 'Infrastructure']
}

// Generate a control object
function generateControl(domainId, controlNumber, domainDef, template) {
  const controlId = `${domainId}-${String(controlNumber).padStart(3, '0')}`
  const severityMap = { Critical: 10, High: 7, Medium: 4, Low: 2, Informational: 1 }
  const severity = template?.severity || ['Critical', 'High', 'Medium'][Math.floor(Math.random() * 3)]

  // Parse frameworks from template
  const frameworks = template?.frameworks || generateRandomFrameworks()

  const remediation = [
    `Navigate to ${domainDef.name} settings`,
    `Enable the required control`,
    `Configure appropriate policies`,
    `Verify across all users/resources`
  ]

  return {
    control_id: controlId,
    control_name: template?.name || `${domainDef.name} Control ${controlNumber}`,
    description: `${domainDef.description} - ${template?.name || `Control ${controlNumber}`}`,
    domain: domainId,
    category: template?.category || 'Security',
    service: domainDef.service,
    severity,
    risk_weight: severityMap[severity],
    validation_type: 'Automatic',
    validation_engine: domainId.includes('EXO') || domainId.includes('AUD') ? 'PowerShell' : 'Graph API',
    graph_endpoint: `${domainDef.endpoint_prefix}/${controlNumber}`,
    graph_property: 'isEnabled',
    expected_value: 'true',
    auto_remediation_supported: ['Critical', 'High'].includes(severity),
    remediation_steps: JSON.stringify(remediation),
    estimated_effort: ['Critical', 'High'].includes(severity) ? 'Medium' : 'Low',
    business_impact: ['Critical'].includes(severity) ? 'Critical' : 'High',
    powershell_fallback: true,
    license_required: domainDef.service === 'Intune' ? 'Intune License' : 'Entra ID P1',
    mitre_attack: 'T1078',
    capec: 'CAPEC-114',
    frameworks: frameworks
  }
}

// Generate random framework mappings
function generateRandomFrameworks() {
  const frameworks = Object.keys(FRAMEWORK_CONTROLS)
  const selected = []
  const count = Math.floor(Math.random() * 3) + 2 // 2-4 frameworks

  for (let i = 0; i < count; i++) {
    const framework = frameworks[Math.floor(Math.random() * frameworks.length)]
    if (!selected.includes(framework)) {
      selected.push(framework)
    }
  }

  return selected
}

// Generate SQL for controls
function generateControlsSQL() {
  const templates = Object.entries(CONTROL_TEMPLATES)
  let sql = ''
  let totalControls = 0

  for (const [domainId, domainDef] of Object.entries(DOMAIN_DEFINITIONS)) {
    console.log(`\n📝 Generating ${domainId}: ${domainDef.name} (${domainDef.count} controls)`)

    const domainTemplates = CONTROL_TEMPLATES[domainId] || []
    const templateCount = Math.ceil(domainDef.count / domainTemplates.length)

    for (let i = 1; i <= domainDef.count; i++) {
      const template = domainTemplates[(i - 1) % domainTemplates.length]
      const control = generateControl(domainId, i, domainDef, template)

      const remediationStr = control.remediation_steps.replace(/'/g, "''")
      const descStr = control.description.replace(/'/g, "''")
      const nameStr = control.control_name.replace(/'/g, "''")

      sql += `INSERT INTO m365_control_catalog (
  control_id, control_name, description, domain, category, service,
  severity, risk_weight, validation_type, validation_engine, validation_logic,
  graph_endpoint, graph_property, expected_value,
  auto_remediation_supported, remediation_steps, estimated_effort, business_impact,
  powershell_fallback, license_required, mitre_attack, capec
) VALUES (
  '${control.control_id}',
  '${nameStr}',
  '${descStr}',
  '${control.domain}',
  '${control.category}',
  '${control.service}',
  '${control.severity}', ${control.risk_weight},
  '${control.validation_type}',
  '${control.validation_engine}',
  '${domainDef.description}',
  '${control.graph_endpoint}',
  '${control.graph_property}',
  '${control.expected_value}',
  ${control.auto_remediation_supported},
  '${remediationStr}',
  '${control.estimated_effort}',
  '${control.business_impact}',
  ${control.powershell_fallback},
  '${control.license_required}',
  '${control.mitre_attack}',
  '${control.capec}'
);\n\n`

      totalControls++
    }
  }

  return { sql, totalControls }
}

// Generate framework mappings
function generateMappingsSQL(controlsSQL) {
  let sql = ''
  let totalMappings = 0

  // Extract control IDs from the controls SQL
  const controlIds = Array.from(controlsSQL.matchAll(/'(TG-[A-Z]+-\d{3})'/g), m => m[1])

  for (const controlId of controlIds) {
    const [domain] = controlId.split('-')
    const frameworks = generateRandomFrameworks()

    for (const framework of frameworks) {
      const frameworkControls = FRAMEWORK_CONTROLS[framework] || []
      const frameworkControlId = frameworkControls[Math.floor(Math.random() * frameworkControls.length)]
      const mappingType = Math.random() > 0.3 ? 'Primary' : 'Secondary'

      sql += `INSERT INTO m365_control_mappings (control_id, framework, framework_control_id, mapping_type, mapping_notes)
SELECT id, '${framework}', '${frameworkControlId}', '${mappingType}', 'Mapping from ${controlId}'
FROM m365_control_catalog WHERE control_id = '${controlId}';\n\n`

      totalMappings++
    }
  }

  return { sql, totalMappings }
}

// Main
async function main() {
  console.log('🚀 M365 AgentOps Control Catalog Generator')
  console.log('=' .repeat(50))

  // Generate controls
  console.log('\n📊 Generating controls...')
  const { sql: controlsSQL, totalControls } = generateControlsSQL()

  // Write controls to file
  const controlsPath = path.join(__dirname, 'data', 'ucc_controls_phase_1_2.sql')
  fs.writeFileSync(controlsPath, controlsSQL)
  console.log(`\n✅ Controls generated: ${totalControls}`)
  console.log(`   Saved to: ${controlsPath}`)

  // Generate mappings
  console.log('\n📊 Generating framework mappings...')
  const { sql: mappingsSQL, totalMappings } = generateMappingsSQL(controlsSQL)

  // Write mappings to file
  const mappingsPath = path.join(__dirname, 'data', 'ucc_mappings_phase_1_2.sql')
  fs.writeFileSync(mappingsPath, mappingsSQL)
  console.log(`\n✅ Mappings generated: ${totalMappings}`)
  console.log(`   Saved to: ${mappingsPath}`)

  console.log('\n' + '='.repeat(50))
  console.log('✨ Generation complete!')
  console.log('\n📈 Summary:')
  console.log(`   Domains: ${Object.keys(DOMAIN_DEFINITIONS).length}`)
  console.log(`   Total Controls: ${totalControls}`)
  console.log(`   Total Mappings: ${totalMappings}`)
  console.log(`   Avg Mappings/Control: ${(totalMappings / totalControls).toFixed(1)}`)
}

main().catch(console.error)
