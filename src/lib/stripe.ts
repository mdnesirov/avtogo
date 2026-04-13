import Stripe from 'stripe'

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-06-20',
  typescript: true,
})

export function formatAmountForStripe(amount: number): number {
  // Convert AZN to cents (tiyn) — Stripe uses smallest currency unit
  return Math.round(amount * 100)
}
