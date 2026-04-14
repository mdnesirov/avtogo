-- AvtoGo — Initial Schema
-- Run this file in Supabase SQL Editor (single run)
-- All tables, RLS policies, triggers in one place

-- ──────────────────────────────────────────
-- EXTENSIONS
-- ──────────────────────────────────────────
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS btree_gist;

-- ──────────────────────────────────────────
-- PROFILES (extends Supabase auth.users)
-- ──────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.profiles (
  id           UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name    TEXT,
  email        TEXT UNIQUE,
  phone        TEXT,
  avatar_url   TEXT,
  whatsapp     TEXT,
  role         TEXT NOT NULL DEFAULT 'renter'
                 CHECK (role IN ('owner', 'renter', 'both')),
  created_at   TIMESTAMPTZ DEFAULT NOW()
);

-- ──────────────────────────────────────────
-- CARS
-- ──────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.cars (
  id               UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  owner_id         UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  brand            TEXT NOT NULL,
  model            TEXT NOT NULL,
  year             INTEGER NOT NULL,
  car_type         TEXT,
  transmission     TEXT NOT NULL CHECK (transmission IN ('automatic', 'manual')),
  fuel_type        TEXT NOT NULL CHECK (fuel_type IN ('petrol', 'diesel', 'electric', 'hybrid')),
  price_per_day    NUMERIC(10,2) NOT NULL,
  location         TEXT NOT NULL,
  city             TEXT,
  latitude         NUMERIC(10,6),
  longitude        NUMERIC(10,6),
  description      TEXT,
  images           TEXT[] DEFAULT '{}',
  is_available     BOOLEAN DEFAULT TRUE,
  airport_delivery BOOLEAN DEFAULT FALSE,
  whatsapp_phone   TEXT,
  rating           NUMERIC(3,2) DEFAULT 0,
  total_reviews    INTEGER DEFAULT 0,
  created_at       TIMESTAMPTZ DEFAULT NOW(),
  updated_at       TIMESTAMPTZ DEFAULT NOW()
);

-- ──────────────────────────────────────────
-- BOOKINGS
-- ──────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.bookings (
  id                UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id           UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  car_id            UUID NOT NULL REFERENCES public.cars(id) ON DELETE CASCADE,
  start_date        DATE NOT NULL,
  end_date          DATE NOT NULL,
  total_price       NUMERIC(10,2) NOT NULL,
  status            TEXT NOT NULL DEFAULT 'pending'
                      CHECK (status IN ('pending', 'confirmed', 'cancelled', 'completed')),
  driver_name       TEXT NOT NULL,
  driver_phone      TEXT NOT NULL,
  driver_email      TEXT,
  driver_license    TEXT,
  airport_delivery  BOOLEAN DEFAULT FALSE,
  payment_status    TEXT DEFAULT 'unpaid'
                      CHECK (payment_status IN ('unpaid', 'paid', 'refunded')),
  stripe_session_id TEXT,
  notes             TEXT,
  created_at        TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT no_overlap EXCLUDE USING gist (
    car_id WITH =,
    daterange(start_date, end_date, '[)') WITH &&
  )
);

-- ──────────────────────────────────────────
-- ROW LEVEL SECURITY
-- ──────────────────────────────────────────
ALTER TABLE public.profiles  ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cars      ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings  ENABLE ROW LEVEL SECURITY;

-- Profiles
DROP POLICY IF EXISTS "Public profiles visible to all" ON public.profiles;
DROP POLICY IF EXISTS "Users insert own profile"        ON public.profiles;
DROP POLICY IF EXISTS "Users update own profile"        ON public.profiles;

CREATE POLICY "Public profiles visible to all"
  ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users insert own profile"
  ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "Users update own profile"
  ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- Cars
DROP POLICY IF EXISTS "Cars visible to all"   ON public.cars;
DROP POLICY IF EXISTS "Owners insert own cars" ON public.cars;
DROP POLICY IF EXISTS "Owners update own cars" ON public.cars;
DROP POLICY IF EXISTS "Owners delete own cars" ON public.cars;

CREATE POLICY "Cars visible to all"
  ON public.cars FOR SELECT USING (true);
CREATE POLICY "Owners insert own cars"
  ON public.cars FOR INSERT WITH CHECK (auth.uid() = owner_id);
CREATE POLICY "Owners update own cars"
  ON public.cars FOR UPDATE USING (auth.uid() = owner_id);
CREATE POLICY "Owners delete own cars"
  ON public.cars FOR DELETE USING (auth.uid() = owner_id);

-- Bookings
DROP POLICY IF EXISTS "Users see own bookings"             ON public.bookings;
DROP POLICY IF EXISTS "Authenticated users create bookings" ON public.bookings;
DROP POLICY IF EXISTS "Users cancel own bookings"          ON public.bookings;

CREATE POLICY "Users see own bookings"
  ON public.bookings FOR SELECT
  USING (
    auth.uid() = user_id OR
    auth.uid() = (SELECT owner_id FROM public.cars WHERE id = car_id)
  );
CREATE POLICY "Authenticated users create bookings"
  ON public.bookings FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users cancel own bookings"
  ON public.bookings FOR UPDATE USING (auth.uid() = user_id);

-- ──────────────────────────────────────────
-- TRIGGERS
-- ──────────────────────────────────────────

-- Auto-update updated_at on cars
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_cars_updated ON public.cars;
CREATE TRIGGER on_cars_updated
  BEFORE UPDATE ON public.cars
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data->>'full_name'
  );
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
