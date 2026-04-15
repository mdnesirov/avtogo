import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import DashboardClient from './DashboardClient';
import { Plus } from 'lucide-react';

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect('/auth/login');

  // Step 1: fetch user profile + cars
  const [{ data: myCars }, { data: profile }] = await Promise.all([
    supabase.from('cars').select('*').eq('owner_id', user.id).order('created_at', { ascending: false }),
    supabase.from('profiles').select('full_name, avatar_url').eq('id', user.id).single(),
  ]);

  const carIds: string[] = (myCars ?? []).map((c: any) => c.id);

  // Step 2: fetch bookings in parallel
  const [{ data: myBookings }, { data: incomingBookings }] = await Promise.all([
    supabase
      .from('bookings')
      .select('*, car:cars(id, brand, model, year, images, price_per_day)')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(20),
    carIds.length > 0
      ? supabase
          .from('bookings')
          .select('*, car:cars(id, brand, model, year, images)')
          .in('car_id', carIds)
          .order('created_at', { ascending: false })
          .limit(30)
      : Promise.resolve({ data: [] }),
  ]);

  const pendingCarIds: string[] = (incomingBookings ?? [])
    .filter((b: any) => b.status === 'pending' || b.status === 'paid')
    .map((b: any) => b.car_id as string);

  const displayName = (profile as any)?.full_name || user.email?.split('@')[0] || 'there';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Welcome back, {displayName} 👋</h1>
          <p className="text-gray-400 text-sm mt-1">{user.email}</p>
        </div>
        <Link
          href="/list-car"
          className="inline-flex items-center gap-2 bg-green-600 text-white px-4 py-2.5 rounded-xl text-sm font-semibold hover:bg-green-700 transition-colors shadow-sm"
        >
          <Plus size={16} /> List a car
        </Link>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-10">
        {[
          { label: 'My Listings', value: (myCars ?? []).length },
          { label: 'My Bookings', value: (myBookings ?? []).length },
          { label: 'Pending Requests', value: (incomingBookings ?? []).filter((b: any) => b.status === 'pending' || b.status === 'paid').length },
          { label: 'Confirmed Trips', value: (incomingBookings ?? []).filter((b: any) => b.status === 'confirmed').length },
        ].map((stat) => (
          <div key={stat.label} className="bg-white border border-gray-100 rounded-2xl px-5 py-4 shadow-sm">
            <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
            <p className="text-xs text-gray-400 mt-0.5">{stat.label}</p>
          </div>
        ))}
      </div>

      <DashboardClient
        cars={myCars ?? []}
        pendingCarIds={pendingCarIds}
        incomingBookings={incomingBookings ?? []}
        myBookings={myBookings ?? []}
      />
    </div>
  );
}
