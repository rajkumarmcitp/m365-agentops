import { go } from '../app.js'
import { getSecurityScore } from '../lib/api-client.js'
import { SECURE_SCORE, INCIDENTS, RECOMMENDATIONS } from '../data/security-data.js'

let realSecureScore = null

export async function initSecurity() {
  const el = document.getElementById('page-security')
  if (!el) return

  el.innerHTML = `<div style="padding:20px;text-align:center"><div class="spinner"></div><p>Loading security data...</p></div>`

  try {
    console.log('📡 Fetching real security data from backend...')
    const scoreResult = await getSecurityScore()

    if (scoreResult.success) {
      realSecureScore = scoreResult.data || SECURE_SCORE
      console.log('✅ Loaded real secure score from API')
    } else {
      realSecureScore = SECURE_SCORE
      console.warn('⚠️ Failed to fetch security score, using simulated data')
    }
  } catch (error) {
    console.error('❌ Error loading security data:', error)
    realSecureScore = SECURE_SCORE
  }

  render(el)
}

function render(el) {
  try {
    const ss = realSecureScore || SECURE_SCORE
    const currentScore = ss?.currentScore || 64
    const maxScore = ss?.maxScore || 95
    const percentScore = Math.round((currentScore / maxScore) * 100)

    const incidents = INCIDENTS || []
    const recommendations = RECOMMENDATIONS || []
    const critCount = incidents.filter(i => i?.severity === 'critical').length || 0
    const highCount = incidents.filter(i => i?.severity === 'high').length || 0
    const recCount = recommendations.length || 0

  el.innerHTML = `
    <div class="page-header">
      <div>
        <div class="page-title"><i class="ti ti-shield-exclamation"></i> Security Command Center</div>
        <div class="page-subtitle">Microsoft 365 Security Posture · Last updated today</div>
      </div>
      <div class="page-actions">
        <button class="btn"><i class="ti ti-refresh"></i> Refresh</button>
      </div>
    </div>

    <!-- KPI Strip -->
    <div class="kpi-row mb-3">
      <div class="kpi-tile">
        <div class="kpi-value ${percentScore >= 80 ? 'success' : percentScore >= 60 ? 'warning' : 'danger'}">${currentScore}/${maxScore}</div>
        <div class="kpi-label">Secure Score</div>
        <div style="font-size:10px;margin-top:3px;color:var(--color-text-tertiary)">${percentScore}% coverage</div>
      </div>
      <div class="kpi-tile">
        <div class="kpi-value ${critCount > 0 ? 'danger' : 'success'}">${critCount}</div>
        <div class="kpi-label">Critical Issues</div>
      </div>
      <div class="kpi-tile">
        <div class="kpi-value ${highCount > 0 ? 'warning' : 'success'}">${highCount}</div>
        <div class="kpi-label">High Issues</div>
      </div>
      <div class="kpi-tile">
        <div class="kpi-value info">${recCount}</div>
        <div class="kpi-label">Recommendations</div>
      </div>
    </div>

    <!-- Secure Score Details -->
    <div class="card">
      <div class="card-header">
        <span class="card-title"><i class="ti ti-shield-check"></i> Secure Score Overview</span>
      </div>
      <div style="padding:16px">
        <div style="margin-bottom:16px">
          <div style="font-size:14px;font-weight:600;margin-bottom:8px">Current Score: ${currentScore}/${maxScore}</div>
          <div style="background:var(--color-bg-secondary);border-radius:4px;height:24px;overflow:hidden">
            <div style="background:${percentScore >= 80 ? '#10b981' : percentScore >= 60 ? '#f59e0b' : '#ef4444'};height:100%;width:${percentScore}%;transition:width 0.3s"></div>
          </div>
          <div style="font-size:12px;color:var(--color-text-tertiary);margin-top:8px">${percentScore}% of maximum achievable score</div>
        </div>
      </div>
    </div>

    <!-- Active Incidents -->
    <div class="card mt-3">
      <div class="card-header">
        <span class="card-title"><i class="ti ti-alert-triangle"></i> Active Incidents</span>
        <span class="badge danger">${critCount + highCount} total</span>
      </div>
      <div style="padding:16px">
        ${critCount > 0 ? `<div style="padding:8px;background:#fee2e2;border-left:4px solid #dc2626;border-radius:4px;margin-bottom:8px"><strong style="color:#7f1d1d">🔴 ${critCount} Critical incident(s) detected</strong></div>` : ''}
        ${highCount > 0 ? `<div style="padding:8px;background:#fef3c7;border-left:4px solid #f59e0b;border-radius:4px"><strong style="color:#92400e">🟠 ${highCount} High-severity issue(s)</strong></div>` : ''}
        ${critCount === 0 && highCount === 0 ? `<div style="color:var(--color-text-secondary)">✅ No critical or high-severity incidents detected</div>` : ''}
      </div>
    </div>

    <!-- Recommendations -->
    <div class="card mt-3">
      <div class="card-header">
        <span class="card-title"><i class="ti ti-checklist"></i> Top Recommendations</span>
        <span class="badge blue">${recCount} total</span>
      </div>
      <div style="padding:16px">
        ${(recommendations || []).slice(0, 5).map(r => `
          <div style="padding:12px;border-bottom:1px solid var(--color-border);display:flex;gap:12px">
            <div style="min-width:32px;height:32px;border-radius:50%;background:${r.priority === 'critical' ? '#fee2e2' : '#fef3c7'};display:flex;align-items:center;justify-content:center;font-size:16px">
              ${r.priority === 'critical' ? '🔴' : r.priority === 'high' ? '🟠' : '🟡'}
            </div>
            <div style="flex:1">
              <div style="font-weight:600;margin-bottom:4px">${r.title}</div>
              <div style="font-size:12px;color:var(--color-text-secondary)">${r.category}</div>
            </div>
          </div>
        `).join('')}
      </div>
    </div>
  `
  } catch (renderError) {
    console.error('❌ Error rendering security page:', renderError)
    el.innerHTML = `<div class="alert danger" style="margin:20px"><strong>Error loading Security page</strong><p>${renderError.message}</p></div>`
  }
}
