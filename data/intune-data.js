// ============================================================
// Microsoft Intune Insights & Security Assessment
// Graph API: GET /deviceManagement/managedDevices,
//            GET /deviceManagement/deviceCompliancePolicies,
//            GET /deviceManagement/deviceConfigurations
// ============================================================

export const INTUNE_SUMMARY = {
  totalManagedDevices: 847,
  activeDevices: 821,
  inactiveDevices: 26,
  nonCompliant: 15,
  unmanaged: 34,
  corporateDevices: 620,
  byodDevices: 227,
  deviceHealthScore: 74,
  compliancePercentage: 98.2,
  encryptionCoverage: 95.7,
  patchCompliance: 87.4,
  endpointProtection: 94.2,
}

export const PLATFORM_DISTRIBUTION = {
  windows: { count: 512, percentage: 60.4, compliant: 498, nonCompliant: 14 },
  macos: { count: 187, percentage: 22.1, compliant: 186, nonCompliant: 1 },
  ios: { count: 92, percentage: 10.9, compliant: 91, nonCompliant: 1 },
  android: { count: 42, percentage: 5.0, compliant: 40, nonCompliant: 2 },
  linux: { count: 14, percentage: 1.6, compliant: 14, nonCompliant: 0 },
}

export const DEVICE_COMPLIANCE_POLICIES = [
  { id: 'policy-001', name: 'Windows 11 Standard', assignedDevices: 512, compliant: 498, nonCompliant: 14, pending: 0, coverage: 100 },
  { id: 'policy-002', name: 'macOS Security Policy', assignedDevices: 187, compliant: 186, nonCompliant: 1, pending: 0, coverage: 100 },
  { id: 'policy-003', name: 'iOS Device Policy', assignedDevices: 92, compliant: 91, nonCompliant: 1, pending: 0, coverage: 100 },
  { id: 'policy-004', name: 'Android Security Policy', assignedDevices: 42, compliant: 40, nonCompliant: 2, pending: 0, coverage: 100 },
]

export const DEVICE_INVENTORY = [
  { id: 'DEV-001', name: 'LAPTOP-CHEN-001', type: 'Windows', manufacturer: 'Dell', model: 'XPS 13', osVersion: '23H2', lastSync: '2 hours ago', owner: 'Chen Wei', compliance: 'compliant', encryption: true, patched: true, riskLevel: 'low' },
  { id: 'DEV-002', name: 'LAPTOP-AISHA-001', type: 'macOS', manufacturer: 'Apple', model: 'MacBook Pro 16', osVersion: '14.5', lastSync: '1 hour ago', owner: 'Aisha Raza', compliance: 'compliant', encryption: true, patched: true, riskLevel: 'low' },
  { id: 'DEV-003', name: 'SURFACE-PRIYA-001', type: 'Windows', manufacturer: 'Microsoft', model: 'Surface Laptop 5', osVersion: '22H2', lastSync: '45 min ago', owner: 'Priya Kumar', compliance: 'non-compliant', encryption: false, patched: false, riskLevel: 'high' },
  { id: 'DEV-004', name: 'IPHONE-USER-045', type: 'iOS', manufacturer: 'Apple', model: 'iPhone 15 Pro', osVersion: '17.5', lastSync: 'Today', owner: 'BYOD User', compliance: 'compliant', encryption: true, patched: true, riskLevel: 'low' },
  { id: 'DEV-005', name: 'ANDROID-USER-023', type: 'Android', manufacturer: 'Samsung', model: 'Galaxy S24', osVersion: '14', lastSync: '3 days ago', owner: 'BYOD User', compliance: 'non-compliant', encryption: true, patched: false, riskLevel: 'medium' },
  { id: 'DEV-006', name: 'LAPTOP-UNUSED-001', type: 'Windows', manufacturer: 'HP', model: 'EliteBook 850', osVersion: '21H2', lastSync: '45 days ago', owner: 'Former Employee', compliance: 'non-compliant', encryption: false, patched: false, riskLevel: 'critical' },
  { id: 'DEV-007', name: 'MAC-CONTRACTOR-001', type: 'macOS', manufacturer: 'Apple', model: 'MacBook Air M2', osVersion: '13.4', lastSync: '120 days ago', owner: 'Contractor', compliance: 'non-compliant', encryption: true, patched: false, riskLevel: 'critical' },
  { id: 'DEV-008', name: 'SURFACE-GO-LAB-001', type: 'Windows', manufacturer: 'Microsoft', model: 'Surface Go 3', osVersion: '22H2', lastSync: '6 hours ago', owner: 'Lab', compliance: 'compliant', encryption: true, patched: true, riskLevel: 'low' },
]

