/**
 * Attack Pattern Detection Service for TenantGuard
 * Detects 50 high-value audit events mapped to Microsoft attack lifecycle
 * Aligned with MITRE ATT&CK framework
 */

// 50 High-Value Audit Events with MITRE ATT&CK Mapping
export const CRITICAL_AUDIT_EVENTS = [
  // PRIVILEGE ESCALATION (Events 1-4)
  {
    id: 1,
    event: 'Global Administrator assigned',
    stage: 'Privilege Escalation',
    severity: 'CRITICAL',
    priority: 'P0',
    miteaTactic: 'T1078 – Valid Accounts',
    miteaSubTechnique: 'Create account as admin',
    service: 'Entra ID',
    description: 'Attacker gains full control of tenant',
    detectionLogic: 'Add-AzureADDirectoryRoleMember with Global Admin role',
    recommendedResponse: [
      'Immediately revoke session',
      'Disable account if unauthorized',
      'Review recent activities',
      'Force MFA re-registration'
    ],
    riskScore: 100
  },
  {
    id: 2,
    event: 'Privileged Role Administrator assigned',
    stage: 'Privilege Escalation',
    severity: 'CRITICAL',
    priority: 'P0',
    miteaTactic: 'T1098 – Account Manipulation',
    miteaSubTechnique: 'Privilege escalation',
    service: 'Entra ID',
    description: 'Can create additional admins or modify roles',
    detectionLogic: 'Add-AzureADDirectoryRoleMember with Privileged Role Admin',
    recommendedResponse: [
      'Disable account',
      'Audit role assignments',
      'Review all recent admin actions',
      'Check for privilege escalation chains'
    ],
    riskScore: 95
  },
  {
    id: 3,
    event: 'Security Administrator assigned',
    stage: 'Privilege Escalation',
    severity: 'CRITICAL',
    priority: 'P0',
    miteaTactic: 'T1547 – Boot or Logon Autostart Execution',
    miteaSubTechnique: 'Disable security controls',
    service: 'Entra ID',
    description: 'Can disable security controls and policies',
    detectionLogic: 'Add-AzureADDirectoryRoleMember with Security Admin',
    recommendedResponse: [
      'Revoke immediately',
      'Review security policy changes',
      'Verify MFA status',
      'Check policy disable events'
    ],
    riskScore: 95
  },
  {
    id: 4,
    event: 'Exchange Administrator assigned',
    stage: 'Privilege Escalation',
    severity: 'CRITICAL',
    priority: 'P0',
    miteaTactic: 'T1114 – Email Collection',
    miteaSubTechnique: 'Mailbox access',
    service: 'Entra ID',
    description: 'Mailbox compromise and data exfiltration risk',
    detectionLogic: 'Add-AzureADDirectoryRoleMember with Exchange Admin',
    recommendedResponse: [
      'Disable account',
      'Review mailbox access logs',
      'Check for forwarding rules',
      'Audit email export activities'
    ],
    riskScore: 90
  },

  // PERSISTENCE - Custom Roles & Authentication (Events 5-11)
  {
    id: 5,
    event: 'Custom role created',
    stage: 'Persistence',
    severity: 'CRITICAL',
    priority: 'P1',
    miteaTactic: 'T1098 – Account Manipulation',
    miteaSubTechnique: 'Create hidden privileged role',
    service: 'Entra ID',
    description: 'Attacker creates hidden privileged access',
    detectionLogic: 'New-AzureADMSRoleDefinition with dangerous permissions',
    recommendedResponse: [
      'Review role permissions',
      'Identify assigned users',
      'Delete if unauthorized',
      'Audit assignments'
    ],
    riskScore: 85
  },
  {
    id: 9,
    event: 'New authentication method added',
    stage: 'Persistence',
    severity: 'CRITICAL',
    priority: 'P1',
    miteaTactic: 'T1556 – Modify Authentication Process',
    miteaSubTechnique: 'Add alternate authentication',
    service: 'Entra ID',
    description: 'Attacker maintains persistent access',
    detectionLogic: 'New mobile or web auth method on privileged account',
    recommendedResponse: [
      'Remove unauthorized methods',
      'Force re-registration',
      'Review sign-in history',
      'Check for suspicious locations'
    ],
    riskScore: 90
  },
  {
    id: 10,
    event: 'Temporary Access Pass created',
    stage: 'Persistence',
    severity: 'CRITICAL',
    priority: 'P1',
    miteaTactic: 'T1621 – Multi-Factor Authentication Bypass',
    miteaSubTechnique: 'TAP for emergency access',
    service: 'Entra ID',
    description: 'New sign-in capability without MFA',
    detectionLogic: 'New-AzureADMSAuthenticationMethodPolicy TAP creation',
    recommendedResponse: [
      'Revoke TAP immediately',
      'Review who created it',
      'Check if used',
      'Verify legitimate need'
    ],
    riskScore: 95
  },
  {
    id: 13,
    event: 'New privileged user created',
    stage: 'Persistence',
    severity: 'CRITICAL',
    priority: 'P0',
    miteaTactic: 'T1136 – Create Account',
    miteaSubTechnique: 'Cloud account creation',
    service: 'Entra ID',
    description: 'Rogue administrator account created',
    detectionLogic: 'New-AzureADUser with admin role assignment',
    recommendedResponse: [
      'Delete account immediately',
      'Audit created user activities',
      'Check creator account',
      'Review group memberships'
    ],
    riskScore: 95
  },
  {
    id: 14,
    event: 'Break-glass account modified',
    stage: 'Persistence',
    severity: 'CRITICAL',
    priority: 'P0',
    miteaTactic: 'T1098 – Account Manipulation',
    miteaSubTechnique: 'Modify emergency access',
    service: 'Entra ID',
    description: 'Emergency account compromised',
    detectionLogic: 'Any modification to break-glass account',
    recommendedResponse: [
      'Immediately secure account',
      'Change password',
      'Review all activities',
      'Verify integrity'
    ],
    riskScore: 100
  },

  // DEFENSE EVASION - Disable Security (Events 6-8, 15-19)
  {
    id: 6,
    event: 'Role assignment removed from legitimate admin',
    stage: 'Defense Evasion',
    severity: 'CRITICAL',
    priority: 'P1',
    miteaTactic: 'T1562 – Impair Defenses',
    miteaSubTechnique: 'Remove admin access',
    service: 'Entra ID',
    description: 'Locks out defenders',
    detectionLogic: 'Remove-AzureADDirectoryRoleMember on security/audit roles',
    recommendedResponse: [
      'Restore role immediately',
      'Verify authorization',
      'Check who removed it',
      'Review defender access'
    ],
    riskScore: 85
  },
  {
    id: 7,
    event: 'MFA disabled for administrator',
    stage: 'Defense Evasion',
    severity: 'CRITICAL',
    priority: 'P0',
    miteaTactic: 'T1621 – Multi-Factor Authentication Bypass',
    miteaSubTechnique: 'Disable MFA',
    service: 'Entra ID',
    description: 'Removes major security barrier',
    detectionLogic: 'Remove-AzureADUserExtension MFA or policy disable',
    recommendedResponse: [
      'Re-enable MFA immediately',
      'Force re-registration',
      'Revoke active sessions',
      'Investigate who disabled it'
    ],
    riskScore: 95
  },
  {
    id: 8,
    event: 'Authentication method removed',
    stage: 'Defense Evasion',
    severity: 'CRITICAL',
    priority: 'P1',
    miteaTactic: 'T1621 – Multi-Factor Authentication Bypass',
    miteaSubTechnique: 'Remove MFA method',
    service: 'Entra ID',
    description: 'MFA bypass',
    detectionLogic: 'Remove auth method from any account',
    recommendedResponse: [
      'Re-add authentication method',
      'Verify authorization',
      'Check for unauthorized logins',
      'Force session refresh'
    ],
    riskScore: 85
  },
  {
    id: 15,
    event: 'Security Defaults disabled',
    stage: 'Defense Evasion',
    severity: 'CRITICAL',
    priority: 'P0',
    miteaTactic: 'T1562 – Impair Defenses',
    miteaSubTechnique: 'Disable tenant security',
    service: 'Entra ID',
    description: 'Weakens tenant protection',
    detectionLogic: 'Update-AzureADPolicy security defaults false',
    recommendedResponse: [
      'Re-enable immediately',
      'Review who disabled it',
      'Check MFA enforcement',
      'Audit policy changes'
    ],
    riskScore: 95
  },
  {
    id: 16,
    event: 'Conditional Access policy disabled',
    stage: 'Defense Evasion',
    severity: 'CRITICAL',
    priority: 'P0',
    miteaTactic: 'T1562 – Impair Defenses',
    miteaSubTechnique: 'Disable CA policy',
    service: 'Entra ID',
    description: 'Removes access controls',
    detectionLogic: 'Set-AzureADConditionalAccessPolicy -State Disabled',
    recommendedResponse: [
      'Re-enable policy',
      'Verify authorization',
      'Audit who disabled it',
      'Review access logs'
    ],
    riskScore: 95
  },
  {
    id: 17,
    event: 'Conditional Access policy modified',
    stage: 'Defense Evasion',
    severity: 'CRITICAL',
    priority: 'P0',
    miteaTactic: 'T1562 – Impair Defenses',
    miteaSubTechnique: 'Weaken access controls',
    service: 'Entra ID',
    description: 'Security rules bypassed',
    detectionLogic: 'Set-AzureADConditionalAccessPolicy with weakened conditions',
    recommendedResponse: [
      'Review changes',
      'Revert if unauthorized',
      'Verify requirements met',
      'Audit who changed it'
    ],
    riskScore: 85
  },
  {
    id: 46,
    event: 'DLP policy disabled',
    stage: 'Defense Evasion',
    severity: 'CRITICAL',
    priority: 'P0',
    miteaTactic: 'T1562 – Impair Defenses',
    miteaSubTechnique: 'Disable DLP',
    service: 'Exchange Online',
    description: 'Data protection removed',
    detectionLogic: 'Disable-DLPComplianceRule',
    recommendedResponse: [
      'Re-enable immediately',
      'Check for data exfiltration',
      'Review who disabled it',
      'Audit recent data access'
    ],
    riskScore: 95
  },
  {
    id: 49,
    event: 'Unified Audit Logging disabled',
    stage: 'Defense Evasion',
    severity: 'CRITICAL',
    priority: 'P0',
    miteaTactic: 'T1562 – Impair Defenses',
    miteaSubTechnique: 'Disable audit logging',
    service: 'Entra ID',
    description: 'Hides future attacker activity',
    detectionLogic: 'Set-AdminAuditLogConfig -UnifiedAuditLogIngestionEnabled $false',
    recommendedResponse: [
      'Re-enable audit logs',
      'Investigate gap period',
      'Check for suspicious activity',
      'Verify who disabled it'
    ],
    riskScore: 100
  },

  // CREDENTIAL ACCESS (Events 31-36)
  {
    id: 31,
    event: 'Impossible travel sign-in',
    stage: 'Initial Access / Credential Access',
    severity: 'HIGH',
    priority: 'P0',
    miteaTactic: 'T1110 – Brute Force',
    miteaSubTechnique: 'Stolen credentials',
    service: 'Entra ID',
    description: 'Stolen credentials likely',
    detectionLogic: 'Sign-in from impossible travel locations',
    recommendedResponse: [
      'Force password reset',
      'Revoke sessions',
      'Check mailbox access',
      'Notify user'
    ],
    riskScore: 80
  },
  {
    id: 35,
    event: 'Leaked credentials detected',
    stage: 'Credential Access',
    severity: 'CRITICAL',
    priority: 'P0',
    miteaTactic: 'T1110 – Brute Force',
    miteaSubTechnique: 'Compromised credentials',
    service: 'Entra ID',
    description: 'Password exposed publicly',
    detectionLogic: 'Identity Protection leaked credential',
    recommendedResponse: [
      'Force password change',
      'Revoke all sessions',
      'Enable MFA',
      'Review account activity'
    ],
    riskScore: 95
  },
  {
    id: 36,
    event: 'Password spray detected',
    stage: 'Credential Access',
    severity: 'CRITICAL',
    priority: 'P0',
    miteaTactic: 'T1110 – Brute Force',
    miteaSubTechnique: 'Password spray attack',
    service: 'Entra ID',
    description: 'Common attack technique',
    detectionLogic: 'Multiple failed logins from single source',
    recommendedResponse: [
      'Block source IP',
      'Reset targeted accounts',
      'Enable MFA',
      'Monitor for successful logins'
    ],
    riskScore: 90
  },

  // PERSISTENCE - OAuth & Applications (Events 20-30)
  {
    id: 20,
    event: 'New App Registration created',
    stage: 'Persistence',
    severity: 'HIGH',
    priority: 'P1',
    miteaTactic: 'T1199 – Trusted Relationship',
    miteaSubTechnique: 'OAuth app persistence',
    service: 'Entra ID',
    description: 'OAuth persistence mechanism',
    detectionLogic: 'New-AzureADApplication',
    recommendedResponse: [
      'Review permissions',
      'Check if legitimate',
      'Audit access logs',
      'Delete if unauthorized'
    ],
    riskScore: 75
  },
  {
    id: 23,
    event: 'Client Secret added',
    stage: 'Persistence',
    severity: 'CRITICAL',
    priority: 'P1',
    miteaTactic: 'T1199 – Trusted Relationship',
    miteaSubTechnique: 'Long-term app access',
    service: 'Entra ID',
    description: 'Long-term application access',
    detectionLogic: 'New-AzureADApplicationPasswordCredential on app',
    recommendedResponse: [
      'Remove secret',
      'Audit app usage',
      'Check who added it',
      'Review permissions'
    ],
    riskScore: 90
  },
  {
    id: 24,
    event: 'Certificate credential added',
    stage: 'Persistence',
    severity: 'CRITICAL',
    priority: 'P1',
    miteaTactic: 'T1199 – Trusted Relationship',
    miteaSubTechnique: 'Passwordless persistence',
    service: 'Entra ID',
    description: 'Passwordless persistence',
    detectionLogic: 'New-AzureADApplicationKeyCredential',
    recommendedResponse: [
      'Remove certificate',
      'Verify legitimacy',
      'Audit app access',
      'Review creator'
    ],
    riskScore: 90
  },
  {
    id: 25,
    event: 'Admin Consent granted',
    stage: 'Privilege Escalation',
    severity: 'CRITICAL',
    priority: 'P0',
    miteaTactic: 'T1199 – Trusted Relationship',
    miteaSubTechnique: 'OAuth admin consent',
    service: 'Entra ID',
    description: 'Broad API access granted',
    detectionLogic: 'Consent to application with admin approval',
    recommendedResponse: [
      'Review granted permissions',
      'Remove if unnecessary',
      'Audit what app can access',
      'Monitor app activity'
    ],
    riskScore: 95
  },
  {
    id: 27,
    event: 'Application granted Directory.ReadWrite.All',
    stage: 'Privilege Escalation',
    severity: 'CRITICAL',
    priority: 'P0',
    miteaTactic: 'T1199 – Trusted Relationship',
    miteaSubTechnique: 'Full directory control',
    service: 'Entra ID',
    description: 'Full directory control',
    detectionLogic: 'Permission Directory.ReadWrite.All granted',
    recommendedResponse: [
      'Remove permission immediately',
      'Delete app if unauthorized',
      'Review changes made',
      'Audit data access'
    ],
    riskScore: 100
  },
  {
    id: 28,
    event: 'Application granted RoleManagement.ReadWrite.Directory',
    stage: 'Privilege Escalation',
    severity: 'CRITICAL',
    priority: 'P0',
    miteaTactic: 'T1199 – Trusted Relationship',
    miteaSubTechnique: 'Can manage roles',
    service: 'Entra ID',
    description: 'Can manage privileged roles',
    detectionLogic: 'Permission RoleManagement.ReadWrite.Directory granted',
    recommendedResponse: [
      'Remove permission',
      'Audit role changes',
      'Delete if suspicious',
      'Review who created app'
    ],
    riskScore: 100
  },

  // COLLECTION & EXFILTRATION (Events 37-45)
  {
    id: 37,
    event: 'Mailbox Full Access granted',
    stage: 'Persistence',
    severity: 'CRITICAL',
    priority: 'P1',
    miteaTactic: 'T1114 – Email Collection',
    miteaSubTechnique: 'Full mailbox access',
    service: 'Exchange Online',
    description: 'Silent mailbox monitoring',
    detectionLogic: 'Add-MailboxPermission -AccessRights FullAccess',
    recommendedResponse: [
      'Remove permission',
      'Audit mailbox access',
      'Check for rules/forwarding',
      'Review who granted it'
    ],
    riskScore: 90
  },
  {
    id: 39,
    event: 'External forwarding rule created',
    stage: 'Collection / Exfiltration',
    severity: 'CRITICAL',
    priority: 'P0',
    miteaTactic: 'T1114 – Email Collection',
    miteaSubTechnique: 'Automatic email theft',
    service: 'Exchange Online',
    description: 'Automatic email theft',
    detectionLogic: 'New-InboxRule with ExternalForwarding',
    recommendedResponse: [
      'Delete rule immediately',
      'Check forwarded emails',
      'Review mailbox permissions',
      'Notify user'
    ],
    riskScore: 95
  },
  {
    id: 40,
    event: 'Inbox rule hides or deletes messages',
    stage: 'Defense Evasion',
    severity: 'CRITICAL',
    priority: 'P1',
    miteaTactic: 'T1562 – Impair Defenses',
    miteaSubTechnique: 'Hide attacker activity',
    service: 'Exchange Online',
    description: 'Conceals attacker activity',
    detectionLogic: 'New-InboxRule with DeleteMessage or HideFromAddressBook',
    recommendedResponse: [
      'Delete rule',
      'Check deleted items',
      'Audit mailbox rules',
      'Review who created it'
    ],
    riskScore: 85
  },
  {
    id: 42,
    event: 'External sharing enabled for SharePoint',
    stage: 'Exfiltration',
    severity: 'HIGH',
    priority: 'P1',
    miteaTactic: 'T1020 – Automated Exfiltration',
    miteaSubTechnique: 'Enable sharing',
    service: 'SharePoint Online',
    description: 'Data exposure',
    detectionLogic: 'Set-SPOSite -SharingCapability to ExternalUserAndGuestSharing',
    recommendedResponse: [
      'Restrict sharing',
      'Review shared content',
      'Audit who changed it',
      'Check for sensitive data'
    ],
    riskScore: 75
  },
  {
    id: 44,
    event: 'Large number of file downloads',
    stage: 'Collection',
    severity: 'HIGH',
    priority: 'P1',
    miteaTactic: 'T1005 – Data from Local System',
    miteaSubTechnique: 'Bulk download',
    service: 'SharePoint Online',
    description: 'Potential data theft',
    detectionLogic: '>50 file downloads in short timeframe',
    recommendedResponse: [
      'Review downloaded files',
      'Check user location',
      'Verify legitimate need',
      'Disable account if suspicious'
    ],
    riskScore: 80
  }
];

