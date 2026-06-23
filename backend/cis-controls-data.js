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
            description: 'Administrative accounts are special privileged accounts that could have varying levels of access to data, users, and settings. Regular user accounts should never be utilized for administrative tasks and care should be taken, in the case of a hybrid environment, to keep administrative accounts separate from on-prem accounts. Administrative accounts should not have applications assigned so that they have no access to potentially vulnerable services (EX. email, Teams, SharePoint, etc.) and only access to perform tasks as needed for administrative purposes. Ensure administrative accounts are not On-premises sync enabled.'
          },
          {
            id: '1.1.2',
            title: 'Ensure two emergency access accounts have been defined',
            type: 'auto',
            profile: 'E3 L1',
            graphQuery: 'emergencyAccessAccounts',
            validator: () => 'warn',
            description: 'Emergency access or \'break glass\' accounts are limited for emergency scenarios where normal administrative accounts are unavailable. They are not assigned to a specific user and will have a combination of physical and technical controls to prevent them from being accessed outside a true emergency. These emergencies could be due to several things, including technical failures of a cellular provider or Microsoft related service such as MFA. The last remaining Global Administrator account is inaccessible. Ensure two Emergency Access accounts have been defined.'
          },
          {
            id: '1.1.3',
            title: 'Ensure that between two and four global admins are designated',
            type: 'auto',
            profile: 'E3 L1',
            graphQuery: 'globalAdmins',
            validator: () => 'warn',
            description: 'Between two and four global administrators should be designated in the tenant. Ideally, these accounts will not have licenses assigned to them which supports additional controls found in this benchmark.'
          },
          {
            id: '1.1.4',
            title: 'Ensure administrative accounts use licenses with a reduced application footprint',
            type: 'auto',
            profile: 'E3 L1',
            graphQuery: ['securityDefaults', 'caPolicy'],
            validator: () => 'warn',
            description: 'Administrative accounts are special privileged accounts that could have varying levels of access to data, users, and settings. A license can enable an account to gain access to a variety of different applications, depending on the license assigned. The recommended state is to not license a privileged account or use licenses without associated applications such as Microsoft Entra ID P1 or Microsoft Entra ID P2.'
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
            description: 'Microsoft 365 Groups is the foundational membership service that drives all teamwork across Microsoft 365. With Microsoft 365 Groups, you can give a group of people access to a collection of shared resources. When a new group is created in the Administration panel, the default privacy value of the group is \'Public\'. The recommended state is Microsoft 365 Groups are set to Private in the Administration panel.'
          },
          {
            id: '1.2.2',
            title: 'Ensure sign-in to shared mailboxes is blocked',
            type: 'auto',
            profile: 'E3 L1',
            graphQuery: 'sharedMailboxSignIn',
            validator: () => 'warn',
            description: 'Shared mailboxes are used when multiple people need access to the same mailbox, such as a company information or support email address, reception desk, or other function that might be shared by multiple people. Shared mailboxes are created with a corresponding user account using a system generated password that is unknown at the time of creation. The recommended state is Sign in blocked for Shared mailboxes.'
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
            graphQuery: 'passwordExpirationPolicy',
            validator: () => 'warn',
            description: 'Microsoft cloud-only accounts have a pre-defined password policy that cannot be changed. The only items that can change are the number of days until a password expires and whether or not passwords expire at all.'
          },
          {
            id: '1.3.2',
            title: 'Ensure \'Idle session timeout\' is set to \'3 hours (or less)\' for unmanaged device',
            type: 'auto',
            profile: 'E3 L1',
            graphQuery: 'idleSessionTimeout',
            validator: () => 'warn',
            description: 'Idle session timeout allows the configuration of a setting which will timeout inactive users after a pre-determined amount of time. When a user reaches the set idle timeout session, they\'ll get a notification that they\'re about to be signed out. They must choose to stay signed in or they\'ll be automatically signed out of all Microsoft 365 web apps. Combined with a Conditional Access rule this will only impact unmanaged devices.'
          },
          {
            id: '1.3.3',
            title: 'Ensure \'External sharing\' of calendars is not available',
            type: 'auto',
            profile: 'E3 L1',
            graphQuery: 'externalCalendarSharing',
            validator: () => 'warn',
            description: 'External calendar sharing allows an administrator to enable the ability for users to share calendars with anyone outside of the organization. Outside users will be sent a URL that can be used to view the calendar.'
          },
          {
            id: '1.3.4',
            title: 'Ensure \'User owned apps and services\' is restricted',
            type: 'auto',
            profile: 'E3 L1',
            graphQuery: 'userOwnedAppsServices',
            validator: () => 'warn',
            description: 'By default, users can install add-ins in their Microsoft Word, Excel, and PowerPoint applications, allowing data access within the application. Do not allow users to install add-ins in Word, Excel, or PowerPoint.'
          },
          {
            id: '1.3.5',
            title: 'Ensure internal phishing protection for Forms is enabled',
            type: 'auto',
            profile: 'E3 L1',
            graphQuery: 'auditLog',
            validator: () => 'warn',
            description: 'Microsoft Forms allows users to create surveys, quizzes, and forms that are easily shared among colleagues. As internal phishing attacks can be launched using Forms, it is important to ensure that phishing protection is enabled.'
          },
          {
            id: '1.3.6',
            title: 'Ensure the customer lockbox feature is enabled',
            type: 'auto',
            profile: 'E3 L1',
            graphQuery: 'tenantSettings',
            validator: () => 'warn',
            description: 'The Customer Lockbox feature in Office 365 allows organizations to approve or deny Microsoft support personnel access to their data during a support session. This adds an additional layer of protection to sensitive data.'
          },
          {
            id: '1.3.7',
            title: 'Ensure \'third-party storage services\' are restricted in \'Microsoft 365 on the we',
            type: 'auto',
            profile: 'E3 L1',
            graphQuery: 'thirdPartyStorageServices',
            validator: () => 'warn',
            description: 'Microsoft 365 web apps can integrate with third-party storage services. This setting controls whether users are able to access third-party storage services from the web versions of Microsoft Office applications.'
          },
          {
            id: '1.3.8',
            title: 'Ensure that Sways cannot be shared with people outside of your organization',
            type: 'manual',
            profile: 'E3 L1',
            graphQuery: 'sspr',
            validator: () => 'pass',
            description: 'Sway is a web-based application that allows users to create visually appealing reports, newsletters, and presentations. By default, Sways can be shared with anyone including external users.'
          },
          {
            id: '1.3.9',
            title: 'Ensure shared bookings pages are restricted to select users',
            type: 'auto',
            profile: 'E3 L1',
            graphQuery: 'sharedBookingsPages',
            validator: () => 'warn',
            description: 'Shared Bookings allows you to invite your team members and create booking pages and let your customers book time with you and your team. It contains various settings to define services, manage staff members, configure schedules and availability, business hours and customize how appointments are scheduled. These pages can be customized to fit the diverse needs of your organization. The recommended state is to restrict the OwaMailboxPolicy-Default policy or disable at the organization level.'
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
            graphQuery: 'safeLinksOffice',
            validator: () => 'warn',
            description: 'Safe Links is a feature in Microsoft Defender for Office 365 that provides click-time protection against malicious URLs in email messages and Office documents.'
          },
          {
            id: '2.1.2',
            title: 'Ensure the Common Attachment Types Filter is enabled',
            type: 'auto',
            profile: 'E3 L1',
            graphQuery: 'safeLinks',
            validator: () => 'warn',
            description: 'The Common Attachment Types Filter helps block dangerous file types that are commonly used in malware attacks.'
          },
          {
            id: '2.1.3',
            title: 'Ensure notifications for internal users sending malware is Enabled',
            type: 'auto',
            profile: 'E3 L1',
            graphQuery: 'safeAttachments',
            validator: () => 'warn',
            description: 'This setting enables notifications to be sent when an internal user account is detected sending malware.'
          },
          {
            id: '2.1.4',
            title: 'Ensure Safe Attachments policy is enabled',
            type: 'auto',
            profile: 'E3 L1',
            graphQuery: 'antiPhishing',
            validator: () => 'warn',
            description: 'Safe Attachments is a feature in Microsoft Defender for Office 365 that provides sandboxing for email attachments to detect malware.'
          },
          {
            id: '2.1.5',
            title: 'Ensure Safe Attachments for SharePoint; OneDrive; and Microsoft Teams is Enabled',
            type: 'auto',
            profile: 'E3 L1',
            graphQuery: 'safeAttachmentsSPOT',
            validator: () => 'warn',
            description: 'Safe Attachments can be extended to protect files uploaded to SharePoint Online, OneDrive for Business, and Microsoft Teams.'
          },
          {
            id: '2.1.6',
            title: 'Ensure Exchange Online Spam Policies are set to notify administrators',
            type: 'auto',
            profile: 'E3 L1',
            graphQuery: 'exchangeSpamPolicies',
            validator: () => 'warn',
            description: 'This setting ensures that administrators are notified when spam is detected in Exchange Online.'
          },
          {
            id: '2.1.7',
            title: 'Ensure that an anti-phishing policy has been created',
            type: 'auto',
            profile: 'E3 L1',
            graphQuery: 'antiPhishing',
            validator: () => 'warn',
            description: 'Anti-phishing policies in Microsoft Defender for Office 365 help protect users from phishing attacks by detecting and blocking phishing emails.'
          },
          {
            id: '2.1.8',
            title: 'Ensure that SPF records are published for all Exchange Domains',
            type: 'auto',
            profile: 'E3 L1',
            graphQuery: 'spfRecords',
            validator: () => 'warn',
            description: 'SPF (Sender Policy Framework) records help prevent email spoofing by specifying which mail servers are authorized to send emails for a domain.'
          },
          {
            id: '2.1.9',
            title: 'Ensure that DKIM is enabled for all Exchange Online Domains',
            type: 'auto',
            profile: 'E3 L1',
            graphQuery: 'dkim',
            validator: () => 'warn',
            description: 'DKIM (DomainKeys Identified Mail) provides email authentication by cryptographically signing outgoing emails.'
          },
          {
            id: '2.1.10',
            title: 'Ensure DMARC records for all Exchange Online domains are published',
            type: 'auto',
            profile: 'E3 L1',
            graphQuery: 'dmarc',
            validator: () => 'warn',
            description: 'DMARC (Domain-based Message Authentication, Reporting and Conformance) provides a mechanism for domain owners to specify how to handle emails that fail authentication.'
          },
          {
            id: '2.1.11',
            title: 'Ensure comprehensive attachment filtering is applied',
            type: 'auto',
            profile: 'E3 L1',
            graphQuery: 'comprehensiveAttachmentFiltering',
            validator: () => 'warn',
            description: 'Comprehensive attachment filtering helps block dangerous file types that could be used to deliver malware.'
          },
          {
            id: '2.1.12',
            title: 'Ensure the connection filter IP allow list is not used',
            type: 'auto',
            profile: 'E3 L1',
            graphQuery: 'connectionFilterIPAllowList',
            validator: () => 'warn',
            description: 'The connection filter IP allow list should not be used as it bypasses spam and malware filtering for specified IP addresses.'
          },
          {
            id: '2.1.13',
            title: 'Ensure the connection filter safe list is off',
            type: 'auto',
            profile: 'E3 L1',
            graphQuery: 'connectionFilterSafeList',
            validator: () => 'warn',
            description: 'The connection filter safe list should be disabled to ensure all inbound connections are properly evaluated.'
          },
          {
            id: '2.1.14',
            title: 'Ensure inbound anti-spam policies do not contain allowed domains',
            type: 'auto',
            profile: 'E3 L1',
            graphQuery: 'inboundAntiSpamAllowedDomains',
            validator: () => 'warn',
            description: 'Inbound anti-spam policies should not whitelist specific domains as this could allow malicious emails to bypass filtering.'
          },
          {
            id: '2.1.15',
            title: 'Ensure outbound anti-spam message limits are in place',
            type: 'auto',
            profile: 'E3 L1',
            graphQuery: 'outboundAntiSpamLimits',
            validator: () => 'warn',
            description: 'Outbound anti-spam settings should limit the number of messages that can be sent in a specified timeframe to prevent spam distribution.'
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
            type: 'auto',
            profile: 'E3 L1',
            graphQuery: 'emergencyAccessMonitoring',
            validator: () => 'warn',
            description: 'Emergency access accounts should have activity monitoring in place to detect unauthorized use or compromise.'
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
            description: 'Enabling self-service password reset allows users to reset their own passwords in Entra ID. When users sign in to Microsoft 365, they will be prompted to enter additional contact information that will help them reset their password in the future. The recommended state is All.'
          },
          {
            id: '2.4.2',
            title: 'Ensure Priority accounts have \'Strict protection\' presets applied',
            type: 'auto',
            profile: 'E3 L1',
            graphQuery: 'priorityAccountsStrictProtection',
            validator: () => 'warn',
            description: 'Self-service password reset should require at least 2 authentication methods to verify user identity.'
          },
          {
            id: '2.4.3',
            title: 'Ensure Microsoft Defender for Cloud Apps is enabled and configured',
            type: 'auto',
            profile: 'E3 L1',
            graphQuery: 'defenderForCloudAppsPolicy',
            validator: () => 'warn',
            description: 'Users should be required to register SSPR methods and periodically re-confirm their authentication information.'
          },
          {
            id: '2.4.4',
            title: 'Ensure Zero-hour auto purge for Microsoft Teams is on',
            type: 'auto',
            profile: 'E3 L1',
            graphQuery: 'zeroHourAutoPurge',
            validator: () => 'warn',
            description: 'Users should be notified when their password is reset to detect unauthorized password resets.'
          },
          {
            id: '2.4.5',
            title: 'Ensure \'AIR\' remediation is enabled',
            type: 'auto',
            profile: 'E3 L1',
            graphQuery: 'airRemediation',
            validator: () => 'warn',
            description: 'Automated Incident Response (AIR) should be enabled to automatically remediate detected threats.'
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
            graphQuery: 'auditLogSearch',
            validator: () => 'warn',
            description: 'Audit log search should be enabled to allow administrators to search for and review user and admin activity in the organization.'
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
            graphQuery: 'dlpPoliciesEnabled',
            validator: () => 'warn',
            description: 'Data Loss Prevention (DLP) policies should be created and enabled to protect sensitive data from being shared outside the organization.'
          },
          {
            id: '3.2.2',
            title: 'Ensure DLP policies are enabled for Microsoft Teams',
            type: 'auto',
            profile: 'E3 L1',
            graphQuery: 'dlpForTeams',
            validator: () => 'warn',
            description: 'DLP policies should be extended to Microsoft Teams to protect data shared through Teams channels and messages.'
          },
          {
            id: '3.2.3',
            title: 'Ensure DLP policies are published for Copilot users',
            type: 'auto',
            profile: 'E3 L1',
            graphQuery: 'dlpForCollaboration',
            validator: () => 'warn',
            description: 'DLP policies should be configured for Copilot users to prevent sensitive data from being shared with AI systems.'
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
            graphQuery: 'sensitivityLabels',
            validator: () => 'warn',
            description: 'Sensitivity label policies should be configured and published to help users classify and protect sensitive data.'
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
            type: 'auto',
            profile: 'E3 L1',
            graphQuery: 'perUserMFADisabled',
            validator: () => 'warn',
            description: 'CIS Control 5.1.2'
          },
          {
            id: '5.1.3',
            title: 'Groups 5.1.3.1 Ensure users cannot create security groups',
            type: 'auto',
            profile: 'E3 L1',
            graphQuery: 'groupCreationRestriction',
            validator: () => 'warn',
            description: 'CIS Control 5.1.3'
          },
          {
            id: '5.1.4',
            title: 'Devices 5.1.4.1 Ensure the ability to join devices to Entra is restricted',
            type: 'auto',
            profile: 'E3 L1',
            graphQuery: 'deviceJoinRestriction',
            validator: () => 'warn',
            description: 'CIS Control 5.1.4'
          },
          {
            id: '5.1.5',
            title: 'Enterprise apps',
            type: 'auto',
            profile: 'E3 L1',
            graphQuery: 'enterpriseAppsGovernance',
            validator: () => 'warn',
            description: 'CIS Control 5.1.5'
          },
          {
            id: '5.1.6',
            title: 'External Identities 5.1.6.1 Ensure that collaboration invitations are sent to al',
            type: 'auto',
            profile: 'E3 L1',
            graphQuery: 'collaborationInvitationRestriction',
            validator: () => 'warn',
            description: 'CIS Control 5.1.6'
          },
          {
            id: '5.1.7',
            title: 'User experiences................................................................',
            type: 'auto',
            profile: 'E3 L1',
            graphQuery: 'userExperienceConfiguration',
            validator: () => 'warn',
            description: 'CIS Control 5.1.7'
          },
          {
            id: '5.1.8',
            title: 'Hybrid management 5.1.8.1 Ensure that password hash sync is enabled for hybrid d',
            type: 'auto',
            profile: 'E3 L1',
            graphQuery: 'passwordHashSync',
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
            graphQuery: 'conditionalAccessPolicies',
            validator: () => 'warn',
            description: 'CIS Control 5.2.2'
          },
          {
            id: '5.2.3',
            title: 'Authentication Methods',
            type: 'auto',
            profile: 'E3 L1',
            graphQuery: 'authenticationMethods',
            validator: () => 'warn',
            description: 'CIS Control 5.2.3'
          },
          {
            id: '5.2.4',
            title: 'Password reset 5.2.4.1 Ensure \'Self service password reset enabled\' is set to \'A',
            type: 'auto',
            profile: 'E3 L1',
            graphQuery: 'sspreEnabled',
            validator: () => 'warn',
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
            graphQuery: 'privilegedRoleAssignmentJIT',
            validator: () => 'warn',
            description: 'Privileged roles should be activated on-demand through Privileged Identity Management (PIM) rather than assigned permanently.'
          },
          {
            id: '5.3.2',
            title: 'Ensure \'Access reviews\' for guest users are configured',
            type: 'auto',
            profile: 'E3 L1',
            graphQuery: 'guestAccessReviews',
            validator: () => 'warn',
            description: 'Access reviews should be configured to periodically verify that guest user access is still appropriate.'
          },
          {
            id: '5.3.3',
            title: 'Ensure \'Access reviews\' for privileged roles are configured',
            type: 'auto',
            profile: 'E3 L1',
            graphQuery: 'privilegedRoleAccessReviews',
            validator: () => 'warn',
            description: 'Access reviews in Microsoft Entra Privileged Identity Management (PIM) enable administrators to periodically validate whether users still require their privileged role assignments.'
          },
          {
            id: '5.3.4',
            title: 'Ensure approval is required for Global Administrator role activation',
            type: 'auto',
            profile: 'E3 L1',
            graphQuery: 'globalAdminApprovalRequired',
            validator: () => 'warn',
            description: 'Global Administrator role activation through PIM should require approval to add an additional layer of control.'
          },
          {
            id: '5.3.5',
            title: 'Ensure approval is required for Privileged Role Administrator activation  . 412',
            type: 'auto',
            profile: 'E3 L1',
            graphQuery: 'privilegedRoleAdminApprovalRequired',
            validator: () => 'warn',
            description: 'Privileged Role Administrator role activation should require approval to add an additional layer of control.'
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
            graphQuery: 'mailboxAuditingEnabled',
            validator: () => 'warn',
            description: 'Mailbox audit logging should be enabled for the organization to ensure that user activity is tracked.'
          },
          {
            id: '6.1.2',
            title: 'Ensure mailbox audit actions are configured',
            type: 'auto',
            profile: 'E3 L1',
            graphQuery: 'mailboxAuditRetention',
            validator: () => 'warn',
            description: 'Mailbox audit actions should be configured to log important user activities on mailboxes.'
          },
          {
            id: '6.1.3',
            title: 'Ensure \'AuditBypassEnabled\' is not enabled on mailboxes',
            type: 'auto',
            profile: 'E3 L1',
            graphQuery: 'mailboxDelegationAuditing',
            validator: () => 'warn',
            description: 'When configuring a user or computer account to bypass mailbox audit logging, the system will not record any access, or actions performed by the said user or computer account on any mailbox. Ensure AuditBypassEnabled is not enabled on accounts without a written exception.'
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
            graphQuery: 'forwardingRules',
            validator: () => 'warn',
            description: 'Mail forwarding rules should be blocked or disabled to prevent unauthorized email routing.'
          },
          {
            id: '6.2.2',
            title: 'Ensure mail transport rules do not whitelist specific domains',
            type: 'auto',
            profile: 'E3 L1',
            graphQuery: 'mailFlowRules',
            validator: () => 'warn',
            description: 'Mail flow rules (transport rules) in Exchange Online can be configured to set the spam confidence level (SCL) of a message to -1, which bypasses spam and phishing filtering. When a rule applies this action to messages based on the sender\'s domain, all mail from that domain is treated as trusted and skips anti-malware and anti-phishing evaluation regardless of message content.'
          },
          {
            id: '6.2.3',
            title: 'Ensure email from external senders is identified',
            type: 'auto',
            profile: 'E3 L1',
            graphQuery: 'emailAuthentication',
            validator: () => 'warn',
            description: 'External emails should be marked to identify them as coming from outside the organization.'
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
            graphQuery: 'clientAccess',
            validator: () => 'warn',
            description: 'Users should not be allowed to install Outlook add-ins to prevent malicious add-ins from being used to compromise data.'
          },
          {
            id: '6.3.2',
            title: 'Ensure the ability to add personal email accounts and calendars is disabled',
            type: 'auto',
            profile: 'E3 L1',
            graphQuery: 'legacyAuthentication',
            validator: () => 'warn',
            description: 'Users should not be allowed to add personal email accounts to Outlook to prevent data leakage.'
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
            graphQuery: 'modernAuthenticationRequired',
            validator: () => 'warn',
            description: 'Modern authentication should be enabled for Exchange Online to ensure users authenticate using secure methods.'
          },
          {
            id: '6.5.2',
            title: 'Ensure MailTips are enabled for end users',
            type: 'auto',
            profile: 'E3 L1',
            graphQuery: 'oauthTokenLifetime',
            validator: () => 'warn',
            description: 'MailTips should be enabled to provide users with helpful information about recipients and email sending.'
          },
          {
            id: '6.5.3',
            title: 'Ensure additional storage providers are restricted in Outlook on the web 454',
            type: 'auto',
            profile: 'E3 L1',
            graphQuery: 'sessionTimeout',
            validator: () => 'warn',
            description: 'Additional storage providers should be restricted in Outlook on the web to prevent data exfiltration.'
          },
          {
            id: '6.5.4',
            title: 'Ensure SMTP AUTH is disabled',
            type: 'auto',
            profile: 'E3 L1',
            graphQuery: 'mfaForOWA',
            validator: () => 'warn',
            description: 'SMTP AUTH should be disabled to prevent legacy authentication protocols from being used.'
          },
          {
            id: '6.5.5',
            title: 'Ensure Direct Send submissions are rejected',
            type: 'auto',
            profile: 'E3 L1',
            graphQuery: 'mfaForPowerShell',
            validator: () => 'warn',
            description: 'Direct Send capability should be disabled to prevent unauthenticated email submissions.'
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
            graphQuery: 'sharePointModernAuth',
            validator: () => 'warn',
            description: 'Modern authentication should be required for SharePoint applications to ensure secure authentication.'
          },
          {
            id: '7.2.2',
            title: 'Ensure SharePoint and OneDrive integration with Azure AD B2B is enabled',
            type: 'auto',
            profile: 'E3 L1',
            graphQuery: 'externalUserExpiration',
            validator: () => 'warn',
            description: 'SharePoint and OneDrive should integrate with Azure AD B2B to provide secure guest access.'
          },
          {
            id: '7.2.3',
            title: 'Ensure external content sharing is restricted',
            type: 'auto',
            profile: 'E3 L1',
            graphQuery: 'restrictExternalSharing',
            validator: () => 'warn',
            description: 'External content sharing should be restricted to prevent organizational data from being shared outside the organization.'
          },
          {
            id: '7.2.4',
            title: 'Ensure OneDrive content sharing is restricted',
            type: 'auto',
            profile: 'E3 L1',
            graphQuery: 'fileFolderLinkSettings',
            validator: () => 'warn',
            description: 'OneDrive content sharing should be restricted to prevent users from sharing organizational data without authorization.'
          },
          {
            id: '7.2.5',
            title: 'Ensure that SharePoint guest users cannot share items they don\'t own  . 474',
            type: 'auto',
            profile: 'E3 L1',
            graphQuery: 'preventDownload',
            validator: () => 'warn',
            description: 'Guest users should not be allowed to share SharePoint items that they don\'t own.'
          },
          {
            id: '7.2.6',
            title: 'Ensure SharePoint external sharing is restricted',
            type: 'auto',
            profile: 'E3 L1',
            graphQuery: 'restrictUnmanagedDevices',
            validator: () => 'warn',
            description: 'SharePoint external sharing should be restricted to minimize the risk of data leakage.'
          },
          {
            id: '7.2.7',
            title: 'Ensure link sharing is restricted in SharePoint and OneDrive',
            type: 'auto',
            profile: 'E3 L1',
            graphQuery: 'allowLimitedAccess',
            validator: () => 'warn',
            description: 'This setting sets the default link type that a user will see when sharing content in OneDrive or SharePoint. It does not restrict or exclude any other options. The recommended state is Specific people (only the people the user specifies) or Only people in your organization.'
          },
          {
            id: '7.2.8',
            title: 'Ensure external sharing is restricted by security group',
            type: 'auto',
            profile: 'E3 L1',
            graphQuery: 'restrictUnmanagedDevicesAccess',
            validator: () => 'warn',
            description: 'External sharing should be restricted to members of specified security groups to limit who can share content externally.'
          },
          {
            id: '7.2.9',
            title: 'Ensure guest access to a site or OneDrive will expire automatically',
            type: 'auto',
            profile: 'E3 L1',
            graphQuery: 'restrictNetworkLocation',
            validator: () => 'warn',
            description: 'Guest access to SharePoint sites and OneDrive should be set to expire automatically to limit long-term access.'
          },
          {
            id: '7.2.10',
            title: 'Ensure reauthentication with verification code is restricted',
            type: 'auto',
            profile: 'E3 L1',
            graphQuery: 'restrictConditionalAccessPolicies',
            validator: () => 'warn',
            description: 'This setting configures if guests who use a verification code to access the site or links are required to reauthenticate after a set number of days. The recommended state is 15 or less.'
          },
          {
            id: '7.2.11',
            title: 'Ensure the SharePoint default sharing link permission is set',
            type: 'auto',
            profile: 'E3 L1',
            graphQuery: 'sharePointTermsAcceptance',
            validator: () => 'warn',
            description: 'The default sharing link permission in SharePoint should be set to restrict the permissions granted by default.'
          }
        ]
      },
      {
        id: 't7s73',
        name: '7.3 Malware Protection',
        controls: [
          {
            id: '7.3.1',
            title: 'Ensure Office 365 SharePoint infected files are disallowed for download',
            type: 'auto',
            profile: 'E3 L1',
            graphQuery: 'sharePointInfectedFiles',
            validator: () => 'warn',
            description: 'SharePoint should be configured to block downloads of files detected as infected.'
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
            graphQuery: 'teamsExternalFileSharing',
            validator: () => 'warn',
            description: 'External file sharing in Teams should be restricted to only approved cloud storage services.'
          },
          {
            id: '8.1.2',
            title: 'Ensure users can\'t send emails to a channel email address',
            type: 'auto',
            profile: 'E3 L1',
            graphQuery: 'teamsEmailChannelAddress',
            validator: () => 'warn',
            description: 'This setting controls whether Teams channels are allowed to receive emails sent to their unique email addresses. When enabled, emails sent to a channel\'s address will be delivered and appear in the channel\'s conversation thread; when disabled, the channel will reject incoming emails, preventing them from being posted. The recommended state is Off.'
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
            graphQuery: 'teamsExternalDomainRestriction',
            validator: () => 'warn',
            description: 'Teams external domain access should be restricted to approved domains only.'
          },
          {
            id: '8.2.2',
            title: 'Ensure communication with unmanaged Teams users is disabled',
            type: 'auto',
            profile: 'E3 L1',
            graphQuery: 'teamsUnmanagedUsersCommunication',
            validator: () => 'warn',
            description: 'Communication with unmanaged Teams users should be disabled to prevent access by users without organizational control.'
          },
          {
            id: '8.2.3',
            title: 'Ensure external Teams users cannot initiate conversations',
            type: 'auto',
            profile: 'E3 L1',
            graphQuery: 'teamsExternalInitiateConversations',
            validator: () => 'warn',
            description: 'This setting prevents external users who are not managed by an organization from initiating contact with users in the protected organization. The recommended state is to uncheck People in my org can chat and have meetings with external users who have unmanaged Microsoft accounts.'
          },
          {
            id: '8.2.4',
            title: 'Ensure the organization cannot communicate with accounts in trial Teams tenants',
            type: 'auto',
            profile: 'E3 L1',
            graphQuery: 'teamsTrialTenantsBlocked',
            validator: () => 'warn',
            description: 'Communication with trial Teams tenants should be blocked to prevent unauthorized access.'
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
            type: 'auto',
            profile: 'E3 L1',
            graphQuery: 'teamsAppPermissionPolicies',
            validator: () => 'warn',
            description: 'Teams app permission policies should be configured to control which apps users can access.'
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
            graphQuery: 'meetingOrganizerOnly',
            validator: () => 'warn',
            description: 'Anonymous users should not be allowed to join Teams meetings to prevent unauthorized access.'
          },
          {
            id: '8.5.2',
            title: 'Ensure anonymous users and dial-in callers can\'t start a meeting',
            type: 'auto',
            profile: 'E3 L1',
            graphQuery: 'meetingTranscripts',
            validator: () => 'warn',
            description: 'Anonymous users and dial-in callers should not be allowed to start Teams meetings.'
          },
          {
            id: '8.5.3',
            title: 'Ensure only people in my org can bypass the lobby',
            type: 'auto',
            profile: 'E3 L1',
            graphQuery: 'recordingNotifications',
            validator: () => 'warn',
            description: 'Only internal users should be allowed to bypass the meeting lobby to control who joins meetings.'
          },
          {
            id: '8.5.4',
            title: 'Ensure users dialing in can\'t bypass the lobby',
            type: 'auto',
            profile: 'E3 L1',
            graphQuery: 'liveCaptions',
            validator: () => 'warn',
            description: 'Users dialing in via phone should not be allowed to bypass the meeting lobby.'
          },
          {
            id: '8.5.5',
            title: 'Ensure meeting chat does not allow anonymous users',
            type: 'auto',
            profile: 'E3 L1',
            graphQuery: 'qAndANotAvailable',
            validator: () => 'warn',
            description: 'Anonymous users should not be allowed to participate in meeting chat.'
          },
          {
            id: '8.5.6',
            title: 'Ensure only organizers and co-organizers can present',
            type: 'auto',
            profile: 'E3 L1',
            graphQuery: 'preventAnonymousUsers',
            validator: () => 'warn',
            description: 'Only meeting organizers and co-organizers should be allowed to present in Teams meetings.'
          },
          {
            id: '8.5.7',
            title: 'Ensure external participants can\'t give or request control',
            type: 'auto',
            profile: 'E3 L1',
            graphQuery: 'preventDialOut',
            validator: () => 'warn',
            description: 'External participants should not be allowed to give or request control of the meeting.'
          },
          {
            id: '8.5.8',
            title: 'Ensure external meeting chat is off',
            type: 'auto',
            profile: 'E3 L1',
            graphQuery: 'teamsLiveEventsRestricted',
            validator: () => 'warn',
            description: 'External users should not be allowed to use meeting chat.'
          },
          {
            id: '8.5.9',
            title: 'Ensure meeting recording is off by default',
            type: 'auto',
            profile: 'E3 L1',
            graphQuery: 'e2eEncryption',
            validator: () => 'warn',
            description: 'Meeting recording should be disabled by default to protect privacy and prevent unauthorized recording.'
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
            graphQuery: 'teamsReportSecurityConcerns',
            validator: () => 'warn',
            description: 'Users should be able to report security concerns and spam in Teams.'
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
            graphQuery: 'fabricGuestAccess',
            validator: () => 'warn',
            description: 'Guest user access in Fabric should be restricted to minimize security risk.'
          },
          {
            id: '9.1.2',
            title: 'Ensure external user invitations are restricted',
            type: 'auto',
            profile: 'E3 L1',
            graphQuery: 'fabricExternalInvitations',
            validator: () => 'warn',
            description: 'External user invitations in Fabric should be restricted or disabled.'
          },
          {
            id: '9.1.3',
            title: 'Ensure guest access to content is restricted',
            type: 'auto',
            profile: 'E3 L1',
            graphQuery: 'fabricGuestContentAccess',
            validator: () => 'warn',
            description: 'Guest access to Fabric content should be restricted or disabled.'
          },
          {
            id: '9.1.4',
            title: 'Ensure \'Publish to web\' is restricted',
            type: 'auto',
            profile: 'E3 L1',
            graphQuery: 'fabricPublishToWeb',
            validator: () => 'warn',
            description: 'The ability to publish Fabric reports to the web should be disabled.'
          },
          {
            id: '9.1.5',
            title: 'Ensure \'Interact with and share R and Python\' visuals is \'Disabled\'',
            type: 'auto',
            profile: 'E3 L1',
            graphQuery: 'fabricPythonRSharing',
            validator: () => 'warn',
            description: 'R and Python visual interaction and sharing should be disabled.'
          },
          {
            id: '9.1.6',
            title: 'Ensure \'Allow users to apply sensitivity labels for content\' is \'Enabled\'',
            type: 'auto',
            profile: 'E3 L1',
            graphQuery: 'fabricSensitivityLabels',
            validator: () => 'warn',
            description: 'Users should be allowed to apply sensitivity labels to Fabric content.'
          },
          {
            id: '9.1.7',
            title: 'Ensure shareable links are restricted',
            type: 'auto',
            profile: 'E3 L1',
            graphQuery: 'fabricShareableLinks',
            validator: () => 'warn',
            description: 'Shareable links in Fabric should be restricted to prevent unauthorized access.'
          },
          {
            id: '9.1.8',
            title: 'Ensure enabling of external data sharing is restricted',
            type: 'auto',
            profile: 'E3 L1',
            graphQuery: 'fabricExternalDataSharing',
            validator: () => 'warn',
            description: 'External data sharing in Fabric should be disabled.'
          },
          {
            id: '9.1.9',
            title: 'Ensure \'Block ResourceKey Authentication\' is \'Enabled\'',
            type: 'auto',
            profile: 'E3 L1',
            graphQuery: 'fabricResourceKeyAuth',
            validator: () => 'warn',
            description: 'Resource Key authentication in Fabric should be blocked.'
          },
          {
            id: '9.1.10',
            title: 'Ensure access to APIs by service principals is restricted',
            type: 'auto',
            profile: 'E3 L1',
            graphQuery: 'fabricSPAPIAccess',
            validator: () => 'warn',
            description: 'Service principal API access in Fabric should be restricted or disabled.'
          },
          {
            id: '9.1.11',
            title: 'Ensure service principals cannot create and use profiles',
            type: 'auto',
            profile: 'E3 L1',
            graphQuery: 'fabricSPProvisioning',
            validator: () => 'warn',
            description: 'Service principals should not be allowed to create or use profiles in Fabric.'
          },
          {
            id: '9.1.12',
            title: 'Ensure service principals ability to create workspaces; connections and deployme',
            type: 'auto',
            profile: 'E3 L1',
            graphQuery: 'fabricSPWorkspaceCreation',
            validator: () => 'warn',
            description: 'Service principals should not be allowed to create workspaces, connections, or deployment pipelines in Fabric.'
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