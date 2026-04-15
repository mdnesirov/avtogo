import { createClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await req.json();
  const {
    car_name, brand, model, year, car_type, transmission,
    fuel_type, price_per_day, location, city, description,
    images, airport_delivery, whatsapp_phone,
    requires_deposit, deposit_amount,
  } = body;

  if (!car_name || !brand || !model || !year || !transmission || !fuel_type || !price_per_day || !location) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
  }

  const { data, error } = await supabase
    .from('cars')
    .insert({
      owner_id: user.id,
      car_name,
      brand,
      model,
      year: Number(year),
      car_type: car_type || null,
      transmission,
      fuel_type,
      price_per_day: Number(price_per_day),
      location,
      city: city || null,
      description: description || null,
      images: images || [],
      airport_delivery: airport_delivery || false,
      whatsapp_phone: whatsapp_phone || null,
      requires_deposit: requires_deposit || false,
      deposit_amount: requires_deposit && deposit_amount ? Number(deposit_amount) : null,
    })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ car: data });
}
