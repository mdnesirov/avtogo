interface MapEmbedProps {
  location: string;
}

export default function MapEmbed({ location }: MapEmbedProps) {
  const normalizedLocation = location?.trim();
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
  const mapsLink = normalizedLocation
    ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(normalizedLocation)}`
    : '';

  if (!normalizedLocation) {
    return (
      <div className="rounded-xl overflow-hidden border border-gray-100 p-4 bg-gray-50">
        <p className="text-sm text-gray-600">Pickup location unavailable</p>
      </div>
    );
  }

  if (!apiKey) {
    const unavailableMessage =
      process.env.NODE_ENV === 'production'
        ? 'Map is currently unavailable.'
        : 'Map is unavailable: missing NEXT_PUBLIC_GOOGLE_MAPS_API_KEY.';

    return (
      <div className="rounded-xl overflow-hidden border border-gray-100 p-4 bg-gray-50">
        <p className="text-sm text-gray-600">{unavailableMessage}</p>
      </div>
    );
  }

  const embedUrl = `https://www.google.com/maps/embed/v1/place?key=${apiKey}&q=${encodeURIComponent(normalizedLocation)}&zoom=14`;

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
        title={`Map of ${normalizedLocation}`}
      />
      <div className="p-3 bg-gray-50 flex items-center justify-between">
        <span className="text-sm text-gray-600">{normalizedLocation}, Azerbaijan</span>
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
