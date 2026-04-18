import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import CarCard from '@/components/cars/CarCard';
import { Car } from '@/types';
import { Search, MapPin, Shield, Star, Clock, ChevronRight, Car as CarIcon } from 'lucide-react';

export default async function HomePage() {
  const supabase = await createClient();
  const { data: featuredCars } = await supabase
    .from('cars')
    .select('*')
    .eq('is_active', true)
    .order('created_at', { ascending: false })
    .limit(4);

  return (
    <div className="bg-[#faf9f6]">

      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-green-950 via-green-900 to-green-800">
        <div className="absolute inset-0 opacity-[0.04]" style={{backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '32px 32px'}} />

        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 py-20 md:py-28">
          <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 text-green-200 px-3 py-1.5 rounded-full text-xs font-medium mb-7 backdrop-blur-sm">
            <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
            Now live in Baku, Azerbaijan
          </div>

          <h1 className="text-4xl md:text-6xl font-bold leading-[1.1] mb-5 text-white" style={{fontFamily: 'var(--font-display)'}}>
            Your next drive is<br />
            <span className="text-green-300">just around the corner</span>
          </h1>
          <p className="text-green-100/80 text-lg md:text-xl max-w-xl mb-10 leading-relaxed">
            Browse cars from trusted local owners across Azerbaijan. Book in minutes, pick up today.
          </p>

          <form action="/cars" method="GET" className="bg-white rounded-2xl p-2 flex flex-col sm:flex-row gap-2 max-w-2xl shadow-2xl">
            <div className="flex items-center gap-2 flex-1 px-3">
              <MapPin size={17} className="text-green-600 shrink-0" />
              <select name="location" className="flex-1 py-2.5 text-sm text-gray-800 bg-transparent border-none outline-none font-medium">
                <option value="">All cities</option>
                <option value="Baku">Baku</option>
                <option value="Ganja">Ganja</option>
                <option value="Sumqayit">Sumqayit</option>
                <option value="Sheki">Sheki</option>
              </select>
            </div>
            <div className="hidden sm:block w-px bg-gray-100 my-2" />
            <div className="flex items-center gap-2 flex-1 px-3">
              <span className="text-xs text-gray-400 font-semibold tracking-wide uppercase">From</span>
              <input type="date" name="startDate" className="flex-1 py-2.5 text-sm text-gray-800 bg-transparent border-none outline-none" />
            </div>
            <div className="hidden sm:block w-px bg-gray-100 my-2" />
            <div className="flex items-center gap-2 flex-1 px-3">
              <span className="text-xs text-gray-400 font-semibold tracking-wide uppercase">To</span>
              <input type="date" name="endDate" className="flex-1 py-2.5 text-sm text-gray-800 bg-transparent border-none outline-none" />
            </div>
            <button type="submit" className="bg-green-700 hover:bg-green-800 text-white px-6 py-3 rounded-xl font-semibold flex items-center gap-2 text-sm transition-all shadow-sm hover:shadow-md">
              <Search size={15} /> Search
            </button>
          </form>
        </div>
      </section>

      {/* Trust strip */}
      <section className="bg-white border-b border-gray-100">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-5 grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm text-gray-600">
          {[
            { icon: Shield, text: 'Verified owners & cars', sub: 'Every listing reviewed' },
            { icon: Star, text: 'Rated by real renters', sub: 'Honest community reviews' },
            { icon: MapPin, text: 'Airport delivery', sub: 'Available in Baku' },
          ].map(({ icon: Icon, text, sub }) => (
            <div key={text} className="flex items-center gap-3 justify-center">
              <div className="w-9 h-9 rounded-xl bg-green-50 flex items-center justify-center shrink-0">
                <Icon size={16} className="text-green-700" />
              </div>
              <div>
                <p className="font-semibold text-gray-800 text-sm">{text}</p>
                <p className="text-xs text-gray-400">{sub}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Featured cars */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
        <div className="flex items-end justify-between mb-8">
          <div>
            <p className="text-xs font-semibold tracking-widest text-green-700 uppercase mb-1">Available now</p>
            <h2 className="text-2xl font-bold text-gray-900" style={{fontFamily: 'var(--font-display)'}}>Featured Cars</h2>
          </div>
          <Link href="/cars" className="text-sm font-semibold text-green-700 hover:text-green-800 flex items-center gap-1">
            View all <ChevronRight size={14} />
          </Link>
        </div>

        {featuredCars && featuredCars.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {featuredCars.map((car: Car) => (
              <CarCard key={car.id} car={car} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 text-gray-400">
            <div className="w-16 h-16 rounded-2xl bg-gray-100 flex items-center justify-center mx-auto mb-4">
              <CarIcon size={28} className="text-gray-300" />
            </div>
            <p className="text-base font-medium text-gray-500 mb-1">No cars listed yet</p>
            <p className="text-sm text-gray-400 mb-4">Be the first to list your car on AvtoGo.</p>
            <Link href="/list-car" className="text-green-700 hover:text-green-800 text-sm font-semibold">
              List your car →
            </Link>
          </div>
        )}
      </section>

      {/* How it works */}
      <section className="bg-white border-y border-gray-100 py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center mb-10">
          <p className="text-xs font-semibold tracking-widest text-green-700 uppercase mb-2">Simple & fast</p>
          <h2 className="text-2xl font-bold text-gray-900" style={{fontFamily: 'var(--font-display)'}}>Rent a car in 3 steps</h2>
        </div>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 grid grid-cols-1 sm:grid-cols-3 gap-8">
          {[
            { step: '01', icon: Search, title: 'Search & filter', desc: 'Find cars by city, date, type, and budget. Hundreds of options across Azerbaijan.' },
            { step: '02', icon: Clock, title: 'Book instantly', desc: 'Confirm your booking online. No paperwork, no waiting — just a quick confirmation.' },
            { step: '03', icon: CarIcon, title: 'Pick up & drive', desc: 'Meet the owner or get airport delivery. Keys in hand, hit the road.' },
          ].map(({ step, icon: Icon, title, desc }) => (
            <div key={step} className="text-center">
              <div className="w-12 h-12 rounded-2xl bg-green-50 border border-green-100 flex items-center justify-center mx-auto mb-4">
                <Icon size={20} className="text-green-700" />
              </div>
              <p className="text-xs font-bold text-green-600 tracking-widest mb-1">{step}</p>
              <h3 className="font-bold text-gray-900 mb-2">{title}</h3>
              <p className="text-sm text-gray-500 leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Owner CTA */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="bg-gradient-to-br from-green-800 to-green-900 rounded-3xl px-8 py-12 text-center text-white relative overflow-hidden">
            <div className="absolute inset-0 opacity-[0.05]" style={{backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '24px 24px'}} />
            <div className="relative">
              <p className="text-green-300 text-sm font-semibold tracking-widest uppercase mb-3">Car owners</p>
              <h2 className="text-3xl font-bold mb-3" style={{fontFamily: 'var(--font-display)'}}>Earn from your car</h2>
              <p className="text-green-100/80 text-base max-w-md mx-auto mb-8 leading-relaxed">
                Your car earns money while you don&apos;t need it. Setup takes under 5 minutes — no fees to get started.
              </p>
              <Link
                href="/list-car"
                className="inline-flex items-center gap-2 bg-white text-green-800 hover:bg-green-50 px-8 py-3.5 rounded-xl font-bold transition-all shadow-lg hover:shadow-xl text-sm"
              >
                List Your Car Free <ChevronRight size={16} />
              </Link>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
