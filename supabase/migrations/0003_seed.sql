-- Seed Data: Azerbaijan cities and sample cars
-- NOTE: Replace owner_id UUIDs with real user IDs after creating test accounts

-- Insert sample profiles (for dev/testing only)
-- These will be created automatically via the handle_new_user trigger when users sign up

-- Sample cars (for demo purposes -- requires valid owner_id)
-- Run after creating a test account and noting the user UUID

-- Example seed (uncomment and replace <OWNER_UUID> with real UUID):
--
-- insert into public.cars
--   (owner_id, car_name, brand, model, year, car_type, transmission, fuel_type,
--    price_per_day, location, city, description, images, airport_delivery)
-- values
--   ('<OWNER_UUID>', 'Toyota Camry 2022', 'Toyota', 'Camry', 2022,
--    'sedan', 'automatic', 'petrol',
--    70.00, 'Baku, Narimanov District', 'Baku',
--    'Clean comfortable sedan, perfect for city driving and business trips. AC, GPS, USB charging.',
--    '{}', true),
--
--   ('<OWNER_UUID>', 'Hyundai Tucson 2023', 'Hyundai', 'Tucson', 2023,
--    'suv', 'automatic', 'petrol',
--    95.00, 'Baku, Sabail District', 'Baku',
--    'Spacious SUV ideal for trips to Gabala or Shahdag. Full insurance included.',
--    '{}', true),
--
--   ('<OWNER_UUID>', 'Kia Rio 2021', 'Kia', 'Rio', 2021,
--    'hatchback', 'manual', 'petrol',
--    45.00, 'Ganja City Center', 'Ganja',
--    'Budget-friendly compact car for Ganja and nearby regions.',
--    '{}', false);

-- Supported cities (used in dropdown filters)
-- You can create a cities table or just hard-code in the frontend constants.ts
select 'Seed template ready. Replace <OWNER_UUID> with real user IDs and uncomment inserts.' as message;
