import { createClient } from "@supabase/supabase-js"

export type SefariaChunk = {
  id: number
  ref: string
  he_ref: string | null
  book: string
  category: string | null
  language: string
  version_title: string
  license: string | null
  sefaria_url: string
  text_content: string
  he_text?: string | null
  embedding?: number[]
  similarity?: number
  text_rank?: number
  combined_score?: number
}

let supabaseClient: ReturnType<typeof createClient> | null = null

export function getSupabaseClient() {
  if (supabaseClient) return supabaseClient

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!url || !key) {
    throw new Error(
      "Missing Supabase credentials. Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY"
    )
  }

  supabaseClient = createClient(url, key, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  })

  return supabaseClient
}

export async function searchChunks(
  queryEmbedding: number[],
  queryText: string,
  options: {
    matchThreshold?: number
    matchCount?: number
    vectorWeight?: number
  } = {}
): Promise<SefariaChunk[]> {
  const {
    matchThreshold = 0.5,
    matchCount = 10,
    vectorWeight = 0.7,
  } = options

  const client = getSupabaseClient()

  const { data, error } = await client.rpc("search_sefaria_chunks", {
    query_embedding: queryEmbedding,
    query_text: queryText,
    match_threshold: matchThreshold,
    match_count: matchCount,
    vector_weight: vectorWeight,
  } as never)

  if (error) {
    throw new Error(`Supabase search failed: ${error.message}`)
  }

  return (data || []) as SefariaChunk[]
}

export async function upsertChunk(chunk: Omit<SefariaChunk, "id">) {
  const client = getSupabaseClient()

  const { data, error } = await client
    .from("sefaria_chunks")
    .upsert(
      {
        ref: chunk.ref,
        he_ref: chunk.he_ref,
        book: chunk.book,
        category: chunk.category,
        language: chunk.language,
        version_title: chunk.version_title,
        license: chunk.license,
        sefaria_url: chunk.sefaria_url,
        text_content: chunk.text_content,
        he_text: chunk.he_text,
        embedding: chunk.embedding,
      } as never,
      { onConflict: "ref,version_title,language" }
    )
    .select()
    .single()

  if (error) {
    throw new Error(`Failed to upsert chunk: ${error.message}`)
  }

  return data
}

export async function getChunkCount(): Promise<number> {
  const client = getSupabaseClient()

  const { count, error } = await client
    .from("sefaria_chunks")
    .select("*", { count: "exact", head: true })

  if (error) {
    throw new Error(`Failed to count chunks: ${error.message}`)
  }

  return count || 0
}
