/**
 * Custom Skeleton Loader with Real Page Structure
 * Shows actual headers, tables, and layout without data
 * Provides shimmer animation for visual feedback
 */

export const customSkeleton = {
  /**
   * Generic page skeleton with header, KPIs, filters, and table
   * @param {string} title - Page title
   * @param {string} subtitle - Page subtitle
   * @param {number} kpiCount - Number of KPI tiles (default 3)
   * @param {Array} tableHeaders - Array of column headers
   * @param {number} tableRows - Number of skeleton rows (default 10)
   * @returns {string} HTML skeleton
   */
  renderPageWithTable(title, subtitle, kpiCount = 3, tableHeaders = [], tableRows = 10) {
    const headerWidths = tableHeaders.length > 0
      ? tableHeaders.map((_, i) => Math.round(100 / tableHeaders.length) + '%')
      : ['20%', '30%', '20%', '15%', '15%'];

    return `
      <div style="animation:fadeIn 200ms ease-in">
        <!-- Page Header -->
        <div class="page-header" style="margin-bottom:20px">
          <div>
            <div class="page-title">${title}</div>
            <div class="page-subtitle" style="color:var(--color-text-secondary)">${subtitle}</div>
          </div>
        </div>

        <!-- KPI Row -->
        ${kpiCount > 0 ? `
          <div class="kpi-row" style="margin-bottom:24px">
            ${Array(kpiCount).fill(0).map(() => `
              <div class="kpi-tile">
                <div style="background:linear-gradient(90deg, #e0e0e0 25%, #f0f0f0 50%, #e0e0e0 75%);background-size:200% 100%;animation:shimmer 1.5s infinite;width:60px;height:24px;border-radius:4px;margin-bottom:8px"></div>
                <div style="background:linear-gradient(90deg, #f0f0f0 25%, #f9f9f9 50%, #f0f0f0 75%);background-size:200% 100%;animation:shimmer 1.5s infinite;width:100px;height:12px;border-radius:4px"></div>
              </div>
            `).join('')}
          </div>
        ` : ''}

        <!-- Filter Bar -->
        <div class="filter-bar mb-3">
          <input type="text" class="form-input search" placeholder="Search..." disabled>
          <select class="form-select" disabled><option>Filter...</option></select>
          <button class="btn btn-primary" disabled><i class="ti ti-download"></i> Export</button>
        </div>

        <!-- Table with Headers -->
        <div class="card" style="padding:0;overflow:hidden">
          <div style="overflow-x:auto">
            <table style="width:100%">
              <thead><tr style="border-bottom:1px solid var(--color-border-secondary)">
                ${tableHeaders.length > 0
                  ? tableHeaders.map((header, i) => `
                    <th style="width:${headerWidths[i]};padding:12px;text-align:left;font-weight:600;font-size:11px">${header}</th>
                  `).join('')
                  : Array(5).fill(0).map(() => `
                    <th style="padding:12px;font-weight:600;font-size:11px">
                      <div style="background:linear-gradient(90deg, #f0f0f0 25%, #f9f9f9 50%, #f0f0f0 75%);background-size:200% 100%;animation:shimmer 1.5s infinite;width:80px;height:12px;border-radius:4px"></div>
                    </th>
                  `).join('')
                }
              </tr></thead>
              <tbody>
                ${Array(tableRows).fill(0).map(() => `
                  <tr style="border-bottom:0.5px solid var(--color-border-secondary)">
                    ${Array(Math.max(tableHeaders.length || 5)).fill(0).map(() => `
                      <td style="padding:12px">
                        <div style="background:linear-gradient(90deg, #f0f0f0 25%, #f9f9f9 50%, #f0f0f0 75%);background-size:200% 100%;animation:shimmer 1.5s infinite;width:90%;height:12px;border-radius:4px"></div>
                      </td>
                    `).join('')}
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        </div>

        <style>
          @keyframes shimmer {
            0% { background-position: -200% 0; }
            100% { background-position: 200% 0; }
          }
          @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
          }
        </style>
      </div>
    `
  },

  /**
   * Simple skeleton with just header and loading message
   * @param {string} title - Page title
   * @param {string} subtitle - Page subtitle
   * @returns {string} HTML skeleton
   */
  renderSimple(title, subtitle) {
    return `
      <div style="animation:fadeIn 200ms ease-in">
        <div class="page-header" style="margin-bottom:20px">
          <div>
            <div class="page-title">${title}</div>
            <div class="page-subtitle" style="color:var(--color-text-secondary)">${subtitle}</div>
          </div>
        </div>

        <div class="card" style="text-align:center;padding:40px;color:var(--color-text-secondary)">
          <div style="font-size:14px;margin-bottom:8px"><i class="ti ti-hourglass"></i> Loading...</div>
          <div style="font-size:11px;color:var(--color-text-tertiary)">Fetching data from server</div>
        </div>

        <style>
          @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
          }
        </style>
      </div>
    `
  },

  /**
   * Grid skeleton for cards/tiles
   * @param {string} title - Page title
   * @param {string} subtitle - Page subtitle
   * @param {number} columns - Number of columns
   * @param {number} cards - Number of cards
   * @returns {string} HTML skeleton
   */
  renderGrid(title, subtitle, columns = 3, cards = 9) {
    return `
      <div style="animation:fadeIn 200ms ease-in">
        <div class="page-header" style="margin-bottom:20px">
          <div>
            <div class="page-title">${title}</div>
            <div class="page-subtitle" style="color:var(--color-text-secondary)">${subtitle}</div>
          </div>
        </div>

        <div style="display:grid;grid-template-columns:repeat(${columns},1fr);gap:16px;margin-bottom:24px">
          ${Array(cards).fill(0).map(() => `
            <div class="card" style="padding:16px;min-height:200px">
              <div style="background:linear-gradient(90deg, #e0e0e0 25%, #f0f0f0 50%, #e0e0e0 75%);background-size:200% 100%;animation:shimmer 1.5s infinite;width:150px;height:20px;border-radius:4px;margin-bottom:16px"></div>
              <div style="background:linear-gradient(90deg, #f0f0f0 25%, #f9f9f9 50%, #f0f0f0 75%);background-size:200% 100%;animation:shimmer 1.5s infinite;width:100%;height:12px;border-radius:4px;margin-bottom:8px"></div>
              <div style="background:linear-gradient(90deg, #f0f0f0 25%, #f9f9f9 50%, #f0f0f0 75%);background-size:200% 100%;animation:shimmer 1.5s infinite;width:100%;height:12px;border-radius:4px;margin-bottom:8px"></div>
              <div style="background:linear-gradient(90deg, #f0f0f0 25%, #f9f9f9 50%, #f0f0f0 75%);background-size:200% 100%;animation:shimmer 1.5s infinite;width:80%;height:12px;border-radius:4px"></div>
            </div>
          `).join('')}
        </div>

        <style>
          @keyframes shimmer {
            0% { background-position: -200% 0; }
            100% { background-position: 200% 0; }
          }
          @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
          }
        </style>
      </div>
    `
  }
}

export default customSkeleton