export const ENDPOINT_SECURITY_ASSESSMENT = {
  antivirus: {
    defenderEnabled: 821,
    defenderDisabled: 26,
    realTimeProtection: 819,
    cloudProtection: 815,
    coverage: 96.9,
  },
  firewall: {
    enabled: 812,
    disabled: 35,
    coverage: 95.9,
  },
  asr: {
    enabled: 587,
    disabled: 260,
    coverage: 69.3,
    rulesDeployed: ['Block execution of potentially obfuscated scripts', 'Block Office apps from creating child processes', 'Block Office apps from injecting code', 'Block JavaScript or VBScript from launching downloaded executable content'],
    rulesMissing: ['Block Office communication application from creating child processes', 'Block creation of executable content', 'Use advanced protection against ransomware'],
  },
  smartscreen: {
    enabled: 701,
    disabled: 146,
    coverage: 82.8,
  },
  deviceControl: {
    usbRestricted: 412,
    usbUnrestricted: 435,
    removableMediaRestricted: 398,
    removableMediaUnrestricted: 449,
  },
  bitlocker: {
    enabled: 801,
    disabled: 46,
    encryptionErrors: 3,
    coverage: 94.6,
  },
}

export const PATCH_MANAGEMENT = {
  criticalUpdatesMissing: 23,
  securityUpdatesMissing: 58,
  qualityUpdatesMissing: 142,
  compliancePercentage: 87.4,
  avgDaysBehind: 8,
  devices: [
    { name: 'LAPTOP-UNUSED-001', missingUpdates: 47, daysBehind: 92, severity: 'critical' },
    { name: 'MAC-CONTRACTOR-001', missingUpdates: 23, daysBehind: 120, severity: 'critical' },
    { name: 'SURFACE-PRIYA-001', missingUpdates: 12, daysBehind: 15, severity: 'high' },
    { name: 'ANDROID-USER-023', missingUpdates: 5, daysBehind: 60, severity: 'high' },
  ],
}

export const APPLICATION_INVENTORY = [
  { id: 'app-001', name: 'Microsoft Office 365', deployedDevices: 847, outdated: 0, unauthorized: 0, status: 'compliant' },
  { id: 'app-002', name: 'Microsoft Teams', deployedDevices: 821, outdated: 8, unauthorized: 0, status: 'warning' },
  { id: 'app-003', name: 'Microsoft Defender', deployedDevices: 821, outdated: 0, unauthorized: 0, status: 'compliant' },
  { id: 'app-004', name: 'Adobe Creative Cloud', deployedDevices: 234, outdated: 12, unauthorized: 3, status: 'warning' },
  { id: 'app-005', name: 'VLC Media Player', deployedDevices: 15, outdated: 0, unauthorized: 15, status: 'risk' },
  { id: 'app-006', name: 'Slack', deployedDevices: 412, outdated: 0, unauthorized: 12, status: 'warning' },
]

