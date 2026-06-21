// Skeleton Loading Utility - Used across all pages for consistent loading states

export function createSkeletonLoader() {
  return {
    // Show loading skeleton for page header
    renderPageHeader(title, subtitle = '', showActions = true) {
      return `
        <div class="page-header" style="opacity:0.6">
          <div>
            <div class="page-title" style="background:#e0e0e0;width:200px;height:28px;border-radius:4px;margin-bottom:8px"></div>
            <div class="page-subtitle" style="background:#f0f0f0;width:300px;height:16px;border-radius:4px"></div>
          </div>
          ${showActions ? `
            <div class="page-actions" style="display:flex;gap:8px">
              <div style="background:#f0f0f0;width:80px;height:32px;border-radius:4px"></div>
              <div style="background:#e0e0e0;width:80px;height:32px;border-radius:4px"></div>
            </div>
          ` : ''}
        </div>
      `
    },

    // Show loading skeleton for a data table
    renderTableSkeleton(columns = 5, rows = 8) {
      return `
        <div class="card" style="margin-bottom:16px;padding:0;overflow:hidden;opacity:0.6">
          <div style="padding:12px;border-bottom:0.5px solid var(--color-border-secondary);background:var(--color-background-secondary)">
            <div style="background:#f0f0f0;width:150px;height:16px;border-radius:4px"></div>
          </div>
          <table style="width:100%">
            <thead style="background:var(--color-background-secondary)">
              <tr>
                ${Array(columns).fill(0).map(() =>
                  `<th style="padding:10px 12px"><div style="background:#f0f0f0;height:12px;border-radius:4px"></div></th>`
                ).join('')}
              </tr>
            </thead>
            <tbody>
              ${Array(rows).fill(0).map(() => `
                <tr style="border-bottom:0.5px solid var(--color-border-tertiary)">
                  ${Array(columns).fill(0).map(() =>
                    `<td style="padding:12px"><div style="background:#f5f5f5;height:14px;border-radius:4px"></div></td>`
                  ).join('')}
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      `
    },

    // Show loading skeleton for a card grid
    renderCardGridSkeleton(columns = 4, cards = 8) {
      return `
        <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(250px,1fr));gap:16px;margin-bottom:16px">
          ${Array(cards).fill(0).map(() => `
            <div class="card" style="opacity:0.6;min-height:200px">
              <div style="padding:16px">
                <div style="background:#f0f0f0;width:60%;height:20px;border-radius:4px;margin-bottom:12px"></div>
                <div style="background:#f5f5f5;height:40px;border-radius:4px;margin-bottom:12px"></div>
                <div style="background:#f5f5f5;height:14px;border-radius:4px;margin-bottom:8px"></div>
                <div style="background:#f5f5f5;height:14px;width:80%;border-radius:4px"></div>
              </div>
            </div>
          `).join('')}
        </div>
      `
    },

    // Show loading skeleton for a metrics row (KPI tiles)
    renderMetricsRowSkeleton(count = 4) {
      return `
        <div style="display:grid;grid-template-columns:repeat(${count},1fr);gap:12px;margin-bottom:16px">
          ${Array(count).fill(0).map(() => `
            <div class="kpi-tile" style="opacity:0.5;padding:16px;border-radius:8px;background:var(--color-background-secondary)">
              <div style="background:#f0f0f0;width:40px;height:20px;border-radius:4px;margin-bottom:12px"></div>
              <div style="background:#e0e0e0;width:60%;height:32px;border-radius:4px;margin-bottom:8px"></div>
              <div style="background:#f0f0f0;width:70%;height:14px;border-radius:4px"></div>
            </div>
          `).join('')}
        </div>
      `
    },

    // Show loading skeleton for tabs + content
    renderTabsWithContentSkeleton(tabCount = 6, showContent = true) {
      return `
        <div style="border-bottom:0.5px solid var(--color-border-secondary);margin-bottom:16px;opacity:0.6">
          <div style="display:flex;gap:8px;overflow-x:auto;padding-bottom:12px">
            ${Array(tabCount).fill(0).map(() =>
              `<div style="background:#f0f0f0;width:100px;height:20px;border-radius:4px;flex-shrink:0"></div>`
            ).join('')}
          </div>
        </div>
        ${showContent ? `
          <div>
            ${this.renderCardGridSkeleton(4, 4)}
          </div>
        ` : ''}
      `
    },

    // Utility to fade in content
    fadeInContent(element, duration = 300) {
      element.style.opacity = '0.5'
      element.style.transition = `opacity ${duration}ms ease-in-out`
      setTimeout(() => {
        element.style.opacity = '1'
      }, 50)
    }
  }
}

// Export singleton instance
export const skeletonLoader = createSkeletonLoader()
