"use client"

import { useState, type FormEvent } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { createClient } from "@/lib/supabase/client"

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [magicLinkSent, setMagicLinkSent] = useState(false)
  const [mode, setMode] = useState<"password" | "magic">("password")

  const supabase = createClient()

  if (!supabase) {
    return (
      <div className="min-h-screen bg-parchment flex items-center justify-center px-4">
        <div className="w-full max-w-md">
          <div className="bg-cream-50 rounded-2xl border border-gold-200/60 p-8 shadow-lg">
            <div className="text-center">
              <h1 className="font-display text-3xl font-medium text-ink-900 mb-4">
                Sistema não configurado
              </h1>
              <p className="text-ink-700 leading-relaxed mb-6">
                O sistema de membros ainda não foi configurado pelo administrador.
                Entre em contato através do WhatsApp para mais informações.
              </p>
              <Link
                href="/"
                className="inline-flex items-center justify-center rounded-full bg-gold-500 px-6 py-3 text-sm font-semibold text-ink-900 transition-all hover:bg-gold-600"
              >
                Voltar ao início
              </Link>
            </div>
          </div>
        </div>
      </div>
    )
  }

  async function handlePasswordLogin(e: FormEvent) {
    e.preventDefault()
    if (!supabase) return
    
    setError(null)
    setLoading(true)

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      setError(error.message)
      setLoading(false)
    } else {
      router.push("/membro")
      router.refresh()
    }
  }

  async function handleMagicLink(e: FormEvent) {
    e.preventDefault()
    if (!supabase) return
    
    setError(null)
    setLoading(true)

    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    })

    if (error) {
      setError(error.message)
      setLoading(false)
    } else {
      setMagicLinkSent(true)
      setLoading(false)
    }
  }

  if (magicLinkSent) {
    return (
      <div className="min-h-screen bg-parchment flex items-center justify-center px-4">
        <div className="w-full max-w-md">
          <div className="bg-cream-50 rounded-2xl border border-gold-200/60 p-8 shadow-lg">
            <div className="text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gold-100">
                <svg
                  className="h-8 w-8 text-gold-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <h1 className="font-display text-2xl font-medium text-ink-900 mb-3">
                Confira seu e-mail
              </h1>
              <p className="text-ink-700 leading-relaxed mb-6">
                Enviamos um link mágico para <strong>{email}</strong>. Clique no
                link para entrar.
              </p>
              <button
                onClick={() => {
                  setMagicLinkSent(false)
                  setEmail("")
                }}
                className="text-sm font-medium text-gold-700 hover:text-gold-800 transition-colors"
              >
                Voltar
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-parchment flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="font-display text-4xl font-medium text-ink-900 mb-2">
            Área de Membros
          </h1>
          <p className="text-ink-600">
            Sinagoga Anussim Brasil — Criciúma
          </p>
        </div>

        <div className="bg-cream-50 rounded-2xl border border-gold-200/60 p-8 shadow-lg">
          <div className="flex gap-2 mb-6 bg-cream-100 rounded-lg p-1">
            <button
              onClick={() => setMode("password")}
              className={`flex-1 rounded-md py-2 px-4 text-sm font-medium transition-all ${
                mode === "password"
                  ? "bg-gold-500 text-ink-900 shadow-sm"
                  : "text-ink-600 hover:text-ink-900"
              }`}
            >
              Com senha
            </button>
            <button
              onClick={() => setMode("magic")}
              className={`flex-1 rounded-md py-2 px-4 text-sm font-medium transition-all ${
                mode === "magic"
                  ? "bg-gold-500 text-ink-900 shadow-sm"
                  : "text-ink-600 hover:text-ink-900"
              }`}
            >
              Link mágico
            </button>
          </div>

          {error && (
            <div className="mb-6 rounded-lg bg-wine-500/10 border border-wine-500/20 p-4">
              <p className="text-sm text-wine-700">{error}</p>
            </div>
          )}

          <form onSubmit={mode === "password" ? handlePasswordLogin : handleMagicLink}>
            <div className="mb-5">
              <label
                htmlFor="email"
                className="block text-sm font-medium text-ink-900 mb-2"
              >
                E-mail
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full rounded-lg border border-gold-200 bg-white px-4 py-3 text-ink-900 placeholder:text-ink-400 focus:border-gold-500 focus:outline-none focus:ring-2 focus:ring-gold-500/20 transition-all"
                placeholder="seu@email.com"
              />
            </div>

            {mode === "password" && (
              <div className="mb-6">
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-ink-900 mb-2"
                >
                  Senha
                </label>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full rounded-lg border border-gold-200 bg-white px-4 py-3 text-ink-900 placeholder:text-ink-400 focus:border-gold-500 focus:outline-none focus:ring-2 focus:ring-gold-500/20 transition-all"
                  placeholder="••••••••"
                />
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full min-h-[48px] rounded-full bg-gold-500 px-6 py-3 font-semibold text-ink-900 shadow-[0_4px_18px_-4px_rgba(201,162,83,0.55)] transition-all hover:bg-gold-600 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Entrando..." : mode === "password" ? "Entrar" : "Enviar link"}
            </button>
          </form>

          <div className="mt-6 text-center">
            <Link
              href="/"
              className="text-sm font-medium text-gold-700 hover:text-gold-800 transition-colors"
            >
              ← Voltar ao site
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
