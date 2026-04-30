CREATE OR REPLACE FUNCTION public.claim_first_admin()
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  current_user_id uuid := auth.uid();
  current_email text := auth.jwt() ->> 'email';
BEGIN
  IF current_user_id IS NULL THEN
    RETURN false;
  END IF;

  PERFORM pg_advisory_xact_lock(424242);

  INSERT INTO public.profiles (user_id, display_name)
  VALUES (current_user_id, COALESCE(split_part(current_email, '@', 1), 'Administrateur'))
  ON CONFLICT DO NOTHING;

  IF NOT EXISTS (SELECT 1 FROM public.user_roles WHERE role = 'admin') THEN
    INSERT INTO public.user_roles (user_id, role)
    VALUES (current_user_id, 'admin')
    ON CONFLICT DO NOTHING;
    RETURN true;
  END IF;

  RETURN public.has_role(current_user_id, 'admin');
END;
$$;

GRANT EXECUTE ON FUNCTION public.claim_first_admin() TO authenticated;