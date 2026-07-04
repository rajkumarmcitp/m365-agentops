/**
 * Directory Audit Categories & AI Agent Framework
 * Organizes Azure AD audit activities into 8 investigation categories
 * Provides severity mappings and AI summarization patterns
 */

export const AUDIT_CATEGORIES = {
  ACCOUNT_LIFECYCLE: 'Account Lifecycle',
  CREDENTIAL_CHANGES: 'Credential Changes',
  PRIVILEGED_ACCESS: 'Privileged Access',
  GROUP_MEMBERSHIP: 'Group Membership',
  LICENSING: 'Licensing',
  APPLICATION_ACCESS: 'Application Access',
  SECURITY_POLICY: 'Security Policy Impact',
  ADMINISTRATIVE: 'Administrative Changes'
};

export const SEVERITY_LEVELS = {
  CRITICAL: 'Critical',
  HIGH: 'High',
  MEDIUM: 'Medium',
  LOW: 'Low'
};

/**
 * Activity -> Category & Severity Mapping
 * Maps audit activity names to investigation categories and risk levels
 */
export const ACTIVITY_MAPPINGS = {
  // Account Lifecycle Activities
  'Add user': { category: AUDIT_CATEGORIES.ACCOUNT_LIFECYCLE, severity: SEVERITY_LEVELS.MEDIUM, icon: '👤' },
  'Update user': { category: AUDIT_CATEGORIES.ACCOUNT_LIFECYCLE, severity: SEVERITY_LEVELS.MEDIUM, icon: '👤' },
  'Delete user': { category: AUDIT_CATEGORIES.ACCOUNT_LIFECYCLE, severity: SEVERITY_LEVELS.HIGH, icon: '👤' },
  'Restore user': { category: AUDIT_CATEGORIES.ACCOUNT_LIFECYCLE, severity: SEVERITY_LEVELS.HIGH, icon: '👤' },
  'Enable user': { category: AUDIT_CATEGORIES.ACCOUNT_LIFECYCLE, severity: SEVERITY_LEVELS.MEDIUM, icon: '👤' },
  'Disable user': { category: AUDIT_CATEGORIES.ACCOUNT_LIFECYCLE, severity: SEVERITY_LEVELS.HIGH, icon: '👤' },

  // Credential Changes
  'Reset password': { category: AUDIT_CATEGORIES.CREDENTIAL_CHANGES, severity: SEVERITY_LEVELS.CRITICAL, icon: '🔑' },
  'Change password': { category: AUDIT_CATEGORIES.CREDENTIAL_CHANGES, severity: SEVERITY_LEVELS.LOW, icon: '🔑' },
  'Force password change': { category: AUDIT_CATEGORIES.CREDENTIAL_CHANGES, severity: SEVERITY_LEVELS.MEDIUM, icon: '🔑' },
  'Update authentication methods': { category: AUDIT_CATEGORIES.CREDENTIAL_CHANGES, severity: SEVERITY_LEVELS.HIGH, icon: '🔐' },
  'Register authentication method': { category: AUDIT_CATEGORIES.CREDENTIAL_CHANGES, severity: SEVERITY_LEVELS.CRITICAL, icon: '🔐' },
  'Delete authentication method': { category: AUDIT_CATEGORIES.CREDENTIAL_CHANGES, severity: SEVERITY_LEVELS.CRITICAL, icon: '🔐' },
  'Register security info': { category: AUDIT_CATEGORIES.CREDENTIAL_CHANGES, severity: SEVERITY_LEVELS.HIGH, icon: '🔐' },
  'Default authentication method changed': { category: AUDIT_CATEGORIES.CREDENTIAL_CHANGES, severity: SEVERITY_LEVELS.HIGH, icon: '🔐' },

  // Privileged Access
  'Add member to role': { category: AUDIT_CATEGORIES.PRIVILEGED_ACCESS, severity: SEVERITY_LEVELS.CRITICAL, icon: '⚡' },
  'Remove member from role': { category: AUDIT_CATEGORIES.PRIVILEGED_ACCESS, severity: SEVERITY_LEVELS.HIGH, icon: '⚡' },
  'Activate eligible role': { category: AUDIT_CATEGORIES.PRIVILEGED_ACCESS, severity: SEVERITY_LEVELS.CRITICAL, icon: '⚡' },
  'Deactivate role': { category: AUDIT_CATEGORIES.PRIVILEGED_ACCESS, severity: SEVERITY_LEVELS.MEDIUM, icon: '⚡' },

  // Group Membership
  'Add member to group': { category: AUDIT_CATEGORIES.GROUP_MEMBERSHIP, severity: SEVERITY_LEVELS.MEDIUM, icon: '👥' },
  'Remove member from group': { category: AUDIT_CATEGORIES.GROUP_MEMBERSHIP, severity: SEVERITY_LEVELS.MEDIUM, icon: '👥' },
  'Owner added to group': { category: AUDIT_CATEGORIES.GROUP_MEMBERSHIP, severity: SEVERITY_LEVELS.HIGH, icon: '👥' },
  'Owner removed from group': { category: AUDIT_CATEGORIES.GROUP_MEMBERSHIP, severity: SEVERITY_LEVELS.HIGH, icon: '👥' },

  // Licensing
  'Assign license': { category: AUDIT_CATEGORIES.LICENSING, severity: SEVERITY_LEVELS.LOW, icon: '📋' },
  'Remove license': { category: AUDIT_CATEGORIES.LICENSING, severity: SEVERITY_LEVELS.LOW, icon: '📋' },
  'Update service plan': { category: AUDIT_CATEGORIES.LICENSING, severity: SEVERITY_LEVELS.LOW, icon: '📋' },

  // Application Access
  'Add delegated permission grant': { category: AUDIT_CATEGORIES.APPLICATION_ACCESS, severity: SEVERITY_LEVELS.CRITICAL, icon: '🔑' },
  'Add app role assignment': { category: AUDIT_CATEGORIES.APPLICATION_ACCESS, severity: SEVERITY_LEVELS.CRITICAL, icon: '🔑' },
  'Remove app role assignment': { category: AUDIT_CATEGORIES.APPLICATION_ACCESS, severity: SEVERITY_LEVELS.MEDIUM, icon: '🔑' },
  'Add service principal': { category: AUDIT_CATEGORIES.APPLICATION_ACCESS, severity: SEVERITY_LEVELS.HIGH, icon: '🔑' },
  'Update application': { category: AUDIT_CATEGORIES.APPLICATION_ACCESS, severity: SEVERITY_LEVELS.HIGH, icon: '🔑' },

  // Security Policy Impact
  'Update Conditional Access policy': { category: AUDIT_CATEGORIES.SECURITY_POLICY, severity: SEVERITY_LEVELS.CRITICAL, icon: '🛡️' },
  'Update authentication policy': { category: AUDIT_CATEGORIES.SECURITY_POLICY, severity: SEVERITY_LEVELS.HIGH, icon: '🛡️' },
  'Update named location': { category: AUDIT_CATEGORIES.SECURITY_POLICY, severity: SEVERITY_LEVELS.HIGH, icon: '🛡️' },
  'Update authentication strength': { category: AUDIT_CATEGORIES.SECURITY_POLICY, severity: SEVERITY_LEVELS.HIGH, icon: '🛡️' },

  // Administrative Changes
  'Update manager': { category: AUDIT_CATEGORIES.ADMINISTRATIVE, severity: SEVERITY_LEVELS.LOW, icon: '👤' },
  'Update department': { category: AUDIT_CATEGORIES.ADMINISTRATIVE, severity: SEVERITY_LEVELS.LOW, icon: '👤' },
  'Update job title': { category: AUDIT_CATEGORIES.ADMINISTRATIVE, severity: SEVERITY_LEVELS.LOW, icon: '👤' },
  'Update usage location': { category: AUDIT_CATEGORIES.ADMINISTRATIVE, severity: SEVERITY_LEVELS.MEDIUM, icon: '👤' },
  'Update employee ID': { category: AUDIT_CATEGORIES.ADMINISTRATIVE, severity: SEVERITY_LEVELS.MEDIUM, icon: '👤' }
};

