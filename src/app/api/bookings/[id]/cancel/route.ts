import { createClient } from '@/lib/supabase/server';
import { captureDepositHold, releaseDepositHold } from '@/lib/stripe';
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
    .select('id, user_id, status, deposit_payment_intent_id, car:cars(owner_id)')
    .eq('id', id)
    .single();

  if (!booking) return NextResponse.json({ error: 'Booking not found' }, { status: 404 });

  const car = Array.isArray(booking.car) ? booking.car[0] : booking.car;
  const isRenter = booking.user_id === user.id;
  const isOwner = car?.owner_id === user.id;

  if (!isRenter && !isOwner) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  if (!['pending', 'paid', 'confirmed'].includes(booking.status)) {
    return NextResponse.json({ error: 'Booking cannot be cancelled in its current state' }, { status: 400 });
  }

  // Guard against race conditions — only update if status hasn't changed since we read it
  const { data: updated, error } = await supabase
    .from('bookings')
    .update({
      status: 'cancelled',
      cancelled_at: new Date().toISOString(),
      cancelled_by: isOwner ? 'owner' : 'renter',
    })
    .eq('id', id)
    .eq('status', booking.status)
    .select('id');

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  // No rows updated means another request already changed the status — treat as conflict
  if (!updated || updated.length === 0) {
    return NextResponse.json(
      { error: 'Booking status changed concurrently. Please refresh and try again.' },
      { status: 409 }
    );
  }

  // Renter cancel — release deposit so card isn't frozen
  if (isRenter && booking.deposit_payment_intent_id) {
    try {
      await releaseDepositHold(booking.deposit_payment_intent_id);
    } catch (stripeErr) {
      console.error('[cancel] deposit release (renter) failed:', stripeErr);
    }
  }

  // Owner cancels a confirmed booking — capture deposit as compensation
  if (isOwner && booking.status === 'confirmed' && booking.deposit_payment_intent_id) {
    try {
      await captureDepositHold(booking.deposit_payment_intent_id);
    } catch (stripeErr) {
      console.error('[cancel] deposit capture (owner) failed:', stripeErr);
    }
  }

  return NextResponse.json({ success: true });
}
