import puppeteer from 'puppeteer';

(async () => {
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();
  
  // Set mobile viewport
  await page.setViewport({ width: 375, height: 812, deviceScaleFactor: 2 });
  
  // Navigate and log in
  await page.goto('http://localhost:5173/', { waitUntil: 'networkidle0', timeout: 15000 });
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  // Select and click demo account
  await page.click('[data-user="demo"]');
  await new Promise(resolve => setTimeout(resolve, 500));
  await page.click('#demo-signin-btn');
  
  // Wait for dashboard
  await new Promise(resolve => setTimeout(resolve, 3000));
  
  // Check for dashboard header
  const headerExists = await page.$('.dashboard-header');
  
  if (headerExists) {
    // Get header info
    const headerInfo = await page.evaluate(() => {
      const header = document.querySelector('.dashboard-header');
      const styles = window.getComputedStyle(header);
      return {
        height: header.offsetHeight,
        paddingTop: styles.paddingTop,
        paddingBottom: styles.paddingBottom
      };
    });
    
    console.log('✅ Dashboard Header Found!');
    console.log(`📏 Height: ${headerInfo.height}px`);
    console.log(`   Padding Top: ${headerInfo.paddingTop}`);
    console.log(`   Padding Bottom: ${headerInfo.paddingBottom}`);
  }
  
  // Take full-page screenshot
  await page.screenshot({ path: '/tmp/dashboard-mobile-full.png', fullPage: true });
  console.log('📸 Full screenshot saved');
  
  // Also take viewport-only screenshot to show the purple header area
  await page.screenshot({ path: '/tmp/dashboard-mobile-viewport.png', fullPage: false });
  console.log('📸 Viewport screenshot saved');
  
  await browser.close();
})();
