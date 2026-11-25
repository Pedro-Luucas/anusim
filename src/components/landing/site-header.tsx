"use client"

import Link from "next/link"
import Image from "next/image"
import { useEffect, useRef, useState } from "react"
import { usePathname } from "next/navigation"

const NAV_LINKS = [
  { href: "/", label: "Início" },
  { href: "/bnei-anusim", label: "Bnei Anusim" },
  { href: "/agenda", label: "Agenda" },
  { href: "/fotos", label: "Fotos" },
  { href: "/pontos-de-fe", label: "Pontos de Fé" },
  { href: "/chat", label: "Pergunte" },
  { href: "/contato", label: "Contato" },
  { href: "/entrar", label: "Entrar" },
]

const WHATSAPP_HREF =
  "https://wa.me/554899231358?text=Shalom!%20Gostaria%20de%20visitar%20a%20sinagoga."

export function SiteHeader() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const [barHeight, setBarHeight] = useState(68)
  const barRef = useRef<HTMLDivElement>(null)
  const pathname = usePathname()

  useEffect(() => {
    const bar = barRef.current
    if (!bar) return
    const update = () => setBarHeight(bar.getBoundingClientRect().height)
    update()
    const observer = new ResizeObserver(update)
    observer.observe(bar)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12)
    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  useEffect(() => {
    if (!open) return
    const previous = document.body.style.overflow
    document.body.style.overflow = "hidden"
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false)
    }
    window.addEventListener("keydown", onKey)
    return () => {
      document.body.style.overflow = previous
      window.removeEventListener("keydown", onKey)
    }
  }, [open])

  const solid = scrolled || open

  return (
    <>
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:left-2 focus:top-2 focus:z-[100] focus:rounded-md focus:bg-gold-500 focus:px-4 focus:py-2 focus:font-semibold focus:text-ink-900 focus:shadow-lg"
      >
        Pular para o conteúdo principal
      </a>
      <header
        className={`fixed inset-x-0 top-0 z-50 pt-[env(safe-area-inset-top)] transition-all duration-500 ${
          open
            ? "border-b border-gold-200/70 bg-cream-50"
            : solid
              ? "border-b border-gold-200/70 bg-cream-50/95 shadow-[0_4px_30px_-12px_rgba(201,162,83,0.25)] backdrop-blur-md"
              : "bg-transparent"
        }`}
      >
        <div ref={barRef} className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-3 sm:px-5 xl:px-8 xl:py-4">
          <Link href="/" onClick={() => setOpen(false)} className="group flex min-w-0 items-center gap-2.5 sm:gap-3">
            <div className="relative shrink-0">
              <div
                className="absolute inset-0 -m-1 rounded-full bg-gold-500/20 opacity-0 blur-md transition-opacity duration-500 group-hover:opacity-100"
                aria-hidden="true"
              />
              <Image
                src="/logo.jpg"
                alt="Logo Anussim Brasil"
                width={44}
                height={44}
                className="relative h-10 w-10 rounded-full object-cover ring-1 ring-gold-500/40 sm:h-11 sm:w-11"
                priority
              />
            </div>
            <div className="flex min-w-0 flex-col leading-none">
              <span className="truncate font-display text-[1.15rem] font-medium tracking-tight text-ink-900 sm:text-[1.35rem]">
                Anussim <span className="text-gold-600">Brasil</span>
              </span>
              <span className="mt-1 hidden truncate text-[0.62rem] uppercase tracking-[0.18em] text-ink-500 min-[420px]:block sm:tracking-[0.24em]">
                Criciúma
                <span className="hidden lg:inline"> · Santa Catarina</span>
              </span>
            </div>
          </Link>

          <nav className="hidden items-center gap-x-3.5 2xl:gap-x-6 xl:flex" aria-label="Navegação principal">
            {NAV_LINKS.map((link) => {
              const isCurrent = pathname === link.href
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`group relative py-2 text-[0.8125rem] font-medium tracking-wide transition-colors 2xl:text-sm ${
                    isCurrent ? "text-gold-700" : "text-ink-700 hover:text-gold-700"
                  }`}
                  aria-current={isCurrent ? "page" : undefined}
                >
                  {link.label}
                  <span
                    className={`absolute bottom-0.5 left-0 h-px bg-gold-500 transition-all duration-500 ${
                      isCurrent ? "w-full" : "w-0 group-hover:w-full"
                    }`}
                    aria-hidden="true"
                  />
                </Link>
              )
            })}
          </nav>

          <div className="hidden shrink-0 xl:block">
            <a
              href={WHATSAPP_HREF}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-11 items-center gap-2 rounded-full border border-gold-500 bg-gold-500 px-4 py-2.5 text-sm font-semibold text-ink-900 shadow-[0_4px_18px_-4px_rgba(201,162,83,0.55)] transition-all duration-300 hover:border-gold-600 hover:bg-gold-600 hover:text-cream-50"
            >
              <WhatsAppIcon className="h-4 w-4" />
              Falar com o Rabino
            </a>
          </div>

          <button
            aria-label={open ? "Fechar menu" : "Abrir menu"}
            aria-expanded={open}
            aria-controls="mobile-menu"
            onClick={() => setOpen((value) => !value)}
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-ink-900 transition-colors hover:bg-gold-100 xl:hidden"
          >
            <span className="relative block h-3.5 w-6" aria-hidden="true">
              <span
                className={`absolute left-0 h-0.5 w-6 bg-ink-900 transition-transform duration-300 ${
                  open ? "top-1.5 rotate-45" : "top-0"
                }`}
              />
              <span
                className={`absolute left-0 top-1.5 h-0.5 w-6 bg-ink-900 transition-opacity duration-300 ${
                  open ? "opacity-0" : "opacity-100"
                }`}
              />
              <span
                className={`absolute left-0 h-0.5 w-6 bg-ink-900 transition-transform duration-300 ${
                  open ? "top-1.5 -rotate-45" : "top-3"
                }`}
              />
            </span>
          </button>
        </div>

        <div
          id="mobile-menu"
          className={`xl:hidden bg-cream-50 ${open ? "fixed inset-x-0 bottom-0 z-50 overflow-y-auto" : "hidden"}`}
          style={open ? { top: `calc(${barHeight}px + env(safe-area-inset-top))` } : undefined}
          aria-hidden={!open}
          inert={!open}
        >
          <nav
            className="mx-auto grid max-w-3xl grid-cols-1 gap-1 px-4 py-4 pb-[max(1.25rem,env(safe-area-inset-bottom))] sm:grid-cols-2 sm:px-6"
            aria-label="Navegação mobile"
          >
            {NAV_LINKS.map((link) => {
              const isCurrent = pathname === link.href
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className={`flex min-h-12 items-center rounded-xl px-4 text-base font-medium transition-colors ${
                    isCurrent
                      ? "bg-gold-100 text-gold-800"
                      : "text-ink-800 hover:bg-cream-200"
                  }`}
                  aria-current={isCurrent ? "page" : undefined}
                >
                  {link.label}
                </Link>
              )
            })}
            <a
              href={WHATSAPP_HREF}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-gold-500 px-5 py-3 text-sm font-semibold text-ink-900 sm:col-span-2"
            >
              <WhatsAppIcon className="h-4 w-4" />
              Falar com o Rabino
            </a>
          </nav>
        </div>
      </header>
    </>
  )
}

function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z" />
    </svg>
  )
}
