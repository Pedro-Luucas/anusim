import { fetchShabbatTimes, CANDLE_LIGHTING_MINUTES_BEFORE_SUNSET, HAVDALAH_DEGREES_BELOW_HORIZON } from "@/lib/shabbat"
import { WEEKLY_SCHEDULE } from "@/data/agenda"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export async function ShabbatSection() {
  const shabbatTimes = await fetchShabbatTimes()

  const kabalatShabat = WEEKLY_SCHEDULE.find((e) => e.id === "kabalat-shabat")
  const shacharit = WEEKLY_SCHEDULE.find((e) => e.id === "shacharit-shabat")

  if (!shabbatTimes || !shabbatTimes.havdalah) {
    return (
      <section className="mx-auto max-w-7xl px-5 py-12 md:px-10">
        <Card className="rounded-2xl border-gold-300/60 bg-cream-50 py-8 text-center ring-gold-200/50">
          <CardContent>
            <p className="text-sm text-ink-500">
              Horários do Shabat temporariamente indisponíveis
            </p>
          </CardContent>
        </Card>
      </section>
    )
  }

  const { candleLighting, havdalah, parasha } = shabbatTimes

  return (
    <section className="mx-auto max-w-7xl px-5 py-12 md:px-10">
      <div className="rounded-3xl border border-gold-300/60 bg-gradient-to-br from-cream-50 via-gold-50 to-cream-50 p-8 shadow-[0_8px_40px_-12px_rgba(201,162,83,0.4)] md:p-12">
        <div className="mb-8 text-center">
          <p className="eyebrow text-gold-700" dir="rtl">שַׁבָּת שָׁלוֹם</p>
          <h2 className="mt-2 font-display text-3xl font-semibold text-ink-900 md:text-4xl">
            Horários do Shabat
          </h2>
          <p className="mt-2 text-sm text-ink-500">Criciúma, Santa Catarina</p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Card className="rounded-2xl border-gold-200 bg-cream-50 py-0 ring-gold-200/60">
            <CardHeader className="flex flex-row items-start justify-between gap-3 px-6 pt-6">
              <CardTitle className="text-xs font-semibold tracking-wider text-gold-700 uppercase">
                Acendimento das Velas
              </CardTitle>
              <span className="text-3xl" aria-hidden="true">🕯️</span>
            </CardHeader>
            <CardContent className="px-6 pb-6">
              <div className="space-y-4">
                {candleLighting.map((candle, index) => (
                  <div key={index}>
                    <p className="text-sm text-ink-500 capitalize">
                      {candle.dayName}, {candle.dateFormatted}
                    </p>
                    {candle.occasion && (
                      <p className="mt-0.5 font-hebrew text-xs text-gold-700" dir="rtl">{candle.occasion}</p>
                    )}
                    <p className="mt-1 font-display text-4xl font-semibold tracking-tight text-gold-600 tabular-nums">
                      {candle.time}
                    </p>
                  </div>
                ))}
              </div>
              {kabalatShabat && (
                <div className="mt-6 border-t border-gold-200 pt-6">
                  <p className="text-sm text-ink-700">
                    <span className="font-semibold">{kabalatShabat.title}</span> às{" "}
                    <span className="font-display font-semibold tabular-nums">{kabalatShabat.time}</span>
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="rounded-2xl border-gold-200 bg-cream-50 py-0 ring-gold-200/60">
            <CardHeader className="flex flex-row items-start justify-between gap-3 px-6 pt-6">
              <div>
                <p className="text-xs font-semibold tracking-wider text-gold-700 uppercase">
                  {havdalah.dayName}, {havdalah.dateFormatted}
                </p>
                <CardTitle className="mt-1 font-display text-lg font-semibold text-ink-900">
                  Havdalá
                </CardTitle>
              </div>
              <span className="text-3xl" aria-hidden="true">✨</span>
            </CardHeader>
            <CardContent className="px-6 pb-6">
              <p className="font-display text-5xl font-semibold tracking-tight text-gold-600 tabular-nums">
                {havdalah.time}
              </p>
              {shacharit && (
                <div className="mt-6 border-t border-gold-200 pt-6">
                  <p className="text-sm text-ink-700">
                    <span className="font-semibold">{shacharit.title}</span> aos sábados às{" "}
                    <span className="font-display font-semibold tabular-nums">{shacharit.time}</span>
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {parasha && (
          <Card className="mt-6 rounded-2xl border-gold-200 bg-cream-50 py-0 ring-gold-200/60">
            <CardContent className="p-6">
              <p className="mb-3 text-xs font-semibold tracking-wider text-gold-700 uppercase">
                {parasha.isHoliday ? "Leitura da Festa" : "Parashá da Semana"}
              </p>
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                  <p className="font-display text-2xl font-semibold text-ink-900">
                    {parasha.name}
                  </p>
                  {parasha.hebrew && (
                    <p className="mt-1 font-hebrew text-xl text-gold-700" dir="rtl">
                      {parasha.hebrew}
                    </p>
                  )}
                </div>
                {parasha.link && (
                  <a
                    href={parasha.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 whitespace-nowrap rounded-full border border-gold-500 bg-gold-500 px-5 py-2.5 text-sm font-semibold text-ink-900 transition-all hover:border-gold-600 hover:bg-gold-600"
                  >
                    {parasha.link.includes("sefaria.org")
                      ? "Ler no Sefaria"
                      : "Ver a leitura"}
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </a>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        <div className="mt-6 text-center text-xs text-ink-500">
          <p>
            Acendimento das velas: {CANDLE_LIGHTING_MINUTES_BEFORE_SUNSET} minutos antes do pôr do sol
          </p>
          <p>Havdalá: {HAVDALAH_DEGREES_BELOW_HORIZON}° abaixo do horizonte</p>
          <p className="mt-1 italic">(costume sefaradi, a confirmar com o Rabino Malachy)</p>
        </div>
      </div>
    </section>
  )
}
