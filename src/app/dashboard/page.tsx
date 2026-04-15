import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import MyCars from '@/components/dashboard/MyCars';
import MyBookings from '@/components/dashboard/MyBookings';
import { Car, Plus } from 'lucide-react';

const OWNER_BOOKING_STATUSES = ['confirmed', 'cancelled'] as const;

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect('/auth/login');

  const { data: cars } = await supabase
    .from('cars')
    .select('id, brand, model, year, location, price_per_day, is_available, images')
    .eq('owner_id', user.id)
    .order('created_at', { ascending: false });

  const carIds = cars?.map((car) => car.id) ?? [];
  const bookings = carIds.length > 0
    ? (await supabase
      .from('bookings')
      .select('id, car_id, start_date, end_date, total_price, status, notes, driver_name, driver_phone, car:cars(brand, model, images), user:profiles(full_name, phone)')
      .in('car_id', carIds)
      .order('created_at', { ascending: false })).data
    : [];

  async function toggleCarAvailabilityAction(formData: FormData) {
    'use server';

    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) redirect('/auth/login');

    const carId = formData.get('carId');
    if (typeof carId !== 'string') return;

    const { data: car } = await supabase
      .from('cars')
      .select('is_available')
      .eq('id', carId)
      .eq('owner_id', user.id)
      .single();
    if (!car) return;

    await supabase
      .from('cars')
      .update({ is_available: !car.is_available })
      .eq('id', carId)
      .eq('owner_id', user.id);

    revalidatePath('/dashboard');
  }

  async function deleteCarAction(formData: FormData) {
    'use server';

    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) redirect('/auth/login');

    const carId = formData.get('carId');
    if (typeof carId !== 'string') return;

    await supabase
      .from('cars')
      .delete()
      .eq('id', carId)
      .eq('owner_id', user.id);

    revalidatePath('/dashboard');
  }

  async function updateBookingStatusAction(formData: FormData) {
    'use server';

    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) redirect('/auth/login');

    const bookingId = formData.get('bookingId');
    const status = formData.get('status');
    const isValidStatus = typeof status === 'string'
      && OWNER_BOOKING_STATUSES.includes(status as (typeof OWNER_BOOKING_STATUSES)[number]);
    if (
      typeof bookingId !== 'string'
      || !isValidStatus
    ) return;

    const { data: ownerCars } = await supabase
      .from('cars')
      .select('id')
      .eq('owner_id', user.id);
    const ownerCarIds = ownerCars?.map((car) => car.id) ?? [];
    if (ownerCarIds.length === 0) return;

    await supabase
      .from('bookings')
      .update({ status })
      .eq('id', bookingId)
      .in('car_id', ownerCarIds);

    revalidatePath('/dashboard');
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
      <div className="flex items-center justify-between mb-10">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-500 text-sm mt-1">{user.email}</p>
        </div>
        <Link
          href="/list-car"
          className="inline-flex items-center gap-2 bg-green-600 text-white px-4 py-2.5 rounded-xl text-sm font-medium hover:bg-green-700 transition-colors"
        >
          <Plus size={16} /> List a car
        </Link>
      </div>

      {/* My Cars */}
      <section className="mb-12">
        <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Car size={18} className="text-green-600" /> My Listings
        </h2>
        <MyCars
          cars={cars ?? []}
          toggleCarAvailabilityAction={toggleCarAvailabilityAction}
          deleteCarAction={deleteCarAction}
        />
      </section>

      {/* My Bookings */}
      <section>
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Incoming Bookings</h2>
        <MyBookings
          bookings={bookings ?? []}
          mode="owner"
          updateBookingStatusAction={updateBookingStatusAction}
        />
      </section>
    </div>
  );
}
