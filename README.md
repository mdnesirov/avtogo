# AvtoGo 🚗

> Peer-to-peer car rental marketplace for Azerbaijan — powered by Next.js, Supabase, and Stripe.

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Next.js 14 (App Router) + TypeScript |
| Styling | Tailwind CSS v3 |
| Auth + Database | Supabase (Postgres + Row Level Security) |
| Payments | Stripe Checkout |
| Maps | Google Maps Embed API |
| Hosting | Vercel |

---

## Getting Started

### 1. Clone the repo

```bash
git clone https://github.com/mdnesirov/avtogo.git
cd avtogo
npm install
```

### 2. Set up environment variables

```bash
cp .env.example .env.local
```

Fill in `.env.local` with your keys (see `.env.example` for all required variables).

### 3. Set up Supabase

1. Create a project at [supabase.com](https://supabase.com)
2. Go to **SQL Editor** and run:
   - `supabase/migrations/001_initial_schema.sql`
   - `supabase/seed.sql` (optional sample data)
3. Go to **Storage** → Create a new bucket named `car-images` → Set to **Public**
4. Copy your project URL and anon key into `.env.local`

### 4. Run locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## Deploy to Vercel

```bash
npm i -g vercel
vercel --prod
```

Add all environment variables from `.env.example` in your Vercel project settings under **Settings → Environment Variables**.

### Stripe Webhook (production)

Once deployed, register your webhook URL in the Stripe Dashboard:

```
https://your-domain.vercel.app/api/stripe/webhook
```

Events to listen for:
- `checkout.session.completed`
- `checkout.session.expired`
- `payment_intent.payment_failed`

---

## Project Structure

```
src/
├── app/                  # Next.js App Router pages
│   ├── page.tsx           # Landing page /
│   ├── cars/page.tsx      # Browse cars /cars
│   ├── cars/[id]/page.tsx # Car detail /cars/[id]
│   ├── booking/           # Booking flow
│   ├── list-car/          # List a car
│   ├── dashboard/         # Owner dashboard
│   ├── auth/              # Login / signup
│   └── api/               # API routes
├── components/            # Reusable UI components
├── hooks/                 # Custom React hooks
├── lib/                   # Supabase, Stripe, Maps clients
└── types/                 # TypeScript interfaces
```

---

## Pages

| Route | Description |
|---|---|
| `/` | Landing — hero search, featured cars, owner CTA |
| `/cars` | Browse all available cars with filters |
| `/cars/[id]` | Car detail — gallery, specs, booking calendar |
| `/booking/confirmation` | Post-payment booking confirmation |
| `/list-car` | Form to list a new vehicle |
| `/dashboard` | Owner dashboard — manage cars and bookings |
| `/auth` | Login / Sign up |

---

## Database Schema

See `supabase/migrations/001_initial_schema.sql` for full schema including:
- `profiles` — extends Supabase auth users
- `cars` — vehicle listings with location, specs, pricing
- `bookings` — rental records with Stripe session references
- Row Level Security policies on all tables
- Postgres EXCLUDE constraint to prevent booking overlaps

---

## Environment Variables

See `.env.example` for the full list. Required:

```bash
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=
NEXT_PUBLIC_APP_URL=
```

---

Built with ❤️ for Azerbaijan 🇦🇿
