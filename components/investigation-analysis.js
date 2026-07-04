/**
 * Investigation Case File Component
 * Displays executive verdict, findings by severity & category, and recommendations
 * Leverages 8-category audit framework for organization
 */

import { categorizeActivity, getSeverityColor, getSeverityIcon, groupActivitiesByCategory } from '../lib/directory-audit-categories.js';

export function renderInvestigationAnalysis(el, analysis, investigationData) {
  if (!analysis) {
    el.innerHTML = '<div style="color:var(--color-text-tertiary);padding:20px;text-align:center">No analysis available</div>';
    return;
  }

  const html = generateCaseFileHTML(analysis, investigationData || {});
  el.innerHTML = html;
}

function generateCaseFileHTML(analysis, investigationData) {
  const verdict = analysis.verdict || 'Unable to determine';
  const riskScore = analysis.riskScore || 0;
  const userStory = analysis.userStory || '';
  const findings = analysis.findings || [];
  const recommendations = analysis.recommendations || [];

  // Categorize findings by severity
  const categorizedFindings = categorizeFindingsBySeverity(findings);

  // Calculate confidence
  const confidence = calculateConfidence(riskScore, findings.length);

  // Get verdict styling
  const verdictInfo = getVerdictInfo(verdict, riskScore);

  // Generate activity occurrence table
  const activityTable = generateActivityOccurrenceTable(investigationData);

  return `
    <!-- 1. EXECUTIVE VERDICT -->
    <div style="border:2px solid var(--color-border);border-radius:8px;padding:20px;margin-bottom:24px;background:var(--color-bg-primary)">
      <div style="font-size:10px;color:var(--color-text-secondary);text-transform:uppercase;margin-bottom:12px;font-weight:600">Investigation Verdict</div>

      <div style="margin-bottom:16px">
        <div style="display:flex;align-items:center;gap:8px;margin-bottom:8px">
          <span style="font-size:20px">${verdictInfo.icon}</span>
          <div style="font-weight:700;font-size:18px;color:${verdictInfo.color}">${verdictInfo.label}</div>
        </div>
        <div style="font-size:12px;color:var(--color-text-primary);line-height:1.6">${escapeHtml(userStory)}</div>
      </div>

      <div style="padding-top:12px;border-top:1px solid var(--color-border);font-size:11px;color:var(--color-text-secondary);display:flex;align-items:center;gap:6px;flex-wrap:wrap">
        <span>Confidence</span>
        <span style="font-weight:700;font-size:14px;color:var(--color-success)">${confidence}%</span>
        <span style="font-size:10px">How confident the AI analysis is in this verdict. ${confidence >= 80 ? '✓ Strong evidence supports the verdict.' : confidence >= 60 ? '◆ Reasonable evidence with some uncertainty.' : '△ Limited data - verify critical findings manually.'}</span>
      </div>
    </div>

    <!-- 2. ACTIVITY OCCURRENCE TABLE -->
    ${activityTable}

    <!-- 3. RECOMMENDED ACTIONS -->
    ${recommendations.length > 0 ? `
      <div style="background:var(--color-bg-primary);border:1px solid var(--color-border);border-radius:8px;padding:16px;margin-bottom:24px">
        <div style="font-size:11px;color:var(--color-text-secondary);text-transform:uppercase;margin-bottom:12px;font-weight:600"><i class="ti ti-bulb" style="margin-right:6px"></i>Recommended Actions</div>
        <div style="display:flex;flex-direction:column;gap:8px">
          ${recommendations.slice(0, 6).map(rec => `
            <div style="display:flex;align-items:flex-start;gap:8px;padding:8px;background:var(--color-bg-secondary);border-radius:4px;border-left:3px solid var(--color-primary)">
              <span style="color:var(--color-primary);margin-top:2px;flex-shrink:0;font-weight:600">✓</span>
              <span style="font-size:11px;color:var(--color-text-primary);line-height:1.5">${escapeHtml(rec)}</span>
            </div>
          `).join('')}
        </div>
      </div>
    ` : `
      <div style="background:var(--color-success-bg);border:1px solid var(--color-success);border-radius:8px;padding:16px;margin-bottom:24px">
        <div style="font-size:12px;color:var(--color-success-text);font-weight:600">
          <i class="ti ti-check" style="margin-right:6px"></i>No immediate action required.
        </div>
      </div>
    `}

    <!-- 4. FINDINGS BY SEVERITY -->
    <div style="margin-bottom:24px">
      ${renderFindingsBySeverity(categorizedFindings)}
    </div>
  `;
}

