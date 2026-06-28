// Judaic sigils drawn inline as SVG. Used as decorative ornaments across the site.

export function StarOfDavid({ className = "", strokeWidth = 1.2 }: { className?: string; strokeWidth?: number }) {
  return (
    <svg viewBox="0 0 100 100" className={className} aria-hidden="true">
      <g fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinejoin="round">
        <polygon points="50,8 92,72 8,72" />
        <polygon points="50,92 8,28 92,28" />
      </g>
    </svg>
  )
}

export function Menorah({ className = "", strokeWidth = 1.4 }: { className?: string; strokeWidth?: number }) {
  return (
    <svg viewBox="0 0 120 80" className={className} aria-hidden="true">
      <g fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
        {/* base */}
        <path d="M30 70 Q60 78 90 70" />
        <line x1="55" y1="74" x2="65" y2="74" />
        {/* central shaft */}
        <line x1="60" y1="74" x2="60" y2="22" />
        <circle cx="60" cy="14" r="3" />
        {/* arms */}
        {[15, 30, 45, 75, 90, 105].map((x, i) => {
          const y = i < 3 ? 30 + i * 4 : 30 + (5 - i) * 4
          return (
            <g key={x}>
              <line x1="60" y1="30" x2={x} y2={y} />
              <circle cx={x} cy={y - 5} r="2.5" />
            </g>
          )
        })}
      </g>
    </svg>
  )
}

export function Shofar({ className = "", strokeWidth = 1.4 }: { className?: string; strokeWidth?: number }) {
  return (
    <svg viewBox="0 0 120 80" className={className} aria-hidden="true">
      <g fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
        <path d="M10 60 Q15 40 35 38 Q55 36 70 28 Q85 20 100 18 Q110 17 112 22 Q114 28 105 32 Q90 38 75 44 Q60 50 45 54 Q30 58 18 62 Q12 64 10 60 Z" />
        <line x1="35" y1="38" x2="35" y2="58" />
      </g>
    </svg>
  )
}

export function Pomegranate({ className = "", strokeWidth = 1.2 }: { className?: string; strokeWidth?: number }) {
  return (
    <svg viewBox="0 0 80 80" className={className} aria-hidden="true">
      <g fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinejoin="round">
        <path d="M40 16 Q22 22 20 44 Q22 64 40 68 Q58 64 60 44 Q58 22 40 16 Z" />
        <path d="M40 16 L36 10 L44 10 Z" />
        <circle cx="32" cy="42" r="1.5" fill="currentColor" />
        <circle cx="40" cy="38" r="1.5" fill="currentColor" />
        <circle cx="48" cy="42" r="1.5" fill="currentColor" />
        <circle cx="36" cy="50" r="1.5" fill="currentColor" />
        <circle cx="44" cy="50" r="1.5" fill="currentColor" />
        <circle cx="40" cy="56" r="1.5" fill="currentColor" />
      </g>
    </svg>
  )
}

export function ScrollSeal({ className = "", strokeWidth = 1.2 }: { className?: string; strokeWidth?: number }) {
  return (
    <svg viewBox="0 0 100 100" className={className} aria-hidden="true">
      <g fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinejoin="round" strokeLinecap="round">
        <rect x="18" y="22" width="64" height="56" rx="3" />
        <line x1="28" y1="34" x2="72" y2="34" />
        <line x1="28" y1="44" x2="72" y2="44" />
        <line x1="28" y1="54" x2="72" y2="54" />
        <line x1="28" y1="64" x2="58" y2="64" />
        <circle cx="80" cy="22" r="6" />
      </g>
    </svg>
  )
}

// Composed ornament: line — symbol — line, used as section eyebrow
export function OrnametalDivider({ symbol = "star" }: { symbol?: "star" | "menorah" | "pomegranate" | "shofar" | "scroll" }) {
  const Svg =
    symbol === "star" ? StarOfDavid :
    symbol === "menorah" ? Menorah :
    symbol === "pomegranate" ? Pomegranate :
    symbol === "shofar" ? Shofar :
    ScrollSeal
  return (
    <div className="flex items-center justify-center gap-4 text-gold-500">
      <span className="h-px w-16 md:w-28 bg-gradient-to-r from-transparent to-gold-500" />
      <Svg className="h-6 w-6 md:h-7 md:w-7" />
      <span className="h-px w-16 md:w-28 bg-gradient-to-l from-transparent to-gold-500" />
    </div>
  )
}