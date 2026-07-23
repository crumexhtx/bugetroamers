import { useEffect, useState } from 'react';
import type { Destination } from '../types';
import { culturalIcons } from '../data/culturalIcons';

interface FeaturedDestinationsProps {
  destinations: Destination[];
  onSelect: (destinationId: string) => void;
}

export function FeaturedDestinations({
  destinations,
  onSelect,
}: FeaturedDestinationsProps) {
  const [images, setImages] = useState<Record<string, string>>({});
  const imageQueryKey = destinations
    .map(
      (destination) =>
        `${destination.id}:${culturalIcons[destination.id]?.imageUrl ?? culturalIcons[destination.id]?.title ?? destination.name}`,
    )
    .join('|');

  useEffect(() => {
    const controller = new AbortController();

    Promise.all(
      destinations.map(async (destination) => {
        const culturalIcon = culturalIcons[destination.id];
        if (culturalIcon?.imageUrl) {
          return [destination.id, culturalIcon.imageUrl] as const;
        }
        const title = culturalIcon?.title ?? destination.name;
        try {
          const response = await fetch(
            `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(title)}`,
            { signal: controller.signal },
          );
          if (!response.ok) return null;
          const result = (await response.json()) as {
            thumbnail?: { source: string };
            originalimage?: { source: string };
          };
          const image = result.thumbnail?.source ?? result.originalimage?.source;
          return image ? ([destination.id, image] as const) : null;
        } catch {
          return null;
        }
      }),
    ).then((entries) => {
      if (controller.signal.aborted) return;
      setImages(
        Object.fromEntries(
          entries.filter(
            (entry): entry is readonly [string, string] => entry !== null,
          ),
        ),
      );
    });

    return () => controller.abort();
  }, [destinations, imageQueryKey]);

  return (
    <section className="featured-destinations" aria-labelledby="featured-heading">
      <div className="featured-destinations__header">
        <h2 id="featured-heading">Popular places</h2>
        <p>Choose a featured destination or use the target selector below.</p>
      </div>
      <div className="featured-destinations__grid">
        {destinations.map((destination) => (
          <button
            key={destination.id}
            type="button"
            className="featured-destination"
            onClick={() => onSelect(destination.id)}
          >
            {images[destination.id] ? (
              <img
                src={images[destination.id]}
                alt=""
                aria-hidden="true"
              />
            ) : (
              <span className="featured-destination__placeholder" />
            )}
            <span className="featured-destination__label">
              <strong>{destination.name}</strong>
              <small>{destination.country}</small>
            </span>
          </button>
        ))}
      </div>
    </section>
  );
}

export default FeaturedDestinations;
