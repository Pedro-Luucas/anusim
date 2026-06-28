import { SiteHeader } from "@/components/landing/site-header"
import { SiteFooter } from "@/components/landing/site-footer"
import { OrnametalDivider, ScrollSeal } from "@/components/landing/judaic-symbols"

export const metadata = {
  title: "Pontos de Fé — Anussim Brasil Criciúma",
  description:
    "Os treze princípios de fé de Maimonides (Rambam) — a base da crença judaica que a comunidade Anussim Brasil Criciúma professa.",
}

const PRINCIPLES = [
  {
    n: "01",
    body: "Nós acreditamos com fé completa que o Criador, bendito seja o Seu Nome, é o Criador e Guia de todas as coisas criadas, e que somente Ele fez, faz e fará todas as coisas.",
  },
  {
    n: "02",
    body: "Nós acreditamos com fé completa que o Criador, bendito seja o Seu Nome, é único, e não há unicidade como a Sua de forma alguma; e que somente Ele é o nosso D'us, que foi, é e sempre será.",
  },
  {
    n: "03",
    body: "Nós acreditamos com fé completa que o Criador, bendito seja o Seu Nome, não é corpóreo, e que está além de todo conceito corpóreo, e não há absolutamente nada comparável a Ele.",
  },
  {
    n: "04",
    body: "Nós acreditamos com fé completa que o Criador, bendito seja o Seu Nome, é o Primeiro e o Último.",
  },
  {
    n: "05",
    body: "Nós acreditamos com fé completa que o Criador, bendito seja o Seu Nome, é o único a Quem é adequado orar, e a nenhum ser além d'Ele é adequado orar.",
  },
  {
    n: "06",
    body: "Nós acreditamos com fé completa que todas as palavras dos profetas são verdadeiras.",
  },
  {
    n: "07",
    body: "Nós acreditamos com fé completa que a profecia do nosso mestre Moisés, que repouse em paz, era verdadeira, e que ele foi o pai de todos os profetas — tanto daqueles que o precederam quanto daqueles que o seguiram.",
  },
  {
    n: "08",
    body: "Nós acreditamos com fé completa que toda a Torá que temos em nosso poder é a mesma que foi dada ao nosso mestre Moisés, que repouse em paz.",
  },
  {
    n: "09",
    body: "Nós acreditamos com fé completa que esta Torá não será trocada, e que nenhuma Torá adicional será dada pelo Criador, bendito seja o Seu Nome.",
  },
  {
    n: "10",
    body: "Nós acreditamos com fé completa que o Criador, bendito seja o Seu Nome, conhece todas as ações dos homens e todos os seus pensamentos, como está dito: «Quem forma todos os seus corações como um, que compreende todas as suas obras.»",
  },
  {
    n: "11",
    body: "Nós acreditamos com fé completa que o Criador, bendito seja o Seu Nome, recompensa aqueles que guardam Seus mandamentos, e pune aqueles que transgridem Seus mandamentos.",
  },
  {
    n: "12",
    body: "Nós acreditamos com fé completa na vinda do Messias e, embora possa demorar, aguardamos todos os dias a sua vinda.",
  },
  {
    n: "13",
    body: "Nós acreditamos com fé completa que haverá ressurreição dos mortos no tempo que agradar ao Criador, bendito seja o Seu Nome, e o Seu Nome será exaltado para sempre e por toda a eternidade.",
  },
]

export default function PontosDeFePage() {
  return (
    <main className="bg-parchment text-ink-900">
      <SiteHeader />

      <section className="relative pt-32 pb-16 md:pt-44 md:pb-24">
        <div className="mx-auto max-w-5xl px-5 text-center md:px-10">
          <p className="eyebrow">Capítulo teológico</p>
          <h1 className="display-xl mt-6 text-5xl text-ink-900 md:text-7xl lg:text-8xl">
            Pontos de
            <br />
            <span className="italic text-gold-shimmer">fé.</span>
          </h1>
          <p className="mx-auto mt-8 max-w-2xl font-display text-xl italic leading-relaxed text-ink-700 md:text-2xl">
            Os treze princípios de Maimonides — o Rambam — formulados no século
            XII e recitados em todo o mundo judaico como fundamento da emuná.
          </p>
          <div className="mt-10">
            <OrnametalDivider symbol="scroll" />
          </div>
        </div>
      </section>

      <section className="pb-12">
        <div className="mx-auto max-w-3xl px-5 md:px-10">
          <div className="rounded-3xl border border-gold-200 bg-cream-50 p-8 text-center md:p-12">
            <ScrollSeal className="mx-auto h-14 w-14 text-gold-600" />
            <p
              className="mt-6 font-hebrew text-3xl leading-relaxed text-gold-700 md:text-4xl"
              dir="rtl"
            >
              אֲנַחְנוּ מַאֲמִינִים בֶּאֱמוּנָה שְׁלֵמָה
            </p>
            <p className="mt-4 font-display text-lg italic text-ink-700 md:text-xl">
              Nós acreditamos com fé completa
            </p>
            <p className="mt-6 text-sm leading-relaxed text-ink-500">
              Conhecidos como <em>Shlosh Esreh Ikkarim</em> (שְׁלֹשָׁה עֶשֶׂר
              עִקָּרִים), os treze princípios resumem o que todo judeu deve
              professar. Maimonides os expôs no comentário ao{" "}
              <span className="italic">Perek Chelek</span> do Talmude.
            </p>
          </div>
        </div>
      </section>

      <section className="relative pb-24 md:pb-32">
        <div className="mx-auto max-w-4xl px-5 md:px-10">
          <ol className="space-y-6">
            {PRINCIPLES.map((p) => (
              <li
                key={p.n}
                className="group rounded-2xl border border-gold-200/80 bg-cream-50 p-6 transition-colors hover:border-gold-300 md:p-8"
              >
                <div className="flex gap-5 md:gap-8">
                  <span
                    className="shrink-0 font-display text-3xl font-medium text-gold-500/70 md:text-4xl"
                    aria-hidden="true"
                  >
                    {p.n}
                  </span>
                  <p className="font-display text-lg leading-relaxed text-ink-900 md:text-xl">
                    {p.body}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="relative border-t border-gold-200/60 py-24 md:py-32">
        <div className="mx-auto max-w-3xl px-5 text-center md:px-10">
          <OrnametalDivider symbol="menorah" />
          <blockquote className="mt-10 font-display text-2xl italic leading-snug text-ink-900 md:text-3xl">
            &ldquo;Quando uma pessoa acredita em todos estes princípios e na
            crença de Moisés, nosso mestre, que repouse em paz, ela entra na
            comunidade de Israel.&rdquo;
          </blockquote>
          <p className="mt-6 text-xs uppercase tracking-[0.32em] text-gold-700">
            Maimonides · Rambam
          </p>
        </div>
      </section>

      <SiteFooter />
    </main>
  )
}
