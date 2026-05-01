-- ============================================================
-- EventSync — Migration complète consolidée
-- À exécuter dans Supabase > SQL Editor
-- ============================================================

-- ============================================================
-- 1. TYPES ENUM
-- ============================================================

CREATE TYPE IF NOT EXISTS public.app_role AS ENUM ('admin', 'user');
CREATE TYPE IF NOT EXISTS public.publish_status AS ENUM ('draft', 'published');
CREATE TYPE IF NOT EXISTS public.content_type AS ENUM ('article', 'announcement', 'session');

-- ============================================================
-- 2. TABLES
-- ============================================================

-- Profils utilisateurs (créé automatiquement à l'inscription)
CREATE TABLE IF NOT EXISTS public.profiles (
  id          UUID        NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id     UUID        NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name TEXT,
  avatar_url  TEXT,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Rôles utilisateurs (admin / user)
CREATE TABLE IF NOT EXISTS public.user_roles (
  id         UUID            NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id    UUID            NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role       public.app_role NOT NULL,
  created_at TIMESTAMPTZ     NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);

-- Un seul admin possible
CREATE UNIQUE INDEX IF NOT EXISTS one_admin_role
  ON public.user_roles (role) WHERE role = 'admin';

-- Revendication admin (premier inscrit devient admin)
CREATE TABLE IF NOT EXISTS public.admin_claims (
  id         UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id    UUID        NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Événements
CREATE TABLE IF NOT EXISTS public.events (
  id             UUID                   NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title          TEXT                   NOT NULL,
  starts_at      TIMESTAMPTZ            NOT NULL,
  ends_at        TIMESTAMPTZ,
  location       TEXT                   NOT NULL,
  description    TEXT                   NOT NULL,
  image_url      TEXT,
  status         public.publish_status  NOT NULL DEFAULT 'draft',
  sessions_count INTEGER                NOT NULL DEFAULT 0,
  created_by     UUID                   REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at     TIMESTAMPTZ            NOT NULL DEFAULT now(),
  updated_at     TIMESTAMPTZ            NOT NULL DEFAULT now()
);

-- Contenus (articles, annonces, sessions)
CREATE TABLE IF NOT EXISTS public.contents (
  id           UUID                  NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  event_id     UUID                  REFERENCES public.events(id) ON DELETE CASCADE,
  title        TEXT                  NOT NULL,
  type         public.content_type   NOT NULL DEFAULT 'article',
  body         TEXT                  NOT NULL,
  status       public.publish_status NOT NULL DEFAULT 'draft',
  published_at TIMESTAMPTZ,
  created_by   UUID                  REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at   TIMESTAMPTZ           NOT NULL DEFAULT now(),
  updated_at   TIMESTAMPTZ           NOT NULL DEFAULT now()
);

-- ============================================================
-- 3. INDEX
-- ============================================================

CREATE INDEX IF NOT EXISTS idx_events_status_starts
  ON public.events(status, starts_at);

CREATE INDEX IF NOT EXISTS idx_contents_status_event
  ON public.contents(status, event_id);

CREATE INDEX IF NOT EXISTS idx_user_roles_user_id_role
  ON public.user_roles(user_id, role);

-- ============================================================
-- 4. FONCTIONS
-- ============================================================

-- Mise à jour automatique du champ updated_at
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- Vérification de rôle (utilisée dans les policies RLS)
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role public.app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

-- Vérifie si aucun admin n'existe encore
CREATE OR REPLACE FUNCTION public.no_admin_exists()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT NOT EXISTS (SELECT 1 FROM public.user_roles WHERE role = 'admin')
$$;

-- Création du profil à l'inscription
CREATE OR REPLACE FUNCTION public.handle_new_user_profile()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (user_id, display_name, avatar_url)
  VALUES (
    NEW.id,
    COALESCE(
      NEW.raw_user_meta_data ->> 'full_name',
      NEW.raw_user_meta_data ->> 'name',
      split_part(NEW.email, '@', 1)
    ),
    NEW.raw_user_meta_data ->> 'avatar_url'
  )
  ON CONFLICT (user_id) DO NOTHING;
  RETURN NEW;
END;
$$;

-- Attribution du rôle user à l'inscription (sauf si premier = admin)
CREATE OR REPLACE FUNCTION public.handle_new_user_role()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM public.user_roles WHERE role = 'admin') THEN
    INSERT INTO public.user_roles (user_id, role)
    VALUES (NEW.id, 'admin')
    ON CONFLICT DO NOTHING;
  ELSE
    INSERT INTO public.user_roles (user_id, role)
    VALUES (NEW.id, 'user')
    ON CONFLICT DO NOTHING;
  END IF;
  RETURN NEW;
END;
$$;

-- Gestion de la revendication admin (déclenché sur admin_claims)
CREATE OR REPLACE FUNCTION public.handle_admin_claim()
RETURNS TRIGGER
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
  VALUES (
    NEW.user_id,
    COALESCE(split_part(current_email, '@', 1), 'Administrateur')
  )
  ON CONFLICT DO NOTHING;

  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.user_id, 'admin')
  ON CONFLICT DO NOTHING;

  RETURN NEW;
END;
$$;

-- ============================================================
-- 5. TRIGGERS
-- ============================================================

-- Profil créé automatiquement à chaque nouvel utilisateur
DROP TRIGGER IF EXISTS on_auth_user_created_profile ON auth.users;
CREATE TRIGGER on_auth_user_created_profile
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user_profile();

-- Rôle attribué automatiquement à chaque nouvel utilisateur
DROP TRIGGER IF EXISTS on_auth_user_created_role ON auth.users;
CREATE TRIGGER on_auth_user_created_role
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user_role();

-- Revendication admin déclenchée à l'insertion dans admin_claims
DROP TRIGGER IF EXISTS on_admin_claim_created ON public.admin_claims;
CREATE TRIGGER on_admin_claim_created
  AFTER INSERT ON public.admin_claims
  FOR EACH ROW EXECUTE FUNCTION public.handle_admin_claim();

-- updated_at automatique
DROP TRIGGER IF EXISTS update_profiles_updated_at ON public.profiles;
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_events_updated_at ON public.events;
CREATE TRIGGER update_events_updated_at
  BEFORE UPDATE ON public.events
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_contents_updated_at ON public.contents;
CREATE TRIGGER update_contents_updated_at
  BEFORE UPDATE ON public.contents
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ============================================================
-- 6. ROW LEVEL SECURITY (RLS)
-- ============================================================

ALTER TABLE public.profiles     ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles   ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.events       ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contents     ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_claims ENABLE ROW LEVEL SECURITY;

-- Profiles
DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;
CREATE POLICY "Users can view their own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'));

DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
CREATE POLICY "Users can update their own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can create their own profile" ON public.profiles;
CREATE POLICY "Users can create their own profile"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- User roles
DROP POLICY IF EXISTS "Users can view their own role" ON public.user_roles;
CREATE POLICY "Users can view their own role"
  ON public.user_roles FOR SELECT
  USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'));

-- Events
DROP POLICY IF EXISTS "Published events are public" ON public.events;
CREATE POLICY "Published events are public"
  ON public.events FOR SELECT
  USING (status = 'published' OR public.has_role(auth.uid(), 'admin'));

DROP POLICY IF EXISTS "Admins can create events" ON public.events;
CREATE POLICY "Admins can create events"
  ON public.events FOR INSERT
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

DROP POLICY IF EXISTS "Admins can update events" ON public.events;
CREATE POLICY "Admins can update events"
  ON public.events FOR UPDATE
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

DROP POLICY IF EXISTS "Admins can delete events" ON public.events;
CREATE POLICY "Admins can delete events"
  ON public.events FOR DELETE
  USING (public.has_role(auth.uid(), 'admin'));

-- Contents
DROP POLICY IF EXISTS "Published contents are public" ON public.contents;
CREATE POLICY "Published contents are public"
  ON public.contents FOR SELECT
  USING (status = 'published' OR public.has_role(auth.uid(), 'admin'));

DROP POLICY IF EXISTS "Admins can create contents" ON public.contents;
CREATE POLICY "Admins can create contents"
  ON public.contents FOR INSERT
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

DROP POLICY IF EXISTS "Admins can update contents" ON public.contents;
CREATE POLICY "Admins can update contents"
  ON public.contents FOR UPDATE
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

DROP POLICY IF EXISTS "Admins can delete contents" ON public.contents;
CREATE POLICY "Admins can delete contents"
  ON public.contents FOR DELETE
  USING (public.has_role(auth.uid(), 'admin'));

-- Admin claims : seul le premier utilisateur connecté peut s'auto-proclamer admin
DROP POLICY IF EXISTS "First signed-in user can claim admin" ON public.admin_claims;
CREATE POLICY "First signed-in user can claim admin"
  ON public.admin_claims FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id AND public.no_admin_exists());

