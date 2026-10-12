"use client"

import type { Database } from "@/types/supabase"

type Announcement = Database["public"]["Tables"]["announcements"]["Row"]

type AnnouncementsListProps = {
  announcements: Announcement[]
}

export function AnnouncementsList({ announcements }: AnnouncementsListProps) {
  if (announcements.length === 0) {
    return (
      <div className="bg-cream-50 rounded-xl border border-gold-200/60 p-8 text-center">
        <p className="text-ink-600">Nenhum aviso publicado ainda.</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {announcements.map((announcement) => (
        <article
          key={announcement.id}
          className="bg-cream-50 rounded-xl border border-gold-200/60 p-6 hover:border-gold-300 transition-colors"
        >
          <h3 className="font-display text-xl font-medium text-ink-900 mb-2">
            {announcement.title}
          </h3>
          <p className="text-ink-700 leading-relaxed whitespace-pre-wrap">
            {announcement.content}
          </p>
          <time className="block mt-4 text-sm text-ink-500">
            {new Date(announcement.created_at).toLocaleDateString("pt-BR", {
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          </time>
        </article>
      ))}
    </div>
  )
}
