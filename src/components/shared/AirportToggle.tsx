'use client';

interface AirportToggleProps {
  checked: boolean;
  onChange?: (checked: boolean) => void;
  readOnly?: boolean;
}

export function AirportToggle({ checked, onChange, readOnly = false }: AirportToggleProps) {
  return (
    <div className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 border border-gray-200">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-gray-500 shrink-0">
        <path d="M12 22V12M12 12L3 7l9-5 9 5-9 5zM3 17l9 5 9-5" />
      </svg>
      <div className="flex-1">
        <p className="text-sm font-medium text-gray-800">Airport Delivery</p>
        <p className="text-xs text-gray-500">Car delivered to Heydar Aliyev International Airport</p>
      </div>
      {readOnly ? (
        <span className={`text-xs font-medium px-2 py-1 rounded-full ${checked ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
          {checked ? 'Available' : 'Unavailable'}
        </span>
      ) : (
        <button
          type="button"
          role="switch"
          aria-checked={checked}
          onClick={() => onChange?.(!checked)}
          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-500 focus-visible:ring-offset-2 ${
            checked ? 'bg-green-600' : 'bg-gray-300'
          }`}
        >
          <span
            className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${
              checked ? 'translate-x-6' : 'translate-x-1'
            }`}
          />
        </button>
      )}
    </div>
  );
}

export default AirportToggle;
