/**
 * TenantGuard SharePoint Column Schemas
 * Defines custom columns for all three lists
 */

export const TENANTGUARD_ALERTS_COLUMNS = [
  {
    name: 'AlertID',
    type: 'text',
    displayName: 'Alert ID',
    required: true,
    description: 'Unique alert identifier'
  },
  {
    name: 'Priority',
    type: 'choice',
    displayName: 'Priority',
    required: true,
    choices: ['P1', 'P2', 'P3'],
    defaultValue: 'P3',
    description: 'P1=Critical/Immediate, P2=High/4hrs, P3=Info/24hrs'
  },
  {
    name: 'Severity',
    type: 'choice',
    displayName: 'Severity',
    required: true,
    choices: ['CRITICAL', 'HIGH', 'MEDIUM', 'LOW'],
    defaultValue: 'MEDIUM',
    description: 'Severity level of the alert'
  },
  {
    name: 'RiskScore',
    type: 'number',
    displayName: 'Risk Score',
    required: true,
    description: 'Risk score 0-100'
  },
  {
    name: 'Category',
    type: 'choice',
    displayName: 'Category',
    required: true,
    choices: [
      'Identity & Access',
      'Application Security',
      'Exchange Online',
      'SharePoint & OneDrive',
      'Teams',
      'Device & Intune',
      'DLP & Compliance',
      'Defender Security',
      'Service Health',
      'Configuration Drift'
    ],
    description: 'Security category'
  },
  {
    name: 'Description',
    type: 'multilineText',
    displayName: 'Description',
    required: true,
    description: 'Detailed alert description'
  },
  {
    name: 'Actor',
    type: 'text',
    displayName: 'Actor',
    required: true,
    description: 'User or service that triggered the alert'
  },
  {
    name: 'Target',
    type: 'text',
    displayName: 'Target',
    required: false,
    description: 'Resource affected (mailbox, policy, user, etc.)'
  },
  {
    name: 'Source',
    type: 'choice',
    displayName: 'Source',
    required: true,
    choices: ['Entra ID', 'Exchange Online', 'SharePoint', 'Identity Protection', 'Intune', 'Defender', 'Purview'],
    description: 'Alert source system'
  },
  {
    name: 'ActionTimestamp',
    type: 'dateTime',
    displayName: 'Action Timestamp',
    required: true,
    description: 'When the alert occurred'
  },
  {
    name: 'AlertType',
    type: 'text',
    displayName: 'Alert Type',
    required: false,
    description: 'ADMIN, EXCHANGE, SECURITY, APPLICATION'
  },
  {
    name: 'RiskAssessment',
    type: 'multilineText',
    displayName: 'Risk Assessment',
    required: false,
    description: 'JSON risk assessment data'
  },
  {
    name: 'Recommendations',
    type: 'multilineText',
    displayName: 'Recommendations',
    required: false,
    description: 'JSON array of remediation steps'
  },
  {
    name: 'Dismissed',
    type: 'boolean',
    displayName: 'Dismissed',
    required: true,
    defaultValue: false,
    description: 'Whether alert has been dismissed'
  },
  {
    name: 'DismissedAt',
    type: 'dateTime',
    displayName: 'Dismissed At',
    required: false,
    description: 'When alert was dismissed'
  },
  {
    name: 'DismissReason',
    type: 'text',
    displayName: 'Dismiss Reason',
    required: false,
    description: 'Why the alert was dismissed'
  },
  {
    name: 'RawEvent',
    type: 'multilineText',
    displayName: 'Raw Event',
    required: false,
    description: 'Full event JSON from source'
  }
]

