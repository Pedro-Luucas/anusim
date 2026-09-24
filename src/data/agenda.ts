export type AgendaEventStatus = "confirmed" | "to_confirm"

export type AgendaEvent = {
  id: string
  day: "sunday" | "monday" | "tuesday" | "wednesday" | "thursday" | "friday" | "saturday"
  title: string
  time: string
  description?: string
  status: AgendaEventStatus
  source: string
}

export const WEEKLY_SCHEDULE: AgendaEvent[] = [
  {
    id: "kabalat-shabat",
    day: "friday",
    title: "Kabalat Shabat",
    time: "19:00",
    description: "Recepção do Shabat com orações e canções",
    status: "confirmed",
    source: "CLAUDE.md",
  },
  {
    id: "shacharit-shabat",
    day: "saturday",
    title: "Shacharit (Oração da Manhã)",
    time: "09:00",
    description: "Serviço matinal de Shabat com leitura da Torá",
    status: "confirmed",
    source: "CLAUDE.md",
  },
]

export const DAY_ORDER: AgendaEvent["day"][] = [
  "sunday",
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
]

export const DAY_NAMES_PT: Record<AgendaEvent["day"], string> = {
  sunday: "Domingo",
  monday: "Segunda-feira",
  tuesday: "Terça-feira",
  wednesday: "Quarta-feira",
  thursday: "Quinta-feira",
  friday: "Sexta-feira",
  saturday: "Sábado",
}
