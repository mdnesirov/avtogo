export type Transmission = 'automatic' | 'manual';
export type FuelType = 'petrol' | 'diesel' | 'electric' | 'hybrid';

export interface CarFilters {
  city?: string;
  location?: string;
  minPrice?: number;
  maxPrice?: number;
  carType?: string;
  transmission?: Transmission;
  fuelType?: FuelType;
  startDate?: string;
  endDate?: string;
  airportDelivery?: boolean;
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
  city?: string;
  location: string;
  latitude: number | null;
  longitude: number | null;
  description: string | null;
  images: string[];
  is_available: boolean;
  is_active?: boolean;
  airport_delivery: boolean;
  rating: number;
  total_reviews: number;
  car_name?: string;
  car_type?: string;
  created_at: string;
}
