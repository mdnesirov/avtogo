import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const location = searchParams.get('location');
    const minPrice = searchParams.get('minPrice');
    const maxPrice = searchParams.get('maxPrice');
    const transmission = searchParams.get('transmission');
    const fuelType = searchParams.get('fuelType');
    const airportDelivery = searchParams.get('airportDelivery');
    const limit = parseInt(searchParams.get('limit') || '20');

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

    let query = supabase
      .from('cars')
      .select('*, owner:profiles(id, full_name, phone, whatsapp)')
      .eq('is_available', true)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (location) query = query.ilike('location', `%${location}%`);
    if (minPrice) query = query.gte('price_per_day', parseFloat(minPrice));
    if (maxPrice) query = query.lte('price_per_day', parseFloat(maxPrice));
    if (transmission) query = query.eq('transmission', transmission);
    if (fuelType) query = query.eq('fuel_type', fuelType);
    if (airportDelivery === 'true') query = query.eq('airport_delivery', true);

    const { data, error } = await query;
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });

    return NextResponse.json({ cars: data });
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
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
    if (!user) return NextResponse.json({ error: 'Authentication required' }, { status: 401 });

    const required = ['brand', 'model', 'year', 'transmission', 'fuel_type', 'price_per_day', 'location'];
    for (const field of required) {
      if (!body[field]) {
        return NextResponse.json({ error: `Missing required field: ${field}` }, { status: 400 });
      }
    }

    const { data: car, error } = await supabase
      .from('cars')
      .insert({
        owner_id: user.id,
        brand: body.brand,
        model: body.model,
        year: parseInt(body.year),
        transmission: body.transmission,
        fuel_type: body.fuel_type,
        price_per_day: parseFloat(body.price_per_day),
        location: body.location,
        latitude: body.latitude || null,
        longitude: body.longitude || null,
        description: body.description || null,
        images: body.images || [],
        airport_delivery: body.airport_delivery || false,
      })
      .select()
      .single();

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });

    return NextResponse.json({ car }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
