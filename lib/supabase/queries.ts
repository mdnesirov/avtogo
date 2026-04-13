import type { SupabaseClient } from '@supabase/supabase-js'
import type { CarFilters } from '@/types/car'

export async function getCars(supabase: SupabaseClient, filters?: CarFilters) {
  let query = supabase
    .from('cars')
    .select('*')
    .eq('is_active', true)
    .order('created_at', { ascending: false })

  if (filters?.city) query = query.ilike('city', `%${filters.city}%`)
  if (filters?.minPrice) query = query.gte('price_per_day', filters.minPrice)
  if (filters?.maxPrice) query = query.lte('price_per_day', filters.maxPrice)
  if (filters?.carType) query = query.eq('car_type', filters.carType)
  if (filters?.transmission) query = query.eq('transmission', filters.transmission)
  if (filters?.fuelType) query = query.eq('fuel_type', filters.fuelType)
  if (filters?.airportDelivery) query = query.eq('airport_delivery', true)

  return query
}

export async function getCarById(supabase: SupabaseClient, id: string) {
  return supabase.from('cars').select('*').eq('id', id).single()
}

export async function getOwnerCars(supabase: SupabaseClient, ownerId: string) {
  return supabase
    .from('cars')
    .select('*')
    .eq('owner_id', ownerId)
    .order('created_at', { ascending: false })
}

export async function getBookingsForCar(supabase: SupabaseClient, carId: string) {
  return supabase
    .from('bookings')
    .select('*')
    .eq('car_id', carId)
    .in('status', ['pending', 'confirmed'])
    .order('start_date', { ascending: true })
}

export async function checkBookingConflict(
  supabase: SupabaseClient,
  carId: string,
  startDate: string,
  endDate: string
): Promise<boolean> {
  const { data } = await supabase
    .from('bookings')
    .select('id')
    .eq('car_id', carId)
    .in('status', ['pending', 'confirmed'])
    .or(`start_date.lte.${endDate},end_date.gte.${startDate}`)

  return (data?.length ?? 0) > 0
}

export async function getOwnerBookings(supabase: SupabaseClient, ownerId: string) {
  return supabase
    .from('bookings')
    .select('*, cars!inner(car_name, brand, model, owner_id)')
    .eq('cars.owner_id', ownerId)
    .order('created_at', { ascending: false })
}
