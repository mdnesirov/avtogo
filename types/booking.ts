import type { Database } from './database'

export type Booking = Database['public']['Tables']['bookings']['Row']
export type BookingInsert = Database['public']['Tables']['bookings']['Insert']
export type BookingStatus = 'pending' | 'confirmed' | 'cancelled' | 'completed'

export interface BookingFormData {
  startDate: string
  endDate: string
  driverName: string
  driverPhone: string
  driverEmail: string
  driverLicense?: string
  airportDelivery: boolean
}
