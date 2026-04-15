import { createClient } from '@/lib/supabase/server';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import { MapPin, Calendar, Fuel, Settings, User } from 'lucide-react';
import { formatPrice, formatDate } from '@/lib/utils';
import RatingStars from '@/components/shared/RatingStars';
import WhatsAppButton from '@/components/shared/WhatsAppButton';
import AirportToggle from '@/components/shared/AirportToggle';
import MapEmbed from '@/components/shared/MapEmbed';
import BookingFormClient from '@/components/booking/BookingForm';
import {getTranslations} from 'next-intl/server';

export default async function CarDetailPage({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const { id, locale } = await params;
  const t = await getTranslations({locale, namespace: 'carDetail'});
  const supabase = await createClient();

  const { data: car } = await supabase
    .from('cars')
    .select('*, owner:profiles(*)')
    .eq('id', id)
    .single();

  if (!car) notFound();

  const images = car.images?.length ? car.images : [
    'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=800&q=80',
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">
        {/* Left: Car info */}
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
                  <Image src={img} alt={t('photoAlt', {index: i + 2})} fill className="object-cover" />
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
              <span className="text-sm text-gray-500 flex items-center gap-1"><MapPin size={13} /> {car.location}, {t('country')}</span>
            </div>
          </div>

          {/* Specs */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
               { icon: Calendar, label: t('year'), value: car.year },
               { icon: Settings, label: t('transmission'), value: car.transmission === 'automatic' ? t('automatic') : t('manual') },
               { icon: Fuel, label: t('fuel'), value: t(`fuelTypes.${car.fuel_type}`) },
               { icon: User, label: t('ownerType'), value: t('private') },
            ].map(({ icon: Icon, label, value }) => (
              <div key={label} className="bg-gray-50 rounded-xl p-3 text-center">
                <Icon size={18} className="text-green-600 mx-auto mb-1" />
                <p className="text-xs text-gray-400">{label}</p>
                <p className="text-sm font-medium text-gray-900">{value}</p>
              </div>
            ))}
          </div>

          {/* Airport delivery */}
          <AirportToggle enabled={car.airport_delivery} readOnly />

          {/* Description */}
          {car.description && (
            <div>
              <h2 className="font-semibold text-gray-900 mb-2">{t('aboutThisCar')}</h2>
              <p className="text-gray-600 text-sm leading-relaxed">{car.description}</p>
            </div>
          )}

          {/* Map */}
          <div>
            <h2 className="font-semibold text-gray-900 mb-3">{t('location')}</h2>
            <MapEmbed location={car.location} />
          </div>
        </div>

        {/* Right: Booking card */}
        <div className="lg:col-span-2">
          <div className="sticky top-24 bg-white border border-gray-100 rounded-2xl p-6 shadow-sm space-y-5">
            <div className="flex items-baseline justify-between">
              <span className="text-3xl font-bold text-gray-900">{formatPrice(car.price_per_day)}</span>
              <span className="text-sm text-gray-400">{t('perDay')}</span>
            </div>

            <BookingFormClient car={car} />

            <div className="border-t border-gray-100 pt-4">
              {car.owner?.whatsapp && (
                <WhatsAppButton
                  phone={car.owner.whatsapp}
                  message={t('whatsappMessageWithCar', {brand: car.brand, model: car.model})}
                />
              )}
            </div>

            <p className="text-xs text-gray-400 text-center">{t('youWontBeChargedYet')}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