/**
 * AI Summarization Patterns
 * Teaches the AI agent how to summarize detected activity patterns in business language
 */
export const AI_SUMMARIZATION_PATTERNS = [
  {
    pattern: 'Password reset + MFA registration',
    activities: ['Reset password', 'Register authentication method'],
    aiSummary: "The user's credentials were updated and a new MFA method was registered.",
    severity: SEVERITY_LEVELS.CRITICAL
  },
  {
    pattern: 'Role assignment + group membership',
    activities: ['Add member to role', 'Add member to group'],
    aiSummary: 'The user received additional administrative privileges.',
    severity: SEVERITY_LEVELS.CRITICAL
  },
  {
    pattern: 'OAuth consent + app role assignment',
    activities: ['Add delegated permission grant', 'Add app role assignment'],
    aiSummary: 'The user authorized a new application with elevated Microsoft 365 permissions.',
    severity: SEVERITY_LEVELS.CRITICAL
  },
  {
    pattern: 'License assignment + profile update',
    activities: ['Assign license', 'Update user'],
    aiSummary: 'Administrative profile maintenance was performed.',
    severity: SEVERITY_LEVELS.LOW
  },
  {
    pattern: 'User disabled + password reset',
    activities: ['Disable user', 'Reset password'],
    aiSummary: 'The account was secured by disabling access and resetting credentials.',
    severity: SEVERITY_LEVELS.HIGH
  },
  {
    pattern: 'MFA removal + password reset',
    activities: ['Delete authentication method', 'Reset password'],
    aiSummary: 'MFA protection was removed and credentials were reset (potential compromise indicator).',
    severity: SEVERITY_LEVELS.CRITICAL
  },
  {
    pattern: 'Privilege escalation sequence',
    activities: ['Add member to role', 'Add app role assignment'],
    aiSummary: 'User was granted elevated administrative access and elevated application permissions.',
    severity: SEVERITY_LEVELS.CRITICAL
  }
];

