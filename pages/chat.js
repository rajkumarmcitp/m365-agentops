import { state } from '../app.js'

const SUGGESTIONS = {
  user: ['What can I request?', 'How to create a Team?', 'Request SharePoint access', 'Request Copilot license'],
  manager: ['Approve pending requests', 'Guest access policy', 'How to request a shared mailbox?', 'License request process'],
  admin: ['M365 Config failures', 'Risky users summary', 'Zero Trust gaps', 'Portal service status'],
  super: ['Graph API status', 'All service workflows', 'Failed CIS controls', 'Guest lifecycle policy'],
}

// ============================================================
// Knowledge base — keyword → response
// ============================================================
const KB = [
  // ---- Admin / Security ----
  {
    keywords: ['m365 config', 'cis', 'benchmark', 'compliance score'],
    response: `**M365 Config — CIS Benchmark v7.0.0**\n\nYour tenant scores **78%** across 96 controls. Current failures:\n\n- **1.1.4** Security Defaults conflict with CA policies\n- **1.3.6** No Teams DLP policy configured\n- **2.1.3** Safe Attachments not covering all users\n- **2.4.5** Secure Score recommended actions not reviewed\n- **3.2.3** Teams DLP policy missing\n- **5.2.2.5** Device compliance CA excludes 12 users\n\nNavigate to **M365 Config** → select any topic → view remediation guidance.`,
  },
  {
    keywords: ['risky user', 'risk detection', 'risky sign'],
    response: `**Risky Users — 3 Active Detections**\n\n1. **Kevin Osei** (kevin.osei@contoso.com) — **High risk** — sign-in from unknown location (14 min ago)\n2. **Nina Patel** (nina.patel@contoso.com) — **Medium risk** — anomalous activity pattern\n3. **Sara Ogden** (sara.ogden@contoso.com) — **Medium risk** — inactive account activity\n\n**Recommended actions:** Force password reset for Kevin Osei immediately. Review all three accounts in the **Security** page.`,
  },
  {
    keywords: ['zero trust', 'zt', 'pillars'],
    response: `**Zero Trust Score — 7/12 controls passed**\n\n❌ **Identity:** Legacy auth block policy missing (FAILED)\n⚠️ **Identity:** MFA coverage 87% (target 100%) — WARNING\n❌ **Device:** No device risk-based CA policy (FAILED)\n⚠️ **Device:** Android compliance policy missing — WARNING\n⚠️ **Priv. Access:** 4 permanent Global Admin assignments — WARNING\n✅ **Guest Governance:** All controls passed\n\nTop priority: Block legacy authentication via Conditional Access → navigate to **Zero Trust** for full details.`,
  },
  {
    keywords: ['approval', 'approve', 'pending approv'],
    response: `**Pending Approvals**\n\nCurrently awaiting action:\n- **REQ-001** Distribution Group — Priya Kumar (2h SLA remaining)\n- **REQ-003** MFA Reset — James Liu (**OVERDUE** — immediate action needed)\n- **REQ-006** SharePoint Access — Sara Ogden (3h SLA)\n\nNavigate to **Pending Approvals** to action these requests. Overdue requests affect your SLA metrics.`,
  },
  {
    keywords: ['license', 'e3', 'e5', 'power bi', 'visio', 'copilot license'],
    response: `**License Management**\n\nCurrent capacity:\n| License | Total | Used | Available |\n|---|---|---|---|\n| M365 E3 | 600 | 581 | 19 |\n| **M365 E5** | 150 | 148 | **2 ⚠️** |\n| Exchange P1 | 100 | 72 | 28 |\n| Power BI Pro | 100 | 38 | 62 |\n\n**To request a license:** Portal → License Management → select the license type → submit.\n**Approval path:** Manager → IT → AI Agent validation → automatic assignment via Graph API.`,
  },

  // ---- Exchange Online ----
  {
    keywords: ['distribution group', 'create group', 'dg ', 'mail group'],
    response: `**Distribution Groups — How to Request**\n\nNavigate to **Portal → Exchange Online → Distribution & Security Groups**\n\n**You can request:**\n- Create Distribution Group (email list, manager approval)\n- Add/remove members\n- Rename or delete a group\n- Create Mail-Enabled Security Group (email + access control, admin approval)\n- Create M365 Group (collaboration + email, manager → IT approval)\n\n**Approval path:** Manager Approval → IT Review (for security groups) → **AI Agent checks:**\n- Duplicate group detection\n- Suggests existing groups with similar purpose\n- Validates naming convention\n- Checks group quota\n\n**Provisioning:** Microsoft Graph API POST /v1.0/groups`,
  },
  {
    keywords: ['security group', 'sg ', 'mail-enabled', 'mesg', 'mail enabled security'],
    response: `**Mail-Enabled Security Groups & Security Groups**\n\nPortal → Exchange Online → Distribution & Security Groups\n\n**Mail-Enabled Security Group (MESG):**\n- Email distribution + resource access control\n- **Approval:** Manager → IT (required — security implications)\n- AI Agent checks: duplicate detection, resource scope review, naming convention\n- Provisioning: POST /v1.0/groups (securityEnabled + mailEnabled)\n\n**Security Group (no email):**\n- Access control only (SharePoint, Teams, resources)\n- **Approval:** Manager → IT\n- AI Agent: reviews intended resource access, checks for similar groups\n\n**Note:** All changes are logged in the membership audit trail.`,
  },
  {
    keywords: ['shared mailbox', 'shared mail', 'mailbox permission'],
    response: `**Shared Mailboxes**\n\nPortal → Exchange Online → Shared Mailboxes\n\n**Available actions:**\n- ✅ Create shared mailbox (admin approval)\n- ✅ Delete shared mailbox\n- ✅ Add Full Access, Send As, or Send on Behalf permissions\n- ✅ Remove permissions\n\n**Approval path:** Manager → IT → AI Agent → Exchange PowerShell\n\n**AI Agent validates:**\n- Duplicate mailbox check\n- License availability\n- Naming convention compliance\n- Current permission state\n\n**Note:** Shared mailboxes don't require separate licenses up to 50 GB.`,
  },
  {
    keywords: ['room mailbox', 'equipment mailbox', 'meeting room', 'room booking', 'resource mailbox'],
    response: `**Room & Equipment Mailboxes**\n\nPortal → Exchange Online → Room & Equipment Mailboxes\n\n**You can request:**\n- Create a room mailbox (with capacity, location, booking policy)\n- Create equipment mailbox (projectors, AV equipment, fleet)\n- Modify booking policies (auto-accept, max duration, advance window)\n- Add/remove delegates for booking management\n- Remove a resource mailbox\n\n**Approval:** Manager → IT\n**AI Agent checks:** duplicate names, capacity validation, location verification\n**Provisioning:** New-Mailbox -Room or -Equipment via Exchange PowerShell`,
  },
  {
    keywords: ['smtp', 'mail forwarding', 'forward email', 'auto reply', 'out of office', 'email alias'],
    response: `**Email Services**\n\nPortal → Exchange Online → Email Services\n\n**Available requests:**\n1. **SMTP Address Change** — Change primary email address\n   - Approval: Manager → IT\n   - AI checks: address availability, existing references\n   \n2. **Mail Forwarding** — Forward mailbox to another address\n   - Approval: Manager → IT (flags if forwarding to external domain)\n   - AI checks: external forwarding policy, destination validity\n   \n3. **Auto Reply** — Configure out-of-office messages\n   - Approval: Manager only\n   - Options: internal-only or internal+external, with date range\n\nAll email service changes are audited in Exchange Online.`,
  },

  // ---- Teams ----
  {
    keywords: ['create team', 'new team', 'teams team', 'microsoft teams'],
    response: `**Microsoft Teams — Service Requests**\n\nPortal → Microsoft Teams\n\n**You can request:**\n- **Create Team** — private or public, with template options\n- **Add/Remove Members** — member or owner role\n- **Create Channel** — standard, private, or shared\n- **Guest Access** — invite external users to a team\n\n**Approval path:** Manager approval\n**AI Agent checks:** duplicate team detection, suggests existing teams, validates naming, checks M365 group quota\n**Provisioning:** Microsoft Graph API POST /v1.0/teams\n\n**Tip:** Private teams require membership to view content. Public teams are visible to everyone in your org.`,
  },
  {
    keywords: ['teams guest', 'external team member', 'guest team'],
    response: `**Teams Guest Access Request**\n\nPortal → Microsoft Teams → Guest Access Requests\n\n**Requires:** Manager → IT approval (external users have elevated risk)\n\n**You'll need to provide:**\n- Guest email address(es)\n- Guest organisation name\n- Duration (30 days to 1 year)\n- Business justification\n\n**AI Agent checks:**\n- Guest domain not on block list\n- Teams guest policy enabled\n- Conditional Access guest sign-in policy active\n- Existing guest account check\n\n**Provisioning:** POST /v1.0/teams/{id}/members with guest account`,
  },

  // ---- SharePoint ----
  {
    keywords: ['sharepoint', 'spo', 'new site', 'request site', 'sharepoint access'],
    response: `**SharePoint Services**\n\nPortal → SharePoint Services\n\n**Available requests:**\n- **New Site** — team site, communication site, hub site\n- **Add Site Members/Owners** — specify permission level (Read/Contribute/Edit/Full Control)\n- **External Sharing** — requires Manager → Data Owner → IT approval\n- **Storage Increase** — request additional quota\n- **Site Deletion** — with content export option\n\n**Approval path:** Manager → IT (storage/external sharing also requires data owner)\n**AI Agent:** duplicate site check, storage quota validation, DLP policy review for external sharing\n**Provisioning:** SharePoint REST API + PnP PowerShell`,
  },
  {
    keywords: ['external sharing', 'sharepoint external', 'share with external', 'anyone link'],
    response: `**External Sharing Requests**\n\nPortal → SharePoint Services → Request External Sharing\n\n**Approval path:** Manager → **Data Owner** → IT (three-step approval)\n\n**AI Agent performs critical checks:**\n- Tenant external sharing policy compliance\n- Verifies domain not on blocked list\n- Data sensitivity classification\n- DLP policy applicability\n- Conditional Access for guest sign-in\n\n**Note:** External sharing of Confidential or Highly Confidential data requires additional security review. The AI Agent will flag this automatically.\n\nSee also: **External Sharing Requests** service (Portal) for guest invitations and domain-level enablement.`,
  },

  // ---- OneDrive ----
  {
    keywords: ['onedrive', 'one drive', 'storage', 'onedrive storage', 'former employee'],
    response: `**OneDrive Administration**\n\nPortal → OneDrive Administration\n\n**Available requests:**\n\n1. **Storage Increase**\n   - Approval: Manager → IT\n   - Options: 1TB (default), 2TB, 5TB, 10TB, 25TB\n   - AI checks current usage and tenant storage pool\n\n2. **Former Employee OneDrive Access**\n   - Approval: Manager → IT (GDPR considerations checked)\n   - Requires: manager relationship verification, legal hold check\n   - Duration: 7, 30, or 90 days (time-limited access)\n   - Reasons: business continuity, legal, data recovery, handover\n\n**Provisioning:** Set-SPOUser (SharePoint/OneDrive Admin PowerShell)`,
  },

  // ---- External Sharing ----
  {
    keywords: ['invite guest', 'guest user', 'external guest', 'guest invitation'],
    response: `**External Guest Invitations**\n\nPortal → External Sharing Requests → Invite External Guest\n\n**Required information:**\n- Guest email + full name + organisation\n- Access scope (which Teams/sites)\n- Internal sponsor (accountable contact)\n- Duration (30 days to 1 year)\n- Business justification\n\n**Approval path:** Manager → IT\n\n**AI Agent checks:**\n- Domain not on block list\n- No existing guest account for this email\n- Guest invitation policy compliant\n- Conditional Access guest MFA policy active\n\nSee also: **Guest User Lifecycle Management** (Portal) for quarterly reviews.`,
  },
  {
    keywords: ['extend guest', 'remove guest', 'guest access', 'guest lifecycle', 'quarterly review'],
    response: `**Guest User Lifecycle Management**\n\nPortal → Guest User Lifecycle Management\n\n**You can:**\n- **Invite Guest** — new external collaborator\n- **Extend Access** — renew expiring guest (Manager + Data Owner approval)\n- **Remove Guest** — revoke all access (Manager approval)\n- **Quarterly Access Review** — IT-initiated review of all active guests\n\n**AI Agent automatically:**\n- Lists all resources the guest has access to\n- Checks guest activity in last 30 days\n- Flags guests without active sponsors\n- Verifies inactive guests (60+ days) for removal\n\n**Best practice:** Set all guest accounts to expire after 1 year with a mandatory review.`,
  },

  // ---- User Access ----
  {
    keywords: ['user access', 'request access', 'access to', 'mailbox access', 'team access'],
    response: `**User Access Management**\n\nPortal → User Access Management\n\n**Request access to:**\n- **Shared Mailbox** — Full Access, Send As, Send on Behalf\n- **Teams** — Member or Owner role\n- **SharePoint Sites** — Read, Contribute, Edit\n- **Distribution Lists** — Subscribe or unsubscribe\n- **Security Groups** — membership for resource access\n\n**All requests:** Manager approval → AI Agent validates ownership and eligibility → automated provisioning\n\n**Tip:** If you need access to multiple related resources, submit a separate request for each. The AI Agent will check for efficiency and may suggest group-based access instead.`,
  },

  // ---- Copilot ----
  {
    keywords: ['copilot', 'm365 copilot', 'microsoft copilot', 'ai license', 'copilot request'],
    response: `**Microsoft 365 Copilot License Request**\n\nPortal → Microsoft Copilot → Request Copilot License\n\n**Requirements:**\n- Active M365 E3 or E5 base license (checked automatically)\n- Business justification and use case\n- Cost center code\n\n**Approval path:** Manager → IT (budget and license availability check)\n\n**AI Agent checks:**\n- Copilot license availability\n- M365 prerequisite license verified\n- Cost center budget validated\n\n**Cost:** Approximately £25-30/user/month — attach business justification.\n\n**Provisioning:** POST /v1.0/users/{id}/assignLicense with Microsoft 365 Copilot SKU`,
  },

  // ---- Power Platform ----
  {
    keywords: ['power platform', 'power automate', 'power apps', 'environment', 'premium connector', 'dlp exception'],
    response: `**Power Platform Services**\n\nPortal → Power Platform Services\n\n**Available requests:**\n1. **Create Environment** — Sandbox/Production/Developer (Manager → IT)\n2. **Premium Connector Access** — e.g. Salesforce, SAP, ServiceNow (Manager → IT)\n   - Requires: DLP policy review, data flow description\n3. **DLP Policy Exception** — (Manager → Data Owner → IT — highest approval)\n   - Risk mitigation plan required\n   - Time-limited (30 days to 1 year)\n4. **Power Automate License** — Premium per-user or per-flow (Manager)\n\n**AI Agent:** checks DLP policy coverage, connector risk classification, license availability\n\n**Note:** DLP exceptions are reviewed by the AI Agent for compliance risks.`,
  },

  // ---- Intune ----
  {
    keywords: ['intune', 'device retire', 'wipe device', 'device management', 'compliance exception', 'mdm'],
    response: `**Intune Device Services**\n\nPortal → Intune Services\n\n**Available requests:**\n1. **Retire Device** — removes corporate management, keeps personal data (Manager → IT)\n2. **Wipe Device** — full factory reset (IT approval only, irreversible)\n   ⚠️ Requires typing CONFIRM — this action cannot be undone\n3. **Compliance Exception** — temporary exclusion from compliance policy (Manager → IT)\n   - Max 90-day exceptions\n   - Compensating controls required\n   - AI Agent flags Zero Trust impact\n\n**AI Agent checks for wipe/retire:**\n- Verifies device ownership\n- Checks for unsynced data\n- Confirms user awareness\n- Reviews pending Intune actions\n\n**Provisioning:** Microsoft Graph Intune API`,
  },

  // ---- Security Command Center ----
  {
    keywords: ['secure score', 'security posture', 'security status', 'secure score trend'],
    response: `**Secure Score — 64/95 (67.4%)**\n\n🎯 **Your Tenant:** 64 points — **above industry average** (53 pts for similar-sized orgs)\n\n📊 **Trend:**\n- This week: +2 points ↗️\n- This month: +5 points ↗️\n- vs industry: +11 points ahead\n\n**Category breakdown:**\n- Identity: 68/100 ⚠️\n- Apps: 72/100 ✅\n- Data: 61/100 ⚠️\n- Devices: 58/100 🔴\n- Infrastructure: 54/100 🔴\n\n**Biggest wins:** Enable MFA (+15 pts) · Block legacy auth (+8 pts) · DMARC upgrade (+6 pts) = **+29 potential gain**\n\nNavigate to **Security → Secure Score** to see detailed recommendations.`,
  },
  {
    keywords: ['critical incident', 'active incident', 'ransomware', 'incident summary'],
    response: `**Active Security Incidents — 5 Total**\n\n🔴 **Critical (1):**\n- INC-2341: Ransomware indicators on MBX-LAPTOP-047 (3h ago)\n→ **ACTION:** Isolate device immediately!\n\n🔴 **High Severity (3):**\n- INC-2338: BEC (Business Email Compromise) attempt (6h ago)\n- INC-2335: Risky sign-in — kevin.osei@contoso.com (14h ago)\n- INC-2330: Suspicious auto-forwarding inbox rule (investigating)\n\n🟡 **Medium (1):** Brute force sign-in pattern (2 days ago)\n\n**AI Summary:** Multi-vector attack detected — ransomware + risky identity events + BEC attempt. Isolate endpoint, force password reset, review inbox rules immediately.\n\n→ Navigate to **Security → Incidents** for full details.`,
  },
  {
    keywords: ['email security', 'spf dkim dmarc', 'email protection', 'phishing'],
    response: `**Email Security Status**\n\n**Threats blocked (30 days):**\n- 1,834 phishing attempts ✅\n- 247 malware detections ✅\n- 3 BEC (Business Email Compromise) attempts 🔴\n- 4,782 messages quarantined ✅\n\n**Authentication records:**\n✅ SPF: Passing\n✅ DKIM: Enabled\n⚠️ DMARC: quarantine (upgrade to reject)\n✅ Safe Links: Active\n⚠️ Safe Attachments: Partial coverage\n\n**Active risks:**\n🔴 2 mailboxes with external forwarding\n⚠️ 1 suspicious inbox rule detected\n\n**Top action:** Disable external forwarding, upgrade DMARC to reject.\n\n→ **Security → Email** for detailed mail flow analysis.`,
  },
  {
    keywords: ['endpoint security', 'device compliance', 'vulnerable', 'patch management'],
    response: `**Endpoint Security Summary**\n\n📱 **847 managed devices**\n- 15 non-compliant\n- 8 vulnerable (missing patches)\n- 5 missing EDR\n\n**Protection coverage:**\n✅ Defender AV: 99.4%\n✅ BitLocker: 95.7% (36 devices unencrypted)\n⚠️ Tamper Protection: 94.8%\n\n**Active threats:**\n🔴 1 ransomware (MBX-LAPTOP-047)\n🟡 2 active threats\n\n**Critical actions:**\n1. Isolate MBX-LAPTOP-047 (ransomware)\n2. Patch 23 devices missing updates\n3. Enable BitLocker on 36 devices\n\n→ **Security → Endpoint** for device inventory.`,
  },
  {
    keywords: ['mfa', 'multi-factor', 'passwordless', 'fido2'],
    response: `**MFA Adoption — 87% Coverage**\n\n✅ 870 / 1,000 users registered\n❌ 130 users without MFA\n⏳ **Deadline:** 31 July 2026 (Microsoft enforcement)\n\n**Methods in use:**\n| Method | Count | Security |\n|---|---|---|\n| Microsoft Authenticator | 742 | 🟢 Strong |\n| SMS (legacy) | 120 | 🔴 Weak |\n| FIDO2 | 5 | 🟢 Phishing-resistant |\n| Certificate | 3 | 🟢 Phishing-resistant |\n\n**To reach 100%:** Contact 130 non-enrolled users by 31 July.\n\n**For phishing-resistant:** Migrate 120 SMS users to FIDO2.\n\n→ **Security → Identity** for detailed MFA breakdown.`,
  },
  {
    keywords: ['recommendation', 'best practice', 'security improvement', 'what to fix'],
    response: `**Top 5 Security Actions (Prioritized)**\n\n**Critical (do now):**\n1. Enable MFA for 130 unregistered users — **+15 pts**\n2. Isolate ransomware device (MBX-LAPTOP-047) — **CRITICAL**\n\n**High (this week):**\n3. Block legacy authentication via CA — **+8 pts**\n4. Upgrade DMARC to reject — **+6 pts**\n5. Enable Safe Attachments for all users — **+4 pts**\n\n**Total potential: +56 points** → would bring score to 80+ (excellent)\n\nFor all 15 recommendations with effort & API details:\n→ Navigate to **Security → Recommendations** tab.`,
  },
  {
    keywords: ['conditional access', 'ca policy', 'risk-based', 'access control'],
    response: `**Conditional Access — Policy Overview**\n\n✅ **25 policies enabled**\n⚠️ **5 disabled** | ⏳ **3 report-only mode**\n\n**Coverage: 94.6%** of sign-ins protected\n\n**Key active policies:**\n- ✅ Require MFA (all cloud apps)\n- ✅ Require MFA (privileged admins)\n- ✅ Block legacy authentication\n- ✅ Require compliant device\n- ✅ Risk-based sign-in protection\n\n**⚠️ 18 users explicitly excluded** — review quarterly\n\n**Risk:** 3 report-only policies may mask enforcement gaps\n\n→ **Security → Identity** for detailed policy breakdown.`,
  },

  // ---- Change Intelligence / Message Center ----
  {
    keywords: ['message center', 'change intelligence', 'mc ', 'service announcement', 'message centre'],
    response: `**Change Intelligence — M365 Message Center**\n\nNavigate to **Change Intelligence** (Admin section) to view:\n\n📬 **20 messages** synced from Graph /admin/serviceAnnouncement/messages\n⚠️ **8 require action** — 3 with high severity\n🔴 **3 high-priority items** need immediate attention:\n- MC892341: Teams legacy auth retirement (deadline 30 Jun)\n- MC890234: Entra ID mandatory admin MFA (deadline 15 Jun)\n- MC873210: E5 licence capacity critical (only 2 remaining)\n\n**Tabs available:** All Messages | Service Health | Action Required | Upcoming | Copilot | Licenses | Security\n\n**AI Agent features:** AI summary per message, recommended IT tasks, automation assessment, task creation, weekly digest generation.`,
  },
  {
    keywords: ['service health', 'incident', 'outage', 'service issue', 'service degradation'],
    response: `**Service Health — Current Status**\n\n🔴 **Exchange Online:** Email delivery delays (EU West) — fix being deployed\n🔴 **Microsoft Teams:** Meeting join failures EMEA — investigating\n🟡 **SharePoint Online:** Search indexing delay — advisory\n✅ **All other services:** Operational\n\n**Recently resolved (last 48h):**\n- Entra ID sign-in latency (US East) — resolved\n- M365 Admin Center intermittent errors — resolved\n\nNavigate to **Change Intelligence → Service Health** tab for full details and incident updates.\n\n*Graph API: GET /admin/serviceAnnouncement/issues*`,
  },
  {
    keywords: ['weekly digest', 'digest', 'executive summary', 'weekly update'],
    response: `**Generate Weekly Digest**\n\nIn **Change Intelligence**, click the **"Weekly digest"** button to generate a formatted summary:\n\n**This week's digest would show:**\n- 📊 Total: 20 messages, 8 action required, 3 major changes\n- 🆕 5 new messages since last week\n- 📅 4 items due within 30 days\n\n**Priority items:**\n1. Teams legacy auth — deadline 30 Jun (HIGH)\n2. Admin MFA enforcement — deadline 15 Jun (HIGH)\n3. E5 licence overage — immediate (HIGH)\n4. Exchange basic auth final phase — 15 Jul (HIGH)\n\nThe digest can be sent via **Teams**, **email**, or **exported as PDF** directly from the digest panel.`,
  },

  // ---- Portal general ----
  {
    keywords: ['portal', 'self service', 'what can i request', 'request options', 'service portal'],
    response: `**Self-Service Portal — 11 Services Available**\n\n| Service | Key Actions |\n|---|---|\n| Exchange Online | Groups, mailboxes, room resources, email settings |\n| Microsoft Teams | Create teams, channels, guest access |\n| SharePoint | Sites, permissions, external sharing |\n| OneDrive | Storage, former employee access |\n| External Sharing | Guest invites, extend/remove access |\n| User Access | Mailbox, Teams, SharePoint, group access |\n| License Management | E3/E5, Power BI, Visio, Project |\n| Microsoft Copilot | Request/remove Copilot licenses |\n| Power Platform | Environments, connectors, DLP exceptions |\n| Intune | Device retire, wipe, compliance exceptions |\n| Guest Lifecycle | Invite, extend, remove, quarterly review |\n\n**Navigate to Portal** → select a service → choose an action → complete the form → submit.`,
  },
  {
    keywords: ['workflow', 'approval workflow', 'approval process', 'how long', 'how does approval'],
    response: `**Approval & Provisioning Workflow**\n\nAll portal requests follow this standardised workflow:\n\n1. **User Request** — you submit the form with required details\n2. **Manager Approval** — your direct manager reviews (most requests)\n3. **IT Review** — required for security groups, site creation, and high-risk actions\n4. **Data Owner Approval** — required for external sharing requests\n5. **AI Agent Validation** — automatically checks:\n   - Duplicates & conflicts\n   - Licensing availability\n   - Naming conventions\n   - Security policy compliance\n   - Suggests alternatives if better options exist\n6. **System Provisioning** — Microsoft Graph API / Exchange / SharePoint\n7. **Completion Notification** — email sent to you and approvers\n\n**SLAs:** Standard: 24h, Urgent: 4h (mark urgent in justification field)`,
  },
  {
    keywords: ['ai agent', 'automation', 'graph api action', 'auto provision', 'automated'],
    response: `**AI Agent Capabilities**\n\nThe M365 AgentOps AI Agent automatically:\n\n✅ **Deduplication** — checks for existing groups, mailboxes, or sites with similar names\n✅ **Suggests alternatives** — recommends existing resources instead of creating new ones\n✅ **License verification** — confirms availability before assignment\n✅ **Provisioning** — executes all requests via Microsoft Graph API or Exchange/SharePoint PowerShell\n✅ **Security checks** — validates CA policies, DLP coverage, and guest policies\n✅ **Completion notifications** — emails you and your approvers at each stage\n✅ **Audit logging** — all actions recorded with timestamps and approver trail\n\nThe agent runs in the background — you'll receive email updates at each workflow stage.`,
  },
  {
    keywords: ['graph', 'graph api', 'api'],
    response: `**Graph API Status**\n\n🟢 **Connection:** Active\n📊 **Tenant:** contoso.com\n🔑 **App Registration:** M365 AgentOps Agent\n⚡ **Rate limit:** 6,000 requests remaining today (10,000/day limit)\n\n**Today's activity:**\n- 312 API calls made\n- 0 throttled\n- Last call: 8 minutes ago\n\n**Endpoints used by the portal:**\n- POST /v1.0/groups (group creation)\n- POST /v1.0/teams (team creation)\n- POST /v1.0/invitations (guest invites)\n- POST /v1.0/users/{id}/assignLicense\n\nFull details available in **Graph API** page (super admin only).`,
  },
]

