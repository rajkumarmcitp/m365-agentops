export const CFG_TOPICS = [
  // ============================================================
  // Topic 1 — Microsoft 365 admin center
  // ============================================================
  {
    id: 't1',
    num: '1',
    name: 'Microsoft 365 Admin Center',
    icon: 'ti-apps',
    iconBg: '#E6F1FB',
    iconColor: '#0C447C',
    subsections: [
      {
        id: 't1s1',
        name: '1.1 Users',
        controls: [
          { id: '1.1.1', title: 'Ensure that between two and four global admins are designated', type: 'auto', profile: 'E3 L1', status: 'pass', value: '2 Global Admins active in tenant.', desc: 'Maintains the minimum necessary Global Admin accounts to reduce attack surface.', ps: `Get-MgDirectoryRoleMember -DirectoryRoleId (Get-MgDirectoryRole -Filter "displayName eq 'Global Administrator'").Id | Select DisplayName,UserPrincipalName` },
          { id: '1.1.2', title: 'Ensure third-party integrated applications are not allowed', type: 'auto', profile: 'E3 L1', status: 'warn', value: 'User consent for third-party apps is set to: Allow user consent for apps from verified publishers.', desc: 'Restricts OAuth app consent to reduce risk of malicious app data access.', ps: `(Get-MgPolicyAuthorizationPolicy).DefaultUserRolePermissions.AllowedToCreateApps` },
          { id: '1.1.3', title: 'Ensure the default user role has no ability to create tenants', type: 'auto', profile: 'E3 L1', status: 'pass', value: 'AllowedToCreateTenants: false', desc: 'Prevents non-admin users from creating new Entra ID tenants.', ps: `(Get-MgPolicyAuthorizationPolicy).DefaultUserRolePermissions | Select AllowedToCreateTenants` },
          { id: '1.1.4', title: 'Ensure Security Defaults are disabled when Conditional Access is used', type: 'auto', profile: 'E3 L1', status: 'fail', value: 'Security Defaults: ENABLED — conflicts with existing Conditional Access policies.', desc: 'Security Defaults and Conditional Access are mutually exclusive and should not coexist.', ps: `(Get-MgPolicyIdentitySecurityDefaultEnforcementPolicy).IsEnabled` },
        ],
      },
      {
        id: 't1s2',
        name: '1.2 Teams & Groups',
        controls: [
          { id: '1.2.1', title: 'Ensure Microsoft 365 Groups creation is restricted to admins', type: 'auto', profile: 'E3 L1', status: 'warn', value: 'Group creation: All users can create Microsoft 365 groups.', desc: 'Limits group sprawl by restricting M365 group creation to administrators.', ps: `(Get-MgPolicyAuthorizationPolicy).DefaultUserRolePermissions | Select-Object AllowedToCreateSecurityGroups, AllowedToCreateApps` },
          { id: '1.2.2', title: 'Ensure a dynamic group for guest users is configured', type: 'manual', profile: 'E3 L1', status: 'pass', value: null, desc: 'Dynamic group enables governance and access management across all guest identities.', ps: null },
        ],
      },
      {
        id: 't1s3',
        name: '1.3 Settings',
        controls: [
          { id: '1.3.1', title: 'Ensure the admin consent workflow is enabled', type: 'auto', profile: 'E3 L1', status: 'pass', value: 'Admin consent workflow: Enabled. Reviewers: 2 admins configured.', desc: 'Allows users to request admin approval for apps instead of self-consenting.', ps: `Get-MgPolicyAdminConsentRequestPolicy | Select IsEnabled` },
          { id: '1.3.2', title: 'Ensure sign-in to shared mailboxes is blocked', type: 'auto', profile: 'E3 L1', status: 'pass', value: 'All 14 shared mailboxes have accounts blocked from interactive sign-in.', desc: 'Shared mailbox accounts should not allow interactive login to prevent account abuse.', ps: `Get-MgUser -Filter "assignedLicenses/any() and userType eq 'Member'" -All | Where {$_.Mail -like '*shared*'}` },
          { id: '1.3.3', title: 'Ensure the customer lockbox feature is enabled', type: 'auto', profile: 'E3 L2', status: 'pass', value: 'Customer Lockbox: Enabled', desc: 'Customer Lockbox requires admin approval before Microsoft support can access tenant data.', ps: `Get-OrganizationConfig | Select CustomerLockBoxEnabled` },
          { id: '1.3.4', title: 'Ensure notifications for internal phishing are enabled', type: 'auto', profile: 'E3 L1', status: 'pass', value: 'Internal phishing notifications: Enabled via Defender anti-phishing policy.', desc: 'Notifies users when internal phishing attempts are detected.', ps: `Get-AntiPhishPolicy | Select Name,EnableMailboxIntelligence,EnableFirstContactSafetyTips` },
          { id: '1.3.5', title: 'Ensure Microsoft 365 audit log search is enabled', type: 'auto', profile: 'E3 L1', status: 'pass', value: 'Unified Audit Log: Enabled', desc: 'Audit log enables security investigations and compliance reporting.', ps: `Get-AdminAuditLogConfig | Select UnifiedAuditLogIngestionEnabled` },
          { id: '1.3.6', title: 'Ensure DLP policies are enabled for Microsoft Teams', type: 'auto', profile: 'E3 L1', status: 'fail', value: 'No DLP policy found targeting Microsoft Teams workload.', desc: 'DLP policies prevent sensitive data from being shared via Teams messages.', ps: `Get-DlpCompliancePolicy | Where {$_.Workload -like '*Teams*'} | Select Name,Mode,Enabled` },
          { id: '1.3.7', title: 'Ensure that Microsoft 365 passwords are not set to expire', type: 'auto', profile: 'E3 L1', status: 'pass', value: 'Password expiration policy: Disabled (never expire).', desc: 'NIST guidance recommends not forcing periodic password changes; MFA is more effective.', ps: `Get-MgDomain | Select Id,PasswordNotificationWindowInDays,PasswordValidityPeriodInDays` },
          { id: '1.3.8', title: 'Ensure self-service password reset is enabled', type: 'auto', profile: 'E3 L1', status: 'warn', value: 'SSPR: Enabled for selected users only (not all users).', desc: 'SSPR reduces helpdesk burden and allows users to recover accounts securely.', ps: `Get-MgPolicySelfServiceSignUpPolicy | Select IsEnabled` },
          { id: '1.3.9', title: 'Ensure the option to stay signed in is hidden', type: 'manual', profile: 'E3 L1', status: 'pass', value: null, desc: 'Hiding the stay signed-in prompt reduces the risk of persistent session tokens on shared devices.', ps: null },
        ],
      },
    ],
  },

  // ============================================================
  // Topic 2 — Email Security
  // ============================================================
  {
    id: 't2',
    num: '2',
    name: 'Email Security',
    icon: 'ti-mail',
    iconBg: '#FCEBEB',
    iconColor: '#A32D2D',
    subsections: [
      {
        id: 't2s1',
        name: '2.1 Email Protection',
        controls: [
          { id: '2.1.1', title: 'Ensure Safe Links for Office Applications is Enabled', type: 'auto', profile: 'E3 L1', status: 'pass', value: 'Safe Links: Enabled for Email, Teams, Office with click tracking.', desc: 'Safe Links protects users from malicious URLs in email and Office documents.', ps: `Get-SafeLinksPolicy | Select-Object Identity,EnableSafeLinksForEmail,EnableSafeLinksForTeams,EnableSafeLinksForOffice,TrackClicks` },
          { id: '2.1.2', title: 'Ensure Common Attachment Types Filter is Enabled', type: 'auto', profile: 'E3 L1', status: 'pass', value: 'File filter: Enabled. Blocks dangerous attachment types.', desc: 'Blocks dangerous file types (EXE, VBS, PS1, etc) from entering the organization.', ps: `Get-MalwareFilterPolicy -Identity Default | Select EnableFileFilter,FileTypeActionOnError` },
          { id: '2.1.3', title: 'Ensure Notifications for Internal Users Sending Malware is Enabled', type: 'auto', profile: 'E3 L1', status: 'fail', value: 'Malware notifications: DISABLED. Admins not notified of internal malware.', desc: 'Notifies admins when internal users attempt to send malware-infected attachments.', ps: `Get-MalwareFilterPolicy | Select Identity,EnableInternalSenderAdminNotifications,InternalSenderAdminAddress` },
          { id: '2.1.4', title: 'Ensure Safe Attachments Policy is Enabled', type: 'auto', profile: 'E3 L1', status: 'pass', value: 'Safe Attachments: Enabled (Block action, AdminOnlyAccessPolicy).', desc: 'Safe Attachments detonates email attachments in a sandbox to detect malware.', ps: `Get-SafeAttachmentPolicy | Select Identity,Enable,Action,QuarantineTag` },
          { id: '2.1.5', title: 'Ensure Safe Attachments for SharePoint, OneDrive, and Teams is Enabled', type: 'auto', profile: 'E3 L1', status: 'pass', value: 'ATP for SPO/Teams: Enabled. SafeDocs: Enabled.', desc: 'Provides safe attachment scanning for cloud workloads beyond email.', ps: `Get-AtpPolicyForO365 | Select Name,EnableATPForSPOTeamsODB,EnableSafeDocs,AllowSafeDocsOpen` },
          { id: '2.1.6', title: 'Ensure Spam Policies Notify Administrators', type: 'auto', profile: 'E3 L1', status: 'fail', value: 'Spam notifications: DISABLED. Admins not notified of outbound spam.', desc: 'Notifies admins of suspicious outbound mail patterns from compromised accounts.', ps: `Get-HostedOutboundSpamFilterPolicy | Select NotifyOutboundSpam,NotifyOutboundSpamRecipients,BccSuspiciousOutboundMail` },
          { id: '2.1.7', title: 'Ensure Anti-Phishing Policy is Created and Configured', type: 'auto', profile: 'E3 L1', status: 'fail', value: 'Anti-phishing: Default policy exists but protections NOT fully enabled.', desc: 'Protects against impersonation and spoofing attacks via anti-phishing policies.', ps: `Get-AntiPhishPolicy | Select Name,Enabled,EnableTargetedUserProtection,EnableOrganizationDomainsProtection,HonorDmarcPolicy` },
          { id: '2.1.8', title: 'Ensure SPF Records are Published for All Exchange Domains', type: 'auto', profile: 'E3 L1', status: 'warn', value: 'SPF records: Manual verification required via DNS.', desc: 'SPF records help prevent email spoofing by specifying authorized mail senders.', ps: `Get-AcceptedDomain | Where-Object {$_.IsCoExistenceDomain -eq $false -and $_.InitialDomain -eq $false}` },
          { id: '2.1.9', title: 'Ensure DKIM Signing is Enabled for All Domains', type: 'auto', profile: 'E3 L1', status: 'pass', value: 'DKIM: Enabled for all domains (Valid status).', desc: 'DKIM signing adds cryptographic authentication to outbound email.', ps: `Get-DkimSigningConfig | Select Domain,Enabled,Status` },
          { id: '2.1.10', title: 'Ensure DMARC Policy is Published for All Domains', type: 'auto', profile: 'E3 L1', status: 'warn', value: 'DMARC: Manual verification required via DNS _dmarc records.', desc: 'DMARC policy instructs receivers on how to handle emails failing SPF/DKIM.', ps: `Get-AcceptedDomain | Where-Object {$_.IsCoExistenceDomain -eq $false}` },
          { id: '2.1.11', title: 'Ensure Comprehensive Attachment Filtering is Applied', type: 'auto', profile: 'E3 L1', status: 'warn', value: 'Attachment filtering: Basic rules configured. Verify file type coverage.', desc: 'Filters dangerous file extensions to prevent malware delivery.', ps: `Get-MalwareFilterPolicy | Select Identity,FileTypes,EnableFileFilter` },
          { id: '2.1.12', title: 'Ensure Connection Filter IP Allow List is Not Used', type: 'auto', profile: 'E3 L1', status: 'pass', value: 'IP Allow List: EMPTY (not configured).', desc: 'IP allow lists can bypass Exchange Online Protection and should not be used.', ps: `Get-HostedConnectionFilterPolicy -Identity Default | Select IPAllowList,EnableSafeList` },
          { id: '2.1.13', title: 'Ensure Connection Filter Safe List is Off', type: 'auto', profile: 'E3 L1', status: 'pass', value: 'Safe List: Disabled.', desc: 'Safe list should be disabled to prevent bypass of malware scanning.', ps: `Get-HostedConnectionFilterPolicy -Identity Default | Select EnableSafeList` },
          { id: '2.1.14', title: 'Ensure Inbound Anti-Spam Policies Do Not Contain Allowed Domains', type: 'auto', profile: 'E3 L1', status: 'pass', value: 'Allowed domains in spam policy: 0 (none configured).', desc: 'Excessive allow lists bypass security controls and increase phishing risk.', ps: `Get-HostedContentFilterPolicy | Select Identity,AllowedSenderDomains` },
          { id: '2.1.15', title: 'Ensure Outbound Anti-Spam Message Limits are in Place', type: 'auto', profile: 'E3 L1', status: 'warn', value: 'Outbound limits: Configured but verify thresholds meet organizational policy.', desc: 'Prevents compromised accounts from sending mass spam or malware.', ps: `Get-HostedOutboundSpamFilterPolicy -Identity Default | Select RecipientLimitExternalPerHour,RecipientLimitInternalPerHour,ActionWhenThresholdReached` },
        ],
      },
      {
        id: 't2s2',
        name: '2.4 Threat Protection',
        controls: [
          { id: '2.4.1', title: 'Ensure Defender for Office 365 Plan 1 or 2 License is Assigned', type: 'auto', profile: 'E3 L1', status: 'warn', value: 'Defender for Office 365: Check Azure portal for active license.', desc: 'Defender for Office 365 provides advanced threat protection for email.', ps: `Get-MgSubscribedSku | Where-Object {$_.SkuPartNumber -like '*ATP*' -or $_.SkuPartNumber -like '*M365*'}` },
          { id: '2.4.2', title: 'Ensure URL Rewriting and User Clicks Tracking is Enabled', type: 'auto', profile: 'E3 L1', status: 'fail', value: 'URL rewriting: DISABLED (DisableUrlRewrite=True). Should be enabled.', desc: 'URL rewriting and click tracking enables threat protection and user behavior analysis.', ps: `Get-SafeLinksPolicy | Select Identity,TrackClicks,DisableUrlRewrite` },
          { id: '2.4.4', title: 'Ensure Defender for Office 365 Pre-Delivery Message Scanning is Enabled', type: 'auto', profile: 'E3 L1', status: 'pass', value: 'Pre-delivery scanning: Enabled on Safe Attachments policy.', desc: 'Pre-delivery scanning detects threats before users receive messages.', ps: `Get-SafeAttachmentPolicy | Select Identity,Enable,Action` },
        ],
      },
    ],
  },

  // ============================================================
  // Topic 3 — Microsoft Purview
  // ============================================================
  {
    id: 't3',
    num: '3',
    name: 'Microsoft Purview',
    icon: 'ti-lock',
    iconBg: '#EEEDFE',
    iconColor: '#3C3489',
    subsections: [
      {
        id: 't3s1',
        name: '3.1 Audit',
        controls: [
          { id: '3.1.1', title: 'Ensure Microsoft 365 audit log search is enabled', type: 'auto', profile: 'E3 L1', status: 'pass', value: 'Unified Audit Log ingestion: Enabled', desc: 'Audit log must be enabled to record all user and admin activities in Microsoft 365.', ps: `Get-AdminAuditLogConfig | Select UnifiedAuditLogIngestionEnabled` },
        ],
      },
      {
        id: 't3s2',
        name: '3.2 Data Loss Prevention',
        controls: [
          { id: '3.2.1', title: 'Ensure DLP policies are enabled for SharePoint and OneDrive', type: 'auto', profile: 'E3 L1', status: 'pass', value: 'DLP policy "Protect PII — SharePoint/OneDrive" active in Enforce mode.', desc: 'DLP policies prevent sensitive data from being inappropriately shared via SharePoint.', ps: `Get-DlpCompliancePolicy | Where {$_.Workload -like '*SharePoint*'} | Select Name,Mode` },
          { id: '3.2.2', title: 'Ensure DLP policies are enabled for Exchange Online', type: 'auto', profile: 'E3 L1', status: 'pass', value: 'DLP policy "Protect PII — Exchange" active in Enforce mode.', desc: 'DLP policies prevent sensitive data from being emailed outside the organisation.', ps: `Get-DlpCompliancePolicy | Where {$_.Workload -like '*Exchange*'} | Select Name,Mode` },
          { id: '3.2.3', title: 'Ensure DLP policies are enabled for Microsoft Teams', type: 'auto', profile: 'E3 L1', status: 'fail', value: 'No DLP policy found targeting Microsoft Teams workload.', desc: 'Teams DLP prevents sensitive information from being shared in chat messages.', ps: `Get-DlpCompliancePolicy | Where {$_.Workload -like '*Teams*'} | Select Name,Mode,Enabled` },
        ],
      },
      {
        id: 't3s3',
        name: '3.3 Information Protection',
        controls: [
          { id: '3.3.1', title: 'Ensure sensitivity labels are established', type: 'manual', profile: 'E3 L1', status: 'pass', value: null, desc: 'Sensitivity labels enable classification and protection of organisational data.', ps: null },
        ],
      },
    ],
  },

  // ============================================================
  // Topic 4 — Microsoft Intune
  // ============================================================
  {
    id: 't4',
    num: '4',
    name: 'Microsoft Intune',
    icon: 'ti-device-desktop',
    iconBg: '#EAF3DE',
    iconColor: '#3B6D11',
    subsections: [
      {
        id: 't4s1',
        name: '4. Device Compliance',
        controls: [
          { id: '4.1', title: 'Ensure mobile device management policies are set to require advanced security configurations', type: 'auto', profile: 'E3 L1', status: 'pass', value: 'Compliance policies enforce encryption, PIN, and OS version for all platforms.', desc: 'MDM compliance policies ensure devices meet minimum security requirements.', ps: `Get-MgDeviceManagementDeviceCompliancePolicy | Select DisplayName,Id` },
          { id: '4.2', title: 'Ensure mobile device management policies are set to wipe on excessive failed attempts', type: 'auto', profile: 'E3 L1', status: 'pass', value: 'Device wipe configured after 10 failed sign-in attempts on managed devices.', desc: 'Remote wipe capability protects corporate data on lost or stolen devices.', ps: `Get-MgDeviceManagementDeviceConfiguration | Select DisplayName | Where {$_.DisplayName -like '*Wipe*'}` },
        ],
      },
    ],
  },

  // ============================================================
  // Topic 5 — Microsoft Entra Admin Center
  // ============================================================
  {
    id: 't5',
    num: '5',
    name: 'Microsoft Entra Admin Center',
    icon: 'ti-user-check',
    iconBg: '#E6F1FB',
    iconColor: '#185FA5',
    subsections: [
      {
        id: 't5s1',
        name: '5.1.2 Users',
        controls: [
          { id: '5.1.2.1', title: 'Ensure Security Defaults is disabled on Azure Active Directory', type: 'auto', profile: 'E3 L1', status: 'warn', value: 'Security Defaults is enabled — may conflict with custom Conditional Access policies.', desc: 'Security Defaults should be disabled when managing CA policies manually.', ps: `(Get-MgPolicyIdentitySecurityDefaultEnforcementPolicy).IsEnabled` },
          { id: '5.1.2.2', title: 'Ensure that only organisationally managed/approved public groups exist', type: 'auto', profile: 'E3 L1', status: 'pass', value: 'No unmanaged public groups found.', desc: 'Public groups expose membership to all users and should be governed.', ps: `Get-MgGroup -Filter "visibility eq 'Public'" | Measure-Object` },
          { id: '5.1.2.3', title: 'Ensure sign-in frequency is enabled and browser sessions are not persistent for administrative users', type: 'auto', profile: 'E3 L1', status: 'pass', value: 'Admin sign-in frequency: 1 hour. Persistent browser: Disabled.', desc: 'Limiting admin session lifetime reduces risk from unattended privileged sessions.', ps: `Get-MgIdentityConditionalAccessPolicy | Where {$_.DisplayName -like '*Admin*Session*'}` },
          { id: '5.1.2.4', title: "Ensure the 'Password Hash Sync' feature is enabled for hybrid environments", type: 'auto', profile: 'E3 L1', status: 'warn', value: 'Hybrid detected — Password Hash Sync status could not be verified via Graph API.', desc: 'PHS enables cloud-based password protection and leaked credential detection.', ps: `# Check via Azure AD Connect health dashboard` },
          { id: '5.1.2.5', title: 'Ensure that password protection is enabled for on-premises Active Directory', type: 'manual', profile: 'E3 L1', status: 'pass', value: null, desc: 'Entra ID Password Protection enforces banned password list on-premises.', ps: null },
          { id: '5.1.2.6', title: 'Ensure multi-factor authentication is enabled for all users', type: 'auto', profile: 'E3 L1', status: 'pass', value: 'MFA enforced via Conditional Access for all users: Policy active.', desc: 'Ensuring all users are enrolled in MFA prevents account compromise.', ps: `Get-MgUser -All | Where {$_.StrongAuthenticationRequirements.Count -eq 0}` },
        ],
      },
      {
        id: 't5s2',
        name: '5.1.3 Groups',
        controls: [
          { id: '5.1.3.1', title: 'Ensure that users cannot create security groups', type: 'manual', profile: 'E3 L1', status: 'pass', value: null, desc: 'Restricting security group creation prevents group sprawl and unauthorized access control.', ps: null },
          { id: '5.1.3.2', title: 'Ensure the ability to access groups in My Groups is restricted', type: 'auto', profile: 'E3 L1', status: 'warn', value: 'Group.Unified setting: Requires portal verification.', desc: 'Restricting group visibility prevents discovery of unintended groups.', ps: `(Get-MgDirectorySetting | Where {$_.DisplayName -eq 'Group.Unified'}).Values` },
          { id: '5.1.3.3', title: 'Ensure that group owners can manage group membership requests', type: 'auto', profile: 'E3 L1', status: 'pass', value: 'Group ownership delegation: Enabled.', desc: 'Delegating group management to owners reduces admin burden while maintaining control.', ps: `(Get-MgDirectorySetting | Where {$_.DisplayName -eq 'Group.Unified'}).Values` },
          { id: '5.1.3.4', title: 'Ensure that users cannot create Microsoft 365 groups', type: 'manual', profile: 'E3 L1', status: 'pass', value: null, desc: 'Restricting M365 group creation prevents uncontrolled group sprawl.', ps: null },
        ],
      },
      {
        id: 't5s3',
        name: '5.1.4 Devices',
        controls: [
          { id: '5.1.4.1', title: 'Ensure the ability to join devices to Entra ID is restricted', type: 'auto', profile: 'E3 L1', status: 'pass', value: 'Device join restrictions: Configured.', desc: 'Restricting device join prevents unauthorized device registration to the tenant.', ps: `Get-MgDeviceManagementDeviceEnrollmentConfiguration` },
          { id: '5.1.4.2', title: 'Ensure the maximum devices per user is limited', type: 'auto', profile: 'E3 L1', status: 'pass', value: 'Max devices per user: Limited to 5 devices.', desc: 'Limiting per-user device registration prevents device sprawl and orphaned registrations.', ps: `Get-MgDeviceManagementDeviceEnrollmentConfiguration` },
          { id: '5.1.4.3', title: 'Ensure that the Global Administrator role is not granted as a local admin during Entra join', type: 'auto', profile: 'E3 L1', status: 'pass', value: 'Local admin assignment: Global Admin disabled.', desc: 'Preventing Global Admins as local admins limits device-level privilege escalation.', ps: `Get-MgDeviceManagementDeviceConfiguration | Where {$_.DisplayName -like '*Admin*'}` },
          { id: '5.1.4.4', title: 'Ensure that the number of users with a local administrator assignment is limited during Entra join', type: 'auto', profile: 'E3 L1', status: 'pass', value: 'Local admin users: 0 (none assigned).', desc: 'Limiting local admins reduces risk of device-level privilege escalation.', ps: `Get-MgDeviceManagementDeviceConfiguration | Where {$_.DisplayName -like '*Admin*'}` },
          { id: '5.1.4.5', title: 'Ensure that Local Administrator Password Solution (LAPS) is enabled', type: 'auto', profile: 'E3 L1', status: 'pass', value: 'LAPS: Enabled.', desc: 'LAPS manages local admin passwords automatically, preventing credential reuse across devices.', ps: `Get-MgDeviceManagementDeviceConfiguration | Where {$_.DisplayName -like '*LAPS*'}` },
          { id: '5.1.4.6', title: 'Ensure users are restricted from recovering BitLocker keys', type: 'auto', profile: 'E3 L1', status: 'pass', value: 'BitLocker key recovery: Restricted to admins only.', desc: 'Restricting BitLocker recovery prevents users from bypassing encryption protections.', ps: `Get-MgDeviceManagementDeviceConfiguration | Where {$_.DisplayName -like '*BitLocker*'}` },
        ],
      },
      {
        id: 't5s4',
        name: '5.1.5 Enterprise Apps',
        controls: [
          { id: '5.1.5.1', title: 'Ensure that users cannot consent to apps accessing company data on their behalf', type: 'auto', profile: 'E3 L1', status: 'pass', value: 'User consent: Disabled.', desc: 'Preventing user consent stops OAuth phishing attacks via malicious app permissions.', ps: `(Get-MgPolicyAuthorizationPolicy).DefaultUserRolePermissions.PermissionGrantPoliciesAssigned` },
          { id: '5.1.5.2', title: 'Ensure the admin consent workflow is enabled for applications', type: 'auto', profile: 'E3 L1', status: 'pass', value: 'Admin consent workflow: Enabled.', desc: 'Admin consent workflow provides oversight of application permission grants.', ps: `Get-MgPolicyAdminConsentRequestPolicy | Select IsEnabled` },
          { id: '5.1.5.3', title: 'Ensure that password addition is blocked for applications', type: 'auto', profile: 'E3 L1', status: 'pass', value: 'Password credentials: 0 apps with passwords.', desc: 'Blocking password addition forces apps to use certificate-based authentication.', ps: `Get-MgApplication -All | Where {$_.PasswordCredentials.Count -gt 0} | Measure-Object` },
          { id: '5.1.5.4', title: "Ensure that an application's password maximum lifetime does not exceed 180 days", type: 'auto', profile: 'E3 L1', status: 'pass', value: 'Password max lifetime: 180 days (enforced).', desc: 'Limiting password lifetime reduces risk from compromised app credentials.', ps: `Get-MgApplication -All | Select PasswordCredentials | Where {$_.PasswordCredentials.EndDateTime}` },
          { id: '5.1.5.5', title: 'Ensure that new application passwords are system-generated only', type: 'auto', profile: 'E3 L1', status: 'pass', value: 'Password generation: System-generated enforced.', desc: 'System-generated passwords ensure strong entropy and prevent weak user-created credentials.', ps: `Get-MgApplication -All | Where {$_.PasswordCredentials.Count -gt 0}` },
          { id: '5.1.5.6', title: "Ensure that an application's maximum certificate lifetime does not exceed 180 days", type: 'auto', profile: 'E3 L1', status: 'pass', value: 'Certificate max lifetime: 180 days (enforced).', desc: 'Limiting certificate lifetime enforces regular key rotation and reduces compromise window.', ps: `Get-MgApplication -All | Select KeyCredentials | Where {$_.KeyCredentials.EndDateTime}` },
        ],
      },
      {
        id: 't5s5',
        name: '5.1.6 External Identities',
        controls: [
          { id: '5.1.6.1', title: "Ensure that 'Guest invite restrictions' are set to 'Only users assigned to specific admin roles can invite guest users'", type: 'auto', profile: 'E3 L1', status: 'pass', value: 'Guest invite restrictions: Admin and guest inviters only.', desc: 'Restricting guest invitations prevents uncontrolled external access.', ps: `(Get-MgPolicyAuthorizationPolicy).AllowInvitesFrom` },
          { id: '5.1.6.2', title: 'Ensure that guest users have limited access to Azure AD directory objects', type: 'auto', profile: 'E3 L1', status: 'pass', value: "Guest access level: Restricted (guests can't enumerate directory objects).", desc: 'Limiting guest directory access prevents reconnaissance by external users.', ps: `(Get-MgPolicyAuthorizationPolicy).GuestUserRoleId` },
          { id: '5.1.6.3', title: 'Ensure that external users cannot share files, folders, or sites they do not own', type: 'auto', profile: 'E3 L1', status: 'pass', value: 'SharePoint: External sharing restricted to existing guest users only.', desc: 'Preventing re-sharing by guests limits data leakage to unauthorised parties.', ps: `Get-SPOTenant | Select ExternalUserExpirationRequired,RequireAcceptingAccountMatchInvitedAccount` },
        ],
      },
      {
        id: 't5s6',
        name: '5.1.8 Hybrid Management',
        controls: [
          { id: '5.1.8.1', title: 'Ensure Azure AD cloud sync is properly configured for hybrid environments', type: 'manual', profile: 'E3 L1', status: 'pass', value: null, desc: 'Cloud sync ensures consistent identity management across on-premises and cloud.', ps: null },
        ],
      },
      {
        id: 't5s7',
        name: '5.2.2 Conditional Access',
        controls: [
          { id: '5.2.2.1', title: 'Ensure Conditional Access policies enforce MFA for all users', type: 'auto', profile: 'E3 L1', status: 'pass', value: 'CA policy "Require MFA — All Users" is enabled.', desc: 'MFA for all users is the most impactful single security control available.', ps: `Get-MgIdentityConditionalAccessPolicy | Where {$_.DisplayName -like '*MFA*All*'} | Select DisplayName,State` },
          { id: '5.2.2.2', title: 'Ensure Conditional Access policies enforce MFA for all administrators', type: 'auto', profile: 'E3 L1', status: 'pass', value: 'CA policy "Require MFA — Admins" is enabled targeting all admin roles.', desc: 'Admin accounts are high-value targets and require mandatory MFA enforcement.', ps: `Get-MgIdentityConditionalAccessPolicy | Where {$_.DisplayName -like '*Admin*MFA*'} | Select DisplayName,State` },
          { id: '5.2.2.3', title: 'Ensure Conditional Access policies enforce MFA for Azure management', type: 'auto', profile: 'E3 L1', status: 'pass', value: 'CA policy "Require MFA — Azure Management" is active.', desc: 'Azure management MFA prevents attackers from making infrastructure changes.', ps: `Get-MgIdentityConditionalAccessPolicy | Where {$_.DisplayName -like '*Azure*'} | Select DisplayName,State` },
          { id: '5.2.2.4', title: 'Ensure Conditional Access policies block access from unknown or anonymous IP addresses', type: 'auto', profile: 'E3 L1', status: 'pass', value: 'Named locations defined. Anonymous IP policy active in block mode.', desc: 'Blocking anonymous IP access prevents attacks from Tor and proxy networks.', ps: `Get-MgIdentityConditionalAccessPolicy | Where {$_.DisplayName -like '*Anonymous*'} | Select DisplayName,State` },
          { id: '5.2.2.5', title: 'Ensure Conditional Access policies enforce a approved device compliance requirement', type: 'auto', profile: 'E3 L1', status: 'fail', value: 'Device compliance CA policy excludes 12 users (>10% of users). Policy incomplete.', desc: 'Requiring compliant devices ensures corporate access only from managed endpoints.', ps: `Get-MgIdentityConditionalAccessPolicy | Where {$_.DisplayName -like '*Device*Compliant*'} | Select DisplayName,State,Conditions` },
          { id: '5.2.2.6', title: 'Ensure Conditional Access policy blocks access for high sign-in risk', type: 'auto', profile: 'E5 L1', status: 'pass', value: 'Risk-based CA policy: High risk sign-ins blocked.', desc: 'Risk-based CA leverages Microsoft threat intelligence to block suspicious sign-ins.', ps: `Get-MgIdentityConditionalAccessPolicy | Where {$_.Conditions.SignInRiskLevels -contains 'high'} | Select DisplayName,State` },
          { id: '5.2.2.7', title: 'Ensure Conditional Access policy blocks access for high user risk', type: 'auto', profile: 'E5 L1', status: 'pass', value: 'User risk policy: High risk users required to change password.', desc: 'User risk policies force password reset for compromised account detection.', ps: `Get-MgIdentityConditionalAccessPolicy | Where {$_.Conditions.UserRiskLevels -contains 'high'} | Select DisplayName,State` },
          { id: '5.2.2.8', title: 'Ensure Conditional Access policy restricts access to legacy authentication', type: 'auto', profile: 'E3 L1', status: 'pass', value: 'Legacy auth block policy: Enabled.', desc: 'Legacy authentication protocols do not support MFA and must be blocked.', ps: `Get-MgIdentityConditionalAccessPolicy | Where {$_.Conditions.ClientAppTypes -contains 'exchangeActiveSync'} | Select DisplayName,State` },
          { id: '5.2.2.9', title: 'Ensure that Conditional Access policies enforce MFA for device registration', type: 'auto', profile: 'E3 L1', status: 'pass', value: 'MFA required for device registration: Policy active.', desc: 'MFA for device registration prevents attacker-controlled device enrolment.', ps: `Get-MgIdentityConditionalAccessPolicy | Where {$_.DisplayName -like '*Register Device*'} | Select DisplayName,State` },
          { id: '5.2.2.10', title: 'Ensure that Conditional Access requires phishing-resistant MFA for admins', type: 'auto', profile: 'E5 L1', status: 'pass', value: 'Phishing-resistant MFA (FIDO2 / Certificate) required for admin roles.', desc: 'Phishing-resistant MFA prevents real-time phishing bypass of standard MFA.', ps: `Get-MgIdentityConditionalAccessPolicy | Where {$_.DisplayName -like '*FIDO*Admin*'} | Select DisplayName,State` },
          { id: '5.2.2.11', title: 'Ensure that Conditional Access enforces Token Protection', type: 'auto', profile: 'E5 L2', status: 'pass', value: 'Token Protection policy: Active (preview).', desc: 'Token Protection binds access tokens to specific devices to prevent token theft.', ps: `Get-MgIdentityConditionalAccessPolicy | Where {$_.SessionControls.SignInFrequency.AuthenticationType -eq 'primaryAndSecondaryAuthentication'}` },
          { id: '5.2.2.12', title: 'Ensure that Conditional Access enforces Continuous Access Evaluation', type: 'auto', profile: 'E5 L1', status: 'pass', value: 'CAE: Enabled for all supported applications.', desc: 'CAE enables near real-time enforcement of access policy changes and revocations.', ps: `Get-MgIdentityConditionalAccessPolicy | Where {$_.SessionControls.ContinuousAccessEvaluation -ne $null}` },
          { id: '5.2.2.13', title: 'Ensure that Conditional Access Application Enforcement is enabled', type: 'auto', profile: 'E3 L1', status: 'pass', value: 'App-enforced restrictions: Active for Exchange and SharePoint.', desc: 'App-enforced restrictions apply policy directly within supported applications.', ps: `Get-MgIdentityConditionalAccessPolicy | Where {$_.SessionControls.ApplicationEnforcedRestrictions.IsEnabled -eq $true}` },
          { id: '5.2.2.14', title: 'Ensure that Conditional Access blocks access to unsupported device platforms', type: 'auto', profile: 'E3 L1', status: 'pass', value: 'Unknown device platforms: Blocked.', desc: 'Blocking unsupported platforms prevents access from unmanaged or unknown devices.', ps: `Get-MgIdentityConditionalAccessPolicy | Where {$_.Conditions.Platforms.ExcludePlatforms -contains 'unknownFutureValue'}` },
          { id: '5.2.2.15', title: 'Ensure that Conditional Access policies enforce Global Secure Access', type: 'auto', profile: 'E5 L1', status: 'pass', value: 'Global Secure Access traffic forwarding: Active.', desc: 'Global Secure Access extends Zero Trust network access to all corporate resources.', ps: `# Verify in Entra ID → Global Secure Access → Dashboard` },
          { id: '5.2.2.16', title: 'Ensure Conditional Access policy enforces MFA for all Microsoft Graph API calls', type: 'auto', profile: 'E5 L2', status: 'pass', value: 'Graph API MFA enforcement: CA policy active.', desc: 'Requiring MFA for Graph access prevents programmatic data access by compromised accounts.', ps: `Get-MgIdentityConditionalAccessPolicy | Where {$_.DisplayName -like '*Graph*MFA*'}` },
          { id: '5.2.2.17', title: 'Ensure named locations are defined', type: 'auto', profile: 'E3 L1', status: 'pass', value: '3 named locations configured: UK Office (IP), US Office (IP), Trusted WiFi (IP).', desc: 'Named locations enable risk-based policies distinguishing trusted from untrusted networks.', ps: `Get-MgIdentityConditionalAccessNamedLocation | Select DisplayName,OdataType` },
        ],
      },
      {
        id: 't5s8',
        name: '5.2.3 Authentication Methods',
        controls: [
          { id: '5.2.3.1', title: 'Ensure the Authentication Methods policy enables passwordless sign-in', type: 'auto', profile: 'E3 L1', status: 'pass', value: 'Microsoft Authenticator: Enabled. Passwordless phone sign-in: Enabled.', desc: 'Passwordless authentication eliminates password theft risk entirely.', ps: `Get-MgPolicyAuthenticationMethodPolicyAuthenticationMethodConfiguration -AuthenticationMethodConfigurationId MicrosoftAuthenticator` },
          { id: '5.2.3.2', title: 'Ensure that SSPR policy is configured to require at least two authentication methods', type: 'auto', profile: 'E3 L1', status: 'pass', value: 'SSPR: Requires 2 methods. Allowed: Authenticator app + backup email.', desc: 'Two-method SSPR requirement prevents account takeover via single-factor password reset.', ps: `Get-MgPolicySelfServiceSignUpPolicy | Select NumberOfMethodsRequired` },
          { id: '5.2.3.3', title: 'Ensure the Authentication Methods Policy is configured to disable SMS and Voice', type: 'auto', profile: 'E3 L1', status: 'pass', value: 'SMS MFA: Disabled in auth methods policy.', desc: 'SMS-based MFA is vulnerable to SIM-swapping and should be replaced by stronger methods.', ps: `Get-MgPolicyAuthenticationMethodPolicyAuthenticationMethodConfiguration -AuthenticationMethodConfigurationId Sms` },
          { id: '5.2.3.4', title: 'Ensure that FIDO2 security key authentication is enabled', type: 'auto', profile: 'E5 L1', status: 'warn', value: 'FIDO2: Enabled but restricted to IT group only (not all users).', desc: 'FIDO2 hardware keys provide the strongest phishing-resistant authentication.', ps: `Get-MgPolicyAuthenticationMethodPolicyAuthenticationMethodConfiguration -AuthenticationMethodConfigurationId Fido2` },
          { id: '5.2.3.5', title: 'Ensure that certificate-based authentication is configured', type: 'auto', profile: 'E5 L1', status: 'pass', value: 'CBA: Enabled. PKI trust configured.', desc: 'Certificate-based authentication provides strong, phishing-resistant authentication.', ps: `Get-MgPolicyAuthenticationMethodPolicyAuthenticationMethodConfiguration -AuthenticationMethodConfigurationId X509Certificate` },
          { id: '5.2.3.6', title: 'Ensure that Microsoft Authenticator is configured to show context for MFA requests', type: 'auto', profile: 'E3 L1', status: 'pass', value: 'Number matching: Enabled. Location context: Enabled. App name: Enabled.', desc: 'MFA context helps users identify and reject suspicious push notifications (MFA fatigue).', ps: `(Get-MgPolicyAuthenticationMethodPolicyAuthenticationMethodConfiguration -AuthenticationMethodConfigurationId MicrosoftAuthenticator).AdditionalProperties` },
          { id: '5.2.3.7', title: 'Ensure TAP (Temporary Access Pass) is enabled for onboarding', type: 'auto', profile: 'E3 L1', status: 'pass', value: 'Temporary Access Pass: Enabled for admins only.', desc: 'TAP enables secure onboarding of passwordless credentials for new users.', ps: `Get-MgPolicyAuthenticationMethodPolicyAuthenticationMethodConfiguration -AuthenticationMethodConfigurationId TemporaryAccessPass` },
          { id: '5.2.3.8', title: 'Ensure authentication strength is configured for privileged admin MFA', type: 'auto', profile: 'E5 L1', status: 'pass', value: 'Custom auth strength "Privileged Admin MFA" active: requires FIDO2 or CBA.', desc: 'Authentication strengths enforce specific method requirements for privileged roles.', ps: `Get-MgPolicyAuthenticationStrengthPolicy | Select DisplayName,AllowedCombinations` },
          { id: '5.2.3.9', title: 'Ensure that report-suspicious activity is enabled', type: 'auto', profile: 'E3 L1', status: 'pass', value: 'Report suspicious activity (MFA fraud): Enabled.', desc: 'Fraud reporting enables users to flag unexpected MFA requests for investigation.', ps: `Get-MgPolicyAuthenticationMethodPolicyAuthenticationMethodConfiguration -AuthenticationMethodConfigurationId Voice` },
          { id: '5.2.3.10', title: 'Ensure the number of methods required to reset a password is set to 2', type: 'auto', profile: 'E3 L1', status: 'pass', value: 'SSPR: 2 authentication methods required to reset password.', desc: 'Requiring two methods for SSPR prevents single-point password reset compromise.', ps: `(Get-MgPolicySelfServiceSignUpPolicy).NumberOfMethodsRequired` },
        ],
      },
      {
        id: 't5s9',
        name: '5.2.4 Password Reset',
        controls: [
          { id: '5.2.4.1', title: 'Ensure Self-Service Password Reset Activity report is reviewed weekly', type: 'manual', profile: 'E3 L1', status: 'pass', value: null, desc: 'Regular SSPR activity review detects unusual reset patterns indicating account compromise.', ps: null },
          { id: '5.2.4.2', title: 'Ensure custom banned passwords list is configured', type: 'auto', profile: 'E3 L1', status: 'pass', value: 'Custom banned passwords: 47 entries. Smart lockout: Enabled.', desc: 'Custom banned passwords prevent use of known-weak or company-specific weak passwords.', ps: `# Verify in Entra ID → Authentication Methods → Password protection` },
          { id: '5.2.4.3', title: 'Ensure password protection is enabled for on-premises AD', type: 'auto', profile: 'E3 L1', status: 'pass', value: 'Entra ID Password Protection: Active (Enforce mode) on DCs.', desc: 'On-premises password protection extends cloud banned password list to AD.', ps: `# Check DC Agent installer status in Entra ID → Password protection` },
          { id: '5.2.4.4', title: 'Ensure lockout threshold is set to 10 or fewer invalid sign-in attempts', type: 'auto', profile: 'E3 L1', status: 'pass', value: 'Smart lockout threshold: 10 attempts. Lockout duration: 60 seconds.', desc: 'Lockout policy prevents brute-force attacks against user accounts.', ps: `# Check in Entra ID → Authentication Methods → Password protection` },
          { id: '5.2.4.5', title: 'Ensure that the password reset notification is set to notify both users and admins', type: 'auto', profile: 'E3 L1', status: 'pass', value: 'SSPR notifications: User notified on reset. Admins notified when admin account reset.', desc: 'Password reset notifications alert users to suspicious account changes.', ps: `Get-MgPolicySelfServiceSignUpPolicy | Select NotifyOnAdminPasswordReset,NotifyUsersOnPasswordReset` },
        ],
      },
      {
        id: 't5s10',
        name: '5.3 Identity Governance',
        controls: [
          { id: '5.3.1', title: 'Ensure Entitlement Management access packages are configured', type: 'manual', profile: 'E5 L1', status: 'pass', value: null, desc: 'Access packages streamline access request and lifecycle management.', ps: null },
          { id: '5.3.2', title: 'Ensure access reviews are configured for privileged roles', type: 'auto', profile: 'E5 L1', status: 'pass', value: 'Access reviews: Quarterly for all directory roles. Last review: 45 days ago.', desc: 'Regular access reviews ensure privileged access remains appropriate over time.', ps: `Get-MgIdentityGovernanceAccessReviewDefinition | Select DisplayName,Status` },
          { id: '5.3.3', title: 'Ensure lifecycle workflows are configured for joiner/mover/leaver processes', type: 'manual', profile: 'E5 L1', status: 'pass', value: null, desc: 'Lifecycle workflows automate identity management for HR-driven events.', ps: null },
          { id: '5.3.4', title: 'Ensure PIM access reviews are configured for eligible role assignments', type: 'auto', profile: 'E5 L1', status: 'pass', value: 'PIM access reviews: Active for Global Admin, Security Admin, Exchange Admin.', desc: 'PIM access reviews prevent stale eligible role assignments from persisting.', ps: `Get-MgIdentityGovernancePrivilegedAccessGroupAssignmentApproval | Select Id,Status` },
          { id: '5.3.5', title: 'Ensure that PIM activation approval is required for critical roles', type: 'auto', profile: 'E5 L1', status: 'pass', value: 'PIM approval: Required for Global Admin and Security Admin activation.', desc: 'Requiring approval for PIM activation adds a human verification step for critical access.', ps: `# Check in Entra ID → PIM → Settings for each role` },
        ],
      },
    ],
  },

  // ============================================================
  // Topic 6 — Exchange Admin Center
  // ============================================================
  {
    id: 't6',
    num: '6',
    name: 'Exchange Admin Center',
    icon: 'ti-mail',
    iconBg: '#FAEEDA',
    iconColor: '#854F0B',
    subsections: [
      {
        id: 't6s1',
        name: '6.1 Audit',
        controls: [
          { id: '6.1.1', title: "Ensure 'AuditDisabled' organizationally is set to 'False'", type: 'auto', profile: 'E3 L1', status: 'pass', value: 'Organization audit: Enabled (AuditDisabled = False).', desc: 'Organization-wide audit logging ensures all Exchange activities are recorded.', ps: `Get-OrganizationConfig | Select AuditDisabled` },
          { id: '6.1.2', title: 'Ensure mailbox audit actions are configured', type: 'auto', profile: 'E3 L1', status: 'pass', value: 'Mailbox audit actions: Configured for all user mailboxes.', desc: 'Mailbox auditing records specific user actions for forensic review.', ps: `Get-Mailbox -ResultSize Unlimited | Where {$_.AuditEnabled -eq $false} | Measure-Object` },
          { id: '6.1.3', title: "Ensure 'AuditBypassEnabled' is not enabled on mailboxes", type: 'auto', profile: 'E3 L1', status: 'pass', value: 'Mailbox audit bypass: Disabled for all mailboxes.', desc: 'Disabling audit bypass prevents users from bypassing mailbox audit logging.', ps: `Get-Mailbox -ResultSize Unlimited | Where {$_.AuditBypassEnabled -eq $true} | Measure-Object` },
        ],
      },
      {
        id: 't6s2',
        name: '6.2 Mail Flow',
        controls: [
          { id: '6.2.1', title: 'Ensure all forms of mail forwarding are blocked and/or disabled', type: 'auto', profile: 'E3 L1', status: 'pass', value: 'Auto-forwarding to external domains: Blocked via transport rule.', desc: 'Blocking external mail forwarding prevents data exfiltration from compromised mailboxes.', ps: `Get-TransportRule | Where {$_.RedirectMessageTo -ne $null} | Select Name,State` },
          { id: '6.2.2', title: 'Ensure mail transport rules do not whitelist specific domains', type: 'auto', profile: 'E3 L1', status: 'pass', value: 'No transport rules bypassing spam filtering found.', desc: 'Domain whitelisting in transport rules can allow phishing emails to bypass protection.', ps: `Get-TransportRule | Where {$_.SetSCL -eq -1} | Select Name,Conditions` },
          { id: '6.2.3', title: 'Ensure email from external senders is identified', type: 'auto', profile: 'E3 L1', status: 'pass', value: 'External email identification: Enabled. Marks external senders.', desc: 'External sender identification helps users recognize potentially suspicious emails.', ps: `Get-ExternalInOutlook | Select Enabled` },
        ],
      },
      {
        id: 't6s3',
        name: '6.3 Roles',
        controls: [
          { id: '6.3.1', title: 'Ensure users installing Outlook add-ins is not allowed', type: 'auto', profile: 'E3 L1', status: 'pass', value: 'Outlook add-in installation: Restricted to admins only.', desc: 'Preventing user-installed add-ins reduces risk of malicious extensions compromising email.', ps: `Get-OwaMailboxPolicy | Select -ExpandProperty AddinList` },
          { id: '6.3.2', title: 'Ensure the ability to add personal email accounts and calendars is disabled', type: 'auto', profile: 'E3 L1', status: 'pass', value: 'Personal email accounts in Outlook: Disabled.', desc: 'Disabling personal email account integration prevents credential exposure and data leakage.', ps: `Get-OwaMailboxPolicy | Select PersonalAccountCalendarEnabled,ExternalIdentitiesManagedByExchange` },
        ],
      },
      {
        id: 't6s4',
        name: '6.5 Settings',
        controls: [
          { id: '6.5.1', title: 'Ensure modern authentication for Exchange Online is enabled', type: 'auto', profile: 'E3 L1', status: 'pass', value: 'Modern Authentication (OAuth): Enabled for Exchange Online.', desc: 'Modern auth is required for MFA to work with Exchange Online clients.', ps: `Get-OrganizationConfig | Select OAuth2ClientProfileEnabled` },
          { id: '6.5.2', title: 'Ensure MailTips are enabled for end users', type: 'auto', profile: 'E3 L1', status: 'pass', value: 'MailTips: Enabled. Shows warnings for large audiences and external recipients.', desc: 'MailTips provide visual warnings to reduce accidental email disclosure.', ps: `Get-OrganizationConfig | Select MailTipsAllTipsEnabled,MailTipsExternalRecipientsTipsEnabled` },
          { id: '6.5.3', title: 'Ensure additional storage providers are restricted in Outlook on the web', type: 'auto', profile: 'E3 L1', status: 'pass', value: 'Additional storage (e.g. Dropbox, Google Drive): Blocked in OWA.', desc: 'Restricting external storage prevents data exfiltration via consumer cloud services.', ps: `Get-OwaMailboxPolicy | Select AdditionalStorageProvidersAvailable` },
          { id: '6.5.4', title: 'Ensure SMTP AUTH is disabled', type: 'auto', profile: 'E3 L1', status: 'pass', value: 'SMTP AUTH: Disabled for organization.', desc: 'Disabling SMTP AUTH prevents attackers from using legacy SMTP connections for spam/phishing.', ps: `Get-TransportConfig | Select SmtpClientAuthenticationDisabled` },
          { id: '6.5.5', title: 'Ensure Direct Send submissions are rejected', type: 'auto', profile: 'E3 L1', status: 'pass', value: 'Direct Send: Rejected for non-authorized connectors.', desc: 'Rejecting Direct Send prevents unauthorized SMTP submissions to the organization.', ps: `Get-TransportConfig | Select ExternalDsnReportingAuthority` },
        ],
      },
    ],
  },

  // ============================================================
  // Topic 7 — SharePoint Admin Center
  // ============================================================
  {
    id: 't7',
    num: '7',
    name: 'SharePoint Admin Center',
    icon: 'ti-brand-sharepoint',
    iconBg: '#EAF3DE',
    iconColor: '#3B6D11',
    subsections: [
      {
        id: 't7s1',
        name: '7.2 Policies',
        controls: [
          { id: '7.2.1', title: 'Ensure modern authentication for SharePoint applications is required', type: 'auto', profile: 'E3 L1', status: 'pass', value: 'Modern authentication: Enforced for SharePoint.', desc: 'Modern auth is required for MFA to work with SharePoint Online clients.', ps: `Get-SPOTenant | Select AllowLegacyAuthProtocols` },
          { id: '7.2.2', title: 'Ensure SharePoint and OneDrive integration with Azure AD B2B is enabled', type: 'auto', profile: 'E3 L1', status: 'pass', value: 'SharePoint B2B integration: Enabled.', desc: 'B2B integration ensures external sharing uses Entra ID guest accounts for governance.', ps: `Get-SPOTenant | Select EnableAzureADB2BIntegration` },
          { id: '7.2.3', title: 'Ensure external content sharing is restricted', type: 'auto', profile: 'E3 L1', status: 'pass', value: 'External sharing: Restricted to existing guests only.', desc: 'Restricting external sharing prevents unauthorized access by external parties.', ps: `Get-SPOTenant | Select SharingCapability` },
          { id: '7.2.4', title: 'Ensure OneDrive content sharing is restricted', type: 'auto', profile: 'E3 L1', status: 'pass', value: 'OneDrive sharing: Existing guests only.', desc: 'OneDrive sharing restrictions prevent personal file shares from leaking corporate data.', ps: `Get-SPOTenant | Select OneDriveDefaultShareLinkRole` },
          { id: '7.2.5', title: "Ensure that SharePoint guest users cannot share items they don't own", type: 'auto', profile: 'E3 L1', status: 'pass', value: 'RequireAcceptingAccountMatchInvitedAccount: True', desc: 'Preventing guest re-sharing limits uncontrolled propagation of shared content.', ps: `Get-SPOTenant | Select RequireAcceptingAccountMatchInvitedAccount` },
          { id: '7.2.6', title: 'Ensure SharePoint external sharing is restricted', type: 'auto', profile: 'E3 L1', status: 'pass', value: 'External sharing: Not set to Anyone.', desc: 'Restricting external sharing prevents widespread external access.', ps: `Get-SPOTenant | Select SharingCapability` },
          { id: '7.2.7', title: 'Ensure link sharing is restricted in SharePoint and OneDrive', type: 'auto', profile: 'E3 L1', status: 'pass', value: 'Anonymous link sharing: Disabled or restricted.', desc: 'Restricting link sharing prevents anonymous external access.', ps: `Get-SPOTenant | Select DefaultShareLinkPermission,DefaultShareLinkType` },
          { id: '7.2.8', title: 'Ensure external sharing is restricted by security group', type: 'auto', profile: 'E3 L1', status: 'pass', value: 'External sharing: Governed by security groups.', desc: 'Restricting sharing via security groups ensures controlled external access.', ps: `Get-SPOTenant | Select RestrictedDomains` },
          { id: '7.2.9', title: 'Ensure guest access to a site or OneDrive will expire automatically', type: 'auto', profile: 'E3 L1', status: 'pass', value: 'Guest expiration: Enabled (default or configured).', desc: 'Automatic guest expiration removes stale external access over time.', ps: `Get-SPOTenant | Select ExternalUserExpirationRequired` },
          { id: '7.2.10', title: 'Ensure reauthentication with verification code is restricted', type: 'auto', profile: 'E3 L1', status: 'pass', value: 'Reauthentication: Restricted per policy.', desc: 'Verification code restrictions reduce risk from phishing and compromised credentials.', ps: `Get-SPOTenant | Select RequireAcceptingAccountMatchInvitedAccount` },
          { id: '7.2.11', title: 'Ensure the SharePoint default sharing link permission is set', type: 'auto', profile: 'E3 L1', status: 'pass', value: 'Default link permission: Edit or View (restricted).', desc: 'Setting default permissions ensures appropriate sharing scope by default.', ps: `Get-SPOTenant | Select DefaultShareLinkPermission` },
        ],
      },
      {
        id: 't7s2',
        name: '7.3 Settings',
        controls: [
          { id: '7.3.1', title: 'Ensure Office 365 SharePoint infected files are disallowed for download', type: 'auto', profile: 'E3 L1', status: 'pass', value: 'Infected file download: Blocked.', desc: 'Blocking download of infected files prevents malware distribution to endpoints.', ps: `Get-SPOTenant | Select DisallowInfectedFileDownload` },
        ],
      },
    ],
  },

  // ============================================================
  // Topic 8 — Microsoft Teams Admin Center
  // ============================================================
  {
    id: 't8',
    num: '8',
    name: 'Microsoft Teams Admin Center',
    icon: 'ti-brand-teams',
    iconBg: '#EEEDFE',
    iconColor: '#3C3489',
    subsections: [
      {
        id: 't8s1',
        name: '8.1 Teams',
        controls: [
          { id: '8.1.1', title: 'Ensure external file sharing in Teams is enabled for only approved cloud storage services', type: 'auto', profile: 'E3 L1', status: 'pass', value: 'Approved storage: Restricted to authorized cloud services only.', desc: 'Restricting file sharing to approved storage prevents unauthorized data upload.', ps: `Get-CsTeamsClientConfiguration | Select -ExpandProperty CloudStorageProviders` },
          { id: '8.1.2', title: "Ensure users can't send emails to a channel email address", type: 'auto', profile: 'E3 L1', status: 'pass', value: 'Channel email: Disabled for external senders.', desc: 'Blocking email to channel addresses prevents external infiltration.', ps: `Get-CsTeamsClientConfiguration | Select AllowEmailIntoChannel` },
        ],
      },
      {
        id: 't8s2',
        name: '8.2 Users',
        controls: [
          { id: '8.2.1', title: 'Ensure external domains are restricted in the Teams admin center', type: 'auto', profile: 'E3 L1', status: 'pass', value: 'External domains: Restricted to approved list only.', desc: 'Domain restrictions prevent communication with unknown organizations.', ps: `Get-CsTenantFederationConfiguration | Select AllowFederatedUsers,BlockedDomains` },
          { id: '8.2.2', title: 'Ensure communication with unmanaged Teams users is disabled', type: 'auto', profile: 'E3 L1', status: 'pass', value: 'Unmanaged Teams users: Communication disabled.', desc: 'Blocking unmanaged Teams users prevents uncontrolled external access.', ps: `Get-CsTenantFederationConfiguration | Select AllowTeamsConsumer` },
          { id: '8.2.3', title: 'Ensure external Teams users cannot initiate conversations', type: 'auto', profile: 'E3 L1', status: 'pass', value: 'External initiation: Disabled.', desc: 'Preventing external users from initiating contact reduces social engineering risk.', ps: `Get-CsTenantFederationConfiguration | Select AllowTeamsConsumerInbound` },
          { id: '8.2.4', title: 'Ensure the organization cannot communicate with accounts in trial Teams tenants', type: 'auto', profile: 'E3 L1', status: 'pass', value: 'Trial tenant communication: Blocked.', desc: 'Blocking trial tenant access prevents unverified external communication.', ps: `Get-CsTenantFederationConfiguration | Select BlockedDomains` },
        ],
      },
      {
        id: 't8s3',
        name: '8.4 Teams Apps',
        controls: [
          { id: '8.4.1', title: 'Ensure app permission policies are configured', type: 'manual', profile: 'E3 L1', status: 'pass', value: null, desc: 'App permission policies control what data third-party apps can access.', ps: null },
        ],
      },
      {
        id: 't8s4',
        name: '8.5 Meetings',
        controls: [
          { id: '8.5.1', title: "Ensure anonymous users can't join a meeting", type: 'auto', profile: 'E3 L1', status: 'pass', value: 'Anonymous join: Disabled.', desc: 'Blocking anonymous users prevents uninvited parties from attending meetings.', ps: `Get-CsTeamsMeetingPolicy -Identity Global | Select AllowAnonymousUsersToJoinMeeting` },
          { id: '8.5.2', title: "Ensure anonymous users and dial-in callers can't start a meeting", type: 'auto', profile: 'E3 L1', status: 'pass', value: 'Anonymous/dial-in start: Disabled.', desc: 'Preventing anonymous/dial-in start ensures only approved users initiate meetings.', ps: `Get-CsTeamsMeetingPolicy -Identity Global | Select AllowAnonymousUsersToStartMeeting,AllowPstnDialInUnavailableTranscribing` },
          { id: '8.5.3', title: 'Ensure only people in my org can bypass the lobby', type: 'auto', profile: 'E3 L1', status: 'pass', value: 'Lobby bypass: Org users only.', desc: 'The meeting lobby provides essential control over participant access.', ps: `Get-CsTeamsMeetingPolicy -Identity Global | Select AutoAdmitUsers` },
          { id: '8.5.4', title: "Ensure users dialing in can't bypass the lobby", type: 'auto', profile: 'E3 L1', status: 'pass', value: 'Dial-in bypass: Disabled.', desc: 'Dial-in users must wait in lobby for organizer approval.', ps: `Get-CsTeamsMeetingPolicy -Identity Global | Select AllowPstnDialInUnavailableTranscribing` },
          { id: '8.5.5', title: 'Ensure meeting chat does not allow anonymous users', type: 'auto', profile: 'E3 L1', status: 'pass', value: 'Anonymous chat: Disabled.', desc: 'Blocking anonymous chat prevents uninvited contributions to meeting discussions.', ps: `Get-CsTeamsMeetingPolicy -Identity Global | Select MeetingChatEnabledType` },
          { id: '8.5.6', title: 'Ensure only organizers and co-organizers can present', type: 'auto', profile: 'E3 L1', status: 'pass', value: 'Presenter role: Organizer/co-organizer only.', desc: 'Restricting presenters limits meeting control to authorized users.', ps: `Get-CsTeamsMeetingPolicy -Identity Global | Select AllowUserToBePresenter` },
          { id: '8.5.7', title: "Ensure external participants can't give or request control", type: 'auto', profile: 'E3 L1', status: 'pass', value: 'External control: Disabled.', desc: 'Preventing external screen control reduces social engineering risk.', ps: `Get-CsTeamsMeetingPolicy -Identity Global | Select AllowExternalParticipantGiveRequestControl` },
          { id: '8.5.8', title: 'Ensure external meeting chat is off', type: 'auto', profile: 'E3 L1', status: 'pass', value: 'External chat: Disabled.', desc: 'Disabling external chat prevents unmonitored external communications during meetings.', ps: `Get-CsTeamsMeetingPolicy -Identity Global | Select MeetingChatEnabledType` },
          { id: '8.5.9', title: 'Ensure meeting recording is off by default', type: 'auto', profile: 'E3 L1', status: 'pass', value: 'Recording default: Disabled.', desc: 'Default-off recording requires explicit opt-in for participant privacy.', ps: `Get-CsTeamsMeetingPolicy -Identity Global | Select AllowCloudRecording` },
        ],
      },
      {
        id: 't8s5',
        name: '8.6 Messaging',
        controls: [
          { id: '8.6.1', title: 'Ensure users can report security concerns in Teams', type: 'auto', profile: 'E3 L1', status: 'pass', value: 'Security reporting: Enabled.', desc: 'Enabling security reporting empowers users to flag suspicious content.', ps: `Get-CsTeamsClientConfiguration | Select AllowSecurityReportingOption` },
        ],
      },
    ],
  },

  // ============================================================
  // Topic 9 — Microsoft Fabric Analytics
  // ============================================================
  {
    id: 't9',
    num: '9',
    name: 'Microsoft Fabric Analytics Security',
    icon: 'ti-chart-area',
    iconBg: '#E0F5F4',
    iconColor: '#0D6B68',
    subsections: [
      {
        id: 't9s1',
        name: '9.1 Fabric Analytics Security',
        controls: [
          { id: '9.1.1', title: 'Ensure guest user access is restricted', type: 'auto', profile: 'E3 L1', status: 'pass', value: 'Guest access: Restricted via security groups.', desc: 'Restricts guest user access to Fabric content to reduce unauthorized data exposure.', ps: `Get-PowerBIWorkspace -Scope Organization | Where {$_.IsOnDedicatedCapacity -eq $true} | Select Name,Users` },
          { id: '9.1.2', title: 'Ensure external user invitations are restricted', type: 'auto', profile: 'E3 L1', status: 'pass', value: 'External invitations: Disabled for guest users.', desc: 'Prevents external users from inviting additional guests to Fabric content.', ps: `Get-PowerBITenantSettingStatus -SettingName 'AllowExternalDataShareOfDatasetAndReports'` },
          { id: '9.1.3', title: 'Ensure guest access to content is restricted', type: 'auto', profile: 'E3 L1', status: 'pass', value: 'Guest content access: Limited workspace access only.', desc: 'Guests can only access explicitly shared Fabric workspaces and content.', ps: `Get-PowerBITenantSettingStatus -SettingName 'GuestUserAccessToWorkspace'` },
          { id: '9.1.4', title: 'Ensure \'Publish to web\' is restricted', type: 'auto', profile: 'E3 L1', status: 'pass', value: 'Publish to web: Disabled.', desc: 'Prevents creation of public anonymous links to Fabric content.', ps: `Get-PowerBITenantSettingStatus -SettingName 'PublishToWeb'` },
          { id: '9.1.5', title: 'Ensure \'Interact with and share R and Python\' visuals is \'Disabled\'', type: 'auto', profile: 'E3 L2', status: 'pass', value: 'R/Python visuals: Disabled.', desc: 'Disables R and Python visuals which can execute arbitrary code.', ps: `Get-PowerBITenantSettingStatus -SettingName 'RVisualEnabled'` },
          { id: '9.1.6', title: 'Ensure \'Allow users to apply sensitivity labels for content\' is \'Enabled\'', type: 'auto', profile: 'E3 L1', status: 'pass', value: 'Sensitivity labels: Enabled for content.', desc: 'Users can classify Fabric content with sensitivity labels for data protection.', ps: `Get-PowerBITenantSettingStatus -SettingName 'EnableDataClassification'` },
          { id: '9.1.7', title: 'Ensure shareable links are restricted', type: 'auto', profile: 'E3 L1', status: 'pass', value: 'Shareable links: Restricted to organization only.', desc: 'Limits shareable links to prevent external access to Fabric content.', ps: `Get-PowerBITenantSettingStatus -SettingName 'ShareContent'` },
          { id: '9.1.8', title: 'Ensure enabling of external data sharing is restricted', type: 'auto', profile: 'E3 L1', status: 'pass', value: 'External data sharing: Disabled.', desc: 'Prevents Fabric datasets and reports from being shared externally.', ps: `Get-PowerBITenantSettingStatus -SettingName 'AllowExternalDataShareOfDatasetAndReports'` },
          { id: '9.1.9', title: 'Ensure \'Block ResourceKey Authentication\' is \'Enabled\'', type: 'auto', profile: 'E3 L1', status: 'pass', value: 'ResourceKey authentication: Blocked.', desc: 'Blocks legacy ResourceKey authentication to Fabric APIs.', ps: `Get-PowerBITenantSettingStatus -SettingName 'BlockResourceKeyAuthentication'` },
          { id: '9.1.10', title: 'Ensure access to APIs by service principals is restricted', type: 'auto', profile: 'E3 L1', status: 'pass', value: 'Service principal API access: Restricted.', desc: 'Limits service principal access to Fabric APIs to approved accounts only.', ps: `Get-PowerBITenantSettingStatus -SettingName 'ServicePrincipalAccessTenantSetting'` },
          { id: '9.1.11', title: 'Ensure service principals cannot create and use profiles', type: 'auto', profile: 'E3 L1', status: 'pass', value: 'Service principal profiles: Disabled.', desc: 'Prevents service principals from creating and using Fabric profiles.', ps: `Get-PowerBITenantSettingStatus -SettingName 'ServicePrincipalCanCreateProfile'` },
          { id: '9.1.12', title: 'Ensure service principals ability to create workspaces, connections and deployment pipelines is restricted', type: 'auto', profile: 'E3 L1', status: 'pass', value: 'Service principal workspace creation: Disabled.', desc: 'Restricts service principals from creating Fabric workspaces and deployment pipelines.', ps: `Get-PowerBITenantSettingStatus -SettingName 'ServicePrincipalCanCreate'` },
        ],
      },
    ],
  },
]
