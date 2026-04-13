-- AvtoGo Database Schema
-- Run in Supabase SQL editor in order: 0001 → 0002 → 0003

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Profiles (extends Supabase Auth users)
create table public.profiles (
  id         uuid primary key references auth.users(id) on delete cascade,
  email      text unique not null,
  full_name  text,
  phone      text,
  role       text not null default 'renter' check (role in ('owner', 'renter')),
  created_at timestamptz default now()
);

-- Cars
create table public.cars (
  id               uuid primary key default gen_random_uuid(),
  owner_id         uuid not null references public.profiles(id) on delete cascade,
  car_name         text not null,
  brand            text not null,
  model            text not null,
  year             int  not null,
  car_type         text,
  transmission     text not null check (transmission in ('manual', 'automatic')),
  fuel_type        text not null check (fuel_type in ('petrol', 'diesel', 'electric', 'hybrid')),
  price_per_day    numeric(10,2) not null,
  location         text not null,
  city             text,
  description      text,
  images           text[] default '{}',
  airport_delivery boolean default false,
  whatsapp_phone   text,
  rating           numeric(2,1) default 5.0,
  review_count     int default 0,
  is_active        boolean default true,
  created_at       timestamptz default now(),
  updated_at       timestamptz default now()
);

-- Bookings
create table public.bookings (
  id               uuid primary key default gen_random_uuid(),
  user_id          uuid not null references public.profiles(id) on delete cascade,
  car_id           uuid not null references public.cars(id) on delete cascade,
  start_date       date not null,
  end_date         date not null,
  total_price      numeric(10,2) not null,
  status           text not null default 'pending'
                     check (status in ('pending', 'confirmed', 'cancelled', 'completed')),
  driver_name      text not null,
  driver_phone     text not null,
  driver_email     text not null,
  driver_license   text,
  airport_delivery boolean default false,
  payment_status   text default 'unpaid'
                     check (payment_status in ('unpaid', 'paid', 'refunded')),
  created_at       timestamptz default now()
);

-- Auto-update updated_at on cars
create or replace function public.handle_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger on_cars_updated
  before update on public.cars
  for each row execute procedure public.handle_updated_at();

-- Auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, email)
  values (new.id, new.email);
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
