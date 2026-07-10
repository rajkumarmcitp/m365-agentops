import puppeteer from 'puppeteer';

(async () => {
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();
  
  // Set mobile viewport
  await page.setViewport({ width: 375, height: 812, deviceScaleFactor: 2 });
  
  // Navigate and login
  await page.goto('http://localhost:5173/', { waitUntil: 'networkidle0', timeout: 15000 });
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  // Select demo account
  await page.click('[data-user="demo"]');
  await new Promise(resolve => setTimeout(resolve, 500));
  await page.click('#demo-signin-btn');
  
  await new Promise(resolve => setTimeout(resolve, 3000));
  
  // Check for setup wizard
  const setupBanner = await page.$('#setup-status-banner');
  const setupVisible = await page.evaluate(() => {
    const banner = document.querySelector('#setup-status-banner');
    if (!banner) return null;
    const style = window.getComputedStyle(banner);
    return {
      display: style.display,
      visibility: style.visibility,
      height: banner.offsetHeight,
      html: banner.innerHTML.substring(0, 100)
    };
  });
  
  console.log('Setup Wizard Status:');
  console.log('  Element found:', !!setupBanner);
  if (setupVisible) {
    console.log('  Display:', setupVisible.display);
    console.log('  Height:', setupVisible.height + 'px');
  }
  
  // Take screenshot showing full mobile view
  await page.screenshot({ path: '/tmp/mobile-with-wizard.png', fullPage: true });
  console.log('\n📸 Screenshot saved: /tmp/mobile-with-wizard.png');
  
  await browser.close();
})();
