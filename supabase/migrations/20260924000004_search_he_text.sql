-- Update search function to return he_text
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
  he_text text,
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
    c.he_text,
    1 - (c.embedding <=> query_embedding) as similarity,
    greatest(
      ts_rank(c.text_tsvector, plainto_tsquery('simple', query_text)),
      ts_rank(c.text_tsvector, plainto_tsquery('english', query_text))
    ) as text_rank,
    (vector_weight * (1 - (c.embedding <=> query_embedding))) + 
    ((1 - vector_weight) * greatest(
      ts_rank(c.text_tsvector, plainto_tsquery('simple', query_text)),
      ts_rank(c.text_tsvector, plainto_tsquery('english', query_text))
    )) as combined_score
  from public.sefaria_chunks c
  where
    (c.embedding <=> query_embedding) < (1 - match_threshold)
    or c.text_tsvector @@ plainto_tsquery('simple', query_text)
    or c.text_tsvector @@ plainto_tsquery('english', query_text)
  order by combined_score desc
  limit match_count;
end;
$$;
