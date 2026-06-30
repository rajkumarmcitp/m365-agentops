# Identity Pillar - Zero Trust Validation Controls
## Based on Microsoft Zero Trust Assessment Framework

This document outlines critical validation controls for the Identity Security pillar based on Microsoft's official Zero Trust Assessment tool.

---

## A. WORKLOAD IDENTITY & APPLICATION SECURITY

### 1. **Inactive Applications - Privileged Permissions**
- **ID:** IDENTITY-WI-001
- **Priority:** Critical
- **Risk Level:** High
- **Validation:** Inactive applications don't have highly privileged Microsoft Graph API permissions
- **Impact:** Prevents attackers from exploiting dormant apps with elevated access
- **Remediation:**
  - Review inactive applications in Entra ID
  - Remove high-risk Microsoft Graph permissions from unused apps
  - Delete service principals without legitimate use cases
  - [Graph API: Get-MgServicePrincipal](https://learn.microsoft.com/en-us/graph/api/serviceprincipal-get)
- **Auto-Remediation:** Possible - Remove Graph permissions from inactive apps

### 2. **Inactive Applications - Privileged Roles**
- **ID:** IDENTITY-WI-002
- **Priority:** Critical
- **Risk Level:** High
- **Validation:** Inactive applications don't have highly privileged built-in roles
- **Impact:** Prevents unauthorized access through dormant privileged applications
- **Remediation:**
  - Audit service principals with privileged role assignments
  - Remove privileged role assignments from inactive apps
  - Delete unused privileged service principals
  - [Azure AD: Remove-AzureADServiceAppRoleAssignment](https://learn.microsoft.com/en-us/powershell/module/azuread/remove-azureadserviceapproleassignment)
- **Auto-Remediation:** Possible - Remove privileged roles from inactive apps

### 3. **Application Credentials - Shared Secrets**
- **ID:** IDENTITY-WI-003
- **Priority:** Critical
- **Risk Level:** High
- **Validation:** Applications don't use shared secrets (client secrets) for authentication
- **Expected:** 0 applications using client secrets
- **Current:** Count of apps with active client secrets
- **Remediation:**
  - Migrate to managed identities for Azure resources
  - Use certificate-based authentication
  - Implement workload identity federation
  - Deploy Conditional Access policies for workload identities
  - [Learn: Migrate from secrets to managed identities](https://learn.microsoft.com/en-us/entra/identity/enterprise-apps/migrate-applications-from-secrets)
- **Auto-Remediation:** No - Requires app owner review

### 4. **Application Credentials - Long-lived Certificates**
- **ID:** IDENTITY-WI-004
- **Priority:** Critical
- **Risk Level:** High
- **Validation:** Applications don't use long-lived certificates (expiring >1 year from now)
- **Expected:** All certificates expire within 12 months
- **Current:** Count of certificates with >1 year validity
- **Remediation:**
  - Implement certificate lifecycle management
  - Define certificate-based application configuration
  - Configure trusted certificate authorities
  - Create least-privileged role for credential rotation
  - [Application Authentication Method Policy](https://learn.microsoft.com/en-us/graph/api/resources/applicationauthenticationmethodpolicy)
- **Auto-Remediation:** Possible - Alert on certificates expiring >12 months

### 5. **Microsoft Service Applications - Configured Credentials**
- **ID:** IDENTITY-WI-005
- **Priority:** Critical
- **Risk Level:** High
- **Validation:** Microsoft services applications don't have credentials configured
- **Expected:** 0 Microsoft service apps with credentials
- **Current:** Count of Microsoft apps with client secrets/certificates
- **Remediation:**
  - Investigate legitimacy of credentials on Microsoft service apps
  - Remove unnecessary credentials
  - Monitor for unauthorized credential additions
  - Alert on new credential additions to Microsoft service apps
- **Auto-Remediation:** No - Requires manual review

### 6. **Application Management Policies**
- **ID:** IDENTITY-WI-006
- **Priority:** High
- **Risk Level:** High
- **Validation:** Application management policies enforce secret/certificate standards
- **Expected:** Application authentication method policies configured
- **Current:** Application management policy status
- **Remediation:**
  - [Configure app management policies](https://learn.microsoft.com/en-us/entra/identity/enterprise-apps/tutorial-enforce-secret-standards)
  - Enforce maximum secret validity period (e.g., 6 months)
  - Require certificate-based auth for new apps
  - Implement automated secret rotation
- **Auto-Remediation:** Possible - Enable default app management policy

### 7. **User Consent Settings**
- **ID:** IDENTITY-WI-007
- **Priority:** High
- **Risk Level:** Medium
- **Validation:** User consent settings are restricted (don't allow all apps)
- **Expected:** Admin consent or restricted user consent enabled
- **Current:** User consent policy setting
- **Remediation:**
  - Set user consent to "Do not allow user consent" or "Allow user consent for low-risk apps"
  - Require admin consent for high-risk permissions
  - Monitor consent grant activities
  - [Manage user consent to applications](https://learn.microsoft.com/en-us/entra/identity/enterprise-apps/manage-consent-requests)
- **Auto-Remediation:** Possible - Restrict to admin consent only

### 8. **Multitenant App Instance Lock**
- **ID:** IDENTITY-WI-008
- **Priority:** High
- **Risk Level:** Medium
- **Validation:** App instance property lock is configured for all multitenant applications
- **Expected:** All multitenant apps have isDeviceOnlyAuthSupported = false
- **Current:** Count of multitenant apps without lock configured
- **Remediation:**
  - Configure app instance lock for multitenant apps
  - Prevent unauthorized tenant switching
  - [Application manifest: isDeviceOnlyAuthSupported](https://learn.microsoft.com/en-us/azure/active-directory/develop/reference-app-manifest)
- **Auto-Remediation:** Possible - Enable instance lock on multitenant apps

### 9. **ADAL Deprecation - Legacy Library Usage**
- **ID:** IDENTITY-WI-009
- **Priority:** High
- **Risk Level:** Medium
- **Validation:** No applications use ADAL (Azure AD Authentication Library - deprecated)
- **Expected:** 0 applications using ADAL
- **Current:** Count of apps using ADAL
- **Remediation:**
  - Migrate ADAL applications to MSAL (Microsoft Authentication Library)
  - Update app dependencies to latest authentication libraries
  - [ADAL Migration Guide](https://learn.microsoft.com/en-us/entra/identity-platform/msal-migration)
- **Auto-Remediation:** No - Requires app owner migration

---

## B. USER AUTHENTICATION & MFA

### 10. **Phishing-Resistant MFA - Privileged Users**
- **ID:** IDENTITY-UA-001
- **Priority:** Critical
- **Risk Level:** Critical
- **Validation:** Privileged users sign in with phishing-resistant methods
- **Expected:** 100% of privileged admins use passkeys/FIDO2
- **Current:** % of privileged users with phishing-resistant methods
- **Remediation:**
  - Deploy phishing-resistant passwordless authentication (Windows Hello, FIDO2)
  - Require passkeys or security keys for privileged accounts
  - Deploy Conditional Access policy for privileged roles
  - [Phishing-Resistant Passwordless Authentication](https://learn.microsoft.com/en-us/entra/identity/authentication/how-to-deploy-phishing-resistant-passwordless-authentication)
- **Auto-Remediation:** No - Requires user registration

### 11. **Phishing-Resistant Methods - Registered**
- **ID:** IDENTITY-UA-002
- **Priority:** Critical
- **Risk Level:** High
- **Validation:** Privileged accounts have phishing-resistant methods registered
- **Expected:** 100% of privileged accounts with passkey/FIDO2 registered
- **Current:** Count of privileged users without phishing-resistant methods
- **Remediation:**
  - Enforce registration of passkeys or FIDO2 security keys
  - Create dedicated security groups for privileged accounts
  - Monitor authentication method registration
  - Send reminders to complete registration
- **Auto-Remediation:** No - Requires user action

### 12. **Conditional Access - Admin MFA Strength**
- **ID:** IDENTITY-UA-003
- **Priority:** Critical
- **Risk Level:** High
- **Validation:** Privileged roles targeted with CA policy enforcing phishing-resistant MFA
- **Expected:** CA policy targeting Global Admins, Exchange Admins, SharePoint Admins, etc.
- **Current:** CA policy status and coverage
- **Remediation:**
  - [Create CA policy: Protect administrators](https://learn.microsoft.com/en-us/entra/identity/conditional-access/policy-admin-phish-resistant-mfa)
  - Target: Privileged roles group (or role-based targeting)
  - Grant: Require authentication strength (Phishing-Resistant MFA)
  - Exclude: Break-glass emergency access accounts
- **Auto-Remediation:** Possible - Deploy recommended admin MFA policy

### 13. **All Users - Phishing-Resistant MFA**
- **ID:** IDENTITY-UA-004
- **Priority:** Critical
- **Risk Level:** High
- **Validation:** All user sign-in activity uses phishing-resistant authentication
- **Expected:** MFA strength requirement for all users
- **Current:** % of users with phishing-resistant methods
- **Remediation:**
  - Deploy Conditional Access policy for all users requiring MFA strength
  - Gradually roll out passkey/FIDO2 registration
  - [CA policy: All users MFA strength](https://learn.microsoft.com/en-us/entra/identity/conditional-access/policy-all-users-mfa-strength)
  - Phase enforcement over 4-8 weeks
- **Auto-Remediation:** No - Requires user enablement

### 14. **Token Protection**
- **ID:** IDENTITY-UA-005
- **Priority:** High
- **Risk Level:** High
- **Validation:** User sign-in activity uses token protection (prevent token theft)
- **Expected:** Token protection policy configured and enforced
- **Current:** Token protection policy status
- **Remediation:**
  - Enable token protection for web sessions
  - Implement device-bound tokens for sensitive operations
  - Monitor for token replay attacks
  - [Token protection in Conditional Access](https://learn.microsoft.com/en-us/entra/identity/conditional-access/concept-token-protection)
- **Auto-Remediation:** Possible - Enable default token protection

### 15. **Universal MFA Enforcement**
- **ID:** IDENTITY-UA-006
- **Priority:** Critical
- **Risk Level:** High
- **Validation:** All user sign-in activity uses strong authentication (MFA)
- **Expected:** MFA enabled for 100% of users
- **Current:** % of users with MFA enabled
- **Remediation:**
  - Deploy MFA via Conditional Access policies
  - Use Microsoft Authenticator app or phishing-resistant methods
  - Configure fallback MFA methods
  - [Enable multifactor authentication](https://learn.microsoft.com/en-us/entra/identity/authentication/howto-mfa-getstarted)
- **Auto-Remediation:** No - Requires user configuration

### 16. **Authentication Methods Registered**
- **ID:** IDENTITY-UA-007
- **Priority:** High
- **Risk Level:** High
- **Validation:** Users have strong authentication methods configured
- **Expected:** >95% of users with MFA methods registered
- **Current:** % of users without MFA methods
- **Remediation:**
  - Enable user self-service registration
  - Create campaigns encouraging MFA setup
  - Monitor registration compliance
  - Send reminder notifications
- **Auto-Remediation:** No - Requires user action

### 17. **Microsoft Authenticator - Sign-in Context**
- **ID:** IDENTITY-UA-008
- **Priority:** Medium
- **Risk Level:** Medium
- **Validation:** Microsoft Authenticator app configured to show sign-in context
- **Expected:** Microsoft Authenticator sign-in context enabled
- **Current:** Authentication method policy status
- **Remediation:**
  - Enable number matching in Microsoft Authenticator
  - Configure approval request context display
  - [Microsoft Authenticator features](https://learn.microsoft.com/en-us/entra/identity/authentication/user-sign-in-aad-mfa-microsoft-authenticator-app)
- **Auto-Remediation:** Possible - Enable in auth method policy

### 18. **Legacy MFA Migration**
- **ID:** IDENTITY-UA-009
- **Priority:** High
- **Risk Level:** High
- **Validation:** Tenants have migrated from legacy MFA/SSPR policies
- **Expected:** Per-user MFA and SSPR disabled; CA policies configured
- **Current:** Count of users with per-user MFA enabled
- **Remediation:**
  - Disable per-user MFA settings
  - Disable legacy MFA requirements
  - Create equivalent Conditional Access policies
  - [Migrate to Conditional Access-based MFA](https://learn.microsoft.com/en-us/entra/identity/authentication/howto-mfa-getstarted#next-steps)
- **Auto-Remediation:** Possible - Migrate users to CA-based MFA

---

## C. ACCESS CONTROL & TENANT GOVERNANCE

### 19. **Tenant Creator Role - Restricted**
- **ID:** IDENTITY-AC-001
- **Priority:** High
- **Risk Level:** Medium
- **Validation:** Permissions to create new tenants limited to Tenant Creator role
- **Expected:** <5 users with tenant creation permissions
- **Current:** Count of users with tenant creation permissions
- **Remediation:**
  - Remove default tenant creation rights from users
  - Assign Tenant Creator role to specific admins only
  - Audit new tenant creation
  - [Tenant creation permissions](https://learn.microsoft.com/en-us/entra/fundamentals/how-subscriptions-associated-azure-ad)
- **Auto-Remediation:** Possible - Restrict tenant creation permissions

### 20. **Global Admin Usage**
- **ID:** IDENTITY-AC-002
- **Priority:** Critical
- **Risk Level:** High
- **Validation:** Global Administrators are used appropriately (not for daily tasks)
- **Expected:** <5 Global Admins; not used for routine operations
- **Current:** Count of Global Admins; sign-in frequency
- **Remediation:**
  - Reduce Global Admin count to absolute minimum
  - Use least-privileged roles for daily tasks
  - Create custom roles for specific functions
  - [Azure AD built-in roles](https://learn.microsoft.com/en-us/entra/identity/role-based-access-control/permissions-reference)
- **Auto-Remediation:** No - Requires manual role assignment review

### 21. **Tenant Creation Audit**
- **ID:** IDENTITY-AC-003
- **Priority:** High
- **Risk Level:** High
- **Validation:** Tenant creation events are investigated and documented
- **Expected:** <5 new tenants created per year; all reviewed
- **Current:** New tenant creation count; audit log review status
- **Remediation:**
  - Monitor tenant creation audit logs
  - Alert on new tenant creation
  - Document business justification for new tenants
  - Set Conditional Access policies on tenant admin access
- **Auto-Remediation:** No - Requires manual investigation

### 22. **Cross-Tenant Access - Outbound**
- **ID:** IDENTITY-AC-004
- **Priority:** High
- **Risk Level:** Medium
- **Validation:** Outbound cross-tenant access settings are configured
- **Expected:** Explicit allow/deny policy for cross-tenant access
- **Current:** Cross-tenant access policy status
- **Remediation:**
  - Configure cross-tenant access settings
  - Block all external tenants by default
  - Whitelist approved partner tenants
  - [Cross-tenant access](https://learn.microsoft.com/en-us/entra/external-identities/cross-tenant-access-overview)
- **Auto-Remediation:** Possible - Deploy default-deny policy

### 23. **Guest Invitation Restrictions**
- **ID:** IDENTITY-AC-005
- **Priority:** High
- **Risk Level:** Medium
- **Validation:** Guests can't invite other guests (prevent guest-to-guest invites)
- **Expected:** Guest invitation setting disabled
- **Current:** Guest invitation policy status
- **Remediation:**
  - Disable "Guests can invite guests" setting
  - Restrict guest invitation to admins/sponsors
  - [B2B external collaboration settings](https://learn.microsoft.com/en-us/entra/external-identities/delegate-invitations)
- **Auto-Remediation:** Possible - Disable guest-to-guest invitations

### 24. **Guest Access Restrictions**
- **ID:** IDENTITY-AC-006
- **Priority:** High
- **Risk Level:** Medium
- **Validation:** Guests have restricted access to directory objects
- **Expected:** Guest users limited to own profile and group members only
- **Current:** Guest access policy setting
- **Remediation:**
  - Set guest user access restriction to "Guest user access is restricted to properties and memberships of their own directory objects"
  - Monitor guest access to sensitive resources
  - [Guest user access restrictions](https://learn.microsoft.com/en-us/entra/external-identities/external-collaboration-settings-configure)
- **Auto-Remediation:** Possible - Enable restricted guest access

### 25. **Tenant Restrictions v2**
- **ID:** IDENTITY-AC-007
- **Priority:** High
- **Risk Level:** Medium
- **Validation:** Tenant restrictions v2 policy is configured to control external access
- **Expected:** Tenant restrictions policy deployed to key endpoints
- **Current:** Tenant restrictions policy status and coverage
- **Remediation:**
  - Deploy tenant restrictions v2 policies
  - Control access to external cloud apps
  - Monitor restricted access attempts
  - [Tenant Restrictions v2](https://learn.microsoft.com/en-us/entra/identity/enterprise-apps/tenant-restrictions-v2)
- **Auto-Remediation:** No - Requires infrastructure configuration

---

## D. LEGACY AUTHENTICATION & RISK MANAGEMENT

### 26. **No Legacy Authentication**
- **ID:** IDENTITY-RA-001
- **Priority:** Critical
- **Risk Level:** Critical
- **Validation:** No legacy authentication (SMTP, IMAP, POP3) sign-in activity detected
- **Expected:** 0 legacy authentication sign-ins
- **Current:** Count of legacy authentication events (last 30 days)
- **Remediation:**
  - Review legacy authentication audit logs
  - Migrate users to modern authentication
  - [Block legacy authentication](https://learn.microsoft.com/en-us/entra/identity/conditional-access/policy-block-legacy-authentication)
  - Deploy CA policy: Block legacy authentication
- **Auto-Remediation:** Possible - Enforce block legacy auth policy

### 27. **Block Legacy Authentication Policy**
- **ID:** IDENTITY-RA-002
- **Priority:** Critical
- **Risk Level:** Critical
- **Validation:** Conditional Access policy blocks legacy authentication
- **Expected:** CA policy deployed and enforced
- **Current:** CA policy status
- **Remediation:**
  - Deploy CA policy to block legacy auth
  - Target: All users (or phased groups)
  - Exclude: Service accounts using legacy protocols (with justification)
  - Monitor for blocked legacy auth attempts
- **Auto-Remediation:** Possible - Deploy recommended legacy auth block policy

### 28. **High-Risk User Access**
- **ID:** IDENTITY-RA-003
- **Priority:** Critical
- **Risk Level:** High
- **Validation:** Restrict access to users flagged as high-risk by Identity Protection
- **Expected:** CA policy restricting high-risk user access
- **Current:** CA policy status; high-risk user count
- **Remediation:**
  - Enable Azure AD Identity Protection
  - Create CA policy: Restrict high-risk users
  - Require password change or MFA for flagged users
  - Investigate flagged accounts
- **Auto-Remediation:** Possible - Enable ID Protection risk policies

### 29. **Identity Protection Notifications**
- **ID:** IDENTITY-RA-004
- **Priority:** High
- **Risk Level:** High
- **Validation:** ID Protection notifications are enabled for flagged risks
- **Expected:** Notifications sent to security team on risky sign-ins
- **Current:** Notification configuration status
- **Remediation:**
  - Enable Identity Protection alerts
  - Configure notification recipients
  - Monitor risky sign-in reports
  - Investigate and remediate flagged activities
  - [Identity Protection notifications](https://learn.microsoft.com/en-us/entra/id-protection/concept-identity-protection-risks)
- **Auto-Remediation:** Possible - Enable default notifications

### 30. **High-Risk Sign-in Blocking**
- **ID:** IDENTITY-RA-005
- **Priority:** Critical
- **Risk Level:** High
- **Validation:** Block or require action for high-risk sign-ins
- **Expected:** CA policy enforcing step-up auth for risky sign-ins
- **Current:** CA policy status
- **Remediation:**
  - Create CA policy: Require MFA for risky sign-ins
  - Monitor for false positives
  - Adjust risk detection settings as needed
  - [High-risk detection](https://learn.microsoft.com/en-us/entra/id-protection/concept-identity-protection-risks#sign-in-risk)
- **Auto-Remediation:** Possible - Deploy risky sign-in CA policy

---

## Implementation Priority

### Phase 1 (Critical - Immediate)
- IDENTITY-UA-001: Phishing-resistant MFA for privileged users
- IDENTITY-UA-004: MFA for all users
- IDENTITY-WI-003: No shared secrets in apps
- IDENTITY-RA-001: No legacy authentication
- IDENTITY-AC-002: Restrict Global Admins

### Phase 2 (High - 30 days)
- IDENTITY-UA-006: Universal MFA enforcement
- IDENTITY-RA-002: Block legacy auth policy
- IDENTITY-AC-001: Restrict tenant creation
- IDENTITY-WI-001: Remove inactive app privileges

### Phase 3 (Medium - 60-90 days)
- IDENTITY-AC-006: Restrict guest access
- IDENTITY-UA-005: Token protection
- IDENTITY-AC-007: Tenant restrictions v2
- IDENTITY-WI-006: App management policies

---

## Key References
- [Microsoft Zero Trust Assessment](https://aka.ms/zerotrust/assessment)
- [Zero Trust Assessment Demo](https://aka.ms/zerotrust/demo)
- [Entra ID Security Best Practices](https://learn.microsoft.com/en-us/entra/identity/fundamentals/concept-secure-remote-work)
- [Conditional Access Policies](https://learn.microsoft.com/en-us/entra/identity/conditional-access/overview)
