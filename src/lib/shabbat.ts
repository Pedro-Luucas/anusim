const GEONAMEID = "3465196"

export const CANDLE_LIGHTING_MINUTES_BEFORE_SUNSET = 18
export const HAVDALAH_DEGREES_BELOW_HORIZON = 8.5

type HebcalShabbatItem = {
  title: string
  date: string
  category: string
  hebrew?: string
  memo?: string
  link?: string
}

type HebcalShabbatResponse = {
  items: HebcalShabbatItem[]
  location: {
    title: string
    city: string
  }
}

export type ShabbatTimes = {
  candleLighting: string
  havdalah: string
  parasha: {
    name: string
    hebrew: string
    link: string
  } | null
}

export async function fetchShabbatTimes(): Promise<ShabbatTimes | null> {
  try {
    const now = new Date()
    const start = formatDate(now)
    const end = formatDate(new Date(now.getTime() + 7 * 86_400_000))

    const res = await fetch(
      `https://www.hebcal.com/shabbat?cfg=json&geonameid=${GEONAMEID}&M=on&lg=s&start=${start}&end=${end}`,
      { next: { revalidate: 21600 } }
    )

    if (!res.ok) return null

    const data: HebcalShabbatResponse = await res.json()

    const candleLightingItem = data.items.find((item) => item.category === "candles")
    const havdalahItem = data.items.find((item) => item.category === "havdalah")
    const parashaItem = data.items.find((item) => item.category === "parashat")

    if (!candleLightingItem || !havdalahItem) return null

    return {
      candleLighting: extractTime(candleLightingItem.date),
      havdalah: extractTime(havdalahItem.date),
      parasha: parashaItem
        ? {
            name: parashaItem.title.replace("Parashat ", ""),
            hebrew: parashaItem.hebrew || "",
            link: parashaItem.link || "",
          }
        : null,
    }
  } catch (err) {
    console.error("[shabbat] fetch failed:", err)
    return null
  }
}

function formatDate(date: Date): string {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, "0")
  const d = String(date.getDate()).padStart(2, "0")
  return `${y}-${m}-${d}`
}

function extractTime(isoTimestamp: string): string {
  const date = new Date(isoTimestamp)
  return date.toLocaleTimeString("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  })
}