export const TENANTGUARD_CORRELATIONS_COLUMNS = [
  {
    name: 'CorrelationID',
    type: 'text',
    displayName: 'Correlation ID',
    required: true,
    description: 'Unique correlation identifier'
  },
  {
    name: 'CorrelationType',
    type: 'choice',
    displayName: 'Correlation Type',
    required: true,
    choices: ['ACTOR', 'TARGET', 'TEMPORAL', 'PATTERN'],
    description: 'Type of correlation'
  },
  {
    name: 'PatternType',
    type: 'text',
    displayName: 'Pattern Type',
    required: true,
    description: 'Attack pattern (PRIVILEGE_ESCALATION, CREDENTIAL_COMPROMISE, etc.)'
  },
  {
    name: 'AlertIDs',
    type: 'multilineText',
    displayName: 'Alert IDs',
    required: true,
    description: 'JSON array of related alert IDs'
  },
  {
    name: 'AlertCount',
    type: 'number',
    displayName: 'Alert Count',
    required: true,
    description: 'Number of alerts in correlation'
  },
  {
    name: 'Actor',
    type: 'text',
    displayName: 'Actor',
    required: false,
    description: 'User/service involved (actor-based correlation)'
  },
  {
    name: 'Target',
    type: 'text',
    displayName: 'Target',
    required: false,
    description: 'Resource targeted (target-based correlation)'
  },
  {
    name: 'StartTimestamp',
    type: 'dateTime',
    displayName: 'Start Timestamp',
    required: true,
    description: 'When correlation period begins'
  },
  {
    name: 'EndTimestamp',
    type: 'dateTime',
    displayName: 'End Timestamp',
    required: true,
    description: 'When correlation period ends'
  },
  {
    name: 'CorrelationScore',
    type: 'number',
    displayName: 'Correlation Score',
    required: true,
    description: 'Confidence score 0-100'
  },
  {
    name: 'RiskLevel',
    type: 'choice',
    displayName: 'Risk Level',
    required: true,
    choices: ['CRITICAL', 'HIGH', 'MEDIUM', 'LOW'],
    defaultValue: 'MEDIUM',
    description: 'Risk level of correlation'
  },
  {
    name: 'Description',
    type: 'multilineText',
    displayName: 'Description',
    required: true,
    description: 'What this correlation represents'
  },
  {
    name: 'Metadata',
    type: 'multilineText',
    displayName: 'Metadata',
    required: false,
    description: 'JSON with additional context'
  },
  {
    name: 'Dismissed',
    type: 'boolean',
    displayName: 'Dismissed',
    required: true,
    defaultValue: false,
    description: 'Whether correlation has been dismissed'
  },
  {
    name: 'DismissedAt',
    type: 'dateTime',
    displayName: 'Dismissed At',
    required: false,
    description: 'When correlation was dismissed'
  },
  {
    name: 'DismissReason',
    type: 'text',
    displayName: 'Dismiss Reason',
    required: false,
    description: 'Why correlation was dismissed'
  }
]

export const TENANTGUARD_INVESTIGATIONS_COLUMNS = [
  {
    name: 'InvestigationID',
    type: 'text',
    displayName: 'Investigation ID',
    required: true,
    description: 'Unique investigation identifier'
  },
  {
    name: 'InvestigationType',
    type: 'choice',
    displayName: 'Investigation Type',
    required: true,
    choices: ['ALERT', 'CORRELATION', 'PATTERN'],
    description: 'Type of investigation'
  },
  {
    name: 'Status',
    type: 'choice',
    displayName: 'Status',
    required: true,
    choices: ['OPEN', 'IN_PROGRESS', 'RESOLVED', 'CLOSED'],
    defaultValue: 'OPEN',
    description: 'Investigation status'
  },
  {
    name: 'Priority',
    type: 'choice',
    displayName: 'Priority',
    required: true,
    choices: ['P1', 'P2', 'P3'],
    description: 'Priority level'
  },
  {
    name: 'Severity',
    type: 'choice',
    displayName: 'Severity',
    required: true,
    choices: ['CRITICAL', 'HIGH', 'MEDIUM', 'LOW'],
    description: 'Severity level'
  },
  {
    name: 'RiskScore',
    type: 'number',
    displayName: 'Risk Score',
    required: true,
    description: 'Risk score 0-100'
  },
  {
    name: 'StartedBy',
    type: 'text',
    displayName: 'Started By',
    required: true,
    description: 'User who started investigation'
  },
  {
    name: 'StartedAt',
    type: 'dateTime',
    displayName: 'Started At',
    required: true,
    description: 'When investigation started'
  },
  {
    name: 'CompletedAt',
    type: 'dateTime',
    displayName: 'Completed At',
    required: false,
    description: 'When investigation completed'
  },
  {
    name: 'CorrelationIDs',
    type: 'multilineText',
    displayName: 'Correlation IDs',
    required: false,
    description: 'JSON array of related correlation IDs'
  },
  {
    name: 'AlertIDs',
    type: 'multilineText',
    displayName: 'Alert IDs',
    required: false,
    description: 'JSON array of related alert IDs'
  },
  {
    name: 'InvestigationNotes',
    type: 'multilineText',
    displayName: 'Investigation Notes',
    required: false,
    description: 'Investigator notes and findings'
  },
  {
    name: 'AIAnalysis',
    type: 'multilineText',
    displayName: 'AI Analysis',
    required: false,
    description: 'Claude AI investigation analysis'
  },
  {
    name: 'Recommendations',
    type: 'multilineText',
    displayName: 'Recommendations',
    required: false,
    description: 'JSON array of recommended actions'
  },
  {
    name: 'ReportGenerated',
    type: 'boolean',
    displayName: 'Report Generated',
    required: false,
    defaultValue: false,
    description: 'Whether report was created'
  },
  {
    name: 'ReportURL',
    type: 'text',
    displayName: 'Report URL',
    required: false,
    description: 'Link to generated report'
  }
]

