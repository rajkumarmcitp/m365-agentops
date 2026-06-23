/**
 * PowerShell Output Parser
 * Parses PowerShell command output and maps to control status and values
 * Supports JSON, table, and list format parsing
 */

/**
 * Parse PowerShell output and map to control status
 * @param {string} controlId - CIS Control ID
 * @param {string} output - Raw PowerShell output
 * @returns {Object} {status: 'pass'|'fail'|'warn', value: string, details: any}
 */
export function parseControlOutput(controlId, output) {
  // Control-specific parsers
  const parsers = {
    '1.1.1': parseGlobalAdmins,
    '1.1.2': parseEmergencyAccounts,
    '1.1.3': parseAdminCount,
    '1.2.1': parsePublicGroups,
    '1.2.2': parseSharedMailboxSignIn,
    '1.3.4': parseUserOwnedApps,
    '2.1.1': parseSafeLinks,
    '2.1.2': parseAttachmentFilter,
    '3.1.1': parseAuditLogSearch,
    '3.2.1': parseDLPPolicies,
    '5.1.2': parseMFAUsers,
    '6.1.1': parseMailboxAuditing,
    '7.2.1': parseSharePointSharing,
    '8.1.1': parseTeamsSettings,
    '9.1.1': parseFabricGuest
  };

  const parser = parsers[controlId] || parseGeneric;
  return parser(output);
}

/**
 * Parse 1.1.1: Global Admin count
 */
function parseGlobalAdmins(output) {
  if (!output || output.includes('Authentication needed')) {
    return { status: 'warn', value: 'Unable to retrieve data', details: output };
  }

  // Count lines/results from output
  const lines = output.trim().split('\n').filter(l => l.trim());
  const count = lines.length;

  if (count === 0) {
    return { status: 'fail', value: 'No global admins found', details: output };
  }
  if (count === 1) {
    return { status: 'fail', value: '1 Global Admin (minimum is 2)', details: output };
  }
  if (count >= 2 && count <= 4) {
    return { status: 'pass', value: `${count} Global Admins (compliant)`, details: output };
  }
  return { status: 'fail', value: `${count} Global Admins (too many, max is 4)`, details: output };
}

/**
 * Parse 1.1.2: Emergency access accounts
 */
function parseEmergencyAccounts(output) {
  if (!output || output.includes('Authentication needed')) {
    return { status: 'warn', value: 'Unable to retrieve emergency accounts', details: output };
  }

  const lines = output.trim().split('\n').filter(l => l.trim() && !l.includes('-'));
  const count = lines.length;

  if (count < 2) {
    return { status: 'warn', value: `Emergency access accounts: Less than 2 found (${count})`, details: output };
  }
  return { status: 'pass', value: `${count} emergency access accounts configured`, details: output };
}

/**
 * Parse 1.1.3: Admin count
 */
function parseAdminCount(output) {
  if (!output || output.includes('Authentication needed')) {
    return { status: 'warn', value: 'Unable to retrieve admin count', details: output };
  }

  // Extract Count value from Measure-Object output
  const countMatch = output.match(/Count\s+:\s+(\d+)/);
  const count = countMatch ? parseInt(countMatch[1]) : 0;

  if (count >= 2 && count <= 4) {
    return { status: 'pass', value: `${count} Global Admins (compliant)`, details: output };
  }
  return { status: 'warn', value: `${count} Global Admins (target: 2-4)`, details: output };
}

/**
 * Parse 1.2.1: Public groups
 */
function parsePublicGroups(output) {
  if (!output || output.includes('Authentication needed')) {
    return { status: 'warn', value: 'Unable to check public groups', details: output };
  }

  const publicCount = (output.match(/Public/gi) || []).length;

  if (publicCount === 0) {
    return { status: 'pass', value: 'No public groups found', details: output };
  }
  return { status: 'fail', value: `${publicCount} public groups found - should be restricted`, details: output };
}

/**
 * Parse 1.2.2: Shared mailbox sign-in
 */
function parseSharedMailboxSignIn(output) {
  if (!output || output.includes('Authentication needed')) {
    return { status: 'warn', value: 'Unable to check shared mailbox status', details: output };
  }

  const disabledCount = (output.match(/False/gi) || []).length;
  const enabledCount = (output.match(/True/gi) || []).length;

  if (enabledCount > 0) {
    return { status: 'fail', value: `${enabledCount} shared mailbox(es) allow sign-in (should be disabled)`, details: output };
  }
  return { status: 'pass', value: 'All shared mailboxes have sign-in disabled', details: output };
}

/**
 * Parse 1.3.4: User owned apps and services
 */
function parseUserOwnedApps(output) {
  if (!output || output.includes('Authentication needed')) {
    return { status: 'warn', value: 'Unable to check user-owned apps setting', details: output };
  }

  const restricted = output.includes('False') || output.toLowerCase().includes('restricted') || output.toLowerCase().includes('disabled');

  if (restricted) {
    return { status: 'pass', value: 'User-owned apps and services are restricted', details: output };
  }
  return { status: 'warn', value: 'User-owned apps and services restriction status unclear', details: output };
}

/**
 * Parse 2.1.1: Safe Links
 */
function parseSafeLinks(output) {
  if (!output || output.includes('Authentication needed')) {
    return { status: 'warn', value: 'Unable to check Safe Links policy', details: output };
  }

  const enabled = output.includes('True') || output.toLowerCase().includes('enabled');

  if (enabled) {
    return { status: 'pass', value: 'Safe Links for Office Applications is enabled', details: output };
  }
  return { status: 'fail', value: 'Safe Links for Office Applications is not enabled', details: output };
}

