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
  brand: string;
  model: string;
  year: number;
  transmission: Transmission;
  fuel_type: FuelType;
  price_per_day: number;
  location: string;
  latitude: number | null;
  longitude: number | null;
  description: string | null;
  images: string[];
  is_available: boolean;
  airport_delivery: boolean;
  rating: number;
  total_reviews: number;
  created_at: string;
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