/**
 * Generate activity occurrence table for the 15 priority activities
 */
function generateActivityOccurrenceTable(investigationData) {
  // 15 priority activities grouped by category
  const priorityActivities = {
    'Credential Changes': [
      'Reset password',
      'Update authentication methods',
      'Register authentication method',
      'Delete authentication method'
    ],
    'Privileged Access': [
      'Add member to role',
      'Remove member from role'
    ],
    'Group Membership': [
      'Add member to group',
      'Remove member from group'
    ],
    'Application Access': [
      'Add delegated permission grant',
      'Add app role assignment'
    ],
    'Account Lifecycle': [
      'Update user',
      'Enable user',
      'Disable user'
    ],
    'Licensing': [
      'Assign license',
      'Remove license'
    ]
  };

  // Activity severity map
  const activitySeverity = {
    'Reset password': 'Critical',
    'Update authentication methods': 'High',
    'Register authentication method': 'Critical',
    'Delete authentication method': 'Critical',
    'Add member to role': 'Critical',
    'Remove member from role': 'High',
    'Add member to group': 'Medium',
    'Remove member from group': 'Medium',
    'Add delegated permission grant': 'Critical',
    'Add app role assignment': 'Critical',
    'Update user': 'Medium',
    'Enable user': 'High',
    'Disable user': 'High',
    'Assign license': 'Low',
    'Remove license': 'Low'
  };

  // Severity colors
  const severityColors = {
    'Critical': { bg: '#fee2e2', text: '#991b1b', border: '#dc2626', icon: '🔴' },
    'High': { bg: '#fef3c7', text: '#92400e', border: '#f59e0b', icon: '🟠' },
    'Medium': { bg: '#dbeafe', text: '#1e40af', border: '#3b82f6', icon: '🟡' },
    'Low': { bg: '#f0fdf4', text: '#15803d', border: '#22c55e', icon: '🟢' }
  };

  // Get account changes from investigation data
  const accountChanges = investigationData.accountChanges || [];
  const accountChangeActions = accountChanges.map(a => a.action || '');

  // Build table rows
  let tableHTML = `
    <div style="background:var(--color-bg-primary);border:1px solid var(--color-border);border-radius:8px;padding:16px;margin-bottom:24px">
      <div style="font-size:11px;color:var(--color-text-secondary);text-transform:uppercase;margin-bottom:12px;font-weight:600">Priority Activities in Date Range</div>
      <div style="overflow-x:auto">
        <table style="width:100%;border-collapse:collapse;font-size:11px">
          <thead>
            <tr style="background:var(--color-bg-secondary);border-bottom:1px solid var(--color-border)">
              <th style="padding:8px 12px;text-align:left;font-weight:600;color:var(--color-text-secondary)">Category</th>
              <th style="padding:8px 12px;text-align:left;font-weight:600;color:var(--color-text-secondary)">Activity</th>
              <th style="padding:8px 12px;text-align:center;font-weight:600;color:var(--color-text-secondary)">Severity</th>
              <th style="padding:8px 12px;text-align:center;font-weight:600;color:var(--color-text-secondary)">Occurred</th>
              <th style="padding:8px 12px;text-align:left;font-weight:600;color:var(--color-text-secondary)">Count</th>
            </tr>
          </thead>
          <tbody>
  `;

  let rowCount = 0;
  for (const [category, activities] of Object.entries(priorityActivities)) {
    for (let i = 0; i < activities.length; i++) {
      const activity = activities[i];
      const severity = activitySeverity[activity] || 'Medium';
      const colors = severityColors[severity];

      // Check if activity occurred
      const occurrences = accountChangeActions.filter(a => a.toLowerCase() === activity.toLowerCase());
      const occurred = occurrences.length > 0;

      // Get timestamp of first occurrence
      let timestamp = '';
      if (occurred) {
        const matchedChange = accountChanges.find(a => (a.action || '').toLowerCase() === activity.toLowerCase());
        if (matchedChange && matchedChange.eventTime) {
          timestamp = formatTime(matchedChange.eventTime);
        }
      }

      const bgColor = rowCount % 2 === 0 ? 'transparent' : 'var(--color-bg-secondary)';

      tableHTML += `
        <tr style="border-bottom:1px solid var(--color-border);background:${bgColor}">
          <td style="padding:8px 12px;color:var(--color-text-primary)">${i === 0 ? escapeHtml(category) : ''}</td>
          <td style="padding:8px 12px;color:var(--color-text-primary)">${escapeHtml(activity)}</td>
          <td style="padding:8px 12px;text-align:center">
            <span style="display:inline-block;padding:4px 8px;border-radius:3px;background:${colors.bg};color:${colors.text};font-weight:600;min-width:90px;text-align:center">
              ${severity}
            </span>
          </td>
          <td style="padding:8px 12px;text-align:center">
            ${occurred ? `<span style="color:var(--color-success);font-weight:600">✓ Yes</span>` : `<span style="color:var(--color-text-tertiary)">— No</span>`}
          </td>
          <td style="padding:8px 12px;color:var(--color-text-primary)">
            ${occurred ? `<strong>${occurrences.length}</strong>${timestamp ? ` • ${timestamp}` : ''}` : '—'}
          </td>
        </tr>
      `;
      rowCount++;
    }
  }

  tableHTML += `
          </tbody>
        </table>
      </div>
    </div>
  `;

  return tableHTML;
}

