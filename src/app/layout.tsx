import type { Metadata } from "next"
import { Inter, Cormorant_Garamond, Frank_Ruhl_Libre } from "next/font/google"
import { SynagogueSchema } from "@/components/landing/synagogue-schema"
import "./globals.css"

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
})

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  variable: "--font-cormorant",
  display: "swap",
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
})

const frankRuhl = Frank_Ruhl_Libre({
  subsets: ["hebrew", "latin"],
  variable: "--font-frank-ruhl",
  display: "swap",
  weight: ["400", "500", "700", "900"],
})

function getMetadataBase(): URL {
  if (process.env.NEXT_PUBLIC_SITE_URL) {
    return new URL(process.env.NEXT_PUBLIC_SITE_URL)
  }
  
  if (process.env.VERCEL_PROJECT_PRODUCTION_URL) {
    return new URL(`https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`)
  }
  
  return new URL("http://localhost:3000")
}

export const metadata: Metadata = {
  metadataBase: getMetadataBase(),
  title: {
    default: "Anussim Brasil Criciúma — Sinagoga Bnei Anusim em Santa Catarina",
    template: "%s — Anussim Brasil Criciúma",
  },
  description:
    "Comunidade judaica Bnei Anusim em Criciúma, SC. Sob a direção do Rabino Malachy Ben Israel. Serviços transmitidos ao vivo, estudo de Torá, shabat e festas. Visite-nos.",
  keywords: [
    "Bnei Anusim",
    "Anussim",
    "Sinagoga Criciúma",
    "Judeus Santa Catarina",
    "Cripto-judeus",
    "Rabino Malachy Ben Israel",
    "Comunidade judaica Brasil",
    "Sinagoga Sul do Brasil",
  ],
  openGraph: {
    title: "Anussim Brasil Criciúma",
    description:
      "A casa dos Bnei Anusim no Sul do Brasil. Shabat, festas, Torá e comunidade.",
    type: "website",
    locale: "pt_BR",
    siteName: "Anussim Brasil Criciúma",
    images: [
      {
        url: "/shulphotos/comunidade0.jpg",
        width: 1200,
        height: 630,
        alt: "Comunidade Anussim Brasil em oração",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Anussim Brasil Criciúma",
    description: "A casa dos Bnei Anusim no Sul do Brasil",
    images: ["/shulphotos/comunidade0.jpg"],
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="pt-BR"
      className={`${inter.variable} ${cormorant.variable} ${frankRuhl.variable}`}
    >
      <body className="font-sans antialiased bg-cream-100 text-ink-900">
        <SynagogueSchema />
        {children}
      </body>
    </html>
  )
}