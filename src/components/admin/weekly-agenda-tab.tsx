"use client"

import { useState, type FormEvent } from "react"
import { useRouter } from "next/navigation"
import type { Database } from "@/types/supabase"

type WeeklyAgendaItem = Database["public"]["Tables"]["weekly_agenda"]["Row"]

type WeeklyAgendaTabProps = {
  items: WeeklyAgendaItem[]
}

const DAYS = ["segunda", "terça", "quarta", "quinta", "sexta", "sábado", "domingo"] as const

export function WeeklyAgendaTab({ items }: WeeklyAgendaTabProps) {
  const router = useRouter()
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [dayOfWeek, setDayOfWeek] = useState<typeof DAYS[number]>("segunda")
  const [time, setTime] = useState("")
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [link, setLink] = useState("")
  const [displayOrder, setDisplayOrder] = useState(0)
  const [loading, setLoading] = useState(false)

  function startEdit(item: WeeklyAgendaItem) {
    setEditingId(item.id)
    setDayOfWeek(item.day_of_week)
    setTime(item.time)
    setTitle(item.title)
    setDescription(item.description || "")
    setLink(item.link || "")
    setDisplayOrder(item.display_order)
    setShowForm(true)
  }

  function resetForm() {
    setShowForm(false)
    setEditingId(null)
    setDayOfWeek("segunda")
    setTime("")
    setTitle("")
    setDescription("")
    setLink("")
    setDisplayOrder(0)
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await fetch("/api/admin/weekly-agenda", {
        method: editingId ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: editingId,
          dayOfWeek,
          time,
          title,
          description,
          link,
          displayOrder,
        }),
      })

      if (!response.ok) {
        throw new Error("Erro ao salvar item da agenda")
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
    if (!confirm("Tem certeza que deseja excluir este item?")) {
      return
    }

    setLoading(true)

    try {
      const response = await fetch("/api/admin/weekly-agenda", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      })

      if (!response.ok) {
        throw new Error("Erro ao excluir item")
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
          <strong>Nota:</strong> A agenda semanal será lida pelas páginas públicas do site.
          Campos: <code className="bg-gold-100 px-1 py-0.5 rounded text-xs">day_of_week</code>, <code className="bg-gold-100 px-1 py-0.5 rounded text-xs">time</code>, <code className="bg-gold-100 px-1 py-0.5 rounded text-xs">title</code>, <code className="bg-gold-100 px-1 py-0.5 rounded text-xs">description</code>, <code className="bg-gold-100 px-1 py-0.5 rounded text-xs">link</code>.
        </p>
      </div>

      {!showForm && (
        <button
          onClick={() => setShowForm(true)}
          className="min-h-[48px] rounded-full bg-gold-500 px-6 py-3 font-semibold text-ink-900 transition-all hover:bg-gold-600"
        >
          + Novo item
        </button>
      )}

      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="bg-cream-50 rounded-xl border border-gold-200/60 p-6"
        >
          <h3 className="font-display text-xl font-medium text-ink-900 mb-4">
            {editingId ? "Editar item" : "Novo item"}
          </h3>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="day" className="block text-sm font-medium text-ink-900 mb-2">
                Dia da semana
              </label>
              <select
                id="day"
                value={dayOfWeek}
                onChange={(e) => setDayOfWeek(e.target.value as typeof DAYS[number])}
                className="w-full rounded-lg border border-gold-200 bg-white px-4 py-3 text-ink-900 focus:border-gold-500 focus:outline-none focus:ring-2 focus:ring-gold-500/20 transition-all"
              >
                {DAYS.map((day) => (
                  <option key={day} value={day}>
                    {day.charAt(0).toUpperCase() + day.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="time" className="block text-sm font-medium text-ink-900 mb-2">
                Horário
              </label>
              <input
                id="time"
                type="text"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                required
                placeholder="19:00"
                className="w-full rounded-lg border border-gold-200 bg-white px-4 py-3 text-ink-900 focus:border-gold-500 focus:outline-none focus:ring-2 focus:ring-gold-500/20 transition-all"
              />
            </div>

            <div className="sm:col-span-2">
              <label htmlFor="agenda-title" className="block text-sm font-medium text-ink-900 mb-2">
                Título
              </label>
              <input
                id="agenda-title"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                className="w-full rounded-lg border border-gold-200 bg-white px-4 py-3 text-ink-900 focus:border-gold-500 focus:outline-none focus:ring-2 focus:ring-gold-500/20 transition-all"
              />
            </div>

            <div className="sm:col-span-2">
              <label htmlFor="agenda-description" className="block text-sm font-medium text-ink-900 mb-2">
                Descrição (opcional)
              </label>
              <textarea
                id="agenda-description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                className="w-full rounded-lg border border-gold-200 bg-white px-4 py-3 text-ink-900 focus:border-gold-500 focus:outline-none focus:ring-2 focus:ring-gold-500/20 transition-all resize-y"
              />
            </div>

            <div>
              <label htmlFor="agenda-link" className="block text-sm font-medium text-ink-900 mb-2">
                Link (opcional)
              </label>
              <input
                id="agenda-link"
                type="url"
                value={link}
                onChange={(e) => setLink(e.target.value)}
                placeholder="https://..."
                className="w-full rounded-lg border border-gold-200 bg-white px-4 py-3 text-ink-900 focus:border-gold-500 focus:outline-none focus:ring-2 focus:ring-gold-500/20 transition-all"
              />
            </div>

            <div>
              <label htmlFor="order" className="block text-sm font-medium text-ink-900 mb-2">
                Ordem de exibição
              </label>
              <input
                id="order"
                type="number"
                value={displayOrder}
                onChange={(e) => setDisplayOrder(Number(e.target.value))}
                className="w-full rounded-lg border border-gold-200 bg-white px-4 py-3 text-ink-900 focus:border-gold-500 focus:outline-none focus:ring-2 focus:ring-gold-500/20 transition-all"
              />
            </div>
          </div>

          <div className="flex gap-3 mt-6">
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
        </form>
      )}

      <div className="space-y-3">
        {items.map((item) => (
          <div
            key={item.id}
            className="bg-cream-50 rounded-xl border border-gold-200/60 p-5"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <span className="inline-flex rounded-full bg-gold-100 px-3 py-1 text-xs font-medium text-gold-800 capitalize">
                    {item.day_of_week}
                  </span>
                  <span className="text-sm font-medium text-ink-700">{item.time}</span>
                </div>
                <h3 className="font-medium text-ink-900 mb-1">{item.title}</h3>
                {item.description && (
                  <p className="text-sm text-ink-600">{item.description}</p>
                )}
                {item.link && (
                  <a
                    href={item.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-2 inline-flex items-center gap-1 text-sm text-gold-700 hover:text-gold-800 transition-colors"
                  >
                    Ver link →
                  </a>
                )}
              </div>
              <div className="flex flex-col gap-2">
                <button
                  onClick={() => startEdit(item)}
                  disabled={loading}
                  className="min-h-[44px] min-w-[80px] rounded-lg border border-gold-500 bg-transparent px-4 py-2 text-sm font-medium text-gold-700 transition-all hover:bg-gold-50 disabled:opacity-50"
                >
                  Editar
                </button>
                <button
                  onClick={() => handleDelete(item.id)}
                  disabled={loading}
                  className="min-h-[44px] min-w-[80px] rounded-lg border border-wine-500 bg-transparent px-4 py-2 text-sm font-medium text-wine-700 transition-all hover:bg-wine-50 disabled:opacity-50"
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