// TOP 10 "DROP EVERYTHING" ALERTS
export const DROP_EVERYTHING_ALERTS = [
  1,   // Global Administrator assigned
  7,   // MFA disabled for administrator
  16,  // Conditional Access policy disabled
  15,  // Security Defaults disabled
  25,  // Admin Consent granted
  27,  // Application granted Directory.ReadWrite.All
  39,  // External forwarding rule created
  31,  // High-risk sign-in
  46,  // DLP policy disabled
  49   // Unified Audit Logging disabled
];

export class AttackPatternDetector {
  constructor() {
    this.eventMap = new Map(CRITICAL_AUDIT_EVENTS.map(e => [e.id, e]));
    this.detectedPatterns = [];
  }

  /**
   * Detect attack patterns from audit events
   */
  detectPatterns(auditEvents) {
    const patterns = [];

    // Check for individual critical events
    auditEvents.forEach(event => {
      const criticalEvent = this.findMatchingCriticalEvent(event);
      if (criticalEvent) {
        patterns.push({
          type: 'CRITICAL_EVENT',
          event: criticalEvent,
          auditEvent: event,
          severity: criticalEvent.severity,
          priority: criticalEvent.priority,
          isDropEverything: DROP_EVERYTHING_ALERTS.includes(criticalEvent.id),
          timestamp: event.timestamp,
          detectedUser: event.user,
          detectedIP: event.ipAddress
        });
      }
    });

    // Check for attack chains
    const chains = this.detectAttackChains(auditEvents);
    patterns.push(...chains);

    // Check for multi-stage attacks
    const multiStage = this.detectMultiStageAttacks(auditEvents);
    patterns.push(...multiStage);

    return patterns.sort((a, b) => b.severity === 'CRITICAL' ? -1 : 1);
  }

