import { Plane } from 'lucide-react';

interface AirportToggleProps {
  enabled: boolean;
  onChange?: (val: boolean) => void;
  readOnly?: boolean;
}

export default function AirportToggle({ enabled, onChange, readOnly = false }: AirportToggleProps) {
  return (
    <div className="flex items-center gap-3">
      <Plane size={16} className="text-green-600" />
      <span className="text-sm text-gray-700">Airport delivery</span>
      {readOnly ? (
        <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
          enabled ? 'bg-green-50 text-green-700' : 'bg-gray-100 text-gray-500'
        }`}>
          {enabled ? 'Available' : 'Not available'}
        </span>
      ) : (
        <button
          type="button"
          role="switch"
          aria-checked={enabled}
          onClick={() => onChange?.(!enabled)}
          className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
            enabled ? 'bg-green-600' : 'bg-gray-200'
          }`}
        >
          <span
            className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white shadow transition-transform ${
              enabled ? 'translate-x-4' : 'translate-x-1'
            }`}
          />
        </button>
      )}
    </div>
  );
}
