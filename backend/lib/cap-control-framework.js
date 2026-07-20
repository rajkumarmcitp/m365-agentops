/**
 * Conditional Access Control Framework
 * Defines 53 controls across 5 categories (identity, admin, device, application, network)
 * Used for Zero Trust assessment, compliance mapping, and remediation
 */

export const capControlFramework = {
  // Category 6 - Network Protection
  "CA-CAT-06": {
    categoryId: "CA-CAT-06",
    categoryName: "Network Protection",
    zeroTrustPillar: "Network",
    weight: 15,
    controls: [
      {
        controlId: "CA-060",
        name: "Named Locations Configured",
        severity: "Critical",
        priority: 1,
        description: "Trusted and untrusted locations are configured for Conditional Access.",
        graphResource: "/identity/conditionalAccess/namedLocations",
        graphProperty: "displayName",
        expectedValue: "At least one Named Location",
        validation: {
          namedLocations: { exists: true }
        },
        score: 10,
        autoRemediation: false,
        compliance: {
          ZeroTrust: "Network",
          CIS: ["4.4"],
          NIST80053: ["AC-3", "AC-4"],
          ISO27001: ["A.9.1", "A.9.2"]
        }
      },
      {
        controlId: "CA-061",
        name: "Trusted Locations Configured",
        severity: "High",
        priority: 2,
        description: "Trusted locations are configured to allow known locations.",
        graphResource: "/identity/conditionalAccess/namedLocations",
        graphProperty: "isTrusted",
        expectedValue: "Trusted locations defined",
        validation: {
          trustedLocations: { exists: true }
        },
        score: 8,
        compliance: {
          ZeroTrust: "Network",
          CIS: ["4.4"],
          NIST80053: ["AC-3"],
          ISO27001: ["A.9.1"]
        }
      },
      {
        controlId: "CA-062",
        name: "Trusted Locations Excluded Where Appropriate",
        severity: "Medium",
        priority: 3,
        description: "Trusted locations are referenced in CAP policies to exclude them.",
        graphResource: "/identity/conditionalAccess/policies",
        graphProperty: "conditions.locations.excludeLocations",
        expectedValue: "Trusted locations referenced",
        validation: {
          trustedLocationsReferenced: true
        },
        score: 5,
        compliance: {
          ZeroTrust: "Network",
          CIS: ["4.4"],
          NIST80053: ["AC-3"],
          ISO27001: ["A.9.1"]
        }
      },
      {
        controlId: "CA-063",
        name: "High Risk Countries Restricted",
        severity: "Critical",
        priority: 4,
        description: "Conditional Access blocks access from high-risk countries.",
        graphResource: "/identity/conditionalAccess/policies",
        graphProperty: "conditions.locations.includeLocations",
        expectedValue: "Country-based restrictions configured",
        validation: {
          blockedCountries: { exists: true }
        },
        score: 10,
        autoRemediation: true,
        compliance: {
          ZeroTrust: "Network",
          CIS: ["4.4"],
          NIST80053: ["AC-4"],
          ISO27001: ["A.9.2"]
        }
      },
      {
        controlId: "CA-064",
        name: "Anonymous IP Addresses Restricted",
        severity: "High",
        priority: 5,
        description: "Conditional Access restricts access from anonymous IPs.",
        graphResource: "/identity/conditionalAccess/policies",
        graphProperty: "conditions.riskLevels",
        expectedValue: "Anonymous IP risk handled",
        validation: {
          riskSignals: ["anonymousIPAddress"]
        },
        score: 8,
        compliance: {
          ZeroTrust: "Network",
          CIS: ["4.4"],
          NIST80053: ["AC-3", "AC-4"],
          ISO27001: ["A.9.2"]
        }
      },
      {
        controlId: "CA-065",
        name: "TOR / VPN Access Controlled",
        severity: "Medium",
        priority: 6,
        description: "VPN and TOR network traffic is controlled or restricted.",
        graphResource: "/identity/conditionalAccess/policies",
        graphProperty: "conditions.riskLevels",
        expectedValue: "Network risk protection enabled",
        validation: {
          networkRiskProtection: true
        },
        score: 5,
        compliance: {
          ZeroTrust: "Network",
          CIS: ["4.4"],
          NIST80053: ["AC-3"],
          ISO27001: ["A.9.2"]
        }
      },
      {
        controlId: "CA-066",
        name: "Location-based Conditional Access Implemented",
        severity: "High",
        priority: 7,
        description: "Location conditions are configured in Conditional Access policies.",
        graphResource: "/identity/conditionalAccess/policies",
        graphProperty: "conditions.locations.includeLocations",
        expectedValue: "Location-based conditions active",
        validation: {
          conditions: { locations: { includeLocations: true } }
        },
        score: 8,
        compliance: {
          ZeroTrust: "Network",
          CIS: ["4.4"],
          NIST80053: ["AC-3", "AC-4"],
          ISO27001: ["A.9.2"]
        }
      }
    ]
  },
  // Category 5 - Application Protection
  "CA-CAT-05": {
    categoryId: "CA-CAT-05",
    categoryName: "Application Protection",
    zeroTrustPillar: "Applications",
    weight: 20,
    controls: [
      {
        controlId: "CA-050",
        name: "All Cloud Applications Protected",
        severity: "Critical",
        priority: 1,
        description: "Conditional Access protects all cloud applications.",
        graphResource: "/identity/conditionalAccess/policies",
        graphProperty: "conditions.applications.includeApplications",
        expectedValue: "All Cloud Apps",
        validation: {
          applications: { includeApplications: ["All"] },
          state: ["enabled"]
        },
        score: 10,
        autoRemediation: true,
        compliance: {
          ZeroTrust: "Applications",
          CIS: ["2.2"],
          NIST80053: ["AC-2", "AC-3"],
          ISO27001: ["A.5.17", "A.8.1"]
        }
      },
      {
        controlId: "CA-051",
        name: "Microsoft 365 Applications Protected",
        severity: "Critical",
        priority: 2,
        description: "Office 365 cloud applications are explicitly protected.",
        graphResource: "/identity/conditionalAccess/policies",
        graphProperty: "conditions.applications.includeApplications",
        expectedValue: "Office 365",
        validation: {
          applications: ["Office 365"]
        },
        score: 10,
        compliance: {
          ZeroTrust: "Applications",
          CIS: ["2.2"],
          NIST80053: ["AC-2"],
          ISO27001: ["A.5.17"]
        }
      },
      {
        controlId: "CA-052",
        name: "Azure Management Protected",
        severity: "Critical",
        priority: 3,
        description: "Azure management portal requires MFA.",
        graphResource: "/identity/conditionalAccess/policies",
        graphProperty: "conditions.applications.includeApplications",
        expectedValue: "Azure Management + MFA",
        validation: {
          applications: ["Microsoft Azure Management"],
          grantControls: { contains: ["mfa"] }
        },
        score: 10,
        compliance: {
          ZeroTrust: "Applications",
          CIS: ["5.2"],
          NIST80053: ["AC-2", "IA-2"],
          ISO27001: ["A.5.17", "A.9.2"]
        }
      },
      {
        controlId: "CA-053",
        name: "Microsoft Admin Portals Protected",
        severity: "High",
        priority: 4,
        description: "Microsoft admin portals are protected.",
        graphResource: "/identity/conditionalAccess/policies",
        graphProperty: "conditions.applications.includeApplications",
        expectedValue: "Admin Portals",
        validation: {
          applications: ["Microsoft Admin Portals"]
        },
        score: 8,
        compliance: {
          ZeroTrust: "Applications",
          CIS: ["5.2"],
          NIST80053: ["AC-2"],
          ISO27001: ["A.5.17"]
        }
      },
      {
        controlId: "CA-054",
        name: "Authentication Context Configured",
        severity: "High",
        priority: 5,
        description: "Authentication context for application-specific requirements.",
        graphResource: "/identity/conditionalAccess/policies",
        graphProperty: "conditions.applications.includeAuthenticationContextClassReferences",
        expectedValue: "Auth Context exists",
        validation: {
          authenticationContext: { exists: true }
        },
        score: 8,
        compliance: {
          ZeroTrust: "Applications",
          CIS: ["5.2"],
          NIST80053: ["IA-2"],
          ISO27001: ["A.5.17"]
        }
      },
      {
        controlId: "CA-055",
        name: "Sensitive Applications Protected",
        severity: "Critical",
        priority: 6,
        description: "High-value enterprise applications explicitly protected.",
        graphResource: "/identity/conditionalAccess/policies",
        graphProperty: "conditions.applications",
        expectedValue: "High-value apps protected",
        validation: {
          highValueApplications: true
        },
        score: 10,
        compliance: {
          ZeroTrust: "Applications",
          CIS: ["2.2"],
          NIST80053: ["AC-2", "AC-3"],
          ISO27001: ["A.5.17", "A.8.1"]
        }
      },
      {
        controlId: "CA-056",
        name: "Enterprise Applications Protected",
        severity: "High",
        priority: 7,
        description: "Enterprise applications have Conditional Access coverage.",
        graphResource: "/applications",
        graphProperty: "conditionalAccess",
        expectedValue: "Apps protected",
        validation: {
          enterpriseApplications: true
        },
        score: 8,
        compliance: {
          ZeroTrust: "Applications",
          CIS: ["2.2"],
          NIST80053: ["AC-2"],
          ISO27001: ["A.5.17"]
        }
      },
      {
        controlId: "CA-057",
        name: "Service Principal Exclusions Reviewed",
        severity: "Medium",
        priority: 8,
        description: "Service principal exclusions are documented and valid.",
        graphResource: "/servicePrincipals",
        graphProperty: "exclusions",
        expectedValue: "Exclusions reviewed",
        validation: {
          servicePrincipalExclusions: true
        },
        score: 5,
        compliance: {
          ZeroTrust: "Applications",
          CIS: ["2.2"],
          NIST80053: ["AC-2"],
          ISO27001: ["A.5.17"]
        }
      }
    ]
  },

  // Category 4 - Device Trust
  "CA-CAT-04": {
    categoryId: "CA-CAT-04",
    categoryName: "Device Trust",
    zeroTrustPillar: "Devices",
    weight: 20,
    controls: [
      {
        controlId: "CA-040",
        name: "Require Compliant Device",
        severity: "Critical",
        priority: 1,
        description: "Users must access cloud resources only from Intune compliant devices.",
        graphResource: "/identity/conditionalAccess/policies",
        graphProperty: "grantControls.builtInControls",
        expectedValue: "Compliant Device Required",
        validation: {
          grantControls: { contains: ["compliantDevice"] },
          state: ["enabled"]
        },
        score: 10,
        autoRemediation: true,
        compliance: {
          ZeroTrust: "Devices",
          CIS: ["2.1"],
          NIST80053: ["AC-2", "SC-7"],
          ISO27001: ["A.5.17", "A.10.1"]
        }
      },
      {
        controlId: "CA-041",
        name: "Require Hybrid Entra Joined Device",
        severity: "High",
        priority: 2,
        description: "Devices must be hybrid Azure AD joined.",
        graphResource: "/identity/conditionalAccess/policies",
        graphProperty: "grantControls.builtInControls",
        expectedValue: "Hybrid Joined Device",
        validation: {
          grantControls: { contains: ["domainJoinedDevice"] }
        },
        score: 8,
        compliance: {
          ZeroTrust: "Devices",
          CIS: ["2.1"],
          NIST80053: ["SC-7"],
          ISO27001: ["A.10.1"]
        }
      },
      {
        controlId: "CA-042",
        name: "Device Filter Configured",
        severity: "Medium",
        priority: 3,
        description: "Advanced device filtering rules applied.",
        graphResource: "/identity/conditionalAccess/policies",
        graphProperty: "conditions.devices.deviceFilter",
        expectedValue: "Device Filter exists",
        validation: {
          deviceFilter: { exists: true }
        },
        score: 5,
        compliance: {
          ZeroTrust: "Devices",
          CIS: ["2.1"]
        }
      },
      {
        controlId: "CA-043",
        name: "Require Approved Client Applications",
        severity: "High",
        priority: 4,
        description: "Only approved client applications can access resources.",
        graphResource: "/identity/conditionalAccess/policies",
        graphProperty: "grantControls.builtInControls",
        expectedValue: "Approved Applications",
        validation: {
          grantControls: { contains: ["approvedApplication"] }
        },
        score: 8,
        compliance: {
          ZeroTrust: "Devices",
          CIS: ["2.3"],
          NIST80053: ["SI-7"],
          ISO27001: ["A.12.5"]
        }
      },
      {
        controlId: "CA-044",
        name: "Require App Protection Policy",
        severity: "High",
        priority: 5,
        description: "Mobile apps must have Intune app protection policies applied.",
        graphResource: "/identity/conditionalAccess/policies",
        graphProperty: "grantControls.builtInControls",
        expectedValue: "App Protection Policy",
        validation: {
          grantControls: { contains: ["appProtectionPolicy"] }
        },
        score: 8,
        compliance: {
          ZeroTrust: "Devices",
          CIS: ["2.1"],
          NIST80053: ["SC-7"],
          ISO27001: ["A.10.1", "A.12.5"]
        }
      },
      {
        controlId: "CA-045",
        name: "Supported Device Platforms",
        severity: "Medium",
        priority: 6,
        description: "Policy covers Windows, macOS, iOS, and Android platforms.",
        graphResource: "/identity/conditionalAccess/policies",
        graphProperty: "conditions.platforms.includePlatforms",
        expectedValue: ["windows", "macOS", "iOS", "android"],
        validation: {
          devicePlatforms: { include: ["windows", "macOS", "iOS", "android"] }
        },
        score: 5,
        compliance: {
          ZeroTrust: "Devices",
          CIS: ["2.1"]
        }
      },
      {
        controlId: "CA-046",
        name: "Unsupported Device Platforms Blocked",
        severity: "High",
        priority: 7,
        description: "Linux and unknown platforms are explicitly blocked.",
        graphResource: "/identity/conditionalAccess/policies",
        graphProperty: "conditions.platforms.excludePlatforms",
        expectedValue: "Unsupported platforms excluded",
        validation: {
          devicePlatforms: { exclude: ["linux", "unknown"] }
        },
        score: 8,
        compliance: {
          ZeroTrust: "Devices",
          CIS: ["2.1"],
          NIST80053: ["AC-2"],
          ISO27001: ["A.10.1"]
        }
      },
      {
        controlId: "CA-047",
        name: "Intune Device Compliance Integrated",
        severity: "Critical",
        priority: 8,
        description: "Conditional Access policies reference Intune device compliance.",
        graphResource: "/identity/conditionalAccess/policies",
        graphProperty: "grantControls",
        expectedValue: "Device Compliance enforced",
        validation: {
          deviceCompliance: true
        },
        score: 10,
        compliance: {
          ZeroTrust: "Devices",
          CIS: ["2.1"],
          NIST80053: ["AC-2", "SC-7"],
          ISO27001: ["A.5.17", "A.10.1"]
        }
      },
      {
        controlId: "CA-048",
        name: "Device Compliance Policy Exists",
        severity: "High",
        priority: 9,
        description: "Intune device compliance policies are configured.",
        graphResource: "/deviceManagement/deviceCompliancePolicies",
        graphProperty: "exists",
        expectedValue: "Compliance policies defined",
        validation: {
          compliancePoliciesExist: true
        },
        score: 8,
        compliance: {
          ZeroTrust: "Devices",
          CIS: ["2.1"]
        }
      },
      {
        controlId: "CA-049",
        name: "Device Compliance Policy Assigned",
        severity: "High",
        priority: 10,
        description: "Device compliance policies are assigned to users/groups.",
        graphResource: "/deviceManagement/deviceCompliancePolicies",
        graphProperty: "assignments",
        expectedValue: "Policies assigned",
        validation: {
          compliancePoliciesAssigned: true
        },
        score: 8,
        compliance: {
          ZeroTrust: "Devices",
          CIS: ["2.1"]
        }
      },
      {
        controlId: "CA-050",
        name: "Jailbroken/Rooted Devices Blocked",
        severity: "Critical",
        priority: 11,
        description: "Jailbroken iOS and rooted Android devices are blocked.",
        graphResource: "/deviceManagement/deviceCompliancePolicies",
        graphProperty: "settings",
        expectedValue: "Jailbreak/Root detection enabled",
        validation: {
          jailbreakRootBlockEnabled: true
        },
        score: 10,
        compliance: {
          ZeroTrust: "Devices",
          CIS: ["2.1"],
          NIST80053: ["AC-2"],
          ISO27001: ["A.10.1"]
        }
      },
      {
        controlId: "CA-051",
        name: "Minimum OS Version Enforced",
        severity: "High",
        priority: 12,
        description: "Minimum Windows, macOS, iOS, and Android versions required.",
        graphResource: "/deviceManagement/deviceCompliancePolicies",
        graphProperty: "osVersion",
        expectedValue: "OS version minimum enforced",
        validation: {
          minOSVersionEnforced: true
        },
        score: 8,
        compliance: {
          ZeroTrust: "Devices",
          CIS: ["2.1"],
          NIST80053: ["SI-2"],
          ISO27001: ["A.12.6"]
        }
      },
      {
        controlId: "CA-052",
        name: "Device Encryption Required",
        severity: "Critical",
        priority: 13,
        description: "BitLocker (Windows), FileVault (macOS), or mobile encryption required.",
        graphResource: "/deviceManagement/deviceCompliancePolicies",
        graphProperty: "encryption",
        expectedValue: "Encryption enforced",
        validation: {
          encryptionRequired: true
        },
        score: 10,
        compliance: {
          ZeroTrust: "Devices",
          CIS: ["3.2"],
          NIST80053: ["SC-7", "SC-28"],
          ISO27001: ["A.10.1", "A.10.2"]
        }
      },
      {
        controlId: "CA-053",
        name: "Secure Boot / TPM Required",
        severity: "High",
        priority: 14,
        description: "Windows Secure Boot and TPM 2.0 requirements for Windows devices.",
        graphResource: "/deviceManagement/deviceCompliancePolicies",
        graphProperty: "secureBoot",
        expectedValue: "Secure Boot enabled",
        validation: {
          secureBootRequired: true
        },
        score: 8,
        compliance: {
          ZeroTrust: "Devices",
          CIS: ["2.1"],
          NIST80053: ["SC-7"],
          ISO27001: ["A.10.1"]
        }
      },
      {
        controlId: "CA-054",
        name: "Microsoft Defender Device Risk Integrated",
        severity: "High",
        priority: 15,
        description: "Device risk from Microsoft Defender for Endpoint used in access decisions.",
        graphResource: "/identity/conditionalAccess/policies",
        graphProperty: "conditions",
        expectedValue: "Defender device risk evaluation",
        validation: {
          defenderRiskIntegrated: true
        },
        score: 8,
        compliance: {
          ZeroTrust: "Devices",
          CIS: ["2.1"],
          NIST80053: ["SI-4"],
          ISO27001: ["A.12.6"]
        }
      },
      {
        controlId: "CA-055",
        name: "High Device Risk Blocked",
        severity: "Critical",
        priority: 16,
        description: "Devices with high risk score from Defender blocked from access.",
        graphResource: "/identity/conditionalAccess/policies",
        graphProperty: "grantControls",
        expectedValue: "High risk devices denied",
        validation: {
          highRiskDevicesBlocked: true
        },
        score: 10,
        compliance: {
          ZeroTrust: "Devices",
          CIS: ["2.1"],
          NIST80053: ["AC-2", "SI-4"],
          ISO27001: ["A.10.1", "A.12.6"]
        }
      }
    ]
  },

  // Category 3 - Administrative Protection
  "CA-CAT-03": {
    categoryId: "CA-CAT-03",
    categoryName: "Administrative Protection",
    zeroTrustPillar: "Identity",
    weight: 25,
    controls: [
      {
        controlId: "CA-020",
        name: "Global Administrators Protected",
        severity: "Critical",
        priority: 1,
        description: "All Global Administrators must be protected using Conditional Access.",
        graphResource: "/identity/conditionalAccess/policies",
        graphProperty: "conditions.users.includeRoles",
        expectedValue: "Global Administrators require MFA",
        validation: {
          includeRoles: ["Global Administrator"],
          grantControls: { contains: ["mfa"] },
          state: ["enabled"]
        },
        score: 10,
        autoRemediation: true,
        compliance: {
          ZeroTrust: "Identity",
          CIS: ["5.1", "5.3"],
          NIST80053: ["AC-2", "IA-2"],
          ISO27001: ["A.5.17", "A.9.2"]
        }
      },
      {
        controlId: "CA-021",
        name: "Privileged Roles Protected",
        severity: "Critical",
        priority: 2,
        description: "All privileged roles must require MFA.",
        graphResource: "/identity/conditionalAccess/policies",
        graphProperty: "conditions.users.includeRoles",
        expectedValue: "All privileged roles require MFA",
        validation: {
          includeRoles: [
            "Global Administrator",
            "Privileged Role Administrator",
            "Conditional Access Administrator",
            "Security Administrator",
            "Exchange Administrator",
            "SharePoint Administrator",
            "Teams Administrator",
            "Intune Administrator",
            "Application Administrator",
            "Cloud Application Administrator"
          ],
          grantControls: { contains: ["mfa"] }
        },
        score: 10,
        compliance: {
          ZeroTrust: "Identity",
          CIS: ["5.1", "5.3"],
          NIST80053: ["AC-2"],
          ISO27001: ["A.5.17"]
        }
      },
      {
        controlId: "CA-022",
        name: "Azure Portal Protected",
        severity: "High",
        priority: 3,
        description: "Microsoft Azure Management portal access must require MFA.",
        graphResource: "/identity/conditionalAccess/policies",
        graphProperty: "conditions.applications.includeApplications",
        expectedValue: "Azure Portal requires MFA",
        validation: {
          applications: ["Microsoft Azure Management"],
          grantControls: { contains: ["mfa"] }
        },
        score: 8,
        compliance: {
          ZeroTrust: "Identity",
          CIS: ["5.2"],
          NIST80053: ["AC-2"],
          ISO27001: ["A.5.17"]
        }
      },
      {
        controlId: "CA-023",
        name: "Microsoft Entra Admin Center Protected",
        severity: "High",
        priority: 4,
        description: "Microsoft Entra (Azure AD) admin center must require MFA.",
        graphResource: "/identity/conditionalAccess/policies",
        graphProperty: "conditions.applications.includeApplications",
        expectedValue: "Admin Portals require MFA",
        validation: {
          applications: ["Microsoft Admin Portals"],
          grantControls: { contains: ["mfa"] }
        },
        score: 8,
        compliance: {
          ZeroTrust: "Identity",
          CIS: ["5.2"],
          NIST80053: ["AC-2"],
          ISO27001: ["A.5.17"]
        }
      },
      {
        controlId: "CA-024",
        name: "Exchange Admin Center Protected",
        severity: "High",
        priority: 5,
        description: "Exchange Online admin center must require MFA.",
        graphResource: "/identity/conditionalAccess/policies",
        graphProperty: "conditions.applications.includeApplications",
        expectedValue: "Exchange Online requires MFA",
        validation: {
          applications: ["Office 365 Exchange Online"],
          grantControls: { contains: ["mfa"] }
        },
        score: 8,
        compliance: {
          ZeroTrust: "Identity",
          CIS: ["5.2"],
          NIST80053: ["AC-2"],
          ISO27001: ["A.5.17"]
        }
      },
      {
        controlId: "CA-025",
        name: "Privileged Identity Management Compatible",
        severity: "Medium",
        priority: 6,
        description: "Privileged roles should be eligible through PIM for JIT access.",
        graphResource: "/roleManagement/directory/roleEligibilitySchedules",
        graphProperty: "eligibleForPIM",
        expectedValue: true,
        validation: {
          eligibleForPIM: true
        },
        score: 5,
        compliance: {
          ZeroTrust: "Identity",
          CIS: ["5.1"],
          NIST80053: ["AC-2", "AC-5"],
          ISO27001: ["A.5.17", "A.9.1"]
        }
      },
      {
        controlId: "CA-026",
        name: "Phishing Resistant MFA Required",
        severity: "Critical",
        priority: 7,
        description: "Administrators must use phishing-resistant authentication (FIDO2, Windows Hello).",
        graphResource: "/identity/conditionalAccess/policies",
        graphProperty: "grantControls.authenticationStrength",
        expectedValue: "Phishing Resistant",
        validation: {
          authenticationStrength: ["Phishing Resistant"]
        },
        score: 10,
        compliance: {
          ZeroTrust: "Identity",
          CIS: ["5.2", "5.3"],
          NIST80053: ["IA-2", "IA-4"],
          ISO27001: ["A.5.17", "A.8.5"]
        }
      },
      {
        controlId: "CA-027",
        name: "Administrators Blocked From Unmanaged Devices",
        severity: "Critical",
        priority: 8,
        description: "Administrators must use managed/compliant devices only.",
        graphResource: "/identity/conditionalAccess/policies",
        graphProperty: "grantControls.builtInControls",
        expectedValue: "compliantDevice",
        validation: {
          grantControls: { contains: ["compliantDevice"] }
        },
        score: 10,
        compliance: {
          ZeroTrust: "Device",
          CIS: ["5.1"],
          NIST80053: ["AC-2", "SC-7"],
          ISO27001: ["A.5.17", "A.10.1"]
        }
      },
      {
        controlId: "CA-028",
        name: "Break-glass Accounts Excluded",
        severity: "High",
        priority: 9,
        description: "Emergency break-glass accounts excluded from admin policies to prevent lockout.",
        graphResource: "/identity/conditionalAccess/policies",
        graphProperty: "conditions.users.excludeUsers",
        expectedValue: "Exclude break-glass account",
        validation: {
          excludeUsers: ["break-glass"]
        },
        score: 8,
        compliance: {
          ZeroTrust: "Identity",
          CIS: ["5.1"],
          NIST80053: ["AC-2"],
          ISO27001: ["A.5.17"]
        }
      },
      {
        controlId: "CA-029",
        name: "Administrator Sign-ins Restricted to Trusted Locations",
        severity: "High",
        priority: 10,
        description: "Restrict administrator access to trusted geographic locations.",
        graphResource: "/identity/conditionalAccess/policies",
        graphProperty: "conditions.locations.includeLocations",
        expectedValue: "Trusted locations only",
        validation: {
          locations: ["trusted"]
        },
        score: 8,
        compliance: {
          ZeroTrust: "Network",
          CIS: ["5.2"],
          NIST80053: ["AC-3"],
          ISO27001: ["A.5.17"]
        }
      },
      {
        controlId: "CA-030",
        name: "Administrator Sign-in Risk Policy Enforced",
        severity: "High",
        priority: 11,
        description: "Apply stronger controls when Microsoft detects risky admin sign-ins.",
        graphResource: "/identity/conditionalAccess/policies",
        graphProperty: "conditions.signInRiskLevels",
        expectedValue: ["medium", "high"],
        validation: {
          signInRiskLevels: ["medium", "high"],
          grantControls: ["mfa"]
        },
        score: 8,
        compliance: {
          ZeroTrust: "Identity",
          CIS: ["6.3"],
          NIST80053: ["SI-4"],
          ISO27001: ["A.12.6"]
        }
      },
      {
        controlId: "CA-031",
        name: "Administrator Session Controls Configured",
        severity: "Medium",
        priority: 12,
        description: "Enforce sign-in frequency, token protection, or session controls for admins.",
        graphResource: "/identity/conditionalAccess/policies",
        graphProperty: "sessionControls",
        expectedValue: "Session controls enabled",
        validation: {
          sessionControls: { exists: true }
        },
        score: 5,
        compliance: {
          ZeroTrust: "Session",
          CIS: ["6.3"],
          NIST80053: ["AC-12"],
          ISO27001: ["A.5.17"]
        }
      }
    ]
  },

  // Category 2 - Identity Protection (Reference Implementation)
  "CA-CAT-02": {
    categoryId: "CA-CAT-02",
    categoryName: "Identity Protection",
    zeroTrustPillar: "Identity",
    weight: 20,
    controls: [
      {
        controlId: "CA-010",
        name: "Require Multi-Factor Authentication",
        severity: "Critical",
        priority: 1,
        description: "All interactive users must require MFA.",
        graphResource: "/identity/conditionalAccess/policies",
        graphProperty: "grantControls.builtInControls",
        expectedValue: ["mfa"],
        validation: {
          policyEnabled: true,
          grantControls: { contains: ["mfa"] },
          applications: "All",
          state: ["enabled"]
        },
        score: 10,
        autoRemediation: true,
        compliance: {
          ZeroTrust: "Identity",
          CIS: ["5.2", "6.3"],
          NIST80053: ["IA-2", "AC-2"],
          ISO27001: ["A.5.17", "A.8.5"]
        }
      },
      {
        controlId: "CA-011",
        name: "Authentication Strength Configured",
        severity: "High",
        priority: 2,
        description: "Configure passwordless or phishing-resistant authentication methods.",
        graphResource: "/identity/conditionalAccess/policies",
        graphProperty: "grantControls.authenticationStrength",
        expectedValue: ["Passwordless", "Phishing Resistant"],
        validation: {
          authenticationStrength: { exists: true }
        },
        score: 8,
        compliance: {
          ZeroTrust: "Identity",
          CIS: ["5.2"],
          NIST80053: ["IA-2", "IA-4"],
          ISO27001: ["A.5.17"]
        }
      },
      {
        controlId: "CA-012",
        name: "Phishing Resistant MFA for Privileged Accounts",
        severity: "Critical",
        priority: 3,
        description: "Global Admins and Privileged Role Admins must use phishing-resistant authentication.",
        graphResource: "/identity/conditionalAccess/policies",
        graphProperty: "conditions.users.includeRoles",
        expectedValue: "Phishing Resistant",
        validation: {
          roles: ["Global Administrator", "Privileged Role Administrator", "Conditional Access Administrator"],
          authenticationStrength: ["Phishing Resistant"]
        },
        score: 10,
        compliance: {
          ZeroTrust: "Identity",
          CIS: ["5.3"],
          NIST80053: ["IA-2", "AC-2"],
          ISO27001: ["A.5.17", "A.9.2"]
        }
      },
      {
        controlId: "CA-013",
        name: "Passwordless Authentication Supported",
        severity: "Medium",
        priority: 4,
        description: "Enable passwordless sign-in methods (Windows Hello, FIDO2, Phone).",
        graphResource: "/identity/conditionalAccess/policies",
        graphProperty: "grantControls.authenticationStrength",
        expectedValue: ["Passwordless"],
        validation: {
          authenticationStrength: ["Passwordless"]
        },
        score: 5,
        compliance: {
          ZeroTrust: "Identity",
          CIS: ["5.2"],
          NIST80053: ["IA-2"],
          ISO27001: ["A.5.17"]
        }
      },
      {
        controlId: "CA-014",
        name: "User Risk Policy Configured",
        severity: "Critical",
        priority: 5,
        description: "Block or require password change for users with high risk scores.",
        graphResource: "/identity/conditionalAccess/policies",
        graphProperty: "conditions.userRiskLevels",
        expectedValue: ["high"],
        validation: {
          userRiskLevels: ["high"],
          grantControls: ["passwordChange", "block"]
        },
        score: 10,
        compliance: {
          ZeroTrust: "Identity",
          CIS: ["6.3"],
          NIST80053: ["AC-2", "AC-3"],
          ISO27001: ["A.5.17", "A.9.4"]
        }
      },
      {
        controlId: "CA-015",
        name: "Sign-in Risk Policy Configured",
        severity: "Critical",
        priority: 6,
        description: "Require MFA or block for medium/high sign-in risk.",
        graphResource: "/identity/conditionalAccess/policies",
        graphProperty: "conditions.signInRiskLevels",
        expectedValue: ["medium", "high"],
        validation: {
          signInRiskLevels: ["medium", "high"],
          grantControls: ["mfa"]
        },
        score: 10,
        compliance: {
          ZeroTrust: "Identity",
          CIS: ["6.3"],
          NIST80053: ["AC-2", "SI-4"],
          ISO27001: ["A.5.17", "A.12.6"]
        }
      },
      {
        controlId: "CA-016",
        name: "Block High Risk Users",
        severity: "Critical",
        priority: 7,
        description: "Deny access to users with high risk assessment.",
        graphResource: "/identity/conditionalAccess/policies",
        graphProperty: "grantControls.builtInControls",
        expectedValue: ["block"],
        validation: {
          userRisk: ["high"],
          grantControls: ["block"]
        },
        score: 10,
        compliance: {
          ZeroTrust: "Identity",
          CIS: ["6.3"],
          NIST80053: ["AC-2"],
          ISO27001: ["A.5.17"]
        }
      },
      {
        controlId: "CA-017",
        name: "Force Password Change",
        severity: "High",
        priority: 8,
        description: "Require password change on high-risk sign-in.",
        graphResource: "/identity/conditionalAccess/policies",
        graphProperty: "grantControls.builtInControls",
        expectedValue: ["passwordChange"],
        validation: {
          grantControls: ["passwordChange"]
        },
        score: 8,
        compliance: {
          ZeroTrust: "Identity",
          CIS: ["5.2"],
          NIST80053: ["IA-5"],
          ISO27001: ["A.5.17"]
        }
      },
      {
        controlId: "CA-018",
        name: "Identity Protection Enabled",
        severity: "High",
        priority: 9,
        description: "Enable Azure AD Identity Protection for risk assessment.",
        graphResource: "/identityProtection",
        graphProperty: "enabled",
        expectedValue: true,
        validation: {
          identityProtection: true
        },
        score: 8,
        compliance: {
          ZeroTrust: "Identity",
          CIS: ["6.3"],
          NIST80053: ["AC-2", "SI-4"],
          ISO27001: ["A.5.17", "A.12.6"]
        }
      },
      {
        controlId: "CA-019",
        name: "Continuous Access Evaluation",
        severity: "Medium",
        priority: 10,
        description: "Evaluate access in real-time based on policy changes and user attributes.",
        graphResource: "/identity/conditionalAccess/policies",
        graphProperty: "grantControls.authenticationStrength",
        expectedValue: true,
        validation: {
          continuousAccessEvaluation: true
        },
        score: 5,
        compliance: {
          ZeroTrust: "Identity",
          CIS: ["6.3"],
          NIST80053: ["AC-2", "AC-3"],
          ISO27001: ["A.5.17"]
        }
      }
    ]
  }
};

