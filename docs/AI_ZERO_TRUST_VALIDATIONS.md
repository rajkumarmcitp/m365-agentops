# AI Pillar - Zero Trust Validation Controls
## Based on Microsoft Zero Trust Assessment Framework

This document outlines critical validation controls for the AI Security pillar based on Microsoft's official Zero Trust Assessment tool and Copilot security best practices.

---

## A. COPILOT GOVERNANCE & READINESS (5 CONTROLS)

### 1. **Copilot User MFA Enforcement**
- **ID:** AI-001
- **Priority:** Critical
- **Risk Level:** Critical
- **Validation:** All Copilot users have MFA enabled to prevent unauthorized access
- **Impact:** Reduces risk of compromised accounts accessing Copilot
- **Remediation:**
  - Enable MFA requirement for all Copilot users via Conditional Access
  - Use phishing-resistant MFA methods (Windows Hello, FIDO2 keys)
  - Monitor MFA compliance via Azure AD sign-in logs
  - Block Copilot access for non-MFA users
- **Auto-Remediation:** Possible - Block via Conditional Access

### 2. **Copilot License Assignment & Governance**
- **ID:** AI-006
- **Priority:** High
- **Risk Level:** High
- **Validation:** Copilot licenses assigned only to authorized users with proper governance
- **Expected:** Licenses assigned to approved users only
- **Current:** Count of Copilot licensed users
- **Remediation:**
  - Review Copilot license assignment against approved user list
  - Remove licenses from contractors/external users
  - Implement group-based license assignment for governance
  - Monitor license usage via Microsoft 365 admin center
  - Create budget alerts for unexpected license consumption
- **Auto-Remediation:** Possible - Revoke licenses via admin API

### 3. **Copilot Data Privacy Mode Enabled**
- **ID:** AI-007
- **Priority:** Critical
- **Risk Level:** Critical
- **Validation:** Copilot Data Privacy Mode enabled to prevent data retention for model improvement
- **Expected:** Data Privacy Mode: Enabled
- **Current:** Privacy mode configuration status
- **Remediation:**
  - Enable Copilot Data Privacy Mode in Microsoft 365 admin center
  - Navigate to Settings > Org settings > Copilot
  - Verify "Data Privacy" toggle is enabled
  - Communicate privacy posture to users
  - Review quarterly to ensure setting remains enabled
- **Auto-Remediation:** Possible - Enable via admin API

### 4. **Copilot Tenant Isolation Enforced**
- **ID:** AI-008
- **Priority:** Critical
- **Risk Level:** Critical
- **Validation:** Copilot tenant isolation enforced to prevent cross-tenant data access
- **Expected:** Copilot configured for single tenant only
- **Current:** Tenant isolation configuration status
- **Remediation:**
  - Verify Copilot deployment is single-tenant
  - Disable multi-tenant federation for Copilot
  - Review cross-tenant access policies for Copilot exclusions
  - Implement tenant-level access boundaries
  - Monitor for unauthorized cross-tenant Copilot usage
- **Auto-Remediation:** No - Requires tenant-level configuration

### 5. **Copilot Feedback & Logging Audit**
- **ID:** AI-009
- **Priority:** High
- **Risk Level:** High
- **Validation:** Copilot user feedback and activity logging configured for audit and compliance
- **Expected:** Copilot activity logging enabled and auditable
- **Current:** Count of logged Copilot activities in past 90 days
- **Remediation:**
  - Enable Copilot activity logging in Microsoft 365 admin center
  - Configure audit retention to minimum 365 days
  - Monitor feedback submissions for sensitive data leaks
  - Create alerts for suspicious Copilot usage patterns
  - Review monthly activity reports for anomalies
  - Implement feedback filtering to prevent data leaks
- **Auto-Remediation:** No - Requires continuous monitoring

---

## B. DATA PROTECTION FOR AI (7 CONTROLS)

