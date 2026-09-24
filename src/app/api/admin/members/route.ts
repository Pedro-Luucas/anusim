import { NextResponse } from "next/server"
import { createAdminClient } from "@/lib/supabase/admin"
import { createClient } from "@/lib/supabase/server"

export async function PATCH(request: Request) {
  const supabase = await createClient()

  if (!supabase) {
    return NextResponse.json(
      { error: "Sistema não configurado" },
      { status: 503 }
    )
  }

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: "Não autenticado" }, { status: 401 })
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single()

  if (profile?.role !== "admin") {
    return NextResponse.json({ error: "Sem permissão" }, { status: 403 })
  }

  const body = await request.json()
  const { profileId, role } = body

  if (role !== "membro" && role !== "admin") {
    return NextResponse.json({ error: "Invalid role" }, { status: 400 })
  }

  const adminClient = createAdminClient()

  if (!adminClient) {
    return NextResponse.json(
      { error: "Cliente admin não configurado" },
      { status: 503 }
    )
  }

  // Prevent admin from removing their own admin role if they're the only admin
  if (profileId === user.id && role === "membro") {
    const { count } = await adminClient
      .from("profiles")
      .select("*", { count: "exact", head: true })
      .eq("role", "admin")

    if (count === 1) {
      return NextResponse.json(
        { error: "Não é possível remover o único administrador" },
        { status: 400 }
      )
    }
  }

  const { error } = await adminClient
    .from("profiles")
    .update({ role })
    .eq("id", profileId)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 })
  }

  return NextResponse.json({ success: true })
}
