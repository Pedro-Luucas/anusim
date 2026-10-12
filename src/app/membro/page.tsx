import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import type { Database } from "@/types/supabase"
import Link from "next/link"
import { ProfileForm } from "@/components/member/profile-form"
import { AnnouncementsList } from "@/components/member/announcements-list"
import { MaterialsList } from "@/components/member/materials-list"
import { LogoutButton } from "@/components/member/logout-button"
import { SiteHeader } from "@/components/landing/site-header"
import { SiteFooter } from "@/components/landing/site-footer"

type Profile = Database["public"]["Tables"]["profiles"]["Row"]

export default async function MembroPage() {
  const supabase = await createClient()

  if (!supabase) {
    return (
      <>
        <SiteHeader />
        <div className="min-h-screen bg-parchment flex items-center justify-center px-4 pt-24">
          <div className="w-full max-w-md">
            <div className="bg-cream-50 rounded-2xl border border-gold-200/60 p-8 shadow-lg">
              <div className="text-center">
                <h1 className="font-display text-3xl font-medium text-ink-900 mb-4">
                  Sistema não configurado
                </h1>
                <p className="text-ink-700 leading-relaxed mb-6">
                  O sistema de membros ainda não foi configurado.
                </p>
                <Link
                  href="/"
                  className="inline-flex min-h-[48px] items-center justify-center rounded-full bg-gold-500 px-6 py-3 text-sm font-semibold text-ink-900 transition-all hover:bg-gold-600"
                >
                  Voltar ao início
                </Link>
              </div>
            </div>
          </div>
        </div>
        <SiteFooter />
      </>
    )
  }

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/entrar")
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single()

  const { data: announcements } = await supabase
    .from("announcements")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(10)

  const { data: materials } = await supabase
    .from("materials")
    .select("*")
    .order("created_at", { ascending: false })

  if (profile?.role === "admin") {
    redirect("/admin")
  }

  return (
    <>
      <SiteHeader />
      <div className="min-h-screen bg-parchment pt-20">
        <header className="border-b border-gold-200/60 bg-cream-50/95 backdrop-blur-md">
          <div className="mx-auto max-w-6xl px-4 py-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="font-display text-2xl font-medium text-ink-900">
                  Área de Membros
                </h1>
                <p className="text-sm text-ink-600">
                  Bem-vindo, {profile?.name || user.email}
                </p>
              </div>
              <LogoutButton />
            </div>
          </div>
        </header>

        <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="grid gap-8 lg:grid-cols-3">
            <div className="lg:col-span-2 space-y-8">
              <section>
                <h2 className="font-display text-2xl font-medium text-ink-900 mb-4">
                  Avisos
                </h2>
                <AnnouncementsList announcements={announcements || []} />
              </section>

              <section>
                <h2 className="font-display text-2xl font-medium text-ink-900 mb-4">
                  Materiais de Estudo
                </h2>
                <MaterialsList materials={materials || []} />
              </section>
            </div>

            <div>
              <section className="bg-cream-50 rounded-2xl border border-gold-200/60 p-6">
                <h2 className="font-display text-xl font-medium text-ink-900 mb-4">
                  Meu Perfil
                </h2>
                <ProfileForm profile={profile as Profile} />
              </section>
            </div>
          </div>
        </main>
      </div>
      <SiteFooter />
    </>
  )
}
