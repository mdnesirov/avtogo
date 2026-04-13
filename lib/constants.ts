export const AZERBAIJAN_CITIES = [
  'Baku',
  'Ganja',
  'Sumqayit',
  'Mingachevir',
  'Gabala',
  'Shaki',
  'Lankaran',
  'Nakhchivan',
  'Shamakhi',
]

export const CAR_TYPES = [
  { value: 'sedan',      label: 'Sedan' },
  { value: 'suv',        label: 'SUV' },
  { value: 'hatchback',  label: 'Hatchback' },
  { value: 'coupe',      label: 'Coupe' },
  { value: 'minivan',    label: 'Minivan' },
  { value: 'pickup',     label: 'Pickup' },
  { value: 'convertible',label: 'Convertible' },
]

export const TRANSMISSIONS = [
  { value: 'automatic', label: 'Automatic' },
  { value: 'manual',    label: 'Manual' },
]

export const FUEL_TYPES = [
  { value: 'petrol',   label: 'Petrol' },
  { value: 'diesel',   label: 'Diesel' },
  { value: 'electric', label: 'Electric' },
  { value: 'hybrid',   label: 'Hybrid' },
]

export const BOOKING_STATUSES = {
  pending:   { label: 'Pending',   color: 'yellow' },
  confirmed: { label: 'Confirmed', color: 'green'  },
  cancelled: { label: 'Cancelled', color: 'red'    },
  completed: { label: 'Completed', color: 'gray'   },
} as const

export const PRICE_RANGE = { min: 20, max: 500 }
