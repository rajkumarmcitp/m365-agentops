import puppeteer from 'puppeteer';

(async () => {
  console.log('🌐 Testing Backup UI with Authentication...\n');

  let browser;
  try {
    browser = await puppeteer.launch({ 
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    
    const page = await browser.newPage();
    
    console.log('1️⃣ Loading application...');
    await page.goto('http://localhost:5173', { 
      waitUntil: 'networkidle0',
      timeout: 30000 
    });

    // Click on demo account (Aisha Raza - SUPER)
    console.log('\n2️⃣ Logging in with demo account (SUPER user)...');
    const demoButtons = await page.$$('[data-user]');
    if (demoButtons.length > 0) {
      // Click on Aisha Raza button (SUPER admin)
      const aishaButton = await page.$('text=Aisha Raza');
      if (aishaButton) {
        await aishaButton.click();
        console.log('   ✅ Clicked Aisha Raza (SUPER)');
      } else {
        // Try clicking first button with role SUPER
        await page.click('button:has-text("Aisha")');
        console.log('   ✅ Clicked demo user');
      }
    }

    // Wait for login to complete
    console.log('\n3️⃣ Waiting for login to complete...');
    await new Promise(resolve => setTimeout(resolve, 3000));

    // Navigate to backup page
    console.log('\n4️⃣ Navigating to backup page...');
    await page.goto('http://localhost:5173/backup', { 
      waitUntil: 'networkidle0',
      timeout: 30000 
    });

    await new Promise(resolve => setTimeout(resolve, 2500));

    // Get page content
    const content = await page.content();
    
    console.log('\n5️⃣ Checking backup page content...');
    const hasBackupTitle = content.includes('Backup') || content.includes('backup');
    const hasServices = content.includes('Exchange') || content.includes('Teams') || content.includes('Dynamics');
    const hasKPI = content.includes('Services') || content.includes('Resources') || content.includes('resources');
    
    console.log(`   ${hasBackupTitle ? '✅' : '❌'} Backup page title`);
    console.log(`   ${hasServices ? '✅' : '❌'} M365 services loaded`);
    console.log(`   ${hasKPI ? '✅' : '❌'} KPI metrics`);

    // Take screenshot
    console.log('\n6️⃣ Taking authenticated page screenshot...');
    await page.screenshot({ path: '/tmp/backup-page-authenticated.png', fullPage: true });
    console.log('   ✅ Screenshot saved');

    console.log('\n✅ Authentication and Backup UI test completed!');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
  } finally {
    if (browser) await browser.close();
  }
})();