/**
 * Generate severity legend box with same width as activity table
 */
function generateSeverityLegend() {
  return `
    <div style="background:var(--color-bg-primary);border:1px solid var(--color-border);border-radius:8px;padding:12px 16px;margin-bottom:24px">
      <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(120px,1fr));gap:12px;font-size:11px">
        <div style="display:flex;align-items:center;gap:8px">
          <span style="display:inline-block;width:16px;height:16px;background:#fee2e2;border:1px solid #dc2626;border-radius:3px"></span>
          <span style="color:var(--color-text-primary)"><strong>🔴 Critical</strong></span>
        </div>
        <div style="display:flex;align-items:center;gap:8px">
          <span style="display:inline-block;width:16px;height:16px;background:#fef3c7;border:1px solid #f59e0b;border-radius:3px"></span>
          <span style="color:var(--color-text-primary)"><strong>🟠 High</strong></span>
        </div>
        <div style="display:flex;align-items:center;gap:8px">
          <span style="display:inline-block;width:16px;height:16px;background:#dbeafe;border:1px solid #3b82f6;border-radius:3px"></span>
          <span style="color:var(--color-text-primary)"><strong>🟡 Medium</strong></span>
        </div>
        <div style="display:flex;align-items:center;gap:8px">
          <span style="display:inline-block;width:16px;height:16px;background:#f0fdf4;border:1px solid #22c55e;border-radius:3px"></span>
          <span style="color:var(--color-text-primary)"><strong>🟢 Low</strong></span>
        </div>
      </div>
    </div>
  `;
}

function formatTime(dateString) {
  if (!dateString) return '';
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return '';
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: '2-digit' });
  } catch {
    return '';
  }
}

