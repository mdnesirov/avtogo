import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

// Fields an owner is allowed to update — never include owner_id, id, created_at
const ALLOWED_UPDATE_FIELDS = new Set([
  'brand',
  'model',
  'year',
  'car_name',
  'car_type',
  'transmission',
  'fuel_type',
  'price_per_day',
  'location',
  'city',
  'description',
  'images',
  'is_active',
  'whatsapp_phone',
  'requires_deposit',
  'deposit_amount',
  'offers_delivery',
  'delivery_fee',
  'offers_airport_delivery',
  'airport_delivery',
  'airport_delivery_fee',
]);

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const supabase = await createClient();

    const { data: car, error } = await supabase
      .from('cars')
      .select('*, owner:profiles(id, full_name, phone, whatsapp)')
      .eq('id', id)
      .single();

    if (error || !car) {
      return NextResponse.json({ error: 'Car not found' }, { status: 404 });
    }

    return NextResponse.json({ car });
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const supabase = await createClient();

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: 'Authentication required' }, { status: 401 });

    // Strip every key that isn't explicitly allowed — prevents owner_id/id injection
    const safeUpdate: Record<string, unknown> = {};
    for (const key of Object.keys(body)) {
      if (ALLOWED_UPDATE_FIELDS.has(key)) {
        safeUpdate[key] = body[key];
      }
    }

    if (Object.keys(safeUpdate).length === 0) {
      return NextResponse.json({ error: 'No valid fields to update' }, { status: 400 });
    }

    const { data: car, error } = await supabase
      .from('cars')
      .update(safeUpdate)
      .eq('id', id)
      .eq('owner_id', user.id) // ownership enforced at DB level too
      .select()
      .single();

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    if (!car) return NextResponse.json({ error: 'Car not found or forbidden' }, { status: 404 });

    return NextResponse.json({ car });
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const supabase = await createClient();

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: 'Authentication required' }, { status: 401 });

    const { error } = await supabase
      .from('cars')
      .delete()
      .eq('id', id)
      .eq('owner_id', user.id);

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
