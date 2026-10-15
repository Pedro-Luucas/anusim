"use client"

import Link from "next/link"
import Image from "next/image"
import { useEffect, useState } from "react"
import { usePathname } from "next/navigation"
import { Menu } from "lucide-react"

import { LOGIN_HREF, LOGIN_LABEL, PRIMARY_NAV, WHATSAPP_HREF } from "@/lib/nav"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"

function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z" />
    </svg>
  )
}

export function SiteHeader() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12)
    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  useEffect(() => {
    setOpen(false)
  }, [pathname])

  return (
    <>
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:z-[100] focus:top-2 focus:left-2 focus:rounded-md focus:bg-gold-500 focus:px-4 focus:py-2 focus:font-semibold focus:text-ink-900 focus:shadow-lg"
      >
        Pular para o conteúdo principal
      </a>
      <header
        className={cn(
          "fixed inset-x-0 top-0 z-50 transition-all duration-500",
          scrolled
            ? "border-b border-gold-200/60 bg-cream-50/95 shadow-[0_4px_30px_-12px_rgba(201,162,83,0.25)] backdrop-blur-md"
            : "bg-transparent"
        )}
      >
        <div className="mx-auto flex h-[4.25rem] max-w-7xl items-center gap-4 px-4 xl:h-[4.75rem] xl:px-6">
          <Link href="/" className="group flex min-w-0 shrink-0 items-center gap-2.5">
            <div className="relative">
              <div
                className="absolute inset-0 -m-1 rounded-full bg-gold-500/20 opacity-0 blur-md transition-opacity duration-500 group-hover:opacity-100"
                aria-hidden="true"
              />
              <Image
                src="/logo.jpg"
                alt="Logo Anussim Brasil"
                width={40}
                height={40}
                className="relative h-10 w-10 rounded-full object-cover ring-1 ring-gold-500/40"
                priority
              />
            </div>
            <div className="flex min-w-0 flex-col leading-none">
              <span className="font-display text-[1.2rem] font-medium tracking-tight text-ink-900 xl:text-[1.35rem]">
                Anussim <span className="text-gold-600">Brasil</span>
              </span>
              <span className="mt-0.5 hidden text-[0.6rem] uppercase tracking-[0.28em] text-ink-500 sm:block">
                Criciúma · Santa Catarina
              </span>
            </div>
          </Link>

          <NavigationMenu className="hidden min-w-0 flex-1 justify-center xl:flex" aria-label="Navegação principal">
            <NavigationMenuList className="flex-nowrap gap-0">
              {PRIMARY_NAV.map((link) => {
                const isCurrent = pathname === link.href
                return (
                  <NavigationMenuItem key={link.href} className="shrink-0">
                    <NavigationMenuLink
                      href={link.href}
                      render={<Link href={link.href} />}
                      active={isCurrent}
                      className={cn(
                        "whitespace-nowrap rounded-full bg-transparent px-2.5 py-2 text-[0.82rem] font-medium tracking-wide text-ink-700 hover:bg-gold-100/70 hover:text-gold-700 focus:bg-gold-100/70 data-active:bg-gold-100/80 data-active:text-gold-700",
                        isCurrent && "text-gold-700"
                      )}
                      aria-current={isCurrent ? "page" : undefined}
                    >
                      {link.label}
                    </NavigationMenuLink>
                  </NavigationMenuItem>
                )
              })}
            </NavigationMenuList>
          </NavigationMenu>

          <div className="ml-auto hidden shrink-0 items-center gap-3 xl:flex">
            <Button
              nativeButton={false}
              render={
                <Link
                  href={LOGIN_HREF}
                  className="inline-flex min-h-[44px] items-center justify-center rounded-full border border-gold-400 bg-transparent px-4 text-sm font-semibold text-gold-700 hover:border-gold-500 hover:bg-gold-100 hover:text-gold-700"
                />
              }
            >
              {LOGIN_LABEL}
            </Button>
            <a
              href={WHATSAPP_HREF}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-[44px] items-center gap-2 rounded-full border border-gold-500 bg-gold-500 px-4 text-sm font-semibold whitespace-nowrap text-ink-900 shadow-[0_4px_18px_-4px_rgba(201,162,83,0.55)] transition-all duration-300 hover:border-gold-600 hover:bg-gold-600 hover:text-cream-50"
            >
              <WhatsAppIcon className="h-4 w-4" />
              Falar com o Rabino
            </a>
          </div>

          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger
              aria-label={open ? "Fechar menu" : "Abrir menu"}
              aria-expanded={open}
              aria-controls="mobile-menu"
              className="ml-auto inline-flex min-h-[44px] min-w-[44px] items-center justify-center rounded-full text-ink-900 xl:hidden"
            >
              <Menu className="h-6 w-6" />
            </SheetTrigger>
            <SheetContent
              id="mobile-menu"
              side="right"
              className="w-[min(100%,22rem)] border-gold-200 bg-cream-50 p-0"
              aria-hidden={!open}
            >
              <SheetHeader className="border-b border-gold-200/70 px-5 py-5">
                <SheetTitle className="font-display text-2xl text-ink-900">
                  Anussim <span className="text-gold-600">Brasil</span>
                </SheetTitle>
                <SheetDescription>Navegação do site da sinagoga em Criciúma.</SheetDescription>
              </SheetHeader>
              <nav
                className="flex flex-1 flex-col gap-1 overflow-y-auto px-4 py-4"
                aria-label="Navegação mobile"
              >
                {PRIMARY_NAV.map((link) => {
                  const isCurrent = pathname === link.href
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => setOpen(false)}
                      className={cn(
                        "rounded-xl px-3 py-3 text-base font-medium text-ink-700 transition-colors hover:bg-gold-100 hover:text-gold-700",
                        isCurrent && "bg-gold-100/80 text-gold-700"
                      )}
                      aria-current={isCurrent ? "page" : undefined}
                    >
                      {link.label}
                    </Link>
                  )
                })}
              </nav>
              <SheetFooter className="border-t border-gold-200/70 bg-cream-50">
                <Link
                  href={LOGIN_HREF}
                  onClick={() => setOpen(false)}
                  className="inline-flex min-h-[44px] items-center justify-center rounded-full border border-gold-500 bg-transparent px-5 py-3 text-sm font-semibold text-gold-700"
                >
                  {LOGIN_LABEL}
                </Link>
                <a
                  href={WHATSAPP_HREF}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex min-h-[44px] items-center justify-center gap-2 rounded-full bg-gold-500 px-5 py-3 text-sm font-semibold text-ink-900"
                >
                  <WhatsAppIcon className="h-4 w-4" />
                  Falar com o Rabino
                </a>
              </SheetFooter>
            </SheetContent>
          </Sheet>
        </div>
      </header>
    </>
  )
}
