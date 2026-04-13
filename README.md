# AvtoGo 🚗

Peer-to-peer car rental marketplace for Azerbaijan — a hybrid between Airbnb and Turo where car rental companies and private owners can list vehicles, and locals/tourists can rent them online.

## Stack

- **Frontend:** Next.js 14 App Router + TailwindCSS
- **Backend:** Supabase (Postgres + Auth + Storage)
- **Payments:** Stripe (placeholder integration)
- **Maps:** Google Maps API
- **Hosting:** Vercel

## Getting Started

### 1. Clone the repo

```bash
git clone https://github.com/mdnesirov/avtogo.git
cd avtogo
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up environment variables

Copy `.env.example` to `.env.local` and fill in your values:

```bash
cp .env.example .env.local
```

### 4. Set up Supabase

1. Create a project at [supabase.com](https://supabase.com)
2. Run migrations in order from `supabase/migrations/`
3. Add your Supabase URL and keys to `.env.local`

### 5. Run dev server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Project Structure

```
avtogo/
├── app/                  # Next.js App Router pages
│   ├── page.tsx           # Landing page /
│   ├── cars/             # Browse + car detail
│   ├── booking/          # Booking flow
│   ├── list-car/         # Owner listing form
│   ├── dashboard/        # Owner dashboard
│   ├── auth/             # Login / Signup
│   └── api/              # API routes
├── components/
│   ├── layout/           # Navbar, Footer
│   ├── cars/             # CarCard, CarFilters, etc.
│   ├── booking/          # BookingForm, Calendar
│   ├── forms/            # ListCarForm, SearchBar
│   ├── dashboard/        # Owner tables
│   └── ui/               # Button, Input, Badge, etc.
├── lib/
│   ├── supabase/         # Browser + server clients
│   ├── actions/          # Server actions
│   ├── validations/      # Zod schemas
│   ├── stripe.ts
│   ├── maps.ts
│   └── whatsapp.ts
├── supabase/
│   └── migrations/       # SQL schema + policies + seed
└── types/                # TypeScript types
```

## Pages

| Route | Description |
|---|---|
| `/` | Landing page — hero, search, featured cars, owner CTA |
| `/cars` | Browse with filters |
| `/cars/[id]` | Car detail, gallery, booking CTA |
| `/booking/[carId]` | 3-step booking flow |
| `/list-car` | Owner listing form |
| `/dashboard` | Owner dashboard |
| `/auth/login` | Sign in |
| `/auth/signup` | Create account |

## Deployment

Deploy to Vercel:
1. Push to GitHub
2. Import at [vercel.com](https://vercel.com)
3. Add all environment variables
4. Deploy

## Environment Variables

See `.env.example` for all required variables.

## License

MIT
