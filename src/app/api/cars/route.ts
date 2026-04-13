import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET(request: NextRequest) {
  const supabase = await createClient();
  const { searchParams } = new URL(request.url);

  let query = supabase
    .from('cars')
    .select('*')
    .eq('is_available', true)
    .order('created_at', { ascending: false });

  const location     = searchParams.get('location');
  const transmission = searchParams.get('transmission');
  const fuelType     = searchParams.get('fuel_type');
  const minPrice     = searchParams.get('min_price');
  const maxPrice     = searchParams.get('max_price');
  const airport      = searchParams.get('airport_delivery');

  if (location)     query = query.eq('location', location);
  if (transmission) query = query.eq('transmission', transmission);
  if (fuelType)     query = query.eq('fuel_type', fuelType);
  if (minPrice)     query = query.gte('price_per_day', parseFloat(minPrice));
  if (maxPrice)     query = query.lte('price_per_day', parseFloat(maxPrice));
  if (airport === 'true') query = query.eq('airport_delivery', true);

  const { data, error } = await query;

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ cars: data });
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();

    const { data: car, error } = await supabase
      .from('cars')
      .insert({ ...body, owner_id: user.id })
      .select('id')
      .single();

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ car_id: car.id }, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
