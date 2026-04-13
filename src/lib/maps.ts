export function getMapEmbedUrl(location: string): string {
  const encoded = encodeURIComponent(location + ', Azerbaijan');
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
  return `https://www.google.com/maps/embed/v1/place?key=${apiKey}&q=${encoded}`;
}

export function getMapsLink(location: string): string {
  const encoded = encodeURIComponent(location + ', Azerbaijan');
  return `https://www.google.com/maps/search/?api=1&query=${encoded}`;
}
