import React, { useState, useEffect, useRef } from 'react'
import { Shield, Mail, Globe, Users, Monitor, AlertTriangle, Lock, ChevronRight, X, Copy, RotateCcw } from 'lucide-react'

const TenantGuardNew = () => {
  // ============================================================
  // CONSTANTS & MOCK DATA
  // ============================================================

  const SECURE_BASELINE = [
    { setting: "Security Defaults", expected: "Enabled", current: "Disabled", since: "2025-06-14T09:12:00Z", drifted: true },
    { setting: "MFA for All Admins", expected: "Enforced", current: "Enforced", since: null, drifted: false },
    { setting: "Legacy Auth", expected: "Blocked", current: "Allowed", since: "2025-06-17T14:33:00Z", drifted: true },
    { setting: "Audit Log Retention", expected: "180 days", current: "90 days", since: "2025-06-10T08:00:00Z", drifted: true },
    { setting: "Conditional Access", expected: "≥3 active", current: "4 active", since: null, drifted: false },
    { setting: "PIM for Privileged Roles", expected: "Enabled", current: "Enabled", since: null, drifted: false },
    { setting: "DLP Policies", expected: "≥2 active", current: "2 active", since: null, drifted: false },
    { setting: "External Sharing", expected: "Disabled", current: "Disabled", since: null, drifted: false },
  ]

  const SCENARIOS = [
    {
      id: "A1", scenario: "account-takeover", service: "Entra", severity: "P1",
      title: "Impossible Travel Detected",
      actor: "john@contoso.com", target: "Sign-in from IN → US (32 min apart)",
      time: "2025-06-20T08:47:00Z"
    },
    {
      id: "A2", scenario: "account-takeover", service: "Entra", severity: "P1",
      title: "MFA Disabled for Admin Account",
      actor: "admin@contoso.com", target: "john@contoso.com",
      time: "2025-06-20T08:51:23Z"
    },
    {
      id: "A3", scenario: "account-takeover", service: "Exchange", severity: "P1",
      title: "External Mail Forwarding Rule Created",
      actor: "john@contoso.com", target: "attacker@gmail.com",
      time: "2025-06-20T08:53:41Z"
    },
    {
      id: "A4", scenario: "account-takeover", service: "SharePoint", severity: "P2",
      title: "Mass File Download — 340 files",
      actor: "john@contoso.com", target: "/Finance/Q2Reports",
      time: "2025-06-20T09:01:17Z"
    },
    {
      id: "B1", scenario: "priv-escalation", service: "Entra", severity: "P1",
      title: "Global Administrator Role Added",
      actor: "svc-deploy@contoso.com", target: "newadmin@contoso.com",
      time: "2025-06-20T07:14:00Z"
    },
    {
      id: "B2", scenario: "priv-escalation", service: "Entra", severity: "P1",
      title: "Permanent Role Assignment (no PIM)",
      actor: "svc-deploy@contoso.com", target: "newadmin@contoso.com",
      time: "2025-06-20T07:14:05Z"
    },
    {
      id: "B3", scenario: "priv-escalation", service: "Entra", severity: "P1",
      title: "Conditional Access Policy Disabled",
      actor: "newadmin@contoso.com", target: "Policy: Require MFA for Admins",
      time: "2025-06-20T07:22:31Z"
    },
    {
      id: "B4", scenario: "priv-escalation", service: "Entra", severity: "P2",
      title: "New App Registration Created",
      actor: "newadmin@contoso.com", target: "App: DataSync-Prod",
      time: "2025-06-20T07:29:44Z"
    },
    {
      id: "C1", scenario: "app-consent", service: "Entra", severity: "P1",
      title: "App Granted Directory.ReadWrite.All",
      actor: "user@contoso.com", target: "App: QuickDocs Pro",
      time: "2025-06-20T06:33:00Z"
    },
    {
      id: "C2", scenario: "app-consent", service: "Entra", severity: "P1",
      title: "Admin Consent Granted to New App",
      actor: "user@contoso.com", target: "App: QuickDocs Pro",
      time: "2025-06-20T06:33:02Z"
    },
    {
      id: "C3", scenario: "app-consent", service: "Exchange", severity: "P2",
      title: "App Granted Mail.ReadWrite",
      actor: "QuickDocs Pro (App)", target: "All mailboxes",
      time: "2025-06-20T06:34:18Z"
    },
    {
      id: "D1", scenario: "ransomware", service: "Defender", severity: "P1",
      title: "Ransomware Behavior Detected",
      actor: "DESKTOP-7K2MNP", target: "sarah@contoso.com",
      time: "2025-06-20T05:58:00Z"
    },
    {
      id: "D2", scenario: "ransomware", service: "Intune", severity: "P1",
      title: "Device Compliance Policy Removed",
      actor: "it-admin@contoso.com", target: "Policy: Windows Defender Required",
      time: "2025-06-20T05:44:12Z"
    },
    {
      id: "D3", scenario: "ransomware", service: "Intune", severity: "P1",
      title: "BitLocker Disabled on Endpoint",
      actor: "DESKTOP-7K2MNP", target: "sarah@contoso.com",
      time: "2025-06-20T05:55:39Z"
    },
    {
      id: "D4", scenario: "ransomware", service: "Purview", severity: "P1",
      title: "DLP Policy Deleted",
      actor: "it-admin@contoso.com", target: "Policy: Sensitive Data — All Sites",
      time: "2025-06-20T05:46:00Z"
    },
  ]

  const SERVICES = [
    { name: "Entra", icon: Shield, color: "#1A6BFF" },
    { name: "Exchange", icon: Mail, color: "#1A6BFF" },
    { name: "SharePoint", icon: Globe, color: "#1A6BFF" },
    { name: "Teams", icon: Users, color: "#1A6BFF" },
    { name: "Intune", icon: Monitor, color: "#1A6BFF" },
    { name: "Defender", icon: AlertTriangle, color: "#1A6BFF" },
    { name: "Purview", icon: Lock, color: "#1A6BFF" },
  ]

  const SOURCE_HEALTH = [
    { name: "Entra Sign-ins", interval: 5, lastPolled: "2025-06-20T11:50:00Z" },
    { name: "Risky Users", interval: 5, lastPolled: "2025-06-20T11:50:00Z" },
    { name: "Audit Logs", interval: 5, lastPolled: "2025-06-20T11:49:00Z" },
    { name: "Defender", interval: 5, lastPolled: "2025-06-20T11:48:00Z" },
    { name: "Exchange Audit", interval: 15, lastPolled: "2025-06-20T11:45:00Z" },
    { name: "Intune", interval: 30, lastPolled: "2025-06-20T11:40:00Z" },
    { name: "SharePoint Audit", interval: 15, lastPolled: "2025-06-20T11:46:00Z" },
    { name: "Service Health", interval: 30, lastPolled: "2025-06-20T11:30:00Z" },
    { name: "Config Drift", interval: 60, lastPolled: "2025-06-20T11:00:00Z" },
  ]

  // ============================================================
  // STATE
  // ============================================================

  const [selectedAlert, setSelectedAlert] = useState(null)
  const [investigation, setInvestigation] = useState(null)
  const [investigationLoading, setInvestigationLoading] = useState(false)
  const [investigationError, setInvestigationError] = useState(null)
  const [driftOpen, setDriftOpen] = useState(false)
  const [copiedAction, setCopiedAction] = useState(null)
  const ringRef = useRef(null)
  const investigationPanelRef = useRef(null)

  // ============================================================
  // CALCULATIONS
  // ============================================================

  const alertsByService = SCENARIOS.reduce((acc, alert) => {
    if (!acc[alert.service]) acc[alert.service] = []
    acc[alert.service].push(alert)
    return acc
  }, {})

  Object.keys(alertsByService).forEach(service => {
    alertsByService[service].sort((a, b) => {
      const severityOrder = { P1: 0, P2: 1, P3: 2 }
      return severityOrder[a.severity] - severityOrder[b.severity]
    })
  })

  const riskScore = SCENARIOS.reduce((total, alert) => {
    const points = alert.severity === 'P1' ? 25 : alert.severity === 'P2' ? 10 : 3
    return Math.min(total + points, 100)
  }, 0)

  const getPostureLabel = () => {
    if (riskScore >= 75) return 'CRITICAL'
    if (riskScore >= 50) return 'HIGH RISK'
    if (riskScore >= 20) return 'ELEVATED'
    return 'SECURE'
  }

  const getPostureColor = () => {
    const label = getPostureLabel()
    if (label === 'CRITICAL') return '#FF3B3B'
    if (label === 'HIGH RISK') return '#F59E0B'
    if (label === 'ELEVATED') return '#F59E0B'
    return '#10B981'
  }

  const driftedCount = SECURE_BASELINE.filter(b => b.drifted).length

  const getSourceStatus = (lastPolled, interval) => {
    const lastTime = new Date(lastPolled)
    const now = new Date('2025-06-20T11:50:46Z')
    const diffMins = (now - lastTime) / (1000 * 60)
    if (diffMins <= interval) return { status: 'healthy', label: 'OK' }
    if (diffMins <= interval * 2) return { status: 'overdue', label: 'Overdue' }
    return { status: 'lost', label: 'Signal lost' }
  }

  // ============================================================
  // HANDLERS
  // ============================================================

  const handleInvestigate = async (alert) => {
    setSelectedAlert(alert)
    setInvestigation(null)
    setInvestigationError(null)
    setInvestigationLoading(true)

    const scenarioAlerts = SCENARIOS.filter(a => a.scenario === alert.scenario)
    const payload = { alert, scenarioAlerts }

    try {
      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': process.env.REACT_APP_CLAUDE_API_KEY || '',
          'anthropic-version': '2023-06-01',
        },
        body: JSON.stringify({
          model: 'claude-opus-4-1',
          max_tokens: 1024,
          system: `You are an M365 security analyst inside a Tenant Guard dashboard. You will receive a JSON object describing a security alert and its correlated scenario context. Respond ONLY with a valid JSON object — no markdown, no preamble, no explanation outside the JSON.

Response schema:
{
  "summary": "2-sentence plain-language description of what happened",
  "impact": "2-3 sentences on security risk and blast radius",
  "riskScore": <integer 0-100>,
  "timeline": [
    { "offset": "T+0:00", "event": "description of what happened at this moment" }
  ],
  "actions": ["Action 1", "Action 2", "Action 3", "Action 4"],
  "remediationScript": "# PowerShell or Graph API commands with inline comments"
}`,
          messages: [
            {
              role: 'user',
              content: JSON.stringify(payload),
            },
          ],
        }),
      })

      if (!response.ok) throw new Error('API request failed')

      let fullText = ''
      const reader = response.body.getReader()
      const decoder = new TextDecoder()

      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        fullText += decoder.decode(value)
      }

      const data = JSON.parse(fullText)
      const content = data.content[0].text
      const parsed = JSON.parse(content)

      setInvestigation(parsed)
    } catch (err) {
      setInvestigationError('Signal lost. Check your connection and try again.')
    } finally {
      setInvestigationLoading(false)
    }
  }

  const handleRetry = () => {
    if (selectedAlert) handleInvestigate(selectedAlert)
  }

  const handleCopyScript = () => {
    if (investigation?.remediationScript) {
      navigator.clipboard.writeText(investigation.remediationScript)
      setCopiedAction('script')
      setTimeout(() => setCopiedAction(null), 2000)
    }
  }

  const handleRingClick = (serviceName) => {
    const element = document.getElementById(`service-${serviceName}`)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  // ============================================================
  // COMPONENTS
  // ============================================================

  const PerimeterRing = () => {
    const segments = 7
    const radius = 60
    const segmentAngle = 360 / segments

    const getSegmentColor = (serviceName) => {
      const serviceAlerts = alertsByService[serviceName] || []
      if (serviceAlerts.some(a => a.severity === 'P1')) return '#FF3B3B'
      if (serviceAlerts.some(a => a.severity === 'P2')) return '#F59E0B'
      if (serviceAlerts.length > 0) return '#3B82F6'
      return '#10B981'
    }

    return (
      <div className="flex flex-col items-center mb-8">
        <svg
          ref={ringRef}
          width="280"
          height="280"
          viewBox="0 0 280 280"
          className="animate-pulse-once"
        >
          {Array.from({ length: segments }).map((_, i) => {
            const startAngle = (i * segmentAngle - 90) * (Math.PI / 180)
            const endAngle = ((i + 1) * segmentAngle - 90) * (Math.PI / 180)

            const x1 = 140 + radius * Math.cos(startAngle)
            const y1 = 140 + radius * Math.sin(startAngle)
            const x2 = 140 + radius * Math.cos(endAngle)
            const y2 = 140 + radius * Math.sin(endAngle)

            const serviceName = SERVICES[i].name
            const color = getSegmentColor(serviceName)

            return (
              <g key={i}>
                <line
                  x1="140"
                  y1="140"
                  x2={x1}
                  y2={y1}
                  stroke={color}
                  strokeWidth="4"
                  opacity="0.3"
                />
                <circle
                  cx={140 + (radius + 8) * Math.cos((i + 0.5) * segmentAngle * (Math.PI / 180) - Math.PI / 2)}
                  cy={140 + (radius + 8) * Math.sin((i + 0.5) * segmentAngle * (Math.PI / 180) - Math.PI / 2)}
                  r="6"
                  fill={color}
                  style={{ cursor: 'pointer' }}
                  onClick={() => handleRingClick(serviceName)}
                />
              </g>
            )
          })}
          <circle cx="140" cy="140" r="45" fill="none" stroke="#1C2B3A" strokeWidth="2" />
          <text x="140" y="150" textAnchor="middle" fontSize="24" fill="#1A6BFF" fontFamily="JetBrains Mono" fontWeight="bold">
            {riskScore}
          </text>
        </svg>
      </div>
    )
  }

  // ============================================================
  // RENDER
  // ============================================================

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;600&display=swap');

        @keyframes pulse-once {
          0% { opacity: 1; }
          50% { opacity: 0.5; }
          100% { opacity: 1; }
        }

        .animate-pulse-once {
          animation: pulse-once 2s ease-in-out 1;
        }
      `}</style>

      <div className="min-h-screen bg-gradient-to-br from-[#080C14] to-[#0F1923] text-[#E2E8F0] font-sans flex flex-col">
        {/* HEADER & RING */}
        <div className="sticky top-0 z-40 bg-[#080C14] border-b border-[#1C2B3A] p-8">
          <div className="max-w-7xl mx-auto">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h1 className="text-4xl font-bold mb-1">Contoso Corp</h1>
                <p className="text-[#94A3B8] text-sm">contoso.onmicrosoft.com</p>
              </div>
              <div className="text-right">
                <div className="text-5xl font-bold font-mono" style={{ color: getPostureColor() }}>
                  {getPostureLabel()}
                </div>
                <p className="text-[#94A3B8] text-xs mt-1 font-mono">{riskScore}/100</p>
              </div>
            </div>

            <PerimeterRing />

            <div className="grid grid-cols-6 gap-4">
              <div className="bg-[#0F1923] p-3 rounded border border-[#1C2B3A]">
                <div className="text-2xl font-mono font-bold text-[#FF3B3B]">4</div>
                <div className="text-xs text-[#94A3B8]">users no MFA</div>
              </div>
              <div className="bg-[#0F1923] p-3 rounded border border-[#1C2B3A]">
                <div className="text-2xl font-mono font-bold text-[#F59E0B]">2</div>
                <div className="text-xs text-[#94A3B8]">risky users</div>
              </div>
              <div className="bg-[#0F1923] p-3 rounded border border-[#1C2B3A]">
                <div className="text-2xl font-mono font-bold text-[#FF3B3B]">3</div>
                <div className="text-xs text-[#94A3B8]">active incidents</div>
              </div>
              <div className="bg-[#0F1923] p-3 rounded border border-[#1C2B3A]">
                <div className="text-2xl font-mono font-bold text-[#F59E0B]">1</div>
                <div className="text-xs text-[#94A3B8]">non-compliant device</div>
              </div>
              <div className="bg-[#0F1923] p-3 rounded border border-[#1C2B3A]">
                <div className="text-2xl font-mono font-bold text-[#3B82F6]">2</div>
                <div className="text-xs text-[#94A3B8]">fwd rules</div>
              </div>
              <div className="bg-[#0F1923] p-3 rounded border border-[#1C2B3A]">
                <div className="text-2xl font-mono font-bold text-[#FF3B3B]">5</div>
                <div className="text-xs text-[#94A3B8]">anon links</div>
              </div>
            </div>
          </div>
        </div>

        {/* MAIN CONTENT */}
        <div className="flex-1 flex">
          <div className="flex-1 overflow-auto max-w-3xl">
            <div className="max-w-3xl mx-auto p-8">
              {/* ALERTS BY SERVICE */}
              {SERVICES.map(({ name, icon: Icon }) => {
                const alerts = alertsByService[name] || []
                if (alerts.length === 0) return null

                return (
                  <div key={name} id={`service-${name}`} className="mb-12 scroll-mt-24">
                    <div className="flex items-center gap-2 mb-4">
                      <Icon size={20} color="#1A6BFF" />
                      <h2 className="text-lg font-semibold">{name}</h2>
                      <span className="ml-auto bg-[#1C2B3A] px-2 py-1 rounded text-xs font-mono">
                        {alerts.length}
                      </span>
                    </div>

                    <div className="space-y-2">
                      {alerts.map((alert, idx) => (
                        <div
                          key={alert.id}
                          className="bg-[#0F1923] border border-[#1C2B3A] p-4 rounded hover:bg-[#1C2B3A] transition-all cursor-pointer group"
                          onClick={() => handleInvestigate(alert)}
                          style={{
                            animation: `fadeIn 0.3s ease-out ${idx * 50}ms backwards`,
                          }}
                        >
                          <style>{`
                            @keyframes fadeIn {
                              from { opacity: 0; }
                              to { opacity: 1; }
                            }
                          `}</style>
                          <div className="flex items-start gap-3">
                            <div
                              className="w-3 h-3 rounded-full flex-shrink-0 mt-1"
                              style={{
                                backgroundColor:
                                  alert.severity === 'P1' ? '#FF3B3B' :
                                  alert.severity === 'P2' ? '#F59E0B' : '#3B82F6',
                              }}
                            />
                            <div className="flex-1 min-w-0">
                              <h3 className="font-semibold text-sm mb-1">{alert.title}</h3>
                              <p className="text-xs text-[#94A3B8]">
                                {alert.actor} → {alert.target}
                              </p>
                            </div>
                            <div className="flex items-center gap-2 flex-shrink-0">
                              <span className="text-xs text-[#94A3B8]" title={alert.time}>
                                {new Date(alert.time).toLocaleTimeString()}
                              </span>
                              <ChevronRight size={14} className="text-[#1A6BFF] group-hover:translate-x-1 transition-transform" />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )
              })}

              {/* DRIFT PANEL */}
              <div className="mt-12 border border-[#1C2B3A] rounded">
                <button
                  onClick={() => setDriftOpen(!driftOpen)}
                  className="w-full bg-[#0F1923] hover:bg-[#1C2B3A] p-4 flex items-center justify-between transition-colors"
                >
                  <h3 className="font-semibold">
                    Baseline Drift — <span className="text-[#F59E0B]">{driftedCount}</span> settings out of compliance
                  </h3>
                  <ChevronRight size={18} style={{ transform: driftOpen ? 'rotate(90deg)' : 'rotate(0)' }} className="transition-transform" />
                </button>

                {driftOpen && (
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-t border-[#1C2B3A]">
                          <th className="bg-[#1C2B3A] px-4 py-2 text-left font-semibold">Setting</th>
                          <th className="bg-[#1C2B3A] px-4 py-2 text-left font-semibold">Expected</th>
                          <th className="bg-[#1C2B3A] px-4 py-2 text-left font-semibold">Current</th>
                          <th className="bg-[#1C2B3A] px-4 py-2 text-left font-semibold">Since</th>
                        </tr>
                      </thead>
                      <tbody>
                        {SECURE_BASELINE.map((row, idx) => (
                          <tr
                            key={idx}
                            className="border-t border-[#1C2B3A]"
                            style={{
                              borderLeftWidth: row.drifted ? '4px' : '0',
                              borderLeftColor: row.drifted ? '#F59E0B' : 'transparent',
                            }}
                          >
                            <td className="px-4 py-2">{row.setting}</td>
                            <td className="px-4 py-2 text-[#94A3B8]">{row.expected}</td>
                            <td className="px-4 py-2 text-[#94A3B8]">{row.current}</td>
                            <td
                              className="px-4 py-2 text-xs font-mono"
                              style={{ color: row.drifted ? '#F59E0B' : '#94A3B8' }}
                            >
                              {row.since ? new Date(row.since).toLocaleDateString() : '—'}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* INVESTIGATION PANEL */}
          {selectedAlert && (
            <div className="w-[480px] border-l border-[#1C2B3A] bg-[#0F1923] overflow-y-auto flex flex-col">
              <div className="bg-[#1C2B3A] px-6 py-4 flex items-center justify-between flex-shrink-0">
                <div>
                  <h3 className="font-semibold">{selectedAlert.title}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <div
                      className="w-2 h-2 rounded-full"
                      style={{
                        backgroundColor:
                          selectedAlert.severity === 'P1' ? '#FF3B3B' :
                          selectedAlert.severity === 'P2' ? '#F59E0B' : '#3B82F6',
                      }}
                    />
                    <span className="text-xs text-[#94A3B8] font-mono">
                      Risk: {investigation?.riskScore ?? '—'}/100
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedAlert(null)}
                  className="hover:bg-[#1A6BFF] p-1 rounded transition-colors"
                >
                  <X size={18} />
                </button>
              </div>

              <div className="flex-1 p-6 space-y-6">
                {investigationLoading && (
                  <div className="space-y-4">
                    <div>
                      <p className="text-xs text-[#94A3B8] uppercase tracking-wider mb-2">What Happened</p>
                      <div className="h-12 bg-[#1C2B3A] rounded animate-pulse" />
                    </div>
                    <div>
                      <p className="text-xs text-[#94A3B8] uppercase tracking-wider mb-2">Why It Matters</p>
                      <div className="h-16 bg-[#1C2B3A] rounded animate-pulse" />
                    </div>
                  </div>
                )}

                {investigationError && (
                  <div className="bg-[#1C2B3A] border border-[#FF3B3B] p-4 rounded">
                    <p className="text-sm mb-3">{investigationError}</p>
                    <button
                      onClick={handleRetry}
                      className="flex items-center gap-2 text-[#1A6BFF] hover:text-[#3B82F6] text-sm"
                    >
                      <RotateCcw size={14} />
                      Retry
                    </button>
                  </div>
                )}

                {investigation && (
                  <>
                    <div>
                      <p className="text-xs text-[#94A3B8] uppercase tracking-wider mb-2">What Happened</p>
                      <p className="text-sm leading-relaxed">{investigation.summary}</p>
                    </div>

                    <div>
                      <p className="text-xs text-[#94A3B8] uppercase tracking-wider mb-2">Why It Matters</p>
                      <p className="text-sm leading-relaxed">{investigation.impact}</p>
                    </div>

                    <div>
                      <p className="text-xs text-[#94A3B8] uppercase tracking-wider mb-3">Timeline</p>
                      <div className="space-y-2">
                        {investigation.timeline.map((event, idx) => (
                          <div key={idx} className="flex gap-3 text-sm">
                            <span className="text-[#1A6BFF] font-mono flex-shrink-0">{event.offset}</span>
                            <span className="text-[#94A3B8]">{event.event}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <p className="text-xs text-[#94A3B8] uppercase tracking-wider mb-3">Fix It</p>
                      <ol className="space-y-2 text-sm list-decimal list-inside">
                        {investigation.actions.map((action, idx) => (
                          <li key={idx} className="text-[#E2E8F0]">{action}</li>
                        ))}
                      </ol>
                    </div>

                    {investigation.remediationScript && (
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <p className="text-xs text-[#94A3B8] uppercase tracking-wider">Remediation</p>
                          <button
                            onClick={handleCopyScript}
                            className="flex items-center gap-1 text-xs text-[#1A6BFF] hover:text-[#3B82F6]"
                          >
                            <Copy size={12} />
                            {copiedAction === 'script' ? 'Copied' : 'Copy'}
                          </button>
                        </div>
                        <pre className="bg-[#1C2B3A] p-3 rounded text-xs overflow-x-auto font-mono text-[#94A3B8]">
                          {investigation.remediationScript}
                        </pre>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          )}
        </div>

        {/* SOURCE HEALTH FOOTER */}
        <div className="sticky bottom-0 bg-[#0F1923] border-t border-[#1C2B3A] px-8 py-3">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center gap-4 overflow-x-auto">
              {SOURCE_HEALTH.map((source, idx) => {
                const { status, label } = getSourceStatus(source.lastPolled, source.interval)
                const statusColor = status === 'healthy' ? '#10B981' : status === 'overdue' ? '#F59E0B' : '#FF3B3B'

                return (
                  <div key={idx} className="flex items-center gap-2 flex-shrink-0 text-xs">
                    <div
                      className="w-2 h-2 rounded-full"
                      style={{ backgroundColor: statusColor }}
                    />
                    <span className="text-[#94A3B8]">{source.name}</span>
                    <span className="text-[#94A3B8] opacity-50">{label}</span>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default TenantGuardNew
