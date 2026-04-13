import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import CarCard from '@/components/cars/CarCard';
import { BookingStatusBadge } from '@/components/shared/Badge';
import { formatDate, formatPrice } from '@/lib/utils';
import { Car, Plus } from 'lucide-react';

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect('/auth/login');

  const [{ data: myCars }, { data: myBookings }] = await Promise.all([
    supabase.from('cars').select('*').eq('owner_id', user.id).order('created_at', { ascending: false }),
    supabase.from('bookings').select('*, car:cars(brand, model, images)').eq('user_id', user.id).order('created_at', { ascending: false }).limit(10),
  ]);

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
        {myCars && myCars.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {myCars.map((car) => (
              <CarCard key={car.id} car={car} showOwnerActions />
            ))}
          </div>
        ) : (
          <div className="bg-gray-50 rounded-2xl p-12 text-center text-gray-400">
            <Car size={32} className="mx-auto mb-3 text-gray-300" />
            <p className="font-medium">No listings yet</p>
            <Link href="/list-car" className="text-green-600 text-sm mt-1 inline-block hover:text-green-700">
              Add your first car →
            </Link>
          </div>
        )}
      </section>

      {/* My Bookings */}
      <section>
        <h2 className="text-lg font-semibold text-gray-900 mb-4">My Bookings</h2>
        {myBookings && myBookings.length > 0 ? (
          <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-left">
                <tr>
                  <th className="px-5 py-3 font-medium text-gray-500">Car</th>
                  <th className="px-5 py-3 font-medium text-gray-500">Dates</th>
                  <th className="px-5 py-3 font-medium text-gray-500">Total</th>
                  <th className="px-5 py-3 font-medium text-gray-500">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {myBookings.map((booking) => (
                  <tr key={booking.id} className="hover:bg-gray-50">
                    <td className="px-5 py-3 font-medium text-gray-900">
                      {booking.car?.brand} {booking.car?.model}
                    </td>
                    <td className="px-5 py-3 text-gray-500">
                      {formatDate(booking.start_date)} — {formatDate(booking.end_date)}
                    </td>
                    <td className="px-5 py-3 font-medium">{formatPrice(booking.total_price)}</td>
                    <td className="px-5 py-3"><BookingStatusBadge status={booking.status} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="bg-gray-50 rounded-2xl p-12 text-center text-gray-400">
            <p className="font-medium">No bookings yet</p>
            <Link href="/cars" className="text-green-600 text-sm mt-1 inline-block hover:text-green-700">Browse cars →</Link>
          </div>
        )}
      </section>
    </div>
  );
}
