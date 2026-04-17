import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import DashboardPageClient from './DashboardPageClient';

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

  const displayName = (profile as any)?.full_name || user.email?.split('@')[0] || '';

  return (
    <DashboardPageClient
      displayName={displayName}
      email={user.email ?? ''}
      stats={{
        listings: (myCars ?? []).length,
        bookings: (myBookings ?? []).length,
        pendingRequests: (incomingBookings ?? []).filter((b: any) => b.status === 'pending' || b.status === 'paid').length,
        confirmedTrips: (incomingBookings ?? []).filter((b: any) => b.status === 'confirmed').length,
      }}
      cars={myCars ?? []}
      pendingCarIds={pendingCarIds}
      incomingBookings={incomingBookings ?? []}
      myBookings={myBookings ?? []}
    />
  );
}
