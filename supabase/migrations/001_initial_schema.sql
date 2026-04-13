-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ──────────────────────────────────────────
-- PROFILES (extends Supabase auth.users)
-- ──────────────────────────────────────────
CREATE TABLE public.profiles (
  id          UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name   TEXT,
  phone       TEXT,
  avatar_url  TEXT,
  role        TEXT NOT NULL DEFAULT 'renter' CHECK (role IN ('owner', 'renter', 'both')),
  whatsapp    TEXT,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- ──────────────────────────────────────────
-- CARS
-- ──────────────────────────────────────────
CREATE TABLE public.cars (
  id               UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  owner_id         UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  brand            TEXT NOT NULL,
  model            TEXT NOT NULL,
  year             INTEGER NOT NULL,
  transmission     TEXT NOT NULL CHECK (transmission IN ('automatic', 'manual')),
  fuel_type        TEXT NOT NULL CHECK (fuel_type IN ('petrol', 'diesel', 'electric', 'hybrid')),
  price_per_day    NUMERIC(10,2) NOT NULL,
  location         TEXT NOT NULL,
  latitude         NUMERIC(10,6),
  longitude        NUMERIC(10,6),
  description      TEXT,
  images           TEXT[] DEFAULT '{}',
  is_available     BOOLEAN DEFAULT TRUE,
  airport_delivery BOOLEAN DEFAULT FALSE,
  rating           NUMERIC(3,2) DEFAULT 0,
  total_reviews    INTEGER DEFAULT 0,
  created_at       TIMESTAMPTZ DEFAULT NOW()
);

-- ──────────────────────────────────────────
-- BOOKINGS
-- ──────────────────────────────────────────
CREATE TABLE public.bookings (
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
  driver_license    TEXT,
  stripe_session_id TEXT,
  notes             TEXT,
  created_at        TIMESTAMPTZ DEFAULT NOW()
);

-- ──────────────────────────────────────────
-- ROW LEVEL SECURITY
-- ──────────────────────────────────────────
ALTER TABLE public.profiles  ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cars      ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings  ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public profiles visible to all"
  ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users insert own profile"
  ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "Users update own profile"
  ON public.profiles FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Cars visible to all"
  ON public.cars FOR SELECT USING (true);
CREATE POLICY "Owners insert own cars"
  ON public.cars FOR INSERT WITH CHECK (auth.uid() = owner_id);
CREATE POLICY "Owners update own cars"
  ON public.cars FOR UPDATE USING (auth.uid() = owner_id);
CREATE POLICY "Owners delete own cars"
  ON public.cars FOR DELETE USING (auth.uid() = owner_id);

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
-- AUTO-CREATE PROFILE ON SIGNUP
-- ──────────────────────────────────────────
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name)
  VALUES (new.id, new.raw_user_meta_data->>'full_name');
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
