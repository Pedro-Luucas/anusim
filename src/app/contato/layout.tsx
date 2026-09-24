import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Contato e Serviços",
  description:
    "Entre em contato com a Sinagoga Anussim Brasil em Criciúma. WhatsApp do Rabino Malachy Ben Israel, endereço, transmissões ao vivo no YouTube e redes sociais.",
  openGraph: {
    title: "Contato — Anussim Brasil Criciúma",
    description:
      "Fale com o Rabino Malachy, visite a sinagoga ou assista aos serviços ao vivo",
    type: "website",
    images: [
      {
        url: "/shulphotos/rabino2.jpg",
        width: 1200,
        height: 630,
        alt: "Rabino Malachy Ben Israel",
      },
    ],
  },
}

export default function ContatoLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