const DEFAULT_RESPONSE = `I'm your **M365 AgentOps AI Copilot**. I can help you with:\n\n- 🔧 **Portal requests** — how to request groups, mailboxes, Teams, licenses, and more\n- 🔒 **Security** — CIS compliance, Zero Trust, risky users\n- 📊 **Tenant status** — licenses, pending approvals, audit events\n- 🤖 **AI Agent** — automation workflows and provisioning\n\nTry asking:\n- "How do I request a Distribution Group?"\n- "What's the Teams guest access workflow?"\n- "How do I request a Copilot license?"\n- "What are the M365 Config failures?"`

let messages = []
let initialized = false

export function initChat() {
  const el = document.getElementById('page-chat')
  if (!el) return

  const u = state.currentUser
  const sugs = SUGGESTIONS[u?.role] || SUGGESTIONS.user

  el.innerHTML = `
    <div class="page-header">
      <div>
        <div class="page-title"><i class="ti ti-message-circle"></i> AI Copilot</div>
        <div class="page-subtitle">Ask about your M365 tenant, services, approvals, and more</div>
      </div>
    </div>

    <div class="card" style="padding:0;overflow:hidden;display:flex;flex-direction:column;height:calc(100vh - 200px);min-height:400px">
      <div class="chat-messages" id="chat-messages"></div>
      <div class="chat-suggestions" id="chat-suggestions">
        ${sugs.map(s => `<button class="suggestion-pill" data-text="${s}">${s}</button>`).join('')}
      </div>
      <div class="chat-input-area">
        <textarea class="chat-input" id="chat-input" placeholder="Ask about the portal, services, approvals, M365 Config..." rows="1"></textarea>
        <button class="btn btn-primary" id="chat-send"><i class="ti ti-send"></i></button>
      </div>
    </div>
  `

  const msgArea = el.querySelector('#chat-messages')
  const input = el.querySelector('#chat-input')

  if (!initialized || messages.length === 0) {
    messages = []
    addMessage('ai', DEFAULT_RESPONSE)
    initialized = true
  } else {
    renderMessages(msgArea)
  }

  el.querySelector('#chat-send').addEventListener('click', () => sendMsg(el))
  input.addEventListener('keydown', e => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMsg(el) }
  })
  input.addEventListener('input', () => {
    input.style.height = 'auto'
    input.style.height = Math.min(input.scrollHeight, 120) + 'px'
  })

  el.querySelectorAll('.suggestion-pill').forEach(pill => {
    pill.addEventListener('click', () => {
      input.value = pill.dataset.text
      sendMsg(el)
    })
  })
}

