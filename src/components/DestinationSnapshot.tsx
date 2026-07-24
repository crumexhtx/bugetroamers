import { useEffect, useState } from 'react';
import type { Destination } from '../types';
import { culturalIcons } from '../data/culturalIcons';
import { destinationExplore } from '../data/destinationExplore';
import {
  searchWikipediaArticleImage,
  searchWikipediaSummary,
  type WikimediaImage,
} from '../utils/wikimediaImages';

interface DestinationSnapshotProps {
  destination: Destination;
  forecastDays?: 1 | 5;
}

interface ForecastDay {
  date: string;
  maxF: number | null;
  minF: number | null;
  weatherCode: number | null;
}

interface Snapshot {
  images: WikimediaImage[];
  temperatureF: number | null;
  weatherCode: number | null;
  forecast: ForecastDay[];
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

function normalizeImageText(value: string): string {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '');
}

function imageFileName(url: string): string {
  try {
    return normalizeImageText(
      decodeURIComponent(new URL(url).pathname.split('/').at(-1) ?? '')
        .replace(/^\d+px-/, ''),
    );
  } catch {
    return normalizeImageText(url);
  }
}

function isDuplicateImage(
  candidate: WikimediaImage,
  existing: WikimediaImage,
): boolean {
  const candidatePage = candidate.pageUrl.split(/[?#]/)[0].toLowerCase();
  const existingPage = existing.pageUrl.split(/[?#]/)[0].toLowerCase();
  return (
    candidatePage === existingPage ||
    imageFileName(candidate.url) === imageFileName(existing.url) ||
    normalizeImageText(candidate.alt) === normalizeImageText(existing.alt)
  );
}

export function DestinationSnapshot({
  destination,
  forecastDays = 1,
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

    const weatherUrl =
      `https://api.open-meteo.com/v1/forecast?latitude=${destination.lat}` +
      `&longitude=${destination.lng}` +
      '&current=temperature_2m,weather_code' +
      (forecastDays === 5
        ? '&daily=temperature_2m_max,temperature_2m_min,weather_code&forecast_days=5'
        : '') +
      '&temperature_unit=fahrenheit&timezone=auto';

    const wikipediaRequest =
      searchWikipediaSummary(wikipediaTitle, controller.signal).catch(() => null);
    const weatherRequest =
      fetch(weatherUrl, { signal: controller.signal }).then((response) => {
        if (!response.ok) throw new Error('Weather request failed');
        return response.json() as Promise<{
          current?: { temperature_2m?: number; weather_code?: number };
          daily?: {
            time?: string[];
            temperature_2m_max?: number[];
            temperature_2m_min?: number[];
            weather_code?: number[];
          };
        }>;
      }).catch(() => null);
    const attractionNames =
      destinationExplore[destination.id]?.topAttractions.map(
        (attraction) => attraction.name,
      ) ?? [];
    const galleryRequest = Promise.all(
      [
        {
          query: `${destination.name} ${destination.country}`,
          subject: destination.name,
        },
        ...attractionNames.map(
          (attraction) => ({
            query: `${attraction} ${destination.name}`,
            subject: attraction,
          }),
        ),
      ].map(({ query, subject }) =>
        searchWikipediaArticleImage(
          query,
          controller.signal,
          subject,
        ).catch(() => null),
      ),
    ).then((images) =>
      images.filter((image): image is WikimediaImage => image !== null),
    );

    Promise.all([wikipediaRequest, weatherRequest, galleryRequest])
      .then(([wikipedia, weather, gallery]) => {
        if (controller.signal.aborted) return;
        if (!wikipedia && !weather && gallery.length === 0) {
          setFailed(true);
          return;
        }
        const primaryUrl =
          culturalIcon?.imageUrl ??
          wikipedia?.thumbnail?.source ??
          wikipedia?.originalimage?.source;
        const images: WikimediaImage[] = primaryUrl
          ? [{
              url: primaryUrl,
              pageUrl:
                culturalIcon?.imagePageUrl ??
                wikipedia?.content_urls?.desktop?.page ??
                primaryUrl,
              alt: culturalIcon?.label ?? destination.name,
            }]
          : [];
        gallery.forEach((image) => {
          if (
            images.length < 4 &&
            !images.some((candidate) => isDuplicateImage(image, candidate))
          ) {
            images.push(image);
          }
        });
        setSnapshot({
          images,
          temperatureF: weather?.current?.temperature_2m ?? null,
          weatherCode: weather?.current?.weather_code ?? null,
          forecast: (weather?.daily?.time ?? []).slice(0, 5).map((date, index) => ({
            date,
            maxF: weather?.daily?.temperature_2m_max?.[index] ?? null,
            minF: weather?.daily?.temperature_2m_min?.[index] ?? null,
            weatherCode: weather?.daily?.weather_code?.[index] ?? null,
          })),
        });
      })
      .catch((error: unknown) => {
        if (error instanceof DOMException && error.name === 'AbortError') return;
        setFailed(true);
      });

    return () => controller.abort();
  }, [culturalIcon, destination, forecastDays, wikipediaTitle]);

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
      {snapshot.images.length > 0 && (
        <div className="destination-snapshot__gallery">
          {snapshot.images.map((image, index) => (
            <a
              key={image.url}
              href={image.pageUrl}
              target="_blank"
              rel="noreferrer"
              aria-label={`View source for ${destination.name} image ${index + 1}`}
            >
              <img
                src={image.url}
                alt={`${image.alt}, ${destination.name}, ${destination.country}`}
                loading="lazy"
                decoding="async"
              />
            </a>
          ))}
        </div>
      )}
      {snapshot.images.length > 0 && culturalIcon && (
        <small className="destination-snapshot__caption">
          Featuring {culturalIcon.label} and city landmarks
        </small>
      )}
      {forecastDays === 5 ? (
        <div
          className="destination-snapshot__forecast"
          aria-label={`Five-day weather forecast for ${destination.name}`}
          aria-live="polite"
        >
          {snapshot.forecast.map((day) => (
            <div key={day.date}>
              <span>
                {new Intl.DateTimeFormat('en-US', {
                  weekday: 'short',
                  timeZone: 'UTC',
                }).format(new Date(`${day.date}T12:00:00Z`))}
              </span>
              <strong>
                {day.maxF === null ? '—' : `${Math.round(day.maxF)}°`}
              </strong>
              <small>
                Low {day.minF === null ? '—' : `${Math.round(day.minF)}°`}
              </small>
              <small>{describeWeather(day.weatherCode)}</small>
            </div>
          ))}
          {snapshot.forecast.length === 0 && (
            <p className="destination-snapshot__status">
              Five-day forecast is temporarily unavailable.
            </p>
          )}
        </div>
      ) : (
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
      )}
    </div>
  );
}

export default DestinationSnapshot;