  /**
   * Find matching critical event
   */
  findMatchingCriticalEvent(auditEvent) {
    for (const [id, criticalEvent] of this.eventMap) {
      // Match by activity name
      if (auditEvent.activity?.toLowerCase().includes(criticalEvent.event.toLowerCase())) {
        return criticalEvent;
      }

      // Match by specific patterns
      if (this.matchesDetectionLogic(auditEvent, criticalEvent)) {
        return criticalEvent;
      }
    }
    return null;
  }

  /**
   * Match detection logic
   */
  matchesDetectionLogic(auditEvent, criticalEvent) {
    const details = (auditEvent.details || '').toLowerCase();
    const activity = (auditEvent.activity || '').toLowerCase();

    // Custom matching logic for specific events
    if (criticalEvent.id === 39) {
      // External forwarding
      return activity.includes('inbox rule') && details.includes('forward');
    }
    if (criticalEvent.id === 7) {
      // MFA disabled
      return activity.includes('mfa') && details.includes('disabled');
    }
    if (criticalEvent.id === 16) {
      // CA policy disabled
      return activity.includes('conditional access') && details.includes('disabled');
    }

    return false;
  }

  /**
   * Detect attack chains (multi-step attacks)
   */
  detectAttackChains(auditEvents) {
    const chains = [];

    // Chain 1: Privilege Escalation → Defense Evasion
    const privEscEvents = auditEvents.filter(e => {
      const ce = this.findMatchingCriticalEvent(e);
      return ce && ce.stage === 'Privilege Escalation';
    });

    const defenseEvasionEvents = auditEvents.filter(e => {
      const ce = this.findMatchingCriticalEvent(e);
      return ce && ce.stage === 'Defense Evasion';
    });

    if (privEscEvents.length > 0 && defenseEvasionEvents.length > 0) {
      chains.push({
        type: 'ATTACK_CHAIN',
        chain: ['Privilege Escalation', 'Defense Evasion'],
        events: [...privEscEvents, ...defenseEvasionEvents],
        severity: 'CRITICAL',
        priority: 'P0',
        description: 'Attacker gained admin access then disabled security controls',
        riskScore: 95
      });
    }

    // Chain 2: Persistence → Collection → Exfiltration
    const persistenceEvents = auditEvents.filter(e => {
      const ce = this.findMatchingCriticalEvent(e);
      return ce && ce.stage === 'Persistence';
    });

    const collectionEvents = auditEvents.filter(e => {
      const ce = this.findMatchingCriticalEvent(e);
      return ce && (ce.stage === 'Collection' || ce.stage.includes('Collection'));
    });

    if (persistenceEvents.length > 0 && collectionEvents.length > 0) {
      chains.push({
        type: 'ATTACK_CHAIN',
        chain: ['Persistence', 'Collection', 'Exfiltration'],
        events: [...persistenceEvents, ...collectionEvents],
        severity: 'CRITICAL',
        priority: 'P0',
        description: 'Attacker maintained access and exfiltrated data',
        riskScore: 90
      });
    }

    return chains;
  }

