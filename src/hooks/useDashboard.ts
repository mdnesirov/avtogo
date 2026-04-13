'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import type { Car, Booking } from '@/types';

export function useDashboard(userId: string | undefined) {
  const [cars, setCars] = useState<Car[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) return;

    async function fetchDashboardData() {
      setLoading(true);
      const supabase = createClient();

      // Fetch owner's cars
      const { data: carsData } = await supabase
        .from('cars')
        .select('*')
        .eq('owner_id', userId)
        .order('created_at', { ascending: false });

      // Fetch bookings for owner's cars
      const { data: bookingsData } = await supabase
        .from('bookings')
        .select('*, car:cars(brand, model, year), user:profiles(full_name, phone)')
        .in('car_id', (carsData ?? []).map((c) => c.id))
        .order('created_at', { ascending: false });

      setCars((carsData ?? []) as Car[]);
      setBookings((bookingsData ?? []) as Booking[]);
      setLoading(false);
    }

    fetchDashboardData();
  }, [userId]);

  async function deleteCar(carId: string) {
    const supabase = createClient();
    const { error } = await supabase.from('cars').delete().eq('id', carId);
    if (!error) {
      setCars((prev) => prev.filter((c) => c.id !== carId));
    }
    return { error };
  }

  async function updateBookingStatus(bookingId: string, status: string) {
    const supabase = createClient();
    const { error } = await supabase
      .from('bookings')
      .update({ status })
      .eq('id', bookingId);
    if (!error) {
      setBookings((prev) =>
        prev.map((b) => (b.id === bookingId ? { ...b, status: status as Booking['status'] } : b))
      );
    }
    return { error };
  }

  return { cars, bookings, loading, deleteCar, updateBookingStatus };
}
