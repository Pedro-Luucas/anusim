"use client"

import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"

export function LogoutButton() {
  const router = useRouter()
  const supabase = createClient()

  async function handleLogout() {
    if (!supabase) return
    
    await supabase.auth.signOut()
    router.push("/")
    router.refresh()
  }

  return (
    <button
      onClick={handleLogout}
      className="min-h-[44px] rounded-full border border-gold-500 bg-transparent px-5 py-2 text-sm font-semibold text-gold-700 transition-all hover:bg-gold-50"
    >
      Sair
    </button>
  )
}
