"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import type { ZmanItem } from "@/lib/hebcal"

type Props = {
  zmanim: ZmanItem[]
  date: string
}

export function ZmanimSection({ zmanim, date }: Props) {
  const [activeKey, setActiveKey] = useState<string | null>(null)
  const activeZman = zmanim.find((z) => z.key === activeKey) ?? null

  return (
    <section className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm">
      <h2 className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-primary-500">
        <span className="inline-block h-px w-4 bg-primary-300" />
        Zmanim — Horários Haláchicos
      </h2>
      <p className="mt-1 mb-4 text-xs text-neutral-400 capitalize">{date}</p>

      <div className="divide-y divide-neutral-100">
        {zmanim.map((zman) => (
          <div
            key={zman.key}
            className="flex items-center justify-between gap-3 py-3 first:pt-0 last:pb-0"
          >
            <div className="flex items-center gap-2 min-w-0">
              <span className="text-sm text-neutral-800 leading-snug">
                {zman.name}
              </span>
              <button
                onClick={() => setActiveKey(zman.key)}
                aria-label={`Informação sobre ${zman.name}`}
                className="flex-shrink-0 flex h-5 w-5 items-center justify-center rounded-full border border-primary-200 bg-primary-50 text-primary-500 text-[10px] font-bold leading-none transition-colors hover:bg-primary-100 hover:border-primary-400 hover:text-primary-700 active:scale-95"
              >
                i
              </button>
            </div>
            <span className="font-mono text-sm font-semibold text-primary-700 tabular-nums flex-shrink-0">
              {zman.time}
            </span>
          </div>
        ))}
      </div>

      <p className="mt-4 text-center text-xs text-neutral-400">
        Horários para Criciúma, SC
      </p>

      {activeZman && (
        <ZmanimDialog
          zman={activeZman}
          onClose={() => setActiveKey(null)}
        />
      )}
    </section>
  )
}

function ZmanimDialog({
  zman,
  onClose,
}: {
  zman: ZmanItem
  onClose: () => void
}) {
  const closeRef = useRef<HTMLButtonElement>(null)

  const handleClose = useCallback(() => onClose(), [onClose])

  useEffect(() => {
    closeRef.current?.focus()

    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") handleClose()
    }
    document.addEventListener("keydown", handleKey)
    document.body.style.overflow = "hidden"
    return () => {
      document.removeEventListener("keydown", handleKey)
      document.body.style.overflow = ""
    }
  }, [handleClose])

  const paragraphs = zman.description.split("\n\n").filter(Boolean)

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center"
      role="dialog"
      aria-modal="true"
      aria-labelledby="zman-dialog-title"
    >
      <div
        className="fixed inset-0 bg-black/40 backdrop-blur-sm"
        onClick={handleClose}
        aria-hidden="true"
      />

      <div className="relative w-full sm:max-w-lg mx-0 sm:mx-4 bg-white rounded-t-3xl sm:rounded-2xl shadow-2xl max-h-[85vh] flex flex-col">
        <div className="flex items-start justify-between gap-4 px-5 pt-5 pb-4 border-b border-neutral-100">
          <div>
            <p id="zman-dialog-title" className="text-base font-bold text-primary-800">
              {zman.name}
            </p>
            <p className="mt-0.5 font-mono text-xl font-semibold text-primary-600 tabular-nums">
              {zman.time}
            </p>
          </div>
          <button
            ref={closeRef}
            onClick={handleClose}
            aria-label="Fechar"
            className="flex-shrink-0 flex h-8 w-8 items-center justify-center rounded-full bg-neutral-100 text-neutral-500 transition-colors hover:bg-neutral-200 hover:text-neutral-700"
          >
            ✕
          </button>
        </div>

        <div className="overflow-y-auto px-5 py-4 space-y-3">
          {paragraphs.map((p, i) => (
            <p key={i} className="text-sm leading-relaxed text-neutral-700">
              {p}
            </p>
          ))}
        </div>

        <div className="px-5 pb-5 pt-3 sm:hidden">
          <button
            onClick={handleClose}
            className="w-full min-h-[44px] rounded-xl bg-primary-700 px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-primary-600 active:bg-primary-800"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  )
}