### 6. **Copilot Ground Truth Data Protection**
- **ID:** AI-010
- **Priority:** Critical
- **Risk Level:** Critical
- **Validation:** Sensitive data restricted from Copilot ground truth training and indexing
- **Expected:** Sensitive data types excluded from Copilot training
- **Current:** List of excluded sensitive data types
- **Remediation:**
  - Configure DLP policies to exclude Copilot ground truth from:
    - Personally Identifiable Information (PII)
    - Trade secrets and confidential data
    - Financial records and payment card data
    - Health information (HIPAA)
  - Use content sensitivity labels preventing Copilot indexing
  - Apply retention labels blocking Copilot access
  - Test with sample sensitive data
  - [Copilot data protection documentation](https://learn.microsoft.com/microsoft-365-copilot/manage-microsoft-365-copilot)
- **Auto-Remediation:** Possible - Block via DLP and labels

### 7. **Oversharing Detection - SharePoint AI Indexing**
- **ID:** AI-011
- **Priority:** High
- **Risk Level:** High
- **Validation:** Overshared SharePoint content identified and restricted from AI model indexing
- **Expected:** 0 overshared sites indexed by Copilot
- **Current:** Count of overshared SharePoint sites
- **Remediation:**
  - Audit SharePoint sites with 'Anyone' or external sharing enabled
  - Apply sensitivity labels preventing Copilot indexing:
    - Set "Allow Copilot" to No for sensitive sites
  - Reduce sharing scope from external to specific users/groups
  - Monitor site sharing changes via audit logs
  - Implement sharing approval workflows
  - [SharePoint sharing policies documentation](https://learn.microsoft.com/sharepoint/turn-external-sharing-on-or-off)
- **Auto-Remediation:** No - Requires manual sharing scope reduction

### 8. **Oversharing Detection - OneDrive AI Indexing**
- **ID:** AI-012
- **Priority:** High
- **Risk Level:** High
- **Validation:** Overshared OneDrive content identified and restricted from AI model indexing
- **Expected:** 0 overshared personal files with external access
- **Current:** Count of overshared OneDrive items
- **Remediation:**
  - Audit OneDrive sharing links with 'Anyone' access
  - Apply sensitivity labels preventing Copilot indexing to personal files
  - Convert overshared links to specific user/group sharing
  - Configure DLP to block external sharing of sensitive data
  - Enable sharing link expiration policies
  - Review oversharing trends monthly
  - [OneDrive sharing settings documentation](https://learn.microsoft.com/onedrive/user-shares-data)
- **Auto-Remediation:** No - Requires user education and policy enforcement

### 9. **DLP Policy for AI-Generated Content**
- **ID:** AI-022
- **Priority:** High
- **Risk Level:** High
- **Validation:** DLP policies prevent AI-generated content containing sensitive data from leaving the organization
- **Expected:** DLP policies protecting AI-generated content with PII/secrets
- **Current:** DLP policy configuration blocking sensitive data in Copilot outputs
- **Remediation:**
  - Create DLP rule monitoring Copilot outputs for:
    - Credit card numbers and payment data
    - Social Security numbers and personal IDs
    - API keys and authentication secrets
    - Confidential data patterns
  - Configure rule actions:
    - Block sharing for high-confidence matches
    - Alert admins for medium-confidence matches
    - Log all Copilot output scanning
  - Test with sample sensitive data
  - Monitor DLP audit logs for patterns
- **Auto-Remediation:** Possible - Enforce block via DLP

### 10. **AI Privacy Impact Assessment (PIA)**
- **ID:** AI-027
- **Priority:** High
- **Risk Level:** High
- **Validation:** Privacy Impact Assessments completed for all AI models handling personal data
- **Expected:** PIAs completed and approved for all AI systems
- **Current:** Number of completed PIAs
- **Remediation:**
  - Conduct PIA for each AI model before deployment:
    - Document data sources and data flows
    - Identify personal data being processed
    - Assess privacy risks and compliance gaps
    - Define data retention and deletion policies
    - Evaluate third-party sharing
  - Get legal/compliance approval
  - Store PIA documentation in centralized location
  - Update PIAs annually or when model changes
  - Review quarterly with privacy officer
- **Auto-Remediation:** No - Requires assessment and approval

### 11. **Copilot Ground Truth Data Protection - Advanced**
- **ID:** AI-019
- **Priority:** Medium
- **Risk Level:** Medium
- **Validation:** AI training data retention policies limit how long data is stored for model fine-tuning
- **Expected:** Training data retained for <=180 days
- **Current:** Retention policy configuration for AI training data
- **Remediation:**
  - Set retention policy on AI training data folders to 180 days max
  - Exclude sensitive data completely from training datasets
  - Use labels to mark data for retention limits
  - Audit data purge operations monthly
  - Implement automated deletion for expired training data
  - Document data retention compliance
- **Auto-Remediation:** Possible - Auto-delete via retention policy

---

## C. AI AGENT & PLUGIN SECURITY (6 CONTROLS)

### 12. **AI Plugin Security - Permission Minimization**
- **ID:** AI-013
- **Priority:** Critical
- **Risk Level:** Critical
- **Validation:** AI agent plugins and custom connectors have minimal Graph API permissions
- **Expected:** All AI plugins with minimal required permissions only
- **Current:** List of plugin permissions and scope
- **Remediation:**
  - Review each AI plugin's Graph API permissions in Azure AD
  - Remove unused scopes and delegated permissions
  - Use application roles instead of admin consent
  - Implement permission approval workflow for new plugins
  - Document justification for each permission
  - Monitor plugin usage via audit logs
  - [Least privilege access for applications](https://learn.microsoft.com/graph/auth/auth-concepts#least-privilege-access)
- **Auto-Remediation:** No - Requires permission review and approval

### 13. **AI Agent Secrets Management - Rotation**
- **ID:** AI-014
- **Priority:** Critical
- **Risk Level:** Critical
- **Validation:** AI agent client secrets and API keys rotated regularly (<=90 days)
- **Expected:** All AI agent secrets rotated within last 90 days
- **Current:** Last secret rotation date and credential age
- **Remediation:**
  - Implement automated secret rotation for all AI agents:
    - Maximum 90 days between rotations
    - Preferably 30 days for production
  - Use Azure Key Vault for centralized secret storage
  - Enable certificate-based authentication instead of secrets
  - Configure rotation alerts at 60-day mark
  - Test agent functionality after each rotation
  - Document rotation history for compliance
- **Auto-Remediation:** Possible - Enable via Key Vault

### 14. **AI Agent Access Logging & Audit**
- **ID:** AI-015
- **Priority:** High
- **Risk Level:** High
- **Validation:** AI agent access to data and Graph API operations logged and auditable
- **Expected:** 100% of AI agent operations logged with audit trail
- **Current:** Count of logged agent operations in past 90 days
- **Remediation:**
  - Enable service principal sign-in audit logs in Azure AD
  - Configure audit retention to 365+ days
  - Create alerts for anomalous agent activity:
    - Bulk data access patterns
    - Permission changes
    - Access outside business hours
    - Failed authentication attempts
  - Review agent access logs monthly
  - Implement automated response for suspicious activity
- **Auto-Remediation:** Possible - Alert and block suspicious activity

### 15. **AI Model Input Validation & Sanitization**
- **ID:** AI-016
- **Priority:** High
- **Risk Level:** High
- **Validation:** Inputs to AI models validated and sanitized to prevent prompt injection attacks
- **Expected:** Input validation and prompt injection guards implemented
- **Current:** Code review of AI input handling and validation rules
- **Remediation:**
  - Implement input length limits for Copilot/AI queries
  - Add prompt injection detection:
    - Look for command markers (/, #, $)
    - Detect SQL injection patterns
    - Identify system prompt leakage attempts
  - Validate input data types and formats
  - Use content moderation APIs for harmful input
  - Test with known adversarial prompts
  - Log and alert on injection attempts
- **Auto-Remediation:** Possible - Block via input validation

### 16. **Adversarial Testing & Red Teaming**
- **ID:** AI-026
- **Priority:** High
- **Risk Level:** High
- **Validation:** Regular adversarial testing and red teaming identifies AI model vulnerabilities
- **Expected:** Red team testing conducted quarterly with vulnerability remediation
- **Current:** Red team testing reports, vulnerability findings
- **Remediation:**
  - Establish quarterly red team exercises:
    - Test prompt injection attacks
    - Attempt jailbreaks and privilege escalation
    - Test data poisoning/training data attacks
    - Probe for backdoors
  - Document vulnerabilities and track remediation
  - Use adversarial samples in testing
  - Measure model robustness metrics before/after
  - Maintain red team report archive
  - Share findings with security team
- **Auto-Remediation:** No - Requires expert security testing

---

## D. ACCESS CONTROL FOR AI (1 CONTROL)

### 17. **Conditional Access - AI Agent Device Compliance**
- **ID:** AI-018
- **Priority:** High
- **Risk Level:** High
- **Validation:** Conditional Access policies enforce device compliance for AI agent access to sensitive data
- **Expected:** CA policy requiring compliant devices for AI agent access
- **Current:** Conditional Access policy configuration and enforcement
- **Remediation:**
  - Create CA policy for AI agent service principals:
    - Require Intune device compliance for agent access
    - Block legacy auth for agents
    - Require certificate-based authentication
    - Restrict to managed devices only
  - Target high-risk applications and data
  - Monitor policy enforcement via sign-in logs
  - Alert on policy violations
  - Test access with compliant and non-compliant devices
- **Auto-Remediation:** Possible - Enforce block via CA

---

## E. MONITORING & COMPLIANCE (5 CONTROLS)

### 18. **AI Output Filtering & Content Moderation**
- **ID:** AI-017
- **Priority:** High
- **Risk Level:** High
- **Validation:** AI model outputs filtered and moderated to prevent inappropriate content delivery
- **Expected:** Content moderation and output filtering implemented
- **Current:** List of moderation rules and policies applied
- **Remediation:**
  - Enable Azure Content Moderator for Copilot output filtering
  - Create content policies excluding sensitive topics:
    - Financial advice and recommendations
    - Medical diagnosis and healthcare advice
    - Legal guidance and contract creation
    - Instructions for harmful activities
  - Implement human review workflow for flagged outputs
  - Use feedback loop to improve filters
  - Monitor and tune filter accuracy
  - Log all filtered content for compliance
- **Auto-Remediation:** No - Requires configuration and tuning

### 19. **AI Bias & Fairness Monitoring**
- **ID:** AI-020
- **Priority:** Medium
- **Risk Level:** Medium
- **Validation:** AI model outputs monitored for bias and fairness across different user demographics
- **Expected:** Bias monitoring and fairness assessment implemented
- **Current:** Bias detection framework and monitoring dashboard
- **Remediation:**
  - Implement fairness monitoring for AI outputs:
    - Track output quality by user segment (region, department, role)
    - Identify disparities in recommendation accuracy
    - Monitor for cultural bias in text generation
  - Create dashboard showing fairness metrics
  - Set alerts for skewed results by segment
  - Conduct quarterly fairness audits
  - Document bias findings and remediation
  - Retrain models if significant bias detected
- **Auto-Remediation:** No - Requires analysis and model retraining

### 20. **AI Model Version Control & Governance**
- **ID:** AI-021
- **Priority:** Medium
- **Risk Level:** Medium
- **Validation:** AI model versions controlled and tracked for reproducibility and rollback capability
- **Expected:** All AI models versioned with deployment tracking
- **Current:** Model version control system and change logs
- **Remediation:**
  - Implement model versioning in Azure ML or equivalent:
    - Tag each model version
    - Document changes in each version
    - Track deployment history
  - Enable rollback to previous versions if issues detected
  - Implement model testing/validation before production
  - Maintain model registry with metadata
  - Archive old model versions
- **Auto-Remediation:** No - Requires manual version management

### 21. **AI Model Explainability & Transparency**
- **ID:** AI-023
- **Priority:** Medium
- **Risk Level:** Medium
- **Validation:** AI models designed with explainability to understand reasoning behind decisions
- **Expected:** AI model decisions traceable to source data and reasoning
- **Current:** Model explainability framework and sample decision traces
- **Remediation:**
  - Implement explainability frameworks (SHAP, LIME):
    - Show which data influenced decisions
    - Explain feature importance
    - Provide confidence scores
  - Document model decision logic
  - Provide users with explanations for recommendations
  - Enable audit trail for model inferences
  - Create explainability dashboards for admins
  - Test explainability with sample decisions
- **Auto-Remediation:** No - Requires implementation in model code

### 22. **Responsible AI Governance Board**
- **ID:** AI-024
- **Priority:** Medium
- **Risk Level:** Medium
- **Validation:** Responsible AI governance board established to oversee AI development and deployment
- **Expected:** AI governance board chartered with policies and review cycle
- **Current:** AI governance policy, board charter, meeting records
- **Remediation:**
  - Establish cross-functional AI governance board:
    - Security, Legal, Compliance, Business, Ethics representatives
    - CIO or Chief Security Officer as sponsor
  - Define AI risk assessment framework
  - Implement review process for new AI initiatives
  - Conduct quarterly risk assessments
  - Document policies, decisions, and remediation
  - Meet monthly to review AI initiatives
  - Maintain risk register and metrics dashboard
- **Auto-Remediation:** No - Requires organizational governance

### 23. **AI Compliance Attestation & Reporting**
- **ID:** AI-025
- **Priority:** High
- **Risk Level:** High
- **Validation:** Regular AI security and compliance attestations performed and reported to leadership
- **Expected:** Quarterly AI security compliance reports generated
- **Current:** AI security compliance reports, attestation documents
- **Remediation:**
  - Establish monthly AI security audits:
    - Data usage and access patterns
    - Permission and consent compliance
    - Incident logs and response
  - Generate quarterly compliance reports:
    - Summary of controls tested
    - Findings and remediation status
    - Risk scores and trends
    - Executive summary
  - Perform annual third-party AI risk assessments
  - Present findings to executive leadership
  - Track remediation progress
- **Auto-Remediation:** No - Requires reporting and analysis

---

## Implementation Priority

### Phase 1 (Critical - Immediate)
- AI-007: Copilot Data Privacy Mode
- AI-008: Tenant Isolation
- AI-010: Ground Truth Data Protection
- AI-013: Plugin Permission Minimization
- AI-014: Agent Secrets Rotation

### Phase 2 (High - 30 days)
- AI-001: Copilot User MFA
- AI-006: License Governance
- AI-009: Feedback Logging
- AI-011/012: Oversharing Detection
- AI-022: DLP for AI-Generated Content

### Phase 3 (Medium - 60-90 days)
- AI-016: Input Validation
- AI-017: Output Filtering
- AI-018: Device Compliance CA
- AI-020: Bias Monitoring
- AI-024/025: Governance & Reporting

### Phase 4 (Strategic - 90-180 days)
- AI-019: Training Data Retention
- AI-021: Model Version Control
- AI-023: Model Explainability
- AI-026: Red Teaming
- AI-027: Privacy Impact Assessment

---

## Key References
- [Microsoft 365 Copilot Security](https://learn.microsoft.com/microsoft-365-copilot/microsoft-365-copilot-security)
- [Responsible AI Overview](https://learn.microsoft.com/azure/machine-learning/concept-responsible-ai)
- [DLP Policies for AI](https://learn.microsoft.com/microsoft-365/compliance/dlp-overview)
- [Azure Content Moderator](https://learn.microsoft.com/azure/cognitive-services/content-moderator/overview)
- [Zero Trust Assessment Demo](https://aka.ms/zerotrust/demo)
- [AI Governance Framework](https://learn.microsoft.com/azure/machine-learning/concept-responsible-ai)