/**
 * Convert column definition to Graph API format
 * Uses minimal required properties for Graph API v1.0 compatibility
 */
export function buildColumnPayload(column) {
  const payload = {
    name: column.name,
    description: column.description || '',
    indexed: false,
    hidden: false,
    required: false
  }

  // Build the proper column definition based on type - Graph API format
  switch (column.type) {
    case 'text':
      payload.text = {
        maxLength: 255,
        allowMultipleLines: false
      }
      break
    case 'multilineText':
      payload.text = {
        allowMultipleLines: true
      }
      break
    case 'number':
      payload.number = {}
      break
    case 'dateTime':
      payload.dateTime = {
        format: 'dateTime'
      }
      break
    case 'boolean':
      payload.boolean = {}
      break
    case 'choice':
      payload.choice = {
        choices: (column.choices || []).map(c => ({ label: c }))
      }
      break
    default:
      // Default to text
      payload.text = {
        maxLength: 255,
        allowMultipleLines: false
      }
  }

  return payload
}

/**
 * Get all column schemas for a list
 */
export function getColumnsForList(listType) {
  switch (listType) {
    case 'alerts':
      return TENANTGUARD_ALERTS_COLUMNS
    case 'correlations':
      return TENANTGUARD_CORRELATIONS_COLUMNS
    case 'investigations':
      return TENANTGUARD_INVESTIGATIONS_COLUMNS
    case 'validations':
      return ZEROTRUST_VALIDATIONS_COLUMNS
    case 'results':
      return ZEROTRUST_RESULTS_COLUMNS
    case 'history':
      return ZEROTRUST_HISTORY_COLUMNS
    default:
      return []
  }
}

export const ZEROTRUST_VALIDATIONS_COLUMNS = [
  {
    name: 'ControlID',
    type: 'text',
    displayName: 'Control ID',
    required: true,
    description: 'Unique control identifier (e.g., ID-001, DEV-001, AI-006)'
  },
  {
    name: 'ControlName',
    type: 'text',
    displayName: 'Control Name',
    required: true,
    description: 'Display name of the security control'
  },
  {
    name: 'Pillar',
    type: 'text',
    displayName: 'Pillar',
    required: true,
    description: 'Zero Trust pillar (Identity, Device, AI, Data, Infrastructure, Application, Network, Email, Threat)'
  },
  {
    name: 'Category',
    type: 'text',
    displayName: 'Category',
    required: false,
    description: 'Security category within the pillar'
  },
  {
    name: 'Severity',
    type: 'text',
    displayName: 'Severity',
    required: true,
    description: 'Severity level of the control (CRITICAL, HIGH, MEDIUM, LOW, INFO)'
  },
  {
    name: 'Description',
    type: 'multilineText',
    displayName: 'Description',
    required: false,
    description: 'Detailed description of what this control validates'
  },
  {
    name: 'GraphAPI',
    type: 'multilineText',
    displayName: 'Graph API',
    required: false,
    description: 'Graph API queries or endpoints to use for validation'
  },
  {
    name: 'PowerShell',
    type: 'multilineText',
    displayName: 'PowerShell',
    required: false,
    description: 'PowerShell commands for validation'
  },
  {
    name: 'ExpectedValue',
    type: 'multilineText',
    displayName: 'Expected Value',
    required: false,
    description: 'What the correct configuration should be'
  },
  {
    name: 'Remediation',
    type: 'multilineText',
    displayName: 'Remediation',
    required: false,
    description: 'Steps to remediate if validation fails'
  },
  {
    name: 'Priority',
    type: 'number',
    displayName: 'Priority',
    required: false,
    description: 'Priority level (1-5, 1 = highest)'
  },
  {
    name: 'ImpactScore',
    type: 'number',
    displayName: 'Impact Score',
    required: false,
    description: 'Impact score (0-100)'
  },
  {
    name: 'AutoRemediationAvailable',
    type: 'boolean',
    displayName: 'Auto Remediation Available',
    required: false,
    defaultValue: false,
    description: 'Whether this control can be auto-remediated'
  }
]

