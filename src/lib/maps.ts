/**
 * Google Maps helpers for AvtoGo
 */

export function getGoogleMapsEmbedUrl(lat: number, lng: number, zoom = 14): string {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
  if (!apiKey) return '';
  return `https://www.google.com/maps/embed/v1/place?key=${apiKey}&q=${lat},${lng}&zoom=${zoom}`;
}

export function getGoogleMapsDirectionsUrl(lat: number, lng: number): string {
  return `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;
}

export function getStaticMapUrl(lat: number, lng: number, width = 600, height = 300): string {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
  if (!apiKey) return '';
  return `https://maps.googleapis.com/maps/api/staticmap?center=${lat},${lng}&zoom=14&size=${width}x${height}&maptype=roadmap&markers=color:green%7C${lat},${lng}&key=${apiKey}`;
}

/**
 * Baku coordinates (default map center)
 */
export const BAKU_COORDS = {
  lat: 40.4093,
  lng: 49.8671,
};
