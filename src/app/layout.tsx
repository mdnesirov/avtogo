import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    default: 'AvtoGo — Car Rentals in Azerbaijan',
    template: '%s | AvtoGo',
  },
  description:
    'Rent cars from local owners and rental companies across Azerbaijan. Best prices in Baku, Ganja, Sumqayit and beyond.',
  keywords: ['car rental', 'azerbaijan', 'baku', 'avtogo', 'rent a car'],
  openGraph: {
    title: 'AvtoGo — Car Rentals in Azerbaijan',
    description: 'The easiest way to rent a car in Azerbaijan.',
    type: 'website',
    locale: 'en_US',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.variable}>
      <body>
        <Navbar />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
