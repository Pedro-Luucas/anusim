"use client"

import { SiteHeader } from "@/components/landing/site-header"
import { SiteFooter } from "@/components/landing/site-footer"

const IS_DRAFT = true

const FAQS = [
  {
    question: "O que são Bnei Anusim?",
    answer:
      'Bnei Anusim (בני אנוסים), em hebraico "filhos dos forçados", são descendentes de judeus que foram obrigados a converter-se ao cristianismo durante a Inquisição na Península Ibérica (séculos XV-XVIII). Muitos mantiveram práticas judaicas em segredo por gerações. A comunidade Anussim Brasil em Criciúma acolhe descendentes que desejam reconectar-se com suas raízes judaicas.',
  },
  {
    question: "Posso visitar a sinagoga mesmo sem ser judeu?",
    answer:
      "Sim! A sinagoga está aberta a visitantes de todas as origens. Recomendamos entrar em contato com o Rabino Malachy pelo WhatsApp antes da sua primeira visita para confirmar horários e receber orientações sobre como participar dos serviços.",
  },
  {
    question: "Como entro em contato com o Rabino Malachy?",
    answer:
      'O WhatsApp é o canal oficial para agendar visitas e tirar dúvidas: +55 48 9923-1358. Ao enviar mensagem, comece com "Shalom Rabino Malachy!" seguido da sua pergunta ou solicitação.',
  },
  {
    question: "Quais são os horários dos serviços?",
    answer:
      "Kabalat Shabat (recepção do Shabat) acontece às sextas-feiras às 19h. Shacharit (oração matinal) de Shabat é aos sábados às 9h. Outros horários e eventos especiais são divulgados pelo YouTube e WhatsApp da comunidade. Consulte a página de Agenda para mais detalhes.",
  },
  {
    question: "Como começo a estudar sobre judaísmo?",
    answer:
      "A melhor forma de começar é participar dos serviços e conversar com o Rabino Malachy. Ele pode orientar sobre materiais de estudo, a parashá da semana e responder dúvidas sobre práticas e tradições. As transmissões ao vivo no YouTube também são um ótimo recurso para acompanhar os ensinamentos.",
  },
  {
    question: "Estou descobrindo que tenho raízes judaicas. O que faço?",
    answer:
      "Se você descobriu raízes judaicas na sua família (sobrenomes ibéricos, práticas incomuns, histórias familiares), entre em contato com o Rabino Malachy. Ele pode orientar sobre o processo de reconexão com a identidade judaica, estudos necessários e próximos passos. Cada caso é único e requer orientação personalizada.",
  },
  {
    question: "É preciso pagar para frequentar a sinagoga?",
    answer:
      "Não. Os serviços são abertos e gratuitos. A sinagoga é mantida por doações voluntárias dos membros da comunidade. Se desejar contribuir, consulte a página de Doações.",
  },
  {
    question: "Vocês fazem conversões ao judaísmo?",
    answer:
      "Questões sobre conversão (giyur) e processos de retorno devem ser discutidas diretamente com o Rabino Malachy. Cada situação é avaliada individualmente de acordo com a Halachá (lei judaica) e as circunstâncias pessoais.",
  },
]

export default function PerguntasFrequentesPage() {
  return (
    <>
      <SiteHeader />
      <main className="min-h-screen bg-cream-100 pt-24 pb-16">
        <div className="mx-auto max-w-4xl px-5 md:px-10">
          {IS_DRAFT && (
            <div className="mb-8 rounded-2xl border-2 border-gold-500 bg-gold-50 p-6 md:p-8">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0">
                  <svg className="h-8 w-8 text-gold-700" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-gold-900">
                    Rascunho aguardando revisão
                  </h2>
                  <p className="mt-2 text-sm leading-relaxed text-gold-800">
                    Esta página está em fase de rascunho e aguarda revisão e aprovação
                    do <strong>Rabino Malachy Ben Israel</strong>. As informações podem
                    estar incompletas ou imprecisas. Para dúvidas, entre em contato
                    diretamente pelo WhatsApp.
                  </p>
                </div>
              </div>
            </div>
          )}

          <div className="text-center">
            <p className="eyebrow text-gold-700">Dúvidas frequentes</p>
            <h1 className="mt-3 font-display text-4xl md:text-5xl font-semibold text-ink-900">
              Perguntas Frequentes
            </h1>
            <p className="mt-4 text-lg text-ink-600 max-w-2xl mx-auto">
              Respostas sobre a comunidade Anussim Brasil, serviços, horários e como
              começar sua jornada de reconexão com o judaísmo.
            </p>
          </div>

          <div className="mt-12 space-y-6">
            {FAQS.map((faq, index) => (
              <details
                key={index}
                className="group rounded-2xl border border-gold-200 bg-cream-50 overflow-hidden"
              >
                <summary className="flex cursor-pointer items-center justify-between p-6 font-semibold text-ink-900 transition-colors hover:bg-gold-50 list-none">
                  <span className="text-lg pr-4">{faq.question}</span>
                  <svg
                    className="h-6 w-6 flex-shrink-0 text-gold-600 transition-transform group-open:rotate-180"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                </summary>
                <div className="border-t border-gold-100 bg-white px-6 py-5">
                  <p className="text-sm leading-relaxed text-ink-700">{faq.answer}</p>
                </div>
              </details>
            ))}
          </div>

          <div className="mt-12 rounded-2xl border border-gold-300/60 bg-gradient-to-br from-gold-50 to-cream-50 p-6 md:p-8">
            <h3 className="text-lg font-semibold text-ink-900">
              Sua dúvida não está aqui?
            </h3>
            <p className="mt-3 text-sm leading-relaxed text-ink-700">
              Entre em contato diretamente com o Rabino Malachy Ben Israel pelo
              WhatsApp. Ele terá prazer em responder suas perguntas pessoalmente.
            </p>
            <a
              href="https://wa.me/554899231358?text=Shalom%20Rabino%20Malachy!%20Tenho%20uma%20d%C3%BAvida:"
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
        </div>
      </main>
      <SiteFooter />
    </>
  )
}
