import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { CarCard } from '@/components/cars/CarCard';
import { Car } from '@/types';

const CITIES = ['Baku', 'Ganja', 'Sumqayit', 'Mingachevir', 'Nakhchivan', 'Lankaran', 'Sheki'];

export default async function HomePage() {
  const supabase = await createClient();

  const { data: featuredCars } = await supabase
    .from('cars')
    .select('*')
    .eq('is_available', true)
    .order('created_at', { ascending: false })
    .limit(4);

  return (
    <div className="pt-16">
      {/* ========= HERO ========= */}
      <section className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: 'radial-gradient(circle at 30% 50%, #16a34a 0%, transparent 50%), radial-gradient(circle at 70% 20%, #15803d 0%, transparent 40%)'
          }} />
        </div>

        <div className="container relative py-24 lg:py-36">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-green-600/20 border border-green-500/30 text-green-400 text-sm font-medium mb-6">
              <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
              Now available across Azerbaijan
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight tracking-tight mb-6">
              Drive anywhere in{' '}
              <span className="text-green-400">Azerbaijan</span>
            </h1>

            <p className="text-lg text-gray-300 max-w-xl mb-10 leading-relaxed">
              Rent directly from local owners and car companies. Best prices, zero hassle.
              From Baku to Sheki, we have got you covered.
            </p>

            {/* Search bar */}
            <form action="/cars" method="GET" className="bg-white rounded-2xl p-4 shadow-2xl">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="flex flex-col gap-1">
                  <label htmlFor="city" className="text-xs font-medium text-gray-500 px-1">City</label>
                  <select
                    id="city"
                    name="location"
                    className="px-3 py-2.5 rounded-lg border border-gray-200 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-500"
                  >
                    <option value="">All cities</option>
                    {CITIES.map((c) => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>

                <div className="flex flex-col gap-1">
                  <label htmlFor="from" className="text-xs font-medium text-gray-500 px-1">Pick-up date</label>
                  <input
                    id="from"
                    type="date"
                    name="startDate"
                    className="px-3 py-2.5 rounded-lg border border-gray-200 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label htmlFor="to" className="text-xs font-medium text-gray-500 px-1">Return date</label>
                  <input
                    id="to"
                    type="date"
                    name="endDate"
                    className="px-3 py-2.5 rounded-lg border border-gray-200 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>
              </div>

              <div className="mt-3">
                <button
                  type="submit"
                  className="w-full sm:w-auto px-8 py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-xl transition-colors"
                >
                  Search cars
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>

      {/* ========= FEATURED CARS ========= */}
      <section className="py-20">
        <div className="container">
          <div className="flex items-center justify-between mb-10">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Featured cars</h2>
              <p className="text-gray-500 mt-1">Handpicked by our team</p>
            </div>
            <Link
              href="/cars"
              className="text-sm font-medium text-green-600 hover:text-green-700 flex items-center gap-1"
            >
              View all <span aria-hidden>→</span>
            </Link>
          </div>

          {featuredCars && featuredCars.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {(featuredCars as Car[]).map((car) => (
                <CarCard key={car.id} car={car} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16 text-gray-400">
              <p>No cars listed yet. <Link href="/list-car" className="text-green-600 hover:underline">Be the first!</Link></p>
            </div>
          )}
        </div>
      </section>

      {/* ========= HOW IT WORKS ========= */}
      <section className="py-20 bg-gray-50">
        <div className="container">
          <div className="text-center mb-14">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">How AvtoGo works</h2>
            <p className="text-gray-500">Three steps to hit the road</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {[
              { step: '01', title: 'Search', desc: 'Find available cars in your city by date and price.' },
              { step: '02', title: 'Book', desc: 'Pick your car, enter driver details, confirm your booking.' },
              { step: '03', title: 'Drive', desc: 'Meet the owner, get the keys, and hit the road.' },
            ].map(({ step, title, desc }) => (
              <div key={step} className="text-center">
                <div className="w-12 h-12 rounded-2xl bg-green-600 text-white font-bold text-lg flex items-center justify-center mx-auto mb-4">
                  {step}
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">{title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========= OWNER CTA ========= */}
      <section className="py-20">
        <div className="container">
          <div className="bg-green-600 rounded-3xl p-10 md:p-16 text-white text-center relative overflow-hidden">
            <div className="absolute inset-0 opacity-10" style={{
              backgroundImage: 'radial-gradient(circle at 80% 50%, white 0%, transparent 60%)'
            }} />
            <div className="relative">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Own a car? Earn with it.</h2>
              <p className="text-green-100 max-w-xl mx-auto mb-8 leading-relaxed">
                List your vehicle on AvtoGo and earn money every day it sits idle.
                Join hundreds of owners already earning across Azerbaijan.
              </p>
              <Link
                href="/list-car"
                className="inline-flex items-center gap-2 px-8 py-3.5 bg-white text-green-700 font-semibold rounded-xl hover:bg-green-50 transition-colors"
              >
                List your car — it&apos;s free
                <span aria-hidden>→</span>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
