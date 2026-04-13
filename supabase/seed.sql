-- Sample seed data for development
-- Run AFTER the migration and AFTER creating at least one auth user

-- Insert a sample owner profile (replace UUID with a real auth.users id)
-- INSERT INTO public.profiles (id, full_name, phone, role, whatsapp)
-- VALUES ('your-auth-user-uuid', 'Elçin Məmmədov', '+994501234567', 'owner', '+994501234567');

-- Sample cars (replace owner_id with a real profile id)
-- INSERT INTO public.cars (owner_id, brand, model, year, transmission, fuel_type, price_per_day, location, description, images)
-- VALUES
--   ('owner-uuid', 'Toyota', 'Camry', 2022, 'automatic', 'petrol', 80, 'Baku', 'Comfortable sedan for city driving.', ARRAY['https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=800']),
--   ('owner-uuid', 'BMW',    '5 Series', 2023, 'automatic', 'petrol', 150, 'Baku', 'Premium business class sedan.', ARRAY['https://images.unsplash.com/photo-1555215695-3004980ad54e?w=800']),
--   ('owner-uuid', 'Kia',   'Sportage', 2023, 'automatic', 'petrol', 90, 'Baku', 'Spacious SUV perfect for families.', ARRAY['https://images.unsplash.com/photo-1606016159991-dfe4f2746ad5?w=800']);
