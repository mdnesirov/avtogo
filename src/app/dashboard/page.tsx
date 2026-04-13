'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import { Car, Booking } from '@/types';
import { CarCard } from '@/components/cars/CarCard';
import { Badge } from '@/components/shared/Badge';
import { Button } from '@/components/shared/Button';
import { formatPrice, formatDate } from '@/lib/utils';

type TabKey = 'cars' | 'bookings';

const STATUS_VARIANT: Record<string, 'green' | 'yellow' | 'red' | 'gray' | 'blue'> = {
  confirmed: 'green',
  pending:   'yellow',
  cancelled: 'red',
  completed: 'blue',
};

export default function DashboardPage() {
  const router = useRouter();
  const [tab, setTab]         = useState<TabKey>('cars');
  const [cars, setCars]       = useState<Car[]>([]);
  const [bookings, setBookings] = useState<(Booking & { car: Car })[]>([]);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId]   = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) { router.push('/auth/login?redirect=/dashboard'); return; }
      setUserId(user.id);

      const [carsRes, bookingsRes] = await Promise.all([
        supabase.from('cars').select('*').eq('owner_id', user.id).order('created_at', { ascending: false }),
        supabase.from('bookings').select('*, car:cars(*)').eq('user_id', user.id).order('created_at', { ascending: false }),
      ]);

      if (carsRes.data)     setCars(carsRes.data as Car[]);
      if (bookingsRes.data) setBookings(bookingsRes.data as (Booking & { car: Car })[]);
      setLoading(false);
    })();
  }, [router]);

  async function handleDelete(carId: string) {
    if (!confirm('Delete this listing?')) return;
    const supabase = createClient();
    await supabase.from('cars').delete().eq('id', carId);
    setCars((prev) => prev.filter((c) => c.id !== carId));
  }

  if (loading) {
    return (
      <div className="pt-16 min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-green-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="pt-16 min-h-screen bg-gray-50">
      <div className="container py-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-gray-500 mt-1">Manage your cars and bookings</p>
          </div>
          <Button href="/list-car">+ List a car</Button>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 bg-white rounded-xl border border-gray-200 p-1 w-fit mb-8">
          {(['cars', 'bookings'] as TabKey[]).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-5 py-2 rounded-lg text-sm font-medium capitalize transition-colors ${
                tab === t
                  ? 'bg-green-600 text-white'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              {t === 'cars' ? `My Cars (${cars.length})` : `My Bookings (${bookings.length})`}
            </button>
          ))}
        </div>

        {/* My Cars */}
        {tab === 'cars' && (
          <div>
            {cars.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-24 text-center bg-white rounded-2xl border border-gray-200">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-gray-300 mb-4">
                  <path d="M5 17H3a2 2 0 01-2-2V9a2 2 0 012-2h2l3-4h8l3 4h2a2 2 0 012 2v6a2 2 0 01-2 2h-2" />
                  <circle cx="7.5" cy="17.5" r="2.5" />
                  <circle cx="16.5" cy="17.5" r="2.5" />
                </svg>
                <h3 className="font-semibold text-gray-800 mb-1">No cars listed yet</h3>
                <p className="text-gray-500 text-sm mb-6">Start earning by listing your first car.</p>
                <Button href="/list-car">List your first car</Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {cars.map((car) => (
                  <CarCard
                    key={car.id}
                    car={car}
                    showOwnerActions
                    onEdit={(c) => router.push(`/list-car/edit/${c.id}`)}
                    onDelete={handleDelete}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {/* My Bookings */}
        {tab === 'bookings' && (
          <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
            {bookings.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-24 text-center">
                <h3 className="font-semibold text-gray-800 mb-1">No bookings yet</h3>
                <p className="text-gray-500 text-sm mb-6">Browse available cars and make your first booking.</p>
                <Button href="/cars" variant="secondary">Browse cars</Button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      {['Car', 'Dates', 'Total', 'Status', ''].map((h) => (
                        <th key={h} className="text-left px-5 py-3 font-medium text-gray-500 text-xs uppercase tracking-wide">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {bookings.map((b) => (
                      <tr key={b.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-5 py-4 font-medium text-gray-900">
                          {b.car?.brand} {b.car?.model}
                        </td>
                        <td className="px-5 py-4 text-gray-600">
                          {formatDate(b.start_date)} &rarr; {formatDate(b.end_date)}
                        </td>
                        <td className="px-5 py-4 font-semibold text-gray-900">
                          {formatPrice(b.total_price)}
                        </td>
                        <td className="px-5 py-4">
                          <Badge variant={STATUS_VARIANT[b.status] ?? 'gray'}>
                            {b.status}
                          </Badge>
                        </td>
                        <td className="px-5 py-4">
                          <Link
                            href={`/cars/${b.car_id}`}
                            className="text-green-600 hover:text-green-700 font-medium"
                          >
                            View &rarr;
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
