'use client';
import Link from 'next/link';
import { useState } from 'react';
import { Menu, X, Car } from 'lucide-react';

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-100">
      <nav className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 font-bold text-xl text-gray-900">
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none" aria-label="AvtoGo logo">
              <rect width="32" height="32" rx="8" fill="#16a34a" />
              <path d="M6 20l3-8h14l3 8" stroke="#fff" strokeWidth="2" strokeLinecap="round" />
              <circle cx="10" cy="21" r="2.5" fill="#fff" />
              <circle cx="22" cy="21" r="2.5" fill="#fff" />
              <path d="M8 16h16" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
            AvtoGo
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-1">
            <Link href="/cars" className="btn-ghost">Browse Cars</Link>
            <Link href="/list-car" className="btn-ghost">List Your Car</Link>
            <Link href="/dashboard" className="btn-ghost">Dashboard</Link>
            <Link href="/list-car" className="btn-primary ml-2">Get Started</Link>
          </div>

          {/* Mobile hamburger */}
          <button
            className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
            onClick={() => setOpen(!open)}
            aria-label="Toggle menu"
          >
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {/* Mobile menu */}
        {open && (
          <div className="md:hidden py-3 pb-4 border-t border-gray-100 flex flex-col gap-1">
            <Link href="/cars" className="btn-ghost" onClick={() => setOpen(false)}>Browse Cars</Link>
            <Link href="/list-car" className="btn-ghost" onClick={() => setOpen(false)}>List Your Car</Link>
            <Link href="/dashboard" className="btn-ghost" onClick={() => setOpen(false)}>Dashboard</Link>
            <Link href="/list-car" className="btn-primary mt-2" onClick={() => setOpen(false)}>Get Started</Link>
          </div>
        )}
      </nav>
    </header>
  );
}
