import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Quem são os Bnei Anusim",
  description:
    "Conheça a história dos Bnei Anusim — descendentes de judeus forçados à conversão na Inquisição. A comunidade em Criciúma acolhe quem deseja reconectar-se com suas raízes judaicas.",
  openGraph: {
    title: "Quem são os Bnei Anusim — Anussim Brasil Criciúma",
    description:
      "A história dos filhos dos forçados — cripto-judeus que mantiveram a fé em segredo por gerações",
    type: "article",
    images: [
      {
        url: "/shulphotos/comunidade5.jpg",
        width: 1200,
        height: 630,
        alt: "Comunidade Anussim Brasil",
      },
    ],
  },
}

export default function BneiAnusimLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
