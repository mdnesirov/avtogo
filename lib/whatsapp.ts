export function buildWhatsAppLink(phone: string, message: string): string {
  const cleaned = phone.replace(/[^\d+]/g, '')
  const encoded = encodeURIComponent(message)
  return `https://wa.me/${cleaned}?text=${encoded}`
}

export function carInquiryMessage(carName: string, startDate?: string, endDate?: string): string {
  const dates = startDate && endDate
    ? ` from ${startDate} to ${endDate}`
    : ''
  return `Hi! I'm interested in renting the ${carName}${dates}. Is it available?`
}
