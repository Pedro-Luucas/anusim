import type { Metadata } from "next"

export const metadata: Metadata = {
  openGraph: {
    url: "/contato",
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
  alternates: {
    canonical: "/contato",
  },
}

export default function ContatoLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
