const { chromium } = require('playwright')
const path = require('path')

async function captureShabbatSection() {
  const browser = await chromium.launch()
  const outputDir = '/opt/cursor/artifacts/screenshots'
  
  console.log('Capturing Shabbat section screenshots...')
  
  // Desktop (1280px width as requested)
  const desktopPage = await browser.newPage({
    viewport: { width: 1280, height: 1080 }
  })
  
  await desktopPage.goto('http://localhost:3000')
  await desktopPage.waitForTimeout(2000)
  
  const shabbatSection = await desktopPage.locator('section').filter({ hasText: 'שַׁבָּת שָׁלוֹם' }).first()
  await shabbatSection.screenshot({ path: path.join(outputDir, 'shabbat-section-desktop-1280.png') })
  console.log('✓ Desktop screenshot saved (1280px)')
  
  await desktopPage.close()
  
  // Mobile (390px width as requested)
  const mobilePage = await browser.newPage({
    viewport: { width: 390, height: 844 }
  })
  
  await mobilePage.goto('http://localhost:3000')
  await mobilePage.waitForTimeout(2000)
  
  const shabbatSectionMobile = await mobilePage.locator('section').filter({ hasText: 'שַׁבָּת שָׁלוֹם' }).first()
  await shabbatSectionMobile.screenshot({ path: path.join(outputDir, 'shabbat-section-mobile-390.png') })
  console.log('✓ Mobile screenshot saved (390px)')
  
  await mobilePage.close()
  await browser.close()
  
  console.log('Done!')
}

captureShabbatSection().catch(console.error)
