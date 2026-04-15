interface MapEmbedProps {
  location: string;
}

export default function MapEmbed({ location }: MapEmbedProps) {
  if (!location?.trim()) {
    return (
      <div className="rounded-xl overflow-hidden border border-gray-100 p-4 bg-gray-50">
        <p className="text-sm text-gray-600">Pickup location is not available.</p>
      </div>
    );
  }

  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

  if (!apiKey) {
    const message = process.env.NODE_ENV === 'development'
      ? 'Map is unavailable right now. Please set NEXT_PUBLIC_GOOGLE_MAPS_API_KEY.'
      : 'Map is temporarily unavailable.';

    return (
      <div className="rounded-xl overflow-hidden border border-gray-100 p-4 bg-gray-50">
        <p className="text-sm text-gray-600">{message}</p>
      </div>
    );
  }

  const embedUrl = `https://www.google.com/maps/embed/v1/place?key=${apiKey}&q=${encodeURIComponent(location)}&zoom=14`;
  const mapsLink = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(location)}`;

  return (
    <div className="rounded-xl overflow-hidden border border-gray-100">
      <iframe
        src={embedUrl}
        width="100%"
        height="240"
        style={{ border: 0 }}
        allowFullScreen
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        title={`Map of ${location}`}
      />
      <div className="p-3 bg-gray-50 flex items-center justify-between">
        <span className="text-sm text-gray-600">{location}, Azerbaijan</span>
        <a
          href={mapsLink}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm text-green-600 hover:text-green-700 font-medium"
        >
          Open in Maps →
        </a>
      </div>
    </div>
  );
}
