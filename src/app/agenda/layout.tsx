import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Agenda Semanal",
  description:
    "Horários dos serviços semanais da Sinagoga Anussim Brasil em Criciúma, SC. Kabalat Shabat às sextas 19h, Shacharit aos sábados 9h. Todos são bem-vindos.",
  openGraph: {
    title: "Agenda Semanal",
    description:
      "Horários dos serviços semanais: Kabalat Shabat sextas 19h, Shacharit sábados 9h",
    type: "website",
  },
  alternates: {
    canonical: "/agenda",
  },
}

export default function AgendaLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
