-- Enable pgvector extension for embedding storage
create extension if not exists vector;

-- Sefaria text chunks table for RAG
create table if not exists public.sefaria_chunks (
  id bigserial primary key,
  ref text not null,
  he_ref text,
  book text not null,
  category text,
  language text not null,
  version_title text not null,
  license text,
  sefaria_url text not null,
  text_content text not null,
  text_tsvector tsvector generated always as (to_tsvector('english', text_content)) stored,
  embedding vector(768),
  created_at timestamptz default now()
);

-- Index for vector similarity search using HNSW
-- Using 768 dimensions for gemini-embedding-001 with reduced output dimensionality
create index if not exists sefaria_chunks_embedding_idx
  on public.sefaria_chunks
  using hnsw (embedding vector_cosine_ops)
  with (m = 16, ef_construction = 64);

-- Index for full-text search
create index if not exists sefaria_chunks_text_tsvector_idx
  on public.sefaria_chunks
  using gin (text_tsvector);

-- Index for filtering by book/category
create index if not exists sefaria_chunks_book_idx
  on public.sefaria_chunks (book);

create index if not exists sefaria_chunks_category_idx
  on public.sefaria_chunks (category);

-- Hybrid search function combining vector similarity and full-text search
create or replace function search_sefaria_chunks(
  query_embedding vector(768),
  query_text text,
  match_threshold float default 0.5,
  match_count int default 10,
  vector_weight float default 0.7
)
returns table (
  id bigint,
  ref text,
  he_ref text,
  book text,
  category text,
  language text,
  version_title text,
  license text,
  sefaria_url text,
  text_content text,
  similarity float,
  text_rank float,
  combined_score float
)
language plpgsql
as $$
begin
  return query
  select
    c.id,
    c.ref,
    c.he_ref,
    c.book,
    c.category,
    c.language,
    c.version_title,
    c.license,
    c.sefaria_url,
    c.text_content,
    1 - (c.embedding <=> query_embedding) as similarity,
    ts_rank(c.text_tsvector, plainto_tsquery('english', query_text)) as text_rank,
    (vector_weight * (1 - (c.embedding <=> query_embedding))) + 
    ((1 - vector_weight) * ts_rank(c.text_tsvector, plainto_tsquery('english', query_text))) as combined_score
  from public.sefaria_chunks c
  where
    (c.embedding <=> query_embedding) < (1 - match_threshold)
    or c.text_tsvector @@ plainto_tsquery('english', query_text)
  order by combined_score desc
  limit match_count;
end;
$$;

-- RLS: Chunks are readable only server-side (service role)
-- This is a read-only public dataset, but we control access via service role
alter table public.sefaria_chunks enable row level security;

-- No policies needed - service role bypasses RLS
-- Public (anon) access will be denied
