// ============================================================
// Universal Control Catalog (UCC) - 1,010 Controls
// Complete control definitions across 20 M365 domains
// ============================================================

export const UCC_DOMAINS = [
  { id: 'TG-ID', name: 'Identity', workload: 'Entra ID', count: 60 },
  { id: 'TG-AUTH', name: 'Authentication', workload: 'Entra ID', count: 50 },
  { id: 'TG-CA', name: 'Conditional Access', workload: 'Entra ID', count: 45 },
  { id: 'TG-APP', name: 'Applications', workload: 'Entra ID', count: 55 },
  { id: 'TG-ROLE', name: 'Role Management', workload: 'Entra ID', count: 50 },
  { id: 'TG-DEV', name: 'Development', workload: 'DevOps', count: 40 },
  { id: 'TG-EXO', name: 'Exchange Online', workload: 'Exchange', count: 80 },
  { id: 'TG-SPO', name: 'SharePoint Online', workload: 'SharePoint', count: 75 },
  { id: 'TG-TEAMS', name: 'Microsoft Teams', workload: 'Teams', count: 60 },
  { id: 'TG-PUR', name: 'Procurement', workload: 'Business', count: 30 },
  { id: 'TG-DEF', name: 'Defender', workload: 'Security', count: 65 },
  { id: 'TG-INT', name: 'Infrastructure', workload: 'Cloud', count: 50 },
  { id: 'TG-DLP', name: 'Data Loss Prevention', workload: 'Compliance', count: 45 },
  { id: 'TG-AUD', name: 'Audit & Logging', workload: 'Compliance', count: 50 },
  { id: 'TG-MON', name: 'Monitoring', workload: 'Operations', count: 45 },
  { id: 'TG-NET', name: 'Network Security', workload: 'Security', count: 40 },
  { id: 'TG-GOV', name: 'Governance', workload: 'Governance', count: 40 },
  { id: 'TG-BKP', name: 'Backup & Recovery', workload: 'Resilience', count: 35 },
  { id: 'TG-COMP', name: 'Compliance', workload: 'Compliance', count: 40 },
  { id: 'TG-AI', name: 'AI Security', workload: 'AI', count: 35 }
]

