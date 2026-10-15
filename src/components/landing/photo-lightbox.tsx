"use client"

import Image from "next/image"
import { useCallback, useEffect } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog"

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
  const src = photos[index]

  const goPrev = useCallback(() => {
    if (hasPrev) onNavigate(index - 1)
  }, [hasPrev, index, onNavigate])

  const goNext = useCallback(() => {
    if (hasNext) onNavigate(index + 1)
  }, [hasNext, index, onNavigate])

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "ArrowLeft") goPrev()
      if (event.key === "ArrowRight") goNext()
    }
    window.addEventListener("keydown", onKeyDown)
    return () => window.removeEventListener("keydown", onKeyDown)
  }, [goPrev, goNext])

  if (!src) return null

  return (
    <Dialog open onOpenChange={(next) => { if (!next) onClose() }}>
      <DialogContent
        className="max-h-[92vh] w-[min(100%-1.5rem,64rem)] max-w-5xl border-gold-500/30 bg-cream-50 p-4 sm:max-w-5xl"
        overlayClassName="bg-ink-900/92 backdrop-blur-sm"
        aria-label={`Galeria: ${albumLabel}`}
      >
        <DialogTitle className="sr-only">{albumLabel}</DialogTitle>
        <DialogDescription className="sr-only">
          Foto {index + 1} de {photos.length}
        </DialogDescription>

        {hasPrev && (
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={goPrev}
            className="absolute top-1/2 left-2 z-10 min-h-[44px] min-w-[44px] -translate-y-1/2 rounded-full border border-gold-300 bg-cream-50/90 text-ink-900 hover:bg-gold-100"
            aria-label="Foto anterior"
          >
            <ChevronLeft className="size-5" />
          </Button>
        )}

        {hasNext && (
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={goNext}
            className="absolute top-1/2 right-2 z-10 min-h-[44px] min-w-[44px] -translate-y-1/2 rounded-full border border-gold-300 bg-cream-50/90 text-ink-900 hover:bg-gold-100 md:right-2"
            aria-label="Próxima foto"
          >
            <ChevronRight className="size-5" />
          </Button>
        )}

        <div className="relative mx-auto flex min-h-[40vh] w-full items-center justify-center">
          <Image
            src={src}
            alt={`${albumLabel}, foto ${index + 1} de ${photos.length}`}
            width={1600}
            height={1200}
            sizes="(max-width: 768px) 100vw, 64rem"
            className="max-h-[78vh] w-auto max-w-full rounded-xl object-contain"
            priority
          />
        </div>

        <p className="text-center text-xs tracking-[0.28em] text-ink-500 uppercase">
          {index + 1} / {photos.length}
        </p>
      </DialogContent>
    </Dialog>
  )
}
