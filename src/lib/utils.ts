/**
 * Format a price in AZN (Azerbaijani Manat)
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
 * Format a date string to a readable local format
 */
export function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('en-AZ', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

/**
 * Calculate number of days between two date strings
 */
export function daysBetween(start: string, end: string): number {
  const s = new Date(start).getTime();
  const e = new Date(end).getTime();
  return Math.max(1, Math.ceil((e - s) / (1000 * 60 * 60 * 24)));
}

/**
 * Calculate total booking price
 */
export function calcTotalPrice(pricePerDay: number, startDate: string, endDate: string): number {
  return pricePerDay * daysBetween(startDate, endDate);
}

/**
 * Capitalize first letter
 */
export function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

/**
 * Get today's date as YYYY-MM-DD string
 */
export function today(): string {
  return new Date().toISOString().split('T')[0];
}

/**
 * Get tomorrow's date as YYYY-MM-DD string
 */
export function tomorrow(): string {
  const d = new Date();
  d.setDate(d.getDate() + 1);
  return d.toISOString().split('T')[0];
}
