"use client"

import { useState, type FormEvent } from "react"
import { useRouter } from "next/navigation"
import type { Database } from "@/types/supabase"

type Event = Database["public"]["Tables"]["events"]["Row"]

type EventsTabProps = {
  events: Event[]
}

export function EventsTab({ events }: EventsTabProps) {
  const router = useRouter()
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [startDate, setStartDate] = useState("")
  const [endDate, setEndDate] = useState("")
  const [location, setLocation] = useState("")
  const [link, setLink] = useState("")
  const [loading, setLoading] = useState(false)

  function startEdit(event: Event) {
    setEditingId(event.id)
    setTitle(event.title)
    setDescription(event.description || "")
    setStartDate(event.start_date.split("T")[0])
    setEndDate(event.end_date ? event.end_date.split("T")[0] : "")
    setLocation(event.location || "")
    setLink(event.link || "")
    setShowForm(true)
  }

  function resetForm() {
    setShowForm(false)
    setEditingId(null)
    setTitle("")
    setDescription("")
    setStartDate("")
    setEndDate("")
    setLocation("")
    setLink("")
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await fetch("/api/admin/events", {
        method: editingId ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: editingId,
          title,
          description,
          startDate,
          endDate: endDate || null,
          location,
          link,
        }),
      })

      if (!response.ok) {
        throw new Error("Erro ao salvar evento")
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
    if (!confirm("Tem certeza que deseja excluir este evento?")) {
      return
    }

    setLoading(true)

    try {
      const response = await fetch("/api/admin/events", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      })

      if (!response.ok) {
        throw new Error("Erro ao excluir evento")
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
      <div className="bg-gold-50 rounded-xl border border-gold-200/60 p-4">
        <p className="text-sm text-ink-700">
          <strong>Nota:</strong> Os eventos serão lidos pelas páginas públicas do site.
          Campos: <code className="bg-gold-100 px-1 py-0.5 rounded text-xs">title</code>, <code className="bg-gold-100 px-1 py-0.5 rounded text-xs">description</code>, <code className="bg-gold-100 px-1 py-0.5 rounded text-xs">start_date</code>, <code className="bg-gold-100 px-1 py-0.5 rounded text-xs">end_date</code>, <code className="bg-gold-100 px-1 py-0.5 rounded text-xs">location</code>, <code className="bg-gold-100 px-1 py-0.5 rounded text-xs">link</code>.
        </p>
      </div>

      {!showForm && (
        <button
          onClick={() => setShowForm(true)}
          className="min-h-[48px] rounded-full bg-gold-500 px-6 py-3 font-semibold text-ink-900 transition-all hover:bg-gold-600"
        >
          + Novo evento
        </button>
      )}

      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="bg-cream-50 rounded-xl border border-gold-200/60 p-6"
        >
          <h3 className="font-display text-xl font-medium text-ink-900 mb-4">
            {editingId ? "Editar evento" : "Novo evento"}
          </h3>

          <div className="space-y-4">
            <div>
              <label htmlFor="event-title" className="block text-sm font-medium text-ink-900 mb-2">
                Título
              </label>
              <input
                id="event-title"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                className="w-full rounded-lg border border-gold-200 bg-white px-4 py-3 text-ink-900 focus:border-gold-500 focus:outline-none focus:ring-2 focus:ring-gold-500/20 transition-all"
              />
            </div>

            <div>
              <label htmlFor="event-description" className="block text-sm font-medium text-ink-900 mb-2">
                Descrição (opcional)
              </label>
              <textarea
                id="event-description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
                className="w-full rounded-lg border border-gold-200 bg-white px-4 py-3 text-ink-900 focus:border-gold-500 focus:outline-none focus:ring-2 focus:ring-gold-500/20 transition-all resize-y"
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="start-date" className="block text-sm font-medium text-ink-900 mb-2">
                  Data de início
                </label>
                <input
                  id="start-date"
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  required
                  className="w-full rounded-lg border border-gold-200 bg-white px-4 py-3 text-ink-900 focus:border-gold-500 focus:outline-none focus:ring-2 focus:ring-gold-500/20 transition-all"
                />
              </div>

              <div>
                <label htmlFor="end-date" className="block text-sm font-medium text-ink-900 mb-2">
                  Data de término (opcional)
                </label>
                <input
                  id="end-date"
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full rounded-lg border border-gold-200 bg-white px-4 py-3 text-ink-900 focus:border-gold-500 focus:outline-none focus:ring-2 focus:ring-gold-500/20 transition-all"
                />
              </div>
            </div>

            <div>
              <label htmlFor="event-location" className="block text-sm font-medium text-ink-900 mb-2">
                Local (opcional)
              </label>
              <input
                id="event-location"
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full rounded-lg border border-gold-200 bg-white px-4 py-3 text-ink-900 focus:border-gold-500 focus:outline-none focus:ring-2 focus:ring-gold-500/20 transition-all"
              />
            </div>

            <div>
              <label htmlFor="event-link" className="block text-sm font-medium text-ink-900 mb-2">
                Link (opcional)
              </label>
              <input
                id="event-link"
                type="url"
                value={link}
                onChange={(e) => setLink(e.target.value)}
                placeholder="https://..."
                className="w-full rounded-lg border border-gold-200 bg-white px-4 py-3 text-ink-900 focus:border-gold-500 focus:outline-none focus:ring-2 focus:ring-gold-500/20 transition-all"
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
        {events.map((event) => (
          <div
            key={event.id}
            className="bg-cream-50 rounded-xl border border-gold-200/60 p-6"
          >
            <h3 className="font-display text-xl font-medium text-ink-900 mb-2">
              {event.title}
            </h3>
            {event.description && (
              <p className="text-ink-700 leading-relaxed mb-3">{event.description}</p>
            )}
            <div className="flex flex-wrap gap-3 text-sm text-ink-600 mb-4">
              <span>
                📅 {new Date(event.start_date).toLocaleDateString("pt-BR")}
                {event.end_date &&
                  ` - ${new Date(event.end_date).toLocaleDateString("pt-BR")}`}
              </span>
              {event.location && <span>📍 {event.location}</span>}
            </div>
            {event.link && (
              <a
                href={event.link}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-sm text-gold-700 hover:text-gold-800 transition-colors mb-4"
              >
                Ver link →
              </a>
            )}
            <div className="flex gap-2">
              <button
                onClick={() => startEdit(event)}
                disabled={loading}
                className="min-h-[44px] rounded-lg border border-gold-500 bg-transparent px-4 py-2 text-sm font-medium text-gold-700 transition-all hover:bg-gold-50 disabled:opacity-50"
              >
                Editar
              </button>
              <button
                onClick={() => handleDelete(event.id)}
                disabled={loading}
                className="min-h-[44px] rounded-lg border border-wine-500 bg-transparent px-4 py-2 text-sm font-medium text-wine-700 transition-all hover:bg-wine-50 disabled:opacity-50"
              >
                Excluir
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
