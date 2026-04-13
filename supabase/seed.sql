-- Sample seed data for development
-- Run AFTER the migration

-- Note: profiles are auto-created via trigger when users sign up.
-- These INSERTs assume you have already created users via Supabase Auth
-- and have their UUIDs. Replace the UUIDs below with real ones.

-- Example car listings (replace owner_id with a real profile UUID)
/*
INSERT INTO public.cars (owner_id, brand, model, year, transmission, fuel_type, price_per_day, location, description, airport_delivery)
VALUES
  ('YOUR-UUID-HERE', 'Toyota', 'Camry', 2022, 'automatic', 'petrol', 80, 'Baku', 'Clean and comfortable sedan, perfect for city driving.', true),
  ('YOUR-UUID-HERE', 'Hyundai', 'Tucson', 2023, 'automatic', 'petrol', 100, 'Baku', 'Spacious SUV with all the latest features.', true),
  ('YOUR-UUID-HERE', 'BMW', '5 Series', 2021, 'automatic', 'petrol', 150, 'Baku', 'Premium executive sedan.', false),
  ('YOUR-UUID-HERE', 'Kia', 'Sportage', 2022, 'automatic', 'diesel', 90, 'Ganja', 'Great fuel economy, ideal for long trips.', false);
*/
