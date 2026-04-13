export function getStaticMapUrl({
  lat,
  lng,
  zoom = 13,
  width = 600,
  height = 300,
}: {
  lat: number
  lng: number
  zoom?: number
  width?: number
  height?: number
}): string {
  const key = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY
  return `https://maps.googleapis.com/maps/api/staticmap?center=${lat},${lng}&zoom=${zoom}&size=${width}x${height}&markers=color:green%7C${lat},${lng}&key=${key}`
}

export function getMapsEmbedUrl(location: string): string {
  const key = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY
  const encoded = encodeURIComponent(location)
  return `https://www.google.com/maps/embed/v1/place?key=${key}&q=${encoded}`
}

export function getMapsDirectionsUrl(location: string): string {
  const encoded = encodeURIComponent(location)
  return `https://www.google.com/maps/dir/?api=1&destination=${encoded}`
}
