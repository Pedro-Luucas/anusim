"use client"

import Link from "next/link"
import { useState } from "react"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)

    if (!email || !password) {
      setError("Preencha todos os campos.")
      return
    }

    setLoading(true)
    // TODO: integrate with Supabase Auth
    await new Promise((resolve) => setTimeout(resolve, 1000))
    setError("Autenticação ainda não configurada. Em breve!")
    setLoading(false)
  }

  return (
    <div className="flex min-h-screen flex-col bg-[#f8fafc]">
      <header className="border-b border-primary-100 bg-white">
        <div className="mx-auto flex max-w-2xl items-center px-4 py-3">
          <Link
            href="/"
            className="flex items-center gap-2 text-sm font-medium text-primary-600 hover:text-primary-700 transition-colors min-h-[44px]"
          >
            <span aria-hidden="true">&larr;</span>
            Voltar
          </Link>
        </div>
      </header>

      <main className="flex flex-1 items-start justify-center px-4 pt-12 sm:pt-20">
        <div className="w-full max-w-sm">
          <div className="text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-primary-700 text-xl font-bold text-white shadow-lg">
              א
            </div>
            <h1 className="mt-4 text-2xl font-bold text-primary-800">
              Entrar
            </h1>
            <p className="mt-1 text-sm text-neutral-500">
              Acesse sua conta da comunidade
            </p>
          </div>

          <form onSubmit={handleSubmit} className="mt-8 space-y-4">
            {error && (
              <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {error}
              </div>
            )}

            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-neutral-700"
              >
                E-mail
              </label>
              <input
                id="email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="seu@email.com"
                className="mt-1 block w-full rounded-lg border border-neutral-300 bg-white px-4 py-3 text-sm text-neutral-900 placeholder-neutral-400 shadow-sm transition-colors focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 focus:outline-none"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-neutral-700"
              >
                Senha
              </label>
              <input
                id="password"
                type="password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="mt-1 block w-full rounded-lg border border-neutral-300 bg-white px-4 py-3 text-sm text-neutral-900 placeholder-neutral-400 shadow-sm transition-colors focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 focus:outline-none"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="min-h-[44px] w-full rounded-lg bg-primary-700 px-4 py-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-primary-600 active:bg-primary-800 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "Entrando..." : "Entrar"}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-neutral-500">
            Ainda não tem conta?{" "}
            <span className="font-medium text-primary-600 cursor-default">
              Cadastrar-se
            </span>
          </p>
        </div>
      </main>
    </div>
  )
}
