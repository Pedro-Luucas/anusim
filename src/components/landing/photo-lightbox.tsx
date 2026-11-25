"use client"

import Image from "next/image"
import { useCallback, useEffect, useRef } from "react"

type PhotoLightboxProps = {
  photos: string[]
  index: number
  albumLabel: string
  onClose: () => void
  onNavigate: (index: number) => void
}

export function PhotoLightbox({
  photos,
  index,
  albumLabel,
  onClose,
  onNavigate,
}: PhotoLightboxProps) {
  const hasPrev = index > 0
  const hasNext = index < photos.length - 1
  const dialogRef = useRef<HTMLDivElement>(null)
  const previousFocusRef = useRef<HTMLElement | null>(null)

  const goPrev = useCallback(() => {
    if (hasPrev) onNavigate(index - 1)
  }, [hasPrev, index, onNavigate])

  const goNext = useCallback(() => {
    if (hasNext) onNavigate(index + 1)
  }, [hasNext, index, onNavigate])

  useEffect(() => {
    previousFocusRef.current = document.activeElement as HTMLElement

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose()
      if (e.key === "ArrowLeft") goPrev()
      if (e.key === "ArrowRight") goNext()
      if (e.key === "Tab") {
        const dialog = dialogRef.current
        if (!dialog) return
        
        const focusableElements = dialog.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        )
        const firstElement = focusableElements[0]
        const lastElement = focusableElements[focusableElements.length - 1]

        if (e.shiftKey && document.activeElement === firstElement) {
          e.preventDefault()
          lastElement?.focus()
        } else if (!e.shiftKey && document.activeElement === lastElement) {
          e.preventDefault()
          firstElement?.focus()
        }
      }
    }

    document.body.style.overflow = "hidden"
    window.addEventListener("keydown", onKeyDown)

    const firstButton = dialogRef.current?.querySelector<HTMLElement>("button")
    firstButton?.focus()

    return () => {
      document.body.style.overflow = ""
      window.removeEventListener("keydown", onKeyDown)
      previousFocusRef.current?.focus()
    }
  }, [onClose, goPrev, goNext])

  const src = photos[index]

  return (
    <div
      ref={dialogRef}
      className="fixed inset-0 z-[100] flex items-center justify-center bg-ink-900/92 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-label={`Galeria: ${albumLabel}`}
      onClick={onClose}
    >
      <button
        type="button"
        onClick={onClose}
        className="absolute right-3 top-[max(0.75rem,env(safe-area-inset-top))] z-10 flex min-h-11 min-w-11 items-center justify-center rounded-full border border-cream-50/20 bg-cream-50/10 text-cream-50 transition-colors hover:border-gold-400 hover:bg-gold-500/20"
        aria-label="Fechar galeria"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      </button>

      {hasPrev && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation()
            goPrev()
          }}
          className="absolute left-6 top-1/2 z-10 hidden min-h-11 min-w-11 -translate-y-1/2 items-center justify-center rounded-full border border-cream-50/20 bg-cream-50/10 text-cream-50 transition-colors hover:border-gold-400 hover:bg-gold-500/20 md:flex"
          aria-label="Foto anterior"
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M15 6l-6 6 6 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      )}

      {hasNext && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation()
            goNext()
          }}
          className="absolute right-6 top-1/2 z-10 hidden min-h-11 min-w-11 -translate-y-1/2 items-center justify-center rounded-full border border-cream-50/20 bg-cream-50/10 text-cream-50 transition-colors hover:border-gold-400 hover:bg-gold-500/20 md:flex"
          aria-label="Próxima foto"
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M9 6l6 6-6 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      )}

      <div
        className="relative mx-4 flex max-h-[85vh] max-w-5xl flex-col items-center md:mx-16"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative max-h-[68vh] w-full overflow-hidden rounded-2xl border border-gold-500/30 shadow-[0_30px_80px_-20px_rgba(0,0,0,0.6)] md:max-h-[78vh]">
          <Image
            src={src}
            alt={`${albumLabel}, foto ${index + 1} de ${photos.length}`}
            width={1200}
            height={900}
            className="h-auto max-h-[68vh] w-full object-contain md:max-h-[78vh]"
            priority
          />
        </div>

        <div className="mt-4 flex items-center justify-center gap-3">
          <button
            type="button"
            onClick={goPrev}
            disabled={!hasPrev}
            className="flex min-h-11 min-w-11 items-center justify-center rounded-full border border-cream-50/20 bg-cream-50/10 text-cream-50 transition-colors hover:border-gold-400 hover:bg-gold-500/20 disabled:opacity-30 md:hidden"
            aria-label="Foto anterior"
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M15 6l-6 6 6 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          <p className="min-w-16 text-center text-xs uppercase tracking-[0.18em] text-cream-50/70">
            {index + 1} / {photos.length}
          </p>
          <button
            type="button"
            onClick={goNext}
            disabled={!hasNext}
            className="flex min-h-11 min-w-11 items-center justify-center rounded-full border border-cream-50/20 bg-cream-50/10 text-cream-50 transition-colors hover:border-gold-400 hover:bg-gold-500/20 disabled:opacity-30 md:hidden"
            aria-label="Próxima foto"
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M9 6l6 6-6 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  )
}
