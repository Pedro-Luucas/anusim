import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Doações via Pix — Anussim Brasil Criciúma",
  description:
    "Apoie a Sinagoga Anussim Brasil em Criciúma com sua doação via Pix. Sua contribuição ajuda a manter os serviços, transmissões ao vivo e atividades da comunidade.",
  openGraph: {
    title: "Doações via Pix — Anussim Brasil Criciúma",
    description:
      "Apoie a sinagoga com sua doação via Pix. Mantenha viva a chama da comunidade judaica em SC.",
    type: "website",
  },
}

export default function DoacoesLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
