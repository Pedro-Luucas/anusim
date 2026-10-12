import Link from "next/link"
import { SiteHeader } from "@/components/landing/site-header"
import { SiteFooter } from "@/components/landing/site-footer"
import {
  OrnametalDivider,
  StarOfDavid,
  Menorah,
} from "@/components/landing/judaic-symbols"

export const metadata = {
  title: "Contato",
  description:
    "Fale com o Rabino Malachy Ben Israel, veja os serviços transmitidos ao vivo e visite a sinagoga em Criciúma, SC.",
}

export default function ContatoPage() {
  return (
    <main id="main-content" className="bg-parchment text-ink-900">
      <SiteHeader />

      {/* HEADER */}
      <section className="relative pt-32 pb-12 md:pt-44 md:pb-20">
        <div className="mx-auto max-w-5xl px-5 text-center md:px-10">
          <p className="eyebrow">Visite, fale, conecte-se</p>
          <h1 className="display-xl mt-6 text-5xl text-ink-900 md:text-7xl">
            A casa está
            <br />
            <span className="italic text-gold-shimmer">aberta.</span>
          </h1>
          <p className="mx-auto mt-8 max-w-2xl font-display text-xl italic leading-relaxed text-ink-700">
            Toda visita começa com uma ligação. Toda dúvida, com uma
            conversa. Toda porta que se abre, começa com alguém que bate.
          </p>
        </div>
      </section>

      {/* PRIMARY CTA — WhatsApp rabino */}
      <section className="relative pb-16">
        <div className="mx-auto max-w-5xl px-5 md:px-10">
          <div className="relative overflow-hidden rounded-[2rem] border border-gold-300 bg-gradient-to-br from-cream-50 via-cream-50 to-gold-50 p-8 md:p-14">
            <div
              aria-hidden
              className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-gold-500/15 blur-3xl"
            />
            <div className="relative grid items-center gap-10 md:grid-cols-12">
              <div className="md:col-span-7">
                <div className="flex items-center gap-3">
                  <Menorah className="h-7 w-7 text-gold-700" />
                  <p className="eyebrow">Para visitação</p>
                </div>
                <h2 className="display-xl mt-5 text-3xl text-ink-900 md:text-5xl">
                  Ligue para o
                  <br />
                  <span className="italic text-gold-shimmer">
                    Rabino Malachy Ben Israel
                  </span>
                </h2>
                <p className="mt-6 text-lg leading-relaxed text-ink-700">
                  A sinagoga não funciona em sistema de &ldquo;porta aberta&rdquo;
                  cada visita é combinada com antecedência. É assim para que
                  cada pessoa seja recebida com o cuidado que merece.
                </p>
                <div className="mt-8 flex flex-col gap-4 sm:flex-row">
                  <a
                    href="https://wa.me/554899231358?text=Shalom%20Rabino%20Malachy!%20Gostaria%20de%20conversar%20sobre%20visitar%20a%20sinagoga."
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group inline-flex items-center justify-center gap-3 rounded-full bg-ink-900 px-7 py-4 text-base font-semibold text-cream-50 shadow-[0_10px_30px_-8px_rgba(42,36,24,0.4)] transition-all hover:bg-gold-700"
                  >
                    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z" />
                    </svg>
                    Chamar no WhatsApp
                  </a>
                  <a
                    href="tel:+554899231358"
                    className="inline-flex items-center justify-center gap-2 rounded-full border border-ink-900/15 px-7 py-4 text-base font-semibold text-ink-900 transition-colors hover:border-gold-500 hover:text-gold-700"
                  >
                    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                    </svg>
                    +55 48 9923-1358
                  </a>
                </div>
              </div>

              <div className="md:col-span-5">
                <div className="rounded-2xl border border-gold-300 bg-cream-50 p-7">
                  <p className="eyebrow">Endereço</p>
                  <p className="mt-4 font-display text-2xl leading-snug text-ink-900 md:text-3xl">
                    R. Joaquim Nabuco, 140
                    <br />
                    Centro, Criciúma, SC
                    <br />
                    <span className="text-gold-700">88802-200</span>
                  </p>
                  <div className="mt-6 h-px divider-gold" />
                  <p className="mt-6 text-xs uppercase tracking-[0.32em] text-ink-500">
                    Horários
                  </p>
                  <ul className="mt-4 space-y-2 text-sm text-ink-700">
                    <li className="flex justify-between">
                      <span>Kabalat Shabat</span>
                      <span className="font-medium text-ink-900">sexta · 19:00</span>
                    </li>
                    <li className="flex justify-between">
                      <span>Shacharit</span>
                      <span className="font-medium text-ink-900">sábado · 9:00</span>
                    </li>
                    <li className="flex justify-between">
                      <span>Arvit/Havdalah</span>
                      <span className="font-medium text-ink-900">sábado · 17:55</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* MAP */}
      <section className="py-12">
        <div className="mx-auto max-w-7xl px-5 md:px-10">
          <div className="overflow-hidden rounded-3xl border border-gold-200 shadow-[0_20px_50px_-20px_rgba(168,132,47,0.3)]">
            <iframe
              src="https://www.google.com/maps?q=R.+Joaquim+Nabuco,+140+-+Centro,+Crici%C3%BAma+-+SC,+88802-200&output=embed"
              title="Localização da Sinagoga Anussim Brasil Criciúma"
              className="h-[420px] w-full md:h-[520px]"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>
      </section>

      {/* STREAMS */}
      <section className="bg-cream-50 py-20 md:py-28">
        <div className="mx-auto max-w-6xl px-5 md:px-10">
          <div className="mb-10 flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
            <div>
              <p className="eyebrow">Serviços ao vivo</p>
              <h2 className="display-xl mt-4 max-w-2xl text-4xl text-ink-900 md:text-5xl">
                Acompanhe de onde
                <br />
                <span className="italic text-gold-shimmer">você estiver.</span>
              </h2>
            </div>
            <a
              href="https://www.youtube.com/@anussimbrasilcriciuma5648/streams"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full border border-gold-300 px-5 py-3 text-sm font-semibold text-ink-900 transition-all hover:border-gold-500 hover:bg-gold-500"
            >
              <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4 text-gold-700">
                <path d="M23 7.3a3 3 0 0 0-2.1-2.1C19 4.7 12 4.7 12 4.7s-7 0-8.9.5A3 3 0 0 0 1 7.3 31 31 0 0 0 .5 12 31 31 0 0 0 1 16.7a3 3 0 0 0 2.1 2.1c1.9.5 8.9.5 8.9.5s7 0 8.9-.5a3 3 0 0 0 2.1-2.1A31 31 0 0 0 23.5 12 31 31 0 0 0 23 7.3zM9.8 15.5v-7l5.8 3.5-5.8 3.5z" />
              </svg>
              Abrir no YouTube
            </a>
          </div>
          <div className="relative aspect-video overflow-hidden rounded-3xl border border-gold-200 bg-ink-900 shadow-[0_30px_60px_-30px_rgba(168,132,47,0.4)]">
            <iframe
              src="https://www.youtube.com/embed/live_stream?channel=UCCdlGqSr1iLFvxQ3jKxE0gA"
              title="Anussim Brasil: Transmissão ao vivo"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              loading="lazy"
              className="absolute inset-0 h-full w-full"
            />
          </div>
        </div>
      </section>

      {/* SECONDARY CTAs */}
      <section className="py-20">
        <div className="mx-auto max-w-5xl px-5 md:px-10">
          <div className="text-center">
            <OrnametalDivider symbol="star" />
            <h2 className="display-xl mt-8 text-3xl text-ink-900 md:text-4xl">
              Mais formas de se
              <br />
              <span className="italic text-gold-shimmer">conectar.</span>
            </h2>
          </div>

          <div className="mt-12 grid gap-5 md:grid-cols-3">
            <a
              href="https://www.instagram.com/anussimbrasilcriciuma/"
              target="_blank"
              rel="noopener noreferrer"
              className="group rounded-2xl border border-gold-200 bg-cream-50 p-7 transition-all hover:-translate-y-1 hover:border-gold-500 hover:shadow-[0_20px_50px_-20px_rgba(168,132,47,0.4)]"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-7 w-7 text-gold-700">
                <rect x="3" y="3" width="18" height="18" rx="5" />
                <circle cx="12" cy="12" r="4" />
                <circle cx="17.5" cy="6.5" r="1" fill="currentColor" />
              </svg>
              <p className="mt-5 font-display text-2xl text-ink-900">Instagram</p>
              <p className="mt-1 text-sm text-ink-500">@anussimbrasilcriciuma</p>
              <p className="mt-5 text-sm text-ink-700">Fotos, vídeos do dia-a-dia, anúncios de Yom Tov.</p>
              <p className="mt-5 text-xs font-semibold text-gold-700 group-hover:underline">
                Seguir →
              </p>
            </a>

            <a
              href="https://www.youtube.com/channel/UCCdlGqSr1iLFvxQ3jKxE0gA"
              target="_blank"
              rel="noopener noreferrer"
              className="group rounded-2xl border border-gold-200 bg-cream-50 p-7 transition-all hover:-translate-y-1 hover:border-gold-500 hover:shadow-[0_20px_50px_-20px_rgba(168,132,47,0.4)]"
            >
              <svg viewBox="0 0 24 24" fill="currentColor" className="h-7 w-7 text-gold-700">
                <path d="M23 7.3a3 3 0 0 0-2.1-2.1C19 4.7 12 4.7 12 4.7s-7 0-8.9.5A3 3 0 0 0 1 7.3 31 31 0 0 0 .5 12 31 31 0 0 0 1 16.7a3 3 0 0 0 2.1 2.1c1.9.5 8.9.5 8.9.5s7 0 8.9-.5a3 3 0 0 0 2.1-2.1A31 31 0 0 0 23.5 12 31 31 0 0 0 23 7.3zM9.8 15.5v-7l5.8 3.5-5.8 3.5z" />
              </svg>
              <p className="mt-5 font-display text-2xl text-ink-900">YouTube</p>
              <p className="mt-1 text-sm text-ink-500">@anussimbrasilcriciuma5648</p>
              <p className="mt-5 text-sm text-ink-700">Serviços ao vivo, estudos, drashot e arquivos.</p>
              <p className="mt-5 text-xs font-semibold text-gold-700 group-hover:underline">
                Inscrever-se →
              </p>
            </a>

            <Link
              href="/pages/calendario"
              className="group rounded-2xl border border-gold-200 bg-cream-50 p-7 transition-all hover:-translate-y-1 hover:border-gold-500 hover:shadow-[0_20px_50px_-20px_rgba(168,132,47,0.4)]"
            >
              <StarOfDavid className="h-7 w-7 text-gold-700" />
              <p className="mt-5 font-display text-2xl text-ink-900">Calendário Judaico</p>
              <p className="mt-1 text-sm text-ink-500">Datas · Yom Tov · Zmanim</p>
              <p className="mt-5 text-sm text-ink-700">Parashá da semana, horários de oração e festas.</p>
              <p className="mt-5 text-xs font-semibold text-gold-700 group-hover:underline">
                Abrir →
              </p>
            </Link>
          </div>
        </div>
      </section>

      <SiteFooter />
    </main>
  )
}