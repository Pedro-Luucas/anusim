"use client"

type VerifiedCitation = {
  ref: string
  heRef?: string
  url: string
  versionTitle: string
  license?: string
  excerpt: string
  heExcerpt?: string
}

type CitationCardProps = {
  citation: VerifiedCitation
}

export function CitationCard({ citation }: CitationCardProps) {
  return (
    <div className="rounded-lg border border-gold-300/30 bg-cream-50 p-4 shadow-sm">
      <div className="mb-2 flex items-start justify-between">
        <h4 className="font-display text-base font-semibold text-ink-900">
          {citation.ref}
        </h4>
        <a
          href={citation.url}
          target="_blank"
          rel="noopener noreferrer"
          className="ml-2 shrink-0 text-xs font-medium text-gold-600 hover:text-gold-700 hover:underline"
        >
          Abrir no Sefaria →
        </a>
      </div>

      {citation.heExcerpt && (
        <p
          dir="rtl"
          className="font-hebrew mb-2 text-sm leading-relaxed text-ink-700"
        >
          {citation.heExcerpt}
        </p>
      )}

      <p className="mb-3 text-sm leading-relaxed text-ink-700">
        {citation.excerpt}
      </p>

      <div className="flex items-center justify-between text-xs text-ink-500">
        <span>{citation.versionTitle}</span>
        {citation.license && <span className="opacity-70">{citation.license}</span>}
      </div>
    </div>
  )
}
