/**
 * Audit Logs Viewer
 * Display compliance audit trail
 */

import React, { useState, useEffect } from 'react'
import { api } from '../lib/api-client'
import { format } from 'date-fns'

export default function AuditLogsPage() {
  const [logs, setLogs] = useState([])
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState({
    action: '',
    actor: '',
    status: '',
    severity: '',
    limit: 100
  })
  const [dateRange, setDateRange] = useState({
    startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0]
  })
  const [searchQuery, setSearchQuery] = useState('')
  const [activeTab, setActiveTab] = useState('logs') // logs, stats, report

  // Fetch audit logs
  useEffect(() => {
    fetchLogs()
    fetchStats()
  }, [filters])

  async function fetchLogs() {
    try {
      setLoading(true)
      const query = new URLSearchParams()
      if (filters.action) query.append('action', filters.action)
      if (filters.actor) query.append('actor', filters.actor)
      if (filters.status) query.append('status', filters.status)
      if (filters.severity) query.append('severity', filters.severity)
      query.append('limit', filters.limit)

      const response = await fetch(`${api}/compliance/audit-logs?${query}`)
      const data = await response.json()
      setLogs(data.logs || [])
    } catch (error) {
      console.error('Error fetching audit logs:', error)
    } finally {
      setLoading(false)
    }
  }

  async function fetchStats() {
    try {
      const response = await fetch(`${api}/compliance/audit-logs/stats`)
      const data = await response.json()
      setStats(data.stats)
    } catch (error) {
      console.error('Error fetching audit stats:', error)
    }
  }

  async function handleSearch() {
    if (!searchQuery.trim()) return

    try {
      setLoading(true)
      const response = await fetch(`${api}/compliance/audit-logs/search`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: searchQuery, limit: filters.limit })
      })
      const data = await response.json()
      setLogs(data.logs || [])
    } catch (error) {
      console.error('Error searching audit logs:', error)
    } finally {
      setLoading(false)
    }
  }

  async function handleDateRange() {
    if (!dateRange.startDate || !dateRange.endDate) return

    try {
      setLoading(true)
      const response = await fetch(`${api}/compliance/audit-logs/date-range`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          startDate: dateRange.startDate,
          endDate: dateRange.endDate,
          limit: filters.limit
        })
      })
      const data = await response.json()
      setLogs(data.logs || [])
    } catch (error) {
      console.error('Error fetching logs by date range:', error)
    } finally {
      setLoading(false)
    }
  }

  async function handleExport() {
    try {
      const response = await fetch(`${api}/compliance/audit-logs/export`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ format: 'csv', filters })
      })
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `audit-logs-${new Date().toISOString().split('T')[0]}.csv`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
    } catch (error) {
      console.error('Error exporting audit logs:', error)
    }
  }

  async function handleComplianceReport() {
    try {
      setLoading(true)
      const days = Math.ceil((new Date(dateRange.endDate) - new Date(dateRange.startDate)) / (1000 * 60 * 60 * 24))
      const response = await fetch(`${api}/compliance/audit-logs/report?days=${days}`)
      const data = await response.json()
      // In a real app, this would display or download the report
      console.log('Compliance Report:', data.report)
    } catch (error) {
      console.error('Error generating compliance report:', error)
    } finally {
      setLoading(false)
    }
  }

  function getSeverityColor(severity) {
    const colors = {
      error: '#d32f2f',
      warning: '#f57c00',
      info: '#1976d2'
    }
    return colors[severity] || '#757575'
  }

  function getStatusBadge(status) {
    const styles = {
      success: { background: '#4caf50', color: 'white' },
      failure: { background: '#f44336', color: 'white' }
    }
    return styles[status] || { background: '#2196f3', color: 'white' }
  }

  return (
    <div style={{ padding: '20px', background: '#f5f5f5', minHeight: '100vh' }}>
      <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{ marginBottom: '30px' }}>
          <h1 style={{ margin: '0 0 10px 0', color: '#333' }}>📋 Audit Logs</h1>
          <p style={{ margin: '0', color: '#666' }}>Comprehensive compliance audit trail for all system actions</p>
        </div>

        {/* Statistics Cards */}
        {stats && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '15px', marginBottom: '30px' }}>
            <div style={{ background: 'white', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
              <div style={{ fontSize: '12px', color: '#666', marginBottom: '5px' }}>Total Events</div>
              <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#1976d2' }}>{stats.total || 0}</div>
            </div>
            <div style={{ background: 'white', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
              <div style={{ fontSize: '12px', color: '#666', marginBottom: '5px' }}>Last 24 Hours</div>
              <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#4caf50' }}>{stats.last24Hours || 0}</div>
            </div>
            <div style={{ background: 'white', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
              <div style={{ fontSize: '12px', color: '#666', marginBottom: '5px' }}>Success Rate</div>
              <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#ff9800' }}>
                {stats.byStatus && stats.total > 0
                  ? Math.round((stats.byStatus.success / stats.total) * 100)
                  : 0}%
              </div>
            </div>
            <div style={{ background: 'white', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
              <div style={{ fontSize: '12px', color: '#666', marginBottom: '5px' }}>Recent Failures</div>
              <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#f44336' }}>{stats.byStatus?.failure || 0}</div>
            </div>
          </div>
        )}

        {/* Tabs */}
        <div style={{ display: 'flex', gap: '10px', marginBottom: '20px', borderBottom: '2px solid #ddd' }}>
          {['logs', 'stats', 'report'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              style={{
                padding: '10px 20px',
                border: 'none',
                background: 'none',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: activeTab === tab ? 'bold' : 'normal',
                color: activeTab === tab ? '#1976d2' : '#666',
                borderBottom: activeTab === tab ? '3px solid #1976d2' : 'none'
              }}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {/* Logs Tab */}
        {activeTab === 'logs' && (
          <div>
            {/* Filters */}
            <div style={{ background: 'white', padding: '20px', borderRadius: '8px', marginBottom: '20px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
              <h3 style={{ margin: '0 0 15px 0' }}>Filters</h3>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px', marginBottom: '15px' }}>
                <div>
                  <label style={{ fontSize: '12px', color: '#666', display: 'block', marginBottom: '5px' }}>Action</label>
                  <input
                    type="text"
                    placeholder="e.g., exception_approved"
                    value={filters.action}
                    onChange={e => setFilters({ ...filters, action: e.target.value })}
                    style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px', boxSizing: 'border-box' }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '12px', color: '#666', display: 'block', marginBottom: '5px' }}>Actor/User</label>
                  <input
                    type="text"
                    placeholder="e.g., user@domain.com"
                    value={filters.actor}
                    onChange={e => setFilters({ ...filters, actor: e.target.value })}
                    style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px', boxSizing: 'border-box' }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '12px', color: '#666', display: 'block', marginBottom: '5px' }}>Status</label>
                  <select
                    value={filters.status}
                    onChange={e => setFilters({ ...filters, status: e.target.value })}
                    style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px', boxSizing: 'border-box' }}
                  >
                    <option value="">All</option>
                    <option value="success">Success</option>
                    <option value="failure">Failure</option>
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: '12px', color: '#666', display: 'block', marginBottom: '5px' }}>Severity</label>
                  <select
                    value={filters.severity}
                    onChange={e => setFilters({ ...filters, severity: e.target.value })}
                    style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px', boxSizing: 'border-box' }}
                  >
                    <option value="">All</option>
                    <option value="info">Info</option>
                    <option value="warning">Warning</option>
                    <option value="error">Error</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '10px', marginBottom: '15px' }}>
                <div style={{ flex: 1 }}>
                  <label style={{ fontSize: '12px', color: '#666', display: 'block', marginBottom: '5px' }}>Search</label>
                  <input
                    type="text"
                    placeholder="Search logs..."
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    onKeyPress={e => e.key === 'Enter' && handleSearch()}
                    style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px', boxSizing: 'border-box' }}
                  />
                </div>
                <button
                  onClick={handleSearch}
                  style={{
                    alignSelf: 'flex-end',
                    padding: '8px 16px',
                    background: '#2196f3',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer'
                  }}
                >
                  Search
                </button>
              </div>

              <div style={{ display: 'flex', gap: '10px' }}>
                <div style={{ flex: 1 }}>
                  <label style={{ fontSize: '12px', color: '#666', display: 'block', marginBottom: '5px' }}>Start Date</label>
                  <input
                    type="date"
                    value={dateRange.startDate}
                    onChange={e => setDateRange({ ...dateRange, startDate: e.target.value })}
                    style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px', boxSizing: 'border-box' }}
                  />
                </div>
                <div style={{ flex: 1 }}>
                  <label style={{ fontSize: '12px', color: '#666', display: 'block', marginBottom: '5px' }}>End Date</label>
                  <input
                    type="date"
                    value={dateRange.endDate}
                    onChange={e => setDateRange({ ...dateRange, endDate: e.target.value })}
                    style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px', boxSizing: 'border-box' }}
                  />
                </div>
                <button
                  onClick={handleDateRange}
                  style={{
                    alignSelf: 'flex-end',
                    padding: '8px 16px',
                    background: '#4caf50',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer'
                  }}
                >
                  Filter by Date
                </button>
              </div>

              <button
                onClick={handleExport}
                style={{
                  marginTop: '15px',
                  padding: '8px 16px',
                  background: '#ff9800',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}
              >
                📥 Export as CSV
              </button>
            </div>

            {/* Logs Table */}
            <div style={{ background: 'white', borderRadius: '8px', overflow: 'hidden', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
              {loading ? (
                <div style={{ padding: '40px', textAlign: 'center', color: '#666' }}>Loading audit logs...</div>
              ) : logs.length === 0 ? (
                <div style={{ padding: '40px', textAlign: 'center', color: '#666' }}>No audit logs found</div>
              ) : (
                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                      <tr style={{ background: '#f5f5f5', borderBottom: '2px solid #ddd' }}>
                        <th style={{ padding: '12px', textAlign: 'left', fontSize: '13px', fontWeight: 'bold', color: '#333' }}>Timestamp</th>
                        <th style={{ padding: '12px', textAlign: 'left', fontSize: '13px', fontWeight: 'bold', color: '#333' }}>Action</th>
                        <th style={{ padding: '12px', textAlign: 'left', fontSize: '13px', fontWeight: 'bold', color: '#333' }}>Actor</th>
                        <th style={{ padding: '12px', textAlign: 'left', fontSize: '13px', fontWeight: 'bold', color: '#333' }}>Resource</th>
                        <th style={{ padding: '12px', textAlign: 'left', fontSize: '13px', fontWeight: 'bold', color: '#333' }}>Severity</th>
                        <th style={{ padding: '12px', textAlign: 'left', fontSize: '13px', fontWeight: 'bold', color: '#333' }}>Status</th>
                        <th style={{ padding: '12px', textAlign: 'left', fontSize: '13px', fontWeight: 'bold', color: '#333' }}>Description</th>
                      </tr>
                    </thead>
                    <tbody>
                      {logs.map((log, idx) => (
                        <tr key={log.id} style={{ borderBottom: '1px solid #eee', background: idx % 2 === 0 ? '#fafafa' : 'white' }}>
                          <td style={{ padding: '12px', fontSize: '12px', color: '#666' }}>
                            {format(new Date(log.timestamp), 'MMM dd, yyyy HH:mm:ss')}
                          </td>
                          <td style={{ padding: '12px', fontSize: '12px', color: '#333', fontWeight: '500' }}>{log.action}</td>
                          <td style={{ padding: '12px', fontSize: '12px', color: '#666' }}>{log.actor}</td>
                          <td style={{ padding: '12px', fontSize: '12px', color: '#666' }}>
                            {log.resourceId && <span title={log.resourceType}>{log.resourceId.slice(0, 8)}...</span>}
                          </td>
                          <td style={{ padding: '12px', fontSize: '12px' }}>
                            <span style={{ color: getSeverityColor(log.severity) }}>●</span>
                            {' '}
                            {log.severity}
                          </td>
                          <td style={{ padding: '12px', fontSize: '12px' }}>
                            <span style={{ ...getStatusBadge(log.status), padding: '2px 8px', borderRadius: '3px', fontSize: '11px' }}>
                              {log.status}
                            </span>
                          </td>
                          <td style={{ padding: '12px', fontSize: '12px', color: '#666' }}>{log.description}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Stats Tab */}
        {activeTab === 'stats' && stats && (
          <div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '20px' }}>
              {/* By Action */}
              <div style={{ background: 'white', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
                <h3 style={{ margin: '0 0 15px 0' }}>Events by Action</h3>
                {Object.entries(stats.byAction)
                  .sort(([, a], [, b]) => b - a)
                  .slice(0, 10)
                  .map(([action, count]) => (
                    <div key={action} style={{ marginBottom: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: '13px' }}>{action}</span>
                      <span style={{ background: '#e3f2fd', color: '#1976d2', padding: '2px 8px', borderRadius: '3px', fontSize: '12px' }}>
                        {count}
                      </span>
                    </div>
                  ))}
              </div>

              {/* By Actor */}
              <div style={{ background: 'white', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
                <h3 style={{ margin: '0 0 15px 0' }}>Events by User</h3>
                {Object.entries(stats.byActor)
                  .sort(([, a], [, b]) => b - a)
                  .slice(0, 10)
                  .map(([actor, count]) => (
                    <div key={actor} style={{ marginBottom: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: '13px' }}>{actor}</span>
                      <span style={{ background: '#f3e5f5', color: '#7b1fa2', padding: '2px 8px', borderRadius: '3px', fontSize: '12px' }}>
                        {count}
                      </span>
                    </div>
                  ))}
              </div>

              {/* By Severity */}
              <div style={{ background: 'white', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
                <h3 style={{ margin: '0 0 15px 0' }}>Events by Severity</h3>
                {Object.entries(stats.bySeverity).map(([severity, count]) => (
                  <div key={severity} style={{ marginBottom: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '13px' }}>{severity}</span>
                    <span style={{ background: getSeverityColor(severity), color: 'white', padding: '2px 8px', borderRadius: '3px', fontSize: '12px' }}>
                      {count}
                    </span>
                  </div>
                ))}
              </div>

              {/* By Status */}
              <div style={{ background: 'white', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
                <h3 style={{ margin: '0 0 15px 0' }}>Events by Status</h3>
                {Object.entries(stats.byStatus).map(([status, count]) => (
                  <div key={status} style={{ marginBottom: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '13px' }}>{status}</span>
                    <span style={{ ...getStatusBadge(status), padding: '2px 8px', borderRadius: '3px', fontSize: '12px' }}>
                      {count}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {stats.lastFailure && (
              <div style={{ background: '#ffebee', padding: '20px', borderRadius: '8px', marginTop: '20px', border: '1px solid #ef5350' }}>
                <h3 style={{ margin: '0 0 10px 0', color: '#d32f2f' }}>Last Failure</h3>
                <div style={{ fontSize: '13px', color: '#333' }}>
                  <p style={{ margin: '5px 0' }}>
                    <strong>Action:</strong> {stats.lastFailure.action}
                  </p>
                  <p style={{ margin: '5px 0' }}>
                    <strong>Actor:</strong> {stats.lastFailure.actor}
                  </p>
                  <p style={{ margin: '5px 0' }}>
                    <strong>Time:</strong> {format(new Date(stats.lastFailure.timestamp), 'MMM dd, yyyy HH:mm:ss')}
                  </p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Report Tab */}
        {activeTab === 'report' && (
          <div style={{ background: 'white', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
            <h3 style={{ margin: '0 0 15px 0' }}>Compliance Report</h3>
            <p style={{ color: '#666', marginBottom: '20px' }}>
              Generate a compliance report for a specific date range. This report includes audit events, actions, and statistics.
            </p>
            <button
              onClick={handleComplianceReport}
              style={{
                padding: '10px 20px',
                background: '#2196f3',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '14px'
              }}
            >
              📊 Generate Report
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
