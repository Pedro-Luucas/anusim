"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import type { Database } from "@/types/supabase"

type Profile = Database["public"]["Tables"]["profiles"]["Row"]

type MembersTabProps = {
  profiles: Profile[]
}

export function MembersTab({ profiles }: MembersTabProps) {
  const router = useRouter()
  const [loading, setLoading] = useState<string | null>(null)

  async function toggleRole(profileId: string, currentRole: string) {
    if (!confirm("Tem certeza que deseja alterar a função deste membro?")) {
      return
    }

    setLoading(profileId)
    const newRole = currentRole === "admin" ? "membro" : "admin"

    try {
      const response = await fetch("/api/admin/members", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ profileId, role: newRole }),
      })

      if (!response.ok) {
        throw new Error("Erro ao atualizar função")
      }

      router.refresh()
    } catch (error) {
      alert(error instanceof Error ? error.message : "Erro desconhecido")
    } finally {
      setLoading(null)
    }
  }

  return (
    <div className="bg-cream-50 rounded-xl border border-gold-200/60 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gold-50 border-b border-gold-200/60">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gold-800">
                Nome
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gold-800">
                E-mail
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gold-800">
                Função
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gold-800">
                Cadastro
              </th>
              <th className="px-6 py-3 text-right text-xs font-semibold uppercase tracking-wider text-gold-800">
                Ações
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gold-200/40">
            {profiles.map((profile) => (
              <tr key={profile.id} className="hover:bg-gold-50/30 transition-colors">
                <td className="px-6 py-4 text-sm font-medium text-ink-900">
                  {profile.name || "-"}
                </td>
                <td className="px-6 py-4 text-sm text-ink-700">{profile.email}</td>
                <td className="px-6 py-4">
                  <span
                    className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${
                      profile.role === "admin"
                        ? "bg-wine-500/20 text-wine-700"
                        : "bg-gold-100 text-gold-800"
                    }`}
                  >
                    {profile.role}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-ink-600">
                  {new Date(profile.created_at).toLocaleDateString("pt-BR")}
                </td>
                <td className="px-6 py-4 text-right">
                  <button
                    onClick={() => toggleRole(profile.id, profile.role)}
                    disabled={loading === profile.id}
                    className="min-h-[44px] rounded-lg border border-gold-500 bg-transparent px-4 py-2 text-sm font-medium text-gold-700 transition-all hover:bg-gold-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading === profile.id
                      ? "..."
                      : profile.role === "admin"
                        ? "Tornar membro"
                        : "Tornar admin"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
