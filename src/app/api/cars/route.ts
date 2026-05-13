import { createClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

// In-memory rate limiter (resets on cold start — swap for Upstash Redis pre-launch)
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT = 5;      // max 5 listings per IP
const WINDOW_MS  = 60_000; // per 60 seconds

function rateLimit(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);
  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + WINDOW_MS });
    return true;
  }
  if (entry.count >= RATE_LIMIT) return false;
  entry.count++;
  return true;
}

// Trim + hard cap on string length to prevent oversized payloads
function sanitizeString(value: unknown, maxLength: number): string {
  if (typeof value !== 'string') return '';
  return value.trim().slice(0, maxLength);
}

function sanitizeNumber(value: unknown, min: number, max: number): number | null {
  const n = Number(value);
  if (isNaN(n) || n < min || n > max) return null;
  return n;
}

const VALID_TRANSMISSIONS = ['automatic', 'manual'] as const;
const VALID_FUEL_TYPES    = ['petrol', 'diesel', 'electric', 'hybrid', 'lpg'] as const;
const VALID_CAR_TYPES     = ['sedan', 'suv', 'hatchback', 'minivan', 'coupe', 'convertible', 'truck', 'van', 'pickup', 'wagon'] as const;

export async function POST(req: NextRequest) {
  // Rate limit by IP
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unknown';
  if (!rateLimit(ip)) {
    return NextResponse.json({ error: 'Too many requests' }, { status: 429 });
  }

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await req.json();

  // Sanitise every string field — trim whitespace and cap length
  const brand       = sanitizeString(body.brand,       60);
  const model       = sanitizeString(body.model,       60);
  const location    = sanitizeString(body.location,    120);
  const city        = sanitizeString(body.city,        80);
  const description = sanitizeString(body.description, 2000);
  const whatsappPhone = sanitizeString(body.whatsapp_phone, 30);

  const year         = sanitizeNumber(body.year,          1950, new Date().getFullYear() + 1);
  const pricePerDay  = sanitizeNumber(body.price_per_day, 1, 100000);
  const depositAmt   = body.requires_deposit && body.deposit_amount
    ? sanitizeNumber(body.deposit_amount, 0, 1000000)
    : null;
  const deliveryFee  = body.offers_delivery && body.delivery_fee
    ? sanitizeNumber(body.delivery_fee, 0, 100000)
    : null;
  const airportFee   = body.offers_airport_delivery && body.airport_delivery_fee
    ? sanitizeNumber(body.airport_delivery_fee, 0, 100000)
    : null;

  // Validate enums against known-good values
  const transmission = VALID_TRANSMISSIONS.includes(body.transmission) ? body.transmission : null;
  const fuel_type    = VALID_FUEL_TYPES.includes(body.fuel_type)       ? body.fuel_type    : null;
  const car_type     = VALID_CAR_TYPES.includes(body.car_type)         ? body.car_type     : null;

  // Images must be an array of strings (URLs) — cap at 20 images, 500 chars each
  const images: string[] = Array.isArray(body.images)
    ? body.images
        .filter((img: unknown) => typeof img === 'string')
        .map((img: string) => img.trim().slice(0, 500))
        .slice(0, 20)
    : [];

  const car_name = `${brand} ${model} ${year ?? ''}`.trim();

  if (!brand || !model || !year || !transmission || !fuel_type || !pricePerDay || !location) {
    return NextResponse.json({ error: 'Missing or invalid required fields' }, { status: 400 });
  }

  const { data, error } = await supabase
    .from('cars')
    .insert({
      owner_id:   user.id,
      car_name,
      brand,
      model,
      year,
      car_type:   car_type   || null,
      transmission,
      fuel_type,
      price_per_day: pricePerDay,
      location,
      city:       city       || null,
      description: description || null,
      images,
      airport_delivery:          body.offers_airport_delivery || false,
      whatsapp_phone:            whatsappPhone || null,
      requires_deposit:          body.requires_deposit          || false,
      deposit_amount:            depositAmt,
      offers_delivery:           body.offers_delivery           || false,
      delivery_fee:              deliveryFee,
      offers_airport_delivery:   body.offers_airport_delivery   || false,
      airport_delivery_fee:      airportFee,
    })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ car: data });
}
