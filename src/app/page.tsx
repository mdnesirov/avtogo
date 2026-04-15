import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import CarCard from '@/components/cars/CarCard';
import { Car } from '@/types';
import { Search, MapPin, Shield, Star } from 'lucide-react';

export default async function HomePage() {
  const supabase = await createClient();
  const { data: featuredCars } = await supabase
    .from('cars')
    .select('*')
    .eq('is_available', true)
    .order('created_at', { ascending: false })
    .limit(4);

  return (
    <div>
      {/* Hero */}
      <section className="bg-gray-900 text-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-20 md:py-28 text-center">
          <div className="inline-flex items-center gap-2 bg-green-600/20 border border-green-500/30 text-green-400 px-3 py-1 rounded-full text-sm mb-6">
            <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            Now live in Baku
          </div>
          <h1 className="text-4xl md:text-6xl font-bold leading-tight mb-6">
            Rent any car in<br />
            <span className="text-green-400">Azerbaijan</span>
          </h1>
          <p className="text-gray-400 text-lg md:text-xl max-w-2xl mx-auto mb-10">
            Browse cars from local owners and rental companies. Book in minutes, drive today.
          </p>

          {/* Search bar */}
          <form action="/cars" method="GET" className="bg-white rounded-2xl p-2 flex flex-col sm:flex-row gap-2 max-w-2xl mx-auto shadow-xl">
            <div className="flex items-center gap-2 flex-1 px-3">
              <MapPin size={18} className="text-gray-400 shrink-0" />
              <select name="location" className="flex-1 py-2.5 text-sm text-gray-900 bg-transparent border-none outline-none">
                <option value="">All cities</option>
                <option value="Baku">Baku</option>
                <option value="Ganja">Ganja</option>
                <option value="Sumqayit">Sumqayit</option>
                <option value="Sheki">Sheki</option>
              </select>
            </div>
            <div className="hidden sm:block w-px bg-gray-200" />
            <div className="flex items-center gap-2 flex-1 px-3">
              <span className="text-xs text-gray-400 font-medium">From</span>
              <input type="date" name="startDate" className="flex-1 py-2.5 text-sm text-gray-900 bg-transparent border-none outline-none" />
            </div>
            <div className="hidden sm:block w-px bg-gray-200" />
            <div className="flex items-center gap-2 flex-1 px-3">
              <span className="text-xs text-gray-400 font-medium">To</span>
              <input type="date" name="endDate" className="flex-1 py-2.5 text-sm text-gray-900 bg-transparent border-none outline-none" />
            </div>
            <button
              type="submit"
              className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-xl font-medium flex items-center gap-2 text-sm transition-colors"
            >
              <Search size={16} /> Search
            </button>
          </form>
        </div>
      </section>

      {/* Features strip */}
      <section className="border-b border-gray-100 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm text-gray-600">
          {[
            { icon: Shield, text: 'Verified owners & cars' },
            { icon: Star, text: 'Rated by real renters' },
            { icon: MapPin, text: 'Airport delivery available' },
          ].map(({ icon: Icon, text }) => (
            <div key={text} className="flex items-center gap-2 justify-center">
              <Icon size={16} className="text-green-600" />
              <span>{text}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Featured cars */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Featured Cars</h2>
            <p className="text-gray-500 text-sm mt-1">Handpicked vehicles available now</p>
          </div>
          <Link href="/cars" className="text-green-600 hover:text-green-700 text-sm font-medium">
            View all →
          </Link>
        </div>

        {featuredCars && featuredCars.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {featuredCars.map((car: Car) => (
              <CarCard key={car.id} car={car} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 text-gray-400">
            <p className="text-lg">No cars listed yet.</p>
            <Link href="/list-car" className="text-green-600 hover:text-green-700 text-sm mt-2 inline-block">
              Be the first to list your car →
            </Link>
          </div>
        )}
      </section>

      {/* Owner CTA */}
      <section className="bg-green-600 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-16 text-center">
          <h2 className="text-3xl font-bold mb-4">Have a car sitting idle?</h2>
          <p className="text-green-100 text-lg max-w-xl mx-auto mb-8">
            List it on AvtoGo and earn money whenever it&apos;s not in use. Setup takes under 5 minutes.
          </p>
          <Link
            href="/list-car"
            className="inline-flex items-center gap-2 bg-white text-green-700 hover:bg-green-50 px-8 py-4 rounded-xl font-semibold transition-colors"
          >
            List Your Car Free
          </Link>
        </div>
      </section>
    </div>
  );
}
