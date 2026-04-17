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

  const { status } = await req.json();
  if (!['confirmed', 'cancelled'].includes(status)) {
    return NextResponse.json({ error: 'Invalid status' }, { status: 400 });
  }

  const { data: booking } = await supabase
    .from('bookings')
    .select('id, status, car:cars(owner_id)')
    .eq('id', id)
    .single();

  if (!booking) return NextResponse.json({ error: 'Booking not found' }, { status: 404 });

  const car = Array.isArray(booking.car) ? booking.car[0] : booking.car;
  if (car?.owner_id !== user.id) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  if (!['pending', 'paid'].includes(booking.status)) {
    return NextResponse.json({ error: 'Only pending bookings can be updated' }, { status: 400 });
  }

  const { error } = await supabase
    .from('bookings')
    .update(
      status === 'cancelled'
        ? { status, cancelled_at: new Date().toISOString(), cancelled_by: 'owner' }
        : { status }
    )
    .eq('id', id)
    .in('status', ['pending', 'paid']);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ success: true, status });
}
