# Device Pillar - Zero Trust Validation Controls
## Based on Microsoft Zero Trust Assessment Framework

This document outlines critical validation controls for the Device Security pillar based on Microsoft's official Zero Trust Assessment tool.

---

## A. MDM ENROLLMENT & MANAGEMENT

### 1. **Windows Automatic Device Enrollment**
- **ID:** DEV-006
- **Priority:** Critical
- **Risk Level:** Critical
- **Validation:** Windows automatic device enrollment enforced to eliminate unmanaged endpoints
- **Impact:** Ensures all domain-joined Windows devices auto-enroll in Intune
- **Remediation:**
  - Enable Windows automatic enrollment via Group Policy
  - Configure MDM auto-enrollment for Azure AD hybrid join
  - Use Azure AD device compliance policies to block noncompliant devices
  - [Windows auto-enrollment documentation](https://learn.microsoft.com/intune/windows-enroll-windows-hello-for-business)
- **Auto-Remediation:** Possible - Enable via Intune enrollment settings

### 2. **Device Enrollment Notifications**
- **ID:** DEV-021
- **Priority:** Medium
- **Risk Level:** Medium
- **Validation:** Device enrollment notifications enforced for user awareness
- **Impact:** Users aware of security onboarding requirements
- **Remediation:**
  - Configure device enrollment notification settings in Intune
  - Add company contact and support links to enrollment notifications
  - Set enrollment deadline reminders
- **Auto-Remediation:** Possible - Enable via Intune admin center

### 3. **Intune Scope Tags - Delegated Administration**
- **ID:** DEV-020
- **Priority:** High
- **Risk Level:** High
- **Validation:** Scope tag configuration enforced for least-privilege access
- **Impact:** Limits admin access based on business function or geography
- **Remediation:**
  - Configure scope tags in Intune for role-based access control
  - Assign scope tags to device groups (e.g., Finance, Engineering, EMEA)
  - Create delegated admin roles with appropriate scope tags
- **Auto-Remediation:** No - Requires business logic configuration

---

## B. DEVICE COMPLIANCE (10 CONTROLS)

### 4. **Windows Compliance Policies**
- **ID:** DEV-002
- **Priority:** Critical
- **Risk Level:** Critical
- **Validation:** Windows device compliance policies configured and enforced
- **Expected:** Compliance policies assigned to all Windows device groups
- **Current:** Count of active Windows compliance policies
- **Remediation:**
  - Create Windows compliance policies covering:
    - Minimum OS version (e.g., Windows 10 20H2+)
    - BitLocker encryption required
    - Password requirements (minimum length, complexity)
    - Windows Defender Antivirus enabled
    - Firewall enabled
  - Assign policies to device groups
  - Monitor non-compliance via Intune dashboards
- **Auto-Remediation:** No - Requires device remediation action

### 5. **macOS Compliance Policies**
- **ID:** DEV-003
- **Priority:** Critical
- **Risk Level:** Critical
- **Validation:** macOS device compliance policies configured and enforced
- **Expected:** Compliance policies assigned to all macOS devices
- **Current:** Count of active macOS compliance policies
- **Remediation:**
  - Create macOS compliance policies covering:
    - Minimum OS version (e.g., macOS 12+)
    - FileVault encryption required
    - Firewall enabled
    - Password requirements
  - Assign policies to macOS device groups
  - [macOS compliance documentation](https://learn.microsoft.com/intune/compliance-policy-create-mac-os)
- **Auto-Remediation:** No - Requires device remediation

### 6. **iOS/iPadOS Compliance Policies**
- **ID:** DEV-004
- **Priority:** Critical
- **Risk Level:** Critical
- **Validation:** iOS/iPadOS compliance policies configured and enforced
- **Expected:** Compliance policies assigned to all iOS devices
- **Current:** Count of active iOS compliance policies
- **Remediation:**
  - Create iOS compliance policies with:
    - Minimum OS version (e.g., iOS 15+)
    - Passcode requirements (length, complexity, timeout)
    - Encrypted storage required
    - Device health attestation
  - Assign policies to BYOD and corporate device groups
- **Auto-Remediation:** No - Requires device remediation

### 7. **Android Managed Device Compliance**
- **ID:** DEV-005
- **Priority:** Critical
- **Risk Level:** Critical
- **Validation:** Android fully managed and corporate-owned device compliance enforced
- **Expected:** Compliance policies assigned to managed Android devices
- **Current:** Count of Android compliance policies
- **Remediation:**
  - Create Android Enterprise compliance policies for:
    - Fully managed devices (corporate-owned)
    - Corporate-owned, personally-enabled (COPE) devices
    - Coverage for minimum OS, encryption, antivirus
  - Assign via Intune device groups
- **Auto-Remediation:** No - Requires device remediation

### 8. **Android BYOD Device Compliance**
- **ID:** DEV-007
- **Priority:** High
- **Risk Level:** High
- **Validation:** Android personal device compliance policies enforced for BYOD scenarios
- **Expected:** BYOD compliance policies active
- **Current:** Count of Android BYOD policies
- **Remediation:**
  - Create Android app-based compliance policies using Intune app protection
  - Use conditional launch settings to enforce compliance
  - Require encryption, passcode, minimum OS on BYOD devices
- **Auto-Remediation:** No - Requires user device configuration

---

## C. DATA PROTECTION (4 CONTROLS)

### 9. **Windows BitLocker Encryption**
- **ID:** DEV-010
- **Priority:** Critical
- **Risk Level:** Critical
- **Validation:** BitLocker encryption enforced on all Windows devices
- **Expected:** BitLocker policies assigned to 100% of Windows devices
- **Current:** Percentage of devices with BitLocker enabled
- **Remediation:**
  - Create BitLocker policy in Intune covering:
    - OS drive encryption required
    - Fixed data drive encryption
    - Recovery password escrow to Azure AD
    - Allow TPM recovery
  - Deploy to all Windows device groups
  - [BitLocker encryption documentation](https://learn.microsoft.com/intune/encrypt-devices-windows)
- **Auto-Remediation:** Possible - Force enable via Intune policy

### 10. **macOS FileVault Encryption**
- **ID:** DEV-011
- **Priority:** Critical
- **Risk Level:** Critical
- **Validation:** FileVault encryption enforced on macOS devices
- **Expected:** FileVault enabled on 100% of macOS devices
- **Current:** Percentage of macOS devices with FileVault
- **Remediation:**
  - Create macOS device configuration profile with:
    - FileVault encryption enabled
    - Recovery key escrow to Intune
    - Show recovery key during setup
  - Assign to all macOS device groups
  - Monitor compliance via Intune dashboards
- **Auto-Remediation:** Possible - Enable via device profile

### 11. **iOS App Protection Policies**
- **ID:** DEV-008
- **Priority:** Critical
- **Risk Level:** Critical
- **Validation:** iOS/iPadOS app protection policies protect data on personal devices
- **Expected:** App protection policies assigned to all iOS users
- **Current:** Count of iOS app protection policies
- **Remediation:**
  - Create iOS managed app protection (MAM) policies with:
    - App-level encryption
    - Data segregation from personal apps
    - Clipboard/screenshot restrictions
    - Contact sync restrictions
    - PIN/biometric requirement
  - Assign to users accessing corporate data
  - Use Intune Company Portal for policy deployment
- **Auto-Remediation:** No - Requires app policy enforcement

### 12. **Android App Protection Policies**
- **ID:** DEV-009
- **Priority:** Critical
- **Risk Level:** Critical
- **Validation:** Android app protection policies protect data on personal devices
- **Expected:** App protection policies assigned to all Android users
- **Current:** Count of Android app protection policies
- **Remediation:**
  - Create Android managed app protection (MAM) policies covering:
    - App-level encryption
    - PIN/biometric requirement
    - Data loss prevention (copy/cut/paste restrictions)
    - Contact sync restrictions
    - Conditional launch on device compliance
  - Assign to BYOD users
- **Auto-Remediation:** No - Requires app policy enforcement

---

## D. AUTHENTICATION & ACCESS (5 CONTROLS)

### 13. **Windows Hello for Business**
- **ID:** DEV-012
- **Priority:** Critical
- **Risk Level:** Critical
- **Validation:** Windows Hello for Business enforced for strong multifactor authentication
- **Expected:** Windows Hello for Business policy assigned to all users
- **Current:** Policy configuration status
- **Remediation:**
  - Create tenant-wide Windows Hello for Business policy in Intune
  - Require Windows Hello for Business on device enrollment
  - Create Account Protection profiles for post-enrollment enforcement
  - Support facial recognition and fingerprint methods
  - [Windows Hello for Business documentation](https://learn.microsoft.com/intune/device-security-identity-protection)
- **Auto-Remediation:** No - Requires user hardware (cameras, fingerprint sensors)

### 14. **Windows LAPS - Local Admin Credentials**
- **ID:** DEV-013
- **Priority:** Critical
- **Risk Level:** Critical
- **Validation:** Windows Local Administrator Password Solution (LAPS) enforced
- **Expected:** LAPS policy assigned to all Windows devices
- **Current:** Percentage of devices with LAPS enabled
- **Remediation:**
  - Deploy Windows LAPS policy via Intune with:
    - Strong password generation (32+ chars)
    - Password rotation every 30 days
    - Backup to Azure AD or local AD
    - Prevent privileged account re-use
  - Monitor LAPS compliance via Intune
  - [Windows LAPS documentation](https://learn.microsoft.com/intune/device-security-laps)
- **Auto-Remediation:** Possible - Enable and rotate via policy

### 15. **macOS LAPS - Local Admin Credentials**
- **ID:** DEV-014
- **Priority:** High
- **Risk Level:** High
- **Validation:** macOS Local Administrator Password Solution enforced during enrollment
- **Expected:** macOS LAPS configured during device enrollment
- **Current:** Policy configuration status
- **Remediation:**
  - Configure macOS LAPS enrollment settings in Intune
  - Protect local admin account during device setup
  - Rotate credentials per organization policy
  - Store credentials securely in Intune
- **Auto-Remediation:** No - Requires device enrollment process

### 16. **Windows Local Account Restrictions**
- **ID:** DEV-015
- **Priority:** High
- **Risk Level:** High
- **Validation:** Local account usage on Windows restricted to reduce unauthorized access
- **Expected:** Local account creation restricted via policy
- **Current:** Local account policy status
- **Remediation:**
  - Deploy Windows security baselines restricting:
    - Local account creation (except built-in Administrator)
    - Local account elevation privileges
    - Guest account usage
  - Use Azure AD joined devices to force cloud-based identities
  - Assign via Intune security baselines
- **Auto-Remediation:** Possible - Restrict via device policy

### 17. **macOS Platform SSO**
- **ID:** DEV-016
- **Priority:** High
- **Risk Level:** High
- **Validation:** Platform SSO configured on macOS for seamless Kerberos authentication
- **Expected:** macOS Platform SSO policy assigned
- **Current:** Policy configuration status
- **Remediation:**
  - Create macOS Platform SSO (Kerberos) configuration in Intune
  - Enable single sign-on across enterprise apps
  - Reduce password prompts and improve user experience
  - Integrate with Kerberos realms
- **Auto-Remediation:** No - Requires network infrastructure

### 18. **Conditional Access - Noncompliant Devices Blocked**
- **ID:** DEV-029
- **Priority:** Critical
- **Risk Level:** Critical
- **Validation:** Conditional Access policies block access from noncompliant devices
- **Expected:** CA policies enforcing device compliance before resource access
- **Current:** Number of device compliance CA policies
- **Remediation:**
  - Create Conditional Access policy requiring:
    - Compliant device OR hybrid Azure AD join
    - Block if noncompliant
  - Target all users and apps
  - Exclude break-glass emergency access accounts
  - [Device compliance CA policy](https://learn.microsoft.com/entra/identity/conditional-access/policy-all-users-device-compliance)
- **Auto-Remediation:** Possible - Enforce block via CA

---

## E. PATCH MANAGEMENT (3 CONTROLS)

### 19. **Windows Update Policies**
- **ID:** DEV-017
- **Priority:** Critical
- **Risk Level:** Critical
- **Validation:** Windows Update policies enforced to reduce risk from unpatched vulnerabilities
- **Expected:** Windows Update policies assigned and enforced
- **Current:** Percentage of devices with auto-updates enabled
- **Remediation:**
  - Configure Windows Update policy in Intune:
    - Feature update deferral: 30 days maximum
    - Quality update deferral: 7 days maximum
    - Auto-install and restart required
    - Restart notifications and grace periods
  - Assign to all Windows device groups
  - Monitor update compliance via Intune
- **Auto-Remediation:** Possible - Force update via policy

### 20. **macOS Update Policies**
- **ID:** DEV-018
- **Priority:** Critical
- **Risk Level:** Critical
- **Validation:** macOS update policies enforced to reduce risk from unpatched vulnerabilities
- **Expected:** macOS update policies assigned and enforced
- **Current:** Percentage of devices with updates enabled
- **Remediation:**
  - Create macOS update policy in Intune covering:
    - Major OS updates: defer 30-60 days
    - Security updates: auto-install (critical)
    - Minor updates: auto-install
    - Automatic restart scheduling
  - Deploy to all macOS device groups
- **Auto-Remediation:** Possible - Force update via policy

### 21. **iOS/iPadOS Update Policies**
- **ID:** DEV-019
- **Priority:** Critical
- **Risk Level:** Critical
- **Validation:** iOS/iPadOS update policies enforced to reduce risk from unpatched vulnerabilities
- **Expected:** iOS update policies deployed to all devices
- **Current:** Percentage of devices running latest OS
- **Remediation:**
  - Create iOS update policy requiring:
    - Automatic iOS update install
    - Minimum OS version enforcement
    - Update timing to off-peak hours
    - Automatic restart for updates
  - Deploy to all iOS device groups
- **Auto-Remediation:** No - Requires device-level app store settings

---

## F. THREAT PROTECTION (3 CONTROLS)

### 22. **Windows Firewall**
- **ID:** DEV-001
- **Priority:** Critical
- **Risk Level:** Critical
- **Validation:** Windows Firewall policies configured to protect against unauthorized network access
- **Expected:** Windows Firewall policies assigned to all Windows devices
- **Current:** Percentage of devices with firewall enabled
- **Remediation:**
  - Configure Windows Firewall policy in Intune with:
    - Inbound filtering for each network type (domain, private, public)
    - Block by default, allow by exception
    - Application rules for managed apps
    - Group Policy rules for enterprise services
  - [Windows Firewall documentation](https://learn.microsoft.com/intune/endpoint-security-firewall-policy)
- **Auto-Remediation:** Possible - Enable firewall via policy

### 23. **macOS Firewall**
- **ID:** DEV-034
- **Priority:** High
- **Risk Level:** High
- **Validation:** macOS Firewall policies protect against unauthorized network access
- **Expected:** macOS firewall policies assigned to all devices
- **Current:** Percentage of devices with firewall enabled
- **Remediation:**
  - Create macOS firewall policy in Intune:
    - Block inbound connections by default
    - Allow specified apps to receive connections
    - Enable stealth mode
  - Assign to all macOS device groups
- **Auto-Remediation:** Possible - Enable firewall via policy

### 24. **Microsoft Defender Antivirus - Windows**
- **ID:** DEV-024
- **Priority:** Critical
- **Risk Level:** Critical
- **Validation:** Defender Antivirus policies protect Windows devices from malware
- **Expected:** Defender Antivirus policies assigned to all Windows devices
- **Current:** Percentage of devices with active antivirus
- **Remediation:**
  - Configure Defender Antivirus policy in Intune with:
    - Real-time protection enabled
    - Cloud-delivered protection enabled
    - Scan schedule (daily, off-peak)
    - Automatic sample submission
    - PUA protection enabled
  - [Defender Antivirus documentation](https://learn.microsoft.com/intune/device-configuration/endpoint-security-antivirus)
- **Auto-Remediation:** Possible - Enable via policy

---

## G. HARDENING & BASELINES

### 25. **Windows Security Baselines**
- **ID:** DEV-022
- **Priority:** Critical
- **Risk Level:** Critical
- **Validation:** Security baselines applied to Windows devices to strengthen security posture
- **Expected:** Windows security baselines assigned to all devices
- **Current:** Number of baseline policies deployed
- **Remediation:**
  - Deploy Microsoft security baselines for Windows via Intune:
    - Windows 10 or Windows 11 baseline
    - Covers 300+ hardening settings
    - Align with CIS Benchmarks
    - Monitor compliance via Intune
  - [Security baselines documentation](https://learn.microsoft.com/intune/device-security-security-baselines)
- **Auto-Remediation:** Possible - Apply baseline via policy

### 26. **Attack Surface Reduction (ASR) Rules**
- **ID:** DEV-023
- **Priority:** Critical
- **Risk Level:** Critical
- **Validation:** Attack Surface Reduction (ASR) rules applied to prevent exploitation of vulnerable system components
- **Expected:** ASR rules enabled on all Windows devices
- **Current:** Percentage of devices with ASR rules
- **Remediation:**
  - Configure ASR rules in Intune via Defender policy:
    - Block Office apps from creating executable content
    - Block Office apps from injecting code
    - Block JavaScript/VBScript from downloading executables
    - Block Win32 API calls from Office macros
    - Block execution of potentially obfuscated scripts
  - Deploy to all Windows device groups
- **Auto-Remediation:** Possible - Enable rules via policy

---

## H. MONITORING & ADMINISTRATION

### 27. **Endpoint Analytics**
- **ID:** DEV-026
- **Priority:** High
- **Risk Level:** High
- **Validation:** Endpoint Analytics enabled to help identify risks on Windows devices
- **Expected:** Endpoint Analytics configured and data flowing
- **Current:** Analytics enrollment status
- **Remediation:**
  - Enable Endpoint Analytics in Intune:
    - Collect device performance metrics
    - Identify startup performance issues
    - Monitor application health
    - Generate device remediation recommendations
    - Create performance baselines
  - [Endpoint Analytics documentation](https://learn.microsoft.com/mem/analytics/overview)
- **Auto-Remediation:** Possible - Enable via Intune settings

### 28. **Device Cleanup Rules**
- **ID:** DEV-027
- **Priority:** Medium
- **Risk Level:** Medium
- **Validation:** Device cleanup rules maintain tenant hygiene by removing inactive devices
- **Expected:** Cleanup rules configured to remove inactive devices
- **Current:** Number of inactive devices cleaned up
- **Remediation:**
  - Configure device cleanup policy in Intune:
    - Retire devices not seen in 90+ days
    - Block access from stale devices
    - Remove from device groups
    - Log cleanup actions for audit
- **Auto-Remediation:** Possible - Auto-retire old devices

### 29. **Company Portal Branding**
- **ID:** DEV-028
- **Priority:** Low
- **Risk Level:** Low
- **Validation:** Company Portal branding and support settings configured to enhance user experience
- **Expected:** Company branding and support contact configured
- **Current:** Branding configuration status
- **Remediation:**
  - Configure Company Portal in Intune with:
    - Company name and logo
    - Support contact (email, phone, website)
    - Privacy statement link
    - Company colors and theme
  - Enhance user trust and support experience
- **Auto-Remediation:** Possible - Apply branding via Intune

### 30. **Terms and Conditions Policies**
- **ID:** DEV-033
- **Priority:** Medium
- **Risk Level:** Medium
- **Validation:** Terms and Conditions policies protect access to sensitive data
- **Expected:** T&C policies assigned to users requiring acknowledgment
- **Current:** T&C policy configuration status
- **Remediation:**
  - Configure Terms and Conditions in Intune:
    - Create security and compliance terms
    - Require user acknowledgment before enrollment
    - Store acknowledgment history
    - Update terms periodically
    - Block access if terms not accepted
- **Auto-Remediation:** Possible - Require T&C via enrollment

---

## I. ACCESS CONTROL & NETWORK (5 CONTROLS)

### 31. **iOS Secure Wi-Fi Profiles**
- **ID:** DEV-031
- **Priority:** High
- **Risk Level:** High
- **Validation:** Secure Wi-Fi profiles protect iOS devices from unauthorized network access
- **Expected:** Secure Wi-Fi profiles deployed to iOS devices
- **Current:** Percentage of devices with secure Wi-Fi
- **Remediation:**
  - Create iOS Wi-Fi profile in Intune:
    - WPA2/WPA3 encryption required
    - Certificate-based authentication
    - Hidden SSID support
    - Proxy settings if needed
    - Auto-connect to enterprise networks
  - Deploy to corporate and BYOD device groups
- **Auto-Remediation:** Possible - Deploy via profile

### 32. **Android Secure Wi-Fi Profiles**
- **ID:** DEV-032
- **Priority:** High
- **Risk Level:** High
- **Validation:** Secure Wi-Fi profiles protect Android devices from unauthorized network access
- **Expected:** Secure Wi-Fi profiles deployed to Android devices
- **Current:** Percentage of devices with secure Wi-Fi
- **Remediation:**
  - Create Android Wi-Fi profile in Intune:
    - WPA2/WPA3 encryption
    - EAP authentication (TLS, PEAP)
    - Certificate deployment
    - Hidden SSID support
    - Enterprise network auto-connect
  - Deploy to managed and BYOD device groups
- **Auto-Remediation:** Possible - Deploy via profile

### 33. **Conditional Access - Unmanaged Apps Blocked**
- **ID:** DEV-030
- **Priority:** High
- **Risk Level:** High
- **Validation:** Conditional Access policies block access from unmanaged applications
- **Expected:** CA policies requiring approved client apps for data access
- **Current:** Number of app-based CA policies
- **Remediation:**
  - Create Conditional Access policy requiring approved client apps:
    - Target high-risk applications (email, SharePoint, Teams)
    - Grant control: require approved client app
    - Block if using unapproved app
    - Exclude on-premises apps where necessary
  - Monitor usage via Azure AD sign-in logs
- **Auto-Remediation:** Possible - Enforce block via CA

---

## Implementation Priority

### Phase 1 (Critical - Immediate)
- DEV-002: Windows compliance policies
- DEV-010: BitLocker encryption
- DEV-024: Defender Antivirus
- DEV-029: Conditional Access device compliance
- DEV-017: Windows Update policies

### Phase 2 (High - 30 days)
- DEV-001: Windows Firewall
- DEV-003: macOS compliance
- DEV-011: FileVault encryption
- DEV-022: Security baselines
- DEV-012: Windows Hello for Business

### Phase 3 (Medium - 60-90 days)
- DEV-008: iOS app protection policies
- DEV-009: Android app protection policies
- DEV-013: Windows LAPS
- DEV-026: Endpoint Analytics
- DEV-031/032: Secure Wi-Fi profiles

---

## Key References
- [Microsoft Intune Endpoint Security](https://learn.microsoft.com/intune/device-configuration/endpoint-security)
- [Intune Compliance Policies](https://learn.microsoft.com/intune/device-security/compliance/create-policy)
- [Conditional Access Policies](https://learn.microsoft.com/entra/identity/conditional-access/overview)
- [Zero Trust Assessment Demo](https://aka.ms/zerotrust/demo)
