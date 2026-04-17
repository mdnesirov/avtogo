'use client';

import { Plane } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { translations } from '@/lib/i18n/translations';

interface AirportToggleProps {
  enabled: boolean;
  onChange?: (val: boolean) => void;
  readOnly?: boolean;
}

export default function AirportToggle({ enabled, onChange, readOnly = false }: AirportToggleProps) {
  const { lang } = useLanguage();
  const tx = translations[lang];

  return (
    <div className="flex items-center gap-3">
      <div className="flex items-center gap-2">
        <Plane size={16} className={enabled ? 'text-green-600' : 'text-gray-400'} />
        <span className="text-sm text-gray-700">{tx.airportDelivery}</span>
      </div>
      {readOnly ? (
        <span className={`text-sm font-medium ${enabled ? 'text-green-600' : 'text-gray-400'}`}>
          {enabled ? tx.available : tx.notAvailable}
        </span>
      ) : (
        <button
          type="button"
          role="switch"
          aria-checked={enabled}
          onClick={() => onChange?.(!enabled)}
          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-green-600 ${
            enabled ? 'bg-green-600' : 'bg-gray-200'
          }`}
        >
          <span
            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
              enabled ? 'translate-x-6' : 'translate-x-1'
            }`}
          />
        </button>
      )}
    </div>
  );
}
