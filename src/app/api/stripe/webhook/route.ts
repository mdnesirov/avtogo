import { NextRequest, NextResponse } from 'next/server';
import { stripe, releaseDepositHold } from '@/lib/stripe';
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
      if (bookingId) {
        await supabase
          .from('bookings')
          .update({ status: 'confirmed' })
          .eq('id', bookingId);
      }
      break;
    }

    case 'checkout.session.expired': {
      const session = event.data.object;
      const bookingId = session.metadata?.booking_id;
      if (bookingId) {
        // Also release any deposit hold so funds aren't frozen forever
        const { data: booking } = await supabase
          .from('bookings')
          .select('deposit_payment_intent_id')
          .eq('id', bookingId)
          .single();

        if (booking?.deposit_payment_intent_id) {
          try {
            await releaseDepositHold(booking.deposit_payment_intent_id);
          } catch (err) {
            console.error('[webhook] deposit release on session expiry failed:', err);
          }
        }

        await supabase
          .from('bookings')
          .update({ status: 'cancelled' })
          .eq('id', bookingId);
      }
      break;
    }

    case 'payment_intent.payment_failed': {
      const intent = event.data.object;
      // Find and cancel the booking linked to this payment intent
      const { data: booking } = await supabase
        .from('bookings')
        .select('id, deposit_payment_intent_id')
        .eq('stripe_session_id', intent.id)
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
      console.log('Payment failed for intent:', intent.id);
      break;
    }

    default:
      console.log(`Unhandled event type: ${event.type}`);
  }

  return NextResponse.json({ received: true });
}