/**
 * Parse 2.1.2: Attachment filter
 */
function parseAttachmentFilter(output) {
  if (!output || output.includes('Authentication needed')) {
    return { status: 'warn', value: 'Unable to check attachment filter', details: output };
  }

  const enabled = output.includes('True') || output.toLowerCase().includes('enabled');

  if (enabled) {
    return { status: 'pass', value: 'Common Attachment Types Filter is enabled', details: output };
  }
  return { status: 'fail', value: 'Common Attachment Types Filter is not enabled', details: output };
}

/**
 * Parse 3.1.1: Audit log search
 */
function parseAuditLogSearch(output) {
  if (!output || output.includes('Authentication needed')) {
    return { status: 'warn', value: 'Unable to check audit log status', details: output };
  }

  const enabled = output.includes('True') || output.toLowerCase().includes('enabled');

  if (enabled) {
    return { status: 'pass', value: 'Microsoft 365 audit log search is enabled', details: output };
  }
  return { status: 'fail', value: 'Microsoft 365 audit log search is not enabled', details: output };
}

/**
 * Parse 3.2.1: DLP policies
 */
function parseDLPPolicies(output) {
  if (!output || output.includes('Authentication needed')) {
    return { status: 'warn', value: 'Unable to check DLP policies', details: output };
  }

  const policies = output.split('\n').filter(l => l.trim() && !l.includes('-')).length;

  if (policies > 0) {
    return { status: 'pass', value: `${policies} DLP policies configured`, details: output };
  }
  return { status: 'warn', value: 'No DLP policies found', details: output };
}

/**
 * Parse 5.1.2: MFA for users
 */
function parseMFAUsers(output) {
  if (!output || output.includes('Authentication needed')) {
    return { status: 'warn', value: 'Unable to check MFA status', details: output };
  }

  const enabled = output.includes('True') || output.toLowerCase().includes('enabled');

  if (enabled) {
    return { status: 'pass', value: 'MFA is enabled for users', details: output };
  }
  return { status: 'fail', value: 'MFA is not enabled for all users', details: output };
}

/**
 * Parse 6.1.1: Mailbox auditing
 */
function parseMailboxAuditing(output) {
  if (!output || output.includes('Authentication needed')) {
    return { status: 'warn', value: 'Unable to check mailbox auditing', details: output };
  }

  const enabled = output.includes('True') || output.toLowerCase().includes('enabled');
  const auditCount = (output.match(/audit/gi) || []).length;

  if (enabled && auditCount > 0) {
    return { status: 'pass', value: 'Mailbox audit logging is enabled', details: output };
  }
  return { status: 'warn', value: 'Mailbox audit logging status unclear', details: output };
}

/**
 * Parse 7.2.1: SharePoint sharing
 */
function parseSharePointSharing(output) {
  if (!output || output.includes('Authentication needed')) {
    return { status: 'warn', value: 'Unable to check SharePoint sharing', details: output };
  }

  const restricted = output.includes('False') || output.toLowerCase().includes('restricted');

  if (restricted) {
    return { status: 'pass', value: 'SharePoint external sharing is restricted', details: output };
  }
  return { status: 'fail', value: 'SharePoint external sharing is not properly restricted', details: output };
}

/**
 * Parse 8.1.1: Teams settings
 */
function parseTeamsSettings(output) {
  if (!output || output.includes('Authentication needed')) {
    return { status: 'warn', value: 'Unable to check Teams settings', details: output };
  }

  const configured = output.split('\n').filter(l => l.trim()).length > 0;

  if (configured) {
    return { status: 'pass', value: 'Teams policies are configured', details: output };
  }
  return { status: 'warn', value: 'Teams policies status unclear', details: output };
}

/**
 * Parse 9.1.1: Fabric guest access
 */
function parseFabricGuest(output) {
  if (!output || output.includes('Authentication needed')) {
    return { status: 'warn', value: 'Unable to check Fabric guest access', details: output };
  }

  const restricted = output.includes('False') || output.toLowerCase().includes('disabled');

  if (restricted) {
    return { status: 'pass', value: 'Fabric guest access is restricted', details: output };
  }
  return { status: 'fail', value: 'Fabric guest access is not restricted', details: output };
}

/**
 * Generic parser for controls without specific parser
 */
function parseGeneric(output) {
  if (!output || output.length === 0) {
    return { status: 'warn', value: 'No validation output available', details: output };
  }

  if (output.includes('Authentication needed') || output.includes('error')) {
    return { status: 'warn', value: 'Validation encountered an issue', details: output };
  }

  // Check for common success/failure keywords
  if (output.toLowerCase().includes('enabled') || output.toLowerCase().includes('true') || output.toLowerCase().includes('configured')) {
    return { status: 'pass', value: 'Validation passed', details: output };
  }

  if (output.toLowerCase().includes('disabled') || output.toLowerCase().includes('false') || output.toLowerCase().includes('not found')) {
    return { status: 'fail', value: 'Validation failed', details: output };
  }

  return { status: 'warn', value: 'Validation status unclear', details: output };
}

/**
 * Get friendly display value for control based on output
 * @param {string} controlId - Control ID
 * @param {string} output - Validation output
 * @returns {string} Friendly display value
 */
export function getControlValueFromOutput(controlId, output) {
  const result = parseControlOutput(controlId, output);
  return result.value;
}

/**
 * Get control status from output
 * @param {string} controlId - Control ID
 * @param {string} output - Validation output
 * @returns {string} Status: 'pass', 'fail', or 'warn'
 */
export function getStatusFromOutput(controlId, output) {
  const result = parseControlOutput(controlId, output);
  return result.status;
}
