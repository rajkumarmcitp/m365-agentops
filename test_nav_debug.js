import puppeteer from 'puppeteer';

(async () => {
  console.log('🐛 Debugging Navigation Rendering\n');

  let browser;
  try {
    browser = await puppeteer.launch({ 
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    
    const page = await browser.newPage();

    console.log('Loading app...');
    await page.goto('http://localhost:5173', { 
      waitUntil: 'load',
      timeout: 45000 
    });

    // Click demo user (Aisha)
    const aishaButton = await page.$('text=Aisha');
    if (aishaButton) {
      await aishaButton.click();
      console.log('✅ Clicked Aisha Raza\n');
    }

    // Wait longer for UI to settle
    await new Promise(resolve => setTimeout(resolve, 4000));

    // Check page structure
    console.log('Page structure:');
    const pageContent = await page.evaluate(() => {
      const sidebar = document.getElementById('sidebar');
      const nav_items = document.querySelectorAll('.nav-item');
      const nav_sections = document.querySelectorAll('.nav-section');
      
      return {
        sidebar_exists: !!sidebar,
        sidebar_html_length: sidebar?.innerHTML.length || 0,
        nav_items_count: nav_items.length,
        nav_sections_count: nav_sections.length,
        sidebar_content_preview: sidebar?.innerHTML.substring(0, 500) || 'EMPTY'
      };
    });

    console.log(`  • Sidebar exists: ${pageContent.sidebar_exists}`);
    console.log(`  • Sidebar content length: ${pageContent.sidebar_html_length} chars`);
    console.log(`  • Nav items found: ${pageContent.nav_items_count}`);
    console.log(`  • Nav sections found: ${pageContent.nav_sections_count}`);
    
    if (pageContent.sidebar_content_preview.includes('M365')) {
      console.log('  • Logo/header present: ✅');
    }

    // Check if backup is in HTML
    console.log('\nSearching for "backup" in HTML:');
    const hasBackupInHTML = await page.evaluate(() => {
      return document.body.innerHTML.includes('backup') || 
             document.body.innerHTML.includes('Backup');
    });
    console.log(`  ${hasBackupInHTML ? '✅' : '❌'} "Backup" found in HTML`);

    // Get current user info
    console.log('\nCurrent user info:');
    const userInfo = await page.evaluate(() => {
      // Try to access window.state or similar
      return {
        page_content: document.querySelectorAll('body')[0]?.textContent.substring(0, 200) || 'NO CONTENT'
      };
    });

    console.log('  Page loaded');

  } catch (error) {
    console.error('❌ Debug test failed:', error.message);
  } finally {
    if (browser) await browser.close();
  }
})();
