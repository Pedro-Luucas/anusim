import type { Metadata } from "next"

export const metadata: Metadata = {
  openGraph: {
    url: "/bnei-anusim",
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
  alternates: {
    canonical: "/bnei-anusim",
  },
}

export default function BneiAnusimLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
