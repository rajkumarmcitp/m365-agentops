# Data Pillar - Zero Trust Validation Controls
## Based on Microsoft Zero Trust Assessment Framework

This document outlines critical validation controls for the Data Protection & Compliance pillar based on Microsoft's official Zero Trust Assessment tool and industry best practices.

---

## A. DATA GOVERNANCE & CLASSIFICATION (4 CONTROLS)

### 1. **Data Classification Framework Implemented**
- **ID:** DATA-006
- **Priority:** Critical
- **Risk Level:** Critical
- **Validation:** Organization-wide data classification framework defined and enforced
- **Classification Levels:** Public, Internal, Confidential, Restricted
- **Impact:** Enables consistent data protection policy application
- **Remediation:**
  - Define 4-level classification policy (Public/Internal/Confidential/Restricted)
  - Create corresponding DLP rules and sensitivity labels
  - Publish classification guide to all users
  - Train users on data classification (monthly refresher)
  - Measure compliance monthly via audit logs
  - Implement auto-classification via sensitive data patterns
- **Auto-Remediation:** No - Requires organizational policy

### 2. **Sensitivity Labels Applied to Sensitive Data**
- **ID:** DATA-007
- **Priority:** Critical
- **Risk Level:** Critical
- **Validation:** Sensitivity labels automatically/manually applied to documents with sensitive data
- **Expected:** >80% of sensitive documents labeled within 30 days
- **Current:** Count of labeled items by classification
- **Remediation:**
  - Enable auto-labeling based on sensitive patterns (PII, credit cards, SSNs)
  - Configure label inheritance on folders
  - Create manual labeling workflows for edge cases
  - Monitor label application rates via audit logs
  - Identify and relabel unlabeled sensitive items
  - Set policy requiring labels before external sharing
- **Auto-Remediation:** Possible - Enable via auto-labeling rules

### 3. **Retention Policies Applied to All Workloads**
- **ID:** DATA-014
- **Priority:** High
- **Risk Level:** High
- **Validation:** Retention policies configured across Exchange, SharePoint, Teams, OneDrive
- **Expected:** 5+ retention policies active with 7+ year retention for compliance data
- **Current:** Count of active policies and protected workloads
- **Remediation:**
  - Create workload-specific retention policies:
    - Email: 7 years (compliance-critical), 3 years (general)
    - Documents: 7 years (contracts), 1-3 years (general)
    - Temp/Draft: 1 year
  - Set delete action for expired data
  - Apply to all users and content locations
  - Exclude sensitive data from auto-delete via exceptions
  - Monitor retention compliance
  - Test deletion workflows quarterly
- **Auto-Remediation:** No - Requires policy management

