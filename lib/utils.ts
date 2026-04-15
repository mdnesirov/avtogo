import { clsx, type ClassValue } from 'clsx'

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs)
}

export function formatPrice(amount: number, currency = 'AZN') {
  return new Intl.NumberFormat('az-AZ', {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
  }).format(amount)
}

export function calculateNights(startDate: string, endDate: string): number {
  const start = new Date(startDate)
  const end   = new Date(endDate)
  const diff  = end.getTime() - start.getTime()
  return Math.max(1, Math.ceil(diff / (1000 * 60 * 60 * 24)))
}

export function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('en-GB', {
    day: '2-digit', month: 'short', year: 'numeric',
  })
}

export function getInitials(name: string): string {
  return name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

export function differenceInCalendarDays(dateLeft: Date, dateRight: Date): number {
  const startOfDayLeft  = new Date(dateLeft.getFullYear(), dateLeft.getMonth(), dateLeft.getDate())
  const startOfDayRight = new Date(dateRight.getFullYear(), dateRight.getMonth(), dateRight.getDate())
  const diff = startOfDayLeft.getTime() - startOfDayRight.getTime()
  return Math.round(diff / (1000 * 60 * 60 * 24))
}

export function getWhatsAppLink(phone: string, message?: string): string {
  const cleaned = phone.replace(/[^\d+]/g, '')
  const base    = `https://wa.me/${cleaned}`
  return message ? `${base}?text=${encodeURIComponent(message)}` : base
}
