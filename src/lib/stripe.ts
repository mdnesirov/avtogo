import Stripe from 'stripe';

if (!process.env.STRIPE_SECRET_KEY) {
  console.warn('Warning: STRIPE_SECRET_KEY is not set. Stripe features will not work.');
}

export const stripe = process.env.STRIPE_SECRET_KEY
  ? new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: '2024-06-20',
      typescript: true,
    })
  : null;

export async function createCheckoutSession({
  carName,
  pricePerDay,
  totalDays,
  totalPrice,
  bookingId,
  successUrl,
  cancelUrl,
}: {
  carName: string;
  pricePerDay: number;
  totalDays: number;
  totalPrice: number;
  bookingId: string;
  successUrl: string;
  cancelUrl: string;
}) {
  const successUrlObj = new URL(successUrl);
  if (!successUrlObj.searchParams.has('booking_id')) {
    successUrlObj.searchParams.set('booking_id', bookingId);
  }
  if (!successUrlObj.searchParams.has('session_id')) {
    successUrlObj.searchParams.set('session_id', '{CHECKOUT_SESSION_ID}');
  }

  if (!stripe) {
    successUrlObj.searchParams.set('mock', 'true');
    return {
      id: `mock_session_${bookingId}`,
      url: successUrlObj.toString(),
    };
  }

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    line_items: [
      {
        price_data: {
          currency: 'azn',
          product_data: {
            name: `AvtoGo — ${carName}`,
            description: `${totalDays} day${totalDays > 1 ? 's' : ''} rental`,
            images: [],
          },
          unit_amount: Math.round(pricePerDay * 100),
        },
        quantity: totalDays,
      },
    ],
    mode: 'payment',
    success_url: successUrlObj.toString(),
    cancel_url: cancelUrl,
    metadata: {
      booking_id: bookingId,
    },
  });

  return session;
}

// Creates a deposit hold — money is authorised but NOT charged until captured
export async function createDepositHold({
  depositAmount,
  bookingId,
  carName,
}: {
  depositAmount: number;
  bookingId: string;
  carName: string;
}) {
  if (!stripe) {
    return { id: `mock_deposit_${bookingId}` };
  }

  const paymentIntent = await stripe.paymentIntents.create({
    amount: Math.round(depositAmount * 100),
    currency: 'azn',
    capture_method: 'manual',
    description: `Security deposit — AvtoGo: ${carName}`,
    metadata: {
      booking_id: bookingId,
      type: 'deposit_hold',
    },
  });

  return paymentIntent;
}

// Rental completed normally — release the hold (renter gets deposit back)
export async function releaseDepositHold(paymentIntentId: string) {
  if (!stripe) return;
  await stripe.paymentIntents.cancel(paymentIntentId);
}

// Renter cancelled / no-show — capture the hold (owner keeps deposit)
export async function captureDepositHold(paymentIntentId: string) {
  if (!stripe) return;
  await stripe.paymentIntents.capture(paymentIntentId);
}