function addMessage(role, text) {
  messages.push({ role, text, ts: new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }) })
}

function renderMessages(area) {
  area.innerHTML = messages.map(m => {
    const isAI = m.role === 'ai'
    const formatted = formatMarkdown(m.text)
    return `
      <div class="chat-msg ${isAI ? 'ai' : 'user-msg'}">
        ${isAI
          ? `<div class="chat-sender"><i class="ti ti-robot" style="color:var(--clr-teal-text)"></i> M365 Copilot · ${m.ts}</div>`
          : `<div class="chat-sender" style="justify-content:flex-end">${state.currentUser?.name || 'You'} · ${m.ts}</div>`
        }
        <div class="chat-bubble">${formatted}</div>
      </div>
    `
  }).join('')
  area.scrollTop = area.scrollHeight
}

function formatMarkdown(text) {
  return text
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/^#{1,3} (.+)$/gm, '<strong style="font-size:12px">$1</strong>')
    // tables
    .replace(/\|(.+)\|\n\|[-| ]+\|\n/g, (m) => {
      const headers = m.split('\n')[0].split('|').filter(c => c.trim()).map(h => `<th style="padding:4px 8px;font-size:10px">${h.trim()}</th>`).join('')
      return `<table style="width:100%;border-collapse:collapse;font-size:11px;margin:6px 0"><thead><tr>${headers}</tr></thead><tbody>`
    })
    .replace(/\|(.+)\|(?!\n\|[-|])/g, (m) => {
      const cells = m.split('|').filter(c => c.trim()).map(c => `<td style="padding:3px 8px;border-top:1px solid var(--color-border-tertiary)">${c.trim()}</td>`).join('')
      return `<tr>${cells}</tr>`
    })
    .replace(/<\/tbody>(?![\s\S]*<\/tbody>)/g, '</tbody></table>')
    .replace(/\n/g, '<br>')
    .replace(/❌/g, '<span style="color:var(--clr-danger-text)">❌</span>')
    .replace(/✅/g, '<span style="color:var(--clr-success-text)">✅</span>')
    .replace(/⚠️/g, '<span style="color:var(--clr-warning-text)">⚠️</span>')
    .replace(/🟢/g, '<span style="color:var(--clr-success-text)">●</span>')
}

