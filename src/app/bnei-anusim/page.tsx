import Image from "next/image"
import Link from "next/link"
import { SiteHeader } from "@/components/landing/site-header"
import { SiteFooter } from "@/components/landing/site-footer"
import { OrnametalDivider, StarOfDavid } from "@/components/landing/judaic-symbols"

export const metadata = {
  title: "O que são os Bnei Anusim — Anussim Brasil Criciúma",
  description:
    "A história dos Bnei Anusim: os cripto-judeus que sobreviveram à Inquisição preservando a fé em segredo por séculos.",
}

export default function BneiAnusimPage() {
  return (
    <main className="bg-parchment text-ink-900">
      <SiteHeader />

      {/* ─── HEADER ─── */}
      <section className="relative pt-32 pb-12 md:pt-44 md:pb-20">
        <div className="mx-auto max-w-4xl px-5 text-center md:px-10">
          <p className="eyebrow">Capítulo 01 · Nossa origem</p>
          <h1 className="display-xl mt-6 text-5xl text-ink-900 md:text-7xl lg:text-8xl">
            O que são os
            <br />
            <span className="italic text-gold-shimmer">Bnei Anusim?</span>
          </h1>
          <p className="mx-auto mt-8 max-w-2xl font-display text-xl italic leading-relaxed text-ink-700 md:text-2xl">
            São os filhos dos que foram forçados — <em>anusim</em>, em hebraico,
            significa literalmente &ldquo;os coagidos&rdquo;. É a história de uma fé
            que sobreviveu em silêncio durante cinco séculos.
          </p>
          <div className="mt-10 flex items-center justify-center gap-4 text-gold-500">
            <span className="h-px w-16 bg-gold-500" />
            <StarOfDavid className="h-5 w-5" strokeWidth={1.5} />
            <span className="h-px w-16 bg-gold-500" />
          </div>
        </div>
      </section>

      {/* ─── LEAD: definição + imagem ─── */}
      <section className="relative pb-20 md:pb-28">
        <div className="mx-auto max-w-3xl px-5 md:px-0">
          <p className="font-display text-2xl leading-snug text-ink-900 md:text-3xl">
            <span className="float-left mr-3 mt-2 font-display text-7xl font-medium leading-none text-gold-500 md:text-8xl">
              A
            </span>
            palavra <em>anusim</em> vem da raiz hebraica de <em>ones</em>{" "}
            (אונס) — coação. A própria Torá já distingue entre quem peca por
            vontade própria e quem age sob coação: é do episódio da jovem
            forçada, em{" "}
            <span className="italic text-gold-700">Deuteronômio 22:25–27</span>,
            que a tradição rabínica deriva o princípio de que o coagido é
            isento. Séculos depois, os grandes comentaristas medievais aplicaram
            esse conceito àqueles que, sob ameaça de morte, foram obrigados a
            renunciar publicamente à sua fé judaica, mantendo-a em segredo.
          </p>

          <p className="mt-10 font-display text-2xl leading-snug text-ink-900 md:text-3xl">
            Os <strong className="font-medium">Bnei Anusim</strong> — literalmente,
            &ldquo;filhos dos coagidos&rdquo; — são os descendentes desses judeus.
            Não são conversos, porque nunca escolheram converter-se. Não são
            assimilados, porque em algum lugar — numa prataria de Pessach
            escondida no fundo de um armário, na recitação de{" "}
            <em>Shemá Israel</em> sussurrada no travesseiro, na luz de uma vela
            apagada antes do Shabbat — a fé continuou sendo passada.
          </p>
        </div>
      </section>

      {/* ─── FULL BLEED PHOTO + CAPTION ─── */}
      <section className="relative my-20 md:my-28">
        <div className="relative h-[50vh] min-h-[420px] w-full md:h-[70vh]">
          <Image
            src="/shulphotos/pessach5.jpg"
            alt="Mesa de Pessach preparada na comunidade"
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-ink-900/60 via-ink-900/10 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 mx-auto max-w-5xl px-5 pb-10 md:px-10 md:pb-16">
            <p className="font-display text-2xl italic leading-snug text-cream-50 md:text-4xl">
              &ldquo;Eles nos tiraram a sinagoga, mas não tiraram a mesa de
              Pessach. E uma mesa é uma sinagoga onde o judeu se senta à
              cabeceira, mesmo quando ninguém está olhando.&rdquo;
            </p>
            <p className="mt-4 text-xs uppercase tracking-[0.32em] text-gold-200">
              Sobre as famílias que guardaram a fé em segredo
            </p>
          </div>
        </div>
      </section>

      {/* ─── HISTÓRIA EM COLUNAS ─── */}
      <section className="py-20 md:py-28">
        <div className="mx-auto max-w-5xl px-5 md:px-10">
          <div className="grid gap-16 md:grid-cols-12">
            <aside className="md:col-span-4">
              <div className="sticky top-32">
                <OrnametalDivider symbol="scroll" />
                <p className="eyebrow mt-7">Linha do tempo</p>
                <h2 className="display-xl mt-4 text-4xl text-ink-900">
                  Cinco séculos de
                  <br />
                  <span className="italic text-gold-shimmer">silêncio.</span>
                </h2>
              </div>
            </aside>

            <div className="md:col-span-8">
              <Timeline />
            </div>
          </div>
        </div>
      </section>

      {/* ─── DIÁSPORA PORTUGUESA / BRASILEIRA ─── */}
      <section className="border-y border-gold-200/60 bg-cream-50 py-24 md:py-32">
        <div className="mx-auto grid max-w-6xl gap-14 px-5 md:grid-cols-12 md:gap-16 md:px-10">
          <div className="md:col-span-5">
            <p className="eyebrow">Capítulo 02 · A diáspora ibérica</p>
            <h2 className="display-xl mt-4 text-4xl text-ink-900 md:text-5xl">
              De Portugal e Espanha
              <br />
              para o <span className="italic text-gold-shimmer">Brasil.</span>
            </h2>
            <div className="mt-8 space-y-5 text-base leading-relaxed text-ink-700">
              <p>
                Quando os Reis Católicos assinaram o{" "}
                <strong className="font-medium text-ink-900">
                  Edito de Expulsão de 1492
                </strong>{" "}
                na Espanha, e quando Portugal estabeleceu a Inquisição em 1536,
                dezenas de milhares de judeus se viram diante de uma escolha:
                converter-se, fugir ou morrer.
              </p>
              <p>
                Muitos fugiram para o Norte da África, para a Holanda, para a
                Itália, para o Império Otomano. Outros — talvez a maioria —
                ficaram. Tornaram-se <em>cristãos-novos</em>. Continuaram sendo
                judeus por dentro.
              </p>
              <p>
                Quando o Brasil colonial recebeu levas de portugueses, trouxe
                consigo muitos desses cristãos-novos. O Nordeste — de Recife a
                Salvador — e o interior de Minas Gerais se tornaram refúgio
                silencioso. Aqui, longe dos olhos da Inquisição, eles puderam
                manter — em segredo, à noite, em voz baixa — as velas de
                Shabbat, o jejum de Iom Kipur, a matsá de Pessach.
              </p>
            </div>
          </div>

          <div className="md:col-span-7">
            <div className="grid gap-5 sm:grid-cols-2">
              {[
                {
                  title: "Belmonte",
                  state: "Portugal · retorno em 1996",
                  body: "A mais célebre comunidade cripto-judaica a sobreviver à Inquisição. Reconhecida oficialmente em 1989, inaugurou sua sinagoga, a Bet Eliahu, em 1996.",
                },
                {
                  title: "Recife",
                  state: "Pernambuco · 1630–1654",
                  body: "No Brasil holandês ergueu-se a Kahal Zur Israel, a primeira sinagoga das Américas, onde se podia orar abertamente. Com o retorno dos portugueses em 1654, voltou o segredo.",
                },
                {
                  title: "Salvador",
                  state: "Bahia · séculos XVI–XVII",
                  body: "Primeira capital da colônia e principal alvo das visitações do Santo Ofício (1591 e 1618). Cristãos-novos da lavoura açucareira foram denunciados por judaizar.",
                },
                {
                  title: "Criciúma",
                  state: "Santa Catarina · hoje",
                  body: "Onde nossa comunidade Anussim Brasil recebe, estuda e celebra abertamente o que foi escondido por séculos.",
                },
              ].map((c) => (
                <article
                  key={c.title}
                  className="rounded-2xl border border-gold-200 bg-cream-50 p-6 transition-all hover:border-gold-500 hover:shadow-md"
                >
                  <h3 className="font-display text-2xl text-ink-900">{c.title}</h3>
                  <p className="mt-1 text-xs uppercase tracking-[0.24em] text-gold-700">
                    {c.state}
                  </p>
                  <p className="mt-4 text-sm leading-relaxed text-ink-700">
                    {c.body}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ─── RETORNO ─── */}
      <section className="py-24 md:py-32">
        <div className="mx-auto max-w-3xl px-5 md:px-0">
          <div className="text-center">
            <OrnametalDivider symbol="pomegranate" />
            <p className="eyebrow mt-7">Capítulo 03</p>
            <h2 className="display-xl mt-4 text-4xl text-ink-900 md:text-6xl">
              O <span className="italic text-gold-shimmer">retorno</span>.
            </h2>
          </div>

          <div className="mt-14 space-y-7 text-lg leading-relaxed text-ink-700">
            <p>
              No final do século XX, e especialmente a partir dos anos 2000, algo
              extraordinário começou a acontecer no Brasil, em Portugal, no
              México, no sudoeste dos Estados Unidos: comunidades inteiras de
              descendentes de cristãos-novos começaram a voltar{" "}
              <em>publicamente</em> à fé de seus avós.
            </p>
            <p>
              Não foi um movimento único, centralizado. Foi uma{" "}
              <strong className="font-medium text-ink-900">maré de memórias</strong>{" "}
              — avós que revelaram segredos guardados por toda uma vida, mesas
              de Pessach que voltaram a aparecer em casas onde ninguém sabia
              explicar por que se limpava a casa de fermento todo ano, rituais
              de acendimento de velas que de repente ganharam nome e sentido.
            </p>
            <p>
              Hoje, no Brasil, dezenas de comunidades Bnei Anusim existem em
              diferentes estágios de retorno. Algumas já têm sinagoga
              estabelecida; outras se reúnem em salas, garagens ou casas.
              Todas compartilham algo: a consciência de que a fé que
              carregaram em silêncio por quinhentos anos não é uma herança
              arqueológica — é uma chama viva, e que a chama merece arder
              abertamente.
            </p>

            <blockquote className="my-12 border-l-4 border-gold-500 pl-8">
              <p className="font-display text-2xl italic leading-snug text-ink-900 md:text-3xl">
                &ldquo;Não somos convertidos. Somos judeus que voltaram. A
                diferença é tudo.&rdquo;
              </p>
              <footer className="mt-3 text-xs uppercase tracking-[0.32em] text-ink-500">
                Comunidade Bnei Anusim Brasil
              </footer>
            </blockquote>

            <p>
              Em Criciúma, no Sul do Brasil, a comunidade Anussim Brasil nasceu
              exatamente dessa constatação. Sob a orientação do Rabino{" "}
              <strong className="font-medium text-ink-900">
                Malachy Ben Israel
              </strong>
              , abrimos uma casa onde o que era sussurrado agora é cantado, onde
              o que era escondido agora é celebrado, e onde cada novo membro
              encontra o espaço para se reconectar com a tradição de seus
              antepassados — no seu próprio ritmo, com respeito, com rigor, com
              alegria.
            </p>
          </div>
        </div>
      </section>

      {/* ─── CTA ─── */}
      <section className="relative overflow-hidden py-24">
        <div className="mx-auto max-w-4xl px-5 text-center md:px-10">
          <StarOfDavid className="mx-auto h-12 w-12 text-gold-500" />
          <h2 className="display-xl mt-7 text-4xl text-ink-900 md:text-5xl">
            Se você é Bnei Anusim,
            <br />
            <span className="italic text-gold-shimmer">a porta é sua.</span>
          </h2>
          <p className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-ink-700">
            Se essa história ressoa em você — se algum ritual da sua avó, alguma
            tradição da sua família, alguma memória inexplicada da infância
            faz sentido agora — fale com o Rabino Malachy. Você não precisa
            vir com respostas. Só precisa vir.
          </p>
          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <a
              href="https://wa.me/554899231358"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full bg-ink-900 px-7 py-4 text-sm font-semibold text-cream-50 transition-colors hover:bg-gold-700"
            >
              Falar com o Rabino
            </a>
            <Link
              href="/contato"
              className="inline-flex items-center gap-2 rounded-full border border-ink-900/15 px-7 py-4 text-sm font-semibold text-ink-900 transition-colors hover:border-gold-500 hover:text-gold-700"
            >
              Informações de visita
            </Link>
          </div>
        </div>
      </section>

      <SiteFooter />
    </main>
  )
}

function Timeline() {
  const items = [
    {
      year: "1492",
      title: "Edito de Expulsão",
      body:
        "Em 31 de março, os Reis Católicos da Espanha assinam o decreto que obriga todos os judeus a deixar o país ou se converter. A diáspora sefaradi começa.",
    },
    {
      year: "1496–1497",
      title: "Portugal força a conversão",
      body:
        "D. Manuel I ordena o batismo em massa de judeus portugueses. Muitos fogem; muitos ficam e se tornam cristãos-novos. As famílias se dividem.",
    },
    {
      year: "1536",
      title: "Inquisição portuguesa",
      body:
        "O Tribunal do Santo Ofício é instalado em Portugal. As cripto-práticas judaicas passam a ser perseguidas como heresia.",
    },
    {
      year: "séc. XVI–XVIII",
      title: "Brasil-colônia: refúgio e vigilância",
      body:
        "Cristãos-novos chegam ao Brasil, sobretudo ao Nordeste, e praticam a fé em segredo: velas na sexta-feira, jejum de Iom Kipur, matsá na Pessach. A Inquisição nunca teve tribunal aqui, mas enviou visitações (a primeira em 1591) e julgava os acusados em Lisboa.",
    },
    {
      year: "1773",
      title: "Pombal abole a distinção",
      body:
        "O Marquês de Pombal extingue por lei a distinção entre cristãos-novos e cristãos-velhos e proíbe até o uso do termo. A perseguição legal aos conversos chega ao fim.",
    },
    {
      year: "1821",
      title: "Fim da Inquisição em Portugal",
      body:
        "O tribunal é extinto. Mas o medo e o segredo já passaram a fazer parte da identidade familiar — são passados adiante.",
    },
    {
      year: "séc. XX",
      title: "Memórias que começam a voltar",
      body:
        "Sobretudo a partir dos anos 1970, com a abertura política e o contato com comunidades judaicas estabelecidas, descendentes começam a buscar a fé abertamente.",
    },
    {
      year: "1989–1996",
      title: "Belmonte (Portugal)",
      body:
        "A comunidade cripto-judaica de Belmonte, que guardou a fé em segredo por quase 500 anos, é reconhecida oficialmente (1989) e inaugura a sinagoga Bet Eliahu (1996). Tornou-se o símbolo mais célebre do retorno dos Bnei Anusim.",
    },
    {
      year: "hoje",
      title: "Criciúma",
      body:
        "A Anussim Brasil Criciúma, sob o Rabino Malachy Ben Israel, é uma das casas onde essa história continua sendo escrita — abertamente.",
    },
  ]
  return (
    <ol className="relative space-y-10 border-l-2 border-gold-300/60 pl-8">
      {items.map((item) => (
        <li key={item.year} className="relative">
          <span className="absolute -left-[37px] top-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-cream-100 ring-2 ring-gold-500">
            <span className="h-2 w-2 rounded-full bg-gold-500" />
          </span>
          <p className="text-xs uppercase tracking-[0.28em] text-gold-700">
            {item.year}
          </p>
          <h3 className="mt-2 font-display text-2xl font-medium text-ink-900 md:text-3xl">
            {item.title}
          </h3>
          <p className="mt-3 text-base leading-relaxed text-ink-700">
            {item.body}
          </p>
        </li>
      ))}
    </ol>
  )
}