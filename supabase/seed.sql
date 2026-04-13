-- AvtoGo Seed Data
-- Run this AFTER 001_initial_schema.sql
-- Note: Insert sample cars using a placeholder owner_id
-- Replace '00000000-0000-0000-0000-000000000001' with a real user ID from your auth.users table

-- Sample Cars
INSERT INTO public.cars (owner_id, brand, model, year, transmission, fuel_type, price_per_day, location, latitude, longitude, description, images, is_available, airport_delivery, rating, total_reviews)
VALUES
  (
    '00000000-0000-0000-0000-000000000001',
    'Toyota', 'Camry', 2022, 'automatic', 'petrol', 75.00,
    'Baku', 40.4093, 49.8671,
    'Comfortable and reliable Toyota Camry. Great for city driving and long trips. Full insurance included.',
    ARRAY['https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=800'],
    true, true, 4.8, 24
  ),
  (
    '00000000-0000-0000-0000-000000000001',
    'Mercedes-Benz', 'E-Class', 2021, 'automatic', 'petrol', 150.00,
    'Baku', 40.4093, 49.8671,
    'Luxury Mercedes E-Class. Perfect for business travel or special occasions. Leather seats, panoramic roof.',
    ARRAY['https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=800'],
    true, true, 4.9, 18
  ),
  (
    '00000000-0000-0000-0000-000000000001',
    'Hyundai', 'Tucson', 2023, 'automatic', 'petrol', 90.00,
    'Baku', 40.4093, 49.8671,
    'Modern SUV with all-wheel drive. Ideal for families or weekend getaways outside the city.',
    ARRAY['https://images.unsplash.com/photo-1633438840694-a10d9d22eb42?w=800'],
    true, false, 4.7, 31
  ),
  (
    '00000000-0000-0000-0000-000000000001',
    'Kia', 'Rio', 2022, 'manual', 'petrol', 45.00,
    'Ganja', 40.6828, 46.3606,
    'Affordable and fuel-efficient. Great for budget-conscious travelers visiting Ganja.',
    ARRAY['https://images.unsplash.com/photo-1609521263047-f8f205293f24?w=800'],
    true, false, 4.5, 12
  ),
  (
    '00000000-0000-0000-0000-000000000001',
    'Tesla', 'Model 3', 2023, 'automatic', 'electric', 120.00,
    'Baku', 40.4093, 49.8671,
    'Tesla Model 3 Long Range. Zero emissions, full autopilot. Charging at pickup included.',
    ARRAY['https://images.unsplash.com/photo-1560958089-b8a1929cea89?w=800'],
    true, true, 5.0, 9
  ),
  (
    '00000000-0000-0000-0000-000000000001',
    'Lada', 'Niva', 2020, 'manual', 'petrol', 35.00,
    'Sheki', 41.1934, 47.1706,
    'Rugged 4x4 for mountain roads. Perfect for exploring the Caucasus region. Very fuel efficient.',
    ARRAY['https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=800'],
    true, false, 4.3, 7
  );
