"use client"

import { useState, type FormEvent } from "react"
import { useRouter } from "next/navigation"
import type { Database } from "@/types/supabase"

type Announcement = Database["public"]["Tables"]["announcements"]["Row"]

type AnnouncementsTabProps = {
  announcements: Announcement[]
}

export function AnnouncementsTab({ announcements }: AnnouncementsTabProps) {
  const router = useRouter()
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [loading, setLoading] = useState(false)

  function startEdit(announcement: Announcement) {
    setEditingId(announcement.id)
    setTitle(announcement.title)
    setContent(announcement.content)
    setShowForm(true)
  }

  function resetForm() {
    setShowForm(false)
    setEditingId(null)
    setTitle("")
    setContent("")
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await fetch("/api/admin/announcements", {
        method: editingId ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: editingId,
          title,
          content,
        }),
      })

      if (!response.ok) {
        throw new Error("Erro ao salvar aviso")
      }

      resetForm()
      router.refresh()
    } catch (error) {
      alert(error instanceof Error ? error.message : "Erro desconhecido")
    } finally {
      setLoading(false)
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Tem certeza que deseja excluir este aviso?")) {
      return
    }

    setLoading(true)

    try {
      const response = await fetch("/api/admin/announcements", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      })

      if (!response.ok) {
        throw new Error("Erro ao excluir aviso")
      }

      router.refresh()
    } catch (error) {
      alert(error instanceof Error ? error.message : "Erro desconhecido")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      {!showForm && (
        <button
          onClick={() => setShowForm(true)}
          className="min-h-[48px] rounded-full bg-gold-500 px-6 py-3 font-semibold text-ink-900 transition-all hover:bg-gold-600"
        >
          + Novo aviso
        </button>
      )}

      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="bg-cream-50 rounded-xl border border-gold-200/60 p-6"
        >
          <h3 className="font-display text-xl font-medium text-ink-900 mb-4">
            {editingId ? "Editar aviso" : "Novo aviso"}
          </h3>

          <div className="space-y-4">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-ink-900 mb-2">
                Título
              </label>
              <input
                id="title"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                className="w-full rounded-lg border border-gold-200 bg-white px-4 py-3 text-ink-900 focus:border-gold-500 focus:outline-none focus:ring-2 focus:ring-gold-500/20 transition-all"
              />
            </div>

            <div>
              <label htmlFor="content" className="block text-sm font-medium text-ink-900 mb-2">
                Conteúdo
              </label>
              <textarea
                id="content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                required
                rows={6}
                className="w-full rounded-lg border border-gold-200 bg-white px-4 py-3 text-ink-900 focus:border-gold-500 focus:outline-none focus:ring-2 focus:ring-gold-500/20 transition-all resize-y"
              />
            </div>

            <div className="flex gap-3">
              <button
                type="submit"
                disabled={loading}
                className="min-h-[48px] rounded-full bg-gold-500 px-6 py-3 font-semibold text-ink-900 transition-all hover:bg-gold-600 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Salvando..." : "Salvar"}
              </button>
              <button
                type="button"
                onClick={resetForm}
                disabled={loading}
                className="min-h-[48px] rounded-full border border-gold-500 bg-transparent px-6 py-3 font-semibold text-gold-700 transition-all hover:bg-gold-50 disabled:opacity-50"
              >
                Cancelar
              </button>
            </div>
          </div>
        </form>
      )}

      <div className="space-y-4">
        {announcements.map((announcement) => (
          <div
            key={announcement.id}
            className="bg-cream-50 rounded-xl border border-gold-200/60 p-6"
          >
            <h3 className="font-display text-xl font-medium text-ink-900 mb-2">
              {announcement.title}
            </h3>
            <p className="text-ink-700 leading-relaxed whitespace-pre-wrap mb-4">
              {announcement.content}
            </p>
            <div className="flex items-center justify-between">
              <time className="text-sm text-ink-500">
                {new Date(announcement.created_at).toLocaleDateString("pt-BR", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </time>
              <div className="flex gap-2">
                <button
                  onClick={() => startEdit(announcement)}
                  disabled={loading}
                  className="min-h-[44px] rounded-lg border border-gold-500 bg-transparent px-4 py-2 text-sm font-medium text-gold-700 transition-all hover:bg-gold-50 disabled:opacity-50"
                >
                  Editar
                </button>
                <button
                  onClick={() => handleDelete(announcement.id)}
                  disabled={loading}
                  className="min-h-[44px] rounded-lg border border-wine-500 bg-transparent px-4 py-2 text-sm font-medium text-wine-700 transition-all hover:bg-wine-50 disabled:opacity-50"
                >
                  Excluir
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
