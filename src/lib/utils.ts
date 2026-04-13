import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { differenceInDays, format, parseISO } from 'date-fns';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPrice(amount: number, currency = 'AZN'): string {
  return `${amount.toFixed(0)} ${currency}`;
}

export function formatDate(dateStr: string): string {
  return format(parseISO(dateStr), 'MMM d, yyyy');
}

export function calcTotalPrice(
  pricePerDay: number,
  startDate: string,
  endDate: string
): number {
  const days = differenceInDays(parseISO(endDate), parseISO(startDate));
  return Math.max(1, days) * pricePerDay;
}

export function calcDays(startDate: string, endDate: string): number {
  return Math.max(1, differenceInDays(parseISO(endDate), parseISO(startDate)));
}

export function buildWhatsAppUrl(phone: string, message: string): string {
  const clean = phone.replace(/\D/g, '');
  return `https://wa.me/${clean}?text=${encodeURIComponent(message)}`;
}

export function capitalise(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}
