"use client"

import type { Database } from "@/types/supabase"

type Material = Database["public"]["Tables"]["materials"]["Row"]

type MaterialsListProps = {
  materials: Material[]
}

export function MaterialsList({ materials }: MaterialsListProps) {
  if (materials.length === 0) {
    return (
      <div className="bg-cream-50 rounded-xl border border-gold-200/60 p-8 text-center">
        <p className="text-ink-600">Nenhum material disponível ainda.</p>
      </div>
    )
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {materials.map((material) => (
        <a
          key={material.id}
          href={material.url}
          target="_blank"
          rel="noopener noreferrer"
          className="group bg-cream-50 rounded-xl border border-gold-200/60 p-5 hover:border-gold-400 hover:shadow-md transition-all"
        >
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 mt-0.5">
              {material.type === "link" ? (
                <svg
                  className="h-5 w-5 text-gold-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
                  />
                </svg>
              ) : (
                <svg
                  className="h-5 w-5 text-gold-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                  />
                </svg>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-medium text-ink-900 group-hover:text-gold-700 transition-colors">
                {material.title}
              </h3>
              {material.description && (
                <p className="mt-1 text-sm text-ink-600 line-clamp-2">
                  {material.description}
                </p>
              )}
            </div>
            <svg
              className="h-4 w-4 text-gold-500 flex-shrink-0 mt-1 group-hover:translate-x-0.5 transition-transform"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
              />
            </svg>
          </div>
        </a>
      ))}
    </div>
  )
}
