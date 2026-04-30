DROP FUNCTION IF EXISTS public.claim_first_admin();

CREATE OR REPLACE FUNCTION public.no_admin_exists()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT NOT EXISTS (SELECT 1 FROM public.user_roles WHERE role = 'admin')
$$;

REVOKE EXECUTE ON FUNCTION public.no_admin_exists() FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.no_admin_exists() FROM anon;
REVOKE EXECUTE ON FUNCTION public.no_admin_exists() FROM authenticated;

CREATE TABLE IF NOT EXISTS public.admin_claims (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL UNIQUE,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.admin_claims ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "First signed-in user can claim admin" ON public.admin_claims;
CREATE POLICY "First signed-in user can claim admin"
ON public.admin_claims
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id AND public.no_admin_exists());

CREATE OR REPLACE FUNCTION public.handle_admin_claim()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  current_email text := auth.jwt() ->> 'email';
BEGIN
  PERFORM pg_advisory_xact_lock(424242);

  IF EXISTS (SELECT 1 FROM public.user_roles WHERE role = 'admin') THEN
    RAISE EXCEPTION 'Un administrateur existe déjà.';
  END IF;

  INSERT INTO public.profiles (user_id, display_name)
  VALUES (NEW.user_id, COALESCE(split_part(current_email, '@', 1), 'Administrateur'))
  ON CONFLICT DO NOTHING;

  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.user_id, 'admin')
  ON CONFLICT DO NOTHING;

  RETURN NEW;
END;
$$;

REVOKE EXECUTE ON FUNCTION public.handle_admin_claim() FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.handle_admin_claim() FROM anon;
REVOKE EXECUTE ON FUNCTION public.handle_admin_claim() FROM authenticated;

DROP TRIGGER IF EXISTS on_admin_claim_created ON public.admin_claims;
CREATE TRIGGER on_admin_claim_created
AFTER INSERT ON public.admin_claims
FOR EACH ROW EXECUTE FUNCTION public.handle_admin_claim();