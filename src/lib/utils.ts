import { type ClassValue, clsx } from 'clsx';

// FIX: Simple className merger using clsx
export function cn(...inputs: ClassValue[]) {
  return inputs
    .flat()
    .filter(Boolean)
    .join(' ');
}

/**
 * Format price in AZN (Azerbaijani Manat)
 */
export function formatPrice(amount: number): string {
  return new Intl.NumberFormat('az-AZ', {
    style: 'currency',
    currency: 'AZN',
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount);
}

/**
 * Format a date string to readable format
 */
export function formatDate(dateStr: string): string {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(new Date(dateStr));
}

/**
 * Calculate number of days between two dates
 */
export function calculateDays(startDate: string, endDate: string): number {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const diffMs = end.getTime() - start.getTime();
  return Math.ceil(diffMs / (1000 * 60 * 60 * 24));
}

/**
 * FIX: Added differenceInCalendarDays — imported by BookingSummary.tsx.
 * Was missing; only calculateDays existed (different name).
 * Returns the number of calendar days between dateLeft and dateRight.
 */
export function differenceInCalendarDays(dateLeft: Date, dateRight: Date): number {
  const msPerDay = 1000 * 60 * 60 * 24;
  const utcLeft = Date.UTC(dateLeft.getFullYear(), dateLeft.getMonth(), dateLeft.getDate());
  const utcRight = Date.UTC(dateRight.getFullYear(), dateRight.getMonth(), dateRight.getDate());
  return Math.round((utcLeft - utcRight) / msPerDay);
}

/**
 * Calculate total rental price
 */
export function calculateTotalPrice(pricePerDay: number, startDate: string, endDate: string): number {
  const days = calculateDays(startDate, endDate);
  return pricePerDay * days;
}

/**
 * FIX: Alias for calculateTotalPrice — imported by BookingWidget.tsx.
 * Was missing; only calculateTotalPrice existed (different name).
 */
export function calcTotalPrice(pricePerDay: number, startDate: string, endDate: string): number {
  return calculateTotalPrice(pricePerDay, startDate, endDate);
}

/**
 * FIX: Returns today's date as YYYY-MM-DD string — imported by BookingWidget.tsx.
 */
export function today(): string {
  return new Date().toISOString().split('T')[0];
}

/**
 * FIX: Returns tomorrow's date as YYYY-MM-DD string — imported by BookingWidget.tsx.
 */
export function tomorrow(): string {
  const d = new Date();
  d.setDate(d.getDate() + 1);
  return d.toISOString().split('T')[0];
}

/**
 * FIX: Added getWhatsAppLink — imported by WhatsAppButton.tsx.
 * Was missing; only buildWhatsAppLink existed (different name).
 * Alias kept consistent with component import.
 */
export function getWhatsAppLink(phone: string, message?: string): string {
  const cleanPhone = phone.replace(/[^0-9]/g, '');
  const base = `https://wa.me/${cleanPhone}`;
  if (!message) return base;
  return `${base}?text=${encodeURIComponent(message)}`;
}

/**
 * Build a WhatsApp link with a pre-filled message (original name kept for compatibility)
 */
export function buildWhatsAppLink(phone: string, message: string): string {
  return getWhatsAppLink(phone, message);
}

/**
 * Truncate text to a max length
 */
export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).trim() + '...';
}

/**
 * Get initials from a full name
 */
export function getInitials(name: string): string {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

/**
 * Azerbaijani city list for dropdowns
 */
export const AZERBAIJAN_CITIES = [
  'Baku',
  'Ganja',
  'Sumqayit',
  'Mingachevir',
  'Nakhchivan',
  'Sheki',
  'Lankaran',
  'Shirvan',
  'Yevlakh',
  'Gabala',
  'Quba',
  'Qusar',
  'Ismayilli',
  'Zagatala',
] as const;

export type AzerbaijaniCity = (typeof AZERBAIJAN_CITIES)[number];