  /**
   * Detect multi-stage attacks
   */
  detectMultiStageAttacks(auditEvents) {
    const attacks = [];

    // Detect: Admin role + MFA disable + External forwarding
    const hasAdminRole = auditEvents.some(e => {
      const ce = this.findMatchingCriticalEvent(e);
      return ce && ce.id <= 4;
    });

    const hasMFADisable = auditEvents.some(e => {
      const ce = this.findMatchingCriticalEvent(e);
      return ce && ce.id === 7;
    });

    const hasForwarding = auditEvents.some(e => {
      const ce = this.findMatchingCriticalEvent(e);
      return ce && ce.id === 39;
    });

    if (hasAdminRole && hasMFADisable && hasForwarding) {
      attacks.push({
        type: 'MULTI_STAGE_ATTACK',
        stages: ['Privilege Escalation', 'Defense Evasion', 'Exfiltration'],
        severity: 'CRITICAL',
        priority: 'P0',
        description: 'Sophisticated attack: privilege escalation → disable security → setup exfiltration',
        recommendedResponse: [
          'Immediately disable all suspect accounts',
          'Review all email forwarding rules',
          'Revoke all active sessions',
          'Conduct forensic investigation',
          'Consider breach notification'
        ],
        riskScore: 100,
        events: auditEvents.filter(e => {
          const ce = this.findMatchingCriticalEvent(e);
          return ce && (ce.id <= 4 || ce.id === 7 || ce.id === 39);
        })
      });
    }

    // Detect: App OAuth + Directory access
    const hasOAuthConsent = auditEvents.some(e => {
      const ce = this.findMatchingCriticalEvent(e);
      return ce && ce.id === 25;
    });

    const hasDirectoryAccess = auditEvents.some(e => {
      const ce = this.findMatchingCriticalEvent(e);
      return ce && (ce.id === 27 || ce.id === 28);
    });

    if (hasOAuthConsent && hasDirectoryAccess) {
      attacks.push({
        type: 'OAUTH_ATTACK',
        stages: ['Persistence', 'Privilege Escalation'],
        severity: 'CRITICAL',
        priority: 'P0',
        description: 'Malicious OAuth app granted directory control',
        recommendedResponse: [
          'Identify and delete malicious app',
          'Audit all app changes made',
          'Remove dangerous permissions',
          'Review user consent history'
        ],
        riskScore: 95
      });
    }

    return attacks;
  }

