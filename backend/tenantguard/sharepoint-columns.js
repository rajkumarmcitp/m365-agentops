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
        allowMultipleLines: true,
        maxLength: 10000,
        appendChangesToExistingText: false,
        linesForEditing: 0
      }
      break
    case 'number':
      payload.number = {
        decimalPlaces: 0,
        minimum: null,
        maximum: null
      }
      break
    case 'dateTime':
      payload.dateTime = {
        format: 'dateTime',
        displayAs: 'default'
      }
      break
    case 'boolean':
      payload.boolean = {}
      break
    case 'choice':
      payload.choice = {
        choices: (column.choices || []).map(c => ({ label: c })),
        allowMultipleSelection: false,
        displayAs: 'dropDownMenu'
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
    default:
      return []
  }
}

export default {
  TENANTGUARD_ALERTS_COLUMNS,
  TENANTGUARD_CORRELATIONS_COLUMNS,
  TENANTGUARD_INVESTIGATIONS_COLUMNS,
  buildColumnPayload,
  getColumnsForList
}
