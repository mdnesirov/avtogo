'use client';

import {Link} from '@/i18n/navigation';
import {useTranslations} from 'next-intl';

export default function Footer() {
  const t = useTranslations('footer');

  return (
    <footer className="bg-gray-900 text-gray-400 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-3">
              <svg width="28" height="28" viewBox="0 0 32 32" fill="none" aria-label="AvtoGo">
                <rect width="32" height="32" rx="8" fill="#16a34a" />
                <path d="M6 20l3-7h14l3 7" stroke="white" strokeWidth="2" strokeLinecap="round" />
                <circle cx="10" cy="22" r="2" fill="white" />
                <circle cx="22" cy="22" r="2" fill="white" />
                <path d="M7 16h18" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
              <span className="text-white font-bold text-lg">AvtoGo</span>
            </div>
            <p className="text-sm leading-relaxed max-w-xs">
              {t('description')}
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="text-white text-sm font-semibold mb-3">{t('platform')}</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/cars" className="hover:text-white transition-colors">{t('browseCars')}</Link></li>
              <li><Link href="/list-car" className="hover:text-white transition-colors">{t('listYourCar')}</Link></li>
              <li><Link href="/dashboard" className="hover:text-white transition-colors">{t('dashboard')}</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white text-sm font-semibold mb-3">{t('contact')}</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a
                  href="https://wa.me/994XXXXXXXXX"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors"
                >
                  {t('whatsappSupport')}
                </a>
              </li>
              <li><a href="mailto:hello@avtogo.az" className="hover:text-white transition-colors">hello@avtogo.az</a></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-10 pt-6 flex flex-col sm:flex-row justify-between items-center gap-3 text-xs">
          <p>&copy; {new Date().getFullYear()} AvtoGo. All rights reserved.</p>
          <div className="flex gap-4">
            <Link href="#" className="hover:text-white">{t('privacyPolicy')}</Link>
            <Link href="#" className="hover:text-white">{t('termsOfService')}</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
