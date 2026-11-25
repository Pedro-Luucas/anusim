import { fetchShabbatTimes, CANDLE_LIGHTING_MINUTES_BEFORE_SUNSET, HAVDALAH_DEGREES_BELOW_HORIZON } from "@/lib/shabbat"
import { WEEKLY_SCHEDULE } from "@/data/agenda"
import { Menorah, StarOfDavid } from "@/components/landing/judaic-symbols"

export async function ShabbatSection() {
  const shabbatTimes = await fetchShabbatTimes()

  const kabalatShabat = WEEKLY_SCHEDULE.find((e) => e.id === "kabalat-shabat")
  const shacharit = WEEKLY_SCHEDULE.find((e) => e.id === "shacharit-shabat")

  if (!shabbatTimes || !shabbatTimes.havdalah) {
    return (
      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-5 md:px-10 md:py-12">
        <div className="rounded-2xl border border-gold-300/60 bg-cream-50 p-8 text-center">
          <p className="text-sm text-ink-500">
            Horários do Shabat temporariamente indisponíveis
          </p>
        </div>
      </section>
    )
  }

  const { candleLighting, havdalah, parasha } = shabbatTimes

  return (
    <section className="mx-auto max-w-7xl px-4 py-10 sm:px-5 md:px-10 md:py-12">
      <div className="rounded-3xl border border-gold-300/60 bg-gradient-to-br from-cream-50 via-gold-50 to-cream-50 p-5 shadow-[0_8px_40px_-12px_rgba(201,162,83,0.4)] sm:p-8 md:p-12">
        <div className="mb-6 text-center sm:mb-8">
          <p className="font-hebrew text-xl text-gold-700 sm:text-2xl" dir="rtl">
            שַׁבָּת שָׁלוֹם
          </p>
          <h2 className="mt-2 font-display text-[1.85rem] font-medium leading-tight text-ink-900 sm:text-4xl">
            Horários do Shabat
          </h2>
          <p className="mt-2 text-sm text-ink-500">Criciúma, Santa Catarina</p>
        </div>

        <div className="grid gap-4 sm:gap-6 md:grid-cols-2">
          <div className="rounded-2xl border border-gold-200 bg-cream-50 p-5 sm:p-6">
            <div className="mb-4 flex items-center justify-between gap-3">
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-gold-700 sm:tracking-[0.18em]">
                Acendimento das velas
              </p>
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gold-100 text-gold-700">
                <Menorah className="h-7 w-7" />
              </span>
            </div>
            <div className="space-y-4">
              {candleLighting.map((candle, index) => (
                <div key={index}>
                  <p className="text-sm capitalize text-ink-600">
                    {candle.dayName}, {candle.dateFormatted}
                  </p>
                  {candle.occasion && (
                    <p className="mt-0.5 w-fit max-w-full font-hebrew text-sm text-gold-700" dir="auto">{candle.occasion}</p>
                  )}
                  <p className="mt-1 font-display text-4xl font-medium tabular-nums text-gold-700">
                    {candle.time}
                  </p>
                </div>
              ))}
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

          <div className="rounded-2xl border border-gold-200 bg-cream-50 p-5 sm:p-6">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-gold-700 sm:tracking-[0.18em]">
                  {havdalah.dayName}, {havdalah.dateFormatted}
                </p>
                <p className="mt-1 font-display text-2xl text-ink-900">Havdalá</p>
                <p className="mt-3 font-display text-4xl font-medium tabular-nums text-gold-700">
                  {havdalah.time}
                </p>
              </div>
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gold-100 text-gold-700">
                <StarOfDavid className="h-6 w-6" />
              </span>
            </div>
            {shacharit && (
              <div className="mt-6 pt-6 border-t border-gold-100">
                <p className="text-sm text-ink-700">
                  <span className="font-semibold">{shacharit.title}</span> aos sábados às{" "}
                  <span className="font-mono font-semibold">{shacharit.time}</span>
                </p>
              </div>
            )}
          </div>
        </div>

        {parasha && (
          <div className="mt-4 rounded-2xl border border-gold-200 bg-cream-50 p-5 sm:mt-6 sm:p-6">
            <p className="text-xs uppercase tracking-wider text-gold-700 font-semibold mb-3">
              {parasha.isHoliday ? "Leitura da Festa" : "Parashá da Semana"}
            </p>
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <p className="text-2xl font-display font-semibold text-ink-900">
                  {parasha.name}
                </p>
                {parasha.hebrew && (
                  <p className="mt-1 w-fit max-w-full font-hebrew text-xl text-gold-700" dir="rtl">
                    {parasha.hebrew}
                  </p>
                )}
              </div>
              {parasha.link && (
                <a
                  href={parasha.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-full border border-gold-500 bg-gold-500 px-5 py-2.5 text-sm font-semibold text-ink-900 transition-all hover:border-gold-600 hover:bg-gold-600 sm:w-auto"
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
          </div>
        )}

        <div className="mt-6 text-balance text-center text-xs leading-relaxed text-ink-500">
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
