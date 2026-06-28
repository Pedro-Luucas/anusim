import { SiteHeader } from "@/components/landing/site-header"
import { SiteFooter } from "@/components/landing/site-footer"
import {
  OrnametalDivider,
  StarOfDavid,
  Menorah,
  Pomegranate,
  Shofar,
  ScrollSeal,
} from "@/components/landing/judaic-symbols"

export const metadata = {
  title: "Pontos de Fé — Anussim Brasil Criciúma",
  description:
    "O que acreditamos e praticamos na comunidade: Shabat, Kashrut, Festas, Torá, Halachá e estudo.",
}

const PILLARS = [
  {
    n: "01",
    he: "שַׁבָּת",
    title: "Shabat",
    body: "O sétimo dia. Do pôr-do-sol de sexta ao entardecer de sábado, abstemo-nos do trabalho criativo. Acendemos velas, abençoamos o vinho e o pão, jantamos juntos, estudamos, descansamos. Shabat é o protótipo da eternidade — uma pausa sagrada no meio do tempo.",
    detail: [
      "Kabalat Shabat · sexta às 19h",
      "Shacharit · sábado às 9h",
      "Musaf e seudá shlishit",
    ],
    icon: Menorah,
  },
  {
    n: "02",
    he: "כַּשְׁרוּת",
    title: "Kashrut",
    body: "As leis alimentares da Torá. Separamos carne de leite, abençoamos o animal, recusamos o porco, o marisco e o sangue. Comer kasher é comer com consciência — cada refeição lembra que há uma ordem por trás do mundo.",
    detail: [
      "Bicharut observada em eventos da sinagoga",
      "Orientações para cozinhas de visitantes",
      "Conversas regulares sobre prática",
    ],
    icon: Pomegranate,
  },
  {
    n: "03",
    he: "חַגִּים",
    title: "As Festas",
    body: "Rosh Hashaná, Iom Kipur, Sucot, Shemini Atséret, Chanucá, Purim, Pessach, Shavuot, além das chamadas Yom Tov. O calendário judaico é a respiração da comunidade — cada festa traz uma memória e um ensinamento.",
    detail: [
      "Sedárim coletivas na sinagoga",
      "Leitura da Hagadá em Pessach",
      "Megilat Ester em Purim",
    ],
    icon: StarOfDavid,
  },
  {
    n: "04",
    he: "תּוֹרָה",
    title: "Torá",
    body: "Os cinco livros de Moisés. Cada semana, uma Parashá. Cada sete anos, um Shemitá. A Torá é lida publicamente, em hebraico, com cantilação. Os comentários — Rashi, Ramban, Ibn Ezra, e o Talmude — formam uma conversa de milênios.",
    detail: [
      "Estudo semanal da Parashá",
      "Clássicos do pensamento judaico",
      "Hebraico básico para membros",
    ],
    icon: ScrollSeal,
  },
  {
    n: "05",
    he: "הֲלָכָה",
    title: "Halachá",
    body: "A lei judaica — o caminho de como viver a fé no detalhe de cada dia. A Halachá não é estática: é a soma das decisões rabínicas, debates talmúdicos e costumes locais. Sob orientação do Rabino Malachy, cada membro encontra um caminho honesto e possível.",
    detail: [
      "Acompanhamento rabínico individual",
      "Conversas sobre prática pessoal",
      "Respeito ao ritmo de cada um",
    ],
    icon: Shofar,
  },
  {
    n: "06",
    he: "תְּפִילָּה",
    title: "Tefilá e Minian",
    body: "A oração é coletiva por excelência. Quando dez judeus — ou Bnei Anusim — se reúnem, a Presença Divina descansa entre eles. Shacharit pela manhã, Minchá à tarde, Maariv à noite. A sinagoga existe porque o minian existe.",
    detail: [
      "Minian diário na sinagoga",
      "Tish em Iom Tov e Shabat",
      "Birkat Hamazon comunitário",
    ],
    icon: StarOfDavid,
  },
]

