import playwright from 'playwright'

const browser = await playwright.chromium.launch()
const page = await browser.newPage()
await page.goto('http://localhost:5173')
await page.waitForLoadState('networkidle')
await page.waitForTimeout(1500)

// Log the page content structure
const content = await page.content()
const graphApiSection = content.match(/Graph API Setup/)?.[0]
if (graphApiSection) {
  console.log('✓ Graph API Step section found')
} else {
  console.log('✗ Graph API Step not found')
}

// Check for permission grid display
const permissionGrid = content.includes('grid-template-columns:1fr 1fr')
console.log(`✓ Permission grid layout: ${permissionGrid ? 'FOUND' : 'NOT FOUND'}`)

// Check for numbered steps
const numberedSteps = content.includes('font-size:13px;font-weight:600">1<')
console.log(`✓ Numbered instruction steps: ${numberedSteps ? 'FOUND' : 'NOT FOUND'}`)

// Check for emoji icons
const emojis = content.includes('⚡') && content.includes('📊') && content.includes('📧')
console.log(`✓ Emoji visual indicators: ${emojis ? 'FOUND' : 'NOT FOUND'}`)

// Take screenshot of the page
await page.screenshot({ path: '/tmp/setup-wizard.png', fullPage: true })
console.log('\n✓ Full page screenshot saved to /tmp/setup-wizard.png')

await browser.close()
