import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-[var(--color-primary)] text-white/75 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-14">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          <div className="md:col-span-2">
            <p className="font-display text-4xl text-[var(--color-accent)] mb-4">AvtoGo</p>
            <p className="text-sm leading-relaxed max-w-md text-white/70">
              Azerbaijan&apos;s premium car rental marketplace. Rent exceptional cars from trusted owners or list your vehicle to earn with confidence.
            </p>
            <p className="text-sm mt-4 text-white/75">Made in Azerbaijan 🇦🇿</p>
          </div>

          <div>
            <h4 className="text-white text-sm font-semibold mb-3 uppercase tracking-[0.14em]">Platform</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/cars" className="hover:text-[var(--color-accent)] transition-colors">
                  Browse Cars
                </Link>
              </li>
              <li>
                <Link href="/list-car" className="hover:text-[var(--color-accent)] transition-colors">
                  List Your Car
                </Link>
              </li>
              <li>
                <Link href="/dashboard" className="hover:text-[var(--color-accent)] transition-colors">
                  Dashboard
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-white text-sm font-semibold mb-3 uppercase tracking-[0.14em]">Contact</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a
                  href="https://wa.me/994XXXXXXXXX"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-[var(--color-accent)] transition-colors"
                >
                  WhatsApp Support
                </a>
              </li>
              <li>
                <a href="mailto:hello@avtogo.az" className="hover:text-[var(--color-accent)] transition-colors">
                  hello@avtogo.az
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-[rgba(200,169,110,0.45)] mt-12 pt-6 flex flex-col sm:flex-row justify-between items-center gap-3 text-xs text-white/70">
          <p>&copy; {new Date().getFullYear()} AvtoGo. All rights reserved.</p>
          <div className="flex gap-4">
            <Link href="#" className="hover:text-[var(--color-accent)]">
              Privacy Policy
            </Link>
            <Link href="#" className="hover:text-[var(--color-accent)]">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
