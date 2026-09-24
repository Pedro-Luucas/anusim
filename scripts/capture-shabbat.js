const { chromium } = require('playwright')
const path = require('path')

async function captureShabbatSection() {
  const browser = await chromium.launch()
  const outputDir = '/opt/cursor/artifacts/screenshots'
  
  console.log('Capturing Shabbat section screenshots...')
  
  // Desktop
  const desktopPage = await browser.newPage({
    viewport: { width: 1920, height: 1080 }
  })
  
  await desktopPage.goto('http://localhost:3000')
  await desktopPage.waitForTimeout(2000)
  
  const shabbatSection = await desktopPage.locator('section').filter({ hasText: 'שַׁבָּת שָׁלוֹם' }).first()
  await shabbatSection.screenshot({ path: path.join(outputDir, 'shabbat-section-desktop.png') })
  console.log('✓ Desktop screenshot saved')
  
  await desktopPage.close()
  
  // Mobile
  const mobilePage = await browser.newPage({
    viewport: { width: 375, height: 812 }
  })
  
  await mobilePage.goto('http://localhost:3000')
  await mobilePage.waitForTimeout(2000)
  
  const shabbatSectionMobile = await mobilePage.locator('section').filter({ hasText: 'שַׁבָּת שָׁלוֹם' }).first()
  await shabbatSectionMobile.screenshot({ path: path.join(outputDir, 'shabbat-section-mobile.png') })
  console.log('✓ Mobile screenshot saved')
  
  await mobilePage.close()
  await browser.close()
  
  console.log('Done!')
}

captureShabbatSection().catch(console.error)