/**
 * Priority Activities for AI Agent Monitoring
 * These 15 core activities should be flagged immediately and monitored by default
 */
export const PRIORITY_ACTIVITIES = [
  'Reset password',
  'Update authentication methods',
  'Register authentication method',
  'Delete authentication method',
  'Add member to role',
  'Remove member from role',
  'Add member to group',
  'Remove member from group',
  'Add delegated permission grant',
  'Add app role assignment',
  'Update user',
  'Enable user',
  'Disable user',
  'Assign license',
  'Remove license'
];

/**
 * Critical Flag Activities
 * These activities should immediately trigger investigation alerts
 */
export const CRITICAL_FLAG_ACTIVITIES = [
  {
    activity: 'Reset password',
    severity: SEVERITY_LEVELS.CRITICAL,
    reason: 'Admin changed the user\'s password',
    investigationHint: 'Check if password reset was authorized. Compare with user sign-in patterns.'
  },
  {
    activity: 'Delete authentication method',
    severity: SEVERITY_LEVELS.CRITICAL,
    reason: 'MFA protection removed',
    investigationHint: 'MFA removal often precedes account compromise. Check who initiated this and why.'
  },
  {
    activity: 'Register authentication method',
    severity: SEVERITY_LEVELS.CRITICAL,
    reason: 'New MFA device registered',
    investigationHint: 'Verify if user authorized this registration. Check device location and IP.'
  },
  {
    activity: 'Add member to role',
    severity: SEVERITY_LEVELS.CRITICAL,
    reason: 'User became an administrator',
    investigationHint: 'Privilege escalation indicator. Verify administrative role assignment was authorized.'
  },
  {
    activity: 'Add delegated permission grant',
    severity: SEVERITY_LEVELS.CRITICAL,
    reason: 'OAuth consent granted',
    investigationHint: 'Check app name and permissions granted. Verify user authorized the consent.'
  },
  {
    activity: 'Add app role assignment',
    severity: SEVERITY_LEVELS.CRITICAL,
    reason: 'High-privilege application access granted',
    investigationHint: 'Verify application and role assignment. Check if user needs this access.'
  },
  {
    activity: 'Delete user',
    severity: SEVERITY_LEVELS.CRITICAL,
    reason: 'Account removed',
    investigationHint: 'Check if deletion was authorized offboarding or suspicious account removal.'
  },
  {
    activity: 'Restore user',
    severity: SEVERITY_LEVELS.CRITICAL,
    reason: 'Deleted account restored',
    investigationHint: 'Unusual activity. Verify if restoration was authorized and why.'
  },
  {
    activity: 'Update Conditional Access policy',
    severity: SEVERITY_LEVELS.CRITICAL,
    reason: 'Security controls changed',
    investigationHint: 'Check policy changes. Verify if modifications weaken security.'
  },
  {
    activity: 'Disable user',
    severity: SEVERITY_LEVELS.HIGH,
    reason: 'Account disabled unexpectedly',
    investigationHint: 'If unexpected, check for unauthorized account lockout or compromise response.'
  },
  {
    activity: 'Enable user',
    severity: SEVERITY_LEVELS.HIGH,
    reason: 'Account re-enabled',
    investigationHint: 'Verify if re-enablement was authorized. Check for account takeover.'
  },
  {
    activity: 'Remove member from role',
    severity: SEVERITY_LEVELS.HIGH,
    reason: 'Privilege removed',
    investigationHint: 'Check if this was authorized. May indicate account compromise response.'
  },
  {
    activity: 'Owner added to group',
    severity: SEVERITY_LEVELS.HIGH,
    reason: 'Ownership of sensitive group changed',
    investigationHint: 'Check if group is sensitive. Verify ownership change was authorized.'
  }
];

