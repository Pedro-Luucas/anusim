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
      <main className="flex min-h-screen flex-col bg-cream-100 pt-32 md:pt-44">
        <div className="mx-auto w-full max-w-5xl px-4 py-8">
          <div className="mb-6 rounded-lg border border-wine-500/30 bg-wine-500/5 p-4">
            <p className="text-sm leading-relaxed text-ink-900">
              <strong>Aviso Importante:</strong> Este assistente responde com
              base em textos judaicos, mas não substitui a consulta ao{" "}
              <strong>Rabino Malachy Ben Israel</strong> para questões
              halácicas (lei judaica) práticas. Entre em contato pelo WhatsApp:{" "}
              <a
                href="https://wa.me/554899231358?text=Shalom%20Rabino%20Malachy!%20"
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-wine-500 hover:underline"
              >
                +55 48 9923-1358
              </a>
              .
            </p>
          </div>

          <div className="h-[calc(100vh-16rem)] overflow-hidden rounded-lg border border-gold-300/30 bg-cream-50 shadow-sm">
            <ChatInterface />
          </div>
        </div>
      </main>
      <SiteFooter />
    </>
  )
}