export const DEVICE_RISK_ASSESSMENT = [
  { deviceId: 'DEV-003', deviceName: 'SURFACE-PRIYA-001', riskScore: 78, severity: 'high', risks: ['Missing encryption', 'Unpatched OS', 'Non-compliant'], owner: 'Priya Kumar' },
  { deviceId: 'DEV-006', deviceName: 'LAPTOP-UNUSED-001', riskScore: 95, severity: 'critical', risks: ['Not synced 45 days', 'Missing 47 updates', 'No BitLocker', 'Non-compliant'], owner: 'Former Employee' },
  { deviceId: 'DEV-007', deviceName: 'MAC-CONTRACTOR-001', riskScore: 92, severity: 'critical', risks: ['Not synced 120 days', 'Missing 23 updates', 'Non-compliant'], owner: 'Contractor' },
  { deviceId: 'DEV-005', deviceName: 'ANDROID-USER-023', riskScore: 62, severity: 'medium', risks: ['Missing 5 updates', 'Non-compliant', '60 days inactive'], owner: 'BYOD User' },
]

export const CONDITIONAL_ACCESS_POLICIES = [
  { id: 'ca-001', name: 'Require Compliant Device - All Users', enabled: true, enforcedDevices: 821, nonCompliantBlocked: 26, coverage: 96.9 },
  { id: 'ca-002', name: 'Block Unmanaged Devices', enabled: true, blockedDevices: 34, coverage: 100 },
  { id: 'ca-003', name: 'Require MFA + Compliant Device', enabled: true, enforcedDevices: 621, coverage: 73.3 },
  { id: 'ca-004', name: 'Require Hybrid Joined Devices', enabled: false, coverage: 0 },
]

export const CONFIGURATION_POLICIES = [
  { id: 'config-001', name: 'Windows 11 Security Baseline', assigned: 512, compliant: 498, nonCompliant: 14, conflicts: 0 },
  { id: 'config-002', name: 'Microsoft Defender Configuration', assigned: 821, compliant: 815, nonCompliant: 6, conflicts: 2 },
  { id: 'config-003', name: 'Password Policy - 14 Characters', assigned: 847, compliant: 789, nonCompliant: 58, conflicts: 1 },
  { id: 'config-004', name: 'Browser Security Policy', assigned: 621, compliant: 601, nonCompliant: 20, conflicts: 0 },
]

export const SECURITY_BASELINE_COMPARISON = {
  windowsBaseline: { compliant: 498, partiallyCompliant: 12, nonCompliant: 2, score: 96 },
  defenderBaseline: { compliant: 815, partiallyCompliant: 4, nonCompliant: 2, score: 99 },
  edgeBaseline: { compliant: 456, partiallyCompliant: 45, nonCompliant: 34, score: 87 },
  msAppsBaseline: { compliant: 821, partiallyCompliant: 18, nonCompliant: 8, score: 98 },
}

export const DEVICE_HEALTH_CALCULATION = [
  { deviceId: 'DEV-001', name: 'LAPTOP-CHEN-001', encryptionScore: 100, complianceScore: 100, patchScore: 95, epScore: 98, healthScore: 98, riskLevel: 'low' },
  { deviceId: 'DEV-002', name: 'LAPTOP-AISHA-001', encryptionScore: 100, complianceScore: 100, patchScore: 98, epScore: 96, healthScore: 98, riskLevel: 'low' },
  { deviceId: 'DEV-003', name: 'SURFACE-PRIYA-001', encryptionScore: 0, complianceScore: 45, patchScore: 32, epScore: 78, healthScore: 39, riskLevel: 'high' },
  { deviceId: 'DEV-006', name: 'LAPTOP-UNUSED-001', encryptionScore: 0, complianceScore: 20, patchScore: 5, epScore: 45, healthScore: 17, riskLevel: 'critical' },
]

