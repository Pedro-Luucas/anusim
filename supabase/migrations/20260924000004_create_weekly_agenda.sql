-- Create weekly_agenda table
CREATE TABLE IF NOT EXISTS public.weekly_agenda (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  day_of_week TEXT NOT NULL CHECK (day_of_week IN ('segunda', 'terça', 'quarta', 'quinta', 'sexta', 'sábado', 'domingo')),
  time TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  link TEXT,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.weekly_agenda ENABLE ROW LEVEL SECURITY;

-- Policies: anyone can read (public)
CREATE POLICY "Anyone can read weekly agenda"
  ON public.weekly_agenda
  FOR SELECT
  USING (true);

-- Policies: only admins can insert
CREATE POLICY "Admins can insert weekly agenda"
  ON public.weekly_agenda
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Policies: only admins can update
CREATE POLICY "Admins can update weekly agenda"
  ON public.weekly_agenda
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Policies: only admins can delete
CREATE POLICY "Admins can delete weekly agenda"
  ON public.weekly_agenda
  FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Updated_at trigger
CREATE TRIGGER weekly_agenda_updated_at
  BEFORE UPDATE ON public.weekly_agenda
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();
