import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { createCheckoutSession } from '@/lib/stripe';
import { calculateDays, calculateTotalPrice } from '@/lib/utils';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { carId, startDate, endDate, driverName, driverPhone, driverLicense, notes } = body;

    // Validate required fields
    if (!carId || !startDate || !endDate || !driverName || !driverPhone) {
      return NextResponse.json(
        { error: 'Missing required fields: carId, startDate, endDate, driverName, driverPhone' },
        { status: 400 }
      );
    }

    const cookieStore = await cookies();
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() { return cookieStore.getAll(); },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          },
        },
      }
    );

    // Auth check
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    // Fetch car details
    const { data: car, error: carError } = await supabase
      .from('cars')
      .select('*')
      .eq('id', carId)
      .eq('is_available', true)
      .single();

    if (carError || !car) {
      return NextResponse.json({ error: 'Car not found or unavailable' }, { status: 404 });
    }

    // Calculate pricing
    const totalDays = calculateDays(startDate, endDate);
    const totalPrice = calculateTotalPrice(car.price_per_day, startDate, endDate);

    if (totalDays < 1) {
      return NextResponse.json({ error: 'End date must be after start date' }, { status: 400 });
    }

    // Create booking
    const { data: booking, error: bookingError } = await supabase
      .from('bookings')
      .insert({
        user_id: user.id,
        car_id: carId,
        start_date: startDate,
        end_date: endDate,
        total_price: totalPrice,
        status: 'pending',
        driver_name: driverName,
        driver_phone: driverPhone,
        driver_license: driverLicense || null,
        notes: notes || null,
      })
      .select()
      .single();

    if (bookingError) {
      // Handle overlap constraint
      if (bookingError.code === 'P0001' || bookingError.message.includes('overlap')) {
        return NextResponse.json(
          { error: 'These dates are already booked. Please choose different dates.' },
          { status: 409 }
        );
      }
      return NextResponse.json({ error: bookingError.message }, { status: 500 });
    }

    // Create Stripe checkout session
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    const checkoutSession = await createCheckoutSession({
      carName: `${car.brand} ${car.model} ${car.year}`,
      pricePerDay: car.price_per_day,
      totalDays,
      totalPrice,
      bookingId: booking.id,
      successUrl: `${appUrl}/booking/confirmation`,
      cancelUrl: `${appUrl}/cars/${carId}`,
    });

    // Update booking with Stripe session ID
    await supabase
      .from('bookings')
      .update({ stripe_session_id: checkoutSession.id })
      .eq('id', booking.id);

    return NextResponse.json({
      booking,
      checkoutUrl: checkoutSession.url,
      sessionId: checkoutSession.id,
    });
  } catch (error) {
    console.error('Booking API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() { return cookieStore.getAll(); },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          },
        },
      }
    );

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    const { data: bookings, error } = await supabase
      .from('bookings')
      .select('*, car:cars(brand, model, year, images, price_per_day)')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ bookings });
  } catch (error) {
    console.error('Get bookings error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
