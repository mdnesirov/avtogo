import { type ClassValue, clsx } from 'clsx';

// Simple className merger (no clsx dependency needed, but included for safety)
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
 * Calculate total rental price
 */
export function calculateTotalPrice(pricePerDay: number, startDate: string, endDate: string): number {
  const days = calculateDays(startDate, endDate);
  return pricePerDay * days;
}

/**
 * Build a WhatsApp link with a pre-filled message
 */
export function buildWhatsAppLink(phone: string, message: string): string {
  const cleanPhone = phone.replace(/[^0-9]/g, '');
  const encodedMessage = encodeURIComponent(message);
  return `https://wa.me/${cleanPhone}?text=${encodedMessage}`;
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
