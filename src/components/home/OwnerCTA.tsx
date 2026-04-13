import Link from 'next/link';
import { Car, TrendingUp, Shield } from 'lucide-react';

export default function OwnerCTA() {
  return (
    <section className="bg-gray-900 text-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <div className="inline-flex items-center gap-2 bg-green-600/20 border border-green-500/30 text-green-300 text-xs font-medium px-3 py-1.5 rounded-full mb-6">
              For Car Owners
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Turn your car into
              <span className="text-green-400"> extra income</span>
            </h2>
            <p className="text-gray-400 text-lg mb-8">
              List your car for free and start earning. Join hundreds of owners already making money with AvtoGo.
            </p>
            <Link href="/list-car" className="btn-primary text-base px-8 py-3">
              List Your Car &rarr;
            </Link>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {[
              { icon: TrendingUp, title: 'Earn ₼1,500+/month', desc: 'Top owners earn over ₼1,500 per month renting their cars.' },
              { icon: Shield,     title: 'Full insurance coverage', desc: 'Every rental is covered. Drive with peace of mind.' },
              { icon: Car,        title: 'You control everything', desc: 'Set your own price, availability, and pickup terms.' },
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
