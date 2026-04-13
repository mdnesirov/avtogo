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
  if (!stripe) {
    // Placeholder mode — return a mock session for development
    return {
      id: `mock_session_${bookingId}`,
      url: `${successUrl}?booking_id=${bookingId}&mock=true`,
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
          unit_amount: Math.round(pricePerDay * 100), // Stripe uses smallest currency unit
        },
        quantity: totalDays,
      },
    ],
    mode: 'payment',
    success_url: `${successUrl}?booking_id=${bookingId}&session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: cancelUrl,
    metadata: {
      booking_id: bookingId,
    },
  });

  return session;
}
