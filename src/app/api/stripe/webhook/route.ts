import { NextRequest, NextResponse } from 'next/server';
import { stripe, releaseDepositHold, createDepositHold } from '@/lib/stripe';
import { createServiceClient } from '@/lib/supabase/server';

export async function POST(request: NextRequest) {
  if (!stripe) {
    return NextResponse.json({ error: 'Stripe not configured' }, { status: 503 });
  }

  const body = await request.text();
  const signature = request.headers.get('stripe-signature');

  if (!signature || !process.env.STRIPE_WEBHOOK_SECRET) {
    return NextResponse.json({ error: 'Missing signature or webhook secret' }, { status: 400 });
  }

  let event;
  try {
    event = stripe.webhooks.constructEvent(body, signature, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    console.error('Webhook signature verification failed:', err);
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
  }

  // Service-role client — bypasses RLS for trusted webhook operations
  const supabase = createServiceClient();

  switch (event.type) {
    case 'checkout.session.completed': {
      const session = event.data.object;
      const bookingId = session.metadata?.booking_id;
      const depositAmount = parseFloat(session.metadata?.deposit_amount ?? '0');

      if (!bookingId) break;

      // Fix #2: Create deposit hold HERE, after payment is confirmed —
      // not at booking creation time, so no funds are frozen on abandoned checkouts.
      let depositPaymentIntentId: string | null = null;
      if (depositAmount > 0) {
        // Fetch car name for the deposit description
        const { data: booking } = await supabase
          .from('bookings')
          .select('car:cars(brand, model, year)')
          .eq('id', bookingId)
          .single();

        const car = Array.isArray(booking?.car) ? booking.car[0] : booking?.car;
        const carName = car ? `${car.brand} ${car.model} ${car.year}` : 'Vehicle';

        try {
          const depositIntent = await createDepositHold({
            depositAmount,
            bookingId,
            carName,
          });
          depositPaymentIntentId = depositIntent.id;
        } catch (err) {
          console.error('[webhook] deposit hold creation failed:', err);
          // Non-fatal — rental proceeds without deposit hold
        }
      }

      await supabase
        .from('bookings')
        .update({
          status: 'confirmed',
          ...(depositPaymentIntentId && { deposit_payment_intent_id: depositPaymentIntentId }),
        })
        .eq('id', bookingId);

      break;
    }

    case 'checkout.session.expired': {
      const session = event.data.object;
      const bookingId = session.metadata?.booking_id;
      if (!bookingId) break;

      // With Fix #2, deposit hold no longer exists at this point (created post-payment),
      // so no release needed. Still cancel the booking.
      await supabase
        .from('bookings')
        .update({ status: 'cancelled' })
        .eq('id', bookingId);

      break;
    }

    case 'payment_intent.payment_failed': {
      const intent = event.data.object;

      // Fix #3: Use booking_id from PaymentIntent metadata (set by createDepositHold)
      // instead of incorrectly matching stripe_session_id against a pi_xxx ID.
      const bookingId = intent.metadata?.booking_id;
      if (!bookingId) {
        console.log('[webhook] payment_intent.payment_failed: no booking_id in metadata, skipping');
        break;
      }

      const { data: booking } = await supabase
        .from('bookings')
        .select('id, deposit_payment_intent_id')
        .eq('id', bookingId)
        .single();

      if (booking) {
        if (booking.deposit_payment_intent_id) {
          try {
            await releaseDepositHold(booking.deposit_payment_intent_id);
          } catch (err) {
            console.error('[webhook] deposit release on payment failure failed:', err);
          }
        }
        await supabase
          .from('bookings')
          .update({ status: 'cancelled' })
          .eq('id', booking.id);
      }

      console.log('[webhook] payment failed for intent:', intent.id, '| booking:', bookingId);
      break;
    }

    default:
      console.log(`Unhandled event type: ${event.type}`);
  }

  return NextResponse.json({ received: true });
}
