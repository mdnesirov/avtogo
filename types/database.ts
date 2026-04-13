export type Json = string | number | boolean | null | { [key: string]: Json } | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string
          full_name: string | null
          phone: string | null
          role: 'owner' | 'renter'
          created_at: string
        }
        Insert: {
          id: string
          email: string
          full_name?: string | null
          phone?: string | null
          role?: 'owner' | 'renter'
          created_at?: string
        }
        Update: {
          full_name?: string | null
          phone?: string | null
          role?: 'owner' | 'renter'
        }
      }
      cars: {
        Row: {
          id: string
          owner_id: string
          car_name: string
          brand: string
          model: string
          year: number
          car_type: string | null
          transmission: 'manual' | 'automatic'
          fuel_type: 'petrol' | 'diesel' | 'electric' | 'hybrid'
          price_per_day: number
          location: string
          city: string | null
          description: string | null
          images: string[]
          airport_delivery: boolean
          whatsapp_phone: string | null
          rating: number
          review_count: number
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['cars']['Row'], 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['cars']['Insert']>
      }
      bookings: {
        Row: {
          id: string
          user_id: string
          car_id: string
          start_date: string
          end_date: string
          total_price: number
          status: 'pending' | 'confirmed' | 'cancelled' | 'completed'
          driver_name: string
          driver_phone: string
          driver_email: string
          driver_license: string | null
          airport_delivery: boolean
          payment_status: 'unpaid' | 'paid' | 'refunded'
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['bookings']['Row'], 'id' | 'created_at'>
        Update: Partial<Database['public']['Tables']['bookings']['Insert']>
      }
    }
  }
}
