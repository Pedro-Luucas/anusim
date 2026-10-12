import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function GET(request: Request) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get("code")
  const next = requestUrl.searchParams.get("next")
  const origin = requestUrl.origin

  if (code) {
    const supabase = await createClient()
    if (supabase) {
      await supabase.auth.exchangeCodeForSession(code)
    }
  }

  let redirectTo = "/membro"
  if (next && next.startsWith("/") && !next.startsWith("//")) {
    redirectTo = next
  }

  return NextResponse.redirect(`${origin}${redirectTo}`)
}
