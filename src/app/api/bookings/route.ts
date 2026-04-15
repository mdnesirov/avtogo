import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { createCheckoutSession } from '@/lib/stripe';
import { calculateDays, calculateTotalPrice } from '@/lib/utils';

type CookieToSet = { name: string; value: string; options?: Record<string, unknown> };

function makeSupabase(cookieStore: Awaited<ReturnType<typeof cookies>>) {
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return cookieStore.getAll(); },
        setAll(cookiesToSet: CookieToSet[]) {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options as Parameters<typeof cookieStore.set>[2])
          );
        },
      },
    }
  );
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { carId, startDate, endDate, driverName, driverPhone, driverLicense, notes } = body;

    // ── Validate required fields ──────────────────────────────────────────
    if (!carId || !startDate || !endDate || !driverName || !driverPhone) {
      return NextResponse.json(
        { error: 'Missing required fields: carId, startDate, endDate, driverName, driverPhone' },
        { status: 400 }
      );
    }

    // ── Validate dates ────────────────────────────────────────────────────
    const totalDays = calculateDays(startDate, endDate);
    if (totalDays < 1) {
      return NextResponse.json({ error: 'End date must be after start date' }, { status: 400 });
    }

    const cookieStore = await cookies();
    const supabase = makeSupabase(cookieStore);

    // ── Auth check ────────────────────────────────────────────────────────
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    // ── Fetch car — column is is_active, NOT is_available ─────────────────
    const { data: car, error: carError } = await supabase
      .from('cars')
      .select('id, brand, model, year, price_per_day, owner_id, is_active')
      .eq('id', carId)
      .eq('is_active', true)
      .single();

    if (carError || !car) {
      console.error('[bookings] car lookup failed:', carError?.message ?? 'no car row', { carId });
      return NextResponse.json({ error: 'Car not found or unavailable' }, { status: 404 });
    }

    // ── Prevent owner from booking their own car ───────────────────────────
    if (car.owner_id === user.id) {
      return NextResponse.json({ error: 'You cannot book your own car' }, { status: 400 });
    }

    // ── Check for overlapping confirmed/pending bookings ───────────────────
    const { data: overlap, error: overlapError } = await supabase
      .from('bookings')
      .select('id')
      .eq('car_id', carId)
      .in('status', ['pending', 'confirmed'])
      .lt('start_date', endDate)
      .gt('end_date', startDate)
      .limit(1);

    if (overlapError) {
      console.error('[bookings] overlap check error:', overlapError.message);
      return NextResponse.json({ error: 'Could not verify availability. Please try again.' }, { status: 500 });
    }

    if (overlap && overlap.length > 0) {
      return NextResponse.json(
        { error: 'These dates are already booked. Please choose different dates.' },
        { status: 409 }
      );
    }

    // ── Calculate price ───────────────────────────────────────────────────
    const totalPrice = calculateTotalPrice(car.price_per_day, startDate, endDate);

    // ── Insert booking ────────────────────────────────────────────────────
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
      console.error('[bookings] insert error:', bookingError.message, bookingError.details);
      return NextResponse.json({ error: bookingError.message }, { status: 500 });
    }

    // ── Create Stripe checkout session ────────────────────────────────────
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

    let checkoutUrl: string | null = null;
    let sessionId: string | null = null;

    try {
      const checkoutSession = await createCheckoutSession({
        carName: `${car.brand} ${car.model} ${car.year}`,
        pricePerDay: car.price_per_day,
        totalDays,
        totalPrice,
        bookingId: booking.id,
        successUrl: `${appUrl}/booking/confirmation?session_id={CHECKOUT_SESSION_ID}`,
        cancelUrl: `${appUrl}/cars/${carId}`,
      });

      checkoutUrl = checkoutSession.url;
      sessionId = checkoutSession.id;

      await supabase
        .from('bookings')
        .update({ stripe_session_id: sessionId })
        .eq('id', booking.id);
    } catch (stripeError) {
      // Stripe is down or misconfigured — booking is saved, just can't pay yet
      console.error('[bookings] stripe error:', stripeError);
      // Don't fail the whole request; return booking without checkoutUrl
    }

    return NextResponse.json({
      booking,
      checkoutUrl,
      sessionId,
    });
  } catch (error) {
    console.error('[bookings] unhandled error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const supabase = makeSupabase(cookieStore);

    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    const { data: bookings, error } = await supabase
      .from('bookings')
      .select('*, car:cars(brand, model, year, images, price_per_day)')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('[bookings] GET error:', error.message);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ bookings });
  } catch (error) {
    console.error('[bookings] GET unhandled error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
