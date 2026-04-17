'use client';

import { getMapEmbedUrl, getMapsLink } from '@/lib/maps';
import { useLanguage } from '@/context/LanguageContext';
import { translations } from '@/lib/i18n/translations';

interface MapEmbedProps {
  location: string;
}

export default function MapEmbed({ location }: MapEmbedProps) {
  const { lang } = useLanguage();
  const tx = translations[lang];
  const embedUrl = getMapEmbedUrl(location);
  const mapsLink = getMapsLink(location);

  return (
    <div className="rounded-xl overflow-hidden border border-gray-100">
      <iframe
        src={embedUrl}
        width="100%"
        height="240"
        style={{ border: 0 }}
        allowFullScreen
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        title={`${tx.mapOf} ${location}`}
      />
      <div className="p-3 bg-gray-50 flex items-center justify-between">
        <span className="text-sm text-gray-600">{location}, {tx.azerbaijanCountry}</span>
        <a
          href={mapsLink}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm text-green-600 hover:text-green-700 font-medium"
        >
          {tx.openInMaps}
        </a>
      </div>
    </div>
  );
}
