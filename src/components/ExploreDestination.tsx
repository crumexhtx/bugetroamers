import { useEffect, useId, useRef } from 'react';
import type { Destination } from '../types';
import { destinationDescriptions } from '../data/destinationDescriptions';
import { destinationExplore } from '../data/destinationExplore';
import { DESTINATION_LOCAL_CURRENCY } from '../utils/currencyTracker';

export interface ExploreDestinationProps {
  destination: Destination;
  open: boolean;
  onClose: () => void;
}

export function ExploreDestination({
  destination,
  open,
  onClose,
}: ExploreDestinationProps) {
  const titleId = useId();
  const closeRef = useRef<HTMLButtonElement | null>(null);
  const explore = destinationExplore[destination.id];
  const description =
    destinationDescriptions[destination.id] ??
    `${destination.name} is a popular destination in ${destination.country}.`;
  const localCurrency = DESTINATION_LOCAL_CURRENCY[destination.id] ?? 'USD';

  useEffect(() => {
    if (!open) return;
    closeRef.current?.focus();
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKeyDown);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [open, onClose]);

  if (!open) return null;

  const attractions = explore?.topAttractions.slice(0, 5) ?? [];

  return (
    <div
      className="explore-modal"
      role="presentation"
      onClick={onClose}
    >
      <div
        className="explore-modal__dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        onClick={(event) => event.stopPropagation()}
      >
        <header className="explore-modal__header">
          <div>
            <p className="cost-summary__eyebrow">Explore destination</p>
            <h2 id={titleId}>
              {destination.name}
              <span>, {destination.country}</span>
            </h2>
          </div>
          <button
            ref={closeRef}
            type="button"
            className="ghost-button"
            onClick={onClose}
          >
            Close
          </button>
        </header>

        <div className="explore-modal__body">
          <p className="explore-modal__lead">{description}</p>

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
            <p className="explore-modal__highlights">{explore.highlights}</p>
          )}

          <h3>Top 5 attractions</h3>
          {attractions.length > 0 ? (
            <ol className="explore-modal__attractions">
              {attractions.map((attraction, index) => (
                <li key={attraction.name}>
                  <span className="explore-modal__rank">{index + 1}</span>
                  <div>
                    <strong>{attraction.name}</strong>
                    <p>{attraction.blurb}</p>
                  </div>
                </li>
              ))}
            </ol>
          ) : (
            <p className="planner-help">
              Attraction details for this destination are coming soon.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export default ExploreDestination;
