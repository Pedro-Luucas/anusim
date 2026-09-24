"use client"

import { SiteHeader } from "@/components/landing/site-header"
import { SiteFooter } from "@/components/landing/site-footer"
import { ChatInterface } from "@/components/chat/chat-interface"

export default function ChatPage() {
  const isConfigured =
    typeof window === "undefined"
      ? process.env.NEXT_PUBLIC_SUPABASE_URL &&
        process.env.CHAT_MODEL
      : true

  if (!isConfigured) {
    return (
      <>
        <SiteHeader />
        <main className="flex min-h-screen flex-col bg-cream-100 pt-20">
          <div className="flex flex-1 items-center justify-center p-6">
            <div className="max-w-md rounded-2xl border border-gold-200 bg-cream-50 p-8 text-center shadow-lg">
              <div className="mb-4 text-5xl font-hebrew text-gold-500" dir="rtl">
                ⚙️
              </div>
              <h1 className="mb-3 font-display text-2xl font-medium text-ink-900">
                Assistente ainda não configurado
              </h1>
              <p className="text-sm leading-relaxed text-ink-500">
                O assistente de estudos judaicos está sendo preparado. Entre em
                contato com o administrador para mais informações.
              </p>
            </div>
          </div>
        </main>
        <SiteFooter />
      </>
    )
  }

  return (
    <>
      <SiteHeader />
      <main className="flex min-h-screen flex-col bg-cream-100 pt-20">
        <div className="mx-auto w-full max-w-5xl px-4 py-6">
          <div className="mb-6 text-center">
            <div className="mb-2 text-4xl font-hebrew text-gold-500" dir="rtl">
              שְׁאֵלָה
            </div>
            <h1 className="mb-2 font-display text-3xl font-medium text-ink-900">
              Assistente de Estudos Judaicos
            </h1>
            <p className="text-sm text-ink-500">
              Respostas fundamentadas em fontes sagradas judaicas
            </p>
          </div>

          <div
            className="mb-6 rounded-xl border border-gold-300 bg-gold-50/50 p-4 md:p-5"
            role="note"
            aria-label="Aviso importante"
          >
            <div className="flex items-start gap-3">
              <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-gold-500 text-white">
                <svg
                  className="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <div className="flex-1 text-sm leading-relaxed text-ink-700">
                <strong className="font-semibold">Aviso Importante:</strong> Este
                assistente é apenas uma ferramenta de estudo e não substitui a
                consulta ao rabino. Para questões halácicas práticas ou dúvidas
                pessoais, entre em contato com o{" "}
                <a
                  href="https://wa.me/554899231358?text=Shalom%20Rabino%20Malachy!%20Tenho%20uma%20pergunta..."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-medium text-gold-700 underline decoration-gold-300 transition-colors hover:text-gold-800 hover:decoration-gold-500"
                >
                  Rabino Malachy Ben Israel
                </a>
                .
              </div>
            </div>
          </div>

          <div className="overflow-hidden rounded-2xl border border-gold-200 bg-white shadow-lg">
            <div className="flex h-[calc(100vh-400px)] min-h-[500px] flex-col md:h-[600px]">
              <ChatInterface />
            </div>
          </div>
        </div>
      </main>
      <SiteFooter />
    </>
  )
}
