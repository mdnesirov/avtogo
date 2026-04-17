import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { createClient } from '@supabase/supabase-js';
import Stripe from 'stripe';

export async function POST(request: NextRequest) {
  if (!stripe) {
    return NextResponse.json({ error: 'Stripe not configured' }, { status: 503 });
  }

  const rawBody = await request.text();
  const signature = request.headers.get('stripe-signature');
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!signature || !webhookSecret) {
    return NextResponse.json({ error: 'Missing signature or webhook secret' }, { status: 400 });
  }

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(rawBody, signature, webhookSecret);
  } catch (err) {
    console.error('Webhook signature verification failed:', err);
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
  }

  // Use service role for webhook (bypasses RLS)
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  async function updateBookingStatusBySessionId(
    sessionId: string | null | undefined,
    status: 'confirmed' | 'cancelled' | 'failed'
  ) {
    if (!sessionId) {
      return NextResponse.json({ error: 'Missing Stripe session id' }, { status: 500 });
    }

    const { data, error } = await supabase
      .from('bookings')
      .update({ status })
      .eq('stripe_session_id', sessionId)
      .select('id')
      .maybeSingle();

    if (error) {
      console.error('Failed to update booking status:', error);
      return NextResponse.json({ error: 'Failed to update booking status' }, { status: 500 });
    }

    if (!data) {
      return NextResponse.json({ error: 'Booking not linked to Stripe session' }, { status: 500 });
    }

    return null;
  }

  switch (event.type) {
    case 'checkout.session.completed': {
      const session = event.data.object as Stripe.Checkout.Session;
      const errorResponse = await updateBookingStatusBySessionId(session.id, 'confirmed');
      if (errorResponse) {
        return errorResponse;
      }
      break;
    }

    case 'checkout.session.expired': {
      const session = event.data.object as Stripe.Checkout.Session;
      const errorResponse = await updateBookingStatusBySessionId(session.id, 'cancelled');
      if (errorResponse) {
        return errorResponse;
      }
      break;
    }

    case 'payment_intent.payment_failed': {
      const paymentIntent = event.data.object as Stripe.PaymentIntent;

      if (!paymentIntent.id) {
        return NextResponse.json({ error: 'Missing payment intent id' }, { status: 500 });
      }

      let checkoutSessionId: string | undefined;
      try {
        const sessions = await stripe.checkout.sessions.list({
          payment_intent: paymentIntent.id,
          limit: 1,
        });
        checkoutSessionId = sessions.data[0]?.id;
      } catch (err) {
        console.error('Failed to resolve checkout session from payment intent:', err);
        return NextResponse.json({ error: 'Failed to resolve checkout session' }, { status: 500 });
      }

      const errorResponse = await updateBookingStatusBySessionId(checkoutSessionId, 'failed');
      if (errorResponse) {
        return errorResponse;
      }
      break;
    }

    default:
      console.log(`Unhandled event type: ${event.type}`);
  }

  return NextResponse.json({ received: true });
}