/**
 * Sample evaluation results for control CA-010
 * Shows how a control is evaluated against actual policies
 */
export const evaluateControl = (controlId, policies) => {
  const control = getControlById(controlId);
  if (!control) return null;

  const evaluation = {
    controlId: control.controlId,
    name: control.name,
    severity: control.severity,
    status: "NotEvaluated",
    score: 0,
    matchedPolicies: [],
    missingCoverage: [],
    recommendation: "",
    graphResource: control.graphResource,
    expectedValue: control.expectedValue
  };

  // Example: CA-010 evaluation
  if (controlId === "CA-010") {
    const mfaPolicies = policies.filter(p =>
      p.enabled &&
      p.grantControls &&
      p.grantControls.builtInControls &&
      p.grantControls.builtInControls.includes("mfa") &&
      (p.target === "All" || p.target === "Interactive Users")
    );

    if (mfaPolicies.length > 0) {
      evaluation.status = "Passed";
      evaluation.score = control.score;
      evaluation.matchedPolicies = mfaPolicies.map(p => p.name);
      evaluation.recommendation = "MFA is properly configured. Continue monitoring for coverage gaps.";
    } else {
      evaluation.status = "Failed";
      evaluation.score = 0;
      evaluation.missingCoverage = ["All interactive users"];
      evaluation.recommendation = "Create a Conditional Access policy requiring MFA for all interactive users and cloud applications.";
    }
  }

  return evaluation;
};

