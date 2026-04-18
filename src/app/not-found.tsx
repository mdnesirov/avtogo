import Link from 'next/link';
import { Home, Car } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#faf9f6] flex items-center justify-center px-4">
      <div className="text-center max-w-sm">

        {/* Illustration */}
        <div className="mb-8">
          <div className="w-24 h-24 rounded-3xl bg-white border border-black/[0.06] shadow-sm flex items-center justify-center mx-auto mb-2">
            <svg width="56" height="56" viewBox="0 0 80 80" fill="none" aria-hidden="true">
              <path d="M20 52l8-18h24l8 18" stroke="#166534" strokeWidth="3" strokeLinecap="round" />
              <circle cx="28" cy="55" r="4" fill="#166534" />
              <circle cx="52" cy="55" r="4" fill="#166534" />
              <path d="M33 36h-4M43 36h4" stroke="#86efac" strokeWidth="2" strokeLinecap="round" />
              <circle cx="60" cy="22" r="3" fill="#fca5a5" />
              <path d="M57 19l6 6M63 19l-6 6" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </div>
        </div>

        <p className="text-xs font-bold tracking-widest text-green-700 uppercase mb-2">404</p>
        <h1 className="text-2xl font-bold text-gray-900 mb-2" style={{fontFamily: 'var(--font-display)'}}>Page not found</h1>
        <p className="text-gray-500 text-sm mb-8 leading-relaxed">
          The page you&apos;re looking for doesn&apos;t exist or has been moved. Let&apos;s get you back on the road.
        </p>

        <div className="flex items-center justify-center gap-3">
          <Link
            href="/"
            className="inline-flex items-center gap-2 bg-green-700 hover:bg-green-800 text-white px-5 py-2.5 rounded-xl text-sm font-semibold transition-all shadow-sm hover:shadow-md"
          >
            <Home size={14} /> Go home
          </Link>
          <Link
            href="/cars"
            className="inline-flex items-center gap-2 border border-gray-200 bg-white hover:bg-gray-50 text-gray-700 px-5 py-2.5 rounded-xl text-sm font-semibold transition-colors shadow-sm"
          >
            <Car size={14} /> Browse cars
          </Link>
        </div>
      </div>
    </div>
  );
}
