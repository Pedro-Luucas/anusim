import Link from "next/link"
import { Header } from "@/components/header"
import { ZmanimSection } from "@/components/zmanim-section"
import { fetchZmanim, fetchParasha, getMainZmanim } from "@/lib/hebcal"
import { getDailyQuote } from "@/lib/quotes"

import type { ParashaItem } from "@/lib/hebcal"

function formatPortugueseDate(date: Date): string {
  return date.toLocaleDateString("pt-BR", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  })
}

export default async function Home() {
  const today = new Date()
  const dateStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`

  const [zmanim, parasha] = await Promise.all([
    fetchZmanim(dateStr),
    fetchParasha(),
  ])

  const quote = getDailyQuote()

  return (
    <div className="min-h-screen bg-[#f8fafc]">
      <Header />

      <main className="mx-auto max-w-2xl px-4 py-6 flex flex-col gap-5">
        <WelcomeSection date={formatPortugueseDate(today)} />
        <CalendarBanner />
        <QuoteSection text={quote.text} source={quote.source} />
        <ParashaSection parasha={parasha} />
        <ZmanimSection
          zmanim={zmanim ? getMainZmanim(zmanim.times) : []}
          date={formatPortugueseDate(today)}
        />
      </main>
    </div>
  )
}

function CalendarBanner() {
  return (
    <Link
      href="/pages/calendario"
      className="flex items-center justify-between rounded-2xl border border-primary-200 bg-white px-5 py-4 shadow-sm hover:border-primary-400 hover:shadow-md transition-all group"
    >
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-700 text-lg">
          📅
        </div>
        <div>
          <p className="text-sm font-semibold text-primary-800">Calendário Judaico</p>
          <p className="text-xs text-neutral-500">Ver datas, Yom Tov e eventos</p>
        </div>
      </div>
      <span className="text-primary-400 group-hover:text-primary-600 transition-colors text-lg">→</span>
    </Link>
  )
}

function WelcomeSection({ date }: { date: string }) {
  return (
    <section className="rounded-2xl bg-gradient-to-br from-primary-700 to-primary-800 p-5 text-white shadow-lg">
      <h1 className="text-xl font-bold sm:text-2xl">
        Shalom! Bem-vindo à Anusim Brasil
      </h1>
      <p className="mt-1 text-sm text-primary-200 capitalize">
        {date}
      </p>
      <p className="mt-3 text-sm leading-relaxed text-primary-100">
        Comunidade judaica em Criciúma. Acompanhe os horários de oração, a
        parashá da semana e conecte-se com a comunidade.
      </p>
    </section>
  )
}

function QuoteSection({ text, source }: { text: string; source: string }) {
  return (
    <section className="rounded-2xl border border-accent-200 bg-accent-50 p-5">
      <h2 className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-accent-700">
        <span className="inline-block h-px w-4 bg-accent-400" />
        Frase do Dia
      </h2>
      <blockquote className="text-sm leading-relaxed text-neutral-800 italic">
        &ldquo;{text}&rdquo;
      </blockquote>
      <p className="mt-2 text-xs font-medium text-accent-600">
        — {source}
      </p>
    </section>
  )
}

function ParashaSection({ parasha }: { parasha: ParashaItem | null }) {
  if (!parasha) {
    return (
      <section className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm">
        <h2 className="text-base font-bold text-primary-700">
          Parashá da Semana
        </h2>
        <p className="mt-2 text-sm text-neutral-500">
          Não foi possível carregar a parashá. Tente novamente mais tarde.
        </p>
      </section>
    )
  }

  return (
    <section className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm">
      <h2 className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-primary-500">
        <span className="inline-block h-px w-4 bg-primary-300" />
        Parashá da Semana
      </h2>

      <div className="mt-3">
        <p className="text-2xl font-bold text-primary-700" dir="rtl">
          {parasha.hebrew}
        </p>
        <p className="mt-1 text-base font-semibold text-neutral-800">
          {parasha.title}
        </p>
        {parasha.hdate && (
          <p className="mt-0.5 text-xs text-neutral-500">{parasha.hdate}</p>
        )}
      </div>

      {parasha.leyning && (
        <div className="mt-4 space-y-2">
          <ParashaDetail label="Torá" value={parasha.leyning.torah} />
          <ParashaDetail label="Haftará" value={parasha.leyning.haftarah} />
          {parasha.leyning.haftarah_sephardic && (
            <ParashaDetail
              label="Haftará (Sefaradi)"
              value={parasha.leyning.haftarah_sephardic}
            />
          )}
          {parasha.leyning.maftir && (
            <ParashaDetail label="Maftir" value={parasha.leyning.maftir} />
          )}
        </div>
      )}

      <a
        href={parasha.link}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-primary-600 hover:text-primary-700 transition-colors"
      >
        Ver leitura completa
        <span aria-hidden="true">&rarr;</span>
      </a>
    </section>
  )
}

function ParashaDetail({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-0.5 sm:flex-row sm:gap-2">
      <span className="text-xs font-semibold text-neutral-500 sm:min-w-28">
        {label}:
      </span>
      <span className="text-xs text-neutral-700">{value}</span>
    </div>
  )
}

