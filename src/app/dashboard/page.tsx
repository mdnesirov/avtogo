import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import DashboardOwnerClient from './DashboardOwnerClient';

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect('/auth/login');

  const [{ data: myCars }, { data: profile }] = await Promise.all([
    supabase.from('cars').select('*').eq('owner_id', user.id).order('created_at', { ascending: false }),
    supabase.from('profiles').select('full_name, avatar_url').eq('id', user.id).single(),
  ]);

  const { data: incomingBookingsRaw } = await supabase
    .from('bookings')
    .select(`
      *,
      car:cars!inner(id, owner_id, brand, model, year, images, price_per_day, location, is_active),
      renter:profiles!bookings_user_id_fkey(id, full_name, phone, avatar_url)
    `)
    .eq('car.owner_id', user.id)
    .order('created_at', { ascending: false })
    .limit(50);

  const incomingBookings = (incomingBookingsRaw ?? []).map((booking: any) => ({
    ...booking,
    user: booking.renter ?? null,
  }));

  const displayName = (profile as any)?.full_name || user.email?.split('@')[0] || 'there';

  return (
    <DashboardOwnerClient
      displayName={displayName}
      email={user.email ?? ''}
      cars={myCars ?? []}
      incomingBookings={incomingBookings}
    />
  );
}
