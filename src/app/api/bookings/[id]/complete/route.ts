import { createClient } from '@/lib/supabase/server';
import { releaseDepositHold } from '@/lib/stripe';
import { NextRequest, NextResponse } from 'next/server';

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { data: booking } = await supabase
    .from('bookings')
    .select('id, status, deposit_payment_intent_id, car:cars(owner_id)')
    .eq('id', id)
    .single();

  if (!booking) return NextResponse.json({ error: 'Booking not found' }, { status: 404 });

  const car = Array.isArray(booking.car) ? booking.car[0] : booking.car;

  // Only the car owner can mark a rental as complete
  if (car?.owner_id !== user.id) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  if (!['confirmed', 'paid'].includes(booking.status)) {
    return NextResponse.json({ error: 'Only confirmed bookings can be completed' }, { status: 400 });
  }

  // Release deposit hold — renter gets their deposit back
  if (booking.deposit_payment_intent_id) {
    try {
      await releaseDepositHold(booking.deposit_payment_intent_id);
    } catch (err) {
      console.error('[complete] deposit release failed:', err);
    }
  }

  const { error } = await supabase
    .from('bookings')
    .update({
      status: 'completed',
      completed_at: new Date().toISOString(),
    })
    .eq('id', id);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ success: true });
}
