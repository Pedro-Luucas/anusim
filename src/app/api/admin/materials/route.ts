import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

async function checkAdmin() {
  const supabase = await createClient()

  if (!supabase) {
    return { error: "Sistema não configurado", status: 503 }
  }

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { error: "Não autenticado", status: 401 }
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single()

  if (profile?.role !== "admin") {
    return { error: "Sem permissão", status: 403 }
  }

  return { supabase, user }
}

export async function POST(request: Request) {
  const check = await checkAdmin()
  if ("error" in check) {
    return NextResponse.json({ error: check.error }, { status: check.status })
  }

  const { supabase, user } = check
  const body = await request.json()
  const { title, description, url, type } = body

  const { error } = await supabase
    .from("materials")
    .insert({ title, description, url, type, author_id: user.id })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 })
  }

  return NextResponse.json({ success: true })
}

export async function PATCH(request: Request) {
  const check = await checkAdmin()
  if ("error" in check) {
    return NextResponse.json({ error: check.error }, { status: check.status })
  }

  const { supabase } = check
  const body = await request.json()
  const { id, title, description, url, type } = body

  const { error } = await supabase
    .from("materials")
    .update({ title, description, url, type })
    .eq("id", id)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 })
  }

  return NextResponse.json({ success: true })
}

export async function DELETE(request: Request) {
  const check = await checkAdmin()
  if ("error" in check) {
    return NextResponse.json({ error: check.error }, { status: check.status })
  }

  const { supabase } = check
  const body = await request.json()
  const { id } = body

  const { error } = await supabase.from("materials").delete().eq("id", id)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 })
  }

  return NextResponse.json({ success: true })
}
