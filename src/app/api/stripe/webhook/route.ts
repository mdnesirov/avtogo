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

  const updateBookingStatusBySessionId = async (sessionId: string, status: string) => {
    const { data, error } = await supabase
      .from('bookings')
      .update({ status })
      .eq('stripe_session_id', sessionId)
      .select('id');

    if (error) {
      throw error;
    }

    if (!data.length) {
      throw new Error(`No booking found for stripe_session_id=${sessionId} while setting status=${status}`);
    }
  };

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object;
        if (session.id) {
          await updateBookingStatusBySessionId(session.id, 'confirmed');
        }
        break;
      }

      case 'checkout.session.expired': {
        const session = event.data.object;
        if (session.id) {
          await updateBookingStatusBySessionId(session.id, 'cancelled');
        }
        break;
      }

      case 'payment_intent.payment_failed': {
        const paymentIntent = event.data.object;
        const checkoutSessions = await stripe.checkout.sessions.list({
          payment_intent: paymentIntent.id,
          limit: 1,
        });

        const sessionId = checkoutSessions.data[0]?.id;

        if (!sessionId) {
          throw new Error(
            `No checkout session found for payment_intent=${paymentIntent.id}; this may indicate the intent was not created via Checkout or linkage is missing`
          );
        }

        await updateBookingStatusBySessionId(sessionId, 'failed');
        break;
      }

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }
  } catch (error) {
    console.error('Webhook processing failed:', error);
    return NextResponse.json({ error: 'Webhook processing failed' }, { status: 500 });
  }

  return NextResponse.json({ received: true });
}
