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

  switch (event.type) {
    case 'checkout.session.completed': {
      const session = event.data.object;
      if (session.id) {
        await supabase
          .from('bookings')
          .update({ status: 'confirmed' })
          .eq('stripe_session_id', session.id);
      }
      break;
    }

    case 'checkout.session.expired': {
      const session = event.data.object;
      if (session.id) {
        await supabase
          .from('bookings')
          .update({ status: 'cancelled' })
          .eq('stripe_session_id', session.id);
      }
      break;
    }

    case 'payment_intent.payment_failed': {
      console.log('Payment failed for intent:', event.data.object.id);
      break;
    }

    default:
      console.log(`Unhandled event type: ${event.type}`);
  }

  return NextResponse.json({ received: true });
}
