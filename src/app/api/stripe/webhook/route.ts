import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Use raw body for Stripe signature verification
export const config = { api: { bodyParser: false } };

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: NextRequest) {
  // Placeholder: Stripe is not yet live. In production, replace this block
  // with actual stripe.webhooks.constructEvent() signature verification.
  //
  // Pattern:
  //   const sig = req.headers.get('stripe-signature')!;
  //   const body = await req.text();
  //   const event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET!);

  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  const eventType = body?.type as string | undefined;

  switch (eventType) {
    case 'checkout.session.completed': {
      const session = body?.data as { object?: { metadata?: { booking_id?: string } } };
      const bookingId = session?.object?.metadata?.booking_id;

      if (!bookingId) {
        console.warn('[Stripe Webhook] checkout.session.completed missing booking_id in metadata');
        break;
      }

      const { error } = await supabase
        .from('bookings')
        .update({ status: 'confirmed' })
        .eq('id', bookingId);

      if (error) {
        console.error('[Stripe Webhook] Failed to confirm booking:', error.message);
        return NextResponse.json({ error: 'DB update failed' }, { status: 500 });
      }

      console.log(`[Stripe Webhook] Booking ${bookingId} confirmed.`);
      break;
    }

    case 'checkout.session.expired':
    case 'payment_intent.payment_failed': {
      const session = body?.data as { object?: { metadata?: { booking_id?: string } } };
      const bookingId = session?.object?.metadata?.booking_id;

      if (bookingId) {
        await supabase
          .from('bookings')
          .update({ status: 'cancelled' })
          .eq('id', bookingId);
        console.log(`[Stripe Webhook] Booking ${bookingId} cancelled due to failed/expired payment.`);
      }
      break;
    }

    default:
      // Unhandled event — return 200 so Stripe stops retrying
      console.log(`[Stripe Webhook] Unhandled event type: ${eventType}`);
  }

  return NextResponse.json({ received: true });
}
