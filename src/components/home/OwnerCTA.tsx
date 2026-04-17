'use client';

import Link from 'next/link';
import { Car, TrendingUp, Shield } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { translations } from '@/lib/i18n/translations';

export default function OwnerCTA() {
  const { lang } = useLanguage();
  const tx = translations[lang];

  return (
    <section className="bg-gray-900 text-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <div className="inline-flex items-center gap-2 bg-green-600/20 border border-green-500/30 text-green-300 text-xs font-medium px-3 py-1.5 rounded-full mb-6">
              {tx.ownerForCarOwners}
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              {tx.ownerTurnCarInto}
              <span className="text-green-400"> {tx.ownerExtraIncome}</span>
            </h2>
            <p className="text-gray-400 text-lg mb-8">
              {tx.ownerDescription}
            </p>
            <Link href="/list-car" className="btn-primary text-base px-8 py-3">
              {tx.ownerListCarArrow}
            </Link>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {[
              { icon: TrendingUp, title: tx.ownerEarnTitle, desc: tx.ownerEarnDesc },
              { icon: Shield,     title: tx.ownerInsuranceTitle, desc: tx.ownerInsuranceDesc },
              { icon: Car,        title: tx.ownerControlTitle, desc: tx.ownerControlDesc },
            ].map(({ icon: Icon, title, desc }) => (
              <div key={title} className="flex items-start gap-4 bg-white/5 border border-white/10 rounded-xl p-4">
                <div className="p-2 bg-green-600/20 rounded-lg shrink-0">
                  <Icon size={20} className="text-green-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-white mb-1">{title}</h3>
                  <p className="text-sm text-gray-400">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
