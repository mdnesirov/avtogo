import Link from 'next/link';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-gray-400 mt-auto">
      <div className="container py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-2">
            <Link href="/" className="flex items-center gap-2 text-white font-bold mb-3">
              <svg width="28" height="28" viewBox="0 0 32 32" fill="none">
                <rect width="32" height="32" rx="8" fill="#16a34a" />
                <path d="M6 20l4-8h12l4 8" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                <circle cx="10" cy="22" r="2" fill="white" />
                <circle cx="22" cy="22" r="2" fill="white" />
              </svg>
              AvtoGo
            </Link>
            <p className="text-sm leading-relaxed max-w-xs">
              Azerbaijan&apos;s peer-to-peer car rental marketplace. Rent from local owners or established companies.
            </p>
          </div>

          {/* Links */}
          <div>
            <h3 className="text-white text-sm font-semibold mb-3">Explore</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/cars" className="hover:text-white transition-colors">Browse Cars</Link></li>
              <li><Link href="/list-car" className="hover:text-white transition-colors">List Your Car</Link></li>
              <li><Link href="/dashboard" className="hover:text-white transition-colors">Dashboard</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-white text-sm font-semibold mb-3">Company</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/about" className="hover:text-white transition-colors">About</Link></li>
              <li><Link href="/contact" className="hover:text-white transition-colors">Contact</Link></li>
              <li><Link href="/terms" className="hover:text-white transition-colors">Terms</Link></li>
              <li><Link href="/privacy" className="hover:text-white transition-colors">Privacy</Link></li>
            </ul>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-gray-800 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs">
          <p>© {currentYear} AvtoGo. All rights reserved.</p>
          <p>
            Made with care for{' '}
            <span className="text-green-500">Azerbaijan 🇦🇿</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
