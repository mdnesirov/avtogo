'use client';

import Image from 'next/image';
import { MapPin, Calendar, Fuel, Settings, User, ShieldAlert } from 'lucide-react';
import { formatPrice } from '@/lib/utils';
import RatingStars from '@/components/shared/RatingStars';
import WhatsAppButton from '@/components/shared/WhatsAppButton';
import AirportToggle from '@/components/shared/AirportToggle';
import MapEmbed from '@/components/shared/MapEmbed';
import BookingFormClient from '@/components/booking/BookingForm';
import { useLanguage } from '@/context/LanguageContext';
import { translations } from '@/lib/i18n/translations';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function CarDetailContent({ car }: { car: any }) {
  const { lang } = useLanguage();
  const tx = translations[lang];

  if (!car) {
    return (
      <div className="max-w-xl mx-auto px-4 py-24 text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">{tx.carDetailNotFound}</h1>
        <p className="text-gray-500">{tx.carDetailUnavailable}</p>
      </div>
    );
  }

  const images = car.images?.length ? car.images : [
    'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=800&q=80',
  ];

  const hasDeposit = car.requires_deposit && car.deposit_amount && car.deposit_amount > 0;
  const transmissionLabel = car.transmission === 'automatic' ? tx.carDetailAutomatic : tx.carDetailManual;
  const fuelLabel = car.fuel_type ? car.fuel_type.charAt(0).toUpperCase() + car.fuel_type.slice(1) : '';

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">
        {/* Left */}
        <div className="lg:col-span-3 space-y-6">
          {/* Image gallery */}
          <div className="rounded-2xl overflow-hidden bg-gray-100 aspect-video relative">
            <Image
              src={images[0]}
              alt={`${car.brand} ${car.model}`}
              fill
              className="object-cover"
              priority
            />
          </div>
          {images.length > 1 && (
            <div className="grid grid-cols-4 gap-2">
              {images.slice(1, 5).map((img: string, i: number) => (
                <div key={i} className="rounded-xl overflow-hidden aspect-square relative bg-gray-100">
                  <Image src={img} alt={`Photo ${i + 2}`} fill className="object-cover" />
                </div>
              ))}
            </div>
          )}

          {/* Title & rating */}
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{car.brand} {car.model} {car.year}</h1>
            <div className="flex items-center gap-3 mt-2">
              <RatingStars rating={car.rating} totalReviews={car.total_reviews} />
              <span className="text-gray-300">|</span>
              <span className="text-sm text-gray-500 flex items-center gap-1"><MapPin size={13} /> {car.location}, {tx.azerbaijanCountry}</span>
            </div>
          </div>

          {/* Specs */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
               { icon: Calendar, label: tx.carDetailYear, value: car.year },
               { icon: Settings, label: tx.carDetailTransmission, value: transmissionLabel },
               { icon: Fuel, label: tx.carDetailFuel, value: fuelLabel },
               { icon: User, label: tx.carDetailOwnerType, value: tx.carDetailOwnerPrivate },
            ].map(({ icon: Icon, label, value }) => (
              <div key={label} className="bg-gray-50 rounded-xl p-3 text-center">
                <Icon size={18} className="text-green-600 mx-auto mb-1" />
                <p className="text-xs text-gray-400">{label}</p>
                <p className="text-sm font-medium text-gray-900">{value}</p>
              </div>
            ))}
          </div>

          {/* Airport delivery */}
          <AirportToggle enabled={car.airport_delivery || car.offers_airport_delivery} readOnly />

          {/* Description */}
          {car.description && (
            <div>
              <h2 className="font-semibold text-gray-900 mb-2">{tx.carDetailTitle}</h2>
              <p className="text-gray-600 text-sm leading-relaxed">{car.description}</p>
            </div>
          )}

          {/* Deposit */}
          {hasDeposit && (
            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5">
              <div className="flex items-start gap-3">
                <ShieldAlert size={20} className="text-amber-500 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-semibold text-amber-900 text-sm">{tx.carDetailDepositRequired}</p>
                  <p className="text-2xl font-bold text-amber-800 mt-1">{formatPrice(car.deposit_amount)}</p>
                  <p className="text-xs text-amber-700 mt-2 leading-relaxed">{tx.carDetailDepositNote}</p>
                </div>
              </div>
            </div>
          )}

          {/* Map */}
          <div>
            <h2 className="font-semibold text-gray-900 mb-3">{tx.carDetailLocation}</h2>
            <MapEmbed location={car.location} />
          </div>
        </div>

        {/* Right: Booking card */}
        <div className="lg:col-span-2">
          <div className="sticky top-24 bg-white border border-gray-100 rounded-2xl p-6 shadow-sm space-y-5">
            <div className="flex items-baseline justify-between">
              <span className="text-3xl font-bold text-gray-900">{formatPrice(car.price_per_day)}</span>
               <span className="text-sm text-gray-400">{tx.carDetailPerDay}</span>
            </div>

            {hasDeposit && (
              <div className="flex items-center gap-2 bg-amber-50 border border-amber-200 rounded-xl px-3 py-2">
                <ShieldAlert size={14} className="text-amber-500" />
                 <span className="text-xs text-amber-800 font-medium">{formatPrice(car.deposit_amount)} {tx.carDetailDepositBadge}</span>
              </div>
            )}

            <BookingFormClient car={car} />

            <div className="border-t border-gray-100 pt-4">
              {car.owner?.whatsapp && (
                <WhatsAppButton
                  phone={car.owner.whatsapp}
                  message={tx.whatsappCarInterestMessage.replace('{brand}', car.brand ?? '').replace('{model}', car.model ?? '').trim()}
                />
              )}
            </div>

            <p className="text-xs text-gray-400 text-center">{tx.carDetailNotCharged}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