function categorizeFindingsBySeverity(findings) {
  const categories = {
    critical: [],
    high: [],
    medium: [],
    informational: []
  };

  findings.forEach(finding => {
    const lower = finding.toLowerCase();
    if (lower.includes('critical') || lower.includes('compromise') || lower.includes('breach') ||
        lower.includes('reset password') || lower.includes('mfa removed') ||
        lower.includes('privilege escalation') || lower.includes('oauth consent')) {
      categories.critical.push(finding);
    } else if (lower.includes('high') || lower.includes('escalation') || lower.includes('unauthorized') ||
               lower.includes('role assigned') || lower.includes('enabled') ||
               lower.includes('disabled') || lower.includes('group ownership')) {
      categories.high.push(finding);
    } else if (lower.includes('medium') || lower.includes('suspicious') || lower.includes('unusual') ||
               lower.includes('license') || lower.includes('group membership')) {
      categories.medium.push(finding);
    } else {
      categories.informational.push(finding);
    }
  });

  return categories;
}

function renderFindingsBySeverity(categories) {
  const severities = [
    { key: 'critical', label: 'Critical', icon: '🚨', color: 'var(--color-danger)' },
    { key: 'high', label: 'High', icon: '⚠️', color: 'var(--color-warning)' },
    { key: 'medium', label: 'Medium', icon: '⚠️', color: 'var(--color-warning)' },
    { key: 'informational', label: 'Informational', icon: 'ℹ️', color: 'var(--color-info)' }
  ];

  return severities.map(severity => {
    const items = categories[severity.key];
    if (items.length === 0) return '';

    return `
      <div style="background:var(--color-bg-primary);border:1px solid var(--color-border);border-radius:8px;padding:16px;margin-bottom:12px">
        <div style="font-size:11px;font-weight:600;margin-bottom:12px;color:${severity.color}">
          ${severity.icon} ${severity.label}
        </div>
        <div style="display:flex;flex-direction:column;gap:8px">
          ${items.map(item => `
            <div style="font-size:11px;color:var(--color-text-primary);padding:8px;background:var(--color-bg-secondary);border-radius:4px;border-left:3px solid ${severity.color}">
              ${escapeHtml(item)}
            </div>
          `).join('')}
        </div>
      </div>
    `;
  }).filter(html => html.length > 0).join('');
}

function getVerdictInfo(verdict, riskScore) {
  const lower = verdict.toLowerCase();

  if (lower.includes('compromise') || lower.includes('breach') || riskScore > 70) {
    return {
      icon: '🔴',
      label: 'CRITICAL RISK',
      color: 'var(--color-danger)',
      text: 'Account compromise likely'
    };
  } else if (lower.includes('suspicious') || riskScore > 40) {
    return {
      icon: '🟡',
      label: 'MEDIUM RISK',
      color: 'var(--color-warning)',
      text: 'Suspicious activity detected'
    };
  } else {
    return {
      icon: '🟢',
      label: 'LOW RISK',
      color: 'var(--color-success)',
      text: 'Normal activity'
    };
  }
}

function calculateConfidence(riskScore, findingCount) {
  // Simple confidence calculation: more findings and balanced scores increase confidence
  let confidence = 70;
  confidence += Math.min(findingCount * 2, 20);
  confidence = Math.min(confidence, 99);
  return confidence;
}

function escapeHtml(text) {
  if (!text) return '';
  const map = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;'
  };
  return text.replace(/[&<>"']/g, m => map[m]);
}

export function showAnalysisLoading(el) {
  el.innerHTML = `
    <div style="display:grid;gap:12px">
      ${[1, 2, 3].map(() => `
        <div style="height:100px;background:var(--color-bg-secondary);border-radius:8px;animation:pulse 2s infinite;opacity:0.5"></div>
      `).join('')}
    </div>
    <style>
      @keyframes pulse {
        0%, 100% { opacity: 0.5; }
        50% { opacity: 1; }
      }
    </style>
  `;
}
