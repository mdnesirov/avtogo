import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { createCheckoutSession } from '@/lib/stripe';
import { calculateDays, calculateTotalPrice } from '@/lib/utils';
import { rateLimit } from '@/lib/rateLimit';

// Basic string sanitiser — trims whitespace and enforces a max length
function sanitizeString(value: unknown, maxLength: number): string {
  if (typeof value !== 'string') return '';
  return value.trim().slice(0, maxLength);
}

function getIp(req: NextRequest): string {
  return (
    req.headers.get('x-forwarded-for')?.split(',')[0].trim() ??
    req.headers.get('x-real-ip') ??
    'unknown'
  );
}

export async function POST(request: NextRequest) {
  // 10 booking attempts per IP per minute
  const { allowed } = rateLimit(getIp(request), 'POST:/api/bookings', { limit: 10 });
  if (!allowed) {
    return NextResponse.json({ error: 'Too many requests. Please wait a moment.' }, { status: 429 });
  }

  try {
    const body = await request.json();
    const { carId, startDate, endDate } = body;

    // Sanitise all free-text inputs before they touch the DB
    const driverName    = sanitizeString(body.driverName,    120);
    const driverPhone   = sanitizeString(body.driverPhone,    30);
    const driverLicense = sanitizeString(body.driverLicense, 60);
    const notes         = sanitizeString(body.notes,         500);

    if (!carId || !startDate || !endDate || !driverName || !driverPhone) {
      return NextResponse.json(
        { error: 'Missing required fields: carId, startDate, endDate, driverName, driverPhone' },
        { status: 400 }
      );
    }

    const totalDays = calculateDays(startDate, endDate);
    if (totalDays < 1) {
      return NextResponse.json({ error: 'End date must be after start date' }, { status: 400 });
    }

    const supabase = await createClient();

    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    const { data: car, error: carError } = await supabase
      .from('cars')
      .select('id, brand, model, year, price_per_day, deposit_amount, owner_id, is_active')
      .eq('id', carId)
      .eq('is_active', true)
      .single();

    if (carError || !car) {
      console.error('[bookings] car lookup failed:', carError?.message ?? 'no car row', { carId });
      return NextResponse.json({ error: 'Car not found or unavailable' }, { status: 404 });
    }

    if (car.owner_id === user.id) {
      return NextResponse.json({ error: 'You cannot book your own car' }, { status: 400 });
    }

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

    const totalPrice = calculateTotalPrice(car.price_per_day, startDate, endDate);

    const { data: booking, error: bookingError } = await supabase
      .from('bookings')
      .insert({
        user_id:        user.id,
        car_id:         carId,
        start_date:     startDate,
        end_date:       endDate,
        total_price:    totalPrice,
        status:         'pending',
        driver_name:    driverName,
        driver_phone:   driverPhone,
        driver_license: driverLicense || null,
        notes:          notes || null,
      })
      .select()
      .single();

    if (bookingError) {
      console.error('[bookings] insert error:', bookingError.message, bookingError.details);
      return NextResponse.json({ error: bookingError.message }, { status: 500 });
    }

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    let checkoutUrl: string | null = null;
    let sessionId:   string | null = null;

    try {
      // Fix #2: Do NOT create deposit hold here — car hasn't paid yet.
      // Deposit hold is created inside checkout.session.completed webhook
      // after payment is confirmed, so there's no risk of freezing funds
      // on an abandoned checkout.
      const checkoutSession = await createCheckoutSession({
        carName:    `${car.brand} ${car.model} ${car.year}`,
        pricePerDay: car.price_per_day,
        totalDays,
        totalPrice,
        bookingId:  booking.id,
        successUrl: `${appUrl}/booking/confirmation?session_id={CHECKOUT_SESSION_ID}`,
        cancelUrl:  `${appUrl}/cars/${carId}`,
        // Pass deposit_amount in metadata so webhook can create the hold post-payment
        depositAmount: car.deposit_amount ?? 0,
      });

      checkoutUrl = checkoutSession.url;
      sessionId   = checkoutSession.id;

      await supabase
        .from('bookings')
        .update({ stripe_session_id: sessionId })
        .eq('id', booking.id);

    } catch (stripeError) {
      // Stripe failed — rollback the booking so the user isn't left with a ghost pending row
      console.error('[bookings] stripe error, rolling back booking:', stripeError);
      await supabase.from('bookings').delete().eq('id', booking.id);
      return NextResponse.json(
        { error: 'Payment setup failed. Please try again.' },
        { status: 502 }
      );
    }

    return NextResponse.json({ booking, checkoutUrl, sessionId });
  } catch (error) {
    console.error('[bookings] unhandled error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  // 30 reads per IP per minute
  const { allowed } = rateLimit(getIp(request), 'GET:/api/bookings', { limit: 30 });
  if (!allowed) {
    return NextResponse.json({ error: 'Too many requests. Please wait a moment.' }, { status: 429 });
  }

  try {
    const supabase = await createClient();

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
