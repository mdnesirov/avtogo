import type { Metadata } from 'next';
import './globals.css';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

export const metadata: Metadata = {
  title: 'AvtoGo — Rent or List Cars in Azerbaijan',
  description: 'The easiest way to rent a car in Azerbaijan. Browse cars from private owners and rental companies across Baku and beyond.',
  keywords: 'car rental, Azerbaijan, Baku, rent a car, peer-to-peer',
  openGraph: {
    title: 'AvtoGo — Rent Cars in Azerbaijan',
    description: 'Browse hundreds of cars from local owners and rental companies.',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Navbar />
        <main className="min-h-screen">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
