import { useEffect, useRef, useState } from 'react';
import type { Destination } from '../types';
import { destinationDescriptions } from '../data/destinationDescriptions';
import { destinationExplore } from '../data/destinationExplore';
import { destinationDishes } from '../data/destinationDishes';
import { destinationBeverages } from '../data/destinationBeverages';
import { DESTINATION_LOCAL_CURRENCY } from '../utils/currencyTracker';
import {
  searchWikipediaArticleImage,
  type WikimediaImage,
} from '../utils/wikimediaImages';

export interface DestinationGuideProps {
  destination: Destination;
  showIntro?: boolean;
  showRecommendations?: boolean;
  onAddAdditionalCost?: (name: string, amountUsd?: number) => void;
}

function useNearViewport() {
  const ref = useRef<HTMLSpanElement>(null);
  const [isNearViewport, setIsNearViewport] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    if (!('IntersectionObserver' in window)) {
      setIsNearViewport(true);
      return;
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsNearViewport(true);
          observer.disconnect();
        }
      },
      { rootMargin: '400px 0px' },
    );
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  return { ref, isNearViewport };
}

function AttractionImage({
  attractionName,
  destinationName,
}: {
  attractionName: string;
  destinationName: string;
}) {
  const [image, setImage] = useState<WikimediaImage | null>();
  const { ref, isNearViewport } = useNearViewport();

  useEffect(() => {
    if (!isNearViewport) return;
    const controller = new AbortController();
    setImage(undefined);
    searchWikipediaArticleImage(
      `${attractionName} ${destinationName}`,
      controller.signal,
      attractionName,
    )
      .then((result) => setImage(result))
      .catch(() => {
        if (!controller.signal.aborted) setImage(null);
      });
    return () => controller.abort();
  }, [attractionName, destinationName, isNearViewport]);

  if (!image) {
    return (
      <span
        ref={ref}
        className="attraction-gallery__image attraction-gallery__image--placeholder"
        aria-hidden="true"
      />
    );
  }

  return (
    <a
      className="attraction-gallery__image"
      href={image.pageUrl}
      target="_blank"
      rel="noreferrer"
      aria-label={`View image source for ${attractionName}`}
    >
      <img
        src={image.url}
        alt={`${attractionName} in ${destinationName}`}
        loading="lazy"
        decoding="async"
      />
    </a>
  );
}

function GuideItemImage({
  name,
  destinationName,
  kind,
}: {
  name: string;
  destinationName: string;
  kind: 'food' | 'drink' | 'beer';
}) {
  const [image, setImage] = useState<WikimediaImage | null>();
  const { ref, isNearViewport } = useNearViewport();

  useEffect(() => {
    if (!isNearViewport) return;
    const controller = new AbortController();
    setImage(undefined);
    searchWikipediaArticleImage(
      `${name} ${kind} ${destinationName}`,
      controller.signal,
      name,
    )
      .then((result) => setImage(result))
      .catch(() => {
        if (!controller.signal.aborted) setImage(null);
      });
    return () => controller.abort();
  }, [destinationName, isNearViewport, kind, name]);

  if (!image) {
    return (
      <span
        ref={ref}
        className="dish-card__image dish-card__image--placeholder"
        aria-hidden="true"
      />
    );
  }

  return (
    <a
      className="dish-card__image"
      href={image.pageUrl}
      target="_blank"
      rel="noreferrer"
      aria-label={`View image source for ${name}`}
    >
      <img
        src={image.url}
        alt={`${name}, a ${kind} pick for ${destinationName}`}
        loading="lazy"
        decoding="async"
      />
    </a>
  );
}