/**
 * Categorize an activity based on audit display name
 * @param {string} activityName - The audit activity display name
 * @returns {Object} Category, severity, and icon information
 */
export function categorizeActivity(activityName) {
  if (!activityName) {
    return {
      category: AUDIT_CATEGORIES.ADMINISTRATIVE,
      severity: SEVERITY_LEVELS.LOW,
      icon: '📝'
    };
  }

  // Direct lookup
  const mapping = ACTIVITY_MAPPINGS[activityName];
  if (mapping) return mapping;

  // Fuzzy matching for partial matches
  for (const [key, value] of Object.entries(ACTIVITY_MAPPINGS)) {
    if (activityName.toLowerCase().includes(key.toLowerCase())) {
      return value;
    }
  }

  // Default categorization by keywords
  const lower = activityName.toLowerCase();

  if (lower.includes('password') || lower.includes('credential') || lower.includes('auth')) {
    return {
      category: AUDIT_CATEGORIES.CREDENTIAL_CHANGES,
      severity: lower.includes('reset') ? SEVERITY_LEVELS.CRITICAL : SEVERITY_LEVELS.MEDIUM,
      icon: '🔐'
    };
  }

  if (lower.includes('role') || lower.includes('privilege') || lower.includes('admin')) {
    return {
      category: AUDIT_CATEGORIES.PRIVILEGED_ACCESS,
      severity: lower.includes('add') ? SEVERITY_LEVELS.CRITICAL : SEVERITY_LEVELS.HIGH,
      icon: '⚡'
    };
  }

  if (lower.includes('group') || lower.includes('member')) {
    return {
      category: AUDIT_CATEGORIES.GROUP_MEMBERSHIP,
      severity: SEVERITY_LEVELS.MEDIUM,
      icon: '👥'
    };
  }

  if (lower.includes('license') || lower.includes('service plan')) {
    return {
      category: AUDIT_CATEGORIES.LICENSING,
      severity: SEVERITY_LEVELS.LOW,
      icon: '📋'
    };
  }

  if (lower.includes('application') || lower.includes('app') || lower.includes('permission') || lower.includes('consent')) {
    return {
      category: AUDIT_CATEGORIES.APPLICATION_ACCESS,
      severity: lower.includes('add') ? SEVERITY_LEVELS.CRITICAL : SEVERITY_LEVELS.MEDIUM,
      icon: '🔑'
    };
  }

  if (lower.includes('policy') || lower.includes('security') || lower.includes('conditional')) {
    return {
      category: AUDIT_CATEGORIES.SECURITY_POLICY,
      severity: SEVERITY_LEVELS.HIGH,
      icon: '🛡️'
    };
  }

  if (lower.includes('user') || lower.includes('enable') || lower.includes('disable')) {
    return {
      category: AUDIT_CATEGORIES.ACCOUNT_LIFECYCLE,
      severity: lower.includes('delete') ? SEVERITY_LEVELS.HIGH : SEVERITY_LEVELS.MEDIUM,
      icon: '👤'
    };
  }

  // Default
  return {
    category: AUDIT_CATEGORIES.ADMINISTRATIVE,
    severity: SEVERITY_LEVELS.LOW,
    icon: '📝'
  };
}