/**
 * Get a control by ID
 */
export const getControlById = (controlId) => {
  for (const category of Object.values(capControlFramework)) {
    const control = category.controls.find(c => c.controlId === controlId);
    if (control) return control;
  }
  return null;
};

/**
 * Get all controls by category
 */
export const getControlsByCategory = (categoryId) => {
  return capControlFramework[categoryId];
};

/**
 * Evaluate all controls in a category
 */
export const evaluateCategory = (categoryId, policies) => {
  const category = getControlsByCategory(categoryId);
  if (!category) return null;

  const categoryEvaluation = {
    categoryId: category.categoryId,
    categoryName: category.categoryName,
    zeroTrustPillar: category.zeroTrustPillar,
    weight: category.weight,
    controls: category.controls.map(control => evaluateControl(control.controlId, policies)),
    totalScore: 0,
    maxScore: 0,
    coverage: 0
  };

  // Calculate scores
  categoryEvaluation.maxScore = category.controls.reduce((sum, c) => sum + c.score, 0);
  categoryEvaluation.totalScore = categoryEvaluation.controls.reduce((sum, c) => sum + c.score, 0);
  categoryEvaluation.coverage = Math.round((categoryEvaluation.totalScore / categoryEvaluation.maxScore) * 100);

  return categoryEvaluation;
};
