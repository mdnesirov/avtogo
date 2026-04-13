import type { Metadata } from 'next'
import './globals.css'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'

export const metadata: Metadata = {
  title: {
    default: 'AvtoGo — Car Rental in Azerbaijan',
    template: '%s | AvtoGo',
  },
  description:
    'Rent cars from local owners and rental companies across Azerbaijan. Best prices in Baku, Ganja, Quba and more.',
  keywords: ['car rental', 'Azerbaijan', 'Baku', 'arenda', 'avtomobil'],
  openGraph: {
    title: 'AvtoGo — Car Rental in Azerbaijan',
    description: 'Peer-to-peer car rental marketplace for Azerbaijan.',
    url: 'https://avtogo.az',
    siteName: 'AvtoGo',
    locale: 'en_US',
    type: 'website',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  )
}
