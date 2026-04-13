import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-400 mt-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 font-bold text-xl text-white mb-3">
              <svg width="28" height="28" viewBox="0 0 32 32" fill="none">
                <rect width="32" height="32" rx="8" fill="#16a34a" />
                <path d="M6 20l3-8h14l3 8" stroke="#fff" strokeWidth="2" strokeLinecap="round" />
                <circle cx="10" cy="21" r="2.5" fill="#fff" />
                <circle cx="22" cy="21" r="2.5" fill="#fff" />
                <path d="M8 16h16" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
              AvtoGo
            </div>
            <p className="text-sm leading-relaxed max-w-xs">
              Azerbaijan&apos;s first peer-to-peer car rental marketplace. Rent from locals, explore freely.
            </p>
          </div>

          {/* Links */}
          <div>
            <h3 className="text-white font-medium mb-3 text-sm">Explore</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/cars" className="hover:text-white transition-colors">Browse Cars</Link></li>
              <li><Link href="/list-car" className="hover:text-white transition-colors">List Your Car</Link></li>
              <li><Link href="/dashboard" className="hover:text-white transition-colors">Dashboard</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-medium mb-3 text-sm">Support</h3>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="hover:text-white transition-colors">Help Center</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Safety</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4 text-sm">
          <p>&copy; {new Date().getFullYear()} AvtoGo. All rights reserved.</p>
          <p>Made with ♥ in Baku, Azerbaijan</p>
        </div>
      </div>
    </footer>
  );
}
