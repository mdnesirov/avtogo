/**
 * Google Maps helpers for AvtoGo
 */

/**
 * FIX: Added getMapEmbedUrl — imported by MapEmbed.tsx (src/components/shared/MapEmbed.tsx).
 * Was missing; file only had lat/lng-based helpers but MapEmbed passes a string address.
 * This version accepts a plain address string and uses the Places embed API.
 */
export function getMapEmbedUrl(address: string): string {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
  if (!apiKey) return '';
  return `https://www.google.com/maps/embed/v1/place?key=${apiKey}&q=${encodeURIComponent(address)}`;
}

/**
 * FIX: Added getMapsLink — imported by MapEmbed.tsx.
 * Was missing; returns a shareable Google Maps search URL for a given address string.
 */
export function getMapsLink(address: string): string {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;
}

// Original lat/lng helpers kept for any other usage in the codebase
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
