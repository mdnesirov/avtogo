export function getMapEmbedUrl(address: string): string {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY
  return `https://www.google.com/maps/embed/v1/place?key=${apiKey}&q=${encodeURIComponent(address)}`
}

export function getMapsLink(address: string): string {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`
}
