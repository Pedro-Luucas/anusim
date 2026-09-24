-- Create announcements table
CREATE TABLE IF NOT EXISTS public.announcements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  author_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.announcements ENABLE ROW LEVEL SECURITY;

-- Policies: anyone authenticated can read announcements
CREATE POLICY "Authenticated users can read announcements"
  ON public.announcements
  FOR SELECT
  USING (auth.role() = 'authenticated');

-- Policies: only admins can insert
CREATE POLICY "Admins can insert announcements"
  ON public.announcements
  FOR INSERT
  WITH CHECK (public.is_admin());

-- Policies: only admins can update
CREATE POLICY "Admins can update announcements"
  ON public.announcements
  FOR UPDATE
  USING (public.is_admin());

-- Policies: only admins can delete
CREATE POLICY "Admins can delete announcements"
  ON public.announcements
  FOR DELETE
  USING (public.is_admin());

-- Updated_at trigger
CREATE TRIGGER announcements_updated_at
  BEFORE UPDATE ON public.announcements
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();