export const INTUNE_RECOMMENDATIONS = [
  { id: 'rec-001', priority: 'critical', title: 'Enable BitLocker on SURFACE-PRIYA-001', category: 'Encryption', impact: 'Security', effort: 'low', status: 'open' },
  { id: 'rec-002', priority: 'critical', title: 'Decommission LAPTOP-UNUSED-001 (45 days inactive)', category: 'Lifecycle', impact: 'Risk', effort: 'low', status: 'open' },
  { id: 'rec-003', priority: 'critical', title: 'Patch 23 devices with critical updates', category: 'Patching', impact: 'Security', effort: 'medium', status: 'open' },
  { id: 'rec-004', priority: 'high', title: 'Deploy ASR rules to 260 devices', category: 'Endpoint Protection', impact: 'Security', effort: 'high', status: 'open' },
  { id: 'rec-005', priority: 'high', title: 'Enable SmartScreen on 146 devices', category: 'Endpoint Protection', impact: 'Security', effort: 'low', status: 'open' },
  { id: 'rec-006', priority: 'high', title: 'Assign compliance policy to 34 unmanaged devices', category: 'Compliance', impact: 'Governance', effort: 'low', status: 'open' },
  { id: 'rec-007', priority: 'medium', title: 'Update Teams app on 8 devices', category: 'App Management', impact: 'Stability', effort: 'low', status: 'open' },
  { id: 'rec-008', priority: 'medium', title: 'Review and remove 15 unauthorized applications', category: 'App Management', impact: 'Security', effort: 'medium', status: 'open' },
  { id: 'rec-009', priority: 'medium', title: 'Create Fast update ring for 200 pilot devices', category: 'Patching', impact: 'Testing', effort: 'high', status: 'open' },
  { id: 'rec-010', priority: 'medium', title: 'Enforce Hybrid Join for corporate devices', category: 'Device Management', impact: 'Security', effort: 'high', status: 'open' },
]

