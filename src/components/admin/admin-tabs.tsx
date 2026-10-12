"use client"

import { useState } from "react"
import type { Database } from "@/types/supabase"
import { MembersTab } from "@/components/admin/members-tab"
import { AnnouncementsTab } from "@/components/admin/announcements-tab"
import { MaterialsTab } from "@/components/admin/materials-tab"
import { WeeklyAgendaTab } from "@/components/admin/weekly-agenda-tab"
import { EventsTab } from "@/components/admin/events-tab"

type Profile = Database["public"]["Tables"]["profiles"]["Row"]
type Announcement = Database["public"]["Tables"]["announcements"]["Row"]
type Material = Database["public"]["Tables"]["materials"]["Row"]
type WeeklyAgendaItem = Database["public"]["Tables"]["weekly_agenda"]["Row"]
type Event = Database["public"]["Tables"]["events"]["Row"]

type AdminTabsProps = {
  profiles: Profile[]
  announcements: Announcement[]
  materials: Material[]
  weeklyAgenda: WeeklyAgendaItem[]
  events: Event[]
}

type Tab = "members" | "announcements" | "materials" | "agenda" | "events"

export function AdminTabs({
  profiles,
  announcements,
  materials,
  weeklyAgenda,
  events,
}: AdminTabsProps) {
  const [activeTab, setActiveTab] = useState<Tab>("members")

  const tabs: { id: Tab; label: string; count?: number }[] = [
    { id: "members", label: "Membros", count: profiles.length },
    { id: "announcements", label: "Avisos", count: announcements.length },
    { id: "materials", label: "Materiais", count: materials.length },
    { id: "agenda", label: "Agenda Semanal", count: weeklyAgenda.length },
    { id: "events", label: "Eventos", count: events.length },
  ]

  return (
    <div>
      <div className="border-b border-gold-200/60 mb-8">
        <nav className="flex gap-1 overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`min-h-[44px] px-5 py-3 text-sm font-medium whitespace-nowrap transition-colors ${
                activeTab === tab.id
                  ? "border-b-2 border-gold-600 text-gold-700"
                  : "text-ink-600 hover:text-ink-900"
              }`}
            >
              {tab.label}
              {tab.count !== undefined && (
                <span className="ml-2 rounded-full bg-gold-100 px-2 py-0.5 text-xs text-gold-800">
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </nav>
      </div>

      {activeTab === "members" && <MembersTab profiles={profiles} />}
      {activeTab === "announcements" && <AnnouncementsTab announcements={announcements} />}
      {activeTab === "materials" && <MaterialsTab materials={materials} />}
      {activeTab === "agenda" && <WeeklyAgendaTab items={weeklyAgenda} />}
      {activeTab === "events" && <EventsTab events={events} />}
    </div>
  )
}
