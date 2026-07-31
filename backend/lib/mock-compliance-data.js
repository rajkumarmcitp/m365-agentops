// Mock compliance data for testing dashboard without database
export class MockComplianceEngine {
  generateMockComplianceScore(tenantId) {
    return {
      score: 75.5,
      earnedPoints: 7750,
      totalPoints: 10250,
      breakdown: {
        passed: 847,
        failed: 156,
        partial: 18,
        unknown: 4,
        error: 0,
        total: 1025
      },
      status: 'Fair',
      riskLevel: 'Medium'
    }
  }

  generateMockFrameworkScores(tenantId) {
    return {
      CIS: {
        score: 82.5,
        totalControls: 450,
        passed: 371,
        failed: 65,
        partial: 14,
        status: 'Good',
        riskLevel: 'Low'
      },
      NIST: {
        score: 81.2,
        totalControls: 380,
        passed: 308,
        failed: 58,
        partial: 14,
        status: 'Good',
        riskLevel: 'Low'
      },
      ISO: {
        score: 79.8,
        totalControls: 320,
        passed: 255,
        failed: 52,
        partial: 13,
        status: 'Fair',
        riskLevel: 'Medium'
      },
      CMMC: {
        score: 80.5,
        totalControls: 280,
        passed: 225,
        failed: 44,
        partial: 11,
        status: 'Good',
        riskLevel: 'Low'
      },
      SOC2: {
        score: 83.1,
        totalControls: 310,
        passed: 258,
        failed: 40,
        partial: 12,
        status: 'Good',
        riskLevel: 'Low'
      },
      'Secure Score': {
        score: 86.4,
        totalControls: 400,
        passed: 346,
        failed: 45,
        partial: 9,
        status: 'Excellent',
        riskLevel: 'Low'
      },
      'Zero Trust': {
        score: 85.9,
        totalControls: 360,
        passed: 309,
        failed: 39,
        partial: 12,
        status: 'Excellent',
        riskLevel: 'Low'
      }
    }
  }

  generateMockDomainScores(tenantId) {
    const domains = {
      'TG-ID': { score: 88.6, passed: 62, failed: 8 },
      'TG-AUTH': { score: 80.0, passed: 28, failed: 7 },
      'TG-CA': { score: 77.5, passed: 31, failed: 9 },
      'TG-APP': { score: 82.1, passed: 57, failed: 12 },
      'TG-ROLE': { score: 81.3, passed: 65, failed: 15 },
      'TG-DEV': { score: 79.2, passed: 38, failed: 10 },
      'TG-EXO': { score: 68.4, passed: 62, failed: 18 },
      'TG-SPO': { score: 72.1, passed: 58, failed: 22 },
      'TG-TEAMS': { score: 75.3, passed: 43, failed: 14 },
      'TG-PUR': { score: 83.5, passed: 52, failed: 10 },
      'TG-DEF': { score: 81.0, passed: 73, failed: 17 },
      'TG-INT': { score: 75.3, passed: 51, failed: 19 },
      'TG-DLP': { score: 74.2, passed: 39, failed: 13 },
      'TG-AUD': { score: 80.5, passed: 69, failed: 17 },
      'TG-MON': { score: 82.3, passed: 63, failed: 13 },
      'TG-NET': { score: 77.8, passed: 35, failed: 10 },
      'TG-GOV': { score: 79.2, passed: 42, failed: 11 },
      'TG-BKP': { score: 84.1, passed: 37, failed: 7 },
      'TG-COMP': { score: 76.5, passed: 33, failed: 10 },
      'TG-AI': { score: 81.2, passed: 39, failed: 9 }
    }

    const result = {}
    for (const [domain, stats] of Object.entries(domains)) {
      result[domain] = {
        score: stats.score,
        totalControls: stats.passed + stats.failed,
        passed: stats.passed,
        failed: stats.failed,
        partial: 0,
        status: stats.score >= 80 ? 'Good' : stats.score >= 70 ? 'Fair' : 'Poor',
        riskLevel: stats.score >= 80 ? 'Low' : stats.score >= 70 ? 'Medium' : 'High'
      }
    }
    return result
  }

