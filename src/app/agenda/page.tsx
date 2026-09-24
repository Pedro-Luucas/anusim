import { SiteHeader } from "@/components/landing/site-header"
import { SiteFooter } from "@/components/landing/site-footer"
import { WEEKLY_SCHEDULE, DAY_ORDER, DAY_NAMES_PT } from "@/data/agenda"

export default function AgendaPage() {
  const scheduleByDay = DAY_ORDER.map((day) => {
    const dayEvents = WEEKLY_SCHEDULE.filter((e) => e.day === day)
    const sortedEvents = dayEvents.sort((a, b) => {
      const orderA = a.displayOrder ?? 999
      const orderB = b.displayOrder ?? 999
      return orderA - orderB
    })
    
    return {
      day,
      dayName: DAY_NAMES_PT[day],
      events: sortedEvents,
    }
  })

  return (
    <>
      <SiteHeader />
      <main className="min-h-screen bg-cream-100 pt-24 pb-16">
        <div className="mx-auto max-w-4xl px-5 md:px-10">
          <div className="text-center">
            <p className="eyebrow text-gold-700">Horários semanais</p>
            <h1 className="mt-3 font-display text-4xl md:text-5xl font-semibold text-ink-900">
              Agenda da Sinagoga
            </h1>
            <p className="mt-4 text-lg text-ink-600 max-w-2xl mx-auto">
              Serviços regulares da comunidade Anussim Brasil em Criciúma, SC.
              Todos são bem-vindos.
            </p>
          </div>

          <div className="mt-12 space-y-8">
            {scheduleByDay.map(({ day, dayName, events }) => (
              <div
                key={day}
                className={`rounded-2xl border ${
                  events.length > 0
                    ? "border-gold-300/60 bg-cream-50"
                    : "border-gold-200/40 bg-cream-50/50"
                } p-6 md:p-8`}
              >
                <h2 className="text-xl font-semibold text-ink-900">{dayName}</h2>
                {events.length > 0 ? (
                  <ul className="mt-5 space-y-4">
                    {events.map((event) => (
                      <li
                        key={event.id}
                        className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 rounded-xl bg-white/80 border border-gold-200 p-5"
                      >
                        <div className="flex-1">
                          <div className="flex items-center gap-3 flex-wrap">
                            <h3 className="text-lg font-semibold text-ink-900">
                              {event.title}
                            </h3>
                            {event.status === "to_confirm" && (
                              <span className="inline-flex items-center gap-1 rounded-full bg-gold-100 px-2.5 py-0.5 text-xs font-medium text-gold-800">
                                <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 20 20">
                                  <path
                                    fillRule="evenodd"
                                    d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                                    clipRule="evenodd"
                                  />
                                </svg>
                                A confirmar
                              </span>
                            )}
                          </div>
                          {event.description && (
                            <p className="mt-2 text-sm text-ink-600">
                              {event.description}
                            </p>
                          )}
                          <p className="mt-2 text-xs text-ink-500">
                            Fonte:{" "}
                            {event.source.startsWith("http") ? (
                              <a
                                href={event.source}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="underline hover:text-gold-700"
                              >
                                Live no YouTube
                              </a>
                            ) : (
                              event.source
                            )}
                          </p>
                        </div>
                        <div className="flex-shrink-0">
                          <p className="font-mono text-2xl font-bold text-gold-600 tabular-nums">
                            {event.time}
                          </p>
                        </div>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="mt-3 text-sm text-ink-500 italic">
                    Nenhum serviço regular neste dia
                  </p>
                )}
              </div>
            ))}
          </div>

          <div className="mt-12 rounded-2xl border border-gold-300/60 bg-gradient-to-br from-gold-50 to-cream-50 p-6 md:p-8">
            <h3 className="text-lg font-semibold text-ink-900">
              Horários marcados com &ldquo;A confirmar&rdquo;
            </h3>
            <p className="mt-3 text-sm leading-relaxed text-ink-700">
              Alguns horários ainda estão aguardando confirmação do Rabino Malachy
              Ben Israel. Antes de visitar pela primeira vez, recomendamos entrar
              em contato pelo WhatsApp para confirmar o horário exato.
            </p>
            <a
              href="https://wa.me/554899231358?text=Shalom%20Rabino%20Malachy!%20Gostaria%20de%20confirmar%20os%20hor%C3%A1rios%20dos%20servi%C3%A7os."
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 inline-flex items-center gap-2 rounded-full border border-gold-500 bg-gold-500 px-5 py-2.5 text-sm font-semibold text-ink-900 transition-all hover:bg-gold-600 hover:border-gold-600"
            >
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z" />
              </svg>
              Falar com o Rabino
            </a>
          </div>

          <div className="mt-8 text-center">
            <p className="text-sm text-ink-500">
              <strong className="text-ink-700">Endereço:</strong> R. Joaquim
              Nabuco, 140 — Centro, Criciúma, SC, 88802-200
            </p>
            <p className="mt-2 text-sm text-ink-500">
              Transmissões ao vivo disponíveis no{" "}
              <a
                href="https://www.youtube.com/@anussimbrasilcriciuma5648/streams"
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-gold-700 hover:underline"
              >
                YouTube
              </a>
            </p>
          </div>
        </div>
      </main>
      <SiteFooter />
    </>
  )
}
