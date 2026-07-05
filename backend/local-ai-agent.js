// ============================================================
// Local AI Agent - Analyzes agent data without external API
// ============================================================

export class LocalAIAgent {
  constructor() {
    this.knowledgeBase = {}
  }

  /**
   * Train the agent with current agent data
   */
  train(agentData) {
    this.knowledgeBase = {
      name: agentData.name,
      status: agentData.status,
      statusLabel: agentData.statusLabel,
      stats: agentData.stats,
      timestamp: new Date().toISOString(),
      recentData: this.extractKeyFindings(agentData)
    }
  }

  /**
   * Extract key findings from agent data
   */
  extractKeyFindings(agentData) {
    const agentId = agentData.agentId
    const findings = []

    if (agentId === 'security') {
      const { totalRiskyUsers, highRisk, mediumRisk, lowRisk, recentDetections } = agentData.stats
      findings.push(`Total risky users: ${totalRiskyUsers}`)
      if (highRisk > 0) findings.push(`⚠️ HIGH RISK: ${highRisk} users`)
      if (mediumRisk > 0) findings.push(`⚠️ MEDIUM RISK: ${mediumRisk} users`)
      if (recentDetections > 0) findings.push(`Recent detections: ${recentDetections}`)
      if (totalRiskyUsers === 0) findings.push('✅ No risky users detected - environment is secure')
    }

    if (agentId === 'config') {
      const { total, passed, failed, complianceScore, criticalIssues } = agentData.stats
      const passPercentage = Math.round((passed / total) * 100)
      findings.push(`CIS Compliance: ${passed}/${total} (${passPercentage}%)`)
      findings.push(`Compliance Score: ${complianceScore}%`)
      if (criticalIssues > 0) findings.push(`⚠️ CRITICAL: ${criticalIssues} critical issues`)
      if (complianceScore >= 80) findings.push('✅ Compliance is good')
      else if (complianceScore >= 70) findings.push('⚠️ Compliance needs improvement')
      else findings.push('🔴 Compliance is critical - urgent action needed')
    }

    if (agentId === 'approval') {
      const { pending, approved, rejected, avgApprovalTime } = agentData.stats
      findings.push(`Pending requests: ${pending}`)
      findings.push(`Approved: ${approved} | Rejected: ${rejected}`)
      findings.push(`Avg approval time: ${avgApprovalTime}`)
      if (pending > 10) findings.push('⚠️ High number of pending requests - SLA at risk')
      if (pending === 0) findings.push('✅ No pending requests')
    }

    if (agentId === 'execution') {
      const { actionsExecuted, successRate, failures, pending } = agentData.stats
      findings.push(`Executed actions: ${actionsExecuted}`)
      findings.push(`Success rate: ${successRate}%`)
      if (failures > 0) findings.push(`⚠️ Failed actions: ${failures}`)
      if (pending > 0) findings.push(`Pending: ${pending}`)
      if (successRate === 100) findings.push('✅ All actions executing successfully')
    }

    if (agentId === 'audit') {
      const { eventCount, anomalies, typesTracked } = agentData.stats
      findings.push(`Total events tracked: ${eventCount}`)
      findings.push(`Anomalies detected: ${anomalies}`)
      findings.push(`Activity types: ${typesTracked}`)
      if (anomalies > 5) findings.push('⚠️ Multiple anomalies - investigate further')
    }

    if (agentId === 'compliance') {
      const { dlpPolicies, retentionPolicies, complianceScore } = agentData.stats
      findings.push(`DLP Policies: ${dlpPolicies}`)
      findings.push(`Retention Policies: ${retentionPolicies}`)
      findings.push(`Compliance Score: ${complianceScore}%`)
      if (dlpPolicies === 0) findings.push('⚠️ No DLP policies configured')
    }

    return findings
  }