export const ZEROTRUST_RESULTS_COLUMNS = [
  {
    name: 'ValidationID',
    type: 'text',
    displayName: 'Validation ID',
    required: true,
    description: 'Reference to ControlID being validated'
  },
  {
    name: 'Status',
    type: 'text',
    displayName: 'Status',
    required: true,
    description: 'Validation result status (PASS, FAIL, WARNING, UNKNOWN)'
  },
  {
    name: 'Evidence',
    type: 'multilineText',
    displayName: 'Evidence',
    required: false,
    description: 'JSON data collected from validation'
  },
  {
    name: 'CurrentValue',
    type: 'multilineText',
    displayName: 'Current Value',
    required: false,
    description: 'Current configuration value found during validation'
  },
  {
    name: 'ValidatedAt',
    type: 'dateTime',
    displayName: 'Validated At',
    required: true,
    description: 'When this validation was performed'
  },
  {
    name: 'ValidationMethod',
    type: 'text',
    displayName: 'Validation Method',
    required: true,
    description: 'How the validation was performed (GraphAPI, PowerShell, Manual)'
  },
  {
    name: 'ErrorMessage',
    type: 'text',
    displayName: 'Error Message',
    required: false,
    description: 'Error message if validation failed'
  },
  {
    name: 'Notes',
    type: 'multilineText',
    displayName: 'Notes',
    required: false,
    description: 'Additional notes or context'
  }
]

export const ZEROTRUST_HISTORY_COLUMNS = [
  {
    name: 'HistoryID',
    type: 'text',
    displayName: 'History ID',
    required: true,
    description: 'Unique history entry identifier'
  },
  {
    name: 'ControlID',
    type: 'text',
    displayName: 'Control ID',
    required: true,
    description: 'Reference to the control being tracked'
  },
  {
    name: 'PreviousStatus',
    type: 'text',
    displayName: 'Previous Status',
    required: false,
    description: 'Previous validation status (PASS, FAIL, WARNING, UNKNOWN)'
  },
  {
    name: 'NewStatus',
    type: 'text',
    displayName: 'New Status',
    required: true,
    description: 'New validation status (PASS, FAIL, WARNING, UNKNOWN)'
  },
  {
    name: 'ChangedAt',
    type: 'dateTime',
    displayName: 'Changed At',
    required: true,
    description: 'When the status changed'
  },
  {
    name: 'ChangedBy',
    type: 'text',
    displayName: 'Changed By',
    required: false,
    description: 'User or system that changed the status'
  },
  {
    name: 'Reason',
    type: 'multilineText',
    displayName: 'Reason',
    required: false,
    description: 'Reason for the status change'
  }
]

export default {
  TENANTGUARD_ALERTS_COLUMNS,
  TENANTGUARD_CORRELATIONS_COLUMNS,
  TENANTGUARD_INVESTIGATIONS_COLUMNS,
  ZEROTRUST_VALIDATIONS_COLUMNS,
  ZEROTRUST_RESULTS_COLUMNS,
  ZEROTRUST_HISTORY_COLUMNS,
  buildColumnPayload,
  getColumnsForList
}
