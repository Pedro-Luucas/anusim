import { chromium } from 'playwright'
import { mkdirSync } from 'fs'
import { join } from 'path'

async function captureScreenshots() {
  const browser = await chromium.launch()
  const context = await browser.newContext({ viewport: { width: 1280, height: 800 } })
  const page = await context.newPage()

  mkdirSync(join(process.cwd(), 'screenshots'), { recursive: true })

  console.log('📸 Capturing unconfigured state...')
  await page.goto('http://localhost:3000/chat')
  await page.waitForTimeout(2000)
  await page.screenshot({ path: 'screenshots/chat-unconfigured.png' })

  console.log('📸 Capturing mobile view...')
  await context.newPage()
  const mobilePage = await context.newPage()
  await mobilePage.setViewportSize({ width: 375, height: 667 })
  await mobilePage.goto('http://localhost:3000/chat')
  await mobilePage.waitForTimeout(2000)
  await mobilePage.screenshot({ path: 'screenshots/chat-mobile-unconfigured.png' })

  await browser.close()
  console.log('✅ Screenshots captured successfully')
}

captureScreenshots().catch(console.error)
