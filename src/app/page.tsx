import { createClient } from '@/lib/supabase/server';
import { Car } from '@/types';
import HeroSearch from '@/components/home/HeroSearch';
import OwnerCTA from '@/components/home/OwnerCTA';
import CarCard from '@/components/cars/CarCard';
import Link from 'next/link';

export const revalidate = 60;

export default async function HomePage() {
  const supabase = await createClient();
  const { data: featuredCars } = await supabase
    .from('cars')
    .select('*')
    .eq('is_available', true)
    .order('rating', { ascending: false })
    .limit(6);

  const cars: Car[] = featuredCars ?? [];

  return (
    <>
      <HeroSearch />

      {/* Stats bar */}
      <div className="bg-green-600 text-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="grid grid-cols-3 gap-4 text-center">
            {[
              { value: '500+', label: 'Cars listed' },
              { value: '12',   label: 'Cities covered' },
              { value: '2,000+', label: 'Happy renters' },
            ].map(({ value, label }) => (
              <div key={label}>
                <div className="text-xl font-bold">{value}</div>
                <div className="text-xs text-green-100">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Featured cars */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="section-title">Featured Cars</h2>
            <p className="text-gray-500 text-sm mt-1">Top-rated vehicles available now</p>
          </div>
          <Link href="/cars" className="btn-secondary">
            View all &rarr;
          </Link>
        </div>

        {cars.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {cars.map(car => <CarCard key={car.id} car={car} />)}
          </div>
        ) : (
          <div className="text-center py-20 text-gray-400">
            <p className="text-lg mb-2">No cars listed yet.</p>
            <Link href="/list-car" className="btn-primary">Be the first to list!</Link>
          </div>
        )}
      </section>

      {/* How it works */}
      <section className="bg-gray-50 py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="section-title text-center mb-12">How AvtoGo works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { step: '01', title: 'Search', desc: 'Browse hundreds of cars by city, price, and type.' },
              { step: '02', title: 'Book',   desc: 'Select dates, enter your details, and confirm your booking.' },
              { step: '03', title: 'Drive',  desc: 'Pick up your car and hit the road. It\'s that simple.' },
            ].map(({ step, title, desc }) => (
              <div key={step} className="text-center">
                <div className="w-12 h-12 rounded-full bg-green-600 text-white font-bold text-lg flex items-center justify-center mx-auto mb-4">
                  {step}
                </div>
                <h3 className="font-semibold text-gray-900 mb-2 text-lg">{title}</h3>
                <p className="text-gray-500 text-sm">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <OwnerCTA />
    </>
  );
}