  generateMockTrendData(tenantId, daysBack = 30) {
    const history = []
    const today = new Date()

    for (let i = daysBack; i >= 0; i--) {
      const date = new Date(today)
      date.setDate(date.getDate() - i)
      const score = 72 + Math.sin(i / 5) * 3 + Math.random() * 2
      history.push({
        date: date.toISOString().split('T')[0],
        score: Math.min(100, Math.max(0, score))
      })
    }

    return {
      direction: '📈 Improving',
      velocity: 0.45,
      projection: 82.1,
      history
    }
  }

  generateMockDriftData(tenantId, daysBack = 7) {
    return {
      regressions: [
        { controlId: 'TG-ID-001', severity: 'Critical', timestamp: new Date(Date.now() - 2 * 3600000).toISOString() },
        { controlId: 'TG-EXO-045', severity: 'High', timestamp: new Date(Date.now() - 24 * 3600000).toISOString() }
      ],
      remediations: [
        { controlId: 'TG-AUTH-005', severity: 'Medium', timestamp: new Date(Date.now() - 12 * 3600000).toISOString() }
      ],
      scoreDelta: -2.3,
      severity: 'High',
      trend: 'Declining',
      regressionCount: 2,
      remediationCount: 1
    }
  }

  generateMockExecutiveSummary(tenantId) {
    return {
      overallCompliance: {
        score: 75.5,
        status: 'Fair',
        riskLevel: 'Medium'
      },
      trend: {
        direction: '📈 Improving',
        velocity: 0.45,
        projection30Days: 82.1
      },
      topRisks: [
        { domain: 'TG-EXO', score: 68.4, failingControls: 18 },
        { domain: 'TG-SPO', score: 72.1, failingControls: 22 },
        { domain: 'TG-INT', score: 75.3, failingControls: 19 }
      ],
      recommendations: [
        'Address 156 failing controls across all domains by severity',
        'TG-EXO domain requires immediate attention (68.4%)',
        'Prioritize critical and high-severity control remediations',
        'Focus on remediation velocity to maintain positive trend',
        'Review and update security policies in low-scoring domains'
      ],
      nextSteps: [
        'Review top 5 failing controls in TG-EXO',
        'Prioritize regressions by severity',
        'Focus remediation efforts on critical controls',
        'Implement control fixes in TG-EXO (highest impact)',
        'Schedule compliance review in 7 days'
      ]
    }
  }

