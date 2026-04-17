'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Search, MapPin, Shield, Star } from 'lucide-react';
import CarCard from '@/components/cars/CarCard';
import { Car } from '@/types';
import { useLanguage } from '@/context/LanguageContext';
import { translations } from '@/lib/i18n/translations';

export default function HomePageContent({ featuredCars }: { featuredCars: Car[] }) {
  const { lang } = useLanguage();
  const tx = translations[lang];
  const [isLangVisible, setIsLangVisible] = useState(true);

  useEffect(() => {
    setIsLangVisible(false);
    const timeoutId = window.setTimeout(() => setIsLangVisible(true), 20);
    return () => window.clearTimeout(timeoutId);
  }, [lang]);

  const langVisibilityClass = isLangVisible ? 'opacity-100' : 'opacity-0';

  return (
    <div>
      <section className="bg-gray-900 text-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-20 md:py-28 text-center">
          <div className={`inline-flex items-center gap-2 bg-green-600/20 border border-green-500/30 text-green-400 px-3 py-1 rounded-full text-sm mb-6 lang-transition ${langVisibilityClass}`}>
            <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            {tx.homeLiveInBaku}
          </div>
          <h1 className={`text-4xl md:text-6xl font-bold leading-tight mb-6 lang-transition ${langVisibilityClass}`}>
            {tx.homeTitle.split(tx.homeCountry)[0]}<br />
            <span className="text-green-400">{tx.homeCountry}</span>
          </h1>
          <p className={`text-gray-400 text-lg md:text-xl max-w-2xl mx-auto mb-10 lang-transition ${langVisibilityClass}`}>
            {tx.homeSubtitle}
          </p>

          <form action="/cars" method="GET" className="bg-white rounded-2xl p-2 flex flex-col sm:flex-row gap-2 max-w-2xl mx-auto shadow-xl">
            <div className="flex items-center gap-2 flex-1 px-3">
              <MapPin size={18} className="text-gray-400 shrink-0" />
              <select name="location" className="flex-1 py-2.5 text-sm text-gray-900 bg-transparent border-none outline-none">
                <option value="">{tx.cityAll}</option>
                <option value="Baku">{tx.cityBaku}</option>
                <option value="Ganja">{tx.cityGanja}</option>
                <option value="Sumqayit">{tx.citySumqayit}</option>
                <option value="Sheki">{tx.citySheki}</option>
              </select>
            </div>
            <div className="hidden sm:block w-px bg-gray-200" />
            <div className="flex items-center gap-2 flex-1 px-3">
              <span className="text-xs text-gray-400 font-medium">{tx.homeFrom}</span>
              <input type="date" name="startDate" className="flex-1 py-2.5 text-sm text-gray-900 bg-transparent border-none outline-none" />
            </div>
            <div className="hidden sm:block w-px bg-gray-200" />
            <div className="flex items-center gap-2 flex-1 px-3">
              <span className="text-xs text-gray-400 font-medium">{tx.homeTo}</span>
              <input type="date" name="endDate" className="flex-1 py-2.5 text-sm text-gray-900 bg-transparent border-none outline-none" />
            </div>
              <button
                type="submit"
                className={`bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-xl font-medium flex items-center justify-center gap-2 text-sm min-w-[12rem] whitespace-nowrap transition-all duration-150 lang-transition ${langVisibilityClass}`}
              >
                <Search size={16} /> {tx.browseCarsTitle}
              </button>
          </form>
        </div>
      </section>

      <section className="border-b border-gray-100 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm text-gray-600">
          {[
            { icon: Shield, text: tx.homeFeatureVerified },
            { icon: Star, text: tx.homeFeatureRated },
            { icon: MapPin, text: tx.homeFeatureAirport },
          ].map(({ icon: Icon, text }) => (
            <div key={text} className="flex items-center gap-2 justify-center transition-all duration-150">
              <Icon size={16} className="text-green-600" />
              <span className={`lang-transition ${langVisibilityClass}`}>{text}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className={`text-2xl font-bold text-gray-900 lang-transition ${langVisibilityClass}`}>{tx.homeFeaturedCars}</h2>
            <p className={`text-gray-500 text-sm mt-1 lang-transition ${langVisibilityClass}`}>{tx.homeFeaturedSubtitle}</p>
          </div>
          <Link href="/cars" className={`text-green-600 hover:text-green-700 text-sm font-medium whitespace-nowrap transition-all duration-150 lang-transition ${langVisibilityClass}`}>
            {tx.homeViewAll}
          </Link>
        </div>

        {featuredCars.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {featuredCars.map((car: Car) => (
              <CarCard key={car.id} car={car} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 text-gray-400">
            <p className={`text-lg lang-transition ${langVisibilityClass}`}>{tx.homeNoCars}</p>
            <Link href="/list-car" className={`text-green-600 hover:text-green-700 text-sm mt-2 inline-block whitespace-nowrap transition-all duration-150 lang-transition ${langVisibilityClass}`}>
              {tx.homeBeFirst}
            </Link>
          </div>
        )}
      </section>

      <section className="bg-green-600 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-16 text-center">
          <h2 className={`text-3xl font-bold mb-4 lang-transition ${langVisibilityClass}`}>{tx.homeIdleCarTitle}</h2>
          <p className={`text-green-100 text-lg max-w-xl mx-auto mb-8 lang-transition ${langVisibilityClass}`}>
            {tx.homeIdleCarSubtitle}
          </p>
          <Link
            href="/list-car"
            className={`inline-flex items-center justify-center gap-2 bg-white text-green-700 hover:bg-green-50 px-8 py-4 rounded-xl font-semibold min-w-[10rem] whitespace-nowrap transition-all duration-150 lang-transition ${langVisibilityClass}`}
          >
            {tx.homeListFree}
          </Link>
        </div>
      </section>
    </div>
  );
}
