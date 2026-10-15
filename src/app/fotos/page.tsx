"use client"

import Image from "next/image"
import { useState } from "react"

import { SiteHeader } from "@/components/landing/site-header"
import { SiteFooter } from "@/components/landing/site-footer"
import { PhotoLightbox } from "@/components/landing/photo-lightbox"
import { Card } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ALBUMS, PHOTOS, type AlbumKey } from "@/lib/photos"

export default function FotosPage() {
  const [active, setActive] = useState<AlbumKey>("comunidade")
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)

  const photos = PHOTOS[active]
  const album = ALBUMS.find((item) => item.key === active) ?? ALBUMS[0]

  const openLightbox = (index: number) => setLightboxIndex(index)
  const closeLightbox = () => setLightboxIndex(null)

  const switchAlbum = (key: string) => {
    if (!ALBUMS.some((item) => item.key === key)) return
    setActive(key as AlbumKey)
    setLightboxIndex(null)
  }

  return (
    <main id="main-content" className="bg-parchment text-ink-900">
      <SiteHeader />

      <section className="relative pt-32 pb-14 md:pt-44 md:pb-20">
        <div className="mx-auto max-w-5xl px-5 text-center md:px-10">
          <p className="eyebrow">Capítulo visual</p>
          <h1 className="display-xl mt-6 text-5xl text-ink-900 md:text-7xl">
            Momentos da
            <br />
            <span className="italic text-gold-shimmer">nossa casa.</span>
          </h1>
          <p className="mx-auto mt-8 max-w-2xl font-display text-xl leading-relaxed text-ink-700 italic">
            Shabat, festas, estudos e rostos. A vida da Anussim Brasil
            Criciúma, em imagens reais.
          </p>
        </div>
      </section>

      <section className="relative pb-8">
        <div className="mx-auto max-w-7xl px-5 md:px-10">
          <Tabs value={active} onValueChange={switchAlbum} className="gap-8">
            <TabsList
              variant="line"
              className="mx-auto grid h-auto w-full max-w-5xl grid-cols-2 gap-3 bg-transparent p-0 sm:grid-cols-3 lg:grid-cols-6"
            >
              {ALBUMS.map((item) => (
                <TabsTrigger
                  key={item.key}
                  value={item.key}
                  aria-pressed={active === item.key}
                  className="h-auto min-h-[44px] flex-col items-start rounded-2xl border border-gold-200 bg-cream-50 px-4 py-4 text-left whitespace-normal data-active:border-gold-500 data-active:bg-gold-500/10 data-active:text-ink-900"
                >
                  <span className="font-hebrew text-xl text-gold-700" dir="rtl">
                    {item.he}
                  </span>
                  <span className="mt-1 font-display text-lg leading-tight text-ink-900">
                    {item.title}
                  </span>
                </TabsTrigger>
              ))}
            </TabsList>

            {ALBUMS.map((item) => {
              const albumPhotos = PHOTOS[item.key]
              return (
                <TabsContent key={item.key} value={item.key} className="mt-4">
                  <div className="mb-10 flex items-end justify-between">
                    <div>
                      <p className="eyebrow">{item.title}</p>
                      <h2 className="mt-2 font-display text-3xl text-ink-900 md:text-4xl">
                        {item.subtitle}
                      </h2>
                    </div>
                    <p className="text-xs tracking-[0.28em] text-ink-500 uppercase">
                      {albumPhotos.length} imagens
                    </p>
                  </div>

                  <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                    {albumPhotos.map((src, i) => (
                      <button
                        key={src}
                        type="button"
                        onClick={() => openLightbox(i)}
                        className="group cursor-zoom-in text-left"
                        aria-label={`Abrir foto ${i + 1} do álbum ${item.title}`}
                      >
                        <Card className="overflow-hidden rounded-2xl border-gold-200/60 bg-cream-50 py-0 ring-gold-200/40 transition-all duration-500 group-hover:border-gold-500 group-hover:shadow-[0_20px_50px_-20px_rgba(201,162,83,0.5)]">
                          <Image
                            src={src}
                            alt={`Foto do álbum ${item.title}`}
                            width={800}
                            height={1000}
                            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                            className="h-auto w-full bg-cream-200 object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                          />
                        </Card>
                      </button>
                    ))}
                  </div>
                </TabsContent>
              )
            })}
          </Tabs>
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
