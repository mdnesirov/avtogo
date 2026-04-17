'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, User, LogOut } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { useLanguage } from '@/context/LanguageContext';
import { Lang } from '@/lib/i18n/types';
import { translations } from '@/lib/i18n/translations';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState<{ email?: string } | null>(null);
  const pathname = usePathname();
  const supabase = createClient();
  const { lang, setLang } = useLanguage();
  const tx = translations[lang];

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data.user));
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_, session) => {
      setUser(session?.user ?? null);
    });
    return () => subscription.unsubscribe();
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    window.location.href = '/';
  };

  const langBtn = useCallback((code: Lang) => (
    <button
      key={code}
      type="button"
      onClick={() => setLang(code)}
      aria-label={`Switch to ${code.toUpperCase()}`}
      aria-pressed={lang === code}
      className={`w-9 h-7 rounded text-xs font-semibold transition-colors ${
        lang === code ? 'bg-green-600 text-white' : 'text-gray-500 hover:text-gray-800 hover:bg-gray-100'
      }`}
    >
      {code.toUpperCase()}
    </button>
  ), [lang, setLang]);

  return (
    <nav className="bg-white border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center h-16 gap-6">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 font-bold text-xl text-gray-900 shrink-0">
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none" aria-label="AvtoGo logo">
              <rect width="32" height="32" rx="8" fill="#16a34a" />
              <path d="M6 20l3-7h14l3 7" stroke="white" strokeWidth="2" strokeLinecap="round" />
              <circle cx="10" cy="22" r="2" fill="white" />
              <circle cx="22" cy="22" r="2" fill="white" />
              <path d="M7 16h18" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
            <span>AvtoGo</span>
          </Link>

          {/* Desktop nav — pushed right, all items nowrap */}
          <div className="hidden md:flex items-center gap-5 ml-auto shrink-0">
            <Link href="/" className={`text-sm font-medium whitespace-nowrap transition-colors ${ pathname === '/' ? 'text-green-600' : 'text-gray-600 hover:text-gray-900' }`}>{tx.navbarHome}</Link>
            <Link href="/cars" className={`text-sm font-medium whitespace-nowrap transition-colors ${ pathname === '/cars' ? 'text-green-600' : 'text-gray-600 hover:text-gray-900' }`}>{tx.navbarBrowseCars}</Link>
            <Link href="/list-car" className={`text-sm font-medium whitespace-nowrap transition-colors ${ pathname === '/list-car' ? 'text-green-600' : 'text-gray-600 hover:text-gray-900' }`}>{tx.navbarListYourCar}</Link>

            {/* Language switcher */}
            <div className="flex items-center gap-1 border border-gray-200 rounded-lg p-1 shrink-0">
              {(['az', 'ru', 'en'] as Lang[]).map(langBtn)}
            </div>

            {user ? (
              <>
                <Link href="/dashboard" className={`text-sm font-medium flex items-center gap-1 whitespace-nowrap transition-colors ${ pathname === '/dashboard' ? 'text-green-600' : 'text-gray-600 hover:text-gray-900' }`}>
                  <User size={16} /> {tx.navbarDashboard}
                </Link>
                <button onClick={handleSignOut} className="text-gray-500 hover:text-gray-900 text-sm flex items-center gap-1 whitespace-nowrap transition-colors">
                  <LogOut size={16} /> {tx.navbarSignOut}
                </button>
              </>
            ) : (
              <>
                <Link href="/auth/login" className="text-sm font-medium whitespace-nowrap text-gray-600 hover:text-gray-900">{tx.signInTitle}</Link>
                <Link href="/auth/signup" className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap hover:bg-green-700 transition-colors shrink-0">{tx.navbarGetStarted}</Link>
              </>
            )}
          </div>

          {/* Mobile hamburger */}
          <button className="md:hidden p-2 text-gray-600 ml-auto" onClick={() => setIsOpen(!isOpen)} aria-label="Toggle menu">
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile menu */}
        {isOpen && (
          <div className="md:hidden py-4 border-t border-gray-100 space-y-3">
            <Link href="/" className="block text-gray-700 py-2 text-sm font-medium" onClick={() => setIsOpen(false)}>{tx.navbarHome}</Link>
            <Link href="/cars" className="block text-gray-700 py-2 text-sm font-medium" onClick={() => setIsOpen(false)}>{tx.navbarBrowseCars}</Link>
            <Link href="/list-car" className="block text-gray-700 py-2 text-sm font-medium" onClick={() => setIsOpen(false)}>{tx.navbarListYourCar}</Link>
            <div className="flex items-center gap-1 py-2">
              {(['az', 'ru', 'en'] as Lang[]).map(langBtn)}
            </div>
            {user ? (
              <>
                <Link href="/dashboard" className="block text-gray-700 py-2 text-sm font-medium" onClick={() => setIsOpen(false)}>{tx.navbarDashboard}</Link>
                <button onClick={handleSignOut} className="block text-gray-500 py-2 text-sm">{tx.navbarSignOut}</button>
              </>
            ) : (
              <>
                <Link href="/auth/login" className="block text-gray-700 py-2 text-sm font-medium" onClick={() => setIsOpen(false)}>{tx.signInTitle}</Link>
                <Link href="/auth/signup" className="block bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium text-center" onClick={() => setIsOpen(false)}>{tx.navbarGetStarted}</Link>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}
