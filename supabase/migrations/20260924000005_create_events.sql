-- Create events table
CREATE TABLE IF NOT EXISTS public.events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  start_date TIMESTAMPTZ NOT NULL,
  end_date TIMESTAMPTZ,
  location TEXT,
  link TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;

-- Policies: anyone can read (public)
CREATE POLICY "Anyone can read events"
  ON public.events
  FOR SELECT
  USING (true);

-- Policies: only admins can insert
CREATE POLICY "Admins can insert events"
  ON public.events
  FOR INSERT
  WITH CHECK (public.is_admin());

-- Policies: only admins can update
CREATE POLICY "Admins can update events"
  ON public.events
  FOR UPDATE
  USING (public.is_admin());

-- Policies: only admins can delete
CREATE POLICY "Admins can delete events"
  ON public.events
  FOR DELETE
  USING (public.is_admin());

-- Updated_at trigger
CREATE TRIGGER events_updated_at
  BEFORE UPDATE ON public.events
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();
