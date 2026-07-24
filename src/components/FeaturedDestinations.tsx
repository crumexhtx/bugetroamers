import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import type { Destination } from '../types';
import { culturalIcons } from '../data/culturalIcons';
import { searchWikipediaSummary } from '../utils/wikimediaImages';

interface FeaturedDestinationsProps {
  destinations: Destination[];
  onSelect?: (destinationId: string) => void;
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
          const summary = await searchWikipediaSummary(
            title,
            controller.signal,
          );
          const imageUrl =
            summary?.thumbnail?.source ?? summary?.originalimage?.source;
          return imageUrl
            ? ([destination.id, imageUrl] as const)
            : null;
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
        <h2 id="featured-heading">Popular city guides</h2>
        <p>Open a dedicated city page with calculator, attractions, and food picks.</p>
      </div>
      <div className="featured-destinations__grid">
        {destinations.map((destination) => {
          const content = (
            <>
              {images[destination.id] ? (
                <img
                  src={images[destination.id]}
                  alt=""
                  aria-hidden="true"
                  loading="lazy"
                  decoding="async"
                />
              ) : (
                <span className="featured-destination__placeholder" />
              )}
              <span className="featured-destination__label">
                <strong>{destination.name}</strong>
                <small>{destination.country}</small>
              </span>
            </>
          );

          if (onSelect) {
            return (
              <button
                key={destination.id}
                type="button"
                className="featured-destination"
                onClick={() => onSelect(destination.id)}
              >
                {content}
              </button>
            );
          }

          return (
            <Link
              key={destination.id}
              className="featured-destination"
              to={`/destinations/${destination.id}`}
            >
              {content}
            </Link>
          );
        })}
      </div>
    </section>
  );
}

export default FeaturedDestinations;
