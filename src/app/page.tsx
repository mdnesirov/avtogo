import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import CarCard from '@/components/cars/CarCard';
import { Car } from '@/types';
import { Search, MapPin } from 'lucide-react';

export default async function HomePage() {
  const supabase = await createClient();
  const { data: featuredCars } = await supabase
    .from('cars')
    .select('*')
    .eq('is_active', true)
    .order('created_at', { ascending: false })
    .limit(4);

  return (
    <div>
      <section className="relative overflow-hidden bg-[var(--color-primary)] text-white min-h-[92vh] flex items-center">
        <div className="absolute inset-0 hero-grid opacity-80" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-24 md:py-28 w-full">
          <div className="max-w-4xl fade-in-up">
            <p className="text-[var(--color-accent)] text-xs sm:text-sm uppercase tracking-[0.26em] font-semibold mb-5">
              Azerbaijan&apos;s #1 Car Rental Platform
            </p>
            <h1 className="font-display italic leading-[0.95] text-[var(--text-hero)] text-white">
              Find your perfect
            </h1>
            <h1 className="font-display leading-[0.95] text-[var(--text-hero)] text-[var(--color-accent)]">ride.</h1>
            <p className="text-white/72 text-base sm:text-lg max-w-2xl mt-7">
              Discover premium and everyday vehicles from trusted owners across Azerbaijan. Designed for seamless booking and confident travel.
            </p>
          </div>

          <div className="fade-in-up-delay mt-12">
            <form
              action="/cars"
              method="GET"
              className="bg-[var(--color-surface)] rounded-[var(--radius-full)] p-2.5 flex flex-col lg:flex-row gap-2 max-w-5xl shadow-[var(--shadow-lg)] border border-black/5"
            >
              <div className="flex items-center gap-2 flex-1 px-3 sm:px-5 rounded-full bg-[var(--color-surface-2)]">
                <MapPin size={17} className="text-[var(--color-text-faint)] shrink-0" />
                <select
                  name="location"
                  className="flex-1 py-3 text-sm text-[var(--color-text)] bg-transparent border-none outline-none rounded-full"
                >
                  <option value="">All cities</option>
                  <option value="Baku">Baku</option>
                  <option value="Ganja">Ganja</option>
                  <option value="Sumqayit">Sumqayit</option>
                  <option value="Sheki">Sheki</option>
                </select>
              </div>
              <input type="date" name="startDate" className="input rounded-full lg:max-w-[190px]" aria-label="Start date" />
              <input type="date" name="endDate" className="input rounded-full lg:max-w-[190px]" aria-label="End date" />
              <button type="submit" className="btn-primary bg-[var(--color-primary)] text-white px-8 py-3.5">
                <Search size={16} className="mr-2" /> Search
              </button>
            </form>
            <div className="flex flex-wrap items-center gap-4 sm:gap-7 mt-5 text-sm text-white/80">
              <span>🛡 Verified owners</span>
              <span>⭐ Rated by renters</span>
              <span>✈ Airport delivery</span>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[var(--color-surface)] border-y border-black/10 fade-in-up">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 grid grid-cols-1 sm:grid-cols-3 gap-8 text-center">
          <div>
            <p className="text-4xl font-semibold text-[var(--color-primary)]">500+</p>
            <p className="text-sm text-[var(--color-text-muted)] mt-1">Cars</p>
          </div>
          <div>
            <p className="text-4xl font-semibold text-[var(--color-primary)]">4.9★</p>
            <p className="text-sm text-[var(--color-text-muted)] mt-1">Average Rating</p>
          </div>
          <div>
            <p className="text-4xl font-semibold text-[var(--color-primary)]">3</p>
            <p className="text-sm text-[var(--color-text-muted)] mt-1">Cities</p>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-20 fade-in-up">
        <div className="flex items-end justify-between mb-9 gap-5">
          <div>
            <p className="text-xs uppercase tracking-[0.22em] font-semibold text-[var(--color-accent)] mb-3">Fleet</p>
            <h2 className="font-display text-[var(--text-4xl)] text-[var(--color-primary)]">Featured Cars</h2>
          </div>
          <Link href="/cars" className="btn-secondary hidden sm:inline-flex">
            View all
          </Link>
        </div>

        {featuredCars && featuredCars.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
            {featuredCars.map((car: Car) => (
              <CarCard key={car.id} car={car} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 text-[var(--color-text-muted)]">
            <p className="text-lg">No cars listed yet.</p>
            <Link href="/list-car" className="text-[var(--color-primary)] hover:text-[var(--color-accent)] text-sm mt-2 inline-block">
              Be the first to list your car →
            </Link>
          </div>
        )}
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 pb-20 fade-in-up">
        <div className="grid lg:grid-cols-2 overflow-hidden rounded-[var(--radius-xl)] border border-black/10">
          <div className="bg-[var(--color-primary)] text-white p-8 sm:p-12">
            <h2 className="font-display text-[var(--text-4xl)] leading-[1.05] mb-4">Turn your car into extra income</h2>
            <p className="text-white/75 max-w-md mb-8">
              Join Azerbaijan&apos;s premium rental marketplace and monetize your vehicle with full control and trusted protection.
            </p>
            <Link href="/list-car" className="btn-primary bg-[var(--color-accent)] !text-[var(--color-primary)] hover:!text-white hover:bg-[var(--color-accent-hover)]">
              List Your Car Free
            </Link>
            <ul className="mt-9 space-y-3 text-sm text-white/85">
              <li>₼1,500+/month</li>
              <li>Full insurance</li>
              <li>You control everything</li>
            </ul>
          </div>
          <div className="min-h-[320px] bg-[radial-gradient(circle_at_20%_20%,rgba(200,169,110,0.32),transparent_48%),linear-gradient(160deg,#1f2748_0%,#121220_62%,#0f1020_100%)]" />
        </div>
      </section>
    </div>
  );
}
