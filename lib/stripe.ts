import Stripe from 'stripe'

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-06-20',
})

export async function createCheckoutSession({
  carName,
  totalPrice,
  bookingId,
  successUrl,
  cancelUrl,
}: {
  carName: string
  totalPrice: number
  bookingId: string
  successUrl: string
  cancelUrl: string
}) {
  // Placeholder — implement full Stripe checkout when payment goes live
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    line_items: [
      {
        price_data: {
          currency: 'azn',
          product_data: { name: `AvtoGo: ${carName}` },
          unit_amount: Math.round(totalPrice * 100),
        },
        quantity: 1,
      },
    ],
    mode: 'payment',
    success_url: `${successUrl}?session_id={CHECKOUT_SESSION_ID}&booking_id=${bookingId}`,
    cancel_url: cancelUrl,
    metadata: { bookingId },
  })

  return session
}