/**
 * Get critical flag information for an activity
 * @param {string} activityName - The audit activity display name
 * @returns {Object|null} Critical flag info if activity is critical, null otherwise
 */
export function getCriticalFlagInfo(activityName) {
  return CRITICAL_FLAG_ACTIVITIES.find(
    flag => flag.activity.toLowerCase() === (activityName || '').toLowerCase()
  ) || null;
}

/**
 * Check if an activity should be monitored at high priority
 * @param {string} activityName - The audit activity display name
 * @returns {boolean} True if activity is in priority list
 */
export function isPriorityActivity(activityName) {
  return PRIORITY_ACTIVITIES.some(
    priority => priority.toLowerCase() === (activityName || '').toLowerCase()
  );
}

/**
 * Get AI summarization pattern for detected activities
 * @param {Array<string>} activities - List of activity names
 * @returns {Object|null} Summarization pattern if match found, null otherwise
 */
export function getAISummarizationPattern(activities) {
  if (!activities || activities.length === 0) return null;

  const activitySet = new Set(activities.map(a => a.toLowerCase()));

  for (const pattern of AI_SUMMARIZATION_PATTERNS) {
    const patternSet = new Set(pattern.activities.map(a => a.toLowerCase()));
    if (patternSet.size > 0 && [...patternSet].every(a => activitySet.has(a))) {
      return pattern;
    }
  }

  return null;
}

/**
 * Get severity color for display
 * @param {string} severity - Severity level (Critical, High, Medium, Low)
 * @returns {Object} CSS color values
 */
export function getSeverityColor(severity) {
  const colors = {
    [SEVERITY_LEVELS.CRITICAL]: { bg: '#fee2e2', text: '#991b1b', border: '#dc2626' },
    [SEVERITY_LEVELS.HIGH]: { bg: '#fef3c7', text: '#92400e', border: '#f59e0b' },
    [SEVERITY_LEVELS.MEDIUM]: { bg: '#dbeafe', text: '#1e40af', border: '#3b82f6' },
    [SEVERITY_LEVELS.LOW]: { bg: '#f0fdf4', text: '#15803d', border: '#22c55e' }
  };

  return colors[severity] || colors[SEVERITY_LEVELS.LOW];
}

/**
 * Get severity emoji/icon
 * @param {string} severity - Severity level
 * @returns {string} Emoji icon
 */
export function getSeverityIcon(severity) {
  const icons = {
    [SEVERITY_LEVELS.CRITICAL]: '🔴',
    [SEVERITY_LEVELS.HIGH]: '🟠',
    [SEVERITY_LEVELS.MEDIUM]: '🟡',
    [SEVERITY_LEVELS.LOW]: '🟢'
  };

  return icons[severity] || '⚪';
}

/**
 * Group activities by category
 * @param {Array<Object>} activities - Array of activity objects with action field
 * @returns {Object} Activities grouped by category
 */
export function groupActivitiesByCategory(activities) {
  const grouped = {};

  for (const category of Object.values(AUDIT_CATEGORIES)) {
    grouped[category] = [];
  }

  activities.forEach(activity => {
    const categoryInfo = categorizeActivity(activity.action);
    if (!grouped[categoryInfo.category]) {
      grouped[categoryInfo.category] = [];
    }
    grouped[categoryInfo.category].push({
      ...activity,
      categoryInfo
    });
  });

  return grouped;
}

export default {
  AUDIT_CATEGORIES,
  SEVERITY_LEVELS,
  ACTIVITY_MAPPINGS,
  AI_SUMMARIZATION_PATTERNS,
  PRIORITY_ACTIVITIES,
  CRITICAL_FLAG_ACTIVITIES,
  categorizeActivity,
  getCriticalFlagInfo,
  isPriorityActivity,
  getAISummarizationPattern,
  getSeverityColor,
  getSeverityIcon,
  groupActivitiesByCategory
};
