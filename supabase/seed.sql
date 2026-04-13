-- Sample data for local development
-- Run AFTER migrations and AFTER creating at least one user via Supabase Auth

-- Insert sample cars (replace owner_id with a real user UUID after sign-up)
/*
INSERT INTO public.cars (owner_id, brand, model, year, transmission, fuel_type, price_per_day, location, description, is_available, airport_delivery)
VALUES
  ('YOUR-USER-UUID', 'Toyota', 'Camry', 2022, 'automatic', 'petrol', 80, 'Baku', 'Clean and comfortable. Perfect for city and highway.', true, true),
  ('YOUR-USER-UUID', 'Hyundai', 'Tucson', 2021, 'automatic', 'diesel', 100, 'Baku', 'Spacious SUV. Great for families.', true, false),
  ('YOUR-USER-UUID', 'Kia', 'Sportage', 2020, 'automatic', 'petrol', 90, 'Ganja', 'Well-maintained. Non-smoker car.', true, false),
  ('YOUR-USER-UUID', 'Volkswagen', 'Passat', 2019, 'manual', 'diesel', 70, 'Sumqayit', 'Economic and reliable.', true, true);
*/

-- Note: Uncomment and replace YOUR-USER-UUID with a real user ID from auth.users
