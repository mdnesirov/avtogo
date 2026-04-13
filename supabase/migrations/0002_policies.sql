-- Row Level Security Policies

-- Enable RLS
alter table public.profiles enable row level security;
alter table public.cars enable row level security;
alter table public.bookings enable row level security;

-- PROFILES
create policy "Users can view own profile"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Users can update own profile"
  on public.profiles for update
  using (auth.uid() = id);

-- CARS: Anyone can browse active listings
create policy "Public can view active cars"
  on public.cars for select
  using (is_active = true);

-- Owners manage their own cars
create policy "Owners can insert cars"
  on public.cars for insert
  with check (auth.uid() = owner_id);

create policy "Owners can update their cars"
  on public.cars for update
  using (auth.uid() = owner_id);

create policy "Owners can delete their cars"
  on public.cars for delete
  using (auth.uid() = owner_id);

-- Owners can view their own inactive listings too
create policy "Owners can view all their cars"
  on public.cars for select
  using (auth.uid() = owner_id);

-- BOOKINGS
-- Renters can create bookings for themselves
create policy "Renters can create bookings"
  on public.bookings for insert
  with check (auth.uid() = user_id);

-- Renters can view their own bookings
create policy "Renters can view own bookings"
  on public.bookings for select
  using (auth.uid() = user_id);

-- Owners can view bookings for their cars
create policy "Owners can view bookings for their cars"
  on public.bookings for select
  using (
    exists (
      select 1 from public.cars
      where cars.id = bookings.car_id
        and cars.owner_id = auth.uid()
    )
  );

-- Owners can update booking status
create policy "Owners can update booking status"
  on public.bookings for update
  using (
    exists (
      select 1 from public.cars
      where cars.id = bookings.car_id
        and cars.owner_id = auth.uid()
    )
  );
