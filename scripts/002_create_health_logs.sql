-- Create health_logs table for daily tracking
CREATE TABLE IF NOT EXISTS public.health_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  logged_at DATE NOT NULL DEFAULT CURRENT_DATE,
  blood_pressure_systolic INTEGER,
  blood_pressure_diastolic INTEGER,
  glucose NUMERIC(6,2),
  bmi NUMERIC(5,2),
  heart_rate INTEGER,
  temperature NUMERIC(4,1),
  symptoms TEXT[] DEFAULT '{}',
  notes TEXT,
  risk_level TEXT CHECK (risk_level IN ('Low', 'Moderate', 'High')),
  risk_score NUMERIC(5,2),
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id, logged_at)
);

ALTER TABLE public.health_logs ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "health_logs_select_own" ON public.health_logs;
CREATE POLICY "health_logs_select_own" ON public.health_logs
  FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "health_logs_insert_own" ON public.health_logs;
CREATE POLICY "health_logs_insert_own" ON public.health_logs
  FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "health_logs_update_own" ON public.health_logs;
CREATE POLICY "health_logs_update_own" ON public.health_logs
  FOR UPDATE USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "health_logs_delete_own" ON public.health_logs;
CREATE POLICY "health_logs_delete_own" ON public.health_logs
  FOR DELETE USING (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS idx_health_logs_user_date
  ON public.health_logs (user_id, logged_at DESC);
