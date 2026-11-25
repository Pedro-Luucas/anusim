import { Metadata } from "next"
import { ChatInterface } from "@/components/chat/chat-interface"
import { SiteHeader } from "@/components/landing/site-header"
import { SiteFooter } from "@/components/landing/site-footer"

export const metadata: Metadata = {
  title: "Pergunte",
  description:
    "Tire dúvidas sobre textos judaicos com fontes citadas do Sefaria.",
}

export default function ChatPage() {
  return (
    <>
      <SiteHeader />
      <main id="main-content" className="flex h-dvh flex-col bg-parchment pt-[calc(4.5rem+env(safe-area-inset-top))]">
        <div className="mx-auto flex min-h-0 w-full max-w-5xl flex-1 flex-col px-3 py-3 sm:px-4 sm:py-5">
          <div className="mb-3 shrink-0 rounded-2xl border border-wine-500/30 bg-wine-500/5 p-3.5 sm:p-4">
            <p className="text-sm leading-relaxed text-ink-900">
              <strong>Aviso:</strong> este assistente responde com base em textos
              judaicos e não substitui o{" "}
              <strong>Rabino Malachy Ben Israel</strong> em questões halácicas.
              WhatsApp:{" "}
              <a
                href="https://wa.me/554899231358?text=Shalom%20Rabino%20Malachy!%20"
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-wine-500 underline-offset-2 hover:underline"
              >
                +55 48 9923-1358
              </a>
              .
            </p>
          </div>

          <div className="min-h-0 flex-1 overflow-hidden rounded-2xl border border-gold-200 bg-cream-50 shadow-[0_20px_50px_-28px_rgba(168,132,47,0.45)]">
            <ChatInterface />
          </div>
        </div>
      </main>
      <SiteFooter className="mt-0" />
    </>
  )
}
