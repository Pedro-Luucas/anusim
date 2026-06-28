"use client"

import Link from "next/link"
import Image from "next/image"
import { useEffect, useState } from "react"

const NAV_LINKS = [
  { href: "/", label: "Início" },
  { href: "/bnei-anusim", label: "Bnei Anusim" },
  { href: "/fotos", label: "Fotos" },
  { href: "/pontos-de-fe", label: "Pontos de Fé" },
  { href: "/contato", label: "Contato" },
]

export function SiteHeader() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12)
    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
        scrolled
          ? "bg-cream-50/95 backdrop-blur-md border-b border-gold-200/60 shadow-[0_4px_30px_-12px_rgba(201,162,83,0.25)]"
          : "bg-transparent"
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-3.5 md:px-10 md:py-5">
        <Link href="/" className="group flex items-center gap-3">
          <div className="relative">
            <div className="absolute inset-0 -m-1 rounded-full bg-gold-500/20 blur-md transition-opacity duration-500 group-hover:opacity-100 opacity-0" />
            <Image
              src="/logo.jpg"
              alt="Logo Anussim Brasil"
              width={44}
              height={44}
              className="relative h-11 w-11 rounded-full ring-1 ring-gold-500/40 object-cover"
              priority
            />
          </div>
          <div className="flex flex-col leading-none">
            <span className="font-display text-[1.35rem] font-medium tracking-tight text-ink-900">
              Anussim <span className="text-gold-600">Brasil</span>
            </span>
            <span className="mt-1 text-[0.65rem] uppercase tracking-[0.32em] text-ink-500">
              Criciúma · Santa Catarina
            </span>
          </div>
        </Link>

        <nav className="hidden items-center gap-9 md:flex">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="group relative text-sm font-medium tracking-wide text-ink-700 transition-colors hover:text-gold-700"
            >
              {link.label}
              <span className="absolute -bottom-1.5 left-0 h-px w-0 bg-gold-500 transition-all duration-500 group-hover:w-full" />
            </Link>
          ))}
        </nav>

        <div className="hidden md:block">
          <a
            href="https://wa.me/554899231358?text=Shalom!%20Gostaria%20de%20visitar%20a%20sinagoga."
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex items-center gap-2 rounded-full border border-gold-500 bg-gold-500 px-5 py-2.5 text-sm font-semibold text-ink-900 shadow-[0_4px_18px_-4px_rgba(201,162,83,0.55)] transition-all duration-300 hover:bg-gold-600 hover:border-gold-600 hover:text-cream-50"
          >
            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z" />
            </svg>
            Falar com o Rabino
          </a>
        </div>

        {/* Mobile menu button */}
        <button
          aria-label="Abrir menu"
          onClick={() => setOpen((o) => !o)}
          className="md:hidden flex flex-col gap-1.5 p-2"
        >
          <span className={`h-px w-6 bg-ink-900 transition-all ${open ? "translate-y-3 rotate-45" : ""}`} />
          <span className={`h-px w-6 bg-ink-900 transition-all ${open ? "opacity-0" : ""}`} />
          <span className={`h-px w-6 bg-ink-900 transition-all ${open ? "-translate-y-3 -rotate-45" : ""}`} />
        </button>
      </div>

      {/* Mobile nav */}
      <div
        className={`md:hidden overflow-hidden transition-all duration-500 ${
          open ? "max-h-96 border-t border-gold-200/60" : "max-h-0"
        } bg-cream-50/98 backdrop-blur-md`}
      >
        <nav className="flex flex-col gap-1 px-5 py-5">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className="rounded-md px-3 py-3 text-base font-medium text-ink-700 transition-colors hover:bg-gold-50 hover:text-gold-700"
            >
              {link.label}
            </Link>
          ))}
          <a
            href="https://wa.me/554899231358"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-3 inline-flex items-center justify-center gap-2 rounded-full bg-gold-500 px-5 py-3 text-sm font-semibold text-ink-900"
          >
            Falar com o Rabino
          </a>
        </nav>
      </div>
    </header>
  )
}