  /**
   * Generate risk score for detected patterns
   */
  calculateRiskScore(patterns) {
    if (patterns.length === 0) return 0;

    const criticalCount = patterns.filter(p => p.severity === 'CRITICAL').length;
    const highCount = patterns.filter(p => p.severity === 'HIGH').length;
    const dropEverythingCount = patterns.filter(p => p.isDropEverything).length;

    return Math.min(100, (criticalCount * 20) + (highCount * 10) + (dropEverythingCount * 25));
  }

  /**
   * Get recommended response actions
   */
  getRecommendedActions(pattern) {
    if (pattern.type === 'CRITICAL_EVENT') {
      return pattern.event.recommendedResponse;
    }
    if (pattern.recommendedResponse) {
      return pattern.recommendedResponse;
    }
    return ['Review event', 'Investigate user account', 'Check recent activities'];
  }

  /**
   * Generate alert
   */
  generateAlert(pattern) {
    return {
      id: `alert-${Date.now()}`,
      type: pattern.type,
      severity: pattern.severity,
      priority: pattern.priority,
      isDropEverything: pattern.isDropEverything,
      title: pattern.event?.event || pattern.description,
      description: pattern.event?.description || pattern.description,
      stage: pattern.event?.stage || pattern.chain?.join(' → '),
      miteaTactic: pattern.event?.miteaTactic,
      user: pattern.detectedUser,
      ipAddress: pattern.detectedIP,
      timestamp: pattern.timestamp || new Date(),
      riskScore: pattern.event?.riskScore || pattern.riskScore,
      recommendedActions: this.getRecommendedActions(pattern),
      relatedEvents: pattern.events?.length || 1
    };
  }
}

export default AttackPatternDetector;
