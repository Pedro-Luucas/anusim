"use client"

import { useState, type FormEvent } from "react"
import { useRouter } from "next/navigation"
import type { Database } from "@/types/supabase"

type Profile = Database["public"]["Tables"]["profiles"]["Row"]

type ProfileFormProps = {
  profile: Profile
}

export function ProfileForm({ profile }: ProfileFormProps) {
  const router = useRouter()
  const [name, setName] = useState(profile.name || "")
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setLoading(true)
    setMessage(null)

    try {
      const response = await fetch("/api/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name }),
      })

      if (!response.ok) {
        throw new Error("Erro ao atualizar perfil")
      }

      setMessage({ type: "success", text: "Perfil atualizado com sucesso" })
      router.refresh()
    } catch (error) {
      setMessage({
        type: "error",
        text: error instanceof Error ? error.message : "Erro desconhecido",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-ink-700 mb-2">
          E-mail
        </label>
        <input
          id="email"
          type="email"
          value={profile.email}
          disabled
          className="w-full rounded-lg border border-gold-200 bg-cream-100 px-4 py-3 text-ink-600 cursor-not-allowed"
        />
      </div>

      <div>
        <label htmlFor="name" className="block text-sm font-medium text-ink-900 mb-2">
          Nome
        </label>
        <input
          id="name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full rounded-lg border border-gold-200 bg-white px-4 py-3 text-ink-900 focus:border-gold-500 focus:outline-none focus:ring-2 focus:ring-gold-500/20 transition-all"
          placeholder="Seu nome completo"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-ink-700 mb-2">
          Função
        </label>
        <div className="rounded-lg border border-gold-200 bg-cream-100 px-4 py-3">
          <span className="text-sm font-medium text-ink-900 capitalize">
            {profile.role}
          </span>
        </div>
      </div>

      {message && (
        <div
          className={`rounded-lg p-3 text-sm ${
            message.type === "success"
              ? "bg-green-50 border border-green-200 text-green-800"
              : "bg-wine-500/10 border border-wine-500/20 text-wine-700"
          }`}
        >
          {message.text}
        </div>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full min-h-[48px] rounded-full bg-gold-500 px-6 py-3 font-semibold text-ink-900 transition-all hover:bg-gold-600 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? "Salvando..." : "Salvar alterações"}
      </button>
    </form>
  )
}
