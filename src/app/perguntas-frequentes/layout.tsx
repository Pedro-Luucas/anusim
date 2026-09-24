import type { Metadata } from "next"

const IS_DRAFT = true

export const metadata: Metadata = {
  title: "Perguntas Frequentes — Anussim Brasil Criciúma",
  description:
    "Dúvidas sobre Bnei Anusim, como visitar a sinagoga, horários de serviços e como reconectar-se com raízes judaicas. Respostas do Rabino Malachy Ben Israel.",
  robots: IS_DRAFT ? "noindex, nofollow" : undefined,
  openGraph: {
    title: "Perguntas Frequentes — Anussim Brasil Criciúma",
    description:
      "Respostas sobre Bnei Anusim, visitas à sinagoga e reconexão com o judaísmo",
    type: "website",
  },
}

export default function PerguntasFrequentesLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