export function DestinationGuide({
  destination,
  showIntro = true,
  showRecommendations = true,
  onAddAdditionalCost,
}: DestinationGuideProps) {
  const explore = destinationExplore[destination.id];
  const dishes = destinationDishes[destination.id] ?? [];
  const beverages = destinationBeverages[destination.id];
  const description =
    destinationDescriptions[destination.id] ??
    `${destination.name} is a popular destination in ${destination.country}.`;
  const localCurrency = DESTINATION_LOCAL_CURRENCY[destination.id] ?? 'USD';
  const attractions = explore?.topAttractions.slice(0, 5) ?? [];

  return (
    <div className="destination-guide">
      {showIntro && (
        <section className="planner-panel destination-guide__intro">
          <p className="cost-summary__eyebrow">Destination guide</p>
          <h2>
            {destination.name}
            <span>, {destination.country}</span>
          </h2>
          <p>{description}</p>
          <div className="explore-modal__facts">
            <div>
              <span>Daily budget baseline</span>
              <strong>${destination.dailyBudget} USD</strong>
            </div>
            <div>
              <span>Local currency</span>
              <strong>{localCurrency}</strong>
            </div>
            <div>
              <span>Best for</span>
              <strong>{explore?.bestFor ?? 'Flexible city travel'}</strong>
            </div>
          </div>
          {explore?.highlights && (
            <p className="planner-help">{explore.highlights}</p>
          )}
        </section>
      )}

      {showRecommendations && (
        <>
          <section className="planner-panel">
            <h2>Top 5 attractions</h2>
            {attractions.length > 0 ? (
              <ol className="explore-modal__attractions attraction-gallery">
                {attractions.map((attraction, index) => (
                  <li key={attraction.name}>
                    <AttractionImage
                      attractionName={attraction.name}
                      destinationName={destination.name}
                    />
                    <div className="attraction-gallery__content">
                      <span className="explore-modal__rank">{index + 1}</span>
                      <div>
                        <strong>{attraction.name}</strong>
                        <p>{attraction.blurb}</p>
                        {onAddAdditionalCost && (
                          <button
                            type="button"
                            className="recommendation-add-button"
                            onClick={() =>
                              onAddAdditionalCost(
                                `${attraction.name} admission`,
                              )
                            }
                          >
                            Add to additional cost
                          </button>
                        )}
                      </div>
                    </div>
                  </li>
                ))}
              </ol>
            ) : (
              <p className="planner-help">Attraction details coming soon.</p>
            )}
          </section>

          <section className="planner-panel">
            <h2>Must try</h2>
            <p className="planner-help">
              Local dishes and drinks with typical serving prices for budgeting.
              Alcohol laws and availability vary by destination.
            </p>
            <div className="dish-grid">
              {dishes.map((dish) => (
                <article key={dish.name} className="dish-card">
                  <GuideItemImage
                    name={dish.name}
                    destinationName={destination.name}
                    kind="food"
                  />
                  <div className="dish-card__body">
                    <p className="cost-summary__eyebrow">Local dish</p>
                    <h3>{dish.name}</h3>
                    <p>{dish.blurb}</p>
                    <strong>Avg. ${dish.averagePriceUsd.toFixed(2)} USD</strong>
                    {onAddAdditionalCost && (
                      <button
                        type="button"
                        className="recommendation-add-button"
                        onClick={() =>
                          onAddAdditionalCost(
                            dish.name,
                            dish.averagePriceUsd,
                          )
                        }
                      >
                        Add to additional cost
                      </button>
                    )}
                  </div>
                </article>
              ))}
              {beverages &&
                ([
                  ['Local drink', beverages.localDrink, 'drink'],
                  ['Beer pick', beverages.beer, 'beer'],
                ] as const).map(([label, beverage, kind]) => (
                  <article key={`${kind}-${beverage.name}`} className="dish-card">
                    <GuideItemImage
                      name={beverage.name}
                      destinationName={destination.name}
                      kind={kind}
                    />
                    <div className="dish-card__body">
                      <p className="cost-summary__eyebrow">{label}</p>
                      <h3>{beverage.name}</h3>
                      <p>{beverage.blurb}</p>
                      <strong>
                        Avg. ${beverage.averagePriceUsd.toFixed(2)} USD
                      </strong>
                      {onAddAdditionalCost && (
                        <button
                          type="button"
                          className="recommendation-add-button"
                          onClick={() =>
                            onAddAdditionalCost(
                              beverage.name,
                              beverage.averagePriceUsd,
                            )
                          }
                        >
                          Add to additional cost
                        </button>
                      )}
                    </div>
                  </article>
                ))}
            </div>
          </section>
        </>
      )}
    </div>
  );
}

export default DestinationGuide;
