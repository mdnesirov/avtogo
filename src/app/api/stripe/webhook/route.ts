import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { createClient } from '@supabase/supabase-js';

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

  // Use service role for webhook (bypasses RLS)
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const allowedStatuses = new Set(['confirmed', 'cancelled', 'failed']);

  const updateBookingStatusBySessionId = async (
    sessionId: string,
    status: 'confirmed' | 'cancelled' | 'failed',
    eventType: string
  ) => {
    if (!allowedStatuses.has(status)) {
      throw new Error(`Unsupported booking status=${status} for event=${eventType}`);
    }

    const { data, error } = await supabase
      .from('bookings')
      .update({ status })
      .eq('stripe_session_id', sessionId)
      .select('id');

    if (error) {
      throw error;
    }

    if (!data.length) {
      throw new Error(
        `No booking found for stripe_session_id=${sessionId} while setting status=${status} for event=${eventType}`
      );
    }
  };

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object;
        if (!session.id) {
          throw new Error('checkout.session.completed payload missing session id');
        }
        await updateBookingStatusBySessionId(session.id, 'confirmed', event.type);
        break;
      }

      case 'checkout.session.expired': {
        const session = event.data.object;
        if (!session.id) {
          throw new Error('checkout.session.expired payload missing session id');
        }
        await updateBookingStatusBySessionId(session.id, 'cancelled', event.type);
        break;
      }

      case 'payment_intent.payment_failed': {
        const paymentIntent = event.data.object;
        const checkoutSessions = await stripe.checkout.sessions.list({
          payment_intent: paymentIntent.id,
          limit: 1,
        });

        if (!checkoutSessions.data.length) {
          throw new Error(
            `No checkout session found for payment_intent=${paymentIntent.id}; this may indicate the intent was not created via Checkout or linkage is missing`
          );
        }

        const sessionId = checkoutSessions.data[0].id;

        await updateBookingStatusBySessionId(sessionId, 'failed', event.type);
        break;
      }

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    console.error(`Webhook processing failed for event=${event.type}: ${message}`);
    return NextResponse.json({ error: 'Webhook processing failed', eventType: event.type }, { status: 500 });
  }

  return NextResponse.json({ received: true });
}
