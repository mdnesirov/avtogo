import type { Metadata } from 'next';
import { Plus_Jakarta_Sans, Bricolage_Grotesque } from 'next/font/google';
import './globals.css';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { LanguageProvider } from '@/context/LanguageContext';

const jakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-body',
  display: 'swap',
});

const bricolage = Bricolage_Grotesque({
  subsets: ['latin'],
  variable: '--font-display',
  display: 'swap',
});

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
    <html lang="en" className={`${jakarta.variable} ${bricolage.variable}`}>
      <body>
        <LanguageProvider>
          <Navbar />
          <main className="min-h-screen">{children}</main>
          <Footer />
        </LanguageProvider>
      </body>
    </html>
  );
}