  /**
   * Generate response based on trained knowledge and user question
   */
  respond(userQuestion, agentData) {
    const question = userQuestion.toLowerCase()
    const agentId = agentData.agentId
    const stats = agentData.stats

    // Security Agent responses
    if (agentId === 'security') {
      if (question.includes('risk') || question.includes('threat')) {
        const { totalRiskyUsers, highRisk, recentDetections } = stats
        if (totalRiskyUsers === 0) {
          return '✅ Your environment is secure with no detected risks. Continue monitoring regularly to maintain this security posture.'
        }
        const riskLevel = highRisk > 0 ? 'CRITICAL' : highRisk > 2 ? 'HIGH' : 'MEDIUM'
        return `Current risk status: ${riskLevel}. You have ${totalRiskyUsers} risky user(s) with ${highRisk} high-risk detections. Investigate these users immediately and consider implementing additional authentication controls.`
      }

      if (question.includes('remediat') || question.includes('recommend') || question.includes('fix')) {
        return `Recommended actions: 1) Review high-risk user accounts for suspicious activity 2) Reset credentials for compromised accounts 3) Enable MFA for all users 4) Implement conditional access policies 5) Monitor sign-in patterns regularly`
      }

      if (question.includes('concern') || question.includes('should i')) {
        const { totalRiskyUsers, highRisk } = stats
        if (totalRiskyUsers > 5 || highRisk > 2) {
          return 'Yes, there are active security concerns. High-risk users detected. Immediate investigation and remediation actions are recommended.'
        }
        return 'No major concerns at this time. Continue regular monitoring and maintain security best practices.'
      }

      if (question.includes('frequent') || question.includes('often') || question.includes('how often')) {
        return 'Review security risks at least weekly, or daily if you have active threats. Consider setting up alerts for high-risk detections to respond immediately.'
      }
    }

    // Config Agent responses
    if (agentId === 'config') {
      if (question.includes('failing') || question.includes('fail')) {
        const { failed, criticalIssues } = stats
        return `${failed} CIS controls are currently failing with ${criticalIssues} critical failures. These should be addressed immediately as they represent security gaps in your M365 configuration.`
      }

      if (question.includes('gap') || question.includes('compliance')) {
        const { total, passed, complianceScore } = stats
        const failed = total - passed
        return `Current compliance gaps: ${failed} controls failing out of ${total}. Compliance score: ${complianceScore}%. Priority areas: External security, Email protection, Data governance, and Identity management.`
      }

      if (question.includes('priorit') || question.includes('first')) {
        const { complianceScore } = stats
        return 'Priority order: 1) Critical email security controls 2) MFA/Identity protection 3) Data protection and DLP 4) Audit logging 5) Governance policies. Focus on security controls that directly impact user safety.'
      }

      if (question.includes('improve')) {
        const { complianceScore } = stats
        return `To improve from ${complianceScore}% compliance: Enable external sender warnings, enforce MFA, restrict external sharing, enable audit logging, configure DLP policies, and implement retention policies. Start with highest-impact controls.`
      }
    }

    // Approval Agent responses
    if (agentId === 'approval') {
      if (question.includes('pending') || question.includes('request')) {
        const { pending } = stats
        return `${pending} approval request(s) pending. ${pending > 0 ? 'Review and process these requests promptly to avoid SLA violations.' : 'All requests processed. Good job staying current.'}`
      }

      if (question.includes('time') || question.includes('approval time')) {
        const { avgApprovalTime } = stats
        return `Average approval time: ${avgApprovalTime}. This is a reasonable timeframe. Monitor for any bottlenecks in the approval workflow.`
      }

      if (question.includes('sla') || question.includes('violation')) {
        const { pending } = stats
        return pending > 10 ? '⚠️ SLA at risk: Too many pending requests. Prioritize approvals.' : '✅ SLA on track. Continue current pace.'
      }

      if (question.includes('urgent') || question.includes('priority')) {
        return 'Review requests in this order: 1) License assignments 2) Group additions 3) App access 4) Security-related changes. License assignments typically need fastest turnaround.'
      }
    }

    // Execution Agent responses
    if (agentId === 'execution') {
      if (question.includes('executed') || question.includes('action')) {
        const { actionsExecuted } = stats
        return `${actionsExecuted} actions have been executed. These represent provisioning, permission grants, and configuration changes implemented automatically.`
      }

      if (question.includes('failed') || question.includes('fail')) {
        const { failures } = stats
        return failures > 0
          ? `${failures} action(s) failed. Review the failure logs to identify root causes. Common issues: permission problems, invalid parameters, or service disruptions.`
          : '✅ No failures. All executions successful.'
      }

      if (question.includes('success') || question.includes('rate')) {
        const { successRate, actionsExecuted } = stats
        return `Success rate: ${successRate}%. ${successRate === 100 ? '✅ Excellent - all actions executing flawlessly.' : 'Some actions failing - investigate and fix issues.'}`
      }

      if (question.includes('pending')) {
        const { pending } = stats
        return pending > 0
          ? `${pending} action(s) pending execution. These are waiting for approval or prerequisites to complete.`
          : 'No pending actions. All work has been executed.'
      }
    }

    // Audit Agent responses
    if (agentId === 'audit') {
      if (question.includes('anomal')) {
        const { anomalies } = stats
        return anomalies > 0
          ? `${anomalies} anomalies detected. Review these carefully: unusual bulk operations, unexpected permission changes, or abnormal access patterns. These may indicate security issues.`
          : '✅ No anomalies detected. Audit logs show normal patterns.'
      }

      if (question.includes('suspicious') || question.includes('investigate')) {
        const { anomalies } = stats
        return `Focus investigation on: 1) Admin account activities 2) Bulk deletion/modification events 3) External sharing changes 4) New application access 5) Permission escalations. Review timestamps and affected users.`
      }

      if (question.includes('monitor') || question.includes('improve')) {
        return 'Audit monitoring improvements: 1) Set alerts for sensitive operations 2) Review logs daily 3) Create baselines for normal activity 4) Track permission changes 5) Monitor external sharing events'
      }
    }

    // Compliance Agent responses
    if (agentId === 'compliance') {
      if (question.includes('status') || question.includes('complian')) {
        const { dlpPolicies, retentionPolicies, complianceScore } = stats
        return `Compliance status: ${complianceScore}%. ${dlpPolicies} DLP + ${retentionPolicies} retention policies active. ${complianceScore >= 80 ? '✅ Good standing' : '⚠️ Needs improvement'}`
      }

      if (question.includes('violation') || question.includes('policy')) {
        const { dlpPolicies } = stats
        return dlpPolicies > 0
          ? `DLP policies are protecting data. Monitor violation reports for sensitive data exposure attempts. Review and adjust rules based on false positives.`
          : '⚠️ No DLP policies configured. Implement data loss prevention policies immediately.'
      }

      if (question.includes('improve') || question.includes('requirement')) {
        return 'Compliance improvements: 1) Implement all required DLP policies 2) Enable retention policies 3) Configure sensitivity labels 4) Audit data access 5) Document policies and procedures'
      }
    }

    // Generic fallback responses
    if (question.includes('what should') || question.includes('recommend')) {
      return `Based on current data: Focus on high-impact items first. Implement fixes in this order: 1) Security issues 2) Compliance gaps 3) Pending approvals 4) Failed actions 5) Monitoring improvements`
    }

    if (question.includes('insight') || question.includes('provide')) {
      const findings = this.extractKeyFindings(agentData)
      return `Key insights: ${findings.slice(0, 3).join(' | ')}. These are the most important metrics to monitor for this agent.`
    }

    // Default response
    return `I'm analyzing ${agentData.name} data. Current status: ${agentData.statusLabel}. Please ask specific questions about risks, compliance, performance, or recommendations.`
  }
}

export const localAIAgent = new LocalAIAgent()
