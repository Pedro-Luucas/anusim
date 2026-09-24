import type { Metadata } from "next"

export const metadata: Metadata = {
  openGraph: {
    url: "/pontos-de-fe",
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
  alternates: {
    canonical: "/pontos-de-fe",
  },
}

export default function PontosDeFeLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
