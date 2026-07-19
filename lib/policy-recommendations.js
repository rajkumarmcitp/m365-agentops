/**
 * Policy Recommendations Engine
 * Suggests specific policy changes to remediate security issues
 */

export function getPolicyRecommendations(alert) {
  const recommendations = {
    'mfa_disabled': [
      {
        policy: 'Authentication Policies',
        priority: 'CRITICAL',
        recommendation: 'Require MFA for all global administrators',
        implementation: 'Enable Entra ID: Require multi-factor authentication for global admin roles in authentication strength policies',
        impact: 'Prevents unauthorized access even with compromised passwords',
        effort: 'Low - 5 minutes'
      },
      {
        policy: 'Conditional Access',
        priority: 'HIGH',
        recommendation: 'Block legacy authentication protocols',
        implementation: 'Create CA policy: Block access using legacy authentication clients (Basic Auth, SMTP, POP3, IMAP)',
        impact: 'Reduces attack surface by forcing modern authentication',
        effort: 'Medium - 15 minutes'
      },
      {
        policy: 'Authentication Methods',
        priority: 'HIGH',
        recommendation: 'Enforce strong authentication methods',
        implementation: 'Configure: Disable less secure auth methods (SMS, voice calls), require authenticator app or FIDO2',
        impact: 'Improves resistance to phishing and SIM-swap attacks',
        effort: 'Medium - 20 minutes'
      },
      {
        policy: 'Session Management',
        priority: 'MEDIUM',
        recommendation: 'Reduce session timeout for privileged accounts',
        implementation: 'Set: Conditional Access policy with 1-hour session timeout for admin roles',
        impact: 'Limits exposure window if account is compromised',
        effort: 'Low - 10 minutes'
      }
    ],
    'conditional_access_disabled': [
      {
        policy: 'Conditional Access',
        priority: 'CRITICAL',
        recommendation: 'Re-enable critical CA policies immediately',
        implementation: 'Restore the disabled policy and verify all CA rules are active',
        impact: 'Restores security controls for risky sign-in scenarios',
        effort: 'Low - 5 minutes'
      },
      {
        policy: 'Conditional Access',
        priority: 'HIGH',
        recommendation: 'Create backup CA policy with auto-enable',
        implementation: 'Setup duplicate CA policy with alert notification if disabled',
        impact: 'Prevents single point of failure in conditional access',
        effort: 'Medium - 15 minutes'
      },
      {
        policy: 'Conditional Access',
        priority: 'HIGH',
        recommendation: 'Require approval for CA policy changes',
        implementation: 'Enable: CA policy change approval workflow with 2 approvers required',
        impact: 'Prevents accidental or unauthorized policy disabling',
        effort: 'Medium - 20 minutes'
      },
      {
        policy: 'Monitoring',
        priority: 'MEDIUM',
        recommendation: 'Alert on CA policy disabling',
        implementation: 'Configure: Alert when any CA policy is disabled (Admin Activity Log)',
        impact: 'Enables rapid detection and response to policy changes',
        effort: 'Low - 10 minutes'
      }
    ],
    'permission_escalation': [
      {
        policy: 'Privileged Access Management',
        priority: 'CRITICAL',
        recommendation: 'Require approval for privileged role assignments',
        implementation: 'Enable: PIM approval workflow for Exchange Admin, Security Admin, Global Admin roles',
        impact: 'Prevents unauthorized privilege escalation',
        effort: 'Medium - 25 minutes'
      },
      {
        policy: 'Access Control',
        priority: 'HIGH',
        recommendation: 'Limit permanent role assignments',
        implementation: 'Require: Time-limited role assignments (max 8 hours) with automatic expiration',
        impact: 'Reduces exposure window for compromised privileged accounts',
        effort: 'Medium - 20 minutes'
      },
      {
        policy: 'Auditing',
        priority: 'HIGH',
        recommendation: 'Enable detailed role change auditing',
        implementation: 'Configure: Audit log retention to 90 days minimum for role changes',
        impact: 'Enables forensic investigation of unauthorized escalations',
        effort: 'Low - 5 minutes'
      },
      {
        policy: 'Access Control',
        priority: 'MEDIUM',
        recommendation: 'Implement role-based access control limits',
        implementation: 'Restrict: Number of admins per role (recommend max 3-5 global admins)',
        impact: 'Reduces blast radius of compromise',
        effort: 'Low - 10 minutes'
      }
    ],
    'forwarding_rule': [
      {
        policy: 'Data Loss Prevention',
        priority: 'CRITICAL',
        recommendation: 'Block external email forwarding',
        implementation: 'Create DLP rule: Block forwarding to external recipients unless approved',
        impact: 'Prevents data exfiltration via email forwarding',
        effort: 'Medium - 20 minutes'
      },
      {
        policy: 'Data Loss Prevention',
        priority: 'HIGH',
        recommendation: 'Require approval for forwarding rule creation',
        implementation: 'Enable: Exchange Online Protection rule requiring approval for new forwarding rules',
        impact: 'Adds governance gate for email forwarding changes',
        effort: 'Medium - 15 minutes'
      },
      {
        policy: 'Mailbox Rules',
        priority: 'HIGH',
        recommendation: 'Audit existing forwarding rules',
        implementation: 'Run: PowerShell audit to list all active forwarding rules across tenant',
        impact: 'Identifies similar compromises',
        effort: 'Low - 10 minutes'
      },
      {
        policy: 'Conditional Access',
        priority: 'MEDIUM',
        recommendation: 'Block risky sign-ins before rule creation',
        implementation: 'Create CA policy: Require MFA for sign-in from suspicious locations',
        impact: 'Prevents initial account compromise leading to forwarding rules',
        effort: 'Medium - 15 minutes'
      }
    ],
    'data_exfiltration': [
      {
        policy: 'Data Loss Prevention',
        priority: 'CRITICAL',
        recommendation: 'Enable DLP for sensitive data types',
        implementation: 'Create DLP policy: Block download/sharing of files containing sensitive info (PII, financial data)',
        impact: 'Prevents bulk data downloads',
        effort: 'High - 30-45 minutes'
      },
      {
        policy: 'SharePoint/OneDrive',
        priority: 'HIGH',
        recommendation: 'Restrict bulk file downloads',
        implementation: 'Enable: SharePoint throttling + download limit alerts (>100 files/hour)',
        impact: 'Detects and blocks suspicious download patterns',
        effort: 'Medium - 20 minutes'
      },
      {
        policy: 'File Sharing',
        priority: 'HIGH',
        recommendation: 'Disable anonymous/external sharing by default',
        implementation: 'Configure: Disable external sharing, require domain validation for shared files',
        impact: 'Reduces sharing to external attackers',
        effort: 'Medium - 15 minutes'
      },
      {
        policy: 'Sensitivity Labels',
        priority: 'MEDIUM',
        recommendation: 'Apply sensitivity labels to restrict downloads',
        implementation: 'Create labels: "Confidential" restricts offline access, downloads',
        impact: 'Enforces data classification governance',
        effort: 'High - 40 minutes'
      }
    ],
    'oauth_compromise': [
      {
        policy: 'Application Consent',
        priority: 'CRITICAL',
        recommendation: 'Require admin approval for app consent',
        implementation: 'Enable: "Prevent user consent" setting, require admin approval in Entra ID',
        impact: 'Prevents unauthorized app permissions',
        effort: 'Low - 5 minutes'
      },
      {
        policy: 'Application Permissions',
        priority: 'HIGH',
        recommendation: 'Disable delegated Directory.Read.All permissions',
        implementation: 'Restrict: Apps requesting Directory.Read.All require explicit admin review',
        impact: 'Limits app access to sensitive directory data',
        effort: 'Medium - 15 minutes'
      },
      {
        policy: 'Audit Logging',
        priority: 'HIGH',
        recommendation: 'Monitor app consent grants',
        implementation: 'Setup alerts: Notify when app permissions exceed baseline',
        impact: 'Early detection of compromised app permissions',
        effort: 'Medium - 20 minutes'
      },
      {
        policy: 'Application Management',
        priority: 'MEDIUM',
        recommendation: 'Review and revoke suspicious app consents',
        implementation: 'Audit granted permissions, revoke unused/unknown apps',
        impact: 'Removes backdoors',
        effort: 'Medium - 25 minutes'
      }
    ],
    'compromised_credentials': [
      {
        policy: 'Password Policy',
        priority: 'CRITICAL',
        recommendation: 'Enable passwordless sign-in',
        implementation: 'Deploy: Microsoft Authenticator passwordless sign-in (push notifications)',
        impact: 'Eliminates password compromise as attack vector',
        effort: 'High - 45-60 minutes'
      },
      {
        policy: 'Conditional Access',
        priority: 'CRITICAL',
        recommendation: 'Require MFA for all users',
        implementation: 'Create CA policy: MFA for all users on all cloud apps',
        impact: 'Prevents account access even with stolen passwords',
        effort: 'Medium - 20 minutes'
      },
      {
        policy: 'Risk-Based Access',
        priority: 'HIGH',
        recommendation: 'Enable sign-in risk detection',
        implementation: 'Configure: Block sign-ins from unfamiliar locations, require remediation',
        impact: 'Real-time protection against credential use in unauthorized contexts',
        effort: 'Medium - 15 minutes'
      },
      {
        policy: 'Session Management',
        priority: 'HIGH',
        recommendation: 'Force re-authentication after risk detection',
        implementation: 'Setup: Require MFA challenge for risky sign-ins',
        impact: 'Stops attacker even if using compromised credentials',
        effort: 'Low - 10 minutes'
      }
    ],
    'impossible_travel': [
      {
        policy: 'Conditional Access',
        priority: 'CRITICAL',
        recommendation: 'Block impossible travel sign-ins',
        implementation: 'Create CA policy: Block access from countries where user doesn\'t operate',
        impact: 'Prevents account access from geographic impossibilities',
        effort: 'Medium - 20 minutes'
      },
      {
        policy: 'Conditional Access',
        priority: 'HIGH',
        recommendation: 'Require MFA after geographic change',
        implementation: 'Setup: MFA challenge for sign-in from new country within 24 hours of previous sign-in',
        impact: 'Stops credential misuse in different geography',
        effort: 'Medium - 20 minutes'
      },
      {
        policy: 'Audit Logging',
        priority: 'HIGH',
        recommendation: 'Monitor travel velocity alerts',
        implementation: 'Configure: Alert when user signs in from 2+ countries within 6 hours',
        impact: 'Early detection of account compromise',
        effort: 'Low - 10 minutes'
      },
      {
        policy: 'VPN Policy',
        priority: 'MEDIUM',
        recommendation: 'Whitelist corporate VPN locations',
        implementation: 'Add: VPN exit points to trusted location list to reduce false positives',
        impact: 'Reduces alert fatigue',
        effort: 'Low - 10 minutes'
      }
    ],
    'default': [
      {
        policy: 'General Security',
        priority: 'HIGH',
        recommendation: 'Review and strengthen authentication policies',
        implementation: 'Enable MFA, block legacy authentication, implement conditional access',
        impact: 'Improves overall security posture',
        effort: 'Medium - 30 minutes'
      },
      {
        policy: 'Audit and Monitoring',
        priority: 'MEDIUM',
        recommendation: 'Enable comprehensive audit logging',
        implementation: 'Configure: Audit log retention to 90+ days for all relevant activities',
        impact: 'Enables forensic investigation',
        effort: 'Low - 10 minutes'
      },
      {
        policy: 'Access Control',
        priority: 'MEDIUM',
        recommendation: 'Implement least privilege access',
        implementation: 'Remove unnecessary permissions, use time-limited assignments',
        impact: 'Reduces blast radius of compromise',
        effort: 'Medium - 20 minutes'
      }
    ]
  }

  return recommendations[alert.type] || recommendations['default']
}

export function getPriorityColor(priority) {
  const colors = {
    'CRITICAL': '#d32f2f',
    'HIGH': '#f57c00',
    'MEDIUM': '#1976d2',
    'LOW': '#388e3c'
  }
  return colors[priority] || '#666'
}

export function getEffortColor(effort) {
  const colors = {
    'Low': '#4caf50',
    'Medium': '#ff9800',
    'High': '#f44336'
  }
  const effortLevel = effort.split(' ')[0]
  return colors[effortLevel] || '#666'
}
