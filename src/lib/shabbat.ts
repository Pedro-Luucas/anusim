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
  yomtov?: boolean
}

type HebcalShabbatResponse = {
  items: HebcalShabbatItem[]
  location: {
    title: string
    city: string
  }
}

export type CandleLightingEvent = {
  date: string
  time: string
  dayName: string
  dateFormatted: string
  occasion?: string
}

export type HavdalahEvent = {
  date: string
  time: string
  dayName: string
  dateFormatted: string
}

export type ParashaOrHoliday = {
  name: string
  hebrew: string
  link: string
  isHoliday: boolean
}

export type ShabbatTimes = {
  candleLighting: CandleLightingEvent[]
  havdalah: HavdalahEvent | null
  parasha: ParashaOrHoliday | null
}

function formatBrazilianDate(isoDate: string): string {
  const date = new Date(isoDate)
  const day = date.toLocaleDateString("pt-BR", {
    day: "2-digit",
    timeZone: "America/Sao_Paulo",
  })
  const month = date.toLocaleDateString("pt-BR", {
    month: "2-digit",
    timeZone: "America/Sao_Paulo",
  })
  return `${day}/${month}`
}

function getDayName(isoDate: string): string {
  const date = new Date(isoDate)
  const formatter = new Intl.DateTimeFormat("pt-BR", {
    weekday: "long",
    timeZone: "America/Sao_Paulo",
  })
  const weekdayFull = formatter.format(date)
  const shortMap: Record<string, string> = {
    "domingo": "domingo",
    "segunda-feira": "segunda",
    "terça-feira": "terça",
    "quarta-feira": "quarta",
    "quinta-feira": "quinta",
    "sexta-feira": "sexta",
    "sábado": "sábado",
  }
  return shortMap[weekdayFull] || weekdayFull
}

export async function fetchShabbatTimes(): Promise<ShabbatTimes | null> {
  try {
    const now = new Date()
    const start = formatDate(now)
    const end = formatDate(new Date(now.getTime() + 14 * 86_400_000))

    const res = await fetch(
      `https://www.hebcal.com/shabbat?cfg=json&geonameid=${GEONAMEID}&M=on&lg=s&start=${start}&end=${end}`,
      { next: { revalidate: 21600 } }
    )

    if (!res.ok) return null

    const data: HebcalShabbatResponse = await res.json()

    const candleLightingItems = data.items.filter(
      (item) => item.category === "candles"
    )
    const havdalahItem = data.items.find((item) => item.category === "havdalah")
    const parashaItem = data.items.find((item) => item.category === "parashat")
    const holidayItem = data.items.find(
      (item) => item.category === "holiday" && item.yomtov
    )

    const candleLighting: CandleLightingEvent[] = candleLightingItems.map(
      (item, index) => {
        const isSaturdayEvening = getDayName(item.date) === "sábado" && index > 0
        let occasion = item.memo
        if (isSaturdayEvening && occasion) {
          occasion = `${occasion}, após o anoitecer`
        }
        return {
          date: item.date,
          time: extractTime(item.date),
          dayName: getDayName(item.date),
          dateFormatted: formatBrazilianDate(item.date),
          occasion,
        }
      }
    )

    const havdalah: HavdalahEvent | null = havdalahItem
      ? {
          date: havdalahItem.date,
          time: extractTime(havdalahItem.date),
          dayName: getDayName(havdalahItem.date),
          dateFormatted: formatBrazilianDate(havdalahItem.date),
        }
      : null

    let parasha: ParashaOrHoliday | null = null

    if (holidayItem && holidayItem.yomtov) {
      parasha = {
        name: holidayItem.title,
        hebrew: holidayItem.hebrew || "",
        link: holidayItem.link || "",
        isHoliday: true,
      }
    } else if (parashaItem) {
      parasha = {
        name: parashaItem.title.replace("Parashat ", ""),
        hebrew: parashaItem.hebrew || "",
        link: parashaItem.link || "",
        isHoliday: false,
      }
    }

    if (candleLighting.length === 0 || !havdalah) return null

    return {
      candleLighting,
      havdalah,
      parasha,
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
    timeZone: "America/Sao_Paulo",
  })
}
