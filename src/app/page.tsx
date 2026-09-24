import Image from "next/image"
import Link from "next/link"
import { SiteHeader } from "@/components/landing/site-header"
import { SiteFooter } from "@/components/landing/site-footer"
import { ShabbatSection } from "@/components/landing/shabbat-section"
import {
  OrnametalDivider,
  StarOfDavid,
  Menorah,
} from "@/components/landing/judaic-symbols"

const HERO_PHOTOS = [
  "/shulphotos/comunidade0.jpg",
  "/shulphotos/pessach0.jpg",
  "/shulphotos/rabino2.jpg",
  "/shulphotos/comunidade5.jpg",
]

export default function HomePage() {
  return (
    <main className="bg-parchment text-ink-900">
      <SiteHeader />

      {/* ─── HERO ─── */}
      <section className="relative overflow-hidden pt-32 pb-20 md:pt-40 md:pb-28">
        {/* soft gold glow behind */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 -z-0"
          style={{
            background:
              "radial-gradient(60% 50% at 50% 0%, rgba(201,162,83,0.18) 0%, rgba(250,246,239,0) 70%)",
          }}
        />
        {/* judaic pattern subtle */}
        <div className="pointer-events-none absolute inset-0 -z-0 opacity-[0.18] bg-judaic-pattern" />

        <div className="relative mx-auto grid max-w-7xl gap-14 px-5 md:grid-cols-12 md:gap-12 md:px-10">
          <div className="md:col-span-7 stagger">
            <div className="flex items-center gap-3">
              <span className="h-px w-10 bg-gold-500" />
              <span className="eyebrow">Sinagoga · Criciúma · SC</span>
            </div>

            <h1 className="display-xl mt-7 text-[2.85rem] sm:text-6xl md:text-7xl lg:text-[5.4rem] text-ink-900">
              A casa dos
              <br />
              <span className="italic text-gold-shimmer">Bnei Anusim</span>
              <br />
              no Sul do Brasil.
            </h1>

            <p className="mt-8 max-w-xl font-display text-xl leading-snug text-ink-700 md:text-2xl">
              Uma comunidade judaica aberta em Criciúma, Santa Catarina, sob a
              direção do Rabino{" "}
              <span className="font-medium text-gold-700">
                Malachy Ben Israel
              </span>
              . Shabat, festas, Torá — e a chama que voltou a arder em voz alta.
            </p>

            <div className="mt-10 flex flex-wrap items-center gap-4">
              <a
                href="https://wa.me/554899231358?text=Shalom!%20Gostaria%20de%20visitar%20a%20sinagoga."
                target="_blank"
                rel="noopener noreferrer"
                className="group relative inline-flex items-center gap-3 rounded-full bg-ink-900 px-7 py-4 text-sm font-semibold text-cream-50 shadow-[0_10px_30px_-8px_rgba(42,36,24,0.5)] transition-all hover:bg-gold-700"
              >
                <span className="absolute inset-0 -z-10 rounded-full bg-gold-500 opacity-0 blur-md transition-opacity group-hover:opacity-60" />
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z" />
                </svg>
                Agendar visita com o Rabino
              </a>

              <Link
                href="/bnei-anusim"
                className="group inline-flex items-center gap-2 text-sm font-medium text-ink-700 transition-colors hover:text-gold-700"
              >
                Quem somos
                <span className="inline-block transition-transform group-hover:translate-x-1">→</span>
              </Link>
            </div>

            {/* shabbat times teaser */}
            <div className="mt-14 flex max-w-xl items-center gap-5 rounded-2xl border border-gold-200 bg-cream-50/70 p-5 backdrop-blur-sm">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-gold-500/15">
                <Menorah className="h-7 w-7 text-gold-700" />
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.28em] text-ink-500">
                  Próximo Shabat
                </p>
                <p className="mt-1 font-display text-xl text-ink-900">
                  Serviços transmitidos ao vivo ·{" "}
                  <span className="text-gold-700">sexta 19h · sábado 9h</span>
                </p>
              </div>
            </div>
          </div>

          {/* Photo composition */}
          <div className="relative md:col-span-5">
            <div className="relative mx-auto aspect-[4/5] w-full max-w-md">
              {/* big photo */}
              <div className="absolute right-0 top-0 h-[78%] w-[78%] overflow-hidden rounded-[2rem] shadow-[0_30px_60px_-30px_rgba(168,132,47,0.4)]">
                <Image
                  src={HERO_PHOTOS[0]}
                  alt="Comunidade Anussim Brasil em oração"
                  fill
                  priority
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-ink-900/30 via-transparent to-transparent" />
              </div>
              {/* small overlapping photo */}
              <div className="absolute -bottom-2 left-0 h-[55%] w-[55%] overflow-hidden rounded-[2rem] border-4 border-cream-100 shadow-[0_30px_60px_-30px_rgba(168,132,47,0.5)]">
                <Image
                  src={HERO_PHOTOS[1]}
                  alt="Mesa de Pessach"
                  fill
                  className="object-cover"
                />
              </div>
              {/* star ornament */}
              <div className="absolute -right-4 -top-4 text-gold-500 animate-float">
                <StarOfDavid className="h-20 w-20 md:h-24 md:w-24" strokeWidth={0.8} />
              </div>
              {/* hebrew */}
              <div className="absolute -bottom-8 -right-4 md:-right-8 text-right">
                <p className="font-hebrew text-3xl md:text-4xl text-gold-700" dir="rtl">
                  שָׁלוֹם
                </p>
                <p className="mt-1 text-xs uppercase tracking-[0.32em] text-ink-500">
                  shalom
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── MARQUEE STAT / IDENTITY BAR ─── */}
      <section className="border-y border-gold-200/70 bg-cream-50">
        <div className="mx-auto grid max-w-7xl grid-cols-2 divide-x divide-gold-200/70 md:grid-cols-4">
          {[
            { n: "500+", l: "Anos de história silenciosa" },
            { n: "12+", l: "Famílias fundadoras em Criciúma" },
            { n: "R. Joaquim Nabuco, 140", l: "Centro · Criciúma · SC" },
            { n: "Ao vivo", l: "Serviços toda semana" },
          ].map((s) => (
            <div key={s.l} className="px-5 py-8 text-center md:py-10">
              <p className="font-display text-2xl font-medium text-gold-700 md:text-3xl">
                {s.n}
              </p>
              <p className="mt-1 text-xs uppercase tracking-[0.22em] text-ink-500">
                {s.l}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ─── SHABAT ─── */}
      <ShabbatSection />

      {/* ─── ESSÊNCIA — SOBRE EM 3 BLOCOS ─── */}
      <section className="relative py-24 md:py-32">
        <div className="mx-auto max-w-7xl px-5 md:px-10">
          <div className="text-center">
            <OrnametalDivider symbol="menorah" />
            <p className="eyebrow mt-7">O que nos define</p>
            <h2 className="display-xl mx-auto mt-4 max-w-3xl text-4xl text-ink-900 md:text-5xl lg:text-6xl">
              Três coisas que{" "}
              <span className="italic text-gold-shimmer">não negociamos.</span>
            </h2>
          </div>

          <div className="mt-20 grid gap-8 md:grid-cols-3">
            {[
              {
                title: "Shabat",
                he: "שַׁבָּת",
                body: "O dia do descanso completo. Da sexta ao entardecer até o sábado à noite, fechamos o ciclo do tempo — e voltamos a começar.",
              },
              {
                title: "Torá",
                he: "תּוֹרָה",
                body: "O estudo semanal da Parashá, a leitura em hebraico, o Talmud e os comentários. Aprender é lembrar.",
              },
              {
                title: "Comunidade",
                he: "קְהִלָּה",
                body: "Minian, festas, Pessach, casamentos, condolências. Ninguém caminha sozinho. Nunca.",
              },
            ].map((card) => (
              <article
                key={card.title}
                className="group relative overflow-hidden rounded-3xl border border-gold-200/70 bg-cream-50 p-8 transition-all duration-500 hover:-translate-y-1 hover:border-gold-500 hover:shadow-[0_30px_60px_-30px_rgba(168,132,47,0.4)]"
              >
                <p
                  className="font-hebrew text-5xl text-gold-500 transition-colors group-hover:text-gold-700"
                  dir="rtl"
                >
                  {card.he}
                </p>
                <h3 className="mt-6 font-display text-3xl font-medium text-ink-900">
                  {card.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-ink-700">
                  {card.body}
                </p>
                <div className="mt-8 h-px w-12 bg-gold-500 transition-all duration-500 group-hover:w-full" />
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ─── FAIXA DE FOTOS ─── */}
      <section className="relative overflow-hidden border-y border-gold-200/60 bg-cream-50 py-20 md:py-28">
        <div className="mx-auto max-w-7xl px-5 md:px-10">
          <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
            <div>
              <p className="eyebrow">Da nossa casa</p>
              <h2 className="display-xl mt-4 max-w-2xl text-4xl text-ink-900 md:text-5xl">
                Momentos que valem mais
                <br />
                que <span className="italic text-gold-shimmer">mil palavras</span>.
              </h2>
            </div>
            <Link
              href="/fotos"
              className="group inline-flex items-center gap-2 rounded-full border border-gold-300 px-6 py-3 text-sm font-semibold text-ink-900 transition-all hover:border-gold-500 hover:bg-gold-500"
            >
              Ver galeria completa
              <span className="transition-transform group-hover:translate-x-1">→</span>
            </Link>
          </div>

          <div className="mt-14 grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-5">
            {[
              "/shulphotos/comunidade1.jpg",
              "/shulphotos/pessach3.jpg",
              "/shulphotos/rabino4.jpg",
              "/shulphotos/comunidade7.jpg",
            ].map((src, i) => (
              <div
                key={src}
                className={`relative overflow-hidden rounded-2xl shadow-md transition-transform duration-700 hover:scale-[1.02] ${
                  i % 2 === 0 ? "aspect-[3/4]" : "aspect-[4/5] md:translate-y-6"
                }`}
              >
                <Image
                  src={src}
                  alt={`Foto da comunidade ${i + 1}`}
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-ink-900/20 to-transparent" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── CTA VISITAR ─── */}
      <section className="relative overflow-hidden py-24 md:py-36">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 -z-10"
          style={{
            background:
              "radial-gradient(60% 70% at 50% 50%, rgba(201,162,83,0.22) 0%, rgba(250,246,239,0) 70%)",
          }}
        />
        <div className="mx-auto max-w-5xl px-5 text-center md:px-10">
          <StarOfDavid className="mx-auto h-12 w-12 text-gold-500" />
          <h2 className="display-xl mt-8 text-4xl text-ink-900 md:text-6xl">
            A porta está{" "}
            <span className="italic text-gold-shimmer">aberta.</span>
          </h2>
          <p className="mx-auto mt-6 max-w-2xl font-display text-xl italic leading-relaxed text-ink-700">
            Se você quer visitar a sinagoga, participar de um Shabat, conhecer o
            minian ou apenas conversar — ligue para o Rabino Malachy. Cada
            visita é recebida com cuidado.
          </p>

          <div className="mt-12 flex flex-col items-center justify-center gap-5 sm:flex-row">
            <a
              href="https://wa.me/554899231358?text=Shalom%20Rabino%20Malachy!%20Gostaria%20de%20agendar%20uma%20visita%20à%20sinagoga."
              target="_blank"
              rel="noopener noreferrer"
              className="group relative inline-flex items-center gap-3 overflow-hidden rounded-full bg-gold-500 px-8 py-4 text-base font-semibold text-ink-900 shadow-[0_10px_30px_-8px_rgba(201,162,83,0.7)] transition-all hover:scale-[1.02]"
            >
              <span className="absolute inset-0 -z-10 bg-gradient-to-r from-gold-400 via-gold-500 to-gold-600 opacity-0 transition-opacity group-hover:opacity-100" />
              <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z" />
              </svg>
              Chamar o Rabino no WhatsApp
            </a>
            <a
              href="tel:+554899231358"
              className="group inline-flex items-center gap-2 rounded-full border border-ink-900/15 px-8 py-4 text-base font-semibold text-ink-900 transition-all hover:border-gold-500 hover:text-gold-700"
            >
              +55 48 9923-1358
            </a>
          </div>

          <p className="mt-10 text-xs uppercase tracking-[0.32em] text-ink-500">
            R. Joaquim Nabuco, 140 · Centro · Criciúma · SC
          </p>
        </div>
      </section>

      {/* ─── STREAMS / SERVIÇOS ─── */}
      <section className="bg-cream-50 py-24 md:py-32">
        <div className="mx-auto max-w-7xl px-5 md:px-10">
          <div className="grid gap-12 md:grid-cols-12 md:items-center">
            <div className="md:col-span-5">
              <p className="eyebrow">Transmissão ao vivo</p>
              <h2 className="display-xl mt-4 text-4xl text-ink-900 md:text-5xl">
                Serviços em
                <br />
                <span className="italic text-gold-shimmer">toda parte.</span>
              </h2>
              <p className="mt-6 text-base leading-relaxed text-ink-700 md:text-lg">
                Mesmo quando você não pode estar fisicamente em Criciúma, a
                sinagoga está com você. Transmitimos Kabalat Shabat, Shacharit
                e as festas pelo nosso canal no YouTube.
              </p>
              <a
                href="https://www.youtube.com/@anussimbrasilcriciuma5648/streams"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-8 inline-flex items-center gap-3 rounded-full bg-ink-900 px-6 py-3 text-sm font-semibold text-cream-50 transition-colors hover:bg-gold-700"
              >
                <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4">
                  <path d="M23 7.3a3 3 0 0 0-2.1-2.1C19 4.7 12 4.7 12 4.7s-7 0-8.9.5A3 3 0 0 0 1 7.3 31 31 0 0 0 .5 12 31 31 0 0 0 1 16.7a3 3 0 0 0 2.1 2.1c1.9.5 8.9.5 8.9.5s7 0 8.9-.5a3 3 0 0 0 2.1-2.1A31 31 0 0 0 23.5 12 31 31 0 0 0 23 7.3zM9.8 15.5v-7l5.8 3.5-5.8 3.5z" />
                </svg>
                Acessar streams
              </a>
            </div>

            <div className="md:col-span-7">
              <div className="relative aspect-video overflow-hidden rounded-3xl border border-gold-200 shadow-[0_30px_60px_-30px_rgba(168,132,47,0.4)]">
                <iframe
                  src="https://www.youtube.com/embed/live_stream?channel=UCCdlGqSr1iLFvxQ3jKxE0gA"
                  title="Anussim Brasil — Transmissão ao vivo"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="absolute inset-0 h-full w-full"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      <SiteFooter />
    </main>
  )
}