"use client"

import Image from "next/image"
import { useState } from "react"
import { SiteHeader } from "@/components/landing/site-header"
import { SiteFooter } from "@/components/landing/site-footer"
import { OrnametalDivider, StarOfDavid } from "@/components/landing/judaic-symbols"

type AlbumKey = "comunidade" | "pessach" | "rabino"

const ALBUMS: { key: AlbumKey; title: string; subtitle: string; he: string }[] = [
  { key: "comunidade", title: "Comunidade", subtitle: "O cotidiano da nossa casa", he: "קְהִלָּה" },
  { key: "pessach", title: "Pessach", subtitle: "A noite em que voltamos a contar", he: "פֶּסַח" },
  { key: "rabino", title: "O Rabino", subtitle: "Malachy Ben Israel", he: "מָלְכִי" },
]

const PHOTOS: Record<AlbumKey, string[]> = {
  comunidade: Array.from({ length: 10 }, (_, i) => `/shulphotos/comunidade${i}.jpg`),
  pessach: Array.from({ length: 10 }, (_, i) => `/shulphotos/pessach${i}.jpg`),
  rabino: Array.from({ length: 7 }, (_, i) => `/shulphotos/rabino${i}.jpg`),
}

export default function FotosPage() {
  const [active, setActive] = useState<AlbumKey>("comunidade")
  const photos = PHOTOS[active]
  const album = ALBUMS.find((a) => a.key === active)!

  return (
    <main className="bg-parchment text-ink-900">
      <SiteHeader />

      {/* HEADER */}
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

      {/* ALBUM SWITCHER */}
      <section className="relative pb-8">
        <div className="mx-auto max-w-5xl px-5 md:px-10">
          <div className="flex flex-col items-center gap-6 md:flex-row md:justify-center">
            {ALBUMS.map((a) => {
              const isActive = active === a.key
              return (
                <button
                  key={a.key}
                  onClick={() => setActive(a.key)}
                  className={`group relative w-full rounded-2xl border px-6 py-5 text-left transition-all duration-500 md:w-auto md:min-w-[200px] ${
                    isActive
                      ? "border-gold-500 bg-gold-500/10 shadow-[0_10px_30px_-15px_rgba(201,162,83,0.5)]"
                      : "border-gold-200 bg-cream-50 hover:border-gold-400"
                  }`}
                >
                  <p
                    className={`font-hebrew text-2xl ${isActive ? "text-gold-700" : "text-gold-500/70"}`}
                    dir="rtl"
                  >
                    {a.he}
                  </p>
                  <p
                    className={`mt-2 font-display text-2xl ${
                      isActive ? "text-ink-900" : "text-ink-700"
                    }`}
                  >
                    {a.title}
                  </p>
                  <p className="mt-1 text-xs uppercase tracking-[0.22em] text-ink-500">
                    {a.subtitle}
                  </p>
                  {isActive && (
                    <span className="absolute -bottom-px left-1/2 h-0.5 w-12 -translate-x-1/2 bg-gold-500" />
                  )}
                </button>
              )
            })}
          </div>
        </div>
      </section>

      {/* GALLERY */}
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
              <figure
                key={src}
                className="mb-5 break-inside-avoid group"
                style={{
                  animation: `fade-up 0.9s cubic-bezier(0.22,1,0.36,1) ${i * 0.06}s both`,
                }}
              >
                <div className="relative overflow-hidden rounded-2xl border border-gold-200/60 shadow-sm transition-all duration-700 group-hover:border-gold-500 group-hover:shadow-[0_20px_50px_-20px_rgba(201,162,83,0.5)]">
                  <Image
                    src={src}
                    alt={`Foto ${album.title} ${i + 1}`}
                    width={800}
                    height={1000}
                    className="h-auto w-full transition-transform duration-1000 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-ink-900/40 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                  <figcaption className="absolute bottom-3 left-4 right-4 text-xs uppercase tracking-[0.24em] text-cream-50 opacity-0 transition-opacity duration-500 group-hover:opacity-100">
                    {album.title} · {String(i + 1).padStart(2, "0")}
                  </figcaption>
                </div>
              </figure>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative overflow-hidden py-24">
        <div className="mx-auto max-w-3xl px-5 text-center md:px-10">
          <OrnametalDivider symbol="star" />
          <h2 className="display-xl mt-8 text-4xl text-ink-900 md:text-5xl">
            Venha fazer parte
            <br />
            <span className="italic text-gold-shimmer">da próxima foto.</span>
          </h2>
          <p className="mt-6 text-lg text-ink-700">
            Toda imagem aqui foi feita dentro da nossa sinagoga, com pessoas
            reais. A próxima pode incluir você.
          </p>
          <a
            href="https://wa.me/554899231358"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-8 inline-flex items-center gap-2 rounded-full bg-ink-900 px-7 py-4 text-sm font-semibold text-cream-50 transition-colors hover:bg-gold-700"
          >
            <StarOfDavid className="h-4 w-4 text-gold-300" />
            Agendar visita
          </a>
        </div>
      </section>

      <SiteFooter />
    </main>
  )
}