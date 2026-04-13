import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { car_id, start_date, end_date, driver_name, driver_phone, notes } = body;

    if (!car_id || !start_date || !end_date || !driver_name || !driver_phone) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Fetch car to get price
    const { data: car, error: carError } = await supabase
      .from('cars')
      .select('price_per_day, is_available')
      .eq('id', car_id)
      .single();

    if (carError || !car) {
      return NextResponse.json({ error: 'Car not found' }, { status: 404 });
    }

    if (!car.is_available) {
      return NextResponse.json({ error: 'Car is not available' }, { status: 409 });
    }

    // Calculate total price
    const days = Math.ceil(
      (new Date(end_date).getTime() - new Date(start_date).getTime()) / (1000 * 60 * 60 * 24)
    );
    const total_price = car.price_per_day * Math.max(1, days);

    const { data: booking, error: bookingError } = await supabase
      .from('bookings')
      .insert({
        user_id: user.id,
        car_id,
        start_date,
        end_date,
        total_price,
        driver_name,
        driver_phone,
        notes,
        status: 'pending',
      })
      .select('id')
      .single();

    if (bookingError) {
      return NextResponse.json({ error: bookingError.message }, { status: 500 });
    }

    return NextResponse.json({ booking_id: booking.id, total_price }, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
