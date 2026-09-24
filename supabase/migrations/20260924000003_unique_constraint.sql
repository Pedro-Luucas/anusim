-- Add unique constraint for upsert conflict resolution
alter table public.sefaria_chunks 
  add constraint sefaria_chunks_ref_version_lang_key 
  unique (ref, version_title, language);
