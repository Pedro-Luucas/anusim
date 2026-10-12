import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Calendário Judaico",
  description:
    "Calendário judaico com festas, parashiot e datas hebraicas para a comunidade Anussim Brasil em Criciúma, SC.",
  openGraph: {
    title: "Calendário Judaico",
    description:
      "Festas, parashiot e datas hebraicas da comunidade Anussim Brasil em Criciúma, SC.",
    type: "website",
  },
  alternates: {
    canonical: "/calendario",
  },
}

export default function CalendarioLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
