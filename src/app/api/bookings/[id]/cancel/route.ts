import { createClient } from '@/lib/supabase/server';
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
    .select('id, user_id, status, car:cars(owner_id)')
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

  const { error } = await supabase
    .from('bookings')
    .update({
      status: 'cancelled',
      cancelled_at: new Date().toISOString(),
      cancelled_by: isOwner ? 'owner' : 'renter',
    })
    .eq('id', id);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ success: true });
}
