import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Pontos de Fé",
  description:
    "Os três pilares fundamentais da comunidade Anussim Brasil: Shabat, Torá e Kehilá (comunidade). Conheça o que nos define como judeus Bnei Anusim.",
  openGraph: {
    title: "Pontos de Fé — Anussim Brasil Criciúma",
    description: "Shabat, Torá e Comunidade — os três pilares que não negociamos",
    type: "website",
    images: [
      {
        url: "/logo.jpg",
        width: 1200,
        height: 630,
        alt: "Anussim Brasil Criciúma",
      },
    ],
  },
}

export default function PontosDeFeLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
