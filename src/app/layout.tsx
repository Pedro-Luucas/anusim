import type { Metadata } from "next"
import { Inter, Cormorant_Garamond, Frank_Ruhl_Libre } from "next/font/google"
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

export const metadata: Metadata = {
  title: "Anussim Brasil Criciúma — Sinagoga Bnei Anusim em Santa Catarina",
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
        {children}
      </body>
    </html>
  )
}