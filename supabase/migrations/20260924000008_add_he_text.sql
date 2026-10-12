-- Add he_text column for Hebrew text storage
alter table public.sefaria_chunks add column if not exists he_text text;
