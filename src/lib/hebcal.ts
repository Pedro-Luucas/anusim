const GEONAMEID = "3465196"

type ZmanimTimes = Record<string, string>

type ZmanimLocation = {
  title: string
  city: string
  tzid: string
  latitude: number
  longitude: number
  cc: string
  country: string
}

export type ZmanimResponse = {
  date: string
  location: ZmanimLocation
  times: ZmanimTimes
}

type Leyning = {
  torah: string
  haftarah: string
  haftarah_sephardic?: string
  maftir?: string
  "1"?: string
  "2"?: string
  "3"?: string
  "4"?: string
  "5"?: string
  "6"?: string
  "7"?: string
}

export type ParashaItem = {
  title: string
  date: string
  hdate: string
  category: string
  hebrew: string
  leyning?: Leyning
  link: string
}

type HebcalCalendarResponse = {
  items: ParashaItem[]
}

export async function fetchZmanim(date: string): Promise<ZmanimResponse | null> {
  try {
    const res = await fetch(
      `https://www.hebcal.com/zmanim?cfg=json&geonameid=${GEONAMEID}&date=${date}`,
      { next: { revalidate: 3600 } }
    )
    if (!res.ok) return null
    return res.json()
  } catch (err) {
    console.error("[hebcal] zmanim fetch failed:", err)
    return null
  }
}

export async function fetchParasha(): Promise<ParashaItem | null> {
  try {
    const now = new Date()
    const start = formatDate(now)
    const end = formatDate(new Date(now.getTime() + 14 * 86_400_000))

    const res = await fetch(
      `https://www.hebcal.com/hebcal?v=1&cfg=json&s=on&leyning=on&geonameid=${GEONAMEID}&start=${start}&end=${end}`,
      { next: { revalidate: 86400 } }
    )
    if (!res.ok) return null

    const data: HebcalCalendarResponse = await res.json()
    return data.items.find((item) => item.category === "parashat") ?? null
  } catch (err) {
    console.error("[hebcal] parasha fetch failed:", err)
    return null
  }
}

function formatDate(date: Date): string {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, "0")
  const d = String(date.getDate()).padStart(2, "0")
  return `${y}-${m}-${d}`
}