-- ============================================================
-- 7. STORAGE (bucket pour les images d'événements)
-- ============================================================

INSERT INTO storage.buckets (id, name, public)
VALUES ('event-images', 'event-images', true)
ON CONFLICT (id) DO NOTHING;

DROP POLICY IF EXISTS "Event images are publicly viewable" ON storage.objects;
CREATE POLICY "Event images are publicly viewable"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'event-images');

DROP POLICY IF EXISTS "Admins can upload event images" ON storage.objects;
CREATE POLICY "Admins can upload event images"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'event-images'
    AND public.has_role(auth.uid(), 'admin'::public.app_role)
  );

DROP POLICY IF EXISTS "Admins can update event images" ON storage.objects;
CREATE POLICY "Admins can update event images"
  ON storage.objects FOR UPDATE
  USING (bucket_id = 'event-images' AND public.has_role(auth.uid(), 'admin'::public.app_role))
  WITH CHECK (bucket_id = 'event-images' AND public.has_role(auth.uid(), 'admin'::public.app_role));

DROP POLICY IF EXISTS "Admins can delete event images" ON storage.objects;
CREATE POLICY "Admins can delete event images"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'event-images' AND public.has_role(auth.uid(), 'admin'::public.app_role));

-- ============================================================
-- 8. PERMISSIONS FONCTIONS
-- ============================================================

REVOKE EXECUTE ON FUNCTION public.update_updated_at_column()    FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.handle_new_user_profile()     FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.handle_new_user_role()        FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.handle_admin_claim()          FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.no_admin_exists()             FROM PUBLIC, anon, authenticated;

GRANT EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) TO authenticated;
GRANT EXECUTE ON FUNCTION public.no_admin_exists()               TO authenticated;