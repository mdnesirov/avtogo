import { createClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await req.json();
  const {
    brand, model, year, car_type, transmission,
    fuel_type, price_per_day, location, city, description,
    images, whatsapp_phone,
    requires_deposit, deposit_amount,
    offers_delivery, delivery_fee,
    offers_airport_delivery, airport_delivery_fee,
  } = body;

  // Build and trim car_name from brand + model
  const car_name = `${(brand || '').trim()} ${(model || '').trim()}`.trim();

  if (!car_name || !brand?.trim() || !model?.trim() || !year || !transmission || !fuel_type || !price_per_day || !location) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
  }

  const { data, error } = await supabase
    .from('cars')
    .insert({
      owner_id: user.id,
      car_name,
      brand: brand.trim(),
      model: model.trim(),
      year: Number(year),
      car_type: car_type || null,
      transmission,
      fuel_type,
      price_per_day: Number(price_per_day),
      location,
      city: city || null,
      description: description || null,
      images: images || [],
      // Keep legacy airport_delivery column in sync
      airport_delivery: offers_airport_delivery || false,
      whatsapp_phone: whatsapp_phone || null,
      requires_deposit: requires_deposit || false,
      deposit_amount: requires_deposit && deposit_amount ? Number(deposit_amount) : null,
      offers_delivery: offers_delivery || false,
      delivery_fee: offers_delivery && delivery_fee ? Number(delivery_fee) : null,
      offers_airport_delivery: offers_airport_delivery || false,
      airport_delivery_fee: offers_airport_delivery && airport_delivery_fee ? Number(airport_delivery_fee) : null,
    })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ car: data });
}
