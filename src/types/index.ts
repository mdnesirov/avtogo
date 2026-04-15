export type UserRole = 'owner' | 'renter' | 'both';
export type Transmission = 'automatic' | 'manual';
export type FuelType = 'petrol' | 'diesel' | 'electric' | 'hybrid';
export type BookingStatus = 'pending' | 'confirmed' | 'cancelled' | 'completed';

export interface Profile {
  id: string;
  full_name: string | null;
  phone: string | null;
  avatar_url: string | null;
  role: UserRole;
  whatsapp: string | null;
  created_at: string;
}

export interface Car {
  id: string;
  owner_id: string;
  car_name: string | null;
  brand: string;
  model: string;
  year: number;
  car_type: string | null;
  transmission: Transmission;
  fuel_type: FuelType;
  price_per_day: number;
  location: string;
  city: string | null;
  latitude: number | null;
  longitude: number | null;
  description: string | null;
  images: string[];
  is_active: boolean;
  airport_delivery: boolean;
  whatsapp_phone: string | null;
  rating: number | null;
  review_count: number | null;
  requires_deposit: boolean | null;
  deposit_amount: number | null;
  offers_delivery: boolean;
  delivery_fee: number | null;
  offers_airport_delivery: boolean;
  airport_delivery_fee: number | null;
  created_at: string;
  updated_at: string | null;
  owner?: Profile;
}

export interface Booking {
  id: string;
  user_id: string;
  car_id: string;
  start_date: string;
  end_date: string;
  total_price: number;
  status: BookingStatus;
  driver_name: string;
  driver_phone: string;
  driver_license: string | null;
  stripe_session_id: string | null;
  notes: string | null;
  created_at: string;
  car?: Car;
  user?: Profile;
}

export interface CarFilters {
  location?: string;
  minPrice?: number;
  maxPrice?: number;
  transmission?: Transmission;
  fuelType?: FuelType;
  startDate?: string;
  endDate?: string;
  airportDelivery?: boolean;
}
