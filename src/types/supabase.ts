export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string
          name: string | null
          role: "membro" | "admin"
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          name?: string | null
          role?: "membro" | "admin"
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          name?: string | null
          role?: "membro" | "admin"
          created_at?: string
          updated_at?: string
        }
      }
      announcements: {
        Row: {
          id: string
          title: string
          content: string
          author_id: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          content: string
          author_id?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          content?: string
          author_id?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      materials: {
        Row: {
          id: string
          title: string
          description: string | null
          url: string
          type: "link" | "file"
          author_id: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          description?: string | null
          url: string
          type: "link" | "file"
          author_id?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          description?: string | null
          url?: string
          type?: "link" | "file"
          author_id?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      weekly_agenda: {
        Row: {
          id: string
          day_of_week: "segunda" | "terça" | "quarta" | "quinta" | "sexta" | "sábado" | "domingo"
          time: string
          title: string
          description: string | null
          link: string | null
          status: "confirmed" | "to_confirm"
          source: string | null
          display_order: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          day_of_week: "segunda" | "terça" | "quarta" | "quinta" | "sexta" | "sábado" | "domingo"
          time: string
          title: string
          description?: string | null
          link?: string | null
          status?: "confirmed" | "to_confirm"
          source?: string | null
          display_order?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          day_of_week?: "segunda" | "terça" | "quarta" | "quinta" | "sexta" | "sábado" | "domingo"
          time?: string
          title?: string
          description?: string | null
          link?: string | null
          status?: "confirmed" | "to_confirm"
          source?: string | null
          display_order?: number
          created_at?: string
          updated_at?: string
        }
      }
      events: {
        Row: {
          id: string
          title: string
          description: string | null
          start_date: string
          end_date: string | null
          location: string | null
          link: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          description?: string | null
          start_date: string
          end_date?: string | null
          location?: string | null
          link?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          description?: string | null
          start_date?: string
          end_date?: string | null
          location?: string | null
          link?: string | null
          created_at?: string
          updated_at?: string
        }
      }
    }
  }
}