### 4. **Information Barrier Policies for Data Separation**
- **ID:** DATA-020
- **Priority:** High
- **Risk Level:** High
- **Validation:** Information barriers restrict data access between departments (Legal/Eng, Sales/Ops)
- **Expected:** 2+ information barriers configured for critical combinations
- **Current:** Count of active barriers and protected segments
- **Remediation:**
  - Define data isolation requirements (e.g., Legal cannot see Operations data)
  - Create user segments (Legal, Operations, Sales, Engineering)
  - Configure barriers preventing communication/sharing
  - Test barrier effectiveness monthly
  - Monitor barrier violations via audit logs
  - Update barriers as org structure changes
  - [Information Barriers documentation](https://learn.microsoft.com/microsoft-365/compliance/information-barriers)
- **Auto-Remediation:** No - Requires organizational configuration

---

## B. DATA PROTECTION & ENCRYPTION (3 CONTROLS)

### 5. **Data Loss Prevention (DLP) Policies Comprehensive**
- **ID:** DATA-008
- **Priority:** Critical
- **Risk Level:** Critical
- **Validation:** Comprehensive DLP policies protect sensitive data across all workloads
- **Coverage:** Email, Teams, SharePoint, OneDrive, endpoints, cloud apps
- **Expected:** 6+ DLP policies active covering all sensitive data types
- **Current:** Count of active policies and protected workloads
- **Remediation:**
  - Create DLP policies for each data type:
    - **Financial:** Credit cards (Luhn algorithm), bank accounts, routing numbers
    - **Identity:** SSNs, passports, driver licenses, national IDs
    - **Technical:** API keys, passwords, tokens, connection strings
    - **Proprietary:** Confidential labels, trade secret patterns, competitor names
  - Set rule actions:
    - Low-confidence: Alert user
    - Medium-confidence: Alert & log
    - High-confidence: Block sharing + alert
  - Test with sample data
  - Monitor match rates weekly
  - Tune false positive thresholds
- **Auto-Remediation:** Possible - Block via policy

### 6. **Azure Information Protection (AIP) Deployed**
- **ID:** DATA-009
- **Priority:** High
- **Risk Level:** High
- **Validation:** AIP deployed for persistent data protection with encryption and usage rights
- **Expected:** AIP labels applied to 70%+ of sensitive documents
- **Current:** Count of AIP-protected files by label
- **Remediation:**
  - Deploy AIP client to all user devices (apps, Outlook, File Explorer)
  - Create AIP labels matching sensitivity levels:
    - Public: No encryption
    - Internal: Optional encryption
    - Confidential: Encryption + usage restrictions
    - Restricted: Encryption + strong restrictions
  - Configure usage rights (View, Edit, Forward, Print, Copy)
  - Enable automatic labeling rules
  - Train users on label selection
  - Monitor protection rates via scanner
  - Test decryption scenarios
- **Auto-Remediation:** No - Requires client deployment

### 7. **Threat Protection - Advanced Threat Protection (ATP) for SharePoint/OneDrive**
- **ID:** DATA-015
- **Priority:** Critical
- **Risk Level:** Critical
- **Validation:** ATP enabled to detect malware and suspicious files
- **Expected:** ATP active; malicious files quarantined; alerts configured
- **Current:** ATP status and threat detection metrics
- **Remediation:**
  - Enable ATP for SharePoint Online and OneDrive
  - Configure malware detection and automatic quarantine
  - Set up alerts for high/medium severity threats
  - Review quarantine weekly
  - Test with EICAR test files
  - Integrate with Defender for Office 365
  - Enable for email attachments as well
  - [ATP documentation](https://learn.microsoft.com/microsoft-365/security/defender-for-office-365)
- **Auto-Remediation:** Possible - Enable via admin center

---

## C. INFORMATION PROTECTION (3 CONTROLS)

### 8. **Sensitivity Labels Configured**
- **ID:** DATA-002
- **Priority:** High
- **Risk Level:** High
- **Validation:** Sensitivity labels created and assigned to content
- **Expected:** 4+ labels configured (Public, Internal, Confidential, Restricted)
- **Current:** Count of active labels and labeled items
- **Remediation:**
  - Create sensitivity labels in Microsoft Purview:
    - Public: No protection
    - Internal: Optional encryption + internal sharing only
    - Confidential: Encryption + restricted sharing (org only)
    - Restricted: Encryption + strong restrictions + approvals
  - Configure label actions (encryption, markings, access restrictions)
  - Publish labels to users
  - Create label policies for different user groups
  - Monitor label usage via audit logs
- **Auto-Remediation:** No - Requires manual label creation

### 9. **Auto-Labeling Rules Enabled**
- **ID:** DATA-003
- **Priority:** High
- **Risk Level:** High
- **Validation:** Automatic labeling configured for sensitive data patterns
- **Expected:** 5+ auto-labeling rules active (PII, credit cards, SSNs, etc.)
- **Current:** Count of auto-labeling rules and match rates
- **Remediation:**
  - Create auto-labeling policies for:
    - Credit card numbers → Confidential
    - SSNs/Passports → Restricted
    - API keys/Passwords → Restricted
    - Confidential labels (text pattern) → Confidential
    - Financial data (account numbers) → Confidential
  - Set confidence levels (low/medium/high)
  - Enable for SharePoint, OneDrive, Exchange
  - Test with sample data
  - Monitor false positive rate
  - Adjust patterns based on feedback
- **Auto-Remediation:** Possible - Enable auto-labeling

### 10. **Azure Information Protection (AIP) Labels Configured (Duplicate tracking - see DATA-009)**
- **ID:** N/A - Covered under DATA-009
- **Notes:** AIP provides persistent protection with encryption and usage rights

---

## D. ACCESS CONTROL & SHARING RESTRICTIONS (5 CONTROLS)

### 11. **SharePoint Site Permissions Auditing**
- **ID:** DATA-011
- **Priority:** High
- **Risk Level:** High
- **Validation:** SharePoint site permissions regularly audited; oversharing removed
- **Expected:** 0 sites with unrestricted external sharing; >95% internally shared sites restricted
- **Current:** Count of sites by sharing level
- **Remediation:**
  - Audit all SharePoint sites for external sharing:
    - Identify sites with 'Anyone' sharing
    - Identify sites with external guest access
  - Reduce unrestricted sites to <5% (only approved high-sharing sites)
  - Enable 'Site Sharing Restrictions' limiting to org only
  - Implement sharing approval workflows
  - Monitor new external shares daily
  - Remove inactive external users quarterly (90+ days no access)
  - [SharePoint external sharing best practices](https://learn.microsoft.com/sharepoint/external-sharing-overview)
- **Auto-Remediation:** No - Requires manual review

### 12. **OneDrive Sharing Policy Enforcement**
- **ID:** DATA-012
- **Priority:** High
- **Risk Level:** High
- **Validation:** OneDrive sharing restricted to prevent oversharing
- **Expected:** Sharing set to 'ExistingExternalUserSharing' or more restrictive
- **Current:** OneDrive sharing policy configuration
- **Remediation:**
  - Set OneDrive sharing to 'Existing External User Sharing':
    - Only approved external users can access
    - 'Anyone' links disabled
    - Require link expiration (30 days)
  - Disable file download on unmanaged devices
  - Implement sharing approval workflows
  - Block downloading for sensitive classifications
  - Monitor OneDrive sharing link creation
  - Generate sharing compliance reports
- **Auto-Remediation:** Possible - Enforce via policy

### 13. **Teams Guest Access Controls**
- **ID:** DATA-013
- **Priority:** High
- **Risk Level:** High
- **Validation:** Teams guest access restricted to prevent data leakage
- **Expected:** Guests cannot create channels; @mentions disabled; external access restricted
- **Current:** Teams guest access policy configuration
- **Remediation:**
  - Disable guest channel creation in Teams
  - Disable guest @mentions capability
  - Restrict external access by domain (whitelist only):
    - Allow partners/vendors
    - Block consumer domains (@gmail.com, etc.)
  - Disable guest access in sensitive Teams (Legal, HR, Finance)
  - Implement guest access reviews quarterly (remove inactive guests)
  - Log all guest activities
  - [Teams guest access settings](https://learn.microsoft.com/microsoftteams/guest-access)
- **Auto-Remediation:** Possible - Enforce via Teams settings

### 14. **Conditional Access - Unmanaged Device Data Blocking**
- **ID:** DATA-016
- **Priority:** Critical
- **Risk Level:** Critical
- **Validation:** CA policies block download/sync of sensitive data on unmanaged devices
- **Expected:** CA policy requiring managed/compliant devices for data access
- **Current:** CA policy configuration for unmanaged devices
- **Remediation:**
  - Create Conditional Access policy for high-risk data:
    - Conditions: Unmanaged device + high-sensitivity data location
    - Action: Block access (or require managed device enrollment)
  - Alternative: Block download/sync (allow view-only)
  - Exclude emergency access accounts
  - Test with personal devices
  - Monitor policy enforcement via sign-in logs
  - Provide device enrollment guidance to affected users
  - [Conditional Access device requirements](https://learn.microsoft.com/entra/identity/conditional-access/policy-all-users-device-compliance)
- **Auto-Remediation:** Possible - Enforce block via CA

### 15. **Tenant Restrictions V2 for Data Protection**
- **ID:** DATA-017
- **Priority:** High
- **Risk Level:** High
- **Validation:** Tenant Restrictions v2 prevents unauthorized cross-tenant data access
- **Expected:** Tenant Restrictions v2 configured blocking all external tenants by default
- **Current:** Tenant restrictions policy configuration
- **Remediation:**
  - Enable Tenant Restrictions v2 via network firewall:
    - Block all external tenants by default
    - Create allowlist of approved partner tenants only
  - Implement at egress proxy/firewall level
  - Test with approved and blocked tenants
  - Monitor cross-tenant access attempts via proxy logs
  - Implement policy for all users and devices
  - Update allowlist quarterly
- **Auto-Remediation:** No - Requires network/firewall configuration

---

## E. SHARING CONTROLS (2 CONTROLS)

### 16. **SharePoint Sharing Policy Restricted**
- **ID:** DATA-004
- **Priority:** High
- **Risk Level:** High
- **Validation:** SharePoint site sharing policies restricted
- **Expected:** Default sharing: 'Existing External Users' or 'People in your organization'
- **Current:** Tenant-wide sharing policy setting
- **Remediation:**
  - Set default to 'Existing External Users' (most restrictive for most orgs)
  - Allow sites to opt-in to higher sharing if business justified
  - Disable 'Anyone' links by default
  - Require link expiration
  - Implement sharing approval workflow
  - Monitor override requests
- **Auto-Remediation:** Possible - Enforce via policy

### 17. **OneDrive Sharing Policy Restricted**
- **ID:** DATA-005
- **Priority:** High
- **Risk Level:** High
- **Validation:** OneDrive sharing restricted (similar to SharePoint)
- **Expected:** Sharing restricted to existing external users or org only
- **Current:** OneDrive sharing policy configuration
- **Remediation:**
  - Set to 'Existing External Users' for most secure posture
  - Implement same controls as SharePoint
  - Monitor personal data sharing
  - Educate users on safe sharing practices
- **Auto-Remediation:** Possible - Enforce via policy

---

## F. DATA LOSS PREVENTION (2 CONTROLS)

### 18. **DLP Policies Configured**
- **ID:** DATA-001
- **Priority:** Critical
- **Risk Level:** Critical
- **Validation:** DLP policies configured to prevent data leakage
- **Expected:** Policies protecting credit cards, SSNs, trade secrets
- **Current:** Count of active DLP policies and enforcement status
- **Remediation:**
  - Create DLP policies for sensitive data types
  - Configure rules to alert, log, and block
  - Test with sample sensitive data
  - Monitor false positives
  - Tune thresholds based on org needs
- **Auto-Remediation:** Possible - Enforce blocking via policy

### 19. **Data Loss Prevention (DLP) Policies Comprehensive** (Enhanced version of DATA-001)
- **ID:** DATA-008
- **Priority:** Critical
- **Risk Level:** Critical
- **Validation:** Comprehensive DLP across all workloads
- **Expected:** 6+ DLP policies active
- **Current:** Count of policies and protected workloads
- **Remediation:** See Section B, Control 5
- **Auto-Remediation:** Possible - Enforce via policy

---

## G. MONITORING & AUDIT (4 CONTROLS)

### 20. **Content Search & eDiscovery Audit Logging**
- **ID:** DATA-010
- **Priority:** High
- **Risk Level:** High
- **Validation:** All content search and eDiscovery activities logged
- **Expected:** 100% of searches logged; 365+ day audit retention
- **Current:** Count of logged content search activities (90 days)
- **Remediation:**
  - Enable mailbox audit logging for all users
  - Enable Azure AD audit logging
  - Set audit retention to minimum 365 days (7 years recommended)
  - Create alerts for bulk export/search activities
  - Review audit logs monthly for anomalies
  - Implement RBAC for content search access (limit to investigators)
  - [Audit logging documentation](https://learn.microsoft.com/microsoft-365/compliance/search-the-audit-log)
- **Auto-Remediation:** Possible - Enable via audit settings

### 21. **Insider Risk Management Enabled**
- **ID:** DATA-018
- **Priority:** High
- **Risk Level:** High
- **Validation:** Insider Risk Management detects/prevents data exfiltration
- **Expected:** IRM enabled with policies for risky activities
- **Current:** IRM policy configuration and alert count (90 days)
- **Remediation:**
  - Enable Insider Risk Management in Microsoft Purview
  - Configure policies for:
    - Mass download detection
    - Data exfiltration patterns
    - Abnormal access patterns
    - Termination-related risky activities
  - Set alert thresholds
  - Create investigation workflows
  - Integrate with SIEM
  - Review alerts weekly
  - [Insider Risk Management documentation](https://learn.microsoft.com/microsoft-365/compliance/insider-risk-management)
- **Auto-Remediation:** No - Requires investigation workflow

### 22. **Communication Compliance - Data in Messages**
- **ID:** DATA-019
- **Priority:** High
- **Risk Level:** High
- **Validation:** Communication compliance monitors Teams/Email for data sharing violations
- **Expected:** 2+ communication compliance policies active
- **Current:** Count of active policies and alerts (90 days)
- **Remediation:**
  - Create communication policies detecting:
    - PII sharing (SSNs, credit cards)
    - Confidential data exposure
    - External data transmission
    - Regulatory non-compliance language
  - Set actions: Alert, quarantine, escalate
  - Configure approval workflow for flagged messages
  - Review alerts within 24 hours
  - Escalate to legal/HR as needed
  - [Communication Compliance documentation](https://learn.microsoft.com/microsoft-365/compliance/communication-compliance)
- **Auto-Remediation:** No - Requires investigation

### 23. **eDiscovery & Litigation Hold Management**
- **ID:** DATA-025
- **Priority:** High
- **Risk Level:** High
- **Validation:** eDiscovery cases managed with holds and audit trails
- **Expected:** eDiscovery cases with audit logs; holds configured; RBAC enforced
- **Current:** Count of active cases and audit trail completeness
- **Remediation:**
  - Create eDiscovery governance policies
  - Configure case management workflow
  - Enable audit logging for all case actions
  - Enforce RBAC (investigators only)
  - Place holds on relevant data sources when case opens
  - Document all cases
  - Perform monthly case reviews
  - Archive closed cases (7+ years)
  - Test hold effectiveness quarterly
- **Auto-Remediation:** No - Requires case management

---

## H. COMPLIANCE & GOVERNANCE (4 CONTROLS)

### 24. **Compliance Manager - Data Protection Controls**
- **ID:** DATA-021
- **Priority:** High
- **Risk Level:** High
- **Validation:** Compliance Manager tracks data protection control compliance (GDPR, CCPA, HIPAA)
- **Expected:** 3+ compliance assessments active with 80%+ implementation
- **Current:** Compliance Manager assessment scores by regulation
- **Remediation:**
  - Create Compliance Manager assessments for applicable regulations:
    - GDPR (EU data protection)
    - CCPA (California privacy)
    - HIPAA (healthcare data)
    - SOC 2 (if applicable)
  - Map controls to existing policies
  - Track implementation progress
  - Update assessments quarterly
  - Assign control owners
  - Generate compliance reports for leadership
  - [Compliance Manager documentation](https://learn.microsoft.com/microsoft-365/compliance/compliance-manager)
- **Auto-Remediation:** No - Requires ongoing management

### 25. **Data Residency & Geo-Compliance Enforced**
- **ID:** DATA-022
- **Priority:** High
- **Risk Level:** High
- **Validation:** Data residency requirements enforced for compliance
- **Expected:** Data residency policies configured for regulated data
- **Current:** Geo-location policy configuration and data location verification
- **Remediation:**
  - Identify data residency requirements:
    - EU data: must stay in EU (GDPR)
    - UK data: must stay in UK (UK GDPR)
    - Canada data: must stay in Canada (PIPEDA)
  - Configure geo-location restrictions
  - Deploy Multi-Geo if needed for Microsoft 365
  - Verify data location via tenant settings
  - Implement data residency monitoring
  - Test with data access from non-compliant regions
  - Document residency compliance
- **Auto-Remediation:** No - Requires Multi-Geo configuration

### 26. **Recoverable Items Retention - Legal Hold**
- **ID:** DATA-023
- **Priority:** High
- **Risk Level:** High
- **Validation:** Recoverable items retention configured for legal holds
- **Expected:** >95% of users/mailboxes support litigation hold; 30+ days recovery
- **Current:** Count of users with litigation hold; retention days
- **Remediation:**
  - Enable litigation hold on all user mailboxes (minimum 30 days)
  - Set retention for recoverable items to 30-90 days
  - Configure for OneDrive/Teams content
  - Create hold runbook for legal requests
  - Document hold policies
  - Test hold effectiveness quarterly
  - Monitor holds for expiration/compliance
  - [Litigation Hold documentation](https://learn.microsoft.com/microsoft-365/compliance/retention-limits)
- **Auto-Remediation:** Possible - Enable via policy

### 27. **Data Subject Rights Automation**
- **ID:** DATA-024
- **Priority:** Medium
- **Risk Level:** Medium
- **Validation:** GDPR/CCPA Data Subject Rights requests automated and tracked
- **Expected:** >80% DSR requests automated; processed within 30-45 day SLA
- **Current:** DSR request logs and processing time metrics
- **Remediation:**
  - Create DSR workflow:
    - Receive request via ticketing system
    - Collect data via compliance manager
    - Review for privilege/confidentiality
    - Respond to user within SLA
  - Use Compliance Manager for content search
  - Configure automated notifications
  - Implement approval workflow
  - Document SLA (30-45 days)
  - Track metrics: volume, time-to-respond, completion rate
  - Audit DSR compliance quarterly
- **Auto-Remediation:** No - Requires workflow automation

---

## Implementation Priority

### Phase 1 (Critical - Immediate)
- DATA-008: Comprehensive DLP policies
- DATA-007: Sensitivity label application
- DATA-015: ATP for SharePoint/OneDrive
- DATA-016: CA blocking unmanaged devices
- DATA-006: Data classification framework

### Phase 2 (High - 30 days)
- DATA-001: DLP configuration
- DATA-002: Sensitivity labels
- DATA-011: SharePoint permissions audit
- DATA-012: OneDrive sharing restrictions
- DATA-013: Teams guest controls
- DATA-014: Retention policies

### Phase 3 (Medium - 60-90 days)
- DATA-009: Azure Information Protection
- DATA-010: Content search audit logging
- DATA-017: Tenant Restrictions v2
- DATA-018: Insider Risk Management
- DATA-019: Communication compliance
- DATA-020: Information barriers

### Phase 4 (Strategic - 90-180 days)
- DATA-003: Auto-labeling rules
- DATA-021: Compliance Manager setup
- DATA-022: Geo-compliance enforcement
- DATA-023: Litigation hold policies
- DATA-024: DSR automation
- DATA-025: eDiscovery management

---

## Key References
- [Microsoft Purview Data Governance](https://learn.microsoft.com/purview/solutions-overview)
- [DLP Policies Overview](https://learn.microsoft.com/microsoft-365/compliance/dlp-overview)
- [Sensitivity Labels Documentation](https://learn.microsoft.com/microsoft-365/compliance/sensitivity-labels)
- [Information Barriers](https://learn.microsoft.com/microsoft-365/compliance/information-barriers)
- [Insider Risk Management](https://learn.microsoft.com/microsoft-365/compliance/insider-risk-management)
- [Compliance Manager](https://learn.microsoft.com/microsoft-365/compliance/compliance-manager)
- [Zero Trust Assessment Demo](https://aka.ms/zerotrust/demo)

