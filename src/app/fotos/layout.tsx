import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Fotos da Comunidade",
  description:
    "Galeria de fotos da Sinagoga Anussim Brasil em Criciúma, SC. Momentos da comunidade, celebrações de Pessach e serviços com o Rabino Malachy Ben Israel.",
  openGraph: {
    title: "Fotos da Comunidade — Anussim Brasil Criciúma",
    description:
      "Momentos da vida comunitária, festas judaicas e serviços na sinagoga",
    type: "website",
    images: [
      {
        url: "/shulphotos/comunidade0.jpg",
        width: 1200,
        height: 630,
        alt: "Comunidade Anussim Brasil reunida",
      },
    ],
  },
}

export default function FotosLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
