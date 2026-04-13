import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET(req: NextRequest) {
  const supabase = await createClient();
  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');

  // Fetch single car by id (used by booking page)
  if (id) {
    const { data: car, error } = await supabase
      .from('cars')
      .select('*, owner:profiles(*)')
      .eq('id', id)
      .single();

    if (error || !car) {
      return NextResponse.json({ error: 'Car not found' }, { status: 404 });
    }

    // Fetch booked date ranges for availability calendar
    const { data: bookings } = await supabase
      .from('bookings')
      .select('start_date, end_date')
      .eq('car_id', id)
      .in('status', ['pending', 'confirmed']);

    const bookedRanges = (bookings || []).map((b) => ({
      start: b.start_date,
      end: b.end_date,
    }));

    return NextResponse.json({ car, bookedRanges });
  }

  // List / filter cars
  const location = searchParams.get('location');
  const transmission = searchParams.get('transmission');
  const fuel_type = searchParams.get('fuel_type');
  const minPrice = searchParams.get('minPrice');
  const maxPrice = searchParams.get('maxPrice');
  const airportDelivery = searchParams.get('airportDelivery');

  let query = supabase
    .from('cars')
    .select('*, owner:profiles(full_name, avatar_url, whatsapp)')
    .eq('is_available', true)
    .order('created_at', { ascending: false });

  if (location) query = query.eq('location', location);
  if (transmission) query = query.eq('transmission', transmission);
  if (fuel_type) query = query.eq('fuel_type', fuel_type);
  if (minPrice) query = query.gte('price_per_day', parseFloat(minPrice));
  if (maxPrice) query = query.lte('price_per_day', parseFloat(maxPrice));
  if (airportDelivery === 'true') query = query.eq('airport_delivery', true);

  const { data, error } = await query;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ cars: data || [] });
}

export async function POST(req: NextRequest) {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await req.json();
  const { brand, model, year, transmission, fuel_type, price_per_day,
          location, description, images, airport_delivery } = body;

  if (!brand || !model || !year || !transmission || !fuel_type || !price_per_day || !location) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
  }

  const { data, error } = await supabase
    .from('cars')
    .insert({
      owner_id: user.id,
      brand, model, year, transmission, fuel_type,
      price_per_day, location, description,
      images: images || [],
      airport_delivery: airport_delivery || false,
      is_available: true,
    })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ car: data }, { status: 201 });
}

export async function PATCH(req: NextRequest) {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');
  if (!id) return NextResponse.json({ error: 'Car ID required' }, { status: 400 });

  const body = await req.json();

  const { data, error } = await supabase
    .from('cars')
    .update(body)
    .eq('id', id)
    .eq('owner_id', user.id) // enforce ownership
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ car: data });
}

export async function DELETE(req: NextRequest) {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');
  if (!id) return NextResponse.json({ error: 'Car ID required' }, { status: 400 });

  const { error } = await supabase
    .from('cars')
    .delete()
    .eq('id', id)
    .eq('owner_id', user.id); // enforce ownership

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ success: true });
}
