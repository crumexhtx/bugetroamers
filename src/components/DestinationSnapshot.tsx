import { useEffect, useState } from 'react';
import type { Destination } from '../types';
import { culturalIcons } from '../data/culturalIcons';

interface DestinationSnapshotProps {
  destination: Destination;
}

interface Snapshot {
  imageUrl: string | null;
  imagePageUrl: string | null;
  temperatureF: number | null;
  weatherCode: number | null;
}

function describeWeather(code: number | null): string {
  if (code === null) return '';
  if (code === 0) return 'Clear';
  if (code <= 3) return 'Partly cloudy';
  if (code <= 48) return 'Foggy';
  if (code <= 67) return 'Rain';
  if (code <= 77) return 'Snow';
  if (code <= 82) return 'Rain showers';
  return 'Thunderstorms';
}

export function DestinationSnapshot({
  destination,
}: DestinationSnapshotProps) {
  const [snapshot, setSnapshot] = useState<Snapshot | null>(null);
  const [failed, setFailed] = useState(false);
  const culturalIcon = culturalIcons[destination.id];
  const wikipediaTitle =
    culturalIcon?.title ?? destination.name;

  useEffect(() => {
    const controller = new AbortController();
    setSnapshot(null);
    setFailed(false);

    const wikipediaUrl =
      `https://en.wikipedia.org/api/rest_v1/page/summary/` +
      encodeURIComponent(wikipediaTitle);
    const weatherUrl =
      `https://api.open-meteo.com/v1/forecast?latitude=${destination.lat}` +
      `&longitude=${destination.lng}` +
      '&current=temperature_2m,weather_code&temperature_unit=fahrenheit&timezone=auto';

    const wikipediaRequest =
      fetch(wikipediaUrl, { signal: controller.signal }).then((response) => {
        if (!response.ok) throw new Error('Image request failed');
        return response.json() as Promise<{
          thumbnail?: { source: string };
          originalimage?: { source: string };
          content_urls?: { desktop?: { page?: string } };
        }>;
      }).catch(() => null);
    const weatherRequest =
      fetch(weatherUrl, { signal: controller.signal }).then((response) => {
        if (!response.ok) throw new Error('Weather request failed');
        return response.json() as Promise<{
          current?: { temperature_2m?: number; weather_code?: number };
        }>;
      }).catch(() => null);

    Promise.all([wikipediaRequest, weatherRequest])
      .then(([wikipedia, weather]) => {
        if (controller.signal.aborted) return;
        if (!wikipedia && !weather) {
          setFailed(true);
          return;
        }
        setSnapshot({
          imageUrl:
            culturalIcon?.imageUrl ??
            wikipedia?.thumbnail?.source ??
            wikipedia?.originalimage?.source ??
            null,
          imagePageUrl:
            culturalIcon?.imagePageUrl ??
            wikipedia?.content_urls?.desktop?.page ??
            null,
          temperatureF: weather?.current?.temperature_2m ?? null,
          weatherCode: weather?.current?.weather_code ?? null,
        });
      })
      .catch((error: unknown) => {
        if (error instanceof DOMException && error.name === 'AbortError') return;
        setFailed(true);
      });

    return () => controller.abort();
  }, [culturalIcon, destination, wikipediaTitle]);

  if (failed) {
    return (
      <p className="destination-snapshot__status">
        Live image and weather are temporarily unavailable.
      </p>
    );
  }

  if (!snapshot) {
    return (
      <p className="destination-snapshot__status">
        Loading image and current weather…
      </p>
    );
  }

  return (
    <div className="destination-snapshot">
      {snapshot.imageUrl && (
        <a
          href={snapshot.imagePageUrl ?? snapshot.imageUrl}
          target="_blank"
          rel="noreferrer"
          aria-label={`View image source for ${destination.name}`}
        >
          <img
            src={snapshot.imageUrl}
            alt={`${culturalIcon?.label ?? destination.name}, ${destination.country}`}
          />
        </a>
      )}
      {snapshot.imageUrl && culturalIcon && (
        <small className="destination-snapshot__caption">
          Cultural icon: {culturalIcon.label}
        </small>
      )}
      <p className="destination-snapshot__weather" aria-live="polite">
        <span>Current temperature</span>
        <strong>
          {snapshot.temperatureF === null
            ? 'Unavailable'
            : `${Math.round(snapshot.temperatureF)}°F`}
        </strong>
        {snapshot.weatherCode !== null && (
          <small>{describeWeather(snapshot.weatherCode)}</small>
        )}
      </p>
    </div>
  );
}

export default DestinationSnapshot;
