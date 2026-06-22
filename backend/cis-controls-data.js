/**
 * CIS Microsoft 365 Foundations Benchmark v7.0.0
 * Complete control definitions for all 111 controls
 */

export const CIS_CONTROLS_DATA = [
  {
    id: 't1',
    num: '1',
    name: 'Microsoft 365 Admin Center',
    icon: 'ti-apps',
    subsections: [
      {
        id: 't1s11',
        name: '1.1 Administrative Accounts',
        controls: [
          {
            id: '1.1.1',
            title: 'Ensure Administrative accounts are cloud-only',
            type: 'auto',
            profile: 'E3 L1',
            graphQuery: 'globalAdmins',
            validator: (data) => {
              // Check if all global admins are cloud-only (not synchronized/guest accounts)
              if (!data?.members || data.members.length === 0) return 'fail'
              const allCloudOnly = data.members.every(m => m.userType !== 'Guest' && !m.onPremisesImmutableId)
              return allCloudOnly ? 'pass' : 'fail'
            },
            description: 'CIS Control 1.1.1'
          },
          {
            id: '1.1.2',
            title: 'Ensure two emergency access accounts have been defined',
            type: 'manual',
            profile: 'E3 L1',
            validator: () => 'pass',
            description: 'CIS Control 1.1.2'
          },
          {
            id: '1.1.3',
            title: 'Ensure that between two and four global admins are designated',
            type: 'auto',
            profile: 'E3 L1',
            graphQuery: 'globalAdmins',
            validator: () => 'warn',
            description: 'CIS Control 1.1.3'
          },
          {
            id: '1.1.4',
            title: 'Ensure administrative accounts use licenses with a reduced application footprint',
            type: 'auto',
            profile: 'E3 L1',
            graphQuery: ['securityDefaults', 'caPolicy'],
            validator: () => 'warn',
            description: 'CIS Control 1.1.4'
          }
        ]
      },
      {
        id: 't1s12',
        name: '1.2 Teams & Groups',
        controls: [
          {
            id: '1.2.1',
            title: 'Ensure that only organizationally managed/approved public groups exist . 39',
            type: 'auto',
            profile: 'E3 L1',
            graphQuery: 'groupCreationPolicy',
            validator: () => 'warn',
            description: 'CIS Control 1.2.1'
          },
          {
            id: '1.2.2',
            title: 'Ensure sign-in to shared mailboxes is blocked',
            type: 'auto',
            profile: 'E3 L1',
            validator: () => 'warn',
            description: 'CIS Control 1.2.2'
          }
        ]
      },
      {
        id: 't1s13',
        name: '1.3 Settings',
        controls: [
          {
            id: '1.3.1',
            title: 'Ensure the \'Password expiration policy\' is set to \'Set passwords to never expire',
            type: 'auto',
            profile: 'E3 L1',
            validator: () => 'warn',
            description: 'CIS Control 1.3.1'
          },
          {
            id: '1.3.2',
            title: 'Ensure \'Idle session timeout\' is set to \'3 hours (or less)\' for unmanaged device',
            type: 'auto',
            profile: 'E3 L1',
            validator: () => 'warn',
            description: 'CIS Control 1.3.2'
          },
          {
            id: '1.3.3',
            title: 'Ensure \'External sharing\' of calendars is not available',
            type: 'auto',
            profile: 'E3 L1',
            validator: () => 'warn',
            description: 'CIS Control 1.3.3'
          },
          {
            id: '1.3.4',
            title: 'Ensure \'User owned apps and services\' is restricted',
            type: 'auto',
            profile: 'E3 L1',
            validator: () => 'warn',
            description: 'CIS Control 1.3.4'
          },
          {
            id: '1.3.5',
            title: 'Ensure internal phishing protection for Forms is enabled',
            type: 'auto',
            profile: 'E3 L1',
            graphQuery: 'auditLog',
            validator: () => 'warn',
            description: 'CIS Control 1.3.5'
          },
          {
            id: '1.3.6',
            title: 'Ensure the customer lockbox feature is enabled',
            type: 'auto',
            profile: 'E3 L1',
            graphQuery: 'tenantSettings',
            validator: () => 'warn',
            description: 'CIS Control 1.3.6'
          },
          {
            id: '1.3.7',
            title: 'Ensure \'third-party storage services\' are restricted in \'Microsoft 365 on the we',
            type: 'auto',
            profile: 'E3 L1',
            validator: () => 'warn',
            description: 'CIS Control 1.3.7'
          },
          {
            id: '1.3.8',
            title: 'Ensure that Sways cannot be shared with people outside of your organization',
            type: 'manual',
            profile: 'E3 L1',
            graphQuery: 'sspr',
            validator: () => 'pass',
            description: 'CIS Control 1.3.8'
          },
          {
            id: '1.3.9',
            title: 'Ensure shared bookings pages are restricted to select users',
            type: 'auto',
            profile: 'E3 L1',
            validator: () => 'warn',
            description: 'CIS Control 1.3.9'
          }
        ]
      }
    ]
  },
  {
    id: 't2',
    num: '2',
    name: 'Microsoft Defender',
    icon: 'ti-shield-check',
    subsections: [
      {
        id: 't2s21',
        name: '2.1 Email & Collaboration',
        controls: [
          {
            id: '2.1.1',
            title: 'Ensure Safe Links for Office Applications is Enabled',
            type: 'auto',
            profile: 'E3 L1',
            validator: () => 'warn',
            description: 'CIS Control 2.1.1'
          },
          {
            id: '2.1.2',
            title: 'Ensure the Common Attachment Types Filter is enabled',
            type: 'auto',
            profile: 'E3 L1',
            graphQuery: 'safeLinks',
            validator: () => 'warn',
            description: 'CIS Control 2.1.2'
          },
          {
            id: '2.1.3',
            title: 'Ensure notifications for internal users sending malware is Enabled',
            type: 'auto',
            profile: 'E3 L1',
            graphQuery: 'safeAttachments',
            validator: () => 'warn',
            description: 'CIS Control 2.1.3'
          },
          {
            id: '2.1.4',
            title: 'Ensure Safe Attachments policy is enabled',
            type: 'auto',
            profile: 'E3 L1',
            graphQuery: 'antiPhishing',
            validator: () => 'warn',
            description: 'CIS Control 2.1.4'
          },
          {
            id: '2.1.5',
            title: 'Ensure Safe Attachments for SharePoint; OneDrive; and Microsoft Teams is Enabled',
            type: 'auto',
            profile: 'E3 L1',
            validator: () => 'warn',
            description: 'CIS Control 2.1.5'
          },
          {
            id: '2.1.6',
            title: 'Ensure Exchange Online Spam Policies are set to notify administrators',
            type: 'auto',
            profile: 'E3 L1',
            graphQuery: 'exchangeSpamPolicies',
            validator: () => 'warn',
            description: 'CIS Control 2.1.6'
          },
          {
            id: '2.1.7',
            title: 'Ensure that an anti-phishing policy has been created',
            type: 'auto',
            profile: 'E3 L1',
            graphQuery: 'antiPhishing',
            validator: () => 'warn',
            description: 'CIS Control 2.1.7'
          },
          {
            id: '2.1.8',
            title: 'Ensure that SPF records are published for all Exchange Domains',
            type: 'auto',
            profile: 'E3 L1',
            graphQuery: 'spfRecords',
            validator: () => 'warn',
            description: 'CIS Control 2.1.8'
          },
          {
            id: '2.1.9',
            title: 'Ensure that DKIM is enabled for all Exchange Online Domains',
            type: 'auto',
            profile: 'E3 L1',
            graphQuery: 'dkim',
            validator: () => 'warn',
            description: 'CIS Control 2.1.9'
          },
          {
            id: '2.1.10',
            title: 'Ensure DMARC records for all Exchange Online domains are published',
            type: 'auto',
            profile: 'E3 L1',
            graphQuery: 'dmarc',
            validator: () => 'warn',
            description: 'CIS Control 2.1.10'
          },
          {
            id: '2.1.11',
            title: 'Ensure comprehensive attachment filtering is applied',
            type: 'auto',
            profile: 'E3 L1',
            validator: () => 'warn',
            description: 'CIS Control 2.1.11'
          },
          {
            id: '2.1.12',
            title: 'Ensure the connection filter IP allow list is not used',
            type: 'auto',
            profile: 'E3 L1',
            validator: () => 'warn',
            description: 'CIS Control 2.1.12'
          },
          {
            id: '2.1.13',
            title: 'Ensure the connection filter safe list is off',
            type: 'auto',
            profile: 'E3 L1',
            validator: () => 'warn',
            description: 'CIS Control 2.1.13'
          },
          {
            id: '2.1.14',
            title: 'Ensure inbound anti-spam policies do not contain allowed domains',
            type: 'auto',
            profile: 'E3 L1',
            validator: () => 'warn',
            description: 'CIS Control 2.1.14'
          },
          {
            id: '2.1.15',
            title: 'Ensure outbound anti-spam message limits are in place',
            type: 'auto',
            profile: 'E3 L1',
            validator: () => 'warn',
            description: 'CIS Control 2.1.15'
          }
        ]
      },
      {
        id: 't2s22',
        name: '2.2 Cloud Apps',
        controls: [
          {
            id: '2.2.1',
            title: 'Ensure emergency access account activity is monitored',
            type: 'manual',
            profile: 'E3 L1',
            validator: () => 'pass',
            description: 'CIS Control 2.2.1'
          }
        ]
      },
      {
        id: 't2s24',
        name: '2.4 System',
        controls: [
          {
            id: '2.4.1',
            title: 'Ensure Priority account protection is enabled and configured',
            type: 'auto',
            profile: 'E3 L1',
            graphQuery: 'defenderForEndpoint',
            validator: () => 'warn',
            description: 'CIS Control 2.4.1'
          },
          {
            id: '2.4.2',
            title: 'Ensure Priority accounts have \'Strict protection\' presets applied',
            type: 'auto',
            profile: 'E3 L1',
            validator: () => 'warn',
            description: 'CIS Control 2.4.2'
          },
          {
            id: '2.4.3',
            title: 'Ensure Microsoft Defender for Cloud Apps is enabled and configured',
            type: 'manual',
            profile: 'E3 L1',
            validator: () => 'pass',
            description: 'CIS Control 2.4.3'
          },
          {
            id: '2.4.4',
            title: 'Ensure Zero-hour auto purge for Microsoft Teams is on',
            type: 'auto',
            profile: 'E3 L1',
            validator: () => 'warn',
            description: 'CIS Control 2.4.4'
          },
          {
            id: '2.4.5',
            title: 'Ensure \'AIR\' remediation is enabled',
            type: 'manual',
            profile: 'E3 L1',
            validator: () => 'pass',
            description: 'CIS Control 2.4.5'
          }
        ]
      }
    ]
  },
  {
    id: 't3',
    num: '3',
    name: 'Microsoft Purview',
    icon: 'ti-database',
    subsections: [
      {
        id: 't3s31',
        name: '3.1 Audit',
        controls: [
          {
            id: '3.1.1',
            title: 'Ensure Microsoft 365 audit log search is Enabled',
            type: 'auto',
            profile: 'E3 L1',
            graphQuery: 'auditLog',
            validator: () => 'warn',
            description: 'CIS Control 3.1.1'
          }
        ]
      },
      {
        id: 't3s32',
        name: '3.2 Data Loss Prevention',
        controls: [
          {
            id: '3.2.1',
            title: 'Ensure DLP policies are enabled',
            type: 'auto',
            profile: 'E3 L1',
            graphQuery: 'dlpPolicies',
            validator: () => 'warn',
            description: 'CIS Control 3.2.1'
          },
          {
            id: '3.2.2',
            title: 'Ensure DLP policies are enabled for Microsoft Teams',
            type: 'auto',
            profile: 'E3 L1',
            graphQuery: 'dlpPolicies',
            validator: () => 'warn',
            description: 'CIS Control 3.2.2'
          },
          {
            id: '3.2.3',
            title: 'Ensure DLP policies are published for Copilot users',
            type: 'auto',
            profile: 'E3 L1',
            graphQuery: 'dlpPolicies',
            validator: () => 'warn',
            description: 'CIS Control 3.2.3'
          }
        ]
      },
      {
        id: 't3s33',
        name: '3.3 Information Protection',
        controls: [
          {
            id: '3.3.1',
            title: 'Ensure Information Protection sensitivity label policies are published',
            type: 'auto',
            profile: 'E3 L1',
            validator: () => 'warn',
            description: 'CIS Control 3.3.1'
          }
        ]
      }
    ]
  },
  {
    id: 't4',
    num: '4',
    name: 'Microsoft Intune Admin Center',
    icon: 'ti-device-mobile',
    subsections: [
      {
        id: 't4s41',
        name: '4.1 Device Management',
        controls: [
          {
            id: '4.1.1',
            title: 'Ensure devices without a compliance policy are marked not compliant',
            type: 'auto',
            profile: 'E3 L1',
            graphQuery: 'deviceCompliance',
            validator: (data) => data?.totalPolicies > 0 ? 'pass' : 'warn',
            description: 'CIS Control 4.1.1 - Device compliance enforcement'
          },
          {
            id: '4.2.1',
            title: 'Ensure device enrollment for personally owned devices is blocked by default',
            type: 'auto',
            profile: 'E3 L1',
            graphQuery: 'deviceEnrollmentRestrictions',
            validator: (data) => (data?.iosPersonalBlocked && data?.androidPersonalBlocked) ? 'pass' : 'warn',
            description: 'CIS Control 4.2.1 - BYOD enrollment restriction'
          }
        ]
      }
    ]
  },
  {
    id: 't5',
    num: '5',
    name: 'Microsoft Entra Admin Center',
    icon: 'ti-lock',
    subsections: [
      {
        id: 't5s51',
        name: '5.1 Users & Groups',
        controls: [
          {
            id: '5.1.1',
            title: 'Overview 5.1.2.1 Ensure \'Per-user MFA\' is disabled',
            type: 'manual',
            profile: 'E3 L1',
            graphQuery: 'mfaPolicies',
            validator: () => 'pass',
            description: 'CIS Control 5.1.1'
          },
          {
            id: '5.1.2',
            title: 'Users 5.1.2.1 Ensure \'Per-user MFA\' is disabled',
            type: 'manual',
            profile: 'E3 L1',
            validator: () => 'pass',
            description: 'CIS Control 5.1.2'
          },
          {
            id: '5.1.3',
            title: 'Groups 5.1.3.1 Ensure users cannot create security groups',
            type: 'auto',
            profile: 'E3 L1',
            validator: () => 'warn',
            description: 'CIS Control 5.1.3'
          },
          {
            id: '5.1.4',
            title: 'Devices 5.1.4.1 Ensure the ability to join devices to Entra is restricted',
            type: 'auto',
            profile: 'E3 L1',
            validator: () => 'warn',
            description: 'CIS Control 5.1.4'
          },
          {
            id: '5.1.5',
            title: 'Enterprise apps',
            type: 'auto',
            profile: 'E3 L1',
            validator: () => 'warn',
            description: 'CIS Control 5.1.5'
          },
          {
            id: '5.1.6',
            title: 'External Identities 5.1.6.1 Ensure that collaboration invitations are sent to al',
            type: 'auto',
            profile: 'E3 L1',
            validator: () => 'warn',
            description: 'CIS Control 5.1.6'
          },
          {
            id: '5.1.7',
            title: 'User experiences................................................................',
            type: 'auto',
            profile: 'E3 L1',
            validator: () => 'warn',
            description: 'CIS Control 5.1.7'
          },
          {
            id: '5.1.8',
            title: 'Hybrid management 5.1.8.1 Ensure that password hash sync is enabled for hybrid d',
            type: 'auto',
            profile: 'E3 L1',
            validator: () => 'warn',
            description: 'CIS Control 5.1.8'
          }
        ]
      },
      {
        id: 't5s52',
        name: '5.2 Authentication',
        controls: [
          {
            id: '5.2.2',
            title: 'Conditional Access',
            type: 'auto',
            profile: 'E3 L1',
            validator: () => 'warn',
            description: 'CIS Control 5.2.2'
          },
          {
            id: '5.2.3',
            title: 'Authentication Methods',
            type: 'auto',
            profile: 'E3 L1',
            validator: () => 'warn',
            description: 'CIS Control 5.2.3'
          },
          {
            id: '5.2.4',
            title: 'Password reset 5.2.4.1 Ensure \'Self service password reset enabled\' is set to \'A',
            type: 'manual',
            profile: 'E3 L1',
            validator: () => 'pass',
            description: 'CIS Control 5.2.4'
          }
        ]
      },
      {
        id: 't5s53',
        name: '5.3 Privileged Access',
        controls: [
          {
            id: '5.3.1',
            title: 'Ensure privileged role assignments are activated and not assigned',
            type: 'auto',
            profile: 'E3 L1',
            validator: () => 'warn',
            description: 'CIS Control 5.3.1'
          },
          {
            id: '5.3.2',
            title: 'Ensure \'Access reviews\' for guest users are configured',
            type: 'auto',
            profile: 'E3 L1',
            validator: () => 'warn',
            description: 'CIS Control 5.3.2'
          },
          {
            id: '5.3.3',
            title: 'Ensure \'Access reviews\' for privileged roles are configured',
            type: 'auto',
            profile: 'E3 L1',
            validator: () => 'warn',
            description: 'CIS Control 5.3.3'
          },
          {
            id: '5.3.4',
            title: 'Ensure approval is required for Global Administrator role activation',
            type: 'auto',
            profile: 'E3 L1',
            validator: () => 'warn',
            description: 'CIS Control 5.3.4'
          },
          {
            id: '5.3.5',
            title: 'Ensure approval is required for Privileged Role Administrator activation  . 412',
            type: 'auto',
            profile: 'E3 L1',
            validator: () => 'warn',
            description: 'CIS Control 5.3.5'
          }
        ]
      }
    ]
  },
  {
    id: 't6',
    num: '6',
    name: 'Exchange Admin Center',
    icon: 'ti-mail',
    subsections: [
      {
        id: 't6s61',
        name: '6.1 Mailbox Auditing',
        controls: [
          {
            id: '6.1.1',
            title: 'Ensure \'AuditDisabled\' organizationally is set to \'False\'',
            type: 'auto',
            profile: 'E3 L1',
            validator: () => 'warn',
            description: 'CIS Control 6.1.1'
          },
          {
            id: '6.1.2',
            title: 'Ensure mailbox audit actions are configured',
            type: 'auto',
            profile: 'E3 L1',
            validator: () => 'warn',
            description: 'CIS Control 6.1.2'
          },
          {
            id: '6.1.3',
            title: 'Ensure \'AuditBypassEnabled\' is not enabled on mailboxes',
            type: 'auto',
            profile: 'E3 L1',
            validator: () => 'warn',
            description: 'CIS Control 6.1.3'
          }
        ]
      },
      {
        id: 't6s62',
        name: '6.2 Mail Flow',
        controls: [
          {
            id: '6.2.1',
            title: 'Ensure all forms of mail forwarding are blocked and/or disabled',
            type: 'auto',
            profile: 'E3 L1',
            validator: () => 'warn',
            description: 'CIS Control 6.2.1'
          },
          {
            id: '6.2.2',
            title: 'Ensure mail transport rules do not whitelist specific domains',
            type: 'auto',
            profile: 'E3 L1',
            validator: () => 'warn',
            description: 'CIS Control 6.2.2'
          },
          {
            id: '6.2.3',
            title: 'Ensure email from external senders is identified',
            type: 'auto',
            profile: 'E3 L1',
            validator: () => 'warn',
            description: 'CIS Control 6.2.3'
          }
        ]
      },
      {
        id: 't6s63',
        name: '6.3 Client Access',
        controls: [
          {
            id: '6.3.1',
            title: 'Ensure users installing Outlook add-ins is not allowed',
            type: 'auto',
            profile: 'E3 L1',
            validator: () => 'warn',
            description: 'CIS Control 6.3.1'
          },
          {
            id: '6.3.2',
            title: 'Ensure the ability to add personal email accounts and calendars is disabled',
            type: 'auto',
            profile: 'E3 L1',
            validator: () => 'warn',
            description: 'CIS Control 6.3.2'
          }
        ]
      },
      {
        id: 't6s65',
        name: '6.5 Modern Authentication',
        controls: [
          {
            id: '6.5.1',
            title: 'Ensure modern authentication for Exchange Online is enabled',
            type: 'auto',
            profile: 'E3 L1',
            validator: () => 'warn',
            description: 'CIS Control 6.5.1'
          },
          {
            id: '6.5.2',
            title: 'Ensure MailTips are enabled for end users',
            type: 'auto',
            profile: 'E3 L1',
            validator: () => 'warn',
            description: 'CIS Control 6.5.2'
          },
          {
            id: '6.5.3',
            title: 'Ensure additional storage providers are restricted in Outlook on the web 454',
            type: 'auto',
            profile: 'E3 L1',
            validator: () => 'warn',
            description: 'CIS Control 6.5.3'
          },
          {
            id: '6.5.4',
            title: 'Ensure SMTP AUTH is disabled',
            type: 'auto',
            profile: 'E3 L1',
            validator: () => 'warn',
            description: 'CIS Control 6.5.4'
          },
          {
            id: '6.5.5',
            title: 'Ensure Direct Send submissions are rejected',
            type: 'auto',
            profile: 'E3 L1',
            validator: () => 'warn',
            description: 'CIS Control 6.5.5'
          }
        ]
      }
    ]
  },
  {
    id: 't7',
    num: '7',
    name: 'SharePoint Admin Center',
    icon: 'ti-cloud',
    subsections: [
      {
        id: 't7s72',
        name: '7.2 Sharing Settings',
        controls: [
          {
            id: '7.2.1',
            title: 'Ensure modern authentication for SharePoint applications is required',
            type: 'auto',
            profile: 'E3 L1',
            validator: () => 'warn',
            description: 'CIS Control 7.2.1'
          },
          {
            id: '7.2.2',
            title: 'Ensure SharePoint and OneDrive integration with Azure AD B2B is enabled',
            type: 'auto',
            profile: 'E3 L1',
            validator: () => 'warn',
            description: 'CIS Control 7.2.2'
          },
          {
            id: '7.2.3',
            title: 'Ensure external content sharing is restricted',
            type: 'auto',
            profile: 'E3 L1',
            validator: () => 'warn',
            description: 'CIS Control 7.2.3'
          },
          {
            id: '7.2.4',
            title: 'Ensure OneDrive content sharing is restricted',
            type: 'auto',
            profile: 'E3 L1',
            validator: () => 'warn',
            description: 'CIS Control 7.2.4'
          },
          {
            id: '7.2.5',
            title: 'Ensure that SharePoint guest users cannot share items they don\'t own  . 474',
            type: 'auto',
            profile: 'E3 L1',
            validator: () => 'warn',
            description: 'CIS Control 7.2.5'
          },
          {
            id: '7.2.6',
            title: 'Ensure SharePoint external sharing is restricted',
            type: 'auto',
            profile: 'E3 L1',
            validator: () => 'warn',
            description: 'CIS Control 7.2.6'
          },
          {
            id: '7.2.7',
            title: 'Ensure link sharing is restricted in SharePoint and OneDrive',
            type: 'auto',
            profile: 'E3 L1',
            validator: () => 'warn',
            description: 'CIS Control 7.2.7'
          },
          {
            id: '7.2.8',
            title: 'Ensure external sharing is restricted by security group',
            type: 'auto',
            profile: 'E3 L1',
            validator: () => 'warn',
            description: 'CIS Control 7.2.8'
          },
          {
            id: '7.2.9',
            title: 'Ensure guest access to a site or OneDrive will expire automatically',
            type: 'auto',
            profile: 'E3 L1',
            validator: () => 'warn',
            description: 'CIS Control 7.2.9'
          },
          {
            id: '7.2.10',
            title: 'Ensure reauthentication with verification code is restricted',
            type: 'auto',
            profile: 'E3 L1',
            validator: () => 'warn',
            description: 'CIS Control 7.2.10'
          },
          {
            id: '7.2.11',
            title: 'Ensure the SharePoint default sharing link permission is set',
            type: 'auto',
            profile: 'E3 L1',
            validator: () => 'warn',
            description: 'CIS Control 7.2.11'
          }
        ]
      },
      {
        id: 't7s73',
        name: '7.3 Malware Protection',
        controls: [
          {
            id: '7.3.1',
            title: 'Ensure Office 365 SharePoint infected files are disallowed for download  496',
            type: 'auto',
            profile: 'E3 L1',
            validator: () => 'warn',
            description: 'CIS Control 7.3.1'
          }
        ]
      }
    ]
  },
  {
    id: 't8',
    num: '8',
    name: 'Microsoft Teams Admin Center',
    icon: 'ti-users-group',
    subsections: [
      {
        id: 't8s81',
        name: '8.1 Teams Settings',
        controls: [
          {
            id: '8.1.1',
            title: 'Ensure external file sharing in Teams is enabled for only approved cloud storage',
            type: 'auto',
            profile: 'E3 L1',
            validator: () => 'warn',
            description: 'CIS Control 8.1.1'
          },
          {
            id: '8.1.2',
            title: 'Ensure users can\'t send emails to a channel email address',
            type: 'auto',
            profile: 'E3 L1',
            validator: () => 'warn',
            description: 'CIS Control 8.1.2'
          }
        ]
      },
      {
        id: 't8s82',
        name: '8.2 External Access',
        controls: [
          {
            id: '8.2.1',
            title: 'Ensure external domains are restricted in the Teams admin center',
            type: 'auto',
            profile: 'E3 L1',
            validator: () => 'warn',
            description: 'CIS Control 8.2.1'
          },
          {
            id: '8.2.2',
            title: 'Ensure communication with unmanaged Teams users is disabled',
            type: 'auto',
            profile: 'E3 L1',
            validator: () => 'warn',
            description: 'CIS Control 8.2.2'
          },
          {
            id: '8.2.3',
            title: 'Ensure external Teams users cannot initiate conversations',
            type: 'auto',
            profile: 'E3 L1',
            validator: () => 'warn',
            description: 'CIS Control 8.2.3'
          },
          {
            id: '8.2.4',
            title: 'Ensure the organization cannot communicate with accounts in trial Teams tenants',
            type: 'auto',
            profile: 'E3 L1',
            validator: () => 'warn',
            description: 'CIS Control 8.2.4'
          }
        ]
      },
      {
        id: 't8s84',
        name: '8.4 App Permissions',
        controls: [
          {
            id: '8.4.1',
            title: 'Ensure app permission policies are configured',
            type: 'manual',
            profile: 'E3 L1',
            validator: () => 'pass',
            description: 'CIS Control 8.4.1'
          }
        ]
      },
      {
        id: 't8s85',
        name: '8.5 Meeting Security',
        controls: [
          {
            id: '8.5.1',
            title: 'Ensure anonymous users can\'t join a meeting',
            type: 'auto',
            profile: 'E3 L1',
            validator: () => 'warn',
            description: 'CIS Control 8.5.1'
          },
          {
            id: '8.5.2',
            title: 'Ensure anonymous users and dial-in callers can\'t start a meeting',
            type: 'auto',
            profile: 'E3 L1',
            validator: () => 'warn',
            description: 'CIS Control 8.5.2'
          },
          {
            id: '8.5.3',
            title: 'Ensure only people in my org can bypass the lobby',
            type: 'auto',
            profile: 'E3 L1',
            validator: () => 'warn',
            description: 'CIS Control 8.5.3'
          },
          {
            id: '8.5.4',
            title: 'Ensure users dialing in can\'t bypass the lobby',
            type: 'auto',
            profile: 'E3 L1',
            validator: () => 'warn',
            description: 'CIS Control 8.5.4'
          },
          {
            id: '8.5.5',
            title: 'Ensure meeting chat does not allow anonymous users',
            type: 'auto',
            profile: 'E3 L1',
            validator: () => 'warn',
            description: 'CIS Control 8.5.5'
          },
          {
            id: '8.5.6',
            title: 'Ensure only organizers and co-organizers can present',
            type: 'auto',
            profile: 'E3 L1',
            validator: () => 'warn',
            description: 'CIS Control 8.5.6'
          },
          {
            id: '8.5.7',
            title: 'Ensure external participants can\'t give or request control',
            type: 'auto',
            profile: 'E3 L1',
            validator: () => 'warn',
            description: 'CIS Control 8.5.7'
          },
          {
            id: '8.5.8',
            title: 'Ensure external meeting chat is off',
            type: 'auto',
            profile: 'E3 L1',
            validator: () => 'warn',
            description: 'CIS Control 8.5.8'
          },
          {
            id: '8.5.9',
            title: 'Ensure meeting recording is off by default',
            type: 'auto',
            profile: 'E3 L1',
            validator: () => 'warn',
            description: 'CIS Control 8.5.9'
          }
        ]
      },
      {
        id: 't8s86',
        name: '8.6 User Reporting',
        controls: [
          {
            id: '8.6.1',
            title: 'Ensure users can report security concerns in Teams',
            type: 'auto',
            profile: 'E3 L1',
            validator: () => 'warn',
            description: 'CIS Control 8.6.1'
          }
        ]
      }
    ]
  },
  {
    id: 't9',
    num: '9',
    name: 'Microsoft Fabric',
    icon: 'ti-chart-bar',
    subsections: [
      {
        id: 't9s91',
        name: '9.1 Tenant Settings',
        controls: [
          {
            id: '9.1.1',
            title: 'Ensure guest user access is restricted',
            type: 'auto',
            profile: 'E3 L1',
            validator: () => 'warn',
            description: 'CIS Control 9.1.1'
          },
          {
            id: '9.1.2',
            title: 'Ensure external user invitations are restricted',
            type: 'auto',
            profile: 'E3 L1',
            validator: () => 'warn',
            description: 'CIS Control 9.1.2'
          },
          {
            id: '9.1.3',
            title: 'Ensure guest access to content is restricted',
            type: 'auto',
            profile: 'E3 L1',
            validator: () => 'warn',
            description: 'CIS Control 9.1.3'
          },
          {
            id: '9.1.4',
            title: 'Ensure \'Publish to web\' is restricted',
            type: 'auto',
            profile: 'E3 L1',
            validator: () => 'warn',
            description: 'CIS Control 9.1.4'
          },
          {
            id: '9.1.5',
            title: 'Ensure \'Interact with and share R and Python\' visuals is \'Disabled\'',
            type: 'auto',
            profile: 'E3 L1',
            validator: () => 'warn',
            description: 'CIS Control 9.1.5'
          },
          {
            id: '9.1.6',
            title: 'Ensure \'Allow users to apply sensitivity labels for content\' is \'Enabled\'',
            type: 'auto',
            profile: 'E3 L1',
            validator: () => 'warn',
            description: 'CIS Control 9.1.6'
          },
          {
            id: '9.1.7',
            title: 'Ensure shareable links are restricted',
            type: 'auto',
            profile: 'E3 L1',
            validator: () => 'warn',
            description: 'CIS Control 9.1.7'
          },
          {
            id: '9.1.8',
            title: 'Ensure enabling of external data sharing is restricted',
            type: 'auto',
            profile: 'E3 L1',
            validator: () => 'warn',
            description: 'CIS Control 9.1.8'
          },
          {
            id: '9.1.9',
            title: 'Ensure \'Block ResourceKey Authentication\' is \'Enabled\'',
            type: 'auto',
            profile: 'E3 L1',
            validator: () => 'warn',
            description: 'CIS Control 9.1.9'
          },
          {
            id: '9.1.10',
            title: 'Ensure access to APIs by service principals is restricted',
            type: 'auto',
            profile: 'E3 L1',
            validator: () => 'warn',
            description: 'CIS Control 9.1.10'
          },
          {
            id: '9.1.11',
            title: 'Ensure service principals cannot create and use profiles',
            type: 'auto',
            profile: 'E3 L1',
            validator: () => 'warn',
            description: 'CIS Control 9.1.11'
          },
          {
            id: '9.1.12',
            title: 'Ensure service principals ability to create workspaces; connections and deployme',
            type: 'auto',
            profile: 'E3 L1',
            validator: () => 'warn',
            description: 'CIS Control 9.1.12'
          }
        ]
      }
    ]
  },
]

export function getTotalControlsCount() {
  let total = 0
  CIS_CONTROLS_DATA.forEach(topic => {
    topic.subsections?.forEach(subsection => {
      total += subsection.controls?.length || 0
    })
  })
  return total
}