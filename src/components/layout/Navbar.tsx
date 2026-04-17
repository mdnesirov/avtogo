'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, User, LogOut } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { useLanguage } from '@/context/LanguageContext';
import { Lang } from '@/lib/i18n/types';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [user, setUser] = useState<{ email?: string } | null>(null);
  const pathname = usePathname();
  const supabase = createClient();
  const { lang, setLang } = useLanguage();

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user);
    });
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_, session) => {
      setUser(session?.user ?? null);
    });
    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    window.location.href = '/';
  };

  const navLink = (href: string, label: string, onClick?: () => void) => {
    const active = pathname === href;
    return (
      <Link
        href={href}
        onClick={onClick}
        className={`text-sm font-medium transition-colors ${
          active ? 'text-[var(--color-text)]' : 'text-[var(--color-text-muted)] hover:text-[var(--color-text)]'
        }`}
      >
        {label}
      </Link>
    );
  };

  const languageButton = useCallback(
    (code: Lang) => (
      <button
        key={code}
        type="button"
        onClick={() => setLang(code)}
        aria-label={`Switch to ${code === 'az' ? 'Azerbaijani' : code === 'ru' ? 'Russian' : 'English'}`}
        className={`px-2.5 py-1 rounded-full text-xs font-semibold transition-colors ${
          lang === code
            ? 'bg-[var(--color-primary)] text-white'
            : 'text-[var(--color-text-muted)] hover:text-[var(--color-text)] hover:bg-black/5'
        }`}
        aria-pressed={lang === code}
      >
        {code.toUpperCase()}
      </button>
    ),
    [lang, setLang],
  );

  return (
    <nav
      className={`sticky top-0 z-50 backdrop-blur-md bg-white/80 border-b border-black/5 transition-shadow ${
        isScrolled ? 'shadow-[0_10px_30px_rgba(26,18,8,0.09)]' : ''
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2 font-semibold text-xl text-[var(--color-primary)] tracking-[0.02em]">
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none" aria-label="AvtoGo logo">
              <rect width="32" height="32" rx="8" fill="var(--color-primary)" />
              <path d="M6 20l3-7h14l3 7" stroke="white" strokeWidth="2" strokeLinecap="round" />
              <circle cx="10" cy="22" r="2" fill="white" />
              <circle cx="22" cy="22" r="2" fill="white" />
              <path d="M7 16h18" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
            <span className="font-display tracking-[0.04em]">AvtoGo</span>
          </Link>

          <div className="hidden md:flex items-center gap-7">
            {navLink('/', 'Home')}
            {navLink('/cars', 'Browse Cars')}
            {navLink('/list-car', 'List Your Car')}
            <div className="flex items-center gap-1 border border-black/10 rounded-full p-1">
              {(['az', 'ru', 'en'] as Lang[]).map(languageButton)}
            </div>
            {user ? (
              <>
                <Link
                  href="/dashboard"
                  className={`text-sm font-medium flex items-center gap-1 transition-colors ${
                    pathname === '/dashboard' ? 'text-[var(--color-text)]' : 'text-[var(--color-text-muted)] hover:text-[var(--color-text)]'
                  }`}
                >
                  <User size={16} /> Dashboard
                </Link>
                <button
                  onClick={handleSignOut}
                  className="text-[var(--color-text-muted)] hover:text-[var(--color-text)] text-sm flex items-center gap-1 transition-colors"
                >
                  <LogOut size={16} /> Sign out
                </button>
              </>
            ) : (
              <>
                <Link href="/auth/login" className="text-[var(--color-text-muted)] hover:text-[var(--color-text)] text-sm font-medium">
                  Sign in
                </Link>
                <Link
                  href="/auth/signup"
                  className="inline-flex items-center justify-center rounded-full px-5 py-2.5 text-sm font-medium bg-[var(--color-primary)] text-white shadow-[var(--shadow-sm)] hover:translate-y-[-1px]"
                >
                  Get started
                </Link>
              </>
            )}
          </div>

          <button
            className="md:hidden p-2 text-[var(--color-text-muted)]"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle menu"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {isOpen && (
          <div className="md:hidden py-4 border-t border-black/5 space-y-3">
            <Link href="/" className="block text-[var(--color-text)] py-2 text-sm font-medium" onClick={() => setIsOpen(false)}>
              Home
            </Link>
            <Link href="/cars" className="block text-[var(--color-text)] py-2 text-sm font-medium" onClick={() => setIsOpen(false)}>
              Browse Cars
            </Link>
            <Link href="/list-car" className="block text-[var(--color-text)] py-2 text-sm font-medium" onClick={() => setIsOpen(false)}>
              List Your Car
            </Link>
            <div className="flex items-center gap-1 py-2">
              {(['az', 'ru', 'en'] as Lang[]).map(languageButton)}
            </div>
            {user ? (
              <>
                <Link href="/dashboard" className="block text-[var(--color-text)] py-2 text-sm font-medium" onClick={() => setIsOpen(false)}>
                  Dashboard
                </Link>
                <button onClick={handleSignOut} className="block text-[var(--color-text-muted)] py-2 text-sm">
                  Sign out
                </button>
              </>
            ) : (
              <>
                <Link href="/auth/login" className="block text-[var(--color-text)] py-2 text-sm font-medium" onClick={() => setIsOpen(false)}>
                  Sign in
                </Link>
                <Link
                  href="/auth/signup"
                  className="block bg-[var(--color-primary)] text-white px-4 py-2.5 rounded-full text-sm font-medium text-center"
                  onClick={() => setIsOpen(false)}
                >
                  Get started
                </Link>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}
