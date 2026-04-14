-- AvtoGo Seed Data
-- Run AFTER 001_initial_schema.sql
-- Replace the placeholder UUID below with a real user ID from your auth.users table
-- To get your user ID: Supabase Dashboard → Authentication → Users → copy the UUID

-- ⚠️  IMPORTANT: Replace this with your real user UUID before running
DO $$
DECLARE
  owner_uuid UUID := '00000000-0000-0000-0000-000000000001'; -- REPLACE THIS
BEGIN

-- First insert the owner profile (skip if already exists)
INSERT INTO public.profiles (id, full_name, email, role, whatsapp)
VALUES (owner_uuid, 'AvtoGo Demo', 'demo@avtogo.az', 'owner', '+994501234567')
ON CONFLICT (id) DO NOTHING;

-- Sample Cars in Azerbaijan
INSERT INTO public.cars
  (owner_id, brand, model, year, car_type, transmission, fuel_type, price_per_day,
   location, city, latitude, longitude, description, images, is_available, airport_delivery,
   whatsapp_phone, rating, total_reviews)
VALUES
  (owner_uuid, 'Toyota', 'Camry', 2022, 'sedan', 'automatic', 'petrol', 75.00,
   'Baku City Centre', 'Baku', 40.4093, 49.8671,
   'Comfortable and reliable Toyota Camry. Full insurance included. Perfect for city and long trips.',
   ARRAY['https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=800'], true, true,
   '+994501234567', 4.8, 24),

  (owner_uuid, 'Mercedes-Benz', 'E-Class', 2021, 'sedan', 'automatic', 'petrol', 150.00,
   'Baku White City', 'Baku', 40.4093, 49.8671,
   'Luxury Mercedes E-Class. Business travel or special occasions. Leather seats, panoramic roof.',
   ARRAY['https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=800'], true, true,
   '+994501234567', 4.9, 18),

  (owner_uuid, 'Hyundai', 'Tucson', 2023, 'suv', 'automatic', 'petrol', 90.00,
   'Baku Narimanov', 'Baku', 40.4200, 49.8700,
   'Modern SUV with AWD. Ideal for families or weekend trips outside the city.',
   ARRAY['https://images.unsplash.com/photo-1633438840694-a10d9d22eb42?w=800'], true, false,
   '+994501234567', 4.7, 31),

  (owner_uuid, 'Tesla', 'Model 3', 2023, 'sedan', 'automatic', 'electric', 120.00,
   'Baku Boulevard', 'Baku', 40.3663, 49.8370,
   'Tesla Model 3 Long Range. Zero emissions, autopilot. Charging at pickup included.',
   ARRAY['https://images.unsplash.com/photo-1560958089-b8a1929cea89?w=800'], true, true,
   '+994501234567', 5.0, 9),

  (owner_uuid, 'Kia', 'Rio', 2022, 'hatchback', 'manual', 'petrol', 45.00,
   'Ganja City Centre', 'Ganja', 40.6828, 46.3606,
   'Affordable and fuel-efficient. Great for budget travelers visiting Ganja.',
   ARRAY['https://images.unsplash.com/photo-1609521263047-f8f205293f24?w=800'], true, false,
   '+994551234567', 4.5, 12),

  (owner_uuid, 'Lada', 'Niva', 2020, 'suv', 'manual', 'petrol', 35.00,
   'Sheki Old Town', 'Sheki', 41.1934, 47.1706,
   'Rugged 4x4 for mountain roads. Explore the Caucasus. Very fuel efficient.',
   ARRAY['https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=800'], true, false,
   '+994701234567', 4.3, 7),

  (owner_uuid, 'BMW', 'X5', 2022, 'suv', 'automatic', 'diesel', 180.00,
   'Baku Sahil', 'Baku', 40.3777, 49.8519,
   'Premium BMW X5 diesel. Spacious luxury SUV, great for airport runs and long distances.',
   ARRAY['https://images.unsplash.com/photo-1555215695-3004980ad54e?w=800'], true, true,
   '+994501234567', 4.8, 15);

END $$;