  generateMockDomainControls(domain) {
    // Extended control templates for realistic 1000+ control generation
    const controlTemplates = {
      'TG-ID': [
        'MFA for Administrative Access', 'Password Policy Enforcement', 'User Access Reviews',
        'Privileged Identity Management', 'Identity Protection Policies', 'Sign-in Risk Detection',
        'User Risk Detection', 'Conditional Access Policies', 'Legacy Protocol Blocking', 'Session Management',
        'Account Lockout Policies', 'Password Expiration', 'Unused Account Cleanup', 'Directory Sync Configuration',
        'User Provisioning Controls', 'Guest User Management', 'B2B Collaboration Settings', 'Identity Governance',
        'Access Entitlement Reviews', 'Privileged User Monitoring', 'Dormant Account Detection', 'Account Creation Audit',
        'Password Reset Policy', 'Multi-Factor Authentication Enforcement', 'Service Account Management'
      ],
      'TG-AUTH': [
        'Strong Authentication Methods', 'SSPR Configuration', 'MFA Enforcement', 'Passwordless Sign-in',
        'Risk-based Authentication', 'Token Lifetime Settings', 'Session Timeout Policies', 'Authentication Context Rules',
        'Certificate-based Authentication', 'FIDO2 Support', 'Windows Hello Configuration', 'Smart Card Configuration',
        'Temporary Access Pass', 'Authentication Strength Policy', 'Authentication Method Registration', 'Authenticator App Setup',
        'Phone Sign-in Configuration', 'SMS Authentication', 'Email OTP', 'Security Questions'
      ],
      'TG-EXO': [
        'Malware Protection', 'Phishing Protection', 'Spam Filtering', 'DLP Policies', 'Transport Rules',
        'Mail Flow Rules', 'External Recipient Warnings', 'Attachment Blocking', 'URL Rewriting', 'Safe Sender Lists',
        'Encryption Policies', 'Message Expiration', 'Auditing Configuration', 'Retention Policies', 'Archive Setup',
        'Litigation Hold', 'EDiscovery', 'Mailbox Auditing', 'Admin Audit Logging', 'Shared Mailbox Configuration',
        'Room Mailbox Settings', 'Distribution Group Management', 'Dynamic Group Configuration', 'Email Authentication',
        'SPF Configuration', 'DKIM Setup', 'DMARC Implementation', 'BIMI Setup', 'ARC Authentication'
      ],
      'TG-SPO': [
        'External Sharing Controls', 'File Sharing Restrictions', 'Guest Access Policies', 'Device Access Controls',
        'Data Classification', 'Retention Policies', 'DLP Policies', 'Access Review Frequency', 'Sensitive Content Handling',
        'Site Permissions Management', 'List Permissions', 'Library Security', 'Versioning Controls', 'Audit Logging',
        'Site Collection Backup', 'Compliance Features', 'Information Barriers', 'Conditional Access Integration',
        'Malware Detection', 'Advanced Threat Protection', 'Ransomware Protection', 'File Sync Configuration'
      ],
      'TG-TEAMS': [
        'Guest Access Controls', 'Meeting Recording Policy', 'Channel Moderation', 'Message Retention', 'File Sharing Settings',
        'App Permissions', 'Live Event Policies', 'Calling Policies', 'Device Configuration', 'Threat Protection',
        'Meeting Encryption', 'Participant Restrictions', 'Chat Retention', 'Channel Settings', 'Team Privacy',
        'Member Permissions', 'Guest Expiration', 'External Access', 'Federation Settings', 'Bot Management',
        'App Installation', 'Custom Apps', 'Org-wide Settings', 'Analytics Configuration'
      ],
      'TG-PUR': [
        'Purchase Order Controls', 'Vendor Management', 'Contract Compliance', 'Spending Policies', 'Approval Workflows',
        'Budget Controls', 'Cost Allocation', 'Procurement Rules', 'Vendor Risk Assessment', 'Compliance Verification'
      ],
      'TG-DEF': [
        'Defender for Endpoint', 'Defender for Identity', 'Defender for Office 365', 'Defender for Cloud Apps',
        'Vulnerability Management', 'Threat Intelligence', 'Incident Response', 'Security Alerts', 'Alert Tuning',
        'Custom Detection Rules', 'IOC Management', 'SIEM Integration', 'Threat Analytics'
      ],
      'TG-INT': [
        'Infrastructure Hardening', 'Network Segmentation', 'Firewall Rules', 'VPN Configuration', 'Proxy Settings',
        'Load Balancer Security', 'DDoS Protection', 'WAF Configuration', 'SSL/TLS Settings', 'DNS Security'
      ],
      'TG-DLP': [
        'Sensitive Data Types', 'Custom DLP Rules', 'Policy Scopes', 'Exception Management', 'Alert Configuration',
        'Endpoint DLP', 'Cloud App Security', 'On-premises DLP', 'Content Classification', 'Encryption Rules'
      ],
      'TG-AUD': [
        'Audit Logging Configuration', 'Retention Settings', 'Search Capabilities', 'Alert Policies', 'Export Functions',
        'Archive Configuration', 'Compliance Holds', 'eDiscovery Setup', 'Report Generation', 'Monitoring'
      ],
      'TG-MON': [
        'Alert Configuration', 'Monitoring Rules', 'Dashboard Setup', 'Report Generation', 'Incident Tracking',
        'Health Checks', 'Performance Monitoring', 'Log Analysis', 'Threshold Settings', 'Escalation Policies'
      ],
      'TG-NET': [
        'Network Access Control', 'Bandwidth Management', 'Traffic Monitoring', 'Intrusion Detection', 'Intrusion Prevention',
        'Packet Inspection', 'Traffic Encryption', 'VPN Requirements', 'Zero Trust Enforcement'
      ],
      'TG-GOV': [
        'Governance Framework', 'Policy Enforcement', 'Compliance Monitoring', 'Risk Management', 'Change Management',
        'Incident Management', 'Problem Management', 'Release Management', 'Service Level Management'
      ],
      'TG-BKP': [
        'Backup Configuration', 'Recovery Testing', 'Retention Policies', 'Encryption Settings', 'Replication Setup',
        'Backup Monitoring', 'Disaster Recovery Planning', 'Business Continuity', 'Failover Testing'
      ],
      'TG-COMP': [
        'Compliance Frameworks', 'Regulatory Requirements', 'Standard Adherence', 'Audit Preparation', 'Documentation',
        'Training Requirements', 'Policy Updates', 'Gap Analysis'
      ],
      'TG-AI': [
        'AI Model Governance', 'Data Protection for AI', 'Bias Detection', 'Model Audit', 'Transparency Rules',
        'AI Safety Policies', 'Algorithm Monitoring', 'Responsible AI Practices'
      ],
      'TG-APP': [
        'Application Security', 'Vulnerability Scanning', 'Secure Coding', 'Code Review', 'Dependency Management',
        'Container Security', 'API Security', 'Microservices Security', 'Serverless Security'
      ],
      'TG-CA': [
        'Conditional Access Rules', 'Risk Evaluation', 'Device Compliance', 'Location Policies', 'Client App Filtering',
        'Session Controls', 'Grant Controls', 'Assignment Rules', 'Exclusion Management'
      ],
      'TG-ROLE': [
        'Role-based Access Control', 'Custom Roles', 'Privilege Escalation', 'Role Assignment', 'Role Reviews',
        'Separation of Duties', 'Privilege Management', 'Delegation Controls', 'Role Monitoring'
      ],
      'TG-DEV': [
        'Development Environment Security', 'Source Code Protection', 'Build Pipeline Security', 'Deployment Controls',
        'Secret Management', 'Supply Chain Security', 'Infrastructure as Code', 'Container Registry Security'
      ]
    }

    const templates = controlTemplates[domain] || [
      'Security Control 1', 'Security Control 2', 'Security Control 3', 'Security Control 4', 'Security Control 5'
    ]

    // Generate controls with realistic distribution
    const controls = []
    const severities = ['Critical', 'High', 'Medium', 'Low']
    const statuses = ['PASS', 'FAIL', 'PARTIAL']
    const statusWeights = [0.6, 0.2, 0.2] // 60% pass, 20% fail, 20% partial

    templates.forEach((template, templateIndex) => {
      // Create multiple controls per template for more variety (5-8 variations per template)
      const variationsCount = Math.floor(Math.random() * 4) + 5

      for (let i = 0; i < variationsCount; i++) {
        // Random status weighted toward pass
        const rand = Math.random()
        let status
        if (rand < statusWeights[0]) status = 'PASS'
        else if (rand < statusWeights[0] + statusWeights[1]) status = 'FAIL'
        else status = 'PARTIAL'

        // Critical controls are more likely to fail
        const isCritical = Math.random() < 0.15
        if (isCritical) {
          status = Math.random() < 0.7 ? 'FAIL' : 'PARTIAL'
        }

        const severity = isCritical ? 'Critical' : severities[Math.floor(Math.random() * 3) + 1]
        const controlId = `${domain}-${String(templateIndex * 10 + i + 1).padStart(3, '0')}`

        controls.push({
          id: controlId,
          name: `${template} (Variation ${i + 1})`,
          severity: severity,
          status: status,
          score: status === 'PASS' ? 100 : status === 'PARTIAL' ? 50 : 0,
          lastChecked: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
          description: `Validates ${template.toLowerCase()} configuration and compliance requirements`,
          remediation: status === 'PASS' ? null : `Review and update ${template.toLowerCase()} settings to meet compliance requirements. Last checked: ${new Date().toLocaleDateString()}`,
          driftDetected: Math.random() < 0.1
        })
      }
    })

    return controls
  }
}

export const mockComplianceEngine = new MockComplianceEngine()
