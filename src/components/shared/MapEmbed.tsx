interface MapEmbedProps {
  location: string;
  lat?: number | null;
  lng?: number | null;
  height?: number;
}

export function MapEmbed({ location, lat, lng, height = 300 }: MapEmbedProps) {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

  if (!apiKey) {
    return (
      <div
        className="rounded-xl bg-gray-100 border border-gray-200 flex items-center justify-center text-gray-400 text-sm"
        style={{ height }}
      >
        <div className="text-center">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="mx-auto mb-2">
            <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" />
            <circle cx="12" cy="9" r="2.5" />
          </svg>
          <p>{location}</p>
          <p className="text-xs mt-1">Map unavailable</p>
        </div>
      </div>
    );
  }

  const query = lat && lng ? `${lat},${lng}` : encodeURIComponent(location + ', Azerbaijan');
  const src = `https://www.google.com/maps/embed/v1/place?key=${apiKey}&q=${query}&zoom=14`;

  return (
    <div className="rounded-xl overflow-hidden border border-gray-200" style={{ height }}>
      <iframe
        width="100%"
        height="100%"
        style={{ border: 0 }}
        loading="lazy"
        allowFullScreen
        referrerPolicy="no-referrer-when-downgrade"
        src={src}
        title={`Map showing location: ${location}`}
      />
    </div>
  );
}

export default MapEmbed;