export const INTUNE_COPILOT_KB = [
  { keywords: ['device health', 'health score', 'device posture'],
    response: `**Device Health Assessment — Tenant Overview**\n\n📊 **Overall Health Score: 74/100** (Good)\n\n**Breakdown by component:**\n- Encryption: 95.7% ✅ (Excellent)\n- Compliance: 98.2% ✅ (Excellent)\n- Patching: 87.4% ⚠️ (Good, target 95%)\n- Endpoint Protection: 94.2% ✅ (Excellent)\n\n**At-Risk Devices (3 critical):**\n1. LAPTOP-UNUSED-001 — Health 17/100 (inactive 45 days)\n2. MAC-CONTRACTOR-001 — Health 18/100 (inactive 120 days)\n3. SURFACE-PRIYA-001 — Health 39/100 (unencrypted, unpatched)\n\n**Immediate actions:**\n1. Decommission inactive devices\n2. Patch SURFACE-PRIYA-001 (12 missing updates)\n3. Enable BitLocker on 46 unencrypted Windows devices\n\n→ Navigate to **Intune → Device Health** for detailed per-device scores.` },
  { keywords: ['patch', 'update', 'windows update', 'security update'],
    response: `**Patch Management Status — Update Rings**\n\n⚠️ **87.4% devices patched** (target: 95%+)\n\n**Outstanding updates:**\n- Critical: 23 devices (avg 3 days behind)\n- Security: 58 devices (avg 8 days behind)\n- Quality: 142 devices (avg 12 days behind)\n\n**Highest-risk devices:**\n1. LAPTOP-UNUSED-001 — 47 updates missing (92 days behind)\n2. MAC-CONTRACTOR-001 — 23 updates missing (120 days behind)\n3. SURFACE-PRIYA-001 — 12 updates missing (15 days behind)\n\n**Recommendation:**\n1. Create Fast ring (1 week): 200 pilot devices\n2. Create Broad ring (2 weeks): 400 standard devices\n3. Create Final ring (4 weeks): 247 conservative users\n4. Force sync on high-risk devices\n\n→ **Intune → Patch Management** to review update rings and create deployment schedule.` },
  { keywords: ['bitlocker', 'encryption', 'device encryption'],
    response: `**Device Encryption Status — BitLocker & Full Disk Encryption**\n\n✅ **95.7% encryption coverage** (847 / 847 devices)\n- Windows encrypted: 801 / 512 (96.3%)\n- macOS encrypted: 187 / 187 (100%) ✓\n- iOS encrypted: 92 / 92 (100%) ✓\n- Android encrypted: 40 / 42 (95.2%)\n\n❌ **46 Windows devices unencrypted:**\n1. SURFACE-PRIYA-001 — No BitLocker\n2. LAPTOP-UNUSED-001 — Not synced (encryption policy may not have applied)\n3. 44 other devices pending BitLocker deployment\n\n**Encryption errors: 3 devices**\n- Failed to escrow recovery keys to Entra ID\n\n**Recommended actions:**\n1. Force BitLocker deployment on 46 unencrypted devices\n2. Troubleshoot 3 devices with escrow errors\n3. Review recovery key escrow process\n\n→ **Intune → Endpoint Security → Encryption** for BitLocker management.` },
  { keywords: ['attack surface reduction', 'asr', 'endpoint protection'],
    response: `**Attack Surface Reduction (ASR) Deployment Status**\n\n📊 **Coverage: 69.3%** (587 of 847 devices)\n\n**Currently deployed (4 rules):**\n✓ Block execution of potentially obfuscated scripts\n✓ Block Office apps from creating child processes\n✓ Block Office apps from injecting code\n✓ Block JavaScript or VBScript from launching downloaded executable content\n\n**Missing critical rules (260 devices not covered):**\n❌ Block Office communication app from creating child processes\n❌ Block creation of executable content\n❌ Use advanced protection against ransomware\n\n**High-priority devices without ASR:**\n- SURFACE-PRIYA-001, LAPTOP-UNUSED-001, and 258 others\n\n**Recommended actions:**\n1. Deploy all 7 ASR rules to remaining 260 devices\n2. Monitor for application compatibility issues (2-week rollout)\n3. Enable ransomware protection rule on high-risk devices\n\n→ **Intune → Endpoint Security → Attack Surface Reduction** to deploy rules.` },
  { keywords: ['compliance', 'non-compliant', 'device compliance'],
    response: `**Device Compliance Status — Policy Assessment**\n\n✅ **98.2% compliant** (821 of 847 devices)\n\n**Non-compliant devices (26 total):**\n- Windows: 14 non-compliant (512 total)\n- macOS: 1 non-compliant (187 total)\n- iOS: 1 non-compliant (92 total)\n- Android: 2 non-compliant (42 total)\n- Linux: 0 non-compliant (14 total)\n\n**Common compliance failures:**\n1. Missing encryption (SURFACE-PRIYA-001)\n2. Missing security updates (LAPTOP-UNUSED-001, MAC-CONTRACTOR-001)\n3. Missing firewall configuration (5 devices)\n4. Password policy violation (ANDROID-USER-023)\n\n**Unmanaged devices: 34** (not assigned compliance policy)\n\n**Recommended actions:**\n1. Assign compliance policies to 34 unmanaged devices\n2. Force remediation on SURFACE-PRIYA-001 (enable BitLocker)\n3. Review 5 devices with firewall configuration issues\n4. Force password reset on ANDROID-USER-023\n\n→ **Intune → Device Compliance** for policy assignment.` },
  { keywords: ['risk', 'risky device', 'high risk', 'critical risk'],
    response: `**Device Risk Assessment — Critical & High-Risk Devices**\n\n🔴 **Critical Risk (2 devices):**\n1. LAPTOP-UNUSED-001 (Risk Score: 95/100)\n   - Not synced: 45 days\n   - Missing 47 updates (92 days behind)\n   - No BitLocker\n   - Non-compliant\n   → **Action:** Decommission or force compliance\n\n2. MAC-CONTRACTOR-001 (Risk Score: 92/100)\n   - Not synced: 120 days\n   - Missing 23 updates\n   - Non-compliant\n   → **Action:** Decommission contractor device\n\n🟠 **High Risk (1 device):**\n1. SURFACE-PRIYA-001 (Risk Score: 78/100)\n   - Missing encryption\n   - Missing 12 updates\n   - Non-compliant\n   → **Action:** Enable BitLocker + force patch\n\n🟡 **Medium Risk (1 device):**\n1. ANDROID-USER-023 (Risk Score: 62/100)\n   - Missing 5 updates\n   - Non-compliant\n   - Inactive 60 days\n   → **Action:** Force update + sync\n\n→ **Intune → Risk Assessment** for full risk scoring matrix.` },
  { keywords: ['application', 'app management', 'shadow it'],
    response: `**Application Inventory & Management**\n\n📱 **Total applications tracked: 6**\n\n**Compliant applications (3):**\n✓ Microsoft Office 365 — 847 devices\n✓ Microsoft Defender — 821 devices\n✓ Microsoft Teams — 821 devices (8 outdated)\n\n**Applications with issues (3):**\n⚠️ Adobe Creative Cloud — 234 devices (12 outdated, 3 unauthorized)\n⚠️ Slack — 412 devices (12 unauthorized installations)\n🔴 VLC Media Player — 15 devices (ALL unauthorized)\n\n**Unauthorized app summary:**\n- Total unauthorized installations: 30\n- Highest-risk: VLC Media Player (15 instances)\n\n**Recommended actions:**\n1. Remove all 15 VLC instances from BYOD devices\n2. Review 12 unauthorized Slack installations\n3. Update Adobe Creative Cloud on 12 devices\n4. Create app deployment policy for standardization\n5. Implement app allow-list for corporate devices\n\n→ **Intune → App Management** to view full app catalog and create policies.` },
  { keywords: ['defender', 'antivirus', 'endpoint detection'],
    response: `**Microsoft Defender & Antivirus Coverage**\n\n✅ **Defender Status: 96.9% coverage**\n\n**Enabled:**\n- 821 devices with Defender enabled\n- Real-time protection: 819 devices\n- Cloud protection: 815 devices\n\n**Disabled:**\n- 26 devices without Defender\n\n**Defender configuration status:**\n- Cloud protection enabled: 815 / 821 (99.3%)\n- Real-time scanning enabled: 819 / 821 (99.8%)\n- Signature updates: 98.7% current\n\n**Recent threats detected:**\n- Last 30 days: 3 malware detections (2 quarantined, 1 remediated)\n- False positives: 1\n\n**Recommended actions:**\n1. Enable Defender on 26 non-compliant devices\n2. Enable cloud protection on 6 devices\n3. Monitor 1 device with real-time protection disabled\n4. Review false positive from last week\n\n→ **Intune → Endpoint Security → Antivirus** for detailed Defender policy configuration.` },
  { keywords: ['firewall', 'windows defender firewall'],
    response: `**Windows Firewall & Network Security**\n\n✅ **95.9% firewall coverage** (812 of 847 devices)\n\n**Status:**\n- Enabled: 812 devices\n- Disabled: 35 devices (4.1%)\n\n**Disabled firewall breakdown:**\n- Windows: 28 devices (all non-compliant)\n- macOS: 4 devices\n- Linux: 3 devices\n\n**Risk assessment:**\n- Devices with firewall disabled + not behind Conditional Access: 12\n- Devices with firewall disabled + missing updates: 18\n\n**Recommended actions:**\n1. Enable firewall on 35 devices\n2. Investigate why 28 Windows devices have firewall disabled\n3. Review 12 high-risk devices without firewall + no CA coverage\n4. Deploy firewall policy to all Windows devices\n\n→ **Intune → Endpoint Security → Windows Firewall** to configure policy.` },
]
