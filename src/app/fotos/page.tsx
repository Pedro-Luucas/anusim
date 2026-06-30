"use client"

import Image from "next/image"
import { useState } from "react"
import { SiteHeader } from "@/components/landing/site-header"
import { SiteFooter } from "@/components/landing/site-footer"
import { PhotoLightbox } from "@/components/landing/photo-lightbox"

type AlbumKey =
  | "comunidade"
  | "pessach"
  | "rabino"
  | "chanukah"
  | "simchat"
  | "purim"

const ALBUMS: { key: AlbumKey; title: string; subtitle: string; he: string }[] = [
  { key: "comunidade", title: "Comunidade", subtitle: "O cotidiano da nossa casa", he: "קְהִלָּה" },
  { key: "pessach", title: "Pessach", subtitle: "A noite em que voltamos a contar", he: "פֶּסַח" },
  { key: "rabino", title: "O Rabino", subtitle: "Malachy Ben Israel", he: "מָלְכִי" },
  { key: "chanukah", title: "Chanukah", subtitle: "A luz que persiste", he: "חֲנוּכָּה" },
  { key: "simchat", title: "Simchat Torah", subtitle: "A alegria da Torá", he: "שִׂמְחַת תּוֹרָה" },
  { key: "purim", title: "Purim", subtitle: "Celebrando a salvação", he: "פּוּרִים" },
]

const PHOTOS: Record<AlbumKey, string[]> = {
  comunidade: [
    ...Array.from({ length: 10 }, (_, i) => `/shulphotos/comunidade${i}.jpg`),
    "/shulphotos/comunidade10.jpeg",
    "/shulphotos/comunidade11.jpeg",
    "/shulphotos/comunidade12.jpeg",
    "/shulphotos/comunidade13.jpeg",
    "/shulphotos/comunidade14.jpeg",
    "/shulphotos/comunidade15.jpg",
  ],
  pessach: Array.from({ length: 16 }, (_, i) => `/shulphotos/pessach${i}.jpg`),
  rabino: Array.from({ length: 11 }, (_, i) => `/shulphotos/rabino${i}.jpg`),
  chanukah: ["/shulphotos/chanukah0.jpg", "/shulphotos/chanukah1.jpg"],
  simchat: Array.from({ length: 5 }, (_, i) => `/shulphotos/simchat${i}.jpg`),
  purim: [
    "/shulphotos/purim0.jpeg",
    ...Array.from({ length: 9 }, (_, i) => `/shulphotos/purim${i + 1}.jpg`),
  ],
}

export default function FotosPage() {
  const [active, setActive] = useState<AlbumKey>("comunidade")
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)

  const photos = PHOTOS[active]
  const album = ALBUMS.find((a) => a.key === active)!

  const openLightbox = (index: number) => setLightboxIndex(index)
  const closeLightbox = () => setLightboxIndex(null)

  const switchAlbum = (key: AlbumKey) => {
    setActive(key)
    setLightboxIndex(null)
  }

  return (
    <main className="bg-parchment text-ink-900">
      <SiteHeader />

      <section className="relative pt-32 pb-14 md:pt-44 md:pb-20">
        <div className="mx-auto max-w-5xl px-5 text-center md:px-10">
          <p className="eyebrow">Capítulo visual</p>
          <h1 className="display-xl mt-6 text-5xl text-ink-900 md:text-7xl">
            Momentos da
            <br />
            <span className="italic text-gold-shimmer">nossa casa.</span>
          </h1>
          <p className="mx-auto mt-8 max-w-2xl font-display text-xl italic leading-relaxed text-ink-700">
            Shabat, festas, estudos e rostos. A vida da Anussim Brasil
            Criciúma, em imagens reais.
          </p>
        </div>
      </section>

      <section className="relative pb-8">
        <div className="mx-auto max-w-5xl px-5 md:px-10">
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
            {ALBUMS.map((a) => {
              const isActive = active === a.key
              return (
                <button
                  key={a.key}
                  onClick={() => switchAlbum(a.key)}
                  className={`group relative rounded-2xl border px-4 py-4 text-left transition-all duration-500 ${
                    isActive
                      ? "border-gold-500 bg-gold-500/10 shadow-[0_10px_30px_-15px_rgba(201,162,83,0.5)]"
                      : "border-gold-200 bg-cream-50 hover:border-gold-400"
                  }`}
                >
                  <p
                    className={`font-hebrew text-xl ${isActive ? "text-gold-700" : "text-gold-500/70"}`}
                    dir="rtl"
                  >
                    {a.he}
                  </p>
                  <p
                    className={`mt-1 font-display text-lg leading-tight ${
                      isActive ? "text-ink-900" : "text-ink-700"
                    }`}
                  >
                    {a.title}
                  </p>
                  {isActive && (
                    <span className="absolute -bottom-px left-1/2 h-0.5 w-10 -translate-x-1/2 bg-gold-500" />
                  )}
                </button>
              )
            })}
          </div>
        </div>
      </section>

      <section className="relative py-12 md:py-20">
        <div className="mx-auto max-w-7xl px-5 md:px-10">
          <div className="mb-10 flex items-end justify-between">
            <div>
              <p className="eyebrow">{album.title}</p>
              <h2 className="mt-2 font-display text-3xl text-ink-900 md:text-4xl">
                {album.subtitle}
              </h2>
            </div>
            <p className="text-xs uppercase tracking-[0.28em] text-ink-500">
              {photos.length} imagens
            </p>
          </div>

          <div className="columns-1 gap-5 sm:columns-2 lg:columns-3">
            {photos.map((src, i) => (
              <button
                key={src}
                type="button"
                onClick={() => openLightbox(i)}
                className="group mb-5 block w-full break-inside-avoid cursor-zoom-in text-left"
                style={{
                  animation: `fade-up 0.9s cubic-bezier(0.22,1,0.36,1) ${i * 0.06}s both`,
                }}
                aria-label={`Abrir foto ${i + 1} do álbum ${album.title}`}
              >
                <div className="relative overflow-hidden rounded-2xl border border-gold-200/60 shadow-sm transition-all duration-700 group-hover:border-gold-500 group-hover:shadow-[0_20px_50px_-20px_rgba(201,162,83,0.5)]">
                  <Image
                    src={src}
                    alt={`Foto do álbum ${album.title}`}
                    width={800}
                    height={1000}
                    className="h-auto w-full transition-transform duration-1000 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 flex items-center justify-center bg-ink-900/0 transition-all duration-500 group-hover:bg-ink-900/20">
                    <span className="flex min-h-[44px] min-w-[44px] scale-75 items-center justify-center rounded-full border border-cream-50/40 bg-cream-50/10 text-cream-50 opacity-0 backdrop-blur-sm transition-all duration-500 group-hover:scale-100 group-hover:opacity-100">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                        <path
                          d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </span>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {lightboxIndex !== null && (
        <PhotoLightbox
          photos={photos}
          index={lightboxIndex}
          albumLabel={album.title}
          onClose={closeLightbox}
          onNavigate={setLightboxIndex}
        />
      )}

      <SiteFooter />
    </main>
  )
}
