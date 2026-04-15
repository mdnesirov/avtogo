export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          full_name: string | null
          phone: string | null
          avatar_url: string | null
          role: 'owner' | 'renter' | 'both'
          whatsapp: string | null
          created_at: string
        }
        Insert: {
          id: string
          full_name?: string | null
          phone?: string | null
          avatar_url?: string | null
          role?: 'owner' | 'renter' | 'both'
          whatsapp?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          full_name?: string | null
          phone?: string | null
          avatar_url?: string | null
          role?: 'owner' | 'renter' | 'both'
          whatsapp?: string | null
          created_at?: string
        }
      }
      cars: {
        Row: {
          id: string
          owner_id: string
          brand: string
          model: string
          year: number
          transmission: 'automatic' | 'manual'
          fuel_type: 'petrol' | 'diesel' | 'electric' | 'hybrid'
          price_per_day: number
          location: string
          latitude: number | null
          longitude: number | null
          description: string | null
          images: string[]
          is_available: boolean
          airport_delivery: boolean
          rating: number
          total_reviews: number
          created_at: string
        }
        Insert: {
          id?: string
          owner_id: string
          brand: string
          model: string
          year: number
          transmission: 'automatic' | 'manual'
          fuel_type: 'petrol' | 'diesel' | 'electric' | 'hybrid'
          price_per_day: number
          location: string
          latitude?: number | null
          longitude?: number | null
          description?: string | null
          images?: string[]
          is_available?: boolean
          airport_delivery?: boolean
          rating?: number
          total_reviews?: number
          created_at?: string
        }
        Update: {
          id?: string
          owner_id?: string
          brand?: string
          model?: string
          year?: number
          transmission?: 'automatic' | 'manual'
          fuel_type?: 'petrol' | 'diesel' | 'electric' | 'hybrid'
          price_per_day?: number
          location?: string
          latitude?: number | null
          longitude?: number | null
          description?: string | null
          images?: string[]
          is_available?: boolean
          airport_delivery?: boolean
          rating?: number
          total_reviews?: number
          created_at?: string
        }
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
          driver_license: string | null
          stripe_session_id: string | null
          notes: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          car_id: string
          start_date: string
          end_date: string
          total_price: number
          status?: 'pending' | 'confirmed' | 'cancelled' | 'completed'
          driver_name: string
          driver_phone: string
          driver_license?: string | null
          stripe_session_id?: string | null
          notes?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          car_id?: string
          start_date?: string
          end_date?: string
          total_price?: number
          status?: 'pending' | 'confirmed' | 'cancelled' | 'completed'
          driver_name?: string
          driver_phone?: string
          driver_license?: string | null
          stripe_session_id?: string | null
          notes?: string | null
          created_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}
