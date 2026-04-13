import Link from 'next/link'

const footerLinks = {
  Company: [
    { href: '/about', label: 'About' },
    { href: '/contact', label: 'Contact' },
  ],
  Renters: [
    { href: '/cars', label: 'Browse Cars' },
    { href: '/faq', label: 'FAQ' },
  ],
  Owners: [
    { href: '/list-car', label: 'List Your Car' },
    { href: '/dashboard', label: 'Dashboard' },
  ],
}

export default function Footer() {
  return (
    <footer className="bg-gray-950 text-gray-300">
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="flex items-center gap-2 font-bold text-white text-lg mb-3">
              <svg width="24" height="24" viewBox="0 0 28 28" fill="none" aria-label="AvtoGo">
                <rect width="28" height="28" rx="6" fill="#16a34a" />
                <path d="M6 18l3-7h10l3 7" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                <circle cx="9.5" cy="18.5" r="1.5" fill="white" />
                <circle cx="18.5" cy="18.5" r="1.5" fill="white" />
                <path d="M6 18h16" stroke="white" strokeWidth="1.8" strokeLinecap="round" />
              </svg>
              AvtoGo
            </Link>
            <p className="text-sm text-gray-400 max-w-xs leading-relaxed">
              Azerbaijan&apos;s peer-to-peer car rental marketplace. Rent local, drive anywhere.
            </p>
          </div>
          {Object.entries(footerLinks).map(([group, links]) => (
            <div key={group}>
              <h3 className="text-sm font-semibold text-white mb-3">{group}</h3>
              <ul className="flex flex-col gap-2">
                {links.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className="text-sm text-gray-400 hover:text-white transition-colors">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-10 pt-6 border-t border-white/10 flex flex-col sm:flex-row justify-between items-center gap-3 text-xs text-gray-500">
          <p>© {new Date().getFullYear()} AvtoGo. All rights reserved.</p>
          <div className="flex gap-4">
            <Link href="/privacy" className="hover:text-gray-300 transition-colors">Privacy</Link>
            <Link href="/terms" className="hover:text-gray-300 transition-colors">Terms</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