function sendMsg(el) {
  const input = el.querySelector('#chat-input')
  const text = input.value.trim()
  if (!text) return

  addMessage('user', text)
  input.value = ''
  input.style.height = 'auto'

  const msgArea = el.querySelector('#chat-messages')
  renderMessages(msgArea)

  setTimeout(() => {
    const q = text.toLowerCase()
    const match = KB.find(r => r.keywords.some(k => q.includes(k)))
    const response = match?.response || generateFallback(q)
    addMessage('ai', response)
    renderMessages(msgArea)
  }, 500)
}

function generateFallback(q) {
  if (q.includes('help') || q.includes('what') || q.includes('how'))
    return `I'm here to help! I can answer questions about:\n\n- **Portal requests** (groups, mailboxes, Teams, SharePoint, licenses, guests)\n- **Approval workflows** and SLAs\n- **AI Agent** automation and Graph API provisioning\n- **M365 Config** CIS benchmark results\n- **Security** posture, Zero Trust, risky users\n\nTry a more specific question, e.g. "How do I create a Teams channel?" or "What's the approval process for a Copilot license?"`

  return `I searched the knowledge base for **"${q}"** but didn't find a specific answer. Here are some things I can help with:\n\n- Portal service requests (11 services available)\n- Approval workflows and provisioning steps\n- CIS benchmark compliance status\n- License availability and requests\n- Guest access policies\n\nTry rephrasing your question or ask about a specific service name.`
}
