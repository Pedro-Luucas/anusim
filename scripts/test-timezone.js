#!/usr/bin/env node

/**
 * Test script to verify Shabbat times are displayed in America/Sao_Paulo timezone
 * Run with: TZ=UTC node scripts/test-timezone.js
 */

const GEONAMEID = "3465196"

async function testTimezone() {
  console.log("Testing Shabbat times for Criciúma, SC (geonameid 3465196)")
  console.log(`Server timezone: ${process.env.TZ || Intl.DateTimeFormat().resolvedOptions().timeZone}`)
  console.log("")

  const now = new Date()
  const start = formatDate(now)
  const end = formatDate(new Date(now.getTime() + 14 * 86_400_000))

  const res = await fetch(
    `https://www.hebcal.com/shabbat?cfg=json&geonameid=${GEONAMEID}&M=on&lg=s&start=${start}&end=${end}`
  )

  if (!res.ok) {
    console.error("Failed to fetch from Hebcal API")
    process.exit(1)
  }

  const data = await res.json()

  console.log("=== RAW HEBCAL DATA ===")
  const candleItems = data.items.filter((item) => item.category === "candles")
  const havdalahItem = data.items.find((item) => item.category === "havdalah")

  candleItems.forEach((item, i) => {
    console.log(`\nCandle lighting ${i + 1}:`)
    console.log(`  Raw ISO: ${item.date}`)
    console.log(`  Title: ${item.title}`)
    console.log(`  Memo: ${item.memo || "(none)"}`)
    const date = new Date(item.date)
    const time = date.toLocaleTimeString("pt-BR", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
      timeZone: "America/Sao_Paulo",
    })
    const dayName = new Intl.DateTimeFormat("pt-BR", {
      weekday: "long",
      timeZone: "America/Sao_Paulo",
    }).format(date)
    console.log(`  Formatted time (Sao Paulo): ${time}`)
    console.log(`  Day name (Sao Paulo): ${dayName}`)
  })

  if (havdalahItem) {
    console.log(`\nHavdalah:`)
    console.log(`  Raw ISO: ${havdalahItem.date}`)
    const date = new Date(havdalahItem.date)
    const time = date.toLocaleTimeString("pt-BR", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
      timeZone: "America/Sao_Paulo",
    })
    const dayName = new Intl.DateTimeFormat("pt-BR", {
      weekday: "long",
      timeZone: "America/Sao_Paulo",
    }).format(date)
    console.log(`  Formatted time (Sao Paulo): ${time}`)
    console.log(`  Day name (Sao Paulo): ${dayName}`)
  }

  console.log("\n=== EXPECTED FOR SUKKOT WEEK (Sep 25-27, 2026) ===")
  console.log("Candle 1: sexta, 25/09 at 17:57 (Erev Sukkot)")
  console.log("Candle 2: sábado, 26/09 at 18:51 (after Shabbat, for Sukkot II)")
  console.log("Havdalah: domingo, 27/09 at 18:51")

  console.log("\n✅ Test complete")
}

function formatDate(date) {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, "0")
  const d = String(date.getDate()).padStart(2, "0")
  return `${y}-${m}-${d}`
}

testTimezone().catch(console.error)
