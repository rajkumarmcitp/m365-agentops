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
          { id: '1.2.1', title: 'Ensure Microsoft 365 Groups creation is restricted to admins', type: 'auto', profile: 'E3 L1', status: 'warn', value: 'Group creation: All users can create Microsoft 365 groups.', desc: 'Limits group sprawl by restricting M365 group creation to administrators.', ps: `(Get-MgDirectorySetting | Where {$_.DisplayName -eq 'Group.Unified'}).Values` },
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
  // Topic 2 — Microsoft Defender
  // ============================================================
  {
    id: 't2',
    num: '2',
    name: 'Microsoft Defender',
    icon: 'ti-shield-check',
    iconBg: '#FCEBEB',
    iconColor: '#A32D2D',
    subsections: [
      {
        id: 't2s1',
        name: '2.1 Email & Collaboration',
        controls: [
          { id: '2.1.1', title: 'Ensure Exchange Online Spam Policies are set correctly', type: 'auto', profile: 'E3 L1', status: 'pass', value: 'Default spam policy: HighConfidenceSpam = MoveToJmf, Spam = MoveToJmf.', desc: 'Correct spam policy settings reduce phishing and junk mail exposure.', ps: `Get-HostedContentFilterPolicy -Identity Default | Select SpamAction,HighConfidenceSpamAction` },
          { id: '2.1.2', title: 'Ensure Safe Links policy is enabled', type: 'auto', profile: 'E3 L1', status: 'pass', value: 'Safe Links: Enabled for all users. URL detonation enabled.', desc: 'Safe Links protects users from malicious URLs in email and Office documents.', ps: `Get-SafeLinksPolicy | Select Name,IsEnabled,ScanUrls,EnableForInternalSenders` },
          { id: '2.1.3', title: 'Ensure Safe Attachments policy is enabled', type: 'auto', profile: 'E3 L1', status: 'fail', value: 'Safe Attachments: No policy assigned to all users. Default policy only in report mode.', desc: 'Safe Attachments detonates email attachments in a sandbox to detect malware.', ps: `Get-SafeAttachmentPolicy | Select Name,Action,Enable,Redirect` },
          { id: '2.1.4', title: 'Ensure the anti-phishing policy is enabled', type: 'auto', profile: 'E3 L1', status: 'pass', value: 'Anti-phishing policy: Enabled with impersonation protection.', desc: 'Anti-phishing policy protects against spoofing and impersonation attacks.', ps: `Get-AntiPhishPolicy | Select Name,Enabled,EnableSpoofIntelligence,EnableMailboxIntelligence` },
          { id: '2.1.5', title: 'Ensure that SPF records are published for all Exchange Domains', type: 'auto', profile: 'E3 L1', status: 'pass', value: 'contoso.com: SPF record present — v=spf1 include:spf.protection.outlook.com -all', desc: 'SPF records help prevent email spoofing by specifying authorized mail senders.', ps: `Resolve-DnsName contoso.com -Type TXT | Where {$_.Strings -like "*spf*"}` },
          { id: '2.1.6', title: 'Ensure DKIM is enabled for all Exchange Online Domains', type: 'auto', profile: 'E3 L1', status: 'pass', value: 'DKIM signing: Enabled for contoso.com', desc: 'DKIM signing adds cryptographic authentication to outbound email.', ps: `Get-DkimSigningConfig | Select Domain,Enabled` },
          { id: '2.1.7', title: 'Ensure DMARC Records for all Exchange Online Domains are published', type: 'auto', profile: 'E3 L1', status: 'pass', value: 'contoso.com: DMARC record — v=DMARC1; p=quarantine; rua=mailto:dmarc@contoso.com', desc: 'DMARC policy instructs receivers on how to handle emails failing SPF/DKIM checks.', ps: `Resolve-DnsName _dmarc.contoso.com -Type TXT` },
          { id: '2.1.8', title: 'Ensure Priority account protection is enabled and configured', type: 'manual', profile: 'E3 L1', status: 'pass', value: null, desc: 'Priority account protection provides enhanced threat protection for high-value users.', ps: null },
          { id: '2.1.9', title: 'Ensure that Microsoft Defender for Office 365 is enabled', type: 'auto', profile: 'E5 L1', status: 'pass', value: 'Microsoft Defender for Office 365 Plan 2: Active', desc: 'Defender for Office 365 provides advanced threat protection for email and collaboration.', ps: `Get-MgSubscribedSku | Where {$_.SkuPartNumber -like '*ATP*'}` },
          { id: '2.1.10', title: 'Ensure Exchange Online Content Filtering is set to block malicious email', type: 'auto', profile: 'E3 L1', status: 'pass', value: 'Content filter: BulkThreshold=5, QuarantineTag=AdminOnlyAccessPolicy', desc: 'Proper content filtering prevents bulk and malicious mail from reaching inboxes.', ps: `Get-HostedContentFilterPolicy | Select BulkThreshold,QuarantineTag` },
          { id: '2.1.11', title: 'Ensure the connection filter policy is configured', type: 'auto', profile: 'E3 L1', status: 'pass', value: 'Connection filter: SafeList=False, IPAllowList empty.', desc: 'Proper connection filter configuration prevents bypass of Exchange Online Protection.', ps: `Get-HostedConnectionFilterPolicy -Identity Default | Select SafeList,IPAllowList` },
          { id: '2.1.12', title: 'Ensure tenant allow/block list is not configured for exceptions', type: 'auto', profile: 'E3 L1', status: 'pass', value: 'Allow list entries: 0. Block list entries: 3 (known malicious domains).', desc: 'Excessive allow list entries bypass security controls and increase phishing risk.', ps: `Get-TenantAllowBlockListItems -ListType Sender -Allow | Measure-Object` },
          { id: '2.1.13', title: 'Ensure alerts for suspicious email activity are configured', type: 'auto', profile: 'E3 L1', status: 'pass', value: 'Alert policy "Suspicious email sending patterns" is active.', desc: 'Email activity alerts enable rapid detection of compromised accounts.', ps: `Get-ProtectionAlert | Where {$_.Category -eq 'ThreatManagement'} | Select Name,Severity,IsEnabled` },
          { id: '2.1.14', title: 'Ensure the Report Message add-in is enabled', type: 'manual', profile: 'E3 L1', status: 'pass', value: null, desc: 'Report Message add-in allows users to report suspicious emails directly to Microsoft.', ps: null },
          { id: '2.1.15', title: 'Ensure mail forwarding rules are not forwarding to external domains', type: 'auto', profile: 'E3 L1', status: 'pass', value: 'External mail forwarding: Disabled at transport rule level.', desc: 'Blocking external auto-forwarding prevents data exfiltration via compromised mailboxes.', ps: `Get-RemoteDomain Default | Select AutoForwardEnabled` },
        ],
      },
      {
        id: 't2s2',
        name: '2.2 Cloud Apps',
        controls: [
          { id: '2.2.1', title: 'Ensure Microsoft Defender for Cloud Apps is enabled', type: 'auto', profile: 'E5 L1', status: 'warn', value: 'Defender for Cloud Apps: Licensed but not fully configured — 3 connectors pending.', desc: 'Defender for Cloud Apps provides CASB capabilities for cloud app governance.', ps: `# Check via Defender for Cloud Apps portal — no PowerShell equivalent` },
        ],
      },
      {
        id: 't2s4',
        name: '2.4 System',
        controls: [
          { id: '2.4.1', title: 'Ensure Microsoft Defender for Endpoint is deployed to all endpoints', type: 'auto', profile: 'E5 L1', status: 'pass', value: 'MDE onboarded: 847 / 847 devices (100%)', desc: 'Defender for Endpoint provides endpoint detection and response capabilities.', ps: `# Review onboarding status in Defender portal: security.microsoft.com/machines` },
          { id: '2.4.2', title: 'Ensure Microsoft Defender for Identity is enabled', type: 'auto', profile: 'E5 L1', status: 'pass', value: 'Defender for Identity workspace: Active. 2 domain controllers instrumented.', desc: 'Defender for Identity detects lateral movement and privilege escalation in AD.', ps: `# Check workspace status in Defender XDR portal` },
          { id: '2.4.3', title: 'Ensure Microsoft Defender XDR alert notifications are configured', type: 'auto', profile: 'E5 L1', status: 'warn', value: 'Notification rules: 1 configured (High severity only). Medium severity alerts not notified.', desc: 'Alert notifications ensure security teams are informed of critical incidents.', ps: `# Configure in Microsoft Defender XDR Settings → Email notifications` },
          { id: '2.4.4', title: 'Ensure Attack Simulation Training is enabled', type: 'auto', profile: 'E5 L1', status: 'pass', value: 'Attack Simulation: Active. Last campaign: 30 days ago. Click-through rate: 8%.', desc: 'Attack simulation training measures and improves user phishing resilience.', ps: `# Review campaigns at security.microsoft.com/attacksimulator` },
          { id: '2.4.5', title: 'Ensure Secure Score recommended actions are reviewed', type: 'manual', profile: 'E3 L1', status: 'fail', value: null, desc: 'Regular review of Secure Score actions ensures continuous security improvement.', ps: null },
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
          { id: '5.1.3.1', title: 'Ensure that group owners can manage group membership requests in the Access Panel', type: 'auto', profile: 'E3 L1', status: 'pass', value: 'Self-service group management: Enabled for group owners.', desc: 'Delegating group management to owners reduces admin burden while maintaining control.', ps: `(Get-MgDirectorySetting | Where {$_.DisplayName -eq 'Group.Unified'}).Values` },
          { id: '5.1.3.2', title: 'Ensure that Microsoft 365 group creation is restricted to administrators', type: 'auto', profile: 'E3 L1', status: 'warn', value: 'M365 group creation: Allowed for all users.', desc: 'Restricting group creation prevents uncontrolled group sprawl.', ps: `(Get-MgDirectorySetting | Where {$_.DisplayName -eq 'Group.Unified'}).Values | Where {$_.Name -eq 'EnableGroupCreation'}` },
          { id: '5.1.3.3', title: 'Ensure that users can create security groups', type: 'auto', profile: 'E3 L1', status: 'warn', value: 'Security group creation: Allowed for all users.', desc: 'Non-admin security group creation can lead to unmanaged group proliferation.', ps: `(Get-MgPolicyAuthorizationPolicy).DefaultUserRolePermissions.AllowedToCreateSecurityGroups` },
          { id: '5.1.3.4', title: 'Ensure expiration policies are set for Office 365 groups', type: 'auto', profile: 'E3 L1', status: 'pass', value: 'Group expiration policy: 180 days. Notifications to owners enabled.', desc: 'Expiration policies remove stale groups and reduce security exposure.', ps: `Get-MgGroupLifecyclePolicy | Select GroupLifetimeInDays,AlternateNotificationEmails` },
        ],
      },
      {
        id: 't5s3',
        name: '5.1.4 Devices',
        controls: [
          { id: '5.1.4.1', title: 'Ensure that devices are joined to or registered with Azure Active Directory', type: 'auto', profile: 'E3 L1', status: 'pass', value: 'Device registration: 832 / 847 devices (98.2%) Entra-registered.', desc: 'Device registration enables device-based Conditional Access policies.', ps: `Get-MgDevice -All | Group-Object TrustType | Select Name,Count` },
          { id: '5.1.4.2', title: 'Ensure users can register apps', type: 'auto', profile: 'E3 L1', status: 'pass', value: 'User app registration: Disabled (admin only).', desc: 'Restricting app registration prevents unauthorised app creation in Entra ID.', ps: `(Get-MgPolicyAuthorizationPolicy).DefaultUserRolePermissions.AllowedToCreateApps` },
          { id: '5.1.4.3', title: 'Ensure that the device inactivity limit is set to 15 minutes or fewer', type: 'auto', profile: 'E3 L1', status: 'pass', value: 'Device inactivity timeout: 15 minutes.', desc: 'Screen timeout protects devices left unattended in shared environments.', ps: `# Configured via Intune device configuration profile` },
          { id: '5.1.4.4', title: 'Ensure that BitLocker is enabled on Windows devices', type: 'auto', profile: 'E3 L1', status: 'pass', value: 'BitLocker compliance: 98% of Windows devices encrypted.', desc: 'BitLocker encryption protects data at rest on Windows endpoints.', ps: `Get-MgDeviceManagementManagedDevice -Filter "operatingSystem eq 'Windows'" -All | Where {$_.IsEncrypted -eq $false}` },
          { id: '5.1.4.5', title: 'Ensure Intune is used for device management', type: 'auto', profile: 'E3 L1', status: 'pass', value: 'Intune MDM authority: Active. Enrolled devices: 847.', desc: 'Intune provides unified endpoint management and compliance enforcement.', ps: `Get-MgDeviceManagementManagedDevice -All | Measure-Object` },
          { id: '5.1.4.6', title: 'Ensure that a diagnostic data sharing policy exists', type: 'manual', profile: 'E3 L2', status: 'pass', value: null, desc: 'Diagnostic data policies ensure compliance with data residency requirements.', ps: null },
        ],
      },
      {
        id: 't5s4',
        name: '5.1.5 Enterprise Apps',
        controls: [
          { id: '5.1.5.1', title: "Ensure the option 'Users can consent to apps accessing company data on their behalf' is set to 'Do not allow user consent'", type: 'auto', profile: 'E3 L1', status: 'pass', value: 'User consent for company data: Do not allow user consent.', desc: 'Preventing user consent stops OAuth phishing attacks via malicious app permissions.', ps: `(Get-MgPolicyAuthorizationPolicy).DefaultUserRolePermissions.PermissionGrantPoliciesAssigned` },
          { id: '5.1.5.2', title: 'Ensure that password hashes are not synced to Entra ID for cloud-only accounts', type: 'auto', profile: 'E3 L1', status: 'pass', value: 'Cloud-only accounts: No password hash sync configured.', desc: 'Cloud-only accounts should not have PHS enabled as it is unnecessary.', ps: `# Verify via Azure AD Connect configuration` },
          { id: '5.1.5.3', title: 'Ensure that only admin users have access to create service principals', type: 'auto', profile: 'E3 L1', status: 'pass', value: 'Service principal creation: Restricted to admins only.', desc: 'Restricting service principal creation prevents abuse of application identities.', ps: `(Get-MgPolicyAuthorizationPolicy).DefaultUserRolePermissions.AllowedToCreateApps` },
          { id: '5.1.5.4', title: 'Ensure the admin consent workflow is enabled for applications', type: 'auto', profile: 'E3 L1', status: 'pass', value: 'Admin consent workflow: Enabled.', desc: 'Admin consent workflow provides oversight of application permission grants.', ps: `Get-MgPolicyAdminConsentRequestPolicy | Select IsEnabled` },
          { id: '5.1.5.5', title: 'Ensure that all service principals have certificate-based authentication', type: 'auto', profile: 'E5 L1', status: 'pass', value: 'Service principals with password credentials: 2 (legacy, being migrated).', desc: 'Certificate auth is more secure than client secrets for service principals.', ps: `Get-MgApplication -All | Where {$_.PasswordCredentials.Count -gt 0} | Select DisplayName` },
          { id: '5.1.5.6', title: 'Ensure that app registrations have an owner', type: 'auto', profile: 'E3 L1', status: 'pass', value: 'App registrations without owner: 0', desc: 'App registration owners ensure accountability and lifecycle management.', ps: `Get-MgApplication -All | ForEach {Get-MgApplicationOwner -ApplicationId $_.Id} | Where {$_ -eq $null}` },
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
          { id: '6.1.1', title: 'Ensure Microsoft Exchange Online audit logging is enabled', type: 'auto', profile: 'E3 L1', status: 'pass', value: 'Mailbox audit logging: Enabled by default for all users.', desc: 'Exchange audit logging records mailbox access and admin actions for forensic review.', ps: `Get-OrganizationConfig | Select AuditDisabled` },
          { id: '6.1.2', title: 'Ensure mailbox auditing for E3 users is enabled', type: 'auto', profile: 'E3 L1', status: 'pass', value: 'AuditBypassEnabled: False for all mailboxes.', desc: 'Per-mailbox audit settings ensure all mailbox activity is captured.', ps: `Get-Mailbox -ResultSize Unlimited | Where {$_.AuditEnabled -eq $false} | Measure-Object` },
          { id: '6.1.3', title: 'Ensure the Exchange administrator audit log is enabled', type: 'auto', profile: 'E3 L1', status: 'pass', value: 'Admin audit log: Enabled. Log age limit: 90 days.', desc: 'Admin audit logs capture all Exchange administrative changes.', ps: `Get-AdminAuditLogConfig | Select AdminAuditLogEnabled,AdminAuditLogAgeLimit` },
        ],
      },
      {
        id: 't6s2',
        name: '6.2 Mail Flow',
        controls: [
          { id: '6.2.1', title: 'Ensure all forms of mail forwarding are blocked and/or disabled', type: 'auto', profile: 'E3 L1', status: 'pass', value: 'Auto-forwarding to external domains: Blocked via transport rule.', desc: 'Blocking external mail forwarding prevents data exfiltration from compromised mailboxes.', ps: `Get-TransportRule | Where {$_.RedirectMessageTo -ne $null} | Select Name,State` },
          { id: '6.2.2', title: 'Ensure mail transport rules do not whitelist specific domains', type: 'auto', profile: 'E3 L1', status: 'pass', value: 'No transport rules bypassing spam filtering found.', desc: 'Domain whitelisting in transport rules can allow phishing emails to bypass protection.', ps: `Get-TransportRule | Where {$_.SetSCL -eq -1} | Select Name,Conditions` },
          { id: '6.2.3', title: 'Ensure email from external senders is tagged', type: 'auto', profile: 'E3 L1', status: 'pass', value: 'External email tagging: Enabled. Prepends "[EXTERNAL]" to subject.', desc: 'External sender tagging helps users identify potentially suspicious emails.', ps: `Get-ExternalInOutlook | Select Enabled` },
        ],
      },
      {
        id: 't6s3',
        name: '6.3 Roles',
        controls: [
          { id: '6.3.1', title: 'Ensure the Exchange admin role is limited to an appropriate number of users', type: 'auto', profile: 'E3 L1', status: 'pass', value: 'Exchange Admins: 2 accounts.', desc: 'Minimizing Exchange Admin accounts reduces the attack surface for email infrastructure.', ps: `Get-RoleGroupMember "Organization Management" | Select Name,RecipientType` },
          { id: '6.3.2', title: 'Ensure Exchange role assignments are reviewed regularly', type: 'manual', profile: 'E3 L1', status: 'pass', value: null, desc: 'Regular role reviews ensure Exchange admin assignments remain appropriate.', ps: null },
        ],
      },
      {
        id: 't6s4',
        name: '6.5 Settings',
        controls: [
          { id: '6.5.1', title: 'Ensure modern authentication for Exchange Online is enabled', type: 'auto', profile: 'E3 L1', status: 'pass', value: 'Modern Authentication (OAuth): Enabled for Exchange Online.', desc: 'Modern auth is required for MFA to work with Exchange Online clients.', ps: `Get-OrganizationConfig | Select OAuth2ClientProfileEnabled` },
          { id: '6.5.2', title: 'Ensure MailTips are enabled for end users', type: 'auto', profile: 'E3 L1', status: 'pass', value: 'MailTips: Enabled. Shows warnings for large audiences and external recipients.', desc: 'MailTips provide visual warnings to reduce accidental email disclosure.', ps: `Get-OrganizationConfig | Select MailTipsAllTipsEnabled,MailTipsExternalRecipientsTipsEnabled` },
          { id: '6.5.3', title: 'Ensure access to Exchange admin center is limited by IP address', type: 'manual', profile: 'E3 L1', status: 'pass', value: null, desc: 'IP-restricted EAC access reduces the attack surface for Exchange administration.', ps: null },
          { id: '6.5.4', title: 'Ensure that mobile devices require complex passwords', type: 'auto', profile: 'E3 L1', status: 'pass', value: 'Mobile device policy: Requires PIN length ≥ 6, alphanumeric.', desc: 'Complex mobile PINs protect against brute-force attacks on lost devices.', ps: `Get-MobileDeviceMailboxPolicy | Select Name,PasswordEnabled,MinPasswordLength,AlphanumericPasswordRequired` },
          { id: '6.5.5', title: 'Ensure that additional storage providers are restricted in Outlook on the web', type: 'auto', profile: 'E3 L1', status: 'pass', value: 'Additional storage (e.g. Dropbox, Google Drive): Blocked in OWA.', desc: 'Restricting external storage prevents data exfiltration via consumer cloud services.', ps: `Get-OwaMailboxPolicy | Select AdditionalStorageProvidersAvailable` },
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
          { id: '7.2.1', title: 'Ensure SharePoint Online external sharing is managed', type: 'auto', profile: 'E3 L1', status: 'pass', value: 'Tenant-level external sharing: New and existing guests only (not Anyone links).', desc: 'External sharing controls prevent unauthorised data access by external parties.', ps: `Get-SPOTenant | Select SharingCapability` },
          { id: '7.2.2', title: 'Ensure OneDrive content sharing is restricted', type: 'auto', profile: 'E3 L1', status: 'pass', value: 'OneDrive sharing: Existing guests only.', desc: 'OneDrive sharing restrictions prevent personal file shares from leaking corporate data.', ps: `Get-SPOTenant | Select OneDriveDefaultShareLinkRole` },
          { id: '7.2.3', title: 'Ensure SharePoint access requests are limited to site owners', type: 'auto', profile: 'E3 L1', status: 'pass', value: 'Access request notifications: Sent to site owners only.', desc: 'Directing access requests to owners ensures appropriate approvals.', ps: `# Review per-site setting via SPO admin center` },
          { id: '7.2.4', title: 'Ensure guest access to sites is reviewed regularly', type: 'manual', profile: 'E3 L1', status: 'pass', value: null, desc: 'Regular guest access reviews ensure external access remains appropriate.', ps: null },
          { id: '7.2.5', title: "Ensure that SharePoint guest users cannot share items they don't own", type: 'auto', profile: 'E3 L1', status: 'pass', value: 'RequireAcceptingAccountMatchInvitedAccount: True', desc: 'Preventing guest re-sharing limits uncontrolled propagation of shared content.', ps: `Get-SPOTenant | Select RequireAcceptingAccountMatchInvitedAccount` },
          { id: '7.2.6', title: 'Ensure SharePoint and OneDrive integration with Azure AD B2B is enabled', type: 'auto', profile: 'E3 L1', status: 'pass', value: 'SharePoint B2B integration: Enabled.', desc: 'B2B integration ensures external sharing uses Entra ID guest accounts for governance.', ps: `Get-SPOTenant | Select EnableAzureADB2BIntegration` },
          { id: '7.2.7', title: 'Ensure SharePoint access restriction for unmanaged devices is configured', type: 'auto', profile: 'E3 L1', status: 'pass', value: 'Unmanaged device access: Limited web access only (no sync/download).', desc: 'Restricting unmanaged device access prevents data sync to personal devices.', ps: `Get-SPOTenant | Select ConditionalAccessPolicy` },
          { id: '7.2.8', title: 'Ensure idle session timeout for SharePoint and OneDrive is set', type: 'auto', profile: 'E3 L1', status: 'pass', value: 'Browser session timeout: 8 hours.', desc: 'Session timeout protects SharePoint sessions left open on shared computers.', ps: `Get-SPOBrowserIdleSignOut | Select Enabled,SignOutAfter` },
          { id: '7.2.9', title: 'Ensure SharePoint Online information barriers mode is configured', type: 'manual', profile: 'E5 L1', status: 'pass', value: null, desc: 'Information barriers prevent specific users or groups from communicating.', ps: null },
          { id: '7.2.10', title: 'Ensure that SharePoint sends email notifications for sharing', type: 'auto', profile: 'E3 L1', status: 'pass', value: 'Sharing email notifications: Enabled.', desc: 'Sharing notifications alert users when their content is shared with others.', ps: `Get-SPOTenant | Select NotificationsInSharePointEnabled` },
          { id: '7.2.11', title: "Ensure SharePoint external sharing is configured to 'Existing guests only' or more restrictive", type: 'auto', profile: 'E3 L1', status: 'pass', value: 'Sharing capability: ExistingExternalUserSharingOnly', desc: 'Restricting to existing guests prevents new unauthenticated external sharing.', ps: `Get-SPOTenant | Select SharingCapability` },
        ],
      },
      {
        id: 't7s2',
        name: '7.3 Settings',
        controls: [
          { id: '7.3.1', title: 'Ensure custom script execution is restricted in SharePoint Online', type: 'auto', profile: 'E3 L1', status: 'pass', value: 'Custom scripts: DenyAndDisablePersonalSite + DenyCustomScriptUserSites.', desc: 'Blocking custom scripts prevents injection attacks and unauthorised functionality.', ps: `Get-SPOSite -Limit All | Where {$_.DenyAddAndCustomizePages -eq 0}` },
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
          { id: '8.1.1', title: 'Ensure external domains are restricted in Teams', type: 'auto', profile: 'E3 L1', status: 'pass', value: 'External access: Specific allowed domains only (3 trusted partner domains).', desc: 'Restricting external domains prevents communication with unknown organisations.', ps: `Get-CsTenantFederationConfiguration | Select AllowFederatedUsers,AllowedDomains` },
          { id: '8.1.2', title: 'Ensure Teams is restricted from automatically accepting incoming meeting requests', type: 'auto', profile: 'E3 L1', status: 'pass', value: 'Auto-accept meeting invitations: Disabled.', desc: 'Preventing auto-accept stops attendees from joining meetings without host presence.', ps: `Get-CsMeetingConfiguration | Select AutoAdmitUsers` },
        ],
      },
      {
        id: 't8s2',
        name: '8.2 Users & External Access',
        controls: [
          { id: '8.2.1', title: 'Ensure anonymous users cannot join Teams meetings', type: 'auto', profile: 'E3 L1', status: 'pass', value: 'Anonymous meeting join: Disabled.', desc: 'Blocking anonymous join prevents uninvited parties from accessing meetings.', ps: `Get-CsTeamsMeetingPolicy -Identity Global | Select AllowAnonymousUsersToJoinMeeting` },
          { id: '8.2.2', title: 'Ensure that users cannot bypass the lobby in Teams meetings', type: 'auto', profile: 'E3 L1', status: 'pass', value: 'Lobby bypass: Only organiser can bypass. All others enter lobby.', desc: 'The meeting lobby gives organisers control over who joins their meetings.', ps: `Get-CsTeamsMeetingPolicy -Identity Global | Select AutoAdmitUsers` },
          { id: '8.2.3', title: 'Ensure external participants cannot give or request control', type: 'auto', profile: 'E3 L1', status: 'pass', value: 'External control: AllowExternalParticipantGiveRequestControl = False.', desc: 'Preventing external screen control reduces risk of social engineering attacks.', ps: `Get-CsTeamsMeetingPolicy -Identity Global | Select AllowExternalParticipantGiveRequestControl` },
          { id: '8.2.4', title: 'Ensure Teams external chat is restricted', type: 'auto', profile: 'E3 L1', status: 'pass', value: 'External chat: Allowed with specific domains only.', desc: 'Restricting external chat prevents data leakage via uncontrolled external communications.', ps: `Get-CsTenantFederationConfiguration | Select AllowTeamsConsumer,AllowTeamsConsumerInbound` },
        ],
      },
      {
        id: 't8s3',
        name: '8.4 Teams Apps',
        controls: [
          { id: '8.4.1', title: 'Ensure users are not able to install Teams apps from the App Store', type: 'auto', profile: 'E3 L1', status: 'pass', value: 'Teams app policy: Allow org-approved apps only.', desc: 'Restricting app installs prevents unapproved or potentially malicious apps.', ps: `Get-CsTeamsAppPermissionPolicy | Select UserPinnedAppsSetting,DefaultCatalogApps` },
        ],
      },
      {
        id: 't8s4',
        name: '8.5 Meetings',
        controls: [
          { id: '8.5.1', title: 'Ensure that meeting recording is disabled for all non-essential users', type: 'auto', profile: 'E3 L1', status: 'pass', value: 'Meeting recording: Enabled for standard users. Stored in OneDrive.', desc: 'Meeting recording policies control sensitive conversation capture.', ps: `Get-CsTeamsMeetingPolicy -Identity Global | Select AllowCloudRecording` },
          { id: '8.5.2', title: 'Ensure external meeting recordings cannot be shared', type: 'auto', profile: 'E3 L1', status: 'pass', value: 'Recording sharing: Internal only.', desc: 'Preventing external sharing of recordings protects confidential meeting content.', ps: `Get-CsTeamsMeetingPolicy -Identity Global | Select AllowRecordingStorageOutsideRegion` },
          { id: '8.5.3', title: 'Ensure meeting chat does not allow anonymous users', type: 'auto', profile: 'E3 L1', status: 'pass', value: 'Meeting chat: Anonymous users cannot post.', desc: 'Blocking anonymous meeting chat prevents uninvited contributions.', ps: `Get-CsTeamsMeetingPolicy -Identity Global | Select MeetingChatEnabledType` },
          { id: '8.5.4', title: 'Ensure presenter roles are restricted in Teams meetings', type: 'auto', profile: 'E3 L1', status: 'pass', value: 'Presenter role: Organiser and co-organisers only.', desc: 'Restricting presenter roles limits who can share content or manage meeting controls.', ps: `Get-CsTeamsMeetingPolicy -Identity Global | Select AllowUserToBePresenter` },
          { id: '8.5.5', title: 'Ensure Teams meeting recordings do not expire', type: 'auto', profile: 'E3 L1', status: 'pass', value: 'Meeting recording expiry: Disabled (no auto-expiry).', desc: 'No-expiry recordings ensure evidence is available for compliance investigations.', ps: `Get-CsTeamsMeetingPolicy -Identity Global | Select NewMeetingRecordingExpirationDays` },
          { id: '8.5.6', title: 'Ensure NDI streaming is disabled', type: 'auto', profile: 'E3 L1', status: 'pass', value: 'NDI streaming: Disabled.', desc: 'NDI streaming can expose meeting content to local network capture.', ps: `Get-CsTeamsMeetingPolicy -Identity Global | Select AllowNDIStreaming` },
          { id: '8.5.7', title: 'Ensure watermarking is enabled for sensitive meetings', type: 'manual', profile: 'E5 L1', status: 'pass', value: null, desc: 'Watermarks on meeting content deter screenshot sharing of sensitive material.', ps: null },
          { id: '8.5.8', title: 'Ensure screen capture is restricted for sensitive meetings', type: 'auto', profile: 'E5 L1', status: 'pass', value: 'Sensitivity label-based screen capture restriction: Active.', desc: 'Screen capture restrictions protect sensitive meeting content from unauthorised capture.', ps: `Get-CsTeamsMeetingPolicy | Where {$_.AllowIPVideo -eq $false}` },
          { id: '8.5.9', title: 'Ensure meeting transcription is managed', type: 'auto', profile: 'E3 L1', status: 'pass', value: 'Transcription: Allowed for all users. Stored in SharePoint.', desc: 'Managing transcription ensures sensitive spoken content is appropriately protected.', ps: `Get-CsTeamsMeetingPolicy -Identity Global | Select AllowTranscription` },
        ],
      },
      {
        id: 't8s5',
        name: '8.6 Messaging',
        controls: [
          { id: '8.6.1', title: 'Ensure external Teams message sharing is restricted', type: 'auto', profile: 'E3 L1', status: 'pass', value: 'Teams consumer external chat: Blocked.', desc: 'Blocking consumer Teams chat prevents data leakage to personal accounts.', ps: `Get-CsTenantFederationConfiguration | Select AllowTeamsConsumer` },
        ],
      },
    ],
  },

  // ============================================================
  // Topic 9 — Microsoft Fabric
  // ============================================================
  {
    id: 't9',
    num: '9',
    name: 'Microsoft Fabric',
    icon: 'ti-chart-area',
    iconBg: '#E0F5F4',
    iconColor: '#0D6B68',
    subsections: [
      {
        id: 't9s1',
        name: '9.1 Tenant Settings',
        controls: [
          { id: '9.1.1', title: 'Ensure Publish to web is restricted', type: 'auto', profile: 'E3 L1', status: 'pass', value: 'Publish to web: Disabled tenant-wide.', desc: 'Publish to web creates public anonymous URLs and should be restricted.', ps: `# Check in Fabric admin portal: app.fabric.microsoft.com/admin-portal` },
          { id: '9.1.2', title: 'Ensure external data sharing is disabled', type: 'auto', profile: 'E3 L1', status: 'pass', value: 'External data sharing: Disabled.', desc: 'External data sharing controls prevent Fabric lakehouses from sharing data outside the tenant.', ps: `# Check in Fabric admin portal → Tenant settings → External data sharing` },
          { id: '9.1.3', title: 'Ensure Fabric guest user access is managed', type: 'auto', profile: 'E3 L1', status: 'pass', value: 'Guest access to Fabric: Limited to specific workspaces via security groups.', desc: 'Guest access governance prevents external users from accessing sensitive data assets.', ps: `# Review via Fabric admin portal → Users` },
          { id: '9.1.4', title: 'Ensure that guest users can browse and access Fabric content is disabled', type: 'auto', profile: 'E3 L1', status: 'pass', value: 'Guest browsing: Disabled.', desc: 'Preventing guests from browsing Fabric content limits exposure of data assets.', ps: `# Check Fabric admin portal → Tenant settings → Allow guest users to browse Fabric` },
          { id: '9.1.5', title: 'Ensure custom visuals are restricted in Fabric reports', type: 'auto', profile: 'E3 L1', status: 'pass', value: 'Custom visuals: AppSource and certified only.', desc: 'Restricting custom visuals reduces risk from malicious third-party Power BI visuals.', ps: `# Fabric admin portal → Tenant settings → Custom visuals` },
          { id: '9.1.6', title: 'Ensure that R and Python visuals are restricted', type: 'auto', profile: 'E3 L1', status: 'pass', value: 'R/Python visuals: Disabled.', desc: 'R and Python visuals can execute arbitrary code and should be restricted.', ps: `# Fabric admin portal → Tenant settings → R visual settings` },
          { id: '9.1.7', title: 'Ensure data export to Excel is governed', type: 'auto', profile: 'E3 L1', status: 'pass', value: 'Export to Excel: Allowed but audited.', desc: 'Governing Excel exports ensures sensitive data exports are tracked.', ps: `# Fabric admin portal → Export and sharing settings → Export to Excel` },
          { id: '9.1.8', title: 'Ensure that Fabric workspaces have sensitivity labels applied', type: 'manual', profile: 'E5 L1', status: 'pass', value: null, desc: 'Sensitivity labels on Fabric workspaces enforce data protection policies on reports.', ps: null },
          { id: '9.1.9', title: 'Ensure Fabric admin API audit logs are reviewed', type: 'manual', profile: 'E3 L1', status: 'pass', value: null, desc: 'Regular audit log review detects unauthorised Fabric administrative changes.', ps: null },
          { id: '9.1.10', title: 'Ensure service principals cannot use Fabric APIs', type: 'auto', profile: 'E3 L2', status: 'pass', value: 'Service principal API access: Disabled except for approved SPNs in allow group.', desc: 'Restricting SPN access to Fabric APIs prevents abuse by compromised service accounts.', ps: `# Fabric admin portal → Developer settings → Allow service principals to use Fabric APIs` },
          { id: '9.1.11', title: 'Ensure Fabric capacity admin roles are limited', type: 'auto', profile: 'E3 L1', status: 'pass', value: 'Fabric capacity admins: 2 accounts.', desc: 'Minimizing Fabric admins reduces the blast radius of a compromised admin account.', ps: `# Review in Fabric admin portal → Capacity settings → Admins` },
          { id: '9.1.12', title: 'Ensure Microsoft Purview integration with Fabric is enabled for data governance', type: 'auto', profile: 'E5 L1', status: 'pass', value: 'Purview integration: Active. Data lineage scanning enabled.', desc: 'Purview integration provides data cataloguing and compliance visibility for Fabric assets.', ps: `# Fabric admin portal → Tenant settings → Microsoft Purview integration` },
        ],
      },
    ],
  },
]
