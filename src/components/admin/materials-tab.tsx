"use client"

import { useState, type FormEvent } from "react"
import { useRouter } from "next/navigation"
import type { Database } from "@/types/supabase"

type Material = Database["public"]["Tables"]["materials"]["Row"]

type MaterialsTabProps = {
  materials: Material[]
}

export function MaterialsTab({ materials }: MaterialsTabProps) {
  const router = useRouter()
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [url, setUrl] = useState("")
  const [type, setType] = useState<"link" | "file">("link")
  const [loading, setLoading] = useState(false)

  function startEdit(material: Material) {
    setEditingId(material.id)
    setTitle(material.title)
    setDescription(material.description || "")
    setUrl(material.url)
    setType(material.type)
    setShowForm(true)
  }

  function resetForm() {
    setShowForm(false)
    setEditingId(null)
    setTitle("")
    setDescription("")
    setUrl("")
    setType("link")
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await fetch("/api/admin/materials", {
        method: editingId ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: editingId,
          title,
          description,
          url,
          type,
        }),
      })

      if (!response.ok) {
        throw new Error("Erro ao salvar material")
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
    if (!confirm("Tem certeza que deseja excluir este material?")) {
      return
    }

    setLoading(true)

    try {
      const response = await fetch("/api/admin/materials", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      })

      if (!response.ok) {
        throw new Error("Erro ao excluir material")
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
          + Novo material
        </button>
      )}

      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="bg-cream-50 rounded-xl border border-gold-200/60 p-6"
        >
          <h3 className="font-display text-xl font-medium text-ink-900 mb-4">
            {editingId ? "Editar material" : "Novo material"}
          </h3>

          <div className="space-y-4">
            <div>
              <label htmlFor="material-title" className="block text-sm font-medium text-ink-900 mb-2">
                Título
              </label>
              <input
                id="material-title"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                className="w-full rounded-lg border border-gold-200 bg-white px-4 py-3 text-ink-900 focus:border-gold-500 focus:outline-none focus:ring-2 focus:ring-gold-500/20 transition-all"
              />
            </div>

            <div>
              <label htmlFor="material-description" className="block text-sm font-medium text-ink-900 mb-2">
                Descrição (opcional)
              </label>
              <textarea
                id="material-description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                className="w-full rounded-lg border border-gold-200 bg-white px-4 py-3 text-ink-900 focus:border-gold-500 focus:outline-none focus:ring-2 focus:ring-gold-500/20 transition-all resize-y"
              />
            </div>

            <div>
              <label htmlFor="material-type" className="block text-sm font-medium text-ink-900 mb-2">
                Tipo
              </label>
              <select
                id="material-type"
                value={type}
                onChange={(e) => setType(e.target.value as "link" | "file")}
                className="w-full rounded-lg border border-gold-200 bg-white px-4 py-3 text-ink-900 focus:border-gold-500 focus:outline-none focus:ring-2 focus:ring-gold-500/20 transition-all"
              >
                <option value="link">Link externo</option>
                <option value="file">Arquivo</option>
              </select>
            </div>

            <div>
              <label htmlFor="material-url" className="block text-sm font-medium text-ink-900 mb-2">
                URL
              </label>
              <input
                id="material-url"
                type="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                required
                className="w-full rounded-lg border border-gold-200 bg-white px-4 py-3 text-ink-900 focus:border-gold-500 focus:outline-none focus:ring-2 focus:ring-gold-500/20 transition-all"
                placeholder="https://..."
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

      <div className="grid gap-4 sm:grid-cols-2">
        {materials.map((material) => (
          <div
            key={material.id}
            className="bg-cream-50 rounded-xl border border-gold-200/60 p-5"
          >
            <div className="mb-4">
              <h3 className="font-medium text-ink-900 mb-1">{material.title}</h3>
              {material.description && (
                <p className="text-sm text-ink-600">{material.description}</p>
              )}
              <a
                href={material.url}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-2 inline-flex items-center gap-1 text-sm text-gold-700 hover:text-gold-800 transition-colors"
              >
                {material.type === "link" ? "Ver link" : "Ver arquivo"} →
              </a>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => startEdit(material)}
                disabled={loading}
                className="flex-1 min-h-[44px] rounded-lg border border-gold-500 bg-transparent px-4 py-2 text-sm font-medium text-gold-700 transition-all hover:bg-gold-50 disabled:opacity-50"
              >
                Editar
              </button>
              <button
                onClick={() => handleDelete(material.id)}
                disabled={loading}
                className="flex-1 min-h-[44px] rounded-lg border border-wine-500 bg-transparent px-4 py-2 text-sm font-medium text-wine-700 transition-all hover:bg-wine-50 disabled:opacity-50"
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
