'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search, MapPin, Calendar } from 'lucide-react';

const CITIES = ['Baku', 'Ganja', 'Sumqayit', 'Lənkəran', 'Sheki', 'Quba'];

export default function HeroSearch() {
  const router = useRouter();
  const [city, setCity] = useState('');
  const [from, setFrom] = useState('');
  const [to, setTo]     = useState('');

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    const params = new URLSearchParams();
    if (city) params.set('city', city);
    if (from) params.set('from', from);
    if (to)   params.set('to', to);
    router.push(`/cars?${params.toString()}`);
  }

  return (
    <section className="relative bg-gray-900 text-white overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        <img
          src="https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?w=1600&q=80"
          alt=""
          className="w-full h-full object-cover opacity-40"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/70" />
      </div>

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
        <div className="max-w-2xl">
          <div className="inline-flex items-center gap-2 bg-green-600/20 border border-green-500/30 text-green-300 text-xs font-medium px-3 py-1.5 rounded-full mb-6">
            🇦🇿 Azerbaijan&apos;s #1 Car Rental Platform
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-4">
            Find your perfect
            <span className="text-green-400"> ride</span>
          </h1>
          <p className="text-lg text-gray-300 mb-8">
            Rent from trusted locals and companies across Azerbaijan.
            The best cars at the best prices.
          </p>

          {/* Search box */}
          <form
            onSubmit={handleSearch}
            className="bg-white rounded-2xl p-4 shadow-2xl flex flex-col sm:flex-row gap-3"
          >
            <div className="flex-1 flex items-center gap-2 border border-gray-200 rounded-xl px-3 py-2.5">
              <MapPin size={16} className="text-green-600 shrink-0" />
              <select
                value={city}
                onChange={e => setCity(e.target.value)}
                className="w-full text-sm text-gray-700 bg-transparent focus:outline-none"
              >
                <option value="">Any city</option>
                {CITIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>

            <div className="flex items-center gap-2 border border-gray-200 rounded-xl px-3 py-2.5">
              <Calendar size={16} className="text-green-600 shrink-0" />
              <input
                type="date"
                value={from}
                onChange={e => setFrom(e.target.value)}
                className="text-sm text-gray-700 bg-transparent focus:outline-none w-32"
                min={new Date().toISOString().split('T')[0]}
              />
            </div>

            <div className="flex items-center gap-2 border border-gray-200 rounded-xl px-3 py-2.5">
              <Calendar size={16} className="text-green-600 shrink-0" />
              <input
                type="date"
                value={to}
                onChange={e => setTo(e.target.value)}
                className="text-sm text-gray-700 bg-transparent focus:outline-none w-32"
                min={from || new Date().toISOString().split('T')[0]}
              />
            </div>

            <button type="submit" className="btn-primary shrink-0">
              <Search size={16} />
              Search
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
