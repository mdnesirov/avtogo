import type { Database } from './database'

export type Car = Database['public']['Tables']['cars']['Row']
export type CarInsert = Database['public']['Tables']['cars']['Insert']
export type CarUpdate = Database['public']['Tables']['cars']['Update']

export type CarType = 'sedan' | 'suv' | 'hatchback' | 'coupe' | 'minivan' | 'pickup' | 'convertible'
export type Transmission = 'manual' | 'automatic'
export type FuelType = 'petrol' | 'diesel' | 'electric' | 'hybrid'

export interface CarFilters {
  city?: string
  minPrice?: number
  maxPrice?: number
  carType?: CarType
  transmission?: Transmission
  fuelType?: FuelType
  airportDelivery?: boolean
  startDate?: string
  endDate?: string
}
