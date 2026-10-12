import type { Metadata } from "next"
import { IS_DRAFT } from "@/app/perguntas-frequentes/draft"

export const metadata: Metadata = {
  title: "Perguntas Frequentes",
  description:
    "Dúvidas sobre Bnei Anusim, como visitar a sinagoga, horários de serviços e como reconectar-se com raízes judaicas. Respostas do Rabino Malachy Ben Israel.",
  robots: IS_DRAFT ? "noindex, nofollow" : undefined,
  openGraph: {
    title: "Perguntas Frequentes",
    description:
      "Respostas sobre Bnei Anusim, visitas à sinagoga e reconexão com o judaísmo",
    type: "website",
  },
  alternates: {
    canonical: "/perguntas-frequentes",
  },
}

export default function PerguntasFrequentesLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
