import { fetchShabbatTimes, CANDLE_LIGHTING_MINUTES_BEFORE_SUNSET, HAVDALAH_DEGREES_BELOW_HORIZON } from "@/lib/shabbat"
import { WEEKLY_SCHEDULE } from "@/data/agenda"

export async function ShabbatSection() {
  const shabbatTimes = await fetchShabbatTimes()

  const kabalatShabat = WEEKLY_SCHEDULE.find((e) => e.id === "kabalat-shabat")
  const shacharit = WEEKLY_SCHEDULE.find((e) => e.id === "shacharit-shabat")

  if (!shabbatTimes) {
    return (
      <section className="mx-auto max-w-7xl px-5 py-12 md:px-10">
        <div className="rounded-2xl border border-gold-300/60 bg-cream-50 p-8 text-center">
          <p className="text-sm text-ink-500">
            Horários do Shabat temporariamente indisponíveis
          </p>
        </div>
      </section>
    )
  }

  return (
    <section className="mx-auto max-w-7xl px-5 py-12 md:px-10">
      <div className="rounded-3xl border border-gold-300/60 bg-gradient-to-br from-cream-50 via-gold-50 to-cream-50 p-8 md:p-12 shadow-[0_8px_40px_-12px_rgba(201,162,83,0.4)]">
        <div className="text-center mb-8">
          <p className="eyebrow text-gold-700">שַׁבָּת שָׁלוֹם</p>
          <h2 className="mt-2 font-display text-3xl md:text-4xl font-semibold text-ink-900">
            Horários do Shabat
          </h2>
          <p className="mt-2 text-sm text-ink-500">Criciúma, Santa Catarina</p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <div className="rounded-2xl border border-gold-200 bg-white/80 backdrop-blur-sm p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs uppercase tracking-wider text-gold-700 font-semibold">
                  Sexta-feira
                </p>
                <p className="mt-1 text-lg font-semibold text-ink-900">
                  Acendimento das Velas
                </p>
                <p className="mt-4 font-mono text-4xl font-bold text-gold-600 tabular-nums">
                  {shabbatTimes.candleLighting}
                </p>
              </div>
              <div className="text-3xl">🕯️</div>
            </div>
            {kabalatShabat && (
              <div className="mt-6 pt-6 border-t border-gold-100">
                <p className="text-sm text-ink-700">
                  <span className="font-semibold">{kabalatShabat.title}</span> às{" "}
                  <span className="font-mono font-semibold">{kabalatShabat.time}</span>
                </p>
              </div>
            )}
          </div>

          <div className="rounded-2xl border border-gold-200 bg-white/80 backdrop-blur-sm p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs uppercase tracking-wider text-gold-700 font-semibold">
                  Sábado
                </p>
                <p className="mt-1 text-lg font-semibold text-ink-900">Havdalá</p>
                <p className="mt-4 font-mono text-4xl font-bold text-gold-600 tabular-nums">
                  {shabbatTimes.havdalah}
                </p>
              </div>
              <div className="text-3xl">✨</div>
            </div>
            {shacharit && (
              <div className="mt-6 pt-6 border-t border-gold-100">
                <p className="text-sm text-ink-700">
                  <span className="font-semibold">{shacharit.title}</span> às{" "}
                  <span className="font-mono font-semibold">{shacharit.time}</span>
                </p>
              </div>
            )}
          </div>
        </div>

        {shabbatTimes.parasha && (
          <div className="mt-6 rounded-2xl border border-gold-200 bg-white/80 backdrop-blur-sm p-6">
            <p className="text-xs uppercase tracking-wider text-gold-700 font-semibold mb-3">
              Parashá da Semana
            </p>
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <p className="text-2xl font-display font-semibold text-ink-900">
                  {shabbatTimes.parasha.name}
                </p>
                {shabbatTimes.parasha.hebrew && (
                  <p className="mt-1 font-hebrew text-xl text-gold-700" dir="rtl">
                    {shabbatTimes.parasha.hebrew}
                  </p>
                )}
              </div>
              {shabbatTimes.parasha.link && (
                <a
                  href={shabbatTimes.parasha.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-full border border-gold-500 bg-gold-500 px-5 py-2.5 text-sm font-semibold text-ink-900 transition-all hover:bg-gold-600 hover:border-gold-600 whitespace-nowrap"
                >
                  Ler no Sefaria
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </a>
              )}
            </div>
          </div>
        )}

        <div className="mt-6 text-center text-xs text-ink-500">
          <p>
            Acendimento das velas: {CANDLE_LIGHTING_MINUTES_BEFORE_SUNSET} minutos antes do pôr do sol
          </p>
          <p>Havdalá: {HAVDALAH_DEGREES_BELOW_HORIZON}° abaixo do horizonte</p>
          <p className="mt-1 italic">(costume sefaradi — a confirmar com o Rabino Malachy)</p>
        </div>
      </div>
    </section>
  )
}
