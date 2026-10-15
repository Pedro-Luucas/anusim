"use client"

import { NumberTicker } from "@/components/ui/number-ticker"

const STATS = [
  { value: 500, suffix: "+", label: "Anos de história silenciosa" },
  { value: 12, suffix: "+", label: "Famílias fundadoras em Criciúma" },
] as const

export function HomeStats() {
  return (
    <section className="border-y border-gold-200/70 bg-cream-50">
      <div className="mx-auto grid max-w-7xl grid-cols-2 divide-x divide-gold-200/70 md:grid-cols-4">
        {STATS.map((stat) => (
          <div key={stat.label} className="px-5 py-8 text-center md:py-10">
            <p className="font-display text-2xl font-medium text-gold-700 md:text-3xl">
              <NumberTicker value={stat.value} />
              {stat.suffix}
            </p>
            <p className="mt-1 text-xs uppercase tracking-[0.22em] text-ink-500">
              {stat.label}
            </p>
          </div>
        ))}
        <div className="px-5 py-8 text-center md:py-10">
          <p className="font-display text-2xl font-medium text-gold-700 md:text-3xl">
            R. Joaquim Nabuco, 140
          </p>
          <p className="mt-1 text-xs uppercase tracking-[0.22em] text-ink-500">
            Centro · Criciúma · SC
          </p>
        </div>
        <div className="px-5 py-8 text-center md:py-10">
          <p className="font-display text-2xl font-medium text-gold-700 md:text-3xl">
            Ao vivo
          </p>
          <p className="mt-1 text-xs uppercase tracking-[0.22em] text-ink-500">
            Serviços toda semana
          </p>
        </div>
      </div>
    </section>
  )
}