export default function PontosDeFePage() {
  return (
    <main className="bg-parchment text-ink-900">
      <SiteHeader />

      {/* HEADER */}
      <section className="relative pt-32 pb-16 md:pt-44 md:pb-24">
        <div className="mx-auto max-w-5xl px-5 text-center md:px-10">
          <p className="eyebrow">Capítulo teológico</p>
          <h1 className="display-xl mt-6 text-5xl text-ink-900 md:text-7xl lg:text-8xl">
            Pontos de
            <br />
            <span className="italic text-gold-shimmer">fé.</span>
          </h1>
          <p className="mx-auto mt-8 max-w-2xl font-display text-xl italic leading-relaxed text-ink-700 md:text-2xl">
            O que acreditamos, o que praticamos, e o que oferecemos a quem
            chega. Uma fé vivida, não decorada.
          </p>
          <div className="mt-10">
            <OrnametalDivider symbol="menorah" />
          </div>
        </div>
      </section>

      {/* PRINCIPLES */}
      <section className="pb-20">
        <div className="mx-auto max-w-6xl px-5 md:px-10">
          <div className="rounded-3xl border border-gold-200 bg-cream-50 p-8 md:p-14">
            <div className="grid gap-12 md:grid-cols-3">
              {[
                {
                  he: "אֱמוּנָה",
                  pt: "Emuná",
                  label: "Fé",
                  body: "Acreditamos em um único D'us, criador e redentor, que se revela na Torá e na história do povo judeu.",
                },
                {
                  he: "תּוֹרָה",
                  pt: "Torá",
                  label: "Estudo",
                  body: "O estudo da Torá escrita e oral é o trabalho contínuo de cada judeu e de cada Bnei Anusim.",
                },
                {
                  he: "מִצְוָה",
                  pt: "Mitsvot",
                  label: "Prática",
                  body: "613 mandamentos guiam a vida cotidiana — do Shabat ao modo como tratamos o próximo.",
                },
              ].map((p) => (
                <div key={p.pt}>
                  <p className="font-hebrew text-4xl text-gold-600" dir="rtl">
                    {p.he}
                  </p>
                  <p className="mt-2 text-xs uppercase tracking-[0.32em] text-gold-700">
                    {p.pt} · {p.label}
                  </p>
                  <p className="mt-4 font-display text-xl leading-snug text-ink-900">
                    {p.body}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* PILLARS */}
      <section className="relative py-16">
        <div className="mx-auto max-w-6xl px-5 md:px-10">
          <div className="space-y-12">
            {PILLARS.map((p, i) => {
              const Icon = p.icon
              const isEven = i % 2 === 0
              return (
                <article
                  key={p.title}
                  className={`grid items-center gap-10 md:grid-cols-12 ${
                    isEven ? "" : "md:[direction:rtl]"
                  }`}
                >
                  {/* Hebrew panel */}
                  <div className={`md:col-span-4 ${isEven ? "" : "md:[direction:ltr]"}`}>
                    <div className="relative rounded-3xl border border-gold-200 bg-cream-50 p-10 text-center">
                      <p
                        className="absolute right-6 top-6 font-hebrew text-base text-gold-500/60"
                        dir="rtl"
                      >
                        {p.n}
                      </p>
                      <Icon className="mx-auto h-16 w-16 text-gold-600" />
                      <p
                        className="mt-6 font-hebrew text-5xl text-gold-700"
                        dir="rtl"
                      >
                        {p.he}
                      </p>
                      <p className="mt-3 font-display text-3xl text-ink-900">
                        {p.title}
                      </p>
                    </div>
                  </div>

                  {/* Body */}
                  <div className={`md:col-span-8 ${isEven ? "" : "md:[direction:ltr]"}`}>
                    <p className="eyebrow">Prática {p.n}</p>
                    <p className="mt-5 font-display text-2xl leading-snug text-ink-900 md:text-3xl">
                      {p.body}
                    </p>
                    <ul className="mt-7 space-y-2 border-l-2 border-gold-300 pl-6">
                      {p.detail.map((d) => (
                        <li
                          key={d}
                          className="text-sm leading-relaxed text-ink-700"
                        >
                          {d}
                        </li>
                      ))}
                    </ul>
                  </div>
                </article>
              )
            })}
          </div>
        </div>
      </section>

      {/* QUOTE CLOSING */}
      <section className="relative py-24 md:py-32">
        <div className="mx-auto max-w-3xl px-5 text-center md:px-10">
          <OrnametalDivider symbol="pomegranate" />
          <blockquote className="mt-10 font-display text-3xl italic leading-snug text-ink-900 md:text-4xl">
            &ldquo;A fé não é um peso. É uma estrutura. Quando você entra
            nela, descobre que sempre esteve lá — só faltava o nome, e a
            companhia.&rdquo;
          </blockquote>
          <p className="mt-6 text-xs uppercase tracking-[0.32em] text-gold-700">
            Rabino Malachy Ben Israel
          </p>
        </div>
      </section>

      <SiteFooter />
    </main>
  )
}