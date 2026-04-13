import { notFound } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { Car } from '@/types';
import { CarImageGallery } from '@/components/cars/CarImageGallery';
import { CarSpecs } from '@/components/cars/CarSpecs';
import { RatingStars } from '@/components/shared/RatingStars';
import { WhatsAppButton } from '@/components/shared/WhatsAppButton';
import { AirportToggle } from '@/components/shared/AirportToggle';
import { MapEmbed } from '@/components/shared/MapEmbed';
import { formatPrice } from '@/lib/utils';
import BookingWidget from '@/components/booking/BookingWidget';

interface Props {
  params: Promise<{ id: string }>;
}

export default async function CarDetailPage({ params }: Props) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: car, error } = await supabase
    .from('cars')
    .select('*, owner:profiles(id, full_name, whatsapp, avatar_url)')
    .eq('id', id)
    .single();

  if (error || !car) notFound();

  const typedCar = car as Car & { owner: { id: string; full_name: string; whatsapp: string | null } };

  return (
    <div className="pt-16 min-h-screen">
      <div className="container py-10">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-gray-500 mb-6" aria-label="Breadcrumb">
          <Link href="/cars" className="hover:text-gray-700">Cars</Link>
          <span aria-hidden>/</span>
          <span className="text-gray-900">{typedCar.brand} {typedCar.model}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-10">
          {/* Left column */}
          <div className="space-y-8">
            <CarImageGallery images={typedCar.images} carName={`${typedCar.brand} ${typedCar.model}`} />

            <div>
              <div className="flex items-start justify-between gap-4 mb-2">
                <h1 className="text-2xl font-bold text-gray-900">
                  {typedCar.brand} {typedCar.model} {typedCar.year}
                </h1>
                <div className="text-right shrink-0">
                  <p className="text-2xl font-bold text-green-600">{formatPrice(typedCar.price_per_day)}</p>
                  <p className="text-sm text-gray-500">per day</p>
                </div>
              </div>

              <div className="flex items-center gap-3 mb-4">
                <RatingStars rating={typedCar.rating} totalReviews={typedCar.total_reviews} size="md" />
                <span className="text-sm text-gray-400">&bull;</span>
                <span className="text-sm text-gray-500">{typedCar.location}</span>
              </div>

              {typedCar.description && (
                <p className="text-gray-600 leading-relaxed">{typedCar.description}</p>
              )}
            </div>

            <CarSpecs car={typedCar} />

            <AirportToggle checked={typedCar.airport_delivery} readOnly />

            {/* Map */}
            <div>
              <h2 className="font-semibold text-gray-900 mb-3">Location</h2>
              <MapEmbed location={typedCar.location} lat={typedCar.latitude} lng={typedCar.longitude} height={300} />
            </div>

            {/* Owner */}
            <div className="flex items-center justify-between p-4 rounded-2xl border border-gray-200 bg-gray-50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-700 font-bold">
                  {typedCar.owner?.full_name?.[0]?.toUpperCase() ?? 'O'}
                </div>
                <div>
                  <p className="font-medium text-gray-900">{typedCar.owner?.full_name ?? 'Owner'}</p>
                  <p className="text-xs text-gray-500">Car owner</p>
                </div>
              </div>
              {typedCar.owner?.whatsapp && (
                <WhatsAppButton
                  phone={typedCar.owner.whatsapp}
                  message={`Hi! I'm interested in renting your ${typedCar.brand} ${typedCar.model} on AvtoGo.`}
                />
              )}
            </div>
          </div>

          {/* Right column — Booking widget */}
          <div className="lg:sticky lg:top-24 h-fit">
            <BookingWidget car={typedCar} />
          </div>
        </div>
      </div>
    </div>
  );
}
