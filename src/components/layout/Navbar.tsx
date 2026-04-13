'use client'

import Link from 'next/link'
import { useState } from 'react'
import { Menu, X } from 'lucide-react'
import Button from '@/components/shared/Button'

const navLinks = [
  { href: '/cars', label: 'Browse Cars' },
  { href: '/list-car', label: 'List Your Car' },
]

export default function Navbar() {
  const [open, setOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-black/8 shadow-sm">
      <nav className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 font-bold text-lg text-gray-900 hover:text-green-600 transition-colors">
          <svg width="28" height="28" viewBox="0 0 28 28" fill="none" aria-label="AvtoGo logo">
            <rect width="28" height="28" rx="6" fill="#16a34a" />
            <path d="M6 18l3-7h10l3 7" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            <circle cx="9.5" cy="18.5" r="1.5" fill="white" />
            <circle cx="18.5" cy="18.5" r="1.5" fill="white" />
            <path d="M6 18h16" stroke="white" strokeWidth="1.8" strokeLinecap="round" />
          </svg>
          AvtoGo
        </Link>

        <div className="hidden md:flex items-center gap-6">
          {navLinks.map((link) => (
            <Link key={link.href} href={link.href} className="text-sm font-medium text-gray-600 hover:text-green-600 transition-colors">
              {link.label}
            </Link>
          ))}
        </div>

        <div className="hidden md:flex items-center gap-3">
          <Link href="/auth/login" className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">
            Sign in
          </Link>
          <Button href="/auth/signup" size="sm">Sign up</Button>
        </div>

        <button
          className="md:hidden p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors"
          onClick={() => setOpen(!open)}
          aria-label={open ? 'Close menu' : 'Open menu'}
        >
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </nav>

      {open && (
        <div className="md:hidden border-t border-black/8 bg-white px-4 py-4 flex flex-col gap-4">
          {navLinks.map((link) => (
            <Link key={link.href} href={link.href}
              className="text-sm font-medium text-gray-700 hover:text-green-600 py-2 transition-colors"
              onClick={() => setOpen(false)}>
              {link.label}
            </Link>
          ))}
          <div className="flex flex-col gap-2 pt-2 border-t border-black/8">
            <Link href="/auth/login" className="text-sm font-medium text-gray-600 py-2 hover:text-gray-900" onClick={() => setOpen(false)}>
              Sign in
            </Link>
            <Button href="/auth/signup" size="sm" className="w-full justify-center">Sign up</Button>
          </div>
        </div>
      )}
    </header>
  )
}