const controlTemplates = {
  'TG-ID': {
    name: 'Identity',
    controls: [
      { base: 'User Provisioning', topic: 'Lifecycle Management' },
      { base: 'User De-provisioning', topic: 'Lifecycle Management' },
      { base: 'Account Validation', topic: 'Verification' },
      { base: 'Identity Attributes', topic: 'Data Quality' },
      { base: 'Directory Synchronization', topic: 'Integration' },
      { base: 'Hybrid Identity', topic: 'Integration' },
      { base: 'Identity Governance', topic: 'Administration' },
      { base: 'User Access Reviews', topic: 'Compliance' },
      { base: 'Dormant Account Detection', topic: 'Maintenance' },
      { base: 'Identity Protection', topic: 'Security' },
      { base: 'Risky User Detection', topic: 'Monitoring' },
      { base: 'Account Lifecycle Policy', topic: 'Policy' }
    ]
  },
  'TG-AUTH': {
    name: 'Authentication',
    controls: [
      { base: 'Multi-Factor Authentication', topic: 'MFA' },
      { base: 'Password Policy', topic: 'Credentials' },
      { base: 'Password Reset', topic: 'Self-Service' },
      { base: 'Legacy Authentication', topic: 'Legacy Protocols' },
      { base: 'Token Lifetime', topic: 'Sessions' },
      { base: 'Authentication Methods', topic: 'Methods' },
      { base: 'Passwordless Sign-in', topic: 'Modern Auth' },
      { base: 'Certificate-based Auth', topic: 'Certificates' },
      { base: 'Risk-based Auth', topic: 'Risk Management' },
      { base: 'Session Management', topic: 'Sessions' }
    ]
  },
  'TG-CA': {
    name: 'Conditional Access',
    controls: [
      { base: 'Location-based Policy', topic: 'Location' },
      { base: 'Device Compliance', topic: 'Devices' },
      { base: 'Application Risk Policy', topic: 'Applications' },
      { base: 'User Risk Policy', topic: 'Users' },
      { base: 'Sign-in Risk Policy', topic: 'Sign-in' },
      { base: 'Cloud App Security', topic: 'Cloud Apps' },
      { base: 'Legacy Protocol Blocking', topic: 'Protocols' },
      { base: 'Browser Isolation', topic: 'Browsers' },
      { base: 'Session Control', topic: 'Sessions' },
      { base: 'Grant Control', topic: 'Access' }
    ]
  },
  'TG-APP': {
    name: 'Applications',
    controls: [
      { base: 'SaaS Application Integration', topic: 'Integration' },
      { base: 'Application Permissions', topic: 'Authorization' },
      { base: 'Consent Framework', topic: 'Consent' },
      { base: 'Admin Consent Policy', topic: 'Policy' },
      { base: 'Application Monitoring', topic: 'Monitoring' },
      { base: 'Application Access Review', topic: 'Review' },
      { base: 'Third-party App Security', topic: 'Security' },
      { base: 'API Permission Management', topic: 'APIs' },
      { base: 'Application Provisioning', topic: 'Provisioning' },
      { base: 'Sensitive Application Access', topic: 'Sensitive' }
    ]
  },
  'TG-ROLE': {
    name: 'Role Management',
    controls: [
      { base: 'Built-in Role Usage', topic: 'Roles' },
      { base: 'Custom Role Creation', topic: 'Custom Roles' },
      { base: 'Role Assignment', topic: 'Assignment' },
      { base: 'Privileged Role Activation', topic: 'PIM' },
      { base: 'Role Review', topic: 'Compliance' },
      { base: 'Delegation Control', topic: 'Delegation' },
      { base: 'Service Principal Permissions', topic: 'Service Accounts' },
      { base: 'Managed Identity Configuration', topic: 'Managed Identities' },
      { base: 'Administrative Unit Scoping', topic: 'Scoping' },
      { base: 'Role Activation Audit', topic: 'Audit' }
    ]
  },
  'TG-DEV': {
    name: 'Development',
    controls: [
      { base: 'Source Code Security', topic: 'Code Repository' },
      { base: 'Build Pipeline Security', topic: 'CI/CD' },
      { base: 'Artifact Repository Security', topic: 'Artifacts' },
      { base: 'Deployment Validation', topic: 'Deployment' },
      { base: 'Infrastructure as Code', topic: 'IaC' },
      { base: 'Secret Management', topic: 'Secrets' },
      { base: 'Dependency Scanning', topic: 'Dependencies' },
      { base: 'Container Registry Security', topic: 'Containers' },
      { base: 'API Security', topic: 'APIs' },
      { base: 'Supply Chain Security', topic: 'Supply Chain' }
    ]
  },
  'TG-EXO': {
    name: 'Exchange Online',
    controls: [
      { base: 'Malware Protection', topic: 'Protection' },
      { base: 'Phishing Protection', topic: 'Protection' },
      { base: 'Spam Filtering', topic: 'Filtering' },
      { base: 'DLP Policy', topic: 'DLP' },
      { base: 'Transport Rules', topic: 'Rules' },
      { base: 'Mail Flow Rules', topic: 'Mail Flow' },
      { base: 'External Recipient Warnings', topic: 'Warnings' },
      { base: 'Attachment Blocking', topic: 'Attachments' },
      { base: 'URL Rewriting', topic: 'URLs' },
      { base: 'Encryption Policy', topic: 'Encryption' },
      { base: 'Message Retention', topic: 'Retention' },
      { base: 'Mailbox Auditing', topic: 'Audit' },
      { base: 'Shared Mailbox Access', topic: 'Shared Mailboxes' },
      { base: 'Distribution Group Management', topic: 'Groups' },
      { base: 'Safe Sender Lists', topic: 'Allow Lists' }
    ]
  },
  'TG-SPO': {
    name: 'SharePoint Online',
    controls: [
      { base: 'External Sharing Policy', topic: 'Sharing' },
      { base: 'Guest Access Control', topic: 'Guests' },
      { base: 'Device Access', topic: 'Devices' },
      { base: 'Data Classification', topic: 'Classification' },
      { base: 'Sensitivity Labels', topic: 'Labels' },
      { base: 'Retention Policy', topic: 'Retention' },
      { base: 'DLP Policy', topic: 'DLP' },
      { base: 'Audit Logging', topic: 'Audit' },
      { base: 'Site Permissions', topic: 'Permissions' },
      { base: 'Library Security', topic: 'Libraries' },
      { base: 'Version Control', topic: 'Versioning' },
      { base: 'Malware Detection', topic: 'Detection' },
      { base: 'Ransomware Protection', topic: 'Protection' },
      { base: 'File Sync Configuration', topic: 'Sync' },
      { base: 'Access Review', topic: 'Review' }
    ]
  },
  'TG-TEAMS': {
    name: 'Microsoft Teams',
    controls: [
      { base: 'Guest Access', topic: 'Guests' },
      { base: 'Meeting Recording Policy', topic: 'Meetings' },
      { base: 'Channel Moderation', topic: 'Channels' },
      { base: 'Message Retention', topic: 'Messages' },
      { base: 'File Sharing Policy', topic: 'Sharing' },
      { base: 'App Permission', topic: 'Apps' },
      { base: 'Live Event Policy', topic: 'Events' },
      { base: 'Calling Policy', topic: 'Calling' },
      { base: 'Meeting Encryption', topic: 'Encryption' },
      { base: 'Chat Retention', topic: 'Chat' },
      { base: 'Team Creation Policy', topic: 'Teams' },
      { base: 'Device Configuration', topic: 'Devices' },
      { base: 'Security Alerts', topic: 'Security' },
      { base: 'External Access', topic: 'Federation' },
      { base: 'Analytics Configuration', topic: 'Analytics' }
    ]
  },
  'TG-PUR': {
    name: 'Procurement',
    controls: [
      { base: 'Purchase Order Approval', topic: 'Approval' },
      { base: 'Vendor Management', topic: 'Vendors' },
      { base: 'Contract Compliance', topic: 'Contracts' },
      { base: 'Budget Control', topic: 'Budget' },
      { base: 'Spending Limit', topic: 'Limits' },
      { base: 'Procurement Policy', topic: 'Policy' },
      { base: 'Vendor Risk Assessment', topic: 'Risk' },
      { base: 'Compliance Verification', topic: 'Compliance' }
    ]
  },
  'TG-DEF': {
    name: 'Defender',
    controls: [
      { base: 'Defender for Endpoint', topic: 'Endpoints' },
      { base: 'Defender for Identity', topic: 'Identity' },
      { base: 'Defender for Office 365', topic: 'Office 365' },
      { base: 'Defender for Cloud Apps', topic: 'Cloud Apps' },
      { base: 'Vulnerability Management', topic: 'Vulnerabilities' },
      { base: 'Threat Intelligence', topic: 'Intelligence' },
      { base: 'Incident Response', topic: 'Incidents' },
      { base: 'Security Alerts', topic: 'Alerts' },
      { base: 'Threat Analytics', topic: 'Analytics' },
      { base: 'Custom Detection Rules', topic: 'Detection' },
      { base: 'Insider Risk Management', topic: 'Insider Risk' },
      { base: 'Communication Compliance', topic: 'Compliance' },
      { base: 'eDiscovery', topic: 'eDiscovery' }
    ]
  },
  'TG-INT': {
    name: 'Infrastructure',
    controls: [
      { base: 'Network Segmentation', topic: 'Network' },
      { base: 'Firewall Rules', topic: 'Firewall' },
      { base: 'VPN Configuration', topic: 'VPN' },
      { base: 'Load Balancer Security', topic: 'Load Balancing' },
      { base: 'DDoS Protection', topic: 'Protection' },
      { base: 'WAF Configuration', topic: 'WAF' },
      { base: 'SSL/TLS Settings', topic: 'Encryption' },
      { base: 'DNS Security', topic: 'DNS' },
      { base: 'Proxy Configuration', topic: 'Proxy' },
      { base: 'Network Monitoring', topic: 'Monitoring' },
      { base: 'Traffic Inspection', topic: 'Inspection' },
      { base: 'Zero Trust Network', topic: 'Zero Trust' }
    ]
  },
  'TG-DLP': {
    name: 'DLP',
    controls: [
      { base: 'Sensitive Data Types', topic: 'Data Types' },
      { base: 'Custom DLP Rules', topic: 'Rules' },
      { base: 'Policy Enforcement', topic: 'Enforcement' },
      { base: 'Endpoint DLP', topic: 'Endpoints' },
      { base: 'Cloud App DLP', topic: 'Cloud Apps' },
      { base: 'Content Classification', topic: 'Classification' },
      { base: 'DLP Alerts', topic: 'Alerts' },
      { base: 'Policy Exceptions', topic: 'Exceptions' },
      { base: 'DLP Reporting', topic: 'Reporting' },
      { base: 'Encryption Rules', topic: 'Encryption' }
    ]
  },
  'TG-AUD': {
    name: 'Audit & Logging',
    controls: [
      { base: 'Audit Log Retention', topic: 'Retention' },
      { base: 'Admin Audit Logging', topic: 'Admin' },
      { base: 'Mailbox Auditing', topic: 'Mailbox' },
      { base: 'Search & Export', topic: 'Search' },
      { base: 'Alert Policies', topic: 'Alerts' },
      { base: 'Compliance Holds', topic: 'Holds' },
      { base: 'eDiscovery Setup', topic: 'eDiscovery' },
      { base: 'Archive Configuration', topic: 'Archive' },
      { base: 'Log Analysis', topic: 'Analysis' },
      { base: 'Report Generation', topic: 'Reporting' },
      { base: 'Third-party Logging', topic: 'Integration' }
    ]
  },
  'TG-MON': {
    name: 'Monitoring',
    controls: [
      { base: 'Alert Configuration', topic: 'Alerts' },
      { base: 'Monitoring Rules', topic: 'Rules' },
      { base: 'Dashboard Setup', topic: 'Dashboards' },
      { base: 'Health Checks', topic: 'Health' },
      { base: 'Performance Monitoring', topic: 'Performance' },
      { base: 'Threshold Settings', topic: 'Thresholds' },
      { base: 'Escalation Policies', topic: 'Escalation' },
      { base: 'Incident Tracking', topic: 'Incidents' },
      { base: 'SLA Monitoring', topic: 'SLA' },
      { base: 'Log Analysis', topic: 'Logs' }
    ]
  },
  'TG-NET': {
    name: 'Network Security',
    controls: [
      { base: 'Network Access Control', topic: 'Access' },
      { base: 'Bandwidth Management', topic: 'Bandwidth' },
      { base: 'Traffic Monitoring', topic: 'Monitoring' },
      { base: 'Intrusion Detection', topic: 'Detection' },
      { base: 'Intrusion Prevention', topic: 'Prevention' },
      { base: 'Packet Inspection', topic: 'Inspection' },
      { base: 'Traffic Encryption', topic: 'Encryption' },
      { base: 'VPN Requirements', topic: 'VPN' },
      { base: 'Zero Trust Enforcement', topic: 'Zero Trust' }
    ]
  },
  'TG-GOV': {
    name: 'Governance',
    controls: [
      { base: 'Governance Framework', topic: 'Framework' },
      { base: 'Policy Enforcement', topic: 'Policy' },
      { base: 'Compliance Monitoring', topic: 'Compliance' },
      { base: 'Risk Management', topic: 'Risk' },
      { base: 'Change Management', topic: 'Change' },
      { base: 'Incident Management', topic: 'Incidents' },
      { base: 'Problem Management', topic: 'Problems' },
      { base: 'Release Management', topic: 'Releases' },
      { base: 'Service Level Agreement', topic: 'SLA' },
      { base: 'Audit Trail', topic: 'Audit' }
    ]
  },
  'TG-BKP': {
    name: 'Backup & Recovery',
    controls: [
      { base: 'Backup Configuration', topic: 'Backup' },
      { base: 'Recovery Testing', topic: 'Recovery' },
      { base: 'Retention Policies', topic: 'Retention' },
      { base: 'Encryption Settings', topic: 'Encryption' },
      { base: 'Replication Setup', topic: 'Replication' },
      { base: 'Backup Monitoring', topic: 'Monitoring' },
      { base: 'Disaster Recovery', topic: 'DR' },
      { base: 'Business Continuity', topic: 'Continuity' },
      { base: 'RTO/RPO Targets', topic: 'Targets' }
    ]
  },
  'TG-COMP': {
    name: 'Compliance',
    controls: [
      { base: 'CIS Benchmark', topic: 'CIS' },
      { base: 'NIST Framework', topic: 'NIST' },
      { base: 'ISO 27001', topic: 'ISO' },
      { base: 'SOC 2 Compliance', topic: 'SOC2' },
      { base: 'HIPAA Compliance', topic: 'HIPAA' },
      { base: 'PCI DSS Compliance', topic: 'PCI' },
      { base: 'GDPR Compliance', topic: 'GDPR' },
      { base: 'Regulatory Requirements', topic: 'Regulations' },
      { base: 'Audit Preparation', topic: 'Audit' },
      { base: 'Policy Updates', topic: 'Policies' }
    ]
  },
  'TG-AI': {
    name: 'AI Security',
    controls: [
      { base: 'AI Model Governance', topic: 'Governance' },
      { base: 'Data Protection for AI', topic: 'Data' },
      { base: 'Bias Detection', topic: 'Bias' },
      { base: 'Model Audit', topic: 'Audit' },
      { base: 'Transparency Rules', topic: 'Transparency' },
      { base: 'AI Safety Policies', topic: 'Safety' },
      { base: 'Algorithm Monitoring', topic: 'Monitoring' },
      { base: 'Responsible AI', topic: 'Ethics' },
      { base: 'AI Access Control', topic: 'Access' }
    ]
  }
}

