import { createClient } from "@/lib/supabase/server"
import type { Database } from "@/types/supabase"

export type WeeklyAgendaItem = Database["public"]["Tables"]["weekly_agenda"]["Row"]
export type Event = Database["public"]["Tables"]["events"]["Row"]

export async function getWeeklyAgenda(): Promise<WeeklyAgendaItem[]> {
  const supabase = await createClient()
  
  if (!supabase) {
    return []
  }

  const { data, error } = await supabase
    .from("weekly_agenda")
    .select("*")
    .order("display_order", { ascending: true })

  if (error) {
    console.error("[weekly_agenda] query failed:", error.message)
    return []
  }

  return data || []
}

export async function getUpcomingEvents(limit = 10): Promise<Event[]> {
  const supabase = await createClient()
  
  if (!supabase) {
    return []
  }

  const now = new Date().toISOString()

  const { data, error } = await supabase
    .from("events")
    .select("*")
    .gte("start_date", now)
    .order("start_date", { ascending: true })
    .limit(limit)

  if (error) {
    console.error("[events] query failed:", error.message)
    return []
  }

  return data || []
}

export async function getAllEvents(): Promise<Event[]> {
  const supabase = await createClient()
  
  if (!supabase) {
    return []
  }

  const { data, error } = await supabase
    .from("events")
    .select("*")
    .order("start_date", { ascending: false })

  if (error) {
    console.error("[events] query failed:", error.message)
    return []
  }

  return data || []
}