export function extractTime(isoTimestamp: string): string {
  const date = new Date(isoTimestamp)
  return date.toLocaleTimeString("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  })
}

export type ZmanItem = {
  key: string
  name: string
  time: string
  description: string
}

const ZMANIM_DESCRIPTIONS: Record<string, { name: string; description: string }> = {
  alotHaShachar: {
    name: "Alot HaShachar",
    description: `Alvorada. O momento em que um pouco da luz do sol começa a ser perceptível no leste do horizonte.\n\nJejuns comunitários (além de Yom Kipur e Tisha B'Av) começam neste momento.
     De acordo com a lei da Torá, o amanhecer marca o início do dia, e todas as mitsvot associadas às horas do dia – como ouvir o shofar, sacudir o lulav,
      recitar o Shemá ou ouvir a Meguilá durante o dia.`,
  },
  misheyakir: {
    name: "Misheyakir",
    description: `Primeiro horário para Talit e Tefilin. 
    O momento em que há luz suficiente para que se possa reconhecer um conhecido casual à distância de dois metros.
    \n\nEste é o primeiro momento para recitar o Shemá matinal, colocar talit ou tefilin e fazer a bênção do tsitsit.`,
  },
  sunrise: {
    name: "Netz HaChamá",
    description: `Nascer do sol. O momento em que a borda superior do disco solar aparece ao nível do mar.
    \n\nEsta é idealmente a primeira hora para dizer a Amidá da manhã. É também a primeira hora para outras mitsvot diurnas, como shofar e lulav.`,
  },
  sofZmanShma: {
    name: "Último Shemá",
    description: `Três shaot zmaniot durante o dia. Última hora do dia para cumprir o requisito bíblico de recitar o Shemá da manhã.
    \n\nBedi'eved (se alguém perdeu essa hora), ainda deve recitar o Shemá com suas bênçãos até chatzot.`,
  },
  sofZmanTfilla: {
    name: "Última Tefilá",
    description: `Quatro shaot zmaniot durante o dia – idealmente a última hora para Shacharit, a oração da manhã.
    \n\nNo entanto, se este tempo foi perdido, Shacharit pode ser recitado até chatzot. (Esta também é a última vez para comer chametz em Erev Pessach).`,
  },
  chatzot: {
    name: "Meio-Dia Halachico (Chatzot)",
    description: `Meio-dia. A meio caminho entre o nascer e o pôr do sol, esta é a última hora para rezar Shacharit.
    \n\nOs jejuns de meio dia terminam neste momento.`,
  },
  minchaGedola: {
    name: "Minchá Gedolá (Minchá Grande)",
    description: `Meia hora depois do chatzot, esta é a primeira vez que se pode recitar Minchá, a oração da tarde.`,
  },
  minchaKetana: {
    name: "Minchá Ketaná (Minchá Pequena)",
    description: `Duas horas e meia proporcionais antes do final do dia, este tempo tem certas ramificações no que diz 
    respeito ao início de uma refeição (especialmente na véspera de Shabat e em Yom Tov).\n\nSegundo alguns, este é o momento ideal para rezar Minchá. 
    Além disso, alguns consideram essa hora relevante para algumas das leis da Pureza Familiar. Consulte uma autoridade rabínica para mais detalhes.`,
  },
  plagHaMincha: {
    name: "Plag HaMinchá",
    description: `Uma hora e um quarto proporcionais antes do pôr-do-sol, plag haminchá é também o momento mais cedo em que se pode acender velas de Shabat 
    (e velas de Chanucá na véspera de Shabat de Chanucá).\n\nQuando houver necessidade, pode-se rezar Ma'ariv tão cedo quanto plag haminchá (embora o Shemá deva ser recitado após o anoitecer).`,
  },
  __candleLighting: {
    name: "Acendimento das Velas",
    description: `O horário do acendimento das velas de Shabat e Yom Tov é 18 minutos antes da shkiá, pôr-do-sol.`,
  },
  sunset: {
    name: "Pôr do Sol (Shkiá)",
    description: `Pôr do sol. O momento em que a borda superior do disco solar desaparece de vista no horizonte, ao nível do mar. 
    Todas as mitsvot associadas ao dia devem ser completadas até esta hora.\n\nÉ a última hora para recitar Minchá, a prece vespertina. B'dieved (se perdeu essa hora) a pessoa pode ainda recitar minchá, 
    e fazer todas as "mitsvot do horário diário" até Tzeit Hakochavim (embora a bênção sobre a mitsvá seria omitida se feita após a Shkiá).
    \n\nO dia judaico de 24 horas começa ao anoitecer. No entanto, a definição técnica do anoitecer não é clara. Pode ser cedo como a Shkiá, ou tão tarde como Tzeit Hakochavim.
     Portanto, a hora seguindo a shkiá e antes de tzeit hakochavim é chamada bein hashmashot. Muitas leis relatam este período e podem ser classificadas como o dia anterior ou então o próximo dia.`,
  },
  tzeit7083deg: {
    name: "Tzeit HaKochavim (Anoitecer)",
    description: `Anoitecer. A hora em que três estrelas podem ser observadas no céu a olho nu, o anoitecer está completo.\n\nEste tempo marca o início da noite para todas as mitsvot,
     incluindo a obrigação da Torá de recitar o Shemá da noite, contar o Omer, o fim dos dias de jejum (exceto Yom Kipur) e assuntos relacionados às leis da Pureza Familiar.`,
  },
}

const MAIN_ZMANIM_ORDER = [
  "alotHaShachar",
  "misheyakir",
  "sunrise",
  "sofZmanShma",
  "sofZmanTfilla",
  "chatzot",
  "minchaGedola",
  "minchaKetana",
  "plagHaMincha",
  "__candleLighting",
  "sunset",
  "tzeit7083deg",
]

export function getMainZmanim(times: ZmanimTimes): ZmanItem[] {
  const sunsetDate = new Date(times.sunset)
  sunsetDate.setMinutes(sunsetDate.getMinutes() - 18)

  const augmented: ZmanimTimes = {
    ...times,
    __candleLighting: sunsetDate.toISOString(),
  }

  return MAIN_ZMANIM_ORDER.filter((key) => augmented[key]).map((key) => ({
    key,
    name: ZMANIM_DESCRIPTIONS[key]?.name ?? key,
    time: extractTime(augmented[key]),
    description: ZMANIM_DESCRIPTIONS[key]?.description ?? "",
  }))
}