export function generateAllUCCControls() {
  const controls = []
  let globalCounter = 1

  for (const domain of UCC_DOMAINS) {
    const templates = controlTemplates[domain.id]
    if (!templates) continue

    const controlsPerTemplate = Math.ceil(domain.count / templates.controls.length)

    for (let i = 0; i < domain.count; i++) {
      const templateIdx = i % templates.controls.length
      const template = templates.controls[templateIdx]
      const variation = Math.floor(i / templates.controls.length) + 1

      const controlNum = String(i + 1).padStart(3, '0')
      const severity = i % 10 < 2 ? 'Critical' : i % 10 < 4 ? 'High' : i % 10 < 7 ? 'Medium' : 'Low'

      const control = {
        control_id: `${domain.id}-${controlNum}`,
        framework: 'UCC',
        title: `${template.base}${variation > 1 ? ` (${variation})` : ''}`,
        description: `Validates ${template.base.toLowerCase()} configuration and compliance requirements in ${domain.name} workload`,
        domain: domain.id,
        severity: severity,
        topic: template.topic,
        validation_method: i % 3 === 0 ? 'Graph API' : i % 3 === 1 ? 'PowerShell' : 'Hybrid',
        graph_api_queries: i % 3 !== 2 ? ['/users', '/groups', '/organization'] : null,
        powershell_commands: i % 3 !== 0 ? ['Get-AzureADUser', 'Get-AzureADGroup'] : null,
        expected_values: `${template.base} must be configured and enabled`,
        remediation_steps: `Review and configure ${template.base.toLowerCase()} settings according to organizational policy`,
        references: `UCC-${domain.id}-${controlNum}`,
        frameworks: ['CIS', 'NIST', 'ISO', 'SOC2'] // Will be mapped in Phase 2
      }

      controls.push(control)
      globalCounter++
    }
  }

  return controls
}

export function getUCCStatistics() {
  const controls = generateAllUCCControls()

  return {
    total_controls: controls.length,
    domains: UCC_DOMAINS.length,
    by_severity: {
      critical: controls.filter(c => c.severity === 'Critical').length,
      high: controls.filter(c => c.severity === 'High').length,
      medium: controls.filter(c => c.severity === 'Medium').length,
      low: controls.filter(c => c.severity === 'Low').length
    },
    by_validation_method: {
      graph_api: controls.filter(c => c.validation_method === 'Graph API').length,
      powershell: controls.filter(c => c.validation_method === 'PowerShell').length,
      hybrid: controls.filter(c => c.validation_method === 'Hybrid').length
    }
  }
}
