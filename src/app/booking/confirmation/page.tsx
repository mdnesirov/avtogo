import { createClient } from '@/lib/supabase/server';
import BookingConfirmationContent from './BookingConfirmationContent';

export default async function BookingConfirmationPage({
  searchParams,
}: {
  searchParams: Promise<{ id?: string }>;
}) {
  const params = await searchParams;
  const supabase = await createClient();

  let booking = null;
  if (params.id) {
    const { data } = await supabase
      .from('bookings')
      .select('*, car:cars(*)')
      .eq('id', params.id)
      .single();
    booking = data;
  }

  return (
    <BookingConfirmationContent booking={booking} />
  );
}
